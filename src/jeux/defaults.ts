import { resolveGameImageSrc } from './image-resolve'
import type { GameEntry } from './types'

/** Contenus démo déterministes (originaux) pour chaque template. */

function withImage(text: string, extra: Partial<GameEntry> = {}): GameEntry {
  return { text, imageSrc: resolveGameImageSrc(text), ...extra }
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
  withImage('pomme', {
    clues: ['C’est un fruit.', 'C’est souvent rouge ou verte.', 'On la croque.'],
  }),
  withImage('chat', {
    clues: ['C’est un animal.', 'Il miaule.', 'Il aime le lait.'],
  }),
  withImage('livre', {
    clues: ['On le lit.', 'Il a des pages.', 'Il est à la bibliothèque.'],
  }),
  withImage('soleil', {
    clues: ['Il brille le jour.', 'Il donne de la lumière.', 'Il chauffe.'],
  }),
  withImage('vélo', {
    clues: ['Il a deux roues.', 'On pédale.', 'On porte un casque.'],
  }),
  withImage('pain', {
    clues: ['On l’achète à la boulangerie.', 'On le mange.', 'Il est croustillant.'],
  }),
  withImage('maison', {
    clues: ['On y habite.', 'Elle a un toit.', 'Elle a des portes et des fenêtres.'],
  }),
  withImage('chien', {
    clues: ['C’est un animal.', 'Il aboie.', 'C’est un ami de l’humain.'],
  }),
  withImage('chaise', {
    clues: ['On s’assoit dessus.', 'Elle a quatre pieds.', 'Elle est dans la salle.'],
  }),
]

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

const INTRUS: GameEntry[] = [
  { text: 'table', words: ['chat', 'chien', 'oiseau', 'poisson'] },
  { text: 'crayon', words: ['pomme', 'banane', 'poire', 'cerise'] },
  { text: 'livre', words: ['rouge', 'bleu', 'vert', 'jaune'] },
  { text: 'janvier', words: ['lundi', 'mardi', 'jeudi', 'vendredi'] },
  { text: 'bus', words: ['mère', 'père', 'sœur', 'frère'] },
  { text: 'nuage', words: ['chambre', 'cuisine', 'salon', 'salle'] },
  { text: 'fièvre', words: ['train', 'bus', 'vélo', 'métro'] },
  { text: 'balai', words: ['pain', 'riz', 'lait', 'fromage'] },
  { text: 'quai', words: ['pull', 'jupe', 'pantalon', 'chemise'] },
  { text: 'oreiller', words: ['médecin', 'infirmière', 'pharmacie', 'hôpital'] },
  { text: 'caisse', words: ['livre', 'cahier', 'stylo', 'gomme'] },
  { text: 'valise', words: ['soleil', 'lune', 'étoile', 'nuage'] },
]

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

/** 3 catégories × 7 mots (+ 3 étiquettes catégorie = 24 cartes). */
const TRI: GameEntry[] = [
  {
    text: 'Animaux',
    category: 'Animaux',
    words: ['chat', 'chien', 'oiseau', 'poisson', 'cheval', 'vache', 'mouton'],
  },
  {
    text: 'Nourriture',
    category: 'Nourriture',
    words: ['pain', 'lait', 'riz', 'soupe', 'fromage', 'fruit', 'eau'],
  },
  {
    text: 'Couleurs',
    category: 'Couleurs',
    words: ['rouge', 'bleu', 'vert', 'jaune', 'noir', 'blanc', 'rose'],
  },
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
