import { pick, type Rng } from '@/math/rng'
import type { TcfExercise, TcfQuestion } from '@/tcf/types'
import data from './communication-data.json'

type CommunicationKind = 'communication-ce' | 'communication-pe' | 'communication-po'
type CommunicationVariant = {
  id: string
  title: string
  text: string
  questions: Array<{ enonce: string; answer: string; options: string[] }>
  pe: string
  po: string
  model: string
  imageDescription: string
}
type CommunicationGroup = { subId: string; goal: string; variants: CommunicationVariant[] }

export const GRAM_COMMUNICATION_GROUPS: readonly CommunicationGroup[] = data

export function isCommunicationKind(kindId: string): kindId is CommunicationKind {
  return kindId === 'communication-ce' || kindId === 'communication-pe' || kindId === 'communication-po'
}

export function hasGrammarCommunication(subId: string, kindId: string): boolean {
  return isCommunicationKind(kindId) && GRAM_COMMUNICATION_GROUPS.some((group) => group.subId === subId)
}

/** La limite de la fiche est un nombre de questions, distinct des dix documents disponibles. */
export function communicationQuestionCap(subId: string, kindId: CommunicationKind): number {
  const group = GRAM_COMMUNICATION_GROUPS.find((candidate) => candidate.subId === subId)
  if (!group) return 0
  return kindId === 'communication-ce'
    ? Math.max(...group.variants.map((variant) => variant.questions.length))
    : 1
}

export function buildGrammarCommunication(opts: {
  subId: string
  kindId: CommunicationKind
  typeId: string
  rng: Rng
  count: number
}): TcfExercise | undefined {
  const group = GRAM_COMMUNICATION_GROUPS.find((candidate) => candidate.subId === opts.subId)
  if (!group) return undefined
  const variant = pick(opts.rng, group.variants)
  const id = `gram-${opts.typeId}-${variant.id}`
  if (opts.kindId === 'communication-ce') {
    const questions: TcfQuestion[] = variant.questions.slice(0, Math.max(1, opts.count)).map((row) => ({
      enonce: row.enonce,
      type_reponse: 'qcm_texte',
      melanger: true,
      choix: row.options.map((texte, index) => ({
        id: ['a', 'b', 'c'][index]!, texte, correct: texte === row.answer,
      })),
      formes: { lignes: { nb_lignes: 1, reponse_modele: row.answer } },
    }))
    return {
      id, niveau: 'A1-A2', competence: 'CE', type_exercice: 'annonce',
      consigne: 'Lisez le document et répondez aux questions.',
      support: { titre: variant.title, texte: variant.text, image: null },
      questions,
    }
  }
  // Le modèle de réponse du CE ne doit pas apparaître dans la consigne de production.
  const context = variant.text.split('Voici une phrase utile :')[0]!.trim()
  if (opts.kindId === 'communication-pe') {
    return {
      id, niveau: 'A1-A2', competence: 'PE', type_exercice: 'question_texte',
      consigne: variant.pe, consigne_supplementaire: context,
      support: { consigne: variant.pe, nb_mots: { min: 3, max: 30 }, reponse_modele: variant.model },
      questions: [],
    }
  }
  return {
    id, niveau: 'A1-A2', competence: 'PO', type_exercice: 'dialogue',
    consigne: variant.po,
    support: {
      situation: `${context}\n${variant.po}`,
      repliques: [{ locuteur: 'eleve', texte: variant.model }],
      repliques_au_corrige: true,
    },
    questions: [],
  }
}
