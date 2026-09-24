---
title: ypbin-starter-tools
description: 常用工具 模块能力说明与配置参考。
---

# tools — 常用工具

**分布式限流** `@RateLimit`（有 Redis 时自动用 Redis+Lua 原子限流，否则内存限流）：

```java
@RateLimit(key = "#userId", window = 60, count = 5, message = "操作过于频繁")
public void sendSms(Long userId) { ... }
```

- `key` 支持 SpEL，可按用户等业务维度限流；留空则用方法全限定名。
- `byIp = true`（默认）时把客户端 IP 纳入限流键。IP 默认取**真实对端地址**（`request.getRemoteAddr()`），不信任转发头——若服务位于可信反向代理之后、且需按真实客户端 IP 限流，请显式开启 `ypbin.tools.rate-limit.trust-forwarded=true`（默认 false，否则所有客户端共享代理出口 IP 一个限流桶）。
- 分布式版基于 `StringRedisTemplate` + Lua 脚本，多节点共享窗口。
- 取客户端 IP 也可直接用工具 `RequestUtils.getClientIp()`（默认信任 `X-Forwarded-For`/`X-Real-IP` 等转发头，取首个非 `unknown` 条目，适合展示场景）；安全敏感场景应显式传 `RequestUtils.getClientIp(false)` 只取真实对端地址，`getClientIp(true)` 则显式信任转发头——限流模块内部即按上面的 `trust-forwarded` 配置选择取值分支。

**幂等** `@Idempotent`（防重复提交，有 Redis 用 Redis+Lua，否则内存）：

```java
@Idempotent(key = "#req.orderNo", interval = 10, message = "请勿重复提交")
public void create(OrderReq req) { ... }
```

同一幂等键在 `interval` 秒内的重复调用被拒绝；`key` 支持 SpEL，留空则用「方法 + 参数**值**指纹」——按字段值展开（集合/`Map` 排序、对象按字段名逐字段、叶子类型用 `toString`）后取 SHA-256 摘要，因此同内容必得同键，而**键里不含入参明文**（键会进存储与日志）且长度有界。需要精确控制幂等维度时用 SpEL 显式指定。

业务方法抛异常时切面会自动调用存储的 `release()` **释放占位键**，失败请求可**立即重试**，不必等 `interval` 窗口自然过期；只有成功路径保留窗口防重复提交。内置 Redis/内存存储均已实现 `release()`（删除占位）；`IdempotentStore` 接口新增**默认空实现的 `release()` 扩展点**——自定义存储不覆盖该方法时，失败后仍需等窗口过期才能重试（向后兼容）。

**分布式锁** `@DistributedLock`（有 Redis 时为跨节点分布式锁，否则单机内存锁）：

```java
@DistributedLock(key = "#orderId", ttl = 30)
public void handle(Long orderId) { ... }   // 抢不到锁默认跳过，返回 null
```

- 加锁用 `SET key owner NX EX ttl`，释放用 Lua 校验持有者后删除，只释放自己的锁。
- `ttl` 应大于方法最长执行时间，防止持有者宕机死锁。
- `waitTime > 0` 时按 `retryInterval` 毫秒重试等待；`failStrategy` 可选 `SKIP`（默认，静默跳过）或 `EXCEPTION`（抛 `LockAcquireException`，业务码 429）。
- 也可直接注入 `LockService` 手动 `tryLock/unlock`。

**定时任务防重**（多实例只让一个节点执行）：`@Scheduled` 方法叠加 `@DistributedLock` 即可，抢不到锁的节点自动跳过。

```java
@Scheduled(cron = "0 0 2 * * ?")
@DistributedLock(key = "job:daily-settle", ttl = 300)
public void dailySettle() { ... }
```

**AES 加解密** `AesUtils`：AES-GCM 认证加密，随机 IV 前置：

```java
byte[] key = AesUtils.generateKey(256);            // 随机密钥（128/192/256）
String cipher = AesUtils.encrypt("secret", key);   // 字符串 → Base64 密文
String plain  = AesUtils.decrypt(cipher, key);

byte[] ct = AesUtils.encryptBytes(data, key);      // 字节级加解密
byte[] pt = AesUtils.decryptBytes(ct, key);

String b64Key = AesUtils.generateKeyBase64(256);   // 密钥 Base64 存取
byte[] derived = AesUtils.deriveKey("口令", AesUtils.generateSalt(16), 256);  // PBKDF2 口令派生
```

`encrypt`/`decrypt` 也支持直接传字符串密钥（UTF-8 字节），**入口即校验长度必须为 16/24/32 字节**（对应 AES-128/192/256），不合法立即抛 `IllegalArgumentException`（fail-fast，避免运行期才发现密钥配错）。

**国密 SM4/SM2**（基于 BouncyCastle，合规场景）：

```java
// SM4 对称：ECB / CBC / GCM 三模式（推荐 GCM 认证加密）
byte[] k = Sm4Utils.generateKey();                 // 随机 16 字节密钥
String c = Sm4Utils.encrypt("secret", k);          // ECB + Base64（向后兼容）
byte[] gcm = Sm4Utils.encryptGcm(data, k);         // GCM，IV 前置
byte[] cbc = Sm4Utils.encryptCbc(data, k, Sm4Utils.generateIv(16));
String hex = Sm4Utils.encryptHex("secret", k);     // Hex 形态

// SM2 非对称：加解密 + 签名验签
Sm2Utils.KeyPairBase64 kp = Sm2Utils.generateKeyPair();
String cipher = Sm2Utils.encrypt("secret", kp.publicKey());
String plain  = Sm2Utils.decrypt(cipher, kp.privateKey());
String sign = Sm2Utils.sign("data", kp.privateKey());          // SM3withSM2 签名
boolean ok  = Sm2Utils.verify("data", sign, kp.publicKey());   // 验签
```
