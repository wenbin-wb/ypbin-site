---
title: ypbin-starter-ai
description: Spring AI 对话能力封装：动态模型解析、流式对话、记忆与 RAG。
---

# ai — AI 对话能力

基于 Spring AI 2.0 的对话能力封装：流式/非流式对话、多轮记忆、可选 RAG 检索增强，并支持**从业务配置表动态解析模型**（无需在 yml 中配置模型 starter，模型地址/密钥/型号全部运行时下发）。

## 动态模型解析（核心设计）

模型不写在 yml，而是由业务方实现 `AiModelConfigResolver` 从配置表读取当前启用的模型，starter 据此动态构建 OpenAI 兼容客户端：

```java
public interface AiModelConfigResolver {
    AiModelInfo resolve();   // 返回 null 表示暂无可用的模型

    record AiModelInfo(String baseUrl, String apiKey, String modelName) {}
}
```

```java
@Component
public class MyModelConfigResolver implements AiModelConfigResolver {
    @Override
    public AiModelInfo resolve() {
        // 从 ai_model_config 表读取「默认启用」的模型，返回 baseUrl/apiKey/modelName
        ...
    }
}
```

装配规则（`AiChatAutoConfiguration`）：

- yml 中已配置模型 starter（存在 `ChatClient` Bean）→ 优先使用 yml 实例；
- 未配置但存在 `AiModelConfigResolver` → 每次请求动态构建 `OpenAiChatModel`；
- 两者皆无 → 调用时抛出明确错误「未配置可用的模型」。

实现细节（踩坑沉淀，改这里前先读）：

- 动态构建需**同时提供同步与异步客户端**（`OpenAIClientImpl` + `OpenAIClientAsyncImpl`），`OpenAiChatModel.build()` 在异步客户端缺失时会自行装配并因无凭证报错；
- **传输层客户端（okhttp 连接池）必须按请求独立创建**：Spring AI 流式调用结束后会关闭持有的 OpenAI 客户端（连带关闭底层连接池），共享实例会导致后续请求被拒绝（`ThreadPoolExecutor[Terminated]`）；okhttp 空闲线程/连接会自动回收，独立创建无泄漏；
- `baseUrl` 需符合 OpenAI 兼容惯例（以 `/v1` 结尾，如 `https://api.deepseek.com/v1`）：SDK 按 `{baseUrl}/chat/completions` 拼路径，缺 `/v1` 会 404 Unknown。业务侧的「测试连接」逻辑会自动尝试补 `/v1`，但对话走 SDK 需要配置本身就正确。

## 引入

```xml
<dependency>
    <groupId>cn.ypbin</groupId>
    <artifactId>ypbin-starter-ai</artifactId>
</dependency>
```

传递引入 `spring-ai-openai`（openai-java SDK）。记忆持久化需要额外引入：

```xml
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-starter-model-chat-memory-repository-jdbc</artifactId>
</dependency>
```

## 配置

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `ypbin.ai.enabled` | true | 模块总开关 |
| `ypbin.ai.chat.enabled` | true | 对话能力开关 |
| `ypbin.ai.chat.default-system-prompt` | 你是一个专业的企业级 AI 助手… | 默认系统提示词（支持 `{username}`、`{tenantName}` 占位符） |
| `ypbin.ai.chat.rag-enabled` | false | 普通对话是否附加全局 RAG（需 `ypbin.ai.rag.enabled=true`） |
| `ypbin.ai.chat.stream-timeout-ms` | 0 | 流式响应超时（毫秒），0 不超时 |
| `ypbin.ai.memory.type` | in-memory | 记忆存储：`in-memory`（重启丢失）/ `jdbc`（持久化，需 JDBC 依赖与建表） |
| `ypbin.ai.memory.window-size` | 20 | 记忆窗口大小（每次请求携带的历史消息条数），admin 默认 10 |
| `ypbin.ai.rag.enabled` | false | RAG 总开关（需 VectorStore 依赖） |
| `ypbin.ai.rag.top-k` | 5 | 检索条数 |
| `ypbin.ai.rag.similarity-threshold` | 0.7 | 相似度阈值 |
| `ypbin.ai.rag.max-context-length` | 8000 | 检索上下文最大字符数 |

