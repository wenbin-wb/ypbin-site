---
title: ypbin-starter-api-crypto
description: 接口加解密 模块能力说明与配置参考。
---

# api-crypto — 接口加解密

`@ApiEncrypt` 标注的接口自动对请求体解密、响应体加密，对 Controller 透明。基于 Spring MVC 的 RequestBody/ResponseBodyAdvice：

```yaml
ypbin:
  api-crypto:
    key: 1234567890abcdef   # AES 密钥；配置后装配默认 AES 实现
```

```java
@ApiEncrypt                       // 请求体解密 + 响应体加密
@PostMapping("/secure")
public R<Data> secure(@RequestBody Req req) { ... }

@ApiEncrypt(requestDecrypt = false)   // 仅加密响应
@GetMapping("/only-resp")
public R<Data> onlyResp() { ... }
```

默认 AES-GCM；实现 `ApiCryptoProvider` 可换国密 SM4 / RSA。返回 `R` 时仅加密其 data，保留统一结构。

**响应格式契约（成功与失败两种格式）**：`@ApiEncrypt` 接口的响应不是恒为密文——**成功路径**返回仍是统一 `R` 结构，但 `data` 已替换为 Base64 密文字符串（非 `R` 返回体则整体加密为密文字符串）；**失败路径**（业务失败/异常由全局处理器产出、`data` 为 null 的 `R`）保持明文返回，不在加密范围。前端须先按 `code` 判断成败：失败直读明文 `code/message`，成功再解密 `data`。
