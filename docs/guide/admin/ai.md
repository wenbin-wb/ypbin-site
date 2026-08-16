---
title: Admin AI 对话能力
description: AI 对话与模型配置的使用、配置、数据表与部署注意事项。
---

# Admin AI 对话能力

ypbin-admin 集成了 AI 对话（模型配置表驱动，OpenAI 兼容接口）与流式输出。功能入口：**AI 对话**（会话列表、流式问答、Markdown 渲染）与 **AI 模型配置**（多模型管理、连通性测试、默认模型、用量统计）。

## 快速上手

1. 进入 **AI 模型配置**，新增模型：名称、Provider、API Key、Base URL、模型名；
2. 点击 **测试连接** 校验连通性（自动尝试补 `/v1` 前缀），成功会显示延迟；
3. 点击 **设为默认**（对话使用默认且启用的模型）；
4. 进入 **AI 对话** 发起会话，回复以 SSE 流式逐字输出。

## 配置项（application.yml）

| 配置项 | admin 默认 | 说明 |
|---|---|---|
| `ypbin.ai.enabled` | true | AI 模块总开关 |
| `ypbin.ai.chat.default-system-prompt` | 你是 ypbin-admin 的 AI 助手… | 对话默认系统提示词 |
| `ypbin.ai.chat.window-size` | 10 | 携带历史消息条数；调大提升多轮连贯性、**调小降低首 token 延迟** |
| `ypbin.ai.chat.rag-enabled` | false | 全局 RAG 开关（需向量库） |
| `ypbin.ai.memory.type` | jdbc | 会话记忆持久化（重启不丢），依赖 `SPRING_AI_CHAT_MEMORY` 表（V5 迁移自动创建） |
| `ypbin.ai.memory.window-size` | 10 | 记忆窗口 |
| `ypbin.ai.rag.enabled` | false | RAG 总开关 |
| `ypbin.ai.model-config.secret-key` | ${AI_MODEL_SECRET_KEY:} | API Key 加密密钥（16/24/32 字节）；**生产必须注入 `AI_MODEL_SECRET_KEY` 环境变量**，未配置时使用内置开发密钥并告警 |

模型地址/密钥/型号不写在 yml，全部在 **AI 模型配置** 页维护（`ai_model_config` 表），API Key 加密落库、接口仅返回脱敏掩码。

## 数据表（Flyway 自动创建）

| 迁移 | 表 | 用途 |
|---|---|---|
| V3 | `ai_model_config` | 模型配置（多模型、默认标记、启停） |
| V3 | `ai_conversation` / `ai_message` | 会话与消息 |
| V3 | `ai_knowledge_base` / `ai_document` | 知识库与文档（RAG） |
| V3 | `ai_prompt_template` | 提示词模板 |
| V3 | `ai_usage_log` | 用量统计 |
| V5 | `SPRING_AI_CHAT_MEMORY` | Spring AI JDBC 会话记忆（`ypbin.ai.memory.type=jdbc` 依赖，列名与 Spring AI 官方 schema 完全一致） |

## 模型 Base URL 注意事项

SDK 按 `{baseUrl}/chat/completions` 拼接，**Base URL 需以 `/v1` 结尾**：

- ✅ 正确：`https://api.deepseek.com/v1`、`https://opencode.ai/zen/go/v1`
- ❌ 错误：`https://api.deepseek.com`、`https://opencode.ai/zen/go`（对话报 404 Unknown；「测试连接」会自动补 `/v1` 探测，容易误以为配置没问题）

## 流式输出与代理

对话接口返回 SSE（`text/event-stream`），**任何反向代理都必须关闭响应缓冲**，否则回复会攒到流结束才一次性下发：

- **nginx**：`/api` 代理需 `proxy_buffering off;`（以及 `proxy_read_timeout` 适当放大，覆盖模型首 token 延迟）；
- **vite dev proxy**：项目已在 `vite.config.ts` 中将代理响应头强制为 `connection: keep-alive`（Node 默认按请求的 `Connection: close` 回敬，Chrome 会在首帧前的空闲期中止 SSE 长连接）；
- 前端 `chat()` 自行实现标准 SSE 帧解析（剥离 `data:` 前缀、逐帧 `requestAnimationFrame` 让出渲染），未使用 vben 的 `postSSE`（其仅原始转发分块）。

## 常见问题

| 现象 | 原因与处理 |
|---|---|
| 对话报「未配置可用的模型」 | `ai_model_config` 无默认且启用的模型；到模型配置页设置默认 |
| 回复「对话出错：404: Unknown」 | Base URL 缺 `/v1` 或模型名错误 |
| 回复一次性出现、不流式 | 反向代理缓冲了 SSE（见上文代理配置）；检查浏览器 DevTools 响应头是否带 `content-type: text/event-stream` 且逐帧到达 |
| 首 token 等待很久 | 模型本身响应时间 + 记忆窗口上下文长度；可调小 `ypbin.ai.chat.window-size` |
| 长会话历史消息显示异常 | 会话消息已持久化在 `ai_message`，正常；如记忆错乱可删除会话（同时清除 `SPRING_AI_CHAT_MEMORY` 对应记录） |
| 日志出现 `SPRING_AI_CHAT_MEMORY` 相关 SQL 错误 | 数据库未执行 V5 迁移；确认 Flyway 已升级到 v5 |
