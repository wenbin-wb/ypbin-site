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
