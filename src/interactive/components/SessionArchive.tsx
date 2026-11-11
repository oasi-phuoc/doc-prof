import { useCallback, useEffect, useId, useRef, useState } from 'react'
import type { FicheRecipe } from '@/fiches/recipe'
import type { SourceReference, StoredRun } from '../domain/source'
import type { Game } from '../domain/types'
import { listSourceRuns, type LocalRun } from '../local-runs'
import { sourcePlan } from '../domain/source-plan'
import { TRANSFER_MAX_BYTES, readTransfer, validateTransfer, makeTransfer, downloadTransfer, importTransfer, removeLocalRun, eraseInteractiveData, type SessionTransfer } from '../session-transfer'

export function SessionArchive({ reference, template, title, onOpen, onErased }: { reference: SourceReference; template: FicheRecipe; title: string; onOpen: (run: StoredRun) => void; onErased: () => void }) {
  const [runs, setRuns] = useState<LocalRun[]>([])
  const [unavailable, setUnavailable] = useState(0)
  const [limit, setLimit] = useState(10)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [deleting, setDeleting] = useState<LocalRun | null>(null)
  const [erasing, setErasing] = useState(false)
  const [incoming, setIncoming] = useState<{ transfer: SessionTransfer; game: Game } | null>(null)
  const modal = useRef<HTMLDialogElement>(null)
  const modalTitle = useId()
  const refresh = useCallback(async () => { const next = await listSourceRuns(reference); setRuns(next.runs); setUnavailable(next.unavailable) }, [reference])
  useEffect(() => { let active = true; void listSourceRuns(reference).then((next) => { if (active) { setRuns(next.runs); setUnavailable(next.unavailable) } }, (error: unknown) => { if (active) setMessage(error instanceof Error ? error.message : 'Historique indisponible.') }); return () => { active = false } }, [reference])
  useEffect(() => {
    if (!deleting && !erasing && !incoming) return
    const previous = document.activeElement
    modal.current?.showModal()
    modal.current?.querySelector<HTMLButtonElement>('[data-ci-cancel]')?.focus()
    return () => { if (previous instanceof HTMLElement && previous.isConnected) previous.focus() }
  }, [deleting, erasing, incoming])
  const close = () => { if (!busy) { setDeleting(null); setErasing(false); setIncoming(null) } }
  const run = (work: () => Promise<void>) => { setBusy(true); setMessage(''); void work().catch((error: unknown) => setMessage(error instanceof Error ? error.message : 'Action impossible.')).finally(() => setBusy(false)) }
  const exportRun = (entry: LocalRun) => run(async () => { const transfer = await makeTransfer(sourcePlan(template, title, entry.source, entry.mode), entry.record); downloadTransfer(transfer); setMessage('Séance exportée en JSON.') })
  const pick = (file?: File) => {
    if (!file) return
    run(async () => {
      if (file.size > TRANSFER_MAX_BYTES) throw new Error('Ce fichier dépasse la limite de 2 Mo.')
      const transfer = readTransfer(await file.text())
      const source = transfer.session.source!
      if (source.reference.kind !== reference.kind || source.reference.id !== reference.id) throw new Error('Cet export appartient à une autre fiche. Ouvrez cette fiche avant de l’importer.')
      const game = sourcePlan(template, title, source, transfer.session.mode)
      await validateTransfer(game, transfer)
      setIncoming({ transfer, game })
    })
  }
  return <section className="ci-panel ci-no-print ci-archives">
    <h2>Parties et bilans sur cet appareil</h2>
    <p>Les parties sont conservées pendant sept jours après leur dernière utilisation. L’export contient l’état, les comptages et vos observations. Il ne contient ni la fiche ni son corrigé ; la fiche d’origine doit rester accessible pour importer ou reprendre.</p>
    <div className="ci-toolbar"><button type="button" disabled={busy} onClick={() => run(refresh)}>Actualiser les parties</button><label className="ci-import-file">Importer une séance<input type="file" accept="application/json,.json" disabled={busy} onChange={(event) => { pick(event.target.files?.[0]); event.target.value = '' }} /></label></div>
    {runs.length === 0 && <p>Aucune partie conservée pour cette fiche.</p>}
    <ol className="ci-archive-list">{runs.slice(0, limit).map((entry) => <li key={entry.gameId} data-session-id={entry.sessionId}><div><b>{entry.completed ? 'Bilan terminé' : 'Partie en cours'} · {entry.mode === 'class' ? 'Classe' : 'Solo'}</b><time dateTime={new Date(entry.updatedAt).toISOString()}>{new Date(entry.updatedAt).toLocaleString('fr-CH')}</time></div><div className="ci-toolbar"><button type="button" disabled={busy} onClick={() => onOpen(entry)}>{entry.completed ? 'Ouvrir ce bilan' : 'Ouvrir cette partie'}</button><button type="button" disabled={busy} onClick={() => exportRun(entry)}>Exporter</button><button type="button" disabled={busy} onClick={() => { setMessage(''); setDeleting(entry) }}>Supprimer</button></div></li>)}</ol>
    {runs.length > limit && <button type="button" onClick={() => setLimit((count) => count + 10)}>Afficher dix parties de plus</button>}
    {unavailable > 0 && <p role="status">{unavailable} sauvegarde(s) d’une version non prise en charge sont conservées sans modification.</p>}
    {message && !deleting && !erasing && !incoming && <p role="status">{message}</p>}
    <details className="ci-local-erase"><summary>Données locales du jeu</summary><p>L’effacement retire toutes les parties, brouillons, préréglages et préférences du jeu sur cet appareil. Les fiches enregistrées sur le serveur restent disponibles.</p><button type="button" disabled={busy} onClick={() => { setMessage(''); setErasing(true) }}>Effacer les données locales du jeu</button></details>
    {(deleting || erasing || incoming) && <dialog ref={modal} className="ci-teacher-confirm" aria-labelledby={modalTitle} onCancel={(event) => { event.preventDefault(); close() }}>
      <h2 id={modalTitle}>{incoming ? 'Importer cette séance ?' : erasing ? 'Effacer toutes les données locales du jeu ?' : 'Supprimer cette partie ?'}</h2>
      <p>{incoming ? `Export du ${new Date(incoming.transfer.exportedAt).toLocaleString('fr-CH')} · ${incoming.transfer.session.mode === 'class' ? 'Classe' : 'Solo'} · ${incoming.transfer.bilan.worked} question(s) abordée(s), ${incoming.transfer.bilan.skipped} passée(s). Les sauvegardes existantes ne seront pas remplacées.` : erasing ? 'Les données du jeu seront supprimées de cet appareil. Cette action ne peut pas être annulée.' : 'Cette sauvegarde et son bilan seront supprimés de cet appareil. La fiche serveur sera conservée.'}</p>
      {message && <p role="alert">{message}</p>}
      <div className="ci-toolbar"><button type="button" data-ci-cancel disabled={busy} onClick={close}>Annuler</button><button type="button" className="ci-primary" disabled={busy} onClick={() => run(async () => {
        if (incoming) { await importTransfer(incoming.game, incoming.transfer); setIncoming(null); await refresh(); setMessage('Séance importée. Vous pouvez l’ouvrir dans la liste.') }
        else if (erasing) { await eraseInteractiveData(); onErased() }
        else if (deleting) { await removeLocalRun(deleting.record); setDeleting(null); await refresh(); setMessage('Partie supprimée de cet appareil.') }
      })}>{incoming ? 'Importer la séance' : erasing ? 'Confirmer l’effacement' : 'Confirmer la suppression'}</button></div>
    </dialog>}
  </section>
}
