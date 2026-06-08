## ADDED Requirements

### Requirement: Faker 假用户生成
系统 SHALL 在 `backend/app/seed.py` 中实现假数据填充脚本，使用 Python Faker 库生成数据。

脚本执行流程 SHALL 为：
1. 导入所有模型和 `Base`，调用 `Base.metadata.create_all()` 自动建表（如表已存在则跳过）
2. 创建数据库会话
3. 使用 Faker 生成 10 个用户，每用户至少包含：`username`（唯一）、`password_hash`（随机哈希字符串）、`salt`（随机字符串）、`name`（中文姓名）、`avatar`（随机头像 URL 或空值）、`member_level`（默认为 "普通会员"）、`phone`（中国手机号格式）
4. 将 10 个用户通过 `db.add_all()` 批量写入
5. 为每个用户随机生成 1 到 2 条会话记录，每条记录包含：`user_id`（关联对应用户）、`token`（Python `uuid4` 生成的唯一字符串）、`expires_at`（创建时间 + 7 天）
6. 将所有会话记录通过 `db.add_all()` 批量写入
7. 提交事务并关闭会话

#### Scenario: 首次运行 seed 脚本
- **GIVEN** PostgreSQL 数据库可连接，`users` 和 `sessions` 表不存在
- **WHEN** 执行 `python seed.py`
- **THEN** 数据库中新建 `users` 表（含 10 条用户记录）和 `sessions` 表（含 10-20 条会话记录），且所有外键关联正确

#### Scenario: 重复运行 seed 脚本不报错
- **GIVEN** `users` 和 `sessions` 表已存在且已有数据
- **WHEN** 再次执行 `python seed.py`
- **THEN** 脚本正常完成不抛出异常，数据库记录数变为上次的 2 倍（追加模式）

### Requirement: 假用户数据质量
每个通过 Faker 生成的用户 SHALL 满足以下约束：
- `username` 为英文小写字母加数字组成，长度 6-20 字符，10 个用户彼此不重复
- `name` 为 2-3 个汉字的真实风格中文名
- `phone` 为中国大陆 11 位手机号格式
- `member_level` 默认值为 "普通会员"，本阶段所有用户均为此级别

#### Scenario: 验证生成用户的数据格式
- **GIVEN** seed 脚本已执行完成
- **WHEN** 查询 `users` 表中任意一条记录
- **THEN** `username` 匹配 `^[a-z][a-z0-9]{5,19}$` 模式，`name` 为中文字符，`phone` 为 11 位数字，`member_level` 为 "普通会员"

### Requirement: 假会话数据质量
每个通过 Faker 生成的会话 SHALL 满足以下约束：
- `token` 为 UUID 4 格式字符串（`xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`），不重复
- `expires_at` 严格大于 `created_at`，且差值等于 7 天
- `user_id` 指向 `users` 表中存在的用户

#### Scenario: 验证生成会话的数据格式
- **GIVEN** seed 脚本已执行完成
- **WHEN** 查询 `sessions` 表中任意一条记录
- **THEN** `token` 符合 UUID4 格式，`expires_at` 为 `created_at + 7 天`，`user_id` 对应 `users` 表中的有效主键

#### Scenario: 每个用户至少有一条会话
- **GIVEN** seed 脚本已执行完成
- **WHEN** 对每个用户查询其在 `sessions` 表中的记录数
- **THEN** 每用户至少有 1 条会话记录，不超过 2 条
