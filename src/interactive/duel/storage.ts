import { canonicalJson } from '../domain/seeds'
import type { CompetitionQuiz } from '../competition/core'
import { createDuel, isDuelAction, stepDuel, DUEL_LIFETIME, type DuelAction, type DuelConfig } from './core'
import type { TimerSettings } from '../domain/settings'
import { duelStorageKey as key } from './storage-key'
export { hasDuel } from './storage-key'

export type DuelJournal = { version: 1; quizId: string; planId: string; config: DuelConfig; timer: TimerSettings; createdAt: number; events: { at: number; action: DuelAction }[] }
export async function duelPlanId(quiz: CompetitionQuiz): Promise<string> {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(canonicalJson(quiz)))
  return Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, '0')).join('')
}
export function newDuelRun(quiz: CompetitionQuiz, planId: string, config: DuelConfig, timer: TimerSettings, at = Date.now()) {
  const state = createDuel(quiz, config, timer, at)
  const journal: DuelJournal = { version: 1, quizId: quiz.id, planId, config: structuredClone(state.config), timer: { ...state.timer }, createdAt: at, events: [] }
  return { state, journal, warning: '', writable: true }
}
export function writeDuel(journal: DuelJournal): boolean {
  try { const text = JSON.stringify(journal); if (text.length > 1_000_000 || journal.events.length > 5000) return false; sessionStorage.setItem(key(journal.quizId, journal.config.mode), text); return true } catch { return false }
}
export function readDuel(quiz: CompetitionQuiz, planId: string, config: DuelConfig, timer: TimerSettings, at = Date.now()) {
  const fallback = newDuelRun(quiz, planId, config, timer, at)
  try {
    const raw = sessionStorage.getItem(key(quiz.id, config.mode)); if (!raw) return fallback
    if (raw.length > 1_000_000) throw new Error('Journal trop volumineux.')
    const journal = JSON.parse(raw) as DuelJournal
    if (!journal || journal.version !== 1 || Object.keys(journal).some(field => !['version', 'quizId', 'planId', 'config', 'timer', 'createdAt', 'events'].includes(field)) || journal.quizId !== quiz.id || journal.planId !== planId || journal.config?.mode !== config.mode || !Number.isFinite(journal.createdAt) || journal.createdAt > at + 60_000 || at >= journal.createdAt + DUEL_LIFETIME || !Array.isArray(journal.events) || journal.events.length > 5000) throw new Error('Journal invalide.')
    let state = createDuel(quiz, journal.config, journal.timer, journal.createdAt), last = journal.createdAt
    for (const event of journal.events) {
      if (!event || Object.keys(event).some(field => !['at', 'action'].includes(field)) || !Number.isFinite(event.at) || event.at < last || event.at > at + 60_000 || !isDuelAction(event.action)) throw new Error('Action invalide.')
      state = stepDuel(quiz, state, event.action, event.at); last = event.at
    }
    return { state, journal, warning: '', writable: true }
  } catch { return { ...fallback, writable: false, warning: 'Le duel enregistré ne peut pas être repris. Il est conservé ; choisissez une nouvelle partie pour recommencer.' } }
}
