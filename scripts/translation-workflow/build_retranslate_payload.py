#!/usr/bin/env python3
"""Build a re-translation payload from Rose validation output.

This is a standalone equivalent of the retranslate payload generation that the
pipeline can do after running validate_translations.py.

Input: validation_report.json (from validate_translations.py --report)
Output: retranslate_payload.json (entries to send back to n8n for translation)
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any


def _load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def _build_from_report(report: dict[str, Any]) -> list[dict[str, Any]]:
    issues = report.get("issues")
    if not isinstance(issues, list):
        return []

    out: list[dict[str, Any]] = []
    seen: set[tuple[str, str, str]] = set()
    for issue in issues:
        if not isinstance(issue, dict):
            continue
        if issue.get("issue_type") != "missing_anchor_section":
            continue
        lang = issue.get("target_language")
        source_path = issue.get("source_path")
        target_path = issue.get("target_path")
        details = issue.get("details") or {}
        if not isinstance(details, dict):
            continue
        missing_id = details.get("missing_section_id")
        insert_before = details.get("insert_before_section_id")
        english_section = details.get("english_section")

        if not (
            isinstance(lang, str)
            and isinstance(source_path, str)
            and isinstance(missing_id, str)
            and isinstance(english_section, str)
            and english_section.strip()
        ):
            continue

        key = (lang, source_path, missing_id)
        if key in seen:
            continue
        seen.add(key)

        out.append(
            {
                "kind": "anchored_section",
                "source_path": source_path,
                "target_path": target_path or None,
                "source_language": "en",
                "target_language": lang,
                "content": english_section,
                "missing_section_id": missing_id,
                "insert_before_section_id": insert_before,
            }
        )

    return out


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--validation-report",
        type=Path,
        required=True,
        help="Path to validation_report.json",
    )
    parser.add_argument(
        "--output",
        type=Path,
        required=True,
        help="Path to write retranslate_payload.json",
    )
    args = parser.parse_args()

    report = _load_json(args.validation_report)
    if not isinstance(report, dict):
        raise ValueError("validation report must be a JSON object")

    payload = _build_from_report(report)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {len(payload)} retranslate entry(ies) to {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

