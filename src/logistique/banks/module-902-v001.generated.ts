import type { LogistiqueUnit } from '../approved-banks'

export const module902 = [
  {
    "id": "log-902-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "Les études de cas logistiques",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "Objectifs",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Exploiter les quantités, les délais, les coûts et les documents d’une situation professionnelle.",
          "Séparer les faits observés, les suppositions et les décisions encore à prendre.",
          "Justifier une recommandation à partir du service attendu, du stock disponible et des contraintes du transport.",
          "Laisser une trace utilisable par un collègue ou par le partenaire suivant."
        ]
      },
      {
        "kind": "heading",
        "text": "1. Une méthode en quatre étapes",
        "sub": false
      },
      {
        "kind": "image",
        "src": "/assets/logistique/900/902/cfc/log-902-methode-etude-cas-schema-v001.svg",
        "alt": "Lire les données, calculer les écarts, prendre une décision puis laisser une trace.",
        "caption": "Une démarche de résolution qui mène de l’énoncé au contrôle de la décision."
      },
      {
        "kind": "heading",
        "text": "1.1 Lire la situation",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Repérez la question à résoudre et la date de référence du cas. Notez les données utiles, leur unité et leur provenance. Une quantité attendue peut venir d’une commande. Une quantité reçue doit être vérifiée dans le relevé de réception. Un colis déposé au quai n’est disponible à la vente qu’après les contrôles prévus par l’entreprise."
      },
      {
        "kind": "paragraph",
        "text": "Une {g}contrainte impérative{/g} est une condition qu’une solution doit respecter. Exemples : une capacité maximale, une heure de livraison imposée ou l’interdiction de fractionner un envoi. Un {g}critère de comparaison{/g} sert ensuite à départager les solutions admises, par exemple le prix ou la durée."
      },
      {
        "kind": "heading",
        "text": "1.2 Calculer et comparer",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Utilisez une unité commune. Convertissez les colis en pièces avant de comparer les quantités. Rapprochez les durées et les heures d’arrivée. Détaillez les postes retenus dans les calculs de coût. Lorsque l’arrondi influence le choix, conservez une valeur intermédiaire assez précise."
      },
      {
        "kind": "paragraph",
        "text": "Indiquez le sens d’un écart avec sa formule. Dans les exercices du module, {g}écart de réception = quantité reçue − quantité attendue{/g}. Un résultat négatif signale un manque selon cette convention."
      },
      {
        "kind": "heading",
        "text": "1.3 Prendre une décision",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Écartez les options qui ne respectent pas les contraintes impératives. Comparez les autres avec les critères annoncés. Expliquez votre choix en une phrase qui associe le résultat du calcul, une condition du cas et la suite à donner."
      },
      {
        "kind": "paragraph",
        "text": "Si une donnée manque, précisez ce qu’il faut vérifier. Vous pouvez proposer une action provisoire qui respecte la procédure du site et protège les opérations suivantes."
      },
      {
        "kind": "heading",
        "text": "1.4 Transmettre et contrôler",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Consignez un identifiant de commande ou de colis, les unités, le résultat et l’état du dossier. Indiquez qui doit recevoir l’information. Après l’action, vérifiez le résultat au moment approprié, par exemple avec un recomptage ou une preuve de livraison."
      },
      {
        "kind": "heading",
        "text": "2. Réception et contrôle de quantité",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "2.1 Préparer le rapprochement",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Repérez la référence d’article et la quantité commandée. Comparez la commande, le document de livraison et le relevé physique. Lorsque le nombre total est calculé à partir des cartons, vérifiez que les cartons ont la même contenance et que les cartons ouverts ont été comptés séparément."
      },
      {
        "kind": "table",
        "headers": [
          "Donnée",
          "Origine dans le cas",
          "Utilisation"
        ],
        "rows": [
          [
            "Quantité attendue",
            "Commande ou accord confirmé",
            "Référence du rapprochement"
          ],
          [
            "Quantité reçue",
            "Comptage ou mesure du lot physique",
            "Calcul de l’écart de réception"
          ],
          [
            "Quantité écartée",
            "Relevé du contrôle de conformité",
            "Séparation du stock utilisable"
          ],
          [
            "Quantité admise",
            "Quantité reçue admissible d’après le contrôle",
            "Mise à jour du stock utilisable"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "2.2 Traiter deux écarts distincts",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Un manque à la livraison concerne la quantité. Un dommage concerne l’état d’une partie de la quantité reçue. Enregistrer l’un comme s’il était l’autre fausse le relevé et peut expliquer à tort un mouvement de stock ou une réclamation."
      },
      {
        "kind": "paragraph",
        "text": "Si des articles endommagés sont mis à part, identifiez le lot, comptez les pièces concernées et suivez la procédure d’isolement. Transmettez les deux écarts avec leurs références. La décision de facturation ou de retour dépend ensuite des règles et des accords applicables."
      },
      {
        "kind": "heading",
        "text": "3. Stock et continuité de service",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "3.1 Distinguer les quantités",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Le {g}stock physique{/g} est présent au moment du comptage. Le {g}stock disponible{/g} d’un cas peut être inférieur, notamment lorsque des pièces sont réservées ou écartées. Vérifiez si les catégories sont disjointes avant de soustraire plusieurs quantités."
      },
      {
        "kind": "paragraph",
        "text": "Une livraison annoncée entre dans une projection uniquement si vous connaissez l’horizon et le statut retenus par le cas. Même confirmée, elle ne fait pas partie du stock physique avant la réception."
      },
      {
        "kind": "heading",
        "text": "3.2 Estimer un besoin",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Multipliez la consommation prévue par jour par la durée considérée. Ajoutez le stock de sécurité si le cas le demande. Comparez ce besoin au stock disponible, selon les règles et la période indiquées."
      },
      {
        "kind": "paragraph",
        "text": "Lorsque le fournisseur livre par lots, calculez la quantité minimale qui couvre le manque, puis arrondissez à un nombre de lots suffisant. Si un réapprovisionnement arrive trop tard, signalez aussi le risque sur les jours précédant son arrivée."
      },
      {
        "kind": "heading",
        "text": "4. Transport, coût et service",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "4.1 Choisir une solution réalisable",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Pour chaque offre, contrôlez la capacité, l’heure d’arrivée, la possibilité de fractionnement et les conditions de manutention. L’heure estimée d’arrivée se calcule en ajoutant la durée du trajet à l’heure de départ, avec les étapes explicitement incluses dans le cas."
      },
      {
        "kind": "paragraph",
        "text": "Comparez ensuite les coûts des services équivalents. Ne confondez pas le coût d’une tournée avec le coût par colis. Pour déterminer ce dernier, définissez le nombre de colis auquel vous rapportez le coût."
      },
      {
        "kind": "heading",
        "text": "4.2 Suivre l’écart de service",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Le {g}taux de livraisons à l’heure{/g} rapporte le nombre de livraisons réalisées dans le délai au nombre total retenu sur la même période. Précisez le périmètre avant de comparer deux résultats. Par exemple, la comparaison peut devenir trompeuse si l’on change la définition du retard ou le type de tournée."
      },
      {
        "kind": "paragraph",
        "text": "En cas de retard, donnez au client ou au service concerné une information vérifiée. Indiquez le statut actuel, la nouvelle estimation et la personne qui tient le dossier à jour. La preuve de livraison permet ensuite de clore ou de prolonger le suivi."
      },
      {
        "kind": "heading",
        "text": "5. Présenter votre réponse professionnelle",
        "sub": false
      },
      {
        "kind": "table",
        "headers": [
          "Étape",
          "Exemple de trace dans une fiche de cas"
        ],
        "rows": [
          [
            "Constater",
            "Date, référence du lot et quantité effectivement relevée"
          ],
          [
            "Analyser",
            "Calcul, unité, écart et portée du résultat"
          ],
          [
            "Décider",
            "Action proposée et contrainte qui motive le choix"
          ],
          [
            "Suivre",
            "Personne à informer, contrôle à faire et moment prévu"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "En combinant quantité, coût, délai et qualité de service, une étude de cas permet de mettre en relation plusieurs compétences dans une seule situation de travail."
      }
    ],
    "module": "902",
    "revision": "902-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-902-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}arrivage confirmé{/g} — Quantité annoncée dont la date ou le statut est confirmé selon les règles du dossier."
      },
      {
        "kind": "paragraph",
        "text": "{g}capacité{/g} — Quantité maximale qu’un moyen ou un emplacement peut prendre en charge dans les conditions données."
      },
      {
        "kind": "paragraph",
        "text": "{g}contrainte impérative{/g} — Condition qu’une solution doit respecter pour être retenue."
      },
      {
        "kind": "paragraph",
        "text": "{g}coût moyen par colis{/g} — Coût du service considéré rapporté au nombre de colis du même périmètre."
      },
      {
        "kind": "paragraph",
        "text": "{g}critère de comparaison{/g} — Mesure ou caractéristique utilisée pour classer les solutions réalisables."
      },
      {
        "kind": "paragraph",
        "text": "{g}écart de quantité{/g} — Différence entre une quantité observée et sa référence, selon le sens de calcul annoncé."
      },
      {
        "kind": "paragraph",
        "text": "{g}fractionnement{/g} — Répartition d’un même envoi ou d’une quantité sur plusieurs lots ou trajets."
      },
      {
        "kind": "paragraph",
        "text": "{g}lot fournisseur{/g} — Quantité d’articles livrable ou commandable comme une unité selon les conditions du fournisseur."
      },
      {
        "kind": "paragraph",
        "text": "{g}non-conformité{/g} — Écart par rapport à une exigence portant par exemple sur la quantité, la référence, l’état ou les dimensions."
      },
      {
        "kind": "paragraph",
        "text": "{g}preuve de livraison{/g} — Document ou enregistrement qui atteste la remise d’un envoi."
      },
      {
        "kind": "paragraph",
        "text": "{g}projection de stock{/g} — Estimation du stock futur à partir des mouvements et hypothèses retenus."
      },
      {
        "kind": "paragraph",
        "text": "{g}quantité admise{/g} — Part de la quantité reçue qui remplit les conditions retenues pour rejoindre le stock utilisable."
      },
      {
        "kind": "paragraph",
        "text": "{g}quantité attendue{/g} — Quantité prévue d’après une commande ou un accord confirmé."
      },
      {
        "kind": "paragraph",
        "text": "{g}quantité écartée{/g} — Part de la quantité reçue mise à part à la suite d’un contrôle."
      },
      {
        "kind": "paragraph",
        "text": "{g}quantité reçue{/g} — Quantité physiquement constatée lors de la réception."
      },
      {
        "kind": "paragraph",
        "text": "{g}rapprochement{/g} — Comparaison de documents, mesures ou enregistrements pour expliquer un écart."
      },
      {
        "kind": "paragraph",
        "text": "{g}stock de sécurité{/g} — Quantité de réserve destinée à absorber certains aléas de consommation ou d’approvisionnement."
      },
      {
        "kind": "paragraph",
        "text": "{g}stock disponible{/g} — Quantité utilisable au moment considéré selon les déductions définies pour le cas."
      },
      {
        "kind": "paragraph",
        "text": "{g}stock physique{/g} — Quantité réellement présente à la date et à l’emplacement considérés."
      },
      {
        "kind": "paragraph",
        "text": "{g}stock réservé{/g} — Quantité affectée à un besoin ou une commande déjà identifiée."
      },
      {
        "kind": "paragraph",
        "text": "{g}taux de ponctualité{/g} — Proportion de livraisons terminées dans le délai retenu sur une période donnée."
      },
      {
        "kind": "paragraph",
        "text": "{g}traçabilité{/g} — Possibilité de retrouver la référence, l’historique et les opérations associées à un produit ou à un dossier."
      }
    ],
    "module": "902",
    "revision": "902-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-902-maths-origine-1",
    "kind": "maths",
    "prompt": "Vous attendez 24 cartons de 15 pièces. À la réception, 23 cartons sont complets et le dernier contient 12 pièces. Calculez l’écart en suivant la convention reçu moins attendu.",
    "answer": "Il manque 3 pièces. L’écart est de −3 pièces.",
    "calculation": "24 × 15 = 360. 23 × 15 + 12 = 357. 357 − 360 = −3.",
    "module": "902",
    "revision": "902-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-902-maths-origine-2",
    "kind": "maths",
    "prompt": "Le stock utilisable avant réception est de 86 pièces. Vous recevez 357 pièces, dont 5 sont écartées après le contrôle. Calculez le nouveau stock utilisable.",
    "answer": "Le stock utilisable est de 438 pièces.",
    "calculation": "357 − 5 = 352 pièces admises. 86 + 352 = 438.",
    "module": "902",
    "revision": "902-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-902-maths-origine-3",
    "kind": "maths",
    "prompt": "Le stock physique est de 132 pièces, dont 6 endommagées et 18 réservées. Aucune pièce n’est à la fois endommagée et réservée. Calculez le stock disponible.",
    "answer": "Le stock disponible est de 108 pièces.",
    "calculation": "132 − 6 − 18 = 108 pièces.",
    "module": "902",
    "revision": "902-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-902-maths-origine-4",
    "kind": "maths",
    "prompt": "Le stock disponible est de 108 pièces. Vous prévoyez d’utiliser 24 pièces par jour pendant quatre jours et souhaitez garder 20 pièces de sécurité. Le fournisseur livre par lots de 20. Calculez la quantité minimale à commander.",
    "answer": "Il faut commander un lot, soit 20 pièces.",
    "calculation": "24 × 4 + 20 = 116. 116 − 108 = 8 pièces à couvrir. Le plus petit lot suffit.",
    "module": "902",
    "revision": "902-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-902-maths-origine-5",
    "kind": "maths",
    "prompt": "Une tournée part à 13 h 45 et le trajet dure 75 minutes. La livraison doit avoir lieu avant 15 h 15. Calculez l’arrivée estimée et la marge disponible.",
    "answer": "L’arrivée prévue est à 15 h, avec 15 minutes de marge.",
    "calculation": "13 h 45 + 1 h 15 = 15 h. 15 h 15 − 15 h = 15 min.",
    "module": "902",
    "revision": "902-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-902-maths-origine-6",
    "kind": "maths",
    "prompt": "Une prestation coûte 148 CHF de transport, 28 CHF de manutention et 14 CHF d’emballage. Elle concerne 40 colis. Calculez le coût moyen par colis.",
    "answer": "Le coût moyen est de 4,75 CHF par colis.",
    "calculation": "(148 + 28 + 14) ÷ 40 = 190 ÷ 40 = 4,75 CHF.",
    "module": "902",
    "revision": "902-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-902-maths-origine-7",
    "kind": "maths",
    "prompt": "Sur 125 livraisons planifiées, 115 sont réalisées au plus tard à l’heure convenue. Calculez le taux de livraisons à l’heure et le taux complémentaire.",
    "answer": "92 % des livraisons sont à l’heure et 8 % sont hors délai.",
    "calculation": "115 ÷ 125 × 100 = 92 %. 100 % − 92 % = 8 %.",
    "module": "902",
    "revision": "902-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-902-verification-origine-1",
    "kind": "verification",
    "prompt": "Quelle différence faites-vous entre une donnée de commande et une observation de réception ?",
    "answer": "La commande indique l’attendu ou l’accord. Le relevé de réception consigne ce qui a été physiquement constaté.",
    "module": "902",
    "revision": "902-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-902-verification-origine-2",
    "kind": "verification",
    "prompt": "Pourquoi faut-il distinguer une pièce non livrée d’une pièce reçue mais endommagée ?",
    "answer": "Les deux écarts ont une origine et un traitement différents. La pièce endommagée fait partie de la quantité reçue, même si elle ne rejoint pas le stock utilisable.",
    "module": "902",
    "revision": "902-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-902-verification-origine-3",
    "kind": "verification",
    "prompt": "Donnez un exemple de contrainte impérative et un exemple de critère pour choisir un transporteur.",
    "answer": "Exemple de contrainte : la capacité minimale nécessaire. Exemple de critère : le coût parmi les offres qui respectent les contraintes.",
    "module": "902",
    "revision": "902-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-902-verification-origine-4",
    "kind": "verification",
    "prompt": "Que faut-il contrôler avant d’ajouter un arrivage annoncé au stock projeté ?",
    "answer": "Vérifier la quantité, la date, le statut de confirmation et l’horizon du cas.",
    "module": "902",
    "revision": "902-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-902-verification-origine-5",
    "kind": "verification",
    "prompt": "Quelle formule utilisez-vous pour comparer des coûts moyens de distribution par colis ?",
    "answer": "Le coût total des prestations retenues divisé par le nombre de colis du même périmètre.",
    "module": "902",
    "revision": "902-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-902-verification-origine-6",
    "kind": "verification",
    "prompt": "Quelles informations permettent à un collègue de reprendre le traitement d’un écart de réception ?",
    "answer": "La référence du dossier, la date, la quantité attendue, les constats, l’action engagée et le prochain contrôle.",
    "module": "902",
    "revision": "902-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-902-verification-origine-7",
    "kind": "verification",
    "prompt": "Comment rendre comparable un taux de livraison à l’heure d’une période à l’autre ?",
    "answer": "Garder la même définition du délai, le même périmètre et la même méthode de calcul.",
    "module": "902",
    "revision": "902-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-902-situation-origine-1",
    "kind": "situation",
    "prompt": "Une commande prévoit 360 pièces. Vous en comptez 357 et constatez que 5 des 357 sont endommagées. Le stock utilisable avant réception est de 86 pièces. Présentez les deux écarts, le nouveau stock utilisable et les informations à transmettre.",
    "answer": "Trois pièces manquent et cinq des pièces reçues sont écartées. Ainsi, 352 entrent en stock et le stock utilisable passe à 438. Consigner la commande, le lot et les deux écarts, isoler les pièces endommagées et transmettre le dossier selon la procédure.",
    "module": "902",
    "revision": "902-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-902-situation-origine-2",
    "kind": "situation",
    "prompt": "Vous avez 108 pièces disponibles et devez couvrir quatre jours à 24 pièces par jour en gardant 20 pièces de sécurité. Les réapprovisionnements se font par lots de 20. Proposez l’action minimale et un point à vérifier.",
    "answer": "Le besoin est de 116 pièces, soit 8 de plus que le stock disponible. Demander un lot de 20 et vérifier que sa date d’arrivée couvre le risque avant la fin de l’horizon.",
    "module": "902",
    "revision": "902-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-902-situation-origine-3",
    "kind": "situation",
    "prompt": "Vous expédiez 28 cartons sur une seule tournée, au départ à 13 h 45. Arrivée au plus tard à 15 h 15. A transporte 32 cartons en 75 min pour 148 CHF. B transporte 32 cartons en 100 min pour 126 CHF. C transporte 26 cartons en 85 min pour 135 CHF. Choisissez et justifiez.",
    "answer": "Choisir A, capacité suffisante et arrivée à 15 h. B arrive à 15 h 25, hors délai. C arrive à 15 h 10 mais ne peut emporter que 26 des 28 cartons.",
    "module": "902",
    "revision": "902-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-902-situation-origine-4",
    "kind": "situation",
    "prompt": "Une tournée arrive plus tard que prévu après un changement de quai. Le client n’a pas reçu de nouvelle heure. Proposez le premier message utile puis un contrôle de clôture.",
    "answer": "Informer le client du statut confirmé, de l’heure estimée et de la personne de contact. Après la livraison, rapprocher la preuve de livraison et le suivi puis consigner la clôture.",
    "module": "902",
    "revision": "902-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-902-situation-origine-5",
    "kind": "situation",
    "prompt": "Le relevé informatique indique 80 cartons disponibles. Sur le quai, 76 cartons sont comptés et quatre cartons sont absents de leur emplacement attendu. Expliquez comment vérifier l’origine de l’écart avant de corriger le stock.",
    "answer": "Recompter et vérifier les références, les emplacements, les réservations et les mouvements non enregistrés. Consigner les constats et faire appliquer la procédure de correction après rapprochement.",
    "module": "902",
    "revision": "902-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-902-situation-origine-6",
    "kind": "situation",
    "prompt": "Deux tournées sont comparées. La première compte 95 livraisons à l’heure sur 100. La seconde en compte 48 sur 50. Comparez leurs taux et donnez une limite de cette comparaison.",
    "answer": "Les taux sont 95 % et 96 %. Le second est un peu supérieur, mais les effectifs, les critères de ponctualité et les caractéristiques des tournées doivent être comparables.",
    "module": "902",
    "revision": "902-v001",
    "approvedFor": [
      "CFC"
    ]
  }
] satisfies readonly LogistiqueUnit[]
