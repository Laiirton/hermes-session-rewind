# Limitations

## The fork dialog is styled with host tokens, and the names that were invented

`plugin/desktop/plugin.js` ships the fork dialog with its own scoped CSS. Two
explanations for that have been written on this page and both were wrong, so the
current one carries the measurements behind it.

The first said the plugin runs in an iframe that does not inherit the host utility
classes. The installed stylesheet
(`app/resources/app.asar.unpacked/dist/assets/main-Dr3mZqrt.css`) says otherwise: the
exact escaped selectors the page uses are in it - `.border-\(--ui-border\)`,
`.text-\(--ui-text-tertiary\)`, `.bg-\(--ui-panel-background\)`, `.disabled\:opacity-50` -
alongside the ordinary utilities. The plugin's React tree is mounted in the host
document, so host classes apply to it.

The second said the dialog cannot follow a custom palette. The real defect was
invented token names. The host's `:root` declares 55 `--ui-*` tokens, and five names
the dialog asked for are not among them: `--ui-bg`, `--ui-text`, `--ui-border`,
`--ui-panel-background`, `--ui-danger` and `--ui-warning`. Four of those are never set
at runtime either - only `--ui-success` is, by the theme engine - so every
`var(--ui-border, rgba(255,255,255,.14))` silently rendered its fallback. A fallback
that always wins is what looked like a palette-blind iframe.

The dialog now asks for names the host declares, and for the same ones the host's own
dialog uses: `--ui-bg-elevated` and `--ui-stroke-secondary` are exactly what
`[data-slot=dialog-content]` sets, `--shadow-md` is its shadow, `--ui-bg-card` and
`--ui-stroke-tertiary` are the card and separator, `--ui-control-hover-background` is
every hover, `--ui-stroke-primary` is the focus ring, `--dt-primary` with
`--dt-primary-foreground` is the primary button, and the status hues are the host's own
`--ui-green`, `--ui-yellow` and `--ui-red`, which the host redeclares under `:root.dark`.
Because all of them resolve through `--theme-*`, which the theme engine writes onto the
document element, the dialog follows palette and mode with no JavaScript: the
`useTheme().resolvedMode` branch and the 100-line fixed light value set are gone.

Measured in the running app at 17:11-17:14, three captures of the same dialog at the
same window size, sampling the median pixel of each surface:

| Switch | Panel | Input | Footer | Primary button |
| --- | --- | --- | --- | --- |
| Catppuccin dark to Catppuccin light | 23,23,30 to 246,247,248 | 37,36,47 to 234,233,241 | 80,82,97 to 213,213,223 | 231,214,251 to 189,160,226 |
| Catppuccin light to Midnight light | 246,247,248 to 253,253,253 | 234,233,241 to 239,239,243 | 213,213,223 to 211,211,214 | 189,160,226 to 101,93,164 |

The first row is the mode following; the second is the palette following, where the
button moves 217 units of summed absolute RGB while the surfaces move 13 to 48. The
app was left on the user's own Dark + Catppuccin, confirmed in `ui-preferences.json`.

Two colours are still written out, both because the host writes them out the same way:
the scrim is `rgba(0, 0, 0, 0.22)`, the value of the host's own `bg-black/22` modal
backdrop, and `--dt-primary-foreground` keeps `#fcfcfc` as its fallback, which is what
the host declares for it.

## Session outcome codes

The session cards and the comparison panel used to print the `outcome` string
exactly as the gateway wrote it, so a session read `ws_orphan_reap` — which looks
like a crash and is not one.

The installed agent says what these mean: `gateway/session_viewer_close.py`
defines `ORPHAN_REASONS = frozenset({'ws_orphan_reap', 'startup_orphan_reap'})`,
and `gateway/session_route_recovery.py` calls `agent_close` and `ws_orphan_reap`
recoverable end reasons whose rows can be reopened. They are recorded when the
viewer that owned the session went away, not when the work failed.

So the page spells the three reasons it can prove and passes anything else
through unchanged: `completed`, `closed with the app`, `ended with its window`.
The wording is deliberately short: the session cards are 256 px wide and a
longer sentence wrapped them onto a second line. An unrecognised code is still
shown raw, because inventing wording for a reason the host has not documented
would put words in the gateway's mouth.

## A rewound session cannot always be traced back to its tab

To branch a live session the dialog has to find it among the sessions the app
reports as active. It matches on `session_key`, and a branched agent shares its
parent's key: the host says so in its own words, in `agent/conversation_loop.py`
before the `on_session_start` dispatch — "Persistence-disabled forks share their
session ID and are not real sessions." Two open tabs can therefore answer to the
same key, and nothing in the answer distinguishes them.

