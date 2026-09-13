---
title: ypbin-starter-web
description: Web 层 模块能力说明与配置参考。
---

# web — Web 层

引入即生效，无需注解：

- 全局异常处理：业务/校验/系统异常统一转 `R`，**所有异常返回 HTTP 200**，由 `R.code` 区分。`@RequestBody`/表单绑定校验（`BindException`）与 `@Validated` 方法级参数校验失败（`ConstraintViolationException`、`HandlerMethodValidationException`）统一映射业务码 `BAD_REQUEST`（400），参数错误不再误报系统异常。
- 404 统一 JSON：访问不存在的接口返回 `R.fail(404, "接口不存在")`，而非默认 HTML 错误页（默认已开启 `throw-exception-if-no-handler-found`）。
- CORS：默认关闭，按需开启：

```yaml
ypbin:
  web:
    cors:
      enabled: true
      allowed-origin-patterns: ["https://*.example.com"]
    xss:
      enabled: true                 # XSS 过滤默认关闭，按需开启
      excludes: ["/webhook/**"]     # 放行路径（不做清洗）
```

XSS 过滤为**黑名单删除式**：对请求参数（Query/表单）与请求头逐一清洗，直接**删除**命中的危险片段（`<script>` 标签、`javascript:`/`vbscript:` 前缀、`on` 事件属性、`eval()/expression()` 等），并非对整段内容做 HTML 转义，只能拦截已知模式（删除式清洗的固有局限）。**JSON 请求体不在本过滤器范围**：包装器不读改写请求体、Jackson 反序列化层也未接入清洗器，JSON body 中的脚本内容会原样进入业务层——需要清洗 JSON 字符串字段时，请自行接入自定义的 Jackson `String` 反序列化清洗器。

**可重复读请求**：Servlet 请求体默认只能读一次。开启后以最高优先级包装请求，缓存 body 供签名校验、日志、Controller 等多方重复读取，解决"body 被上游读走后下游读空"。签名模块依赖它：

```yaml
ypbin:
  web:
    repeatable-read:
      enabled: true             # 启用接口签名时需一并开启
      max-body-bytes: 10485760  # 单请求可缓存上限（字节），默认 10MB，合法范围 (0, 64MB]
```

请求体超过缓存上限（413 语义）时拒绝缓存与读取；因超限发生在进入 MVC 层之前、`@RestControllerAdvice` 捕获不到，过滤器直接在 Filter 层写回统一 `R`（HTTP 200 + `code=413`），不会退化成容器 500。上限配置非法（≤ 0 或 > 64MB）时**装配期即启动失败**（fail-fast），杜绝 `Long` 边界溢出导致请求体被静默读空的退化路径。

文件上传（multipart）不缓存，避免大文件占用内存。

## API 版本管理（Spring Framework 7 原生）

Spring Framework 7 的 `@RequestMapping` / `@GetMapping` 等注解自带 `version` 属性，另有 `WebMvcConfigurer#configureApiVersioning` 配置版本解析策略。本模块据此提供开箱可用的版本化管理，**默认关闭**以免改变既有路由匹配行为：

```yaml
ypbin:
  web:
    api-version:
      enabled: true
      resolver: HEADER          # HEADER（默认）/ QUERY_PARAM / PATH_SEGMENT
      header-name: X-Api-Version
      query-param: version      # resolver=QUERY_PARAM 时使用
      path-segment-index: 1     # resolver=PATH_SEGMENT 时使用（从 1 开始）
      version-required: false   # true 则请求必须带版本
      default-version: "1.0"    # 未带版本时的归属版本
      supported-versions: ["1.0", "2.0"]   # 留空则按已注册映射自动探测
```

之后同一路径的不同版本由框架按版本条件路由，无需自建 URL 前缀或网关路由规则：

```java
@GetMapping(value = "/user", version = "1.0")
public R<UserResp> getV1() { ... }

@GetMapping(value = "/user", version = "2.0")
public R<UserResp> getV2() { ... }
```

未声明 `version` 的既有映射仍可正常访问，无版本请求归入 `default-version`。版本解析方式建议用请求头（语义清晰、不污染 URL）。

## 异常解包

框架常把业务异常包装成自有类型后再抛出，例如 MyBatis 会把租户拦截器抛出的 `BusinessException` 包成 `MyBatisSystemException`。全局异常处理器会**沿 cause 链解包**（上限 10 层）：根因若是 `BusinessException` / `BaseException`，仍按原业务码与提示返回，避免可预期的业务原因被降级成无从排查的「系统内部错误」500。
