## MODIFIED Requirements

### Requirement: FastAPI 应用骨架
系统 SHALL 在 `backend/app/main.py` 中创建 FastAPI 应用实例，注册健康检查端点，并注册已实现的路由模块。

`GET /health` 端点 SHALL 返回 JSON 对象 `{"status": "ok"}`，HTTP 状态码 200。

FastAPI 应用 SHALL：
- 配置 CORS 中间件，允许所有来源的跨域请求
- 将 `db_router` 通过 `app.include_router()` 注册
- 将 `user_router` 通过 `app.include_router()` 注册
- 将 `redis_router` 通过 `app.include_router()` 注册
- 在 `app/main.py` 文件末尾提供 `if __name__ == "__main__"` 入口，使用 uvicorn 启动
- 后续新增的路由模块均通过 `include_router` 注册

#### Scenario: 健康检查返回正常
- **GIVEN** FastAPI 应用已启动
- **WHEN** 客户端请求 `GET /health`
- **THEN** 返回 HTTP 200，响应体为 `{"status": "ok"}`

#### Scenario: CORS 跨域请求被允许
- **GIVEN** FastAPI 应用已启动
- **WHEN** 客户端从不同域名发起跨域请求到 `/health`
- **THEN** 响应头包含正确的 CORS 头，请求不被浏览器拦截

#### Scenario: Redis 路由可访问
- **GIVEN** FastAPI 应用已启动
- **WHEN** 客户端请求 `POST /api/redis/set`
- **THEN** 请求被正确路由到 `redis_router` 处理函数
