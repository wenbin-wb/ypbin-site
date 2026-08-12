---
title: Admin 接口契约
description: ypbin-admin 全部接口的请求/响应契约、认证方式与数据结构。
---

# Admin 接口契约

以下为 ypbin-admin 后端全部接口的请求/响应契约、认证方式与数据结构，前后端按此对接。默认接口路径前缀 /api（由网关/代理转发到后端）。
## 1. 响应格式

所有接口统一返回 JSON，格式如下：

```json
{
  "code": 200,        // 业务码：200=成功，401=未登录，403=无权限
  "message": "操作成功",
  "data": <T>,        // 业务数据，失败时为 null
  "success": true,
  "timestamp": "2026-08-02 10:30:00"
}
```

- **HTTP 状态码恒为 200**（由 code 区分成功/失败）
- 分页响应 `data` 结构：`{ "items": [...], "total": N, "page": N, "pageSize": N, "pages": N }`
- Long 类型全部序列化为字符串（防 JS 精度丢失）

## 2. 认证

### 2.1 登录

```
POST /auth/login
Content-Type: application/json

请求体：
{
  "username": "admin",
  "password": "admin123"
}

响应 data：
{
  "accessToken": "e3f2a1..."
}
```

- 默认账号 admin / admin123
- 登录接口有频率限制（60 秒内最多 10 次）

### 2.2 第三方登录（OAuth）

支持的平台：github、gitee、qq、wechat_open、alipay、dingtalk（需后台 sys_config 配置对应 clientId/secret/redirectUri）。

```
获取可用平台列表：
GET  /auth/social/platforms        → string[]（["github","gitee",...]）

生成授权跳转 URL：
GET  /auth/social/authorize/{source}  → 返回授权 URL 字符串

前端拿到 URL 后跳转（window.location.href），用户授权后第三方回调到后端。
后端处理回调+登录：
POST /auth/social/callback/{source}?code=xxx&state=xxx  → LoginResp（同账号登录，返回 { "accessToken": "..." }）

已登录用户绑定第三方账号：
POST /auth/social/bind/{source}?code=xxx&state=xxx

已登录用户解绑：
POST /auth/social/unbind/{source}

当前用户已绑定平台：
GET  /auth/social/bindings  → string[]
```

- 首次使用某平台登录：自动创建用户（用户名格式 `{platform}_{openId}`）并绑定
- 已绑定过：直接登录

### 2.3 手机验证码登录

```
发送验证码：
POST /auth/sms/send?phone=13800138000
响应：code=200（成功发送）

验证码登录：
POST /auth/sms/login
{ "phone": "13800138000", "code": "123456" }
响应：同账号登录，返回 { "accessToken": "..." }
```

- 短信验证码登录需系统参数 `LOGIN_SMS_ENABLED=true` 才开启
- 发送接口有频率限制（60 秒内每 IP 最多 5 次）

### 2.4 Token 携带方式

所有需登录的请求，在请求头携带：

```
Authorization: Bearer <accessToken>
```

### 2.5 登录后必须调用的接口

登录成功后，按顺序调用以下接口获取用户信息、权限和菜单：

```
GET /user/info          → UserInfo（用户基本信息 + 权限码 + 角色码）
GET /auth/codes         → string[]（权限码集合）
GET /menu/all           → RouteRecord[]（路由树，排除按钮）
```

### 2.7 退出登录

```
POST /auth/logout
```

### 2.6 未登录处理

后端返回 `code: 401`，HTTP 200。前端拦截器检测到 401 应清除 token 并跳转登录页。

## 3. 个人中心

```
GET  /user/profile        → UserResp（当前用户信息）
PUT  /user/profile        → 更新个人信息（realName/nickname/avatar/phone/email/gender）
PUT  /user/profile/password → 修改密码 { "oldPassword": "...", "newPassword": "..." }
```

## 4. 验证码

```
GET  /captcha             → 获取行为验证码（滑块/旋转/点选），开关由 LOGIN_CAPTCHA_ENABLED 控制
POST /captcha/verify?id=xxx → 校验验证码，请求体为 ImageCaptchaTrack（前端采集的行为轨迹）
```

## 5. 系统管理接口

以下接口均需登录 + 对应权限，统一前缀 `/system/`。

### 5.1 用户管理

```
GET    /system/user/list?page=1&pageSize=20&username=zhang&status=1   → PageResult<UserResp>
GET    /system/user/{id}     → UserResp（含 roleIds, postIds）
POST   /system/user          → 新增用户
PUT    /system/user/{id}     → 编辑用户
DELETE /system/user/{id}     → 删除用户
```

**UserResp 字段:**

