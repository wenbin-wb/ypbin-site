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

> 生成器写入生成项目的是 starter **最新已发布版本**（取自 `CHANGELOG.md` 第一条 `## [X.Y.Z] - 日期`）与 Spring Boot 版本。
> 之所以不用根 pom 的 `revision`：按 `RELEASING.md` 第 6 步，发布后 `revision` 会立刻推进到**下一迭代快照**
> （如 `3.1.0-SNAPSHOT`），把它写进生成项目会让宿主依赖一个尚未发布的坐标、在别人机器上无法解析。
> 仅在 CHANGELOG 解析不到时才回退到 `revision` 并告警，此时生成项目的依赖可能是未发布坐标。

## 测试基座 `ypbin-starter-test`

集成测试需要真实中间件。该模块提供统一的三级解析策略，让同一套测试在任意环境都能合理工作：

1. **外部实例优先**：设置了 `YPBIN_TEST_REDIS_PASSWORD` / `YPBIN_TEST_MYSQL_URL` / `YPBIN_TEST_NACOS_ADDR` 等变量时直接复用；
2. **容器回退**：未提供外部实例且本机 Docker 可用时，用 Testcontainers 拉起 Redis/MySQL/Nacos；
3. **条件跳过**：两者都不可用时测试**跳过而非失败**（`@EnabledIfRedisAvailable` / `@EnabledIfMySqlAvailable` / `@EnabledIfNacosAvailable`），避免无中间件的开发机产生假失败。

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
- **容器模式优先**：有 Docker 的机器（含 CI）会真实拉起 Redis/MySQL/Nacos 容器真跑，**无需外部中间件**（跨服务 Feign 调用的 `FeignCrossServiceIT` 也已容器化）。Nacos 的端口约定与鉴权三件套等细节已收敛到 `ContainerSupport`，使用方只需 `@EnabledIfNacosAvailable` + `ContainerSupport.nacosServerAddress()`；外部实例仍可用 `-Dypbin.it.nacos-addr=host:8848` 或 `YPBIN_TEST_NACOS_ADDR` 覆盖。
- CI 中由独立的「集成测试（Testcontainers）」job 执行，GitHub 托管 runner 自带 Docker，会真实拉起容器。

## 供应链与架构约束

- **SBOM**：`mvn -Psbom verify` 生成 CycloneDX 物料清单（各模块 `target/bom.json` 与聚合 BOM），CI 归档为构建产物。
- **依赖更新**：四仓均启用 Dependabot，按 Spring 族/测试族分组提交，减少噪音。
- **架构约束测试**：`ypbin-starter-architecture-tests`（不发布）用 ArchUnit 把编码铁律变为构建失败——分层依赖、`@Bean` 覆盖语义、`@Transactional` 显式 `rollbackFor`、禁字段注入、禁 `printStackTrace`/`System.out`，以及字节码不可见的源码规则（禁内联全限定类名、Lombok `@Data` 边界、`@AutoConfiguration` 注册、集合字面量工厂、`EnvironmentPostProcessor` 注册）。规则自带**有效性自检**，防止规则写错却永远通过。
- **运行时注册可见性**：`RegistrationDiscoveryTest` 用 Spring Boot 实际使用的 `SpringFactoriesLoader` 加载 classpath 上的 `spring.factories`，断言所有 `EnvironmentPostProcessor` 都能被发现——源码扫描只能证明「写对了键」，这一步才能证明「Boot 真的找得到」。

## 性能基线（JMH）

热路径的性能退化（尤其**复杂度**从 O(n) 退化为 O(n²)）不会被单元测试发现，也不该用挂钟断言去卡 CI——共享 runner 上必然抖动，只会带来假失败。因此单独提供不发布的度量模块 `ypbin-starter-benchmarks`：

```bash
mvn -pl ypbin-starter-benchmarks -am package -DskipTests
java -jar ypbin-starter-benchmarks/target/benchmarks.jar          # 完整（3 轮预热 + 5 轮测量）
java -jar target/benchmarks.jar -f 1 -wi 2 -i 3 -r 1s -w 1s       # 快速冒烟，只看量级
```

