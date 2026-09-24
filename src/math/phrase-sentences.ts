import type { PhraseThemeId } from './phrase-banks'
import type { PhraseCategory, PhraseToken, PhraseVerbGroup } from './types'

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

function cartesian(subjects: readonly string[], preds: readonly string[]): PhraseToken[][] {
  const out: PhraseToken[][] = []
  for (const subject of subjects) {
    for (const pred of preds) {
      out.push(parse(`${subject} ${pred}`))
    }
  }
  return out
}

const PEOPLE = [
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
] as const

const ADJ_PEOPLE = [
  'Mon/determinant petit/adjectif frère/nom',
  'Ma/determinant grande/adjectif sœur/nom',
  'Ton/determinant jeune/adjectif cousin/nom',
  'Ta/determinant petite/adjectif nièce/nom',
  'Son/determinant vieux/adjectif papa/nom',
  'Sa/determinant jeune/adjectif maman/nom',
  'Notre/determinant gentil/adjectif voisin/nom',
  'Votre/determinant nouvelle/adjectif voisine/nom',
  'Leur/determinant petit/adjectif enfant/nom',
  'Cette/determinant jolie/adjectif fille/nom',
] as const

const DET_PEOPLE = [
  'Mon/determinant frère/nom',
  'Ma/determinant sœur/nom',
  'Ton/determinant ami/nom',
  'Ta/determinant copine/nom',
  'Son/determinant papa/nom',
  'Sa/determinant maman/nom',
  'Notre/determinant maître/nom',
  'Votre/determinant maîtresse/nom',
  'Leur/determinant enfant/nom',
  'Cet/determinant élève/nom',
] as const

/** 1er groupe (-er) + être + avoir. */
const ER_PRED = [
  'mange/verbe une/determinant pomme/nom',
  'regarde/verbe un/determinant film/nom',
  'dessine/verbe un/determinant arbre/nom',
  'lave/verbe la/determinant vaisselle/nom',
  'porte/verbe un/determinant manteau/nom',
  'habite/verbe une/determinant maison/nom',
  'écoute/verbe une/determinant chanson/nom',
  'aime/verbe un/determinant chat/nom',
  'a/verbe un/determinant livre/nom',
  'est/verbe un/determinant élève/nom',
] as const

const ER_PREP = [
  'joue/verbe dans/preposition le/determinant jardin/nom',
  'reste/verbe chez/preposition la/determinant mamie/nom',
  'marche/verbe avec/preposition un/determinant ami/nom',
  'travaille/verbe pour/preposition l’/determinant école/nom',
  'cherche/verbe sous/preposition le/determinant lit/nom',
  'arrive/verbe après/preposition le/determinant cours/nom',
  'habite/verbe dans/preposition une/determinant maison/nom',
  'passe/verbe devant/preposition la/determinant poste/nom',
  'rentre/verbe à/preposition l’/determinant école/nom',
  'entre/verbe dans/preposition la/determinant classe/nom',
] as const

const ER_ADV = [
  'mange/verbe vite/adverbe une/determinant pomme/nom',
  'regarde/verbe souvent/adverbe un/determinant film/nom',
  'dessine/verbe bien/adverbe un/determinant arbre/nom',
  'parle/verbe trop/adverbe',
  'travaille/verbe beaucoup/adverbe',
  'arrive/verbe tôt/adverbe',
  'reste/verbe ici/adverbe',
  'chante/verbe fort/adverbe',
  'est/verbe souvent/adverbe ici/adverbe',
  'a/verbe déjà/adverbe un/determinant livre/nom',
] as const

/** 2e groupe (-ir) et 3e groupe. */
const AUTRES_PRED = [
  'lit/verbe un/determinant livre/nom',
  'boit/verbe un/determinant jus/nom',
  'écrit/verbe une/determinant lettre/nom',
  'ouvre/verbe la/determinant fenêtre/nom',
  'prend/verbe le/determinant bus/nom',
  'finit/verbe un/determinant dessin/nom',
  'choisit/verbe une/determinant pomme/nom',
  'voit/verbe un/determinant oiseau/nom',
  'fait/verbe un/determinant gâteau/nom',
  'met/verbe un/determinant manteau/nom',
] as const

