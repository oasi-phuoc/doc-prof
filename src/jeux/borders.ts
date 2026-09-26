/** 15 bordures personnalisées (recto / verso) — option grille de cartes. */

export type GameBorderStyle = {
  id: string
  label: string
  recto: string
  verso: string
}

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
    id: '05',
    label: 'Cadre étoilé',
    recto: '/lib/images/jeux/borders/border-05-recto.webp',
    verso: '/lib/images/jeux/borders/border-05-verso.webp',
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
    id: '15',
    label: 'Nuit étoilée',
    recto: '/lib/images/jeux/borders/border-15-recto.webp',
    verso: '/lib/images/jeux/borders/border-15-verso.webp',
  },
]

export function gameBorderById(id?: string): GameBorderStyle | undefined {
  if (!id) return undefined
  return GAME_BORDER_STYLES.find((b) => b.id === id)
}

export function gameBorderSrc(
  id: string | undefined,
  face: 'recto' | 'verso',
): string | undefined {
  const style = gameBorderById(id)
  if (!style) return undefined
  return face === 'verso' ? style.verso : style.recto
}
