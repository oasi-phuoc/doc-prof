/** Public endpoint only. Teacher credentials remain server secrets. */
export const DEFAULT_COMPETITION_API_URL = 'https://clairfle-fiches.phuoc-van.workers.dev/competition'

export function resolveCompetitionApiBase(custom?: string, fiches?: string): string {
  return (custom?.trim() || (fiches?.trim() ? `${fiches.trim().replace(/\/+$/, '')}/competition` : DEFAULT_COMPETITION_API_URL)).replace(/\/+$/, '')
}
