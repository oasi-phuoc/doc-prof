import { useState } from 'react'
import type { PreviewMode } from '@/math/types'
import {
  associationAnswersFromExercise,
  parseAssociationDocuments,
} from '@/tcf/association-documents'
import { tcfImageSrc } from '@/tcf/media'
import type { TcfCeAnnonce, TcfExercise } from '@/tcf/types'

/** Paragraphes : une ligne vide sépare deux paragraphes. */
function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text
        .split(/\n{2,}/)
        .filter((p) => p.trim())
        .map((p, i) => (
          <p key={i} className="tcf-text">
            {p}
          </p>
        ))}
    </>
  )
}

function SmsBubble({ from, text }: { from?: string; text: string }) {
  return (
    <div className="tcf-sms">
      {from ? <p className="tcf-sms-from">{from}</p> : null}
      <div className="tcf-sms-bubble">
        <Paragraphs text={text} />
      </div>
    </div>
  )
}

function EmailBox({ de, a, objet, texte }: { de: string; a?: string; objet: string; texte: string }) {
  return (
    <div className="tcf-email">
      <dl className="tcf-email-head">
        <dt>De</dt>
        <dd>{de}</dd>
        {a ? (
          <>
            <dt>À</dt>
            <dd>{a}</dd>
          </>
        ) : null}
        <dt>Objet</dt>
        <dd>{objet}</dd>
      </dl>
      <div className="tcf-email-body">
        <Paragraphs text={texte} />
      </div>
    </div>
  )
}

function TcfImage({ src, alt, className = 'tcf-image' }: { src: string; alt: string; className?: string }) {
  const resolved = tcfImageSrc(src)
  const [failed, setFailed] = useState(false)
  if (!resolved || failed) return null
  return (
    <img
      className={className}
      src={resolved}
      alt={alt}
      onError={() => setFailed(true)}
    />
  )
}

/** Modèle de réponse (corrigé uniquement). */
function Modele({ text, mode, title = 'Réponse possible' }: { text?: string; mode: PreviewMode; title?: string }) {
  if (mode !== 'answers' || !text?.trim()) return null
  return (
    <div className="tcf-modele">
      <b>{title} :</b>
      <Paragraphs text={text} />
    </div>
  )
}

function MotsBanque({ mots }: { mots?: string[] }) {
  const list = (mots ?? []).map((mot) => mot.trim()).filter(Boolean)
  if (list.length === 0) return null
  return (
    <ul className="tcf-mots is-theme">
      {list.map((mot, i) => (
        <li key={`${mot}-${i}`} className="tcf-mot">
          {mot}
        </li>
      ))}
    </ul>
  )
}

