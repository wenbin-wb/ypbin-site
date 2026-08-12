# Screenshot artifact contract

This directory defines the handoff contract for real product screenshots. The website never fabricates product screens.

Each source repository owns environment startup, deterministic seed data, authentication, and capture. It publishes an artifact containing the image plus fixture metadata. The site validates `sourceRepository`, immutable `sourceRef`, `capturedAt`, viewport, redactions, and status before accepting it.

Required lifecycle: `planned` → `captured` → `verified`. Only `verified` assets may replace the “真实截图采集中” panel.
