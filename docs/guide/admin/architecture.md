---
title: Admin 架构与集成
description: ypbin-admin 模块结构、与 starter 的分工、扩展点与搭建清单。
---

# Admin 架构与集成

## 模块结构

ypbin-admin 主分支 `main` 为**微服务形态**，根 POM 声明多个 Maven 模块：

| 模块 | 职责 |
|------|------|
| `ypbin-common` | 共享常量、配置、身份头/租户等微服务基础装配 |
| `ypbin-gateway` | 统一网关：登录鉴权、身份头签发与路由转发 |
| `ypbin-auth` | 认证服务：登录、验证码、第三方登录 |
| `ypbin-service` | 业务服务聚合：`ypbin-system`（RBAC/菜单/租户/消息等）/ `ypbin-ai` |
| `ypbin-service-api` | Feign 接口与跨服务共享 DTO/实体（`ypbin-system-api` / `ypbin-ai-api`） |
| `xxl-job-admin` | XXL-JOB 任务调度中心（独立中间件）：业务定时任务的定义/调度日志/触发由它统一管理 |

跨服务调用约定：auth/ai **不直连共享库**，一律经 `ISystemClient` Feign 直连 system 服务，`ISystemClient` 的 basePath 固定为 `/internal`（调用不经网关，见下文守卫）；
网关校验 token 后清洗外部传入的身份头、按会话重新签发 `X-User-Id/X-Tenant-Id/X-Roles` 等内部身份头，下游经 `IdentityContext` 读取当前用户。
身份头过滤依赖 `ypbin.security.identity.enabled` **显式开启**（starter 2.2.2 起默认关闭，防外部伪造头直达服务），共享配置 `ypbin-common.yaml` 已显式开启。

**URL 路由约定**：对外 URL 第一段 = 服务短名（`system`/`auth`/`ai`），网关按短名路由并 `StripPrefix=1` 剥掉短名段，服务内 Controller 写纯资源路径（`/system/user/list` → 剥 `system` → 服务收 `/user/list`）。Controller 内不再带服务域前缀；新增接口挂所属服务短名即可，网关路由不随接口改动。免登录端点（验证码/分享/开放/SSE 订阅）在网关 Nacos `exclude-paths` 声明，URL 同样带短名（`/auth/captcha`、`/ai/share/**`、`/system/ypbin/sse`）。

另维护**单体版 `boot` 分支**：`ypbin-admin-system`（公共 + 业务域 `cn.ypbin.admin.common` + `cn.ypbin.admin.modules/{ai,auth,job,system}`）+ `ypbin-admin-server`（启动与装配），
当前用户走 `UserContext`/`LoginHelper`（sa-token 会话）。适合不需要服务拆分的场景，详见 [部署文档](/guide/admin/deployment)。

## 内部 Feign 端点守卫（/internal/**）

system 服务只面向**服务间调用**暴露 `/internal/**` 内部端点（auth/ai 经 `ISystemClient` 查询权限/角色/路由/用户/系统参数/社交绑定等），不加入网关免登录白名单；外部即便经网关转发命中该段，也因缺少令牌被本地守卫拒绝：

- **令牌机制**：system 本地守卫（`InternalTokenGuardInterceptor`，仅注册拦截 `/internal/**`）校验请求头 `X-Internal-Token` 与配置凭证一致才放行；凭证配置键为 `ypbin.internal.token`（共享配置 `ypbin-common.yaml`，值由部署 `.env` 的 `INTERNAL_TOKEN` 随机生成、install.sh 导入 Nacos 时替换，auth/system/ai 三服务共享一致值）。
- **携带与拒绝**：Feign 侧 `InternalTokenFeignConfiguration` 拦截器每次调用自动从同一配置键读取并写入凭证头，未配置时告警不携带（服务端拒绝，不静默放行）；凭证未配置时守卫 **fail-closed** 整体拒绝（`R.code=401`）。服务间 Feign 直连**不经网关**，登录态由网关签发并透传身份头，`/internal/**` 鉴权不依赖登录会话。
- **纵深防御**：
  - `/internal/config-by-key` 对键名以 `_SECRET` / `_PASSWORD` / `_TOKEN` / `_ACCESS_KEY` / `_PRIVATE_KEY` / `_API_KEY` 结尾的敏感参数**整键脱敏**（仅保留末 4 位，其余打码），短信/邮件等密钥类配置禁止经 internal 明文出网；
  - `/internal/verify-password` 按用户维度频控（每分钟最多 10 次），防任意 userId 在线口令爆破；
  - 社交平台授权配置（含 ClientSecret 明文）仅限内部传递，`listSocialAuthConfigs` 只返回已启用平台。

**社交平台启停跨进程生效**：auth 与 system 各自持有独立的平台注册表。auth 启动后每 5 分钟经 Feign 全量重拉已启用平台配置并重建注册表（删除停用平台、注册/更新启用平台）；授权跳转与回调前再经 `ensurePlatformRegistered` 即时读取最新配置校验 `enabled`——平台已停用直接拒绝、配置有变即时重建，不依赖定时窗口（system 侧配置变更会主动失效对应共享缓存键）。

## 与 starter 的分工

系统级能力全部由 ypbin-starter 提供，admin 只写业务逻辑：

- **统一响应与异常**：`R<T>`、`BusinessException`、全局异常处理 → starter web
- **认证与鉴权**：登录、Sa-Token 会话、登录客户端、在线用户 → starter security
- **数据访问**：`BaseEntity` 审计字段、雪花 ID、逻辑删除、分页 → starter data
- **多租户 / 数据权限** → starter extension-tenant / extension-datapermission
- **CRUD 基类**：`BaseController` / `CrudController` / `BaseServiceImpl` → starter extension-crud
- **序列化**：Long 转字符串、字典翻译、引用翻译、脱敏 → starter json

