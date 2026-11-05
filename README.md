# Session Rewind

Record every Hermes turn. Fork a user turn into an isolated git worktree, rerun it with a different model or prompt, and compare the outcome with an objective verify command.

Session Rewind is a Hermes Agent plugin with a Python half (hooks, local event store, git snapshots, fork API) and a Desktop half (timeline, inspector, fork dialog, comparison panel). Everything stays on the machine.

## What it does

- Records prompts, responses, tool calls, tool results, token usage, compactions and session lifecycle events.
- Shows a turn-grouped timeline that pages by cursor from the newest turn, expands a turn on demand and highlights tool errors.
- Snapshots git workspaces with a private index and shadow refs without touching HEAD, the real index or the working tree.
- Forks a user turn through the public `session.branch` gateway method with the exact history prefix when the session is live. When it is not, the rerun starts a new chat carrying a context pack built from the recorded turns, the files the turn touched and the verify command.
- Restores the workspace snapshot into an isolated git worktree and starts the rerun there.
- Lets you change the model, the prompt or both before the rerun.
- Freezes the original at the fork point, so the baseline never absorbs work done after the rewind, and lets the verify exit code decide the verdict and the branch state.
- Resolves the verify command the way the gateway runs it: per-platform splitting, PATH or worktree-relative lookup, batch shims through the shell, and the project's own virtualenv when the restored worktree has none.
- Runs the user-provided verify command and compares outcome, tokens, tool errors and duration.
- Completes the branch lifecycle: prepared, running, done, failed, cleaned and discarded, with abandoned prepared branches swept and their worktrees removed.
- Opens from the sidebar, the status bar, the command palette or `Ctrl+Alt+R`, and behaves like a host surface: scoped timers, event-driven refresh and a focus-trapped dialog.
- Applies `retention_days` on load: finished recordings older than the window, and the shadow refs that pinned them, are removed. Live sessions and sessions with a branch still running are never touched.
- Keeps everything local: no network calls, no telemetry, no credential reads and no self-updater.

## Known limitations

See [docs/limitations.md](docs/limitations.md). The headline one: the fork dialog carries its own light and dark value sets, because the plugin iframe does not inherit the host utility classes. Its surface and text follow the active palette through host tokens; its status badges keep fixed hues, because each is paired with a tint of the same hue.

## Requirements

- Hermes Agent `>= 0.22.7`.
- Git available on `PATH`.
- A git repository to snapshot, set as `workspace_root` or reachable from the session working directory.
- Windows, macOS or Linux. Windows is the primary tested platform.

## Install

From the catalog, once listed:

```bash
hermes plugins install session-rewind
hermes plugins enable session-rewind
```

From a checkout:

```bash
mkdir -p ~/.hermes/plugins/session-rewind
cp -r plugin/* ~/.hermes/plugins/session-rewind/
hermes plugins enable session-rewind
```

On Windows the profile directory is `%LOCALAPPDATA%\hermes\plugins\session-rewind`. Restart Hermes Desktop after enabling.

## Setup

Open Settings -> Plugins -> Session Rewind and configure:

- `workspace_root`: the git repository to snapshot. When empty, the plugin uses the session working directory when it is known. Point it at the repository you want to rewind.
- `snapshot_enabled`: turn workspace snapshots on or off. On by default.
- `verify_timeout_seconds`: maximum runtime for a verify command. Defaults to 120 seconds.
- `retention_days`: delete recorded events and snapshots older than this. Defaults to 30 days.
- `capture_results`: store tool result previews. On by default.
- `redact_secrets`: replace detected credentials before storage. On by default.
- `max_payload_kb`: cap each captured payload. Defaults to 50 KB.
- `record_paused`: keep the plugin loaded without recording new events.

The verify command is entered per fork, for example:

```text
pytest -q
npm test
cargo test
```

The command runs without a shell, except a Windows `.cmd` or `.bat` shim, which the plugin starts through `cmd.exe`. Use a script if you need pipes or redirection.

## Use

1. Open the Rewind page from the sidebar or the status bar chip.
2. Select a recorded session and a user turn in the timeline.
3. Choose Rewind and prepare the branch. Review the restored workspace, what the rerun carries (the transcript prefix or the context pack) and the prompt.
4. Adjust the model or prompt, enter the verify command and choose Fork & run. The verify command runs in the gateway environment; use an absolute interpreter path when the tool is not globally on `PATH`.
5. The child session opens in a new tab. The comparison panel follows the branch.
6. Run Verify in the isolated worktree, inspect the output and compare both runs.
7. Cleanup removes the isolated worktree when you are done, and asks first when that workspace still holds files the rerun never committed.

A session that is not open in the app cannot be branched from its transcript, so the fork falls back to a new chat carrying the context pack. The dialog says which of the two it is about to do before the rerun starts.

## Try it in two minutes

You do not need a prepared repository: any session the plugin has already recorded works.

1. Open the Rewind page and pick a session with at least one user turn in the timeline.
2. Choose Rewind on a turn and Prepare branch. The checkpoint card shows the snapshot, the verify timeout and what the rerun carries; preparing measured about 0.6 s end to end on a live gateway.
3. Choose Fork & run, or press Ctrl+Enter. A new tab opens for the rerun session, named after the branch, in the restored workspace.
4. Open the branch chip to compare the frozen original with the rerun, and run Verify in the isolated worktree when you want the command re-checked.

