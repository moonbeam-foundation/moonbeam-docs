#!/usr/bin/env python3
"""Copy translated Markdown into tanssi-docs/<lang>/..."""
from __future__ import annotations

import argparse
import json
import os
import re
import shutil
from pathlib import Path

import yaml
from ruamel.yaml import YAML
from ruamel.yaml.comments import CommentedMap, CommentedSeq

from paths import DOCS_ROOT, REPO_ROOT, repo_relative

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_PAYLOAD = ROOT / "translations" / "payload.json"
LOCALE_DIR = DOCS_ROOT / "locale"
EN_LOCALE = LOCALE_DIR / "en.yml"
LANG_DIR_PATTERN = re.compile(r"^[a-z]{2}(?:[-_][a-z0-9]+)?$")
ROOT_DIR_SKIP = {
    "assets",
    "images",
    "locale",
    "translation-workflow",
    "scripts",
    "i18n",
    "llms-files",
    "tmp",
    "site",
    ".git",
    ".github",
    ".snippets",
}
ROOT_FILE_ALLOW = {"index.md", ".nav.yml"}
_SCAFFOLDED_LANGS: set[str] = set()
QUIET = os.environ.get("ROSE_QUIET", "").strip().lower() in {"1", "true", "yes", "on"}

YAML_PARSER = YAML()
YAML_PARSER.indent(mapping=2, sequence=4, offset=2)
YAML_PARSER.preserve_quotes = True


def _normalize_lang(code: str) -> str:
    return code.strip().lower().replace("-", "_")


def _is_language_dir(name: str) -> bool:
    return bool(LANG_DIR_PATTERN.match(name.lower()))


def _should_copy_entry(path: Path) -> bool:
    name = path.name
    if path.is_dir():
        if name in ROOT_DIR_SKIP:
            return False
        if name.startswith("."):
            return False
        if _is_language_dir(name):
            return False
        return True
    if name in ROOT_FILE_ALLOW:
        return True
    return False


def _ensure_locale_file(lang: str) -> None:
    dest = LOCALE_DIR / f"{lang}.yml"
    if dest.exists():
        return
    LOCALE_DIR.mkdir(parents=True, exist_ok=True)
    shutil.copy2(EN_LOCALE, dest)


def _ensure_language_scaffold(lang: str) -> None:
    if lang in _SCAFFOLDED_LANGS:
        return
    _SCAFFOLDED_LANGS.add(lang)
    lang_root = DOCS_ROOT / lang
    if lang_root.exists():
        return
    lang_root.mkdir(parents=True, exist_ok=True)
    for entry in DOCS_ROOT.iterdir():
        if not _should_copy_entry(entry):
            continue
        dest = lang_root / entry.name
        if entry.is_dir():
            shutil.copytree(entry, dest)
        else:
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(entry, dest)


def _derive_target_path(source_path: str, language: str) -> Path:
    try:
        path = repo_relative(source_path)
    except ValueError:
        path = Path(source_path)
    parts = list(path.parts)

    if parts and parts[0] == "locale":
        rest = parts[1:]
        if not rest:
            return Path("locale", f"{language}.yml")
        filename = Path(rest[-1])
        suffix = filename.suffix or ".yml"
        new_name = f"{language}{suffix}"
        return Path("locale", *rest[:-1], new_name)

    if ".translations" in parts:
        idx = parts.index(".translations")
        before = parts[: idx + 1]
        rest = parts[idx + 1 :]
        filename = rest[-1] if rest else "en.json"
        suffix = Path(filename).suffix or ".json"
        new_name = f"{language}{suffix}"
        return Path(*before, *rest[:-1], new_name)

    if parts and parts[0] == language:
        return path
    if parts and parts[0] == "en":
        parts = parts[1:]
    return Path(language, *parts)


def _load_payload(path: Path) -> list[dict]:
    if not path.exists():
        raise FileNotFoundError(f"Payload file not found: {path}")
    with path.open("r", encoding="utf-8") as handle:
        data = json.load(handle)
    if not isinstance(data, list):
        raise ValueError("Payload root must be a list")
    return data


COLON_PATTERN = re.compile(r'^(\s*[^:\n]+):[ \t]*([^\n]+)$', re.MULTILINE)
EXCLUDED_VALUE_PREFIXES = ('"', "'", '|', '>', '[', '{', '#')
INLINE_COLON_REGEX = re.compile(r'(?<=\w):(?=\s)')
INLINE_CODE_PATTERN = re.compile(r'`([^`\n]+)`')
FRONT_MATTER_DELIM = "---"
INLINE_FRONT_MATTER_RE = re.compile(
    r'([A-Za-z0-9_]+):\s*([^:]+?)(?=\s+[A-Za-z0-9_]+:|$)'
)
FM_LINE_RE = re.compile(r'^(\s*)([^:#]+):(.*)$')
INLINE_HEADER_RE = re.compile(r'^\s*##\s+(.*)$')
DECOR_LINE_RE = re.compile(r'^_+$')


