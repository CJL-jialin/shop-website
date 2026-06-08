import json
import uuid
from datetime import datetime, timedelta

import bcrypt
from sqlalchemy.orm import Session

from ..models import Session as UserSession
from .redis_client import redis_set


def generate_salt() -> str:
    """生成 16 字节的随机盐值（bcrypt 格式）。"""
    return bcrypt.gensalt().decode()


def hash_password(password: str, salt: str) -> str:
    """使用 bcrypt 和给定盐值对密码进行哈希。"""
    return bcrypt.hashpw(password.encode(), salt.encode()).decode()


def verify_password(password: str, salt: str, stored_hash: str) -> bool:
    """验证输入密码是否匹配已存储的哈希值。"""
    computed = hash_password(password, salt)
    return computed == stored_hash


def create_session(db: Session, user_id: uuid.UUID, username: str = "") -> UserSession:
    """创建会话记录：UUID4 token，7 天过期，同步写入 Redis 缓存。"""
    session = UserSession(
        id=uuid.uuid4(),
        user_id=user_id,
        token=str(uuid.uuid4()),
        expires_at=datetime.utcnow() + timedelta(days=7),
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    # 同步写入 Redis（7 天 TTL），失败不抛异常
    cache_key = f"session:{session.token}"
    cache_val = json.dumps({"user_id": str(user_id), "username": username})
    redis_set(cache_key, cache_val, 604800)

    return session
