/**
 * Importe les banques Voc depuis soutien-scolaire → src/francais/vocab-banks/
 * et produit src/francais/vocab-topic-map.ts (thèmes + sous-groupes).
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve('.')
const SOUTIEN = '/tmp/soutien-scolaire/lib/curriculum/content/francais'
const OUT_DIR = path.join(ROOT, 'src/francais/vocab-banks')
const PUBLIC = path.join(ROOT, 'public')

/** Mapping ClairFLE topic → sous-groupes soutien (fichiers + libellés). */
const TOPIC_MAP = [
  {
    id: 'fr-achats',
    label: 'Achats',
    grammar: 'place de l’adjectif et quantité',
    vocab: 'vêtements, accessoires et prix',
    subgroups: [
      { id: 'v6-vetements', file: 'vocab-v6-vetements.ts', label: 'Vêtements' },
      { id: 'v6-accessoires', file: 'vocab-v6-accessoires.ts', label: 'Accessoires' },
      { id: 'v6-couleurs', file: 'vocab-v6-couleurs.ts', label: 'Couleurs' },
      { id: 'v6-matieres', file: 'vocab-v6-matieres.ts', label: 'Matières' },
    ],
  },
  {
    id: 'fr-commerces',
    label: 'Commerces',
    grammar: 'articles partitifs et politesse',
    vocab: 'restaurant et boulangerie',
    subgroups: [
      { id: 'v7-restaurant', file: 'vocab-v7-restaurant.ts', label: 'Restaurant' },
      { id: 'v7-boulangerie', file: 'vocab-v7-boulangerie.ts', label: 'Boulangerie' },
    ],
  },
  {
    id: 'fr-description',
    label: 'Description',
    grammar: 'accord des adjectifs de description',
    vocab: 'description physique et morale',
    subgroups: [
      { id: 'v1-description-physique', file: 'vocab-v1-description-physique.ts', label: 'Physique' },
      { id: 'v1-description-morale', file: 'vocab-v1-description-morale.ts', label: 'Morale' },
    ],
  },
  {
    id: 'fr-ecole',
    label: 'École',
    grammar: 'articles et prépositions de lieu',
    vocab: 'matières, matériel et structure',
    subgroups: [
      { id: 'v5-matieres', file: 'vocab-v5-matieres.ts', label: 'Matières' },
      { id: 'v5-materiel-scolaire', file: 'vocab-v5-materiel-scolaire.ts', label: 'Matériel' },
      { id: 'v5-structure-ecole', file: 'vocab-v5-structure-ecole.ts', label: 'Structure' },
    ],
  },
  {
    id: 'fr-famille',
    label: 'Famille',
    grammar: 'adjectifs possessifs',
    vocab: 'liens de parenté et état civil',
    subgroups: [
      { id: 'v1-famille', file: 'vocab-v1-famille.ts', label: 'Parenté' },
      { id: 'v1-etat-civil', file: 'vocab-v1-etat-civil.ts', label: 'État civil' },
    ],
  },
  {
    id: 'fr-presenter',
    label: 'Identité',
    grammar: 'être, avoir et s’appeler',
    vocab: 'nationalités et professions',
    subgroups: [
      { id: 'v1-nationalites', file: 'vocab-v1-nationalites.ts', label: 'Nationalités' },
      { id: 'v1-professions', file: 'vocab-v1-professions.ts', label: 'Professions' },
    ],
  },
  {
    id: 'fr-logement',
    label: 'Logement',
    grammar: 'articles définis et indéfinis',
    vocab: 'logement, pièces et équipements',
    subgroups: [
      { id: 'v4-type-logement', file: 'vocab-v4-type-logement.ts', label: 'Types' },
      { id: 'v4-pieces-maison', file: 'vocab-v4-pieces-maison.ts', label: 'Pièces' },
      { id: 'v4-equipements', file: 'vocab-v4-equipements.ts', label: 'Meubles' },
      { id: 'v4-appareils-electromenagers', file: 'vocab-v4-appareils-electromenagers.ts', label: 'Électroménager' },
      { id: 'v4-pannes', file: 'vocab-v4-pannes.ts', label: 'Pannes' },
    ],
  },
  {
    id: 'fr-loisirs',
    label: 'Loisirs',
    grammar: 'pronoms COD',
    vocab: 'sport et activités',
    subgroups: [{ id: 'v3-sport', file: 'vocab-v3-sport.ts', label: 'Sport' }],
  },
  {
    id: 'fr-nourriture',
    label: 'Nourriture',
    grammar: 'articles partitifs',
    vocab: 'fruits, légumes, cuisine et quantités',
    subgroups: [
      { id: 'v7-fruits', file: 'vocab-v7-fruits.ts', label: 'Fruits' },
      { id: 'v7-legumes', file: 'vocab-v7-legumes.ts', label: 'Légumes' },
      { id: 'v7-cuisine', file: 'vocab-v7-cuisine.ts', label: 'Cuisine' },
      { id: 'v7-recettes', file: 'vocab-v7-recettes.ts', label: 'Recettes' },
      { id: 'v7-quantites', file: 'vocab-v7-quantites.ts', label: 'Quantités' },
    ],
  },
  {
    id: 'fr-sante',
    label: 'Santé',
    grammar: 'il faut et devoir',
    vocab: 'corps, maladies et pharmacie',
    subgroups: [
      { id: 'v8-corps', file: 'vocab-v8-corps.ts', label: 'Corps' },
      { id: 'v8-maladies', file: 'vocab-v8-maladies.ts', label: 'Maladies' },
      { id: 'v8-medecins', file: 'vocab-v8-medecins.ts', label: 'Médecins' },
      { id: 'v8-pharmacie', file: 'vocab-v8-pharmacie.ts', label: 'Pharmacie' },
    ],
  },
  {
    id: 'fr-temps',
    label: 'Temps',
    grammar: 'prépositions de temps',
    vocab: 'jours, heure, saisons et météo',
    subgroups: [
      { id: 'v2-jours-mois-dates', file: 'vocab-v2-jours-mois-dates.ts', label: 'Jours et dates' },
      { id: 'v2-heure', file: 'vocab-v2-heure.ts', label: 'Heure' },
      { id: 'v2-saisons', file: 'vocab-v2-saisons.ts', label: 'Saisons' },
      { id: 'v2-meteo', file: 'vocab-v2-meteo.ts', label: 'Météo' },
    ],
  },
  {
    id: 'fr-transports',
    label: 'Transports',
    grammar: 'aller au présent',
    vocab: 'transports, gare et aéroport',
    subgroups: [
      { id: 'v9-transport', file: 'vocab-v9-transport.ts', label: 'Moyens' },
      { id: 'v9-train', file: 'vocab-v9-train.ts', label: 'Gare' },
      { id: 'v9-aeroport', file: 'vocab-v9-aeroport.ts', label: 'Aéroport' },
    ],
  },
  {
    id: 'fr-ville',
    label: 'Ville',
    grammar: 'il y a et prépositions de lieu',
    vocab: 'ville, directions et culture',
    subgroups: [
      { id: 'v9-ville', file: 'vocab-v9-ville.ts', label: 'Lieux' },
      { id: 'v9-direction', file: 'vocab-v9-direction.ts', label: 'Directions' },
      { id: 'v9-espace-culturel', file: 'vocab-v9-espace-culturel.ts', label: 'Culture' },
      { id: 'v9-paysage', file: 'vocab-v9-paysage.ts', label: 'Paysage' },
    ],
  },
  {
    id: 'fr-voyage',
    label: 'Voyage',
    grammar: 'futur proche et expressions de voyage',
    vocab: 'paysage, hôtel et animaux',
    subgroups: [
      { id: 'v9-paysage', file: 'vocab-v9-paysage.ts', label: 'Paysage' },
      { id: 'v9-hotel', file: 'vocab-v9-hotel.ts', label: 'Hôtel' },
      { id: 'v10-animaux', file: 'vocab-v10-animaux.ts', label: 'Animaux' },
    ],
  },
]

