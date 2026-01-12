#!/usr/bin/env python3
"""Normalize locale/*.yml formatting so diffs stay clean."""
from __future__ import annotations

from pathlib import Path
import os
import re

from ruamel.yaml import YAML
from ruamel.yaml.scalarstring import ScalarString

ROOT = Path(__file__).resolve().parents[1]
REPO_ROOT = ROOT.parent
LOCALE_DIR = REPO_ROOT / "tanssi-docs" / "locale"
QUIET = os.environ.get("ROSE_QUIET", "").strip().lower() in {"1", "true", "yes", "on"}


def _iter_locale_files() -> list[Path]:
    return [path for path in sorted(LOCALE_DIR.glob("*.yml")) if path.name != "en.yml"]


INLINE_COLON_REGEX = re.compile(r'(?<=\w):(?=\s)')


def _clean_inline_colons(text: str) -> str:
    return INLINE_COLON_REGEX.sub('', text)


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
    if not LOCALE_DIR.exists():
        return 0

    yaml = YAML()
    yaml.indent(mapping=2, sequence=4, offset=2)
    yaml.preserve_quotes = True

    for path in _iter_locale_files():
        _format_file(path, yaml)
        if not QUIET:
            print(f"Formatted {path.relative_to(REPO_ROOT)}")
    return 0


if __name__ == "__main__":  # pragma: no cover
    raise SystemExit(main())
