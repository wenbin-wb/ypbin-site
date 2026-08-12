<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useData } from 'vitepress'
import VpnSearchButton from './VpnSearchButton.vue'

const { isDark } = useData()
const open = ref(false)

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
      <a class="home-nav__brand" href="/" aria-label="ypbin 首页">
        <img :src="isDark ? '/brand/logo-horizontal-dark.svg' : '/brand/logo-horizontal-light.svg'" width="112" height="30" alt="ypbin" />
      </a>
      <button class="home-nav__toggle" type="button" :aria-expanded="open" aria-controls="home-menu" @click="open = !open"><span>导航</span><i aria-hidden="true" /></button>
      <nav id="home-menu" :class="{ 'is-open': open }" aria-label="主导航">
        <a href="/products/starter">产品</a><a href="/architecture">架构</a><a href="/guide/starter/">文档</a><a href="/releases">发布</a>
        <VpnSearchButton />
        <button type="button" class="home-nav__theme" :aria-label="isDark ? '切换到浅色' : '切换到深色'" :title="isDark ? '切换到浅色' : '切换到深色'" @click="toggleDark">
          <svg v-if="isDark" class="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>
          <svg v-else class="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
        </button>
        <a class="home-nav__github" href="https://github.com/wenbin-wb" target="_blank" rel="noreferrer">GitHub</a>
      </nav>
    </div>
  </header>
</template>
