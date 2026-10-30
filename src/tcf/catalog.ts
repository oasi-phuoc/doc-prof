import type { Difficulty, ExerciseType, Topic } from '@/math/types'
import type { TcfCompetence, TcfNiveau, TcfTypeExercice, TcfTypeReponse } from './types'

/** TPF — Test de placement de français (tous les niveaux, y compris A2-B1). */
export const TPF_DOMAIN = 'tpf' as const
/** TCF CSC — Test de connaissance de français, niveau A0-A1. */
export const TCF_CSC_DOMAIN = 'tcf-csc' as const
/** TCF CFR — Test de connaissance de français, niveau A1-A2. */
export const TCF_CFR_DOMAIN = 'tcf-cfr' as const

export const TPF_FAMILY_DOMAINS = [TPF_DOMAIN, TCF_CSC_DOMAIN, TCF_CFR_DOMAIN] as const
export type TpfFamilyDomain = (typeof TPF_FAMILY_DOMAINS)[number]

export function isTpfFamilyDomain(domain: string | undefined): domain is TpfFamilyDomain {
  return domain === TPF_DOMAIN || domain === TCF_CSC_DOMAIN || domain === TCF_CFR_DOMAIN
}

/** TPF / TCF-CSC / TCF-CFR, plus l’ancien id `tcf`. */
export function isTcfAudioDomain(domain: string | undefined): boolean {
  return isTpfFamilyDomain(domain) || domain === 'tcf'
}

/** Ancien id `tcf` → TPF. */
export function canonicalTpfFamilyDomain(domain: string | undefined): TpfFamilyDomain {
  if (domain === TCF_CSC_DOMAIN || domain === TCF_CFR_DOMAIN) return domain
  return TPF_DOMAIN
}

export const TPF_DOCUMENT_TITLE = 'Test de placement de français'
export const TCF_CSC_DOCUMENT_TITLE = 'Test de connaissance de français — CSC'
export const TCF_CFR_DOCUMENT_TITLE = 'Test de connaissance de français — CFR'

export function tpfDocumentTitle(domain: string | undefined): string {
  if (domain === TCF_CSC_DOMAIN) return TCF_CSC_DOCUMENT_TITLE
  if (domain === TCF_CFR_DOMAIN) return TCF_CFR_DOCUMENT_TITLE
  return TPF_DOCUMENT_TITLE
}

export function tpfFamilyLabel(domain: string | undefined): string {
  if (domain === TCF_CSC_DOMAIN) return 'TCF CSC'
  if (domain === TCF_CFR_DOMAIN) return 'TCF CFR'
  return 'TPF'
}

/**
 * Niveaux de la banque pour ce domaine.
 * TPF : A0-A1, A1-A2 et A2-B1. TCF-CSC : A0-A1. TCF-CFR : A1-A2.
 */
export function tpfNiveauxForDomain(domain: string | undefined): readonly TcfNiveau[] {
  if (domain === TCF_CSC_DOMAIN) return ['A0-A1']
  if (domain === TCF_CFR_DOMAIN) return ['A1-A2']
  return ['A0-A1', 'A1-A2', 'A2-B1']
}

/** @deprecated Utiliser TPF_DOMAIN. */
export const TCF_DOMAIN = TPF_DOMAIN
/** @deprecated Utiliser TPF_DOCUMENT_TITLE. */
export const TCF_DOCUMENT_TITLE = TPF_DOCUMENT_TITLE

/** Niveau TPF / TCF ↔ réglage « Niveau » existant (facile / moyen / avancé). */
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

/** Niveau effectif d’une page : borné aux niveaux du domaine (CSC / CFR verrouillés). */
export function tcfNiveauForConfig(
  domain: string | undefined,
  difficulty: Difficulty | undefined,
): TcfNiveau {
  const allowed = tpfNiveauxForDomain(domain)
  const fromDiff = tcfNiveauFromDifficulty(difficulty)
  return allowed.includes(fromDiff) ? fromDiff : allowed[0]!
}

