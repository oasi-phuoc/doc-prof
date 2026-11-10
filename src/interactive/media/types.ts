import type { Question } from '../domain/types'

export type MediaKind = 'image' | 'audio'
export type MediaStatus =
  | 'ok'
  | 'slow'
  | 'missing'
  | 'blocked'
  | 'invalid'
  | 'timeout'
export type MediaAsset = {
  id: string
  url: string
  kind: MediaKind
  questionIds: string[]
  conflictingKinds?: boolean
}
export type MediaResult = {
  asset: MediaAsset
  status: MediaStatus
  message: string
  elapsedMs: number
  bytes?: number
  width?: number
  height?: number
  durationSec?: number
  large?: boolean
}
export type MediaMetadata = Pick<
  MediaResult,
  'width' | 'height' | 'durationSec'
>
export type MediaPolicy = {
  baseUrl: string
  allowedOrigins?: readonly string[]
}
export type MediaProbeOptions = MediaPolicy & {
  timeoutMs?: number
  slowMs?: number
}
export type MediaProbeDependencies = {
  fetch: typeof fetch
  decodeImage: (url: string, signal: AbortSignal) => Promise<MediaMetadata>
  decodeAudio: (url: string, signal: AbortSignal) => Promise<MediaMetadata>
  now: () => number
}
export type PublicMediaPlan = { id: string; questions: Question[] }
