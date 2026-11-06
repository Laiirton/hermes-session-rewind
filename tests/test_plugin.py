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
    monkeypatch.setattr(atexit, "register", closers.append)

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


def test_register_applies_the_retention_setting(
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
    monkeypatch.setattr(atexit, "register", lambda func: None)

    from session_rewind.store.db import Database
    from session_rewind.store.repositories import WriteStore

    database = Database(data_root / "session-rewind" / "rewind.sqlite3")
    database.migrate()
    store = WriteStore(database.connect())
    try:
        store.upsert_session("ancient", 10.0)
        store.end_session("ancient", 20.0, "completed")
    finally:
        store.close()

    session_rewind.register(FakeContext())

    from session_rewind.store.repositories import ReadStore

    assert ReadStore(database).get_session("ancient") is None
    sys.modules.pop("session_rewind.plugin", None)
