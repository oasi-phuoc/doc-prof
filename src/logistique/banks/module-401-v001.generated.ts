import type { LogistiqueUnit } from '../approved-banks'

export const module401 = [
  {
    "id": "log-401-objectifs-apercu",
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
          "Définir le {g}stockage{/g} (local et biens) et la fonction de {g}réserve{/g}",
          "Expliquer la fonction de {g}sécurité{/g} (stock de sécurité / tampon)",
          "Citer et illustrer les fonctions de {g}transformation{/g}, {g}contrôle-tri{/g}, {g}spéculation{/g} et {g}affinage/maturation{/g}"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 401",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Relier le stockage à la disponibilité des articles, au délai et aux besoins.",
          "Distinguer réserve, sécurité, transformation et contrôle.",
          "Comparer coûts et bénéfices avant d’augmenter un stock."
        ]
      }
    ],
    "module": "401",
    "revision": "401-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-401-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "1. Le rôle du stockage",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "1.1 La fonction de réserve",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/401/commun/log-401-notions-1-v001.svg",
        "alt": "Arrivée. Articles utilisables. Réserve. Stock mesuré. Besoin. Moment du prélèvement.",
        "caption": "Le délai et la demande fixent la couverture nécessaire."
      },
      {
        "kind": "paragraph",
        "text": "Le stockage de réserves n'est pas nouveau : denrées alimentaires chez nos ancêtres ; en Suisse, {g}réserves obligatoires{/g} de la Confédération pour l'approvisionnement en crise ; chez l'écureuil, noisettes dispersées (comparable au stockage {g}chaotique{/g} → module {g}406{/g})."
      },
      {
        "kind": "paragraph",
        "text": "{g}Définition chez EnterSite AG :{/g} « stockage » désigne à la fois le {g}local{/g} où l'on stocke et les {g}biens{/g} qui y sont conservés."
      },
      {
        "kind": "paragraph",
        "text": "{g}Remarque :{/g} on ne peut souvent pas acheter uniquement la quantité immédiatement nécessaire → l'entrepôt tient un {g}stock de réserve{/g}."
      },
      {
        "kind": "heading",
        "text": "1.2 Aperçu des fonctions de stockage",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/401/commun/log-401-notions-2-v001.svg",
        "alt": "Réserve. Couvrir un besoin futur. Sécurité. Absorber un aléa. Transformation. Modifier la présentation.",
        "caption": "La même zone peut remplir plusieurs fonctions selon le flux."
      },
      {
        "kind": "heading",
        "text": "1.2.1 Fonction de sécurité",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Forme la plus importante. Stocks d'urgence = fonction de {g}réserve{/g}, aussi appelée {g}tampon{/g} ou {g}compensation{/g}, pour surmonter des situations critiques :"
      },
      {
        "kind": "list",
        "items": [
          "retards de livraison / difficultés de transport",
          "variations de consommation (demande ↑ ou aléas de production)",
          "marchandises livrées insuffisantes ou défectueuses"
        ]
      },
      {
        "kind": "paragraph",
        "text": "{g}Remarque :{/g} en langage technique, on parle aussi de {g}stock de sécurité{/g}."
      },
      {
        "kind": "heading",
        "text": "1.2.2 Fonction de transformation",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Dans les entrepôts commerciaux : transvaser, mélanger, trier — mettre les marchandises à disposition dans les {g}quantités{/g} souhaitées ou en {g}kits{/g}."
      },
      {
        "kind": "paragraph",
        "text": "Exemples typiques : - reconditionnement - coupe / découpe - mélange (chimie, colorants) - prémontage de composants - séchage (ex. bois)"
      },
      {
        "kind": "heading",
        "text": "1.2.3 Fonction de contrôle et de tri",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Dans le flux de marchandises : - identification - contrôle quantité et état - suivi des délais"
      },
      {
        "kind": "paragraph",
        "text": "{g}Tri :{/g} marchandises obsolètes, inutiles ou périmées → élimination selon directives entreprise."
      },
      {
        "kind": "heading",
        "text": "1.2.4 Fonction de spéculation",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Acheter au bon moment (avant hausse de prix) pour obtenir un avantage — ex. mazout en été, revente plus cher ensuite."
      },
      {
        "kind": "heading",
        "text": "1.2.5 Fonction d'affinage ou de maturation",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Certaines marchandises n'atteignent leur qualité optimale qu'après stockage adapté (fromage, vin, produits carnés…). Locaux souvent appelés {g}entrepôts de maturation{/g}."
      }
    ],
    "module": "401",
    "revision": "401-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-401-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Affinage{/g} — Évolution organisée des caractéristiques d’un produit pendant le séjour."
      },
      {
        "kind": "paragraph",
        "text": "{g}Capital immobilisé{/g} — Moyens financiers engagés dans la marchandise en stock."
      },
      {
        "kind": "paragraph",
        "text": "{g}Contrôle{/g} — Vérification de l’identification, de l’état ou d’une exigence de stockage."
      },
      {
        "kind": "paragraph",
        "text": "{g}Coût de stockage{/g} — Coût associé à l’espace, aux opérations ou au financement des stocks."
      },
      {
        "kind": "paragraph",
        "text": "{g}Disponibilité{/g} — Possibilité d’utiliser ou de fournir l’article au moment requis."
      },
      {
        "kind": "paragraph",
        "text": "{g}Fonction de réserve{/g} — Conservation d’une quantité pour un besoin ultérieur."
      },
      {
        "kind": "paragraph",
        "text": "{g}Période de couverture{/g} — Durée pendant laquelle le stock répond à une consommation définie."
      },
      {
        "kind": "paragraph",
        "text": "{g}Réassort{/g} — Action de compléter une quantité ou un emplacement."
      },
      {
        "kind": "paragraph",
        "text": "{g}Rupture{/g} — Situation où la quantité utilisable ne couvre pas le besoin voulu."
      },
      {
        "kind": "paragraph",
        "text": "{g}Stock de sécurité{/g} — Réserve destinée à certains imprévus de demande ou d’arrivée."
      },
      {
        "kind": "paragraph",
        "text": "{g}Stock saisonnier{/g} — Quantité prévue pour un besoin lié à une saison."
      },
      {
        "kind": "paragraph",
        "text": "{g}Transformation{/g} — Modification physique ou de conditionnement réalisée pendant le flux."
      }
    ],
    "module": "401",
    "revision": "401-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-401-maths-fiche-1",
    "kind": "maths",
    "prompt": "Un stock de 96 pièces couvre une consommation constante de 12 pièces par jour. Combien de jours couvre-t-il ?",
    "answer": "Huit jours.",
    "calculation": "96 ÷ 12 = 8 jours.",
    "module": "401",
    "revision": "401-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-401-maths-fiche-2",
    "kind": "maths",
    "prompt": "Avant une période chargée, le stock passe de 130 à 175 pièces. Calculez l’augmentation.",
    "answer": "45 pièces.",
    "calculation": "175 − 130 = 45.",
    "module": "401",
    "revision": "401-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-401-maths-fiche-3",
    "kind": "maths",
    "prompt": "Le stockage de 40 bacs coûte 3 CHF par bac et par mois. Calculez le coût pour deux mois.",
    "answer": "240 CHF.",
    "calculation": "40 × 3 × 2 = 240 CHF.",
    "module": "401",
    "revision": "401-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-401-maths-fiche-4",
    "kind": "maths",
    "prompt": "Sur 80 emplacements, 68 sont occupés. Combien sont libres ?",
    "answer": "12 emplacements.",
    "calculation": "80 − 68 = 12.",
    "module": "401",
    "revision": "401-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-401-maths-fiche-5",
    "kind": "maths",
    "prompt": "Sur 180 pièces, 24 sont dédiées à la sécurité. Calculez leur part, au dixième près.",
    "answer": "13,3 %.",
    "calculation": "24 ÷ 180 × 100 ≈ 13,3 %.",
    "module": "401",
    "revision": "401-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-401-verification-fiche-1",
    "kind": "verification",
    "prompt": "Pourquoi conserver un stock de réserve ?",
    "answer": "Pour couvrir un besoin avant la prochaine disponibilité.",
    "module": "401",
    "revision": "401-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-401-verification-fiche-2",
    "kind": "verification",
    "prompt": "Quels coûts peuvent augmenter avec le stock ?",
    "answer": "L’espace, les opérations, le capital immobilisé et la perte de valeur.",
    "module": "401",
    "revision": "401-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-401-verification-fiche-3",
    "kind": "verification",
    "prompt": "Quel rôle remplit une réserve lors d’un retard ?",
    "answer": "Elle couvre un aléa dans les limites prévues.",
    "module": "401",
    "revision": "401-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-401-verification-fiche-4",
    "kind": "verification",
    "prompt": "Qu’est-ce qui différencie contrôle et transformation ?",
    "answer": "Le contrôle vérifie. La transformation modifie le produit ou son conditionnement.",
    "module": "401",
    "revision": "401-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-401-verification-fiche-5",
    "kind": "verification",
    "prompt": "Pourquoi tenir compte de la demande saisonnière ?",
    "answer": "Elle peut changer les quantités nécessaires et dates d’entrée.",
    "module": "401",
    "revision": "401-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-401-situation-fiche-1",
    "kind": "situation",
    "prompt": "Un retard de deux jours survient. Quelles données comparez-vous ?",
    "answer": "Stock utilisable, besoins jusqu’à l’arrivée confirmée et réserve disponible.",
    "module": "401",
    "revision": "401-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-401-situation-fiche-2",
    "kind": "situation",
    "prompt": "Un excédent encombre une zone nécessaire dès demain. Quelle suite proposez-vous ?",
    "answer": "Identifier son statut, informer le responsable et proposer un emplacement autorisé ou un ajustement.",
    "module": "401",
    "revision": "401-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-401-situation-fiche-3",
    "kind": "situation",
    "prompt": "L’équipe envisage d’acheter très tôt pour profiter d’un prix. Quels coûts comparez-vous ?",
    "answer": "L’économie d’achat et les coûts de stockage, de manutention et d’obsolescence.",
    "module": "401",
    "revision": "401-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
