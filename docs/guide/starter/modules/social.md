---
title: ypbin-starter-social
description: 第三方登录 模块能力说明与配置参考。
---

# social — 第三方登录

基于 JustAuth 的 OAuth 登录。各平台的 appId/secret/回调由业务方持有，故为每个平台实现 `AuthRequestProvider` 注册授权请求，`SocialService` 按平台调度：

```java
@Component
public class GithubAuthProvider implements AuthRequestProvider {
    @Override public String getSource() { return "github"; }
    @Override public AuthRequest getAuthRequest() {
        return new AuthGithubRequest(AuthConfig.builder()
            .clientId("...").clientSecret("...").redirectUri("...").build());
    }
}
```

```java
@Autowired
private SocialService socialService;

String url = socialService.authorizeUrl("github");        // 生成授权跳转地址
AuthUser user = socialService.login("github", callback);  // 回调换取用户信息
```
