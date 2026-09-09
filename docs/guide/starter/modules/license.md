---
title: ypbin-starter-license
description: 商业授权 模块能力说明与配置参考。
---

# license — 商业授权

面向「按授权交付」的商业软件：供应方离线签发授权，运行端离线验签放行。基于国密 SM2（签名验签）+ SM4（授权文件对称加密）+ SM3（机器指纹摘要），私钥只在供应方签发端持有，运行端仅需公钥，无需联网即可校验。

- **一行集成**：在需保护的方法或类上标注 `@LicenseCheck`，进入方法前自动校验当前授权；类上标注对其下所有方法生效，方法上可覆盖。校验不通过抛授权异常，由全局异常处理器转统一响应体。**过期即时生效**：断言路径内置一层基于本地时钟的轻量过期快查（5 秒节流，不做完整签名重验）——授权一跨过宽限期即自动切换为不可用并拦截，不依赖业务手工调度的周期任务；时钟回拨检测等全量重算仍由 `LicenseManager`/定时任务负责。
- **校验维度按需组合**：基础可用性（合法或宽限期内，过期即拦截，默认）；`module()` 要求授权范围包含指定功能模块，实现模块级细粒度授权；`online()` 要求触发一次联机回验以感知远程吊销（需接入联机校验扩展点）。
- **机器指纹绑定**：`MachineFingerprint` 采集主机特征生成 SM3 摘要，授权文件可绑定指纹，换机即失效，默认开启。
- **离线状态机**：`LicenseStatus` 表达合法 / 宽限期 / 过期 / 非法等状态，`LicenseManager` 加载并缓存当前授权，`LicenseVerifier` 做验签与状态判定。
- **启动策略**：默认缺授权即启动失败并暴露原因，避免「以为受保护实则裸奔」；`allow-startup-without-license: true` 则以「非法不可用」状态启动，受保护能力被拦截、其余照常，适配先启动后补授权的交付流程。

```yaml
ypbin:
  license:
    enabled: true                       # 是否启用授权校验（默认开）
    public-key: <SM2 公钥 Base64>        # 运行端仅需公钥验签，私钥仅供应方签发端持有
    secret-key: <SM4 密钥 Base64>        # 授权文件对称加解密密钥（16 字节）
    location: ./license.dat             # 授权文件路径
    fingerprint-enabled: true           # 机器指纹绑定校验（默认开）
    allow-startup-without-license: false # 无授权文件时是否允许启动（默认否）
```

```java
@LicenseCheck                            // 基础可用性校验
public void export() { ... }

@LicenseCheck(module = "report")         // 额外要求授权含 report 模块
public void report() { ... }

@LicenseCheck(online = true)             // 额外触发联机回验
public void sync() { ... }
```

**扩展点**：`LicenseStore`（授权串存取，默认文件实现 `FileLicenseStore`）、`RemoteVerifyProvider`（联机回验来源）；集成侧 `LicenseLoginVerifier`（登录时校验授权）、`OnlineVerifyJob`（周期联机回验）。签发端能力（签发 / 审批 / 密钥托管 / 交付）由 admin 授权管理台承载，starter 只提供运行时抽象与验签地基。

**联机校验（可选，感知远程吊销）**：需引入 `ypbin-starter-sign`（接口签名）并配置服务地址，自动装配 `HttpRemoteVerifyProvider` 参考实现。响应 `valid` 字段为明确布尔值时才算「明确裁决」：`true` 放行并进入长缓存窗口，`false` 阻断且不缓存；其余一切（网络不可达/超时/非 200/解析失败/`valid` 缺失或非布尔）都是「放行但不明确」，只进入更短的放行窗口，绝不当作明确有效——避免网络抖动锁死业务，同时绝不掩盖明确吊销。吊销感知延迟 ≤ 缓存窗口。

```yaml
ypbin:
  license:
    online:
      base-url: https://license-admin.example.com   # 联机校验服务根地址；配置后启用
      access-key: <开放应用 AK>                      # 签发端「开放应用管理」为消费端应用签发
      secret-key: <开放应用 SK>                      # 私有密钥，参与请求签名，不下发
      timeout: 5s                                   # 单次校验超时（默认 5s）
      cache-seconds: 3600                           # 长缓存窗口（默认 1 小时）：明确有效后窗口内不重复联机
      fail-open-cache-seconds: 60                    # 放行窗口（默认 1 分钟）：不明确裁决结果的短缓存，防止联机服务故障时被打爆
      fail-open-threshold: 5                         # 连续放行次数阈值（默认 5）：达到后放行窗口升级为退避窗口
      fail-open-backoff-seconds: 300                 # 退避窗口（默认 5 分钟）：连续放行超阈值后使用，仍是放行不是拒绝
```

- **鉴权**：请求经接口签名（`accessKey/timestamp/nonce/sign` 四件套）上报授权编号与机器指纹；应用级 AK/SK 独立可吊销，某应用密钥泄露只影响该应用，可在签发端禁用/重置。
- **缓存窗口**：服务端明确返回有效后，窗口内 `@LicenseCheck(online=true)` 直接放行、不再发 HTTP；「放行但不明确有效」进入更短的放行窗口，连续多次不明确裁决后自动升级为更长的退避窗口，均在窗口到期后重新联机——服务恢复后吊销可被及时感知，故障期间也不会被高频调用打爆。缓存命中判断与实际联机调用之间做了单飞（single-flight），并发请求在缓存未命中时只会有一次真正的 HTTP 调用。
- **安全提示**：机器指纹经请求参数上报，生产环境联机校验服务建议启用 HTTPS，减少指纹在公网传输被窃听的风险。
- **依赖说明**：`ypbin-starter-sign` 是可选依赖，仅启用联机校验时引入；未引入则 HTTP 联机校验不装配，纯离线授权不受影响。
