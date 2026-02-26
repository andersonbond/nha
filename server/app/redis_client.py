"""Redis client for address cache. If REDIS_URL is not set, get_redis() returns None and callers skip cache."""

import json
from typing import Any

from app.config import settings

_redis_client: Any = None


def get_redis():
    """Return a Redis client or None if REDIS_URL is not configured or Redis is unavailable."""
    global _redis_client
    if settings.REDIS_URL is None or not str(settings.REDIS_URL).strip():
        return None
    if _redis_client is None:
        try:
            import redis
            _redis_client = redis.from_url(
                settings.REDIS_URL,
                decode_responses=True,
            )
            _redis_client.ping()
        except Exception:
            _redis_client = None
    return _redis_client


def address_cache_get(key: str) -> list[dict[str, str]] | None:
    """Get a cached JSON array for an address key. Returns None on miss or if Redis unavailable."""
    r = get_redis()
    if r is None:
        return None
    try:
        raw = r.get(key)
        if raw is None:
            return None
        return json.loads(raw)
    except Exception:
        return None


def address_cache_set(key: str, value: list[dict[str, str]], ttl_seconds: int = 86400 * 7) -> None:
    """Set an address list in Redis. ttl_seconds default 7 days; use 0 for no expiry."""
    r = get_redis()
    if r is None:
        return
    try:
        r.set(key, json.dumps(value), ex=ttl_seconds if ttl_seconds else None)
    except Exception:
        pass


def address_cache_delete(key: str) -> None:
    """Delete a single key from the address cache. No-op if Redis unavailable."""
    r = get_redis()
    if r is None:
        return
    try:
        r.delete(key)
    except Exception:
        pass


def address_cache_delete_pattern(pattern: str) -> None:
    """Delete all keys matching pattern (e.g. address:provinces:*). No-op if Redis unavailable."""
    r = get_redis()
    if r is None:
        return
    try:
        keys = r.keys(pattern)
        if keys:
            r.delete(*keys)
    except Exception:
        pass

