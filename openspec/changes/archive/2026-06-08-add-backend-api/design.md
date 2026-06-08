## Context

当前项目仅有前端（React + Vite），部署在 GitHub Pages，所有数据来自前端 mock。本次变更为项目新增后端服务层，技术栈为 FastAPI + SQLAlchemy + PostgreSQL，采用 Monorepo 模式放置在项目根目录 `backend/` 下。本阶段仅涵盖数据库连接、users/sessions 两张表的 ORM 模型定义，以及 Faker 假数据填充。

## Goals / Non-Goals

**Goals:**
- 建立 `backend/` 模块的目录结构和依赖管理
- 定义 `users` 和 `sessions` 两张表的 SQLAlchemy ORM 模型
- 实现 PostgreSQL 连接管理，通过环境变量配置连接串
- 编写 Faker 假数据脚本，自动建表并插入 10 个用户及其会话记录
- 创建 FastAPI 最小应用入口，包含 `/health` 健康检查端点
- 所有代码使用 Python 3.12+ 和类型注解

**Non-Goals:**
- 不实现任何 API 路由（POST/GET/PUT/DELETE 端点留给 9.2）
- 不实现用户注册与登录逻辑（留给 9.3）
- 不实现 Redis 集成（留给 9.4）
- 不实现 Docker 部署配置（留给 9.6）
- 不修改前端代码
- 不创建 users 和 sessions 以外的业务表

## Decisions

### Decision 1: 主键使用 UUID 而非自增整数

**选择**: 所有表主键使用 `uuid.UUID` 类型，Python 侧生成 `uuid4`。
**原因**: UUID 在分布式环境下无冲突，且不暴露数据规模（如用户总数）。对于未来的前后端分离场景更安全。
**替代方案**: 自增整数主键 — 更简单但暴露 ID 顺序，被拒绝。

### Decision 2: 密码哈希字段提前定义但本阶段不实现

**选择**: `users` 表中定义 `password_hash` 和 `salt` 两个字段，本阶段 seed 脚本中使用 Faker 生成假值填充。
**原因**: 表结构一次性设计到位，避免后续 ALTER TABLE。9.3 实现注册登录时直接使用已有字段。
**替代方案**: 本阶段不定义密码字段，9.3 再加 — 会导致数据库迁移复杂性，被拒绝。

### Decision 3: 数据库连接串从环境变量读取

**选择**: `DATABASE_URL` 环境变量（格式 `postgresql://user:pass@host:5432/dbname`），不硬编码。
**原因**: 开发环境（本地 PostgreSQL）与 Docker 环境（容器内 PostgreSQL）可共享同一套代码，仅环境变量不同。
**替代方案**: 硬编码连接串或使用配置文件 — 不安全且不灵活，被拒绝。

### Decision 4: seed.py 脚本独立运行，不依赖 FastAPI

**选择**: `python seed.py` 直接执行，内部创建引擎和会话，不通过 FastAPI 生命周期。
**原因**: 数据填充是一次性操作，不应耦合到 Web 服务启动流程。未来 Docker 部署时作为初始化脚本独立执行。
**替代方案**: 嵌入 FastAPI startup 事件 — 每次重启都会重置数据，不适用于生产环境，被拒绝。

### Decision 5: sessions 表过期时间用 naive UTC datetime

**选择**: `expires_at` 存储不带时区的 UTC 时间戳，Python 侧用 `datetime.utcnow() + timedelta(days=7)`。
**原因**: 简单，与 Python 标准库兼容好，后续比较逻辑直接用 `datetime.utcnow() > expires_at` 判断过期。
**替代方案**: 带时区的 `TIMESTAMP WITH TIME ZONE` — PostgreSQL 支持更好但 Python 侧需引入 `pytz` 或 `zoneinfo`，对当前场景过度，被拒绝。

## Risks / Trade-offs

- **种子数据与生产混淆**: seed.py 仅用于开发/演示，误在生产环境运行会污染数据。→ 后续 9.6 阶段通过 Docker Compose profile 区分开发/生产容器。
- **密码字段为假数据**: 本阶段 seed 生成的 `password_hash` 是 Faker 随机字符串而非真实 bcrypt 哈希。→ 9.3 实现注册登录前，需清空或更新这些假值。
- **外键约束**: `sessions.user_id` 外键关联 `users.id`，seed 脚本必须先插入 users 再插入 sessions。→ seed 脚本按顺序执行，确保依赖关系正确。
