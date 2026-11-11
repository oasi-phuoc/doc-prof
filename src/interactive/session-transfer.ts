import { canonicalJson } from './domain/seeds'
import { compactSession, replaySession, planIdentity, saveSession, deleteSession, STORAGE_WARNING, type SavedSession } from './domain/persistence'
import { readSessionSource } from './domain/source'
import type { Game, Session } from './domain/types'
import { requestLocal, openInteractiveDatabase } from './storage'
import { acquireSessionLease } from './session-lease'

export const TRANSFER_MAX_BYTES = 2 * 1024 * 1024
const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value)
const fields = ['schemaVersion', 'mode', 'sessionId', 'gameId', 'planId', 'updatedAt', 'events', 'clock', 'clocks', 'source', 'revision', 'checkpoint']
const uuid = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i
export function sessionReport(state: Session, total = state.history.length) {
  return { total, worked: state.history.filter((a) => !a.skipped).length, skipped: state.history.filter((a) => a.skipped).length,
    correct: state.history.filter((a) => a.correct === true).length, incorrect: state.history.filter((a) => a.correct === false).length,
    teacherAssessed: state.history.filter((a) => a.manual !== undefined).length, previousAttempts: state.previousAttempts?.length ?? 0,
    marks: { success: Object.values(state.teacherMarks).filter((value) => value === 'success').length, review: Object.values(state.teacherMarks).filter((value) => value === 'review').length, unassessed: Object.values(state.teacherMarks).filter((value) => value === 'unassessed').length } }
}
export type SessionTransfer = { format: 'clairfle-session'; exportVersion: 1; schemaVersion: 5; exportedAt: number; session: SavedSession; bilan: ReturnType<typeof sessionReport> }
/** Strict envelope before plan reconstruction or any storage mutation. */
export function readTransfer(text: string, now = Date.now()): SessionTransfer {
  if (new TextEncoder().encode(text).length > TRANSFER_MAX_BYTES) throw new Error('Ce fichier dépasse la limite de 2 Mo.')
  let raw: unknown
  try { raw = JSON.parse(text) } catch { throw new Error('Ce fichier ne contient pas un export JSON ClairFLE valide.') }
  if (!object(raw) || Object.keys(raw).some((key) => !['format', 'exportVersion', 'schemaVersion', 'exportedAt', 'session', 'bilan'].includes(key)) || raw.format !== 'clairfle-session' || raw.exportVersion !== 1 || raw.schemaVersion !== 5) throw new Error('Version d’export non prise en charge. Aucune donnée locale n’a été modifiée.')
  if (typeof raw.exportedAt !== 'number' || !Number.isFinite(raw.exportedAt) || raw.exportedAt < 0 || raw.exportedAt > now + 60_000 || !object(raw.session) || Object.keys(raw.session).some((key) => !fields.includes(key)) || raw.session.schemaVersion !== 5 || typeof raw.session.sessionId !== 'string' || !uuid.test(raw.session.sessionId) || typeof raw.session.updatedAt !== 'number' || !Number.isFinite(raw.session.updatedAt) || raw.session.updatedAt < 0 || raw.session.updatedAt > raw.exportedAt + 60_000 || !raw.session.checkpoint || !Array.isArray(raw.session.events) || raw.session.events.length !== 0 || !object(raw.bilan)) throw new Error('Export de séance invalide. Aucune donnée locale n’a été modifiée.')
  if (!readSessionSource(raw.session.source)) throw new Error('La référence de fiche est absente de cet export.')
  return raw as SessionTransfer
}

