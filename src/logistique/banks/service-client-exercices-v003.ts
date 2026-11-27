import type { LogistiqueUnit } from '../approved-banks'

const revision = 'service-client-exercices-v003'
const commun = ['CFC', 'AFP'] as const
const cfc = ['CFC'] as const

export const serviceClientExercises = [
  // 201 — Le client
  {
    id: 'log-201-maths-v003-01', module: '201', kind: 'maths', revision, approvedFor: commun,
    prompt: "Parmi les 80 clients servis en janvier, 52 reviennent acheter en février. Quel taux de retour obtient-on pour ce groupe ?",
    answer: "65 %",
    calculation: "52 ÷ 80 × 100 = 65.",
  },
  {
    id: 'log-201-maths-v003-02', module: '201', kind: 'maths', revision, approvedFor: commun,
    prompt: "Le service demande une confirmation à 36 clients. Dix répondent le matin et 17 l’après-midi. Combien restent à joindre ?",
    answer: "9 clients",
    calculation: "36 − 10 − 17 = 9.",
  },
  {
    id: 'log-201-maths-v003-03', module: '201', kind: 'maths', revision, approvedFor: commun,
    prompt: "Une commande de CHF 840 a été réglée en partie par un acompte de CHF 250. Quel solde le client doit-il encore régler ?",
    answer: "CHF 590",
    calculation: "840 − 250 = 590.",
  },
  {
    id: 'log-201-maths-v003-04', module: '201', kind: 'maths', revision, approvedFor: commun,
    prompt: "Trois clients retirent respectivement 2, 5 et 3 cartons. Un carton vide est rapporté par le troisième client. Combien de cartons pleins sont remis ?",
    answer: "10 cartons",
    calculation: "2 + 5 + 3 = 10. Le retour concerne un carton vide.",
  },
  {
    id: 'log-201-maths-v003-05', module: '201', kind: 'maths', revision, approvedFor: cfc,
    prompt: "Un client achète trois fois dans le trimestre pour CHF 180, 240 et 390. Le service coûte CHF 38 par retrait et l’achat des produits CHF 490 au total. Quel montant reste sur ces postes ?",
    answer: "CHF 206",
    calculation: "180 + 240 + 390 = 810. 810 − 3 × 38 − 490 = 206.",
  },
  {
    id: 'log-201-verification-v003-01', module: '201', kind: 'verification', revision, approvedFor: commun,
    prompt: "Dans une vente à livrer, que désigne « destinataire » ?",
    answer: "La personne ou l’organisation désignée pour recevoir l’envoi.",
  },
  {
    id: 'log-201-verification-v003-02', module: '201', kind: 'verification', revision, approvedFor: commun,
    prompt: "Si une autre entreprise commande et règle les marchandises, quel document aide à identifier le débiteur ?",
    answer: "La facture ou les conditions de commande indiquant la personne ou l’entreprise qui doit payer.",
  },
  {
    id: 'log-201-verification-v003-03', module: '201', kind: 'verification', revision, approvedFor: commun,
    prompt: "Qu’est-ce qu’un client interne ?",
    answer: "Une équipe ou un poste de la même organisation qui reçoit un produit ou un service d’une autre équipe.",
  },
  {
    id: 'log-201-verification-v003-04', module: '201', kind: 'verification', revision, approvedFor: commun,
    prompt: "Pourquoi rappeler le délai convenu après avoir vérifié le besoin d’un client ?",
    answer: "Pour confirmer la date ou le créneau attendu et éviter une promesse que le dépôt ne peut pas tenir.",
  },
  {
    id: 'log-201-verification-v003-05', module: '201', kind: 'verification', revision, approvedFor: commun,
    prompt: "Pourquoi garder une trace des demandes répétées de plusieurs clients ?",
    answer: "Pour repérer un besoin récurrent, mesurer son importance et préparer une amélioration du service.",
  },
  {
    id: 'log-201-situation-v003-01', module: '201', kind: 'situation', revision, approvedFor: commun,
    prompt: "Un client vient retirer un colis réservé au nom d’un collègue. Comment concilier qualité de l’accueil et règle de remise ?",
    answer: "Accueillir, vérifier la référence et les justificatifs autorisés, expliquer la procédure et proposer le canal prévu si l’autorisation manque.",
  },
  {
    id: 'log-201-situation-v003-02', module: '201', kind: 'situation', revision, approvedFor: commun,
    prompt: "Deux clients attendent un retour sur le même article. L’un souhaite une date, l’autre une caractéristique technique. Décrivez la réponse à préparer pour chacun.",
    answer: "Vérifier le délai et annoncer une date ou un suivi au premier. Obtenir la caractéristique vérifiée et répondre précisément au second.",
  },
  {
    id: 'log-201-situation-v003-03', module: '201', kind: 'situation', revision, approvedFor: commun,
    prompt: "Un client régulier ne récupère plus les produits au même horaire. Que demandez-vous avant de modifier ses créneaux de retrait ?",
    answer: "Demander son besoin actualisé, les volumes concernés et les créneaux utilisables, puis vérifier la disponibilité de l’équipe et confirmer l’accord.",
  },
  {
    id: 'log-201-situation-v003-04', module: '201', kind: 'situation', revision, approvedFor: cfc,
    prompt: "Le système montre de nombreuses demandes d’assistance chez des clients très réguliers. Quel diagnostic préparez-vous ?",
    answer: "Examiner motifs, délais et fréquence par commande ou client, vérifier si les causes se répètent et proposer une mesure avec un indicateur.",
  },

  // 202 — L'attitude personnelle / apparence
  {
    id: 'log-202-maths-v003-01', module: '202', kind: 'maths', revision, approvedFor: commun,
    prompt: "Douze personnes doivent recevoir chacune deux gilets pour la semaine. L’armoire contient 19 gilets propres. Combien faut-il encore préparer ?",
    answer: "5 gilets",
    calculation: "12 × 2 − 19 = 5.",
  },
  {
    id: 'log-202-maths-v003-02', module: '202', kind: 'maths', revision, approvedFor: commun,
    prompt: "Un accueil prévoit trois visites de 25 min et des intervalles de 5 min entre les visites. Quel temps faut-il réserver du premier début à la dernière fin ?",
    answer: "85 min",
    calculation: "3 × 25 + 2 × 5 = 85.",
  },
  {
    id: 'log-202-maths-v003-03', module: '202', kind: 'maths', revision, approvedFor: commun,
    prompt: "Une équipe a 32 vestes de travail. Un quart est envoyé au lavage et quatre sont mises à sécher. Combien restent prêtes si ces lots sont distincts ?",
    answer: "20 vestes",
    calculation: "32 ÷ 4 = 8. 32 − 8 − 4 = 20.",
  },
  {
    id: 'log-202-maths-v003-04', module: '202', kind: 'maths', revision, approvedFor: commun,
    prompt: "Un visiteur attend de 09 h 48 à 10 h 05. La charte vise un maximum de 10 min. De combien l’attente dépasse-t-elle cet objectif ?",
    answer: "7 min",
    calculation: "L’attente est de 17 min. 17 − 10 = 7.",
  },
  {
    id: 'log-202-maths-v003-05', module: '202', kind: 'maths', revision, approvedFor: cfc,
    prompt: "Deux fournisseurs de tenues proposent CHF 58 par veste avec entretien à CHF 4 par mois, ou CHF 70 par veste avec entretien à CHF 2,50 par mois. Au bout de combien de mois les deux coûts par veste sont-ils égaux ?",
    answer: "8 mois",
    calculation: "L’écart d’achat est de CHF 12. L’écart mensuel est de CHF 1,50. 12 ÷ 1,50 = 8.",
  },
  {
    id: 'log-202-verification-v003-01', module: '202', kind: 'verification', revision, approvedFor: commun,
    prompt: "En quoi le choix de l’équipement de protection dépend-il de la zone visitée ?",
    answer: "Les dangers et les consignes varient selon la zone. Les EPI doivent répondre à la tâche et aux protections prévues.",
  },
  {
    id: 'log-202-verification-v003-02', module: '202', kind: 'verification', revision, approvedFor: commun,
    prompt: "Donnez un exemple de communication non verbale à l’accueil.",
    answer: "Le regard, la posture, un geste qui indique la direction ou la distance tenue avec le visiteur.",
  },
  {
    id: 'log-202-verification-v003-03', module: '202', kind: 'verification', revision, approvedFor: commun,
    prompt: "À quoi sert une consigne d’hygiène lors d’un passage entre zone de réserve et zone de préparation alimentaire ?",
    answer: "À éviter le transfert de souillures et à protéger la marchandise et les personnes selon les règles du poste.",
  },
  {
    id: 'log-202-verification-v003-04', module: '202', kind: 'verification', revision, approvedFor: commun,
    prompt: "Pourquoi avertir si une demande dépasse votre rôle ?",
    answer: "Pour éviter une promesse non vérifiée et transmettre la décision à la personne compétente.",
  },
  {
    id: 'log-202-verification-v003-05', module: '202', kind: 'verification', revision, approvedFor: commun,
    prompt: "Quel comportement traduit le respect lorsque le visiteur ne connaît pas les règles du dépôt ?",
    answer: "Écouter, expliquer les règles en mots simples et l’orienter avec des indications précises.",
  },
  {
    id: 'log-202-situation-v003-01', module: '202', kind: 'situation', revision, approvedFor: commun,
    prompt: "Vous annoncez un retard, mais la personne comprend qu’elle doit attendre dehors. Comment reprenez-vous votre message ?",
    answer: "Reformuler calmement, préciser le lieu autorisé et le délai connu, puis vérifier que le visiteur connaît la prochaine étape.",
  },
  {
    id: 'log-202-situation-v003-02', module: '202', kind: 'situation', revision, approvedFor: commun,
    prompt: "Avant une prise de poste en zone alimentaire, vous remarquez que votre tenue est souillée. Décrivez les gestes à faire avant d’entrer.",
    answer: "Appliquer les règles d’hygiène du site, remplacer la tenue si nécessaire, nettoyer les mains et avertir si l’équipement requis manque.",
  },
  {
    id: 'log-202-situation-v003-03', module: '202', kind: 'situation', revision, approvedFor: commun,
    prompt: "Au téléphone, un interlocuteur vous parle très vite pendant que vous notez une adresse. Comment garder une attitude professionnelle ?",
    answer: "Demander de ralentir ou répéter, épeler les éléments sensibles, puis relire l’adresse et confirmer la prochaine action.",
  },
  {
    id: 'log-202-situation-v003-04', module: '202', kind: 'situation', revision, approvedFor: cfc,
    prompt: "Un prestataire propose d’accélérer l’accueil en laissant les visiteurs se diriger seuls. Comment évaluez-vous cette idée ?",
    answer: "Vérifier les règles d’accès et d’accompagnement, mesurer l’attente et les incidents d’orientation, puis proposer une solution compatible avec la sécurité.",
  },

  // 203 — La gestion de soi
  {
    id: 'log-203-maths-v003-01', module: '203', kind: 'maths', revision, approvedFor: commun,
    prompt: "Une personne prévoit 52 tâches de contrôle réparties sur quatre services de même capacité. Combien de tâches doit-elle viser par service ?",
    answer: "13 tâches",
    calculation: "52 ÷ 4 = 13.",
  },
  {
    id: 'log-203-maths-v003-02', module: '203', kind: 'maths', revision, approvedFor: commun,
    prompt: "Deux collègues ont 38 et 24 contrôles à faire. Combien de contrôles le premier doit-il céder au second pour que chacun en ait autant ?",
    answer: "7 contrôles",
    calculation: "(38 − 24) ÷ 2 = 7. Chacun en a 31.",
  },
  {
    id: 'log-203-maths-v003-03', module: '203', kind: 'maths', revision, approvedFor: commun,
    prompt: "Un briefing propose 15 min d’échange, puis 2 min pour chacun des 6 membres de l’équipe. Quelle durée totale prévoir ?",
    answer: "27 min",
    calculation: "15 + 6 × 2 = 27.",
  },
  {
    id: 'log-203-maths-v003-04', module: '203', kind: 'maths', revision, approvedFor: commun,
    prompt: "Vous avez un poste de 6 h. Un aléa mobilise 35 min et les contrôles de reprise 25 min. Quel temps reste pour les tâches prévues ?",
    answer: "5 h",
    calculation: "6 h = 360 min. 360 − 35 − 25 = 300 min.",
  },
  {
    id: 'log-203-maths-v003-05', module: '203', kind: 'maths', revision, approvedFor: cfc,
    prompt: "Une tâche exige 132 minutes de travail. Deux personnes peuvent y consacrer chacune 40 minutes avant 11 h. L’une est ensuite disponible seule. Combien de minutes doit-elle encore prévoir ?",
    answer: "52 min",
    calculation: "132 − 2 × 40 = 52.",
  },
  {
    id: 'log-203-verification-v003-01', module: '203', kind: 'verification', revision, approvedFor: commun,
    prompt: "Dans la fenêtre de Johari, que recouvre la zone cachée ?",
    answer: "Ce que la personne sait d’elle-même et que les autres ignorent.",
  },
  {
    id: 'log-203-verification-v003-02', module: '203', kind: 'verification', revision, approvedFor: commun,
    prompt: "Distinguez le compromis et la collaboration dans la gestion d’un conflit.",
    answer: "Le compromis accepte des concessions. La collaboration cherche une solution qui réponde aux besoins des parties.",
  },
  {
    id: 'log-203-verification-v003-03', module: '203', kind: 'verification', revision, approvedFor: commun,
    prompt: "Que désignent l’eustress et le distress ?",
    answer: "L’eustress désigne une tension qui peut mobiliser. Le distress correspond à une pression qui devient difficile à gérer et nuit au travail ou au bien-être.",
  },
  {
    id: 'log-203-verification-v003-04', module: '203', kind: 'verification', revision, approvedFor: commun,
    prompt: "Citez une protection collective face à la circulation de chariots.",
    answer: "Une séparation physique entre la voie piétonne et la voie des chariots, par exemple.",
  },
  {
    id: 'log-203-verification-v003-05', module: '203', kind: 'verification', revision, approvedFor: commun,
    prompt: "Qu’est-ce qu’une décision déléguée dans une équipe ?",
    answer: "Une décision confiée à une personne ou au groupe dans un cadre qui fixe les responsabilités et les limites.",
  },
  {
    id: 'log-203-situation-v003-01', module: '203', kind: 'situation', revision, approvedFor: commun,
    prompt: "Une collègue conteste une répartition de tâches qu’elle juge inégale. Préparez un échange qui part de faits vérifiables.",
    answer: "Relever durées, contraintes et tâches, écouter les besoins, proposer une répartition puis convenir du contrôle après un service.",
  },
  {
    id: 'log-203-situation-v003-02', module: '203', kind: 'situation', revision, approvedFor: commun,
    prompt: "Pendant un pic, vous remarquez que vous oubliez des contrôles. Que faites-vous pour éviter leur répétition ?",
    answer: "Signaler la surcharge, convenir de la priorité ou d’un renfort et reprendre une liste de contrôle avec vérification des points oubliés.",
  },
  {
    id: 'log-203-situation-v003-03', module: '203', kind: 'situation', revision, approvedFor: commun,
    prompt: "Une personne est nouvelle au dépôt et ne connaît pas le trajet piéton. Comment l’orienter et vérifier qu’elle a compris ?",
    answer: "Lui montrer le trajet et les croisements, préciser les limites, puis lui demander de reformuler ou montrer le chemin prévu.",
  },
  {
    id: 'log-203-situation-v003-04', module: '203', kind: 'situation', revision, approvedFor: cfc,
    prompt: "Deux responsables donnent une instruction différente sur la même tâche. Comment cherchez-vous un accord qui tienne compte de l’autorité et du terrain ?",
    answer: "Relever les instructions, les contraintes et les risques, demander une décision au rôle habilité et confirmer l’instruction unique à l’équipe.",
  },

  // 204 — Le marché
  {
    id: 'log-204-maths-v003-01', module: '204', kind: 'maths', revision, approvedFor: commun,
    prompt: "Une enquête recense des besoins de 42, 57 et 18 bacs dans trois zones distinctes. Quel volume total faut-il retenir pour cette prévision ?",
    answer: "117 unités",
    calculation: "42 + 57 + 18 = 117.",
  },
  {
    id: 'log-204-maths-v003-02', module: '204', kind: 'maths', revision, approvedFor: commun,
    prompt: "Un marché local vend 1 200 bacs pendant un trimestre. Une entreprise en vend 180. Calculez sa part en volume.",
    answer: "15 %",
    calculation: "180 ÷ 1 200 × 100 = 15.",
  },
  {
    id: 'log-204-maths-v003-03', module: '204', kind: 'maths', revision, approvedFor: commun,
    prompt: "À CHF 15 l’unité, les fournisseurs offrent 140 bacs et les acheteurs en demandent 125. Quel surplus d’offre observe-t-on à ce prix ?",
    answer: "15 bacs",
    calculation: "140 − 125 = 15.",
  },
  {
    id: 'log-204-maths-v003-04', module: '204', kind: 'maths', revision, approvedFor: commun,
    prompt: "Le vendeur A détient 40 % d’un marché en volume et B détient 25 %. Quelle part les autres vendeurs occupent-ils ensemble ?",
    answer: "35 %",
    calculation: "100 − 40 − 25 = 35.",
  },
  {
    id: 'log-204-maths-v003-05', module: '204', kind: 'maths', revision, approvedFor: cfc,
    prompt: "Un marché a 820 ventes à CHF 22 et 180 ventes à CHF 32. Quel est le prix moyen effectivement payé, toutes ventes réunies ?",
    answer: "CHF 23,80",
    calculation: "(820 × 22 + 180 × 32) ÷ 1 000 = 23,80.",
  },
  {
    id: 'log-204-verification-v003-01', module: '204', kind: 'verification', revision, approvedFor: commun,
    prompt: "Quelle différence faites-vous entre recueillir des données et les analyser ?",
    answer: "Recueillir consiste à obtenir les observations. Analyser consiste à les comparer et les interpréter pour éclairer une décision.",
  },
  {
    id: 'log-204-verification-v003-02', module: '204', kind: 'verification', revision, approvedFor: commun,
    prompt: "Quel critère permet de reconnaître un oligopole ?",
    answer: "Un petit nombre d’offreurs sur le marché défini.",
  },
  {
    id: 'log-204-verification-v003-03', module: '204', kind: 'verification', revision, approvedFor: commun,
    prompt: "Pourquoi préciser une région dans une étude du retrait en dépôt ?",
    answer: "La distance et l’accessibilité influencent le besoin. La région définit aussi quels clients et offres sont comparables.",
  },
  {
    id: 'log-204-verification-v003-04', module: '204', kind: 'verification', revision, approvedFor: commun,
    prompt: "Citez une évolution qui peut déplacer la demande même si le prix reste stable.",
    answer: "Changement des besoins, d’un usage, du revenu ou de la disponibilité d’une solution de remplacement.",
  },
  {
    id: 'log-204-verification-v003-05', module: '204', kind: 'verification', revision, approvedFor: commun,
    prompt: "Pourquoi les parts de marché en volume et en valeur peuvent-elles différer ?",
    answer: "Les prix unitaires et la composition des ventes varient entre les entreprises.",
  },
  {
    id: 'log-204-situation-v003-01', module: '204', kind: 'situation', revision, approvedFor: commun,
    prompt: "On vous demande d’estimer le besoin en bacs pour une nouvelle activité. Comment préparez-vous l’étude ?",
    answer: "Définir le format, le périmètre et la période, demander les quantités aux clients concernés et comparer les résultats aux offres disponibles.",
  },
  {
    id: 'log-204-situation-v003-02', module: '204', kind: 'situation', revision, approvedFor: commun,
    prompt: "Les ventes progressent surtout pendant un mois de promotion. Quel contrôle faites-vous avant de réviser la prévision annuelle ?",
    answer: "Comparer la période avec un mois et une année équivalents, identifier l’effet de l’offre et vérifier si la demande dure après la promotion.",
  },
  {
    id: 'log-204-situation-v003-03', module: '204', kind: 'situation', revision, approvedFor: commun,
    prompt: "Un fournisseur affirme qu’aucun concurrent ne vend le même bac. Quelles informations comparez-vous ?",
    answer: "Définir le marché, vérifier la fonction et les caractéristiques, chercher des produits équivalents sur la zone et relever leurs conditions.",
  },
  {
    id: 'log-204-situation-v003-04', module: '204', kind: 'situation', revision, approvedFor: cfc,
    prompt: "Deux études annoncent des parts différentes. L’une compte les franchises, l’autre traite seulement les magasins directs. Comment préparez-vous une mesure commune ?",
    answer: "Harmoniser les points de vente et la période, choisir volume ou valeur, recalculer numérateur et dénominateur selon ce périmètre.",
  },

  // 205 — Le marketing
  {
    id: 'log-205-maths-v003-01', module: '205', kind: 'maths', revision, approvedFor: commun,
    prompt: "À CHF 6, le graphique d’exercice indique 50 bacs offerts et demandés. À CHF 8, il indique 70 offerts et 30 demandés. Quel est l’écart entre offre et demande au second prix ?",
    answer: "40 bacs offerts en plus que demandés",
    calculation: "70 − 30 = 40.",
  },
  {
    id: 'log-205-maths-v003-02', module: '205', kind: 'maths', revision, approvedFor: commun,
    prompt: "Une présentation en magasin dure cinq jours. On prévoit 25 démonstrations par jour et 150 échantillons. Combien d’échantillons restent si une démonstration en utilise un ?",
    answer: "25 échantillons",
    calculation: "150 − 5 × 25 = 25.",
  },
  {
    id: 'log-205-maths-v003-03', module: '205', kind: 'maths', revision, approvedFor: commun,
    prompt: "Deux affiches coûtent CHF 75 et CHF 135. Une séance de présentation coûte CHF 95. Le budget est de CHF 360. Combien reste à engager ?",
    answer: "CHF 55",
    calculation: "360 − 75 − 135 − 95 = 55.",
  },
  {
    id: 'log-205-maths-v003-04', module: '205', kind: 'maths', revision, approvedFor: commun,
    prompt: "Une promotion prévoit 80 bacs à mettre en rayon. L’équipe en installe 62 au départ, puis 12 le lendemain. Combien de bacs reste-t-il à mettre en rayon ?",
    answer: "6 bacs",
    calculation: "80 − 62 − 12 = 6.",
  },
  {
    id: 'log-205-maths-v003-05', module: '205', kind: 'maths', revision, approvedFor: cfc,
    prompt: "Une opération coûte CHF 360. Chaque vente supplémentaire apporte une contribution de CHF 9 avant ces frais. Combien de ventes supplémentaires couvrent exactement l’opération ?",
    answer: "40 ventes",
    calculation: "360 ÷ 9 = 40.",
  },
  {
    id: 'log-205-verification-v003-01', module: '205', kind: 'verification', revision, approvedFor: commun,
    prompt: "Dans les 4P, quel élément traite du retrait au dépôt et de la livraison à domicile ?",
    answer: "Place, c’est-à-dire la distribution.",
  },
  {
    id: 'log-205-verification-v003-02', module: '205', kind: 'verification', revision, approvedFor: commun,
    prompt: "Dans AIDA, que signifie la dernière étape ?",
    answer: "Action, par exemple demander un devis, commander ou réserver.",
  },
  {
    id: 'log-205-verification-v003-03', module: '205', kind: 'verification', revision, approvedFor: commun,
    prompt: "Comment le choix du public influence-t-il une annonce professionnelle ?",
    answer: "Il oriente les termes, le canal et les caractéristiques à expliquer en fonction du besoin des destinataires.",
  },
  {
    id: 'log-205-verification-v003-04', module: '205', kind: 'verification', revision, approvedFor: commun,
    prompt: "Pourquoi une campagne en ligne doit-elle suivre autant les commandes confirmées que la visibilité ?",
    answer: "La visibilité indique l’exposition. Les commandes renseignent sur le résultat de vente selon le suivi défini.",
  },
  {
    id: 'log-205-verification-v003-05', module: '205', kind: 'verification', revision, approvedFor: commun,
    prompt: "Donnez un exemple concret de différence de service entre deux offres du même produit.",
    answer: "Par exemple un retrait rapide inclut la mise à disposition au dépôt, tandis qu’une autre offre prévoit une livraison planifiée.",
  },
  {
    id: 'log-205-situation-v003-01', module: '205', kind: 'situation', revision, approvedFor: commun,
    prompt: "Une annonce de retrait ne dit pas si les contenants doivent être commandés à l’avance. Proposez une formulation et un contrôle opérationnel.",
    answer: "Préciser les conditions de réservation, les horaires et le délai. Vérifier la disponibilité avec le dépôt avant diffusion.",
  },
  {
    id: 'log-205-situation-v003-02', module: '205', kind: 'situation', revision, approvedFor: commun,
    prompt: "Le public s’intéresse au réemploi, mais l’équipe ne connaît pas les modalités de retour. Comment réviser le message ?",
    answer: "Vérifier les conditions de retour et de contrôle, puis expliquer les étapes, les coûts éventuels et le lieu de retour.",
  },
  {
    id: 'log-205-situation-v003-03', module: '205', kind: 'situation', revision, approvedFor: commun,
    prompt: "Vous devez présenter deux bacs proches en photo. Quelles informations placer à côté pour rendre le choix compréhensible ?",
    answer: "Indiquer dimensions utiles, charge admise, usage, prix et disponibilité, selon les données vérifiées.",
  },
  {
    id: 'log-205-situation-v003-04', module: '205', kind: 'situation', revision, approvedFor: cfc,
    prompt: "Une offre fait gagner des commandes, mais réduit la contribution par commande. Que faut-il comparer pour décider d’une nouvelle campagne ?",
    answer: "Comparer volume additionnel, contribution unitaire, coûts de campagne et contraintes de service. Choisir un périmètre et une période de référence.",
  },

  // 206 — La communication
  {
    id: 'log-206-maths-v003-01', module: '206', kind: 'maths', revision, approvedFor: commun,
    prompt: "Une équipe échange sept messages pour chaque tournée. Elle prépare quatre tournées et envoie aussi deux annonces communes. Combien de messages envoie-t-elle ?",
    answer: "30 messages",
    calculation: "7 × 4 + 2 = 30.",
  },
  {
    id: 'log-206-maths-v003-02', module: '206', kind: 'maths', revision, approvedFor: commun,
    prompt: "Un appel sur un problème prend 8 min, puis un courriel de confirmation 3 min. Quel temps prévoir pour trois problèmes identiques ?",
    answer: "33 min",
    calculation: "3 × (8 + 3) = 33.",
  },
  {
    id: 'log-206-maths-v003-03', module: '206', kind: 'maths', revision, approvedFor: commun,
    prompt: "Deux messages sur une même livraison arrivent à 13 h 42 et 14 h 16. Combien de minutes les séparent ?",
    answer: "34 min",
    calculation: "18 min jusqu’à 14 h et 16 min après, soit 34 min.",
  },
  {
    id: 'log-206-maths-v003-04', module: '206', kind: 'maths', revision, approvedFor: commun,
    prompt: "Le briefing de 30 min prévoit un tiers du temps pour les consignes et la moitié pour les échanges. Combien reste pour résumer les décisions ?",
    answer: "5 min",
    calculation: "30 − 30 ÷ 3 − 30 ÷ 2 = 5.",
  },
  {
    id: 'log-206-maths-v003-05', module: '206', kind: 'maths', revision, approvedFor: cfc,
    prompt: "Cinq départs sont modifiés. Appeler chaque chauffeur prend 6 min. Une annonce numérique prend 8 min et il reste deux chauffeurs à joindre, à 6 min chacun. Quel temps gagne la deuxième méthode ?",
    answer: "10 min",
    calculation: "5 × 6 = 30. 8 + 2 × 6 = 20. 30 − 20 = 10.",
  },
  {
    id: 'log-206-verification-v003-01', module: '206', kind: 'verification', revision, approvedFor: commun,
    prompt: "Dans le modèle de la communication, que désigne le canal ?",
    answer: "Le moyen utilisé pour transmettre le message, par exemple une conversation, un écrit ou une radio.",
  },
  {
    id: 'log-206-verification-v003-02', module: '206', kind: 'verification', revision, approvedFor: commun,
    prompt: "Citez un élément non verbal qui aide à saisir le déroulement d’un échange en face à face.",
    answer: "Par exemple le regard, la posture ou un geste qui signale qu’une personne souhaite prendre la parole.",
  },
  {
    id: 'log-206-verification-v003-03', module: '206', kind: 'verification', revision, approvedFor: commun,
    prompt: "Quand une confirmation écrite complète-t-elle utilement un échange oral ?",
    answer: "Quand il faut conserver une trace de données, d’un délai ou d’une décision que plusieurs personnes devront utiliser.",
  },
  {
    id: 'log-206-verification-v003-04', module: '206', kind: 'verification', revision, approvedFor: commun,
    prompt: "Pourquoi transmettre un identifiant d’envoi avec un message sur le suivi ?",
    answer: "Il fixe l’envoi concerné et permet au destinataire de retrouver les bonnes données.",
  },
  {
    id: 'log-206-verification-v003-05', module: '206', kind: 'verification', revision, approvedFor: commun,
    prompt: "Quand utiliser une question ouverte au début d’une conversation ?",
    answer: "Pour comprendre ce qui s’est passé ou découvrir le besoin avant de confirmer un point précis.",
  },
  {
    id: 'log-206-situation-v003-01', module: '206', kind: 'situation', revision, approvedFor: commun,
    prompt: "Un message à l’équipe dit seulement « dépôt décalé ». Vous savez que la livraison 823 est reportée de 09 h à 11 h au quai 2. Reformulez le message.",
    answer: "« La livraison 823 est reportée de 09 h à 11 h au quai 2. Merci de confirmer et de mettre à jour le planning. »",
  },
  {
    id: 'log-206-situation-v003-02', module: '206', kind: 'situation', revision, approvedFor: commun,
    prompt: "Un client appelle pendant le déchargement et son nom est difficile à entendre. Comment mener la conversation ?",
    answer: "Aller dans un lieu calme si possible, demander le nom ou la référence, reformuler la demande et indiquer la suite.",
  },
  {
    id: 'log-206-situation-v003-03', module: '206', kind: 'situation', revision, approvedFor: commun,
    prompt: "Vous annoncez une rupture à un autre service. Décrivez la fin de l’échange pour éviter un malentendu.",
    answer: "Confirmer produit, quantité, responsable et prochaine échéance. Donner le canal et le moment du prochain retour d’information.",
  },
  {
    id: 'log-206-situation-v003-04', module: '206', kind: 'situation', revision, approvedFor: cfc,
    prompt: "Un fournisseur explique oralement qu’un changement touche plusieurs références. Comment rendre le transfert compréhensible pour réception, stock et achats ?",
    answer: "Relever les références et les effets par service, faire confirmer par le fournisseur, puis envoyer un message commun traçable avec actions, rôles et échéances.",
  },

  // 207 — Pre-Sale-Service
  {
    id: 'log-207-maths-v003-01', module: '207', kind: 'maths', revision, approvedFor: commun,
    prompt: "Un client veut ranger un article de 52 cm dans un bac. La longueur utile est de 58 cm. Quel espace reste dans le sens de la longueur ?",
    answer: "6 cm",
    calculation: "58 − 52 = 6.",
  },
  {
    id: 'log-207-maths-v003-02', module: '207', kind: 'maths', revision, approvedFor: commun,
    prompt: "Un client prévoit 96 pièces. Un bac peut en contenir 18 selon l’exercice. Quel nombre minimal de bacs doit-on lui proposer ?",
    answer: "6 bacs",
    calculation: "96 = 5 × 18 + 6. Il faut un sixième bac.",
  },
  {
    id: 'log-207-maths-v003-03', module: '207', kind: 'maths', revision, approvedFor: commun,
    prompt: "Une séance de conseil a lieu de 14 h 15 à 14 h 55. Dix minutes servent à préparer l’échantillon. Combien de minutes restent pour l’échange ?",
    answer: "30 min",
    calculation: "40 − 10 = 30.",
  },
  {
    id: 'log-207-maths-v003-04', module: '207', kind: 'maths', revision, approvedFor: commun,
    prompt: "Une offre indique CHF 18 par retour à vide. Le client évalue 6 retours par trimestre. Quel coût annuel prévoit-il à rythme constant ?",
    answer: "CHF 432 par an",
    calculation: "18 × 6 × 4 = 432.",
  },
  {
    id: 'log-207-maths-v003-05', module: '207', kind: 'maths', revision, approvedFor: cfc,
    prompt: "Il faut 72 bacs. Le fournisseur A peut en livrer 45 à CHF 13 l’unité. Le fournisseur B vend des lots complets de 10 à CHF 16 le bac. Prenez d’abord les 45 bacs de A. Calculez les quantités, le surplus et le coût total.",
    answer: "45 chez A et 30 chez B, soit 3 bacs en plus pour CHF 1 065",
    calculation: "72 − 45 = 27, donc 3 lots chez B. 45 + 30 − 72 = 3. 45 × 13 + 30 × 16 = 1 065.",
  },
  {
    id: 'log-207-verification-v003-01', module: '207', kind: 'verification', revision, approvedFor: commun,
    prompt: "Que cherchez-vous à savoir en demandant l’usage prévu du contenant ?",
    answer: "Les contraintes réelles du produit, de son rangement, de son transport et des personnes qui l’utiliseront.",
  },
  {
    id: 'log-207-verification-v003-02', module: '207', kind: 'verification', revision, approvedFor: commun,
    prompt: "Pourquoi écrire les critères indispensables avant de comparer les offres ?",
    answer: "Pour écarter une offre incompatible même si son prix ou son score global paraît intéressant.",
  },
  {
    id: 'log-207-verification-v003-03', module: '207', kind: 'verification', revision, approvedFor: commun,
    prompt: "Que signifie « service avant-vente » dans un échange professionnel ?",
    answer: "Le conseil et les informations donnés avant que le client décide de commander.",
  },
  {
    id: 'log-207-verification-v003-04', module: '207', kind: 'verification', revision, approvedFor: commun,
    prompt: "Quelle preuve demander si la résistance du bac est présentée comme un avantage ?",
    answer: "La documentation du modèle et les conditions de la charge admise ou de l’essai prévu.",
  },
  {
    id: 'log-207-verification-v003-05', module: '207', kind: 'verification', revision, approvedFor: commun,
    prompt: "Quel facteur peut rendre deux offres difficilement comparables même si le prix unitaire est identique ?",
    answer: "Par exemple la quantité, le transport, le retour, la garantie ou le délai peuvent différer.",
  },
  {
    id: 'log-207-situation-v003-01', module: '207', kind: 'situation', revision, approvedFor: commun,
    prompt: "Un client veut des bacs réutilisables sans connaître le coût de retour. Quels renseignements lui demandez-vous pour comparer les solutions ?",
    answer: "Recueillir volumes, nombre de rotations, lieu de retour, conditionnement et frais, puis comparer sur une utilisation équivalente.",
  },
  {
    id: 'log-207-situation-v003-02', module: '207', kind: 'situation', revision, approvedFor: commun,
    prompt: "Deux bacs ont les mêmes dimensions extérieures, mais votre client doit y placer une pièce longue. Comment le conseillez-vous ?",
    answer: "Vérifier les dimensions intérieures utiles, la méthode de prise et les jeux nécessaires. Présenter les données et essayer le gabarit si possible.",
  },
  {
    id: 'log-207-situation-v003-03', module: '207', kind: 'situation', revision, approvedFor: commun,
    prompt: "Le client hésite entre un bac résistant et un autre plus léger. Préparez deux questions pour éclairer son choix.",
    answer: "« Quelle charge et quels chocs le bac doit-il supporter ? » et « À quelle fréquence et comment doit-il être déplacé ? »",
  },
  {
    id: 'log-207-situation-v003-04', module: '207', kind: 'situation', revision, approvedFor: cfc,
    prompt: "Une entreprise doit choisir entre deux offres qui satisfont ses critères minimaux. Comment distinguez-vous les écarts qui comptent réellement ?",
    answer: "Pondérer selon les priorités, vérifier l’incertitude et le coût complet, puis tester si un changement plausible de délai ou de charge change le classement.",
  },

  // 208 — At-Sale-Service
  {
    id: 'log-208-maths-v003-01', module: '208', kind: 'maths', revision, approvedFor: commun,
    prompt: "Le client commande 12 caisses et choisit un couvercle pour chaque caisse sauf trois. Les couvercles coûtent CHF 4 chacun. Combien coûtent les couvercles ?",
    answer: "CHF 36",
    calculation: "(12 − 3) × 4 = 36.",
  },
  {
    id: 'log-208-maths-v003-02', module: '208', kind: 'maths', revision, approvedFor: commun,
    prompt: "Vingt bacs coûtent CHF 320 au total. Quel prix unitaire inscrire sur l’offre ?",
    answer: "CHF 16 par bac",
    calculation: "320 ÷ 20 = 16.",
  },
  {
    id: 'log-208-maths-v003-03', module: '208', kind: 'maths', revision, approvedFor: commun,
    prompt: "L’offre vaut CHF 680. Le client verse un acompte égal à un quart. Calculez l’acompte et le solde.",
    answer: "CHF 170 d’acompte et CHF 510 de solde",
    calculation: "680 ÷ 4 = 170. 680 − 170 = 510.",
  },
  {
    id: 'log-208-maths-v003-04', module: '208', kind: 'maths', revision, approvedFor: commun,
    prompt: "Chaque commande d’au moins CHF 50 ouvre droit à une réduction de CHF 8. Les commandes valent CHF 48, 52 et 59. Quel total le client paie-t-il pour les trois commandes séparées ?",
    answer: "CHF 143",
    calculation: "48 + (52 − 8) + (59 − 8) = 143.",
  },
  {
    id: 'log-208-maths-v003-05', module: '208', kind: 'maths', revision, approvedFor: cfc,
    prompt: "Un client exige un prix total d’au plus CHF 500. La livraison coûte CHF 32 et chaque bac CHF 27,50. Combien de bacs entiers peut-il recevoir au maximum ?",
    answer: "17 bacs",
    calculation: "(500 − 32) ÷ 27,50 ≈ 17,02. 17 bacs coûtent CHF 499,50 avec livraison.",
  },
  {
    id: 'log-208-verification-v003-01', module: '208', kind: 'verification', revision, approvedFor: commun,
    prompt: "À quoi servent les conditions générales de vente ?",
    answer: "Elles précisent des règles applicables aux opérations couvertes, par exemple paiement, livraison ou retours.",
  },
  {
    id: 'log-208-verification-v003-02', module: '208', kind: 'verification', revision, approvedFor: commun,
    prompt: "Que faut-il vérifier avant qu’un client bénéficie d’un coupon ?",
    answer: "La validité, les produits et montants concernés ainsi que les restrictions de l’offre.",
  },
  {
    id: 'log-208-verification-v003-03', module: '208', kind: 'verification', revision, approvedFor: commun,
    prompt: "Quelle différence y a-t-il entre une proposition d’offre et la remise effective de marchandises ?",
    answer: "L’offre indique des conditions de vente. La remise est l’exécution de la livraison prévue une fois l’accord obtenu.",
  },
  {
    id: 'log-208-verification-v003-04', module: '208', kind: 'verification', revision, approvedFor: commun,
    prompt: "Dans un entretien, quand présenter une solution ?",
    answer: "Après avoir écouté et reformulé le besoin, avec des caractéristiques vérifiées.",
  },
  {
    id: 'log-208-verification-v003-05', module: '208', kind: 'verification', revision, approvedFor: commun,
    prompt: "Quelles données comparer entre le formulaire de commande et la confirmation écrite ?",
    answer: "La référence, la quantité, le prix, le destinataire, le délai et les autres conditions convenues.",
  },
  {
    id: 'log-208-situation-v003-01', module: '208', kind: 'situation', revision, approvedFor: commun,
    prompt: "Le client commande des couvercles supplémentaires au moment du paiement. Comment traitez-vous la demande ?",
    answer: "Vérifier la compatibilité, confirmer la nouvelle quantité et le total, puis actualiser la commande avant préparation.",
  },
  {
    id: 'log-208-situation-v003-02', module: '208', kind: 'situation', revision, approvedFor: commun,
    prompt: "Deux clients veulent profiter du même coupon mais l’un a dépassé la date. Comment l’expliquez-vous ?",
    answer: "Vérifier les conditions en vigueur, préciser la date et, si disponible, proposer une autre offre adaptée sans faire de promesse.",
  },
  {
    id: 'log-208-situation-v003-03', module: '208', kind: 'situation', revision, approvedFor: commun,
    prompt: "Au téléphone, le client épelle un code de produit presque identique à un autre. Comment confirmer la vente ?",
    answer: "Relire le code et les caractéristiques, confirmer besoin et quantité, puis reprendre ces données dans le document de commande.",
  },
  {
    id: 'log-208-situation-v003-04', module: '208', kind: 'situation', revision, approvedFor: cfc,
    prompt: "Les CGV prévoient un retrait sous dix jours. Le client demande une exception et la marchandise occupe une place rare. Comment traiter la demande ?",
    answer: "Vérifier la règle et la disponibilité, demander une décision à la personne habilitée et consigner l’exception confirmée avec un délai précis.",
  },

  // 209 — Le service après-vente
  {
    id: 'log-209-maths-v003-01', module: '209', kind: 'maths', revision, approvedFor: commun,
    prompt: "Le SAV veut rappeler 24 clients dans un créneau de 90 minutes. Chaque appel prend 5 min. Combien de rappels doit-il reporter si le rythme est constant ?",
    answer: "6 rappels",
    calculation: "90 ÷ 5 = 18. 24 − 18 = 6.",
  },
  {
    id: 'log-209-maths-v003-02', module: '209', kind: 'maths', revision, approvedFor: commun,
    prompt: "Le prestataire facture CHF 12 par retour. Il traite trois colis pour un dossier et deux pour un autre. Quel est le coût des retours ?",
    answer: "CHF 60",
    calculation: "(3 + 2) × 12 = 60.",
  },
  {
    id: 'log-209-maths-v003-03', module: '209', kind: 'maths', revision, approvedFor: commun,
    prompt: "Un dossier SAV est affecté à 10 h 18 et demande 45 min de traitement. À quelle heure peut-il être clos si le travail commence immédiatement ?",
    answer: "11 h 03",
    calculation: "10 h 18 + 45 min = 11 h 03.",
  },
  {
    id: 'log-209-maths-v003-04', module: '209', kind: 'maths', revision, approvedFor: commun,
    prompt: "Une pièce de remplacement coûte CHF 82 et son expédition CHF 18. Le forfait prévu pour le dossier vaut CHF 120. Combien reste sur le forfait après ces frais ?",
    answer: "CHF 20",
    calculation: "120 − 82 − 18 = 20.",
  },
  {
    id: 'log-209-maths-v003-05', module: '209', kind: 'maths', revision, approvedFor: cfc,
    prompt: "Une semaine, 18 dossiers sont traités en deux jours et 12 en cinq jours. Calculez la durée moyenne par dossier au dixième de jour.",
    answer: "3,2 jours",
    calculation: "(18 × 2 + 12 × 5) ÷ 30 = 3,2.",
  },
  {
    id: 'log-209-verification-v003-01', module: '209', kind: 'verification', revision, approvedFor: commun,
    prompt: "Que désigne un numéro de dossier SAV ?",
    answer: "Un identifiant qui relie la demande, les justificatifs, les décisions et les échanges.",
  },
  {
    id: 'log-209-verification-v003-02', module: '209', kind: 'verification', revision, approvedFor: commun,
    prompt: "Pourquoi faire préciser le défaut avec des faits observables ?",
    answer: "Pour transmettre une description exploitable et éviter d’attribuer une cause avant examen.",
  },
  {
    id: 'log-209-verification-v003-03', module: '209', kind: 'verification', revision, approvedFor: commun,
    prompt: "Quand demander une autorisation pour un geste commercial ?",
    answer: "Lorsque la décision dépasse votre rôle, la limite d’un montant ou les conditions fixées.",
  },
  {
    id: 'log-209-verification-v003-04', module: '209', kind: 'verification', revision, approvedFor: commun,
    prompt: "Quel contrôle faire après l’envoi d’une pièce de remplacement ?",
    answer: "Vérifier l’identifiant et la remise, puis confirmer que le client a reçu la bonne pièce et que le dossier peut être clos.",
  },
  {
    id: 'log-209-verification-v003-05', module: '209', kind: 'verification', revision, approvedFor: commun,
    prompt: "Pourquoi suivre les motifs de dossier, et pas seulement le nombre total ?",
    answer: "Pour repérer les causes récurrentes et concentrer les actions sur les écarts les plus fréquents.",
  },
  {
    id: 'log-209-situation-v003-01', module: '209', kind: 'situation', revision, approvedFor: commun,
    prompt: "Le client n’a plus son bon de commande mais peut fournir un identifiant d’envoi. Comment ouvrirez-vous le dossier ?",
    answer: "Vérifier les données autorisées avec l’identifiant, consigner l’article, l’écart et la date, puis confirmer quelle pièce justificative reste utile.",
  },
  {
    id: 'log-209-situation-v003-02', module: '209', kind: 'situation', revision, approvedFor: commun,
    prompt: "Un client attend un rappel promis hier. La vérification du défaut n’est pas terminée. Que lui dites-vous ?",
    answer: "Confirmer que le dossier est traité, expliquer l’étape en cours sans annoncer une cause ou un résultat non établi, et préciser le prochain retour.",
  },
  {
    id: 'log-209-situation-v003-03', module: '209', kind: 'situation', revision, approvedFor: commun,
    prompt: "Vous récupérez un produit en échange d’un remplacement. Quelle trace faut-il conserver ?",
    answer: "L’identité du dossier, les deux références, l’état du produit repris, la date de remise et le suivi du retour.",
  },
  {
    id: 'log-209-situation-v003-04', module: '209', kind: 'situation', revision, approvedFor: cfc,
    prompt: "Une série de réclamations apparaît après un changement de conditionnement. Comment confirmez-vous une cause possible ?",
    answer: "Comparer périodes et volumes, classer les défauts par produit et lot, examiner les preuves avec la qualité, puis tester une amélioration et suivre les écarts.",
  },
] satisfies readonly LogistiqueUnit[]