/** Thèmes FR sans banque soutien (gram / com seulement). */
const EXTRA_TOPICS = [
  { id: 'fr-inviter', label: 'Invitation', grammar: 'questions formelles et informelles', vocab: 'invitations et sorties' },
  { id: 'fr-journee', label: 'Quotidien', grammar: 'verbes pronominaux', vocab: 'routine quotidienne' },
  { id: 'fr-travail', label: 'Travail', grammar: 'accord des adjectifs', vocab: 'métiers et bureau' },
]

function walkImages(dir, map = new Map()) {
  if (!fs.existsSync(dir)) return map
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name)
    const st = fs.statSync(full)
    if (st.isDirectory()) walkImages(full, map)
    else if (/\.webp$/i.test(name)) {
      const key = name.toLowerCase()
      if (!map.has(key)) map.set(key, full)
    }
  }
  return map
}

const imageIndex = walkImages(path.join(PUBLIC, 'lib/images/vocabulaire'))
walkImages(path.join(PUBLIC, 'assets/words/vocab'), imageIndex)

function publicUrl(absPath) {
  const rel = path.relative(PUBLIC, absPath).split(path.sep).join('/')
  return `/${rel}`
}

function resolveImage(filename, sectionHint) {
  if (!filename) return undefined
  const base = filename.replace(/^.*\//, '')
  const key = base.toLowerCase()
  // Prefer themed lib folder matching section hints
  const hints = []
  if (sectionHint) {
    const s = sectionHint.toUpperCase()
    const map = {
      V1: ['presenter', 'famille', 'administration'],
      V2: ['journee', 'nature'],
      V3: ['loisirs'],
      V4: ['logement'],
      V5: ['ecole'],
      V6: ['vetements', 'couleurs', 'achats'],
      V7: ['nourriture'],
      V8: ['sante'],
      V9: ['transports', 'animaux', 'nature'],
      V10: ['animaux', 'nourriture', 'transports', 'achats'],
    }
    hints.push(...(map[s] ?? []))
  }
  for (const folder of hints) {
    const candidate = path.join(PUBLIC, 'lib/images/vocabulaire', folder, base)
    if (fs.existsSync(candidate) && !isLfsPointer(candidate)) return publicUrl(candidate)
  }
  const hit = imageIndex.get(key)
  if (hit && !isLfsPointer(hit)) return publicUrl(hit)
  // assets V*
  if (sectionHint) {
    const asset = path.join(PUBLIC, 'assets/words/vocab', sectionHint.toUpperCase(), base)
    if (fs.existsSync(asset) && !isLfsPointer(asset)) return publicUrl(asset)
  }
  return undefined
}

function isLfsPointer(file) {
  try {
    const head = fs.readFileSync(file, { encoding: 'utf8', flag: 'r' }).slice(0, 40)
    return head.startsWith('version https://git-lfs.github.com')
  } catch {
    return true
  }
}

function slugify(word) {
  return word
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function syllablesOf(word) {
  const clean = word.toLowerCase().replace(/[^a-zàâäéèêëïîôùûüç'-]/gi, '')
  if (clean.length <= 3) return [clean]
  const parts = clean.split(/(?<=[aeiouyàâäéèêëïîôùûü])(?=[^aeiouyàâäéèêëïîôùûü])/i)
  return parts.filter(Boolean).length ? parts.filter(Boolean) : [clean]
}

function extractArrayBlock(src, key) {
  const re = new RegExp(`${key}\\s*:\\s*\\[`, 'm')
  const m = re.exec(src)
  if (!m) return []
  let i = m.index + m[0].length - 1
  let depth = 0
  let start = -1
  for (; i < src.length; i++) {
    if (src[i] === '[') {
      if (depth === 0) start = i
      depth++
    } else if (src[i] === ']') {
      depth--
      if (depth === 0) {
        try {
          return Function(`"use strict"; return (${src.slice(start, i + 1)});`)()
        } catch {
          return []
        }
      }
    }
  }
  return []
}

function parseThemeFile(filePath) {
  const src = fs.readFileSync(filePath, 'utf8')
  const section = /section:\s*"([^"]+)"/.exec(src)?.[1] ?? 'V1'
  const imageFolder = /imageFolder:\s*"([^"]+)"/.exec(src)?.[1] ?? section
  const code = /code:\s*"([^"]+)"/.exec(src)?.[1] ?? ''
  const title = /title:\s*"([^"]+)"/.exec(src)?.[1] ?? ''
  // Extract words array by finding words: [
  const wordsMatch = /words:\s*\[/.exec(src)
  if (!wordsMatch) return { section, imageFolder, code, title, words: [] }
  let i = wordsMatch.index + wordsMatch[0].length - 1
  let depth = 0
  let start = -1
  for (; i < src.length; i++) {
    if (src[i] === '[') {
      if (depth === 0) start = i
      depth++
    } else if (src[i] === ']') {
      depth--
      if (depth === 0) break
    }
  }
  const wordsSrc = src.slice(start, i + 1)
  // Split top-level objects
  const objects = []
  let d = 0
  let objStart = -1
  for (let j = 0; j < wordsSrc.length; j++) {
    const ch = wordsSrc[j]
    if (ch === '{') {
      if (d === 0) objStart = j
      d++
    } else if (ch === '}') {
      d--
      if (d === 0 && objStart >= 0) {
        objects.push(wordsSrc.slice(objStart, j + 1))
        objStart = -1
      }
    }
  }

  const words = []
  for (const obj of objects) {
    const word = /word:\s*"((?:\\.|[^"\\])*)"/.exec(obj)?.[1]
    if (!word) continue
    const image = /image:\s*"((?:\\.|[^"\\])*)"/.exec(obj)?.[1]
    const feminine = /feminine:\s*"((?:\\.|[^"\\])*)"/.exec(obj)?.[1]
    const gender = /gender:\s*"(m|f)"/.exec(obj)?.[1]
    let definition = ''
    const defArr = extractArrayBlock(obj, 'definition')
    if (defArr.length) definition = String(defArr[0])
    else {
      const defStr = /definition:\s*"((?:\\.|[^"\\])*)"/.exec(obj)?.[1]
      if (defStr) definition = defStr
    }
    const synArr = extractArrayBlock(obj, 'synonym')
    const synonym = synArr[0] ? String(synArr[0]) : undefined

    // exampleSentences blocks — extract quoted strings per level
    const examples = { a1: [], a2: [], b1: [] }
    for (const level of ['a1', 'a2', 'b1']) {
      const levelRe = new RegExp(`${level}\\s*:\\s*\\[([\\s\\S]*?)\\]`, 'm')
      const lm = levelRe.exec(obj)
      if (!lm) continue
      const strings = [...lm[1].matchAll(/"((?:\\.|[^"\\])*)"/g)].map((x) =>
        x[1].replace(/\\"/g, '"').replace(/\\n/g, '\n'),
      )
      examples[level] = strings.filter((s) => s && !s.includes('___') || s.includes('___'))
    }

    words.push({
      word,
      image,
      feminine,
      gender,
      definition: definition || `Mot du thème : ${word}.`,
      synonym,
      examples,
      imageFolder,
      section,
    })
  }
  return { section, imageFolder, code, title, words }
}

