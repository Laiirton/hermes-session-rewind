from __future__ import annotations

from pathlib import Path

from session_rewind.capture.snapshots import SnapshotService
from session_rewind.settings import Settings
from session_rewind.store.db import Database
from session_rewind.store.repositories import ReadStore, WriteStore


def _session(database: Database, cwd: str | None = None) -> None:
    store = WriteStore(database.connect())
    try:
        store.upsert_session("s1", 1.0, cwd=cwd)
    finally:
        store.close()


def test_snapshot_service_uses_workspace_root(database: Database, git_repo: Path) -> None:
    _session(database)
    service = SnapshotService(database, Settings(workspace_root=str(git_repo)))
    service.start()
    service.request("s1", 10.0, None)
    service.close()
    snapshots = ReadStore(database).list_snapshots("s1")
    assert len(snapshots) == 1
    assert snapshots[0]["fidelity"] == "full"
    assert snapshots[0]["file_count"] == 1


def test_snapshot_service_uses_session_cwd(database: Database, git_repo: Path) -> None:
    _session(database, str(git_repo))
    service = SnapshotService(database, Settings())
    service.start()
    service.request("s1", 10.0, None)
    service.close()
    assert len(ReadStore(database).list_snapshots("s1")) == 1


def test_snapshot_service_disabled(database: Database, git_repo: Path) -> None:
    _session(database, str(git_repo))
    service = SnapshotService(database, Settings(snapshot_enabled=False))
    service.start()
    service.request("s1", 10.0, None)
    service.close()
    assert ReadStore(database).list_snapshots("s1") == []


def test_snapshot_service_throttles_and_detects_changes(
    database: Database,
    git_repo: Path,
) -> None:
    _session(database)
    service = SnapshotService(database, Settings(workspace_root=str(git_repo)))
    service.start()
    service.request("s1", 10.0, None)
    service.request("s1", 11.0, None)
    service.close()
    assert len(ReadStore(database).list_snapshots("s1")) == 1

    service = SnapshotService(database, Settings(workspace_root=str(git_repo)))
    service.start()
    service.request("s1", 20.0, None)
    (git_repo / "app.py").write_text("print('changed')\n", encoding="utf-8")
    service.request("s1", 22.0, None)
    service.close()
    assert len(ReadStore(database).list_snapshots("s1")) == 2


def test_snapshot_service_missing_root(database: Database, tmp_path: Path) -> None:
    _session(database)
    service = SnapshotService(
        database,
        Settings(workspace_root=str(tmp_path / "missing")),
    )
    service.start()
    service.request("s1", 10.0, None)
    service.close()
    assert ReadStore(database).list_snapshots("s1") == []
