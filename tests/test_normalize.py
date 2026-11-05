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
