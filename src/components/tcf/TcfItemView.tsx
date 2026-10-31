import type { MathItem, PreviewMode } from '@/math/types'
import type { TcfCadreQuestion, TcfSheetItem, TcfTypeReponse } from '@/tcf/types'
import { TcfInformations } from './TcfInformations'
import { TexteSupport } from './TexteSupport'
import { DialoguePO, FormulairePE, TexteImagesPE, ZoneEcriture } from './TcfProduction'
import {
  AssociationSituations,
  AudioCadre,
  GrilleOral,
  ImagesACocher,
  QuestionLignes,
  QuestionQCMImage,
  QuestionQCMTexte,
} from './TcfQuestions'

/** Applique la forme active (Texte / Image / Phrase) stockée sur l’item. */
function withActiveForm(tcf: TcfSheetItem, formMode?: TcfTypeReponse): TcfSheetItem {
  if (tcf.kind !== 'qcm' && tcf.kind !== 'lignes') return tcf
  const fs = tcf.formSelect
  if (!fs) return tcf
  const active = formMode && fs.filled.includes(formMode) ? formMode : fs.active
  const variant = fs.variants[active]
  if (!variant) return { ...tcf, formSelect: { ...fs, active } }
  const head = {
    numero: tcf.numero,
    numeroLabel: tcf.numeroLabel,
    enonce: tcf.enonce,
    audioLabel: tcf.audioLabel,
    audioFrame: tcf.audioFrame,
    showNumero: tcf.showNumero,
    image: tcf.image,
    images: tcf.images,
    formSelect: { ...fs, active },
  }
  if (variant.kind === 'lignes') {
    return {
      kind: 'lignes',
      ...head,
      nbLignes: variant.nbLignes ?? 2,
      reponseModele: variant.reponseModele,
      tableau: variant.tableau,
    }
  }
  return {
    kind: 'qcm',
    ...head,
    mode: variant.mode ?? 'texte',
    choix: variant.choix ?? [],
  }
}

/** Même logique pour une question dans un cadre Audio (trois moyens). */
function withCadreActiveForm(
  q: TcfCadreQuestion,
  formMode?: TcfTypeReponse,
): TcfCadreQuestion {
  const fs = q.formSelect
  if (!fs) return q
  const active = formMode && fs.filled.includes(formMode) ? formMode : fs.active
  const variant = fs.variants[active]
  if (!variant) return { ...q, formSelect: { ...fs, active } }
  const head = {
    numero: q.numero,
    numeroLabel: q.numeroLabel,
    enonce: q.enonce,
    image: q.image,
    images: q.images,
    formSelect: { ...fs, active },
    formModeIndex: q.formModeIndex,
    points: q.points,
    answer: q.answer,
  }
  if (variant.kind === 'lignes') {
    return {
      kind: 'lignes',
      ...head,
      nbLignes: variant.nbLignes ?? 2,
      reponseModele: variant.reponseModele,
      tableau: variant.tableau,
    }
  }
  return {
    kind: 'qcm',
    ...head,
    mode: variant.mode ?? 'texte',
    choix: variant.choix ?? [],
  }
}

/**
 * Rendu d’un item TCF (layout `tcf`). Fiche élève et corrigé partagent
 * les mêmes items (mêmes choix mélangés) : seul `mode` change.
 */
export function TcfItemView({
  item,
  mode,
  tcfFormMode,
  tcfFormModes,
  onSelectTcfFormAt,
  formulaireLetterGrid,
  hideMotsBanque,
}: {
  item: MathItem
  mode: PreviewMode
  tcfFormMode?: TcfTypeReponse
  /** Modes par index global (ex. 2 : questions dans les cadres). */
  tcfFormModes?: Array<TcfTypeReponse | undefined>
  onSelectTcfFormAt?: (modeIndex: number, form: TcfTypeReponse) => void
  formulaireLetterGrid?: boolean
  hideMotsBanque?: boolean
}) {
  const raw = item.tcf
  if (!raw) return null
  const tcf = withActiveForm(raw, tcfFormMode)
  const points = item.points
  switch (tcf.kind) {
    case 'support': {
      const exercise =
        hideMotsBanque && tcf.exercise.mots_banque
          ? { ...tcf.exercise, mots_banque: undefined }
          : tcf.exercise
      return <TexteSupport exercise={exercise} mode={mode} />
    }
    case 'qcm':
      return tcf.mode === 'image' ? (
        <QuestionQCMImage {...tcf} points={points} mode={mode} />
      ) : (
        <QuestionQCMTexte {...tcf} points={points} mode={mode} />
      )
    case 'lignes':
      return <QuestionLignes {...tcf} points={points} mode={mode} />
    case 'audio_cadre': {
      const questions = tcf.questions.map((q) => {
        const idx = q.formModeIndex
        const override = idx != null ? tcfFormModes?.[idx] : undefined
        return withCadreActiveForm(q, override)
      })
      return (
        <AudioCadre
          audioLabel={tcf.audioLabel}
          questions={questions}
          mode={mode}
          onSelectForm={
            onSelectTcfFormAt
              ? (modeIndex, form) => onSelectTcfFormAt(modeIndex, form)
              : undefined
          }
        />
      )
    }
    case 'images_a_cocher':
      return <ImagesACocher {...tcf} mode={mode} />
    case 'association':
      return <AssociationSituations situations={tcf.situations} mode={mode} />
    case 'formulaire':
      return (
        <FormulairePE
          titre={tcf.titre}
          champs={tcf.champs}
          mode={mode}
          letterGrid={formulaireLetterGrid}
        />
      )
    case 'texte_images':
      return <TexteImagesPE texte={tcf.texte} mots={tcf.mots} mode={mode} />
    case 'ecriture':
      return <ZoneEcriture {...tcf} mode={mode} />
    case 'dialogue':
      return <DialoguePO {...tcf} mode={mode} />
    case 'grille':
      return <GrilleOral grille={tcf.grille} />
    case 'vide':
      return <p className="tcf-vide">{tcf.message}</p>
    case 'informations':
      return <TcfInformations />
  }
}
