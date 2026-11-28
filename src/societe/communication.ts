import { shuffle, type Rng } from '@/math/rng'
import type { MathItem, PageConfig } from '@/math/types'
import { tcfExerciseItems } from '@/tcf/generate'
import { peEvaluation } from '@/tcf/pe-evaluation'
import type { TcfExercise, TcfNiveau, TcfQuestion } from '@/tcf/types'
import { listeningStatements } from './ecoute'
import type { SocieteImage, SocieteNiveau, SocieteProduction, SocieteQuestion, SocieteUnite } from './types'

type Competence = 'ce' | 'co' | 'po' | 'pe'

const niveaux: Record<SocieteNiveau, TcfNiveau> = { A1: 'A0-A1', A2: 'A1-A2', B1: 'A2-B1' }
const lignes: Record<SocieteNiveau, number> = { A1: 4, A2: 6, B1: 9 }

function question({ prompt, answer, options }: SocieteQuestion): TcfQuestion {
  if (!options) return { type_reponse: 'lignes', enonce: prompt, nb_lignes: 1, reponse_modele: answer }
  return {
    type_reponse: 'qcm_texte',
    enonce: prompt,
    melanger: false,
    choix: options.map((texte, index) => ({ id: 'abc'[index]!, texte, correct: texte === answer })),
  }
}

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
        questions: unit.document.questions.map(question),
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
        questions: unit.ecoute.questions.map(question),
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
  const sourceStatements = kind === 'co' && config.grammarCoFormat === 'true-false' ? listeningStatements(unit.id) : undefined
  const statements = sourceStatements ? shuffle(rng, sourceStatements) : undefined
  return tcfExerciseItems(exercise, rng, config.tcfFormModes).map((item) => {
    const base = { ...item, tcfExerciseId: exercise.id }
    if (item.tcf?.kind === 'audio_cadre') {
      const pointsParQuestion = config.pointsPerQuestion ?? 1
      return {
        ...base,
        tcf: {
          ...item.tcf,
          showAudioInStudent: true,
          questions: statements ? [] : item.tcf.questions.map((question) => ({ ...question, points: pointsParQuestion })),
        },
        points: (statements?.length ?? item.tcf.questions.length) * pointsParQuestion,
        ...(statements ? {
          grammarCoTrueFalse: statements,
          answer: statements.map((statement) => statement.correct ? 'Vrai' : 'Faux').join(' · '),
        } : {}),
      }
    }
    if (item.tcf?.kind === 'ecriture' && exercise.competence === 'PE') {
      const points = exercise.points ?? 10
      return {
        ...base,
        points,
        tcf: { ...item.tcf, nbLignes: lignes[unit.niveau] },
        tcfPeEvaluation: { ...peEvaluation(exercise, points), reference: 'Société suisse' },
      }
    }
    return base
  })
}
