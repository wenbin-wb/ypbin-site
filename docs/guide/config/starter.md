---
title: Starter 配置参考
description: ypbin-starter 全量配置项、默认值、启用条件与生产注意。
---

# Starter 配置参考

本页由源码审计数据生成，覆盖 **329** 个配置项，其中 `ypbin.*` 289 项、宿主标准配置 40 项。默认值以源码为准。

## ypbin-starter-ai

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `ypbin.ai.enabled`<br><span class="cfg-src">java.lang.Boolean · AiProperties.java:32 · AiMemoryAutoConfiguration.java:42</span> | true | 是否启用 AI 模块，默认开启<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.ai.chat.enabled`<br><span class="cfg-src">java.lang.Boolean · AiChatProperties.java:34 · AiChatAutoConfiguration.java:61</span> | true | 是否启用对话能力，默认开启<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.ai.chat.default-system-prompt`<br><span class="cfg-src">java.lang.String · AiChatProperties.java:37</span> | 你是一个专业的企业级 AI 助手，请用简洁清晰的中文回答问题。 | 默认系统提示词。使用 DeepSeek/GPT 等模型时作为 system 角色消息注入<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.ai.chat.rag-enabled`<br><span class="cfg-src">java.lang.Boolean · AiChatProperties.java:40</span> | false | 是否在对话中启用 RAG 检索增强（需要同时配置 ypbin.ai.rag.enabled=true）<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.ai.chat.stream-timeout-ms`<br><span class="cfg-src">java.lang.Long · AiChatProperties.java:43</span> | 0 | 流式响应超时（毫秒），0 表示不超时<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.ai.memory.type`<br><span class="cfg-src">java.lang.String · AiMemoryProperties.java:38 · AiMemoryAutoConfiguration.java:69</span> | in-memory | 记忆存储类型：in-memory（默认，重启后丢失）/ jdbc（持久化，需 JDBC 依赖与建表）<br>可选值：in-memory / jdbc<br><strong>注意</strong>：— |
| `ypbin.ai.memory.window-size`<br><span class="cfg-src">java.lang.Integer · AiMemoryProperties.java:41</span> | 20 | 记忆窗口大小（每次请求携带的历史消息条数），默认 20<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.ai.rag.enabled`<br><span class="cfg-src">java.lang.Boolean · AiRagProperties.java:32 · AiRagAutoConfiguration.java:42</span> | false | 是否启用 RAG，默认关闭（需要向量库才有意义）<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.ai.rag.top-k`<br><span class="cfg-src">java.lang.Integer · AiRagProperties.java:35</span> | 5 | 检索最近 TopK 片段，默认 5<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.ai.rag.similarity-threshold`<br><span class="cfg-src">java.lang.Double · AiRagProperties.java:38</span> | 0.7 | 相似度阈值，低于此值的片段不纳入 context，默认 0.7<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.ai.rag.max-context-length`<br><span class="cfg-src">java.lang.Integer · AiRagProperties.java:41</span> | 8000 | 最大 context 长度（字符数），防止超出模型上下文窗口<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.ai.rag.simple-store-path`<br><span class="cfg-src">java.lang.String · AiRagProperties.java:44</span> | — | SimpleVectorStore 序列化文件路径；配置后重启不丢向量（自动加载/保存）<br>可选值：—<br><strong>注意</strong>：— |

## ypbin-starter-api-crypto

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `ypbin.api-crypto.enabled`<br><span class="cfg-src">java.lang.Boolean · ApiCryptoProperties.java:30 · ApiCryptoAutoConfiguration.java:44</span> | true | 是否启用接口加解密，默认开启（仍需方法上标注 @ApiEncrypt 才生效）<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.api-crypto.key`<br><span class="cfg-src">java.lang.String · ApiCryptoProperties.java:33 · ApiCryptoAutoConfiguration.java:50</span> | — | 默认 AES 实现的密钥，长度需为 16/24/32 字节。配置后才装配默认加解密器<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。 |

## ypbin-starter-api-doc

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `ypbin.api-doc.contact.email`<br><span class="cfg-src">java.lang.String · ApiDocProperties.java:208</span> |  | 邮箱<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.api-doc.contact.name`<br><span class="cfg-src">java.lang.String · ApiDocProperties.java:205</span> |  | 姓名<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.api-doc.contact.url`<br><span class="cfg-src">java.lang.String · ApiDocProperties.java:211</span> |  | 主页地址<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.api-doc.default-group-enabled`<br><span class="cfg-src">java.lang.Boolean · ApiDocProperties.java:51 · ApiDocAutoConfiguration.java:104</span> | true | 是否创建默认 GroupedOpenApi<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.api-doc.description`<br><span class="cfg-src">java.lang.String · ApiDocProperties.java:42</span> |  | 文档描述<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.api-doc.disable-in-prod`<br><span class="cfg-src">java.lang.Boolean · ApiDocProperties.java:36</span> | true | 生产环境是否关闭 SpringDoc 端点，默认关闭<br>可选值：—<br><strong>注意</strong>：生产环境应关闭或严格限制文档端点。 |
| `ypbin.api-doc.enabled`<br><span class="cfg-src">java.lang.Boolean · ApiDocProperties.java:33 · ApiDocAutoConfiguration.java:60</span> | true | 是否启用 API 文档，默认开启<br>可选值：—<br><strong>注意</strong>：生产环境应关闭或严格限制文档端点。 |
| `ypbin.api-doc.group-name`<br><span class="cfg-src">java.lang.String · ApiDocProperties.java:48</span> | default | 默认分组名称<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.api-doc.license.name`<br><span class="cfg-src">java.lang.String · ApiDocProperties.java:205</span> |  | 协议名称<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.api-doc.license.url`<br><span class="cfg-src">java.lang.String · ApiDocProperties.java:211</span> |  | 协议地址<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.api-doc.order-enabled`<br><span class="cfg-src">java.lang.Boolean · ApiDocProperties.java:54 · ApiDocAutoConfiguration.java:146</span> | true | 是否启用 @ApiOrder 排序<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.api-doc.packages-to-exclude`<br><span class="cfg-src">java.util.List&lt;java.lang.String&gt; · ApiDocProperties.java:66</span> | — | 排除包<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.api-doc.packages-to-scan`<br><span class="cfg-src">java.util.List&lt;java.lang.String&gt; · ApiDocProperties.java:63</span> | — | 扫描包<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.api-doc.paths-to-exclude`<br><span class="cfg-src">java.util.List&lt;java.lang.String&gt; · ApiDocProperties.java:60</span> | — | 排除路径<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.api-doc.paths-to-match`<br><span class="cfg-src">java.util.List&lt;java.lang.String&gt; · ApiDocProperties.java:57</span> | — | 扫描路径<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.api-doc.security-headers`<br><span class="cfg-src">java.util.List&lt;java.lang.String&gt; · ApiDocProperties.java:69</span> | — | 全局安全请求头<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.api-doc.title`<br><span class="cfg-src">java.lang.String · ApiDocProperties.java:39</span> | API 文档 | 文档标题<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.api-doc.version`<br><span class="cfg-src">java.lang.String · ApiDocProperties.java:45</span> | 1.0.0 | 文档版本<br>可选值：—<br><strong>注意</strong>：— |
| `springdoc.api-docs.enabled`<br><span class="cfg-src">java.lang.Boolean · ApiDocDefaultsEnvironmentPostProcessor.java:54</span> | true | SpringDoc OpenAPI JSON 端点开关；prod 且 disable-in-prod=true 时 starter 低优先级设为 false。<br>可选值：—<br><strong>注意</strong>：— |
| `springdoc.swagger-ui.enabled`<br><span class="cfg-src">java.lang.Boolean · ApiDocDefaultsEnvironmentPostProcessor.java:55</span> | true | SpringDoc Swagger UI 开关；prod 且 disable-in-prod=true 时 starter 低优先级设为 false。<br>可选值：—<br><strong>注意</strong>：— |

## ypbin-starter-async

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `ypbin.async.allow-core-thread-timeout`<br><span class="cfg-src">java.lang.Boolean · AsyncProperties.java:53 · additional-spring-configuration-metadata.json:1</span> | false | 是否允许核心线程超时回收。<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：— |
| `ypbin.async.await-termination`<br><span class="cfg-src">java.lang.Boolean · AsyncProperties.java:62 · additional-spring-configuration-metadata.json:1</span> | true | 关闭时是否等待任务执行完。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.async.await-termination-seconds`<br><span class="cfg-src">java.lang.Integer · AsyncProperties.java:65 · additional-spring-configuration-metadata.json:1</span> | 30 | 关闭时最长等待秒数。<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：— |
| `ypbin.async.core-size`<br><span class="cfg-src">java.lang.Integer · AsyncProperties.java:41 · additional-spring-configuration-metadata.json:1</span> | 8 | 核心线程数。<br>可选值：正整数<br><strong>注意</strong>：— |
| `ypbin.async.enable-annotation`<br><span class="cfg-src">java.lang.Boolean · AsyncProperties.java:35 · additional-spring-configuration-metadata.json:1 · AsyncAnnotationAutoConfiguration.java:45</span> | true | 是否接管 @Async（启用 @EnableAsync 并把默认执行器指向本模块线程池）。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.async.enabled`<br><span class="cfg-src">java.lang.Boolean · AsyncProperties.java:32 · additional-spring-configuration-metadata.json:1 · AsyncAnnotationAutoConfiguration.java:40 · AsyncAutoConfiguration.java:47</span> | true | 是否启用异步能力。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.async.keep-alive-seconds`<br><span class="cfg-src">java.lang.Integer · AsyncProperties.java:50 · additional-spring-configuration-metadata.json:1</span> | 60 | 空闲线程存活秒数。<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：— |
| `ypbin.async.max-size`<br><span class="cfg-src">java.lang.Integer · AsyncProperties.java:44 · additional-spring-configuration-metadata.json:1</span> | 32 | 最大线程数。<br>可选值：正整数<br><strong>注意</strong>：— |
| `ypbin.async.queue-capacity`<br><span class="cfg-src">java.lang.Integer · AsyncProperties.java:47 · additional-spring-configuration-metadata.json:1</span> | 1000 | 队列容量。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.async.rejection-policy`<br><span class="cfg-src">cn.ypbin.starter.async.autoconfigure.AsyncProperties$RejectionPolicy · AsyncProperties.java:59 · additional-spring-configuration-metadata.json:1</span> | caller-runs | 线程池拒绝策略：CALLER&#95;RUNS/ABORT/DISCARD/DISCARD&#95;OLDEST。<br>可选值：CALLER&#95;RUNS / ABORT / DISCARD / DISCARD&#95;OLDEST<br><strong>注意</strong>：— |
| `ypbin.async.scheduler-pool-size`<br><span class="cfg-src">java.lang.Integer · AsyncProperties.java:68 · additional-spring-configuration-metadata.json:1</span> | 2 | 调度线程池大小。<br>可选值：正整数<br><strong>注意</strong>：— |
| `ypbin.async.scheduler-thread-name-prefix`<br><span class="cfg-src">java.lang.String · AsyncProperties.java:71 · additional-spring-configuration-metadata.json:1</span> | ypbin-scheduler- | 调度线程名前缀。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.async.thread-name-prefix`<br><span class="cfg-src">java.lang.String · AsyncProperties.java:56 · additional-spring-configuration-metadata.json:1</span> | ypbin-async- | 线程名前缀。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.async.virtual-threads`<br><span class="cfg-src">java.lang.Boolean · AsyncProperties.java:38 · additional-spring-configuration-metadata.json:1</span> | false | 是否优先使用虚拟线程（JDK 21+ 生效）。<br>可选值：—<br><strong>注意</strong>：— |

