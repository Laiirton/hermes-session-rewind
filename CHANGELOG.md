# Changelog

## Unreleased

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
