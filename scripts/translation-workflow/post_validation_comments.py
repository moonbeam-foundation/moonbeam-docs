#!/usr/bin/env python3
"""Post per-file validation summaries as PR review comments."""
from __future__ import annotations

import argparse
import json
import os
from collections import defaultdict
from pathlib import Path
from typing import Any
from urllib import request

API_BASE = "https://api.github.com"
QUIET = os.environ.get("ROSE_QUIET", "").strip().lower() in {"1", "true", "yes", "on"}


def _load_report(path: Path) -> dict[str, Any]:
    if not path.exists():
        raise FileNotFoundError(f"Validation report not found: {path}")
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def _group_issues(report: dict[str, Any]) -> dict[str, list[dict[str, Any]]]:
    grouped: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for issue in report.get("issues", []):
        target = issue.get("target_path") or issue.get("source_path")
        if not target:
            continue
        grouped[target].append(issue)
    return grouped


def _format_comment(path: str, issues: list[dict[str, Any]]) -> tuple[str, int]:
    header = f"Translation validation summary for `{path}`:\n"
    lines = []
    first_line = 1
    for issue in issues:
        line = issue.get("line") or issue.get("details", {}).get("line")
        if line and isinstance(line, int):
            first_line = line
        issue_type = issue.get("issue_type", "unknown")
        message = issue.get("message", "")
        count_summary = issue.get("details", {}).get("summary")
        details = issue.get("details", {})
        english = details.get("english")
        translated = details.get("translated")
        extra = []
        if count_summary:
            extra.append(count_summary)
        elif english is not None and translated is not None:
            extra.append(f"diff:{abs(translated-english)} | translated:{translated} | english:{english}")
        line_info = f"line {line}" if line else "line ?"
        extra_text = f" ({'; '.join(extra)})" if extra else ""
        lines.append(f"- `{issue_type}` {line_info}: {message}{extra_text}")
    body = header + "\n".join(lines)
    return body, first_line


def _post_comment(repo: str, pr: int, token: str, commit: str, path: str, body: str, line: int) -> None:
    url = f"{API_BASE}/repos/{repo}/pulls/{pr}/comments"
    payload = {
        "body": body,
        "commit_id": commit,
        "path": path,
        "side": "RIGHT",
        "line": line or 1,
    }
    data = json.dumps(payload).encode("utf-8")
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
    }
    req = request.Request(url, data=data, headers=headers, method="POST")
    with request.urlopen(req) as resp:  # noqa: S310
        if resp.status not in (200, 201):
            raise RuntimeError(f"GitHub API responded with {resp.status}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--report", type=Path, required=True)
    parser.add_argument("--repo", required=True)
    parser.add_argument("--pull-request", type=int, required=True)
    parser.add_argument("--token", required=True)
    parser.add_argument("--commit", required=True)
    args = parser.parse_args()

    report = _load_report(args.report)
    issues = report.get("issues", [])
    if not issues:
        if not QUIET:
            print("No validation issues to report; skipping PR comments.")
        return 0

    grouped = _group_issues(report)
    for path, file_issues in grouped.items():
        if not file_issues:
            continue
        body, line = _format_comment(path, file_issues)
        try:
            _post_comment(args.repo, args.pull_request, args.token, args.commit, path, body, line)
            if not QUIET:
                print(f"Posted validation summary for {path}")
        except Exception as exc:  # noqa: BLE001
            if not QUIET:
                print(f"Failed to post comment for {path}: {exc}")
    return 0


if __name__ == "__main__":  # pragma: no cover
    raise SystemExit(main())
