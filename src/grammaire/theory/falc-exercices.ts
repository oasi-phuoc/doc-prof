import type { GrammarTheoryBlock } from '@/francais/grammar-theory'

type Practice = Extract<GrammarTheoryBlock, { kind: 'practice' }>

function fill(prompt: string, answer: string, alternative: string, explanation: string): Practice {
  const [first, second] = [answer, alternative].sort((a, b) => a.localeCompare(b, 'fr'))
  return {
    kind: 'practice',
    instruction: `Complète avec « ${first} » ou « ${second} ».`,
    items: [{ prompt, answer, explanation }],
  }
}

/** Une phrase à compléter dans une situation différente de l’exemple de la fiche. */
export const falcPractices: Readonly<Record<string, Practice | undefined>> = {
  m4: fill('Je parle italien. Nous ___ italien aussi.', 'parlons', 'parlez', 'Avec « nous », le verbe « parler » finit par « -ons ». '),
  m5: fill('À midi, nous ___ à la cantine.', 'mangeons', 'mangons', 'Garde le « e » de « mangeons » pour faire le même son que dans « mange ». '),
  m6: fill('Le cours finit à midi. Nous ___ aussi à midi.', 'finissons', 'finons', 'Avec « nous », « finir » donne « finissons ». '),
  m7: fill('Tous les matins, je prends le bus. Le lundi, nous ___ le train.', 'prenons', 'prendons', '« Prendre » a une forme particulière avec « nous ». '),
  modaux: fill('Le panneau dit « casque obligatoire ». Je ___ mettre un casque.', 'dois', 'veux', '« Dois » indique une obligation.'),
  pronominaux: fill('Le matin, tu ___ prépares avant de sortir.', 'te', 'me', 'Pour dire « tu te prépares », le pronom « te » va avec « tu ». '),
  a9: fill('Je veux dire que j’ai arrêté le café. Avant, j’en buvais. Maintenant, je n’en bois ___.', 'plus', 'jamais', '« Ne… plus » montre ici que la situation a changé.'),

  c3: fill('Il y a plusieurs salles. ___ salles sont libres ?', 'Quelles', 'Quels', '« Salles » est féminin et pluriel.'),
  c4: fill('Cette phrase montre ma surprise. « Comme la salle est grande ___ »', '!', '?', 'Le point d’exclamation marque ici la surprise.'),
  d1: fill('Pendant les vacances, je fais ___escalade.', 'de l’', 'de la', '« Escalade » commence par une voyelle. On écrit « de l’escalade ». '),
  d2: fill('Mina prend une douche. Elle ___ lave.', 'se', 'te', 'Mina lave son propre corps. « Se » va avec « elle ». '),
  d3: fill('J’invite mon ami. « Tu viens avec ___ ? »', 'moi', 'je', 'Après « avec », on dit « moi » pour parler de soi.'),
  e6: fill('L’arrêt est de l’autre côté de l’entrée, au dos de l’école. Il est ___ l’école.', 'derrière', 'devant', 'L’arrêt se trouve du côté opposé à l’entrée.'),
  e7: fill('Je donne ma destination. Je vais ___ musée.', 'au', 'du', '« Au » réunit « à » et « le ». Il indique ici où tu vas.'),
  e4: fill('Je prends le vélo trois fois par semaine. Je prends ___ le vélo.', 'souvent', 'jamais', 'Trois fois par semaine indique ici une habitude fréquente.'),
  e5: fill('D’abord, prends ton ticket. ___, attends l’appel de ton numéro.', 'Ensuite', 'D’abord', '« Ensuite » introduit l’action qui suit.'),

  f2: fill('Je demande à l’employée si elle peut répéter. « ___-vous répéter, s’il vous plaît ? »', 'Pouvez', 'Voulez', '« Pouvez-vous… ? » permet de demander un service poliment.'),
  f3: fill('Je suis libre et j’accepte l’invitation. « ___, je viens volontiers. »', 'Oui', 'Non', '« Oui » indique que tu acceptes.'),
  f5: fill('J’entre dans la salle et je vois trois personnes. ___ trois personnes dans la salle.', 'Il y a', 'Il est', '« Il y a » indique une présence.'),
  f6: fill('La clé est à moi. Je dis « Voici ___ clé. »', 'ma', 'mon', '« Clé » est féminin. On dit « ma clé ». '),
  f7: fill('La vendeuse me montre deux grandes valises. Elles sont ___.', 'lourdes', 'lourd', 'L’adjectif s’accorde avec « valises », féminin pluriel.'),
  f8: fill('Inès soigne des patients. Elle est ___.', 'infirmière', 'infirmier', '« Infirmière » est la forme féminine. Ici, on écrit « elle est infirmière ».'),
  f9: fill('Le sac vert pèse 3 kg. Le sac bleu pèse 1 kg. Le vert est ___ lourd que le bleu.', 'plus', 'moins', '3 kg est un poids plus élevé que 1 kg.'),
  f12: fill('Je décris la taille du logement. « Nous habitons dans ___. »', 'un petit appartement', 'un appartement petit', '« Petit » se place généralement avant le nom.'),
  f13: fill('Les billets coûtent 8, 10 et 15 francs. Celui à 8 francs est ___ cher des trois.', 'le moins', 'le plus', '8 francs est le prix le plus bas du groupe.'),
  f14: fill('J’ai cinq livres. Yanis en a deux. J’ai ___ livres que Yanis.', 'plus de', 'plus', '« Livres » est un nom. Pour comparer la quantité, on dit « plus de livres ». '),
  'description-physique': fill('Je décris la forme des cheveux d’Ana. Elle a les cheveux ___.', 'bouclés', 'marron', '« Bouclés » décrit la forme. « Marron » indique une couleur.'),
  f10: fill('Une amie est fatiguée. Je lui donne un conseil. « Tu ___ te reposer. »', 'devrais', 'dois bien', '« Tu devrais » est une façon douce de conseiller.'),
  f11: fill('Je donne une consigne à mon ami. « ___ la fenêtre, s’il te plaît. »', 'Ferme', 'Fermes', 'À l’impératif, « fermer » donne « ferme » pour une personne que tu tutoies.'),

  g1: fill('N’importe quel fruit convient. Je demande au vendeur « Donnez-moi ___ pomme. »', 'une', 'la', '« Une » convient ici pour une pomme qui n’a pas encore été choisie.'),
  g2: fill('Montre la tasse bleue. Dis à ton amie de prendre cette tasse précise. « Prends ___ tasse bleue. »', 'la', 'une', 'La personne sait exactement de quelle tasse tu parles.'),
  g4: fill('Au marché, je demande un kilo ___ tomates.', 'de', 'des', 'Après « un kilo », on utilise « de » devant le nom.'),
  g5: fill('Nous posons une assiette à chaque place. ___ personne a une assiette.', 'Chaque', 'Quelques', '« Chaque » désigne une personne à la fois.'),
  g6: fill('Le tablier du boulanger appartient à qui ? Il appartient ___ boulanger.', 'au', 'du', '« Appartenir à » donne ici « appartenir au boulanger ». '),

  h1: fill('Raconte une action terminée hier, au passé composé. « J’___ le cours jusqu’à midi. »', 'ai suivi', 'avais suivi', '« Ai suivi » est au passé composé.'),
  h2: fill('Hier, je suis allé au travail. J’___ le train.', 'ai pris', 'suis pris', '« Prendre le train » se forme ici avec « avoir » et le participe « pris ». '),
  h3: fill('Nora et Leïla ont pris le train. Elles sont ___ à 8 heures.', 'arrivées', 'arrivé', 'Avec « être », ici « arrivées » s’accorde avec « elles ». '),
  h4: fill('Je parle d’une ancienne habitude à l’imparfait. Chaque matin, nous ___ à pied.', 'allions', 'irons', '« Chaque matin » donne l’habitude. « Allions » est à l’imparfait.'),
  h5: fill('Le cours a commencé à 9 heures. J’avais déjà ___ les documents avant.', 'préparé', 'préparer', '« Avais préparé » situe la préparation avant le début du cours.'),
  h6: fill('Lila a déplacé ces cartons vers l’étage. Elle ___ les cartons.', 'a monté', 'est montée', '« Les cartons » complète directement le verbe « monter ». Ici, on prend « avoir ». '),
  h7: fill('Hier, Maya est sortie tôt du lit. Elle ___ à 6 heures.', 's’est levée', 's’a levée', 'Au passé composé, « se lever » se forme avec « être ». '),
  h8: fill('Le trajet était en cours. Nous ___ quand une roue a crevé.', 'roulions', 'avons roulé', '« Roulions » montre le trajet en cours quand la roue a crevé.'),
  h9: fill('J’ai écrit des invitations. Les invitations que j’ai ___ sont sur la table.', 'écrites', 'écrit', '« Que » reprend « les invitations » et vient avant le verbe. Fais l’accord au féminin pluriel.'),

  i1: fill('L’employé m’a aidé. Voilà l’employé ___ m’a aidé.', 'qui', 'que', 'Le pronom est le sujet du verbe « a aidé ». '),
  i2: fill('Cette veste est à moi. C’est ___.', 'la mienne', 'le mien', '« La mienne » reprend « ma veste », un nom féminin.'),
  i3: fill('Je compare des chaises. Je prends ___ avec les pieds en bois.', 'celles', 'ceux', '« Celles » reprend « les chaises », féminin pluriel.'),
  i4: fill('J’emporte la clé. Je ___ mets dans ma poche.', 'la', 'lui', '« La » reprend « la clé » et se place ici avant « mets ». '),
  i5: fill('J’écris à Awa et à Noé. Je ___ écris.', 'leur', 'lui', '« Leur » reprend ici deux personnes après « à ». '),
  i6: fill('J’ai entendu sonner. ___ est devant la porte, mais je ne connais pas son nom.', 'Quelqu’un', 'Quelque chose', '« Quelqu’un » parle d’une personne sans la nommer.'),
  i7: fill('Je vais à la bibliothèque. J’___ vais après le cours.', 'y', 'en', '« Y » reprend ici le lieu où je vais.'),
  i8: fill('Voici le plan. J’ai besoin de ce plan. Voici le plan ___ j’ai besoin.', 'dont', 'que', 'On dit « avoir besoin de ». « Dont » reprend « de ce plan ». '),
  i9: fill('Voici la chaise. J’ai posé mon sac sur cette chaise. Voici la chaise sur ___ j’ai posé mon sac.', 'laquelle', 'lequel', '« Laquelle » reprend « la chaise », féminin singulier.'),

  j1: fill('Appelle plus tard. Amir est ___ travailler en ce moment.', 'en train de', 'sur le point de', '« En train de » indique que le travail est déjà en cours.'),
  j2: fill('Le bus est parti il y a une minute. Il ___ partir.', 'vient de', 'va', '« Vient de » indique ici que le départ vient de se produire.'),
  j3: fill('Lina écoute la radio et prépare le repas en même temps. Elle écoute la radio ___ le repas.', 'en préparant', 'en préparer', 'Le gérondif « en préparant » présente la deuxième action faite en même temps.'),
  j4: fill('Ce soir, nous ___ préparer le dîner ensemble.', 'allons', 'allez', 'Au futur proche, écris « nous allons », puis l’infinitif.'),
  j5: fill('Demain, vous ___ à la gare à 10 heures. Utilise le futur simple.', 'arriverez', 'arriverons', 'Avec « vous », le futur simple prend la fin « -ez ». '),
  o1: fill('Annonce cette décision avec « aller » et l’infinitif. « Je vais ___ le cabinet. »', 'appeler', 'appellerai', 'Au futur proche, « vais » est suivi de l’infinitif « appeler ». '),
  o2: fill('Le repas sera terminé avant que nous sortions. Quand nous aurons ___, nous sortirons.', 'mangé', 'manger', '« Aurons mangé » indique l’action déjà finie avant la sortie.'),
  o3: fill('Demain, le temps est incertain. S’il ___, nous prendrons le bus.', 'pleut', 'pleuvra', 'Après « si » qui introduit cette condition possible, utilise le présent.'),

  j6: fill('Les employés ouvrent la salle. À la forme passive, « La salle est ___ par les employés. »', 'ouverte', 'ouvert', '« Ouverte » s’accorde avec « la salle », féminin singulier.'),
  j7: fill('Mon frère dit « J’arrive à midi. » Je rapporte ses paroles. « Mon frère dit ___ arrive à midi. »', 'qu’il', 'que je', '« Je » désigne mon frère dans ses mots. Quand je parle de lui, j’utilise « il ». '),
  j8: fill('Demande un service avec « pouvoir » au conditionnel. « Est-ce que vous ___ fermer la porte ? »', 'pourriez', 'pouviez', '« Pourriez » sert ici à demander un service avec politesse.'),
  j9: fill('J’imagine une situation. Si j’___ plus de temps, je viendrais avec toi.', 'avais', 'aurais', 'Après « si » dans cette situation imaginée, écris l’imparfait.'),
  j10: fill('Le train est parti. Si j’étais arrivé plus tôt, je l’___ pris.', 'aurais', 'aurai', '« Aurais pris » parle d’une action passée qui n’a pas eu lieu.'),

  k1: fill('Je partage l’avis de ma collègue. « Je suis ___ avec toi. »', 'd’accord', 'contre', '« D’accord » indique que tu partages son avis.'),
  k2: fill('Le bus est en retard. ___, j’arrive à l’heure, car je prends le train.', 'Pourtant', 'Donc', '« Pourtant » introduit ici un résultat qui peut surprendre.'),
  k3: fill('J’explique pourquoi je rentre. Je rentre ___ je suis fatiguée.', 'parce que', 'pour que', '« Parce que » introduit la raison.'),
  k4: fill('Le guichet est fermé. ___, je dois revenir demain.', 'Donc', 'Pourtant', '« Donc » annonce ce qui se passe à cause de la fermeture.'),
  k5: fill('J’explique mon objectif. Je vais à la poste ___ envoyer un colis.', 'pour', 'parce que', '« Pour envoyer » indique le but et utilise l’infinitif.'),
  k6: fill('Je compare deux trajets différents. Samir prend le train, ___ Lina prend le bus.', 'alors que', 'parce que', '« Alors que » marque ici la différence entre les deux trajets.'),
  k7: fill('La pluie est un obstacle, mais Lina sort quand même. ___ la pluie, Lina sort.', 'Malgré', 'Parce que', '« Malgré » introduit ici le nom de l’obstacle.'),
  k8: fill('J’ai besoin d’un plan. ___ j’ai besoin, c’est d’un plan.', 'Ce dont', 'Ce que', '« Avoir besoin de » conduit à choisir « ce dont ». '),
  k9: fill('J’envoie le plan à Lina. Je ___ envoie par message.', 'le lui', 'lui le', '« Le » reprend « le plan » et vient avant « lui ». '),
  k10: fill('Je parle d’une obligation. Il faut que tu ___ la clé demain.', 'apportes', 'apporteras', 'Après « il faut que », « apportes » est au subjonctif.'),
  k11: fill('La séance débute. Je commence ___ lire.', 'à', 'de', 'Apprends les mots ensemble. On dit « commencer à lire ». '),
  k12: fill('Tu as fini le travail. Je suis contente que tu ___ fini le travail.', 'aies', 'as', 'Après « je suis contente que », « aies fini » exprime au subjonctif une action déjà faite.'),
  k13: fill('J’exprime un doute. Je doute que Lina ___ demain.', 'vienne', 'viendra', '« Je doute que » demande ici le subjonctif « vienne ». '),
}
