import { mediaLabel } from '../media/assets'
import type { MediaAsset, MediaResult, PublicMediaPlan } from '../media/types'

export function MediaCheck({
  plan,
  assets,
  results,
  complete,
  error,
  exclude,
  excludedCount,
  onExclude,
  onRetry,
}: {
  plan: PublicMediaPlan
  assets: MediaAsset[]
  results: MediaResult[]
  complete: boolean
  error?: string
  exclude: boolean
  excludedCount: number
  onExclude: (exclude: boolean) => void
  onRetry: () => void
}) {
  if (!assets.length)
    return (
      <p className="ci-media-check-empty">
        Aucun média à vérifier dans cette sélection.
      </p>
    )
  const uncertain = results.filter(
    (r) => !['ok', 'slow'].includes(r.status),
  ).length
  const slow = results.filter((r) => r.status === 'slow').length
  return (
    <section
      className="ci-media-check"
      aria-label="Vérification des médias"
      aria-busy={!complete && !error}
    >
      <div className="ci-media-check-head">
        <h3>Images et audios</h3>
        <button disabled={!complete && !error} onClick={onRetry}>
          Réessayer la vérification
        </button>
      </div>
      <p role="status">
        {error ??
          (!complete
            ? `${results.length} / ${assets.length} médias vérifiés…`
            : `${assets.length - uncertain} média(s) disponible(s)${slow ? `, dont ${slow} au chargement lent` : ''} · ${uncertain} à vérifier`)}
      </p>
      {!complete && !error && (
        <progress
          aria-label="Avancement de la vérification des médias"
          max={assets.length}
          value={results.length}
        />
      )}
      <label className="ci-media-exclude">
        <input
          type="checkbox"
          checked={exclude}
          onChange={(e) => onExclude(e.target.checked)}
        />
        Exclure les questions concernées
      </label>
      <p className="ci-media-check-help">
        {exclude
          ? 'Les questions aux fichiers absents, bloqués ou illisibles sont écartées de la séance.'
          : 'Les questions restent dans la séance même si un média est absent, bloqué ou illisible.'}{' '}
        Vos cases de sélection restent cochées.{' '}
        {exclude &&
          excludedCount > 0 &&
          `${excludedCount} question(s) écartée(s).`}{' '}
        Un contrôle trop lent ne retire pas la question.
      </p>
      <details open={uncertain > 0}>
        <summary>Voir les {assets.length} médias</summary>
        <ul className="ci-media-check-list">
          {assets.map((asset) => {
            const result = results.find((r) => r.asset.id === asset.id)
            const numbers = asset.questionIds
              .map((id) => plan.questions.findIndex((q) => q.id === id) + 1)
              .filter((n) => n > 0)
            return (
              <li key={asset.id} data-status={result?.status ?? 'pending'}>
                <div>
                  <b>
                    {asset.kind === 'image' ? 'Image' : 'Audio'} ·{' '}
                    {mediaLabel(asset)}
                  </b>
                  <span>Question(s) {numbers.join(', ')}</span>
                </div>
                <div>
                  <span>{result?.message ?? 'En attente du contrôle…'}</span>
                  {result?.large && (
                    <span>
                      Fichier volumineux : prévoyez un temps de chargement.
                    </span>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </details>
    </section>
  )
}
