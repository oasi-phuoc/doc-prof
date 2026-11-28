import type { LogistiqueMathsWordingRule } from './formulations-v025'

export const logistiqueMathsWordingRules: readonly LogistiqueMathsWordingRule[] = [
  {
    pattern: /Le relevé avant action consigne (\d+) écarts et le relevé suivant en trouve (\d+) sur un effectif identique\. Quelle baisse relative du nombre d’écarts constatez-vous, au centième de pour cent \?$/u,
    normal: 'Le premier contrôle relève $1 écarts. Après l’action, le second en relève $2 sur le même nombre d’unités. De quel pourcentage le nombre d’écarts a-t-il baissé ? Arrondissez à deux décimales.',
    falc: 'Avant l’action, vous trouvez $1 écarts.\nAprès l’action, vous trouvez $2 écarts.\nVous contrôlez le même nombre d’unités.\nCalculez de quel pourcentage le nombre d’écarts a baissé.\nGardez deux chiffres après la virgule.',
  },
  {
    pattern: /Une série compte (\d+) ([^.]+) contrôlés et (\d+) écarts\. Calculez le taux d’écart au centième de pour cent\.$/u,
    normal: 'Le relevé porte sur $1 $2. Il indique $3 écarts. Calculez le taux d’écart et arrondissez le pourcentage à deux décimales.',
    falc: 'Le relevé porte sur $1 $2.\nIl indique $3 écarts.\nCalculez le taux d’écart en pourcentage.\nGardez deux chiffres après la virgule.',
  },
  {
    pattern: /Sur (\d+) ([^,]+), on trouve (\d+) écarts\. Sur (\d+) autres, on en trouve (\d+)\. Calculez le taux global au centième de pour cent\.$/u,
    normal: 'Le premier relevé compte $3 écarts sur $1 $2. Le second en compte $5 sur $4 autres. Calculez le taux d’écart des deux relevés réunis, à deux décimales.',
    falc: 'Premier relevé. Il y a $3 écarts sur $1 $2.\nDeuxième relevé. Il y a $5 écarts sur $4 autres.\nRéunissez les données des deux relevés.\nCalculez le taux d’écart en pourcentage, avec deux chiffres après la virgule.',
  },
  {
    pattern: /Le seuil de suivi est d’au plus (\d+) % d’écarts sur (\d+) ([^.]+)\. Quel nombre entier d’écarts est le maximum compatible \?$/u,
    normal: 'Le relevé porte sur $2 $3. Le taux d’écart doit rester inférieur ou égal à $1 %. Combien d’écarts entiers sont autorisés au maximum ?',
    falc: 'Le relevé porte sur $2 $3.\nLe taux d’écart peut aller jusqu’à $1 %.\nQuel est le plus grand nombre entier d’écarts autorisé ?',
  },
  {
    pattern: /Parmi (\d+) ([^,]+) contrôlés, (\d+) sont mis de côté\. Quelle fraction en pour cent reste dans le lot, au centième \?$/u,
    normal: 'Le contrôle porte sur $1 $2. Vous mettez $3 unités de côté. Quel pourcentage des unités reste dans le lot ? Arrondissez à deux décimales.',
    falc: 'Au départ, le lot contient $1 $2.\nVous mettez $3 unités de côté.\nQuel pourcentage des unités reste dans le lot ?\nGardez deux chiffres après la virgule.',
  },
  {
    pattern: /La fiche de l’exercice limite la masse totale à ([\d’'.,]+) kg\. L’unité actuelle pèse ([\d’'.,]+) kg\. Quel écart à la limite faut-il relever \?$/u,
    normal: 'La masse maximale est de $1 kg. L’unité pèse $2 kg. Indiquez la différence et précisez si la masse est au-dessus ou en dessous de la limite.',
    falc: 'La masse maximale est de $1 kg.\nL’unité pèse $2 kg.\nCombien de kilogrammes séparent les deux valeurs ?\nLa masse réelle est-elle au-dessus ou en dessous de la limite ?',
  },
  {
    pattern: /La masse brute de ([\d’'.,]+) kg inclut un support de ([\d’'.,]+) kg\. Calculez la masse nette de ([^.]+)\.$/u,
    normal: 'La masse brute est de $1 kg, dont $2 kg pour le support. Calculez la masse nette des $3.',
    falc: 'Avec le support, les $3 pèsent $1 kg. C’est la masse brute.\nLe support seul pèse $2 kg.\nCalculez la masse nette, sans le support.',
  },
  {
    pattern: /Le suivi mesure (\d+) ([^.]+) par minute à l’entrée du flux\. Quel total attend-on en (\d+) min à cadence constante \?$/u,
    normal: 'À l’entrée du flux, il arrive $1 $2 par minute. Calculez le total attendu en $3 min si la cadence reste constante.',
    falc: 'Il arrive $1 $2 chaque minute.\nLa cadence reste la même.\nCombien d’unités arrivent en $3 min ?',
  },
  {
    pattern: /Le flux reçoit (\d+) ([^.]+) par minute et traite (\d+) par minute\. Quel nombre d’unités s’ajoute à la file en (\d+) min \?$/u,
    normal: 'Chaque minute, $1 $2 arrivent et le poste en traite $3. Combien d’unités s’ajoutent à la file en $4 min ?',
    falc: 'Chaque minute, il arrive $1 $2.\nLe poste traite $3 unités par minute.\nCombien d’unités s’ajoutent à la file d’attente en $4 min ?',
  },
  {
    pattern: /Une réserve de file accepte (\d+) ([^.]+)\. À une accumulation de (\d+) ([^.]+) par minute, après combien de minutes la réserve atteint-elle sa limite \? Donnez la durée au centième\.$/u,
    normal: 'La zone d’attente peut contenir $1 $2. La file augmente de $3 $4 par minute. Calculez le temps nécessaire pour remplir la zone, à deux décimales.',
    falc: 'La zone d’attente peut contenir $1 $2.\nLa file gagne $3 $4 par minute.\nAu bout de combien de minutes la zone est-elle pleine ?\nGardez deux chiffres après la virgule.',
  },
  {
    pattern: /Deux opérateurs se relaient\. Le premier traite (\d+) ([^.]+) par minute pendant (\d+) min et le second (\d+) pendant (\d+) min\. Calculez la cadence moyenne au centième sur ces deux durées\.$/u,
    normal: 'Le premier opérateur traite $1 $2 par minute pendant $3 min. Le second en traite $4 par minute pendant $5 min. Calculez la cadence moyenne sur les deux périodes et arrondissez à deux décimales.',
    falc: 'Le premier opérateur travaille $3 min. Il traite $1 $2 par minute.\nLe second travaille $5 min. Il traite $4 unités par minute.\nCalculez la cadence moyenne sur tout le temps de travail.\nGardez deux chiffres après la virgule.',
  },
  {
    pattern: /Le relevé A satisfait (\d+) ([^.]+) sur (\d+), le B (\d+) sur (\d+)\. Calculez le taux commun sans compter d’unité deux fois\.$/u,
    normal: 'Dans le relevé A, $1 $2 sur $3 remplissent les conditions. Dans le relevé B, $4 sur $5 remplissent les mêmes conditions. Calculez le taux global en comptant chaque unité une seule fois.',
    falc: 'Relevé A. Le résultat attendu est atteint pour $1 $2 sur $3.\nRelevé B. Il est atteint pour $4 unités sur $5.\nCalculez le taux pour les deux relevés ensemble.\nComptez chaque unité une seule fois.',
  },
  {
    pattern: /Le parcours comporte deux tronçons de (\d+) et (\d+) km\. Quelle distance figure au relevé de trajet \?$/u,
    normal: 'Le parcours comporte deux tronçons de $1 km et $2 km. Quelle distance totale devez-vous inscrire sur le relevé ?',
    falc: 'Le trajet a deux parties. La première fait $1 km.\nLa deuxième fait $2 km.\nQuelle distance totale notez-vous sur le relevé ?',
  },
  {
    pattern: /Les tronçons durent (\d+) et (\d+) min, séparés par un transfert de (\d+) min\. Quelle durée totale annoncer \?$/u,
    normal: 'Les trajets durent $1 min et $2 min. Un transfert de $3 min les sépare. Quelle est la durée totale, transfert compris ?',
    falc: 'Le premier trajet dure $1 min.\nLe deuxième trajet dure $2 min.\nEntre les deux, le transfert dure $3 min.\nCombien de temps faut-il en tout ?',
  },
  {
    pattern: /Le parcours complet de (\d+) km doit finir dans les (\d+) min\. Les déplacements et le transfert demandent (\d+) min\. Calculez la marge ou le dépassement par rapport au délai\.$/u,
    normal: 'Le parcours de $1 km doit être terminé en $2 min. Les trajets et le transfert durent $3 min. Indiquez le temps restant ou la durée du dépassement.',
    falc: 'Le parcours fait $1 km.\nLe délai est de $2 min.\nLes trajets et le transfert prennent $3 min.\nCombien de minutes reste-t-il ? Si le délai est dépassé, indiquez de combien.',
  },
  {
    pattern: /Le trajet parcourt (\d+) km en (\d+) min de déplacement\. Une attente de (\d+) min s’ajoute\. Calculez la vitesse moyenne sur la durée totale, au dixième de kilomètre par heure\.$/u,
    normal: 'Les $1 km de trajet demandent $2 min de déplacement et $3 min d’attente. Calculez la vitesse moyenne, attente comprise, et arrondissez au dixième de km/h.',
    falc: 'Le trajet fait $1 km.\nLe déplacement dure $2 min.\nL’attente dure $3 min.\nCalculez la vitesse moyenne pour toute la durée, avec l’attente.\nDonnez le résultat en km/h, avec un chiffre après la virgule.',
  },
  {
    pattern: /Il reste (\d+) km et (\d+) min de déplacement prévus\. Le délai de livraison permet (\d+) min pour terminer\. Quel délai intermédiaire maximum peut-on absorber, si le temps de déplacement reste le même \?$/u,
    normal: 'Il reste $1 km à parcourir, ce qui prend $2 min. Vous disposez de $3 min avant l’échéance. Combien de minutes de retard supplémentaires pouvez-vous absorber sans changer la durée du trajet ?',
    falc: 'Il reste $1 km à parcourir. Le déplacement prend $2 min.\nIl reste $3 min avant l’heure limite.\nCombien de minutes pouvez-vous attendre tout en arrivant à temps ? La durée du trajet reste la même.',
  },
  {
    pattern: /La zone rectangulaire mesure ([\d’'.,]+) m sur ([\d’'.,]+) m\. Quel nombre de mètres carrés faut-il inscrire au plan \?$/u,
    normal: 'La zone rectangulaire mesure $1 m sur $2 m. Quelle surface en mètres carrés faut-il inscrire sur le plan ?',
    falc: 'La zone est un rectangle.\nElle mesure $1 m sur $2 m.\nCalculez la surface en mètres carrés à noter sur le plan.',
  },
  {
    pattern: /Pour (\d+) ([^,]+), le tarif est de CHF ([\d’'.,]+) par unité et CHF ([\d’'.,]+) de frais fixes\. Quel est le total à prévoir \?$/u,
    normal: 'Le tarif pour $1 $2 est de CHF $3 par unité. Des frais fixes de CHF $4 s’ajoutent. Quel montant total faut-il prévoir ?',
    falc: 'Il y a $1 $2.\nChaque unité coûte CHF $3.\nLes frais fixes sont de CHF $4 pour l’ensemble.\nQuel montant faut-il payer en tout ?',
  },
  {
    pattern: /Deux offres de même périmètre facturent CHF ([\d’'.,]+) l’unité avec CHF ([\d’'.,]+) de frais, ou CHF ([\d’'.,]+) sans supplément\. À partir de combien de ([^.]+) la première devient-elle strictement moins chère \?$/u,
    normal: 'Les deux offres couvrent le même service. La première coûte CHF $1 par unité, plus CHF $2 de frais fixes. La seconde coûte CHF $3 par unité, sans frais fixes. À partir de combien de $4 la première est-elle moins chère ?',
    falc: 'Les deux offres couvrent le même service.\nOffre A. Vous payez CHF $1 par unité, plus CHF $2 de frais fixes.\nOffre B. Vous payez CHF $3 par unité, sans frais fixes.\nÀ partir de combien de $4 l’offre A coûte-t-elle moins cher ?',
  },
  {
    pattern: /Sur un budget de CHF ([\d’'.,]+), comptez CHF ([\d’'.,]+) de frais puis CHF ([\d’'.,]+) par unité\. Combien de ([^.]+) peut-on payer au maximum \?$/u,
    normal: 'Le budget est de CHF $1. Les frais fixes sont de CHF $2 et le prix est de CHF $3 par unité. Combien de $4 peut-on acheter au maximum ?',
    falc: 'Vous avez CHF $1.\nVous devez payer CHF $2 de frais fixes.\nChaque unité coûte CHF $3.\nCombien de $4 pouvez-vous acheter au maximum ?',
  },
  {
    pattern: /Le plan prévoit (\d+) emplacements de ([^,]+), dont (\d+) occupés\. Quel est le taux d’occupation au centième de pour cent \?$/u,
    normal: 'Sur $1 emplacements de $2, $3 sont occupés. Calculez le taux d’occupation et arrondissez le pourcentage à deux décimales.',
    falc: 'Il y a $1 emplacements de $2.\n$3 sont occupés.\nCalculez le taux d’occupation en pourcentage.\nGardez deux chiffres après la virgule.',
  },
  {
    pattern: /Sur (\d+) places, (\d+) sont prises\. Il faut en laisser au moins (\d+) libres\. Combien de ([^.]+) peut-on ajouter selon ce critère \?$/u,
    normal: 'Le dépôt offre $1 places. Parmi elles, $2 sont occupées. On doit garder au moins $3 places libres. Combien de $4 peut-on encore ranger ?',
    falc: 'Il y a $1 places dans le dépôt.\n$2 places sont déjà occupées.\nVous devez garder au moins $3 places libres.\nCombien de $4 pouvez-vous ajouter ?',
  },
  {
    pattern: /Une caisse rectangulaire mesure intérieurement (\d+) × (\d+) × (\d+) cm\. Quel est son volume utile en litres \? Prenez 1 L = 1 000 cm³\.$/u,
    normal: 'Les dimensions intérieures de la caisse sont de $1 × $2 × $3 cm. Calculez son volume utile en litres avec 1 L = 1 000 cm³.',
    falc: 'Mesures à l’intérieur de la caisse.\nLongueur de $1 cm. Largeur de $2 cm. Hauteur de $3 cm.\nCalculez le volume utile en litres.\nUtilisez 1 L = 1 000 cm³.',
  },
  {
    pattern: /Un emballage de ([\d’'.,]+) L n’est rempli qu’à (\d+) %\. Quel volume représente le contenu, au millième de litre \?$/u,
    normal: 'L’emballage a une capacité de $1 L. Il est rempli à $2 %. Calculez le volume du contenu et arrondissez au millième de litre.',
    falc: 'L’emballage peut contenir $1 L.\nIl est rempli à $2 %.\nCalculez combien de litres il contient.\nGardez trois chiffres après la virgule.',
  },
]
