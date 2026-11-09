import { Fragment, type ReactNode } from 'react'
import { formatPointsLabel } from '@/tpm/test'
import type { PreviewMode } from '@/math/types'
import {
  answersForInlineBlanks,
  countInlineBlanks,
  hasInlineBlank,
} from '@/tcf/inline-blank'
import type {
  TcfCadreQuestion,
  TcfChoixRendu,
  TcfGrille,
  TcfLigneTableau,
  TcfTypeReponse,
} from '@/tcf/types'
import { TcfFormMarginIcons } from './TcfFormIcons'
import { TcfImage } from './TexteSupport'

const INLINE_BLANK_RE = /_{3,}|_ _ _/g

function InlineBlank({
  fill,
  asDots,
  toMargin,
}: {
  fill?: string
  asDots?: boolean
  /** Trait jusqu’à la marge (fiche « Nom : ___ »). */
  toMargin?: boolean
}) {
  const shown = fill?.trim()
  if (asDots && !shown) return <span className="tcf-blank-dots">. . .</span>
  return (
    <span
      className={`answer-line-field tcf-blank-inline${shown ? ' filled' : ''}${
        toMargin && !shown ? ' is-to-margin' : ''
      }`}
    >
      {shown || '\u00a0'}
    </span>
  )
}

/** Une seule consigne du type « Nom : ___ » → trait jusqu’à la marge. */
function isLabelBlankPrompt(text: string): boolean {
  return /^\s*[^_\n]{1,40}:\s*_{3,}\s*$/.test(text)
}

function themedParen(inner: string): ReactNode {
  const trimmed = inner.trim()
  if (/masculin|féminin/i.test(trimmed)) {
    return <> (<span className="tcf-verbe-theme">{trimmed}</span>)</>
  }
  const comma = trimmed.indexOf(',')
  const verb = (comma === -1 ? trimmed : trimmed.slice(0, comma)).trim()
  const extra = comma === -1 ? '' : trimmed.slice(comma)
  return (
    <>
      {' ('}
      <span className="tcf-verbe-theme">{verb}</span>
      {extra})
    </>
  )
}

/** Gender cues keep the theme color even away from an answer line. */
function renderGenderHints(text: string): ReactNode {
  return text.split(/(\([^)]*(?:masculin|féminin)[^)]*\))/gi).map((part, index) =>
    /^\([^)]*(?:masculin|féminin)/i.test(part)
      ? <span key={index}>(<span className="tcf-verbe-theme">{part.slice(1, -1)}</span>)</span>
      : part,
  )
}

/**
 * `___` / `_ _ _` → trait (largeur `--tcf-blank-inline-px`, défaut 200), ou « . . . » en QCM.
 * Verbe / numéro entre parenthèses immédiatement après un blanc : couleur du thème.
 */
export function renderEnonceText(
  text: string,
  fills: string[] = [],
  blankStyle: 'line' | 'dots' = 'line',
): ReactNode {
  const toMargin = blankStyle === 'line' && isLabelBlankPrompt(text)
  const nodes: ReactNode[] = []
  let last = 0
  let blankIndex = 0
  let key = 0
  INLINE_BLANK_RE.lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = INLINE_BLANK_RE.exec(text))) {
    if (match.index > last) nodes.push(<Fragment key={`t${key}`}>{renderGenderHints(text.slice(last, match.index))}</Fragment>)
    nodes.push(
      <InlineBlank
        key={`b${key}`}
        fill={fills[blankIndex]}
        asDots={blankStyle === 'dots'}
        toMargin={toMargin}
      />,
    )
    blankIndex += 1
    let end = match.index + match[0].length
    const after = text.slice(end)
    const paren = after.match(/^\s*\(\s*([^)]+?)\s*\)/)
    if (paren) {
      nodes.push(<Fragment key={`p${key}`}>{themedParen(paren[1]!)}</Fragment>)
      end += paren[0].length
      INLINE_BLANK_RE.lastIndex = end
    }
    last = end
    key += 1
  }
  if (nodes.length === 0) return renderGenderHints(text)
  if (last < text.length) nodes.push(<Fragment key="tail">{renderGenderHints(text.slice(last))}</Fragment>)
  return nodes
}

/** Barème « / 1 point », visible seulement en mode évaluation (`.is-eval`). */
export function TcfPoints({ points }: { points?: number }) {
  return points != null ? <span className="tcf-pts">/ {formatPointsLabel(points)}</span> : null
}