| 字段 | 类型 | 说明 |
|---|---|---|
| id | string(Long) | 用户 ID |
| username | string | 登录账号 |
| realName | string | 真实姓名 |
| nickname | string | 昵称 |
| deptId | string(Long) | 部门 ID |
| deptIdText | string | 部门名称（派生字段，@RefText 输出） |
| avatar | string | 头像 |
| phone | string | 手机号（脱敏：138****8000） |
| email | string | 邮箱（脱敏：z***@example.com） |
| gender | integer | 性别：0未知/1男/2女 |
| genderText | string | 性别文本（派生字段，如"男"） |
| status | integer | 状态：1正常/0禁用 |
| statusText | string | 状态文本（派生字段，如"正常"） |
| roleIds | string[] | 已分配角色 ID |
| postIds | string[] | 已分配岗位 ID |
| createUser | string(Long) | 创建人 ID |
| createUserName | string | 创建人姓名（派生字段） |
| lastLoginTime | datetime | 最后登录时间 |
| createTime | datetime | 创建时间 |

**UserSaveReq 字段:**

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| username | string | 是 | 登录账号 |
| password | string | 新增必填 | 密码（编辑留空=不改密） |
| realName | string | 是 | 真实姓名 |
| nickname | string | 否 | |
| deptId | long | 否 | |
| avatar | string | 否 | |
| phone | string | 否 | |
| email | string | 否 | |
| gender | integer | 否 | |
| status | integer | 否 | |
| remark | string | 否 | |
| roleIds | long[] | 否 | null=不改动, 空数组=清空角色 |
| postIds | long[] | 否 | null=不改动, 空数组=清空岗位 |

### 5.2 角色管理

```
GET    /system/role/list?page=1&pageSize=20&name=&status=  → PageResult<RoleResp>
GET    /system/role/all                                    → RoleResp[]（下拉用）
POST   /system/role              → 新增角色
PUT    /system/role/{id}         → 编辑角色
DELETE /system/role/{id}         → 删除角色
```

**RoleSaveReq 字段:** name(必填), code(必填), dataScope, sort, status, remark, **permissions**(long[], 菜单ID集合)

**RoleResp 字段:** id, name, code, dataScope, sort, status, remark, createTime, **permissions**(long[])

### 5.3 菜单管理

```
GET  /system/menu/list                       → MenuResp[]（树形，含按钮）
GET  /system/menu/name-exists?name=xxx&id=   → boolean
GET  /system/menu/path-exists?path=xxx&id=   → boolean
POST /system/menu                            → 新增菜单
PUT  /system/menu/{id}                       → 编辑菜单
DELETE /system/menu/{id}                     → 删除菜单
```

**MenuSaveReq 字段:** pid, name(必填), type(必填:catalog/menu/button/embedded/link), path, component, authCode, redirect, title, icon, activeIcon, sort, status, keepAlive, hideInMenu, iframeSrc, link

**MenuResp 字段:** id, pid, name, type, path, component, authCode, redirect, status, meta{title,icon,activeIcon,order,keepAlive,hideInMenu,iframeSrc,link}, children

### 5.4 部门管理

```
GET    /system/dept/list    → DeptResp[]（树形）
POST   /system/dept         → 新增部门
PUT    /system/dept/{id}    → 编辑部门
DELETE /system/dept/{id}    → 删除部门
```

**DeptSaveReq:** pid, name(必填), sort, leader, phone, email, status, remark

### 5.5 岗位管理

```
GET    /system/post/list    → SysPost[]
POST   /system/post         → 新增岗位
PUT    /system/post/{id}    → 编辑岗位
DELETE /system/post/{id}    → 删除岗位
```

### 5.6 数据字典

```
GET  /system/dict/list?page=1&pageSize=20&name=&code=   → PageResult<DictResp>
GET  /system/dict-item/list?dictId=                      → DictItemResp[]
GET  /system/dict-item/options/{dictCode}                → DictItem[]（下拉用，走缓存）
POST /system/dict                                        → 新增字典
PUT  /system/dict/{id}                                   → 编辑字典
DELETE /system/dict/{id}                                 → 删除字典
POST /system/dict-item                                   → 新增字典项
PUT  /system/dict-item/{id}                              → 编辑字典项
DELETE /system/dict-item/{id}                            → 删除字典项
```

内置字典编码：`sys_status`（正常/禁用）、`sys_gender`（性别）。

### 5.7 系统参数

```
GET    /system/config/list?page=1&configGroup=password  → PageResult<ConfigResp>
GET    /system/config/group/{configGroup}                → ConfigResp[]
POST   /system/config                                   → 新增参数
PUT    /system/config/{id}                               → 编辑参数
PUT    /system/config/batch                              → 批量保存 { "configs": { "KEY": "value", ... } }
DELETE /system/config/{id}                               → 删除参数
```

已内置的分组：site、login、password、sms、mail。

### 5.8 客户端管理

```
GET    /system/client/list    → SysClient[]
POST   /system/client         → 新增
PUT    /system/client/{id}    → 编辑
DELETE /system/client/{id}    → 删除
```

### 5.9 日志管理

```
GET /system/log/list?page=1&pageSize=20&module=认证&success=1&startTime=xxx&endTime=xxx → PageResult<LogResp>
```

