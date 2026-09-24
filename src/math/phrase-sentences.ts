import type { PhraseThemeId } from './phrase-banks'
import type { PhraseCategory, PhraseToken, PhraseVerbGroup } from './types'
import { SIMPLE_FRAMES_AUTRES, SIMPLE_FRAMES_ER } from './phrase-simple-frames'
import { themedFramesFor, type ThemedFrame } from './phrase-theme-frames'

/** Découpe « mot/catégorie » — l’espace après une apostrophe est omise à l’affichage. */
export function tagged(source: string): PhraseToken[] {
  return source.trim().split(/\s+/).map((part) => {
    const slash = part.lastIndexOf('/')
    if (slash <= 0) throw new Error(`Jeton sans catégorie : ${part}`)
    return {
      text: part.slice(0, slash).replace(/_/g, ' '),
      category: part.slice(slash + 1) as PhraseCategory,
    }
  })
}

export function joinPhrase(tokens: PhraseToken[]): string {
  let out = ''
  for (const token of tokens) {
    if (!out) {
      out = token.text
      continue
    }
    if (out.endsWith("'") || out.endsWith('’')) out += token.text
    else out += ` ${token.text}`
  }
  return `${out}.`
}

function cap(tokens: PhraseToken[]): PhraseToken[] {
  const first = tokens[0]
  if (!first) return tokens
  const head = first.text
  const text = head ? head[0]!.toUpperCase() + head.slice(1) : head
  return [{ ...first, text }, ...tokens.slice(1)]
}

function parse(source: string): PhraseToken[] {
  return cap(tagged(source))
}

function startsWithVowel(word: string): boolean {
  return /^[aeiouhâàâäéèêëîïôöùûüœ]/i.test(word)
}

export function withNegation(tokens: PhraseToken[]): PhraseToken[] {
  const index = tokens.findIndex((token) => token.category === 'verbe')
  if (index < 0) return tokens
  const verb = tokens[index]!.text
  const particle = startsWithVowel(verb) ? 'n’' : 'ne'
  return [
    ...tokens.slice(0, index),
    { text: particle, category: 'adverbe' },
    tokens[index]!,
    { text: 'pas', category: 'adverbe' },
    ...tokens.slice(index + 1),
  ]
}

function atLeast(list: PhraseToken[][], theme: string, min: number): PhraseToken[][] {
  if (list.length < min) {
    throw new Error(`${theme} : ${list.length} modèles (${min} attendus au minimum)`)
  }
  return list
}

const ETRE_FORMS = /^(suis|es|est|sommes|êtes|sont)$/

function isEtreVerb(token: PhraseToken): boolean {
  return token.category === 'verbe' && ETRE_FORMS.test(token.text)
}

function assertBank(theme: PhraseThemeId, list: PhraseToken[][], min = 100): PhraseToken[][] {
  atLeast(list, theme, min)
  const needAdj = theme === 'phrase-adjectif' || theme === 'phrase-negation-adjectif'
  const needPrep = theme === 'phrase-preposition' || theme === 'phrase-negation-preposition'
  const banEtre = theme === 'phrase-simple' || theme === 'phrase-negation'
  for (const tokens of list) {
    const sentence = joinPhrase(tokens)
    if (/habite (une|un|la|le|l’|cette|cette)/i.test(sentence) && !/habite dans/i.test(sentence)) {
      throw new Error(`${theme} : préposition manquante — ${sentence}`)
    }
    if (needAdj && !tokens.some((token) => token.category === 'adjectif')) {
      throw new Error(`${theme} : adjectif manquant — ${sentence}`)
    }
    if (needPrep && !tokens.some((token) => token.category === 'preposition')) {
      throw new Error(`${theme} : préposition manquante — ${sentence}`)
    }
    if (banEtre && tokens.some(isEtreVerb)) {
      throw new Error(`${theme} : « être » interdit (il faut un adjectif ou une préposition) — ${sentence}`)
    }
    if (hasInanimateSubject(tokens)) {
      throw new Error(`${theme} : sujet inanimé — ${sentence}`)
    }
    if (!needPrep && tokens.some((token) => token.category === 'preposition')) {
      throw new Error(`${theme} : préposition hors thème — ${sentence}`)
    }
    if (theme === 'phrase-conjonctions' && /^.+[A-ZÉÈÊÀÂÎÏÔÙÛÇ]/.test(sentence)) {
      throw new Error(`${theme} : deuxième majuscule — ${sentence}`)
    }
  }
  return list
}

