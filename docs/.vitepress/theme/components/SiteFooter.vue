<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { useIsEn } from '../composables/useIsEn'

const { isDark } = useData()
const isEn = useIsEn()

const t = computed(() =>
  isEn.value
    ? {
        tagline: 'The boundary between system-level capabilities, backend services and the management frontend.',
        navAria: 'Footer',
        products: 'Products',
        starter: 'starter',
        starterHref: '/en/products/starter',
        admin: 'admin',
        adminHref: '/en/products/admin',
        adminUi: 'admin-ui',
        adminUiHref: '/en/products/admin-ui',
        resources: 'Resources',
        arch: 'Architecture',
        archHref: '/en/architecture',
        releases: 'Releases',
        releasesHref: '/en/releases',
        contribute: 'Contributing',
        contributeHref: '/contributing/',
        contributeTitle: 'Contribution guide (Chinese-language docs)',
        project: 'Project',
        securityContact: 'Security contact',
        securityHref: '/.well-known/security.txt',
        meta: '© 2026 ypbin · Documentation reflects the corresponding release sources.'
      }
    : {
        tagline: '系统级基础能力、后台服务与管理前端的协作边界。',
        navAria: '页脚导航',
        products: '产品',
        starter: 'starter',
        starterHref: '/products/starter',
        admin: 'admin',
        adminHref: '/products/admin',
        adminUi: 'admin-ui',
        adminUiHref: '/products/admin-ui',
        resources: '资源',
        arch: '架构',
        archHref: '/architecture',
        releases: '发布',
        releasesHref: '/releases',
        contribute: '贡献',
        contributeHref: '/contributing/',
        contributeTitle: '',
        project: '项目',
        securityContact: '安全联系',
        securityHref: '/.well-known/security.txt',
        meta: '© 2026 ypbin · 文档事实以对应版本源码为准。'
      }
)
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer__brand">
      <img :src="isDark ? '/brand/logo-horizontal-dark.svg' : '/brand/logo-horizontal-light.svg'" width="150" height="40" alt="ypbin" />
      <p>{{ t.tagline }}</p>
    </div>
    <nav :aria-label="t.navAria">
      <div><strong>{{ t.products }}</strong><a :href="t.starterHref">{{ t.starter }}</a><a :href="t.adminHref">{{ t.admin }}</a><a :href="t.adminUiHref">{{ t.adminUi }}</a></div>
      <div><strong>{{ t.resources }}</strong><a :href="t.archHref">{{ t.arch }}</a><a :href="t.releasesHref">{{ t.releases }}</a><a :href="t.contributeHref" :title="t.contributeTitle || undefined">{{ t.contribute }}</a></div>
      <div><strong>{{ t.project }}</strong><a href="https://github.com/wenbin-wb" target="_blank" rel="noreferrer">GitHub</a><a :href="t.securityHref">{{ t.securityContact }}</a></div>
    </nav>
    <p class="site-footer__meta">{{ t.meta }}</p>
  </footer>
</template>
