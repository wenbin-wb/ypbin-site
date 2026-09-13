---
title: 项目脚手架
description: 用 ypbin-starter 生成可直接运行的项目骨架（四种预设）与测试基座说明。
---

# 项目脚手架

starter 不只是依赖库，也提供**项目生成器**：从一个可直接编译运行的骨架开始，而不是自行挑选 38 个模块。

## 生成项目

生成器位于 starter 仓库 `tools/ypbin-init.mjs`：

```bash
git clone https://github.com/wenbin-wb/ypbin-starter.git
cd ypbin-starter
node tools/ypbin-init.mjs <preset> <artifactId> [选项]
```

| 选项 | 说明 | 默认 |
|---|---|---|
| `--group=cn.example` | Maven groupId | `cn.ypbin.demo` |
| `--package=cn.example.demo` | Java 包名 | `<groupId>.<artifactId>` |
| `--name="示例服务"` | 应用展示名 | 取 artifactId |
| `--port=8080` | HTTP 端口 | 8080（worker 预设无端口） |
| `--out=./my-app` | 输出目录 | `./<artifactId>` |
| `--force` | 目标目录非空时继续 | 否 |

示例：

```bash
node tools/ypbin-init.mjs monolith demo-admin --group=cn.ypbin.demo --out=../demo-admin
cd ../demo-admin && mvn test
```

## 四种预设

| 预设 | 形态 | 已引入能力 |
|---|---|---|
| `api-only` | 单模块，纯 REST API | Web（统一响应/全局异常/CORS/XSS）+ JSON + 接口文档 + 日志 |
| `monolith` | 单模块，单体应用 | 上述 + MyBatis-Plus 数据访问 + 缓存 + Sa-Token 安全 + 工具集 |
| `microservice` | 双模块（`-api` 契约 + `-service` 实现） | Web + JSON + 安全 + 注册配置 + Feign 增强；契约模块含 DTO 与 Feign 客户端 |
| `worker` | 单模块，非 Web 任务进程 | 数据访问 + 异步（虚拟线程）+ XXL-JOB + 日志 |

生成的项目自带：`spring-boot-starter-parent`（平台版本与 starter 基线对齐）、starter BOM、可运行启动类、示例接口/任务、单元测试、`.gitignore` 与 README。

> 生成器会把 starter 当前版本（根 pom 的 `revision`）与 Spring Boot 版本写入生成项目，因此生成即与本地/远端 BOM 版本一致。

## 测试基座 `ypbin-starter-test`

集成测试需要真实中间件。该模块提供统一的三级解析策略，让同一套测试在任意环境都能合理工作：

1. **外部实例优先**：设置了 `YPBIN_TEST_REDIS_PASSWORD` / `YPBIN_TEST_MYSQL_URL` 等环境变量时直接复用；
2. **容器回退**：未提供外部实例且本机 Docker 可用时，用 Testcontainers 拉起 Redis/MySQL；
3. **条件跳过**：两者都不可用时测试**跳过而非失败**，避免无中间件的开发机产生假失败。

```xml
<dependency>
    <groupId>cn.ypbin</groupId>
    <artifactId>ypbin-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```

```java
@EnabledIfRedisAvailable
class MyCacheIT {

    @DynamicPropertySource
    static void redis(DynamicPropertyRegistry registry) {
        registry.add("spring.data.redis.host", ContainerSupport::redisHost);
        registry.add("spring.data.redis.port", ContainerSupport::redisPort);
    }
}
```

## 集成测试门禁

- `mvn test`：只跑单元测试（surefire 默认排除 `**/*IT.java`）。
- `mvn -Pit verify`：额外执行 `**/*IT.java`（failsafe）；无中间件时会条件跳过。
- **执行器唯一**：`*IT.java` 只由 failsafe 执行。模块里不要再声明模块级 `it` profile 或 surefire/compiler 的 `testExcludes` 覆盖——那会把 IT 塞回 surefire，绕过统一门禁，还会让 `mvn test` 意外拉起容器。
- **容器模式优先**：有 Docker 的机器（含 CI）会真实拉起 Redis/MySQL/Nacos 容器真跑，无需外部中间件。注意 Nacos 客户端固定按「服务端口 + 1000」连 gRPC，容器必须把 8848/9848 绑定到**相隔 1000 的连续宿主端口**，否则会以 `Client not connected, current status:STARTING` 失败；Nacos 3 镜像还强制要求 `NACOS_AUTH_TOKEN` 等鉴权三件套。仅 `FeignCrossServiceIT` 需显式给 `-Dypbin.it.nacos-addr`，未给则跳过。
- CI 中由独立的「集成测试（Testcontainers）」job 执行，GitHub 托管 runner 自带 Docker，会真实拉起容器。

## 供应链与架构约束

- **SBOM**：`mvn -Psbom verify` 生成 CycloneDX 物料清单（各模块 `target/bom.json` 与聚合 BOM），CI 归档为构建产物。
- **依赖更新**：四仓均启用 Dependabot，按 Spring 族/测试族分组提交，减少噪音。
- **架构约束测试**：`ypbin-starter-architecture-tests`（不发布）用 ArchUnit 把编码铁律变为构建失败——分层依赖、`@Bean` 覆盖语义、`@Transactional` 显式 `rollbackFor`、禁字段注入、禁 `printStackTrace`/`System.out`，以及字节码不可见的源码规则（禁内联全限定类名、Lombok `@Data` 边界、`@AutoConfiguration` 注册、集合字面量工厂、`EnvironmentPostProcessor` 注册）。规则自带**有效性自检**，防止规则写错却永远通过。
- **运行时注册可见性**：`RegistrationDiscoveryTest` 用 Spring Boot 实际使用的 `SpringFactoriesLoader` 加载 classpath 上的 `spring.factories`，断言所有 `EnvironmentPostProcessor` 都能被发现——源码扫描只能证明「写对了键」，这一步才能证明「Boot 真的找得到」。

