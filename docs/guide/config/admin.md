---
title: Admin 配置参考
description: 环境变量、application.yml 与运行时数据库参数的逐项说明。
---

# Admin 配置参考

环境变量、application.yml 与运行时数据库参数。本页共 **140** 项，包含类型、默认值、必填条件、可选值、生产注意与源码来源。表格支持左右滚动。

## environment


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 | 来源 |
|---|---|---|---|---|
| `DB_HOST` | `string` | localhost | db host<br><strong>可选；未设置时使用 application.yml 默认值</strong><br><strong>注意</strong>：— | <span class="cfg-src">.env.example:7</span> |
| `DB_PORT` | `integer` | 3306 | db port<br><strong>可选；未设置时使用 application.yml 默认值</strong><br><strong>注意</strong>：— | <span class="cfg-src">.env.example:8</span> |
| `DB_NAME` | `string` | ypbin&#95;admin | db name<br><strong>可选；未设置时使用 application.yml 默认值</strong><br><strong>注意</strong>：— | <span class="cfg-src">.env.example:9</span> |
| `DB_USER` | `string` | root | db user<br><strong>可选；未设置时使用 application.yml 默认值</strong><br><strong>注意</strong>：生产禁止使用 root，采用最小权限账号。 | <span class="cfg-src">.env.example:10</span> |
| `DB_PASSWORD` | `string` |  | db password<br><strong>必填：生产环境必须设置</strong><br><strong>注意</strong>：敏感值不得提交、打印或进入报告；生产使用 Secret 管理并轮换。 | <span class="cfg-src">.env.example:11</span> |
| `REDIS_HOST` | `string` | localhost | redis host<br><strong>可选；未设置时使用 application.yml 默认值</strong><br><strong>注意</strong>：— | <span class="cfg-src">.env.example:14</span> |
| `REDIS_PORT` | `integer` | 6379 | redis port<br><strong>可选；未设置时使用 application.yml 默认值</strong><br><strong>注意</strong>：— | <span class="cfg-src">.env.example:15</span> |
| `REDIS_DB` | `integer` | 0 | redis db<br><strong>可选；未设置时使用 application.yml 默认值</strong><br><strong>注意</strong>：— | <span class="cfg-src">.env.example:16</span> |
| `REDIS_PASSWORD` | `string` |  | redis password<br><strong>可选；未设置时使用 application.yml 默认值</strong><br><strong>注意</strong>：敏感值不得提交、打印或进入报告；生产使用 Secret 管理并轮换。 | <span class="cfg-src">.env.example:17</span> |
| `LICENSE_ISSUER_PUBLIC_KEY` | `string` |  | license issuer public key<br><strong>可选；未设置时使用 application.yml 默认值</strong><br><strong>注意</strong>：— | <span class="cfg-src">.env.example:23</span> |
| `LICENSE_ISSUER_PRIVATE_KEY` | `string` |  | license issuer private key<br><strong>必填：执行 License 签发时必须设置</strong><br><strong>注意</strong>：敏感值不得提交、打印或进入报告；生产使用 Secret 管理并轮换。 | <span class="cfg-src">.env.example:24</span> |
| `LICENSE_ISSUER_SM4_KEY` | `string` |  | license issuer sm4 key<br><strong>必填：执行 License 签发时必须设置</strong><br><strong>注意</strong>：敏感值不得提交、打印或进入报告；生产使用 Secret 管理并轮换。 | <span class="cfg-src">.env.example:25</span> |
| `ADMIN_BOOTSTRAP_ENABLED` | `boolean` | false | admin bootstrap enabled<br><strong>可选；未设置时使用 application.yml 默认值</strong><br>可选值：true / false<br><strong>注意</strong>：— | <span class="cfg-src">application.yml:38</span> |
| `ADMIN_BOOTSTRAP_USERNAME` | `string` |  | admin bootstrap username<br><strong>必填：ADMIN&#95;BOOTSTRAP&#95;ENABLED=true 时必须设置</strong><br><strong>注意</strong>：— | <span class="cfg-src">application.yml:39</span> |
| `ADMIN_BOOTSTRAP_PASSWORD` | `string` |  | admin bootstrap password<br><strong>必填：ADMIN&#95;BOOTSTRAP&#95;ENABLED=true 时必须设置</strong><br><strong>注意</strong>：敏感值不得提交、打印或进入报告；生产使用 Secret 管理并轮换。 | <span class="cfg-src">application.yml:40</span> |
| `ADMIN_BOOTSTRAP_REAL_NAME` | `string` | 平台管理员 | admin bootstrap real name<br><strong>可选；未设置时使用 application.yml 默认值</strong><br><strong>注意</strong>：— | <span class="cfg-src">application.yml:41</span> |
| `ADMIN_BOOTSTRAP_TENANT_ID` | `integer` | 1 | admin bootstrap tenant id<br><strong>可选；未设置时使用 application.yml 默认值</strong><br><strong>注意</strong>：— | <span class="cfg-src">application.yml:42</span> |
| `ADMIN_JOB_RECONCILE_DELAY` | `integer` | 30000 | admin job reconcile delay<br><strong>可选；未设置时使用 application.yml 默认值</strong><br><strong>注意</strong>：— | <span class="cfg-src">application.yml:44</span> |
| `API_CRYPTO_KEY` | `string` |  | api crypto key<br><strong>可选；未设置时使用 application.yml 默认值</strong><br><strong>注意</strong>：敏感值不得提交、打印或进入报告；生产使用 Secret 管理并轮换。 / ypbin.api-crypto.key 已生效：接口加解密 AES 密钥由部署环境注入（16/24/32 字节）。 | <span class="cfg-src">application.yml:132</span> |
| `YPBIN_XXL_JOB_ENABLED` | `boolean` | false | boot 单体版是否启用 XXL-JOB 执行器（默认复用主部署调度中心）<br><strong>可选；boot 单体部署用，true 时启用执行器注册</strong><br><strong>注意</strong>：— | <span class="cfg-src">.env.example:32</span> |
| `YPBIN_XXL_JOB_ADMIN` | `string` | http&#58;//host.docker.internal:18085 | boot 单体版 xxl-job-admin 调度中心地址<br><strong>可选；boot 单体指向的 xxl-job-admin 地址（跨 compose 用宿主机）</strong><br><strong>注意</strong>：— | <span class="cfg-src">.env.example:33</span> |

