/**
 * Génère src/francais/vocab-banks/fr-description.ts
 * à partir de soutien-scolaire (description physique) + adjectifs physiques.
 */
import fs from 'node:fs'
import path from 'node:path'

const SOUTIEN =
  '/tmp/soutien-scolaire/lib/curriculum/content/francais/vocab-v1-description-physique.ts'
const OUT = path.resolve('src/francais/vocab-banks/fr-description.ts')
const IMG = '/lib/images/vocabulaire/presenter'
const FAMILLE_IMG = '/lib/images/vocabulaire/famille'
const SANTE_IMG = '/lib/images/vocabulaire/sante'

/** Mots cibles (adjectifs / traits physiques). */
const TARGETS = [
  { id: 'grand', label: 'grand', soutien: 'grand', image: `${FAMILLE_IMG}/grand.webp`, antonym: 'petit' },
  { id: 'petit', label: 'petit', soutien: 'petit', image: `${IMG}/petit.webp`, antonym: 'grand' },
  { id: 'mince', label: 'mince', soutien: 'mince', image: `${IMG}/mince.webp`, antonym: 'gros' },
  { id: 'gros', label: 'gros', soutien: 'gros', image: `${IMG}/gros.webp`, antonym: 'mince' },
  { id: 'beau', label: 'beau', soutien: 'beau', image: `${IMG}/beau.webp`, antonym: 'laid' },
  { id: 'laid', label: 'laid', soutien: 'laid', image: `${IMG}/laid.webp`, antonym: 'beau' },
  { id: 'jeune', label: 'jeune', soutien: 'jeune', image: `${IMG}/jeune.webp`, antonym: 'âgé' },
  { id: 'age', label: 'âgé', soutien: 'âgé', image: `${IMG}/age.webp`, antonym: 'jeune' },
  { id: 'fort', label: 'fort', soutien: 'fort', image: `${IMG}/fort.webp`, antonym: 'faible' },
  { id: 'faible', label: 'faible', soutien: 'faible', image: `${IMG}/faible.webp`, antonym: 'fort' },
  { id: 'muscle', label: 'musclé', soutien: 'musclé' },
  { id: 'elegant', label: 'élégant', soutien: 'élégant' },
  { id: 'sportif', label: 'sportif', image: `${IMG}/homme.webp` },
  { id: 'court', label: 'court', soutien: 'court', image: `${IMG}/court.webp`, antonym: 'long', hair: true },
  { id: 'long', label: 'long', soutien: 'long', image: `${IMG}/long.webp`, antonym: 'court', hair: true },
  { id: 'boucle', label: 'bouclé', soutien: 'bouclé', hair: true },
  { id: 'frise', label: 'frisé', soutien: 'frisé', image: `${IMG}/frise.webp`, hair: true },
  { id: 'raide', label: 'raide', hair: true },
  { id: 'blond', label: 'blond', soutien: 'blond', image: `${IMG}/blond.webp`, hair: true },
  { id: 'brun', label: 'brun', soutien: 'brun', image: `${IMG}/brun.webp`, hair: true },
  { id: 'chatain', label: 'châtain', soutien: 'châtain', hair: true },
  { id: 'roux', label: 'roux', soutien: 'roux', image: `${IMG}/roux.webp`, hair: true },
  { id: 'noir', label: 'noir', hair: true },
  { id: 'chauve', label: 'chauve' },
  { id: 'barbu', label: 'barbu', image: `${IMG}/homme.webp` },
  { id: 'pale', label: 'pâle' },
  { id: 'bronze', label: 'bronzé' },
  { id: 'cheveux', label: 'cheveux', image: `${SANTE_IMG}/cheveux.webp`, noun: true },
  { id: 'yeux', label: 'yeux', noun: true },
  { id: 'barbe', label: 'barbe', noun: true },
]

const FEM = {
  grand: 'grande',
  petit: 'petite',
  mince: 'mince',
  gros: 'grosse',
  beau: 'belle',
  laid: 'laide',
  jeune: 'jeune',
  âgé: 'âgée',
  fort: 'forte',
  faible: 'faible',
  musclé: 'musclée',
  élégant: 'élégante',
  sportif: 'sportive',
  court: 'courte',
  long: 'longue',
  bouclé: 'bouclée',
  frisé: 'frisée',
  raide: 'raide',
  blond: 'blonde',
  brun: 'brune',
  châtain: 'châtaine',
  roux: 'rousse',
  noir: 'noire',
  chauve: 'chauve',
  barbu: 'barbue',
  pâle: 'pâle',
  bronzé: 'bronzée',
}

