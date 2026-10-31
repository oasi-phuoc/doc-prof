import type { GrammaireTheoryDoc } from '../types'
import { ex, ligne, p, sheet, table } from './falc-sheet'

/** Théorie FALC — thème gram-action. Français seul (pas de traductions). */
export const actionDocs: GrammaireTheoryDoc[] = [
  {
    id: 'j1',
    typeId: 'gram-j1-theorie',
    index: 1,
    title: 'Le présent progressif',
    topic: 'gram-action',
    public: 'A1 / A2',
    objectif: 'Dire qu’une action se passe maintenant.',
    blocks: sheet({
      title: 'Le présent progressif',
      intro: 'Je dis qu’une action se passe {g}maintenant{/g}.',
      regarder: [
        '{tab:1<}Je {c}suis en train de{/c} manger. | Il {c}est en train de{/c} téléphoner.',
        '{tab:1<}Nous {c}sommes en train de{/c} travailler. | Elles {c}sont en train d’{/c}écrire.',
        '{tab:1<}Tu {c}es en train de{/c} cuisiner ? | Vous {c}êtes en train de{/c} partir ?',
      ],
      expliquer: [
        p('J’utilise {c}être{/c} au présent + {c}en train de{/c} + infinitif.'),
        p('Être change avec la personne : suis, es, est, sommes, êtes, sont.'),
        p('Le deuxième verbe reste à l’{c}infinitif{/c}.'),
        p('Devant une voyelle, de devient {c}d’{/c}.'),
        ligne,
        ex([
          '{tab:+1+}{g}Personne{/g} | {g}Exemple{/g}',
          '{tab:1>}je | Je {c}suis en train de{/c} lire.',
          '{tab:1>}tu | Tu {c}es en train de{/c} manger.',
          '{tab:1>}il / elle | Il {c}est en train de{/c} dormir.',
          '{tab:1>}nous | Nous {c}sommes en train de{/c} parler.',
          '{tab:1>}vous | Vous {c}êtes en train d’{/c}arriver.',
          '{tab:1>}ils / elles | Ils {c}sont en train de{/c} jouer.',
        ]),
      ],
      retenir: [
        p('Être en train de + infinitif = action en cours.'),
        p('Seul le verbe être se conjugue.'),
        ligne,
        table(
          ['Personne', 'Être en train de'],
          [
            ['je', '{c}suis{/c} en train de'],
            ['tu', '{c}es{/c} en train de'],
            ['il / elle', '{c}est{/c} en train de'],
            ['nous', '{c}sommes{/c} en train de'],
            ['vous', '{c}êtes{/c} en train de'],
            ['ils / elles', '{c}sont{/c} en train de'],
          ],
        ),
        ligne,
        p('{c}Attention :{/c} Je ne conjugue pas le deuxième verbe.'),
        ex([
          { text: 'Je dis : « Je suis en train de {c}manger{/c}. »', wrong: 'Je suis en train de mange.' },
        ]),
      ],
    }),
  },
  {
    id: 'j2',
    typeId: 'gram-j2-theorie',
    index: 2,
    title: 'Le passé récent',
    topic: 'gram-action',
    public: 'A1 / A2',
    objectif: 'Dire qu’une action vient de se terminer.',
    blocks: sheet({
      title: 'Le passé récent',
      intro: 'Je dis qu’une action {g}vient de{/g} se terminer.',
      regarder: [
        '{tab:1<}Je {c}viens de{/c} manger. | Elle {c}vient d’{/c}arriver.',
        '{tab:1<}Nous {c}venons de{/c} finir. | Ils {c}viennent de{/c} partir.',
        '{tab:1<}Tu {c}viens de{/c} téléphoner ? | Vous {c}venez de{/c} commencer ?',
      ],
      expliquer: [
        p('J’utilise {c}venir{/c} au présent + {c}de{/c} + infinitif.'),
        p('L’action est finie, mais elle est très proche.'),
        p('Devant une voyelle, de devient {c}d’{/c}.'),
        p('Ici, venir de ne dit pas le pays d’origine.'),
        ligne,
        ex([
          '{tab:+1+}{g}Personne{/g} | {g}Venir de{/g}',
          '{tab:1>}je | {c}viens de{/c}',
          '{tab:1>}tu | {c}viens de{/c}',
          '{tab:1>}il / elle | {c}vient de{/c}',
          '{tab:1>}nous | {c}venons de{/c}',
          '{tab:1>}vous | {c}venez de{/c}',
          '{tab:1>}ils / elles | {c}viennent de{/c}',
        ]),
      ],
      retenir: [
        p('Venir de + infinitif = passé récent.'),
        p('Le deuxième verbe ne se conjugue pas.'),
        ligne,
        table(
          ['Sens', 'Exemple'],
          [
            ['vient de finir', 'Je viens de manger.'],
            ['devant voyelle', 'Elle vient d’arriver.'],
            ['plusieurs personnes', 'Ils viennent de partir.'],
          ],
        ),
        ligne,
        p('{c}Attention :{/c} Venir de (passé récent) ≠ venir de (pays).'),
        ex([
          { text: 'Je dis : « Je {c}viens de{/c} manger. »', wrong: 'Je viens manger. (sens différent)' },
        ]),
      ],
    }),
  },
  {
    id: 'j3',
    typeId: 'gram-j3-theorie',
    index: 3,
    title: 'Le gérondif',
    topic: 'gram-action',
    public: 'A2',
    objectif: 'Dire deux actions en même temps.',
    blocks: sheet({
      title: 'Le gérondif',
      intro: 'Je dis deux actions {g}en même temps{/g}.',
      regarder: [
        '{tab:1<}Il lit {c}en mangeant{/c}. | Elle parle {c}en marchant{/c}.',
        '{tab:1<}J’écoute {c}en travaillant{/c}. | Nous chantons {c}en cuisinant{/c}.',
        '{tab:1<}Tu souris {c}en parlant{/c}. | Ils apprennent {c}en jouant{/c}.',
      ],
      expliquer: [
        p('Le gérondif = {c}en{/c} + verbe en {c}-ant{/c}.'),
        p('Les deux actions ont le {c}même sujet{/c}.'),
        p('Je prends la forme de nous au présent, puis je mets -ant.'),
        p('Nous parlons → en parlant. Nous finissons → en finissant.'),
        ligne,
        ex([
          '{tab:+2++}{g}Infinitif{/g} | {g}Nous{/g} | {g}Gérondif{/g}',
          '{tab:2+>}parler | parlons | en {c}parlant{/c}',
          '{tab:2+>}finir | finissons | en {c}finissant{/c}',
          '{tab:2+>}manger | mangeons | en {c}mangeant{/c}',
          '{tab:2+>}être | sommes | en {c}étant{/c}',
        ]),
      ],
      retenir: [
        p('En + verbe en -ant.'),
        p('Un seul sujet pour les deux verbes.'),
        ligne,
        table(
          ['Infinitif', 'Gérondif'],
          [
            ['parler', 'en parlant'],
            ['lire', 'en lisant'],
            ['faire', 'en faisant'],
            ['manger', 'en mangeant'],
          ],
        ),
        ligne,
        p('{c}Attention :{/c} Les deux actions ont le même sujet.'),
        ex([
          { text: 'Je dis : « Il lit {c}en mangeant{/c}. »', wrong: 'Il lit en je mange.' },
        ]),
      ],
    }),
  },
]
