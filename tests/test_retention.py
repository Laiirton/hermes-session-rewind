from __future__ import annotations

import json
from pathlib import Path

from session_rewind.gitrepo.shadow import GitShadow
from session_rewind.settings import Settings
from session_rewind.store.db import Database, EventRecord
from session_rewind.store.repositories import ReadStore, WriteStore
from session_rewind.store.retention import RetentionRunner


class RecordingRefs:
    def __init__(self) -> None:
        self.dropped: list[tuple[Path, str]] = []

    def drop_ref(self, repo_root: Path, ref_name: str) -> None:
        self.dropped.append((repo_root, ref_name))


def _seed(database: Database) -> None:
    store = WriteStore(database.connect())
    try:
        store.upsert_session("ancient", 10.0)
        store.end_session("ancient", 20.0, "completed")
        store.upsert_session("still-live", 10.0)
        store.upsert_session("recent", 900_000.0)
        store.end_session("recent", 900_001.0, "completed")
        store.append_events(
            [
                EventRecord(
                    session_id="ancient",
                    ts=11.0,
                    kind="user_turn",
                    payload_json=json.dumps({"user_message": "old"}),
                )
            ]
        )
        store.add_snapshot(
            "ancient", 12.0, "/repo", "sha1", "refs/hermes-rewind/ancient/1", "full", 3, None
        )
    finally:
        store.close()


def test_retention_prunes_only_old_finished_sessions(database: Database) -> None:
    _seed(database)
    refs = RecordingRefs()
    runner = RetentionRunner(database, Settings(retention_days=30), refs)

    assert runner.run(now=3_000_000.0) == 1

    remaining = [row["session_id"] for row in ReadStore(database).list_sessions(limit=10, offset=0)]
    assert sorted(remaining) == ["recent", "still-live"]
    assert refs.dropped == [(Path("/repo"), "refs/hermes-rewind/ancient/1")]


def test_retention_keeps_sessions_with_an_active_branch(database: Database) -> None:
    _seed(database)
    store = WriteStore(database.connect())
    try:
        store.create_branch(
            "b1", "ancient", 11.0, 1, None, None, None, None, "rerun", None, "running", 30.0
        )
    finally:
        store.close()
    runner = RetentionRunner(database, Settings(retention_days=30), RecordingRefs())

    assert runner.run(now=3_000_000.0) == 0

    assert ReadStore(database).get_session("ancient") is not None


def test_retention_is_a_noop_without_the_setting_target(database: Database) -> None:
    _seed(database)
    runner = RetentionRunner(database, Settings(retention_days=3650), RecordingRefs())

    assert runner.run(now=3_000_000.0) == 0


def test_real_shadow_refs_are_dropped(database: Database, git_repo: Path) -> None:
    shadow = GitShadow()
    snapshot = shadow.snapshot(git_repo, "ancient", 1)
    assert snapshot is not None
    _seed(database)
    store = WriteStore(database.connect())
    try:
        store.delete_sessions(["ancient"])
        store.upsert_session("ancient", 10.0)
        store.end_session("ancient", 20.0, "completed")
        store.add_snapshot(
            "ancient",
            12.0,
            str(git_repo),
            snapshot.commit_sha,
            snapshot.ref_name,
            "full",
            snapshot.file_count,
            None,
        )
    finally:
        store.close()

    assert RetentionRunner(database, Settings(retention_days=30), shadow).run(now=3_000_000.0) == 1

    listing = shadow.run(git_repo, ["for-each-ref", snapshot.ref_name], timeout=5.0)
    assert listing.stdout.strip() == ""
