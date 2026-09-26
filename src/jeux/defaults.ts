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

/** 7 familles structurées pour le générateur. */
export const DEFAULT_SEPT_FAMILLES: Array<{ family: string; members: string[] }> = [
  { family: 'Maison', members: ['porte', 'fenêtre', 'toit', 'mur'] },
  { family: 'École', members: ['livre', 'crayon', 'cahier', 'cartable'] },
  { family: 'Fruits', members: ['pomme', 'poire', 'banane', 'orange'] },
  { family: 'Animaux', members: ['chat', 'chien', 'oiseau', 'poisson'] },
  { family: 'Corps', members: ['main', 'pied', 'tête', 'œil'] },
  { family: 'Vêtements', members: ['manteau', 'chaussure', 'chapeau', 'écharpe'] },
  { family: 'Transports', members: ['bus', 'train', 'vélo', 'voiture'] },
]

const SEPT_FAMILLES: GameEntry[] = DEFAULT_SEPT_FAMILLES.flatMap((f) =>
  f.members.map((text) => ({ text, category: f.family })),
)

const PLATEAU: GameEntry[] = [
  'Dites votre prénom.',
  'Nommez une couleur.',
  'Comptez jusqu’à cinq.',
  'Citez un fruit.',
  'Faites un geste.',
  'Dites bonjour.',
  'Nommez un animal.',
  'Citez un jour.',
  'Dites merci.',
  'Nommez une boisson.',
  'Citez un métier.',
  'Avancez de deux cases.',
].map((text) => ({ text }))

const DE_ROUE: GameEntry[] = [
  'Mimez un animal',
  'Dites un fruit',
  'Comptez à voix haute',
  'Citez une couleur',
  'Faites une question',
  'Nommez un lieu',
].map((text) => ({ text }))

const BANDES: GameEntry[] = [
  { text: 'Le chat noir dort sur la chaise verte.' },
]

const PHRASES: GameEntry[] = [
  { text: 'Marie ouvre la porte.' },
  { text: 'Le soleil brille ce matin.' },
  { text: 'Nous mangeons une pomme.' },
  { text: 'Les enfants jouent dans la cour.' },
  { text: 'Le bus arrive à l’école.' },
]

export const DEFAULT_ENTRIES: Record<string, GameEntry[]> = {
  'jeux-vocabulaire': VOCAB,
  'jeux-devinettes': DEVINETTES,
  'jeux-memory': MEMORY,
  'jeux-loto': LOTO,
  'jeux-intrus': INTRUS,
  'jeux-dominos': DOMINOS,
  'jeux-sept-familles': SEPT_FAMILLES,
  'jeux-plateau': PLATEAU,
  'jeux-de-roue': DE_ROUE,
  'jeux-bandes-mots': BANDES,
  'jeux-phrases-texte': PHRASES,
}

export function defaultEntriesFor(typeId: string): GameEntry[] {
  return DEFAULT_ENTRIES[typeId]?.map((entry) => ({ ...entry })) ?? []
}
