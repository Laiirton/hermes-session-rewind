from __future__ import annotations

import re


def _safe_fts_query(query: str) -> str:
    tokens = [token for token in re.split(r"\s+", query.strip()) if token]
    cleaned = [token.replace('"', "") for token in tokens]
    return " AND ".join(f'"{token}"' for token in cleaned if token)


from .helpers import last_turn_outcome  # noqa: E402
from .read_sessions import ReadStore  # noqa: E402
from .search import search_events  # noqa: E402
from .write_events import WriteStore  # noqa: E402

__all__ = [
    "ReadStore",
    "WriteStore",
    "_safe_fts_query",
    "last_turn_outcome",
    "search_events",
]
