<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { codeToHtml } from 'shiki'
import { sourceManifest } from '../../data/source-manifest'

const starterVersion = sourceManifest.stableStarterVersion
const copied = ref(false)
const command = `<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>cn.ypbin</groupId>
      <artifactId>ypbin-starter-bom</artifactId>
      <version>${starterVersion}</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>

<dependency>
  <groupId>cn.ypbin</groupId>
  <artifactId>ypbin-starter-web</artifactId>
</dependency>`
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
      <h2 id="quickstart-title">两种接法，都只花五分钟。</h2>
      <p>多数项目从引入 starter 开始；想要整套后台可直接部署，一条命令跑通。</p>
    </div>
    <div class="quickstart-layout">
      <article class="quickstart-card">
        <span class="quickstart-card__num">01</span>
        <h3>在自己的服务里接入 starter</h3>
        <p>引入 BOM 后按需声明模块依赖，自动装配、零配置。稳定版 v{{ starterVersion }}（Java 21 · Spring Boot 4.1）已发布 Maven Central。</p>
        <div class="code-panel">
          <div class="code-panel__bar"><span>pom.xml</span><button type="button" @click="copyCommand">{{ copied ? '已复制' : '复制' }}</button></div>
          <div class="code-panel__body" v-html="codeHtml"></div>
        </div>
        <a class="text-link" href="/guide/starter/">阅读完整快速开始 <span aria-hidden="true">→</span></a>
      </article>
      <article class="quickstart-card">
        <span class="quickstart-card__num">02</span>
        <h3>直接跑起整套后台</h3>
        <p>想先看效果或需要完整后台（主推微服务 main 形态，另有单体 boot 分支）：新服务器执行一条命令，自动装依赖、构建、启动，交互式确认端口与部署模式。</p>
        <code class="quickstart-card__cmd">bash &lt;(curl -fsSL https://raw.githubusercontent.com/wenbin-wb/ypbin-admin/main/deploy/install.sh)</code>
        <a class="text-link" href="/guide/admin/deployment">查看部署文档 <span aria-hidden="true">→</span></a>
      </article>
    </div>
  </section>
</template>
