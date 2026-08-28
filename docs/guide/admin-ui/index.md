---
title: admin-ui 快速开始
description: ypbin-admin-ui 技术栈、架构与启动方式。
---

# admin-ui 快速开始

<VersionScope version="5.7.0 private" status="private" />

## 技术栈

ypbin-admin-ui 是 ypbin 后台的管理前端，基于 Vue 3 + TypeScript + Ant Design Vue，构建在开源管理前端框架 Vben Admin（monorepo）之上。运行时由后端动态路由驱动，与 ypbin-admin 配套。

- **Node.js** 22.18.0 或 24.12.0
- **pnpm** 11（仓库声明 `pnpm@11.16.0`）
- **Ant Design Vue** + **Vxe Table**（列表）、**Vben Form**（表单）

## 架构概览

仓库是 monorepo，`apps/web-antd` 是实际应用，其余应用变体（`web-ele`、`web-naive` 等）与后端 mock 用于框架演进，ypbin 只维护 `web-antd`。`apps/web-antd/src` 关键目录：

| 目录 | 职责 |
|------|------|
| `adapter/` | 项目封装层：表单组件注册、vxe-table 配置、请求客户端、`VbenTableAction` |
| `api/` | 接口定义（按业务模块分文件） |
| `views/` | 业务页面（列表 + 弹层） |
| `locales/` | 国际化（zh-CN / en-US） |
| `router/` | 路由与后端动态路由映射 |
| `preferences.ts` | 偏好与主题配置 |
| `layouts/` `store/` `hooks/` `utils/` | 布局、状态、组合式函数与工具 |

开发与代码规范见[页面开发规范](/guide/admin-ui/development)。

## 安装与启动

```bash
corepack enable
corepack prepare pnpm@11.16.0 --activate
pnpm install
pnpm dev:antd
```

开发服务器通过 `/api` 代理到 `http://localhost:8080`。API 地址必须指向兼容的 admin 服务；不要通过前端硬编码菜单绕过后端动态路由。

## 动态路由

登录成功后，前端从后端获取当前用户可访问的路由记录，再映射到本地页面组件。路由缺失或组件无法解析时应暴露配置问题，而不是静默回退到虚构页面。

## 配置与开发参考

- [页面开发规范](/guide/admin-ui/development)：列表页、表格、表单弹层、API 层与 i18n 标准写法；
- [Admin UI 全量配置参考](/guide/config/admin-ui)：72 项项目与上游配置入口；
- [Admin 接口契约](/guide/admin/api)：后端全部接口的请求/响应契约。

生产构建前重点核对：

1. `VITE_GLOB_API_URL` 是否为浏览器可访问的 HTTPS 地址；
2. `VITE_BASE` 与路由 history 是否匹配部署子路径；
3. 动态菜单组件路径是否能解析到真实页面；
4. Token、SSE ticket 和错误响应是否保持后端契约；
5. 中英文键集合、时区、主题与持久化 namespace 是否一致；
6. Logo、头像和字体是否无外部 CDN 依赖；
7. 构建产物是否经过类型检查、真实页面回归和反向代理验证。

## 凭据提醒

开发种子账号 `admin/pt5aQ5E6t8dkVkMp`（实际种子以 `V2__data.sql` 为准）和文档中的演示 AK/SK 仅用于本地开发，不得用于生产环境。
