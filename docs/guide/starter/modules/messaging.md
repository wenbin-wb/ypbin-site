---
title: ypbin-starter-messaging
description: 消息（邮件 / WebSocket / SSE / MQTT） 模块能力说明与配置参考。
---

# messaging — 消息（邮件 / WebSocket / SSE / MQTT）

**邮件**：SMTP 配置默认读 `ypbin.mail.*`，也可由业务方实现 `MailConfigProvider` 从数据库读取，支持后台可视化配置、改完不重启即时生效（`MailService` 按配置指纹缓存底层 sender，配置变化自动重建）：

```yaml
ypbin:
  mail:
    host: smtp.qq.com
    port: 465
    username: your@qq.com
    password: your-auth-code      # 授权码/密码
    from: noreply@qq.com          # 发件人，为空取 username
    from-name: 系统通知            # 发件人显示名（可选）
    ssl-enabled: true
    starttls-enabled: false
```

```java
@Autowired
private MailService mailService;

mailService.sendText("to@example.com", "标题", "正文");
mailService.sendHtml("to@example.com", "标题", "<h1>HTML 正文</h1>");
mailService.sendWithAttachments("to@example.com", "标题", "正文", false, new File("report.xlsx"));
mailService.sendTest("to@example.com");   // 后台"保存配置前先测一封"，失败抛异常带原因
boolean ready = mailService.isConfigured();
```

发件人默认取 `from`（为空取 `username`）。非注入场景（异步任务、工具方法）可用静态门面 `MailUtils`：

```java
MailUtils.sendText("to@example.com", "标题", "正文");
MailUtils.sendHtml("to@example.com", "标题", "<h1>HTML</h1>");
```

**后台动态配置**：admin 把 SMTP 配置存表、做页面时，实现 `MailConfigProvider` 从数据库读即可覆盖默认配置文件来源，改完下次发送即时生效：

```java
@Component
public class DbMailConfigProvider implements MailConfigProvider {
    @Override
    public MailConfig getConfig() {
        // 从配置表读 SMTP 参数，组装为 MailConfig
    }
}
```

**短信**：基于短信聚合框架 sms4j，一套接口统一阿里云/腾讯云/华为云等多厂商。需引入 sms4j 依赖与对应厂商依赖并配置：

```xml
<dependency>
    <groupId>org.dromara.sms4j</groupId>
    <artifactId>sms4j-spring-boot-starter</artifactId>
</dependency>
```

```yaml
# sms4j 原生配置（厂商密钥/模板），配置文件方式
sms:
  blends:
    ali:                      # configId
      supplier: alibaba
      access-key-id: xxx
      access-key-secret: xxx
      signature: 签名
      template-id: SMS_xxx
```

```java
@Autowired
private SmsService smsService;

smsService.send("13800138000", "1234");                               // 单变量
smsService.sendByTemplate("13800138000", "SMS_xxx", Map.of("code", "1234"));
smsService.sendByConfig("ali", "138...", "SMS_xxx", Map.of("code", "1234")); // 指定厂商
```

非注入场景用静态门面 `SmsUtils.send(...)`。**后台动态配置**：厂商密钥要做成后台可配置时，实现 sms4j 的 `SmsReadConfig` 从数据库读取（sms4j 原生扩展点），改完即时生效，无需重启——starter 不再包一层，避免配置翻译。

**WebSocket（STOMP 实时推送）**：需引入 `spring-boot-starter-websocket` 并开启：

```yaml
ypbin:
  websocket:
    enabled: true
    endpoint: /ws
    broker-prefix: /topic
    heartbeat-server: 10000   # 服务端心跳(ms)，保活并探测半开连接
```

业务方注入 `SimpMessagingTemplate` 向客户端广播。**可靠性说明**：内置 SimpleBroker 为内存代理，服务重启消息丢失、不保证送达；生产需可靠投递时，自定义 `WebSocketMessageBrokerConfigurer` 接入 RabbitMQ/ActiveMQ 的 STOMP relay。

