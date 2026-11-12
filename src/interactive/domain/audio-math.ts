import type { MathItem } from '@/math/types'
import { numberAudioParts, mulAudioParts } from '@/tcm-cfr/audio-nombres'
import { cscCalculationParts, cscNumberParts } from '@/tcm-csc/items'
import { MAX_AUDIO_PARTS } from './audio'

type NumericAudio = { value: number; parts: string[]; prompt: string; model: string } | { reason: string }
const integer = (n: number, max: number) => Number.isInteger(n) && n >= 1 && n <= max
const unsigned = (text: string) => /^(?:0|[1-9]\d{0,6})$/.test(text) ? Number(text) : NaN

/** Verify the complete source recording against the generator's number lexicon. */
export function verifiedNumericAudio(item: MathItem): NumericAudio | undefined {
  if (item.layout !== 'audio-dictation') return undefined
  const parts = item.audioParts ?? (item.audioSrc ? [item.audioSrc] : [])
  const value = unsigned(item.answer.trim())
  if (!parts.length || parts.length > MAX_AUDIO_PARTS || parts.some((part) => typeof part !== 'string' || !part) || item.audioSrc && item.audioSrc !== parts[0] || !Number.isSafeInteger(value)) return { reason: 'La dictée audio ne possède pas une piste complète et un corrigé numérique vérifiable.' }
  let expected: string[], model: string, calculation = false
  const task = item.cscTask
  if (task?.kind === 'calculation-audio') {
    if (!integer(task.a, 100) || !integer(task.b, 100) || !['+', '−'].includes(task.operation)) return { reason: 'Les nombres du calcul oral CSC ne sont pas valides.' }
    const result = task.operation === '+' ? task.a + task.b : task.a - task.b
    if (result < 0 || result > 100 || result !== value) return { reason: 'Le calcul oral et son corrigé CSC ne correspondent plus.' }
    expected = cscCalculationParts(task.a, task.b, task.operation)
    model = `${task.a} ${task.operation} ${task.b} = ${value}`
    calculation = true
  } else if (item.left !== undefined || item.right !== undefined) {
    const a = unsigned(item.left?.trim() ?? ''), b = unsigned(item.right?.trim() ?? '')
    if (!integer(a, 1000) || !integer(b, 1000) || a * b !== value) return { reason: 'La multiplication orale et son corrigé ne correspondent plus.' }
    expected = mulAudioParts(a, b)
    model = `${a} × ${b} = ${value}`
    calculation = true
  } else {
    if (value < 0 || value > 1000) return { reason: 'Ce nombre ne fait pas partie du lexique audio vérifiable de 0 à 1 000.' }
    expected = cscNumberParts(value)
    // Use the original number composer for numbers above the CSC range too.
    if (value > 0) expected = numberAudioParts(value)
    model = String(value)
  }
  if (JSON.stringify(parts) !== JSON.stringify(expected)) return { reason: 'Les extraits audio ne correspondent plus au nombre ou au calcul de la fiche.' }
  return { value, parts: [...parts], model, prompt: calculation ? 'Quel est le résultat du calcul entendu ?' : 'Quel nombre entends-tu ?' }
}
