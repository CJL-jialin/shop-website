## Phase 1: Redis 基础设施

- [x] 1.1 修改 `backend/requirements.txt`：新增 `redis>=5.0.0` 依赖
- [x] 1.2 创建 `backend/app/utils/redis_client.py`：从 `REDIS_URL` 环境变量读取地址，实现 `redis_set`、`redis_get`、`redis_delete` 三个函数

## Phase 2: Redis 演示路由

- [x] 2.1 创建 `backend/app/routers/redis_router.py`：实现 `POST /api/redis/set`、`GET /api/redis/{key}`、`DELETE /api/redis/{key}` 三个端点

## Phase 3: Session 缓存打通（优先 Redis、回退 DB）

- [x] 3.1 修改 `backend/app/utils/auth.py` 的 `create_session`：session 写入 DB 后同步写入 Redis（key=`session:<token>`, JSON 序列化 user_id+username, TTL=604800）
- [x] 3.2 修改 `backend/app/utils/deps.py` 的 `get_current_user`：优先从 Redis 读取 session，未命中回退 DB 并回写 Redis
- [x] 3.3 修改 `backend/app/routers/user_router.py` 的 `logout` 端点：删除 DB session 后同步调用 `redis_delete` 清理缓存

## Phase 4: 路由注册

- [x] 4.1 修改 `backend/app/main.py`：导入 redis_router 并通过 `app.include_router()` 注册

## Phase 5: 全链路验证

- [x] 5.1 安装 redis 依赖，启动 Redis 和 FastAPI，curl 验证：Redis 独立读写（set→get→delete + TTL 过期 + 404）→ 登录后确认 Redis 有 session 缓存 → 调 profile 走 Redis 路径 → 登出确认 Redis 缓存被清理 → Redis 停掉后鉴权降级到 DB 仍可用
