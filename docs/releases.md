---
title: 发布状态
description: ypbin 三个产品的版本状态与 ypbin-starter 版本历史。
---

# 发布状态

## 版本状态

| 产品 | 通道 | 版本 | 状态 |
| --- | --- | --- | --- |
| ypbin-starter | 稳定 | `v1.2.0` | 已发布，建议生产接入时使用 |
| ypbin-starter | 开发 | `1.3.0-SNAPSHOT` | 开发中，用于下一版本验证 |
| ypbin-admin | 开发 | `1.0.0-SNAPSHOT` | 尚未声明稳定发布，依赖 starter `1.3.0-SNAPSHOT` |
| ypbin-admin-ui | private | `5.7.0` | 工作区版本，不应解读为公共 npm 稳定包 |

## ypbin-starter 版本历史

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
