import type { MathItem, PreviewMode } from '@/math/types'
import { TcfInformations } from './TcfInformations'
import { TexteSupport } from './TexteSupport'
import { DialoguePO, FormulairePE, ZoneEcriture } from './TcfProduction'
import {
  AssociationSituations,
  GrilleOral,
  ImagesACocher,
  QuestionLignes,
  QuestionQCMImage,
  QuestionQCMTexte,
} from './TcfQuestions'

/**
 * Rendu d’un item TCF (layout `tcf`). Fiche élève et corrigé partagent
 * les mêmes items (mêmes choix mélangés) : seul `mode` change.
 */
export function TcfItemView({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const tcf = item.tcf
  if (!tcf) return null
  const points = item.points
  switch (tcf.kind) {
    case 'support':
      return <TexteSupport exercise={tcf.exercise} mode={mode} />
    case 'qcm':
      return tcf.mode === 'image' ? (
        <QuestionQCMImage {...tcf} points={points} mode={mode} />
      ) : (
        <QuestionQCMTexte {...tcf} points={points} mode={mode} />
      )
    case 'lignes':
      return <QuestionLignes {...tcf} points={points} mode={mode} />
    case 'images_a_cocher':
      return <ImagesACocher {...tcf} mode={mode} />
    case 'association':
      return <AssociationSituations situations={tcf.situations} mode={mode} />
    case 'formulaire':
      return <FormulairePE titre={tcf.titre} champs={tcf.champs} mode={mode} />
    case 'ecriture':
      return <ZoneEcriture {...tcf} mode={mode} />
    case 'dialogue':
      return <DialoguePO situation={tcf.situation} repliques={tcf.repliques} auCorrige={tcf.auCorrige} mode={mode} />
    case 'grille':
      return <GrilleOral grille={tcf.grille} />
    case 'vide':
      return <p className="tcf-vide">{tcf.message}</p>
    case 'informations':
      return <TcfInformations />
  }
}
