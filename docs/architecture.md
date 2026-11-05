# Architecture

Session Rewind has two halves:

- A Python plugin that records public hook events, owns a local SQLite store, snapshots git workspaces and serves a FastAPI router.
- A Desktop plugin that renders the timeline, inspector, fork dialog and comparison panel and orchestrates the native gateway RPCs.

## Components

```text
plugin/plugin.yaml
plugin/__init__.py
plugin/session_rewind/
  plugin.py                 registration and service lifecycle
  capture/hooks.py          one handler per public hook
  capture/queue.py          bounded queue, batching and single writer
  capture/normalize.py      redaction, truncation and JSON normalization
  capture/snapshots.py      snapshot request queue and worker
  store/db.py               SQLite connection and versioned migrations
  store/repositories.py     write and read repositories
  gitrepo/shadow.py         private-index snapshots and shadow refs
  gitrepo/worktree.py       detached worktree creation and cleanup
  gitrepo/diff.py           tree-to-tree diff summaries and patches
  fork/planner.py           fork point, context prompt and worktree
  fork/service.py           commit, verify, reconcile and cleanup
  fork/verify.py            no-shell verify runner
  sessiondb/transcript.py   read-only transcript prefix lookup
  dashboard/api.py          FastAPI router
  tools.py                  agent tools
  settings.py               typed settings and versioned config keys
plugin/dashboard/plugin_api.py   API mount adapter
plugin/dashboard/manifest.json   Dashboard API manifest
plugin/desktop/plugin.js    compiled Desktop bundle
ui/                         TypeScript Desktop source and esbuild config
```

## Capture

`plugin.py` starts two services:

1. `SnapshotService` owns a queue and a worker that snapshots the configured workspace.
2. `CaptureService` owns a bounded queue, a single writer thread and a batching store.

The hook handlers enqueue normalized capture items and never block. The writer thread redacts, truncates and serializes payloads, upserts session metadata and appends events in order. A full queue increments a drop counter; the next batch writes a `capture_dropped` event.

A batch that raises `sqlite3.Error` or `OSError` closes its store handle, returns the batch to the queue and reopens on the next pass. After `MAX_WRITE_FAILURES` consecutive failures the batch is counted as dropped instead of retried, so a permanently broken database cannot make the thread spin, and a single locked transaction cannot end recording for the rest of the gateway's life.

Captured event kinds:

- `session_start`
- `turn_end`
- `session_finalize`
- `user_turn`
- `assistant_response`
- `api_request`
- `llm_call`
- `tool_call`
- `tool_result`
- `compaction`
- `capture_dropped`

## Storage

SQLite lives under the Hermes profile:

```text
$HERMES_HOME/plugin-data/session-rewind/rewind.sqlite3
```

Tables: `sessions`, `events`, `events_fts`, `snapshots`, `branches`, `runs`, `bookmarks` and `schema_migrations`. Migrations are versioned SQL files. WAL, foreign keys, a busy timeout and a single writer are configured on the write connection. Read endpoints open read-only connections.

`events_fts` is an FTS5 index over the captured payload and tool name. The agent tools use it for search; the timeline uses the event table directly.

## Snapshots

A snapshot uses a private index:

```text
GIT_INDEX_FILE=<temp>/index
GIT_WORK_TREE=<repo>
git add -A
git write-tree
git commit-tree <tree> -m "session-rewind snapshot"
git update-ref refs/hermes-rewind/<session>/<sequence> <commit>
```

HEAD, the real index, the working tree and branches are never modified. The shadow ref prevents garbage collection. A file-count guard and a time limit degrade large repositories to context-only fork mode.

The snapshot worker is triggered by `user_turn` events. It throttles per session, skips unchanged trees and stores the snapshot with the triggering event id when available.

## Fork flow

The Desktop half runs:

```text
POST /forks/prepare
session.active_list
session.title {session_id} (read the stored key)
session.history {session_id} (resolve the stored row before the fork turn)
session.branch {session_id, through_message_id}
  or session.create {source, title, cwd}
session.cwd.set {session_id: child, cwd: worktree}
config.set {key: "model", value, session_id: child, confirm_expensive_model: false}
prompt.submit {session_id: child, text}
POST /forks/{id}/commit {child_session_id, child_stored_session_id, model, provider, prompt, verify_cmd}
host.openSession(child_stored_session_id, {intent: "tab"})
```

The live Desktop branch wrapper accepts a stored row id (`through_message_id`), not a row count. The Desktop half reads `session.history`, matches the selected user turn by timestamp, and branches through the previous display row. When the turn is the first user message there is no prefix to copy, so the child is created with `session.create` in the restored worktree. The planner's `SessionDB` reader computes the same prefix count for the dialog and for non-Desktop fallbacks; when it is unavailable, the branch starts with a context pack instead of a transcript prefix.

The prepared context prompt contains the original task, the last recorded assistant summary, the last recorded error, the files touched before the fork and the verify command. The user edits the prompt in the dialog.

## Verify and compare

`POST /forks/{id}/verify` runs the stored verify command in the isolated worktree through `VerifyRunner`, without a shell, with a timeout and capped output. The result is stored in `runs`. The command inherits the gateway environment, not an activated project virtualenv, so use an absolute interpreter path when the tool is not globally on `PATH`.

`GET /branches/{id}` computes tokens, tool errors, duration and outcome. A child branch is marked `done` or `failed` when its latest `turn_end` event arrives; the compare endpoint derives the child outcome from that event when the child session has no finalize row. `GET /compare?left=<parent>&right=<child>` returns both session metrics and a verdict.

## Desktop

The Desktop half registers:

- A route at `/rewind`.
- A sidebar navigation entry.
- A status bar chip.

It imports only `@hermes/plugin-sdk`, `react` and `react/jsx-runtime`. The compiled bundle is committed and contains no comments. The source lives in `ui/src` and is built with esbuild. The bundle is deterministic and CI fails when it drifts from the source.

## Failure handling

- Hook errors are logged and never reach the agent.
- The capture queue drops events instead of blocking a turn.
- Snapshot errors leave the timeline intact; fork preparation reports the error.
- A worktree failure aborts preparation before a branch row is created.
- The cwd and model RPCs are best-effort; a failure is shown in the dialog and the branch can still run in the original workspace.
- Cleanup is explicit and removes only the isolated worktree. It asks first when the workspace holds uncommitted edits, and also when git cannot read the workspace, because a failed probe is not evidence that nothing is at risk.
