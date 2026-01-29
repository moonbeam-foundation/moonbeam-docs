#!/usr/bin/env python3
"""
Extract Markdown code/terminal fences and selected raw HTML blocks into `.snippets` files.

Defaults to DRY-RUN (no writes). Use `--write` to apply.

What it handles:
1) Fenced code blocks: ```js / ```py / ```bash / etc.
   - Replaces the block body with `--8<-- '<include>'` while keeping the original fences.
   - Skips fenced blocks that already contain a `--8<--` include.

2) Terminal-like text blocks: ```text / ```plaintext
   - Only extracted if they look like commands/logs/errors (heuristic).
   - Stored as `.txt` and kept inside the original fence.

3) Raw HTML blocks outside fences: <div>...</div>, <script>...</script>, <style>...</style
   - Extracts the entire HTML block into a `.html` snippet.
   - Replaces the HTML block with a single `--8<-- '<include>'` line (unfenced),
     so it can still render as HTML in the page.
   - Disabled by default; enable with `--include-html-blocks`.

4) Optional: wrap bare code includes in fences (`--wrap-code-includes`)
   - Converts a bare include line like:
       --8<-- 'zh/code/foo/bar.js'
     into:
       ```js
       --8<-- 'zh/code/foo/bar.js'
       ```
   - Does NOT wrap:
     - text/... includes
     - code/... includes ending in .md / .markdown (often already formatted terminal snippets)
     - code/... includes ending in .html (these should render, not be shown as code)
     - anything already inside a fenced code block

Snippet layout (site + language agnostic):
- English docs (no leading language dir):  <docs_root>/.snippets/code/<doc_rel_without_ext>/<N>.<ext>
- Language docs (<lang>/...):             <docs_root>/.snippets/<lang>/code/<doc_rel_without_lang_without_ext>/<N>.<ext>

Include paths written back into Markdown:
- English: code/<doc_rel_without_ext>/<N>.<ext>
- Lang:    <lang>/code/<doc_rel_without_lang_without_ext>/<N>.<ext>

Shared code snippets across languages
------------------------------------
If you want translated pages (e.g. `zh/...`) to reference the same shared `code/...` snippets
as the English source (instead of creating `zh/code/...` duplicates), run the extraction on
the English page first (to create the snippet files), then rewrite the translated page in
reference mode (no snippet files created):

  1) English (creates `.snippets/code/...`):
     python3 scripts/extract-code-blocks-to-snippets.py --docs-root . --paths <english.md> --write

  2) Translated (rewrites fences to `--8<-- 'code/...` by matching content, no new snippets):
     python3 scripts/extract-code-blocks-to-snippets.py --docs-root . --paths <lang>/<page>.md --write --lang-code-snippets reference-english
"""

from __future__ import annotations

import argparse
import re
from dataclasses import dataclass
from pathlib import Path


LANG_DIR_RE = re.compile(r"^[a-z]{2}(?:[-_][a-z0-9]+)?$", re.I)
MD_EXTENSIONS = {".md", ".markdown", ".mkd"}

# Matches opening/closing fences. Opening has optional info; closing usually has none.
FENCE_LINE_RE = re.compile(r"^(?P<indent>[ \t]*)(?P<fence>`{3,}|~{3,})(?P<info>[^\n]*)\s*$")
INCLUDE_CAPTURE_RE = re.compile(r"^(?P<indent>[ \t]*)--8<--\s+['\"](?P<path>[^'\"]+)['\"]\s*$")

HTML_BLOCK_START_RE = re.compile(r"^(?P<indent>[ \t]*)<(?P<tag>div|script|style)\b", re.I)


