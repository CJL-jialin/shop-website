## Why

前端目前使用 Zustand + mock 假数据独立运行，后端 FastAPI 已有完整 REST API。两端需要对接——前端通过 `fetch()` 调用后端 API 获取真实数据，并通过 Docker Compose 一键部署前后端 + 数据库 + Redis 全栈应用。本次变更是课堂作业 9.5（仓库上传）+ 9.6（Docker + Nginx 部署）的合并落地。

## What Changes

- **前端新增** `src/api/client.ts`：API 基础地址配置 + Bearer Token 管理（localStorage）+ fetch 包装函数
- **前端新增** `src/stores/useAuthStore.ts`：注册/登录/登出状态管理，替代直接调用 API
- **前端修改** `useCartStore`、`useUserStore`、`useOrderStore`：从 mock 数据切换为 API 调用
- **后端新增** `routers/product_router.py`：商品分页路由（GET /api/products）
- **后端新增** `routers/cart_router.py`：购物车 CRUD 路由
- **后端新增** `routers/order_router.py`：订单列表路由（GET /api/orders?status=）
- **后端修改** `models.py`：新增 Order、OrderItem ORM 模型
- **后端修改** `schemas.py`：新增商品、购物车、订单 Pydantic 模型
- **后端修改** `seed.py`：新增商品、购物车、订单 Faker 假数据
- **新增** `docker-compose.yml`：Nginx + FastAPI + PostgreSQL + Redis 四服务编排
- **新增** `nginx/nginx.conf`：前端静态文件 + `/api/*` 反向代理
- **修改** `vite.config.ts`：开发环境 API 代理配置

## Capabilities

### New Capabilities

- `api-client`: 前端 API 通信层（`src/api/client.ts`）—— 基础地址配置、Bearer Token 自动附加、fetch 封装
- `auth-store`: 前端认证状态管理（`src/stores/useAuthStore.ts`）—— 注册/登录/登出 + token localStorage 持久化
- `backend-business-routers`: 后端商品路由（product_router）、购物车路由（cart_router）、订单路由（order_router） + Order/OrderItem ORM 模型
- `docker-deploy`: Docker Compose 四服务编排（Nginx + FastAPI + PostgreSQL + Redis）+ Nginx 反向代理配置

### Modified Capabilities

- `cart-store`: 购物车数据从 mock 切换为 API fetch（getCart / addItem / removeItem / updateQuantity / checkout）
- `user-store`: 用户信息从 mock 切换为 API fetch（getProfile / getAddresses / createAddress / updateAddress / deleteAddress）
- `order-store`: 订单数据从 mock 切换为 API fetch（getOrders / ordersByStatus）
- `db-setup`: models.py 新增 Order/OrderItem；schemas.py 新增商品/购物车/订单模型；main.py 新增 product_router + cart_router + order_router 注册；seed.py 新增商品/购物车/订单假数据

## Impact

- 前端新增 2 文件、修改 3 个 store + 1 配置
- 后端新增 3 个 router 文件、修改 models.py / schemas.py / seed.py / main.py
- 新增 docker-compose.yml、nginx/nginx.conf
- 前端部署方式从 GitHub Pages 变为 Docker Nginx 静态托管
- 开发模式：`npm run dev` + Vite proxy → localhost:8000 后端
- 生产模式：`docker compose up` → localhost 访问全栈

## Out of Scope

- 前端组件 UI 改动（CartPage/HomePage/ProfilePage 等组件保持不变）
- 订单创建流程（结算后生成订单 → 后端 cart checkout 实现）
- HTTPS/TLS 证书配置
- CI/CD 自动部署流水线
- 支付系统集成