Nothing outside the branch changes: the original session, its tab and your working directory are untouched, and Cleanup removes only the workspace the fork created.

For a recording or a screenshot session, an empty store is cleaner than your own: the plugin keeps its data under `<hermes home>/plugin-data/session-rewind/`, and the host's own `plugin_data_dir` says it "resolves `get_hermes_home()` on every call so it follows the active profile", so a separate profile gets a separate store. This path has not been exercised end to end, so treat it as the intended way to isolate a demo rather than a verified one.

## How it works

```text
Hermes hooks
    -> capture queue -> local SQLite event store
                     -> snapshot worker -> git private index -> shadow refs
                                                        -> worktree on fork

Desktop timeline -> FastAPI plugin API (/api/plugins/session-rewind)
                 -> gateway JSON-RPC: session.branch -> session.cwd.set
                                      -> config.set -> prompt.submit
```

- The Python half registers ten public hooks: `on_session_start`, `on_session_end`, `on_session_finalize`, `pre_llm_call`, `post_llm_call`, `pre_api_request`, `post_api_request`, `pre_tool_call`, `post_tool_call` and `post_compaction`. `on_session_end` closes a turn; `on_session_finalize` closes the session.
- The capture service batches events through a bounded queue and a single writer thread. Hooks never block the agent.
- Payloads are redacted and truncated before they are written.
- Snapshots use a private `GIT_INDEX_FILE`, `git add -A`, `write-tree` and `commit-tree`, and are pinned with `refs/hermes-rewind/<session>/<sequence>`. HEAD, the real index and the working tree are never modified.
- A fork resolves the transcript prefix through the documented `SessionDB(read_only=True)` facade, creates a detached worktree from the snapshot and calls the public gateway RPCs to branch through the last stored row, set the working directory, switch the model and submit the prompt. A first-turn fork starts a fresh session in the same worktree instead of branching an empty prefix.
- The Desktop half uses only the Hermes plugin SDK and React. The compiled `plugin/desktop/plugin.js` is committed so no build runs at install time.

## Data and privacy

Session Rewind stores data locally under the Hermes profile:

```text
$HERMES_HOME/plugin-data/session-rewind/rewind.sqlite3
```

The database contains session metadata, captured payloads, snapshots, branches, runs and bookmarks. Captured payloads are redacted and truncated. Git snapshots create objects and refs inside the target repository; forks create worktrees next to it under `.hermes-rewind/`. Nothing leaves the machine. The plugin does not read `.env`, `auth.json`, browser profiles or credential stores, and it never refreshes or writes OAuth tokens.

To remove recorded data, delete the plugin data directory and the `refs/hermes-rewind` refs in the repository. Worktrees are removed from the comparison panel or with `git worktree remove`.

## Disclosures

- Runs local git subprocesses for snapshots, worktrees, diffs and cleanup.
- Writes private index files to a temporary directory, shadow refs and git objects to the target repository, and worktrees under `.hermes-rewind/`.
- Reads `state.db` read-only through `SessionDB` to resolve transcript prefixes.
- Runs the user-provided verify command in the isolated worktree, without a shell.
- Sends nothing over the network and includes no telemetry.
- Never auto-approves, never bypasses Hermes approvals and never writes to the user's branches or remote.
- Model and prompt reruns use the user's Hermes route and credentials; the plugin never reads keys.

## Limitations

- Branching a transcript needs the session open in the app; otherwise the rerun runs in a new chat carrying the context pack.
- Snapshots cover git-tracked files. Ignored files such as `.env`, `node_modules` and build output are not restored.
- The workspace must be a git repository.
- Verify commands run without a shell, except Windows batch shims, which go through `cmd.exe`.
- The timeline pages by turn, 40 turns at a time from the newest, and expands one turn's events on demand.
- Model switches can return a confirmation requirement from Hermes; the branch continues with the current model when confirmation is required.
- Very large repositories can exceed the snapshot time and file-count guard; the fork then falls back to a context-only branch.

## Development

```bash
python -m venv .venv
.venv/Scripts/python -m pip install "ruff>=0.6,<1" "mypy>=1.11,<2" "pytest>=8.2,<9" "pytest-cov>=5,<7" "fastapi>=0.110,<1" "httpx>=0.27,<1" "pydantic>=2,<3"
.venv/Scripts/python -m ruff format --check .
.venv/Scripts/python -m ruff check .
.venv/Scripts/python -m mypy
.venv/Scripts/python -m pytest --cov=session_rewind --cov-report=term-missing
cd ui
npm ci
npm run typecheck
npm run build
```

Validate the plugin bundle with the official checker:

```bash
hermes plugins validate plugin --install-deps
hermes plugins doctor plugin --ci
```

The code follows a strict no-comments and no-docstrings rule. Decisions live in `docs/adr/` and `docs/architecture.md`.

## Security

See [SECURITY.md](SECURITY.md) and [docs/security.md](docs/security.md).

## License

MIT
