---
title: Admin 配置参考
description: 环境变量、application.yml 与运行时数据库参数的逐项说明。
---

# Admin 配置参考

环境变量、application.yml 与运行时数据库参数。本页共 **133** 项，包含类型、默认值、必填条件、可选值、生产注意与源码来源。

## environment

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `DB&#95;HOST`<br><span class="cfg-src">string · .env.example:7</span> | localhost | db host<br><strong>可选；未设置时使用 application.yml 默认值</strong><br><strong>注意</strong>：— |
| `DB&#95;PORT`<br><span class="cfg-src">integer · .env.example:8</span> | 3306 | db port<br><strong>可选；未设置时使用 application.yml 默认值</strong><br><strong>注意</strong>：— |
| `DB&#95;NAME`<br><span class="cfg-src">string · .env.example:9</span> | ypbin&#95;admin | db name<br><strong>可选；未设置时使用 application.yml 默认值</strong><br><strong>注意</strong>：— |
| `DB&#95;USER`<br><span class="cfg-src">string · .env.example:10</span> | root | db user<br><strong>可选；未设置时使用 application.yml 默认值</strong><br><strong>注意</strong>：生产禁止使用 root，采用最小权限账号。 |
| `DB&#95;PASSWORD`<br><span class="cfg-src">string · .env.example:11</span> |  | db password<br><strong>必填：生产环境必须设置</strong><br><strong>注意</strong>：敏感值不得提交、打印或进入报告；生产使用 Secret 管理并轮换。 |
| `REDIS&#95;HOST`<br><span class="cfg-src">string · .env.example:14</span> | localhost | redis host<br><strong>可选；未设置时使用 application.yml 默认值</strong><br><strong>注意</strong>：— |
| `REDIS&#95;PORT`<br><span class="cfg-src">integer · .env.example:15</span> | 6379 | redis port<br><strong>可选；未设置时使用 application.yml 默认值</strong><br><strong>注意</strong>：— |
| `REDIS&#95;DB`<br><span class="cfg-src">integer · .env.example:16</span> | 0 | redis db<br><strong>可选；未设置时使用 application.yml 默认值</strong><br><strong>注意</strong>：— |
| `REDIS&#95;PASSWORD`<br><span class="cfg-src">string · .env.example:17</span> |  | redis password<br><strong>可选；未设置时使用 application.yml 默认值</strong><br><strong>注意</strong>：敏感值不得提交、打印或进入报告；生产使用 Secret 管理并轮换。 |
| `LICENSE&#95;ISSUER&#95;PUBLIC&#95;KEY`<br><span class="cfg-src">string · .env.example:23</span> |  | license issuer public key<br><strong>可选；未设置时使用 application.yml 默认值</strong><br><strong>注意</strong>：— |
| `LICENSE&#95;ISSUER&#95;PRIVATE&#95;KEY`<br><span class="cfg-src">string · .env.example:24</span> |  | license issuer private key<br><strong>必填：执行 License 签发时必须设置</strong><br><strong>注意</strong>：敏感值不得提交、打印或进入报告；生产使用 Secret 管理并轮换。 |
| `LICENSE&#95;ISSUER&#95;SM4&#95;KEY`<br><span class="cfg-src">string · .env.example:25</span> |  | license issuer sm4 key<br><strong>必填：执行 License 签发时必须设置</strong><br><strong>注意</strong>：敏感值不得提交、打印或进入报告；生产使用 Secret 管理并轮换。 |
| `ADMIN&#95;BOOTSTRAP&#95;ENABLED`<br><span class="cfg-src">boolean · application.yml:38</span> | false | admin bootstrap enabled<br><strong>可选；未设置时使用 application.yml 默认值</strong><br>可选值：true / false<br><strong>注意</strong>：— |
| `ADMIN&#95;BOOTSTRAP&#95;USERNAME`<br><span class="cfg-src">string · application.yml:39</span> |  | admin bootstrap username<br><strong>必填：ADMIN&#95;BOOTSTRAP&#95;ENABLED=true 时必须设置</strong><br><strong>注意</strong>：— |
| `ADMIN&#95;BOOTSTRAP&#95;PASSWORD`<br><span class="cfg-src">string · application.yml:40</span> |  | admin bootstrap password<br><strong>必填：ADMIN&#95;BOOTSTRAP&#95;ENABLED=true 时必须设置</strong><br><strong>注意</strong>：敏感值不得提交、打印或进入报告；生产使用 Secret 管理并轮换。 |
| `ADMIN&#95;BOOTSTRAP&#95;REAL&#95;NAME`<br><span class="cfg-src">string · application.yml:41</span> | 平台管理员 | admin bootstrap real name<br><strong>可选；未设置时使用 application.yml 默认值</strong><br><strong>注意</strong>：— |
| `ADMIN&#95;BOOTSTRAP&#95;TENANT&#95;ID`<br><span class="cfg-src">integer · application.yml:42</span> | 1 | admin bootstrap tenant id<br><strong>可选；未设置时使用 application.yml 默认值</strong><br><strong>注意</strong>：— |
| `ADMIN&#95;JOB&#95;RECONCILE&#95;DELAY`<br><span class="cfg-src">integer · application.yml:44</span> | 30000 | admin job reconcile delay<br><strong>可选；未设置时使用 application.yml 默认值</strong><br><strong>注意</strong>：— |
| `API&#95;CRYPTO&#95;KEY`<br><span class="cfg-src">string · application.yml:132</span> |  | api crypto key<br><strong>可选；未设置时使用 application.yml 默认值</strong><br><strong>注意</strong>：敏感值不得提交、打印或进入报告；生产使用 Secret 管理并轮换。 / ypbin.api-crypto.key 已生效：接口加解密 AES 密钥由部署环境注入（16/24/32 字节）。 |

