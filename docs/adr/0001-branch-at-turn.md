# ADR 0001: Fork at a user turn with the native branch count

## Context

A counterfactual rerun needs the conversation prefix and the workspace state at the same point. The Hermes gateway exposes `session.branch` for a live session with an optional `count` that keeps the first N rows of the source history.

## Decision

Fork at a user turn. Resolve the transcript row count before the selected user message through the read-only `SessionDB` facade and pass it as `count` to `session.branch`. When the count is unavailable, branch with zero rows and use a generated context pack.

## Alternatives

- Whole-session `session.branch_stored`: copies the full transcript, including the actions after the fork point. Rejected.
- `prompt.submit` truncation in place: mutates the original session. Rejected because the original must stay intact.
- `session.create` with seeded messages: useful as a fallback, but loses the native live-session plumbing and requires duplicating the seed logic.
- Arbitrary event forks: tool calls would be cut in half. Rejected.

## Consequences

- The fork is reproducible from a turn boundary.
- The context pack is the fallback when the transcript prefix is unavailable.
- The original session is never modified.