const AUTRES_PREP = [
  'va/verbe à/preposition l’/determinant école/nom',
  'vient/verbe chez/preposition la/determinant mamie/nom',
  'sort/verbe de/preposition la/determinant classe/nom',
  'part/verbe après/preposition le/determinant cours/nom',
  'lit/verbe dans/preposition le/determinant lit/nom',
  'écrit/verbe sur/preposition le/determinant cahier/nom',
  'prend/verbe dans/preposition le/determinant sac/nom',
  'dort/verbe sur/preposition le/determinant lit/nom',
  'met/verbe le/determinant livre/nom sur/preposition la/determinant table/nom',
  'finit/verbe à/preposition l’/determinant école/nom',
] as const

const AUTRES_ADV = [
  'lit/verbe souvent/adverbe un/determinant livre/nom',
  'écrit/verbe bien/adverbe une/determinant lettre/nom',
  'court/verbe lentement/adverbe',
  'part/verbe demain/adverbe',
  'vient/verbe tôt/adverbe',
  'finit/verbe vite/adverbe un/determinant dessin/nom',
  'prend/verbe déjà/adverbe le/determinant bus/nom',
  'boit/verbe trop/adverbe',
  'voit/verbe clairement/adverbe un/determinant oiseau/nom',
  'fait/verbe bien/adverbe un/determinant gâteau/nom',
] as const

const CONJONCTIONS = [
  'et/conjonction',
  'ou/conjonction',
  'mais/conjonction',
  'donc/conjonction',
  'car/conjonction',
  'puis/conjonction',
  'quand/conjonction',
  'si/conjonction',
  'parce_que/conjonction',
  'alors/conjonction',
] as const

function take100(list: PhraseToken[][], theme: string): PhraseToken[][] {
  if (list.length !== 100) {
    throw new Error(`${theme} : ${list.length} phrases (100 attendues)`)
  }
  return list
}

function conjonctionSentences(preds: readonly string[]): PhraseToken[][] {
  const out: PhraseToken[][] = []
  for (let i = 0; i < PEOPLE.length; i++) {
    for (let j = 0; j < preds.length; j++) {
      const left = `${PEOPLE[i]} ${preds[i]!}`
      const right = `${PEOPLE[(i + 1 + (j % 3)) % PEOPLE.length]} ${preds[j]!}`
      out.push(parse(`${left} ${CONJONCTIONS[j]!} ${right}`))
    }
  }
  return out
}

function bankFor(
  preds: readonly string[],
  prep: readonly string[],
  adv: readonly string[],
): Record<PhraseThemeId, PhraseToken[][]> {
  return {
    'phrase-simple': take100(cartesian(PEOPLE, preds), 'phrase-simple'),
    'phrase-negation': take100(cartesian(PEOPLE, preds).map(withNegation), 'phrase-negation'),
    'phrase-adjectif': take100(cartesian(ADJ_PEOPLE, preds), 'phrase-adjectif'),
    'phrase-negation-adjectif': take100(cartesian(ADJ_PEOPLE, preds).map(withNegation), 'phrase-negation-adjectif'),
    'phrase-negation-determinants': take100(cartesian(DET_PEOPLE, preds).map(withNegation), 'phrase-negation-determinants'),
    'phrase-preposition': take100(cartesian(PEOPLE, prep), 'phrase-preposition'),
    'phrase-adverbe': take100(cartesian(PEOPLE, adv), 'phrase-adverbe'),
    'phrase-negation-adverbe': take100(cartesian(PEOPLE, adv).map(withNegation), 'phrase-negation-adverbe'),
    'phrase-conjonctions': take100(conjonctionSentences(preds), 'phrase-conjonctions'),
  }
}

const BANKS: Record<PhraseVerbGroup, Record<PhraseThemeId, PhraseToken[][]>> = {
  er: bankFor(ER_PRED, ER_PREP, ER_ADV),
  autres: bankFor(AUTRES_PRED, AUTRES_PREP, AUTRES_ADV),
}

export function phrasesFor(theme: PhraseThemeId, group: PhraseVerbGroup = 'er'): PhraseToken[][] {
  return BANKS[group][theme]
}

export function sentenceOf(tokens: PhraseToken[]): string {
  return joinPhrase(tokens)
}
