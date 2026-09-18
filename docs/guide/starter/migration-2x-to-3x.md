---
title: 2.x → 3.x 迁移指南
description: 从 ypbin-starter 2.x 升级到 3.0.0 的必改项、行为变更与代码替换清单。
---

# 2.x → 3.x 迁移指南

`3.0.0` 是一次**破坏性版本**：基线从 Spring Boot 3 时代推进到 **Spring Boot 4.1 / Spring Framework 7 / Jackson 3**（要求 **JDK 21**），同时把若干「宽松默认」收紧为「安全默认」。多数升级动作是**配置与依赖层面的**，代码层面需要改的地方集中在 Jackson 3 与一批已废弃 API。

::: tip 关于版本可用性
本页描述 `3.0.0`。站点展示的版本号由发布流水线同步；若此时从中央仓库拉取 `3.0.0` 失败（发布尚在同步窗口内），请以 Maven Central 上实际可用的版本为准，或先在预发环境用本页步骤演练升级。
:::

::: warning 升级前先看这一节
下面四项在配置不到位时会**直接拒绝启动**（fail-fast），不是运行时才报错：

| 项 | 触发条件 | 处理 |
|---|---|---|
| 租户隔离 | `ypbin.tenant.fail-on-missing-tenant` 默认 `true` | 无租户上下文的路径补 `@TenantIgnore` |
| Feign 身份头来源 | `ypbin.cloud.feign.require-trusted-source: true` 且未配密钥 | 配 `ypbin.cloud.feign.trusted-source-token` |
| 网关签名 | 下游要求签名标记，网关未签发 | 网关配同一个 `trusted-source-token` |
| AI 模型密钥 | `AI_MODEL_SECRET_KEY` 未配置 | 显式提供 16/24/32 字节密钥 |
:::

## 一、依赖升级

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>cn.ypbin</groupId>
            <artifactId>ypbin-starter-bom</artifactId>
            <version>3.0.0</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

同时确认：

- `spring-boot-starter-parent`（或你的 Boot 依赖管理）已升到 **4.1.x**，编译与运行基线均为 **JDK 21**；
- 使用 Sa-Token 的宿主：`sa-token-redis-jackson`（绑定 Jackson 2）**必须**换成
  `sa-token-redis-template` + `sa-token-jackson3`，二者须同时升级。

::: danger Sa-Token 会话会失效
会话序列化格式从 Jackson 2 切到 Jackson 3，**Redis 中的存量会话无法反序列化**。升级后所有用户需要重新登录，请安排在维护窗口内执行。客户端无需改动（401 处理逻辑不变）。
:::

## 二、必改配置

### 1. 租户隔离改为 fail-closed

`ypbin.tenant.fail-on-missing-tenant` 默认 `true`：既无显式绑定、`TenantProvider` 也无返回值时，查询**不再静默查空**（旧实现会拼出 `tenant_id = NULL`，查询恒空、写入 NULL 租户后数据再也查不出来），而是抛业务异常（业务码 409）。

需要给这些天然没有租户上下文的路径显式声明忽略：

```java
@TenantIgnore                                    // 注解方式
public R<Void> login(...) { ... }

TenantContext.executeIgnore(() -> ...);          // 代码块方式
```

登录、匿名分享、定时任务、SSE 等链路都要复查一遍。**出现「缺少租户上下文」说明该路径漏了声明，应补声明，而不是把开关关掉**；确实需要「无租户即跨全租户查询」的场景才显式置 `false`。

### 2. 网关身份头签名

防的是「绕过网关直连服务、伪造 `X-User-Id` 等身份头，再经 Feign 放大越权」：

- **网关侧**：`ypbin.gateway.auth.trusted-source-token` 配一个随机密钥，网关在签发身份头的同时写出签名标记头（默认 `X-Gateway-Signed`）；
- **服务侧**：`ypbin.cloud.feign.trusted-source-token` 配**同一个值**；`ypbin.cloud.feign.require-trusted-source: true` 时未配密钥会直接拒绝启动。

### 3. AI 模型密钥加密密钥

`AI_MODEL_SECRET_KEY` 用于加解密库内已存的模型 API Key，**必须长期保持不变**（换值后旧密文无法解密）：

```bash
openssl rand -hex 16
```

::: tip 部署脚本已不再内置默认值
`deploy/install.sh` 原先会给 `AI_MODEL_SECRET_KEY` 兜一个公开已知的默认值，**该默认值已移除**。当前行为：**首次全新部署**（`deploy/.env` 不存在）未显式提供时自动随机生成并写入 `.env`（脚本会醒目提示保存）；**复用旧 `.env`**（存量密文可能存在）时不做补生成——缺失或长度非法即终止，须沿用旧值或显式传入，否则分支/重复部署各自生成新 `.env` 会让存量密文永久不可解密。
:::

### 4. 网关 actuator 放行范围收窄

默认 `exclude-paths` 不再包含 `/actuator/**`，只放行 `/actuator/health`、`/actuator/health/**`、`/actuator/info` 与 API 文档路径。依赖经网关访问其它端点的宿主需显式声明，**建议只放行 health/info**。

