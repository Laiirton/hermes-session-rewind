# Limitations

## The fork dialog does not follow the light theme

`plugin/desktop/plugin.js` ships the dialog with its own scoped CSS because the
plugin iframe does not inherit the host utility classes. Its colours come from
`var(--ui-*)` with dark fallbacks, and inside the iframe `--ui-bg` does not
resolve, so the panel keeps its dark surface when the app is in light mode and
secondary text loses contrast. `prefers-color-scheme` was tested in the running
app and does not change the iframe, so it is not a fix.

The rest of the page uses host tokens directly and adapts correctly to both
themes. A fix needs a theme signal from the SDK rather than a media query.

What was tried in the running app and reverted:

1. A `prefers-color-scheme: light` block around the dialog colours: no effect inside the iframe.
2. `background: var(--ui-surface, #15161a)`: the panel stayed dark, so that token is not defined there.
3. A chain of `--ui-surface`, `--ui-bg-elevated`, `--ui-panel-background` and `--ui-bg`: the panel did turn light, but `--ui-text` is also undefined, so the title, inputs and buttons kept their light-on-light fallback and became unreadable.
4. Making every dialog text colour `inherit`: the mirror image of the same problem, dark text on the still-dark panel.

Both halves have to switch together, which needs `useTheme().resolvedMode` rather than a token guess.
