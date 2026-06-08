from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from ..utils.redis_client import redis_set, redis_get, redis_delete

router = APIRouter(prefix="/api/redis", tags=["Redis"])


class RedisSetRequest(BaseModel):
    key: str = Field(min_length=1, description="键名")
    value: str = Field(min_length=1, description="键值")
    ttl_seconds: int = Field(gt=0, description="过期时间（秒）")


@router.post("/set")
def set_key(body: RedisSetRequest):
    """写入键值对到 Redis。写入失败（Redis 不可用）返回 503。"""
    ok = redis_set(body.key, body.value, body.ttl_seconds)
    if not ok:
        raise HTTPException(status_code=503, detail="Redis 不可用")
    return {"detail": "OK", "key": body.key}


@router.get("/{key}")
def get_key(key: str):
    """按 key 从 Redis 读取值。不存在返回 404。"""
    value = redis_get(key)
    if value is None:
        raise HTTPException(status_code=404, detail="键不存在")
    return {"key": key, "value": value}


@router.delete("/{key}")
def delete_key(key: str):
    """按 key 从 Redis 删除。不存在返回 404。"""
    deleted = redis_delete(key)
    if deleted == 0:
        raise HTTPException(status_code=404, detail="键不存在")
    return {"detail": "已删除", "key": key}
