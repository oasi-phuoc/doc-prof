import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'

const require = createRequire(import.meta.url)
const { load, root } = require('./gattegno-loader.cjs')
const { currentLogistiquePublication } = load(root + '/src/logistique/approved-banks.ts')
const { modules } = JSON.parse(readFileSync(new URL('../src/logistique/curriculum.generated.json', import.meta.url), 'utf8'))
const targets = { maths: 30, verification: 50, situation: 20 }
const diplomas = ['CFC', 'AFP']
const themes = process.argv.slice(2)

const counts = new Map()
for (const unit of currentLogistiquePublication.units) {
  if (!Object.hasOwn(targets, unit.kind)) continue
  for (const diploma of unit.approvedFor) {
    const key = [diploma, unit.module, unit.kind].join('/')
    const ids = counts.get(key) ?? new Set()
    ids.add(unit.id)
    counts.set(key, ids)
  }
}

const selectedModules = themes.length ? modules.filter(({ theme }) => themes.includes(theme)) : modules
for (const diploma of diplomas) {
  const rows = selectedModules.filter(({ year }) => year[diploma]).map(({ code }) => {
    const available = Object.fromEntries(Object.keys(targets).map((kind) => [kind, counts.get([diploma, code, kind].join('/'))?.size ?? 0]))
    return [code, available]
  })
  if (!rows.length) continue
  console.log(`${diploma} · ${rows.length} modules`)
  let missing = 0
  for (const [module, available] of rows) {
    const gaps = Object.keys(targets).map((kind) => Math.max(0, targets[kind] - available[kind]))
    missing += gaps.reduce((total, gap) => total + gap, 0)
    console.log(`${module}  ${available.maths}/30  ${available.verification}/50  ${available.situation}/20`)
  }
  console.log(`${missing} unités à compléter pour ${diploma}`)
}
