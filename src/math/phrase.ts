import { PHRASE_SENTENCES, joinPhrase } from './phrase-sentences'
import { PRODUCTION_PROMPTS_BY_THEME, VERBES, type PhraseThemeId } from './phrase-banks'
import { pick, shuffle, type Rng } from './rng'
import type { Difficulty, MathItem, PhraseCategory, PhraseToken } from './types'

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

function builtFromTokens(tokens: PhraseToken[]): BuiltPhrase {
  const sentence = joinPhrase(tokens)
  const verb = tokens.find((token) => token.category === 'verbe')
  const verbText = verb?.text ?? ''
  const infinitive =
    VERBES.find((entry) => (Object.values(entry.forms) as string[]).includes(verbText))?.infinitive ??
    verbText
  return { tokens, sentence, verbInfinitive: infinitive }
}

function pickPhrase(rng: Rng, theme: PhraseThemeId, used: Set<string>): BuiltPhrase {
  const bank = PHRASE_SENTENCES[theme]
  const unused = bank.filter((tokens) => !used.has(joinPhrase(tokens)))
  const pool = unused.length ? unused : bank
  const tokens = pick(rng, pool)
  used.add(joinPhrase(tokens))
  return builtFromTokens(tokens)
}

/** Séquence de pastilles cohérente pour le thème (type 3). */
function pastillePattern(theme: PhraseThemeId, rng: Rng): PhraseCategory[] {
  const subj: PhraseCategory[] = rng() < 0.5 ? ['pronom'] : ['determinant', 'nom']
  switch (theme) {
    case 'phrase-simple':
      return [...subj, 'verbe', 'determinant', 'nom']
    case 'phrase-negation':
      return [...subj, 'negation', 'verbe', 'negation', 'determinant', 'nom']
    case 'phrase-adjectif':
      return [...subj, 'verbe', 'determinant', 'adjectif', 'nom']
    case 'phrase-negation-adjectif':
      return [...subj, 'negation', 'verbe', 'negation', 'determinant', 'adjectif', 'nom']
    case 'phrase-negation-determinants':
      return ['determinant', 'nom', 'negation', 'verbe', 'negation', 'determinant', 'nom']
    case 'phrase-preposition':
      return [...subj, 'verbe', 'preposition', 'determinant', 'nom']
    case 'phrase-adverbe':
      return [...subj, 'verbe', 'adverbe', 'determinant', 'nom']
    case 'phrase-negation-adverbe':
      return [...subj, 'negation', 'verbe', 'negation', 'adverbe', 'determinant', 'nom']
    case 'phrase-conjonctions':
      return [...subj, 'verbe', 'determinant', 'nom', 'conjonction', 'determinant', 'nom', 'verbe', 'determinant', 'nom']
  }
}

function typeColor(phrase: BuiltPhrase): MathItem {
  return {
    layout: 'phrase-color',
    prompt: undefined,
    tokens: phrase.tokens,
    answer: phrase.tokens.map((token) => token.category).join(' · '),
    responseAnswer: phrase.sentence,
  }
}

function typeOrder(rng: Rng, phrase: BuiltPhrase): MathItem {
  const scrambled = shuffle(rng, [...phrase.tokens])
  return {
    layout: 'phrase-order',
    tokens: scrambled,
    answer: phrase.sentence,
    responseAnswer: phrase.sentence,
    labels: phrase.tokens.map((token) => token.text),
  }
}

function typeBuild(rng: Rng, theme: PhraseThemeId): MathItem {
  const pastilles = pastillePattern(theme, rng)
  const verb = pick(rng, VERBES)
  return {
    layout: 'phrase-build',
    prompt: verb.infinitive,
    pastilles,
    answer: pastilles.join(' · '),
    calcAnswer: verb.infinitive,
  }
}

function typeWrite(rng: Rng, theme: PhraseThemeId, countLines: number): MathItem {
  const prompts = PRODUCTION_PROMPTS_BY_THEME[theme]
  return {
    layout: 'phrase-write',
    prompt: pick(rng, [...prompts]),
    writeLines: countLines,
    answer: '',
  }
}

function parsePhraseType(typeId: string): { theme: PhraseThemeId; kind: string } | null {
  const m =
    /^(phrase-simple|phrase-negation-adjectif|phrase-negation-adverbe|phrase-negation-determinants|phrase-negation|phrase-adjectif|phrase-preposition|phrase-adverbe|phrase-conjonctions)-(colorier|ordre|construire|ecrire)$/.exec(
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

export function tryGeneratePhraseBatch(
  exerciseType: string,
  count: number,
  rng: Rng,
  difficulty: Difficulty = 'moyen',
): PhraseBatch | null {
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
  const lines = difficulty === 'facile' ? 4 : difficulty === 'moyen' ? 6 : 8

  if (kind === 'ecrire') {
    const item = typeWrite(rng, theme, lines)
    return {
      items: [item],
      instruction: item.prompt ?? INSTRUCTIONS.ecrire,
      preferredColumns: 1,
    }
  }

  const used = new Set<string>()
  const items: MathItem[] = []
  for (let i = 0; i < n; i++) {
    if (kind === 'construire') {
      items.push(typeBuild(rng, theme))
    } else {
      const phrase = pickPhrase(rng, theme, used)
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
