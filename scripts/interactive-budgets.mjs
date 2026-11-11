import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'
const manifest = JSON.parse(await readFile('dist/.vite/manifest.json', 'utf8'))
function filesFor(keys) {
  const seen = new Set(), files = new Set()
  const visit = (key) => { if (seen.has(key)) return; seen.add(key); const entry = manifest[key]; assert.ok(entry, `Entrée de manifeste absente : ${key}`); files.add(entry.file); for (const file of entry.css ?? []) files.add(file); for (const dependency of entry.imports ?? []) visit(dependency) }
  keys.forEach(visit); return [...files].sort()
}
async function measure(keys, maximumGzip) {
  const files = await Promise.all(filesFor(keys).map(async (file) => { const bytes = await readFile(`dist/${file}`); return { file, raw: bytes.length, gzip: gzipSync(bytes).length } }))
  const total = { raw: files.reduce((n, file) => n + file.raw, 0), gzip: files.reduce((n, file) => n + file.gzip, 0), maximumGzip, files }
  assert.ok(total.gzip <= maximumGzip, `${keys.join(' + ')} : ${total.gzip} octets gzip, budget ${maximumGzip}`)
  return total
}
const bootstrap = 'src/interactive/InteractiveApp.tsx'
const report = { generatedAt: new Date().toISOString(), landing: await measure(['index.html'], 150 * 1024), calibration: await measure([bootstrap, 'src/interactive/CardsPage.tsx'], 200 * 1024), diagnostic: await measure([bootstrap, 'src/interactive/DiagnosticPage.tsx'], 200 * 1024), game: await measure([bootstrap, 'src/interactive/GameApp.tsx'], 3 * 1024 * 1024), limitation: 'Le jeu complet inclut encore les banques et du code partagé. Son plafond provisoire de 3 Mio dépasse la proposition V4 de 200 Ko ; découpage par domaine et mesures ENI restent ouverts.' }
const gameOnly = new Set(report.game.files.map((file) => file.file))
for (const route of ['landing', 'calibration', 'diagnostic']) {
  assert.ok(!report[route].files.some((file) => gameOnly.has(file.file) && file.raw > 1024 * 1024), `${route} charge encore les banques du jeu`)
}
await writeFile('docs/interactive/performance-results.json', JSON.stringify(report, null, 2) + '\n')
console.log(JSON.stringify(Object.fromEntries(['landing', 'calibration', 'diagnostic', 'game'].map((route) => [route, { gzip: report[route].gzip, maximumGzip: report[route].maximumGzip }])), null, 2))
