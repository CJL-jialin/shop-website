## ADDED Requirements

### Requirement: 分类网格展示
系统 SHALL 以 2 行 × 5 列的网格布局展示 10 个商品品类，每个品类包含圆形图标和文字标签。

#### Scenario: 正常加载 10 个品类
- **GIVEN** 分类数据有 10 个品类
- **WHEN** 首页渲染完成
- **THEN** 页面展示 2 行，每行 5 个品类
- **AND** 每个品类显示圆形图标和名称

#### Scenario: 品类不足 10 个
- **GIVEN** 分类数据只有 7 个品类
- **WHEN** 首页渲染完成
- **THEN** 第一行展示 5 个，第二行展示 2 个，剩余 3 个位置留空

#### Scenario: 图标加载失败
- **GIVEN** 某个分类的图标 URL 无效
- **WHEN** 该图标加载失败
- **THEN** 显示灰色圆形占位图标替代

### Requirement: 分类点击跳转
每个分类项 SHALL 可点击，点击后跳转至对应分类商品列表页。

#### Scenario: 点击分类跳转
- **GIVEN** "汉堡" 分类已渲染
- **WHEN** 用户点击该分类
- **THEN** 页面跳转至分类页（placeholder，携带分类 ID 或名称作为参数）
