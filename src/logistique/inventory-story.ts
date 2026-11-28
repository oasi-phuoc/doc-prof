import type { LogistiqueAssessment, LogistiqueStory } from './evaluation'

export type LogistiqueStoryStep = {
  passage: string
  prompt: string
  calculation: string
  answer: string
  points: number
  assessment: LogistiqueAssessment
}

export const inventoryStoryModules = ['701', '406', '601'] as const

export const initialInventoryStory: LogistiqueStory & { template: 'inventaire' } = {
  template: 'inventaire', company: 'Entrepôt du Rhône', article: 'bacs de pièces',
  expected: 88, received: 84, held: 24, ordered: 58,
}

export function inventoryStorySteps(story: LogistiqueStory): Record<(typeof inventoryStoryModules)[number], LogistiqueStoryStep> {
  const difference = story.received - story.expected
  const fromOlder = Math.min(story.held, story.ordered)
  const newer = story.received - story.held
  const fromNewer = Math.min(newer, story.ordered - fromOlder)
  const prepared = fromOlder + fromNewer
  const left = story.received - prepared
  const shortage = story.ordered - prepared
  const units = (quantity: number) => `${quantity} unité${quantity === 1 ? '' : 's'}`
  return {
    '701': {
      passage: 'Vous contrôlez le relevé d’inventaire.',
      prompt: `Le stock théorique est de ${units(story.expected)}. Vous en comptez ${story.received}. Calculez l’écart (réel − théorique) et interprétez-le.`,
      calculation: `${story.received} − ${story.expected} = ${difference}`,
      answer: difference === 0 ? 'Les deux stocks concordent.'
        : `Le stock réel compte ${units(Math.abs(difference))} de ${difference > 0 ? 'plus' : 'moins'}.`,
      points: 3,
      assessment: { bloom: 'appliquer', difficulty: 'facile', minutes: 3,
        objective: '701 — Interpréter un écart d’inventaire', criteria: 'Signe, grandeur et sens de l’écart.' },
    },
    '406': {
      passage: 'Vous répartissez ensuite le prélèvement selon FIFO.',
      prompt: `Le stock réel est de ${units(story.received)}. Le lot du 5 juin en contient ${story.held} et le lot du 9 juin contient le reste. La commande demande ${units(story.ordered)}. Combien prélevez-vous dans chaque lot, dans l’ordre FIFO ?`,
      calculation: `Lot du 5 juin : minimum de ${story.held} et ${story.ordered} = ${fromOlder}\nLot du 9 juin : minimum de ${newer} et ${story.ordered - fromOlder} = ${fromNewer}`,
      answer: `Vous prélevez ${units(fromOlder)} dans le lot du 5 juin, puis ${units(fromNewer)} dans le lot du 9 juin.`,
      points: 4,
      assessment: { bloom: 'appliquer', difficulty: 'moyen', minutes: 5,
        objective: '406 — Répartir le prélèvement selon FIFO', criteria: 'Lot le plus ancien traité en premier et prélèvements compatibles avec les deux stocks.' },
    },
    '601': {
      passage: 'Vous terminez la commande et mettez le stock à jour.',
      prompt: `Vous disposez de ${units(story.received)}. La commande en demande ${story.ordered}. Calculez la quantité que vous pouvez préparer, le stock qui restera et le nombre d’unités encore à livrer.`,
      calculation: `Préparé : minimum de ${story.received} et ${story.ordered} = ${prepared}\nReste en stock : ${story.received} − ${prepared} = ${left}\nReste à livrer : ${story.ordered} − ${prepared} = ${shortage}`,
      answer: `Vous préparez ${units(prepared)}. Il reste ${units(left)} en stock et ${units(shortage)} à livrer.`,
      points: 3,
      assessment: { bloom: 'appliquer', difficulty: 'moyen', minutes: 4,
        objective: '601 — Clôturer un prélèvement', criteria: 'Quantité préparée, stock restant et reliquat de commande exacts.' },
    },
  }
}
