## Why

当前 users 表已有数据但对所有人开放读写（任何人均可增删改查），缺乏身份认证机制。本次变更为系统引入 bcrypt 密码加密的注册/登录/登出流程、Bearer Token 会话认证、以及需登录才能访问的用户资料与地址管理端点，构建完整的用户认证体系。

## What Changes

- 新增 `backend/app/utils/auth.py`：bcrypt 密码哈希工具（generate_salt、hash_password、verify_password）+ session 创建函数
- 新增 `backend/app/utils/deps.py`：FastAPI 依赖注入函数 `get_current_user`，从 Authorization Header 提取 Bearer Token 并解析当前登录用户
- 新增 `backend/app/routers/user_router.py`：`/api/auth/register`、`/api/auth/login`、`/api/auth/logout` 端点 + `/api/user/profile`、`/api/user/addresses` 受保护端点
- 修改 `backend/app/schemas.py`：新增 RegisterRequest、LoginRequest、AuthResponse、AddressCreate、AddressUpdate、AddressResponse 等 Pydantic 模型
- 新增 `backend/app/models.py`：新增 `Address` ORM 模型（id, user_id, name, phone, address, is_default）
- 新增依赖：`bcrypt>=4.0.0`（加入 requirements.txt）
- 修改 `backend/app/main.py`：注册 user_router

## Capabilities

### New Capabilities

- `user-auth`: bcrypt 密码哈希 + 盐值生成、注册/登录/登出端点、Bearer Token 会话认证、get_current_user 依赖注入、用户资料与地址管理端点

### Modified Capabilities

- `db-setup`: models.py 新增 Address ORM 模型；main.py 新增 user_router 路由注册；schemas.py 新增认证与地址相关 Pydantic 模型

## Impact

- 新增文件：`backend/app/utils/auth.py`、`backend/app/utils/deps.py`、`backend/app/routers/user_router.py`
- 修改文件：`backend/app/schemas.py`（新增 6+ 个 Pydantic 模型）、`backend/app/models.py`（新增 Address 表）、`backend/app/main.py`（新增 include_router）、`backend/requirements.txt`（新增 bcrypt）
- 现有端点无影响：`/api/db/users` 仍对所有人开放（后续 9.4 可加固）
- 现有前端：无影响

## Out of Scope

- Redis session 缓存（留给 9.4）
- Docker + Nginx 部署（留给 9.6）
- 现有 `/api/db/users` 端点的认证加固（可通过 Depends(get_current_user) 后续快速修复）
- JWT Token 方案（本次使用数据库 session + UUID token，足够课堂作业演示）
- 前端对接
