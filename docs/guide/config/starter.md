---
title: Starter 配置参考
description: ypbin-starter 全量配置项、默认值、启用条件与生产注意。
---

# Starter 配置参考

本页由源码审计数据生成，覆盖 **329** 个配置项，其中 `ypbin.*` 289 项、宿主标准配置 40 项。默认值以源码为准。表格支持左右滚动。

## ypbin-starter-ai


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `ypbin.ai.enabled` | `boolean` | true | 是否启用 AI 模块，默认开启<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：AiProperties.java:32 · AiMemoryAutoConfiguration.java:42</span> |
| `ypbin.ai.chat.enabled` | `boolean` | true | 是否启用对话能力，默认开启<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：AiChatProperties.java:34 · AiChatAutoConfiguration.java:61</span> |
| `ypbin.ai.chat.default-system-prompt` | `string` | 你是一个专业的企业级 AI 助手，请用简洁清晰的中文回答问题。 | 默认系统提示词。使用 DeepSeek/GPT 等模型时作为 system 角色消息注入<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：AiChatProperties.java:37</span> |
| `ypbin.ai.chat.rag-enabled` | `boolean` | false | 是否在对话中启用 RAG 检索增强（需要同时配置 ypbin.ai.rag.enabled=true）<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：AiChatProperties.java:40</span> |
| `ypbin.ai.chat.stream-timeout-ms` | `long` | 0 | 流式响应超时（毫秒），0 表示不超时<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：AiChatProperties.java:43</span> |
| `ypbin.ai.memory.type` | `string` | in-memory | 记忆存储类型：in-memory（默认，重启后丢失）/ jdbc（持久化，需 JDBC 依赖与建表）<br>可选值：in-memory / jdbc<br><strong>注意</strong>：—<br><span class="cfg-src">来源：AiMemoryProperties.java:38 · AiMemoryAutoConfiguration.java:69</span> |
| `ypbin.ai.memory.window-size` | `integer` | 20 | 记忆窗口大小（每次请求携带的历史消息条数），默认 20<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：AiMemoryProperties.java:41</span> |
| `ypbin.ai.rag.enabled` | `boolean` | false | 是否启用 RAG，默认关闭（需要向量库才有意义）<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：AiRagProperties.java:32 · AiRagAutoConfiguration.java:42</span> |
| `ypbin.ai.rag.top-k` | `integer` | 5 | 检索最近 TopK 片段，默认 5<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：AiRagProperties.java:35</span> |
| `ypbin.ai.rag.similarity-threshold` | `double` | 0.7 | 相似度阈值，低于此值的片段不纳入 context，默认 0.7<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：AiRagProperties.java:38</span> |
| `ypbin.ai.rag.max-context-length` | `integer` | 8000 | 最大 context 长度（字符数），防止超出模型上下文窗口<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：AiRagProperties.java:41</span> |
| `ypbin.ai.rag.simple-store-path` | `string` | — | SimpleVectorStore 序列化文件路径；配置后重启不丢向量（自动加载/保存）<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：AiRagProperties.java:44</span> |

</div>


## ypbin-starter-api-crypto


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `ypbin.api-crypto.enabled` | `boolean` | true | 是否启用接口加解密，默认开启（仍需方法上标注 @ApiEncrypt 才生效）<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：ApiCryptoProperties.java:30 · ApiCryptoAutoConfiguration.java:44</span> |
| `ypbin.api-crypto.key` | `string` | — | 默认 AES 实现的密钥，长度需为 16/24/32 字节。配置后才装配默认加解密器<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。<br><span class="cfg-src">来源：ApiCryptoProperties.java:33 · ApiCryptoAutoConfiguration.java:50</span> |

</div>


## ypbin-starter-api-doc


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `ypbin.api-doc.contact.email` | `string` |  | 邮箱<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：ApiDocProperties.java:208</span> |
| `ypbin.api-doc.contact.name` | `string` |  | 姓名<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：ApiDocProperties.java:205</span> |
| `ypbin.api-doc.contact.url` | `string` |  | 主页地址<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：ApiDocProperties.java:211</span> |
| `ypbin.api-doc.default-group-enabled` | `boolean` | true | 是否创建默认 GroupedOpenApi<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：ApiDocProperties.java:51 · ApiDocAutoConfiguration.java:104</span> |
| `ypbin.api-doc.description` | `string` |  | 文档描述<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：ApiDocProperties.java:42</span> |
| `ypbin.api-doc.disable-in-prod` | `boolean` | true | 生产环境是否关闭 SpringDoc 端点，默认关闭<br>可选值：—<br><strong>注意</strong>：生产环境应关闭或严格限制文档端点。<br><span class="cfg-src">来源：ApiDocProperties.java:36</span> |
| `ypbin.api-doc.enabled` | `boolean` | true | 是否启用 API 文档，默认开启<br>可选值：—<br><strong>注意</strong>：生产环境应关闭或严格限制文档端点。<br><span class="cfg-src">来源：ApiDocProperties.java:33 · ApiDocAutoConfiguration.java:60</span> |
| `ypbin.api-doc.group-name` | `string` | default | 默认分组名称<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：ApiDocProperties.java:48</span> |
| `ypbin.api-doc.license.name` | `string` |  | 协议名称<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：ApiDocProperties.java:205</span> |
| `ypbin.api-doc.license.url` | `string` |  | 协议地址<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：ApiDocProperties.java:211</span> |
| `ypbin.api-doc.order-enabled` | `boolean` | true | 是否启用 @ApiOrder 排序<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：ApiDocProperties.java:54 · ApiDocAutoConfiguration.java:146</span> |
| `ypbin.api-doc.packages-to-exclude` | `string>` | — | 排除包<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：ApiDocProperties.java:66</span> |
| `ypbin.api-doc.packages-to-scan` | `string>` | — | 扫描包<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：ApiDocProperties.java:63</span> |
| `ypbin.api-doc.paths-to-exclude` | `string>` | — | 排除路径<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：ApiDocProperties.java:60</span> |
| `ypbin.api-doc.paths-to-match` | `string>` | — | 扫描路径<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：ApiDocProperties.java:57</span> |
| `ypbin.api-doc.security-headers` | `string>` | — | 全局安全请求头<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：ApiDocProperties.java:69</span> |
| `ypbin.api-doc.title` | `string` | API 文档 | 文档标题<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：ApiDocProperties.java:39</span> |
| `ypbin.api-doc.version` | `string` | 1.0.0 | 文档版本<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：ApiDocProperties.java:45</span> |
| `springdoc.api-docs.enabled` | `boolean` | true | SpringDoc OpenAPI JSON 端点开关；prod 且 disable-in-prod=true 时 starter 低优先级设为 false。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：ApiDocDefaultsEnvironmentPostProcessor.java:54</span> |
| `springdoc.swagger-ui.enabled` | `boolean` | true | SpringDoc Swagger UI 开关；prod 且 disable-in-prod=true 时 starter 低优先级设为 false。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：ApiDocDefaultsEnvironmentPostProcessor.java:55</span> |

</div>


## ypbin-starter-async


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `ypbin.async.allow-core-thread-timeout` | `boolean` | false | 是否允许核心线程超时回收。<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：—<br><span class="cfg-src">来源：AsyncProperties.java:53 · additional-spring-configuration-metadata.json:1</span> |
| `ypbin.async.await-termination` | `boolean` | true | 关闭时是否等待任务执行完。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：AsyncProperties.java:62 · additional-spring-configuration-metadata.json:1</span> |
| `ypbin.async.await-termination-seconds` | `integer` | 30 | 关闭时最长等待秒数。<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：—<br><span class="cfg-src">来源：AsyncProperties.java:65 · additional-spring-configuration-metadata.json:1</span> |
| `ypbin.async.core-size` | `integer` | 8 | 核心线程数。<br>可选值：正整数<br><strong>注意</strong>：—<br><span class="cfg-src">来源：AsyncProperties.java:41 · additional-spring-configuration-metadata.json:1</span> |
| `ypbin.async.enable-annotation` | `boolean` | true | 是否接管 @Async（启用 @EnableAsync 并把默认执行器指向本模块线程池）。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：AsyncProperties.java:35 · additional-spring-configuration-metadata.json:1 · AsyncAnnotationAutoConfiguration.java:45</span> |
| `ypbin.async.enabled` | `boolean` | true | 是否启用异步能力。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：AsyncProperties.java:32 · additional-spring-configuration-metadata.json:1 · AsyncAnnotationAutoConfiguration.java:40 · AsyncAutoConfiguration.java:47</span> |
| `ypbin.async.keep-alive-seconds` | `integer` | 60 | 空闲线程存活秒数。<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：—<br><span class="cfg-src">来源：AsyncProperties.java:50 · additional-spring-configuration-metadata.json:1</span> |
| `ypbin.async.max-size` | `integer` | 32 | 最大线程数。<br>可选值：正整数<br><strong>注意</strong>：—<br><span class="cfg-src">来源：AsyncProperties.java:44 · additional-spring-configuration-metadata.json:1</span> |
| `ypbin.async.queue-capacity` | `integer` | 1000 | 队列容量。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：AsyncProperties.java:47 · additional-spring-configuration-metadata.json:1</span> |
| `ypbin.async.rejection-policy` | `asyncProperties$RejectionPolicy` | caller-runs | 线程池拒绝策略：CALLER&#95;RUNS/ABORT/DISCARD/DISCARD&#95;OLDEST。<br>可选值：CALLER&#95;RUNS / ABORT / DISCARD / DISCARD&#95;OLDEST<br><strong>注意</strong>：—<br><span class="cfg-src">来源：AsyncProperties.java:59 · additional-spring-configuration-metadata.json:1</span> |
| `ypbin.async.scheduler-pool-size` | `integer` | 2 | 调度线程池大小。<br>可选值：正整数<br><strong>注意</strong>：—<br><span class="cfg-src">来源：AsyncProperties.java:68 · additional-spring-configuration-metadata.json:1</span> |
| `ypbin.async.scheduler-thread-name-prefix` | `string` | ypbin-scheduler- | 调度线程名前缀。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：AsyncProperties.java:71 · additional-spring-configuration-metadata.json:1</span> |
| `ypbin.async.thread-name-prefix` | `string` | ypbin-async- | 线程名前缀。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：AsyncProperties.java:56 · additional-spring-configuration-metadata.json:1</span> |
| `ypbin.async.virtual-threads` | `boolean` | false | 是否优先使用虚拟线程（JDK 21+ 生效）。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：AsyncProperties.java:38 · additional-spring-configuration-metadata.json:1</span> |

