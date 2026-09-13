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

**请求头透传**：Feign 调用时自动把上游请求头（默认 `Authorization` / `X-Request-Id` / `X-Trace-Id`
及身份头）透传给下游。可通过配置扩展白名单：

```yaml
ypbin:
  cloud:
    feign:
      propagate-headers:
        - Authorization
        - X-Request-Id
        - X-Tenant-Id
```

**身份头来源校验（防越权放大）**：`X-User-Id` / `X-Roles` 等身份头只应由可信网关签发。若服务可被外部直连，伪造的身份头会随 Feign 调用二次转发到下游，把越权影响放大。配置共享标记即可约束（默认不校验，启动时会打印 WARN 提示）：

```yaml
ypbin:
  cloud:
    feign:
      trusted-source-header: X-Gateway-Signed   # 由可信网关在清洗外部头后签发
      trusted-source-token: ${GATEWAY_SIGN_TOKEN}  # 网关与各下游服务配置同一随机串
      identity-headers: [X-User-Id, X-User-Name, X-Tenant-Id, X-Dept-Id, X-Roles]
```

启用后：仅当入站请求携带的标记与 `trusted-source-token` 一致时，`identity-headers` 才会被透传；否则身份头被丢弃（其余头照常透传）。生产环境建议启用。

**超时默认值**：无论是否开启熔断，模块都会以最低优先级注入 Feign 连接/读取超时，杜绝「无超时默认客户端」：

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| `spring.cloud.openfeign.client.config.default.connect-timeout` | `5000`（5s） | 建连超时（毫秒） |
| `spring.cloud.openfeign.client.config.default.read-timeout` | `10000`（10s） | 读取超时（毫秒），必须小于 TimeLimiter，让读取超时先以明确异常返回 |

**统一错误解码**：下游返回非 2xx 且响应体为 ypbin 统一 `R` 时，自动转为 `FeignRemoteException`
（含下游业务码与提示），由全局异常处理器转换为 HTTP 200 + `R.code` 的错误响应。

**CircuitBreaker 默认开启**：模块自动注入最低优先级默认值 `spring.cloud.openfeign.circuitbreaker.enabled=true`，
使 Resilience4j 熔断实际参与 Feign 调用链，并同步注入一组 resilience4j 默认熔断/超时参数（可被业务配置整体或逐项覆盖）：

| resilience4j 默认项 | 默认值 | 说明 |
|--------|--------|------|
| `resilience4j.timelimiter.configs.default.timeout-duration` | `15s` | TimeLimiter 超时（库内建默认仅 1s；取 15s 以确保大于 Feign read-timeout(10s)，让读取超时先触发并抛出明确异常，而不是被 TimeLimiter 中途取消线程、留下悬挂连接） |
| `resilience4j.circuitbreaker.configs.default.sliding-window-size` | `20` | 计数滑动窗口大小 |
| `resilience4j.circuitbreaker.configs.default.failure-rate-threshold` | `50` | 失败率阈值（%），超限熔断打开 |
| `resilience4j.circuitbreaker.configs.default.minimum-number-of-calls` | `10` | 最少调用次数，不足不参与熔断判定 |
| `resilience4j.circuitbreaker.configs.default.permitted-number-of-calls-in-half-open-state` | `10` | 半开态放行探测数 |
| `resilience4j.circuitbreaker.configs.default.wait-duration-in-open-state` | `10s` | 熔断打开维持时长，到期转半开 |

关闭方式：

```yaml
ypbin:
  cloud:
    feign:
      circuitbreaker-enabled: false   # 仅关闭熔断；连接/读取超时仍会注入
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
| `ypbin.cloud.feign.circuitbreaker-enabled` | `true` | 默认开启 CircuitBreaker（超时注入不受此开关影响） |
| `ypbin.cloud.feign.propagate-headers` | `Authorization`, `X-Request-Id`, `X-Trace-Id`, 身份头 | 透传请求头白名单 |
| `ypbin.cloud.feign.identity-headers` | `X-User-Id`, `X-User-Name`, `X-Tenant-Id`, `X-Dept-Id`, `X-Roles` | 需来源可信才透传的身份头 |
| `ypbin.cloud.feign.trusted-source-header` | `X-Gateway-Signed` | 可信来源标记头名 |
| `ypbin.cloud.feign.trusted-source-token` | 空 | 可信来源标记期望值；为空表示不校验来源 |

**Fallback 不泄露内部细节**：`RFeignFallbackFactory` 只返回稳定文案（默认「远程服务暂不可用，请稍后重试」）或调用方显式传入的文案，不会把底层 `cause.getMessage()`（可能含目标主机、端口、类名）回传前端；完整堆栈仅落服务端日志。
