import { isTpfFamilyDomain, tcfSlotByTypeId } from '@/tcf/catalog'
import type { Domain } from '@/math/types'
import type { SheetFormat } from '../sheet-format'

export function liveEditorProfile(domain: Domain, exerciseType: string, format: SheetFormat) {
  if (domain === 'algèbre' && exerciseType === 'addition-ligne' && format === 'a4-portrait') return 'addition'
  if (isTpfFamilyDomain(domain)) {
    const slot = tcfSlotByTypeId[exerciseType]
    if (slot?.competence === 'CE') return 'document'
    if (slot?.competence === 'CO' && slot.numero === 1) return 'audio-qcm'
  }
  return null
}
