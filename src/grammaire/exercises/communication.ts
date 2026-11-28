import { pick, type Rng } from '@/math/rng'
import type { TcfExercise, TcfPoImageInteraction, TcfQuestion } from '@/tcf/types'
import { gramKindById } from './kinds'
import { parseGramExerciseType } from './subthemes'
import data from './communication-data.json'

type OralVisualKind = 'communication-po-image' | 'communication-po-sequence'
type CommunicationKind = 'communication-ce' | 'communication-pe' | 'communication-po' | OralVisualKind
type OralVisualScene = {
  id: string
  title: string
  images: [string, string, string, string]
  description: string
  story: string
  interaction: Pick<TcfPoImageInteraction['support'], 'je_suis' | 'vous_etes' | 'lieu' | 'vous_voulez' | 'repliques'>
}

const oralVisualScenes: Readonly<Record<string, readonly OralVisualScene[] | undefined>> = {
  modaux: [
    {
      id: 'changer-billet',
      title: 'Changer un billet de train',
      images: [
        '/lib/images/grammaire/communication/arriver-a-la-gare-avec-un-billet.webp',
        '/lib/images/grammaire/communication/modaux-01.webp',
        '/lib/images/grammaire/communication/recevoir-un-nouveau-billet-de-train.webp',
        '/lib/images/grammaire/communication/monter-dans-le-train-avec-son-billet.webp',
      ],
      description: 'Lina est à la gare. Elle montre son billet à l’employé du guichet et demande si elle peut le changer.',
      story: 'D’abord, Lina arrive à la gare avec son billet. Au guichet, elle demande si elle peut le changer. L’employé lui donne un nouveau billet. Enfin, Lina va sur le quai et monte dans le train.',
      interaction: {
        je_suis: 'L’employé au guichet.',
        vous_etes: 'Une personne qui voyage en train.',
        lieu: 'À la gare, devant le guichet.',
        vous_voulez: 'Changer votre billet.',
        repliques: [
          { locuteur: 'eleve', texte: 'Bonjour, est-ce que je peux changer mon billet ?' },
          { locuteur: 'examinateur', texte: 'Oui. Vous voulez partir à quelle heure ?' },
          { locuteur: 'eleve', texte: 'Je voudrais partir à dix heures, s’il vous plaît.' },
        ],
      },
    },
    {
      id: 'inscription-formation',
      title: 'S’inscrire à un cours de français',
      images: [
        '/lib/images/grammaire/communication/arriver-au-centre-avec-un-dossier.webp',
        '/lib/images/grammaire/communication/modaux-06.webp',
        '/lib/images/grammaire/communication/remplir-un-formulaire-au-centre-de-formation.webp',
        '/lib/images/grammaire/communication/suivre-son-premier-cours-de-francais.webp',
      ],
      description: 'Kenji est au centre de formation. Il donne son dossier à la personne de l’accueil et demande s’il peut s’inscrire au cours de français.',
      story: 'D’abord, Kenji arrive au centre avec son dossier. À l’accueil, il demande s’il peut s’inscrire au cours. Ensuite, il remplit un formulaire. Enfin, il s’installe dans la salle pour suivre le cours de français.',
      interaction: {
        je_suis: 'La personne à l’accueil.',
        vous_etes: 'Une personne qui veut suivre un cours de français.',
        lieu: 'Au centre de formation.',
        vous_voulez: 'Vous inscrire à un cours.',
        repliques: [
          { locuteur: 'eleve', texte: 'Bonjour, est-ce que je peux m’inscrire au cours du soir ?' },
          { locuteur: 'examinateur', texte: 'Oui. Vous avez votre dossier ?' },
          { locuteur: 'eleve', texte: 'Oui, le voici. Est-ce que je dois remplir ce formulaire ?' },
        ],
      },
    },
  ],
}

type CommunicationVariant = {
  id: string
  title: string
  text: string
  questions: Array<{ enonce: string; answer: string; options: string[] }>
  pe: string
  po: string
  model: string
  imageDescription: string
  image?: string
}
type CommunicationGroup = { subId: string; goal: string; variants: CommunicationVariant[] }

export const GRAM_COMMUNICATION_GROUPS: readonly CommunicationGroup[] = data

function isOralVisualKind(kindId: string): kindId is OralVisualKind {
  return kindId === 'communication-po-image' || kindId === 'communication-po-sequence'
}

export function isCommunicationKind(kindId: string): kindId is CommunicationKind {
  return isOralVisualKind(kindId) || kindId === 'communication-ce' || kindId === 'communication-pe' || kindId === 'communication-po'
}

export function hasGrammarCommunication(subId: string, kindId: string): boolean {
  if (isOralVisualKind(kindId)) return Boolean(oralVisualScenes[subId]?.length)
  return isCommunicationKind(kindId) && GRAM_COMMUNICATION_GROUPS.some((group) => group.subId === subId)
}

export function isGrammarOralVisualType(typeId: string): boolean {
  const parsed = parseGramExerciseType(typeId)
  return Boolean(parsed && isOralVisualKind(parsed.kindId) && hasGrammarCommunication(parsed.subId, parsed.kindId))
}

/** La limite de la fiche est un nombre de questions, distinct des dix documents disponibles. */
export function communicationQuestionCap(subId: string, kindId: CommunicationKind): number {
  if (isOralVisualKind(kindId)) return hasGrammarCommunication(subId, kindId) ? 1 : 0
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
  if (isOralVisualKind(opts.kindId)) {
    const scenes = oralVisualScenes[opts.subId]
    if (!scenes?.length) return undefined
    const scene = pick(opts.rng, scenes)
    const sequence = opts.kindId === 'communication-po-sequence'
    return {
      id: `gram-${opts.typeId}-${scene.id}`,
      niveau: sequence ? 'A0-A1' : 'A1-A2',
      competence: 'PO',
      type_exercice: 'image_interaction',
      scene: scene.title,
      consigne: gramKindById(opts.kindId)?.instruction,
      support: {
        ...scene.interaction,
        images: sequence ? scene.images : [scene.images[1]],
        questions: [],
        description_modele: sequence ? scene.story : scene.description,
      },
      questions: [],
    }
  }
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
      support: { titre: variant.title, texte: variant.text, image: variant.image ?? null },
      questions,
    }
  }
  // Le modèle de réponse du CE ne doit pas apparaître dans la consigne de production.
  const context = variant.text.split('Voici une phrase utile :')[0]!.trim()
  if (opts.kindId === 'communication-pe') {
    if (variant.image) return {
      id, niveau: 'A1-A2', competence: 'PE', type_exercice: 'image_question',
      consigne: variant.pe, consigne_supplementaire: context,
      support: {
        image: variant.image, consigne: variant.pe,
        nb_mots: { min: 3, max: 30 }, reponse_modele: variant.model,
      },
      questions: [],
    }
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
      ...(variant.image ? { images: [variant.image] } : {}),
    },
    questions: [],
  }
}
