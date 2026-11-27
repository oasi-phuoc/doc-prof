import type { GrammarTheoryBlock } from '@/francais/grammar-theory'

type Table = Extract<GrammarTheoryBlock, { kind: 'table' }>

const table = (headers: string[], rows: string[][]): Table =>
  ({ kind: 'table', headers, rows, colHeader: true, rowHeader: false })

/** Repères à lire de gauche à droite quand la différence est dans la phrase. */
export const falcDiagrams: Readonly<Record<string, Table | undefined>> = {
  m4: table(['Sujet', 'Même début', 'Fin du verbe', 'Phrase'], [
    ['{sujet}Je{/sujet}', 'parl-', '{fin}-e{/fin}', 'Je parl{fin}e{/fin} français.'],
    ['{sujet}Nous{/sujet}', 'parl-', '{fin}-ons{/fin}', 'Nous parl{fin}ons{/fin} français.'],
  ]),
  m5: table(['Une personne', 'Plusieurs personnes avec « nous »'], [
    ['Je mange à midi.', 'Nous mang{c}e{/c}ons à midi.'],
    ['Je commence le cours.', 'Nous commen{c}ç{/c}ons le cours.'],
  ]),
  m6: table(['Infinitif', 'Avec je', 'Avec nous'], [
    ['Finir', 'Je finis à midi.', 'Nous fin{c}issons{/c} à midi.'],
    ['Partir', 'Je pars à midi.', 'Nous {c}partons{/c} à midi.'],
  ]),
  m7: table(['Infinitif', 'Avec je', 'Avec nous'], [
    ['Prendre', 'Je {c}prends{/c} le bus.', 'Nous {c}prenons{/c} le bus.'],
    ['Voir', 'Je {c}vois{/c} le bus.', 'Nous {c}voyons{/c} le bus.'],
  ]),
  h2: table(['Personne', 'Forme d’avoir', 'Participe passé'], [
    ['Hier, Nadia', '{verbe}a{/verbe}', 'rangé la salle.'],
    ['Hier, nous', '{verbe}avons{/verbe}', 'rangé la salle.'],
  ]),
  h9: table(['La phrase', 'La place du complément'], [
    ['Elle a mangé {g}une pomme{/g}.', 'Après le verbe. J’écris « mangé ».'],
    ['La pomme {g}qu’{/g}elle a mangé{fin}e{/fin} était bonne.', 'Avant le verbe. J’écris « mangée ».'],
  ]),
  i1: table(['Deux informations', 'Une phrase avec « qui »'], [
    ['Je connais une femme. {g}Cette femme{/g} travaille à la poste.', 'Je connais une femme {c}qui{/c} travaille à la poste.'],
    ['Je vois un bus. {g}Ce bus{/g} part à midi.', 'Je vois un bus {c}qui{/c} part à midi.'],
  ]),
  i6: table(['De quoi est-ce que je parle ?', 'La phrase'], [
    ['Une personne dont je ne donne pas le nom', '{c}Quelqu’un{/c} a sonné.'],
    ['Une chose que je ne nomme pas', 'Je cherche {c}quelque chose{/c}.'],
  ]),
  i8: table(['Les mots avec « de »', 'Les deux idées dans une phrase'], [
    ['Voici le livre. Je t’ai parlé {g}de ce livre{/g}.', 'Voici le livre {c}dont{/c} je t’ai parlé.'],
    ['Voici mon outil. J’ai besoin {g}de cet outil{/g}.', 'Voici l’outil {c}dont{/c} j’ai besoin.'],
  ]),
  i9: table(['Le groupe entier', 'Je garde le premier mot'], [
    ['Je travaille {g}dans cette salle{/g}.', 'C’est la salle {c}dans laquelle{/c} je travaille.'],
    ['Je compte {g}sur ces amis{/g}.', 'Ce sont les amis {c}sur lesquels{/c} je compte.'],
  ]),
  j5: table(['Sujet', 'Infinitif', 'Fin', 'Demain'], [
    ['Je', 'arriver', '{fin}-ai{/fin}', 'J’arriver{fin}ai{/fin} tôt.'],
    ['Nous', 'arriver', '{fin}-ons{/fin}', 'Nous arriver{fin}ons{/fin} tôt.'],
  ]),
  o1: table(['Deux formes pour dire ce qui arrivera', 'Comment je construis la phrase'], [
    ['Je {c}vais appeler{/c} Paul ce soir.', 'Une forme de « aller » + « appeler ».'],
    ['J’{c}appellerai{/c} Paul ce soir.', 'Une forme du verbe « appeler » au futur simple.'],
  ]),
  j8: table(['Ce que je veux faire', 'Ce que je peux dire'], [
    ['Demander poliment de l’eau', 'Je {c}voudrais{/c} un verre d’eau, s’il vous plaît.'],
    ['Proposer une solution', 'Tu {c}pourrais{/c} remplir ta gourde ici.'],
  ]),
  j9: table(['La condition que j’imagine', 'Le résultat que j’imagine'], [
    ['Si j’{c}avais{/c} un vélo…', '… je {c}viendrais{/c} à vélo.'],
    ['Si j’{c}étais{/c} libre…', '… je {c}viendrais{/c} avec toi.'],
  ]),
  k2: table(['Ce qui arrive', 'Le lien avec l’idée suivante'], [
    ['Le bus est en retard.', '{c}Donc{/c}, j’appelle mon employeur. /nJe réagis au retard.'],
    ['Le bus est en retard.', '{c}Pourtant{/c}, j’arrive à l’heure. /nLe résultat surprend.'],
  ]),
  k8: table(['La phrase', 'Le mot à repérer'], [
    ['{c}Ce qui{/c} m’aide, c’est la carte.', '« Ce qui » est le sujet de « aide ».'],
    ['{c}Ce que{/c} je cherche, c’est la gare.', 'Je cherche quoi ? La gare.'],
    ['{c}Ce dont{/c} j’ai besoin, c’est un plan.', 'J’ai besoin {g}de{/g} quoi ? D’un plan.'],
  ]),
  k9: table(['Quel groupe je remplace ?', 'Quel pronom je choisis ?'], [
    ['Je donne {g}le livre{/g} à Lina.', '{c}le{/c}'],
    ['Je donne le livre {g}à Lina{/g}.', '{c}lui{/c}'],
    ['Je remplace les deux groupes.', 'Je {c}le lui{/c} donne.'],
  ]),
  k10: table(['Ce que je veux exprimer', 'La phrase avec « que »'], [
    ['Une obligation', 'Il faut que tu {c}viennes{/c} demain.'],
    ['Un sentiment', 'Je suis contente que tu {c}viennes{/c} demain.'],
  ]),
  k11: table(['Ce que je fais', 'Les mots qui vont ensemble'], [
    ['Je débute la préparation.', 'Je commence {c}à{/c} préparer le repas.'],
    ['Je cesse la préparation.', 'J’arrête {c}de{/c} préparer le repas.'],
  ]),
  k12: table(['Ce qui est déjà fait', 'Ce que je dis à ce sujet'], [
    ['Tu as envoyé le message.', 'Je suis contente que tu {c}aies envoyé{/c} le message.'],
    ['Les collègues sont arrivées.', 'Je suis contente qu’elles {c}soient arrivées{/c}.'],
  ]),
  k13: table(['Je parle de la venue de Lina', 'La forme que je choisis'], [
    ['Je crois que Lina {c}viendra{/c}.', 'Je donne mon avis. « Viendra » est à l’indicatif.'],
    ['Je doute que Lina {c}vienne{/c}.', 'Je dis que je doute. « Vienne » est au subjonctif.'],
  ]),
}