## ypbin-starter-cache

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `ypbin.cache.enabled`<br><span class="cfg-src">java.lang.Boolean · spring-configuration-metadata.json:1 · additional-spring-configuration-metadata.json:1 · CacheAutoConfiguration.java:56</span> | true | 是否启用缓存自动配置（定制 RedisTemplate 与 CacheService）。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.cache.multi-level.enabled`<br><span class="cfg-src">java.lang.Boolean · MultiLevelCacheProperties.java:32 · additional-spring-configuration-metadata.json:1 · MultiLevelCacheAutoConfiguration.java:60</span> | false | 是否启用多级缓存（L1 Caffeine 本地 + L2 Redis），需类路径存在 Caffeine。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.cache.multi-level.invalidation-broadcast`<br><span class="cfg-src">java.lang.Boolean · MultiLevelCacheProperties.java:41 · additional-spring-configuration-metadata.json:1 · MultiLevelCacheAutoConfiguration.java:82</span> | true | 是否开启跨实例失效广播（多副本部署需开启）。<br>可选值：—<br><strong>注意</strong>：多副本部署应开启跨实例失效广播；强一致数据不应依赖本地 L1。 |
| `ypbin.cache.multi-level.invalidation-channel`<br><span class="cfg-src">java.lang.String · MultiLevelCacheProperties.java:44 · additional-spring-configuration-metadata.json:1</span> | ypbin:cache:invalidation | 失效广播 Redis Pub/Sub 频道名。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.cache.multi-level.local-expire-seconds`<br><span class="cfg-src">java.lang.Long · MultiLevelCacheProperties.java:38 · additional-spring-configuration-metadata.json:1</span> | 300 | L1 本地缓存写后过期秒数（应小于 L2 TTL，作为最终一致兜底）。<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：— |
| `ypbin.cache.multi-level.local-max-size`<br><span class="cfg-src">java.lang.Long · MultiLevelCacheProperties.java:35 · additional-spring-configuration-metadata.json:1</span> | 10000 | L1 本地缓存最大条目数。<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：— |
| `spring.data.redis.host`<br><span class="cfg-src">java.lang.String · CacheAutoConfiguration.java:55</span> | localhost | Redis 主机；缓存、多级缓存和分布式存储使用。<br>可选值：—<br><strong>注意</strong>：— |
| `spring.data.redis.port`<br><span class="cfg-src">java.lang.Integer · CacheAutoConfiguration.java:55</span> | 6379 | Redis 端口。<br>可选值：—<br><strong>注意</strong>：— |
| `spring.data.redis.password`<br><span class="cfg-src">java.lang.String · CacheAutoConfiguration.java:55</span> | — | Redis 密码。<br>可选值：—<br><strong>注意</strong>：— |

## ypbin-starter-captcha

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `ypbin.captcha.background-resources`<br><span class="cfg-src">java.util.List&lt;java.lang.String&gt; · CaptchaProperties.java:38</span> | — | 自定义背景图资源（classpath 相对路径，如 captcha/bg/1.jpg，对应 resources/captcha/bg/1.jpg）。 为空时回退加载 tianai 内置的单张默认背景图；配置多张时全部注册，验证码随机取用，避免背景单一。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.captcha.enabled`<br><span class="cfg-src">java.lang.Boolean · CaptchaProperties.java:32 · additional-spring-configuration-metadata.json:1 · CaptchaAutoConfiguration.java:44</span> | true | 是否启用验证码（行为验证码）自动配置。<br>可选值：—<br><strong>注意</strong>：— |

## ypbin-starter-cloud-core

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `ypbin.cloud.feign.circuitbreaker-enabled`<br><span class="cfg-src">java.lang.Boolean · FeignProperties.java:38</span> | true | 是否默认开启 OpenFeign circuitbreaker，默认开启<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.cloud.feign.enabled`<br><span class="cfg-src">java.lang.Boolean · FeignProperties.java:32 · CloudFeignAutoConfiguration.java:43</span> | true | 是否启用 Feign 增强（请求头透传等），默认开启<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.cloud.feign.error-decoder-enabled`<br><span class="cfg-src">java.lang.Boolean · FeignProperties.java:35 · CloudFeignAutoConfiguration.java:49</span> | true | 是否启用统一错误解码，默认开启<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.cloud.feign.propagate-headers`<br><span class="cfg-src">java.util.List&lt;java.lang.String&gt; · FeignProperties.java:44</span> | — | 需要透传到下游服务的请求头名单（大小写不敏感）。 默认只透传认证与链路追踪相关头；用户、租户等身份头应由可信网关清洗/签发后再显式加入。<br>可选值：—<br><strong>注意</strong>：— |
| `spring.cloud.openfeign.circuitbreaker.enabled`<br><span class="cfg-src">java.lang.Boolean · FeignDefaultsEnvironmentPostProcessor.java:49</span> | true | Feign CircuitBreaker 标准开关；由 ypbin.cloud.feign.circuitbreaker-enabled 低优先级映射。<br>可选值：—<br><strong>注意</strong>：— |

## ypbin-starter-cloud-gateway

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `ypbin.gateway.auth.enabled`<br><span class="cfg-src">java.lang.Boolean · GatewayProperties.java:32 · GatewayAutoConfiguration.java:71</span> | false | 是否启用统一认证，默认关闭；需同时提供 GatewayAuthProvider Bean<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.gateway.auth.exclude-paths`<br><span class="cfg-src">java.util.List&lt;java.lang.String&gt; · GatewayProperties.java:207</span> | — | 放行路径<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.gateway.cors.allow-credentials`<br><span class="cfg-src">java.lang.Boolean · GatewayProperties.java:107</span> | true | 是否允许携带凭证<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.gateway.cors.allowed-headers`<br><span class="cfg-src">java.util.List&lt;java.lang.String&gt; · GatewayProperties.java:101</span> | — | 允许的请求头<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.gateway.cors.allowed-methods`<br><span class="cfg-src">java.util.List&lt;java.lang.String&gt; · GatewayProperties.java:98</span> | — | 允许的请求方法<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.gateway.cors.allowed-origin-patterns`<br><span class="cfg-src">java.util.List&lt;java.lang.String&gt; · GatewayProperties.java:95</span> | — | 允许的来源模式<br>可选值：—<br><strong>注意</strong>：生产环境避免通配跨域来源；启用凭证时必须使用受控来源。 |
| `ypbin.gateway.cors.enabled`<br><span class="cfg-src">java.lang.Boolean · GatewayProperties.java:32 · GatewayAutoConfiguration.java:79</span> | false | 是否启用跨域，默认关闭<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.gateway.cors.exposed-headers`<br><span class="cfg-src">java.util.List&lt;java.lang.String&gt; · GatewayProperties.java:104</span> | — | 暴露给浏览器的响应头<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.gateway.cors.max-age`<br><span class="cfg-src">java.lang.Long · GatewayProperties.java:110</span> | 3600 | 预检请求缓存时间（秒）<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：— |
| `ypbin.gateway.enabled`<br><span class="cfg-src">java.lang.Boolean · GatewayProperties.java:32 · GatewayAutoConfiguration.java:51</span> | true | 是否启用网关增强，默认开启<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.gateway.header-sanitize.enabled`<br><span class="cfg-src">java.lang.Boolean · GatewayProperties.java:32 · GatewayAutoConfiguration.java:63</span> | true | 是否清洗客户端传入的身份类请求头，默认开启<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.gateway.header-sanitize.headers`<br><span class="cfg-src">java.util.List&lt;java.lang.String&gt; · GatewayProperties.java:178</span> | — | 客户端不可直接传入、需由可信网关签发的请求头<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.gateway.request-id-header`<br><span class="cfg-src">java.lang.String · GatewayProperties.java:35</span> | X-Request-Id | 请求 ID 请求头名称<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.gateway.route.nacos.data-id`<br><span class="cfg-src">java.lang.String · NacosRouteProperties.java:33</span> | gateway-routes.json | Nacos 配置 Data ID<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.gateway.route.nacos.enabled`<br><span class="cfg-src">java.lang.Boolean · NacosRouteProperties.java:30 · NacosRouteAutoConfiguration.java:39</span> | false | 是否启用 Nacos 动态路由，默认关闭<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.gateway.route.nacos.group`<br><span class="cfg-src">java.lang.String · NacosRouteProperties.java:36</span> | DEFAULT&#95;GROUP | Nacos 配置 Group<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.gateway.route.nacos.timeout-ms`<br><span class="cfg-src">java.lang.Long · NacosRouteProperties.java:39</span> | 5000 | Nacos 读取配置超时（毫秒）<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：— |
| `ypbin.gateway.swagger.api-docs-path`<br><span class="cfg-src">java.lang.String · GatewaySwaggerAggregationProperties.java:35</span> | /v3/api-docs | 下游服务 /v3/api-docs 路径<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.gateway.swagger.enabled`<br><span class="cfg-src">java.lang.Boolean · GatewaySwaggerAggregationProperties.java:32 · GatewaySwaggerAutoConfiguration.java:46</span> | false | 是否启用 Swagger 聚合，默认关闭<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.gateway.swagger.excluded-route-prefixes`<br><span class="cfg-src">java.util.List&lt;java.lang.String&gt; · GatewaySwaggerAggregationProperties.java:41</span> | — | 需要排除的路由 ID 前缀<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.gateway.swagger.group-name`<br><span class="cfg-src">java.lang.String · GatewaySwaggerAggregationProperties.java:38</span> | default | 下游服务分组名<br>可选值：—<br><strong>注意</strong>：— |
| `spring.cloud.gateway.routes[]`<br><span class="cfg-src">java.util.List&lt;org.springframework.cloud.gateway.route.RouteDefinition&gt; · MODULES.md:1641</span> | — | 静态网关路由列表；starter 不预设业务路由。<br>可选值：—<br><strong>注意</strong>：— |

## ypbin-starter-cloud-loadbalancer

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `ypbin.cloud.loadbalancer.default-weight`<br><span class="cfg-src">java.lang.Integer · LoadBalancerProperties.java:49</span> | 1 | metadata 未配置或配置非法时使用的默认权重<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.cloud.loadbalancer.enabled`<br><span class="cfg-src">java.lang.Boolean · LoadBalancerProperties.java:34 · LoadBalancerAutoConfiguration.java:46</span> | true | 是否启用版本灰度负载均衡，默认开启<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.cloud.loadbalancer.fallback-to-stable`<br><span class="cfg-src">java.lang.Boolean · LoadBalancerProperties.java:52</span> | true | 灰度版本无匹配实例时是否回退到正式实例<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.cloud.loadbalancer.metadata-key`<br><span class="cfg-src">java.lang.String · LoadBalancerProperties.java:43</span> | version | 服务实例 metadata 中保存版本的 key<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.cloud.loadbalancer.prefer-stable-without-version`<br><span class="cfg-src">java.lang.Boolean · LoadBalancerProperties.java:55</span> | true | 无版本请求是否优先选择未标记版本的正式实例<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.cloud.loadbalancer.prior-ip-patterns`<br><span class="cfg-src">java.util.List&lt;java.lang.String&gt; · LoadBalancerProperties.java:58</span> | — | 优先 IP 通配列表，例如 10.20.0.8&#42;、10.20.0.&#42;<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.cloud.loadbalancer.register-nacos-metadata`<br><span class="cfg-src">java.lang.Boolean · LoadBalancerProperties.java:61</span> | true | 是否把当前服务版本写入 Nacos discovery metadata<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.cloud.loadbalancer.version`<br><span class="cfg-src">java.lang.String · LoadBalancerProperties.java:37</span> | — | 当前服务实例版本；配置后可自动写入 Nacos metadata<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.cloud.loadbalancer.version-headers`<br><span class="cfg-src">java.util.List&lt;java.lang.String&gt; · LoadBalancerProperties.java:40</span> | — | 请求头中的灰度版本名，按顺序取第一个非空值<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.cloud.loadbalancer.weight-metadata-key`<br><span class="cfg-src">java.lang.String · LoadBalancerProperties.java:46</span> | weight | 服务实例 metadata 中保存权重的 key<br>可选值：—<br><strong>注意</strong>：— |
| `spring.cloud.nacos.discovery.metadata.&lt;metadata-key&gt;`<br><span class="cfg-src">java.lang.String · LoadBalancerEnvironmentPostProcessor.java:56</span> | — | 当前服务版本写入 Nacos metadata 的动态标准键。<br>可选值：—<br><strong>注意</strong>：— |

