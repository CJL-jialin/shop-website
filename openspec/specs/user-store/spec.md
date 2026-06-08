## ADDED Requirements

### Requirement: 用户信息存储
系统 SHALL 使用 Zustand `useUserStore` 管理用户信息，包含用户名（"张三"）、头像地址、会员等级（"普通会员"）。

#### Scenario: 读取用户信息
- **GIVEN** store 已初始化
- **WHEN** 组件读取 `useUserStore.getState().user`
- **THEN** 返回 `{ name: "张三", avatar: "...", memberLevel: "普通会员" }`

### Requirement: 地址列表存储
系统 SHALL 在 `useUserStore` 中存储地址列表，每条包含 id、收件人姓名、脱敏手机号、详细地址、是否默认。

#### Scenario: 读取地址列表
- **GIVEN** store 已初始化 3 条 mock 地址
- **WHEN** 组件读取 `useUserStore.getState().addresses`
- **THEN** 返回 3 条地址，其中至少 1 条 `isDefault: true`
