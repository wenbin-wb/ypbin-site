<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

import { sourceManifest } from '../../data/source-manifest'

const stats = sourceManifest.trustStats.map((stat) => ({
  ...stat,
  value: Number(stat.value),
  display: ref(0)
}))
const root = ref<HTMLElement | null>(null)

let observer: IntersectionObserver | null = null
let raf = 0

function animate(display: { value: number }, target: number, delay: number) {
  const start = performance.now() + delay
  const duration = 1200
  const tick = (now: number) => {
    const elapsed = now - start
    if (elapsed < 0) {
      raf = requestAnimationFrame(tick)
      return
    }
    const p = Math.min(elapsed / duration, 1)
    display.value = Math.round(target * (1 - Math.pow(1 - p, 3)))
    if (p < 1) raf = requestAnimationFrame(tick)
    else display.value = target
  }
  raf = requestAnimationFrame(tick)
}

onMounted(() => {
  if (!root.value) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    stats.forEach((stat) => (stat.display.value = stat.value))
    return
  }
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) return
        observer?.disconnect()
        stats.forEach((stat, i) => animate(stat.display, stat.value, i * 90))
      }
    },
    { threshold: 0.4 }
  )
  observer.observe(root.value)
})
onUnmounted(() => {
  observer?.disconnect()
  cancelAnimationFrame(raf)
})
</script>

<template>
  <div ref="root" class="trust-bar" aria-label="工程规模统计">
    <div v-for="stat in stats" :key="stat.label">
      <span class="trust-value">{{ stat.display }}</span>
      <span class="trust-label">{{ stat.label }}</span>
    </div>
  </div>
</template>
