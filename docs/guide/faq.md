---
title: 常见问题
description: ypbin 的常见问题与解答，答案以本站文档与源码为准。
---

# 常见问题

## 如何开始接入？

接入 starter 三行依赖即可，详见[稳定版快速开始](/guide/starter/)。完整示例用稳定版 `v${VERSION}`。

## 稳定版和开发快照有什么区别？

- **稳定版**（如 `v1.3.0`）：已发布至 Maven Central，建议生产接入使用。
- **开发快照**（如 `1.5.0-SNAPSHOT`）：用于下一版本验证，不应在生产使用。

各产品版本状态见[发布状态](/releases)。

## 需要哪些运行环境？

| 产品 | 环境 |
|------|------|
| ypbin-starter | Java 21 + Maven（Spring Boot 4.1.x） |
| ypbin-admin | Java 21 + MySQL + Redis |
| ypbin-admin-ui | Node 22.18+ + pnpm 11 |

数据库、Redis 等中间件的精确兼容范围以对应仓库配置为准。

## 如何开启多租户？

引入 `ypbin-starter-extension-tenant`，启用并实现 `TenantProvider` 提供当前租户来源；实体继承 `TenantBaseEntity`。详见[多租户模块文档](/guide/starter/modules/extension-tenant)。

## 数据权限怎么配置？

引入 `ypbin-starter-extension-datapermission`，实现 `DataScopeHandler`，并在需要过滤的方法上标注 `@DataPermission`。详见[数据权限模块文档](/guide/starter/modules/extension-datapermission)。

## 商业授权（License）是什么？

面向按授权交付的商业软件：供应方离线签发授权，运行端离线验签放行，基于国密 SM2/SM4/SM3。详见[商业授权教程](/guide/admin/license)与[license 模块文档](/guide/starter/modules/license)。

## admin-ui 为什么是 private 包？

admin-ui 是私有部署的工作区版本，不对外分发，`5.7.0` 不应解读为公共 npm 稳定包。

## 文档和截图如何保证真实？

- 文档事实（版本、模块数、依赖）核验自对应仓库根配置与变更记录，页面标注核验日期。
- 截图采集自真实运行的服务，manifest 记录源码提交、视口与逐文件 SHA-256。规范见[贡献指南](/contributing/)。

## 模块文档更新频率？

以对应版本源码为准。每次发布同步更新本站[发布状态](/releases)与模块文档，事实核验日期见各页。
