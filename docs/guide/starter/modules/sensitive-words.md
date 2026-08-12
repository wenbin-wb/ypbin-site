---
title: ypbin-starter-sensitive-words
description: 敏感词过滤 模块能力说明与配置参考。
---

# sensitive-words — 敏感词过滤

基于 Hutool DFA，检测/替换敏感词。词库来源：配置静态词库，或实现 `SensitiveWordProvider` 从库/远程加载：

```yaml
ypbin:
  sensitive-words:
    words: [敏感词1, 敏感词2]
    replacement: '*'
```

```java
@Autowired
private SensitiveWordService service;

boolean hit = service.contains(text);
String clean = service.filter(text, '*');   // 命中词替换为等长 *
List<String> hits = service.findAll(text);
service.reload(newWords);                    // 词库热更新
```

非注入场景（校验工具、DTO 自校验）可用静态门面 `SensitiveWordUtils`：

```java
if (SensitiveWordUtils.contains(text)) { ... }
String clean = SensitiveWordUtils.filter(text, '*');
```
