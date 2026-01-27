#!/usr/bin/env python3
"""
Rewrite translated Markdown paths post-translation.

Goals:
- Make internal doc links relative (remove leading `/`) while leaving external URLs alone.
- Normalize snippet include paths so translated pages point to the correct per-language
  snippet tree under `.snippets/<lang>/...` (as used by this repo's MkDocs config).
- Fix `{target=_blank}` -> `{target=\\_blank}` (MkDocs attribute list escaping).
- Provide per-file + total logging.

This script is language-agnostic and site-agnostic. It assumes:
- English docs live at the docs root.
- Translated docs live under `<lang>/...` directories (e.g. `zh/...`).
- Snippet includes resolve relative to a `.snippets` base directory, so the canonical
  include paths are:
    - English:  `text/...` and `code/...`
    - <lang>:   `<lang>/text/...` and `<lang>/code/...`

Dry-run by default; pass `--write` to apply changes.
"""

from __future__ import annotations

import argparse
import re
from dataclasses import dataclass
from pathlib import Path


MD_EXTENSIONS = {".md", ".markdown", ".mkd"}

FENCE_RE = re.compile(r"^(?P<indent>[ \t]*)(?P<fence>`{3,}|~{3,})(?P<info>.*)$")
INCLUDE_RE = re.compile(r"(?P<prefix>--8<--\s*['\"])(?P<path>[^'\"]+)(?P<suffix>['\"])")

# Markdown links: [text](link) — keep it conservative.
MD_LINK_RE = re.compile(r"\]\((?P<link>[^)\s]+)(?P<rest>[^)]*)\)")


@dataclass
class RewriteStats:
    include_rewrites: int = 0
    internal_link_rewrites: int = 0
    target_blank_fixes: int = 0

    def total(self) -> int:
        return self.include_rewrites + self.internal_link_rewrites + self.target_blank_fixes


def _normalize_lang(code: str) -> str:
    return code.strip().lower().replace("-", "_")


def _iter_files(root: Path, paths: list[Path]) -> list[Path]:
    files: list[Path] = []

    def keep(p: Path) -> bool:
        if not p.is_file():
            return False
        if p.suffix.lower() not in MD_EXTENSIONS:
            return False
        # Never process index pages (they often contain special templating/structure).
        if p.name.lower() == "index.md":
            return False
        return True

    if not paths:
        for p in root.rglob("*"):
            if keep(p):
                files.append(p)
        return sorted(files)

    for t in paths:
        t = t if t.is_absolute() else (root / t)
        if t.is_file():
            if keep(t):
                files.append(t)
            continue
        if t.is_dir():
            for p in t.rglob("*"):
                if keep(p):
                    files.append(p)

    return sorted(set(files))


def _split_fenced_regions(lines: list[str]) -> list[tuple[bool, list[str]]]:
    """
    Returns a list of (in_fence, chunk_lines). Fence state toggles when seeing a fence line.
    The fence delimiter must match to close.
    """
    chunks: list[tuple[bool, list[str]]] = []
    buf: list[str] = []
    in_fence = False
    fence_delim = ""

    def flush() -> None:
        nonlocal buf
        if buf:
            chunks.append((in_fence, buf))
            buf = []

    for line in lines:
        m = FENCE_RE.match(line)
        if m:
            delim = m.group("fence")
            if not in_fence:
                flush()
                in_fence = True
                fence_delim = delim
                buf.append(line)
                continue
            if delim == fence_delim:
                buf.append(line)
                flush()
                in_fence = False
                fence_delim = ""
                continue
        buf.append(line)

    flush()
    return chunks


def _normalize_include_path(raw_path: str, lang: str) -> str:
    """
    Normalize snippet include paths to:
      - EN:  text/... or code/...
      - i18n: <lang>/text/... or <lang>/code/...
    while stripping legacy `.snippets` segments.
    """
    p = raw_path.strip().lstrip("./")
    p = p.lstrip("/")  # never keep absolute for includes

    # Strip leading language + legacy ".snippets"
    if p.startswith(f"{lang}/.snippets/"):
        p = p[len(f"{lang}/.snippets/") :]
    if p.startswith(f"{lang}/.snippets"):
        p = p[len(f"{lang}/.snippets") :].lstrip("/")
    if p.startswith(".snippets/"):
        p = p[len(".snippets/") :]
    if p.startswith(".snippets"):
        p = p[len(".snippets") :].lstrip("/")

    # If path already starts with <lang>/..., keep but normalize to <lang>/<text|code>/...
    if p.startswith(f"{lang}/"):
        rest = p[len(lang) + 1 :]
        if rest.startswith(("text/", "code/")):
            return f"{lang}/{rest}"
        return raw_path

    # Canonicalize: any include to text/... or code/... becomes <lang>/text/... or <lang>/code/...
    if p.startswith(("text/", "code/")):
        return f"{lang}/{p}"

    return raw_path


