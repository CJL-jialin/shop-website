## ADDED Requirements

### Requirement: 自动轮播
系统 SHALL 以 3 秒间隔自动切换 Banner 图片。Banner 数量为 3~4 张，全宽展示。

#### Scenario: 正常自动播放
- **GIVEN** Banner 区域有 3 张图片
- **WHEN** 首页加载完成且用户未进行任何操作
- **THEN** 每 3 秒自动切换到下一张
- **AND** 切换到最后一张后，下一张回到第一张（循环）

#### Scenario: 只有 1 张 Banner 时禁用自动播放
- **GIVEN** Banner 区域只有 1 张图片
- **WHEN** 首页加载完成
- **THEN** 不启动自动轮播计时器
- **AND** 不显示圆点指示器

#### Scenario: 用户手动滑动后重置计时器
- **GIVEN** 自动轮播正在运行
- **WHEN** 用户手动向左或向右滑动 Banner
- **THEN** 切换到对应图片
- **AND** 自动轮播计时器重置为 3 秒

### Requirement: 圆点指示器
系统 SHALL 在 Banner 底部显示圆点指示器，标识当前图片位置和总数。

#### Scenario: 圆点随轮播更新
- **GIVEN** Banner 有 3 张图片，当前在第 1 张
- **WHEN** 自动或手动切换到第 2 张
- **THEN** 第 2 个圆点高亮，其余圆点暗色

### Requirement: Banner 点击跳转
每张 Banner 图片 SHALL 可点击，点击后跳转至对应链接。

#### Scenario: 点击 Banner 跳转
- **GIVEN** 第 1 张 Banner 配置了跳转链接
- **WHEN** 用户点击该 Banner
- **THEN** 页面跳转至对应链接

#### Scenario: Banner 图片加载失败
- **GIVEN** 某张 Banner 图片 URL 无效
- **WHEN** 该图片加载失败
- **THEN** 显示灰色占位图替代
