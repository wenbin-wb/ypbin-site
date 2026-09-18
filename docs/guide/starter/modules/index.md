---
title: Starter 模块文档
description: ypbin-starter 38 个 Maven 模块的分层总览与使用文档。
---

# Starter 模块文档

ypbin-starter 是面向 Spring Boot 的系统级基础能力集合。全部能力拆分为可选择的 Maven 模块，按需引入，用不到的模块不进 classpath。模块名与 maven artifact 一一对应，来源为根聚合 pom。

## 分层总览

| 分层 | 模块 | 定位 |
|------|------|------|
| 基础能力 L1 | [core](/guide/starter/modules/core) · [web](/guide/starter/modules/web) · [data](/guide/starter/modules/data) · [json](/guide/starter/modules/json) · [cache](/guide/starter/modules/cache) · [security](/guide/starter/modules/security) · [log](/guide/starter/modules/log) · [tracking](/guide/starter/modules/tracking) · [tools](/guide/starter/modules/tools) · [i18n](/guide/starter/modules/i18n) · [api-doc](/guide/starter/modules/api-doc) · [storage](/guide/starter/modules/storage) | 不依赖 Spring Cloud，单体即可用 |
| 数据与安全增强 | [excel](/guide/starter/modules/excel) · [captcha](/guide/starter/modules/captcha) · [api-crypto](/guide/starter/modules/api-crypto) · [sign](/guide/starter/modules/sign) · [sensitive-words](/guide/starter/modules/sensitive-words) · [license](/guide/starter/modules/license) | 业务常见的数据与安全能力 |
| 消息与平台 | [messaging](/guide/starter/modules/messaging) · [async](/guide/starter/modules/async) · [job](/guide/starter/modules/job) · [xxljob](/guide/starter/modules/xxljob) · [social](/guide/starter/modules/social) | 推送、异步、任务调度与第三方登录 |
| 智能能力 | [ai](/guide/starter/modules/ai) | Spring AI 对话、记忆与 RAG（模型配置表驱动） |
| 业务骨架 L2 | [extension-crud](/guide/starter/modules/extension-crud) · [extension-tenant](/guide/starter/modules/extension-tenant) · [extension-datapermission](/guide/starter/modules/extension-datapermission) | 在基础能力上叠加的通用业务骨架 |
| 微服务 L3 | [cloud-core](/guide/starter/modules/cloud-core) · [cloud-nacos](/guide/starter/modules/cloud-nacos) · [cloud-loadbalancer](/guide/starter/modules/cloud-loadbalancer) · [cloud-gateway](/guide/starter/modules/cloud-gateway) · [cloud-observability](/guide/starter/modules/cloud-observability) · [cloud-sentinel](/guide/starter/modules/cloud-sentinel) | 面向 Spring Cloud 的分布式能力 |
| 聚合与版本 | [bom 与依赖管理](/guide/starter/modules/aggregate) | 版本统一与起步聚合 |

## 引入方式

每个模块引入即自动装配，通过 `ypbin.*` 前缀配置，能力 Bean 均可在宿主侧覆盖。稳定版通过 BOM 管理版本：

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

本页以稳定版 `@STARTER_VERSION@`（Java 21 / Spring Boot 4.1.x）为准；历史稳定版 `1.3.0`（Java 17 / Spring Boot 3.5 基线）的 BOM 写法相同，仅版本号不同。
