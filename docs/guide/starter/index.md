---
title: starter 快速开始
description: 使用 Java 21 和 Maven 接入 ypbin-starter v@STARTER_VERSION@。
---

# starter 快速开始

<VersionScope version="@STARTER_VERSION@" status="stable" />

## 前置条件

- JDK 21
- Maven 3.9 或更高版本
- Spring Boot 4.1.x 兼容项目

## 导入 BOM

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

本页对应稳定版 `@STARTER_VERSION@`（Java 21 / Spring Boot 4.1.x 基线）。

## 引入能力模块

例如接入 Web 基础能力：

```xml
<dependency>
  <groupId>cn.ypbin</groupId>
  <artifactId>ypbin-starter-web</artifactId>
</dependency>
```

BOM 已管理模块版本，业务依赖不要重复声明版本。继续按实际需求选择 JSON、数据、缓存、安全或存储模块，避免一次性引入不使用的能力。

## 配置与模块参考

Starter 共 35 个 Maven 模块。每个模块的总开关、嵌套属性、默认值、条件装配、可选值和生产注意均已从源码展开到[Starter 全量配置参考](/guide/config/starter)，当前覆盖 320 个条目。接入前建议按模块逐项检查，尤其关注安全、租户、签名、存储、消息、任务、License 和 AI 的必填条件。

推荐接入顺序：

1. 导入 BOM并只选择当前业务需要的模块；
2. 阅读对应模块配置表，确认默认开启能力和外部依赖；
3. 用 `ApplicationContextRunner` 或集成测试验证宿主覆盖 Bean 生效；
4. 在生产配置中显式设置密钥、来源白名单、超时与资源上限；
5. 升级前对照兼容矩阵和发布说明。

## 版本选择

生产项目使用稳定版 `@STARTER_VERSION@`（Java 21 / Spring Boot 4.1.x）。历史稳定版 `1.3.0`（Java 17 / Spring Boot 3.5 基线）仍可接入，依赖坐标写法相同、仅版本号不同。
