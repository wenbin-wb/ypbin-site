---
title: Admin 部署与生产检查
description: 数据库、Redis、Bootstrap、Flyway、安全和外部服务的部署流程。
---

# Admin 部署与生产检查

本页给出从本地开发到生产部署的完整顺序。全部 133 个配置入口见[Admin 配置参考](/guide/config/admin)。

## 依赖与版本

- JDK 17
- MySQL 8.4 兼容版本
- Redis 7 兼容版本
- 已发布或本地安装的 ypbin-starter
- Maven 3.9+

## 构建

```bash
mvn -B -DskipTests package
```

产物位于 `ypbin-admin-server/target/ypbin-admin.jar`。生产环境不要使用 `spring-boot:run` 长期托管进程。

## 数据库

生产应使用专用最小权限账号，不要使用 `root`。将 Flyway 迁移权限与业务运行权限分离更安全。首次迁移前备份数据库，并核对目标库是否已有非 Flyway 管理的表。

必填环境变量至少包括：

```text
DB_HOST
DB_PORT
DB_NAME
DB_USER
DB_PASSWORD
```

当前 JDBC 示例为本地开发配置；跨主机生产连接应启用 TLS并验证证书。

## Redis

Redis用于缓存、验证码、SSE票据、接口签名 nonce和分布式锁。生产必须限制到私网、开启认证并规划持久化和高可用。
