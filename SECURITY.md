# Security

## Reporting

Open a private security advisory on the GitHub repository. Do not include credentials, transcripts or repository contents in public issues.

## Data handling

Session Rewind is local-first. It stores:

- Session metadata and captured prompts, responses, tool arguments and tool result previews in a SQLite database under the Hermes profile.
- Git objects, shadow refs and worktree metadata in repositories the user selects.
- Fork records, prompts, verify commands and verify output in the plugin database.

Captured payloads are redacted with credential patterns and truncated before storage. Redaction can be disabled in settings, but doing so stores raw payloads. Retention removes old sessions when the configured retention runs.

The plugin reads `state.db` read-only through the documented `SessionDB` facade. It never writes to `state.db`. It does not read `.env`, `auth.json`, CLI token files, browser profiles, keychains or other credential stores. It does not refresh, rotate or write OAuth tokens.

The plugin makes no network requests and has no telemetry.

## Git behavior

Snapshots run local git subprocesses with a private index file. They never change HEAD, the real index, the working tree, branches or remotes. They create dangling commits pinned by `refs/hermes-rewind/<session>/<sequence>` so git garbage collection does not remove them.

Forks create detached worktrees next to the repository under `.hermes-rewind/`. Worktree files can be modified by the rerun. Cleanup removes the worktree and prunes administrative files.

A malicious repository can define clean filters or diff drivers that run programs during git operations. Only point `workspace_root` at repositories you trust, or disable snapshots for untrusted repositories.

## Verify commands

Verify commands are entered by the user and run in the isolated worktree without a shell. They can modify files in that worktree. Use only trusted commands. The plugin never runs verify commands automatically and never runs them under cron or unattended sessions.

## Desktop half

The Desktop half imports only `@hermes/plugin-sdk`, `react` and `react/jsx-runtime`. It does not use `eval`, `new Function`, remote imports, script injection, `window.hermesDesktop` bridge calls or application markup selectors.

## Permissions and approvals

The plugin never auto-approves tool calls, never disables guards and never spawns children that inherit a non-interactive approval mode. Model switches that require confirmation are surfaced to the user and are not auto-confirmed.

## Deleting data

Delete `$HERMES_HOME/plugin-data/session-rewind/` to remove the plugin database. Remove `refs/hermes-rewind/*` and `.hermes-rewind/` worktrees from repositories to remove snapshot and worktree data.