/** Noms propres — toujours singulier. */
const PROPER = [
  'Léa/nom',
  'Noah/nom',
  'Inès/nom',
  'Karim/nom',
  'Emma/nom',
  'Théo/nom',
  'Sara/nom',
  'Yanis/nom',
  'Chloé/nom',
  'Hugo/nom',
  'Amina/nom',
  'Lucas/nom',
  'Nora/nom',
  'Mehdi/nom',
  'Jade/nom',
  'Enzo/nom',
  'Yara/nom',
  'Omar/nom',
  'Lina/nom',
  'Pablo/nom',
  'Sofia/nom',
  'Malik/nom',
  'Nina/nom',
  'Idris/nom',
  'Camille/nom',
  'Sami/nom',
  'Lila/nom',
  'Kenji/nom',
  'Maya/nom',
  'Diego/nom',
  'Fatou/nom',
  'Elias/nom',
  'Zoé/nom',
  'Amir/nom',
  'Inaya/nom',
  'Jules/nom',
  'Rania/nom',
  'Loïc/nom',
  'Hana/nom',
  'Victor/nom',
  'Nour/nom',
  'Adam/nom',
  'Léna/nom',
  'Ilias/nom',
  'Mila/nom',
  'Rayan/nom',
] as const

/** Noms communs singuliers, articles définis / indéfinis de base. */
export const COMMON = [
  'Le/determinant garçon/nom',
  'La/determinant fille/nom',
  'L’/determinant élève/nom',
  'Un/determinant ami/nom',
  'Une/determinant amie/nom',
  'Le/determinant papa/nom',
  'La/determinant maman/nom',
  'L’/determinant enfant/nom',
  'Le/determinant maître/nom',
  'La/determinant maîtresse/nom',
  'Le/determinant voisin/nom',
  'La/determinant voisine/nom',
  'Le/determinant cousin/nom',
  'La/determinant cousine/nom',
  'Le/determinant frère/nom',
  'La/determinant sœur/nom',
  'Le/determinant copain/nom',
  'La/determinant copine/nom',
  'Le/determinant grand-père/nom',
  'La/determinant grand-mère/nom',
  'L’/determinant oncle/nom',
  'La/determinant tante/nom',
  'Le/determinant bébé/nom',
  'Le/determinant médecin/nom',
  'L’/determinant infirmière/nom',
  'Le/determinant boulanger/nom',
  'La/determinant boulangère/nom',
  'Le/determinant facteur/nom',
  'La/determinant factrice/nom',
  'Le/determinant cuisinier/nom',
  'La/determinant cuisinière/nom',
  'Le/determinant jardinier/nom',
  'La/determinant jardinière/nom',
  'L’/determinant artiste/nom',
  'Le/determinant musicien/nom',
  'La/determinant musicienne/nom',
] as const

/** Sujets pour instancier un modèle (le modèle lui-même ne change pas). Personnes seulement. */
export const SIMPLE_SUBJECTS = [...PROPER, ...COMMON, 'Il/pronom', 'Elle/pronom'] as const

export function instantiateTagged(subject: string, pred: string): PhraseToken[] {
  return parse(`${subject} ${pred}`)
}

const FEMALE_PROPER = new Set([
  'Léa', 'Inès', 'Emma', 'Sara', 'Chloé', 'Amina', 'Nora', 'Jade', 'Yara', 'Lina',
  'Sofia', 'Nina', 'Camille', 'Lila', 'Maya', 'Fatou', 'Zoé', 'Inaya', 'Rania',
  'Hana', 'Nour', 'Léna', 'Mila',
])

const INANIMATE_SUBJECT =
  /^(maison|voiture|livre|cahier|table|porte|fenêtre|arbre|école|jardin|rue|pont|mer|train|bus)$/i