INFO_TO_EXT: dict[str, str] = {
    "javascript": "js",
    "js": "js",
    "typescript": "ts",
    "ts": "ts",
    "python": "py",
    "py": "py",
    "bash": "sh",
    "sh": "sh",
    "shell": "sh",
    "zsh": "sh",
    "json": "json",
    "yaml": "yml",
    "yml": "yml",
    "toml": "toml",
    "ini": "ini",
    "solidity": "sol",
    "sol": "sol",
    "rust": "rs",
    "rs": "rs",
    "go": "go",
    "java": "java",
    "kotlin": "kt",
    "kt": "kt",
    "csharp": "cs",
    "cs": "cs",
    "sql": "sql",
    "graphql": "graphql",
    "text": "txt",
    "plaintext": "txt",
}


def _normalize_lang(code: str) -> str:
    return code.strip().lower().replace("-", "_")


def _is_lang_dir(name: str) -> bool:
    return bool(LANG_DIR_RE.match(name))


def _detect_language_dirs(docs_root: Path) -> set[str]:
    langs: set[str] = set()
    for child in docs_root.iterdir():
        if not child.is_dir():
            continue
        name = child.name
        if name.startswith("."):
            continue
        if _is_lang_dir(name):
            langs.add(_normalize_lang(name))
    return langs


def _looks_like_terminal_text(code_lines: list[str]) -> bool:
    for line in code_lines:
        s = line.strip()
        if not s:
            continue
        if s.startswith(("$", ">", "#")):
            return True
        if re.match(r"^[A-Za-z0-9_.-]+@[^:]+:~?[/\\]?", s):
            return True
        # Common hashes/txids shown as "terminal-like" examples
        if re.fullmatch(r"0x[0-9a-fA-F]{16,}", s):
            return True
        if re.fullmatch(r"[0-9a-fA-F]{32,}", s):
            return True
        if re.match(r"^(?:INFO|WARNING|WARN|ERROR|DEBUG|TRACE|FATAL)\b", s):
            return True
        if re.match(r"^\[\d{2}:\d{2}:\d{2}(?:\.\d+)?\]", s):
            return True
        if s.startswith(("Traceback (most recent call last):", "Exception:", "OSError:", "panic:")):
            return True
        if re.search(r"\b(curl|npm|yarn|pnpm|node|python3?|pip|journalctl|docker|kubectl|git)\b", s):
            return True
    return False


def _code_fence_info_from_ext(ext: str) -> str | None:
    ext = ext.lower().lstrip(".")
    return {
        "js": "js",
        "ts": "ts",
        "py": "py",
        "sh": "bash",
        "json": "json",
        "yml": "yaml",
        "yaml": "yaml",
        "toml": "toml",
        "ini": "ini",
        "sol": "solidity",
        "rs": "rust",
        "go": "go",
        "java": "java",
        "kt": "kotlin",
        "cs": "csharp",
        "sql": "sql",
        "graphql": "graphql",
        "txt": "text",
    }.get(ext)


def _should_wrap_include_as_code(include_path: str, known_langs: set[str]) -> str | None:
    p = include_path.strip().lstrip("./")
    parts = p.split("/")

    # Strip language prefix if present
    if parts and _normalize_lang(parts[0]) in known_langs:
        parts = parts[1:]
    if not parts:
        return None

    if parts[0] == "text":
        return None
    if parts[0] != "code":
        return None

    filename = parts[-1]
    if "." not in filename:
        return None
    ext = filename.rsplit(".", 1)[-1].lower()
    if ext in {"md", "markdown", "html"}:
        return None
    return _code_fence_info_from_ext(ext)


@dataclass(frozen=True)
class FencedBlock:
    start_line: int  # inclusive
    end_line: int  # inclusive
    indent: str
    fence: str
    info: str
    code_lines: list[str]  # inside the fence, de-indented


