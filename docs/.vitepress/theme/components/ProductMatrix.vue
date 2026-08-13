<script setup lang="ts">
import { sourceManifest } from '../../data/source-manifest'
import StatusBadge from './StatusBadge.vue'
</script>

<template>
  <section class="home-section matrix-section" aria-labelledby="matrix-title">
    <div class="section-heading">
      <h2 id="matrix-title">三种边界，一条交付链。</h2>
      <p>基础能力向上供给，业务服务完成组装，管理界面消费动态路由与接口。规模数字来自仓库当前源码统计。</p>
    </div>
    <div class="product-matrix">
      <article v-for="product in sourceManifest.products" :key="product.id" class="product-card" :class="{ 'is-foundation': product.id === 'starter' }">
        <div class="product-card__body">
          <StatusBadge :status="product.status" />
          <h3>{{ product.name }}</h3>
          <p>{{ product.description }}</p>
          <code>{{ product.scaleLabel }}</code>
          <ul><li v-for="fact in product.facts" :key="fact">{{ fact }}</li></ul>
          <div class="product-card__links">
            <a :href="`/products/${product.id}`">查看产品边界 <span aria-hidden="true">→</span></a>
            <a
              v-if="product.id === 'admin'"
              class="product-card__online"
              href="https://admin.ypbin.cn"
              target="_blank"
              rel="noopener"
            >在线访问 <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
