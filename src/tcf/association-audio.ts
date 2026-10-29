/**
 * Helpers CO `association_images` : une piste ou plusieurs dialogues découpés.
 */
import type { TcfCoAssociation, TcfExercise } from './types'

export function isTcfCoAssociation(ex: TcfExercise): ex is TcfCoAssociation {
  return ex.competence === 'CO' && ex.type_exercice === 'association_images'
}

/** Chemins audio du support (ordre des dialogues). */
export function tcfAssociationAudioRefs(ex: TcfCoAssociation): string[] {
  const many = ex.support.audios?.map((a) => a.trim()).filter(Boolean)
  if (many && many.length > 0) return many
  const one = ex.support.audio?.trim()
  return one ? [one] : []
}

export function tcfAssociationIsMulti(ex: TcfCoAssociation): boolean {
  return (ex.support.audios?.length ?? 0) > 1
}

export function tcfAssociationTranscriptions(ex: TcfCoAssociation): string[] {
  const t = ex.support.transcription
  if (Array.isArray(t)) return t.map((s) => s.trim()).filter(Boolean)
  const one = typeof t === 'string' ? t.trim() : ''
  return one ? [one] : []
}

export function tcfAssociationTranscriptionText(ex: TcfCoAssociation): string {
  const parts = tcfAssociationTranscriptions(ex)
  if (parts.length <= 1) return parts[0] ?? ''
  return parts
    .map((text, i) => {
      const labeled = /^(Dialogue|Message)\s+\d+/i.test(text) ? text : `Dialogue ${i + 1} — ${text}`
      return labeled
    })
    .join('\n\n')
}
