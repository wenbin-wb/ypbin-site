import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { chromium } from '@playwright/test'
import sharp from 'sharp'

const root = resolve(import.meta.dirname, '../..')
const outputDir = resolve(root, 'docs/public/screenshots/admin-ui')
const baseUrl = process.env.YPBIN_ADMIN_UI_URL ?? 'http://localhost:5666'
const allowedHostname = new URL(baseUrl).hostname
const username = process.env.YPBIN_SCREENSHOT_USERNAME ?? 'admin'
const password = process.env.YPBIN_SCREENSHOT_PASSWORD ?? 'pt5aQ5E6t8dkVkMp'
const sourceRef = process.env.YPBIN_ADMIN_UI_REF ?? '543cb63e6140735b6ab1eb8425b24af1dac2923c'
const workingTreeHash = process.env.YPBIN_ADMIN_UI_DIFF_SHA256 ?? '9546dce52275068a1a699f7e364c65d80d6660351cdab4122f854f53c4244473'

// 数据就绪信号:vxe 表格 loading 消失且已有数据行(表格页通用)
const tableSettled = `(() => {
  if (document.querySelector('.vxe-loading, .vxe-icon-spinner')) return false
  return document.querySelectorAll('.vxe-body--row').length > 0
})()`
// dashboard:图表 canvas 已渲染即认为数据完成(假数据卡片先于图表出现)
const dashSettled = `(() => !!document.querySelector('canvas'))()`

const scenes = [
  { id: 'dashboard', route: '/dashboard/analytics', ready: 'text=总用户量', settled: dashSettled },
  { id: 'roles', route: '/system/role', ready: '[data-testid="page-system-role"]', settled: tableSettled },
  { id: 'menus', route: '/system/menu', ready: '[data-testid="page-system-menu"]', settled: tableSettled },
  { id: 'jobs', route: '/system/job', ready: '.vxe-grid', settled: tableSettled },
  { id: 'licenses', route: '/system/license', ready: '.vxe-grid', settled: tableSettled }
]

async function optimizeImage(id, suffix, pngBytes) {
  const webpFile = resolve(outputDir, `${id}${suffix}.webp`)
  await sharp(pngBytes).webp({ effort: 6, quality: 82 }).toFile(webpFile)
  const webpBytes = await readFile(webpFile)
  return {
    webpPath: `screenshots/admin-ui/${id}${suffix}.webp`,
    webpSha256: createHash('sha256').update(webpBytes).digest('hex'),
    webpSize: webpBytes.length
  }
}

