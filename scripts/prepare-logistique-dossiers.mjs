import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dossierMaths } from './logistique-dossier-maths.mjs'
import { readLogistiqueGeneratedBank } from './logistique-reference-blocks.mjs'

const require = createRequire(import.meta.url)
const { load, root } = require('./gattegno-loader.cjs')
const { logistiquePublications } = load(root + '/src/logistique/approved-banks.ts')
const baseline = logistiquePublications.find(({ revision }) => revision === 'logistique-exercices-approvisionnement-v004')
const theme = process.argv[2]
if (!/^[1-9]00$/.test(theme)) throw new Error('Indiquez un thème de 100 à 900.')
const input = new URL(`../docs/logistique/preparation/dossiers-${theme}-v005.txt`, import.meta.url)
const destination = new URL(`../src/logistique/banks/dossiers-${theme}-v005.generated.ts`, import.meta.url)
const groups = readFileSync(input, 'utf8').trim().split(/^# /mu).filter(Boolean)
const additions = []

const modelQuestions = {
  stock: ['Quelle quantité sert à accepter une nouvelle demande si une partie des unités est réservée ?', 'La quantité disponible, après exclusion des unités déjà réservées. Le stock physique peut inclure les réservations.'],
  series: ['Comment vérifiez-vous un total quand le relevé comporte des lots complets et des unités isolées ?', 'Multipliez la taille d’un lot par le nombre de lots complets puis ajoutez les unités isolées. Gardez la même unité tout au long du contrôle.'],
  planning: ['Pour estimer le temps de travail utilisable, que faut-il retirer du créneau total ?', 'Les périodes d’attente ou d’indisponibilité qui appartiennent au créneau et pendant lesquelles le poste ne peut rien traiter.'],
  area: ['Pourquoi la surface seule ne permet-elle pas de donner le nombre de positions ?', 'Il faut vérifier les dimensions sur chaque côté, l’orientation et les dégagements prévus. Une position entamée est inutilisable.'],
  audit: ['Quel total utilisez-vous comme dénominateur pour le taux d’écart d’un contrôle ?', 'Le nombre d’unités réellement contrôlées dans le même périmètre que les écarts.'],
  cost: ['Quels éléments doivent être comparables lorsqu’on calcule un coût par unité ?', 'Le périmètre, les frais fixes et variables, la quantité et la période. Comparez des totaux portant sur le même service.'],
  mass: ['Quelle masse comparez-vous à une limite qui porte sur une unité emballée ?', 'La masse brute de l’ensemble à déplacer ou à stocker, dans le périmètre prévu par la fiche.'],
  levels: ['Pourquoi vérifier les niveaux réellement accessibles avant d’annoncer une capacité ?', 'La capacité du plan peut inclure des niveaux condamnés, trop bas ou soumis à une autre limite de charge.'],
  cadence: ['À quelle condition la file d’attente grandit-elle ?', 'Elle grandit si les arrivées dépassent durablement la cadence du poste qui traite les unités.'],
  lever: ['Quelle modification augmente le moment sans changer la force ?', 'Augmenter la distance au pivot. Le moment est le produit de cette distance et de la force.'],
  route: ['Pourquoi ajouter le temps de transfert au délai de bout en bout ?', 'La remise ou le changement de mode occupe une partie du délai même quand la distance ne change pas.'],
  tonneDistance: ['Quelles deux grandeurs combine-t-on pour obtenir des tonnes-kilomètres ?', 'La masse retenue en tonnes et le parcours retenu en kilomètres. Le produit des deux donne la base de ce calcul fictif.'],
  volume: ['Quelle différence faites-vous entre volume utile et encombrement extérieur ?', 'Le volume utile décrit la capacité intérieure. L’encombrement se calcule sur les mesures extérieures et peut être supérieur.'],
  tension: ['Quelle unité donne la formule résistance en N/mm² × section en mm² ?', 'Le newton. Le calcul donne une force, à distinguer de la masse et d’une capacité garantie pour un montage.'],
  depreciation: ['Quels éléments faut-il connaître pour calculer l’amortissement linéaire annuel ?', 'Le prix d’acquisition, la valeur résiduelle estimée et la durée d’amortissement.'],
  payroll: ['Quelle grandeur sert de point de départ au salaire net et au coût direct de l’employeur ?', 'Le salaire brut. Les retenues donnent le net et les charges employeur s’ajoutent pour établir le coût.'],
  indicator: ['Pourquoi exprimer consommation et stock moyen dans la même unité ?', 'Leur quotient donne un nombre de rotations. Mélanger cartons et pièces fausse le résultat.'],
  result: ['Comment calculez-vous le résultat sur la période ?', 'Soustrayez les coûts du chiffre d’affaires sur le même périmètre et la même période.'],
  capital: ['Quelle base utilisez-vous pour imputer un intérêt au stock ?', 'La valeur moyenne du stock dans le périmètre du calcul. Appliquez le taux et la durée retenus.'],
  service: ['Comment interprétez-vous la progression de 80 % à 86 % ?', 'Le taux a gagné six points de pourcentage. Le calcul d’une hausse relative partirait de 80 %.'],
}

const followUps = {
  stock: 'Une nouvelle demande arrive pendant que l’emplacement contient des unités déjà affectées.',
  series: 'Au deuxième contrôle, les lots complets et les unités isolées figurent sur des lignes différentes.',
  planning: 'À la relève, le créneau a changé et une opération reste ouverte.',
  area: 'Un nouveau tracé de la zone réduit légèrement l’espace utile.',
  audit: 'Un contrôle a été refait après correction sur une autre série d’unités.',
  cost: 'Une offre révisée arrive avec des frais présentés dans un autre poste.',
  mass: 'Une nouvelle pesée est transmise après un changement de support.',
  levels: 'Le plan est révisé après la fermeture d’un niveau.',
  cadence: 'Le poste suivant annonce une reprise progressive après une interruption.',
  lever: 'Un autre groupe de cours déplace le point d’application de la force sur le modèle.',
  route: 'Le deuxième tronçon change et l’ancien délai figure encore au suivi.',
  tonneDistance: 'La masse du document est corrigée après l’établissement du calcul initial.',
  volume: 'Le fournisseur change de contenant alors que le volume déclaré reste identique.',
  tension: 'Le rapport d’essai change la section de l’échantillon sans réviser la force théorique.',
  depreciation: 'La valeur résiduelle estimée est révisée avant l’acceptation du plan.',
  payroll: 'Le décompte a été corrigé et les bases des charges doivent être revérifiées.',
  indicator: 'Un relevé de fin de période corrige la quantité prise comme référence.',
  result: 'Un coût oublié est ajouté après l’établissement du premier bilan.',
  capital: 'Le périmètre de stockage change au cours de la période comptable.',
  service: 'Le volume de demandes change entre deux périodes du suivi.',
}

function sections(blocks, reference) {
  const valid = blocks.filter((block) => block.kind === 'heading' && (block.text === reference || block.text.startsWith(reference + ' ')))
  if (valid.length !== 1) throw new Error(`Section introuvable ou ambiguë ${reference}`)
  return valid[0].text
}

for (const group of groups) {
  const [module, ...rows] = group.trim().split('\n').map((line) => line.trim()).filter(Boolean)
  if (!/^\d{3}$/.test(module) || !module.startsWith(theme[0])) throw new Error(`Module incompatible ${module}`)
  const course = readLogistiqueGeneratedBank(new URL(`../src/logistique/banks/module-${module}-v003.generated.ts`, import.meta.url)).find(({ kind }) => kind === 'theorie')
  const approvedFor = [...course.approvedFor]
  const previous = baseline.units.filter((unit) => unit.module === module)
  const taken = new Set(previous.map(({ prompt }) => prompt).filter(Boolean))
  const ids = new Set()
  const revisions = `dossiers-${theme}-v005`
  const candidates = { maths: [], verification: [], situation: [] }

  function add(kind, key, theorySection, [prompt, answer, calculation]) {
    const id = `log-${module}-${kind}-v005-${key}`
    if (ids.has(id) || taken.has(prompt) || !prompt || !answer) throw new Error(`Exercice incomplet ou doublon ${id}`)
    if (kind === 'maths' && !calculation) throw new Error(`Calcul manquant ${id}`)
    if (/NaN|Infinity/.test(answer + calculation)) throw new Error(`Résultat non fini ${id}`)
    ids.add(id)
    taken.add(prompt)
    candidates[kind].push({ id, module, kind, revision: revisions, approvedFor, theorySection, prompt, answer, ...(calculation ? { calculation } : {}) })
  }

  for (const row of rows) {
    const [id, reference, model, title, context, unit, operands, objective, rule, anomaly, action, evidence, consequence] = row.split(' | ')
    if (!/^[a-z0-9]+$/.test(id) || !consequence || !dossierMaths[model] || !modelQuestions[model] || !followUps[model]) {
      throw new Error(`Dossier incomplet ${module}/${id}`)
    }
    const theorySection = sections(course.blocks, reference)
    const values = operands.split(',').map(Number)
    if (values.length !== 6 || values.some((value) => !Number.isFinite(value) || value <= 0)) throw new Error(`Jeu de données invalide ${module}/${id}`)
    const calculations = dossierMaths[model](unit, values)
    for (const [index, [task, result, calculation]] of calculations.entries()) {
      add('maths', `${id}-${index + 1}`, theorySection, [`${context} ${task}`, result, calculation])
    }
    const facts = [
      [`${context} Quel objectif professionnel guide ce dossier ?`, objective],
      [`${context} Quel critère du cours appliquez-vous ici ?`, rule],
      [`${anomaly} Quelle mesure prenez-vous avant de continuer ?`, action],
      [`${context} Quelle information laissez-vous au poste suivant pour qu’il puisse contrôler le dossier ?`, evidence],
      [`${anomaly} Quelle conséquence le dossier cherche-t-il à éviter ?`, consequence],
      [`${title}. ${modelQuestions[model][0]}`, modelQuestions[model][1]],
    ]
    for (const [index, pair] of facts.entries()) add('verification', `${id}-${index + 1}`, theorySection, pair)
    const cases = [
      [`${context} Vous préparez l’opération. a) Formulez l’objectif. b) Expliquez le contrôle à prévoir. c) Indiquez la trace à préparer.`, `a) ${objective} b) ${rule} c) ${evidence}`],
      [`${anomaly} Vous reprenez le dossier. a) Indiquez la suite immédiate. b) Justifiez-la par une conséquence possible. c) Dites ce que votre collègue doit retrouver dans la trace.`, `a) ${action} b) ${consequence} c) ${evidence}`],
      [`${title}. ${followUps[model]} a) Indiquez le critère à vérifier sur la nouvelle donnée. b) Précisez ce que vous consignez. c) Expliquez le risque si l’ancienne conclusion est réutilisée.`, `a) ${rule} b) ${evidence} c) ${consequence}`],
    ]
    for (const [index, pair] of cases.entries()) add('situation', `${id}-${index + 1}`, theorySection, pair)
  }

  const glossary = previous.find(({ kind }) => kind === 'glossaire')
  for (const [index, block] of (glossary?.blocks ?? []).entries()) {
    if (block.kind !== 'paragraph') continue
    const definition = block.text.match(/^\{g\}([^{}]+)\{\/g\}\s*[—–-]\s*(.+)$/u)
    if (!definition) continue
    const [, term, answer] = definition
    const prompt = `Dans ce module, expliquez le terme « ${term} » avec vos propres mots.`
    add('verification', `terme-${index + 1}`, course.blocks[0].text, [prompt, answer])
  }

  for (const [kind, target] of Object.entries({ maths: 30, verification: 50, situation: 20 })) {
    const needed = Math.max(0, ...approvedFor.map((diploma) => target - previous.filter((u) => u.kind === kind && u.approvedFor.includes(diploma)).length))
    if (candidates[kind].length < needed) throw new Error(`Contenu insuffisant ${module}/${kind} · ${candidates[kind].length} sur ${needed}`)
    // Les questions sont prélevées par passes pour couvrir chaque dossier.
    const byDossier = new Map()
    for (const unit of candidates[kind]) {
      const key = unit.id.split('-v005-')[1].split('-')[0]
      if (!byDossier.has(key)) byDossier.set(key, [])
      byDossier.get(key).push(unit)
    }
    const banks = [...byDossier.values()]
    const interleaved = Array.from({ length: Math.max(...banks.map((bank) => bank.length)) }, (_, i) =>
      banks.flatMap((bank) => bank[i] ? [bank[i]] : [])).flat()
    additions.push(...interleaved.slice(0, needed))
  }
}

const entries = additions.map(({ id, module, kind, revision, approvedFor, theorySection, prompt, answer, calculation }) => {
  const fields = { theorySection, prompt, answer, ...(calculation ? { calculation } : {}) }
  return [
    '  {',
    `    id: '${id}', module: '${module}', kind: '${kind}', revision, approvedFor: ${approvedFor.includes('AFP') ? 'commun' : 'cfc'},`,
    ...Object.entries(fields).map(([key, value]) => `    ${key}: ${JSON.stringify(value)},`),
    '  },',
  ].join('\n')
})
const output = [
  "import type { LogistiqueUnit } from '../approved-banks'",
  '',
  `const revision = 'dossiers-${theme}-v005'`,
  ...new Set(additions.map(({ approvedFor }) => approvedFor.includes('AFP') ? "const commun = ['CFC', 'AFP'] as const" : "const cfc = ['CFC'] as const")),
  '',
  `export const dossierExercises${theme} = [`,
  ...entries,
  '] satisfies readonly LogistiqueUnit[]',
  '',
].join('\n')
if (existsSync(destination) && readFileSync(destination, 'utf8') !== output) {
  throw new Error(`La banque ${theme}-v005 existe déjà avec un autre contenu.`)
}
writeFileSync(destination, output)
console.log(`${theme} · ${groups.length} dossiers de module · ${additions.length} exercices`)
