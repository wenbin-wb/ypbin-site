---
title: Admin 接口契约
description: ypbin-admin 全部接口的请求/响应契约、认证方式与数据结构。
---

# Admin 接口契约

以下为 ypbin-admin 后端全部接口的请求/响应契约、认证方式与数据结构，前后端按此对接。

> **URL 口径**：默认接口路径前缀 `/api`（由 nginx 代理转发到网关）。网关前对外 URL 第一段为**服务短名**（`system`/`auth`/`ai`），网关按短名路由并剥掉短名段后，服务内 Controller 只声明纯资源路径（如 `/system/user/list` → 网关剥 `system` → 服务收 `/user/list`）。本文档一律写**网关前对外 URL**（含服务短名）。免登录段对外形态：`/auth/captcha`、`/auth/social/*`、`/system/open-api/*`、`/system/open/license/*`、`/ai/share/*`、`/ai/widget/*`、`/system/ypbin/sse/*`。
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
  "username": "<登录账号>",
  "password": "<口令>",
  "captchaId": "<行为验证码 ID>",
  "captchaTrack": "<行为验证码轨迹>"
}

响应 data：
{
  "accessToken": "e3f2a1..."
}
```

- `captchaId`/`captchaTrack` 仅当登录行为验证码开关开启时为必填（见 [验证码](#4-验证码)），关闭时可不传。
- 初始账号与口令由部署种子/初始化流程提供（微服务版 deploy 种子 `002-data.sql`、单体版 Flyway `V2__data.sql`），**登录页与前端源码不再内置演示口令**；任何共享/测试或生产环境首登后必须立即改密。
- 登录防护：账号密码登录不依赖接口频控，采用「错误尝试锁定 + 可选行为验证码」——错误锁定按 账号 + IP 双维度（`PASSWORD_ERROR_LOCK_COUNT` 次 / `PASSWORD_LOCK_MINUTES` 分钟）；`LOGIN_CAPTCHA_ENABLED=true` 时登录强制校验行为验证码，一次性消费、校验失败即拒绝（防脚本爆破）。

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
- 平台可用性由后台系统参数 `SOCIAL_{PLATFORM}_ENABLED` 控制；auth 每 5 分钟重拉启用平台，授权跳转与回调前即时校验 `enabled`，停用平台即时不可登录（无需等待定时窗口）

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
GET /auth/user/info   → UserInfo（用户基本信息 + 权限码 + 角色码）
GET /auth/codes         → string[]（权限码集合）
GET /auth/menu/all      → RouteRecord[]（路由树，排除按钮）
```

### 2.6 退出登录

```
POST /auth/logout
```

### 2.7 未登录处理

后端返回 `code: 401`，HTTP 200。前端拦截器检测到 401 应清除 token 并跳转登录页。

### 2.8 内部服务调用（/internal/**，服务间 Feign 专用）

system 服务的 `/internal/**` 端点仅供 auth/ai 经 `ISystemClient` Feign **直连**调用（调用不经网关，网关 `exclude-paths` 亦不含该段，不对外路由）：

```
GET   /internal/permissions?userId=       → string[]（用户权限码）
GET   /internal/role-codes?userId=        → string[]（用户角色码）
GET   /internal/routes?userId=            → RouteResp[]（登录后动态菜单）
GET   /internal/user-by-username?username= → SysUserDto（登录用）
GET   /internal/user-by-id?userId=        → SysUserDto（匿名链路，忽略租户过滤）
GET   /internal/user-by-phone?phone=      → SysUserDto（手机验证码登录用）
GET   /internal/search-users?keyword=     → SysUserDto[]（最多 10 条）
GET   /internal/config-by-key?configKey=  → ConfigValue（敏感键脱敏）
POST  /internal/verify-password?userId=&rawPassword= → boolean（按用户频控）
GET   /internal/social-auth-config?source= → SocialAuthConfig（含 ClientSecret，仅内部传递）
GET   /internal/social-auth-configs       → SocialAuthConfig[]（仅已启用平台）
GET   /internal/social-binding?platform=&openId= → SysUserSocialDto
GET   /internal/social-bindings?userId=   → SysUserSocialDto[]
```

