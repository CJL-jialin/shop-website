## Context

当前 `useCartStore` 仅有基本 addItem/removeItem 和 totalCount，缺少选中态、数量步进、库存管理、结算等购物车核心能力。
Cart Page 为 placeholder 状态，需从零构建完整页面。

## Goals / Non-Goals

**Goals:**
- 重构 `useCartStore` 为完整购物车 Store（选中、步进、库存、全选、结算）
- 实现 Cart Page 三态 UI（正常、空、删除确认弹窗）
- 实现左滑删除交互
- 实现底部结算栏（全选、合计、去结算）
- 实现 Toast 提示组件
- SearchBar/TabBar 购物车链接指向真实页面，角标实时同步

**Non-Goals:**
- 不做搜索
- 不做多级下拉菜单
- 不做真实的订单确认页（用 Toast 模拟）

## Decisions

| 决策 | 选择 | 理由 |
|------|------|------|
| 左滑实现 | CSS `transform` + touch 事件 | 纯 React 实现，无需第三方手势库 |
| 删除确认 | 自制 ConfirmDialog 组件 | 保持依赖精简 |
| Toast | 自制 Toast 组件（Portal + 自动消失） | 2s 自动消失，无需第三方 |
| Store itemId | `productId + spec` 组合 | 同商品不同规格视为不同行 |
| 库存上限 | item.stock (默认 99) | 数量 >= stock 时 + 按钮置灰 |
| 猜你喜欢 | 复用 `ProductWaterfall` | 从 mock 随机取 10 条，无需新增组件 |
| 路由 | `#/cart`（与现有占位一致） | 保持一致性，SearchBar/TabBar 链接无需改 href，只需 CartPage 变为实际页面 |

### 组件树

```
CartPage
├── CartNavbar              (sticky top: "购物车(N件)")
├── CartList                (scrollable)
│   └── CartItem × N        (左滑容器)
│       ├── Checkbox        (圆形，品牌橙色选中态)
│       ├── Thumbnail       (商品缩略图)
│       ├── Info            (名称 + 规格描述)
│       ├── Price           (品牌橙色加粗)
│       ├── Stepper         (- / 数量 / +, 库存上限置灰)
│       └── DeleteBtn       (左滑露出，红色)
├── CartRecommend           ("猜你喜欢" 双列瀑布流)
├── ConfirmDialog           (Portal 弹窗：确认删除?)
├── CartSettlementBar       (sticky bottom)
│   ├── SelectAll           (全选 checkbox)
│   ├── TotalPrice          (合计 ¥xxx)
│   └── CheckoutBtn         ("去结算(N件)")
├── Toast                   (Portal: "下单成功！")
├── CartEmpty               (空状态：插画 + 引导)
└── TabBar                  (复用车首页 TabBar)
```

### Zustand Store (重构后)

```
useCartStore:
  State:
    - items: CartItem[]
  Computed (getter):
    - allCount: number           // 全部商品件数（用于角标）
    - selectedItems: CartItem[]  // 已选中商品列表
    - selectedCount: number      // 选中件数
    - selectedTotal: number      // 选中商品总价
    - isAllSelected: boolean     // 是否全选
  Actions:
    - addItem(product, spec?): void       // 同品同规格累加
    - removeItem(itemId): void            // 删除单个
    - updateQuantity(itemId, qty): void   // 1 ≤ qty ≤ stock
    - toggleSelect(itemId): void          // 切换单个选中
    - toggleSelectAll(): void             // 全选/取消全选
    - checkout(): void                    // 清空已选 + 返回 Toast 消息
```

```
CartItem:
  - itemId: string         // productId + spec
  - productId: string
  - name: string
  - spec: string           // 规格描述
  - price: number
  - quantity: number
  - stock: number          // 库存上限
  - imageUrl: string
  - selected: boolean
```

### Mock 初始购物车数据

预置 4 件商品用于展示有数据状态：
- iPhone 16 Pro Max (深空黑) ×1 ¥8999
- Nike Air Jordan 1 (42码) ×1 ¥1299
- 戴森 V16 (标配) ×1 ¥3999
- MacBook Pro 16" (M4 Pro/32GB) ×1 ¥19999

## Risks / Trade-offs

- **左滑与页面滚动冲突** → 左滑时阻止页面垂直滚动（touchmove preventDefault），释放后恢复
- **Store 重构导致现有引用断裂** → SearchBar/TabBar 当前只读 `totalCount`，重构后改为 `allCount`，需同步更新
- **暗色模式 Toast/弹窗可见性** → Toast 用白色背景 + 深色文字，暗色模式同样适用
