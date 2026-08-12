---
title: ypbin-admin-ui
description: 与 ypbin-admin 配套、由后端动态路由驱动的 Vue 3 管理前端。
---

# ypbin-admin-ui

<StatusBadge status="private" label="5.7.0 private" />

ypbin-admin-ui 是与 ypbin-admin 配套的 Vue 3 管理前端。菜单与页面访问由后端动态路由数据驱动，因此前端必须连接兼容的 admin 接口才能完整运行。

<VersionScope version="工作区版本 5.7.0" status="private" />

## 已核验范围

- 根包版本为 **5.7.0**，并标记 `private: true`。
- 使用 Vue 3 与 TypeScript。
- Node 运行范围为 `^22.18.0 || ^24.12.0`。
- pnpm 基线为 11，仓库声明 `pnpm@11.16.0`。
- 路由数据由后端提供，不把静态前端菜单当作真实权限来源。

private 表示该工作区不作为公共 npm 包发布，不代表产品状态稳定。它与 admin 的接口契约和权限模型共同演进。

[查看前端启动方式](/guide/admin-ui/)

<SourceCitation source="ypbin-admin-ui/package.json 与动态路由实现" verified-at="2026-08-10" />
