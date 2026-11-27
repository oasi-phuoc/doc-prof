import type { PreviewMode } from '@/math/types'
import { PlayerAudio } from '@/components/tcf/PlayerAudio'
import type { SocieteSupport } from './types'
import './support.css'

export function SocieteSupportView({ support, mode }: { support: SocieteSupport; mode: PreviewMode }) {
  const corrigé = mode === 'answers'
  if (support.kind === 'document') {
    return (
      <div className="societe-support">
        <strong>{support.titre}</strong>
        {support.image && (
          <figure>
            <img src={support.image.src} alt={support.image.alt} />
            <figcaption>{support.image.caption}</figcaption>
          </figure>
        )}
        {support.lignes.map((ligne) => <p key={ligne}>{ligne}</p>)}
      </div>
    )
  }
  if (support.kind === 'ecoute') {
    return (
      <div className="societe-support">
        <PlayerAudio src={support.audioSrc} label="Écouter le document" />
        {corrigé && <>
          <strong>Transcription</strong>
          <p>{support.transcription}</p>
        </>}
      </div>
    )
  }
  const { production, lignes } = support
  return (
    <div className="societe-support">
      <p>{production.consigne}</p>
      <ul>{production.actions.map((action) => <li key={action}>{action}</li>)}</ul>
      {corrigé ? <>
        <strong>Exemple de réponse</strong>
        <p>{production.exemple}</p>
        <p>Critères · tâche réalisée, message clair, idées organisées, vocabulaire adapté.</p>
      </> : Array.from({ length: lignes }, (_, index) => (
        <span key={index} className="answer-line-field societe-writing-line" aria-hidden="true">{'\u00a0'}</span>
      ))}
    </div>
  )
}
