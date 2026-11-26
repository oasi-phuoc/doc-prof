import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { theoryBlocks } from './logistique-theory-blocks.mjs'

const root = new URL('../', import.meta.url)
const revision = process.argv[2] ?? ''
if (!/^\d{3}-v\d{3}$/.test(revision)) {
  throw new Error('Utilisation : node scripts/prepare-logistique-module.mjs 101-v001')
}
const readJson = (path) => JSON.parse(readFileSync(new URL(path, root), 'utf8'))
const code = revision.slice(0, 3)
const curriculum = readJson('src/logistique/curriculum.generated.json')
const catalogEntry = curriculum.modules.find((entry) => entry.code === code)
if (!catalogEntry) throw new Error(`Module absent du catalogue : ${code}`)

const editorial = readJson(`docs/logistique/preparation/${revision}.json`)
const archive = readJson(`docs/logistique/sources-epcas/${catalogEntry.theme}.generated.json`)
const source = archive.modules.find((entry) => entry.module === code)
if (!source?.pages.theorie) throw new Error(`Théorie source absente : ${code}`)
const pages = Object.fromEntries(['objectifs', 'apercu', 'theorie'].map((page) => [page, source.pages[page]?.full ?? '']))
for (const { page = 'theorie', from, to, reason } of editorial.replacements) {
  if (!reason || !from || pages[page]?.split(from).length !== 2) {
    throw new Error(`Correction introuvable ou ambiguë dans ${code} / ${page} : ${from}`)
  }
  pages[page] = pages[page].replace(from, () => to)
}

const reference = Object.values(pages).filter(Boolean).flatMap(theoryBlocks)
if (editorial.visual) {
  const { anchor, file, sha256, alt, caption } = editorial.visual
  const position = reference.findIndex((block) => block.kind === 'heading' && block.text === anchor)
  const scope = editorial.diplomas.length === 1 ? editorial.diplomas[0].toLowerCase() : 'commun'
  const path = `assets/logistique/${catalogEntry.theme}/${code}/${scope}/${file}`
  if (position < 0 || !/^[a-z0-9-]+\.svg$/.test(file)) throw new Error(`Figure mal placée : ${code}`)
  const bytes = readFileSync(new URL('public/' + path, root))
  if (createHash('sha256').update(bytes).digest('hex') !== sha256) {
    throw new Error(`Empreinte différente de la figure enregistrée : ${code}`)
  }
  reference.splice(position + 1, 0, { kind: 'image', src: '/' + path, alt, caption })
}
const kinds = ['maths', 'verification', 'situation']
const units = [
  { id: 'theorie-source', kind: 'theorie', blocks: reference },
  { id: 'glossaire-reconstitue', kind: 'glossaire', blocks: editorial.glossary.map(([term, definition]) =>
    ({ kind: 'paragraph', text: `{g}${term}{/g} — ${definition}` })) },
  ...editorial.exercises,
].map(({ id, approvedFor = editorial.diplomas, ...data }) => ({
  id: `log-${code}-${id}`, ...data, module: code, revision, approvedFor,
}))
if (new Set(units.map(({ id }) => id)).size !== units.length ||
    units.some(({ approvedFor }) => !approvedFor.length || approvedFor.some((diploma) => !catalogEntry.year[diploma])) ||
    units.some((unit) => unit.blocks ? !unit.blocks.length :
      !kinds.includes(unit.kind) || !unit.prompt?.trim() || !unit.answer?.trim() ||
      (unit.kind === 'maths' && !unit.calculation?.trim())) ||
    editorial.diplomas.some((diploma) => kinds.some((kind) =>
      !units.some((unit) => unit.kind === kind && unit.approvedFor.includes(diploma))))) {
  throw new Error(`Contenus incomplets ou diplôme incompatible : ${code}`)
}

const destination = new URL(`src/logistique/banks/module-${revision}.generated.ts`, root)
const output = `import type { LogistiqueUnit } from '../approved-banks'

export const module${code} = ${JSON.stringify(units, null, 2)} satisfies readonly LogistiqueUnit[]
`
if (existsSync(destination) && readFileSync(destination, 'utf8') !== output) {
  throw new Error(`La révision ${revision} existe déjà. Créez une nouvelle révision.`)
}
mkdirSync(new URL('.', destination), { recursive: true })
writeFileSync(destination, output)
const counts = editorial.diplomas.map((diploma) => `${diploma} ${units.filter((unit) => unit.approvedFor.includes(diploma)).length}`)
console.log(`${revision} · ${reference.length} blocs de théorie · ${editorial.glossary.length} termes · ${counts.join(', ')} unités`)
