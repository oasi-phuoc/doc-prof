/** 16 types d’exercice Soutien FR — identiques pour chaque document (lettre / son). */
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
    description: 'Tableau de lettres en cercles ; 8 colonnes ; 6 lignes par défaut (max. 15).',
    instruction: 'Entourez toutes les lettres demandées.',
    preferredColumns: 1 as const,
  },
  {
    id: 'syllabes',
    label: '3 · Lecture de syllabes',
    description:
      'Deux blocs cadrés (script + Playwrite) : 5 lignes par défaut, moitié CV et moitié doubles sans nasal.',
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
      'Cartes image + Un/Une + trait (bord thème) ; jusqu’à 18 mots ; colonnes 1–3 ; mode libre.',
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
    description: 'Grille fluide (1–3 colonnes) ; jusqu’à 18 cartes ; syllabes au corrigé.',
    instruction: 'À quelle syllabe entendez-vous le son ?',
    preferredColumns: 1 as const,
  },
  {
    id: 'lettres-phrase',
    label: '9 · Mot dans la phrase',
    description:
      'Phrases + lettres mélangées ; voyelle simple colorée (Alpha : pas an/au/eau…).',
    instruction: 'Écrivez le mot correct à l’aide des lettres.',
    preferredColumns: 1 as const,
  },
  {
    id: 'determinants',
    label: '10 · Déterminants',
    description:
      'Phrases à trous ; l’ / le / la / les ; voyelle simple colorée (Alpha : pas an/au/eau…).',
    instruction: 'Complétez avec les déterminants l’, le, la ou les.',
    preferredColumns: 1 as const,
  },
  {
    id: 'dictee',
    label: '11 · Dictée',
    description: 'Grille 2 colonnes : n° + trait continu ; nombre de mots réglable.',
    instruction: 'Dictée. Écrivez les mots correctement !',
    preferredColumns: 1 as const,
  },
  {
    id: 'compter',
    label: '12 · Compter le son',
    description:
      'Phrases en Playwrite (sans lignes) + compter le phonème simple ; écart questions ×2.',
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
    description:
      'Phrases à lire ; voyelle simple colorée (Alpha : pas an/au/eau…) ; 10 à 20 questions.',
    instruction: 'Lisez les phrases.',
    preferredColumns: 1 as const,
  },
  {
    id: 'associer-audio',
    label: '15 · Écouter et associer',
    description:
      'QR audio + mots à relier ; sans bordure ni soulignement ; jusqu’à 10 mots.',
    instruction: 'Écoutez (QR) et reliez au bon mot.',
    preferredColumns: 1 as const,
  },
  {
    id: 'mots-meles',
    label: '16 · Mots mêlés',
    description:
      'Liste de 12 mots (sans bordure) + grille 15×15 ; lettres agrandies ; pas de ligatures Æ/Œ.',
    instruction: 'Entourez les mots dans la grille.',
    preferredColumns: 1 as const,
  },
] as const

export type SoutienKindId = (typeof SOUTIEN_KINDS)[number]['id']

const KIND_IDS_LONGEST = [...SOUTIEN_KINDS.map((k) => k.id)].sort((a, b) => b.length - a.length)

export function parseSoutienType(
  typeId: string,
): { bankId: string; kind: SoutienKindId; vowel?: string } | null {
  if (!typeId.startsWith('soutien-')) return null
  const rest = typeId.slice('soutien-'.length)
  for (const kind of KIND_IDS_LONGEST) {
    const suffix = `-${kind}`
    if (!rest.endsWith(suffix)) continue
    const bankId = rest.slice(0, -suffix.length)
    if (!bankId) return null
    const vowel = /^[aeiouy]$/.test(bankId) ? bankId : undefined
    return { bankId, kind: kind as SoutienKindId, vowel }
  }
  return null
}
