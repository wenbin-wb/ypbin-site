<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const open = ref(false)
const ready = ref(false)

async function initPagefind() {
  if (ready.value) return
  try {
    const check = await fetch('/pagefind/pagefind.js', { method: 'HEAD' })
    if (!check.ok) {
      ready.value = false
      return
    }
    const mod = await import('@pagefind/default-ui')
    const container = document.getElementById('yp-pagefind-ui')
    if (container && !container.querySelector('.pagefind-ui')) {
      new mod.PagefindUI({
        element: '#yp-pagefind-ui',
        showSubResults: false,
        translations: { placeholder: '搜索文档' }
      })
    }
    ready.value = true
  } catch {
    ready.value = false
  }
}

function openModal() {
  open.value = true
  document.body.style.overflow = 'hidden'
  requestAnimationFrame(async () => {
    await initPagefind()
    setTimeout(() => {
      document.querySelector<HTMLInputElement>('#yp-pagefind-ui input')?.focus()
    }, 60)
  })
}

function closeModal() {
  open.value = false
  document.body.style.overflow = ''
}

function onKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    if (open.value) closeModal()
    else openModal()
  }
  if (e.key === 'Escape' && open.value) closeModal()
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('yp:open-search', openModal)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('yp:open-search', openModal)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div v-show="open" class="yp-search-modal" role="dialog" aria-modal="true" aria-label="搜索文档">
      <div class="yp-search-modal__backdrop" @click="closeModal" />
      <div class="yp-search-modal__panel">
        <div id="yp-pagefind-ui" />
        <p v-if="!ready" class="yp-search-modal__notice">搜索索引在构建后生成，请先运行 pnpm build。</p>
      </div>
    </div>
  </Teleport>
</template>
