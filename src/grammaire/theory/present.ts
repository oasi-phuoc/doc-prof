import { theoryGabarit } from '@/francais/grammar-theory'
import type { GrammaireTheoryDoc } from '../types'

/**
 * Théorie FALC — thème gram-present.
 * Partie ClairFLE dédiée à la conjugaison au présent (répartition SCAI).
 * Adapté de notions proches du programme soutien (G1), sans copie.
 */
export const presentDocs: GrammaireTheoryDoc[] = [
  {
    id: 'm2',
    typeId: 'gram-m2-theorie',
    index: 2,
    title: 'Le verbe être',
    topic: 'gram-present',
    public: 'pré-A1 / A1',
    objectif: 'Conjuguer être au présent.',
    blocks: [
      { kind: 'heading', text: 'Le verbe être' },
      { kind: 'paragraph', text: '{ligne/4}' },
      { kind: 'paragraph', text: 'Je conjugue {g}être{/g} au présent.' },
      { kind: 'paragraph', text: '{ligne/2}' },
      {
        kind: 'section',
        role: 'regarder',
        blocks: [
          { kind: 'examples', marker: 'puces', items: [
            '{tab:1<}Je {c}suis{/c} fatigué. | Vous {c}êtes{/c} française.',
            '{tab:1<}Tu {c}es{/c} cuisinier. | Nous {c}sommes{/c} à Sion.',
            '{tab:1<}Il {c}est{/c} prêt. | Ils {c}sont{/c} étudiants.'
          ]},
        ],
      },
      {
        kind: 'section',
        role: 'expliquer',
        blocks: [
          { kind: 'paragraph', text: 'Le verbe {c}être{/c} est un verbe {c}irrégulier{/c}.' },
          { kind: 'paragraph', text: 'J’utilise le verbe être pour {c}donner des informations{/c} sur une personne.' },
          { kind: 'paragraph', text: '{ligne/2}' },
          { kind: 'examples', marker: 'puces', items : [
            '{tab:+1+} {g}Je parle de …{/g} | {g}Exemples{/g}',
            '{tab:1>}{c}Identité{/c} | Je suis {c}Melina{/c}.',
            '{tab:1>}{c}Nationalité{/c} | Je suis {c}suisse{/c}.',
            '{tab:1>}{c}Métier{/c} | Je suis {c}professeure{/c}.',
            '{tab:1>}{c}Description{/c} | Je suis {c}fatigué{/c}.',
            '{tab:1>}{c}Situation{/c} | Je suis {c}à l’école{/c}.',
          ]},
          { kind: 'paragraph', text: '{ligne/2}' },
          { kind: 'paragraph', text: 'Je choisis la {c}bonne forme{/c} du verbe selon la personne.'},
          { kind: 'paragraph', text: '{ligne/2}' },
          { kind: 'examples', marker: 'puces', items: [
            '{tab:+1+} {g}Singulier{/g} | {g}Pluriel{/g}',
            '{tab:1<}Je {c}suis{/c} à la maison. | Nous {c}sommes{/c} à la maison.',
            '{tab:1<}Tu {c}es{/c} à la maison. | Vous {c}êtes{/c} à la maison.',
            '{tab:1<}Il / Elle {c}est{/c} à la maison. | Ils / Elles {c}sont{/c} à la maison.'
          ]},
        ],
      },
      {kind: 'page'},
      {
        kind: 'section',
        role: 'retenir',
        blocks: [
          { kind: 'paragraph', text: 'Je retiens les six formes du verbe {c}être{/c} au présent.' },
          { kind: 'paragraph', text: '{ligne/2}' },
          { kind: 'table', colHeader: true, rowHeader: false, headers: ['Personne', 'Être'],
            rows: [
              ['je', '{c}suis{/c}'],
              ['tu', '{c}es{/c}'],
              ['il / elle / on', '{c}est{/c}'],
              ['nous', '{c}sommes{/c}'],
              ['vous', '{c}êtes{/c}'],
              ['ils / elles', '{c}sont{/c}'],
            ],
          },
          { kind: 'paragraph', text: '{ligne/2}' },
          { kind: 'paragraph', text: 'Je retiens les principaux emplois du verbe {c}être{/c}.' },
          { kind: 'paragraph', text: '{ligne/4}' },
          { kind: 'examples', marker: 'puces', items[
            '{tab:+1+}{g}Je l’utilise pour …{/g}',
            '{tab:1<}l’{c}indentité{/c} | la {c}nationalité{/c}',
            '{tab:1<}le {c}métier{/c} | la {c}description{/c}',
            '{tab:1<}la {c}situation{/c} | ',
          ]},
          { kind: 'paragraph', text: '{ligne/4}' },
          { kind: 'paragraph', text: '{c}Attention : {/c} Ne pas confondre les formes {c}es{/c}-{c}est{/c} et {c}êtes{/c}-{c}est{/c}.' },
          { kind: 'examples', items: [
            { text: 'Je dis : « Vous {c}êtes{/c} ici. »', wrong: '« Vous est ici. »' },
            { text: 'Je dis : « Il {c}est{/c} là. »', wrong: '« Il es là. »' },
        ]},
        ],
      },
    ],
  },
  {
    id: 'm3',
    typeId: 'gram-m3-theorie',
    index: 3,
    title: 'Le verbe avoir',
    topic: 'gram-present',
    public: 'pré-A1 / A1',
    objectif: 'Conjuguer avoir au présent.',
    blocks: [
      { kind: 'heading', text: 'Le verbe avoir' },
      { kind: 'paragraph', text: '{ligne/4}' },
      { kind: 'paragraph', text: 'Je conjugue avoir au présent.' },
      { kind: 'paragraph', text: '{ligne/2}' },
      {
        kind: 'section',
        role: 'regarder',
        blocks: [
          { kind: 'examples', 
            items: [
            '{tab:1<}J’{c}ai{/c} un téléphone. | Nous {c}avons{/c} 25 ans.',
            '{tab:1<}Tu {c}as{/c} faim. | Vous {c}avez{/c} soif.',
            '{tab:1<}Il {c}a{/c} besoin d’aide. | Elles {c}ont{/c} de la chance.',
          ],
          }
        ],
      },
      {
        kind: 'section',
        role: 'expliquer',
        blocks: [
          { kind: 'paragraph', text: 'Le verbe {c}avoir{/c} est un verbe {c}irrégulier{/c}.' },
          { kind: 'paragraph', text: 'Je l’utilise pour la {c}possession{/c} et beaucoup d’{c}expressions{/c}.' },
          { kind: 'paragraph', text: '{ligne/2}' },
          { kind: 'examples', marker: 'puces', 
            items: [
            '{tab:+1+} {g}Je parle de …{/g} | {g}Exemples{/g}',
            '{tab:1>}{c}Possession{/c} | J’ai {c}un téléphone{/c}.',
            '{tab:1>}{c}Âge{/c} | Tu as {c}20 ans{/c} ?',
            '{tab:1>}{c}Famille{/c} | Elle a {c}deux enfants{/c}.',
            '{tab:1>}{c}Sensations{/c} | Vous avez {c}faim{/c}.',
            '{tab:1>}{c}Besoins{/c} | Nous avons {c}besoin d’aide{/c}.',
            '{tab:1>}{c}Expressions{/c} | Ils ont {c}de la chance{/c}.',
          ]},
          { kind: 'paragraph', text: '{ligne/4}' },
          { kind: 'paragraph', text: 'Je choisis la {c}bonne forme{/c} du verbe selon la personne.' },
          { kind: 'paragraph', text: '{ligne/2}' },
          {
            kind: 'examples',
            marker: 'puces',
            items: [
              '{tab:+1+} {g}Singulier{/g} | {g}Pluriel{/g}',
              '{tab:1<}J’{c}ai{/c} faim. | Nous {c}avons{/c} faim.',
              '{tab:1<}Tu {c}as{/c} faim. | Vous {c}avez{/c} faim.',
              '{tab:1<}Il / Elle {c}a{/c} faim. | Ils / Elles {c}ont{/c} faim.',
            ],
          },
        ],
      },
      {kind: 'page'},
      {
        kind: 'section',
        role: 'retenir',
        blocks: [
          { kind: 'paragraph', text: 'Je retiens les six formes du verbe {c}avoir{/c} au présent.' },
          { kind: 'paragraph', text: '{ligne/2}' },
          { kind: 'table', colHeader: true, rowHeader: false, 
            headers: ['Personne', 'avoir'],
            rows: [
              ['j’', '{c}ai{/c}'],
              ['tu', '{c}as{/c}'],
              ['il / elle / on', '{c}a{/c}'],
              ['nous', '{c}avons{/c}'],
              ['vous', '{c}avez{/c}'],
              ['ils / elles', '{c}ont{/c}'],
            ],
          },
          { kind: 'paragraph', text: '{ligne/2}' },
          { kind: 'paragraph', text: 'Je retiens les principaux emplois du verbe {c}avoir{/c}.' },
          { kind: 'paragraph', text: '{ligne/4}' },
          { kind: 'examples', marker: 'puces', items[
            '{tab:+1+}{g}Je l’utilise pour …{/g}',
            '{tab:1<}la {c}possession{/c} | l’{c}âge{/c}',
            '{tab:1<}la {c}famille{/c} | la {c}sensation{/c}',
            '{tab:1<}le {c}besoin{/c} | les {c}expressions{/c}',
          ]},
          { kind: 'paragraph', text: '{ligne/4}' },
          { kind: 'paragraph', text: '{c}Attention :{/c}' },
          {
            kind: 'examples',
            items: [
              { text: 'Je dis : « J’{c}ai{/c} un billet. »', wrong: '« Je ai un billet. »' },
              { text: 'Je dis : « Ils {c}ont{/c} faim. »', wrong: '« Ils sont faim. »' },
              { text: 'Je dis : « J’{c}ai{/c} 20 ans. »', wrong: '« Je suis 20 ans. »' },
            ],
          },
          { kind: 'paragraph', text: '{ligne/2}' },
          { kind: 'paragraph', text: 'Avec certaines sensations et expressions, j’utilise {c}avoir{/c} et non {c}être{/c}.' },
          { kind: 'examples', marker: 'puces',
            items: [
              '{tab:+1+} {g}Sensation{/g} | {g}Expression{/g}',
              '{tab:1<}Avoir {c}faim{/c} / {c}soif{/c} | Avoir {c}raison/tort{/c}',
              '{tab:1<}Avoir {c}froid{/c} / {c}chaud{/c} | Avoir {c}besoin de{/c}',
              '{tab:1<}Avoir {c}peur{/c} | Avoir {c}mal à{/c}',
            ],
          }, 
        ],
      },
    ],
  },
  {
    id: 'm4',
    typeId: 'gram-m4-theorie',
    index: 4,
    title: 'Les verbes en -er au présent',
    topic: 'gram-present',
    public: 'A1',
    objectif: 'Conjuguer un verbe régulier en -er au présent.',
    blocks: [
      { kind: 'heading', text: 'Les verbes en -er' },
      { kind: 'paragraph', text: '{ligne/4}' },
      { kind: 'paragraph', text: 'Je conjugue un verbe du 1er groupe {c}-er{/c} au présent.' },
      { kind: 'paragraph', text: '{ligne/2}' },
      {
        kind: 'section',
        role: 'regarder',
        blocks: [
        {
          kind: 'examples',
          marker: 'puces',
          items: [
            '{tab:1<}Je {c}parle{/c} français. | Tu {c}travailles{/c} à Sion.',
            '{tab:1<}Il {c}habite{/c} en Suisse. | Nous {c}aimons{/c} le café.',
            '{tab:1<}Vous {c}regardez{/c} la télévision. | Elles {c}écoutent{/c} de la musique.',
          ],
        },
      ],
      },
      {
        kind: 'section',
        role: 'expliquer',
        blocks: [
          { kind: 'paragraph', text: 'J’utilise le présent pour parler d’une action qui se passe maintenant, une habitude ou une description.'},
          { kind: 'paragraph', text: 'Pour conjuguer un verbe :'},
          { kind: 'examples', marker: 'numeros',
            items: [
              '{tab:1>}Je regarde le {c}verbe{/c} à l’infinitif | {c}Parler{/c}'
              '{tab:1<}Je retire la {c}terminaison{/c} | Parl{c}-er{/c}',
              '{tab:1<}Je garde le {c}début du verbe{/c} | {c}Parl-{/c} ',
              '{tab:1<}Je rajoute la {c}terminaison{/c} du présent | Je parl{c}e{/c}',
            ],
          }, 
          { kind: 'paragraph', text: '{ligne/2}' },
          { kind: 'paragraph', text: 'Les {c}terminaisons{/c} sont les mêmes pour les verbes réguliers en -er.' },
          {
            kind: 'examples',
            marker: 'puces',
            items: [
              '{tab:+2++} {g}Personne{/g} | {g}Terminaison{/g} | {g}Parler{/g}',
              '{tab:2+>}Je | -{c}e{/c} | Je parl{c}e{/c}',
              '{tab:2+>}Tu | -{c}es{/c} | Tu parl{c}es{/c}',
              '{tab:2+>}Il / Elle / On | -{c}e{/c} | Elle parl{c}e{/c}',
              '{tab:2+>}Nous | -{c}ons{/c} | Nous parl{c}ons{/c}',
              '{tab:2+>}Vous | -{c}ez{/c} | Vous parl{c}ez{/c}',
              '{tab:2+>}Ils / Elles | -{c}ent{/c} | Ils parl{c}ent{/c}',
            ],
          },

        ],
      },
      {
        kind: 'section',
        role: 'retenir',
        blocks: [  
          { kind: 'paragraph', text: 'Je trouve le radical quand j’enlève {c}er{/c} de l’infinitif.' },
          { kind: 'paragraph', text: '{ligne/4}' },
          { kind: 'paragraph', text: 'Je rajoute les terminaison : -e, -es, -e, -ons, -ez, -ent pour former le verbe.' }
          { kind: 'table', colHeader: true, rowHeader: true, headers: ['Personne', 'parler'],
            rows: [
              ['je', 'parle'],
              ['tu', 'parles'],
              ['il / elle / on', 'parle'],
              ['nous', 'parlons'],
              ['vous', 'parlez'],
              ['ils / elles', 'parlent'],
            ],
          },
          { kind: 'paragraph', text: '{c}Attention : {/c} Le verbe {c}aller{/c} termine en -{c}er{/c} mais il est {c}irrégulier{/c}.' }
        ],
      },
    ],
  },
  {
    id: 'm5',
    typeId: 'gram-m5-theorie',
    index: 5,
    title: 'Les verbes en -er particuliers',
    topic: 'gram-present',
    public: 'A1 / A2',
    objectif: 'Reconnaître les changements orthographiques des verbes en -er.',
    blocks: [
      { kind: 'heading', text: 'Les verbes en -er particuliers' },
      { kind: 'paragraph', text: '{ligne/4}' },
      { kind: 'paragraph', text: 'Certains verbes en -er changent l’écriture.' },
      { kind: 'paragraph', text: '{ligne/2}' },
      {
        kind: 'section',
        role: 'regarder',
        blocks: [
          { kind: 'examples', items: [
              'Nous mangeons.',
              'Je jette le papier.',
              'Je vais au travail.',
            ],
          }
        ],
      },
      {
        kind: 'section',
        role: 'expliquer',
        blocks: [
          { kind: 'paragraph', text: 'Aller : je vais, tu vas, il va, nous allons, vous allez, ils vont.' },
          { kind: 'paragraph', text: 'Verbes en -ger : nous mangeons (e gardé devant o).' },
          { kind: 'paragraph', text: 'Verbes en -cer : nous commençons (ç devant o).' },
          { kind: 'paragraph', text: 'Certains doublent une consonne : jeter → je jette.' },
          { kind: 'paragraph', text: 'Certains changent e → è : acheter → j’achète.' }
        ],
      },
      {
        kind: 'section',
        role: 'retenir',
        blocks: [
          { kind: 'paragraph', text: 'regarde l’infinitif pour choisir le modèle.' },
          { kind: 'table', colHeader: true, rowHeader: true, headers: ['Cas', 'Exemple'],
            rows: [
              ['aller', 'je vais'],
              ['-ger', 'nous mangeons'],
              ['-cer', 'nous commençons'],
              ['double consonne', 'je jette'],
              ['e → è', 'j’achète'],
            ],
          },
          { kind: 'attention', text: 'Apprendre aller par cœur : il est très fréquent.' }
        ],
      },
    ],
  },
  {
    id: 'a4',
    typeId: 'gram-a4-theorie',
    index: 4,
    title: 'Aller : destination (pays et villes)',
    topic: 'gram-present',
    public: 'A1',
    objectif: 'Dire où je vais (pays, continent, ville).',
    blocks: [
      { kind: 'heading', text: 'Aller : destination (pays et villes)' },
      { kind: 'paragraph', text: '{ligne/4}' },
      { kind: 'paragraph', text: 'Je dis ma destination avec le verbe aller.' },
      { kind: 'paragraph', text: '{ligne/2}' },
      {
        kind: 'section',
        role: 'regarder',
        blocks: [
          { kind: 'examples', items: ['Je vais au Sénégal.', 'Elle va en Chine.', 'Ils vont à Sion.'] },
        ],
      },
      {
        kind: 'section',
        role: 'expliquer',
        blocks: [
          { kind: 'paragraph', text: 'Le verbe aller indique la destination.' },
          { kind: 'paragraph', text: 'Pays masculin + consonne → au.' },
          { kind: 'paragraph', text: 'Pays masculin + voyelle → en.' },
          { kind: 'paragraph', text: 'Pays féminin → en. Pays pluriel → aux.' },
          { kind: 'paragraph', text: 'Continent → en. Ville → à.' },
        ],
      },
      {
        kind: 'section',
        role: 'retenir',
        blocks: [
          { kind: 'paragraph', text: 'aller = destination. au / en / aux / à selon le lieu.' },
          { kind: 'table', colHeader: true, rowHeader: true, headers: ['Lieu', 'Forme', 'Exemple'], rows: [['pays masc. + consonne', 'au', 'Je vais au Sénégal.'], ['pays masc. + voyelle', 'en', 'Tu vas en Irak.'], ['pays féminin', 'en', 'Elle va en Chine.'], ['pays pluriel', 'aux', 'Nous allons aux Pays-Bas.'], ['continent', 'en', 'Vous allez en Europe.'], ['ville', 'à', 'Ils vont à Sion.']] },
          { kind: 'attention', text: 'Ne confonds pas au et en.' },
        ],
      },
    ],
  },
  {
    id: 'a5',
    typeId: 'gram-a5-theorie',
    index: 5,
    title: 'Aller : destination (lieux et chez)',
    topic: 'gram-present',
    public: 'A1',
    objectif: 'Dire où je vais (lieux, chez quelqu’un).',
    blocks: [
      { kind: 'heading', text: 'Aller : lieux et chez' },
      { kind: 'paragraph', text: '{ligne/4}' },
      { kind: 'paragraph', text: 'Je vais à un lieu. Je vais chez une personne.' },
      { kind: 'paragraph', text: '{ligne/2}' },
      {
        kind: 'section',
        role: 'regarder',
        blocks: [
          { kind: 'examples', items: ['Je vais chez Sarah.', 'Elle va à la poste.', 'Ils vont au magasin.'] },
        ],
      },
      {
        kind: 'section',
        role: 'expliquer',
        blocks: [
          { kind: 'paragraph', text: 'Chez + personne.' },
          { kind: 'paragraph', text: 'Lieu féminin → à la. Voyelle ou h → à l’.' },
          { kind: 'paragraph', text: 'Lieu masculin + consonne → au. Pluriel → aux.' },
        ],
      },
      {
        kind: 'section',
        role: 'retenir',
        blocks: [
          { kind: 'paragraph', text: 'chez = personne. à la / à l’ / au / aux = lieu.' },
          { kind: 'table', colHeader: true, rowHeader: true, headers: ['Cas', 'Forme', 'Exemple'], rows: [['personne', 'chez', 'Je vais chez Sarah.'], ['lieu féminin', 'à la', 'Elle va à la poste.'], ['voyelle / h', 'à l’', 'Nous allons à l’école.'], ['lieu masculin', 'au', 'Ils vont au magasin.'], ['pluriel', 'aux', 'Je vais aux Îles.']] },
          { kind: 'attention', text: 'École est féminin → à l’école.' },
        ],
      },
    ],
  },
  {
    id: 'm6',
    typeId: 'gram-m6-theorie',
    index: 6,
    title: 'Les verbes en -ir',
    topic: 'gram-present',
    public: 'A1 / A2',
    objectif: 'Conjuguer les modèles principaux des verbes en -ir.',
    blocks: [
      { kind: 'heading', text: 'Les verbes en -ir' },
      { kind: 'paragraph', text: '{ligne/4}' },
      { kind: 'paragraph', text: 'Je conjugue un verbe en -ir selon son modèle.' },
      { kind: 'paragraph', text: '{ligne/2}' },
      {
        kind: 'section',
        role: 'regarder',
        blocks: [
          { kind: 'examples', items: [
              'Je finis le travail.',
              'Elle part tôt.',
              'Nous venons demain.',
            ],
          }
        ],
      },
      {
        kind: 'section',
        role: 'expliquer',
        blocks: [
          { kind: 'paragraph', text: 'Modèle finir : je finis, tu finis, il finit, nous finissons…' },
          { kind: 'paragraph', text: 'Modèle partir / dormir / servir : je pars, tu dors, il sert…' },
          { kind: 'paragraph', text: 'Modèle ouvrir : j’ouvre, tu ouvres, il ouvre (comme un -er).' },
          { kind: 'paragraph', text: 'Modèle venir / tenir : je viens, tu viens, il vient, nous venons…' }
        ],
      },
      {
        kind: 'section',
        role: 'retenir',
        blocks: [
          { kind: 'paragraph', text: 'un verbe en -ir n’a pas une seule conjugaison.' },
          { kind: 'table', colHeader: true, rowHeader: true, headers: ['Modèle', 'je', 'nous'],
            rows: [
              ['finir', 'finis', 'finissons'],
              ['partir', 'pars', 'partons'],
              ['ouvrir', 'ouvre', 'ouvrons'],
              ['venir', 'viens', 'venons'],
            ],
          },
          { kind: 'attention', text: 'Venir et tenir changent beaucoup : apprends-les à part.' }
        ],
      },
    ],
  },
  {
    id: 'm7',
    typeId: 'gram-m7-theorie',
    index: 7,
    title: 'Les verbes en -re et -oir',
    topic: 'gram-present',
    public: 'A1 / A2',
    objectif: 'Conjuguer les modèles fréquents en -re et -oir.',
    blocks: [
      { kind: 'heading', text: 'Les verbes en -re et -oir' },
      { kind: 'paragraph', text: '{ligne/4}' },
      { kind: 'paragraph', text: 'Je conjugue des verbes fréquents hors du 1er groupe.' },
      { kind: 'paragraph', text: '{ligne/2}' },
      {
        kind: 'section',
        role: 'regarder',
        blocks: [
          { kind: 'examples', items: [
              'Je prends le bus.',
              'Tu lis un livre.',
              'Il veut un café.',
            ],
          }
        ],
      },
      {
        kind: 'section',
        role: 'expliquer',
        blocks: [
          { kind: 'paragraph', text: 'Verbes en -dre : je prends, tu prends, il prend, nous prenons…' },
          { kind: 'paragraph', text: 'Verbes en -ire : je lis, tu lis, il lit, nous lisons…' },
          { kind: 'paragraph', text: 'Faire : je fais, tu fais, il fait, nous faisons, vous faites, ils font.' },
          { kind: 'paragraph', text: 'Vouloir / pouvoir / devoir / savoir : formes irrégulières à mémoriser.' },
          { kind: 'paragraph', text: 'Savoir ≠ connaître : savoir = une info / une compétence ; connaître = une personne / un lieu.' }
        ],
      },
      {
        kind: 'section',
        role: 'retenir',
        blocks: [
          { kind: 'paragraph', text: 'apprends les verbes fréquents un par un.' },
          { kind: 'table', colHeader: true, rowHeader: true, headers: ['Verbe', 'je', 'nous', 'ils'],
            rows: [
              ['prendre', 'prends', 'prenons', 'prennent'],
              ['lire', 'lis', 'lisons', 'lisent'],
              ['faire', 'fais', 'faisons', 'font'],
              ['vouloir', 'veux', 'voulons', 'veulent'],
              ['pouvoir', 'peux', 'pouvons', 'peuvent'],
              ['devoir', 'dois', 'devons', 'doivent'],
            ],
          },
          { kind: 'attention', text: 'Vous faites (pas « vous faisez »).' }
        ],
      },
    ],
  },
  {
    id: 'modaux',
    typeId: 'gram-modaux-theorie',
    index: 8,
    title: 'Pouvoir, devoir, vouloir',
    topic: 'gram-present',
    public: 'A1',
    objectif: 'À compléter.',
    blocks: theoryGabarit('Pouvoir, devoir, vouloir'),
  },
  {
    id: 'pronominaux',
    typeId: 'gram-pronominaux-theorie',
    index: 9,
    title: 'Verbes pronominaux',
    topic: 'gram-present',
    public: 'A1',
    objectif: 'À compléter.',
    blocks: theoryGabarit('Verbes pronominaux'),
  },
  {
    id: 'a8',
    typeId: 'gram-a8-theorie',
    index: 10,
    title: 'La négation ne … pas',
    topic: 'gram-present',
    public: 'A1',
    objectif: 'Former une phrase négative avec ne … pas.',
    blocks: [
    { kind: 'heading', text: 'La négation ne … pas' },
    { kind: 'paragraph', text: '{ligne/4}' },
    { kind: 'paragraph', text: 'Je mets ne et pas autour du verbe.' },
    { kind: 'paragraph', text: '{ligne/2}' },
    {
      kind: 'section',
      role: 'regarder',
      blocks: [
        { kind: 'examples', items: [{ text: 'Je ne suis pas italien.', wrong: 'Je suis pas italien (à l’écrit)' }] }
      ],
    },
    {
      kind: 'section',
      role: 'expliquer',
      blocks: [
        { kind: 'paragraph', text: 'Ne et pas forment la négation.' },
        { kind: 'paragraph', text: 'Ils se placent autour du verbe.' },
        { kind: 'paragraph', text: 'Temps composé : ne + auxiliaire + pas + participe.' }
      ],
    },
    {
      kind: 'section',
      role: 'retenir',
      blocks: [
        { kind: 'paragraph', text: 'négation de base = ne … pas autour du verbe.' },
        { kind: 'table', colHeader: true, rowHeader: true, headers: ['Cas', 'Forme', 'Exemple'], rows: [['présent', 'ne + verbe + pas', 'Je ne suis pas italien.'], ['composé', 'ne + auxiliaire + pas + participe', 'Je n’ai pas compris.'], ['infinitif', 'ne pas + verbe', 'Ne pas fumer.'], ['impératif', 'ne + verbe + pas', 'Ne fumez pas !']] },
        { kind: 'astuce', text: 'Devant une voyelle : ne → n’.' }
      ],
    },
    ],
  },
  {
    id: 'a9',
    typeId: 'gram-a9-theorie',
    index: 11,
    title: 'Autres négations',
    topic: 'gram-present',
    public: 'A1 / A2',
    objectif: 'Utiliser jamais, plus, rien, personne…',
    blocks: [
    { kind: 'heading', text: 'Autres négations' },
    { kind: 'paragraph', text: '{ligne/4}' },
    { kind: 'paragraph', text: 'Je choisis la bonne négation selon le sens.' },
    { kind: 'paragraph', text: '{ligne/2}' },
    {
      kind: 'section',
      role: 'regarder',
      blocks: [
        { kind: 'examples', items: ['Je n’ai jamais gagné.', 'Je n’ai plus d’argent.'] }
      ],
    },
    {
      kind: 'section',
      role: 'expliquer',
      blocks: [
        { kind: 'paragraph', text: 'Certaines négations remplacent pas.' },
        { kind: 'paragraph', text: 'Ne … jamais = aucune fois.' },
        { kind: 'paragraph', text: 'Ne … plus = avant oui, maintenant non.' },
        { kind: 'paragraph', text: 'Après sans, le déterminant disparaît.' }
      ],
    },
    {
      kind: 'section',
      role: 'retenir',
      blocks: [
        { kind: 'paragraph', text: 'une idée négative = une négation adaptée.' },
        { kind: 'table', colHeader: true, rowHeader: true, headers: ['Affirmatif', 'Négatif'], rows: [['déjà / toujours', 'ne … jamais / ne … pas encore'], ['encore', 'ne … plus'], ['tout', 'ne … rien'], ['quelqu’un', 'ne … personne'], ['quelques', 'ne … aucun(e)'], ['avec', 'sans']] },
        { kind: 'attention', text: 'Réponse à une négation : Si = oui malgré le non.' }
      ],
    },
    ],
  },
]
