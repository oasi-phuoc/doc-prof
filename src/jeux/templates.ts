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

/** Grille de cartes unifiée : 9 cartes, 3 × 3. */
const GRID_3X3 = { cols: 3, rows: 3 } as const

export const GAME_TEMPLATES: Record<string, GameTemplate> = {
  'jeux-vocabulaire': {
    id: 'jeux-vocabulaire',
    family: 'cartes',
    label: 'Vocabulaire',
    orientation: 'portrait',
    grid: { ...GRID_3X3 },
    fields: [
      { type: 'image' },
      { type: 'texte', required: true, maxLength: 20 },
    ],
    entryCount: 9,
    cardCount: 9,
    duplex: true,
    maxTextLen: 20,
    entryHint: '9 paires image/mot · impression recto-verso (bord long).',
  },
  'jeux-devinettes': {
    id: 'jeux-devinettes',
    family: 'cartes',
    label: 'Devinettes',
    orientation: 'portrait',
    grid: { ...GRID_3X3 },
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
      '9 cartes · 3 phrases-indices auto (sans nommer le thème) · verso miroir.',
  },
  'jeux-memory': {
    id: 'jeux-memory',
    family: 'cartes',
    label: 'Mémory',
    orientation: 'portrait',
    grid: { ...GRID_3X3 },
    fields: [
      { type: 'image' },
      { type: 'texte', required: true, maxLength: 16 },
    ],
    entryCount: 4,
    cardCount: 9,
    duplex: true,
    maxTextLen: 16,
    entryHint: '4 paires image / mot (8 cartes + 1 case vide) · verso série.',
  },
  'jeux-loto': {
    id: 'jeux-loto',
    family: 'cartes',
    label: 'Loto',
    orientation: 'portrait',
    grid: { ...GRID_3X3 },
    fields: [
      { type: 'image' },
      { type: 'texte', required: true, maxLength: 16 },
    ],
    entryCount: 27,
    cardCount: 27,
    duplex: true,
    maxTextLen: 16,
    entryHint:
      'Jusqu’à 27 mots · grilles selon le nombre disponible (pas de cases vides).',
  },
  'jeux-intrus': {
    id: 'jeux-intrus',
    family: 'cartes',
    label: 'Intrus',
    orientation: 'portrait',
    grid: { ...GRID_3X3 },
    fields: [
      { type: 'image' },
      { type: 'texte', required: true },
    ],
    entryCount: 20,
    cardCount: 9,
    duplex: true,
    maxTextLen: 18,
    entryHint:
      'Mots du thème · à chaque génération, 9 cartes avec un nouvel intrus.',
  },
  'jeux-dominos': {
    id: 'jeux-dominos',
    family: 'cartes',
    label: 'Dominos',
    orientation: 'portrait',
    grid: { cols: 2, rows: 8 },
    fields: [
      { type: 'image' },
      { type: 'texte', required: true, maxLength: 16 },
    ],
    entryCount: 16,
    cardCount: 16,
    duplex: true,
    maxTextLen: 16,
    entryHint: '16 dominos image | mot (chaîne) · verso série.',
  },
  'jeux-sept-familles': {
    id: 'jeux-sept-familles',
    family: 'structures',
    label: '7 familles',
    orientation: 'portrait',
    grid: { ...GRID_3X3 },
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
    grid: { cols: 5, rows: 4 },
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

/** Types « grille de cartes » duplex. */
export function isJeuxCartesType(typeId: string): boolean {
  return templateFor(typeId)?.family === 'cartes'
}