> 历史消息窗口统一由 `ypbin.ai.memory.window-size` 控制，`AiChatProperties` 不存在 `window-size` 字段，`ypbin.ai.chat.window-size` 是死键不会生效（见 application.yml 注释与 `AiChatProperties` 源码）。
>
> `ypbin.ai.rag.enabled=true` 时若容器内没有 `AiEmbeddingConfigResolver` 实现，装配阶段会**直接抛出可操作的错误**（而非难以定位的 `NoSuchBeanDefinitionException`）；需要 RAG 请提供该 Bean，否则保持开关为 `false`。

## 向量库落盘（合并写 + 原子替换）

`ypbin.ai.rag.simple-store-path` 配置后，向量库会持久化到本地文件。整库序列化本身是 O(N)，
**每次 `add()` 都同步落盘**会让批量入库退化为 O(N²)（第 k 批重写前 k 批全部数据）。为此落盘做了两件事：

| 机制 | 说明 |
|---|---|
| 并发合并（恒生效） | 同一时刻只有一个线程真正写文件，写入期间到达的变更只额外触发一轮，循环复查脏标记保证**最后一次变更必然落盘** |
| 原子替换 | 先写同目录 `*.tmp`，再 `ATOMIC_MOVE` 覆盖目标文件——避免写文件中途退出留下半个 JSON 导致下次启动加载失败 |
| 防抖合并（可选） | `ypbin.ai.rag.persist-debounce-ms`（默认 `0` = 写透）；设为正值（如 `1000`）可把顺序 N 次变更合并为约 1 次落盘 |

```yaml
ypbin:
  ai:
    rag:
      simple-store-path: ./data/vector-store.json
      persist-debounce-ms: 1000   # 批量导入时开启；正常关闭会强制落盘
```

> **取舍**：开启防抖后，硬崩溃（SIGKILL/断电）可能丢失最近一个防抖窗口内的增量；正常关闭由销毁钩子
> 强制落盘。向量库可由原始文档重建，故对导入类场景可接受；若要求每次写入都持久，保持默认 `0`。

## 用户提交 URL 的 SSRF 防护

知识库从 URL / sitemap / RSS 导入时，目标是**用户可控的外部地址**，必须按不可信输入处理。推荐直接复用 Spring Boot 4.1 内置的 `InetAddressFilter`（`spring-boot-http-client`），它由框架维护完整的特殊用途网段清单，比自行枚举更全面且随版本更新：

```java
/** 仅放行公网可路由地址；其余（环回、链路本地、私网、CGNAT、组播、文档/基准测试保留段）一律拦截 */
private static final InetAddressFilter EXTERNAL_ADDRESS_FILTER = InetAddressFilter.externalAddresses();

private static boolean isBlockedAddress(InetAddress address) {
    return !EXTERNAL_ADDRESS_FILTER.matches(address);
}
```

`externalAddresses()` 的语义是 `routable() AND NOT (multicast() OR specialPurpose())`，已覆盖 `100.64.0.0/10`（CGNAT，云厂商元数据服务段如 100.100.100.200）在内的特殊用途网段。

> **不要全局默认拦截内网地址**：微服务之间通过 `lb://` 调用解析出的正是内网 IP，对出站 HTTP 客户端一刀切套用 `externalAddresses()` 会切断所有服务间调用。SSRF 防护应按用途收口在「抓取用户提交 URL」这类具体路径上。除地址校验外，还应同时设置请求超时与响应体上限，并**禁止跟随重定向**（重定向可绕过域名层校验）。

## 记忆与建表

`ypbin.ai.memory.type=jdbc` 时使用 Spring AI 的 `JdbcChatMemoryRepository`，查询语句硬编码大写表名 `SPRING_AI_CHAT_MEMORY`。建表 SQL 与 Spring AI 官方 `schema-mysql.sql` 一致（列名/索引完全匹配），由业务方通过 Flyway 等迁移工具创建，starter 不自动建表：

```sql
CREATE TABLE IF NOT EXISTS SPRING_AI_CHAT_MEMORY (
    `conversation_id` VARCHAR(36) NOT NULL,
    `content` TEXT NOT NULL,
    `type` ENUM('USER', 'ASSISTANT', 'SYSTEM', 'TOOL') NOT NULL,
    `timestamp` TIMESTAMP NOT NULL,
    `sequence_id` BIGINT NOT NULL,
    INDEX `SPRING_AI_CHAT_MEMORY_CONVERSATION_ID_TIMESTAMP_IDX` (`conversation_id`, `timestamp`),
    INDEX `SPRING_AI_CHAT_MEMORY_CONVERSATION_ID_SEQUENCE_ID_IDX` (`conversation_id`, `sequence_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
```

## 使用

注入 `AiChatService`，业务侧不直接接触 Spring AI：

```java
@Autowired
private AiChatService aiChatService;

