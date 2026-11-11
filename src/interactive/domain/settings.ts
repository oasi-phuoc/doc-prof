export type TimerSettings = { enabled: boolean; seconds: number; feedbackSeconds: number }
export const DEFAULT_TIMER: TimerSettings = { enabled: true, seconds: 30, feedbackSeconds: 5 }
export function validSeconds(value: number): number {
  return Math.max(5, Math.min(600, Math.round(value) || 30))
}
export function validFeedbackSeconds(value: number): number {
  return Number.isFinite(value) ? Math.max(1, Math.min(10, Math.round(value))) : 5
}
