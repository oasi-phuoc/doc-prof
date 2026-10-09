/**
 * TCM CSC — page Informations (exercices à venir).
 */
import type { Domain, PageConfig } from '@/math/types'
import { exerciseTypeById } from '@/math/catalog'
import { TCM_CSC_DOMAIN } from './catalog'

export const TCM_CSC_DOCUMENT_TITLE = 'Test de connaissance de mathématiques — CSC'

export function isTcmCscDomain(domain: Domain | undefined): boolean {
  return domain === TCM_CSC_DOMAIN
}

export function isTcmCscConsignesType(exerciseType: string | undefined): boolean {
  return exerciseType === 'tcm-csc-consignes'
}

function buildConsignesPage(): PageConfig {
  const type = exerciseTypeById['tcm-csc-consignes']
  if (!type) throw new Error('TCM CSC : type tcm-csc-consignes manquant')
  return {
    domain: TCM_CSC_DOMAIN,
    topic: type.topic,
    exerciseType: type.id,
    difficulty: 'moyen',
    count: 1,
    columns: 1,
    pointsPerQuestion: 0,
  }
}

/** Pour l’instant : page Informations seule (exercices à préparer). */
export function buildTcmCscTestPages(): PageConfig[] {
  return [buildConsignesPage()]
}
