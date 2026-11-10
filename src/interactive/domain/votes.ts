import type { Question } from './types'
export type QuickReading = 'majority-correct' | 'split' | 'majority-review'
export type ManualVote = {
  counts: Record<string, number>
  present?: number
  quick?: QuickReading
  shared: boolean
}
export type VoteValidation = { ok: true; vote: ManualVote | null } | { ok: false; error: string }
const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value)
export function isVotePayload(value: unknown): value is ManualVote | null {
  if (value === null) return true
  if (!object(value) || Object.keys(value).some((key) => !['counts', 'present', 'quick', 'shared'].includes(key)) || !object(value.counts) || typeof value.shared !== 'boolean') return false
  if (Object.keys(value.counts).length > 6 || Object.values(value.counts).some((count) => typeof count !== 'number' || !Number.isInteger(count) || count < 0 || count > 99)) return false
  if (value.present !== undefined && (typeof value.present !== 'number' || !Number.isInteger(value.present) || value.present < 0 || value.present > 99)) return false
  return value.quick === undefined || ['majority-correct', 'split', 'majority-review'].includes(value.quick as string)
}
export function validateManualVote(question: Pick<Question, 'mode' | 'choices'>, value: unknown): VoteValidation {
  if (value === null) return { ok: true, vote: null }
  if (!isVotePayload(value)) return { ok: false, error: 'Saisissez des nombres entiers entre 0 et 99 pour les compteurs et les présents.' }
  if (question.mode !== 'choice' || Object.keys(value.counts).some((id) => !question.choices.some((choice) => choice.id === id))) return { ok: false, error: 'Seules les cartes actives de cette question peuvent être comptées.' }
  const total = Object.values(value.counts).reduce((sum, count) => sum + count, 0)
  if (value.present !== undefined && total > value.present) return { ok: false, error: `Le total de ${total} votes dépasse les ${value.present} présents. Vérifiez les valeurs.` }
  const counts = Object.fromEntries(Object.entries(value.counts).filter(([, count]) => count > 0))
  return { ok: true, vote: total || value.quick ? { counts, ...(value.present !== undefined ? { present: value.present } : {}), ...(value.quick ? { quick: value.quick } : {}), shared: value.shared } : null }
}
export function manualTotal(vote: ManualVote | undefined): number {
  return Object.values(vote?.counts ?? {}).reduce((sum, count) => sum + count, 0)
}
export const QUICK_READINGS: { value: QuickReading; label: string }[] = [
  { value: 'majority-correct', label: 'Majorité juste' },
  { value: 'split', label: 'Partagé' },
  { value: 'majority-review', label: 'Majorité à revoir' },
]