## application

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `server.port`<br><span class="cfg-src">integer · application.yml:2</span> | 8080 | HTTP 服务监听端口<br><strong>必填：对应组件启用时生效</strong><br>可选值：1..65535<br><strong>注意</strong>：— |
| `spring.application.name`<br><span class="cfg-src">string · application.yml:6</span> | ypbin-admin | 应用名称<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：— |
| `spring.datasource.driver-class-name`<br><span class="cfg-src">string · application.yml:8</span> | com.mysql.cj.jdbc.Driver | spring.datasource.driver-class-name 配置<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：— |
| `spring.datasource.url`<br><span class="cfg-src">string · application.yml:9</span> | <code class="cfg-value">jdbc:mysql&#58;//localhost:3306/ypbin&#95;admin?useUnicode=true&amp;characterEncoding=utf8&amp;serverTimezone=Asia/Shanghai&amp;useSSL=false&amp;allowPublicKeyRetrieval=true</code> | MySQL JDBC 连接串<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：当前 useSSL=false 且 allowPublicKeyRetrieval=true；生产应启用并校验 TLS。 |
| `spring.datasource.username`<br><span class="cfg-src">string · application.yml:10</span> | root | 数据库账号<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：— |
| `spring.datasource.password`<br><span class="cfg-src">string · application.yml:11</span> |  | 数据库密码<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：— |
| `spring.data.redis.host`<br><span class="cfg-src">string · application.yml:14</span> | localhost | Redis 主机<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：— |
| `spring.data.redis.port`<br><span class="cfg-src">integer · application.yml:15</span> | 6379 | Redis 端口<br><strong>必填：对应组件启用时生效</strong><br>可选值：1..65535<br><strong>注意</strong>：— |
| `spring.data.redis.database`<br><span class="cfg-src">integer · application.yml:16</span> | 0 | Redis 逻辑库<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：— |
| `spring.data.redis.password`<br><span class="cfg-src">string · application.yml:17</span> |  | Redis 密码<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：— |
| `spring.flyway.enabled`<br><span class="cfg-src">boolean · application.yml:19</span> | true | 启动时执行 Flyway 迁移<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：— |
| `spring.flyway.baseline-on-migrate`<br><span class="cfg-src">boolean · application.yml:20</span> | true | spring.flyway.baseline-on-migrate 配置<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：— |
| `spring.flyway.locations`<br><span class="cfg-src">string · application.yml:21</span> | classpath:db/migration | spring.flyway.locations 配置<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：— |
| `spring.flyway.encoding`<br><span class="cfg-src">string · application.yml:22</span> | UTF-8 | spring.flyway.encoding 配置<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：— |
| `sa-token.token-name`<br><span class="cfg-src">string · application.yml:26</span> | Authorization | sa-token.token-name 配置<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：— |
| `sa-token.token-prefix`<br><span class="cfg-src">string · application.yml:27</span> | Bearer | sa-token.token-prefix 配置<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：— |
| `sa-token.timeout`<br><span class="cfg-src">integer · application.yml:28</span> | 2592000 | sa-token.timeout 配置<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：— |
| `sa-token.active-timeout`<br><span class="cfg-src">integer · application.yml:29</span> | 1800 | sa-token.active-timeout 配置<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：— |
| `sa-token.auto-renew`<br><span class="cfg-src">boolean · application.yml:30</span> | true | sa-token.auto-renew 配置<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：— |
| `sa-token.is-read-cookie`<br><span class="cfg-src">boolean · application.yml:31</span> | false | sa-token.is-read-cookie 配置<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：— |
| `sa-token.is-print`<br><span class="cfg-src">boolean · application.yml:32</span> | false | sa-token.is-print 配置<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：— |
| `ypbin.admin.bootstrap.enabled`<br><span class="cfg-src">boolean · application.yml:38</span> | false | 一次性平台管理员初始化开关<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：— |
| `ypbin.admin.bootstrap.username`<br><span class="cfg-src">string · application.yml:39</span> |  | 初始化管理员用户名<br><strong>必填：ypbin.admin.bootstrap.enabled=true 时必须有效</strong><br><strong>注意</strong>：— |
| `ypbin.admin.bootstrap.password`<br><span class="cfg-src">string · application.yml:40</span> |  | 初始化管理员密码<br><strong>必填：ypbin.admin.bootstrap.enabled=true 时必须有效</strong><br><strong>注意</strong>：— |
| `ypbin.admin.bootstrap.real-name`<br><span class="cfg-src">string · application.yml:41</span> | 平台管理员 | ypbin.admin.bootstrap.real-name 配置<br><strong>必填：ypbin.admin.bootstrap.enabled=true 时必须有效</strong><br><strong>注意</strong>：— |
| `ypbin.admin.bootstrap.tenant-id`<br><span class="cfg-src">integer · application.yml:42</span> | 1 | ypbin.admin.bootstrap.tenant-id 配置<br><strong>必填：ypbin.admin.bootstrap.enabled=true 时必须有效</strong><br><strong>注意</strong>：— |
| `ypbin.admin.job.reconcile-delay`<br><span class="cfg-src">integer · application.yml:44</span> | 30000 | 任务对账间隔（毫秒）<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：— |
| `ypbin.web.repeatable-read.enabled`<br><span class="cfg-src">boolean · application.yml:47</span> | true | ypbin.web.repeatable-read.enabled 配置<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：— |
| `ypbin.web.cors.enabled`<br><span class="cfg-src">boolean · application.yml:49</span> | false | ypbin.web.cors.enabled 配置<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：— |
| `ypbin.web.cors.allowed-origin-patterns`<br><span class="cfg-src">array&lt;string&gt; · application.yml:50</span> | http&#58;//localhost:&#42; | ypbin.web.cors.allowed-origin-patterns 配置<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：— |
| `ypbin.web.xss.enabled`<br><span class="cfg-src">boolean · application.yml:52</span> | true | ypbin.web.xss.enabled 配置<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：— |
| `ypbin.web.xss.excludes`<br><span class="cfg-src">array&lt;string&gt; · application.yml:53</span> | /webhook/&#42;&#42; | ypbin.web.xss.excludes 配置<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：— |
| `ypbin.security.interceptor`<br><span class="cfg-src">boolean · application.yml:55</span> | true | ypbin.security.interceptor 配置<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：— |
| `ypbin.tenant.enabled`<br><span class="cfg-src">boolean · application.yml:68</span> | true | ypbin.tenant.enabled 配置<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：— |
| `ypbin.tenant.column`<br><span class="cfg-src">string · application.yml:69</span> | tenant&#95;id | ypbin.tenant.column 配置<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：— |
| `ypbin.sign.enabled`<br><span class="cfg-src">boolean · application.yml:92</span> | true | ypbin.sign.enabled 配置<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：— |
| `ypbin.sign.mode`<br><span class="cfg-src">string · application.yml:93</span> | ANNOTATION | 接口签名校验模式<br><strong>必填：对应组件启用时生效</strong><br>可选值：ANNOTATION / GLOBAL<br><strong>注意</strong>：— |
| `ypbin.license.enabled`<br><span class="cfg-src">boolean · application.yml:95</span> | false | ypbin.license.enabled 配置<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：— |
| `ypbin.license.issuer.public-key`<br><span class="cfg-src">string · application.yml:97</span> |  | ypbin.license.issuer.public-key 配置<br><strong>必填：签发时 private-key 与 sm4-key 必填</strong><br><strong>注意</strong>：— |
| `ypbin.license.issuer.private-key`<br><span class="cfg-src">string · application.yml:98</span> |  | License 签发 SM2 私钥<br><strong>必填：签发时 private-key 与 sm4-key 必填</strong><br><strong>注意</strong>：— |
| `ypbin.license.issuer.sm4-key`<br><span class="cfg-src">string · application.yml:99</span> |  | License 签发 SM4 密钥<br><strong>必填：签发时 private-key 与 sm4-key 必填</strong><br><strong>注意</strong>：— |
| `ypbin.log.access.enabled`<br><span class="cfg-src">boolean · application.yml:108</span> | true | ypbin.log.access.enabled 配置<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：— |
| `ypbin.data-permission.enabled`<br><span class="cfg-src">boolean · application.yml:117</span> | true | ypbin.data-permission.enabled 配置<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：— |
| `ypbin.async.enabled`<br><span class="cfg-src">boolean · application.yml:119</span> | true | ypbin.async.enabled 配置<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：— |
| `ypbin.sse.enabled`<br><span class="cfg-src">boolean · application.yml:121</span> | true | SSE 开关（对应 starter 的 ypbin.sse 前缀，正确绑定）<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：starter 的 SSE 配置前缀就是 ypbin.sse，本键正确生效。 |
| `captcha.expire.default`<br><span class="cfg-src">integer · application.yml:126</span> | 60000 | 行为验证码默认有效期<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：— |
| `ypbin.sensitive-words.replacement`<br><span class="cfg-src">string · application.yml:132</span> | &#42; | 敏感词替换字符（starter 前缀为 ypbin.sensitive-words，正确绑定）<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：ypbin.sensitive-words.replacement 已生效：敏感词命中后统一替换为该字符。 |
| `ypbin.i18n.enabled`<br><span class="cfg-src">boolean · application.yml:167</span> | true | 国际化开关（starter 前缀为 ypbin.i18n，正确绑定）<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：ypbin.i18n.enabled 已生效：按请求参数 lang 或请求头 Accept-Language 解析语言。 |
| `ypbin.api-crypto.key`<br><span class="cfg-src">string · application.yml:169</span> |  | 接口加解密 AES 密钥（starter 前缀为 ypbin.api-crypto，正确绑定）<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：ypbin.api-crypto.key 已生效：16/24/32 字节 AES 密钥，生产由环境变量 API&#95;CRYPTO&#95;KEY 注入。 |
| `ypbin.observability.enabled`<br><span class="cfg-src">boolean · application.yml:180</span> | true | 请求链路可观测性开关（starter 前缀为 ypbin.observability）<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：admin 当前未引入 ypbin-starter-cloud-observability 模块，本键无自动配置支撑（空配，不生效）。 |
| `ypbin.observability.request-id-header`<br><span class="cfg-src">string · application.yml:181</span> | X-Request-Id | 请求 ID 响应头名称（starter 前缀为 ypbin.observability）<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：admin 当前未引入 ypbin-starter-cloud-observability 模块，本键无自动配置支撑（空配，不生效）。 |
| `ypbin.observability.mdc-key`<br><span class="cfg-src">string · application.yml:182</span> | requestId | 日志 MDC 键名（starter 前缀为 ypbin.observability）<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：admin 当前未引入 ypbin-starter-cloud-observability 模块，本键无自动配置支撑（空配，不生效）。 |
| `ypbin.api-doc.enabled`<br><span class="cfg-src">boolean · application.yml:171</span> | true | API 文档开关（starter 前缀为 ypbin.api-doc，正确绑定）<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：ypbin.api-doc.enabled 已生效：Knife4j/Swagger 文档可访问。 |
| `ypbin.api-doc.title`<br><span class="cfg-src">string · application.yml:172</span> | ypbin-admin API | API 文档标题（starter 前缀为 ypbin.api-doc）<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：ypbin.api-doc.title 已生效。 |
| `ypbin.api-doc.description`<br><span class="cfg-src">string · application.yml:173</span> | 企业级后台管理系统接口文档 | API 文档描述（starter 前缀为 ypbin.api-doc）<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：ypbin.api-doc.description 已生效。 |
| `ypbin.api-doc.version`<br><span class="cfg-src">string · application.yml:174</span> | 1.0.0 | API 文档版本（starter 前缀为 ypbin.api-doc）<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：ypbin.api-doc.version 已生效。 |
| `ypbin.api-doc.contact.name`<br><span class="cfg-src">string · application.yml:176</span> | wenbin | API 文档联系人（starter 前缀为 ypbin.api-doc）<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：ypbin.api-doc.contact.name 已生效。 |
| `mybatis-plus.configuration.map-underscore-to-camel-case`<br><span class="cfg-src">boolean · application.yml:149</span> | true | mybatis-plus.configuration.map-underscore-to-camel-case 配置<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：— |
| `logging.pattern.level`<br><span class="cfg-src">string · application.yml:153</span> | %5p [${spring.application.name:},%X{requestId:-}] | logging.pattern.level 配置<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：— |
| `logging.level.cn.ypbin.admin`<br><span class="cfg-src">string · application.yml:155</span> | debug | logging.level.cn.ypbin.admin 配置<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：— |
| `management.endpoints.web.exposure.include`<br><span class="cfg-src">string · application.yml:228</span> | health,info | management.endpoints.web.exposure.include 配置<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：Actuator 已接入（pom.xml 引入 spring-boot-starter-actuator）；仅暴露 health/info 两个低危端点。 |
| `management.endpoint.health.show-details`<br><span class="cfg-src">string · application.yml:231</span> | when&#95;authorized | management.endpoint.health.show-details 配置<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：Actuator 已接入；health 详情仅在登录放行后可见（/actuator/health 已加入 ypbin.security.excludes）。 |

