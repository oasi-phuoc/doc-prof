import { startSession, transition } from './session'
import { roundsFor } from './plan'
import type { Action, Game, Session, PlayMode } from './types'
import { isVotePayload } from './votes'
import { canonicalJson } from './seeds'

const DATABASE = 'clairfle-interactive'
const STORE = 'sessions'
const TTL = 7 * 24 * 60 * 60 * 1000
export const STORAGE_WARNING = 'Impossible de sauvegarder la séance sur cet appareil. Elle continue sans reprise automatique.'
export const PLAN_CHANGED = 'La fiche ou le moteur a changé : la reprise à l’identique est impossible.'
export const SESSION_CONFLICT = 'Cette séance a été modifiée dans une autre fenêtre. Revenez à la préparation pour reprendre sa dernière sauvegarde.'
export type SessionEvent = { eventId: string; at: number; action: Action }
export type SessionClock = {
  roundId: string
  phase: 'thinking' | 'revealed'
  durationMs: number
  remainingMs: number
}
export type SavedSession = {
  schemaVersion: 1
  mode: PlayMode
  sessionId: string
  gameId: string
  planId: string
  updatedAt: number
  events: SessionEvent[]
  clock?: SessionClock
  revision?: number
}
export type Resume = { record: SavedSession; state: Session }

/** Hash the complete resolved plan, including the answer key, but never store it. */
export async function planIdentity(game: Game): Promise<string> {
  const bytes = new TextEncoder().encode(JSON.stringify({ version: 1, game, rounds: roundsFor(game) }))
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), (n) => n.toString(16).padStart(2, '0')).join('')
}

function object(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}
function validAction(value: unknown): value is Action {
  if (!object(value)) return false
  const type = value.type
  const keys = Object.keys(value)
  if (type === 'SELECT') return keys.every((key) => ['type', 'choiceId', 'questionId'].includes(key)) && typeof value.choiceId === 'string' && (value.questionId === undefined || typeof value.questionId === 'string')
  if (type === 'ASSESS') return keys.every((key) => ['type', 'value', 'questionId'].includes(key)) && ['acquired', 'retry'].includes(value.value as string) && (value.questionId === undefined || typeof value.questionId === 'string')
  if (type === 'MANUAL_VOTE_SET') return keys.length === 3 && keys.every((key) => ['type', 'questionId', 'vote'].includes(key)) && typeof value.questionId === 'string' && isVotePayload(value.vote)
  if (type === 'TEACHER_MARK_SET') return keys.length === 3 && keys.every((key) => ['type', 'questionId', 'value'].includes(key)) && typeof value.questionId === 'string' && ['success', 'review', 'unassessed'].includes(value.value as string)
  if (type === 'SESSION_NOTE_SET') return keys.length === 2 && typeof value.note === 'string' && value.note.length <= 2000
  return keys.length === 1 && typeof type === 'string' && ['TIMEOUT', 'CARDS_UP', 'DISCUSS', 'REVEAL', 'NEXT', 'PREVIOUS', 'SKIP', 'PAUSE', 'RESUME'].includes(type)
}

function readClock(value: unknown): SessionClock | undefined {
  if (value === undefined) return undefined
  if (!object(value) || typeof value.roundId !== 'string' ||
    (value.phase !== 'thinking' && value.phase !== 'revealed') ||
    typeof value.durationMs !== 'number' || !Number.isFinite(value.durationMs) ||
    value.durationMs <= 0 || value.durationMs > 600_000 ||
    (value.phase === 'revealed' && (value.durationMs < 1000 || value.durationMs > 10000 || value.durationMs % 1000 !== 0)) ||
    typeof value.remainingMs !== 'number' || !Number.isFinite(value.remainingMs) ||
    value.remainingMs < 0 || value.remainingMs > value.durationMs
  ) throw new Error('Minuteur de séance invalide. La sauvegarde est conservée.')
  return { roundId: value.roundId, phase: value.phase, durationMs: value.durationMs, remainingMs: value.remainingMs }
}

export function remainingFor(clock: SessionClock | undefined, roundId: string, phase: SessionClock['phase'], durationMs: number): number | undefined {
  return clock?.roundId === roundId && clock.phase === phase && clock.durationMs === durationMs ? clock.remainingMs : undefined
}

/** Replaying teacher actions preserves selections and reveal decisions exactly. */
export function replaySession(game: Game, value: unknown, planId: string, now = Date.now(), mode: PlayMode = 'class'): Resume | null {
  if (!object(value) || value.schemaVersion !== 1) throw new Error('Version de sauvegarde non prise en charge. La sauvegarde est conservée.')
  if (value.mode !== mode || value.gameId !== game.id || value.planId !== planId) throw new Error(PLAN_CHANGED)
  if (typeof value.sessionId !== 'string' || !value.sessionId || typeof value.updatedAt !== 'number' || !Number.isFinite(value.updatedAt) || value.updatedAt > now + 60_000 || !Array.isArray(value.events) || value.events.length > 5000) throw new Error('Sauvegarde de séance invalide. Elle est conservée.')
  if (value.revision !== undefined && (typeof value.revision !== 'number' || !Number.isSafeInteger(value.revision) || value.revision < 0)) throw new Error('Révision de sauvegarde invalide. Elle est conservée.')
  if (now - value.updatedAt > TTL) return null
  const clock = readClock(value.clock)
  const seen = new Set<string>()
  let state = startSession(game, mode)
  const events: SessionEvent[] = []
  for (const item of value.events) {
    if (!object(item) || typeof item.eventId !== 'string' || !item.eventId || typeof item.at !== 'number' || !Number.isFinite(item.at) || !validAction(item.action)) throw new Error('Journal de séance invalide. Il est conservé.')
    if (seen.has(item.eventId)) continue
    seen.add(item.eventId)
    events.push({ eventId: item.eventId, at: item.at, action: item.action })
    state = transition(game, state, item.action)
  }
  return { record: { schemaVersion: 1, mode, sessionId: value.sessionId, gameId: game.id, planId, updatedAt: value.updatedAt, events, clock, revision: (value.revision as number | undefined) ?? 0 }, state }
}

