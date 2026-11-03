import { pick, shuffle, type Rng } from '@/math/rng'
import type { MathItem } from '@/math/types'
import type { TcfExercise } from '@/tcf/types'
import { tcfExerciseItems } from '@/tcf/generate'
import readings from './modal-reading-data.json'
import situations from './modal-production-data.json'

export const MODAL_READING_TEXTS = readings
export const MODAL_PRODUCTION_SITUATIONS = situations

export function tryBuildModalCommunication(opts: {
  kindId: string; typeId: string; count: number; rng: Rng
  forms?: Array<'qcm_texte' | 'qcm_image' | 'lignes' | undefined>
}): { instruction: string; items: MathItem[]; bankQuestionCap: number } | null {
  const { kindId, typeId, rng } = opts
  const id = `gram-${typeId}`
  if (kindId === 'communication-pe' || kindId === 'communication-po') {
    const instruction = kindId === 'communication-pe'
      ? 'Écrivez une phrase avec le verbe modal indiqué pour chaque situation.'
      : 'Dites une phrase avec le verbe modal indiqué pour chaque situation.'
    return {
      instruction, bankQuestionCap: 50,
      items: shuffle(rng, situations).slice(0, Math.max(1, opts.count)).map((row, index) => ({
        layout: 'tcf', answer: row.answer, tcfExerciseId: id,
        tcf: { kind: 'lignes', numero: index + 1, enonce: row.prompt, nbLignes: 1, reponseModele: row.answer },
      })),
    }
  }
  if (kindId !== 'communication-ce') return null
  const doc = pick(rng, readings)
  const exercise: TcfExercise = {
    id: `${id}-${doc.slug}`, niveau: 'A1-A2', competence: 'CE', type_exercice: 'annonce',
    consigne: 'Lisez le document. Répondez aux questions sur les possibilités, les obligations et les souhaits.',
    support: { titre: doc.title, texte: doc.text, image: null },
    questions: doc.questions.slice(0, Math.max(1, opts.count)).map(question => ({
      enonce: question.prompt, type_reponse: 'qcm_texte', melanger: true,
      choix: question.options.map((texte, index) => ({ id: String.fromCharCode(97 + index), texte, correct: texte === question.answer })),
      formes: { lignes: { nb_lignes: 1, reponse_modele: question.answer } },
    })),
  }
  return {
    instruction: exercise.consigne!, bankQuestionCap: 5,
    items: tcfExerciseItems(exercise, rng, opts.forms).map(item => ({ ...item, tcfExerciseId: exercise.id })),
  }
}
