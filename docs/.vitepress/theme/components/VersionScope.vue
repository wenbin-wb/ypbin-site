<script setup lang="ts">
defineProps<{ version: string; status: 'stable' | 'development' | 'private' }>()
</script>

<template>
  <p class="version-scope" role="note">
    <strong>版本范围</strong>
    <span>{{ version }}</span>
    <span v-if="status === 'development'">快照版本，仅用于开发验证</span>
    <span v-else-if="status === 'private'">私有工作区版本，不发布为公共包</span>
    <span v-else>已发布稳定版本</span>
  </p>
</template>
