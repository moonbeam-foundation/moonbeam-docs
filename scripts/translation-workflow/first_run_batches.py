#!/usr/bin/env python3
"""Build first-run translation batches for Rose.

This script is intended for workflow dispatch "first_run" mode:
- Finds source directories that contain only Markdown files and/or a `.nav.yml`
  file at that directory level.
- For each target language, selects directories whose translation counterpart
  directory doesn't exist yet under `<lang>/...`.
- Emits batches so the caller can run Rose in small, sequential directory groups.

Notes:
- This script only writes a plan JSON. It does not send anything to n8n.
- By default, it includes `.snippets/**` directories that contain underscore
  segments (e.g. `_common`, `_disclaimers`). Use `--exclude-snippet-private-dirs`
  to skip them.
"""

from __future__ import annotations

import argparse
import json
import os
from dataclasses import dataclass
from pathlib import Path


DEFAULT_EXCLUDE_DIRS = {
    ".git",
    ".github",
    ".venv",
    ".snippets",
    "locale",
    "node_modules",
    "scripts",
    "i18n",
    "images",
    "material-overrides",
}


@dataclass(frozen=True)
class Plan:
    batches_by_language: dict[str, list[list[str]]]
    missing_dirs_by_language: dict[str, list[str]]
    eligible_source_dirs: list[str]


def _parse_languages(raw: str) -> list[str]:
    tokens = [t.strip() for t in raw.replace(",", " ").split() if t.strip()]
    langs = []
    for token in tokens:
        langs.append(token.lower().replace("_", "-"))
    # de-dupe while preserving order
    seen = set()
    out = []
    for lang in langs:
        if lang not in seen:
            out.append(lang)
            seen.add(lang)
    return out


def _is_allowed_content_file(path: Path) -> bool:
    if not path.is_file():
        return False
    name = path.name
    if name.endswith(".nav.yml"):
        return True
    return path.suffix.lower() in {".md", ".markdown", ".mkd"}


def _is_eligible_content_dir(dir_path: Path) -> bool:
    if not dir_path.is_dir():
        return False
    files = [p for p in dir_path.iterdir() if p.is_file()]
    if not files:
        return False
    saw_allowed = False
    for file_path in files:
        if _is_allowed_content_file(file_path):
            saw_allowed = True
            continue
        return False
    return saw_allowed


def _chunk(items: list[str], size: int) -> list[list[str]]:
    if size <= 0:
        size = 1
    return [items[i : i + size] for i in range(0, len(items), size)]


