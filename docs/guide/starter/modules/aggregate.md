---
title: ypbin-starter-bom
description: BOM / dependencies / app-web / app-cloud 聚合模块说明。
---

# 聚合与版本

四个模块负责版本管理与起步聚合，本身不含业务能力：

| 模块 | 职责 |
|------|------|
| `ypbin-starter-dependencies` | 统一管理各模块及其第三方依赖的版本，作为子模块的父依赖 |
| `ypbin-starter-bom` | 以 BOM 形式对外发布，业务项目通过 `import` 引入即获得一致的依赖版本 |
| `ypbin-starter-app-web` | 单体应用起步聚合，一次引入全套 L1/L2 能力，开箱即用 |
| `ypbin-starter-app-cloud` | 微服务应用起步聚合，在单体聚合基础上加入 L3 云能力 |

业务项目通常只需要在 `dependencyManagement` 里 import `ypbin-starter-bom`，然后按需引入具体模块。
