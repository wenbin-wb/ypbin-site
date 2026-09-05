export type ProductStatus = 'stable' | 'development' | 'private'

export interface ProductFact {
  id: 'starter' | 'admin' | 'admin-ui'
  name: string
  description: string
  version: string
  status: ProductStatus
  runtime: string
  scaleLabel: string
  facts: readonly string[]
}

export interface RoadmapItem {
  id: 'starter' | 'admin' | 'admin-ui'
  label: string
  item: string
  scope: string
}

export const sourceManifest = {
  verifiedAt: '2026-09-05',
  stableStarterVersion: '2.2.0',
  roadmap: [
    { id: 'starter', label: 'ypbin-starter', item: '2.2.0 已发布（新增 XXL-JOB 执行器接入壳 ypbin-starter-xxljob）', scope: '任务调度' },
    { id: 'admin', label: 'ypbin-admin', item: '任务调度迁 XXL-JOB：main/boot 退役自研 sys_job，接 xxl-job-admin 统一调度', scope: '任务调度' },
    { id: 'admin-ui', label: 'ypbin-admin-ui', item: '任务管理页迁 xxl-job-admin 控制台，移除自研任务模块', scope: '任务调度' }
  ] satisfies readonly RoadmapItem[],
  products: [
    {
      id: 'starter',
      name: 'ypbin-starter',
      description: '面向 Spring Boot 的系统级基础能力集合。',
      version: '2.2.0',
      status: 'stable',
      runtime: 'Java 21 · Spring Boot 4.1.0',
      scaleLabel: '36 模块 · 544 类 · 166 测试',
      facts: ['稳定版 v2.2.0 已发布', '36 个 Maven 模块（含 XXL-JOB 接入壳）', 'Apache-2.0 开源协议']
    },
    {
      id: 'admin',
      name: 'ypbin-admin',
      description: '基于 starter 组装的企业级后台服务。',
      version: '1.0.0-SNAPSHOT',
      status: 'development',
      runtime: 'Java 21 · Spring Boot 4.1.0',
      scaleLabel: '330 类 · 38 张业务表（28 基础 + 10 AI）',
      facts: ['依赖 starter 2.2.0', '微服务形态：common/gateway/auth/service + xxl-job-admin 调度', 'RBAC / 多租户 / XXL-JOB 任务调度']
    },
    {
      id: 'admin-ui',
      name: 'ypbin-admin-ui',
      description: '由后端动态路由驱动的 Vue 3 管理前端。',
      version: '5.7.0',
      status: 'private',
      runtime: 'Vue 3 · TypeScript',
      scaleLabel: '765 组件 · 18 业务模块',
      facts: ['与 admin 接口配套', '后端动态路由驱动', '私有部署，不对外分发']
    }
  ] satisfies readonly ProductFact[]
} as const

export const getProduct = (id: ProductFact['id']) =>
  sourceManifest.products.find((product) => product.id === id)
