import type { GrammaireTheoryDoc } from '../types'

/** Théorie FALC — thème gram-avenir. Français seul (pas de traductions). */
export const avenirDocs: GrammaireTheoryDoc[] = [
  {
    id: 'j4',
    typeId: 'gram-j4-theorie',
    index: 1,
    title: 'Le futur proche',
    topic: 'gram-avenir',
    public: 'A1',
    objectif: 'Parler d’un avenir proche.',
    blocks: [
    { kind: 'heading', text: 'Le futur proche' },
    { kind: 'paragraph', text: 'Je parle d’un événement bientôt.' },
    { kind: 'heading', text: 'Je regarde', sub: true },
    { kind: 'rule', text: 'Exemple', examples: [{ correct: 'Il va pleuvoir.' }, { correct: 'Nous allons partir.' }] },
    { kind: 'heading', text: 'J’explique', sub: true },
    { kind: 'paragraph', text: 'Aller au présent + infinitif.' },
    { kind: 'paragraph', text: 'Souvent à l’oral pour un avenir proche.' },
    { kind: 'note', text: 'Je retiens : aller + infinitif.' },
    { kind: 'table', headers: ['Personne', 'Exemple'], rows: [['je vais', 'Je vais étudier.'], ['tu vas', 'Tu vas comprendre.'], ['il va', 'Il va neiger.']] },
    { kind: 'note', text: 'Attention ! Aller se conjugue ; le 2e verbe reste infinitif.' },
    ],
  },
  {
    id: 'j5',
    typeId: 'gram-j5-theorie',
    index: 2,
    title: 'Le futur simple',
    topic: 'gram-avenir',
    public: 'A2',
    objectif: 'Parler de l’avenir avec le futur simple.',
    blocks: [
    { kind: 'heading', text: 'Le futur simple' },
    { kind: 'paragraph', text: 'Je parle de l’avenir.' },
    { kind: 'heading', text: 'Je regarde', sub: true },
    { kind: 'rule', text: 'Exemple', examples: [{ correct: 'Je marcherai.' }, { correct: 'Tu seras prêt.' }] },
    { kind: 'heading', text: 'J’explique', sub: true },
    { kind: 'paragraph', text: 'Souvent : infinitif + ai, as, a, ons, ez, ont.' },
    { kind: 'paragraph', text: 'Verbes en -e (lire) : enlève le e → je lirai.' },
    { kind: 'paragraph', text: 'Irréguliers : être → ser-, avoir → aur-, aller → ir-, faire → fer-…' },
    { kind: 'note', text: 'Je retiens : radical du futur + terminaisons ai/as/a/ons/ez/ont.' },
    { kind: 'table', headers: ['Personne', 'parler'], rows: [['je', 'parlerai'], ['tu', 'parleras'], ['il', 'parlera'], ['nous', 'parlerons'], ['vous', 'parlerez'], ['ils', 'parleront']] },
    { kind: 'note', text: 'Attention ! J’irai (aller), je ferai (faire), j’aurai (avoir), je serai (être).' },
    ],
  },
]
