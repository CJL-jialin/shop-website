## ADDED Requirements

### Requirement: bcrypt 密码哈希工具
系统 SHALL 在 `backend/app/utils/auth.py` 中实现密码加密工具模块，包含以下三个函数：

- `generate_salt()` SHALL 返回一个 16 字节的随机盐值字符串，每次调用生成不同的值
- `hash_password(password: str, salt: str) -> str` SHALL 将明文密码与盐值组合后使用 bcrypt 算法生成哈希值
- `verify_password(password: str, salt: str, stored_hash: str) -> bool` SHALL 使用相同的盐值和 bcrypt 算法验证输入密码是否匹配已存储的哈希值

此外，模块 SHALL 包含 `create_session(db, user_id) -> Session` 函数：
- 生成 UUID4 token，设置 7 天过期时间
- 写入 sessions 表
- 同步调用 `redis_set(f"session:{token}", user_json, 604800)` 写入 Redis 缓存
- Redis 写入失败时不抛异常（缓存降级）
- 返回 Session 对象

#### Scenario: 相同密码相同盐值生成相同哈希
- **GIVEN** 盐值为固定值 `s`
- **WHEN** 对密码 `"mypassword"` 调用两次 `hash_password("mypassword", s)`
- **THEN** 两次返回的哈希值完全相同

#### Scenario: 不同盐值生成不同哈希
- **GIVEN** 两个不同的随机盐值 `s1` 和 `s2`
- **WHEN** 对相同密码 `"mypassword"` 分别用 `s1` 和 `s2` 调用 `hash_password`
- **THEN** 两次返回的哈希值不同

#### Scenario: 验证密码匹配成功
- **GIVEN** 盐值 `s` 和 `hash = hash_password("correct", s)`
- **WHEN** 调用 `verify_password("correct", s, hash)`
- **THEN** 返回 `True`

#### Scenario: 验证密码匹配失败
- **GIVEN** 盐值 `s` 和 `hash = hash_password("correct", s)`
- **WHEN** 调用 `verify_password("wrong", s, hash)`
- **THEN** 返回 `False`

### Requirement: 用户注册端点（POST /api/auth/register）
系统 SHALL 提供 `POST /api/auth/register` 端点，接收以下 JSON 请求体：
- `username`: `str`，必填，3-50 字符
- `password`: `str`，必填，6-128 字符
- `name`: `str`，必填，1-100 字符
- `phone`: `str | None`，可选

端点行为 SHALL：
- 检查 `username` 是否已存在，若存在返回 HTTP 409 `{"detail": "用户名已存在"}`
- 生成随机盐值，调用 `hash_password` 计算密码哈希
- 创建 User 记录（password_hash 和 salt 填入真值，不再使用占位假值）
- 调用 `create_session` 创建会话记录（注册即登录）
- 返回 HTTP 201，响应体包含 `{"token": "<uuid4>", "user": UserResponse}`

#### Scenario: 成功注册新用户
- **GIVEN** 数据库中不存在 `username = "newuser123"`
- **WHEN** 客户端发送 `POST /api/auth/register`，请求体为 `{"username": "newuser123", "password": "secret123", "name": "新用户"}`
- **THEN** 返回 HTTP 201，响应体包含 `token` 字段（UUID4 格式）和 `user` 对象（username=newuser123, name=新用户）

#### Scenario: 用户名已存在返回 409
- **GIVEN** 数据库中已存在 `username = "zhangsan"`
- **WHEN** 客户端发送 `POST /api/auth/register`，请求体为 `{"username": "zhangsan", "password": "secret123", "name": "重复"}`
- **THEN** 返回 HTTP 409，响应体为 `{"detail": "用户名已存在"}`

#### Scenario: 缺少必填字段返回 422
- **GIVEN** FastAPI 应用已启动
- **WHEN** 客户端发送 `POST /api/auth/register`，请求体缺少 `password` 字段
- **THEN** 返回 HTTP 422

### Requirement: 用户登录端点（POST /api/auth/login）
系统 SHALL 提供 `POST /api/auth/login` 端点，接收以下 JSON 请求体：
- `username`: `str`，必填
- `password`: `str`，必填