## 与 Spring Boot 4.1 / Spring Framework 7 的写法对齐

脚手架默认按新基线写法生成，避免接入方从旧教程抄到已废弃的 API：

| 旧写法（已废弃/待移除） | 新写法 | 说明 |
|---|---|---|
| `org.springframework.boot.env.EnvironmentPostProcessor` | `org.springframework.boot.EnvironmentPostProcessor` | **接口与 `spring.factories` 注册键必须同时改**，只改一处会「编译通过但默认值静默失效」 |
| `org.springframework.lang.NonNull` / `Nullable` | `org.jspecify.annotations.*` | 框架包已 `@NullMarked`，实现框架接口时冗余的 `@NonNull` 直接删掉即可 |
| `ThreadLocalAccessor.reset()` | 覆写无参 `setValue()` | `setValue()` 默认实现即委托 `reset()`，语义等价 |
| `RestClient.Builder.messageConverters(Consumer<List>)` | `configureMessageConverters(...)` | **不要**换成 `withJsonConverter()`：它用 `equalsTypeAndSubtype` 校验，宽容媒体类型（`*/*`）会被判非法 |
| `BaseMapper.selectBatchIds(...)` | `selectByIds(...)` | MyBatis-Plus 3.5.17 起旧方法是委托新方法的 default 方法 |
| `Collections.emptyList()` / `singletonList()` | `List.of()` / `Set.of()` / `Map.of()` | 由架构测试拦截（注意不可变工厂不接受 `null` 元素） |
| `MappingJackson2HttpMessageConverter` | `JacksonJsonHttpMessageConverter` | Jackson 3 包名不变（`org.springframework.http.converter.json`），类名去掉 `2` |

> 验证方式：`mvn -o clean test-compile -Dmaven.compiler.showDeprecation=true`，主源码与测试源码均应零废弃告警；例外（如需覆盖旧算法兼容行为）用 `@SuppressWarnings("deprecation")` 并注明意图。

## 空值语义：`@NullMarked` + NullAway（模块级试点）

只加 `@NullMarked` 注解而不做校验是**危险的**：它的语义是「未标注即非空」，一旦有返回值、参数或字段实际可能为 `null` 而没标 `@Nullable`，注解就在说谎——IDE 与静态分析会据此做出错误的非空假设，比不标注更糟。

所以本项目采用「注解 + 编译期校验」一起上，并按模块逐个推进（当前已完成 `ypbin-starter-core`）：

```bash
# 校验某个已纳管的模块（CI 已在跑 core）
mvn -Pnullaway -pl ypbin-starter-core compile
```

试点实测：`core`（15 个主源码文件）上线即报出 **15 处**问题，全部是「代码确实可空但没标注」，其中 **4 处是真实潜在 NPE**——`SpringUtils` 直接解引用尚未就绪的 `applicationContext`（`getBean` ×2、`getEventPublisher`、`getEnvironment`），未就绪时抛的是无信息的 `NullPointerException`。已改为统一的 `requireApplicationContext()` 断言：仍然失败、不放行，但错误信息直接说明原因与替代做法。

### 逐模块纳管的步骤

1. 该模块 pom 显式声明 `org.jspecify:jspecify`（不要只靠 `spring-core` 的传递依赖）；
2. 在模块根包加 `package-info.java`，标注 `@NullMarked`（对该包及子包生效）；
3. 从 `ypbin-starter-core/pom.xml` 复制 `nullaway` profile（profile 内的模块名与 `AnnotatedPackages` 改成目标包）；
4. `mvn -Pnullaway -pl <模块> compile` 修完报告的问题——**优先甄别真问题**（漏判空 → 潜在 NPE），必要时给字段/参数/返回值补 `@Nullable`；
5. 把该模块加进 CI 的「空值语义检查（NullAway）」步骤。

### 工具链坑（都已踩过）

- **必须 `fork=true`**：Error Prone 依赖的一组 `add-exports`/`add-opens` 参数只对 javac 启动器生效，非 fork（in-process）会以 `IllegalAccessError` 崩溃；
- **必须 `--should-stop=ifError=FLOW`**：fork 模式下 javac 默认策略为 `INIT`，Error Prone 不接受；
- **`-Xplugin:` 整条必须写在一行**：XML 里的换行会被当成独立参数传给 javac，报 `invalid flag`；
- **`annotationProcessorPaths` 是覆盖而非追加**：目标模块原有的处理器（如 `spring-boot-configuration-processor`）必须一并列入，否则配置元数据不再生成、元数据漂移门禁会失败；
- **本工具链下不要用 `JSpecifyMode=true`**（NullAway 0.11.3 + error_prone_core 2.36.0 + JDK 21 fork javac）：实测会让 javac 无任何诊断地失败；用 `-XepOpt:NullAway:AnnotatedPackages=<包>` 声明同一范围即可，包上的 `@NullMarked` 仍保留供 IDE 与其他 JSpecify 工具识别。
