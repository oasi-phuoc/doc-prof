import { encodeWav } from '@/tcm-cfr/audio-nombres'
import { CSC_DENISE_DIRECTORY } from './denise-recordings'

export const CSC_TCF_BEEP = '/lib/audio/tcf/consignes/bip-d-annonce.mp3'
export type CscAudioSegment = { kind: 'clip'; src: string } | { kind: 'silence'; seconds: number }

/** Exactly five variable prompts, A–E twice, no spoken result or extra recording. */
export function planCscDeniseAudio(exercise: number, questions: readonly (readonly string[])[]): CscAudioSegment[] {
  if (![1, 2, 3].includes(exercise) || questions.length !== 5 || questions.some(parts => !parts.length)) throw new Error('Le montage TCM CSC demande cinq questions validées, de A à E.')
  const clip = (src: string): CscAudioSegment => ({ kind: 'clip', src })
  const gap = (seconds: number): CscAudioSegment => ({ kind: 'silence', seconds })
  const sequence: CscAudioSegment[] = [clip(`${CSC_DENISE_DIRECTORY}/consigne-${exercise === 2 ? 'calculs' : 'nombres'}.mp3`), gap(5), clip(CSC_TCF_BEEP)]
  for (let listen = 0; listen < 2; listen++) {
    if (listen) sequence.push(gap(7), clip(CSC_TCF_BEEP))
    questions.forEach((parts, index) => {
      if (index) sequence.push(gap(7))
      sequence.push(clip(`${CSC_DENISE_DIRECTORY}/lettre-${'abcde'[index]}.mp3`), gap(0.18))
      parts.forEach((src, partIndex) => {
        if (partIndex) sequence.push(gap(0.12))
        sequence.push(clip(src === '/lib/audio/nombre/plus.mp3' ? `${CSC_DENISE_DIRECTORY}/plus.mp3` : src === '/lib/audio/nombre/moins.mp3' ? `${CSC_DENISE_DIRECTORY}/moins.mp3` : src))
      })
    })
  }
  return sequence
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

export async function renderCscDeniseAudio(sequence: readonly CscAudioSegment[]): Promise<Blob> {
  const context = new AudioContext({ sampleRate: 24000 })
  try {
    const clips = new Map<string, Float32Array>()
    for (const segment of sequence) {
      if (segment.kind !== 'clip' || clips.has(segment.src)) continue
      const response = await fetch(segment.src)
      if (!response.ok) throw new Error(`Audio TCM CSC indisponible : ${segment.src}`)
      const decoded = await context.decodeAudioData(await response.arrayBuffer())
      const mono = new Float32Array(decoded.length)
      for (let c = 0; c < decoded.numberOfChannels; c++) {
        const channel = decoded.getChannelData(c)
        for (let i = 0; i < mono.length; i++) mono[i] = mono[i]! + channel[i]! / decoded.numberOfChannels
      }
      clips.set(segment.src, audibleCscSamples(mono))
    }
    const length = sequence.reduce((count, segment) => count + (segment.kind === 'silence' ? Math.round(segment.seconds * context.sampleRate) : clips.get(segment.src)!.length), 0)
    const output = context.createBuffer(1, length, context.sampleRate), samples = output.getChannelData(0)
    let offset = 0
    for (const segment of sequence) {
      if (segment.kind === 'silence') offset += Math.round(segment.seconds * context.sampleRate)
      else { const data = clips.get(segment.src)!; samples.set(data, offset); offset += data.length }
    }
    return encodeWav(output)
  } finally { await context.close().catch(() => undefined) }
}
