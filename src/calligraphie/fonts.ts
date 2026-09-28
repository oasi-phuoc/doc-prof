/** Polices cursives liées (OFL) pour le domaine Calligraphie. */

export type CalliFontId = 'marelle' | 'playwrite'

export type CalliSizeId = 'petit' | 'moyen' | 'grand'

export type CalliFont = {
  id: CalliFontId
  label: string
  /** Nom CSS / SVG font-family. */
  family: string
  /** Fichier sous /fonts/calli/ */
  file: string
  /**
   * Rapport taille de police / interligne (carreau).
   * Calé sur la hauteur du « o » pour un corps ≈ 1 carreau (Seyès scolaire).
   */
  emPerUnit: number
}

export type CalliSize = {
  id: CalliSizeId
  label: string
  /** Hauteur d’un carreau (mm). */
  unitMm: number
}

export const CALLI_FONTS: CalliFont[] = [
  {
    id: 'marelle',
    label: 'Marelle',
    family: 'Calli Marelle',
    file: 'marelle.woff2',
    emPerUnit: 2.04,
  },
  {
    id: 'playwrite',
    label: 'Playwrite',
    family: 'Calli Playwrite',
    file: 'playwrite-es.ttf',
    emPerUnit: 1.86,
  },
]

/**
 * Carreau (mm) calé pour 4 / 5 / 6 blocs sur une page A4
 * avec en-tête institutionnel, titre et pied de page.
 * Grand → carreau plus large (4 blocs) · Petit → plus serré (6 blocs).
 */
export const CALLI_SIZES: CalliSize[] = [
  { id: 'petit', label: 'Petit', unitMm: 3.6 },
  { id: 'moyen', label: 'Moyen', unitMm: 4.7 },
  { id: 'grand', label: 'Grand', unitMm: 6.2 },
]

export const DEFAULT_CALLI_FONT: CalliFontId = 'marelle'
export const DEFAULT_CALLI_SIZE: CalliSizeId = 'moyen'

/** Anciens ids → police courante. */
const FONT_ALIASES: Record<string, CalliFontId> = {
  marelle: 'marelle',
  playwrite: 'playwrite',
  'playwrite-es': 'playwrite',
  'playwrite-fr-trad': 'playwrite',
  'playwrite-fr-moderne': 'playwrite',
  'playwrite-it-trad': 'playwrite',
  'playwrite-de-grund': 'playwrite',
  'dancing-script': 'marelle',
  'marck-script': 'marelle',
  cookie: 'marelle',
  parisienne: 'marelle',
  sacramento: 'marelle',
}

export function calliFontById(id: string | undefined): CalliFont {
  const resolved = (id && FONT_ALIASES[id]) || DEFAULT_CALLI_FONT
  return CALLI_FONTS.find((f) => f.id === resolved) ?? CALLI_FONTS[0]!
}

export function calliSizeById(id: string | undefined): CalliSize {
  return CALLI_SIZES.find((s) => s.id === id) ?? CALLI_SIZES[1]!
}

/** Déclarations @font-face pour App.css (générées). */
export function calliFontFaceCss(): string {
  return CALLI_FONTS.map((f) => {
    const format = f.file.endsWith('.woff2') ? 'woff2' : 'truetype'
    return `@font-face{font-family:'${f.family}';src:url('/fonts/calli/${f.file}') format('${format}');font-weight:400;font-style:normal;font-display:swap}`
  }).join('\n')
}
