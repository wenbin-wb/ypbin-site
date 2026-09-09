---
title: Admin UI 配置参考
description: 环境变量、构建、请求、路由、SSE、i18n 与部署配置的逐项说明。
---

# Admin UI 配置参考

环境变量、构建、请求、路由、SSE、i18n 与部署配置。本页共 **72** 项，包含类型、默认值、必填条件、可选值、生产注意与源码来源。表格支持左右滚动。

## environment


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 | 来源 |
|---|---|---|---|---|
| `env.VITE_APP_TITLE` | `string` | Ypbin Admin | 应用标题；用于 HTML title、偏好应用名、PWA 名称和启动 loading。<br><strong>必填：all modes</strong><br>可选值：—<br><strong>注意</strong>：基础 .env 对 development、production、analyze 均生效。 | <span class="cfg-src">.env:1-2 · preferences.ts:19-23 · index.html:14-15</span> |
| `env.VITE_APP_NAMESPACE` | `string` | ypbin-webantd | 偏好、Pinia 持久化和启动主题缓存的隔离前缀。<br><strong>必填：all modes</strong><br>可选值：—<br><strong>注意</strong>：缺失时缓存键可能包含 undefined。 / 最终前缀还包含应用版本与 dev/prod。 | <span class="cfg-src">.env:4-5 · main.ts:10-20</span> |
| `env.VITE_APP_STORE_SECURE_KEY` | `string` | please-replace-me-with-your-own-key | 生产环境 SecureLS AES 持久化密钥。<br><strong>必填：production persisted stores</strong><br>可选值：—<br><strong>注意</strong>：当前为公开占位值。 / 前端密钥会进入产物，只能混淆本地缓存，不能作为秘密。 | <span class="cfg-src">.env:7-8 · setup.ts:42-65</span> |
| `env.VITE_PORT` | `number converted from string` | 5173 | Vite 开发服务器端口；项目开发值为 5666。<br><strong>必填：development server</strong><br>可选值：positive integer<br><strong>注意</strong>：0、空值或非数字会回退 5173。 | <span class="cfg-src">.env.development:1-2 · env.ts:78-89,104 · application.ts:79-82</span> |
| `env.VITE_BASE` | `string` | / | Vite base、Vue Router base 和生产外置配置脚本 publicPath。<br><strong>必填：all modes</strong><br>可选值：absolute path prefix / full URL<br><strong>注意</strong>：三个模式当前均为 /。 / 部署到 /admin/ 等子路径时必须同步调整；项目 logo 仍使用根绝对路径。 | <span class="cfg-src">.env.development:4 · .env.production:1 · .env.analyze:1-2 · index.ts:15-20</span> |
| `env.VITE_GLOB_API_URL` | `string` | {"development":"/api","production":"http&#58;//localhost:8080/api","analyze":"/api"} | 主请求客户端和业务 EventSource 的 API 基地址；生产由外置运行时配置读取。<br><strong>必填：HTTP or SSE is used</strong><br>可选值：relative URL / absolute HTTP(S) URL<br><strong>注意</strong>：生产 localhost 指访问者本机。 / HTTPS 页面请求 HTTP 会触发 mixed-content。 / 没有尾斜杠规范化。 | <span class="cfg-src">.env.development:6-7 · .env.production:3-4 · .env.analyze:4-5 · request.ts:22-28 · message.ts:22,143-145</span> |
| `env.VITE_NITRO_MOCK` | `boolean converted from string` | false | 控制 Nitro mock 插件。<br><strong>必填：development mock server is desired</strong><br>可选值：true / false<br><strong>注意</strong>：只有小写字符串 true 被解析为真。 / 项目 development 明确关闭。 | <span class="cfg-src">.env.development:9-10 · env.ts:85,103 · index.ts:158-163</span> |
| `env.VITE_DEVTOOLS` | `boolean converted from string` | false | 控制非构建模式的 Vue DevTools 插件。<br><strong>必填：Vue DevTools integration is desired</strong><br>可选值：true / false<br><strong>注意</strong>：项目 development 明确关闭。 | <span class="cfg-src">.env.development:12-13 · index.ts:72-75</span> |
| `env.VITE_INJECT_APP_LOADING` | `boolean converted from string` | false | 控制 HTML 中启动 loading 的脚本、样式和 DOM 注入。<br><strong>必填：startup loading shell is desired</strong><br>可选值：true / false<br><strong>注意</strong>：development/production 为 true，analyze 缺省为 false。 | <span class="cfg-src">.env.development:15-16 · .env.production:15-16 · index.ts:165-168</span> |
| `env.VITE_COMPRESS` | `string enum or comma list` | none | 控制构建生成 gzip、brotli 或两种预压缩资源。<br><strong>必填：precompressed assets are required</strong><br>可选值：none / gzip / brotli / gzip,brotli<br><strong>注意</strong>：当前 production 为 none。 / Nginx gzip/gzip&#95;static 配置被注释。 | <span class="cfg-src">.env.production:6-7 · env.ts:91-100 · index.ts:190-205</span> |
| `env.VITE_PWA` | `boolean converted from string` | false | 控制 PWA 插件与 manifest 生成。<br><strong>必填：installable PWA is required</strong><br>可选值：true / false<br><strong>注意</strong>：当前关闭；启用后 start&#95;url 固定为 /，不会跟随子路径 base。 | <span class="cfg-src">.env.production:9-10 · index.ts:174-189</span> |
| `env.VITE_ROUTER_HISTORY` | `string enum` | history | 等于 hash 时使用 Hash history，其他值和缺省使用 HTML5 history。<br><strong>必填：router is initialized</strong><br>可选值：hash / history<br><strong>注意</strong>：production 为 hash；development/analyze 为 history。 / 非法值会静默落到 history。 | <span class="cfg-src">.env.production:12-13 · index.ts:15-20</span> |
| `env.VITE_ARCHIVER` | `boolean converted from string` | false | 构建结束后将 dist 压缩为 dist.zip。<br><strong>必填：build archive is required</strong><br>可选值：true / false<br><strong>注意</strong>：仅 production 明确为 true。 | <span class="cfg-src">.env.production:18-19 · archiver.ts:11-37,46-75</span> |
| `env.VITE_VISUALIZER` | `boolean converted from string` | false | 生成 bundle visualizer 报告并尝试打开。<br><strong>必填：bundle analysis is required</strong><br>可选值：true / false<br><strong>注意</strong>：仅 analyze 为 true；报告位于 node&#95;modules/.cache，不在 Turbo outputs。 | <span class="cfg-src">.env.analyze:7 · index.ts:81-88</span> |
| `env.VITE_APP_VERSION` | `string generated from package version` | 5.7.0 | 由应用 package version 注入，参与缓存 namespace 和外置配置文件名。<br><strong>必填：application build</strong><br>可选值：semantic version string<br><strong>注意</strong>：版本变化切换完整缓存 namespace，不迁移旧缓存。 | <span class="cfg-src">package.json:2-3 · inject-metadata.ts:70-104 · main.ts:12-15</span> |
| `env.loadingOrder` | `ordered string[]` | .env / .env.local / .env.&lt;mode&gt; / .env.&lt;mode&gt;.local | 环境文件加载和后者覆盖前者的顺序。<br><strong>必填：any Vite command</strong><br>可选值：—<br><strong>注意</strong>：当前只存在 .env、development、production、analyze 四个文件。 / mode 从 npm&#95;lifecycle&#95;script 正则提取，带连字符 mode 不匹配。 | <span class="cfg-src">env.ts:21-30,37-64</span> |
| `env.runtimeExternalConfig` | `frozen window object` | window.&#95;VBEN&#95;ADMIN&#95;PRO&#95;APP&#95;CONF | 生产只将 VITE&#95;GLOB&#95; 前缀变量外置到独立脚本；开发直接读取 import.meta.env。<br><strong>必填：production build uses VITE&#95;GLOB&#95;&#42;</strong><br>可选值：VITE&#95;GLOB&#95;&#42; keys<br><strong>注意</strong>：可替换外置文件切换 API，但不能改变 base、router history、title 或 namespace。 | <span class="cfg-src">extra-app-config.ts:16-17,36-48,62-90 · use-app-config.ts:9-35</span> |
| `env.ImportMetaEnvTyping` | `TypeScript interface` | {"VITE&#95;GLOB&#95;API&#95;URL":"string","VITE&#95;GLOB&#95;AUTH&#95;DINGDING&#95;CLIENT&#95;ID":"string","VITE&#95;GLOB&#95;AUTH&#95;DINGDING&#95;CORP&#95;ID":"string"} | 当前显式声明的运行时环境字段。<br><strong>必填：compile-time env access</strong><br>可选值：—<br><strong>注意</strong>：多数项目变量缺乏逐键类型、枚举和必填校验。 / 两个钉钉字段被声明必填但当前环境未定义。 | <span class="cfg-src">global.d.ts:10-14,28-31</span> |

