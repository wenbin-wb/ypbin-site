---
title: FAQ
description: Frequent questions about ypbin — getting started, stable versus snapshot channels, runtimes, multi-tenancy, data permission, licensing and more.
---

# FAQ

## How do I start?

Import the BOM, add the starter modules your business needs and run — the copy-ready snippet and the recommended order are in the [Starter quick start](/guide/starter/) (Chinese docs available). Complete examples use the current stable release, which you can look up on the [Release status](/en/releases) page.

## What is the difference between stable and snapshot versions?

- **Stable** (e.g. `v1.3.0`, published to Maven Central) — recommended for production integrations.
- **Development snapshot** (e.g. `1.0.0-SNAPSHOT`) — used to validate the next version and not meant for production.

The live channel of every product is on the [Release status](/en/releases) page.

## Which runtimes do the products need?

| Product | Environment |
|------|------|
| ypbin-starter | Java 21 + Maven (Spring Boot 4.1.x) |
| ypbin-admin | Java 21 + MySQL + Redis |
| ypbin-admin-ui | Node 22.18+ + pnpm 11 |

The precise compatibility range for databases, Redis and other middleware follows the corresponding repository configuration — see the [compatibility matrix](/guide/compatibility) (Chinese docs available).

## How do I enable multi-tenancy?

Import `ypbin-starter-extension-tenant`, enable it and implement a `TenantProvider` that supplies the current tenant; entities then extend `TenantBaseEntity`. Full details are in the [multi-tenant module](/guide/starter/modules/extension-tenant) (Chinese docs available).

## How does data permission work?

Import `ypbin-starter-extension-datapermission`, implement a `DataScopeHandler`, and annotate the methods that need filtering with `@DataPermission`. See the [data-permission module](/guide/starter/modules/extension-datapermission) (Chinese docs available).

## What is commercial licensing (License)?

Licensing targets commercial software that is delivered per license: the vendor signs an authorization offline, the running instance verifies the signature offline and gates access, based on SM2/SM4/SM3. See the [commercial license guide](/guide/admin/license) and the [license module](/guide/starter/modules/license) (Chinese docs available).

## Why is admin-ui a private package?

admin-ui is a private-deployment workspace version and is not distributed publicly; its `5.7.0` must not be read as a stable public npm package. It pairs with the admin backend through the same API and permission contract.

## How are the documentation and screenshots kept truthful?

- Document facts (versions, module scope, dependencies) are verified against the corresponding repository root configuration and changelog, and each page records its verification date.
- Screenshots come from a real running service; the manifest records the source commit, viewport and a per-file SHA-256 for every image. Rules are in the [contribution guide](/contributing/) (Chinese docs available).

## How often is the module documentation updated?

Against the source of the corresponding release. Each release syncs this site's [Release status](/en/releases) page and the module manuals; verification dates are printed on the pages.

Also available in: [Chinese (Simplified)](/guide/faq)
