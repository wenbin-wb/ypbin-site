import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const generated = resolve(root, 'scripts/generated')
const output = resolve(root, 'docs/guide/config')
await mkdir(output, { recursive: true })

const stringify = (value) => value == null ? '—' : Array.isArray(value) ? value.join(' / ') || '—' : typeof value === 'object' ? JSON.stringify(value) : String(value)
const esc = (value) => stringify(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('://', '&#58;//')
  .replaceAll('|', '\\|')
  .replaceAll('*', '&#42;')
  .replaceAll('_', '&#95;')
  .replaceAll('\n', '<br>')
const shortSource = (source) => {
  const path = source.path ?? ''
  const base = path.split(/[\\/]/).pop() || path
  return `${base}:${source.line ?? source.lines ?? ''}`
}
const sourceLine = (entry) => (entry.sources ?? []).map((s) => esc(shortSource(s))).join(' · ')

function table(entries) {
  return ['| 配置项 | 默认值 | 说明 |','|---|---|---|',...entries.map((entry) => {
    const key = `\`${esc(entry.key)}\``
    const meta = [esc(entry.type), sourceLine(entry)].filter(Boolean).join(' · ')
    const configCell = meta ? `${key}<br><span class="cfg-src">${meta}</span>` : key
    const required = entry.requiredWhen
      ? (String(entry.requiredWhen).startsWith('可选') ? esc(entry.requiredWhen) : `必填：${esc(entry.requiredWhen)}`)
      : entry.required ? '必填' : ''
    const allowed = entry.allowedValues ?? entry.values
    const selfDesc = entry.description && entry.description !== entry.key
    const parts = []
    if (selfDesc) parts.push(esc(entry.description))
    if (required) parts.push(`<strong>${required}</strong>`)
    if (allowed) parts.push(`可选值：${esc(allowed)}`)
    const notes = entry.safetyNotes ?? entry.notes
    if (notes && notes !== '—') parts.push(`<strong>注意</strong>：${esc(notes)}`)
    const def = entry.defaultValue ?? entry.default
    const defCell = def != null && String(def).length > 50
      ? `<code class="cfg-value">${esc(def)}</code>`
      : esc(def)
    return `| ${configCell} | ${defCell} | ${parts.join('<br>')} |`
  })].join('\n')
}

const starter = JSON.parse(await readFile(resolve(generated, 'starter-config-audit.json'), 'utf8'))
let starterBody = `---\ntitle: Starter 配置参考\ndescription: ypbin-starter 全量配置项、默认值、启用条件与生产注意。\n---\n\n# Starter 配置参考\n\n本页由源码审计数据生成，覆盖 **${starter.summary.totalEntryCount}** 个配置项，其中 \`ypbin.*\` ${starter.summary.customPropertyCount} 项、宿主标准配置 ${starter.summary.standardHostPropertyCount} 项。默认值以源码为准。\n`
for (const [moduleName, module] of Object.entries(starter.modules)) {
  const entries = [...(module.configurationProperties ?? []), ...(module.standardHostProperties ?? [])]
  if (!entries.length) continue
  starterBody += `\n## ${moduleName}\n\n${table(entries)}\n`
}
await writeFile(resolve(output, 'starter.md'), starterBody)

for (const [file, title, intro] of [['admin-config-audit.json','Admin 配置参考','环境变量、application.yml 与运行时数据库参数'],['admin-ui-config-audit.json','Admin UI 配置参考','环境变量、构建、请求、路由、SSE、i18n 与部署配置']]) {
  const data = JSON.parse(await readFile(resolve(generated, file), 'utf8'))
  const groups = Map.groupBy(data.entries.filter((entry) => !entry.key.startsWith('audit.')), (entry) => entry.category ?? 'other')
  let body = `---\ntitle: ${title}\ndescription: ${intro}的逐项说明。\n---\n\n# ${title}\n\n${intro}。本页共 **${data.entries.length}** 项，包含类型、默认值、必填条件、可选值、生产注意与源码来源。\n`
  for (const [group, entries] of groups) body += `\n## ${group}\n\n${table(entries)}\n`
  await writeFile(resolve(output, file.startsWith('admin-ui') ? 'admin-ui.md' : 'admin.md'), body)
}

console.log('Generated configuration reference pages.')
