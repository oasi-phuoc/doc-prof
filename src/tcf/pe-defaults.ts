/**
 * Barème et détails par défaut des emplacements PE CSC (ex. 10–13).
 */
import { tcfSlotByTypeId } from './catalog'

export const TCF_PE_MOTS_CLES_DETAIL =
  '1 point par mot correctement écrit ; 0,5 point si le mot est écrit incorrectement mais la prononciation est correcte.'

export const TCF_PE_TEXTE_IMAGES_CONSIGNE =
  'Complétez le texte à l’aide des images. Écrivez les mots correctement.'

/** Largeur du trait inline pour texte à images (px). */
export const TCF_PE_TEXTE_IMAGES_BLANK_PX = 150

export function tcfPeSlotDefaults(typeId: string): {
  pointsPerQuestion: number
  tcfPointsDetail?: string
  inlineBlankPx?: number
} | null {
  const slot = tcfSlotByTypeId[typeId]
  if (!slot || slot.competence !== 'PE' || slot.numero == null) return null
  if (slot.numero === 1) return { pointsPerQuestion: 5 }
  if (slot.numero === 2) {
    return {
      pointsPerQuestion: 5,
      tcfPointsDetail: TCF_PE_MOTS_CLES_DETAIL,
      inlineBlankPx: TCF_PE_TEXTE_IMAGES_BLANK_PX,
    }
  }
  if (slot.numero === 3) return { pointsPerQuestion: 5 }
  if (slot.numero === 4) return { pointsPerQuestion: 10 }
  return null
}
