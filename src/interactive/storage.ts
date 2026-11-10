const DATABASE = 'clairfle-interactive'
const VERSION = 2
const stores = { sessions: 'gameId', drafts: 'draftId', settings: 'id', 'presets-local': 'presetId' } as const
export type LocalStore = keyof typeof stores
export const LOCAL_STORAGE_WARNING = 'Impossible de sauvegarder les données du jeu sur cet appareil.'
let connection: Promise<IDBDatabase> | undefined

/** Upgrade adds stores while preserving the existing session key and records. */
export function openInteractiveDatabase(): Promise<IDBDatabase> {
  if (connection) return connection
  const opening = new Promise<IDBDatabase>((resolve, reject) => {
    let settled = false
    const fail = () => { if (!settled) { settled = true; clearTimeout(timeout); reject(new Error(LOCAL_STORAGE_WARNING)) } }
    const timeout = setTimeout(fail, 3000)
    try {
      const request = indexedDB.open(DATABASE, VERSION)
      request.onupgradeneeded = () => {
        for (const [name, keyPath] of Object.entries(stores)) if (!request.result.objectStoreNames.contains(name)) request.result.createObjectStore(name, { keyPath })
        const drafts = request.transaction!.objectStore('drafts')
        if (!drafts.indexNames.contains('lastOpenedAt')) drafts.createIndex('lastOpenedAt', 'lastOpenedAt')
      }
      request.onerror = request.onblocked = fail
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

export async function requestLocal<T>(name: LocalStore, mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openInteractiveDatabase()
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction(name, mode)
      const request = run(tx.objectStore(name))
      tx.oncomplete = () => resolve(request.result)
      tx.onerror = tx.onabort = () => reject(new Error(LOCAL_STORAGE_WARNING))
    } catch { reject(new Error(LOCAL_STORAGE_WARNING)) }
  })
}
