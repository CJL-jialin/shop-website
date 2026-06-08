## Context

当前前端用 Zustand + mock 数据独立运行，后端有完整 REST API（9.1-9.4）。本次变更对接两端：前端 store 改为 `fetch()` 调用后端，后端新增商品/购物车/订单路由，最后用 Docker Compose + Nginx 统一部署为可从浏览器访问的全栈应用。

## Goals / Non-Goals

**Goals:**
- 前端创建统一 API 客户端（base URL + auth token 管理）
- 前端 Zustand stores 从 mock 切换为 API 调用
- 后端新增 product_router / cart_router / order_router
- 后端新增 Order + OrderItem ORM 模型
- Docker Compose 一键启动 Nginx + FastAPI + PostgreSQL + Redis
- Nginx 配置：前端静态文件（`/`） + API 反向代理（`/api/*`）

**Non-Goals:**
- 前端 UI 组件不改动
- 结算后生成订单的完整流程（只做购物车 checkout API）
- HTTPS/TLS
- CI/CD 流水线

## Decisions

### Decision 1: 前端 API 客户端使用单例模式

**选择**: `src/api/client.ts` 导出一个 `apiClient` 对象，包含 `get/post/put/del` 方法和自动附加 Authorization Header。
**原因**: 所有 store 共享同一个 API 基础地址和 token——单例避免重复配置。fetch 封装统一处理 JSON 序列化/反序列化和错误抛出。
**替代方案**: 每个 store 自己写 fetch — 重复代码，token 管理混乱。

### Decision 2: API 基础地址通过环境变量配置

**选择**: 开发模式用 Vite proxy（`/api` → `localhost:8000`），生产模式用 Nginx 反向代理（同域 `/api`）。前端代码统一用相对路径 `/api/...`，不写死完整 URL。
**原因**: 一套代码适配两种部署环境，无需区分 dev/prod 分支。
**替代方案**: 写死 `http://localhost:8000/api` — 生产环境不可用，被拒绝。

### Decision 3: Token 存储在 localStorage

**选择**: 登录/注册成功后 token 存入 `localStorage.setItem('auth_token', token)`，`apiClient` 每次请求从 localStorage 读取。
**原因**: 页面刷新后 token 不丢失，无需重复登录。简单可控。
**替代方案**: sessionStorage — 标签页关闭即失效；Cookie — 需后端配合 Set-Cookie。

### Decision 4: 后端业务路由遵循既有模式

**选择**: product_router / cart_router / order_router 各使用独立 `APIRouter(prefix="/api/...", tags=[...])`，Pydantic 模型定义在 schemas.py 中。
**原因**: 与 db_router / user_router / redis_router 保持一致风格，模块化注册。
**替代方案**: 合并到一个 router — 文件过长，不模块化。

### Decision 5: Docker Compose 四服务编排

**选择**: Nginx（:80 对外）+ FastAPI（:8000 内网）+ PostgreSQL（:5432 内网）+ Redis（:6379 内网），通过 Docker 内置网络通信。
**原因**: 经典单机部署架构，一键启动，适合课堂演示。
**替代方案**: 拆分为多个 compose 文件 — 过度设计。

### Decision 6: Nginx 作为唯一对外入口

**选择**: Nginx 监听 80 端口，`location /` 返回前端静态文件，`location /api/` 代理到 FastAPI 容器。浏览器只与 Nginx 通信。
**原因**: 单一入口，无需 CORS 配置，避免跨域问题。
**替代方案**: 前端 Vite dev server 直连后端 + CORS — 开发模式可以，生产不适用。

## Risks / Trade-offs

- **localStorage XSS 风险**: token 存储在 localStorage 可被 XSS 读取。→ 课堂作业场景可接受，生产环境建议 httpOnly Cookie。
- **购物车未登录状态**: 当前购物车依赖 `get_current_user` 鉴权，未登录用户无法使用。→ 后续可加"本地购物车 → 登录后合并"逻辑。
- **Docker 构建依赖网络**: `docker compose build` 需要下载基础镜像。→ 国内网络可能需要镜像加速器。
