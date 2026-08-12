---
title: ypbin-starter-json
description: 序列化 模块能力说明与配置参考。
---

# json — 序列化

统一 Jackson 配置，引入即生效：

- `LocalDateTime/LocalDate/LocalTime` 统一格式（默认 `yyyy-MM-dd HH:mm:ss` 等）。
- Long/BigInteger/BigDecimal 序列化为字符串，规避前端 JS 大数精度丢失。
- 反序列化忽略未知字段。

```yaml
ypbin:
  json:
    date-time-format: yyyy-MM-dd HH:mm:ss
    write-big-number-as-string: true   # 默认 true
```

**数据脱敏** `@Sensitive`：响应字段序列化时自动打码，不改动库中原值：

```java
@Sensitive(SensitiveType.PHONE)
private String phone;      // 输出 138****8000

@Sensitive(SensitiveType.ID_CARD)
private String idCard;     // 输出 110101********1234

@Sensitive(value = SensitiveType.CUSTOM, prefixKeep = 2, suffixKeep = 2)
private String custom;     // 保留前 2 后 2
```

内置类型：`CHINESE_NAME` / `PHONE` / `ID_CARD` / `EMAIL` / `BANK_CARD` / `ADDRESS` / `ALL` / `CUSTOM`。

**数据字典翻译** `@DictText`：实体存字典值（code），序列化时**保留原字段原值不变**、并**额外输出**一个展示文本字段（遵循全链路字段同名，不改名只增派生字段）。字典表与 CRUD 归 admin，实现 `DictProvider` 把数据源接进来，starter 负责缓存与翻译：

```java
@DictText("sys_user_status")
private String status;      // 输出 "status":"1","statusText":"正常"

@DictText(value = "gender", suffix = "Label")
private String gender;      // 输出 "gender":"1","genderLabel":"男"
```

```java
// admin 侧实现字典数据源（从 sys_dict_item 读）
@Component
public class DbDictProvider implements DictProvider {
    @Override
    public List<DictItem> getItems(String dictType) { /* 查字典表 */ }
}
```

`DictCache` 带缓存（字典维护后调 `DictUtils.refresh()` 即时生效）；`DictUtils.translate(type, value)` / `getItems(type)` 供任意层静态调用；未接入 `DictProvider` 时翻译安全退化为原值。

**引用翻译** `@RefText`：实体存引用 ID（如 createUser、deptId），序列化时**保留原字段原值**、并**额外输出**展示名称字段。适合"存 ID、展示中文名"场景。数据源（用户表、部门表）由 admin 实现 `RefTextProvider`，starter 负责缓存与批量：

```java
@RefText("user")
private Long createUser;    // 输出 "createUser":"123","createUserName":"张三"

@RefText(value = "dept", suffix = "Text")
private Long deptId;        // 输出 "deptId":"8","deptIdText":"研发部"
```

**扩展点强制批量**，从根源规避 N+1——`RefTextProvider` 一次传一组 ID、一次返回映射：

```java
@Component
public class UserRefTextProvider implements RefTextProvider {
    @Override public String type() { return "user"; }
    @Override public Map<Object, String> getNames(Collection<Object> ids) {
        // 一条 SQL：SELECT id, nickname FROM sys_user WHERE id IN (...)
    }
}
```

**列表零 N+1 全自动**：无需任何手动调用——响应体序列化前由切面自动扫描对象图、按类型批量预加载，序列化时全命中缓存。业务只管正常返回：

```java
@GetMapping
public R<List<OrderResp>> list() {
    return R.ok(orderService.list());   // 什么都不用做，createUserName 自动翻译且零 N+1
}
```

个别接口想跳过自动预加载（如超大导出），方法/类加 `@RefTextIgnore`；全局关闭设 `ypbin.json.ref-text.auto-resolve=false`。也可手动 `refTextResolver.preload(list)`（非必需）。

缓存带 TTL 与容量上限（配 `ypbin.json.ref-text.ttl-seconds` / `max-size`），重复 ID 不重查、不存在的 ID 走空值哨兵防穿透；不含 `@RefText` 的响应由类级缓存瞬间跳过、零遍历成本；数据变更后调 `RefTextUtils.refresh(type)` 即时生效。未接入 `RefTextProvider` 时不输出名称字段、安全退化。

> 与 `@DictText` 的区别：`@DictText` 翻固定枚举（字典表），`@RefText` 翻动态实体引用（用户/部门等表）；两者同款"保留原字段 + 额外派生字段"，都不改字段名。
