import type { GrammaireTheoryDoc } from '../types'
import { ex, ligne, p, sheet, table } from './falc-sheet'

/** Théorie FALC — thème gram-activite. Français seul (pas de traductions). */
export const activiteDocs: GrammaireTheoryDoc[] = [
  {
    id: 'd1',
    typeId: 'gram-d1-theorie',
    index: 1,
    title: 'Faire une activité',
    topic: 'gram-activite',
    public: 'A1',
    objectif: 'Parler d’une activité avec faire + du / de la / de l’.',
    blocks: sheet({
      title: 'Faire une activité',
      intro: 'Je parle d’une activité avec {g}faire{/g}.',
      regarder: [
        '{tab:1<}Je fais {c}du{/c} sport. | Elle fait {c}de la{/c} natation.',
        '{tab:1<}Il fait {c}de l’{/c}anglais. | Nous faisons {c}du{/c} piano.',
        '{tab:1<}Tu fais {c}de la{/c} cuisine ? | Ils font {c}du{/c} vélo.',
      ],
      expliquer: [
        p('J’utilise {c}faire{/c} au présent + un article.'),
        p('Masculin : {c}du{/c}. Féminin : {c}de la{/c}. Voyelle : {c}de l’{/c}.'),
        p('Je ne mets pas le ou la devant le sport ou l’instrument.'),
        ligne,
        ex([
          '{tab:+2++}{g}Nom{/g} | {g}Article{/g} | {g}Exemple{/g}',
          '{tab:2+>}Masculin | {c}du{/c} | du sport',
          '{tab:2+>}Féminin | {c}de la{/c} | de la natation',
          '{tab:2+>}Voyelle | {c}de l’{/c} | de l’anglais',
        ]),
        ligne,
        p('Faire change avec la personne : fais, fais, fait, faisons, faites, font.'),
      ],
      retenir: [
        p('Activité = faire + du, de la ou de l’.'),
        ligne,
        table(
          ['Personne', 'Faire', 'Exemple'],
          [
            ['je', 'fais', 'Je fais du vélo.'],
            ['tu', 'fais', 'Tu fais de la musique.'],
            ['il / elle', 'fait', 'Il fait du sport.'],
            ['nous', 'faisons', 'Nous faisons de l’anglais.'],
            ['vous', 'faites', 'Vous faites de la cuisine.'],
            ['ils / elles', 'font', 'Ils font du piano.'],
          ],
        ),
        ligne,
        p('{c}Attention :{/c} Vous faites, pas « vous faisez ».'),
        ex([
          { text: 'Je dis : « Je fais {c}du{/c} sport. »', wrong: 'Je fais le sport.' },
        ]),
      ],
    }),
  },
  {
    id: 'd2',
    typeId: 'gram-d2-theorie',
    index: 2,
    title: 'Les verbes pronominaux',
    topic: 'gram-activite',
    public: 'A1',
    objectif: 'Parler d’une action sur soi avec un pronom réfléchi.',
    blocks: sheet({
      title: 'Les verbes pronominaux',
      intro: 'J’utilise un pronom pour une action {g}sur moi{/g}.',
      regarder: [
        '{tab:1<}Je {c}me{/c} lève à 7 h. | Tu {c}te{/c} laves.',
        '{tab:1<}Il {c}se{/c} repose. | Nous {c}nous{/c} promenons.',
        '{tab:1<}Vous {c}vous{/c} habillez. | Elles {c}se{/c} couchent.',
      ],
      expliquer: [
        p('Un verbe pronominal a deux pronoms : le sujet et me, te, se…'),
        p('Le pronom réfléchi se place {c}devant{/c} le verbe.'),
        p('Devant une voyelle : me → {c}m’{/c}, te → {c}t’{/c}, se → {c}s’{/c}.'),
        p('À la négation : ne + pronom + verbe + pas.'),
        ligne,
        ex([
          '{tab:+1+}{g}Personne{/g} | {g}Se lever{/g}',
          '{tab:1>}je | je {c}me{/c} lève',
          '{tab:1>}tu | tu {c}te{/c} lèves',
          '{tab:1>}il / elle | il {c}se{/c} lève',
          '{tab:1>}nous | nous {c}nous{/c} levons',
          '{tab:1>}vous | vous {c}vous{/c} levez',
          '{tab:1>}ils / elles | ils {c}se{/c} lèvent',
        ]),
      ],
      retenir: [
        p('Je me, tu te, il se, nous nous, vous vous, ils se.'),
        ligne,
        table(
          ['Personne', 'Pronom', 'Exemple'],
          [
            ['je', 'me / m’', 'je me lave'],
            ['tu', 'te / t’', 'tu t’habilles'],
            ['il / elle', 'se / s’', 'elle se repose'],
            ['nous', 'nous', 'nous nous levons'],
            ['vous', 'vous', 'vous vous couchez'],
            ['ils / elles', 'se / s’', 'ils s’appellent'],
          ],
        ),
        ligne,
        p('{c}Attention :{/c} Le pronom reste devant le verbe, même à la négation.'),
        ex([
          { text: 'Je dis : « Je {c}ne me{/c} lève pas. »', wrong: 'Je ne lève pas me.' },
        ]),
      ],
    }),
  },
  {
    id: 'd3',
    typeId: 'gram-d3-theorie',
    index: 3,
    title: 'Les pronoms toniques',
    topic: 'gram-activite',
    public: 'A1 / A2',
    objectif: 'Utiliser moi, toi, lui après une préposition ou pour insister.',
    blocks: sheet({
      title: 'Les pronoms toniques',
      intro: 'J’utilise {g}moi, toi, lui{/g} pour insister ou après une préposition.',
      regarder: [
        '{tab:1<}Tu viens avec {c}moi{/c} ? | Je parle de {c}toi{/c}.',
        '{tab:1<}{c}Moi{/c}, je reste. | C’est pour {c}eux{/c}.',
        '{tab:1<}Elle habite chez {c}lui{/c}. | — Et {c}toi{/c} ?',
      ],
      expliquer: [
        p('Après une préposition, j’utilise le pronom {c}tonique{/c}.'),
        p('Je l’utilise aussi pour insister : Moi, je…'),
        p('Sans verbe, je réponds avec le pronom seul : — Moi !'),
        p('Phrase positive : moi {c}aussi{/c}. Phrase négative : moi {c}non plus{/c}.'),
        ligne,
        ex([
          '{tab:+1+}{g}Sujet{/g} | {g}Pronom tonique{/g}',
          '{tab:1>}je | {c}moi{/c}',
          '{tab:1>}tu | {c}toi{/c}',
          '{tab:1>}il | {c}lui{/c}',
          '{tab:1>}elle | {c}elle{/c}',
          '{tab:1>}nous | {c}nous{/c}',
          '{tab:1>}vous | {c}vous{/c}',
          '{tab:1>}ils | {c}eux{/c}',
          '{tab:1>}elles | {c}elles{/c}',
        ]),
      ],
      retenir: [
        p('Après avec, pour, chez, de : pronom tonique.'),
        ligne,
        table(
          ['Usage', 'Exemple'],
          [
            ['après préposition', 'avec moi'],
            ['insister', 'Moi, je viens.'],
            ['réponse seule', '— Moi !'],
            ['accord positif', 'Moi aussi.'],
            ['accord négatif', 'Moi non plus.'],
          ],
        ),
        ligne,
        p('{c}Attention :{/c} Après une préposition, je ne dis pas « avec je ».'),
        ex([
          { text: 'Je dis : « avec {c}moi{/c}. »', wrong: 'avec je.' },
          { text: 'Je dis : « {c}Moi non plus{/c}. »', wrong: 'Moi aussi. (après une phrase négative)' },
        ]),
      ],
    }),
  },
]
