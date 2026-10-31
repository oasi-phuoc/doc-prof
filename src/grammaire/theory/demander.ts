import type { GrammaireTheoryDoc } from '../types'
import { ex, ligne, p, sheet, table } from './falc-sheet'

/** Théorie FALC — thème gram-demander. Français seul (pas de traductions). */
export const demanderDocs: GrammaireTheoryDoc[] = [
  {
    id: 'f1',
    typeId: 'gram-f1-theorie',
    index: 1,
    title: 'Les déterminants démonstratifs',
    topic: 'gram-demander',
    public: 'A1',
    objectif: 'Montrer une chose avec ce, cet, cette ou ces.',
    blocks: sheet({
      title: 'Les déterminants démonstratifs',
      intro: 'Je montre une chose avec {g}ce{/g}, {g}cet{/g}, {g}cette{/g} ou {g}ces{/g}.',
      regarder: [
        '{tab:1<}{c}Ce{/c} bus est en retard. | {c}Cet{/c} homme est médecin.',
        '{tab:1<}{c}Cette{/c} rue est longue. | {c}Ces{/c} documents sont pour vous.',
        '{tab:1<}{c}Cet{/c} hôtel est complet. | {c}Ces{/c} chaises sont libres.',
      ],
      expliquer: [
        p('Le déterminant se place {c}devant{/c} le nom.'),
        p('Je choisis selon le genre et le nombre du nom.'),
        p('Devant une voyelle ou un h, le masculin singulier devient {c}cet{/c}.'),
        ligne,
        ex([
          '{tab:+2++}{g}Nom{/g} | {g}Forme{/g} | {g}Exemple{/g}',
          '{tab:2+>}Masculin + consonne | {c}ce{/c} | {c}ce{/c} livre',
          '{tab:2+>}Masculin + voyelle | {c}cet{/c} | {c}cet{/c} ami',
          '{tab:2+>}Féminin | {c}cette{/c} | {c}cette{/c} adresse',
          '{tab:2+>}Pluriel | {c}ces{/c} | {c}ces{/c} papiers',
        ]),
      ],
      retenir: [
        p('Ce, cet, cette, ces = je montre ce nom.'),
        ligne,
        table(
          ['Cas', 'Forme', 'Exemple'],
          [
            ['masculin + consonne', 'ce', 'ce stylo'],
            ['masculin + voyelle / h', 'cet', 'cet hôtel'],
            ['féminin', 'cette', 'cette carte'],
            ['pluriel', 'ces', 'ces clés'],
          ],
        ),
        ligne,
        p('{c}Attention :{/c} Cet devant une voyelle. Pas « ce ami ».'),
        ex([
          { text: 'Je dis : « {c}Cet{/c} ami. »', wrong: 'Ce ami.' },
        ]),
      ],
    }),
  },
  {
    id: 'f2',
    typeId: 'gram-f2-theorie',
    index: 2,
    title: 'Pouvoir, devoir, vouloir',
    topic: 'gram-demander',
    public: 'A1',
    objectif: 'Dire ce que je peux, dois ou veux.',
    blocks: sheet({
      title: 'Pouvoir, devoir, vouloir',
      intro: 'Je dis ce que je {g}peux{/g}, {g}dois{/g} ou {g}veux{/g}.',
      regarder: [
        '{tab:1<}Je {c}peux{/c} vous aider. | Tu {c}dois{/c} signer ici.',
        '{tab:1<}Elle {c}veut{/c} un café. | Nous {c}pouvons{/c} payer par carte.',
        '{tab:1<}Vous {c}devez{/c} attendre. | Ils {c}veulent{/c} partir.',
      ],
      expliquer: [
        p('{c}Pouvoir{/c} = capacité ou permission.'),
        p('{c}Devoir{/c} = obligation.'),
        p('{c}Vouloir{/c} = volonté ou souhait.'),
        p('Le verbe suivant reste à l’{c}infinitif{/c}.'),
        ligne,
        ex([
          '{tab:+2++}{g}Verbe{/g} | {g}Sens{/g} | {g}Exemple{/g}',
          '{tab:2+>}pouvoir | je peux | Je {c}peux{/c} venir.',
          '{tab:2+>}devoir | je dois | Je {c}dois{/c} partir.',
          '{tab:2+>}vouloir | je veux | Je {c}veux{/c} manger.',
        ]),
      ],
      retenir: [
        p('Pouvoir, devoir ou vouloir + infinitif.'),
        p('Je conjugue seulement le premier verbe.'),
        ligne,
        table(
          ['Personne', 'pouvoir', 'devoir', 'vouloir'],
          [
            ['je', 'peux', 'dois', 'veux'],
            ['tu', 'peux', 'dois', 'veux'],
            ['il / elle', 'peut', 'doit', 'veut'],
            ['nous', 'pouvons', 'devons', 'voulons'],
            ['vous', 'pouvez', 'devez', 'voulez'],
            ['ils / elles', 'peuvent', 'doivent', 'veulent'],
          ],
        ),
        ligne,
        p('{c}Attention :{/c} Le deuxième verbe ne change pas.'),
        ex([
          { text: 'Je dis : « Je veux {c}partir{/c}. »', wrong: 'Je veux pars.' },
        ]),
      ],
    }),
  },
  {
    id: 'f3',
    typeId: 'gram-f3-theorie',
    index: 3,
    title: 'Accepter et refuser',
    topic: 'gram-demander',
    public: 'A1',
    objectif: 'Répondre oui ou non à une proposition.',
    blocks: sheet({
      title: 'Accepter et refuser',
      intro: 'Je réponds {g}oui{/g} ou {g}non{/g} à une proposition.',
      regarder: [
        '{tab:1<}Tu viens ? — {c}Oui{/c}, d’accord. | — {c}Avec plaisir{/c}.',
        '{tab:1<}Un café ? — {c}Volontiers{/c}. | — {c}Non merci{/c}.',
        '{tab:1<}— {c}Désolé{/c}, je ne peux pas. | — {c}Je suis occupé{/c}.',
      ],
      expliquer: [
        p('Pour accepter : oui, d’accord, avec plaisir, volontiers.'),
        p('Pour refuser : non merci, désolé, je ne peux pas.'),
        p('Un refus reste {c}poli{/c}. Je donne une raison courte.'),
        ligne,
        ex([
          '{tab:+1+}{g}Réponse{/g} | {g}Je dis{/g}',
          '{tab:1>}accepter | {c}Oui, d’accord.{/c}',
          '{tab:1>}accepter avec plaisir | {c}Avec plaisir.{/c}',
          '{tab:1>}refuser poliment | {c}Non merci.{/c}',
          '{tab:1>}refuser + raison | {c}Désolé, je travaille.{/c}',
        ]),
      ],
      retenir: [
        p('Oui clair, ou non poli avec une raison.'),
        ligne,
        table(
          ['Sens', 'Formule'],
          [
            ['accepter', 'Oui.'],
            ['accepter', 'D’accord.'],
            ['accepter', 'Avec plaisir. / Volontiers.'],
            ['refuser', 'Non merci.'],
            ['refuser', 'Désolé, je ne peux pas.'],
          ],
        ),
        ligne,
        p('{c}Attention :{/c} « Non » seul peut sembler brusque. J’ajoute merci ou désolé.'),
        ex([
          { text: 'Je dis : « {c}Non merci{/c}, je n’ai pas faim. »', wrong: 'Non.' },
        ]),
      ],
    }),
  },
]
