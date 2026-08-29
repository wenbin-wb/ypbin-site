<script setup lang="ts">
const reasons = [
  {
    title: '难做对的地方，替你做对',
    desc: '缓存击穿/穿透/雪崩三重防护、序列化期零 N+1 的引用翻译、密码错误锁定的 TTL 竞态、接口签名的时钟偏移与重放窗口——这些容易埋雷的细节全部内建，并经过对抗性审查。',
    tag: '细节即质量'
  },
  {
    title: '一套架构，单体微服务同源',
    desc: '基础层不依赖 Spring Cloud，单体直接用、微服务叠加治理层，对外契约完全一致、前端无感知。不会出现「单体一套、微服务另起炉灶」的撕裂。',
    tag: '架构一致'
  },
  {
    title: '能力即插即拔，随时被接管',
    desc: '所有能力 Bean 一律 @ConditionalOnMissingBean + @ConditionalOnProperty：定义同类型 Bean 即覆盖默认实现，改一行配置就关停整个模块。不改 starter 一行源码。',
    tag: '可扩展'
  },
  {
    title: '生产就绪，不是 demo',
    desc: 'License 商业授权、AI 对话、多租户、数据权限、SSE 实时推送、审计规范全部内置。一条命令部署完整后台，第一天就站在生产就绪的地基上。',
    tag: '开箱即用'
  }
]
</script>

<template>
  <section class="home-section why-section" aria-labelledby="why-title">
    <div class="section-heading">
      <p class="section-kicker">为什么是 ypbin</p>
      <h2 id="why-title">别的框架要自己踩的坑，<br />这里已经替你填平。</h2>
      <p>不是又一个脚手架。是把你迟早要自己实现的系统级能力，先做对、做透、做成默认。</p>
    </div>
    <div class="why-grid">
      <article v-for="(item, i) in reasons" :key="i" class="why-card">
        <span class="why-card__tag">{{ item.tag }}</span>
        <h3>{{ item.title }}</h3>
        <p>{{ item.desc }}</p>
      </article>
    </div>
  </section>
</template>
