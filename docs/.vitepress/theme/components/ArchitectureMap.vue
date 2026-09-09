<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { codeToHtml } from 'shiki'
import { useIsEn } from '../composables/useIsEn'

const isEn = useIsEn()

const snippetZh = `@Bean
@ConditionalOnMissingBean(name = "redisTemplate")
public RedisTemplate<String, Object> redisTemplate(
    RedisConnectionFactory connectionFactory,
    ObjectProvider<ObjectMapper> objectMapperProvider) {
  // 宿主声明同名 Bean 时，这里自动让位
  RedisTemplate<String, Object> template = new RedisTemplate<>();
  template.setConnectionFactory(connectionFactory);
  return template;
}`

const snippetEn = `@Bean
@ConditionalOnMissingBean(name = "redisTemplate")
public RedisTemplate<String, Object> redisTemplate(
    RedisConnectionFactory connectionFactory,
    ObjectProvider<ObjectMapper> objectMapperProvider) {
  // When the host declares a Bean of the same name, this default steps aside
  RedisTemplate<String, Object> template = new RedisTemplate<>();
  template.setConnectionFactory(connectionFactory);
  return template;
}`

const snippet = computed(() => (isEn.value ? snippetEn : snippetZh))
const codeHtml = ref('')

const t = computed(() =>
  isEn.value
    ? {
        titleHead: 'Capabilities spread across the layers,',
        titleTail: 'converging at the delivery end.',
        desc: 'The starter provides base capabilities the host can override; admin assembles the business logic; admin-ui presents it through APIs and dynamic routes. On the right is real auto-configuration code from the starter cache module — when the host declares a Bean of the same name, the default implementation steps aside automatically.',
        linkText: 'Read the architecture boundaries',
        linkHref: '/en/architecture'
      }
    : {
        titleHead: '能力从底层分布，',
        titleTail: '在交付端汇流。',
        desc: 'starter 提供可被宿主覆盖的基础能力，admin 组装业务逻辑，admin-ui 通过接口与动态路由呈现。右侧是 starter 缓存模块的真实装配代码——宿主声明同名 Bean 时默认实现自动让位。',
        linkText: '阅读架构边界',
        linkHref: '/architecture'
      }
)

let mounted = false
let highlightSeq = 0

async function renderCode() {
  const seq = ++highlightSeq
  const html = await codeToHtml(snippet.value, { lang: 'java', theme: 'github-dark' })
  if (seq === highlightSeq) codeHtml.value = html
}

onMounted(() => {
  mounted = true
  renderCode()
})

// 首页在 zh ↔ en 之间 SPA 切换时组件可能复用：语言变化后重新高亮代码（含代码注释文案）
watch(isEn, () => {
  if (mounted) renderCode()
})

onUnmounted(() => {
  mounted = false
  highlightSeq++
})
</script>

<template>
  <section class="architecture-section" aria-labelledby="architecture-title">
    <div class="architecture-intro">
      <h2 id="architecture-title">{{ t.titleHead }}<br />{{ t.titleTail }}</h2>
      <p>{{ t.desc }}</p>
      <a :href="t.linkHref" class="text-link">{{ t.linkText }} <span aria-hidden="true">→</span></a>
    </div>
    <div class="architecture-map-wrap">
      <div class="code-panel__bar"><span>CacheAutoConfiguration.java</span><span>ypbin-starter-cache</span></div>
      <div class="architecture-code"><div v-html="codeHtml" /><span class="code-cursor" aria-hidden="true" /></div>
    </div>
  </section>
</template>
