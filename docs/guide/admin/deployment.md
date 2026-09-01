---
title: Admin 部署
description: Docker 一键部署、环境变量配置、前端构建上传与生产检查。
---

# Admin 部署

本页覆盖从 Docker 一键部署到生产检查的完整流程。全部配置入口见[Admin 配置参考](/guide/config/admin)。

> 已上线的 Admin 管理系统:https://admin.ypbin.cn

## 微服务版部署

admin 微服务版（`feature/microservice` 分支：网关 + auth/system/ai/job 五服务，基于 Nacos/OpenFeign/Sentinel）的部署与单体版不同，详见：

- **一键部署脚本**：`ypbin-admin/deploy/install-microservice.sh`（Docker 模式全自动；`NO_DOCKER=1` 无 Docker 模式 java -jar 直启，需外部 Nacos/Redis/MySQL）
- **部署手册**：[microservice-deployment.md](https://github.com/wenbin-wb/ypbin-admin/blob/feature/microservice/docs/microservice-deployment.md)（架构/服务清单/环境变量/FAQ）

> 微服务版当前为演进分支，生产环境请以单体版（本页）为主，微服务版按上述手册评估后使用。

## Docker 部署

生产推荐 Docker Compose 编排:admin 后端 + admin-ui 前端 + MySQL + Redis。

### 架构

| 服务 | 端口(默认) | 说明 |
|---|---|---|
| `admin` | 8080 | Spring Boot 后端,Flyway 自动建表 |
| `admin-ui` | 18080 | 前端静态文件(bind 挂载 `/opt/ypbin/admin-ui-dist/`),`/api/` 代理到 admin |
| `mysql` | 3307(宿主机) | 数据库,数据卷持久化,重部署不丢;容器内仍为 3306 |
| `redis` | 6380(宿主机) | 缓存;容器内仍为 6379 |

> 宿主机映射端口默认 3307/6380，避开本机 MySQL 3306 与常见 Redis 6379 冲突；容器间仍走 Docker 内网 3306/6379，互连不受影响。

### 一键部署（推荐）

新服务器零配置一键安装（脚本自动检测并安装 git/maven/JDK21/Docker/Node）：

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/wenbin-wb/ypbin-admin/main/deploy/install.sh)
```

脚本 7 阶段自动完成：环境准备（依赖/镜像/网络预检查）→ 磁盘检测 → 拉取三仓代码 → 构建后端 jar → 构建前端 dist → 生成凭据并启动 → 健康检查。

**交互模式（默认）**：运行时会询问关键步骤（回车用默认值）：

1. **操作模式**：①完整部署 ②只更新后端 ③只更新前端 ④手动上传前端包 ⑤退出
2. **端口配置**：MySQL/Redis/后端/前端端口（默认 3307/6380/8080/18080）
3. **部署根目录**（默认 `/opt/ypbin`）
4. **前端构建方式**：服务器构建 / 手动上传（自动检测 dist 就绪）
5. **starter 构建策略**：重新构建 / 用 .m2 已有包
6. **.env 复用**：保留原凭据 / 重新生成
7. **启动前确认**：配置摘要 + Y/n

**全自动模式（CI / 无头环境）**：

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/wenbin-wb/ypbin-admin/main/deploy/install.sh) -y
```

> 脚本带版本号自更新检测，raw.githubusercontent.com 有 5 分钟 CDN 缓存，push 后立即执行可能拿到旧版；脚本会自动比对 GitHub API 最新版本并重拉。

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

部署目录的 `.env` 可配置(模板 `deploy/.env.example` 已填好可用默认值):

