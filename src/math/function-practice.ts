import { int, pick, type Rng } from './rng'
import type { Difficulty, MathItem } from './types'

function tableAndGraph(rng: Rng, index: number, difficulty: Difficulty): MathItem {
  const startHour = int(rng, 7, 10)
  const start = int(rng, 2, 4)
  const peak = start + int(rng, 3, 7)
  const values = [
    start, start + int(rng, 1, 2), peak, peak - int(rng, 1, 3), peak - int(rng, 2, 4),
  ]
  const pairs = values.map((y, i) => ({ x: startHour + i, y }))
  const task = index % 2 === 0 ? 'read' : 'plot'
  const yStep = difficulty === 'facile' ? 1 : 2
  return {
    layout: 'text',
    graphPractice: { pairs, task, yStep },
    prompt: task === 'read'
      ? 'Lisez les températures sur le graphique. Complétez le tableau.'
      : 'Placez les points du tableau sur le graphique. Reliez-les dans l’ordre des heures.',
    answer: pairs.map(({ x, y }) => `${x} h : ${y} °C`).join(' · '),
  }
}

function proportionOrAffine(rng: Rng, index: number): MathItem {
  const proportional = index % 2 === 0
  const rate = int(rng, 2, 7)
  const fee = proportional ? 0 : int(rng, 2, 8)
  const context = pick(rng, [
    { per: 'billet', plural: 'billets' },
    { per: 'jeu', plural: 'jeux' },
    { per: 'photo', plural: 'photos' },
  ])
  return {
    layout: 'text',
    functionPairs: [0, 1, 2, 4].map((x) => ({ x, y: rate * x + fee })),
    prompt: `Prix par ${context.per} : ${rate} CHF.${fee ? ` Frais fixes : ${fee} CHF.` : ''} x est le nombre de ${context.plural}. Donnez le prix y. Est-il proportionnel à x ? Expliquez.`,
    answer: fee
      ? `Non. y = ${rate}x + ${fee}. C’est une relation affine. Pour x = 0, y vaut ${fee} CHF.`
      : `Oui. y = ${rate}x. On multiplie toujours x par ${rate}. La droite passe par (0 ; 0).`,
  }
}

export function tryGenerateFunctionPractice(
  typeId: string, rng: Rng, count: number, difficulty: Difficulty,
): MathItem[] | undefined {
  if (typeId !== 'fonctions-graphe-tableau' && typeId !== 'fonctions-proportion-affine') return undefined
  const start = int(rng, 0, 1)
  const build = typeId === 'fonctions-graphe-tableau' ? tableAndGraph : proportionOrAffine
  return Array.from({ length: count }, (_, index) => build(rng, start + index, difficulty))
}
