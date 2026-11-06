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


def test_redacts_credentials_embedded_in_urls() -> None:
    normalizer = PayloadNormalizer(10000, Redactor(True))
    text = normalizer.normalize(
        {
            "url": "postgres://admin:s3cr3t_pass@db.internal:5432/app",
            "ok": "https://example.com/path?token=abcdefghij",
        }
    )
    parsed = json.loads(text)
    assert "s3cr3t_pass" not in parsed["url"]
    assert parsed["url"].startswith("postgres://admin:[REDACTED]@db.internal")
    assert "abcdefghij" not in parsed["ok"]
    assert "token=[REDACTED]" in parsed["ok"]


def test_redacts_quoted_values_with_spaces() -> None:
    text = _normalize({"result": 'password="my secret phrase" and client_secret: "ab cd ef gh"'})
    assert "my secret phrase" not in text
    assert "ab cd ef gh" not in text
    assert "[REDACTED]" in text


def test_redacts_more_provider_token_shapes() -> None:
    text = _normalize(
        {
            "google": "AIzaSyA1234567890abcdefghijklmnopqrstuvw",
            "stripe": "sk_live_abcdefghijklmnop1234",
            "npm": "npm_abcdefghijklmnopqrstuvwxyz0123456789AB",
            "header": "Authorization: Basic dXNlcjpwYXNzd29yZA==",
            "hook": "https://hooks.slack.com/services/T0000000/B0000000/XXXXXXXXXXXXXXXX",
        }
    )
    assert "AIza" not in text
    assert "sk_live_" not in text
    assert "npm_abcdefghij" not in text
    assert "dXNlcjpwYXNzd29yZA" not in text
    assert "B0000000" not in text


def test_more_sensitive_key_names_are_redacted_whatever_the_value() -> None:
    text = _normalize(
        {
            "client_secret": "topsecret",
            "private_key": "-----START-----",
            "session_token": "abc123def456",
            "cookie": "sessionid=abcdef; other=1",
            "aws_secret_access_key": "wJalrXUtnFEMI",
        }
    )
    assert "topsecret" not in text
    assert "-----START-----" not in text
    assert "abc123def456" not in text
    assert "sessionid=abcdef" not in text
    assert "wJalrXUtnFEMI" not in text


def test_plain_words_are_not_caught_by_the_new_key_names() -> None:
    text = _normalize(
        {
            "note": "passed=3 failed=0 authorize the user passwordless login",
            "url": "https://example.com/authorize?client_id=public123",
        }
    )
    assert "passed=3" in text
    assert "passwordless" in text
    assert "public123" in text
