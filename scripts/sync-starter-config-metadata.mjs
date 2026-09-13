#!/usr/bin/env node
/**
 * 同步 starter 配置元数据到站点。
 *
 * 「配置参考」的唯一数据源是 ypbin-starter 仓库中由构建产物生成的
 * `tools/generated/starter-config-metadata.json`（由该仓 `tools/export-config-metadata.mjs`
 * 从各模块的 spring-configuration-metadata.json 聚合而来，并在其 CI 中以 `--check` 防漂移）。
 *
 * 本站点仓库保留一份副本，使站点构建无需 Java 工具链即可离线生成配置参考。
 * 本脚本负责把上游副本拉平到 `scripts/generated/`，并用 `--check` 在 CI 中断言两者一致。
 *
 * 用法：
 *   node scripts/sync-starter-config-metadata.mjs            # 从 ../ypbin-starter 同步
 *   node scripts/sync-starter-config-metadata.mjs --check    # 只校验是否一致（不一致则失败）
 *
 * 可用环境变量 STARTER_REPO_ROOT 指定 starter 仓库位置（默认 ../ypbin-starter）。
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { resolve, join } from 'node:path'

const siteRoot = resolve(import.meta.dirname, '..')
const starterRoot = process.env.STARTER_REPO_ROOT
  ? resolve(process.env.STARTER_REPO_ROOT)
  : resolve(siteRoot, '..', 'ypbin-starter')
const sourceFile = join(starterRoot, 'tools', 'generated', 'starter-config-metadata.json')
const targetFile = resolve(siteRoot, 'scripts', 'generated', 'starter-config-metadata.json')
const checkMode = process.argv.includes('--check')

// generatedAt 属生成时间戳，不参与一致性比较（字段可能为 ISO 字符串或 null）
const IGNORE_GENERATED_AT = (text) =>
  text.replace(/"generatedAt":\s*(?:"[^"]*"|null)/, '"generatedAt": "IGNORED"')

async function main() {
  if (!existsSync(sourceFile)) {
    console.error(
      `✖ 未找到 starter 元数据：${sourceFile}\n` +
        '  请先在 ypbin-starter 仓库执行 `mvn -DskipTests install` 后运行\n' +
        '  `node tools/export-config-metadata.mjs` 生成并提交，或设置 STARTER_REPO_ROOT 指向该仓库。',
    )
    process.exit(1)
  }

  const source = await readFile(sourceFile, 'utf8')

  if (checkMode) {
    if (!existsSync(targetFile)) {
      console.error(`✖ 站点缺少元数据副本：${targetFile}\n  请运行 node scripts/sync-starter-config-metadata.mjs 同步并提交。`)
      process.exit(1)
    }
    const target = await readFile(targetFile, 'utf8')
    if (IGNORE_GENERATED_AT(source) !== IGNORE_GENERATED_AT(target)) {
      console.error('✖ 站点配置元数据副本与 starter 上游不一致。\n  请运行 node scripts/sync-starter-config-metadata.mjs 同步并提交。')
      process.exit(1)
    }
    console.log('✓ starter 配置元数据与上游一致。')
    return
  }

  await mkdir(resolve(siteRoot, 'scripts', 'generated'), { recursive: true })
  await writeFile(targetFile, source)
  console.log(`✓ 已同步 starter 配置元数据：${targetFile}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