## ypbin-starter-cloud-nacos

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `ypbin.cloud.nacos.application-description`<br><span class="cfg-src">java.lang.String · NacosProperties.java:47 · additional-spring-configuration-metadata.json:1</span> | — | 应用描述兜底值；为空时不注入 info.desc。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.cloud.nacos.application-name`<br><span class="cfg-src">java.lang.String · NacosProperties.java:44 · additional-spring-configuration-metadata.json:1</span> | — | 应用名兜底值；为空时不注入 spring.application.name。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.cloud.nacos.bean-definition-overriding-enabled`<br><span class="cfg-src">java.lang.Boolean · NacosProperties.java:80 · additional-spring-configuration-metadata.json:1</span> | false | 是否允许 Bean 覆盖；默认不开启，避免掩盖重复 Bean 问题。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.cloud.nacos.config-file-extension`<br><span class="cfg-src">java.lang.String · NacosProperties.java:62 · additional-spring-configuration-metadata.json:1</span> | yaml | Nacos 配置文件后缀。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.cloud.nacos.config-import`<br><span class="cfg-src">java.lang.String · NacosProperties.java:56 · additional-spring-configuration-metadata.json:1</span> | — | 显式指定 Nacos ConfigData 导入地址；为空时按 prefix/profile/applicationName 自动生成。<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：— |
| `ypbin.cloud.nacos.config-import-check-enabled`<br><span class="cfg-src">java.lang.Boolean · NacosProperties.java:71 · additional-spring-configuration-metadata.json:1</span> | false | Nacos config import 检查开关。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.cloud.nacos.config-import-enabled`<br><span class="cfg-src">java.lang.Boolean · NacosProperties.java:53 · additional-spring-configuration-metadata.json:1</span> | true | 是否注入 Nacos ConfigData 导入默认值。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.cloud.nacos.config-prefix`<br><span class="cfg-src">java.lang.String · NacosProperties.java:59 · additional-spring-configuration-metadata.json:1</span> | application | Nacos 公共配置前缀。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.cloud.nacos.default-profile`<br><span class="cfg-src">java.lang.String · NacosProperties.java:38 · additional-spring-configuration-metadata.json:1</span> | dev | 默认 profile；仅在无 active profile 时以低优先级写入 spring.profiles.default。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.cloud.nacos.default-profile-enabled`<br><span class="cfg-src">java.lang.Boolean · NacosProperties.java:35 · additional-spring-configuration-metadata.json:1</span> | true | 无 active profile 时是否注入默认 profile。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.cloud.nacos.enabled`<br><span class="cfg-src">java.lang.Boolean · NacosProperties.java:32 · additional-spring-configuration-metadata.json:1 · NacosAutoConfiguration.java:32</span> | true | 是否启用 Nacos 启动增强。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.cloud.nacos.fail-on-multiple-preset-profiles`<br><span class="cfg-src">java.lang.Boolean · NacosProperties.java:41 · additional-spring-configuration-metadata.json:1</span> | true | 是否禁止 dev/test/prod 同时激活。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.cloud.nacos.include-application-profile-config`<br><span class="cfg-src">java.lang.Boolean · NacosProperties.java:68 · additional-spring-configuration-metadata.json:1</span> | true | 是否加载应用 profile 级配置，如 order-service-dev.yaml。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.cloud.nacos.include-profile-config`<br><span class="cfg-src">java.lang.Boolean · NacosProperties.java:65 · additional-spring-configuration-metadata.json:1</span> | true | 是否加载 profile 级配置，如 application-dev.yaml。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.cloud.nacos.logging-default-config-enabled`<br><span class="cfg-src">java.lang.Boolean · NacosProperties.java:74 · additional-spring-configuration-metadata.json:1</span> | false | 是否启用 Nacos 默认日志配置。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.cloud.nacos.management-info-process-enabled`<br><span class="cfg-src">java.lang.Boolean · NacosProperties.java:77 · additional-spring-configuration-metadata.json:1</span> | true | 是否开启 Actuator process info。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.cloud.nacos.service-version`<br><span class="cfg-src">java.lang.String · NacosProperties.java:50 · additional-spring-configuration-metadata.json:1</span> | — | 服务版本兜底值；为空时不注入 info.version。<br>可选值：—<br><strong>注意</strong>：— |
| `spring.application.name`<br><span class="cfg-src">java.lang.String · NacosEnvironmentPostProcessor.java:48</span> | — | 服务名；影响 Nacos 注册和应用级配置 DataId。<br>可选值：—<br><strong>注意</strong>：— |
| `spring.profiles.active`<br><span class="cfg-src">java.lang.String · NacosEnvironmentPostProcessor.java:50</span> | — | 显式激活的环境 profile。<br>可选值：—<br><strong>注意</strong>：— |
| `spring.profiles.default`<br><span class="cfg-src">java.lang.String · NacosEnvironmentPostProcessor.java:52</span> | dev | 无 active profile 时的默认环境；可由 ypbin.cloud.nacos.default-profile 控制。<br>可选值：—<br><strong>注意</strong>：— |
| `spring.config.import`<br><span class="cfg-src">java.lang.String · NacosEnvironmentPostProcessor.java:46</span> | 自动生成 optional:nacos:... | ConfigData 导入列表；宿主显式配置时优先。<br>可选值：—<br><strong>注意</strong>：— |
| `spring.cloud.nacos.discovery.server-addr`<br><span class="cfg-src">java.lang.String · MODULES.md:1558</span> | — | Nacos 注册发现服务地址。<br>可选值：—<br><strong>注意</strong>：— |
| `spring.cloud.nacos.config.server-addr`<br><span class="cfg-src">java.lang.String · MODULES.md:1558</span> | — | Nacos 配置中心服务地址。<br>可选值：—<br><strong>注意</strong>：— |
| `spring.cloud.nacos.config.import-check.enabled`<br><span class="cfg-src">java.lang.Boolean · NacosEnvironmentPostProcessor.java:54</span> | false | Nacos ConfigData import 检查开关。<br>可选值：—<br><strong>注意</strong>：— |
| `nacos.logging.default.config.enabled`<br><span class="cfg-src">java.lang.Boolean · NacosEnvironmentPostProcessor.java:70</span> | false | 是否启用 Nacos 默认日志配置。<br>可选值：—<br><strong>注意</strong>：— |
| `management.info.process.enabled`<br><span class="cfg-src">java.lang.Boolean · NacosEnvironmentPostProcessor.java:72</span> | true | 是否暴露 Actuator process info。<br>可选值：—<br><strong>注意</strong>：— |
| `spring.main.allow-bean-definition-overriding`<br><span class="cfg-src">java.lang.Boolean · NacosEnvironmentPostProcessor.java:74</span> | false | 是否允许同名 Bean 覆盖。<br>可选值：—<br><strong>注意</strong>：— |
| `info.desc`<br><span class="cfg-src">java.lang.String · NacosEnvironmentPostProcessor.java:101</span> | — | Actuator 应用描述，可由 ypbin.cloud.nacos.application-description 注入。<br>可选值：—<br><strong>注意</strong>：— |
| `info.version`<br><span class="cfg-src">java.lang.String · NacosEnvironmentPostProcessor.java:105</span> | — | Actuator 服务版本，可由 ypbin.cloud.nacos.service-version 注入。<br>可选值：—<br><strong>注意</strong>：— |

## ypbin-starter-cloud-observability

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `ypbin.observability.enabled`<br><span class="cfg-src">java.lang.Boolean · ObservabilityProperties.java:30 · ObservabilityAutoConfiguration.java:43</span> | true | 是否启用可观测性（X-Request-Id 与 MDC 关联），默认开启<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.observability.mdc-key`<br><span class="cfg-src">java.lang.String · ObservabilityProperties.java:36</span> | requestId | 写入 MDC 的键名，日志 pattern 可引用<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.observability.request-id-header`<br><span class="cfg-src">java.lang.String · ObservabilityProperties.java:33</span> | X-Request-Id | 请求 ID 请求头名称，与网关 RequestId 保持一致<br>可选值：—<br><strong>注意</strong>：— |
| `logging.pattern.level`<br><span class="cfg-src">java.lang.String · MODULES.md:1734</span> | — | 日志级别 pattern；可引用 MDC requestId。<br>可选值：—<br><strong>注意</strong>：— |
| `management.tracing.sampling.probability`<br><span class="cfg-src">java.lang.Double · MODULES.md:1763</span> | — | 分布式追踪采样概率，范围 0.0 到 1.0。<br>可选值：0.0..1.0<br><strong>注意</strong>：— |
| `management.otlp.tracing.endpoint`<br><span class="cfg-src">java.lang.String · MODULES.md:1766</span> | — | OTLP trace 上报端点。<br>可选值：—<br><strong>注意</strong>：— |

## ypbin-starter-cloud-sentinel

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `ypbin.cloud.sentinel.block-message`<br><span class="cfg-src">java.lang.String · SentinelProperties.java:33</span> | 请求过于频繁，请稍后重试 | 被限流时的提示信息<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.cloud.sentinel.enabled`<br><span class="cfg-src">java.lang.Boolean · SentinelProperties.java:30 · SentinelAutoConfiguration.java:43</span> | true | 是否启用被限流/降级时的统一 R 响应，默认开启<br>可选值：—<br><strong>注意</strong>：— |
| `spring.cloud.sentinel.transport.dashboard`<br><span class="cfg-src">java.lang.String · MODULES.md:1793</span> | — | Sentinel Dashboard 地址。<br>可选值：—<br><strong>注意</strong>：— |
| `spring.cloud.sentinel.datasource.&lt;name&gt;.nacos.&#42;`<br><span class="cfg-src">java.lang.Object · MODULES.md:1795</span> | — | Sentinel Nacos 规则源：server-addr、data-id、group-id、rule-type。<br>可选值：—<br><strong>注意</strong>：— |