function makeFillSentences(word, article) {
  const w = word
  const a = article || ''
  const det = a ? `${a} ` : ''
  return {
    a1: [
      `Je connais le mot ___.`,
      `Voici ___.`.replace('___', '___'),
      `C’est ${det}___.`,
      `Regardez ${det}___.`,
      `J’écris le mot ___.`,
      `Nous apprenons ___.`,
      `Répétez : ___.`,
      `Le mot du jour est ___.`,
      `Montrez ${det}___.`,
      `Dites ___.`,
    ].map((s) => s.includes('___') ? s : `Je dis ___.`),
    a2: [
      `Ce matin, j’ai appris le mot ___.`,
      `Dans la leçon, nous avons vu ___.`,
      `Quand je parle, j’utilise le mot ___.`,
      `Hier, j’ai écrit une phrase avec ___.`,
      `Le professeur a expliqué le mot ___.`,
      `J’associe une image au mot ___.`,
      `Pendant l’exercice, j’emploie ___.`,
      `Nous révisons le vocabulaire : ___.`,
      `Après le cours, je répète ___.`,
      `Demain, je vais utiliser ___.`,
    ],
    b1: [
      `Bien que ce soit un mot simple, j’emploie ___ avec précision.`,
      `Comme j’ai révisé, je me souviens de ___.`,
      `Si je dois décrire la situation, j’utilise ___.`,
      `Après avoir écouté l’exemple, j’ai repris ___.`,
      `Pour être clair, j’ajoute le mot ___ dans ma phrase.`,
      `Lorsque je parle de ce thème, je pense à ___.`,
      `Même si le contexte change, je peux dire ___.`,
      `Afin de m’exprimer correctement, je choisis ___.`,
      `Dès que je vois l’image, je dis ___.`,
      `En classe, nous avons discuté du sens de ___.`,
    ],
  }
}

