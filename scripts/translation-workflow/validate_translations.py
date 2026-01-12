#!/usr/bin/env python3
"""Validate structural parity between English content and translations."""
from __future__ import annotations

import argparse
import json
import os
import re
from collections import defaultdict
from pathlib import Path
from typing import Any, Callable

import yaml

from paths import repo_relative, repo_path

URL_RE = re.compile(r"https?://\S+")
HEADER_RE = re.compile(r"^#{1,6}\s")
IMAGE_RE = re.compile(r"!\[[^\]]*\]\([^)]*\)")
BULLET_RE = re.compile(r"^(?:\s*)([-*+]\s+|\d+\.\s+)")
HTML_TAG_RE = re.compile(r"<([a-zA-Z0-9]+)(\s|>)")
TABLE_ROW_RE = re.compile(r"\|")
FRONTMATTER_BOUNDARY = "---"
CODE_FENCE_RE = re.compile(r"^\s*(```+|~~~+)")
INLINE_CODE_RE = re.compile(r"`[^`]+`")
MARKDOWN_SUFFIXES = {".md", ".markdown", ".mkd"}
ADMONITION_RE = re.compile(r"^\s*(:::|!!!)\s*(.+)?$")
IMAGE_LINK_RE = re.compile(r"!\[[^\]]*\]\(([^)\s]+)")
REMOTE_IMAGE_PREFIXES = ("http://", "https://", "data:", "mailto:", "#")
LOCALE_COLON_PATTERN = re.compile(r'^(\s*[^:\n]+):[ \t]*([^\n]+)$', re.MULTILINE)
LOCALE_INLINE_COLON_REGEX = re.compile(r'(?<=\w):(?=\s)')
QUIET = os.environ.get("ROSE_QUIET", "").strip().lower() in {"1", "true", "yes", "on"}
LOCALE_EXCLUDED_VALUE_PREFIXES = ('"', "'", "|", ">", "[", "{", "#")


