---
title: ypbin — system-level infrastructure, beneath your business logic
description: Reusable, system-level capabilities for Spring Boot — a modular starter, an assembled admin backend and a Vue 3 admin frontend, verified against the real source trees.
sidebar: false
aside: false
---

# ypbin

**System-level details rarely fix themselves. We build them in, get them right, and make them the default — so your team only writes business logic.**

Cache stampedes, JSON round-trip surprises, password-lock races, signature replay windows: every project rediscovers these the hard way. ypbin turns them into composable, well-tested building blocks beneath your services — a Spring Boot starter, an assembled admin backend, and a Vue 3 admin frontend that consume the same contracts end to end.

<div class="home-cta" style="display:flex;flex-wrap:wrap;gap:12px;margin:24px 0 8px;">
  <a class="button-primary" href="/en/guide">Get started</a>
  <a class="button-quiet" href="/en/products/starter">Explore ypbin-starter</a>
  <a class="button-quiet" href="/en/architecture">View architecture</a>
</div>

<StatusBadge status="stable" label="Stable release · Maven Central" />

## One delivery chain, three products

ypbin is not a set of competing scaffolds. Each layer depends on the one below it and stays inside its own boundary — see [Architecture](/en/architecture).

### [ypbin-starter](/en/products/starter)

A modular Spring Boot capability collection on **Java 21 / Spring Boot 4.1**. Pick only the modules you need — Web, JSON, data access, cache, security, storage, Excel, messaging, scheduling, AI and cloud components — with versions managed by a single BOM. Licensed under Apache 2.0.

### [ypbin-admin](/en/products/admin)

An assembled backend service built on the starter: system business, permissions and operations entry point, with a **microservices-first** `main` line (gateway + auth + system/ai services over Nacos) and a simpler single-app `boot` variant. Currently in development.

### [ypbin-admin-ui](/en/products/admin-ui)

The Vue 3 management frontend that pairs with admin. Menus and page access are driven by backend dynamic routes, so the frontend never treats a static menu as the source of truth for permissions. Distributed as a private workspace package.

## Capabilities you stop re-implementing

- **One response contract** — a uniform `R<T>` envelope and a single exception pipeline; validation, auth and business errors stay consistent across services.
- **Serialization that behaves** — Longs serialized as strings to protect JavaScript precision, dictionaries and references translated, sensitive fields masked.
- **Safety by default** — repeatable-request guards, CORS/XSS handling, declarative rate limiting, idempotency, signature verification and request encryption when your API is exposed.
- **Auth that holds up** — Sa-Token based session handling, password policies, login verification, online-user tracking, captcha and social sign-in, all configurable.
- **Data without footguns** — cache stampede protection and multi-level cache, multi-tenant scaffolding, data-permission filtering, generic CRUD, field-level encryption.
- **Business features prebuilt** — Excel import/export with template download, messaging (email/SMS/WebSocket/SSE/MQTT), job scheduling (built-in and XXL-JOB), commercial license enforcement, and an AI chat module with model-configuration-table driven clients.
- **Cloud when you are ready** — Nacos registry/config, gateway, load balancing, Sentinel-style traffic protection and observability hooks for microservice deployment.

Deep module manuals live in the [Docs center](/en/guide) and are maintained in Chinese, with every capability described against the corresponding release source.

## Start in minutes

1. Import the `ypbin-starter-bom` and add the modules your current business actually needs.
2. Read the module config tables and set the keys, timeouts and resource limits your production profile requires.
3. Run — then verify the exact current version and compatibility on the [Releases](/en/releases) page.

## Status

- Starter is in **stable** release; admin and admin-ui ship as a development snapshot and a private workspace build respectively — see [Release status](/en/releases).
- Found a security issue? Report it privately via [Security](/en/security).

The deep module guides and configuration references of this site are maintained in Chinese. The [Docs center](/en/guide) maps every English entry page to the matching Chinese manual, so nothing is hidden behind the facade.
