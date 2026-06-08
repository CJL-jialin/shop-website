## ADDED Requirements

### Requirement: TabBar 购物车入口激活
系统 SHALL 在购物车页面（CartPage）将底部 TabBar 的"购物车"Tab 设置为高亮激活状态，替代首页的高亮状态。

#### Scenario: 购物车页面 Tab 高亮
- **GIVEN** 用户当前在购物车页面
- **WHEN** 页面渲染完成
- **THEN** TabBar 的"购物车" Tab 显示品牌橙色高亮
- **AND** "首页" Tab 显示灰色非激活态

### Requirement: TabBar "我的"入口激活
系统 SHALL 在个人中心页面及其子页面将底部 TabBar 的"我的"Tab 设置为高亮激活状态。

#### Scenario: 个人中心页面 Tab 高亮
- **GIVEN** 用户当前在个人中心页面或子页面
- **WHEN** 页面渲染完成
- **THEN** TabBar 的"我的" Tab 显示品牌橙色高亮
- **AND** "首页"和"购物车" Tab 显示灰色非激活态

### Requirement: 首页整体布局
系统 SHALL 以垂直滚动页面形式展示首页，包含以下固定顺序的五层结构：
搜索栏（固顶）、Banner 轮播、分类图标网格、双列商品瀑布流、底部 TabBar，以及固定在 TabBar 上方的 CTA 按钮。

#### Scenario: 首页正常加载
- **GIVEN** 用户访问网站根路径
- **WHEN** 首页组件挂载完成
- **THEN** 页面从上到下依次展示搜索栏、Banner 轮播、分类网格、瀑布流、CTA 按钮、TabBar
- **AND** 搜索栏和 TabBar 始终固定在视口顶部和底部

#### Scenario: 页面滚动时固定元素行为
- **GIVEN** 首页内容超出视口高度
- **WHEN** 用户向下滚动页面
- **THEN** 搜索栏始终固定在顶部（不随滚动隐藏）
- **AND** TabBar 始终固定在底部
- **AND** CTA 按钮始终显示在 TabBar 上方

### Requirement: 底部 TabBar 导航
系统 SHALL 在页面底部固定展示三个 Tab 入口：首页（跳转 `#/`）、购物车（跳转 `#/cart`，带角标）、我的（跳转 `#/profile`，即实际的个人中心页面 ProfilePage）。我的 Tab 点击后跳转至实际的个人中心页面。

#### Scenario: TabBar 始终可见
- **GIVEN** 用户在首页、购物车页面或个人中心页面任意滚动位置
- **WHEN** 用户查看页面底部
- **THEN** TabBar 固定显示在视口底部
- **AND** 当前页面对应的 Tab 处于高亮激活状态

#### Scenario: 购物车角标同步
- **GIVEN** 购物车中有 3 件商品
- **WHEN** 页面渲染完成
- **THEN** TabBar 的"购物车" Tab 显示角标数字 "3"

#### Scenario: 购物车为空时不显示角标
- **GIVEN** 购物车中商品数量为 0
- **WHEN** 页面渲染完成
- **THEN** TabBar 的"购物车" Tab 不显示角标

### Requirement: CTA 按钮
系统 SHALL 在 TabBar 上方固定展示一个 CTA 按钮，文案为"查看我的项目"，点击跳转至指定项目地址。

#### Scenario: CTA 按钮点击
- **GIVEN** 首页已加载
- **WHEN** 用户点击 CTA 按钮
- **THEN** 页面跳转至"我的项目"链接

#### Scenario: CTA 按钮在亮色和暗色模式下可见
- **GIVEN** 首页已加载
- **WHEN** 用户切换亮/暗模式
- **THEN** CTA 按钮在两种模式下均保持品牌橙色 (#ff6b35)，清晰可辨
