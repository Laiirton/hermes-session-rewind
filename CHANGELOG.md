# Changelog

## Unreleased

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
