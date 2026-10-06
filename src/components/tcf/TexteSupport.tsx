import type { PreviewMode } from '@/math/types'
import { tcfImageSrc } from '@/tcf/media'
import type { TcfExercise } from '@/tcf/types'
import { PlayerAudio } from './PlayerAudio'

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
  return resolved ? (
    <img className={className} src={resolved} alt={alt} />
  ) : (
    <span className={`${className} is-empty`} aria-hidden />
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

/** Support de l’exercice : document à lire, audio, images, consignes de production. */
export function TexteSupport({ exercise: ex, mode }: { exercise: TcfExercise; mode: PreviewMode }) {
  switch (ex.type_exercice) {
    case 'sms':
      return <SmsBubble from={ex.support.expediteur} text={ex.support.texte} />
    case 'email':
      return <EmailBox {...ex.support} />
    case 'annonce':
      return (
        <div className="tcf-annonce">
          {ex.support.titre ? <p className="tcf-annonce-title">{ex.support.titre}</p> : null}
          <div className="tcf-annonce-body">
            {ex.support.image ? <TcfImage src={ex.support.image} alt={ex.support.titre} /> : null}
            <div>
              <Paragraphs text={ex.support.texte} />
            </div>
          </div>
        </div>
      )
    case 'images_a_reconnaitre':
      return <PlayerAudio src={ex.support.audio} />
    case 'six_courts':
    case 'trois_moyens':
      return (
        <div className={`tcf-audio-list is-${ex.support.audios.length}`}>
          {ex.support.audios.map((src, i) => (
            <PlayerAudio key={i} src={src} label={`Audio ${i + 1}`} />
          ))}
        </div>
      )
    case 'complet':
    case 'association_images':
      return (
        <div>
          <PlayerAudio src={ex.support.audio} />
          <Modele text={ex.support.transcription} mode={mode} title="Transcription" />
        </div>
      )
    case 'image_question':
      return (
        <div className="tcf-pe-image">
          <TcfImage src={ex.support.image} alt="Image de l’exercice" />
          <p className="tcf-question-text">{ex.support.consigne}</p>
        </div>
      )
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
      return (
        <div>
          <p className="tcf-question-text is-large">{ex.support.consigne}</p>
          {ex.support.email ? (
            <dl className="tcf-email-head is-compose">
              <dt>À</dt>
              <dd>{ex.support.email.a}</dd>
              <dt>Objet</dt>
              <dd>{ex.support.email.objet}</dd>
            </dl>
          ) : null}
        </div>
      )
    case 'mots_theme':
      return (
        <div className="tcf-po">
          {ex.support.audio ? <PlayerAudio src={ex.support.audio} label="Questions de l’examinateur·trice" /> : null}
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
              <ul>
                {ex.support.exemples_questions
                  .filter((q) => q.trim())
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
      return (
        <div className="tcf-po">
          {ex.support.audio ? <PlayerAudio src={ex.support.audio} label="Répliques de l’examinateur·trice" /> : null}
          {ex.support.images?.length ? (
            <ul className={`tcf-po-images is-${ex.support.images.length}`}>
              {ex.support.images.map((src, i) => (
                <li key={i}>
                  <TcfImage src={src} alt={`Image ${i + 1}`} />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      )
    case 'formulaire':
    case 'dialogue_a_completer':
      return null
  }
}

export { Modele, Paragraphs, TcfImage }
