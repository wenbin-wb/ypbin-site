<script setup lang="ts">
import { sourceManifest } from '../../data/source-manifest'
</script>

<template>
  <section class="home-section facts-section" aria-labelledby="facts-title">
    <div class="section-heading">
      <h2 id="facts-title">直接对应源码的版本事实。</h2>
      <p>以下数据取自三个仓库的根配置；稳定发布和开发快照分别标注。</p>
    </div>
    <dl class="facts-grid">
      <div><dt>starter 模块</dt><dd class="fact-value">34</dd><dd class="fact-detail">根 POM modules</dd></div>
      <div><dt>starter 稳定版</dt><dd class="fact-value">v{{ sourceManifest.stableStarterVersion }}</dd><dd class="fact-detail">已发布</dd></div>
      <div><dt>admin 模块</dt><dd class="fact-value">3</dd><dd class="fact-detail">common / system / server</dd></div>
      <div><dt>基础运行时</dt><dd class="fact-value">Java 17</dd><dd class="fact-detail">Spring Boot 3.5.16</dd></div>
    </dl>
    <p class="verified-date">事实核验日期：{{ sourceManifest.verifiedAt }}</p>
  </section>
</template>