function Enonce({
  numero,
  numeroLabel,
  enonce,
  audioLabel,
  audioFrame,
  points,
  blankAnswers,
  blankStyle = 'line',
  showNumero = true,
  trailing,
}: {
  numero: number
  /** Remplace le numéro (ex. « a » → « a. »). */
  numeroLabel?: string
  enonce: string
  audioLabel?: string
  /** Pastille Audio N déjà en coin de cadre : ne pas la répéter dans l’énoncé. */
  audioFrame?: boolean
  points?: number
  image?: string
  blankAnswers?: string
  blankStyle?: 'line' | 'dots'
  /** Afficher le numéro (désactivé pour six courts seul dans le cadre). */
  showNumero?: boolean
  /** Piste lue dans le bandeau du corrigé. */
  audioSrc?: string
  /** Icônes de format (cadre multi-questions) : à droite de l’énoncé. */
  trailing?: ReactNode
}) {
  const fills = answersForInlineBlanks(blankAnswers, countInlineBlanks(enonce))
  const fillBlank = blankStyle === 'line' && isLabelBlankPrompt(enonce)
  const label = (numeroLabel ?? String(numero)).trim()
  return (
    <p className="tcf-enonce">
      {showNumero ? <span className="tcf-num">{label}.</span> : null}
      {audioLabel && !audioFrame ? <span className="tcf-audio-tag">{audioLabel}</span> : null}
      <span className={`tcf-enonce-text${fillBlank ? ' is-fill-blank' : ''}`}>
        {renderEnonceText(enonce, fills, blankStyle)}
      </span>
      <TcfPoints points={points} />
      {trailing}
    </p>
  )
}

function AudioFrameHead({ label, audioSrc }: { label: string; audioSrc?: string }) {
  return (
    <div className={`tcf-audio-frame-head${audioSrc ? ' has-player' : ''}`}>
      <span className={`tcf-audio-frame-label${label.startsWith('Audio ') ? ' is-audio' : ''}`}>{label}</span>
      {audioSrc ? (
        <audio className="tcf-audio-frame-player no-print" aria-label={`Enregistrement — ${label}`} controls preload="none" src={audioSrc}>
          Écoutez l’enregistrement.
        </audio>
      ) : null}
    </div>
  )
}

/** Énoncé au-dessus ; image(s) à gauche des réponses. */
function QuestionShell({
  image,
  images,
  numero,
  enonceSlot,
  audioLabel,
  audioFrame,
  audioSrc,
  children,
}: {
  image?: string
  images?: string[]
  numero: number
  enonceSlot?: ReactNode
  audioLabel?: string
  audioFrame?: boolean
  /** Lecteur du corrigé, dans le bandeau. */
  audioSrc?: string
  children: ReactNode
}) {
  const pics = (images?.length ? images : image ? [image] : [])
    .map((src) => src.trim())
    .filter(Boolean)
  const framed = Boolean(audioFrame)
  const head = framed && audioLabel ? <AudioFrameHead label={audioLabel} audioSrc={audioSrc} /> : null
  const answers = pics.length ? (
    <div className="tcf-q-beside">
      <div className={`tcf-q-beside-images${pics.length > 1 ? ' is-multi' : ''}`}>
        {pics.map((src, i) => (
          <TcfImage
            key={`${src}-${i}`}
            src={src}
            alt={`Image ${i + 1} de la question ${numero}`}
            className="tcf-image is-question is-beside"
          />
        ))}
      </div>
      <div className="tcf-q-beside-body">{children}</div>
    </div>
  ) : (
    children
  )
  const body = (
    <>
      {enonceSlot}
      {answers}
    </>
  )
  return (
    <div
      className={`tcf-question${pics.length ? ' tcf-q-enonce-above' : ''}${
        framed ? ' is-audio-frame' : ''
      }`}
    >
      {head}
      {framed ? <div className="tcf-audio-frame-body">{body}</div> : body}
    </div>
  )
}

/** Pastille de lettre (sans entourage au corrigé — le remplissage est sur `.tcf-case`). */
function Lettre({ lettre }: { lettre: string }) {
  return <span className="tcf-lettre">{lettre}</span>
}

type QuestionHead = {
  numero: number
  numeroLabel?: string
  enonce: string
  audioLabel?: string
  audioFrame?: boolean
  points?: number
  image?: string
  images?: string[]
  showNumero?: boolean
  blankStyle?: 'line' | 'dots'
  /** Piste lue dans le bandeau du corrigé. */
  audioSrc?: string
  /** Icônes Texte / Image / Phrase à droite de l’énoncé (cadre multi-questions). */
  trailing?: ReactNode
}

