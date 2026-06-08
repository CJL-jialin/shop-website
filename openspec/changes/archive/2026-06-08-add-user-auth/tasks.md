## Phase 1: 基础设施扩展

- [x] 1.1 修改 `backend/requirements.txt`：新增 `bcrypt>=4.0.0` 依赖
- [x] 1.2 修改 `backend/app/models.py`：新增 `Address` ORM 模型（id, user_id FK, name, phone, address TEXT, is_default），在 User 类中添加 addresses relationship
- [x] 1.3 修改 `backend/app/schemas.py`：新增 `RegisterRequest`、`LoginRequest`、`AuthResponse`、`AddressCreate`、`AddressUpdate`、`AddressResponse` Pydantic 模型

## Phase 2: 认证工具与依赖注入

- [x] 2.1 创建 `backend/app/utils/auth.py`：实现 `generate_salt()`、`hash_password()`、`verify_password()` 三个 bcrypt 函数，以及 `create_session(db, user_id)` 函数
- [x] 2.2 创建 `backend/app/utils/deps.py`：实现 `get_current_user` FastAPI 依赖注入函数（从 Authorization Header 提取 Bearer Token → 查 sessions 表验证有效期 → 查 users 表返回 User）

## Phase 3: 认证与用户业务路由

- [x] 3.1 创建 `backend/app/routers/user_router.py`：实现 `POST /api/auth/register` 注册端点（重名 409 + bcrypt 加密 + 自动登录返回 token）
- [x] 3.2 实现 `POST /api/auth/login` 登录端点（查用户 → verify_password → 创建 session → 返回 token）+ `POST /api/auth/logout` 登出端点（删除 session 记录）
- [x] 3.3 实现 `GET /api/user/profile` 和 `PUT /api/user/profile` 需认证端点
- [x] 3.4 实现 `GET/POST/PUT/DELETE /api/user/addresses` 地址管理端点（仅操作本人地址，默认地址互斥逻辑）

## Phase 4: 路由注册

- [x] 4.1 修改 `backend/app/main.py`：导入 user_router 并通过 `app.include_router()` 注册

## Phase 5: 全链路验证

- [x] 5.1 安装 bcrypt 依赖，启动 FastAPI，curl 验证：注册 → 拿到 token → GET profile → PUT profile → logout → 确认 token 失效 → login → 拿到新 token → 地址 CRUD（新增/查询/修改/删除）
