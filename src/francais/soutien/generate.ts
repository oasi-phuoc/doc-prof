import { countGrapheme, wordHasGrapheme, type VowelBank } from '@/francais/lecture-banks'
import { int, pick, shuffle, type Rng } from '@/math/rng'
import { tagged } from '@/francais/phrase-sentences'
import type { Difficulty, MathItem, PhraseToken } from '@/math/types'
import { soutienBankByTopic, type SoutienVowelBank } from './banks'
import { soutienAudioFor } from './audio'
import { soutienEntriesWithImages, soutienImageFor } from './images'
import { parseSoutienType, type SoutienKindId } from './kinds'
import {
  ALL_VOCAB_LABELS,
  compoundsForType1Words,
  lessonSoundGraphemes,
  lessonWordsByLetter,
  lessonWordsBySound,
  wordHasLessonSound,
} from './phoneme'
import { buildWordSearch, wordSearchHitCells } from './word-search'

/** Mots type 1 (16) : banque + Voc filtrés par la lettre de la leçon. */
export function type1Words(bank: SoutienVowelBank): string[] {
  const pool = lessonWordsByLetter(bank)
  const withImg: string[] = []
  const without: string[] = []
  for (const w of pool) {
    if (soutienImageFor(w)) withImg.push(w)
    else without.push(w)
  }
  /** Banque d’abord (ordre leçon), puis Voc avec image, puis le reste. */
  const bankSet = new Set(bank.words.map((w) => w.toLowerCase()))
  const fromBank = pool.filter((w) => bankSet.has(w.toLowerCase()))
  const fromVocabImg = withImg.filter((w) => !bankSet.has(w.toLowerCase()))
  const fromVocabRest = without.filter((w) => !bankSet.has(w.toLowerCase()))
  return [...fromBank, ...fromVocabImg, ...fromVocabRest].slice(0, 16)
}

export type SoutienBatch = {
  items: MathItem[]
  instruction: string
  preferredColumns?: number
}

export type SoutienCompleterEntry = {
  id: string
  article: string
  before: string
  blank: string
  after: string
  word: string
  imageSrc?: string
}

export type SoutienGenerateOptions = {
  /** Type 1 : mode libre (mots / images saisis). */
  soutienMotsLibre?: boolean
  soutienMotsEntries?: ReadonlyArray<{ id: string; label: string; imageSrc?: string }>
  /**
   * Colonnes : type 4 → 1–2 ; types 5/6/8 → 1–3 ; type 7 → 3–5.
   * (Mélange indépendant par colonne pour le type 4.)
   */
  columns?: number
  /** Type 5 : mode libre. */
  soutienCompleterLibre?: boolean
  soutienCompleterEntries?: ReadonlyArray<SoutienCompleterEntry>
}

const DISTRACTOR_LETTERS = 'bcdfghjklmnpqrstvwxzBCDFGHIJKLMNPQRSTVWXZ'.split('')

function asVowelBank(bank: SoutienVowelBank): VowelBank {
  return {
    id: bank.id,
    topic: bank.topic,
    letterUpper: bank.letterUpper,
    letterLower: bank.letterLower,
    sound: bank.sound,
    label: bank.label,
    graphemes: bank.graphemes,
    words: bank.words,
    syllables: bank.syllables,
    compounds: bank.compounds,
  }
}

function otherWords(bank: SoutienVowelBank): string[] {
  const own = new Set(lessonWordsBySound(bank).map((w) => w.toLowerCase()))
  const fallback = [
    'chat',
    'chien',
    'soleil',
    'lune',
    'livre',
    'table',
    'porte',
    'fenêtre',
    'école',
    'maison',
    'train',
    'fleur',
    'pomme',
    'pain',
    'fromage',
    'vélo',
  ]
  const pool = ALL_VOCAB_LABELS.length > 0 ? ALL_VOCAB_LABELS : fallback
  return pool.filter((w) => !own.has(w.toLowerCase()) && !wordHasLessonSound(w, bank))
}

