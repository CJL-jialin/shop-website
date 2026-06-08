import uuid
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User
from ..schemas import UserCreate, UserUpdate, UserResponse, UserListResponse

router = APIRouter(prefix="/api/db", tags=["DB CRUD"])


def _user_to_response(user: User) -> UserResponse:
    """ORM 对象 → Pydantic 响应模型。"""
    return UserResponse(
        id=str(user.id),
        username=user.username,
        name=user.name,
        avatar=user.avatar,
        member_level=user.member_level,
        phone=user.phone,
        created_at=user.created_at.isoformat() if user.created_at else "",
    )


@router.get("/users", response_model=UserListResponse)
def list_users(
    page: int = Query(1, ge=1, description="页码"),
    size: int = Query(20, ge=1, le=100, description="每页数量"),
    q: str | None = Query(None, description="按用户名模糊搜索"),
    db: Session = Depends(get_db),
):
    """查询用户列表，支持分页和按用户名模糊搜索。"""
    query = db.query(User)

    if q:
        query = query.filter(User.username.ilike(f"%{q}%"))

    total = query.count()
    users = query.offset((page - 1) * size).limit(size).all()

    return UserListResponse(
        users=[_user_to_response(u) for u in users],
        total=total,
    )


@router.post("/users", response_model=UserResponse, status_code=201)
def create_user(
    body: UserCreate,
    db: Session = Depends(get_db),
):
    """新增用户。用户名重复返回 409，密码字段暂用占位假值。"""
    existing = db.query(User).filter(User.username == body.username).first()
    if existing:
        raise HTTPException(status_code=409, detail=f"用户名 '{body.username}' 已存在")

    import hashlib

    user = User(
        id=uuid.uuid4(),
        username=body.username,
        name=body.name,
        password_hash=hashlib.sha256(body.username.encode()).hexdigest(),
        salt=hashlib.md5(body.username.encode()).hexdigest()[:16],
        phone=body.phone,
        avatar=body.avatar,
        member_level=body.member_level,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return _user_to_response(user)


@router.put("/users/{user_id}", response_model=UserResponse)
def update_user(
    user_id: str,
    body: UserUpdate,
    db: Session = Depends(get_db),
):
    """部分更新用户信息。仅修改传入的非 None 字段，用户不存在返回 404。"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail=f"用户 '{user_id}' 不存在")

    update_data = body.model_dump(exclude_unset=True, exclude_none=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="至少需要提供一个要修改的字段")

    for key, value in update_data.items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)
    return _user_to_response(user)


@router.delete("/users/{user_id}", status_code=204)
def delete_user(
    user_id: str,
    db: Session = Depends(get_db),
):
    """删除用户。不存在返回 404，成功返回 204 无响应体。"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail=f"用户 '{user_id}' 不存在")

    db.delete(user)
    db.commit()
