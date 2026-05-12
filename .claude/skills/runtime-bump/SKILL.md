---
description: Detect Moonbeam network runtime upgrades and update variables, runtime upgrade docs, and the runtime test suite.
disable-model-invocation: true
---

# Runtime Bump

Use this skill when the runtime upgrade test fails and the docs need to be synchronized with on-chain Moonbeam, Moonriver, or Moonbase Alpha runtimes.

This workflow updates both repositories:

- `moonbeam-docs`: `variables.yml` and `builders/build/runtime-upgrades.md`.
- `papermoonio/moonbeam-docs-test-suite`: `test/builders/build/runtime-upgrades.js`.

It also reviews docs links/snippets affected by `spec_version` changes through the `verify` command. The runtime test suite PR is only one output of the workflow; the docs PR is equally required.

Always start with a dry run:

```bash
"${CLAUDE_SKILL_DIR}/scripts/runtime-bump" run --dry-run
```

Only make changes when the user explicitly asks to apply them:

```bash
"${CLAUDE_SKILL_DIR}/scripts/runtime-bump" run --apply
```

Create pull requests only after reviewing the applied diff:

```bash
"${CLAUDE_SKILL_DIR}/scripts/runtime-bump" create-prs --plan /tmp/moonbeam-runtime-bump/runtime-bump-plan.json
```

## Requirements

- Set `SUBSCAN_API_KEY` before live detection. The script uses Subscan to find runtime events and blocks.
- Authenticate GitHub CLI with `gh auth login` before using `create-prs`.
- Optionally set `MOONBEAM_DOCS_TEST_SUITE_DIR` to an existing checkout of `papermoonio/moonbeam-docs-test-suite`.
- Optionally set `RUNTIME_BUMP_WORKDIR` for temporary checkouts.
- Runtime plan JSON files are temporary artifacts. Keep them outside the repo, preferably under `RUNTIME_BUMP_WORKDIR` or `/tmp/moonbeam-runtime-bump`.

## Workflow

1. Run the dry run and inspect the detected network runtimes, candidate upgrade blocks, forum matches, affected docs files, and test suite update.
2. If the dry run reports ambiguous forum matches or GitHub line anchors, resolve those manually or rerun with overrides shown by the CLI. Upgrade blocks should be detected automatically from Subscan/RPC; only ask the user for a block if every automated method fails.
3. Run `--apply` only after the dry run looks correct. This updates `variables.yml`, `builders/build/runtime-upgrades.md`, and the test suite runtime assertions.
4. Run `verify --plan /tmp/moonbeam-runtime-bump/runtime-bump-plan.json` to review:
   - Git diff in `moonbeam-docs` and `moonbeam-docs-test-suite`.
   - GitHub links that interpolate `networks.<network>.spec_version`.
   - Snippet-related diffs and any rendered docs/build result available locally.
5. Do not assume snippets are safe only because variables changed. Use the verify output and `git diff` to decide whether line anchors or snippet content need follow-up edits.
6. Run `create-prs --plan /tmp/moonbeam-runtime-bump/runtime-bump-plan.json` only after the docs diff and test suite diff are acceptable. It creates one PR for docs and one PR for the test suite, using direct push when available and fork fallback otherwise. Do not commit runtime plan JSON files.

## Expected Outputs

- A docs branch named `runtime-bump/rt-<runtime>` with:
  - updated `spec_version` values in `variables.yml` for only the networks that changed;
  - an inserted or updated row in `builders/build/runtime-upgrades.md`, including Subscan block links and a forum link when one clear match exists;
  - any necessary follow-up edits for GitHub line anchors or snippets surfaced by verification.
- A test suite branch with updated runtime assertions in `test/builders/build/runtime-upgrades.js`.
- A temporary `runtime-bump-plan.json` file outside the repo describing detected runtimes, changed networks, candidate blocks, forum URL, files to edit, and review items.

## Useful Overrides

Use overrides when Subscan data is incomplete or human confirmation is needed:

```bash
"${CLAUDE_SKILL_DIR}/scripts/runtime-bump" run --dry-run \
  --runtime moonbeam=4301 \
  --upgrade-block moonbeam=15423985 \
  --forum-url 4301=https://forum.moonbeam.network/t/example/1234
```

The default branch name is `runtime-bump/rt-<runtime>`.
