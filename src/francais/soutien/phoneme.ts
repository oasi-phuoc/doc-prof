/**
 * Filtrage phonème / graphème pour Soutien FR.
 * Source : banque lecture soutien-scolaire (mots déjà découpés en phonèmes).
 *
 * - Type 1 / écrits : phonème de la leçon + lettre écrite (ex. /o/ → lettre o/ô).
 * - Audio : phonème seul (ex. /o/ inclut au, eau → bateau, chaud…).
 * - Types 12 / 14 : découpe Alpha (an/au/eau… exclus du /a/ simple).
 */
import { normalizeLetter } from '@/francais/lecture-banks'
import { VOCAB_TOPIC_BANKS } from '@/francais/vocab-registry'
import { tokenizeAlpha } from '@/jeux/alpha-phonics'
import type { SoutienCompound, SoutienVowelBank } from './banks'
import { GRAPHEME_WORD_POOLS } from './grapheme-word-pools'
import { LECTURE_WORD_ITEMS, type LectureWordItem } from './lecture-word-items'

/** Index label minuscule → item lecture. */
const LECTURE_BY_LABEL: Map<string, LectureWordItem> = (() => {
  const map = new Map<string, LectureWordItem>()
  for (const item of LECTURE_WORD_ITEMS) {
    const key = item.label.trim().toLowerCase()
    if (key && !map.has(key)) map.set(key, item)
  }
  return map
})()

