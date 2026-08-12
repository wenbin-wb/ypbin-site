---
title: ypbin-starter-cloud-loadbalancer
description: 版本灰度负载均衡 模块能力说明与配置参考。
---

# cloud-loadbalancer — 版本灰度负载均衡

提供请求头驱动的灰度流量路由，与 Spring Cloud LoadBalancer 无缝集成。引入即替换默认轮询策略为版本灰度策略：

```xml
<dependency>
    <groupId>cn.ypbin</groupId>
    <artifactId>ypbin-starter-cloud-loadbalancer</artifactId>
</dependency>
```

```yaml
ypbin:
  cloud:
    loadbalancer:
      enabled: true
      version: gray             # 当前服务灰度版本（可选）
      version-headers:          # 按顺序取第一个非空请求头作为请求灰度版本
        - X-Version
        - version
      metadata-key: version     # 服务实例 metadata 中版本字段名
      weight-metadata-key: weight
      default-weight: 1
      fallback-to-stable: true  # 灰度实例匹配不到时是否回退正式实例
      prior-ip-patterns:
        - 10.20.0.*
```

**路由规则**：
- 请求头有灰度版本 → 只选匹配 metadata 的实例，无匹配时按 `fallback-to-stable` 决定是否回退正式实例。
- 请求头无灰度版本 → 默认只选无版本标记的正式实例。
- 配置 `version` → 自动以低优先级写入 Nacos discovery metadata，无需手动维护。