admin 侧不重造这些能力；发现 starter 缺能力或不好用时，反馈改进 starter，不在 admin 里绕开。各模块用法见 [Starter 模块文档](/guide/starter/modules/)。

## 扩展点（admin 需实现的接口）

所有能力 Bean 均 `@ConditionalOnMissingBean`，admin 直接定义同类型 Bean 即覆盖默认实现。

### 必须实现（不实现则对应能力不可用）

| 扩展点接口 | 模块 | 作用 | admin 实现要点 |
|---|---|---|---|
| `PermissionProvider` | security | 返回用户权限码/角色码，适配 Sa-Token 注解鉴权 | 查用户-角色-菜单返回权限码；不实现则 `@SaCheckPermission` 永远无权限 |
| `TenantProvider` | extension-tenant | 返回当前租户 ID（仅启用多租户时） | 从登录上下文/请求头取租户 ID |
| `DataScopeHandler` | extension-datapermission | 返回数据范围 SQL 片段（仅启用数据权限时） | 按当前用户数据范围拼 SQL；不提供则该能力整体不装配 |

### 可选覆盖（有默认实现，想动态化时才实现）

| 扩展点接口 | 模块 | 默认实现 | admin 何时实现 |
|---|---|---|---|
| `LoginClientProvider` | security | 读 `ypbin.security.clients` 配置 | 客户端配置后台管理 |
| `PasswordPolicyProvider` | security | 读 `ypbin.security.password` 配置 | 密码策略后台可配 |
| `DictProvider` | json | 无（未接则 `@DictText` 退化为原值） | 有字典表时，`@DictText` 自动翻译 |
| `RefTextProvider` | json | 无（未接则不输出名称字段） | 用户/部门 ID 展示名称时（一条 IN 查询） |
| `MailConfigProvider` | messaging | 读 `ypbin.mail.*` 配置 | 邮件配置后台管理 |
| `StorageConfigProvider` | storage | 读 `ypbin.storage.*` 配置 | 存储配置后台管理 |
| `SignAppProvider` | sign | 读 `ypbin.sign.apps` 配置 | 有开放平台应用表时 |
| `SensitiveWordProvider` | sensitive-words | 读配置 | 词库后台维护 |
| `FieldEncryptor` | data | AES-GCM | 换国密等算法 |
| `ApiCryptoProvider` | api-crypto | AES 实现 | 换算法 |
| `AuthRequestProvider` | social | 无 | 做第三方登录时按平台注册 |

## 搭建落地清单

基于 starter 搭建一个后台（RBAC 场景）的顺序：

1. **建工程 + 引 BOM**：父 pom 导入 `ypbin-starter-bom`，按需引模块（见下文依赖选型）。
2. **建基础表 + 实体**：用户/角色/菜单/部门等业务表；实体继承 `BaseEntity`（自带雪花 ID、审计字段、状态、逻辑删除），多租户表继承 `TenantBaseEntity`。字段严守全链路同名。
3. **实现 `PermissionProvider`**（必须）：接通 `@SaCheckPermission`。
4. **登录流程**：`LoginHelper.login(userId, LoginClientRequest)` 按客户端策略登录 → `UserContext.setLoginUser(loginUser)` → 可选 `OnlineUserHelper.record(ip, browser, os)`。登录前 `PasswordAttemptLimiter.checkLocked` 判锁定、失败 `recordFailure`、成功 `reset`；改密用 `PasswordValidator.check`。
5. **控制器写法**：自 starter v2.0.0 起 `BaseController` 已删除，业务控制器一律为普通 `@RestController`，响应用 `R.ok()/R.fail()` 静态工厂、请求上下文用 `WebRequestUtils`、当前用户用 `UserContext`（单体 boot）/`IdentityContext`（微服务 main）。接口形态简单稳定的资源也可继承 starter `extension-crud` 的 `CrudController` 复用 get/list/page/save/update/delete 六端点。
6. **按需实现可选 Provider**：字典、引用翻译、数据权限、多租户等。
7. **后台可配类**：客户端、密码策略、邮件、存储、开放应用要做成后台可配时，实现对应 `XxxConfigProvider` 从配置表读。
8. **在线用户 / 强制下线**：直接注入 `OnlineUserService`（list / kickout）。

**必须实现**：`PermissionProvider`（+ 多租户则 `TenantProvider`、数据权限则 `DataScopeHandler`）。

## 依赖选型

**微服务（main 分支，推荐）**：在单体基础依赖之上引入 `ypbin-starter-cloud-nacos`、`-cloud-core`、`-cloud-gateway`、`-cloud-loadbalancer`、`-cloud-sentinel`、`-cloud-observability`，或直接引聚合模块 `ypbin-starter-app-cloud`。

**单体（boot 分支）常用**：`ypbin-starter-web`、`-data`、`-security`、`-json`、`-cache`、`-log`、`-api-doc`、`-extension-crud`、`-excel`、`-captcha`、`-messaging`、`-storage`、`-tools`，或引 `ypbin-starter-app-web` 一站式聚合。

按业务再选：`-extension-tenant`（多租户）、`-extension-datapermission`（数据权限）、`-sign`（开放 API）、`-social`（第三方登录）、`-sensitive-words`、`-i18n`、`-api-crypto`、`-async`。

**定时任务**：业务侧任务统一走 XXL-JOB——各服务引入 `ypbin-starter-xxljob` 以 `@XxlJob` 暴露执行器，配合独立部署的 xxl-job-admin 调度中心（见 [部署文档](/guide/admin/deployment)）；自研 `ypbin-starter-job`（内存调度）仅在无需调度中心的轻量场景使用。
