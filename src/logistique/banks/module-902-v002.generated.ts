import type { LogistiqueUnit } from '../approved-banks'

export const module902 = [
  {
    "id": "log-902-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "1. Une méthode en quatre étapes",
        "sub": false
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
        "kind": "image",
        "src": "/assets/logistique/300/307/commun/log-307-dommage-photo-v002.webp",
        "alt": "Une équipe photographie un dommage d’emballage au contrôle.",
        "caption": "Le dommage et un éventuel manque se documentent séparément avant décision."
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
        "kind": "image",
        "src": "/assets/logistique/600/603/commun/log-603-sangles-photo-v002.webp",
        "alt": "Des unités sont maintenues par des éléments d’arrimage à l’intérieur du véhicule.",
        "caption": "Le choix d’une solution inclut le véhicule, les limites de charge, les délais et l’arrimage."
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
    "summaryBlocks": [
      {
        "kind": "heading",
        "text": "Études de cas logistiques",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "1. Une méthode en quatre étapes",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Lisez la situation. Relevez les données utiles, les contraintes et la question. Calculez ou comparez dans la même unité, puis proposez une décision réalisable. Indiquez le contrôle qui permet de vérifier la suite."
      },
      {
        "kind": "heading",
        "text": "2. Réception et contrôle de quantité",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/307/commun/log-307-dommage-photo-v002.webp",
        "alt": "Une équipe photographie un dommage d’emballage au contrôle.",
        "caption": "Le dommage et un éventuel manque se documentent séparément avant décision."
      },
      {
        "kind": "paragraph",
        "text": "Comparez {g}commande{/g}, {g}bon de livraison{/g} et {g}comptage{/g}. Distinguez un manque d’un dommage : chacun doit être relevé. Gardez la référence et le lot. En cas d’écart, notez les faits, mettez à part si prévu et demandez la décision."
      },
      {
        "kind": "heading",
        "text": "3. Stock et continuité de service",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Le {g}stock physique{/g} rassemble les unités présentes. Le {g}stock disponible{/g} tient compte des réservations et blocages. Rapprochez le besoin et les entrées attendues dans le délai. Un {g}besoin net{/g} est la quantité qui reste à couvrir."
      },
      {
        "kind": "heading",
        "text": "4. Transport, coût et service",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/603/commun/log-603-sangles-photo-v002.webp",
        "alt": "Des unités sont maintenues par des éléments d’arrimage à l’intérieur du véhicule.",
        "caption": "Le choix d’une solution inclut le véhicule, les limites de charge, les délais et l’arrimage."
      },
      {
        "kind": "paragraph",
        "text": "Comparez la charge, le véhicule, l’accès, les créneaux et le coût. Une option doit préserver les conditions de transport et l’{g}arrimage{/g}. Suivez un {g}taux de service{/g} défini par période, unité et critère. Traitez la cause d’un écart et mesurez le résultat de l’action."
      },
      {
        "kind": "heading",
        "text": "5. Présenter votre réponse professionnelle",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Indiquez le résultat, son unité, le raisonnement et les limites. Présentez l’action, le responsable et le délai. Séparez les données constatées des hypothèses de travail."
      }
    ],
    "module": "902",
    "revision": "902-v002",
    "approvedFor": [
      "CFC"
    ]
  }
] satisfies readonly LogistiqueUnit[]
