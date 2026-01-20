#!/usr/bin/env python3
"""Normalize locale/*.yml formatting so diffs stay clean."""
from __future__ import annotations

import argparse
import os
import re
from pathlib import Path

from ruamel.yaml import YAML
from ruamel.yaml.scalarstring import ScalarString

from paths import DOCS_ROOT, repo_path, repo_relative_str

LOCALE_DIR = DOCS_ROOT / "locale"
QUIET = os.environ.get("ROSE_QUIET", "").strip().lower() in {"1", "true", "yes", "on"}
LOCALE_SUFFIXES = {".yml", ".yaml"}


def _read_file_list(path: Path) -> list[str]:
    if not path.exists():
        return []
    return [line.strip() for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]


def _coerce_path(raw: str) -> Path:
    candidate = Path(raw)
    if candidate.is_absolute():
        return candidate
    return repo_path(candidate)


def _iter_locale_files(paths: list[Path] | None) -> list[Path]:
    if paths is not None:
        return paths
    if not LOCALE_DIR.exists():
        return []
    return [
        path
        for path in sorted(LOCALE_DIR.glob("*.yml"))
        if path.name != "en.yml"
    ]


def _collect_targets(args: argparse.Namespace) -> list[Path] | None:
    raw_paths: list[str] = []
    if args.file_list:
        raw_paths.extend(_read_file_list(args.file_list))
    if args.paths:
        raw_paths.extend(args.paths)
    if not raw_paths:
        return None
    targets: list[Path] = []
    seen: set[Path] = set()
    for raw in raw_paths:
        candidate = _coerce_path(raw)
        if candidate.suffix.lower() not in LOCALE_SUFFIXES:
            continue
        if candidate.name == "en.yml":
            continue
        if not candidate.exists():
            continue
        if candidate in seen:
            continue
        seen.add(candidate)
        targets.append(candidate)
    return targets


INLINE_COLON_REGEX = re.compile(r"(?<=\w):(?=\s)")


def _clean_inline_colons(text: str) -> str:
    return INLINE_COLON_REGEX.sub("", text)


def _normalize_scalars(node):
    if isinstance(node, dict):
        for key, value in node.items():
            node[key] = _normalize_scalars(value)
        return node
    if isinstance(node, list):
        return [_normalize_scalars(item) for item in node]
    if isinstance(node, ScalarString):
        text = str(node)
        if ":" in text and getattr(node, "style", None) is None:
            node.value = _clean_inline_colons(text)
        return node
    if isinstance(node, str) and ":" in node:
        return _clean_inline_colons(node)
    return node


def _format_file(path: Path, yaml: YAML) -> None:
    text = path.read_text(encoding="utf-8")
    if not text.strip():
        return
    data = yaml.load(text)
    data = _normalize_scalars(data)
    with path.open("w", encoding="utf-8") as handle:
        yaml.dump(data, handle)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--file-list",
        type=Path,
        help="Optional newline-delimited list of locale files to format",
    )
    parser.add_argument(
        "paths",
        nargs="*",
        help="Optional locale files to format",
    )
    args = parser.parse_args()

    targets = _collect_targets(args)
    if targets is None and not LOCALE_DIR.exists():
        return 0
    if targets == []:
        return 0

    yaml = YAML()
    yaml.indent(mapping=2, sequence=4, offset=2)
    yaml.preserve_quotes = True

    for path in _iter_locale_files(targets):
        _format_file(path, yaml)
        if not QUIET:
            print(f"Formatted {repo_relative_str(path)}")
    return 0


if __name__ == "__main__":  # pragma: no cover
    raise SystemExit(main())
