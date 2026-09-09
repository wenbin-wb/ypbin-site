<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { codeToHtml } from 'shiki'
import { sourceManifest } from '../../data/source-manifest'
import { useIsEn } from '../composables/useIsEn'

const isEn = useIsEn()
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

/** 快速开始双卡文案：zh 保持原样；en 深链接无英文页的指向中文原文档并标注 (Chinese docs available) */
const t = computed(() => {
  if (isEn.value) {
    return {
      kicker: 'How to start',
      title: 'Two ways in — each about five minutes.',
      desc: 'Most projects start by importing the starter; want the assembled backend instead? One command deploys it.',
      card1: {
        num: '01',
        title: 'Embed starter in your own service',
        desc: `Import the BOM, declare the modules you need, and auto-configuration takes over — zero config. The stable v${starterVersion} (Java 21 · Spring Boot 4.1) is published to Maven Central.`,
        linkText: 'Full quick start (Chinese docs available)',
        linkHref: '/guide/starter/'
      },
      card2: {
        num: '02',
        title: 'Run the whole backend directly',
        desc: 'To see it in action or get a complete backend (the microservices main form is recommended; a single-app boot branch also exists): run one command on a fresh server — it installs dependencies, builds and starts, prompting interactively for ports and deployment mode.',
        linkText: 'Deployment guide (Chinese docs available)',
        linkHref: '/guide/admin/deployment'
      },
      copyIdle: 'Copy',
      copyDone: 'Copied'
    }
  }
  return {
    kicker: '怎么开始',
    title: '两种接法，都只花五分钟。',
    desc: '多数项目从引入 starter 开始；想要整套后台可直接部署，一条命令跑通。',
    card1: {
      num: '01',
      title: '在自己的服务里接入 starter',
      desc: `引入 BOM 后按需声明模块依赖，自动装配、零配置。稳定版 v${starterVersion}（Java 21 · Spring Boot 4.1）已发布 Maven Central。`,
      linkText: '阅读完整快速开始',
      linkHref: '/guide/starter/'
    },
    card2: {
      num: '02',
      title: '直接跑起整套后台',
      desc: '想先看效果或需要完整后台（主推微服务 main 形态，另有单体 boot 分支）：新服务器执行一条命令，自动装依赖、构建、启动，交互式确认端口与部署模式。',
      linkText: '查看部署文档',
      linkHref: '/guide/admin/deployment'
    },
    copyIdle: '复制',
    copyDone: '已复制'
  }
})
</script>

<template>
  <section class="home-section quickstart-section" aria-labelledby="quickstart-title">
    <div class="section-heading">
      <p class="section-kicker">{{ t.kicker }}</p>
      <h2 id="quickstart-title">{{ t.title }}</h2>
      <p>{{ t.desc }}</p>
    </div>
    <div class="quickstart-layout">
      <article class="quickstart-card">
        <span class="quickstart-card__num">{{ t.card1.num }}</span>
        <h3>{{ t.card1.title }}</h3>
        <p>{{ t.card1.desc }}</p>
        <div class="code-panel">
          <div class="code-panel__bar"><span>pom.xml</span><button type="button" @click="copyCommand">{{ copied ? t.copyDone : t.copyIdle }}</button></div>
          <div class="code-panel__body" v-html="codeHtml"></div>
        </div>
        <a class="text-link" :href="t.card1.linkHref">{{ t.card1.linkText }} <span aria-hidden="true">→</span></a>
      </article>
      <article class="quickstart-card">
        <span class="quickstart-card__num">{{ t.card2.num }}</span>
        <h3>{{ t.card2.title }}</h3>
        <p>{{ t.card2.desc }}</p>
        <code class="quickstart-card__cmd">bash &lt;(curl -fsSL https://raw.githubusercontent.com/wenbin-wb/ypbin-admin/main/deploy/install.sh)</code>
        <a class="text-link" :href="t.card2.linkHref">{{ t.card2.linkText }} <span aria-hidden="true">→</span></a>
      </article>
    </div>
  </section>
</template>
