#!/usr/bin/env python3
"""Scan templates for translation keys and sync locale resources automatically."""
from __future__ import annotations

import argparse
import json
import os
import re
from collections import defaultdict
from pathlib import Path
from typing import Dict, List, Tuple

import yaml

from paths import DOCS_ROOT, MATERIAL_OVERRIDES_ROOT, TRANSLATIONS_JSON_ROOT, repo_path

LOCALE_DIR = DOCS_ROOT / "locale"
TRANSLATIONS_DIR = TRANSLATIONS_JSON_ROOT
TEMPLATE_ROOT = MATERIAL_OVERRIDES_ROOT
QUIET = os.environ.get("ROSE_QUIET", "").strip().lower() in {"1", "true", "yes", "on"}
LOCALE_SUFFIXES = {".yml", ".yaml"}

TRANS_KEY_RE = re.compile(r"(?<![\w.])(?:trans|t)\(\s*['\"]([A-Za-z0-9_.-]+)['\"]\s*\)")
THEME_ALWAYS_USED_PREFIXES = (
    "action.",
    "feedback.",
    "footer.",
    "error.",
    "meta.",
    "home.",
)


def _load_yaml(path: Path) -> Dict:
    if not path.exists():
        return {}
    with path.open("r", encoding="utf-8") as handle:
        return yaml.safe_load(handle) or {}


def _write_yaml(path: Path, data: Dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        yaml.dump(data, handle, allow_unicode=True, sort_keys=False)


def _load_json(path: Path) -> Dict:
    if not path.exists():
        return {}
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def _write_json(path: Path, data: Dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        json.dump(data, handle, ensure_ascii=False, indent=2)


def _flatten_keys(data: Dict, prefix: str = "") -> Dict[str, str]:
    flat: Dict[str, str] = {}
    for key, value in data.items():
        new_prefix = f"{prefix}.{key}" if prefix else str(key)
        if isinstance(value, dict):
            flat.update(_flatten_keys(value, new_prefix))
        else:
            flat[new_prefix] = value
    return flat


def _set_nested(data: Dict, path: str, value: str) -> None:
    parts = path.split(".")
    cur = data
    for part in parts[:-1]:
        cur = cur.setdefault(part, {})
    cur[parts[-1]] = value


def _scan_templates() -> Dict[str, List[Path]]:
    key_usage: Dict[str, List[Path]] = defaultdict(list)
    for template in TEMPLATE_ROOT.rglob("*.html"):
        text = template.read_text(encoding="utf-8")
        for match in TRANS_KEY_RE.finditer(text):
            key_usage[match.group(1)].append(template)
    for template in TEMPLATE_ROOT.rglob("*.jinja*"):
        text = template.read_text(encoding="utf-8")
        for match in TRANS_KEY_RE.finditer(text):
            key_usage[match.group(1)].append(template)
    return key_usage


def _read_file_list(path: Path) -> List[str]:
    if not path.exists():
        return []
    return [line.strip() for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]


def _coerce_path(raw: str) -> Path:
    candidate = Path(raw)
    if candidate.is_absolute():
        return candidate
    return repo_path(candidate)


def _collect_allowed_paths(args: argparse.Namespace) -> set[Path] | None:
    raw_paths: List[str] = []
    if args.file_list:
        raw_paths.extend(_read_file_list(args.file_list))
    if args.paths:
        raw_paths.extend(args.paths)
    if not raw_paths:
        return None
    allowed: set[Path] = set()
    for raw in raw_paths:
        candidate = _coerce_path(raw)
        if candidate.suffix.lower() not in LOCALE_SUFFIXES:
            continue
        if not candidate.exists():
            continue
        allowed.add(candidate.resolve())
    return allowed


def _is_allowed(path: Path, allowed: set[Path] | None) -> bool:
    if allowed is None:
        return True
    return path.resolve() in allowed


def _sync_locale_files(
    key_usage: Dict[str, List[Path]],
    allowed_paths: set[Path] | None,
) -> Tuple[Dict[str, int], List[str]]:
    if not LOCALE_DIR.exists():
        return {}, []
    en_path = LOCALE_DIR / "en.yml"
    if not en_path.exists():
        return {}, []
    if allowed_paths is not None and not allowed_paths:
        return {}, []
    english_yaml = _load_yaml(en_path)
    english_flat = _flatten_keys(english_yaml)
    added_per_locale: Dict[str, int] = defaultdict(int)
    allow_en = _is_allowed(en_path, allowed_paths)

    # Ensure template keys exist in English locale
    if allow_en:
        for key in key_usage:
            if key not in english_flat:
                placeholder = key.replace(".", " ")
                _set_nested(english_yaml, key, placeholder)
                english_flat[key] = placeholder
                added_per_locale["en"] += 1
        if added_per_locale.get("en"):
            _write_yaml(en_path, english_yaml)

    for locale_file in LOCALE_DIR.glob("*.yml"):
        if locale_file.name == "en.yml":
            continue
        if not _is_allowed(locale_file, allowed_paths):
            continue
        locale_data = _load_yaml(locale_file)
        locale_flat = _flatten_keys(locale_data)
        for key, value in english_flat.items():
            if key not in locale_flat:
                _set_nested(locale_data, key, value)
                locale_flat[key] = value
                added_per_locale[locale_file.stem] += 1
        if added_per_locale.get(locale_file.stem):
            _write_yaml(locale_file, locale_data)

    allowed_stems = None
    if allowed_paths is not None:
        allowed_stems = {
            path.stem
            for path in allowed_paths
            if path.suffix.lower() in LOCALE_SUFFIXES
        }
    for locale_file in TRANSLATIONS_DIR.glob("*.json"):
        if allowed_stems is not None and locale_file.stem not in allowed_stems:
            continue
        locale_data = _load_json(locale_file)
        for key, value in english_flat.items():
            if key not in locale_data:
                locale_data[key] = value
                added_per_locale[locale_file.stem] += 1
        if added_per_locale.get(locale_file.stem):
            _write_json(locale_file, locale_data)

    unused_keys: List[str] = [key for key in english_flat if key not in key_usage]
    filtered_unused: List[str] = []
    for key in unused_keys:
        if key == "meta.home_title":
            # Special-case legacy key referenced by Material theme
            continue
        if any(key.startswith(prefix) for prefix in THEME_ALWAYS_USED_PREFIXES):
            continue
        filtered_unused.append(key)
    unused_keys = filtered_unused
    return added_per_locale, unused_keys


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--report",
        type=Path,
        help="Optional JSON file to write locale sync results to",
    )
    parser.add_argument(
        "--file-list",
        type=Path,
        help="Optional newline-delimited list of locale files to update",
    )
    parser.add_argument(
        "paths",
        nargs="*",
        help="Optional locale files to update",
    )
    args = parser.parse_args()

    allowed_paths = _collect_allowed_paths(args)
    key_usage = _scan_templates()
    added_per_locale, unused_keys = _sync_locale_files(key_usage, allowed_paths)

    if not QUIET:
        print("Locale sync completed.")
        for locale, count in sorted(added_per_locale.items()):
            print(f"  {locale}: added {count} key(s)")
        if unused_keys:
            print("Keys present in locale files but unused in templates:")
            for key in sorted(unused_keys):
                print(f"  - {key} (unused)")

    if args.report:
        report = {
            "added_per_locale": dict(added_per_locale),
            "unused_keys": sorted(unused_keys),
        }
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(
            json.dumps(report, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )

    return 0


if __name__ == "__main__":  # pragma: no cover
    raise SystemExit(main())
