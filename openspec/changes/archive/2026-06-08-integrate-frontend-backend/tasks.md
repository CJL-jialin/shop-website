## Phase 1: 前端 API 客户端

- [x] 1.1 创建 `my-shop-website/src/api/client.ts`：实现 `apiGet`/`apiPost`/`apiPut`/`apiDel` + `setToken`/`getToken`/`clearToken` + 自动附加 Authorization Header
- [x] 1.2 修改 `my-shop-website/vite.config.ts`：添加开发代理配置（`/api` → `http://localhost:8000`）

## Phase 2: 前端认证 Store

- [x] 2.1 创建 `my-shop-website/src/stores/useAuthStore.ts`：register/login/logout/fetchProfile 方法 + token/user 状态 + localStorage 同步

## Phase 3: 后端业务模型与路由

- [x] 3.1 修改 `backend/app/models.py`：新增 Product、Order、OrderItem、CartItem（ORM）四个 ORM 模型
- [x] 3.2 修改 `backend/app/schemas.py`：新增 ProductResponse、ProductListResponse、CartItemCreate、CartItemResponse、CartItemUpdate、OrderResponse、OrderItemResponse、CheckoutResponse Pydantic 模型
- [x] 3.3 创建 `backend/app/routers/product_router.py`：实现 `GET /api/products` 分页查询
- [x] 3.4 创建 `backend/app/routers/cart_router.py`：实现 GET/POST/PUT/DELETE + checkout 五个端点（需登录）
- [x] 3.5 创建 `backend/app/routers/order_router.py`：实现 `GET /api/orders?status=`（需登录）
- [x] 3.6 修改 `backend/app/seed.py`：新增 50 个产品 + 购物车假数据 + 订单假数据

## Phase 4: 前端 Store 重构（mock → API）

- [x] 4.1 重构 `my-shop-website/src/stores/useCartStore.ts`：初始空数组，通过 API 加载和操作购物车数据
- [x] 4.2 重构 `my-shop-website/src/stores/useUserStore.ts`：从 API 获取用户信息 + 地址
- [x] 4.3 重构 `my-shop-website/src/stores/useOrderStore.ts`：从 API 获取订单列表

## Phase 5: Docker 部署配置

- [x] 5.1 创建根目录 `docker-compose.yml`：Nginx + FastAPI + PostgreSQL + Redis 四服务编排
- [x] 5.2 创建 `nginx/nginx.conf`：前端静态文件（/） + API 反向代理（/api/*）
- [x] 5.3 创建 `.env.example`：DATABASE_URL / REDIS_URL / SECRET_KEY 环境变量模板

## Phase 6: 路由注册 + 全链路验证

- [x] 6.1 修改 `backend/app/main.py`：注册 product_router + cart_router + order_router
- [x] 6.2 启动 `docker compose up`，验证：首页访问 → 注册/登录 → 浏览商品 → 加购物车 → 结算 → 查看订单 → 地址管理
