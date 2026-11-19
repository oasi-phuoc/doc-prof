import manifest from './denise-recordings.json'

export const CSC_DENISE_DIRECTORY = '/lib/audio/tcm-csc/denise'
const required = ['consigne-entourer.mp3', 'consigne-nombres.mp3', 'consigne-calculs.mp3', 'consigne-multiplications.mp3', 'consigne-entourer-35.mp3', 'consigne-entourer-50.mp3', 'consigne-nombres-35.mp3', 'consigne-nombres-50.mp3', 'consigne-calculs-35.mp3', 'consigne-calculs-50.mp3', 'consigne-nombres-annonce.mp3', 'consigne-nombres-annonce-35.mp3', 'consigne-nombres-annonce-50.mp3', 'ecoute-1.mp3', 'ecoute-1-35.mp3', 'ecoute-1-50.mp3', 'ecoute-2.mp3', 'ecoute-2-35.mp3', 'ecoute-2-50.mp3', 'lettre-a.mp3', 'lettre-b.mp3', 'lettre-c.mp3', 'lettre-d.mp3', 'lettre-e.mp3', 'lettre-f.mp3', 'lettre-g.mp3', 'lettre-h.mp3', 'lettre-i.mp3', 'lettre-j.mp3', 'lettre-k.mp3', 'lettre-l.mp3', 'plus.mp3', 'moins.mp3', 'fois.mp3']
export function cscDeniseRecordingsReady(value: unknown = manifest): boolean {
  const pack = value as { status?: string; voice?: string; rate?: string; volume?: string; pitch?: string; sampleRate?: number; channels?: number; files?: { filename: string; sha256?: string; bytes?: number; duration?: number; sampleRate?: number; channels?: number }[] } | null
  return !!pack && pack.status === 'generated' && pack.voice === 'fr-FR-DeniseNeural' && pack.rate === '-25%' && pack.volume === '+0%' && pack.pitch === '+0Hz' && pack.sampleRate === 24000 && pack.channels === 1 && Array.isArray(pack.files) && pack.files.length === required.length && required.every(name => pack.files!.filter(file => file.filename === name && /^[a-f0-9]{64}$/.test(file.sha256 ?? '') && (file.bytes ?? 0) > 500 && (file.duration ?? 0) > 0.1 && file.sampleRate === 24000 && file.channels === 1).length === 1)
}
/** « plus » et « moins » sont toujours DeniseNeural, même si le reste du montage n’est pas prêt. */
export const cscDeniseOperator = (operator: 'plus' | 'moins') => `${CSC_DENISE_DIRECTORY}/${operator}.mp3`