let connection: Promise<IDBDatabase> | undefined

/** Keep one connection; IndexedDB transactions report completion or abort natively. */
function openDatabase(): Promise<IDBDatabase> {
  if (connection) return connection
  const opening = new Promise<IDBDatabase>((resolve, reject) => {
    let settled = false
    const fail = () => {
      if (settled) return
      settled = true
      clearTimeout(timeout)
      reject(new Error(STORAGE_WARNING))
    }
    const timeout = setTimeout(fail, 3000)
    try {
      const request = indexedDB.open(DATABASE, 1)
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE, { keyPath: 'gameId' })
      }
      request.onerror = fail
      request.onblocked = fail
      request.onsuccess = () => {
        const db = request.result
        if (settled) { db.close(); return }
        settled = true
        clearTimeout(timeout)
        db.onversionchange = () => { connection = undefined; db.close() }
        db.onclose = () => { connection = undefined }
        resolve(db)
      }
    } catch { fail() }
  })
  connection = opening
  void opening.catch(() => { if (connection === opening) connection = undefined })
  return opening
}

async function transaction<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const fail = () => reject(new Error(STORAGE_WARNING))
    try {
      const tx = db.transaction(STORE, mode)
      const request = run(tx.objectStore(STORE))
      tx.oncomplete = () => resolve(request.result)
      tx.onerror = fail
      tx.onabort = fail
    } catch { fail() }
  })
}

export async function loadSession(game: Game, mode: PlayMode = 'class'): Promise<Resume | null> {
  const value: unknown = await transaction('readonly', (store) => store.get(game.id))
  if (value === undefined) return null
  return replaySession(game, value, await planIdentity(game), Date.now(), mode)
}
export async function newRecord(game: Game, mode: PlayMode = 'class'): Promise<SavedSession> {
  return { schemaVersion: 1, mode, sessionId: crypto.randomUUID(), gameId: game.id, planId: await planIdentity(game), updatedAt: Date.now(), events: [], revision: 0 }
}
function sameRevision(value: unknown, expected: SavedSession): boolean {
  if (!object(value) || !Array.isArray(value.events)) return false
  const last = value.events.at(-1) as SessionEvent | undefined
  return value.schemaVersion === expected.schemaVersion && value.gameId === expected.gameId && value.mode === expected.mode && value.sessionId === expected.sessionId && value.planId === expected.planId &&
    (value.revision ?? 0) === (expected.revision ?? 0) && last?.eventId === expected.events.at(-1)?.eventId
}

/** Compare and mutate atomically, including writes of the remaining time only. */
async function mutateRecord<T>(gameId: string, change: (value: unknown, store: IDBObjectStore) => T): Promise<T> {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    let result: T
    let failure: Error | undefined
    try {
      const tx = db.transaction(STORE, 'readwrite')
      const store = tx.objectStore(STORE)
      const request = store.get(gameId)
      request.onsuccess = () => {
        try { result = change(request.result, store) }
        catch (error) { failure = error instanceof Error ? error : new Error(STORAGE_WARNING); tx.abort() }
      }
      tx.oncomplete = () => resolve(result)
      tx.onerror = tx.onabort = () => reject(failure ?? new Error(STORAGE_WARNING))
    } catch { reject(new Error(STORAGE_WARNING)) }
  })
}
export async function saveSession(record: SavedSession, previous?: SavedSession): Promise<SavedSession> {
  return mutateRecord(record.gameId, (existing, store) => {
    if (previous) {
      if (!sameRevision(existing, previous)) throw new Error(SESSION_CONFLICT)
    } else if (existing !== undefined) {
      if (object(existing) && canonicalJson({ ...existing, revision: existing.revision ?? 0 }) === canonicalJson(record)) return record
      if (!object(existing) || existing.schemaVersion !== 1 || typeof existing.updatedAt !== 'number' || Date.now() - existing.updatedAt <= TTL) throw new Error(SESSION_CONFLICT)
    }
    const revision = previous ? (previous.revision ?? 0) + 1 : 0
    if (!Number.isSafeInteger(revision)) throw new Error(SESSION_CONFLICT)
    const next = { ...record, revision }
    store.put(next)
    return next
  })
}
export async function deleteSession(game: Game, previous?: SavedSession): Promise<void> {
  await mutateRecord(game.id, (existing, store) => {
    if (previous && !sameRevision(existing, previous)) throw new Error(SESSION_CONFLICT)
    store.delete(game.id)
  })
}
