## Why

当前项目仅有 Vite 脚手架的空模板，用户进入网站后无任何内容展示，无法浏览商品、使用购物车或搜索。
Home page 是电商下单系统的入口页面，需要承载商品发现、分类导航、促销展示、购物车入口等核心功能，
因此作为第一个实现的功能模块。

## What Changes

- 新增 Home Page，包含五层结构：搜索栏（固顶）、Banner 轮播、分类图标网格、双列商品瀑布流、底部 TabBar
- 新增独立的 CTA 按钮，跳转至"我的项目"
- 新增亮/暗模式切换功能（支持 Tailwind CSS dark: 前缀）
- 所有数据初始化为本地 mock 数据，不依赖后端 API
- 使用 Zustand 管理购物车数量和主题状态

## Capabilities

### New Capabilities

- `home-page`: 首页整体布局，包含五层结构（搜索栏、Banner、分类网格、瀑布流、TabBar）及 CTA 按钮
- `search-bar`: 顶部固定搜索栏，带购物车图标与角标（读取 Zustand 购物车数量）
- `banner-carousel`: 全宽图片轮播，自动播放（3秒）、手动滑动、圆点指示器，图片可点击跳转
- `category-grid`: 2行×5列分类图标网格，圆形图标+文字标签，点击跳转分类页
- `product-waterfall`: 双列瀑布流商品卡片（图片+名称+价格），下拉无限加载
- `theme-switch`: 亮/暗模式切换，全局状态管理（Zustand），Tailwind CSS dark: 前缀驱动

### Modified Capabilities

<!-- 项目全新，无已有 spec 需要修改 -->
无

## Impact

- 新增文件：`src/components/` 下各组件、`src/stores/` 下 Zustand store、`src/pages/HomePage.tsx`、mock 数据文件
- 依赖项：Zustand（已安装）、Tailwind CSS v4（已配置）
- 路由：需引入 React Router 用于页面跳转（非本 change 范围，使用占位路由或 a 标签）
- 无 breaking changes（项目当前为空模板）
