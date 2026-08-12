---
title: ypbin-starter-async
description: 异步与线程池 模块能力说明与配置参考。
---

# async — 异步与线程池

引入后自动装配统一线程池 `ypbinTaskExecutor` 与调度器 `ypbinTaskScheduler`，并接管 `@Async`（默认执行器指向统一线程池）。线程池自动挂载 core 的上下文透传装饰器，租户/用户/MDC 会传播到异步线程。

```yaml
ypbin:
  async:
    enabled: true
    enable-annotation: true       # 接管 @Async
    virtual-threads: false        # JDK 21+ 可开虚拟线程
    core-size: 8
    max-size: 32
    queue-capacity: 1000
    keep-alive-seconds: 60
    thread-name-prefix: ypbin-async-
    rejection-policy: caller-runs # caller-runs/abort/discard/discard-oldest
    await-termination: true       # 优雅停机
    await-termination-seconds: 30
    scheduler-pool-size: 2
```

注解式：

```java
@Async
public void sendMail(String to) { ... }              // 走统一线程池

@Async("otherExecutor")
public void special() { ... }                        // 指定其它执行器
```

`@Async` 返回 void 的方法异常会被统一记录（方法名/入参/堆栈），不再静默丢失。

静态工具 `AsyncUtils`（无需注入执行器，业务方直接调用）：

```java
// 提交
AsyncUtils.run(() -> doSomething());
CompletableFuture<Integer> f = AsyncUtils.supply(() -> calc());

// 编排
AsyncUtils.then(f, v -> v + 1);
AsyncUtils.combine(f1, f2, Integer::sum);
AsyncUtils.withFallback(f, ex -> -1);

// 批量并发（结果顺序与入参一致）
List<R> rs = AsyncUtils.supplyAll(List.of(() -> a(), () -> b()));
List<R> rs2 = AsyncUtils.mapAll(items, item -> handle(item));
AsyncUtils.runAll(List.of(() -> t1(), () -> t2()));

// 等待
AsyncUtils.allOf(futures).join();
List<T> results = AsyncUtils.joinAll(futures);
T r = AsyncUtils.join(future, Duration.ofSeconds(3));   // 带超时

// 调度
AsyncUtils.schedule(task, Duration.ofSeconds(10));
AsyncUtils.scheduleAtFixedRate(task, Duration.ofMinutes(1));
AsyncUtils.scheduleWithFixedDelay(task, Duration.ofMinutes(1));
```

业务方自定义同名 `ypbinTaskExecutor` / `AsyncConfigurer` 时不被覆盖。
