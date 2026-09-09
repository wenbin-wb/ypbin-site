---
title: ypbin-starter-job
description: 定时任务 模块能力说明与配置参考。
---

# job — 自研轻量调度

> **何时用它**：需要进程内内存调度（无外部调度中心）、任务量小且可随应用生命周期管理时。需要任务管理界面 / 调度日志 / 失败重试 / 集群路由的分布式场景，请用 [xxljob — XXL-JOB 执行器接入](./xxljob)（配合独立 xxl-job-admin 调度中心，ypbin-admin 的业务任务即走此方案）。

轻量动态调度：基于 Spring `TaskScheduler` + 自维护调度注册表，支持运行时注册/启停/改 cron/立即执行（无需重启，不引外部调度中心）。多实例下复用分布式锁防重（同一任务只跑一个节点）。

**定位边界**：starter 只做「内存调度运行时 + 执行体路由 + 防重 + 执行回调」，**不持久化任务**；任务表（sys_job）、CRUD、页面、执行日志表由业务方实现，通过 `JobManager` 把任务表与内存调度同步。

**1. 写执行体**：实现 `JobHandler` + `@YpbinJob` 声明执行器名：

```java
@YpbinJob("cleanTempFile")     // 执行器名，任务表用它关联
public class CleanTempFileJob implements JobHandler {
    @Override
    public void execute(JobContext context) {
        // context.getArgs() 取参数、context.isManual() 判断是否手动触发
    }
}
```

**2. 调度管理**：注入 `JobManager`，把任务表记录转 `JobDefinition` 注册（增删改查任务表后同步调用）：

```java
@Autowired
private JobManager jobManager;

JobDefinition def = new JobDefinition(job.getId(), job.getName(), job.getExecutor(), job.getCron());
def.setArgs(job.getArgs());
def.setTimeoutSeconds(60);
jobManager.register(def);        // 注册/替换（改 cron 后重复调用即生效）
jobManager.unregister(id);       // 停止并移除
jobManager.triggerNow(id);       // 手动立即执行一次
```

启动时业务方从任务表加载所有启用任务逐个 `register`。

**3. 执行日志落库**：实现 `JobExecutionListener`，starter 在各阶段回调，业务写 sys_job_log：

```java
@Component
public class DbJobExecutionListener implements JobExecutionListener {
    @Override public void onSuccess(JobContext ctx, long durationMs) { /* 写成功日志 */ }
    @Override public void onError(JobContext ctx, long durationMs, Throwable e) { /* 写失败日志 */ }
    @Override public void onSkip(JobContext ctx) { /* 本节点未抢到锁，跳过 */ }
}
```

**防重双保险**：默认开启（`JobDefinition.concurrentGuard`）。执行入口先做**任务级内存互斥**（单节点上同一任务绝不同时执行——慢执行跨触发间隔时本节点不会双跑，后续触发直接防重跳过），再做 **per-slice 分布式锁**抢占（锁键带触发时间片，只有抢到的节点执行、其余回调 `onSkip`；长任务不会持锁挡住下一次触发）。内存互斥仅单节点生效，跨节点防重仍由分布式 per-slice 锁承担。**需引入 `ypbin-starter-tools` 提供分布式锁**；未引入时退化为单机无锁（单节点安全，多节点会重复执行）。

> `JobDefinition.timeoutSeconds` 语义：**仅作分布式锁 TTL 放大依据，不是执行超时**——长任务按「timeoutSeconds + 5」秒持锁，防止执行期间锁被提前释放导致双跑；starter 未实现真实执行超时/中断（任务的超时回收需在执行器或宿主侧处理），`<= 0` 时锁 TTL 取默认值。

```yaml
ypbin:
  job:
    enabled: true
    pool-size: 4              # 调度线程池大小
    thread-name-prefix: ypbin-job-
```
