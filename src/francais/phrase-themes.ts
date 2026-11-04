/** Shared menu order and affirmative/negative pairs for Gattegno. */
export const PHRASE_ALL_THEME_DEFS = [
  { topic: 'phrase-simple', label: 'Simple' },
  { topic: 'phrase-negation', label: 'Négation simple' },
  { topic: 'phrase-determinants', label: 'Déterminants' },
  { topic: 'phrase-negation-determinants', label: 'Négation déterminants' },
  { topic: 'phrase-pronominaux', label: 'Verbes pronominaux' },
  { topic: 'phrase-negation-pronominaux', label: 'Négation des verbes pronominaux' },
  { topic: 'phrase-adjectif', label: 'Adjectif' },
  { topic: 'phrase-negation-adjectif', label: 'Négation avec adjectif' },
  { topic: 'phrase-preposition', label: 'Préposition' },
  { topic: 'phrase-negation-preposition', label: 'Négation prépositions' },
  { topic: 'phrase-adverbe', label: 'Adverbe' },
  { topic: 'phrase-negation-adverbe', label: 'Négation avec adverbe' },
  { topic: 'phrase-conjonctions', label: 'Conjonctions' },
  { topic: 'phrase-negation-conjonctions', label: 'Négation avec conjonctions' },
] as const

export type PhraseThemeId = (typeof PHRASE_ALL_THEME_DEFS)[number]['topic']
export type PhrasePolarity = 'positive' | 'negative' | 'mixed'

const AFFIRMATIVE: Partial<Record<PhraseThemeId, PhraseThemeId>> = {
  'phrase-negation': 'phrase-simple',
  'phrase-negation-determinants': 'phrase-determinants',
  'phrase-negation-pronominaux': 'phrase-pronominaux',
  'phrase-negation-adjectif': 'phrase-adjectif',
  'phrase-negation-preposition': 'phrase-preposition',
  'phrase-negation-adverbe': 'phrase-adverbe',
  'phrase-negation-conjonctions': 'phrase-conjonctions',
}

export function isPhraseThemeId(value: string): value is PhraseThemeId {
  return PHRASE_ALL_THEME_DEFS.some(theme => theme.topic === value)
}

export function affirmativePhraseTheme(theme: PhraseThemeId): PhraseThemeId {
  return AFFIRMATIVE[theme] ?? theme
}

export function isNegativePhraseTheme(theme: string): boolean {
  return Object.hasOwn(AFFIRMATIVE, theme)
}

/** Negative ids remain readable for saved recipes; the menu uses combined themes. */
export const PHRASE_THEME_DEFS = PHRASE_ALL_THEME_DEFS.filter(theme => !isNegativePhraseTheme(theme.topic))

/** Migrate saved negative-theme recipes without losing their selected exercise or content. */
export function normalizeLegacyPhraseBlock<T extends {
  topic: string; exerciseType: string; phrasePolarity?: PhrasePolarity
}>(block: T): T {
  if (!isPhraseThemeId(block.topic) || !isNegativePhraseTheme(block.topic)) return block
  const topic = affirmativePhraseTheme(block.topic)
  return {
    ...block,
    topic,
    exerciseType: block.exerciseType.replace(`${block.topic}-`, `${topic}-`),
    phrasePolarity: block.phrasePolarity ?? 'negative',
  }
}
