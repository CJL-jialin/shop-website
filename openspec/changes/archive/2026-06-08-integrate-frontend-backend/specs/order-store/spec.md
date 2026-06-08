## MODIFIED Requirements

### Requirement: 订单状态管理
系统 SHALL 使用 Zustand `useOrderStore` 管理订单数据，通过 `GET /api/orders` 从后端获取。

store SHALL：
- 初始化时通过 `GET /api/orders` 加载（若已登录）
- `ordersByStatus(status)` SHALL 在前端本地过滤（或传入 ?status= 参数重新请求）
- 提供 `refreshOrders()` 方法重新拉取

#### Scenario: 按状态筛选订单
- **GIVEN** 用户有混合状态订单
- **WHEN** 调用 `ordersByStatus('pending')`
- **THEN** 返回仅 `status === 'pending'` 的订单

#### Scenario: 空订单列表
- **GIVEN** 用户没有订单
- **WHEN** store 初始化
- **THEN** `orders` 为空数组
