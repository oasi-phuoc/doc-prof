/**
 * Génère src/francais/vocab-banks/fr-presenter.ts
 * à partir de soutien-scolaire (nationalités) + gabarits pour identité.
 */
import fs from 'node:fs'
import path from 'node:path'

const SOUTIEN = '/tmp/soutien-scolaire/lib/curriculum/content/francais/vocab-v1-nationalites.ts'
const OUT = path.resolve('src/francais/vocab-banks/fr-presenter.ts')
const PRESENTER_IMG = '/lib/images/vocabulaire/presenter'
const ADMIN_IMG = '/lib/images/vocabulaire/administration'

const IMAGE = {
  identite: `${ADMIN_IMG}/carte-didentite.webp`,
  age: `${PRESENTER_IMG}/age.webp`,
  francais: `${PRESENTER_IMG}/france.webp`,
  anglais: `${PRESENTER_IMG}/angleterre.webp`,
  chinois: `${PRESENTER_IMG}/chine.webp`,
  americain: `${PRESENTER_IMG}/etats-unis.webp`,
  italien: `${PRESENTER_IMG}/italie.webp`,
  espagnole: `${PRESENTER_IMG}/espagne.webp`,
  allemand: `${PRESENTER_IMG}/allemagne.webp`,
  suisse: `${PRESENTER_IMG}/suisse.webp`,
  belge: `${PRESENTER_IMG}/belgique.webp`,
  russe: `${PRESENTER_IMG}/russie.webp`,
  ukrainien: `${PRESENTER_IMG}/ukraine.webp`,
  afghan: `${PRESENTER_IMG}/afghanistan.webp`,
  turque: `${PRESENTER_IMG}/turquie.webp`,
  somalien: `${PRESENTER_IMG}/somalie.webp`,
  erythreen: `${PRESENTER_IMG}/erythree.webp`,
  portugais: `${PRESENTER_IMG}/portugal.webp`,
}

/** Alignement id ClairFLE ↔ mot soutien / label */
const TARGETS = [
  { id: 'identite', label: 'identité', country: null },
  { id: 'nom', label: 'nom', country: null },
  { id: 'prenom', label: 'prénom', country: null },
  { id: 'age', label: 'âge', country: null },
  { id: 'nationalite', label: 'nationalité', country: null },
  { id: 'francais', label: 'français', soutien: 'français', country: 'France' },
  { id: 'anglais', label: 'anglais', soutien: 'anglais', country: 'Angleterre' },
  { id: 'chinois', label: 'chinois', soutien: 'chinois', country: 'Chine' },
  { id: 'americain', label: 'américain', soutien: 'américain', country: 'États-Unis' },
  { id: 'italien', label: 'italien', soutien: 'italien', country: 'Italie' },
  { id: 'bresilien', label: 'brésilien', soutien: null, country: 'Brésil' },
  { id: 'coreen', label: 'coréen', soutien: null, country: 'Corée' },
  { id: 'espagnole', label: 'espagnole', soutien: 'espagnol', country: 'Espagne', forceFem: true },
  { id: 'allemand', label: 'allemand', soutien: 'allemand', country: 'Allemagne' },
  { id: 'suisse', label: 'suisse', soutien: 'suisse', country: 'Suisse' },
  { id: 'belge', label: 'belge', soutien: 'belge', country: 'Belgique' },
  { id: 'russe', label: 'russe', soutien: 'russe', country: 'Russie' },
  { id: 'ukrainien', label: 'ukrainien', soutien: 'ukrainien', country: 'Ukraine' },
  { id: 'afghan', label: 'afghan', soutien: 'afghan', country: 'Afghanistan' },
  { id: 'turque', label: 'turque', soutien: 'turc', country: 'Turquie', forceFem: true },
  { id: 'somalien', label: 'somalien', soutien: 'somalien', country: 'Somalie' },
  { id: 'erythreen', label: 'érythréen', soutien: 'érythréen', country: 'Érythrée' },
  { id: 'portugais', label: 'portugais', soutien: 'portugais', country: 'Portugal' },
]

const FEM = {
  français: 'française',
  anglais: 'anglaise',
  chinois: 'chinoise',
  américain: 'américaine',
  italien: 'italienne',
  brésilien: 'brésilienne',
  coréen: 'coréenne',
  espagnol: 'espagnole',
  espagnole: 'espagnol',
  allemand: 'allemande',
  ukrainien: 'ukrainienne',
  afghan: 'afghane',
  turc: 'turque',
  turque: 'turc',
  somalien: 'somalienne',
  érythréen: 'érythréenne',
  portugais: 'portugaise',
}

