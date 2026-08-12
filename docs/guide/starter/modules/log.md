---
title: ypbin-starter-log
description: 操作日志 模块能力说明与配置参考。
---

# log — 操作日志

`@Log` 注解 AOP 采集，**异步持久化**不阻塞业务：

```java
@Log(value = "创建订单", module = "订单", includes = Include.REQUEST_BODY)
@PostMapping("/orders")
public R<Void> create(@RequestBody OrderReq req) { ... }
```

- `Include` 控制采集粒度：请求头/体/参数、响应体、IP、浏览器、OS、登录客户端信息。默认采集请求参数 + IP + 客户端信息（不采集请求/响应体，防敏感信息与大报文落库）。
- 请求体从 AOP 入参序列化（能拿到 `@RequestBody` 的 JSON），过滤文件流等不可序列化参数。
- 浏览器/操作系统由 User-Agent 解析分别提取（如 `Chrome 120` / `Windows 10`），非原始 UA 整串。
- 持久化：实现 `LogDao` 落库（默认仅打印到日志）；操作人来源实现 `LogUserProvider`。
- 操作人（`userId`）与登录客户端信息（`clientId/clientType/authType`）：**引入 security 模块后自动对接登录会话**（security 桥接 `LogUserProvider`/`LogClientProvider` 并前置于 log 默认空实现注册），无需业务实现即可记录“谁、从哪个客户端、用什么方式”操作。
- IP 归属地（`location`）：默认不解析（字段留空）。需要时实现 `IpLocationResolver` 扩展点（接 ip2region 等 IP 库），采集时自动填充：

```java
@Component
public class Ip2regionLocationResolver implements IpLocationResolver {
    @Override
    public String resolve(String ip) { /* 查 IP 库返回“广东省深圳市” */ }
}
```

- 写日志通过事件 + `@Async` 异步执行，DB 抖动不影响主接口（异步线程无 Sa-Token 上下文时，操作人取值安全降级不报错）。

**全量访问日志**（与 `@Log` 互补，无需注解）：基于 AOP 切面记录控制器请求/响应的分块日志——Request/Response Start/End、方法/URI/参数（JSON）、逐请求头（敏感头自动掩码）、IP、响应体、耗时，调试友好：

```yaml
ypbin:
  log:
    access:
      enabled: true
      exclude-path-patterns: ["/actuator/**", "/static/**"]
      mask-headers: [authorization, cookie, token]   # 头名小写包含任一关键字即掩码值
```

请求/响应体按 DTO 字段掩码：字段标 `@LogMask` 后，该字段在访问日志的 JSON 序列化里固定替换为 `******`，不影响该 DTO 正常序列化为接口响应：

```java
public class LoginReq {
    private String username;
    @LogMask
    private String password;   // 日志里打印 "password":"******"，接口响应不受影响
}
```

`@LogMask` 只作用于访问日志专用的序列化器，无侵入性；密码、密钥、Token 等字段应标注。

输出形如：

```
================  Request Start  ================
===> GET: /orders Parameters: {"current":1,"size":10}
===Headers===
  content-type: application/json
  Authorization: ******
===IP===  10.0.0.1
================   Request End   ================

================  Response Start  ================
===Result===  {"code":200,"data":[...]}
<=== GET: /orders (12 ms)
================   Response End   ================
```

> 注意：请求参数（含登录接口的 `@RequestBody`）会以 JSON 打印到日志，敏感**头**默认掩码、请求体不掩码——生产环境请按需通过 `exclude-path-patterns` 或日志级别控制。方法抛异常时 `===Result===` 打印 `exception: {message}` 后继续抛出（由全局异常处理器接管）。

`@Log` 精准采集业务操作（可落库），访问日志是全量流水（打印到日志），按需选用或并用。