</div>


## ypbin-starter-cache


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `ypbin.cache.enabled` | `boolean` | true | 是否启用缓存自动配置（定制 RedisTemplate 与 CacheService）。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：spring-configuration-metadata.json:1 · additional-spring-configuration-metadata.json:1 · CacheAutoConfiguration.java:56</span> |
| `ypbin.cache.multi-level.enabled` | `boolean` | false | 是否启用多级缓存（L1 Caffeine 本地 + L2 Redis），需类路径存在 Caffeine。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：MultiLevelCacheProperties.java:32 · additional-spring-configuration-metadata.json:1 · MultiLevelCacheAutoConfiguration.java:60</span> |
| `ypbin.cache.multi-level.invalidation-broadcast` | `boolean` | true | 是否开启跨实例失效广播（多副本部署需开启）。<br>可选值：—<br><strong>注意</strong>：多副本部署应开启跨实例失效广播；强一致数据不应依赖本地 L1。<br><span class="cfg-src">来源：MultiLevelCacheProperties.java:41 · additional-spring-configuration-metadata.json:1 · MultiLevelCacheAutoConfiguration.java:82</span> |
| `ypbin.cache.multi-level.invalidation-channel` | `string` | ypbin:cache:invalidation | 失效广播 Redis Pub/Sub 频道名。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：MultiLevelCacheProperties.java:44 · additional-spring-configuration-metadata.json:1</span> |
| `ypbin.cache.multi-level.local-expire-seconds` | `long` | 300 | L1 本地缓存写后过期秒数（应小于 L2 TTL，作为最终一致兜底）。<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：—<br><span class="cfg-src">来源：MultiLevelCacheProperties.java:38 · additional-spring-configuration-metadata.json:1</span> |
| `ypbin.cache.multi-level.local-max-size` | `long` | 10000 | L1 本地缓存最大条目数。<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：—<br><span class="cfg-src">来源：MultiLevelCacheProperties.java:35 · additional-spring-configuration-metadata.json:1</span> |
| `spring.data.redis.host` | `string` | localhost | Redis 主机；缓存、多级缓存和分布式存储使用。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：CacheAutoConfiguration.java:55</span> |
| `spring.data.redis.port` | `integer` | 6379 | Redis 端口。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：CacheAutoConfiguration.java:55</span> |
| `spring.data.redis.password` | `string` | — | Redis 密码。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：CacheAutoConfiguration.java:55</span> |

</div>


## ypbin-starter-captcha


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `ypbin.captcha.background-resources` | `string>` | — | 自定义背景图资源（classpath 相对路径，如 captcha/bg/1.jpg，对应 resources/captcha/bg/1.jpg）。 为空时回退加载 tianai 内置的单张默认背景图；配置多张时全部注册，验证码随机取用，避免背景单一。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：CaptchaProperties.java:38</span> |
| `ypbin.captcha.enabled` | `boolean` | true | 是否启用验证码（行为验证码）自动配置。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：CaptchaProperties.java:32 · additional-spring-configuration-metadata.json:1 · CaptchaAutoConfiguration.java:44</span> |

</div>


## ypbin-starter-cloud-core


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `ypbin.cloud.feign.circuitbreaker-enabled` | `boolean` | true | 是否默认开启 OpenFeign circuitbreaker，默认开启<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：FeignProperties.java:38</span> |
| `ypbin.cloud.feign.enabled` | `boolean` | true | 是否启用 Feign 增强（请求头透传等），默认开启<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：FeignProperties.java:32 · CloudFeignAutoConfiguration.java:43</span> |
| `ypbin.cloud.feign.error-decoder-enabled` | `boolean` | true | 是否启用统一错误解码，默认开启<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：FeignProperties.java:35 · CloudFeignAutoConfiguration.java:49</span> |
| `ypbin.cloud.feign.propagate-headers` | `string>` | — | 需要透传到下游服务的请求头名单（大小写不敏感）。 默认只透传认证与链路追踪相关头；用户、租户等身份头应由可信网关清洗/签发后再显式加入。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：FeignProperties.java:44</span> |
| `spring.cloud.openfeign.circuitbreaker.enabled` | `boolean` | true | Feign CircuitBreaker 标准开关；由 ypbin.cloud.feign.circuitbreaker-enabled 低优先级映射。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：FeignDefaultsEnvironmentPostProcessor.java:49</span> |

</div>


## ypbin-starter-cloud-gateway


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `ypbin.gateway.auth.enabled` | `boolean` | false | 是否启用统一认证，默认关闭；需同时提供 GatewayAuthProvider Bean<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：GatewayProperties.java:32 · GatewayAutoConfiguration.java:71</span> |
| `ypbin.gateway.auth.exclude-paths` | `string>` | — | 放行路径<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：GatewayProperties.java:207</span> |
| `ypbin.gateway.cors.allow-credentials` | `boolean` | true | 是否允许携带凭证<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：GatewayProperties.java:107</span> |
| `ypbin.gateway.cors.allowed-headers` | `string>` | — | 允许的请求头<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：GatewayProperties.java:101</span> |
| `ypbin.gateway.cors.allowed-methods` | `string>` | — | 允许的请求方法<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：GatewayProperties.java:98</span> |
| `ypbin.gateway.cors.allowed-origin-patterns` | `string>` | — | 允许的来源模式<br>可选值：—<br><strong>注意</strong>：生产环境避免通配跨域来源；启用凭证时必须使用受控来源。<br><span class="cfg-src">来源：GatewayProperties.java:95</span> |
| `ypbin.gateway.cors.enabled` | `boolean` | false | 是否启用跨域，默认关闭<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：GatewayProperties.java:32 · GatewayAutoConfiguration.java:79</span> |
| `ypbin.gateway.cors.exposed-headers` | `string>` | — | 暴露给浏览器的响应头<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：GatewayProperties.java:104</span> |
| `ypbin.gateway.cors.max-age` | `long` | 3600 | 预检请求缓存时间（秒）<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：—<br><span class="cfg-src">来源：GatewayProperties.java:110</span> |
| `ypbin.gateway.enabled` | `boolean` | true | 是否启用网关增强，默认开启<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：GatewayProperties.java:32 · GatewayAutoConfiguration.java:51</span> |
| `ypbin.gateway.header-sanitize.enabled` | `boolean` | true | 是否清洗客户端传入的身份类请求头，默认开启<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：GatewayProperties.java:32 · GatewayAutoConfiguration.java:63</span> |
| `ypbin.gateway.header-sanitize.headers` | `string>` | — | 客户端不可直接传入、需由可信网关签发的请求头<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：GatewayProperties.java:178</span> |
| `ypbin.gateway.request-id-header` | `string` | X-Request-Id | 请求 ID 请求头名称<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：GatewayProperties.java:35</span> |
| `ypbin.gateway.route.nacos.data-id` | `string` | gateway-routes.json | Nacos 配置 Data ID<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：NacosRouteProperties.java:33</span> |
| `ypbin.gateway.route.nacos.enabled` | `boolean` | false | 是否启用 Nacos 动态路由，默认关闭<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：NacosRouteProperties.java:30 · NacosRouteAutoConfiguration.java:39</span> |
| `ypbin.gateway.route.nacos.group` | `string` | DEFAULT&#95;GROUP | Nacos 配置 Group<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：NacosRouteProperties.java:36</span> |
| `ypbin.gateway.route.nacos.timeout-ms` | `long` | 5000 | Nacos 读取配置超时（毫秒）<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：—<br><span class="cfg-src">来源：NacosRouteProperties.java:39</span> |
| `ypbin.gateway.swagger.api-docs-path` | `string` | /v3/api-docs | 下游服务 /v3/api-docs 路径<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：GatewaySwaggerAggregationProperties.java:35</span> |
| `ypbin.gateway.swagger.enabled` | `boolean` | false | 是否启用 Swagger 聚合，默认关闭<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：GatewaySwaggerAggregationProperties.java:32 · GatewaySwaggerAutoConfiguration.java:46</span> |
| `ypbin.gateway.swagger.excluded-route-prefixes` | `string>` | — | 需要排除的路由 ID 前缀<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：GatewaySwaggerAggregationProperties.java:41</span> |
| `ypbin.gateway.swagger.group-name` | `string` | default | 下游服务分组名<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：GatewaySwaggerAggregationProperties.java:38</span> |
| `spring.cloud.gateway.routes[]` | `routeDefinition>` | — | 静态网关路由列表；starter 不预设业务路由。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：MODULES.md:1641</span> |

