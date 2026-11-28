import type { LogistiqueUnit } from '../approved-banks'
import type { LogistiqueWording } from '../wording'

const module100: Readonly<Record<string, readonly [normal: string, falc: string]>> = {
  'maths-origine-1': [
    'Vous avez 45 minutes de révision. Vous lisez un module pendant 12 minutes et résolvez un exercice pendant 18 minutes. Combien de temps reste-t-il pour la correction ?',
    'Vous avez 45 minutes pour réviser.\nVous lisez un module pendant 12 minutes.\nVous faites un exercice pendant 18 minutes.\nCombien de minutes reste-t-il pour la correction ?',
  ],
  'maths-origine-2': [
    'Deux apprentis contrôlent 16 colis chacun. Une collègue en contrôle 8. Combien de colis l’équipe contrôle-t-elle au total ?',
    'Chaque apprenti contrôle 16 colis. Ils sont deux.\nUne collègue contrôle 8 colis.\nCombien de colis l’équipe contrôle-t-elle en tout ?',
  ],
  'maths-origine-3': [
    'La révision commence à 13 h 35. Vous lisez pendant 20 minutes, faites une pause de 5 minutes, puis corrigez un exercice pendant 25 minutes. À quelle heure terminez-vous ?',
    'Vous commencez à 13 h 35.\nVous lisez pendant 20 minutes.\nVotre pause dure 5 minutes.\nVotre correction dure 25 minutes.\nÀ quelle heure terminez-vous ?',
  ],
  'maths-origine-4': [
    'Votre révision dure 24 minutes. Vous consacrez un quart de ce temps au glossaire. Combien de minutes utilisez-vous pour le glossaire et combien vous reste-t-il ?',
    'Vous avez 24 minutes pour réviser.\nVous utilisez un quart du temps pour lire le glossaire.\nCombien de minutes lisez-vous le glossaire ?\nCombien de minutes reste-t-il ?',
  ],
  'maths-origine-5': [
    'Une séance dure 35 minutes, l’autre 45 minutes. Vous réservez 20 % du temps total à la correction. Combien de minutes durera la correction ?',
    'La première séance dure 35 minutes.\nLa deuxième dure 45 minutes.\nLa correction prend 20 % du temps total.\nCombien de minutes dure la correction ?',
  ],
  'verification-origine-1': [
    'Quel module vous aide à choisir où stocker un produit fragile en tenant compte de ses propriétés ?',
    'Vous devez ranger un produit fragile.\nQuel module vous aide à choisir un endroit adapté à ce produit ?',
  ],
  'verification-origine-2': [
    'Quel module présente les emplacements de stockage et les mouvements de marchandises ?',
    'Vous voulez apprendre où ranger les marchandises et comment suivre leurs déplacements.\nQuel module consultez-vous ?',
  ],
  'verification-origine-3': [
    'Un colis passe du quai au rayon B. Vous enregistrez son nouvel emplacement. Quelle action relève du flux de marchandises et laquelle relève du flux d’informations ?',
    'Un colis va du quai au rayon B.\nVous enregistrez le nouvel emplacement.\nQuel est le flux de marchandises ?\nQuel est le flux d’informations ?',
  ],
  'verification-origine-4': [
    'Quel module vous aide à savoir à qui transmettre les coordonnées d’un destinataire ?',
    'Vous avez les coordonnées d’un destinataire.\nVous voulez savoir avec qui vous pouvez les partager.\nQuel module consultez-vous ?',
  ],
  'verification-origine-5': [
    'Comment le corrigé vous aide-t-il après un exercice ?',
    'Vous avez terminé un exercice.\nÀ quoi sert le corrigé ?',
  ],
  'verification-origine-6': [
    'Donnez un exemple de tâche qui fait appel aux connaissances du module 105 et du module 110.',
    'Pensez au module 105 et au module 110.\nDonnez un exemple de tâche où vous utilisez les deux modules.',
  ],
  'situation-origine-1': [
    'Un colis arrive au quai. Sa référence est lisible et son emballage est abîmé. Indiquez deux actions à faire avant de ranger le colis et précisez ce que vous notez.',
    'Un colis arrive au quai.\nVous pouvez lire sa référence. L’emballage est abîmé.\nQue faites-vous avant de le ranger ? Donnez deux actions.\nQuelles informations notez-vous ?',
  ],
  'situation-origine-2': [
    'Vous avez 30 minutes pour réviser les flux de marchandises. Choisissez un module et répartissez le temps en trois périodes de travail.',
    'Vous révisez les flux de marchandises pendant 30 minutes.\nChoisissez un module.\nPrévoyez trois moments de travail. Indiquez la durée de chaque moment.',
  ],
  'situation-origine-3': [
    'Vous déplacez un colis du rayon A au rayon B. Le système affiche encore le rayon A. Décrivez l’écart et proposez une action.',
    'Vous déplacez un colis du rayon A au rayon B.\nLe système indique toujours le rayon A.\nExpliquez l’écart.\nProposez une action.',
  ],
  'situation-origine-4': [
    'Votre équipe reçoit des cartons vides et veut réduire ses déchets. Choisissez deux modules utiles et formulez une question pour chacun.',
    'Votre équipe reçoit des cartons vides. Elle veut produire moins de déchets.\nChoisissez deux modules qui peuvent vous aider.\nPosez une question pour chaque module.',
  ],
  'maths-v003-01': [
    'Au dépôt-école, vous disposez de 90 minutes. Vous utilisez un tiers de ce temps pour la réception et un quart du temps initial pour la préparation. Combien de minutes reste-t-il pour l’expédition ?',
    'Vous avez 90 minutes au dépôt-école.\nLa réception prend un tiers du temps de départ.\nLa préparation prend un quart du temps de départ.\nCombien de minutes reste-t-il pour l’expédition ?',
  ],
  'maths-v003-02': [
    'Vous devez préparer 18 colis à l’expédition. Vous avez 15 étiquettes et il en faut une par colis. Combien d’étiquettes manque-t-il ?',
    'Vous préparez 18 colis.\nChaque colis doit avoir une étiquette.\nVous avez 15 étiquettes.\nCombien en manque-t-il ?',
  ],
  'maths-v003-03': [
    'Au dépôt-école, comptez 4 min pour identifier un colis, 8 min pour contrôler le bon, 5 min pour vérifier son état, 6 min pour saisir son entrée et 7 min pour le ranger. Calculez la durée moyenne par étape.',
    'Vous identifiez le colis en 4 min et contrôlez le bon en 8 min.\nVous vérifiez son état en 5 min et saisissez son entrée en 6 min.\nVous le rangez en 7 min.\nQuelle est la durée moyenne d’une étape ?',
  ],
  'maths-v003-04': [
    'Vous vérifiez dans le système cinq associations entre un article et son emplacement. Trois correspondent aux articles réellement rangés. Exprimez la part correcte en fraction, puis en pourcentage.',
    'Le système donne l’emplacement de cinq articles.\nTrois articles sont au bon emplacement.\nQuelle fraction des associations est correcte ?\nQuel est le pourcentage correspondant ?',
  ],
  'maths-v003-05': [
    'Au dépôt-école, vous prévoyez 50 min pour recevoir, ranger et expédier un lot. Ajoutez une marge de 12 % sur cette durée et 5 min pour vérifier la trace de l’envoi. Calculez le temps total.',
    'Vous prévoyez 50 min pour recevoir, ranger et expédier un lot.\nAjoutez une marge de 12 % calculée sur ce temps.\nAjoutez 5 min pour vérifier la trace de l’envoi.\nCombien de temps faut-il en tout ?',
  ],
  'verification-v003-01': [
    'Pourquoi noter l’heure et l’emplacement lorsque vous transférez une marchandise ?',
    'Vous déplacez une marchandise. Vous notez l’heure et l’emplacement.\nÀ quoi servent ces informations ?',
  ],
  'verification-v003-02': [
    'Vous vous trompez deux fois dans une conversion de masse. Quel type de fiche choisissez-vous pour vous exercer et vérifier votre résultat ?',
    'Vous avez fait deux erreurs en changeant d’unité de masse.\nQuel type de fiche vous aide à vous exercer et à vérifier votre réponse ?',
  ],
  'verification-v003-03': [
    'Quelle est la différence entre la référence d’un article et son emplacement ?',
    'À quoi sert la référence d’un article ?\nÀ quoi sert son emplacement ?',
  ],
  'verification-v003-04': [
    'Comment pouvez-vous préparer votre travail sur un terme que vous découvrez ?',
    'Vous découvrez un mot que vous ne connaissez pas.\nQue pouvez-vous faire avant de travailler sur ce mot ?',
  ],
  'verification-v003-05': [
    'Avant de préparer une fiche, pourquoi vérifier le code du module et le diplôme ?',
    'Vous préparez une fiche d’exercices.\nPourquoi vérifiez-vous le code du module ?\nPourquoi vérifiez-vous le diplôme ?',
  ],
  'situation-v003-01': [
    'Vous réceptionnez dix bacs avec un collègue. Le bon indique le lot V3 et deux bacs portent la référence V8. Décrivez votre contrôle et les actions à faire avant le rangement.',
    'Vous recevez dix bacs avec un collègue.\nLe bon annonce le lot V3. Deux bacs indiquent V8.\nComment contrôlez-vous la livraison ?\nQue faites-vous avant de ranger les bacs ?',
  ],
  'situation-v003-02': [
    'Votre total est correct, mais l’unité est fausse. Comment reprenez-vous votre calcul pour éviter la même erreur au dépôt ?',
    'Vous avez trouvé le bon nombre. Vous avez écrit la mauvaise unité.\nComment reprenez-vous votre calcul pour éviter cette erreur au dépôt ?',
  ],
  'situation-v003-03': [
    'Lors d’une visite, vous observez un opérateur qui scanne un colis et l’amène en zone de départ. Que notez-vous pour expliquer les deux flux à votre classe ?',
    'Un opérateur scanne un colis. Puis il le déplace en zone de départ.\nQue notez-vous pour expliquer le flux de marchandises et le flux d’informations à votre classe ?',
  ],
  'situation-v003-04': [
    'Dans votre bilan de stage, vous devez présenter deux compétences acquises. Chacune doit être liée à une trace autorisée de votre travail. Comment préparez-vous votre bilan ?',
    'Vous préparez votre bilan de stage.\nChoisissez deux compétences que vous avez acquises.\nIl faut une trace autorisée pour montrer chacune d’elles.\nComment préparez-vous le bilan ?',
  ],
  'maths-v005-colis-5': [
    'Avant l’expédition, le dossier annonce 86 colis. Vous comptez 10 groupes de 8 et 5 colis séparés. Quel écart signé obtenez-vous en retirant le nombre prévu du nombre compté ?',
    'Le dossier annonce 86 colis.\nVous comptez 10 groupes de 8 colis et 5 colis seuls.\nRetirez le nombre prévu du nombre compté.\nQuel est l’écart signé en nombre de colis ?',
  ],
  'maths-v005-temps-5': [
    'Vous organisez une activité de réception. Il y a 25 exercices à traiter. Pendant chacune des deux périodes, vous en traitez 6 et 4 nouveaux arrivent. Combien d’exercices restent en attente à la fin ?',
    'Il y a 25 exercices à traiter.\nIl y a deux périodes. À chaque période, vous traitez 6 exercices et 4 autres arrivent.\nCombien reste-t-il d’exercices après les deux périodes ?',
  ],
  'verification-acquis-v008-1': [
    'Vous connaissez la date de livraison. Vous devez apprendre à contrôler le nom du destinataire avant d’ouvrir le véhicule. Quel sujet cherchez-vous dans le catalogue ?',
    'Vous connaissez la date de livraison.\nVous devez apprendre à vérifier le nom du destinataire avant d’ouvrir le véhicule.\nQuel sujet cherchez-vous dans le catalogue ?',
  ],
  'verification-acquis-v008-2': [
    'Votre calcul donne 24. Que vérifiez-vous pour savoir si le résultat correspond à des pièces ou à des cartons ?',
    'Votre résultat est 24.\nVous devez savoir si ce sont des pièces ou des cartons.\nQue vérifiez-vous ?',
  ],
  'situation-acquis-v008-1': [
    'Vous disposez de vingt minutes et vous confondez les étapes d’un contrôle au quai. Proposez une méthode de révision que vous pouvez suivre avec un collègue.',
    'Vous avez vingt minutes pour réviser.\nVous mélangez les étapes du contrôle au quai.\nComment pouvez-vous réviser ces étapes avec votre collègue ?',
  ],
  'situation-acquis-v008-2': [
    'Un colis est scanné au quai, mais il n’arrive pas au rayon du magasin. Formulez une question pour l’équipe du quai et une autre pour l’équipe du magasin afin de retrouver le colis.',
    'L’équipe scanne un colis au quai. Le colis n’arrive pas au rayon.\nQuelle question posez-vous à l’équipe du quai ?\nQuelle question posez-vous à l’équipe du magasin pour savoir où le colis s’est arrêté ?',
  ],
  'maths-acquis-v008-1': [
    'La commande prévoit 44 articles. Vous comptez 3 cartons fermés de 12 articles chacun et 5 articles à l’unité. Combien d’articles manque-t-il ?',
    'Le client a commandé 44 articles.\nVous trouvez 3 cartons de 12 articles chacun.\nVous trouvez aussi 5 articles seuls.\nCombien d’articles manque-t-il ?',
  ],
}

