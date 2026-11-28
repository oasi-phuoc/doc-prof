import type { GrammarCoStatement } from '@/grammaire/exercises/co-true-false'
import { shuffle, type Rng } from '@/math/rng'
import type { MathItem, PageConfig } from '@/math/types'
import { tcfExerciseItems } from '@/tcf/generate'
import { peEvaluation } from '@/tcf/pe-evaluation'
import type { TcfExercise, TcfQuestion } from '@/tcf/types'

export type FicheQuestion = {
  prompt: string
  answer: string
  options?: readonly string[]
  shuffleChoices?: boolean
  image?: string
}

export function ficheQuestion({ prompt, answer, options, image, shuffleChoices }: FicheQuestion): TcfQuestion {
  if (!options) return { type_reponse: 'lignes', enonce: prompt, nb_lignes: 1, reponse_modele: answer, image }
  return {
    type_reponse: 'qcm_texte',
    enonce: prompt,
    melanger: shuffleChoices ?? false,
    image,
    choix: options.map((texte, index) => ({ id: String.fromCharCode(97 + index), texte, correct: texte === answer })),
  }
}

export function ficheCommunicationItems(
  exercise: TcfExercise,
  config: Pick<PageConfig, 'tcfFormModes' | 'pointsPerQuestion' | 'grammarCoFormat'>,
  rng: Rng,
  options: { reference: string; writingLines: number; statements?: readonly GrammarCoStatement[] },
): MathItem[] {
  const statements = exercise.competence === 'CO' && config.grammarCoFormat === 'true-false' && options.statements?.length
    ? shuffle(rng, options.statements)
    : undefined
  return tcfExerciseItems(exercise, rng, config.tcfFormModes).map((item) => {
    const base = { ...item, tcfExerciseId: exercise.id }
    if (item.tcf?.kind === 'audio_cadre') {
      const pointsPerQuestion = config.pointsPerQuestion ?? 1
      return {
        ...base,
        tcf: {
          ...item.tcf,
          showAudioInStudent: true,
          questions: statements ? [] : item.tcf.questions.map((question) => ({ ...question, points: pointsPerQuestion })),
        },
        points: (statements?.length ?? item.tcf.questions.length) * pointsPerQuestion,
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
        tcf: { ...item.tcf, nbLignes: options.writingLines },
        tcfPeEvaluation: { ...peEvaluation(exercise, points), reference: options.reference },
      }
    }
    return base
  })
}
