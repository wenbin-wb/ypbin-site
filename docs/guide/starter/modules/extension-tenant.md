---
title: ypbin-starter-extension-tenant
description: 多租户 模块能力说明与配置参考。
---

# extension-tenant — 多租户

MyBatis-Plus 行级租户隔离。默认关闭，需显式开启并提供租户来源：

```yaml
ypbin:
  tenant:
    enabled: true
    column: tenant_id
    ignore-tables: [sys_config, sys_dict]   # 这些表不隔离
    fail-on-missing-tenant: true            # 缺租户上下文时拒绝执行（默认 true）
```

```java
@Component
public class MyTenantProvider implements TenantProvider {
    @Override
    public Optional<Long> getCurrentTenantId() {
        return LoginHelper.getUserIdSafely();  // 示例：从上下文取租户
    }
}
```

**缺租户上下文默认拒绝（fail-closed）**：`fail-on-missing-tenant` 默认 `true`，既无显式绑定也无 Provider 返回值时，查询直接抛出业务异常（业务码 409）而不执行，避免「无租户即跨全租户查询」的越权风险。异常提示会指引改用 `@TenantIgnore` / `TenantContext.executeIgnore`。

登录、匿名分享、定时任务等本无租户上下文的路径，应显式声明忽略而非依赖隐式放行：

```java
// 登录时按用户名全局定位用户：用户名全局唯一，此时尚无租户上下文
@TenantIgnore
public SysUser getByUsername(String username) { ... }
```

> 上线后若出现「缺少租户上下文」报错，说明该路径漏了显式忽略声明，**应补 `@TenantIgnore` / `executeIgnore`，而不是把开关关掉**。置为 `false` 时拦截器仅跳过追加租户条件，此时无租户的查询会命中全部租户数据，仅在确有跨租户需求的场景下使用。

**跨租户逃逸**：超管全局查询、后台定时任务全表扫描时，用 `@TenantIgnore` 或 `TenantContext`：

```java
@TenantIgnore
public List<Tenant> listAllTenants() { ... }

// 或编程式
TenantContext.runIgnore(() -> statisticsMapper.countAll());
```

忽略标记会随异步上下文透传到 `@Async` 子线程。

**租户实体基类** `TenantBaseEntity`：需要租户字段的实体继承它（而非 `BaseEntity`），即在主键/审计/逻辑删除之外多一个 `tenantId` 字段：

```java
public class Order extends TenantBaseEntity {
    private String orderNo;
}
```

租户隔离由行级拦截器自动在 SQL 追加 `tenant_id` 条件，`tenantId` 字段供实体层读写；不需要租户的实体继承 `BaseEntity` 即可，避免基础表被迫带 `tenant_id` 列。