def _parse_fenced_blocks(lines: list[str]) -> list[FencedBlock]:
    blocks: list[FencedBlock] = []
    i = 0
    while i < len(lines):
        m = FENCE_LINE_RE.match(lines[i])
        if not m:
            i += 1
            continue

        indent = m.group("indent") or ""
        fence = m.group("fence")
        info = (m.group("info") or "").strip()
        if not info:
            i += 1
            continue

        j = i + 1
        while j < len(lines):
            m2 = FENCE_LINE_RE.match(lines[j])
            if m2 and m2.group("fence") == fence and (m2.group("info") or "").strip() == "":
                break
            j += 1
        if j >= len(lines):
            break

        code_lines = [l[len(indent) :] if l.startswith(indent) else l for l in lines[i + 1 : j]]
        blocks.append(
            FencedBlock(
                start_line=i,
                end_line=j,
                indent=indent,
                fence=fence,
                info=info,
                code_lines=code_lines,
            )
        )
        i = j + 1
    return blocks


def _find_html_blocks(lines: list[str]) -> list[tuple[int, int, str]]:
    blocks: list[tuple[int, int, str]] = []
    in_fence = False
    fence_delim = ""

    i = 0
    while i < len(lines):
        # Track fenced blocks to avoid extracting HTML inside code.
        m_f = FENCE_LINE_RE.match(lines[i])
        if m_f:
            delim = m_f.group("fence")
            if not in_fence:
                in_fence = True
                fence_delim = delim
            elif fence_delim == delim:
                in_fence = False
                fence_delim = ""
            i += 1
            continue

        if in_fence:
            i += 1
            continue

        m = HTML_BLOCK_START_RE.match(lines[i])
        if not m:
            i += 1
            continue

        indent = m.group("indent") or ""
        tag = (m.group("tag") or "").lower()

        if tag == "div":
            depth = 0
            j = i
            while j < len(lines):
                if FENCE_LINE_RE.match(lines[j]):
                    break
                lower = lines[j].lower()
                depth += lower.count("<div")
                depth -= lower.count("</div")
                if depth <= 0 and "</div" in lower:
                    blocks.append((i, j, indent))
                    i = j + 1
                    break
                j += 1
            else:
                i += 1
            continue

        close = f"</{tag}>"
        j = i
        while j < len(lines):
            if FENCE_LINE_RE.match(lines[j]):
                break
            if close in lines[j].lower().replace(" ", ""):
                blocks.append((i, j, indent))
                i = j + 1
                break
            if re.search(rf"</{tag}\s*>", lines[j], flags=re.I):
                blocks.append((i, j, indent))
                i = j + 1
                break
            j += 1
        else:
            i += 1

    return blocks


def _max_numeric_prefix(dir_path: Path) -> int:
    if not dir_path.exists() or not dir_path.is_dir():
        return 0
    max_n = 0
    for child in dir_path.iterdir():
        if not child.is_file():
            continue
        m = re.match(r"^(\d+)\.", child.name)
        if not m:
            continue
        max_n = max(max_n, int(m.group(1)))
    return max_n


