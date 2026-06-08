## ADDED Requirements

### Requirement: 双列瀑布流布局
系统 SHALL 以双列瀑布流形式展示商品卡片，每张卡片包含商品图片、名称和价格。商品按"哪列更矮就放哪列"分配，保持两列视觉平衡。

#### Scenario: 正常加载商品卡片
- **GIVEN** 首页已渲染到瀑布流区域
- **WHEN** 首次加载 10 件商品数据
- **THEN** 两列展示商品卡片，每张卡片包含图片、名称、价格
- **AND** 价格使用品牌橙色 (#ff6b35) 显示

#### Scenario: 下拉无限加载
- **GIVEN** 瀑布流底部仍在视口内
- **WHEN** 用户滚动到接近底部（距离底部 < 200px）
- **THEN** 自动加载下一页 10 件商品
- **AND** 新商品追加到现有列表末尾

#### Scenario: 已到最后一页
- **GIVEN** 所有商品已加载完毕
- **WHEN** 用户滚动到底部
- **THEN** 底部显示"— 没有更多了 —"
- **AND** 不再触发加载请求

### Requirement: 空状态展示
当商品列表为空时，系统 SHALL 展示空状态提示。

#### Scenario: 商品数据为空
- **GIVEN** mock 商品数据返回空列表
- **WHEN** 瀑布流首次加载完成
- **THEN** 显示空状态插画和文案"暂无商品"

### Requirement: 加载锁防重复请求
系统 SHALL 在加载过程中阻止重复请求。

#### Scenario: 快速滚动不触发重复加载
- **GIVEN** 正在加载第 2 页商品
- **WHEN** 用户快速滚动到底部并回到顶部再滚到底部
- **THEN** 在 loading 状态为 true 期间，不发起新的加载请求

### Requirement: 商品点击跳转
每个商品卡片 SHALL 可点击，点击后跳转至商品详情页。

#### Scenario: 点击商品跳转详情
- **GIVEN** 瀑布流中展示了商品卡片
- **WHEN** 用户点击某张商品卡片
- **THEN** 页面跳转至商品详情页（placeholder，携带商品 ID）

### Requirement: 图片懒加载
所有商品图片 SHALL 使用 lazy loading 策略。

#### Scenario: 图片懒加载生效
- **GIVEN** 瀑布流加载了 20 件商品
- **WHEN** 用户只看到前 6 件商品
- **THEN** 只有可见区域的图片被加载，其余图片使用 `loading="lazy"` 延迟加载