**SSE（服务端单向推送）+ 统一推送门面**：适合「全局未读提醒」「扫码登录状态变更」「大屏数据刷新」等服务端主动推、免前端长轮询的场景。SSE 基于 HTTP，比 WebSocket 更轻、浏览器 `EventSource` 自动重连。开启：

```yaml
ypbin:
  sse:
    enabled: true
    register-endpoint: true      # 是否注册内置订阅端点与换票端点（还需存在鉴权来源，见下）
    path: /ypbin/sse/subscribe
    ticket-path: /ypbin/sse/ticket   # 一次性票据签发端点（Header 令牌鉴权场景用）
    ticket-ttl-seconds: 30           # 票据有效期(秒)，换票后应尽快订阅
    timeout: 0                       # 连接总超时(ms)，默认 0 不超时（长连接常驻，见下）
    heartbeat-interval-seconds: 30   # 心跳间隔(秒)，定期发 : ping 注释帧保活/检测死连接；0 关闭
```

**长连接保活与回收**：默认 `timeout: 0`（不设总超时）+ 心跳（默认 30 秒一条 `: ping` 注释帧）——心跳保活中间代理并尽早发现死连接（发送失败即回收），适合通知中心等长连接场景（前端 `EventSource` 有自动重连兜底）。若配了有限 `timeout`，连接到点由容器回收（Tomcat 的异步超时是**自建连起算的总超时**，心跳无法重置），回收时全局异常处理器已静默化处理，不会刷 ERROR 日志、前端自动重连后无感续连。

**订阅端点的安全模型**：内置端点**不接收前端传入的 userId**，而是由服务端从登录态解析当前用户来建立连接——前端连接参数无需被信任，从根源杜绝「凭 URL 上的 userId 订阅他人推送」的越权。

因此内置端点仅在存在 `SseUserIdResolver` Bean 时才注册：**引入 security 模块即自动桥接**一个基于登录会话的实现（用当前登录用户 ID 订阅）；未引入 security（或无该 Bean）时内置端点不注册，需自行提供实现或自建带鉴权的端点。

> **与全局登录拦截的关系（自动处理，无需手动配白名单）**：引入 security 且启用全局登录拦截时，starter 会**自动把订阅端点 `ypbin.sse.path` 加入 Sa-Token 放行列表**——订阅靠 ticket 或 Cookie 登录态自证，若被登录拦截器在进控制器前拦死，ticket 逻辑就走不到。**换票端点 `ypbin.sse.ticket-path` 不放行**（它靠登录态签发票据，必须保留拦截）。这一放行是 starter 端点自己的契约要求，如同自动放行 SpringDoc 文档路径，接入方无需往 `ypbin.security.excludes` 手动添加。

前端建立订阅——不传 userId，鉴权走登录态（Cookie/Session 会随 `EventSource` 自动携带；`EventSource` 原生不能带 `Authorization` 头，若鉴权依赖 header，见下方自建端点）：

```javascript
const es = new EventSource('/ypbin/sse/subscribe');
es.addEventListener('unread-count', e => render(JSON.parse(e.data)));
```

自定义订阅用户来源（覆盖默认桥接，或在未引入 security 时提供）：

```java
@Component
public class MySseUserIdResolver implements SseUserIdResolver {
    @Override
    public Optional<String> resolve() {
        return LoginHelper.getUserIdSafely().map(String::valueOf);  // 从服务端登录态取，切勿读请求参数
    }
}
```

**Token 走 header 的场景（内置一次性票据）**：`EventSource` 不能设自定义头，若登录态靠 `Authorization` 头而非 Cookie，直接用内置的「先换票再订阅」流程——无需自建端点：

1. 前端先用**带令牌的普通请求**（能带 Authorization 头）换票：

```javascript
// 携带你正常的鉴权头（如 Authorization），换取一次性票据
const { data } = await axios.post('/ypbin/sse/ticket');   // 返回 { ticket, expiresIn }
```

