# Screenshot artifact contract

This directory defines the handoff contract for real product screenshots. The website never fabricates product screens.

Each source repository owns environment startup, deterministic seed data, authentication, and capture. It publishes an artifact containing the image plus fixture metadata. The site validates `sourceRepository`, immutable `sourceRef`, `capturedAt`, viewport, redactions, and status before accepting it.

Required lifecycle: `planned` → `captured` → `verified`. Only `verified` assets may replace the “真实截图采集中” panel.


## CI 手动触发与产物

GitHub Actions 里手动触发 `Capture product screenshots`（`workflow_dispatch`）：

1. 在 Actions 页面选择该 workflow，填入 `starter-ref` / `admin-ref` / `admin-ui-ref`；
2. 运行前 workflow 会先生成本次作业专用的 `YPBIN_SCREENSHOT_PASSWORD` 与 `ADMIN_BOOTSTRAP_PASSWORD`（只写 `$GITHUB_ENV`，日志只打印长度）；
3. 成功后下载 artifact `ypbin-product-screenshots`（路径 `docs/public/screenshots/admin-ui`，含 PNG/WebP/manifest.json）；
4. 失败时不要只看“最终 job 是否绿”：`Assert capture and validation succeeded` 会显式检查 capture/validate 两步 outcome，避免未来 `if`/`continue-on-error` 造成假绿。

本地重采仍需显式提供口令：`YPBIN_SCREENSHOT_PASSWORD=*** pnpm screenshots:capture`；本仓 CI 不提交任何截图口令。
