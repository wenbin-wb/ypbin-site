---
title: ypbin-admin
description: 基于 ypbin-starter 组装的企业级后台服务——微服务 main 形态（主推）与单体 boot 形态的双形态能力与部署矩阵。
---

# ypbin-admin

<StatusBadge status="development" label="@ADMIN_VERSION@ 开发中" />

> 在线体验：https://admin.ypbin.cn

ypbin-admin 是基于 ypbin-starter 组装的企业级后台服务，提供系统管理、权限、AI 对话与运行入口等完整业务能力。目前处于开发阶段，未被声明为稳定发布产品。

## 定位与形态

同一个产品维护两种形态，业务能力同源：

| 形态 | 分支 | 组成 | 适用场景 |
| --- | --- | --- | --- |
| 微服务（主推） | `main` | `ypbin-common` + `ypbin-gateway` + `ypbin-auth` + `ypbin-service`（system/ai）+ `ypbin-service-api` | 多服务水平扩展、生产集群与跨团队边界管理 |
| 单体 | `boot` | `ypbin-admin-system`（`common` + `modules/{ai,auth,job,system}`）+ `ypbin-admin-server` | 单机部署、小团队起步与快速联调 |

业务定时任务统一由 XXL-JOB 调度（服务以 `@XxlJob` 执行器接入独立调度中心 xxl-job-admin），两种形态随 starter 2.2.0 起的任务调度口径保持一致。

## 关键设计（微服务 main）

- **服务短名路由**：对外 URL 第一段即服务短名（`system`/`auth`/`ai`），网关按短名路由并统一剥前缀，服务内 Controller 只声明纯资源路径。
- **统一鉴权与身份头**：网关校验登录态后清洗外部传入头并按会话重签内部身份头；下游解析依赖 `ypbin.security.identity.enabled` 显式开启（默认关闭，防外部伪造身份直达业务服务）。
- **内部端点守卫**：system 的 `/internal/**` 仅服务间 Feign 直连，本地守卫校验 `X-Internal-Token`（配置键 `ypbin.internal.token`，由部署 `.env` 的 `INTERNAL_TOKEN` 注入）；凭证缺失或不一致时守卫 **fail-closed 拒绝**（`R.code=401`），不静默放行。
- **跨服务调用**：auth/ai 不直连共享库，一律经 `ISystemClient` Feign 访问 system；Feign 默认超时与熔断由 starter cloud-core 注入，可逐项覆盖。
- **安全基线**：部署凭据（数据库、Redis、Nacos、内部令牌、AI 密钥）由 `install.sh` 首次运行随机生成并写入 `.env`，不提交任何真实口令；种子账号仅用于本地初始化，首登必须立即改密。

## 双形态部署

| 形态 | 部署形态 | 组成服务 | 启动方式 |
| --- | --- | --- | --- |
| 微服务（推荐） | Docker Compose 多容器 | Nacos · MySQL · Redis · gateway(18080) · auth(18081) · system(18082) · ai(18083) · xxl-job-admin(18085) · admin-ui(19000) | 一键脚本 |
| 单体 | 单 JAR | server + system（内含 common 与业务模块） | 常规 Spring Boot 启动 |

微服务版新服务器一条命令部署：

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/wenbin-wb/ypbin-admin/main/deploy/install.sh)
```

详细的部署步骤、环境变量与故障排查见 [Admin 部署文档](/guide/admin/deployment)。

## 版本与状态

<VersionScope version="admin @ADMIN_VERSION@ · 依赖 starter v@STARTER_VERSION@" status="development" />

| 产品 | 版本 | 状态 |
| --- | --- | --- |
| ypbin-admin | @ADMIN_VERSION@ | 开发中，依赖 starter v@STARTER_VERSION@ |
| ypbin-starter | v@STARTER_VERSION@ | 稳定版，Maven Central |

## 下一步

- [开发环境启动方式](/guide/admin/)
- [架构与集成说明](/guide/admin/architecture)
- [接口契约](/guide/admin/api)
- [配套前端：ypbin-admin-ui](/products/admin-ui)

<SourceCitation source="ypbin-admin/pom.xml 与 deploy/ 目录" verified-at="2026-09-09" />
