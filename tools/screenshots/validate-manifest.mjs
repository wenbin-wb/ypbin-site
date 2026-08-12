import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '../..')
const fixtures = ['starter.json', 'admin.json', 'admin-ui.json']
const allowedStates = new Set(['planned', 'captured', 'verified'])

for (const fixture of fixtures) {
  const path = resolve(root, 'tests/fixtures/screenshots', fixture)
  const data = JSON.parse(await readFile(path, 'utf8'))
  if (data.schemaVersion !== 1 || !data.product || !data.sourceRepository) {
    throw new Error(`Invalid screenshot fixture: ${fixture}`)
  }
  if (!allowedStates.has(data.status)) {
    throw new Error(`Invalid screenshot status in ${fixture}: ${data.status}`)
  }
  if (data.status !== 'planned' && (!data.sourceRef || !data.capturedAt)) {
    throw new Error(`Captured fixture requires sourceRef and capturedAt: ${fixture}`)
  }
  if (data.status === 'verified') {
    if (!data.artifactManifest) {
      throw new Error(`Verified fixture requires artifactManifest: ${fixture}`)
    }
    const manifest = JSON.parse(await readFile(resolve(root, data.artifactManifest), 'utf8'))
    if (manifest.sourceRef !== data.sourceRef || manifest.images.length === 0) {
      throw new Error(`Fixture and artifact manifest disagree: ${fixture}`)
    }
    for (const image of manifest.images) {
      for (const [pathKey, hashKey] of [['path', 'sha256'], ['webpPath', 'webpSha256']]) {
        const bytes = await readFile(resolve(root, 'docs/public', image[pathKey]))
        const actual = createHash('sha256').update(bytes).digest('hex')
        if (actual !== image[hashKey]) {
          throw new Error(`Screenshot hash mismatch: ${image[pathKey]}`)
        }
      }
    }
  }
}

console.log(`Validated ${fixtures.length} screenshot fixtures and verified artifact hashes.`)