## 三、行为变更（能编译，但语义不同）

| 变更 | 影响与处理 |
|---|---|
| **Feign fallback 不再回传底层异常文案** | 返回稳定文案，完整堆栈只落服务端日志（避免泄露主机/端口/类名）。需要特定提示改用 `fail(cause, "自定义文案")` |
| **Feign 超时强制注入** | 无条件注入 `connect-timeout=5s` / `read-timeout=10s`（即使关闭熔断也生效）。慢接口需显式调大 |
| **集合方法不返回 null** | 查无数据一律返回 `List.of()`/`Map.of()`/`Set.of()`，调用方可省去判空；注意不可变集合不接受 `null` 元素 |
| **业务异常沿 cause 链解包** | 被 MyBatis 等框架包装的 `BusinessException` 不再降级成泛化 500，会如实暴露业务码与提示 |
| **灰度版本白名单** | `ypbin.cloud.loadbalancer.allowed-versions` 未配置时行为不变；配置后未在白名单内的版本头一律忽略 |
| **链路 ID 校验** | 客户端传入的 `X-Request-Id` 若超长或含 CRLF/控制字符/ANSI 转义会被丢弃并重新生成，便于排查但不再透传原值 |

## 四、代码替换清单

### Jackson 3

Jackson 3 的包名从 `com.fasterxml.jackson.*` 变为 `tools.jackson.*`，但有**一个例外必须记住**：

> **注解包保持不变**：`@JsonIgnore`、`@JsonInclude`、`@JacksonAnnotationsInside` 等仍在 `com.fasterxml.jackson.annotation`，无需改动（Jackson 3 官方保留了该 group id）。

| 2.x 写法 | 3.x 写法 |
|---|---|
| `com.fasterxml.jackson.databind.ObjectMapper` | `tools.jackson.databind.json.JsonMapper` |
| `catch (JsonProcessingException e)` | `catch (JacksonException e)`——**Jackson 3 起继承 `RuntimeException`**，不再强制捕获，请复查原有 catch 是否漏接 |
| `objectMapper.copy()` | `jsonMapper.rebuild()` |
| `MappingJackson2HttpMessageConverter` | `JacksonJsonHttpMessageConverter` |
| `GenericJackson2JsonRedisSerializer` | `GenericJacksonJsonRedisSerializer`（Spring Data Redis 4） |
| `new ObjectMapper()` 手工实例 | 注入 Spring 容器中的 `JsonMapper`（全局配置已包含 Long→String、时间格式等） |

### 废弃 API 替换

| 旧写法（已废弃/已移除） | 新写法 |
|---|---|
| `org.springframework.boot.env.EnvironmentPostProcessor` | `org.springframework.boot.EnvironmentPostProcessor`，**`spring.factories` 注册键同步改** |
| `org.springframework.lang.NonNull` / `Nullable` | `org.jspecify.annotations.*`（框架包已 `@NullMarked`，实现框架接口时无需重复标注） |
| `ThreadLocalAccessor.reset()` | 覆写无参 `setValue()` |
| `RestClient.Builder.messageConverters(Consumer<List>)` | `configureMessageConverters(...)`；**不要**换成 `withJsonConverter()`，它按 `equalsTypeAndSubtype` 校验，宽容媒体类型会被判非法 |
| `TestRestTemplate` | 已被 Spring Boot 4 移除，改用 `RestClient` 或 `RestTestClient` |
| `BaseMapper.selectBatchIds(...)` | `selectByIds(...)`（MyBatis-Plus 3.5.17 起） |
| `Collections.emptyList()` / `singletonList()` | `List.of()` / `Set.of()` / `Map.of()` |
| `LettuceConnectionFactory#setPassword(String)` | 构造 `RedisStandaloneConfiguration` + `RedisPassword` |

::: tip 自查方式
```bash
mvn -o clean test-compile -Dmaven.compiler.showDeprecation=true
```
主源码与测试源码都应**零废弃告警**。确需覆盖旧算法兼容行为的用例，用 `@SuppressWarnings("deprecation")` 并注明意图。
:::

## 五、升级后验证

1. `mvn -o clean install` —— 编译、代码风格与单元测试全绿；
2. `mvn -Pit verify` —— 有 Docker 的机器会真实拉起 Redis/Nacos 容器跑集成测试，无中间件则条件跳过；
3. 启动自检 —— 关注启动日志是否有 fail-fast 报错（租户/签名/密钥三类最容易漏配）；
4. 装配自省 —— 引入 actuator 后访问 `/actuator/ypbin`，确认 Starter 版本、JDK/Boot 版本与已激活自动配置符合预期。

## 六、回滚须知

- **无数据库结构迁移**，回滚代码版本即可；
- 但以下两项**回滚后状态会不一致**，需要在回滚时一并处理：
  - **Sa-Token 会话**：升级后重新登录产生的会话，回滚到 2.x 同样无法反序列化，需再清一次会话；
  - **AI 模型密钥**：若在 3.0.0 期间用新的 `AI_MODEL_SECRET_KEY` 写入过模型 API Key，回滚时必须保留同一个密钥，否则无法解密。