</div>


## build


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 | 来源 |
|---|---|---|---|---|
| `build.appScripts` | `command map` | {"dev":"pnpm vite --mode development","build":"pnpm vite build --mode production","build:analyze":"pnpm vite build --mode analyze","preview":"vite preview","typecheck":"vue-tsc --noEmit --skipLibCheck"} | web-antd 包级构建与校验命令。<br><strong>必填：development, build, preview or type checking</strong><br>可选值：—<br><strong>注意</strong>：preview 只服务已有 dist，不重建。 | <span class="cfg-src">package.json:18-23</span> |
| `build.rootScripts` | `command map` | {"build":"turbo build","build:analyze":"turbo build:analyze","build:antd":"filter @vben/web-antd","dev:antd":"filter @vben/web-antd dev","build:docker":"scripts/deploy/build-local-docker-image.sh"} | 根级 Turbo 构建和应用快捷命令。<br><strong>必填：root workspace commands are used</strong><br>可选值：—<br><strong>注意</strong>：根 build 使用 8192MB Node heap。 | <span class="cfg-src">package.json:23-63</span> |
| `vite.build.output` | `Vite/Rollup build options` | {"outDir":"dist","target":"es2015","sourcemap":false,"reportCompressedSize":false,"chunkSizeWarningLimit":200,"assetFileNames":"[ext]/[name]-[hash].[ext]","chunkFileNames":"js/[name]-[hash].js","entryFileNames":"jse/index-[name]-[hash].js","dropDebugger":true} | 项目未覆盖的上游构建输出与文件命名。<br><strong>必填：build</strong><br>可选值：—<br><strong>注意</strong>：jse 是显式入口目录名。 / 当前磁盘 dist 可能不是当前源码最新构建。 | <span class="cfg-src">application.ts:58-76 · common.ts:3-10</span> |
| `build.turboOutputs` | `string[]` | dist/&#42;&#42; / dist.zip | Turbo 声明的应用构建输出。<br><strong>必填：Turbo build cache</strong><br>可选值：—<br><strong>注意</strong>：visualizer 的 node&#95;modules/.cache 报告不在 outputs 内。 | <span class="cfg-src">turbo.json:14-31</span> |

