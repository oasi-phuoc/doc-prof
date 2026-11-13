import type { DuelMode } from './core'
export const duelStorageKey = (quizId: string, mode: DuelMode) => `clairfle.duel.${mode}.${quizId}`
export function hasDuel(quizId: string, mode: DuelMode) { try { return !!sessionStorage.getItem(duelStorageKey(quizId, mode)) } catch { return false } }