覆盖三类热路径：树组装（`TreeUtils.build`）、链路 ID 校验与生成（`RequestIdUtils`，每请求路径）、缓存值序列化（`RedisJsonSerializerFactory` 的写路径含不可变集合规范化、读路径多态还原）。

**该模块只量化，不做门禁**：

- 绝对值不可移植（随机器/负载变化），**看的是同一台机器上改动前后的对比，以及规模放大的增长倍率**；
- 可精确断言的复杂度/正确性由单元测试兜底（并发合并、防抖合并、原子替换、集合空值语义等，见 `PersistCoordinatorTest`、`ImmutableCollectionNormalizerTest`）；
- 模块只依赖 L1 基础能力，且被分层规则列入「可横跨各层」的开发工具（不参与运行时依赖）。

::: warning 复杂度必须用「确定性计数」而不是挂钟来守
本项目在这里踩过一次：早期基准用 `rootId * 1_000_000 + child` 造节点 ID，子 ID 与根 ID 撞号，使
`TreeUtils.build` 的内部线性扫描**提前命中**，于是测出「规模 10 倍、耗时 11.1 倍 ≈ 线性」，并据此宣称 O(n)——
而它当时实际是 O(n²)。教训有两条：

1. **基准要覆盖最坏形态**，只测一种数据形态会把退化掩盖成线性。现在树组装基准同时测「父在前」与「父在后」；
2. **能确定性断言的复杂度不要用挂钟断言**。`TreeUtilsTest#buildShouldBeLinearInNodeCount` 直接统计
   `getId()` 调用次数并断言 < 6n（修复前 n=4000 时约 1.0·n² ≈ 1600 万次，修复后约 2n），
   这才是防退化的门禁；基准只负责给出量级参考。
:::

::: tip 基线示例（2 核开发机、快速冒烟档 `-wi 2 -i 3`，误差较大，仅示意量级）
| 基准 | 规模 | 耗时 |
|---|---|---|
| `TreeUtilsBenchmark.buildParentsFirst` | 1000 节点 | ≈73 µs |
| `TreeUtilsBenchmark.buildParentsFirst` | 10000 节点 | ≈1048 µs |
| `TreeUtilsBenchmark.buildChildrenFirst`（最坏形态） | 1000 节点 | ≈87 µs |
| `TreeUtilsBenchmark.buildChildrenFirst`（最坏形态） | 10000 节点 | ≈666 µs |
| `RequestIdUtilsBenchmark.sanitizeValid` | — | ≈18 ns |
| `RequestIdUtilsBenchmark.generate` | — | ≈377 ns |
| `RedisSerializerBenchmark.serialize` | — | ≈2.0 µs |
| `RedisSerializerBenchmark.deserialize` | — | ≈6.9 µs |

最坏形态在规模放大 10 倍后没有出现 n² 级爆炸（这正是修复前会发生的），做严肃对比请用完整运行
（默认 3 轮预热 + 5 轮测量）并在同一台机器上比较。
::: tip 基线示例（2 核开发机、快速冒烟档，仅示意量级与增长倍率）
| 基准 | 规模 | 耗时 |
|---|---|---|
| `TreeUtilsBenchmark.build` | 1000 节点 | ≈86 µs |
| `TreeUtilsBenchmark.build` | 10000 节点 | ≈962 µs |
| `RequestIdUtilsBenchmark.sanitizeValid` | — | ≈20 ns |
| `RequestIdUtilsBenchmark.generate` | — | ≈409 ns |
| `RedisSerializerBenchmark.serialize` | — | ≈2.5 µs |
| `RedisSerializerBenchmark.deserialize` | — | ≈7.6 µs |

节点规模放大 10 倍、耗时放大 11.1 倍 ≈ 线性，印证 `TreeUtils.build` 的 O(n) 声明（若退化为 O(n²) 应约 100 倍）。快速冒烟档误差较大，做严肃对比请用完整运行。
:::

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

## 空值语义：`@NullMarked` + NullAway（已推广至 cache/data/web/cloud-core）

只加 `@NullMarked` 注解而不做校验是**危险的**：它的语义是「未标注即非空」，一旦有返回值、参数或字段实际可能为 `null` 而没标 `@Nullable`，注解就在说谎——IDE 与静态分析会据此做出错误的非空假设，比不标注更糟。

