## Phase 1: Pydantic 数据校验模型

- [x] 1.1 创建 `backend/app/schemas.py`：定义 `UserCreate`（username 必填 + name 必填 + phone 可选 + avatar 可选 + member_level 默认值）
- [x] 1.2 在 schemas.py 中定义 `UserUpdate`（所有字段可选：name, phone, avatar, member_level）
- [x] 1.3 在 schemas.py 中定义 `UserResponse`（输出字段：id, username, name, avatar, member_level, phone, created_at）和 `UserListResponse`（users 列表 + total 总数）

## Phase 2: DB_router CRUD 端点

- [x] 2.1 创建 `backend/app/routers/db_router.py`：实现 `GET /users` 端点，支持 `?page=&size=&q=` 分页搜索，返回 `UserListResponse`
- [x] 2.2 实现 `POST /users` 端点：接收 `UserCreate`，校验用户名唯一性（重复返回 409），生成 password_hash/salt 占位假值，返回 201 + `UserResponse`
- [x] 2.3 实现 `PUT /users/{user_id}` 端点：接收 `UserUpdate`，仅更新非 None 字段，用户不存在返回 404
- [x] 2.4 实现 `DELETE /users/{user_id}` 端点：删除用户，不存在返回 404，成功返回 204

## Phase 3: 路由注册

- [x] 3.1 修改 `backend/app/main.py`：导入 db_router，通过 `app.include_router()` 注册到 `/api/db` 前缀

## Phase 4: 接口验证

- [x] 4.1 启动 FastAPI，使用 curl 依次验证 GET（查所有）→ POST（新增用户）→ GET（确认新增）→ PUT（修改名字）→ GET（确认修改）→ DELETE（删除）→ GET（确认删除）
