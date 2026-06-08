## Why

首页已完成，用户可通过搜索栏购物车图标和底部 TabBar 进入购物车，但当前购物车页只有 placeholder。
购物车是电商下单系统的核心模块，需要支持商品选择、数量调整、结算等完整流程，与首页购物车角标实现数据联动。

## What Changes

- **重构** `useCartStore`：从简单增删升级为完整购物车状态管理（选中态、数量步进、库存上限、全选、结算）
- 新增 Cart Page，包含：顶部导航栏（显示总件数）、商品列表（带 checkbox + 数量步进器 + 左滑删除）、底部结算栏（全选 + 合计金额 + 去结算）
- 新增左滑删除交互组件 + 删除确认弹窗
- 新增空购物车状态页面
- 新增 Toast 组件（结算后提示"下单成功"）
- 新增"猜你喜欢"推荐区（复用 ProductCard 瀑布流）
- 修改 SearchBar 和 TabBar 购物车链接从 placeholder 指向真实购物车页面
- 购物车角标与 store 联动，商品变更/结算后自动更新

## Capabilities

### New Capabilities

- `cart-store`: 增强版 Zustand 购物车 Store，支持选中/取消、数量步进（含库存上限）、全选切换、结算清空、同商品累加、计算属性（选中列表、选中总价、选中件数、全部件数、是否全选）
- `cart-page`: 购物车页面完整 UI，包含顶部导航栏、商品列表、底部结算栏、空状态、猜你喜欢推荐区
- `cart-swipe-delete`: 商品卡片左滑露出删除按钮，点击弹出确认弹窗，确认后删除

### Modified Capabilities

- `search-bar`: 搜索栏购物车图标跳转地址从 `#/cart` placeholder 改为实际购物车页面路径
- `home-page`: 底部 TabBar 购物车 Tab 跳转地址从 `#/cart` placeholder 改为实际购物车页面路径

## Impact

- 修改文件：`src/stores/useCartStore.ts`（重构）、`src/components/SearchBar.tsx`（链接更新）、`src/components/TabBar.tsx`（链接更新）
- 新增文件：`src/pages/CartPage.tsx`、`src/components/CartItem.tsx`、`src/components/CartSettlementBar.tsx`、`src/components/Toast.tsx`、`src/components/ConfirmDialog.tsx`
- 新增依赖：无（全部使用已有技术栈）
- 数据联动：store 状态变更 → 首页角标自动响应，无需手动刷新
- 无 breaking changes
