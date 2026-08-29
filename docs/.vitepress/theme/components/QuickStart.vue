<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { codeToHtml } from 'shiki'

const copied = ref(false)
const command = '<dependency>\n  <groupId>cn.ypbin</groupId>\n  <artifactId>ypbin-starter-web</artifactId>\n  <version>1.4.1</version>\n</dependency>'
const codeHtml = ref('')

onMounted(async () => {
  codeHtml.value = await codeToHtml(command, { lang: 'xml', theme: 'github-dark' })
})

async function copyCommand() {
  await navigator.clipboard.writeText(command)
  copied.value = true
  window.setTimeout(() => { copied.value = false }, 1800)
}
</script>

<template>
  <section class="home-section quickstart-section" aria-labelledby="quickstart-title">
    <div class="quickstart-layout">
      <div class="section-heading">
        <h2 id="quickstart-title">从稳定版 starter 开始。</h2>
        <p>三行依赖，Maven 与 Java 21 即可跑起来。生产环境请使用稳定版 v1.4.1，SNAPSHOT 仅用于跟进最新开发。</p>
        <a class="text-link" href="/guide/starter/">阅读完整快速开始 <span aria-hidden="true">→</span></a>
      </div>
      <div class="code-panel">
        <div class="code-panel__bar"><span>pom.xml</span><button type="button" @click="copyCommand">{{ copied ? '已复制' : '复制' }}</button></div>
        <div class="code-panel__body" v-html="codeHtml"></div>
      </div>
    </div>
  </section>
</template>
