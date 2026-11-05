CREATE INDEX IF NOT EXISTS idx_events_session_kind_seq ON events (session_id, kind, seq);

CREATE INDEX IF NOT EXISTS idx_branches_child ON branches (child_session_id);
