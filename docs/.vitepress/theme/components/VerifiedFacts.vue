<script setup lang="ts">
import { sourceManifest } from '../../data/source-manifest'
</script>

<template>
  <section class="home-section facts-section" aria-labelledby="facts-title">
    <div class="section-heading">
      <p class="section-kicker">当前状态</p>
      <h2 id="facts-title">稳定发布，不是空中楼阁。</h2>
      <p>版本事实直接对应仓库根配置；稳定版与开发快照分别标注。</p>
    </div>
    <dl class="facts-grid">
      <div><dt>ypbin-starter</dt><dd class="fact-value">v{{ sourceManifest.stableStarterVersion }}</dd><dd class="fact-detail">稳定版 · Maven Central</dd></div>
      <div><dt>ypbin-admin</dt><dd class="fact-value">1.0.0-SNAPSHOT</dd><dd class="fact-detail">开发中 · 依赖 starter v{{ sourceManifest.stableStarterVersion }}</dd></div>
      <div><dt>运行基线</dt><dd class="fact-value">Java 21</dd><dd class="fact-detail">Spring Boot 4.1.0 · JDK 21</dd></div>
      <div><dt>协议</dt><dd class="fact-value">Apache 2.0</dd><dd class="fact-detail">可自由用于商业项目</dd></div>
    </dl>
    <p class="verified-date">事实核验日期：{{ sourceManifest.verifiedAt }}</p>
  </section>
</template>
