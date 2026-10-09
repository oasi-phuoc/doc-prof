import type { PreviewMode } from '@/math/types'
import type { TcfChampFormulaire, TcfNbMots, TcfReplique } from '@/tcf/types'
import { LignesReponse } from './TcfQuestions'

function nbMotsLabel({ min = 0, max = 0 }: TcfNbMots): string {
  if (min > 0 && max > 0) return `entre ${min} et ${max} mots`
  if (min > 0) return `au moins ${min} mots`
  if (max > 0) return `${max} mots maximum`
  return ''
}

/** Zone d’écriture : consigne supplémentaire, traits (cadre téléphone ou e-mail) et compteur de mots. */
export function ZoneEcriture({
  cadre,
  email,
  consigneSupplementaire,
  nbMots,
  nbLignes,
  reponseModele,
  mode,
}: {
  cadre?: 'message' | 'email'
  email?: { a: string; objet: string }
  consigneSupplementaire?: string
  nbMots: TcfNbMots
  nbLignes: number
  reponseModele?: string
  mode: PreviewMode
}) {
  const attendu = nbMotsLabel(nbMots)
  const lignes = <LignesReponse nbLignes={nbLignes} texte={mode === 'answers' ? reponseModele : undefined} />
  return (
    <div className="tcf-ecriture">
      {consigneSupplementaire?.trim() ? (
        <p className="tcf-consigne-supp">{consigneSupplementaire}</p>
      ) : null}
      {cadre === 'message' ? (
        <div className="tcf-phone">
          <span className="tcf-phone-speaker" aria-hidden />
          <div className="tcf-phone-screen">{lignes}</div>
          <span className="tcf-phone-button" aria-hidden />
        </div>
      ) : cadre === 'email' ? (
        <div className="tcf-email is-compose">
          <dl className="tcf-email-head">
            <dt>À</dt>
            <dd>{email?.a ?? ''}</dd>
            <dt>Objet</dt>
            <dd>{email?.objet ?? ''}</dd>
          </dl>
          <div className="tcf-email-body">{lignes}</div>
        </div>
      ) : (
        lignes
      )}
      <p className="tcf-compteur">
        Nombre de mots : <span className="answer-line-field compact" aria-hidden />
        {attendu ? <span className="muted"> ({attendu})</span> : null}
      </p>
    </div>
  )
}

/** Formulaire PE : un champ par ligne ; le corrigé affiche la réponse attendue. */
export function FormulairePE({
  titre,
  champs,
  mode,
}: {
  titre?: string
  champs: TcfChampFormulaire[]
  mode: PreviewMode
}) {
  const show = mode === 'answers'
  return (
    <div className="tcf-formulaire">
      {titre?.trim() ? <p className="tcf-formulaire-title">{titre}</p> : null}
      {champs.map((champ, i) => (
        <div className="tcf-champ" key={`${champ.label}-${i}`}>
          <span className="tcf-champ-label">{champ.label}</span>
          {champ.type === 'choix' ? (
            <span className="tcf-champ-options">
              {(champ.options ?? []).filter((o) => o.trim()).map((opt) => {
                const on = show && opt.trim().toLowerCase() === champ.corrige.trim().toLowerCase()
                return (
                  <span key={opt} className="tcf-champ-option">
                    <span className="tcf-case" aria-hidden>
                      {on ? '✔' : ''}
                    </span>
                    {opt}
                  </span>
                )
              })}
            </span>
          ) : champ.type === 'case' ? (
            <span className="tcf-case" aria-hidden>
              {show && /^(oui|x|vrai|1)$/i.test(champ.corrige.trim()) ? '✔' : ''}
            </span>
          ) : (
            <span className={`answer-line-field tcf-champ-line${champ.type === 'date' ? ' is-date' : ''}`}>
              {show ? champ.corrige : champ.type === 'date' ? '\u00a0\u00a0/\u00a0\u00a0/' : ''}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

const LOCUTEUR_LABEL: Record<TcfReplique['locuteur'], string> = {
  examinateur: 'Examinateur·trice',
  eleve: 'Vous',
}

/** Dialogue (PO ou PE) : lignes à la place des répliques de l’élève ; corrigé avec variantes. */
export function DialoguePO({
  situation,
  repliques,
  auCorrige = false,
  interlocuteur,
  bulles = false,
  mode,
}: {
  situation: string
  repliques: TcfReplique[]
  auCorrige?: boolean
  interlocuteur?: string
  bulles?: boolean
  mode: PreviewMode
}) {
  const label = (loc: TcfReplique['locuteur']) =>
    loc === 'examinateur' && interlocuteur?.trim() ? interlocuteur.trim() : LOCUTEUR_LABEL[loc]
  const show = mode === 'answers'
  if (bulles) {
    return (
      <div className="tcf-dialogue">
        {situation.trim() ? <p className="tcf-question-text">{situation}</p> : null}
        <ol className="tcf-chat">
          {repliques.map((r, i) => (
            <li key={i} className={`tcf-chat-row is-${r.locuteur}`}>
              <span className="tcf-chat-name">{label(r.locuteur)}</span>
              <div className="tcf-chat-bubble">
                {r.locuteur === 'examinateur' ? (
                  r.texte
                ) : show ? (
                  <span className="tcf-chat-answer">{r.texte}</span>
                ) : (
                  <>
                    <span className="tcf-chat-line" aria-hidden />
                    <span className="tcf-chat-line" aria-hidden />
                  </>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    )
  }
  return (
    <div className="tcf-dialogue">
      {situation.trim() ? <p className="tcf-question-text">{situation}</p> : null}
      {auCorrige && !show ? null : (
        <ol className={`tcf-repliques${auCorrige ? ' is-compact' : ''}`}>
          {repliques.map((r, i) => (
            <li key={i} className={`tcf-replique is-${r.locuteur}`}>
              <b className="tcf-locuteur">{label(r.locuteur)} :</b>
              {r.locuteur === 'examinateur' ? (
                <span>{r.texte}</span>
              ) : show ? (
                <span>
                  {r.texte}
                  {(r.variantes ?? []).filter((v) => v.trim()).map((v, k) => (
                    <span key={k} className="tcf-variante">
                      {' '}
                      ou : {v}
                    </span>
                  ))}
                </span>
              ) : (
                <span className="answer-line-field tcf-ligne" aria-hidden />
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
