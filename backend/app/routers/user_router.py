import uuid

from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User, Address
from ..models import Session as UserSession
from ..schemas import (
    RegisterRequest,
    LoginRequest,
    AuthResponse,
    UserResponse,
    UserUpdate,
    AddressCreate,
    AddressUpdate,
    AddressResponse,
)
from ..utils.auth import generate_salt, hash_password, verify_password, create_session
from ..utils.deps import get_current_user
from ..utils.redis_client import redis_delete

router = APIRouter(tags=["User Auth & Profile"])


def _user_to_response(user: User) -> UserResponse:
    return UserResponse(
        id=str(user.id),
        username=user.username,
        name=user.name,
        avatar=user.avatar,
        member_level=user.member_level,
        phone=user.phone,
        created_at=user.created_at.isoformat() if user.created_at else "",
    )


def _address_to_response(addr: Address) -> AddressResponse:
    return AddressResponse(
        id=str(addr.id),
        user_id=str(addr.user_id),
        name=addr.name,
        phone=addr.phone,
        address=addr.address,
        is_default=addr.is_default,
    )


# ═══════════════════════════════════════════
# 无需认证的端点
# ═══════════════════════════════════════════


@router.post("/api/auth/register", response_model=AuthResponse, status_code=201)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    """用户注册。重名返回 409，注册成功自动登录返回 token。"""
    existing = db.query(User).filter(User.username == body.username).first()
    if existing:
        raise HTTPException(status_code=409, detail="用户名已存在")

    salt = generate_salt()
    pwd_hash = hash_password(body.password, salt)

    user = User(
        id=uuid.uuid4(),
        username=body.username,
        name=body.name,
        password_hash=pwd_hash,
        salt=salt,
        phone=body.phone,
        member_level="普通会员",
    )
    db.add(user)
    db.flush()

    session = create_session(db, user.id, user.username)

    return AuthResponse(token=session.token, user=_user_to_response(user))


@router.post("/api/auth/login", response_model=AuthResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    """用户登录。用户名不存在或密码错误均返回 401。"""
    user = db.query(User).filter(User.username == body.username).first()
    if not user:
        raise HTTPException(status_code=401, detail="用户名或密码错误")

    if not verify_password(body.password, user.salt, user.password_hash):
        raise HTTPException(status_code=401, detail="用户名或密码错误")

    session = create_session(db, user.id, user.username)

    return AuthResponse(token=session.token, user=_user_to_response(user))


@router.post("/api/auth/logout")
def logout(
    db: Session = Depends(get_db),
    authorization: str | None = Header(None),
):
    """用户登出。删除会话记录使 token 失效。"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="未登录或 token 已过期")

    token = authorization[len("Bearer "):]

    session = db.query(UserSession).filter(UserSession.token == token).first()
    if not session:
        raise HTTPException(status_code=401, detail="未登录或 token 已过期")

    db.delete(session)
    db.commit()

    # 同步清理 Redis 缓存，Redis 不可用时静默跳过
    redis_delete(f"session:{token}")

    return {"detail": "已登出"}


# ═══════════════════════════════════════════
# 需认证的端点
# ═══════════════════════════════════════════


@router.get("/api/user/profile", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    """获取当前登录用户的完整信息。"""
    return _user_to_response(current_user)


@router.put("/api/user/profile", response_model=UserResponse)
def update_profile(
    body: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """修改当前用户的昵称或手机号。"""
    update_data = body.model_dump(exclude_unset=True, exclude_none=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="至少需要提供一个要修改的字段")

    for key, value in update_data.items():
        setattr(current_user, key, value)

    db.commit()
    db.refresh(current_user)
    return _user_to_response(current_user)


@router.get("/api/user/addresses", response_model=list[AddressResponse])
def list_addresses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """查询当前用户的地址列表（默认地址排最前）。"""
    addrs = (
        db.query(Address)
        .filter(Address.user_id == current_user.id)
        .order_by(Address.is_default.desc())
        .all()
    )
    return [_address_to_response(a) for a in addrs]


@router.post("/api/user/addresses", response_model=AddressResponse, status_code=201)
def create_address(
    body: AddressCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """新增地址。若设为默认，先取消旧默认地址。"""
    if body.is_default:
        db.query(Address).filter(
            Address.user_id == current_user.id, Address.is_default == True
        ).update({"is_default": False})

    addr = Address(
        id=uuid.uuid4(),
        user_id=current_user.id,
        name=body.name,
        phone=body.phone,
        address=body.address,
        is_default=body.is_default,
    )
    db.add(addr)
    db.commit()
    db.refresh(addr)
    return _address_to_response(addr)


@router.put("/api/user/addresses/{address_id}", response_model=AddressResponse)
def update_address(
    address_id: str,
    body: AddressUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """修改地址。仅允许操作自己的地址。"""
    addr = (
        db.query(Address)
        .filter(Address.id == address_id, Address.user_id == current_user.id)
        .first()
    )
    if not addr:
        raise HTTPException(status_code=404, detail="地址不存在")

    update_data = body.model_dump(exclude_unset=True, exclude_none=True)

    if update_data.get("is_default"):
        db.query(Address).filter(
            Address.user_id == current_user.id, Address.is_default == True
        ).update({"is_default": False})

    for key, value in update_data.items():
        setattr(addr, key, value)

    db.commit()
    db.refresh(addr)
    return _address_to_response(addr)


@router.delete("/api/user/addresses/{address_id}", status_code=204)
def delete_address(
    address_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """删除地址。仅允许操作自己的地址。"""
    addr = (
        db.query(Address)
        .filter(Address.id == address_id, Address.user_id == current_user.id)
        .first()
    )
    if not addr:
        raise HTTPException(status_code=404, detail="地址不存在")

    db.delete(addr)
    db.commit()
