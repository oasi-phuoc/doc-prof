export type TimerSettings = { enabled: boolean; seconds: number }
export const DEFAULT_TIMER: TimerSettings = { enabled: true, seconds: 30 }
export function validSeconds(value: number): number {
  return Math.max(5, Math.min(600, Math.round(value) || 30))
}