</div>


## vite


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 | 来源 |
|---|---|---|---|---|
| `vite.projectOverride.server.proxy./api` | `Vite proxy configuration` | {"target":"http&#58;//localhost:8080","changeOrigin":true,"rewrite":"remove ^/api","ws":true} | 开发 API 代理并去掉 /api 前缀。<br><strong>必填：development API access</strong><br>可选值：—<br><strong>注意</strong>：只在 Vite dev server 生效，生产静态部署不继承。 | <span class="cfg-src">vite.config.ts:7-15</span> |
| `vite.projectOverride.server.proxy.docs` | `Vite proxy configuration` | {"target":"http&#58;//localhost:8080","paths":["/doc.html","/webjars","/v3/api-docs","/swagger-ui","/swagger-resources"]} | 开发环境原样代理 Knife4j/Swagger 资源。<br><strong>必填：development API documentation access</strong><br>可选值：—<br><strong>注意</strong>：生产部署不继承。 | <span class="cfg-src">vite.config.ts:16-29</span> |
| `vite.server` | `Vite server options` | {"host":true,"port":5173,"warmup":["index.html","src/bootstrap.ts","views/layouts/router/store/api/adapter"]} | 上游开发服务器和预热默认。<br><strong>必填：development server</strong><br>可选值：—<br><strong>注意</strong>：项目通过 VITE&#95;PORT 将开发端口覆盖为 5666。 | <span class="cfg-src">application.ts:79-90</span> |
| `vite.plugins` | `plugin configuration` | <code class="cfg-value">Vue / Vue JSX / Tailwind / metadata / i18n / VXE lazy import / HTML processing / license / production extra app config</code> | 固定或默认启用的上游插件能力。<br><strong>必填：Vite starts</strong><br>可选值：—<br><strong>注意</strong>：项目 Vite 配置没有覆盖这些插件。 | <span class="cfg-src">index.ts:57-69,77-79,130-156,169-172,207-221</span> |

</div>


