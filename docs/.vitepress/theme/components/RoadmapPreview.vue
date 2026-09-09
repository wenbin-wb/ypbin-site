<script setup lang="ts">
import { computed } from 'vue'
import { sourceManifest, type RoadmapItem } from '../../data/source-manifest'
import { useIsEn } from '../composables/useIsEn'

const isEn = useIsEn()

/** 路线图条目：label/版本仍取 sourceManifest（中文数据源），仅把 item 正文与 scope 按语言展示 */
const rows = computed<RoadmapItem[]>(() => {
  const enText: Record<RoadmapItem['id'], { item: string; scope: string }> = {
    starter: {
      item: 'Stable v2.2.3 shipped: repeatable-read limit 413 contractualized, @PlatformAccess dual-form user resolution, multi-level cache expiry semantics unified',
      scope: 'Released'
    },
    admin: {
      item: 'Microservices main line: service short-name routing, /internal/** token guard, one-command deploy with a randomized .env',
      scope: '1.0.0-SNAPSHOT'
    },
    'admin-ui': {
      item: 'web-antd v5.7.0: file download/import infrastructure and status filters; the permission-code contract evolves with admin',
      scope: 'Private workspace'
    }
  }
  return sourceManifest.roadmap.map((row) =>
    isEn.value ? { ...row, item: enText[row.id].item, scope: enText[row.id].scope } : row
  )
})

const t = computed(() =>
  isEn.value
    ? {
        kicker: 'Releases',
        title: 'Recent releases and what is moving next.',
        desc: 'Each product’s status follows its repository source and the release records.',
        releaseLink: 'View the full release history',
        releaseHref: '/en/releases',
        securityLink: 'Security advisories and contact',
        securityHref: '/en/security'
      }
    : {
        kicker: '发布动态',
        title: '近期发布与正在推进的方向。',
        desc: '三端各自的状态以仓库源码与发布记录为准。',
        releaseLink: '查看完整发布历史',
        releaseHref: '/releases',
        securityLink: '安全公告与联系方式',
        securityHref: '/security'
      }
)
</script>

<template>
  <section class="home-section roadmap-section" aria-labelledby="roadmap-title">
    <div class="section-heading">
      <p class="section-kicker">{{ t.kicker }}</p>
      <h2 id="roadmap-title">{{ t.title }}</h2>
      <p>{{ t.desc }}</p>
    </div>
    <ul class="roadmap-list">
      <li v-for="item in rows" :key="item.id">
        <code>{{ item.label }}</code>
        <span>{{ item.item }}</span>
        <span class="roadmap-list__scope">{{ item.scope }}</span>
      </li>
    </ul>
    <div class="roadmap-links">
      <a class="text-link" :href="t.releaseHref">{{ t.releaseLink }} <span aria-hidden="true">→</span></a>
      <a class="text-link" :href="t.securityHref">{{ t.securityLink }} <span aria-hidden="true">→</span></a>
    </div>
  </section>
</template>
