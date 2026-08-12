<script setup lang="ts">
import { sourceManifest } from '../../data/source-manifest'
</script>

<template>
  <section class="home-section capability-section" aria-labelledby="capability-title">
    <div class="section-heading">
      <h2 id="capability-title">从单体到微服务，一套可选的模块矩阵。</h2>
      <p>34 个 Maven 模块按能力分层，按需引入，用不到的模块不进 classpath。模块名与 maven artifact 一一对应，来源为根聚合 pom。</p>
    </div>
    <div class="capability-grid">
      <article
        v-for="layer in sourceManifest.capabilityLayers"
        :key="layer.id"
        class="capability-card"
        :class="[`capability-card--${layer.id}`, layer.modules.length > 12 ? 'is-wide' : '']"
      >
        <header class="capability-card__head">
          <span class="capability-card__count" aria-hidden="true">{{ layer.modules.length }}</span>
          <div>
            <h3>{{ layer.name }}</h3>
            <p>{{ layer.description }}</p>
          </div>
        </header>
        <ul class="capability-card__modules">
          <li v-for="m in layer.modules" :key="m"><code>{{ m }}</code></li>
        </ul>
      </article>
    </div>
  </section>
</template>
