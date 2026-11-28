import { REAL_MAP_COLUMNS, realMapGrid, realMapPlan, type MapPoint, type RealMapPlan } from './real-map-catalog'
import { createRng, shuffle } from './rng'
import type { MathItem, RealMapSettings } from './types'

export type RealMapItem = NonNullable<MathItem['sionMap']>
type Choice = { label: string; correct: boolean }
type Post = MapPoint & { column: number; row: number; given: boolean }
const routeColors = [
  { name: 'rouge', ink: '#b42336' },
  { name: 'bleu', ink: '#155bb0' },
  { name: 'vert', ink: '#217446' },
  { name: 'orange', ink: '#a34705' },
  { name: 'violet', ink: '#6f35af' },
]
type Route = { from: MapPoint; to: MapPoint; color: typeof routeColors[number] }
export type MapQuestion = { prompt: string } & (
  | { kind: 'text'; answer: string; hint?: string }
  | { kind: 'draw'; answer: string; color: Route['color'] }
  | { kind: 'check'; choices: Choice[] }
  | { kind: 'place' | 'read'; posts: Post[] }
)

type MapPractice = { plan: RealMapPlan; route: Route; questions: MapQuestion[]; posts: Post[] }

function withArticle(name: string) {
  if (/^(Aéroport|[ÉE]glise|[ÉE]cole|Abbaye|Office|Observatoire|Hôtel)\b/i.test(name)) return `l’${name}`
  if (/^(Gare|Basilique|Cathédrale|Place|Tour|Bibliothèque|Caserne|Collégiale|Maison|Salle|Chapelle|Sculpture|Télécabine|Halle|Mairie|Rue|Route|Poste|Promenade|Piscine|Paroisse)\b/i.test(name)) return `la ${name}`
  if (/^(Château|Musée|Pont|Parc|Théâtre|Centre|Palais|Stade|Lac|Temple|Port|Monument|Jardin|Marché|Jet|Bourg|Casino|Collège|Chemin|Départ|Fort|Moulin|Terrain|Square)\b/i.test(name)) return `le ${name}`
  return name
}

function locate(name: string, variant: number) {
  const place = withArticle(name)
  return [`Où se trouve **${place}** ?`, `Où est **${place}** ?`, `Dans quelle case voyez-vous **${place}** ?`][variant % 3]!
}

function linkQuestion({ from, to, color }: Route, variant: number): MapQuestion {
  return {
    kind: 'draw', color,
    prompt: variant % 2 === 0
      ? `Reliez **${from.name}** à **${to.name}** **en ${color.name}**.`
      : `Prenez un crayon **${color.name}**. Tracez un trait de **${from.name}** à **${to.name}**.`,
    answer: `Voir le trait ${color.name} sur le plan.`,
  }
}

const coordinates = ({ column, row }: Post) => `(${column} ; ${row})`
const caseCount = (count: number) => `${count} ${count === 1 ? 'case' : 'cases'}`

function caseQuestions(plan: RealMapPlan, target: number, variant: number): MapPractice {
  const { places, grid: { columns, rows } } = plan
  const first = places[target] ?? places[0]!
  const nextPlaces = [...places.slice(target + 1), ...places.slice(0, target)]
  const second = nextPlaces.find(place => place.code !== first.code) ?? nextPlaces[0] ?? first
  const choices = (labels: string[], correct: string[]) => shuffle(createRng(target * 17 + columns * 31 + rows),
    [...new Set(labels)].map(label => ({ label, correct: correct.includes(label) })))
  const atFirst = places.filter(place => place.code === first.code).map(place => place.name)
  const moveX = second.column - first.column
  const moveY = second.row - first.row
  const direction = moveX ? (moveX > 0 ? 'vers la droite' : 'vers la gauche') : (moveY > 0 ? 'vers le bas' : 'vers le haut')
  const distance = Math.abs(moveX) + Math.abs(moveY)
  const used = [...new Set([first.code, second.code])]
  const unused = Array.from({ length: columns * rows }, (_, index) =>
    `${REAL_MAP_COLUMNS[index % columns]}${Math.floor(index / columns) + 1}`,
  ).filter(code => !places.some(place => place.code === code))
  const empty = shuffle(createRng(variant), unused).slice(0, 2)
  const confirm = target % 2 === 0
  const lookForEmpty = variant % 2 === 1
  const route = { from: first, to: second, color: routeColors[variant % routeColors.length]! }

  return { plan, route, posts: [], questions: [
    { kind: 'text', prompt: locate(first.name, variant), answer: `Dans la case ${first.code}.` },
    { kind: 'check', prompt: `${lookForEmpty ? 'Quels lieux voyez-vous' : 'Quels lieux sont'} en **${first.code}** ? Cochez toutes les bonnes réponses.`,
      choices: choices([...atFirst, ...nextPlaces.filter(place => place.code !== first.code).slice(0, 2).map(place => place.name)], atFirst) },
    second.country ? { kind: 'text', prompt: `**${second.name}** est la capitale de quel pays ?`, answer: second.country }
      : { kind: 'text', prompt: locate(second.name, variant + 1), answer: `Dans la case ${second.code}.` },
    linkQuestion(route, variant),
    { kind: 'text', prompt: `Est-ce que **${withArticle(second.name)}** se trouve en **${confirm ? second.code : empty[0]}** ?`,
      answer: `${confirm ? 'Oui' : 'Non'}. Ce repère est en ${second.code}.` },
    { kind: 'text', prompt: `Partez du point **${first.name}** et allez au point **${second.name}**. Combien de cases au minimum ?`,
      hint: 'Déplacez-vous à l’horizontale ou à la verticale.', answer: `${caseCount(distance)}.` },
    ...(distance ? [{ kind: 'text' as const, prompt: `Pour aller de **${first.code}** à **${second.code}**, combien de cases allez-vous **${direction}** ?`,
      answer: `${caseCount(Math.abs(moveX || moveY))} ${direction}.` }] : []),
    { kind: 'check', prompt: lookForEmpty
      ? 'Cochez toutes les cases **sans repère nommé**.'
      : 'Dans quelles cases voyez-vous **un repère nommé** ? Cochez toutes les bonnes réponses.',
      choices: choices([...used, ...empty], lookForEmpty ? empty : used) },
  ] }
}

