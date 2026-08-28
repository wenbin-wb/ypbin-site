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

实现 `AiUsageListener` SPI 接口并注入 Spring 容器，即可在每次 AI 对话完成时接收 Token 消耗指标与响应时延，实现零侵入审计与计费：

```java
@Component
public class SysAiUsageListener implements AiUsageListener {

    @Override
    public void onUsage(AiUsageInfo usage) {
        log.info("模型: {}, 会话: {}, 耗时: {}ms, 消耗 Tokens: {}", 
            usage.model(), usage.conversationId(), usage.durationMs(), usage.totalTokens());
    }
}
```

