import os

import redis

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

_client: redis.Redis | None = None


def _get_client() -> redis.Redis | None:
    """获取 Redis 连接实例（惰性创建）。"""
    global _client
    if _client is None:
        try:
            _client = redis.Redis.from_url(REDIS_URL, decode_responses=True)
            _client.ping()
        except redis.RedisError:
            return None
    return _client


def redis_set(key: str, value: str, ttl_seconds: int) -> bool:
    """写入键值对并设置过期时间。成功返回 True，Redis 不可用返回 False。"""
    client = _get_client()
    if client is None:
        return False
    try:
        client.setex(key, ttl_seconds, value)
        return True
    except redis.RedisError:
        return False


def redis_get(key: str) -> str | None:
    """按 key 读取值。key 不存在或 Redis 不可用返回 None。"""
    client = _get_client()
    if client is None:
        return None
    try:
        return client.get(key)
    except redis.RedisError:
        return None


def redis_delete(key: str) -> int:
    """删除一个 key，返回删除数量。Redis 不可用时返回 0。"""
    client = _get_client()
    if client is None:
        return 0
    try:
        return client.delete(key)
    except redis.RedisError:
        return 0
