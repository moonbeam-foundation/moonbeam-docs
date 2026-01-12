#!/usr/bin/env python3
"""Remove tmp/i18n artifacts so nothing leaks into git."""
from __future__ import annotations

import os
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TMP_ROOT = ROOT / "tmp"
QUIET = os.environ.get("ROSE_QUIET", "").strip().lower() in {"1", "true", "yes", "on"}


def main() -> int:
    if TMP_ROOT.exists():
        shutil.rmtree(TMP_ROOT)
        if not QUIET:
            print(f"Removed temporary directory: {TMP_ROOT}")
    else:
        if not QUIET:
            print("tmp/ already clean")
    return 0


if __name__ == "__main__":  # pragma: no cover
    raise SystemExit(main())
