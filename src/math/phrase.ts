import {
  ADJECTIFS,
  ADVERBES,
  CONJONCTIONS_COORD,
  CONJONCTIONS_SUB,
  DETERMINANTS,
  NOMS,
  NOMS_PROPRES,
  PREPOSITIONS,
  PRONOMS,
  PRODUCTION_PROMPTS_BY_THEME,
  VERBES,
  type NounEntry,
  type PhraseThemeId,
} from './phrase-banks'
import { int, pick, shuffle, type Rng } from './rng'
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

function capitalize(s: string): string {
  if (!s) return s
  return s[0]!.toUpperCase() + s.slice(1)
}

function detFor(noun: NounEntry, rng: Rng): string {
  if (noun.number === 'plur') return pick(rng, [...DETERMINANTS.plur])
  return noun.gender === 'f'
    ? pick(rng, [...DETERMINANTS.f_sing])
    : pick(rng, [...DETERMINANTS.m_sing])
}

function adjFor(noun: NounEntry, rng: Rng): string {
  const adj = pick(rng, ADJECTIFS)
  const base = noun.gender === 'f' ? adj.f : adj.m
  if (noun.number === 'plur') {
    if (base.endsWith('s') || base.endsWith('x')) return base
    return `${base}s`
  }
  return base
}

function verbForm(rng: Rng, subjectKind: 'je' | 'tu' | 'il' | 'nous' | 'vous' | 'ils'): {
  infinitive: string
  conjugated: string
} {
  const v = pick(rng, VERBES)
  return { infinitive: v.infinitive, conjugated: v.forms[subjectKind] }
}

function subjectKindFromPronoun(p: string): 'je' | 'tu' | 'il' | 'nous' | 'vous' | 'ils' {
  if (p === 'je') return 'je'
  if (p === 'tu') return 'tu'
  if (p === 'nous') return 'nous'
  if (p === 'vous') return 'vous'
  if (p === 'ils' || p === 'elles') return 'ils'
  return 'il'
}

function makeSubject(rng: Rng): {
  tokens: PhraseToken[]
  kind: 'je' | 'tu' | 'il' | 'nous' | 'vous' | 'ils'
} {
  const mode = int(rng, 0, 2)
  if (mode === 0) {
    const p = pick(rng, [...PRONOMS])
    return { tokens: [{ text: p, category: 'pronom' }], kind: subjectKindFromPronoun(p) }
  }
  if (mode === 1) {
    const name = pick(rng, [...NOMS_PROPRES])
    return { tokens: [{ text: name, category: 'nom' }], kind: 'il' }
  }
  const noun = pick(
    rng,
    NOMS.filter((n) => n.number === 'sing'),
  )
  const det = detFor(noun, rng)
  return {
    tokens: [
      { text: det, category: 'determinant' },
      { text: noun.text, category: 'nom' },
    ],
    kind: 'il',
  }
}

function makeObject(rng: Rng, withAdj: boolean): PhraseToken[] {
  if (rng() < 0.25) {
    return [{ text: pick(rng, [...NOMS_PROPRES]), category: 'nom' }]
  }
  const noun = pick(rng, NOMS)
  const det = detFor(noun, rng)
  if (withAdj) {
    return [
      { text: det, category: 'determinant' },
      { text: adjFor(noun, rng), category: 'adjectif' },
      { text: noun.text, category: 'nom' },
    ]
  }
  return [
    { text: det, category: 'determinant' },
    { text: noun.text, category: 'nom' },
  ]
}

function finish(tokens: PhraseToken[]): BuiltPhrase {
  const parts = tokens.map((t, i) => (i === 0 ? capitalize(t.text) : t.text))
  const sentence = `${parts.join(' ')}.`
  const verb = tokens.find((t) => t.category === 'verbe')
  const verbText = verb?.text ?? ''
  return {
    tokens: tokens.map((t, i) => (i === 0 ? { ...t, text: capitalize(t.text) } : t)),
    sentence,
    verbInfinitive:
      VERBES.find((v) => (Object.values(v.forms) as string[]).includes(verbText))?.infinitive ??
      'manger',
  }
}

