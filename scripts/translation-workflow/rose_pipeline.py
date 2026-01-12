#!/usr/bin/env python3
"""End-to-end orchestration for Rose's translation workflow."""
from __future__ import annotations

import argparse
import base64
import copy
import hashlib
import hmac
import json
import os
import re
import shlex
import sys
import time
import subprocess
import tempfile
import shutil
import uuid
from pathlib import Path
from typing import Any, Iterable, Set
from urllib import error, parse, request

CURRENT_DIR = Path(__file__).resolve().parent
ROOT = CURRENT_DIR.parent
sys.path.append(str(CURRENT_DIR))
DEBUG = os.environ.get("ROSE_DEBUG", "").strip().lower() in {"1", "true", "yes", "on"}
QUIET = os.environ.get("ROSE_QUIET", "").strip().lower() in {"1", "true", "yes", "on"}
try:
    from collect_diff_sets import _run_git_diff, _collect_sets  # type: ignore
except Exception as exc:  # pragma: no cover
    raise RuntimeError("Unable to import collect_diff_sets helper") from exc

from paths import REPO_ROOT, repo_path, repo_relative, repo_relative_str

TRANSLATION_STAGE = ROOT / "translations"
PYTHON_BIN = sys.executable or shutil.which("python3") or "python3"
PAYLOAD_PATH = TRANSLATION_STAGE / "payload.json"
CHANGES_PATH = TRANSLATION_STAGE / "changed_segments.json"
ALLOWED_EXTENSIONS = {".md", ".markdown", ".mkd", ".html", ".jinja", ".jinja2", ".j2", ".tpl", ".yml", ".yaml"}
TAGGER_PATH = CURRENT_DIR / "tagger.js"
LOCALE_SYNC = CURRENT_DIR / "locale_sync.py"
LOCALE_REPORT = TRANSLATION_STAGE / "locale_report.json"
COVERAGE_REPORT = TRANSLATION_STAGE / "summary_report.json"
VALIDATION_REPORT = TRANSLATION_STAGE / "validation_report.json"
VALIDATION_PAYLOAD_SNAPSHOT = TRANSLATION_STAGE / "validation_payload_snapshot.json"
LANGUAGE_CODE_PATTERN = re.compile(r"^[A-Za-z]{2}(?:[-_][A-Za-z]{2})?$")
EXCLUDED_PREFIXES = (
    ".github/",
    "translation-workflow/scripts/",
    "i18n/",
    "images/",
    "scripts/",
    "locale/",
)
EXCLUDED_EXACT = {
    ".github",
    "translation-workflow/scripts",
    "i18n",
    "images",
    "scripts",
    "locale",
    "readme.md",
    "variables.yml",
}


def _debug(message: str) -> None:
    if DEBUG and not QUIET:
        print(f"[rose][debug] {message}")


def _info(message: str) -> None:
    if not QUIET:
        print(message)


def _strip_code_fence(text: str) -> str:
    if not text:
        return text
    stripped = text.strip()
    if stripped.startswith("```") and stripped.endswith("```") and len(stripped) >= 6:
        lines = stripped.splitlines()
        if lines:
            fence_lang = lines[0].strip()
            if fence_lang.startswith("```"):
                lines = lines[1:]
        if lines and lines[-1].strip().startswith("```"):
            lines = lines[:-1]
        return "\n".join(lines).strip()
    return text


def _read_lines(path: Path) -> list[str]:
    return path.read_text(encoding="utf-8").splitlines()


def _slice_block(lines: list[str], start: int, end: int) -> str:
    start_idx = max(start - 1, 0)
    end_idx = min(end, len(lines))
    block = lines[start_idx:end_idx]
    return "\n".join(block).rstrip() + "\n"


def _is_allowed_file(rel_path: str) -> bool:
    return Path(rel_path).suffix.lower() in ALLOWED_EXTENSIONS


def _is_code_only(block: str) -> bool:
    lines = block.splitlines()
    meaningful = []
    in_fence = False
    for raw_line in lines:
        stripped = raw_line.strip()
        if stripped.startswith("```") or stripped.startswith("~~~"):
            in_fence = not in_fence
            continue
        if in_fence:
            continue
        if stripped == "":
            continue
        if raw_line.startswith("    ") or raw_line.startswith("\t"):
            continue
        meaningful.append(stripped)
    text = " ".join(meaningful)
    alpha_chars = sum(ch.isalpha() for ch in text)
    return alpha_chars == 0


