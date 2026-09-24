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

function atLeast100(list: PhraseToken[][], theme: string): PhraseToken[][] {
  if (list.length < 100) {
    throw new Error(`${theme} : ${list.length} phrases (100 attendues au minimum)`)
  }
  return list
}

function assertBank(theme: PhraseThemeId, list: PhraseToken[][]): PhraseToken[][] {
  atLeast100(list, theme)
  const needAdj = theme === 'phrase-adjectif' || theme === 'phrase-negation-adjectif'
  const needPrep = theme === 'phrase-preposition' || theme === 'phrase-negation-preposition'
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
] as const

/** Noms communs singuliers, articles définis / indéfinis de base. */
const COMMON = [
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
] as const

const PEOPLE = [...PROPER, ...COMMON] as const

const ADJ_SUBJECTS = [
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
  'Ce/determinant grand/adjectif garçon/nom',
  'Cet/determinant élève/nom sérieux/adjectif',
] as const

/** Tous types de déterminants, sujets singuliers (verbe au singulier). */
const DET_SUBJECTS = [
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

/** 1er groupe (-er) + être + avoir — compléments autonomes et grammaticaux. */
const ER_PRED = [
  'mange/verbe une/determinant pomme/nom',
  'regarde/verbe un/determinant film/nom',
  'dessine/verbe un/determinant arbre/nom',
  'lave/verbe la/determinant vaisselle/nom',
  'porte/verbe un/determinant manteau/nom',
  'habite/verbe dans/preposition une/determinant maison/nom',
  'écoute/verbe une/determinant chanson/nom',
  'aime/verbe les/determinant livres/nom',
  'a/verbe un/determinant cahier/nom',
  'est/verbe à/preposition la/determinant maison/nom',
] as const

const ER_ADJ_COMPL = [
  'mange/verbe une/determinant pomme/nom rouge/adjectif',
  'regarde/verbe un/determinant film/nom amusant/adjectif',
  'dessine/verbe un/determinant arbre/nom vert/adjectif',
  'porte/verbe un/determinant manteau/nom bleu/adjectif',
  'habite/verbe dans/preposition une/determinant petite/adjectif maison/nom',
  'écoute/verbe une/determinant chanson/nom douce/adjectif',
  'aime/verbe les/determinant livres/nom anciens/adjectif',
  'a/verbe un/determinant nouveau/adjectif cahier/nom',
  'prépare/verbe un/determinant bon/adjectif repas/nom',
  'cherche/verbe un/determinant stylo/nom noir/adjectif',
] as const

const ER_PREP = [
  'joue/verbe dans/preposition le/determinant jardin/nom',
  'reste/verbe chez/preposition la/determinant mamie/nom',
  'marche/verbe avec/preposition un/determinant ami/nom',
  'travaille/verbe à/preposition l’/determinant école/nom',
  'cherche/verbe un/determinant livre/nom sous/preposition le/determinant lit/nom',
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
  'est/verbe souvent/adverbe à/preposition la/determinant maison/nom',
  'a/verbe déjà/adverbe un/determinant cahier/nom',
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

const AUTRES_ADJ_COMPL = [
  'lit/verbe un/determinant livre/nom ancien/adjectif',
  'boit/verbe un/determinant jus/nom froid/adjectif',
  'écrit/verbe une/determinant longue/adjectif lettre/nom',
  'ouvre/verbe la/determinant grande/adjectif fenêtre/nom',
  'prend/verbe le/determinant bus/nom jaune/adjectif',
  'finit/verbe un/determinant joli/adjectif dessin/nom',
  'choisit/verbe une/determinant pomme/nom rouge/adjectif',
  'voit/verbe un/determinant oiseau/nom bleu/adjectif',
  'fait/verbe un/determinant bon/adjectif gâteau/nom',
  'met/verbe un/determinant manteau/nom chaud/adjectif',
] as const

const AUTRES_PREP = [
  'va/verbe à/preposition l’/determinant école/nom',
  'vient/verbe chez/preposition la/determinant mamie/nom',
  'sort/verbe de/preposition la/determinant classe/nom',
  'part/verbe après/preposition le/determinant cours/nom',
  'lit/verbe dans/preposition le/determinant lit/nom',
  'écrit/verbe sur/preposition le/determinant cahier/nom',
  'prend/verbe un/determinant livre/nom dans/preposition le/determinant sac/nom',
  'dort/verbe sur/preposition le/determinant lit/nom',
  'met/verbe le/determinant livre/nom sur/preposition la/determinant table/nom',
  'finit/verbe le/determinant dessin/nom à/preposition l’/determinant école/nom',
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

function lowerCommon(taggedSubject: string): string {
  if (!taggedSubject.includes('/determinant')) return taggedSubject
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
}

function conjonctionSentences(preds: readonly string[]): PhraseToken[][] {
  const out: PhraseToken[][] = []
  const commons = [...COMMON]
  for (let i = 0; i < commons.length; i++) {
    for (let j = 0; j < preds.length; j++) {
      const left = `${commons[i]} ${preds[i % preds.length]!}`
      const right = `${lowerCommon(commons[(i + 1 + (j % 3)) % commons.length]!)} ${preds[j]!}`
      out.push(parse(`${left} ${CONJONCTIONS[j]!} ${right}`))
    }
  }
  return out
}

const ER_PLURALS = [
  'Les/determinant enfants/nom mangent/verbe une/determinant pomme/nom',
  'Les/determinant élèves/nom regardent/verbe un/determinant film/nom',
  'Mes/determinant cousins/nom habitent/verbe dans/preposition une/determinant maison/nom',
  'Ces/determinant filles/nom écoutent/verbe une/determinant chanson/nom',
  'Nos/determinant voisins/nom aiment/verbe les/determinant livres/nom',
  'Vos/determinant amis/nom portent/verbe un/determinant manteau/nom',
  'Plusieurs/determinant élèves/nom dessinent/verbe un/determinant arbre/nom',
  'Quelques/determinant enfants/nom jouent/verbe dans/preposition le/determinant jardin/nom',
  'Les/determinant maîtres/nom préparent/verbe le/determinant repas/nom',
  'Des/determinant amis/nom arrivent/verbe après/preposition le/determinant cours/nom',
] as const

const AUTRES_PLURALS = [
  'Les/determinant enfants/nom lisent/verbe un/determinant livre/nom',
  'Les/determinant élèves/nom écrivent/verbe une/determinant lettre/nom',
  'Mes/determinant cousins/nom prennent/verbe le/determinant bus/nom',
  'Ces/determinant filles/nom voient/verbe un/determinant oiseau/nom',
  'Nos/determinant voisins/nom font/verbe un/determinant gâteau/nom',
  'Vos/determinant amis/nom mettent/verbe un/determinant manteau/nom',
  'Plusieurs/determinant élèves/nom finissent/verbe un/determinant dessin/nom',
  'Quelques/determinant enfants/nom boivent/verbe un/determinant jus/nom',
  'Les/determinant maîtres/nom ouvrent/verbe la/determinant fenêtre/nom',
  'Des/determinant amis/nom vont/verbe à/preposition l’/determinant école/nom',
] as const

function withExtras(base: PhraseToken[][], extras: readonly string[]): PhraseToken[][] {
  return [...base, ...extras.map(parse)]
}

function bankFor(
  preds: readonly string[],
  adjCompl: readonly string[],
  prep: readonly string[],
  adv: readonly string[],
  plurals: readonly string[],
): Record<PhraseThemeId, PhraseToken[][]> {
  const simple = withExtras(cartesian(PEOPLE, preds), plurals)
  const adj = [...cartesian(ADJ_SUBJECTS, preds), ...cartesian(PEOPLE, adjCompl)]
  const dets = withExtras(cartesian(DET_SUBJECTS, preds), plurals)
  return {
    'phrase-simple': assertBank('phrase-simple', simple),
    'phrase-negation': assertBank('phrase-negation', simple.map(withNegation)),
    'phrase-adjectif': assertBank('phrase-adjectif', adj),
    'phrase-negation-adjectif': assertBank('phrase-negation-adjectif', adj.map(withNegation)),
    'phrase-determinants': assertBank('phrase-determinants', dets),
    'phrase-negation-determinants': assertBank('phrase-negation-determinants', dets.map(withNegation)),
    'phrase-preposition': assertBank('phrase-preposition', cartesian(PEOPLE, prep)),
    'phrase-negation-preposition': assertBank(
      'phrase-negation-preposition',
      cartesian(PEOPLE, prep).map(withNegation),
    ),
    'phrase-adverbe': assertBank('phrase-adverbe', cartesian(PEOPLE, adv)),
    'phrase-negation-adverbe': assertBank('phrase-negation-adverbe', cartesian(PEOPLE, adv).map(withNegation)),
    'phrase-conjonctions': assertBank('phrase-conjonctions', conjonctionSentences(preds)),
  }
}

const BANKS: Record<PhraseVerbGroup, Record<PhraseThemeId, PhraseToken[][]>> = {
  er: bankFor(ER_PRED, ER_ADJ_COMPL, ER_PREP, ER_ADV, ER_PLURALS),
  autres: bankFor(AUTRES_PRED, AUTRES_ADJ_COMPL, AUTRES_PREP, AUTRES_ADV, AUTRES_PLURALS),
}

export function phrasesFor(theme: PhraseThemeId, group: PhraseVerbGroup = 'er'): PhraseToken[][] {
  return BANKS[group][theme]
}

export function sentenceOf(tokens: PhraseToken[]): string {
  return joinPhrase(tokens)
}
