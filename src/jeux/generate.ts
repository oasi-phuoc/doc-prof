import type { MathItem } from '@/math/types'
import { exerciseTypeById } from '@/math/catalog'

export type JeuxBatch = {
  items: MathItem[]
  instruction: string
  preferredColumns?: number
}

/** Types connus du domaine Jeux (catalogue phase 0). */
const JEUX_TYPE_IDS = new Set([
  'jeux-vocabulaire',
  'jeux-vrai-faux',
  'jeux-devinettes',
  'jeux-memory',
  'jeux-loto',
  'jeux-intrus',
  'jeux-dominos',
  'jeux-tri',
  'jeux-sept-familles',
  'jeux-plateau',
  'jeux-de-roue',
  'jeux-bandes-mots',
  'jeux-phrases-texte',
])

/**
 * Placeholder déterministe tant que le moteur CardGrid / saisie n’est pas branché.
 * Voir `docs/plan-domaine-jeux.md` (phases 1+).
 */
export function tryGenerateJeuxBatch(typeId: string): JeuxBatch | null {
  if (!JEUX_TYPE_IDS.has(typeId) && !typeId.startsWith('jeux-')) return null
  const type = exerciseTypeById[typeId]
  const label = type?.label ?? 'Jeu'
  return {
    instruction: type?.instruction ?? 'Préparez le jeu.',
    preferredColumns: 1,
    items: [
      {
        layout: 'text',
        prompt: `${label} — modèle en cours d’implémentation. Le template définira la grille et les cartes ; vous saisirez uniquement les mots et images. Voir le planning domaine Jeux.`,
        answer: '',
      },
    ],
  }
}
