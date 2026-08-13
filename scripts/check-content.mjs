import { readdir, readFile } from 'node:fs/promises'
import { extname, join, relative, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const scanRoots = ['docs', 'README.md']
const extensions = new Set(['.md', '.vue', '.ts', '.css', '.html', '.svg'])
const violations = []
const rules = [
  { name: '外部字体或 CDN', pattern: /(?:fonts\.(?:googleapis|gstatic)\.com|cdn\.jsdelivr\.net|unpkg\.com)/i, referenceAllowed: true },
  { name: '禁止的 UI 依赖', pattern: /(?:@vben\/|tailwindcss|pinia|ant-design-vue)/i, referenceAllowed: true },
  { name: '未经证实的 SLA', pattern: /(?:99\.9+%\s*(?:SLA|可用性)|企业级 SLA|零停机保证)/i },
  { name: '未经证实的客户或规模指标', pattern: /(?:服务超过\s*\d+\s*(?:客户|企业)|已有\s*\d+\s*(?:客户|企业)|每秒处理\s*\d+)/i },
  { name: '虚构产品截图引用', pattern: /screenshots\/(?:mock|fake|placeholder)[^\s)'\"]*\.(?:png|jpe?g|webp)/i },
  { name: '未经证实的 admin 可观测性声明', pattern: /admin\s*(?:已经|已)\s*(?:接入|集成).{0,20}(?:actuator|observability)/i }
]

async function collect(path) {
  const normalized = path.replaceAll('\\', '/')
  if (
    normalized.includes('/docs/.vitepress/dist') ||
    normalized.includes('/docs/.vitepress/cache')
  ) {
    return []
  }
  const stat = await import('node:fs/promises').then(({ stat }) => stat(path))
  if (stat.isFile()) return [path]
  const entries = await readdir(path, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map((entry) => collect(join(path, entry.name))),
  )
  return nested.flat()
}

for (const target of scanRoots) {
  for (const file of await collect(resolve(root, target))) {
    if (!extensions.has(extname(file))) continue
    const content = await readFile(file, 'utf8')
    const filePath = relative(root, file)
    // 配置参考与 admin/admin-ui 文档涉及技术栈与部署,豁免"引用类"规则
    const isReferenceAllowed = /(?:docs[\\/]guide[\\/]config[\\/]|docs[\\/]guide[\\/]admin-ui[\\/]|docs[\\/]guide[\\/]admin[\\/])/.test(filePath)
    for (const rule of rules) {
      if (rule.referenceAllowed && isReferenceAllowed) continue
      if (rule.pattern.test(content)) violations.push(`${filePath}: ${rule.name}`)
    }
  }
}

if (violations.length > 0) {
  console.error(violations.join('\n'))
  process.exit(1)
}

console.log('Content scan passed.')
