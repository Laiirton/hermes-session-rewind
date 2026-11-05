# Contributing

## Setup

```bash
python -m venv .venv
.venv/Scripts/python -m pip install "ruff>=0.6,<1" "mypy>=1.11,<2" "pytest>=8.2,<9" "pytest-cov>=5,<7" "fastapi>=0.110,<1" "httpx>=0.27,<1" "pydantic>=2,<3"
cd ui
npm ci
```

## Checks

```bash
.venv/Scripts/python -m ruff format --check .
.venv/Scripts/python -m ruff check .
.venv/Scripts/python -m mypy
.venv/Scripts/python -m pytest --cov=session_rewind --cov-report=term-missing
cd ui
npm run typecheck
npm run lint
npm run format
npm test
npm run build
hermes plugins validate plugin --install-deps
```

Run every line above before committing: CI executes all of them on Windows, Ubuntu and macOS, and a local chain that skips one of them is not evidence that the push is green.

The UI build must be committed. CI fails when `plugin/desktop/plugin.js` differs from a fresh build.

## Code rules

- No comments and no docstrings in source files, including Python, TypeScript, JavaScript, SQL and manifests.
- Documentation belongs in `README.md`, `docs/` or ADRs.
- Python uses type hints, Ruff formatting, mypy strict and pytest.
- The Desktop half uses strict TypeScript, the Hermes plugin SDK and React only.
- Keep modules small and responsibilities explicit. Avoid premature abstractions.
- Do not assert locale-rendered output in tests. A clock from `toLocaleTimeString` is `22:13` on one runner and `10:13 PM` on another, and a thousands separator is `.` or `,`; CI runs three locales. Assert the composition against the app's own formatter, or a shape every locale satisfies.

## Commits

Use conventional commits, keep changes focused and run the full check suite before opening a pull request.

## Security

Never commit credentials, transcripts or repository data. Follow [SECURITY.md](SECURITY.md).
