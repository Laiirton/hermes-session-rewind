from __future__ import annotations

import sys
from pathlib import Path
import types
from typing import Any

import pytest
from session_rewind.settings import Settings, load_settings


def _manifest() -> str:
    return (Path(__file__).resolve().parents[1] / "plugin" / "plugin.yaml").read_text(
        encoding="utf-8"
    )


def _schema_block(manifest: str) -> dict[str, dict[str, int]]:
    fields: dict[str, dict[str, int]] = {}
    inside = False
    current: str | None = None
    for line in manifest.splitlines():
        if line.startswith("config_schema:"):
            inside = True
            continue
        if not inside:
            continue
        if line and not line.startswith("  "):
            break
        key, _, value = line.strip().partition(":")
        if not line.startswith("    "):
            current = key
            fields[key] = {}
            continue
        if current is not None and value.strip().isdigit():
            fields[current][key] = int(value)
    return fields


def _stub_config(monkeypatch: pytest.MonkeyPatch, config: object) -> None:
    package: Any = types.ModuleType("hermes_cli")
    module: Any = types.ModuleType("hermes_cli.config")

    def load_config_readonly() -> object:
        if isinstance(config, Exception):
            raise config
        return config

    module.load_config_readonly = load_config_readonly
    package.config = module
    monkeypatch.setitem(sys.modules, "hermes_cli", package)
    monkeypatch.setitem(sys.modules, "hermes_cli.config", module)


def test_load_settings_reads_the_plugin_section(monkeypatch: pytest.MonkeyPatch) -> None:
    _stub_config(
        monkeypatch,
        {
            "plugins": {
                "entries": {
                    "session-rewind": {
                        "settings": {
                            "retention_days": 7,
                            "redact_secrets": False,
                            "max_payload_kb": 256,
                            "workspace_root": " E:/git/demo ",
                        }
                    }
                }
            }
        },
    )

    settings = load_settings()

    assert settings.retention_days == 7
    assert settings.redact_secrets is False
    assert settings.max_payload_bytes == 256 * 1024
    assert settings.workspace_root == "E:/git/demo"


def test_declared_schema_bounds_match_the_loader_clamps() -> None:
    schema = _schema_block(_manifest())
    defaults = Settings()
    for name, bound in {
        "retention_days": (1, 3650),
        "max_payload_kb": (1, 1024),
        "verify_timeout_seconds": (5, 1800),
    }.items():
        field = schema[name]
        assert field["minimum"] == bound[0], name
        assert field["maximum"] == bound[1], name
        assert field["default"] == getattr(defaults, name), name


def test_load_settings_clamps_out_of_range_values(monkeypatch: pytest.MonkeyPatch) -> None:
    _stub_config(
        monkeypatch,
        {"plugins": {"entries": {"session-rewind": {"settings": {"retention_days": 99999}}}}},
    )

    assert load_settings().retention_days == 3650


def test_load_settings_falls_back_when_config_is_unreadable(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    _stub_config(monkeypatch, RuntimeError("config service is down"))

    assert load_settings() == Settings()


def test_load_settings_falls_back_when_the_key_path_is_wrong(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    _stub_config(monkeypatch, {"plugins": {"entries": {"other-plugin": {"settings": {}}}}})

    assert load_settings() == Settings()
