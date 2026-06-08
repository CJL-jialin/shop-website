## MODIFIED Requirements

### Requirement: 购物车状态管理
系统 SHALL 在 Zustand `useCartStore` 中管理购物车数据，通过 API 调用获取和操作数据。

store SHALL：
- 初始化时通过 `GET /api/cart` 加载购物车数据
- `addItem(product, spec)` SHALL 调用 `POST /api/cart/add`
- `removeItem(itemId)` SHALL 调用 `DELETE /api/cart/{itemId}`
- `updateQuantity(itemId, qty)` SHALL 调用 `PUT /api/cart/{itemId}`
- `toggleSelect(itemId)` / `toggleSelectAll()` SHALL 调用 `PUT /api/cart/{itemId}` 更新 selected 状态
- `checkout()` SHALL 调用 `POST /api/cart/checkout`
- 计算属性（allCount, selectedItems, selectedCount, selectedTotal, isAllSelected）在前端本地计算

#### Scenario: 初始化加载购物车
- **GIVEN** 用户已登录，后端有 3 条购物车记录
- **WHEN** store 初始化
- **THEN** `items` 长度为 3

#### Scenario: 未登录时不加载购物车
- **GIVEN** 用户未登录
- **WHEN** store 初始化
- **THEN** `items` 为空数组
