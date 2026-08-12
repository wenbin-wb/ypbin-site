---
title: ypbin-starter-cloud-sentinel
description: 流量防护 模块能力说明与配置参考。
---

# cloud-sentinel — 流量防护

在 cloud-core 的 Resilience4j（调用方 Feign 熔断）之外，提供**被调方保护**：Web 接口限流、网关限流、
热点参数限流，配合可视化 Dashboard 与 Nacos 规则热更新。两者定位互补、可共存：

```xml
<dependency>
    <groupId>cn.ypbin</groupId>
    <artifactId>ypbin-starter-cloud-sentinel</artifactId>
</dependency>
```

引入即生效的能力：Sentinel Web 过滤器、`@SentinelResource` 切面、Dashboard 传输、Nacos 规则数据源
由 spring-cloud-starter-alibaba-sentinel 自动装配；本模块额外提供**被限流/降级时的统一 `R` 响应**
（`code=429`，遵循项目 HTTP 200 约定），替换 Sentinel 默认纯文本。

```yaml
spring:
  cloud:
    sentinel:
      transport:
        dashboard: localhost:8858      # 连接 Sentinel 控制台（需单独部署）
      datasource:
        flow:
          nacos:
            server-addr: localhost:8848
            data-id: ${spring.application.name}-flow-rules
            group-id: SENTINEL_GROUP
            rule-type: flow

ypbin:
  cloud:
    sentinel:
      block-message: 请求过于频繁，请稍后重试   # 被限流提示，可自定义
```

配置项：

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| `ypbin.cloud.sentinel.enabled` | `true` | 是否启用统一 R 限流响应 |
| `ypbin.cloud.sentinel.block-message` | 请求过于频繁，请稍后重试 | 被限流时的提示信息 |

**网关限流（可选）**：网关应用额外引入 `sentinel-spring-cloud-gateway-v6x-adapter`（本模块已声明为
optional 依赖），即可对路由维度限流，规则同样从 Nacos 热加载。

> Sentinel Dashboard 是独立进程，需单独部署（`deploy/docker-compose.yml` 已内置一个用于本地自测）。
> Resilience4j 与 Sentinel 是「调用方容错」与「被调方保护」的分工，无需二选一。
