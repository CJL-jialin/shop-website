## ADDED Requirements

### Requirement: 购物车角标数据联动
搜索栏购物车图标角标 SHALL 读取 `useCartStore.allCount`（全部商品件数），数据变更时自动同步更新，无需手动刷新。

#### Scenario: 添加商品后角标自动更新
- **GIVEN** 用户在商品详情页点击"加入购物车"
- **WHEN** store 中 allCount 从 3 变为 4
- **THEN** 搜索栏购物车角标自动显示 "4"

#### Scenario: 结算后角标自动更新
- **GIVEN** 购物车中有 5 件商品，其中 3 件已选中
- **WHEN** 用户完成结算，已选中商品被清空
- **THEN** 角标自动更新为剩余 2 件的数量

## MODIFIED Requirements

### Requirement: 搜索栏固顶展示
系统 SHALL 在页面顶部固定展示搜索栏，包含搜索输入框（只读、点击跳转搜索页）和右侧购物车图标。购物车图标点击后跳转至实际的购物车页面（CartPage）。

#### Scenario: 搜索栏基本展示
- **GIVEN** 用户访问首页
- **WHEN** 首页渲染完成
- **THEN** 搜索栏固定在视口顶部
- **AND** 搜索框内显示占位文字（如"搜索商品"）
- **AND** 右侧显示购物车图标

#### Scenario: 点击搜索框跳转
- **GIVEN** 首页已加载
- **WHEN** 用户点击搜索输入框
- **THEN** 页面跳转至搜索页（placeholder）

#### Scenario: 点击购物车图标跳转
- **GIVEN** 首页已加载
- **WHEN** 用户点击购物车图标
- **THEN** 页面跳转至购物车页（CartPage）
