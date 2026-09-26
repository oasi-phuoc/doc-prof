import type { GameEntry } from './types'

/** Contenus démo déterministes (originaux) pour chaque template. */

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
].map((text) => ({ text }))

const VRAI_FAUX: GameEntry[] = [
  { text: 'Paris est la capitale de la France.', isTrue: true },
  { text: 'Le soleil est bleu.', isTrue: false },
  { text: 'On boit de l’eau.', isTrue: true },
  { text: 'Un chat a six pattes.', isTrue: false },
  { text: 'Le lundi vient avant le mardi.', isTrue: true },
  { text: 'On mange avec les oreilles.', isTrue: false },
  { text: 'Deux et deux font quatre.', isTrue: true },
  { text: 'L’hiver est plus chaud que l’été.', isTrue: false },
]

const DEVINETTES: GameEntry[] = [
  { text: 'pomme', clues: ['C’est un fruit.', 'C’est souvent rouge ou verte.', 'On la croque.'] },
  { text: 'chat', clues: ['C’est un animal.', 'Il miaule.', 'Il aime le lait.'] },
  { text: 'livre', clues: ['On le lit.', 'Il a des pages.', 'Il est à la bibliothèque.'] },
  { text: 'école', clues: ['Les enfants y vont.', 'On y apprend.', 'Il y a des classes.'] },
  { text: 'vélo', clues: ['Il a deux roues.', 'On pédale.', 'On porte un casque.'] },
  { text: 'pain', clues: ['On l’achète à la boulangerie.', 'On le mange.', 'Il est croustillant.'] },
]

const MEMORY: GameEntry[] = ['maison', 'porte', 'fenêtre', 'table', 'chaise', 'lampe'].map((text) => ({
  text,
}))

const LOTO: GameEntry[] = [
  'rouge',
  'bleu',
  'vert',
  'jaune',
  'noir',
  'blanc',
  'orange',
  'rose',
  'gris',
  'violet',
  'marron',
  'beige',
  'argent',
  'or',
  'turquoise',
  'ivoire',
  'indigo',
  'corail',
].map((text) => ({ text }))

const INTRUS: GameEntry[] = [
  { text: 'chat', category: 'animaux' },
  { text: 'chien', category: 'animaux' },
  { text: 'oiseau', category: 'animaux' },
  { text: 'table', category: 'animaux', isIntrus: true },
  { text: 'pomme', category: 'fruits' },
  { text: 'banane', category: 'fruits' },
  { text: 'poire', category: 'fruits' },
  { text: 'crayon', category: 'fruits', isIntrus: true },
  { text: 'rouge', category: 'couleurs' },
  { text: 'bleu', category: 'couleurs' },
  { text: 'vert', category: 'couleurs' },
  { text: 'livre', category: 'couleurs', isIntrus: true },
  { text: 'lundi', category: 'jours' },
  { text: 'mardi', category: 'jours' },
  { text: 'vendredi', category: 'jours' },
  { text: 'janvier', category: 'jours', isIntrus: true },
]

const DOMINOS: GameEntry[] = [
  'matin',
  'école',
  'classe',
  'livre',
  'crayon',
  'cahier',
  'récréation',
  'maison',
].map((text) => ({ text }))

const TRI: GameEntry[] = [
  { text: 'chat', category: 'Animaux' },
  { text: 'chien', category: 'Animaux' },
  { text: 'oiseau', category: 'Animaux' },
  { text: 'poisson', category: 'Animaux' },
  { text: 'pain', category: 'Nourriture' },
  { text: 'lait', category: 'Nourriture' },
  { text: 'riz', category: 'Nourriture' },
  { text: 'soupe', category: 'Nourriture' },
  { text: 'rouge', category: 'Couleurs' },
  { text: 'bleu', category: 'Couleurs' },
  { text: 'vert', category: 'Couleurs' },
  { text: 'jaune', category: 'Couleurs' },
]

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
  'jeux-vrai-faux': VRAI_FAUX,
  'jeux-devinettes': DEVINETTES,
  'jeux-memory': MEMORY,
  'jeux-loto': LOTO,
  'jeux-intrus': INTRUS,
  'jeux-dominos': DOMINOS,
  'jeux-tri': TRI,
  'jeux-sept-familles': SEPT_FAMILLES,
  'jeux-plateau': PLATEAU,
  'jeux-de-roue': DE_ROUE,
  'jeux-bandes-mots': BANDES,
  'jeux-phrases-texte': PHRASES,
}

export function defaultEntriesFor(typeId: string): GameEntry[] {
  return DEFAULT_ENTRIES[typeId]?.map((entry) => ({ ...entry })) ?? []
}
