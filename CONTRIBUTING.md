# 贡献指南

欢迎参与 ypbin-site 的贡献！本文件说明如何编写与提交文档。

## 1. 文档结构

- `docs/`：VitePress 文档站点（Markdown + 少量 Vue 组件）
- `docs/.vitepress/data/releases.json`：**版本唯一事实源**（由 starter 发布流水线自动更新，勿手改版本号）
- `scripts/inject-versions.mjs`：构建期版本注入（文档中的 `@STARTER_VERSION@` 占位符由它替换）
- `scripts/check-content.mjs`：内容合规扫描（品牌词、TODO、断言一致性）

## 2. 本地预览与校验

```bash
pnpm install
pnpm dev        # 本地预览
pnpm check      # 全链路校验（配置生成 + 截图清单 + 类型检查 + 合规扫描 + 构建 + 搜索索引）
```

`pnpm check` 是合并门禁，提交前必须通过（零警告零错误）。

## 3. 写作规范

- 全站中文，专业排版；代码示例与真实 API 保持一致（可对照 starter 源码）
- **版本号不硬编码**：正文用 `@STARTER_VERSION@` 占位符，版本状态用 `VersionScope` 组件
- 禁止出现参考项目品牌词（blade/continew）与 TODO 残留
- 新增页面需同步侧边栏配置；涉及截图需更新 `screenshots` 清单

## 4. 提交规范

- Conventional Commits：`docs(scope): 描述`，如 `docs(release): 同步 v2.0.0 发布说明`
- 不要添加 `Co-Authored-By` 尾注

## 5. 发起 Pull Request

1. 从 `main` 拉取最新代码，新建分支
2. 按 [PR 模板](.github/pull_request_template.md) 填写
3. 确保 CI（`pnpm check`）通过
