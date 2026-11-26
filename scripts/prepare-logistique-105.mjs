import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const directory = new URL('../docs/logistique/pilote-105/', import.meta.url)
const { source, pages } = JSON.parse(readFileSync(new URL('sources-epcas.json', directory), 'utf8'))
const review = readFileSync(new URL('relecture.md', directory), 'utf8')

const corrections = [
  ["en matière d'une soigneuse manipulation", 'en matière de manipulation soigneuse'],
  ['un produit semi-fini, obtenue à partir de la matière première : le blé', 'un produit semi-fini. Elle est obtenue à partir de la matière première qu’est le blé'],
  ["l'humidité de l'air inadaptée (trop humide ou trop sec)", 'l’humidité de l’air inadaptée (air trop humide ou trop sec)'],
  ['**5.6.3 Fumage**', '**5.6.3 Le fumage**'],
  ['**5.6.5 Stérilisation**', '**5.6.5 La stérilisation**'],
]

const factCorrections = [
  ["En dessous de **-18 °C**, la propagation s'arrête complètement : les micro-organismes n'entrent pas nécessairement en mort, mais en une sorte d'hibernation. Dès que la température augmente, la multiplication recommence. **Les aliments surgelés ne doivent donc pas être recongelés après avoir été décongelés.**",
    'La congélation à **−18 °C** empêche la multiplication de nombreux micro-organismes sans les éliminer. Une hausse de température peut permettre leur reprise. **Suivre les consignes de conservation du produit et la procédure de l’entreprise en cas de décongélation.**'],
  ["Le terme « humidité de l'air » désigne la part d'eau contenue dans un mètre cube d'air. Les spécialistes parlent d'**humidité relative** de l'air, car la part d'eau n'est pas constante, mais dépend de la température.",
    'L’**humidité relative** est le rapport, en pourcentage, entre la quantité de vapeur d’eau présente et la quantité maximale possible à la même température.'],
  ["La « brûlure de congélation » qui s'ensuit rend les produits inutilisables.", 'Le gel local peut altérer la texture de produits qui ne supportent pas les températures négatives.'],
  ["chauffage jusqu'à environ **120 °C** : toutes les bactéries sont tuées ; beaucoup de vitamines aussi.", 'traitement thermique dont le barème est validé pour maîtriser les micro-organismes et leurs spores selon le produit. La chaleur peut réduire la teneur en certaines vitamines.'],
  ['La densité (poids spécifique)', 'La densité'],
  ['(ex. tablettes lave-vaisselle, Javel)', '(ex. certains détergents, selon leur étiquette)'],
  ['(ex. décolorant, eau oxygénée)', '(ex. certains produits à base de peroxyde, selon leur concentration et leur étiquette)'],
]

const original = factCorrections.reduce((text, [from, to]) => {
  if (!text.includes(from)) throw new Error(from)
  return text.replace(from, to)
}, pages.theorie.full)
const corrected = corrections.reduce((text, [from, to]) => {
  if (text.indexOf(from) === -1 || text.indexOf(from) !== text.lastIndexOf(from)) {
    throw new Error(`Correction linguistique ambiguë : ${from}`)
  }
  return text.replace(from, to)
}, original)

const emphasis = (text) => text.replace(/\*\*([^*]+)\*\*/g, '{g}$1{/g}')
const plain = (text) => text.replace(/\*\*/g, '').trim()
const cells = (line) => line.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim())

