import { formatSwissFrancs } from './money-change'
import { int, type Rng } from './rng'
import type { Difficulty, MathItem } from './types'

export const SHORT_PROBLEM_HOURS = 'problemes-courts-horaires'
export const SHORT_PROBLEM_PRICES = 'problemes-courts-prix'
export const SHORT_PROBLEM_DISTANCES = 'problemes-courts-distances'

type ShortProblemType = typeof SHORT_PROBLEM_HOURS | typeof SHORT_PROBLEM_PRICES | typeof SHORT_PROBLEM_DISTANCES

type Fact = { label: string; value: string }
export type ShortProblemDiagram = {
  connector: '→' | '+'
  rows: { label?: string; facts: Fact[] }[]
}

export type ShortProblem = {
  type: ShortProblemType
  difficulty: Difficulty
  variant: number
  guided: boolean
  diagram: ShortProblemDiagram
}

type ShortProblemContext = Omit<ShortProblem, 'diagram'>
type Values = Record<string, number>
type ProblemDetails = {
  prompt: string[]
  calculation: string
  response: string
  diagram: ShortProblemDiagram
  exampleDiagram?: ShortProblemDiagram
  labels: Record<string, string>
}

export function isShortProblemType(type: string): type is ShortProblemType {
  return type === SHORT_PROBLEM_HOURS || type === SHORT_PROBLEM_PRICES || type === SHORT_PROBLEM_DISTANCES
}

const vehicles = ['Le bus', 'Le train', 'Le tram'] as const
const purchases = [
  { name: 'Camille', first: 'Un sandwich', second: 'Un jus' },
  { name: 'Samira', first: 'Un cahier', second: 'Un stylo' },
  { name: 'Noé', first: 'Une soupe', second: 'Un dessert' },
] as const
const routes = [
  { start: 'École', stop: 'Parc', end: 'Piscine' },
  { start: 'Gare', stop: 'Pont', end: 'Stade' },
  { start: 'Maison', stop: 'Place', end: 'École' },
] as const

function clock(minutes: number): string {
  return `${Math.floor(minutes / 60)} h ${String(minutes % 60).padStart(2, '0')}`
}

function hours({ variant }: ShortProblemContext, { hour, minute, duration }: Values): ProblemDetails | undefined {
  const departure = hour! * 60 + minute!
  const arrival = departure + duration!
  if (!Number.isInteger(hour) || hour! < 0 || hour! > 23 || !Number.isInteger(minute) || minute! < 0 || minute! > 59 ||
      !Number.isInteger(duration) || duration! < 1 || duration! >= 60 || arrival >= 1440) return undefined

  const vehicle = vehicles[variant]!
  const start = clock(departure)
  const end = clock(arrival)
  const beforeHour = 60 - minute!
  const afterHour = duration! - beforeHour
  const nextHour = clock(departure + beforeHour)
  const calculation = afterHour > 0
    ? `Il faut ${beforeHour} min pour arriver à ${nextHour}.\n${beforeHour} min + ${afterHour} min = ${duration} min.`
    : `${minute! + duration!} min − ${minute} min = ${duration} min.`
  const startFact = { label: 'Départ', value: start }
  const endFact = { label: 'Arrivée', value: end }
  return {
    prompt: [`${vehicle} part à ${start}.`, `Il arrive à ${end}.`, 'Combien de minutes dure le trajet ?'],
    calculation, response: `Le trajet dure ${duration} min.`,
    diagram: { connector: '→', rows: [{ facts: [startFact, endFact] }] },
    exampleDiagram: afterHour > 0 ? { connector: '→', rows: [{ facts: [startFact, { label: 'Heure suivante', value: nextHour }, endFact] }] } : undefined,
    labels: { hour: 'Heure de départ', minute: 'Minute de départ', duration: 'Durée en min' },
  }
}

function prices({ variant }: ShortProblemContext, { first, second }: Values): ProblemDetails | undefined {
  if (![first, second].every(value => value! > 0 && value! < 100 && Math.abs(value! * 100 - Math.round(value! * 100)) < 1e-8)) return undefined
  const purchase = purchases[variant]!
  const firstPrice = `${formatSwissFrancs(first!)} CHF`
  const secondPrice = `${formatSwissFrancs(second!)} CHF`
  const total = `${formatSwissFrancs((Math.round(first! * 100) + Math.round(second! * 100)) / 100)} CHF`
  return {
    prompt: [`${purchase.first} coûte ${firstPrice}.`, `${purchase.second} coûte ${secondPrice}.`, `Combien paie ${purchase.name} pour les deux ?`],
    calculation: `${firstPrice} + ${secondPrice} = ${total}.`, response: `${purchase.name} paie ${total}.`,
    diagram: { connector: '+', rows: [{ facts: [{ label: purchase.first, value: firstPrice }, { label: purchase.second, value: secondPrice }] }] },
    labels: { first: 'Premier prix en CHF', second: 'Deuxième prix en CHF' },
  }
}

