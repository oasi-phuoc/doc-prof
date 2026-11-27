import type { ExerciseType, Topic } from '@/math/types'
import { SOCIETE_UNITS } from './parcours'

export const SOCIETE_DOMAIN = 'société' as const
export const SOCIETE_FIRST_TOPIC = 'societe-voisins'

export const SOCIETE_KINDS = [
  ['theorie', 'Théorie', 'Lisez la fiche.'],
  ['lexique', 'Lexique', 'Lisez les mots et leur définition.'],
  ['ce', 'Compréhension écrite', 'Lisez le document. Répondez aux questions.'],
  ['co', 'Compréhension orale', 'Écoutez deux fois. Répondez aux questions.'],
  ['po', 'Production orale', 'Préparez vos idées. Jouez la situation à deux.'],
  ['pe', 'Production écrite', 'Écrivez le message demandé.'],
] as const

export const SOCIETE_TOPICS: Topic[] = SOCIETE_UNITS.map((unite) => ({
  id: `societe-${unite.id}`,
  label: `${unite.niveau} · ${unite.titre}`,
  domain: SOCIETE_DOMAIN,
}))

export const SOCIETE_EXERCISE_TYPES: ExerciseType[] = SOCIETE_UNITS.flatMap((unite) => {
  const topic = `societe-${unite.id}`
  return SOCIETE_KINDS.map(([kind, label, instruction]) => ({
    id: `${topic}-${kind}`,
    topic,
    label,
    description: unite.objectif,
    instruction,
    visual: 'texte',
    preferredColumns: 1,
    preferredCount: 1,
    maxCount: 1,
    supportsNumberRange: false,
  }))
})