- 用户与第三方绑定类返回值是**只读视图** `SysUserDto` / `SysUserSocialDto`：字段与实体**逐一同名**，但**不含 `password` / `accessToken`**。服务间契约刻意不暴露持久化实体——实体继承 `BaseEntity`（MyBatis-Plus），暴露即迫使 auth/ai 这类**无数据源**的调用方传递依赖 `ypbin-starter-data`（详见仓库 SKILL「auth/ai 不直连共享库」）。

- 调用方须携带请求头 `X-Internal-Token`，值与共享配置 `ypbin.internal.token` 一致（三服务共享，见 [部署文档](/guide/admin/deployment)）；Feign 拦截器自动携带。
- system 本地守卫仅拦截 `/internal/**` 校验该头：**未配置凭证即 fail-closed 拒绝**（`code=401`）；外部经网关转发到 `/system/internal/**` 的请求因缺该头同样被拒。
- 安全约束：`config-by-key` 对键名以 `_SECRET`/`_PASSWORD`/`_TOKEN`/`_ACCESS_KEY`/`_PRIVATE_KEY`/`_API_KEY` 结尾的敏感参数整键脱敏（保留末 4 位）；`verify-password` 每用户每分钟最多 10 次；授权配置含 ClientSecret 明文、仅限内部传递。

## 3. 个人中心

```
GET  /system/user/profile → UserResp（当前用户信息）
PUT  /system/user/profile → 更新个人信息（realName/nickname/avatar/phone/email/gender）
PUT  /system/user/profile/password → 修改密码 { "oldPassword": "...", "newPassword": "..." }
```

## 4. 验证码

```
GET  /auth/captcha             → 获取行为验证码（滑块/旋转/点选），开关由 LOGIN_CAPTCHA_ENABLED 控制
POST /auth/captcha/verify?id=xxx → 校验验证码，请求体为 ImageCaptchaTrack（前端采集的行为轨迹）
```

- 开关默认关闭：获取接口返回空 `data`，账号密码登录不校验验证码；
- 开关开启后：账号密码登录**强制**要求 `captchaId` + `captchaTrack`，验证码一次性消费、校验失败直接拒绝登录。

## 5. 系统管理接口

以下接口均需登录 + 对应权限，统一前缀 `/system/`。

### 5.1 用户管理

```
GET    /system/user/list?page=1&pageSize=20&username=zhang&status=1   → PageResult<UserResp>
GET    /system/user/export?page=1&pageSize=20                          → 导出用户列表（Excel 文件流）
GET    /system/user/import-template                                    → 下载用户导入模板（Excel 文件流）
POST   /system/user/import?file=<MultipartFile>                        → 批量导入用户（返回 UserImportResult）
GET    /system/user/{id}     → UserResp（含 roleIds, postIds）
POST   /system/user          → 新增用户
PUT    /system/user/{id}     → 编辑用户
PUT    /system/user/{id}/status → 修改用户状态，请求体 { "status": 1|0 }
PUT    /system/user/{id}/reset-password → 重置密码，请求体 { "password": "..." }
PUT    /system/user/{id}/roles → 分配角色，请求体 { "roleIds": [1, 2] }
DELETE /system/user/{id}     → 删除用户
```

