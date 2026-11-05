from typing import Any

__all__ = ["register"]


def register(ctx: Any) -> None:
    from .plugin import register as register_plugin

    register_plugin(ctx)