</div>


## ypbin-starter-cloud-loadbalancer


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `ypbin.cloud.loadbalancer.default-weight` | `integer` | 1 | metadata 未配置或配置非法时使用的默认权重<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：LoadBalancerProperties.java:49</span> |
| `ypbin.cloud.loadbalancer.enabled` | `boolean` | true | 是否启用版本灰度负载均衡，默认开启<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：LoadBalancerProperties.java:34 · LoadBalancerAutoConfiguration.java:46</span> |
| `ypbin.cloud.loadbalancer.fallback-to-stable` | `boolean` | true | 灰度版本无匹配实例时是否回退到正式实例<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：LoadBalancerProperties.java:52</span> |
| `ypbin.cloud.loadbalancer.metadata-key` | `string` | version | 服务实例 metadata 中保存版本的 key<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：LoadBalancerProperties.java:43</span> |
| `ypbin.cloud.loadbalancer.prefer-stable-without-version` | `boolean` | true | 无版本请求是否优先选择未标记版本的正式实例<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：LoadBalancerProperties.java:55</span> |
| `ypbin.cloud.loadbalancer.prior-ip-patterns` | `string>` | — | 优先 IP 通配列表，例如 10.20.0.8&#42;、10.20.0.&#42;<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：LoadBalancerProperties.java:58</span> |
| `ypbin.cloud.loadbalancer.register-nacos-metadata` | `boolean` | true | 是否把当前服务版本写入 Nacos discovery metadata<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：LoadBalancerProperties.java:61</span> |
| `ypbin.cloud.loadbalancer.version` | `string` | — | 当前服务实例版本；配置后可自动写入 Nacos metadata<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：LoadBalancerProperties.java:37</span> |
| `ypbin.cloud.loadbalancer.version-headers` | `string>` | — | 请求头中的灰度版本名，按顺序取第一个非空值<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：LoadBalancerProperties.java:40</span> |
| `ypbin.cloud.loadbalancer.weight-metadata-key` | `string` | weight | 服务实例 metadata 中保存权重的 key<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：LoadBalancerProperties.java:46</span> |
| `spring.cloud.nacos.discovery.metadata.<metadata-key>` | `string` | — | 当前服务版本写入 Nacos metadata 的动态标准键。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：LoadBalancerEnvironmentPostProcessor.java:56</span> |

</div>


## ypbin-starter-cloud-nacos


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `ypbin.cloud.nacos.application-description` | `string` | — | 应用描述兜底值；为空时不注入 info.desc。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：NacosProperties.java:47 · additional-spring-configuration-metadata.json:1</span> |
| `ypbin.cloud.nacos.application-name` | `string` | — | 应用名兜底值；为空时不注入 spring.application.name。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：NacosProperties.java:44 · additional-spring-configuration-metadata.json:1</span> |
| `ypbin.cloud.nacos.bean-definition-overriding-enabled` | `boolean` | false | 是否允许 Bean 覆盖；默认不开启，避免掩盖重复 Bean 问题。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：NacosProperties.java:80 · additional-spring-configuration-metadata.json:1</span> |
| `ypbin.cloud.nacos.config-file-extension` | `string` | yaml | Nacos 配置文件后缀。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：NacosProperties.java:62 · additional-spring-configuration-metadata.json:1</span> |
| `ypbin.cloud.nacos.config-import` | `string` | — | 显式指定 Nacos ConfigData 导入地址；为空时按 prefix/profile/applicationName 自动生成。<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：—<br><span class="cfg-src">来源：NacosProperties.java:56 · additional-spring-configuration-metadata.json:1</span> |
| `ypbin.cloud.nacos.config-import-check-enabled` | `boolean` | false | Nacos config import 检查开关。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：NacosProperties.java:71 · additional-spring-configuration-metadata.json:1</span> |
| `ypbin.cloud.nacos.config-import-enabled` | `boolean` | true | 是否注入 Nacos ConfigData 导入默认值。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：NacosProperties.java:53 · additional-spring-configuration-metadata.json:1</span> |
| `ypbin.cloud.nacos.config-prefix` | `string` | application | Nacos 公共配置前缀。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：NacosProperties.java:59 · additional-spring-configuration-metadata.json:1</span> |
| `ypbin.cloud.nacos.default-profile` | `string` | dev | 默认 profile；仅在无 active profile 时以低优先级写入 spring.profiles.default。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：NacosProperties.java:38 · additional-spring-configuration-metadata.json:1</span> |
| `ypbin.cloud.nacos.default-profile-enabled` | `boolean` | true | 无 active profile 时是否注入默认 profile。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：NacosProperties.java:35 · additional-spring-configuration-metadata.json:1</span> |
| `ypbin.cloud.nacos.enabled` | `boolean` | true | 是否启用 Nacos 启动增强。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：NacosProperties.java:32 · additional-spring-configuration-metadata.json:1 · NacosAutoConfiguration.java:32</span> |
| `ypbin.cloud.nacos.fail-on-multiple-preset-profiles` | `boolean` | true | 是否禁止 dev/test/prod 同时激活。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：NacosProperties.java:41 · additional-spring-configuration-metadata.json:1</span> |
| `ypbin.cloud.nacos.include-application-profile-config` | `boolean` | true | 是否加载应用 profile 级配置，如 order-service-dev.yaml。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：NacosProperties.java:68 · additional-spring-configuration-metadata.json:1</span> |
| `ypbin.cloud.nacos.include-profile-config` | `boolean` | true | 是否加载 profile 级配置，如 application-dev.yaml。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：NacosProperties.java:65 · additional-spring-configuration-metadata.json:1</span> |
| `ypbin.cloud.nacos.logging-default-config-enabled` | `boolean` | false | 是否启用 Nacos 默认日志配置。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：NacosProperties.java:74 · additional-spring-configuration-metadata.json:1</span> |
| `ypbin.cloud.nacos.management-info-process-enabled` | `boolean` | true | 是否开启 Actuator process info。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：NacosProperties.java:77 · additional-spring-configuration-metadata.json:1</span> |
| `ypbin.cloud.nacos.service-version` | `string` | — | 服务版本兜底值；为空时不注入 info.version。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：NacosProperties.java:50 · additional-spring-configuration-metadata.json:1</span> |
| `spring.application.name` | `string` | — | 服务名；影响 Nacos 注册和应用级配置 DataId。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：NacosEnvironmentPostProcessor.java:48</span> |
| `spring.profiles.active` | `string` | — | 显式激活的环境 profile。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：NacosEnvironmentPostProcessor.java:50</span> |
| `spring.profiles.default` | `string` | dev | 无 active profile 时的默认环境；可由 ypbin.cloud.nacos.default-profile 控制。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：NacosEnvironmentPostProcessor.java:52</span> |
| `spring.config.import` | `string` | 自动生成 optional:nacos:... | ConfigData 导入列表；宿主显式配置时优先。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：NacosEnvironmentPostProcessor.java:46</span> |
| `spring.cloud.nacos.discovery.server-addr` | `string` | — | Nacos 注册发现服务地址。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：MODULES.md:1558</span> |
| `spring.cloud.nacos.config.server-addr` | `string` | — | Nacos 配置中心服务地址。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：MODULES.md:1558</span> |
| `spring.cloud.nacos.config.import-check.enabled` | `boolean` | false | Nacos ConfigData import 检查开关。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：NacosEnvironmentPostProcessor.java:54</span> |
| `nacos.logging.default.config.enabled` | `boolean` | false | 是否启用 Nacos 默认日志配置。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：NacosEnvironmentPostProcessor.java:70</span> |
| `management.info.process.enabled` | `boolean` | true | 是否暴露 Actuator process info。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：NacosEnvironmentPostProcessor.java:72</span> |
| `spring.main.allow-bean-definition-overriding` | `boolean` | false | 是否允许同名 Bean 覆盖。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：NacosEnvironmentPostProcessor.java:74</span> |
| `info.desc` | `string` | — | Actuator 应用描述，可由 ypbin.cloud.nacos.application-description 注入。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：NacosEnvironmentPostProcessor.java:101</span> |
| `info.version` | `string` | — | Actuator 服务版本，可由 ypbin.cloud.nacos.service-version 注入。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：NacosEnvironmentPostProcessor.java:105</span> |

