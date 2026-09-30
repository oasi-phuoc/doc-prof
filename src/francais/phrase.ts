import {
  COMMON,
  framesForTheme,
  instantiateThemeFrame,
  isProperNameToken,
  joinPhrase,
  pronounsForFrame,
  resolveAdjPlacement,
  subjectKindOf,
  subjectsForAdjPlacement,
  type AdjPlacement,
  type SubjectKind,
} from './phrase-sentences'
import { PRODUCTION_PROMPTS_BY_THEME, VERBES, type PhraseThemeId } from './phrase-banks'
import { pick, shuffle, type Rng } from '@/math/rng'
import type { Difficulty, MathItem, PhraseToken, PhraseVerbGroup } from '@/math/types'

export type PhraseBatch = {
  items: MathItem[]
  instruction: string
  preferredColumns?: number
}

export type { PhraseThemeId }

type BuiltPhrase = {
  tokens: PhraseToken[]
  sentence: string
  verbInfinitive: string
}

function uncap(text: string): string {
  if (!text) return text
  return text[0]!.toLowerCase() + text.slice(1)
}

/** Minuscule pour le tirage « ordre », sauf prénoms / noms propres. */
function tokenForOrder(token: PhraseToken): PhraseToken {
  if (isProperNameToken(token)) {
    const capped = token.text ? token.text[0]!.toUpperCase() + token.text.slice(1) : token.text
    return capped === token.text ? token : { ...token, text: capped }
  }
  return { ...token, text: uncap(token.text) }
}

function builtFromTokens(tokens: PhraseToken[]): BuiltPhrase {
  const sentence = joinPhrase(tokens)
  const verb = tokens.find((token) => token.category === 'verbe')
  const verbText = verb?.text ?? ''
  const infinitive =
    VERBES.find((entry) => (Object.values(entry.forms) as string[]).includes(verbText))?.infinitive ??
    verbText
  return { tokens, sentence, verbInfinitive: infinitive }
}

/**
 * Tirage équilibré : ~⅓ prénom, ~⅓ déterminant+nom, ~⅓ pronom
 * (quand le thème et le verbe le permettent).
 */
function pickBalancedSubject(
  rng: Rng,
  theme: PhraseThemeId,
  frameId: string,
  preds: readonly string[],
  pool: readonly string[],
  adjPlacement: AdjPlacement,
): string {
  const detTheme = theme === 'phrase-determinants' || theme === 'phrase-negation-determinants'
  const adjLocked = (theme === 'phrase-adjectif' || theme === 'phrase-negation-adjectif') && adjPlacement !== 'comp'
  if (detTheme || adjLocked) return pick(rng, [...pool])

  const proper = pool.filter((item) => subjectKindOf(item) === 'proper')
  const common = pool.filter((item) => subjectKindOf(item) === 'common')
  const pronouns = [...pronounsForFrame(frameId, preds)]

  const kinds: SubjectKind[] = []
  if (proper.length) kinds.push('proper')
  if (common.length) kinds.push('common')
  if (pronouns.length) kinds.push('pronoun')
  if (!kinds.length) return pick(rng, [...pool])

  const kind = pick(rng, kinds)
  if (kind === 'proper') return pick(rng, proper)
  if (kind === 'common') return pick(rng, common)
  return pick(rng, [...pronouns])
}

/** Un modèle = un verbe. Sujet et complément varient ; le verbe ne se répète pas sur la fiche. */
function pickPhrase(
  rng: Rng,
  theme: PhraseThemeId,
  used: Set<string>,
  group: PhraseVerbGroup,
): BuiltPhrase {
  const frames = framesForTheme(theme, group)
  const unused = frames.filter((frame) => !used.has(`frame:${frame.id}`))
  const frame = pick(rng, unused.length ? unused : frames)
  used.add(`frame:${frame.id}`)
  const isAdj = theme === 'phrase-adjectif' || theme === 'phrase-negation-adjectif'
  const adjPlacement: AdjPlacement = isAdj
    ? resolveAdjPlacement(frame.id, pick(rng, ['comp', 'subj', 'both'] as const))
    : 'comp'
  const pool = subjectsForAdjPlacement(theme, adjPlacement)
  const tokens = instantiateThemeFrame(
    theme,
    frame,
    () => pickBalancedSubject(rng, theme, frame.id, frame.preds, pool, adjPlacement),
    (preds) => pick(rng, [...preds]),
    () => pick(rng, [...COMMON]),
    adjPlacement,
  )
  return builtFromTokens(tokens)
}

function typeColor(phrase: BuiltPhrase): MathItem {
  return {
    layout: 'phrase-color',
    prompt: undefined,
    tokens: phrase.tokens,
    /** Corrigé = pastilles colorées seulement (pas de phrase). */
    answer: phrase.tokens.map((token) => token.category).join(' · '),
  }
}

