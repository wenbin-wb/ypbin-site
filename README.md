# ypbin 官网

ypbin 独立官网与文档门户，基于 VitePress、Vue 3 和 TypeScript 构建。

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

Cloudflare Pages 的构建命令为 `pnpm build`，输出目录为 `docs/.vitepress/dist`。首版搜索使用 VitePress local search；构建后可运行 `pnpm search:pagefind` 评估 Pagefind 索引。
