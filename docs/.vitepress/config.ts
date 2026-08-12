import { defineConfig } from 'vitepress'

const siteUrl = 'https://ypbin.cn'
const description = 'ypbin 将可复用的系统级基础能力沉到业务之下，从 Spring Boot starter 到管理服务与 Vue 3 管理前端。'

export default defineConfig({
  lang: 'zh-CN',
  title: 'ypbin',
  description,
  cleanUrls: true,
  ignoreDeadLinks: [/^http:\/\/localhost(?::\d+)?(?:\/|$)/],
  lastUpdated: true,
  sitemap: { hostname: siteUrl },
  head: [
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    ['link', { rel: 'icon', href: '/brand/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'theme-color', content: '#080B10' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'ypbin' }],
    ['meta', { property: 'og:title', content: 'ypbin — 把系统级基建，沉到业务之下' }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:url', content: siteUrl }],
    ['meta', { property: 'og:image', content: `${siteUrl}/brand/og-cover.svg` }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }]
  ],
  transformHead({ pageData }) {
    const path = pageData.relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
    const canonical = `${siteUrl}/${path}`.replace(/\/$/, path ? '' : '/')
    return [['link', { rel: 'canonical', href: canonical }]]
  },
  themeConfig: {
    logo: { light: '/brand/logo-mark.svg', dark: '/brand/logo-mark.svg', alt: 'ypbin' },
    siteTitle: 'ypbin',
    nav: [
      { text: '产品', items: [{ text: 'starter', link: '/products/starter' }, { text: 'admin', link: '/products/admin' }, { text: 'admin-ui', link: '/products/admin-ui' }] },
      { text: '架构', link: '/architecture' },
      { text: '文档', link: '/guide/starter/' },
      { text: '发布', link: '/releases' }
    ],
    sidebar: {
      '/guide/': [
        { text: '快速开始', items: [{ text: 'starter', link: '/guide/starter/' }, { text: 'admin', link: '/guide/admin/' }, { text: 'admin-ui', link: '/guide/admin-ui/' }] },
        {
          text: 'Starter 模块文档',
          collapsed: true,
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
              { text: 'job 定时任务', link: '/guide/starter/modules/job' },
              { text: 'social 第三方登录', link: '/guide/starter/modules/social' }
            ] },
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
        { text: '专题教程', items: [{ text: 'Starter 核心机制', link: '/guide/starter/concepts' }, { text: 'Admin 架构与集成', link: '/guide/admin/architecture' }, { text: 'Admin 接口契约', link: '/guide/admin/api' }, { text: 'Admin 部署检查', link: '/guide/admin/deployment' }, { text: '商业授权教程', link: '/guide/admin/license' }, { text: 'Admin UI 页面开发', link: '/guide/admin-ui/development' }] },
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
    darkModeSwitchLabel: '外观'
  }
})
