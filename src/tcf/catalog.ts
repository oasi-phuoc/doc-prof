import type { Difficulty, ExerciseType, Topic } from '@/math/types'
import type { TcfCompetence, TcfNiveau, TcfTypeExercice, TcfTypeReponse } from './types'

export const TCF_DOMAIN = 'tcf' as const
export const TCF_DOCUMENT_TITLE = 'Test de connaissances de français'

/** Niveau TCF ↔ réglage « Niveau » existant (facile / moyen / avancé). */
export const TCF_NIVEAUX: ReadonlyArray<{ id: TcfNiveau; difficulty: Difficulty; dossier: string }> = [
  { id: 'A0-A1', difficulty: 'facile', dossier: 'a0-a1' },
  { id: 'A1-A2', difficulty: 'moyen', dossier: 'a1-a2' },
  { id: 'A2-B1', difficulty: 'avance', dossier: 'a2-b1' },
]

export function tcfNiveauFromDifficulty(difficulty: Difficulty | undefined): TcfNiveau {
  return TCF_NIVEAUX.find((n) => n.difficulty === difficulty)?.id ?? 'A0-A1'
}

export function tcfDifficultyFromNiveau(niveau: TcfNiveau): Difficulty {
  return TCF_NIVEAUX.find((n) => n.id === niveau)?.difficulty ?? 'facile'
}

export const TCF_COMPETENCES: ReadonlyArray<{ id: TcfCompetence; label: string; topic: string }> = [
  { id: 'CE', label: 'Compréhension écrite (CE)', topic: 'tcf-ce' },
  { id: 'CO', label: 'Compréhension orale (CO)', topic: 'tcf-co' },
  { id: 'PE', label: 'Production écrite (PE)', topic: 'tcf-pe' },
  { id: 'PO', label: 'Production orale (PO)', topic: 'tcf-po' },
]

export const TCF_REPONSES: ReadonlyArray<{ id: TcfTypeReponse; label: string }> = [
  { id: 'qcm_texte', label: 'QCM texte' },
  { id: 'qcm_image', label: 'QCM images' },
  { id: 'lignes', label: 'Lignes (phrase réponse)' },
]

type TcfTypeMeta = {
  /** Id du type dans le catalogue général (`exerciseTypes`). */
  typeId: string
  competence: TcfCompetence
  typeExercice: TcfTypeExercice
  label: string
  description: string
  instruction: string
  /** Types de réponse proposés (CE / CO), vide = pas de questions saisies. */
  reponses: readonly TcfTypeReponse[]
}

const ALL_REPONSES = ['qcm_texte', 'qcm_image', 'lignes'] as const

