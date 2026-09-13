---
title: ypbin-starter-core
description: 核心 模块能力说明与配置参考。
---

# core — 核心

所有模块的底座，通常由其它模块传递引入，无需单独声明。提供：

- `R<T>`：统一响应体。`R.ok(data)` / `R.fail(code, msg)`。
- `BaseException` / `BusinessException` / `GlobalErrorCode`：异常体系，业务异常抛 `BusinessException`。
- `BaseEnum<V>`：通用枚举契约（value + description）。
- `SpringUtils`：静态获取 Bean / 发布事件 / 读配置。
- `ContextPropagator` + `ContextAwareTaskDecorator`：异步上下文透传（见下）。
- `RequestIdUtils`：链路 ID 生成与校验，非法值（超长、CRLF、控制字符）一律丢弃并重新生成，防日志注入。

## 空值语义：JSpecify

Spring Framework 7 已把 `org.springframework.lang.NonNull` / `Nullable` 标记为废弃（`@Deprecated(since = "7.0")`），框架自身的包改为 JSpecify `@NullMarked`。自研代码请按同一套写法：

```java
import org.jspecify.annotations.Nullable;

public CaptchaService(ImageCaptchaApplication application,
                      @Nullable CaptchaResourceReloader resourceReloader) { ... }
```

`jspecify` 版本由 `spring-boot-dependencies` 统一管理，声明依赖时无需写版本号。**实现框架接口时不需要再写 `@NonNull`**——被实现方所在包已 `@NullMarked`，参数默认即非空，重复标注只会带来废弃告警。

## 环境后置处理器注册（Spring Boot 4.1）

Starter 各模块通过 `EnvironmentPostProcessor` 注入 `ypbin.*` 默认值。Spring Boot 4.1 起接口与注册键都已迁移，**两处必须同时改**：

```java
// 接口：org.springframework.boot.EnvironmentPostProcessor（不再是 ...boot.env...）
public class WebDefaultsEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered { ... }
```

```properties
# META-INF/spring.factories — 注册键随之变更
org.springframework.boot.EnvironmentPostProcessor=\
cn.ypbin.starter.web.autoconfigure.WebDefaultsEnvironmentPostProcessor
```

> Boot 4.1 仍会兼容加载旧键，所以「只改接口不改键」不会编译报错也不会启动失败，而是**默认配置项静默失效**。Starter 因此加了两道门禁：源码级注册校验（`SourceConventionTest`）与 `SpringFactoriesLoader` 运行时可见性断言（`RegistrationDiscoveryTest`）。

## 方法级弹性（Spring Framework 7 原生）

Spring Framework 7 把重试与并发限制内建到 `spring-context`（`org.springframework.resilience.annotation`），**不再需要引入 Spring Retry 或 Resilience4j** 即可对任意 Spring Bean 方法声明弹性策略：

```java
@Retryable(includes = IOException.class, maxRetries = 2,
    delay = 300, multiplier = 2.0, maxDelay = 2000, jitter = 100)
public Connection.Response fetch(String url) { ... }

@ConcurrencyLimit(limit = 4)   // 超出按 policy 拒绝或阻塞，保护脆弱下游
public String callRemote() { ... }
```

默认开启（`ypbin.resilience.enabled` 缺省为 `true`），可显式关闭。注解驱动意味着未使用这两个注解的应用不会被代理，无额外开销。

> **注意**：与所有 Spring AOP 能力一致，**同类内部自调用不经过代理**，弹性注解不生效，须跨 Bean 调用。仅对瞬时故障（超时/IO）重试，业务性拒绝（参数非法、4xx）不要放进 `includes`，重试无法改变结果只会放大请求。

**异步上下文透传**：把主线程的租户、用户、MDC 等上下文带入 `@Async` 子线程。将 core 提供的
`TaskDecorator` 设置到你的线程池即可：

```java
@Bean
public ThreadPoolTaskExecutor taskExecutor(TaskDecorator contextAwareTaskDecorator) {
    ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
    executor.setTaskDecorator(contextAwareTaskDecorator);
    executor.initialize();
    return executor;
}
```

各模块（如 tenant）自行注册 `ContextPropagator` Bean，无需你手动列举要透传的内容。

**树形结构工具** `TreeUtils`：菜单、部门、分类等实现 `TreeNode` 接口后，一行代码把扁平列表组装成树（O(n)）：

```java
public class MenuNode implements TreeNode<MenuNode, Long> {
    private Long id;
    private Long parentId;
    private List<MenuNode> children;
    // getId / getParentId / setChildren ...
}

List<MenuNode> tree = TreeUtils.build(flatList);        // 自动识别根节点
List<MenuNode> tree2 = TreeUtils.build(flatList, 0L);   // 指定根父 ID
```

## Starter 自诊断端点

当应用引入 `spring-boot-starter-actuator` 时，自动装配自省端点 `/actuator/ypbin`：

- **访问路径**：`GET /actuator/ypbin`
- **返回内容**：当前 Starter 版本、JDK 版本、Spring Boot 版本、已激活的全部 `ypbin-starter-*` 自动装配类清单，以及核心特性（security, ai, excel, redis, mybatisPlus, tenant, gateway, license 等）的探测状态。

