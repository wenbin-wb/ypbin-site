import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const generated = resolve(root, 'scripts/generated')
const output = resolve(root, 'docs/guide/config')
await mkdir(output, { recursive: true })

const stringify = (value) => value == null ? '—' : Array.isArray(value) ? value.join(' / ') || '—' : typeof value === 'object' ? JSON.stringify(value) : String(value)

/**
 * 转义「普通文本单元」（放表格单元格、非 code 上下文）：转义 markdown/HTML 特殊字符。
 * 注意：不要对将要放进反引号 code span 的文本调用本函数——code span 内实体不解析，
 * 会原样显示（历史上把 `_` 转成 `&#95;` 后塞 code 造成配置键乱码）。
 */
const esc = (value) => stringify(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('://', '&#58;//')
  .replaceAll('|', '\\|')
  .replaceAll('*', '&#42;')
  .replaceAll('_', '&#95;')
  .replaceAll('\n', '<br>')

/** code span 内容：仅转义反引号定界符与表格管道符（保留 & _ 等字面，避免实体乱码） */
const codeSpan = (value) => String(value).replaceAll('`', '\\`').replaceAll('|', '\\|')

/**
 * 类型展示名：全限定名取末段并小写首字母（java.lang.Boolean → boolean）。
 * 泛型需逐段简化，否则 java.util.List<java.lang.String> 按 `.` 取末段会截成 String>；
 * 此处把每个全限定名（含泛型参数）都替换为简单名，得到 list<String>。
 */
const shortType = (type) => {
  const raw = stringify(type)
  if (raw === '—' || raw.includes(' ')) return raw
  const simple = raw.replace(/[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)+/g, (fqcn) => fqcn.split('.').pop())
  return simple ? simple.charAt(0).toLowerCase() + simple.slice(1) : simple
}

const shortSource = (source) => {
  const path = source.path ?? ''
  const base = path.split(/[\\/]/).pop() || path
  return `${base}:${source.line ?? source.lines ?? ''}`
}
const sourceLine = (entry) => (entry.sources ?? []).map((s) => esc(shortSource(s))).join(' · ')

function table(entries) {
  const head = '| 配置项 | 类型 | 默认值 | 说明 |\n|---|---|---|---|'
  const rows = entries.map((entry) => {
    // 配置项列：code span 内不转义实体（否则 _ 等显示为字面乱码）
    const key = codeSpan(entry.key)
    const configCell = `\`${key}\``
    // 类型列
    const typeCell = `\`${codeSpan(shortType(entry.type))}\``
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
    // 源码出处并入说明末尾小字（不占独立列，避免窄列各自排布抬高行高）
    const srcLine = sourceLine(entry)
    if (srcLine && srcLine !== '—') parts.push(`<span class="cfg-src">来源：${srcLine}</span>`)
    const descCell = parts.join('<br>')
    const def = entry.defaultValue ?? entry.default
    const defCell = def != null && String(def).length > 50
      ? `<code class="cfg-value">${esc(def)}</code>`
      : esc(def)
    return `| ${configCell} | ${typeCell} | ${defCell} | ${descCell} |`
  }).join('\n')
  // 宽表外包滚动容器：避免横向溢出把页面撑破；限高后表头 sticky 随容器滚动
  return `\n<div class="table-scroll">\n\n${head}\n${rows}\n\n</div>\n`
}

// 配置参考的数据源：由 ypbin-starter 从构建产物生成并同步而来（见 scripts/sync-starter-config-metadata.mjs）
const starter = JSON.parse(await readFile(resolve(generated, 'starter-config-metadata.json'), 'utf8'))
let starterBody = `---\ntitle: Starter 配置参考\ndescription: ypbin-starter 全量配置项、默认值、启用条件与生产注意。\n---\n\n# Starter 配置参考\n\n本页由 starter 构建产物中的 configuration-metadata 生成，覆盖 **${starter.summary.totalEntryCount}** 个配置项，其中 \`ypbin.*\` ${starter.summary.customPropertyCount} 项、宿主标准配置 ${starter.summary.standardHostPropertyCount} 项。默认值以源码为准。表格支持左右滚动。\n`
for (const [moduleName, module] of Object.entries(starter.modules)) {
  const entries = [...(module.configurationProperties ?? []), ...(module.standardHostProperties ?? [])]
  if (!entries.length) continue
  starterBody += `\n## ${moduleName}\n\n${table(entries)}\n`
}
await writeFile(resolve(output, 'starter.md'), starterBody)

for (const [file, title, intro] of [['admin-config-audit.json', 'Admin 配置参考', '环境变量、application.yml 与运行时数据库参数'], ['admin-ui-config-audit.json', 'Admin UI 配置参考', '环境变量、构建、请求、路由、SSE、i18n 与部署配置']]) {
  const data = JSON.parse(await readFile(resolve(generated, file), 'utf8'))
  const groups = Map.groupBy(data.entries.filter((entry) => !entry.key.startsWith('audit.')), (entry) => entry.category ?? 'other')
  let body = `---\ntitle: ${title}\ndescription: ${intro}的逐项说明。\n---\n\n# ${title}\n\n${intro}。本页共 **${data.entries.length}** 项，包含类型、默认值、必填条件、可选值、生产注意与源码来源。表格支持左右滚动。\n`
  for (const [group, entries] of groups) body += `\n## ${group}\n\n${table(entries)}\n`
  await writeFile(resolve(output, file.startsWith('admin-ui') ? 'admin-ui.md' : 'admin.md'), body)
}

console.log('Generated configuration reference pages.')