const SYLLABLES = {
  grand: ['grand'],
  petit: ['pe', 'tit'],
  mince: ['mince'],
  gros: ['gros'],
  beau: ['beau'],
  laid: ['laid'],
  jeune: ['jeune'],
  âgé: ['â', 'gé'],
  fort: ['fort'],
  faible: ['fai', 'ble'],
  musclé: ['mus', 'clé'],
  élégant: ['é', 'lé', 'gant'],
  sportif: ['spor', 'tif'],
  court: ['court'],
  long: ['long'],
  bouclé: ['bou', 'clé'],
  frisé: ['fri', 'sé'],
  raide: ['raide'],
  blond: ['blond'],
  brun: ['brun'],
  châtain: ['châ', 'tain'],
  roux: ['roux'],
  noir: ['noir'],
  chauve: ['chauve'],
  barbu: ['bar', 'bu'],
  pâle: ['pâle'],
  bronzé: ['bron', 'zé'],
  cheveux: ['che', 'veux'],
  yeux: ['yeux'],
  barbe: ['barbe'],
}

const EXTRA_DEFS = {
  sportif: 'Qui fait du sport ou qui a un corps athlétique.',
  raide: 'Se dit de cheveux sans boucles, bien droits.',
  noir: 'Qui a les cheveux de couleur noire.',
  chauve: 'Qui n’a plus (ou presque plus) de cheveux.',
  barbu: 'Qui a une barbe.',
  pâle: 'Qui a le visage peu coloré.',
  bronzé: 'Qui a la peau dorée par le soleil.',
  cheveux: 'Poils qui poussent sur la tête.',
  yeux: 'Organes de la vue, au milieu du visage.',
  barbe: 'Poils qui poussent sur le menton et les joues.',
}

const EXTRA_SYN = {
  sportif: 'athlétique',
  raide: 'lisse',
  noir: null,
  chauve: null,
  barbu: null,
  pâle: 'blême',
  bronzé: 'hâlé',
  cheveux: 'chevelure',
  yeux: null,
  barbe: null,
}

function uniq10(list, fallbackFn) {
  const out = []
  const seen = new Set()
  for (const s of list) {
    const t = String(s).trim()
    if (!t || seen.has(t)) continue
    seen.add(t)
    out.push(t)
    if (out.length >= 10) return out
  }
  let i = 0
  while (out.length < 10) {
    const t = fallbackFn(i++)
    if (seen.has(t)) continue
    seen.add(t)
    out.push(t)
  }
  return out
}

function a1For(word, hair, noun) {
  if (noun) {
    return [
      `Voici ses ${word}.`,
      `Regardez ses ${word}.`,
      `Il a de beaux ${word}.`,
      `Elle a de beaux ${word}.`,
      `Je décris ses ${word}.`,
      `Nous parlons des ${word}.`,
      `Écrivez le mot ${word}.`,
      `Le mot ${word} est utile.`,
      `J’apprends le mot ${word}.`,
      `Ses ${word} sont importants.`,
      `On voit ses ${word}.`,
      `Décrivez ses ${word}.`,
    ]
  }
  return [
    `Il est ${word}.`,
    `Tu es ${word} ?`,
    `Mon frère est ${word}.`,
    `Ce garçon est ${word}.`,
    `Je suis ${word}.`,
    `Le voisin est ${word}.`,
    `Mon ami est ${word}.`,
    `Ce monsieur est ${word}.`,
    `Voici quelqu’un de ${word}.`,
    `Nous apprenons le mot ${word}.`,
    `On dit qu’il est ${word}.`,
    `Le mot ${word} décrit une personne.`,
  ]
}

