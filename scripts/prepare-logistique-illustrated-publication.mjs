import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { insertLogistiqueFigures, moduleIntroduction, readLogistiqueGeneratedBank } from './logistique-reference-blocks.mjs'

const root = new URL('../', import.meta.url)
const read = (path) => readFileSync(new URL(path, root), 'utf8')
const { revision, modules } = JSON.parse(read('docs/logistique/preparation/references-illustrees-v002.json'))
const catalogue = JSON.parse(read('src/logistique/curriculum.generated.json'))

const units = modules.flatMap(({ module, base, overview, figures }) => {
  const path = 'src/logistique/banks/module-' + base + '.generated.ts'
  const theory = readLogistiqueGeneratedBank(new URL(path, root)).find((unit) => unit.kind === 'theorie')
  const course = theory?.blocks.findIndex((block) => block.kind === 'heading' && /^\d+\.\s/.test(block.text))
  if (theory?.module !== module || course < 1) throw new Error('Début du cours introuvable : ' + module)

  const front = theory.blocks.slice(0, course)
  const overviewStart = front.findIndex((block) => block.kind === 'heading' && block.text.startsWith('Aperçu du module'))
  const objectivesStart = front.findIndex((block) => block.kind === 'heading' && block.text.startsWith('Objectifs'))
  if (objectivesStart < 0 || (overviewStart < 0 && !overview?.length)) {
    throw new Error('Introduction incomplète : ' + module)
  }
  const objectives = front.slice(objectivesStart, overviewStart < 0 ? front.length : overviewStart)
  const introduction = moduleIntroduction(objectives, overview?.length ? [
    { kind: 'heading', text: 'Aperçu du module ' + module },
    { kind: 'list', items: overview },
  ] : front.slice(overviewStart))
  const { theme } = catalogue.modules.find(({ code }) => code === module)
  const scope = theory.approvedFor.length === 1 ? theory.approvedFor[0].toLowerCase() : 'commun'
  const visualPath = 'assets/logistique/' + theme + '/' + module + '/' + scope
  const blocks = insertLogistiqueFigures(theory.blocks.slice(course), figures, new URL('public/', root), visualPath)
  return [
    { ...introduction, id: 'log-' + module + '-' + introduction.id, module, revision, approvedFor: theory.approvedFor },
    { ...theory, blocks, revision },
  ]
})
if (new Set(units.map(({ id }) => id)).size !== units.length) throw new Error('Identifiants de référence en double.')

const destination = new URL('src/logistique/banks/references-v002.generated.ts', root)
const output = "import type { LogistiqueUnit } from '../approved-banks'\n\n" +
  'export const illustratedReferences = ' + JSON.stringify(units, null, 2) + ' satisfies readonly LogistiqueUnit[]\n'
if (existsSync(destination) && readFileSync(destination, 'utf8') !== output) {
  throw new Error('Cette publication existe déjà. Créez une nouvelle révision.')
}
writeFileSync(destination, output)
console.log(units.length + ' unités de lecture préparées pour ' + modules.length + ' modules.')
