/** 16 types d’exercice Soutien FR — identiques pour chaque document (voyelle). */
export const SOUTIEN_KINDS = [
  {
    id: 'mots',
    label: '1 · Mots et images',
    description:
      '16 mots (lecture + Voc) filtrés par le phonème exact ; /o/ écrit = lettre o.',
    instruction: 'Observez les images et lisez les mots où l’on entend le son.',
    preferredColumns: 1 as const,
  },
  {
    id: 'lettres',
    label: '2 · Reconnaître la lettre',
    description: 'Tableau de lettres sans numérotation ; jusqu’à 15 lignes.',
    instruction: 'Entourez toutes les lettres demandées.',
    preferredColumns: 1 as const,
  },
  {
    id: 'syllabes',
    label: '3 · Lecture de syllabes',
    description:
      'Deux tableaux (script + Playwrite) : lignes paires, moitié CV et moitié doubles sans nasal.',
    instruction: 'Lisez les syllabes ci-dessous.',
    preferredColumns: 1 as const,
  },
  {
    id: 'relier',
    label: '4 · Relier les parties',
    description:
      'Jusqu’à 16 mots (type 1) ; n° · partie · ● · espace · ● · partie ; 1 ou 2 tableaux.',
    instruction: 'Reliez les parties et formez un mot.',
    preferredColumns: 1 as const,
  },
  {
    id: 'completer',
    label: '5 · Compléter les mots',
    description:
      'Image + Un/Une + trait ; colonnes 1–3 pleine largeur (g/c/d) ; mode libre.',
    instruction: 'Complétez les mots à l’aide de l’image.',
    preferredColumns: 1 as const,
  },
  {
    id: 'ecouter',
    label: '6 · Entendre le son',
    description: 'Grille fluide (1–3 colonnes) avec QR audio ; cocher et écrire le mot.',
    instruction: 'Écoutez les mots et cochez quand vous entendez le son.',
    preferredColumns: 1 as const,
  },
  {
    id: 'ecouter-image',
    label: '7 · Entendre avec image',
    description: 'Grille images fluide (3–5 colonnes) ; n° et case centrés, réponse dessous.',
    instruction: 'Écoutez. Cochez quand vous entendez le son (regardez l’image).',
    preferredColumns: 1 as const,
  },
  {
    id: 'syllabe-son',
    label: '8 · Syllabe du son',
    description: 'Grille fluide (1–3 colonnes) ; syllabes dans les cases au corrigé.',
    instruction: 'À quelle syllabe entendez-vous le son ?',
    preferredColumns: 1 as const,
  },
  {
    id: 'lettres-phrase',
    label: '9 · Mot dans la phrase',
    description:
      '25 phrases par son ; lettres remélangées à chaque tirage ; hauteurs égales, sans bordure.',
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
    description:
      'Remettre les mots dans l’ordre — pastilles Gattegno ; sans coloriage des lettres du son.',
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
