import { countGrapheme, wordHasGrapheme, type VowelBank } from '@/francais/lecture-banks'
import { VOCAB_TOPIC_BANKS } from '@/francais/vocab-registry'
import { pick, shuffle, type Rng } from '@/math/rng'
import type { Difficulty, MathItem } from '@/math/types'
import { soutienBankByTopic, type SoutienVowelBank } from './banks'
import { soutienEntriesWithImages, soutienImageFor } from './images'
import { parseSoutienType, type SoutienKindId } from './kinds'

/** Mots Voc (libellés) — distracteurs / pool images partagé avec le vocabulaire. */
const VOCAB_LABELS: readonly string[] = (() => {
  const labels: string[] = []
  const seen = new Set<string>()
  for (const topic of VOCAB_TOPIC_BANKS) {
    for (const subgroup of topic.subgroups) {
      for (const word of subgroup.words) {
        const key = word.label.trim().toLowerCase()
        if (!key || seen.has(key)) continue
        seen.add(key)
        labels.push(word.label.trim())
      }
    }
  }
  return labels
})()

export type SoutienBatch = {
  items: MathItem[]
  instruction: string
  preferredColumns?: number
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
  const own = new Set(bank.words.map((w) => w.toLowerCase()))
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
  const pool = VOCAB_LABELS.length > 0 ? VOCAB_LABELS : fallback
  return pool.filter((w) => !own.has(w.toLowerCase()) && !wordHasGrapheme(w, asVowelBank(bank)))
}

