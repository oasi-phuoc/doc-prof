import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { theoryBlocks } from './logistique-theory-blocks.mjs'
import { insertLogistiqueFigures, moduleIntroduction, readLogistiqueGeneratedBank } from './logistique-reference-blocks.mjs'

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
const baseTheory = editorial.baseTheory
if (baseTheory && (!editorial.theoryOnly || editorial.replacements.length || !/^[a-z0-9-]+$/.test(baseTheory))) {
  throw new Error('La théorie de départ doit désigner une banque publiée sans remplacement textuel : ' + code)
}
const archive = readJson(`docs/logistique/sources-epcas/${catalogEntry.theme}.generated.json`)
const source = archive.modules.find((entry) => entry.module === code)
const original = new URL(`docs/logistique/preparation/${revision}.md`, root)
const pages = source?.pages.theorie
  ? Object.fromEntries(['objectifs', 'apercu', 'theorie'].map((page) => [page, source.pages[page]?.full ?? '']))
  : { theorie: existsSync(original) ? readFileSync(original, 'utf8').trim() : '' }
if (!baseTheory && !pages.theorie) throw new Error(`Théorie source ou cours original absent : ${code}`)
for (const { page = 'theorie', from, to, reason } of editorial.replacements) {
  if (!reason || !from || pages[page]?.split(from).length !== 2) {
    throw new Error(`Correction introuvable ou ambiguë dans ${code} / ${page} : ${from}`)
  }
  pages[page] = pages[page].replace(from, () => to)
}

const legacyCombinedReference = editorial.legacyCombinedReference === true
const introduction = editorial.theoryOnly || legacyCombinedReference ? [] : [moduleIntroduction(
  theoryBlocks(editorial.objectives ?? pages.objectifs ?? ''),
  theoryBlocks(editorial.overview ?? pages.apercu ?? ''),
)]
const baseUnit = baseTheory && readLogistiqueGeneratedBank(new URL(`src/logistique/banks/${baseTheory}.generated.ts`, root))
  .find((unit) => unit.module === code && unit.kind === 'theorie')
const reference = baseTheory
  ? baseUnit?.blocks.filter((block) => editorial.keepBaseFigures || (block.kind !== 'image' && block.kind !== 'image-row'))
  : legacyCombinedReference ? Object.values(pages).filter(Boolean).flatMap(theoryBlocks) : theoryBlocks(pages.theorie)
if (!reference?.length) throw new Error('Cours de départ introuvable : ' + code)
const figures = editorial.visuals ?? (editorial.visual ? [editorial.visual] : [])
if (!legacyCombinedReference && figures.length === 0) throw new Error('Illustrations de la théorie absentes : ' + code)
const scope = editorial.diplomas.length === 1 ? editorial.diplomas[0].toLowerCase() : 'commun'
const publicDirectory = new URL('public/', root)
const figureDirectory = `assets/logistique/${catalogEntry.theme}/${code}/${scope}`
const course = insertLogistiqueFigures(reference, figures, publicDirectory, figureDirectory)
const summarySource = editorial.summaryTheory ? theoryBlocks(editorial.summaryTheory)
  : editorial.keepBaseFigures ? baseUnit?.summaryBlocks : undefined
const summary = summarySource
  ? insertLogistiqueFigures(summarySource,
    figures.map(({ summaryAnchor, ...figure }) => ({ ...figure, anchor: summaryAnchor ?? figure.anchor })),
    publicDirectory, figureDirectory)
  : undefined
const theory = { id: 'theorie-source', kind: 'theorie', blocks: course, ...(summary ? { summaryBlocks: summary } : {}) }
const kinds = ['maths', 'verification', 'situation']
const draftUnits = editorial.theoryOnly ? [theory] : [
  ...introduction,
  theory,
  { id: 'glossaire-reconstitue', kind: 'glossaire', blocks: editorial.glossary.map(([term, definition]) =>
    ({ kind: 'paragraph', text: `{g}${term}{/g} — ${definition}` })) },
  ...editorial.exercises,
]
const units = draftUnits.map(({ id, approvedFor = editorial.diplomas, ...data }) => ({
  id: `log-${code}-${id}`, ...data, module: code, revision, approvedFor,
}))
if (new Set(units.map(({ id }) => id)).size !== units.length ||
    units.some(({ approvedFor }) => !approvedFor.length || approvedFor.some((diploma) => !catalogEntry.year[diploma])) ||
    units.some((unit) => unit.blocks ? !unit.blocks.length :
      !kinds.includes(unit.kind) || !unit.prompt?.trim() || !unit.answer?.trim() ||
      (unit.kind === 'maths' && !unit.calculation?.trim())) ||
    (!editorial.theoryOnly && editorial.diplomas.some((diploma) => kinds.some((kind) =>
      !units.some((unit) => unit.kind === kind && unit.approvedFor.includes(diploma)))))) {
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
console.log(`${revision} · ${course.length} blocs de théorie${summary ? ' · ' + summary.length + ' blocs de résumé' : ''} · ${counts.join(', ')} unités`)