const SYLLABLES = {
  identité: ['i', 'den', 'ti', 'té'],
  nom: ['nom'],
  prénom: ['pré', 'nom'],
  âge: ['âge'],
  nationalité: ['na', 'tio', 'na', 'li', 'té'],
  français: ['fran', 'çais'],
  anglais: ['an', 'glais'],
  chinois: ['chi', 'nois'],
  américain: ['a', 'mé', 'ri', 'cain'],
  italien: ['i', 'ta', 'lien'],
  brésilien: ['bré', 'si', 'lien'],
  coréen: ['co', 'ré', 'en'],
  espagnole: ['es', 'pa', 'gnole'],
  allemand: ['al', 'le', 'mand'],
  suisse: ['suisse'],
  belge: ['belge'],
  russe: ['russe'],
  ukrainien: ['u', 'kraï', 'nien'],
  afghan: ['af', 'ghan'],
  turque: ['turque'],
  somalien: ['so', 'ma', 'lien'],
  érythréen: ['é', 'ry', 'thré', 'en'],
  portugais: ['por', 'tu', 'gais'],
}

const IDENTITY_DEFS = {
  identité: 'Ensemble des informations qui permettent de reconnaître une personne.',
  nom: 'Nom de famille d’une personne.',
  prénom: 'Premier nom donné à une personne à sa naissance.',
  âge: 'Nombre d’années depuis la naissance.',
  nationalité: 'Pays dont une personne est citoyenne.',
}

const SYN = {
  identité: { synonym: 'état civil', antonym: null },
  nom: { synonym: 'patronyme', antonym: null },
  prénom: { synonym: null, antonym: null },
  âge: { synonym: null, antonym: null },
  nationalité: { synonym: 'citoyenneté', antonym: null },
  suisse: { synonym: 'helvétique', antonym: null },
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

function a1Templates(word, country) {
  if (country) {
    return [
      `Je suis ${word}.`,
      `Elle est ${word}.`,
      `Il est ${word}.`,
      `Tu es ${word} ?`,
      `Nous sommes ${word}.`,
      `Mon ami est ${word}.`,
      `Ma voisine est ${word}.`,
      `Le professeur est ${word}.`,
      `Je viens de ${country}.`,
      `Voici un élève ${word}.`,
      `C’est un touriste ${word}.`,
      `Elle s’appelle et elle est ${word}.`,
    ]
  }
  return [
    `Voici mon ${word}.`,
    `Quel est ton ${word} ?`,
    `J’écris mon ${word}.`,
    `Je dis mon ${word}.`,
    `Regardez mon ${word}.`,
    `Complétez le ${word}.`,
    `C’est mon ${word}.`,
    `Donnez votre ${word}.`,
    `Le ${word} est important.`,
    `Je connais mon ${word}.`,
    `Écrivez votre ${word} ici.`,
    `Quel ${word} avez-vous ?`,
  ]
}

function a2Templates(word, country) {
  if (country) {
    return [
      `Hier, j’ai rencontré un ami ${word}.`,
      `Demain, une voisine ${word} vient chez nous.`,
      `Le nouveau collègue est ${word} et parle français.`,
      `Ce matin, un client ${word} a demandé de l’aide.`,
      `Nous avons parlé avec un touriste ${word}.`,
      `Avant, mon voisin ${word} habitait près de l’école.`,
      `Le professeur ${word} a expliqué la leçon.`,
      `Je connais un médecin ${word} depuis longtemps.`,
      `Un ami ${word} va nous accompagner samedi.`,
      `Pendant l’exercice, j’ai écrit une phrase avec ${word}.`,
      `Après la leçon, j’ai utilisé le mot ${word}.`,
      `Nous allons réviser ${word} avant l’évaluation.`,
    ]
  }
  return [
    `Hier, j’ai écrit mon ${word} sur le formulaire.`,
    `Demain, je vais vérifier mon ${word}.`,
    `Ce matin, le professeur a demandé mon ${word}.`,
    `Quand j’arrive en classe, je donne mon ${word}.`,
    `Avant l’examen, j’ai noté mon ${word}.`,
    `Nous avons appris le mot ${word} aujourd’hui.`,
    `Pendant l’exercice, j’ai complété le ${word}.`,
    `Après la leçon, j’ai révisé mon ${word}.`,
    `Le secrétaire a demandé mon ${word}.`,
    `J’explique le sens du mot ${word} à mon camarade.`,
    `Dans mon carnet, j’ajoute le mot ${word}.`,
    `Pour m’inscrire, j’indique mon ${word}.`,
  ]
}

function b1Templates(word, country) {
  if (country) {
    return [
      `Bien qu’il soit ${word}, il parle très bien français.`,
      `Si cet élève ${word} reste ici, il progressera rapidement.`,
      `Comme le client ${word} ne comprenait pas, nous avons ralenti.`,
      `Même si elle est ${word}, elle se sent déjà chez elle.`,
      `Le professeur ${word} dont je parle enseigne depuis des années.`,
      `Pendant que l’élève ${word} écrivait, son voisin l’aidait.`,
      `Puisque ${word} est utile, je le révise régulièrement.`,
      `Lorsque j’aurai mémorisé ${word}, je l’emploierai plus naturellement.`,
      `Bien que le mot ${word} paraisse simple, il faut un contexte clair.`,
      `Comme ${word} apparaît souvent, je l’ai noté dans mon cahier.`,
      `Si je comprends bien ${word}, je pourrai l’utiliser correctement.`,
      `Le voisin ${word}, que nous avons rencontré hier, connaît bien la ville.`,
    ]
  }
  return [
    `Bien que le ${word} soit simple, il faut l’écrire correctement.`,
    `Si je connais mon ${word}, je remplis le formulaire sans erreur.`,
    `Comme le ${word} est demandé partout, je l’ai appris par cœur.`,
    `Même si je connais déjà mon ${word}, je le vérifie encore.`,
    `Lorsque j’oublie mon ${word}, je demande de l’aide.`,
    `Puisque le ${word} sert à m’identifier, je l’écris clairement.`,
    `Pendant que je copie mon ${word}, mon camarade m’explique la consigne.`,
    `Bien que j’aie noté mon ${word}, je dois encore le mémoriser.`,
    `Comme le professeur insiste sur le ${word}, je le révise ce soir.`,
    `Si mon ${word} est incomplet, le dossier est refusé.`,
    `Lorsque j’explique le ${word}, j’utilise une phrase personnelle.`,
    `Même si le ${word} paraît évident, certains élèves le confondent.`,
  ]
}

function toTrous(sentence, word) {
  const re = new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
  if (!re.test(sentence)) return sentence.replace(/\.$/, '') + ' ___.'
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
    const synonyms = synM
      ? [...synM[1].matchAll(/"([^"]+)"/g)].map((m) => m[1])
      : []
    const a1 = [...(block.match(/a1:\s*\[([\s\S]*?)\]/)?.[1] ?? '').matchAll(/"([^"]+)"/g)].map((m) => m[1])
    const a2 = [...(block.match(/a2:\s*\[([\s\S]*?)\]/)?.[1] ?? '').matchAll(/"([^"]+)"/g)].map((m) => m[1])
    const b1 = [...(block.match(/b1:\s*\[([\s\S]*?)\]/)?.[1] ?? '').matchAll(/"([^"]+)"/g)].map((m) => m[1])
    map.set(word, {
      word,
      feminine: femM?.[1],
      definition: defM?.[1] ?? `Personne qui vient de ce pays.`,
      synonyms,
      a1,
      a2,
      b1,
    })
  }
  return map
}

