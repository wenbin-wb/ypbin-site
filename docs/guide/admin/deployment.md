---
title: Admin 部署
description: Docker 一键部署、环境变量配置、前端构建上传与生产检查。
---

# Admin 部署

本页覆盖从 Docker 一键部署到生产检查的完整流程。全部配置入口见[Admin 配置参考](/guide/config/admin)。

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

服务器需安装 git、maven、JDK 17、docker。执行 admin 仓库 `deploy/deploy.sh`:

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
| `ADMIN_BOOTSTRAP_USERNAME` / `ADMIN_BOOTSTRAP_PASSWORD` | 首次登录创建的管理员账号 |
| `ADMIN_PORT` / `ADMIN_UI_PORT` | 端口(默认 8080 / 18080,被占用可改) |
| `YPBIN_CORS_ENABLED` / `YPBIN_CORS_ORIGINS` | CORS 开关与允许来源(默认关闭) |

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
}
```

> `location /api/` 的 `proxy_pass` 末尾斜杠会去掉 `/api` 前缀——admin 接口路径是 `/auth/login`、`/system/xxx`(无 `/api`),保留前缀会返回 404「接口不存在」。

### 常见问题

| 现象 | 解决 |
|---|---|
| `JAVA_HOME` 未定义 | 安装 JDK 17 并设置 `JAVA_HOME` |
| `apt: Unmet dependencies` | `apt --fix-broken install -y` 后重跑 |
| 容器内通、宿主机不通 | `systemctl restart docker` 重建转发规则 |
| 端口被占用 | 改 `.env` 的 `ADMIN_PORT` / `ADMIN_UI_PORT` |
| `403 Invalid CORS` | 跨域访问时配置 `YPBIN_CORS_ENABLED=true` + `YPBIN_CORS_ORIGINS` |
| `404 接口不存在` | nginx 代理去掉 `/api` 前缀(见上) |
| 前端请求 `localhost` | 构建时 `VITE_GLOB_API_URL` 改为 `/api` 后重建前端 |

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

当前 JDBC 示例为本地开发配置；跨主机生产连接应启用 TLS 并验证证书。

## Redis

Redis 用于缓存、验证码、SSE 票据、接口签名 nonce 和分布式锁。生产必须限制到私网、开启认证并规划持久化和高可用。