The store cannot close the gap either. `on_session_start` is invoked with
`session_id`, `model` and `platform` and nothing else, and `on_session_end` adds
`task_id`, `turn_id`, `completed` and `failed`; no hook ever receives the host's
stored row id, which is why `sessions.stored_session_id` is empty for every
recorded session.

What the plugin does instead: `POST /forks/{id}/commit` refuses a child that is
the parent or already claimed by another branch, and it runs before the prompt is
submitted, so a mis-matched fork cannot start a rerun it would not be able to
track. Branches recorded before that guard are marked in the comparison panel.
Choosing the right tab when two share a key is not solvable from the plugin side.

## A tool call can arrive without a session id

A terminal call made from inside the code tool reaches `pre_tool_call` through a
path that does not carry the agent object. The installed agent builds those
kwargs in `agent/inline_tool_executors.py`, where `session_id` is read as
`getattr(agent, "session_id", "")`: with no agent to read, the field arrives
empty while `task_id` still names the session that made the call.

The writer therefore files such an event under the session its task id names,
after checking that the store already has that session, and drops the event with
a warning when it does not. The check matters because `task_id` is not always a
session id: `agent/turn_context.py` falls back to `effective_task_id = task_id or
str(uuid.uuid4())`, so a background run has a task id that belongs to no session,
and trusting it would put real work under a card the user never opened.

What is lost is the tool result. The host fires `pre_tool_call` for these nested
calls but the matching `post_tool_call` never reaches the plugin either, so a
recovered call stays `pending`. The count of tools a session used is right; the
outcome of each nested call is not knowable from the hooks.

## A session that never reported its end keeps reading "recording"

The session card and the header badge are both driven by `sessions.ended_at`, which only the
`on_session_finalize` hook writes. When the gateway is drained with an agent still running, that
hook does not arrive: `errors.log` shows `Gateway drain timed out after 0.0s with 1 active agent(s)`
followed by `Session local-… paused: runtime_draining`, and the row is left open forever. The card
then says "recording" for a session whose last event is hours old.

The plugin does not close the row itself, because it has no signal that means "this agent is
finished". `session.active_list` answers which sessions have a tab, not which have a running agent;
the Python side cannot call desktop RPCs at all; and a timeout would be a guess about someone
else's session, which is exactly the kind of invented semantic this plugin has been removing
elsewhere. A threshold that is too short would also mislabel a long-running turn as ended.

What is honest here is the wording, and the wording was not enough until now. The
selected session states when its last event arrived - "recording · last event 15:50" -
so a row that has been open for six hours says so next to the claim, and the user can
check it instead of taking the plugin's word for it.

The three signals that were looked for, in the host's own store, and measured:

1. `session_turn_leases`: polled for 25 seconds across a complete turn that a new session
   had just run. Zero rows the whole time, so it arbitrates turn ownership between
   processes rather than saying whether anything is working.
2. `session_admissions`: reports `queue / terminal / completed` for the session created two
   seconds before the poll, so "terminal" marks the admission being dispatched, not the
   session finishing.
3. `sessions.ended_at`, the host's own end field: NULL for the same three sessions the
   plugin leaves open, with `archived = 0` and `hidden = 0`. The host does not know either.

So the distinction the plugin cannot make is not a missing lookup; the host does not
record it. A timeout would be a guess about someone else's session.

## Cleanup asks about uncommitted files, not about commits

Cleanup asks what the workspace holds before deleting it, and the number it quotes comes
from `git status --porcelain --untracked-files=all`. That command answers "what is not in
any commit", which is not the same question as "what would be lost".

Measured in a scratch repository: a worktree added with `--detach`, one commit made inside
it, then `git worktree remove --force` and `git worktree prune`.

- `git cat-file -t <commit>` still returns `commit`: the object is there.
- `git log --oneline --all` does not list it, and `git fsck --unreachable` reports it as an
  unreachable commit, along with its tree and blob.

So the commit survives until the repository's own garbage collection prunes unreachable
objects, and nothing in the app points at it meanwhile. A rerun that committed its result
leaves `git status` clean, and the confirmation then does not open - the case the dialog is
meant to catch is the one the probe cannot see.

What the dialog does guarantee: it never reports a workspace as clean on a failed probe. A
workspace `git status` cannot read comes back as unreadable and still asks, because treating
a failed check as evidence of safety would be the exact mistake the confirmation exists to
avoid. Detecting commits that no branch or ref points at is recorded as a next improvement,
not as something this does.
