---
title: ypbin-starter-api-doc
description: API 文档 模块能力说明与配置参考。
---

# api-doc — API 文档

SpringDoc OpenAPI 开箱即用，配置文档元信息：

```yaml
ypbin:
  api-doc:
    enabled: true
    disable-in-prod: true        # 生产环境关闭文档端点（默认 true，重要安全默认值）
    title: 订单服务 API
    description: 订单中心接口文档
    version: 1.0.0
    group-name: default
    default-group-enabled: true  # 是否创建默认分组
    order-enabled: true          # 是否启用 @ApiOrder 排序
    paths-to-match: ["/**"]      # 纳入文档的路径
    paths-to-exclude: ["/error", "/actuator/**"]
    packages-to-scan: []         # 限定扫描包（空=全部）
    packages-to-exclude: []
    security-headers: ["Authorization", "X-Request-Id", "X-Tenant-Id", "X-Version"]  # 全局请求头
    contact:
      name: wenbin
      email: dev@example.com
      url: https://example.com
    license:
      name: Apache-2.0
      url: https://www.apache.org/licenses/LICENSE-2.0
```

启动后访问 `/swagger-ui.html`。**生产安全**：`disable-in-prod` 默认 `true`，在 `prod` profile 下自动关闭 SpringDoc 端点，避免接口文档对外暴露。

**接口排序** `@ApiOrder`：控制 Controller / 方法在文档中的展示顺序（数值小的靠前），需 `order-enabled: true`：

```java
@ApiOrder(1)
@RestController
public class UserController { ... }
```
