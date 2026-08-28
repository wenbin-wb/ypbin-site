<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

import ArchitectureMap from './ArchitectureMap.vue'
import CapabilityLayers from './CapabilityLayers.vue'
import HomeNav from './HomeNav.vue'
import ProductMatrix from './ProductMatrix.vue'
import ProductShowcase from './ProductShowcase.vue'
import QuickStart from './QuickStart.vue'
import RoadmapPreview from './RoadmapPreview.vue'
import SiteFooter from './SiteFooter.vue'
import TrustBar from './TrustBar.vue'
import VerifiedFacts from './VerifiedFacts.vue'

let revealObserver: IntersectionObserver | null = null

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const selectors = [
    '.architecture-intro',
    '.architecture-map-wrap',
    '.product-matrix',
    '.showcase-grid',
    '.capability-grid',
    '.facts-grid',
    '.principles-grid',
    '.roadmap-list',
    '.quickstart-layout'
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
          <h1 id="hero-title">把系统级基建，<em>沉到业务之下。</em></h1>
          <p>35 个模块按需引入，三层产品边界清楚；接入一行依赖，Maven 与 Java 21 即可跑起来。</p>
          <div class="hero__actions">
            <a class="button-primary" href="/guide/starter/">开始使用</a>
            <a class="button-quiet" href="https://admin.ypbin.cn" target="_blank" rel="noopener">在线体验 Admin</a>
          </div>
        </div>
      </section>
      <TrustBar />
      <ArchitectureMap />
      <ProductMatrix />
      <ProductShowcase />
      <CapabilityLayers />
      <section class="home-section principles-section" aria-labelledby="principles-title">
        <h2 id="principles-title">先定义边界，再增加能力。</h2>
        <div class="principles-grid">
          <article><strong>显式失败</strong><p>配置和集成问题直接报错或记日志，错误不被静默吞掉。</p></article>
          <article><strong>统一语义</strong><p>数据库字段、实体属性与接口 JSON 保持同名，不做额外映射层。</p></article>
          <article><strong>版本有界</strong><p>稳定版与 SNAPSHOT 分开陈述，依赖建议明确对应版本状态。</p></article>
        </div>
      </section>
      <VerifiedFacts />
      <RoadmapPreview />
      <QuickStart />
    </main>
    <SiteFooter />
    <component :is="'script'" type="application/ld+json">{{ jsonLd }}</component>
  </div>
</template>
