## Context

项目已有 HomePage (首页) 和 CartPage (购物车)，"我的" Tab (`#/profile`) 仍为 placeholder。需补全第三个入口。

## Goals / Non-Goals

**Goals:**
- 实现个人中心主页面 + 3 个子页面
- 新建 useUserStore + useOrderStore（Zustand, mock 数据）
- 修改 TabBar/App.tsx 路由指向实际页面
- 橙色渐变背景用户信息卡、白底功能列表

**Non-Goals:**
- 不做用户注册/登录（数据写死"张三"）
- 不做收藏/优惠券子页面
- 不做修改昵称/手机号的实际表单（仅 Toast 提示）

## Decisions

| 决策 | 选择 | 理由 |
|------|------|------|
| 子页面导航 | hash 路由（`#/profile/orders` 等） | 与现有 hash 路由一致 |
| 订单筛选 | Zustand getter `ordersByStatus(status)` | Store 内计算，组件直接消费 |
| 手机号脱敏 | 前端 mock 数据已处理（`139****1234`） | 无需运行时脱敏逻辑 |
| 退出登录 | `window.location.hash = '#/'` | 清除状态 + 跳转首页 |
| 新增地址 | Toast "功能开发中" | 仅模拟操作 |

### 页面路由结构

```
#/profile               → ProfilePage (个人中心主页)
#/profile/orders        → MyOrdersPage (我的订单)
#/profile/addresses     → ShippingAddressPage (收货地址)
#/profile/settings      → SettingsPage (设置)
```

### 组件树

```
ProfilePage
├── UserInfoCard            (橙色渐变 bg, 白色文字)
│   ├── Avatar              (头像 60px 圆形)
│   ├── UserName            ("张三")
│   ├── MemberBadge         ("普通会员" tag)
│   └── StatsRow            (订单数/收藏数/优惠券数)
├── FunctionList            (白底列表)
│   ├── MenuItem → 我的订单  (右箭头 → #/profile/orders)
│   ├── MenuItem → 收货地址  (右箭头 → #/profile/addresses)
│   └── MenuItem → 设置      (右箭头 → #/profile/settings)
└── TabBar

MyOrdersPage
├── Header                  ("我的订单" + 返回按钮)
├── StatusTabs              (全部/待付款/待发货/待收货/待评价)
├── OrderList
│   └── OrderCard × N       (编号/缩略图/名称/数量/金额/状态)
└── TabBar

ShippingAddressPage
├── Header                  ("收货地址" + 返回按钮)
├── AddressList
│   └── AddressCard × N     (姓名/脱敏手机/地址/默认标签)
├── AddButton               ("新增地址" → Toast)
└── TabBar

SettingsPage
├── Header                  ("设置" + 返回按钮)
├── SettingsList
│   ├── Item → 修改昵称     (→ Toast)
│   ├── Item → 修改手机号   (→ Toast)
│   ├── Item → 关于我们     (→ Toast)
│   └── Item → 退出登录     (红字 → Toast → 回首页)
└── TabBar
```

### Zustand Stores

```
useUserStore:
  State:
    - user: { name, avatar, memberLevel }
    - addresses: AddressItem[]
  Computed:
    - orderCount, favoriteCount, couponCount (目前 mock)

useOrderStore:
  State:
    - orders: OrderItem[]
  Computed:
    - ordersByStatus(status): OrderItem[]  // 'all' | 'pending' | 'shipped' | ...
```

```
User:
  name: string, avatar: string, memberLevel: string

AddressItem:
  id: string, name: string, phone: string, address: string, isDefault: boolean

OrderItem:
  id: string, productName: string, productImage: string,
  quantity: number, amount: number, status: OrderStatus, orderNo: string

OrderStatus: 'pending' | 'paid' | 'shipped' | 'received' | 'reviewed'
```

### Mock 数据

- 用户：张三，头像 emoji 👤，普通会员
- 地址：3 条（含 1 条默认）
- 订单：4-5 条，覆盖不同状态（待付款/待发货/待收货/待评价）

## Risks / Trade-offs

- **子页面 hash 深度增加** → App.tsx 路由用 `if/else` 链，课堂项目够用
- **退出登录仅前端模拟** → 清空 mock 状态 + 跳转首页，不涉及 localStorage token
