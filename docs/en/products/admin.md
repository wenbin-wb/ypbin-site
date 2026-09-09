---
title: ypbin-admin
description: An admin backend assembled from ypbin-starter — microservices-first main line plus a single-app boot variant, currently in development.
---

# ypbin-admin

<StatusBadge status="development" label="Development snapshot" />

> Online demo: <https://admin.ypbin.cn>

ypbin-admin is a backend management service assembled on top of ypbin-starter. It owns the system business, permissions and the operations entry point. It is under active development and must not be described as a stable release product.

## Shape

The `main` branch is the **microservices** form. Its root POM declares:

| Module | Boundary |
| --- | --- |
| `ypbin-common` | Shared constants, configuration, identity headers and tenant support |
| `ypbin-gateway` | Unified gateway: login authentication, identity-header signing and routing |
| `ypbin-auth` | Authentication service (login / captcha / social sign-in) |
| `ypbin-service` | Business service aggregation (`ypbin-system` / `ypbin-ai`) |
| `ypbin-service-api` | Feign contracts plus shared DTOs and entities across services |
| `xxl-job-admin` | XXL-JOB scheduling center (standalone middleware) |

A single-app **`boot`** variant is maintained on a separate branch: `ypbin-admin-system` (shared core plus `ai`/`auth`/`job`/`system` modules; the job package holds the XXL-JOB executor business classes) together with `ypbin-admin-server`, for teams that do not need a service split.

Scheduled business tasks are dispatched centrally by XXL-JOB; every service registers its handlers with an `@XxlJob` executor (see the [XXL-JOB module](/guide/starter/modules/xxljob), Chinese docs available).

Development baseline: Java 21 and Spring Boot 4.1.0, with starter versions supplied through the BOM.

## Security notes

The seed account shipped for local bootstrap exists only for first-run initialization and integration testing: change or remove it before any real deployment. API keys and secrets shown in documentation or examples are demo values and must never be used in production. Internal endpoints and deployment keys are covered in the [Admin deployment checklist](/guide/admin/deployment) (Chinese docs available).

## Built-in AI conversation

Admin includes AI conversation and model-configuration management: multiple OpenAI-compatible model runtimes configured at runtime, connectivity tests, default-model switching, SSE streaming, multi-turn memory persistence and usage accounting. Model endpoint, key and model name are set in the backend configuration rather than hard-coded in YAML — see [Admin AI capabilities](/guide/admin/ai) (Chinese docs available).

[Start the development environment](/guide/admin/) (Chinese docs available)

Also available in: [Chinese (Simplified)](/products/admin)
