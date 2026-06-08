## ADDED Requirements

### Requirement: 设置列表展示
系统 SHALL 展示四项设置：修改昵称、修改手机号、关于我们、退出登录。每行右侧带箭头，"退出登录"文字使用红色。

#### Scenario: 设置列表渲染
- **GIVEN** 用户进入设置页面
- **WHEN** 页面渲染完成
- **THEN** 显示"修改昵称"（灰色箭头）、"修改手机号"（灰色箭头）、"关于我们"（灰色箭头）、"退出登录"（红色文字）四项

#### Scenario: 点击修改昵称/手机号/关于我们
- **GIVEN** 用户在设置页面
- **WHEN** 用户点击"修改昵称"
- **THEN** Toast 提示"功能开发中"

### Requirement: 退出登录
用户点击"退出登录"后，系统 SHALL 弹出 Toast "已退出"，并跳转回首页。

#### Scenario: 退出登录流程
- **GIVEN** 用户在设置页面
- **WHEN** 用户点击"退出登录"
- **THEN** Toast 显示"已退出"
- **AND** 页面跳转至首页 `#/`

### Requirement: 返回导航
页面顶部 SHALL 有返回按钮，点击返回个人中心主页。

#### Scenario: 返回个人中心
- **GIVEN** 用户在设置子页面
- **WHEN** 用户点击返回按钮
- **THEN** 页面回到 `#/profile`