function a2For(word, hair, noun) {
  if (noun) {
    return [
      `Hier, j’ai remarqué ses ${word}.`,
      `Demain, je vais décrire ses ${word}.`,
      `Ce matin, le professeur a parlé des ${word}.`,
      `Quand je le vois, je regarde ses ${word}.`,
      `Avant, elle avait d’autres ${word}.`,
      `Pendant l’exercice, j’ai écrit le mot ${word}.`,
      `Après la leçon, j’ai révisé ${word}.`,
      `Nous avons associé ${word} à une image.`,
      `Le camarade a expliqué le mot ${word}.`,
      `J’ai ajouté ${word} dans mon carnet.`,
      `Pour décrire quelqu’un, on parle des ${word}.`,
      `Ce soir, je révise le vocabulaire des ${word}.`,
    ]
  }
  return [
    `Hier, j’ai rencontré un homme ${word}.`,
    `Demain, mon voisin ${word} vient nous voir.`,
    `Ce matin, il paraissait très ${word}.`,
    `Quand il était enfant, il était déjà ${word}.`,
    `Avant, mon frère était plus ${word}.`,
    `Pendant le cours, nous avons décrit un homme ${word}.`,
    `Le nouveau collègue est ${word} et sympathique.`,
    `Mon ami paraît ${word} sur la photo.`,
    `Après la leçon, j’ai utilisé le mot ${word}.`,
    `Nous allons réviser ${word} avant l’évaluation.`,
    `J’ai ajouté ${word} dans mon carnet de vocabulaire.`,
    `Le professeur a demandé un exemple avec ${word}.`,
  ]
}

function b1For(word, hair, noun) {
  if (noun) {
    return [
      `Bien que ses ${word} soient discrets, on les remarque.`,
      `Si je décris bien ses ${word}, le portrait sera clair.`,
      `Comme les ${word} aident à reconnaître quelqu’un, je les note.`,
      `Même si le mot ${word} paraît simple, il faut un contexte.`,
      `Lorsque j’oublie le mot ${word}, je regarde l’image.`,
      `Puisque ${word} est utile, je le révise souvent.`,
      `Pendant que les autres lisaient, j’ai cherché un exemple avec ${word}.`,
      `Le professeur, qui enrichit notre lexique, demande d’employer ${word}.`,
      `Bien que j’aie appris ${word}, je dois encore le prononcer.`,
      `Comme ${word} apparaît dans la leçon, je l’ai noté.`,
      `Si je comprends ${word}, je pourrai décrire une personne.`,
      `Lorsque j’aurai mémorisé ${word}, je l’utiliserai naturellement.`,
    ]
  }
  return [
    `Bien qu’il soit fatigué, il reste ${word}.`,
    `Si tu le connaissais mieux, tu verrais qu’il est ${word}.`,
    `Comme il est ${word}, on le remarque tout de suite.`,
    `Même quand la journée est difficile, il demeure ${word}.`,
    `On dit qu’il est ${word}, mais cela dépend de la situation.`,
    `Lorsqu’il arrive dans un groupe, il paraît ${word}.`,
    `Bien que le mot ${word} paraisse simple, il faut un contexte clair.`,
    `Comme ${word} apparaît souvent, je l’ai noté dans mon cahier.`,
    `Si je comprends bien ${word}, je pourrai l’employer correctement.`,
    `Lorsque j’aurai mémorisé ${word}, je l’utiliserai plus naturellement.`,
    `Puisque ${word} est utile pour décrire, je le révise régulièrement.`,
    `Le professeur, qui enrichit notre lexique, demande d’utiliser ${word}.`,
  ]
}

function toTrous(sentence, word) {
  const re = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
  if (!re.test(sentence)) return `${sentence.replace(/\.$/, '')} ___.`
  return sentence.replace(re, '___')
}

function parseSoutien() {
  const src = fs.readFileSync(SOUTIEN, 'utf8')
  const blocks = src.split(/\n\s*\{\s*\n\s*word:/).slice(1)
  const map = new Map()
  for (const block of blocks) {
    const wordM = block.match(/^\s*"([^"]+)"/)
    if (!wordM) continue
    const word = wordM[1]
    const femM = block.match(/feminine:\s*"([^"]+)"/)
    const defM = block.match(/definition:\s*\[\s*"([^"]+)"/)
    const synM = block.match(/synonym:\s*\[([^\]]*)\]/)
    const synonyms = synM ? [...synM[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]) : []
    const a1 = [...(block.match(/a1:\s*\[([\s\S]*?)\]/)?.[1] ?? '').matchAll(/"([^"]+)"/g)].map((m) => m[1])
    const a2 = [...(block.match(/a2:\s*\[([\s\S]*?)\]/)?.[1] ?? '').matchAll(/"([^"]+)"/g)].map((m) => m[1])
    const b1 = [...(block.match(/b1:\s*\[([\s\S]*?)\]/)?.[1] ?? '').matchAll(/"([^"]+)"/g)].map((m) => m[1])
    map.set(word, { word, feminine: femM?.[1], definition: defM?.[1], synonyms, a1, a2, b1 })
  }
  return map
}

function genderPair(label) {
  const fem = FEM[label]
  if (!fem || fem === label) return null
  return { masculine: label, feminine: fem }
}