端点行为 SHALL：
- 按 `username` 查询 users 表，查不到返回 HTTP 401 `{"detail": "用户名或密码错误"}`
- 取出 `salt` 和 `password_hash`，调用 `verify_password` 比对
- 比对失败返回 HTTP 401 `{"detail": "用户名或密码错误"}`
- 比对成功创建新 session 记录，返回 HTTP 200 `{"token": "<uuid4>", "user": UserResponse}`

#### Scenario: 使用正确密码登录
- **GIVEN** 数据库中已存在注册用户 `username = "testuser"`, `password = "correct"`
- **WHEN** 客户端发送 `POST /api/auth/login`，请求体为 `{"username": "testuser", "password": "correct"}`
- **THEN** 返回 HTTP 200，响应体包含 `token` 和 `user` 对象

#### Scenario: 使用错误密码登录返回 401
- **GIVEN** 数据库中已存在注册用户 `username = "testuser"`
- **WHEN** 客户端发送 `POST /api/auth/login`，请求体为 `{"username": "testuser", "password": "wrongpassword"}`
- **THEN** 返回 HTTP 401，响应体为 `{"detail": "用户名或密码错误"}`

#### Scenario: 用户名不存在返回 401
- **GIVEN** 数据库中不存在 `username = "nonexistent"`
- **WHEN** 客户端发送 `POST /api/auth/login`，请求体为 `{"username": "nonexistent", "password": "any"}`
- **THEN** 返回 HTTP 401，响应体为 `{"detail": "用户名或密码错误"}`（与密码错误同一模糊提示）

### Requirement: 用户登出端点（POST /api/auth/logout）
系统 SHALL 提供 `POST /api/auth/logout` 端点，从请求头 `Authorization: Bearer <token>` 中提取 token。

端点行为 SHALL：
- 若请求头缺少 `Authorization` 或格式非 `Bearer <token>`，返回 HTTP 401
- 在 sessions 表中查找 token，找到则删除该记录
- 同步调用 `redis_delete(f"session:{token}")` 清理 Redis 缓存（Redis 不可用时静默跳过）
- 返回 HTTP 200 `{"detail": "已登出"}`
- token 不存在则返回 HTTP 401

#### Scenario: 有效 token 登出成功
- **GIVEN** sessions 表中存在 `token = "valid-token-uuid"`
- **WHEN** 客户端发送 `POST /api/auth/logout`，请求头为 `Authorization: Bearer valid-token-uuid`
- **THEN** 返回 HTTP 200，sessions 表中该 token 记录被删除，Redis 中对应缓存也被清理

#### Scenario: 无效 token 返回 401
- **GIVEN** sessions 表中不存在 `token = "invalid-token"`
- **WHEN** 客户端发送 `POST /api/auth/logout`，请求头为 `Authorization: Bearer invalid-token`
- **THEN** 返回 HTTP 401

### Requirement: 认证依赖注入（get_current_user）
系统 SHALL 在 `backend/app/utils/deps.py` 中实现 `get_current_user` 函数，供 FastAPI 路由作为依赖项使用。

该函数 SHALL：
- 从请求头 `Authorization: Bearer <token>` 中提取 token
- 优先调用 `redis_get(f"session:{token}")` 从 Redis 读取缓存
- Redis 命中：解析 JSON 获取 `user_id`，查 users 表返回 User 对象
- Redis 未命中或不可用：回退到查询 sessions 表
  - sessions 表中找到且未过期：查 users 表返回 User 对象，并调用 `redis_set` 回写 Redis（续期 TTL 604800 秒）
  - session 不存在或已过期：返回 HTTP 401 `{"detail": "未登录或 token 已过期"}`
- 若 user 不存在（可能被删除），返回 HTTP 401

#### Scenario: 有效 Bearer Token（Redis 命中）返回用户
- **GIVEN** Redis 中存在 `session:t123`，value 包含有效 user_id
- **WHEN** 路由函数通过 `Depends(get_current_user)` 依赖注入，请求头为 `Authorization: Bearer t123`
- **THEN** 函数参数 `current_user` 被注入为对应的 User 对象（从 Redis 缓存读取）

#### Scenario: Redis 未命中但 DB 有效返回用户
- **GIVEN** Redis 中不存在 `session:t789`，但 sessions 表中有未过期的该 token
- **WHEN** 客户端携带 `Authorization: Bearer t789`
- **THEN** 返回 HTTP 200，且 `session:t789` 被回写至 Redis