export const TCF_TYPES: readonly TcfTypeMeta[] = [
  // —— CE ——
  {
    typeId: 'tcf-ce-sms',
    competence: 'CE',
    typeExercice: 'sms',
    label: 'Message (SMS)',
    description: 'Lire un court message et répondre aux questions.',
    instruction: 'Lisez le message, puis répondez aux questions.',
    reponses: ALL_REPONSES,
  },
  {
    typeId: 'tcf-ce-email',
    competence: 'CE',
    typeExercice: 'email',
    label: 'E-mail',
    description: 'Lire un e-mail et répondre aux questions.',
    instruction: 'Lisez l’e-mail, puis répondez aux questions.',
    reponses: ALL_REPONSES,
  },
  {
    typeId: 'tcf-ce-annonce',
    competence: 'CE',
    typeExercice: 'annonce',
    label: 'Annonce / information',
    description: 'Lire une annonce ou une information et répondre aux questions.',
    instruction: 'Lisez le document, puis répondez aux questions.',
    reponses: ALL_REPONSES,
  },
  // —— CO ——
  {
    typeId: 'tcf-co-images',
    competence: 'CO',
    typeExercice: 'images_a_reconnaitre',
    label: 'Audio · images à reconnaître',
    description: 'Écouter un audio et cocher les images qui correspondent (5 images).',
    instruction: 'Écoutez et cochez les images qui correspondent.',
    reponses: [],
  },
  {
    typeId: 'tcf-co-six-courts',
    competence: 'CO',
    typeExercice: 'six_courts',
    label: '6 audios courts',
    description: 'Un audio partagé en 6 courts extraits, avec une ou plusieurs questions par extrait.',
    instruction: 'Écoutez chaque extrait, puis répondez aux questions.',
    reponses: ALL_REPONSES,
  },
  {
    typeId: 'tcf-co-trois-moyens',
    competence: 'CO',
    typeExercice: 'trois_moyens',
    label: '3 audios moyens',
    description: 'Un audio partagé en 3 extraits moyens, avec des questions par extrait.',
    instruction: 'Écoutez chaque extrait, puis répondez aux questions.',
    reponses: ALL_REPONSES,
  },
  {
    typeId: 'tcf-co-complet',
    competence: 'CO',
    typeExercice: 'complet',
    label: 'Audio complet',
    description: 'Un document audio complet, avec questions.',
    instruction: 'Écoutez le document, puis répondez aux questions.',
    reponses: ALL_REPONSES,
  },
  // —— PE ——
  {
    typeId: 'tcf-pe-formulaire',
    competence: 'PE',
    typeExercice: 'formulaire',
    label: 'Formulaire',
    description: 'Remplir un formulaire (champs libres).',
    instruction: 'Remplissez le formulaire.',
    reponses: [],
  },
  {
    typeId: 'tcf-pe-image',
    competence: 'PE',
    typeExercice: 'image_question',
    label: 'Image + question',
    description: 'Regarder une image et écrire quelques mots.',
    instruction: 'Regardez l’image et répondez par écrit.',
    reponses: [],
  },
  {
    typeId: 'tcf-pe-sms',
    competence: 'PE',
    typeExercice: 'sms_reponse',
    label: 'Répondre à un SMS',
    description: 'Lire un SMS et y répondre.',
    instruction: 'Lisez le message et répondez.',
    reponses: [],
  },
  {
    typeId: 'tcf-pe-email',
    competence: 'PE',
    typeExercice: 'email_reponse',
    label: 'Répondre à un e-mail',
    description: 'Lire un e-mail et y répondre.',
    instruction: 'Lisez l’e-mail et répondez.',
    reponses: [],
  },
  {
    typeId: 'tcf-pe-question',
    competence: 'PE',
    typeExercice: 'question_texte',
    label: 'Question / texte',
    description: 'Rédiger un texte à partir d’une question.',
    instruction: 'Lisez la question et rédigez votre texte.',
    reponses: [],
  },
  // —— PO ——
  {
    typeId: 'tcf-po-mots-theme',
    competence: 'PO',
    typeExercice: 'mots_theme',
    label: 'Mots / thème : poser des questions',
    description: 'À partir de mots ou d’un thème, poser des questions à l’examinateur·trice.',
    instruction: 'Posez des questions à partir des mots proposés.',
    reponses: [],
  },
  {
    typeId: 'tcf-po-sequence',
    competence: 'PO',
    typeExercice: 'sequence_4_images',
    label: '4 images en séquence',
    description: 'Décrire et raconter une séquence de 4 images.',
    instruction: 'Regardez les images et racontez l’histoire.',
    reponses: [],
  },
  {
    typeId: 'tcf-po-image',
    competence: 'PO',
    typeExercice: 'image_unique',
    label: 'Image unique',
    description: 'Décrire une image.',
    instruction: 'Regardez l’image et décrivez-la.',
    reponses: [],
  },
  {
    typeId: 'tcf-po-dialogue',
    competence: 'PO',
    typeExercice: 'dialogue',
    label: 'Dialogue',
    description: 'Jouer un dialogue (lignes pour l’élève, dialogue proposé au corrigé).',
    instruction: 'Lisez la situation et jouez le dialogue.',
    reponses: [],
  },
]

export const tcfTypeByTypeId: Readonly<Record<string, TcfTypeMeta>> = Object.fromEntries(
  TCF_TYPES.map((meta) => [meta.typeId, meta]),
)

export function isTcfType(typeId: string | undefined): boolean {
  return typeId != null && typeId in tcfTypeByTypeId
}

export function tcfTypeId(competence: TcfCompetence, typeExercice: TcfTypeExercice): string | undefined {
  return TCF_TYPES.find((m) => m.competence === competence && m.typeExercice === typeExercice)?.typeId
}

/** Thèmes du catalogue général = compétences. */
export const TCF_TOPICS: Topic[] = TCF_COMPETENCES.map((c) => ({
  id: c.topic,
  label: c.label,
  domain: TCF_DOMAIN,
}))

/** Types du catalogue général (une entrée par type d’exercice TCF). */
export const TCF_EXERCISE_TYPES: ExerciseType[] = TCF_TYPES.map((meta) => ({
  id: meta.typeId,
  topic: TCF_COMPETENCES.find((c) => c.id === meta.competence)!.topic,
  label: meta.label,
  description: meta.description,
  instruction: meta.instruction,
  visual: 'texte',
  preferredColumns: 1,
}))
