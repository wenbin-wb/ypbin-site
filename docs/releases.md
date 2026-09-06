---
title: 发布状态
description: ypbin 三个产品的版本状态与 ypbin-starter 版本历史。
---

# 发布状态

## 版本状态

| 产品 | 通道 | 版本 | 状态 |
| --- | --- | --- | --- |
| ypbin-starter | 稳定 | `v${VERSION}` | 已发布，建议生产接入时使用 |
| ypbin-admin | 开发 | `1.0.0-SNAPSHOT` | 尚未声明稳定发布，依赖 starter `${VERSION}` |
| ypbin-admin-ui | private | `5.7.0` | 工作区版本，不应解读为公共 npm 稳定包 |

## ypbin-starter 版本历史

### v2.2.0 — 2026-09-05

**任务调度中心化**：新增 XXL-JOB 执行器接入壳，业务侧定时任务由自研轻量调度迁移至 XXL-JOB 分布式调度中心统一管理（ypbin-admin 的 main/boot 已随迁）。共 36 个模块。

**新增能力**

- **`ypbin-starter-xxljob`**：XXL-JOB v3.4.2 执行器自动装配——`XxlJobSpringExecutor` + `ypbin.xxl-job.*` 配置绑定（admin-addresses/appname/port/access-token/log-path 等），业务方法标注 `@XxlJob("handler")` 即注册为可调度任务。默认 `enabled=false`；配置缺失（admin 地址/执行器名）启动即抛错暴露。xxl-job-core 3.4.2 无 javax 依赖，兼容 Spring Boot 4.1 / JDK 21。

### v2.1.1 — 2026-09-04

**微服务修复版本**：网关/云模块时间序列化对齐 Jackson 3、Feign 统一响应解析、WebFlux 网关装配修复，并修复 Release 自动发布流水线。共 35 个模块。

**新增能力**

- **`FeignResponses`**（`ypbin-starter-cloud-core`）：Feign 调用统一解析 `R<T>` 响应——`dataOrThrow(resp, msg)` 校验远程业务成功、失败抛 `BusinessException`（禁止静默降级），`dataOrDefault` 兜底可选值

**修复**

- 网关错误响应时间戳序列化错误（cloud-gateway）：Jackson 2 → Jackson 3（`tools.jackson` ObjectMapper），错误响应 `timestamp` 不再序列化为数组
- Sa-Token 共享会话 JSON 反序列化失败（security）：注册 `LoginUser` 到 Sa-Token JSON 反序列化白名单
- WebFlux 网关装配误载（security）：`SecurityAutoConfiguration`/`IdentityAutoConfiguration`/`PlatformAccessAutoConfiguration` 增加 Servlet Web 条件，WebFlux 环境不再错误装配
- Spring Cloud 兼容性检查误报（cloud）：禁用 compatibility-verifier 对官方支持 Boot 4.1.x 的误报

**工程**

- Release 自动发布流水线修复：tag 触发的 checkout 处于 detached HEAD，`git push` 改用显式 refspec（此前 v2.1.0 因该缺陷 Release 未建成）

### v2.1.0 — 2026-09-01

**微服务增强版本**：面向 Spring Cloud 微服务形态补齐身份头上下文、平台访问控制、声明式缓存失效与永久缓存能力。共 35 个模块。

**新增能力**

- **微服务身份头上下文**（`ypbin-starter-security`）：新增 `IdentityContext` / `IdentityHeaderFilter`，下游服务从网关签发的内部身份头读取当前用户，`auth/ai/system/job` 均可使用
- **`@PlatformAccess` 反哺 starter**：平台用户访问控制注解/切面/SPI 下沉至 starter，微服务版可直接使用 `cn.ypbin.starter.security.platform.PlatformAccess`
- **声明式缓存失效**（`ypbin-starter-cache`）：新增 `@CacheEvict` 注解 + AOP 切面，配合跨服务永久缓存实现主动失效
- **永久缓存模式**：`getOrLoad` 支持 `ttl=null` 永久缓存，由业务侧主动失效
- **`UserContext` 门面化**：自适应身份头优先、Sa-Token 会话回退（业务代码无需感知部署形态）
- **跨服务调用透传**：Feign 身份头/租户上下文自动透传

**安全/质量**

- `PlatformAccessAspect` 内联全限定类名清理
- 上下文门面化/Feign 身份透传/事务后缓存失效等审查缺陷修复
- JaCoCo 覆盖率门禁真实化并提高至 0.80