function typeOrder(rng: Rng, phrase: BuiltPhrase): MathItem {
  const ordered = phrase.tokens.map(tokenForOrder)
  const scrambled = shuffle(rng, ordered)
  return {
    layout: 'phrase-order',
    tokens: scrambled,
    answer: phrase.sentence,
    responseAnswer: phrase.sentence,
    labels: ordered.map((token) => token.text),
  }
}

/** Pastilles = catégories de la phrase modèle (corrigé cohérent). */
function typeBuild(rng: Rng, theme: PhraseThemeId, group: PhraseVerbGroup, used: Set<string>): MathItem {
  const phrase = pickPhrase(rng, theme, used, group)
  const pastilles = phrase.tokens.map((token) => token.category)
  return {
    layout: 'phrase-build',
    prompt: phrase.verbInfinitive,
    pastilles,
    answer: phrase.sentence,
    responseAnswer: phrase.sentence,
    calcAnswer: phrase.verbInfinitive,
  }
}

function parsePhraseType(typeId: string): { theme: PhraseThemeId; kind: string } | null {
  const m =
    /^(phrase-simple|phrase-negation-adjectif|phrase-negation-adverbe|phrase-negation-preposition|phrase-negation-determinants|phrase-negation|phrase-adjectif|phrase-determinants|phrase-preposition|phrase-adverbe|phrase-conjonctions)-(colorier|ordre|construire|ecrire)$/.exec(
      typeId,
    )
  if (!m) return null
  return { theme: m[1] as PhraseThemeId, kind: m[2]! }
}

const INSTRUCTIONS: Record<string, string> = {
  colorier: 'Coloriez chaque mot selon sa catégorie.',
  ordre: 'Mettez dans l’ordre les mots. Pensez à la majuscule et au point.',
  construire: 'Écrivez les phrases selon la couleur du mot.',
  ecrire: 'Écrivez des phrases.',
}

/** Banque utilisée pour le tirage (Libre réutilise Simple). */
export function phraseBankGroup(group: PhraseVerbGroup = 'er'): 'er' | 'autres' {
  return group === 'autres' ? 'autres' : 'er'
}

export function tryGeneratePhraseBatch(
  exerciseType: string,
  count: number,
  rng: Rng,
  difficulty: Difficulty = 'moyen',
  group: PhraseVerbGroup = 'er',
): PhraseBatch | null {
  void difficulty
  const bank = phraseBankGroup(group)
  if (exerciseType === 'phrase-tableau-categories') {
    return {
      items: [{ layout: 'gattegno-chart', chartMode: 'labels', answer: 'tableau', prompt: 'Tableau des catégories' }],
      instruction: 'Repérez les catégories de la grammaire en couleur.',
      preferredColumns: 1,
    }
  }
  if (exerciseType === 'phrase-tableau-mots') {
    return {
      items: [{ layout: 'gattegno-chart', chartMode: 'words', answer: 'tableau', prompt: 'Tableau des mots' }],
      instruction: 'Repérez les mots selon leur catégorie.',
      preferredColumns: 1,
    }
  }
  if (exerciseType === 'phrase-tableau-vide') {
    return {
      items: [{ layout: 'gattegno-chart', chartMode: 'outline', answer: 'tableau', prompt: 'Tableau vide' }],
      instruction: 'Observez la structure du tableau Gattegno.',
      preferredColumns: 1,
    }
  }

  const parsed = parsePhraseType(exerciseType)
  if (!parsed) return null

  const { theme, kind } = parsed
  const n = Math.max(1, count)

  if (kind === 'ecrire') {
    const prompts = PRODUCTION_PROMPTS_BY_THEME[theme]
    const prompt = pick(rng, [...prompts])
    const used = new Set<string>()
    return {
      items: Array.from({ length: n }, () => {
        const phrase = pickPhrase(rng, theme, used, bank)
        return {
          layout: 'phrase-write' as const,
          writeLines: 1,
          answer: phrase.sentence,
          responseAnswer: phrase.sentence,
        }
      }),
      instruction: prompt ?? INSTRUCTIONS.ecrire,
      preferredColumns: 1,
    }
  }

  const used = new Set<string>()
  const items: MathItem[] = []
  for (let i = 0; i < n; i++) {
    if (kind === 'construire') {
      items.push(typeBuild(rng, theme, bank, used))
    } else {
      const phrase = pickPhrase(rng, theme, used, bank)
      if (kind === 'colorier') items.push(typeColor(phrase))
      else items.push(typeOrder(rng, phrase))
    }
  }

  return {
    items,
    instruction: INSTRUCTIONS[kind] ?? 'Complétez.',
    preferredColumns: 1,
  }
}
