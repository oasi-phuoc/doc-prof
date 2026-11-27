/** Reformulations du texte source. Les recettes historiques gardent leur version. */
export const falcRevisions: Readonly<Record<string, Readonly<Record<string, string>> | undefined>> = {
  b1: {
    'J’utilise {c}vous{/c} pour parler {c}poliment{/c} à une personne que {c}je ne connais pas bien{/c} ou à {c}plusieurs personnes{/c}.':
      'Dis {c}vous{/c} pour parler à plusieurs personnes./nDis aussi {c}vous{/c} à une personne que tu vouvoies./nC’est souvent le cas avec une personne que tu connais peu.',
  },
  e3: {
    '{c}Pendant{/c} = la durée est finie, ou totale.':
      '{c}Pendant{/c} indique combien de temps dure une action./nExemple au futur. Je travaillerai pendant deux heures.',
    '{tab:1>}pendant | durée finie': '{tab:1>}pendant | durée de l’action',
    'durée finie': 'durée de l’action',
  },
  f6: {
    'Il s’accorde avec le nom possédé, pas avec le possesseur.':
      'Regarde le nom qui suit. « Sac » est masculin. « Clé » est féminin.',
    'Devant une voyelle, ma, ta et sa deviennent {c}mon{/c}, {c}ton{/c}, {c}son{/c}.':
      'Devant une voyelle ou un h muet, « ma », « ta » et « sa » changent./nOn dit {c}mon{/c} amie, {c}ton{/c} école ou {c}son{/c} histoire.',
    '{c}Attention :{/c} Ma → mon devant une voyelle.':
      '{c}Attention :{/c} On dit « mon amie » et « mon histoire ».',
  },
  f7: {
    'Devant une voyelle, beau devient {c}bel{/c} : un bel homme.':
      'Au masculin singulier, écris {c}bel{/c} devant une voyelle ou un h muet./nExemples. Un bel arbre. Un bel homme.',
    '{c}Attention :{/c} Beau → bel devant une voyelle masculine.':
      '{c}Attention :{/c} Compare « un beau jardin » et « un bel arbre ».',
  },
  f8: {
    'Si j’ajoute un adjectif, j’utilise {c}c’est{/c} + un ou une.':
      'Pour décrire le métier, tu peux dire {c}c’est{/c} et ajouter « un » ou « une »./nTu peux ensuite préciser avec un adjectif.',
    '{c}Attention :{/c} Pas d’article après je suis.':
      '{c}Attention :{/c} Pour donner ton métier en un mot, dis « Je suis médecin ».',
  },
  h3: {
    'Souvent : verbes de mouvement ou d’état.':
      'Apprends la liste des verbes qui se construisent avec « être »./nCertains verbes de cette liste peuvent aussi prendre « avoir ».',
    'Les verbes pronominaux utilisent aussi être.':
      'Les verbes avec « se » utilisent aussi « être »./nIls ont des règles d’accord particulières. Voir « Les verbes pronominaux au passé composé ».',
    'Être + participe accordé avec le sujet.':
      'Dans « elle est partie », « partie » s’accorde avec « elle ».',
    '{c}Attention :{/c} J’accorde toujours avec le sujet.':
      '{c}Attention :{/c} Pour les verbes comme « partir », accorde le participe avec le sujet.',
  },
  h6: {
    'Avec {c}être{/c} : le sujet se déplace. Il n’y a pas d’objet.':
      'Avec {c}être{/c}, ces verbes expriment ici un déplacement du sujet./nExemple. Elle est montée à l’étage.',
    'Avec {c}avoir{/c} : le sujet déplace quelque chose. Il y a un objet.':
      'Avec {c}avoir{/c}, le verbe a ici un complément d’objet direct./nExemple. Nous avons passé un examen. Nous avons passé quoi ? Un examen.',
    '{tab:+1+}{g}Sens{/g} | {g}Auxiliaire{/g}': '{tab:+1+}{g}Construction{/g} | {g}Auxiliaire{/g}',
    '{tab:1>}le sujet bouge | {c}être{/c}': '{tab:1>}déplacement du sujet | {c}être{/c}',
    '{tab:1>}le sujet déplace un objet | {c}avoir{/c}': '{tab:1>}complément d’objet direct | {c}avoir{/c}',
    'Objet après le verbe → souvent avoir.':
      'Repère le complément d’objet direct pour choisir « avoir » avec ces verbes.',
  },
  h9: {
    'Avec {c}être{/c} : le participe s’accorde avec le sujet.':
      'Avec {c}être{/c}, « arrivée » s’accorde avec « elle »./nPour les verbes avec « se », vois la fiche « Les verbes pronominaux au passé composé ».',
    'Avec avoir : accord avec le {c}COD placé avant{/c} le verbe.':
      'COD veut dire « complément d’objet direct »./nAvec « avoir », cherche le {c}COD placé avant{/c} le verbe pour faire l’accord.',
    'Être → sujet. Avoir → COD avant, sinon pas d’accord.':
      'Avec « être », regarde ici le sujet./nAvec « avoir », accorde le participe si le COD est placé avant.',
  },
  i4: {
    'Le pronom COD se place {c}avant{/c} le verbe.':
      'Dans « je le prends », le pronom vient {c}avant{/c} le verbe.',
    '{c}Attention :{/c} Le pronom est avant le verbe, pas après.':
      '{c}Attention :{/c} Dans une consigne à l’impératif affirmatif, le pronom vient après./nExemple. « Prends-le. »',
  },
  i5: {
    'Le COI remplace {c}à{/c} + une personne.':
      'Le COI est le complément d’objet indirect./nDans les exemples, « lui » ou « leur » remplace {c}à{/c} et le nom de la personne.',
  },
  i7: {
    'En et y se placent {c}avant{/c} le verbe.':
      'Dans les exemples de la fiche, « en » et « y » viennent {c}avant{/c} le verbe.',
    '{c}Attention :{/c} En et y sont avant le verbe.':
      '{c}Attention :{/c} Dans « j’en prends », « en » vient avant « prends »./nDans une consigne à l’impératif affirmatif, dis par exemple « prends-en ».',
  },
  o1: {
    'Futur simple = plus loin, plus écrit, ou une promesse.':
      'Le futur simple sert à annoncer un événement ou à faire une promesse./nIl est fréquent à l’écrit. Il peut aussi parler d’un avenir très proche.',
    'Bientôt → souvent futur proche.': 'Le futur proche est fréquent quand un événement est prévu.',
    'Plus tard ou à l’écrit → futur simple.': 'Les deux futurs peuvent parler de demain ou de l’année prochaine.',
    '{tab:1>}dans cinq minutes | futur {c}proche{/c}': '{tab:1>}je vais partir dans cinq minutes | futur {c}proche{/c}',
    '{tab:1>}l’année prochaine | futur {c}simple{/c}': '{tab:1>}je partirai l’année prochaine | futur {c}simple{/c}',
  },
  j9: {
    'Si + présent → futur. Si + imparfait → conditionnel.':
      'Dans une condition possible, pense à « si » suivi du présent./nDans une condition imaginée, pense ici à « si » suivi de l’imparfait.',
    '{tab:2+>}présent | futur | possible': '{tab:2+>}présent | présent ou futur | possible',
    '{c}Attention :{/c} Pas de conditionnel après si.':
      '{c}Attention :{/c} Quand « si » introduit une condition comme ici, écris « si j’avais ».',
  },
  k7: {
    '{c}Même si{/c} + indicatif. Le fait est réel.':
      'Après {c}même si{/c}, utilise l’indicatif./nL’obstacle peut être réel ou possible.',
  },
  k9: {
    'Me et te deviennent moi et toi après le verbe, à l’impératif.':
      'Après l’impératif, tu peux lire « moi » ou « toi »./nDevant « en » ou « y », tu peux lire « m’ » ou « t’ ». Exemple. « Donne-m’en. »',
    'Avant le verbe : me / te + le / la / les + lui / leur + y + en.':
      'Les colonnes donnent l’ordre. Choisis seulement les pronoms dont tu as besoin.',
  },
  k12: {
    'L’action est {c}avant{/c} le moment de la phrase.':
      'L’action est déjà faite au moment dont on parle./nCe moment peut aussi être futur. Exemple. Il faut que tu aies fini avant 18 h.',
  },
  k13: {
    'Indicatif = fait {c}certain{/c}, connaissance, déclaration.':
      'Utilise souvent l’indicatif pour dire ce que tu sais, annonces ou penses.',
    'Certain → indicatif. Doute ou souhait → subjonctif.':
      'Apprends le mode avec les expressions du tableau./n« Je pense que » prend l’indicatif. « Je doute que » prend le subjonctif.',
  },
}
