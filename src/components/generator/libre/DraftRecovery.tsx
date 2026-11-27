import type { LibreDraft } from './drafts'

const date = new Intl.DateTimeFormat('fr-CH', { dateStyle: 'short', timeStyle: 'short' })

export function DraftRecovery({ drafts, message, error, onResume, onDiscard }: {
  drafts: LibreDraft[]
  message: string
  error: string
  onResume: (draft: LibreDraft) => void
  onDiscard: (draft: LibreDraft) => void
}) {
  if (!drafts.length && !message && !error) return null
  return (
    <div className="libre-drafts no-print">
      {message && <p role="status">{message}</p>}
      {error && <p role="alert">{error}</p>}
      {drafts.length > 0 && (
        <details>
          <summary>Brouillons sur cet appareil</summary>
          <ul>
            {drafts.map((draft) => (
              <li key={draft.id}>
                <span>
                  {draft.snapshot?.fiche?.name || draft.snapshot?.revision?.pages?.[0]?.domain || 'Fiche sans nom'}
                  {' · '}{Number.isFinite(draft.modifiedAt) ? date.format(draft.modifiedAt) : 'Date inconnue'}
                </span>
                <button type="button" onClick={() => onResume(draft)}>Reprendre</button>
                <button type="button" onClick={() => onDiscard(draft)}>Abandonner</button>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  )
}
