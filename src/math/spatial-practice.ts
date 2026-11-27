import maps from './media/spatial/maps.json'
import solidModels from './media/solid-views/models.json'
import { solidProjections } from './geometry-measurement'
import { int, pick, shuffle, type Rng } from './rng'
import type { Difficulty, MathItem, SpatialPoint } from './types'

export const MAP_COLUMNS = 6
export const MAP_ROWS = 5
export const cameraLetters = ['A', 'B', 'C', 'D'] as const

type MapScene = typeof maps[number]

function code({ x, y }: SpatialPoint) {
  return `${String.fromCharCode(65 + x)}${y + 1}`
}

function shortestPath(
  start: SpatialPoint, end: SpatialPoint, forbidden: Set<string>,
): SpatialPoint[] {
  const queue = [[start]]
  const visited = new Set([code(start)])
  for (const path of queue) {
    const cell = path[path.length - 1]!
    if (code(cell) === code(end)) return path
    const neighbours = [
      { x: cell.x + 1, y: cell.y }, { x: cell.x, y: cell.y + 1 },
      { x: cell.x - 1, y: cell.y }, { x: cell.x, y: cell.y - 1 },
    ]
    for (const next of neighbours) {
      if (next.x < 0 || next.y < 0 || next.x >= MAP_COLUMNS || next.y >= MAP_ROWS) continue
      const key = code(next)
      if (visited.has(key) || forbidden.has(key)) continue
      visited.add(key)
      queue.push([...path, next])
    }
  }
  return []
}

function gridCode(scene: MapScene, rng: Rng, difficulty: Difficulty): MathItem {
  const [a, b, c] = shuffle(rng, scene.landmarks)
  const questions = [
    { prompt: `Dans quelle case se trouve ce lieu ? ${a!.name}`, answer: code(a!) },
    { prompt: `Quel lieu se trouve dans la case ${code(b!)} ?`, answer: b!.name },
  ]
  if (difficulty !== 'facile') {
    const cell = { x: int(rng, 0, MAP_COLUMNS - 1), y: int(rng, 0, MAP_ROWS - 1) }
    const empty = scene.landmarks.every((place) => code(place) !== code(cell))
    questions.push(empty
      ? { prompt: `Dessinez une croix dans la case ${code(cell)}.`, answer: code(cell) }
      : { prompt: `Dans quelle case se trouve ce lieu ? ${c!.name}`, answer: code(c!) })
    if (empty) return { layout: 'text', spatial: { map: scene.id, questions, mark: cell }, answer: questions.map((q) => q.answer).join(' · ') }
  }
  return { layout: 'text', spatial: { map: scene.id, questions }, answer: questions.map((q) => q.answer).join(' · ') }
}

function direction(scene: MapScene, rng: Rng, difficulty: Difficulty): MathItem {
  const [from, to] = shuffle(rng, scene.landmarks)
  const dx = to!.x - from!.x
  const dy = to!.y - from!.y
  const prompt = difficulty === 'facile'
    ? `Depuis « ${from!.name} », « ${to!.name} » se trouve-t-il plus haut, plus bas ou sur la même ligne ?`
    : `Pour aller de « ${from!.name} » à « ${to!.name} », indiquez le déplacement horizontal puis vertical. Donnez le nombre de cases et le sens à chaque fois.`
  const answer = difficulty === 'facile'
    ? dy === 0 ? 'Sur la même ligne' : dy < 0 ? 'Plus haut' : 'Plus bas'
    : [dx ? `${Math.abs(dx)} vers ${dx > 0 ? 'l’est' : 'l’ouest'}` : '0 à l’horizontale',
       dy ? `${Math.abs(dy)} vers le ${dy > 0 ? 'sud' : 'nord'}` : '0 à la verticale'].join(' · ')
  return { layout: 'text', spatial: { map: scene.id, questions: [{ prompt, answer }] }, answer }
}

