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
        - /actuator/health          # 默认仅放行健康探针
        - /actuator/info
        - /swagger-ui/**
```

> **默认放行范围已收窄**：不再默认放行 `/actuator/**`。`env` / `heapdump` / `shutdown` 等敏感端点若经网关暴露，会造成信息泄露与远程操作风险；确需暴露时请显式声明，建议只放行 `health` / `info`。

```java
@Component
public class JwtAuthProvider implements GatewayAuthProvider {
    @Override public Mono<GatewayAuthResult> authenticate(ServerWebExchange exchange) {
        // 校验 token，成功则返回可信身份头
        return Mono.just(GatewayAuthResult.success(Map.of("X-User-Id", userId)));
    }
}
```

**入口身份头清洗**：`HeaderSanitizeGlobalFilter` 以最高优先级移除客户端传入的身份类请求头（`X-User-Id` / `X-Tenant-Id` / `X-Roles` 等），仅由认证提供者签发可信版本，防止调用方伪造身份被下游误信。

**链路 ID 防日志注入**：`RequestIdGlobalFilter` 对客户端传入的 `X-Request-Id` 校验长度（≤128）与字符集，含 CRLF / 控制字符 / ANSI 转义或超长时一律丢弃并重新生成，避免伪造日志行。

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

- 空配置保护：JSON 解析失败、配置被清空（blank）或**合法空列表 `[]`** 时一律**保留当前路由**并告警——空列表不当作"清空意图"，避免运维误配或中间态空配置导致网关路由全量丢失（确需显式清空全部路由的场景另有专门入口）；Nacos 不可达时保留默认路由。
- 路由应用（delete-all → save-all → 刷新）**严格串行化**（防并发触发批次交错覆盖），并带 **10 秒超时上限**，防止路由存储挂起时无限阻塞启动/监听线程。
- 应用过程**非原子**：中途失败时旧路由可能已被部分/全部删除、新路由部分应用，失败日志如实描述该状态（不再误导性声明"仍在生效"），等待下一次配置推送或人工恢复。
