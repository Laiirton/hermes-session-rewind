from __future__ import annotations

import atexit
import sys
import types
from collections.abc import Callable
from pathlib import Path
from typing import Any

import pytest
import session_rewind


class FakeContext:
    def __init__(self) -> None:
        self.hooks: list[tuple[str, Callable[..., None]]] = []
        self.tools: list[tuple[str, dict[str, Any], Callable[..., str]]] = []

    def get_config(self, key: str, default: Any = None) -> Any:
        return default

    def register_hook(self, name: str, handler: Callable[..., None]) -> None:
        self.hooks.append((name, handler))

    def register_tool(
        self,
        name: str,
        toolset: str,
        schema: dict[str, Any],
        handler: Callable[..., str],
    ) -> None:
        self.tools.append((name, schema, handler))


def test_register_uses_public_plugin_surface(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    plugins_package = types.ModuleType("plugins")
    plugins_package.__path__ = []
    storage = types.ModuleType("plugins.plugin_storage")
    data_root = tmp_path / "plugin-data"
    storage.__dict__["plugin_data_dir"] = lambda name: data_root / name
    monkeypatch.setitem(sys.modules, "plugins", plugins_package)
    monkeypatch.setitem(sys.modules, "plugins.plugin_storage", storage)
    sys.modules.pop("session_rewind.plugin", None)

    closers: list[Callable[[], None]] = []
    monkeypatch.setattr(atexit, "register", lambda func: closers.append(func))

    ctx = FakeContext()
    session_rewind.register(ctx)

    assert [name for name, _ in ctx.hooks] == [
        "on_session_start",
        "on_session_end",
        "on_session_finalize",
        "pre_llm_call",
        "post_llm_call",
        "pre_api_request",
        "post_api_request",
        "pre_tool_call",
        "post_tool_call",
        "post_compaction",
    ]
    assert [name for name, _, _ in ctx.tools] == [
        "rewind_search",
        "rewind_inspect",
        "rewind_compare",
        "rewind_bookmark",
    ]
    assert (data_root / "session-rewind" / "rewind.sqlite3").exists()

    for close in closers:
        close()
    sys.modules.pop("session_rewind.plugin", None)