export function subjectGender(tagged: string): 'm' | 'f' {
  if (tagged === 'Elle/pronom' || /^(La|Une|Ma|Ta|Sa|Cette)\//.test(tagged)) return 'f'
  const proper = tagged.replace(/\/nom$/, '')
  if (FEMALE_PROPER.has(proper)) return 'f'
  if (/(ière|euse|esse|ine|sœur|fille|maman|tante|copine|amie|voisine|maîtresse|boulangère|factrice|cuisinière|jardinière|musicienne|infirmière)\/nom/.test(tagged)) {
    return 'f'
  }
  return 'm'
}

function hasInanimateSubject(tokens: PhraseToken[]): boolean {
  const first = tokens.find((token) => token.category === 'nom' || token.category === 'pronom')
  return Boolean(first && INANIMATE_SUBJECT.test(first.text))
}

export type PhraseThemeKind = PhraseThemeId

function predHasPrep(pred: string): boolean {
  return pred.includes('/preposition')
}

function frameHasPrep(frame: ThemedFrame): boolean {
  return frame.preds.some(predHasPrep) || (frame.rightPreds ?? []).some(predHasPrep)
}

/** Le modèle doit coller aux pastilles du thème (pas d’« habiter » en phrase simple). */
export function frameMatchesTheme(theme: PhraseThemeId, frame: ThemedFrame): boolean {
  const prepTheme = theme === 'phrase-preposition' || theme === 'phrase-negation-preposition'
  if (prepTheme) return frame.preds.length > 0 && frame.preds.every(predHasPrep)
  return !frameHasPrep(frame)
}

export function framesForTheme(theme: PhraseThemeId, group: PhraseVerbGroup): readonly ThemedFrame[] {
  const raw =
    theme === 'phrase-simple' || theme === 'phrase-negation'
      ? group === 'autres'
        ? SIMPLE_FRAMES_AUTRES
        : SIMPLE_FRAMES_ER
      : themedFramesFor(
          theme as
            | 'phrase-adjectif'
            | 'phrase-negation-adjectif'
            | 'phrase-preposition'
            | 'phrase-negation-preposition'
            | 'phrase-adverbe'
            | 'phrase-negation-adverbe'
            | 'phrase-conjonctions'
            | 'phrase-determinants'
            | 'phrase-negation-determinants',
          group,
        )
  return raw.filter((frame) => frameMatchesTheme(theme, frame))
}

function isNegationTheme(theme: PhraseThemeId): boolean {
  return theme.startsWith('phrase-negation')
}

/** Tous types de déterminants, sujets singuliers (verbe au singulier). */
export const DET_SUBJECTS = [
  'Le/determinant garçon/nom',
  'La/determinant fille/nom',
  'L’/determinant élève/nom',
  'Un/determinant ami/nom',
  'Une/determinant amie/nom',
  'Mon/determinant frère/nom',
  'Ma/determinant sœur/nom',
  'Ton/determinant ami/nom',
  'Ta/determinant copine/nom',
  'Son/determinant papa/nom',
  'Sa/determinant maman/nom',
  'Notre/determinant maître/nom',
  'Votre/determinant maîtresse/nom',
  'Leur/determinant enfant/nom',
  'Ce/determinant garçon/nom',
  'Cet/determinant élève/nom',
  'Cette/determinant fille/nom',
  'Chaque/determinant enfant/nom',
] as const

export function subjectsFor(theme: PhraseThemeId): readonly string[] {
  if (theme === 'phrase-determinants' || theme === 'phrase-negation-determinants') return DET_SUBJECTS
  return SIMPLE_SUBJECTS
}

function lowerCommon(taggedSubject: string): string {
  return taggedSubject
    .replace(/^Le\//, 'le/')
    .replace(/^La\//, 'la/')
    .replace(/^L’\//, 'l’/')
    .replace(/^Un\//, 'un/')
    .replace(/^Une\//, 'une/')
    .replace(/^Mon\//, 'mon/')
    .replace(/^Ma\//, 'ma/')
    .replace(/^Ton\//, 'ton/')
    .replace(/^Ta\//, 'ta/')
    .replace(/^Son\//, 'son/')
    .replace(/^Sa\//, 'sa/')
    .replace(/^Notre\//, 'notre/')
    .replace(/^Votre\//, 'votre/')
    .replace(/^Leur\//, 'leur/')
    .replace(/^Ce\//, 'ce/')
    .replace(/^Cet\//, 'cet/')
    .replace(/^Cette\//, 'cette/')
    .replace(/^Chaque\//, 'chaque/')
    .replace(/^Il\//, 'il/')
    .replace(/^Elle\//, 'elle/')
}

const FEMININE_ETRE_ADJ = /(?:grande|fatiguée|contente)\/adjectif/
const MASCULINE_ETRE_ADJ = /(?:grand|fatigué|content)\/adjectif/

function predsForEtreAdj(preds: readonly string[], gender: 'm' | 'f'): readonly string[] {
  const feminine = preds.filter((item) => FEMININE_ETRE_ADJ.test(item))
  const masculine = preds.filter((item) => MASCULINE_ETRE_ADJ.test(item) && !FEMININE_ETRE_ADJ.test(item))
  const pool = gender === 'f' ? feminine : masculine
  return pool.length ? pool : preds
}

export function instantiateThemeFrame(
  theme: PhraseThemeId,
  frame: ThemedFrame,
  pickSubject: () => string,
  pickPred: (preds: readonly string[]) => string,
  pickRightSubject: () => string = () => COMMON[0]!,
): PhraseToken[] {
  if (theme === 'phrase-conjonctions') {
    const left = pickSubject()
    let right = pickRightSubject()
    if (right === left) right = pickRightSubject()
    if (!right.includes('/determinant') && !right.startsWith('Il/') && !right.startsWith('Elle/')) {
      right = COMMON[0]!
    }
    const tokens = parse(
      `${left} ${pickPred(frame.preds)} ${pickPred(frame.conjs ?? ['et/conjonction'])} ${lowerCommon(right)} ${pickPred(frame.rightPreds ?? frame.preds)}`,
    )
    return tokens
  }
  const subject = pickSubject()
  let pred = pickPred(frame.preds)
  if (frame.id === 'être' && (theme === 'phrase-adjectif' || theme === 'phrase-negation-adjectif')) {
    pred = pickPred(predsForEtreAdj(frame.preds, subjectGender(subject)))
  }
  const tokens = instantiateTagged(subject, pred)
  return isNegationTheme(theme) ? withNegation(tokens) : tokens
}

function samplesFromThemed(theme: PhraseThemeId, group: PhraseVerbGroup): PhraseToken[][] {
  const frames = framesForTheme(theme, group)
  const subjects = subjectsFor(theme)
  return frames.map((frame, index) =>
    instantiateThemeFrame(
      theme,
      frame,
      () => subjects[index % subjects.length]!,
      (preds) => preds[0]!,
      () => COMMON[(index + 1) % COMMON.length]!,
    ),
  )
}

function bankFor(group: PhraseVerbGroup): Record<PhraseThemeId, PhraseToken[][]> {
  const simple = framesForTheme('phrase-simple', group)
  const minSimple = Math.min(100, simple.length)
  return {
    'phrase-simple': assertBank('phrase-simple', samplesFromThemed('phrase-simple', group), minSimple),
    'phrase-negation': assertBank('phrase-negation', samplesFromThemed('phrase-negation', group), minSimple),
    'phrase-adjectif': assertBank('phrase-adjectif', samplesFromThemed('phrase-adjectif', group), Math.min(100, framesForTheme('phrase-adjectif', group).length)),
    'phrase-negation-adjectif': assertBank('phrase-negation-adjectif', samplesFromThemed('phrase-negation-adjectif', group), Math.min(100, framesForTheme('phrase-negation-adjectif', group).length)),
    'phrase-determinants': assertBank('phrase-determinants', samplesFromThemed('phrase-determinants', group), minSimple),
    'phrase-negation-determinants': assertBank('phrase-negation-determinants', samplesFromThemed('phrase-negation-determinants', group), minSimple),
    'phrase-preposition': assertBank('phrase-preposition', samplesFromThemed('phrase-preposition', group), Math.min(40, framesForTheme('phrase-preposition', group).length)),
    'phrase-negation-preposition': assertBank('phrase-negation-preposition', samplesFromThemed('phrase-negation-preposition', group), Math.min(40, framesForTheme('phrase-negation-preposition', group).length)),
    'phrase-adverbe': assertBank('phrase-adverbe', samplesFromThemed('phrase-adverbe', group), minSimple),
    'phrase-negation-adverbe': assertBank('phrase-negation-adverbe', samplesFromThemed('phrase-negation-adverbe', group), minSimple),
    'phrase-conjonctions': assertBank('phrase-conjonctions', samplesFromThemed('phrase-conjonctions', group), minSimple),
  }
}

if (SIMPLE_FRAMES_ER.length < 100) {
  throw new Error(`phrase-simple : ${SIMPLE_FRAMES_ER.length} modèles (100 attendus au minimum)`)
}

const BANKS: Record<PhraseVerbGroup, Record<PhraseThemeId, PhraseToken[][]>> = {
  er: bankFor('er'),
  autres: bankFor('autres'),
}

export function phrasesFor(theme: PhraseThemeId, group: PhraseVerbGroup = 'er'): PhraseToken[][] {
  return BANKS[group][theme]
}

export { simpleFramesFor, type SimpleFrame } from './phrase-simple-frames'

export function sentenceOf(tokens: PhraseToken[]): string {
  return joinPhrase(tokens)
}
