import type { Domain } from '@/math/types'
import { TCM_CSC_DOMAIN } from './catalog'

export const TCM_CSC_DOCUMENT_TITLE = 'Test de connaissance de mathématiques — CSC'
export const TCM_CSC_MAX_SCORE = 82

export function isTcmCscDomain(domain: Domain | undefined): boolean {
  return domain === TCM_CSC_DOMAIN
}

export function isTcmCscConsignesType(exerciseType: string | undefined): boolean {
  return exerciseType === 'tcm-csc-consignes'
}