function buildPhrase(rng: Rng, theme: PhraseThemeId): BuiltPhrase {
  const subject = makeSubject(rng)
  const withAdj =
    theme === 'phrase-adjectif' || theme === 'phrase-negation-adjectif'
  const withNeg =
    theme === 'phrase-negation' ||
    theme === 'phrase-negation-adjectif' ||
    theme === 'phrase-negation-adverbe'
  const withAdv =
    theme === 'phrase-adverbe' || theme === 'phrase-negation-adverbe'
  const withPrep = theme === 'phrase-preposition'
  const withConj = theme === 'phrase-conjonctions'

  const { infinitive, conjugated } = verbForm(rng, subject.kind)
  void infinitive

  const tokens: PhraseToken[] = [...subject.tokens]

  if (withNeg) {
    tokens.push({ text: 'ne', category: 'negation' })
  }
  if (withAdv && rng() < 0.45) {
    tokens.push({ text: pick(rng, [...ADVERBES]), category: 'adverbe' })
  }
  tokens.push({ text: conjugated, category: 'verbe' })
  if (withNeg) {
    tokens.push({ text: 'pas', category: 'negation' })
  }
  if (withAdv && !tokens.some((t) => t.category === 'adverbe')) {
    tokens.push({ text: pick(rng, [...ADVERBES]), category: 'adverbe' })
  }

  if (withPrep) {
    tokens.push({ text: pick(rng, [...PREPOSITIONS]), category: 'preposition' })
    tokens.push(...makeObject(rng, withAdj))
  } else {
    tokens.push(...makeObject(rng, withAdj))
  }

  if (withConj) {
    const conj =
      rng() < 0.55 ? pick(rng, [...CONJONCTIONS_COORD]) : pick(rng, [...CONJONCTIONS_SUB])
    tokens.push({ text: conj, category: 'conjonction' })
    const sub2 = makeSubject(rng)
    const v2 = verbForm(rng, sub2.kind)
    tokens.push(...sub2.tokens)
    tokens.push({ text: v2.conjugated, category: 'verbe' })
    tokens.push(...makeObject(rng, false))
  }

  const built = finish(tokens)
  built.verbInfinitive =
    VERBES.find((v) => (Object.values(v.forms) as string[]).includes(conjugated))?.infinitive ??
    conjugated
  return built
}

/** Séquence de pastilles cohérente pour le thème (type 3). */
function pastillePattern(theme: PhraseThemeId, rng: Rng): PhraseCategory[] {
  const subj: PhraseCategory[] =
    rng() < 0.4 ? ['pronom'] : rng() < 0.5 ? ['nom'] : ['determinant', 'nom']
  switch (theme) {
    case 'phrase-simple':
      return [...subj, 'verbe', 'determinant', 'nom']
    case 'phrase-negation':
      return [...subj, 'negation', 'verbe', 'negation', 'determinant', 'nom']
    case 'phrase-adjectif':
      return rng() < 0.5
        ? [...subj, 'verbe', 'determinant', 'adjectif', 'nom']
        : ['determinant', 'adjectif', 'nom', 'verbe', 'determinant', 'nom']
    case 'phrase-negation-adjectif':
      return [...subj, 'negation', 'verbe', 'negation', 'determinant', 'adjectif', 'nom']
    case 'phrase-preposition':
      return [...subj, 'verbe', 'preposition', 'determinant', 'nom']
    case 'phrase-adverbe':
      return [...subj, 'verbe', 'adverbe', 'determinant', 'nom']
    case 'phrase-negation-adverbe':
      return [...subj, 'negation', 'verbe', 'negation', 'adverbe', 'determinant', 'nom']
    case 'phrase-conjonctions':
      return [...subj, 'verbe', 'determinant', 'nom', 'conjonction', 'pronom', 'verbe', 'determinant', 'nom']
  }
}

function typeColor(phrase: BuiltPhrase): MathItem {
  return {
    layout: 'phrase-color',
    prompt: undefined,
    tokens: phrase.tokens,
    answer: phrase.tokens.map((t) => t.category).join(' · '),
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
    labels: phrase.tokens.map((t) => t.text),
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
    /^(phrase-simple|phrase-negation-adjectif|phrase-negation-adverbe|phrase-negation|phrase-adjectif|phrase-preposition|phrase-adverbe|phrase-conjonctions)-(colorier|ordre|construire|ecrire)$/.exec(
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

  const items: MathItem[] = []
  for (let i = 0; i < n; i++) {
    if (kind === 'construire') {
      items.push(typeBuild(rng, theme))
    } else {
      const phrase = buildPhrase(rng, theme)
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
