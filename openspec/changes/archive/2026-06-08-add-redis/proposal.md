## Why

当前 session 鉴权每次请求都要查询 PostgreSQL 数据库，延迟高且增加 DB 负载。本次变更引入 Redis 作为缓存层——session token 优先从 Redis 读取（微秒级），仅在缓存未命中时才回退数据库，实现"优先 Redis、回退数据库"的典型缓存模式。同时暴露独立的 Redis 读写路由，展示 Redis 的存储与提取用法。

## What Changes

- 新增 `backend/app/utils/redis_client.py`：Redis 连接管理（环境变量 `REDIS_URL`）+ 三个操作函数（set/get/delete）
- 新增 `backend/app/routers/redis_router.py`：独立 Redis 演示路由（POST /set, GET /{key}, DELETE /{key}）
- 修改 `backend/app/utils/auth.py` 的 `create_session()`：session 写入 DB 后同步写入 Redis（key=`session:<token>`, TTL=7天）
- 修改 `backend/app/utils/deps.py` 的 `get_current_user()`：优先从 Redis 读取 session，未命中回退数据库并重新写入 Redis
- 修改 `backend/app/main.py`：注册 redis_router
- 新增依赖：`redis>=5.0.0`（加入 requirements.txt）

## Capabilities

### New Capabilities

- `redis-cache`: Redis 客户端连接模块（redis_client.py）+ 独立 Redis 读写演示路由（redis_router.py）+ session 缓存加速鉴权

### Modified Capabilities

- `user-auth`: `create_session` 新增 Redis 写入步骤；`get_current_user` 新增 Redis 优先读取 + 数据库回退逻辑
- `db-setup`: main.py 新增 redis_router 路由注册

## Impact

- 新增文件：`backend/app/utils/redis_client.py`、`backend/app/routers/redis_router.py`
- 修改文件：`backend/app/utils/auth.py`（+redis 写入）、`backend/app/utils/deps.py`（+redis 优先读取）、`backend/app/main.py`（+include_router）、`backend/requirements.txt`（+redis）
- 现有端点行为不变：所有认证端点对外接口保持一致（token 返回格式不变、鉴权结果不变）
- 性能提升：高频鉴权请求从 PostgreSQL 查询变为 Redis 内存读取
- 现有前端：无影响

## Out of Scope

- Redis 哨兵/集群模式（使用单机 Redis）
- Redis 持久化策略（AOF/RDB）
- 商品列表/其他业务数据缓存（当前仅缓存 session）
- Docker + Nginx 部署（留给 9.6）
- 前端对接
