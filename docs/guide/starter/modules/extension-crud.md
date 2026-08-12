---
title: ypbin-starter-extension-crud
description: 通用 CRUD 模块能力说明与配置参考。
---

# extension-crud — 通用 CRUD

基类库，消除增删改查样板。控制器拆成两层，避免一个基类同时承担「通用辅助」和「标准 CRUD 路由」导致不灵活：

- `BaseController`：轻量辅助基类，封装 `request()`、`path()`、`method()`、`header()`、`param()`、`ip()`、`file()/files()`、`isLogin()`、`userId()`、`username()`、`tenantId()`、`ok()/data()/success()/fail()/status()`，不声明任何路由。复杂业务、非标准端点直接继承它。
- `CrudController`：标准 CRUD 抽象控制器，声明 `GET /{id}`、`GET /list`、`GET /` 分页、`POST /`、`PUT /{id}`、`DELETE /{id}`。适合接口形态稳定、业务逻辑较轻的实体。

```java
// 服务层：继承 BaseServiceImpl，自动拥有 CRUD + 分页
@Service
public class ArticleService extends BaseServiceImpl<ArticleMapper, Article> { }

// 标准 CRUD 控制器：泛型 <实体, 主键, 请求, 响应, 查询>
// REQ/RESP 与实体默认 BeanUtils 同名字段转换；无业务过滤时查询泛型直接用 PageQuery
@RestController
@RequestMapping("/articles")
public class ArticleController extends CrudController<Article, Long, ArticleReq, ArticleResp, PageQuery> {
    private final ArticleService service;
    @Override protected BaseService<Article> getBaseService() { return service; }
}
```

`save/update` 收 `REQ`、查询返回 `RESP`，实体永不直接暴露。简单场景可将 REQ/RESP 直接指定为实体类型；需精细控制时覆盖 `toEntity` / `toResp`（接 MapStruct 等）。分页用 `PageQuery` / `PageResult`，请求参数为 `page/pageSize`，响应数据为 `items/total/page/pageSize/pages`。

**复杂控制器**：直接继承 `BaseController`，手写端点，保留统一响应辅助：

```java
@RestController
@RequestMapping("/articles")
public class ArticleController extends BaseController {
    @GetMapping("/{id}/publish-info")
    public R<ArticlePublishInfo> publishInfo(@PathVariable Long id) {
        return ok(articleService.getPublishInfo(id));
    }
}
```

**操作级鉴权（推荐：一次声明全端点覆盖）**：覆盖 `permissionPrefix()` 返回权限前缀，六个端点自动按 `前缀:动作` 校验，杜绝「逐个端点挂注解漏挂导致越权」：

```java
public class ArticleController extends CrudController<Article, Long, ArticleReq, ArticleResp, PageQuery> {
    @Override
    protected String permissionPrefix() {
        return "system:article";   // get/list/page→:list，save→:add，update→:edit，delete→:delete
    }
}
```

> 安全默认：`permissionPrefix()` 默认返回 `null`（不校验，仅受全局登录拦截）；受保护资源务必覆盖它。依赖 Sa-Token，未引入时自动跳过。

**精细控制**：需要某端点单独权限码/逻辑时，仍可 `@Override` 端点挂 `@SaCheckPermission` 再 `super.xxx()`，与前缀机制共存：

```java
@Override
@SaCheckPermission("system:article:publish")
public R<Void> save(@RequestBody ArticleReq req) {
    return super.save(req);
}
```

**业务过滤分页**：查询泛型 `Q` 指定为携带过滤字段的 `PageQuery` 子类，覆盖 `buildQueryWrapper`：

```java
// 查询对象继承 PageQuery，加业务过滤字段
public class ArticleQuery extends PageQuery {
    private String title;
    // getter/setter
}

// 控制器第 5 个泛型指定为 ArticleQuery，Spring 会把 ?title=x 绑定进来
public class ArticleController extends CrudController<Article, Long, ArticleReq, ArticleResp, ArticleQuery> {
    @Override
    protected Wrapper<Article> buildQueryWrapper(ArticleQuery q) {
        return Wrappers.<Article>lambdaQuery()
            .like(StringUtils.hasText(q.getTitle()), Article::getTitle, q.getTitle());
    }
}
```

**写操作扩展**：覆盖 `beforeSave/afterSave/beforeUpdate/afterUpdate/beforeDelete/afterDelete` 模板钩子插入密码加密、查重、事务内分配角色等；需事务在覆盖的端点方法上加 `@Transactional`：

```java
@Override
protected void beforeSave(UserReq req, User entity) {
    entity.setPassword(PasswordEncoderUtil.encode(req.getPassword()));  // 密码加密
    if (service.exists(Wrappers.<User>lambdaQuery().eq(User::getUsername, req.getUsername()))) {
        throw new BusinessException("用户名已存在");
    }
}
```

> 定位：标准且轻量的资源用 `CrudController`；业务规则多、端点形态特殊、鉴权编排复杂的资源继承 `BaseController` 自写。
