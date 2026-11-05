from __future__ import annotations

import sys
import types
from typing import Any

import pytest
from session_rewind.settings import Settings, load_settings


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
