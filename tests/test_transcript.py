from __future__ import annotations

import sys
import types
from typing import Any

import pytest
from session_rewind.sessiondb.transcript import SessionDBTranscriptReader


class FakeDatabase:
    def __init__(self, messages: Any) -> None:
        self.messages = messages
        self.closed = False

    def get_messages(self, session_id: str) -> Any:
        return self.messages

    def close(self) -> None:
        self.closed = True


def _install(monkeypatch: pytest.MonkeyPatch, factory: Any) -> None:
    module = types.ModuleType("hermes_state")
    module.__dict__["SessionDB"] = factory
    monkeypatch.setitem(sys.modules, "hermes_state", module)


def test_row_count_before_dict_messages(monkeypatch: pytest.MonkeyPatch) -> None:
    database = FakeDatabase(
        [
            {"role": "user", "timestamp": 5.0},
            {"role": "assistant", "timestamp": 6.0},
            {"role": "user", "timestamp": 11.0},
        ]
    )
    _install(monkeypatch, lambda read_only: database)
    reader = SessionDBTranscriptReader()
    assert reader.row_count_before("s", 10.0) == 0
    assert reader.row_count_before("s", 12.0) == 2
    assert reader.row_count_before("", 12.0) is None
    assert database.closed is True


def test_row_count_before_object_messages(monkeypatch: pytest.MonkeyPatch) -> None:
    class Message:
        def __init__(self, role: str, timestamp: str) -> None:
            self.role = role
            self.timestamp = timestamp

    database = FakeDatabase([Message("user", "5.5"), Message("assistant", "6.0")])
    _install(monkeypatch, lambda read_only: database)
    reader = SessionDBTranscriptReader()
    assert reader.row_count_before("s", 10.0) == 0


def test_reader_handles_unavailable_store(monkeypatch: pytest.MonkeyPatch) -> None:
    def broken(read_only: bool) -> FakeDatabase:
        raise RuntimeError("no store")

    _install(monkeypatch, broken)
    reader = SessionDBTranscriptReader()
    assert reader.row_count_before("s", 10.0) is None

    _install(monkeypatch, lambda read_only: FakeDatabase("not a list"))
    assert reader.row_count_before("s", 10.0) is None
