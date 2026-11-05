from __future__ import annotations

import time
from pathlib import Path
from typing import Protocol

from ..gitrepo.shadow import GitError
from ..settings import Settings
from .db import Database
from .repositories import ReadStore, WriteStore

SECONDS_PER_DAY = 86400.0


class RefDeleter(Protocol):
    def drop_ref(self, repo_root: Path, ref_name: str) -> None: ...


class RetentionRunner:
    def __init__(self, database: Database, settings: Settings, refs: RefDeleter) -> None:
        self._database = database
        self._settings = settings
        self._refs = refs

    def run(self, now: float | None = None) -> int:
        cutoff = (now if now is not None else time.time()) - (
            self._settings.retention_days * SECONDS_PER_DAY
        )
        read = ReadStore(self._database)
        prunable = read.list_prunable_sessions(cutoff)
        if not prunable:
            return 0
        self._drop_refs(read.list_snapshot_refs(prunable))
        store = WriteStore(self._database.connect())
        try:
            return store.delete_sessions(prunable)
        finally:
            store.close()

    def _drop_refs(self, refs: list[dict[str, object]]) -> None:
        for ref in refs:
            repo_root = ref.get("repo_root")
            ref_name = ref.get("ref_name")
            if not isinstance(repo_root, str) or not isinstance(ref_name, str):
                continue
            try:
                self._refs.drop_ref(Path(repo_root), ref_name)
            except GitError:
                continue
