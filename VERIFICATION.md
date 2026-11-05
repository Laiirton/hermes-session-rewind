# Verification

Environment: Windows 11, Hermes Agent 0.22.7, Python 3.12.10 (the gateway embeds 3.14), Node 24.18.0, npm 11.19.0, Git 2.56.0. CI runs the same gates on Windows, Ubuntu and macOS with Python 3.12 and Node 22.

## Official plugin validation

```text
hermes plugins validate plugin --install-deps
```

Result: passed. This is a local gate: the Hermes CLI is not installable on CI runners, so CI covers the equivalent checks through the manifest, registration and security tests.

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

Result: green. 103 tests passed, 90% branch coverage, with `--cov-fail-under=85` enforced in CI.

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


## Live Desktop verification (2026-11-05)

Observed in the real Hermes Desktop app through Computer Use; screenshots are kept locally under `AUTOPILOT_SHOTS/`.

| Check | Result |
| --- | --- |
| Rewind reachable from the sidebar row, the status-bar chip, the command palette and `Ctrl+Alt+R` | all four present; the keybinding opened the page |
| Timeline for a 73-event session | grouped into 2 turn rows; expanding one listed its events with tool errors in red |
| Fork dialog | focus moves into the dialog on open, Tab shows a visible ring, Escape closes, `Ctrl+Enter` runs the primary action |
| Verify presets | four presets render; the resolved command line is shown before forking |
| Prepared branch | `workspace ready`, snapshot `0760703f`, worktree path, `history rows 2`, `verify timeout 120s` |
| Frozen baseline on the live store | branch `9be25242` counted 447,220 tokens and 2 tool errors as baseline before the fix; frozen at its fork point it reports 0 and 0 |
| Abandoned worktree | four `prepared` branches left by dialog tests were reclaimed through the new cleanup path and no longer appear in `git worktree list` |
| Fork of an already-forked session | fails with the gateway error `Session revision unavailable; reopen the session before editing metadata`; the dialog keeps the branch and reports the error, so this path is not yet a clean success |
| Scale | 10k-event session: newest turn page 7.7 ms, second page 7.6 ms, one turn expansion 1.0 ms |
| Shadow snapshots and secrets | probed: `git add -A` respects `.gitignore`, so an ignored `.env` is not in the snapshot tree; only already-tracked content is |
| Retention | wired to plugin load and covered by a test that fails when the call is removed |
| Branch refresh | `GET /branches/{id}` no longer writes; the panel refreshes through `POST /branches/{id}/reconcile`, verified live |
| Stale run repair | live branch `3c29d531`, stuck `running` for hours, flipped to `FAILED` on the first panel refresh |
| Frozen baseline in the app | comparison panel shows "Original · frozen 03:13:34" with 422.368 tokens instead of the session total 447.220 |
| Context pack of a rewind child | one preamble only, with `Original user task:` quoting "Diga apenas: pronto"; the earlier nesting duplicated the preamble and replayed stale claims |

## Fork lifecycle, ten consecutive cycles

Driven through `ForkService.prepare` → `commit` → `reconcile` → `cleanup` against the real demo
repository, with the store in a temporary database so the live one stayed untouched.

| Measure | Result |
| --- | --- |
| Cycles completed | 10 of 10 |
| Mean wall time per cycle | 137 ms (max 147 ms), against the 5 s target |
| Branch states at the end | 10 `cleaned`, 0 `prepared`, 0 `running` |
| Worktrees still on disk referenced by a branch | 0 |
| `.hermes-rewind` entries before and after | 5 and 5, so no orphan was added |
| Distinct child session ids | 10, no duplicate rows |

This covers the backend lifecycle. Duplicate Desktop tabs is a renderer concern and is not
measured by this run.

## Scale measurements (synthetic stores, same machine)

| Query | 10,000 events | 100,000 events |
| --- | --- | --- |
| `list_sessions(limit=100)` | 12.3 ms | 96.0 ms |
| `list_events(limit=500)` | 1.9 ms / 75 KB payloads | 2.5 ms / 150 KB |
| `list_turns(limit=40)` | 7.7 ms | 1.3 ms |

A candidate optimisation was measured before adopting it: adding extracted
`tokens_in`/`tokens_out` columns and backfilling changed the session aggregate
from 53.6 ms to 30.8 ms over 100,000 rows in isolation, so the `GROUP BY` scan
dominates and the JSON extraction is not the bottleneck. That did not justify a
versioned schema change plus write-path coupling, so it was not done.

Not yet verified live: light theme, 1920x1080 and 1280x720 layouts, ten consecutive forks, and a fork of a session that is itself a rewind child (observed to fail above).
