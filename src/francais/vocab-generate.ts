import { int, pick, shuffle, type Rng } from '@/math/rng'
import type { Difficulty, MathItem } from '@/math/types'
import {
  parseVocabKind,
  resolveVocabPool,
  vocabLevelFromDifficulty,
  wordHasGender,
  wordHasSynAnt,
  type VocabExerciseKind,
  type VocabWordEntry,
} from './vocab-learn'

export type VocabGenOptions = {
  vocabSelected?: string[]
  vocabLineCh?: number
  difficulty?: Difficulty
}

function lineCh(options: VocabGenOptions | undefined, fallback: number): number {
  const n = options?.vocabLineCh
  if (n == null || !Number.isFinite(n)) return fallback
  return Math.max(4, Math.min(48, Math.round(n)))
}

function uniqueWords(pool: VocabWordEntry[], count: number, rng: Rng): VocabWordEntry[] {
  if (pool.length === 0) return []
  const mixed = shuffle(rng, pool)
  return mixed.slice(0, Math.min(count, mixed.length))
}

function distractors(pool: VocabWordEntry[], answerId: string, n: number, rng: Rng): string[] {
  const others = shuffle(
    rng,
    pool.filter((w) => w.id !== answerId).map((w) => w.label),
  )
  return others.slice(0, n)
}

function pickSentence(
  word: VocabWordEntry,
  kind: 'trous' | 'phrase' | 'dictee',
  level: ReturnType<typeof vocabLevelFromDifficulty>,
  rng: Rng,
  used: Set<string>,
): string {
  const list = word.sentences[kind][level]
  const free = list.filter((s) => !used.has(s))
  const chosen = pick(rng, free.length ? free : list)
  used.add(chosen)
  return chosen
}

function matchItem(
  prompt: string,
  left: string[],
  right: string[],
  pairs: Array<{ left: string; right: string }>,
  mode: 'image' | 'text',
): MathItem {
  return {
    layout: 'vocab-match',
    prompt,
    answer: pairs.map((p) => `${p.left} → ${p.right}`).join(' · '),
    labels: left,
    options: right,
    vocabMatchMode: mode,
    vocabPairs: pairs,
  }
}

function writeItem(prompt: string, answer: string, ch: number, extra?: Partial<MathItem>): MathItem {
  return {
    layout: 'vocab-write',
    prompt,
    answer,
    vocabLineCh: ch,
    ...extra,
  }
}

function genAssocImage(pool: VocabWordEntry[], count: number, rng: Rng): MathItem[] {
  const words = uniqueWords(
    pool.filter((w) => w.imageSrc),
    count,
    rng,
  )
  if (words.length < 2) return []
  const left = words.map((w) => w.imageSrc!)
  const rightLabels = shuffle(
    rng,
    words.map((w) => w.label),
  )
  const pairs = words.map((w) => ({ left: w.imageSrc!, right: w.label }))
  return [matchItem('Reliez chaque image au bon mot.', left, rightLabels, pairs, 'image')]
}

function genAssocDef(pool: VocabWordEntry[], count: number, rng: Rng): MathItem[] {
  const words = uniqueWords(pool, count, rng)
  if (words.length < 2) return []
  const left = words.map((w) => w.definition)
  const rightLabels = shuffle(
    rng,
    words.map((w) => w.label),
  )
  const pairs = words.map((w) => ({ left: w.definition, right: w.label }))
  return [matchItem('Reliez chaque définition au bon mot.', left, rightLabels, pairs, 'text')]
}

function genQcmDef(pool: VocabWordEntry[], count: number, rng: Rng): MathItem[] {
  const words = uniqueWords(pool, count, rng)
  return words.map((word) => {
    const opts = shuffle(rng, [word.label, ...distractors(pool, word.id, 3, rng)]).slice(0, 4)
    return {
      layout: 'select' as const,
      prompt: word.definition,
      options: opts,
      answer: word.label,
    }
  })
}

function genTrous(
  pool: VocabWordEntry[],
  count: number,
  rng: Rng,
  level: ReturnType<typeof vocabLevelFromDifficulty>,
  ch: number,
): MathItem[] {
  const words = uniqueWords(pool, count, rng)
  const used = new Set<string>()
  return words.map((word) => {
    const sentence = pickSentence(word, 'trous', level, rng, used)
    return writeItem(sentence, word.label, ch)
  })
}

function genDefEcrire(pool: VocabWordEntry[], count: number, rng: Rng, ch: number): MathItem[] {
  const words = uniqueWords(pool, count, rng)
  return words.map((word) => writeItem(word.definition, word.label, ch))
}

function genPhrase(
  pool: VocabWordEntry[],
  count: number,
  rng: Rng,
  level: ReturnType<typeof vocabLevelFromDifficulty>,
  ch: number,
): MathItem[] {
  const words = uniqueWords(pool, count, rng)
  const used = new Set<string>()
  return words.map((word) => {
    const example = pickSentence(word, 'phrase', level, rng, used)
    return writeItem(`Écrivez une phrase avec le mot « ${word.label} ».`, example, Math.max(ch, 28), {
      vocabWriteHint: word.label,
    })
  })
}

function genDictee(
  pool: VocabWordEntry[],
  count: number,
  rng: Rng,
  level: ReturnType<typeof vocabLevelFromDifficulty>,
  ch: number,
): MathItem[] {
  const words = uniqueWords(pool, count, rng)
  const used = new Set<string>()
  return words.map((word, index) => {
    const sentence = pickSentence(word, 'dictee', level, rng, used)
    return writeItem(`Dictée ${index + 1}`, sentence, Math.max(ch, 24), {
      vocabWriteHint: word.label,
      vocabDictee: sentence,
    })
  })
}

