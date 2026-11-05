# ADR 0003: Local SQLite event store

## Context

The timeline needs ordered events, search, metrics, snapshots, branches, runs and bookmarks. The Hermes session database is the canonical transcript store and is written only by the gateway.

## Decision

Keep a plugin-owned SQLite database under `plugin-data/session-rewind/`. Capture public hook events in a bounded queue and write them with a single writer thread. Read the canonical transcript through the documented `SessionDB(read_only=True)` facade only when a fork needs the row count.

## Alternatives

- Opening `state.db` directly: violates the single-writer rule and the documented plugin guidance.
- Storing events only in JSONL: weaker querying and aggregation, and no transactional branches.
- Rebuilding everything from the transcript on demand: loses API usage, timing, compactions and capture values not present in the transcript.

## Consequences

- Captured data is local, queryable and independent of the transcript.
- The plugin never writes to `state.db`.
- Retention and deletion are simple file and database operations.