const module101: Readonly<Record<string, readonly [normal: string, falc: string]>> = {
  'maths-source-1': [
    'Une console de jeux coûte 500 CHF. Les frais d’expédition s’élèvent à 9 % du prix de la console. Quel est le montant de ces frais ?',
    'La console coûte 500 CHF.\nPour l’envoyer, vous payez 9 % de son prix.\nCombien coûtent les frais d’expédition ?',
  ],
  'maths-source-2': [
    'Dans cet exercice, le port de Hambourg traite 93,9 millions de tonnes en 2019, soit 3 % de plus qu’en 2018. Calculez le volume de 2018. Arrondissez au centième de million de tonnes.',
    'En 2019, le port de Hambourg traite 93,9 millions de tonnes.\nC’est 3 % de plus qu’en 2018.\nCalculez le volume de 2018 en millions de tonnes.\nGardez deux chiffres après la virgule.',
  ],
  'maths-source-3': [
    'Les CFF ont parcouru 147,5 millions de kilomètres en 2018. Dans cet exercice, ils parcourent 2,4 % de plus en 2019. Calculez la distance parcourue en 2019.',
    'En 2018, les CFF parcourent 147,5 millions de kilomètres.\nDans cet exercice, la distance augmente de 2,4 % en 2019.\nCombien de kilomètres les CFF parcourent-ils en 2019 ?',
  ],
  'maths-source-4': [
    'Un aéroport accueille en moyenne 86 322 personnes par jour. La fréquentation baisse de 32 %. Calculez la nouvelle moyenne journalière et arrondissez à la personne.',
    'Au départ, l’aéroport accueille en moyenne 86 322 personnes par jour.\nLe nombre moyen baisse de 32 %.\nQuelle est la nouvelle moyenne par jour ?\nArrondissez au nombre entier le plus proche.',
  ],
  'verification-source-1': [
    'Quels sont les deux équipements de manutention utilisés lors du débarquement allié en Normandie en 1944 ?',
    'Les Alliés débarquent en Normandie en 1944.\nQuels équipements utilisent-ils pour déplacer les marchandises ? Donnez deux exemples.',
  ],
  'verification-source-2': [
    'Quels sont les deux réseaux de commerce anciens présentés dans le module ?',
    'Le module présente deux routes commerciales anciennes.\nComment s’appellent-elles ?',
  ],
  'verification-source-3': [
    'Quelles marchandises circulaient sur la route de la soie ? Donnez quatre exemples.',
    'Des marchands circulaient sur la route de la soie.\nCitez quatre produits qu’ils échangeaient.',
  ],
  'verification-source-4': [
    'De quels deux mots vient le mot « informatique » ?',
    'Le mot « informatique » est formé à partir de deux mots.\nQuels sont ces mots ?',
  ],
  'verification-source-5': [
    'Quel ouvrage routier suisse a ouvert en 1980 ?',
    'En 1980, un grand ouvrage routier ouvre en Suisse.\nComment s’appelle-t-il ?',
  ],
  'verification-origine-1': [
    'Quelles sont les trois étapes de la chaîne logistique moderne simplifiée, dans l’ordre ?',
    'La chaîne logistique moderne simplifiée a trois étapes.\nNommez-les dans le bon ordre.',
  ],
  'verification-origine-2': [
    'À la réception d’un colis, à quoi le code-barres sert-il ?',
    'Un colis arrive à la réception.\nEn quoi son code-barres vous aide-t-il ?',
  ],
  'situation-source-1': [
    'Un musée organise un atelier sur la conservation des aliments dans une société ancienne. Proposez trois activités dans l’ordre et associez chacune à une étape de la chaîne vue dans le cours.',
    'Un musée propose un atelier sur les aliments dans une société ancienne.\nChoisissez trois activités liées à leur conservation et à leur usage. Mettez-les dans l’ordre.\nReliez chaque activité à une étape de la chaîne du cours.',
  ],
  'situation-source-2': [
    'Votre vitrine de musée présente de la soie et de l’ambre. Pour chaque marchandise, nommez la route commerciale historique et indiquez deux régions qu’elle reliait.',
    'Vous présentez de la soie et de l’ambre au musée.\nPour la soie, donnez le nom de la route et deux régions reliées.\nFaites la même chose pour l’ambre.',
  ],
  'situation-source-3': [
    'Pour présenter l’histoire des transports en Suisse à des apprentis, associez 1948, 1980 et 1992 aux événements du cours. Précisez le mode de transport pour chaque date.',
    'Vous présentez l’histoire des transports en Suisse à des apprentis.\nAssociez les dates 1948, 1980 et 1992 aux événements du cours.\nPour chaque date, indiquez le mode de transport.',
  ],
  'situation-source-4': [
    'Pendant un inventaire, votre équipe saisit les numéros à la main. Comparez cette méthode au scan d’un code-barres, puis proposez un contrôle à réaliser à la réception.',
    'Pendant l’inventaire, vous tapez les numéros à la main. Vous pouvez aussi scanner un code-barres.\nComparez les deux méthodes.\nQuel contrôle proposez-vous à la réception des colis ?',
  ],
  'maths-v003-01': [
    'Sur un trajet fictif de la route de la soie, une caravane parcourt quatre étapes de 22, 19, 25 et 16 km. Calculez la distance totale.',
    'Une caravane fait quatre étapes sur un trajet fictif de la route de la soie.\nLes distances sont de 22 km, 19 km, 25 km et 16 km.\nQuelle distance parcourt-elle en tout ?',
  ],
  'maths-v003-02': [
    'Dans une reconstitution d’un circuit commercial, un bateau met 12 jours pour rejoindre le marché, 3 jours pour les échanges et 15 jours pour revenir. Combien de jours dure le circuit complet ?',
    'Un bateau va au marché. Le trajet aller prend 12 jours.\nL’échange des marchandises prend 3 jours.\nLe retour prend 15 jours.\nCombien de jours dure le voyage en tout ?',
  ],
  'maths-v003-03': [
    'Un atelier traite 60 colis en 30 min avec la saisie manuelle. Avec un lecteur, il traite ces mêmes colis en 12 min. Calculez le temps gagné par colis.',
    'L’atelier traite 60 colis.\nIl faut 30 min avec la saisie manuelle. Il faut 12 min avec un lecteur.\nCombien de temps gagne-t-on pour chaque colis ?',
  ],
  'maths-v003-04': [
    'Dans une simulation de ravitaillement à l’époque de Napoléon, un convoi de vivres parcourt 18 km par jour. Le dépôt se trouve à 95 km. Combien de jours faut-il prévoir en comptant chaque jour commencé ?',
    'Vous simulez le trajet d’un convoi de vivres à l’époque de Napoléon.\nLe convoi avance de 18 km par jour. Le dépôt est à 95 km.\nCombien de jours faut-il prévoir ? Comptez chaque jour commencé.',
  ],
  'maths-v003-05': [
    'Un port compare deux périodes de même durée. Avec le transfert rail–bateau, le volume manutentionné passe de 450 à 540 t. Calculez le rapport du nouveau volume à l’ancien, puis la hausse relative.',
    'Le port compare deux périodes de même durée.\nAvant le transfert rail–bateau, le port manutentionne 450 t. Après, il en manutentionne 540 t.\nDivisez le nouveau volume par l’ancien.\nCalculez aussi le pourcentage d’augmentation.',
  ],
  'verification-v003-01': [
    'Pourquoi conserver les denrées lorsqu’un trajet commercial dure plusieurs jours ?',
    'Des denrées voyagent pendant plusieurs jours.\nPourquoi est-il utile de les conserver ?',
  ],
  'verification-v003-02': [
    'Pourquoi un conteneur normalisé facilite-t-il le passage du bateau au train ?',
    'Vous transférez des marchandises du bateau au train.\nComment un conteneur normalisé facilite-t-il le transfert ?',
  ],
  'verification-v003-03': [
    'Un entrepôt reçoit des marchandises de plusieurs fournisseurs. Quel avantage y a-t-il à utiliser des palettes d’un format compatible ?',
    'Des fournisseurs livrent au même entrepôt.\nEn quoi est-il utile que leurs palettes aient un format compatible ?',
  ],
  'verification-v003-04': [
    'À quelle étape de la chaîne logistique simplifiée choisissez-vous et achetez-vous les matières premières ?',
    'Vous choisissez et achetez les matières premières.\nÀ quelle étape de la chaîne logistique simplifiée faites-vous ces actions ?',
  ],
  'verification-v003-05': [
    'Pourquoi associer une date et un lieu à un exemple historique ?',
    'Vous présentez un événement historique.\nPourquoi indiquez-vous sa date et son lieu ?',
  ],
  'situation-v003-01': [
    'Présentez une route commerciale ancienne en trois arrêts. Pour chaque arrêt, indiquez une tâche logistique. Précisez où un retard pourrait survenir.',
    'Choisissez trois arrêts sur une route commerciale ancienne.\nDonnez une tâche logistique pour chaque arrêt.\nÀ quel arrêt peut-il y avoir un retard ?',
  ],
  'situation-v003-02': [
    'Lors d’une démonstration, les visiteurs déplacent les mêmes quatre caisses une par une, puis ensemble sur une palette. Quels résultats comparez-vous entre les deux méthodes ?',
    'Les visiteurs déplacent quatre caisses, une par une.\nPuis ils déplacent les mêmes caisses ensemble sur une palette.\nQu’est-ce que vous mesurez ou observez pour comparer les deux méthodes ?',
  ],
  'situation-v003-03': [
    'Une fiche de musée présente le conteneur avec un seul mode de transport. Réécrivez la légende pour expliquer ce que le conteneur change quand la marchandise passe d’un mode à un autre.',
    'Dans un musée, une fiche montre un conteneur avec un seul mode de transport.\nÉcrivez une nouvelle légende.\nExpliquez le rôle du conteneur quand la marchandise change de mode de transport.',
  ],
  'situation-v003-04': [
    'Pour une exposition, montrez comment un registre papier et un registre numérique suivent le même mouvement de stock. Proposez une démonstration avec une correction.',
    'Vous comparez un registre de stock sur papier et un registre numérique.\nMontrez comment enregistrer le même mouvement dans les deux registres.\nMontrez aussi comment corriger une erreur.',
  ],
  'maths-v005-pierre-2': [
    'Une simulation du chantier de Gizeh répartit 360 kg de blocs de démonstration en 9 lots de même masse. Calculez la masse nette d’un lot et arrondissez au centième de kilogramme.',
    'Vous simulez le transport de pierres à Gizeh.\nLes blocs pèsent 360 kg au total. Ils forment 9 lots identiques.\nCalculez la masse nette d’un lot en kg. Gardez deux chiffres après la virgule.',
  ],
  'maths-v005-pierre-4': [
    'Dans une simulation du chantier de Gizeh, vous disposez de 360 kg de blocs. Chaque lot demande 28 kg. Combien de lots complets pouvez-vous former et quelle masse reste-t-il ?',
    'Vous simulez le transport de pierres à Gizeh.\nVous avez 360 kg de blocs. Il faut 28 kg pour remplir un lot.\nCombien de lots complets pouvez-vous former ?\nCombien de kilogrammes restent en réserve ?',
  ],
  'maths-v005-pierre-5': [
    'Dans une simulation du chantier de Gizeh, la masse brute des blocs passe de 396 kg à 324 kg après le retrait d’une partie des blocs. Le contenant pèse 36 kg dans les deux cas. Quel pourcentage de la masse nette de départ avez-vous retiré ? Arrondissez à deux décimales.',
    'Vous pesez les blocs avec leur contenant.\nLa masse brute est de 396 kg avant le retrait et de 324 kg après.\nLe contenant pèse 36 kg dans les deux cas.\nCalculez le pourcentage de la masse nette de départ que vous avez retiré. Gardez deux chiffres après la virgule.',
  ],
  'maths-v005-ravitaillement-5': [
    'Une simulation de ravitaillement à l’époque de Napoléon commence avec 35 lots en attente. Pendant chacune des deux périodes, vous traitez 8 lots et 6 nouveaux arrivent. Combien de lots restent à traiter à la fin ?',
    'Vous simulez un ravitaillement à l’époque de Napoléon. Il y a 35 lots en attente.\nPendant chacune des deux périodes, vous traitez 8 lots et 6 lots arrivent.\nCombien de lots restent à traiter après les deux périodes ?',
  ],
  'trous-v006-1': [
    'Dans la chaîne ancienne, la chasse procurait la nourriture. On pouvait ensuite la ___ avant de la ___.',
    'Autrefois, on pouvait chasser pour obtenir de la nourriture.\nOn pouvait ensuite la ___. Puis on pouvait la ___.',
  ],
  'trous-v006-2': [
    'Pour fabriquer un article, l’entreprise commence par l’___ en matières premières. La ___ transforme ces matières. La ___ livre le produit fini.',
    'L’___ apporte les matières premières à l’entreprise.\nLa ___ transforme ces matières.\nLa ___ livre le produit fini.',
  ],
  'trous-v006-3': [
    'La route de la ___ reliait des régions d’Asie et d’Europe. Parmi les marchandises de la région baltique figurait l’___, qui est une résine fossilisée.',
    'La route de la ___ reliait des régions d’Asie et d’Europe.\nL’___ est une résine fossilisée. Une partie venait de la région de la mer Baltique.',
  ],
  'verification-acquis-v008-1': [
    'Dans un récit sur les routes commerciales, comment reconnaissez-vous l’ambre et d’où venait une partie de cette matière ?',
    'Un récit sur les routes commerciales parle de l’ambre.\nQuel type de matière est l’ambre ?\nDe quelle région venait une partie de l’ambre ?',
  ],
  'verification-acquis-v008-2': [
    'Comment un tunnel ferroviaire de base facilite-t-il le passage des trains de marchandises à travers les Alpes ?',
    'Des trains de marchandises traversent les Alpes.\nPourquoi un tunnel ferroviaire de base facilite-t-il leur trajet ?',
  ],
  'situation-acquis-v008-1': [
    'Un musée compare une caisse ancienne, dont on transfère le contenu à chaque relais, et un conteneur moderne scellé. Écrivez un commentaire qui explique ce que le conteneur change pour l’équipe de manutention.',
    'Au musée, vous voyez une caisse ancienne et un conteneur moderne scellé.\nÀ chaque relais, il fallait sortir les objets de la caisse ancienne.\nÉcrivez un court commentaire sur ce que le conteneur change pour l’équipe de manutention.',
  ],
  'situation-acquis-v008-2': [
    'Un ancien registre indique le nom du client sans numéro d’article. Un relevé moderne contient un numéro lu automatiquement. Expliquez comment partir de ce numéro pour retrouver le même article dans les deux documents.',
    'Dans l’ancien registre, vous lisez le nom du client. Il n’y a pas de numéro d’article.\nLe relevé moderne affiche un numéro d’article lu automatiquement.\nComment utilisez-vous ce numéro pour retrouver l’article dans les deux documents ?',
  ],
  'maths-acquis-v008-1': [
    'Dans une simulation sur la route de l’ambre, un artisan reçoit 23,4 kg d’ambre au premier relais. Après le façonnage, il expédie 18,6 kg de pièces et conserve 3,1 kg de chutes. Quelle masse reste à expliquer ?',
    'Vous simulez un échange sur la route de l’ambre.\nUn artisan reçoit 23,4 kg d’ambre.\nAprès le façonnage, il envoie 18,6 kg de pièces et garde 3,1 kg de chutes.\nQuelle masse manque dans son relevé ?',
  ],
  'frise-transport-v015': [
    'Complétez la frise en plaçant les dates manquantes, 1956 et 1896.',
    'Il manque deux dates dans la frise.\nPlacez 1956 et 1896 au bon endroit.',
  ],
  'frise-suivi-v015': [
    'Complétez la frise qui présente l’évolution du suivi des marchandises, du registre papier au scan.',
    'Le suivi des marchandises a changé, du registre papier au scan.\nComplétez les étapes de la frise.',
  ],
}

const wordingByModule: Readonly<Record<string, typeof module100>> = { '100': module100, '101': module101 }

export function reviewLogistiqueFoundationWording(units: readonly LogistiqueUnit[]): LogistiqueUnit[] {
  return units.map((unit) => {
    const authored = wordingByModule[unit.module]?.[unit.id.replace(`log-${unit.module}-`, '')]
    if (!authored || unit.wording) return unit
    const [normal, falc] = authored
    const wording: LogistiqueWording = { normal, falc }
    return { ...unit, prompt: normal, wording }
  })
}
