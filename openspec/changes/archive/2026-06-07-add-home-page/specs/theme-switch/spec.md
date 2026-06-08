## ADDED Requirements

### Requirement: 亮/暗模式切换
系统 SHALL 支持亮色和暗色两种主题模式，通过切换按钮在两种模式间切换。主题状态存储在 Zustand `useThemeStore` 中，并持久化到 `localStorage`。

#### Scenario: 默认亮色模式
- **GIVEN** 用户首次访问网站，localStorage 中无主题记录
- **WHEN** 首页加载完成
- **THEN** 页面以亮色模式渲染

#### Scenario: 切换到暗色模式
- **GIVEN** 当前为亮色模式
- **WHEN** 用户点击主题切换按钮
- **THEN** 页面切换为暗色模式
- **AND** `<html>` 元素添加 `dark` class
- **AND** 所有使用 `dark:` 前缀的 Tailwind 样式生效

#### Scenario: 记住用户主题偏好
- **GIVEN** 用户已切换到暗色模式
- **WHEN** 用户刷新页面或下次访问
- **THEN** 页面自动以暗色模式渲染（从 localStorage 读取）

#### Scenario: 切换按钮位置
- **GIVEN** 首页已加载
- **WHEN** 用户查看搜索栏区域
- **THEN** 主题切换按钮显示在搜索栏左侧或搜索框内，易于发现和点击

#### Scenario: 暗色模式下所有组件正常工作
- **GIVEN** 当前为暗色模式
- **WHEN** 用户浏览首页各区域（搜索栏、Banner、分类、瀑布流、TabBar、CTA）
- **THEN** 所有文字在暗色背景下可读
- **AND** 品牌橙色 (#ff6b35) 在暗色背景下仍具有足够对比度
- **AND** 商品卡片背景与页面背景有明显区分
