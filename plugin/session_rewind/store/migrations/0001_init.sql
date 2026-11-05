CREATE TABLE IF NOT EXISTS schema_migrations (
    version INTEGER PRIMARY KEY,
    applied_at REAL NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS sessions (
    session_id TEXT PRIMARY KEY,
    stored_session_id TEXT,
    parent_session_id TEXT,
    title TEXT,
    cwd TEXT,
    model TEXT,
    provider TEXT,
    platform TEXT,
    started_at REAL NOT NULL,
    ended_at REAL,
    outcome TEXT
) STRICT;

CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
    seq INTEGER NOT NULL,
    ts REAL NOT NULL,
    kind TEXT NOT NULL,
    turn_id TEXT,
    task_id TEXT,
    tool_call_id TEXT,
    api_request_id TEXT,
    name TEXT,
    status TEXT,
    duration_ms REAL,
    payload_json TEXT NOT NULL,
    UNIQUE (session_id, seq)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_events_session_ts ON events (session_id, ts);
CREATE INDEX IF NOT EXISTS idx_events_kind_ts ON events (kind, ts);
CREATE INDEX IF NOT EXISTS idx_events_turn ON events (session_id, turn_id);

CREATE VIRTUAL TABLE IF NOT EXISTS events_fts USING fts5(
    payload_json,
    name,
    content='events',
    content_rowid='id',
    tokenize='unicode61'
);

CREATE TRIGGER IF NOT EXISTS events_ai AFTER INSERT ON events BEGIN
    INSERT INTO events_fts (rowid, payload_json, name)
    VALUES (new.id, new.payload_json, new.name);
END;

CREATE TRIGGER IF NOT EXISTS events_ad AFTER DELETE ON events BEGIN
    INSERT INTO events_fts (events_fts, rowid, payload_json, name)
    VALUES ('delete', old.id, old.payload_json, old.name);
END;

CREATE TABLE IF NOT EXISTS snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
    event_id INTEGER REFERENCES events(id) ON DELETE SET NULL,
    ts REAL NOT NULL,
    repo_root TEXT NOT NULL,
    commit_sha TEXT NOT NULL,
    ref_name TEXT NOT NULL,
    fidelity TEXT NOT NULL,
    file_count INTEGER NOT NULL DEFAULT 0,
    UNIQUE (session_id, commit_sha)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_snapshots_session_ts ON snapshots (session_id, ts);

CREATE TABLE IF NOT EXISTS branches (
    id TEXT PRIMARY KEY,
    parent_session_id TEXT NOT NULL,
    fork_before_ts REAL NOT NULL,
    fork_row_count INTEGER NOT NULL,
    snapshot_id INTEGER REFERENCES snapshots(id) ON DELETE SET NULL,
    child_session_id TEXT,
    child_stored_session_id TEXT,
    worktree_path TEXT,
    model TEXT,
    provider TEXT,
    prompt TEXT NOT NULL,
    verify_cmd TEXT,
    state TEXT NOT NULL,
    created_at REAL NOT NULL,
    updated_at REAL NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_branches_parent ON branches (parent_session_id, created_at);

CREATE TABLE IF NOT EXISTS runs (
    branch_id TEXT PRIMARY KEY REFERENCES branches(id) ON DELETE CASCADE,
    tokens_in INTEGER NOT NULL DEFAULT 0,
    tokens_out INTEGER NOT NULL DEFAULT 0,
    cost_usd REAL NOT NULL DEFAULT 0,
    tool_calls INTEGER NOT NULL DEFAULT 0,
    tool_errors INTEGER NOT NULL DEFAULT 0,
    duration_ms REAL NOT NULL DEFAULT 0,
    verify_exit INTEGER,
    verify_out TEXT,
    outcome_summary TEXT,
    updated_at REAL NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS bookmarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    note TEXT,
    created_at REAL NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_bookmarks_session ON bookmarks (session_id, created_at);
