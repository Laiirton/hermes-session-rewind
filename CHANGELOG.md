# Changelog

## Unreleased

- Style the fork dialog with the tokens the host actually declares. The dialog shipped its own scoped CSS and asked for six colour names that do not exist in the host stylesheet - `--ui-bg`, `--ui-text`, `--ui-border`, `--ui-panel-background`, `--ui-danger` and `--ui-warning` - so every one of them silently rendered its hardcoded fallback, and the light half was a 100-line fixed value set switched by `useTheme().resolvedMode`. That is why the page followed a theme change and the dialog did not. It now asks for what the host's own `[data-slot=dialog-content]` asks for: `--ui-bg-elevated` and `--ui-stroke-secondary` with `--shadow-md` for the panel, `--ui-bg-card` and `--ui-stroke-tertiary` for the card, separators and footer, `--ui-control-hover-background` for every hover, `--ui-stroke-primary` for focus, `--dt-primary` with `--dt-primary-foreground` for the primary button, and the host's mode-aware `--ui-green`, `--ui-yellow` and `--ui-red` for status. The theme branch is gone: the dialog follows palette and mode because the tokens resolve through `--theme-*`. Measured in the running app on three captures of the same dialog at the same size: switching Catppuccin dark to light moves the panel 665 units of summed absolute RGB (23,23,30 to 246,247,248), and switching Catppuccin light to Midnight moves the primary button 217 (189,160,226 to 101,93,164) while the surfaces move 13 to 48. The close button is now the host's pattern - borderless, absolute, top-right - and the scrim is the host's own `black/22` with its 2 px backdrop blur. The app was left on the user's Dark + Catppuccin, confirmed in `ui-preferences.json`.

- Put a confirmation in front of the only irreversible action. Cleanup ran `git worktree remove --force` on one click, and that command destroys edits the rerun never committed; the branch row's own guard only stopped it while the child session was still open. Cleanup now asks the backend what the workspace holds first: a workspace git reads as clean is deleted with no dialog, and anything else opens an inline confirmation naming the path and counting the files - "This workspace holds 3 uncommitted files. Deleting it removes them for good; the rerun conversation stays in the recording." A workspace git cannot read is reported as unreadable instead of silently treated as clean, because guessing clean on a failed probe is the one case where the friction was designed to appear. Escape closes the confirmation without closing the branch panel: the panel's own Escape handler now yields while focus is inside a confirmation, so the order the two listeners register in no longer decides the outcome, and focus returns to the button that opened it. Covered by three render tests - asked, not asked, unreadable - plus a git-level test that counts a real untracked file and one that points the probe at a directory that is not a worktree; the gate that decides whether to ask was confirmed to fail the render test when reverted.

- Let the user check a recording that is still open. A session row with no end says "recording", and the host keeps such a row open whether the session is working, idle for six hours or finished without reporting - measured against the host's own store, which has no field that tells them apart. The selected session now says when its last event arrived: "15.114 tokens · recording · last event 15:50". The claim is the same, but it can be checked.

- Ask the host for colours it actually defines. The dialog's panel and main text used `--ui-bg` and `--ui-text`, and neither name exists: the host ships 63 `--ui-*` tokens and those are not two of them, so the panel always fell through to its hardcoded fallback and the dialog looked palette-blind. It now asks for `--ui-panel-background` (then `--ui-bg-elevated`, then the hex) and `--ui-text-primary`, and switching to the Midnight palette in the running app turns the panel blue-violet instead of leaving it near-black. The limitation page had recorded the opposite conclusion - that the iframe does not expose host tokens - from an experiment that stopped half way: the panel did follow the chain, only the invented text token did not.

- Count the sessions the list is showing. The branch row had said how many branches it held since the strip began
  hiding them, and the session column - the one that is always on screen - only said "Sessions". It now shows the
  number, and `100+` when the page is full, because the query asks for a hundred and the store may hold more: a count
  that cannot tell a short list from a truncated one is the same silence the branch strip had.

- Add a reviewer quickstart. The README explained the settings and the flow but gave no short path from an installed
  plugin to a finished fork, so `Try it in two minutes` walks one turn from a session that already exists, with the
  timings this run measured, and says which part of it is verified and which is only the intended way to isolate a
  demo store.

- Prove the timeline at ten thousand events. The claim that a long session does not freeze had no test behind it: `test_ten_thousand_events_answer_fast_and_reach_every_turn` writes 10,002 events, checks the newest 50 turns come back in well under the bound and in descending order, and walks the cursor to the beginning to show all 3,334 turns are reachable rather than the first few hundred.

- Give the page a render test. Selecting a session, the empty-recording sentence, the event coalescing and the one-second paint target could only be checked by hand, because `ui/` had no component-rendering harness. jsdom, React and Testing Library are now development dependencies and the shipped bundle is byte-identical - react and `@hermes/plugin-sdk` stay external - with four tests, three of which were confirmed to fail when the fix they cover is reverted: the loading panel, the empty-recording sentence, and a burst of forty host events that costs four requests without coalescing and none with it. The documented check chain also gained `npm run lint`, `npm run format` and `npm test`, the three CI already ran and this repository did not list, which is why two pushes went out red.

- Put a frozen baseline's outcome in the past. The Original card of a comparison said `recording` for a session that ended hours ago, because the baseline froze while it was still open; that card describes 10:43:12 and not now, so it now says `open at freeze`. A side with no recording at all says `not recorded`, replacing a guess between `unknown` and `running`.

- Stop sending the user to Refresh for a recording that holds no user turns. The sentence was written while an empty result could still mean the request had not finished; now that the page says "Loading turns..." while it does, an empty result means exactly what it says, so it says it plainly: "The recording holds 77 events but no user turn." The helper moved to `format.ts`, where its three branches are tested.

