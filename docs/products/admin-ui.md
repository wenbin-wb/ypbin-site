---
title: ypbin-admin-ui
description: 与 ypbin-admin 配套、由后端动态路由驱动的 Vue 3 管理前端——技术基线、接口契约与版本状态。
---

# ypbin-admin-ui

<StatusBadge status="private" label="web-antd v5.7.0 · private" />

> 在线访问：https://admin.ypbin.cn（admin-ui 前端，需连接 admin 后端接口）

ypbin-admin-ui 是与 ypbin-admin 配套的 Vue 3 管理前端。菜单与页面访问由后端动态路由数据驱动，因此前端必须连接兼容的 admin 接口才能完整运行；前端静态菜单不作为真实权限来源。

## 定位与技术基线

在开源管理前端框架 Vben Admin（monorepo）的 `apps/web-antd` 上做项目落地，仓库只维护 `web-antd` 一个应用：

| 维度 | 基线 |
| --- | --- |
| 语言与框架 | Vue 3 · TypeScript · Vite |
| UI 体系 | Ant Design Vue + Vxe Table（列表）+ Vben Form（表单/弹层） |
| 运行环境 | Node `^22.18.0 || ^24.12.0`，pnpm 11（仓库声明 `pnpm@11.16.0`） |
| 权限模型 | 后端动态路由 + 按钮权限码 |
| 分发方式 | 私有部署，不作为公共 npm 包发布 |

## 与 admin 的关键契约

- **统一响应**：接口返回 `{code, message, data, success, timestamp}`，业务以 `code` 判定成败；分页返回 `{items, total}`；Long 一律序列化为字符串。
- **表格**：列表走 `useVbenVxeGrid` + 代理查询，单元格使用已注册渲染器，不在列定义里手写渲染逻辑。
- **下载**：统一经 `downloadByBlob(blob, fileName)`（`#/utils/file`）创建临时链接、触发下载并安全释放内存，配套后端的 GET 导出接口（如用户、操作日志导出）。
- **导入**：标准导入模态框独立封装于 `modules/import.vue`，内置纯表头模板下载、拖拽上传与错误明细折叠展示，业务页仅做挂载与编排。
- **状态过滤**：列表 Query 支持 `status` 精确过滤（`0` 禁用 / `1` 正常），管理端用其找回已停用数据（如用户、角色、AI 模型与提示词模板）。
- **动态菜单与权限码**：登录后从后端读取菜单与权限码，菜单映射为前端路由、受保护按钮以权限码控制显隐；路由或组件无法解析时必须暴露配置问题，不能静默回退。
- **文案与交互**：页面文案全量 i18n，无硬编码中文，与后端字典/枚举派生文案配套。

详细约定见 [页面开发标准](/guide/admin-ui/development) 与 [Admin 接口契约](/guide/admin/api)。

## 快速接入（本地开发）

```bash
cd ypbin-admin-ui
pnpm install
pnpm dev:antd
```

生产构建与部署（构建产物上传、nginx 与目录权限）见 [Admin 部署文档](/guide/admin/deployment)。

## 版本与状态

<VersionScope version="web-antd v5.7.0 · 私有工作区" status="private" />

private 表示该工作区不作为公共 npm 包发布，不代表产品状态稳定；`web-antd` 应用版本随 Vben 5 基线发布，与 admin 的接口契约和权限模型共同演进。当前三端版本状态见 [发布状态](/releases)。

## 下一步

- [前端启动与开发环境](/guide/admin-ui/)
- [页面开发标准与契约](/guide/admin-ui/development)
- [前端配置参考](/guide/config/admin-ui)
- [配套后端：ypbin-admin](/products/admin)

<SourceCitation source="ypbin-admin-ui/package.json 与动态路由实现" verified-at="2026-09-09" />
