import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { Domain } from '@/math/types'
import { parseFicheRecipe } from '@/fiches/recipe'
import { readSessionUser } from '@/fiches/session'
import {
  discardLibreDraft, listLibreDrafts, writeLibreDraft, type LibreDraft, type LibreDraftSnapshot,
} from './drafts'
import type { LibreRevision } from './history'

const HISTORY_KEY = 'clairfleLibreDraft'
const SAVE_DELAY = 350

function draftWorksheet(owner: string | undefined, savedId: string | undefined): string {
  const history = window.history.state?.[HISTORY_KEY]
  if (owner && history?.owner === owner && typeof history.worksheet === 'string') return history.worksheet
  return savedId ? `fiche-${savedId}` : `locale-${crypto.randomUUID()}`
}

function rememberWorksheet(owner: string, worksheet: string) {
  window.history.replaceState({ ...window.history.state, [HISTORY_KEY]: { owner, worksheet } }, '')
}

function usableSnapshot(draft: LibreDraft, owner: string | undefined, allowed: readonly Domain[]) {
  if (draft.version !== 1 || draft.owner !== owner || !draft.snapshot || !draft.snapshot.revision) return
  try {
    const { snapshot } = draft
    const recipe = parseFicheRecipe({ version: 1, ...snapshot.revision, libreMode: snapshot.libreMode })
    if (!recipe || !recipe.pages.every(({ domain }) => allowed.includes(domain)) ||
      (recipe.libreSnapshot && !recipe.libreSnapshot.every(({ domain }) => allowed.includes(domain)))) return
    if (draft.worksheet.startsWith('fiche-') &&
      (draft.worksheet !== `fiche-${snapshot.fiche?.id}` || typeof snapshot.fiche?.name !== 'string')) return
    if (!Number.isSafeInteger(snapshot.sheetIndex) || snapshot.sheetIndex < 0 ||
      !Number.isSafeInteger(snapshot.blockIndex) || snapshot.blockIndex < 0 ||
      !snapshot.fields || typeof snapshot.fields !== 'object' || Array.isArray(snapshot.fields) ||
      !Object.values(snapshot.fields).every((text) => typeof text === 'string')) return
    return {
      ...snapshot,
      revision: { ...snapshot.revision, pages: recipe.pages, libreSnapshot: recipe.libreSnapshot, imageOverrides: recipe.imageOverrides ?? {} },
    }
  } catch {
    return
  }
}

