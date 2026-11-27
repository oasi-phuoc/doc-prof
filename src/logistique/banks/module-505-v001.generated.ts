import type { LogistiqueUnit } from '../approved-banks'

export const module505 = [
  {
    "id": "log-505-objectifs-apercu",
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
          "Décrire les étapes de la {g}PCP{/g} (programme → suivi)",
          "Comparer production {g}push{/g} et {g}pull{/g}",
          "Expliquer la production en {g}vrac{/g} et le calcul {g}besoin primaire / secondaire / net{/g}",
          "Distinguer les types de {g}nomenclature{/g} (quantitative, structurelle, modulaire, variantes)"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 505",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Relier le programme de production aux composants et à la capacité.",
          "Distinguer pilotage par anticipation et déclenchement selon la demande.",
          "Vérifier que l’ordre et la nomenclature sont à jour."
        ]
      }
    ],
    "module": "505",
    "revision": "505-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-505-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "5. Planification et contrôle de la production (PCP)",
        "sub": false
      },
      {
        "kind": "paragraph",
        "text": "Les ventes établissent un {g}programme de vente{/g}. Les achats organisent MP / semi-finis / finis. Pour la fabrication interne : {g}programme de production{/g} → planification des besoins matières → identifier la {g}couverture insuffisante{/g} → {g}délais & capacités{/g} → quand les ordres sont prêts, le {g}contrôle{/g} de production surveille tout le process."
      },
      {
        "kind": "heading",
        "text": "Tâches de la PCP",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/500/505/cfc/log-505-notions-1-v001.svg",
        "alt": "Prévoir. Quantités et dates. Attribuer. Charge et ressources. Contrôler. Avancement et écarts.",
        "caption": "Le contrôle compare la réalisation au programme validé."
      },
      {
        "kind": "table",
        "headers": [
          "Étape",
          "Contenu"
        ],
        "rows": [
          [
            "{g}Programme de production{/g}",
            "Produits : type, quantité, délai"
          ],
          [
            "{g}Gestion matériel / quantités{/g}",
            "Pièces, sous-ensembles, achats : type, quantité, délai"
          ],
          [
            "{g}Délais & capacités{/g}",
            "Temps de traitement · capacités homme/machine · ordre de prod."
          ],
          [
            "{g}Lancement d'ordre{/g}",
            "Démarrage · attribution des travaux / ordres"
          ],
          [
            "{g}Suivi des commandes{/g}",
            "Avancement · capacités · commandes fournisseurs · entrées"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "5.1 Production push / pull",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "",
          "{g}Push{/g} (flux poussé)",
          "{g}Pull{/g} (flux tiré)"
        ],
        "rows": [
          [
            "Pilotage",
            "Unité {g}centrale{/g} de planification / contrôle",
            "Souvent {g}décentralisé{/g} · besoins clients"
          ],
          [
            "Flux",
            "Infos et marchandises {g}même sens{/g}",
            "Infos {g}à contre-courant{/g} du matériel (client → amont)"
          ],
          [
            "Effets",
            "Stocks ↑ · délais ↑ · coûts de planification ↑",
            "Stocks ↓ · délais ↓ · planification ↓ · orientation client ↑"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "Production {g}selon les besoins{/g} en pull."
      },
      {
        "kind": "heading",
        "text": "5.2 Production en vrac (bulk)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "*Bulk* = masse / quantité. Marchandises en {g}très grandes{/g} quantités (cargaisons…) · souvent pour commerçants / transformateurs · semi-finis ou biens de production pour un produit final."
      },
      {
        "kind": "paragraph",
        "text": "👉 Même caractéristiques · quantités {g}non limitées{/g} · production {g}récurrente{/g} (= logique de masse)."
      },
      {
        "kind": "heading",
        "text": "5.3 Liste des pièces / nomenclature",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/500/505/cfc/log-505-notions-2-v001.svg",
        "alt": "Produit. Référence de l’ordre. Sous-ensemble. Nombre par produit. Composant. Quantité de la pièce.",
        "caption": "La quantité de chaque pièce se calcule à partir de la version et de l’ordre."
      },
      {
        "kind": "paragraph",
        "text": "Programme de vente = {g}besoin primaire{/g} (produits vendables, ex. voitures) · composé de pièces / sous-ensembles."
      },
      {
        "kind": "paragraph",
        "text": "{g}Nomenclature{/g} (*Bill of Materials*, BOM) : tous les articles et sous-ensembles du produit final = {g}besoins secondaires{/g} (servent à produire le primaire)."
      },
      {
        "kind": "paragraph",
        "text": "Comparaison besoins secondaires ↔ stock actuel → {g}besoins secondaires nets{/g}."
      },
      {
        "kind": "paragraph",
        "text": "{g}Exemple :{/g} primaire 100 voitures · secondaire 400 pneus · stock 100 → besoin net {g}300{/g} pneus."
      },
      {
        "kind": "heading",
        "text": "5.3.1 Types de nomenclature",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Quantitative{/g} — tous les composants {g}sans{/g} structure (interne / externe). Clair pour {g}achats{/g} / coûts · pas pour le montage (pas d'appartenance / hiérarchie). Codes usuels : {g}B{/g} = sous-ensemble · {g}E{/g} = fabrication interne · {g}F{/g} = pièce externe."
      },
      {
        "kind": "paragraph",
        "text": "{g}Structurelle{/g} — forme {g}hiérarchisée{/g} · stade de fabrication visible · quantités par module (ex. 1 produit A → 3 groupes II → 2 A → 6). Tableau possible, moins lisible."
      },
      {
        "kind": "paragraph",
        "text": "{g}Modulaire{/g} — découpe de la structurelle · montre l'assemblage d'un {g}sous-ensemble{/g} donné (niveaux de fabrication)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Variantes{/g} — produit final avec {g}légères différences{/g} (couleur vélo · boîte auto · tension 120 V / 230 V…)."
      },
      {
        "kind": "paragraph",
        "text": "Utilisées en : planification prod., matériaux, capacités, temps, montage, achats, coûts… 👉 Qualité des nomenclatures {g}critique{/g} : erreurs = perturbations + coûts."
      }
    ],
    "module": "505",
    "revision": "505-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-505-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}BOM{/g} — Liste structurée des composants, appelée nomenclature."
      },
      {
        "kind": "paragraph",
        "text": "{g}Besoin de composant{/g} — Quantité de composants nécessaire selon le programme de fabrication."
      },
      {
        "kind": "paragraph",
        "text": "{g}Capacité{/g} — Quantité ou charge réalisable pendant une période selon les moyens."
      },
      {
        "kind": "paragraph",
        "text": "{g}Charge{/g} — Travail demandé à une ressource dans la période considérée."
      },
      {
        "kind": "paragraph",
        "text": "{g}Contrôle d’avancement{/g} — Vérification de la réalisation par rapport au plan."
      },
      {
        "kind": "paragraph",
        "text": "{g}Ordonnancement{/g} — Affectation et enchaînement des travaux dans le temps."
      },
      {
        "kind": "paragraph",
        "text": "{g}Ordre de fabrication{/g} — Instruction de fabriquer une quantité d’un article selon un dossier."
      },
      {
        "kind": "paragraph",
        "text": "{g}PCP{/g} — Planification et contrôle de la production."
      },
      {
        "kind": "paragraph",
        "text": "{g}Programme de production{/g} — Prévision ou engagement de fabrication par période et article."
      },
      {
        "kind": "paragraph",
        "text": "{g}Pull{/g} — Déclenchement du flux par un besoin aval."
      },
      {
        "kind": "paragraph",
        "text": "{g}Push{/g} — Déclenchement à partir du plan ou des quantités anticipées."
      },
      {
        "kind": "paragraph",
        "text": "{g}Révision de nomenclature{/g} — Version qui fixe les composants applicables à un ordre."
      }
    ],
    "module": "505",
    "revision": "505-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-505-maths-fiche-1",
    "kind": "maths",
    "prompt": "Un ordre de 25 produits exige trois clips et deux faces par unité. Calculez les besoins.",
    "answer": "75 clips et 50 faces.",
    "calculation": "25 × 3 = 75. 25 × 2 = 50.",
    "module": "505",
    "revision": "505-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-505-maths-fiche-2",
    "kind": "maths",
    "prompt": "La capacité est de 480 min. Les ordres prennent 175 et 220 min. Calculez la capacité restante.",
    "answer": "85 minutes.",
    "calculation": "480 − 175 − 220 = 85 min.",
    "module": "505",
    "revision": "505-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-505-maths-fiche-3",
    "kind": "maths",
    "prompt": "Une commande de 80 modules en exige deux par kit. Combien de kits sont couverts ?",
    "answer": "40 kits.",
    "calculation": "80 ÷ 2 = 40.",
    "module": "505",
    "revision": "505-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-505-maths-fiche-4",
    "kind": "maths",
    "prompt": "Il reste 55 composants pour un besoin de 72. Calculez le besoin net sans entrée attendue.",
    "answer": "17 composants.",
    "calculation": "72 − 55 = 17.",
    "module": "505",
    "revision": "505-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-505-maths-fiche-5",
    "kind": "maths",
    "prompt": "Un ordre prévu de 200 unités donne 170 unités conformes à l’heure du relevé. Calculez le taux réalisé.",
    "answer": "85 %.",
    "calculation": "170 ÷ 200 × 100 = 85 %.",
    "module": "505",
    "revision": "505-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-505-verification-fiche-1",
    "kind": "verification",
    "prompt": "Qu’est-ce qu’une nomenclature ?",
    "answer": "La liste structurée des composants et de leurs quantités ou relations.",
    "module": "505",
    "revision": "505-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-505-verification-fiche-2",
    "kind": "verification",
    "prompt": "Quel est le déclencheur d’un système pull ?",
    "answer": "Un besoin exprimé ou une consommation de l’aval.",
    "module": "505",
    "revision": "505-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-505-verification-fiche-3",
    "kind": "verification",
    "prompt": "Pourquoi comparer charge et capacité ?",
    "answer": "Pour détecter une surcharge ou une capacité exploitable dans la période.",
    "module": "505",
    "revision": "505-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-505-verification-fiche-4",
    "kind": "verification",
    "prompt": "Quelles données rattacher à l’ordre ?",
    "answer": "Article, version, quantité, étapes, date et éléments prévus de suivi.",
    "module": "505",
    "revision": "505-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-505-verification-fiche-5",
    "kind": "verification",
    "prompt": "À quoi sert le contrôle d’avancement ?",
    "answer": "À repérer les écarts et ajuster ou signaler le plan.",
    "module": "505",
    "revision": "505-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-505-situation-fiche-1",
    "kind": "situation",
    "prompt": "La nomenclature affichée diffère de la version de l’ordre. Quelle action précède la préparation ?",
    "answer": "Suspendre la préparation et faire confirmer la version applicable.",
    "module": "505",
    "revision": "505-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-505-situation-fiche-2",
    "kind": "situation",
    "prompt": "Deux ordres dépassent la capacité prévue. Que présentez-vous au responsable ?",
    "answer": "Charge, capacité manquante, délais, contraintes et possibilités de replanification.",
    "module": "505",
    "revision": "505-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-505-situation-fiche-3",
    "kind": "situation",
    "prompt": "Le plan prévoit 60 produits mais les composants n’en couvrent que 45. Que transmettez-vous ?",
    "answer": "Quantité réalisable, pièce limitante et besoin restant.",
    "module": "505",
    "revision": "505-v001",
    "approvedFor": [
      "CFC"
    ]
  }
] satisfies readonly LogistiqueUnit[]
