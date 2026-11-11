import { WorksheetImage } from '@/components/WorksheetImage'
import { ceArtFor } from '@/tcf/ce-art'
import type { TcfCeExercise } from '@/tcf/types'

/** Véritable document dessiné : le texte est intégré dans l’image générée. */
export function CePoster({ exercise }: { exercise: TcfCeExercise }) {
  const artwork = ceArtFor(exercise)
  return artwork ? <div className="tcf-ce-art"><WorksheetImage src={artwork.src} alt={artwork.label} /></div> : null
}
