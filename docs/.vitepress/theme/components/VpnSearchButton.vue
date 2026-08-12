<script setup lang="ts">
function openSearch() {
  window.dispatchEvent(new CustomEvent('yp:open-search'))
}
</script>

<template>
  <button type="button" class="yp-search-btn" aria-label="搜索文档" @click="openSearch">
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="9" cy="9" r="6" /><path d="m13.8 13.8 4 4" /></svg>
    <span class="yp-search-btn__text">搜索文档</span>
    <span class="yp-search-btn__kbd"><kbd>Ctrl</kbd><kbd>K</kbd></span>
  </button>
</template>
