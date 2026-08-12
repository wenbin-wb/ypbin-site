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
- `byIp = true`（默认）时把客户端 IP 纳入限流键。
- 分布式版基于 `StringRedisTemplate` + Lua 脚本，多节点共享窗口。

**幂等** `@Idempotent`（防重复提交，有 Redis 用 Redis+Lua，否则内存）：

```java
@Idempotent(key = "#req.orderNo", interval = 10, message = "请勿重复提交")
public void create(OrderReq req) { ... }
```

同一幂等键在 `interval` 秒内的重复调用被拒绝；`key` 支持 SpEL，留空则用「方法 + 参数指纹」。

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
