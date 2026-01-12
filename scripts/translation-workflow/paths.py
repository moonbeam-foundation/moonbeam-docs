#!/usr/bin/env python3
"""Shared path helpers so scripts work inside or beside the MkDocs repo."""
from __future__ import annotations

from pathlib import Path

TRANSLATION_ROOT = Path(__file__).resolve().parents[1]


def _detect_repo_root() -> Path:
    for candidate in [TRANSLATION_ROOT] + list(TRANSLATION_ROOT.parents):
        if (candidate / ".git").exists():
            return candidate
    raise RuntimeError(
        "Unable to locate a git repository for translation workflow helpers. "
        "Ensure translation-workflow lives inside the docs repo."
    )


REPO_ROOT = _detect_repo_root()
REPO_NAME = REPO_ROOT.name
DOCS_ROOT = REPO_ROOT


def _locate_path(*segments: str) -> Path:
    for base in [REPO_ROOT, REPO_ROOT.parent, REPO_ROOT.parent.parent]:
        candidate = base.joinpath(*segments)
        if candidate.exists():
            return candidate
    return REPO_ROOT.joinpath(*segments)


MATERIAL_OVERRIDES_ROOT = _locate_path("material-overrides")
TRANSLATIONS_JSON_ROOT = _locate_path("material-overrides", ".translations")


def repo_relative(path: str | Path) -> Path:
    """Return a path relative to the docs repo root, stripping leading repo dir if present."""
    candidate = Path(path)
    if candidate.is_absolute():
        try:
            return candidate.relative_to(REPO_ROOT)
        except ValueError:
            parts = candidate.parts
            if REPO_NAME in parts:
                idx = parts.index(REPO_NAME)
                return Path(*parts[idx + 1 :])
            return candidate
    parts = candidate.parts
    if REPO_NAME in parts:
        idx = parts.index(REPO_NAME)
        candidate = Path(*parts[idx + 1 :])
    return candidate


def repo_relative_str(path: str | Path) -> str:
    return repo_relative(path).as_posix()


def repo_path(path: str | Path) -> Path:
    """Join the repo root with a repo-relative path."""
    return REPO_ROOT / repo_relative(path)