## ypbin-starter-data

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `ypbin.data.db-type`<br><span class="cfg-src">com.baomidou.mybatisplus.annotation.DbType · DataProperties.java:35</span> | mysql | 数据库类型，用于分页方言，默认 MySQL<br>可选值：MYSQL / MARIADB / ORACLE / ORACLE&#95;12C / DB2 / H2 / HSQL / SQLITE / POSTGRE&#95;SQL / SQL&#95;SERVER2005 / SQL&#95;SERVER / DM / XU&#95;GU / KINGBASE&#95;ES / PHOENIX / GAUSS / GAUSS&#95;DB / CLICK&#95;HOUSE / GBASE / GBASE&#95;8S / GBASEDBT / GBASE&#95;INFORMIX / GBASE8S&#95;PG / GBASE&#95;8C / SINODB / OSCAR / SYBASE / OCEAN&#95;BASE / FIREBIRD / HIGH&#95;GO / CUBRID / SUNDB / SAP&#95;HANA / IMPALA / VERTICA / XCloud / REDSHIFT / OPENGAUSS / TDENGINE / INFORMIX / UXDB / LEALONE / TRINO / PRESTO / DERBY / VASTBASE / GOLDENDB / DUCKDB / YASDB / HIVE2 / OTHER<br><strong>注意</strong>：— |
| `ypbin.data.enabled`<br><span class="cfg-src">java.lang.Boolean · DataProperties.java:32 · DataAutoConfiguration.java:53</span> | true | 是否启用数据增强，默认开启<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.data.encrypt.key`<br><span class="cfg-src">java.lang.String · DataProperties.java:93 · DataAutoConfiguration.java:127</span> | — | AES 密钥，长度需为 16/24/32 字节。配置后才装配默认字段加密器<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。 |
| `ypbin.data.max-limit`<br><span class="cfg-src">java.lang.Long · DataProperties.java:38</span> | 500 | 单页最大条数限制，防止恶意超大分页，-1 表示不限制<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：— |
| `ypbin.data.overflow`<br><span class="cfg-src">java.lang.Boolean · DataProperties.java:41</span> | false | 溢出总页数后是否进行处理（跳回首页）<br>可选值：—<br><strong>注意</strong>：— |
| `spring.datasource.url`<br><span class="cfg-src">java.lang.String · pom.xml:1</span> | — | JDBC 数据源连接地址；数据模块执行数据库访问时由宿主配置。<br>可选值：—<br><strong>注意</strong>：— |
| `spring.datasource.username`<br><span class="cfg-src">java.lang.String · pom.xml:1</span> | — | JDBC 数据库用户名。<br>可选值：—<br><strong>注意</strong>：— |
| `spring.datasource.password`<br><span class="cfg-src">java.lang.String · pom.xml:1</span> | — | JDBC 数据库密码。<br>可选值：—<br><strong>注意</strong>：— |
| `mybatis-plus.global-config.banner`<br><span class="cfg-src">java.lang.Boolean · DataDefaultsEnvironmentPostProcessor.java:47</span> | false | 是否打印 MyBatis-Plus banner；starter 低优先级关闭。<br>可选值：—<br><strong>注意</strong>：— |
| `mybatis-plus.global-config.db-config.id-type`<br><span class="cfg-src">com.baomidou.mybatisplus.annotation.IdType · MODULES.md:86</span> | — | 宿主需要覆盖默认雪花 ID 策略时配置。<br>可选值：—<br><strong>注意</strong>：— |

## ypbin-starter-extension-datapermission

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `ypbin.data-permission.enabled`<br><span class="cfg-src">java.lang.Boolean · DataPermissionAutoConfiguration.java:49</span> | — | 自动装配条件开关。<br>可选值：—<br><strong>注意</strong>：— |

## ypbin-starter-extension-tenant

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `ypbin.tenant.column`<br><span class="cfg-src">java.lang.String · TenantProperties.java:35</span> | tenant&#95;id | 租户字段列名<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.tenant.enabled`<br><span class="cfg-src">java.lang.Boolean · TenantProperties.java:32 · TenantAutoConfiguration.java:49</span> | false | 是否启用多租户，默认关闭（需显式开启）<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.tenant.ignore-tables`<br><span class="cfg-src">java.util.List&lt;java.lang.String&gt; · TenantProperties.java:38</span> | — | 忽略租户隔离的表（这些表不追加租户条件）<br>可选值：—<br><strong>注意</strong>：— |

## ypbin-starter-i18n

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `ypbin.i18n.default-locale`<br><span class="cfg-src">java.lang.String · I18nProperties.java:39</span> | zh&#95;CN | 默认语言标签（如 zh&#95;CN / en&#95;US），为空则用系统默认<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.i18n.enabled`<br><span class="cfg-src">java.lang.Boolean · I18nProperties.java:30 · I18nAutoConfiguration.java:42</span> | true | 是否启用国际化，默认开启<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.i18n.header-name`<br><span class="cfg-src">java.lang.String · I18nProperties.java:36</span> | Accept-Language | 从请求头取语言的头名<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.i18n.param-name`<br><span class="cfg-src">java.lang.String · I18nProperties.java:33</span> | lang | 从请求参数取语言的参数名（如 ?lang=en&#95;US）<br>可选值：—<br><strong>注意</strong>：— |
| `spring.messages.basename`<br><span class="cfg-src">java.lang.String · MODULES.md:1375</span> | messages | 国际化资源 basename。<br>可选值：—<br><strong>注意</strong>：— |

## ypbin-starter-job

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `ypbin.job.enabled`<br><span class="cfg-src">java.lang.Boolean · JobProperties.java:30 · JobAutoConfiguration.java:51</span> | true | 是否启用定时任务调度，默认开启<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.job.pool-size`<br><span class="cfg-src">java.lang.Integer · JobProperties.java:33</span> | 4 | 调度线程池大小<br>可选值：正整数<br><strong>注意</strong>：— |
| `ypbin.job.thread-name-prefix`<br><span class="cfg-src">java.lang.String · JobProperties.java:36</span> | ypbin-job- | 线程名前缀<br>可选值：—<br><strong>注意</strong>：— |

## ypbin-starter-json

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `ypbin.json.date-format`<br><span class="cfg-src">java.lang.String · JacksonProperties.java:42</span> | yyyy-MM-dd | 日期格式<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.json.date-time-format`<br><span class="cfg-src">java.lang.String · JacksonProperties.java:39</span> | yyyy-MM-dd HH:mm:ss | 日期时间格式<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.json.enabled`<br><span class="cfg-src">java.lang.Boolean · JacksonProperties.java:30 · JacksonAutoConfiguration.java:77</span> | true | 是否启用统一 Jackson 定制，默认开启<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.json.ref-text.auto-resolve`<br><span class="cfg-src">java.lang.Boolean · JacksonProperties.java:110 · JacksonAutoConfiguration.java:175</span> | true | 是否自动预加载（拦截响应体在序列化前批量翻译，业务无需手动 preload），默认开启<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.json.ref-text.max-size`<br><span class="cfg-src">java.lang.Integer · JacksonProperties.java:107</span> | 10000 | 缓存容量上限（条），超出触发清理，仍满则不再写入，默认 1 万<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：— |
| `ypbin.json.ref-text.ttl-seconds`<br><span class="cfg-src">java.lang.Long · JacksonProperties.java:104</span> | 300 | 翻译结果缓存有效期（秒），默认 5 分钟<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：— |
| `ypbin.json.time-format`<br><span class="cfg-src">java.lang.String · JacksonProperties.java:45</span> | HH:mm:ss | 时间格式<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.json.write-big-number-as-string`<br><span class="cfg-src">java.lang.Boolean · JacksonProperties.java:36</span> | true | 是否将 Long / BigInteger / BigDecimal 序列化为字符串，规避前端 JS 大数精度丢失。 默认开启。<br>可选值：—<br><strong>注意</strong>：— |

