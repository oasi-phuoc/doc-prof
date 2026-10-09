/**
 * Trois formes de réponse TCF (Texte / Image / Phrase) par question.
 * La forme active reste `type_reponse` ; les autres vivent dans `formes`.
 */
import { emptyTcfQuestion } from './templates'
import type {
  TcfChoixImage,
  TcfChoixTexte,
  TcfFormeLignes,
  TcfFormeQcmImage,
  TcfFormeQcmTexte,
  TcfLigneTableau,
  TcfQuestion,
  TcfTypeReponse,
} from './types'

export const TCF_FORME_LABELS: Record<TcfTypeReponse, string> = {
  qcm_texte: 'Texte',
  qcm_image: 'Image',
  lignes: 'Phrase',
}

export function extractActiveForme(q: TcfQuestion): TcfFormeQcmTexte | TcfFormeQcmImage | TcfFormeLignes {
  if (q.type_reponse === 'lignes') {
    return { nb_lignes: q.nb_lignes, reponse_modele: q.reponse_modele, tableau: q.tableau }
  }
  if (q.type_reponse === 'qcm_image') {
    return { melanger: q.melanger, choix: q.choix }
  }
  return { melanger: q.melanger, choix: q.choix }
}

/** Une forme est remplie si elle a du contenu exploitable (pas un gabarit vide). */
export function isFormeFilled(
  type: TcfTypeReponse,
  forme: TcfFormeQcmTexte | TcfFormeQcmImage | TcfFormeLignes | undefined | null,
): boolean {
  if (!forme) return false
  if (type === 'lignes') {
    const f = forme as TcfFormeLignes
    return Boolean(
      (f.reponse_modele && f.reponse_modele.trim()) ||
        (f.tableau && f.tableau.some((row) => row.label.trim() || row.reponse.trim())),
    )
  }
  if (type === 'qcm_texte') {
    const choix = (forme as TcfFormeQcmTexte).choix ?? []
    return choix.some((c) => c.texte?.trim())
  }
  const choix = (forme as TcfFormeQcmImage).choix ?? []
  return choix.some((c) => c.image?.trim())
}

/** Formes disponibles : la forme active + les variantes vraiment remplies. */
export function filledForms(q: TcfQuestion): TcfTypeReponse[] {
  const out: TcfTypeReponse[] = [q.type_reponse]
  for (const type of ['qcm_texte', 'qcm_image', 'lignes'] as const) {
    if (type === q.type_reponse) continue
    if (isFormeFilled(type, q.formes?.[type])) out.push(type)
  }
  return out
}

function asQuestion(
  base: Pick<TcfQuestion, 'enonce' | 'audio' | 'points' | 'image' | 'formes'>,
  type: TcfTypeReponse,
  forme: TcfFormeQcmTexte | TcfFormeQcmImage | TcfFormeLignes,
): TcfQuestion {
  if (type === 'lignes') {
    const f = forme as TcfFormeLignes
    return {
      enonce: base.enonce,
      audio: base.audio,
      points: base.points,
      image: base.image,
      formes: base.formes,
      type_reponse: 'lignes',
      nb_lignes: f.nb_lignes,
      reponse_modele: f.reponse_modele,
      tableau: f.tableau,
    }
  }
  if (type === 'qcm_image') {
    const f = forme as TcfFormeQcmImage
    return {
      enonce: base.enonce,
      audio: base.audio,
      points: base.points,
      image: base.image,
      formes: base.formes,
      type_reponse: 'qcm_image',
      melanger: f.melanger,
      choix: f.choix as TcfChoixImage[],
    }
  }
  const f = forme as TcfFormeQcmTexte
  return {
    enonce: base.enonce,
    audio: base.audio,
    points: base.points,
    image: base.image,
    formes: base.formes,
    type_reponse: 'qcm_texte',
    melanger: f.melanger,
    choix: f.choix as TcfChoixTexte[],
  }
}

/**
 * Change la forme active en préservant les autres dans `formes`.
 * Si la cible n’existe pas encore, crée un gabarit vide (éditable).
 */
export function switchQuestionForm(q: TcfQuestion, next: TcfTypeReponse): TcfQuestion {
  if (next === q.type_reponse) return q
  const current = extractActiveForme(q)
  const formes = { ...(q.formes ?? {}) }
  if (q.type_reponse === 'qcm_texte') formes.qcm_texte = current as TcfFormeQcmTexte
  else if (q.type_reponse === 'qcm_image') formes.qcm_image = current as TcfFormeQcmImage
  else formes.lignes = current as TcfFormeLignes

  const target = formes[next] ?? extractActiveForme(emptyTcfQuestion(next))
  delete formes[next]
  const nextFormes = Object.keys(formes).length ? formes : undefined
  return asQuestion(
    { enonce: q.enonce, audio: q.audio, points: q.points, image: q.image, formes: nextFormes },
    next,
    target,
  )
}

/** Résout la question pour une forme active (génération fiche). */
export function resolveQuestionForm(q: TcfQuestion, active: TcfTypeReponse): TcfQuestion {
  if (active === q.type_reponse) return q
  const forme = q.formes?.[active]
  if (!forme || !isFormeFilled(active, forme)) return q
  return switchQuestionForm(q, active)
}

export type TcfFormVariant = {
  kind: 'qcm' | 'lignes'
  mode?: 'texte' | 'image'
  choix?: Array<{ lettre: string; texte?: string; image?: string; correct: boolean }>
  nbLignes?: number
  reponseModele?: string
  tableau?: TcfLigneTableau[]
  answer: string
}

/** Consigne « Barème (…) » à ne pas afficher sur la fiche élève. */
export function isTcfBaremeConsigne(text: string | null | undefined): boolean {
  return Boolean(text?.trim().match(/^Barème\b/i))
}
