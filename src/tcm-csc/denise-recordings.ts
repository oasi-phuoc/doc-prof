import manifest from './denise-recordings.json'

export const CSC_DENISE_DIRECTORY = '/lib/audio/tcm-csc/denise'
const required = ['consigne-nombres.mp3', 'consigne-calculs.mp3', 'lettre-a.mp3', 'lettre-b.mp3', 'lettre-c.mp3', 'lettre-d.mp3', 'lettre-e.mp3', 'plus.mp3', 'moins.mp3']
export function cscDeniseRecordingsReady(value: unknown = manifest): boolean {
  const pack = value as { status?: string; voice?: string; rate?: string; volume?: string; pitch?: string; sampleRate?: number; channels?: number; files?: { filename: string; sha256?: string; bytes?: number; duration?: number; sampleRate?: number; channels?: number }[] } | null
  return !!pack && pack.status === 'generated' && pack.voice === 'fr-FR-DeniseNeural' && pack.rate === '-25%' && pack.volume === '+0%' && pack.pitch === '+0Hz' && pack.sampleRate === 24000 && pack.channels === 1 && Array.isArray(pack.files) && pack.files.length === required.length && required.every(name => pack.files!.filter(file => file.filename === name && /^[a-f0-9]{64}$/.test(file.sha256 ?? '') && (file.bytes ?? 0) > 500 && (file.duration ?? 0) > 0.1 && file.sampleRate === 24000 && file.channels === 1).length === 1)
}
export const cscDeniseOperator = (operator: 'plus' | 'moins') => cscDeniseRecordingsReady() ? `${CSC_DENISE_DIRECTORY}/${operator}.mp3` : `/lib/audio/nombre/${operator}.mp3`
