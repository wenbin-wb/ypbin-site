---
title: ypbin-starter-tracking
description: 埋点（行为事件契约 + 采集内核）模块能力说明、事件目录 base/project 分层与配置参考。
---

# tracking — 埋点

面向「用户怎么用、卡在哪一步、哪个页面慢」的**行为事件**采集内核：客户端上报事件码与属性，服务端按**事件目录**校验后入队，再由宿主决定落库去哪。它与相邻能力是三条不同的线，不要混用：

| 能力 | 回答的问题 | 可丢？ | 主体 |
|---|---|---|---|
| `log`（审计） | 谁对什么做了什么 | 否 | 必须已认证 |
| 监控指标（actuator / Micrometer） | 系统是否健康 | 是 | 无 |
| `tracking`（埋点） | 用户怎么用、卡在哪 | **是** | 可匿名 |

**默认关闭**：埋点会引入一个匿名可写入口，默认开启不是合理的默认值。开启后应覆盖 `TrackEventSink` 落库；未覆盖时装配期会打印一次 WARN 并只把事件打到应用日志——刻意不静默，避免「配了埋点却没有数据」。

```yaml
ypbin:
  tracking:
    enabled: true
    ingest-enabled: false        # 采集端点单独开关
    batch-size: 200
    queue-capacity: 10000        # 有界队列，满即丢弃并计数（严禁无界）
    max-events-per-request: 50
    max-payload-bytes: 8192
    max-request-bytes: 262144    # 实际读流限长（chunked 也拦得住）
    anonymize-ip: true           # IPv4 保留 /24、IPv6 保留 /64
    path: /tracking/ingest       # 端点路径（网关前带服务短名）
    app-id: ypbin-admin-ui       # 事件的应用维度
    trust-forwarded: false       # 网关之后需开启，否则记录到的是网关地址
```

## 事件目录：base + 宿主 project 两层

事件码是**生产者（客户端）与平台（采集端）之间的接口**，形如 `{domain}.{object}.{action}`，**禁止动态拼接**；未登记的事件码在采集入口即被拒绝、不会静默入库。目录分两层，**运行时合并**：

| 层 | 位置（谁维护） | 放什么 |
|---|---|---|
| **base** | starter 仓的 `docs/tracking-events.json`（平台维护） | 任何宿主都会用的事件：web 行为（页面/点击/性能/错误）、API 调用、认证 |
| **project** | 宿主项目仓的 `src/main/resources/META-INF/ypbin/tracking-events.json`（宿主维护，随宿主 jar 打包） | 宿主自己的业务事件。starter 不预置任何业务示例事件 |

两层资源**同名同路径、不同 jar**：运行时用 `classpath*:` 取回类路径上的**全部**同名资源，再按「资源所在归档是否为 starter 自身归档」区分两层后合并（不能用「只取一个」的 API——类路径命中顺序不可靠）。**同一事件码以 project 为准**；覆盖发生时必定逐字段打印差异（`description` 变化、属性新增/删除、属性 `type`/`maxLength` 变化），并把被覆盖的事件码通过 `TrackingEventCatalog#overriddenCodes()` 暴露给监控与管理界面。**未提供 project 文件的宿主 = 纯 base，零破坏。**

> 覆盖是本模块唯一有意偏离「禁静默降级」的取舍：用「必须打印差异 + 可编程标注」替代「直接失败」，故实现上不得省略打印。
> 载入失败一律失败、不降级：base 缺失、宿主侧出现两份及以上同名目录、schemaVersion 不识别、资源损坏、事件码重复。
> **已知边界**：宿主若用 uber/shade 打包，把 starter 的目录资源与自己的同名资源合并进同一个归档，两层会退化为一份。

改动目录后必须重新生成 / 校验：

```bash
node tools/export-tracking-events.mjs           # 从 base 生成 Java 常量 + 运行时资源
node tools/export-tracking-events.mjs --check   # 漂移门禁（CI 的「校验埋点事件目录未漂移」）

# 读两份（base + 宿主 project）并输出联合结果；覆盖差异必定打印到 stderr
node tools/export-tracking-events.mjs --host <宿主资源目录或文件> --merged-out <文件|->   # `-` 即 stdout
node tools/export-tracking-events.mjs --check --host <...> --merged-out <文件>            # 校验联合结果未漂移
```

- starter 只生成 **base** 的 `TrackingEventCodes`（编译期常量）与 `META-INF/ypbin/tracking-events.json`（运行期校验用）；宿主自有事件的常量请宿主自己的工具生成到宿主源码树，不要复用 starter 的包名。
- 管理前端的事件码常量是**构建期**由「base + 宿主 project」合并生成的，并配有独立的漂移门禁；两仓不一致时门禁会如实报红，不会静默退化成「纯 base」。

## 采集端点

`ingest-enabled=true` 才注册，路径由 `ypbin.tracking.path` 决定（微服务下经网关为 `/system/tracking/ingest`）：

```
POST /tracking/ingest
{
  "appId": "ypbin-admin-ui",
  "events": [
    { "eventId": "<UUID>", "eventCode": "ui.page.view", "eventTime": "2026-09-15T10:00:00Z",
      "sessionId": "s1", "anonId": "a1", "pageUrl": "/system/user", "durationMs": 1200,
      "payload": { "routeKey": "system_user" } }
  ]
}
→ R.data = { "received": 1, "accepted": 1, "rejected": 0, "dropped": 0,
             "reasons": {}, "attributeIssues": {} }
```

三个计数满足 `received = accepted + rejected + dropped`；**属性级问题不计入 `rejected`**——对应事件是被正常接收的，只是丢了个别属性，单独放在 `attributeIssues` 里（否则会出现 `accepted=1` 同时 `rejected=2` 这种自相矛盾的结果）。`reasons` 的取值：`unregistered`、`missingRequiredField`、`invalidEventTime`、`payloadKeyNotAllowed`、`payloadTypeMismatch`、`payloadTooLarge`、`requestTooLarge`、`overRequestLimit`；`dropped` 是队列满导致的丢弃——埋点允许丢弃，但**必须可见**。

## 持久化扩展点

```java
@Bean
public TrackEventSink trackEventSink(TrackEventMapper mapper) {
    return events -> mapper.batchInsert(events);
}
```

落库实现会在采集消费者线程被调用（与业务请求线程隔离，允许阻塞）。⚠️ 必须**幂等**：同一 `eventId` 重复写入不得产生重复行，批量插入请用 `ON DUPLICATE KEY UPDATE`，**不要**用 `INSERT IGNORE`——后者会把数据截断等错误一并降级为告警，属于静默数据丢失。

## 部署要点（三条缺一不可）

1. **网关免登录白名单**：把端点路径加入网关的免认证路径，否则未登录事件会被网关拒绝（属预期行为）。
2. **两个 `trust-forwarded` 要一起开**：网关之后所有请求的对端都是网关本身，限流与埋点各有自己的开关——只开限流侧会让事件记录的 `clientIp` 恒为网关地址（脱敏后彻底失真），只开埋点侧会让限流键退化为「方法 + 网关地址」单桶。装配期会检测这种错配并打印告警。
3. **多租户**：开启多租户时采集链路本身没有租户上下文，需把埋点相关表登记进忽略清单。

埋点自身的丢弃与失败属于**技术指标**：`TrackCounters#snapshot()` 返回 `accepted / droppedOnQueueFull / flushed / flushFailed / rejectedTotal / rejectedByReason`，应接入你的监控体系。
