import type { GrammaireTheoryDoc } from '../types'
import { ex, ligne, p, sheet, table } from './falc-sheet'

/** Théorie FALC — thème gram-argumenter. Français seul (pas de traductions). */
export const argumenterDocs: GrammaireTheoryDoc[] = [
  {
    id: 'k1',
    typeId: 'gram-k1-theorie',
    index: 1,
    title: 'Approuver et désapprouver',
    topic: 'gram-argumenter',
    public: 'A2',
    objectif: 'Dire son avis clairement.',
    blocks: sheet({
      title: 'Approuver et désapprouver',
      intro: 'Je dis mon {g}avis{/g} clairement.',
      regarder: [
        '{tab:1<}{c}Je pense que{/c} c’est une bonne idée. | {c}À mon avis{/c}, c’est trop cher.',
        '{tab:1<}{c}Je suis d’accord{/c}. | {c}Je ne suis pas d’accord{/c}.',
        '{tab:1<}{c}Je suis pour{/c}. | {c}Je suis contre{/c}.',
      ],
      expliquer: [
        p('Pour donner un avis : je pense que, à mon avis, selon moi.'),
        p('Pour approuver : je suis d’accord, je suis pour.'),
        p('Pour désapprouver : je ne suis pas d’accord, je suis contre.'),
        p('Après {c}je pense que{/c}, le verbe suivant se conjugue.'),
        ligne,
        ex([
          '{tab:+1+}{g}Intention{/g} | {g}Formule{/g}',
          '{tab:1>}donner un avis | {c}Je pense que{/c}…',
          '{tab:1>}approuver | {c}Je suis d’accord{/c}.',
          '{tab:1>}désapprouver | {c}Je suis contre{/c}.',
          '{tab:1>}nuancer | {c}Selon moi{/c}, …',
        ]),
      ],
      retenir: [
        p('Une opinion = une formule claire.'),
        p('Puis je donne une raison courte.'),
        ligne,
        table(
          ['Sens', 'Formule'],
          [
            ['avis', 'Je pense que…'],
            ['avis', 'À mon avis…'],
            ['pour', 'Je suis d’accord.'],
            ['pour', 'Je suis pour.'],
            ['contre', 'Je ne suis pas d’accord.'],
            ['contre', 'Je suis contre.'],
          ],
        ),
        ligne,
        p('{c}Attention :{/c} Après je pense que, je conjugue le verbe.'),
        ex([
          { text: 'Je dis : « Je pense que c’{c}est{/c} utile. »', wrong: 'Je pense que c’être utile.' },
        ]),
      ],
    }),
  },
  {
    id: 'k2',
    typeId: 'gram-k2-theorie',
    index: 2,
    title: 'Les connecteurs',
    topic: 'gram-argumenter',
    public: 'A2 / B1',
    objectif: 'Organiser ses idées avec un mot de liaison.',
    blocks: sheet({
      title: 'Les connecteurs',
      intro: 'J’organise mes idées avec des {g}mots de liaison{/g}.',
      regarder: [
        '{tab:1<}{c}Par exemple{/c}, le bus est gratuit. | {c}Donc{/c}, je le prends.',
        '{tab:1<}{c}Par contre{/c}, il est lent. | {c}Si{/c} je suis en retard, je marche.',
        '{tab:1<}{c}D’abord{/c}, j’écoute. | {c}Ensuite{/c}, je réponds.',
      ],
      expliquer: [
        p('Un connecteur a {c}un rôle{/c} : exemple, cause, opposition…'),
        p('Je mets {c}un seul{/c} connecteur par idée.'),
        p('Je le place au début de la phrase, puis une virgule souvent.'),
        ligne,
        ex([
          '{tab:+1+}{g}Rôle{/g} | {g}Mots{/g}',
          '{tab:1>}exemple | par exemple, ainsi',
          '{tab:1>}cause | parce que, car',
          '{tab:1>}conséquence | donc, alors',
          '{tab:1>}opposition | par contre, mais',
          '{tab:1>}condition | si, à condition de',
          '{tab:1>}ordre | d’abord, ensuite, enfin',
          '{tab:1>}reformulation | c’est-à-dire',
        ]),
      ],
      retenir: [
        p('Un connecteur = un rôle.'),
        p('Je ne mets pas trois connecteurs dans la même phrase.'),
        ligne,
        table(
          ['Rôle', 'Connecteur', 'Exemple'],
          [
            ['exemple', 'par exemple', 'Par exemple, le lundi.'],
            ['conséquence', 'donc', 'Donc, je reste.'],
            ['opposition', 'par contre', 'Par contre, c’est loin.'],
            ['condition', 'si', 'Si tu veux, viens.'],
            ['ordre', 'ensuite', 'Ensuite, je pars.'],
          ],
        ),
        ligne,
        p('{c}Attention :{/c} Mais et par contre ne s’empilent pas.'),
        ex([
          { text: 'Je dis : « C’est bien. {c}Par contre{/c}, c’est cher. »', wrong: 'Mais par contre, c’est cher.' },
        ]),
      ],
    }),
  },
]