/** Support de l’exercice : document à lire, audio, images, consignes de production. */
export function TexteSupport({ exercise: ex, mode }: { exercise: TcfExercise; mode: PreviewMode }) {
  const banque = <MotsBanque mots={ex.mots_banque} />
  switch (ex.type_exercice) {
    case 'sms':
      return (
        <>
          {banque}
          <SmsBubble from={ex.support.expediteur} text={ex.support.texte} />
        </>
      )
    case 'email':
      return (
        <>
          {banque}
          <EmailBox {...ex.support} />
        </>
      )
    case 'annonce': {
      const association = parseAssociationDocuments(ex.support.texte)
      if (association) {
        const answers = associationAnswersFromExercise(ex as TcfCeAnnonce)
        const show = mode === 'answers'
        return (
          <>
            {banque}
            <div className="tcf-assoc">
              {ex.support.titre ? <p className="tcf-annonce-title">{ex.support.titre}</p> : null}
              {ex.support.image ? (
                <TcfImage src={ex.support.image} alt={ex.support.titre} className="tcf-image" />
              ) : null}
              <ul className="tcf-assoc-docs">
                {association.documents.map((doc) => (
                  <li key={doc.numero} className="tcf-assoc-doc">
                    <span className="tcf-assoc-doc-num" aria-hidden>
                      {doc.numero}
                    </span>
                    {doc.titre ? <p className="tcf-assoc-doc-title">{doc.titre}</p> : null}
                    <Paragraphs text={doc.texte} />
                  </li>
                ))}
              </ul>
              <p className="tcf-assoc-people-title">Les personnes :</p>
              <table className="tcf-assoc-people">
                <tbody>
                  {association.personnes.map((p) => {
                    const num = answers[p.lettre]
                    const fill = show && num != null ? String(num) : ''
                    return (
                      <tr key={p.lettre}>
                        <th scope="row">
                          <span className="tcf-assoc-letter">{p.lettre}.</span> {p.texte}
                        </th>
                        <td>
                          <span className="tcf-assoc-answer">
                            <span className="tcf-assoc-num-label">N° :</span>
                            <span
                              className={`answer-line-field tcf-assoc-num-line${fill ? ' filled' : ''}`}
                            >
                              {fill || '\u00a0'}
                            </span>
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )
      }
      return (
        <>
          {banque}
          <div className="tcf-annonce">
            {ex.support.titre ? <p className="tcf-annonce-title">{ex.support.titre}</p> : null}
            <div className="tcf-annonce-body">
              {ex.support.image ? <TcfImage src={ex.support.image} alt={ex.support.titre} /> : null}
              <div>
                <Paragraphs text={ex.support.texte} />
              </div>
            </div>
          </div>
        </>
      )
    }
    case 'images_a_reconnaitre':
    case 'six_courts':
    case 'trois_moyens':
      // Audios / QR masqués sur la fiche — téléchargement via le bouton aperçu.
      return banque
    case 'complet': {
      const sceneImages = (
        ex.support.images?.length
          ? ex.support.images
          : ex.support.image
            ? [ex.support.image]
            : []
      )
        .map((src) => src.trim())
        .filter(Boolean)
      return (
        <>
          {banque}
          {sceneImages.length === 1 ? (
            <TcfImage
              src={sceneImages[0]!}
              alt={ex.scene?.trim() || 'Scène de l’audio'}
              className="tcf-image is-large"
            />
          ) : null}
          {sceneImages.length > 1 ? (
            <ul className={`tcf-po-images is-${Math.min(sceneImages.length, 4)}`}>
              {sceneImages.map((src, i) => (
                <li key={`${src}-${i}`}>
                  <TcfImage src={src} alt={`Scène audio ${i + 1}`} />
                </li>
              ))}
            </ul>
          ) : null}
          {/* Transcriptions regroupées en fin de corrigé (TranscriptionAppendixSheet). */}
        </>
      )
    }
    case 'association_images':
      // Transcriptions regroupées en fin de corrigé (TranscriptionAppendixSheet).
      return banque
    case 'image_question': {
      const photos = (ex.support.images ?? []).map((src) => src.trim()).filter(Boolean)
      const numbered = /\(1\)/.test(ex.support.consigne)
      const fiche = ex.support.fiche
      return (
        <div className="tcf-pe-image">
          {fiche ? (
            <div className="tcf-portrait-card">
              <TcfImage src={ex.support.image} alt={fiche.nom} className="tcf-portrait-photo" />
              <div className="tcf-portrait-body">
                <p className="tcf-portrait-name">{fiche.nom}</p>
                <dl className="tcf-portrait-fields">
                  {fiche.lignes.map((ligne) => (
                    <div key={`${ligne.label}-${ligne.valeur}`}>
                      <dt>{ligne.label}</dt>
                      <dd>{ligne.valeur}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          ) : photos.length > 0 ? (
            <ol className="tcf-pe-images">
              {photos.map((src, i) => (
                <li key={src}>
                  {numbered ? <span className="tcf-pe-image-num">{i + 1}</span> : null}
                  <TcfImage src={src} alt="" />
                </li>
              ))}
            </ol>
          ) : (
            <TcfImage src={ex.support.image} alt="Image de l’exercice" />
          )}
          {ex.support.consigne.trim() ? <p className="tcf-question-text">{ex.support.consigne}</p> : null}
        </div>
      )
    }
    case 'sms_reponse':
      return (
        <div>
          <SmsBubble from={ex.support.expediteur} text={ex.support.sms_recu} />
          <p className="tcf-question-text">{ex.support.consigne}</p>
        </div>
      )
    case 'email_reponse':
      return (
        <div>
          <EmailBox {...ex.support.email_recu} />
          <p className="tcf-question-text">{ex.support.consigne}</p>
        </div>
      )
    case 'question_texte':
      return <p className="tcf-question-text is-large">{ex.support.consigne}</p>
    case 'entretien': {
      if (mode !== 'answers') return null
      const echanges =
        ex.support.echanges?.filter((e) => e.question.trim() && e.reponse.trim()) ?? []
      if (echanges.length) {
        return (
          <div className="tcf-modele tcf-entretien-dialogue">
            <b>Exemple d’entretien</b>
            <ol>
              {echanges.map((e, i) => (
                <li key={i}>
                  <p>
                    <b>Examinateur·trice :</b> {e.question}
                  </p>
                  <p>
                    <b>Candidat·e :</b> {e.reponse}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        )
      }
      return (
        <div className="tcf-modele">
          <b>Questions possibles de l’examinateur :</b>
          <ul className="tcf-entretien-questions">
            {ex.support.questions.filter((q) => q.trim()).map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </div>
      )
    }
    case 'trois_themes':
      return (
        <div className="tcf-po tcf-trois-themes">
          {ex.support.themes.map((t, i) => (
            <section key={i} className="tcf-po-theme-block">
              <p className="tcf-po-theme">
                Thème {i + 1} : {t.theme}
              </p>
              <ul className="tcf-po-images is-4">
                {t.images.map((src, k) => (
                  <li key={k}>
                    <TcfImage src={src} alt="" />
                  </li>
                ))}
              </ul>
              {mode === 'answers' && t.exemples_questions.some((q) => q.trim()) ? (
                <ul className="tcf-modele tcf-exemples is-two-cols">
                  {t.exemples_questions
                    .filter((q) => q.trim())
                    .slice(0, 8)
                    .map((q, k) => (
                      <li key={k}>{q}</li>
                    ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      )
    case 'image_interaction': {
      const s = ex.support
      return (
        <div className="tcf-po">
          <ul className="tcf-po-questions">
            {s.questions.filter((q) => q.trim()).map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
          {s.images.length > 1 ? (
            <ol className={`tcf-timeline${mode === 'answers' ? ' is-compact' : ''}`}>
              {s.images.map((src, i) => (
                <li key={i} className="tcf-timeline-step">
                  <span className="tcf-timeline-num">{i + 1}</span>
                  <TcfImage src={src} alt={`${ex.scene ?? ex.theme} - ${i + 1}`} className="tcf-image" />
                </li>
              ))}
            </ol>
          ) : (
            <TcfImage src={s.images[0]} alt="Image à décrire" className="tcf-image is-large" />
          )}
          <Modele text={s.description_modele} mode={mode} title="Description possible" />
        </div>
      )
    }
    case 'mots_theme':
      return (
        <div className="tcf-po">
          {ex.support.theme ? <p className="tcf-po-theme">Thème : {ex.support.theme}</p> : null}
          <ul className="tcf-mots">
            {ex.support.mots
              .filter((m) => m.trim())
              .map((mot, i) => (
                <li key={i} className="tcf-mot">
                  {mot}
                </li>
              ))}
          </ul>
          {mode === 'answers' && ex.support.exemples_questions.some((q) => q.trim()) ? (
            <div className="tcf-modele">
              <b>Exemples de questions :</b>
              <ul className="tcf-exemples is-two-cols">
                {ex.support.exemples_questions
                  .filter((q) => q.trim())
                  .slice(0, 8)
                  .map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
              </ul>
            </div>
          ) : null}
        </div>
      )
    case 'sequence_4_images':
      return (
        <div className="tcf-po">
          <ol className="tcf-sequence">
            {ex.support.images.map((src, i) => (
              <li key={i}>
                <span className="tcf-sequence-num">{i + 1}</span>
                <TcfImage src={src} alt={`Image ${i + 1}`} />
              </li>
            ))}
          </ol>
          <Modele text={ex.support.reponse_modele} mode={mode} />
        </div>
      )
    case 'image_unique':
      return (
        <div className="tcf-po">
          {ex.support.questions?.length ? (
            <ul className="tcf-po-questions">
              {ex.support.questions.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          ) : null}
          <TcfImage src={ex.support.image} alt="Image à décrire" className="tcf-image is-large" />
          <Modele text={ex.support.reponse_modele} mode={mode} />
        </div>
      )
    case 'dialogue':
      return ex.support.images?.length ? (
        <div className="tcf-po">
          <ul className={`tcf-po-images is-${ex.support.images.length}`}>
            {ex.support.images.map((src, i) => (
              <li key={i}>
                <TcfImage src={src} alt={`Image ${i + 1}`} />
              </li>
            ))}
          </ul>
        </div>
      ) : null
    case 'formulaire':
    case 'dialogue_a_completer':
      return null
  }
}

export { Modele, Paragraphs, TcfImage }
