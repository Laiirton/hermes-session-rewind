# Security model

## Assets

- Captured prompts, responses, tool arguments and tool results.
- Repository snapshots and worktrees.
- Fork prompts, verify commands and verify output.
- The Hermes profile and its session database.

## Trust boundaries

Session Rewind runs inside the Hermes Python process and inside the Hermes Desktop renderer. The Desktop half has the SDK surface only. The Python half uses public hooks, the documented `SessionDB` read-only facade, `plugin_data_dir` and public git subprocesses.

The plugin does not run as a separate privileged service and does not expose a network listener beyond the Hermes plugin API mount.

## Data flow

```text
agent -> hooks -> bounded queue -> writer -> redaction/truncation -> SQLite
                                                 |
user fork -> session.branch -> isolated worktree -> verify -> runs
```

No flow leaves the machine.

## Redaction

The normalizer replaces common credential shapes before storage and redacts values under sensitive dictionary keys such as `api_key`, `token`, `password` and `authorization`. Redaction can be disabled in settings. Payloads are also truncated by string, item and total-size limits.

Redaction is best-effort. Do not record secrets deliberately.

## Git risks

- Snapshots run local git commands in the configured repository.
- Shadow refs and git objects are written into the repository.
- Worktrees are created under `.hermes-rewind/` next to the repository.
- A repository can define clean filters or diff drivers that execute programs during git operations. Only use repositories you trust.
- The plugin never pushes, never commits to the user's branches and never changes HEAD, the real index or the working tree.

## Verify risks

Verify commands are user-supplied and run without a shell in the isolated worktree. They can modify that worktree. They are never run automatically. Treat the command as code you chose to execute.

## Credentials

The plugin never reads `.env`, `auth.json`, CLI token files, browser profiles, keychains or other credential stores. It never refreshes, writes or rotates OAuth tokens. Reruns use the Hermes model route and credentials; the plugin does not see them.

## Approvals

The plugin never approves tool calls, never disables guards and never creates unattended children that inherit a permissive mode. Model switches that require confirmation are shown to the user.

## Retention and deletion

Delete `$HERMES_HOME/plugin-data/session-rewind/` to remove the plugin database. Remove `refs/hermes-rewind/*` and `.hermes-rewind/` worktrees from repositories to remove snapshot and worktree data. Use the comparison panel's Cleanup action to remove a worktree.
