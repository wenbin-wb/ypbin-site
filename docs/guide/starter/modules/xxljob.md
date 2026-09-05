---
title: ypbin-starter-xxljob
description: XXL-JOB 执行器接入壳 模块能力说明与配置参考。
---

# xxljob — XXL-JOB 执行器接入壳

[XXL-JOB](https://github.com/xuxueli/xxl-job)（v3.4.2）执行器的 Spring Boot 接入壳：自动装配 `XxlJobSpringExecutor` 并绑定 `ypbin.xxl-job.*` 配置。业务方法标注 `@XxlJob("handlerName")` 即成为可被 xxl-job-admin 调度中心调度的任务，任务管理 / 调度日志 / 触发历史由调度中心控制台统一提供。

**定位边界**：本模块只做「执行器接入 + 注册」——向 xxl-job-admin 上报本服务在线的执行器与任务处理器，自身**不做调度决策**；何时触发、失败重试、路由策略、执行日志均由独立的 **xxl-job-admin 调度中心**（需单独部署）负责。自研轻量调度见 [job 模块](./job)（内存调度、无中心），业务新任务建议走 XXL-JOB 统一管理。

**1. 引入与启用**：加入依赖后默认关闭（`enabled=false`），显式开启并配置调度中心地址与执行器名：

```yaml
ypbin:
  xxl-job:
    enabled: true
    admin-addresses: http://localhost:8080      # xxl-job-admin 3.4.x context path 为根路径
    appname: ypbin-system                        # 执行器名称（admin 端注册与路由）
    port: 9999                                   # 执行器通讯端口（默认 9999）
    access-token: ""                             # 与 admin 端保持一致，空则不校验
```

**2. 写任务**：在任意 Spring 组件的方法上标 `@XxlJob`，方法即执行体：

```java
@Component
public class NoticePublishJob {
    @XxlJob("noticePublishScan")                // 处理器名，admin 端按此关联任务
    public void execute() {
        // 任务逻辑；异常向上抛即被调度中心记为失败
    }
}
```

**3. 装配与校验**：
- 自动装配条件：`ypbin.xxl-job.enabled=true`；
- `admin-addresses` / `appname` 缺失时**启动即抛错**暴露配置错误（连不上调度中心等于任务静默不跑，禁止静默降级）；
- 执行器端口需与 xxl-job-admin 网络可达（容器部署时同 compose 或经宿主机映射）。

**依赖与兼容**：xxl-job-core 3.4.2 无 `javax` 依赖、通讯走内嵌 Netty，兼容 Spring Boot 4.1 / JDK 21。

**配置项参考**：见 [Starter 配置参考](/guide/config/starter) 的 `ypbin.xxl-job.*`。
