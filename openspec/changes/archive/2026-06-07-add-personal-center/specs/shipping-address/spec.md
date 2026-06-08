## ADDED Requirements

### Requirement: 地址列表展示
系统 SHALL 展示收货地址列表，每条地址显示：收件人姓名、脱敏手机号（如 139****1234）、详细地址、默认标签（红底白字小标签）。

#### Scenario: 地址列表渲染
- **GIVEN** 有 3 条 mock 地址
- **WHEN** 用户进入收货地址页面
- **THEN** 展示 3 条地址，每条包含姓名/脱敏手机/地址/默认标签

#### Scenario: 空地址状态
- **GIVEN** 地址列表为空
- **WHEN** 用户进入收货地址页面
- **THEN** 显示空状态提示"暂无收货地址"

### Requirement: 新增地址按钮
页面底部 SHALL 固定"新增地址"按钮（品牌橙色圆角填充）。

#### Scenario: 点击新增地址
- **GIVEN** 用户进入收货地址页面
- **WHEN** 用户点击"新增地址"按钮
- **THEN** Toast 提示"功能开发中"

### Requirement: 返回导航
页面顶部 SHALL 有返回按钮，点击返回个人中心主页。

#### Scenario: 返回个人中心
- **GIVEN** 用户在收货地址子页面
- **WHEN** 用户点击返回按钮
- **THEN** 页面回到 `#/profile`