/** Type 2 : tableau cols×rows ; le nombre de questions = nombre de lignes (max 15). */
function letterGrid(rng: Rng, bank: SoutienVowelBank, rowCount: number): MathItem {
  const cols = 10
  const rows = Math.max(1, Math.min(15, Math.round(rowCount) || 5))
  const size = cols * rows
  /** ~¼ des cases = lettre cible, borné pour rester lisible. */
  const targetCount = Math.max(4, Math.min(size - cols, Math.round(size * 0.24)))
  const cells: string[] = []
  for (let i = 0; i < targetCount; i++) {
    cells.push(pick(rng, [bank.letterUpper, bank.letterLower]))
  }
  while (cells.length < size) {
    let d = pick(rng, DISTRACTOR_LETTERS)
    while (d.toLowerCase() === bank.letterLower) d = pick(rng, DISTRACTOR_LETTERS)
    cells.push(d)
  }
  return {
    layout: 'letter-grid',
    prompt: `Entourez les lettres ${bank.letterUpper} ${bank.letterLower}.`,
    options: shuffle(rng, cells),
    answer: `${bank.letterUpper}${bank.letterLower}`,
    labels: [bank.letterLower],
    letterGridCols: cols,
    letterGridVariant: 'table',
  }
}

function countSoundInPhrase(phrase: string, bank: SoutienVowelBank): number {
  return countGrapheme(phrase, asVowelBank(bank))
}

/** Consonnes simples (pas de digrammes CH/GN/PH/QU). */
const SYLLABLE_CONS = ['b', 'c', 'd', 'f', 'g', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'z'] as const

/** Lignes paires pour le type 3 (les deux tableaux script + Playwrite). */
function evenSyllableRows(rowCount: number): number {
  let rows = Math.max(2, Math.min(10, Math.round(rowCount) || 4))
  if (rows % 2 !== 0) rows = Math.min(10, rows + 1)
  return rows
}

/**
 * Syllabes type 3 :
 * - moitié CV (consonne + voyelle du thème)
 * - moitié doubles : CVC / VCV, ou CVCV si CVC ferait un nasal (pan→pana, pin→pino…)
 * Toujours alternance consonne/voyelle ; jamais digramme ni nasal type pan/pon/pin.
 */
function buildSyllableReadingList(rng: Rng, vowel: string, total: number): string[] {
  const v = vowel.toLowerCase()
  const half = Math.floor(total / 2)
  const seen = new Set<string>()
  const simple: string[] = []
  const doubles: string[] = []

  const tryAdd = (bucket: string[], value: string): boolean => {
    if (seen.has(value)) return false
    seen.add(value)
    bucket.push(value)
    return true
  }

  let guard = 0
  while (simple.length < half && guard < half * 40) {
    guard += 1
    const s = `${pick(rng, [...SYLLABLE_CONS])}${v}`
    if (!tryAdd(simple, s) && simple.length > 0 && guard > half * 20) {
      simple.push(s) // doublon toléré si le pool est saturé
    }
  }
  while (simple.length < half) {
    simple.push(`${pick(rng, [...SYLLABLE_CONS])}${v}`)
  }

  guard = 0
  while (doubles.length < half && guard < half * 50) {
    guard += 1
    const kind = int(rng, 0, 2) // 0 VCV · 1 CVC/CVCV · 2 CVCV
    let s: string
    if (kind === 0) {
      s = `${v}${pick(rng, [...SYLLABLE_CONS])}${v}`
    } else if (kind === 1) {
      const c1 = pick(rng, [...SYLLABLE_CONS])
      const c2 = pick(rng, [...SYLLABLE_CONS])
      // pan / pin / pon / pun… → pana / pino / pono (pas de nasal)
      s = /[nm]/i.test(c2) ? `${c1}${v}${c2}${v}` : `${c1}${v}${c2}`
    } else {
      const c1 = pick(rng, [...SYLLABLE_CONS])
      const c2 = pick(rng, [...SYLLABLE_CONS])
      s = `${c1}${v}${c2}${v}`
    }
    if (!tryAdd(doubles, s) && doubles.length > 0 && guard > half * 25) {
      doubles.push(s)
    }
  }
  while (doubles.length < half) {
    const c1 = pick(rng, [...SYLLABLE_CONS])
    const c2 = pick(rng, [...SYLLABLE_CONS])
    doubles.push(/[nm]/i.test(c2) ? `${c1}${v}${c2}${v}` : `${c1}${v}${c2}`)
  }

  return shuffle(rng, [...simple.slice(0, half), ...doubles.slice(0, half)])
}

