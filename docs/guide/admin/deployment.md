---
title: Admin 部署
description: 微服务版（main）一键部署、单体版（boot）部署、环境变量配置、前端构建上传与生产检查。
---

# Admin 部署

本页覆盖从 Docker 一键部署到生产检查的完整流程。全部配置入口见 [Admin 配置参考](/guide/config/admin)。

> 已上线的 Admin 管理系统：https://admin.ypbin.cn
>
> 当前推荐部署 **微服务版（main 分支）**：网关 + auth/system/ai 四服务 + xxl-job-admin 任务调度中心，基于 Nacos/OpenFeign/Sentinel。
> 如需单体版，见文末 [单体版（boot 分支）](#单体版boot-分支)。

## 微服务版（推荐）

微服务版目录结构：

| 服务 | 端口 | 说明 |
|---|---|---|
| `ypbin-gateway` | 18080 | 统一网关，登录鉴权与身份头签发 |
| `ypbin-auth` | 18081 | 认证服务：登录/验证码/第三方登录 |
| `ypbin-system` | 18082 | 系统管理：RBAC/菜单/用户/租户/参数/公告/文件等 |
| `ypbin-ai` | 18083 | AI 对话/知识库/模型配置 |
| `ypbin-xxl-job-admin` | 18085 | XXL-JOB 任务调度中心（业务定时任务/执行日志/触发） |
| `ypbin-admin-ui` | 19000 | 前端 |
| `ypbin-nacos` | 8080/8848 | 注册与配置中心 |
| `ypbin-redis` | 6379 | 缓存/会话 |
| `ypbin-mysql` | 3306 | 数据库 |

### 一键部署（推荐）

新服务器零配置一键安装微服务版（Nacos/MySQL/Redis + 5 个后端服务 + xxl-job-admin + 前端）：

```bash
# 0. 仓库源自动探测（默认 GitHub，3s 快超时不可达时自动降级 Gitee 同名镜像，均不可达需显式 YPBIN_REPO=...）
#    国内服务器直接走 Gitee 入口（需先在 Gitee 建 ypbin-admin/starter/admin-ui 镜像并开启自动同步）：
# bash <(curl -fsSL https://gitee.com/wenbin_wb/ypbin-admin/raw/main/deploy/install.sh)

# 1. 默认部署主分支（main）
bash <(curl -fsSL https://raw.githubusercontent.com/wenbin-wb/ypbin-admin/main/deploy/install.sh)

# 2. 部署指定特性分支（例如 feature/miniapp-backend）
bash <(curl -fsSL https://raw.githubusercontent.com/wenbin-wb/ypbin-admin/main/deploy/install.sh) -b feature/miniapp-backend

# 3. 全自动静默部署（跳过交互确认，CI/CD 适用）
bash <(curl -fsSL https://raw.githubusercontent.com/wenbin-wb/ypbin-admin/main/deploy/install.sh) -b feature/miniapp-backend -y
```


- **参数支持**：
  - `-b, --branch <name>`：指定部署的代码分支（默认 `main`；也可传环境变量 `BRANCH=...`）；
  - `--root <dir>`：指定部署目录（默认根据分支自动隔离，如 `/opt/ypbin/<branch>`，杜绝多分支代码与配置互相覆盖）；
  - `-y, --yes`：跳过所有交互确认；
- **无 Docker 环境**：设置 `NO_DOCKER=1`（需外部 Nacos/Redis/MySQL）；
- **常用环境变量覆盖**：`BRANCH`、`YPBIN_ROOT`、`MYSQL_ROOT_PASSWORD`、`AI_MODEL_SECRET_KEY`、`ADMIN_UI_PORT`（默认 19000）。
- **凭据环境变量**：`NACOS_AUTH_TOKEN`/`NACOS_AUTH_IDENTITY_KEY`/`NACOS_AUTH_IDENTITY_VALUE`/`INTERNAL_TOKEN`/`REDIS_PASSWORD` 无需手传，install.sh 首次运行自动随机生成并写入 `deploy/.env`（见下）。


### 网络受限环境（国内服务器/镜像拉取不可达）

国内服务器常见：GitHub 不可达（脚本自动降级 Gitee 镜像）、Docker Hub 基础镜像拉不下来。处理优先级：

1. **代码源**：脚本自动探测 GitHub（3s 快超时）→ 不可达切 Gitee 同名镜像（`GITEE_REPO` 可覆盖，默认 `gitee.com/wenbin_wb`）；两者都不可达时显式 `YPBIN_REPO=https://<代理或镜像前缀>`。
2. **基础镜像（redis/mysql/nacos/xxl-job/nginx）**：
   - 首选：给 Docker 配置可达的 `registry-mirrors`（如云厂商专属加速器）或脚本自动尝试的公共前缀（`docker.m.daocloud.io` 等，装不上会逐源探活并跳过不通项）；
   - 若公共源在你的网络全部不可用（2026 年起大面积停服，表现为 `/v2/` 握手 401/302 但 blob 拉取卡死）：在另一台能拉镜像的机器执行
     `docker save redis:7-alpine mysql:8.4 nacos/nacos-server:v3.2.4 xuxueli/xxl-job-admin:3.4.2 nginx:alpine | gzip | ssh <服务器> 'gunzip | docker load'`
     导入后再跑脚本（脚本已用 legacy builder，`FROM eclipse-temurin:21-jre` 也会优先用本地 `docker load` 的镜像，不再联网解析）。
3. **apt/maven/node**：脚本会自动把官方 apt 源切阿里镜像、启用 universe（maven 所在组件）、装 docker-compose-plugin 走阿里 docker-ce 源；Maven 走 aliyun、Node/pnpm 走 npmmirror（npm 缺 `libatomic1` 时先 `apt-get install -y libatomic1`）。

### 初始登录凭据

部署完成后各类口令的位置速查（**首次登录后请立即修改业务密码**）：

| 项 | 默认/来源 | 存储 |
|---|---|---|
| 超管 `admin` 登录 | 种子 SQL `deploy/sql/002-data.sql` 内 bcrypt（注释标明明文，上线前必须改） | MySQL `sys_user.password`（bcrypt，不可逆，**明文不落配置文件**） |
| 租户测试用户 | 同上种子（`123456`） | MySQL |
| MySQL / Redis / Nacos token / INTERNAL_TOKEN | `install.sh` 首次运行**随机生成** | `部署目录/deploy/.env`（chmod 600）+ Nacos 共享配置（占位符替换） |
| Nacos 控制台 | `nacos/nacos` | Nacos 自身 |
| XXL-JOB 控制台 | `admin/123456` | xxl-job DB |

> 上线建议：删除/更换种子测试账号口令；`.env` 仅本机 root 可读；生产启用密钥管理（Secret 管理）并定期轮换。

### 凭据与 .env

- **一键随机生成**：首次运行 install.sh 生成 `deploy/.env`（`chmod 600`），自动随机生成 `MYSQL_ROOT_PASSWORD`、`NACOS_AUTH_TOKEN`（Base64 且解码后 ≥32 字节）、`NACOS_AUTH_IDENTITY_KEY/VALUE`、`REDIS_PASSWORD`（Docker 模式 16 字节 hex）、`INTERNAL_TOKEN`（64 位 hex，`/internal/**` 服务间 Feign 守卫共享凭证）、`AI_MODEL_SECRET_KEY`。
- **幂等补键**：`.env` 已存在时复用并载入，不覆盖原凭据；旧部署升级（缺新增键，如 `NACOS_AUTH_*`/`INTERNAL_TOKEN`/`REDIS_PASSWORD`）重跑 install.sh 会自动**补生成缺失键**（`env_key_backfill`），无需手工编辑。
- **Nacos 占位符导入机制**：`deploy/nacos/*.yaml` 不提交任何真实凭据——`ypbin-common.yaml` 以 `${MYSQL_ROOT_PASSWORD}` / `${REDIS_PASSWORD}` / `${INTERNAL_TOKEN}` 占位，install.sh 在导入 Nacos 前用 `.env` 实际值替换（`REDIS_PASSWORD` 为空即 NO_DOCKER 用外部无认证 Redis 时删除 `password` 行；`INTERNAL_TOKEN` 无条件替换，缺失或为空时 system 服务 `/internal/**` 守卫按 fail-closed 拒绝）。Nacos 共享配置还显式开启 `ypbin.security.identity.enabled=true`（微服务身份头，starter 2.2.2 起默认关闭，需显式开启才能让网关签发的身份头在下游生效）。
- **compose 强校验**：`docker-compose.yml` 对 `NACOS_AUTH_TOKEN`/`NACOS_AUTH_IDENTITY_*`/`REDIS_PASSWORD` 使用 `:?` 强制校验，缺失即启动报错，杜绝默认值兜底。


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
- Data ID：`ypbin-common.yaml`、`ypbin-gateway.yaml`、`ypbin-auth.yaml`、`ypbin-system.yaml`、`ypbin-ai.yaml`
- 源文件位于 `ypbin-admin` 仓库 `deploy/nacos/`，`install.sh` 替换占位符后自动发布到 Nacos（手工启动 compose 前需先跑 install.sh 完成导入，否则业务服务取不到共享配置）。
- 共享配置 `ypbin-common.yaml` 含数据库/Redis 连接、Sa-Token 会话参数、`ypbin.security.identity.enabled`（显式开启）与 `ypbin.internal.token`（内部 Feign 凭证）。
- xxl-job-admin 为独立调度中心（自带控制台与数据库 `xxl_job`，不走 Nacos）。

### Redis 与内部调用安全

- Redis 容器强制 `requirepass`（口令由 `.env` 的 `REDIS_PASSWORD` 注入，与 Nacos 共享配置 `spring.data.redis.password` 一致），端口仅映射 `127.0.0.1:6379` 宿主回环；容器间经 compose 内网互访，无需对宿主机全网卡暴露。
- system 服务 `/internal/**` 内部端点由 `X-Internal-Token` 守卫（配置键 `ypbin.internal.token`），仅服务间 Feign 直连（拦截器自动携带）可访问；外部经网关转发同样被拒；`INTERNAL_TOKEN` 缺失或为空时守卫 fail-closed 拒绝。
- 网关为 WebFlux 服务，不装配身份头过滤器；它负责清洗外部传入的身份头并按登录会话重新签发内部头，下游 auth/system/ai 依赖显式开启的 `ypbin.security.identity` 解析。

### 安全提示

- 数据库、Redis、Nacos 均使用 install.sh 随机生成的独立强口令（存 `deploy/.env`），仓库 compose/Nacos 配置不再硬编码基础设施口令；`.env.example` 仅含占位示例值（供本仓库快速起 compose），禁止生产沿用。
- 初始管理员口令来自部署种子/初始化流程，首登后**立即修改**；共享、测试或生产环境不得继续使用开发种子口令。
- 如需对外 HTTPS，在网关/nginx 层终止 TLS。

### 升级注意（会话序列化与租户 fail-closed）

- **Sa-Token 会话序列化已切到 Jackson 3**：统一到 Jackson 3 后，会话存储由 `sa-token-redis-jackson`（绑定 Jackson 2）改为 `sa-token-redis-template` + `sa-token-jackson3`。auth 与 gateway 必须**同时升级**，否则两侧会话格式不一致会导致 token 校验失败。Redis 中的存量会话可能无法反序列化，**升级后用户需重新登录**；建议选低峰发布，或发布前清理 `sa-token` 相关键。
- **租户缺上下文默认拒绝（fail-closed）**：`ypbin.tenant.fail-on-missing-tenant` 默认 `true`，无租户上下文且未显式声明忽略的查询返回业务码 409（「缺少租户上下文」），不再静默查空。登录、匿名分享、定时任务等路径已在代码中显式放行；若升级后出现该错误，说明该路径漏了 `@TenantIgnore` / `TenantContext.executeIgnore`，应补声明而非关闭开关。
- **网关不再默认放行 `/actuator/**`**：默认只放行 `health` / `info`。若需经网关访问其它 actuator 端点（如 `metrics`），须在 `ypbin-gateway.yaml` 的 `ypbin.gateway.auth.exclude-paths` 中显式声明。
- **Feign 超时默认生效**：连接 5s / 读取 10s（原先未显式配置，使用库默认读取 60s）。若存在耗时超过 10s 的服务间调用，需在 Nacos 配置中放宽 `spring.cloud.openfeign.client.config.default.read-timeout`。

## 单体版（boot 分支）

如需单体部署，使用 boot 分支脚本：

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/wenbin-wb/ypbin-admin/boot/deploy/install.sh)
```

- 默认部署目录：`/opt/ypbin/boot`
- 架构：admin 后端 + admin-ui + MySQL + Redis
- 端口：admin 8080、admin-ui 18080、MySQL 3307、Redis 6380（可覆盖）
- 数据卷持久化，Flyway 自动建表。
- 定时任务：boot 业务任务同样是 XXL-JOB 执行器（`@XxlJob`），默认复用微服务版部署的 xxl-job-admin 调度中心（`.env` 配 `YPBIN_XXL_JOB_ADMIN`，appname=`ypbin-boot`）；独立部署时自行部署调度中心即可。
- 初始管理员：单体版经 `ADMIN_BOOTSTRAP_*` 环境变量一次性创建平台管理员（`ADMIN_BOOTSTRAP_ENABLED=true` 时），创建成功后置 `false` 关闭；boot 版 `install.sh` 首次部署会**随机生成** `ADMIN_BOOTSTRAP_PASSWORD` 写入 `.env`，复用旧 `.env` 升级时保留原凭据。

单体版配置以 `.env` 为主，详细变量见 `ypbin-admin/deploy/.env.example`。

## 常见问题

| 现象 | 解决 |
|---|---|
| `docker: permission denied` | 将当前用户加入 docker 组或使用 `sudo` |
| 微服务经网关访问业务接口 401 | 确认下游服务已关闭本地 Sa-Token 拦截（main 配置已默认处理） |
| 服务间 Feign 调 `/internal/**` 报 401 | 旧部署缺 `INTERNAL_TOKEN`（重跑 install.sh 补键）或 Nacos 共享配置 `ypbin.internal.token` 未替换/不一致；凭证未配置时守卫 fail-closed 拒绝 |
| 登录行为验证码不生效 | `LOGIN_CAPTCHA_ENABLED` 系统参数为 false（默认关闭）；开启后登录必须携带 captchaId/captchaTrack |
| 前端请求 `localhost` | 构建时 `VITE_GLOB_API_URL` 改为 `/api` 后重建前端 |
| AI 对话 SSE 不出流 | 反向代理关闭 `proxy_buffering`，`proxy_read_timeout` 建议 ≥120s |
| Maven Central 403 | install.sh 自动配置阿里云镜像 |
| 容器重建后网关连不上 | 重启 admin-ui（nginx 代理容器） |

## 安全与生产检查

- 使用最小权限数据库账号，不要使用 root。
- Redis、Nacos 配置强认证与私网访问。
- 微服务版首登后立即修改初始管理员口令（部署种子账号）；单体版登录后关闭 `ADMIN_BOOTSTRAP_ENABLED`。
- 定期备份 MySQL/Nacos 数据。
- HTTPS 与安全组：仅放行对外端口，管理端口保持私网。
- 资源规划：微服务 4 个 JVM 建议 2GB+（xxl-job-admin 调度中心默认 256-512MB）；单体 JVM 默认 256-512MB。

## 日常更新

- 微服务：重跑 main 一键脚本，交互选「只更新后端」或「只重启服务」；**旧部署升级（含新增凭据版本）同样重跑 install.sh**——复用 `.env` 并自动补生成缺失键，随后自动替换 Nacos 占位符。
- 单体：重跑 boot 一键脚本，交互选「只更新后端/只更新前端」。
- 前端：本地构建后覆盖部署目录 `admin-ui-dist/`，无需重启（或重启 admin-ui 容器清缓存）。