所以本项目采用「注解 + 编译期校验」一起上，并按模块逐个推进。**当前已纳管 5 个模块**：`core`、`cache`、`data`、`web`、`cloud-core`（合计修出 **54 处**「实际可空却标注非空」，其中起点模块 `core` 的 4 处是真实潜在 NPE）。

```bash
# 校验全部已纳管模块（CI 的「空值语义检查」步骤就是这样跑的）
MODULES="$(for pom in ./*/pom.xml; do
  dir="$(dirname "$pom")"
  [ -d "$dir/src/main/java" ] || continue
  grep -q '<nullaway.packages>' "$pom" && printf '%s\n' "${dir#./}"
done | paste -sd, -)"
mvn -Pnullaway -pl "$MODULES" compile --fail-at-end
```

::: warning 一定要加 `--fail-at-end`
多模块检查时若不加 `-fae`，Maven 会在**第一个**失败模块处停止——后面的模块「没报错」其实只是**没跑到**。
本仓库就在这上面栽过：一次四模块检查只看到 `web` 的报错，误以为 `cache`/`data` 干净，实际它们各有 14 处与 12 处。
:::

纳管后的三类典型修法（都是「让注解与实现一致」，不是为了让检查闭嘴）：

| 现象 | 修法 |
|---|---|
| 方法确实会在未命中/解析失败时返回 `null`（如缓存 `get`、`XssCleaner.clean` 的「null 进 null 出」、MyBatis `getNullableResult`、Spring Data `RedisSerializer` 契约） | 给返回值/参数补 `@Nullable`，并同步接口与静态工具类的透传方法 |
| 字段由**框架**填充而非构造器初始化（MyBatis-Plus 的 `@TableField(fill=…)`/主键、Spring Boot 的 `@ConfigurationProperties` 绑定） | 在该字段或类上标 `@SuppressWarnings("NullAway.Init")` 并写明原因——这是框架装配语义，不是真的「忘了初始化」 |
| 静态持有器（`CacheUtils`/`RedisUtils`/`FieldEncryptorHolder`）延迟初始化 | 字段标 `@Nullable` + 用**局部变量**做双重检查（`current = field; if (current == null) { … }`），这样原来的判空逻辑会被 NullAway 真正校验 |

### 逐模块纳管的步骤

1. 该模块 pom 显式声明 `org.jspecify:jspecify`（不要只靠 `spring-core` 的传递依赖）；
2. 在模块根包加 `package-info.java`，标注 `@NullMarked`（对该包及子包生效）；
3. 在该模块 pom 的 `<properties>` 里声明 `<nullaway.packages>本模块根包</nullaway.packages>`
   ——配置本体在父 pom `ypbin-starter-dependencies` 的 `nullaway` profile 里，模块侧只需这一行；
4. `mvn -Pnullaway -pl <模块> compile -fae` 修完报告的问题（按上表甄别，必要时补 `@Nullable`）；
5. **无需改 CI**：CI 步骤按「含主源码且声明了 `nullaway.packages`」自动发现参与模块。

### 工具链坑（都已踩过）

- **必须 `fork=true`**：Error Prone 依赖的一组 `add-exports`/`add-opens` 参数只对 javac 启动器生效，非 fork（in-process）会以 `IllegalAccessError` 崩溃；
- **必须 `--should-stop=ifError=FLOW`**：fork 模式下 javac 默认策略为 `INIT`，Error Prone 不接受；
- **`-Xplugin:` 整条必须写在一行**：XML 里的换行会被当成独立参数传给 javac，报 `invalid flag`；
- **`annotationProcessorPaths` 是覆盖而非追加**：目标模块原有的处理器（如 `spring-boot-configuration-processor`）必须一并列入，否则配置元数据不再生成、元数据漂移门禁会失败；
- **本工具链下不要用 `JSpecifyMode=true`**（NullAway 0.11.3 + error_prone_core 2.36.0 + JDK 21 fork javac）：实测会让 javac 无任何诊断地失败；用 `-XepOpt:NullAway:AnnotatedPackages=<包>` 声明同一范围即可，包上的 `@NullMarked` 仍保留供 IDE 与其他 JSpecify 工具识别。
