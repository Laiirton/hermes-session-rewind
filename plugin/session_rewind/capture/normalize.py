from __future__ import annotations

import json
import re
from typing import Any

MAX_STRING_CHARS = 8192
MAX_ITEMS = 100
MAX_DEPTH = 8

SECRET_KEY_NAMES = (
    r"api[_-]?key|api[_-]?secret|access[_-]?token|refresh[_-]?token|session[_-]?token|"
    r"client[_-]?secret|secret|secret[_-]?key|aws[_-]?secret[_-]?access[_-]?key|"
    r"private[_-]?key|password|passwd|pass|pwd|token|authorization|cookie"
)

SECRET_PATTERNS: tuple[tuple[re.Pattern[str], str], ...] = (
    (re.compile(r"sk-[A-Za-z0-9-]{16,}"), "[REDACTED]"),
    (re.compile(r"\b[sr]k_(?:live|test)_[A-Za-z0-9]{16,}"), "[REDACTED]"),
    (re.compile(r"AIza[0-9A-Za-z_-]{35}"), "[REDACTED]"),
    (re.compile(r"\bnpm_[A-Za-z0-9]{36}"), "[REDACTED]"),
    (
        re.compile(r"\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b"),
        "[REDACTED]",
    ),
    (re.compile(r"gh[pousr]_[A-Za-z0-9]{20,}"), "[REDACTED]"),
    (re.compile(r"github_pat_[A-Za-z0-9_]{20,}"), "[REDACTED]"),
    (re.compile(r"AKIA[0-9A-Z]{16}"), "[REDACTED]"),
    (re.compile(r"xox[baprs]-[A-Za-z0-9-]{10,}"), "[REDACTED]"),
    (re.compile(r"(?i)\bBearer\s+[A-Za-z0-9._~+/=-]{10,}"), "Bearer [REDACTED]"),
    (re.compile(r"(?i)\bBasic\s+[A-Za-z0-9+/=]{16,}"), "Basic [REDACTED]"),
    (
        # user:password@ inside any scheme URL - the classic database-URL leak
        re.compile(r"\b([a-z][a-z0-9+.-]*://[^/\s:@'\"]{1,}):([^@\s'\"/]{3,})@", re.IGNORECASE),
        r"\1:[REDACTED]@",
    ),
    (
        re.compile(r"https://hooks\.slack\.com/services/[A-Za-z0-9/_-]+"),
        "https://hooks.slack.com/services/[REDACTED]",
    ),
    (
        # quoted values may carry spaces: password="my secret phrase"
        re.compile(rf"(?i)\b({SECRET_KEY_NAMES})(\s*[:=]\s*)(['\"])([^'\"]{{6,}})\3"),
        r"\1\2\3[REDACTED]\3",
    ),
    (
        re.compile(rf"(?i)\b({SECRET_KEY_NAMES})(\s*[:=]\s*['\"]?)([A-Za-z0-9._~+/=-]{{6,}})"),
        r"\1\2[REDACTED]",
    ),
    (
        re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----"),
        "[REDACTED PRIVATE KEY]",
    ),
)

SENSITIVE_KEYS = re.compile(rf"(?i)^(?:{SECRET_KEY_NAMES})$")


class Redactor:
    def __init__(self, enabled: bool) -> None:
        self._enabled = enabled

    @property
    def enabled(self) -> bool:
        return self._enabled

    def redact_text(self, text: str) -> str:
        if not self._enabled:
            return text
        for pattern, replacement in SECRET_PATTERNS:
            text = pattern.sub(replacement, text)
        return text


class PayloadNormalizer:
    def __init__(self, max_bytes: int, redactor: Redactor) -> None:
        self._max_bytes = max_bytes
        self._redactor = redactor

    def normalize(self, payload: Any) -> str:
        cleaned, truncated = self._clean(payload, 0)
        if isinstance(cleaned, dict):
            result: dict[str, Any] = dict(cleaned)
        else:
            result = {"value": cleaned}
        if truncated:
            result["_truncated"] = True
        try:
            text = json.dumps(
                result,
                ensure_ascii=False,
                separators=(",", ":"),
                allow_nan=False,
            )
        except (TypeError, ValueError):
            text = json.dumps(
                {"value": repr(result), "_truncated": True},
                ensure_ascii=False,
                separators=(",", ":"),
            )
        encoded = text.encode("utf-8")
        if len(encoded) > self._max_bytes:
            preview = encoded[: self._max_bytes].decode("utf-8", errors="ignore")
            return json.dumps(
                {"_truncated": True, "_bytes": len(encoded), "_preview": preview},
                ensure_ascii=False,
                separators=(",", ":"),
            )
        return text

    def _clean(self, value: Any, depth: int) -> tuple[Any, bool]:
        if depth > MAX_DEPTH:
            return "[depth limit]", True
        if isinstance(value, str):
            return self._clean_string(value)
        if value is None or isinstance(value, (bool, int)):
            return value, False
        if isinstance(value, float):
            if value != value or value in (float("inf"), float("-inf")):
                return None, True
            return value, False
        if isinstance(value, bytes):
            return f"<bytes:{len(value)}>", True
        if isinstance(value, dict):
            return self._clean_dict(value, depth)
        if isinstance(value, (list, tuple, set)):
            return self._clean_sequence(list(value), depth)
        return repr(value), True

    def _clean_string(self, value: str) -> tuple[str, bool]:
        cleaned = self._redactor.redact_text(value)
        if len(cleaned) > MAX_STRING_CHARS:
            return cleaned[:MAX_STRING_CHARS] + "...", True
        return cleaned, False

    def _clean_dict(self, value: dict[Any, Any], depth: int) -> tuple[dict[str, Any], bool]:
        result: dict[str, Any] = {}
        truncated = len(value) > MAX_ITEMS
        for index, (key, item) in enumerate(value.items()):
            if index >= MAX_ITEMS:
                break
            key_text = self._redactor.redact_text(str(key))
            if self._redactor.enabled and SENSITIVE_KEYS.match(key_text) and item:
                result[key_text] = "[REDACTED]"
                continue
            cleaned, item_truncated = self._clean(item, depth + 1)
            result[key_text] = cleaned
            truncated = truncated or item_truncated
        return result, truncated

    def _clean_sequence(self, value: list[Any], depth: int) -> tuple[list[Any], bool]:
        truncated = len(value) > MAX_ITEMS
        result: list[Any] = []
        for item in value[:MAX_ITEMS]:
            cleaned, item_truncated = self._clean(item, depth + 1)
            result.append(cleaned)
            truncated = truncated or item_truncated
        return result, truncated
