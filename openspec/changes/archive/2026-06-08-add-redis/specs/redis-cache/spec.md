## ADDED Requirements

### Requirement: Redis 客户端连接模块
系统 SHALL 在 `backend/app/utils/redis_client.py` 中实现 Redis 客户端模块。

该模块 SHALL：
- 从环境变量 `REDIS_URL` 读取 Redis 连接地址，默认值为 `redis://localhost:6379/0`
- 使用 `redis.Redis.from_url()` 创建 Redis 连接实例
- 导出 `redis_set(key: str, value: str, ttl_seconds: int) -> bool` 函数：写入键值对并设置过期时间，成功返回 True，Redis 不可用时捕获异常并返回 False
- 导出 `redis_get(key: str) -> str | None` 函数：按 key 读取值，key 不存在或 Redis 不可用时返回 None
- 导出 `redis_delete(key: str) -> int` 函数：删除一个 key，返回删除的数量（0 表示 key 不存在），Redis 不可用时返回 0

#### Scenario: 写入并读取键值对
- **GIVEN** Redis 服务已运行且可连接
- **WHEN** 调用 `redis_set("foo", "bar", 60)` 后调用 `redis_get("foo")`
- **THEN** `redis_set` 返回 True，`redis_get` 返回 `"bar"`

#### Scenario: 读取不存在的 key 返回 None
- **GIVEN** Redis 服务已运行且可连接
- **WHEN** 调用 `redis_get("nonexistent_key_xyz")`
- **THEN** 返回 None

#### Scenario: 删除存在的 key 返回 1
- **GIVEN** Redis 中已写入 `key = "del_test"`, `value = "x"`
- **WHEN** 调用 `redis_delete("del_test")`
- **THEN** 返回 1，且后续 `redis_get("del_test")` 返回 None

#### Scenario: 删除不存在的 key 返回 0
- **GIVEN** Redis 中不存在 `key = "no_such_key"`
- **WHEN** 调用 `redis_delete("no_such_key")`
- **THEN** 返回 0

#### Scenario: TTL 过期后 key 自动消失
- **GIVEN** Redis 服务已运行且可连接
- **WHEN** 调用 `redis_set("ttl_test", "value", 1)` 并等待 2 秒后调用 `redis_get("ttl_test")`
- **THEN** 返回 None

### Requirement: Redis 演示路由（redis_router）
系统 SHALL 在 `backend/app/routers/redis_router.py` 中实现独立的 Redis 读写演示路由，使用 `APIRouter(prefix="/api/redis", tags=["Redis"])`。

该路由 SHALL 包含三个端点：

`POST /api/redis/set` SHALL：
- 接收 JSON 请求体：`{"key": "<str>", "value": "<str>", "ttl_seconds": <int>}`
- 调用 `redis_set` 写入 Redis
- 写入成功返回 HTTP 200 `{"detail": "OK", "key": "<key>"}`
- 写入失败（Redis 不可用）返回 HTTP 503 `{"detail": "Redis 不可用"}`

`GET /api/redis/{key}` SHALL：
- 按 URL 路径中的 key 调用 `redis_get` 读取
- 查到返回 HTTP 200 `{"key": "<key>", "value": "<value>"}`
- 查不到返回 HTTP 404 `{"detail": "键不存在"}`

`DELETE /api/redis/{key}` SHALL：
- 按 URL 路径中的 key 调用 `redis_delete` 删除
- 删除成功（返回值 > 0）返回 HTTP 200 `{"detail": "已删除", "key": "<key>"}`
- key 不存在返回 HTTP 404 `{"detail": "键不存在"}`

#### Scenario: 通过 API 写入并读取
- **GIVEN** FastAPI 应用已启动，Redis 可用
- **WHEN** 客户端发送 `POST /api/redis/set` 请求体 `{"key": "hello", "value": "world", "ttl_seconds": 300}` 后发送 `GET /api/redis/hello`
- **THEN** POST 返回 200，GET 返回 200 `{"key": "hello", "value": "world"}`

#### Scenario: 通过 API 读取不存在的 key 返回 404
- **GIVEN** Redis 中不存在 `key = "ghost"`
- **WHEN** 客户端发送 `GET /api/redis/ghost`
- **THEN** 返回 HTTP 404 `{"detail": "键不存在"}`

#### Scenario: 通过 API 删除后确认消失
- **GIVEN** Redis 中存在 `key = "tmp"`
- **WHEN** 客户端发送 `DELETE /api/redis/tmp` 后发送 `GET /api/redis/tmp`
- **THEN** DELETE 返回 200，GET 返回 404

### Requirement: Session 缓存在 Redis 中
系统 SHALL 修改 `create_session` 和 `get_current_user` 函数，将 session 数据同步到 Redis。

`create_session` 修改后 SHALL：
- 在 session 写入 DB 并 commit 后，调用 `redis_set(f"session:{token}", user_json, 604800)` 写入 Redis
- user_json 为 JSON 序列化的 `{"user_id": "<uuid>", "username": "<name>"}`
- Redis 写入失败时不抛异常，session 仍正常返回

`get_current_user` 修改后 SHALL：
- 先从 Redis 调用 `redis_get(f"session:{token}")` 读取
- Redis 命中：从 JSON 中提取 `user_id`，查 users 表返回 User 对象
- Redis 未命中：回退到查询 sessions 表（原逻辑）
  - sessions 表中找到且未过期：查 users 表返回 User 对象，并调用 `redis_set` 回写 Redis（续期）
  - 未找到或已过期：返回 HTTP 401

logout 端点修改后 SHALL：
- 在删除 DB session 后，额外调用 `redis_delete(f"session:{token}")` 清理 Redis 缓存

#### Scenario: 登录后 Redis 中有 session 缓存
- **GIVEN** Redis 服务可用
- **WHEN** 用户成功登录（调用 `POST /api/auth/login`）
- **THEN** Redis 中存在 `session:<token>` 这个 key，TTL 约 604800 秒

#### Scenario: 鉴权优先从 Redis 读取
- **GIVEN** Redis 中存在 `session:<valid_token>`，value 为有效 user_id
- **WHEN** 客户端携带 `Authorization: Bearer <valid_token>` 请求 `/api/user/profile`
- **THEN** 返回 HTTP 200 用户信息（鉴权走 Redis 路径）

#### Scenario: Redis 不可用时鉴权降级到数据库
- **GIVEN** Redis 不可用，但 sessions 表中存在有效 token
- **WHEN** 客户端携带该 token 请求 `/api/user/profile`
- **THEN** 返回 HTTP 200 用户信息（鉴权走 DB 路径，Redis 降级不中断服务）

#### Scenario: 登出后 Redis 缓存被清理
- **GIVEN** Redis 中存在 `session:<token>`
- **WHEN** 用户调用 `POST /api/auth/logout` 携带该 token
- **THEN** 返回 HTTP 200，Redis 中 `session:<token>` 已不存在
