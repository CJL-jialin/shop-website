## ADDED Requirements

### Requirement: Pydantic 数据校验模型
系统 SHALL 在 `backend/app/schemas.py` 中使用 Pydantic 定义以下数据模型：

`UserCreate` — 创建用户请求体，SHALL 包含：
- `username`: `str`，必填，最小长度 1，最大长度 50
- `name`: `str`，必填，最小长度 1，最大长度 100
- `phone`: `str | None`，可选，最大长度 20
- `avatar`: `str | None`，可选
- `member_level`: `str`，可选，默认值为 `"普通会员"`

`UserUpdate` — 修改用户请求体，所有字段 SHALL 为可选：
- `name`: `str | None`，可选，最大长度 100
- `phone`: `str | None`，可选，最大长度 20
- `avatar`: `str | None`，可选
- `member_level`: `str | None`，可选，最大长度 20

`UserResponse` — 用户响应体，SHALL 包含：
- `id`: `str`（UUID 字符串格式）
- `username`: `str`
- `name`: `str`
- `avatar`: `str | None`
- `member_level`: `str`
- `phone`: `str | None`
- `created_at`: `str`（ISO 8601 格式的 datetime 字符串）

`UserListResponse` — 分页列表响应体，SHALL 包含：
- `users`: `list[UserResponse]`
- `total`: `int`（总记录数）

#### Scenario: 合法创建请求校验通过
- **GIVEN** FastAPI 应用已启动
- **WHEN** 客户端发送 `POST /api/db/users`，请求体为 `{"username": "hello123", "name": "王小明"}`
- **THEN** Pydantic 校验通过，数据传递给路由函数

#### Scenario: 缺少必填字段时返回 422
- **GIVEN** FastAPI 应用已启动
- **WHEN** 客户端发送 `POST /api/db/users`，请求体缺少 `username` 字段
- **THEN** 返回 HTTP 422，响应体包含校验失败详情

### Requirement: 查询用户列表（GET /api/db/users）
系统 SHALL 提供 `GET /api/db/users` 端点，返回分页用户列表。

该端点 SHALL：
- 接受查询参数 `page`（int，默认 1，最小 1）、`size`（int，默认 20，最小 1，最大 100）、`q`（str，可选，用于按用户名模糊搜索）
- 当 `q` 为空或未提供时，返回所有用户
- 当 `q` 有值时，返回 `username` 包含该字符串（大小写不敏感）的用户
- 返回 `UserListResponse`：`{"users": [...], "total": N}`

#### Scenario: 查询第一页用户列表
- **GIVEN** 数据库中有 10 个用户
- **WHEN** 客户端请求 `GET /api/db/users?page=1&size=5`
- **THEN** 返回 HTTP 200，`users` 数组长度为 5，`total` 为 10

#### Scenario: 按用户名模糊搜索
- **GIVEN** 数据库中有用户 `zhangsan`、`lisi`、`zhangwei`
- **WHEN** 客户端请求 `GET /api/db/users?q=zhang`
- **THEN** 返回 HTTP 200，`users` 数组包含 `zhangsan` 和 `zhangwei`，不包含 `lisi`

#### Scenario: 搜索无匹配时返回空数组
- **GIVEN** 数据库中没有用户名包含 `xyznotexist` 的用户
- **WHEN** 客户端请求 `GET /api/db/users?q=xyznotexist`
- **THEN** 返回 HTTP 200，`users` 为空数组，`total` 为 0

#### Scenario: 超出页码范围时返回空数组
- **GIVEN** 数据库中有 10 个用户
- **WHEN** 客户端请求 `GET /api/db/users?page=100&size=20`
- **THEN** 返回 HTTP 200，`users` 为空数组，`total` 为 10

### Requirement: 新增用户（POST /api/db/users）
系统 SHALL 提供 `POST /api/db/users` 端点，创建新用户。

该端点 SHALL：
- 接受 `UserCreate` JSON 请求体
- 为 `password_hash` 和 `salt` 自动填充占位假值（本阶段不处理加密）
- 为新用户生成 UUID 主键
- 将新用户写入数据库并提交事务
- 返回 HTTP 201 和 `UserResponse`

#### Scenario: 成功创建用户
- **GIVEN** 数据库可连接
- **WHEN** 客户端发送 `POST /api/db/users`，请求体为 `{"username": "newuser", "name": "新用户"}`
- **THEN** 返回 HTTP 201，响应体包含新用户的 `id`、`username: "newuser"`、`name: "新用户"`，`member_level` 为 "普通会员"

#### Scenario: 用户名重复时返回 409
- **GIVEN** 数据库中已存在 `username` 为 `zhangsan` 的用户
- **WHEN** 客户端发送 `POST /api/db/users`，请求体 `{"username": "zhangsan", "name": "重复用户"}`
- **THEN** 返回 HTTP 409，响应体包含错误提示信息

### Requirement: 修改用户信息（PUT /api/db/users/{user_id}）
系统 SHALL 提供 `PUT /api/db/users/{user_id}` 端点，部分更新用户信息。

该端点 SHALL：
- 接受 URL 路径参数 `user_id`（UUID 字符串）
- 接受 `UserUpdate` JSON 请求体
- 仅更新请求体中包含的非 None 字段
- 将更新写入数据库并提交事务
- 返回 HTTP 200 和更新后的 `UserResponse`

#### Scenario: 成功修改用户名
- **GIVEN** 数据库中存在用户 `user_id = X`，当前 `name = "旧名字"`
- **WHEN** 客户端发送 `PUT /api/db/users/X`，请求体 `{"name": "新名字"}`
- **THEN** 返回 HTTP 200，响应体中 `name` 为 "新名字"，其他字段保持不变

#### Scenario: 用户不存在时返回 404
- **GIVEN** 数据库中不存在 `user_id = 00000000-0000-0000-0000-000000000000` 的用户
- **WHEN** 客户端发送 `PUT /api/db/users/00000000-0000-0000-0000-000000000000`，请求体 `{"name": "新名字"}`
- **THEN** 返回 HTTP 404，响应体包含错误提示信息

### Requirement: 删除用户（DELETE /api/db/users/{user_id}）
系统 SHALL 提供 `DELETE /api/db/users/{user_id}` 端点，删除指定用户。

该端点 SHALL：
- 接受 URL 路径参数 `user_id`（UUID 字符串）
- 找到用户后删除，`commit()` 后返回 HTTP 204，无响应体
- 用户不存在时返回 HTTP 404

#### Scenario: 成功删除用户
- **GIVEN** 数据库中存在用户 `user_id = X`
- **WHEN** 客户端发送 `DELETE /api/db/users/X`
- **THEN** 返回 HTTP 204（空响应体），数据库中不再存在该用户

#### Scenario: 删除不存在的用户返回 404
- **GIVEN** 数据库中不存在 `user_id = 00000000-0000-0000-0000-000000000000` 的用户
- **WHEN** 客户端发送 `DELETE /api/db/users/00000000-0000-0000-0000-000000000000`
- **THEN** 返回 HTTP 404，响应体包含错误提示信息
