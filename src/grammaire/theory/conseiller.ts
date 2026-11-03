import type { GrammaireTheoryDoc } from '../types'
import { ex, ligne, p, sheet, table } from './falc-sheet'

/** Théorie FALC — thème gram-conseiller. Français seul (pas de traductions). */
export const conseillerDocs: GrammaireTheoryDoc[] = [
  {
    id: 'f10',
    typeId: 'gram-f10-theorie',
    index: 1,
    title: 'Devoir et pouvoir au conditionnel',
    topic: 'gram-conseiller',
    public: 'A2',
    objectif: 'Donner un conseil poli avec tu devrais ou vous pourriez.',
    blocks: sheet({
      title: 'Devoir et pouvoir au conditionnel',
      intro: 'Je donne un conseil {g}poli{/g}.',
      regarder: [
        '{tab:1<}Tu {c}devrais{/c} te reposer. | Vous {c}devriez{/c} venir plus tôt.',
        '{tab:1<}Tu {c}pourrais{/c} prendre le bus. | Vous {c}pourriez{/c} demander de l’aide.',
        '{tab:1<}Il {c}devrait{/c} voir un médecin. | Nous {c}devrions{/c} partir.',
      ],
      expliquer: [
        p('{c}Devoir{/c} au conditionnel = un conseil.'),
        p('{c}Pouvoir{/c} au conditionnel = une suggestion polie.'),
        p('Le deuxième verbe reste à l’{c}infinitif{/c}.'),
        p('Les terminaisons sont : ais, ais, ait, ions, iez, aient.'),
        ligne,
        ex([
          '{tab:+2++}{g}Personne{/g} | {g}Devoir{/g} | {g}Pouvoir{/g}',
          '{tab:2+>}je | devr{c}ais{/c} | pourr{c}ais{/c}',
          '{tab:2+>}tu | devr{c}ais{/c} | pourr{c}ais{/c}',
          '{tab:2+>}il / elle | devr{c}ait{/c} | pourr{c}ait{/c}',
          '{tab:2+>}nous | devr{c}ions{/c} | pourr{c}ions{/c}',
          '{tab:2+>}vous | devr{c}iez{/c} | pourr{c}iez{/c}',
          '{tab:2+>}ils / elles | devr{c}aient{/c} | pourr{c}aient{/c}',
        ]),
      ],
      retenir: [
        p('Tu devrais / vous pourriez + infinitif.'),
        p('C’est plus poli qu’un ordre.'),
        ligne,
        table(
          ['Conseil', 'Exemple'],
          [
            ['devoir, tu', 'Tu devrais dormir.'],
            ['devoir, vous', 'Vous devriez manger.'],
            ['pouvoir, tu', 'Tu pourrais appeler.'],
            ['pouvoir, vous', 'Vous pourriez répéter.'],
          ],
        ),
        ligne,
        p('{c}Attention :{/c} Après devrais ou pourrais, je garde l’infinitif.'),
        ex([
          { text: 'Je dis : « Tu devrais {c}dormir{/c}. »', wrong: 'Tu devrais dors.' },
        ]),
      ],
    }),
  },
  {
    id: 'f11',
    typeId: 'gram-f11-theorie',
    index: 2,
    title: 'L’impératif',
    topic: 'gram-conseiller',
    public: 'A1 / A2',
    objectif: 'Donner un ordre, un conseil ou une consigne.',
    blocks: sheet({
      title: 'L’impératif',
      intro: 'Je donne un ordre, un conseil ou une {g}consigne{/g}.',
      regarder: [
        '{tab:1<}{c}Parle{/c} plus fort ! | {c}Parlons{/c} français.',
        '{tab:1<}{c}Écoutez{/c} la consigne. | {c}Prends{/c} le bus.',
        '{tab:1<}{c}Ne parle pas{/c} ! | {c}Ne fumez pas{/c}.',
      ],
      expliquer: [
        p('L’impératif existe pour {c}tu{/c}, {c}nous{/c} et {c}vous{/c}.'),
        p('Je n’écris pas le pronom sujet devant le verbe.'),
        p('Pour un verbe en -er, tu perd le {c}s{/c} : Parle !'),
        p('À la négation : {c}ne{/c} + verbe + {c}pas{/c}.'),
        ligne,
        ex([
          '{tab:+2++}{g}Personne{/g} | {g}Parler{/g} | {g}Finir{/g}',
          '{tab:2+>}tu | {c}parle{/c} | {c}finis{/c}',
          '{tab:2+>}nous | {c}parlons{/c} | {c}finissons{/c}',
          '{tab:2+>}vous | {c}parlez{/c} | {c}finissez{/c}',
        ]),
      ],
      retenir: [
        p('Pas de sujet devant le verbe.'),
        p('Verbes en -er : pas de s avec tu.'),
        ligne,
        table(
          ['Personne', 'Affirmatif', 'Négatif'],
          [
            ['tu', 'Parle !', 'Ne parle pas !'],
            ['nous', 'Parlons !', 'Ne parlons pas !'],
            ['vous', 'Parlez !', 'Ne parlez pas !'],
          ],
        ),
        ligne,
        p('{c}Attention :{/c} Être et avoir sont irréguliers : sois, soyons, soyez / aie, ayons, ayez.'),
        ex([
          { text: 'Je dis : « {c}Parle{/c} ! »', wrong: 'Parles !' },
          { text: 'Je dis : « {c}Sois{/c} calme. »', wrong: 'Es calme.' },
        ]),
      ],
    }),
  },
]
