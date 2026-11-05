# Limitations

## The fork dialog follows the mode, not the palette

`plugin/desktop/plugin.js` ships the dialog with its own scoped CSS because the
plugin iframe does not inherit the host utility classes. Its colours come from
`var(--ui-*)` with dark fallbacks, and inside the iframe `--ui-bg` does not
resolve, so a token chain can lighten the panel while the text keeps its
light-on-dark fallback, or the other way round. `prefers-color-scheme` was tested in the running
app and does not change the iframe, so it is not a fix.

The dialog reads the mode from the SDK (`useTheme().resolvedMode`) and switches
both halves together, so it is readable in light and dark. It cannot follow a
custom palette: Hermes offers several (Nous, GitHub, Catppuccin, Everforest,
Solarized, Nous Alt, Classic Hermes, Midnight, Ember) and the dialog uses one
fixed light and one fixed dark value set instead of the active palette's colours.
The rest of the page keeps using host tokens directly, so a strongly tinted
palette reads slightly differently in the dialog than in the page.

What was tried in the running app and reverted:

1. A `prefers-color-scheme: light` block around the dialog colours: no effect inside the iframe.
2. `background: var(--ui-surface, #15161a)`: the panel stayed dark, so that token is not defined there.
3. A chain of `--ui-surface`, `--ui-bg-elevated`, `--ui-panel-background` and `--ui-bg`: the panel did turn light, but `--ui-text` is also undefined, so the title, inputs and buttons kept their light-on-light fallback and became unreadable.
4. Making every dialog text colour `inherit`: the mirror image of the same problem, dark text on the still-dark panel.

Both halves have to switch together, which is why the dialog carries an explicit
light value set instead of a token chain, and why the mode comes from the SDK.

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
