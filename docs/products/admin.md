---
title: ypbin-admin
description: 基于 ypbin-starter 组装的后台服务，主推微服务形态，含单体 boot 分支。
---

# ypbin-admin

<StatusBadge status="development" label="1.0.0-SNAPSHOT 开发中" />

> 在线访问:https://admin.ypbin.cn

ypbin-admin 是基于 ypbin-starter 组装的后台管理服务，负责系统业务、权限与运行入口。它处于开发阶段，不应被描述为稳定发布产品。

<VersionScope version="admin 1.0.0-SNAPSHOT · starter ${VERSION}" status="development" />

## 已核验范围

主分支 `main` 为微服务形态，根 POM 声明：

| 模块 | 边界 |
| --- | --- |
| `ypbin-common` | 共享常量/配置/身份头/租户等 |
| `ypbin-gateway` | 统一网关与登录鉴权 |
| `ypbin-auth` | 认证服务 |
| `ypbin-service` | system/ai 业务服务 |
| `ypbin-service-api` | Feign 接口与共享 DTO/实体 |
| `xxl-job-admin` | XXL-JOB 任务调度中心（独立中间件） |

同时维护单体版 `boot` 分支：`ypbin-admin-system`（`common` + `modules/{ai,auth,job,system}`，job 包为 XXL-JOB 执行器业务类）+ `ypbin-admin-server`。

业务定时任务统一由 XXL-JOB 调度（各服务以 `@XxlJob` 执行器接入 xxl-job-admin，见 [任务调度](/guide/starter/modules/xxljob)）。

开发基线为 Java 21、Spring Boot 4.1.0，并通过 BOM 依赖 ypbin-starter ${VERSION}。

## 安全提醒

开发种子账号 `admin/pt5aQ5E6t8dkVkMp`（密码统一见 `V2__data.sql` 种子注释）只用于本地初始化与联调，首次部署必须删除或修改。文档和示例中的 AK/SK 是演示值，不得用于生产环境。

## AI 对话能力

内置 AI 对话与模型配置管理：多模型（OpenAI 兼容接口）运行时配置、连通性测试、默认模型切换、SSE 流式输出、多轮记忆持久化与用量统计。模型地址/密钥/型号在后台配置，不写死在 yml；详见 [Admin AI 对话能力](/guide/admin/ai)。

[查看开发环境启动方式](/guide/admin/)

<SourceCitation source="ypbin-admin/pom.xml" verified-at="2026-08-10" />
