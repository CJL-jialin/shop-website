## ADDED Requirements

### Requirement: 数据库表结构定义
系统 SHALL 在 `backend/app/models.py` 中使用 SQLAlchemy ORM 定义 `User`、`Session` 和 `Address` 三个模型类，分别映射到 PostgreSQL 的 `users` 表、`sessions` 表和 `addresses` 表。

`User` 模型 SHALL 包含以下字段：
- `id`: UUID 类型主键，默认值为 Python `uuid4`
- `username`: 字符串类型，非空且唯一
- `password_hash`: 字符串类型，非空
- `salt`: 字符串类型，非空
- `name`: 字符串类型，非空（用户昵称）
- `avatar`: 字符串类型，可为空
- `member_level`: 字符串类型，默认值为 "普通会员"
- `phone`: 字符串类型，可为空
- `created_at`: DateTime 类型，默认值为当前 UTC 时间

`Session` 模型 SHALL 包含以下字段：
- `id`: UUID 类型主键，默认值为 Python `uuid4`
- `user_id`: UUID 类型外键，关联 `users.id`，非空
- `token`: 字符串类型，非空且唯一
- `expires_at`: DateTime 类型，非空
- `created_at`: DateTime 类型，默认值为当前 UTC 时间

`Address` 模型 SHALL 包含以下字段：
- `id`: UUID 类型主键，默认值为 Python `uuid4`
- `user_id`: UUID 类型外键，关联 `users.id`，非空且建索引
- `name`: 字符串类型，非空（收件人姓名）
- `phone`: 字符串类型，非空（联系电话）
- `address`: Text 类型，非空（详细地址）
- `is_default`: Boolean 类型，默认值为 false

`User` 与 `Address` SHALL 通过 `relationship` 建立一对多关联，并配置 `cascade="all, delete-orphan"`。

#### Scenario: 表结构自动创建（含 addresses）
- **GIVEN** PostgreSQL 数据库已运行且可连接
- **WHEN** 调用 `Base.metadata.create_all(bind=engine)`
- **THEN** 数据库中创建 `users` 表、`sessions` 表和 `addresses` 表，且表结构与模型定义一致

#### Scenario: 表已存在时重复创建不报错
- **GIVEN** 数据库中已存在 `users`、`sessions` 和 `addresses` 表
- **WHEN** 再次调用 `Base.metadata.create_all(bind=engine)`
- **THEN** 不抛出异常，现有表结构保持不变

### Requirement: FastAPI 应用骨架
系统 SHALL 在 `backend/app/main.py` 中创建 FastAPI 应用实例，注册健康检查端点，并注册已实现的路由模块。

`GET /health` 端点 SHALL 返回 JSON 对象 `{"status": "ok"}`，HTTP 状态码 200。

FastAPI 应用 SHALL：
- 配置 CORS 中间件，允许所有来源的跨域请求
- 将 `db_router` 通过 `app.include_router()` 注册
- 将 `user_router` 通过 `app.include_router()` 注册
- 将 `redis_router` 通过 `app.include_router()` 注册
- 将 `product_router`、`cart_router`、`order_router` 通过 `app.include_router()` 注册
- 在 `app/main.py` 文件末尾提供 `if __name__ == "__main__"` 入口，使用 uvicorn 启动
- 后续新增的路由模块均通过 `include_router` 注册

#### Scenario: 健康检查返回正常
- **GIVEN** FastAPI 应用已启动
- **WHEN** 客户端请求 `GET /health`
- **THEN** 返回 HTTP 200，响应体为 `{"status": "ok"}`

#### Scenario: CORS 跨域请求被允许
- **GIVEN** FastAPI 应用已启动
- **WHEN** 客户端从不同域名发起跨域请求到 `/health`
- **THEN** 响应头包含正确的 CORS 头，请求不被浏览器拦截

#### Scenario: DB CRUD 路由可访问
- **GIVEN** FastAPI 应用已启动
- **WHEN** 客户端请求 `GET /api/db/users?page=1&size=5`
- **THEN** 请求被正确路由到 `db_router` 处理函数，返回分页用户数据

