import type { GrammaireTheoryDoc } from '../types'

/** Théorie FALC — thème gram-conseiller. Français seul (pas de traductions). */
export const conseillerDocs: GrammaireTheoryDoc[] = [
  {
    id: 'f10',
    typeId: 'gram-f10-theorie',
    index: 1,
    title: 'Devoir et pouvoir au conditionnel',
    topic: 'gram-conseiller',
    public: 'A2',
    objectif: 'Conseiller avec devrait / pourrait.',
    blocks: [
    { kind: 'heading', text: 'Devoir et pouvoir au conditionnel' },
    { kind: 'paragraph', text: 'Je donne un conseil poli.' },
    { kind: 'heading', text: 'Je regarde', sub: true },
    { kind: 'rule', text: 'Exemple', examples: [{ correct: 'Tu devrais te reposer.' }, { correct: 'Vous pourriez appeler demain.' }] },
    { kind: 'heading', text: 'J’explique', sub: true },
    { kind: 'paragraph', text: 'Conditionnel de devoir / pouvoir = conseil ou suggestion.' },
    { kind: 'paragraph', text: 'Forme : radical + ais, ais, ait, ions, iez, aient.' },
    { kind: 'note', text: 'Je retiens : tu devrais / vous pourriez + infinitif.' },
    { kind: 'table', headers: ['Personne', 'devoir', 'pouvoir'], rows: [['je', 'devrais', 'pourrais'], ['tu', 'devrais', 'pourrais'], ['il / elle', 'devrait', 'pourrait'], ['nous', 'devrions', 'pourrions'], ['vous', 'devriez', 'pourriez'], ['ils / elles', 'devraient', 'pourraient']] },
    { kind: 'note', text: 'Attention ! Après, garde l’infinitif.' },
    ],
  },
  {
    id: 'f11',
    typeId: 'gram-f11-theorie',
    index: 2,
    title: 'L’impératif',
    topic: 'gram-conseiller',
    public: 'A1',
    objectif: 'Donner un ordre ou un conseil à l’impératif.',
    blocks: [
    { kind: 'heading', text: 'L’impératif' },
    { kind: 'paragraph', text: 'Je donne un ordre, un conseil ou une consigne.' },
    { kind: 'heading', text: 'Je regarde', sub: true },
    { kind: 'rule', text: 'Exemple', examples: [{ correct: 'Écoute !' }, { correct: 'Parlez plus fort !' }, { correct: 'Allons-y !' }] },
    { kind: 'heading', text: 'J’explique', sub: true },
    { kind: 'paragraph', text: 'Impératif : tu, nous, vous — sans pronom sujet.' },
    { kind: 'paragraph', text: 'Verbes en -er : tu sans -s : Parle !' },
    { kind: 'paragraph', text: 'Négation : Ne parle pas !' },
    { kind: 'note', text: 'Je retiens : impératif = pas de sujet devant le verbe.' },
    { kind: 'table', headers: ['Personne', 'Exemple'], rows: [['tu', 'Finis !'], ['nous', 'Finissons !'], ['vous', 'Finissez !']] },
    { kind: 'note', text: 'Attention ! À l’impératif, les verbes en -er perdent le s au tu.' },
    ],
  },
]