### v2.0.0 — 2026-08-31

**破坏性变更版本**：删除控制器基类 `BaseController`，公开 API 与继承结构不兼容调整。共 35 个模块。

**破坏性变更与迁移**

- **`BaseController` 已删除**：请求上下文读取迁移至 `WebRequestUtils`（`ypbin-starter-web` 静态工具，方法同名），当前用户读取迁移至 `UserContext`，响应包装改用 `R` 静态工厂（`R.ok()/R.fail()`）；业务控制器改为普通 `@RestController`
- **`CrudController` 不再继承 `BaseController`**：标准 CRUD 控制器不受影响，但子类直接调用过的基类辅助方法需按上表迁移
- **参数校验 handler 合并**：`MethodArgumentNotValidException` 与 `BindException` 合并为 `BindException` 单入口；`GlobalErrorCode` 新增 `METHOD_NOT_ALLOWED(405)`

**新增**

- **`EntityStatus` 枚举**：`ENABLED(1)/DISABLED(0)`，`BaseEntity.status` 默认值改引枚举
- **`WebRequestUtils`**：HTTP 请求上下文统一读取入口（替代基类辅助方法）
- **deploy 环境变量化**：compose 弱口令改 `${VAR:?}` 强制 .env 注入，新增 `.env.example`

### v1.4.0 — 2026-08-28

新增 AI 对话能力与注解驱动敏感词过滤。Java 基线升级至 **JDK 21 + Spring Boot 4.1.0**。共 35 个模块。

**新增能力**

- **AI 对话模块**（`ypbin-starter-ai`）：基于 Spring AI 2.0 的流式/非流式对话、多轮记忆（内存/JDBC）、可选 RAG；核心设计为**模型配置表驱动**——业务方实现 `AiModelConfigResolver` 从配置表读取默认模型，starter 动态构建 OpenAI 兼容客户端，模型地址/密钥/型号全部运行时下发、不在 yml 配置
- **注解驱动敏感词过滤**（`ypbin-starter-sensitive-words`）：`@SensitiveWordFilter` 字段+方法双目标注解，AOP 自动过滤，替代手动注入服务
- **AI 用量监听 SPI**：`AiUsageListener` 回调 Token 用量统计；`/actuator/ypbin` 自诊断端点

**安全加固**

- 登录拦截器对非 REQUEST 分发（ERROR/ASYNC，如 SSE 流失败后的错误分发）直接放行，避免 Sa-Token 上下文未初始化误报并掩盖真实错误

### v1.3.0 — 2026-08-14

增强定时任务、验证码、第三方登录与 License 联机校验稳定性，并补充多个模块的单测覆盖。共 34 个模块。

**新增能力**

- Cron 前置校验（`ypbin-starter-job`）：`CronService` 接口与 `SpringCronService` 实现，`JobManager.register()` 时校验 cron 语法合法性，非法即拒绝并提供 `nextExecutionTimes` 预览下次触发时间
- License 联机授权失败策略（`ypbin-starter-license`）：`RemoteFailurePolicy`（`FAIL_CLOSED` / `FAIL_OPEN_WITH_WARNING`），`HttpRemoteVerifyProvider` 按策略裁决网络异常/超时/明确拒绝三类结果
- 第三方登录动态注册（`ypbin-starter-social`）：`SocialRequestRegistry` + `DefaultSocialRequestRegistry`（线程安全），运行时动态注册/停用平台请求，无需重启服务
- 验证码资源自愈（`ypbin-starter-captcha`）：`CaptchaResourceReloader` 接口，`generate` 捕获资源丢失后自动 reload 并重试，解决远程 Redis 重启后验证码 500
- 缓存多级/Redis 完善（`ypbin-starter-cache`）：多级缓存与 Redis 缓存实现完善并补测试

**工程**

- 补充 cache / job / tenant / crud / datapermission / sign / license / social 等模块单元测试
- README 补充官网文档链接；补充 Apache-2.0 LICENSE；开发目录移出版本管理

### v1.2.0 — 2026-08-07

新增日志字段掩码与 License 联机校验加固，修复访问日志切面失效、SSE 长连接超时刷屏、多个可选 Redis 依赖装配隐患。共 34 个模块。

**新增能力**

