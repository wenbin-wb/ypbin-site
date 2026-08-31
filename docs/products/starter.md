---
title: ypbin-starter
description: 36 模块的 Spring Boot 系统级基础能力集合。
---

# ypbin-starter

<StatusBadge status="stable" label="v2.0.0 稳定版" />

ypbin-starter 是面向 Spring Boot 的基础能力集合。它将 Web、JSON、数据访问、缓存、安全、存储、日志、消息、任务、云组件等横切能力拆分为可选择的 Maven 模块，通过 BOM 管理版本。

<VersionScope version="稳定版 2.0.0 / 开发版 2.0.0+" status="stable" />

## 已核验范围

- 根聚合项目声明 **36 个 Maven 模块**。
- Java 基线为 **21**（1.3.0 及以前为 17；1.4.0 起随 Spring Boot 4.1 升级到 21）。
- 当前稳定版本为 **v2.0.0**（2026-08-31 发布，破坏性变更：删除 BaseController，API 迁移至 WebRequestUtils/UserContext/R 静态工厂）。
- 许可证为 Apache License 2.0。

## 适合解决什么

当多个 Spring Boot 服务重复处理统一响应、异常、安全、数据访问、缓存、对象存储或 API 文档时，可以按需引入对应 starter，避免在业务仓库里复制基础设施代码。它不是完整业务系统；需要现成后台服务时，请查看 [ypbin-admin](/products/admin)。

## 模块边界

模块覆盖依赖管理、核心、Web、JSON、数据、缓存、安全、API 文档、存储、日志、工具、租户、CRUD、数据权限、Excel、验证码、消息、敏感词、国际化、接口加密、社交、签名、云组件、异步、任务、License、AI 对话与应用聚合层。具体能力以对应版本源码和文档为准。

[使用稳定版开始接入](/guide/starter/)

<SourceCitation source="ypbin-starter/pom.xml 与 CHANGELOG.md" verified-at="2026-08-14" />
