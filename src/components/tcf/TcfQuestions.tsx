import { Fragment, type ReactNode } from 'react'
import { formatPointsLabel } from '@/tpm/test'
import type { PreviewMode } from '@/math/types'
import {
  answersForInlineBlanks,
  countInlineBlanks,
  hasInlineBlank,
} from '@/tcf/inline-blank'
import type { TcfChoixRendu, TcfGrille, TcfLigneTableau } from '@/tcf/types'
import { TcfImage } from './TexteSupport'

const INLINE_BLANK_RE = /_{3,}|_ _ _/g

function InlineBlank({
  fill,
  asDots,
  toMargin,
  short,
}: {
  fill?: string
  asDots?: boolean
  /** Trait jusqu’à la marge (fiche « Nom : ___ »). */
  toMargin?: boolean
  /** Trait court (50 px) — prépositions, etc. */
  short?: boolean
}) {
  const shown = fill?.trim()
  if (asDots && !shown) return <span className="tcf-blank-dots">. . .</span>
  return (
    <span
      className={`answer-line-field tcf-blank-inline${shown ? ' filled' : ''}${
        toMargin && !shown ? ' is-to-margin' : ''
      }${short && !shown ? ' is-short' : ''}`}
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

/**
 * `___` / `_ _ _` → trait 200 px (50 px si réponse courte), ou « . . . » en mode QCM.
 * Verbe entre parenthèses immédiatement après un blanc : couleur du thème.
 */
function renderEnonceText(
  text: string,
  fills: string[] = [],
  blankStyle: 'line' | 'dots' = 'line',
  blankSizeHints: string[] = [],
): ReactNode {
  const toMargin = blankStyle === 'line' && isLabelBlankPrompt(text)
  const nodes: ReactNode[] = []
  let last = 0
  let blankIndex = 0
  let key = 0
  INLINE_BLANK_RE.lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = INLINE_BLANK_RE.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index))
    const hint = (fills[blankIndex] ?? blankSizeHints[blankIndex] ?? '').trim()
    const short = blankStyle === 'line' && hint.length > 0 && hint.length <= 4
    nodes.push(
      <InlineBlank
        key={`b${key}`}
        fill={fills[blankIndex]}
        asDots={blankStyle === 'dots'}
        toMargin={toMargin}
        short={short}
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
  if (nodes.length === 0) return text
  if (last < text.length) nodes.push(text.slice(last))
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
  points,
  blankAnswers,
  blankSizeHint,
  blankStyle = 'line',
}: {
  numero: number
  /** Remplace le numéro (ex. « a » → « a. »). */
  numeroLabel?: string
  enonce: string
  audioLabel?: string
  points?: number
  image?: string
  blankAnswers?: string
  /** Indice de longueur pour dimensionner le trait (ex. préposition courte). */
  blankSizeHint?: string
  blankStyle?: 'line' | 'dots'
}) {
  const fills = answersForInlineBlanks(blankAnswers, countInlineBlanks(enonce))
  const hints = answersForInlineBlanks(blankSizeHint, countInlineBlanks(enonce))
  const fillBlank = blankStyle === 'line' && isLabelBlankPrompt(enonce)
  const label = (numeroLabel ?? String(numero)).trim()
  return (
    <p className="tcf-enonce">
      <span className="tcf-num">{label}.</span>
      {audioLabel ? <span className="tcf-audio-tag">{audioLabel}</span> : null}
      <span className={`tcf-enonce-text${fillBlank ? ' is-fill-blank' : ''}`}>
        {renderEnonceText(enonce, fills, blankStyle, hints)}
      </span>
      <TcfPoints points={points} />
    </p>
  )
}

/** Énoncé au-dessus ; image(s) à gauche des réponses. */
function QuestionShell({
  image,
  images,
  numero,
  enonceSlot,
  children,
}: {
  image?: string
  images?: string[]
  numero: number
  enonceSlot?: ReactNode
  children: ReactNode
}) {
  const pics = (images?.length ? images : image ? [image] : [])
    .map((src) => src.trim())
    .filter(Boolean)
  if (!pics.length) {
    return (
      <div className="tcf-question">
        {enonceSlot}
        {children}
      </div>
    )
  }
  return (
    <div className="tcf-question tcf-q-enonce-above">
      {enonceSlot}
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
  points?: number
  image?: string
  images?: string[]
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
      enonceSlot={<Enonce {...head} blankStyle="dots" />}
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
      enonceSlot={<Enonce {...head} blankStyle="dots" />}
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
      enonceSlot={
        <Enonce
          {...head}
          blankAnswers={show && inline ? reponseModele : undefined}
          blankSizeHint={inline ? reponseModele : undefined}
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

/** CO : situations illustrées, « Situation n° … » sous chaque image ; corrigé = n° ou « — ». */
export function AssociationSituations({
  situations,
  mode,
}: {
  situations: Array<{ lettre: string; image: string; dialogue: number | null }>
  mode: PreviewMode
}) {
  const show = mode === 'answers'
  return (
    <ul className="tcf-situations">
      {situations.map((s) => (
        <li key={s.lettre}>
          <TcfImage src={s.image} alt={`Situation ${s.lettre}`} />
          <span className="tcf-situation-foot">
            <b>{s.lettre}.</b> Situation n°
            <span className="answer-line-field compact tcf-situation-num">
              {show ? (s.dialogue ?? '—') : ''}
            </span>
          </span>
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

/** CO objets A1 : 5 images (2 par ligne, dernière centrée), Oui / Non sous chacune. */
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
            <div className="tcf-yn" aria-label={show ? (img.correct ? 'Oui' : 'Non') : undefined}>
              <span className="tcf-yn-option">
                <span
                  className={`tcf-case is-large${show && img.correct ? ' is-filled' : ''}`}
                  aria-hidden
                />
                <span className="tcf-yn-label">Oui</span>
              </span>
              <span className="tcf-yn-option">
                <span
                  className={`tcf-case is-large${show && !img.correct ? ' is-filled' : ''}`}
                  aria-hidden
                />
                <span className="tcf-yn-label">Non</span>
              </span>
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