function route(scene: MapScene, rng: Rng, difficulty: Difficulty): MathItem {
  const forbidden = new Set(scene.blocked.map(([x, y]) => code({ x: x!, y: y! })))
  const candidates = scene.landmarks.flatMap((from) => scene.landmarks.flatMap((to) => {
    if (from === to) return []
    const path = shortestPath(from, to, forbidden)
    if (path.length < 2) return []
    const direct = Math.abs(from.x - to.x) + Math.abs(from.y - to.y)
    return [{ from, to, path, detour: path.length - 1 > direct }]
  }))
  const detours = candidates.filter((pair) => pair.detour === (difficulty === 'avance'))
  const { from, to, path } = pick(rng, detours.length ? detours : candidates)
  const distance = path.length - 1
  const prompt = `Tracez un trajet le plus court possible de « ${from.name} » à « ${to.name} ». Avancez d’une case à la fois, sans diagonale et sans entrer dans les cases hachurées. Combien de déplacements faites-vous ?`
  const answer = `${distance} déplacements. Le dessin montre un trajet possible.`
  return { layout: 'text', spatial: { map: scene.id, questions: [{ prompt, answer }], path }, answer }
}

function viewpoint(scene: MapScene, rng: Rng, difficulty: Difficulty): MathItem {
  const cameras = shuffle(rng, cameraLetters).slice(0, difficulty === 'facile' ? 2 : 4)
  const views = shuffle(rng, cameras).slice(0, difficulty === 'avance' ? 3 : 2)
  const questions = views.map((letter, index) => ({
    prompt: `Depuis quel point voit-on l’image ${index + 1} ?`,
    answer: letter,
  }))
  return {
    layout: 'text', spatial: { map: scene.id, cameras, views, questions },
    answer: questions.map((q, i) => `${i + 1} : ${q.answer}`).join(' · '),
  }
}

function stackPlans(rng: Rng, count: number, difficulty: Difficulty): MathItem[] {
  const models = shuffle(rng, solidModels)
  return Array.from({ length: count }, (_, index) => {
    const stacks = models[index % models.length]!
    const total = stacks.flat().reduce((sum, height) => sum + height, 0)
    const occupied = stacks.flat().filter(Boolean).length
    const questions = [
      { prompt: 'Combien de piles sont dessinées sur le plan ?', answer: String(occupied) },
      { prompt: 'Combien de cubes faut-il en tout ?', answer: String(total) },
    ]
    if (difficulty !== 'facile') questions.push({
      prompt: 'Coloriez les cases occupées dans la vue de dessus.',
      answer: `${occupied} cases`,
    })
    return {
      layout: 'text', spatial: { stacks, questions, drawFootprint: difficulty !== 'facile' },
      answer: questions.map((q) => q.answer).join(' · '),
    }
  })
}

function recognizeSolid(rng: Rng, count: number, difficulty: Difficulty): MathItem[] {
  const models = shuffle(rng, solidModels.map((heights, index) => ({
    image: String(index + 1), projections: solidProjections(heights),
  })))
  const candidates = models.filter((model, index) => models.findIndex((other) =>
    JSON.stringify(other.projections) === JSON.stringify(model.projections)) === index)
  return Array.from({ length: count }, (_, index) => {
    const target = candidates[index % candidates.length]!
    const firstView = difficulty === 'facile' ? 1 : 0
    const distractors = candidates.filter((candidate) =>
      JSON.stringify(candidate.projections.slice(firstView)) !== JSON.stringify(target.projections.slice(firstView)))
    const ordered = shuffle(rng, [target, ...distractors.slice(0, 2)])
    const answer = String.fromCharCode(65 + ordered.indexOf(target))
    return {
      layout: 'text',
      spatial: {
        models: ordered.map((model) => model.image),
        projections: target.projections.slice(firstView).map((cells, view) => ({
          cells, label: ['Face', 'Côté', 'Dessus'][firstView + view]!,
        })),
        questions: [{ prompt: 'Quel solide correspond à ces vues ? Écrivez sa lettre.', answer }],
      },
      answer,
    }
  })
}

export function tryGenerateSpatialPractice(
  typeId: string, rng: Rng, count: number, difficulty: Difficulty,
): MathItem[] | undefined {
  if (typeId === 'figures-solide-depuis-vues') return recognizeSolid(rng, count, difficulty)
  if (typeId === 'figures-plan-piles') return stackPlans(rng, count, difficulty)
  const generators = {
    'reperage-plan-cases': gridCode,
    'reperage-plan-orientation': direction,
    'reperage-plan-trajet-court': route,
    'figures-points-de-vue': viewpoint,
  }
  if (!Object.hasOwn(generators, typeId)) return undefined
  const generate = generators[typeId as keyof typeof generators]
  const scenes = shuffle(rng, maps)
  return Array.from({ length: count }, (_, i) => generate(scenes[i % scenes.length]!, rng, difficulty))
}

export function getSpatialMap(id: string) {
  return maps.find((map) => map.id === id)
}
