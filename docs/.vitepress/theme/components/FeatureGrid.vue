<script setup lang="ts">
import { computed } from 'vue'
import { useIsEn } from '../composables/useIsEn'

const isEn = useIsEn()

interface FeatureGroup {
  name: string
  desc: string
  items: string[]
}

const zhGroups: FeatureGroup[] = [
  {
    name: '开箱即用的后台',
    desc: '一个管理系统的完整骨架，不是玩具。',
    items: ['RBAC 用户/角色/部门/岗位/菜单', '多租户行级隔离 + 权限模板', '数据权限注解驱动', '在线用户 / 操作日志 / 字典 / 参数']
  },
  {
    name: '业务安全内建',
    desc: '生产安全要求，默认就位。',
    items: ['登录防爆破（账号 + IP 双维锁定）', '接口签名防重放、字段加密、数据脱敏', 'XSS 过滤、行为验证码、第三方登录', 'License 商业授权（国密 SM2/SM4 签发）']
  },
  {
    name: '性能与可靠性',
    desc: '缓存、并发、日志的坑，替你设计好。',
    items: ['多级缓存（Caffeine + Redis）三重防护', '限流 / 幂等 Redis+Lua 原子实现', '异步日志落库、动态定时任务', '接口引用翻译序列化期零 N+1']
  },
  {
    name: 'AI 与消息',
    desc: '新时代的业务能力，开箱即用。',
    items: ['AI 对话：模型配置表驱动、SSE 流式', '多轮记忆持久化、用量统计', '站内信 SSE 实时推送', '通知公告富文本定时发布']
  }
]

const enGroups: FeatureGroup[] = [
  {
    name: 'A backend that works out of the box',
    desc: 'The complete skeleton of a management system — not a toy.',
    items: [
      'RBAC users / roles / departments / positions / menus',
      'Multi-tenant row-level isolation + permission templates',
      'Annotation-driven data permission',
      'Online users / operation logs / dictionaries / parameters'
    ]
  },
  {
    name: 'Business security built in',
    desc: 'Production security requirements on by default.',
    items: [
      'Login brute-force protection (account + IP dual-dimension lockout)',
      'Anti-replay API signing, field encryption, data masking',
      'XSS filtering, behavioral captcha, social sign-in',
      'Commercial license signing (national crypto SM2/SM4)'
    ]
  },
  {
    name: 'Performance and reliability',
    desc: 'Cache, concurrency and logging pitfalls designed out.',
    items: [
      'Multi-level cache (Caffeine + Redis) with triple protection',
      'Rate limiting / idempotency as atomic Redis + Lua',
      'Async log persistence, dynamic scheduled jobs',
      'Zero-N+1 reference translation at serialization time'
    ]
  },
  {
    name: 'AI and messaging',
    desc: 'Modern business capabilities, ready to use.',
    items: [
      'AI chat: model-configuration-table driven, SSE streaming',
      'Multi-turn memory persistence, usage accounting',
      'In-site messages pushed over SSE in real time',
      'Rich-text notice and announcement scheduling'
    ]
  }
]

const t = computed(() =>
  isEn.value
    ? {
        kicker: 'Capability landscape',
        title: 'Everything you need — pick on demand.',
        desc: 'One foundation (ypbin-starter), one admin backend (ypbin-admin) and one frontend (ypbin-admin-ui): three layers, 36 independently published Maven modules. Import only what you use — unused modules never touch the classpath.',
        linkText: 'View the layered starter capability map',
        linkHref: '/en/products/starter',
        groups: enGroups
      }
    : {
        kicker: '能力全景',
        title: '你要的都有，按需取用。',
        desc: '一个地基（ypbin-starter）、一套后台（ypbin-admin）与一个前端（ypbin-admin-ui），三层边界、36 个 Maven 模块独立发布：用哪个引哪个，用不到的模块不进 classpath。',
        linkText: '查看 starter 分层能力图谱',
        linkHref: '/products/starter',
        groups: zhGroups
      }
)
</script>

<template>
  <section class="home-section feature-section" aria-labelledby="feature-title">
    <div class="section-heading">
      <p class="section-kicker">{{ t.kicker }}</p>
      <h2 id="feature-title">{{ t.title }}</h2>
      <p>{{ t.desc }}</p>
    </div>
    <div class="feature-grid">
      <article v-for="g in t.groups" :key="g.name" class="feature-card">
        <h3>{{ g.name }}</h3>
        <p class="feature-card__desc">{{ g.desc }}</p>
        <ul>
          <li v-for="item in g.items" :key="item">{{ item }}</li>
        </ul>
      </article>
    </div>
    <a class="text-link" :href="t.linkHref">{{ t.linkText }} <span aria-hidden="true">→</span></a>
  </section>
</template>
