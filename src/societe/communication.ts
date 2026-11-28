import type { Rng } from '@/math/rng'
import type { MathItem, PageConfig } from '@/math/types'
import { ficheCommunicationItems, ficheQuestion } from '@/francais/fiches-communication'
import type { TcfExercise, TcfNiveau } from '@/tcf/types'
import { listeningStatements } from './ecoute'
import type { SocieteImage, SocieteNiveau, SocieteProduction, SocieteUnite } from './types'

type Competence = 'ce' | 'co' | 'po' | 'pe'

const niveaux: Record<SocieteNiveau, TcfNiveau> = { A1: 'A0-A1', A2: 'A1-A2', B1: 'A2-B1' }
const lignes: Record<SocieteNiveau, number> = { A1: 4, A2: 6, B1: 9 }

function productionPrompt({ consigne, actions }: SocieteProduction): string {
  return [consigne, ...actions.map((action) => `• ${action}`)].join('\n')
}

function communicationExercise(
  unit: SocieteUnite,
  kind: Competence,
  context: SocieteImage | undefined,
  documentImage: SocieteImage | undefined,
  listeningImage: SocieteImage | undefined,
): TcfExercise {
  const common = {
    id: `societe-${unit.id}-${kind}`,
    niveau: niveaux[unit.niveau],
    theme: unit.titre,
    scene: unit.titre,
    questions: [],
  }
  switch (kind) {
    case 'ce':
      return {
        ...common,
        competence: 'CE',
        type_exercice: 'annonce',
        support: {
          titre: unit.document.titre,
          texte: unit.document.lignes.join('\n\n'),
          image: documentImage?.src ?? null,
        },
        questions: unit.document.questions.map(ficheQuestion),
      }
    case 'co':
      return {
        ...common,
        competence: 'CO',
        type_exercice: 'complet',
        support: {
          audio: `/lib/audio/societe/${unit.id}.mp3`,
          transcription: unit.ecoute.transcription,
          image: listeningImage?.src,
          image_description: listeningImage?.alt,
        },
        questions: unit.ecoute.questions.map(ficheQuestion),
      }
    case 'po':
      return {
        ...common,
        competence: 'PO',
        type_exercice: 'dialogue',
        support: {
          situation: productionPrompt(unit.oral),
          images: context ? [context.src] : undefined,
          repliques: [{ locuteur: 'eleve', texte: unit.oral.exemple }],
          repliques_au_corrige: true,
        },
      }
    case 'pe': {
      const support = {
        consigne: productionPrompt(unit.ecrit),
        reponse_modele: unit.ecrit.exemple,
        nb_mots: {},
      }
      return context
        ? { ...common, competence: 'PE', type_exercice: 'image_question', support: { ...support, image: context.src } }
        : { ...common, competence: 'PE', type_exercice: 'question_texte', support }
    }
  }
}

export function societeCommunicationItems(
  unit: SocieteUnite,
  kind: Competence,
  config: PageConfig,
  rng: Rng,
  context: SocieteImage | undefined,
  documentImage: SocieteImage | undefined,
  listeningImage: SocieteImage | undefined,
): MathItem[] {
  const exercise = communicationExercise(unit, kind, context, documentImage, listeningImage)
  return ficheCommunicationItems(exercise, config, rng, {
    reference: 'Société suisse',
    writingLines: lignes[unit.niveau],
    statements: kind === 'co' ? listeningStatements(unit.id) : undefined,
  })
}
