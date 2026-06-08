## MODIFIED Requirements

### Requirement: 用户信息存储
系统 SHALL 使用 Zustand `useUserStore` 管理用户信息，数据从 API 获取而非 mock。

store SHALL：
- 登录成功后通过 `GET /api/user/profile` 获取用户信息
- `addresses` 通过 `GET /api/user/addresses` 加载
- 提供 `addAddress` / `updateAddress` / `deleteAddress` 方法对应对应 API 端点

### Requirement: 地址列表存储
系统 SHALL 在 `useUserStore` 中存储地址列表，通过 API 实时同步。

#### Scenario: 新增地址后列表更新
- **GIVEN** 当前有 2 条地址
- **WHEN** 调用 `addAddress({name, phone, address, is_default: false})`
- **THEN** 列表长度变为 3

#### Scenario: 删除地址后列表更新
- **GIVEN** 当前有 3 条地址
- **WHEN** 调用 `deleteAddress(id)`
- **THEN** 列表长度变为 2
