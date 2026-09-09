---
title: Release Status
description: Version status of the three ypbin products and the ypbin-starter release history.
---

# Release Status

## Version status

| Product | Channel | Version | Status |
| --- | --- | --- | --- |
| ypbin-starter | Stable | `v@STARTER_VERSION@` | Released; use for production integrations |
| ypbin-admin | Development | `@ADMIN_VERSION@` | Not yet a stable release; built on starter `@STARTER_VERSION@` |
| ypbin-admin-ui | Private | `@ADMIN_UI_VERSION@` | Workspace-only version; not a public npm stable package |

## Release history

| Version | Date | Highlights |
| --- | --- | --- |
| v2.2.1 | 2026-09-07 | SSE subscription/`userId` resolution accepts the gateway identity-header form — the microservice downstream real-time push can subscribe again |
| v2.2.0 | 2026-09-05 | Centralized scheduling: XXL-JOB executor wiring added, business jobs move from the built-in scheduler to the XXL-JOB center |
| v2.1.1 | 2026-09-04 | Microservice fixes: Jackson 3 timestamp alignment, unified `FeignResponses` parsing, WebFlux gateway assembly fix, release pipeline fix |
| v2.1.0 | 2026-09-01 | Microservice identity-header context and `@PlatformAccess` in starter; declarative cache eviction and permanent cache mode; `UserContext` facade; Feign header/tenant propagation |
| v2.0.0 | 2026-08-31 | Breaking release: `BaseController` removed — request context moves to `WebRequestUtils`, current user to `UserContext`, responses to the `R` static factories |
| v1.4.0 | 2026-08-28 | Java 21 + Spring Boot 4.1.0 baseline; AI conversation module; annotation-driven sensitive-word filtering; AI usage listener and actuator self-diagnosis |
| v1.3.0 | 2026-08-14 | Cron validation, license online-verification failure policy, dynamic social sign-in registration, captcha resource self-healing, wider unit coverage |
| v1.2.0 | 2026-08-07 | `@LogMask` field masking, access-log aspect rework, license online verification hardening, SSE heartbeat keep-alive |
| v1.1.0 | 2026-08-06 | Commercial license module (SM2/SM4/SM3 signing and verification) plus SSE security hardening |
| v1.0.0 | — | First stable release: out-of-the-box starter set for monolith and microservice use, published to Maven Central (`cn.ypbin`) |

The version-status table above is kept aligned with the Chinese [release status](/releases) page (Chinese docs available), whose release metadata is verified against the corresponding repository root configuration and `CHANGELOG.md` and synced automatically from the upstream release pipeline.

## Version conventions

This site always distinguishes stable releases, development snapshots and private workspace versions. Documentation examples default to stable dependencies; SNAPSHOT versions appear only in cross-repository development notes. ypbin-starter releases and this page are kept in sync automatically from the upstream release pipeline.

Also available in: [Chinese (Simplified)](/releases)
