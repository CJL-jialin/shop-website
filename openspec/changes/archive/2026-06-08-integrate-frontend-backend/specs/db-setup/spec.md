## MODIFIED Requirements

### Requirement: 数据库表结构定义
系统 SHALL 在 `backend/app/models.py` 中使用 SQLAlchemy ORM 定义以下模型类（在已有 User/Session/Address 基础上新增）：

`Product` 模型 SHALL 包含：id（str PK）、name、price（Numeric）、image_url、stock（int）、category（str）。

`Order` 模型 SHALL 包含：id（UUID PK）、user_id（FK→users.id CASCADE）、order_no（str 唯一）、status（str 默认 'pending'）、total_amount（Numeric）、created_at（DateTime）。包含与 OrderItem 的 relationship。

`OrderItem` 模型 SHALL 包含：id（UUID PK）、order_id（FK→orders.id CASCADE）、product_id、product_name、product_image、quantity（int）、price（Numeric）。

`CartItem` ORM 模型 SHALL 包含：id（UUID PK）、user_id（FK→users.id CASCADE）、product_id、product_name、spec、price（Numeric）、quantity（int）、image_url、selected（bool）。

#### Scenario: 新增模型建表
- **GIVEN** PostgreSQL 可连接
- **WHEN** `Base.metadata.create_all()`
- **THEN** 创建 products / orders / order_items / cart_items 表

### Requirement: FastAPI 应用骨架
系统 SHALL 在 `backend/app/main.py` 中将 `product_router`、`cart_router`、`order_router` 通过 `app.include_router()` 注册。

### Requirement: Pydantic 业务模型
系统 SHALL 在 `backend/app/schemas.py` 中新增：`ProductResponse`、`ProductListResponse`、`CartItemCreate`、`CartItemResponse`、`OrderResponse`、`OrderItemResponse` Pydantic 模型。

### Requirement: Faker 激活数据填充
系统 SHALL 修改 `backend/app/seed.py`：
- 导入前端 productNames 列表生成 50 个 Product
- 为 2-3 个用户生成购物车数据（随机 3-5 件）
- 生成 5-8 个订单（混合 5 种状态）及对应 OrderItem

#### Scenario: seed 后 products 表有数据
- **GIVEN** 数据库可连接
- **WHEN** 运行 seed.py
- **THEN** products 表有 50 条记录，cart_items 有 10-15 条，orders 有 5-8 条