## preferences


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 | 来源 |
|---|---|---|---|---|
| `preferences.projectOverrides` | `deepPartial<Preferences>` | {"app":{"name":"VITE&#95;APP&#95;TITLE","accessMode":"backend","locale":"zh-CN","enableRefreshToken":false},"copyright":{"icp":"闽ICP备19024351号","icpLink":"https&#58;//beian.miit.gov.cn/"},"logo":{"source":"/ypbin-logo.svg","sourceDark":"/ypbin-logo.svg"}} | 项目真正覆盖的 8 个标准偏好叶子键。<br><strong>必填：preferences initialization</strong><br>可选值：—<br><strong>注意</strong>：只有 accessMode 会压过历史缓存；其他覆盖可被旧缓存覆盖。 / 根绝对 logo 路径不天然支持子路径部署。 | <span class="cfg-src">preferences.ts:19-34 · index.ts:25-29</span> |
| `preferences.custom` | `custom preference schema` | {"enableFormFullscreen":true,"tenantMode":"single","defaultTableSize":20,"reportTitle":""} | 项目注册的表单全屏、租户模式、默认表格条数和报表标题偏好。<br><strong>必填：custom preferences panel is enabled</strong><br>可选值：{"enableFormFullscreen":[true,false],"tenantMode":["single","multi"],"defaultTableSize":"10..200 step 10","reportTitle":"string"}<br><strong>注意</strong>：全仓未发现业务消费端；当前只可编辑和持久化，不改变实际行为。 | <span class="cfg-src">preferences.ts:7-12,36-83</span> |
| `preferences.mergePriority` | `ordered precedence` | {"normal":"cached &gt; project &gt; upstream","app.accessMode":"project &gt; cached &gt; upstream"} | 偏好默认、项目覆盖与历史缓存的最终合并优先级。<br><strong>必填：preferences initialization</strong><br>可选值：—<br><strong>注意</strong>：源码调整 locale、refresh、主题等可能被旧缓存压过。 | <span class="cfg-src">preferences.ts:128-171 · merge.ts:1-10</span> |
| `preferences.persistence` | `localStorage persistence configuration` | {"keys":["preferences","preferences-custom","preferences-locale","preferences-theme"],"debounceMs":150,"namespace":"${VITE&#95;APP&#95;NAMESPACE}-${VITE&#95;APP&#95;VERSION}-${dev\|prod}"} | 偏好持久化键、延迟和命名空间。<br><strong>必填：preferences are changed</strong><br>可选值：—<br><strong>注意</strong>：150ms 内关闭页面可能丢最后更新。 / 版本升级无迁移并保留旧 key。 / analyze 与 production 共用 prod namespace。 | <span class="cfg-src">main.ts:10-20 · preferences.ts:29-61,214-240,437-453</span> |
| `preferences.appDefaults` | `appPreferences` | {"authPageLayout":"panel-right","checkUpdatesInterval":1,"colorGrayMode":false,"colorWeakMode":false,"compact":false,"contentCompact":"wide","contentCompactWidth":120,"contentPadding":0,"contentPaddingBottom":0,"contentPaddingLeft":0,"contentPaddingRight":0,"contentPaddingTop":0,"defaultHomePath":"/dashboard","dynamicTitle":true,"enableCheckUpdates":true,"enableCopyPreferences":true,"enablePreferences":true,"enableRefreshToken":false,"enableStickyPreferencesNavigationBar":true,"isMobile":false,"layout":"sidebar-nav","locale":"zh-CN","loginExpiredMode":"page","preferencesButtonPosition":"auto","timezone":"Asia/Shanghai","watermark":false,"watermarkContent":"","zIndex":200} | 项目未覆盖时继承的上游 app 默认偏好。<br><strong>必填：app preferences are not overridden or cached</strong><br>可选值：—<br><strong>注意</strong>：defaultAvatar 还继承上游 unpkg 远程地址，离线环境存在依赖。 | <span class="cfg-src">config.ts:4-37 · types.ts:99-172</span> |
| `preferences.layoutDefaults` | `grouped Preferences` | {"breadcrumb":{"enable":true,"hideOnlyOne":false,"showHome":false,"showIcon":true,"styleType":"normal"},"footer":{"enable":false,"fixed":false,"height":32},"header":{"enable":true,"height":50,"hidden":false,"menuAlign":"start","mode":"fixed"},"logo":{"enable":true,"fit":"contain","logoMode":"icon","showText":true},"navigation":{"acordion":true,"split":true,"styleType":"rounded"},"sidebar":{"autoActivateChild":false,"collapsed":false,"collapsedButton":true,"collapsedShowTitle":false,"collapseWidth":60,"draggable":true,"enable":true,"expandOnHover":true,"extraCollapse":false,"extraCollapsedWidth":60,"fixedButton":true,"hidden":false,"mixedWidth":80,"width":224}} | 项目未覆盖的上游布局偏好默认。<br><strong>必填：layout preferences are not overridden or cached</strong><br>可选值：—<br><strong>注意</strong>：— | <span class="cfg-src">config.ts:38-102</span> |
| `preferences.navigationDefaults` | `grouped Preferences` | {"shortcutKeys":{"enable":true,"globalEscape":false,"globalLockScreen":true,"globalLogout":true,"globalPreferences":true,"globalSearch":true},"tabar":{"draggable":true,"enable":true,"height":38,"keepAlive":true,"maxCount":0,"middleClickToClose":false,"persist":true,"showIcon":true,"showMaximize":true,"showMore":true,"showRefresh":true,"styleType":"chrome","visitHistory":true,"wheelable":true},"transition":{"enable":true,"loading":true,"name":"fade-slide","progress":true}} | 快捷键、标签页和页面过渡的上游默认。<br><strong>必填：navigation preferences are not overridden or cached</strong><br>可选值：—<br><strong>注意</strong>：tabar.maxCount=0 表示不限制。 | <span class="cfg-src">config.ts:79-118,132-137</span> |
| `preferences.themeDefaults` | `themePreferences` | {"builtinType":"default","colorDestructive":"hsl(348 100% 61%)","colorPrimary":"hsl(212 100% 45%)","colorSuccess":"hsl(144 57% 58%)","colorWarning":"hsl(42 84% 61%)","fontSize":16,"mode":"dark","radius":"0.5","semiDarkHeader":false,"semiDarkSidebar":false,"semiDarkSidebarSub":false} | 项目未覆盖的上游主题默认；首次访问默认暗色。<br><strong>必填：theme is not overridden or cached</strong><br>可选值：{"mode":["auto","dark","light"]}<br><strong>注意</strong>：项目不是默认跟随系统。 | <span class="cfg-src">config.ts:119-131</span> |
| `preferences.widgetDefaults` | `widgetPreferences` | {"enabled":["fullscreen","globalSearch","languageToggle","lockScreen","notification","refresh","sidebarToggle","themeToggle","timezone"],"position":"header","order":["globalSearch","preferences","themeToggle","languageToggle","timezone","fullscreen","refresh","notification","lockScreenBtn","logoutBtn"]} | 上游控件开关、位置与顺序默认。<br><strong>必填：header widgets are rendered</strong><br>可选值：—<br><strong>注意</strong>：历史 widget.order 仅去重，不校验失效项或补新版项。 | <span class="cfg-src">config.ts:138-169 · preferences.ts:389-409</span> |

</div>


