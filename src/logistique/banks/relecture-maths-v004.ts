type MathReview = {
  id: string
  theorySection: string
  prompt?: string
  answer?: string
  calculation?: string
}

export const foundationAndServiceMathReview = [
  // 100
  { id: 'log-100-maths-v003-01', theorySection: "1. Du quai au destinataire" },
  { id: 'log-100-maths-v003-02', theorySection: "1. Du quai au destinataire" },
  {
    id: 'log-100-maths-v003-03', theorySection: "3. Organiser votre révision",
    prompt: "Vous préparez un exercice au dépôt-école. Comptez 4 min pour identifier un colis, 8 min pour contrôler le bon, 5 min pour vérifier l’état, 6 min pour saisir l’entrée et 7 min pour ranger le colis. Calculez la durée moyenne d’une étape.",
    answer: "6 min par étape",
    calculation: "Les cinq étapes prennent 4 + 8 + 5 + 6 + 7 = 30 min. La moyenne est 30 ÷ 5 = 6 min.",
  },
  {
    id: 'log-100-maths-v003-04', theorySection: "4. Contrôler votre réponse",
    prompt: "Pour vérifier un transfert, vous contrôlez cinq couples article–emplacement dans le système. Trois correspondent aux articles réellement rangés. Quelle fraction, puis quel pourcentage des couples est correct ?",
    answer: "3/5, soit 60 %",
    calculation: "Rapportez les 3 couples corrects aux 5 couples contrôlés. 3 ÷ 5 × 100 = 60 %.",
  },
  {
    id: 'log-100-maths-v003-05', theorySection: "1. Du quai au destinataire",
    prompt: "Au dépôt-école, vous prévoyez 50 min pour recevoir, ranger et expédier un lot. Ajoutez une réserve de 12 % du temps prévu et 5 min pour vérifier la trace de l’envoi. Quel créneau total faut-il ?",
    answer: "61 min",
    calculation: "La réserve vaut 50 × 0,12 = 6 min. Le créneau vaut 50 + 6 + 5 = 61 min.",
  },
  // 101
  {
    id: 'log-101-maths-v003-01', theorySection: "1.2.1 La Route de la Soie",
    prompt: "Sur un itinéraire fictif de la route de la soie, une caravane effectue quatre étapes entre des relais. Les distances sont de 22, 19, 25 et 16 km. Calculez la distance totale parcourue.",
    answer: "82 km",
    calculation: "Additionnez les quatre étapes entre les relais. 22 + 19 + 25 + 16 = 82 km.",
  },
  {
    id: 'log-101-maths-v003-02', theorySection: "1.2 Produits commerciaux et circuits commerciaux",
    prompt: "Dans une reconstitution de circuit commercial, un bateau met 12 jours pour aller au marché, 3 jours pour échanger les marchandises et 15 jours pour revenir. Quelle est la durée du circuit complet ?",
    answer: "30 jours",
    calculation: "Comptez l’aller, le temps d’échange au marché et le retour. 12 + 3 + 15 = 30 jours.",
  },
  { id: 'log-101-maths-v003-03', theorySection: "1.4 L’évolution de l’informatique" },
  {
    id: 'log-101-maths-v003-04', theorySection: "1.1.1 La logistique en temps de guerre",
    prompt: "Dans un exemple fictif de ravitaillement à l’époque de Napoléon, un convoi de vivres progresse de 18 km par jour. Le dépôt à servir est à 95 km. Combien de jours faut-il prévoir en comptant tout jour commencé ?",
    answer: "6 jours",
    calculation: "En cinq jours, le convoi couvre 5 × 18 = 90 km. Les 5 km restants demandent un sixième jour.",
  },
  {
    id: 'log-101-maths-v003-05', theorySection: "Coordonner les modes et les sites",
    prompt: "Un port compare deux périodes de même durée, avant et après la mise en place d’un transfert rail–bateau. Le volume manutentionné dans cet exemple passe de 450 à 540 t. Calculez le rapport nouveau sur ancien et la hausse relative.",
    answer: "Rapport 1,2 et hausse de 20 %",
    calculation: "540 ÷ 450 = 1,2. Rapportée à la période de départ, la hausse est (540 − 450) ÷ 450 × 100 = 20 %.",
  },
  // 102
  { id: 'log-102-maths-v003-01', theorySection: "2.3 Chaîne de processus logistique" },
  { id: 'log-102-maths-v003-02', theorySection: "2.3 Chaîne de processus logistique" },
  { id: 'log-102-maths-v003-03', theorySection: "2.4 Gestion de la chaîne d'approvisionnement (SCM)" },
  { id: 'log-102-maths-v003-04', theorySection: "2.3 Chaîne de processus logistique" },
  {
    id: 'log-102-maths-v003-05', theorySection: "2.4 Gestion de la chaîne d'approvisionnement (SCM)",
    prompt: "Pour transmettre une commande au transporteur, le fournisseur doit indiquer les unités de transport. Pour 2 680 pièces, il remplit d’abord des palettes de 240 pièces, puis des cartons de 40 pièces. Que doit-il annoncer ?",
    answer: "11 palettes et 1 carton",
    calculation: "Les 11 palettes pleines couvrent 11 × 240 = 2 640 pièces. Il reste 40 pièces, soit un carton à annoncer.",
  },
  // 103
  { id: 'log-103-maths-v003-01', theorySection: "3.2.1 Objectif" },
  { id: 'log-103-maths-v003-02', theorySection: "3.2.1 Objectif" },
  { id: 'log-103-maths-v003-03', theorySection: "3.2.1 Objectif" },
  {
    id: 'log-103-maths-v003-04', theorySection: "3.2.1 Objectif",
    prompt: "Pour vérifier le critère du bon coût, comparez deux tournées. Une tournée de 90 km coûte CHF 54 de carburant. Estimez le coût du parcours de 75 km avec le même coût kilométrique.",
    answer: "CHF 45",
    calculation: "Le coût par kilomètre est de 54 ÷ 90 = CHF 0,60. Pour 75 km, 75 × 0,60 = CHF 45.",
  },
  { id: 'log-103-maths-v003-05', theorySection: "3.2.1 Objectif" },
  // 104
  { id: 'log-104-maths-v003-01', theorySection: "4.2 Production" },
  { id: 'log-104-maths-v003-02', theorySection: "4.3 Distribution" },
  { id: 'log-104-maths-v003-03', theorySection: "4.2 Production" },
  { id: 'log-104-maths-v003-04', theorySection: "4.5.2 TTS — Transbordement (manutention)" },
  { id: 'log-104-maths-v003-05', theorySection: "4.6.2 Flux de marchandises — Producteur" },
  // 105
  { id: 'log-105-maths-v003-01', theorySection: "5.1 Caractéristiques et manipulation des marchandises" },
  { id: 'log-105-maths-v003-02', theorySection: "5.3 Les critères d'aptitude au stockage des marchandises" },
  { id: 'log-105-maths-v003-03', theorySection: "5.5.2 La température de stockage" },
  { id: 'log-105-maths-v003-04', theorySection: "5.6 La protection des marchandises stockées" },
  { id: 'log-105-maths-v003-05', theorySection: "5.1 Caractéristiques et manipulation des marchandises" },
  // 106
  { id: 'log-106-maths-v003-01', theorySection: "6.6 L'élimination dans les entreprises de logistique" },
  { id: 'log-106-maths-v003-02', theorySection: "6.4.3 Le recyclage" },
  { id: 'log-106-maths-v003-03', theorySection: "6.6 L'élimination dans les entreprises de logistique" },
  {
    id: 'log-106-maths-v003-04', theorySection: "6.6 L'élimination dans les entreprises de logistique",
    prompt: "Le plan de tri prévoit 12 emplacements avec un bac par emplacement. Huit bacs occupent déjà la zone et deux sont prêts à être installés. Après les avoir installés, combien de bacs supplémentaires restent à prévoir ?",
    answer: "2 bacs",
    calculation: "Après l’installation, 8 + 2 = 10 emplacements sont équipés. Il en reste 12 − 10 = 2.",
  },
  { id: 'log-106-maths-v003-05', theorySection: "6.3 Flux de matières dans la gestion des déchets" },
  // 107
  { id: 'log-107-maths-v003-01', theorySection: "7.1 L'inventaire des déchets (sélection)" },
  {
    id: 'log-107-maths-v003-02', theorySection: "7.4 Élimination des déchets spéciaux",
    prompt: "La filière autorisée reprend 18 contenants identifiés, par lots de 7 au maximum selon l’accord de collecte. Combien de passages faut-il planifier ?",
    answer: "3 passages",
    calculation: "Deux passages couvrent 2 × 7 = 14 contenants. Les quatre restants nécessitent un troisième passage.",
  },
  { id: 'log-107-maths-v003-03', theorySection: "7.1 L'inventaire des déchets (sélection)" },
  { id: 'log-107-maths-v003-04', theorySection: "7.3.4 Sept précautions élémentaires" },
  { id: 'log-107-maths-v003-05', theorySection: "7.4 Élimination des déchets spéciaux" },
  // 108
  { id: 'log-108-maths-v003-01', theorySection: "8.1.4 ISO 20121 — grandes manifestations" },
  { id: 'log-108-maths-v003-02', theorySection: "8.1.4 ISO 20121 — grandes manifestations" },
  {
    id: 'log-108-maths-v003-03', theorySection: "8.1.1 Contenu d'un SME",
    prompt: "Pour établir le bilan des déchets d’une manifestation, vous relevez les masses nettes des quatre zones de tri : 24, 38, 17 et 21 kg. Quelle masse totale inscrire au bilan ?",
    answer: "100 kg",
    calculation: "Les quatre relevés portent sur des zones distinctes et utilisent la même unité. 24 + 38 + 17 + 21 = 100 kg.",
  },
  {
    id: 'log-108-maths-v003-04', theorySection: "8.2.8 Déchets plastiques",
    prompt: "Lors d’un relevé des films plastiques échappés à la collecte, l’équipe retrouve 32 kg au premier point et 48 kg au second. Quelle fraction du total a été retrouvée au premier point ? Simplifiez-la.",
    answer: "2/5 du total",
    calculation: "Le total retrouvé aux deux points est 32 + 48 = 80 kg. La part du premier point est 32/80 = 2/5.",
  },
  { id: 'log-108-maths-v003-05', theorySection: "8.1.4 ISO 20121 — grandes manifestations" },
  // 109
  {
    id: 'log-109-maths-v003-01', theorySection: "9.1 Autorisation d'accès",
    prompt: "Neuf personnes sont autorisées à consulter le dossier. Deux changent de service et perdent ce droit. Une nouvelle personne reçoit l’autorisation. Combien d’autorisations doivent rester actives ?",
    answer: "8 autorisations",
    calculation: "Retirez les deux droits qui ne correspondent plus à la tâche et ajoutez le nouveau droit. 9 − 2 + 1 = 8.",
  },
  {
    id: 'log-109-maths-v003-02', theorySection: "9.3 Secret postal",
    prompt: "Sur 18 colis préparés pour un retrait, 4 demandes sont faites par un tiers sans autorisation et 3 autres présentent une référence incohérente. Ces demandes sont distinctes. Combien de remises peuvent continuer si tous les autres contrôles sont satisfaits ?",
    answer: "11 remises",
    calculation: "Écartez les 4 demandes sans autorisation et les 3 dossiers incohérents. Il reste 18 − 4 − 3 = 11 remises.",
  },
  {
    id: 'log-109-maths-v003-03', theorySection: "9.4 Secret des affaires",
    prompt: "Une équipe autorisée à traiter les retours a besoin de 12 des 84 documents d’un dossier commercial. La procédure prévoit de partager uniquement les pièces nécessaires. Combien de documents faut-il laisser hors du dossier partagé ?",
    answer: "72 documents",
    calculation: "Le dossier partagé comporte les 12 documents nécessaires. Les 84 − 12 = 72 autres restent hors du partage.",
  },
  {
    id: 'log-109-maths-v003-04', theorySection: "9.1 Autorisation d'accès",
    prompt: "Le registre contient 100 tentatives d’accès à la zone réservée. L’équipe en a confirmé 72 comme autorisées et 9 comme refusées. Combien de tentatives restent à vérifier ?",
    answer: "19 tentatives",
    calculation: "Les tentatives étudiées sont 72 + 9 = 81. Il en reste 100 − 81 = 19 à vérifier.",
  },
  { id: 'log-109-maths-v003-05', theorySection: "9.5 Sécurité des données" },
  // 110
  { id: 'log-110-maths-v003-01', theorySection: "10.4.2 Données de mouvement (Transaction Data) — dynamiques" },
  { id: 'log-110-maths-v003-02', theorySection: "10.4.1 Données de base (Master Data) — statiques" },
  { id: 'log-110-maths-v003-03', theorySection: "10.4.2 Données de mouvement (Transaction Data) — dynamiques" },
  {
    id: 'log-110-maths-v003-04', theorySection: "10.6 Indicateurs (KPI)",
    prompt: "L’indicateur du quai est le nombre de commandes traitées par heure. Le quai en traite 48 en 3 h. Calculez l’indicateur et estimez le temps nécessaire pour 32 commandes à la même cadence.",
    answer: "16 commandes/h et 2 h",
    calculation: "La cadence vaut 48 ÷ 3 = 16 commandes/h. Pour 32 commandes à ce rythme, comptez 32 ÷ 16 = 2 h.",
  },
  { id: 'log-110-maths-v003-05', theorySection: "10.6 Indicateurs (KPI)" },
  // 201
  { id: 'log-201-maths-v003-01', theorySection: "1.3 Le client fidèle" },
  {
    id: 'log-201-maths-v003-02', theorySection: "1.4 Les entreprises doivent connaître leurs clients",
    prompt: "Le service contacte 36 clients pour confirmer leur besoin de livraison. Dix confirment le matin et 17 l’après-midi. Les groupes sont distincts. Combien de besoins restent à confirmer avant de fixer les créneaux ?",
    answer: "9 besoins",
    calculation: "Il y a 10 + 17 = 27 confirmations. Le service doit encore clarifier 36 − 27 = 9 besoins.",
  },
  { id: 'log-201-maths-v003-03', theorySection: "1.1 L'importance du client" },
  {
    id: 'log-201-maths-v003-04', theorySection: "1.1 L'importance du client",
    prompt: "Trois clients ont commandé respectivement 2, 5 et 3 cartons pleins. Les deux premiers reçoivent leur commande entière et le dernier n’en reçoit que 2. Combien de cartons pleins ont été remis et combien restent dus ?",
    answer: "9 cartons remis, 1 carton dû",
    calculation: "Il était prévu de remettre 2 + 5 + 3 = 10 cartons. Les clients en ont reçu 2 + 5 + 2 = 9. Il en reste 10 − 9 = 1 à remettre.",
  },
  {
    id: 'log-201-maths-v003-05', theorySection: "1.1 L'importance du client",
    prompt: "Un client régulier effectue trois achats de CHF 180, 240 et 390. Il règle immédiatement les deux premiers. Sur le dernier, il verse un acompte de CHF 90. Calculez le chiffre d’affaires de ces ventes, le montant encaissé et le reste à encaisser.",
    answer: "CHF 810 de ventes, CHF 510 encaissés, CHF 300 à encaisser",
    calculation: "Les ventes totalisent 180 + 240 + 390 = CHF 810. Le client règle 180 + 240 + 90 = CHF 510. Il reste 810 − 510 = CHF 300 à encaisser.",
  },
  // 202
  { id: 'log-202-maths-v003-01', theorySection: "2.3 Mes vêtements" },
  {
    id: 'log-202-maths-v003-02', theorySection: "2.4 Mon hygiène",
    prompt: "Trois groupes vont visiter une zone à règles d’hygiène. Chaque groupe a besoin de 4 min pour les contrôles d’entrée et de 21 min pour la visite. Il faut 5 min de remise en état entre deux groupes. Quelle durée réserver ?",
    answer: "85 min",
    calculation: "Comptez trois visites avec contrôles et deux intervalles. 3 × (4 + 21) + 2 × 5 = 85 min.",
  },
  { id: 'log-202-maths-v003-03', theorySection: "2.4.2 Hygiène personnelle" },
  { id: 'log-202-maths-v003-04', theorySection: "2.5 La charte d'entreprise" },
  {
    id: 'log-202-maths-v003-05', theorySection: "2.4.2 Hygiène personnelle",
    prompt: "Sur 48 contrôles avant l’entrée en zone alimentaire, 6 signalent une tenue souillée, 4 un oubli de lavage des mains et 2 les deux écarts. Combien de contrôles signalent au moins un écart ? Donnez aussi la part en pour cent.",
    answer: "8 contrôles, soit environ 16,7 %",
    calculation: "Retirez le double comptage. 6 + 4 − 2 = 8 contrôles en écart. La part vaut 8 ÷ 48 × 100 ≈ 16,7 %.",
  },
  // 203
  {
    id: 'log-203-maths-v003-01', theorySection: "3.5 Défi intellectuel — le stress",
    prompt: "Vous répartissez 52 contrôles sur quatre plages de même durée afin de limiter la pression en fin de service. Quel objectif fixer par plage pour répartir la charge régulièrement ?",
    answer: "13 contrôles par plage",
    calculation: "Répartissez la charge sur les quatre plages. 52 ÷ 4 = 13 contrôles par plage.",
  },
  {
    id: 'log-203-maths-v003-02', theorySection: "3.2.3 Coopératif (codécision)",
    prompt: "Lors d’une répartition décidée ensemble, deux collègues ont 38 et 24 contrôles de même durée. Combien le premier doit-il en transmettre au second pour équilibrer leurs charges ?",
    answer: "7 contrôles",
    calculation: "La charge totale est 38 + 24 = 62, soit 31 par personne. Le premier transmet 38 − 31 = 7 contrôles.",
  },
  {
    id: 'log-203-maths-v003-03', theorySection: "3.4 Six étapes de gestion des conflits",
    prompt: "Après un désaccord, six collègues disposent de 2 min chacun pour présenter leur point de vue. La recherche d’un accord prend ensuite 15 min. Quelle durée totale prévoir pour ces deux étapes ?",
    answer: "27 min",
    calculation: "Le tour de parole prend 6 × 2 = 12 min. Avec la recherche d’un accord, comptez 12 + 15 = 27 min.",
  },
  {
    id: 'log-203-maths-v003-04', theorySection: "3.5.2 Distress (disstress)",
    prompt: "Sous pression, vous replannifiez un poste de 6 h. Un imprévu prend 35 min et les contrôles avant reprise prennent 25 min. Combien de temps reste-t-il pour les tâches initiales ?",
    answer: "5 h",
    calculation: "Convertissez les 6 h en 360 min. Il reste 360 − 35 − 25 = 300 min, soit 5 h.",
  },
  {
    id: 'log-203-maths-v003-05', theorySection: "3.2.3 Coopératif (codécision)",
    prompt: "L’équipe décide ensemble de répartir une tâche de 132 minutes de travail. Deux personnes y consacrent chacune 40 minutes le matin sur des parties différentes. Quel temps de travail reste à attribuer à la personne disponible l’après-midi ?",
    answer: "52 min",
    calculation: "Deux personnes apportent 2 × 40 = 80 minutes de travail. La tâche demande encore 132 − 80 = 52 minutes.",
  },
  // 204
  { id: 'log-204-maths-v003-01', theorySection: "4.1.2 Quels résultats ?" },
  { id: 'log-204-maths-v003-02', theorySection: "4.3 Taille d'un marché" },
  { id: 'log-204-maths-v003-03', theorySection: "4.2.2 Formes de marché (offre / demande)" },
  { id: 'log-204-maths-v003-04', theorySection: "4.3 Taille d'un marché" },
  { id: 'log-204-maths-v003-05', theorySection: "4.3 Taille d'un marché" },
  // 205
  { id: 'log-205-maths-v003-01', theorySection: "5.3 La loi de l'offre et de la demande" },
  { id: 'log-205-maths-v003-02', theorySection: "Promotion (Publicité)" },
  { id: 'log-205-maths-v003-03', theorySection: "Promotion (Publicité)" },
  {
    id: 'log-205-maths-v003-04', theorySection: "5.5.2 Le concept AIDA",
    prompt: "Sur 80 personnes qui remarquent une publicité, 32 consultent l’offre détaillée et 12 de ces 32 réservent un bac. Quelle part des personnes qui consultent l’offre passe à l’action ?",
    answer: "37,5 %",
    calculation: "L’étape Action correspond à la réservation. Sur les 32 personnes qui consultent l’offre, 12 réservent. 12 ÷ 32 × 100 = 37,5 %.",
  },
  { id: 'log-205-maths-v003-05', theorySection: "5.1 Objectifs du marketing" },
  // 206
  {
    id: 'log-206-maths-v003-01', theorySection: "6.2.2 Le feedback aide tout le monde",
    prompt: "Sur quatre tournées, le quai transmet un changement de créneau à sept chauffeurs par tournée. Vingt-quatre chauffeurs distincts confirment le nouveau créneau. Combien de confirmations restent à obtenir ?",
    answer: "4 confirmations",
    calculation: "Le changement est envoyé à 4 × 7 = 28 chauffeurs. Le retour de 24 chauffeurs laisse 28 − 24 = 4 confirmations attendues.",
  },
  { id: 'log-206-maths-v003-02', theorySection: "6.1 Moyens de communication" },
  {
    id: 'log-206-maths-v003-03', theorySection: "6.2.2 Le feedback aide tout le monde",
    prompt: "Le quai envoie un changement de créneau à 13 h 42 et reçoit une reformulation du chauffeur à 14 h 16. La procédure de ce site prévoit une réponse dans les 30 min. Vérifiez l’écart au délai.",
    answer: "Réponse après 34 min, soit 4 min de retard",
    calculation: "Entre 13 h 42 et 14 h 16, il s’écoule 18 + 16 = 34 min. L’écart au délai est 34 − 30 = 4 min.",
  },
  { id: 'log-206-maths-v003-04', theorySection: "6.5.3 Mettre fin aux conversations" },
  { id: 'log-206-maths-v003-05', theorySection: "6.1 Moyens de communication" },
  // 207
  { id: 'log-207-maths-v003-01', theorySection: "7.1 Les besoins" },
  { id: 'log-207-maths-v003-02', theorySection: "7.1 Les besoins" },
  {
    id: 'log-207-maths-v003-03', theorySection: "7.1 Les besoins",
    prompt: "Un client veut garder 5 cm libres à chaque extrémité d’un article de 46 cm pour y placer des protections. Un bac offre 54 cm de longueur utile. Quelle longueur utile faut-il conseiller et de combien ce bac est-il trop court ?",
    answer: "56 cm nécessaires, manque de 2 cm",
    calculation: "Additionnez la longueur de l’article et les deux protections. 46 + 2 × 5 = 56 cm. Le bac est trop court de 56 − 54 = 2 cm.",
  },
  { id: 'log-207-maths-v003-04', theorySection: "7.3 Motifs d'achat" },
  { id: 'log-207-maths-v003-05', theorySection: "7.4 Les évaluations des fournisseurs" },
  // 208
  {
    id: 'log-208-maths-v003-01', theorySection: "8.6.1 Vente additionnelle (cross-selling)",
    prompt: "Le client achète 12 caisses. Le vendeur propose un couvercle adapté à celles qui seront stockées dehors. Le client en choisit pour 9 caisses. Chaque couvercle coûte CHF 4. Quel montant la vente additionnelle représente-t-elle ?",
    answer: "CHF 36",
    calculation: "Seuls les 9 couvercles choisis s’ajoutent à l’achat des caisses. 9 × 4 = CHF 36.",
  },
  { id: 'log-208-maths-v003-02', theorySection: "8.7 Le contrat de vente : droits et obligations" },
  { id: 'log-208-maths-v003-03', theorySection: "8.8 Conditions générales de vente (CGV)" },
  { id: 'log-208-maths-v003-04', theorySection: "8.1.2 Timbres de rabais, points, coupons : la collecte" },
  { id: 'log-208-maths-v003-05', theorySection: "8.3 L'entretien de vente" },
  // 209
  { id: 'log-209-maths-v003-01', theorySection: "9.2 Le service à la clientèle" },
  { id: 'log-209-maths-v003-02', theorySection: "9.1 Réclamations" },
  {
    id: 'log-209-maths-v003-03', theorySection: "9.1 Réclamations",
    prompt: "Une réclamation est prise en charge à 10 h 18. Vérifier le bon de livraison prend 15 min, obtenir le constat du quai 20 min, puis préparer la réponse 10 min. À quelle heure le SAV peut-il envoyer sa réponse si les étapes s’enchaînent ?",
    answer: "11 h 03",
    calculation: "Le traitement dure 15 + 20 + 10 = 45 min. Une prise en charge à 10 h 18 mène à 11 h 03.",
  },
  { id: 'log-209-maths-v003-04', theorySection: "9.3 Tolérance / bonne volonté (geste commercial)" },
  {
    id: 'log-209-maths-v003-05', theorySection: "9.2 Le service à la clientèle",
    prompt: "Pour suivre la qualité de service, le SAV relève le délai de résolution de chaque réclamation. Sur 30 dossiers, 18 sont résolus chacun en 2 jours et 12 chacun en 5 jours. Calculez le délai moyen au dixième de jour.",
    answer: "3,2 jours",
    calculation: "Pesez chaque délai par son nombre de dossiers. (18 × 2 + 12 × 5) ÷ 30 = 96 ÷ 30 = 3,2 jours.",
  },
] satisfies readonly MathReview[]
