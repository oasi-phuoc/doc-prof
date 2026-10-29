/**
 * Helpers CO `complet` : une piste (`audio`) ou plusieurs (`audios` + `audio` 1-based).
 */
import type { TcfCoComplet, TcfExercise } from './types'

export function isTcfCoComplet(ex: TcfExercise): ex is TcfCoComplet {
  return ex.competence === 'CO' && ex.type_exercice === 'complet'
}

/** Chemins audio du support (ordre des pistes). */
export function tcfCompletAudioRefs(ex: TcfCoComplet): string[] {
  const many = ex.support.audios?.map((a) => a.trim()).filter(Boolean)
  if (many && many.length > 0) return many
  const one = ex.support.audio?.trim()
  return one ? [one] : []
}

/** Nombre de pistes (0 si aucune). */
export function tcfCompletAudioCount(ex: TcfCoComplet): number {
  return tcfCompletAudioRefs(ex).length
}

/** True si l’exercice a plusieurs pistes découpées. */
export function tcfCompletIsMulti(ex: TcfCoComplet): boolean {
  return (ex.support.audios?.length ?? 0) > 1
}

/** Transcriptions alignées sur les pistes (toujours un tableau). */
export function tcfCompletTranscriptions(ex: TcfCoComplet): string[] {
  const t = ex.support.transcription
  if (Array.isArray(t)) return t.map((s) => s.trim()).filter(Boolean)
  const one = typeof t === 'string' ? t.trim() : ''
  return one ? [one] : []
}

/** Texte corrigé : une transcription, ou plusieurs séparées par une ligne vide. */
export function tcfCompletTranscriptionText(ex: TcfCoComplet): string {
  const parts = tcfCompletTranscriptions(ex)
  if (parts.length <= 1) return parts[0] ?? ''
  return parts
    .map((text, i) => {
      const labeled = /^(Document|Annonce|Dialogue)\s+\d+/i.test(text)
        ? text
        : `Document ${i + 1} — ${text}`
      return labeled
    })
    .join('\n\n')
}
