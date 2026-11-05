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
| 0-8s | The failing Hermes chat and the red test output | Hermes made a bad fix and stopped. Re-running from scratch wastes the whole run. |
| 8-20s | Rewind timeline with the session selected; scrub to the last user turn; inspector shows the bad patch and the failing test | Every turn, tool call and result was recorded locally. |
| 20-32s | Choose Rewind; prepare the branch; show the restored worktree, context rows and prompt | The plugin forks the session at that turn and restores the exact workspace snapshot in an isolated worktree. |
| 32-42s | Change the model or edit the prompt; set `pytest -q` | Same task, same world state, one variable changed. |
| 42-62s | Fork & run; the child session opens; the agent fixes the test | The rerun happens in the isolated worktree, not in the original repository. |
| 62-78s | Comparison panel: original versus rerun; tokens, errors, outcome; Verify returns exit 0 | The verify command is the objective verdict. |
| 78-90s | Cleanup; end card with `hermes plugins install session-rewind` | Session Rewind: rewind, rerun, compare. |

## Recording notes

- Record at 1080p or higher; crop to the Hermes Desktop window.
- Show the actual plugin UI and the actual child session; do not fake the RPC flow.
- Keep the terminal and Studio out of frame unless needed.
- Pre-record the failing run, then record the fork live to keep the demo under 90 seconds.
- Use captions; no dead air.
- End with the install command and the repository URL.

## Acceptance

- The viewer sees a recorded timeline.
- The viewer sees an isolated workspace restore.
- The viewer sees a rerun with a changed model or prompt.
- The viewer sees an objective verify result and a comparison.
- The video is under 90 seconds and tags the required account in the submission post.
