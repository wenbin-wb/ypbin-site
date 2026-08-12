---
title: 贡献指南
description: ypbin 官网文档、事实来源与真实截图的贡献规则。
---

# 贡献指南

## 文档事实

版本、模块数、运行时和依赖关系必须来自对应仓库的根配置、变更记录或实现代码。修改事实时同步更新 `docs/.vitepress/data/source-manifest.ts`，并注明核验日期。不要根据计划文档把未完成能力写成已交付能力。

## 本地检查

```bash
pnpm install
pnpm check
pnpm screenshots:validate
```

提交前确认普通文档使用 VitePress 默认布局，只有首页使用 `home-custom`。所有交互必须可通过键盘访问，并尊重 `prefers-reduced-motion`。

## 真实截图规范

截图统一来自真实运行的服务，条目维护在 `docs/.vitepress/data/screenshot-manifest.ts`，每张图具备：

1. 来源仓库与不可变 `sourceRef`；
2. CI 采集时间和固定 viewport；
3. 可重复的测试 fixture；
4. 敏感字段清单与脱敏记录；
5. 从 `captured` 到人工核验 `verified` 的状态变化。

三个产品的采集契约位于 `tests/fixtures/screenshots/`。admin-ui 已在真实 admin 后端、真实动态菜单和开发种子数据上完成 6 个场景采集并人工核验；原始 PNG、优化 WebP、源码提交、工作区指纹和逐文件 SHA-256 记录在 `docs/public/screenshots/admin-ui/manifest.json`。后续重采必须运行 `pnpm screenshots:capture`，不得手工替换图片绕过哈希门禁。

## 安全内容

示例凭据必须明确标注只用于本地开发。开发种子账号 `admin/admin123` 和演示 AK/SK 不得用于生产环境；截图进入站点前必须清除令牌、个人数据与内部地址。
