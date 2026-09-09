---
title: ypbin-admin-ui
description: The Vue 3 admin frontend for ypbin-admin, driven by backend dynamic routes; distributed as a private workspace package.
---

# ypbin-admin-ui

<StatusBadge status="private" label="Private workspace package" />

ypbin-admin-ui is the Vue 3 management frontend that pairs with ypbin-admin. Menus and page access are driven by the dynamic route data returned by the backend, so the frontend must be connected to a compatible admin API to run in full; a static frontend menu is never treated as the real permission source.

## Verified scope

- Workspace version `5.7.0`, marked `private: true`.
- Built with Vue 3 and TypeScript.
- Node engine range `^22.18.0 || ^24.12.0`; pnpm 11 baseline (`pnpm@11.16.0`).
- Routing data is provided by the backend; page visibility stays aligned with backend permissions.

`private` means the workspace is not published as a public npm package — it does not describe the maturity of the product. The frontend and admin evolve together against the same API and permission contract.

[Run the frontend locally](/guide/admin-ui/) (Chinese docs available) · [Page development guide](/guide/admin-ui/development) (Chinese docs available)

Also available in: [Chinese (Simplified)](/products/admin-ui)