function theoryBlocks(markdown) {
  return markdown.replace(/^#{1,6} .+$/gm, '\n$&\n').trim().split(/\n\s*\n/).flatMap((chunk) => {
    const lines = chunk.split('\n').map((line) => line.trim()).filter(Boolean)
    if (lines.every((line) => line.startsWith('|')) && lines.length >= 3) {
      return [{
        kind: 'table',
        headers: cells(lines[0]).map(emphasis),
        rows: lines.slice(2).map((line) => cells(line).map(emphasis)),
      }]
    }
    if (lines.every((line) => /^[-*] |^\d+\. /.test(line))) {
      return [{ kind: 'list', items: lines.map((line) => emphasis(line.replace(/^[-*] /, ''))) }]
    }
    if (lines.every((line) => /^#{1,6} /.test(line))) {
      return lines.map((line) => ({ kind: 'heading', text: plain(line.replace(/^#+ /, '')), sub: line.startsWith('###') }))
    }
    if (/^---+$/.test(chunk)) return []
    return [{ kind: 'paragraph', text: emphasis(lines.join(' ')) }]
  })
}

function segment(markdown, from, to) {
  const body = markdown.split(from + '\n')[1]?.split('\n' + to)[0]?.trim()
  if (!body) throw new Error(`Section absente : ${from}`)
  return body
}

const glossary = segment(review, '## Glossaire proposé', '## Décisions de revue et questions candidates')
const glossaryRows = glossary.split('\n').slice(2).map(cells)
const summary = segment(review, '## Proposition de résumé pédagogique', '### Contrôle de couverture')

const knowledge = [...pages.verification.full.matchAll(/^### Question (\d+)\s+([\s\S]*?)\n+:::reponse\s+([\s\S]*?)\n:::/gm)]
  .filter(([, number]) => number !== '4')
  .map(([, number, prompt, answer]) => ({
    id: `log-105-verification-source-${number}`,
    kind: 'verification',
    prompt: plain(prompt),
    answer: number === '5' ? '1. Périssabilité\n2. Dangerosité\n3. Manutention' : plain(answer),
  }))

const visual = JSON.parse(readFileSync(new URL('visuels/registre.json', directory), 'utf8'))
const visualBytes = readFileSync(new URL('../public/' + visual.publicPath, import.meta.url))
if (createHash('sha256').update(visualBytes).digest('hex') !== visual.sha256) {
  throw new Error('L’empreinte du schéma ne correspond pas à la révision enregistrée')
}
const fullTheory = [pages.objectifs.full, pages.apercu.full, corrected].flatMap(theoryBlocks)
const visualPosition = fullTheory.findIndex((block) => block.kind === 'heading' && block.text.startsWith('5.3 '))
if (visualPosition < 0) throw new Error('Ancrage du schéma du module 105 absent')
fullTheory.splice(visualPosition, 0, {
  kind: 'image',
  src: '/' + visual.publicPath,
  alt: visual.alt,
  caption: visual.caption,
})

const drafts = [
  {
    id: 'log-105-theorie-source',
    kind: 'theorie',
    blocks: fullTheory,
  },
  {
    id: 'log-105-glossaire-reconstitue',
    kind: 'glossaire',
    blocks: glossaryRows.map(([term, definition]) => ({
      kind: 'paragraph',
      text: `{g}${term}{/g} — ${definition}`,
    })),
  },
  {
    id: 'log-105-maths-source-1',
    kind: 'maths',
    prompt: 'Un pneu de tracteur a un diamètre de 2,32 m. Calculez son périmètre en mètres en prenant π = 3,14.',
    calculation: '2,32 × 3,14 = 7,2848',
    answer: 'Le périmètre est de 7,2848 m.',
  },
  {
    id: 'log-105-maths-source-2',
    kind: 'maths',
    prompt: 'Vingt planches mesurent chacune 5 m de long et 30 cm de large. Quelle surface peut-on recouvrir avec les vingt planches ?',
    calculation: '30 cm = 0,30 m. 20 × 5 × 0,30 = 30.',
    answer: 'Les planches couvrent 30 m².',
  },
  {
    id: 'log-105-maths-source-3',
    kind: 'maths',
    prompt: 'Vingt planches mesurent chacune 5 m × 30 cm × 19 mm. Calculez leur volume total en m³.',
    calculation: '30 cm = 0,30 m et 19 mm = 0,019 m. 20 × 5 × 0,30 × 0,019 = 0,57.',
    answer: 'Le volume est de 0,57 m³.',
  },
  {
    id: 'log-105-maths-source-4',
    kind: 'maths',
    prompt: 'Vous disposez de 30 m² de planches vendues à 40 CHF par m². Calculez le chiffre d’affaires de la vente.',
    calculation: '30 × 40 = 1 200.',
    answer: 'Le chiffre d’affaires est de 1 200 CHF.',
  },
  ...knowledge,
  {
    id: 'log-105-situation-orig-1',
    kind: 'situation',
    prompt: 'Vous réceptionnez des pommes pour un atelier de jus. Une caisse est écrasée. Indiquez le degré de transformation des pommes pour l’atelier, la propriété concernée et une action de contrôle.',
    answer: 'Matière première. La fragilité expose les pommes à des dommages. Constater l’état et signaler l’écart selon les consignes de réception.',
  },
  {
    id: 'log-105-situation-orig-2',
    kind: 'situation',
    prompt: 'Du papier et des fruits sont placés dans une même zone. Expliquez pourquoi un même réglage de l’humidité peut convenir à l’un des stocks et gêner l’autre.',
    answer: 'Un air humide peut détériorer le papier hygroscopique. Un air trop sec peut dessécher certains fruits. Les exigences doivent être vérifiées pour chaque produit.',
  },
]

writeFileSync(new URL('preparation.generated.json', directory), JSON.stringify({
  source,
  status: 'source-de-la-revision-active',
  corrections: corrections.map(([from, to]) => ({ from, to })),
  factCorrections: factCorrections.map(([from, to]) => ({ from, to })),
  summary: theoryBlocks(summary),
  units: drafts.map((entry) => ({ ...entry, module: '105', revision: '105-candidat-v001', approvedFor: [] })),
}, null, 2) + '\n')
const cfcOnly = new Set([
  'log-105-maths-source-1',
  'log-105-maths-source-3',
  'log-105-verification-source-1',
  'log-105-verification-source-3',
])
const bank = new URL('../src/logistique/banks/', import.meta.url)
mkdirSync(bank, { recursive: true })
const release = '105-v001'
const destination = new URL(`module-${release}.generated.ts`, bank)
const bankSource = `import type { LogistiqueUnit } from '../approved-banks'

export const module105 = ${JSON.stringify(drafts.map((entry) => ({
  ...entry,
  module: '105',
  revision: release,
  approvedFor: cfcOnly.has(entry.id) ? ['CFC'] : ['CFC', 'AFP'],
})), null, 2)} satisfies readonly LogistiqueUnit[]
`
if (existsSync(destination) && readFileSync(destination, 'utf8') !== bankSource) {
  throw new Error(`La révision ${release} est déjà enregistrée. Créez une nouvelle révision pour modifier la banque.`)
}
writeFileSync(destination, bankSource)
console.log(`${drafts.length} unités publiées en CFC, ${drafts.length - cfcOnly.size} en AFP, dont un glossaire de ${glossaryRows.length} termes.`)