def build_plan(repo_root: Path, languages: list[str], batch_size: int) -> Plan:
    # NOTE: plan generation is intentionally conservative; flags that expand the
    # search space are wired through `main()` to avoid changing defaults.
    languages_set = set(languages)
    exclude_roots = set(DEFAULT_EXCLUDE_DIRS) | languages_set

    eligible_dirs: list[str] = []

    for dir_path in sorted(repo_root.rglob("*")):
        if not dir_path.is_dir():
            continue
        try:
            rel = dir_path.relative_to(repo_root)
        except ValueError:
            continue
        if not rel.parts:
            continue
        if rel.parts[0] in exclude_roots:
            continue
        # Avoid descending into excluded roots
        if any(part in DEFAULT_EXCLUDE_DIRS for part in rel.parts):
            continue
        if _is_eligible_content_dir(dir_path):
            eligible_dirs.append(rel.as_posix())

    snippets_root = repo_root / ".snippets"
    include_snippets = os.environ.get("ROSE_FIRST_RUN_INCLUDE_SNIPPETS", "").strip().lower() in {"1", "true", "yes", "on"}
    raw_private = os.environ.get("ROSE_FIRST_RUN_INCLUDE_SNIPPET_PRIVATE_DIRS")
    include_private_snippets = True
    if raw_private is not None:
        include_private_snippets = raw_private.strip().lower() in {"1", "true", "yes", "on"}
    if include_snippets and snippets_root.exists() and snippets_root.is_dir():
        for dir_path in sorted(snippets_root.rglob("*")):
            if not dir_path.is_dir():
                continue
            try:
                rel_under = dir_path.relative_to(snippets_root)
            except ValueError:
                continue
            if not rel_under.parts:
                continue
            # Only include "private" snippet directories (e.g. `_common`, `_disclaimers`) when enabled.
            if not include_private_snippets and any(part.startswith("_") for part in rel_under.parts):
                continue
            if _is_eligible_content_dir(dir_path):
                eligible_dirs.append(Path(".snippets", rel_under).as_posix())

    eligible_dirs = sorted(set(eligible_dirs))

    missing_dirs_by_language: dict[str, list[str]] = {}
    batches_by_language: dict[str, list[list[str]]] = {}

    for lang in languages:
        missing: list[str] = []
        for rel_dir in eligible_dirs:
            translated_dir = repo_root / lang / rel_dir
            if not translated_dir.exists():
                missing.append(rel_dir)
        missing_dirs_by_language[lang] = missing
        batches_by_language[lang] = _chunk(missing, batch_size)

    return Plan(
        batches_by_language=batches_by_language,
        missing_dirs_by_language=missing_dirs_by_language,
        eligible_source_dirs=eligible_dirs,
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--languages",
        required=True,
        help="Space/comma-separated ISO language codes (e.g. 'es fr pt').",
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=int(os.environ.get("ROSE_FIRST_RUN_BATCH_SIZE", "1")),
        help="Number of directories per batch (default: 1).",
    )
    parser.add_argument(
        "--repo-root",
        default=".",
        help="Repo root to scan (default: current working directory).",
    )
    parser.add_argument(
        "--out",
        default="scripts/translations/first_run_plan.json",
        help="Where to write the plan JSON (default: scripts/translations/first_run_plan.json).",
    )
    parser.add_argument(
        "--include-snippets",
        action="store_true",
        help="Include `.snippets/**` directories in the plan (default: on).",
    )
    parser.add_argument(
        "--no-snippets",
        action="store_true",
        help="Do not include `.snippets/**` directories in the plan.",
    )
    parser.add_argument(
        "--include-snippet-private-dirs",
        action="store_true",
        help="Include `.snippets/**` directories with underscore segments (e.g. `_common`, `_disclaimers`).",
    )
    parser.add_argument(
        "--exclude-snippet-private-dirs",
        action="store_true",
        help="Exclude `.snippets/**` directories with underscore segments (e.g. `_common`, `_disclaimers`).",
    )
    args = parser.parse_args()

    langs = _parse_languages(args.languages)
    if not langs:
        raise SystemExit("At least one language code is required.")

    repo_root = Path(args.repo_root).resolve()
    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    # Thread flags into plan generation via env vars to keep build_plan's signature stable
    # (the GitHub Action calls this script and expects the output format only).
    include_snippets = True
    if args.include_snippets:
        include_snippets = True
    if args.no_snippets:
        include_snippets = False
    include_private_snippets = True
    if args.exclude_snippet_private_dirs:
        include_private_snippets = False
    if args.include_snippet_private_dirs:
        include_private_snippets = True

    os.environ["ROSE_FIRST_RUN_INCLUDE_SNIPPETS"] = "1" if include_snippets else "0"
    os.environ["ROSE_FIRST_RUN_INCLUDE_SNIPPET_PRIVATE_DIRS"] = "1" if include_private_snippets else "0"

    plan = build_plan(repo_root=repo_root, languages=langs, batch_size=args.batch_size)

    out_payload = {
        "languages": langs,
        "batch_size": args.batch_size,
        "eligible_source_dirs": plan.eligible_source_dirs,
        "missing_dirs_by_language": plan.missing_dirs_by_language,
        "batches_by_language": plan.batches_by_language,
    }
    out_path.write_text(json.dumps(out_payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(str(out_path))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
