<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useData, useRoute } from 'vitepress'
import VpnSearchButton from './VpnSearchButton.vue'

const { isDark } = useData()
const route = useRoute()
const open = ref(false)

/** 是否位于英文站（/en/** 前缀） */
const isEn = computed(() => route.path.startsWith('/en'))

/** 导航项（中英文各自文案与链接；en 页对应当前已有的英文页面） */
const navItems = computed(() =>
  isEn.value
    ? [
        { text: 'Products', href: '/en/products/' },
        { text: 'Architecture', href: '/en/architecture' },
        { text: 'Docs', href: '/en/guide' },
        { text: 'Releases', href: '/en/releases' },
      ]
    : [
        { text: '产品', href: '/products/starter' },
        { text: '架构', href: '/architecture' },
        { text: '文档', href: '/guide/starter/' },
        { text: '发布', href: '/releases' },
      ],
)

/** 语言切换目标：英文页回中文对应页（en 无对应深页则回中文首页）；中文页切英文对应页或英文首页 */
const langHref = computed(() => {
  const p = route.path
  if (isEn.value) {
    const zhPath = p.replace(/^\/en(?=\/|$)/, '')
    const hasZh = ['/products/', '/architecture', '/security', '/releases', '/faq', '/guide'].some(
      (prefix) => zhPath === prefix.replace(/\/$/, '') || zhPath.startsWith(prefix),
    )
    return hasZh && zhPath ? zhPath : '/'
  }
  const hasEn = ['/products/', '/architecture', '/security', '/releases', '/faq', '/guide'].some(
    (prefix) => p === prefix.replace(/\/$/, '') || p.startsWith(prefix),
  )
  return hasEn ? `/en${p === '/' ? '' : p}` : '/en/'
})

function closeOnEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') open.value = false
}

function toggleDark() {
  isDark.value = !isDark.value
}

onMounted(() => window.addEventListener('keydown', closeOnEscape))
onUnmounted(() => window.removeEventListener('keydown', closeOnEscape))
</script>

<template>
  <header class="home-nav">
    <div class="home-nav__inner">
      <a class="home-nav__brand" :href="isEn ? '/en/' : '/'" :aria-label="isEn ? 'ypbin home' : 'ypbin 首页'">
        <img :src="isDark ? '/brand/logo-horizontal-dark.svg' : '/brand/logo-horizontal-light.svg'" width="112" height="30" alt="ypbin" />
      </a>
      <button class="home-nav__toggle" type="button" :aria-expanded="open" aria-controls="home-menu" @click="open = !open"><span>{{ isEn ? 'Menu' : '导航' }}</span><i aria-hidden="true" /></button>
      <nav id="home-menu" :class="{ 'is-open': open }" :aria-label="isEn ? 'Primary' : '主导航'">
        <a v-for="item in navItems" :key="item.href" :href="item.href">{{ item.text }}</a>
        <VpnSearchButton />
        <a class="home-nav__lang" :href="langHref" :title="isEn ? '切换到简体中文' : 'Switch to English'">{{ isEn ? '中文' : 'EN' }}</a>
        <button type="button" class="home-nav__theme" :aria-label="isDark ? (isEn ? 'Switch to light' : '切换到浅色') : isEn ? 'Switch to dark' : '切换到深色'" :title="isDark ? (isEn ? 'Switch to light' : '切换到浅色') : isEn ? 'Switch to dark' : '切换到深色'" @click="toggleDark">
          <svg v-if="isDark" class="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>
          <svg v-else class="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
        </button>
        <a class="home-nav__github" href="https://github.com/wenbin-wb" target="_blank" rel="noreferrer">GitHub</a>
      </nav>
    </div>
  </header>
</template>
