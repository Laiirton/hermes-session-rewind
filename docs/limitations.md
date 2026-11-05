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