function distances({ difficulty, variant }: ShortProblemContext, { first, second, third, fourth }: Values): ProblemDetails | undefined {
  const compare = difficulty === 'avance'
  const mixed = difficulty === 'moyen'
  if (!(compare ? [first, second, third, fourth] : [first, second]).every(value => Number.isInteger(value) && value! > 0 && value! <= 9999) ||
      (mixed && first! > 9)) return undefined

  const firstMetres = mixed ? first! * 1000 : first!
  const firstLabel = `${first} ${mixed ? 'km' : 'm'}`
  const total = firstMetres + second!
  const sum = `${firstMetres} m + ${second} m = ${total} m.`
  const route = routes[variant]!
  if (compare) {
    const otherTotal = third! + fourth!
    const shorter = total < otherTotal ? 'A' : 'B'
    const shortest = Math.min(total, otherTotal)
    return {
      prompt: [`${route.start} → ${route.end}`, `Trajet A — ${firstLabel}, puis ${second} m.`, `Trajet B — ${third} m, puis ${fourth} m.`, 'Quel trajet est le plus court ?'],
      calculation: `A — ${sum}\nB — ${third} m + ${fourth} m = ${otherTotal} m.`,
      response: total === otherTotal ? `Les deux trajets mesurent ${total} m.` : `Le trajet ${shorter} est plus court avec ${shortest} m.`,
      diagram: { connector: '→', rows: [
        { label: 'Trajet A', facts: [{ label: '1ʳᵉ partie', value: firstLabel }, { label: '2ᵉ partie', value: `${second} m` }] },
        { label: 'Trajet B', facts: [{ label: '1ʳᵉ partie', value: `${third} m` }, { label: '2ᵉ partie', value: `${fourth} m` }] },
      ] },
      labels: { first: 'Début du trajet A en m', second: 'Fin du trajet A en m', third: 'Début du trajet B en m', fourth: 'Fin du trajet B en m' },
    }
  }
  const firstLeg = `${route.start} → ${route.stop}`
  const lastLeg = `${route.stop} → ${route.end}`
  return {
    prompt: [`${firstLeg} — ${firstLabel}.`, `${lastLeg} — ${second} m.`, 'Quelle est la distance totale en mètres ?'],
    calculation: mixed ? `${firstLabel} = ${firstMetres} m.\n${sum}` : sum,
    response: `Le trajet mesure ${total} m.`,
    diagram: { connector: '→', rows: [{ facts: [{ label: firstLeg, value: firstLabel }, { label: lastLeg, value: `${second} m` }] }] },
    labels: { first: `Première distance en ${mixed ? 'km' : 'm'}`, second: 'Deuxième distance en m' },
  }
}

const builders = { [SHORT_PROBLEM_HOURS]: hours, [SHORT_PROBLEM_PRICES]: prices, [SHORT_PROBLEM_DISTANCES]: distances }

export function rebuildShortProblem(context: ShortProblemContext, values: Values): MathItem | undefined {
  const details = builders[context.type](context, values)
  if (!details) return undefined
  return {
    layout: 'text', prompt: details.prompt.join('\n'),
    calcAnswer: details.calculation, responseAnswer: details.response, answer: details.response,
    problemVars: values,
    problemVarDefs: Object.entries(details.labels).map(([key, label]) => ({ key, label, editOn: 'both' })),
    shortProblem: {
      type: context.type, difficulty: context.difficulty, variant: context.variant, guided: context.guided,
      diagram: details.diagram,
    },
  }
}

function generateValues(type: ShortProblemType, difficulty: Difficulty, rng: Rng): Values {
  if (type === SHORT_PROBLEM_HOURS) {
    const hour = int(rng, 6, 17)
    if (difficulty === 'facile') return { hour, minute: 5 * int(rng, 0, 6), duration: 5 * int(rng, 2, 5) }
    if (difficulty === 'moyen') return { hour, minute: 5 * int(rng, 8, 11), duration: 5 * int(rng, 5, 9) }
    return { hour, minute: 5 * int(rng, 8, 11) + int(rng, 1, 4), duration: int(rng, 22, 48) }
  }
  if (type === SHORT_PROBLEM_PRICES) {
    const francs = [int(rng, 3, 11), int(rng, 2, 8)]
    const cents = () => difficulty === 'facile' ? 0 : difficulty === 'moyen' ? 5 * int(rng, 1, 9) : 5 * int(rng, 11, 19)
    return { first: (100 * francs[0]! + cents()) / 100, second: (100 * francs[1]! + cents()) / 100 }
  }
  const second = 10 * int(rng, 11, 95)
  if (difficulty === 'moyen') return { first: int(rng, 1, 4), second }
  const first = 10 * int(rng, 9, 70)
  if (difficulty === 'facile') return { first, second }
  return { first, second, third: first + 10 * int(rng, -3, 3), fourth: second + (rng() < 0.5 ? -1 : 1) * 10 * int(rng, 4, 9) }
}

export function tryGenerateShortProblems(type: string, rng: Rng, count: number, difficulty: Difficulty): MathItem[] | undefined {
  if (!isShortProblemType(type)) return undefined
  const firstVariant = int(rng, 0, vehicles.length - 1)
  return Array.from({ length: count }, (_, index) => rebuildShortProblem({
    type, difficulty, variant: (firstVariant + index) % vehicles.length, guided: index === 0,
  }, generateValues(type, difficulty, rng))!)
}

const examples = {
  [SHORT_PROBLEM_HOURS]: {
    facile: { hour: 8, minute: 10, duration: 15 },
    moyen: { hour: 8, minute: 50, duration: 25 },
    avance: { hour: 8, minute: 47, duration: 29 },
  },
  [SHORT_PROBLEM_PRICES]: {
    facile: { first: 4, second: 2 },
    moyen: { first: 4.3, second: 2.25 },
    avance: { first: 4.65, second: 2.55 },
  },
  [SHORT_PROBLEM_DISTANCES]: {
    facile: { first: 200, second: 350 },
    moyen: { first: 1, second: 350 },
    avance: { first: 200, second: 350, third: 180, fourth: 400 },
  },
}

export function shortProblemExample({ type, difficulty }: ShortProblem) {
  return builders[type]({ type, difficulty, variant: 0, guided: true }, examples[type][difficulty])!
}
