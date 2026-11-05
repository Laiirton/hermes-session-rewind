from __future__ import annotations

import sqlite3
from dataclasses import dataclass
from pathlib import Path

MIGRATIONS_DIR = Path(__file__).parent / "migrations"


@dataclass(frozen=True, slots=True)
class EventRecord:
    session_id: str
    ts: float
    kind: str
    payload_json: str
    turn_id: str | None = None
    task_id: str | None = None
    tool_call_id: str | None = None
    api_request_id: str | None = None
    name: str | None = None
    status: str | None = None
    duration_ms: float | None = None


SQLITE_MAX_INT = 9_223_372_036_854_775_807


class Database:
    def __init__(self, path: Path) -> None:
        self._path = path

    @property
    def path(self) -> Path:
        return self._path

    def connect(self, read_only: bool = False) -> sqlite3.Connection:
        self._path.parent.mkdir(parents=True, exist_ok=True)
        if read_only:
            connection = sqlite3.connect(
                f"file:{self._path.as_posix()}?mode=ro",
                uri=True,
                timeout=5.0,
                check_same_thread=False,
            )
        else:
            connection = sqlite3.connect(
                self._path,
                timeout=5.0,
                check_same_thread=False,
            )
        connection.row_factory = sqlite3.Row
        connection.execute("PRAGMA foreign_keys = ON")
        connection.execute("PRAGMA busy_timeout = 5000")
        if not read_only:
            connection.execute("PRAGMA journal_mode = WAL")
            connection.execute("PRAGMA synchronous = NORMAL")
        return connection

    def migrate(self) -> None:
        self._path.parent.mkdir(parents=True, exist_ok=True)
        connection = self.connect()
        try:
            self._apply_migrations(connection)
        finally:
            connection.close()

    def _apply_migrations(self, connection: sqlite3.Connection) -> None:
        connection.execute(
            "CREATE TABLE IF NOT EXISTS schema_migrations "
            "(version INTEGER PRIMARY KEY, applied_at REAL NOT NULL) STRICT"
        )
        applied = {
            int(row["version"])
            for row in connection.execute("SELECT version FROM schema_migrations").fetchall()
        }
        for path in sorted(MIGRATIONS_DIR.glob("*.sql")):
            version = _migration_version(path)
            if version in applied:
                continue
            connection.executescript(path.read_text(encoding="utf-8"))
            connection.execute(
                "INSERT INTO schema_migrations (version, applied_at) "
                "VALUES (?, CAST(strftime('%s', 'now') AS REAL))",
                (version,),
            )
            connection.commit()


def _migration_version(path: Path) -> int:
    prefix = path.name.split("_", 1)[0]
    return int(prefix)
