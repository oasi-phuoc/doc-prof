import solidModels from './media/solid-views/models.json'
import { int, shuffle, type Rng } from './rng'
import type { MathItem } from './types'

function compositeArea(rng: Rng): MathItem {
  const width = int(rng, 5, 8)
  const height = int(rng, 4, 6)
  const cutWidth = int(rng, 2, width - 2)
  const cutHeight = int(rng, 2, height - 2)
  const area = width * height - cutWidth * cutHeight
  return {
    layout: 'text',
    areaFigures: [{ width, height, cut: { width: cutWidth, height: cutHeight } }],
    prompt: 'Découpez ou complétez la figure pour calculer son aire.',
    answer: `${width} × ${height} − ${cutWidth} × ${cutHeight} = ${area} cm². Autre calcul : ${width - cutWidth} × ${cutHeight} + ${width} × ${height - cutHeight} = ${area} cm².`,
  }
}

function compareAreas(rng: Rng, index: number): MathItem {
  const equalArea = index % 2 === 0
  const width = equalArea ? int(rng, 2, 3) : int(rng, 2, 4)
  const height = equalArea ? 2 * (width + 1) : int(rng, width + 2, 8)
  const rectangles = shuffle(rng, [
    { width, height },
    equalArea ? { width: 2 * width, height: height / 2 } : { width: width + 1, height: height - 1 },
  ])
  const a = rectangles[0]!
  const b = rectangles[1]!
  return {
    layout: 'text',
    areaFigures: rectangles,
    prompt: 'Comparez les aires et les périmètres de A et B. Montrez vos calculs.',
    answer: `A : ${a.width} × ${a.height} = ${a.width * a.height} cm² et 2 × (${a.width} + ${a.height}) = ${2 * (a.width + a.height)} cm. B : ${b.width} × ${b.height} = ${b.width * b.height} cm² et 2 × (${b.width} + ${b.height}) = ${2 * (b.width + b.height)} cm. ${equalArea ? 'Même aire, périmètres différents.' : 'Même périmètre, aires différentes.'}`,
  }
}

const directions = ['Face', 'Côté', 'Dessus'] as const

export function solidProjections(heights: number[][]) {
  const levels = [3, 2, 1]
  const columns = [0, 1, 2]
  const face = levels.map((level) => columns.map((col) => heights.some((row) => row[col]! >= level)))
  const side = levels.map((level) => [...heights].reverse().map((row) => row.some((n) => n >= level)))
  const top = heights.map((row) => row.map((n) => n > 0))
  return [face, side, top]
}

function solidViews(heights: number[][], index: number, rng: Rng): MathItem {
  const [face, side, top] = solidProjections(heights)
  const ordered = shuffle(rng, [face!, side!, top!])
  const labels = ['A', 'B', 'C']
  return {
    layout: 'text',
    solidViews: {
      image: String(index + 1),
      views: ordered.map((cells, i) => ({ label: labels[i]!, cells })),
    },
    prompt: 'Écrivez la lettre de chaque vue du solide : de face, de côté et de dessus.',
    answer: [face, side, top].map((cells, i) => `${directions[i]} : ${labels[ordered.indexOf(cells!)]}`).join(' · '),
  }
}

export function tryGenerateGeometryMeasurement(typeId: string, rng: Rng, count: number): MathItem[] | undefined {
  switch (typeId) {
    case 'aires-composees-quadrillage':
      return Array.from({ length: count }, () => compositeArea(rng))
    case 'aires-perimetres-comparer': {
      const start = int(rng, 0, 1)
      return Array.from({ length: count }, (_, index) => compareAreas(rng, start + index))
    }
    case 'figures-vues-solide': {
      const models = shuffle(rng, solidModels.slice(0, 6).map((heights, index) => ({ heights, index })))
      return Array.from({ length: count }, (_, i) => {
        const { heights, index } = models[i % models.length]!
        return solidViews(heights, index, rng)
      })
    }
    default:
      return undefined
  }
}
