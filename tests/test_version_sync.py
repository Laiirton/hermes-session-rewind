from __future__ import annotations

import json
import re
import tomllib
from pathlib import Path

from session_rewind.version import VERSION

ROOT = Path(__file__).resolve().parents[1]


def _yaml_version() -> str:
    text = (ROOT / "plugin" / "plugin.yaml").read_text(encoding="utf-8")
    match = re.search(r"^version:\s*(\S+)\s*$", text, re.MULTILINE)
    assert match is not None
    return match.group(1)


def test_versions_match() -> None:
    pyproject = tomllib.loads((ROOT / "pyproject.toml").read_text(encoding="utf-8"))
    package = json.loads((ROOT / "ui" / "package.json").read_text(encoding="utf-8"))
    assert _yaml_version() == VERSION
    assert pyproject["project"]["version"] == VERSION
    assert package["version"] == VERSION
