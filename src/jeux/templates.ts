/** Schémas des templates du domaine Jeux. */

export type GameFieldType = 'texte' | 'image' | 'indices' | 'categorie'

export type GameField = {
  type: GameFieldType
  required?: boolean
  maxLength?: number
}

export type GameFamily = 'cartes' | 'structures' | 'etiquettes'

export type GameTemplate = {
  id: string
  family: GameFamily
  label: string
  orientation: 'portrait' | 'landscape'
  grid: { cols: number; rows: number }
  fields: GameField[]
  /** Nombre de lignes de contenu attendues côté enseignant·e. */
  entryCount: number
  /** Cartes / cases imprimées après génération. */
  cardCount: number
  duplex?: boolean
  maxTextLen: number
  /** Libellé du panneau de saisie. */
  entryHint: string
}

export const GAME_TEMPLATES: Record<string, GameTemplate> = {
  'jeux-vocabulaire': {
    id: 'jeux-vocabulaire',
    family: 'cartes',
    label: 'Vocabulaire',
    orientation: 'portrait',
    grid: { cols: 3, rows: 4 },
    fields: [
      { type: 'image' },
      { type: 'texte', required: true, maxLength: 20 },
    ],
    entryCount: 12,
    cardCount: 12,
    duplex: true,
    maxTextLen: 20,
    entryHint:
      '12 paires image/mot · impression recto-verso (images puis mots alignés).',
  },
  'jeux-devinettes': {
    id: 'jeux-devinettes',
    family: 'cartes',
    label: 'Devinettes',
    orientation: 'portrait',
    grid: { cols: 3, rows: 3 },
    fields: [
      { type: 'image' },
      { type: 'texte', required: true, maxLength: 20 },
      { type: 'indices', required: true },
    ],
    entryCount: 9,
    cardCount: 9,
    duplex: true,
    maxTextLen: 20,
    entryHint:
      '9 cartes · mot + image au recto, 3 indices au verso (impression bord long).',
  },
  'jeux-memory': {
    id: 'jeux-memory',
    family: 'cartes',
    label: 'Mémory',
    orientation: 'portrait',
    grid: { cols: 3, rows: 4 },
    fields: [
      { type: 'image' },
      { type: 'texte', required: true, maxLength: 16 },
    ],
    entryCount: 6,
    cardCount: 12,
    duplex: true,
    maxTextLen: 16,
    entryHint:
      '6 paires image / mot au recto · dos blanc ou couleur au verso (bord long).',
  },
  'jeux-loto': {
    id: 'jeux-loto',
    family: 'cartes',
    label: 'Loto',
    orientation: 'portrait',
    grid: { cols: 3, rows: 3 },
    fields: [
      { type: 'image' },
      { type: 'texte', required: true, maxLength: 16 },
    ],
    entryCount: 18,
    cardCount: 18,
    maxTextLen: 16,
    entryHint: '18 mots (+ images optionnelles). Deux grilles 3×3 + paquet animateur.',
  },
  'jeux-intrus': {
    id: 'jeux-intrus',
    family: 'cartes',
    label: 'Intrus',
    orientation: 'portrait',
    grid: { cols: 4, rows: 4 },
    fields: [
      { type: 'texte', required: true },
      { type: 'categorie' },
    ],
    entryCount: 4,
    cardCount: 16,
    maxTextLen: 18,
    entryHint: 'Groupe = 3 mots + intrus : « chat, chien, oiseau | table » (4 groupes).',
  },
  'jeux-dominos': {
    id: 'jeux-dominos',
    family: 'cartes',
    label: 'Dominos',
    orientation: 'portrait',
    grid: { cols: 2, rows: 4 },
    fields: [{ type: 'texte', required: true, maxLength: 14 }],
    entryCount: 8,
    cardCount: 8,
    maxTextLen: 14,
    entryHint: 'Chaîne de mots (8) : chaque domino relie deux mots voisins.',
  },
  'jeux-tri': {
    id: 'jeux-tri',
    family: 'cartes',
    label: 'Tri / catégories',
    orientation: 'portrait',
    grid: { cols: 3, rows: 4 },
    fields: [
      { type: 'categorie', required: true },
      { type: 'texte', required: true },
    ],
    entryCount: 3,
    cardCount: 15,
    maxTextLen: 16,
    entryHint: 'Catégorie : mot1, mot2, mot3, mot4 (3 catégories).',
  },
  'jeux-sept-familles': {
    id: 'jeux-sept-familles',
    family: 'structures',
    label: '7 familles',
    orientation: 'portrait',
    grid: { cols: 4, rows: 7 },
    fields: [
      { type: 'categorie', required: true },
      { type: 'texte', required: true },
    ],
    entryCount: 7,
    cardCount: 28,
    maxTextLen: 14,
    entryHint: 'Famille : membre1, membre2, membre3, membre4 (7 familles).',
  },
  'jeux-plateau': {
    id: 'jeux-plateau',
    family: 'structures',
    label: 'Plateau de jeu',
    orientation: 'portrait',
    grid: { cols: 5, rows: 5 },
    fields: [{ type: 'texte', required: true, maxLength: 40 }],
    entryCount: 12,
    cardCount: 20,
    maxTextLen: 40,
    entryHint: 'Consignes de cases (12). Le plateau numérote 20 cases.',
  },
  'jeux-de-roue': {
    id: 'jeux-de-roue',
    family: 'structures',
    label: 'Dé / roue',
    orientation: 'portrait',
    grid: { cols: 3, rows: 2 },
    fields: [{ type: 'texte', required: true, maxLength: 24 }],
    entryCount: 6,
    cardCount: 6,
    maxTextLen: 24,
    entryHint: 'Six consignes (une par face du dé / secteur).',
  },
  'jeux-bandes-mots': {
    id: 'jeux-bandes-mots',
    family: 'etiquettes',
    label: 'Bandes-mots',
    orientation: 'portrait',
    grid: { cols: 1, rows: 1 },
    fields: [{ type: 'texte', required: true }],
    entryCount: 1,
    cardCount: 12,
    maxTextLen: 120,
    entryHint: 'Une phrase : elle sera découpée en étiquettes-mots.',
  },
  'jeux-phrases-texte': {
    id: 'jeux-phrases-texte',
    family: 'etiquettes',
    label: 'Phrases à reconstituer',
    orientation: 'portrait',
    grid: { cols: 1, rows: 1 },
    fields: [{ type: 'texte', required: true }],
    entryCount: 5,
    cardCount: 5,
    maxTextLen: 100,
    entryHint: 'Une phrase par ligne (à remettre dans l’ordre).',
  },
}

export function templateFor(typeId: string): GameTemplate | null {
  return GAME_TEMPLATES[typeId] ?? null
}

export function isJeuxType(typeId: string): boolean {
  return typeId.startsWith('jeux-') || typeId in GAME_TEMPLATES
}
