## Phase 1: 基础架构与数据层

- [x] 1.1 创建 `src/stores/useCartStore.ts`：购物车状态管理（items, totalCount, addItem, removeItem）
- [x] 1.2 创建 `src/stores/useThemeStore.ts`：主题状态管理（theme, toggleTheme），持久化到 localStorage
- [x] 1.3 创建 `src/mock/` 目录及 mock 数据文件（banners.ts, categories.ts, products.ts）
- [x] 1.4 在 `src/index.css` 中定义品牌色 CSS 变量（`--color-brand: #ff6b35`），配置 Tailwind `dark:` 策略
- [x] 1.5 在 `index.html` 的 `<html>` 标签添加初始化脚本，从 localStorage 读取 theme 并设置 `dark` class（防止 FOUC）

## Phase 2: 静态 UI 组件

- [x] 2.1 创建 `SearchBar` 组件：搜索框 + 购物车图标 + 角标（>99 显示 99+，=0 隐藏角标）
- [x] 2.2 创建 `BannerCarousel` 组件：全宽轮播、自动播放（3s）、手动滑动、圆点指示器、图片 onError 占位
- [x] 2.3 创建 `CategoryGrid` 组件：2 行 × 5 列圆形图标网格、文字标签、图标 onError 占位
- [x] 2.4 创建 `ProductCard` 组件：图片 + 名称 + 价格（品牌橙色）、lazy loading
- [x] 2.5 创建 `TabBar` 组件：首页/购物车/我的三个入口，购物车角标与 SearchBar 共享 store
- [x] 2.6 创建 `CTAButton` 组件：固定在 TabBar 上方，品牌橙色背景，点击跳转"我的项目"

## Phase 3: 瀑布流与无限加载

- [x] 3.1 创建 `ProductWaterfall` 组件：双列布局、按列高度分配商品、调用 mock 数据
- [x] 3.2 实现无限加载逻辑：滚动到底部 200px 触发、loading 锁防重复、最后一页显示"— 没有更多了 —"
- [x] 3.3 实现空状态展示：商品列表为空时显示"暂无商品"提示

## Phase 4: 首页组装与主题切换

- [x] 4.1 创建 `HomePage` 页面组件，组装所有子组件，处理整体滚动布局
- [x] 4.2 在 SearchBar 区域添加主题切换按钮，调用 `useThemeStore.toggleTheme()`
- [x] 4.3 验证暗色模式下所有组件可读性（品牌色对比度、卡片背景区分）
- [x] 4.4 本地启动 `npm run dev`，验证首页完整功能并修复问题