export function QuestionQCMTexte({
  choix,
  mode,
  ...head
}: QuestionHead & {
  choix: TcfChoixRendu[]
  mode: PreviewMode
}) {
  const show = mode === 'answers'
  return (
    <QuestionShell
      image={head.image}
      images={head.images}
      numero={head.numero}
      audioLabel={head.audioLabel}
      audioFrame={head.audioFrame}
      audioSrc={mode === 'answers' ? head.audioSrc : undefined}
      enonceSlot={
        <Enonce
          {...head}
          blankStyle={head.blankStyle ?? 'dots'}
          showNumero={head.showNumero ?? !head.audioFrame}
        />
      }
    >
      <ul className="tcf-qcm-texte">
        {choix.map((c) => (
          <li key={c.lettre} className={show && c.correct ? 'is-correct' : undefined}>
            <span className={`tcf-case${show && c.correct ? ' is-filled' : ''}`} aria-hidden />
            <Lettre lettre={c.lettre} />
            <span>{c.texte}</span>
          </li>
        ))}
      </ul>
    </QuestionShell>
  )
}

export function QuestionQCMImage({
  choix,
  mode,
  ...head
}: QuestionHead & {
  choix: TcfChoixRendu[]
  mode: PreviewMode
}) {
  const show = mode === 'answers'
  return (
    <QuestionShell
      image={head.image}
      images={head.images}
      numero={head.numero}
      audioLabel={head.audioLabel}
      audioFrame={head.audioFrame}
      audioSrc={mode === 'answers' ? head.audioSrc : undefined}
      enonceSlot={
        <Enonce
          {...head}
          blankStyle={head.blankStyle ?? 'dots'}
          showNumero={head.showNumero ?? !head.audioFrame}
        />
      }
    >
      <ul className={`tcf-qcm-images is-${choix.length}`}>
        {choix.map((c) => (
          <li key={c.lettre} className={show && c.correct ? 'is-correct' : undefined}>
            <TcfImage src={c.image ?? ''} alt={`Choix ${c.lettre}`} />
            <span className="tcf-qcm-image-foot">
              <span className={`tcf-case${show && c.correct ? ' is-filled' : ''}`} aria-hidden />
              <Lettre lettre={c.lettre} />
            </span>
          </li>
        ))}
      </ul>
    </QuestionShell>
  )
}

