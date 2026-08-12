---
title: ypbin-starter-cloud-observability
description: 可观测性 模块能力说明与配置参考。
---

# cloud-observability — 可观测性

打通日志与链路：入口读取（网关签发的）`X-Request-Id` 写入 SLF4J MDC，使同一请求的所有日志携带同一
requestId，便于跨服务聚合。核心能力零重依赖，引入即生效：

```xml
<dependency>
    <groupId>cn.ypbin</groupId>
    <artifactId>ypbin-starter-cloud-observability</artifactId>
</dependency>
```

日志 pattern 引用 MDC 键即可输出：

```yaml
logging:
  pattern:
    level: "%5p [${spring.application.name:},%X{requestId:-}]"
```

配置项：

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| `ypbin.observability.enabled` | `true` | 总开关 |
| `ypbin.observability.request-id-header` | `X-Request-Id` | 请求 ID 头名，与网关保持一致 |
| `ypbin.observability.mdc-key` | `requestId` | 写入 MDC 的键名 |

**完整分布式链路追踪（可选）**：本模块默认只做 requestId ↔ MDC 关联。若需要 span 上报到
Zipkin / Tempo / SkyWalking，额外引入 Micrometer Tracing 桥接与 exporter，不绑定具体后端：

```xml
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-tracing-bridge-otel</artifactId>
</dependency>
<dependency>
    <groupId>io.opentelemetry</groupId>
    <artifactId>opentelemetry-exporter-otlp</artifactId>
</dependency>
```

```yaml
management:
  tracing:
    sampling:
      probability: 1.0
  otlp:
    tracing:
      endpoint: http://localhost:4318/v1/traces
```

微服务链路的本地端到端自测见 `deploy/README.md`。
