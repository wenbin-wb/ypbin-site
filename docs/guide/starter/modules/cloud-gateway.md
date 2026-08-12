---
title: ypbin-starter-cloud-gateway
description: 网关通用横切能力 模块能力说明与配置参考。
---

# cloud-gateway — 网关通用横切能力

在 Spring Cloud Gateway（WebFlux）基础上提供开箱即用的横切能力，不预设路由规则：

```xml
<dependency>
    <groupId>cn.ypbin</groupId>
    <artifactId>ypbin-starter-cloud-gateway</artifactId>
</dependency>
```

**核心能力**（默认开启）：

- **请求 ID 透传**：入口生成/复用 `X-Request-Id`，写入响应头，与 cloud-core 配合贯穿调用链。
- **身份头清洗**：默认移除客户端传入的 `X-User-Id` / `X-Tenant-Id` / `X-Dept-Id` / `X-Roles`，防身份伪造。
- **全局异常 JSON 响应**：Gateway 异常统一转为 `R` JSON（HTTP 200），与 Servlet 全局异常保持风格一致。
- **WebFlux CORS**：与 Servlet CorsFilter 独立，`ypbin.gateway.cors` 前缀单独配置。

可选能力（按需开启）：

**统一认证**：

```yaml
ypbin:
  gateway:
    auth:
      enabled: true
      exclude-paths:
        - /actuator/**
        - /swagger-ui/**
```

```java
@Component
public class JwtAuthProvider implements GatewayAuthProvider {
    @Override public Mono<GatewayAuthResult> authenticate(ServerWebExchange exchange) {
        // 校验 token，成功则返回可信身份头
        return Mono.just(GatewayAuthResult.success(Map.of("X-User-Id", userId)));
    }
}
```

**Swagger 文档聚合**：自动从 Gateway 路由表解析 `lb://service-name` 生成 Swagger UI 下拉列表：

```yaml
ypbin:
  gateway:
    swagger:
      enabled: true
```

网关需同时引入 `springdoc-openapi-starter-webflux-ui`，前端访问 `/swagger-ui.html` 即可切换下游微服务文档。

**Nacos 动态路由**：从 Nacos 配置中心加载 JSON 路由定义，变更实时刷新：

```yaml
ypbin:
  gateway:
    route:
      nacos:
        enabled: true
        data-id: gateway-routes.json
        group: DEFAULT_GROUP
```

Nacos 配置示例：

```json
[
  {
    "id": "user-service",
    "uri": "lb://user-service",
    "predicates": [{"name": "Path", "args": {"pattern": "/user/**"}}],
    "order": 0
  }
]
```

JSON 解析失败保留当前路由，Nacos 不可达保留默认路由。