/** Traits de réponse pleine largeur (couleur du thème). Le modèle s’affiche au corrigé. */
export function QuestionLignes({
  nbLignes,
  reponseModele,
  tableau,
  mode,
  ...head
}: QuestionHead & {
  nbLignes: number
  reponseModele?: string
  tableau?: TcfLigneTableau[]
  mode: PreviewMode
}) {
  const show = mode === 'answers'
  const inline = hasInlineBlank(head.enonce)
  return (
    <QuestionShell
      image={head.image}
      images={head.images}
      numero={head.numero}
      audioLabel={head.audioLabel}
      audioFrame={head.audioFrame}
      audioSrc={mode === 'answers' ? head.audioSrc : undefined}
      enonceSlot={
        <Enonce
          {...head}
          blankAnswers={show && inline ? reponseModele : undefined}
          showNumero={head.showNumero ?? !head.audioFrame}
        />
      }
    >
      {tableau?.length ? (
        <table className="tcf-tableau">
          <tbody>
            {tableau.map((row, i) => (
              <tr key={i}>
                <th scope="row">{row.label}</th>
                <td>{show ? row.reponse : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
      {inline ? null : nbLignes > 0 ? (
        <LignesReponse nbLignes={nbLignes} texte={show ? reponseModele : undefined} />
      ) : show && reponseModele?.trim() ? (
        <LignesReponse nbLignes={1} texte={reponseModele} />
      ) : null}
    </QuestionShell>
  )
}

/** Cadre Audio N contenant plusieurs questions (trois audios moyens). */
export function AudioCadre({
  audioLabel,
  audioSrc,
  questions,
  mode,
  onSelectForm,
  blankStyle,
}: {
  blankStyle?: 'line' | 'dots'
  audioLabel: string
  audioSrc?: string
  questions: TcfCadreQuestion[]
  mode: PreviewMode
  onSelectForm?: (modeIndex: number, form: TcfTypeReponse) => void
}) {
  return (
    <div className="tcf-question is-audio-frame is-audio-cadre">
      <AudioFrameHead label={audioLabel} audioSrc={mode === 'answers' ? audioSrc : undefined} />
      <div className="tcf-audio-frame-body tcf-audio-cadre-body">
        {questions.map((q) => {
          const formSelect = q.formSelect
          const active = formSelect?.active
          const forms =
            onSelectForm && formSelect && active && q.formModeIndex != null ? (
              <TcfFormMarginIcons
                filled={formSelect.filled}
                active={active}
                layout="cadre"
                onSelect={(form) => onSelectForm(q.formModeIndex!, form)}
              />
            ) : null
          const body =
            q.kind === 'qcm' ? (
              q.mode === 'image' ? (
                <QuestionQCMImage
                  key={q.numero}
                  numero={q.numero}
                  numeroLabel={q.numeroLabel}
                  enonce={q.enonce}
                  choix={q.choix}
                  blankStyle={blankStyle}
                  image={q.image}
                  images={q.images}
                  points={q.points}
                  showNumero
                  mode={mode}
                />
              ) : (
                <QuestionQCMTexte
                  key={q.numero}
                  numero={q.numero}
                  numeroLabel={q.numeroLabel}
                  enonce={q.enonce}
                  choix={q.choix}
                  blankStyle={blankStyle}
                  image={q.image}
                  images={q.images}
                  points={q.points}
                  showNumero
                  mode={mode}
                />
              )
            ) : (
              <QuestionLignes
                key={q.numero}
                numero={q.numero}
                numeroLabel={q.numeroLabel}
                enonce={q.enonce}
                nbLignes={q.nbLignes}
                reponseModele={q.reponseModele}
                tableau={q.tableau}
                image={q.image}
                images={q.images}
                points={q.points}
                showNumero
                mode={mode}
              />
            )
          return (
            <div key={q.numero} className="tcf-audio-cadre-q">
              {forms}
              {body}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function LignesReponse({ nbLignes, texte }: { nbLignes: number; texte?: string }) {
  const n = Math.max(1, nbLignes)
  const answer = texte?.trim()
  if (answer) {
    return (
      <div className="tcf-lignes">
        <span className="answer-line-field tcf-ligne filled is-plain">{answer}</span>
        {Array.from({ length: Math.max(0, n - 1) }, (_, i) => (
          <span key={i} className="answer-line-field tcf-ligne is-plain" aria-hidden />
        ))}
      </div>
    )
  }
  return (
    <div className="tcf-lignes">
      {Array.from({ length: n }, (_, i) => (
        <span key={i} className="answer-line-field tcf-ligne" aria-hidden />
      ))}
    </div>
  )
}

/** CO : bandeau Situation A–F ; au corrigé, la piste du dialogue correspondant. */
export function AssociationSituations({
  situations,
  mode,
}: {
  situations: Array<{ lettre: string; image: string; dialogue: number | null; audioSrc?: string }>
  mode: PreviewMode
}) {
  const show = mode === 'answers'
  const n = situations.length
  return (
    <ul className={`tcf-situations${n > 6 ? ' is-many' : ''}`}>
      {situations.map((s, i) => (
        <li key={`${s.lettre}-${i}`} className="tcf-question is-audio-frame tcf-situation-frame">
          <AudioFrameHead label={`Situation ${s.lettre}`} audioSrc={show && s.dialogue != null ? s.audioSrc : undefined} />
          <div className="tcf-situation-body">
            <TcfImage src={s.image} alt={`Scène ${s.lettre}`} />
            <span className="tcf-situation-foot">
              <span className="tcf-dialogue-label">Audio n°&nbsp;:</span>
              <span className="answer-line-field tcf-situation-num">
                {show ? (s.dialogue != null ? String(s.dialogue) : '—') : ''}
              </span>
            </span>
          </div>
        </li>
      ))}
    </ul>
  )
}

/** Grille de l’oral (critères notés globalement). */
export function GrilleOral({ grille }: { grille: TcfGrille }) {
  return (
    <table className="tcf-grille">
      <tbody>
        {grille.criteres.map((critere, i) => (
          <tr key={critere}>
            <th scope="row">{critere}</th>
            {i === 0 ? (
              <td rowSpan={grille.criteres.length} className="tcf-grille-points">
                … / {formatPointsLabel(grille.points)}
              </td>
            ) : null}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const OBJET_LETTRES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] as const

/** CO objets A1 : un cadre Objet A–E avec image et choix Oui / Non. */
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
          <li key={img.id} className="tcf-question is-audio-frame tcf-objet-frame">
            <AudioFrameHead label={`Objet ${OBJET_LETTRES[i] ?? i + 1}`} />
            <div className="tcf-objet-body">
              <TcfImage src={img.image} alt={`Objet ${OBJET_LETTRES[i] ?? i + 1}`} />
              <div className="tcf-yn" aria-label={show ? (img.correct ? 'Oui' : 'Non') : undefined}>
                <span className="tcf-yn-option">
                  <span className="tcf-yn-label">Oui</span>
                  <span
                    className={`tcf-case is-large${show && img.correct ? ' is-filled' : ''}`}
                    aria-hidden
                  />
                </span>
                <span className="tcf-yn-option">
                  <span className="tcf-yn-label">Non</span>
                  <span
                    className={`tcf-case is-large${show && !img.correct ? ' is-filled' : ''}`}
                    aria-hidden
                  />
                </span>
              </div>
            </div>
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
