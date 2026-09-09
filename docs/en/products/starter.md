---
title: ypbin-starter
description: A modular Spring Boot capability collection on Java 21 and Spring Boot 4.1, published to Maven Central under Apache 2.0.
---

# ypbin-starter

<StatusBadge status="stable" label="Stable release" />

ypbin-starter is a capability collection for Spring Boot. Cross-cutting concerns — Web, JSON, data access, cache, security, storage, logging, messaging, scheduling and cloud components — are split into selectable Maven modules whose versions are managed by one BOM (`ypbin-starter-bom`, group `cn.ypbin`). Import the BOM, add only the modules your business uses, and nothing unused enters the classpath.

## Verified scope

- Java baseline is **21**; earlier stable lines (1.3.0 and before) ran on Java 17 with Spring Boot 3.5.
- Current runtime baseline: **Spring Boot 4.1.x**.
- Licensed under **Apache License 2.0** and published to **Maven Central**.
- Current stable version and the full release history are tracked on the [Release status](/en/releases) page.
- Facts on this page are verified against the upstream repository root configuration and changelog.

## What problems does it solve?

When several Spring Boot services keep re-implementing unified responses, exceptions, security, data access, cache, object storage or API docs, each starter module can be pulled in on demand instead of copying infrastructure code into business repositories. Starter is not a complete business system — if you want a ready-made admin backend on top of it, see [ypbin-admin](/en/products/admin).

## Module boundaries

Modules cover dependency management, core, Web, JSON, data, cache, security, API docs, storage, logging, tooling, and extended capabilities such as multi-tenancy, generic CRUD, data permission, Excel, captcha, messaging, sensitive-word filtering, i18n, request encryption, social sign-in, request signing, async execution, job scheduling (built-in and XXL-JOB), commercial licensing and AI conversation — plus cloud components (registry/config, gateway, load balancing, observability and traffic protection) for microservice deployment. The precise capability set of each module is defined by the corresponding release source and its documentation.

The layered module map with per-module manuals is available in the [Docs center](/en/guide).

## Quick start

1. Import the BOM and pick the modules the current business needs — a copy-ready snippet with the current stable version lives in the [Starter quick start](/guide/starter/) (Chinese docs available).
2. Read the module configuration tables before enabling a module in production; most toggles, nested keys and defaults are expanded in the [Starter configuration reference](/guide/config/starter) (Chinese docs available).
3. Set secrets, origin allow-lists, timeouts and resource limits explicitly in the production profile, then upgrade against the [compatibility matrix](/guide/compatibility) (Chinese docs available).

Also available in: [Chinese (Simplified)](/products/starter)
