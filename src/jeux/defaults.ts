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

const DEVINETTES: GameEntry[] = [
  {
    text: 'pomme',
    imageSrc: '/assets/words/lecture/pomme.webp',
    clues: ['C’est un fruit.', 'C’est souvent rouge ou verte.', 'On la croque.'],
  },
  {
    text: 'chat',
    imageSrc: '/assets/words/lecture/chat.webp',
    clues: ['C’est un animal.', 'Il miaule.', 'Il aime le lait.'],
  },
  {
    text: 'livre',
    imageSrc: '/assets/words/lecture/livre.webp',
    clues: ['On le lit.', 'Il a des pages.', 'Il est à la bibliothèque.'],
  },
  {
    text: 'soleil',
    imageSrc: '/assets/words/lecture/soleil.webp',
    clues: ['Il brille le jour.', 'Il donne de la lumière.', 'Il chauffe.'],
  },
  {
    text: 'vélo',
    imageSrc: '/assets/words/lecture/vélo.webp',
    clues: ['Il a deux roues.', 'On pédale.', 'On porte un casque.'],
  },
  {
    text: 'pain',
    imageSrc: '/assets/words/lecture/pain.webp',
    clues: ['On l’achète à la boulangerie.', 'On le mange.', 'Il est croustillant.'],
  },
  {
    text: 'maison',
    imageSrc: '/assets/words/lecture/maison.webp',
    clues: ['On y habite.', 'Elle a un toit.', 'Elle a des portes et des fenêtres.'],
  },
  {
    text: 'chien',
    imageSrc: '/assets/words/lecture/chien.webp',
    clues: ['C’est un animal.', 'Il aboie.', 'C’est un ami de l’humain.'],
  },
  {
    text: 'chaise',
    imageSrc: '/assets/words/lecture/chaise.webp',
    clues: ['On s’assoit dessus.', 'Elle a quatre pieds.', 'Elle est dans la salle.'],
  },
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
