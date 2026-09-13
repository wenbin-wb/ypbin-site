import releases from './releases.json'

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
  verifiedAt: '2026-09-13',
  // 版本号统一取自 releases.json（发布流水线自动更新），避免与文档注入源两处漂移
  stableStarterVersion: releases.starter,
  roadmap: [
    { id: 'starter', label: 'ypbin-starter', item: `v${releases.starter} 已发布：Jackson 3 全面对齐、Spring Boot 4.1 / Spring Framework 7 基线、脚手架工程化能力与租户 fail-closed 安全加固`, scope: '已发布' },
    { id: 'admin', label: 'ypbin-admin', item: '微服务 main 形态主线：服务短名路由、网关身份头签名、/internal/** 令牌守卫、.env 随机化一键部署', scope: releases.admin },
    { id: 'admin-ui', label: 'ypbin-admin-ui', item: `web-antd v${releases.adminUi}：文件下载/导入基础设施与状态过滤、权限码契约随 admin 演进`, scope: '私有工作区' }
  ] satisfies readonly RoadmapItem[],
  products: [
    {
      id: 'starter',
      name: 'ypbin-starter',
      description: '面向 Spring Boot 的系统级基础能力集合。',
      version: releases.starter,
      status: 'stable',
      runtime: 'Java 21 · Spring Boot 4.1.0',
      scaleLabel: '38 模块 · 594 Java 源文件 · 181 测试',
      facts: [`稳定版 v${releases.starter} 已发布`, '38 个 Maven 模块（含 XXL-JOB 接入壳与架构约束测试模块）', 'Apache-2.0 开源协议']
    },
    {
      id: 'admin',
      name: 'ypbin-admin',
      description: '基于 starter 组装的企业级后台服务。',
      version: releases.admin,
      status: 'development',
      runtime: 'Java 21 · Spring Boot 4.1.0',
      scaleLabel: '330 类 · 38 张业务表（28 基础 + 10 AI）',
      facts: [`依赖 starter ${releases.starter}`, '微服务形态：common/gateway/auth/service + xxl-job-admin 调度', 'URL 第一段=服务短名，网关统一剥前缀']
    },
    {
      id: 'admin-ui',
      name: 'ypbin-admin-ui',
      description: '由后端动态路由驱动的 Vue 3 管理前端。',
      version: releases.adminUi,
      status: 'private',
      runtime: 'Vue 3 · TypeScript',
      scaleLabel: '765 组件 · 18 业务模块',
      facts: ['与 admin 接口配套', '后端动态路由驱动', '私有部署，不对外分发']
    }
  ] satisfies readonly ProductFact[]
} as const

export const getProduct = (id: ProductFact['id']) =>
  sourceManifest.products.find((product) => product.id === id)
