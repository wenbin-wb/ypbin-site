---
title: Admin 部署
description: Docker 一键部署、环境变量配置、前端构建上传与生产检查。
---

# Admin 部署

本页覆盖从 Docker 一键部署到生产检查的完整流程。全部配置入口见[Admin 配置参考](/guide/config/admin)。

> 已上线的 Admin 管理系统:https://admin.ypbin.cn

## Docker 部署

生产推荐 Docker Compose 编排:admin 后端 + admin-ui 前端 + MySQL + Redis。

### 架构

| 服务 | 端口(默认) | 说明 |
|---|---|---|
| `admin` | 8080 | Spring Boot 后端,Flyway 自动建表 |
| `admin-ui` | 18080 | 前端静态文件(本地构建上传),`/api/` 代理到 admin |
| `mysql` | 内部 | 数据库,数据卷持久化,重部署不丢 |
| `redis` | 内部 | 缓存 |

### 一键部署

服务器需安装 git、maven、JDK 21、docker。执行 admin 仓库 `deploy/deploy.sh`:

```bash
wget -qO- https://raw.githubusercontent.com/wenbin-wb/ypbin-admin/main/deploy/deploy.sh | bash
```

脚本自动完成:安装依赖 → 拉取三仓代码 → 构建 admin jar → 生成凭据 `.env` → 启动全部容器。之后更新执行同一条命令。

### 前端构建

服务器若无法访问 npm registry(国内常见),前端需本地构建后上传,不在服务器构建镜像:

```bash
# 本机
cd ypbin-admin-ui
pnpm install
pnpm -F @vben/web-antd build    # 产物在 apps/web-antd/dist
# 上传产物到服务器 /opt/ypbin/admin-ui-dist/
```

前端 API 地址在 `apps/web-antd/.env.production` 的 `VITE_GLOB_API_URL`,默认 `/api`(同源,经 nginx 代理到后端)。上传后 nginx 直接读新文件,无需重启。

### 环境变量(.env)

部署目录的 `.env` 可配置:

| 变量 | 说明 |
|---|---|
| `MYSQL_ROOT_PASSWORD` | MySQL root 密码(必改) |
| `ADMIN_BOOTSTRAP_USERNAME` / `ADMIN_BOOTSTRAP_PASSWORD` | 首次登录创建的管理员账号(见下方"Bootstrap 是什么") |
| `ADMIN_PORT` / `ADMIN_UI_PORT` | 端口(默认 8080 / 18080,被占用可改) |
| `YPBIN_CORS_ENABLED` / `YPBIN_CORS_ORIGINS` | CORS 开关与允许来源(默认关闭) |

#### Bootstrap 是什么

**Bootstrap 是管理员初始化引导**。admin 首次启动时,若数据库里还没有管理员,会用 `.env` 的 `ADMIN_BOOTSTRAP_USERNAME` / `ADMIN_BOOTSTRAP_PASSWORD` 自动创建初始管理员账号,让系统第一次能登录进去。它只在空库首次启动时起作用,不是常驻功能。

> **前提**:`ADMIN_BOOTSTRAP_ENABLED` 默认是 `false`(见 `application.yml` 的 `ypbin.admin.bootstrap.enabled`)。若部署脚本未生成该变量,需手动在 `.env` 添加 `ADMIN_BOOTSTRAP_ENABLED=true` 并设置用户名密码,否则首次启动不会创建管理员、无法登录。
>
> 当前 `deploy/deploy.sh` 生成 `.env` 时只写入了 `ADMIN_BOOTSTRAP_USERNAME` / `ADMIN_BOOTSTRAP_PASSWORD`,**未写入 `ADMIN_BOOTSTRAP_ENABLED`**;因此按默认配置部署后 Bootstrap 不会生效,首次登录需要手动补上 `ADMIN_BOOTSTRAP_ENABLED=true`。改完后重跑 deploy.sh 或重建容器。

**登录后应关闭 Bootstrap**:把 `.env` 的 `ADMIN_BOOTSTRAP_ENABLED` 改为 `false` 再重跑 deploy.sh。否则重启时初始化逻辑仍在,若你已修改过初始管理员密码,再次启动可能触发重复初始化,存在账号被按 `.env` 重置的安全风险。

