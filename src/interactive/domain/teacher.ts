export type ToolbarGuard = 'none' | 'hold-to-reveal'
export const HOLD_TO_REVEAL_MS = 600
export const REVEAL_RETRACTION_MS = 10_000

/** The caller supplies time; the session reducer never reads a clock. */
export function retractionRemaining(revealedAt: number | undefined, now: number): number {
  if (revealedAt === undefined || !Number.isFinite(revealedAt) || !Number.isFinite(now) || now < revealedAt) return 0
  return Math.max(0, REVEAL_RETRACTION_MS - (now - revealedAt))
}
