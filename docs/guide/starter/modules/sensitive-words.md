---
title: ypbin-starter-sensitive-words
description: 敏感词过滤 模块能力说明与配置参考。
---

# sensitive-words — 敏感词过滤

基于 Hutool DFA，检测/替换敏感词。词库来源：配置静态词库，或实现 `SensitiveWordProvider` 从库/远程加载：

```yaml
ypbin:
  sensitive-words:
    words: [赌博, 色情, 违禁]   # 静态词库；也可实现 SensitiveWordProvider 动态加载
    replacement: '*'             # 命中词替换字符，默认 *
```

## 注解驱动（推荐，1.4.0+）

在 DTO 字段上标注 `@SensitiveWordFilter` 声明哪些字段需要过滤，在 Service 方法上标注触发 AOP 自动处理，无需手动注入服务：

```java
// 1. DTO 字段上声明
public class NoticeSaveReq {
    @SensitiveWordFilter
    private String title;

    @SensitiveWordFilter
    private String content;
    // ...
}

// 2. Service 方法上触发
@Override
@SensitiveWordFilter  // AOP 在方法执行前过滤所有标注字段
@Transactional
public void createNotice(NoticeSaveReq req) {
    // req.title / req.content 已被替换，无需手动调用
}
```

切面逐一遍历方法入参，对每个对象找出标注了 `@SensitiveWordFilter` 的 `String` 字段并原地替换（使用 `ypbin.sensitive-words.replacement` 配置的字符）。支持 `@ConditionalOnMissingBean` 覆盖切面实现。

## 编程式调用

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