| 变量 | 说明 |
|---|---|
| `MYSQL_ROOT_PASSWORD` | MySQL root 密码(install.sh 自动随机生成) |
| `ADMIN_BOOTSTRAP_USERNAME` / `ADMIN_BOOTSTRAP_PASSWORD` | 首次登录创建的管理员账号(install.sh 自动生成,见下方"Bootstrap 是什么") |
| `MYSQL_PORT` / `REDIS_PORT` | MySQL/Redis 宿主机映射端口(默认 3307/6380) |
| `ADMIN_PORT` / `ADMIN_UI_PORT` | 端口(默认 8080 / 18080,被占用可改) |
| `AI_MODEL_SECRET_KEY` | AI 模型 API Key 加密密钥(16/24/32 字节,install.sh 自动生成) |
| `DB_HOST` / `REDIS_HOST` | 容器互连主机名(默认 `mysql`/`redis`,Docker 内嵌 DNS 异常时可覆写为容器 IP) |
| `YPBIN_CORS_ENABLED` / `YPBIN_CORS_ORIGINS` | CORS 开关与允许来源(默认关闭) |

> `.env.example` 已填全部可用默认值,手动部署直接 `cp deploy/.env.example deploy/.env` 即可启动;install.sh 会自动复制并随机化敏感凭据。

#### Bootstrap 是什么

**Bootstrap 是管理员初始化引导**。admin 首次启动时,若数据库里还没有管理员,会用 `.env` 的 `ADMIN_BOOTSTRAP_USERNAME` / `ADMIN_BOOTSTRAP_PASSWORD` 自动创建初始管理员账号,让系统第一次能登录进去。它只在空库首次启动时起作用,不是常驻功能。

> install.sh 生成的 `.env` 默认含 `ADMIN_BOOTSTRAP_ENABLED=true` 与随机管理员密码,首次启动即创建管理员。

**登录后应关闭 Bootstrap**:把 `.env` 的 `ADMIN_BOOTSTRAP_ENABLED` 改为 `false` 再重跑 install.sh。否则重启时初始化逻辑仍在,若你已修改过初始管理员密码,再次启动可能触发重复初始化,存在账号被按 `.env` 重置的安全风险。

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
| `JAVA_HOME` 未定义 | 安装 JDK 21 并设置 `JAVA_HOME`(install.sh 自动处理) |
| `apt: Unmet dependencies` | `apt --fix-broken install -y` 后重跑 |
| 容器内通、宿主机不通 | `systemctl restart docker` 重建转发规则 |
| 端口被占用 | 交互模式选端口时改;或改 `.env` 的 `MYSQL_PORT` / `ADMIN_PORT` 等 |
| admin 解析不了 `mysql` 主机名 | 残留容器无网络:`docker compose down && docker network prune -f && docker compose up -d` 重建;或 `.env` 配 `DB_HOST=<mysql容器IP>` |
| `403 Invalid CORS` | 跨域访问时配置 `YPBIN_CORS_ENABLED=true` + `YPBIN_CORS_ORIGINS` |
| `404 接口不存在` | nginx 代理去掉 `/api` 前缀(见上) |
| 前端请求 `localhost` | 构建时 `VITE_GLOB_API_URL` 改为 `/api` 后重建前端 |
| Maven Central 403(国内) | install.sh 自动配阿里云镜像;手动:写 `~/.m2/settings.xml` 的 mirrorOf=central 指向 maven.aliyun.com |
| 前端 js 报 `text/html` MIME | dist 目录权限不对:install.sh 自动修复为 755/644;手动 `find /opt/ypbin/admin-ui-dist -type d -exec chmod 755 {} \;` |

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
  - 后端:重跑 install.sh 选「只更新后端」(git pull + 重建 admin 容器)
  - 前端:重跑 install.sh 选「只更新前端」或「手动上传前端包」;或本地 `pnpm -F @vben/web-antd build` 后 scp 覆盖 dist,无需重启
- **磁盘清理**:`bash <(curl -fsSL https://raw.githubusercontent.com/wenbin-wb/ypbin-admin/main/deploy/cleanup.sh)`(docker 镜像/缓存/卷、journal、apt、旧日志、snap;支持 `--dry-run` 预览)
- **域名解析**:`admin.ypbin.cn` 等子域的 DNS 在 Cloudflare 指向服务器公网 IP,由宝塔 nginx 统一 80 端口转发
