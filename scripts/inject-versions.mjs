import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

/**
 * 版本注入脚本（构建期临时注入 + 事后还原）。
 *
 * 文档源文件永远保留 `@STARTER_VERSION@` / `@ADMIN_VERSION@` / `@ADMIN_UI_VERSION@`
 * 占位符（保证可重复注入）；本脚本在构建前把占位符替换为 releases.json 中的真实版本，
 * 构建结束后把源文件还原为占位符。releases.json 是唯一事实源，由发布流水线自动更新。
 *
 * 用法：`node scripts/inject-versions.mjs inject`（构建前） / `restore`（构建后）
 */
const root = resolve(import.meta.dirname, '..')
const mode = process.argv[2] ?? 'inject'

const releases = JSON.parse(
  await readFile(resolve(root, 'docs/.vitepress/data/releases.json'), 'utf8'),
)

const targets = [
  'docs/guide/starter/index.md',
  'docs/guide/starter/modules/index.md',
  'docs/guide/admin/index.md',
  'docs/products/starter.md',
  'docs/products/admin.md',
  'docs/guide/compatibility.md',
  'docs/architecture.md',
  'docs/guide/faq.md',
]

/** releases.md 特殊：仅「版本状态」顶表（前 16 行）参与注入，历史条目保留真实版本号不漂移 */
const RELEASES_HEADER_LINES = 16
const releasesFile = 'docs/releases.md'

const mapping = {
  '@STARTER_VERSION@': releases.starter,
  '@ADMIN_VERSION@': releases.admin,
  '@ADMIN_UI_VERSION@': releases.adminUi,
}

let total = 0
for (const target of targets) {
  const file = resolve(root, target)
  let content = await readFile(file, 'utf8')
  for (const [token, value] of Object.entries(mapping)) {
    const [from, to] = mode === 'inject' ? [token, value] : [value, token]
    const count = (content.match(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) ?? []).length
    if (count > 0) {
      content = content.split(from).join(to)
      total += count
    }
  }
  await writeFile(file, content)
}

// releases.md：仅顶表参与注入，避免历史条目标题被占位符漂移
{
  const file = resolve(root, releasesFile)
  const lines = (await readFile(file, 'utf8')).split('\n')
  let header = lines.slice(0, RELEASES_HEADER_LINES).join('\n')
  for (const [token, value] of Object.entries(mapping)) {
    const [from, to] = mode === 'inject' ? [token, value] : [value, token]
    const count = (header.match(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) ?? []).length
    if (count > 0) {
      header = header.split(from).join(to)
      total += count
    }
  }
  const rest = lines.slice(RELEASES_HEADER_LINES).join('\n')
  await writeFile(file, header + '\n' + rest)
}
console.log(`[docs:version] ${mode === 'inject' ? '注入' : '还原'}版本完成：${total} 处（starter=${releases.starter}）`)
