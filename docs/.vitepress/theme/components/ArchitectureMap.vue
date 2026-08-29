<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { codeToHtml } from 'shiki'

const snippet = `@Bean
@ConditionalOnMissingBean(name = "redisTemplate")
public RedisTemplate<String, Object> redisTemplate(
    RedisConnectionFactory connectionFactory,
    ObjectProvider<ObjectMapper> objectMapperProvider) {
  // 宿主声明同名 Bean 时，这里自动让位
  RedisTemplate<String, Object> template = new RedisTemplate<>();
  template.setConnectionFactory(connectionFactory);
  return template;
}`

const codeHtml = ref('')

onMounted(async () => {
  codeHtml.value = await codeToHtml(snippet, { lang: 'java', theme: 'github-dark' })
})
</script>

<template>
  <section class="architecture-section" aria-labelledby="architecture-title">
    <div class="architecture-intro">
      <h2 id="architecture-title">能力从底层分布，<br />在交付端汇流。</h2>
      <p>starter 提供可被宿主覆盖的基础能力，admin 组装业务逻辑，admin-ui 通过接口与动态路由呈现。右侧是 starter 缓存模块的真实装配代码——宿主声明同名 Bean 时默认实现自动让位。</p>
      <a href="/architecture" class="text-link">阅读架构边界 <span aria-hidden="true">→</span></a>
    </div>
    <div class="architecture-map-wrap">
      <div class="code-panel__bar"><span>CacheAutoConfiguration.java</span><span>ypbin-starter-cache</span></div>
      <div class="architecture-code"><div v-html="codeHtml" /><span class="code-cursor" aria-hidden="true" /></div>
    </div>
  </section>
</template>
