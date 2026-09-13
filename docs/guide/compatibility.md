---
title: 兼容矩阵
description: ypbin 三个产品的版本与运行环境兼容范围。
---

# 兼容矩阵

| 产品 | 当前版本 | 状态 | 运行时 | 关键依赖 |
| --- | --- | --- | --- | --- |
| ypbin-starter | `@STARTER_VERSION@` | 稳定 | Java 21 | Spring Boot 4.1.0 |
| ypbin-admin | `@ADMIN_VERSION@` | 开发 | Java 21 | starter @STARTER_VERSION@ |
| ypbin-admin-ui | `@ADMIN_UI_VERSION@` | private | Node ^22.18 或 ^24.12 | pnpm >=11、Vue 3、兼容 admin API |

## 组合建议

- 只在业务服务中接入基础能力：使用 starter 稳定版 @STARTER_VERSION@（Java 21 / Spring Boot 4.1.0 基线）。
- 联调管理系统：admin @ADMIN_VERSION@ 与 starter @STARTER_VERSION@ 配套（Java 21 / Spring Boot 4.1.0）。
- admin-ui 必须连接兼容的 admin 后端，以获得动态路由和接口数据。

## 数据基础设施

数据库、Redis 等中间件的精确兼容范围以对应仓库配置和集成测试为准，下表只列出已验证的组合。