def _sanitize_locale_text(text: str) -> str:
    def repl(match: re.Match[str]) -> str:
        key = match.group(1)
        value = match.group(2)
        stripped = value.lstrip()
        if not value or stripped.startswith(EXCLUDED_VALUE_PREFIXES):
            return match.group(0)
        sanitized = INLINE_COLON_REGEX.sub('', value)
        return f"{key}: {sanitized}"

    return COLON_PATTERN.sub(repl, text)


def _restore_code_fences(english: list[str], translated: list[str]) -> None:
    max_len = max(len(english), len(translated))
    if len(translated) < max_len:
        translated.extend([""] * (max_len - len(translated)))
    for idx, line in enumerate(english):
        stripped = line.strip()
        if stripped.startswith("```") or stripped.startswith("~~~"):
            translated[idx] = line


def _restore_inline_code(english: str, translated: str) -> str:
    tokens = INLINE_CODE_PATTERN.findall(english)
    for token in tokens:
        pattern = re.compile(rf"(?<!`){re.escape(token)}(?!`)")
        if f"`{token}`" in translated or not pattern.search(translated):
            continue
        translated = pattern.sub(rf"`{token}`", translated, count=1)
    return translated


def _restore_markdown_structure(path: Path, english: str, translated: str) -> str:
    if path.suffix.lower() not in {".md", ".markdown", ".mkd"}:
        return translated
    eng_lines = english.splitlines()
    trans_lines = translated.splitlines()
    trans_lines = _restore_front_matter(eng_lines, trans_lines)
    trans_lines = _collapse_duplicate_fences(trans_lines)
    _restore_code_fences(eng_lines, trans_lines)
    trans_lines = _ensure_mermaid_headers(eng_lines, trans_lines)
    restored = "\n".join(trans_lines)
    restored = _restore_inline_code(english, restored)
    return restored


def _extract_front_matter_values(lines: list[str]) -> tuple[dict[str, str], list[str]]:
    fm_lines, body = _split_front_matter(lines)
    if fm_lines:
        content = "\n".join(fm_lines[1:-1])
        try:
            data = yaml.safe_load(content) or {}
            if isinstance(data, dict):
                return {str(k): str(v) for k, v in data.items()}, body
        except Exception:
            pass
    values: dict[str, str] = {}
    remainder = lines[:]
    header_idx = None
    skip_until = 0
    for idx, line in enumerate(lines):
        stripped = line.strip()
        if not stripped:
            continue
        if DECOR_LINE_RE.match(stripped):
            skip_until = idx + 1
            continue
        match = INLINE_HEADER_RE.match(line)
        if match:
            header_idx = idx
            for m in INLINE_FRONT_MATTER_RE.finditer(match.group(1)):
                values[m.group(1)] = m.group(2).strip()
            break
        break
    if header_idx is not None:
        remainder = lines[header_idx + 1 :]
        while remainder and not remainder[0].strip():
            remainder = remainder[1:]
    elif skip_until:
        remainder = lines[skip_until:]
    return values, remainder


def _split_front_matter(lines: list[str]) -> tuple[list[str], list[str]]:
    if not lines:
        return [], lines
    start_idx = 0
    while start_idx < len(lines) and not lines[start_idx].strip():
        start_idx += 1
    if start_idx >= len(lines):
        return [], lines
    first = lines[start_idx].lstrip("\ufeff").strip()
    if first != FRONT_MATTER_DELIM:
        return [], lines
    for idx in range(start_idx + 1, len(lines)):
        if lines[idx].strip() == FRONT_MATTER_DELIM:
            return lines[start_idx : idx + 1], lines[idx + 1 :]
    return [], lines


def _restore_front_matter(eng_lines: list[str], trans_lines: list[str]) -> list[str]:
    eng_fm, _ = _split_front_matter(eng_lines)
    if not eng_fm:
        return trans_lines
    trans_fm, trans_body = _split_front_matter(trans_lines)
    if trans_fm:
        # Keep translated front matter as-is to avoid clobbering lists/values.
        return trans_fm + trans_body
    trans_values, remainder = _extract_front_matter_values(trans_lines)
    restored: list[str] = []
    for line in eng_fm:
        stripped = line.strip()
        if stripped == FRONT_MATTER_DELIM or stripped == "":
            restored.append(line)
            continue
        match = FM_LINE_RE.match(line)
        if match:
            indent, key, _ = match.groups()
            key_clean = key.strip()
            if key_clean in trans_values:
                restored.append(f"{indent}{key_clean}: {trans_values[key_clean]}")
                continue
        restored.append(line)
    return restored + remainder


def _collapse_duplicate_fences(lines: list[str]) -> list[str]:
    result: list[str] = []
    prev_fence = None
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("```") or stripped.startswith("~~~"):
            if stripped == prev_fence:
                continue
            prev_fence = stripped
        else:
            prev_fence = None
        result.append(line)
    return result


def _collect_mermaid_headers(lines: list[str]) -> list[str | None]:
    headers: list[str | None] = []
    idx = 0
    while idx < len(lines):
        if lines[idx].strip().startswith("```mermaid"):
            header: str | None = None
            search = idx + 1
            while search < len(lines):
                stripped = lines[search].strip()
                if not stripped:
                    search += 1
                    continue
                if stripped.startswith("```"):
                    break
                header = lines[search]
                break
            headers.append(header)
            end = search
            while end < len(lines):
                if lines[end].strip().startswith("```"):
                    end += 1
                    break
                end += 1
            idx = end
        else:
            idx += 1
    return headers


