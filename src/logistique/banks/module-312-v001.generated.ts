import type { LogistiqueUnit } from '../approved-banks'

export const module312 = [
  {
    "id": "log-312-objectifs-apercu",
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
          "Expliquer l'importance du {g}niveau de stock{/g} pour l'entreprise",
          "Classer les stocks (FEFO / FIFO / LIFO) et citer les principaux {g}types{/g}",
          "Calculer {g}stock mini{/g} et {g}point de commande{/g}",
          "Distinguer stock {g}disponible{/g}, réservé, AQ, bloqué et {g}total{/g}",
          "Lire une {g}fiche de stock{/g} et comptabiliser entrées, sorties, AQ et réservations"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 312",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Lire les quantités physiques, réservées, bloquées et disponibles.",
          "Calculer les besoins couverts pendant un délai et le seuil de commande.",
          "Appliquer la règle de sortie prévue selon les dates et le suivi des lots."
        ]
      }
    ],
    "module": "312",
    "revision": "312-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-312-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "12. Données de stockage",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "12.1 STOCK : définition et importance",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Le {g}stock{/g} = ensemble des produits stockés (matières premières, semi-finis, finis)."
      },
      {
        "kind": "paragraph",
        "text": "Rôle : couvrir les besoins futurs (clients / production) et garantir une exploitation normale. Coût = {g}capital immobilisé{/g}. Trop élevé → argent manquant pour d'autres investissements. Trop faible → rupture, CA ↓, retards de production."
      },
      {
        "kind": "paragraph",
        "text": "> Règle : {g}aussi peu que possible — autant que nécessaire.{/g}"
      },
      {
        "kind": "paragraph",
        "text": "Niveau idéal = satisfaire demande interne/externe {g}sans{/g} surstocks. Exige chaînes d'approvisionnement fiables + {g}prévisions de vente{/g} transparentes."
      },
      {
        "kind": "heading",
        "text": "12.2 Classification (date / périssabilité)",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "Groupe",
          "Caractéristique",
          "Principe",
          "Exemples"
        ],
        "rows": [
          [
            "{g}Avec date d'expiration{/g}",
            "À consommer avant date",
            "{g}FEFO{/g} (First Expired, First Out)",
            "Médicaments, yaourt, lait…"
          ],
          [
            "{g}Périssables{/g}",
            "Qualité qui se dégrade vite",
            "{g}FIFO{/g} (First In, First Out)",
            "Surgelés, viande/poisson, fruits/légumes, fleurs, chimie"
          ],
          [
            "{g}Non périssables{/g}",
            "Qualité stable dans le temps",
            "{g}LIFO{/g} possible",
            "Vis/écrous, tubes/profilés, machines"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "12.3 Types de stocks",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/312/commun/log-312-notions-1-v001.svg",
        "alt": "Consommation. Pièces par jour. Délai. Jours jusqu’au stock. Réserve. Aléas pris en compte.",
        "caption": "Le seuil correspond au besoin pendant le délai plus la réserve du modèle."
      },
      {
        "kind": "paragraph",
        "text": "{g}Stock physique (réel){/g} — quantité présente, dont une partie peut être réservée, bloquée ou en cours de contrôle."
      },
      {
        "kind": "paragraph",
        "text": "{g}Stock mini (minimum){/g} — couvre la consommation pendant le délai de réapprovisionnement."
      },
      {
        "kind": "paragraph",
        "text": "> Stock mini = consommation journalière × délai de réapprovisionnement (jours)"
      },
      {
        "kind": "paragraph",
        "text": "{g}Stock de sécurité{/g} — réserve définie pour couvrir des aléas, par exemple : - besoins supplémentaires non prévus / aléas de production - délai de réappro retardé → maintient la {g}capacité de livraison{/g}."
      },
      {
        "kind": "paragraph",
        "text": "{g}Stock maximum{/g} — limite supérieure (place, coûts, obsolescence technique — ex. multimédia)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Point de commande (cote d'alerte){/g} — seuil déclenchant une nouvelle commande :"
      },
      {
        "kind": "paragraph",
        "text": "> Point de commande = (consommation journalière × délai réappro) + stock de sécurité"
      },
      {
        "kind": "paragraph",
        "text": "{g}Stock négatif (manquant){/g} — pas physique ; indique la quantité manquante / incapacité à livrer. À éviter."
      },
      {
        "kind": "paragraph",
        "text": "{g}Stock temporaire{/g} — lié aux temps de passage différents (AQ entrée, conditionnement sortie…)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Stock saisonnier{/g} — demande liée à une saison/événement (ex. lapins de Pâques)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Stock dormant{/g} — obsolète techniquement ou périmé → à retirer."
      },
      {
        "kind": "paragraph",
        "text": "{g}Stock spéculatif{/g} — achat anticipé (hausse de prix / risques livraison) au-delà du stock actif."
      },
      {
        "kind": "heading",
        "text": "12.4 Aspect opérationnel",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/312/commun/log-312-notions-2-v001.svg",
        "alt": "Disponible. Affectable à un besoin. Réservé. Affecté à un dossier. Bloqué. En attente de décision.",
        "caption": "Le stock utilisable dépend du dossier, de la réservation et du contrôle."
      },
      {
        "kind": "table",
        "headers": [
          "Notion",
          "Sens"
        ],
        "rows": [
          [
            "{g}Stock optimal{/g}",
            "Équilibre besoins / commandes / coûts de stockage (rentabilité)"
          ],
          [
            "{g}Sur réservation / JIT{/g}",
            "Court terme · quantités exactes · stocks bas"
          ],
          [
            "{g}Réservation{/g}",
            "Précommandé pour un but · encore physique jusqu'à la sortie"
          ],
          [
            "{g}Stock total / physique{/g}",
            "Quantité réellement présente"
          ],
          [
            "{g}Stock net{/g}",
            "Total − réservations"
          ],
          [
            "{g}Stock disponible{/g}",
            "Total − réservé − AQ − bloqué"
          ],
          [
            "{g}Stock AQ{/g}",
            "Physique mais non utilisable tant que contrôle qualité en cours · dans total, pas disponible · si KO → bloqué"
          ],
          [
            "{g}Stock bloqué{/g}",
            "Non utilisable/livrable · dans total, pas disponible"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "12.5 Gestion des stocks",
        "sub": true
      },
      {
        "kind": "heading",
        "text": "12.5.1–12.5.2 Article",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Marchandise stockée {g}identique dans toutes ses parties{/g}. Une caractéristique différente (ex. hauteur) → {g}nouveau n° d'article{/g}."
      },
      {
        "kind": "paragraph",
        "text": "Ex. cylindre ∅ 45 mm : H 125 / 135 / 145 → trois n° distincts."
      },
      {
        "kind": "heading",
        "text": "12.5.3 En-tête de fiche (données statiques)",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "Champ",
          "Rôle"
        ],
        "rows": [
          [
            "N° d'article",
            "Identification unique"
          ],
          [
            "Désignation",
            "Complément / anti-confusion"
          ],
          [
            "Unité de livraison (UL)",
            "Qté min. de commande fournisseur (ex. par 5)"
          ],
          [
            "Unité de vente (UV)",
            "Qté min. de vente (souvent 1)"
          ],
          [
            "Prix d'achat",
            "Interne · valeur de stock · ≠ prix de vente"
          ],
          [
            "Fournisseur",
            "Fournisseur standard"
          ],
          [
            "Stock maximum",
            "Limite"
          ],
          [
            "Point de commande",
            "Proposition de commande auto"
          ],
          [
            "Stock de sécurité",
            "Capacité de livraison"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "12.5.4 Mouvements (données dynamiques)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Date · Entrées (↑) · Sorties (↓) · Réservé · AQ · Bloqué · {g}Disponible{/g} · {g}Total{/g} Total = disponible + réservé + AQ + bloqué."
      },
      {
        "kind": "heading",
        "text": "12.5.5–12.5.7 Comptabilisations",
        "sub": true
      },
      {
        "kind": "list",
        "items": [
          "Entrées/sorties {g}physiques{/g} → disponible et total bougent de la {g}même{/g} quantité.",
          "Entrée en {g}AQ{/g} → ↑ total, pas le disponible ; libération OK → AQ → disponible (total inchangé) ; part KO → {g}bloqué{/g} ; retour fournisseur → sortie + ↓ total.",
          "{g}Réservation{/g} → ↑ réservé, ↓ disponible, total inchangé ; à la sortie prévue → réservé → 0, ↓ total ; disponible déjà ajusté.",
          "Sortie supplémentaire le même jour qu'une réservation : disponible ↓ seulement de la nouvelle sortie ; total ↓ réservation + nouvelle sortie."
        ]
      },
      {
        "kind": "heading",
        "text": "12.5.8 Cycle graphique (schéma typique)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Baisse régulière → point de commande → commande → arrivée avant stock mini → hausse (parfois jusqu'au max) → forte demande : stock de sécurité évite la rupture · ou consommation trop forte → stock mini épuisé → {g}rupture / non-livraison{/g}."
      },
      {
        "kind": "heading",
        "text": "12.6 Conclusion",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Ces données donnent du sens opérationnel aux {g}6B{/g} (Jünemann) : bonne marchandise, quantité, qualité, moment, endroit, prix."
      }
    ],
    "module": "312",
    "revision": "312-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-312-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Consommation journalière{/g} — Quantité utilisée par jour dans le périmètre observé."
      },
      {
        "kind": "paragraph",
        "text": "{g}Date d’expiration{/g} — Date de fin d’utilisation ou de vente selon la règle applicable."
      },
      {
        "kind": "paragraph",
        "text": "{g}FEFO{/g} — Priorité au lot dont l’échéance est la plus proche."
      },
      {
        "kind": "paragraph",
        "text": "{g}FIFO{/g} — Priorité au lot entré le premier."
      },
      {
        "kind": "paragraph",
        "text": "{g}LIFO{/g} — Priorité au lot entré le plus récemment, lorsque le contexte le permet."
      },
      {
        "kind": "paragraph",
        "text": "{g}Point de commande{/g} — Seuil tenant compte du besoin pendant le délai et de la réserve définie."
      },
      {
        "kind": "paragraph",
        "text": "{g}Stock bloqué{/g} — Quantité temporairement non utilisable."
      },
      {
        "kind": "paragraph",
        "text": "{g}Stock disponible{/g} — Quantité utilisable pour un besoin après application des réservations et statuts."
      },
      {
        "kind": "paragraph",
        "text": "{g}Stock maximal{/g} — Limite retenue pour la quantité stockée."
      },
      {
        "kind": "paragraph",
        "text": "{g}Stock physique{/g} — Quantité effectivement présente."
      },
      {
        "kind": "paragraph",
        "text": "{g}Stock réservé{/g} — Quantité affectée à un besoin et non disponible pour un autre."
      },
      {
        "kind": "paragraph",
        "text": "{g}Stock de sécurité{/g} — Réserve couvrant des aléas de consommation ou d’approvisionnement."
      }
    ],
    "module": "312",
    "revision": "312-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-312-maths-fiche-1",
    "kind": "maths",
    "prompt": "Le stock physique est de 220 pièces, dont 35 réservées et 25 sous contrôle dans des groupes distincts. Calculez le disponible.",
    "answer": "160 pièces.",
    "calculation": "220 − 35 − 25 = 160.",
    "module": "312",
    "revision": "312-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-312-maths-fiche-2",
    "kind": "maths",
    "prompt": "La consommation est de 14 pièces par jour pendant cinq jours. Calculez le besoin du délai.",
    "answer": "70 pièces.",
    "calculation": "14 × 5 = 70.",
    "module": "312",
    "revision": "312-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-312-maths-fiche-3",
    "kind": "maths",
    "prompt": "Au besoin du délai de 70 pièces s’ajoute une réserve de 30. Calculez le point de commande.",
    "answer": "100 pièces.",
    "calculation": "70 + 30 = 100.",
    "module": "312",
    "revision": "312-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-312-maths-fiche-4",
    "kind": "maths",
    "prompt": "Sur 68 pièces en stock, 54 doivent être prélevées. Quel solde reste après cette sortie ?",
    "answer": "14 pièces.",
    "calculation": "68 − 54 = 14.",
    "module": "312",
    "revision": "312-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-312-maths-fiche-5",
    "kind": "maths",
    "prompt": "La capacité retenue est de 400 pièces et 292 y sont stockées. Calculez le taux d’occupation et la place libre.",
    "answer": "73 % d’occupation et 108 places.",
    "calculation": "292 ÷ 400 × 100 = 73 %. 400 − 292 = 108.",
    "module": "312",
    "revision": "312-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-312-maths-fiche-6",
    "kind": "maths",
    "prompt": "Le seuil vaut 120 pièces avec un délai de quatre jours et 32 pièces de sécurité. Quelle consommation quotidienne a été retenue ?",
    "answer": "22 pièces par jour.",
    "calculation": "(120 − 32) ÷ 4 = 22.",
    "module": "312",
    "revision": "312-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-312-verification-fiche-1",
    "kind": "verification",
    "prompt": "Quelle différence entre physique et disponible ?",
    "answer": "Le physique est présent. Le disponible est utilisable pour le besoin considéré.",
    "module": "312",
    "revision": "312-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-312-verification-fiche-2",
    "kind": "verification",
    "prompt": "Que signifie FEFO ?",
    "answer": "Faire sortir en priorité ce qui arrive à échéance en premier.",
    "module": "312",
    "revision": "312-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-312-verification-fiche-3",
    "kind": "verification",
    "prompt": "Pourquoi le point de commande inclut-il une réserve dans le modèle du cours ?",
    "answer": "Pour couvrir un aléa en plus de la consommation attendue pendant le délai.",
    "module": "312",
    "revision": "312-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-312-verification-fiche-4",
    "kind": "verification",
    "prompt": "À quoi sert le stock maximal ?",
    "answer": "À limiter le volume ou la valeur immobilisée selon la politique retenue.",
    "module": "312",
    "revision": "312-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-312-verification-fiche-5",
    "kind": "verification",
    "prompt": "Un stock négatif dans le système correspond-il à une quantité réelle ?",
    "answer": "Il signale un manque ou un écart à examiner.",
    "module": "312",
    "revision": "312-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-312-verification-fiche-6",
    "kind": "verification",
    "prompt": "Pourquoi noter l’unité avec la quantité ?",
    "answer": "Pour distinguer les pièces, cartons et autres unités et éviter un écart de conversion.",
    "module": "312",
    "revision": "312-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-312-situation-fiche-1",
    "kind": "situation",
    "prompt": "Un lot plus récent expire avant l’ancien. Quelle règle peut lui donner la priorité ?",
    "answer": "FEFO si la procédure de l’article le prescrit. Vérifier dates, état et autorisation.",
    "module": "312",
    "revision": "312-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-312-situation-fiche-2",
    "kind": "situation",
    "prompt": "Le stock disponible tombe sous le seuil, mais une livraison est attendue demain. Que vérifiez-vous ?",
    "answer": "Sa confirmation, l’heure utilisable et les besoins couverts avant de déclencher la décision.",
    "module": "312",
    "revision": "312-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-312-situation-fiche-3",
    "kind": "situation",
    "prompt": "Le système indique 40 pièces, votre comptage en donne 36. Quelle suite ?",
    "answer": "Recompter, vérifier unité et mouvements, puis transmettre l’écart et demander l’ajustement autorisé.",
    "module": "312",
    "revision": "312-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-312-situation-fiche-4",
    "kind": "situation",
    "prompt": "Un lot est marqué disponible mais son contrôle est en cours. Que faites-vous ?",
    "answer": "Suspendre son usage, signaler l’incohérence et rétablir le statut selon la procédure.",
    "module": "312",
    "revision": "312-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
