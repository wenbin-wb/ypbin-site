---
title: Starter 核心机制
description: 理解模块分层、自动装配、宿主覆盖和统一契约。
---

# Starter 核心机制

本页解释如何正确使用 ypbin-starter，而不只是复制依赖坐标。完整的 308 项配置请查阅[配置参考](/guide/config/starter)。

## 模块分层

| 层级 | 模块范围 | 约束 |
|---|---|---|
| L1 基础层 | core、web、json、data、cache、security 等 | 不依赖 Spring Cloud，单体可用 |
| L2 扩展层 | CRUD、租户、数据权限 | 在基础能力上提供可复用业务骨架 |
| L3 微服务层 | gateway、nacos、sentinel、loadbalancer 等 | 仅微服务项目按需引入 |
| 聚合层 | app-web、app-cloud、BOM | 管理常用组合与版本，不承载业务代码 |

依赖方向只能从上层指向下层；基础层不得反向依赖扩展层或微服务层。

## 自动装配

能力模块通过 `@AutoConfiguration` 与 Boot 3 的 `AutoConfiguration.imports` 注册。宿主不需要 `@ComponentScan` 或手动 `@Import`。

每项能力通常同时受三类条件约束：

1. `@ConditionalOnClass`：依赖库存在才装配；
2. `@ConditionalOnProperty`：通过 `ypbin.*.enabled` 控制；
3. `@ConditionalOnMissingBean`：宿主声明同类型 Bean 时默认实现让位。

这意味着“引入依赖”不等于“所有功能无条件启动”。排查时应同时检查 classpath、开关、Bean 和自动配置顺序。

## 宿主覆盖

需要替换默认行为时，优先声明同接口 Bean，而不是复制 starter 实现。常见扩展点包括权限、租户、数据范围、字典、引用文本、邮件、存储、签名应用和任务执行器。
