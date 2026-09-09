<script setup lang="ts">
import type { ProductStatus } from '../../data/source-manifest'
import { useIsEn } from '../composables/useIsEn'

const props = defineProps<{ status: ProductStatus; label?: string }>()

const isEn = useIsEn()

const zhLabels: Record<ProductStatus, string> = {
  stable: '稳定版',
  development: '开发中',
  private: '私有包'
}

const enLabels: Record<ProductStatus, string> = {
  stable: 'Stable',
  development: 'Development',
  private: 'Private workspace'
}
</script>

<template>
  <span class="status-badge" :class="`is-${props.status}`">
    <span class="status-badge__dot" aria-hidden="true" />
    {{ props.label ?? (isEn ? enLabels[props.status] : zhLabels[props.status]) }}
  </span>
</template>
