---
title: ypbin-starter-data
description: 数据访问 模块能力说明与配置参考。
---

# data — 数据访问

MyBatis-Plus 增强，引入即生效：

- 分页拦截器（默认单页上限 500 条，可配 `ypbin.data.max-limit`）。
- 实体继承 `BaseEntity` 即获得主键 `id`（Long）、`createUser/createTime/updateUser/updateTime` 审计字段、业务状态字段 `status`（默认 1 正常）与逻辑删除字段 `isDeleted`（列 `is_deleted`）。
- 主键雪花算法（`@TableId(type = ASSIGN_ID)`），并单独序列化为字符串防前端精度丢失；要全局改自增/UUID，配 `mybatis-plus.global-config.db-config.id-type`。
- 审计字段 INSERT/UPDATE 自动填充；操作人来源实现 `AuditorProvider` 扩展点（引入 security 后自动对接登录用户）。
- 业务状态：`status` 只表达启停等业务状态，默认 1 正常、0 禁用；逻辑删除仍由 `isDeleted` 表达，两者不要混用。
- 逻辑删除：`isDeleted` 带 `@TableLogic`，默认规则（0 未删/1 已删）开箱生效，删除转 UPDATE、查询自动过滤；不需要逻辑删除的表对应实体不继承 `BaseEntity` 或建表不加该列即可。
- 拦截器编排：多租户、数据权限等通过 `InnerInterceptorProvider` 按 order 贡献内部拦截器，顺序可控（租户/数据权限先于分页）。

```java
// 默认雪花 ID（Long），无需再声明 id 字段
public class Article extends BaseEntity {
    private String title;
}
```

**雪花 ID** `IdGenerator`：主动获取分布式唯一 ID（提前生成主键、订单号等）：

```java
long id = IdGenerator.nextId();
String idStr = IdGenerator.nextIdStr();
```

**字段加密**：敏感字段存库自动加密、读库自动解密，对业务透明。配置密钥后在字段上挂 TypeHandler：

```yaml
ypbin:
  data:
    encrypt:
      key: 1234567890abcdef   # AES 密钥，16/24/32 字节
```

```java
@TableField(typeHandler = EncryptTypeHandler.class)
private String idCard;   // 入库密文，查询回来自动解密
```

默认 AES-GCM 实现；需要国密/KMS 时实现 `FieldEncryptor` 覆盖默认 Bean。
