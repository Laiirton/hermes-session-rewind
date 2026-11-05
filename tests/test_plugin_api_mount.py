from __future__ import annotations

import importlib.util
import sys
import types
from pathlib import Path
from typing import Any

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

PLUGIN_ROOT = Path(__file__).resolve().parents[1] / "plugin"
PREFIX = "/api/plugins/session-rewind"


def _load_mount(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> Any:
    package: Any = types.ModuleType("plugins")
    storage: Any = types.ModuleType("plugins.plugin_storage")
    storage.plugin_data_dir = lambda name: tmp_path / name
    package.plugin_storage = storage
    monkeypatch.setitem(sys.modules, "plugins", package)
    monkeypatch.setitem(sys.modules, "plugins.plugin_storage", storage)
    spec = importlib.util.spec_from_file_location(
        "dashboard_plugin_api", PLUGIN_ROOT / "dashboard" / "plugin_api.py"
    )
    assert spec is not None and spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_production_mount_builds_a_working_router(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    module = _load_mount(tmp_path, monkeypatch)

    app = FastAPI()
    app.include_router(module.router, prefix=PREFIX)
    health = TestClient(app).get(f"{PREFIX}/health")

    assert health.status_code == 200
    assert health.json()["status"] == "ok"
    assert (tmp_path / "session-rewind" / "rewind.sqlite3").exists()


def test_production_mount_serves_sessions(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    module = _load_mount(tmp_path, monkeypatch)
    app = FastAPI()
    app.include_router(module.router, prefix=PREFIX)
    client = TestClient(app)

    created = client.post(
        f"{PREFIX}/bookmarks",
        json={"session_id": "missing", "event_id": 1, "label": "checkpoint"},
    )

    assert created.status_code == 404
    assert client.get(f"{PREFIX}/sessions").json()["items"] == []
