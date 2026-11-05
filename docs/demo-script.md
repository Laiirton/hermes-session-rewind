# Demo script

Target: under 90 seconds, showing the plugin working, not a mock.

## Setup

- A small git repository with one failing test.
- `workspace_root` set to that repository.
- A Hermes profile with a fast model.
- The Rewind page open in Hermes Desktop.
- The verify command ready: `pytest -q`.

## Storyboard

| Time | Shot | Message |
| --- | --- | --- |
| 0-6s | The failing Hermes chat and the red test output | Hermes made a bad fix and stopped. Re-running from scratch wastes the whole run. |
| 6-14s | `Ctrl+Alt+R` opens Rewind from anywhere; the sidebar row and palette entry are visible for one beat | It is part of the app, not a page bolted on. |
| 14-26s | Timeline: turns as one row each with tool counts and errors in red; expand one turn; load earlier turns | Every turn was recorded, and a 100k-event session still opens instantly. |
| 26-38s | Rewind on the failing turn; Prepare; show `workspace ready`, the snapshot id, the worktree path and the resolved verify command | The branch restores the exact workspace, and you can see the command it will really run before it runs. |
| 38-46s | Pick a preset, switch the model, `Ctrl+Enter` | Same task, same world state, one variable changed. |
| 46-66s | Fork & run; the child session opens in its own tab; the agent fixes the test | The rerun happens in the isolated worktree, never in the original repository. |
| 66-80s | Comparison panel: "Original · frozen" timestamp, baseline tokens, rerun tokens, tool errors, verify exit, verdict | The baseline is frozen at the fork, so the comparison cannot drift while you keep working. |
| 80-90s | Cleanup; end card with `hermes plugins install session-rewind` | Session Rewind: rewind, rerun, compare. |

## Recording notes

- Record at 1080p or higher; crop to the Hermes Desktop window.
- Show the actual plugin UI and the actual child session; do not fake the RPC flow.
- Keep the terminal and Studio out of frame unless needed.
- Pre-record the failing run, then record the fork live to keep the demo under 90 seconds.
- Use captions; no dead air.
- End with the install command and the repository URL.

## Verified against the running app

- `Ctrl+Alt+R`, the sidebar row, the status-bar chip and the palette entry all open the page.
- A 73-event session renders as 2 turn rows; expanding one lists its events with errors in red.
- The comparison panel shows the frozen baseline (422.368 tokens) instead of the live session total (447.220).
- A prepared branch shows `workspace ready`, the snapshot id, the worktree path and the resolved interpreter.
- Prepared branches show a real worktree, and abandoned prepared branches are swept rather than left
  behind; four were reclaimed through the new path during this pass.
- Not yet measured: ten consecutive forks with duplicate-tab and orphan-worktree counts.

## Acceptance

- The viewer sees a recorded timeline.
- The viewer sees an isolated workspace restore.
- The viewer sees a rerun with a changed model or prompt.
- The viewer sees an objective verify result and a comparison.
- The video is under 90 seconds and tags the required account in the submission post.
