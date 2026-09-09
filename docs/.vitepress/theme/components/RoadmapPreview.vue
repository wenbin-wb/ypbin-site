<script setup lang="ts">
import { sourceManifest } from '../../data/source-manifest'
</script>

<template>
  <section class="home-section roadmap-section" aria-labelledby="roadmap-title">
    <div class="section-heading">
      <p class="section-kicker">发布动态</p>
      <h2 id="roadmap-title">近期发布与正在推进的方向。</h2>
      <p>三端各自的状态以仓库源码与发布记录为准。</p>
    </div>
    <ul class="roadmap-list">
      <li v-for="item in sourceManifest.roadmap" :key="item.id">
        <code>{{ item.label }}</code>
        <span>{{ item.item }}</span>
        <span class="roadmap-list__scope">{{ item.scope }}</span>
      </li>
    </ul>
    <div class="roadmap-links">
      <a class="text-link" href="/releases">查看完整发布历史 <span aria-hidden="true">→</span></a>
      <a class="text-link" href="/security">安全公告与联系方式 <span aria-hidden="true">→</span></a>
    </div>
  </section>
</template>