### CORS

**默认关闭**。同源访问(nginx 代理或同端口)无需 CORS,一键部署即用。仅当前端与后端跨域时才配置:

```bash
YPBIN_CORS_ENABLED=true
YPBIN_CORS_ORIGINS=http://localhost:*,https://admin.你的域名.com,http://你的服务器IP:*
```

### 对外访问

服务器已有 nginx(如宝塔)占 80 时,admin-ui 用 18080 避开。nginx 站点配置:

```nginx
location / {
    proxy_pass http://127.0.0.1:18080;   # admin-ui 前端
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}

location /api/ {
    proxy_pass http://127.0.0.1:8080/;   # 去掉 /api 前缀
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_read_timeout 300s;
    proxy_buffering off;                 # AI 对话 SSE 流式输出必须关闭缓冲
}
```

> `location /api/` 的 `proxy_pass` 末尾斜杠会去掉 `/api` 前缀——admin 接口路径是 `/auth/login`、`/system/xxx`(无 `/api`),保留前缀会返回 404「接口不存在」。

> **AI 对话（SSE）**：对话接口返回 `text/event-stream` 流式响应，`proxy_buffering off` 必须配置，否则回复会攒到流结束才一次性下发；`proxy_read_timeout` 需覆盖模型首 token 延迟（建议 ≥ 120s）。详见 [Admin AI 对话能力](/guide/admin/ai)。

### 常见问题

| 现象 | 解决 |
|---|---|
| `JAVA_HOME` 未定义 | 安装 JDK 21 并设置 `JAVA_HOME` |
| `apt: Unmet dependencies` | `apt --fix-broken install -y` 后重跑 |
| 容器内通、宿主机不通 | `systemctl restart docker` 重建转发规则 |
| 端口被占用 | 改 `.env` 的 `ADMIN_PORT` / `ADMIN_UI_PORT` |
| `403 Invalid CORS` | 跨域访问时配置 `YPBIN_CORS_ENABLED=true` + `YPBIN_CORS_ORIGINS` |
| `404 接口不存在` | nginx 代理去掉 `/api` 前缀(见上) |
| 前端请求 `localhost` | 构建时 `VITE_GLOB_API_URL` 改为 `/api` 后重建前端 |

## 依赖与版本

- JDK 21
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

当前 JDBC 示例为本地开发配置；跨主机生产连接应启用 TLS 并验证证书。

## Redis

Redis 用于缓存、验证码、SSE 票据、接口签名 nonce 和分布式锁。生产必须限制到私网、开启认证并规划持久化和高可用。

## 注意事项

- **安全组放行**:除服务器防火墙(如宝塔),云厂商安全组也需放行对外端口(admin-ui 18080 / admin 8080)
- **HTTPS**:生产用宝塔 SSL 或 Cloudflare 提供 HTTPS;跨域访问时 CORS 源写成 `https://`
- **关闭 Bootstrap**:Bootstrap 是首次启动用 `ADMIN_BOOTSTRAP_*` 创建初始管理员的初始化引导(见上文"Bootstrap 是什么")。登录后把 `.env` 的 `ADMIN_BOOTSTRAP_ENABLED` 改为 `false` 再重跑,避免重复初始化和账号被重置的风险
- **数据备份**:MySQL 数据在 `deploy_mysql-data` 卷,定期备份;`docker compose down` 不删数据,重建不丢
- **`.env` 保密**:含数据库与管理员密码,不要提交到仓库
- **资源规划**:默认 JVM `-Xms256m -Xmx512m`,按服务器内存调整 `JAVA_OPTS`
- **日志排查**:`docker compose logs -f admin` 查看后端日志;`docker logs deploy-admin-1` 看单容器
- **日常更新**:
  - 前端:本地 `pnpm -F @vben/web-antd build` 后 scp 覆盖 dist,无需重启
  - 后端:git pull 后重跑 deploy.sh(自动重建 jar 与容器)
- **域名解析**:`admin.ypbin.cn` 等子域的 DNS 在 Cloudflare 指向服务器公网 IP,由宝塔 nginx 统一 80 端口转发
