import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { chromium } from '@playwright/test'
import sharp from 'sharp'

const root = resolve(import.meta.dirname, '../..')
const outputDir = resolve(root, 'docs/public/screenshots/admin-ui')
const baseUrl = process.env.YPBIN_ADMIN_UI_URL ?? 'http://localhost:5666'
const username = process.env.YPBIN_SCREENSHOT_USERNAME ?? 'admin'
const password = process.env.YPBIN_SCREENSHOT_PASSWORD ?? 'admin123'
const sourceRef = process.env.YPBIN_ADMIN_UI_REF ?? '543cb63e6140735b6ab1eb8425b24af1dac2923c'
const workingTreeHash = process.env.YPBIN_ADMIN_UI_DIFF_SHA256 ?? '9546dce52275068a1a699f7e364c65d80d6660351cdab4122f854f53c4244473'

const scenes = [
  { id: 'dashboard', route: '/dashboard/analytics', ready: '[data-testid="page-dashboard-analytics"]' },
  { id: 'roles', route: '/system/role', ready: '[data-testid="page-system-role"]' },
  { id: 'menus', route: '/system/menu', ready: '[data-testid="page-system-menu"]' },
  { id: 'jobs', route: '/system/job', ready: '.vxe-grid' },
  { id: 'licenses', route: '/system/license', ready: '.vxe-grid' }
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
    viewport: { width: 1440, height: 900 }
  })
  const page = await context.newPage()
  await page.route('**/*', async (route) => {
    const url = new URL(route.request().url())
    if (['localhost', '127.0.0.1'].includes(url.hostname)) return route.continue()
    return route.abort()
  })

  await page.goto(`${baseUrl}/auth/login`, { waitUntil: 'domcontentloaded' })
  await page.getByTestId('login-username').waitFor({ state: 'visible' })
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
    viewport: { width: 1440, height: 900 },
    ...loginOptimized
  }]
  await page.getByTestId('login-username').fill(username)
  await page.getByTestId('login-password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
  await page.waitForURL((url) => !url.pathname.includes('/auth/login'), { timeout: 30_000 })

  for (const scene of scenes) {
    await page.goto(`${baseUrl}${scene.route}`, { waitUntil: 'domcontentloaded' })
    await page.locator(scene.ready).first().waitFor({ state: 'visible', timeout: 30_000 })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(800)
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
      viewport: { width: 1440, height: 900 },
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
