---
title: Architecture
description: How ypbin-starter, ypbin-admin and ypbin-admin-ui depend on each other, and where each responsibility boundary sits.
---

# Architecture

The three ypbin products form one one-way delivery chain instead of three interchangeable scaffolds.

```text
ypbin-admin-ui
  └─ consumes the HTTP API and the backend dynamic routes
         ↑
ypbin-admin
  └─ assembles system business on the starter BOM and modules
         ↑
ypbin-starter
  └─ provides selectable, system-level capabilities
```

## Foundation layer — starter

Starter splits cross-cutting capabilities into focused, selectable Maven modules. Business projects get a single version set from the BOM and then import modules on demand. This layer owns no admin business data such as system menus, users or roles. The layered module map and per-module manuals live in the [Docs center](/en/guide).

## Assembly layer — admin

Admin currently leads with its **microservices** form on the `main` branch, composed of several Maven modules:

- `ypbin-common` — shared constants, configuration and microservice base assembly such as identity headers and tenant support
- `ypbin-gateway` — unified gateway: login authentication, identity-header signing and routing
- `ypbin-auth` — authentication service (login / captcha / social sign-in)
- `ypbin-service` — business service aggregation (`ypbin-system` / `ypbin-ai`)
- `ypbin-service-api` — Feign contracts and cross-service shared DTOs and entities
- `xxl-job-admin` — XXL-JOB distributed scheduling center (standalone middleware: job management, scheduling logs, triggers)

The microservice form is built on the Spring Cloud stack (Nacos for registry and configuration, OpenFeign for service calls, Sentinel-style traffic protection) and shares the same starter capabilities with the single-app form. Business scheduling is centralized in XXL-JOB; each service joins with an `@XxlJob` executor (see the [XXL-JOB module](/guide/starter/modules/xxljob), Chinese docs available).

**Inter-service call security.** Auth and AI never share the business database directly. They call the system service only through the `ISystemClient` Feign client against internal `/internal/**` endpoints, and those calls do not pass through the gateway. The system service guards that segment locally with an `X-Internal-Token` header (shared property `ypbin.internal.token`, injected at deploy time from the `INTERNAL_TOKEN` environment variable). When the token is not configured the guard fails closed, and external traffic forwarded through the gateway is rejected as well. Gateway authentication targets browser traffic: after validating the login token it **clears any externally supplied identity header** and re-issues an internal one from the session. Downstream parsing requires `ypbin.security.identity.enabled` to be **explicitly enabled** — it is disabled by default in current starter releases so a forged header cannot reach a business service directly. Details are covered in [Admin architecture and integration](/guide/admin/architecture) (Chinese docs available).

**URL convention (service short name first).** The first segment of every public URL is the service short name (`system` / `auth` / `ai`). The gateway routes on the short name and strips it with `StripPrefix=1`, so controllers inside a service only write plain resource paths such as `/user/list`, `/login` or `/chat/send`. New business endpoints simply hang under the short name of their own service; the gateway route set does not change when interfaces are added, and a new route entry is only needed when a brand-new service appears. Login-free endpoints (captcha, share pages, open APIs and SSE subscriptions) are declared centrally in the gateway `exclude-paths` (Nacos configuration) and keep the short-name form, for example `/auth/captcha`, `/ai/share` and `/system/ypbin/sse`. The single-app (`boot`) form has no gateway: controllers carry the full prefix (`/system/user`) and the same frontend URL matches naturally.

The single-app **`boot`** variant (`ypbin-admin-system` with shared core and `ai`/`auth`/`job`/`system` modules, plus `ypbin-admin-server`) fits scenarios that do not need a service split and prefer simpler deployment.

## Interaction layer — admin-ui

admin-ui owns the browser-side interaction. Page visibility does not exist independently of backend permissions: the dynamic route only renders pages the backend says the current user may access, then maps them to frontend-registered page components.

## Version flow

The stable integration baseline is the current stable starter line (Java 21 / Spring Boot 4.1). ypbin-admin currently ships as a development snapshot and ypbin-admin-ui as a private workspace build — see [Release status](/en/releases) for the live state of every product.

## Outside the current commitment

Admin services expose Actuator endpoints (`health` / `info`); the observability starter module is not yet wired in. Planned capabilities follow the corresponding repository source and the [Release status](/en/releases) page.

Also available in: [Chinese (Simplified)](/architecture)
