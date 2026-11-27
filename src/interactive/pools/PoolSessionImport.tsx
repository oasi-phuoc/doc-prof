import { useEffect, useRef, useState } from 'react'
import { TRANSFER_MAX_BYTES } from '../session-transfer'
import { importPoolTransfer, previewPoolTransfer, type PoolTransfer } from './transfer'

export default function PoolSessionImport({ onOpen }: { onOpen: (run: { poolId: string; sessionId: string }) => void }) {
  const active = useRef(true)
  const [transfer, setTransfer] = useState<PoolTransfer | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    active.current = true
    return () => { active.current = false }
  }, [])

  async function run(action: () => Promise<void>) {
    setBusy(true)
    setError('')
    try { await action() }
    catch (reason) { if (active.current) setError(reason instanceof Error ? reason.message : 'Impossible d’importer cette séance.') }
    finally { if (active.current) setBusy(false) }
  }

  return <section className="ci-panel" aria-label="Import de séance avec pool" aria-busy={busy}>
    <p>Choisissez le fichier obtenu avec « Exporter avec le pool » sur l’autre appareil.</p>
    <label className="ci-import-file">Fichier de séance<input type="file" accept="application/json,.json" disabled={busy} onChange={event => {
      const file = event.currentTarget.files?.[0]
      event.currentTarget.value = ''
      if (!file) return
      setTransfer(null)
      void run(async () => {
        if (file.size > TRANSFER_MAX_BYTES) throw new Error('Ce fichier dépasse la limite de 2 Mo.')
        const candidate = await previewPoolTransfer(await file.text())
        if (active.current) setTransfer(candidate)
      })
    }} /></label>
    {transfer && <div>
      <h3>{transfer.pool.name}</h3>
      <p>{transfer.run.session.mode === 'class' ? 'Classe' : 'Solo'} · {transfer.run.bilan.worked} questions abordées sur {transfer.run.bilan.total}</p>
      <button type="button" className="ci-primary" disabled={busy} onClick={() => void run(async () => {
        const imported = await importPoolTransfer(transfer)
        if (active.current) onOpen(imported)
      })}>Importer et ouvrir</button>
    </div>}
    {busy && <p role="status">Vérification de la séance…</p>}
    {error && <p className="ci-notice" role="alert">{error}</p>}
  </section>
}
