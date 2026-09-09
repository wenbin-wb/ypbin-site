<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useData } from 'vitepress'

const { isDark } = useData()

const screenshots = [
  { id: 'dashboard', label: '运行概览', description: '用户、角色、菜单与在线会话的真实统计。' },
  { id: 'users', label: '用户管理', description: '用户列表的状态过滤、导入导出与授权维护。' },
  { id: 'roles', label: '角色权限', description: '数据范围、启停状态与角色维护。' },
  { id: 'menus', label: '动态菜单', description: '后端菜单、权限标识与页面组件。' },
  { id: 'licenses', label: '商业授权', description: '授权签发、审批、交付与运行状态。' },
  { id: 'login', label: '登录入口', description: 'ypbin 品牌登录页与真实认证表单。' }
]

const active = ref<{ id: string; label: string } | null>(null)

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') active.value = null
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <section class="home-section showcase-section" aria-labelledby="showcase-title">
    <div class="section-heading">
      <h2 id="showcase-title">来自真实运行态的产品界面。</h2>
      <p>全部图片由真实 admin 与 admin-ui 自动采集，阻断外网并记录源码提交、工作区指纹、视口和 SHA-256；不使用手绘界面或上游截图。</p>
    </div>
    <div class="showcase-grid">
      <figure v-for="item in screenshots" :key="item.id" class="showcase-card">
        <button
          type="button"
          class="showcase-card__view"
          :aria-label="`放大查看 ${item.label}`"
          @click="active = { id: item.id, label: item.label }"
        >
          <img
            :src="isDark ? `/screenshots/admin-ui/${item.id}-dark.webp` : `/screenshots/admin-ui/${item.id}.webp`"
            :alt="`ypbin-admin ${item.label} 真实运行截图`"
            width="2560"
            height="1440"
            loading="lazy"
          />
        </button>
        <figcaption><strong>{{ item.label }}</strong><span>{{ item.description }}</span></figcaption>
      </figure>
    </div>
    <div class="showcase-proof">
      <span>6 张精选截图 · 已采集核验</span>
      <code>admin-ui@543cb63e</code>
      <a href="/screenshots/admin-ui/manifest.json">查看采集清单与哈希 <span aria-hidden="true">→</span></a>
    </div>
    <Teleport to="body">
      <div
        v-if="active"
        class="lightbox"
        role="dialog"
        aria-modal="true"
        :aria-label="`${active.label} 放大预览`"
        @click.self="active = null"
      >
        <button type="button" class="lightbox__close" aria-label="关闭" @click="active = null">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
        <img :src="isDark ? `/screenshots/admin-ui/${active.id}-dark.png` : `/screenshots/admin-ui/${active.id}.png`" :alt="`ypbin-admin ${active.label} 放大预览`" />
      </div>
    </Teleport>
  </section>
</template>
