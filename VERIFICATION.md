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
| Fork of an already-forked session | retested live and it now completes: session `local-45`, itself the child of branch `4bc3c6c5`, was rewound at its first turn and branch `1c73c549` reached `done` with child `local-c05a827c…`, its worktree attached, the prompt run and 71 events recorded. The earlier `Session revision unavailable; reopen the session before editing metadata` did not reproduce; the cause was not isolated, so this is an observation, not a confirmed fix. Shot `20261105-1137-fork-of-fork-completed-dark-1350.png` |
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
| Empty baseline verdict | live data on branch `2fd1290c` (fork of `local-0f`'s first turn): the frozen original has 0 tokens, 0 tool calls and 0 errors, and the verdict used to read "left has fewer tool errors". Running the installed code against the live store now returns "nothing was recorded before the fork, so the rerun has no baseline". The app window kept showing the old sentence because its plugin host imported the module before the file was replaced; the same sentence was then read in the app after a full stop/start of the gateway and the Desktop app, which is the only way to reload the plugin host's Python |
| Dialog fork, end to end | live on `local-0f` (never forked): Prepare gave a worktree and snapshot, `Fork & run` created a new child session (`local-3835481274346c30…`), opened exactly one tab, attached the isolated workspace (status bar showed `2fd1290c`), the rerun read the pack, inspected the restored files and answered, and the branch reconciled to DONE with the comparison panel filled in. The same action on `local-c5`'s second turn is refused by the claim guard because that turn's child was already recorded three times under the old id bug |
| Verify on the rerun's workspace | live on branch `2fd1290c`: Verify ran `python -m pytest -q` inside `.hermes-rewindfd1290c`, recorded exit 1, showed the real stderr (`python.EXE: No module named pytest`) and the verdict changed to "right failed verification (exit 1)". `demo-repo` has no `.venv`, so the gateway interpreter is the correct fallback and the failure is the environment's, not the plugin's — the point is that verify executes, captures and reports honestly instead of showing "not run" |
| Keyboard and palette entry | live: from the `local-c5` chat view, `Ctrl+Alt+R` opened the Session Rewind page and the page came back with its previous selection and open branch panel; the palette lists "Open Session Rewind" under COMMANDS (typed `Open Session Rewind` matched it exactly) |

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

The four queries one page load makes were also timed against the live store
(13 sessions, and a session holding 15 branches, 2 turns and 2 snapshots):
4.2, 4.3 and 5.1 ms for the whole set across three runs, so the data behind the
Rewind page costs about five milliseconds of its one-second budget. The rest of
the budget goes over HTTP and through React and is not isolated here: the
gateway answers the plugin API on a loopback port that requires the app's own
ticket, and reading that credential is out of bounds for this plugin and for
this run.

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
| Shared-child disclosure | branch `c0373738` of session `local-c5` shows the amber note in the real app, and the three figures below it are labelled as possibly belonging to another fork. Shot `20261105-1125-branch-detail-shared-child-note-dark-1350.png` |
| Shared-child negative control | branch `3c29d531`, which owns its rerun session, shows no note and a normal verdict ("right has fewer tool errors") against a frozen baseline of 422.368 tokens and 2 errors. Shot `20261105-1125-branch-detail-no-shared-note-dark-1350.png` |
| Branch chip labels | live after a full app restart: `local-c5` renders "2 messages" on the three branched chips and "context pack" on the others, `local-45` renders "context pack" on all three, including the completed fork of a rewind child. Shot `20261105-1141-branch-chips-labels-dark-1350.png` |
| Disabled action reasons | Verify and Cleanup expose why they are disabled through the native `title` attribute. **Not visually confirmed**: Computer Use has no hover action, so the tooltip could not be captured; the strings and their conditions are read from the source |
| Light theme after the note colour change | not re-captured this cycle: the note moved from tertiary to primary text, which raises contrast by construction, and the chip labels are colourless. The last light-theme captures predate this change |
| Verify wording and agreement | live on branch `9be25242` after a full restart: the header reads "verify passed" in green and the rerun card reads "passed", where before this change the header said "verify: 0" and the card said "not run" for the same branch. Shot `20261105-1156-branch-detail-verify-consistent-dark-1350.png` |
| Session header while a branch panel was open | one frame dropped the token segment and the right-hand hint while showing everything else correctly; the next frame of the same state showed both. Not reproduced, so it is recorded as an observation rather than filed as a defect |
| Branch count affordance | live on `local-c5` after a restart: the strip reads "BRANCHES 15" while ten chips fit, so the five behind the scroll are no longer invisible. Shot `20261105-1159-branch-count-affordance-dark-1350.png` |
| Turn work span | live after a gateway and app restart: the "Diga apenas: pronto" turn on `local-c5` dropped from 21602.8s to 2.8s and `local-c0`'s rerun turn from 864.3s to 293.1s, while a turn bounded by the next turn stayed at 155.5s. Shot `20261105-1205-turn-duration-corrected-dark-1350.png` |
| Keyboard focus on the page | live: a mouse click on a session card draws no ring, the next `Tab` puts an accent outline on the card below it (`20261105-1210-page-focus-ring-dark-1350.png`), and `Enter` selects it — the header moved to `local-0f` and its branch `2fd1290c` appeared. The same click-then-Tab before this change produced no visible ring |
| Escape closes the comparison panel | live on `local-45`: branch `1c73c549` opened from its chip, one `Escape` removed the panel and returned the timeline to the full height. Shot `20261105-1217-escape-closes-branch-panel-dark-1350.png`. The fork dialog keeps its own Escape handling, and the page handler stands down while the dialog is open |
| Dialog carries label | live on `local-c5`: before Prepare the checkpoint card reads "carries —", after Prepare it reads "carries the context pack", matching the branch chips. Shots `20261105-1224-dialog-carries-idle-dark-1350.png` and `20261105-1227-dialog-no-false-first-turn-dark-1350.png` |
| First-turn claim on a closed session | the second turn of `local-c5` no longer claims "This is the first turn"; only the accurate closed-session sentence remains. The same Prepare also shows the focus ring returning to the Rewind button after Escape |
| Outcome wording | live after a restart: every reaped session card reads "ended with its window · 663.256 tokens" on one line and the still-open one reads "recording", shot `20261105-1241-outcome-labels-one-line-dark-1350.png`. The wording comes from the installed agent, which lists `ws_orphan_reap` and `startup_orphan_reap` as recoverable viewer-close reasons; the first draft said "ended when its window closed" and wrapped every card onto two lines, so it was shortened before shipping |
| Timeline during a live rerun | reproduced and fixed: selecting `local-e5` while another session streamed events left it on "no user turns came back" for over two minutes, while the same query answered correctly in-process and through the endpoint test client. After coalescing host events the same selection shows its turn in about four seconds with a rerun still recording, no Refresh pressed. Shot `20261105-1305-turns-load-during-rerun-dark-1350.png` |
| Dialog fork cycles | ten consecutive forks driven through the Desktop dialog, all ten succeeding: `3cae2b6d`, `094ce610`, `a72b5b98`, `18b16d01`, `14536562`, `1c73c549`, `06f93928`, `70595297`, `060ab70a` and the earlier `local-0f` cycle, each opening exactly one tab and none of them a duplicate — the titles now carry the branch id, so two forks of one turn cannot collide. The last three ran in one sitting: `06f93928` done in 25 s, `70595297` running with 33 events, `060ab70a` done with child `local-57294b44`. Inventory at 14:30: twelve branch rows in `prepared/running/done/failed` and twelve worktree directories, an exact match — zero orphan worktrees, zero worktrees missing. Shots `20261105-1405-*`, `20261105-1427-*` |
| Abandoned-workspace sweep across sessions | live: two branches left `prepared` on `local-c5` by earlier dialog tests survived eleven prepares because the sweep was scoped to the session being prepared. After a gateway restart with the load-time sweep the store reported `prepared: []`, `discarded` rose from 2 to 4, and both worktree directories were gone, while `local-c3`'s seven healthy branches stayed (`20261105-1324-branches-intact-after-sweep-dark-1280.png`) |
| Rewinding the same turn twice | refused before, works now: `local-e9` was forked again and got a new child `local-8b931da5…` beside the original `local-45c9c336…`, and `local-45` was forked a second time into `local-e93e624d…` beside `local-c05a827c…`, each opening exactly one tab (`20261105-1351-refork-same-turn-unique-title-dark-1215.png`). The cause was the title: `session.create` with an existing title returns that session, and every fork of a turn used the same `↺ <session>` title |
| Dialog fork cycle 9 | `06f93928` prepared from the "Diga apenas: pronto" turn of `local-1f` in about 0.8 s, forked, ran to `done` in 25 s with the child answering "pronto", and opened exactly one tab, titled `↺ LOCAL-1F · 06F93928` in the strip. Shot `20261105-1405-fork-cycle-9-rerun-answered-dark-1215.png`. The first click on Fork & run landed in the textarea because the verify block had grown and pushed the footer down 35 px; the button itself worked first time at its new position |
| Nested tool calls no longer invent a session | live after a gateway restart with the fix: the `unknown` card stayed at exactly 77 events across a full rerun, and the store has no session row keyed by an empty id. The reparenting itself was not exercised live — this rerun used the terminal tool directly, which does carry a session id — so both branches are proven by tests that fail without the change (`test_nested_tool_call_is_recorded_under_the_session_of_its_task`, `test_event_without_a_session_and_without_a_known_task_is_dropped`). The 77 rows already under `unknown` predate the fix and stay as recorded, because moving them would mean renumbering sequence ids inside a live store |
| False empty timeline on selection | live, same session both times: clicking `local-e5` before the change left "The recording holds 19 events but no user turns came back. Choose Refresh." on screen for over half a minute while the store, the repository call and the endpoint test client each returned its one turn, and only Refresh fixed it. After the change the same click shows the turn, and clicking `local-05` (170 events, the slowest session) was caught mid-request reading "Loading turns..." (`20261105-1425-loading-turns-instead-of-false-empty-dark-1215.png`), then settling to "42 tools 2 errors 685.3s" about 1.5 s later. No unit test covers this: the repository has no component-rendering harness, so the gate is the running app |

| Light theme after the copy changes | live at 14:33, reached through Settings → Appearance → Theme and restored to Dark afterwards: the session cards read "ended with its window", "recording" and "shutdown" on one line each with the green "running" badge beside Refresh (`20261105-1433-light-page-cards-outcomes-1215.png`); the branch chip row reads "BRANCHES 1 · 3cae2b6d DONE context pack" with the count label legible on the light background (`20261105-1433-light-branch-chips-1215.png`); the idle dialog shows "carries —", "verify timeout —" and "not prepared" in dark-on-white with an unambiguous primary button (`20261105-1434-light-dialog-idle-1215.png`). No overflow at 1215x768 in either theme. The amber shared-child note was not re-shot in light: it needs a legacy branch whose child was shared, and its sentence uses `text-(--ui-text)` rather than a fixed colour, so it follows the mode |
| Settings page after the tree was re-synced | live at 14:39 through Settings -> Plugins -> session-rewind: the plugin gets its own page with its description, a Save settings button and all eight fields the manifest declares - Retention 30, Capture tool results on, Redact secrets on, Payload limit 50, Workspace snapshots on, Verify timeout 120, Pause recording off, Workspace root `E:/git/hermes-plugin-hackathon/demo-repo` - each with the description text from `plugin.yaml`, and the element ids are host-generated (`plugin-settings-session-rewind-workspace_root`), so the App is reading the synced manifest rather than a cached copy (`20261105-1439-settings-page-synced-manifest-1215.png`). Out-of-range values were deliberately not typed in: saving a tiny `retention_days` or a huge `verify_timeout` would act on the user's real recordings and could hang the next verification, and the clamping itself is covered by `tests/test_settings_load.py` |
| Empty timeline copy is honest | live at 14:46 on the `unknown` session, which really holds 77 tool calls and no user turn: the panel reads "The recording holds 77 events but no user turn." instead of the old "...but no user turns came back. Choose Refresh.", which told the user to press a button that could not change the answer (`20261105-1446-empty-turns-copy-honest-dark-1215.png`). The three branches of the helper are unit-tested, and the message is only reachable now that a load in flight says so separately |
| Console re-measured on the current bundle | live at 14:48 with DevTools attached after `3a2a279`, `62dc428` and `66b47e1`: the console read `0 messages in console` on load and still `0 messages in console` after switching sessions, opening the branch chips and loading the comparison panel, with the toolbar showing `No issues`. The earlier measurement at 10:19 predates three UI commits, so this is the one that counts |
| Frozen baseline outcome wording | live at 14:51 on branch `3cae2b6d` of `local-38`: the Original card reads "Original · frozen 10:43:12 / outcome **open at freeze** / tokens 0 / tool errors 0" while the Rerun card beside it reads "outcome ended with its window" — the two now say different things about different moments instead of contradicting each other (`20261105-1451-open-at-freeze-baseline-dark-1215.png`). Both branches of the new helper are unit-tested |
| Branch prepared in under 5 s, instrumented | measured through the Desktop dialog at 14:57 on `local-38`: the pointer click on Prepare branch was dispatched at epoch 1793901472.400 and the store row `24e9f4b4` was written as `prepared` at 1793901472.974 - **0.574 s** end to end, covering the RPC, the snapshot lookup, the worktree creation and the row write, against a 5 s target. The clock was taken in the same call as the click, so the figure includes the input dispatch and not just the server work. One sample, not a distribution: the four prepares before it were observed at 0.8-3 s from the dialog without a clock |
| Component render tests | new at 15:07: three tests in `RewindPage.test.tsx` run the page in jsdom against a stubbed SDK and a routed `ctx.rest`. Each was negative-tested by reverting the fix it covers: with the selection reset removed, the loading-state test fails on the false empty panel (`expected <div></div> to be null`); with the empty-recording sentence reverted, both it and the unit test fail. The paint measurement is jsdom with a stubbed backend - **12.17 ms** from render to the first timeline row, on top of the 4.2-5.1 ms the live queries take - so the one-second target is now bounded by a repeatable number on both halves, but the running app is still the evidence that matters and the live shots above stand on their own |

Not yet verified live: the 1920x1080 and 1280x720 layouts (the display is 1366x768), whether the App enforces the numeric bounds in its own inputs, a 10k-event session driven live. Page interactivity is now bounded on both halves: 4.2-5.1 ms of live queries and 12.17 ms of jsdom render, with the running app still the primary evidence. The prepare timing above is one measured sample; more samples are listed as a next step. Ten consecutive dialog forks are now verified, recorded above, as is the light theme for the page, the chips and the dialog. A fork of a session that is itself a rewind child was retested and completed.
