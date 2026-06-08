## Phase 1: 重构 Zustand Store

- [x] 1.1 重构 `useCartStore`：定义 CartItem 接口（itemId, productId, name, spec, price, quantity, stock, imageUrl, selected）、计算属性（allCount, selectedItems, selectedCount, selectedTotal, isAllSelected）
- [x] 1.2 实现 actions：addItem（同品同规格累加）、removeItem、updateQuantity（1≤qty≤stock）、toggleSelect、toggleSelectAll、checkout（清空已选 + 返回 Toast 消息）
- [x] 1.3 创建 mock 初始购物车数据（4件预置商品），store 初始化时加载

## Phase 2: Toast 与 ConfirmDialog 通用组件

- [x] 2.1 创建 `Toast` 组件：Portal 渲染、2s 自动消失、居中展示、亮/暗模式适配
- [x] 2.2 创建 `ConfirmDialog` 组件：Portal 渲染、遮罩层、标题+文案、取消/确认按钮、亮/暗模式适配

## Phase 3: 购物车页面核心组件

- [x] 3.1 创建 `CartItem` 组件：checkbox + 缩略图 + 名称/规格 + 价格（品牌橙色）+ 数量步进器（-/+按钮，库存上限置灰）
- [x] 3.2 创建 `CartItem` 左滑删除交互：touch 事件监听、transform 位移、40px 阈值、露出红色删除按钮、触发 ConfirmDialog
- [x] 3.3 创建 `CartSettlementBar` 组件：全选 checkbox + 合计金额（品牌橙色加粗）+ "去结算(N件)" 按钮（品牌橙色圆角填充）
- [x] 3.4 创建 `CartEmpty` 组件：居中空状态（插画 + "购物车是空的，去逛逛吧~" + "去逛逛" 按钮跳回首页）

## Phase 4: CartPage 组装与联动

- [x] 4.1 创建 `CartPage` 页面：组装 CartNavbar + CartList + CartRecommend + CartSettlementBar + Toast + ConfirmDialog + TabBar
- [x] 4.2 更新 SearchBar 购物车角标：从 `totalCount` 改为 `allCount`，确保与 store 重构后兼容
- [x] 4.3 更新 TabBar 组件：支持根据当前页面高亮对应 Tab（首页/购物车），"购物车" Tab 链接到实际 CartPage
- [x] 4.4 在 App.tsx 中添加简易路由（基于 `window.location.hash` 切换 HomePage / CartPage）
- [x] 4.5 TypeScript 编译检查 + `npm run dev` 验证：有数据/空状态/结算/删除/角标联动
