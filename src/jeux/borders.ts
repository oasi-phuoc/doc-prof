/** Bordures personnalisées (recto / verso) — même liste pour les deux faces. */

export type GameBorderStyle = {
  id: string
  label: string
  recto: string
  verso: string
}

/**
 * Bordure verso proposée à la première sélection recto
 * (même style, face verso du couple).
 */
export const DEFAULT_VERSO_BORDER_ID = '16'

export const GAME_BORDER_STYLES: GameBorderStyle[] = [
  {
    id: '01',
    label: 'Vigne fleurie',
    recto: '/lib/images/jeux/borders/border-01-recto.webp',
    verso: '/lib/images/jeux/borders/border-01-verso.webp',
  },
  {
    id: '02',
    label: 'Formes géométriques',
    recto: '/lib/images/jeux/borders/border-02-recto.webp',
    verso: '/lib/images/jeux/borders/border-02-verso.webp',
  },
  {
    id: '03',
    label: 'Doodles indigo',
    recto: '/lib/images/jeux/borders/border-03-recto.webp',
    verso: '/lib/images/jeux/borders/border-03-verso.webp',
  },
  {
    id: '04',
    label: 'Vagues pastel',
    recto: '/lib/images/jeux/borders/border-04-recto.webp',
    verso: '/lib/images/jeux/borders/border-04-verso.webp',
  },
  {
    id: '06',
    label: 'Vague violette',
    recto: '/lib/images/jeux/borders/border-06-recto.webp',
    verso: '/lib/images/jeux/borders/border-06-verso.webp',
  },
  {
    id: '07',
    label: 'Floral vert',
    recto: '/lib/images/jeux/borders/border-07-recto.webp',
    verso: '/lib/images/jeux/borders/border-07-verso.webp',
  },
  {
    id: '08',
    label: 'Bulles pastel',
    recto: '/lib/images/jeux/borders/border-08-recto.webp',
    verso: '/lib/images/jeux/borders/border-08-verso.webp',
  },
  {
    id: '09',
    label: 'Céleste bleu',
    recto: '/lib/images/jeux/borders/border-09-recto.webp',
    verso: '/lib/images/jeux/borders/border-09-verso.webp',
  },
  {
    id: '10',
    label: 'Crayons école',
    recto: '/lib/images/jeux/borders/border-10-recto.webp',
    verso: '/lib/images/jeux/borders/border-10-verso.webp',
  },
  {
    id: '11',
    label: 'Feuilles tropicales',
    recto: '/lib/images/jeux/borders/border-11-recto.webp',
    verso: '/lib/images/jeux/borders/border-11-verso.webp',
  },
  {
    id: '12',
    label: 'Croquis ludiques',
    recto: '/lib/images/jeux/borders/border-12-recto.webp',
    verso: '/lib/images/jeux/borders/border-12-verso.webp',
  },
  {
    id: '13',
    label: 'Marine',
    recto: '/lib/images/jeux/borders/border-13-recto.webp',
    verso: '/lib/images/jeux/borders/border-13-verso.webp',
  },
  {
    id: '14',
    label: 'Formes organiques',
    recto: '/lib/images/jeux/borders/border-14-recto.webp',
    verso: '/lib/images/jeux/borders/border-14-verso.webp',
  },
  {
    id: '16',
    label: 'Aquarelle botanique',
    recto: '/lib/images/jeux/borders/border-16-recto.webp',
    verso: '/lib/images/jeux/borders/border-16-verso.webp',
  },
  {
    id: '17',
    label: 'Géométrie vive',
    recto: '/lib/images/jeux/borders/border-17-recto.webp',
    verso: '/lib/images/jeux/borders/border-17-verso.webp',
  },
  {
    id: '18',
    label: 'Pinceaux colorés',
    recto: '/lib/images/jeux/borders/border-18-recto.webp',
    verso: '/lib/images/jeux/borders/border-18-verso.webp',
  },
  {
    id: '19',
    label: 'Vichy scrapbook',
    recto: '/lib/images/jeux/borders/border-19-recto.webp',
    verso: '/lib/images/jeux/borders/border-19-verso.webp',
  },
  {
    id: '20',
    label: 'Bord de mer',
    recto: '/lib/images/jeux/borders/border-20-recto.webp',
    verso: '/lib/images/jeux/borders/border-20-verso.webp',
  },
  {
    id: '21',
    label: 'Cœurs roses',
    recto: '/lib/images/jeux/borders/border-21-recto.webp',
    verso: '/lib/images/jeux/borders/border-21-verso.webp',
  },
  {
    id: '22',
    label: 'Feuilles sauge',
    recto: '/lib/images/jeux/borders/border-22-recto.webp',
    verso: '/lib/images/jeux/borders/border-22-verso.webp',
  },
  {
    id: '23',
    label: 'Étoiles jaunes',
    recto: '/lib/images/jeux/borders/border-23-recto.webp',
    verso: '/lib/images/jeux/borders/border-23-verso.webp',
  },
  {
    id: '24',
    label: 'Bandes pastel',
    recto: '/lib/images/jeux/borders/border-24-recto.webp',
    verso: '/lib/images/jeux/borders/border-24-verso.webp',
  },
  {
    id: '25',
    label: 'Avions papier',
    recto: '/lib/images/jeux/borders/border-25-recto.webp',
    verso: '/lib/images/jeux/borders/border-25-verso.webp',
  },
  {
    id: '26',
    label: 'Bouquet floral',
    recto: '/lib/images/jeux/borders/border-26-recto.webp',
    verso: '/lib/images/jeux/borders/border-26-verso.webp',
  },
  {
    id: '27',
    label: 'Carnet formes',
    recto: '/lib/images/jeux/borders/border-27-recto.webp',
    verso: '/lib/images/jeux/borders/border-27-verso.webp',
  },
  {
    id: '28',
    label: 'Doodles noirs',
    recto: '/lib/images/jeux/borders/border-28-recto.webp',
    verso: '/lib/images/jeux/borders/border-28-verso.webp',
  },
  {
    id: '29',
    label: 'Bulles douces',
    recto: '/lib/images/jeux/borders/border-29-recto.webp',
    verso: '/lib/images/jeux/borders/border-29-verso.webp',
  },
]

export function gameBorderById(id?: string): GameBorderStyle | undefined {
  if (!id) return undefined
  return GAME_BORDER_STYLES.find((b) => b.id === id)
}

/** Image de bordure pour une face (ids recto / verso indépendants). */
export function gameBorderSrc(
  rectoId: string | undefined,
  face: 'recto' | 'verso',
  versoId?: string,
): string | undefined {
  const id = (face === 'verso' ? versoId || rectoId : rectoId || versoId)?.trim()
  const style = gameBorderById(id)
  if (!style) return undefined
  return face === 'verso' ? style.verso : style.recto
}
