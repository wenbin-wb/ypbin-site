---
name: ypbin-site-dev
description: ypbin-site 官方文档站点开发与内容合规标准。编写、更新文档（VitePress）、校验配置文档、验证截图清单、排查品牌词或跑全量构建门禁时使用。强制 100% 契约对齐、零品牌词、零 TODO 残留、全量 pnpm check 通过。
---

# ypbin-site-dev — ypbin-site 文档站点开发与合规标准

面向 `ypbin-site`（基于 VitePress 1.6 + Vue 3 + Pagefind 的官方统一技术门户与文档站点）。
定位：**全项目的技术中枢与对外规范门户**，负责全面、准确地呈现 `ypbin-starter`（35 模块）、`ypbin-admin`（业务中台，**含单体版 `main` 与微服务版 `feature/microservice` 两种形态**）、`ypbin-admin-ui`（前端体系）的设计原理、使用指南、API 契约与部署运维。

两种模式：
- **开发模式**：新增/更新文档页面、侧边栏导航、配置自动生成脚本或截图测试时使用。
- **审计模式**：检查全站文档与实际工程实现的一致性，扫描品牌词违规、未完成 TODO、无效链接及构建状态。

---

## 铁律（RED — 违反即判不合格，必须整改）

1. **真实对齐与契约一致性（文档即代码）**：
   - 文档中描述的 Starter 模块列表（共 35 个模块）、配置项（`ypbin.*`）、API 接口路径与入参出参，**必须与实际代码 100% 保持一致**。
   - 描述 admin 时须区分形态：单体版（`main`，`UserContext` sa-token 会话）与微服务版（`feature/microservice`，五服务 + 网关 + `IdentityContext` 身份头 + Feign）；写部署/架构文档时明确是哪种形态，不混写。
   - 严禁在文档中凭空捏造未实现的功能或过期的旧配置。

2. **严禁参考项目品牌词残留**：
   - 全量 Markdown 文件、前端组件、路由配置及注释中，**绝对禁止出现 `blade`、`continew` 等参考项目的品牌关键字**。

3. **严禁生产文档出现 TODO / FIXME 占位**：
   - 凡发布或合并到主分支的文档，**严禁留下 `TODO`、`FIXME`、`待补充`、`敬请期待` 等敷衍占位符**；未完成的特性不要提前写成空章节。

4. **全量构建门禁必须通过（`pnpm check`）**：
   - 任何文档的修改或新增，必须在本地运行并全部通过门禁命令：
     ```bash
     pnpm check
     ```
   - 门禁涵盖 5 项严苛检查：
     1. `docs:config`（自动生成配置属性文档）；
     2. `screenshots:validate`（校验管理后台截图清单合法性）；
     3. `typecheck`（`vue-tsc --noEmit` 保证 TypeScript 零类型错误）；
     4. `check:content`（扫描全站文档合规性、死链与禁用词）；
     5. `build`（VitePress 全量 SSG 生成 + Pagefind 搜索引擎全文索引构建）。

5. **路径与路由规范**：
   - 路由文件一律采用小写中划线（kebab-case）命名；
   - 侧边栏配置（`docs/.vitepress/config.ts`）新增页面必须正确配置 `nav` 与 `sidebar`，禁止出现悬空页面（Orphan Page）。

6. **中英文与排版规范**：
   - 中英文、数字之间保持一个半角空格（如 `Spring Boot 4.1.0 框架`）；
   - 代码块必须显式指定高亮语言（`java`、`vue`、`ts`、`bash`、`yaml`、`json` 等）。

---

## 目录结构速查

```
ypbin-site/
├── docs/
│   ├── .vitepress/
│   │   └── config.ts             # VitePress 导航、侧边栏与主题配置
│   ├── guide/
│   │   ├── starter/              # Starter 脚手架文档（架构设计、35个模块详述）
│   │   ├── admin/                # Admin 后端业务文档与 API 契约
│   │   ├── admin-ui/             # Admin-UI 前端开发与最佳实践
│   │   └── ops/                  # 部署运维与 Docker 生产实践
│   ├── index.md                  # 站点主页 Hero
│   └── public/                   # 静态资源与截图
├── scripts/
│   ├── check-content.mjs         # 内容合规与死链扫描器
│   └── generate-config-docs.mjs  # 自动化配置项文档生成器
└── tools/
    └── screenshots/              # 自动化截图清单校验
```

---

## 常用命令

- **本地开发预览**：`pnpm dev`
- **全量合规验证与构建**：`pnpm check`
- **构建输出验证**：`pnpm preview`
