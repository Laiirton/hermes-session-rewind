from __future__ import annotations

from pathlib import Path

MAX_PRESETS = 4


def detect_verify_commands(root: Path) -> list[str]:
    if not root.is_dir():
        return []
    presets: list[str] = []
    if _has_pytest(root):
        _add(presets, "python -m pytest -q")
    if (root / "package.json").is_file() and _contains(root / "package.json", '"test"'):
        _add(presets, "npm test")
    if (root / "Cargo.toml").is_file():
        _add(presets, "cargo test")
    if (root / "go.mod").is_file():
        _add(presets, "go test ./...")
    if (root / "Makefile").is_file() and _contains(root / "Makefile", "test:"):
        _add(presets, "make test")
    return presets[:MAX_PRESETS]


def _has_pytest(root: Path) -> bool:
    project = (root / "pyproject.toml").is_file() or (root / "setup.py").is_file()
    if not project:
        return False
    return (
        (root / "tests").is_dir()
        or (root / "conftest.py").is_file()
        or _contains(root / "pyproject.toml", "[tool.pytest")
    )


def _add(items: list[str], candidate: str) -> None:
    if candidate not in items:
        items.append(candidate)


def _contains(path: Path, needle: str) -> bool:
    try:
        return needle in path.read_text(encoding="utf-8", errors="ignore")
    except OSError:
        return False
