---
title: ypbin-starter-sign
description: 接口签名 模块能力说明与配置参考。
---

# sign — 接口签名

对外提供给第三方对接的接口做签名校验（`accessKey + timestamp + nonce + sign` 四件套），防篡改与重放。**需同时开启 web 的可重复读请求**（见 web 章节）：

```yaml
ypbin:
  sign:
    enabled: true
    mode: ANNOTATION          # ANNOTATION（仅 @ApiSign 接口）或 GLOBAL（全局，按 skip-path 排除）
    algorithm: HMAC_SHA256    # 推荐；或 MD5（仅兼容旧系统，已标记废弃）
    timeout: 60               # 签名有效期(秒)
    replay-protect: true      # nonce 防重放（有 Redis 用 Redis，否则内存）
    apps:
      - access-key: ak-001
        secret-key: your-secret-key
        app-name: 合作方A
        expire-time: 2027-01-01T00:00:00   # 失效时间，为空永不过期
        enabled: true
  web:
    repeatable-read:
      enabled: true           # 签名校验需读 body，必须开启
```

```java
@ApiSign                          // 该接口要求验签
@PostMapping("/open/order")
public R<Void> createOrder(@RequestBody OrderReq req) { ... }
```

> `MD5` 算法（`SignAlgorithm.MD5`）已标记废弃，仅为兼容旧系统保留，新系统一律使用 `HMAC_SHA256`。

**第三方对接方**用 `SignClient` 生成签名（算法需与服务端一致）：

```java
Map<String, String> signed = SignClient.sign(bizParams, "ak-001", "your-secret-key", SignAlgorithm.HMAC_SHA256);
// signed 含 accessKey/timestamp/nonce/sign + 业务参数，随请求发送
```

**应用来源**：默认读 `ypbin.sign.apps` 配置。应用有管理表时实现 `SignAppProvider` 从数据库按 accessKey 加载（密钥建议加密存储），覆盖默认实现即可；校验时自动判断应用是否禁用、是否过期。

```java
@Component
public class DbSignAppProvider implements SignAppProvider {
    @Override
    public Optional<SignApp> findByAccessKey(String accessKey) {
        // 从 sys_app 查询并转换为 SignApp（含 secretKey/expireTime/enabled）
    }
}
```
