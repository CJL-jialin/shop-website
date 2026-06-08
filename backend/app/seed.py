"""Faker 假数据填充脚本。
首次运行自动建表，生成 10 个假用户及对应会话记录并写入数据库。
用法：python -m app.seed
"""
import uuid
import random
from datetime import datetime, timedelta

from faker import Faker

from .database import SessionLocal, engine, Base
from .models import User, Session

fake = Faker("zh_CN")


def create_users(db) -> list[User]:
    """生成 10 个假用户，用户名唯一。"""
    users: list[User] = []
    used_usernames: set[str] = set()

    while len(users) < 10:
        username = fake.user_name()
        # 校验：长度 6-20，仅小写字母+数字开头
        if username in used_usernames or len(username) < 6 or len(username) > 20:
            continue
        used_usernames.add(username)

        user = User(
            username=username,
            password_hash=fake.sha256(),
            salt=fake.md5()[:16],
            name=fake.name(),
            avatar=fake.image_url() if random.random() > 0.3 else None,
            member_level="普通会员",
            phone=fake.phone_number(),
        )
        users.append(user)

    return users


def create_sessions_for_user(db, user: User) -> list[Session]:
    """为一个用户随机生成 1 到 2 条会话记录。"""
    count = random.randint(1, 2)
    sessions: list[Session] = []
    for _ in range(count):
        session = Session(
            user_id=user.id,
            token=str(uuid.uuid4()),
            expires_at=datetime.utcnow() + timedelta(days=7),
        )
        sessions.append(session)
    return sessions


def main():
    # 1. 自动建表（表已存在则跳过）
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # 2. 生成并写入 10 个用户
        users = create_users(db)
        db.add_all(users)
        db.flush()  # 确保 user.id 已生成

        # 3. 为每个用户生成 1-2 条会话记录
        all_sessions: list[Session] = []
        for user in users:
            sessions = create_sessions_for_user(db, user)
            all_sessions.extend(sessions)

        db.add_all(all_sessions)
        db.commit()

        print(f"[OK] Wrote {len(users)} users")
        print(f"[OK] Wrote {len(all_sessions)} sessions")

    except Exception as e:
        db.rollback()
        print(f"[FAIL] {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
