## ADDED Requirements

### Requirement: 购物车数据结构
系统 SHALL 使用 Zustand `useCartStore` 管理购物车，每个购物车项包含：itemId（productId+规格组合）、productId、商品名称、规格描述、单价、数量、库存上限、图片地址、是否选中。

#### Scenario: 商品项默认选中
- **GIVEN** 用户通过"加入购物车"操作添加商品
- **WHEN** 商品被添加到购物车
- **THEN** 该商品的 `selected` 字段默认为 `true`

### Requirement: 同商品同规格累加
当添加的商品 itemId 与已有商品相同时，系统 SHALL 累加数量而非新增一行。

#### Scenario: 重复添加同规格商品
- **GIVEN** 购物车中已有 iPhone 16 Pro Max（深空黑）×1
- **WHEN** 再次添加 iPhone 16 Pro Max（深空黑）
- **THEN** 该商品数量变为 2，购物车行数不变

#### Scenario: 不同规格视为不同行
- **GIVEN** 购物车中已有 iPhone 16 Pro Max（深空黑）×1
- **WHEN** 添加 iPhone 16 Pro Max（银色）
- **THEN** 购物车新增一行 iPhone 16 Pro Max（银色）×1

### Requirement: 数量步进与库存限制
系统 SHALL 支持数量步进器增减商品数量，最小值为 1，最大值为库存上限。数量达到库存上限时，增加按钮置灰不可点击。

#### Scenario: 正常增减数量
- **GIVEN** 某商品当前数量为 2，库存为 99
- **WHEN** 用户点击 + 按钮
- **THEN** 数量变为 3

#### Scenario: 数量不得低于 1
- **GIVEN** 某商品当前数量为 1
- **WHEN** 用户点击 - 按钮
- **THEN** 数量保持为 1，- 按钮置灰

#### Scenario: 数量达到库存上限时禁止增加
- **GIVEN** 某商品当前数量为 99，库存为 99
- **WHEN** 用户尝试点击 + 按钮
- **THEN** + 按钮置灰不可点击，数量保持为 99

### Requirement: 选中与取消选中
系统 SHALL 支持用户切换单个商品的选中状态。

#### Scenario: 取消选中
- **GIVEN** 某商品当前为选中状态
- **WHEN** 用户点击该商品的 checkbox
- **THEN** checkbox 变为灰色圆环未选中态，该商品不计入结算

#### Scenario: 重新选中
- **GIVEN** 某商品当前为未选中状态
- **WHEN** 用户点击该商品的 checkbox
- **THEN** checkbox 变为品牌橙色填充选中态，该商品计入结算

### Requirement: 全选与取消全选
系统 SHALL 支持一键全选或取消全选所有商品。

#### Scenario: 全选
- **GIVEN** 购物车中有 3 件商品，其中 2 件已选中
- **WHEN** 用户点击底部结算栏的"全选" checkbox
- **THEN** 所有 3 件商品变为选中状态

#### Scenario: 取消全选
- **GIVEN** 购物车中有 3 件商品，全部已选中
- **WHEN** 用户再次点击"全选" checkbox
- **THEN** 所有商品变为未选中状态

### Requirement: 计算属性
系统 SHALL 提供以下计算属性：全部件数（allCount）、已选件数（selectedCount）、已选总价（selectedTotal）、是否全选（isAllSelected）。

#### Scenario: 计算属性随操作实时更新
- **GIVEN** 购物车中有 2 件商品，各 ×2，全部选中，单价分别为 ¥100 和 ¥200
- **WHEN** 用户取消选中其中 1 件
- **THEN** allCount = 4，selectedCount = 2，selectedTotal = ¥200（取决于哪件被取消）

### Requirement: 结算操作
系统 SHALL 支持结算操作：清空所有已选中商品，并返回 Toast 提示文案"下单成功！"。

#### Scenario: 结算已选商品
- **GIVEN** 购物车中有 5 件商品，其中 3 件已选中
- **WHEN** 用户点击"去结算"按钮
- **THEN** 已选中的 3 件商品从购物车中移除
- **AND** 未选中的 2 件保留
- **AND** 返回 Toast 提示消息

#### Scenario: 无选中商品时结算按钮置灰
- **GIVEN** 购物车中所有商品均为未选中状态
- **WHEN** 用户查看底部结算栏
- **THEN** "去结算"按钮置灰不可点击

### Requirement: 删除商品
系统 SHALL 支持删除单个商品。

#### Scenario: 删除商品
- **GIVEN** 购物车中有 3 件商品
- **WHEN** 用户确认删除其中 1 件
- **THEN** 该商品从购物车中移除，剩余 2 件
- **AND** allCount 同步更新
