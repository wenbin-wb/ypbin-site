<script setup lang="ts">
import type { ProductStatus } from '../../data/source-manifest'

defineProps<{ status: ProductStatus; label?: string }>()

const labels: Record<ProductStatus, string> = {
  stable: '稳定版',
  development: '开发中',
  private: '私有包'
}
</script>

<template>
  <span class="status-badge" :class="`is-${status}`">
    <span class="status-badge__dot" aria-hidden="true" />
    {{ label ?? labels[status] }}
  </span>
</template>