function genderPair(label, forceFem, soutien) {
  if (label === 'suisse' || label === 'belge' || label === 'russe') return null
  if (forceFem) {
    const masc = FEM[label] ?? soutien?.word
    return masc && masc !== label ? { masculine: masc, feminine: label } : null
  }
  const fem = soutien?.feminine ?? FEM[label]
  return fem ? { masculine: label, feminine: fem } : null
}

function buildEntry(target, soutienMap) {
  const soutien = target.soutien ? soutienMap.get(target.soutien) : null
  const label = target.label
  const country = target.country
  const definition =
    IDENTITY_DEFS[label] ??
    (soutien?.definition && !soutien.definition.includes('Matière')
      ? soutien.definition
      : country
        ? `Personne qui vient de ${country}.`
        : `Mot du thème Se présenter.`)

  const a1 = uniq10([...(soutien?.a1 ?? []), ...a1Templates(label, country)], (i) => `Phrase A1 ${i + 1} avec ${label}.`)
  const a2 = uniq10([...(soutien?.a2 ?? []), ...a2Templates(label, country)], (i) => `Phrase A2 ${i + 1} avec ${label}.`)
  const b1 = uniq10([...(soutien?.b1 ?? []), ...b1Templates(label, country)], (i) => `Phrase B1 ${i + 1} avec ${label}.`)

  // Variantes par type : décaler pour unicité relative
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

  const synMeta = SYN[label] ?? SYN[target.id] ?? {}
  const synonym = synMeta.synonym ?? soutien?.synonyms?.[0] ?? null
  const antonym = synMeta.antonym ?? null
  const gender = genderPair(label, !!target.forceFem, soutien)

  return {
    id: target.id,
    label,
    imageSrc: IMAGE[target.id],
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
  lines.push(`/** Banque Voc « Se présenter » — générée par scripts/gen-vocab-presenter-bank.mjs */`)
  lines.push(`import type { VocabWordEntry } from '../vocab-learn'`)
  lines.push(``)
  lines.push(`export const FR_PRESENTER_VOCAB: VocabWordEntry[] = [`)
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