function letterGrid(rng: Rng, bank: SoutienVowelBank, difficulty: Difficulty): MathItem {
  /** Tableau 5 × 10 sans bordure (modèle livret Soutien FR). */
  const cols = 10
  const rows = 5
  const size = cols * rows
  const targetCount = difficulty === 'facile' ? 10 : difficulty === 'moyen' ? 12 : 14
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

function genKind(
  kind: SoutienKindId,
  bank: SoutienVowelBank,
  count: number,
  rng: Rng,
  difficulty: Difficulty,
): { items: MathItem[]; instruction: string; preferredColumns?: number } {
  const n = Math.max(1, count)

  switch (kind) {
    case 'mots': {
      const words = bank.words.slice(0, 16)
      const entries = soutienEntriesWithImages(words)
      return {
        instruction: `On entend le son ${bank.sound} dans ces mots.`,
        preferredColumns: 1,
        items: [
          {
            layout: 'vocab-table',
            prompt: `On entend le son ${bank.sound} dans ces mots.`,
            vocabEntries: entries,
            vocabRows: 4,
            vocabCols: 4,
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
        items: [letterGrid(rng, bank, difficulty)],
      }
    case 'syllabes': {
      /** Deux tableaux 4 × 5 (script + Playwrite), voyelle en couleur du thème. */
      const cols = 5
      const rows = 4
      const need = cols * rows
      const pool = shuffle(rng, [...bank.syllables])
      const list =
        pool.length >= need
          ? pool.slice(0, need)
          : [...pool, ...Array.from({ length: need - pool.length }, (_, i) => pool[i % pool.length]!)]
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
      /** 7 paires, syllabes découpées correctement ; droite mélangée. */
      const compounds = shuffle(rng, [...bank.compounds]).slice(
        0,
        Math.min(7, bank.compounds.length),
      )
      const left = compounds.map((c) => c.parts[0])
      const right = shuffle(
        rng,
        compounds.map((c) => c.parts[1]),
      )
      const pairs = compounds.map((c) => ({ left: c.parts[0], right: c.parts[1] }))
      return {
        instruction: 'Reliez les parties et formez un mot.',
        preferredColumns: 1,
        items: [
          {
            layout: 'vocab-match',
            prompt: 'Reliez les parties et formez un mot.',
            labels: left,
            options: right,
            vocabMatchMode: 'syllables',
            themeGraphemes: [...bank.graphemes],
            vocabPairs: pairs,
            answer: compounds.map((c) => `${c.parts[0]} + ${c.parts[1]} → ${c.word}`).join(' · '),
          },
        ],
      }
    }
    case 'completer': {
      /** Grille 2×5 : image + Un/Une + [avant]____[après] (trait couleur thème). */
      const pool = shuffle(rng, [...bank.completes]).slice(0, Math.min(10, bank.completes.length))
      return {
        instruction: 'Complétez les mots à l’aide de l’image.',
        preferredColumns: 1,
        items: [
          {
            layout: 'syllable-complete',
            prompt: 'Complétez les mots à l’aide de l’image.',
            syllableCompletes: pool.map((row) => ({
              article: row.article,
              before: row.before,
              blank: row.blank,
              after: row.after,
              word: row.word,
              imageSrc: soutienImageFor(row.word),
            })),
            answer: pool.map((row) => `${row.article} ${row.word}`).join(' · '),
            vocabRows: 5,
            vocabCols: 2,
          },
        ],
      }
    }
    case 'ecouter': {
      /** Grille 3×9 : n° + case + trait ; mots dictés (corrigé). */
      const positives = shuffle(rng, [...bank.words]).slice(0, 5)
      const negatives = shuffle(rng, otherWords(bank)).slice(0, 4)
      const options = shuffle(rng, [...positives, ...negatives])
      return {
        instruction: `Écoutez les mots et cochez quand vous entendez le son ${bank.sound}.`,
        preferredColumns: 1,
        items: [
          {
            layout: 'listen-check',
            prompt: `Écoutez. Cochez quand vous entendez le son ${bank.sound}.`,
            options,
            labels: positives,
            answer: positives.join(' · '),
            letterGridCols: 3,
            themeGraphemes: [...bank.graphemes],
          },
        ],
      }
    }
    case 'ecouter-image': {
      /** Grille 3×5 (15) : image + n° + case ; cocher si on entend le son. */
      const need = 15
      const withImg = (list: readonly string[]) =>
        list.filter((w) => Boolean(soutienImageFor(w)))
      const posPool = withImg(bank.words)
      const negPool = withImg([
        ...otherWords(bank),
        ...bank.completes.map((c) => c.word),
        ...bank.syllableItems.map((item) => item.word),
      ])
      const positives = shuffle(rng, posPool).slice(0, Math.min(8, posPool.length))
      const negatives = shuffle(
        rng,
        negPool.filter((w) => !positives.some((p) => p.toLowerCase() === w.toLowerCase())),
      ).slice(0, Math.max(0, need - positives.length))
      let pool = shuffle(rng, [...positives, ...negatives])
      if (pool.length < need) {
        const extra = withImg([...bank.words, ...otherWords(bank)]).filter(
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
            prompt: `Écoutez. Cochez quand vous entendez le son ${bank.sound}.`,
            options: pool,
            optionImages: images,
            imagesAvailable: true,
            labels: checked,
            answer: checked.join(' · '),
            letterGridCols: 5,
            themeGraphemes: [...bank.graphemes],
          },
        ],
      }
    }
    case 'syllabe-son': {
      /** Grille 3×4 : image + n° + mini-tableau (1 case / syllabe). */
      const withSound = shuffle(
        rng,
        bank.syllableItems.filter((item) => wordHasGrapheme(item.word, asVowelBank(bank))),
      )
      const without = shuffle(
        rng,
        bank.syllableItems.filter((item) => !wordHasGrapheme(item.word, asVowelBank(bank))),
      )
      const chosenPos = withSound.slice(0, 9)
      const chosenNeg = without.slice(0, Math.max(0, 12 - chosenPos.length))
      let twelve = shuffle(rng, [...chosenPos, ...chosenNeg]).slice(0, 12)
      if (twelve.length < 12) {
        const rest = bank.syllableItems.filter(
          (item) => !twelve.some((t) => t.word.toLowerCase() === item.word.toLowerCase()),
        )
        twelve = [...twelve, ...shuffle(rng, rest)].slice(0, 12)
      }
      return {
        instruction: `À quelle syllabe entendez-vous le son ${bank.sound} ?`,
        preferredColumns: 1,
        items: [
          {
            layout: 'syllable-sound',
            prompt: `Cochez la case de la syllabe où vous entendez le son ${bank.sound}.`,
            syllableSoundItems: twelve.map((item) => {
              const parts = [...item.parts]
              const hitIndex = parts.findIndex((p) => wordHasGrapheme(p, asVowelBank(bank)))
              return {
                word: item.word,
                parts,
                hitIndex: hitIndex >= 0 ? hitIndex : -1,
                imageSrc: soutienImageFor(item.word),
              }
            }),
            answer: twelve
              .map((item) => {
                const parts = item.parts
                const hit = parts.find((p) => wordHasGrapheme(p, asVowelBank(bank)))
                return hit ? `${item.word} → ${hit}` : item.word
              })
              .join(' · '),
            letterGridCols: 3,
            themeGraphemes: [...bank.graphemes],
          },
        ],
      }
    }
    case 'lettres-phrase': {
      /** Phrase + image + trait couleur thème + lettres mélangées. */
      const rows = shuffle(rng, [...bank.scrambles]).slice(
        0,
        Math.min(7, bank.scrambles.length),
      )
      return {
        instruction: 'Écrivez le mot correct à l’aide des lettres.',
        preferredColumns: 1,
        items: [
          {
            layout: 'phrase-scramble',
            prompt: 'Écrivez le mot correct à l’aide des lettres.',
            phraseScrambles: rows.map((row) => {
              const lower = row.sentence.toLowerCase()
              const w = row.word.toLowerCase()
              const idx = lower.indexOf(w)
              const before = idx >= 0 ? row.sentence.slice(0, idx) : `${row.sentence} `
              const after = idx >= 0 ? row.sentence.slice(idx + row.word.length) : ''
              return {
                before,
                after,
                word: row.word,
                letters: row.letters.split('').join(' '),
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
      const words = shuffle(rng, [...bank.words]).slice(0, Math.min(8, bank.words.length))
      return {
        instruction: 'Dictée. Écrivez les mots correctement !',
        preferredColumns: 1,
        items: words.map((word) => ({
          layout: 'vocab-write' as const,
          prompt: 'Écoutez et écrivez.',
          answer: word,
          vocabLineCh: 20,
        })),
      }
    }
    case 'compter': {
      const phrases = shuffle(rng, [...bank.countPhrases]).slice(0, Math.min(n, bank.countPhrases.length))
      return {
        instruction: `Combien de fois entendez-vous le son ${bank.sound} ?`,
        preferredColumns: 1,
        items: phrases.map((phrase) => {
          const total = countSoundInPhrase(phrase, bank)
          return {
            layout: 'text' as const,
            prompt: `${phrase}\nJ’entends ___ fois le son ${bank.sound}.`,
            answer: String(total),
          }
        }),
      }
    }
    case 'ordre': {
      const rows = shuffle(rng, [...bank.orderSentences]).slice(0, Math.min(n, bank.orderSentences.length))
      return {
        instruction: 'Mettez dans l’ordre les mots.',
        preferredColumns: 1,
        items: rows.map((tokens) => {
          const ordered = [...tokens]
          const scrambled = shuffle(rng, [...tokens])
          return {
            layout: 'phrase-order' as const,
            tokens: scrambled.map((text) => ({ text, category: 'nom' as const })),
            labels: ordered,
            answer: ordered.join(' '),
            responseAnswer: ordered.join(' '),
          }
        }),
      }
    }
    case 'lire': {
      const phrases = bank.readPhrases.slice(0, Math.min(16, bank.readPhrases.length))
      return {
        instruction: 'Lisez les phrases.',
        preferredColumns: 1,
        items: phrases.map((phrase, index) => ({
          layout: 'text' as const,
          prompt: `${index + 1}.`,
          answer: phrase,
          labels: [phrase],
        })),
      }
    }
    case 'associer-audio': {
      const pairs = shuffle(rng, [...bank.audioPairs]).slice(0, Math.min(8, bank.audioPairs.length))
      const left = pairs.map((p) => p.word)
      const right = shuffle(
        rng,
        pairs.map((p) => p.word),
      )
      // distractors on the sheet: show word + other as choice columns via match
      const options = shuffle(
        rng,
        Array.from(new Set([...pairs.map((p) => p.word), ...pairs.map((p) => p.other)])),
      )
      return {
        instruction: 'Écoutez et associez le mot.',
        preferredColumns: 1,
        items: [
          {
            layout: 'vocab-match',
            prompt: 'Écoutez et associez le mot.',
            labels: left.map((_, i) => String(i + 1)),
            options: right.length ? right : options,
            vocabMatchMode: 'text',
            vocabPairs: pairs.map((p, i) => ({ left: String(i + 1), right: p.word })),
            answer: pairs.map((p, i) => `${i + 1} → ${p.word}`).join(' · '),
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
): SoutienBatch | null {
  const parsed = parseSoutienType(exerciseType)
  if (!parsed) return null
  const bank = soutienBankByTopic(`soutien-${parsed.vowel}`)
  if (!bank) return null
  return genKind(parsed.kind, bank, count, rng, difficulty)
}
