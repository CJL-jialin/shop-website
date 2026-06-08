## Context

当前后端已完成用户认证体系（9.3），每次鉴权都直接查询 PostgreSQL 的 sessions 表。引入 Redis 作为缓存层后，session 鉴权优先从内存读取，大幅降低数据库查询压力。同时暴露独立的 Redis 读写路由，展示 Redis 的基本操作方法。

## Goals / Non-Goals

**Goals:**
- 封装 Redis 客户端连接模块（从 `REDIS_URL` 环境变量读取）
- 实现三个 Redis 操作函数：`redis_set`（带 TTL）、`redis_get`、`redis_delete`
- 实现 Redis 演示路由三个端点（POST /set, GET /{key}, DELETE /{key}）
- 改造 `create_session`：写入 DB 后同步写入 Redis
- 改造 `get_current_user`：优先 Redis 读取，未命中回退 DB 并回写 Redis
- login/logout 链路中 Redis 缓存与 DB 数据保持一致

**Non-Goals:**
- Redis 集群/哨兵（单机模式）
- Redis 持久化策略配置
- 商品列表/商品详情的业务数据缓存
- 前端对接

## Decisions

### Decision 1: 使用 redis-py 同步客户端

**选择**: `redis.Redis.from_url(REDIS_URL)` 创建同步连接，使用 `setex` / `get` / `delete` 命令。
**原因**: FastAPI 当前所有端点均为同步函数（`def` 而非 `async def`），同步 Redis 客户端无事件循环兼容问题，代码简洁。`redis-py` 是 Python Redis 的标准库。
**替代方案**: `redis.asyncio` — 需要所有路由改为 `async def`，影响面大；`aioredis` — 已弃用并入 redis-py。

### Decision 2: Session 缓存 Key 格式为 `session:<token>`

**选择**: Redis key = `"session:" + token`，value = JSON 序列化的 `{"user_id": "...", "username": "..."}`，TTL = 7 天（604800 秒）。
**原因**: 命名空间前缀 `session:` 避免与其他缓存 key 冲突。JSON 格式可读性好，方便调试。TTL 与 DB 中 sessions.expires_at 保持一致。
**替代方案**: 直接存 token 为 key 无前缀 — 无法区分 session 与其他缓存，被拒绝。

### Decision 3: Redis 不可用时静默降级

**选择**: `redis_set` 调用包裹 try/catch，写入失败时不抛异常，仅跳过 Redis 缓存。`get_current_user` 中 Redis 不可用时直接走 DB 路径。
**原因**: 缓存层的核心原则是"缓存挂了不影响业务"。Redis 不可用时系统仍能正常鉴权（仅性能回落）。
**替代方案**: Redis 不可用时抛异常返回 500 — 降低了系统可用性，违反缓存设计原则。

### Decision 4: 登出时同步清理 Redis

**选择**: logout 端点删除 DB session 后，额外调用 `redis_delete(f"session:{token}")`。
**原因**: 确保登出后 Redis 中的缓存立即失效，而不是等 TTL 自然过期。防止用户在登出后的 7 天内仍可通过旧 token 访问（如果 DB 被绕过）。
**替代方案**: 仅删 DB 等 TTL 过期 — 登出后 token 在 Redis 中仍然有效，存在安全窗口。

### Decision 5: redis_router 使用独立的 APIRouter 前缀

**选择**: `APIRouter(prefix="/api/redis", tags=["Redis"])`，与 db_router 模式一致。
**原因**: 模块化路由是项目既定模式，redis_router 作为独立演示路由不应污染其他路由文件。

## Risks / Trade-offs

- **Redis 未运行时系统不中断**: Design Decision 3 的降级策略确保可用性，但 Redis 不可用时日志不可见（当前不打印 warning）。→ 可通过 `logging.warning` 记录，非本阶段硬性需求。
- **缓存与 DB 不一致**: 极端情况下 Redis 写入成功但后续 session 被手动删除（如管理员操作），Redis 中仍有缓存。→ TTL 7 天后自动清除，且 `get_current_user` 在 Redis 命中后不验证 DB，存在极小的时间窗口。对于课堂作业场景可接受。
- **redis-py 依赖**: 纯 Python 实现，无 C 编译依赖，安装无兼容性问题。
