import { domainsForAccount, readAccessAccount } from '@/access'
import { canonicalJson } from '../domain/seeds'
import { sourcePlan } from '../domain/source-plan'
import { STORAGE_WARNING, type SavedSession } from '../domain/persistence'
import type { Session } from '../domain/types'
import { openInteractiveDatabase } from '../storage'
import { downloadSessionFile, makeTransfer, readTransfer, TRANSFER_MAX_BYTES, validateTransfer, withSessionOwnership, type SessionTransfer } from '../session-transfer'
import { POOL_TYPE_BY_ID } from './config'
import { poolRecipe } from './recipe'
import { readPool, type LocalPool } from './storage'

export type PoolTransfer = { format: 'clairfle-pool-session'; exportVersion: 1; pool: LocalPool; run: SessionTransfer }
const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value)

export function readPoolTransfer(text: string): PoolTransfer {
  if (new TextEncoder().encode(text).length > TRANSFER_MAX_BYTES) throw new Error('Ce fichier dépasse la limite de 2 Mo.')
  let raw: unknown
  try { raw = JSON.parse(text) } catch { throw new Error('Ce fichier ne contient pas de séance ClairFLE valide.') }
  if (!object(raw) || raw.format !== 'clairfle-pool-session' || raw.exportVersion !== 1 || !object(raw.run) ||
      Object.keys(raw).some(key => !['format', 'exportVersion', 'pool', 'run'].includes(key))) {
    throw new Error('Choisissez un fichier créé avec « Exporter avec le pool ». Pour un export de séance simple, ouvrez la fiche ou le pool d’origine.')
  }
  const pool = readPool(raw.pool)
  const run = readTransfer(JSON.stringify(raw.run))
  const reference = run.session.source?.reference
  if (reference?.kind !== 'pool' || reference.id !== pool.poolId) throw new Error('Le pool et la séance du fichier ne correspondent pas.')
  return { format: 'clairfle-pool-session', exportVersion: 1, pool, run }
}

function gameForPool({ pool, run }: PoolTransfer) {
  const allowed = new Set(domainsForAccount(readAccessAccount()))
  if (pool.config.entries.some(entry => !allowed.has(POOL_TYPE_BY_ID.get(entry.id)!.domain))) throw new Error('Votre compte ne permet pas d’ouvrir tous les exercices de ce pool.')
  return sourcePlan(poolRecipe(pool.config, pool.seed), pool.name, run.session.source!, run.session.mode)
}

export async function makePoolTransfer(pool: LocalPool, record: SavedSession, state?: Session): Promise<PoolTransfer> {
  const source = record.source
  if (source?.reference.kind !== 'pool' || source.reference.id !== pool.poolId) throw new Error('La séance ne correspond pas à ce pool.')
  const game = sourcePlan(poolRecipe(pool.config, pool.seed), pool.name, source, record.mode)
  const run = await makeTransfer(game, record, state)
  return readPoolTransfer(JSON.stringify({ format: 'clairfle-pool-session', exportVersion: 1, pool, run }))
}

export function downloadPoolTransfer(transfer: PoolTransfer) {
  downloadSessionFile(JSON.stringify(transfer), `clairfle-pool-seance-${transfer.run.session.sessionId}.json`)
}

export async function previewPoolTransfer(text: string): Promise<PoolTransfer> {
  const transfer = readPoolTransfer(text)
  await validateTransfer(gameForPool(transfer), transfer.run)
  return transfer
}

function saveImportedPool(pool: LocalPool, session: SavedSession): Promise<void> {
  return openInteractiveDatabase().then(db => new Promise((resolve, reject) => {
    let failure: unknown
    try {
      const tx = db.transaction(['pools', 'sessions'], 'readwrite')
      const pools = tx.objectStore('pools'), sessions = tx.objectStore('sessions')
      const localPool = pools.get(pool.poolId), sameGame = sessions.get(session.gameId), sameSession = sessions.index('sessionId').get(session.sessionId)
      let pending = 3
      function checked() {
        if (--pending) return
        try {
          if (sameGame.result !== undefined || sameSession.result !== undefined) throw new Error('Cette séance existe déjà sur cet appareil. La sauvegarde locale est conservée.')
          if (localPool.result === undefined) pools.add({ ...pool, createdAt: Date.now() })
          else {
            const current = readPool(localPool.result)
            if (current.name !== pool.name || current.seed !== pool.seed || canonicalJson(current.config) !== canonicalJson(pool.config)) {
              throw new Error('Un pool différent porte déjà cet identifiant sur cet appareil. L’import a été annulé.')
            }
          }
          sessions.add(session)
        } catch (error) { failure = error; tx.abort() }
      }
      localPool.onsuccess = sameGame.onsuccess = sameSession.onsuccess = checked
      tx.oncomplete = () => resolve()
      tx.onerror = tx.onabort = () => reject(failure ?? new Error(STORAGE_WARNING))
    } catch { reject(new Error(STORAGE_WARNING)) }
  }))
}

export async function importPoolTransfer(candidate: PoolTransfer) {
  const transfer = readPoolTransfer(JSON.stringify(candidate))
  const game = gameForPool(transfer)
  const { record } = await validateTransfer(game, transfer.run)
  await withSessionOwnership(game.id, () => saveImportedPool(transfer.pool, record))
  return { poolId: transfer.pool.poolId, sessionId: record.sessionId }
}
