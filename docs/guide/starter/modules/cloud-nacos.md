---
title: ypbin-starter-cloud-nacos
description: Nacos 依赖聚合 模块能力说明与配置参考。
---

# cloud-nacos — Nacos 依赖聚合

一键引入 Nacos 注册发现 + 配置中心 + LoadBalancer，版本锁定无需手动指定：

```xml
<dependency>
    <groupId>cn.ypbin</groupId>
    <artifactId>ypbin-starter-cloud-nacos</artifactId>
</dependency>
```

本模块整合 Nacos 注册发现、配置中心、LoadBalancer 依赖，并提供 Nacos ConfigData 启动兜底。Nacos 自动配置由 spring-cloud-alibaba 提供，业务方按常规配置
`spring.cloud.nacos.discovery.server-addr` 和 `spring.cloud.nacos.config.server-addr` 即可。

同时，模块会处理 Spring Boot 3.x / Spring Cloud Alibaba 下的 Nacos 启动早期默认值：默认 profile、Nacos ConfigData 导入、Nacos 日志、Actuator info 与 Bean 覆盖开关。

默认注入低优先级配置，不覆盖业务方显式配置；无 active profile 时默认使用 `dev`，并按公共配置 + 环境配置 + 应用环境配置生成 Nacos 导入：

```properties
spring.profiles.default=dev
spring.config.import=optional:nacos:application.yaml,optional:nacos:application-dev.yaml
spring.cloud.nacos.config.import-check.enabled=false
nacos.logging.default.config.enabled=false
management.info.process.enabled=true
spring.main.allow-bean-definition-overriding=false
```

业务方配置了 `spring.application.name=order-service` 且 profile 为 `prod` 时，默认导入：

```properties
spring.config.import=optional:nacos:application.yaml,optional:nacos:application-prod.yaml,optional:nacos:order-service-prod.yaml
```

业务方可覆盖或关闭：

```yaml
ypbin:
  cloud:
    nacos:
      enabled: true
      default-profile-enabled: true
      default-profile: dev
      fail-on-multiple-preset-profiles: true
      application-name: order-service       # 可选：为空则不注入 spring.application.name
      application-description: 订单服务      # 可选：为空则不注入 info.desc
      service-version: 1.0.0                # 可选：为空则不注入 info.version
      config-import-enabled: true
      config-import:                        # 可选：显式指定后不再自动生成
      config-prefix: application
      config-file-extension: yaml
      include-profile-config: true
      include-application-profile-config: true
      config-import-check-enabled: false
      logging-default-config-enabled: false
      management-info-process-enabled: true
      bean-definition-overriding-enabled: false
```

定位：Nacos 相关默认值、Nacos ConfigData 导入和 Nacos 集成测试都归属于 `cloud-nacos`，不再单独拆启动模块，避免模块边界发散。
