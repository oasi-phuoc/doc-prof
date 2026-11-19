import { encodeWavCancellable } from '@/tcm-cfr/audio-nombres'
import { CSC_DENISE_DIRECTORY } from './denise-recordings'

export const CSC_TCF_BEEP = '/lib/audio/tcf/consignes/bip-d-annonce.mp3'
export type CscAudioSegment = { kind: 'clip'; src: string } | { kind: 'silence'; seconds: number }
export type ListeningKind = 'entourer' | 'nombres' | 'calculs' | 'multiplications'

const LISTENING_LETTERS = 'abcdefghijkl'
const CONSIGNE_FILE: Record<ListeningKind, string> = {
  entourer: 'consigne-entourer.mp3',
  nombres: 'consigne-nombres.mp3',
  calculs: 'consigne-calculs.mp3',
  multiplications: 'consigne-multiplications.mp3',
}

function deniseOperator(src: string): string {
  if (src.endsWith('/plus.mp3')) return `${CSC_DENISE_DIRECTORY}/plus.mp3`
  if (src.endsWith('/moins.mp3')) return `${CSC_DENISE_DIRECTORY}/moins.mp3`
  if (src.endsWith('/fois.mp3')) return `${CSC_DENISE_DIRECTORY}/fois.mp3`
  return src
}

/**
 * Consigne Denise, 2 s, bip, puis chaque lettre, 0,5 s, l’énoncé, 5 s.
 * Après la dernière lettre : 5 s, bip, et la même série pour la 2e écoute.
 */
export function planListeningAudio(kind: ListeningKind, questions: readonly (readonly string[])[]): CscAudioSegment[] {
  if (questions.length < 1 || questions.length > LISTENING_LETTERS.length || questions.some((parts) => !parts.length)) {
    throw new Error('Le montage audio demande entre 1 et 12 questions, de A jusqu’à la dernière lettre.')
  }
  const clip = (src: string): CscAudioSegment => ({ kind: 'clip', src })
  const gap = (seconds: number): CscAudioSegment => ({ kind: 'silence', seconds })
  const sequence: CscAudioSegment[] = [clip(`${CSC_DENISE_DIRECTORY}/${CONSIGNE_FILE[kind]}`), gap(2), clip(CSC_TCF_BEEP)]
  for (let listen = 0; listen < 2; listen++) {
    if (listen) sequence.push(gap(5), clip(CSC_TCF_BEEP))
    questions.forEach((parts, index) => {
      if (index) sequence.push(gap(5))
      sequence.push(clip(`${CSC_DENISE_DIRECTORY}/lettre-${LISTENING_LETTERS[index]}.mp3`), gap(0.5))
      parts.forEach((src, partIndex) => {
        if (partIndex) sequence.push(gap(0.12))
        sequence.push(clip(deniseOperator(src)))
      })
    })
  }
  return sequence
}

/** Type CSC 1 = nombres, 2 = calculs, 3 = entourer. */
export function planCscDeniseAudio(exercise: number, questions: readonly (readonly string[])[]): CscAudioSegment[] {
  const kind = exercise === 1 ? 'nombres' : exercise === 2 ? 'calculs' : exercise === 3 ? 'entourer' : null
  if (!kind) throw new Error('Le montage TCM CSC concerne les exercices entourer, nombres et calculs.')
  return planListeningAudio(kind, questions)
}

/** Remove sub-audible clip margins so the added 5/7-second gaps stay real. */
export function audibleCscSamples(samples: Float32Array): Float32Array {
  const threshold = 0.001 // −60 dBFS: retains quiet consonants while removing encoded silence.
  let start = 0, end = samples.length
  while (start < end && Math.abs(samples[start]!) < threshold) start++
  while (end > start && Math.abs(samples[end - 1]!) < threshold) end--
  if (start === end) throw new Error('Une prise audio ne contient aucun son audible.')
  return samples.slice(start, end)
}

export async function renderCscDeniseAudio(sequence: readonly CscAudioSegment[], options: { signal?: AbortSignal; onProgress?: (done: number, total: number) => void } = {}): Promise<Blob> {
  const context = new AudioContext({ sampleRate: 24000 })
  try {
    const clips = new Map<string, Float32Array>()
    for (const segment of sequence) {
      if (segment.kind !== 'clip' || clips.has(segment.src)) continue
      const response = await fetch(segment.src, { signal: options.signal })
      if (!response.ok) throw new Error(`Audio TCM CSC indisponible : ${segment.src}`)
      const decoded = await context.decodeAudioData(await response.arrayBuffer())
      const mono = new Float32Array(decoded.length)
      for (let c = 0; c < decoded.numberOfChannels; c++) {
        const channel = decoded.getChannelData(c)
        for (let i = 0; i < mono.length; i++) mono[i] = mono[i]! + channel[i]! / decoded.numberOfChannels
      }
      options.signal?.throwIfAborted()
      clips.set(segment.src, audibleCscSamples(mono))
      options.onProgress?.(clips.size, new Set(sequence.flatMap(s => s.kind === "clip" ? [s.src] : [])).size)
    }
    const length = sequence.reduce((count, segment) => count + (segment.kind === 'silence' ? Math.round(segment.seconds * context.sampleRate) : clips.get(segment.src)!.length), 0)
    const output = context.createBuffer(1, length, context.sampleRate), samples = output.getChannelData(0)
    let offset = 0
    for (const segment of sequence) {
      if (segment.kind === 'silence') offset += Math.round(segment.seconds * context.sampleRate)
      else { const data = clips.get(segment.src)!; samples.set(data, offset); offset += data.length }
    }
    return await encodeWavCancellable(output, options.signal)
  } finally { await context.close().catch(() => undefined) }
}
