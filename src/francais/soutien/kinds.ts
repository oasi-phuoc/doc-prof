/** 16 types d’exercice Soutien FR — identiques pour chaque document (voyelle). */
export const SOUTIEN_KINDS = [
  {
    id: 'mots',
    label: '1 · Mots et images',
    description: '16 mots du son avec image (banque vocabulaire si disponible).',
    instruction: 'Observez les images et lisez les mots où l’on entend le son.',
    preferredColumns: 1 as const,
  },
  {
    id: 'lettres',
    label: '2 · Reconnaître la lettre',
    description: 'Entourer la lettre cible parmi d’autres lettres.',
    instruction: 'Entourez toutes les lettres demandées.',
    preferredColumns: 1 as const,
  },
  {
    id: 'syllabes',
    label: '3 · Lecture de syllabes',
    description: 'Deux tableaux 4×5 sans bordure : script puis Playwrite, voyelle en couleur.',
    instruction: 'Lisez les syllabes ci-dessous.',
    preferredColumns: 1 as const,
  },
  {
    id: 'relier',
    label: '4 · Relier les parties',
    description: 'Relier des syllabes correctement découpées pour former les mots.',
    instruction: 'Reliez les parties et formez un mot.',
    preferredColumns: 1 as const,
  },
  {
    id: 'completer',
    label: '5 · Compléter les mots',
    description: 'Image + Un/Une + syllabe à écrire (consonne + voyelle), trait couleur thème.',
    instruction: 'Complétez les mots à l’aide de l’image.',
    preferredColumns: 1 as const,
  },
  {
    id: 'ecouter',
    label: '6 · Entendre le son',
    description: 'Grille 3×3 : écouter, cocher et écrire quand on entend le son (sans image).',
    instruction: 'Écoutez les mots et cochez quand vous entendez le son.',
    preferredColumns: 1 as const,
  },
  {
    id: 'ecouter-image',
    label: '7 · Entendre avec image',
    description: 'Grille 3×5 : image + n° (1, 2, 3…) + case à cocher si on entend le son.',
    instruction: 'Écoutez. Cochez quand vous entendez le son (regardez l’image).',
    preferredColumns: 1 as const,
  },
  {
    id: 'syllabe-son',
    label: '8 · Syllabe du son',
    description: 'Grille 3×4 : image + n° + mini-tableau (une case par syllabe du mot).',
    instruction: 'À quelle syllabe entendez-vous le son ?',
    preferredColumns: 1 as const,
  },
  {
    id: 'lettres-phrase',
    label: '9 · Mot dans la phrase',
    description: 'Image + phrase : trait (couleur thème) + lettres mélangées à remettre en ordre.',
    instruction: 'Écrivez le mot correct à l’aide des lettres.',
    preferredColumns: 1 as const,
  },
  {
    id: 'determinants',
    label: '10 · Déterminants',
    description: 'Tableau : phrases à compléter avec l’ / le / la / les (traits couleur thème).',
    instruction: 'Complétez avec les déterminants l’, le, la ou les.',
    preferredColumns: 1 as const,
  },
  {
    id: 'dictee',
    label: '11 · Dictée',
    description: 'Grille 2×4 : n° + double trait (couleur thème) pour écrire 8 mots.',
    instruction: 'Dictée. Écrivez les mots correctement !',
    preferredColumns: 1 as const,
  },
  {
    id: 'compter',
    label: '12 · Compter le son',
    description: 'Phrase à lire en Playwrite + compter combien de fois on entend le son.',
    instruction: 'Combien de fois entendez-vous le son ?',
    preferredColumns: 1 as const,
  },
  {
    id: 'ordre',
    label: '13 · Remettre en ordre',
    description: 'Remettre les mots dans l’ordre — pastilles couleurs Gattegno selon la nature.',
    instruction: 'Mettez les mots dans l’ordre.',
    preferredColumns: 1 as const,
  },
  {
    id: 'lire',
    label: '14 · Phrases à lire',
    description: 'Tableau de phrases à lire — voyelle du thème en couleur.',
    instruction: 'Lisez les phrases.',
    preferredColumns: 1 as const,
  },
  {
    id: 'associer-audio',
    label: '15 · Écouter et associer',
    description: 'QR audio à gauche + mots à relier à droite (voyelle colorée).',
    instruction: 'Écoutez (QR) et reliez au bon mot.',
    preferredColumns: 1 as const,
  },
  {
    id: 'mots-meles',
    label: '16 · Mots mêlés',
    description: 'Liste de 12 mots + grille 15×15 à entourer.',
    instruction: 'Entourez les mots dans la grille.',
    preferredColumns: 1 as const,
  },
] as const

export type SoutienKindId = (typeof SOUTIEN_KINDS)[number]['id']

export function parseSoutienType(
  typeId: string,
): { vowel: string; kind: SoutienKindId } | null {
  const m =
    /^soutien-([aeiouy])-(mots|lettres|syllabes|relier|completer|ecouter-image|ecouter|syllabe-son|lettres-phrase|determinants|dictee|compter|ordre|lire|associer-audio|mots-meles)$/.exec(
      typeId,
    )
  if (!m) return null
  return { vowel: m[1]!, kind: m[2] as SoutienKindId }
}
