---
title: Docs Center
description: The index of ypbin documentation — quick start, module manuals, admin and admin-ui guides, configuration references and compatibility.
---

# Docs Center

ypbin documentation is bilingual at the entry level: the English pages you are reading now describe the products, architecture, releases and security, while the deep manuals below — quick starts, module handbooks, API contracts and configuration references — are maintained in **Chinese** and kept aligned with each release's source. Every entry page points to its matching Chinese original, so nothing is hidden.

## Get started

1. **starter** — [Quick start](/guide/starter/): import the BOM, enable the modules you need, run. Also see the [module overview](/guide/starter/modules/) and the [core mechanisms](/guide/starter/concepts) walkthrough.
2. **admin** — [Quick start](/guide/admin/): start the development environment; [architecture and starter integration](/guide/admin/architecture), [API contract](/guide/admin/api), [AI capabilities](/guide/admin/ai) and the [deployment checklist](/guide/admin/deployment).
3. **admin-ui** — [Quick start](/guide/admin-ui/): run the frontend against admin; [page development guide](/guide/admin-ui/development).

## Starter module manuals

Each module ships as its own Maven artifact; import it and it auto-configures under the `ypbin.*` prefix, with every capability Bean overridable in the host application.

| Layer | Modules |
|------|------|
| Foundation (L1) | [core](/guide/starter/modules/core) · [web](/guide/starter/modules/web) · [data](/guide/starter/modules/data) · [json](/guide/starter/modules/json) · [cache](/guide/starter/modules/cache) · [security](/guide/starter/modules/security) · [log](/guide/starter/modules/log) · [tracking](/guide/starter/modules/tracking) · [tools](/guide/starter/modules/tools) · [i18n](/guide/starter/modules/i18n) · [api-doc](/guide/starter/modules/api-doc) · [storage](/guide/starter/modules/storage) |
| Data and security enhancements | [excel](/guide/starter/modules/excel) · [captcha](/guide/starter/modules/captcha) · [api-crypto](/guide/starter/modules/api-crypto) · [sign](/guide/starter/modules/sign) · [sensitive-words](/guide/starter/modules/sensitive-words) · [license](/guide/starter/modules/license) |
| Messaging and platform | [messaging](/guide/starter/modules/messaging) · [async](/guide/starter/modules/async) · [job](/guide/starter/modules/job) · [xxljob](/guide/starter/modules/xxljob) · [social](/guide/starter/modules/social) |
| AI | [ai](/guide/starter/modules/ai) — Spring AI conversation, memory and optional RAG, driven by a model-configuration table |
| Business skeleton (L2) | [extension-crud](/guide/starter/modules/extension-crud) · [extension-tenant](/guide/starter/modules/extension-tenant) · [extension-datapermission](/guide/starter/modules/extension-datapermission) |
| Microservices (L3) | [cloud-core](/guide/starter/modules/cloud-core) · [cloud-nacos](/guide/starter/modules/cloud-nacos) · [cloud-loadbalancer](/guide/starter/modules/cloud-loadbalancer) · [cloud-gateway](/guide/starter/modules/cloud-gateway) · [cloud-observability](/guide/starter/modules/cloud-observability) · [cloud-sentinel](/guide/starter/modules/cloud-sentinel) |
| Aggregation and versions | [BOM and dependency management](/guide/starter/modules/aggregate) |

The [full module overview](/guide/starter/modules/) also explains which layer each module belongs to and when to use it (Chinese docs available).

## Configuration reference

Generated from the source trees and kept in sync with each release:

- [Starter full configuration](/guide/config/starter)
- [Admin full configuration](/guide/config/admin)
- [Admin UI full configuration](/guide/config/admin-ui)

## Reference

- [Compatibility matrix](/guide/compatibility) — runtime and version combinations verified for each product
- [FAQ](/en/faq) — curated questions in English; the [Chinese FAQ](/guide/faq) contains the original answers
- [Contribution guide](/contributing/) — how this documentation and its screenshot evidence are kept truthful

Still unsure where to start? The [product pages](/en/products/starter) describe what each layer solves, and [Architecture](/en/architecture) shows how they fit together.

Also available in: [Chinese (Simplified)](/guide/starter/)