def _load_payload(path: Path) -> list[dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(data, dict) and "entries" in data:
        return data["entries"]
    if isinstance(data, list):
        return data
    raise ValueError("Payload must be a list or contain an 'entries' array")


def _split_lines(text: str) -> list[str]:
    return text.rstrip("\n").split("\n")


def _derive_target_path(rel_path: str, language: str) -> str:
    try:
        path = repo_relative(rel_path)
    except ValueError:
        path = Path(rel_path)
    parts = list(path.parts)

    if parts and parts[0] == "locale":
        rest = parts[1:]
        if not rest:
            return str(Path("locale", f"{language}.yml"))
        filename = Path(rest[-1])
        suffix = filename.suffix or ".yml"
        new_name = f"{language}{suffix}"
        return str(Path("locale", *rest[:-1], new_name))

    if ".translations" in parts:
        idx = parts.index(".translations")
        before = parts[: idx + 1]
        rest = parts[idx + 1 :]
        filename = Path(rest[-1]) if rest else Path("en.json")
        suffix = filename.suffix or ".json"
        new_name = f"{language}{suffix}"
        return str(Path(*before, *rest[:-1], new_name))

    if parts and parts[0] == language:
        return str(path)
    if parts and parts[0] == "en":
        parts = parts[1:]
    return str(Path(language, *parts))


def _resolved_target_path(entry: dict[str, Any]) -> str | None:
    if entry.get("target_path"):
        return str(entry["target_path"])
    source = entry.get("source_path")
    language = entry.get("target_language")
    if source and language:
        return _derive_target_path(str(source), str(language))
    return source


def _make_issue(
    entry: dict[str, Any],
    issue_type: str,
    message: str,
    *,
    line: int | None = None,
    details: dict[str, Any] | None = None,
) -> dict[str, Any]:
    return {
        "source_path": entry.get("source_path"),
        "target_path": _resolved_target_path(entry),
        "target_language": entry.get("target_language"),
        "kind": entry.get("kind"),
        "issue_type": issue_type,
        "line": line,
        "details": details or {},
        "message": message,
    }


def _compare_line_counts(
    entry: dict[str, Any],
    eng_lines: list[str],
    trans_lines: list[str],
    issues: list[dict[str, Any]],
) -> bool:
    if len(eng_lines) != len(trans_lines):
        issues.append(
            _make_issue(
                entry,
                "line_count_mismatch",
                f"Line count mismatch: {len(eng_lines)} vs {len(trans_lines)}",
                details={"english": len(eng_lines), "translated": len(trans_lines)},
            )
        )
        return False
    return True


def _compare_per_line(
    issue_type: str,
    label: str,
    extractor: Callable[[str], int],
    eng_lines: list[str],
    trans_lines: list[str],
    entry: dict[str, Any],
    issues: list[dict[str, Any]],
) -> None:
    for idx, (eng_line, trans_line) in enumerate(zip(eng_lines, trans_lines), start=1):
        eng_val = extractor(eng_line)
        trans_val = extractor(trans_line)
        if eng_val != trans_val:
            issues.append(
                _make_issue(
                    entry,
                    issue_type,
                    f"{label} mismatch on line {idx}",
                    line=idx,
                    details={"english": eng_val, "translated": trans_val},
                )
            )


def _count_urls(line: str) -> int:
    return len(URL_RE.findall(line))


def _count_headers(line: str) -> int:
    return 1 if HEADER_RE.search(line) else 0


def _count_images(line: str) -> int:
    return len(IMAGE_RE.findall(line))


def _is_bullet(line: str) -> int:
    return 1 if BULLET_RE.search(line) else 0


def _frontmatter_keys(lines: list[str]) -> list[str]:
    if not lines or lines[0].strip() != FRONTMATTER_BOUNDARY:
        return []
    keys = []
    for line in lines[1:]:
        stripped = line.strip()
        if stripped == FRONTMATTER_BOUNDARY:
            break
        if ":" in stripped:
            keys.append(stripped.split(":", 1)[0].strip())
    return keys


def _compare_frontmatter(
    entry: dict[str, Any], eng_lines: list[str], trans_lines: list[str], issues: list[dict[str, Any]]
) -> None:
    eng_keys = _frontmatter_keys(eng_lines)
    trans_keys = _frontmatter_keys(trans_lines)
    if eng_keys != trans_keys:
        issues.append(
            _make_issue(
                entry,
                "frontmatter_mismatch",
                "Frontmatter keys differ",
                line=1,
                details={"english": eng_keys, "translated": trans_keys},
            )
        )


def _extract_tables(lines: list[str]) -> list[dict[str, Any]]:
    tables: list[dict[str, Any]] = []
    current_lines: list[str] = []
    current_numbers: list[int] = []
    for idx, line in enumerate(lines, start=1):
        if TABLE_ROW_RE.search(line):
            current_lines.append(line)
            current_numbers.append(idx)
        else:
            if current_lines:
                tables.append({"lines": current_lines, "line_numbers": current_numbers})
                current_lines = []
                current_numbers = []
    if current_lines:
        tables.append({"lines": current_lines, "line_numbers": current_numbers})
    return tables


def _compare_tables(
    entry: dict[str, Any], eng_lines: list[str], trans_lines: list[str], issues: list[dict[str, Any]]
) -> None:
    eng_tables = _extract_tables(eng_lines)
    trans_tables = _extract_tables(trans_lines)
    if len(eng_tables) != len(trans_tables):
        issues.append(
            _make_issue(
                entry,
                "table_count_mismatch",
                f"Table count mismatch: {len(eng_tables)} vs {len(trans_tables)}",
                details={"english": len(eng_tables), "translated": len(trans_tables)},
            )
        )
        return
    for idx, (e_table, t_table) in enumerate(zip(eng_tables, trans_tables), start=1):
        e_rows = e_table["lines"]
        t_rows = t_table["lines"]
        if len(e_rows) != len(t_rows):
            issues.append(
                _make_issue(
                    entry,
                    "table_row_count_mismatch",
                    f"Table {idx} row count mismatch",
                    line=e_table["line_numbers"][0] if e_table["line_numbers"] else None,
                    details={"english": len(e_rows), "translated": len(t_rows), "table_index": idx},
                )
            )
            continue
        for row_idx, (e_row, t_row) in enumerate(zip(e_rows, t_rows), start=1):
            row_line = e_table["line_numbers"][row_idx - 1]
            eng_pipe = e_row.count("|")
            trans_pipe = t_row.count("|")
            if eng_pipe != trans_pipe:
                issues.append(
                    _make_issue(
                        entry,
                        "table_pipe_mismatch",
                        f"Table {idx} row {row_idx} pipe mismatch",
                        line=row_line,
                        details={"english": eng_pipe, "translated": trans_pipe},
                    )
                )
            eng_dash = e_row.count("-")
            trans_dash = t_row.count("-")
            if eng_dash != trans_dash:
                issues.append(
                    _make_issue(
                        entry,
                        "table_dash_mismatch",
                        f"Table {idx} row {row_idx} dash mismatch",
                        line=row_line,
                        details={"english": eng_dash, "translated": trans_dash},
                    )
                )


def _collect_code_fences(lines: list[str]) -> list[dict[str, Any]]:
    fences: list[dict[str, Any]] = []
    for idx, line in enumerate(lines, start=1):
        match = CODE_FENCE_RE.match(line)
        if match:
            fences.append({"line": idx, "token": match.group(1), "text": line.strip()})
    return fences


def _compare_code_fences(
    entry: dict[str, Any], eng_lines: list[str], trans_lines: list[str], issues: list[dict[str, Any]]
) -> None:
    eng_fences = _collect_code_fences(eng_lines)
    trans_fences = _collect_code_fences(trans_lines)
    if len(eng_fences) != len(trans_fences):
        issues.append(
            _make_issue(
                entry,
                "code_fence_mismatch",
                "Code fence count differs",
                details={
                    "english_count": len(eng_fences),
                    "translated_count": len(trans_fences),
                },
            )
        )
        return
    for idx, (eng_fence, trans_fence) in enumerate(zip(eng_fences, trans_fences), start=1):
        if eng_fence["text"] != trans_fence["text"]:
            issues.append(
                _make_issue(
                    entry,
                    "code_fence_mismatch",
                    f"Code fence {idx} differs from English",
                    line=trans_fence["line"],
                    details={
                        "english_fence": eng_fence["text"],
                        "translated_fence": trans_fence["text"],
                    },
                )
            )


def _compare_inline_code(
    entry: dict[str, Any], eng_lines: list[str], trans_lines: list[str], issues: list[dict[str, Any]]
) -> None:
    for idx, (eng_line, trans_line) in enumerate(zip(eng_lines, trans_lines), start=1):
        eng_count = len(INLINE_CODE_RE.findall(eng_line))
        trans_count = len(INLINE_CODE_RE.findall(trans_line))
        if eng_count != trans_count:
            issues.append(
                _make_issue(
                    entry,
                    "inline_code_mismatch",
                    f"Inline code backtick pairs differ on line {idx}",
                    line=idx,
                    details={"english": eng_count, "translated": trans_count},
                )
            )


def _collect_admonitions(lines: list[str]) -> list[dict[str, Any]]:
    admonitions: list[dict[str, Any]] = []
    for idx, line in enumerate(lines, start=1):
        stripped = line.strip()
        if ADMONITION_RE.match(stripped):
            admonitions.append({"line": idx, "text": stripped})
    return admonitions


def _compare_admonitions(
    entry: dict[str, Any], eng_lines: list[str], trans_lines: list[str], issues: list[dict[str, Any]]
) -> None:
    eng_admonitions = _collect_admonitions(eng_lines)
    trans_admonitions = _collect_admonitions(trans_lines)
    if len(eng_admonitions) != len(trans_admonitions):
        issues.append(
            _make_issue(
                entry,
                "admonition_count_mismatch",
                "Admonition blocks differ in count",
                details={
                    "english_count": len(eng_admonitions),
                    "translated_count": len(trans_admonitions),
                },
            )
        )
        return
    for idx, (eng_adm, trans_adm) in enumerate(zip(eng_admonitions, trans_admonitions), start=1):
        if eng_adm["text"] != trans_adm["text"]:
            issues.append(
                _make_issue(
                    entry,
                    "admonition_format_mismatch",
                    f"Admonition {idx} formatting differs",
                    line=trans_adm["line"],
                    details={
                        "english_text": eng_adm["text"],
                        "translated_text": trans_adm["text"],
                    },
                )
            )


def _validate_image_paths(entry: dict[str, Any], trans_lines: list[str], issues: list[dict[str, Any]]) -> None:
    source = entry.get("target_path") or entry.get("source_path")
    if not source:
        return
    try:
        base_rel = repo_relative(source).parent
    except ValueError:
        base_rel = Path(source).parent
    for idx, line in enumerate(trans_lines, start=1):
        for match in IMAGE_LINK_RE.finditer(line):
            url = match.group(1)
            if url.startswith(REMOTE_IMAGE_PREFIXES):
                continue
            cleaned = url.split("#", 1)[0].split("?", 1)[0]
            candidate_rel = (base_rel / cleaned).as_posix()
            try:
                candidate_abs = repo_path(candidate_rel)
            except Exception:
                issues.append(
                    _make_issue(
                        entry,
                        "image_unreachable",
                        "Image path cannot be resolved relative to repository",
                        line=idx,
                        details={"image": url},
                    )
                )
                continue
            if not candidate_abs.exists():
                issues.append(
                    _make_issue(
                        entry,
                        "image_unreachable",
                        "Referenced image is missing or unreachable",
                        line=idx,
                        details={"image": url, "resolved_path": candidate_rel},
                    )
                )


def _tags_per_line(lines: list[str]) -> list[list[str]]:
    return [HTML_TAG_RE.findall(line) for line in lines]


def _compare_html(
    entry: dict[str, Any], eng_lines: list[str], trans_lines: list[str], issues: list[dict[str, Any]]
) -> None:
    eng_tags = _tags_per_line(eng_lines)
    trans_tags = _tags_per_line(trans_lines)
    for idx, (english, translated) in enumerate(zip(eng_tags, trans_tags), start=1):
        if english != translated:
            issues.append(
                _make_issue(
                    entry,
                    "html_tag_mismatch",
                    "HTML/Jinja tag placement differs",
                    line=idx,
                    details={"english": english, "translated": translated},
                )
            )


def _compare_yaml(
    entry: dict[str, Any], eng_text: str, trans_text: str, issues: list[dict[str, Any]]
) -> tuple[Any | None, Any | None]:
    try:
        eng_yaml = yaml.safe_load(eng_text) or {}
        trans_yaml = yaml.safe_load(trans_text) or {}
    except yaml.YAMLError as exc:
        issues.append(
            _make_issue(
                entry,
                "yaml_parse_error",
                "Unable to parse YAML during validation",
                details={"error": str(exc)},
            )
        )
        return None, None
    eng_flat = _flatten_structure(eng_yaml)
    trans_flat = _flatten_structure(trans_yaml)
    if eng_flat != trans_flat:
        issues.append(
            _make_issue(
                entry,
                "yaml_structure_mismatch",
                "YAML structure differs",
                details={"english": eng_flat, "translated": trans_flat},
            )
        )
    return eng_yaml, trans_yaml


def _is_locale_entry(entry: dict[str, Any]) -> bool:
    path = entry.get("target_path") or entry.get("source_path") or ""
    return isinstance(path, str) and path.startswith("locale/")


def _sanitize_locale_translation(text: str) -> str:
    def repl(match: re.Match[str]) -> str:
        key = match.group(1)
        value = match.group(2)
        stripped = value.lstrip()
        if not value or stripped.startswith(LOCALE_EXCLUDED_VALUE_PREFIXES):
            return match.group(0)
        sanitized = LOCALE_INLINE_COLON_REGEX.sub("", value)
        return f"{key}: {sanitized}"

    return LOCALE_COLON_PATTERN.sub(repl, text)


def _collect_dict_paths(data: Any, prefix: str = "") -> set[str]:
    paths: set[str] = set()
    if isinstance(data, dict):
        for key, value in data.items():
            new_prefix = f"{prefix}.{key}" if prefix else str(key)
            paths.add(new_prefix)
            paths.update(_collect_dict_paths(value, new_prefix))
    elif isinstance(data, list):
        for idx, value in enumerate(data):
            new_prefix = f"{prefix}[{idx}]" if prefix else f"[{idx}]"
            paths.update(_collect_dict_paths(value, new_prefix))
    return paths


def _collect_scalar_paths(data: Any, prefix: str = "") -> dict[str, Any]:
    scalars: dict[str, Any] = {}
    if isinstance(data, dict):
        for key, value in data.items():
            new_prefix = f"{prefix}.{key}" if prefix else str(key)
            scalars.update(_collect_scalar_paths(value, new_prefix))
    elif isinstance(data, list):
        for idx, value in enumerate(data):
            new_prefix = f"{prefix}[{idx}]" if prefix else f"[{idx}]"
            scalars.update(_collect_scalar_paths(value, new_prefix))
    else:
        if prefix:
            scalars[prefix] = data
    return scalars


def _compare_locale_structures(
    entry: dict[str, Any],
    eng_yaml: Any,
    trans_yaml: Any,
    issues: list[dict[str, Any]],
) -> None:
    if not isinstance(eng_yaml, dict) or not isinstance(trans_yaml, dict):
        issues.append(
            _make_issue(
                entry,
                "locale_not_mapping",
                "Locale files must be YAML mappings at the root",
            )
        )
        return

    eng_root_keys = list(eng_yaml.keys())
    trans_root_keys = list(trans_yaml.keys())
    if len(eng_root_keys) != len(trans_root_keys) or set(eng_root_keys) != set(trans_root_keys):
        missing = [key for key in eng_root_keys if key not in trans_root_keys]
        extra = [key for key in trans_root_keys if key not in eng_root_keys]
        issues.append(
            _make_issue(
                entry,
                "locale_root_key_mismatch",
                "Top-level locale keys differ from English",
                details={
                    "english_count": len(eng_root_keys),
                    "translated_count": len(trans_root_keys),
                    "missing": missing[:10],
                    "extra": extra[:10],
                },
            )
        )

    eng_paths = _collect_dict_paths(eng_yaml)
    trans_paths = _collect_dict_paths(trans_yaml)
    missing_paths = sorted(eng_paths - trans_paths)
    extra_paths = sorted(trans_paths - eng_paths)
    if missing_paths or extra_paths:
        issues.append(
            _make_issue(
                entry,
                "locale_key_path_mismatch",
                "Dictionary key paths differ from English structure",
                details={
                    "missing_paths": missing_paths[:10],
                    "extra_paths": extra_paths[:10],
                    "missing_count": len(missing_paths),
                    "extra_count": len(extra_paths),
                },
            )
        )

    eng_scalars = _collect_scalar_paths(eng_yaml)
    trans_scalars = _collect_scalar_paths(trans_yaml)
    if len(eng_scalars) != len(trans_scalars):
        issues.append(
            _make_issue(
                entry,
                "locale_value_count_mismatch",
                "Number of scalar values differs from English",
                details={
                    "english_values": len(eng_scalars),
                    "translated_values": len(trans_scalars),
                },
            )
        )
    missing_value_paths = [path for path in eng_scalars if path not in trans_scalars]
    extra_value_paths = [path for path in trans_scalars if path not in eng_scalars]
    if missing_value_paths or extra_value_paths:
        issues.append(
            _make_issue(
                entry,
                "locale_value_path_mismatch",
                "Scalar value paths differ between English and translation",
                details={
                    "missing_paths": missing_value_paths[:10],
                    "extra_paths": extra_value_paths[:10],
                    "missing_count": len(missing_value_paths),
                    "extra_count": len(extra_value_paths),
                },
            )
        )


def _flatten_structure(data: Any, prefix: str = "") -> list[str]:
    keys: list[str] = []
    if isinstance(data, dict):
        for key, value in data.items():
            new_prefix = f"{prefix}.{key}" if prefix else str(key)
            keys.extend(_flatten_structure(value, new_prefix))
    elif isinstance(data, list):
        for idx, value in enumerate(data):
            new_prefix = f"{prefix}[{idx}]"
            keys.extend(_flatten_structure(value, new_prefix))
    else:
        keys.append(prefix)
    return keys


def _compare_line_breaks(
    entry: dict[str, Any], eng_lines: list[str], trans_lines: list[str], issues: list[dict[str, Any]]
) -> None:
    blank_positions_eng = [idx for idx, line in enumerate(eng_lines, start=1) if line.strip() == ""]
    blank_positions_trans = [idx for idx, line in enumerate(trans_lines, start=1) if line.strip() == ""]
    if blank_positions_eng != blank_positions_trans:
        first_diff = None
        for a, b in zip(blank_positions_eng, blank_positions_trans):
            if a != b:
                first_diff = min(a, b)
                break
        if first_diff is None:
            first_diff = blank_positions_eng[len(blank_positions_trans)] if len(blank_positions_eng) > len(blank_positions_trans) else blank_positions_trans[len(blank_positions_eng)] if blank_positions_trans else None
        issues.append(
            _make_issue(
                entry,
                "blank_line_mismatch",
                "Blank-line positions differ",
                line=first_diff,
                details={"english": blank_positions_eng, "translated": blank_positions_trans},
            )
        )


def _group_by_language(issues: list[dict[str, Any]]) -> dict[str, Any]:
    grouped: dict[str, Any] = {}
    tmp = defaultdict(lambda: {"count": 0, "files": defaultdict(list)})
    for issue in issues:
        lang = issue.get("target_language") or "unknown"
        path = issue.get("target_path") or issue.get("source_path") or "unknown"
        bucket = tmp[lang]
        bucket["count"] += 1
        bucket["files"][path].append(
            {
                "issue_type": issue.get("issue_type"),
                "line": issue.get("line"),
                "message": issue.get("message"),
                "details": issue.get("details", {}),
            }
        )
    for lang, data in tmp.items():
        grouped[lang] = {
            "count": data["count"],
            "files": dict(data["files"]),
        }
    return grouped


def _group_by_file(issues: list[dict[str, Any]]) -> dict[str, Any]:
    tmp = defaultdict(lambda: {"count": 0, "languages": set(), "issues": []})
    for issue in issues:
        path = issue.get("target_path") or issue.get("source_path") or "unknown"
        bucket = tmp[path]
        bucket["count"] += 1
        lang = issue.get("target_language")
        if lang:
            bucket["languages"].add(lang)
        bucket["issues"].append(
            {
                "issue_type": issue.get("issue_type"),
                "line": issue.get("line"),
                "message": issue.get("message"),
                "details": issue.get("details", {}),
            }
        )
    grouped: dict[str, Any] = {}
    for path, data in tmp.items():
        grouped[path] = {
            "count": data["count"],
            "languages": sorted(data["languages"]),
            "issues": data["issues"],
        }
    return grouped


def validate_entry(entry: dict[str, Any], issues: list[dict[str, Any]]) -> None:
    english = entry.get("content_original") or entry.get("content")
    translated = (
        entry.get("translated_content")
        or entry.get("content_translated")
        or entry.get("content")
    )
    if not isinstance(english, str) or not isinstance(translated, str):
        issues.append(_make_issue(entry, "missing_content", "Entry missing content fields"))
        return
    suffix = Path(entry.get("source_path", "")).suffix.lower()
    if suffix in {".yml", ".yaml"} and _is_locale_entry(entry):
        translated = _sanitize_locale_translation(translated)
    eng_lines = _split_lines(english)
    trans_lines = _split_lines(translated)
    aligned = _compare_line_counts(entry, eng_lines, trans_lines, issues)
    if not aligned:
        return
    _compare_line_breaks(entry, eng_lines, trans_lines, issues)
    _compare_per_line("url_count_mismatch", "URL count", _count_urls, eng_lines, trans_lines, entry, issues)
    _compare_per_line("header_count_mismatch", "Header count", _count_headers, eng_lines, trans_lines, entry, issues)
    _compare_per_line("image_count_mismatch", "Image count", _count_images, eng_lines, trans_lines, entry, issues)
    _compare_per_line("bullet_count_mismatch", "Bullet count", _is_bullet, eng_lines, trans_lines, entry, issues)
    _compare_frontmatter(entry, eng_lines, trans_lines, issues)
    _compare_tables(entry, eng_lines, trans_lines, issues)

    if suffix in MARKDOWN_SUFFIXES:
        _compare_code_fences(entry, eng_lines, trans_lines, issues)
        _compare_inline_code(entry, eng_lines, trans_lines, issues)
        _compare_admonitions(entry, eng_lines, trans_lines, issues)
        _validate_image_paths(entry, trans_lines, issues)

    if suffix in {".html", ".jinja", ".jinja2", ".j2"}:
        _compare_html(entry, eng_lines, trans_lines, issues)
    if suffix in {".yml", ".yaml"}:
        eng_yaml, trans_yaml = _compare_yaml(entry, english, translated, issues)
        if eng_yaml is not None and trans_yaml is not None and _is_locale_entry(entry):
            _compare_locale_structures(entry, eng_yaml, trans_yaml, issues)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--payload", type=Path, required=True)
    parser.add_argument("--report", type=Path, help="Optional JSON file to write validation results")
    args = parser.parse_args()

    entries = _load_payload(args.payload)
    issues: list[dict[str, Any]] = []
    for entry in entries:
        if not isinstance(entry, dict):
            continue
        validate_entry(entry, issues)

    def _format_count_summary(details: dict[str, Any]) -> str | None:
        if not isinstance(details, dict):
            return None
        english = None
        translated = None
        if "english" in details and "translated" in details:
            english = details["english"]
            translated = details["translated"]
        elif "english_count" in details and "translated_count" in details:
            english = details["english_count"]
            translated = details["translated_count"]
        if english is None or translated is None:
            return None
        try:
            eng_val = float(english)
            trans_val = float(translated)
        except (TypeError, ValueError):
            return None
        diff = abs(trans_val - eng_val)
        return f"diff:{diff:g} | translated:{trans_val:g} | english:{eng_val:g}"

    if issues:
        if not QUIET:
            print("Validation issues detected:")
            for issue in issues:
                file_path = issue.get("target_path") or issue.get("source_path") or "<unknown>"
                lang = issue.get("target_language") or "?"
                line = f":{issue['line']}" if issue.get("line") else ""
                summary = _format_count_summary(issue.get("details", {}))
                extra = f" ({summary})" if summary else ""
                print(f"- {file_path} ({lang}){line} [{issue['issue_type']}] {issue['message']}{extra}")
        status = "failed"
    else:
        if not QUIET:
            print("All translations passed structural validation.")
        status = "passed"

    if args.report:
        report = {
            "status": status,
            "issue_count": len(issues),
            "issues": issues,
            "issues_by_language": _group_by_language(issues),
            "issues_by_file": _group_by_file(issues),
        }
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    return 0 if not issues else 1


if __name__ == "__main__":  # pragma: no cover
    raise SystemExit(main())