export function useLibreDraft({
  owner, savedId, allowedDomains, snapshot, restore,
}: {
  owner: string | undefined
  savedId: string | undefined
  allowedDomains: readonly Domain[]
  snapshot: LibreDraftSnapshot
  restore: (next: LibreDraftSnapshot) => void
}) {
  const [worksheet, setWorksheet] = useState(() => draftWorksheet(owner, savedId))
  const [available, setAvailable] = useState<LibreDraft[]>([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [hydrated, setHydrated] = useState(false)
  const last = useRef(snapshot)
  const applied = useRef(snapshot)
  const activeWorksheet = useRef(worksheet)
  const changingWorksheet = useRef(false)
  const head = useRef<LibreDraft | null>(null)
  const pendingRestore = useRef(false)
  const started = useRef(false)
  const busy = useRef<Promise<void>>(Promise.resolve())
  const activeRestore = useRef(restore)

  useLayoutEffect(() => {
    last.current = snapshot
    activeRestore.current = restore
    if (pendingRestore.current) {
      applied.current = snapshot
      pendingRestore.current = false
    }
  }, [snapshot, restore])

  function applyDraft(draft: LibreDraft) {
    const stored = usableSnapshot(draft, owner, allowedDomains)
    if (!owner || readSessionUser()?.id !== owner || !stored) {
      setError('Ce brouillon est illisible ou le compte ne dispose plus des droits nécessaires.')
      return
    }
    pendingRestore.current = true
    head.current = draft
    started.current = true
    rememberWorksheet(owner, draft.worksheet)
    activeWorksheet.current = draft.worksheet
    setWorksheet(draft.worksheet)
    activeRestore.current(stored)
    setMessage('Brouillon récupéré.')
    setError('')
  }

  useEffect(() => {
    if (!owner) return
    const initial = last.current
    let cancelled = false
    rememberWorksheet(owner, worksheet)
    void listLibreDrafts(owner).then((drafts) => {
      if (cancelled || readSessionUser()?.id !== owner) return
      setAvailable(drafts)
      const matches = drafts.filter((draft) => draft.worksheet === worksheet)
      if (matches.length === 1 && last.current === initial) applyDraft(matches[0]!)
      if (matches.length > 1) setMessage('Plusieurs révisions de cette fiche sont disponibles.')
      setHydrated(true)
    }).catch(() => {
      if (!cancelled) {
        setError('Le stockage local des brouillons est indisponible.')
        setHydrated(true)
      }
    })
    return () => { cancelled = true }
    // La restauration initiale concerne cette ouverture, même si l’utilisateur choisit ensuite une autre fiche.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [owner])

  function flush() {
    if (!owner || !hydrated || changingWorksheet.current || readSessionUser()?.id !== owner) return Promise.resolve()
    const target = last.current
    if (!started.current) {
      if (!target.libreMode) return Promise.resolve()
      const current = applied.current
      const edited = Object.keys(target.fields).length || Object.entries(target.revision)
        .some(([key, value]) => key !== 'libreSnapshot' && value !== current.revision[key as keyof typeof current.revision])
      if (!edited) return Promise.resolve()
      started.current = true
    }
    const document = activeWorksheet.current
    const work = busy.current.then(async () => {
      if (readSessionUser()?.id !== owner || activeWorksheet.current !== document || applied.current === target) return
      const previous = head.current
      const draft: LibreDraft = {
        version: 1, owner, worksheet: document, id: crypto.randomUUID(),
        parent: previous?.worksheet === document ? previous.id : null,
        modifiedAt: Date.now(), snapshot: target,
      }
      await writeLibreDraft(draft)
      head.current = draft
      applied.current = target
      setError('')
      setMessage('Brouillon conservé sur cet appareil.')
      const entries = await listLibreDrafts(owner)
      if (readSessionUser()?.id === owner) setAvailable(entries)
    }).catch((cause: unknown) => {
      setError(cause instanceof DOMException && cause.name === 'QuotaExceededError'
        ? 'Le stockage local est plein. La révision précédente reste disponible et vos modifications restent dans la fiche ouverte.'
        : 'Le brouillon n’a pas pu être conservé. La fiche reste ouverte avec vos modifications.')
    })
    busy.current = work
    return work
  }

  useEffect(() => {
    if (!owner || !hydrated) return
    const timer = window.setTimeout(() => { void flush() }, SAVE_DELAY)
    const whenHidden = () => {
      if (document.visibilityState === 'hidden') void flush()
    }
    const beforeLeave = () => { void flush() }
    document.addEventListener('visibilitychange', whenHidden)
    window.addEventListener('pagehide', beforeLeave)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', whenHidden)
      window.removeEventListener('pagehide', beforeLeave)
    }
    // La révision déclenche le délai. Les références reflètent le dernier état validé.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [owner, worksheet, hydrated, snapshot])

  useEffect(() => {
    if (!owner) return
    const reload = () => {
      if (document.visibilityState !== 'visible' || readSessionUser()?.id !== owner) return
      void listLibreDrafts(owner).then(setAvailable).catch(() => undefined)
    }
    const checkSession = () => {
      if (readSessionUser()?.id !== owner) window.location.reload()
    }
    window.addEventListener('focus', reload)
    window.addEventListener('storage', checkSession)
    return () => {
      window.removeEventListener('focus', reload)
      window.removeEventListener('storage', checkSession)
    }
  }, [owner])

  async function choose(draft: LibreDraft) {
    await flush()
    if (started.current && applied.current !== last.current) return
    applyDraft(draft)
  }

  async function finishSave(fiche: { id: string; name: string }, savedRevision: LibreRevision) {
    if (!owner || readSessionUser()?.id !== owner) return
    const pending = flush()
    changingWorksheet.current = true
    const nextWorksheet = `fiche-${fiche.id}`
    try {
      await pending
      const current = head.current
      const target = last.current
      if (target.revision !== savedRevision || Object.keys(target.fields).length) {
        const draft: LibreDraft = {
          version: 1, owner, worksheet: nextWorksheet, id: crypto.randomUUID(),
          parent: current?.id ?? null, modifiedAt: Date.now(), snapshot: { ...target, fiche },
        }
        await writeLibreDraft(draft)
        if (current && current.worksheet !== nextWorksheet) await discardLibreDraft(current)
        head.current = draft
      } else {
        if (current) await discardLibreDraft(current)
        head.current = null
        started.current = false
        setMessage('')
      }
      applied.current = target
      activeWorksheet.current = nextWorksheet
      setWorksheet(nextWorksheet)
      rememberWorksheet(owner, nextWorksheet)
      setAvailable(await listLibreDrafts(owner))
    } catch {
      setError('La fiche a été enregistrée. Le rangement du brouillon local a échoué.')
    } finally {
      changingWorksheet.current = false
      if (activeWorksheet.current === nextWorksheet && applied.current !== last.current) void flush()
    }
  }

  async function discard(draft: LibreDraft) {
    if (!owner || draft.owner !== owner || readSessionUser()?.id !== owner) return
    if (!window.confirm('Abandonner cette révision du brouillon sur cet appareil ?')) return
    try {
      await busy.current
      await discardLibreDraft(draft)
      if (head.current?.id === draft.id) {
        head.current = null
        applied.current = last.current
        setMessage('')
      }
      setAvailable(await listLibreDrafts(owner))
    } catch {
      setError('Cette révision du brouillon n’a pas pu être retirée.')
    }
  }

  return { available, message, error, choose, discard, finishSave, flush }
}