2. 再用票据订阅（`EventSource` 不带头也没关系，票据本身即已鉴权的凭证）：

```javascript
const es = new EventSource(`/ypbin/sse/subscribe?ticket=${data.ticket}`);
es.addEventListener('unread-count', e => render(JSON.parse(e.data)));
```

票据**短时有效（默认 30 秒）、一次性消费**（订阅时即失效，杜绝重放），绑定的用户在换票时已由登录态确定。存储有 Redis 用 Redis（多节点共享、Lua 原子消费）、否则内存。订阅端点按 `ticket` 是否存在自动切换：带 `ticket` 走票据校验，不带则走登录态（Cookie 场景）——同一端点两种鉴权方式共存，无需业务方选择。

> 换票端点 `/ypbin/sse/ticket` 需处于你的登录鉴权拦截范围内（它靠 `SseUserIdResolver` 解析当前登录用户来签发票据）。若引入 security 模块并启用全局拦截，默认即受保护。

后端用统一门面 `PushService` 推送，屏蔽底层通道：

```java
@Autowired
private PushService pushService;

pushService.sendToUser("123", "unread-count", Map.of("count", 5));   // 推指定用户
pushService.broadcast("dashboard-refresh", dashboardData);           // 广播（大屏刷新）
boolean online = pushService.isOnline("123");                        // 是否在线
```

非注入场景（异步任务、事件监听、工具方法）用静态门面 `PushUtils`（内部委托 `PushService`）：

```java
PushUtils.sendToUser("123", "unread-count", Map.of("count", 5));
PushUtils.broadcast("dashboard-refresh", dashboardData);
```

**多实例说明**：SSE 连接与 `PushService` 默认基于单实例内存连接表；微服务多副本下，A 实例发起的推送到不了连在 B 实例的客户端。跨实例扇出需在上层配合 Redis Pub/Sub 或 MQTT 中转（业务方自定义 `PushService` 覆盖默认实现即可接入）。

**MQTT（Paho）**：需引入 `org.eclipse.paho.client.mqttv3` 并开启：

```yaml
ypbin:
  mqtt:
    enabled: true
    url: tcp://127.0.0.1:1883
    default-qos: 1
    automatic-reconnect: true       # 断线自动重连
    max-reconnect-delay: 30000      # 重连退避上限(ms)
    max-inflight: 10                # QoS1/2 最大在途消息
    persistence-dir: /data/mqtt     # 文件持久化，重启不丢 QoS1/2 未确认消息（留空则内存）
```

```java
@Autowired
private MqttPublisher mqttPublisher;

mqttPublisher.publish("device/1/cmd", payload);          // 默认 QoS
mqttPublisher.publish("device/1/cmd", payload, 2, false); // 指定 QoS/retained
```

消费推荐实现 `MqttMessageHandler` Bean，容器启动后自动订阅并进入回调：

```java
@Component
public class DeviceUpMessageHandler implements MqttMessageHandler {
    @Override
    public String topic() {
        return "device/+/up";
    }

    @Override
    public Integer qos() {
        return 1;
    }

    @Override
    public void handle(String topic, String payload) {
        // 这里就是 MQTT 消费回调
    }
}
```

临时订阅也可直接使用 `MqttSubscriber`，以「主题 → 回调」接收消息（回调参数为 topic 与 UTF-8 解码后的 payload）：

```java
@Autowired
private MqttSubscriber mqttSubscriber;

mqttSubscriber.subscribe("device/+/up", (topic, payload) -> handle(topic, payload));
mqttSubscriber.subscribe("alarm/#", 2, (topic, payload) -> alarm(payload));  // 指定 QoS
mqttSubscriber.unsubscribe("device/+/up");
```

断线自动重连后 Paho 会丢失原订阅，`MqttSubscriber` 会登记主题和消费回调，并在重连完成时自动恢复订阅，业务无需处理。
