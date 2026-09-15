---
title: ypbin-starter
description: A modular Spring Boot capability collection on Java 21 and Spring Boot 4.1, published to Maven Central under Apache 2.0.
---

# ypbin-starter

<StatusBadge status="stable" label="Stable release" />

ypbin-starter is a capability collection for Spring Boot. Cross-cutting concerns — Web, JSON, data access, cache, security, storage, logging, messaging, scheduling and cloud components — are split into selectable Maven modules whose versions are managed by one BOM (`ypbin-starter-bom`, group `cn.ypbin`). Import the BOM, add only the modules your business uses, and nothing unused enters the classpath.

## Verified scope

- Java baseline is **21**. The previous stable line (3.0.0) shares that baseline; earlier lines (1.3.0 and before) ran on Java 17 with Spring Boot 3.5.
- Current runtime baseline: **Spring Boot 4.1.x**.
- Licensed under **Apache License 2.0** and published to **Maven Central**.
- Current stable version and the full release history are tracked on the [Release status](/en/releases) page.
- Facts on this page are verified against the upstream repository root configuration and changelog.

## What problems does it solve?

When several Spring Boot services keep re-implementing unified responses, exceptions, security, data access, cache, object storage or API docs, each starter module can be pulled in on demand instead of copying infrastructure code into business repositories. Starter is not a complete business system — if you want a ready-made admin backend on top of it, see [ypbin-admin](/en/products/admin).

## Module layers

Modules are grouped by dependency direction: an upper layer may depend on lower ones, while the foundation layer never depends upward on extensions or microservice layers. The full set maps one-to-one onto the modules of the root aggregator POM — **36 modules** in total.

| Layer | Modules | Role |
| --- | --- | --- |
| Foundation (L1) | `core` · `web` · `data` · `json` · `cache` · `security` · `log` · `tools` · `i18n` · `api-doc` · `storage` | No Spring Cloud dependency; usable in a monolith (11) |
| Data and security enhancements | `excel` · `captcha` · `api-crypto` · `sign` · `sensitive-words` · `license` | Common data and security capabilities (6) |
| Messaging and platform | `messaging` · `async` · `job` · `xxljob` · `social` | In-site messages/SMS push, async execution, scheduling and social sign-in (5) |
| Intelligence | `ai` | Spring AI conversation, multi-turn memory and optional RAG (1) |
| Business skeleton (L2) | `extension-crud` · `extension-tenant` · `extension-datapermission` | Generic business scaffolds layered on the foundation (3) |
| Microservices (L3) | `cloud-core` · `cloud-nacos` · `cloud-loadbalancer` · `cloud-gateway` · `cloud-observability` · `cloud-sentinel` | Distributed capabilities for Spring Cloud deployments (6) |
| Aggregation and versions | `dependencies` · `bom` · `app-web` · `app-cloud` | Unified dependency versions and out-of-the-box starter aggregations (4) |

Every module is a real Maven artifact: importing it triggers auto-configuration under the `ypbin.*` prefix, and its precise capability set is defined by the corresponding release source and its documentation. The layered map with per-module manuals is available in the [Docs center](/en/guide), and each layer is expanded into its own module pages in the [Starter module overview](/guide/starter/modules/) (Chinese docs available).

## Engineering governance

Every rule that can be checked automatically is enforced in CI, and each check can be reproduced locally:

| Gate | What it prevents | Local command |
| --- | --- | --- |
| Architecture tests (ArchUnit, 35 rules) | Inverted layer dependencies, `@Transactional` without `rollbackFor`, field injection, `printStackTrace`, inline fully-qualified names, Lombok `@Data` misuse | `mvn -pl ypbin-starter-architecture-tests test` |
| Null-safety analysis (NullAway, all 33 modules) | Values that may be null used as non-null, unchecked nullable parameters, contract/implementation mismatch | `mvn -Pnullaway -pl module clean compile` |
| Dependency version convergence (enforcer) | The same dependency resolved at several versions (Maven silently picks one) | `mvn -Pdep-convergence validate` |
| Integration test harness | Failures that appear only against real middleware (cache serialization, registry, cross-service calls) | `mvn -Pit verify` |
| Configuration metadata drift | Configuration keys changed without regenerating the reference | `node tools/export-config-metadata.mjs --check` |
| Formatting and license headers | Inconsistent style, missing license | `mvn com.diffplug.spotless:spotless-maven-plugin:apply` |

`tools/preflight.sh` runs all five hard gates before a release and fails explicitly when Docker is unavailable
instead of silently skipping integration tests. New modules join null-safety analysis with
`node tools/rollout-nullaway.mjs module`, and CI discovers participants automatically. Dependencies and
GitHub Actions are checked weekly with grouped upgrades, so packages that must move together are never bumped
one at a time; `mvn -Psbom` produces a CycloneDX SBOM when one is required. Gate definitions referenced here
live in the repository CI workflow and the preflight script.

## Quick start

1. Import the BOM and pick the modules the current business needs — a copy-ready snippet with the current stable version lives in the [Starter quick start](/guide/starter/) (Chinese docs available).
2. Read the module configuration tables before enabling a module in production; most toggles, nested keys and defaults are expanded in the [Starter configuration reference](/guide/config/starter) (Chinese docs available).
3. Set secrets, origin allow-lists, timeouts and resource limits explicitly in the production profile, then upgrade against the [compatibility matrix](/guide/compatibility) (Chinese docs available).

Also available in: [Chinese (Simplified)](/products/starter)