## ypbin-starter-license

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `ypbin.license.allow-startup-without-license`<br><span class="cfg-src">java.lang.Boolean · LicenseProperties.java:53</span> | false | 无授权文件时是否允许启动。 默认 false：缺授权即启动失败并暴露原因，避免「以为受保护实则裸奔」。 置为 true 可在无授权文件时以「非法不可用」状态启动，受保护能力被拦截、非保护能力照常， 适用于先启动后补授权的交付流程。<br>可选值：—<br><strong>注意</strong>：开启后无授权也可启动，但受保护能力仍不可用；必须确保保护注解覆盖完整。 |
| `ypbin.license.enabled`<br><span class="cfg-src">java.lang.Boolean · LicenseProperties.java:32 · LicenseAutoConfiguration.java:58</span> | true | 是否启用授权校验，默认开启<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.license.fingerprint-enabled`<br><span class="cfg-src">java.lang.Boolean · LicenseProperties.java:44</span> | true | 是否启用机器指纹绑定校验，默认开启<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.license.location`<br><span class="cfg-src">java.lang.String · LicenseProperties.java:41</span> | ./license.dat | 授权文件路径：默认文件存储实现从此读取授权串<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.license.online.access-key`<br><span class="cfg-src">java.lang.String · LicenseProperties.java:129</span> | — | 开放应用 Access Key（公开标识，与签发端应用管理注册的应用一致）<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。 |
| `ypbin.license.online.base-url`<br><span class="cfg-src">java.lang.String · LicenseProperties.java:126 · LicenseAutoConfiguration.java:130</span> | — | 联机校验服务根地址（如 http&#58;//license-admin:8080）；为空则不装配联机校验<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.license.online.cache-seconds`<br><span class="cfg-src">java.lang.Long · LicenseProperties.java:145</span> | 3600 | 联机校验缓存窗口（秒）：最近一次服务端明确返回有效后，窗口内不再重复联机校验， 避免 @LicenseCheck(online=true) 每次方法调用都发 HTTP。吊销感知延迟 ≤ 缓存窗口， 默认 1 小时。<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：— |
| `ypbin.license.online.fail-open-backoff-seconds`<br><span class="cfg-src">java.lang.Long · LicenseProperties.java:164</span> | 300 | 退避窗口（秒）：连续放行次数达到 {@link #failOpenThreshold} 后使用的更长窗口，默认 5 分钟， 进一步降低对故障中的联机服务的调用频率。<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：— |
| `ypbin.license.online.fail-open-cache-seconds`<br><span class="cfg-src">java.lang.Long · LicenseProperties.java:152</span> | 60 | 放行窗口（秒）：网络异常/HTTP 非 200/响应解析失败/valid 字段缺失或非布尔等「放行但不明确 有效」结果，进入这个短窗口，窗口内不再重复联机（防止联机服务不可用时被高频调用打爆），默认 1 分钟。 与 {@link #cacheSeconds} 是两套独立窗口：只有服务端明确返回有效才用长窗口，放行永远只用这个短窗口。<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：— |
| `ypbin.license.online.fail-open-threshold`<br><span class="cfg-src">java.lang.Integer · LicenseProperties.java:158</span> | 5 | 连续放行次数阈值：达到该阈值后放行窗口升级为 {@link #failOpenBackoffSeconds}（更长）， 默认 5 次。服务端任意一次明确返回（有效或无效）都会重置计数——只有「连续不可达/异常」才升级退避。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.license.online.failure-policy`<br><span class="cfg-src">cn.ypbin.starter.license.extension.RemoteFailurePolicy · LicenseProperties.java:138</span> | fail-open-with-warning | 联机服务无法明确裁决时的处理策略<br>可选值：FAIL&#95;CLOSED / FAIL&#95;OPEN&#95;WITH&#95;WARNING<br><strong>注意</strong>：FAIL&#95;OPEN&#95;WITH&#95;WARNING 会在联机服务异常时临时放行，必须配套监控告警。 |
| `ypbin.license.online.secret-key`<br><span class="cfg-src">java.lang.String · LicenseProperties.java:38</span> | — | 开放应用 Secret Key（私有密钥，参与请求签名，不下发）<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。 |
| `ypbin.license.online.timeout`<br><span class="cfg-src">java.time.Duration · LicenseProperties.java:135</span> | 5s | 单次联机校验超时时间<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：— |
| `ypbin.license.public-key`<br><span class="cfg-src">java.lang.String · LicenseProperties.java:35</span> | — | SM2 公钥（Base64）：运行端仅需公钥用于验签，私钥仅在供应方签发端持有<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。 |
| `ypbin.license.secret-key`<br><span class="cfg-src">java.lang.String · LicenseProperties.java:38</span> | — | SM4 密钥（Base64，16 字节）：授权文件对称加解密密钥<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。 |

## ypbin-starter-log

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `ypbin.log.access.enabled`<br><span class="cfg-src">java.lang.Boolean · AccessLogProperties.java:32 · AccessLogAutoConfiguration.java:44</span> | false | 是否启用全量访问日志切面，默认关闭（与 @Log 注解版互补，按需开启）<br>可选值：—<br><strong>注意</strong>：请求体、响应体和请求头可能包含凭据或个人信息，生产环境需掩码并控制留存。 |
| `ypbin.log.access.exclude-path-patterns`<br><span class="cfg-src">java.util.List&lt;java.lang.String&gt; · AccessLogProperties.java:35</span> | — | 排除路径（静态资源、健康检查等）<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.log.access.mask-headers`<br><span class="cfg-src">java.util.List&lt;java.lang.String&gt; · AccessLogProperties.java:38</span> | — | 敏感请求头关键字（头名小写包含即掩码值），默认掩码授权/会话相关头<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.log.enabled`<br><span class="cfg-src">java.lang.Boolean · LogProperties.java:32 · LogAutoConfiguration.java:55</span> | true | 是否启用操作日志，默认开启<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.log.includes`<br><span class="cfg-src">java.util.Set&lt;cn.ypbin.starter.log.enums.Include&gt; · LogProperties.java:35</span> | — | 全局默认采集项，为空时使用 Include<br>可选值：REQUEST&#95;HEADERS / REQUEST&#95;BODY / REQUEST&#95;PARAM / RESPONSE&#95;HEADERS / RESPONSE&#95;BODY / IP / BROWSER / OS / CLIENT<br><strong>注意</strong>：请求体、响应体和请求头可能包含凭据或个人信息，生产环境需掩码并控制留存。 |

## ypbin-starter-messaging

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `ypbin.mail.default-encoding`<br><span class="cfg-src">java.lang.String · MailConfig.java:64</span> | UTF-8 | 编码<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.mail.from`<br><span class="cfg-src">java.lang.String · MailConfig.java:49</span> | — | 发件人邮箱，为空时取 {@link #username}<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.mail.from-name`<br><span class="cfg-src">java.lang.String · MailConfig.java:52</span> | — | 发件人显示名，可空<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.mail.host`<br><span class="cfg-src">java.lang.String · MailConfig.java:37</span> | — | SMTP 服务器地址<br><strong>必填：使用配置文件版邮件发送时必填。</strong><br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.mail.password`<br><span class="cfg-src">java.lang.String · MailConfig.java:46</span> | — | 密码/授权码<br><strong>必填：服务要求认证时必填。</strong><br>可选值：—<br><strong>注意</strong>：使用环境变量或密钥服务，禁止提交明文。 / 敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。 |
| `ypbin.mail.port`<br><span class="cfg-src">java.lang.Integer · MailConfig.java:40</span> | 465 | SMTP 端口<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：— |
| `ypbin.mail.protocol`<br><span class="cfg-src">java.lang.String · MailConfig.java:55</span> | smtp | 协议，默认 smtp<br>可选值：smtp / smtps<br><strong>注意</strong>：— |
| `ypbin.mail.ssl-enabled`<br><span class="cfg-src">java.lang.Boolean · MailConfig.java:58</span> | true | 是否启用 SSL<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.mail.starttls-enabled`<br><span class="cfg-src">java.lang.Boolean · MailConfig.java:61</span> | false | 是否启用 STARTTLS<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.mail.timeout`<br><span class="cfg-src">java.lang.Integer · MailConfig.java:67</span> | 10000 | 连接/读取超时（毫秒）<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：— |
| `ypbin.mail.username`<br><span class="cfg-src">java.lang.String · MailConfig.java:43</span> | — | 账号<br><strong>必填：使用配置文件版邮件发送时必填。</strong><br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.mqtt.automatic-reconnect`<br><span class="cfg-src">java.lang.Boolean · MqttProperties.java:57</span> | true | 是否自动重连<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.mqtt.clean-session`<br><span class="cfg-src">java.lang.Boolean · MqttProperties.java:51</span> | true | 是否清除会话（false 时 broker 保留会话与离线消息，配合 QoS≥1 实现可靠投递）<br>可选值：—<br><strong>注意</strong>：可靠投递需结合 clean-session=false、QoS 1/2、持久化目录和 Broker 会话策略。 |
| `ypbin.mqtt.client-id`<br><span class="cfg-src">java.lang.String · MqttProperties.java:36</span> | — | 客户端 ID（为空则自动生成）<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.mqtt.connection-timeout`<br><span class="cfg-src">java.lang.Integer · MqttProperties.java:45</span> | 10 | 连接超时（秒）<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：— |
| `ypbin.mqtt.default-qos`<br><span class="cfg-src">java.lang.Integer · MqttProperties.java:54</span> | 1 | 默认发布 QoS（0/1/2）<br>可选值：0 / 1 / 2<br><strong>注意</strong>：— |
| `ypbin.mqtt.enabled`<br><span class="cfg-src">java.lang.Boolean · MqttProperties.java:30 · MqttAutoConfiguration.java:50</span> | false | 是否启用 MQTT，默认关闭（需显式开启）<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.mqtt.keep-alive-interval`<br><span class="cfg-src">java.lang.Integer · MqttProperties.java:48</span> | 60 | 心跳间隔（秒）<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.mqtt.max-inflight`<br><span class="cfg-src">java.lang.Integer · MqttProperties.java:63</span> | 10 | 最大在途（未确认）消息数，QoS1/2 高吞吐时调大。注意不可设为 0（会阻塞所有 QoS≥1 发布）<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：— |
| `ypbin.mqtt.max-reconnect-delay`<br><span class="cfg-src">java.lang.Integer · MqttProperties.java:60</span> | 30000 | 自动重连的最大间隔（毫秒），指数退避的上限<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.mqtt.password`<br><span class="cfg-src">java.lang.String · MqttProperties.java:42</span> | — | 密码<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。 |
| `ypbin.mqtt.persistence-dir`<br><span class="cfg-src">java.lang.String · MqttProperties.java:69</span> | — | 消息持久化目录。配置后用文件持久化（进程重启后 QoS1/2 未确认消息不丢）， 为空则用内存持久化（重启丢失）。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.mqtt.url`<br><span class="cfg-src">java.lang.String · MqttProperties.java:33</span> | — | Broker 地址，如 tcp&#58;//127.0.0.1:1883<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.mqtt.username`<br><span class="cfg-src">java.lang.String · MqttProperties.java:39</span> | — | 用户名<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.sse.enabled`<br><span class="cfg-src">java.lang.Boolean · SseProperties.java:30 · additional-spring-configuration-metadata.json:1 · SseAutoConfiguration.java:62 · SecuritySseAutoConfiguration.java:76</span> | false | 是否启用 SSE 实时推送。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.sse.heartbeat-interval-seconds`<br><span class="cfg-src">java.lang.Long · SseProperties.java:57</span> | 30 | 心跳间隔（秒），默认 30。定期向连接发送 : ping 注释帧，保活中间代理并尽早暴露死连接 （发送失败即回收）。0 表示关闭心跳。<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：— |
| `ypbin.sse.path`<br><span class="cfg-src">java.lang.String · SseProperties.java:36 · additional-spring-configuration-metadata.json:1</span> | /ypbin/sse/subscribe | 内置订阅端点路径。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.sse.register-endpoint`<br><span class="cfg-src">java.lang.Boolean · SseProperties.java:33 · additional-spring-configuration-metadata.json:1 · SseAutoConfiguration.java:120 · SseAutoConfiguration.java:133</span> | true | 是否注册内置订阅端点（生产建议关闭并自建带鉴权的端点）。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.sse.ticket-path`<br><span class="cfg-src">java.lang.String · SseProperties.java:39</span> | /ypbin/sse/ticket | 一次性订阅票据签发端点路径（Header 令牌鉴权场景：先换票再用 ticket 订阅）<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.sse.ticket-ttl-seconds`<br><span class="cfg-src">java.lang.Long · SseProperties.java:42</span> | 30 | 一次性订阅票据有效期（秒），换票后应尽快用于订阅<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：— |
| `ypbin.sse.timeout`<br><span class="cfg-src">java.lang.Long · SseProperties.java:51 · SseProperties.java:51 · additional-spring-configuration-metadata.json:1</span> | 0 | SSE 连接总超时，单位毫秒；0 表示不超时，由心跳负责保活与死连接检测。<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：— |
| `ypbin.websocket.allowed-origin-patterns`<br><span class="cfg-src">java.lang.String · WebSocketProperties.java:42</span> | &#42; | 允许跨域的来源模式<br>可选值：—<br><strong>注意</strong>：默认 &#42; 适合开发，生产环境应收敛为可信域名。 |
| `ypbin.websocket.application-prefix`<br><span class="cfg-src">java.lang.String · WebSocketProperties.java:36</span> | /app | 客户端订阅目的地前缀<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.websocket.broker-prefix`<br><span class="cfg-src">java.lang.String · WebSocketProperties.java:39</span> | /topic | 广播消息目的地前缀<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.websocket.enabled`<br><span class="cfg-src">java.lang.Boolean · WebSocketProperties.java:30 · WebSocketAutoConfiguration.java:44</span> | false | 是否启用 WebSocket，默认关闭（需显式开启）<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.websocket.endpoint`<br><span class="cfg-src">java.lang.String · WebSocketProperties.java:33</span> | /ws | STOMP 端点路径<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.websocket.heartbeat-client`<br><span class="cfg-src">java.lang.Long · WebSocketProperties.java:48</span> | 10000 | 期望客户端心跳间隔（毫秒），0 表示不要求<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.websocket.heartbeat-server`<br><span class="cfg-src">java.lang.Long · WebSocketProperties.java:45</span> | 10000 | 服务端心跳发送间隔（毫秒），0 表示不发送。用于保活与探测半开连接<br>可选值：—<br><strong>注意</strong>：— |
| `sms.is-print`<br><span class="cfg-src">java.lang.Boolean · SmsDefaultsEnvironmentPostProcessor.java:47</span> | false | sms4j 是否仅打印短信而不真实发送；starter 默认关闭打印模式。<br>可选值：—<br><strong>注意</strong>：— |
| `sms.blends.&lt;config-id&gt;.&#42;`<br><span class="cfg-src">java.lang.Object · MODULES.md:1173</span> | — | sms4j 厂商配置：supplier、access-key-id、access-key-secret、signature、template-id 等。<br>可选值：—<br><strong>注意</strong>：— |

## ypbin-starter-security

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `ypbin.security.client-enabled`<br><span class="cfg-src">java.lang.Boolean · SecurityProperties.java:51</span> | true | 是否启用客户端校验，默认开启<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.security.clients`<br><span class="cfg-src">java.util.List&lt;cn.ypbin.starter.security.client.LoginClient&gt; · SecurityProperties.java:57</span> | [object Object] | 配置文件客户端列表；业务方提供 LoginClientProvider 后可由数据库接管<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.security.clients[].active-timeout`<br><span class="cfg-src">java.lang.Long · LoginClient.java:56</span> | — | Token 活跃超时秒数；空时继承 Sa-Token 全局配置。<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：— |
| `ypbin.security.clients[].auth-types`<br><span class="cfg-src">java.util.Set&lt;java.lang.String&gt; · LoginClient.java:50</span> | — | 允许的认证方式集合。<br>可选值：ACCOUNT / PHONE / EMAIL / SOCIAL<br><strong>注意</strong>：— |
| `ypbin.security.clients[].client-id`<br><span class="cfg-src">java.lang.String · LoginClient.java:41</span> | — | 客户端唯一 ID。<br><strong>必填：配置该客户端条目时必填。</strong><br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.security.clients[].client-secret`<br><span class="cfg-src">java.lang.String · LoginClient.java:44</span> | — | 客户端密钥；浏览器端可为空，服务端或开放平台可启用。<br><strong>必填：启用客户端密钥校验时必填。</strong><br>可选值：—<br><strong>注意</strong>：不要提交明文密钥；使用环境变量或密钥管理服务。 / 敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。 |
| `ypbin.security.clients[].client-type`<br><span class="cfg-src">java.lang.String · LoginClient.java:47</span> | WEB | 客户端类型。<br>可选值：WEB / APP / MINI / API<br><strong>注意</strong>：— |
| `ypbin.security.clients[].concurrent`<br><span class="cfg-src">java.lang.Boolean · LoginClient.java:59</span> | — | 是否允许同账号多端同时登录；空时继承 Sa-Token。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.security.clients[].enabled`<br><span class="cfg-src">java.lang.Boolean · LoginClient.java:83</span> | true | 是否启用该客户端。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.security.clients[].lasting-cookie`<br><span class="cfg-src">java.lang.Boolean · LoginClient.java:77</span> | — | 是否使用持久 Cookie；空时继承 Sa-Token。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.security.clients[].max-login-count`<br><span class="cfg-src">java.lang.Integer · LoginClient.java:65</span> | — | 同账号最大登录数量；空时继承 Sa-Token，-1 通常表示不限制。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.security.clients[].overflow-logout-mode`<br><span class="cfg-src">cn.dev33.satoken.stp.parameter.enums.SaLogoutMode · LoginClient.java:74</span> | — | 超过最大登录数时的下线方式；空时继承 Sa-Token。<br>可选值：LOGOUT / KICKOUT / REPLACED<br><strong>注意</strong>：— |
| `ypbin.security.clients[].replaced-login-exit-mode`<br><span class="cfg-src">cn.dev33.satoken.stp.parameter.enums.SaReplacedLoginExitMode · LoginClient.java:71</span> | — | 并发关闭时新旧设备谁放弃会话；空时继承 Sa-Token。<br>可选值：OLD&#95;DEVICE / NEW&#95;DEVICE<br><strong>注意</strong>：— |
| `ypbin.security.clients[].replaced-range`<br><span class="cfg-src">cn.dev33.satoken.stp.parameter.enums.SaReplacedRange · LoginClient.java:68</span> | — | 顶人下线范围；空时继承 Sa-Token。<br>可选值：CURR&#95;DEVICE&#95;TYPE / ALL&#95;DEVICE&#95;TYPE<br><strong>注意</strong>：— |
| `ypbin.security.clients[].share`<br><span class="cfg-src">java.lang.Boolean · LoginClient.java:62</span> | — | 多端登录是否共享 Token；空时继承 Sa-Token。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.security.clients[].timeout`<br><span class="cfg-src">java.lang.Long · LoginClient.java:53</span> | — | Token 固定有效期秒数；空时继承 Sa-Token 全局配置。<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：— |
| `ypbin.security.clients[].write-header`<br><span class="cfg-src">java.lang.Boolean · LoginClient.java:80</span> | — | 登录后是否将 Token 写入响应头；空时继承 Sa-Token。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.security.default-client-id`<br><span class="cfg-src">java.lang.String · SecurityProperties.java:54</span> | web-admin | 默认客户端 ID，登录请求未传 clientId 时使用<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.security.enabled`<br><span class="cfg-src">java.lang.Boolean · SecurityProperties.java:36 · additional-spring-configuration-metadata.json:1 · SecurityAuditorAutoConfiguration.java:44 · SecurityAutoConfiguration.java:72 · SecurityLogClientAutoConfiguration.java:46 · SecuritySseAutoConfiguration.java:52</span> | true | 是否启用安全模块。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.security.exclude-api-doc`<br><span class="cfg-src">java.lang.Boolean · SecurityProperties.java:48 · additional-spring-configuration-metadata.json:1</span> | true | 检测到 SpringDoc 时是否自动放行 Swagger/文档相关路径。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.security.excludes`<br><span class="cfg-src">java.util.List&lt;java.lang.String&gt; · SecurityProperties.java:45</span> | — | 放行路径（无需登录即可访问），支持 Ant 风格<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.security.includes`<br><span class="cfg-src">java.util.List&lt;java.lang.String&gt; · SecurityProperties.java:42</span> | — | 拦截路径，默认拦截全部<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.security.interceptor`<br><span class="cfg-src">java.lang.Boolean · SecurityProperties.java:39 · additional-spring-configuration-metadata.json:1 · SecurityAutoConfiguration.java:215</span> | true | 是否注册全局登录校验拦截器（SaInterceptor）。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.security.password`<br><span class="cfg-src">cn.ypbin.starter.security.password.policy.PasswordPolicy · SecurityProperties.java:60</span> | — | 密码安全策略；业务方提供 PasswordPolicyProvider 后可由配置中心/数据库接管<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。 |
| `ypbin.security.password.allow-contain-username`<br><span class="cfg-src">java.lang.Boolean · PasswordPolicy.java:58</span> | false | 是否允许密码包含用户名及其反序。<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。 |
| `ypbin.security.password.error-lock-count`<br><span class="cfg-src">java.lang.Integer · PasswordPolicy.java:61</span> | 5 | 登录错误锁定阈值；0 表示不锁定。<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。 |
| `ypbin.security.password.expiration-days`<br><span class="cfg-src">java.lang.Integer · PasswordPolicy.java:67</span> | 0 | 密码有效期天数；0 表示永不过期。<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。 |
| `ypbin.security.password.expiration-warning-days`<br><span class="cfg-src">java.lang.Integer · PasswordPolicy.java:70</span> | 0 | 密码到期提醒天数；0 表示不提醒。<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。 |
| `ypbin.security.password.history-count`<br><span class="cfg-src">java.lang.Integer · PasswordPolicy.java:73</span> | 0 | 历史密码不可重复次数；0 表示不校验。<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。 |
| `ypbin.security.password.lock-minutes`<br><span class="cfg-src">java.lang.Integer · PasswordPolicy.java:64</span> | 15 | 账号锁定时长，单位分钟。<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。 |
| `ypbin.security.password.max-length`<br><span class="cfg-src">java.lang.Integer · PasswordPolicy.java:40</span> | 32 | 密码最大长度。<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。 |
| `ypbin.security.password.min-length`<br><span class="cfg-src">java.lang.Integer · PasswordPolicy.java:37</span> | 8 | 密码最小长度。<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。 |
| `ypbin.security.password.require-digit`<br><span class="cfg-src">java.lang.Boolean · PasswordPolicy.java:43</span> | true | 是否必须包含数字。<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。 |
| `ypbin.security.password.require-letter`<br><span class="cfg-src">java.lang.Boolean · PasswordPolicy.java:46</span> | true | 是否必须包含字母。<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。 |
| `ypbin.security.password.require-lowercase`<br><span class="cfg-src">java.lang.Boolean · PasswordPolicy.java:52</span> | false | 是否必须包含小写字母。<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。 |
| `ypbin.security.password.require-symbol`<br><span class="cfg-src">java.lang.Boolean · PasswordPolicy.java:55</span> | false | 是否必须包含特殊字符。<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。 |
| `ypbin.security.password.require-uppercase`<br><span class="cfg-src">java.lang.Boolean · PasswordPolicy.java:49</span> | false | 是否必须包含大写字母。<br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。 |
| `sa-token.timeout`<br><span class="cfg-src">java.lang.Long · MODULES.md:345</span> | 2592000 | Sa-Token 固定有效期秒数。<br>可选值：—<br><strong>注意</strong>：— |
| `sa-token.active-timeout`<br><span class="cfg-src">java.lang.Long · MODULES.md:346</span> | 1800 | Sa-Token 活跃超时秒数。<br>可选值：—<br><strong>注意</strong>：— |
| `sa-token.auto-renew`<br><span class="cfg-src">java.lang.Boolean · MODULES.md:347</span> | true | 是否自动续签活跃 Token。<br>可选值：—<br><strong>注意</strong>：— |

## ypbin-starter-sensitive-words

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `ypbin.sensitive-words.enabled`<br><span class="cfg-src">java.lang.Boolean · SensitiveWordProperties.java:32 · SensitiveWordAutoConfiguration.java:41</span> | true | 是否启用敏感词过滤，默认开启<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.sensitive-words.replacement`<br><span class="cfg-src">java.lang.Character · SensitiveWordProperties.java:38</span> | &#42; | 替换字符<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.sensitive-words.words`<br><span class="cfg-src">java.util.List&lt;java.lang.String&gt; · SensitiveWordProperties.java:35</span> | — | 静态敏感词库（当未提供 SensitiveWordProvider 时使用）<br>可选值：—<br><strong>注意</strong>：— |

## ypbin-starter-sign

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `ypbin.sign.algorithm`<br><span class="cfg-src">cn.ypbin.starter.sign.core.SignAlgorithm · SignProperties.java:40</span> | hmac-sha256 | 签名算法，默认 HMAC-SHA256<br>可选值：MD5 / HMAC&#95;SHA256<br><strong>注意</strong>：— |
| `ypbin.sign.apps`<br><span class="cfg-src">java.util.List&lt;cn.ypbin.starter.sign.autoconfigure.SignProperties$AppInfo&gt; · SignProperties.java:49</span> | — | 应用列表<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.sign.apps[].access-key`<br><span class="cfg-src">java.lang.String · SignProperties.java:132</span> | — | 应用 Access Key。<br><strong>必填：配置该签名应用时必填。</strong><br>可选值：—<br><strong>注意</strong>：敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。 |
| `ypbin.sign.apps[].app-name`<br><span class="cfg-src">java.lang.String · SignProperties.java:136</span> | — | 应用名称。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.sign.apps[].enabled`<br><span class="cfg-src">java.lang.Boolean · SignProperties.java:34</span> | true | 是否启用该应用。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.sign.apps[].expire-time`<br><span class="cfg-src">java.time.LocalDateTime · SignProperties.java:138</span> | — | 失效时间；空表示永不过期。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.sign.apps[].secret-key`<br><span class="cfg-src">java.lang.String · SignProperties.java:134</span> | — | 应用 Secret Key。<br><strong>必填：配置该签名应用时必填。</strong><br>可选值：—<br><strong>注意</strong>：必须保密，建议加密存储并支持轮换。 / 敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。 |
| `ypbin.sign.enabled`<br><span class="cfg-src">java.lang.Boolean · SignProperties.java:34 · SignAutoConfiguration.java:60</span> | false | 是否启用签名校验<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.sign.mode`<br><span class="cfg-src">cn.ypbin.starter.sign.autoconfigure.SignProperties$Mode · SignProperties.java:37</span> | annotation | 校验模式：ANNOTATION（仅 @ApiSign 接口）或 GLOBAL（全局拦截，按 skip-path 排除）<br>可选值：ANNOTATION / GLOBAL<br><strong>注意</strong>：— |
| `ypbin.sign.replay-protect`<br><span class="cfg-src">java.lang.Boolean · SignProperties.java:46</span> | true | 是否启用 nonce 防重放<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.sign.skip-param-names`<br><span class="cfg-src">java.util.List&lt;java.lang.String&gt; · SignProperties.java:55</span> | — | 排除参与签名的参数名<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.sign.skip-path`<br><span class="cfg-src">java.util.List&lt;java.lang.String&gt; · SignProperties.java:52</span> | — | GLOBAL 模式下排除的路径（Ant 风格）<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.sign.timeout`<br><span class="cfg-src">java.lang.Long · SignProperties.java:43</span> | 60 | 签名有效期（秒）<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：— |

## ypbin-starter-social

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `ypbin.social.enabled`<br><span class="cfg-src">java.lang.Boolean · spring-configuration-metadata.json:1 · additional-spring-configuration-metadata.json:1 · SocialAutoConfiguration.java:41</span> | true | 是否启用第三方登录（JustAuth）自动配置。<br>可选值：—<br><strong>注意</strong>：— |

## ypbin-starter-storage

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `ypbin.storage.default-platform`<br><span class="cfg-src">java.lang.String · StorageProperties.java:38</span> | — | 默认存储平台标识<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.storage.enabled`<br><span class="cfg-src">java.lang.Boolean · StorageProperties.java:35 · StorageAutoConfiguration.java:56</span> | true | 是否启用存储模块，默认开启<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.storage.local`<br><span class="cfg-src">java.util.List&lt;cn.ypbin.starter.storage.autoconfigure.StorageProperties$LocalConfig&gt; · StorageProperties.java:44</span> | — | 本地存储源列表<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.storage.local[].base-path`<br><span class="cfg-src">java.lang.String · StorageProperties.java:101</span> | — | 本地存储根目录。<br><strong>必填：启用该本地存储源时必填。</strong><br>可选值：—<br><strong>注意</strong>：目录需限制操作系统权限，避免暴露敏感文件。 |
| `ypbin.storage.local[].domain`<br><span class="cfg-src">java.lang.String · StorageProperties.java:104</span> |  | 对外访问域名前缀。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.storage.local[].enabled`<br><span class="cfg-src">java.lang.Boolean · StorageProperties.java:35</span> | true | 是否启用该本地存储源。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.storage.local[].platform`<br><span class="cfg-src">java.lang.String · StorageProperties.java:95</span> | — | 本地存储平台唯一标识。<br><strong>必填：配置该存储源时必填。</strong><br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.storage.max-file-size`<br><span class="cfg-src">java.lang.Long · StorageProperties.java:41</span> | -1 | 单次上传默认最大字节数，-1 不限制<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.storage.oss`<br><span class="cfg-src">java.util.List&lt;cn.ypbin.starter.storage.autoconfigure.StorageProperties$OssConfig&gt; · StorageProperties.java:47</span> | — | S3 兼容对象存储源列表<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.storage.oss[].access-key`<br><span class="cfg-src">java.lang.String · StorageProperties.java:160</span> | — | 访问密钥 ID。<br><strong>必填：启用该对象存储源时必填。</strong><br>可选值：—<br><strong>注意</strong>：通过环境变量或密钥管理服务注入。 / 敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。 |
| `ypbin.storage.oss[].bucket`<br><span class="cfg-src">java.lang.String · StorageProperties.java:166</span> | — | 桶名。<br><strong>必填：启用该对象存储源时必填。</strong><br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.storage.oss[].domain`<br><span class="cfg-src">java.lang.String · StorageProperties.java:104</span> |  | 自定义访问域名；空时由客户端生成。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.storage.oss[].enabled`<br><span class="cfg-src">java.lang.Boolean · StorageProperties.java:35</span> | true | 是否启用该对象存储源。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.storage.oss[].endpoint`<br><span class="cfg-src">java.lang.String · StorageProperties.java:154</span> | — | S3 兼容服务端点。<br><strong>必填：启用该对象存储源时通常必填。</strong><br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.storage.oss[].path-style-access`<br><span class="cfg-src">java.lang.Boolean · StorageProperties.java:169</span> | true | 是否使用 path-style 访问；MinIO 等通常需要。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.storage.oss[].platform`<br><span class="cfg-src">java.lang.String · StorageProperties.java:95</span> | — | 对象存储平台唯一标识。<br><strong>必填：配置该存储源时必填。</strong><br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.storage.oss[].region`<br><span class="cfg-src">java.lang.String · StorageProperties.java:157</span> | us-east-1 | 对象存储区域。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.storage.oss[].secret-key`<br><span class="cfg-src">java.lang.String · StorageProperties.java:163</span> | — | 访问密钥。<br><strong>必填：启用该对象存储源时必填。</strong><br>可选值：—<br><strong>注意</strong>：禁止写入仓库或日志。 / 敏感配置不得提交到版本库或打印到日志，生产环境应使用环境变量或密钥管理服务。 |
| `spring.servlet.multipart.max-file-size`<br><span class="cfg-src">org.springframework.util.unit.DataSize · MODULES.md:579</span> | — | Servlet 单文件上传上限；应与 ypbin.storage.max-file-size 协同。<br>可选值：—<br><strong>注意</strong>：— |
| `spring.servlet.multipart.max-request-size`<br><span class="cfg-src">org.springframework.util.unit.DataSize · MODULES.md:579</span> | — | Servlet 单请求 multipart 总大小上限。<br>可选值：—<br><strong>注意</strong>：— |

## ypbin-starter-tools

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `ypbin.tools.idempotent.distributed`<br><span class="cfg-src">java.lang.Boolean · spring-configuration-metadata.json:1 · additional-spring-configuration-metadata.json:1 · ToolsAutoConfiguration.java:147</span> | true | 幂等存储是否优先使用 Redis 分布式实现（存在 StringRedisTemplate 时生效），否则使用内存兜底。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.tools.idempotent.enabled`<br><span class="cfg-src">java.lang.Boolean · spring-configuration-metadata.json:1 · additional-spring-configuration-metadata.json:1 · ToolsAutoConfiguration.java:94</span> | true | 是否启用幂等切面 @Idempotent。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.tools.lock.enabled`<br><span class="cfg-src">java.lang.Boolean · spring-configuration-metadata.json:1 · additional-spring-configuration-metadata.json:1 · ToolsAutoConfiguration.java:110</span> | true | 是否启用分布式锁切面 @DistributedLock。存在 Redis 时用分布式锁，否则退化为单机内存锁。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.tools.rate-limit.distributed`<br><span class="cfg-src">java.lang.Boolean · spring-configuration-metadata.json:1 · additional-spring-configuration-metadata.json:1 · ToolsAutoConfiguration.java:137</span> | true | 限流存储是否优先使用 Redis 分布式实现（存在 StringRedisTemplate 时生效），否则使用内存兜底。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.tools.rate-limit.enabled`<br><span class="cfg-src">java.lang.Boolean · spring-configuration-metadata.json:1 · additional-spring-configuration-metadata.json:1 · ToolsAutoConfiguration.java:78</span> | true | 是否启用限流切面 @RateLimit。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.tools.rate-limit.trust-forwarded`<br><span class="cfg-src">java.lang.Boolean · RateLimitProperties.java:1</span> | false | IP 限流键是否信任 X-Forwarded-For 等转发头：false（默认）取真实对端地址（request.getRemoteAddr），防伪造转发头绕过限流；位于可信反向代理之后需显式开启为 true 以按真实客户端 IP 限流。<br>可选值：—<br><strong>注意</strong>：— |

## ypbin-starter-web

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `ypbin.web.cors.allow-credentials`<br><span class="cfg-src">java.lang.Boolean · CorsProperties.java:49</span> | true | 是否允许携带凭证<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.web.cors.allowed-headers`<br><span class="cfg-src">java.util.List&lt;java.lang.String&gt; · CorsProperties.java:43</span> | &#42; | 允许的请求头<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.web.cors.allowed-methods`<br><span class="cfg-src">java.util.List&lt;java.lang.String&gt; · CorsProperties.java:40</span> | &#42; | 允许的请求方法<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.web.cors.allowed-origin-patterns`<br><span class="cfg-src">java.util.List&lt;java.lang.String&gt; · CorsProperties.java:37</span> | &#42; | 允许的来源模式（支持 https&#58;//&#42;.example.com 形式）<br>可选值：—<br><strong>注意</strong>：生产环境避免通配跨域来源；启用凭证时必须使用受控来源。 |
| `ypbin.web.cors.enabled`<br><span class="cfg-src">java.lang.Boolean · CorsProperties.java:34 · WebAutoConfiguration.java:67</span> | false | 是否启用跨域，默认关闭<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.web.cors.exposed-headers`<br><span class="cfg-src">java.util.List&lt;java.lang.String&gt; · CorsProperties.java:46</span> | — | 暴露给浏览器的响应头<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.web.cors.max-age`<br><span class="cfg-src">java.lang.Long · CorsProperties.java:52</span> | 3600 | 预检请求缓存时间（秒）<br>可选值：以字段说明为准的非负数；特殊哨兵值见说明<br><strong>注意</strong>：— |
| `ypbin.web.repeatable-read.enabled`<br><span class="cfg-src">java.lang.Boolean · spring-configuration-metadata.json:1 · additional-spring-configuration-metadata.json:1 · WebAutoConfiguration.java:92</span> | false | 是否启用可重复读请求过滤器，把带 body 的请求包装为可重复读，供 XSS、签名、日志等下游复用。<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.web.xss.enabled`<br><span class="cfg-src">java.lang.Boolean · XssProperties.java:32 · WebAutoConfiguration.java:112</span> | false | 是否启用 XSS 过滤，默认关闭（需显式开启）<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.web.xss.excludes`<br><span class="cfg-src">java.util.List&lt;java.lang.String&gt; · XssProperties.java:35</span> | — | 放行路径（这些路径不做 XSS 清洗），支持 Ant 风格<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.web.repeatable-read.max-body-bytes`<br><span class="cfg-src">java.lang.Long · RepeatableReadProperties.java:1</span> | 10485760 | 单请求可重复读缓存体的最大字节数（默认 10MB，取值范围 (0, 64MB]）；超限请求在过滤器层拒绝缓存并直接返回统一响应（HTTP 200 + code=413），防止超大请求体占满内存。非法配置在装配期即失败。<br>可选值：—<br><strong>注意</strong>：— |
| `spring.mvc.throw-exception-if-no-handler-found`<br><span class="cfg-src">java.lang.Boolean · WebDefaultsEnvironmentPostProcessor.java:48</span> | true | 未匹配处理器时抛出异常，以便统一输出 JSON 404。<br>可选值：—<br><strong>注意</strong>：— |
| `spring.web.resources.add-mappings`<br><span class="cfg-src">java.lang.Boolean · WebDefaultsEnvironmentPostProcessor.java:50</span> | false | 是否启用默认静态资源映射；starter 默认关闭以确保未知路径进入统一 404。<br>可选值：—<br><strong>注意</strong>：— |

## ypbin-starter-xxljob

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `ypbin.xxl-job.enabled`<br><span class="cfg-src">java.lang.Boolean · XxlJobProperties.java:37 · XxlJobAutoConfiguration.java:41</span> | false | 是否启用 XXL-JOB 执行器<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.xxl-job.admin-addresses`<br><span class="cfg-src">java.lang.String · XxlJobProperties.java:40</span> | — | 调度中心地址（多个逗号分隔）<br><strong>必填：enabled=true 时必须</strong><br>可选值：—<br><strong>注意</strong>：缺失时启动即抛错暴露，禁止静默降级 |
| `ypbin.xxl-job.access-token`<br><span class="cfg-src">java.lang.String · XxlJobProperties.java:43</span> |  | 执行器通讯 Token（与 admin 端保持一致，为空则不做校验）<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.xxl-job.appname`<br><span class="cfg-src">java.lang.String · XxlJobProperties.java:46</span> | — | 执行器名称（AppName），admin 端按此注册与路由<br><strong>必填：enabled=true 时必须</strong><br>可选值：—<br><strong>注意</strong>：缺失时启动即抛错暴露，禁止静默降级 |
| `ypbin.xxl-job.address`<br><span class="cfg-src">java.lang.String · XxlJobProperties.java:49</span> | — | 执行器注册地址（为空时自动注册本机 IP）<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.xxl-job.ip`<br><span class="cfg-src">java.lang.String · XxlJobProperties.java:52</span> | — | 执行器 IP（为空自动获取）<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.xxl-job.port`<br><span class="cfg-src">java.lang.Integer · XxlJobProperties.java:55</span> | 9999 | 执行器端口（执行器与 admin 通讯用）<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.xxl-job.log-path`<br><span class="cfg-src">java.lang.String · XxlJobProperties.java:58</span> | — | 执行器日志保存路径（为空使用默认临时目录）<br>可选值：—<br><strong>注意</strong>：— |
| `ypbin.xxl-job.log-retention-days`<br><span class="cfg-src">java.lang.Integer · XxlJobProperties.java:61</span> | 30 | 执行器日志保存天数<br>可选值：—<br><strong>注意</strong>：— |
