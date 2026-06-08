## ADDED Requirements

### Requirement: Docker Compose 编排
系统 SHALL 在项目根目录提供 `docker-compose.yml`，编排四个服务：

- `nginx`：基于 `nginx:alpine`，映射 80 端口，挂载 `nginx/nginx.conf` 和前端构建产物 `my-shop-website/dist/`
- `backend`：基于 `backend/Dockerfile`，暴露 8000 端口（仅内网），环境变量通过 `.env` 文件注入
- `postgres`：基于 `postgres:17-alpine`，映射 5432 端口，持久化数据卷 `pgdata`
- `redis`：基于 `redis:7-alpine`，映射 6379 端口

#### Scenario: docker compose up 启动全部服务
- **GIVEN** Docker 已安装
- **WHEN** 执行 `docker compose up -d`
- **THEN** 四个容器全部 Running，访问 `http://localhost` 显示前端页面

### Requirement: Nginx 配置
系统 SHALL 在 `nginx/nginx.conf` 中配置 Nginx：

- `location /`：root 指向 `/usr/share/nginx/html`（前端 dist 挂载点），`try_files $uri $uri/ /index.html`（SPA fallback）
- `location /api/`：`proxy_pass http://backend:8000/api/`，透传请求

#### Scenario: 前端页面正常访问
- **GIVEN** docker compose 已启动
- **WHEN** 浏览器访问 `http://localhost`
- **THEN** 显示电商下单系统首页

#### Scenario: API 请求被代理到后端
- **GIVEN** docker compose 已启动
- **WHEN** 浏览器请求 `http://localhost/api/health`
- **THEN** 返回 `{"status": "ok"}`
