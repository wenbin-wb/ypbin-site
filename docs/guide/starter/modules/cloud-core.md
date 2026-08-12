---
title: ypbin-starter-cloud-core
description: 微服务 Feign 增强 模块能力说明与配置参考。
---

# cloud-core — 微服务 Feign 增强

引入即自动装配，默认提供请求头透传与 R 响应错误解码。依赖 `spring-cloud-starter-openfeign`
和 `spring-cloud-starter-circuitbreaker-resilience4j`。

```xml
<dependency>
    <groupId>cn.ypbin</groupId>
    <artifactId>ypbin-starter-cloud-core</artifactId>
</dependency>
```

**请求头透传**：Feign 调用时自动把上游请求头（默认 `Authorization` / `X-Request-Id` / `X-Trace-Id`）
透传给下游。可通过配置扩展白名单：

```yaml
ypbin:
  cloud:
    feign:
      propagate-headers:
        - Authorization
        - X-Request-Id
        - X-Tenant-Id
```

**统一错误解码**：下游返回非 2xx 且响应体为 ypbin 统一 `R` 时，自动转为 `FeignRemoteException`
（含下游业务码与提示），由全局异常处理器转换为 HTTP 200 + `R.code` 的错误响应。

**CircuitBreaker 默认开启**：模块自动注入最低优先级默认值 `spring.cloud.openfeign.circuitbreaker.enabled=true`，
使 Resilience4j 熔断实际参与 Feign 调用链。关闭方式：

```yaml
ypbin:
  cloud:
    feign:
      circuitbreaker-enabled: false
```

**R 专用 Fallback 辅助**：对返回 `R<T>` 的 FeignClient，可继承 `RFeignFallbackFactory` 减少重复代码：

```java
@Component
class UserClientFallbackFactory extends RFeignFallbackFactory<UserClient> {
    @Override public UserClient create(Throwable cause) {
        return id -> fail(cause, "用户服务暂不可用");
    }
}

@FeignClient(name = "user-service", fallbackFactory = UserClientFallbackFactory.class)
public interface UserClient {
    R<UserDto> getById(Long id);
}
```

完整配置项：

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| `ypbin.cloud.feign.enabled` | `true` | 总开关 |
| `ypbin.cloud.feign.error-decoder-enabled` | `true` | R 错误解码 |
| `ypbin.cloud.feign.circuitbreaker-enabled` | `true` | 默认开启 CircuitBreaker |
| `ypbin.cloud.feign.propagate-headers` | `Authorization`, `X-Request-Id`, `X-Trace-Id` | 透传请求头白名单 |
