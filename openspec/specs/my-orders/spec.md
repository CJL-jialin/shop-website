## ADDED Requirements

### Requirement: 订单状态筛选
系统 SHALL 在订单页面顶部展示 5 个状态筛选 Tab：全部、待付款、待发货、待收货、待评价，点击切换筛选。

#### Scenario: 默认显示全部订单
- **GIVEN** 用户进入我的订单页面
- **WHEN** 页面渲染完成
- **THEN** "全部" Tab 高亮（品牌橙色下划线或文字）
- **AND** 显示所有订单

#### Scenario: 按状态筛选
- **GIVEN** 订单列表包含不同状态的订单
- **WHEN** 用户点击"待付款" Tab
- **THEN** 仅显示状态为"待付款"的订单

### Requirement: 订单列表展示
每条订单 SHALL 显示：订单编号、商品缩略图（40×40px 圆角）、商品名称、数量、金额（品牌橙色加粗）、订单状态标签。

#### Scenario: 订单列表渲染
- **GIVEN** 有 4 条 mock 订单
- **WHEN** 页面渲染完成
- **THEN** 展示 4 条订单，每条包含编号/缩略图/名称/数量/金额/状态

#### Scenario: 空订单状态
- **GIVEN** 某状态筛选后无订单
- **WHEN** 用户点击该状态 Tab
- **THEN** 显示空状态提示"暂无订单"

### Requirement: 返回导航
页面顶部 SHALL 有返回按钮，点击返回个人中心主页。

#### Scenario: 返回个人中心
- **GIVEN** 用户在订单子页面
- **WHEN** 用户点击返回按钮
- **THEN** 页面回到 `#/profile`
