from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from .shadow import GitError, GitShadow

MAX_DIFF_BYTES = 200000


@dataclass(frozen=True, slots=True)
class DiffEntry:
    path: str
    additions: int
    deletions: int


def diff_entries(
    shadow: GitShadow,
    repo_root: Path,
    left_sha: str,
    right_sha: str,
) -> list[DiffEntry]:
    result = shadow.run(
        repo_root,
        ["diff", "--numstat", "--no-renames", left_sha, right_sha],
        timeout=30.0,
    )
    if result.returncode != 0:
        raise GitError(result.stderr.strip() or "git diff failed")
    entries: list[DiffEntry] = []
    for line in result.stdout.splitlines():
        parts = line.split("\t", 2)
        if len(parts) != 3:
            continue
        additions_text, deletions_text, path = parts
        entries.append(
            DiffEntry(
                path=path,
                additions=_to_int(additions_text),
                deletions=_to_int(deletions_text),
            )
        )
    return entries


def diff_summary(
    shadow: GitShadow,
    repo_root: Path,
    left_sha: str,
    right_sha: str,
) -> dict[str, object]:
    entries = diff_entries(shadow, repo_root, left_sha, right_sha)
    return {
        "files": len(entries),
        "additions": sum(entry.additions for entry in entries),
        "deletions": sum(entry.deletions for entry in entries),
        "entries": [
            {
                "path": entry.path,
                "additions": entry.additions,
                "deletions": entry.deletions,
            }
            for entry in entries
        ],
    }


def diff_patch(
    shadow: GitShadow,
    repo_root: Path,
    left_sha: str,
    right_sha: str,
) -> str:
    result = shadow.run(
        repo_root,
        ["diff", "--no-color", "--no-ext-diff", left_sha, right_sha],
        timeout=30.0,
    )
    if result.returncode != 0:
        raise GitError(result.stderr.strip() or "git diff failed")
    return result.stdout[:MAX_DIFF_BYTES]


def _to_int(value: str) -> int:
    try:
        return int(value)
    except ValueError:
        return 0
