## Phase 1: 项目骨架搭建

- [x] 1.1 创建 `backend/` 目录结构（`backend/app/`、`backend/app/routers/`、`backend/app/utils/`），添加 `__init__.py`
- [x] 1.2 编写 `backend/requirements.txt`：fastapi、uvicorn、sqlalchemy、psycopg2-binary、faker、pydantic
- [x] 1.3 编写 `backend/Dockerfile`（python:3.12-slim 基础镜像 + 依赖安装）

## Phase 2: 数据库连接与模型定义

- [x] 2.1 编写 `backend/app/database.py`：从 `DATABASE_URL` 环境变量读取连接串，创建 engine、SessionLocal、Base、get_db 依赖注入函数
- [x] 2.2 编写 `backend/app/models.py`：定义 `User` 模型（id, username 唯一, password_hash, salt, name, avatar, member_level, phone, created_at）
- [x] 2.3 补充 `backend/app/models.py`：定义 `Session` 模型（id, user_id 外键关联 users, token 唯一, expires_at, created_at）

## Phase 3: Faker 假数据填充

- [x] 3.1 编写 `backend/app/seed.py`：导入所有模型，调用 `Base.metadata.create_all()` 自动建表
- [x] 3.2 在 seed.py 中使用 Faker 生成 10 个用户（username 唯一、name 中文姓名、phone 手机号、member_level 默认"普通会员"、password_hash/salt 假值）
- [x] 3.3 在 seed.py 中为每个用户生成 1-2 条会话记录（token 用 uuid4、expires_at = created_at + 7 天），批量写入数据库

## Phase 4: FastAPI 应用入口

- [x] 4.1 编写 `backend/app/main.py`：创建 FastAPI 实例，配置 CORS 中间件，实现 `GET /health` 端点返回 `{"status": "ok"}`
- [x] 4.2 在 main.py 末尾添加 `if __name__ == "__main__"` 入口，使用 uvicorn 启动

## Phase 5: 本地验证

- [x] 5.1 启动本地 PostgreSQL（确认 5432 端口可用），设置 `DATABASE_URL` 环境变量
- [x] 5.2 运行 `python seed.py`，通过 psql 或 pgAdmin 执行 `SELECT * FROM users;` 和 `SELECT * FROM sessions;` 确认数据写入
- [x] 5.3 启动 FastAPI（`python main.py`），curl `http://localhost:8000/health` 确认返回 `{"status": "ok"}`