def _write_text(path: Path, text: str, write: bool) -> None:
    if not write:
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def _canonical_snippet_text(text: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    return "\n".join(line.rstrip() for line in text.split("\n")).strip("\n")


def _build_existing_snippet_index(dir_path: Path) -> dict[str, Path]:
    """
    Returns a mapping from canonical snippet content => file path.
    If multiple files share the same content, the lowest numeric prefix wins.
    """
    if not dir_path.exists() or not dir_path.is_dir():
        return {}

    def sort_key(p: Path) -> tuple[int, str]:
        m = re.match(r"^(\d+)\.", p.name)
        return (int(m.group(1)) if m else 10**9, p.name)

    index: dict[str, Path] = {}
    for child in sorted((p for p in dir_path.iterdir() if p.is_file()), key=sort_key):
        try:
            content = _canonical_snippet_text(child.read_text(encoding="utf-8"))
        except UnicodeDecodeError:
            continue
        if content and content not in index:
            index[content] = child
    return index


def _process_file(
    path: Path,
    docs_root: Path,
    known_langs: set[str],
    snippets_dir_name: str,
    *,
    write: bool,
    include_html_blocks: bool,
    wrap_code_includes: bool,
    extract_blocks: bool,
    lang_code_snippets: str,
) -> tuple[bool, int, int, int, list[tuple[Path, str]]]:
    rel = path.relative_to(docs_root)
    rel_parts = rel.parts

    lang = None
    if rel_parts and _normalize_lang(rel_parts[0]) in known_langs:
        lang = _normalize_lang(rel_parts[0])

    rel_no_lang = Path(*rel_parts[1:]) if lang else rel
    doc_dir = rel_no_lang.with_suffix("")

    snippets_root = docs_root / snippets_dir_name
    shared_lang_mode = lang and lang_code_snippets in {"shared", "reference-english"}
    code_root = (snippets_root / "code") if shared_lang_mode else ((snippets_root / lang / "code") if lang else (snippets_root / "code"))
    out_dir = code_root / doc_dir

    raw = path.read_text(encoding="utf-8")
    lines = raw.splitlines()

    # 1) Optional: wrap bare code includes first (line numbers may shift)
    changed = False
    wrapped_count = 0
    if wrap_code_includes:
        in_fence = False
        fence_delim = ""
        i = 0
        while i < len(lines):
            m_f = FENCE_LINE_RE.match(lines[i])
            if m_f:
                delim = m_f.group("fence")
                if not in_fence:
                    in_fence = True
                    fence_delim = delim
                elif fence_delim == delim:
                    in_fence = False
                    fence_delim = ""
                i += 1
                continue
            if in_fence:
                i += 1
                continue

            m = INCLUDE_CAPTURE_RE.match(lines[i])
            if not m:
                i += 1
                continue

            include_path = m.group("path")
            indent = m.group("indent") or ""
            info = _should_wrap_include_as_code(include_path, known_langs=known_langs)
            if not info:
                i += 1
                continue

            lines[i : i + 1] = [
                f"{indent}```{info}",
                f"{indent}--8<-- '{include_path}'",
                f"{indent}```",
            ]
            changed = True
            wrapped_count += 1
            i += 3

    if not extract_blocks:
        if not changed:
            return False, 0, wrapped_count, 0, []
        new_text = "\n".join(lines).rstrip("\n") + "\n"
        _write_text(path, new_text, write=write)
        return True, 0, wrapped_count, 0, []

    # 2) Extract fenced blocks
    fence_blocks = _parse_fenced_blocks(lines)
    html_blocks = _find_html_blocks(lines) if include_html_blocks else []

    if not fence_blocks and not html_blocks:
        # If we only wrapped includes, still write updates.
        if not changed:
            return False, 0, wrapped_count, 0, []
        new_text = "\n".join(lines).rstrip("\n") + "\n"
        _write_text(path, new_text, write=write)
        return True, 0, wrapped_count, 0, []

    # Build candidates, then assign numeric filenames in document order.
    candidates: list[tuple[int, int, str, str, str, str | None, str | None, str]] = []
    # (start, end, indent, ext, extracted_text, open_line, close_line, kind)

    for block in fence_blocks:
        body = [l for l in block.code_lines if l.strip()]
        if any("--8<--" in l for l in body):
            continue
        info_token = block.info.split()[0].strip().lower()
        ext = INFO_TO_EXT.get(info_token, "txt")
        if info_token in {"text", "plaintext"} and not _looks_like_terminal_text(block.code_lines):
            continue
        extracted_text = "\n".join(block.code_lines).rstrip("\n") + "\n"
        candidates.append(
            (
                block.start_line,
                block.end_line,
                block.indent,
                ext,
                extracted_text,
                lines[block.start_line],
                lines[block.end_line],
                "fence",
            )
        )

    for start, end, indent in html_blocks:
        block_lines = lines[start : end + 1]
        if any("--8<--" in l for l in block_lines):
            continue
        extracted_text = "\n".join([l[len(indent) :] if l.startswith(indent) else l for l in block_lines]).rstrip("\n") + "\n"
        candidates.append((start, end, indent, "html", extracted_text, None, None, "html"))

    if not candidates:
        if not changed:
            return False, 0, wrapped_count, 0, []
        new_text = "\n".join(lines).rstrip("\n") + "\n"
        _write_text(path, new_text, write=write)
        return True, 0, wrapped_count, 0, []

    candidates.sort(key=lambda t: (t[0], t[1]))
    non_overlapping: list[tuple[int, int, str, str, str, str | None, str | None, str]] = []
    last_end = -1
    for entry in candidates:
        s, e = entry[0], entry[1]
        if s <= last_end:
            continue
        non_overlapping.append(entry)
        last_end = e

    reference_english = bool(lang) and lang_code_snippets == "reference-english"
    referenced_count = 0

    include_prefix = "code" if shared_lang_mode else (f"{lang}/code" if lang else "code")
    existing_index = _build_existing_snippet_index(out_dir) if reference_english else {}

    plan: list[tuple[int, int, Path | None, str, list[str], str]] = []
    if reference_english:
        for start, end, indent, ext, extracted_text, open_line, close_line, kind in non_overlapping:
            key = _canonical_snippet_text(extracted_text)
            existing_path = existing_index.get(key)
            if not existing_path:
                continue

            include_path = f"{include_prefix}/{doc_dir.as_posix()}/{existing_path.name}"
            include_line = f"{indent}--8<-- '{include_path}'"

            if kind == "fence":
                replacement_lines = [open_line or lines[start], include_line, close_line or lines[end]]
            else:
                replacement_lines = [include_line]

            plan.append((start, end, None, include_path, replacement_lines, extracted_text))
    else:
        next_n = _max_numeric_prefix(out_dir)
        for start, end, indent, ext, extracted_text, open_line, close_line, kind in non_overlapping:
            next_n += 1
            out_path = out_dir / f"{next_n}.{ext}"
            include_path = f"{include_prefix}/{doc_dir.as_posix()}/{out_path.name}"
            include_line = f"{indent}--8<-- '{include_path}'"

            if kind == "fence":
                replacement_lines = [open_line or lines[start], include_line, close_line or lines[end]]
            else:
                replacement_lines = [include_line]

            plan.append((start, end, out_path, include_path, replacement_lines, extracted_text))

    created: list[tuple[Path, str]] = []
    extracted_count = 0

    # Apply bottom-up so indices remain valid.
    for start, end, out_path, include_path, replacement_lines, extracted_text in reversed(plan):
        if out_path is not None:
            _write_text(out_path, extracted_text, write=write)
            created.append((out_path, include_path))
            extracted_count += 1
        else:
            referenced_count += 1
        lines[start : end + 1] = replacement_lines
        changed = True

    if changed:
        new_text = "\n".join(lines).rstrip("\n") + "\n"
        _write_text(path, new_text, write=write)

    created.reverse()
    return changed, extracted_count, wrapped_count, referenced_count, created


def _iter_md_files(docs_root: Path, targets: list[Path], *, include_index: bool, snippets_dir_name: str) -> list[Path]:
    files: list[Path] = []

    def keep(p: Path) -> bool:
        if not p.is_file():
            return False
        if p.suffix.lower() not in MD_EXTENSIONS:
            return False
        try:
            rel = p.relative_to(docs_root)
        except ValueError:
            return False
        if snippets_dir_name in rel.parts:
            return False
        if "site" in rel.parts:
            return False
        if not include_index and p.name.lower() == "index.md":
            return False
        return True

    if not targets:
        for p in docs_root.rglob("*"):
            if keep(p):
                files.append(p)
        return sorted(files)

    for t in targets:
        if not t.is_absolute():
            candidate = docs_root / t
            t = candidate if candidate.exists() else (Path.cwd() / t)
        t = t.resolve()
        if t.is_file():
            if keep(t):
                files.append(t)
        elif t.is_dir():
            for p in t.rglob("*"):
                if keep(p):
                    files.append(p)

    return sorted(set(files))


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--docs-root", type=Path, required=True, help="Docs root directory (contains language dirs and .snippets).")
    ap.add_argument("--paths", type=Path, nargs="*", default=None, help="Files/dirs to scan (default: docs-root).")
    ap.add_argument("--write", action="store_true", help="Write changes (default is dry-run).")
    ap.add_argument(
        "--snippets-dir",
        default=".snippets",
        help="Directory under docs root to write snippets into (default: .snippets).",
    )
    ap.add_argument(
        "--include-html-blocks",
        action="store_true",
        help="Also extract raw <div>/<script>/<style> blocks that are outside fenced code blocks.",
    )
    ap.add_argument(
        "--wrap-code-includes",
        action="store_true",
        help="Wrap bare code includes (--8<-- '.../code/...') in fenced code blocks based on file extension.",
    )
    ap.add_argument(
        "--lang-code-snippets",
        choices=("per-lang", "shared", "reference-english"),
        default="per-lang",
        help=(
            "How to handle code snippet extraction for translated pages (e.g. zh/...): "
            "'per-lang' writes to .snippets/<lang>/code and inserts <lang>/code/... includes; "
            "'shared' writes to .snippets/code and inserts code/... includes; "
            "'reference-english' never creates snippet files for lang pages and instead rewrites fences "
            "to reference existing shared code/... snippets by matching snippet content."
        ),
    )
    ap.add_argument(
        "--no-extract-blocks",
        action="store_true",
        help="Do not extract fenced/terminal/HTML blocks; only run include-wrapping step(s).",
    )
    ap.add_argument(
        "--include-index",
        action="store_true",
        help="Also process files named index.md (default: skipped for safety).",
    )
    args = ap.parse_args()

    docs_root = args.docs_root
    if not docs_root.is_absolute():
        docs_root = (Path.cwd() / docs_root).resolve()
    else:
        docs_root = docs_root.resolve()
    if not docs_root.exists() or not docs_root.is_dir():
        raise SystemExit(f"--docs-root does not exist or is not a directory: {docs_root}")

    snippets_dir_name = str(args.snippets_dir).strip().rstrip("/") or ".snippets"
    if snippets_dir_name.startswith("./"):
        snippets_dir_name = snippets_dir_name[2:] or ".snippets"

    known_langs = _detect_language_dirs(docs_root)

    md_files = _iter_md_files(
        docs_root,
        args.paths or [],
        include_index=args.include_index,
        snippets_dir_name=snippets_dir_name,
    )

    write = bool(args.write)
    total_files_changed = 0
    total_blocks = 0
    total_referenced = 0

    for p in md_files:
        changed, extracted, wrapped, referenced, created = _process_file(
            p,
            docs_root=docs_root,
            known_langs=known_langs,
            snippets_dir_name=snippets_dir_name,
            write=write,
            include_html_blocks=args.include_html_blocks,
            wrap_code_includes=args.wrap_code_includes,
            extract_blocks=not args.no_extract_blocks,
            lang_code_snippets=args.lang_code_snippets,
        )
        total_blocks += extracted
        total_referenced += referenced
        if changed:
            total_files_changed += 1
            mode = "Updated" if write else "Would update"
            print(
                f"{mode} {p.relative_to(docs_root)} "
                f"(extracted {extracted} block(s), referenced {referenced} block(s), wrapped {wrapped} include(s))"
            )
            if created:
                for out_path, include_path in created:
                    rel_out = out_path.relative_to(docs_root)
                    create_mode = "Created" if write else "Would create"
                    print(f"  {create_mode} {rel_out}")
                    print(f"    include: {include_path}")

    print(
        f"Done. Files changed: {total_files_changed}. Code blocks extracted: {total_blocks}. "
        f"Code blocks referenced: {total_referenced}. Write mode: {'on' if write else 'off'}."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
