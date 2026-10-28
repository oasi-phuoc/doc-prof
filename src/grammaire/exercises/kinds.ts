/** Types d’exercices de conjugaison / transformation / association. */

export const GRAM_EXERCISE_KINDS = [
  {
    id: 'qcm-conj',
    label: 'Choisissez la bonne conjugaison',
    description: 'Phrase avec un blanc et trois formes proposées.',
    instruction: 'Choisissez la bonne conjugaison.',
    layout: 'qcm' as const,
  },
  {
    id: 'fill-conj',
    label: 'Conjuguez le verbe',
    description: 'Un verbe à conjuguer : consigne, ou infinitif coloré entre parenthèses.',
    instruction: 'Conjuguez le verbe.',
    layout: 'fill' as const,
  },
  {
    id: 'qcm-verbe',
    label: 'Choisissez le verbe correct',
    description: 'Phrase avec un blanc et trois verbes / formes proposés.',
    instruction: 'Choisissez le verbe correct.',
    layout: 'qcm' as const,
  },
  {
    id: 'pluriel',
    label: 'Mettre au pluriel',
    description: 'Réécrire la phrase au pluriel.',
    instruction: 'Mettez la phrase au pluriel.',
    layout: 'fill' as const,
  },
  {
    id: 'singulier',
    label: 'Mettre au singulier',
    description: 'Réécrire la phrase au singulier.',
    instruction: 'Mettez la phrase au singulier.',
    layout: 'fill' as const,
  },
  {
    id: 'negatif',
    label: 'Mettre à la forme négative',
    description: 'Transformer la phrase affirmative en négative (ne … pas).',
    instruction: 'Mettez la phrase à la forme négative.',
    layout: 'fill' as const,
  },
  {
    id: 'affirmatif',
    label: 'Mettre à la forme affirmative',
    description: 'Transformer la phrase négative en affirmative.',
    instruction: 'Mettez la phrase à la forme affirmative.',
    layout: 'fill' as const,
  },
  {
    id: 'ecrire',
    label: 'Écrire une phrase',
    description: 'Écrire une phrase avec le verbe et le mot donnés.',
    instruction: 'Écrivez une phrase avec le verbe et le mot proposés.',
    layout: 'write' as const,
  },
  {
    id: 'associer',
    label: 'Associer',
    description: 'Relier un élément à la forme ou à la phrase qui convient.',
    instruction: 'Associez chaque élément à la réponse qui convient.',
    layout: 'fill' as const,
  },
  {
    id: 'ordre',
    label: 'Remettre dans l’ordre',
    description: 'Reconstituer la phrase à partir des mots donnés.',
    instruction: 'Remettez les mots dans l’ordre.',
    layout: 'fill' as const,
  },
  {
    id: 'transformer',
    label: 'Transformer la phrase',
    description: 'Réécrire la phrase selon le modèle (question, politesse, etc.).',
    instruction: 'Transformez la phrase comme dans l’exemple.',
    layout: 'fill' as const,
  },
  {
    id: 'corriger',
    label: 'Corriger la phrase',
    description: 'Corriger l’erreur de vocabulaire, de structure ou de ponctuation.',
    instruction: 'Corrigez la phrase.',
    layout: 'fill' as const,
  },
  {
    id: 'infos-perso',
    label: 'Compléter avec vos informations',
    description: 'Phrases à trous pour se présenter (prénom, âge, nationalité…).',
    instruction: 'Complétez les phrases avec vos informations personnelles.',
    layout: 'fill' as const,
  },
  {
    id: 'infos-perso-qcm',
    label: 'Informations personnelles (QCM)',
    description: 'Même exercice, avec trois choix de réponse.',
    instruction: 'Complétez les phrases. Cochez la bonne réponse.',
    layout: 'qcm' as const,
  },
  {
    id: 'verbe-pastilles',
    label: 'Compléter avec le verbe',
    description: 'Phrases de présentation à compléter avec le verbe des pastilles.',
    instruction: 'Complétez les phrases avec le verbe correct.',
    layout: 'fill' as const,
  },
  {
    id: 'verbe-pastilles-qcm',
    label: 'Verbe de présentation (QCM)',
    description: 'Même exercice, avec trois choix de verbe.',
    instruction: 'Complétez les phrases. Cochez le verbe correct.',
    layout: 'qcm' as const,
  },
  {
    id: 'mots-melanges',
    label: 'Mots mélangés',
    description: 'Dialogue ou phrases à compléter avec les mots des pastilles.',
    instruction: 'Complétez avec les mots proposés.',
    layout: 'fill' as const,
  },
  {
    id: 'repondre-phrase',
    label: 'Répondre avec une phrase',
    description: 'Questions d’identité : répondre par une phrase complète.',
    instruction: 'Répondez aux questions avec une phrase.',
    layout: 'write' as const,
  },
  {
    id: 'ecrire-question',
    label: 'Écrire la question',
    description: 'À partir d’une réponse, écrire la question d’identité.',
    instruction: 'Écrivez la question selon la réponse donnée.',
    layout: 'write' as const,
  },
  {
    id: 'formulaire',
    label: 'Remplir un formulaire',
    description: 'Formulaire d’identité à compléter.',
    instruction: 'Remplissez le formulaire avec vos informations.',
    layout: 'write' as const,
  },
  {
    id: 'co-audio',
    label: 'Écouter et répondre',
    description: 'Compréhension orale : se présenter (format TCF CO).',
    instruction: 'Écoutez et répondez aux questions.',
    layout: 'qcm' as const,
  },
  {
    id: 'ce-texte',
    label: 'Lire et répondre',
    description: 'Compréhension écrite : se présenter (format TCF CE).',
    instruction: 'Lisez et répondez aux questions.',
    layout: 'qcm' as const,
  },
  {
    id: 'portrait',
    label: 'Présenter une personne',
    description: 'Portrait et carte d’identité : écrire quatre phrases.',
    instruction: 'Présentez la personne comme dans l’exemple.',
    layout: 'write' as const,
  },
  {
    id: 'po-images',
    label: 'Se présenter à l’oral',
    description: 'Images de classe : se présenter (format TCF PO).',
    instruction: 'Observez les images. Présentez-vous comme dans l’exemple.',
    layout: 'write' as const,
  },
] as const

export type GramExerciseKindId = (typeof GRAM_EXERCISE_KINDS)[number]['id']

/** Ids du plus long au plus court (parse `gram-ex-{sub}-{kind}`). */
export const GRAM_KIND_IDS: GramExerciseKindId[] = (
  [...GRAM_EXERCISE_KINDS].map((k) => k.id) as GramExerciseKindId[]
).sort((a, b) => b.length - a.length)

export function gramKindById(id: string) {
  return GRAM_EXERCISE_KINDS.find((k) => k.id === id)
}
