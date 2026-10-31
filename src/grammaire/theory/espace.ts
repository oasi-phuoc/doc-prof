import type { GrammaireTheoryDoc } from '../types'
import { ex, ligne, p, sheet, table } from './falc-sheet'

/** Théorie FALC — thème gram-espace. Français seul (pas de traductions). */
export const espaceDocs: GrammaireTheoryDoc[] = [
  {
    id: 'e1',
    typeId: 'gram-e1-theorie',
    index: 1,
    title: 'Les prépositions de lieu',
    topic: 'gram-espace',
    public: 'A1',
    objectif: 'Dire où se trouve une personne ou une chose.',
    blocks: sheet({
      title: 'Les prépositions de lieu',
      intro: 'Je dis {g}où{/g} se trouve une personne ou une chose.',
      regarder: [
        '{tab:1<}Le livre est {c}sur{/c} la table. | Le sac est {c}sous{/c} la chaise.',
        '{tab:1<}Je suis {c}dans{/c} la classe. | L’arrêt est {c}devant{/c} l’école.',
        '{tab:1<}La poste est {c}près de{/c} la gare. | Le parc est {c}loin de{/c} chez moi.',
      ],
      expliquer: [
        p('Une préposition de lieu indique la place.'),
        p('Elle se place {c}devant{/c} le lieu.'),
        p('{c}Près de{/c}, {c}loin de{/c} et {c}à côté de{/c} gardent {c}de{/c}.'),
        ligne,
        ex([
          '{tab:+1+}{g}Préposition{/g} | {g}Exemple{/g}',
          '{tab:1>}sur | sur la table',
          '{tab:1>}sous | sous le lit',
          '{tab:1>}dans | dans le bus',
          '{tab:1>}devant / derrière | devant la porte',
          '{tab:1>}entre | entre la banque et la poste',
          '{tab:1>}près de / loin de | près de l’école',
          '{tab:1>}à côté de | à côté du marché',
        ]),
      ],
      retenir: [
        p('Un lieu = une préposition claire.'),
        p('Je garde de avec près, loin et à côté.'),
        ligne,
        table(
          ['Préposition', 'Exemple'],
          [
            ['sur', 'sur la table'],
            ['sous', 'sous la chaise'],
            ['dans', 'dans la classe'],
            ['devant', 'devant l’école'],
            ['derrière', 'derrière la maison'],
            ['près de', 'près de la gare'],
            ['à côté de', 'à côté de moi'],
          ],
        ),
        ligne,
        p('{c}Attention :{/c} Je ne retire pas de.'),
        ex([
          { text: 'Je dis : « près {c}de{/c} la gare. »', wrong: 'près la gare.' },
        ]),
      ],
    }),
  },
  {
    id: 'e6',
    typeId: 'gram-e6-theorie',
    index: 2,
    title: 'Autres prépositions et adverbes de lieu',
    topic: 'gram-espace',
    public: 'A1 / A2',
    objectif: 'Préciser un lieu avec des mots simples.',
    blocks: sheet({
      title: 'Autres mots de lieu',
      intro: 'Je précise un lieu avec des {g}mots simples{/g}.',
      regarder: [
        '{tab:1<}Le stylo est {c}ici{/c}. | La gare est {c}là-bas{/c}.',
        '{tab:1<}Tourne {c}à droite{/c}. | Le bureau est {c}en haut{/c}.',
        '{tab:1<}Je suis {c}au milieu{/c} de la rue. | Va {c}jusqu’à{/c} la poste.',
      ],
      expliquer: [
        p('{c}Ici{/c} = près de moi. {c}Là{/c} = un peu plus loin. {c}Là-bas{/c} = loin.'),
        p('{c}Devant{/c} est le contraire de {c}derrière{/c}.'),
        p('{c}Près de{/c} est le contraire de {c}loin de{/c}.'),
        p('De + le devient {c}du{/c}. De + les devient {c}des{/c}.'),
        ligne,
        ex([
          '{tab:+1+}{g}Mot{/g} | {g}Exemple{/g}',
          '{tab:1>}à droite / à gauche | à droite du magasin',
          '{tab:1>}en haut / en bas | en haut de l’escalier',
          '{tab:1>}au milieu de | au milieu de la place',
          '{tab:1>}au bord de | au bord du lac',
          '{tab:1>}jusqu’à | jusqu’à la gare',
        ]),
      ],
      retenir: [
        p('Un lieu = un mot de place clair.'),
        ligne,
        table(
          ['Mot', 'Exemple'],
          [
            ['ici / là / là-bas', 'Assieds-toi ici.'],
            ['à droite / à gauche', 'à gauche de la porte'],
            ['en haut / en bas', 'en bas de la rue'],
            ['près du', 'près du magasin'],
            ['jusqu’à', 'jusqu’à l’arrêt'],
          ],
        ),
        ligne,
        p('{c}Attention :{/c} De + le = du. Je ne dis pas « de le ».'),
        ex([
          { text: 'Je dis : « près {c}du{/c} magasin. »', wrong: 'près de le magasin.' },
        ]),
      ],
    }),
  },
  {
    id: 'e7',
    typeId: 'gram-e7-theorie',
    index: 3,
    title: 'Les articles contractés (lieu)',
    topic: 'gram-espace',
    public: 'A1',
    objectif: 'Former au, aux, du et des.',
    blocks: sheet({
      title: 'Les articles contractés',
      intro: 'Je colle {g}à{/g} ou {g}de{/g} avec le ou les.',
      regarder: [
        '{tab:1<}Je vais {c}au{/c} marché. | Je vais {c}aux{/c} toilettes.',
        '{tab:1<}Je viens {c}du{/c} travail. | Je sors {c}des{/c} cours.',
        '{tab:1<}Je vais {c}à la{/c} poste. | Je vais {c}à l’{/c}école.',
      ],
      expliquer: [
        p('{c}À + le{/c} devient {c}au{/c}.'),
        p('{c}À + les{/c} devient {c}aux{/c}.'),
        p('{c}De + le{/c} devient {c}du{/c}.'),
        p('{c}De + les{/c} devient {c}des{/c}.'),
        p('{c}À la{/c}, {c}à l’{/c}, {c}de la{/c} et {c}de l’{/c} ne changent pas.'),
        ligne,
        ex([
          '{tab:+2++}{g}Mots{/g} | {g}Forme{/g} | {g}Exemple{/g}',
          '{tab:2+>}à + le | {c}au{/c} | au parc',
          '{tab:2+>}à + les | {c}aux{/c} | aux magasins',
          '{tab:2+>}de + le | {c}du{/c} | du bureau',
          '{tab:2+>}de + les | {c}des{/c} | des cours',
          '{tab:2+>}à + la | {c}à la{/c} | à la gare',
        ]),
      ],
      retenir: [
        p('Au, aux, du et des sont des formes collées.'),
        p('À la et à l’ restent en deux mots.'),
        ligne,
        table(
          ['Départ', 'Forme', 'Exemple'],
          [
            ['à + le', 'au', 'au marché'],
            ['à + les', 'aux', 'aux toilettes'],
            ['de + le', 'du', 'du travail'],
            ['de + les', 'des', 'des cours'],
            ['à + la / l’', 'à la / à l’', 'à la poste'],
          ],
        ),
        ligne,
        p('{c}Attention :{/c} Je ne dis pas « à le » ni « de le ».'),
        ex([
          { text: 'Je dis : « Je vais {c}au{/c} marché. »', wrong: 'Je vais à le marché.' },
        ]),
      ],
    }),
  },
]
