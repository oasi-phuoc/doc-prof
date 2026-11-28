import type { LogistiqueMathsWordingRule } from './formulations-v025'

export const logistiqueCapacityWordingRules: readonly LogistiqueMathsWordingRule[] = [
  {
    pattern: /Le dossier mentionne (\d+) ([^.]+)\. Le contrôle trouve (\d+) groupes de (\d+) et (\d+) unités isolées\. Quel écart signé faut-il transmettre \?$/u,
    normal: 'Le dossier annonce $1 $2. Vous comptez $3 groupes de $4 et $5 unités séparées. Calculez l’écart signé en retirant la quantité prévue de la quantité comptée.',
    falc: 'Le dossier annonce $1 $2.\nVous comptez $3 groupes de $4 et $5 unités seules.\nFaites le total compté moins le total prévu.\nQuel est l’écart signé ?',
  },
  {
    pattern: /La file contient (\d+) ([^.]+)\. Pendant chacune de deux périodes, on en traite (\d+) et (\d+) nouveaux arrivent\. À combien s’élève la file après les deux périodes \?$/u,
    normal: 'Au départ, $1 $2 sont en attente. Durant chacune des deux périodes, vous en traitez $3 et $4 nouvelles unités arrivent. Combien d’unités restent en attente à la fin ?',
    falc: 'Il y a $1 $2 en attente.\nIl y a deux périodes. À chaque période, vous traitez $3 unités et $4 autres arrivent.\nCombien d’unités restent en attente après les deux périodes ?',
  },
  {
    pattern: /Le plan autorise une trame régulière de ([\d’'.,]+) m sur ([\d’'.,]+) m par unité\. Dans une zone utile de ([\d’'.,]+) m sur ([\d’'.,]+) m, combien de ([^.]+) tiennent dans cette orientation \?$/u,
    normal: 'La zone utile mesure $3 m de long et $4 m de large. Chaque place occupe $1 m dans le sens de la longueur et $2 m dans le sens de la largeur. Combien de $5 pouvez-vous ranger dans cette orientation ?',
    falc: 'La zone utile mesure $3 m de long et $4 m de large.\nChaque place prend $1 m dans la longueur et $2 m dans la largeur.\nCombien de $5 pouvez-vous ranger dans cette orientation ?',
  },
  {
    pattern: /Deux trames régulières sont autorisées pour ([^.]+)\. La zone mesure ([\d’'.,]+) m sur ([\d’'.,]+) m\. Comparez les capacités selon que le côté de ([\d’'.,]+) m ou celui de ([\d’'.,]+) m est parallèle à la longueur\.$/u,
    normal: 'Vous rangez des $1 dans une zone de $2 m de long sur $3 m de large. Vous pouvez orienter le côté de $4 m ou celui de $5 m dans le sens de la longueur. Calculez la capacité pour chaque orientation.',
    falc: 'La zone des $1 mesure $2 m de long et $3 m de large.\nVous pouvez mettre le côté de $4 m dans le sens de la longueur. Vous pouvez aussi y mettre le côté de $5 m.\nCombien de places obtenez-vous dans chaque cas ?',
  },
  {
    pattern: /Dans les (\d+) ([^.]+) contrôlés, (\d+) sont signalés pour un premier motif et (\d+) pour un autre\. (\d+) sont comptés dans les deux groupes\. Combien d’unités distinctes sont signalées \?$/u,
    normal: 'Vous contrôlez $1 $2. Vous signalez $3 unités pour un premier motif et $4 pour un autre. Parmi elles, $5 apparaissent dans les deux groupes. Combien d’unités distinctes avez-vous signalées ?',
    falc: 'Vous contrôlez $1 $2.\nVous signalez $3 unités pour une raison et $4 pour une autre.\n$5 unités figurent dans les deux groupes.\nCombien d’unités distinctes avez-vous signalées ? Comptez chaque unité une seule fois.',
  },
  {
    pattern: /La masse nette de ([\d’'.,]+) kg est répartie également dans (\d+) unités de ([^.]+)\. Calculez la masse nette par unité au centième de kilogramme\.$/u,
    normal: 'Vous répartissez $1 kg de $3 en $2 unités de même masse. Calculez la masse nette par unité et arrondissez au centième de kilogramme.',
    falc: 'La masse nette de $3 est de $1 kg au total.\nVous faites $2 unités de même masse.\nQuelle est la masse nette d’une unité en kg ? Gardez deux chiffres après la virgule.',
  },
  {
    pattern: /Le stock dispose de ([\d’'.,]+) kg de ([^.]+)\. Une unité consomme ([\d’'.,]+) kg\. Combien d’unités entières ce stock couvre-t-il et quelle masse reste-t-il \?$/u,
    normal: 'Vous disposez de $1 kg de $2. Chaque unité nécessite $3 kg. Combien d’unités complètes pouvez-vous obtenir et quelle masse reste-t-il ?',
    falc: 'Vous avez $1 kg de $2.\nIl faut $3 kg pour une unité.\nCombien d’unités complètes pouvez-vous obtenir ?\nCombien de kilogrammes restent ?',
  },
  {
    pattern: /Deux relevés de masse brute donnent ([\d’'.,]+) kg avant la remise d’une partie et ([\d’'.,]+) kg après\. Le contenant de ([\d’'.,]+) kg est identique\. Quel pourcentage de la masse de ([^.]+) a été retiré, au centième \?$/u,
    normal: 'La masse brute passe de $1 kg à $2 kg après le retrait d’une partie du contenu. Le contenant pèse $3 kg dans les deux cas. Quel pourcentage de la masse nette de $4 a été retiré ? Arrondissez à deux décimales.',
    falc: 'Vous pesez le contenu avec son contenant. La masse brute passe de $1 kg à $2 kg après le retrait.\nLe contenant pèse $3 kg dans les deux cas.\nQuel pourcentage de la masse nette de $4 a été retiré ? Gardez deux chiffres après la virgule.',
  },
  {
    pattern: /Un niveau complet de (\d+) ([^.]+) est condamné\. Combien de positions restent sur les (\d+) prévues \?$/u,
    normal: 'Sur les $3 positions prévues, vous devez fermer un niveau qui accueille $1 $2. Combien de positions restent utilisables ?',
    falc: 'Le plan prévoit $3 positions.\nUn niveau est fermé. Il pouvait recevoir $1 $2.\nCombien de positions pouvez-vous encore utiliser ?',
  },
  {
    pattern: /Le plan prévoit (\d+) positions pour ([^.]+)\. (\d+) positions sont fermées\. Quelle part en pour cent reste exploitable, au centième \?$/u,
    normal: 'Le plan prévoit $1 positions pour les $2. Parmi ces positions, $3 sont fermées. Quel pourcentage reste utilisable ? Arrondissez à deux décimales.',
    falc: 'Il y a $1 positions pour les $2.\nLe site ferme $3 positions.\nQuel pourcentage des positions pouvez-vous encore utiliser ? Gardez deux chiffres après la virgule.',
  },
  {
    pattern: /Dans cet exercice de lecture, la charge maximale indiquée est de (\d+) kg pour un niveau\. Chaque unité pèse (\d+) kg\. Combien d’unités respecte cette limite et la limite de (\d+) positions \?$/u,
    normal: 'Dans cet exercice, un niveau supporte au maximum $1 kg et offre $3 positions. Chaque unité pèse $2 kg. Combien d’unités pouvez-vous ranger en respectant les deux limites ?',
    falc: 'Dans cet exercice, le niveau supporte au maximum $1 kg. Il y a $3 positions sur le niveau.\nChaque unité pèse $2 kg.\nCombien d’unités pouvez-vous ranger au maximum ? Respectez les deux limites.',
  },
  {
    pattern: /Vous devez trouver (\d+) positions sur un plan\. Chaque travée entière en fournit (\d+)\. Combien de travées faut-il au minimum \?$/u,
    normal: 'Il vous faut $1 positions de stockage. Chaque travée offre $2 positions. Quel est le nombre minimal de travées nécessaires ?',
    falc: 'Vous avez besoin de $1 positions de stockage.\nChaque travée offre $2 positions.\nCombien de travées vous faut-il au minimum ?',
  },
  {
    pattern: /La cadence attendue est de (\d+) ([^.]+) par minute pendant (\d+) min\. Un arrêt empêche tout traitement pendant (\d+) min\. Combien d’unités de moins terminent ce créneau \?$/u,
    normal: 'Le poste traite normalement $1 $2 par minute pendant $3 min. Dans ce créneau, il s’arrête complètement pendant $4 min. Combien d’unités traite-t-il en moins ?',
    falc: 'Le poste doit traiter $1 $2 par minute pendant $3 min.\nIl s’arrête complètement pendant $4 min.\nCombien d’unités sont traitées en moins à cause de cet arrêt ?',
  },
  {
    pattern: /Le volume mesuré est de ([\d’'.,]+) L par unité pour (\d+) ([^.]+)\. Quel volume total en m³ faut-il relever \? Prenez 1 m³ = 1 000 L et arrondissez au millième\.$/u,
    normal: 'Vous avez $2 $3. Chaque unité a un volume de $1 L. Calculez leur volume total en m³. Utilisez 1 m³ = 1 000 L et arrondissez au millième.',
    falc: 'Vous avez $2 $3. Le volume de chaque unité est de $1 L.\nCalculez le volume total en m³. Utilisez 1 m³ = 1 000 L.\nGardez trois chiffres après la virgule.',
  },
  {
    pattern: /Le dossier impose une limite de ([\d’'.,]+) L et l’unité complétée mesure ([\d’'.,]+) L\. Calculez l’écart absolu à la limite et indiquez son sens\.$/u,
    normal: 'La limite est de $1 L. Le volume de l’unité remplie est de $2 L. Calculez l’écart absolu et dites si le volume est inférieur, égal ou supérieur à la limite.',
    falc: 'La limite est de $1 L. L’unité remplie contient $2 L.\nCombien de litres séparent les deux valeurs ?\nDites si le volume est inférieur, égal ou supérieur à la limite.',
  },
  {
    pattern: /Une caisse a une base intérieure de (\d+) × (\d+) cm\. Pour recevoir ([\d’'.,]+) L, quelle hauteur intérieure minimale faut-il dans ce modèle rectangulaire \?$/u,
    normal: 'La base intérieure de la caisse rectangulaire mesure $1 × $2 cm. Quelle hauteur intérieure minimale faut-il pour contenir $3 L ?',
    falc: 'La base intérieure de la caisse est un rectangle de $1 cm sur $2 cm.\nLa caisse doit contenir $3 L.\nQuelle hauteur intérieure faut-il au minimum ?',
  },
  {
    pattern: /Le site exige au moins (\d+) % de ([^.]+) satisfait(?:es|s) sur (\d+) au total\. Quel est le nombre entier minimal à atteindre \?$/u,
    normal: 'Le relevé compte $3 $2. Le site veut en satisfaire au moins $1 %. Combien doivent remplir les conditions au minimum ?',
    falc: 'Le relevé porte sur $3 $2.\nL’objectif est d’en satisfaire au moins $1 %.\nQuel est le plus petit nombre entier d’unités qui permet d’atteindre l’objectif ?',
  },
  {
    pattern: /Le dossier satisfait d’abord (\d+) des (\d+) ([^.]+)\. Une correction rend (\d+) unités supplémentaires conformes\. De combien de points de pourcentage le taux augmente-t-il \?$/u,
    normal: 'Au départ, $1 $3 sur $2 remplissent les conditions. Après une correction, $4 unités de plus les remplissent. De combien de points de pourcentage le taux augmente-t-il ?',
    falc: 'Le relevé porte sur $2 $3.\nAu départ, $1 unités remplissent les conditions. Après la correction, $4 unités de plus les remplissent.\nDe combien de points de pourcentage le taux augmente-t-il ?',
  },
  {
    pattern: /Pour la période, le dossier attribue CHF (\d+) au personnel, CHF (\d+) au local et CHF (\d+) aux équipements\. Calculez le total de ces postes\.$/u,
    normal: 'Sur la même période, le personnel coûte CHF $1, le local CHF $2 et les équipements CHF $3. Calculez le total de ces coûts.',
    falc: 'Pour cette période, le personnel coûte CHF $1.\nLe local coûte CHF $2.\nLes équipements coûtent CHF $3.\nCombien coûtent ces trois postes en tout ?',
  },
  {
    pattern: /Le dossier annonce (\d+) ([^.]+) et CHF (\d+) de coût variable par unité\. Quel coût variable total faut-il retenir \?$/u,
    normal: 'Le coût variable est de CHF $3 par unité pour $1 $2. Calculez le coût variable total.',
    falc: 'Vous avez $1 $2.\nLe coût variable de chaque unité est de CHF $3.\nQuel est le coût variable total ?',
  },
  {
    pattern: /Les postes fixes totalisent CHF (\d+)\. Ajoutez CHF (\d+) de coûts variables\. Quel montant complet obtient-on \?$/u,
    normal: 'Les coûts fixes atteignent CHF $1 et les coûts variables CHF $2. Quel est le coût total ?',
    falc: 'Les coûts fixes sont de CHF $1.\nLes coûts variables sont de CHF $2.\nQuel est le montant de tous ces coûts ensemble ?',
  },
  {
    pattern: /Dans les CHF (\d+) de coûts du poste, les frais du local valent CHF (\d+)\. Quelle part représentent-ils, au centième de pour cent \?$/u,
    normal: 'Le coût total du poste est de CHF $1, dont CHF $2 pour le local. Calculez la part des frais du local en pourcentage et arrondissez à deux décimales.',
    falc: 'Le poste coûte CHF $1 en tout. Les frais du local sont de CHF $2.\nQuel pourcentage du coût total correspond au local ?\nGardez deux chiffres après la virgule.',
  },
  {
    pattern: /Un espace de travail conserve (\d+) ([^.]+) de (\d+) Mo chacun en moyenne\. Calculez l’espace estimé occupé\.$/u,
    normal: 'L’espace de travail contient $1 $2. Chaque élément occupe en moyenne $3 Mo. Estimez l’espace total occupé.',
    falc: 'Vous stockez $1 $2.\nUn élément occupe $3 Mo en moyenne.\nQuel espace occupent tous les éléments environ ?',
  },
  {
    pattern: /La limite d’exercice est de (\d+) Mo\. La collection actuelle occupe (\d+) Mo\. Quelle marge reste-t-il avant la limite \?$/u,
    normal: 'Dans cet exercice, vous disposez de $1 Mo. Les fichiers occupent déjà $2 Mo. Combien de mégaoctets restent libres ?',
    falc: 'Vous disposez de $1 Mo.\nVos fichiers prennent déjà $2 Mo.\nCombien de Mo pouvez-vous encore utiliser ?',
  },
  {
    pattern: /Le dossier de travail conserve (\d+) versions de (\d+) Mo pour le même fichier\. Quel espace représentent ces copies \?$/u,
    normal: 'Le dossier contient $1 versions du même fichier. Chaque version occupe $2 Mo. Quel espace occupent ces versions ensemble ?',
    falc: 'Vous gardez $1 versions du même fichier.\nChaque version prend $2 Mo.\nCombien de Mo prennent toutes les versions ensemble ?',
  },
  {
    pattern: /Un dossier de (\d+) Mo est révisé en retirant (\d+) Mo puis en ajoutant (\d+) Mo\. Quel est le nouveau volume occupé \?$/u,
    normal: 'Votre dossier occupe $1 Mo. Vous retirez $2 Mo de fichiers, puis ajoutez $3 Mo. Quel espace le dossier occupe-t-il après la mise à jour ?',
    falc: 'Votre dossier prend $1 Mo.\nVous enlevez $2 Mo. Puis vous ajoutez $3 Mo.\nCombien de Mo prend le dossier après la mise à jour ?',
  },
  {
    pattern: /Les quatre lignes du tableau indiquent (\d+, \d+, \d+, \d+) ([^.]+)\. Calculez le total à inscrire\.$/u,
    normal: 'Le tableau indique quatre quantités de $2 : $1. Calculez le total à inscrire.',
    falc: 'Le tableau donne quatre quantités de $2.\nLes nombres sont $1.\nQuel total inscrivez-vous ?',
  },
  {
    pattern: /Le tableau indique (\d+, \d+, \d+, \d+) ([^.]+) pour quatre périodes\. Quelle est la moyenne au centième par période \?$/u,
    normal: 'Pour quatre périodes, le tableau indique les quantités de $2 suivantes : $1. Calculez la moyenne par période et arrondissez à deux décimales.',
    falc: 'Le tableau donne la quantité de $2 pour chacune des quatre périodes.\nLes nombres sont $1.\nCalculez la moyenne par période. Gardez deux chiffres après la virgule.',
  },
  {
    pattern: /Le total attendu est de (\d+) ([^.]+)\. Le tableau comporte (\d+, \d+, \d+, \d+)\. Calculez l’écart signé constaté moins attendu\.$/u,
    normal: 'Vous attendez $1 $2 au total. Le tableau présente les quantités $3. Calculez l’écart signé en soustrayant le total attendu du total relevé.',
    falc: 'Vous attendez $1 $2 en tout.\nLe tableau donne les quantités $3.\nCalculez le total relevé. Retirez le total attendu.\nQuel est l’écart signé ?',
  },
  {
    pattern: /Dans le tableau de (\d+) ([^.]+) au total, la deuxième ligne vaut (\d+)\. Quelle part du total cette ligne représente-t-elle, au centième de pour cent \?$/u,
    normal: 'Le tableau totalise $1 $2. La deuxième ligne en compte $3. Quel pourcentage du total cette ligne représente-t-elle ? Arrondissez à deux décimales.',
    falc: 'Le tableau compte $1 $2 en tout.\nLa deuxième ligne en compte $3.\nCalculez la part de cette ligne en pourcentage. Gardez deux chiffres après la virgule.',
  },
  {
    pattern: /Le tableau totalise (\d+) ([^.]+)\. Une correction remplace la dernière ligne de (\d+) par (\d+)\. Quel total faut-il maintenant présenter \?$/u,
    normal: 'Le tableau totalise $1 $2. Vous remplacez la valeur $3 de la dernière ligne par $4. Quel total devez-vous présenter après la correction ?',
    falc: 'Le tableau compte $1 $2 en tout.\nSur la dernière ligne, vous corrigez $3 en $4.\nQuel est le nouveau total ?',
  },
  {
    pattern: /Trois ventes facturées valent CHF (\d+), (\d+) et (\d+)\. Calculez le chiffre d’affaires de ces opérations avant toute correction\.$/u,
    normal: 'Trois factures s’élèvent à CHF $1, CHF $2 et CHF $3. Calculez le chiffre d’affaires de ces ventes avant toute correction.',
    falc: 'Vous avez trois factures : CHF $1, CHF $2 et CHF $3.\nQuel est le chiffre d’affaires de ces ventes avant toute correction ?',
  },
  {
    pattern: /Le prix convenu est CHF (\d+) et le débiteur verse un acompte de CHF (\d+)\. Quel solde doit-il encore régler \?$/u,
    normal: 'Le prix convenu est de CHF $1. Le client, qui est le débiteur, verse un acompte de CHF $2. Quel solde doit-il payer ?',
    falc: 'Le client doit payer CHF $1 en tout.\nIl verse déjà un acompte de CHF $2.\nQuel montant lui reste-t-il à payer ? C’est le solde.',
  },
  {
    pattern: /Les ventes sont facturées CHF (\d+), (\d+) et (\d+)\. Les deux premières sont payées et la dernière donne un acompte de CHF (\d+)\. Calculez le montant encaissé\.$/u,
    normal: 'Les factures de CHF $1 et CHF $2 sont entièrement payées. Pour la troisième, de CHF $3, vous avez reçu un acompte de CHF $4. Quel montant avez-vous encaissé au total ?',
    falc: 'Vous recevez le paiement complet de deux factures : CHF $1 et CHF $2.\nLa troisième facture est de CHF $3. Vous recevez un acompte de CHF $4.\nCombien avez-vous encaissé en tout ?',
  },
  {
    pattern: /Le prix des marchandises de la commande vaut CHF (\d+)\. L’offre prévoit CHF (\d+) pour la livraison et le client a payé CHF (\d+)\. Quel montant reste à encaisser selon ces conditions \?$/u,
    normal: 'Les marchandises coûtent CHF $1 et la livraison CHF $2. Le client a déjà payé CHF $3. Quel montant devez-vous encore encaisser ?',
    falc: 'La commande coûte CHF $1. La livraison coûte CHF $2 en plus.\nLe client a déjà payé CHF $3.\nCombien devez-vous encore encaisser ?',
  },
  {
    pattern: /Un avoir de CHF (\d+) corrige la vente de CHF (\d+)\. Les deux autres ventes sont de CHF (\d+) et (\d+)\. Calculez le chiffre d’affaires corrigé pour ces ventes\.$/u,
    normal: 'Un avoir de CHF $1 réduit la vente de CHF $2. Les deux autres ventes sont de CHF $3 et CHF $4. Calculez le chiffre d’affaires corrigé de ces trois ventes.',
    falc: 'Une vente de CHF $2 est réduite par un avoir de CHF $1.\nLes deux autres ventes sont de CHF $3 et CHF $4.\nQuel est le chiffre d’affaires après cette correction ?',
  },
]
