import type { PreviewMode } from '@/math/types'
import type { TcfChoixRendu } from '@/tcf/types'
import { TcfImage } from './TexteSupport'

function Enonce({ numero, enonce, audioLabel }: { numero: number; enonce: string; audioLabel?: string }) {
  return (
    <p className="tcf-enonce">
      <span className="tcf-num">{numero}.</span>
      {audioLabel ? <span className="tcf-audio-tag">{audioLabel}</span> : null}
      {enonce}
    </p>
  )
}

/** Pastille de lettre : entourée au corrigé pour la bonne réponse (lisible en N&B). */
function Lettre({ lettre, on }: { lettre: string; on: boolean }) {
  return <span className={`tcf-lettre${on ? ' is-correct' : ''}`}>{lettre}</span>
}

export function QuestionQCMTexte({
  numero,
  enonce,
  choix,
  audioLabel,
  mode,
}: {
  numero: number
  enonce: string
  choix: TcfChoixRendu[]
  audioLabel?: string
  mode: PreviewMode
}) {
  const show = mode === 'answers'
  return (
    <div className="tcf-question">
      <Enonce numero={numero} enonce={enonce} audioLabel={audioLabel} />
      <ul className="tcf-qcm-texte">
        {choix.map((c) => (
          <li key={c.lettre} className={show && c.correct ? 'is-correct' : undefined}>
            <span className="tcf-case" aria-hidden>
              {show && c.correct ? '✔' : ''}
            </span>
            <Lettre lettre={c.lettre} on={show && c.correct} />
            <span>{c.texte}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function QuestionQCMImage({
  numero,
  enonce,
  choix,
  audioLabel,
  mode,
}: {
  numero: number
  enonce: string
  choix: TcfChoixRendu[]
  audioLabel?: string
  mode: PreviewMode
}) {
  const show = mode === 'answers'
  return (
    <div className="tcf-question">
      <Enonce numero={numero} enonce={enonce} audioLabel={audioLabel} />
      <ul className={`tcf-qcm-images is-${choix.length}`}>
        {choix.map((c) => (
          <li key={c.lettre} className={show && c.correct ? 'is-correct' : undefined}>
            <TcfImage src={c.image ?? ''} alt={`Choix ${c.lettre}`} />
            <span className="tcf-qcm-image-foot">
              <span className="tcf-case" aria-hidden>
                {show && c.correct ? '✔' : ''}
              </span>
              <Lettre lettre={c.lettre} on={show && c.correct} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Traits de réponse pleine largeur (couleur du thème). Le modèle s’affiche au corrigé. */
export function QuestionLignes({
  numero,
  enonce,
  nbLignes,
  reponseModele,
  audioLabel,
  mode,
}: {
  numero?: number
  enonce?: string
  nbLignes: number
  reponseModele?: string
  audioLabel?: string
  mode: PreviewMode
}) {
  return (
    <div className="tcf-question">
      {numero != null && enonce != null ? (
        <Enonce numero={numero} enonce={enonce} audioLabel={audioLabel} />
      ) : null}
      <LignesReponse nbLignes={nbLignes} texte={mode === 'answers' ? reponseModele : undefined} />
    </div>
  )
}

export function LignesReponse({ nbLignes, texte }: { nbLignes: number; texte?: string }) {
  const n = Math.max(1, nbLignes)
  return (
    <div className="tcf-lignes">
      {texte?.trim() ? <p className="tcf-lignes-modele">{texte}</p> : null}
      {Array.from({ length: n }, (_, i) => (
        <span key={i} className="answer-line-field tcf-ligne" aria-hidden />
      ))}
    </div>
  )
}

/** CO : 5 images, case sous chacune ; corrigé ✔ (à cocher) / ✘ (à laisser vide). */
export function ImagesACocher({
  numero,
  consigne,
  images,
  score,
  mode,
}: {
  numero: number
  consigne: string
  images: Array<{ id: string; image: string; correct: boolean }>
  score: 'par_image' | 'tout_ou_rien'
  mode: PreviewMode
}) {
  const show = mode === 'answers'
  return (
    <div className="tcf-question">
      {consigne ? <Enonce numero={numero} enonce={consigne} /> : null}
      <ul className="tcf-images-cocher">
        {images.map((img, i) => (
          <li
            key={img.id}
            className={show ? (img.correct ? 'is-correct' : 'is-wrong') : undefined}
          >
            <TcfImage src={img.image} alt={`Image ${i + 1}`} />
            <span className="tcf-case is-large" aria-label={show ? (img.correct ? 'à cocher' : 'à laisser vide') : undefined}>
              {show ? (img.correct ? '✔' : '✘') : ''}
            </span>
          </li>
        ))}
      </ul>
      {show ? (
        <p className="tcf-score-note">
          {score === 'tout_ou_rien'
            ? 'Notation : tout ou rien (les 5 images justes).'
            : 'Notation : 1 point par image juste (sur 5).'}
        </p>
      ) : null}
    </div>
  )
}
