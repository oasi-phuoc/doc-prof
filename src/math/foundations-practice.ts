import { fmt } from './column-arith'
import type { NumberRange } from './difficulty'
import { formatSwissFrancs } from './money-change'
import { int, pick, shuffle, type Rng } from './rng'
import type { Difficulty, MathItem } from './types'

function baseTenCollections(rng: Rng, count: number, difficulty: Difficulty, range?: NumberRange): MathItem[] {
  const min = range ? Math.max(1, Math.ceil(range.min)) : difficulty === 'facile' ? 10 : 100
  const max = range ? Math.min(999, Math.floor(range.max)) : difficulty === 'facile' ? 99 : difficulty === 'moyen' ? 499 : 999
  if (min > max) return [{
    layout: 'text',
    prompt: 'Choisissez une plage comprenant un nombre entier de 1 à 999.',
    answer: '',
  }]
  return Array.from({ length: count }, () => {
    const value = int(rng, min, max)
    const completeTens = Math.floor(value / 10)
    return {
      layout: 'text',
      baseTen: {
        hundreds: Math.floor(value / 100),
        tens: completeTens % 10,
        ones: value % 10,
      },
      answer: `${value} unité${value === 1 ? '' : 's'} · ${completeTens} dizaine${completeTens <= 1 ? ' complète' : 's complètes'}`,
    }
  })
}

function numbersBetween(rng: Rng, count: number, difficulty: Difficulty, range?: NumberRange): MathItem[] {
  const scale = range?.decimals ? 10 : 1
  const min = range ? Math.max(0, Math.ceil(range.min * scale - 1e-9)) : 0
  const max = range ? Math.min(999_999 * scale, Math.floor(range.max * scale + 1e-9)) : { facile: 50, moyen: 500, avance: 5000 }[difficulty]
  if (max - min < 2) return [{
    layout: 'text',
    prompt: scale === 10 ? 'Élargissez la plage pour obtenir trois dixièmes distincts.' : 'Élargissez la plage pour obtenir trois entiers distincts.',
    answer: '',
  }]
  return Array.from({ length: count }, () => {
    const width = int(rng, 2, Math.min(max - min, difficulty === 'facile' ? 5 : 10))
    const left = int(rng, min, max - width)
    const right = left + width
    const sample = left + int(rng, 1, width - 1)
    const bounds = `${fmt(left / scale)} et ${fmt(right / scale)}`
    const step = scale === 10 ? 'Utilisez au plus une décimale.' : 'Écrivez un entier.'
    return {
      layout: 'text',
      prompt: `Entre ${bounds}. ${step}`,
      answer: `${fmt(sample / scale)}${width > 2 ? ' (exemple)' : ''}`,
    }
  })
}

const operations = [
  {
    symbol: '+',
    name: 'addition',
    prompt: (a: number, b: number, extra: number) =>
      `La bibliothèque reçoit ${a} romans et ${b} bandes dessinées. Elle ouvre à ${extra} h. Combien de livres reçoit-elle ?`,
  },
  {
    symbol: '−',
    name: 'soustraction',
    prompt: (a: number, b: number, extra: number) =>
      `À l’arrêt n° ${extra}, ${b} des ${a} passagers descendent du bus. Combien de passagers restent dans le bus ?`,
  },
  {
    symbol: '×',
    name: 'multiplication',
    prompt: (a: number, b: number, extra: number) =>
      `Nora prépare ${a} sachets de ${b} billes. Elle utilise ${extra} couleurs d’étiquettes. Combien de billes met-elle dans les sachets ?`,
  },
  {
    symbol: '÷',
    name: 'division',
    prompt: (a: number, b: number, extra: number) =>
      `Pour un atelier de ${extra} minutes, Sami répartit ${a} feuilles à parts égales entre ${b} groupes. Combien de feuilles reçoit chaque groupe ?`,
  },
] as const

