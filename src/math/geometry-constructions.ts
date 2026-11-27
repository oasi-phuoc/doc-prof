import { int, pick, shuffle, type Rng } from './rng'
import type { CoordMark, CoordPath, CoordQuestion, CoordScene, MathItem } from './types'

type Point = { x: number; y: number }

function point(x: number, y: number): Point {
  return { x, y }
}

function construction(
  prompt: string, answer: string, paths: CoordPath[], marks: CoordMark[],
  question?: Omit<CoordQuestion, 'answer'>, hideGrid = false,
): MathItem {
  const coordScene: CoordScene = {
    variant: 'axes', axis: 'numeric', cols: 10, rows: 8, rangeX: 5, rangeY: 4,
    unitSquares: 1, cellMm: 4, hideAxes: true, hideGrid, showOrigin: false, paths,
    marks: marks.map((mark) => ({ ...mark, showCoord: false })),
  }
  return {
    layout: 'coord', coordTask: 'construct', prompt, answer, coordScene,
    coordQuestions: question ? [{ ...question, answer }] : undefined,
  }
}

function itinerary(rng: Rng, index: number): MathItem {
  const horizontal = pick(rng, [-1, 1])
  const vertical = pick(rng, [-1, 1])
  const first = int(rng, 2, 3)
  const second = int(rng, 2, 3)
  const third = int(rng, 1, first - 1)
  const start = point(-horizontal, -vertical)
  const cornerA = point(start.x + horizontal * first, start.y)
  const cornerB = point(cornerA.x, start.y + vertical * second)
  const finish = point(cornerB.x - horizontal * third, cornerB.y)
  const destinations = shuffle(rng, [finish, point(-finish.x - horizontal, finish.y), point(finish.x, -finish.y)])
  const labels = ['A', 'B', 'C']
  const finishLabel = labels[destinations.indexOf(finish)]!
  const marks: CoordMark[] = [
    { ...start, kind: 'point', label: 'D' },
    ...destinations.map((p, i): CoordMark => ({ ...p, kind: 'point', label: labels[i] })),
  ]
  const code = [
    `${first} vers l’${horizontal > 0 ? 'est' : 'ouest'}`,
    `${second} vers le ${vertical > 0 ? 'nord' : 'sud'}`,
    `${third} vers l’${horizontal > 0 ? 'ouest' : 'est'}`,
  ].join(', puis ')
  const follow = index % 2 === 0
  return construction(
    follow
      ? `Le nord est en haut. Partez de D. Tracez le trajet en carreaux : ${code}.`
      : `Le nord est en haut. Suivez le trait de D à ${finishLabel}. Pour chaque étape, écrivez le nombre de carreaux et la direction.`,
    follow ? finishLabel : code,
    [{
      id: 'route', kind: 'segment', points: [start, cornerA, cornerB, finish],
      color: 'blue', reveal: follow ? 'answer' : 'always',
    }],
    marks,
    { prompt: follow ? 'Quel point avez-vous atteint ?' : 'Écrivez le trajet.', reply: 'text' },
  )
}

function drawLine(rng: Rng, index: number): MathItem {
  const [a, b] = pick(rng, [[0, 1], [1, 0], [1, 1], [1, -2]] as const)
  const p = point(int(rng, -2, 2), int(rng, -2, 2))
  const c = -(a * p.x + b * p.y) + pick(rng, [-2, 2])
  const parallel = index % 2 === 0
  const [u, v] = parallel ? [a, b] : [-b, a]
  return construction(
    `Tracez une droite qui passe par P. Elle doit être ${parallel ? 'parallèle' : 'perpendiculaire'} à la droite donnée. Utilisez une règle et une équerre.`,
    `Droite ${parallel ? 'parallèle' : 'perpendiculaire'} passant par P.`,
    [
      { id: 'given', kind: 'line', a, b, c, reveal: 'always' },
      { id: 'solution', kind: 'line', a: u, b: v, c: -(u * p.x + v * p.y), reveal: 'answer', color: 'blue', stroke: 'dashed' },
    ],
    [{ ...p, kind: 'point', label: 'P' }], undefined, true,
  )
}

const symmetryFigures = [
  { vertices: [point(-2, -2), point(2, -2), point(2, 2), point(-2, 2)], axes: [[1, 0], [0, 1], [1, 1], [1, -1]] },
  { vertices: [point(-3, -2), point(3, -2), point(3, 2), point(-3, 2)], axes: [[1, 0], [0, 1]] },
  { vertices: [point(-3, -1), point(3, -1), point(0, 3)], axes: [[1, 0]] },
  { vertices: [point(-3, -2), point(3, -2), point(-1, 2)], axes: [] },
]

function symmetry(rng: Rng, index: number): MathItem {
  const figure = symmetryFigures[index % symmetryFigures.length]!
  const rotate = rng() < 0.5
  const center = point(int(rng, -1, 1), 0)
  const vertices = figure.vertices.map(({ x, y }) => rotate ? point(center.x - y, x) : point(center.x + x, y))
  const axes = figure.axes.map(([a, b], i): CoordPath => {
    const [u, v] = rotate ? [-b!, a!] : [a!, b!]
    return { id: `axis-${i}`, kind: 'line', a: u, b: v, c: -(u * center.x + v * center.y), stroke: 'dashed', color: 'blue', reveal: 'answer' }
  })
  return construction(
    'Tracez tous les axes de symétrie de la figure. Une figure peut ne pas avoir d’axe.',
    axes.length === 0 ? 'Aucun axe' : String(axes.length),
    [{ id: 'shape', kind: 'polygon', points: vertices, reveal: 'always' }, ...axes], [],
    { prompt: 'Combien d’axes ?', reply: 'text' },
  )
}

export function tryGenerateGeometryConstructions(typeId: string, rng: Rng, count: number): MathItem[] | undefined {
  const generate = {
    'reperage-itineraires': itinerary,
    'figures-tracer-droites': drawLine,
    'transformations-tracer-axes': symmetry,
  }
  if (!Object.hasOwn(generate, typeId)) return undefined
  const start = int(rng, 0, 3)
  const build = generate[typeId as keyof typeof generate]
  return Array.from({ length: count }, (_, index) => build(rng, start + index))
}
