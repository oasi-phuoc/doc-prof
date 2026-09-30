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

function splitSyllables(word: string, bank: SoutienVowelBank): string[] {
  const lower = word.toLowerCase()
  for (const g of bank.graphemes) {
    const idx = lower.indexOf(g)
    if (idx >= 0) {
      const left = word.slice(0, idx)
      const mid = word.slice(idx, idx + g.length)
      const right = word.slice(idx + g.length)
      const parts = [left, mid, right].filter((p) => p.length > 0)
      if (parts.length >= 2) return parts
    }
  }
  if (word.length <= 3) return [word]
  const mid = Math.ceil(word.length / 2)
  return [word.slice(0, mid), word.slice(mid)]
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
      const positives = shuffle(rng, [...bank.words]).filter((w) => soutienImageFor(w)).slice(0, 5)
      const negatives = shuffle(rng, otherWords(bank)).filter((w) => soutienImageFor(w)).slice(0, 4)
      const pool = shuffle(rng, [...positives, ...negatives])
      const images = pool.map((w) => soutienImageFor(w)!)
      return {
        instruction: `Cochez quand vous entendez le son ${bank.sound}.`,
        preferredColumns: 1,
        items: [
          {
            layout: 'select',
            selectVariant: 'cards',
            prompt: `Cochez quand vous entendez le son ${bank.sound}.`,
            options: pool,
            optionImages: images,
            imagesAvailable: true,
            answer: positives.join(' · '),
            labels: positives,
          },
        ],
      }
    }
    case 'syllabe-son': {
      const withSound = shuffle(
        rng,
        bank.syllableWords.filter((w) => wordHasGrapheme(w, asVowelBank(bank))),
      )
      const without = shuffle(
        rng,
        [
          ...otherWords(bank),
          ...bank.syllableWords.filter((w) => !wordHasGrapheme(w, asVowelBank(bank))),
        ],
      )
      const chosenPos = withSound.slice(0, 9)
      const chosenNeg = without.slice(0, Math.max(0, 12 - chosenPos.length))
      const twelve = shuffle(rng, [...chosenPos, ...chosenNeg]).slice(0, 12)
      return {
        instruction: `À quelle syllabe entendez-vous le son ${bank.sound} ?`,
        preferredColumns: 2,
        items: twelve.map((word) => {
          const parts = splitSyllables(word, bank)
          const correct =
            parts.find((p) => wordHasGrapheme(p, asVowelBank(bank))) ??
            (wordHasGrapheme(word, asVowelBank(bank)) ? parts[0]! : '—')
          const options = parts.length >= 2 ? parts : [...parts, '—']
          return {
            layout: 'select' as const,
            prompt: word,
            options: shuffle(rng, options),
            answer: wordHasGrapheme(word, asVowelBank(bank)) ? correct : '—',
          }
        }),
      }
    }
    case 'lettres-phrase': {
      const rows = shuffle(rng, [...bank.scrambles]).slice(0, Math.min(n, bank.scrambles.length))
      return {
        instruction: 'Écrivez le mot correct à l’aide des lettres.',
        preferredColumns: 1,
        items: rows.map((row) => ({
          layout: 'text' as const,
          prompt: `${row.sentence} (${row.letters.split('').join(' ')})`,
          answer: row.word,
        })),
      }
    }
    case 'determinants': {
      const rows = shuffle(rng, [...bank.determinants]).slice(0, Math.min(n, bank.determinants.length))
      return {
        instruction: 'Complétez avec les déterminants l’, le, la ou les.',
        preferredColumns: 1,
        items: rows.map((row) => ({
          layout: 'text' as const,
          prompt: `___ ${row.rest}`,
          answer: row.blank,
          responseAnswer: row.sentence,
        })),
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
