<script setup lang="ts">
const groups = [
  {
    name: '开箱即用的后台',
    desc: '一个管理系统的完整骨架，不是玩具。',
    items: ['RBAC 用户/角色/部门/岗位/菜单', '多租户行级隔离 + 权限模板', '数据权限注解驱动', '在线用户 / 操作日志 / 字典 / 参数']
  },
  {
    name: '业务安全内建',
    desc: '生产安全要求，默认就位。',
    items: ['登录防爆破（错误锁定 + 有效期）', '接口签名防重放、字段加密、数据脱敏', 'XSS 过滤、验证码、第三方登录', 'License 商业授权（国密签发）']
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
</script>

<template>
  <section class="home-section feature-section" aria-labelledby="feature-title">
    <div class="section-heading">
      <p class="section-kicker">能力全景</p>
      <h2 id="feature-title">你要的都有，按需取用。</h2>
      <p>不绑死全家桶——35 个模块独立发布，用哪个引哪个，用不到的模块不进 classpath。</p>
    </div>
    <div class="feature-grid">
      <article v-for="g in groups" :key="g.name" class="feature-card">
        <h3>{{ g.name }}</h3>
        <p class="feature-card__desc">{{ g.desc }}</p>
        <ul>
          <li v-for="item in g.items" :key="item">{{ item }}</li>
        </ul>
      </article>
    </div>
  </section>
</template>
