# ypbin 官网

**ypbin 官方开发文档与指南门户**

[![License](https://img.shields.io/badge/License-Apache%202.0-green.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![Node](https://img.shields.io/badge/Node-20%2B-brightgreen.svg)](https://nodejs.org/)
[![VitePress](https://img.shields.io/badge/VitePress-1.6-blue.svg)](https://vitepress.dev/)

## 本地开发

```bash
corepack enable
corepack prepare pnpm@11.16.0 --activate
pnpm install
pnpm dev
```

要求 Node.js 22.18.0 或更高版本。

## 质量检查

```bash
pnpm typecheck
pnpm check:content
pnpm build
```

Cloudflare Pages 的构建命令为 `pnpm build`，输出目录为 `docs/.vitepress/dist`。搜索使用 Pagefind（`pnpm build` 内自动生成索引，产物在 `docs/.vitepress/dist/pagefind`）；`pnpm search:pagefind` 可单独重建索引评估效果。
