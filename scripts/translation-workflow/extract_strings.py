#!/usr/bin/env python3
"""Ingest an n8n payload and generate staging files + temporary .po catalogs."""
from __future__ import annotations

import argparse
import json
import os
import sys
from collections import defaultdict
from pathlib import Path

from babel.messages.catalog import Catalog
from babel.messages.pofile import write_po

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_PAYLOAD = ROOT / "translations" / "payload.json"
TRANSLATIONS_ROOT = ROOT / "translations"
TMP_ROOT = ROOT / "tmp" / "i18n"
QUIET = os.environ.get("ROSE_QUIET", "").strip().lower() in {"1", "true", "yes", "on"}


def _normalize_lang(code: str) -> str:
    return code.strip().lower().replace("-", "_")


def _rel_path(doc_path: str) -> Path:
    path = Path(doc_path)
    parts = list(path.parts)
    if parts[:2] == ["docs", "en"] and len(parts) > 2:
        return Path(*parts[2:])
    if parts and parts[0] == "docs" and len(parts) > 2:
        return Path(*parts[2:])
    return path


def _load_payload(path: Path) -> list[dict]:
    if not path.exists():
        raise FileNotFoundError(f"Payload file not found: {path}")
    with path.open("r", encoding="utf-8") as handle:
        data = json.load(handle)
    if not isinstance(data, list):  # pragma: no cover - sanity guard
        raise ValueError("Payload root must be a list")
    return data


def _write_catalog(locale: str, catalog: Catalog) -> Path:
    locale_dir = TMP_ROOT / locale / "LC_MESSAGES"
    locale_dir.mkdir(parents=True, exist_ok=True)
    po_path = locale_dir / "messages.po"
    with po_path.open("wb") as handle:
        write_po(handle, catalog, width=80)
    return po_path


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--payload",
        type=Path,
        default=DEFAULT_PAYLOAD,
        help="Path to the JSON payload produced by n8n",
    )
    args = parser.parse_args()

    payload = _load_payload(args.payload)
    TRANSLATIONS_ROOT.mkdir(parents=True, exist_ok=True)

    english_root = TRANSLATIONS_ROOT / "en"
    english_root.mkdir(parents=True, exist_ok=True)

    english_catalog = Catalog(locale="en", domain="messages")
    catalogs: dict[str, Catalog] = {}
    english_written: set[Path] = set()
    translation_written: dict[str, set[Path]] = defaultdict(set)

    for item in payload:
        if item.get("kind") == "block":
            continue
        source_path = item.get("source_path")
        if not source_path:
            raise ValueError("Each payload entry requires 'source_path'")
        rel_path = _rel_path(source_path)

        english_text = (item.get("content_original") or "").rstrip() + "\n"
        if rel_path not in english_written:
            dest = english_root / rel_path
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_text(english_text, encoding="utf-8")
            english_catalog.add(english_text, context=str(rel_path))
            english_written.add(rel_path)

        lang_code = _normalize_lang(item.get("target_language", ""))
        if not lang_code:
            raise ValueError(f"Missing target_language for {source_path}")

        translation_text = (item.get("content") or "").rstrip() + "\n"
        lang_file = TRANSLATIONS_ROOT / lang_code / rel_path
        if rel_path not in translation_written[lang_code]:
            lang_file.parent.mkdir(parents=True, exist_ok=True)
            lang_file.write_text(translation_text, encoding="utf-8")
            translation_written[lang_code].add(rel_path)

        catalog = catalogs.setdefault(lang_code, Catalog(locale=lang_code, domain="messages"))
        message = catalog.get(english_text, context=str(rel_path))
        if message is None:
            catalog.add(english_text, translation_text, context=str(rel_path))
        else:
            message.string = translation_text

    TMP_ROOT.mkdir(parents=True, exist_ok=True)
    en_po = _write_catalog("en", english_catalog)
    other_pos = [_write_catalog(lang, catalog) for lang, catalog in catalogs.items()]

    if not QUIET:
        print(f"Wrote {len(english_written)} English sources to {english_root}")
        for lang, files in translation_written.items():
            print(f"Wrote {len(files)} sources for '{lang}' -> {TRANSLATIONS_ROOT/lang}")
        print(f"English catalog: {en_po}")
        for po_path in other_pos:
            print(f"Locale catalog: {po_path}")
    return 0


if __name__ == "__main__":  # pragma: no cover
    raise SystemExit(main())