## request


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 | 来源 |
|---|---|---|---|---|
| `request.clients` | `RequestClient instances` | {"requestClient":{"responseReturn":"data"},"baseRequestClient":{"responseReturn":"raw"},"timeoutMs":10000,"contentType":"application/json;charset=utf-8"} | 主业务客户端与 refresh/logout 裸客户端。<br><strong>必填：API request is made</strong><br>可选值：{"responseReturn":["raw","body","data"]}<br><strong>注意</strong>：baseRequestClient 不安装项目 token、语言、业务解包和错误提示拦截器。 | <span class="cfg-src">request.ts:22-28,123-127 · request-client.ts:58-73</span> |
| `request.headers` | `request interceptor` | {"Authorization":"Bearer &lt;accessToken&gt; or null","Accept-Language":"preferences.app.locale"} | 主客户端统一注入认证和语言请求头。<br><strong>必填：requestClient sends a request</strong><br>可选值：—<br><strong>注意</strong>：登录等公开接口若残留旧 token 也会携带。 / 裸客户端不携带这些头。 | <span class="cfg-src">request.ts:59-72</span> |
| `request.responseContract` | `response interceptor configuration` | {"codeField":"code","dataField":"data","successCode":200,"responseReturn":"data"} | 后端统一响应校验并自动返回业务 data。<br><strong>必填：requestClient receives a response</strong><br>可选值：—<br><strong>注意</strong>：业务页面无需再取 .data。 / 非成功 code 会抛异常。 | <span class="cfg-src">request.ts:87-95 · preset-interceptors.ts:9-45</span> |
| `request.errorHandling` | `ordered interceptor chain` | <code class="cfg-value">project business code=401 / response unpack / HTTP 401 refresh/reauthenticate / global error message</code> | 项目请求响应和错误拦截顺序。<br><strong>必填：response is rejected or business code fails</strong><br>可选值：—<br><strong>注意</strong>：HTTP 200 + code=401 分支未 await doReAuthenticate。 / 抛出的普通 Error 无 response，后端 message 通常退化成内部错误文案。 / 最终业务层常收到 response body 而非完整 AxiosError。 | <span class="cfg-src">request.ts:74-118 · preset-interceptors.ts:112-165 · request-client.ts:145-160</span> |
| `request.refreshToken` | `boolean preference and HTTP interceptor` | false | 是否启用公共 HTTP 401 refresh token 链路；项目 Sa-Token 模式关闭。<br><strong>必填：HTTP 401 token refresh is supported</strong><br>可选值：true / false<br><strong>注意</strong>：旧偏好缓存可能把它恢复为 true。 / 拦截器创建时读取一次，运行时修改不会重建。 / 后端若统一 HTTP 200 + code=401，公共 refresh 不触发。 | <span class="cfg-src">preferences.ts:26-27 · request.ts:97-105 · preset-interceptors.ts:61-108</span> |
| `request.authApiCredentials` | `POST argument configuration` | {"refresh":"post('/auth/refresh', {withCredentials:true})","logout":"post('/auth/logout', {withCredentials:true})"} | 当前 refresh/logout 调用形式。<br><strong>必填：refresh or logout is called</strong><br>可选值：—<br><strong>注意</strong>：withCredentials 被当作请求 body，不是 Axios config；跨域 Cookie 不会按预期携带。 / logout 使用裸客户端且不携带 Bearer token。 / logout 错误被本地退出流程吞掉，服务端 token 可能未撤销。 | <span class="cfg-src">auth.ts:74-90 · auth.ts:99-117 · request-client.ts:123-129</span> |

</div>