function makePhraseSentences(word, article) {
  const det = article ? `${article} ` : ''
  const w = word
  return {
    a1: [
      `Je vois ${det}${w}.`,
      `Voici ${det}${w}.`,
      `C’est ${det}${w}.`,
      `J’aime ${det}${w}.`,
      `Il y a ${det}${w}.`,
      `Regardons ${det}${w}.`,
      `Je montre ${det}${w}.`,
      `Nous parlons de ${det}${w}.`.replace('de le ', 'du ').replace('de les ', 'des '),
      `J’écoute le mot ${w}.`,
      `Je répète ${det}${w}.`,
    ],
    a2: [
      `Ce matin, j’ai vu ${det}${w}.`,
      `Hier, nous avons parlé de ${det}${w}.`.replace('de le ', 'du ').replace('de les ', 'des '),
      `Dans mon quartier, il y a ${det}${w}.`,
      `Quand j’arrive, je cherche ${det}${w}.`,
      `Le professeur a montré ${det}${w}.`,
      `J’explique le mot ${w} à mon camarade.`,
      `Pendant la pause, j’ai pensé à ${det}${w}.`,
      `Demain, je vais utiliser ${det}${w}.`,
      `Nous avons associé ${det}${w} à une image.`,
      `Après la leçon, j’ai noté ${det}${w}.`,
    ],
    b1: [
      `Bien que ce soit courant, j’emploie ${det}${w} avec soin.`,
      `Comme le contexte est clair, je peux parler de ${det}${w}.`.replace('de le ', 'du ').replace('de les ', 'des '),
      `Si je dois donner un exemple, je choisis ${det}${w}.`,
      `Après avoir révisé, j’utilise ${det}${w} spontanément.`,
      `Pour décrire la situation, j’ajoute ${det}${w}.`,
      `Lorsque je raconte mon histoire, je mentionne ${det}${w}.`,
      `Même si le mot est simple, ${det}${w} reste utile.`,
      `Afin d’être précis, je préfère dire ${det}${w}.`,
      `Dès que je vois l’image, je reconnais ${det}${w}.`,
      `En discussion, nous avons commenté ${det}${w}.`,
    ],
  }
}

