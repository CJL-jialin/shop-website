from typing import Optional

from pydantic import BaseModel, Field


class UserCreate(BaseModel):
    """创建用户请求体。"""

    username: str = Field(min_length=1, max_length=50, description="用户名，唯一")
    name: str = Field(min_length=1, max_length=100, description="用户昵称")
    phone: Optional[str] = Field(None, max_length=20, description="手机号")
    avatar: Optional[str] = Field(None, description="头像URL")
    member_level: str = Field("普通会员", max_length=20, description="会员等级")


class UserUpdate(BaseModel):
    """修改用户请求体 — 所有字段可选，仅更新传入的非 None 字段。"""

    name: Optional[str] = Field(None, max_length=100, description="用户昵称")
    phone: Optional[str] = Field(None, max_length=20, description="手机号")
    avatar: Optional[str] = Field(None, description="头像URL")
    member_level: Optional[str] = Field(None, max_length=20, description="会员等级")


class UserResponse(BaseModel):
    """用户响应体。"""

    id: str
    username: str
    name: str
    avatar: Optional[str] = None
    member_level: str
    phone: Optional[str] = None
    created_at: str  # ISO 8601 datetime string

    model_config = {"from_attributes": True}


class UserListResponse(BaseModel):
    """分页用户列表响应体。"""

    users: list[UserResponse]
    total: int


# ── 认证相关模型 ──


class RegisterRequest(BaseModel):
    """用户注册请求体。"""

    username: str = Field(min_length=3, max_length=50, description="用户名，唯一")
    password: str = Field(min_length=6, max_length=128, description="密码")
    name: str = Field(min_length=1, max_length=100, description="用户昵称")
    phone: Optional[str] = Field(None, max_length=20, description="手机号")


class LoginRequest(BaseModel):
    """用户登录请求体。"""

    username: str = Field(description="用户名")
    password: str = Field(description="密码")


class AuthResponse(BaseModel):
    """认证响应体（注册/登录成功后返回）。"""

    token: str
    user: UserResponse


# ── 地址相关模型 ──


class AddressCreate(BaseModel):
    """新增地址请求体。"""

    name: str = Field(min_length=1, max_length=100, description="收件人姓名")
    phone: str = Field(min_length=1, max_length=20, description="联系电话")
    address: str = Field(min_length=1, description="详细地址")
    is_default: bool = Field(False, description="是否默认地址")


class AddressUpdate(BaseModel):
    """修改地址请求体 — 所有字段可选。"""

    name: Optional[str] = Field(None, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    address: Optional[str] = Field(None)
    is_default: Optional[bool] = Field(None)


class AddressResponse(BaseModel):
    """地址响应体。"""

    id: str
    user_id: str
    name: str
    phone: str
    address: str
    is_default: bool

    model_config = {"from_attributes": True}


# ── 商品相关模型 ──


class ProductResponse(BaseModel):
    """商品响应体。"""

    id: str
    name: str
    price: float
    image_url: str | None = None
    stock: int = 99
    category: str | None = None

    model_config = {"from_attributes": True}


class ProductListResponse(BaseModel):
    """分页商品列表响应体。"""

    products: list[ProductResponse]
    total: int


# ── 购物车相关模型 ──


class CartItemCreate(BaseModel):
    """加入购物车请求体。"""

    product_id: str = Field(min_length=1)
    product_name: str = Field(min_length=1)
    spec: str = Field("默认", max_length=50)
    price: float = Field(gt=0)
    image_url: str | None = None


class CartItemUpdate(BaseModel):
    """更新购物车项请求体。"""

    quantity: int | None = Field(None, ge=1)
    selected: bool | None = None


class CartItemResponse(BaseModel):
    """购物车项响应体。"""

    id: str
    user_id: str
    product_id: str
    product_name: str
    spec: str
    price: float
    quantity: int
    image_url: str | None = None
    selected: bool

    model_config = {"from_attributes": True}


class CheckoutResponse(BaseModel):
    """结算响应体。"""

    order_no: str
    total_amount: float


# ── 订单相关模型 ──


class OrderItemResponse(BaseModel):
    """订单项响应体。"""

    id: str
    product_id: str
    product_name: str
    product_image: str | None = None
    quantity: int
    price: float

    model_config = {"from_attributes": True}


class OrderResponse(BaseModel):
    """订单响应体。"""

    id: str
    user_id: str
    order_no: str
    status: str
    total_amount: float
    created_at: str
    order_items: list[OrderItemResponse] = []

    model_config = {"from_attributes": True}
