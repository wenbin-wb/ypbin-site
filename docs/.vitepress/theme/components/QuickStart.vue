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
    <div class="section-heading">
      <p class="section-kicker">怎么开始</p>
      <h2 id="quickstart-title">两条路，都是五分钟内。</h2>
      <p>想要整套后台：一条命令部署。只想借地基：三行依赖引入。</p>
    </div>
    <div class="quickstart-layout">
      <article class="quickstart-card">
        <span class="quickstart-card__num">01</span>
        <h3>部署整套后台（含前端 + MySQL + Redis）</h3>
        <p>新服务器执行一条命令，自动装依赖、构建、启动、生成凭据，交互式确认端口与模式。</p>
        <code class="quickstart-card__cmd">bash &lt;(curl -fsSL&nbsp;…/ypbin-admin/main/deploy/install.sh)</code>
        <a class="text-link" href="/guide/admin/deployment">查看部署文档 <span aria-hidden="true">→</span></a>
      </article>
      <article class="quickstart-card">
        <span class="quickstart-card__num">02</span>
        <h3>在自己的服务里接入 starter</h3>
        <p>引入 BOM 后按需加依赖，自动装配、零配置。稳定版 v1.4.1 已发布 Maven Central。</p>
        <div class="code-panel">
          <div class="code-panel__bar"><span>pom.xml</span><button type="button" @click="copyCommand">{{ copied ? '已复制' : '复制' }}</button></div>
          <div class="code-panel__body" v-html="codeHtml"></div>
        </div>
        <a class="text-link" href="/guide/starter/">阅读完整快速开始 <span aria-hidden="true">→</span></a>
      </article>
    </div>
  </section>
</template>
