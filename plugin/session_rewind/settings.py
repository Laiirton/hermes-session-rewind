from __future__ import annotations

from collections.abc import Callable, Mapping
from dataclasses import dataclass
from typing import Any, Protocol

SettingsProvider = Callable[[], "Settings"]


class SettingsSource(Protocol):
    def get_config(self, key: str, default: Any = None) -> Any: ...


@dataclass(frozen=True, slots=True)
class Settings:
    retention_days: int = 30
    capture_results: bool = True
    redact_secrets: bool = True
    max_payload_kb: int = 50
    snapshot_enabled: bool = True
    verify_timeout_seconds: int = 120
    record_paused: bool = False
    workspace_root: str = ""

    @classmethod
    def from_context(cls, ctx: SettingsSource) -> Settings:
        return cls.from_mapping(
            {
                "retention_days": ctx.get_config("retention_days", 30),
                "capture_results": ctx.get_config("capture_results", True),
                "redact_secrets": ctx.get_config("redact_secrets", True),
                "max_payload_kb": ctx.get_config("max_payload_kb", 50),
                "snapshot_enabled": ctx.get_config("snapshot_enabled", True),
                "verify_timeout_seconds": ctx.get_config("verify_timeout_seconds", 120),
                "record_paused": ctx.get_config("record_paused", False),
                "workspace_root": ctx.get_config("workspace_root", ""),
            }
        )

    @classmethod
    def from_mapping(cls, values: Mapping[str, Any]) -> Settings:
        return cls(
            retention_days=_as_int(values.get("retention_days"), 30, 1, 3650),
            capture_results=_as_bool(values.get("capture_results"), True),
            redact_secrets=_as_bool(values.get("redact_secrets"), True),
            max_payload_kb=_as_int(values.get("max_payload_kb"), 50, 1, 1024),
            snapshot_enabled=_as_bool(values.get("snapshot_enabled"), True),
            verify_timeout_seconds=_as_int(values.get("verify_timeout_seconds"), 120, 5, 1800),
            record_paused=_as_bool(values.get("record_paused"), False),
            workspace_root=_as_text(values.get("workspace_root"), ""),
        )

    @property
    def max_payload_bytes(self) -> int:
        return self.max_payload_kb * 1024


def current_settings(static: Settings, provider: SettingsProvider | None) -> Settings:
    """Resolves the settings for one use: the live provider wins when present,
    and any failure to read it keeps the settings the plugin started with."""
    if provider is None:
        return static
    try:
        return provider()
    except Exception:
        return static


def load_settings() -> Settings:
    try:
        from hermes_cli.config import load_config_readonly
    except Exception:
        return Settings()
    try:
        config = load_config_readonly()
    except Exception:
        return Settings()
    entries = config.get("plugins", {}).get("entries", {})
    section = entries.get("session-rewind", {}) if isinstance(entries, dict) else {}
    values = section.get("settings", {}) if isinstance(section, dict) else {}
    return Settings.from_mapping(values if isinstance(values, dict) else {})


def _as_int(value: object, default: int, minimum: int, maximum: int) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        return default
    return max(minimum, min(maximum, value))


def _as_bool(value: object, default: bool) -> bool:
    return value if isinstance(value, bool) else default


def _as_text(value: object, default: str) -> str:
    if isinstance(value, str):
        return value.strip() or default
    return default
