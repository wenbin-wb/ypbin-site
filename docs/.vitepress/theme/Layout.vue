<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import HomeNav from './components/HomeNav.vue'
import HomePage from './components/HomePage.vue'
import PagefindModal from './components/PagefindModal.vue'
import { useIsEn } from './composables/useIsEn'

const { frontmatter } = useData()
const isEn = useIsEn()
</script>

<template>
  <a class="skip-link" href="#main-content">{{ isEn ? 'Skip to main content' : '跳到主要内容' }}</a>
  <PagefindModal />
  <HomePage v-if="frontmatter.layout === 'home-custom'" />
  <DefaultTheme.Layout v-else>
    <template #layout-top>
      <HomeNav />
    </template>
  </DefaultTheme.Layout>
</template>
