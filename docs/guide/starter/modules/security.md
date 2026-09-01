---
title: ypbin-starter-security
description: 认证授权 模块能力说明与配置参考。
---

# security — 认证授权

基于 Sa-Token 封装：

- **全局登录拦截**：Servlet Web 环境下自动注册 `SaInterceptor` 做全局登录校验，无需自己写 `WebMvcConfigurer`。默认拦截 `/**`，放行 `ypbin.security.excludes`；检测到 api-doc 时自动放行 Swagger/`doc.html`/`v3/api-docs`/`webjars` 等文档路径。

```yaml
ypbin:
  security:
    interceptor: true            # 是否注册全局登录拦截器（默认开）
    includes: ["/**"]            # 拦截路径
    excludes: ["/login", "/captcha"]   # 放行路径（无需登录）
    exclude-api-doc: true        # 有 SpringDoc 时自动放行文档路径（默认开）
```

拦截器只校验「已登录」；细粒度权限/角色用方法上的 `@SaCheckPermission` 等注解。业务方提供自定义 `WebMvcConfigurer` 或设 `interceptor: false` 即可覆盖/停用。

- `LoginHelper`：`login(userId)` / `getUserId()` / `logout()`，统一以 `Long` 用户 ID 进出。
- `UserContext` + `LoginUser`：当前登录用户门面，登录时 `setLoginUser` 存会话，任意层 `getLoginUser`/`getUserId`/`getUsername`/`getTenantId`/`getClientId`/`getClientType`/`getAuthType` 读取。
- 登录客户端：`LoginClientProvider` 提供客户端配置，`LoginHelper.login(userId, LoginClientRequest)` 按客户端独立策略登录；starter 提供配置文件版默认实现，admin 有客户端管理表时实现 Provider 覆盖即可。

**登录客户端策略**：适合后台、App、小程序、开放 API 等不同入口配置不同 token 有效期、活跃超时、多端并发和登录方式。starter 只提供运行时抽象，不内置 admin 表和页面。

```yaml
ypbin:
  security:
    client-enabled: true
    default-client-id: web-admin
    clients:
      - client-id: web-admin
        client-type: WEB
        auth-types: [ACCOUNT, PHONE, EMAIL]
        timeout: 86400              # Token 固定有效期(秒)，为空使用 sa-token 全局配置
        active-timeout: 1800        # 活跃超时(秒)，为空使用 sa-token 全局配置
        concurrent: true            # 是否允许同账号多端同时登录
        share: false                # 多端登录是否共享同一个 token
        max-login-count: -1         # 同账号最大登录数量，-1 不限制
        replaced-range: ALL_DEVICE_TYPE
        replaced-login-exit-mode: OLD_DEVICE
        overflow-logout-mode: KICKOUT
        enabled: true
```

登录流程示例：

```java
LoginClientRequest clientReq = new LoginClientRequest(req.getClientId(), req.getAuthType());
clientReq.setClientSecret(req.getClientSecret());      // 浏览器端可不传；服务端/开放平台可启用
clientReq.setDeviceId(req.getDeviceId());              // App/多设备场景可传
LoginClient client = LoginHelper.login(userId, clientReq);

LoginUser user = new LoginUser(userId, username);
user.setClientId(client.getClientId());
user.setClientType(client.getClientType());
user.setAuthType(clientReq.getAuthType());
UserContext.setLoginUser(user);
```

admin 接数据库客户端管理时，只需实现：

```java
@Component
public class DbLoginClientProvider implements LoginClientProvider {
    @Override
    public Optional<LoginClient> findByClientId(String clientId) {
        // 从 sys_client 查询并转换为 LoginClient
    }
}
```

**Token 续期**：Sa-Token 是「续期」机制，不是 OAuth2 的 access+refresh 双令牌——不换 token，延长现有 token 有效期。两层超时：

```yaml
sa-token:
  timeout: 2592000          # 固定有效期(秒)，30 天，到点必过期
  active-timeout: 1800      # 活跃超时(秒)，30 分钟无操作则冻结
  auto-renew: true          # 活跃用户自动续期（开启后通常无需手动续）
```

开了 `auto-renew` 后活跃用户的 token 自动续期，一般不用手动调。需要显式控制或查剩余时长时用 `LoginHelper`：