def _resolve_target_path(entry: dict[str, Any]) -> Path | None:
    lang = entry.get("target_language")
    source_path = entry.get("source_path")
    if not source_path:
        return None
    derived = None
    if lang:
        try:
            derived = _derive_target_path(source_path, lang)
        except Exception:
            derived = None
    target_path = entry.get("target_path")
    if derived is not None:
        use_derived = False
        if not target_path:
            use_derived = True
        else:
            try:
                if Path(target_path).as_posix() == Path(source_path).as_posix():
                    use_derived = lang is not None and lang.lower() != "en"
            except Exception:
                use_derived = True
        if use_derived:
            target_path = derived
    if not target_path:
        return None
    try:
        return repo_relative(target_path)
    except ValueError:
        return Path(target_path)


def _collect_target_files(translations: Any) -> list[Path]:
    files: list[Path] = []
    if isinstance(translations, dict) and "entries" in translations:
        iterable = translations["entries"]
    else:
        iterable = translations
    if not isinstance(iterable, list):
        return files
    for entry in iterable:
        if not isinstance(entry, dict):
            continue
        resolved = _resolve_target_path(entry)
        if resolved and resolved not in files:
            files.append(resolved)
    return files


def _payload_entries_list(translations: Any) -> list[dict[str, Any]]:
    if isinstance(translations, dict) and isinstance(translations.get("entries"), list):
        return translations["entries"]
    if isinstance(translations, list):
        flattened: list[dict[str, Any]] = []
        for item in translations:
            if isinstance(item, dict) and isinstance(item.get("entries"), list):
                flattened.extend(item["entries"])
            elif isinstance(item, dict):
                flattened.append(item)
        return flattened
    return []


def _summarize_payload_segments(entries: list[dict[str, Any]]) -> dict[str, list[dict[str, Any]]]:
    """Group payload entries per language with path + line ranges for reporting."""
    segments: dict[str, list[dict[str, Any]]] = {}
    for entry in entries:
        languages: list[str] = []
        if entry.get("target_languages"):
            languages = [str(lang) for lang in entry["target_languages"] if lang]
        elif entry.get("target_language"):
            languages = [str(entry["target_language"])]
        if not languages:
            continue

        source_path = entry.get("target_path") or entry.get("source_path")
        range_info = entry.get("range") or {}
        start = range_info.get("start")
        end = range_info.get("end")
        for lang in languages:
            normalized_lang = _normalize_language(lang)
            segments.setdefault(normalized_lang, []).append(
                {
                    "path": source_path,
                    "start": start,
                    "end": end,
                    "kind": entry.get("kind"),
                }
            )
    return segments


def _sanitize_payload_entry(entry: dict[str, Any]) -> dict[str, Any]:
    sanitized = copy.deepcopy(entry)
    sanitized.pop("provider_metadata", None)
    return sanitized


def _match_issue_payload_entries(issue: dict[str, Any], payload_entries: list[dict[str, Any]]) -> list[dict[str, Any]]:
    matches: list[dict[str, Any]] = []
    issue_lang = issue.get("language") or issue.get("target_language")
    normalized_issue_lang = _normalize_language(issue_lang) if issue_lang else None
    issue_path = issue.get("target_path") or issue.get("source_path")
    normalized_issue_path = Path(issue_path).as_posix() if issue_path else None

    for entry in payload_entries:
        entry_lang = entry.get("target_language") or entry.get("language")
        normalized_entry_lang = _normalize_language(entry_lang) if entry_lang else None
        if normalized_issue_lang and normalized_entry_lang and normalized_issue_lang != normalized_entry_lang:
            continue
        entry_path = entry.get("target_path") or entry.get("source_path")
        normalized_entry_path = Path(entry_path).as_posix() if entry_path else None
        if normalized_issue_path and normalized_entry_path and normalized_issue_path != normalized_entry_path:
            continue
        matches.append(entry)
    return matches