/** Libellés Voc (sans sous-thème). */
export const ALL_VOCAB_LABELS: readonly string[] = (() => {
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

/** Phonème pédagogique de la leçon (ex. `/a/`, `/o/`). */
export function lessonPhoneme(bank: SoutienVowelBank): string {
  return bank.sound
}

/** Graphèmes écrits de la leçon (surlignage). */
export function lessonLetterGraphemes(bank: SoutienVowelBank): readonly string[] {
  return bank.graphemes
}

/**
 * Graphèmes pour le son (surlignage audio).
 * Pour /o/ : o, ô + au, eau (pool complexe lecture).
 */
export function lessonSoundGraphemes(bank: SoutienVowelBank): readonly string[] {
  if (bank.id === 'o') return [...bank.graphemes, 'au', 'eau']
  return bank.graphemes
}

function teachingPhonemes(label: string): readonly string[] | null {
  return LECTURE_BY_LABEL.get(label.trim().toLowerCase())?.phonemes ?? null
}

/** Le mot porte le phonème de la leçon (données lecture). */
export function wordHasLessonSound(word: string, bank: SoutienVowelBank): boolean {
  const phonemes = teachingPhonemes(word)
  if (!phonemes) return false
  return phonemes.includes(lessonPhoneme(bank))
}

/** Le mot contient la lettre écrite de la leçon (o / ô, a / à / â…). */
export function wordHasLessonLetter(word: string, bank: SoutienVowelBank): boolean {
  for (const g of bank.graphemes) {
    if (g.length > 1) {
      if (word.toLowerCase().includes(g.toLowerCase())) return true
      continue
    }
    for (const ch of word) {
      if (normalizeLetter(ch) === normalizeLetter(g)) return true
    }
  }
  return false
}

/** Cibles lettre de la leçon (a/à/â → « a », etc.). */
function lessonLetterTargets(bank: SoutienVowelBank): Set<string> {
  const targets = new Set<string>()
  targets.add(normalizeLetter(bank.letterLower))
  for (const g of bank.graphemes) {
    if (g.length === 1) targets.add(normalizeLetter(g))
  }
  return targets
}

/**
 * Segment Alpha = voyelle simple de la leçon (pas an / au / eau / on…).
 * Même logique que le coloriage Alpha des cartes vocabulaire.
 */
export function isLessonSimpleVowelSegment(
  segmentText: string,
  tone: string,
  bank: SoutienVowelBank,
): boolean {
  if (tone !== 'vowel') return false
  if (segmentText.length !== 1) return false
  return lessonLetterTargets(bank).has(normalizeLetter(segmentText))
}

/** Compte les phonèmes simples de la leçon dans un texte (Alpha). */
export function countLessonPhonemeInText(text: string, bank: SoutienVowelBank): number {
  let n = 0
  for (const seg of tokenizeAlpha(text)) {
    if (isLessonSimpleVowelSegment(seg.text, seg.tone, bank)) n += 1
  }
  return n
}

/** Découpe Alpha + marquage des voyelles simples de la leçon. */
export function lessonPhonemeSegments(
  text: string,
  bank: SoutienVowelBank,
): ReadonlyArray<{ text: string; hit: boolean }> {
  return tokenizeAlpha(text).map((seg) => ({
    text: seg.text,
    hit: isLessonSimpleVowelSegment(seg.text, seg.tone, bank),
  }))
}

/**
 * Variante à partir des seuls graphèmes (rendu UI sans objet banque).
 * Les graphèmes multi-lettres (au, eau) sont ignorés : on ne colorie que la lettre simple.
 */
export function lessonPhonemeSegmentsFromGraphemes(
  text: string,
  graphemes: readonly string[],
): ReadonlyArray<{ text: string; hit: boolean }> {
  const targets = new Set(
    graphemes.filter((g) => g.length === 1).map((g) => normalizeLetter(g)),
  )
  if (targets.size === 0) {
    return [{ text, hit: false }]
  }
  return tokenizeAlpha(text).map((seg) => ({
    text: seg.text,
    hit: seg.tone === 'vowel' && seg.text.length === 1 && targets.has(normalizeLetter(seg.text)),
  }))
}

/**
 * Pool lecture + Voc ayant le phonème exact de la leçon.
 * Voc n’est ajouté que s’il figure dans la banque lecture (phonèmes connus).
 */
function labelsWithPhoneme(bank: SoutienVowelBank): string[] {
  const phoneme = lessonPhoneme(bank)
  const seen = new Set<string>()
  const out: string[] = []
  for (const item of LECTURE_WORD_ITEMS) {
    if (!item.phonemes.includes(phoneme)) continue
    const key = item.label.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(item.label)
  }
  // Voc : uniquement si déjà découpé en phonèmes (même son).
  for (const label of ALL_VOCAB_LABELS) {
    const key = label.toLowerCase()
    if (seen.has(key)) continue
    const item = LECTURE_BY_LABEL.get(key)
    if (!item || !item.phonemes.includes(phoneme)) continue
    seen.add(key)
    out.push(label)
  }
  return out
}

/**
 * Mots écrits (type 1) : phonème exact + lettre de la leçon.
 * Ex. /o/ → tomate, robot (lettre o) ; pas bateau / chaud (au, eau).
 */
export function lessonWordsByLetter(bank: SoutienVowelBank): string[] {
  const fromSound = labelsWithPhoneme(bank).filter((w) => wordHasLessonLetter(w, bank))
  // Enrichir avec le pool graphème lettre (y, etc.) si disponible.
  const letterPools = GRAPHEME_WORD_POOLS.letters as Record<string, readonly string[]>
  const letterPool = letterPools[bank.letterLower] ?? []
  const seen = new Set(fromSound.map((w) => w.toLowerCase()))
  const out = [...fromSound]
  for (const w of letterPool) {
    const key = w.toLowerCase()
    if (seen.has(key)) continue
    // Pool lettre : garder seulement si le phonème lecture est confirmé.
    if (!wordHasLessonSound(w, bank)) continue
    seen.add(key)
    out.push(w)
  }
  return preferBankOrder(bank, out)
}

/**
 * Mots audio : phonème exact (au / eau admis pour /o/).
 * Enrichit aussi avec le pool complexe au-eau pour /o/.
 */
export function lessonWordsBySound(bank: SoutienVowelBank): string[] {
  const base = labelsWithPhoneme(bank)
  if (bank.id !== 'o') return preferBankOrder(bank, base)
  const complexPools = GRAPHEME_WORD_POOLS.complex as Record<string, readonly string[]>
  const auEau = complexPools['au-eau'] ?? []
  const seen = new Set(base.map((w) => w.toLowerCase()))
  const out = [...base]
  for (const w of auEau) {
    const key = w.toLowerCase()
    if (seen.has(key)) continue
    const item = LECTURE_BY_LABEL.get(key)
    if (item && !item.phonemes.includes('/o/')) continue
    seen.add(key)
    out.push(w)
  }
  return preferBankOrder(bank, out)
}

/** Banque Soutien d’abord, puis mots lecture / Voc. */
function preferBankOrder(bank: SoutienVowelBank, pool: readonly string[]): string[] {
  const poolByKey = new Map(pool.map((w) => [w.toLowerCase(), w] as const))
  const seen = new Set<string>()
  const out: string[] = []
  for (const w of bank.words) {
    const key = w.toLowerCase()
    if (!poolByKey.has(key)) continue
    if (seen.has(key)) continue
    seen.add(key)
    out.push(w)
  }
  for (const w of pool) {
    const key = w.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(w)
  }
  return out
}

/** Découpe un mot en deux parties pour le type 4 (si absent de la banque). */
function autoSplitWord(word: string): readonly [string, string] | null {
  const w = word.trim()
  if (w.length < 2) return null
  const vowels = /[aeiouyàâäéèêëïîôöùûüœæ]/i
  const mid = Math.max(1, Math.floor(w.length / 2))
  for (let i = mid; i >= 1; i--) {
    if (vowels.test(w[i - 1]!)) return [w.slice(0, i), w.slice(i)] as const
  }
  for (let i = mid; i < w.length; i++) {
    if (vowels.test(w[i]!)) return [w.slice(0, i + 1), w.slice(i + 1)] as const
  }
  return [w.slice(0, mid), w.slice(mid)] as const
}

/**
 * Jusqu’à 16 composés alignés sur les mots du type 1 (banque puis découpe auto).
 */
export function compoundsForType1Words(
  bank: SoutienVowelBank,
  words: readonly string[],
): SoutienCompound[] {
  const byWord = new Map(
    bank.compounds.map((c) => [c.word.trim().toLowerCase(), c] as const),
  )
  const out: SoutienCompound[] = []
  const seen = new Set<string>()
  for (const word of words.slice(0, 16)) {
    const key = word.trim().toLowerCase()
    if (!key || seen.has(key)) continue
    const existing = byWord.get(key)
    if (existing) {
      seen.add(key)
      out.push(existing)
      continue
    }
    const parts = autoSplitWord(word)
    if (!parts || !parts[0] || !parts[1]) continue
    seen.add(key)
    out.push({ parts: [parts[0], parts[1]], word })
  }
  return out
}
