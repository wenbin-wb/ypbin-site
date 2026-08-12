---
title: ypbin-starter-cache
description: 缓存 模块能力说明与配置参考。
---

# cache — 缓存

基于 Redis 的 `CacheService` 统一缓存接口，值以 JSON 存储：

```java
@Autowired
private CacheService cacheService;

cacheService.set("user:1", user, Duration.ofMinutes(30));
User user = cacheService.get("user:1", User.class);
```

非 Spring 托管场景（静态方法、工具类）无法注入时，用静态门面 `CacheUtils`（内部委托 `CacheService`）：

```java
CacheUtils.set("user:1", user, Duration.ofMinutes(30));
User user = CacheUtils.get("user:1", User.class);
long pv = CacheUtils.increment("page:pv", 1);
```

> Spring 组件仍应优先直接注入 `CacheService`，语义更清晰、更易测试；`CacheUtils` 仅用于拿不到注入的场景。

**缓存旁路 + 三重保护** `getOrLoad`：未命中自动回源并回填，内置防击穿/防穿透/防雪崩：

```java
User user = cacheService.getOrLoad("user:" + id, User.class,
    () -> userMapper.selectById(id),      // 回源函数
    Duration.ofMinutes(30));
```

- **防击穿**：回源时用 Redis 短锁单飞，热点 key 过期瞬间只有一个线程/节点回源，其余等待回填。
- **防穿透**：回源结果为 `null` 时缓存空值哨兵（短 TTL），不存在的 key 不会反复打到数据源。
- **防雪崩**：写入 TTL 叠加 0~10% 随机扰动，避免大量 key 同时过期。

**多级缓存（L1 Caffeine 本地 + L2 Redis）**：读多写少的热点数据，引入 Caffeine 依赖并开启后，`CacheService` 自动升级为多级缓存：

```yaml
ypbin:
  cache:
    multi-level:
      enabled: true
      local-max-size: 10000
      local-expire-seconds: 300
      invalidation-broadcast: true          # 多副本部署需开启
```

- 读先查 L1 本地（无 Redis 往返），未命中再查 L2 并回填 L1。
- 写/删更新 L2 并失效本地 L1，同时经 Redis Pub/Sub 广播，通知其它实例摘除各自 L1，保证多实例最终一致。
- 适合可容忍秒级不一致的读多写少场景；强一致数据不要开多级缓存。业务代码无需改动，仍用 `CacheService` 接口。

需要 Redis 专属数据结构（hash/list/set/zset）时，用 `RedisUtils` 静态工具（直接封装 `RedisTemplate` 全能力）：

```java
RedisUtils.setIfAbsent("lock:order:1", "1", Duration.ofSeconds(10));  // 分布式锁
RedisUtils.hSet("user:1", "name", "tom");                            // hash
RedisUtils.zAdd("rank", "player1", 99.5);                            // zset 排行榜
Set<Object> top10 = RedisUtils.zReverseRange("rank", 0, 9);
```

分工：与实现无关的通用缓存走 `CacheService`/`CacheUtils`；Redis 专属结构走 `RedisUtils`。
