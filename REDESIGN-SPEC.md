# ypbin-site 2026 重构规格书（REQUIRED for all implementers）

> 目标：把 ypbin 官网+文档站升级为专业级技术门户。VitePress 1.6 + Vue3 + Pagefind，全站深色科技风为主。
> 门禁：任何改动最终须 `pnpm check`（docs:config / screenshots:validate / typecheck / check:content / build+pagefind）全绿。
> 铁律沿用 site-dev skill：文档=代码 100% 契约一致；禁品牌词（blade/continew）；无 TODO；kebab 路由；中英数字间半角空格；代码块带语言。
> 执行策略：一次成型批次实施，最后统一验收提交。

## 1. 视觉 token 基调（深色科技风，浅色次之）
- 底色：`--vp-c-bg: #0A0E15`（比现 #080B10 略升避免死黑），面板 `#111722`，描边 `rgba(148,163,184,.14)`
- 主品牌色：青蓝渐变系 `#38BDF8 → #6366F1`（primary `#4F8CFF`），强调紫 `#8B5CF6`，成功 `#34D399`，警告 `#FBBF24`，危险 `#F87171`
- 文字层级：标题 `#F8FAFC` / 正文 `#CBD5E1` / 次要 `#8CA3B8`
- 浅色模式：同色相亮化（bg `#FFFFFF`，标题 `#0F172A` 等），通过 token 覆盖
- 字体：系统栈 + 等宽 `ui-monospace`；代码区统一深色
- 动效：hover 平移/发光、Hero 背景网格+渐变光斑、模块卡片 hover 描边亮起
- 所有 CSS 收敛进 `docs/.vitepress/theme/styles/tokens.css` + `site.css`，删除旧色值散落

## 2. 双语策略（英文门面 / 中文深度）
- 范围：**首页 index、3 个产品页 products/*、架构 architecture、发布概览 releases、安全 security、FAQ、导航/页脚/搜索文案 → 完整中英双语**
- 机制：VitePress locales：`/`（zh-CN 默认）+ `/en/`；nav/sidebar 文案入 i18n 常量；页面用 frontmatter 对 + `zh/`、`en/` 子目录或「英文页提供入口 + 中文原文链接」策略（由实施者在 config 中定一种并全局一致）
- 深度文档（guide/** 40+ 页模块手册）保持中文，英文站对应模块列表指向中文原文（`docs available in Chinese` 标注 + 链接），避免 40 页全译拖垮质量
- 全站标题/description/og 双语

## 3. 信息架构（最终态）
```
/                    官网首页（深色 Hero：一句主张 + 产品三角 + 能力关键词环 + 架构图 + 快速开始 + 截图 + 为什么 + CTA）
/en/                 英文版
products/
  starter            能力图谱：L1/L2/L3/能力/聚合 分层可视化 + 快速接入 + 版本
  admin              微服务 main（主推）与单体 boot 双形态卡片 + 部署形态矩阵
  admin-ui           前端体系（vben5+antd）特性与契约
architecture.md      全栈架构叙事（统一响应/身份头/短名路由/xxl-job/license 等一张大图）
security.md          安全设计 + 安全公告时间线
releases.md          版本状态表（注入）+ 变更历史
guide/               文档中心：
  快速开始(index) → 概念(concepts) → starter 模块手册 → config 参考(自动) → admin 指南 → admin-ui → ops
guide/config/*       自动生成（docs:config）
compatibility.md / faq.md
```
- 修正：模块数文案统一为「36 个 Maven 模块（叶模块口径，另含根聚合 POM）」并清除 35/37 等与代码不符的旧表述；去掉与代码不符的旧表述（35 等）
- 新增统一「模块手册页模板」约定：每模块页结构 = 一句话定位 → 何时用/不何时用 → 依赖引入 → 配置表(自动片段) → 代码示例 → 边界/扩展点 → 关联模块；无内容的空洞章节不占位

## 4. 首页内容节奏（专业官网标准）
1. Hero：主标题 + 副标 + 双 CTA（快速开始 / 查看架构）+ 版本徽章（注入）
2. 信任行：Central / Java21 / Boot4.1 / Sa-Token / MyBatis-Plus 等
3. 产品三角：starter × admin × admin-ui（卡片、各自卖点、链接）
4. 能力全景（分层能力图谱——L1 基础/能力模块/L2 扩展/L3 微服务 能力词云/网格）
5. 架构速览（ArchitectureMap 交互图）
6. 快速开始（QuickStart 三步：引 BOM→写配置→跑起来）
7. 真实界面截图轮播（screenshots 资产）
8. 为什么选择（WhyYpbin：与自拼/参考系对比的定位陈述，无品牌词）
9. 发布动态 + 安全公告 + Footer（双版权、占位 URL 已替换）

## 5. 内容事实层必改清单（对照 2.2.2/2.2.3 与 admin 当前代码）
- releases.json：starter 2.2.3（已改）；admin 版本表按 pom revision 与状态如实；adminUi 5.7.0 private
- config 文档：重跑/补齐 audit，确保出现新键 repeatable-read.max-body-bytes、rate-limit.trust-forwarded 等；删死键表述
- security 模块页：identity 默认关闭/@PlatformAccess fail-closed（已改一处，全页核查）＋密码双维/登录回验回收/畸形头容错
- tools 模块页：@RateLimit 默认取真实 IP + trust-forwarded 说明；@Idempotent 失败即释放；AES 校验前移；签名 MD5 deprecated
- cache/web/gateway/job/license 模块页：expire 语义/413 契约化/路由保护/防双跑/Feign 默认超时/license 过期快查/SSE 元数据
- admin 架构/API/部署页：internal token 守卫 + X-Internal-Token 契约 + INTERNAL_TOKEN 部署键；Redis/Nacos 认证；identity enabled 显式开；模块数/短名路由事实
- admin-ui development.md：导出 download、权限码 status 过滤、AI regenerate 语义等契约同步
- 截图清单与 2.2.3 实际 UI 一致（screenshots validate）

## 6. 验收
- `pnpm docs:config && pnpm screenshots:validate && pnpm typecheck && pnpm check:content && pnpm build` 全绿
- 双语页面齐对；无孤立页（config nav/sidebar 全覆盖）；无品牌词/TODO；中英文空格排版规范
- 提交推送（无 Co-Authored-By）
