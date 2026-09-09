<script setup lang="ts">
import { computed } from 'vue'
import { sourceManifest } from '../../data/source-manifest'
import { useIsEn } from '../composables/useIsEn'

const isEn = useIsEn()

const stable = sourceManifest.stableStarterVersion

/** 事实网格：数值/版本取 sourceManifest（中文数据源），标签与说明按语言输出 */
const facts = computed(() =>
  isEn.value
    ? [
        { dt: 'ypbin-starter', value: `v${stable}`, detail: 'Stable · Maven Central' },
        { dt: 'ypbin-admin', value: '1.0.0-SNAPSHOT', detail: `In development · built on starter v${stable}` },
        { dt: 'Runtime baseline', value: 'Java 21', detail: 'Spring Boot 4.1.0 · JDK 21' },
        { dt: 'License', value: 'Apache 2.0', detail: 'Free to use in commercial projects' }
      ]
    : [
        { dt: 'ypbin-starter', value: `v${stable}`, detail: '稳定版 · Maven Central' },
        { dt: 'ypbin-admin', value: '1.0.0-SNAPSHOT', detail: `开发中 · 依赖 starter v${stable}` },
        { dt: '运行基线', value: 'Java 21', detail: 'Spring Boot 4.1.0 · JDK 21' },
        { dt: '协议', value: 'Apache 2.0', detail: '可自由用于商业项目' }
      ]
)

const t = computed(() =>
  isEn.value
    ? {
        kicker: 'Current status',
        title: 'Stable release — not a castle in the air.',
        desc: 'Version facts map directly to the repository root configuration; stable releases and development snapshots are labeled separately.',
        verifiedPrefix: 'Facts verified: '
      }
    : {
        kicker: '当前状态',
        title: '稳定发布，不是空中楼阁。',
        desc: '版本事实直接对应仓库根配置；稳定版与开发快照分别标注。',
        verifiedPrefix: '事实核验日期：'
      }
)
</script>

<template>
  <section class="home-section facts-section" aria-labelledby="facts-title">
    <div class="section-heading">
      <p class="section-kicker">{{ t.kicker }}</p>
      <h2 id="facts-title">{{ t.title }}</h2>
      <p>{{ t.desc }}</p>
    </div>
    <dl class="facts-grid">
      <div v-for="fact in facts" :key="fact.dt"><dt>{{ fact.dt }}</dt><dd class="fact-value">{{ fact.value }}</dd><dd class="fact-detail">{{ fact.detail }}</dd></div>
    </dl>
    <p class="verified-date">{{ t.verifiedPrefix }}{{ sourceManifest.verifiedAt }}</p>
  </section>
</template>