export const TCF_COMPETENCES: ReadonlyArray<{ id: TcfCompetence; label: string; topic: string }> = [
  { id: 'CO', label: 'Compréhension orale (CO)', topic: 'tcf-co' },
  { id: 'CE', label: 'Compréhension écrite (CE)', topic: 'tcf-ce' },
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

/** CE / CO : QCM texte d’abord (forme par défaut). */
const ALL_REPONSES = ['qcm_texte', 'qcm_image', 'lignes'] as const

export function tcfDefaultTypeReponse(competence: TcfCompetence): TcfTypeReponse {
  return competence === 'CE' || competence === 'CO' ? 'qcm_texte' : 'lignes'
}

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
    label: 'Images à reconnaître',
    description: 'Écouter un audio déjà prêt et cocher les 5 images qui correspondent.',
    instruction: 'Écoutez et cochez les images qui correspondent.',
    reponses: [],
  },
  {
    typeId: 'tcf-co-six-courts',
    competence: 'CO',
    typeExercice: 'six_courts',
    label: '6 audios courts',
    description: '6 pistes taguées « court » tirées au hasard, une question chacune (QCM texte).',
    instruction: 'Écoutez chaque extrait, puis répondez aux questions.',
    reponses: ALL_REPONSES,
  },
  {
    typeId: 'tcf-co-trois-moyens',
    competence: 'CO',
    typeExercice: 'trois_moyens',
    label: '3 audios moyens',
    description: 'Un audio moyen, avec deux questions.',
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
  {
    typeId: 'tcf-co-association',
    competence: 'CO',
    typeExercice: 'association_images',
    label: 'Conversations / situations',
    description:
      '4 petits dialogues tirés au hasard parmi la banque, avec 6 ou 8 scènes (dont leurres). Notez le n° sous chaque image.',
    instruction:
      'Vous allez entendre 4 petits dialogues correspondant à 4 situations différentes. Associez chaque dialogue à une image. Attention : il y a 6 ou 8 images mais seulement 4 dialogues.',
    reponses: [],
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
  {
    typeId: 'tcf-pe-dialogue',
    competence: 'PE',
    typeExercice: 'dialogue_a_completer',
    label: 'Dialogue à compléter',
    description: 'Écrire ses répliques dans un dialogue (répliques de l’interlocuteur données).',
    instruction: 'Complétez le dialogue.',
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
    typeId: 'tcf-po-entretien',
    competence: 'PO',
    typeExercice: 'entretien',
    label: 'Entretien dirigé',
    description: 'Répondre aux questions de l’examinateur·trice sur soi (questions au corrigé).',
    instruction:
      'Entretien dirigé. Vous saluez l’examinateur et vous répondez à ses questions sur vous : votre identité, votre famille, votre logement, vos activités et vos goûts.',
    reponses: [],
  },
  {
    typeId: 'tcf-po-trois-themes',
    competence: 'PO',
    typeExercice: 'trois_themes',
    label: '3 thèmes en images : poser des questions',
    description: 'Trois thèmes tirés au hasard, 4 images chacun : l’élève pose des questions à l’examinateur·trice.',
    instruction: 'Voici trois thèmes. Choisissez un thème et posez des questions à l’examinateur sur ce sujet.',
    reponses: [],
  },
  {
    typeId: 'tcf-po-image-interaction',
    competence: 'PO',
    typeExercice: 'image_interaction',
    label: 'Image à décrire et interaction',
    description: 'Décrire une image, puis jouer une situation sur le même sujet (déroulement au corrigé).',
    instruction: 'Regardez l’image et décrivez-la. Ensuite, vous jouez une situation avec l’examinateur sur ce sujet.',
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

export function tcfTypeMeta(competence: TcfCompetence, typeExercice: TcfTypeExercice): TcfTypeMeta | undefined {
  return TCF_TYPES.find((m) => m.competence === competence && m.typeExercice === typeExercice)
}

/**
 * Emplacement du générateur : une compétence, et pour la CO le numéro
 * d’exercice annoncé dans l’audio (« Exercice 1 »…). Le contenu vient de la banque.
 */
export type TcfSlotMeta = {
  typeId: string
  competence: TcfCompetence
  numero?: number
  label: string
  description: string
  instruction: string
}

export const TCF_CO_NUMEROS = [1, 2, 3, 4, 5] as const

/** CE A0-A1 (CSC) — menu sans « Exercice » ni numéro. */
const CE_A1 = [
  'Instructions',
  'S’orienter, espace',
  'S’orienter, temps',
  'S’informer',
] as const

/** CE A1-A2 (CFR). */
const CE_A2 = ['S’orienter', 'Correspondance', 'Instructions', 'S’informer'] as const

/** CO A0-A1 (CSC / TPF) — 5 emplacements. */
const CO_A1 = ['Événement', 'Activité', 'Instructions', 'Situations', 'Objets'] as const

/** CO A1-A2 (CFR / TPF) — 4 emplacements (pas d’exercice 5). */
const CO_A2 = ['Annonces et instructions', 'Radio', 'Message', 'Discussion'] as const

export const TCF_SLOTS: readonly TcfSlotMeta[] = [
  ...TCF_CO_NUMEROS.map((numero) => ({
    typeId: `tcf-co-ex-${numero}`,
    competence: 'CO' as const,
    numero,
    label: CO_A1[numero - 1] ?? `Exercice ${numero}`,
    description: CO_A1[numero - 1] ?? `Compréhension orale : exercice ${numero}.`,
    instruction: 'Écoutez le document, puis répondez aux questions.',
  })),
  ...([1, 2, 3, 4] as const).map((numero) => ({
    typeId: `tcf-ce-ex-${numero}`,
    competence: 'CE' as const,
    numero,
    label: CE_A1[numero - 1]!,
    description: CE_A1[numero - 1]!,
    instruction: 'Lisez le document. Cochez la bonne réponse.',
  })),
  {
    typeId: 'tcf-pe',
    competence: 'PE',
    label: 'Exercices de production écrite',
    description: 'Tous les exercices de production écrite de la banque.',
    instruction: 'Répondez par écrit.',
  },
  {
    typeId: 'tcf-po',
    competence: 'PO',
    label: 'Exercices de production orale',
    description: 'Tous les exercices de production orale de la banque.',
    instruction: 'Préparez-vous pour l’épreuve orale.',
  },
]

const TCF_CE_LEGACY: TcfSlotMeta = {
  typeId: 'tcf-ce',
  competence: 'CE',
  label: 'Exercices de compréhension écrite',
  description: 'Ancien emplacement unique de compréhension écrite.',
  instruction: 'Lisez le document, puis répondez aux questions.',
}

export const tcfSlotByTypeId: Readonly<Record<string, TcfSlotMeta>> = {
  ...Object.fromEntries(TCF_SLOTS.map((slot) => [slot.typeId, slot])),
  [TCF_CE_LEGACY.typeId]: TCF_CE_LEGACY,
}

/**
 * Libellé du menu Exercice (CE / CO) : nom court seul, sans « Exercice » ni numéro.
 * `undefined` = emplacement absent à ce niveau (ex. CO 5 en A1-A2 / CFR).
 */
export function tcfMenuLabel(typeId: string, niveau: TcfNiveau): string | undefined {
  const slot = tcfSlotByTypeId[typeId]
  if (!slot || slot.numero == null) return undefined
  if (slot.competence === 'CE') {
    return niveau === 'A1-A2' || niveau === 'A2-B1'
      ? CE_A2[slot.numero - 1]
      : CE_A1[slot.numero - 1]
  }
  if (slot.competence === 'CO') {
    return niveau === 'A1-A2' || niveau === 'A2-B1'
      ? CO_A2[slot.numero - 1]
      : CO_A1[slot.numero - 1]
  }
  return undefined
}

/** True si l’emplacement CE/CO a un libellé pour ce niveau (filtre la liste déroulante). */
export function tcfSlotShownInMenu(typeId: string, niveau: TcfNiveau): boolean {
  const slot = tcfSlotByTypeId[typeId]
  if (!slot || slot.numero == null) return true
  if (slot.competence !== 'CE' && slot.competence !== 'CO') return true
  return tcfMenuLabel(typeId, niveau) != null
}

/** Scénarios qui regroupent les exercices de chaque compétence dans le sélecteur. */
export const TCF_SCENARIOS: ReadonlyArray<{ id: string; label: string }> = [
  { id: 'loisirs', label: 'Les loisirs' },
  { id: 'ecole', label: 'L’école' },
  { id: 'lieux-publics', label: 'Les lieux publics' },
  { id: 'magasins', label: 'Les magasins' },
  { id: 'radio', label: 'La radio' },
  { id: 'maison', label: 'La maison' },
  { id: 'vie-quotidienne', label: 'La vie quotidienne' },
  { id: 'vacances', label: 'Les vacances' },
  { id: 'travail', label: 'Le travail' },
  { id: 'sante', label: 'La santé' },
  { id: 'transports', label: 'Les transports' },
  { id: 'fetes', label: 'Les fêtes et invitations' },
  { id: 'actualite', label: 'L’actualité' },
]

export const TCF_SCENARIO_AUTRE = { id: 'autre', label: 'Autres' } as const

export function tcfScenarioLabel(id: string | undefined): string {
  return TCF_SCENARIOS.find((s) => s.id === id)?.label ?? TCF_SCENARIO_AUTRE.label
}

/** Numéro de l’exercice dans son document d’origine (`…-co-3`, `…-po-2b` → 3, 2). */
export function tcfPosition(id: string): number | undefined {
  const part = id.match(/-ex(\d+)-/)
  if (part) return Number(part[1])
  const match = id.match(/-(?:co|ce|pe|po)-(\d)[a-z]?$/)
  return match ? Number(match[1]) : undefined
}

/** Page 1 du test : informations et consignes (non notée). */
export const TCF_CONSIGNES_TYPE = 'tcf-consignes'
export const TCF_INFO_TOPIC = 'tcf-info'

export function isTcfConsignesType(typeId: string | undefined): boolean {
  return typeId === TCF_CONSIGNES_TYPE
}

/** Thèmes du catalogue général = Informations + compétences (domaine TPF ; CSC/CFR les réutilisent). */
export const TCF_TOPICS: Topic[] = [
  { id: TCF_INFO_TOPIC, label: 'Informations', domain: TPF_DOMAIN },
  ...TCF_COMPETENCES.map((c) => ({ id: c.topic, label: c.label, domain: TPF_DOMAIN })),
]

/** Types du catalogue général (page Informations + emplacements par compétence). */
export const TCF_EXERCISE_TYPES: ExerciseType[] = [
  {
    id: TCF_CONSIGNES_TYPE,
    topic: TCF_INFO_TOPIC,
    label: 'Informations du test',
    description: 'Page d’informations : les quatre parties du test.',
    instruction: '',
    visual: 'texte',
    preferredColumns: 1,
  },
  ...TCF_SLOTS.map((slot) => ({
    id: slot.typeId,
    topic: TCF_COMPETENCES.find((c) => c.id === slot.competence)!.topic,
    label: slot.label,
    description: slot.description,
    instruction: slot.instruction,
    visual: 'texte' as const,
    preferredColumns: 1,
  })),
]
