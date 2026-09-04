---
title: ypbin-admin
description: 基于 ypbin-starter 开发版本组装的三模块后台服务。
---

# ypbin-admin

<StatusBadge status="development" label="@ADMIN_VERSION@ 开发中" />

> 在线访问:https://admin.ypbin.cn

ypbin-admin 是基于 ypbin-starter 组装的后台管理服务，负责系统业务、权限与运行入口。它处于开发阶段，不应被描述为稳定发布产品。

<VersionScope version="admin @ADMIN_VERSION@ · starter @STARTER_VERSION@" status="development" />

## 已核验范围

根 POM 声明两个 Maven 模块：

| 模块 | 边界 |
| --- | --- |
| `ypbin-admin-system` | 业务模块：`common` + `modules/{ai,auth,job,system}` |
| `ypbin-admin-server` | Spring Boot 启动与运行入口 |

开发基线为 Java 21、Spring Boot 4.1.0，并通过 BOM 依赖 ypbin-starter @STARTER_VERSION@。Actuator 已接入（health/info 端点，见 application.yml 的 `management` 段）；observability 模块未引入，不属于本产品页的公开能力范围。

## 安全提醒

开发种子账号 `admin/pt5aQ5E6t8dkVkMp`（密码统一见 `V2__data.sql` 种子注释）只用于本地初始化与联调，首次部署必须删除或修改。文档和示例中的 AK/SK 是演示值，不得用于生产环境。

## AI 对话能力

内置 AI 对话与模型配置管理：多模型（OpenAI 兼容接口）运行时配置、连通性测试、默认模型切换、SSE 流式输出、多轮记忆持久化与用量统计。模型地址/密钥/型号在后台配置，不写死在 yml；详见 [Admin AI 对话能力](/guide/admin/ai)。

[查看开发环境启动方式](/guide/admin/)

<SourceCitation source="ypbin-admin/pom.xml" verified-at="2026-08-10" />