### 5.10 在线用户

```
GET    /system/online-user/list?keyword=     → OnlineUser[]
DELETE /system/online-user/{token}           → 强制下线
```

### 5.11 租户管理

```
GET    /system/tenant/list    → SysTenant[]
POST   /system/tenant         → 新增
PUT    /system/tenant/{id}    → 编辑
DELETE /system/tenant/{id}    → 删除
```

### 5.12 文件管理

```
POST   /system/file/upload?module=avatar    → FormData(file)，返回 FileInfo
GET    /system/file/list?page=1&pageSize=20 → PageResult<SysFile>
DELETE /system/file/{id}                    → 删除
```

### 5.13 公告管理

```
GET    /system/notice/list    → SysNotice[]
POST   /system/notice         → 新增
PUT    /system/notice/{id}    → 编辑
DELETE /system/notice/{id}    → 删除
```

### 5.14 定时任务

```
GET    /system/job/list        → SysJob[]
GET    /system/job/log/{jobId} → PageResult<JobLogResp>
POST   /system/job             → 新增
PUT    /system/job/{id}        → 编辑
DELETE /system/job/{id}        → 删除
POST   /system/job/{id}/start  → 启动调度
POST   /system/job/{id}/stop   → 停止调度
POST   /system/job/{id}/run    → 立即执行
```

### 5.15 开放应用管理

```
GET    /system/app/list    → SysApp[]
POST   /system/app         → 新增
PUT    /system/app/{id}    → 编辑
DELETE /system/app/{id}    → 删除
```

### 5.16 邮件测试

```
POST /system/mail/test?to=xxx@example.com    → 发送测试邮件
```

## 6. 仪表盘

```
GET /dashboard/stats → { "userCount": N }
```

## 7. 消息推送

```
GET  /user/messages/unread-count   → long（未读消息数）
POST /system/push/test?userId=xxx  → 推送测试（调试用）
```

## 8. 前端路由结构（GET /menu/all）

返回 `RouteRecord[]`，结构如下：

```json
[
  {
    "name": "Dashboard",
    "path": "/dashboard",
    "component": "BasicLayout",
    "meta": { "title": "page.dashboard.title", "icon": "lucide:layout-dashboard", "order": -1 },
    "children": [
      {
        "name": "Analytics",
        "path": "/dashboard/analytics",
        "component": "/dashboard/analytics/index",
        "meta": { "title": "page.dashboard.analytics", "icon": "lucide:area-chart", "order": 1, "keepAlive": true }
      }
    ]
  }
]
```

- **catalog** 类型：顶层目录，component 为 `BasicLayout`，有 children
- **menu** 类型：具体页面，component 为页面文件路径
- **button** 类型：不进路由树，仅进 `/auth/codes` 作为权限码
- **embedded** 类型：内嵌 iframe，meta.iframeSrc 填地址
- **link** 类型：外链，meta.link 填地址

## 9. 权限模型

- **权限码**：即菜单表中 `auth_code` 字段（如 `system:user:list`）
- 用户 → 角色 → 菜单（auth_code），多条角色取并集
- 超级管理员（角色标识=super）有通配权限 `*:*:*`，跳过所有权限校验
- 每个系统管理页面都有对应的 list/add/edit/delete 四个按钮级权限码
- 前端用权限码控制按钮显隐

## 10. 数据字典与派生字段

- `@DictText` 标注的字段会额外输出一个同名+Text 后缀的文本字段（如 `gender` → `genderText`）
- `@RefText` 标注的 ID 字段会额外输出一个同名+Name 后缀的名称字段（如 `createUser` → `createUserName`）
- 这些由后端序列化时自动处理，前端直接使用，无需额外请求

## 11. 数据脱敏

- `@Sensitive` 标注的字段（如 phone、email）后端序列化时自动脱敏
- 脱敏规则：手机号保留前 3 后 4、邮箱保留首字符

## 12. 关键系统参数

| 键 | 默认值 | 说明 |
|---|---|---|
| LOGIN_CAPTCHA_ENABLED | false | 登录验证码开关 |
| LOGIN_SMS_ENABLED | false | 短信验证码登录开关 |
| PASSWORD_MIN_LENGTH | 8 | 密码最小长度 |
| PASSWORD_ERROR_LOCK_COUNT | 5 | 登录错误锁定阈值 |
| PASSWORD_LOCK_MINUTES | 15 | 锁定时长(分钟) |
| SMS_CODE_EXPIRE_SECONDS | 300 | 短信验证码有效期 |
| SOCIAL_{PLATFORM}_CLIENT_ID | (空) | 第三方登录 ClientId，PLATFORM 为 GITHUB/GITEE/QQ/WECHAT_OPEN/ALIPAY/DINGTALK |
| SOCIAL_{PLATFORM}_CLIENT_SECRET | (空) | 第三方登录 ClientSecret |
| SOCIAL_{PLATFORM}_REDIRECT_URI | (空) | 第三方登录回调地址 |

