## ADDED Requirements

### Requirement: 搜索栏固顶展示
系统 SHALL 在页面顶部固定展示搜索栏，包含搜索输入框（只读、点击跳转搜索页）和右侧购物车图标。

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

### Requirement: 购物车角标
系统 SHALL 在搜索栏右侧购物车图标上展示角标，显示当前购物车商品总数。数量来源为 Zustand `useCartStore`。

#### Scenario: 购物车有商品时显示角标
- **GIVEN** 购物车中有 5 件商品
- **WHEN** 首页渲染
- **THEN** 购物车图标右上角显示数字 "5"

#### Scenario: 购物车为空时隐藏角标
- **GIVEN** 购物车中商品数量为 0
- **WHEN** 首页渲染
- **THEN** 购物车图标不显示角标

#### Scenario: 角标数量超过 99 显示 "99+"
- **GIVEN** 购物车中有 150 件商品
- **WHEN** 首页渲染
- **THEN** 购物车图标右上角显示 "99+"

#### Scenario: 点击购物车图标跳转
- **GIVEN** 首页已加载
- **WHEN** 用户点击购物车图标
- **THEN** 页面跳转至购物车页（placeholder）
