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

admin 选择 starter 能力，形成 common、system、server 三个模块。它定义管理系统的后端业务与访问控制，并向 admin-ui 提供接口和动态路由记录。

## 交互层：admin-ui

admin-ui 负责浏览器端交互。页面可见性不独立于后端权限；动态路由需要后端返回可访问菜单，再映射到前端已注册页面组件。

## 版本流

稳定接入以 starter v2.0.0 为基线（Java 21 / Spring Boot 4.1）。正在联调的 admin 1.0.0-SNAPSHOT 使用 starter 2.0.0；admin-ui 5.7.0 是私有工作区版本。各产品的当前版本状态见 [发布状态](/releases)。

## 不在当前承诺内

Actuator 已接入后台服务（health/info 端点），observability 模块未引入；计划中的能力以对应仓库源码和本站[发布页](/releases)为准。
