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

export interface TrustStat {
  value: string
  label: string
}

export interface CapabilityLayer {
  id: string
  name: string
  description: string
  modules: readonly string[]
}

export interface RoadmapItem {
  id: 'starter' | 'admin' | 'admin-ui'
  label: string
  item: string
  scope: string
}

export const sourceManifest = {
  verifiedAt: '2026-08-29',
  stableStarterVersion: '1.4.1',
  trustStats: [
    { value: '35', label: 'Maven 模块 · starter' },
    { value: '479', label: 'Java 源文件 · starter' },
    { value: '104', label: '单元测试类 · starter' },
    { value: '765', label: 'Vue 组件 · admin-ui' }
  ] satisfies readonly TrustStat[],
  capabilityLayers: [
    {
      id: 'base',
      name: '基础能力层',
      description: '不依赖 Spring Cloud 的 L1 能力，单体即可用：Web、JSON、数据、缓存、安全、存储、日志与平台能力。',
      modules: ['core', 'json', 'web', 'data', 'cache', 'security', 'api-doc', 'storage', 'log', 'tools', 'excel', 'captcha', 'messaging', 'sensitive-words', 'i18n', 'api-crypto', 'social', 'sign', 'async', 'job', 'license', 'ai']
    },
    {
      id: 'extension',
      name: '业务骨架层',
      description: '在基础能力上叠加的通用骨架，为业务系统提供可直接继承的分页 CRUD、租户与数据权限。',
      modules: ['extension-crud', 'extension-tenant', 'extension-datapermission']
    },
    {
      id: 'cloud',
      name: '微服务层',
      description: '面向 Spring Cloud 的分布式能力：注册与配置、负载均衡、限流熔断、网关与可观测性。',
      modules: ['cloud-core', 'cloud-nacos', 'cloud-loadbalancer', 'cloud-sentinel', 'cloud-gateway', 'cloud-observability']
    },
    {
      id: 'aggregate',
      name: '聚合与版本',
      description: 'BOM 与依赖统一版本管理，app-web / app-cloud 起步聚合让整套能力开箱即用。',
      modules: ['bom', 'dependencies', 'app-web', 'app-cloud']
    }
  ] satisfies readonly CapabilityLayer[],
  roadmap: [
    { id: 'starter', label: 'ypbin-starter', item: '1.4.1 已发布（Jackson 3 序列化修复）；下一版聚焦 AI 与云模块打磨', scope: '能力模块扩展' },
    { id: 'admin', label: 'ypbin-admin', item: '通知推送链：站内信与 SSE 推送打通', scope: '消息链路' },
    { id: 'admin-ui', label: 'ypbin-admin-ui', item: '管理页打磨：表单弹层契约与品牌统一', scope: '前端体验' }
  ] satisfies readonly RoadmapItem[],
  products: [
    {
      id: 'starter',
      name: 'ypbin-starter',
      description: '面向 Spring Boot 的系统级基础能力集合。',
      version: '1.4.1',
      status: 'stable',
      runtime: 'Java 21 · Spring Boot 4.1.0',
      scaleLabel: '35 模块 · 479 类 · 104 测试',
      facts: ['稳定版 v1.4.1 已发布', '35 个 Maven 模块', 'Apache-2.0 开源协议']
    },
    {
      id: 'admin',
      name: 'ypbin-admin',
      description: '基于 starter 组装的企业级后台服务。',
      version: '1.0.0-SNAPSHOT',
      status: 'development',
      runtime: 'Java 21 · Spring Boot 4.1.0',
      scaleLabel: '330 类 · 38 张业务表（28 基础 + 10 AI）',
      facts: ['依赖 starter 1.4.1', '3 个 Maven 模块', 'RBAC / 多租户 / 定时任务']
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