def _find_next_mermaid(lines: list[str], start: int) -> int | None:
    for idx in range(start, len(lines)):
        if lines[idx].strip().startswith("```mermaid"):
            return idx
    return None


def _repair_mermaid_block(
    lines: list[str], start_idx: int, english_header: str | None
) -> int:
    header_idx = start_idx + 1
    while header_idx < len(lines) and not lines[header_idx].strip():
        header_idx += 1

    if english_header:
        if header_idx >= len(lines) or lines[header_idx].strip().startswith("```"):
            lines.insert(header_idx, english_header)
            header_idx += 1
        else:
            lines[header_idx] = english_header
            header_idx += 1

    cur = header_idx
    closing_idx = None
    while cur < len(lines):
        stripped = lines[cur].strip()
        if stripped.startswith("```mermaid"):
            del lines[cur]
            continue
        if stripped.startswith("```"):
            closing_idx = cur
            break
        cur += 1

    if closing_idx is None:
        lines.append("```")
        closing_idx = len(lines) - 1

    if lines[closing_idx].strip() != "```":
        lines[closing_idx] = "```"

    after_close = closing_idx + 1
    if after_close >= len(lines) or lines[after_close].strip() != "":
        lines.insert(after_close, "")
        after_close += 1

    return after_close


def _ensure_mermaid_headers(eng_lines: list[str], trans_lines: list[str]) -> list[str]:
    headers = _collect_mermaid_headers(eng_lines)
    search_start = 0
    for english_header in headers:
        start_idx = _find_next_mermaid(trans_lines, search_start)
        if start_idx is None:
            break
        search_start = _repair_mermaid_block(trans_lines, start_idx, english_header)
    return trans_lines


def _overlay_locale(base, override):
    if isinstance(base, CommentedMap):
        result = CommentedMap()
        override_map = override if isinstance(override, dict) else CommentedMap()
        for key in base.keys():
            result[key] = _overlay_locale(base[key], override_map.get(key))
        for key, value in override_map.items():
            if key not in result:
                result[key] = value
        return result
    if isinstance(base, CommentedSeq):
        if isinstance(override, list):
            return override
        return base
    if override in (None, ""):
        return base
    return override


def _write_locale_translation(target: Path, translated_text: str) -> None:
    base_data = YAML_PARSER.load(EN_LOCALE.read_text(encoding="utf-8"))
    dest = REPO_ROOT / target
    if dest.exists():
        existing = YAML_PARSER.load(dest.read_text(encoding="utf-8")) or CommentedMap()
    else:
        existing = CommentedMap()
    try:
        override_data = YAML_PARSER.load(translated_text) or CommentedMap()
    except Exception:
        override_data = CommentedMap()

    merged = _overlay_locale(base_data, existing)
    merged = _overlay_locale(merged, override_data)

    dest = REPO_ROOT / target
    dest.parent.mkdir(parents=True, exist_ok=True)
    with dest.open("w", encoding="utf-8") as handle:
        YAML_PARSER.dump(merged, handle)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--payload",
        type=Path,
        default=DEFAULT_PAYLOAD,
        help="Path to the JSON payload produced by n8n",
    )
    parser.add_argument(
        "--languages",
        nargs="*",
        help="Optional whitelist of languages to inject (e.g. es fr pt)",
    )
    args = parser.parse_args()

    payload = _load_payload(args.payload)
    if not DOCS_ROOT.exists():
        raise FileNotFoundError(f"Docs root not found: {DOCS_ROOT}")

    requested = None
    if args.languages:
        requested = {_normalize_lang(lang) for lang in args.languages}

    written = {}

    for entry in payload:
        if entry.get("kind") == "block":
            continue
        lang_code = _normalize_lang(entry.get("target_language", ""))
        if not lang_code:
            raise ValueError("target_language missing in payload entry")
        if requested and lang_code not in requested:
            continue
        _ensure_language_scaffold(lang_code)
        _ensure_locale_file(lang_code)

        path_hint = entry.get("target_path") or entry.get("source_path")
        if not path_hint:
            raise ValueError("Payload entry missing source_path/target_path")
        target = _derive_target_path(path_hint, lang_code)
        translated_value = entry.get("translated_content")
        if not isinstance(translated_value, str):
            translated_value = entry.get("content") or ""
        translated = translated_value
        dest = REPO_ROOT / target
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(translated, encoding="utf-8")
        entry["translated_content"] = translated
        written.setdefault(lang_code, 0)
        written[lang_code] += 1

    if not QUIET:
        if not written:
            print("No files injected (check languages filter or payload)")
        else:
            for lang, count in sorted(written.items()):
                print(f"Injected {count} file(s) into {DOCS_ROOT/lang}")

    args.payload.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    return 0


if __name__ == "__main__":  # pragma: no cover
    raise SystemExit(main())
