/** Polices cursives liées (OFL) pour le domaine Calligraphie. */

export type CalliFontId =
  | 'marelle'
  | 'playwrite-fr-trad'
  | 'playwrite-fr-moderne'
  | 'playwrite-it-trad'
  | 'playwrite-es'
  | 'playwrite-de-grund'
  | 'dancing-script'
  | 'marck-script'
  | 'cookie'
  | 'parisienne'
  | 'sacramento'

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
    id: 'playwrite-fr-trad',
    label: 'Playwrite FR Trad',
    family: 'Calli Playwrite FR Trad',
    file: 'playwrite-fr-trad.ttf',
    emPerUnit: 1.86,
  },
  {
    id: 'playwrite-fr-moderne',
    label: 'Playwrite FR Moderne',
    family: 'Calli Playwrite FR Moderne',
    file: 'playwrite-fr-moderne.ttf',
    emPerUnit: 1.86,
  },
  {
    id: 'playwrite-it-trad',
    label: 'Playwrite IT',
    family: 'Calli Playwrite IT',
    file: 'playwrite-it-trad.ttf',
    emPerUnit: 1.86,
  },
  {
    id: 'playwrite-es',
    label: 'Playwrite ES',
    family: 'Calli Playwrite ES',
    file: 'playwrite-es.ttf',
    emPerUnit: 1.86,
  },
  {
    id: 'playwrite-de-grund',
    label: 'Playwrite DE',
    family: 'Calli Playwrite DE',
    file: 'playwrite-de-grund.ttf',
    emPerUnit: 1.86,
  },
  {
    id: 'dancing-script',
    label: 'Dancing Script',
    family: 'Calli Dancing Script',
    file: 'dancing-script.ttf',
    emPerUnit: 2.6,
  },
  {
    id: 'marck-script',
    label: 'Marck Script',
    family: 'Calli Marck Script',
    file: 'marck-script.ttf',
    emPerUnit: 2.69,
  },
  {
    id: 'cookie',
    label: 'Cookie',
    family: 'Calli Cookie',
    file: 'cookie.ttf',
    emPerUnit: 2.7,
  },
  {
    id: 'parisienne',
    label: 'Parisienne',
    family: 'Calli Parisienne',
    file: 'parisienne.ttf',
    emPerUnit: 2.64,
  },
  {
    id: 'sacramento',
    label: 'Sacramento',
    family: 'Calli Sacramento',
    file: 'sacramento.ttf',
    emPerUnit: 4.02,
  },
]

export const CALLI_SIZES: CalliSize[] = [
  { id: 'petit', label: 'Petit', unitMm: 1.7 },
  { id: 'moyen', label: 'Moyen', unitMm: 2.2 },
  { id: 'grand', label: 'Grand', unitMm: 2.85 },
]

export const DEFAULT_CALLI_FONT: CalliFontId = 'marelle'
export const DEFAULT_CALLI_SIZE: CalliSizeId = 'moyen'

export function calliFontById(id: string | undefined): CalliFont {
  return CALLI_FONTS.find((f) => f.id === id) ?? CALLI_FONTS[0]!
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
