from __future__ import annotations

from typing import Any


def _load_router() -> Any:
    import sys
    from pathlib import Path

    root = Path(__file__).resolve().parents[1]
    if str(root) not in sys.path:
        sys.path.insert(0, str(root))
    from plugins.plugin_storage import plugin_data_dir
    from session_rewind.dashboard.api import create_router
    from session_rewind.settings import load_settings
    from session_rewind.store.db import Database

    return create_router(
        Database(plugin_data_dir("session-rewind") / "rewind.sqlite3"),
        load_settings(),
    )


router = _load_router()
