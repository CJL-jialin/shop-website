## ADDED Requirements

### Requirement: 前端认证状态管理
系统 SHALL 在 `my-shop-website/src/stores/useAuthStore.ts` 中创建认证状态管理的 Zustand store。

store SHALL 包含：
- `token: string | null` — 当前登录 token，从 localStorage 初始化
- `user: UserResponse | null` — 当前登录用户信息
- `isLoggedIn: boolean` — 计算属性（token !== null）
- `register(username, password, name, phone?)` — 调用 `POST /api/auth/register`，成功保存 token 和 user
- `login(username, password)` — 调用 `POST /api/auth/login`，成功保存 token 和 user
- `logout()` — 调用 `POST /api/auth/logout`，清除 token 和 user，调用 `clearToken()`
- `fetchProfile()` — 调用 `GET /api/user/profile`，更新 user

#### Scenario: 注册成功自动登录
- **GIVEN** 后端可用
- **WHEN** 调用 `register('newuser', 'pass123', '用户')`
- **THEN** `isLoggedIn` 为 true，`token` 不为 null，localStorage 中有 `auth_token`

#### Scenario: 登录成功保存状态
- **GIVEN** 已存在用户
- **WHEN** 调用 `login('existing', 'correctpass')`
- **THEN** `isLoggedIn` 为 true，`user.username` 为 `'existing'`

#### Scenario: 登出清除状态
- **GIVEN** 当前已登录
- **WHEN** 调用 `logout()`
- **THEN** `isLoggedIn` 为 false，`token` 为 null，localStorage 中 `auth_token` 被移除

#### Scenario: 页面刷新后自动恢复登录状态
- **GIVEN** localStorage 中存在有效 token
- **WHEN** 刷新页面，store 重新初始化
- **THEN** `isLoggedIn` 为 true（从 localStorage 恢复 token）
