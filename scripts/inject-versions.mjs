import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

/**
 * 版本注入脚本：把文档中的 `@STARTER_VERSION@` / `@ADMIN_VERSION@` / `@ADMIN_UI_VERSION@`
 * 占位符替换为 releases.json（唯一事实源，由 starter 发布流水线自动更新）中的真实版本。
 *
 * 占位符用于文档正文无法用组件 props 覆盖的场景；VersionScope/StatusBadge 等组件
 * 直接读 releases.json，二者保持同一数据源。
 */
const root = resolve(import.meta.dirname, '..')
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
  'docs/releases.md',
]

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
    const count = (content.match(new RegExp(token, 'g')) ?? []).length
    if (count > 0) {
      content = content.split(token).join(value)
      total += count
    }
  }
  await writeFile(file, content)
}
console.log(`[docs:version] 注入版本完成：${total} 处（starter=${releases.starter} admin=${releases.admin} admin-ui=${releases.adminUi}）`)
