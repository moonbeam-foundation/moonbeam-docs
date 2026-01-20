#!/usr/bin/env python3
"""Render translation summary markdown from JSON report."""
from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
from typing import Any, Dict, List

QUIET = os.environ.get("ROSE_QUIET", "").strip().lower() in {"1", "true", "yes", "on"}
MASK_PAYLOAD = os.environ.get("ROSE_MASK_PAYLOAD", "").strip().lower() in {"1", "true", "yes", "on"}


def _format_payload(data: dict[str, list[dict[str, Any]]], total_sent: int) -> list[str]:
    if MASK_PAYLOAD:
        return []
    if total_sent == 0:
        return []
    lines: list[str] = []
    lines.append("#### Translation payload (shows first 5 files per language)")
    if not data:
        lines.append("- Files were sent for translation but no per-language metadata was recorded.")
        return lines
    for lang, entries in sorted(data.items()):
        if not entries:
            continue
        lines.append(f"- `{lang}`: {len(entries)} file(s)/block(s) processed")
        for entry in entries[:5]:
            path = entry.get("path") or entry.get("file") or entry.get("target_path") or entry.get("source_path") or "unknown"
            start = entry.get("start")
            end = entry.get("end")
            if start and end:
                line_hint = f"L{start}" if start == end else f"L{start}-{end}"
            elif start:
                line_hint = f"L{start}"
            else:
                line_hint = "line n/a"
            lines.append(f"  - `{path}` ({line_hint})")
        if len(entries) > 5:
            lines.append("  - ...")
    return lines


def _format_payload_full(data: dict[str, list[dict[str, Any]]]) -> list[str]:
    if MASK_PAYLOAD:
        return []
    if not data:
        return []
    by_lang: dict[str, list[str]] = {}
    unique_paths: set[str] = set()
    for lang, entries in data.items():
        if not isinstance(entries, list):
            continue
        for entry in entries:
            if not isinstance(entry, dict):
                continue
            path = (
                entry.get("path")
                or entry.get("file")
                or entry.get("target_path")
                or entry.get("source_path")
                or "unknown"
            )
            normalized_path = str(path)
            unique_paths.add(normalized_path)
            by_lang.setdefault(lang, []).append(normalized_path)

    total = len(unique_paths)
    lines: list[str] = []
    lines.append(f"<details><summary>Full payload ({total} file(s))</summary>")
    lines.append("")
    for lang in sorted(by_lang.keys()):
        lines.append(f"- `{lang}`:")
        for path in sorted(set(by_lang[lang])):
            lines.append(f"  - `{path}`")
    lines.append("</details>")
    return lines


def _format_locale_added(data: dict[str, int]) -> list[str]:
    if not data:
        return []
    lines: list[str] = []
    lines.append("#### Locale key additions")
    for locale, count in sorted(data.items()):
        lines.append(f"- `{locale}`: {count} new key(s)")
    return lines


def _format_unused(keys: list[str]) -> list[str]:
    if not keys:
        return []
    lines: list[str] = []
    lines.append("#### Locale keys unused in templates")
    for key in keys[:10]:
        lines.append(f"- `{key}`")
    if len(keys) > 10:
        lines.append("- ...")
    return lines


def _format_pruned(pruned_by_lang: dict[str, list[str]], pruned_sources: list[str]) -> list[str]:
    if not pruned_by_lang:
        return []
    lines: list[str] = []
    total = sum(len(paths) for paths in pruned_by_lang.values())
    source_count = len(pruned_sources)
    lines.append("#### Pruned translations")
    lines.append(
        f"- Removed {total} translated file(s) for {source_count} deleted source file(s)"
    )
    for lang, paths in sorted(pruned_by_lang.items()):
        if not paths:
            continue
        lines.append(f"- `{lang}`: {len(paths)} file(s)")
        for path in paths[:5]:
            lines.append(f"  - `{path}`")
        if len(paths) > 5:
            lines.append("  - ...")
    return lines


def _group_validation_issues(validation: dict[str, Any]) -> dict[str, dict[str, list[dict[str, Any]]]]:
    grouped: dict[str, dict[str, list[dict[str, Any]]]] = {}
    issues: List[dict[str, Any]] = list(validation.get("issues") or [])

    if issues:
        for issue in issues:
            lang = issue.get("language") or issue.get("target_language") or "unknown"
            path = issue.get("target_path") or issue.get("source_path") or "unknown"
            grouped.setdefault(lang, {}).setdefault(path, []).append(issue)

    if grouped:
        return grouped

    issues_by_language: Dict[str, Any] = validation.get("issues_by_language") or {}
    for lang, payload in issues_by_language.items():
        files = payload.get("files", {})
        for path, file_issues in files.items():
            for issue in file_issues:
                entry = dict(issue)
                entry.setdefault("language", lang)
                entry.setdefault("target_path", path)
                grouped.setdefault(lang, {}).setdefault(path, []).append(entry)
    return grouped


def _format_validation(validation: dict[str, Any]) -> list[str]:
    lines: list[str] = []
    lines.append("#### Validation status")
    status = validation.get("status", "unknown")
    issue_count = validation.get("issue_count", len(validation.get("issues", [])))
    grouped = _group_validation_issues(validation)

    if not grouped:
        return lines

    if status == "passed":
        status_label = "passed"
    elif status in {"failed", "warning"}:
        status_label = status
    else:
        status_label = "unknown"

    lines.append(f"- ❌ Validation reported {issue_count or sum(len(items) for files in grouped.values() for items in files.values())} issue(s) (status: {status_label}).")

    lines.append("- Detailed discrepancies:")
    for lang in sorted(grouped.keys()):
        files = grouped[lang]
        total_for_lang = sum(len(items) for items in files.values())
        lines.append(f"  - Locale `{lang}` ({total_for_lang} issue(s))")
        for path, file_issues in sorted(files.items()):
            lines.append(f"    - `{path}`")
            for issue in sorted(file_issues, key=lambda item: item.get("line") or 0):
                line_num = issue.get("line")
                line_hint = f"L{line_num}" if line_num else "line n/a"
                issue_type = issue.get("issue_type") or "validation_issue"
                message = issue.get("message") or "See validation report for details."
                lines.append(f"      - {line_hint}: [{issue_type}] {message}")
    lines.append("  - Full details: scripts/translations/validation_report.json")
    return lines