async function captureTheme(browser, suffix, colorScheme) {
  const context = await browser.newContext({
    colorScheme,
    deviceScaleFactor: 1,
    locale: 'zh-CN',
    reducedMotion: 'reduce',
    timezoneId: 'Asia/Shanghai',
    viewport: { width: 2560, height: 1440 }
  })
  const page = await context.newPage()
  await page.route('**/*', async (route) => {
    const url = new URL(route.request().url())
    if (['localhost', '127.0.0.1', allowedHostname].includes(url.hostname)) return route.continue()
    return route.abort()
  })

  await page.goto(`${baseUrl}/#/auth/login`, { waitUntil: 'domcontentloaded' })
  await page.getByTestId('login-username').waitFor({ state: 'visible' })
  // vben 默认主题是深色(theme.mode:'dark'),colorScheme 不会驱动它;
  // 修改 localStorage 的 <namespace>-preferences 里的 theme.mode 并重载,按目标主题强制浅色/深色
  const themeMode = colorScheme === 'dark' ? 'dark' : 'light'
  await page.evaluate((mode) => {
    const key = Object.keys(localStorage).find((k) => k.endsWith('-preferences'))
    if (key) {
      try {
        const data = JSON.parse(localStorage.getItem(key))
        if (data && data.value && data.value.theme) {
          data.value.theme.mode = mode
          localStorage.setItem(key, JSON.stringify(data))
        }
      } catch {
        // 缓存结构异常时忽略,保持默认主题
      }
    }
  }, themeMode)
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.getByTestId('login-username').waitFor({ state: 'visible' })
  // 等待登录页入场动画完成(enter-x 元素不透明),避免截到半透明加载态
  await page.waitForFunction(
    () => {
      const nodes = [...document.querySelectorAll('[class*="enter-x"]')]
      return nodes.length === 0 || nodes.every((n) => Number.parseFloat(getComputedStyle(n).opacity) >= 0.99)
    },
    { timeout: 10_000 },
  )
  await page.waitForTimeout(500)
  const loginFile = resolve(outputDir, `login${suffix}.png`)
  await page.screenshot({ path: loginFile, fullPage: false })
  const loginBytes = await readFile(loginFile)
  const loginOptimized = await optimizeImage('login', suffix, loginBytes)
  const images = [{
    id: `login${suffix}`,
    path: `screenshots/admin-ui/login${suffix}.png`,
    route: '/auth/login',
    theme: colorScheme,
    sha256: createHash('sha256').update(loginBytes).digest('hex'),
    size: loginBytes.length,
    viewport: { width: 2560, height: 1440 },
    ...loginOptimized
  }]
  await page.getByTestId('login-username').fill(username)
  await page.getByTestId('login-password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
  // 生产为 hash 路由:登录成功后跳转默认首页(默认已改为 /system/user),pathname 保持初始不变
  await page.waitForURL((url) => url.hash.includes('/system/user'), { timeout: 30_000 })

  // 预热:生产环境首次访问较慢(后端冷启动/慢查询),先空跑一遍让接口与静态资源就绪
  for (const scene of scenes) {
    await page.goto(`${baseUrl}/#${scene.route}`, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(500)
  }

  for (const scene of scenes) {
    console.error(`[capture] ${colorScheme || 'light'} ${scene.id} ${scene.route}`)
    await page.goto(`${baseUrl}/#${scene.route}`, { waitUntil: 'domcontentloaded' })
    await page.locator(scene.ready).first().waitFor({ state: 'visible', timeout: 30_000 })
    // 等待数据真正渲染完成(表格 loading 消失且出现数据行 / 图表 canvas 出现),避免截到加载态
    await page.waitForFunction(scene.settled, { timeout: 45_000 })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(1500)
    const file = resolve(outputDir, `${scene.id}${suffix}.png`)
    await page.screenshot({ path: file, fullPage: false })
    const bytes = await readFile(file)
    const optimized = await optimizeImage(scene.id, suffix, bytes)
    images.push({
      id: `${scene.id}${suffix}`,
      path: `screenshots/admin-ui/${scene.id}${suffix}.png`,
      route: scene.route,
      theme: colorScheme,
      sha256: createHash('sha256').update(bytes).digest('hex'),
      size: bytes.length,
      viewport: { width: 2560, height: 1440 },
      ...optimized
    })
  }

  await context.close()
  return images
}

await mkdir(outputDir, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const light = await captureTheme(browser, '', 'light')
const dark = await captureTheme(browser, '-dark', 'dark')
await browser.close()

const capturedAt = new Date().toISOString()
const artifactManifest = {
  schemaVersion: 1,
  capturedAt,
  sourceRepository: 'wenbin-wb/ypbin-admin-ui',
  sourceRef,
  workingTreeHash,
  environment: 'local-real-stack',
  redactions: ['tokens', 'personal-data', 'internal-hosts'],
  images: [...light, ...dark]
}
await writeFile(
  resolve(outputDir, 'manifest.json'),
  `${JSON.stringify(artifactManifest, null, 2)}\n`,
)
await writeFile(
  resolve(root, 'tests/fixtures/screenshots/admin-ui.json'),
  `${JSON.stringify({
    schemaVersion: 1,
    product: 'admin-ui',
    sourceRepository: 'wenbin-wb/ypbin-admin-ui',
    sourceRef,
    capturedAt,
    environment: 'local-real-stack',
    seedProfile: 'V2-development-seed',
    redactions: ['tokens', 'personal-data', 'internal-hosts'],
    artifactManifest: 'docs/public/screenshots/admin-ui/manifest.json',
    status: 'verified'
  }, null, 2)}\n`,
)
console.log(`Captured ${light.length + dark.length} screenshots (light + dark).`)
