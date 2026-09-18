import { defineConfig } from 'vitepress'

const siteUrl = 'https://ypbin.cn'
const descriptionZh = 'ypbin 将可复用的系统级基础能力沉到业务之下，从 Spring Boot starter 到管理服务与 Vue 3 管理前端。'
const descriptionEn =
  'ypbin puts reusable, system-level capabilities beneath your business logic — from a Spring Boot starter to the admin backend and a Vue 3 admin frontend.'
const githubUrl = 'https://github.com/wenbin-wb'

export default defineConfig({
  lang: 'zh-CN',
  title: 'ypbin',
  description: descriptionZh,
  // 默认浅色为主(不随系统),右上角可手动切换深色;切换偏好持久化到 localStorage
  // 注:VitePress 1.6.x 的 appearance 仅支持 initialValue:'dark',浅色起始为默认行为,
  // 配合下方 localStorage 脚本把历史 auto 偏好强制为 light,实现"默认浅色、不随系统"
  appearance: true,
  cleanUrls: true,
  ignoreDeadLinks: [/^http:\/\/localhost(?::\d+)?(?:\/|$)/],
  lastUpdated: true,
  sitemap: { hostname: siteUrl },
  head: [
    // 官网默认深色为主:无偏好/auto(跟随系统)记录统一初始为 dark;用户手动选择的 light/dark 不受影响
    ['script', {}, `try{const m=localStorage.getItem('vitepress-theme-appearance');if(!m||m==='auto')localStorage.setItem('vitepress-theme-appearance','dark')}catch(e){}`],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    ['link', { rel: 'icon', href: '/brand/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'theme-color', content: '#080B10' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'ypbin' }],
    ['meta', { property: 'og:image', content: `${siteUrl}/brand/og-cover.svg` }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }]
  ],
  locales: {
    // 中文默认语言:顶层 lang/description/head/themeConfig 即 root locale 的配置
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/',
      title: 'ypbin',
      description: descriptionZh,
      head: [
        ['meta', { property: 'og:title', content: 'ypbin — 把系统级基建，沉到业务之下' }],
        ['meta', { property: 'og:description', content: descriptionZh }],
        ['meta', { property: 'og:url', content: siteUrl }]
      ]
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      title: 'ypbin',
      description: descriptionEn,
      head: [
        ['meta', { property: 'og:title', content: 'ypbin — system-level infrastructure, beneath your business logic' }],
        ['meta', { property: 'og:description', content: descriptionEn }],
        ['meta', { property: 'og:url', content: `${siteUrl}/en/` }]
      ],
      themeConfig: {
        // 英文门面导航:顶层页面见 docs/en/**,与中文导航同构
        nav: [
          {
            text: 'Products',
            items: [
              { text: 'starter', link: '/en/products/starter' },
              { text: 'admin', link: '/en/products/admin' },
              { text: 'admin-ui', link: '/en/products/admin-ui' }
            ]
          },
          { text: 'Architecture', link: '/en/architecture' },
          { text: 'Docs', link: '/en/guide' },
          { text: 'Releases', link: '/en/releases' },
          { text: 'Security', link: '/en/security' }
        ],
        sidebar: {
          // 产品页沿用"仅产品组"侧栏,与中文版 /products/ 对齐
          '/en/products/': [
            { text: 'Products', items: [{ text: 'ypbin-starter', link: '/en/products/starter' }, { text: 'ypbin-admin', link: '/en/products/admin' }, { text: 'ypbin-admin-ui', link: '/en/products/admin-ui' }] }
          ],
          // 其余英文页(文档中心 /en/guide 等)共享全站目录;营销型顶层页通过 frontmatter sidebar:false 不显示
          '/en/': [
            { text: 'Explore', items: [{ text: 'Home', link: '/en/' }, { text: 'Architecture', link: '/en/architecture' }, { text: 'Security', link: '/en/security' }, { text: 'Releases', link: '/en/releases' }, { text: 'FAQ', link: '/en/faq' }] },
            { text: 'Products', items: [{ text: 'ypbin-starter', link: '/en/products/starter' }, { text: 'ypbin-admin', link: '/en/products/admin' }, { text: 'ypbin-admin-ui', link: '/en/products/admin-ui' }] },
            { text: 'Docs center', items: [{ text: 'Guides overview', link: '/en/guide' }] }
          ]
        },
        socialLinks: [{ icon: 'github', link: githubUrl, ariaLabel: 'View ypbin on GitHub' }],
        footer: {
          message: `<a href="/">简体中文</a> · English`,
          copyright: '© 2026 ypbin · Documentation reflects the corresponding release sources.'
        },
        lastUpdated: { text: 'Last updated' },
        docFooter: { prev: 'Previous', next: 'Next' },
        outline: { level: [2, 3], label: 'On this page' },
        returnToTopLabel: 'Back to top',
        sidebarMenuLabel: 'Menu',
        darkModeSwitchLabel: 'Appearance',
        langMenuLabel: 'Language'
      }
    }
  },
  transformHead({ pageData }) {
    const path = pageData.relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
    const canonical = `${siteUrl}/${path}`.replace(/\/$/, path ? '' : '/')
    return [['link', { rel: 'canonical', href: canonical }]]
  },
  themeConfig: {
    logo: { light: '/brand/logo-mark.svg', dark: '/brand/logo-mark.svg', alt: 'ypbin' },
    siteTitle: 'ypbin',
    // 语言切换总是回到对方语言首页;页面级对应关系由 docs/en/** 内容内的链接提供
    // (深文档仅中文,路径换前缀会 404,故不用 VitePress 默认的对应路径跳转)
    i18nRouting: false,
    socialLinks: [{ icon: 'github', link: githubUrl, ariaLabel: '在 GitHub 上查看' }],
    footer: {
      message: `简体中文 · <a href="/en/">English</a>`,
      copyright: '© 2026 ypbin · 文档事实以对应版本源码为准。'
    },
    nav: [
      { text: '产品', items: [{ text: 'starter', link: '/products/starter' }, { text: 'admin', link: '/products/admin' }, { text: 'admin-ui', link: '/products/admin-ui' }] },
      { text: '架构', link: '/architecture' },
      { text: '文档', link: '/guide/starter/' },
      { text: '发布', link: '/releases' },
      { text: '安全', link: '/security' }
    ],
    sidebar: {
      '/guide/': [
        { text: '快速开始', items: [{ text: 'starter', link: '/guide/starter/' }, { text: 'admin', link: '/guide/admin/' }, { text: 'admin-ui', link: '/guide/admin-ui/' }] },
        {
          text: '项目脚手架',
          collapsed: false,
          items: [
            { text: '生成项目与测试基座', link: '/guide/starter/scaffold' },
            { text: '2.x → 3.x 迁移指南', link: '/guide/starter/migration-2x-to-3x' }
          ]
        },
        {
          text: 'Starter 模块文档',
          // 默认展开：与"快速开始/专题教程/配置参考"等兄弟组一致，模块手册直达无需二次展开
          collapsed: false,
          items: [
            { text: '模块总览', link: '/guide/starter/modules/' },
            { text: '聚合与版本', link: '/guide/starter/modules/aggregate' },
            { text: '基础能力', collapsed: true, items: [
              { text: 'core 核心', link: '/guide/starter/modules/core' },
              { text: 'web Web 层', link: '/guide/starter/modules/web' },
              { text: 'data 数据访问', link: '/guide/starter/modules/data' },
              { text: 'json 序列化', link: '/guide/starter/modules/json' },
              { text: 'cache 缓存', link: '/guide/starter/modules/cache' },
              { text: 'security 认证授权', link: '/guide/starter/modules/security' },
              { text: 'log 操作日志', link: '/guide/starter/modules/log' },
              { text: 'tracking 埋点', link: '/guide/starter/modules/tracking' },
              { text: 'tools 常用工具', link: '/guide/starter/modules/tools' },
              { text: 'i18n 国际化', link: '/guide/starter/modules/i18n' },
              { text: 'api-doc API 文档', link: '/guide/starter/modules/api-doc' },
              { text: 'storage 文件存储', link: '/guide/starter/modules/storage' }
            ] },
            { text: '数据与安全增强', collapsed: true, items: [
              { text: 'excel 导入导出', link: '/guide/starter/modules/excel' },
              { text: 'captcha 行为验证码', link: '/guide/starter/modules/captcha' },
              { text: 'api-crypto 接口加解密', link: '/guide/starter/modules/api-crypto' },
              { text: 'sign 接口签名', link: '/guide/starter/modules/sign' },
              { text: 'sensitive-words 敏感词', link: '/guide/starter/modules/sensitive-words' },
              { text: 'license 商业授权', link: '/guide/starter/modules/license' }
            ] },
            { text: '消息与平台', collapsed: true, items: [
              { text: 'messaging 消息推送', link: '/guide/starter/modules/messaging' },
              { text: 'async 异步', link: '/guide/starter/modules/async' },
              { text: 'job 自研轻量调度', link: '/guide/starter/modules/job' },
              { text: 'xxljob XXL-JOB 接入', link: '/guide/starter/modules/xxljob' },
              { text: 'social 第三方登录', link: '/guide/starter/modules/social' }
            ] },
            { text: '智能能力', collapsed: true, items: [{ text: 'ai AI 对话', link: '/guide/starter/modules/ai' }] },
            { text: '业务骨架', collapsed: true, items: [
              { text: 'extension-crud 通用 CRUD', link: '/guide/starter/modules/extension-crud' },
              { text: 'extension-tenant 多租户', link: '/guide/starter/modules/extension-tenant' },
              { text: 'extension-datapermission 数据权限', link: '/guide/starter/modules/extension-datapermission' }
            ] },
            { text: '微服务', collapsed: true, items: [
              { text: 'cloud-core', link: '/guide/starter/modules/cloud-core' },
              { text: 'cloud-nacos', link: '/guide/starter/modules/cloud-nacos' },
              { text: 'cloud-loadbalancer', link: '/guide/starter/modules/cloud-loadbalancer' },
              { text: 'cloud-gateway', link: '/guide/starter/modules/cloud-gateway' },
              { text: 'cloud-observability', link: '/guide/starter/modules/cloud-observability' },
              { text: 'cloud-sentinel', link: '/guide/starter/modules/cloud-sentinel' }
            ] }
          ]
        },
        { text: '专题教程', items: [{ text: 'Starter 核心机制', link: '/guide/starter/concepts' }, { text: 'Admin 架构与集成', link: '/guide/admin/architecture' }, { text: 'Admin 接口契约', link: '/guide/admin/api' }, { text: 'Admin AI 对话能力', link: '/guide/admin/ai' }, { text: 'Admin 部署检查', link: '/guide/admin/deployment' }, { text: '商业授权教程', link: '/guide/admin/license' }, { text: 'Admin UI 页面开发', link: '/guide/admin-ui/development' }] },
        { text: '配置参考', items: [{ text: 'Starter 全量配置', link: '/guide/config/starter' }, { text: 'Admin 全量配置', link: '/guide/config/admin' }, { text: 'Admin UI 全量配置', link: '/guide/config/admin-ui' }] },
        { text: '参考', items: [{ text: '兼容矩阵', link: '/guide/compatibility' }, { text: '常见问题', link: '/guide/faq' }] }
      ],
      '/products/': [{ text: '产品', items: [{ text: 'ypbin-starter', link: '/products/starter' }, { text: 'ypbin-admin', link: '/products/admin' }, { text: 'ypbin-admin-ui', link: '/products/admin-ui' }] }],
      '/contributing/': [{ text: '参与项目', items: [{ text: '贡献指南', link: '/contributing/' }] }]
    },
    lastUpdated: { text: '最后更新' },
    docFooter: { prev: '上一页', next: '下一页' },
    outline: { level: [2, 3], label: '本页目录' },
    returnToTopLabel: '返回顶部',
    sidebarMenuLabel: '目录',
    darkModeSwitchLabel: '外观',
    langMenuLabel: '切换语言'
  }
})
