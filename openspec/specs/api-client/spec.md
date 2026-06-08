## ADDED Requirements

### Requirement: API 客户端封装
系统 SHALL 在 `my-shop-website/src/api/client.ts` 中创建统一的 API 通信客户端。

客户端 SHALL：
- 导出 `API_BASE` 常量，值为 `/api`（开发模式通过 Vite proxy 转发，生产模式通过 Nginx 反向代理）
- 从 localStorage 读取 `auth_token`（若存在），在每次请求的 `Authorization: Bearer <token>` 头中自动附加
- 导出 `apiGet<T>(path)` 函数：GET 请求，自动解析 JSON 响应，非 2xx 抛出 Error
- 导出 `apiPost<T>(path, body)` 函数：POST 请求，Content-Type: application/json
- 导出 `apiPut<T>(path, body)` 函数：PUT 请求
- 导出 `apiDel(path)` 函数：DELETE 请求，返回 void

#### Scenario: GET 请求成功返回数据
- **GIVEN** 后端 `/api/db/users` 返回 200 + JSON
- **WHEN** 调用 `apiGet('/db/users')`
- **THEN** 返回解析后的 JSON 对象

#### Scenario: 请求失败抛出异常
- **GIVEN** 后端 `/api/xxx` 返回 404
- **WHEN** 调用 `apiGet('/xxx')`
- **THEN** 抛出 Error，message 包含 HTTP 状态码

#### Scenario: 自动附加 Bearer Token
- **GIVEN** localStorage 中存在 `auth_token = "mytoken"`
- **WHEN** 调用任意 API 函数
- **THEN** 请求头包含 `Authorization: Bearer mytoken`

### Requirement: Auth Token 管理
系统 SHALL 提供以下 token 管理函数：

- `setToken(token)` SHALL 将 token 写入 `localStorage.setItem('auth_token', token)`
- `getToken()` SHALL 返回 `localStorage.getItem('auth_token')`，不存在返回 null
- `clearToken()` SHALL 调用 `localStorage.removeItem('auth_token')`

#### Scenario: Token 持久化
- **GIVEN** 用户登录成功获得 token `"t123"`
- **WHEN** 调用 `setToken("t123")` 后刷新页面再调用 `getToken()`
- **THEN** 返回 `"t123"`
