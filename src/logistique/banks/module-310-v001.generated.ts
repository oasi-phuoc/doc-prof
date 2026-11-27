import type { LogistiqueUnit } from '../approved-banks'

export const module310 = [
  {
    "id": "log-310-objectifs-apercu",
    "kind": "objectifs-apercu",
    "blocks": [
      {
        "kind": "heading",
        "text": "Objectifs",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Expliquer pourquoi et comment {g}préparer{/g} (réemballer / étiqueter) avant stockage",
          "Décrire l'{g}enregistrement{/g} des marchandises dans l'ERP",
          "Définir un {g}article{/g} et lire l'en-tête d'une fiche de stock (UL, UV, point de commande…)",
          "Distinguer stock {g}disponible{/g}, réservé, AQ, bloqué et {g}total{/g}",
          "Comptabiliser des {g}entrées{/g} et {g}sorties{/g} simples"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 310",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Relier le conditionnement, l’identification et l’aptitude au stockage.",
          "Enregistrer la référence, la quantité, le lot et le statut dans le dossier.",
          "Confirmer l’emplacement avant de rendre la marchandise disponible."
        ]
      }
    ],
    "module": "310",
    "revision": "310-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-310-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "10. Préparation à la mise en stock",
        "sub": false
      },
      {
        "kind": "paragraph",
        "text": "Dernière étape de la logistique d'{g}approvisionnement{/g}, après contrôles qualité et quantité. Organisation selon exigences internes et nature de la marchandise (stockage, transport, vente)."
      },
      {
        "kind": "paragraph",
        "text": "Sans exigences particulières → stockage direct. Sinon : {g}réemballage{/g}, {g}repacking{/g} ou {g}étiquetage{/g} spécial."
      },
      {
        "kind": "heading",
        "text": "10.1 Objectifs d'un nouvel emballage",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/310/commun/log-310-notions-1-v001.svg",
        "alt": "Vérifier. Article, lot et état. Regrouper. Conditionnement adapté. Identifier. Nouvelle étiquette.",
        "caption": "La nouvelle unité garde une identification qui permet le suivi du lot."
      },
      {
        "kind": "paragraph",
        "text": "Raisons de reconditionner / réétiqueter :"
      },
      {
        "kind": "paragraph",
        "text": "{g}Présentation{/g} Inscription, logo ou couleur ≠ emballage de vente cible → déballer et réemballer."
      },
      {
        "kind": "paragraph",
        "text": "{g}Emballage incorrect{/g} Taille inadaptée (POS), endommagé, image de vente, perte de fonction de protection → nouvel emballage adapté."
      },
      {
        "kind": "paragraph",
        "text": "{g}Marquage des promotions{/g} Réduction / nouveau prix indiqués sur le produit."
      },
      {
        "kind": "paragraph",
        "text": "{g}Nouvelles tailles d'emballage{/g} Achat à la pièce mais ventes en lots → assembler des pièces (conception de lot)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Création de bundles{/g} Ex. EnterSite : toners C/M/Y/K vendus séparément {g}ou{/g} en « Rainbow Kit » regroupé."
      },
      {
        "kind": "paragraph",
        "text": "{g}Manutention{/g} Faciliter la logistique (ex. bac à bec pour centaines de vis vs pièce à pièce)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Type de stockage / préparation{/g} Rayonnages à palettes → préparer sur palettes conformes ; emplacements de prélèvement → bacs."
      },
      {
        "kind": "paragraph",
        "text": "{g}Automatisation{/g} Ex. rayonnage palettes auto → marquage d'identification pour stockage/déstockage système."
      },
      {
        "kind": "heading",
        "text": "10.2 Enregistrement de la marchandise",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/310/commun/log-310-notions-2-v001.svg",
        "alt": "Marchandise. Référence et lot. Quantité. Unité de base. Stock. Position et statut.",
        "caption": "L’emplacement réel et le statut restent consultables."
      },
      {
        "kind": "paragraph",
        "text": "En fin de préparation : {g}enregistrement{/g} dans l'ERP (même si pas de modification d'emballage)."
      },
      {
        "kind": "paragraph",
        "text": "Réception {g}planifiée{/g} (module 303) : commande déjà pré-enregistrée → à la préparation, enregistrement + transfert vers l'emplacement."
      },
      {
        "kind": "heading",
        "text": "10.3 Gestion des stocks",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "L'article est enregistré dès réception de la commande."
      },
      {
        "kind": "heading",
        "text": "10.3.1 Notions de base",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Terminologie {g}non uniforme{/g} selon sources."
      },
      {
        "kind": "paragraph",
        "text": "{g}Article{/g} = marchandise en stock dont toutes les parties sont {g}identiques{/g}. Une caractéristique différente = autre article."
      },
      {
        "kind": "paragraph",
        "text": "Ex. toners : - CE410X 305 X Toner BLACK - CE411A 305 Toner CYAN - CE412A 305 Toner YELLOW - CE413A 305 Toner MAGENTA"
      },
      {
        "kind": "heading",
        "text": "10.3.2 En-tête de la fiche de stock",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Données article / stock (SGS ou ERP) :"
      },
      {
        "kind": "table",
        "headers": [
          "#",
          "Élément",
          "Rôle"
        ],
        "rows": [
          [
            "1",
            "{g}N° d'article{/g}",
            "Identification unique"
          ],
          [
            "2",
            "{g}Désignation{/g}",
            "Contrôle visuel, anti-confusion"
          ],
          [
            "3",
            "{g}UL{/g} (unité de livraison)",
            "Qté minimale livrée par le fournisseur (ex. 5)"
          ],
          [
            "4",
            "{g}UV{/g} (unité de vente)",
            "Qté minimale de vente (souvent 1)"
          ],
          [
            "5",
            "{g}Prix d'achat{/g}",
            "Coût d'acquisition · évaluation stocks · {g}confidentiel{/g} · ≠ prix de vente (PV)"
          ],
          [
            "6",
            "{g}Fournisseur{/g}",
            "Réactivité en cas d'irrégularité"
          ],
          [
            "7",
            "{g}Stock maximal{/g}",
            "Selon rotation + espace · évite surstocks coûteux"
          ],
          [
            "8",
            "{g}Point de commande{/g} (cote d'alerte)",
            "Niveau déclenchant une nouvelle commande (souvent auto)"
          ],
          [
            "9",
            "{g}Stock de sécurité{/g} (stock min.)",
            "Réserve « coups durs » · ne devrait pas être franchi"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "10.3.3 Les saisies comptables",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "#",
          "Colonne",
          "Effet"
        ],
        "rows": [
          [
            "10",
            "{g}Date{/g}",
            "Saisie (+ souvent ID utilisateur pour traçabilité)"
          ],
          [
            "11",
            "{g}Entrées{/g}",
            "↑ stock"
          ],
          [
            "12",
            "{g}Sorties{/g}",
            "↓ stock"
          ],
          [
            "13",
            "{g}Stock réservé{/g}",
            "Physique mais non disponible · ↓ disponible, pas le total"
          ],
          [
            "14",
            "{g}Stock AQ{/g}",
            "En attente de contrôle · physique, non disponible"
          ],
          [
            "15",
            "{g}Stock bloqué{/g}",
            "Inutilisable / non livrable · dans le total, pas le disponible"
          ],
          [
            "16",
            "{g}Stock disponible{/g}",
            "Livrable immédiatement"
          ],
          [
            "17",
            "{g}Stock total{/g}",
            "Disponible + réservé + AQ + bloqué"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "10.3.4 Exemple de comptabilisation",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Stock initial 01.09 : {g}10'000{/g} (disponible = total)."
      },
      {
        "kind": "table",
        "headers": [
          "Date",
          "Entrée",
          "Sortie",
          "Disponible / Total"
        ],
        "rows": [
          [
            "01.09",
            "",
            "",
            "10'000"
          ],
          [
            "02.09",
            "",
            "2'870",
            "7'130"
          ],
          [
            "03.09",
            "",
            "1'640",
            "5'490"
          ],
          [
            "04.09",
            "",
            "3'980",
            "1'510"
          ],
          [
            "05.09",
            "5'000",
            "",
            "6'510"
          ],
          [
            "06.09",
            "",
            "2'300",
            "4'210"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "Entrées/sorties concrètes → disponible et total fluctuent de la {g}même{/g} quantité (sans réservation/AQ/blocage)."
      }
    ],
    "module": "310",
    "revision": "310-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-310-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Conditionnement{/g} — Présentation qui permet de conserver, identifier ou manipuler l’article."
      },
      {
        "kind": "paragraph",
        "text": "{g}Conversion d’unité{/g} — Passage de l’unité de livraison à l’unité de base, par exemple carton à pièce."
      },
      {
        "kind": "paragraph",
        "text": "{g}Donnée article{/g} — Information de référence sur un article."
      },
      {
        "kind": "paragraph",
        "text": "{g}Étiquette de stock{/g} — Support qui identifie l’article et les données de suivi nécessaires."
      },
      {
        "kind": "paragraph",
        "text": "{g}Emplacement{/g} — Position repérée dans l’entrepôt."
      },
      {
        "kind": "paragraph",
        "text": "{g}Lot{/g} — Ensemble d’unités dont l’identifiant permet le suivi commun."
      },
      {
        "kind": "paragraph",
        "text": "{g}Mise en stock{/g} — Affectation et enregistrement de la marchandise dans un emplacement."
      },
      {
        "kind": "paragraph",
        "text": "{g}Quantité disponible{/g} — Quantité utilisable après prise en compte des réservations et blocages."
      },
      {
        "kind": "paragraph",
        "text": "{g}Reconditionnement{/g} — Changement du conditionnement pour un usage prévu."
      },
      {
        "kind": "paragraph",
        "text": "{g}Statut{/g} — Indication du droit d’utiliser, contrôler ou déplacer un lot."
      },
      {
        "kind": "paragraph",
        "text": "{g}Unité de base{/g} — Unité retenue pour compter et gérer l’article."
      },
      {
        "kind": "paragraph",
        "text": "{g}Unité de livraison{/g} — Unité ou conditionnement employé dans la livraison."
      }
    ],
    "module": "310",
    "revision": "310-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-310-maths-fiche-1",
    "kind": "maths",
    "prompt": "Huit cartons de 15 pièces arrivent. Enregistrez la quantité en pièces.",
    "answer": "120 pièces.",
    "calculation": "8 × 15 = 120.",
    "module": "310",
    "revision": "310-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-310-maths-fiche-2",
    "kind": "maths",
    "prompt": "Un lot de 74 pièces est reconditionné par six. Combien de boîtes pleines et de pièces restantes ?",
    "answer": "Douze boîtes pleines et deux pièces.",
    "calculation": "74 = 12 × 6 + 2.",
    "module": "310",
    "revision": "310-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-310-maths-fiche-3",
    "kind": "maths",
    "prompt": "La zone A accepte 24 unités et en contient 19. Calculez la place disponible.",
    "answer": "Cinq unités.",
    "calculation": "24 − 19 = 5.",
    "module": "310",
    "revision": "310-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-310-maths-fiche-4",
    "kind": "maths",
    "prompt": "Quatre lots ont chacun une étiquette principale et deux de suivi. Combien d’étiquettes préparer ?",
    "answer": "Douze étiquettes.",
    "calculation": "4 × (1 + 2) = 12.",
    "module": "310",
    "revision": "310-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-310-maths-fiche-5",
    "kind": "maths",
    "prompt": "Un lot de 180 pièces compte 15 réservées et 20 en contrôle, dans des sous-ensembles distincts. Calculez le disponible.",
    "answer": "145 pièces.",
    "calculation": "180 − 15 − 20 = 145.",
    "module": "310",
    "revision": "310-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-310-maths-fiche-6",
    "kind": "maths",
    "prompt": "Un article arrive à raison de 24 pièces par carton. Dix cartons sont reçus en deux lots de six et quatre cartons. Donnez les quantités à tracer par lot.",
    "answer": "144 et 96 pièces.",
    "calculation": "6 × 24 = 144. 4 × 24 = 96.",
    "module": "310",
    "revision": "310-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-310-verification-fiche-1",
    "kind": "verification",
    "prompt": "Pourquoi un nouvel emballage peut-il être nécessaire avant le stockage ?",
    "answer": "Pour respecter la protection, l’identification et la manipulation prévues.",
    "module": "310",
    "revision": "310-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-310-verification-fiche-2",
    "kind": "verification",
    "prompt": "Quels champs vérifier avant d’enregistrer la marchandise ?",
    "answer": "Référence, unité, quantité, lot, statut et destination prévue.",
    "module": "310",
    "revision": "310-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-310-verification-fiche-3",
    "kind": "verification",
    "prompt": "Pourquoi garder la référence du lot lors d’un remplacement d’étiquette ?",
    "answer": "Pour préserver le lien entre l’article, son origine et les contrôles.",
    "module": "310",
    "revision": "310-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-310-verification-fiche-4",
    "kind": "verification",
    "prompt": "Quand un article en contrôle est-il disponible ?",
    "answer": "Après la libération conforme à la procédure.",
    "module": "310",
    "revision": "310-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-310-verification-fiche-5",
    "kind": "verification",
    "prompt": "Que distingue une unité de livraison et une unité de base ?",
    "answer": "La première décrit le conditionnement livré. La seconde sert au comptage et suivi.",
    "module": "310",
    "revision": "310-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-310-verification-fiche-6",
    "kind": "verification",
    "prompt": "Pourquoi confirmer l’emplacement après déplacement ?",
    "answer": "Pour aligner la position réelle et celle du système.",
    "module": "310",
    "revision": "310-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-310-situation-fiche-1",
    "kind": "situation",
    "prompt": "Une palette est préparée pour un rayon mais la place est occupée. Comment vous coordonnez-vous ?",
    "answer": "Demander une affectation autorisée et enregistrer l’emplacement réellement utilisé.",
    "module": "310",
    "revision": "310-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-310-situation-fiche-2",
    "kind": "situation",
    "prompt": "Deux lots identiques en apparence doivent être reconditionnés. Que préservez-vous ?",
    "answer": "Le lien entre article, lot et nouvelles unités, sans fusion des références de suivi.",
    "module": "310",
    "revision": "310-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-310-situation-fiche-3",
    "kind": "situation",
    "prompt": "Vous trouvez un écart entre l’étiquette et le comptage. Quelle suite ?",
    "answer": "Stopper l’enregistrement, vérifier le dossier et faire corriger ou signaler l’écart.",
    "module": "310",
    "revision": "310-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-310-situation-fiche-4",
    "kind": "situation",
    "prompt": "Un bac reste en contrôle, mais sa destination est connue. Que saisissez-vous ?",
    "answer": "Sa position et son statut en contrôle. Attendre l’autorisation avant de le libérer.",
    "module": "310",
    "revision": "310-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