function chooseOperation(rng: Rng, count: number, difficulty: Difficulty): MathItem[] {
  const order = shuffle(rng, operations)
  return Array.from({ length: count }, (_, i) => {
    const { symbol, name, prompt } = order[i % order.length]!
    const limit = difficulty === 'facile' ? 6 : difficulty === 'moyen' ? 9 : 12
    const b = int(rng, 2, limit)
    const value = int(rng, 2, limit)
    const a = symbol === '÷' ? value * b : symbol === '−' ? value + b : value
    const distractors = (symbol === '+' ? [8, 9, 10, 11] : symbol === '×' ? [2, 3, 4, 5] : [15, 20, 25, 30])
      .filter((extra) => extra !== a && extra !== b)
    return {
      layout: 'text',
      prompt: prompt(a, b, pick(rng, distractors)),
      answer: `${a} et ${b} · ${name} (${a} ${symbol} ${b})`,
    }
  })
}

const menu = [
  { label: 'Soupe', min: 450, max: 650 },
  { label: 'Salade', min: 550, max: 850 },
  { label: 'Sandwich', min: 650, max: 950 },
  { label: 'Tarte', min: 350, max: 650 },
  { label: 'Jus de pomme', min: 250, max: 450 },
  { label: 'Chocolat chaud', min: 350, max: 550 },
] as const

export function formatMenuPrice(cents: number): string {
  return formatSwissFrancs(cents / 100)
}

function menuProblem(rng: Rng, difficulty: Difficulty): MathItem {
  const priceStep = difficulty === 'facile' ? 50 : 10
  const prices = shuffle(rng, menu).slice(0, 4).map(({ label, min, max }) => ({
    label,
    cents: int(rng, Math.ceil(min / priceStep), Math.floor(max / priceStep)) * priceStep,
  }))
  const order = shuffle(rng, prices).slice(0, 2).map((dish, index) => ({
    ...dish,
    quantity: index === 0 && difficulty !== 'facile' ? int(rng, 2, 3) : 1,
  }))
  const total = order.reduce((sum, dish) => sum + dish.cents * dish.quantity, 0)
  const payment = difficulty === 'avance' ? (total < 2000 ? 2000 : 5000) : undefined
  const amount = payment === undefined ? total : payment - total
  const calculation = order.map(({ cents, quantity }) =>
    quantity === 1 ? formatMenuPrice(cents) : `${quantity} × ${formatMenuPrice(cents)}`,
  ).join(' + ')
  const calculationWithPayment = payment === undefined ? calculation : `${formatMenuPrice(payment)} − (${calculation})`
  const orderText = order.map(({ label, quantity }) => `${label} × ${quantity}`).join(' et ')
  return {
    layout: 'text',
    menuPrices: prices,
    prompt: payment === undefined
      ? `Commande de Camille : ${orderText}. Quel est le total à payer ?`
      : `Commande de Camille : ${orderText}. Camille paie avec un billet de ${payment / 100} CHF. Combien faut-il lui rendre ?`,
    calcAnswer: `${calculationWithPayment} = ${formatMenuPrice(amount)}`,
    responseAnswer: `${formatMenuPrice(amount)} CHF`,
    answer: `${formatMenuPrice(amount)} CHF`,
  }
}

function compareLengths(rng: Rng, difficulty: Difficulty): MathItem {
  const limit = difficulty === 'facile' ? 6 : 10
  const a = int(rng, 2, limit)
  const b = int(rng, 2, limit)
  const relation = a === b ? '=' : a > b ? '>' : '<'
  return {
    layout: 'text',
    lengthUnits: { a, b },
    prompt: 'Écrivez les deux longueurs en étalons, puis comparez avec <, = ou >.',
    answer: `A : ${a} · B : ${b} · A ${relation} B`,
  }
}

export function tryGenerateMathFoundations(
  typeId: string,
  rng: Rng,
  count: number,
  difficulty: Difficulty,
  range?: NumberRange,
): MathItem[] | null {
  switch (typeId) {
    case 'nombres-groupements':
      return baseTenCollections(rng, count, difficulty, range)
    case 'nombres-intercaler':
      return numbersBetween(rng, count, difficulty, range)
    case 'problemes-donnees-utiles':
      return chooseOperation(rng, count, difficulty)
    case 'problemes-lire-menu':
      return Array.from({ length: count }, () => menuProblem(rng, difficulty))
    case 'mesures-etalon':
      return Array.from({ length: count }, () => compareLengths(rng, difficulty))
    default:
      return null
  }
}
