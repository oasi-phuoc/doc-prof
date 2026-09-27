import { cluesForWord } from './clues'
import { resolveGameImageSrc } from './image-resolve'
import type { GameEntry } from './types'

/** Contenus démo déterministes (originaux) pour chaque template. */

function withImage(text: string, extra: Partial<GameEntry> = {}): GameEntry {
  return { text, imageSrc: resolveGameImageSrc(text), ...extra }
}

function withClues(text: string): GameEntry {
  return withImage(text, { clues: cluesForWord(text) })
}

const VOCAB: GameEntry[] = [
  'pain',
  'fromage',
  'pomme',
  'eau',
  'lait',
  'riz',
  'poulet',
  'poisson',
  'salade',
  'soupe',
  'yaourt',
  'fruit',
].map((text) => withImage(text))

const DEVINETTES: GameEntry[] = [
  'pomme',
  'chat',
  'livre',
  'soleil',
  'vélo',
  'pain',
  'maison',
  'chien',
  'chaise',
].map((text) => withClues(text))

const MEMORY: GameEntry[] = [
  withImage('maison'),
  withImage('fenêtre'),
  withImage('chaise'),
  withImage('lampe'),
  withImage('chat'),
  withImage('pomme'),
]

const LOTO: GameEntry[] = [
  'abricot',
  'ail',
  'ananas',
  'asperge',
  'aubergine',
  'poisson',
  'banane',
  'betterave',
  'beurre',
  'brocoli',
  'carotte',
  'cerise',
  'champignon',
  'citron',
  'concombre',
  'fraise',
  'fromage',
  'lait',
  'oignon',
  'orange',
  'pain',
  'pomme',
  'poulet',
  'raisin',
  'riz',
  'salade',
  'tomate',
].map((text) => withImage(text))

/** Mots du thème (intrus tirés à la génération). */
const INTRUS: GameEntry[] = [
  'pomme',
  'banane',
  'poire',
  'cerise',
  'orange',
  'fraise',
  'raisin',
  'citron',
  'ananas',
  'abricot',
  'pain',
  'fromage',
  'lait',
  'riz',
  'poulet',
  'poisson',
  'salade',
  'tomate',
  'carotte',
  'oignon',
].map((text) => withImage(text))

const DOMINOS: GameEntry[] = [
  'maison',
  'fenêtre',
  'chaise',
  'lampe',
  'chat',
  'pomme',
  'chien',
  'livre',
  'pain',
  'soleil',
  'vélo',
  'eau',
  'fleur',
  'cahier',
  'crayon',
  'arbre',
].map((text) => withImage(text))

export const DEFAULT_ENTRIES: Record<string, GameEntry[]> = {
  'jeux-vocabulaire': VOCAB,
  'jeux-devinettes': DEVINETTES,
  'jeux-memory': MEMORY,
  'jeux-loto': LOTO,
  'jeux-intrus': INTRUS,
  'jeux-dominos': DOMINOS,
}

export function defaultEntriesFor(typeId: string): GameEntry[] {
  return DEFAULT_ENTRIES[typeId]?.map((entry) => ({ ...entry })) ?? []
}