- `@LogMask` 字段掩码（`ypbin-starter-log`）：标注字段序列化进访问/操作日志时自动替换为掩码，避免明文密码等敏感字段落盘
- 访问日志切面改造：`AccessLogInterceptor` 改为 `AccessLogAspect`（AOP 环绕通知），Request/Response 分块打印并新增 `===Handler===` 定位处理方法
- License 联机校验加固：`HttpRemoteVerifyProvider` 引入缓存窗口、single-flight（并发校验合并为一次 HTTP）与失败退避重试，仅明确拒绝阻断、其余放行并告警
- 验证码多背景图：`ypbin.captcha.background-resources` 支持多张自定义背景随机取用
- SSE 心跳保活：长连接默认不超时（`timeout=0`），新增 `heartbeat-interval-seconds`（默认 30s）定期保活

**修复**

- 访问日志切面完全不生效：`@within(RestController) || @within(Controller)` 组合触发 AspectJ 异常导致切入点匹配失败、controller 未被代理，改为只保留 `@within(RestController)` 分支
- SSE 长连接约 5 分钟必断且刷屏：补充 `AsyncRequestTimeoutException` 专属处理与心跳保活
- 可选 Redis 依赖装配隐患：security / sign / tools / messaging 的 Redis 存储嵌套配置补充 `@ConditionalOnBean(StringRedisTemplate.class)`，消费端传递引入 spring-data-redis 但未配置连接时不再崩溃
- 验证码默认资源不自动加载：新增 `CaptchaResourceInitializer` 幂等补齐

### v1.1.0 — 2026-08-06

新增 License 商业授权能力与 SSE 安全加固，并修复多个由真实消费端实测暴露的地基级问题。共 34 个模块。

**新增能力**

- License 商业授权模块（`ypbin-starter-license`）：机器指纹绑定 + 使用期限 + SM2 签发验签 + `@LicenseCheck` 注解式授权 + 登录回验 + 联机校验，覆盖离线授权到在线鉴权链路
- SSE 一次性订阅票据：`EventSource` 不能带 `Authorization` 头，新增「先换票再订阅」——短时一次性票据（内存/Redis 双实现，原子消费防重放）
- 安全扩展点：`SseUserIdResolver`、`SecurityExcludePathProvider`

**安全修复**

- SSE 内置订阅端点越权（严重）：原来仅凭 URL 上的 `userId` 建立连接、无鉴权；现由服务端登录态解析当前用户，前端传参不再被信任
- SSE 端点未注册：修复自动配置顺序缺陷导致的订阅/换票端点静默不生成
- SSE 订阅被全局登录拦截拦死：自动放行订阅路径（换票路径仍保留拦截）

**修复**

- tools 无 Redis 环境启动崩溃：`@Bean` 方法签名直接引用可选依赖类型 `StringRedisTemplate`，方法级 `@ConditionalOnClass` 拦不住配置类内省；Redis 存储收拢到类级条件嵌套配置
- MultiLevelCache 同类隐患：类级 `@ConditionalOnClass` 并入 `StringRedisTemplate`
- 补充 api-crypto / data-permission / i18n / sensitive-words 等模块测试覆盖

### v1.0.0

首个正式版本。基于 Spring Boot 3.5 的开箱即用基础能力 starter 集合，覆盖单体与微服务，共 33 个模块。

- **基础能力**：统一响应 `R`、异常体系、上下文透传（core）；统一序列化、脱敏、字典/引用翻译（json）；全局异常、CORS、XSS、可重复读请求（web）；MyBatis-Plus 增强、`BaseEntity`、字段加密、雪花 ID（data）；Redis 缓存三重防护、多级缓存（cache）；Sa-Token 封装、登录客户端、密码策略、在线用户（security）；文件存储、操作日志、限流/幂等/锁
- **扩展能力**：多租户、通用 CRUD、数据权限；Excel、行为验证码、邮件、短信、WebSocket/SSE/MQTT、敏感词、国际化、接口加解密、接口签名、第三方登录、异步线程池、定时任务
- **微服务**：Feign 增强、Nacos、版本灰度负载均衡、网关、可观测性、流量防护

已发布至 Maven Central（`cn.ypbin`）。发布过程修复了无 parent 的三个聚合 POM（根聚合、`dependencies`、`bom`）缺少 `url/licenses/scm/developers` 元数据与 GPG 签名的问题，元数据统一下沉到 `dependencies` 与 `bom`。

## 版本表达规则

本站始终显式区分稳定版、开发快照与私有工作区版本。文档示例默认使用稳定依赖；只有跨仓开发说明才使用 SNAPSHOT。变更记录以本页为准，发布元数据核验自对应仓库根配置与 `CHANGELOG.md`。