def _write_validation_snapshot(
    payload_entries: list[dict[str, Any]],
    validation_summary: dict[str, Any],
    summary_payload: dict[str, Any],
) -> None:
    sanitized_entries = [_sanitize_payload_entry(entry) for entry in payload_entries]
    issues_with_payload: list[dict[str, Any]] = []
    issues = validation_summary.get("issues", []) or []
    for issue in issues:
        issue_copy = copy.deepcopy(issue)
        matches = _match_issue_payload_entries(issue, sanitized_entries)
        if matches:
            issue_copy["payload_entries"] = matches
        issues_with_payload.append(issue_copy)

    snapshot = {
        "summary": summary_payload,
        "validation": validation_summary,
        "payload_entries": sanitized_entries,
        "issues_with_payload": issues_with_payload,
    }
    VALIDATION_PAYLOAD_SNAPSHOT.write_text(
        json.dumps(snapshot, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def _normalize_language(lang: str) -> str:
    return lang.strip().lower().replace("-", "_")


def _prepare_languages(language_args: Iterable[str]) -> list[str]:
    normalized: list[str] = []
    for raw in language_args or []:
        candidate = (raw or "").strip()
        if not candidate:
            continue
        if not LANGUAGE_CODE_PATTERN.match(candidate):
            raise ValueError(
                f"Invalid language code '{raw}'. Use ISO 639-1 codes such as 'es' or 'pt-BR'."
            )
        normalized.append(_normalize_language(candidate))
    if not normalized:
        raise ValueError("At least one valid language code must be provided.")
    return normalized


def _normalize_path(path: str) -> str:
    """Return a repo-relative, posix-style path for comparison."""
    raw = path.strip()
    if not raw:
        return ""
    try:
        return repo_relative(raw).as_posix()
    except ValueError:
        return Path(raw).as_posix()


def _filter_diff_map(diff_map: dict[str, list[dict[str, Any]]], include: set[str]) -> dict[str, list[dict[str, Any]]]:
    if not include:
        return diff_map
    normalized_lookup: dict[str, str] = {}
    for rel_path in diff_map:
        normalized_lookup[_normalize_path(rel_path)] = rel_path
    filtered: dict[str, list[dict[str, Any]]] = {}
    for normalized, original in normalized_lookup.items():
        if normalized in include:
            filtered[original] = diff_map[original]
    missing = sorted(include - set(normalized_lookup.keys()))
    if missing:
        _info("Requested file(s) not present in this diff:")
        for path in missing:
            _info(f"  - {path}")
    return filtered


def _report_missing_translations(english_files: Set[str], languages: list[str]) -> dict[str, list[str]]:
    coverage: dict[str, list[str]] = {}
    if not english_files:
        return coverage
    _info("Translation coverage report:")
    for lang in languages:
        missing: list[str] = []
        for rel_path in english_files:
            target = _derive_target_path(rel_path, lang)
            target_rel = repo_relative(target)
            if not (REPO_ROOT / target_rel).exists():
                missing.append(target_rel.as_posix())
        coverage[lang] = missing
        if not missing:
            _info(f"  {lang}: OK")
        else:
            _info(f"  {lang}: missing {len(missing)} file(s)")
            for path in missing[:10]:
                _info(f"    - {path}")
            if len(missing) > 10:
                _info("    ...")
    return coverage


def _report_locale_findings(report_path: Path) -> dict[str, Any]:
    if not report_path.exists():
        return {"added_per_locale": {}, "unused_keys": []}
    data = json.loads(report_path.read_text(encoding="utf-8"))
    added = data.get("added_per_locale", {})
    unused = data.get("unused_keys", [])
    if added:
        _info("Locale key additions:")
        for locale, count in sorted(added.items()):
            _info(f"  {locale}: {count} key(s)")
    if unused:
        _info("Locale keys unused in templates:")
        for key in unused[:20]:
            _info(f"  - {key}")
        if len(unused) > 20:
            _info("  ...")
    return {"added_per_locale": added, "unused_keys": unused}


def _load_validation_findings(report_path: Path) -> dict[str, Any]:
    if not report_path.exists():
        return {"status": "unknown", "issues": []}
    return json.loads(report_path.read_text(encoding="utf-8"))


def _build_document_records(entries: list[dict[str, Any]]) -> list[dict[str, str]]:
    documents: list[dict[str, str]] = []
    seen_paths: set[str] = set()
    for entry in entries:
        if entry.get("kind") != "file":
            continue
        source_path = entry.get("source_path")
        if not source_path:
            continue
        normalized = repo_relative_str(source_path)
        if normalized in seen_paths:
            continue
        seen_paths.add(normalized)
        content = entry.get("content") or ""
        checksum = hashlib.sha256(content.encode("utf-8")).hexdigest()
        path_for_doc = Path(normalized)
        documents.append(
            {
                "path": path_for_doc.as_posix(),
                "language": entry.get("source_language", "EN").lower(),
                "checksum": checksum,
                "content": content,
            }
        )
    return documents


def _collect_target_languages(entries: list[dict[str, Any]]) -> list[str]:
    langs: set[str] = set()
    for entry in entries:
        for lang in entry.get("target_languages") or []:
            langs.add(str(lang).lower())
    return sorted(langs)


def _resolve_commit(ref: str) -> str:
    result = subprocess.run(
        ["git", "-C", str(REPO_ROOT), "rev-parse", ref],
        capture_output=True,
        text=True,
        check=False,
    )
    if result.returncode != 0:
        return ref
    return result.stdout.strip()


def _inject_full_file_entries(diff_map: dict[str, list[dict[str, Any]]], include_files: set[str]) -> None:
    for rel_path in include_files:
        if rel_path in diff_map:
            continue
        abs_path = repo_path(rel_path)
        if not abs_path.exists():
            _info(f"Requested include file not found on disk: {rel_path}")
            continue
        lines = _read_lines(abs_path)
        entry = {
            "set_id": len(diff_map.get(rel_path, [])) + 1,
            "added": {"start": 1, "end": len(lines)},
        }
        diff_map.setdefault(rel_path, []).append(entry)
        _info(f"Added full-file translation entry for {rel_path}")


def _compute_hmac(secret: str, data: bytes) -> str:
    digest = hmac.new(secret.encode("utf-8"), data, hashlib.sha256).digest()
    return "sha256=" + base64.b64encode(digest).decode("ascii")


def _post_json(url: str, payload: dict[str, Any], payload_json: str | None = None) -> dict[str, Any]:
    allowed_host = os.environ.get("ROSE_N8N_ALLOWED_HOST")
    parsed = parse.urlparse(url)
    host = parsed.hostname or ""
    if allowed_host and host != allowed_host:
        raise RuntimeError(f"Webhook host '{host}' not allowed (expected '{allowed_host}')")

    payload_text = payload_json if payload_json is not None else json.dumps(payload, ensure_ascii=False)
    payload_bytes = payload_text.encode("utf-8")
    headers = {"Content-Type": "application/json"}
    run_token = uuid.uuid4().hex
    headers["X-Run-Token"] = run_token
    sending_token = os.environ.get("ROSE_N8N_SENDING_TOKEN")
    if sending_token:
        headers["X-Signature"] = _compute_hmac(sending_token, payload_bytes)

    req = request.Request(url, data=payload_bytes, headers=headers)
    try:
        with request.urlopen(req) as resp:  # nosec B310
            body_bytes = resp.read()
            status = resp.status
            resp_headers = resp.headers
    except error.HTTPError as exc:  # pragma: no cover - network errors
        raise RuntimeError(f"n8n webhook request failed: HTTP {exc.code} {exc.reason}") from exc
    except error.URLError as exc:  # pragma: no cover
        raise RuntimeError(f"n8n webhook request failed: {exc.reason}") from exc

    if status < 200 or status >= 300:
        raise RuntimeError(f"n8n webhook returned HTTP {status}")

    body_text = body_bytes.decode("utf-8")
    receiving_token = os.environ.get("ROSE_N8N_RECEIVING_TOKEN")
    if receiving_token:
        header_sig = resp_headers.get("X-Response-Signature")
        expected_sig = _compute_hmac(receiving_token, body_bytes)
        if not header_sig or header_sig.strip() != expected_sig:
            raise RuntimeError("Response signature mismatch from n8n.")

    try:
        return json.loads(body_text)
    except json.JSONDecodeError as exc:  # pragma: no cover
        raise RuntimeError(f"Unable to decode n8n response: {exc}") from exc


def _as_bool(value: str) -> bool:
    return value.strip().lower() in {"1", "true", "yes", "on"}


def _should_skip_path(rel_path: str, languages: list[str], skip_llms: bool, skip_ai: bool) -> bool:
    normalized = repo_relative_str(rel_path)
    lower = normalized.lower()
    if lower in EXCLUDED_EXACT:
        return True
    for prefix in EXCLUDED_PREFIXES:
        if lower.startswith(prefix):
            return True
    if skip_llms and "llms" in lower:
        return True
    if skip_ai and "/.ai" in lower:
        return True
    parts = Path(normalized).parts
    if not _is_allowed_file(normalized):
        return True
    # Skip files already under a locale directory
    for lang in languages:
        if parts and parts[0] == lang:
            return True
    return False


def _run_tagger(text: str) -> str:
    if not TAGGER_PATH.exists():
        raise FileNotFoundError(f"Tagger script missing: {TAGGER_PATH}")
    with tempfile.NamedTemporaryFile("w", delete=False, encoding="utf-8") as src:
        src.write(text)
        src_path = src.name
    with tempfile.NamedTemporaryFile("r", delete=False, encoding="utf-8") as dst:
        dst_path = dst.name
    try:
        subprocess.run(
            ["node", str(TAGGER_PATH), src_path, dst_path],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        with open(dst_path, "r", encoding="utf-8") as handle:
            return handle.read()
    finally:
        Path(src_path).unlink(missing_ok=True)
        Path(dst_path).unlink(missing_ok=True)


def _derive_target_path(rel_path: str, language: str) -> str:
    try:
        path = repo_relative(rel_path)
    except ValueError:
        path = Path(rel_path)
    parts = list(path.parts)

    if parts and parts[0] == "locale":
        rest = parts[1:]
        if not rest:
            return str(Path("locale", f"{language}.yml"))
        filename = Path(rest[-1])
        new_name = f"{language}{filename.suffix or '.yml'}"
        return str(Path("locale", *rest[:-1], new_name))

    # Handle material-overrides/.translations/<lang>.json
    if ".translations" in parts:
        idx = parts.index(".translations")
        before = parts[: idx + 1]
        filename = parts[-1] if parts else ""
        stem, suffix = Path(filename).stem, Path(filename).suffix
        new_name = f"{language}{suffix or '.json'}"
        new_parts = before + parts[idx + 1 : -1] + [new_name]
        return str(Path(*new_parts))

    if parts and parts[0] == language:
        return str(path)
    if parts and parts[0] == "en":
        parts = parts[1:]
    return str(Path(language, *parts))

    return str(path)


def _read_file_at_ref(ref: str, rel_path: str) -> str | None:
    git_path = repo_relative_str(rel_path)
    cmd = ["git", "-C", str(REPO_ROOT), "show", f"{ref}:{git_path}"]
    result = subprocess.run(cmd, capture_output=True, text=True, check=False)
    if result.returncode != 0:
        return None
    return result.stdout


def _build_payload_entries(
    diff_map: dict[str, list[dict[str, Any]]],
    languages: list[str],
    skip_llms: bool,
    skip_ai: bool,
    head_ref: str,
) -> tuple[list[dict[str, Any]], Set[str]]:
    entries: list[dict[str, Any]] = []
    english_files: Set[str] = set()
    for rel_path, ranges in diff_map.items():
        normalized_path = repo_relative_str(rel_path)
        if _should_skip_path(normalized_path, languages, skip_llms, skip_ai):
            continue
        abs_path = repo_path(normalized_path)
        if abs_path.exists():
            english_text = abs_path.read_text(encoding="utf-8")
            lines = _read_lines(abs_path)
        else:
            english_text = _read_file_at_ref(head_ref, normalized_path)
            if english_text is None:
                _debug(f"Missing {normalized_path} in working tree and ref {head_ref}; skipping.")
                continue
            lines = english_text.splitlines()
        english_files.add(normalized_path)
        tagged_full = _run_tagger(english_text)
        file_entry = {
            "kind": "file",
            "source_path": normalized_path,
            "source_language": "EN",
            "target_languages": languages,
            "content": english_text,
            "content_original": english_text,
            "content_tagged": tagged_full,
            "range": {"start": 1, "end": len(lines)},
        }
        entries.append(file_entry)
        for entry in ranges:
            range_info = entry.get("added")
            if not range_info:
                continue
            block_text = _slice_block(lines, range_info["start"], range_info["end"])
            if _is_code_only(block_text):
                continue
            block_entry = {
                "kind": "block",
                "source_path": normalized_path,
                "source_language": "EN",
                "set_id": entry["set_id"],
                "range": range_info,
                "target_languages": languages,
                "content": block_text,
                "content_original": block_text,
                "content_tagged": _run_tagger(block_text),
            }
            entries.append(block_entry)
    return entries, english_files


def _poll_for_result(url: str, interval: int, timeout: int) -> dict[str, Any]:
    deadline = time.time() + timeout
    while True:
        with request.urlopen(url) as resp:  # nosec B310
            body = resp.read().decode("utf-8")
        data = json.loads(body)
        if data.get("ready"):
            return data
        if time.time() > deadline:
            raise TimeoutError("Timed out waiting for n8n response")
        time.sleep(interval)


def _run_cmd(cmd: list[str]) -> None:
    result = os.spawnvp(os.P_WAIT, cmd[0], cmd)
    if result != 0:
        raise SystemExit(result)


def _detect_pr_number() -> str | None:
    env_pr = os.environ.get("PR_NUMBER")
    if env_pr:
        return env_pr
    ref = os.environ.get("GITHUB_REF", "")
    match = re.match(r"refs/pull/(\d+)/", ref)
    if match:
        return match.group(1)
    return None


def _maybe_post_validation_comments(commit_sha: str) -> None:
    repo = os.environ.get("GITHUB_REPOSITORY")
    token = os.environ.get("GITHUB_TOKEN")
    pr_number = _detect_pr_number()
    if not (repo and token and pr_number and VALIDATION_REPORT.exists()):
        return
    try:
        data = json.loads(VALIDATION_REPORT.read_text(encoding="utf-8"))
    except Exception:
        return
    issues = data.get("issues", [])
    if not issues:
        return
    _run_cmd(
        [
            PYTHON_BIN,
            str(CURRENT_DIR / "post_validation_comments.py"),
            "--report",
            str(VALIDATION_REPORT),
            "--repo",
            repo,
            "--pull-request",
            pr_number,
            "--token",
            token,
            "--commit",
            commit_sha,
        ]
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base", required=True, help="Base git ref (e.g., origin/main)")
    parser.add_argument("--head", default="HEAD", help="Head ref to compare against base")
    parser.add_argument("--paths", nargs="*", default=["."], help="Paths to inspect")
    parser.add_argument("--languages", nargs="+", default=["es", "fr", "pt"], help="Target language codes")
    parser.add_argument("--n8n-webhook", required=True, help="n8n webhook URL that accepts English payloads")
    parser.add_argument("--filter-llms", default="true", help="Skip files whose path contains 'llms' (true/false)")
    parser.add_argument("--filter-ai-dir", default="true", help="Skip files under .ai directories (true/false)")
    parser.add_argument(
        "--include-files",
        nargs="*",
        default=[],
        help="Optional list of repo-relative files to translate (overrides diff results)",
    )
    parser.add_argument(
        "--include-full",
        action="store_true",
        help="When used with --include-files, translate the entire file even if no diff exists",
    )
    args = parser.parse_args()
    args.languages = _prepare_languages(args.languages)

    _reset_translation_stage()
    try:
        return _run_pipeline(args)
    finally:
        _cleanup_translation_stage()
        _cleanup_pycache()

def _reset_translation_stage() -> None:
    if TRANSLATION_STAGE.exists():
        shutil.rmtree(TRANSLATION_STAGE)
    TRANSLATION_STAGE.mkdir(parents=True, exist_ok=True)


def _cleanup_translation_stage() -> None:
    if os.environ.get("ROSE_PRESERVE_TRANSLATIONS"):
        return
    if TRANSLATION_STAGE.exists():
        shutil.rmtree(TRANSLATION_STAGE)


def _cleanup_pycache() -> None:
    for cache_dir in CURRENT_DIR.rglob("__pycache__"):
        try:
            shutil.rmtree(cache_dir)
        except OSError:
            pass


def _run_pipeline(args: argparse.Namespace) -> int:

    env_include_files = os.environ.get("ROSE_INCLUDE_FILES")
    if env_include_files and env_include_files.strip().lower() == "none":
        env_include_files = ""
    env_include_full = os.environ.get("ROSE_INCLUDE_FULL")
    if env_include_full and not args.include_full:
        args.include_full = env_include_full.lower() in {"1", "true", "yes", "on"}
    if env_include_files and not args.include_files:
        args.include_files = [
            entry.strip()
            for chunk in env_include_files.splitlines()
            for entry in chunk.split(",")
            if entry.strip()
        ]

    include_files = {_normalize_path(path) for path in args.include_files if path.strip()}
    _debug(f"Base ref: {args.base}")
    _debug(f"Head ref: {args.head}")
    _debug(f"Paths: {', '.join(args.paths) if args.paths else '.'}")
    _debug(f"Languages: {', '.join(args.languages)}")
    _debug(f"Env include files: {env_include_files!r}")
    _debug(f"CLI include files: {sorted(include_files)}")
    _debug(f"Include full files: {args.include_full}")
    if include_files:
        _info("Restricting translation to the following file(s):")
        for rel_path in sorted(include_files):
            _info(f"  - {rel_path}")

    # Run locale sync before diff collection so locale keys stay in sync
    subprocess.run(
        [PYTHON_BIN, str(LOCALE_SYNC), "--report", str(LOCALE_REPORT)],
        check=True,
    )

    diff_text = _run_git_diff(args.base, args.head, args.paths)
    diff_map = _collect_sets(diff_text)
    diff_file_count = len(diff_map)
    diff_block_count = sum(len(items) for items in diff_map.values())
    _debug(f"Detected {diff_block_count} diff block(s) across {diff_file_count} file(s).")
    if diff_file_count:
        preview_files = sorted(diff_map.keys())[:5]
        for path in preview_files:
            _debug(f"  diff file: {path} ({len(diff_map[path])} block(s))")
    if include_files:
        diff_map = _filter_diff_map(diff_map, include_files)
        filtered_file_count = len(diff_map)
        filtered_block_count = sum(len(items) for items in diff_map.values())
        _debug(
            f"After include-files filter: {filtered_block_count} block(s) across {filtered_file_count} file(s)."
        )
        if args.include_full:
            _inject_full_file_entries(diff_map, include_files)
        if not diff_map:
            _info("No diff entries matched include-files filter; exiting.")
            return 0

    CHANGES_PATH.write_text(json.dumps(diff_map, indent=2), encoding="utf-8")

    entries, english_files = _build_payload_entries(
        diff_map,
        args.languages,
        _as_bool(args.filter_llms),
        _as_bool(args.filter_ai_dir),
        args.head,
    )
    _debug(f"Prepared {len(entries)} translation job(s) from {len(english_files)} English file(s).")
    if english_files:
        preview_sources = sorted(english_files)[:5]
        for path in preview_sources:
            _debug(f"  source file: {path}")
    if not entries:
        _info("No eligible additions detected; exiting cleanly.")
        return 0

    documents = _build_document_records(entries)
    metadata_languages = _collect_target_languages(entries)
    commit_sha = _resolve_commit(args.head)
    n8n_payload = {
        "jobs": entries,
        "head_ref": args.head,
        "documents": documents,
        "target_languages": metadata_languages,
        "branch": args.head,
        "commit": commit_sha,
    }
    payload_json = json.dumps(n8n_payload, ensure_ascii=False)
    payload_bytes = payload_json.encode("utf-8")
    max_bytes = 10 * 1024 * 1024
    if len(payload_bytes) > max_bytes:
        _info(f"Payload size {len(payload_bytes)} bytes exceeds 10MB limit; aborting.")
        return 1
    response = _post_json(args.n8n_webhook, n8n_payload, payload_json)

    response_payload: Any = response
    if isinstance(response, list):
        response_payload = response[0] if response else {}
    elif isinstance(response, str):
        try:
            response_payload = json.loads(response)
        except json.JSONDecodeError as exc:  # pragma: no cover
            raise RuntimeError("Unable to decode n8n response string") from exc

    if isinstance(response_payload, dict) and "object" in response_payload:
        obj = response_payload["object"]
        if isinstance(obj, str):
            try:
                response_payload = json.loads(obj)
            except json.JSONDecodeError as exc:  # pragma: no cover
                raise RuntimeError("Unable to decode n8n object payload") from exc
        else:
            response_payload = obj

    translations = (
        response_payload.get("translations")
        or response_payload.get("entries")
        or response_payload.get("payload")
        or response_payload
    )
    if isinstance(translations, str):
        try:
            translations = json.loads(translations)
        except json.JSONDecodeError as exc:
            raise RuntimeError("n8n payload string could not be decoded as JSON") from exc
    if isinstance(translations, dict) and "payload" in translations:
        inner_payload = translations.get("payload")
        if isinstance(inner_payload, str):
            try:
                translations = json.loads(inner_payload)
            except json.JSONDecodeError as exc:  # pragma: no cover
                raise RuntimeError("n8n payload string could not be decoded as JSON") from exc
        elif isinstance(inner_payload, list):
            translations = inner_payload
        elif isinstance(inner_payload, dict):
            translations = inner_payload
    if isinstance(translations, dict) and "comment" in translations:
        translations = translations["comment"]
    if isinstance(translations, dict) and "jobs" in translations:
        translations = translations["jobs"]
    if isinstance(translations, list):
        if (
            len(translations) == 1
            and isinstance(translations[0], dict)
            and "jobs" in translations[0]
        ):
            translations = translations[0]["jobs"]
        elif translations and all(
            isinstance(item, dict) and "jobs" in item for item in translations
        ):
            flattened: list[dict[str, Any]] = []
            for item in translations:
                jobs = item.get("jobs")
                if isinstance(jobs, list):
                    flattened.extend(job for job in jobs if isinstance(job, dict))
            if flattened:
                translations = flattened
        elif translations and all(
            isinstance(item, dict) and "comment" in item for item in translations
        ):
            flattened: list[dict[str, Any]] = []
            for item in translations:
                comments = item.get("comment")
                if isinstance(comments, list):
                    flattened.extend(comment for comment in comments if isinstance(comment, dict))
            if flattened:
                translations = flattened
    if isinstance(translations, list):
        for entry in translations:
            if (
                isinstance(entry, dict)
                and entry.get("target_language")
                and not entry.get("target_languages")
            ):
                entry["target_languages"] = [entry["target_language"]]
            if (
                isinstance(entry, dict)
                and entry.get("target_languages") in (None, [], "")
                and entry.get("kind") == "file"
            ):
                entry["target_languages"] = list(args.languages)
            if isinstance(entry, dict) and isinstance(entry.get("translated_content"), str):
                entry["translated_content"] = _strip_code_fence(entry["translated_content"])
    PAYLOAD_PATH.write_text(json.dumps(translations, indent=2, ensure_ascii=False), encoding="utf-8")
    payload_entries = _payload_entries_list(translations)

    _run_cmd([PYTHON_BIN, "-m", "pip", "install", "ruamel.yaml==0.18.16"])
    _run_cmd([PYTHON_BIN, str(CURRENT_DIR / "extract_strings.py"), "--payload", str(PAYLOAD_PATH)])
    _run_cmd(
        [
            PYTHON_BIN,
            str(CURRENT_DIR / "inject_translations.py"),
            "--payload",
            str(PAYLOAD_PATH),
            "--languages",
            *args.languages,
        ]
    )

    _run_cmd(
        [
            PYTHON_BIN,
            str(CURRENT_DIR / "fix_front_matter.py"),
            "--languages",
            *args.languages,
        ]
    )

    _run_cmd([PYTHON_BIN, str(CURRENT_DIR / "format_locale_yaml.py")])

    target_files = _collect_target_files(translations)
    payload_segments = _summarize_payload_segments(payload_entries)
    markdown_suffixes = {".md", ".markdown", ".mkd"}
    def _normalize_lang_prefix(path: Path) -> Path:
        parts = list(path.parts)
        if parts:
            parts[0] = parts[0].lower()
        return Path(*parts)

    mdformat_targets = [
        _normalize_lang_prefix(path)
        for path in target_files
        if path.suffix.lower() in markdown_suffixes
    ]
    if mdformat_targets:
        file_args = " ".join(shlex.quote(str(path)) for path in mdformat_targets)
        repo_root_quoted = shlex.quote(str(REPO_ROOT))
        _run_cmd([PYTHON_BIN, "-m", "pip", "install", "mdformat==0.7.17"])
        _run_cmd(
            [
                "bash",
                "-lc",
                f"cd {repo_root_quoted} && {shlex.quote(PYTHON_BIN)} -m mdformat {file_args}",
            ]
        )

    _run_cmd([PYTHON_BIN, "-m", "pip", "install", "PyYAML==6.0.1"])
    validation_cmd = [
        PYTHON_BIN,
        str(CURRENT_DIR / "validate_translations.py"),
        "--payload",
        str(PAYLOAD_PATH),
        "--report",
        str(VALIDATION_REPORT),
    ]
    validation_result = subprocess.run(validation_cmd, check=False)
    if validation_result.returncode != 0:
        _info("Structural validation reported issues; continuing so translations stay available.")
    _maybe_post_validation_comments(commit_sha)
    _run_cmd(
        [
            PYTHON_BIN,
            str(CURRENT_DIR / "fix_front_matter.py"),
            "--languages",
            *args.languages,
        ]
    )
    _run_cmd([PYTHON_BIN, str(CURRENT_DIR / "cleanup_tmp.py")])

    missing_report = _report_missing_translations(english_files, args.languages)
    locale_summary = _report_locale_findings(LOCALE_REPORT)
    validation_summary = _load_validation_findings(VALIDATION_REPORT)
    validation_block = {
        "status": validation_summary.get("status", "unknown"),
        "issue_count": validation_summary.get(
            "issue_count",
            len(validation_summary.get("issues", [])),
        ),
        "issues_by_language": validation_summary.get("issues_by_language", {}),
    }
    summary_payload = {
        "missing_per_language": missing_report,
        "locale_added_per_locale": locale_summary.get("added_per_locale", {}),
        "locale_unused_keys": locale_summary.get("unused_keys", []),
        "validation": validation_block,
        "validation_status": validation_block["status"],
        "validation_issue_count": validation_block["issue_count"],
        "validation_issues": validation_summary.get("issues", []),
        "payload_entry_count": len(payload_entries),
        "localized_file_changes": len(target_files),
        "diff_file_count": len(english_files),
        "payload_segments": payload_segments,
    }
    COVERAGE_REPORT.write_text(
        json.dumps(summary_payload, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    _write_validation_snapshot(payload_entries, validation_summary, summary_payload)

    _info("Rose pipeline completed successfully.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
