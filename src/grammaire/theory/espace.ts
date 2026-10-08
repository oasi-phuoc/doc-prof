import type { GrammaireTheoryDoc } from '../types'

/** Théorie FALC — thème gram-espace. Français seul (pas de traductions). */
export const espaceDocs: GrammaireTheoryDoc[] = [
  {
    id: 'e1',
    typeId: 'gram-e1-theorie',
    index: 1,
    title: 'Les prépositions de lieu',
    topic: 'gram-espace',
    public: 'A1',
    objectif: 'Situer une personne ou une chose.',
    blocks: [
    { kind: 'heading', text: 'Les prépositions de lieu' },
    { kind: 'paragraph', text: 'Je dis où se trouve une personne ou une chose.' },
    { kind: 'heading', text: 'Je regarde', sub: true },
    { kind: 'rule', text: 'Exemple', examples: [{ correct: 'Le livre est sur la table.' }, { correct: 'Je suis à côté de toi.' }] },
    { kind: 'heading', text: 'J’explique', sub: true },
    { kind: 'paragraph', text: 'Une préposition de lieu indique la place.' },
    { kind: 'paragraph', text: 'Mots utiles : sur, sous, dans, devant, derrière, entre, près de, loin de, à côté de, au milieu de, au-dessus de, au-dessous de, vers.' },
    { kind: 'note', text: 'Je retiens : un lieu = une préposition claire.' },
    { kind: 'list', title: 'Prépositions courantes', items: ['sur', 'sous', 'dans', 'devant', 'derrière', 'entre', 'près de', 'loin de', 'à côté de', 'au milieu de', 'vers'] },
    { kind: 'note', text: 'Attention ! Près de / loin de / à côté de : garde de.' },
    ],
  },
]
