---
title: ypbin-starter
description: 38 个 Maven 模块的 Spring Boot 系统级基础能力集合——分层能力图谱、快速接入与版本状态。
---

# ypbin-starter

<StatusBadge status="stable" label="v@STARTER_VERSION@ 稳定版" />

ypbin-starter 是面向 Spring Boot 的系统级基础能力集合，覆盖 Web、JSON、数据访问、缓存、安全、存储、日志、消息、任务与云组件等横切能力，并按需拆分为可选择的 Maven 模块，用不到的模块不进 classpath。

## 定位与边界

- **它是什么**：一套「把正确做法设成默认」的基础能力底座。统一响应与异常、登录防爆破、接口签名防重放、多级缓存、序列化期零 N+1、License 商业授权等细节在模块内实现并默认开启，业务侧只写业务。
- **它适合谁**：多个 Spring Boot 服务重复处理统一响应、安全、数据访问或缓存时，引入对应模块即可，避免在业务仓库里复制基础设施代码。
- **它不是**：完整业务系统，不含业务表与业务功能。需要开箱即用的后台服务时，请使用 [ypbin-admin](/products/admin) 组装方案。
- **运行基线**：JDK 21 + Spring Boot 4.1.0（依赖管理见下方 [版本与状态](#版本与状态)）。

## 能力图谱（分层）

模块按依赖方向分层：上层可依赖下层，基础层不得反向依赖扩展层或微服务层。全部模块与根聚合 pom 一一对应，共 **36 个**。

| 分层 | 包含模块 | 定位 |
| --- | --- | --- |
| 基础能力 L1 | `core` · `web` · `data` · `json` · `cache` · `security` · `log` · `tools` · `i18n` · `api-doc` · `storage` | 不依赖 Spring Cloud，单体即可用（11 个） |
| 数据与安全增强 | `excel` · `captcha` · `api-crypto` · `sign` · `sensitive-words` · `license` | 常见数据与安全能力（6 个） |
| 消息与平台 | `messaging` · `async` · `job` · `xxljob` · `social` | 站内信/短信推送、异步、定时任务与第三方登录（5 个） |
| 智能能力 | `ai` | Spring AI 对话、多轮记忆与 RAG（1 个） |
| 业务骨架 L2 | `extension-crud` · `extension-tenant` · `extension-datapermission` | 在基础能力上叠加通用业务骨架（3 个） |
| 微服务 L3 | `cloud-core` · `cloud-nacos` · `cloud-loadbalancer` · `cloud-gateway` · `cloud-observability` · `cloud-sentinel` | 面向 Spring Cloud 的分布式能力（6 个） |
| 聚合与版本 | `dependencies` · `bom` · `app-web` · `app-cloud` | 版本统一与起步聚合（4 个） |

分层设计说明见 [Starter 核心机制](/guide/starter/concepts)，每层可展开为独立模块使用页：[Starter 模块文档](/guide/starter/modules/)。

## 快速接入

接入分两步：先经 BOM 统一版本，再按需声明模块依赖。引入即自动装配，能力 Bean 均可被宿主声明覆盖：

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>cn.ypbin</groupId>
      <artifactId>ypbin-starter-bom</artifactId>
      <version>@STARTER_VERSION@</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>
```

```xml
<dependency>
  <groupId>cn.ypbin</groupId>
  <artifactId>ypbin-starter-web</artifactId>
</dependency>
```

完整示例、配置项与生产注意事项见 [快速开始](/guide/starter/) 与 [配置参考](/guide/config/starter)。

## 工程治理与质量门禁

能自动拦住的，绝不靠人工自觉。下面每道门禁都在 CI 强制执行，也都能在本地复现：

| 门禁 | 拦住什么 | 本地命令 |
| --- | --- | --- |
| 架构约束测试（ArchUnit，35 项） | 分层依赖倒置、`@Transactional` 漏写 `rollbackFor`、字段注入、`printStackTrace`、内联全限定类名、Lombok `@Data` 越界 | `mvn -pl ypbin-starter-architecture-tests test` |
| 空值语义静态检查（NullAway，全部 33 个模块） | 可能为 null 却按非空使用、漏判空的参数、契约与实现不一致 | `mvn -Pnullaway -pl 模块名 clean compile` |
| 依赖版本收敛（enforcer） | 同一依赖解析出多个版本（Maven 会静默按声明顺序择一，不报错） | `mvn -Pdep-convergence validate` |
| 集成测试体系（真机优先 → 容器回退 → 条件跳过） | 只在真实中间件下暴露的问题（缓存序列化、注册中心、跨服务调用） | `mvn -Pit verify` |
| 配置元数据漂移 | 配置项增删改后参考文档未同步（清单由构建产物生成，不手工维护） | `node tools/export-config-metadata.mjs --check` |
| 代码风格与 license 头 | 格式不一致、缺少 license | `mvn com.diffplug.spotless:spotless-maven-plugin:apply` |

发布前用 `tools/preflight.sh` 一次跑全五道硬门禁（全量构建含架构测试、空值语义、依赖收敛、集成测试、
配置元数据），任一门禁不通过即中止；Docker 不可用时脚本**显式失败**，而不是静默跳过集成测试。
新增模块用 `node tools/rollout-nullaway.mjs 模块名` 一键纳入空值检查（CI 自动发现参与模块，无需改 CI 文件）。
供应链侧由 Dependabot 每周检查依赖与 GitHub Actions，**同族依赖强制同批升级**（框架、测试栈、
静态分析工具链、前端生态），避免版本错配；需要 SBOM 时执行 `mvn -Psbom` 生成 CycloneDX 清单。

## 版本与状态

<VersionScope version="稳定版 v@STARTER_VERSION@ · 上一稳定版 3.0.0 · 历史稳定版 1.3.0" status="stable" />

| 通道 | 版本 | 基线 | 状态 |
| --- | --- | --- | --- |
| 稳定版 | v@STARTER_VERSION@ | Java 21 · Spring Boot 4.1.0 | 已发布 Maven Central，建议生产接入 |
| 上一稳定版 | v3.0.0 | Java 21 · Spring Boot 4.1.0 | 与 3.1.0 同基线；建议升级以获得空值检查、日志注入加固与依赖刷新 |
| 历史稳定版 | v1.3.0 | Java 17 · Spring Boot 3.5 | 仍可接入，不再获得新能力 |

发布历史与兼容性见 [发布状态](/releases) 与 [兼容性说明](/guide/compatibility)。

## 下一步

- [快速开始：接入你的第一个模块](/guide/starter/)
- [核心机制：自动装配与宿主覆盖](/guide/starter/concepts)
- [配置参考（自动生成）](/guide/config/starter)
- [服务端骨架：ypbin-admin](/products/admin)

<SourceCitation source="ypbin-starter/pom.xml、CHANGELOG.md 与 .github/workflows/ci.yml" verified-at="2026-09-14" />
