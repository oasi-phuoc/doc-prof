import { openInteractiveDatabase, LOCAL_STORAGE_WARNING } from './storage'
import { readSessionSource, type StoredRun } from './domain/source'

const WEEK = 7 * 24 * 60 * 60 * 1000
function parseRun(value: unknown): StoredRun | null {
  if (!value || typeof value !== 'object') return null
  const raw = value as Record<string, unknown>
  if (typeof raw.updatedAt !== 'number' || !Number.isFinite(raw.updatedAt) || Date.now() - raw.updatedAt > WEEK) return null
  if (![1, 2, 3, 4].includes(raw.schemaVersion as number)) throw new Error('Une version plus récente du jeu a enregistré cette séance. Ses données sont conservées.')
  const source = readSessionSource(raw.source)
  return source && (raw.mode === 'class' || raw.mode === 'solo') && typeof raw.sessionId === 'string' && typeof raw.gameId === 'string' ? { source, mode: raw.mode, sessionId: raw.sessionId, gameId: raw.gameId, updatedAt: raw.updatedAt } : null
}
async function readRows(index: string, key: string): Promise<unknown[]> {
  const db = await openInteractiveDatabase()
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction('sessions')
      const request = tx.objectStore('sessions').index(index).getAll(key)
      tx.oncomplete = () => resolve(request.result)
      tx.onerror = tx.onabort = () => reject(new Error(LOCAL_STORAGE_WARNING))
    } catch { reject(new Error(LOCAL_STORAGE_WARNING)) }
  })
}
export async function latestRun(sourceKey: string): Promise<StoredRun | null> {
  const rows = await readRows('sourceKey', sourceKey)
  rows.sort((a, b) => Number((b as Record<string, unknown>).updatedAt) - Number((a as Record<string, unknown>).updatedAt))
  for (const row of rows) { const run = parseRun(row); if (run) return run }
  return null
}
export async function runById(sessionId: string): Promise<StoredRun | null> {
  if (!/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(sessionId)) throw new Error('Identifiant de séance invalide.')
  const rows = await readRows('sessionId', sessionId)
  if (rows.length > 1) throw new Error('Plusieurs sauvegardes portent cet identifiant. Elles sont conservées ; ouvrez la fiche pour préparer une nouvelle partie.')
  return rows[0] ? parseRun(rows[0]) : null
}
