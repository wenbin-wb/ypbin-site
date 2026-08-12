<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import HomePage from './components/HomePage.vue'
import PagefindModal from './components/PagefindModal.vue'
import VpnSearchButton from './components/VpnSearchButton.vue'

const { frontmatter } = useData()
</script>

<template>
  <a class="skip-link" href="#main-content">跳到主要内容</a>
  <PagefindModal />
  <HomePage v-if="frontmatter.layout === 'home-custom'" />
  <DefaultTheme.Layout v-else>
    <template #nav-bar-content-after>
      <VpnSearchButton class="vp-search-btn" />
    </template>
  </DefaultTheme.Layout>
</template>
