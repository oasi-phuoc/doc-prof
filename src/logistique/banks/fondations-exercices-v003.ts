import type { LogistiqueUnit } from '../approved-banks'

const revision = 'fondations-exercices-v003'
const commun = ['CFC', 'AFP'] as const
const cfc = ['CFC'] as const

export const foundationExercises = [
  // 100 — Introduction aux modules
  {
    id: 'log-100-maths-v003-01', module: '100', kind: 'maths', revision, approvedFor: commun,
    prompt: "Sur 90 minutes au dépôt-école, vous passez un tiers à la réception, puis un quart du temps initial à la préparation. Combien de minutes restent pour l’expédition ?",
    answer: "37,5 min",
    calculation: "90 − (90 ÷ 3) − (90 ÷ 4) = 37,5.",
  },
  {
    id: 'log-100-maths-v003-02', module: '100', kind: 'maths', revision, approvedFor: commun,
    prompt: "Le poste d’expédition doit préparer 18 colis et dispose de 15 étiquettes. Une étiquette est nécessaire par colis. Combien en manque-t-il ?",
    answer: "3 étiquettes",
    calculation: "18 − 15 = 3.",
  },
  {
    id: 'log-100-maths-v003-03', module: '100', kind: 'maths', revision, approvedFor: commun,
    prompt: "Vous faites 5 exercices. Les durées sont 4, 8, 5, 6 et 7 minutes. Quelle durée moyenne faut-il prévoir par exercice ?",
    answer: "6 min",
    calculation: "(4 + 8 + 5 + 6 + 7) ÷ 5 = 6.",
  },
  {
    id: 'log-100-maths-v003-04', module: '100', kind: 'maths', revision, approvedFor: commun,
    prompt: "Sur une fiche de suivi, vous cochez 3 objectifs sur 5. Donnez la fraction et le pourcentage correspondant.",
    answer: "3/5, soit 60 %",
    calculation: "3 ÷ 5 × 100 = 60.",
  },
  {
    id: 'log-100-maths-v003-05', module: '100', kind: 'maths', revision, approvedFor: cfc,
    prompt: "Vous prévoyez 12 % de réserve sur 50 min de travail, puis une pause fixe de 5 min. Quel créneau total réserver ?",
    answer: "61 min",
    calculation: "50 + 50 × 0,12 + 5 = 61.",
  },
  {
    id: 'log-100-verification-v003-01', module: '100', kind: 'verification', revision, approvedFor: commun,
    prompt: "Pourquoi relever l’heure et l’emplacement lors d’un transfert de marchandise ?",
    answer: "Pour retrouver le mouvement, contrôler la mise à jour et chercher l’origine d’un écart.",
  },
  {
    id: 'log-100-verification-v003-02', module: '100', kind: 'verification', revision, approvedFor: commun,
    prompt: "Vous vous trompez deux fois en convertissant des unités de masse. Quel type de fiche choisir pour retravailler le geste et contrôler le résultat ?",
    answer: "Une fiche Mathématiques dont le thème comporte des unités de masse, à reprendre avec le corrigé.",
  },
  {
    id: 'log-100-verification-v003-03', module: '100', kind: 'verification', revision, approvedFor: commun,
    prompt: "Quelle différence y a-t-il entre une référence article et un emplacement ?",
    answer: "La référence identifie l’article. L’emplacement indique où il est rangé.",
  },
  {
    id: 'log-100-verification-v003-04', module: '100', kind: 'verification', revision, approvedFor: commun,
    prompt: "Que pouvez-vous préparer avant un premier travail sur un terme que vous ne connaissez pas ?",
    answer: "Relever le mot dans le glossaire et chercher un exemple de son emploi dans la théorie.",
  },
  {
    id: 'log-100-verification-v003-05', module: '100', kind: 'verification', revision, approvedFor: commun,
    prompt: "Pourquoi vérifier le code du module et le diplôme avant de préparer une fiche ?",
    answer: "Pour travailler sur le bon contenu et utiliser les exercices prévus pour la formation.",
  },
  {
    id: 'log-100-situation-v003-01', module: '100', kind: 'situation', revision, approvedFor: commun,
    prompt: "Vous accompagnez un collègue à la réception de dix bacs. Le bon annonce le lot V3, mais deux bacs portent V8. Décrivez le contrôle et la suite avant le rangement.",
    answer: "Contrôler le bon et les étiquettes, séparer les deux bacs, consigner références et quantités, puis demander la décision de la personne responsable.",
  },
  {
    id: 'log-100-situation-v003-02', module: '100', kind: 'situation', revision, approvedFor: commun,
    prompt: "Après un exercice, votre total est juste mais votre unité est fausse. Comment reprendre ce travail pour éviter le même écart au dépôt ?",
    answer: "Relever l’unité attendue, écrire les conversions avec leurs unités, refaire le calcul et comparer le résultat à un ordre de grandeur réel.",
  },
  {
    id: 'log-100-situation-v003-03', module: '100', kind: 'situation', revision, approvedFor: commun,
    prompt: "En tournée de découverte, l’opérateur scanne un colis puis l’amène dans la zone de départ. Que notez-vous pour expliquer les deux flux à la classe ?",
    answer: "Relever le trajet physique du colis et les données enregistrées au scan, notamment son identifiant, la zone et le statut si visible.",
  },
  {
    id: 'log-100-situation-v003-04', module: '100', kind: 'situation', revision, approvedFor: cfc,
    prompt: "À la fin du stage de découverte, vous devez justifier deux compétences acquises. Chaque compétence doit être liée à une trace autorisée. Comment préparez-vous votre bilan ?",
    answer: "Choisir deux tâches distinctes, décrire le geste et son résultat, sélectionner des traces autorisées sans données inutiles, et les rattacher au module correspondant.",
  },

  // 101 — Histoire de la logistique
  {
    id: 'log-101-maths-v003-01', module: '101', kind: 'maths', revision, approvedFor: commun,
    prompt: "Dans un exemple historique, une caravane effectue quatre étapes de 22, 19, 25 et 16 km. Calculez la distance totale.",
    answer: "82 km",
    calculation: "22 + 19 + 25 + 16 = 82.",
  },
  {
    id: 'log-101-maths-v003-02', module: '101', kind: 'maths', revision, approvedFor: commun,
    prompt: "Un document pédagogique indique une traversée de 12 jours à l’aller et de 15 jours au retour. Ajoutez 3 jours pour échanger les marchandises. Quelle est la durée du cycle ?",
    answer: "30 jours",
    calculation: "12 + 15 + 3 = 30.",
  },
  {
    id: 'log-101-maths-v003-03', module: '101', kind: 'maths', revision, approvedFor: commun,
    prompt: "Un atelier compare 60 colis traités manuellement en 30 min et les mêmes colis traités avec un lecteur en 12 min. Quel temps gagne-t-il par colis ?",
    answer: "18 s par colis",
    calculation: "(30 − 12) ÷ 60 = 0,3 min. 0,3 × 60 = 18 s.",
  },
  {
    id: 'log-101-maths-v003-04', module: '101', kind: 'maths', revision, approvedFor: commun,
    prompt: "Un exemple de transport ancien avance de 18 km par jour. Le trajet fait 95 km. Combien de jours de marche faut-il, en comptant tout jour commencé ?",
    answer: "6 jours",
    calculation: "95 ÷ 18 ≈ 5,28. Il faut un 6e jour.",
  },
  {
    id: 'log-101-maths-v003-05', module: '101', kind: 'maths', revision, approvedFor: cfc,
    prompt: "Un quai traite 450 t pendant une période, puis 540 t sur une période de même durée. Calculez le rapport des volumes et leur hausse relative.",
    answer: "Rapport 1,2 et hausse de 20 %",
    calculation: "540 ÷ 450 = 1,2. (1,2 − 1) × 100 = 20 %.",
  },
  {
    id: 'log-101-verification-v003-01', module: '101', kind: 'verification', revision, approvedFor: commun,
    prompt: "Pourquoi la conservation des denrées était-elle utile sur un circuit commercial de plusieurs jours ?",
    answer: "Elle retardait leur dégradation et permettait d’arriver avec des marchandises utilisables ou vendables.",
  },
  {
    id: 'log-101-verification-v003-02', module: '101', kind: 'verification', revision, approvedFor: commun,
    prompt: "Quel avantage apporte un conteneur normalisé lors du passage du bateau au train ?",
    answer: "L’unité peut être transbordée avec du matériel compatible, sans vider chaque colis à l’interface.",
  },
  {
    id: 'log-101-verification-v003-03', module: '101', kind: 'verification', revision, approvedFor: commun,
    prompt: "Qu’apporte l’usage répété d’une palette de format compatible à un entrepôt qui reçoit plusieurs fournisseurs ?",
    answer: "Le matériel de manutention et les emplacements peuvent être préparés pour des unités de dimensions connues.",
  },
  {
    id: 'log-101-verification-v003-04', module: '101', kind: 'verification', revision, approvedFor: commun,
    prompt: "Dans une chaîne simplifiée, à quelle étape rattacher le choix et l’achat des matières premières ?",
    answer: "À l’approvisionnement.",
  },
  {
    id: 'log-101-verification-v003-05', module: '101', kind: 'verification', revision, approvedFor: commun,
    prompt: "Pourquoi conserver la date et le lieu avec un exemple historique ?",
    answer: "Cela situe l’événement et évite d’en faire une règle valable à toutes les époques et dans tous les pays.",
  },
  {
    id: 'log-101-situation-v003-01', module: '101', kind: 'situation', revision, approvedFor: commun,
    prompt: "Vous expliquez une route commerciale ancienne au moyen de trois arrêts. Associez une tâche logistique à chaque arrêt et indiquez où un retard peut apparaître.",
    answer: "Par exemple réunir les articles au départ, les transborder à un relais, puis les répartir à destination. L’attente d’un autre véhicule au relais peut créer un retard.",
  },
  {
    id: 'log-101-situation-v003-02', module: '101', kind: 'situation', revision, approvedFor: commun,
    prompt: "Au cours d’une démonstration, des visiteurs doivent déplacer le même lot de quatre caisses séparément puis sur une palette. Quels résultats comparez-vous ?",
    answer: "Mesurer le nombre de prises, le temps, les dommages éventuels et la stabilité pour le même lot, dans les mêmes conditions.",
  },
  {
    id: 'log-101-situation-v003-03', module: '101', kind: 'situation', revision, approvedFor: commun,
    prompt: "Une fiche de musée associe un conteneur à un seul mode de transport. Reformulez la légende pour expliquer ce que l’objet change dans le parcours.",
    answer: "Le conteneur normalisé reste la même unité lors du passage entre modes compatibles. Le véhicule change au point de transbordement.",
  },
  {
    id: 'log-101-situation-v003-04', module: '101', kind: 'situation', revision, approvedFor: cfc,
    prompt: "Vous comparez un registre papier de stock à un registre numérique pour une exposition. Proposez une démonstration avec un mouvement réel et une correction.",
    answer: "Enregistrer la même entrée avec la référence et l’heure sur les deux supports, simuler une différence et montrer comment retrouver le mouvement et garder une trace de la correction.",
  },

  // 102 — Structure de la logistique
  {
    id: 'log-102-maths-v003-01', module: '102', kind: 'maths', revision, approvedFor: commun,
    prompt: "Un atelier consomme 55 unités par jour. Le magasin dispose de 110 unités libres. Pour combien de jours peut-il couvrir l’atelier ?",
    answer: "2 jours",
    calculation: "110 ÷ 55 = 2.",
  },
  {
    id: 'log-102-maths-v003-02', module: '102', kind: 'maths', revision, approvedFor: commun,
    prompt: "Un transbordement prend 12 min de déchargement, 9 min de contrôle et 16 min de rechargement. À quelle heure finit-il s’il commence à 10 h 48 ?",
    answer: "11 h 25",
    calculation: "12 + 9 + 16 = 37 min. 10 h 48 + 37 min = 11 h 25.",
  },
  {
    id: 'log-102-maths-v003-03', module: '102', kind: 'maths', revision, approvedFor: commun,
    prompt: "Une chaîne prévoit 120 expéditions par jour. La préparation en réalise 105 et le quai peut en traiter 130. Combien peuvent partir et combien restent à préparer ?",
    answer: "105 départs, 15 expéditions à préparer",
    calculation: "Le minimum entre 120, 105 et 130 est 105. 120 − 105 = 15.",
  },
  {
    id: 'log-102-maths-v003-04', module: '102', kind: 'maths', revision, approvedFor: commun,
    prompt: "Un camion direct franchit 140 km. Une solution avec transbordement franchit 45 km puis 85 km. Comparez les seules distances routières de l’exercice.",
    answer: "140 km en direct, 130 km par le relais, écart de 10 km",
    calculation: "45 + 85 = 130. 140 − 130 = 10.",
  },
  {
    id: 'log-102-maths-v003-05', module: '102', kind: 'maths', revision, approvedFor: cfc,
    prompt: "Un fournisseur expédie 40 unités par carton ou 240 par palette. Pour 2 680 unités, vous remplissez les palettes en premier puis les cartons, sans reliquat. Combien d’unités de transport en résultent ?",
    answer: "11 palettes et 1 carton",
    calculation: "11 × 240 = 2 640. 2 680 − 2 640 = 40, soit un carton.",
  },
  {
    id: 'log-102-verification-v003-01', module: '102', kind: 'verification', revision, approvedFor: commun,
    prompt: "Quelle information permet à deux partenaires de vérifier qu’ils parlent du même lot à réception ?",
    answer: "Un identifiant commun de lot ou d’envoi, rapproché de la référence et du document associé.",
  },
  {
    id: 'log-102-verification-v003-02', module: '102', kind: 'verification', revision, approvedFor: commun,
    prompt: "Quel est le rôle d’un lieu de transbordement dans une chaîne avec plusieurs transporteurs ?",
    answer: "Il organise le passage de la marchandise entre les moyens de transport et permet d’enregistrer la remise.",
  },
  {
    id: 'log-102-verification-v003-03', module: '102', kind: 'verification', revision, approvedFor: commun,
    prompt: "Pourquoi l’expédition physique et la facturation doivent-elles se rapprocher ?",
    answer: "Pour facturer les quantités et références effectivement livrées ou traitées selon l’accord, et rechercher les écarts.",
  },
  {
    id: 'log-102-verification-v003-04', module: '102', kind: 'verification', revision, approvedFor: commun,
    prompt: "Donnez un exemple de flux d’informations qui remonte d’un client vers un fournisseur.",
    answer: "Par exemple une commande, un retour sur les quantités livrées ou une mesure de non-conformité.",
  },
  {
    id: 'log-102-verification-v003-05', module: '102', kind: 'verification', revision, approvedFor: commun,
    prompt: "Quelle différence faites-vous entre une interface physique et une interface de données ?",
    answer: "La première est le point de remise de la marchandise. La seconde permet l’échange ou la mise à jour des données requises.",
  },
  {
    id: 'log-102-situation-v003-01', module: '102', kind: 'situation', revision, approvedFor: commun,
    prompt: "Vous remettez des bacs à un transporteur et en reprenez des vides. Quels enregistrements distinguez-vous au quai ?",
    answer: "Enregistrer séparément les bacs sortants et entrants, leur état et leur quantité, et identifier le partenaire ainsi que la date de remise.",
  },
  {
    id: 'log-102-situation-v003-02', module: '102', kind: 'situation', revision, approvedFor: commun,
    prompt: "L’atelier modifie son ordre de fabrication, mais le magasin s’apprête à sortir l’ancien lot. Quelle coordination rétablit le flux ?",
    answer: "Vérifier l’ordre à jour, suspendre la sortie erronée, confirmer quantité et référence avec l’atelier, puis actualiser le prélèvement.",
  },
  {
    id: 'log-102-situation-v003-03', module: '102', kind: 'situation', revision, approvedFor: commun,
    prompt: "Un article part du fabricant, est stocké chez un distributeur et arrive chez un client. Choisissez une vérification à chacune des deux interfaces.",
    answer: "Contrôler la correspondance lot et quantité lors de l’entrée du distributeur, puis faire confirmer le bon colis et la remise au client.",
  },
  {
    id: 'log-102-situation-v003-04', module: '102', kind: 'situation', revision, approvedFor: cfc,
    prompt: "Deux dépôts d’une même chaîne veulent détenir chacun un stock de sécurité très élevé. Comment organiser une décision commune qui préserve les délais ?",
    answer: "Comparer demandes, délais et risques par dépôt, envisager une réserve mutualisée avec un délai de transfert vérifié, puis suivre les ruptures et les frais.",
  },

  // 103 — Tâches et objectifs
  {
    id: 'log-103-maths-v003-01', module: '103', kind: 'maths', revision, approvedFor: commun,
    prompt: "Votre équipe prélève 180 lignes en 3 heures. Calculez le nombre moyen de lignes par heure.",
    answer: "60 lignes/h",
    calculation: "180 ÷ 3 = 60.",
  },
  {
    id: 'log-103-maths-v003-02', module: '103', kind: 'maths', revision, approvedFor: commun,
    prompt: "Vous promettez 72 colis avant 16 h. À 15 h, 52 sont prêts et la cadence est de 16 colis par heure. Combien de colis manqueront si la cadence reste constante ?",
    answer: "4 colis",
    calculation: "52 + 16 = 68. 72 − 68 = 4.",
  },
  {
    id: 'log-103-maths-v003-03', module: '103', kind: 'maths', revision, approvedFor: commun,
    prompt: "Une livraison part à 06 h 45. Elle prend 1 h 20 de trajet et 25 min de déchargement. Le déchargement doit finir avant 09 h. Quelle marge reste-t-il ?",
    answer: "30 min",
    calculation: "06 h 45 + 1 h 20 + 25 min = 08 h 30. 09 h − 08 h 30 = 30 min.",
  },
  {
    id: 'log-103-maths-v003-04', module: '103', kind: 'maths', revision, approvedFor: commun,
    prompt: "Une tournée de 90 km coûte CHF 54 en carburant. Un autre trajet coûte le même montant par kilomètre et mesure 75 km. Calculez son coût estimé.",
    answer: "CHF 45",
    calculation: "54 ÷ 90 = 0,60 CHF/km. 75 × 0,60 = 45.",
  },
  {
    id: 'log-103-maths-v003-05', module: '103', kind: 'maths', revision, approvedFor: cfc,
    prompt: "Une option livre 48 commandes conformes en 6 h de travail, une autre 54 en 9 h. Calculez le rendement de chaque option sur ce seul critère.",
    answer: "8 et 6 commandes conformes par heure",
    calculation: "48 ÷ 6 = 8. 54 ÷ 9 = 6.",
  },
  {
    id: 'log-103-verification-v003-01', module: '103', kind: 'verification', revision, approvedFor: commun,
    prompt: "Quelle différence existe-t-il entre le délai promis et la durée interne de préparation ?",
    answer: "Le délai promis fixe l’échéance du client. La durée interne mesure une étape avant la remise.",
  },
  {
    id: 'log-103-verification-v003-02', module: '103', kind: 'verification', revision, approvedFor: commun,
    prompt: "Quel exemple illustre le critère du bon coût sans modifier la qualité ?",
    answer: "Regrouper deux livraisons compatibles en vérifiant que les délais, les quantités et la manutention convenus sont préservés.",
  },
  {
    id: 'log-103-verification-v003-03', module: '103', kind: 'verification', revision, approvedFor: commun,
    prompt: "Quel effet une consommation de place excessive peut-elle avoir sur l’efficience ?",
    answer: "Elle mobilise de la capacité, augmente les déplacements ou oblige à louer de l’espace pour la même tâche rendue.",
  },
  {
    id: 'log-103-verification-v003-04', module: '103', kind: 'verification', revision, approvedFor: commun,
    prompt: "Comment contrôler la bonne quantité si l’unité du bon est une caisse et celle du magasin une pièce ?",
    answer: "Vérifier le conditionnement, convertir dans une unité commune, puis comparer le total avec le besoin.",
  },
  {
    id: 'log-103-verification-v003-05', module: '103', kind: 'verification', revision, approvedFor: commun,
    prompt: "Quand peut-on dire qu’un indicateur de délai est exploitable ?",
    answer: "Lorsque le début, la fin, la période de mesure et le périmètre des opérations sont définis.",
  },
  {
    id: 'log-103-situation-v003-01', module: '103', kind: 'situation', revision, approvedFor: commun,
    prompt: "Un fournisseur livre à l’heure mais une partie du lot a été détériorée durant le trajet. Quels critères suivez-vous séparément ?",
    answer: "Suivre ponctualité et conformité du lot, identifier la partie endommagée, conserver les traces et signaler au responsable.",
  },
  {
    id: 'log-103-situation-v003-02', module: '103', kind: 'situation', revision, approvedFor: commun,
    prompt: "Pour tenir un délai, l’équipe expédie souvent des courses isolées et coûteuses. Proposez un changement et deux mesures pour le suivre.",
    answer: "Planifier des départs groupés avec une heure limite réaliste. Suivre par exemple coût par livraison et respect des créneaux.",
  },
  {
    id: 'log-103-situation-v003-03', module: '103', kind: 'situation', revision, approvedFor: commun,
    prompt: "Deux magasins se ressemblent et leurs colis sont parfois inversés. Quel contrôle de la règle des B faut-il renforcer ?",
    answer: "Vérifier ensemble destinataire et lieu avec l’identifiant de commande, le document de tournée et l’étiquette avant le départ.",
  },
  {
    id: 'log-103-situation-v003-04', module: '103', kind: 'situation', revision, approvedFor: cfc,
    prompt: "À production stable, vous observez une hausse du nombre de commandes préparées par heure et du nombre de retours. Comment jugez-vous l’amélioration ?",
    answer: "Comparer le nombre de commandes conformes par heure, le coût des retours, les volumes et les critères dans des périodes comparables. Ajuster le processus si la conformité se dégrade.",
  },

  // 104 — Flux de marchandises
  {
    id: 'log-104-maths-v003-01', module: '104', kind: 'maths', revision, approvedFor: commun,
    prompt: "Vous prélevez 24 composants pour 8 kits identiques. Combien de composants entrez-vous dans chaque kit ?",
    answer: "3 composants",
    calculation: "24 ÷ 8 = 3.",
  },
  {
    id: 'log-104-maths-v003-02', module: '104', kind: 'maths', revision, approvedFor: commun,
    prompt: "Le magasin dispose de 80 sacs réutilisables. Il en remet 32 à la distribution et en reçoit 21 de retour. Quel solde reste ?",
    answer: "69 sacs",
    calculation: "80 − 32 + 21 = 69.",
  },
  {
    id: 'log-104-maths-v003-03', module: '104', kind: 'maths', revision, approvedFor: commun,
    prompt: "Une livraison apporte 120 kg de matière. La transformation donne 99 kg de produit fini et le reste part au tri. Quelle masse rejoint le tri ?",
    answer: "21 kg",
    calculation: "120 − 99 = 21.",
  },
  {
    id: 'log-104-maths-v003-04', module: '104', kind: 'maths', revision, approvedFor: commun,
    prompt: "Un chariot peut porter au maximum quatre bacs identiques par voyage. Combien de voyages faut-il pour déplacer 19 bacs ?",
    answer: "5 voyages",
    calculation: "19 = 4 × 4 + 3. Le reste demande un voyage.",
  },
  {
    id: 'log-104-maths-v003-05', module: '104', kind: 'maths', revision, approvedFor: cfc,
    prompt: "On assemble 150 pièces finies qui contiennent chacune 0,24 kg de matière. Si 10 % de la matière introduite devient une chute, quelle masse introduire ?",
    answer: "40 kg",
    calculation: "150 × 0,24 = 36 kg de produit. 36 ÷ 0,90 = 40 kg.",
  },
  {
    id: 'log-104-verification-v003-01', module: '104', kind: 'verification', revision, approvedFor: commun,
    prompt: "Que devient une matière lorsqu’elle traverse l’étape de production d’un flux industriel ?",
    answer: "Elle est transformée, assemblée ou préparée pour devenir un produit utilisable à l’étape suivante.",
  },
  {
    id: 'log-104-verification-v003-02', module: '104', kind: 'verification', revision, approvedFor: commun,
    prompt: "Quel exemple montre un flux retour après distribution ?",
    answer: "Un client renvoie un article défectueux ou restitue un emballage réutilisable au distributeur.",
  },
  {
    id: 'log-104-verification-v003-03', module: '104', kind: 'verification', revision, approvedFor: commun,
    prompt: "Dans quel cas une étape de contrôle peut-elle retenir un lot avant le rangement ?",
    answer: "En cas de référence, quantité ou état non conforme, le temps d’examiner l’écart selon la procédure.",
  },
  {
    id: 'log-104-verification-v003-04', module: '104', kind: 'verification', revision, approvedFor: commun,
    prompt: "Pourquoi repérer les croisements entre prélèvement et retour d’emballages ?",
    answer: "Pour éviter l’encombrement, les confusions ou les conflits entre circulations.",
  },
  {
    id: 'log-104-verification-v003-05', module: '104', kind: 'verification', revision, approvedFor: commun,
    prompt: "Quelle information rattache une chute d’atelier au processus qui l’a produite ?",
    answer: "L’identification du poste, de l’ordre de fabrication, de la matière ou du lot, selon le suivi disponible.",
  },
  {
    id: 'log-104-situation-v003-01', module: '104', kind: 'situation', revision, approvedFor: commun,
    prompt: "Vous découvrez des bacs vides dans la zone des articles prêts à expédier. Comment réorganisez-vous les flux ?",
    answer: "Marquer une zone de retour distincte, définir le parcours des bacs et informer les équipes. Contrôler ensuite les écarts de rangement.",
  },
  {
    id: 'log-104-situation-v003-02', module: '104', kind: 'situation', revision, approvedFor: commun,
    prompt: "Dans une usine, un contrôleur doit isoler une série défectueuse avant la distribution. Où placez-vous le contrôle et quelles informations gardez-vous ?",
    answer: "Placer le contrôle à la fin de production avant la mise à disposition. Tracer quantité, lot, motif, date et destination de la série.",
  },
  {
    id: 'log-104-situation-v003-03', module: '104', kind: 'situation', revision, approvedFor: commun,
    prompt: "Deux livraisons se présentent pendant une sortie urgente. Comment éviter la confusion entre entrée et départ ?",
    answer: "Séparer les emplacements et documents, vérifier l’identification des unités avant chaque scan et coordonner l’usage du quai.",
  },
  {
    id: 'log-104-situation-v003-04', module: '104', kind: 'situation', revision, approvedFor: cfc,
    prompt: "Le nombre de palettes augmente alors que le volume fabriqué reste stable. Quelles mesures peuvent aider à expliquer l’écart ?",
    answer: "Comparer conditionnements, taux de remplissage, fractionnement des commandes et répartition des parcours sur le même périmètre.",
  },

  // 105 — Marchandises
  {
    id: 'log-105-maths-v003-01', module: '105', kind: 'maths', revision, approvedFor: commun,
    prompt: "Un bac contient 18 bouteilles qui pèsent chacune 0,42 kg. Le bac vide pèse 1,56 kg. Calculez la masse brute.",
    answer: "9,12 kg",
    calculation: "18 × 0,42 + 1,56 = 9,12.",
  },
  {
    id: 'log-105-maths-v003-02', module: '105', kind: 'maths', revision, approvedFor: commun,
    prompt: "Une caisse occupe 60 cm par 40 cm au sol. Quelle surface occupent huit caisses sans superposition ni espace entre elles ?",
    answer: "1,92 m²",
    calculation: "60 cm = 0,60 m et 40 cm = 0,40 m. 8 × 0,60 × 0,40 = 1,92 m².",
  },
  {
    id: 'log-105-maths-v003-03', module: '105', kind: 'maths', revision, approvedFor: commun,
    prompt: "Le thermomètre d’un compartiment indique 7 °C. Pour l’exercice, sa fiche produit annonce une limite de 5 °C. De combien la mesure dépasse-t-elle la limite ?",
    answer: "2 °C",
    calculation: "7 − 5 = 2.",
  },
  {
    id: 'log-105-maths-v003-04', module: '105', kind: 'maths', revision, approvedFor: commun,
    prompt: "Un lot de 32 articles fragiles prévoit un séparateur par groupe de 4 articles. Combien de séparateurs préparer pour le lot entier ?",
    answer: "8 séparateurs",
    calculation: "32 ÷ 4 = 8.",
  },
  {
    id: 'log-105-maths-v003-05', module: '105', kind: 'maths', revision, approvedFor: cfc,
    prompt: "Un liquide de masse volumique 1,2 kg/L est reçu dans quatre bidons de 15 L. Quelle masse de liquide ces bidons contiennent-ils au total ?",
    answer: "72 kg",
    calculation: "4 × 15 = 60 L. 60 × 1,2 = 72 kg.",
  },
  {
    id: 'log-105-verification-v003-01', module: '105', kind: 'verification', revision, approvedFor: commun,
    prompt: "Pourquoi relever la masse brute avant de choisir un outil de manutention ?",
    answer: "Elle comprend la marchandise et son emballage. Elle correspond à la charge effectivement déplacée.",
  },
  {
    id: 'log-105-verification-v003-02', module: '105', kind: 'verification', revision, approvedFor: commun,
    prompt: "Qu’indique le caractère hygroscopique d’une matière ?",
    answer: "La matière échange de l’humidité avec l’air et peut en absorber selon les conditions.",
  },
  {
    id: 'log-105-verification-v003-03', module: '105', kind: 'verification', revision, approvedFor: commun,
    prompt: "Que contrôlez-vous sur la fiche produit avant de choisir une zone à température contrôlée ?",
    answer: "La plage de température exigée, les autres conditions de stockage et les consignes du site en cas d’écart.",
  },
  {
    id: 'log-105-verification-v003-04', module: '105', kind: 'verification', revision, approvedFor: commun,
    prompt: "Pourquoi séparer un produit fini d’un produit en cours de transformation dans un dépôt ?",
    answer: "Ils ont des statuts et destinations différents. Le rangement et l’identification évitent de préparer le mauvais article.",
  },
  {
    id: 'log-105-verification-v003-05', module: '105', kind: 'verification', revision, approvedFor: commun,
    prompt: "Quelle donnée vérifiez-vous avant d’empiler des unités emballées ?",
    answer: "La limite d’empilage ou de charge prévue, l’état des emballages et la stabilité de la pile.",
  },
  {
    id: 'log-105-situation-v003-01', module: '105', kind: 'situation', revision, approvedFor: commun,
    prompt: "Deux produits se ressemblent. L’un doit rester au sec, l’autre à température contrôlée. Comment préparez-vous leur stockage ?",
    answer: "Identifier les deux références, lire les exigences, assigner des emplacements compatibles, puis contrôler la concordance au rangement.",
  },
  {
    id: 'log-105-situation-v003-02', module: '105', kind: 'situation', revision, approvedFor: commun,
    prompt: "Vous recevez une caisse marquée « fragile ». Son couvercle est fendu et la charge bouge. Que faites-vous avant la mise en stock ?",
    answer: "Mettre la caisse à l’écart selon le site, relever les signes et l’identifiant sans aggraver le dommage, et demander un contrôle.",
  },
  {
    id: 'log-105-situation-v003-03', module: '105', kind: 'situation', revision, approvedFor: commun,
    prompt: "Deux lots d’une même marchandise affichent des dates différentes. Quel contrôle faites-vous avant d’en sélectionner un pour une commande ?",
    answer: "Vérifier la règle de rotation du site, les dates et les éventuels blocages qualité. Prélever le lot admissible qui correspond à la consigne.",
  },
  {
    id: 'log-105-situation-v003-04', module: '105', kind: 'situation', revision, approvedFor: cfc,
    prompt: "Une sonde de zone et l’enregistreur du lot indiquent des températures différentes. Expliquez comment documenter l’écart pour le responsable.",
    answer: "Rapprocher heures, emplacements et unités, conserver les relevés, vérifier l’incertitude et l’état des appareils, puis appliquer la procédure de décision.",
  },

  // 106 — Élimination des déchets CH
  {
    id: 'log-106-maths-v003-01', module: '106', kind: 'maths', revision, approvedFor: commun,
    prompt: "Le chargement de carton est pesé à 382 kg avec son bac. Le bac vide pèse 47 kg. Calculez la masse nette de carton.",
    answer: "335 kg",
    calculation: "382 − 47 = 335.",
  },
  {
    id: 'log-106-maths-v003-02', module: '106', kind: 'maths', revision, approvedFor: commun,
    prompt: "Le collecteur relève 2,4 t de verre en une semaine. Exprimez cette masse en kg pour la fiche de suivi.",
    answer: "2 400 kg",
    calculation: "2,4 × 1 000 = 2 400.",
  },
  {
    id: 'log-106-maths-v003-03', module: '106', kind: 'maths', revision, approvedFor: commun,
    prompt: "Trois collectes d’une même semaine rapportent 48, 76 et 92 kg de métal. Quelle masse moyenne est collectée par passage ?",
    answer: "72 kg",
    calculation: "(48 + 76 + 92) ÷ 3 = 72.",
  },
  {
    id: 'log-106-maths-v003-04', module: '106', kind: 'maths', revision, approvedFor: commun,
    prompt: "Une zone de tri peut recevoir 12 bacs. Huit sont déjà en place et deux vides attendent. Combien de bacs supplémentaires restent à prévoir pour utiliser les 12 emplacements ?",
    answer: "2 bacs",
    calculation: "12 − 8 − 2 = 2.",
  },
  {
    id: 'log-106-maths-v003-05', module: '106', kind: 'maths', revision, approvedFor: cfc,
    prompt: "Un atelier réceptionne 820 kg de matière. Il en incorpore 690 kg dans les produits, en conserve 40 kg en stock et achemine le reste vers le tri. Calculez la masse à trier et sa part de la masse reçue au dixième de pour cent.",
    answer: "90 kg, soit 11,0 %",
    calculation: "820 − 690 − 40 = 90. 90 ÷ 820 × 100 ≈ 11,0 %.",
  },
  {
    id: 'log-106-verification-v003-01', module: '106', kind: 'verification', revision, approvedFor: commun,
    prompt: "Que peut devenir du verre séparé et accepté dans sa filière ?",
    answer: "Une matière première secondaire qui entre dans la fabrication de nouveaux produits après traitement.",
  },
  {
    id: 'log-106-verification-v003-02', module: '106', kind: 'verification', revision, approvedFor: commun,
    prompt: "Dans une collecte de déchets, que signifie « enlèvement » ?",
    answer: "Le prestataire vient chercher les déchets à l’emplacement convenu.",
  },
  {
    id: 'log-106-verification-v003-03', module: '106', kind: 'verification', revision, approvedFor: commun,
    prompt: "Quelles vérifications permettent de préparer l’enlèvement d’un bac de carton ?",
    answer: "Contrôler que le carton est admis, que le bac est prêt au lieu convenu et que la collecte correspond au volume.",
  },
  {
    id: 'log-106-verification-v003-04', module: '106', kind: 'verification', revision, approvedFor: commun,
    prompt: "Pourquoi retirer les emballages réutilisables du bac de déchets avant qu’ils soient collectés ?",
    answer: "Pour les remettre en circulation dans leur circuit de réemploi et conserver l’usage possible.",
  },
  {
    id: 'log-106-verification-v003-05', module: '106', kind: 'verification', revision, approvedFor: commun,
    prompt: "Que mesure un bilan de matières sur un dépôt ?",
    answer: "Les quantités entrantes, sortantes et en stock, avec les flux de produits et de résidus.",
  },
  {
    id: 'log-106-situation-v003-01', module: '106', kind: 'situation', revision, approvedFor: commun,
    prompt: "Pour trois magasins, le véhicule de livraison reprend les bacs vides. Comment organiser le retour sans confondre les bacs et les déchets ?",
    answer: "Identifier les contenants de retour et leur quantité, les séparer des déchets et les remettre dans la zone prévue au dépôt.",
  },
  {
    id: 'log-106-situation-v003-02', module: '106', kind: 'situation', revision, approvedFor: commun,
    prompt: "Une nouvelle équipe ne sait pas quels déchets mettre dans la collecte de papier sec. Que modifiez-vous à la zone de tri ?",
    answer: "Afficher des exemples du guide du site, identifier le bac au poste de production, puis observer et corriger les erreurs de tri.",
  },
  {
    id: 'log-106-situation-v003-03', module: '106', kind: 'situation', revision, approvedFor: commun,
    prompt: "À la fermeture d’une zone de collecte, vous constatez des déchets déposés près de l’entrée. Quelles informations consignez-vous pour traiter le problème ?",
    answer: "Indiquer lieu, heure, nature visible et fréquence. Faire évacuer selon la procédure, puis examiner l’accessibilité et les horaires des points de collecte.",
  },
  {
    id: 'log-106-situation-v003-04', module: '106', kind: 'situation', revision, approvedFor: cfc,
    prompt: "Une entreprise veut financer la collecte d’un nouveau consommable. Les équipes mélangent prix d’achat et frais de fin d’usage. Quels postes vérifiez-vous ?",
    answer: "Séparer achat, éventuelle contribution ou taxe anticipée, tri, transport, traitement et recette de reprise. Comparer les offres pour une même quantité.",
  },

  // 107 — Élimination des déchets, continuum
  {
    id: 'log-107-maths-v003-01', module: '107', kind: 'maths', revision, approvedFor: commun,
    prompt: "Sur un lot collecté de 320 kg, le tri écarte 25 kg non conformes et 15 kg d’emballages étrangers. Quelle masse reste pour la filière annoncée ?",
    answer: "280 kg",
    calculation: "320 − 25 − 15 = 280.",
  },
  {
    id: 'log-107-maths-v003-02', module: '107', kind: 'maths', revision, approvedFor: commun,
    prompt: "Le dépôt prépare 18 bacs de retour. Un véhicule peut en reprendre 7 par passage. Combien de passages faut-il ?",
    answer: "3 passages",
    calculation: "18 = 2 × 7 + 4. Le reliquat exige un passage.",
  },
  {
    id: 'log-107-maths-v003-03', module: '107', kind: 'maths', revision, approvedFor: commun,
    prompt: "Pour des bacs réemployés, 18 reviennent le lundi, 24 le mercredi et 21 le vendredi. Dix doivent être écartés après contrôle. Combien restent disponibles ?",
    answer: "53 bacs",
    calculation: "18 + 24 + 21 − 10 = 53.",
  },
  {
    id: 'log-107-maths-v003-04', module: '107', kind: 'maths', revision, approvedFor: commun,
    prompt: "La fiche de collecte autorise 14 kg par caisse pour ce lot. Une caisse pèse déjà 11,5 kg chargée. Quelle marge de masse reste-t-il ?",
    answer: "2,5 kg",
    calculation: "14 − 11,5 = 2,5.",
  },
  {
    id: 'log-107-maths-v003-05', module: '107', kind: 'maths', revision, approvedFor: cfc,
    prompt: "La collecte d’un lot rapporte CHF 486. Le transport coûte CHF 180 et le tri CHF 125. Calculez le résultat sur ces postes et le résultat par kg pour 720 kg, au centime.",
    answer: "CHF 181, soit CHF 0,25 par kg",
    calculation: "486 − 180 − 125 = 181. 181 ÷ 720 ≈ 0,25.",
  },
  {
    id: 'log-107-verification-v003-01', module: '107', kind: 'verification', revision, approvedFor: commun,
    prompt: "À quoi sert la liste ou le code de déchets au moment de préparer la remise ?",
    answer: "À identifier correctement la catégorie et à vérifier les conditions de sa filière.",
  },
  {
    id: 'log-107-verification-v003-02', module: '107', kind: 'verification', revision, approvedFor: commun,
    prompt: "Pourquoi un déchet spécial et un déchet urbain ordinaire sont-ils préparés séparément ?",
    answer: "Ils n’ont pas les mêmes règles de suivi ni les mêmes filières. Le mélange peut rendre le traitement inadapté.",
  },
  {
    id: 'log-107-verification-v003-03', module: '107', kind: 'verification', revision, approvedFor: commun,
    prompt: "Quand la Convention de Bâle est-elle pertinente dans ce cours ?",
    answer: "Pour les mouvements transfrontaliers de déchets couverts par la convention.",
  },
  {
    id: 'log-107-verification-v003-04', module: '107', kind: 'verification', revision, approvedFor: commun,
    prompt: "Pourquoi inscrire la quantité au moment de la remise ?",
    answer: "Pour rapprocher le lot pris en charge de l’inventaire et des documents de suivi.",
  },
  {
    id: 'log-107-verification-v003-05', module: '107', kind: 'verification', revision, approvedFor: commun,
    prompt: "Quel est le rôle de l’OLED ?",
    answer: "Elle définit des règles pour limiter la production de déchets et encadrer leur élimination ou leur valorisation.",
  },
  {
    id: 'log-107-situation-v003-01', module: '107', kind: 'situation', revision, approvedFor: commun,
    prompt: "Deux collectes mélangent des composants métalliques valorisables et du bois. Qu’organisez-vous avant le prochain enlèvement ?",
    answer: "Identifier les filières, séparer les matières conformément aux consignes, prévoir les contenants et informer les personnes au poste.",
  },
  {
    id: 'log-107-situation-v003-02', module: '107', kind: 'situation', revision, approvedFor: commun,
    prompt: "Le document de remise décrit quatre contenants, mais vous en comptez cinq dans la zone. Quelle suite donnez-vous ?",
    answer: "Mettre le lot en attente, vérifier les identifiants et l’affectation du cinquième, puis faire corriger ou compléter le document avant remise.",
  },
  {
    id: 'log-107-situation-v003-03', module: '107', kind: 'situation', revision, approvedFor: commun,
    prompt: "Des pièces encore utilisables sont prévues dans le lot à recycler. Comment décider de les réemployer ?",
    answer: "Contrôler état, usage et autorisation. Identifier les pièces réemployables et les orienter séparément vers le circuit prévu.",
  },
  {
    id: 'log-107-situation-v003-04', module: '107', kind: 'situation', revision, approvedFor: cfc,
    prompt: "On demande de remettre un lot à un prestataire à l’étranger. Le code de déchet et les justificatifs ne sont pas confirmés. Que transmettez-vous au responsable ?",
    answer: "Le code envisagé, les caractéristiques du lot, les quantités, l’origine et le destinataire prévus. Demander de vérifier le régime applicable et l’autorisation avant remise.",
  },

  // 108 — Élimination des déchets globale
  {
    id: 'log-108-maths-v003-01', module: '108', kind: 'maths', revision, approvedFor: commun,
    prompt: "Un événement consomme 2 800 gobelets jetables une année. L’année suivante, à fréquentation comparable, il n’en consomme que 420. Combien de gobelets évite-t-il ?",
    answer: "2 380 gobelets",
    calculation: "2 800 − 420 = 2 380.",
  },
  {
    id: 'log-108-maths-v003-02', module: '108', kind: 'maths', revision, approvedFor: commun,
    prompt: "Un stand prête 360 gobelets et en récupère 342. Calculez le taux de retour.",
    answer: "95 %",
    calculation: "342 ÷ 360 × 100 = 95.",
  },
  {
    id: 'log-108-maths-v003-03', module: '108', kind: 'maths', revision, approvedFor: commun,
    prompt: "Sur quatre zones, les bacs de déchets pèsent 24, 38, 17 et 21 kg, tare déduite. Quel est le total relevé ?",
    answer: "100 kg",
    calculation: "24 + 38 + 17 + 21 = 100.",
  },
  {
    id: 'log-108-maths-v003-04', module: '108', kind: 'maths', revision, approvedFor: commun,
    prompt: "Pour un exercice de suivi, 32 kg de déchets sont recueillis à un point et 48 kg à l’autre. Quelle fraction du total vient du premier point ? Simplifiez-la.",
    answer: "2/5 du total",
    calculation: "32 ÷ (32 + 48) = 32/80 = 2/5.",
  },
  {
    id: 'log-108-maths-v003-05', module: '108', kind: 'maths', revision, approvedFor: cfc,
    prompt: "Deux éditions accueillent 1 500 puis 2 000 personnes. Les masses de déchets sont de 600 puis 740 kg. Calculez la masse par visiteur pour chaque édition et l’écart.",
    answer: "0,40 puis 0,37 kg par visiteur, soit 0,03 kg de moins",
    calculation: "600 ÷ 1 500 = 0,40. 740 ÷ 2 000 = 0,37. 0,40 − 0,37 = 0,03.",
  },
  {
    id: 'log-108-verification-v003-01', module: '108', kind: 'verification', revision, approvedFor: commun,
    prompt: "Dans un SME, à quoi sert la mesure effectuée après une action ?",
    answer: "À déterminer son effet et à décider des ajustements nécessaires.",
  },
  {
    id: 'log-108-verification-v003-02', module: '108', kind: 'verification', revision, approvedFor: commun,
    prompt: "Donnez une conséquence industrielle possible d’une pénurie d’eau.",
    answer: "Par exemple la capacité de lavage ou de production peut diminuer et demander une adaptation.",
  },
  {
    id: 'log-108-verification-v003-03', module: '108', kind: 'verification', revision, approvedFor: commun,
    prompt: "Pourquoi séparer un objectif comme « réduire les déchets » et un indicateur de suivi ?",
    answer: "L’objectif décrit le résultat souhaité. L’indicateur donne une mesure précise de son évolution.",
  },
  {
    id: 'log-108-verification-v003-04', module: '108', kind: 'verification', revision, approvedFor: commun,
    prompt: "Comment une palette réemployée peut-elle réduire l’usage de ressources ?",
    answer: "Elle sert à plusieurs cycles et retarde le remplacement par un support neuf.",
  },
  {
    id: 'log-108-verification-v003-05', module: '108', kind: 'verification', revision, approvedFor: commun,
    prompt: "Quel risque environnemental augmente lorsque des films d’emballage quittent un quai à l’air libre ?",
    answer: "Le vent peut les disperser et accroître la présence de déchets plastiques dans l’environnement.",
  },
  {
    id: 'log-108-situation-v003-01', module: '108', kind: 'situation', revision, approvedFor: commun,
    prompt: "Le tri est possible au dépôt mais les bacs débordent tous les vendredis. Quelle action tester et quel indicateur relever ?",
    answer: "Avancer l’enlèvement, adapter les capacités ou ajuster le tri, puis comparer le nombre de débordements les vendredis sur des périodes semblables.",
  },
  {
    id: 'log-108-situation-v003-02', module: '108', kind: 'situation', revision, approvedFor: commun,
    prompt: "Un organisateur veut annoncer une amélioration à partir d’une seule pesée. Comment construire une comparaison plus fiable ?",
    answer: "Mesurer à moments et catégories comparables, relever le nombre de visiteurs, déduire les tares et préciser la durée et le périmètre.",
  },
  {
    id: 'log-108-situation-v003-03', module: '108', kind: 'situation', revision, approvedFor: commun,
    prompt: "Une livraison utilise des emballages réemployables, mais aucun espace de retour n’est prévu. Qu’ajoutez-vous à l’organisation ?",
    answer: "Définir une zone de dépôt, une procédure de retour, une fréquence de relève et un suivi du nombre rendu.",
  },
  {
    id: 'log-108-situation-v003-04', module: '108', kind: 'situation', revision, approvedFor: cfc,
    prompt: "Un site réduit son usage de cartons en augmentant ses trajets de retour. Comment examiner l’effet global ?",
    answer: "Comparer cycles de réemploi, transports supplémentaires, nettoyage, achats et déchets pour une même durée et un même volume de service.",
  },

  // 109 — Protection des données et sécurité de l'information
  {
    id: 'log-109-maths-v003-01', module: '109', kind: 'maths', revision, approvedFor: commun,
    prompt: "Pour un projet, 9 personnes sont autorisées à consulter un dossier. Deux changent de service et une nouvelle personne est autorisée. Combien d’autorisations doit-il rester ?",
    answer: "8 autorisations",
    calculation: "9 − 2 + 1 = 8.",
  },
  {
    id: 'log-109-maths-v003-02', module: '109', kind: 'maths', revision, approvedFor: commun,
    prompt: "Une revue d’accès dure 4 minutes par dossier. Il y a 18 dossiers. À quelle heure finit-elle si elle commence à 08 h 45, sans interruption ?",
    answer: "09 h 57",
    calculation: "18 × 4 = 72 min. 08 h 45 + 1 h 12 = 09 h 57.",
  },
  {
    id: 'log-109-maths-v003-03', module: '109', kind: 'maths', revision, approvedFor: commun,
    prompt: "Un lot de 84 documents est remplacé par un dossier synthétique de 12 documents pour les personnes habilitées. Combien de documents en moins doivent être partagés ?",
    answer: "72 documents",
    calculation: "84 − 12 = 72.",
  },
  {
    id: 'log-109-maths-v003-04', module: '109', kind: 'maths', revision, approvedFor: commun,
    prompt: "Pour vérifier le registre d’une porte, deux collègues traitent 36 entrées chacun. Une troisième personne traite les 28 restantes. Combien d’entrées ont été traitées ?",
    answer: "100 entrées",
    calculation: "2 × 36 + 28 = 100.",
  },
  {
    id: 'log-109-maths-v003-05', module: '109', kind: 'maths', revision, approvedFor: cfc,
    prompt: "Un service doit revoir 180 droits d’accès. Il en examine 65 % la première semaine, puis traite 28 droits la deuxième. Combien de droits reste-t-il à revoir ?",
    answer: "35 droits",
    calculation: "180 × 0,65 = 117. 180 − 117 − 28 = 35.",
  },
  {
    id: 'log-109-verification-v003-01', module: '109', kind: 'verification', revision, approvedFor: commun,
    prompt: "Pourquoi définir les droits par rôle plutôt que de laisser tout le personnel consulter le même dossier ?",
    answer: "Pour limiter l’accès aux informations nécessaires à l’activité de chaque personne.",
  },
  {
    id: 'log-109-verification-v003-02', module: '109', kind: 'verification', revision, approvedFor: commun,
    prompt: "À quoi sert une authentification multifacteur sur un compte professionnel ?",
    answer: "Elle demande une confirmation supplémentaire selon le système, en plus du premier facteur.",
  },
  {
    id: 'log-109-verification-v003-03', module: '109', kind: 'verification', revision, approvedFor: commun,
    prompt: "Que faut-il contrôler avant de partager une capture d’écran de suivi d’envoi ?",
    answer: "Le droit du destinataire et les données personnelles ou confidentielles visibles. Ne communiquer que les informations requises.",
  },
  {
    id: 'log-109-verification-v003-04', module: '109', kind: 'verification', revision, approvedFor: commun,
    prompt: "Quel est le rôle d’un mandat dans le traitement du courrier adressé à une personne ?",
    answer: "Il précise qui peut ouvrir ou traiter l’envoi et dans quelles conditions.",
  },
  {
    id: 'log-109-verification-v003-05', module: '109', kind: 'verification', revision, approvedFor: commun,
    prompt: "Pourquoi une liste des accès actifs doit-elle être revue lors d’un changement de poste ?",
    answer: "Des autorisations peuvent devenir inutiles et d’autres doivent être accordées par la personne responsable.",
  },
  {
    id: 'log-109-situation-v003-01', module: '109', kind: 'situation', revision, approvedFor: commun,
    prompt: "Une porte de réserve s’ouvre avec votre badge et une personne inconnue veut entrer en même temps. Comment réagir dans le cadre du site ?",
    answer: "Lui expliquer que l’accès se contrôle individuellement et la diriger vers l’accueil ou le responsable des accès.",
  },
  {
    id: 'log-109-situation-v003-02', module: '109', kind: 'situation', revision, approvedFor: commun,
    prompt: "Vous préparez un tableau de volumes pour une équipe extérieure. Le tableau source contient des noms et des numéros directs. Comment préparer la version à transmettre ?",
    answer: "Utiliser des données agrégées utiles, vérifier le destinataire, retirer les champs personnels superflus et transmettre par le canal prévu.",
  },
  {
    id: 'log-109-situation-v003-03', module: '109', kind: 'situation', revision, approvedFor: commun,
    prompt: "Un fournisseur attend par courriel une confirmation de livraison. Deux contacts figurent dans votre carnet. Comment éviter un envoi au mauvais destinataire ?",
    answer: "Vérifier l’adresse et le rôle dans les documents autorisés, limiter le contenu et contrôler destinataires et pièces jointes avant envoi.",
  },
  {
    id: 'log-109-situation-v003-04', module: '109', kind: 'situation', revision, approvedFor: cfc,
    prompt: "Un dossier transmis au mauvais groupe est signalé après envoi. Quelles actions prenez-vous immédiatement dans le cadre de votre rôle ?",
    answer: "Prévenir le responsable et le service prévu, limiter ou retirer l’accès si autorisé, puis consigner quoi, quand, à qui et les actions entreprises.",
  },

  // 110 — Définition de la gestion d'entrepôt
  {
    id: 'log-110-maths-v003-01', module: '110', kind: 'maths', revision, approvedFor: commun,
    prompt: "Un rayon contient 86 unités physiques, dont 18 réservées et 7 bloquées au contrôle. Combien d’unités restent disponibles à la vente si les groupes sont distincts ?",
    answer: "61 unités",
    calculation: "86 − 18 − 7 = 61.",
  },
  {
    id: 'log-110-maths-v003-02', module: '110', kind: 'maths', revision, approvedFor: commun,
    prompt: "Un carton contient 12 pièces. Vous réceptionnez 8 cartons et 7 pièces en vrac. Quelle quantité entrer si l’unité de base est la pièce ?",
    answer: "103 pièces",
    calculation: "8 × 12 + 7 = 103.",
  },
  {
    id: 'log-110-maths-v003-03', module: '110', kind: 'maths', revision, approvedFor: commun,
    prompt: "Le système indique 64 pièces à l’emplacement A et 33 à B. Vous transférez 12 pièces de A à B. Quels sont les nouveaux soldes ?",
    answer: "52 à A, 45 à B",
    calculation: "64 − 12 = 52. 33 + 12 = 45. Le total reste à 97.",
  },
  {
    id: 'log-110-maths-v003-04', module: '110', kind: 'maths', revision, approvedFor: commun,
    prompt: "Le quai traite 48 commandes en 3 heures. Combien de temps faut-il pour 32 commandes à la même cadence ?",
    answer: "2 h",
    calculation: "48 ÷ 3 = 16 commandes/h. 32 ÷ 16 = 2 h.",
  },
  {
    id: 'log-110-maths-v003-05', module: '110', kind: 'maths', revision, approvedFor: cfc,
    prompt: "Deux articles reçoivent des lots de 400 et 100 pièces. Leurs taux de rebut sont 2 % et 6 %. Calculez le nombre total de rebuts et le taux global.",
    answer: "14 rebuts, soit 2,8 %",
    calculation: "400 × 0,02 + 100 × 0,06 = 14. 14 ÷ 500 × 100 = 2,8.",
  },
  {
    id: 'log-110-verification-v003-01', module: '110', kind: 'verification', revision, approvedFor: commun,
    prompt: "Quelle différence faites-vous entre stock physique et stock disponible ?",
    answer: "Le stock physique correspond aux pièces présentes. Le disponible déduit notamment les unités réservées ou bloquées.",
  },
  {
    id: 'log-110-verification-v003-02', module: '110', kind: 'verification', revision, approvedFor: commun,
    prompt: "L’intitulé d’un article change dans le référentiel. À quel type de données appartient ce changement ?",
    answer: "Aux données de base de l’article.",
  },
  {
    id: 'log-110-verification-v003-03', module: '110', kind: 'verification', revision, approvedFor: commun,
    prompt: "À quoi sert l’identifiant d’emplacement lors d’un prélèvement ?",
    answer: "À retrouver la case exacte où l’article autorisé doit être pris.",
  },
  {
    id: 'log-110-verification-v003-04', module: '110', kind: 'verification', revision, approvedFor: commun,
    prompt: "Pourquoi garder le numéro de lot avec le mouvement d’entrée lorsqu’il est exigé ?",
    answer: "Pour retrouver le lot et relier une réception, ses déplacements et une éventuelle sortie.",
  },
  {
    id: 'log-110-verification-v003-05', module: '110', kind: 'verification', revision, approvedFor: commun,
    prompt: "Pourquoi déduire seulement les réceptions attendues avant le besoin dans le calcul des quantités à couvrir ?",
    answer: "Parce qu’une quantité disponible après l’échéance ne permet pas de servir le besoin à temps.",
  },
  {
    id: 'log-110-situation-v003-01', module: '110', kind: 'situation', revision, approvedFor: commun,
    prompt: "Vous rangez des caisses identiques dans deux cases. Le premier prélèvement se fait demain. Que saisissez-vous pour préparer la remise ?",
    answer: "Confirmer références, lots si nécessaires, quantités et emplacements exacts. Vérifier que le solde disponible correspond au rangement.",
  },
  {
    id: 'log-110-situation-v003-02', module: '110', kind: 'situation', revision, approvedFor: commun,
    prompt: "Un lot doit rester hors vente jusqu’au contrôle qualité. Il est déjà au dépôt. Comment distinguez-vous son état physique et son état dans le système ?",
    answer: "Enregistrer la présence et le statut bloqué, avec emplacement et référence. La quantité figure en stock physique et reste indisponible.",
  },
  {
    id: 'log-110-situation-v003-03', module: '110', kind: 'situation', revision, approvedFor: commun,
    prompt: "La fiche article mentionne une unité de vente « carton ». La demande interne est exprimée en pièces. Comment éviter un mauvais prélèvement ?",
    answer: "Vérifier le nombre de pièces par carton, convertir dans la même unité, puis comparer la demande au stock et au document.",
  },
  {
    id: 'log-110-situation-v003-04', module: '110', kind: 'situation', revision, approvedFor: cfc,
    prompt: "Une demande de 80 pièces porte sur demain. Le tableau indique 90 en stock, dont 20 réservées. La prochaine réception est après-demain. Quelle réponse préparez-vous ?",
    answer: "Confirmer la réserve existante et le délai. À l’échéance, 70 pièces sont disponibles. Proposer une solution pour 10 pièces avec le responsable et informer le demandeur.",
  },
] satisfies readonly LogistiqueUnit[]
