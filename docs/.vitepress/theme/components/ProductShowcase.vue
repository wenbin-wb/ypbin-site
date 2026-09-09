<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useData } from 'vitepress'
import { useIsEn } from '../composables/useIsEn'

const { isDark } = useData()
const isEn = useIsEn()

interface ShotItem {
  id: string
  label: string
  description: string
}

const zhScreenshots: ShotItem[] = [
  { id: 'dashboard', label: '运行概览', description: '用户、角色、菜单与在线会话的真实统计。' },
  { id: 'users', label: '用户管理', description: '用户列表的状态过滤、导入导出与授权维护。' },
  { id: 'roles', label: '角色权限', description: '数据范围、启停状态与角色维护。' },
  { id: 'menus', label: '动态菜单', description: '后端菜单、权限标识与页面组件。' },
  { id: 'licenses', label: '商业授权', description: '授权签发、审批、交付与运行状态。' },
  { id: 'login', label: '登录入口', description: 'ypbin 品牌登录页与真实认证表单。' }
]

const enScreenshots: ShotItem[] = [
  { id: 'dashboard', label: 'Overview', description: 'Live statistics for users, roles, menus and online sessions.' },
  { id: 'users', label: 'User management', description: 'Status filters, import/export and authorization maintenance for the user list.' },
  { id: 'roles', label: 'Roles and permissions', description: 'Data scope, enable/disable state and role maintenance.' },
  { id: 'menus', label: 'Dynamic menus', description: 'Backend menus, permission codes and page components.' },
  { id: 'licenses', label: 'Commercial licenses', description: 'License issuance, approval, delivery and runtime state.' },
  { id: 'login', label: 'Sign in', description: 'The ypbin-branded sign-in page with a real authentication form.' }
]

const screenshots = computed(() => (isEn.value ? enScreenshots : zhScreenshots))

const active = ref<{ id: string; label: string } | null>(null)

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') active.value = null
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

const heading = computed(() =>
  isEn.value
    ? {
        title: 'Real screens from a real running product.',
        desc: 'Every image is captured automatically from real admin and admin-ui instances — network egress blocked, with the source commit, workspace fingerprint, viewport and SHA-256 recorded. No mock-ups, no upstream screenshots.',
        proof: '6 curated screenshots · captured and verified',
        manifestLink: 'View the capture manifest and hashes',
        close: 'Close'
      }
    : {
        title: '来自真实运行态的产品界面。',
        desc: '全部图片由真实 admin 与 admin-ui 自动采集，阻断外网并记录源码提交、工作区指纹、视口和 SHA-256；不使用手绘界面或上游截图。',
        proof: '6 张精选截图 · 已采集核验',
        manifestLink: '查看采集清单与哈希',
        close: '关闭'
      }
)

function enlargeAria(label: string) {
  return isEn.value ? `Enlarge ${label}` : `放大查看 ${label}`
}
function shotAlt(label: string) {
  return isEn.value ? `ypbin-admin ${label} live screenshot` : `ypbin-admin ${label} 真实运行截图`
}
function previewAria(label: string) {
  return isEn.value ? `${label} enlarged preview` : `${label} 放大预览`
}
function previewAlt(label: string) {
  return isEn.value ? `ypbin-admin ${label} enlarged preview` : `ypbin-admin ${label} 放大预览`
}
</script>

<template>
  <section class="home-section showcase-section" aria-labelledby="showcase-title">
    <div class="section-heading">
      <h2 id="showcase-title">{{ heading.title }}</h2>
      <p>{{ heading.desc }}</p>
    </div>
    <div class="showcase-grid">
      <figure v-for="item in screenshots" :key="item.id" class="showcase-card">
        <button
          type="button"
          class="showcase-card__view"
          :aria-label="enlargeAria(item.label)"
          @click="active = { id: item.id, label: item.label }"
        >
          <img
            :src="isDark ? `/screenshots/admin-ui/${item.id}-dark.webp` : `/screenshots/admin-ui/${item.id}.webp`"
            :alt="shotAlt(item.label)"
            width="2560"
            height="1440"
            loading="lazy"
          />
        </button>
        <figcaption><strong>{{ item.label }}</strong><span>{{ item.description }}</span></figcaption>
      </figure>
    </div>
    <div class="showcase-proof">
      <span>{{ heading.proof }}</span>
      <code>admin-ui@543cb63e</code>
      <a href="/screenshots/admin-ui/manifest.json">{{ heading.manifestLink }} <span aria-hidden="true">→</span></a>
    </div>
    <Teleport to="body">
      <div
        v-if="active"
        class="lightbox"
        role="dialog"
        aria-modal="true"
        :aria-label="previewAria(active.label)"
        @click.self="active = null"
      >
        <button type="button" class="lightbox__close" :aria-label="heading.close" @click="active = null">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
        <img :src="isDark ? `/screenshots/admin-ui/${active.id}-dark.png` : `/screenshots/admin-ui/${active.id}.png`" :alt="previewAlt(active.label)" />
      </div>
    </Teleport>
  </section>
</template>