</div>


## ypbin-starter-cloud-observability


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `ypbin.observability.enabled` | `boolean` | true | 是否启用可观测性（X-Request-Id 与 MDC 关联），默认开启<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：ObservabilityProperties.java:30 · ObservabilityAutoConfiguration.java:43</span> |
| `ypbin.observability.mdc-key` | `string` | requestId | 写入 MDC 的键名，日志 pattern 可引用<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：ObservabilityProperties.java:36</span> |
| `ypbin.observability.request-id-header` | `string` | X-Request-Id | 请求 ID 请求头名称，与网关 RequestId 保持一致<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：ObservabilityProperties.java:33</span> |
| `logging.pattern.level` | `string` | — | 日志级别 pattern；可引用 MDC requestId。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：MODULES.md:1734</span> |
| `management.tracing.sampling.probability` | `double` | — | 分布式追踪采样概率，范围 0.0 到 1.0。<br>可选值：0.0..1.0<br><strong>注意</strong>：—<br><span class="cfg-src">来源：MODULES.md:1763</span> |
| `management.otlp.tracing.endpoint` | `string` | — | OTLP trace 上报端点。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：MODULES.md:1766</span> |

</div>


## ypbin-starter-cloud-sentinel


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `ypbin.cloud.sentinel.block-message` | `string` | 请求过于频繁，请稍后重试 | 被限流时的提示信息<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：SentinelProperties.java:33</span> |
| `ypbin.cloud.sentinel.enabled` | `boolean` | true | 是否启用被限流/降级时的统一 R 响应，默认开启<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：SentinelProperties.java:30 · SentinelAutoConfiguration.java:43</span> |
| `spring.cloud.sentinel.transport.dashboard` | `string` | — | Sentinel Dashboard 地址。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：MODULES.md:1793</span> |
| `spring.cloud.sentinel.datasource.<name>.nacos.*` | `object` | — | Sentinel Nacos 规则源：server-addr、data-id、group-id、rule-type。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：MODULES.md:1795</span> |

</div>


## ypbin-starter-data


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `ypbin.data.db-type` | `dbType` | mysql | 数据库类型，用于分页方言，默认 MySQL<br>可选值：MYSQL / MARIADB / ORACLE / ORACLE&#95;12C / DB2 / H2 / HSQL / SQLITE / POSTGRE&#95;SQL / SQL&#95;SERVER2005 / SQL&#95;SERVER / DM / XU&#95;GU / KINGBASE&#95;ES / PHOENIX / GAUSS / GAUSS&#95;DB / CLICK&#95;HOUSE / GBASE / GBASE&#95;8S / GBASEDBT / GBASE&#95;INFORMIX / GBASE8S&#95;PG / GBASE&#95;8C / SINODB / OSCAR / SYBASE / OCEAN&#95;BASE / FIREBIRD / HIGH&#95;GO / CUBRID / SUNDB / SAP&#95;HANA / IMPALA / VERTICA / XCloud / REDSHIFT / OPENGAUSS / TDENGINE / INFORMIX / UXDB / LEALONE / TRINO / PRESTO / DERBY / VASTBASE / GOLDENDB / DUCKDB / YASDB / HIVE2 / OTHER<br><strong>注意</strong>：—<br><span class="cfg-src">来源：DataProperties.java:35</span> |
| `ypbin.data.enabled` | `boolean` | true | 是否启用数据增强，默认开启<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：DataProperties.java:32 · DataAutoConfiguration.java:53</span> |
| `ypbin.data.encrypt.key` | `string` | — | AES 密钥，长度需为 16/24/32 字节。配置后才装配默认字段加密器<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。<br><span class="cfg-src">来源：DataProperties.java:93 · DataAutoConfiguration.java:127</span> |
| `ypbin.data.max-limit` | `long` | 500 | 单页最大条数限制，防止恶意超大分页，-1 表示不限制<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：—<br><span class="cfg-src">来源：DataProperties.java:38</span> |
| `ypbin.data.overflow` | `boolean` | false | 溢出总页数后是否进行处理（跳回首页）<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：DataProperties.java:41</span> |
| `spring.datasource.url` | `string` | — | JDBC 数据源连接地址；数据模块执行数据库访问时由宿主配置。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：pom.xml:1</span> |
| `spring.datasource.username` | `string` | — | JDBC 数据库用户名。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：pom.xml:1</span> |
| `spring.datasource.password` | `string` | — | JDBC 数据库密码。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：pom.xml:1</span> |
| `mybatis-plus.global-config.banner` | `boolean` | false | 是否打印 MyBatis-Plus banner；starter 低优先级关闭。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：DataDefaultsEnvironmentPostProcessor.java:47</span> |
| `mybatis-plus.global-config.db-config.id-type` | `idType` | — | 宿主需要覆盖默认雪花 ID 策略时配置。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：MODULES.md:86</span> |

</div>


## ypbin-starter-extension-datapermission


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `ypbin.data-permission.enabled` | `boolean` | — | 自动装配条件开关。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：DataPermissionAutoConfiguration.java:49</span> |

</div>


## ypbin-starter-extension-tenant


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `ypbin.tenant.column` | `string` | tenant&#95;id | 租户字段列名<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：TenantProperties.java:35</span> |
| `ypbin.tenant.enabled` | `boolean` | false | 是否启用多租户，默认关闭（需显式开启）<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：TenantProperties.java:32 · TenantAutoConfiguration.java:49</span> |
| `ypbin.tenant.ignore-tables` | `string>` | — | 忽略租户隔离的表（这些表不追加租户条件）<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：TenantProperties.java:38</span> |

</div>


## ypbin-starter-i18n


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `ypbin.i18n.default-locale` | `string` | zh&#95;CN | 默认语言标签（如 zh&#95;CN / en&#95;US），为空则用系统默认<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：I18nProperties.java:39</span> |
| `ypbin.i18n.enabled` | `boolean` | true | 是否启用国际化，默认开启<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：I18nProperties.java:30 · I18nAutoConfiguration.java:42</span> |
| `ypbin.i18n.header-name` | `string` | Accept-Language | 从请求头取语言的头名<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：I18nProperties.java:36</span> |
| `ypbin.i18n.param-name` | `string` | lang | 从请求参数取语言的参数名（如 ?lang=en&#95;US）<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：I18nProperties.java:33</span> |
| `spring.messages.basename` | `string` | messages | 国际化资源 basename。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：MODULES.md:1375</span> |

</div>


## ypbin-starter-job


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `ypbin.job.enabled` | `boolean` | true | 是否启用定时任务调度，默认开启<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：JobProperties.java:30 · JobAutoConfiguration.java:51</span> |
| `ypbin.job.pool-size` | `integer` | 4 | 调度线程池大小<br>可选值：正整数<br><strong>注意</strong>：—<br><span class="cfg-src">来源：JobProperties.java:33</span> |
| `ypbin.job.thread-name-prefix` | `string` | ypbin-job- | 线程名前缀<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：JobProperties.java:36</span> |

</div>


## ypbin-starter-json


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `ypbin.json.date-format` | `string` | yyyy-MM-dd | 日期格式<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：JacksonProperties.java:42</span> |
| `ypbin.json.date-time-format` | `string` | yyyy-MM-dd HH:mm:ss | 日期时间格式<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：JacksonProperties.java:39</span> |
| `ypbin.json.enabled` | `boolean` | true | 是否启用统一 Jackson 定制，默认开启<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：JacksonProperties.java:30 · JacksonAutoConfiguration.java:77</span> |
| `ypbin.json.ref-text.auto-resolve` | `boolean` | true | 是否自动预加载（拦截响应体在序列化前批量翻译，业务无需手动 preload），默认开启<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：JacksonProperties.java:110 · JacksonAutoConfiguration.java:175</span> |
| `ypbin.json.ref-text.max-size` | `integer` | 10000 | 缓存容量上限（条），超出触发清理，仍满则不再写入，默认 1 万<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：—<br><span class="cfg-src">来源：JacksonProperties.java:107</span> |
| `ypbin.json.ref-text.ttl-seconds` | `long` | 300 | 翻译结果缓存有效期（秒），默认 5 分钟<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：—<br><span class="cfg-src">来源：JacksonProperties.java:104</span> |
| `ypbin.json.time-format` | `string` | HH:mm:ss | 时间格式<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：JacksonProperties.java:45</span> |
| `ypbin.json.write-big-number-as-string` | `boolean` | true | 是否将 Long / BigInteger / BigDecimal 序列化为字符串，规避前端 JS 大数精度丢失。 默认开启。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：JacksonProperties.java:36</span> |

</div>


