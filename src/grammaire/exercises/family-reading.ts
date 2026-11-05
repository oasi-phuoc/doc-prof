/** Récits de famille et messages du quotidien, tirés indépendamment. */
import { pick, type Rng } from '@/math/rng'
import type { TcfExercise, TcfQuestion } from '@/tcf/types'
import readingData from './family-reading-data.json'
import messageData from './family-message-data.json'

export const FAMILY_READING_TEXTS = readingData
export const FAMILY_MESSAGE_TEXTS = messageData

export { isFamilyReadingType } from './reading-types'

export function buildFamilyReading(opts: {
  typeId: string
  rng: Rng
  count: number
  messages?: boolean
}): TcfExercise {
  const doc = pick(opts.rng, opts.messages ? FAMILY_MESSAGE_TEXTS : FAMILY_READING_TEXTS)
  const questions: TcfQuestion[] = doc.questions.slice(0, Math.max(1, opts.count)).map((question) => ({
    enonce: question.prompt,
    type_reponse: 'qcm_texte',
    melanger: true,
    choix: question.options.map((texte, index) => ({ id: String.fromCharCode(97 + index), texte, correct: texte === question.answer })),
    formes: { lignes: { nb_lignes: question.prompt.includes('___') ? 0 : 1, reponse_modele: question.answer } },
  }))
  const base = {
    id: `gram-${opts.typeId}-${doc.slug}`,
    niveau: 'A1-A2' as const,
    competence: 'CE' as const,
    consigne: 'Lisez le document, puis répondez aux questions.',
    questions,
  }
  if (opts.messages && doc.genre === 'email') {
    const [de, a, objet, ...body] = doc.text.split('\n')
    return {
      ...base,
      type_exercice: 'email',
      support: { de: de!.replace(/^De : /, ''), a: a!.replace(/^À : /, ''), objet: objet!.replace(/^Objet : /, ''), texte: body.join('\n').trim() },
    }
  }
  if (opts.messages) {
    const [from, ...body] = doc.text.split('\n')
    return { ...base, type_exercice: 'sms', support: { expediteur: from!.replace(/^De : /, ''), texte: body.join('\n').trim() } }
  }
  return { ...base, type_exercice: 'annonce', support: { titre: doc.title, texte: doc.text, image: null } }
}
