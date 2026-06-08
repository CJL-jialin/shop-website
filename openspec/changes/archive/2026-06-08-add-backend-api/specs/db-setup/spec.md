## ADDED Requirements

### Requirement: 数据库表结构定义
系统 SHALL 在 `backend/app/models.py` 中使用 SQLAlchemy ORM 定义 `User` 和 `Session` 两个模型类，分别映射到 PostgreSQL 的 `users` 表和 `sessions` 表。

`User` 模型 SHALL 包含以下字段：
- `id`: UUID 类型主键，默认值为 Python `uuid4`
- `username`: 字符串类型，非空且唯一
- `password_hash`: 字符串类型，非空（本阶段填充 Faker 假值）
- `salt`: 字符串类型，非空（本阶段填充 Faker 假值）
- `name`: 字符串类型，非空（用户昵称）
- `avatar`: 字符串类型，可为空
- `member_level`: 字符串类型，默认值为 "普通会员"
- `phone`: 字符串类型，可为空
- `created_at`: DateTime 类型，默认值为当前 UTC 时间

`Session` 模型 SHALL 包含以下字段：
- `id`: UUID 类型主键，默认值为 Python `uuid4`
- `user_id`: UUID 类型外键，关联 `users.id`，非空
- `token`: 字符串类型，非空且唯一
- `expires_at`: DateTime 类型，非空
- `created_at`: DateTime 类型，默认值为当前 UTC 时间

#### Scenario: 表结构自动创建
- **GIVEN** PostgreSQL 数据库已运行且可连接
- **WHEN** 调用 `Base.metadata.create_all(bind=engine)`
- **THEN** 数据库中创建 `users` 表和 `sessions` 表，且表结构与模型定义一致

#### Scenario: 表已存在时重复创建不报错
- **GIVEN** 数据库中已存在 `users` 和 `sessions` 表
- **WHEN** 再次调用 `Base.metadata.create_all(bind=engine)`
- **THEN** 不抛出异常，现有表结构保持不变

### Requirement: 数据库连接管理
系统 SHALL 在 `backend/app/database.py` 中实现数据库连接管理模块。

该模块 SHALL：
- 从环境变量 `DATABASE_URL` 读取 PostgreSQL 连接串
- 创建 SQLAlchemy `engine` 实例
- 导出 `SessionLocal` 工厂函数，每次调用返回一个新的数据库会话
- 导出 `Base` 声明基类供 models.py 使用
- 导出 `get_db` 生成器函数，供 FastAPI 依赖注入使用，请求结束时自动关闭会话

#### Scenario: 使用环境变量连接数据库
- **GIVEN** 环境变量 `DATABASE_URL` 已设置为有效的 PostgreSQL 连接串
- **WHEN** 创建 SQLAlchemy engine 并获取一个数据库会话
- **THEN** 会话连接成功，可执行查询

#### Scenario: 数据库连接失败时抛出异常
- **GIVEN** 环境变量 `DATABASE_URL` 指向不可达的主机
- **WHEN** 尝试通过 engine 建立连接
- **THEN** 抛出连接异常，且异常信息包含明确的错误描述

### Requirement: FastAPI 应用骨架
系统 SHALL 在 `backend/app/main.py` 中创建 FastAPI 应用实例，并注册一个健康检查端点。

`GET /health` 端点 SHALL 返回 JSON 对象 `{"status": "ok"}`，HTTP 状态码 200。

FastAPI 应用 SHALL：
- 配置 CORS 中间件，允许所有来源的跨域请求
- 在 `app/main.py` 文件末尾提供 `if __name__ == "__main__"` 入口，使用 uvicorn 启动

#### Scenario: 健康检查返回正常
- **GIVEN** FastAPI 应用已启动
- **WHEN** 客户端请求 `GET /health`
- **THEN** 返回 HTTP 200，响应体为 `{"status": "ok"}`

#### Scenario: CORS 跨域请求被允许
- **GIVEN** FastAPI 应用已启动
- **WHEN** 客户端从不同域名发起跨域请求到 `/health`
- **THEN** 响应头包含正确的 CORS 头，请求不被浏览器拦截
