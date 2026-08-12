---
title: ypbin-starter-captcha
description: 行为验证码 模块能力说明与配置参考。
---

# captcha — 行为验证码

基于 tianai-captcha，支持滑块、旋转、点选、拼接，带行为轨迹校验。验证码状态由其自带缓存
（本地/Redis 自动切换）管理，一次性有效：

```java
@Autowired
private CaptchaService captchaService;

// 生成（默认滑块，也可传 CaptchaTypeConstant.ROTATE 等）
ApiResponse<?> data = captchaService.generate();   // 返回 id + 图片，前端渲染

// 校验：前端回传采集到的行为轨迹
boolean ok = captchaService.verify(id, track);
```

内置默认资源（SLIDER/ROTATE 模板、字体、背景图）由 starter 在启动时幂等自动加载，零配置即可
开箱使用；如需自定义模板/背景图或二次校验，通过 tianai 自身的配置项调整。

默认只加载 tianai 内置的单张背景图，验证码画面单一。配置多张自定义背景后全部注册，验证码随机取用：

```yaml
ypbin:
  captcha:
    enabled: true
    background-resources:            # classpath 相对路径，为空则回退加载内置默认背景
      - captcha/bg/1.jpg
      - captcha/bg/2.jpg
      - captcha/bg/3.jpg
```

对应资源需放在 `resources/captcha/bg/` 下随 jar 打包。
