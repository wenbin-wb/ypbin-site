---
title: 产品架构
description: ypbin-starter、ypbin-admin 与 ypbin-admin-ui 的依赖方向和责任边界。
---

# 产品架构

ypbin 的三个产品形成单向交付链，而不是三套互相替代的脚手架。

```text
ypbin-admin-ui
  └─ 消费 HTTP API 与后端动态路由
         ↑
ypbin-admin
  └─ 组装系统业务，依赖 starter BOM 与模块
         ↑
ypbin-starter
  └─ 提供可选择的系统级基础能力
```

## 基础能力层：starter

starter 将横切能力拆成 36 个 Maven 模块。业务项目通过 BOM 获得统一版本，再按需引入模块。该层不拥有 admin 的系统菜单、用户或角色等业务数据。各模块的分层与用法见 [Starter 模块文档](/guide/starter/modules/)。

## 业务装配层：admin

admin 目前主推微服务形态，代码位于 `main` 分支，由多个 Maven 模块组成：

- `ypbin-common`：共享常量、配置、身份头/租户等微服务基础装配
- `ypbin-gateway`：统一网关，负责登录鉴权、身份头签发与路由
- `ypbin-auth`：认证服务（登录/验证码/第三方登录）
- `ypbin-service`：业务服务聚合（`ypbin-system` / `ypbin-ai`）
- `ypbin-service-api`：Feign 接口与跨服务共享 DTO/实体
- `xxl-job-admin`：XXL-JOB 分布式任务调度中心（独立中间件，任务管理/调度日志/触发）

微服务版基于 Spring Cloud Alibaba（Nacos 注册/配置中心、OpenFeign 服务调用、Sentinel 限流），与单体版共享 starter 能力。业务定时任务由 xxl-job-admin 统一调度，各服务以 `@XxlJob` 执行器接入（见 [xxljob 模块](/guide/starter/modules/xxljob)）。

**URL 路由约定（服务短名前置）**：对外 URL 第一段固定为服务短名（`system` / `auth` / `ai`），网关按短名路由到对应服务并 `StripPrefix=1` 剥掉短名段——服务内 Controller 只写纯资源路径（如 `/user/list`、`/login`、`/chat/send`）。新增业务接口只要挂在所属服务短名下即可，网关路由不随接口新增而改动；新增独立服务才需加一条短名→服务路由。免登录端点（验证码/分享页/开放接口/SSE 订阅）在网关 Nacos 配置的 `exclude-paths` 统一声明，同样走短名形态（如 `/auth/captcha`、`/ai/share`、`/system/ypbin/sse`）。单体版（boot）无网关，Controller 直接带完整前缀（`/system/user`），同一份前端 URL 天然命中。

另提供单体版（`boot` 分支）：`ypbin-admin-system`（`common` + `modules/{ai,auth,job,system}`，job 包为 XXL-JOB 执行器业务类）+ `ypbin-admin-server`，适合不需要微服务拆分/部署更简单的场景。

## 交互层：admin-ui

admin-ui 负责浏览器端交互。页面可见性不独立于后端权限；动态路由需要后端返回可访问菜单，再映射到前端已注册页面组件。

## 版本流

稳定接入以 starter v${VERSION} 为基线（Java 21 / Spring Boot 4.1）。正在联调的 admin 1.0.0-SNAPSHOT 使用 starter ${VERSION}；admin-ui 5.7.0 是私有工作区版本。各产品的当前版本状态见 [发布状态](/releases)。

## 不在当前承诺内

Actuator 已接入后台服务（health/info 端点），observability 模块未引入；计划中的能力以对应仓库源码和本站[发布页](/releases)为准。
