import type { LogistiqueUnit } from '../approved-banks'

export const module702 = [
  {
    "id": "log-702-objectifs-apercu",
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
          "Nommer les {g}5 catégories{/g} de coûts de stockage",
          "Distinguer {g}coûts fixes{/g} et {g}coûts variables{/g}",
          "Calculer la {g}valeur du stock{/g}, les {g}intérêts{/g} et les {g}frais fixes{/g} par emplacement",
          "Argumenter des mesures de {g}réduction des stocks{/g} et le remplacement d'{g}équipements{/g}"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 702",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Repérer les grandes familles de dépenses d'un entrepôt et leurs facteurs.",
          "Classer les coûts selon leur comportement et mesurer les ressources immobilisées par le stock.",
          "Comparer des solutions de stockage ou de manutention sur des bases similaires."
        ]
      }
    ],
    "module": "702",
    "revision": "702-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-702-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "2. Les coûts de stockage",
        "sub": false
      },
      {
        "kind": "paragraph",
        "text": "Gérer les stocks génère des {g}coûts{/g} — fixes et variables — qu'il faut connaître pour optimiser l'entrepôt (lien modules {g}705{/g} / {g}704{/g})."
      },
      {
        "kind": "heading",
        "text": "2.1 Les cinq catégories de coûts",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "Catégorie",
          "Exemples de facteurs"
        ],
        "rows": [
          [
            "{g}Coût de personnel{/g}",
            "Salaires · {g}gratifications{/g} · formation"
          ],
          [
            "{g}Coût de stockage des marchandises{/g}",
            "Détérioration · vieillissement · {g}immobilisation du capital{/g}"
          ],
          [
            "{g}Coûts des locaux{/g}",
            "{g}Loyer{/g} · électricité · chauffage · nettoyage"
          ],
          [
            "{g}Manutention & auxiliaires{/g}",
            "Chariots · {g}amortissement{/g} · entretien engins"
          ],
          [
            "{g}Consommables{/g}",
            "Papier · cartouches · {g}emballages{/g}"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "2.2 Coûts fixes vs variables",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/700/702/cfc/log-702-notions-1-v001.svg",
        "alt": "Fixes. CHF 4 200 par mois. Variables. 640 × CHF 1,75. Total. CHF 5 320.",
        "caption": "Les frais d’emballage augmentent avec le nombre de commandes."
      },
      {
        "kind": "table",
        "headers": [
          "Type",
          "Définition",
          "Exemples"
        ],
        "rows": [
          [
            "{g}Coûts fixes{/g}",
            "Générés {g}à long terme{/g} · indépendants du volume (souvent)",
            "Salaires · loyers · amortissements · assurances"
          ],
          [
            "{g}Coûts variables{/g}",
            "Modifiables {g}à court terme{/g} · liés à l'activité",
            "Marchandises · transport · matières premières · énergie"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "{g}Coûts totaux = coûts fixes + coûts variables{/g}"
      },
      {
        "kind": "heading",
        "text": "2.3 Engagement de capitaux & intérêts",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Immobilisation du capital{/g} = l'argent n'est pas en liquidités mais en {g}stock{/g} (ex. 1 pièce CHF 500 → 10 pièces CHF 5'000)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Valeur du stock{/g} = Σ (quantité × prix de revient)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Intérêts{/g} sur capital immobilisé : valeur stock × taux (ex. {g}2 %{/g}/an)."
      },
      {
        "kind": "heading",
        "text": "2.4 Locaux, équipements et consommables",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Nouvel entrepôt{/g} — planification · construction · assurance · financement · équipement · entretien · énergie…"
      },
      {
        "kind": "paragraph",
        "text": "{g}Chariot neuf{/g} — productivité ↑ · énergie/entretien ↓ · sécurité · ergonomie · TCO sur durée de vie."
      },
      {
        "kind": "paragraph",
        "text": "{g}Consommables{/g} — comparer fournisseurs · commandes groupées · emballages réutilisables/recyclables."
      },
      {
        "kind": "heading",
        "text": "2.5 Amortissement linéaire",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/700/702/cfc/log-702-notions-2-v001.svg",
        "alt": "Prix d'achat. CHF 24 000. Valeur amortissable. 24 000 − 4 000. Amortissement annuel. CHF 4 000.",
        "caption": "Exemple sur cinq ans avec une valeur résiduelle prévue."
      },
      {
        "kind": "paragraph",
        "text": "Répartition du coût d'un bien sur sa durée de vie (ex. chariot {g}5 ans{/g})."
      },
      {
        "kind": "paragraph",
        "text": "{g}Amortissement annuel{/g} = (coût d'acquisition − valeur résiduelle estimée) ÷ durée d'utilisation. {g}Valeur nette comptable{/g} = coût d'acquisition − amortissements cumulés."
      }
    ],
    "module": "702",
    "revision": "702-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-702-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Coût fixe{/g} — Dépense qui varie peu avec le volume pendant une période et dans une plage d'activité donnée."
      },
      {
        "kind": "paragraph",
        "text": "{g}Coût variable{/g} — Dépense qui change avec le volume ou un autre facteur mesurable d'activité."
      },
      {
        "kind": "paragraph",
        "text": "{g}Coût total{/g} — Somme des coûts fixes et variables du périmètre étudié."
      },
      {
        "kind": "paragraph",
        "text": "{g}Prix de revient{/g} — Coût unitaire retenu pour valoriser un bien."
      },
      {
        "kind": "paragraph",
        "text": "{g}Valeur du stock{/g} — Somme des quantités multipliées par les prix de revient correspondants."
      },
      {
        "kind": "paragraph",
        "text": "{g}Capital immobilisé{/g} — Fonds engagés dans des biens qui ne sont pas disponibles en trésorerie."
      },
      {
        "kind": "paragraph",
        "text": "{g}Coût d'opportunité{/g} — Valeur à laquelle on renonce en consacrant le capital à un usage donné."
      },
      {
        "kind": "paragraph",
        "text": "{g}Consommable{/g} — Fourniture utilisée ou épuisée par l'exploitation."
      },
      {
        "kind": "paragraph",
        "text": "{g}Amortissement linéaire{/g} — Répartition régulière de la valeur amortissable sur la durée retenue."
      },
      {
        "kind": "paragraph",
        "text": "{g}Valeur nette comptable{/g} — Valeur d'acquisition diminuée des amortissements cumulés."
      },
      {
        "kind": "paragraph",
        "text": "{g}Valeur résiduelle{/g} — Valeur estimée d'un bien en fin d'utilisation."
      },
      {
        "kind": "paragraph",
        "text": "{g}Coût de possession{/g} — Dépenses à considérer pour détenir et utiliser un stock ou un équipement."
      }
    ],
    "module": "702",
    "revision": "702-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-702-maths-fiche-1",
    "kind": "maths",
    "prompt": "Un stock contient 60 bacs à CHF 22 et 45 couvercles à CHF 8. Calculez sa valeur.",
    "answer": "CHF 1 680",
    "calculation": "60 × 22 + 45 × 8 = 1 680.",
    "module": "702",
    "revision": "702-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-702-maths-fiche-2",
    "kind": "maths",
    "prompt": "Calculez l'intérêt annuel à 3 % sur un stock moyen de CHF 54 000.",
    "answer": "CHF 1 620",
    "calculation": "54 000 × 0,03 = 1 620.",
    "module": "702",
    "revision": "702-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-702-maths-fiche-3",
    "kind": "maths",
    "prompt": "L'entrepôt paie CHF 32 400 de frais fixes annuels pour 180 emplacements. Quel est le coût fixe annuel moyen par emplacement ?",
    "answer": "CHF 180 par emplacement",
    "calculation": "32 400 ÷ 180 = 180.",
    "module": "702",
    "revision": "702-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-702-maths-fiche-4",
    "kind": "maths",
    "prompt": "Calculez le coût mensuel de 640 commandes si les frais fixes sont CHF 4 200 et l'emballage coûte CHF 1,75 par commande.",
    "answer": "CHF 5 320",
    "calculation": "4 200 + 640 × 1,75 = 5 320.",
    "module": "702",
    "revision": "702-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-702-maths-fiche-5",
    "kind": "maths",
    "prompt": "Un appareil de CHF 24 000 sera revendu CHF 4 000 après 5 ans. Calculez son amortissement annuel linéaire.",
    "answer": "CHF 4 000 par an",
    "calculation": "(24 000 − 4 000) ÷ 5 = 4 000.",
    "module": "702",
    "revision": "702-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-702-maths-fiche-6",
    "kind": "maths",
    "prompt": "Un chariot coûte CHF 32 000. Il est amorti sur 5 ans sans valeur résiduelle. Quelle est sa valeur nette après 3 ans ?",
    "answer": "CHF 12 800",
    "calculation": "32 000 − 3 × (32 000 ÷ 5) = 12 800.",
    "module": "702",
    "revision": "702-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-702-maths-fiche-7",
    "kind": "maths",
    "prompt": "Le stock moyen passe de CHF 80 000 à CHF 64 000. À 2,5 % par an, calculez l'économie théorique d'intérêts.",
    "answer": "CHF 400 par an",
    "calculation": "(80 000 − 64 000) × 0,025 = 400.",
    "module": "702",
    "revision": "702-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-702-verification-fiche-1",
    "kind": "verification",
    "prompt": "Citez les cinq catégories de dépenses du cours.",
    "answer": "Personnel, marchandises stockées, locaux, moyens de manutention et auxiliaires, consommables.",
    "module": "702",
    "revision": "702-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-702-verification-fiche-2",
    "kind": "verification",
    "prompt": "Un loyer mensuel reste identique malgré une baisse des commandes. Comment le classer ?",
    "answer": "Coût fixe dans les conditions et la période considérées.",
    "module": "702",
    "revision": "702-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-702-verification-fiche-3",
    "kind": "verification",
    "prompt": "Pourquoi l'énergie peut-elle combiner une part fixe et une part variable ?",
    "answer": "Un abonnement ou un équipement de base coûte même à faible activité, tandis que certains usages croissent avec le volume.",
    "module": "702",
    "revision": "702-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-702-verification-fiche-4",
    "kind": "verification",
    "prompt": "Quel intérêt présente le calcul du coût fixe par emplacement ?",
    "answer": "Il répartit un coût commun et aide à comparer des capacités sur des bases homogènes.",
    "module": "702",
    "revision": "702-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-702-verification-fiche-5",
    "kind": "verification",
    "prompt": "Pourquoi intégrer l'entretien dans la comparaison de deux chariots ?",
    "answer": "Il influence les dépenses totales et la disponibilité pendant l'utilisation.",
    "module": "702",
    "revision": "702-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-702-situation-fiche-1",
    "kind": "situation",
    "prompt": "Un fournisseur propose une remise si vous doublez la quantité achetée. Quels éléments comparez-vous avant d'accepter ?",
    "answer": "L'économie d'achat et les intérêts, places, risques de dégradation ou d'invendus, ainsi que les conséquences sur la disponibilité.",
    "module": "702",
    "revision": "702-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-702-situation-fiche-2",
    "kind": "situation",
    "prompt": "Les cartons jetables coûtent moins cher à l'achat que des bacs réutilisables. Comment comparer ?",
    "answer": "Choisir un même nombre de rotations; inclure achats, retours, nettoyage, pertes et fin d'usage.",
    "module": "702",
    "revision": "702-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-702-situation-fiche-3",
    "kind": "situation",
    "prompt": "Après une hausse des frais du bâtiment, on envisage de déménager. Quelles données demandez-vous ?",
    "answer": "Loyer, équipements et déménagement, énergie, capacité utile, distances internes et conséquences sur les délais.",
    "module": "702",
    "revision": "702-v001",
    "approvedFor": [
      "CFC"
    ]
  }
] satisfies readonly LogistiqueUnit[]
