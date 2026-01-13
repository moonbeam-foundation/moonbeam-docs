#!/usr/bin/env python3
"""Ensure translated Markdown front matter mirrors English files."""
from __future__ import annotations

import argparse
import os
from pathlib import Path

from paths import DOCS_ROOT, REPO_ROOT, repo_path
from inject_translations import (
    _is_language_dir,
    _restore_markdown_structure,
    _split_front_matter,
)

MARKDOWN_SUFFIXES = {".md", ".markdown", ".mkd"}
QUIET = os.environ.get("ROSE_QUIET", "").strip().lower() in {"1", "true", "yes", "on"}


def _iter_locale_files(language: str):
    lang_root = DOCS_ROOT / language
    if not lang_root.exists():
        return
    for path in lang_root.rglob("*"):
        if path.suffix.lower() in MARKDOWN_SUFFIXES and path.is_file():
            yield path


def _iter_target_files(paths: list[str]):
    seen: set[Path] = set()
    for raw in paths:
        candidate = raw.strip()
        if not candidate:
            continue
        path = repo_path(candidate)
        if path in seen:
            continue
        seen.add(path)
        if not path.exists():
            continue
        if path.suffix.lower() not in MARKDOWN_SUFFIXES:
            continue
        yield path


def _detect_language(path: Path) -> str | None:
    try:
        rel = path.relative_to(DOCS_ROOT)
    except ValueError:
        return None
    parts = rel.parts
    if not parts:
        return None
    lang = parts[0].lower()
    if lang == "en":
        return None
    if _is_language_dir(lang):
        return lang
    return None


def _english_counterpart(translated: Path, language: str) -> Path:
    rel = translated.relative_to(DOCS_ROOT)
    parts = list(rel.parts)
    if not parts or parts[0] != language:
        return translated
    english_rel = Path(*parts[1:])
    return DOCS_ROOT / english_rel


def _fix_file(path: Path, english_path: Path) -> bool:
    if not english_path.exists():
        return False
    english_text = english_path.read_text(encoding="utf-8")
    translated_text = path.read_text(encoding="utf-8")
    restored = _restore_markdown_structure(
        path.relative_to(REPO_ROOT), english_text, translated_text
    )
    restored = _dedupe_fences(restored)
    restored_lines = restored.splitlines()
    fm_lines, body = _split_front_matter(restored_lines)
    if fm_lines and (not body or body[0].strip() != ""):
        body = [""] + body
        restored = "\n".join(fm_lines + body)
    if restored.rstrip() == translated_text.rstrip():
        return False
    path.write_text(restored.rstrip() + "\n", encoding="utf-8")
    return True


def _dedupe_fences(text: str) -> str:
    lines = text.splitlines()
    result: list[str] = []
    inside_fence = False
    add_blank_after = False
    for line in lines:
        stripped = line.strip()
        if add_blank_after and stripped:
            if result and result[-1].strip() != "":
                result.append("")
            add_blank_after = False
        is_fence = stripped.startswith("```") or stripped.startswith("~~~")
        if is_fence:
            last_significant = next((ln.strip() for ln in reversed(result) if ln.strip()), "")
            if inside_fence:
                if last_significant == stripped:
                    continue
                result.append(line)
                inside_fence = False
                add_blank_after = True
            else:
                if result and result[-1].strip() != "":
                    result.append("")
                if last_significant == stripped:
                    continue
                result.append(line)
                inside_fence = True
            continue
        result.append(line)
    if add_blank_after:
        if result and result[-1].strip() != "":
            result.append("")
    return "\n".join(result)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--languages", nargs="*", default=[])
    parser.add_argument("--files", nargs="*", default=[])
    parser.add_argument("--file-list", type=Path)
    args = parser.parse_args()

    file_args: list[str] = []
    if args.file_list and args.file_list.exists():
        file_args.extend(
            [line.strip() for line in args.file_list.read_text(encoding="utf-8").splitlines()]
        )
    if args.files:
        file_args.extend(args.files)

    total = 0
    if file_args:
        for path in _iter_target_files(file_args):
            lang = _detect_language(path)
            if not lang:
                continue
            english_path = _english_counterpart(path, lang)
            if _fix_file(path, english_path):
                total += 1
    else:
        languages = args.languages or [p.name for p in DOCS_ROOT.iterdir() if p.is_dir()]
        for lang in languages:
            lang_lower = lang.lower()
            if lang_lower == "en":
                continue
            for path in _iter_locale_files(lang_lower):
                english_path = _english_counterpart(path, lang_lower)
                if _fix_file(path, english_path):
                    total += 1
    if not QUIET:
        print(f"Front matter fixes applied to {total} file(s)")
    return 0


if __name__ == "__main__":  # pragma: no cover
    raise SystemExit(main())
