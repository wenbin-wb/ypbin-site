<script setup lang="ts">
import { sourceManifest } from '../../data/source-manifest'
</script>

<template>
  <section class="home-section roadmap-section" aria-labelledby="roadmap-title">
    <div class="section-heading">
      <h2 id="roadmap-title">正在推进的方向。</h2>
      <p>三端各自在做的下一步，以当前仓库源码与发布记录为准。</p>
    </div>
    <ul class="roadmap-list">
      <li v-for="item in sourceManifest.roadmap" :key="item.id">
        <code>{{ item.label }}</code>
        <span>{{ item.item }}</span>
        <span class="roadmap-list__scope">{{ item.scope }}</span>
      </li>
    </ul>
  </section>
</template>