function containsExact(sentence, word) {
  const re = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
  return re.test(sentence)
}

function buildEntry(target, soutienMap) {
  const soutien = target.soutien ? soutienMap.get(target.soutien) : null
  const label = target.label
  const hair = !!target.hair
  const noun = !!target.noun
  const definition =
    soutien?.definition ?? EXTRA_DEFS[label] ?? `Adjectif pour décrire une personne.`
  const soutienA1 = (soutien?.a1 ?? []).filter((s) => containsExact(s, label))
  const soutienA2 = (soutien?.a2 ?? []).filter((s) => containsExact(s, label))
  const soutienB1 = (soutien?.b1 ?? []).filter((s) => containsExact(s, label))
  const a1 = uniq10([...soutienA1, ...a1For(label, hair, noun)], (i) => `Phrase A1 ${i + 1} avec ${label}.`)
  const a2 = uniq10([...soutienA2, ...a2For(label, hair, noun)], (i) => `Phrase A2 ${i + 1} avec ${label}.`)
  const b1 = uniq10([...soutienB1, ...b1For(label, hair, noun)], (i) => `Phrase B1 ${i + 1} avec ${label}.`)
  const shift = (arr, n) => [...arr.slice(n), ...arr.slice(0, n)]
  const makeSentences = (offset) => ({
    a1: uniq10(shift(a1, offset), (i) => a1[i % a1.length]),
    a2: uniq10(shift(a2, offset), (i) => a2[i % a2.length]),
    b1: uniq10(shift(b1, offset), (i) => b1[i % b1.length]),
  })
  const dictee = makeSentences(0)
  const trousBase = makeSentences(2)
  const phrase = makeSentences(4)
  const trous = {
    a1: trousBase.a1.map((s) => toTrous(s, label)),
    a2: trousBase.a2.map((s) => toTrous(s, label)),
    b1: trousBase.b1.map((s) => toTrous(s, label)),
  }
  const synonym = soutien?.synonyms?.[0] ?? EXTRA_SYN[label] ?? undefined
  const antonym = target.antonym
  const gender = noun ? null : genderPair(label)

  return {
    id: target.id,
    label,
    imageSrc: target.image,
    definition,
    syllables: SYLLABLES[label] ?? [label],
    synonym: synonym || undefined,
    antonym: antonym || undefined,
    masculine: gender?.masculine,
    feminine: gender?.feminine,
    sentences: { trous, phrase, dictee },
  }
}

function esc(s) {
  return JSON.stringify(s)
}

function emit(entries) {
  const lines = []
  lines.push(`/** Banque Voc « La description » — générée par scripts/gen-vocab-description-bank.mjs */`)
  lines.push(`import type { VocabWordEntry } from '../vocab-learn'`)
  lines.push(``)
  lines.push(`export const FR_DESCRIPTION_VOCAB: VocabWordEntry[] = [`)
  for (const e of entries) {
    lines.push(`  {`)
    lines.push(`    id: ${esc(e.id)},`)
    lines.push(`    label: ${esc(e.label)},`)
    if (e.imageSrc) lines.push(`    imageSrc: ${esc(e.imageSrc)},`)
    lines.push(`    definition: ${esc(e.definition)},`)
    lines.push(`    syllables: ${esc(e.syllables)},`)
    if (e.synonym) lines.push(`    synonym: ${esc(e.synonym)},`)
    if (e.antonym) lines.push(`    antonym: ${esc(e.antonym)},`)
    if (e.masculine) lines.push(`    masculine: ${esc(e.masculine)},`)
    if (e.feminine) lines.push(`    feminine: ${esc(e.feminine)},`)
    lines.push(`    sentences: {`)
    for (const kind of ['trous', 'phrase', 'dictee']) {
      lines.push(`      ${kind}: {`)
      for (const lvl of ['a1', 'a2', 'b1']) {
        lines.push(`        ${lvl}: [`)
        for (const s of e.sentences[kind][lvl]) lines.push(`          ${esc(s)},`)
        lines.push(`        ],`)
      }
      lines.push(`      },`)
    }
    lines.push(`    },`)
    lines.push(`  },`)
  }
  lines.push(`]`)
  lines.push(``)
  return lines.join('\n')
}

const soutienMap = parseSoutien()
const entries = TARGETS.map((t) => buildEntry(t, soutienMap))
fs.mkdirSync(path.dirname(OUT), { recursive: true })
fs.writeFileSync(OUT, emit(entries))
console.log('Wrote', OUT, 'words=', entries.length)