function coordinateQuestions(plan: RealMapPlan, target: number, variant: number): MapPractice {
  const { columns, rows } = plan.grid
  const intersections = Array.from({ length: (columns - 1) * (rows - 1) }, (_, index) => ({
    column: index % (columns - 1) + 1, row: Math.floor(index / (columns - 1)) + 1,
  }))
  const border = Array.from({ length: (columns + 1) * (rows + 1) }, (_, index) => ({
    column: index % (columns + 1), row: Math.floor(index / (columns + 1)),
  })).filter(({ column, row }) => column === 0 || column === columns || row === 0 || row === rows)
  const rng = createRng(variant * 127 + columns * 17 + rows * 113)
  const picked = [...shuffle(rng, intersections), ...shuffle(rng, border)]
  const names = ['P2', 'P5', 'P7', 'P8', 'D', 'A', 'P1', 'P3', 'P4', 'P6']
  const posts = names.map((name, index) => {
    const { column, row } = picked[index]!
    return { name, column, row, x: column / columns, y: 1 - row / rows, given: index < 4 }
  })
  const [p2, p5, p7, p8] = posts as [Post, Post, Post, Post, ...Post[]]
  const distance = Math.abs(p5.column - p2.column) + Math.abs(p5.row - p2.row)
  const route = { from: p2, to: p5, color: routeColors[variant % routeColors.length]! }
  const readPost = variant % 2 === 0
  return { plan, route, posts, questions: [
    { kind: 'place', prompt: 'Placez **D** (départ), **A** (arrivée) et les postes **P1**, **P3**, **P4** et **P6**.', posts: posts.slice(4) },
    { kind: 'read', prompt: 'Écrivez les coordonnées des postes déjà placés.', posts: posts.slice(0, 4) },
    { kind: 'check', prompt: readPost ? `Quel poste est en **${coordinates(p7)}** ? Cochez la bonne réponse.`
      : `Quelles sont les coordonnées de **${p7.name}** ? Cochez la bonne réponse.`,
      choices: shuffle(rng, [p2, p5, p7, p8].map(post => ({ label: readPost ? post.name : coordinates(post), correct: post === p7 }))) },
    linkQuestion(route, variant),
    { kind: 'text', prompt: `Est-ce que **${p8.name}** se trouve en **${coordinates(target % 2 ? p8 : p7)}** ?`,
      answer: `${target % 2 ? 'Oui' : 'Non'}. ${p8.name} est en ${coordinates(p8)}.` },
    { kind: 'text', prompt: `De **${p2.name}** à **${p5.name}**, de combien de cases au minimum vous déplacez-vous ?`,
      hint: 'Suivez les lignes du quadrillage.', answer: `${caseCount(distance)}.` },
  ] }
}

export function mapQuestionLimit(notation?: RealMapSettings['notation']) {
  return notation === 'coordinates' ? 6 : 8
}

export function mapQuestionCount(notation: RealMapSettings['notation'], count?: number) {
  const max = mapQuestionLimit(notation)
  return typeof count === 'number' && Number.isFinite(count) ? Math.max(4, Math.min(max, Math.round(count))) : max
}

export function realMapPractice({ planId, columns, rows, notation, target, questionCount }: RealMapItem): MapPractice {
  const plan = realMapPlan(planId, realMapGrid(columns, rows))
  const index = plan.places[target] ? target : 0
  const variant = [...plan.id].reduce((sum, letter) => sum + letter.charCodeAt(0), index * 7)
  const useCoordinates = notation === 'coordinates'
  const activity = useCoordinates ? coordinateQuestions(plan, index, variant + 1) : caseQuestions(plan, index, variant)
  const count = mapQuestionCount(notation, questionCount)
  if (count >= activity.questions.length) return activity
  const extra = activity.plan.places[0]?.country ? [2, 5, 4] : [5, 6, 4]
  const offset = variant % extra.length
  const priority = useCoordinates ? [0, 1, 2, 3, 5, 4]
    : [...new Set([0, 1, 3, ...extra.slice(offset), ...extra.slice(0, offset), 7, 6, 2])]
  const included = new Set(priority.filter(index => index < activity.questions.length).slice(0, count))
  return { ...activity, questions: activity.questions.filter((_, index) => included.has(index)) }
}

export function mapPracticeItem(sionMap: RealMapItem): MathItem {
  const { questions } = realMapPractice(sionMap)
  const first = questions[0]!
  const answer = first.kind === 'place' ? first.posts.map(post => `${post.name} ${coordinates(post)}`).join(', ')
    : first.kind === 'text' ? first.answer : ''
  return { layout: 'text', sionMap, prompt: first.prompt.replaceAll('**', ''), answer, noPoints: true }
}
