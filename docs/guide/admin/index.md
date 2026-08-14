---
title: admin 快速开始
description: 在本地开发环境编译与配置 ypbin-admin。
---

# admin 快速开始

<VersionScope version="1.0.0-SNAPSHOT" status="development" />

## 前置条件

- JDK 17
- Maven 3.9 或更高版本
- 可用的数据库与 Redis，具体版本见[兼容矩阵](/guide/compatibility)
- 已在本地安装 `ypbin-starter 1.4.0-SNAPSHOT`

## 安装开发版 starter

在 starter 仓库执行 Maven install，再在 admin 仓库编译：

```bash
mvn -DskipTests install
mvn -DskipTests package
```

admin 包含 common、system、server 三个模块，server 是启动入口。实际数据库连接、Redis 与密钥必须通过本地环境配置提供，不要把凭据提交到仓库。

## 初始化安全要求

开发种子账号为 `admin/admin123`，只用于本地初始化。任何共享、测试或生产环境都必须在首次部署前修改或禁用该账号。演示 AK/SK 同样不得用于生产。

## 配置与部署参考

[Admin 全量配置参考](/guide/config/admin)逐项列出 133 个配置入口，覆盖环境变量、`application.yml` 和 `sys_config` 数据库参数。每项包含类型、默认值、启用条件、合法值、生产注意与源码位置。

部署前至少完成：

1. 使用最小权限数据库账号并显式注入 `DB_PASSWORD`；
2. 为 Redis 配置认证、私网访问与持久化策略；
3. 通过 Bootstrap 一次性创建平台管理员，成功后关闭开关；
4. 重新生成 License 签发密钥和开放应用密钥；
5. 配置真实 HTTPS CORS 来源、邮件、短信和存储源；
6. 审核租户忽略表、签名防重放、任务锁与 SSE 多节点策略；
7. 执行 Flyway 备份、回滚预案和启动后接口检查。

## 状态说明

admin 当前版本 `1.0.0-SNAPSHOT`，依赖 starter 的 `1.4.0-SNAPSHOT` 开发快照，适合本地联调和二次开发；生产部署前请评估快照依赖带来的变动风险。
