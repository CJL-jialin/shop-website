## ADDED Requirements

### Requirement: 订单列表存储
系统 SHALL 使用 Zustand `useOrderStore` 管理订单列表，每条订单包含 id、orderNo、productName、productImage、quantity、amount、status。

#### Scenario: 读取全部订单
- **GIVEN** store 已初始化 4-5 条 mock 订单
- **WHEN** 组件读取 `useOrderStore.getState().orders`
- **THEN** 返回所有订单，覆盖不同状态

### Requirement: 按状态筛选
系统 SHALL 提供 `ordersByStatus(status)` 方法，按订单状态筛选。`status` 为 `'all'` 时返回全部。

#### Scenario: 按状态筛选
- **GIVEN** 有 5 条订单，其中 2 条"待付款"
- **WHEN** 调用 `ordersByStatus('pending')`
- **THEN** 返回 2 条"待付款"订单
