import { pickSymmetryTemplate } from '@/tcm-cfr/symetrie'
import { fmt } from './column-arith'
import { int, pick, shuffle, type Rng } from './rng'
import type { CoordPath, MathItem } from './types'

const ANGLES = [
  { image: '01', answer: 'aigu' },
  { image: '02', answer: 'droit' },
  { image: '03', answer: 'obtus' },
  { image: '04', answer: 'droit' },
  { image: '05', answer: 'aigu' },
  { image: '06', answer: 'obtus' },
  { image: '07', answer: 'obtus' },
  { image: '08', answer: 'aigu' },
  { image: '09', answer: 'droit' },
  { image: '10', answer: 'aigu' },
  { image: '11', answer: 'droit' },
  { image: '12', answer: 'obtus' },
] as const

export function generateRulerSegments(rng: Rng): NonNullable<MathItem['segments']> {
  const lengthsMm = shuffle(rng, [
    int(rng, 25, 45),
    int(rng, 50, 80),
    int(rng, 90, 120),
  ])
  const units: Array<'mm' | 'cm'> = shuffle(rng, ['mm', 'cm', pick(rng, ['mm', 'cm'] as const)])
  // Garantir au moins 1 cm et 1 mm.
  if (!units.includes('cm')) units[0] = 'cm'
  if (!units.includes('mm')) units[1] = 'mm'
  return lengthsMm.map((mm, i) => ({
    mm,
    unit: units[i]!,
    display: units[i] === 'cm' ? fmt(mm / 10) : String(mm),
    slope: (rng() < 0.5 ? -1 : 1) * (2 + int(rng, 0, 6)) / 100,
  }))
}

const RULER_QUESTIONS = ['Quel est le plus long segment ?', 'Quel est le plus court segment ?']

const CUBE_NETS = [
  { image: '01', valid: true },
  { image: '02', valid: false },
  { image: '03', valid: true },
  { image: '04', valid: false },
  { image: '05', valid: true },
  { image: '06', valid: false },
  { image: '07', valid: true },
  { image: '08', valid: false },
  { image: '09', valid: true },
  { image: '10', valid: false },
  { image: '11', valid: true },
  { image: '12', valid: false },
] as const

function generateTranslation(rng: Rng): MathItem {
  const dx = int(rng, 4, 6) * (rng() < 0.5 ? -1 : 1)
  const dy = pick(rng, [-2, -1, 1, 2])
  const startX = dx > 0 ? -5 : 2
  const startY = int(rng, -2, 0)
  const points = [
    { x: startX, y: startY },
    { x: startX + int(rng, 2, 3), y: startY },
    { x: startX + int(rng, 0, 1), y: startY + int(rng, 2, 3) },
  ]
  const image = points.map(({ x, y }) => ({ x: x + dx, y: y + dy }))
  const paths: CoordPath[] = [
    { id: 'source', kind: 'polygon', points, reveal: 'always' },
    { id: 'image', kind: 'polygon', points: image, stroke: 'dashed', reveal: 'answer' },
  ]
  const prompt = `Déplacez la figure de ${Math.abs(dx)} carreaux vers la ${dx > 0 ? 'droite' : 'gauche'} et de ${Math.abs(dy)} ${Math.abs(dy) === 1 ? 'carreau' : 'carreaux'} vers le ${dy > 0 ? 'haut' : 'bas'}.`
  return {
    layout: 'coord',
    coordTask: 'construct',
    coordScene: {
      variant: 'axes',
      axis: 'numeric',
      cols: 16,
      rows: 12,
      range: 8,
      rangeX: 8,
      rangeY: 6,
      cellMm: 5,
      unitSquares: 1,
      hideAxes: true,
      marks: [],
      paths,
    },
    prompt,
    answer: `Image translatée de (${dx} ; ${dy}).`,
  }
}

export function tryGenerateGeometryPractice(typeId: string, rng: Rng, count: number): MathItem[] | null {
  if (typeId === 'figures-angles') {
    const angles = shuffle(rng, [...ANGLES])
    return Array.from({ length: count }, (_, i) => {
      const angle = angles[i % angles.length]!
      return { layout: 'text', exerciseImage: { kind: 'angles', id: angle.image }, answer: angle.answer }
    })
  }
  if (typeId === 'figures-patrons-cube') {
    const variants = shuffle(rng, CUBE_NETS)
    return Array.from({ length: count }, (_, i) => {
      const net = variants[i % variants.length]!
      return {
        layout: 'text',
        exerciseImage: { kind: 'cube-nets', id: net.image },
        answer: net.valid ? 'Oui, c’est un patron de cube.' : 'Non, des faces se superposeraient.',
      }
    })
  }
  if (typeId === 'transformations-translation') {
    return Array.from({ length: count }, () => generateTranslation(rng))
  }
  if (typeId === 'mesures-segments') {
    const segments = generateRulerSegments(rng)
    const lengths = segments.map(({ mm }) => mm)
    const letter = (length: number) => String.fromCharCode(97 + lengths.indexOf(length))
    return [{
      layout: 'segment-measure',
      segments,
      options: RULER_QUESTIONS,
      answer: `${letter(Math.max(...lengths))} ; ${letter(Math.min(...lengths))}`,
    }]
  }
  if (typeId === 'transformations-symetrie-quadrillage') {
    return Array.from({ length: count }, () => {
      const figure = pickSymmetryTemplate(rng)
      return { layout: 'symmetry-grid', symmetryFigure: figure, answer: 'Silhouette réfléchie par rapport à l’axe.' }
    })
  }
  if (typeId === 'figures-reproduire' || typeId === 'figures-agrandir') {
    const scale = typeId === 'figures-agrandir' ? 2 : 1
    return Array.from({ length: count }, () => ({
      layout: 'symmetry-grid',
      symmetryFigure: pickSymmetryTemplate(rng),
      cscTask: { kind: 'copy', scale },
      answer: scale === 2 ? 'Silhouette agrandie au double.' : 'Silhouette reproduite à l’identique.',
    }))
  }
  if (typeId === 'transformations-quart-tour') {
    return Array.from({ length: count }, () => {
      const clockwise = rng() < 0.5
      return {
        layout: 'symmetry-grid',
        symmetryFigure: pickSymmetryTemplate(rng),
        gridRotation: clockwise ? 'clockwise' : 'counterclockwise',
        prompt: clockwise ? 'Tournez de 90° dans le sens des aiguilles d’une montre.' : 'Tournez de 90° dans le sens inverse des aiguilles d’une montre.',
        answer: clockwise ? 'Silhouette tournée de 90° dans le sens horaire.' : 'Silhouette tournée de 90° dans le sens antihoraire.',
      }
    })
  }
  return null
}
