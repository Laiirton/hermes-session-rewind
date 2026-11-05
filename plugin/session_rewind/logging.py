from __future__ import annotations

import logging

LOGGER_NAME = "session_rewind"


def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(f"{LOGGER_NAME}.{name}")