- Say "loading" while turns are loading. Selecting a session kept the previous session's loaded flag, so the timeline answered with "The recording holds 170 events but no user turns came back. Choose Refresh." for as long as the request took, blaming the user for a request that had not finished. Choosing a session now clears turns, snapshots and branches along with the loaded flag, and the panel shows "Loading turns..." until they arrive.

- Record nested tool calls under the session that made them. A terminal call issued from inside the code tool reached `pre_tool_call` with a task id but no session id, and the recorder filed it under a session literally named `unknown`, which then appeared in the list as a card with no model, no tokens and 77 events belonging to no conversation. The writer now files such an event under the session its task id names, and drops with a warning only when no such session was ever recorded, so nothing is filed somewhere false and nothing the recording can place is thrown away.


- Name each rerun session after the branch that made it. Every fork of a turn was titled `↺ <session>`, and creating a session with a title that already exists returns the existing one, so rewinding the same turn twice was refused with "that session is already the rerun of another branch" and the branch stayed `prepared` with an unused workspace. The title now carries the branch id, and `local-e9` and `local-45` were each rewound a second time into genuinely new sessions.


- Reclaim abandoned workspaces from every session, not only the one being prepared. The sweep ran with the parent of the branch about to be created, so a branch left `prepared` by an abandoned dialog on another session kept its worktree until that exact session was prepared again; two of them survived eleven prepares. Plugin load now sweeps all abandoned prepared branches past the same fifteen-minute window, which left no `prepared` row and removed both worktrees.


- Let the timeline finish loading while something else is recording. Every captured host event re-ran the page's data effects, and each re-run cancelled the request that was in flight; with a rerun streaming events the selected session could sit on "no user turns came back" until Refresh was pressed. Host events are now coalesced into one refresh every 1.5 seconds.


- Stop showing a gateway internal as if it were a failure. Sessions the host reaped after their window went away read `ws_orphan_reap`, which looks like a crash; the installed agent defines those reasons as recoverable viewer closes, so the cards now say "ended with its window". Reasons the host has not documented are still shown exactly as written.


- Stop calling every empty prefix a first turn. A closed session has no transcript prefix whether the turn is the first or the seventh, and the dialog said "This is the first turn" for the second turn of `local-c5`. The sentence now appears only when the session is live, where the count actually means that.


- Say the same thing in the dialog as in the branch chips. The checkpoint card read "history rows 0", a count of a transcript prefix the user never asked about; it now reads "carries the context pack" or "carries 2 messages", matching the chips under the session header.


- Let Escape close the comparison panel. It had a Hide button and no keyboard equivalent, while the dialog above it already answered Escape.


- Correct the README where it had fallen behind the code. It still said that forking an ended session is refused, that the timeline loads the newest 500 events, and that verify never uses a shell, while the plugin had been doing the opposite of all three for days.


- Give the page a focus ring and a pointer cursor. Nothing in the page styled `:focus-visible`, and the same Tab that now draws an accent outline around the next session card had drawn nothing before it. Buttons that do nothing when disabled also stop inviting a click.


- Measure a turn to its own end. The turn window ran to the next user turn, so a session left open afterwards added its idle time to the last turn: "Diga apenas: pronto" reported 21602.8s, six hours, for a turn that took 2.8s. The timeline now uses the turn's `turn_end` when the recording has one and falls back to the old window when it does not.


- Count the branches next to the label. The strip is capped at three rows and scrolls, so a session with fifteen branches showed ten chips and gave no sign that five more existed.


- Say the verification result in words, and say the same thing twice. The branch header read "verify: 0" while the card beside it read "verify not run" for the same branch, because the two took their number from different records. Both now read "verify passed" or "verify failed (exit 127)", and the rerun card falls back to the branch's own run when the session aggregate has nothing.


- Say what a branch actually carried into the rerun. The chips read "0 rows" for every fork that started a new chat, which looked like a defect; they now read "context pack" there and "N messages" when the original transcript was branched. Verify and Cleanup now carry a reason for being disabled, and the shared-child note uses the primary text colour so it stays readable on a light background.


- Disclose a branch whose rerun session is claimed by more than one branch. Three branches recorded before the session-id fix share a single child, so the compare screen presented one child's numbers as three independent verdicts; the branch detail now carries a `shared_child` flag and the page says the figures may describe a different fork.


- Stop scoring a rerun against a baseline that recorded nothing. Forking the first turn freezes an original with no tokens, no tool calls and no errors, and the verdict still read "left has fewer tool errors", which made the rerun look worse than an attempt that never happened. It now says there is no baseline.


- Record the rerun's runtime session id in `child_session_id` and the host session key only in `child_stored_session_id`. The dialog sent the same key for both, so every branch of a session whose key was shared pointed at one child record — the collision the claim guard has been refusing since.


- Label the two event kinds the timeline had never learned: `turn_end` and `session_finalize` rendered as their raw uppercase names, long enough to run over the preview text in the column next to them. The kind column now truncates and carries the raw kind as its title, so a future kind cannot collide again.

- Move the branch list from the bottom of the session picker, behind every session card, into the session header where it belongs, as a wrapped chip strip with id, state and row count. A branch whose rerun never started now says so instead of waiting forever for a run that cannot come.

- The timeline shows what the user actually asked, even for a turn produced by an earlier rewind: the preview now unwraps the context pack instead of opening with "You are continuing a Hermes session from a rewound checkpoint." Old packs without the delimiters, including one nested twice, unwrap to the same sentence.

- The recording-failure and tool-rejection tests now prove what they claim: the sink counts the submissions it refused, and the tool errors are compared against their exact sentences instead of `"error" in result`.

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
