## Context

项目当前为零状态（Vite 空模板），需从零构建首页。无后端 API，所有数据使用本地 mock。部署于 GitHub Pages（base path: `/my-shop-website/`）。

## Goals / Non-Goals

**Goals:**
- 实现首页五层结构 + CTA 按钮
- 支持亮/暗模式切换，使用 Tailwind CSS `dark:` 前缀
- 所有数据本地 mock，无网络依赖
- 购物车数量通过 Zustand 全局共享

**Non-Goals:**
- 不做动画效果（轮播的 fade/slide 除外）
- 不做导航栏
- 不做后端 API
- 不做真实路由系统（分类/商品详情/搜索页用 placeholder）

## Decisions

| 决策 | 选择 | 理由 |
|------|------|------|
| 状态管理 | Zustand | 已安装，轻量，适合课堂项目 |
| 暗色模式 | Tailwind `dark:` + class 策略 | config.yaml 已约束 Tailwind CSS，`dark:` 前缀最简 |
| 轮播 | 纯 React 实现（useState + useEffect） | 无需第三方库，课堂项目保持依赖精简 |
| 瀑布流 | CSS `columns` 或 `grid` + JS 分配列 | 简单实现，无需虚拟列表（课堂数据量有限） |
| 图片 | 占位图服务 (picsum/placeholder) | 无后端，用外部占位图模拟商品图 |
| 路由跳转 | `<a>` 标签 + hash | 非本 change 范围，占位实现即可 |
| CTA 按钮位置 | 固定悬浮在 TabBar 上方 | 始终可见，不随滚动消失 |

### 组件树

```
HomePage
├── SearchBar            (sticky top)
│   ├── SearchInput      (点击 → placeholder 跳转)
│   └── CartIcon         (🛒 + 角标)
├── BannerCarousel       (全宽轮播)
│   └── BannerSlide × N  (单张 banner)
├── CategoryGrid         (2行×5列)
│   └── CategoryItem ×10 (圆形图标 + 文字)
├── ProductWaterfall     (双列瀑布流)
│   └── ProductCard × N  (图 + 名称 + 价格)
├── TabBar               (fixed bottom)
│   ├── TabItem (首页)
│   ├── TabItem (购物车, 带角标)
│   └── TabItem (我的)
└── CTAButton            (fixed, TabBar 上方)
```

### Zustand Stores

```
useCartStore:
  - items: CartItem[]
  - totalCount: number (derived)
  - addItem(item): void
  - removeItem(id): void

useThemeStore:
  - theme: 'light' | 'dark'
  - toggleTheme(): void
```

### Mock 数据

```
banners:    { id, imageUrl, link }[]
categories: { id, name, icon }[]          // 10 个
products:   { id, name, price, imageUrl }[] // 分页返回，每页 10 条
```

## Risks / Trade-offs

- **瀑布流 DOM 累积** → 单次 mock 数据限制最多 5 页（50 条商品），避免 DOM 膨胀
- **暗色模式闪烁** → 初始化时从 localStorage 读取 theme，在 `<html>` 上加 `dark` class，避免 FOUC
- **GitHub Pages base path** → 所有图片/资源路径需注意前缀