## database

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `SITE&#95;NAME`<br><span class="cfg-src">string · V2&#95;&#95;data.sql:100</span> | ypbin-admin | site / 系统名称<br><strong>可选；缺失时使用 Java 默认值或关闭能力</strong><br><strong>注意</strong>：未发现后端 Java 消费点。 |
| `SITE&#95;COPYRIGHT`<br><span class="cfg-src">string · V2&#95;&#95;data.sql:101</span> | ypbin | site / 版权信息<br><strong>可选；缺失时使用 Java 默认值或关闭能力</strong><br><strong>注意</strong>：未发现后端 Java 消费点。 |
| `LOGIN&#95;CAPTCHA&#95;ENABLED`<br><span class="cfg-src">boolean · V2&#95;&#95;data.sql:102</span> | false | login / 是否开启登录验证码<br><strong>可选；缺失时使用 Java 默认值或关闭能力</strong><br>可选值：true / false<br><strong>注意</strong>：— |
| `LOGIN&#95;SMS&#95;ENABLED`<br><span class="cfg-src">boolean · V2&#95;&#95;data.sql:103</span> | false | login / 是否开启短信验证码登录<br><strong>可选；缺失时使用 Java 默认值或关闭能力</strong><br>可选值：true / false<br><strong>注意</strong>：— |
| `PASSWORD&#95;MIN&#95;LENGTH`<br><span class="cfg-src">integer · V2&#95;&#95;data.sql:104</span> | &lt;redacted&gt; | password / 密码最小长度<br><strong>可选；缺失时使用 Java 默认值或关闭能力</strong><br><strong>注意</strong>：— |
| `PASSWORD&#95;REQUIRE&#95;DIGIT`<br><span class="cfg-src">boolean · V2&#95;&#95;data.sql:105</span> | &lt;redacted&gt; | password / 是否必须含数字<br><strong>可选；缺失时使用 Java 默认值或关闭能力</strong><br>可选值：true / false<br><strong>注意</strong>：— |
| `PASSWORD&#95;REQUIRE&#95;LETTER`<br><span class="cfg-src">boolean · V2&#95;&#95;data.sql:106</span> | &lt;redacted&gt; | password / 是否必须含字母<br><strong>可选；缺失时使用 Java 默认值或关闭能力</strong><br>可选值：true / false<br><strong>注意</strong>：— |
| `PASSWORD&#95;REQUIRE&#95;SYMBOL`<br><span class="cfg-src">boolean · V2&#95;&#95;data.sql:107</span> | false | password / 是否必须含特殊字符<br><strong>可选；缺失时使用 Java 默认值或关闭能力</strong><br>可选值：true / false<br><strong>注意</strong>：— |
| `PASSWORD&#95;ALLOW&#95;CONTAIN&#95;USERNAME`<br><span class="cfg-src">boolean · V2&#95;&#95;data.sql:108</span> | false | password / 是否允许含用户名<br><strong>可选；缺失时使用 Java 默认值或关闭能力</strong><br>可选值：true / false<br><strong>注意</strong>：— |
| `PASSWORD&#95;ERROR&#95;LOCK&#95;COUNT`<br><span class="cfg-src">integer · V2&#95;&#95;data.sql:109</span> | &lt;redacted&gt; | password / 登录错误锁定阈值<br><strong>可选；缺失时使用 Java 默认值或关闭能力</strong><br><strong>注意</strong>：— |
| `PASSWORD&#95;LOCK&#95;MINUTES`<br><span class="cfg-src">integer · V2&#95;&#95;data.sql:110</span> | &lt;redacted&gt; | password / 账号锁定时长(分钟)<br><strong>可选；缺失时使用 Java 默认值或关闭能力</strong><br><strong>注意</strong>：— |
| `PASSWORD&#95;EXPIRATION&#95;DAYS`<br><span class="cfg-src">integer · V2&#95;&#95;data.sql:111</span> | &lt;redacted&gt; | password / 密码有效期(天)<br><strong>可选；缺失时使用 Java 默认值或关闭能力</strong><br><strong>注意</strong>：— |
| `PASSWORD&#95;HISTORY&#95;COUNT`<br><span class="cfg-src">integer · V2&#95;&#95;data.sql:112</span> | &lt;redacted&gt; | password / 历史密码不可重复次数<br><strong>可选；缺失时使用 Java 默认值或关闭能力</strong><br><strong>注意</strong>：— |
| `SMS&#95;SUPPLIER`<br><span class="cfg-src">string · V2&#95;&#95;data.sql:113</span> |  | sms / 短信厂商<br><strong>必填：LOGIN&#95;SMS&#95;ENABLED=true 时按供应商要求必填</strong><br>可选值：由运行时 sms4j provider jar 决定<br><strong>注意</strong>：— |
| `SMS&#95;ACCESS&#95;KEY&#95;ID`<br><span class="cfg-src">string · V2&#95;&#95;data.sql:114</span> |  | sms / AccessKeyId<br><strong>必填：LOGIN&#95;SMS&#95;ENABLED=true 时按供应商要求必填</strong><br><strong>注意</strong>：数据库明文存储敏感值，仅接口响应脱敏；限制数据库、备份和日志访问。 |
| `SMS&#95;ACCESS&#95;KEY&#95;SECRET`<br><span class="cfg-src">string · V2&#95;&#95;data.sql:115</span> |  | sms / AccessKeySecret<br><strong>必填：LOGIN&#95;SMS&#95;ENABLED=true 时按供应商要求必填</strong><br><strong>注意</strong>：数据库明文存储敏感值，仅接口响应脱敏；限制数据库、备份和日志访问。 |
| `SMS&#95;SIGNATURE`<br><span class="cfg-src">string · V2&#95;&#95;data.sql:116</span> |  | sms / 短信签名<br><strong>必填：LOGIN&#95;SMS&#95;ENABLED=true 时按供应商要求必填</strong><br><strong>注意</strong>：— |
| `SMS&#95;TEMPLATE&#95;ID`<br><span class="cfg-src">string · V2&#95;&#95;data.sql:117</span> |  | sms / 验证码模板ID<br><strong>必填：LOGIN&#95;SMS&#95;ENABLED=true 时按供应商要求必填</strong><br><strong>注意</strong>：— |
| `SMS&#95;CODE&#95;EXPIRE&#95;SECONDS`<br><span class="cfg-src">integer · V2&#95;&#95;data.sql:118</span> | 300 | sms / 验证码有效期(秒)<br><strong>可选；缺失时使用 Java 默认值或关闭能力</strong><br><strong>注意</strong>：必须大于 0。 |
| `SMS&#95;CODE&#95;COOLDOWN&#95;SECONDS`<br><span class="cfg-src">integer · V2&#95;&#95;data.sql:119</span> | 60 | sms / 验证码发送冷却(秒)<br><strong>可选；缺失时使用 Java 默认值或关闭能力</strong><br><strong>注意</strong>：必须大于 0。 |
| `MAIL&#95;HOST`<br><span class="cfg-src">string · V2&#95;&#95;data.sql:120</span> |  | mail / SMTP 服务器<br><strong>必填：发送邮件时必填</strong><br><strong>注意</strong>：— |
| `MAIL&#95;PORT`<br><span class="cfg-src">integer · V2&#95;&#95;data.sql:121</span> | 465 | mail / SMTP 端口<br><strong>可选；缺失时使用 Java 默认值或关闭能力</strong><br><strong>注意</strong>：— |
| `MAIL&#95;USERNAME`<br><span class="cfg-src">string · V2&#95;&#95;data.sql:122</span> |  | mail / 邮箱账号<br><strong>必填：发送邮件时必填</strong><br><strong>注意</strong>：— |
| `MAIL&#95;PASSWORD`<br><span class="cfg-src">string · V2&#95;&#95;data.sql:123</span> |  | mail / 邮箱密码/授权码<br><strong>必填：发送邮件时必填</strong><br><strong>注意</strong>：数据库明文存储敏感值，仅接口响应脱敏；限制数据库、备份和日志访问。 |
| `MAIL&#95;FROM`<br><span class="cfg-src">string · V2&#95;&#95;data.sql:124</span> |  | mail / 发件地址<br><strong>必填：发送邮件时必填</strong><br><strong>注意</strong>：— |
| `MAIL&#95;FROM&#95;NAME`<br><span class="cfg-src">string · V2&#95;&#95;data.sql:125</span> |  | mail / 发件人名称<br><strong>可选；缺失时使用 Java 默认值或关闭能力</strong><br><strong>注意</strong>：— |
| `MAIL&#95;SSL&#95;ENABLED`<br><span class="cfg-src">boolean · V2&#95;&#95;data.sql:126</span> | true | mail / 是否 SSL<br><strong>可选；缺失时使用 Java 默认值或关闭能力</strong><br>可选值：true / false<br><strong>注意</strong>：— |
| `SOCIAL&#95;GITHUB&#95;CLIENT&#95;ID`<br><span class="cfg-src">string · V2&#95;&#95;data.sql:127</span> |  | social / GitHub ClientId<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br><strong>注意</strong>：生产回调地址应使用 HTTPS。 |
| `SOCIAL&#95;GITHUB&#95;CLIENT&#95;SECRET`<br><span class="cfg-src">string · V2&#95;&#95;data.sql:128</span> |  | social / GitHub ClientSecret<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br><strong>注意</strong>：数据库明文存储敏感值，仅接口响应脱敏；限制数据库、备份和日志访问。 / 生产回调地址应使用 HTTPS。 |
| `SOCIAL&#95;GITHUB&#95;REDIRECT&#95;URI`<br><span class="cfg-src">string · V2&#95;&#95;data.sql:129</span> |  | social / GitHub 回调地址<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br><strong>注意</strong>：生产回调地址应使用 HTTPS。 |
| `SOCIAL&#95;GITEE&#95;CLIENT&#95;ID`<br><span class="cfg-src">string · V2&#95;&#95;data.sql:130</span> |  | social / Gitee ClientId<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br><strong>注意</strong>：生产回调地址应使用 HTTPS。 |
| `SOCIAL&#95;GITEE&#95;CLIENT&#95;SECRET`<br><span class="cfg-src">string · V2&#95;&#95;data.sql:131</span> |  | social / Gitee ClientSecret<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br><strong>注意</strong>：数据库明文存储敏感值，仅接口响应脱敏；限制数据库、备份和日志访问。 / 生产回调地址应使用 HTTPS。 |
| `SOCIAL&#95;GITEE&#95;REDIRECT&#95;URI`<br><span class="cfg-src">string · V2&#95;&#95;data.sql:132</span> |  | social / Gitee 回调地址<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br><strong>注意</strong>：生产回调地址应使用 HTTPS。 |
| `SOCIAL&#95;QQ&#95;CLIENT&#95;ID`<br><span class="cfg-src">string · V2&#95;&#95;data.sql:133</span> |  | social / QQ ClientId<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br><strong>注意</strong>：生产回调地址应使用 HTTPS。 |
| `SOCIAL&#95;QQ&#95;CLIENT&#95;SECRET`<br><span class="cfg-src">string · V2&#95;&#95;data.sql:134</span> |  | social / QQ ClientSecret<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br><strong>注意</strong>：数据库明文存储敏感值，仅接口响应脱敏；限制数据库、备份和日志访问。 / 生产回调地址应使用 HTTPS。 |
| `SOCIAL&#95;QQ&#95;REDIRECT&#95;URI`<br><span class="cfg-src">string · V2&#95;&#95;data.sql:135</span> |  | social / QQ 回调地址<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br><strong>注意</strong>：生产回调地址应使用 HTTPS。 |
| `SOCIAL&#95;WECHAT&#95;OPEN&#95;CLIENT&#95;ID`<br><span class="cfg-src">string · V2&#95;&#95;data.sql:136</span> |  | social / 微信开放平台 ClientId<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br><strong>注意</strong>：生产回调地址应使用 HTTPS。 |
| `SOCIAL&#95;WECHAT&#95;OPEN&#95;CLIENT&#95;SECRET`<br><span class="cfg-src">string · V2&#95;&#95;data.sql:137</span> |  | social / 微信开放平台 ClientSecret<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br><strong>注意</strong>：数据库明文存储敏感值，仅接口响应脱敏；限制数据库、备份和日志访问。 / 生产回调地址应使用 HTTPS。 |
| `SOCIAL&#95;WECHAT&#95;OPEN&#95;REDIRECT&#95;URI`<br><span class="cfg-src">string · V2&#95;&#95;data.sql:138</span> |  | social / 微信开放平台 回调地址<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br><strong>注意</strong>：生产回调地址应使用 HTTPS。 |
| `SOCIAL&#95;ALIPAY&#95;CLIENT&#95;ID`<br><span class="cfg-src">string · V2&#95;&#95;data.sql:139</span> |  | social / 支付宝 ClientId<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br><strong>注意</strong>：生产回调地址应使用 HTTPS。 |
| `SOCIAL&#95;ALIPAY&#95;CLIENT&#95;SECRET`<br><span class="cfg-src">string · V2&#95;&#95;data.sql:140</span> |  | social / 支付宝 ClientSecret<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br><strong>注意</strong>：数据库明文存储敏感值，仅接口响应脱敏；限制数据库、备份和日志访问。 / 生产回调地址应使用 HTTPS。 |
| `SOCIAL&#95;ALIPAY&#95;REDIRECT&#95;URI`<br><span class="cfg-src">string · V2&#95;&#95;data.sql:141</span> |  | social / 支付宝 回调地址<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br><strong>注意</strong>：生产回调地址应使用 HTTPS。 |
| `SOCIAL&#95;DINGTALK&#95;CLIENT&#95;ID`<br><span class="cfg-src">string · V2&#95;&#95;data.sql:142</span> |  | social / 钉钉 ClientId<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br><strong>注意</strong>：生产回调地址应使用 HTTPS。 |
| `SOCIAL&#95;DINGTALK&#95;CLIENT&#95;SECRET`<br><span class="cfg-src">string · V2&#95;&#95;data.sql:143</span> |  | social / 钉钉 ClientSecret<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br><strong>注意</strong>：数据库明文存储敏感值，仅接口响应脱敏；限制数据库、备份和日志访问。 / 生产回调地址应使用 HTTPS。 |
| `SOCIAL&#95;DINGTALK&#95;REDIRECT&#95;URI`<br><span class="cfg-src">string · V2&#95;&#95;data.sql:144</span> |  | social / 钉钉 回调地址<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br><strong>注意</strong>：生产回调地址应使用 HTTPS。 |
| `SOCIAL&#95;GITHUB&#95;ENABLED`<br><span class="cfg-src">boolean · V2&#95;&#95;data.sql:145</span> | false | social / GitHub 是否启用<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br>可选值：true / false<br><strong>注意</strong>：生产回调地址应使用 HTTPS。 |
| `SOCIAL&#95;GITEE&#95;ENABLED`<br><span class="cfg-src">boolean · V2&#95;&#95;data.sql:146</span> | false | social / Gitee 是否启用<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br>可选值：true / false<br><strong>注意</strong>：生产回调地址应使用 HTTPS。 |
| `SOCIAL&#95;QQ&#95;ENABLED`<br><span class="cfg-src">boolean · V2&#95;&#95;data.sql:147</span> | false | social / QQ 是否启用<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br>可选值：true / false<br><strong>注意</strong>：生产回调地址应使用 HTTPS。 |
| `SOCIAL&#95;WECHAT&#95;OPEN&#95;ENABLED`<br><span class="cfg-src">boolean · V2&#95;&#95;data.sql:148</span> | false | social / 微信开放平台是否启用<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br>可选值：true / false<br><strong>注意</strong>：生产回调地址应使用 HTTPS。 |
| `SOCIAL&#95;ALIPAY&#95;ENABLED`<br><span class="cfg-src">boolean · V2&#95;&#95;data.sql:149</span> | false | social / 支付宝是否启用<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br>可选值：true / false<br><strong>注意</strong>：生产回调地址应使用 HTTPS。 |
| `SOCIAL&#95;DINGTALK&#95;ENABLED`<br><span class="cfg-src">boolean · V2&#95;&#95;data.sql:150</span> | false | social / 钉钉是否启用<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br>可选值：true / false<br><strong>注意</strong>：生产回调地址应使用 HTTPS。 |
| `SOCIAL&#95;ALIPAY&#95;PUBLIC&#95;KEY`<br><span class="cfg-src">string · V2&#95;&#95;data.sql:151</span> |  | social / 支付宝公钥<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br><strong>注意</strong>：生产回调地址应使用 HTTPS。 |
