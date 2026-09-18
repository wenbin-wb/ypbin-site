---
title: admin 快速开始
description: 在本地开发环境编译与配置 ypbin-admin。
---

# admin 快速开始

<VersionScope version="@ADMIN_VERSION@" status="development" />

## 一键部署（生产，推荐）

新服务器零配置一键安装微服务版（Nacos + 网关 + auth/system/ai 四服务 + xxl-job-admin 调度中心 + MySQL + Redis + 前端）：

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/wenbin-wb/ypbin-admin/main/deploy/install.sh)
```

交互模式会询问：操作模式（完整部署 / 只更新后端 / 只重启服务）、端口、部署目录等；加 `-y` 全自动跳过所有询问。完整流程见 [Admin 部署](/guide/admin/deployment)。

> 需要单体版（boot 分支）时使用：
>
> ```bash
> bash <(curl -fsSL https://raw.githubusercontent.com/wenbin-wb/ypbin-admin/boot/deploy/install.sh)
> ```

## 本地开发

### 前置条件

- JDK 21
- Maven 3.9 或更高版本
- 可用的数据库与 Redis，具体版本见[兼容矩阵](/guide/compatibility)
- 已在本地安装 `ypbin-starter @STARTER_VERSION@`

### 安装开发版 starter

在 starter 仓库执行 Maven install，再在 admin 仓库编译：

```bash
mvn -DskipTests install
mvn -DskipTests package
```

admin 主分支（`main`）为**微服务形态**，包含 common、gateway、auth、service（system/ai）、service-api；网关统一鉴权并签发身份头，服务间经 Feign 直连（`/internal/**` 走共享调用凭证守卫），业务定时任务由独立 xxl-job-admin 调度中心统一管理。需要更简单形态时用 **boot 分支（单体版）**（`modules/job` 为 XXL-JOB 执行器业务类）。实际数据库连接、Redis 与密钥必须通过本地环境配置提供，不要把凭据提交到仓库。

## 初始化安全要求

初始账号与口令由部署种子/初始化流程提供（微服务版 deploy 种子 `002-data.sql`、单体版 Flyway `V2__data.sql`），**登录页与前端源码不再内置演示口令**。种子口令只用于本地初始化与联调，任何共享、测试或生产环境都必须在首次部署后立即修改或禁用该账号；演示 AK/SK 同样不得用于生产。

## 配置与部署参考

[Admin 全量配置参考](/guide/config/admin)逐项列出 133 个配置入口，覆盖环境变量、`application.yml` 和 `sys_config` 数据库参数。每项包含类型、默认值、启用条件、合法值、生产注意与源码位置。

部署前至少完成：

1. 使用最小权限数据库账号并显式注入 `DB_PASSWORD`；
2. 为 Redis 配置认证、私网访问与持久化策略；
3. 初始化平台管理员：微服务版首登后立即修改种子口令，单体版经 Bootstrap 创建后关闭开关；
4. 重新生成 License 签发密钥和开放应用密钥；
5. 配置真实 HTTPS CORS 来源、邮件、短信和存储源；
6. 启用 AI 对话时确保 `AI_MODEL_SECRET_KEY`（API Key 加密密钥）已就位：install.sh 首次全新部署自动生成并写入 `deploy/.env`，请妥善保存；复用旧 `.env` 时必须沿用旧值。在模型配置页维护模型；反向代理需关闭 SSE 缓冲（见 [Admin AI 对话能力](/guide/admin/ai)）；
7. 审核租户忽略表、签名防重放、任务锁与 SSE 多节点策略；
8. 执行 Flyway 备份、回滚预案和启动后接口检查。

## 状态说明

admin 当前版本 `@ADMIN_VERSION@`，依赖 starter 的 `@STARTER_VERSION@` 稳定版，适合本地联调和二次开发。
