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

Result: green. 117 tests passed, 90% branch coverage, with `--cov-fail-under=85` enforced in CI.

## Desktop checks

## Frontend tests

The fork prefix selection (`branchPoint`) decides which recorded rows the child session
inherits, and it had no test at all. It now lives in `ui/src/forkPrefix.ts` with nine vitest
cases covering the checkpoint selection, the first-turn case, rows without displayable text and
the missing-history path. Reintroducing the off-by-one fails three of them.

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
| Redaction | probed live: `sk-proj-…`, bare JWTs, numeric `token` values and 7-character `password=` values were all stored unredacted before the fix; each now has a regression test and ordinary text is still untouched |
| Context pack of a rewind child | one preamble only, with `Original user task:` quoting "Diga apenas: pronto"; the earlier nesting duplicated the preamble and replayed stale claims |
| Console messages | DevTools attached from an app reload, then the page was driven through the keybinding, a session switch (73 events), turn expand and collapse, an event-detail fetch, the dialog, Prepare and Escape: the console reported `0 messages in console` and `No issues` |
| Verify resolution after the fix | with the detected preset applied by Prepare the line reads `Resolves to …python-3.14.9…\python.EXE -m pytest -q`; after editing the field to `definitely-not-a-real-tool check` it reads `Not found in the gateway environment`, so the line follows the command in the field |
| Fork dialog in light mode | switched the app to Light in Settings → Appearance → Theme: the panel, inputs, presets, badges, notes and buttons all render light with dark text, and the prepared state shows the green `workspace ready` badge and the resolved interpreter readably; switching back to Dark left the dialog unchanged |
| Fork of a closed session | live: preparing `local-01` (ended, `ws_orphan_reap`) shows "This session is closed, so the rerun starts a new chat carrying the recorded context…", `Fork & run` created a child session, opened one tab for it, set its cwd to the new worktree and the child ran the context pack |
| Fork failure visibility | live: before the change a failed `Fork & run` left the dialog looking unchanged because the banner sat below the fold; failures now render at the top of the dialog. The failure captured on the way was the then-current refusal for a closed session, which the row above has since replaced |
| Duplicate child guard | live: forking the same turn again stops at "could not record the branch: … that session is already the rerun of another branch", shown at the top of the dialog, and the rerun is not started because the branch is committed before the prompt is submitted |
| Timeline scoped to the session | live: with `local-45` open, selecting `local-c5` kept showing `local-45`'s turn row, and preparing that row forked `local-45` while the dialog was titled `local-c5` (history rows 0, "This is the first turn", snapshot from the wrong session). After the fix the same selection shows `2 turns · start of the recording` and preparing the row reports history rows 2 with the matching snapshot |
| Context pack file list | live on `local-c5`: the pack claimed `test_app.py`, which the earlier turn only opened with `read_file`. It now lists only the two files `patch` wrote, and the same three-event replay against the real recording gives 3 claims before and 2 after |
| Unwrapped task stays data | live on `local-45` (a rewind child): the pack used to carry the preamble disclaimer twice, the inner copy inside `<recorded-task>`; the same turn now yields one disclaimer, outside the delimiters, with only the user's two lines quoted inside |
| Empty turns during gateway boot | live, once: seconds after `hermes gateway restart` the page read "No user turns recorded yet for this session" with `1 snapshot` while the store held 2 snapshots and 2 user turns for the same session. The cause was not established and the attempt did not repeat: a second restart showed the page keeping its previous data while the backend was offline, then recovering. The copy now states what came back instead of claiming the recording has no turns |
| First-paint query cost | measured against the live store at 12:57: sessions 1.42 ms, turns 1.18 ms, snapshots 0.66 ms, branches 0.67 ms — 3.92 ms total for the four queries the page waits on. The end-to-end interactivity number, which also carries the IPC round trip and the React render, is still not stopwatch-measured |
| Timeline preview of a rewound turn | live on `local-c3`: the row read "You are continuing a Herm…" for a pack whose real task was "Diga apenas: pronto", recorded in the older format without the delimiters and nested twice; after the change the row reads the task. The dashboard module reloads with "Reload desktop plugins", not only with a gateway restart |
| Branch list reachability | live: `local-c5` has 11 branches and none of them were visible without scrolling the left column past all 11 session cards; they now sit under the session header as chips, and selecting one opens the compare panel with the timeline still on screen. A cleaned branch with no run now reads "The rerun never started, and its workspace is gone." with Verify disabled |
| Event kind labels | live on `local-c3`: the expanded turn drew `SESSION_FINALIZE` over its own preview because two of the ten kinds in the store had no label; they now read TURN and FINALIZE with the preview aligned, and the column truncates with the raw kind as its title |
| Child id mapping | live: forking `local-c5`'s second turn answered "could not record the branch: that session is already the rerun of another branch" both before and after the mapping fix, because `session.create` returned the id of an existing session (`local-e96aabef…`, claimed by three branches). The mapping itself is now correct against the backend contract; the closed-session rerun path stays refused by the guard and is recorded as an open defect |

The console check is a renderer measurement, not a claim about the gateway process log. Driving the UI by screenshot pixels needs care: the main window screenshot is 1350 × 711 while the window is wider, so a click aimed at the visible centre of the row's `Rewind` button landed on the row toggle; the button itself works, and the dialog opened on the corrected coordinate.

## Shadow refs in the real repository

The demo repository carries 11 `refs/hermes-rewind/*` refs after roughly two hours of
recording, forking and cleaning, and its `.git` is 159 KB with 20 loose objects. Snapshot
trees that match an earlier commit reuse the same objects, so the refs are not the linear
growth the audit assumed. No pruning cap was added, because nothing measured justified
deleting rewind points that a user can still select.

## Tool surface privacy

Tool handlers returned `str(exception)` for every failure, so a foreign-key violation
reached the model as `FOREIGN KEY constraint failed` and a store error could carry the
database path. Known database failures now map to fixed messages, asserted by a test that
opens the tools against an unusable path.

## Capture durability

The writer thread used to catch its exception outside the loop, so one locked transaction
stopped recording for the rest of the gateway's life while the queue kept filling and dropping
silently. Three tests pin the new behaviour: a transient lock is retried and the event is
stored, repeated failures drain the queue instead of spinning forever, and later turns are
still recorded after an event sink raises. Removing the retry makes the first test fail.

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

| Verify presets | after this change the dialog offered only the detected `python -m pytest -q` chip instead of four generic ones, and prefilled the field |
| Interpreter fallback | the same run exposed that `python` was not resolvable in that gateway process; verification now falls back to the running interpreter, proven by a test that blanks PATH |
| Loading states | sessions and turns now show an explicit loading line instead of the empty-state copy while the first fetch is in flight. The transient frame could not be captured: the local round trip resolves faster than the screenshot pipeline, so the post-reload capture already showed data. No regression was observed |
| Display limit | this machine is 1366x768, so a true 1920x1080 window cannot be captured here; 1366x720 is the largest available and the smallest realistic laptop height |
| Window size 1366x720 | page and dialog both fit: no overflow, no clipped row, footer and primary action visible, dialog body scrolls internally |
| Live session badge | widened to accept the focused stored session id as well as the runtime id, because the two differ in this build. **Not visually confirmed**: no recorded session in the app was simultaneously unfinished and focused during two attempts, so the condition could not be exercised |

Not yet verified live: the 1920x1080 and 1280x720 layouts (the display is 1366x768), ten consecutive forks through the dialog, and a fork of a session that is itself a rewind child (observed to fail above). Light theme was verified live at 11:29 in both the idle and prepared dialog.
