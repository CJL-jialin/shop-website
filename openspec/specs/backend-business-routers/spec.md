## ADDED Requirements

### Requirement: 商品路由（product_router）
系统 SHALL 在 `backend/app/routers/product_router.py` 中实现商品路由，使用 `APIRouter(prefix="/api/products", tags=["Products"])`。

`GET /api/products` SHALL：
- 接受 `page`（int, 默认 1, 最小 1）、`size`（int, 默认 10, 最小 1, 最大 50）
- 从 products 表分页查询
- 返回 `{"products": [...], "total": N}`

#### Scenario: 查询第一页商品
- **GIVEN** 数据库中有 50 个商品
- **WHEN** `GET /api/products?page=1&size=10`
- **THEN** 返回 10 个商品，total 为 50

### Requirement: 购物车路由（cart_router）
系统 SHALL 在 `backend/app/routers/cart_router.py` 中实现购物车路由，使用 `APIRouter(prefix="/api/cart", tags=["Cart"])`。

所有端点 SHALL 依赖 `get_current_user`（需登录）。

`GET /api/cart` SHALL：返回当前用户的购物车商品列表

`POST /api/cart/add` SHALL：
- 接收 `product_id`、`name`、`spec`、`price`、`image_url`
- 同品同规格累加 quantity
- 返回更新后的购物车列表

`PUT /api/cart/{item_id}` SHALL：更新 quantity（1 ≤ qty ≤ stock）或 selected 状态

`DELETE /api/cart/{item_id}` SHALL：删除购物车单品

`POST /api/cart/checkout` SHALL：将已选商品转为订单，清空已选购物车项，返回新订单信息

#### Scenario: 已选商品结算生成订单
- **GIVEN** 用户购物车有 2 件已选商品
- **WHEN** `POST /api/cart/checkout`
- **THEN** 返回 201 + 订单信息，购物车已选项被清空

### Requirement: 订单路由（order_router）
系统 SHALL 在 `backend/app/routers/order_router.py` 中实现订单路由，使用 `APIRouter(prefix="/api/orders", tags=["Orders"])`。

所有端点 SHALL 依赖 `get_current_user`。

`GET /api/orders` SHALL：
- 接受 `status`（str, 可选，筛选订单状态）
- 返回当前用户的订单列表（按创建时间降序）

#### Scenario: 按状态筛选订单
- **GIVEN** 用户有 3 个 `pending` 状态订单和 2 个 `paid` 状态订单
- **WHEN** `GET /api/orders?status=pending`
- **THEN** 返回 3 个订单

### Requirement: Order + OrderItem ORM 模型
系统 SHALL 在 `backend/app/models.py` 中新增：

`Order` 模型 SHALL 包含：id（UUID PK）、user_id（FK→users.id）、order_no（str 唯一）、status（str，默认 pending）、total_amount（Numeric）、created_at（DateTime）

`OrderItem` 模型 SHALL 包含：id（UUID PK）、order_id（FK→orders.id）、product_id、product_name、product_image、quantity（int）、price（Numeric）

#### Scenario: 订单与订单项关联
- **GIVEN** 订单 `o1` 有 2 条 OrderItem
- **WHEN** 查询 `o1.order_items`
- **THEN** 返回 2 条 OrderItem

### Requirement: Product ORM 模型
系统 SHALL 在 `backend/app/models.py` 中新增 `Product` ORM 模型，包含：id（str PK）、name、price（Numeric）、image_url、stock（int）、category（str）。

#### Scenario: 商品表自动创建
- **GIVEN** PostgreSQL 可连接
- **WHEN** `Base.metadata.create_all()`
- **THEN** 创建 products 表
