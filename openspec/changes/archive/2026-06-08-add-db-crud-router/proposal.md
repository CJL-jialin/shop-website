## Why

上一阶段已完成数据库连接与表结构定义，但尚无任何 HTTP API 可以操作数据。本次变更在已有基础上封装 users 表的增删改查（CRUD）路由，让外部客户端可以通过标准 REST API 访问和操作数据库中的用户数据。

## What Changes

- 新增 `backend/app/schemas.py`：用 Pydantic 定义 UserCreate、UserResponse、UserUpdate 请求/响应数据模型
- 新增 `backend/app/routers/db_router.py`：实现 users 表 CRUD 四个端点（GET 列表、POST 新增、PUT 修改、DELETE 删除），支持分页和模糊搜索
- 修改 `backend/app/main.py`：将 db_router 注册到 `/api/db` 前缀下

## Capabilities

### New Capabilities

- `db-crud-router`: Pydantic 数据校验模型（schemas.py）+ users 表 CRUD 路由（db_router.py），包含分页、模糊搜索、404 错误处理

### Modified Capabilities

- `db-setup`: main.py 新增 `app.include_router(db_router, prefix="/api/db")` 路由注册

## Impact

- 新增文件：`backend/app/schemas.py`、`backend/app/routers/db_router.py`
- 修改文件：`backend/app/main.py`（新增一组 `include_router` 调用）
- 新增依赖：无（Pydantic 已在 requirements.txt 中）
- 现有前端：无影响

## Out of Scope

- 密码加密与注册登录系统（留给 9.3）
- Redis 存储与提取路由（留给 9.4）
- 用户认证中间件（当前所有端点无需登录即可访问）
- users 表以外的业务表 CRUD（products、orders、cart 等）
- 前端对接
