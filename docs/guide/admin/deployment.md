---
title: Admin 部署
description: 微服务版（main）一键部署、单体版（boot）部署、环境变量配置、前端构建上传与生产检查。
---

# Admin 部署

本页覆盖从 Docker 一键部署到生产检查的完整流程。全部配置入口见 [Admin 配置参考](/guide/config/admin)。

> 已上线的 Admin 管理系统：https://admin.ypbin.cn
>
> 当前推荐部署 **微服务版（main 分支）**：网关 + auth/system/ai/job 五服务，基于 Nacos/OpenFeign/Sentinel。
> 如需单体版，见文末 [单体版（boot 分支）](#单体版boot-分支)。

## 微服务版（推荐）

微服务版目录结构：

| 服务 | 端口 | 说明 |
|---|---|---|
| `ypbin-gateway` | 18080 | 统一网关，登录鉴权与身份头签发 |
| `ypbin-auth` | 18081 | 认证服务：登录/验证码/第三方登录 |
| `ypbin-system` | 18082 | 系统管理：RBAC/菜单/用户/租户/参数/公告/文件等 |
| `ypbin-ai` | 18083 | AI 对话/知识库/模型配置 |
| `ypbin-job` | 18084 | 定时任务 |
| `ypbin-admin-ui` | 19000 | 前端 |
| `ypbin-nacos` | 8080/8848 | 注册与配置中心 |
| `ypbin-redis` | 6379 | 缓存/会话 |
| `ypbin-mysql` | 3306 | 数据库 |

### 一键部署（推荐）

新服务器零配置一键安装微服务版（Nacos/MySQL/Redis + 5 个后端服务 + 前端）：

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/wenbin-wb/ypbin-admin/main/deploy/install.sh)
```

- 默认部署目录：`/opt/ypbin/main`
- 全自动模式：加 `-y`
- 无 Docker 环境可用 `NO_DOCKER=1`（需外部 Nacos/Redis/MySQL）
- 常用环境变量：
  - `YPBIN_ROOT`（默认 `/opt/ypbin/main`）
  - `BRANCH`（默认 `main`）
  - `MYSQL_ROOT_PASSWORD`、`AI_MODEL_SECRET_KEY`
  - `ADMIN_UI_PORT`（默认 19000）

### 前端构建

服务器若无法访问 npm registry，可本地构建后上传：

```bash
cd ypbin-admin-ui
pnpm install
pnpm -F @vben/web-antd build
# 上传到微服务部署目录
scp -r apps/web-antd/dist/* root@<服务器IP>:/opt/ypbin/main/ypbin-admin/admin-ui-dist/
```

前端 API 地址默认 `/api`，由 nginx 同源代理到网关。

### Nacos 配置

微服务版配置全部存放在 Nacos：
- Data ID：`ypbin-common.yaml`、`ypbin-gateway.yaml`、`ypbin-auth.yaml`、`ypbin-system.yaml`、`ypbin-ai.yaml`、`ypbin-job.yaml`
- 源文件位于 `ypbin-admin` 仓库 `deploy/nacos/`，`install.sh` 自动发布到 Nacos。

### 安全提示

- 首次启动由 `ADMIN_BOOTSTRAP_*` 创建平台管理员，成功后关闭 Bootstrap。
- 数据库、Redis、Nacos 均使用独立强密码，勿用默认值。
- 如需对外 HTTPS，在网关/nginx 层终止 TLS。

## 单体版（boot 分支）

如需单体部署，使用 boot 分支脚本：

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/wenbin-wb/ypbin-admin/boot/deploy/install.sh)
```

- 默认部署目录：`/opt/ypbin/boot`
- 架构：admin 后端 + admin-ui + MySQL + Redis
- 端口：admin 8080、admin-ui 18080、MySQL 3307、Redis 6380（可覆盖）
- 数据卷持久化，Flyway 自动建表。

单体版配置以 `.env` 为主，详细变量见 `ypbin-admin/deploy/.env.example`。

## 常见问题

| 现象 | 解决 |
|---|---|
| `docker: permission denied` | 将当前用户加入 docker 组或使用 `sudo` |
| 微服务经网关访问业务接口 401 | 确认下游服务已关闭本地 Sa-Token 拦截（main 配置已默认处理） |
| 前端请求 `localhost` | 构建时 `VITE_GLOB_API_URL` 改为 `/api` 后重建前端 |
| AI 对话 SSE 不出流 | 反向代理关闭 `proxy_buffering`，`proxy_read_timeout` 建议 ≥120s |
| Maven Central 403 | install.sh 自动配置阿里云镜像 |
| 容器重建后网关连不上 | 重启 admin-ui（nginx 代理容器） |

## 安全与生产检查

- 使用最小权限数据库账号，不要使用 root。
- Redis、Nacos 配置强认证与私网访问。
- 登录后关闭 `ADMIN_BOOTSTRAP_ENABLED`。
- 定期备份 MySQL/Nacos 数据。
- HTTPS 与安全组：仅放行对外端口，管理端口保持私网。
- 资源规划：微服务 5 个 JVM 建议 2GB+；单体 JVM 默认 256-512MB。

## 日常更新

- 微服务：重跑 main 一键脚本，交互选「只更新后端」或「只重启服务」。
- 单体：重跑 boot 一键脚本，交互选「只更新后端/只更新前端」。
- 前端：本地构建后覆盖部署目录 `admin-ui-dist/`，无需重启（或重启 admin-ui 容器清缓存）。
