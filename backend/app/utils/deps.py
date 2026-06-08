import json
from datetime import datetime

from fastapi import Header, HTTPException, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User, Session as UserSession
from .redis_client import redis_get, redis_set


def get_current_user(
    db: Session = Depends(get_db),
    authorization: str | None = Header(None),
) -> User:
    """从 Authorization: Bearer <token> 中解析当前登录用户。

    优先从 Redis 缓存读取，未命中回退数据库并回写 Redis。
    任一条件不满足返回 401。
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="未登录或 token 已过期")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="未登录或 token 已过期")

    token = authorization[len("Bearer "):]

    # 1. 优先从 Redis 缓存读取
    cache_key = f"session:{token}"
    cached = redis_get(cache_key)
    if cached:
        try:
            data = json.loads(cached)
            user_id = data.get("user_id")
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                return user
        except (json.JSONDecodeError, KeyError):
            pass  # 缓存数据损坏，回退数据库

    # 2. Redis 未命中或不可用，回退数据库
    session = db.query(UserSession).filter(UserSession.token == token).first()
    if not session:
        raise HTTPException(status_code=401, detail="未登录或 token 已过期")

    if session.expires_at < datetime.utcnow():
        raise HTTPException(status_code=401, detail="未登录或 token 已过期")

    user = db.query(User).filter(User.id == session.user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="未登录或 token 已过期")

    # 3. 回写 Redis 缓存（续期 7 天）
    cache_val = json.dumps({"user_id": str(user.id), "username": user.username})
    redis_set(cache_key, cache_val, 604800)

    return user
