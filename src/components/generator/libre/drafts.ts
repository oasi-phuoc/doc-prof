import type { LibreRevision } from './history'

export type LibreDraftSnapshot = {
  revision: LibreRevision
  libreMode: boolean
  sheetIndex: number
  blockIndex: number
  fields: Record<string, string>
  fiche: { id: string; name: string } | null
}

export type LibreDraft = {
  version: 1
  owner: string
  worksheet: string
  id: string
  parent: string | null
  modifiedAt: number
  snapshot: LibreDraftSnapshot
}

type WorksheetDrafts = {
  owner: string
  worksheet: string
  revisions: LibreDraft[]
}

function openDrafts(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('doc-prof-mode-libre', 1)
    request.onupgradeneeded = () => {
      const store = request.result.createObjectStore('worksheets', { keyPath: ['owner', 'worksheet'] })
      store.createIndex('owner', 'owner')
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
    request.onblocked = () => reject(new Error('Une autre fenêtre bloque le stockage du brouillon.'))
  })
}

export async function listLibreDrafts(owner: string): Promise<LibreDraft[]> {
  const db = await openDrafts()
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction('worksheets', 'readonly')
      const query = tx.objectStore('worksheets').index('owner').getAll(IDBKeyRange.only(owner))
      query.onsuccess = () => {
        const rows = query.result as WorksheetDrafts[]
        resolve(rows.flatMap((row) => row.revisions).sort((a, b) => b.modifiedAt - a.modifiedAt))
      }
      tx.onerror = () => reject(tx.error)
      tx.onabort = () => reject(tx.error)
    })
  } finally {
    db.close()
  }
}

async function updateWorksheet(
  owner: string,
  worksheet: string,
  update: (revisions: LibreDraft[]) => LibreDraft[],
) {
  const db = await openDrafts()
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('worksheets', 'readwrite')
      const store = tx.objectStore('worksheets')
      const key = [owner, worksheet]
      const request = store.get(key)
      request.onsuccess = () => {
        try {
          const current = request.result as WorksheetDrafts | undefined
          const revisions = update(current?.revisions ?? [])
          if (revisions.length) store.put({ owner, worksheet, revisions })
          else store.delete(key)
        } catch (cause) {
          reject(cause)
          tx.abort()
        }
      }
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
      tx.onabort = () => reject(tx.error)
    })
  } finally {
    db.close()
  }
}

/** Replace the selected parent atomically. With a shared parent, the two writes leave two heads. */
export async function writeLibreDraft(draft: LibreDraft) {
  await updateWorksheet(draft.owner, draft.worksheet, (revisions) => [
    ...revisions.filter(({ id }) => id !== draft.parent && id !== draft.id),
    draft,
  ])
}

export function discardLibreDraft(draft: Pick<LibreDraft, 'owner' | 'worksheet' | 'id'>) {
  return updateWorksheet(draft.owner, draft.worksheet, (revisions) =>
    revisions.filter(({ id }) => id !== draft.id),
  )
}