function pickArticle(word, gender) {
  if (!gender) return ''
  const first = word.trim().charAt(0).toLowerCase()
  const vowel = 'aeiouyàâäéèêëïîôùûüh'.includes(first)
  if (gender === 'f') return vowel ? "l'" : 'la'
  return vowel ? "l'" : 'le'
}

function toEntry(raw, subgroupId) {
  const id = `${subgroupId}-${slugify(raw.word)}`
  const article = pickArticle(raw.word, raw.gender)
  const imageSrc = resolveImage(raw.image, raw.imageFolder || raw.section)
  const fromSoutien = raw.examples
  const fillBase = makeFillSentences(raw.word, article)
  const phraseBase = makePhraseSentences(raw.word, article)

  function mergeLevel(kind, level) {
    const soutien = (fromSoutien?.[level] ?? []).filter(Boolean)
    if (kind === 'trous') {
      const filled = soutien
        .map((s) => {
          // Convert full sentences to cloze when possible
          const re = new RegExp(`\\b${raw.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
          if (re.test(s)) return s.replace(re, '___')
          return null
        })
        .filter(Boolean)
      const pool = filled.length ? filled : fillBase[level]
      return pool.slice(0, 10)
    }
    if (kind === 'phrase' || kind === 'dictee') {
      const pool = soutien.length ? soutien : phraseBase[level]
      return pool.slice(0, 10)
    }
    return phraseBase[level].slice(0, 10)
  }

  return {
    id,
    label: raw.word,
    imageSrc,
    definition: raw.definition,
    syllables: syllablesOf(raw.word),
    synonym: raw.synonym,
    masculine: raw.gender === 'f' && raw.feminine ? raw.word : raw.gender === 'm' ? raw.word : undefined,
    feminine: raw.feminine || (raw.gender === 'f' ? raw.word : undefined),
    subgroup: subgroupId,
    sentences: {
      trous: { a1: mergeLevel('trous', 'a1'), a2: mergeLevel('trous', 'a2'), b1: mergeLevel('trous', 'b1') },
      phrase: { a1: mergeLevel('phrase', 'a1'), a2: mergeLevel('phrase', 'a2'), b1: mergeLevel('phrase', 'b1') },
      dictee: { a1: mergeLevel('dictee', 'a1'), a2: mergeLevel('dictee', 'a2'), b1: mergeLevel('dictee', 'b1') },
    },
  }
}

function emitBank(topicId, subgroups) {
  const varName = topicId.replace(/-/g, '_').toUpperCase() + '_BANK'
  const lines = []
  lines.push(`/** Banque Voc « ${topicId} » — importée depuis soutien-scolaire. */`)
  lines.push(`import type { VocabWordEntry } from '../vocab-learn'`)
  lines.push('')
  lines.push(`export type VocabSubgroupBank = {`)
  lines.push(`  id: string`)
  lines.push(`  label: string`)
  lines.push(`  words: VocabWordEntry[]`)
  lines.push(`}`)
  lines.push('')
  lines.push(`export const ${varName}: VocabSubgroupBank[] = [`)
  for (const sg of subgroups) {
    lines.push(`  {`)
    lines.push(`    id: ${JSON.stringify(sg.id)},`)
    lines.push(`    label: ${JSON.stringify(sg.label)},`)
    lines.push(`    words: [`)
    const sorted = [...sg.words].sort((a, b) => a.label.localeCompare(b.label, 'fr'))
    for (const w of sorted) {
      lines.push(`      ${JSON.stringify(w)},`)
    }
    lines.push(`    ],`)
    lines.push(`  },`)
  }
  lines.push(`]`)
  lines.push('')
  return { varName, code: lines.join('\n') }
}

fs.mkdirSync(OUT_DIR, { recursive: true })

const registry = []
let totalWords = 0
let withImage = 0

for (const topic of TOPIC_MAP) {
  const subgroups = []
  for (const sg of topic.subgroups) {
    const filePath = path.join(SOUTIEN, sg.file)
    if (!fs.existsSync(filePath)) {
      console.warn('missing', filePath)
      continue
    }
    const parsed = parseThemeFile(filePath)
    const words = parsed.words.map((w) => toEntry(w, sg.id))
    totalWords += words.length
    withImage += words.filter((w) => w.imageSrc).length
    subgroups.push({ id: sg.id, label: sg.label, words })
    console.log(`${topic.id}/${sg.id}: ${words.length} mots, ${words.filter((w) => w.imageSrc).length} images`)
  }
  const { varName, code } = emitBank(topic.id, subgroups)
  const outFile = path.join(OUT_DIR, `${topic.id}.ts`)
  fs.writeFileSync(outFile, code)
  registry.push({ ...topic, varName, importPath: `./vocab-banks/${topic.id}` })
}

// index
const indexLines = []
indexLines.push(`/** Registre des banques Voc par thème (sous-groupes). */`)
indexLines.push(`import type { VocabWordEntry } from './vocab-learn'`)
for (const r of registry) {
  indexLines.push(`import { ${r.varName} } from '${r.importPath}'`)
}
indexLines.push('')
indexLines.push(`export type VocabSubgroup = { id: string; label: string; words: VocabWordEntry[] }`)
indexLines.push(`export type VocabTopicMeta = {`)
indexLines.push(`  id: string`)
indexLines.push(`  label: string`)
indexLines.push(`  grammar: string`)
indexLines.push(`  vocab: string`)
indexLines.push(`  subgroups: VocabSubgroup[]`)
indexLines.push(`}`)
indexLines.push('')
indexLines.push(`export const VOCAB_TOPIC_BANKS: VocabTopicMeta[] = [`)
for (const r of registry) {
  indexLines.push(`  {`)
  indexLines.push(`    id: ${JSON.stringify(r.id)},`)
  indexLines.push(`    label: ${JSON.stringify(r.label)},`)
  indexLines.push(`    grammar: ${JSON.stringify(r.grammar)},`)
  indexLines.push(`    vocab: ${JSON.stringify(r.vocab)},`)
  indexLines.push(`    subgroups: ${r.varName},`)
  indexLines.push(`  },`)
}
indexLines.push(`]`)
indexLines.push('')
indexLines.push(`export const VOCAB_TOPIC_META: VocabTopicMeta[] = [`)
indexLines.push(`  ...VOCAB_TOPIC_BANKS,`)
for (const t of EXTRA_TOPICS) {
  indexLines.push(
    `  { id: ${JSON.stringify(t.id)}, label: ${JSON.stringify(t.label)}, grammar: ${JSON.stringify(t.grammar)}, vocab: ${JSON.stringify(t.vocab)}, subgroups: [] },`,
  )
}
indexLines.push(`].sort((a, b) => a.label.localeCompare(b.label, 'fr'))`)
indexLines.push('')
indexLines.push(`export function vocabBankForTopic(topic: string): VocabTopicMeta | undefined {`)
indexLines.push(`  return VOCAB_TOPIC_META.find((t) => t.id === topic)`)
indexLines.push(`}`)
indexLines.push('')

fs.writeFileSync(path.join(ROOT, 'src/francais/vocab-registry.ts'), indexLines.join('\n'))
console.log(`\nTotal: ${totalWords} mots, ${withImage} avec image`)
console.log('Wrote vocab-registry.ts + banks')
