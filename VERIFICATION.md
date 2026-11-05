# Verification

Environment: Windows 11, Hermes Agent 0.22.7, Python 3.12.10, Node 24.21.0, npm 11.19.0, Git 2.56.0.

## Official plugin validation

```text
hermes plugins validate plugin --install-deps
```

Result: passed.

- manifest
- manifest fields
- requires_hermes
- config schema
- requires_env
- oauth
- loadable (`__init__.py`, `desktop/plugin.js`)
- python dependencies
- capability probe
- declared tools
- declared hooks
- declared middleware
- built-in tool collisions
- security scan
- no core override
- desktop surface
- isolation

## Python checks

```text
ruff format --check .
ruff check .
mypy
pytest --cov=session_rewind --cov-report=term-missing
```

Result: green. 57 tests passed, 88.19% coverage.

## Desktop checks

```text
cd ui
npm ci
npm run typecheck
npm run build
```

Result: green. `plugin/desktop/plugin.js` builds to a single ESM artifact. The minified artifact has no comments and imports only `@hermes/plugin-sdk`, `react` and `react/jsx-runtime`. CI fails if the artifact differs from a fresh build.

## Git engine

Integration tests create a temporary repository and verify:

- A snapshot does not change HEAD, the real index or the working tree.
- Shadow refs pin snapshots.
- A detached worktree restores the snapshot.
- Cleanup removes the worktree.
- Tree-to-tree diffs report the expected additions.
- The verify runner returns exit codes, timeouts and missing-command errors.

## API

FastAPI tests cover health, sessions, event pages, event detail, search, snapshots, branches, bookmarks, compare, fork prepare, fork commit, verify, cleanup and error paths.

## Live Hermes test

The plugin was installed into the Hermes profile and enabled. A real CLI session ran with `workspace_root` pointing at a demo repository with a failing test.

- The session recorded six events: `session_start`, `user_turn`, `api_request`, `llm_call`, `assistant_response`, `turn_end`.
- The session completed with the configured model.
- A snapshot was created with `fidelity: full`, three tracked files, a shadow ref in `refs/hermes-rewind/<session>/8` and the expected commit.
- The fork API was exercised against the live database and snapshot: `prepare` restored a detached worktree from the snapshot, `verify` ran `pytest -q` in the worktree and returned the expected failing exit code, and `cleanup` removed the worktree. The original repository was not modified.
- The dev-side API harness does not include `hermes_state`, so the transcript row count is reported as unavailable there. Inside Hermes the read-only `SessionDB` reader resolves the display-row prefix; the UI reports the history-row count or falls back to the context pack.

## Desktop UI and API

The Desktop half appeared in Capabilities → Plugins with the Agent + Desktop toggle. Enabling it added the Rewind status bar chip and the Rewind page.

The page initially returned `404 {"detail":"Not Found"}` because the web server only mounts `/api/plugins/<id>/` for plugins with a `dashboard/manifest.json` declaring an `api` file. Adding `plugin/dashboard/manifest.json` with `"api": "plugin_api.py"`, reinstalling the plugin and restarting the gateway mounted the API. The page then listed the recorded sessions, the event timeline and the snapshots.

A live Desktop session in `demo-repo` was recorded end to end:

- Capture recorded 73 events, including `session_start`, two user turns, tool calls and results, usage, replies and `turn_end`, plus two workspace snapshots.
- Forking the first user turn prepared `fidelity: full` with 0 history rows and created a new session through `session.create`; the agent worked in the restored worktree, fixed `app.py`, ran pytest and reported the passing test.
- Forking the second user turn prepared 2 history rows, branched through the stored row id with `session.branch`, copied the first turn's display transcript, set the child cwd to the new worktree and submitted the context prompt.
- The prepare dialog showed the restored workspace path, the history-row count and the verify timeout; the verify command is persisted on commit.
- `verify` ran the full virtualenv command in the worktree and returned exit 0 with `1 passed`. The branch panel compared original and rerun tokens/tool errors.
- `cleanup` removed the worktree and marked the branch `cleaned`; the other two abandoned prepared worktrees remained until cleanup, which exposed the stale-prepare cleanup gap below.
- The app needed a restart after each gateway restart to refresh its backend ticket; until then it showed `Gateway ticket bootstrap failed` and `Backend: offline`.

Known issues found during the live run:

- This gateway build rejects `idempotency_key` on `session.create` and rejects `count` on the Desktop `session.branch` wrapper; the UI now sends only fields the live gateway accepts.
- `verify_cmd` is free text and runs in the gateway environment, so a bare `pytest` is not on PATH on Windows; the recorded run used the virtualenv python path.
- A branch card can stay `running` until the turn-end reconciliation lands; the child turn outcome is now derived from the latest `turn_end` event.
- The injected prompt originally told the model not to redo work already present; the live rerun answered without inspecting the restored files. The prompt now states that the restored files are authoritative and that transcript claims are history.

## Demo

Pending recording. Script: `docs/demo-script.md`.

## Catalog

Draft: `catalog/session-rewind.yaml`. The final submission replaces the placeholder SHA with the pushed 40-character commit, updates the platforms after the CI matrix, and adds screenshots pinned to the same commit.
