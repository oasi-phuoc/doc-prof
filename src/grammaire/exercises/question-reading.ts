import { pick, shuffle, type Rng } from '@/math/rng'
import type { TcfExercise } from '@/tcf/types'
import closed from './question-reading-data.json'
import open from './question-open-reading-data.json'
import quel from './question-quel-reading-data.json'

type ReadingQuestion = { prompt: string; answer: string; evidence: string; affirmative?: boolean; inversion?: string }
type ReadingDoc = { slug: string; genre: string; title: string; text: string; questions: ReadingQuestion[] }
type QuestionSubId = 'c1' | 'c2' | 'c3'

export const QUESTION_READING_BANKS: Record<QuestionSubId, ReadingDoc[]> = { c1: closed, c2: open, c3: quel }
export const QUESTION_READING_CAP = 5

export function buildQuestionReading(opts: { typeId: string; rng: Rng; count: number }): TcfExercise {
  const { typeId, rng } = opts
  const subId = /^gram-ex-(c[123])-/.exec(typeId)?.[1] as QuestionSubId | undefined
  if (!subId) throw new Error(`Type de lecture interrogative inconnu : ${typeId}`)
  const writing = typeId.endsWith('question-reading-write')
  const doc = pick(rng, QUESTION_READING_BANKS[subId])
  const count = Math.max(1, Math.min(opts.count, doc.questions.length))
  let selected: ReadingQuestion[]
  if (subId === 'c1' && count > 1) {
    const positive = pick(rng, doc.questions.filter(q => q.affirmative))
    const negative = pick(rng, doc.questions.filter(q => !q.affirmative))
    const rest = shuffle(rng, doc.questions.filter(q => q !== positive && q !== negative))
    selected = shuffle(rng, [positive, negative, ...rest.slice(0, count - 2)])
  } else {
    selected = shuffle(rng, doc.questions).slice(0, count)
  }
  const instruction = writing
    ? subId === 'c1'
      ? 'Lisez le texte. Écrivez des questions fermées sur les informations du texte, avec est-ce que ou l’inversion. Plusieurs questions sont possibles.'
      : subId === 'c2'
        ? 'Lisez le texte. Écrivez des questions ouvertes avec des mots interrogatifs sur les informations du texte. Plusieurs questions sont possibles.'
        : 'Lisez le texte. Écrivez des questions avec quel, quelle, quels ou quelles sur les informations du texte. Plusieurs questions sont possibles.'
    : subId === 'c1'
      ? 'Lisez le texte. Répondez aux questions par des phrases complètes, affirmatives ou négatives, selon le texte.'
      : 'Lisez le texte. Répondez aux questions par des phrases complètes.'
  return {
    id: `gram-${typeId}-${doc.slug}`,
    niveau: 'A1-A2', competence: 'CE', type_exercice: 'annonce',
    consigne: instruction,
    support: { titre: doc.title, texte: doc.text, image: null },
    questions: selected.map((question, index) => {
      const modelQuestion = subId === 'c1' && index % 2 ? question.inversion! : question.prompt
      return {
        enonce: writing ? 'Votre question :' : modelQuestion,
        type_reponse: 'lignes', nb_lignes: 1,
        reponse_modele: writing ? modelQuestion : question.answer,
      }
    }),
  }
}

/** Retained for callers that only need the closed-question reading bank. */
export const buildClosedQuestionReading = buildQuestionReading
