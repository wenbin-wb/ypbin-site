<script setup lang="ts">
defineProps<{ source: string; href?: string; verifiedAt?: string }>()
</script>

<template>
  <aside class="source-citation" aria-label="事实来源">
    <span>来源</span>
    <code>{{ source }}</code>
    <small v-if="verifiedAt">核验于 {{ verifiedAt }}</small>
  </aside>
</template>
