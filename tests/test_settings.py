from __future__ import annotations

from typing import Any

from session_rewind.settings import Settings


class FakeContext:
    def __init__(self, values: dict[str, Any]) -> None:
        self._values = values

    def get_config(self, key: str, default: Any = None) -> Any:
        return self._values.get(key, default)


def test_defaults() -> None:
    settings = Settings.from_context(FakeContext({}))
    assert settings.retention_days == 30
    assert settings.capture_results is True
    assert settings.redact_secrets is True
    assert settings.max_payload_kb == 50
    assert settings.snapshot_enabled is True
    assert settings.verify_timeout_seconds == 120
    assert settings.record_paused is False
    assert settings.workspace_root == ""
    assert settings.max_payload_bytes == 50 * 1024


def test_clamps_and_type_checks() -> None:
    settings = Settings.from_context(
        FakeContext(
            {
                "retention_days": 0,
                "capture_results": "yes",
                "max_payload_kb": 5000,
                "verify_timeout_seconds": True,
                "record_paused": True,
                "workspace_root": "  C:/repo  ",
            }
        )
    )
    assert settings.retention_days == 1
    assert settings.capture_results is True
    assert settings.max_payload_kb == 1024
    assert settings.verify_timeout_seconds == 120
    assert settings.record_paused is True
    assert settings.workspace_root == "C:/repo"
