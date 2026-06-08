## Context

当前后端已具备数据库连接（database.py）和表模型（models.py），FastAPI 应用仅有 `/health` 端点。本次变更在此基础上新增 Pydantic 数据校验层（schemas.py）和 users 表 CRUD 路由（db_router.py），注册到 `/api/db` 前缀下。这是后端从"能跑"迈向"能提供服务"的第一步。

## Goals / Non-Goals

**Goals:**
- 设计 Pydantic 请求/响应模型，与 models.py 的 `User` ORM 类解耦
- 实现 GET/POST/PUT/DELETE 四个 REST 端点
- GET 端点支持按用户名模糊搜索和分页（page/size）
- PUT 端点支持部分字段更新（name、phone、avatar、member_level）
- 不存在的 user_id 返回 404
- 将路由注册到 main.py

**Non-Goals:**
- 不处理密码加密（POST 时存入假哈希值，留给 9.3）
- 不实现认证中间件
- 不实现 users 表以外的 CRUD

## Decisions

### Decision 1: Pydantic 模型从 ORM 分离，使用 `model_validate` 手动转换

**选择**: schemas.py 定义独立的 Pydantic 类（`UserCreate`、`UserUpdate`、`UserResponse`），在路由函数中手动调用 `User(**data.dict())` 或 `.model_dump()` 做 ORM ↔ Pydantic 转换。
**原因**: 保持简单可控，避免 SQLAlchemy `relationship` 字段导致的序列化循环引用。本阶段仅涉及 users 单表，手动转换代码量极少。
**替代方案**: 使用 `from_orm` / `model_config` 自动映射 — 当 model 有 relationship 到 sessions 时会触发懒加载错误，需要额外的 exclude 配置，当前场景过度。

### Decision 2: GET 端点通过 query params 传分页和搜索，不使用 path params

**选择**: `GET /api/db/users?page=1&size=20&q=zhang` — page 默认 1，size 默认 20，q 可选。
**原因**: 符合 REST 惯例，FastAPI 原生支持 Query 参数解析和校验，Swagger 文档自动生成交互表单。
**替代方案**: 将参数放入 path 如 `/api/db/users/page/1/size/20` — 顺序固定、不易扩展，被拒绝。

### Decision 3: PUT 端点使用 PATCH 语义（部分更新）

**选择**: `PUT /api/db/users/{user_id}` 接收 `UserUpdate`（所有字段可选），仅更新客户端传入的非 None 字段。
**原因**: REST 中最常见的更新模式是客户端只发想改的字段。本阶段未引入 PATCH 方法，用 PUT 实现部分更新以简化路由数量。
**替代方案**: 严格 PUT（全量替换）— 要求客户端每次传所有字段，易造成数据丢失（如忘记传 phone 则清空），被拒绝。

### Decision 4: 路由文件放在 routers/ 目录，使用 APIRouter 前缀

**选择**: `db_router.py` 创建 `APIRouter(prefix="/api/db", tags=["DB CRUD"])`，main.py 中以 `app.include_router(router)` 注册。router 内部路径去掉前缀，如 `@router.get("/users")`。
**原因**: 模块化路由是 FastAPI 推荐模式，每个 router 文件自包含。未来新增 user_router、redis_router 时互不干扰。
**替代方案**: 所有端点直接写在 main.py 的 `app.get()/app.post()` 上 — 路由多了后 main.py 膨胀，被拒绝。

## Risks / Trade-offs

- **无认证保护**: 当前 CRUD 端点无需登录即可访问，任何人可增删改用户数据。→ 9.3 完成后在 deps.py 添加 `get_current_user` 依赖注入保护端点。
- **PUT 忽略未知字段**: 若客户端传入模型中不存在的字段（如 `is_admin`），当前实现会静默忽略而非报错。→ 后续可加 `model_config = {"extra": "forbid"}` 拒绝未知字段。
- **DELETE 级联删除**: sessions 表已配置 `ondelete="CASCADE"`，删除用户时会连带删除其所有会话记录。→ 这是预期行为，但调用方需知晓此副作用。