export async function makeTransfer(game: Game, record: SavedSession, state?: Session, now = Date.now()): Promise<SessionTransfer> {
  if (!readSessionSource(record.source)) throw new Error('Cette ancienne séance ne contient pas de référence de fiche permettant son export.')
  const planId = await planIdentity(game)
  const snapshot = state ? compactSession({ ...record, updatedAt: now }, state) : record
  const resumed = replaySession(game, snapshot, planId, now, snapshot.mode)
  if (!resumed) throw new Error('Cette séance a expiré.')
  const session = compactSession(resumed.record, resumed.state)
  const transfer: SessionTransfer = { format: 'clairfle-session', exportVersion: 1, schemaVersion: 5, exportedAt: now, session, bilan: sessionReport(resumed.state, game.questions.length) }
  return readTransfer(JSON.stringify(transfer), now)
}
export async function validateTransfer(game: Game, transfer: SessionTransfer, now = Date.now()) {
  transfer = readTransfer(JSON.stringify(transfer), now)
  // Importing is a new local use: retain the original export date in the preview,
  // but start the seven-day retention from import after all validations pass.
  const resumed = replaySession(game, { ...transfer.session, updatedAt: now }, await planIdentity(game), now, transfer.session.mode)
  if (!resumed || canonicalJson(sessionReport(resumed.state, game.questions.length)) !== canonicalJson(transfer.bilan)) throw new Error('Le bilan ne correspond pas à l’état de la séance.')
  return { ...resumed, record: { ...compactSession(resumed.record, resumed.state), revision: 0 } }
}
async function withOwnership<T>(gameId: string, work: () => Promise<T>): Promise<T> {
  const controller = new AbortController()
  let pending: Promise<unknown> = Promise.resolve()
  const lease = await acquireSessionLease(gameId, { signal: controller.signal, onYield: () => pending.then(() => undefined, () => undefined) })
  if (lease.status !== 'owned') { await lease.release(); throw new Error('Cette partie est ouverte dans un autre onglet, ou sa sauvegarde ne peut pas être protégée. Revenez ici après l’avoir fermée.') }
  try { const task = work(); pending = task; return await task } finally { await lease.release(); controller.abort() }
}
export async function importTransfer(game: Game, transfer: SessionTransfer): Promise<SavedSession> {
  const validated = await validateTransfer(game, transfer)
  return withOwnership(game.id, async () => {
    const existing = await requestLocal('sessions', 'readonly', (store) => store.get(game.id))
    if (existing !== undefined) throw new Error('Cette partie existe déjà sur cet appareil. Sa sauvegarde est conservée ; supprimez-la explicitement avant de la remplacer.')
    const sameId = await requestLocal('sessions', 'readonly', (store) => store.index('sessionId').getAll(transfer.session.sessionId))
    if (sameId.length) throw new Error('Cet identifiant de séance existe déjà sur cet appareil. Aucune sauvegarde n’a été remplacée.')
    return saveSession(validated.record)
  })
}
export async function removeLocalRun(record: SavedSession): Promise<void> {
  await withOwnership(record.gameId, () => deleteSession({ id: record.gameId }, record))
}
export function downloadTransfer(transfer: SessionTransfer) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(transfer, null, 2)], { type: 'application/json;charset=utf-8' }))
  const link = document.createElement('a'); link.href = url; link.download = `clairfle-seance-${transfer.session.sessionId}.json`; link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
export async function eraseInteractiveData(): Promise<void> {
  const db = await openInteractiveDatabase()
  await new Promise<void>((resolve, reject) => {
    try { const tx = db.transaction([...db.objectStoreNames], 'readwrite'); for (const name of db.objectStoreNames) tx.objectStore(name).clear(); tx.oncomplete = () => resolve(); tx.onerror = tx.onabort = () => reject(new Error(STORAGE_WARNING)) } catch { reject(new Error(STORAGE_WARNING)) }
  })
  for (const name of ['localStorage', 'sessionStorage'] as const) {
    try { const storage = window[name]; for (const key of Object.keys(storage)) if (key === 'clairfle.interactive' || key.startsWith('clairfle.interactive.')) storage.removeItem(key) } catch { /* IndexedDB is already cleared; optional flags cannot prevent completion. */ }
  }
}
