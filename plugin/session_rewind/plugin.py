from __future__ import annotations

import atexit
from collections.abc import Callable
from typing import Any

from plugins.plugin_storage import plugin_data_dir

from .capture.hooks import HookRecorder
from .capture.queue import CaptureService
from .capture.snapshots import SnapshotService
from .fork.service import build_fork_service
from .gitrepo.shadow import GitShadow
from .settings import Settings
from .store.db import Database, EventRecord
from .store.retention import RetentionRunner, RetentionScheduler
from .tools import RewindTools, registrations


def register(ctx: Any) -> None:
    settings = Settings.from_context(ctx)

    def live_settings() -> Settings:
        return Settings.from_context(ctx)

    database = Database(plugin_data_dir("session-rewind") / "rewind.sqlite3")
    database.migrate()

    def sweep() -> None:
        current = Settings.from_context(ctx)
        RetentionRunner(database, current, GitShadow()).run()
        build_fork_service(database, current).sweep(None)

    sweep()
    snapshots = SnapshotService(
        database=database, settings=settings, settings_provider=live_settings
    )
    snapshots.start()

    def on_event(record: EventRecord, event_id: int) -> None:
        if record.kind == "user_turn":
            snapshots.request(record.session_id, record.ts, event_id)

    service = CaptureService(
        database=database, settings=settings, event_sink=on_event, settings_provider=live_settings
    )
    service.start()
    recorder = HookRecorder(service=service, settings=settings)
    for name, hook_handler in _hooks(recorder):
        ctx.register_hook(name, hook_handler)
    tools = RewindTools(database=database)
    for name, schema, tool_handler in registrations(tools):
        ctx.register_tool(
            name=name,
            toolset="session_rewind",
            schema=schema,
            handler=tool_handler,
        )

    scheduler = RetentionScheduler(sweep)
    scheduler.start()

    def close() -> None:
        scheduler.stop()
        service.close()
        snapshots.close()

    atexit.register(close)


def _hooks(recorder: HookRecorder) -> list[tuple[str, Callable[..., None]]]:
    return [
        ("on_session_start", recorder.on_session_start),
        ("on_session_end", recorder.on_session_end),
        ("on_session_finalize", recorder.on_session_finalize),
        ("pre_llm_call", recorder.pre_llm_call),
        ("post_llm_call", recorder.post_llm_call),
        ("pre_api_request", recorder.pre_api_request),
        ("post_api_request", recorder.post_api_request),
        ("pre_tool_call", recorder.pre_tool_call),
        ("post_tool_call", recorder.post_tool_call),
        ("post_compaction", recorder.post_compaction),
    ]
