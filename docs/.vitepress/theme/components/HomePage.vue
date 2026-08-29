<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

import HomeNav from './HomeNav.vue'
import WhyYpbin from './WhyYpbin.vue'
import ProductShowcase from './ProductShowcase.vue'
import FeatureGrid from './FeatureGrid.vue'
import ArchitectureMap from './ArchitectureMap.vue'
import QuickStart from './QuickStart.vue'
import VerifiedFacts from './VerifiedFacts.vue'
import RoadmapPreview from './RoadmapPreview.vue'
import SiteFooter from './SiteFooter.vue'

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
          <p class="hero__eyebrow">Spring Boot · Java 21 · Vue 3</p>
          <h1 id="hero-title">从脚手架到生产就绪，<em>一条命令。</em></h1>
          <p>
            把安全、缓存、权限、任务、消息、AI 这些系统级基建沉到 starter 里做对做透，
            业务只写业务。35 个模块按需引入，单体和微服务同源，
            一条命令部署整套后台。
          </p>
          <div class="hero__actions">
            <a class="button-primary" href="https://admin.ypbin.cn" target="_blank" rel="noopener">在线体验 Admin</a>
            <a class="button-quiet" href="/guide/starter/">三行依赖接入 <span aria-hidden="true">→</span></a>
          </div>
          <div class="hero__hint">
            <code>bash &lt;(curl -fsSL&nbsp;…/deploy/install.sh)</code>
            <span>— 新服务器一键部署全套（后端 + 前端 + MySQL + Redis）</span>
          </div>
        </div>
      </section>
      <WhyYpbin />
      <ProductShowcase />
      <FeatureGrid />
      <ArchitectureMap />
      <QuickStart />
      <VerifiedFacts />
      <RoadmapPreview />
    </main>
    <SiteFooter />
    <component :is="'script'" type="application/ld+json">{{ jsonLd }}</component>
  </div>
</template>