## routing


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 | 来源 |
|---|---|---|---|---|
| `router.history` | `routerHistory` | {"development":"createWebHistory(VITE&#95;BASE)","production":"createWebHashHistory(VITE&#95;BASE)","analyze":"createWebHistory(VITE&#95;BASE)"} | 项目按 VITE&#95;ROUTER&#95;HISTORY 选择 history 实现。<br><strong>必填：router is created</strong><br>可选值：hash / history<br><strong>注意</strong>：开发和生产 URL/回调行为不同。 | <span class="cfg-src">index.ts:15-20 · .env.production:12-13</span> |
| `router.coreRoutes` | `routeRecordRaw[]` | <code class="cfg-value">/ / /profile / /auth/login / /auth/code-login / /auth/qrcode-login / /auth/forget-password / /auth/register / /auth/social-callback / /:path(.&#42;)&#42;</code> | 静态核心、认证和 fallback 路由；首页重定向到 defaultHomePath。<br><strong>必填：router initializes</strong><br>可选值：—<br><strong>注意</strong>：初始 Router 不注册 modules 中的业务路由。 | <span class="cfg-src">core.ts:12-114 · index.ts:21-30</span> |
| `router.accessMode` | `frontend \| backend \| mixed` | backend | 项目强制后端动态菜单模式。<br><strong>必填：first authenticated navigation</strong><br>可选值：frontend / backend / mixed<br><strong>注意</strong>：apps/web-antd 路由 modules 不是当前菜单权威，权威是后端 /menu/all。 | <span class="cfg-src">preferences.ts:21-27 · access.ts:17-40</span> |
| `router.backendMenu` | `dynamic route generation configuration` | {"endpoint":"GET /menu/all","pageMap":"../views/&#42;&#42;/&#42;.vue","layouts":["BasicLayout","IFrameView"],"forbidden":"403 component"} | 后端菜单映射为 Vue 路由、注册后生成菜单。<br><strong>必填：accessMode=backend</strong><br>可选值：—<br><strong>注意</strong>：component 找不到会记录错误并替换为内嵌 404，而非 fail-fast。 / route name 缺失只记录错误。 | <span class="cfg-src">menu.ts:5-10 · access.ts:17-40 · generate-routes-backend.ts:32-89</span> |
| `router.accessGuard` | `navigation guard` | {"public":"meta.ignoreAccess","unauthenticated":"redirect /auth/login with redirect query","authenticatedFirstVisit":"load user, roles, routes, menus and mark isAccessChecked","authenticatedChecked":"allow"} | 项目访问守卫的认证和首次动态路由流程。<br><strong>必填：every navigation</strong><br>可选值：—<br><strong>注意</strong>：动态菜单请求失败会使导航失败并在后续重试。 / decodeURIComponent 未保护，畸形 redirect 可能抛异常。 | <span class="cfg-src">guard.ts:47-120</span> |
| `router.resetRoutes` | `function` | defined but never called | 删除非静态命名路由的公共清理能力。<br><strong>必填：logout, account switch or permission refresh</strong><br>可选值：—<br><strong>注意</strong>：项目 logout 只重置 stores，不删除 Router 中动态路由；跨账号可能残留旧路由匹配。 / 后端仍必须独立鉴权。 | <span class="cfg-src">index.ts:32-37 · reset-routes.ts:8-31 · auth.ts:99-117</span> |

</div>


## sse


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 | 来源 |
|---|---|---|---|---|
| `sse.businessConnection` | `EventSource with one-time ticket` | {"ticketEndpoint":"POST /system/ypbin/sse/ticket","subscribeEndpoint":"GET /system/ypbin/sse/subscribe?ticket=&lt;ticket&gt;","event":"message-unread"} | 实际业务 SSE 链路：先用 Bearer 请求 ticket，再用原生 EventSource 订阅。<br><strong>必填：authenticated basic layout is mounted</strong><br>可选值：—<br><strong>注意</strong>：ticket 位于 query，需后端短 TTL、一次性、用户绑定及日志脱敏。 / 前端未使用 ticket expiresIn。 / 只监听 message-unread，不处理默认 message 事件。 | <span class="cfg-src">message.ts:56-61 · message.ts:110-169</span> |
| `sse.reconnect` | `exponential backoff` | {"formula":"min(1000 &#42; 2^retryCount, 30000)","sequenceMs":[1000,2000,4000,8000,16000,30000],"maxAttempts":"unlimited","jitter":false} | 业务 SE 自定义重连策略；error 时主动关闭浏览器 EventSource。<br><strong>必填：EventSource errors or ticket request fails</strong><br>可选值：—<br><strong>注意</strong>：无 jitter，服务恢复时可能同步重连。 / 服务端 retry 指令不主导。 / 没有最大次数。 | <span class="cfg-src">message.ts:24,110-169</span> |
| `sse.eventHandling` | `event listener behavior` | {"onOpen":"retryCount=0","onMessageUnread":"refresh latest 10 messages and unread count","payloadUsed":false,"lastEventIdUsed":false} | 每次未读事件触发两项并行 HTTP 刷新。<br><strong>必填：message-unread arrives</strong><br>可选值：—<br><strong>注意</strong>：无 debounce、请求合并、取消和响应版本保护，事件突发可产生并发刷新。 | <span class="cfg-src">message.ts:54-66,148-155</span> |
| `sse.recoveryGaps` | `capability gap list` | <code class="cfg-value">no heartbeat watchdog / no Last-Event-ID / no reconnect-success refresh / no offline/online listener / no visibilitychange listener / no missed-event cursor</code> | 当前业务 SE 不具备的断线检测和补偿能力。<br><strong>必填：reliable delivery across disconnects is required</strong><br>可选值：—<br><strong>注意</strong>：断线期间最后一次消息若重连后无新事件，未读数可能长期过期。 / 半开连接识别依赖浏览器/TCP/代理/服务端。 | <span class="cfg-src">message.ts:110-193</span> |
| `sse.lifecycle` | `layout/store lifecycle` | {"start":"basic layout mount when userId exists","stop":"layout unmount or messageStore.$reset","versionGuard":true} | 布局挂载启动、卸载和登出清理 EventSource。<br><strong>必填：user session changes</strong><br>可选值：—<br><strong>注意</strong>：close 后立即 start 可能受上一轮 seInitializing 影响而丢启动。 / loginExpiredMode=modal 时不一定卸载布局或关闭旧连接。 | <span class="cfg-src">basic.vue:49-69,115-118 · message.ts:177-193</span> |
| `sse.requestSE` | `fetch ReadableStream chunk reader` | {"methods":["requestSE","postSE"],"accept":"text/event-stream","protocolParsing":false} | 上游同名能力只回调网络 chunk，不解析标准 SSE 帧；当前业务未使用。<br><strong>必填：public streaming request helper is explicitly used</strong><br>可选值：—<br><strong>注意</strong>：不解析 event/data/id/retry/帧边界/comment。 / 无 signal 时不能主动 abort。 / 绝对 baseURL 加以 / 开头 path 可能丢 base path。 | <span class="cfg-src">se.ts:45-132 · request-client.ts:48-51,90-93</span> |

</div>


## i18n


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 | 来源 |
|---|---|---|---|---|
| `i18n.supportedLocales` | `union` | zh-CN / en-US | 项目和上游共同支持的语言集合，初始值来自恢复后的 preferences.app.locale。<br><strong>必填：i18n initializes or locale changes</strong><br>可选值：zh-CN / en-US<br><strong>注意</strong>：没有浏览器语言自动探测。 / 没有 locale 环境变量。 | <span class="cfg-src">typing.ts:1 · index.ts:93-99</span> |
| `i18n.vueI18n` | `i18nOptions` | {"legacy":false,"globalInjection":true,"locale":"","messages":{},"fallbackLocale":"not configured"} | 上游 Vue I18n 实例默认配置。<br><strong>必填：application bootstraps</strong><br>可选值：—<br><strong>注意</strong>：英文缺键不会回退中文，通常显示 key 原文。 | <span class="cfg-src">i18n.ts:16-21 · typing.ts:9-25</span> |
| `i18n.messageLoading` | `dynamic import and merge order` | {"upstreamNamespaces":["common","ui","authentication","profile","preferences"],"projectNamespaces":["demos","menu","page","system"],"priority":"project &gt; upstream"} | 先设置上游公共消息，再合并项目消息。<br><strong>必填：initial locale or switched locale is loaded</strong><br>可选值：—<br><strong>注意</strong>：公共 JSON 当前逐文件串行 await。 / 嵌套目录文件名会成为带斜杠的顶层 key。 | <span class="cfg-src">i18n.ts:23,55-90,123-138 · index.ts:22-47</span> |
| `i18n.thirdPartyLocales` | `locale adapters` | {"antDesign":"static zh&#95;CN/en&#95;US","dayjs":"dynamic zh-cn/en"} | 切换 Ant Design Vue 和 Dayjs 语言。<br><strong>必填：locale changes</strong><br>可选值：zh-CN / en-US<br><strong>注意</strong>：Dayjs 当前把动态 import 模块命名空间传给 dayjs.locale，而非 default 导出，实际可能无法正确切换。 / 未知 locale 时 Antd 保留上一次值。 | <span class="cfg-src">index.ts:16-20,53-91 · app.vue:33-39</span> |
| `i18n.missingKeys` | `known missing translation list` | <code class="cfg-value">common.action / common.add / common.success / common.confirmDelete</code> | 英文上游 common.json 缺少、但项目实际使用的 4 个键。<br><strong>必填：English locale renders callers of these keys</strong><br>可选值：—<br><strong>注意</strong>：因无 fallback，英文界面会显示 key 原文。 / production missingWarn 关闭，不输出警告。 | <span class="cfg-src">common.json:23,27-29 · common.json:1-38 · index.ts:93-99</span> |
| `i18n.missingBehavior` | `boolean environment option` | {"development":"console warning and key text","production":"key text without warning"} | 项目仅在非 PROD 环境打开 missingWarn。<br><strong>必填：translation key is absent</strong><br>可选值：—<br><strong>注意</strong>：语言偏好先更新、资源后异步加载；加载失败可能导致偏好与实际 locale 分裂。 | <span class="cfg-src">index.ts:93-99 · i18n.ts:109-138</span> |

</div>


## vben-overrides


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 | 来源 |
|---|---|---|---|---|
| `adapter.form` | `form adapter configuration` | {"modelProp":"value","checkedComponents":["Checkbox","Radio","Switch"],"uploadModelProp":"fileList","rules":["required","selectRequired"]} | 项目对 Vben Form 的 Ant Design model prop 和规则注册。<br><strong>必填：Vben schema forms are used</strong><br>可选值：—<br><strong>注意</strong>：selectRequired 只拒绝 undefined/null，会接受空字符串和空数组。 | <span class="cfg-src">form.ts:12-42</span> |
| `adapter.vxeTable` | `VXE global options` | {"align":"center","border":false,"resizable":true,"formEnabled":false,"minHeight":180,"proxyAutoLoad":true,"response":{"result":"items","total":"total","list":""},"showActiveMsg":true,"showResponseMsg":false,"round":true,"showOverflow":true,"size":"small"} | 项目表格外观和代理响应结构契约。<br><strong>必填：useVbenVxeGrid is used</strong><br>可选值：—<br><strong>注意</strong>：列表 API 默认必须返回 {items,total}。 / 初始化会删除所有名称以 Cell 开头的已注册 renderer。 | <span class="cfg-src">vxe-table.ts:23-62</span> |
| `adapter.vxeRenderers` | `renderer registry` | CellImage / CellLink / CellTag / CellSwitch | 项目注册的图片、链接、标签和开关单元格 renderer。<br><strong>必填：registered cell renderers are referenced</strong><br>可选值：—<br><strong>注意</strong>：VbenTableAction 另行自动注入权限判断和确认/取消翻译。 | <span class="cfg-src">vxe-table.ts:64-131,161-215</span> |
| `adapter.components` | `component registry replacement` | <code class="cfg-value">ApiCascader / ApiSelect / ApiTreeSelect / RichEditor / TianaiCaptcha / Upload / Ant Design form components</code> | 项目整体替换 Vben component registry，并统一 placeholder、宽度与 Select popup 行为。<br><strong>必填：Vben form component schemas render</strong><br>可选值：—<br><strong>注意</strong>：Upload adapter 未设置 action、customRequest、鉴权头、Cookie 或默认上传 API；单独声明 Upload 不会自动接项目接口。 | <span class="cfg-src">index.ts:138-170,417-763</span> |
| `bootstrap.order` | `ordered initialization steps` | <code class="cfg-value">component adapter / form adapter / create app / loading directive / i18n / Pinia / access directive / Tippy / Router / Motion / dynamic title / mount</code> | 项目启动安装顺序。<br><strong>必填：application boots</strong><br>可选值：—<br><strong>注意</strong>：Modal/Drawer 默认配置只有注释，没有实际覆盖。 | <span class="cfg-src">bootstrap.ts:19-73</span> |
| `store.persistence` | `Pinia persistence configuration` | {"development":"plain localStorage","production":"SecureLS AES plus compression","key":"${namespace}-${storeId}"} | 上游按 DEV/PROD 选择持久化实现。<br><strong>必填：persisted Pinia stores are used</strong><br>可选值：—<br><strong>注意</strong>：development token 明文。 / production 前端加密不能防 XSS，当前 key 仍是占位值。 | <span class="cfg-src">setup.ts:42-68</span> |

</div>


## deployment


<div class="table-scroll">

| 配置项 | 类型 | 默认值 | 说明 | 来源 |
|---|---|---|---|---|
| `deployment.staticPaths` | `deployment path configuration` | {"viteBase":"/","output":"apps/web-antd/dist","archive":"apps/web-antd/dist.zip","publicAssets":["/favicon.ico","/ypbin-logo.svg"],"runtimeConfig":"/&#95;app-config&lt;version&gt;-&lt;hash&gt;.js"} | 当前生产构建输出和根绝对资源路径。<br><strong>必填：static assets are deployed</strong><br>可选值：—<br><strong>注意</strong>：只适合域名根目录；子路径部署会造成资源 404。 / 现有 dist 的生成时间与当前源码是否一致未确认。 | <span class="cfg-src">.env.production:1 · preferences.ts:29-33 · application.ts:58-76</span> |
| `deployment.nginx` | `Nginx server configuration` | {"listen":8080,"root":"/usr/share/nginx/html","spaFallback":"try&#95;files $uri $uri/ /index.html","apiProxy":false,"gzip":"commented out"} | 仓库自带静态站点 Nginx 配置。<br><strong>必填：bundled Nginx deployment is used</strong><br>可选值：—<br><strong>注意</strong>：没有 /api 反向代理；生产 API 使用 /api 时需要外部网关或新增 location。 | <span class="cfg-src">nginx.conf:33-66</span> |
| `deployment.docker` | `multi-stage Dockerfile` | {"build":"pnpm run build --filter=!./docs","copyFrom":"/app/playground/dist","copyTo":"/usr/share/nginx/html","imageName":"vben-admin-local"} | 根级 Docker 构建和静态文件复制目标。<br><strong>必填：pnpm build:docker is used</strong><br>可选值：—<br><strong>注意</strong>：明确复制 playground/dist，不是 apps/web-antd/dist；当前 Docker 不发布被审计应用。 | <span class="cfg-src">Dockerfile:1-33 · build-local-docker-image.sh:3-7,25-40</span> |
| `deployment.productionApi` | `runtime endpoint` | http&#58;//localhost:8080/api | 当前生产外置配置中的 API 地址。<br><strong>必填：production HTTP and SSE requests are made</strong><br>可选值：deployment-specific HTTPS endpoint / same-origin reverse proxy path<br><strong>注意</strong>：远程浏览器会连接自身 localhost，通常不可用。 / HTTPS 站点会阻止 HTTP mixed-content。 / 项目 Nginx 没有 /api 代理。 | <span class="cfg-src">.env.production:3-4 · request.ts:22-28 · message.ts:143-145</span> |
| `deployment.pwaBaseCompatibility` | `compatibility constraint` | {"enabled":false,"startUrl":"/"} | PWA start&#95;url 与 VITE&#95;BASE 的兼容关系。<br><strong>必填：VITE&#95;PWA=true or subpath deployment</strong><br>可选值：—<br><strong>注意</strong>：启用 PWA 后 start&#95;url 固定为 /，不跟随非根 VITE&#95;BASE。 | <span class="cfg-src">index.ts:174-189</span> |
| `deployment.sseProxyRequirements` | `infrastructure requirements` | <code class="cfg-value">long read timeout / proxy buffering disabled / correct CORS or same-origin proxy / query log redaction for ticket</code> | 业务 EventSource 在真实部署中依赖但仓库 Nginx 未配置的网关能力。<br><strong>必填：production SE is enabled</strong><br>可选值：—<br><strong>注意</strong>：静态审计无法确认外部网关是否已配置。 | <span class="cfg-src">nginx.conf:49-66 · message.ts:132-169</span> |

</div>