def _format_file_details(summary: dict[str, Any]) -> list[str]:
    validation_block = summary.get("validation") or {
        "status": summary.get("validation_status", "unknown"),
    }
    if not validation_block.get("issues"):
        validation_block["issues"] = summary.get("validation_issues", [])
    grouped_validation = _group_validation_issues(validation_block)
    if not grouped_validation:
        return []

    failing_paths: set[str] = set()
    file_details: dict[str, dict[str, Any]] = {}

    for language, files in grouped_validation.items():
        for path, issues in files.items():
            normalized_path = str(path or "unknown")
            failing_paths.add(normalized_path)
            formatted_issues: list[dict[str, Any]] = []
            for issue in issues:
                formatted_issue = {
                    "language": language,
                    "issue_type": issue.get("issue_type"),
                    "line": issue.get("line"),
                    "message": issue.get("message"),
                }
                details = issue.get("details")
                if details:
                    formatted_issue["details"] = details
                formatted_issues.append({k: v for k, v in formatted_issue.items() if v is not None})
            if formatted_issues:
                file_details.setdefault(normalized_path, {}).setdefault("validation_issues", []).extend(formatted_issues)

    payload_segments = summary.get("payload_segments") or {}
    for language, entries in payload_segments.items():
        if not isinstance(entries, list):
            continue
        for entry in entries:
            if not isinstance(entry, dict):
                continue
            path = (
                entry.get("path")
                or entry.get("file")
                or entry.get("target_path")
                or entry.get("source_path")
                or "unknown"
            )
            normalized_path = str(path)
            if normalized_path not in failing_paths:
                continue
            payload_entry = {
                "language": language,
                "kind": entry.get("kind"),
                "start": entry.get("start"),
                "end": entry.get("end"),
            }
            sanitized_entry = {k: v for k, v in payload_entry.items() if v is not None}
            file_details.setdefault(normalized_path, {}).setdefault("payload_entries", []).append(sanitized_entry)

    lines: list[str] = []
    if not file_details:
        return lines
    for path in sorted(file_details.keys()):
        pretty_json = json.dumps(file_details[path], ensure_ascii=False, indent=2)
        lines.append(f"<details><summary>`{path}` details</summary>")
        lines.append("")
        lines.append("```json")
        lines.append(pretty_json)
        lines.append("```")
        lines.append("</details>")
    return lines


def build_markdown(summary_path: Path) -> str:
    data = json.loads(summary_path.read_text(encoding="utf-8"))
    payload_count = data.get("payload_entry_count", 0)
    localized_changes = data.get("localized_file_changes", 0)
    blocks: list[str] = [f"### Translation Summary · {payload_count} file(s) sent · {localized_changes} localized file change(s)"]
    payload_section = _format_payload(data.get("payload_segments", {}), payload_count)
    if payload_section:
        blocks.extend(payload_section)
        blocks.append("")
    payload_full_section = _format_payload_full(data.get("payload_segments", {}))
    if payload_full_section:
        blocks.extend(payload_full_section)
        blocks.append("")
    locale_added_section = _format_locale_added(data.get("locale_added_per_locale", {}))
    if locale_added_section:
        blocks.extend(locale_added_section)
        blocks.append("")
    pruned_section = _format_pruned(
        data.get("pruned_translations", {}),
        data.get("pruned_sources", []),
    )
    if pruned_section:
        blocks.extend(pruned_section)
        blocks.append("")
    validation_block = data.get("validation") or {
        "status": data.get("validation_status", "unknown"),
    }
    if not validation_block.get("issues"):
        validation_block["issues"] = data.get("validation_issues", [])
    validation_section = _format_validation(validation_block)
    if validation_section:
        blocks.extend(validation_section)

    if not MASK_PAYLOAD:
        file_detail_sections = _format_file_details(data)
        if file_detail_sections:
            blocks.append("")
            blocks.append("#### File-level breakdown")
            blocks.extend(file_detail_sections)

    blocks.append("")
    blocks.append("#### Support resources")
    blocks.append("For support resources please check in the shared note.")

    if not MASK_PAYLOAD:
        pretty_json = json.dumps(data, ensure_ascii=False, indent=2)
        blocks.append("")
        blocks.append("<details><summary>Full summary_report.json</summary>")
        blocks.append("")
        blocks.append("```json")
        blocks.append(pretty_json)
        blocks.append("```")
        blocks.append("</details>")

    markdown = "\n".join(blocks).strip()
    if not markdown.endswith("\n"):
        markdown += "\n"
    return markdown


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--summary", type=Path, required=True, help="Path to summary_report.json")
    parser.add_argument("--output", type=Path, required=True, help="Markdown output path")
    args = parser.parse_args()

    if not args.summary.exists():
        raise FileNotFoundError(args.summary)

    markdown = build_markdown(args.summary)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(markdown, encoding="utf-8")
    if not QUIET:
        print(markdown)
    return 0


if __name__ == "__main__":  # pragma: no cover
    raise SystemExit(main())
