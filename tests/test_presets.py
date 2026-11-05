from __future__ import annotations

from pathlib import Path

from session_rewind.fork.presets import detect_verify_commands


def test_detects_a_python_project(tmp_path: Path) -> None:
    (tmp_path / "pyproject.toml").write_text("[tool.pytest.ini_options]\n", encoding="utf-8")
    (tmp_path / "tests").mkdir()

    assert detect_verify_commands(tmp_path) == ["python -m pytest -q"]


def test_detects_node_rust_go_and_make(tmp_path: Path) -> None:
    (tmp_path / "package.json").write_text('{"scripts": {"test": "jest"}}', encoding="utf-8")
    (tmp_path / "Cargo.toml").write_text("[package]\n", encoding="utf-8")
    (tmp_path / "go.mod").write_text("module x\n", encoding="utf-8")
    (tmp_path / "Makefile").write_text("test:\n\techo\n", encoding="utf-8")

    assert detect_verify_commands(tmp_path) == [
        "npm test",
        "cargo test",
        "go test ./...",
        "make test",
    ]


def test_skips_projects_without_a_test_entrypoint(tmp_path: Path) -> None:
    (tmp_path / "package.json").write_text('{"name": "lib"}', encoding="utf-8")
    (tmp_path / "pyproject.toml").write_text('[project]\nname = "x"\n', encoding="utf-8")

    assert detect_verify_commands(tmp_path) == []


def test_returns_nothing_for_a_missing_directory(tmp_path: Path) -> None:
    assert detect_verify_commands(tmp_path / "absent") == []