</div>


## application


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 | 来源 |
|---|---|---|---|---|
| `server.port` | `integer` | 8080 | HTTP 服务监听端口<br><strong>必填：对应组件启用时生效</strong><br>可选值：1..65535<br><strong>注意</strong>：— | <span class="cfg-src">application.yml:2</span> |
| `spring.application.name` | `string` | ypbin-admin | 应用名称<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：— | <span class="cfg-src">application.yml:6</span> |
| `spring.datasource.driver-class-name` | `string` | com.mysql.cj.jdbc.Driver | spring.datasource.driver-class-name 配置<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：— | <span class="cfg-src">application.yml:8</span> |
| `spring.datasource.url` | `string` | <code class="cfg-value">jdbc:mysql&#58;//localhost:3306/ypbin&#95;admin?useUnicode=true&amp;characterEncoding=utf8&amp;serverTimezone=Asia/Shanghai&amp;useSSL=false&amp;allowPublicKeyRetrieval=true</code> | MySQL JDBC 连接串<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：当前 useSSL=false 且 allowPublicKeyRetrieval=true；生产应启用并校验 TLS。 | <span class="cfg-src">application.yml:9</span> |
| `spring.datasource.username` | `string` | root | 数据库账号<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：— | <span class="cfg-src">application.yml:10</span> |
| `spring.datasource.password` | `string` |  | 数据库密码<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：— | <span class="cfg-src">application.yml:11</span> |
| `spring.data.redis.host` | `string` | localhost | Redis 主机<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：— | <span class="cfg-src">application.yml:14</span> |
| `spring.data.redis.port` | `integer` | 6379 | Redis 端口<br><strong>必填：对应组件启用时生效</strong><br>可选值：1..65535<br><strong>注意</strong>：— | <span class="cfg-src">application.yml:15</span> |
| `spring.data.redis.database` | `integer` | 0 | Redis 逻辑库<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：— | <span class="cfg-src">application.yml:16</span> |
| `spring.data.redis.password` | `string` |  | Redis 密码<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：— | <span class="cfg-src">application.yml:17</span> |
| `spring.flyway.enabled` | `boolean` | true | 启动时执行 Flyway 迁移<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：— | <span class="cfg-src">application.yml:19</span> |
| `spring.flyway.baseline-on-migrate` | `boolean` | true | spring.flyway.baseline-on-migrate 配置<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：— | <span class="cfg-src">application.yml:20</span> |
| `spring.flyway.locations` | `string` | classpath:db/migration | spring.flyway.locations 配置<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：— | <span class="cfg-src">application.yml:21</span> |
| `spring.flyway.encoding` | `string` | UTF-8 | spring.flyway.encoding 配置<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：— | <span class="cfg-src">application.yml:22</span> |
| `sa-token.token-name` | `string` | Authorization | sa-token.token-name 配置<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：— | <span class="cfg-src">application.yml:26</span> |
| `sa-token.token-prefix` | `string` | Bearer | sa-token.token-prefix 配置<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：— | <span class="cfg-src">application.yml:27</span> |
| `sa-token.timeout` | `integer` | 2592000 | sa-token.timeout 配置<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：— | <span class="cfg-src">application.yml:28</span> |
| `sa-token.active-timeout` | `integer` | 1800 | sa-token.active-timeout 配置<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：— | <span class="cfg-src">application.yml:29</span> |
| `sa-token.auto-renew` | `boolean` | true | sa-token.auto-renew 配置<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：— | <span class="cfg-src">application.yml:30</span> |
| `sa-token.is-read-cookie` | `boolean` | false | sa-token.is-read-cookie 配置<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：— | <span class="cfg-src">application.yml:31</span> |
| `sa-token.is-print` | `boolean` | false | sa-token.is-print 配置<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：— | <span class="cfg-src">application.yml:32</span> |
| `ypbin.admin.bootstrap.enabled` | `boolean` | false | 一次性平台管理员初始化开关<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：— | <span class="cfg-src">application.yml:38</span> |
| `ypbin.admin.bootstrap.username` | `string` |  | 初始化管理员用户名<br><strong>必填：ypbin.admin.bootstrap.enabled=true 时必须有效</strong><br><strong>注意</strong>：— | <span class="cfg-src">application.yml:39</span> |
| `ypbin.admin.bootstrap.password` | `string` |  | 初始化管理员密码<br><strong>必填：ypbin.admin.bootstrap.enabled=true 时必须有效</strong><br><strong>注意</strong>：— | <span class="cfg-src">application.yml:40</span> |
| `ypbin.admin.bootstrap.real-name` | `string` | 平台管理员 | ypbin.admin.bootstrap.real-name 配置<br><strong>必填：ypbin.admin.bootstrap.enabled=true 时必须有效</strong><br><strong>注意</strong>：— | <span class="cfg-src">application.yml:41</span> |
| `ypbin.admin.bootstrap.tenant-id` | `integer` | 1 | ypbin.admin.bootstrap.tenant-id 配置<br><strong>必填：ypbin.admin.bootstrap.enabled=true 时必须有效</strong><br><strong>注意</strong>：— | <span class="cfg-src">application.yml:42</span> |
| `ypbin.admin.job.reconcile-delay` | `integer` | 30000 | 任务对账间隔（毫秒）<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：— | <span class="cfg-src">application.yml:44</span> |
| `ypbin.web.repeatable-read.enabled` | `boolean` | true | ypbin.web.repeatable-read.enabled 配置<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：— | <span class="cfg-src">application.yml:47</span> |
| `ypbin.web.cors.enabled` | `boolean` | false | ypbin.web.cors.enabled 配置<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：— | <span class="cfg-src">application.yml:49</span> |
| `ypbin.web.cors.allowed-origin-patterns` | `array<string>` | http&#58;//localhost:&#42; | ypbin.web.cors.allowed-origin-patterns 配置<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：— | <span class="cfg-src">application.yml:50</span> |
| `ypbin.web.xss.enabled` | `boolean` | true | ypbin.web.xss.enabled 配置<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：— | <span class="cfg-src">application.yml:52</span> |
| `ypbin.web.xss.excludes` | `array<string>` | /webhook/&#42;&#42; | ypbin.web.xss.excludes 配置<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：— | <span class="cfg-src">application.yml:53</span> |
| `ypbin.security.interceptor` | `boolean` | true | ypbin.security.interceptor 配置<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：— | <span class="cfg-src">application.yml:55</span> |
| `ypbin.tenant.enabled` | `boolean` | true | ypbin.tenant.enabled 配置<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：— | <span class="cfg-src">application.yml:68</span> |
| `ypbin.tenant.column` | `string` | tenant&#95;id | ypbin.tenant.column 配置<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：— | <span class="cfg-src">application.yml:69</span> |
| `ypbin.sign.enabled` | `boolean` | true | ypbin.sign.enabled 配置<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：— | <span class="cfg-src">application.yml:92</span> |
| `ypbin.sign.mode` | `string` | ANNOTATION | 接口签名校验模式<br><strong>必填：对应组件启用时生效</strong><br>可选值：ANNOTATION / GLOBAL<br><strong>注意</strong>：— | <span class="cfg-src">application.yml:93</span> |
| `ypbin.license.enabled` | `boolean` | false | ypbin.license.enabled 配置<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：— | <span class="cfg-src">application.yml:95</span> |
| `ypbin.license.issuer.public-key` | `string` |  | ypbin.license.issuer.public-key 配置<br><strong>必填：签发时 private-key 与 sm4-key 必填</strong><br><strong>注意</strong>：— | <span class="cfg-src">application.yml:97</span> |
| `ypbin.license.issuer.private-key` | `string` |  | License 签发 SM2 私钥<br><strong>必填：签发时 private-key 与 sm4-key 必填</strong><br><strong>注意</strong>：— | <span class="cfg-src">application.yml:98</span> |
| `ypbin.license.issuer.sm4-key` | `string` |  | License 签发 SM4 密钥<br><strong>必填：签发时 private-key 与 sm4-key 必填</strong><br><strong>注意</strong>：— | <span class="cfg-src">application.yml:99</span> |
| `ypbin.log.access.enabled` | `boolean` | true | ypbin.log.access.enabled 配置<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：— | <span class="cfg-src">application.yml:108</span> |
| `ypbin.data-permission.enabled` | `boolean` | true | ypbin.data-permission.enabled 配置<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：— | <span class="cfg-src">application.yml:117</span> |
| `ypbin.async.enabled` | `boolean` | true | ypbin.async.enabled 配置<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：— | <span class="cfg-src">application.yml:119</span> |
| `ypbin.sse.enabled` | `boolean` | true | SSE 开关（对应 starter 的 ypbin.sse 前缀，正确绑定）<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：starter 的 SSE 配置前缀就是 ypbin.sse，本键正确生效。 | <span class="cfg-src">application.yml:121</span> |
| `captcha.expire.default` | `integer` | 60000 | 行为验证码默认有效期<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：— | <span class="cfg-src">application.yml:126</span> |
| `ypbin.sensitive-words.replacement` | `string` | &#42; | 敏感词替换字符（starter 前缀为 ypbin.sensitive-words，正确绑定）<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：ypbin.sensitive-words.replacement 已生效：敏感词命中后统一替换为该字符。 | <span class="cfg-src">application.yml:132</span> |
| `ypbin.i18n.enabled` | `boolean` | true | 国际化开关（starter 前缀为 ypbin.i18n，正确绑定）<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：ypbin.i18n.enabled 已生效：按请求参数 lang 或请求头 Accept-Language 解析语言。 | <span class="cfg-src">application.yml:167</span> |
| `ypbin.api-crypto.key` | `string` |  | 接口加解密 AES 密钥（starter 前缀为 ypbin.api-crypto，正确绑定）<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：ypbin.api-crypto.key 已生效：16/24/32 字节 AES 密钥，生产由环境变量 API&#95;CRYPTO&#95;KEY 注入。 | <span class="cfg-src">application.yml:169</span> |
| `ypbin.observability.enabled` | `boolean` | true | 请求链路可观测性开关（starter 前缀为 ypbin.observability）<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：admin 当前未引入 ypbin-starter-cloud-observability 模块，本键无自动配置支撑（空配，不生效）。 | <span class="cfg-src">application.yml:180</span> |
| `ypbin.observability.request-id-header` | `string` | X-Request-Id | 请求 ID 响应头名称（starter 前缀为 ypbin.observability）<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：admin 当前未引入 ypbin-starter-cloud-observability 模块，本键无自动配置支撑（空配，不生效）。 | <span class="cfg-src">application.yml:181</span> |
| `ypbin.observability.mdc-key` | `string` | requestId | 日志 MDC 键名（starter 前缀为 ypbin.observability）<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：admin 当前未引入 ypbin-starter-cloud-observability 模块，本键无自动配置支撑（空配，不生效）。 | <span class="cfg-src">application.yml:182</span> |
| `ypbin.api-doc.enabled` | `boolean` | true | API 文档开关（starter 前缀为 ypbin.api-doc，正确绑定）<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：ypbin.api-doc.enabled 已生效：Knife4j/Swagger 文档可访问。 | <span class="cfg-src">application.yml:171</span> |
| `ypbin.api-doc.title` | `string` | ypbin-admin API | API 文档标题（starter 前缀为 ypbin.api-doc）<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：ypbin.api-doc.title 已生效。 | <span class="cfg-src">application.yml:172</span> |
| `ypbin.api-doc.description` | `string` | 企业级后台管理系统接口文档 | API 文档描述（starter 前缀为 ypbin.api-doc）<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：ypbin.api-doc.description 已生效。 | <span class="cfg-src">application.yml:173</span> |
| `ypbin.api-doc.version` | `string` | 1.0.0 | API 文档版本（starter 前缀为 ypbin.api-doc）<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：ypbin.api-doc.version 已生效。 | <span class="cfg-src">application.yml:174</span> |
| `ypbin.api-doc.contact.name` | `string` | wenbin | API 文档联系人（starter 前缀为 ypbin.api-doc）<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：ypbin.api-doc.contact.name 已生效。 | <span class="cfg-src">application.yml:176</span> |
| `mybatis-plus.configuration.map-underscore-to-camel-case` | `boolean` | true | mybatis-plus.configuration.map-underscore-to-camel-case 配置<br><strong>必填：对应组件启用时生效</strong><br>可选值：true / false<br><strong>注意</strong>：— | <span class="cfg-src">application.yml:149</span> |
| `logging.pattern.level` | `string` | %5p [${spring.application.name:},%X{requestId:-}] | logging.pattern.level 配置<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：— | <span class="cfg-src">application.yml:153</span> |
| `logging.level.cn.ypbin.admin` | `string` | debug | logging.level.cn.ypbin.admin 配置<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：— | <span class="cfg-src">application.yml:155</span> |
| `management.endpoints.web.exposure.include` | `string` | health,info | management.endpoints.web.exposure.include 配置<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：Actuator 已接入（pom.xml 引入 spring-boot-starter-actuator）；仅暴露 health/info 两个低危端点。 | <span class="cfg-src">application.yml:228</span> |
| `management.endpoint.health.show-details` | `string` | when&#95;authorized | management.endpoint.health.show-details 配置<br><strong>必填：对应组件启用时生效</strong><br><strong>注意</strong>：Actuator 已接入；health 详情仅在登录放行后可见（/actuator/health 已加入 ypbin.security.excludes）。 | <span class="cfg-src">application.yml:231</span> |
| `ypbin.xxl-job.enabled` | `boolean` | true | 是否启用 XXL-JOB 执行器（system 服务注册到调度中心）<br><strong>必填：部署后需与 xxl-job-admin 调度中心同时启用</strong><br><strong>注意</strong>：— | <span class="cfg-src">ypbin-system.yaml:59</span> |
| `ypbin.xxl-job.admin-addresses` | `string` | http&#58;//xxl-job-admin:8080 | xxl-job-admin 调度中心地址（3.4.x context path 为根路径）<br><strong>必填：enabled=true 时必须</strong><br><strong>注意</strong>：— | <span class="cfg-src">ypbin-system.yaml:60</span> |
| `ypbin.xxl-job.access-token` | `string` |  | 执行器通讯 Token<br><strong>可选；与调度中心保持一致，空则不校验</strong><br><strong>注意</strong>：— | <span class="cfg-src">ypbin-system.yaml:61</span> |
| `ypbin.xxl-job.appname` | `string` | ypbin-system | 执行器名称（AppName），admin 端按此注册与路由<br><strong>必填：enabled=true 时必须</strong><br><strong>注意</strong>：— | <span class="cfg-src">ypbin-system.yaml:62</span> |
| `ypbin.xxl-job.port` | `integer` | 9999 | 执行器端口<br><strong>可选；执行器通讯端口，默认 9999</strong><br><strong>注意</strong>：— | <span class="cfg-src">ypbin-system.yaml:63</span> |