#### Scenario: Auth 路由可访问
- **GIVEN** FastAPI 应用已启动
- **WHEN** 客户端请求 `POST /api/auth/register`
- **THEN** 请求被正确路由到 `user_router` 注册端点处理函数

#### Scenario: Redis 路由可访问
- **GIVEN** FastAPI 应用已启动
- **WHEN** 客户端请求 `POST /api/redis/set`
- **THEN** 请求被正确路由到 `redis_router` 处理函数

### Requirement: Pydantic 认证与地址模型
系统 SHALL 在 `backend/app/schemas.py` 中新增以下 Pydantic 模型：

`RegisterRequest` SHALL 包含：`username`（str, 3-50 字符）、`password`（str, 6-128 字符）、`name`（str, 1-100 字符）、`phone`（Optional[str]）。

`LoginRequest` SHALL 包含：`username`（str）、`password`（str）。

`AuthResponse` SHALL 包含：`token`（str, UUID4 格式会话令牌）、`user`（UserResponse）。

`AddressCreate` SHALL 包含：`name`（str）、`phone`（str）、`address`（str）、`is_default`（bool, 默认 false）。

`AddressUpdate` SHALL 包含：`name`、`phone`、`address`、`is_default` 四个字段，全部 Optional。

`AddressResponse` SHALL 包含：`id`（str）、`user_id`（str）、`name`（str）、`phone`（str）、`address`（str）、`is_default`（bool）。

#### Scenario: RegisterRequest 密码长度校验
- **GIVEN** FastAPI 应用已启动
- **WHEN** 客户端发送 `POST /api/auth/register`，密码字段为 `"12"`（少于 6 字符）
- **THEN** 返回 HTTP 422，响应体包含密码长度校验失败详情

### Requirement: 业务模型扩展
系统 SHALL 在 `backend/app/models.py` 中新增以下 ORM 模型：

`Product` 模型 SHALL 包含：id（str PK）、name、price（Numeric）、image_url、stock（int）、category（str）。

`Order` 模型 SHALL 包含：id（UUID PK）、user_id（FK→users.id CASCADE）、order_no（str 唯一）、status（str 默认 'pending'）、total_amount（Numeric）、created_at（DateTime）。包含与 OrderItem 的 relationship。

`OrderItem` 模型 SHALL 包含：id（UUID PK）、order_id（FK→orders.id CASCADE）、product_id、product_name、product_image、quantity（int）、price（Numeric）。

`CartItem` ORM 模型 SHALL 包含：id（UUID PK）、user_id（FK→users.id CASCADE）、product_id、product_name、spec、price（Numeric）、quantity（int）、image_url、selected（bool）。

#### Scenario: 新增模型建表
- **GIVEN** PostgreSQL 可连接
- **WHEN** `Base.metadata.create_all()`
- **THEN** 创建 products / orders / order_items / cart_items 表

### Requirement: 业务路由注册
系统 SHALL 在 `backend/app/main.py` 中将 `product_router`、`cart_router`、`order_router` 通过 `app.include_router()` 注册。

FastAPI 应用 SHALL 更新 include_router 列表包含 product_router、cart_router、order_router。

### Requirement: Pydantic 业务模型
系统 SHALL 在 `backend/app/schemas.py` 中新增：`ProductResponse`、`ProductListResponse`、`CartItemCreate`、`CartItemUpdate`、`CartItemResponse`、`CheckoutResponse`、`OrderItemResponse`、`OrderResponse` Pydantic 模型。

### Requirement: Faker 业务数据填充
系统 SHALL 修改 `backend/app/seed.py`：
- 导入 50 个商品名称生成 Product 记录
- 为部分用户生成购物车数据（随机 2-5 件）
- 生成订单及对应 OrderItem（混合 5 种状态）

#### Scenario: seed 后业务表有数据
- **GIVEN** 数据库可连接
- **WHEN** 运行 seed.py
- **THEN** products 表有 50 条记录，cart_items 有 10-15 条，orders 有 5-8 条