def _rewrite_snippet_includes(text: str, lang: str, stats: RewriteStats) -> str:
    def repl(m: re.Match) -> str:
        path = m.group("path")
        new_path = _normalize_include_path(path, lang)
        if new_path != path:
            stats.include_rewrites += 1
        return f"{m.group('prefix')}{new_path}{m.group('suffix')}"

    return INCLUDE_RE.sub(repl, text)


def _rewrite_internal_links(text: str, stats: RewriteStats) -> str:
    """
    Make internal links relative:
      ](/foo/bar) -> ](foo/bar)
    Keeps:
      - external URLs (http/https/mailto)
      - anchors-only (#...)
      - images under /images/
    """

    def repl(m: re.Match) -> str:
        link = m.group("link")
        rest = m.group("rest") or ""
        if link.startswith("#"):
            return m.group(0)
        if re.match(r"^(?:https?:|mailto:)", link, re.I):
            return m.group(0)
        if link.startswith("/images/"):
            return m.group(0)
        if link.startswith("/"):
            stats.internal_link_rewrites += 1
            link = link[1:]
        return f"]({link}{rest})"

    return MD_LINK_RE.sub(repl, text)


def _fix_target_blank(text: str, stats: RewriteStats) -> str:
    before_count = text.count("{target=_blank}")
    if before_count:
        stats.target_blank_fixes += before_count
        text = text.replace("{target=_blank}", "{target=\\_blank}")
    return text


def rewrite_markdown(path: Path, lang: str) -> tuple[str, RewriteStats]:
    original = path.read_text(encoding="utf-8")
    lines = original.splitlines()

    stats = RewriteStats()
    chunks = _split_fenced_regions(lines)
    out_lines: list[str] = []

    for in_fence, chunk_lines in chunks:
        chunk_text = "\n".join(chunk_lines)
        if not in_fence:
            chunk_text = _rewrite_snippet_includes(chunk_text, lang, stats)
            chunk_text = _rewrite_internal_links(chunk_text, stats)
            chunk_text = _fix_target_blank(chunk_text, stats)
        out_lines.append(chunk_text)

    updated = "\n".join(out_lines).rstrip("\n") + "\n"
    return updated, stats


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument(
        "--docs-root",
        type=Path,
        default=".",
        help="Docs root (contains language dirs like zh/). Default: current directory.",
    )
    ap.add_argument(
        "--languages",
        required=True,
        help="Space/comma separated language codes to rewrite (e.g. 'zh es').",
    )
    ap.add_argument(
        "--paths",
        type=Path,
        nargs="*",
        default=None,
        help="Optional file/dir paths (relative to docs root). Default: rewrite all <lang>/**/*.md.",
    )
    ap.add_argument("--write", action="store_true", help="Apply changes (default: dry-run).")
    args = ap.parse_args()

    docs_root = args.docs_root.resolve()
    if not docs_root.exists() or not docs_root.is_dir():
        raise SystemExit(f"--docs-root is not a directory: {docs_root}")

    langs = [token.strip() for token in args.languages.replace(",", " ").split() if token.strip()]
    langs = [_normalize_lang(l) for l in langs]

    total_files_scanned = 0
    total_files_with_changes = 0
    total_files_written = 0
    total_stats = RewriteStats()

    for lang in langs:
        lang_dir = docs_root / lang
        if not lang_dir.exists():
            print(f"Skip lang={lang}: directory not found: {lang_dir}")
            continue

        targets = [Path(p) for p in (args.paths or [lang])]
        md_files = _iter_files(docs_root, targets)

        for p in md_files:
            # Only touch the language subtree
            try:
                p.relative_to(lang_dir)
            except ValueError:
                continue

            total_files_scanned += 1
            updated, stats = rewrite_markdown(p, lang)
            if stats.total() == 0:
                continue

            total_files_with_changes += 1
            mode = "Updated" if args.write else "Would update"
            print(
                f"{mode} {p.relative_to(docs_root)} "
                f"(includes={stats.include_rewrites}, links={stats.internal_link_rewrites}, target_blank={stats.target_blank_fixes})"
            )

            total_stats.include_rewrites += stats.include_rewrites
            total_stats.internal_link_rewrites += stats.internal_link_rewrites
            total_stats.target_blank_fixes += stats.target_blank_fixes

            if args.write:
                p.write_text(updated, encoding="utf-8")
                total_files_written += 1

    print(
        "Done. Files scanned: {scanned}. Files with changes: {changed}. Files written: {written}. "
        "include_rewrites={inc}, internal_link_rewrites={lnk}, target_blank_fixes={tb}.".format(
            scanned=total_files_scanned,
            changed=total_files_with_changes,
            written=total_files_written,
            inc=total_stats.include_rewrites,
            lnk=total_stats.internal_link_rewrites,
            tb=total_stats.target_blank_fixes,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
