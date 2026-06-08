## Phase 1: Zustand Stores 数据层

- [x] 1.1 创建 `src/stores/useUserStore.ts`：用户信息（name/avatar/memberLevel）、三数字统计、地址列表（AddressItem[]），mock 数据初始化
- [x] 1.2 创建 `src/stores/useOrderStore.ts`：订单列表（OrderItem[]）、`ordersByStatus(status)` 筛选方法，mock 数据初始化（4-5 条不同状态订单）
- [x] 1.3 创建 `src/mock/user.ts` 和 `src/mock/orders.ts`：用户 mock（张三+3 地址）、订单 mock（4-5 条）

## Phase 2: 个人中心主页面

- [x] 2.1 创建 `UserInfoCard` 组件：橙色渐变背景、圆形头像、用户名"张三"、"普通会员"标签、三数字统计
- [x] 2.2 创建 `ProfilePage` 页面：组装 UserInfoCard + 功能列表（我的订单/收货地址/设置，细线分隔+右箭头）+ TabBar
- [x] 2.3 亮/暗模式适配验证

## Phase 3: 三个子页面

- [x] 3.1 创建 `MyOrdersPage`：5 个状态 tabs + 订单列表（编号/缩略图/名称/数量/金额/状态）+ 空状态 + 返回按钮
- [x] 3.2 创建 `ShippingAddressPage`：地址列表（姓名/脱敏手机/地址/默认标签）+ "新增地址"按钮（Toast）+ 空状态 + 返回按钮
- [x] 3.3 创建 `SettingsPage`：四项设置列表（修改昵称/手机号/关于我们/退出登录红字）+ 退出 Toast "已退出" 跳首页 + 返回按钮

## Phase 4: 路由组装与联动

- [x] 4.1 在 App.tsx 中添加 4 条路由（#/profile, #/profile/orders, #/profile/addresses, #/profile/settings）
- [x] 4.2 更新 TabBar："我的" Tab 的 `activeKey` 匹配 profile 及其子路由
- [x] 4.3 TypeScript 编译检查 + `npm run dev` 验证：各页面/子页面跳转/订单筛选/退出登录
