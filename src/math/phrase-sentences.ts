import type { PhraseThemeId } from './phrase-banks'
import type { PhraseCategory, PhraseToken } from './types'

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
    { text: particle, category: 'negation' },
    tokens[index]!,
    { text: 'pas', category: 'negation' },
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

const PEOPLE_PRED = [
  'mange/verbe une/determinant pomme/nom',
  'lit/verbe un/determinant livre/nom',
  'boit/verbe un/determinant jus/nom',
  'écrit/verbe une/determinant lettre/nom',
  'ouvre/verbe la/determinant fenêtre/nom',
  'regarde/verbe un/determinant film/nom',
  'prend/verbe le/determinant bus/nom',
  'dessine/verbe un/determinant arbre/nom',
  'lave/verbe la/determinant vaisselle/nom',
  'porte/verbe un/determinant manteau/nom',
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

const PREP_PRED = [
  'va/verbe à/preposition l’/determinant école/nom',
  'joue/verbe dans/preposition le/determinant jardin/nom',
  'dort/verbe sur/preposition le/determinant lit/nom',
  'court/verbe vers/preposition la/determinant maison/nom',
  'reste/verbe chez/preposition la/determinant mamie/nom',
  'marche/verbe avec/preposition un/determinant ami/nom',
  'travaille/verbe pour/preposition l’/determinant école/nom',
  'passe/verbe devant/preposition la/determinant poste/nom',
  'cherche/verbe sous/preposition le/determinant lit/nom',
  'arrive/verbe après/preposition le/determinant cours/nom',
] as const

const ADV_PRED = [
  'mange/verbe vite/adverbe une/determinant pomme/nom',
  'lit/verbe souvent/adverbe un/determinant livre/nom',
  'écrit/verbe bien/adverbe une/determinant lettre/nom',
  'court/verbe lentement/adverbe',
  'parle/verbe trop/adverbe',
  'travaille/verbe beaucoup/adverbe',
  'arrive/verbe tôt/adverbe',
  'part/verbe demain/adverbe',
  'reste/verbe ici/adverbe',
  'chante/verbe fort/adverbe',
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

function simpleSentences(): PhraseToken[][] {
  return cartesian(PEOPLE, PEOPLE_PRED)
}

function adjectifSentences(): PhraseToken[][] {
  return cartesian(ADJ_PEOPLE, PEOPLE_PRED)
}

function detSentences(): PhraseToken[][] {
  return cartesian(DET_PEOPLE, PEOPLE_PRED)
}

function prepositionSentences(): PhraseToken[][] {
  return cartesian(PEOPLE, PREP_PRED)
}

function adverbeSentences(): PhraseToken[][] {
  return cartesian(PEOPLE, ADV_PRED)
}

function conjonctionSentences(): PhraseToken[][] {
  const out: PhraseToken[][] = []
  for (let i = 0; i < PEOPLE.length; i++) {
    for (let j = 0; j < PEOPLE_PRED.length; j++) {
      const left = `${PEOPLE[i]} ${PEOPLE_PRED[i]!}`
      const right = `${PEOPLE[(i + 1 + (j % 3)) % PEOPLE.length]} ${PEOPLE_PRED[j]!}`
      out.push(parse(`${left} ${CONJONCTIONS[j]!} ${right}`))
    }
  }
  return out
}

function take100(list: PhraseToken[][], theme: string): PhraseToken[][] {
  if (list.length !== 100) {
    throw new Error(`${theme} : ${list.length} phrases (100 attendues)`)
  }
  return list
}

export const PHRASE_SENTENCES: Record<PhraseThemeId, PhraseToken[][]> = {
  'phrase-simple': take100(simpleSentences(), 'phrase-simple'),
  'phrase-negation': take100(simpleSentences().map(withNegation), 'phrase-negation'),
  'phrase-adjectif': take100(adjectifSentences(), 'phrase-adjectif'),
  'phrase-negation-adjectif': take100(adjectifSentences().map(withNegation), 'phrase-negation-adjectif'),
  'phrase-negation-determinants': take100(detSentences().map(withNegation), 'phrase-negation-determinants'),
  'phrase-preposition': take100(prepositionSentences(), 'phrase-preposition'),
  'phrase-adverbe': take100(adverbeSentences(), 'phrase-adverbe'),
  'phrase-negation-adverbe': take100(adverbeSentences().map(withNegation), 'phrase-negation-adverbe'),
  'phrase-conjonctions': take100(conjonctionSentences(), 'phrase-conjonctions'),
}

export function sentenceOf(tokens: PhraseToken[]): string {
  return joinPhrase(tokens)
}
