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

## Session outcome codes are shown as the gateway writes them

The session cards and the comparison panel print the `outcome` string the hook
received, so a session that the gateway closed under an unusual reason reads
`ws_orphan_reap` or `startup_orphan_reap` rather than a sentence.

These codes are not documented in the Hermes 0.22.7 material and a search for
them returns nothing, so there is no authoritative wording to map them to. The
alternative was to invent one, which would put words in the gateway's mouth
about why the user's session ended. `completed` reads fine as it is.