</div>


## database


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 | 来源 |
|---|---|---|---|---|
| `SITE_NAME` | `string` | ypbin-admin | site / 系统名称<br><strong>可选；缺失时使用 Java 默认值或关闭能力</strong><br><strong>注意</strong>：未发现后端 Java 消费点。 | <span class="cfg-src">V2&#95;&#95;data.sql:100</span> |
| `SITE_COPYRIGHT` | `string` | ypbin | site / 版权信息<br><strong>可选；缺失时使用 Java 默认值或关闭能力</strong><br><strong>注意</strong>：未发现后端 Java 消费点。 | <span class="cfg-src">V2&#95;&#95;data.sql:101</span> |
| `LOGIN_CAPTCHA_ENABLED` | `boolean` | false | login / 是否开启登录验证码<br><strong>可选；缺失时使用 Java 默认值或关闭能力</strong><br>可选值：true / false<br><strong>注意</strong>：— | <span class="cfg-src">V2&#95;&#95;data.sql:102</span> |
| `LOGIN_SMS_ENABLED` | `boolean` | false | login / 是否开启短信验证码登录<br><strong>可选；缺失时使用 Java 默认值或关闭能力</strong><br>可选值：true / false<br><strong>注意</strong>：— | <span class="cfg-src">V2&#95;&#95;data.sql:103</span> |
| `PASSWORD_MIN_LENGTH` | `integer` | &lt;redacted&gt; | password / 密码最小长度<br><strong>可选；缺失时使用 Java 默认值或关闭能力</strong><br><strong>注意</strong>：— | <span class="cfg-src">V2&#95;&#95;data.sql:104</span> |
| `PASSWORD_REQUIRE_DIGIT` | `boolean` | &lt;redacted&gt; | password / 是否必须含数字<br><strong>可选；缺失时使用 Java 默认值或关闭能力</strong><br>可选值：true / false<br><strong>注意</strong>：— | <span class="cfg-src">V2&#95;&#95;data.sql:105</span> |
| `PASSWORD_REQUIRE_LETTER` | `boolean` | &lt;redacted&gt; | password / 是否必须含字母<br><strong>可选；缺失时使用 Java 默认值或关闭能力</strong><br>可选值：true / false<br><strong>注意</strong>：— | <span class="cfg-src">V2&#95;&#95;data.sql:106</span> |
| `PASSWORD_REQUIRE_SYMBOL` | `boolean` | false | password / 是否必须含特殊字符<br><strong>可选；缺失时使用 Java 默认值或关闭能力</strong><br>可选值：true / false<br><strong>注意</strong>：— | <span class="cfg-src">V2&#95;&#95;data.sql:107</span> |
| `PASSWORD_ALLOW_CONTAIN_USERNAME` | `boolean` | false | password / 是否允许含用户名<br><strong>可选；缺失时使用 Java 默认值或关闭能力</strong><br>可选值：true / false<br><strong>注意</strong>：— | <span class="cfg-src">V2&#95;&#95;data.sql:108</span> |
| `PASSWORD_ERROR_LOCK_COUNT` | `integer` | &lt;redacted&gt; | password / 登录错误锁定阈值<br><strong>可选；缺失时使用 Java 默认值或关闭能力</strong><br><strong>注意</strong>：— | <span class="cfg-src">V2&#95;&#95;data.sql:109</span> |
| `PASSWORD_LOCK_MINUTES` | `integer` | &lt;redacted&gt; | password / 账号锁定时长(分钟)<br><strong>可选；缺失时使用 Java 默认值或关闭能力</strong><br><strong>注意</strong>：— | <span class="cfg-src">V2&#95;&#95;data.sql:110</span> |
| `PASSWORD_EXPIRATION_DAYS` | `integer` | &lt;redacted&gt; | password / 密码有效期(天)<br><strong>可选；缺失时使用 Java 默认值或关闭能力</strong><br><strong>注意</strong>：— | <span class="cfg-src">V2&#95;&#95;data.sql:111</span> |
| `PASSWORD_HISTORY_COUNT` | `integer` | &lt;redacted&gt; | password / 历史密码不可重复次数<br><strong>可选；缺失时使用 Java 默认值或关闭能力</strong><br><strong>注意</strong>：— | <span class="cfg-src">V2&#95;&#95;data.sql:112</span> |
| `SMS_SUPPLIER` | `string` |  | sms / 短信厂商<br><strong>必填：LOGIN&#95;SMS&#95;ENABLED=true 时按供应商要求必填</strong><br>可选值：由运行时 sms4j provider jar 决定<br><strong>注意</strong>：— | <span class="cfg-src">V2&#95;&#95;data.sql:113</span> |
| `SMS_ACCESS_KEY_ID` | `string` |  | sms / AccessKeyId<br><strong>必填：LOGIN&#95;SMS&#95;ENABLED=true 时按供应商要求必填</strong><br><strong>注意</strong>：数据库明文存储敏感值，仅接口响应脱敏；限制数据库、备份和日志访问。 | <span class="cfg-src">V2&#95;&#95;data.sql:114</span> |
| `SMS_ACCESS_KEY_SECRET` | `string` |  | sms / AccessKeySecret<br><strong>必填：LOGIN&#95;SMS&#95;ENABLED=true 时按供应商要求必填</strong><br><strong>注意</strong>：数据库明文存储敏感值，仅接口响应脱敏；限制数据库、备份和日志访问。 | <span class="cfg-src">V2&#95;&#95;data.sql:115</span> |
| `SMS_SIGNATURE` | `string` |  | sms / 短信签名<br><strong>必填：LOGIN&#95;SMS&#95;ENABLED=true 时按供应商要求必填</strong><br><strong>注意</strong>：— | <span class="cfg-src">V2&#95;&#95;data.sql:116</span> |
| `SMS_TEMPLATE_ID` | `string` |  | sms / 验证码模板ID<br><strong>必填：LOGIN&#95;SMS&#95;ENABLED=true 时按供应商要求必填</strong><br><strong>注意</strong>：— | <span class="cfg-src">V2&#95;&#95;data.sql:117</span> |
| `SMS_CODE_EXPIRE_SECONDS` | `integer` | 300 | sms / 验证码有效期(秒)<br><strong>可选；缺失时使用 Java 默认值或关闭能力</strong><br><strong>注意</strong>：必须大于 0。 | <span class="cfg-src">V2&#95;&#95;data.sql:118</span> |
| `SMS_CODE_COOLDOWN_SECONDS` | `integer` | 60 | sms / 验证码发送冷却(秒)<br><strong>可选；缺失时使用 Java 默认值或关闭能力</strong><br><strong>注意</strong>：必须大于 0。 | <span class="cfg-src">V2&#95;&#95;data.sql:119</span> |
| `MAIL_HOST` | `string` |  | mail / SMTP 服务器<br><strong>必填：发送邮件时必填</strong><br><strong>注意</strong>：— | <span class="cfg-src">V2&#95;&#95;data.sql:120</span> |
| `MAIL_PORT` | `integer` | 465 | mail / SMTP 端口<br><strong>可选；缺失时使用 Java 默认值或关闭能力</strong><br><strong>注意</strong>：— | <span class="cfg-src">V2&#95;&#95;data.sql:121</span> |
| `MAIL_USERNAME` | `string` |  | mail / 邮箱账号<br><strong>必填：发送邮件时必填</strong><br><strong>注意</strong>：— | <span class="cfg-src">V2&#95;&#95;data.sql:122</span> |
| `MAIL_PASSWORD` | `string` |  | mail / 邮箱密码/授权码<br><strong>必填：发送邮件时必填</strong><br><strong>注意</strong>：数据库明文存储敏感值，仅接口响应脱敏；限制数据库、备份和日志访问。 | <span class="cfg-src">V2&#95;&#95;data.sql:123</span> |
| `MAIL_FROM` | `string` |  | mail / 发件地址<br><strong>必填：发送邮件时必填</strong><br><strong>注意</strong>：— | <span class="cfg-src">V2&#95;&#95;data.sql:124</span> |
| `MAIL_FROM_NAME` | `string` |  | mail / 发件人名称<br><strong>可选；缺失时使用 Java 默认值或关闭能力</strong><br><strong>注意</strong>：— | <span class="cfg-src">V2&#95;&#95;data.sql:125</span> |
| `MAIL_SSL_ENABLED` | `boolean` | true | mail / 是否 SSL<br><strong>可选；缺失时使用 Java 默认值或关闭能力</strong><br>可选值：true / false<br><strong>注意</strong>：— | <span class="cfg-src">V2&#95;&#95;data.sql:126</span> |
| `SOCIAL_GITHUB_CLIENT_ID` | `string` |  | social / GitHub ClientId<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br><strong>注意</strong>：生产回调地址应使用 HTTPS。 | <span class="cfg-src">V2&#95;&#95;data.sql:127</span> |
| `SOCIAL_GITHUB_CLIENT_SECRET` | `string` |  | social / GitHub ClientSecret<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br><strong>注意</strong>：数据库明文存储敏感值，仅接口响应脱敏；限制数据库、备份和日志访问。 / 生产回调地址应使用 HTTPS。 | <span class="cfg-src">V2&#95;&#95;data.sql:128</span> |
| `SOCIAL_GITHUB_REDIRECT_URI` | `string` |  | social / GitHub 回调地址<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br><strong>注意</strong>：生产回调地址应使用 HTTPS。 | <span class="cfg-src">V2&#95;&#95;data.sql:129</span> |
| `SOCIAL_GITEE_CLIENT_ID` | `string` |  | social / Gitee ClientId<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br><strong>注意</strong>：生产回调地址应使用 HTTPS。 | <span class="cfg-src">V2&#95;&#95;data.sql:130</span> |
| `SOCIAL_GITEE_CLIENT_SECRET` | `string` |  | social / Gitee ClientSecret<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br><strong>注意</strong>：数据库明文存储敏感值，仅接口响应脱敏；限制数据库、备份和日志访问。 / 生产回调地址应使用 HTTPS。 | <span class="cfg-src">V2&#95;&#95;data.sql:131</span> |
| `SOCIAL_GITEE_REDIRECT_URI` | `string` |  | social / Gitee 回调地址<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br><strong>注意</strong>：生产回调地址应使用 HTTPS。 | <span class="cfg-src">V2&#95;&#95;data.sql:132</span> |
| `SOCIAL_QQ_CLIENT_ID` | `string` |  | social / QQ ClientId<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br><strong>注意</strong>：生产回调地址应使用 HTTPS。 | <span class="cfg-src">V2&#95;&#95;data.sql:133</span> |
| `SOCIAL_QQ_CLIENT_SECRET` | `string` |  | social / QQ ClientSecret<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br><strong>注意</strong>：数据库明文存储敏感值，仅接口响应脱敏；限制数据库、备份和日志访问。 / 生产回调地址应使用 HTTPS。 | <span class="cfg-src">V2&#95;&#95;data.sql:134</span> |
| `SOCIAL_QQ_REDIRECT_URI` | `string` |  | social / QQ 回调地址<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br><strong>注意</strong>：生产回调地址应使用 HTTPS。 | <span class="cfg-src">V2&#95;&#95;data.sql:135</span> |
| `SOCIAL_WECHAT_OPEN_CLIENT_ID` | `string` |  | social / 微信开放平台 ClientId<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br><strong>注意</strong>：生产回调地址应使用 HTTPS。 | <span class="cfg-src">V2&#95;&#95;data.sql:136</span> |
| `SOCIAL_WECHAT_OPEN_CLIENT_SECRET` | `string` |  | social / 微信开放平台 ClientSecret<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br><strong>注意</strong>：数据库明文存储敏感值，仅接口响应脱敏；限制数据库、备份和日志访问。 / 生产回调地址应使用 HTTPS。 | <span class="cfg-src">V2&#95;&#95;data.sql:137</span> |
| `SOCIAL_WECHAT_OPEN_REDIRECT_URI` | `string` |  | social / 微信开放平台 回调地址<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br><strong>注意</strong>：生产回调地址应使用 HTTPS。 | <span class="cfg-src">V2&#95;&#95;data.sql:138</span> |
| `SOCIAL_ALIPAY_CLIENT_ID` | `string` |  | social / 支付宝 ClientId<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br><strong>注意</strong>：生产回调地址应使用 HTTPS。 | <span class="cfg-src">V2&#95;&#95;data.sql:139</span> |
| `SOCIAL_ALIPAY_CLIENT_SECRET` | `string` |  | social / 支付宝 ClientSecret<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br><strong>注意</strong>：数据库明文存储敏感值，仅接口响应脱敏；限制数据库、备份和日志访问。 / 生产回调地址应使用 HTTPS。 | <span class="cfg-src">V2&#95;&#95;data.sql:140</span> |
| `SOCIAL_ALIPAY_REDIRECT_URI` | `string` |  | social / 支付宝 回调地址<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br><strong>注意</strong>：生产回调地址应使用 HTTPS。 | <span class="cfg-src">V2&#95;&#95;data.sql:141</span> |
| `SOCIAL_DINGTALK_CLIENT_ID` | `string` |  | social / 钉钉 ClientId<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br><strong>注意</strong>：生产回调地址应使用 HTTPS。 | <span class="cfg-src">V2&#95;&#95;data.sql:142</span> |
| `SOCIAL_DINGTALK_CLIENT_SECRET` | `string` |  | social / 钉钉 ClientSecret<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br><strong>注意</strong>：数据库明文存储敏感值，仅接口响应脱敏；限制数据库、备份和日志访问。 / 生产回调地址应使用 HTTPS。 | <span class="cfg-src">V2&#95;&#95;data.sql:143</span> |
| `SOCIAL_DINGTALK_REDIRECT_URI` | `string` |  | social / 钉钉 回调地址<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br><strong>注意</strong>：生产回调地址应使用 HTTPS。 | <span class="cfg-src">V2&#95;&#95;data.sql:144</span> |
| `SOCIAL_GITHUB_ENABLED` | `boolean` | false | social / GitHub 是否启用<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br>可选值：true / false<br><strong>注意</strong>：生产回调地址应使用 HTTPS。 | <span class="cfg-src">V2&#95;&#95;data.sql:145</span> |
| `SOCIAL_GITEE_ENABLED` | `boolean` | false | social / Gitee 是否启用<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br>可选值：true / false<br><strong>注意</strong>：生产回调地址应使用 HTTPS。 | <span class="cfg-src">V2&#95;&#95;data.sql:146</span> |
| `SOCIAL_QQ_ENABLED` | `boolean` | false | social / QQ 是否启用<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br>可选值：true / false<br><strong>注意</strong>：生产回调地址应使用 HTTPS。 | <span class="cfg-src">V2&#95;&#95;data.sql:147</span> |
| `SOCIAL_WECHAT_OPEN_ENABLED` | `boolean` | false | social / 微信开放平台是否启用<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br>可选值：true / false<br><strong>注意</strong>：生产回调地址应使用 HTTPS。 | <span class="cfg-src">V2&#95;&#95;data.sql:148</span> |
| `SOCIAL_ALIPAY_ENABLED` | `boolean` | false | social / 支付宝是否启用<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br>可选值：true / false<br><strong>注意</strong>：生产回调地址应使用 HTTPS。 | <span class="cfg-src">V2&#95;&#95;data.sql:149</span> |
| `SOCIAL_DINGTALK_ENABLED` | `boolean` | false | social / 钉钉是否启用<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br>可选值：true / false<br><strong>注意</strong>：生产回调地址应使用 HTTPS。 | <span class="cfg-src">V2&#95;&#95;data.sql:150</span> |
| `SOCIAL_ALIPAY_PUBLIC_KEY` | `string` |  | social / 支付宝公钥<br><strong>必填：对应平台 ENABLED=true 时 ClientId、ClientSecret、Redirect URI 必填；支付宝还需公钥</strong><br><strong>注意</strong>：生产回调地址应使用 HTTPS。 | <span class="cfg-src">V2&#95;&#95;data.sql:151</span> |

</div>

