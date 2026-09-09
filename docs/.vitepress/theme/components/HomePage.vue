<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'

import HomeNav from './HomeNav.vue'
import FeatureGrid from './FeatureGrid.vue'
import ArchitectureMap from './ArchitectureMap.vue'
import QuickStart from './QuickStart.vue'
import ProductShowcase from './ProductShowcase.vue'
import WhyYpbin from './WhyYpbin.vue'
import RoadmapPreview from './RoadmapPreview.vue'
import VerifiedFacts from './VerifiedFacts.vue'
import SiteFooter from './SiteFooter.vue'
import { sourceManifest } from '../../data/source-manifest'
import { useIsEn } from '../composables/useIsEn'

const isEn = useIsEn()

/** Hero 文案与链接：zh 保持原样，en 输出英文版（链接指向既有英文页） */
const hero = computed(() => {
  const stable = `v${sourceManifest.stableStarterVersion}`
  if (isEn.value) {
    return {
      eyebrow: 'Spring Boot 4.1 · Java 21 · Vue 3',
      titleLead: 'System-level details rarely fix themselves — ',
      titleEm: 'we make them right by default.',
      lead:
        'Cache stampedes, serialization N+1, password-lock races and signature-replay windows — system-level details every project rediscovers the hard way. ypbin builds them in, gets them right and makes them the default, so your business code stays business-only.',
      badge: `${stable} stable release · Maven Central`,
      startText: 'Get started',
      startHref: '/en/guide',
      archText: 'View architecture',
      archHref: '/en/architecture',
      adminText: 'Try the admin demo',
      adminHref: 'https://admin.ypbin.cn'
    }
  }
  return {
    eyebrow: 'Spring Boot 4.1 · Java 21 · Vue 3',
    titleLead: '细节不会自己变对，',
    titleEm: '但可以替你变对。',
    lead:
      '缓存击穿、序列化 N+1、密码锁定竞态、签名重放窗口——这些系统级细节，每个项目都要踩一遍的坑。ypbin 把它们内建、做对、设为默认，业务代码只写业务。',
    badge: `${stable} 稳定版 · Maven Central`,
    startText: '快速开始',
    startHref: '/guide/starter/',
    archText: '查看架构',
    archHref: '/architecture',
    adminText: '在线体验 Admin',
    adminHref: 'https://admin.ypbin.cn'
  }
})

let revealObserver: IntersectionObserver | null = null

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const selectors = [
    '.why-grid',
    '.showcase-grid',
    '.feature-grid',
    '.architecture-intro',
    '.quickstart-layout',
    '.facts-grid',
    '.roadmap-list'
  ]
  const elements = Array.from(document.querySelectorAll<HTMLElement>(selectors.join(',')))
  elements.forEach((el, i) => {
    el.classList.add(el.classList.contains('showcase-grid') ? 'reveal-zoom' : 'reveal')
    el.style.setProperty('--reveal-delay', `${Math.min(i * 80, 560)}ms`)
  })
  revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          revealObserver?.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.12 }
  )
  elements.forEach((el) => revealObserver?.observe(el))
})
onUnmounted(() => revealObserver?.disconnect())

const jsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ypbin',
  url: 'https://ypbin.cn',
  logo: 'https://ypbin.cn/brand/logo-mark.svg',
  sameAs: ['https://github.com/wenbin-wb']
})
</script>

<template>
  <div class="home-page">
    <HomeNav />
    <main id="main-content">
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero__content">
          <p class="hero__eyebrow">{{ hero.eyebrow }}</p>
          <h1 id="hero-title">{{ hero.titleLead }}<em>{{ hero.titleEm }}</em></h1>
          <p>{{ hero.lead }}</p>
          <div class="hero__actions">
            <span class="status-badge is-stable">
              <span class="status-badge__dot" aria-hidden="true" />
              {{ hero.badge }}
            </span>
            <a class="button-primary" :href="hero.startHref">{{ hero.startText }}</a>
            <a class="button-quiet" :href="hero.archHref">{{ hero.archText }}</a>
            <a class="button-quiet" :href="hero.adminHref" target="_blank" rel="noopener">{{ hero.adminText }}</a>
          </div>
        </div>
      </section>
      <FeatureGrid />
      <ArchitectureMap />
      <QuickStart />
      <ProductShowcase />
      <WhyYpbin />
      <RoadmapPreview />
      <VerifiedFacts />
    </main>
    <SiteFooter />
    <component :is="'script'" type="application/ld+json">{{ jsonLd }}</component>
  </div>
</template>
