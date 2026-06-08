## ADDED Requirements

### Requirement: TabBar "我的"入口激活
系统 SHALL 在个人中心页面及其子页面将底部 TabBar 的"我的"Tab 设置为高亮激活状态。

#### Scenario: 个人中心页面 Tab 高亮
- **GIVEN** 用户当前在个人中心页面或子页面
- **WHEN** 页面渲染完成
- **THEN** TabBar 的"我的" Tab 显示品牌橙色高亮
- **AND** "首页"和"购物车" Tab 显示灰色非激活态

## MODIFIED Requirements

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
