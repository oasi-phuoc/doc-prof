import type { PreviewMode } from '@/math/types'
import type { TcfChampFormulaire, TcfNbMots, TcfReplique } from '@/tcf/types'
import { LignesReponse } from './TcfQuestions'

function nbMotsLabel({ min = 0, max = 0 }: TcfNbMots): string {
  if (min > 0 && max > 0) return `entre ${min} et ${max} mots`
  if (min > 0) return `au moins ${min} mots`
  if (max > 0) return `${max} mots maximum`
  return ''
}

const RIBBON_ICONS: string[][] = [
  ['M8 4h8v3H8zM6 6H5v15h14V6h-1', 'M9 12h6M9 16h6'],
  ['M16 7l-6.5 6.5a2 2 0 0 0 3 3L19 10a4 4 0 0 0-6-6l-7 7a6 6 0 0 0 9 9l5-5'],
  ['M4 20h4L19 9l-4-4L4 16v4Z', 'M13 7l4 4'],
  ['M6 21V4M6 4h11l-2 4 2 4H6'],
  ['M12 4v10M12 18v2'],
]

/** Bandeau d’outils simplifié d’une fenêtre « nouveau message » (décor, non interactif). */
function MailRibbon() {
  return (
    <div className="tcf-mail-ribbon" aria-hidden>
      <svg viewBox="0 0 24 24">
        {RIBBON_ICONS[0].map((d) => (
          <path key={d} d={d} />
        ))}
      </svg>
      <span className="tcf-mail-sep" />
      <b>G</b>
      <i>I</i>
      <u>S</u>
      <span className="tcf-mail-sep" />
      {RIBBON_ICONS.slice(1).map((paths, i) => (
        <svg key={i} viewBox="0 0 24 24">
          {paths.map((d) => (
            <path key={d} d={d} />
          ))}
        </svg>
      ))}
    </div>
  )
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
          <MailRibbon />
          <div className="tcf-mail-head">
            <span className="tcf-mail-send">
              <svg viewBox="0 0 24 24" aria-hidden>
                <path d="M3 20 21 12 3 4l3 8-3 8Zm3-8h15" />
              </svg>
              Envoyer
            </span>
            <div className="tcf-mail-fields">
              <span className="tcf-mail-btn">À</span>
              <span className="tcf-mail-value">{email?.a ?? ''}</span>
              <span className="tcf-mail-btn">Cc</span>
              <span className="tcf-mail-value" />
              <span className="tcf-mail-label">Objet</span>
              <span className="tcf-mail-value">{email?.objet ?? ''}</span>
            </div>
          </div>
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