## ypbin-starter-license


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `ypbin.license.allow-startup-without-license` | `boolean` | false | 无授权文件时是否允许启动。 默认 false：缺授权即启动失败并暴露原因，避免「以为受保护实则裸奔」。 置为 true 可在无授权文件时以「非法不可用」状态启动，受保护能力被拦截、非保护能力照常， 适用于先启动后补授权的交付流程。<br>可选值：—<br><strong>注意</strong>：开启后无授权也可启动，但受保护能力仍不可用；必须确保保护注解覆盖完整。<br><span class="cfg-src">来源：LicenseProperties.java:53</span> |
| `ypbin.license.enabled` | `boolean` | true | 是否启用授权校验，默认开启<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：LicenseProperties.java:32 · LicenseAutoConfiguration.java:58</span> |
| `ypbin.license.fingerprint-enabled` | `boolean` | true | 是否启用机器指纹绑定校验，默认开启<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：LicenseProperties.java:44</span> |
| `ypbin.license.location` | `string` | ./license.dat | 授权文件路径：默认文件存储实现从此读取授权串<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：LicenseProperties.java:41</span> |
| `ypbin.license.online.access-key` | `string` | — | 开放应用 Access Key（公开标识，与签发端应用管理注册的应用一致）<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。<br><span class="cfg-src">来源：LicenseProperties.java:129</span> |
| `ypbin.license.online.base-url` | `string` | — | 联机校验服务根地址（如 http&#58;//license-admin:8080）；为空则不装配联机校验<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：LicenseProperties.java:126 · LicenseAutoConfiguration.java:130</span> |
| `ypbin.license.online.cache-seconds` | `long` | 3600 | 联机校验缓存窗口（秒）：最近一次服务端明确返回有效后，窗口内不再重复联机校验， 避免 @LicenseCheck(online=true) 每次方法调用都发 HTTP。吊销感知延迟 ≤ 缓存窗口， 默认 1 小时。<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：—<br><span class="cfg-src">来源：LicenseProperties.java:145</span> |
| `ypbin.license.online.fail-open-backoff-seconds` | `long` | 300 | 退避窗口（秒）：连续放行次数达到 {@link #failOpenThreshold} 后使用的更长窗口，默认 5 分钟， 进一步降低对故障中的联机服务的调用频率。<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：—<br><span class="cfg-src">来源：LicenseProperties.java:164</span> |
| `ypbin.license.online.fail-open-cache-seconds` | `long` | 60 | 放行窗口（秒）：网络异常/HTTP 非 200/响应解析失败/valid 字段缺失或非布尔等「放行但不明确 有效」结果，进入这个短窗口，窗口内不再重复联机（防止联机服务不可用时被高频调用打爆），默认 1 分钟。 与 {@link #cacheSeconds} 是两套独立窗口：只有服务端明确返回有效才用长窗口，放行永远只用这个短窗口。<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：—<br><span class="cfg-src">来源：LicenseProperties.java:152</span> |
| `ypbin.license.online.fail-open-threshold` | `integer` | 5 | 连续放行次数阈值：达到该阈值后放行窗口升级为 {@link #failOpenBackoffSeconds}（更长）， 默认 5 次。服务端任意一次明确返回（有效或无效）都会重置计数——只有「连续不可达/异常」才升级退避。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：LicenseProperties.java:158</span> |
| `ypbin.license.online.failure-policy` | `remoteFailurePolicy` | fail-open-with-warning | 联机服务无法明确裁决时的处理策略<br>可选值：FAIL&#95;CLOSED / FAIL&#95;OPEN&#95;WITH&#95;WARNING<br><strong>注意</strong>：FAIL&#95;OPEN&#95;WITH&#95;WARNING 会在联机服务异常时临时放行，必须配套监控告警。<br><span class="cfg-src">来源：LicenseProperties.java:138</span> |
| `ypbin.license.online.secret-key` | `string` | — | 开放应用 Secret Key（私有密钥，参与请求签名，不下发）<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。<br><span class="cfg-src">来源：LicenseProperties.java:38</span> |
| `ypbin.license.online.timeout` | `duration` | 5s | 单次联机校验超时时间<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：—<br><span class="cfg-src">来源：LicenseProperties.java:135</span> |
| `ypbin.license.public-key` | `string` | — | SM2 公钥（Base64）：运行端仅需公钥用于验签，私钥仅在供应方签发端持有<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。<br><span class="cfg-src">来源：LicenseProperties.java:35</span> |
| `ypbin.license.secret-key` | `string` | — | SM4 密钥（Base64，16 字节）：授权文件对称加解密密钥<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。<br><span class="cfg-src">来源：LicenseProperties.java:38</span> |

</div>


## ypbin-starter-log


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `ypbin.log.access.enabled` | `boolean` | false | 是否启用全量访问日志切面，默认关闭（与 @Log 注解版互补，按需开启）<br>可选值：—<br><strong>注意</strong>：请求体、响应体和请求头可能包含凭据或个人信息，生产环境需掩码并控制留存。<br><span class="cfg-src">来源：AccessLogProperties.java:32 · AccessLogAutoConfiguration.java:44</span> |
| `ypbin.log.access.exclude-path-patterns` | `string>` | — | 排除路径（静态资源、健康检查等）<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：AccessLogProperties.java:35</span> |
| `ypbin.log.access.mask-headers` | `string>` | — | 敏感请求头关键字（头名小写包含即掩码值），默认掩码授权/会话相关头<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：AccessLogProperties.java:38</span> |
| `ypbin.log.enabled` | `boolean` | true | 是否启用操作日志，默认开启<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：LogProperties.java:32 · LogAutoConfiguration.java:55</span> |
| `ypbin.log.includes` | `include>` | — | 全局默认采集项，为空时使用 Include<br>可选值：REQUEST&#95;HEADERS / REQUEST&#95;BODY / REQUEST&#95;PARAM / RESPONSE&#95;HEADERS / RESPONSE&#95;BODY / IP / BROWSER / OS / CLIENT<br><strong>注意</strong>：请求体、响应体和请求头可能包含凭据或个人信息，生产环境需掩码并控制留存。<br><span class="cfg-src">来源：LogProperties.java:35</span> |

</div>


## ypbin-starter-messaging


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `ypbin.mail.default-encoding` | `string` | UTF-8 | 编码<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：MailConfig.java:64</span> |
| `ypbin.mail.from` | `string` | — | 发件人邮箱，为空时取 {@link #username}<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：MailConfig.java:49</span> |
| `ypbin.mail.from-name` | `string` | — | 发件人显示名，可空<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：MailConfig.java:52</span> |
| `ypbin.mail.host` | `string` | — | SMTP 服务器地址<br><strong>必填：使用配置文件版邮件发送时必填。</strong><br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：MailConfig.java:37</span> |
| `ypbin.mail.password` | `string` | — | 密码/授权码<br><strong>必填：服务要求认证时必填。</strong><br>可选值：—<br><strong>注意</strong>：使用环境变量或密钥服务，禁止提交明文。 / 敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。<br><span class="cfg-src">来源：MailConfig.java:46</span> |
| `ypbin.mail.port` | `integer` | 465 | SMTP 端口<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：—<br><span class="cfg-src">来源：MailConfig.java:40</span> |
| `ypbin.mail.protocol` | `string` | smtp | 协议，默认 smtp<br>可选值：smtp / smtps<br><strong>注意</strong>：—<br><span class="cfg-src">来源：MailConfig.java:55</span> |
| `ypbin.mail.ssl-enabled` | `boolean` | true | 是否启用 SSL<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：MailConfig.java:58</span> |
| `ypbin.mail.starttls-enabled` | `boolean` | false | 是否启用 STARTTLS<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：MailConfig.java:61</span> |
| `ypbin.mail.timeout` | `integer` | 10000 | 连接/读取超时（毫秒）<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：—<br><span class="cfg-src">来源：MailConfig.java:67</span> |
| `ypbin.mail.username` | `string` | — | 账号<br><strong>必填：使用配置文件版邮件发送时必填。</strong><br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：MailConfig.java:43</span> |
| `ypbin.mqtt.automatic-reconnect` | `boolean` | true | 是否自动重连<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：MqttProperties.java:57</span> |
| `ypbin.mqtt.clean-session` | `boolean` | true | 是否清除会话（false 时 broker 保留会话与离线消息，配合 QoS≥1 实现可靠投递）<br>可选值：—<br><strong>注意</strong>：可靠投递需结合 clean-session=false、QoS 1/2、持久化目录和 Broker 会话策略。<br><span class="cfg-src">来源：MqttProperties.java:51</span> |
| `ypbin.mqtt.client-id` | `string` | — | 客户端 ID（为空则自动生成）<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：MqttProperties.java:36</span> |
| `ypbin.mqtt.connection-timeout` | `integer` | 10 | 连接超时（秒）<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：—<br><span class="cfg-src">来源：MqttProperties.java:45</span> |
| `ypbin.mqtt.default-qos` | `integer` | 1 | 默认发布 QoS（0/1/2）<br>可选值：0 / 1 / 2<br><strong>注意</strong>：—<br><span class="cfg-src">来源：MqttProperties.java:54</span> |
| `ypbin.mqtt.enabled` | `boolean` | false | 是否启用 MQTT，默认关闭（需显式开启）<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：MqttProperties.java:30 · MqttAutoConfiguration.java:50</span> |
| `ypbin.mqtt.keep-alive-interval` | `integer` | 60 | 心跳间隔（秒）<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：MqttProperties.java:48</span> |
| `ypbin.mqtt.max-inflight` | `integer` | 10 | 最大在途（未确认）消息数，QoS1/2 高吞吐时调大。注意不可设为 0（会阻塞所有 QoS≥1 发布）<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：—<br><span class="cfg-src">来源：MqttProperties.java:63</span> |
| `ypbin.mqtt.max-reconnect-delay` | `integer` | 30000 | 自动重连的最大间隔（毫秒），指数退避的上限<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：MqttProperties.java:60</span> |
| `ypbin.mqtt.password` | `string` | — | 密码<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。<br><span class="cfg-src">来源：MqttProperties.java:42</span> |
| `ypbin.mqtt.persistence-dir` | `string` | — | 消息持久化目录。配置后用文件持久化（进程重启后 QoS1/2 未确认消息不丢）， 为空则用内存持久化（重启丢失）。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：MqttProperties.java:69</span> |
| `ypbin.mqtt.url` | `string` | — | Broker 地址，如 tcp&#58;//127.0.0.1:1883<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：MqttProperties.java:33</span> |
| `ypbin.mqtt.username` | `string` | — | 用户名<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：MqttProperties.java:39</span> |
| `ypbin.sse.enabled` | `boolean` | false | 是否启用 SSE 实时推送。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：SseProperties.java:30 · additional-spring-configuration-metadata.json:1 · SseAutoConfiguration.java:62 · SecuritySseAutoConfiguration.java:76</span> |
| `ypbin.sse.heartbeat-interval-seconds` | `long` | 30 | 心跳间隔（秒），默认 30。定期向连接发送 : ping 注释帧，保活中间代理并尽早暴露死连接 （发送失败即回收）。0 表示关闭心跳。<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：—<br><span class="cfg-src">来源：SseProperties.java:57</span> |
| `ypbin.sse.path` | `string` | /ypbin/sse/subscribe | 内置订阅端点路径。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：SseProperties.java:36 · additional-spring-configuration-metadata.json:1</span> |
| `ypbin.sse.register-endpoint` | `boolean` | true | 是否注册内置订阅端点（生产建议关闭并自建带鉴权的端点）。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：SseProperties.java:33 · additional-spring-configuration-metadata.json:1 · SseAutoConfiguration.java:120 · SseAutoConfiguration.java:133</span> |
| `ypbin.sse.ticket-path` | `string` | /ypbin/sse/ticket | 一次性订阅票据签发端点路径（Header 令牌鉴权场景：先换票再用 ticket 订阅）<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：SseProperties.java:39</span> |
| `ypbin.sse.ticket-ttl-seconds` | `long` | 30 | 一次性订阅票据有效期（秒），换票后应尽快用于订阅<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：—<br><span class="cfg-src">来源：SseProperties.java:42</span> |
| `ypbin.sse.timeout` | `long` | 0 | SSE 连接总超时，单位毫秒；0 表示不超时，由心跳负责保活与死连接检测。<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：—<br><span class="cfg-src">来源：SseProperties.java:51 · SseProperties.java:51 · additional-spring-configuration-metadata.json:1</span> |
| `ypbin.websocket.allowed-origin-patterns` | `string` | &#42; | 允许跨域的来源模式<br>可选值：—<br><strong>注意</strong>：默认 &#42; 适合开发，生产环境应收敛为可信域名。<br><span class="cfg-src">来源：WebSocketProperties.java:42</span> |
| `ypbin.websocket.application-prefix` | `string` | /app | 客户端订阅目的地前缀<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：WebSocketProperties.java:36</span> |
| `ypbin.websocket.broker-prefix` | `string` | /topic | 广播消息目的地前缀<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：WebSocketProperties.java:39</span> |
| `ypbin.websocket.enabled` | `boolean` | false | 是否启用 WebSocket，默认关闭（需显式开启）<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：WebSocketProperties.java:30 · WebSocketAutoConfiguration.java:44</span> |
| `ypbin.websocket.endpoint` | `string` | /ws | STOMP 端点路径<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：WebSocketProperties.java:33</span> |
| `ypbin.websocket.heartbeat-client` | `long` | 10000 | 期望客户端心跳间隔（毫秒），0 表示不要求<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：WebSocketProperties.java:48</span> |
| `ypbin.websocket.heartbeat-server` | `long` | 10000 | 服务端心跳发送间隔（毫秒），0 表示不发送。用于保活与探测半开连接<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：WebSocketProperties.java:45</span> |
| `sms.is-print` | `boolean` | false | sms4j 是否仅打印短信而不真实发送；starter 默认关闭打印模式。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：SmsDefaultsEnvironmentPostProcessor.java:47</span> |
| `sms.blends.<config-id>.*` | `object` | — | sms4j 厂商配置：supplier、access-key-id、access-key-secret、signature、template-id 等。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：MODULES.md:1173</span> |

</div>


## ypbin-starter-security


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `ypbin.security.client-enabled` | `boolean` | true | 是否启用客户端校验，默认开启<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：SecurityProperties.java:51</span> |
| `ypbin.security.clients` | `loginClient>` | [object Object] | 配置文件客户端列表；业务方提供 LoginClientProvider 后可由数据库接管<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：SecurityProperties.java:57</span> |
| `ypbin.security.clients[].active-timeout` | `long` | — | Token 活跃超时秒数；空时继承 Sa-Token 全局配置。<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：—<br><span class="cfg-src">来源：LoginClient.java:56</span> |
| `ypbin.security.clients[].auth-types` | `string>` | — | 允许的认证方式集合。<br>可选值：ACCOUNT / PHONE / EMAIL / SOCIAL<br><strong>注意</strong>：—<br><span class="cfg-src">来源：LoginClient.java:50</span> |
| `ypbin.security.clients[].client-id` | `string` | — | 客户端唯一 ID。<br><strong>必填：配置该客户端条目时必填。</strong><br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：LoginClient.java:41</span> |
| `ypbin.security.clients[].client-secret` | `string` | — | 客户端密钥；浏览器端可为空，服务端或开放平台可启用。<br><strong>必填：启用客户端密钥校验时必填。</strong><br>可选值：—<br><strong>注意</strong>：不要提交明文密钥；使用环境变量或密钥管理服务。 / 敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。<br><span class="cfg-src">来源：LoginClient.java:44</span> |
| `ypbin.security.clients[].client-type` | `string` | WEB | 客户端类型。<br>可选值：WEB / APP / MINI / API<br><strong>注意</strong>：—<br><span class="cfg-src">来源：LoginClient.java:47</span> |
| `ypbin.security.clients[].concurrent` | `boolean` | — | 是否允许同账号多端同时登录；空时继承 Sa-Token。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：LoginClient.java:59</span> |
| `ypbin.security.clients[].enabled` | `boolean` | true | 是否启用该客户端。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：LoginClient.java:83</span> |
| `ypbin.security.clients[].lasting-cookie` | `boolean` | — | 是否使用持久 Cookie；空时继承 Sa-Token。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：LoginClient.java:77</span> |
| `ypbin.security.clients[].max-login-count` | `integer` | — | 同账号最大登录数量；空时继承 Sa-Token，-1 通常表示不限制。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：LoginClient.java:65</span> |
| `ypbin.security.clients[].overflow-logout-mode` | `saLogoutMode` | — | 超过最大登录数时的下线方式；空时继承 Sa-Token。<br>可选值：LOGOUT / KICKOUT / REPLACED<br><strong>注意</strong>：—<br><span class="cfg-src">来源：LoginClient.java:74</span> |
| `ypbin.security.clients[].replaced-login-exit-mode` | `saReplacedLoginExitMode` | — | 并发关闭时新旧设备谁放弃会话；空时继承 Sa-Token。<br>可选值：OLD&#95;DEVICE / NEW&#95;DEVICE<br><strong>注意</strong>：—<br><span class="cfg-src">来源：LoginClient.java:71</span> |
| `ypbin.security.clients[].replaced-range` | `saReplacedRange` | — | 顶人下线范围；空时继承 Sa-Token。<br>可选值：CURR&#95;DEVICE&#95;TYPE / ALL&#95;DEVICE&#95;TYPE<br><strong>注意</strong>：—<br><span class="cfg-src">来源：LoginClient.java:68</span> |
| `ypbin.security.clients[].share` | `boolean` | — | 多端登录是否共享 Token；空时继承 Sa-Token。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：LoginClient.java:62</span> |
| `ypbin.security.clients[].timeout` | `long` | — | Token 固定有效期秒数；空时继承 Sa-Token 全局配置。<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：—<br><span class="cfg-src">来源：LoginClient.java:53</span> |
| `ypbin.security.clients[].write-header` | `boolean` | — | 登录后是否将 Token 写入响应头；空时继承 Sa-Token。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：LoginClient.java:80</span> |
| `ypbin.security.default-client-id` | `string` | web-admin | 默认客户端 ID，登录请求未传 clientId 时使用<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：SecurityProperties.java:54</span> |
| `ypbin.security.enabled` | `boolean` | true | 是否启用安全模块。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：SecurityProperties.java:36 · additional-spring-configuration-metadata.json:1 · SecurityAuditorAutoConfiguration.java:44 · SecurityAutoConfiguration.java:72 · SecurityLogClientAutoConfiguration.java:46 · SecuritySseAutoConfiguration.java:52</span> |
| `ypbin.security.exclude-api-doc` | `boolean` | true | 检测到 SpringDoc 时是否自动放行 Swagger/文档相关路径。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：SecurityProperties.java:48 · additional-spring-configuration-metadata.json:1</span> |
| `ypbin.security.excludes` | `string>` | — | 放行路径（无需登录即可访问），支持 Ant 风格<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：SecurityProperties.java:45</span> |
| `ypbin.security.includes` | `string>` | — | 拦截路径，默认拦截全部<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：SecurityProperties.java:42</span> |
| `ypbin.security.interceptor` | `boolean` | true | 是否注册全局登录校验拦截器（SaInterceptor）。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：SecurityProperties.java:39 · additional-spring-configuration-metadata.json:1 · SecurityAutoConfiguration.java:215</span> |
| `ypbin.security.password` | `passwordPolicy` | — | 密码安全策略；业务方提供 PasswordPolicyProvider 后可由配置中心/数据库接管<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。<br><span class="cfg-src">来源：SecurityProperties.java:60</span> |
| `ypbin.security.password.allow-contain-username` | `boolean` | false | 是否允许密码包含用户名及其反序。<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。<br><span class="cfg-src">来源：PasswordPolicy.java:58</span> |
| `ypbin.security.password.error-lock-count` | `integer` | 5 | 登录错误锁定阈值；0 表示不锁定。<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。<br><span class="cfg-src">来源：PasswordPolicy.java:61</span> |
| `ypbin.security.password.expiration-days` | `integer` | 0 | 密码有效期天数；0 表示永不过期。<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。<br><span class="cfg-src">来源：PasswordPolicy.java:67</span> |
| `ypbin.security.password.expiration-warning-days` | `integer` | 0 | 密码到期提醒天数；0 表示不提醒。<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。<br><span class="cfg-src">来源：PasswordPolicy.java:70</span> |
| `ypbin.security.password.history-count` | `integer` | 0 | 历史密码不可重复次数；0 表示不校验。<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。<br><span class="cfg-src">来源：PasswordPolicy.java:73</span> |
| `ypbin.security.password.lock-minutes` | `integer` | 15 | 账号锁定时长，单位分钟。<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。<br><span class="cfg-src">来源：PasswordPolicy.java:64</span> |
| `ypbin.security.password.max-length` | `integer` | 32 | 密码最大长度。<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。<br><span class="cfg-src">来源：PasswordPolicy.java:40</span> |
| `ypbin.security.password.min-length` | `integer` | 8 | 密码最小长度。<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。<br><span class="cfg-src">来源：PasswordPolicy.java:37</span> |
| `ypbin.security.password.require-digit` | `boolean` | true | 是否必须包含数字。<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。<br><span class="cfg-src">来源：PasswordPolicy.java:43</span> |
| `ypbin.security.password.require-letter` | `boolean` | true | 是否必须包含字母。<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。<br><span class="cfg-src">来源：PasswordPolicy.java:46</span> |
| `ypbin.security.password.require-lowercase` | `boolean` | false | 是否必须包含小写字母。<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。<br><span class="cfg-src">来源：PasswordPolicy.java:52</span> |
| `ypbin.security.password.require-symbol` | `boolean` | false | 是否必须包含特殊字符。<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。<br><span class="cfg-src">来源：PasswordPolicy.java:55</span> |
| `ypbin.security.password.require-uppercase` | `boolean` | false | 是否必须包含大写字母。<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。<br><span class="cfg-src">来源：PasswordPolicy.java:49</span> |
| `sa-token.timeout` | `long` | 2592000 | Sa-Token 固定有效期秒数。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：MODULES.md:345</span> |
| `sa-token.active-timeout` | `long` | 1800 | Sa-Token 活跃超时秒数。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：MODULES.md:346</span> |
| `sa-token.auto-renew` | `boolean` | true | 是否自动续签活跃 Token。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：MODULES.md:347</span> |

</div>


## ypbin-starter-sensitive-words


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `ypbin.sensitive-words.enabled` | `boolean` | true | 是否启用敏感词过滤，默认开启<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：SensitiveWordProperties.java:32 · SensitiveWordAutoConfiguration.java:41</span> |
| `ypbin.sensitive-words.replacement` | `character` | &#42; | 替换字符<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：SensitiveWordProperties.java:38</span> |
| `ypbin.sensitive-words.words` | `string>` | — | 静态敏感词库（当未提供 SensitiveWordProvider 时使用）<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：SensitiveWordProperties.java:35</span> |

</div>


## ypbin-starter-sign


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `ypbin.sign.algorithm` | `signAlgorithm` | hmac-sha256 | 签名算法，默认 HMAC-SHA256<br>可选值：MD5 / HMAC&#95;SHA256<br><strong>注意</strong>：—<br><span class="cfg-src">来源：SignProperties.java:40</span> |
| `ypbin.sign.apps` | `signProperties$AppInfo>` | — | 应用列表<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：SignProperties.java:49</span> |
| `ypbin.sign.apps[].access-key` | `string` | — | 应用 Access Key。<br><strong>必填：配置该签名应用时必填。</strong><br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。<br><span class="cfg-src">来源：SignProperties.java:132</span> |
| `ypbin.sign.apps[].app-name` | `string` | — | 应用名称。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：SignProperties.java:136</span> |
| `ypbin.sign.apps[].enabled` | `boolean` | true | 是否启用该应用。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：SignProperties.java:34</span> |
| `ypbin.sign.apps[].expire-time` | `localDateTime` | — | 失效时间；空表示永不过期。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：SignProperties.java:138</span> |
| `ypbin.sign.apps[].secret-key` | `string` | — | 应用 Secret Key。<br><strong>必填：配置该签名应用时必填。</strong><br>可选值：—<br><strong>注意</strong>：必须保密，建议加密存储并支持轮换。 / 敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。<br><span class="cfg-src">来源：SignProperties.java:134</span> |
| `ypbin.sign.enabled` | `boolean` | false | 是否启用签名校验<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：SignProperties.java:34 · SignAutoConfiguration.java:60</span> |
| `ypbin.sign.mode` | `signProperties$Mode` | annotation | 校验模式：ANNOTATION（仅 @ApiSign 接口）或 GLOBAL（全局拦截，按 skip-path 排除）<br>可选值：ANNOTATION / GLOBAL<br><strong>注意</strong>：—<br><span class="cfg-src">来源：SignProperties.java:37</span> |
| `ypbin.sign.replay-protect` | `boolean` | true | 是否启用 nonce 防重放<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：SignProperties.java:46</span> |
| `ypbin.sign.skip-param-names` | `string>` | — | 排除参与签名的参数名<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：SignProperties.java:55</span> |
| `ypbin.sign.skip-path` | `string>` | — | GLOBAL 模式下排除的路径（Ant 风格）<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：SignProperties.java:52</span> |
| `ypbin.sign.timeout` | `long` | 60 | 签名有效期（秒）<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：—<br><span class="cfg-src">来源：SignProperties.java:43</span> |

</div>


## ypbin-starter-social


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `ypbin.social.enabled` | `boolean` | true | 是否启用第三方登录（JustAuth）自动配置。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：spring-configuration-metadata.json:1 · additional-spring-configuration-metadata.json:1 · SocialAutoConfiguration.java:41</span> |

</div>


## ypbin-starter-storage


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `ypbin.storage.default-platform` | `string` | — | 默认存储平台标识<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：StorageProperties.java:38</span> |
| `ypbin.storage.enabled` | `boolean` | true | 是否启用存储模块，默认开启<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：StorageProperties.java:35 · StorageAutoConfiguration.java:56</span> |
| `ypbin.storage.local` | `storageProperties$LocalConfig>` | — | 本地存储源列表<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：StorageProperties.java:44</span> |
| `ypbin.storage.local[].base-path` | `string` | — | 本地存储根目录。<br><strong>必填：启用该本地存储源时必填。</strong><br>可选值：—<br><strong>注意</strong>：目录需限制操作系统权限，避免暴露敏感文件。<br><span class="cfg-src">来源：StorageProperties.java:101</span> |
| `ypbin.storage.local[].domain` | `string` |  | 对外访问域名前缀。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：StorageProperties.java:104</span> |
| `ypbin.storage.local[].enabled` | `boolean` | true | 是否启用该本地存储源。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：StorageProperties.java:35</span> |
| `ypbin.storage.local[].platform` | `string` | — | 本地存储平台唯一标识。<br><strong>必填：配置该存储源时必填。</strong><br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：StorageProperties.java:95</span> |
| `ypbin.storage.max-file-size` | `long` | -1 | 单次上传默认最大字节数，-1 不限制<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：StorageProperties.java:41</span> |
| `ypbin.storage.oss` | `storageProperties$OssConfig>` | — | S3 兼容对象存储源列表<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：StorageProperties.java:47</span> |
| `ypbin.storage.oss[].access-key` | `string` | — | 访问密钥 ID。<br><strong>必填：启用该对象存储源时必填。</strong><br>可选值：—<br><strong>注意</strong>：通过环境变量或密钥管理服务注入。 / 敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。<br><span class="cfg-src">来源：StorageProperties.java:160</span> |
| `ypbin.storage.oss[].bucket` | `string` | — | 桶名。<br><strong>必填：启用该对象存储源时必填。</strong><br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：StorageProperties.java:166</span> |
| `ypbin.storage.oss[].domain` | `string` |  | 自定义访问域名；空时由客户端生成。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：StorageProperties.java:104</span> |
| `ypbin.storage.oss[].enabled` | `boolean` | true | 是否启用该对象存储源。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：StorageProperties.java:35</span> |
| `ypbin.storage.oss[].endpoint` | `string` | — | S3 兼容服务端点。<br><strong>必填：启用该对象存储源时通常必填。</strong><br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：StorageProperties.java:154</span> |
| `ypbin.storage.oss[].path-style-access` | `boolean` | true | 是否使用 path-style 访问；MinIO 等通常需要。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：StorageProperties.java:169</span> |
| `ypbin.storage.oss[].platform` | `string` | — | 对象存储平台唯一标识。<br><strong>必填：配置该存储源时必填。</strong><br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：StorageProperties.java:95</span> |
| `ypbin.storage.oss[].region` | `string` | us-east-1 | 对象存储区域。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：StorageProperties.java:157</span> |
| `ypbin.storage.oss[].secret-key` | `string` | — | 访问密钥。<br><strong>必填：启用该对象存储源时必填。</strong><br>可选值：—<br><strong>注意</strong>：禁止写入仓库或日志。 / 敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。<br><span class="cfg-src">来源：StorageProperties.java:163</span> |
| `spring.servlet.multipart.max-file-size` | `dataSize` | — | Servlet 单文件上传上限；应与 ypbin.storage.max-file-size 协同。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：MODULES.md:579</span> |
| `spring.servlet.multipart.max-request-size` | `dataSize` | — | Servlet 单请求 multipart 总大小上限。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：MODULES.md:579</span> |

</div>


## ypbin-starter-tools


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `ypbin.tools.idempotent.distributed` | `boolean` | true | 幂等存储是否优先使用 Redis 分布式实现（存在 StringRedisTemplate 时生效），否则使用内存兜底。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：spring-configuration-metadata.json:1 · additional-spring-configuration-metadata.json:1 · ToolsAutoConfiguration.java:147</span> |
| `ypbin.tools.idempotent.enabled` | `boolean` | true | 是否启用幂等切面 @Idempotent。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：spring-configuration-metadata.json:1 · additional-spring-configuration-metadata.json:1 · ToolsAutoConfiguration.java:94</span> |
| `ypbin.tools.lock.enabled` | `boolean` | true | 是否启用分布式锁切面 @DistributedLock。存在 Redis 时用分布式锁，否则退化为单机内存锁。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：spring-configuration-metadata.json:1 · additional-spring-configuration-metadata.json:1 · ToolsAutoConfiguration.java:110</span> |
| `ypbin.tools.rate-limit.distributed` | `boolean` | true | 限流存储是否优先使用 Redis 分布式实现（存在 StringRedisTemplate 时生效），否则使用内存兜底。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：spring-configuration-metadata.json:1 · additional-spring-configuration-metadata.json:1 · ToolsAutoConfiguration.java:137</span> |
| `ypbin.tools.rate-limit.enabled` | `boolean` | true | 是否启用限流切面 @RateLimit。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：spring-configuration-metadata.json:1 · additional-spring-configuration-metadata.json:1 · ToolsAutoConfiguration.java:78</span> |
| `ypbin.tools.rate-limit.trust-forwarded` | `boolean` | false | IP 限流键是否信任 X-Forwarded-For 等转发头：false（默认）取真实对端地址（request.getRemoteAddr），防伪造转发头绕过限流；位于可信反向代理之后需显式开启为 true 以按真实客户端 IP 限流。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：RateLimitProperties.java:1</span> |

</div>


## ypbin-starter-web


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `ypbin.web.cors.allow-credentials` | `boolean` | true | 是否允许携带凭证<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：CorsProperties.java:49</span> |
| `ypbin.web.cors.allowed-headers` | `string>` | &#42; | 允许的请求头<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：CorsProperties.java:43</span> |
| `ypbin.web.cors.allowed-methods` | `string>` | &#42; | 允许的请求方法<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：CorsProperties.java:40</span> |
| `ypbin.web.cors.allowed-origin-patterns` | `string>` | &#42; | 允许的来源模式（支持 https&#58;//&#42;.example.com 形式）<br>可选值：—<br><strong>注意</strong>：生产环境避免通配跨域来源；启用凭证时必须使用受控来源。<br><span class="cfg-src">来源：CorsProperties.java:37</span> |
| `ypbin.web.cors.enabled` | `boolean` | false | 是否启用跨域，默认关闭<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：CorsProperties.java:34 · WebAutoConfiguration.java:67</span> |
| `ypbin.web.cors.exposed-headers` | `string>` | — | 暴露给浏览器的响应头<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：CorsProperties.java:46</span> |
| `ypbin.web.cors.max-age` | `long` | 3600 | 预检请求缓存时间（秒）<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：—<br><span class="cfg-src">来源：CorsProperties.java:52</span> |
| `ypbin.web.repeatable-read.enabled` | `boolean` | false | 是否启用可重复读请求过滤器，把带 body 的请求包装为可重复读，供 XSS、签名、日志等下游复用。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：spring-configuration-metadata.json:1 · additional-spring-configuration-metadata.json:1 · WebAutoConfiguration.java:92</span> |
| `ypbin.web.xss.enabled` | `boolean` | false | 是否启用 XSS 过滤，默认关闭（需显式开启）<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：XssProperties.java:32 · WebAutoConfiguration.java:112</span> |
| `ypbin.web.xss.excludes` | `string>` | — | 放行路径（这些路径不做 XSS 清洗），支持 Ant 风格<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：XssProperties.java:35</span> |
| `ypbin.web.repeatable-read.max-body-bytes` | `long` | 10485760 | 单请求可重复读缓存体的最大字节数（默认 10MB，取值范围 (0, 64MB]）；超限请求在过滤器层拒绝缓存并直接返回统一响应（HTTP 200 + code=413），防止超大请求体占满内存。非法配置在装配期即失败。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：RepeatableReadProperties.java:1</span> |
| `spring.mvc.throw-exception-if-no-handler-found` | `boolean` | true | 未匹配处理器时抛出异常，以便统一输出 JSON 404。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：WebDefaultsEnvironmentPostProcessor.java:48</span> |
| `spring.web.resources.add-mappings` | `boolean` | false | 是否启用默认静态资源映射；starter 默认关闭以确保未知路径进入统一 404。<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：WebDefaultsEnvironmentPostProcessor.java:50</span> |

</div>


## ypbin-starter-xxljob


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `ypbin.xxl-job.enabled` | `boolean` | false | 是否启用 XXL-JOB 执行器<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：XxlJobProperties.java:37 · XxlJobAutoConfiguration.java:41</span> |
| `ypbin.xxl-job.admin-addresses` | `string` | — | 调度中心地址（多个逗号分隔）<br><strong>必填：enabled=true 时必须</strong><br>可选值：—<br><strong>注意</strong>：缺失时启动即抛错暴露，禁止静默降级<br><span class="cfg-src">来源：XxlJobProperties.java:40</span> |
| `ypbin.xxl-job.access-token` | `string` |  | 执行器通讯 Token（与 admin 端保持一致，为空则不做校验）<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：XxlJobProperties.java:43</span> |
| `ypbin.xxl-job.appname` | `string` | — | 执行器名称（AppName），admin 端按此注册与路由<br><strong>必填：enabled=true 时必须</strong><br>可选值：—<br><strong>注意</strong>：缺失时启动即抛错暴露，禁止静默降级<br><span class="cfg-src">来源：XxlJobProperties.java:46</span> |
| `ypbin.xxl-job.address` | `string` | — | 执行器注册地址（为空时自动注册本机 IP）<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：XxlJobProperties.java:49</span> |
| `ypbin.xxl-job.ip` | `string` | — | 执行器 IP（为空自动获取）<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：XxlJobProperties.java:52</span> |
| `ypbin.xxl-job.port` | `integer` | 9999 | 执行器端口（执行器与 admin 通讯用）<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：XxlJobProperties.java:55</span> |
| `ypbin.xxl-job.log-path` | `string` | — | 执行器日志保存路径（为空使用默认临时目录）<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：XxlJobProperties.java:58</span> |
| `ypbin.xxl-job.log-retention-days` | `integer` | 30 | 执行器日志保存天数<br>可选值：—<br><strong>注意</strong>：—<br><span class="cfg-src">来源：XxlJobProperties.java:61</span> |

</div>

