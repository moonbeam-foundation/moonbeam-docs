#!/usr/bin/env python3
"""Collect start/end ranges for changed Markdown blocks between git refs.

The output JSON is saved next to the translation payload so Rose can pass the
exact `{start, end}` windows downstream in step 7 of the workflow.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, Iterator

from paths import REPO_ROOT, repo_relative_str

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT = ROOT / "translations" / "changed_segments.json"
GIT_ROOT = REPO_ROOT
HUNK_RE = re.compile(r"^@@ -(?P<old>\d+(?:,\d+)?) \+(?P<new>\d+(?:,\d+)?) @@")
HEADING_RE = re.compile(r"^(?P<hashes>#{1,6})\s+(?P<title>.+?)\s*$")
QUIET = os.environ.get("ROSE_QUIET", "").strip().lower() in {"1", "true", "yes", "on"}


def _parse_range(value: str) -> tuple[int, int]:
    start_str, _, length_str = value.partition(",")
    start = int(start_str)
    length = int(length_str) if length_str else 1
    if length == 0:
        return start, start - 1  # empty range
    end = start + length - 1
    return start, end


@dataclass
class Range:
    start: int
    end: int

    @property
    def as_dict(self) -> dict[str, int]:
        return {"start": self.start, "end": self.end}

    @property
    def is_empty(self) -> bool:
        return self.end < self.start


def _to_git_relative(path: str) -> str:
    return repo_relative_str(path)


def _run_git_diff(base: str, head: str, paths: Iterable[str]) -> str:
    cmd = ["git", "-C", str(GIT_ROOT), "diff", f"{base}..{head}", "--unified=0"]
    cmd.extend(_to_git_relative(path) for path in paths)
    try:
        proc = subprocess.run(cmd, capture_output=True, text=True, check=True)
    except subprocess.CalledProcessError as exc:  # pragma: no cover - passthrough
        raise SystemExit(exc.stderr or exc.stdout)
    return proc.stdout


def _read_file_at_ref(ref: str, rel_path: str) -> str | None:
    git_path = repo_relative_str(rel_path)
    cmd = ["git", "-C", str(GIT_ROOT), "show", f"{ref}:{git_path}"]
    proc = subprocess.run(cmd, capture_output=True, text=True, check=False)
    if proc.returncode != 0:
        return None
    return proc.stdout


def _iter_hunks(diff_text: str) -> Iterator[tuple[str, Range | None, Range | None]]:
    current_file: str | None = None
    for line in diff_text.splitlines():
        if line.startswith("diff --git "):
            parts = line.split()
            if len(parts) >= 4:
                current_file = repo_relative_str(parts[2][2:])
            continue
        if line.startswith("+++ "):
            current_file = line[4:].strip()
            if current_file.startswith("b/"):
                current_file = current_file[2:]
            current_file = repo_relative_str(current_file)
            continue
        if not (line.startswith("@@ ") and current_file):
            continue
        match = HUNK_RE.match(line)
        if not match:
            continue
        removed_start, removed_end = _parse_range(match.group("old"))
        added_start, added_end = _parse_range(match.group("new"))
        removed = Range(removed_start, removed_end)
        added = Range(added_start, added_end)
        yield current_file, (removed if not removed.is_empty else None), (added if not added.is_empty else None)


@dataclass(frozen=True)
class Section:
    start: int
    end: int
    level: int
    title: str
    path: list[str]

    @property
    def as_range(self) -> Range:
        return Range(self.start, self.end)


def _parse_sections(lines: list[str]) -> list[Section]:
    """Parse Markdown headings and compute section boundaries.

    A section begins at a heading and ends just before the next heading of the
    same or higher level. Nested headings are included inside their parent's
    section. Content before the first heading is represented as a level-0
    "(preamble)" section.
    """
    headings: list[tuple[int, int, str]] = []
    for idx, raw in enumerate(lines, start=1):
        match = HEADING_RE.match(raw)
        if not match:
            continue
        level = len(match.group("hashes"))
        title = match.group("title").strip()
        headings.append((idx, level, title))

    sections: list[Section] = []
    if not headings:
        if lines:
            sections.append(Section(start=1, end=len(lines), level=0, title="(preamble)", path=["(preamble)"]))
        return sections

    first_heading_line = headings[0][0]
    if first_heading_line > 1:
        sections.append(
            Section(
                start=1,
                end=first_heading_line - 1,
                level=0,
                title="(preamble)",
                path=["(preamble)"],
            )
        )

    stack: list[dict[str, object]] = []
    for line_no, level, title in headings:
        while stack and int(stack[-1]["level"]) >= level:
            completed = stack.pop()
            end = line_no - 1
            sections.append(
                Section(
                    start=int(completed["start"]),
                    end=end,
                    level=int(completed["level"]),
                    title=str(completed["title"]),
                    path=list(completed["path"]),  # type: ignore[arg-type]
                )
            )
        parent_path: list[str] = []
        if stack:
            parent_path = list(stack[-1]["path"])  # type: ignore[arg-type]
        current_path = parent_path + [title]
        stack.append({"start": line_no, "level": level, "title": title, "path": current_path})

    last_line = len(lines)
    while stack:
        completed = stack.pop()
        sections.append(
            Section(
                start=int(completed["start"]),
                end=last_line,
                level=int(completed["level"]),
                title=str(completed["title"]),
                path=list(completed["path"]),  # type: ignore[arg-type]
            )
        )

    sections.sort(key=lambda sec: (sec.start, sec.end))
    return sections


def _overlaps(a: Range, b: Range) -> bool:
    return not (a.end < b.start or b.end < a.start)


def _collect_sets_hunks(diff_text: str) -> dict[str, list[dict[str, object]]]:
    current_file: str | None = None
    data: dict[str, list[dict[str, object]]] = {}

    for line in diff_text.splitlines():
        if line.startswith("diff --git "):
            parts = line.split()
            if len(parts) >= 4:
                current_file = repo_relative_str(parts[2][2:])
        elif line.startswith("+++ "):
            current_file = line[4:].strip()
            if current_file.startswith("b/"):
                current_file = current_file[2:]
            current_file = repo_relative_str(current_file)
        elif line.startswith("@@ ") and current_file:
            match = HUNK_RE.match(line)
            if not match:
                continue
            removed_start, removed_end = _parse_range(match.group("old"))
            added_start, added_end = _parse_range(match.group("new"))

            entry: dict[str, object] = {
                "set_id": len(data.get(current_file, [])) + 1,
            }
            removed_range = Range(removed_start, removed_end)
            added_range = Range(added_start, added_end)
            if not removed_range.is_empty:
                entry["removed"] = removed_range.as_dict
            if not added_range.is_empty:
                entry["added"] = added_range.as_dict

            data.setdefault(current_file, []).append(entry)

    return data


def _collect_sets_by_headers(diff_text: str, head_ref: str) -> dict[str, list[dict[str, object]]]:
    """Collect changes expanded to full Markdown sections (grouped by headings).

    Uses the added line ranges from the diff (line numbers in the `head_ref`
    version of the file) and expands them to the section boundaries computed
    from Markdown headings.
    """
    added_by_file: dict[str, list[Range]] = {}
    for path, _removed, added in _iter_hunks(diff_text):
        if added is None:
            continue
        added_by_file.setdefault(path, []).append(added)

    out: dict[str, list[dict[str, object]]] = {}
    for path in sorted(added_by_file):
        content = _read_file_at_ref(head_ref, path)
        if content is None:
            # Fallback to working tree if head ref isn't available locally.
            abs_path = GIT_ROOT / path
            if abs_path.exists():
                content = abs_path.read_text(encoding="utf-8")
        if content is None:
            continue
        lines = content.splitlines()
        sections = _parse_sections(lines)
        if not sections:
            continue
        changed_ranges = sorted(added_by_file[path], key=lambda r: (r.start, r.end))

        def section_for_line(line_no: int) -> Section | None:
            best: Section | None = None
            for candidate in sections:
                if candidate.start <= line_no <= candidate.end:
                    if best is None:
                        best = candidate
                        continue
                    best_span = best.end - best.start
                    cand_span = candidate.end - candidate.start
                    if cand_span < best_span or (cand_span == best_span and candidate.start > best.start):
                        best = candidate
            return best

        impacted: dict[int, Section] = {}
        for changed in changed_ranges:
            # Always include the most specific section that contains the changed lines.
            start_section = section_for_line(changed.start)
            end_section = section_for_line(changed.end)
            if start_section is not None:
                impacted[start_section.start] = start_section
            if end_section is not None:
                impacted[end_section.start] = end_section

            # If a heading line itself was changed, include that heading's section.
            for candidate in sections:
                if candidate.level == 0:
                    continue
                if changed.start <= candidate.start <= changed.end:
                    impacted[candidate.start] = candidate

        for idx, start in enumerate(sorted(impacted), start=1):
            section = impacted[start]
            entry: dict[str, object] = {
                "set_id": idx,
                "added": section.as_range.as_dict,
                "header": {
                    "level": section.level,
                    "title": section.title,
                    "line": section.start,
                },
                "header_path": section.path,
            }
            out.setdefault(path, []).append(entry)

    return out


def _collect_sets(diff_text: str) -> dict[str, list[dict[str, object]]]:
    # Backwards-compatible default used by rose_pipeline.py
    return _collect_sets_hunks(diff_text)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base", required=True, help="Base git ref (e.g., origin/main)")
    parser.add_argument("--head", default="HEAD", help="Head git ref (default: HEAD)")
    parser.add_argument(
        "--paths",
        nargs="*",
        default=["."],
        help="Optional path filters passed to git diff",
    )
    parser.add_argument(
        "--group-by",
        choices=["hunks", "headers"],
        default="hunks",
        help=(
            "Output mode. 'hunks' emits raw diff hunk line ranges. "
            "'headers' expands changed ranges to full Markdown sections bounded by headings."
        ),
    )
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()

    diff_text = _run_git_diff(args.base, args.head, args.paths)
    if args.group_by == "headers":
        changes = _collect_sets_by_headers(diff_text, args.head)
    else:
        changes = _collect_sets(diff_text)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(changes, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    if not QUIET:
        print(f"Wrote {sum(len(v) for v in changes.values())} changed block(s) to {args.output}")
    return 0


if __name__ == "__main__":  # pragma: no cover
    raise SystemExit(main())