function scrambleSyllables(syllables: string[], rng: Rng): string[] {
  if (syllables.length <= 1) return [...syllables]
  let mixed = shuffle(rng, syllables)
  let guard = 0
  while (mixed.join('') === syllables.join('') && guard < 8) {
    mixed = shuffle(rng, syllables)
    guard += 1
  }
  return mixed
}

function genSyllabes(pool: VocabWordEntry[], count: number, rng: Rng, ch: number): MathItem[] {
  const words = uniqueWords(
    pool.filter((w) => w.syllables.length > 1),
    count,
    rng,
  )
  return words.map((word) => {
    const parts = scrambleSyllables(word.syllables, rng)
    return writeItem(`Reconstituez le mot : ${parts.join(' · ')}`, word.label, ch, {
      options: parts,
    })
  })
}

function genSynAnt(pool: VocabWordEntry[], count: number, rng: Rng, ch: number): MathItem[] {
  const eligible = pool.filter(wordHasSynAnt)
  const words = uniqueWords(eligible, count, rng)
  return words.map((word) => {
    const askSyn = word.synonym && (!word.antonym || int(rng, 0, 1) === 0)
    if (askSyn && word.synonym) {
      return writeItem(`Donnez un synonyme de « ${word.label} ».`, word.synonym, ch)
    }
    return writeItem(`Donnez un antonyme de « ${word.label} ».`, word.antonym!, ch)
  })
}

function genGenre(pool: VocabWordEntry[], count: number, rng: Rng, ch: number): MathItem[] {
  const eligible = pool.filter(wordHasGender)
  const words = uniqueWords(eligible, count, rng)
  return words.map((word) => {
    const askFem = word.label === word.masculine || (!word.feminine ? false : int(rng, 0, 1) === 0)
    if (askFem && word.feminine) {
      return writeItem(`Écrivez la forme féminine de « ${word.masculine ?? word.label} ».`, word.feminine, ch)
    }
    return writeItem(`Écrivez la forme masculine de « ${word.feminine ?? word.label} ».`, word.masculine!, ch)
  })
}

const GENERATORS: Record<
  VocabExerciseKind,
  (pool: VocabWordEntry[], count: number, rng: Rng, options: VocabGenOptions) => MathItem[]
> = {
  'assoc-image': (pool, count, rng) => genAssocImage(pool, count, rng),
  'assoc-def': (pool, count, rng) => genAssocDef(pool, count, rng),
  'qcm-def': (pool, count, rng) => genQcmDef(pool, count, rng),
  trous: (pool, count, rng, options) =>
    genTrous(pool, count, rng, vocabLevelFromDifficulty(options.difficulty), lineCh(options, 10)),
  'def-ecrire': (pool, count, rng, options) => genDefEcrire(pool, count, rng, lineCh(options, 10)),
  phrase: (pool, count, rng, options) =>
    genPhrase(pool, count, rng, vocabLevelFromDifficulty(options.difficulty), lineCh(options, 32)),
  dictee: (pool, count, rng, options) =>
    genDictee(pool, count, rng, vocabLevelFromDifficulty(options.difficulty), lineCh(options, 28)),
  syllabes: (pool, count, rng, options) => genSyllabes(pool, count, rng, lineCh(options, 12)),
  'syn-ant': (pool, count, rng, options) => genSynAnt(pool, count, rng, lineCh(options, 12)),
  genre: (pool, count, rng, options) => genGenre(pool, count, rng, lineCh(options, 12)),
}

const INSTRUCTIONS: Record<VocabExerciseKind | 'mots', string> = {
  mots: 'Observez les images et apprenez les mots.',
  'assoc-image': 'Reliez chaque image au bon mot.',
  'assoc-def': 'Reliez chaque définition au bon mot.',
  'qcm-def': 'Lisez la définition. Choisissez le bon mot.',
  trous: 'Complétez chaque phrase avec le bon mot.',
  'def-ecrire': 'Lisez la définition. Écrivez le mot.',
  phrase: 'Écrivez une phrase avec chaque mot.',
  dictee: 'Écoutez. Écrivez le mot ou la phrase dictée.',
  syllabes: 'Remettez les syllabes dans l’ordre pour former le mot.',
  'syn-ant': 'Donnez le synonyme ou l’antonyme demandé.',
  genre: 'Écrivez la forme masculine ou féminine demandée.',
}

export function tryGenerateVocabBlock(
  typeId: string,
  topic: string,
  count: number,
  rng: Rng,
  options?: VocabGenOptions,
): { items: MathItem[]; instruction: string } | null {
  const kind = parseVocabKind(typeId)
  if (!kind || kind === 'mots') return null
  const pool = resolveVocabPool(topic, options?.vocabSelected)
  if (pool.length === 0) {
    return {
      items: [
        {
          layout: 'text',
          prompt: 'Aucun mot sélectionné. Cochez des mots dans la liste Voc.',
          answer: '',
        },
      ],
      instruction: INSTRUCTIONS[kind],
    }
  }
  const gen = GENERATORS[kind]
  let items = gen(pool, Math.max(1, count), rng, options ?? {})
  if (items.length === 0) {
    items = [
      {
        layout: 'text',
        prompt:
          kind === 'syn-ant'
            ? 'Aucun synonyme / antonyme disponible pour les mots sélectionnés.'
            : kind === 'genre'
              ? 'Aucune paire masculin / féminin disponible pour les mots sélectionnés.'
              : kind === 'assoc-image'
                ? 'Aucune image disponible pour les mots sélectionnés.'
                : 'Impossible de générer cet exercice avec le pool actuel.',
        answer: '',
      },
    ]
  }
  return { items, instruction: INSTRUCTIONS[kind] }
}
