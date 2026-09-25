#!/usr/bin/env node
/**
 * Construit src/francais/comprehension-orale-banks.ts à partir :
 * - des audios classés (scripts/audio-theme-manifest.json)
 * - des transcriptions soutien-scolaire
 * - des banques QCM soutien (co-questions-* + express-*-listening)
 * - questions générées depuis le transcript si le pool manque
 *
 * Relancer : node scripts/build-comprehension-orale-banks.mjs
 */
import {
  existsSync,
  readdirSync,
  readFileSync,
  writeFileSync,
  statSync,
} from 'node:fs'
import { basename, join, relative } from 'node:path'

const ROOT = process.cwd()
const SOUTIEN = process.env.SOUTIEN_ROOT ?? '/tmp/soutien-scolaire'
const COMM = join(SOUTIEN, 'lib/curriculum/content/communication')
const MANIFEST = join(ROOT, 'scripts/audio-theme-manifest.json')
const OUT = join(ROOT, 'src/francais/comprehension-orale-banks.ts')
const VOCAB_IMG = join(ROOT, 'public/lib/images/vocabulaire')
const CO_IMG = join(ROOT, 'public/lib/images/comprehension')

const THEME_TO_FR = {
  presenter: 'fr-presenter',
  famille: 'fr-famille',
  logement: 'fr-logement',
  achats: 'fr-achats',
  vetements: 'fr-vetements',
  nourriture: 'fr-nourriture',
  sante: 'fr-sante',
  transports: 'fr-transports',
  inviter: 'fr-inviter',
  travail: 'fr-travail',
  journee: 'fr-journee',
  loisirs: 'fr-loisirs',
  // Thèmes audio hors catalogue → rattachés sans polluer l’identité
  ecole: 'fr-travail',
  couleurs: 'fr-description',
  // exclus du tirage principal (trop hétérogènes) : administration, actualite, nature, objets
}

const LEVEL_MAP = {
  'facile-a1': 'a1',
  'moyen-a2': 'a2',
  'difficile-b1': 'b1',
}

const INTERROGATIVES =
  /^(qui|que|quoi|quel|quelle|quels|quelles|où|ou|quand|comment|combien|pourquoi|de quoi|à qui|à quoi|avec qui|pour qui|dans quel|dans quelle|sur quel|sur quelle)\b/i

const DISTRACTORS = {
  places: ['à Genève', 'à Berne', 'à Zurich', 'à Fribourg', 'à Neuchâtel', 'à Bâle'],
  people: ['Léa', 'Omar', 'Nora', 'Yanis', 'Inès', 'Pavel', 'Nour', 'Marc'],
  ages: ['18 ans', '22 ans', '25 ans', '30 ans', '35 ans', '40 ans'],
  times: ['à huit heures', 'à dix heures', 'à midi', 'à quatorze heures', 'à dix-huit heures', 'à vingt heures'],
  days: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'],
  activities: ['au cinéma', 'au restaurant', 'à la piscine', 'à la bibliothèque', 'au parc', 'au musée'],
  yesno: ['oui', 'non', 'on ne sait pas'],
  generic: ['le matin', 'le soir', 'demain', 'aujourd’hui', 'après-midi'],
}

