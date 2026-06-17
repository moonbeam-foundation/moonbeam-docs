---
description: Detect Moonbeam network runtime upgrades and update variables, runtime upgrade docs, and the runtime test suite.
disable-model-invocation: true
---

Follow these steps exactly:

1. **Confirm prerequisites before making changes.**
   - Use an existing `moonbeam-docs` checkout; the skill lives in this repo, and the script resolves the docs checkout itself from its own location.
   - The commands below reference the script via `${CLAUDE_SKILL_DIR}`, which Claude Code sets to this skill's directory when the skill is invoked. Always invoke this skill explicitly (for example `/update-runtime`) so the variable is set; if a command fails with exit code 127 and a path like `/scripts/runtime-bump`, the variable expanded empty because the skill was not invoked through the skill mechanism.
   - Use an existing `papermoonio/moonbeam-docs-test-suite` checkout if available. Set `MOONBEAM_DOCS_TEST_SUITE_DIR` only when the test suite is not next to the docs checkout.
   - Runtime and block detection uses the public RPC endpoints — no API key required.
   - Only check `gh auth status` when the user asks to create PRs.
   - Runtime plan JSON files are temporary artifacts. They must stay outside every repo, normally at `/tmp/moonbeam-runtime-bump/runtime-bump-plan.json`.

2. **Run a dry run first. Do not apply changes yet.**
   ```bash
   "${CLAUDE_SKILL_DIR}/scripts/runtime-bump" run --dry-run
   ```
   The command prints a human-readable summary. Read and report:
   - whether any networks changed (listed under `Changed networks:`)
   - for each changed network: the old and new runtime, upgrade block and whether it was confirmed, forum URL
   - any `Review items:` listed at the end
   - if no networks changed, the output is `No runtime changes detected.`

3. **Stop if the dry run reports blocking review items.**
   - Do not run `--apply` if any blocking review items remain. Blocking items are those about a missing upgrade block — the apply cannot produce a correct runtime table row without one.
   - A missing forum URL is non-blocking: the runtime table will use plain text and apply can proceed. Ask the user if they want to provide `--forum-url` before continuing. If they decline, **omit `--forum-url` entirely — never pass a placeholder such as `none`, `null`, or an empty value.** A placeholder would otherwise be embedded as the link target (for example `[4303](none)`).
   - Upgrade blocks should be detected automatically from Subscan/RPC. Ask the user for a block only if every automated method fails.
   - If the dry run shows no changed networks, report that docs and tests are already aligned and stop.

4. **Apply only after the dry run is clean and the user approves.** Ask explicitly: "The dry run is clean. Ready to apply changes?" before running `--apply`.
   ```bash
   "${CLAUDE_SKILL_DIR}/scripts/runtime-bump" run --apply
   ```
   This must update:
   - `variables.yml` in `moonbeam-docs`
   - `builders/build/runtime-upgrades.md` in `moonbeam-docs`
   - `test/builders/build/runtime-upgrades.js` in `moonbeam-docs-test-suite`
   It must write the plan JSON outside the repo, normally `/tmp/moonbeam-runtime-bump/runtime-bump-plan.json`.

5. **Review the docs diff.**
   In `moonbeam-docs`, inspect:
   ```bash
   git diff -- variables.yml builders/build/runtime-upgrades.md
   git status --short
   ```
   Confirm:
   - only networks that changed have updated `spec_version` values;
   - `builders/build/runtime-upgrades.md` has the correct runtime row, Subscan block link, and forum link when one clear match exists;
   - no `runtime-bump-plan.json` or other temporary JSON file is present in the repo;
   - any additional modified docs files are intentional follow-up edits for links/snippets.

6. **Review the test suite diff.**
   In `moonbeam-docs-test-suite`, inspect:
   ```bash
   git diff -- test/builders/build/runtime-upgrades.js
   git status --short
   ```
   The expected default test suite diff is only the runtime assertion update in `test/builders/build/runtime-upgrades.js`. If files such as `.gitignore` appear, treat them as unexpected and do not include them unless the user explicitly approves.

7. **Run verification after apply.**
   ```bash
   "${CLAUDE_SKILL_DIR}/scripts/runtime-bump" verify --plan /tmp/moonbeam-runtime-bump/runtime-bump-plan.json
   ```
   Review:
   - docs git diff summary;
   - test suite git diff summary;
   - links that interpolate `networks.<network>.spec_version`;
   - MkDocs build result when available.

8. **Handle affected `spec_version` links before PRs.**
   If `verify` reports GitHub links using `networks.<network>.spec_version`, open the listed files and inspect the target in the new runtime. Update line anchors or nearby text when needed. Do not assume snippets are safe only because variables changed; use `git diff` and `verify` output as the source of truth.

9. **Confirm temporary artifacts are absent from repos.**
   Before creating PRs, check both repos:
   ```bash
   git status --short
   ```
   No `runtime-bump-plan.json` or generated temporary JSON file should appear. If a plan JSON appears inside a repo, remove it before continuing.

10. **Create PRs only after diffs and verification are clean.**
    First check GitHub CLI auth:
    ```bash
    gh auth status
    ```
    Then create PRs:
    ```bash
    "${CLAUDE_SKILL_DIR}/scripts/runtime-bump" create-prs --plan /tmp/moonbeam-runtime-bump/runtime-bump-plan.json
    ```
    This creates two PRs:
    - one PR in `moonbeam-docs` for variables, runtime upgrades docs, and any verified link/snippet follow-ups;
    - one PR in `papermoonio/moonbeam-docs-test-suite` for runtime test assertions.
    The CLI should use direct push when available and fork fallback otherwise.

11. **Report the final result.**
    Include:
    - changed networks and runtime versions;
    - upgrade block and whether it was confirmed;
    - forum URL or note that no forum URL was used;
    - docs files changed;
    - test suite files changed;
    - verification result;
    - PR URLs if PRs were created.

Useful overrides when RPC detection is incomplete or human confirmation is needed:

```bash
"${CLAUDE_SKILL_DIR}/scripts/runtime-bump" run --dry-run \
  --runtime moonbeam=4301 \
  --upgrade-block moonbeam=15423985 \
  --forum-url 4301=https://forum.moonbeam.network/t/example/1234
```

Default branch name: `runtime-bump/rt-<runtime>`.