```java
long timeout = LoginHelper.getTokenTimeout();          // 剩余有效期(秒)，-1 永不过期
long active = LoginHelper.getTokenActiveTimeout();     // 距被冻结剩余(秒)
LoginHelper.renewTimeout(3600);                        // 手动重设有效期
LoginHelper.updateLastActiveToNow();                   // 续活跃，避免被冻结
SaTokenInfo info = LoginHelper.getTokenInfo();         // token 完整信息
```

> 需要开放平台级 access+refresh 双令牌，才引 `sa-token-oauth2`；后台管理系统用上面的续期即可，不必上 OAuth2。
- 权限数据源：实现 `PermissionProvider` 提供用户的权限码与角色码，框架自动适配为 Sa-Token 的 `StpInterface`，无需直接依赖 Sa-Token API。

获取当前登录人信息：

```java
// 登录成功后写入完整用户信息到会话
LoginUser user = new LoginUser(userId, "tom");
user.setNickname("汤姆");
user.setTenantId(1001L);
user.setDeptId(8L);
user.setRoles(Set.of("admin"));
UserContext.setLoginUser(user);

// 之后任意层读取
Long userId = UserContext.getUserId();                 // 当前用户 ID（来自 Sa-Token 登录态）
Optional<LoginUser> current = UserContext.getLoginUser(); // 完整登录用户信息
Optional<String> name = UserContext.getUsername();     // 用户名
Optional<Long> tenant = UserContext.getTenantId();     // 租户 ID
Optional<String> clientId = UserContext.getClientId(); // 客户端 ID
UserContext.setAttribute("postId", 66L);               // 业务自有字段另存
Optional<Long> post = UserContext.getAttribute("postId", Long.class);
```

```java
@Component
public class MyPermissionProvider implements PermissionProvider {
    @Override
    public List<String> getPermissions(Object loginId, String loginType) {
        return permissionService.listByUserId(Long.valueOf(loginId.toString()));
    }
}
```

引入本模块后会自动对接 data 的审计字段（用当前登录用户填充 createUser/updateUser）。

**密码编码器** `PasswordEncoderUtil`：BCrypt 加密（自带随机盐），校验用 `matches` 而非比较密文：

```java
String hash = PasswordEncoderUtil.encode(rawPassword);
boolean ok = PasswordEncoderUtil.matches(rawPassword, hash);
```

**密码安全策略**：复杂度校验 + 错误锁定的运行时能力。starter 提供能力与扩展点，不内置策略配置表；策略来源可用配置文件，也可由业务系统实现 `PasswordPolicyProvider` 从配置中心/数据库读取，支持后台可视化调整。

```yaml
ypbin:
  security:
    password:
      min-length: 8               # 最小长度
      max-length: 32              # 最大长度
      require-digit: true         # 必须含数字
      require-letter: true        # 必须含字母
      require-uppercase: false    # 必须含大写
      require-symbol: false       # 必须含特殊字符
      require-lowercase: false    # 必须含小写
      allow-contain-username: false  # 是否允许含用户名（含反序）
      error-lock-count: 5         # 登录错误锁定阈值，0=不锁定
      lock-minutes: 15            # 账号锁定时长(分钟)
      expiration-days: 0          # 密码有效期(天)，0=永不过期
      expiration-warning-days: 0  # 到期提醒天数，0=不提醒
      history-count: 0            # 历史密码不可重复次数，0=不校验
```

> 策略每次实时读取：配置文件方式改 yml 需重启生效；若 admin 实现 `PasswordPolicyProvider` 从数据库读，则后台改配置即时生效，无需重启。

复杂度校验用 `PasswordValidator`（改密/注册时）：

```java
PasswordCheckResult result = passwordValidator.check(rawPassword, username);
if (!result.passed()) {
    throw new BusinessException(result.message());
}
```

错误锁定用 `PasswordAttemptLimiter`（登录流程）。账号标识大小写归一，计数默认按 `账号:IP` 维度：

```java
limiter.checkLocked(username, ip);        // 登录前：已锁定抛 AccountLockedException
if (!PasswordEncoderUtil.matches(raw, hash)) {
    limiter.recordFailure(username, ip);  // 密码错误：计数 +1，本次即达阈值则直接抛锁定
    throw new BusinessException("用户名或密码错误");
}
limiter.reset(username, ip);              // 登录成功：清除计数
```