#### Scenario: 缺少 Authorization 头返回 401
- **GIVEN** FastAPI 应用已启动
- **WHEN** 需要认证的端点被请求但未携带 `Authorization` 头
- **THEN** 返回 HTTP 401

#### Scenario: Token 已过期返回 401
- **GIVEN** sessions 表中 token `"t456"` 的 `expires_at` 小于当前时间
- **WHEN** 客户端携带 `Authorization: Bearer t456` 请求需要认证的端点
- **THEN** 返回 HTTP 401 `{"detail": "未登录或 token 已过期"}`

### Requirement: 用户资料端点（GET/PUT /api/user/profile）
系统 SHALL 提供以下需认证的用户资料端点：

`GET /api/user/profile` SHALL：
- 依赖 `get_current_user` 获取当前用户
- 返回当前用户的 `UserResponse`

`PUT /api/user/profile` SHALL：
- 依赖 `get_current_user` 获取当前用户
- 接收 `UserUpdate` JSON 请求体（name, phone, avatar, member_level 均可选）
- 仅更新传入的非 None 字段
- 返回更新后的 `UserResponse`

#### Scenario: 获取自己的资料
- **GIVEN** 用户 `u1` 已登录，token 有效
- **WHEN** 客户端携带 `Authorization: Bearer <token>` 请求 `GET /api/user/profile`
- **THEN** 返回 HTTP 200，响应体为 `u1` 的 UserResponse

#### Scenario: 修改自己的昵称
- **GIVEN** 用户 `u1` 当前 `name = "旧名"`
- **WHEN** 客户端发送 `PUT /api/user/profile`，请求体 `{"name": "新名"}`
- **THEN** 返回 HTTP 200，响应体 `name = "新名"`，其他字段不变

#### Scenario: 未登录请求返回 401
- **GIVEN** 客户端未携带 Authorization 头
- **WHEN** 客户端请求 `GET /api/user/profile`
- **THEN** 返回 HTTP 401

### Requirement: 收货地址管理端点
系统 SHALL 在 `backend/app/models.py` 中新增 `Address` ORM 模型，包含字段：id（UUID PK）、user_id（FK→users.id）、name、phone、address（TEXT）、is_default（bool，默认 false）。

系统 SHALL 提供以下需认证的地址管理端点：

`GET /api/user/addresses` SHALL：
- 依赖 `get_current_user` 获取当前用户
- 返回当前用户的所有地址列表（按 is_default 降序排列）

`POST /api/user/addresses` SHALL：
- 接收 `name`、`phone`、`address` 字段（`is_default` 可选，默认 false）
- 若 `is_default = true`，先将用户其他地址的 `is_default` 设为 false
- 创建新地址记录（user_id 从 token 获取）
- 返回 HTTP 201 和新创建的地址

`PUT /api/user/addresses/{address_id}` SHALL：
- 仅更新当前用户自己的地址（address_id 对应的 user_id 必须等于 current_user.id）
- 不属于当前用户的地址返回 404
- 更新传入的非 None 字段

`DELETE /api/user/addresses/{address_id}` SHALL：
- 仅删除当前用户自己的地址
- 成功返回 204

#### Scenario: 查询自己的地址列表
- **GIVEN** 用户 `u1` 有 3 条地址
- **WHEN** 客户端携带 `u1` 的 token 请求 `GET /api/user/addresses`
- **THEN** 返回 HTTP 200，数组长度为 3

#### Scenario: 新增默认地址
- **GIVEN** 用户 `u1` 已有 2 条地址，其中 1 条为默认
- **WHEN** 客户端发送 `POST /api/user/addresses`，请求体 `{"name": "新地址", "phone": "138...", "address": "...", "is_default": true}`
- **THEN** 返回 HTTP 201，旧默认地址的 `is_default` 变为 false，新地址 `is_default` 为 true

#### Scenario: 不能修改其他用户的地址
- **GIVEN** 地址 `a1` 属于用户 `u1`，当前登录用户为 `u2`
- **WHEN** 客户端携带 `u2` 的 token 发送 `PUT /api/user/addresses/{a1_id}`
- **THEN** 返回 HTTP 404
