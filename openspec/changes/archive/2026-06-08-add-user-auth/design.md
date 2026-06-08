## Context

当前后端已有 users 表和 sessions 表的 ORM 模型，以及 `/api/db/users` CRUD 端点（无认证保护）。本次变更在现有基础上构建完整的用户认证体系：密码加密工具（bcrypt）、注册/登录/登出端点、Bearer Token 会话认证中间件、以及需登录才能访问的用户资料与地址管理端点。

## Goals / Non-Goals

**Goals:**
- 实现 bcrypt + 随机盐值的密码哈希与验证
- 实现注册端点（注册即登录，返回 session token）
- 实现登录/登出端点（Token 生成/销毁）
- 实现 `get_current_user` FastAPI 依赖注入（Bearer Token → User）
- 实现用户资料查询/修改端点（需认证）
- 实现收货地址 CRUD 端点（需认证，仅操作当前用户自己的地址）
- models.py 新增 Address ORM 模型
- schemas.py 新增认证与地址 Pydantic 模型

**Non-Goals:**
- Redis session 缓存（留给 9.4）
- JWT Token（本次用数据库 session UUID token）
- 现有 `/api/db/users` 端点的认证加固
- 前端对接

## Decisions

### Decision 1: 使用 bcrypt 而非 hashlib

**选择**: `bcrypt.hashpw(password.encode(), bcrypt.gensalt())` — 每次哈希自动生成内置盐值，无需手动管理 salt 字段。但仍保留 `users.salt` 列用于存储 bcrypt 内置盐的提取值（bcrypt 哈希前 29 字符即含盐）。
**原因**: bcrypt 是行业标准的密码哈希算法，内置抗暴力破解（work factor 可调），且 Python `bcrypt` 库简单易用。对比 SHA256，bcrypt 的单向性更强且速度故意设慢来防暴力破解。
**实际实现**: 鉴于与 Spec 明确要求的 `generate_salt()` + `hash_password(password, salt)` 接口对齐，我们采用 bcrypt 底层实现这两个函数——`generate_salt()` 返回 bcrypt.gensalt() 的字符串形式，`hash_password()` 内部使用 bcrypt.hashpw()。
**替代方案**: passlib — 功能更全但依赖重，对课堂场景过度；hashlib — 无内置盐，需手动拼接。

### Decision 2: Session Token 使用 Python uuid4

**选择**: Token = `str(uuid.uuid4())`，存入 `sessions.token` 列（已有 unique index），过期时间 = 创建时间 + 7 天。
**原因**: 延续 9.1 的 sessions 表设计，无需改表结构。UUID4 足够随机（碰撞概率可忽略），适合课堂场景。非 JWT——避免了密钥管理和 token 签发逻辑复杂性。
**替代方案**: JWT（RS256/HS256）— 生产环境标准但引入了密钥管理、过期刷新、黑色单等复杂度，对课堂作业过度。

### Decision 3: 认证通过 FastAPI Depends(get_current_user) 依赖注入实现

**选择**: `utils/deps.py` 导出一个 `get_current_user` 异步/同步函数，从 `Authorization: Bearer <token>` 提取 token，查 sessions 表找到 user_id，再查 users 表返回 User 对象。函数签名 `def get_current_user(db: Session = Depends(get_db), authorization: str = Header(...)) -> User`。
**原因**: FastAPI 的依赖注入机制原生支持 Header 参数 + Depends 链式调用。路由函数只需加 `current_user: User = Depends(get_current_user)` 即可获得当前登录用户。任何未通过认证的请求直接返回 401，不进入路由函数体。
**替代方案**: 中间件（Middleware）— 会对所有请求生效，不方便区分需认证和无需认证的端点。

### Decision 4: user_router 同时包含认证端点和业务端点

**选择**: `routers/user_router.py` 一个文件包含 `/api/auth/*` 和 `/api/user/*` 两组端点。使用单个 `APIRouter` 实例，内部通过函数级别的 Depends 控制认证要求。
**原因**: 两组端点共享相同的依赖（get_db、User 模型、AuthResponse schema），放在一个文件减少循环导入风险。按功能拆路由会导致 user_router 和 auth_router 互相引用。
**替代方案**: `auth_router.py` + `user_router.py` 两个文件 — 更清晰但多出一次 `include_router` 和可能的循环导入。

### Decision 5: 地址管理——仅操作当前登录用户的地址

**选择**: 所有 `/api/user/addresses` 端点隐含过滤 `user_id = current_user.id`，用户只能看到和操作自己的地址。Address 表的 `user_id` 由后端从 token 中获取，不由客户端传入。
**原因**: 安全基本原则——用户 A 不应能修改用户 B 的地址。`user_id` 从 token 派生而非请求体，消除越权风险。
**替代方案**: 允许传 `user_id` 并信任客户端 — 不安全，被拒绝。

## Risks / Trade-offs

- **bcrypt 库安装需 C 编译器**: Windows 环境可能编译失败。→ 优先尝试 `bcrypt` wheel 包（Python 3.11 有预编译版本），若不行则使用纯 Python 的 `bcrypt` 4.1+ 版本。
- **session 泄漏**: token 通过 HTTP Header 明文传输。→ 后续 Docker 部署时 Nginx 启用 HTTPS。
- **旧 seed 数据的密码字段不可登录**: 之前 Faker 生成的 `password_hash` 和 `salt` 是假值（sha256/md5），不是 bcrypt 哈希，无法通过 `verify_password` 验证。→ 旧用户只能通过 `/api/auth/register` 新注册才能登录，或运行新的 seed 脚本生成 bcrypt 格式数据。
