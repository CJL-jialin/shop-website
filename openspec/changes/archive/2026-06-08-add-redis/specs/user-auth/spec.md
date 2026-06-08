## MODIFIED Requirements

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