function norm(s) {
  return String(s ?? '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim()
}

function slugify(s) {
  return norm(s)
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function esc(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

function loadJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

/** Index images vocabulaire + PO_* compréhension. */
function buildImageIndex() {
  const bySlug = new Map()
  function add(file, url) {
    const stem = basename(file, '.webp')
    const key = slugify(stem.replace(/^PO[_-]/i, ''))
    if (!bySlug.has(key)) bySlug.set(key, url)
  }
  function walk(dir, urlPrefix) {
    if (!existsSync(dir)) return
    for (const name of readdirSync(dir)) {
      const full = join(dir, name)
      if (statSync(full).isDirectory()) walk(full, `${urlPrefix}/${name}`)
      else if (/\.webp$/i.test(name)) add(name, `${urlPrefix}/${name}`)
    }
  }
  walk(VOCAB_IMG, '/lib/images/vocabulaire')
  for (const level of ['facile-a1', 'moyen-a2', 'difficile-b1']) {
    walk(join(CO_IMG, level), `/lib/images/comprehension/${level}`)
  }
  return bySlug
}

function resolveImage(label, index) {
  const raw = String(label ?? '').trim()
  if (!raw) return undefined
  const candidates = [
    slugify(raw),
    slugify(raw.replace(/^(un|une|le|la|les|du|des|au|aux)\s+/i, '')),
    slugify(raw.split(/\s+/)[0] ?? ''),
  ]
  for (const c of candidates) {
    if (c && index.has(c)) return index.get(c)
  }
  return undefined
}

function imagesForOptions(options, index) {
  const imgs = options.map((o) => resolveImage(o, index))
  const ok = imgs.every(Boolean)
  return { optionImages: ok ? imgs : undefined, imagesAvailable: ok }
}

/** ——— Transcripts ——— */
const transcripts = new Map()

function addTranscript(stem, text) {
  const key = String(stem).replace(/\.mp3$/i, '')
  const clean = String(text ?? '').trim()
  if (!clean || clean.length < 20) return
  const prev = transcripts.get(key)
  if (!prev || clean.length > prev.length) transcripts.set(key, clean)
}

function loadTranscripts() {
  for (const name of [
    'co-transcripts-scolaire-base.json',
    'co-transcripts-scolaire-moyen.json',
    'co-transcripts-scolaire-avance.json',
  ]) {
    const path = join(COMM, name)
    if (!existsSync(path)) continue
    const data = loadJson(path)
    for (const [stem, text] of Object.entries(data)) addTranscript(stem, text)
  }
  for (const name of ['a1-transcripts.json', 'a2-transcripts.json']) {
    const path = join(SOUTIEN, 'scripts/data/express', name)
    if (!existsSync(path)) continue
    const data = loadJson(path)
    for (const [stem, text] of Object.entries(data)) {
      addTranscript(stem, text)
      addTranscript(String(stem).padStart(3, '0'), text)
    }
  }
  if (!existsSync(COMM)) return
  for (const name of readdirSync(COMM)) {
    if (!/^express-.*-listening\.ts$/.test(name)) continue
    const src = readFileSync(join(COMM, name), 'utf8')
    const blocks = new Map()
    let m
    const trRe = /const TRANSCRIPT_(\d+)\s*=\s*`([^`]*)`/g
    while ((m = trRe.exec(src))) blocks.set(m[1], m[2])
    for (const [num, text] of blocks) {
      addTranscript(num, text)
      addTranscript(num.padStart(3, '0'), text)
    }
    const inlineRe =
      /audioSrc:\s*A([12])\(\s*"(\d+)"\s*\)[\s\S]{0,400}?transcript:\s*`([^`]*)`/g
    while ((m = inlineRe.exec(src))) {
      addTranscript(m[2], m[3])
      addTranscript(m[2].padStart(3, '0'), m[3])
    }
    const buildRe =
      /buildListeningAudio\(\{\s*id:\s*"[^"]+"\s*,\s*level:\s*"(A1|A2)"\s*,\s*num:\s*(\d+)\s*,\s*transcript:\s*`([^`]*)`/g
    while ((m = buildRe.exec(src))) {
      addTranscript(String(m[2]), m[3])
      addTranscript(String(m[2]).padStart(3, '0'), m[3])
    }
  }
  for (const name of [
    'co-audio-avance.ts',
    'co-audio-avance-conv-extra.ts',
    'co-audio-avance-radio.ts',
  ]) {
    const path = join(COMM, name)
    if (!existsSync(path)) continue
    const src = readFileSync(path, 'utf8')
    let m
    const cRe = /(?:export )?const (CONV|RADIO)_(\d+)\s*=\s*`([^`]*)`/g
    while ((m = cRe.exec(src))) {
      const prefix = m[1] === 'CONV' ? 'conversation' : 'radio'
      addTranscript(`${prefix}-${m[2]}`, m[3])
    }
  }
}

/** ——— Question pools ——— */
/** @type {Map<string, Array<{prompt:string,options:string[],answer:string,imgLabels?:string[]}>>} */
const pools = new Map()

function poolKeyVariants(slug) {
  const s = slug.replace(/^scolaire-/, '').replace(/^(base|moyen|avance)-/, '')
  const out = new Set([s, slug])
  const m = /^(message|annonce|radio|conversation|objet)-(\d+(?:\.\d+)?)$/.exec(s)
  if (m) out.add(`${m[1]}-${m[2]}`)
  const num = /^(\d+)$/.exec(s)
  if (num) {
    out.add(num[1])
    out.add(num[1].padStart(3, '0'))
  }
  return [...out]
}

function pushPool(slug, questions) {
  if (!questions.length) return
  for (const key of poolKeyVariants(slug)) {
    const prev = pools.get(key) ?? []
    pools.set(key, prev.length >= questions.length ? prev : questions)
  }
}

function parseRawQBlock(block) {
  const id = /id:\s*"([^"]+)"/.exec(block)?.[1] ?? ''
  const textQ = /textQ:\s*"((?:\\.|[^"\\])*)"/.exec(block)?.[1]
  if (!textQ) return null
  const textArr = /text:\s*\[((?:[^\[\]]|\[[^\]]*\])*)\]/.exec(block)?.[1]
  if (!textArr) return null
  const options = [...textArr.matchAll(/"((?:\\.|[^"\\])*)"/g)].map((m) =>
    m[1].replace(/\\"/g, '"').replace(/\\n/g, ' '),
  )
  if (options.length < 3) return null
  const textC = Number(/textC:\s*(\d+)/.exec(block)?.[1] ?? 0)
  const answer = options[textC] ?? options[0]
  const imgArr = /img:\s*\[((?:[^\[\]]|\[[^\]]*\])*)\]/.exec(block)?.[1]
  const imgLabels = imgArr
    ? [...imgArr.matchAll(/"((?:\\.|[^"\\])*)"/g)].map((m) => m[1]).filter((s) => s.trim())
    : undefined
  return {
    prompt: textQ.replace(/\\"/g, '"'),
    options: options.slice(0, 3),
    answer,
    imgLabels: imgLabels?.length === 3 ? imgLabels : undefined,
    id,
  }
}

function extractBuildPools(src, fnName = 'buildPool') {
  const re = new RegExp(
    `${fnName}\\(\\s*"[^"]+"\\s*,\\s*"([^"]+)"\\s*,\\s*\\[([\\s\\S]*?)\\]\\s*\\)`,
    'g',
  )
  let m
  while ((m = re.exec(src))) {
    const slug = m[1]
    const body = m[2]
    const questions = []
    // Split on object starts `{ id:`
    const chunks = body.split(/\{\s*id:/).slice(1)
    for (const chunk of chunks) {
      const q = parseRawQBlock(`{ id:${chunk}`)
      if (q) questions.push(q)
    }
    pushPool(slug, questions)
  }
}

function extractExpressPools(src) {
  // buildExpressPool("e1-1-005", [ ... ])
  const re = /buildExpressPool\(\s*"([^"]+)"\s*,\s*\[([\s\S]*?)\]\s*\)/g
  let m
  while ((m = re.exec(src))) {
    const id = m[1]
    const body = m[2]
    const questions = []
    const chunks = body.split(/\{\s*id:/).slice(1)
    for (const chunk of chunks) {
      const q = parseRawQBlock(`{ id:${chunk}`)
      if (q) questions.push(q)
    }
    // Objects without id: (FixedQ via qs / raw objects)
    if (questions.length === 0) {
      const objs = body.split(/\n\s*\{\s*\n/).slice(1)
      for (const chunk of objs) {
        const q = parseRawQBlock(`{ id:"x",\n${chunk}`)
        if (q) questions.push(q)
      }
    }
    const num = /(\d{2,3})$/.exec(id)?.[1]
    if (num) {
      pushPool(num, questions)
      pushPool(num.padStart(3, '0'), questions)
      pushPool(String(Number(num)), questions)
    }
    pushPool(id, questions)
  }

  // questions: qs("016", [ { textQ: ... }, ... ])
  const qsRe = /qs\(\s*"(\d+)"\s*,\s*\[([\s\S]*?)\]\s*\)/g
  while ((m = qsRe.exec(src))) {
    const num = m[1]
    const body = m[2]
    const questions = []
    const objs = body.split(/\n\s*\{\s*\n/).slice(1)
    for (const chunk of objs) {
      const q = parseRawQBlock(`{ id:"${num}",\n${chunk}`)
      if (q) questions.push(q)
    }
    pushPool(num, questions)
    pushPool(num.padStart(3, '0'), questions)
    pushPool(String(Number(num)), questions)
  }

  // buildListeningAudio({ num: 16, ... questions: qs(...) }) — already covered by qs
  // Also: num: 16 with inline questions array lacking qs
  const buildRe =
    /buildListeningAudio\(\{[\s\S]*?num:\s*(\d+)[\s\S]*?questions:\s*(?:qs\(\s*"\d+"\s*,\s*)?\[([\s\S]*?)\]/g
  while ((m = buildRe.exec(src))) {
    const num = String(m[1])
    if (pools.has(num.padStart(3, '0')) || pools.has(num)) continue
    const body = m[2]
    const questions = []
    const objs = body.split(/\n\s*\{\s*\n/).slice(1)
    for (const chunk of objs) {
      const q = parseRawQBlock(`{ id:"${num}",\n${chunk}`)
      if (q) questions.push(q)
    }
    if (questions.length) {
      pushPool(num, questions)
      pushPool(num.padStart(3, '0'), questions)
    }
  }
}

function loadQuestionPools() {
  if (!existsSync(COMM)) return
  for (const name of readdirSync(COMM)) {
    if (!name.endsWith('.ts')) continue
    const path = join(COMM, name)
    const src = readFileSync(path, 'utf8')
    if (name.startsWith('co-questions')) {
      extractBuildPools(src, 'buildPool')
    }
    if (name.startsWith('express-') && name.endsWith('-listening.ts')) {
      extractExpressPools(src)
      extractBuildPools(src, 'buildExpressPool')
    }
  }
}

function getPoolForStem(stem) {
  const variants = poolKeyVariants(stem)
  if (/^\d+$/.test(stem)) {
    variants.push(stem.padStart(3, '0'), String(Number(stem)))
  }
  for (const v of variants) {
    const q = pools.get(v)
    if (q?.length) return q
  }
  return null
}

/** ——— Interrogative rewrite ——— */
function ensureInterrogative(prompt) {
  const p = String(prompt).trim()
  if (!p) return 'Que dit l’enregistrement ?'
  if (INTERROGATIVES.test(p) || /\?\s*$/.test(p)) {
    return p.endsWith('?') ? p : `${p} ?`
  }
  // Affirmations / amorces → vraie question
  const lower = p.toLowerCase()
  if (/propose|dit que|indique|annonce/.test(lower)) {
    return `Que ${p.charAt(0).toLowerCase()}${p.slice(1).replace(/\.*$/, '')} ?`.replace(
      /^Que que/i,
      'Que',
    )
  }
  if (/^ben |^il |^elle |^on |^nous |^vous |^ils |^elles /.test(lower)) {
    return `Que dit l’enregistrement à propos de « ${p.replace(/\.*$/, '')} » ?`
  }
  return `De quoi parle l’enregistrement concernant « ${p.replace(/\.*$/, '')} » ?`
}

/** ——— Generate QCM from transcript ——— */

function shuffleDeterministic(arr, seed) {
  const a = [...arr]
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  for (let i = a.length - 1; i > 0; i--) {
    h = (h * 1664525 + 1013904223) >>> 0
    const j = h % (i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function generateQuestionsFromTranscript(transcript, stem) {
  const text = transcript.replace(/\s+/g, ' ').trim()
  const questions = []
  const seenPrompts = new Set()

  const addQ = (prompt, answer, distractors) => {
    const p = ensureInterrogative(prompt)
    if (seenPrompts.has(norm(p))) return
    const opts = shuffleDeterministic(
      [answer, ...distractors.filter((d) => norm(d) !== norm(answer))].slice(0, 3),
      stem + p,
    )
    while (opts.length < 3) opts.push(DISTRACTORS.generic[opts.length] ?? 'demain')
    questions.push({ prompt: p, options: opts.slice(0, 3), answer })
    seenPrompts.add(norm(p))
  }

  const names = []
  const nameRe =
    /\b([A-ZÉÈÊÀÂÔÙÛÎÏÇ][a-zéèêàâôùûîïçë-]{2,})\b(?:\s*:|\s+(?:s’appelle|m’appelle|habites?|viens?|suis|est|ai|as|a)\b)/g
  let m
  while ((m = nameRe.exec(transcript))) {
    const n = m[1]
    if (!['Bonjour', 'Merci', 'Oui', 'Non', 'Alors', 'Donc', 'Exercice', 'Regarde', 'Homme', 'Femme'].includes(n)) {
      if (!names.includes(n)) names.push(n)
    }
  }

  const ageM = /(?:j’ai|j'ai|il a|elle a|tu as)\s+(\d{1,2})\s*ans/i.exec(text)
  if (ageM) {
    const ans = `${ageM[1]} ans`
    addQ(names[0] ? `Quel âge a ${names[0]} ?` : 'Quel âge est mentionné ?', ans, DISTRACTORS.ages)
  }

  const placeM =
    /(?:habite(?:\s+à)?|viens? de|vient de)\s+([A-ZÉÈÊÀÂÔÙÛÎÏÇ][a-zéèêàâôùûîïç-]+)/.exec(transcript) ||
    /\bà\s+(Genève|Sion|Lausanne|Martigny|Sierre|Fribourg|Berne|Zurich|Neuchâtel|Bâle|Paris)\b/i.exec(transcript)
  if (placeM) {
    const city = placeM[1]
    const nice = city.match(/^à /i) ? city : `à ${city}`
    addQ(names[0] ? `Où habite ${names[0]} ?` : 'Où se passe la scène ?', nice, DISTRACTORS.places)
  }

  const timeM = /(?:à\s+)?(\d{1,2})\s*h(?:eures?)?(?:\s*(\d{2}))?/i.exec(text)
  if (timeM) {
    const ans = timeM[2] ? `à ${timeM[1]} h ${timeM[2]}` : `à ${timeM[1]} heures`
    addQ('À quelle heure a lieu l’événement ?', ans, DISTRACTORS.times)
  }

  const dayM = /\b(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\b/i.exec(text)
  if (dayM) {
    addQ('Quel jour est mentionné ?', dayM[1].toLowerCase(), DISTRACTORS.days)
  }

  if (names.length >= 1) {
    const ans = names[0]
    const distract = [
      ...names.slice(1),
      ...DISTRACTORS.people.filter((p) => p !== ans),
    ].slice(0, 2)
    addQ('Qui est mentionné dans l’enregistrement ?', ans, distract)
  }

  const activityM =
    /\b(cinéma|restaurant|piscine|bibliothèque|parc|musée|école|magasin|hôpital|gare|marché|mariage|photo|appartement|studio)\b/i.exec(
      text,
    )
  if (activityM) {
    const ans = activityM[1].toLowerCase()
    addQ('De quel lieu ou objet parle-t-on ?', ans, [
      'football',
      'cuisine',
      'ordinateur',
      'train',
    ].filter((x) => x !== ans))
  }

  // Fact sentences as « Que dit X ? »
  const lines = transcript
    .split(/\n|—|- /)
    .map((l) => l.replace(/^[\s\d.]+/, '').trim())
    .filter((l) => l.length > 20 && l.length < 120)
  for (const line of lines) {
    if (questions.length >= 4) break
    const speaker = /^([A-ZÉÈÊÀÂÔÙÛÎÏÇ][a-zéèêàâôùûîïç-]{2,})\s*[:：]/.exec(line)
    const content = line.replace(/^[^:]+:\s*/, '').trim()
    if (content.length < 12) continue
    const short = content.slice(0, 48).replace(/\s+\S*$/, '')
    const wrong1 = 'On ne parle pas de cela.'
    const wrong2 = 'Le contraire est dit.'
    addQ(
      speaker ? `Que dit ${speaker[1]} ?` : 'Que dit l’enregistrement ?',
      short,
      [wrong1, wrong2],
    )
  }

  while (questions.length < 3) {
    addQ(
      `Quel est le thème de l’écoute ${questions.length + 1} ?`,
      'le message entendu',
      ['un match de foot', 'une recette de cuisine'],
    )
  }

  return questions.slice(0, 5)
}

function titleFromStem(stem, transcript) {
  if (/^message-/.test(stem)) return `Message ${stem.replace('message-', '')}`
  if (/^annonce-/.test(stem)) return `Annonce ${stem.replace('annonce-', '')}`
  if (/^radio-/.test(stem)) return `Radio ${stem.replace('radio-', '')}`
  if (/^conversation-/.test(stem)) return `Conversation ${stem.replace('conversation-', '')}`
  if (/^objet-/.test(stem)) return `Objets ${stem.replace('objet-', '')}`
  if (/^\d+$/.test(stem)) return `Dialogue ${stem}`
  const first = transcript.split(/\n/).map((l) => l.trim()).find(Boolean) ?? stem
  return first.slice(0, 42).replace(/[:.]+$/, '') || stem
}

function main() {
  if (!existsSync(MANIFEST)) {
    console.error('Manifest manquant:', MANIFEST)
    process.exit(1)
  }
  loadTranscripts()
  loadQuestionPools()
  const imageIndex = buildImageIndex()
  const manifest = loadJson(MANIFEST)
  const items = manifest.items ?? []

  const docs = []
  let withPool = 0
  let generated = 0
  let withImages = 0
  let missingTx = 0

  for (const item of items) {
    const stem = item.file.replace(/\.mp3$/i, '')
    const level = LEVEL_MAP[item.level] ?? 'a2'
    const themeFolder = item.theme
    const frTheme = THEME_TO_FR[themeFolder]
    if (!frTheme) continue

    let transcript =
      transcripts.get(stem) ||
      transcripts.get(stem.padStart(3, '0')) ||
      ( /^\d+$/.test(stem) ? transcripts.get(String(Number(stem))) : null)

    if (!transcript) {
      missingTx++
      // Skip files without usable transcript — no inventing dialogue
      continue
    }

    let questions = getPoolForStem(stem)
    let source = 'soutien'
    if (!questions?.length) {
      questions = generateQuestionsFromTranscript(transcript, stem)
      source = 'generated'
      generated++
    } else {
      withPool++
      questions = questions.map((q) => ({
        prompt: ensureInterrogative(q.prompt),
        options: q.options.slice(0, 3),
        answer: q.answer,
        imgLabels: q.imgLabels,
      }))
    }

    const enriched = questions.map((q) => {
      const labels = q.imgLabels?.length === 3 ? q.imgLabels : q.options
      const { optionImages, imagesAvailable } = imagesForOptions(labels, imageIndex)
      if (imagesAvailable) withImages++
      return {
        prompt: q.prompt,
        options: q.options,
        answer: q.answer,
        optionImages,
        imagesAvailable: Boolean(imagesAvailable),
      }
    })

    const audioSrc = `/lib/audio/${item.path}`
    const themes = [frTheme]
    // description partage les audios « couleurs » + une part de presenter
    if (themeFolder === 'presenter') themes.push('fr-description')

    docs.push({
      id: `co-${level}-${themeFolder}-${stem}`.replace(/[^a-z0-9-]+/gi, '-'),
      level,
      themes,
      title: titleFromStem(stem, transcript),
      transcript,
      audioSrc,
      questions: enriched,
      source,
    })
  }

  // Deduplicate by audioSrc
  const seen = new Set()
  const unique = []
  for (const d of docs) {
    if (seen.has(d.audioSrc)) continue
    seen.add(d.audioSrc)
    unique.push(d)
  }

  const byThemeLevel = {}
  for (const d of unique) {
    for (const th of d.themes) {
      byThemeLevel[th] ??= { a1: 0, a2: 0, b1: 0 }
      byThemeLevel[th][d.level]++
    }
  }

  const lines = []
  lines.push(`/** Généré par scripts/build-comprehension-orale-banks.mjs — ne pas éditer à la main. */`)
  lines.push(`import type { ComprehensionOraleDoc } from './comprehension-orale'`)
  lines.push('')
  lines.push(`export const COMPREHENSION_ORALE_DOCS: ComprehensionOraleDoc[] = [`)

  for (const d of unique) {
    lines.push(`  {`)
    lines.push(`    id: '${esc(d.id)}',`)
    lines.push(`    level: '${d.level}',`)
    lines.push(`    themes: [${d.themes.map((t) => `'${t}'`).join(', ')}],`)
    lines.push(`    title: '${esc(d.title)}',`)
    lines.push(`    transcript: '${esc(d.transcript).replace(/\n/g, '\\n')}',`)
    lines.push(`    audioSrc: '${esc(d.audioSrc)}',`)
    lines.push(`    questions: [`)
    for (const q of d.questions) {
      lines.push(`      {`)
      lines.push(`        prompt: '${esc(q.prompt)}',`)
      lines.push(`        options: [${q.options.map((o) => `'${esc(o)}'`).join(', ')}],`)
      lines.push(`        answer: '${esc(q.answer)}',`)
      if (q.imagesAvailable && q.optionImages) {
        lines.push(
          `        optionImages: [${q.optionImages.map((o) => `'${esc(o)}'`).join(', ')}],`,
        )
        lines.push(`        imagesAvailable: true,`)
      } else {
        lines.push(`        imagesAvailable: false,`)
      }
      lines.push(`      },`)
    }
    lines.push(`    ],`)
    lines.push(`  },`)
  }
  lines.push(`]`)
  lines.push('')

  writeFileSync(OUT, lines.join('\n'))
  console.log(
    JSON.stringify(
      {
        docs: unique.length,
        withPool,
        generated,
        missingTx,
        questionsWithImages: withImages,
        byThemeLevel,
        out: relative(ROOT, OUT),
        transcriptsLoaded: transcripts.size,
        poolsLoaded: pools.size,
      },
      null,
      2,
    ),
  )
}

main()
