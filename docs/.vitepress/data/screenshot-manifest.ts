export interface ScreenshotEntry {
  id: string
  product: 'starter' | 'admin' | 'admin-ui'
  repository: string
  scene: string
  route?: string
  viewport: { width: number; height: number }
  fixture: string
  output: string
  status: 'planned' | 'captured' | 'verified'
}

const adminUiScenes = [
  ['login', '真实认证入口', '/auth/login'],
  ['dashboard', '真实运行概览', '/dashboard/analytics'],
  ['roles', '真实角色权限管理', '/system/role'],
  ['menus', '真实动态菜单管理', '/system/menu'],
  ['jobs', '真实定时任务管理', '/system/job'],
  ['licenses', '真实商业授权管理', '/system/license']
] as const

export const screenshotManifest: readonly ScreenshotEntry[] = adminUiScenes.map(
  ([id, scene, route]) => ({
    id: `admin-ui-${id}`,
    product: 'admin-ui',
    repository: 'wenbin-wb/ypbin-admin-ui',
    scene,
    route,
    viewport: { width: 1440, height: 900 },
    fixture: 'tests/fixtures/screenshots/admin-ui.json',
    output: `docs/public/screenshots/admin-ui/${id}.webp`,
    status: 'verified'
  })
)
