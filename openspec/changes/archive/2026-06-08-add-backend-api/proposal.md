## Why

当前项目仅有前端静态页面，缺乏后端数据层支撑。本次变更为项目引入 FastAPI + PostgreSQL 后端骨架，建立用户表和会话表的数据模型，并用 Faker 生成假数据填充数据库，为后续注册登录、业务接口打下基础。

## What Changes

- 新增 `backend/` 目录，使用 FastAPI + SQLAlchemy + PostgreSQL 技术栈
- 定义 `users` 表和 `sessions` 表的 ORM 模型（SQLAlchemy）
- 实现 PostgreSQL 连接管理模块，从环境变量读取连接串
- 实现 Faker 假数据填充脚本，自动建表并写入 10 个用户及对应会话记录
- 创建 FastAPI 最小入口，包含 `/health` 健康检查端点

## Capabilities

### New Capabilities

- `db-setup`: 数据库连接管理与表结构定义（models.py + database.py），FastAPI 最小骨架（main.py），健康检查端点
- `user-seeding`: 使用 Python Faker 生成 10 个假用户及其会话记录，通过 seed.py 脚本自动建表并填充数据

### Modified Capabilities

无需修改现有前端 spec。本次变更仅新增后端基础设施，前端代码不受影响。

## Impact

- 新增目录：`backend/`（包含 app/main.py、app/models.py、app/database.py、app/seed.py）
- 新增依赖：fastapi、uvicorn、sqlalchemy、psycopg2-binary、faker（通过 requirements.txt 管理）
- 外部依赖：需要本地或 Docker 运行 PostgreSQL 实例
- 现有前端：无影响

## Out of Scope

- 9.2 CRUD 接口封装与路由注册（DB_router.py）
- 9.3 用户注册与登录系统、密码加密（user_router.py）
- 9.4 Redis 存储与提取路由（redis_router.py）
- 9.5 Gitee 仓库上传
- 9.6 Docker + Nginx 部署
- 购物车、订单、商品、地址等业务表（本阶段仅 users 和 sessions 两张表）
- 前后端对接（前端仍使用 Zustand + mock 数据）
