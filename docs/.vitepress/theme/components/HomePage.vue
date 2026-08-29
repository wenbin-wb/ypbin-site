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
          <h1 id="hero-title">难做对的地方，<em>替你做到对。</em></h1>
          <p>
            缓存击穿、序列化 N+1、密码锁定竞态、签名重放窗口——这些系统级细节，
            每个项目都要踩一遍的坑。ypbin 把它们内建、做对、设为默认，
            业务只写业务，升级只改配置。
          </p>
          <div class="hero__actions">
            <a class="button-primary" href="https://admin.ypbin.cn" target="_blank" rel="noopener">在线体验 Admin</a>
            <a class="button-quiet" href="/guide/starter/">三行依赖接入 <span aria-hidden="true">→</span></a>
          </div>
          <div class="hero__hint">
            <code>mvn clean install · 已发布 Maven Central v1.4.1</code>
            <span>— 引入 BOM 按需取用，35 个模块独立发布</span>
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