// 流式：订阅 Flux 逐 token 消费（SSE 推送）
Flux<String> stream = aiChatService.chatStream(conversationId, userMessage);

// 非流式
String answer = aiChatService.chat(conversationId, userMessage);

// 指定知识库 RAG（需要 VectorStore）
Flux<String> withKb = aiChatService.chatWithKnowledge(conversationId, userMessage, knowledgeBaseId);

// 自定义系统提示词
Flux<String> custom = aiChatService.chatWithSystemPrompt(conversationId, systemPrompt, userMessage);

// 清除会话记忆
aiChatService.clearMemory(conversationId);
```

`conversationId` 由业务方生成（如会话表主键），记忆按会话隔离；清除记忆同时影响多轮上下文与 JDBC 持久化数据。

## Token 用量与成本监控

实现 `AiUsageListener` SPI 接口并注入 Spring 容器，即可接收每次 AI 对话调用的用量、响应时延与终局结果，实现零侵入审计与计费：

```java
@Component
public class SysAiUsageListener implements AiUsageListener {

    @Override
    public void onUsage(AiUsageInfo usage) {
        // 失败/取消同样会回调，先按 outcome 分流，再决定是否计费
        if (usage.outcome() != AiUsageOutcome.SUCCESS) {
            log.warn("模型: {}, 会话: {}, 结果: {}, 耗时: {}ms, 原因: {}",
                usage.model(), usage.conversationId(), usage.outcome(),
                usage.durationMs(), usage.errorMessage());
            return;
        }
        log.info("模型: {}, 会话: {}, 耗时: {}ms, 消耗 Tokens: {}",
            usage.model(), usage.conversationId(), usage.durationMs(), usage.totalTokens());
    }
}
```

**触发契约**：`chat` / `chatStream` / `chatWithKnowledge` / `chatWithSystemPrompt` 四个方法在一次调用（流式为一次订阅）中**恰好回调一次**，由 `AiUsageInfo#outcome()` 区分三类终局：

| `AiUsageOutcome` | 触发场景 | `errorMessage` |
|---|---|---|
| `SUCCESS` | 正常完成（流式 `onComplete`） | `null` |
| `FAILURE` | 上游异常或超时（流式以 `onError` 终止）；超时按失败上报，不是取消 | 失败原因摘要 |
| `CANCELLED` | 调用方取消（SSE 客户端断开、下游 `dispose()`，流式以 `onCancel` 终止） | `null` |

失败与取消都会回调，因此「有请求但无用量记录」不再是黑洞。实现抛出的异常由 starter 捕获并 `log.error` 记录完整堆栈，**不影响对话主流式输出**，也不会改变主流程的成功/失败语义，故实现方应保证幂等且快速返回。上游未回报模型名时 `usage.model()` 为占位标识 `unknown`。

> **Token 字段可空，`null` 绝不折算成 0**：`promptTokens` / `generationTokens` / `totalTokens` 均为可空 `Long`，`null` 表示**上游未回报用量**——落库请存 NULL、看板与计费按「未知」处理，**不得当作 0 计费或统计**。上游未返回 usage 时框架给的是 `0`，与「真实 0 token」用任何判据都不可区分，因此 starter 一律把 0（或负数）上报为 `null`，绝不以 0 冒充真实值。是否拿到上游真实用量可用 `AiUsageInfo#usageReported()` 判断。

> **流式用量只在最后一个分片回报，且取决于 `include-usage`**：用量通常只在流式的**最后一个分片**返回。Spring AI 仅在宿主**未配置** `spring.ai.openai.chat.options.stream-options.*` 时才默认请求 `stream_options.include_usage=true`；一旦配置了该组中的任一键，**必须显式补上 `include-usage: true`**，否则上游不回传用量，回调里的三个 token 字段全为 `null`。**生效范围**：该组属性只在宿主自行装配 yml 模型（容器内存在 `ChatModel`/`ChatClient` Bean，starter 直接复用）时生效；**模型配置表驱动**的主路径由 starter 自建客户端且只设置模型名、不读取 `spring.ai.*`，此时 `streamOptions` 为空、框架默认已请求 `include_usage=true`，无需该 yaml。

```yaml
spring:
  ai:
    openai:
      chat:
        options:
          stream-options:
            include-usage: true
```

> **已知边界**：RAG 检索与文档入库调用的 **embedding** token 目前没有埋点，`AiUsageListener` 只覆盖对话（chat）用量。

