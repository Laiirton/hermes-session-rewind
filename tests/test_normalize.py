from __future__ import annotations

import json
from typing import Any

from session_rewind.capture.normalize import PayloadNormalizer, Redactor


def test_redacts_known_secret_shapes() -> None:
    normalizer = PayloadNormalizer(10000, Redactor(True))
    payload = normalizer.normalize(
        {
            "api_key": "sk-abcdefghijklmnopqrstuvwxyz",
            "password": "hunter2",
            "authorization": "Bearer abcdefghijklmnop",
            "message": "token=abcdefghijklmnop",
        }
    )
    parsed = json.loads(payload)
    assert parsed["api_key"] == "[REDACTED]"
    assert parsed["password"] == "[REDACTED]"
    assert parsed["authorization"] == "[REDACTED]"
    assert "abcdefghijklmnop" not in parsed["message"]


def test_redaction_can_be_disabled() -> None:
    normalizer = PayloadNormalizer(10000, Redactor(False))
    parsed = json.loads(normalizer.normalize({"api_key": "sk-abcdefghijklmnopqrstuvwxyz"}))
    assert parsed["api_key"] == "sk-abcdefghijklmnopqrstuvwxyz"


def test_truncates_large_payloads() -> None:
    normalizer = PayloadNormalizer(512, Redactor(True))
    parsed = json.loads(normalizer.normalize({"text": "x" * 5000}))
    assert parsed["_truncated"] is True
    assert "_preview" in parsed
    assert parsed["_bytes"] > 512


def test_handles_unsupported_objects() -> None:
    normalizer = PayloadNormalizer(10000, Redactor(True))
    parsed = json.loads(normalizer.normalize({"value": object()}))
    assert parsed["value"].startswith("<object object at")


def test_truncates_nested_collections_and_non_finite_numbers() -> None:
    normalizer = PayloadNormalizer(100000, Redactor(True))
    parsed = json.loads(
        normalizer.normalize(
            {
                "blob": b"abc",
                "items": list(range(150)),
                "nan": float("nan"),
                "inf": float("inf"),
            }
        )
    )
    assert parsed["blob"] == "<bytes:3>"
    assert len(parsed["items"]) == 100
    assert parsed["_truncated"] is True
    assert parsed["nan"] is None
    assert parsed["inf"] is None


def test_depth_limit() -> None:
    normalizer = PayloadNormalizer(100000, Redactor(True))
    value: dict[str, Any] = {}
    current = value
    for _ in range(12):
        child: dict[str, Any] = {}
        current["child"] = child
        current = child
    rendered = normalizer.normalize(value)
    assert "depth limit" in rendered


def _normalize(payload: object) -> str:
    return PayloadNormalizer(10000, Redactor(True)).normalize(payload)


def test_redacts_prefixed_and_bare_secret_shapes() -> None:
    text = _normalize({"args": {"command": "run with sk-proj-abcdefghijklmnopqrstuvwxyz"}})
    assert "sk-proj" not in text
    assert "[REDACTED]" in text

    jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwInQifQ.dozJhRqCp21w"
    text = _normalize({"jwt": jwt})
    assert "eyJ" not in text
    assert "[REDACTED]" in text


def test_redacts_sensitive_keys_whatever_the_value_type() -> None:
    assert '"token":"[REDACTED]"' in _normalize({"token": 123456789012345})
    assert '"password":"[REDACTED]"' in _normalize({"password": "hunter2"})
    assert "hunter2" not in _normalize({"password": "hunter2"})


def test_redacts_short_assignments_in_free_text() -> None:
    text = _normalize({"result": "password=hunter2 and token=abcdefgh"})
    assert "hunter2" not in text
    assert "abcdefgh" not in text


def test_ordinary_payloads_are_not_redacted() -> None:
    text = _normalize({"args": {"command": "echo hello world", "count": 12}})
    assert "[REDACTED]" not in text
    assert "hello world" in text
