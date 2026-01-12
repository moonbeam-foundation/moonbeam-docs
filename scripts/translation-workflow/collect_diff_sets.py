#!/usr/bin/env python3
"""Collect start/end ranges for changed Markdown blocks between git refs.

The output JSON is saved next to the translation payload so Rose can pass the
exact `{start, end}` windows downstream in step 7 of the workflow.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

from paths import REPO_ROOT, repo_relative_str

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT = ROOT / "translations" / "changed_segments.json"
GIT_ROOT = REPO_ROOT
HUNK_RE = re.compile(r"^@@ -(?P<old>\d+(?:,\d+)?) \+(?P<new>\d+(?:,\d+)?) @@")
QUIET = os.environ.get("ROSE_QUIET", "").strip().lower() in {"1", "true", "yes", "on"}


def _parse_range(value: str) -> tuple[int, int]:
    start_str, _, length_str = value.partition(",")
    start = int(start_str)
    length = int(length_str) if length_str else 1
    if length == 0:
        return start, start - 1  # empty range
    end = start + length - 1
    return start, end


@dataclass
class Range:
    start: int
    end: int

    @property
    def as_dict(self) -> dict[str, int]:
        return {"start": self.start, "end": self.end}

    @property
    def is_empty(self) -> bool:
        return self.end < self.start


def _to_git_relative(path: str) -> str:
    return repo_relative_str(path)


def _run_git_diff(base: str, head: str, paths: Iterable[str]) -> str:
    cmd = ["git", "-C", str(GIT_ROOT), "diff", f"{base}..{head}", "--unified=0"]
    cmd.extend(_to_git_relative(path) for path in paths)
    try:
        proc = subprocess.run(cmd, capture_output=True, text=True, check=True)
    except subprocess.CalledProcessError as exc:  # pragma: no cover - passthrough
        raise SystemExit(exc.stderr or exc.stdout)
    return proc.stdout


def _collect_sets(diff_text: str) -> dict[str, list[dict[str, object]]]:
    current_file: str | None = None
    data: dict[str, list[dict[str, object]]] = {}

    for line in diff_text.splitlines():
        if line.startswith("diff --git "):
            parts = line.split()
            if len(parts) >= 4:
                current_file = repo_relative_str(parts[2][2:])
        elif line.startswith("+++ "):
            current_file = line[4:].strip()
            if current_file.startswith("b/"):
                current_file = current_file[2:]
            current_file = repo_relative_str(current_file)
        elif line.startswith("@@ ") and current_file:
            match = HUNK_RE.match(line)
            if not match:
                continue
            removed_start, removed_end = _parse_range(match.group("old"))
            added_start, added_end = _parse_range(match.group("new"))

            entry: dict[str, object] = {
                "set_id": len(data.get(current_file, [])) + 1,
            }
            removed_range = Range(removed_start, removed_end)
            added_range = Range(added_start, added_end)
            if not removed_range.is_empty:
                entry["removed"] = removed_range.as_dict
            if not added_range.is_empty:
                entry["added"] = added_range.as_dict

            data.setdefault(current_file, []).append(entry)

    return data


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base", required=True, help="Base git ref (e.g., origin/main)")
    parser.add_argument("--head", default="HEAD", help="Head git ref (default: HEAD)")
    parser.add_argument(
        "--paths",
        nargs="*",
        default=["."],
        help="Optional path filters passed to git diff",
    )
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()

    diff_text = _run_git_diff(args.base, args.head, args.paths)
    changes = _collect_sets(diff_text)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(changes, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    if not QUIET:
        print(f"Wrote {sum(len(v) for v in changes.values())} changed block(s) to {args.output}")
    return 0


if __name__ == "__main__":  # pragma: no cover
    raise SystemExit(main())
