<script setup lang="ts">
const reasons = [
  {
    title: '难做对的地方，替你做对',
    desc: '缓存击穿/穿透/雪崩三重防护、序列化期零 N+1 的引用翻译、密码错误锁定的 TTL 竞态、接口签名的时钟偏移与重放窗口——这些容易埋雷的细节全部内建，并经过对抗性审查。',
    tag: '细节即质量'
  },
  {
    title: '把正确的做法，设成唯一的做法',
    desc: '扩展点强制批量收一组 ID、返回映射，业务方想写出 N+1 都难；列表翻译由切面在序列化前自动预加载，业务代码零改动。数据权限只拦显式标注的方法，边界清晰可预期。',
    tag: '消灭 N+1'
  },
  {
    title: '能力即插即拔，随时被接管',
    desc: '所有能力 Bean 一律 @ConditionalOnMissingBean + @ConditionalOnProperty：定义同类型 Bean 即覆盖默认实现，改一行配置就关停整个模块。starter 给抽象与默认，业务按需注入自己的实现。',
    tag: '可扩展'
  },
  {
    title: '好的框架，知道拒绝什么',
    desc: '认证选 Sa-Token 而非自研 JWT 或过重的 Spring Security；业务异常统一 HTTP 200 + R.code，而非状态码语义混乱；starter 只给运行时与扩展点、不碰业务表，升级不动业务数据。',
    tag: '设计取舍'
  }
]
</script>

<template>
  <section class="home-section why-section" aria-labelledby="why-title">
    <div class="section-heading">
      <p class="section-kicker">为什么是 ypbin</p>
      <h2 id="why-title">不是又一个脚手架，<br />是把坑填平的地基。</h2>
      <p>每个决策都有取舍依据，每个默认值都选生产安全的一侧。要的不是「能跑」，是「跑得对」。</p>
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