/** Assemble les jetons (apostrophe collée, ponctuation déjà sur le mot). */
function joinSoutienOrder(tokens: PhraseToken[]): string {
  let out = ''
  for (const token of tokens) {
    if (!out) {
      out = token.text
      continue
    }
    if (out.endsWith("'") || out.endsWith('’')) out += token.text
    else if (token.text === '?' || token.text === '!') out += token.text
    else out += ` ${token.text}`
  }
  return out
}

function genKind(
  kind: SoutienKindId,
  bank: SoutienVowelBank,
  count: number,
  rng: Rng,
  _difficulty: Difficulty,
  options?: SoutienGenerateOptions,
): { items: MathItem[]; instruction: string; preferredColumns?: number } {
  const n = Math.max(1, count)

  switch (kind) {
    case 'mots': {
      const libre =
        Boolean(options?.soutienMotsLibre) &&
        (options?.soutienMotsEntries?.some((e) => e.label.trim()) ?? false)
      const libreEntries = libre
        ? (options!.soutienMotsEntries ?? [])
            .filter((e) => e.label.trim())
            .slice(0, 16)
            .map((e, index) => ({
              id: e.id || `soutien-libre-${index}`,
              label: e.label.trim(),
              imageSrc: e.imageSrc || soutienImageFor(e.label),
            }))
        : null
      /** Banque leçon + Voc filtrés par la lettre (pas par sous-thème). */
      const words = libreEntries
        ? libreEntries.map((e) => e.label)
        : type1Words(bank)
      const entries = libreEntries ?? soutienEntriesWithImages(words)
      const total = Math.max(1, Math.min(16, entries.length))
      const cols = Math.min(4, total)
      const rows = Math.ceil(total / cols)
      return {
        instruction: `On entend le son ${bank.sound} dans ces mots.`,
        preferredColumns: 1,
        items: [
          {
            layout: 'vocab-table',
            prompt: `On entend le son ${bank.sound} dans ces mots.`,
            vocabEntries: entries,
            vocabRows: rows,
            vocabCols: cols,
            labels: [...bank.graphemes],
            answer: words.join(' · '),
          },
        ],
      }
    }
    case 'lettres':
      return {
        instruction: `Entourez les lettres ${bank.letterUpper} ${bank.letterLower}.`,
        preferredColumns: 1,
        /** `count` = nombre de lignes du tableau de lettres. */
        items: [letterGrid(rng, bank, n)],
      }
    case 'syllabes': {
      /**
       * Deux tableaux (script + Playwrite), même contenu.
       * `count` = lignes paires (4→4×5, 6→6×5) ; moitié CV, moitié doubles sans nasal.
       */
      const cols = 5
      const rows = evenSyllableRows(n)
      const list = buildSyllableReadingList(rng, bank.letterLower, cols * rows)
      return {
        instruction: 'Lisez les syllabes ci-dessous.',
        preferredColumns: 1,
        items: [
          {
            layout: 'syllable-table',
            prompt: 'Lisez les syllabes :',
            options: list,
            labels: [...bank.graphemes],
            answer: list.join(' · '),
            letterGridCols: cols,
          },
        ],
      }
    }
    case 'relier': {
      /**
       * Jusqu’à 16 paires (= mots du type 1) ; 1 ou 2 colonnes.
       * En 2 colonnes : 1er tableau à gauche, 2e à droite ; mélange indépendant.
       */
      const want = Math.max(1, Math.min(16, n))
      const type1 = type1Words(bank)
      const pool = compoundsForType1Words(bank, type1)
      const compounds = shuffle(rng, pool).slice(0, Math.min(want, pool.length))
      const colCount = options?.columns === 2 ? 2 : 1
      const mid = colCount === 2 ? Math.ceil(compounds.length / 2) : compounds.length
      const groups =
        colCount === 2
          ? [compounds.slice(0, mid), compounds.slice(mid)]
          : [compounds]
      const left: string[] = []
      const right: string[] = []
      const pairs: Array<{ left: string; right: string }> = []
      for (const group of groups) {
        const gLeft = group.map((c) => c.parts[0])
        const gRight = shuffle(
          rng,
          group.map((c) => c.parts[1]),
        )
        left.push(...gLeft)
        right.push(...gRight)
        for (const c of group) pairs.push({ left: c.parts[0], right: c.parts[1] })
      }
      return {
        instruction: 'Reliez les parties et formez un mot.',
        preferredColumns: 1,
        items: [
          {
            layout: 'vocab-match',
            labels: left,
            options: right,
            vocabMatchMode: 'syllables',
            themeGraphemes: [...bank.graphemes],
            vocabPairs: pairs,
            letterGridCols: colCount,
            letterGridVariant: colCount === 2 ? 'table' : undefined,
            answer: compounds.map((c) => `${c.parts[0]} + ${c.parts[1]} → ${c.word}`).join(' · '),
          },
        ],
      }
    }
    case 'completer': {
      /** Grille image + Un/Une + trait ; colonnes 1–3 ; count = nb de mots. */
      const cols = Math.max(1, Math.min(3, Math.round(options?.columns ?? 2) || 2))
      const libre =
        Boolean(options?.soutienCompleterLibre) &&
        (options?.soutienCompleterEntries?.some((e) => e.word.trim() && e.blank.trim()) ??
          false)
      const want = Math.max(1, Math.min(16, n))
      const pool = libre
        ? (options!.soutienCompleterEntries ?? [])
            .filter((e) => e.word.trim() && e.blank.trim())
            .slice(0, want)
            .map((row) => ({
              article: row.article.trim() || 'Un',
              before: row.before,
              blank: row.blank,
              after: row.after,
              word: row.word.trim(),
              imageSrc: row.imageSrc || soutienImageFor(row.word),
            }))
        : shuffle(rng, [...bank.completes])
            .slice(0, Math.min(want, bank.completes.length))
            .map((row) => ({
              article: row.article,
              before: row.before,
              blank: row.blank,
              after: row.after,
              word: row.word,
              imageSrc: soutienImageFor(row.word),
            }))
      const rows = Math.max(1, Math.ceil(pool.length / cols))
      return {
        instruction: 'Complétez les mots à l’aide de l’image.',
        preferredColumns: 1,
        items: [
          {
            layout: 'syllable-complete',
            syllableCompletes: pool,
            answer: pool.map((row) => `${row.article} ${row.word}`).join(' · '),
            vocabRows: rows,
            vocabCols: cols,
            themeGraphemes: [...bank.graphemes],
          },
        ],
      }
    }
    case 'ecouter': {
      /** Grille : n° + case + trait (+ QR) ; positifs = son (au/eau admis pour /o/). */
      const cols = Math.max(1, Math.min(3, Math.round(options?.columns ?? 3) || 3))
      const need = Math.max(1, Math.min(18, n))
      const soundPool = lessonWordsBySound(bank)
      const posCount = Math.max(1, Math.min(need, Math.ceil(need * 0.55)))
      const negCount = Math.max(0, need - posCount)
      const positives = shuffle(rng, soundPool).slice(0, Math.min(posCount, soundPool.length))
      const negatives = shuffle(rng, otherWords(bank)).slice(0, negCount)
      let optionsList = shuffle(rng, [...positives, ...negatives])
      if (optionsList.length < need) {
        const extra = shuffle(rng, [...soundPool, ...otherWords(bank)]).filter(
          (w) => !optionsList.some((p) => p.toLowerCase() === w.toLowerCase()),
        )
        optionsList = [...optionsList, ...extra].slice(0, need)
      }
      optionsList = optionsList.slice(0, need)
      const positiveSet = new Set(positives.map((w) => w.toLowerCase()))
      const checked = optionsList.filter((w) => positiveSet.has(w.toLowerCase()))
      const audios = optionsList.map((w) => soutienAudioFor(w))
      return {
        instruction: `Écoutez les mots et cochez quand vous entendez le son ${bank.sound}.`,
        preferredColumns: 1,
        items: [
          {
            layout: 'listen-check',
            options: optionsList,
            optionAudioSrcs: audios.map((a) => a ?? ''),
            labels: checked,
            answer: checked.join(' · '),
            letterGridCols: cols,
            themeGraphemes: [...lessonSoundGraphemes(bank)],
          },
        ],
      }
    }
    case 'ecouter-image': {
      /** Grille images fluide ; positifs = son (au/eau admis pour /o/). */
      const cols = Math.max(3, Math.min(5, Math.round(options?.columns ?? 3) || 3))
      const need = Math.max(1, Math.min(20, n))
      const withImg = (list: readonly string[]) =>
        list.filter((w) => Boolean(soutienImageFor(w)))
      const soundPool = lessonWordsBySound(bank)
      const posPool = withImg(soundPool)
      const negPool = withImg([
        ...otherWords(bank),
        ...bank.completes.map((c) => c.word).filter((w) => !wordHasLessonSound(w, bank)),
        ...bank.syllableItems
          .map((item) => item.word)
          .filter((w) => !wordHasLessonSound(w, bank)),
      ])
      const posCount = Math.max(1, Math.min(need, Math.ceil(need * 0.55)))
      const positives = shuffle(rng, posPool).slice(0, Math.min(posCount, posPool.length))
      const negatives = shuffle(
        rng,
        negPool.filter((w) => !positives.some((p) => p.toLowerCase() === w.toLowerCase())),
      ).slice(0, Math.max(0, need - positives.length))
      let pool = shuffle(rng, [...positives, ...negatives])
      if (pool.length < need) {
        const extra = withImg([...soundPool, ...otherWords(bank)]).filter(
          (w) => !pool.some((p) => p.toLowerCase() === w.toLowerCase()),
        )
        pool = [...pool, ...shuffle(rng, extra)].slice(0, need)
      }
      pool = pool.slice(0, need)
      const images = pool.map((w) => soutienImageFor(w)!)
      const positiveSet = new Set(positives.map((w) => w.toLowerCase()))
      const checked = pool.filter((w) => positiveSet.has(w.toLowerCase()))
      return {
        instruction: `Écoutez. Cochez quand vous entendez le son ${bank.sound}.`,
        preferredColumns: 1,
        items: [
          {
            layout: 'listen-check',
            options: pool,
            optionImages: images,
            imagesAvailable: true,
            labels: checked,
            answer: checked.join(' · '),
            letterGridCols: cols,
            themeGraphemes: [...lessonSoundGraphemes(bank)],
          },
        ],
      }
    }
    case 'syllabe-son': {
      /** Grille fluide ; count = nb de cartes ; colonnes 1–3. */
      const cols = Math.max(1, Math.min(3, Math.round(options?.columns ?? 3) || 3))
      const need = Math.max(1, Math.min(18, n))
      const withSound = shuffle(
        rng,
        bank.syllableItems.filter((item) => wordHasGrapheme(item.word, asVowelBank(bank))),
      )
      const without = shuffle(
        rng,
        bank.syllableItems.filter((item) => !wordHasGrapheme(item.word, asVowelBank(bank))),
      )
      const posCount = Math.max(1, Math.min(need, Math.ceil(need * 0.7)))
      const chosenPos = withSound.slice(0, posCount)
      const chosenNeg = without.slice(0, Math.max(0, need - chosenPos.length))
      let chosen = shuffle(rng, [...chosenPos, ...chosenNeg]).slice(0, need)
      if (chosen.length < need) {
        const rest = bank.syllableItems.filter(
          (item) => !chosen.some((t) => t.word.toLowerCase() === item.word.toLowerCase()),
        )
        chosen = [...chosen, ...shuffle(rng, rest)].slice(0, need)
      }
      return {
        instruction: `À quelle syllabe entendez-vous le son ${bank.sound} ?`,
        preferredColumns: 1,
        items: [
          {
            layout: 'syllable-sound',
            syllableSoundItems: chosen.map((item) => {
              const parts = [...item.parts]
              const hitIndex = parts.findIndex((p) => wordHasGrapheme(p, asVowelBank(bank)))
              return {
                word: item.word,
                parts,
                hitIndex: hitIndex >= 0 ? hitIndex : -1,
                imageSrc: soutienImageFor(item.word),
              }
            }),
            answer: chosen
              .map((item) => {
                const parts = item.parts
                const hit = parts.find((p) => wordHasGrapheme(p, asVowelBank(bank)))
                return hit ? `${item.word} → ${hit}` : item.word
              })
              .join(' · '),
            letterGridCols: cols,
            themeGraphemes: [...bank.graphemes],
          },
        ],
      }
    }
    case 'lettres-phrase': {
      /** Phrases à trous ; count = nb de mots / lignes ; lettres remélangées à chaque tirage. */
      const want = Math.max(1, Math.min(16, n))
      const rows = shuffle(rng, [...bank.scrambles]).slice(
        0,
        Math.min(want, bank.scrambles.length),
      )
      return {
        instruction: 'Écrivez le mot correct à l’aide des lettres.',
        preferredColumns: 1,
        items: [
          {
            layout: 'phrase-scramble',
            phraseScrambles: rows.map((row) => {
              const lower = row.sentence.toLowerCase()
              const w = row.word.toLowerCase()
              const idx = lower.indexOf(w)
              const before = idx >= 0 ? row.sentence.slice(0, idx) : `${row.sentence} `
              const after = idx >= 0 ? row.sentence.slice(idx + row.word.length) : ''
              const letters = shuffle(
                rng,
                [...row.word.toLocaleUpperCase('fr-FR')].filter((ch) => /\p{L}/u.test(ch)),
              ).join(' ')
              return {
                before,
                after,
                word: row.word,
                letters,
                imageSrc: soutienImageFor(row.word),
              }
            }),
            answer: rows.map((row) => row.word).join(' · '),
            themeGraphemes: [...bank.graphemes],
          },
        ],
      }
    }
    case 'determinants': {
      /** Tableau : n° + phrase avec traits couleur thème (le / la / l’ / les). */
      const rows = shuffle(rng, [...bank.determinants]).slice(
        0,
        Math.min(8, bank.determinants.length),
      )
      return {
        instruction: 'Complétez avec les déterminants l’, le, la ou les.',
        preferredColumns: 1,
        items: [
          {
            layout: 'determinant-fill',
            prompt: 'Complétez avec les déterminants l’, le, la ou les.',
            determinantFills: rows.map((row) => ({
              parts: row.parts.map((p) => ('blank' in p ? { blank: p.blank } : { t: p.t, u: p.u })),
              sentence: row.sentence,
            })),
            answer: rows.map((row) => row.sentence).join(' · '),
            themeGraphemes: [...bank.graphemes],
          },
        ],
      }
    }
    case 'dictee': {
      /** Grille 2×4 : n° + double trait (pointillé + plein) couleur thème. */
      const words = shuffle(rng, [...bank.words]).slice(0, Math.min(8, bank.words.length))
      return {
        instruction: 'Dictée. Écrivez les mots correctement !',
        preferredColumns: 1,
        items: [
          {
            layout: 'dictee-grid',
            prompt: 'Dictée. Écrivez les mots correctement !',
            dicteeWords: words,
            answer: words.join(' · '),
            themeGraphemes: [...bank.graphemes],
          },
        ],
      }
    }
    case 'compter': {
      /** Phrase Playwrite sans coloriage des lettres (type 12). */
      const phrases = shuffle(rng, [...bank.countPhrases]).slice(
        0,
        Math.min(5, bank.countPhrases.length),
      )
      const items = phrases.map((phrase) => ({
        phrase,
        count: countSoundInPhrase(phrase, bank),
      }))
      return {
        instruction: `Combien de fois entendez-vous le son ${bank.sound} ?`,
        preferredColumns: 1,
        items: [
          {
            layout: 'count-sound',
            prompt: `J’entends …… fois le son ${bank.sound}.`,
            countSoundItems: items,
            answer: items.map((it) => String(it.count)).join(' · '),
          },
        ],
      }
    }
    case 'ordre': {
      /** Pastilles Gattegno + lettres du son en couleur thème. */
      const rows = shuffle(rng, [...bank.orderSentences]).slice(
        0,
        Math.min(n, bank.orderSentences.length),
      )
      return {
        instruction: 'Mettez dans l’ordre les mots.',
        preferredColumns: 1,
        items: rows.map((taggedParts) => {
          const ordered: PhraseToken[] = tagged(taggedParts.join(' '))
          const scrambled = shuffle(rng, [...ordered])
          const sentence = joinSoutienOrder(ordered)
          return {
            layout: 'phrase-order' as const,
            tokens: scrambled,
            labels: ordered.map((t) => t.text),
            answer: sentence,
            responseAnswer: sentence,
            themeGraphemes: [...bank.graphemes],
          }
        }),
      }
    }
    case 'lire': {
      /** Phrases à lire ; voyelle du thème en couleur ; count réglable. */
      const want = Math.max(1, Math.min(20, n))
      const phrases = shuffle(rng, [...bank.readPhrases]).slice(
        0,
        Math.min(want, bank.readPhrases.length),
      )
      return {
        instruction: 'Lisez les phrases.',
        preferredColumns: 1,
        items: [
          {
            layout: 'read-phrases',
            readPhrases: phrases,
            answer: phrases.join(' · '),
            themeGraphemes: [...bank.graphemes],
          },
        ],
      }
    }
    case 'associer-audio': {
      /** QR audio (gauche) + mots mélangés à relier (droite). */
      const pairs = shuffle(rng, [...bank.audioPairs]).slice(
        0,
        Math.min(8, bank.audioPairs.length),
      )
      const listenWords = pairs.map((p) => p.word)
      const showWords = shuffle(
        rng,
        pairs.map((p) => p.word),
      )
      return {
        instruction: 'Écoutez (QR) et reliez au bon mot.',
        preferredColumns: 1,
        items: [
          {
            layout: 'audio-match',
            prompt: 'Écoutez et reliez au bon mot.',
            audioMatchRows: listenWords.map((listenWord, i) => ({
              listenWord,
              audioSrc: soutienAudioFor(listenWord),
              showWord: showWords[i] ?? listenWord,
            })),
            answer: listenWords.map((w, i) => `${i + 1} → ${w}`).join(' · '),
            themeGraphemes: [...bank.graphemes],
          },
        ],
      }
    }
    case 'mots-meles': {
      /** Liste 12 mots + grille 15×15 (H/V). */
      const puzzle = buildWordSearch(rng, bank.wordSearchWords, 15, 12)
      const hits = [...wordSearchHitCells(puzzle.placements)]
      return {
        instruction: 'Entourez les mots dans la grille.',
        preferredColumns: 1,
        items: [
          {
            layout: 'word-search',
            prompt: 'Entourez les mots dans la grille.',
            wordSearch: {
              size: puzzle.size,
              grid: puzzle.grid,
              words: puzzle.words,
              hitCells: hits,
            },
            answer: puzzle.words.join(' · '),
            themeGraphemes: [...bank.graphemes],
          },
        ],
      }
    }
    default:
      return { instruction: 'Complétez.', items: [] }
  }
}

export function tryGenerateSoutienBatch(
  exerciseType: string,
  count: number,
  rng: Rng,
  difficulty: Difficulty = 'moyen',
  options?: SoutienGenerateOptions,
): SoutienBatch | null {
  const parsed = parseSoutienType(exerciseType)
  if (!parsed) return null
  const bank = soutienBankByTopic(`soutien-${parsed.vowel}`)
  if (!bank) return null
  const batch = genKind(parsed.kind, bank, count, rng, difficulty, options)
  // Consigne une seule fois (en-tête d’exercice) — pas de prompt sous chaque item.
  return {
    ...batch,
    items: batch.items.map((item) => ({ ...item, prompt: undefined })),
  }
}
