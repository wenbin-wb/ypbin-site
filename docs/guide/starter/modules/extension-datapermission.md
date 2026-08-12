---
title: ypbin-starter-extension-datapermission
description: 数据权限 模块能力说明与配置参考。
---

# extension-datapermission — 数据权限

行级数据范围过滤。**仅对 `@DataPermission` 标注的方法生效**，避免全局无差别拦截导致定时任务/登录校验等内部查询数据缺失。需提供数据范围规则：

```yaml
ypbin:
  data-permission:
    enabled: true
```

```java
// 提供数据范围 SQL 片段（依赖业务，无默认实现）
@Component
public class MyDataScopeHandler implements DataScopeHandler {
    @Override
    public String getDataScopeSql(String mappedStatementId, String tableName) {
        return "dept_id IN (" + currentUserDeptIds() + ")";
    }
}

// 只有标注的方法才触发数据范围过滤
@DataPermission
public List<Order> listByScope(OrderQuery q) { ... }
```