后台/前端可查锁定状态与解锁：

```java
LockStatus status = limiter.getLockStatus(username, ip); // 是否锁定/失败次数/剩余次数/剩余解锁秒数
limiter.unlock(username);                                // 管理员解锁：清除该账号全部维度（无需知道被哪些 IP 锁）
```

计数默认存 Redis（有 Redis 时自动用，多节点共享）、否则内存，锁定时长即计数键 TTL、到期自动解锁。

密码有效期用 `PasswordExpiration`（纯计算，"强制改密"的登录拦截编排由业务侧结合用户表的最后改密时间实现）：

```java
boolean expired = passwordExpiration.isExpired(user.getPwdResetTime());   // 是否已过期
boolean warn = passwordExpiration.shouldWarn(user.getPwdResetTime());     // 是否进入到期提醒窗口
long days = passwordExpiration.remainingDays(user.getPwdResetTime());     // 距过期剩余天数
```

历史密码不重复（`historyCount`）由 starter 提供策略值，历史密码表与比对由 admin 侧实现。

**在线用户**：基于 Sa-Token 会话枚举在线登录记录，支持查询与强制下线。表与页面归 admin，starter 提供运行时 `OnlineUserService`：

```java
@Autowired
private OnlineUserService onlineUserService;

List<OnlineUser> all = onlineUserService.list();          // 全部在线（一个 token 一条）
List<OnlineUser> hit = onlineUserService.list("张三");     // 按用户名/昵称过滤
onlineUserService.kickoutByToken(token);                  // 踢某个登录设备
onlineUserService.kickoutByUserId(userId);                // 踢某用户全部设备
```

用户名/昵称/租户/客户端等展示字段来自登录时写入会话的 `LoginUser`；IP/浏览器/操作系统/登录时间为可选，登录成功时用 `OnlineUserHelper.record(ip, browser, os)` 记录即可在列表展示：

```java
LoginHelper.login(userId, clientReq);
UserContext.setLoginUser(loginUser);
OnlineUserHelper.record(ip, browser, os);   // 可选：记录终端信息供在线列表展示
```

## 微服务身份头模式（identity）

微服务架构下服务间不各自校验 token，由**网关统一校验并签发可信身份头**，下游服务从身份头构建当前用户：

- `IdentityHeaders`：身份头常量（`X-User-Id`/`X-User-Name`/`X-Tenant-Id`/`X-Dept-Id`/`X-Roles`），网关签发与下游读取共用。
- `IdentityHeaderFilter`：Servlet 服务自动装配，解析身份头构建 `LoginUser` 写入 `IdentityContext`，请求结束清理。开关 `ypbin.security.identity.enabled`（默认开）。
- `IdentityContext`：当前用户上下文（ThreadLocal），提供 `getUserId()`/`getUsername()`/`getTenantId()`/`isLogin()`（均返回 `Optional`）。

```yaml
ypbin:
  security:
    identity:
      enabled: true            # 是否装配身份头过滤器（默认开）
```

```java
// 微服务下游读取当前用户（身份头模式）
Long userId = IdentityContext.getUserId().orElse(null);
```

> 与单体 `UserContext`（sa-token 会话）职责对等但实现无关：微服务版依赖网关签发的可信头，不依赖 sa-token 会话。单体应用继续用 `UserContext`，微服务应用用 `IdentityContext`。

## 平台访问控制（platform）

`@PlatformAccess` 标注平台级接口（仅平台用户可访问，租户用户禁止）：

- 切面从 `IdentityContext` 取当前用户，经 `PlatformUserChecker` SPI 判定是否平台用户；非平台用户抛 403。
- `PlatformUserChecker` 默认放行（不假设业务），业务方实现并注册为 Bean 即启用严格校验。

```yaml
ypbin:
  security:
    platform:
      enabled: true            # 是否装配平台访问切面（默认开）
```

```java
// 业务方实现平台用户判定（admin 示例：查 sys_user.user_type = PLATFORM）
@Service
public class SysPermissionServiceImpl implements PlatformUserChecker {
    @Override
    public boolean isPlatformUser(Long userId) {
        // 查询用户类型，返回是否为平台用户
        return ...;
    }
}

// 标注平台级接口
@RestController
@RequestMapping("/system/menu")
@PlatformAccess
public class SysMenuController { ... }
```
