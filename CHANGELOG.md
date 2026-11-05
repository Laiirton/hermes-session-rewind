# Changelog

## Unreleased

- Say what the page actually knows when a turn query comes back empty: a session with recorded events no longer claims that no user turns were recorded, it reports that nothing came back and points at Refresh.

- Refuse a bookmark that pairs a session with an event of another session. The foreign keys only proved the event existed, so a model-supplied pair could record a bookmark under a session that never contained it.

- Write the counts in the singular where they are one: a session with one checkpoint read "1 snapshots" and one turn read "1 turns". All count copy now goes through one helper.

- Stop the preamble disclaimer from surviving inside the quoted task when a rewound turn is rewound again: the instruction sentence was replayed as part of the user's own words, so it appeared twice in the pack and once of those inside the data delimiters.

- Refuse a fork whose turn belongs to another session, and keep the timeline to the selected session: switching sessions left the previous session's turn rows on screen, and preparing one of them silently forked the other session from its own anchor.

- Claim only the files a write tool touched in the context pack: a `read_file` or `search_files` call is no longer reported to the rerun as something the earlier turn changed.

- Commit a branch before its rerun starts, and refuse a child session that is the parent itself or already claimed by another branch. Three live branches had recorded the same child session, which made the comparison, the state and the cleanup all point at one rerun.

- Fork a recorded session that is already closed: the rerun starts a new chat carrying the context pack instead of refusing because the parent is not live, and the dialog says so before you press the button. Fork failures now render at the top of the dialog, where they are visible without scrolling.
- Reconcile no longer reports a fork as failed while its child session is still waiting to be captured; an unrecorded child gets the same grace window as an unfinished run.

- Follow the app's light mode in the fork dialog: the mode comes from `useTheme().resolvedMode` and the dialog carries an explicit light value set, because the `--ui-*` tokens do not resolve inside the plugin iframe. Custom palettes are still not adopted; see `docs/limitations.md`.

- Resolve the verify command against the command in the field, not the one recorded when the branch was prepared; the dialog no longer reports "not found on the gateway PATH" for a command the gateway was never asked about.

- Detect the workspace's own verify command from its project markers and prefill it, replacing four static guesses once a branch is prepared.
- Fall back to the interpreter running the plugin when `python` is not on the gateway PATH, so verification still has a real interpreter instead of failing to resolve.

- Tool errors no longer echo raw database messages; a missing session reads "session or event not found" and an unreachable store reads "the rewind store is unavailable".
- Prove the `capture_dropped` overflow signal reaches the store through a test.

- Show an explicit loading state for sessions and turns instead of the empty-state copy while the first fetch is in flight.

- Move the fork prefix selection out of the dialog component and cover it with nine vitest cases, so the row the child session branches from is now tested rather than assumed.

- Keep recording when the store fails: a batch that cannot be written is retried after reopening the database, and only after three consecutive failures is it counted as dropped rather than silently ending the writer thread.
- Close four redaction gaps found by probing the redactor with real secret shapes: `sk-proj-…` keys, bare JWTs, sensitive keys whose value is a number, and assignments with values shorter than eight characters.

- Quote the recorded task, summary and error inside explicit delimiters in the generated context pack and state that the quotation is data, not an instruction channel.
- Unwrap a task that is itself a rewind context pack, so forking a forked turn no longer nests the preamble and replays stale claims about earlier turns.

- Apply the `retention_days` setting: finished sessions older than the window are deleted at plugin load, together with their shadow refs, while live sessions and sessions with a branch still running or prepared are kept.
- Group the timeline by user turn and page it by cursor from the newest turn; the previous first-500-events page made later turns unreachable in long sessions.
- Freeze the comparison baseline at the fork point and let the verify exit code decide the verdict and the branch state.
- Resolve verify commands per platform, through PATH or relative to the worktree, wrapping batch shims on Windows, and prefer the project virtualenv over the gateway interpreter.
- Sweep abandoned prepared branches into `discarded` and remove their worktrees; cleanup no longer needs a snapshot row.
- Migrate the store when the dashboard mount loads, so a fresh install does not 503.
- Add a command-palette entry, a `Ctrl+Alt+R` keybinding, SDK-scoped timers, event-driven refresh, a stop-polling rule for terminal branches, and focus management with visible focus rings in the fork dialog.
- Add verify presets and show the exact command line that will run.
- Add ESLint, Prettier and a coverage floor to CI.

- Close a turn with `on_session_end` and a session with `on_session_finalize`, so a live session no longer looks completed after its first turn.
- Branch through the stored row before the selected turn on Desktop (`through_message_id`), matching the live branch wrapper; start a fresh session when the fork is on the first turn.
- Resolve the Desktop parent's stored session key through `session.title` and count display rows through `get_resume_conversations`.
- Persist the verify command when the fork is committed and disable Verify until a command exists.
- Mark a child branch `done` or `failed` from its latest `turn_end`, and derive the rerun outcome in comparisons.
- Clarify the generated prompt so the restored files are authoritative and transcript claims are treated as history.
- Document the gateway-environment verify command and the Desktop gateway-ticket restart requirement.
- Redesign the fork dialog around a solid themed modal, a checkpoint summary, one primary action per stage, Escape-to-close and a responsive layout.

## 1.0.0

- Record session lifecycle, prompts, responses, tool calls, tool results, usage and compactions.
- Store a local SQLite timeline with redaction, truncation and retention.
- Snapshot git workspaces with a private index and shadow refs.
- Fork a user turn through the public gateway RPC chain into an isolated worktree.
- Change the model or prompt and rerun.
- Compare outcomes, tokens, tool errors, duration and verify results.
- Add a Desktop timeline, inspector, fork dialog and comparison panel.
- Mount the Desktop backend API through the dashboard manifest.
- Add the official plugin validator, Ruff, mypy, pytest, TypeScript and a CI matrix.
