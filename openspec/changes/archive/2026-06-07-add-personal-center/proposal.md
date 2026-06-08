## Why

首页和购物车已完成，"我的" Tab 和 profile 链接目前只有 placeholder。用户需要完整的个人中心来查看订单、管理地址、修改设置，这是电商系统的第三个核心入口。

## What Changes

- 新增 Personal Center 页面：用户信息卡（头像+用户名+会员标签+三数字统计）、功能列表（我的订单/收货地址/设置）
- 新增我的订单子页面：5 个状态 tabs（全部/待付款/待发货/待收货/待评价）、订单列表、mock 数据 4 条
- 新增收货地址子页面：地址列表（姓名+脱敏手机+详细地址+默认标签）、新增地址按钮（Toast 提示）
- 新增设置子页面：修改昵称/手机号/关于我们/退出登录（Toast"已退出"→回首页）
- 新建 `useUserStore`：用户名"张三"、头像、会员等级"普通会员"、地址列表
- 新建 `useOrderStore`：订单列表、按状态筛选
- 修改 TabBar："我的" Tab 点击跳转至实际的 Personal Center 页面

## Capabilities

### New Capabilities

- `personal-center`: 个人中心主页面，包含用户信息卡（橙色渐变背景、白色文字）和功能列表（我的订单/收货地址/设置，右箭头，细线分隔）
- `my-orders`: 我的订单子页面，顶部状态 tabs 筛选，订单列表（编号/缩略图/名称/数量/金额/状态），mock 数据 4 条
- `shipping-address`: 收货地址子页面，地址列表（姓名/脱敏手机/详细地址/默认标签），新增地址按钮 Toast 提示
- `settings-page`: 设置子页面，修改昵称/手机号/关于我们/退出登录，退出 Toast"已退出"回首页
- `user-store`: Zustand Store，用户信息（名字/头像/会员等级）和地址列表，mock 数据初始化
- `order-store`: Zustand Store，订单列表，支持按状态筛选，mock 数据初始化

### Modified Capabilities

- `home-page`: 底部 TabBar "我的" Tab 跳转从 `#/profile` placeholder 改为实际的 Personal Center 页面路径

## Impact

- 新增文件：`src/stores/useUserStore.ts`、`src/stores/useOrderStore.ts`、`src/mock/user.ts`、`src/mock/orders.ts`、`src/pages/ProfilePage.tsx`、`src/pages/MyOrdersPage.tsx`、`src/pages/ShippingAddressPage.tsx`、`src/pages/SettingsPage.tsx`
- 修改文件：`src/components/TabBar.tsx`（"我的"链接指向实际页面）、`src/App.tsx`（新增 4 条路由）
- 无新依赖，无 breaking changes
