<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

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
          <p class="hero__eyebrow">Spring Boot 4.1 · Java 21 · Vue 3</p>
          <h1 id="hero-title">细节不会自己变对，<em>但可以替你变对。</em></h1>
          <p>
            缓存击穿、序列化 N+1、密码锁定竞态、签名重放窗口——这些系统级细节，
            每个项目都要踩一遍的坑。ypbin 把它们内建、做对、设为默认，
            业务代码只写业务。
          </p>
          <div class="hero__actions">
            <span class="status-badge is-stable">
              <span class="status-badge__dot" aria-hidden="true" />
              v{{ sourceManifest.stableStarterVersion }} 稳定版 · Maven Central
            </span>
            <a class="button-primary" href="/guide/starter/">快速开始</a>
            <a class="button-quiet" href="/architecture">查看架构</a>
            <a class="button-quiet" href="https://admin.ypbin.cn" target="_blank" rel="noopener">在线体验 Admin</a>
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
