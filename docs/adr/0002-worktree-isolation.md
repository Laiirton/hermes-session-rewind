# ADR 0002: Private-index snapshots and detached worktrees

## Context

A rerun must not modify the user's working tree, index or branches, and the user must be able to inspect and delete the rerun workspace independently.

## Decision

Snapshot with a private `GIT_INDEX_FILE`, `git add -A`, `write-tree` and `commit-tree`, and pin the commit with `refs/hermes-rewind/<session>/<sequence>`. A fork creates a detached worktree from the snapshot commit under `.hermes-rewind/` next to the repository.

## Alternatives

- `git stash`: changes the working tree and index, and is awkward to restore without side effects.
- Copying the repository: slow for large repositories and loses git provenance.
- Running in the original working tree: risks losing the user's work and makes cleanup unsafe.
- Checkout in place: destructive and not isolated.

## Consequences

- The original repository is untouched.
- Snapshots respect `.gitignore`.
- Ignored files are not restored.
- Cleanup removes the isolated worktree and prunes administrative files.
- Large repositories can exceed the snapshot guard and fall back to context-only forks.
