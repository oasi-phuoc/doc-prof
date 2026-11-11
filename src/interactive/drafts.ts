import type { FicheRecipe } from '@/fiches/recipe'
import { draftNavigationData, parseInteractiveDraft, type DraftData } from './draft-data'
import { openInteractiveDatabase, requestLocal, LOCAL_STORAGE_WARNING } from './storage'
const DAY = 24 * 60 * 60 * 1000
const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value)
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const UNAVAILABLE = 'Ce brouillon local est introuvable ou a expiré. Ouvrez de nouveau la fiche dans le générateur.'
let maintenance: Promise<number> | undefined
let maintenanceAt = 0

/** Unknown schemas and invalid timestamps are left untouched. */
export async function purgeExpiredDrafts(now = Date.now()): Promise<number> {
  if (!Number.isFinite(now)) throw new Error('Date de nettoyage invalide.')
  const db = await openInteractiveDatabase()
  return new Promise((resolve, reject) => {
    let removed = 0
    try {
      const tx = db.transaction('drafts', 'readwrite')
      const cursor = tx.objectStore('drafts').index('lastOpenedAt').openCursor(IDBKeyRange.upperBound(now - DAY, true))
      cursor.onsuccess = () => {
        const entry = cursor.result
        if (!entry) return
        const value: unknown = entry.value
        if (object(value) && value.schemaVersion === 1 && typeof value.lastOpenedAt === 'number' && Number.isFinite(value.lastOpenedAt) && now - value.lastOpenedAt > DAY) { entry.delete(); removed++ }
        entry.continue()
      }
      tx.oncomplete = () => resolve(removed)
      tx.onerror = tx.onabort = () => reject(new Error(LOCAL_STORAGE_WARNING))
    } catch { reject(new Error(LOCAL_STORAGE_WARNING)) }
  })
}

async function maintainDrafts() {
  if (maintenance) { await maintenance; return }
  if (Date.now() - maintenanceAt < 60 * 60 * 1000) return
  const pending = purgeExpiredDrafts()
  maintenance = pending
  try { await pending; maintenanceAt = Date.now() }
  finally { if (maintenance === pending) maintenance = undefined }
}

export function localDraftId(): string | null {
  return window.location.pathname.replace(/\/+$/, '') === '/interactif' ? new URLSearchParams(window.location.search).get('d') : null
}

/** Persist source references only; inline image bytes keep the legacy handoff. */
export async function createLocalDraft(recipe: FicheRecipe, name: string): Promise<string> {
  const data = draftNavigationData(recipe, name)
  if (!parseInteractiveDraft(data)) throw new Error('La fiche ne peut pas être enregistrée comme brouillon.')
  if (JSON.stringify(data).includes('data:image/')) throw new Error('Les images intégrées restent disponibles dans cet onglet.')
  const draftId = crypto.randomUUID()
  const now = Date.now()
  await maintainDrafts()
  await requestLocal('drafts', 'readwrite', (store) => store.put({ ...data, draftId, schemaVersion: 1, createdAt: now, lastOpenedAt: now }))
  return draftId
}

export async function loadLocalDraft(draftId: string): Promise<DraftData> {
  if (!uuid.test(draftId)) throw new Error(UNAVAILABLE)
  await maintainDrafts()
  const db = await openInteractiveDatabase()
  return new Promise((resolve, reject) => {
    let data: DraftData | null = null
    let failure: Error | undefined
    try {
      const tx = db.transaction('drafts', 'readwrite')
      const store = tx.objectStore('drafts')
      const request = store.get(draftId)
      request.onsuccess = () => {
        const value: unknown = request.result
        const now = Date.now()
        if (!object(value)) { failure = new Error(UNAVAILABLE); return }
        if (value.schemaVersion !== 1) { failure = new Error('Version de brouillon non prise en charge. Les données sont conservées.'); return }
        if (typeof value.lastOpenedAt !== 'number' || !Number.isFinite(value.lastOpenedAt) || value.lastOpenedAt > now + 60_000) { failure = new Error('Brouillon invalide. Les données sont conservées.'); return }
        if (now - value.lastOpenedAt > DAY) { store.delete(draftId); failure = new Error(UNAVAILABLE); return }
        data = parseInteractiveDraft(value)
        if (!data) { failure = new Error('Brouillon invalide. Les données sont conservées.'); return }
        store.put({ ...value, lastOpenedAt: now })
      }
      tx.oncomplete = () => data && !failure ? resolve(data) : reject(failure ?? new Error(UNAVAILABLE))
      tx.onerror = tx.onabort = () => reject(new Error(LOCAL_STORAGE_WARNING))
    } catch { reject(new Error(LOCAL_STORAGE_WARNING)) }
  })
}
