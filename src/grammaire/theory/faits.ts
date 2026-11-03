import type { GrammaireTheoryDoc } from '../types'
import { ex, ligne, p, sheet, table } from './falc-sheet'

/** Théorie FALC — thème gram-faits. Français seul (pas de traductions). */
export const faitsDocs: GrammaireTheoryDoc[] = [
  {
    id: 'j6',
    typeId: 'gram-j6-theorie',
    index: 1,
    title: 'La forme passive',
    topic: 'gram-faits',
    public: 'B1',
    objectif: 'Mettre l’objet au début de la phrase.',
    blocks: sheet({
      title: 'La forme passive',
      intro: 'Je mets l’objet {g}au début{/g} de la phrase.',
      regarder: [
        '{tab:1<}Le chat mange la souris. | La souris {c}est mangée{/c} par le chat.',
        '{tab:1<}On a ouvert la porte. | La porte {c}a été ouverte{/c}.',
        '{tab:1<}Les élèves lisent le texte. | Le texte {c}est lu{/c} par les élèves.',
      ],
      expliquer: [
        p('Forme passive = {c}être{/c} + participe passé.'),
        p('L’ancien objet devient le sujet.'),
        p('Le participe s’accorde avec ce nouveau sujet.'),
        p('L’ancien sujet peut rester avec {c}par{/c}. Il peut aussi disparaître.'),
        ligne,
        ex([
          '{tab:+1+}{g}Active{/g} | {g}Passive{/g}',
          '{tab:1>}Nina ferme la porte. | La porte {c}est fermée{/c} par Nina.',
          '{tab:1>}On a volé le vélo. | Le vélo {c}a été volé{/c}.',
        ]),
      ],
      retenir: [
        p('Être + participe (+ par).'),
        p('J’accorde le participe avec le sujet de la phrase passive.'),
        ligne,
        table(
          ['Temps de être', 'Exemple'],
          [
            ['présent', 'La porte est fermée.'],
            ['passé composé', 'La porte a été fermée.'],
            ['imparfait', 'La porte était fermée.'],
            ['futur', 'La porte sera fermée.'],
          ],
        ),
        ligne,
        p('{c}Attention :{/c} Féminin : mangée. Pluriel : mangés ou mangées.'),
        ex([
          { text: 'Je dis : « La pomme est {c}mangée{/c}. »', wrong: 'La pomme est mangé.' },
        ]),
      ],
    }),
  },
  {
    id: 'j7',
    typeId: 'gram-j7-theorie',
    index: 2,
    title: 'Discours direct et indirect',
    topic: 'gram-faits',
    public: 'B1',
    objectif: 'Rapporter des paroles avec ou sans guillemets.',
    blocks: sheet({
      title: 'Discours direct et indirect',
      intro: 'Je rapporte des paroles {g}avec{/g} ou {g}sans{/g} guillemets.',
      regarder: [
        '{tab:1<}Il dit : « Je suis fatigué. » | Il dit {c}qu’{/c}il est fatigué.',
        '{tab:1<}Elle demande : « Tu viens ? » | Elle demande {c}si{/c} je viens.',
        '{tab:1<}Il dit : « Ouvre la porte. » | Il dit {c}d’ouvrir{/c} la porte.',
      ],
      expliquer: [
        p('Direct = les mots exacts, entre guillemets.'),
        p('Indirect = je transforme. Une information → {c}que{/c}.'),
        p('Question oui / non → {c}si{/c}.'),
        p('Question avec un mot → je garde le mot : où, quand, pourquoi.'),
        p('Ordre → {c}de{/c} + infinitif.'),
        ligne,
        ex([
          '{tab:+1+}{g}Direct{/g} | {g}Indirect{/g}',
          '{tab:1>}« Je pars. » | Il dit {c}qu’{/c}il part.',
          '{tab:1>}« Tu viens ? » | Elle demande {c}si{/c} je viens.',
          '{tab:1>}« Où est la gare ? » | Il demande {c}où{/c} est la gare.',
          '{tab:1>}« Assieds-toi. » | Elle dit de {c}s’asseoir{/c}.',
        ]),
      ],
      retenir: [
        p('Indirect = que, si, ou le mot interrogatif.'),
        p('Plus de guillemets. Plus de point d’interrogation souvent.'),
        ligne,
        table(
          ['Type', 'Mot', 'Exemple'],
          [
            ['information', 'que', 'Il dit qu’il vient.'],
            ['oui / non', 'si', 'Elle demande si tu viens.'],
            ['où / quand…', 'le même mot', 'Il demande où tu vas.'],
            ['ordre', 'de + infinitif', 'Il dit de partir.'],
          ],
        ),
        ligne,
        p('{c}Attention :{/c} « Qu’est-ce que » devient « ce que » à l’indirect.'),
        ex([
          { text: 'Je dis : « Il demande {c}ce que{/c} tu veux. »', wrong: 'Il demande qu’est-ce que tu veux.' },
        ]),
      ],
    }),
  },
  {
    id: 'j8',
    typeId: 'gram-j8-theorie',
    index: 3,
    title: 'Le conditionnel (emploi)',
    topic: 'gram-faits',
    public: 'A2 / B1',
    objectif: 'Exprimer un souhait, un conseil ou une hypothèse.',
    blocks: sheet({
      title: 'Le conditionnel',
      intro: 'J’exprime un souhait, un conseil ou une {g}hypothèse{/g}.',
      regarder: [
        '{tab:1<}Je {c}voudrais{/c} un café. | J’{c}aimerais{/c} visiter Sion.',
        '{tab:1<}Tu {c}devrais{/c} te reposer. | Nous {c}pourrions{/c} partir plus tôt.',
        '{tab:1<}Il {c}serait{/c} content. | Elles {c}viendraient{/c} si elles pouvaient.',
      ],
      expliquer: [
        p('Souvent poli : je voudrais, j’aimerais.'),
        p('Conseil : tu devrais, vous pourriez.'),
        p('Le radical est celui du {c}futur{/c}.'),
        p('Les terminaisons sont celles de l’imparfait : ais, ais, ait, ions, iez, aient.'),
        ligne,
        ex([
          '{tab:+1+}{g}Personne{/g} | {g}parler{/g}',
          '{tab:1>}je | parler{c}ais{/c}',
          '{tab:1>}tu | parler{c}ais{/c}',
          '{tab:1>}il / elle | parler{c}ait{/c}',
          '{tab:1>}nous | parler{c}ions{/c}',
          '{tab:1>}vous | parler{c}iez{/c}',
          '{tab:1>}ils / elles | parler{c}aient{/c}',
        ]),
      ],
      retenir: [
        p('Radical du futur + ais, ais, ait, ions, iez, aient.'),
        ligne,
        table(
          ['Emploi', 'Exemple'],
          [
            ['souhait poli', 'Je voudrais un rendez-vous.'],
            ['conseil', 'Tu devrais dormir.'],
            ['hypothèse', 'Il serait content.'],
          ],
        ),
        ligne,
        p('{c}Attention :{/c} Je voudrais, pas « je voudrai » pour une demande polie.'),
        ex([
          { text: 'Je dis : « Je {c}voudrais{/c} un café. »', wrong: 'Je veux un café. (moins poli)' },
        ]),
      ],
    }),
  },
  {
    id: 'j9',
    typeId: 'gram-j9-theorie',
    index: 4,
    title: 'L’hypothèse avec si',
    topic: 'gram-faits',
    public: 'A2 / B1',
    objectif: 'Parler d’une situation imaginée avec si.',
    blocks: sheet({
      title: 'L’hypothèse avec si',
      intro: 'Je parle d’une situation {g}imaginée{/g}.',
      regarder: [
        '{tab:1<}{c}S’il{/c} pleut, je prends le bus. | {c}Si{/c} j’avais le temps, je viendrais.',
        '{tab:1<}{c}Si{/c} tu veux, on sort. | {c}Si{/c} elle était là, elle aiderait.',
        '{tab:1<}{c}Si{/c} nous pouvons, nous irons. | {c}Si{/c} j’étais toi, je demanderais.',
      ],
      expliquer: [
        p('Situation {c}possible{/c} : si + présent → futur ou présent.'),
        p('Situation {c}imaginée{/c} : si + imparfait → conditionnel.'),
        p('Je ne mets pas le conditionnel juste après si.'),
        ligne,
        ex([
          '{tab:+2++}{g}Si{/g} | {g}Autre partie{/g} | {g}Sens{/g}',
          '{tab:2+>}présent | futur | possible',
          '{tab:2+>}imparfait | conditionnel | imaginé',
        ]),
      ],
      retenir: [
        p('Si + présent → futur. Si + imparfait → conditionnel.'),
        ligne,
        table(
          ['Si', 'Résultat', 'Exemple'],
          [
            ['présent', 'futur', 'S’il pleut, je resterai.'],
            ['imparfait', 'conditionnel', 'Si j’avais le temps, je viendrais.'],
          ],
        ),
        ligne,
        p('{c}Attention :{/c} Pas de conditionnel après si.'),
        ex([
          { text: 'Je dis : « Si j’{c}avais{/c} le temps, je viendrais. »', wrong: 'Si j’aurais le temps, je viendrais.' },
        ]),
      ],
    }),
  },
  {
    id: 'j10',
    typeId: 'gram-j10-theorie',
    index: 5,
    title: 'Le conditionnel passé',
    topic: 'gram-faits',
    public: 'B1',
    objectif: 'Parler d’une action qui n’a pas eu lieu.',
    blocks: sheet({
      title: 'Le conditionnel passé',
      intro: 'Je parle d’une action qui {g}n’a pas eu lieu{/g}.',
      regarder: [
        '{tab:1<}J’{c}aurais aimé{/c} venir. | Elle {c}serait partie{/c} plus tôt.',
        '{tab:1<}Tu {c}aurais dû{/c} téléphoner. | Nous {c}aurions pu{/c} aider.',
        '{tab:1<}Si j’avais su, j’{c}aurais prévenu{/c}. | Ils {c}auraient fini{/c} à temps.',
      ],
      expliquer: [
        p('Conditionnel passé = avoir ou être au {c}conditionnel{/c} + participe.'),
        p('Souvent : un regret, un reproche, une hypothèse passée.'),
        p('Avec si : si + plus-que-parfait → conditionnel passé.'),
        p('Même auxiliaire qu’au passé composé.'),
        ligne,
        ex([
          '{tab:+1+}{g}Sens{/g} | {g}Exemple{/g}',
          '{tab:1>}regret | J’{c}aurais aimé{/c} rester.',
          '{tab:1>}reproche | Tu {c}aurais dû{/c} venir.',
          '{tab:1>}hypothèse | Si j’avais su, j’{c}aurais dit{/c} non.',
        ]),
      ],
      retenir: [
        p('J’aurais ou je serais + participe.'),
        ligne,
        table(
          ['Personne', 'avoir', 'être'],
          [
            ['j’', 'aurais fini', 'serais parti(e)'],
            ['tu', 'aurais fini', 'serais parti(e)'],
            ['il / elle', 'aurait fini', 'serait parti(e)'],
            ['nous', 'aurions fini', 'serions parti(e)s'],
            ['vous', 'auriez fini', 'seriez parti(e)(s)'],
            ['ils / elles', 'auraient fini', 'seraient parti(e)s'],
          ],
        ),
        ligne,
        p('{c}Attention :{/c} Avec être, j’accorde le participe.'),
        ex([
          { text: 'Je dis : « Elle {c}serait partie{/c}. »', wrong: 'Elle serait parti.' },
        ]),
      ],
    }),
  },
]
