import type { PreviewMode } from '@/math/types'
import { PlayerAudio } from '@/components/tcf/PlayerAudio'
import type { SocieteImage, SocieteSupport } from './types'
import './support.css'

function Illustration({ image }: { image: SocieteImage }) {
  return (
    <figure>
      <img src={image.src} alt={image.alt} />
      <figcaption>{image.caption}</figcaption>
    </figure>
  )
}

export function SocieteSupportView({ support, mode }: { support: SocieteSupport; mode: PreviewMode }) {
  const corrigé = mode === 'answers'
  if (support.kind === 'document') {
    return (
      <div className="societe-support">
        <strong>{support.titre}</strong>
        {support.image && <Illustration image={corrigé ? support.correction ?? support.image : support.image} />}
        {support.lignes.map((ligne) => <p key={ligne}>{ligne}</p>)}
      </div>
    )
  }
  if (support.kind === 'ecoute') {
    return (
      <div className="societe-support societe-with-context">
        {support.image && <Illustration image={support.image} />}
        <PlayerAudio src={support.audioSrc} label="Écouter le document" />
        {corrigé && <>
          <strong>Transcription</strong>
          <p>{support.transcription}</p>
        </>}
      </div>
    )
  }
  if (support.kind === 'cantons') {
    return (
      <table className="societe-cantons-table">
        <thead>
          <tr><th scope="col">Canton</th><th scope="col">Chef-lieu</th></tr>
        </thead>
        <tbody>
          {support.cantons.map((canton) => (
            <tr key={canton.sigle}>
              <th scope="row">
                <span className="societe-canton">
                  <img className="societe-ecusson" src={canton.ecusson} alt="" />
                  <span><strong>{canton.nom}</strong><small>{canton.sigle}{canton.ancienDemiCanton ? ' · ancien demi-canton' : ''}</small></span>
                </span>
              </th>
              <td>
                <span className="societe-chef-lieu">
                  <span>{canton.chefLieu}</span>
                  <img className="societe-chef-lieu-vue" src={canton.vue} alt="" />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
  const { production, lignes } = support
  return (
    <div className="societe-support societe-with-context">
      {support.image && <Illustration image={support.image} />}
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