> 用户导入/导出、状态、重置密码与分配角色的请求/响应结构以源码为准（见 `SysUserController`）。

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
PUT    /system/config/group/{configGroup}                → 批量保存分组参数 { "configs": { "KEY": "value", ... } }
DELETE /system/config/{id}                               → 删除参数
```

已内置的分组：site、login、password、sms、mail。

### 5.8 客户端管理

```
GET    /system/client/list    → SysClient[]
POST   /system/client         → 新增
PUT    /system/client/{id}    → 编辑
PUT    /system/client/{id}/reset-secret → 重置客户端密钥
DELETE /system/client/{id}    → 删除
```

### 5.9 日志管理

```
GET /system/log/list?page=1&pageSize=20&module=认证&success=1&startTime=xxx&endTime=xxx → PageResult<LogResp>
GET /system/log/export?page=1&pageSize=20          → 导出操作日志（Excel 文件流）
```

### 5.10 在线用户

```
GET    /system/online-user/list?keyword=     → OnlineUser[]
DELETE /system/online-user/{token}           → 强制下线
```

### 5.11 租户管理

```
GET    /system/tenant/list    → TenantResp[]
POST   /system/tenant         → 新增
PUT    /system/tenant/{id}    → 编辑
DELETE /system/tenant/{id}    → 删除
```

### 5.12 文件管理

```
POST   /system/file/upload?module=avatar    → FormData(file)，返回 FileInfo
GET    /system/file/list?page=1&pageSize=20 → PageResult<FileResp>
DELETE /system/file/{id}                    → 删除
```

### 5.13 公告管理

```
GET    /system/notice/list    → NoticeResp[]
POST   /system/notice         → 新增
PUT    /system/notice/{id}    → 编辑
PUT    /system/notice/{id}/revoke  → 撤回公告
PUT    /system/notice/{id}/publish → 发布公告
DELETE /system/notice/{id}    → 删除
```

### 5.14 定时任务

定时任务（定义/启停/立即执行/执行日志）已迁移至 **XXL-JOB** 统一管理，不再走 `/system/job` 接口：

- 管理入口为 **xxl-job-admin 调度中心控制台**（部署见 [部署文档](/guide/admin/deployment)）；
- 各业务服务的定时逻辑以 `@XxlJob("handlerName")` 暴露为执行器（接入见 [xxljob 模块](/guide/starter/modules/xxljob)）。

### 5.15 License 管理

```
GET    /system/license/list            → PageResult<LicenseResp>（授权列表）
GET    /system/license/{id}            → 授权详情
POST   /system/license                 → 新增授权
PUT    /system/license/{id}            → 编辑授权
PUT    /system/license/{id}/submit     → 提交签发
PUT    /system/license/{id}/approve    → 审批通过
PUT    /system/license/{id}/revoke     → 吊销授权
DELETE /system/license/{id}            → 删除授权
POST   /system/license/generate-key    → 生成签发密钥对
GET    /system/license/{id}/download   → 下载授权文件
GET    /system/license/{id}/delivery   → 交付信息
```

> License 相关请求/响应结构以源码为准（见 `SysLicenseController`），签发密钥经环境变量注入。

### 5.16 开放应用管理

```
GET    /system/app/list    → AppResp[]
POST   /system/app         → 新增
PUT    /system/app/{id}    → 编辑
PUT    /system/app/{id}/reset-secret → 重置应用密钥
DELETE /system/app/{id}    → 删除
```

### 5.17 邮件测试

```
POST /system/mail/test?to=xxx@example.com    → 发送测试邮件
```

### 5.18 权限模板

```
GET    /system/auth-template/list  → AuthTemplateResp[]（权限模板，平台级）
POST   /system/auth-template       → 新增
PUT    /system/auth-template/{id}  → 编辑
DELETE /system/auth-template/{id}  → 删除
```

### 5.19 第三方登录配置

```
GET    /system/config/social      → SocialConfigResp[]（全部平台配置）
GET    /system/config/social/{source} → 单平台配置
PUT    /system/config/social/{source} → 修改配置（请求体 SocialConfigUpdateReq）
```

> source 取值：github / gitee / qq / wechat_open / alipay / dingtalk。

## 6. 仪表盘

```
GET /system/dashboard/stats        → Map（6 个字段：userCount / roleCount / deptCount / menuCount / onlineCount / logCount）
GET /system/dashboard/latest-logs?limit=10  → LogResp[]（最近操作日志，limit 1..100，默认 10）
GET /system/dashboard/log-trend?days=7      → LogTrendResp[]（近 N 天操作日志趋势，days 1..90，默认 7）
```

- 仪表盘接口需要权限 `system:dashboard:view`。

## 7. 消息推送

### 7.1 当前用户站内信（仅需登录，无需管理权限）

```
GET  /system/messages?page=1&pageSize=20&readStatus=   → PageResult<MessageResp>（分页，可按已读状态过滤）
GET  /system/messages/unread-count                     → long（未读消息数）
GET  /system/messages/recent?limit=10                  → MessageResp[]（最近消息，含已读/未读，limit 1..100）
PUT  /system/messages/{id}/read                        → 标记单条已读
PUT  /system/messages/read-all                         → 全部标记已读
DELETE /system/messages/{id}                           → 删除当前用户自己的消息
```

### 7.2 推送测试

```
POST /system/push/test?userId=xxx  → 推送测试（调试用）
```

> SSE 订阅票据端点为 `POST /system/ypbin/sse/ticket`（见 [Admin UI 配置参考](/guide/config/admin-ui)），订阅端点为 `GET /system/ypbin/sse/subscribe?ticket=<ticket>`（对外 URL 带 `system` 服务短名，网关剥短名后服务收 `/ypbin/sse/*`）。

## 8. AI 对话

需要登录 + 对应 `ai:*` 权限，统一前缀 `/ai/chat`。

```
GET    /ai/chat/sessions                    → AiChatSessionResp[]（会话列表）
POST   /ai/chat/sessions                    → 创建会话，返回会话 ID
DELETE /ai/chat/sessions/{id}               → 删除会话
GET    /ai/chat/sessions/{id}/messages      → AiChatMessageResp[]（会话消息历史）
POST   /ai/chat/send                        → 发送消息（同步），返回 AiChatMessageResp
POST   /ai/chat/stream                      → 发送消息（流式 SSE，text/event-stream）
POST   /ai/chat/sessions/{id}/regenerate    → 重新生成最后一条响应（服务端删除最后一条助手消息后按最后一条用户消息重生成并落库，避免前端重发造成重复消息/重复计费）
PUT    /ai/chat/sessions/{id}/title?title=xxx → 更新会话标题
PUT    /ai/chat/sessions/{id}/pin           → 置顶/取消置顶会话
```

### 8.1 AI 角色

```
GET    /ai/roles?status=          → AiChatRoleResp[]（角色列表）
POST   /ai/roles                  → 新增角色
PUT    /ai/roles/{id}             → 编辑角色
DELETE /ai/roles/{id}             → 删除角色
PUT    /ai/roles/{id}/favorite    → 收藏/取消收藏角色
```

- `status` 可选：缺省仅返回启用（1），传 0/1 可精确过滤（管理端用于找回已停用角色）。

### 8.2 模型配置（平台级）

```
GET    /ai/models?modelType=&status= → AiModelConfigResp[]（模型配置列表）
POST   /ai/models                → 新增模型配置
PUT    /ai/models/{id}           → 编辑模型配置
DELETE /ai/models/{id}           → 删除模型配置
PUT    /ai/models/{id}/default   → 设为默认模型
PUT    /ai/models/{id}/status/{status} → 启用/停用模型
POST   /ai/models/{id}/duplicate → 复制模型配置
POST   /ai/models/{id}/test      → 连通性测试
```

- `modelType`/`status` 均可选；`status` 缺省仅返回启用，传 0/1 精确过滤（管理端找回已停用模型）。

### 8.3 知识库

```
POST   /ai/knowledge-bases                          → 新增知识库，返回 AiKnowledgeBaseResp
PUT    /ai/knowledge-bases/{id}                     → 编辑知识库
GET    /ai/knowledge-bases                          → 知识库列表，返回 AiKnowledgeBaseResp[]
DELETE /ai/knowledge-bases/{id}                     → 删除知识库
POST   /ai/knowledge-bases/{id}/documents?file=      → 上传文档（PDF/Markdown/TXT，异步向量化）
GET    /ai/knowledge-bases/{id}/documents?page=&keyword= → PageResult<AiDocumentVO>
DELETE /ai/knowledge-bases/{id}/documents/{docId}    → 删除文档
POST   /ai/knowledge-bases/{id}/documents/batch?files= → 批量上传文档（最多 20 个）
POST   /ai/knowledge-bases/{id}/import-url           → URL/Sitemap/RSS 导入文档
POST   /ai/knowledge-bases/{id}/documents/{docId}/retry → 重试向量化
POST   /ai/knowledge-bases/{id}/query                → 知识库问答（非流式），请求体 { "question": "..." }
POST   /ai/knowledge-bases/{id}/search-test          → 检索测试，返回召回片段
POST   /ai/knowledge-bases/{id}/search-rerank-test   → 关键词重叠重排测试
POST   /ai/knowledge-bases/search-multiple-test      → 多知识库联合检索测试（RRF 合并）
POST   /ai/knowledge-bases/{id}/query-with-sources   → 带溯源的问答（答案 + 召回片段）
PUT    /ai/knowledge-bases/{id}/widget?enabled=true  → 启用/停用网页挂件（返回令牌）
PUT    /ai/knowledge-bases/{id}/share                → 保存公开分享设置（返回令牌）
GET    /ai/knowledge-bases/{id}/documents/{docId}/content → 文档原文内容
GET    /ai/knowledge-bases/{id}/documents/{docId}/chunks  → 文档全量分块列表
```

### 8.4 Prompt 模板

```
GET    /ai/prompt-templates?status=  → AiPromptTemplateResp[]
POST   /ai/prompt-templates          → 新增
PUT    /ai/prompt-templates/{id}     → 编辑
DELETE /ai/prompt-templates/{id}     → 删除
PUT    /ai/prompt-templates/{id}/status/{status} → 启用/停用
```

- `status` 可选：缺省仅返回启用，传 0/1 精确过滤（管理端找回已停用模板）。

### 8.5 用量统计（平台级）

```
GET /ai/usage/daily?startDate=&endDate=  → 按天聚合 Token 用量（折线图）
GET /ai/usage/by-model                   → 按模型聚合 Token 用量（饼图）
GET /ai/usage/summary                    → 用量汇总
```

### 8.6 AI 统计看板（平台级）

```
GET /ai/stats/summary         → 概览统计（知识库数/文档总数/问答次数/检索次数/Token 总量）
GET /ai/stats/daily?days=30   → 近 N 天问答/检索/Token 趋势
GET /ai/stats/hot-queries?limit=10 → 搜索热词 Top N
GET /ai/stats/kb-docs         → 各知识库文档数分布
```

### 8.7 公开分享（免登录）

```
GET  /ai/share/{token}/config                     → 分享配置（知识库名称、是否需要密码、是否过期）
GET  /ai/share/{token}/documents?page=            → PageResult<AiDocumentVO>（分享文档列表，可选 X-Share-Password 头）
GET  /ai/share/{token}/documents/{docId}/content  → 分享文档原文（可选 X-Share-Password 头）
POST /ai/share/{token}/ask                        → 对分享知识库提问（非流式 RAG），请求体 { "question": "..." }
```

### 8.8 网页挂件（免登录）

```
GET  /ai/widget/{token}/config     → 挂件配置
POST /ai/widget/{token}/ask        → 匿名提问（请求体 { "question": "..." }）
GET  /ai/widget/embed.js           → 挂件嵌入脚本（application/javascript，无需令牌）
```

> AI 相关接口的请求/响应结构以源码为准（见 `ypbin-service/ypbin-ai` 各 Controller，路径前缀 `/ai/` 由网关短名路由剥除）。

## 9. 开放接口

### 9.1 License 联机校验（消费端专用，免登录）

```
GET /system/open/license/verify?licenseId=xxx&fingerprint=xxx  → LicenseRemoteResp（valid=true/false）
```

- 采用开放应用 AK/SK 接口签名鉴权（accessKey/timestamp/nonce/sign 四件套，经 `SignChecker` 校验）。
- 鉴权失败与业务判定失败统一返回 `valid=false`，消费端据此阻断。

### 9.2 开放 API 示例（免登录，需签名）

```
POST /system/open-api/demo   → 标注 @ApiSign，需通过签名校验，返回 { "echo": <请求体>, "message": "开放 API 签名校验通过" }
```

## 10. 前端路由结构（GET /menu/all）

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

## 11. 权限模型

- **权限码**：即菜单表中 `auth_code` 字段（如 `system:user:list`）
- 用户 → 角色 → 菜单（auth_code），多条角色取并集
- 超级管理员（角色标识=super）的权限码集合含通配码 `*:*:*`（`AdminConstants.ALL_PERMISSION`）：starter 会把它归一为 Sa-Token 官方通配符 `*`，从而通过任意权限码的校验（`*:*:*` 本身只匹配「含两个及以上冒号」的权限码，不能直接当官方通配符使用）
- 每个系统管理页面都有对应的 list/add/edit/delete 四个按钮级权限码
- 前端用权限码控制按钮显隐

## 12. 数据字典与派生字段

- `@DictText` 标注的字段会额外输出一个同名+Text 后缀的文本字段（如 `gender` → `genderText`）
- `@RefText` 标注的 ID 字段会额外输出一个同名+Name 后缀的名称字段（如 `createUser` → `createUserName`）
- 这些由后端序列化时自动处理，前端直接使用，无需额外请求

## 13. 数据脱敏

- `@Sensitive` 标注的字段（如 phone、email）后端序列化时自动脱敏
- 脱敏规则：手机号保留前 3 后 4、邮箱保留首字符

## 14. 关键系统参数

| 键 | 默认值 | 说明 |
|---|---|---|
| LOGIN_CAPTCHA_ENABLED | false | 账号密码登录是否强制行为验证码（开启后登录必须携带 captchaId/captchaTrack，一次性消费） |
| LOGIN_SMS_ENABLED | false | 短信验证码登录开关 |
| PASSWORD_MIN_LENGTH | 8 | 密码最小长度 |
| PASSWORD_ERROR_LOCK_COUNT | 5 | 登录错误锁定阈值（账号 + IP 维度） |
| PASSWORD_LOCK_MINUTES | 15 | 锁定时长(分钟) |
| SMS_CODE_EXPIRE_SECONDS | 300 | 短信验证码有效期 |
| SOCIAL_{PLATFORM}_CLIENT_ID | (空) | 第三方登录 ClientId，PLATFORM 为 GITHUB/GITEE/QQ/WECHAT_OPEN/ALIPAY/DINGTALK |
| SOCIAL_{PLATFORM}_CLIENT_SECRET | (空) | 第三方登录 ClientSecret |
| SOCIAL_{PLATFORM}_REDIRECT_URI | (空) | 第三方登录回调地址 |
| SOCIAL_{PLATFORM}_ENABLED | false | 第三方登录平台启用开关（停用后 auth 每 5 分钟重拉生效，授权/回调即时拒绝） |

> 密码策略默认 8–32 位且必须同时包含数字与字母（`PASSWORD_REQUIRE_DIGIT`/`PASSWORD_REQUIRE_LETTER` 等系统参数控制，`_SECRET`/`_PASSWORD` 结尾的键在列表中脱敏展示）。

