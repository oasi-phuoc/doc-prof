import type { LogistiqueUnit } from '../approved-banks'

export const module502 = [
  {
    "id": "log-502-objectifs-apercu",
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
          "Situer la {g}logistique de production{/g} entre approvisionnement et distribution",
          "Citer ses {g}objectifs{/g} et les relier aux {g}6B{/g}",
          "Distinguer les {g}types de stocks{/g} (amont, intermédiaire, aval, proximité)",
          "Décrire les tâches de la logistique d'{g}élimination{/g} et l'ordre prévention → valorisation → élimination"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 502",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Organiser les mouvements entre les achats, la production et la distribution.",
          "Distinguer réserves, encours et produits terminés.",
          "Rattacher les sorties de produits et de rebuts au flux prévu."
        ]
      }
    ],
    "module": "502",
    "revision": "502-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-502-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "2. Logistique de production",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "2.1 Définition",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Processus d'une entreprise de fabrication situé entre la logistique d'{g}approvisionnement{/g} (input) et de {g}distribution{/g} (output)."
      },
      {
        "kind": "paragraph",
        "text": "Elle {g}planifie et contrôle{/g} le flux de marchandises : - Approvisionner la production depuis les entrepôts (matières premières, auxiliaires, consommables…) - Après fabrication : {g}évacuer{/g} et stocker correctement les produits - Soutenir les activités de production"
      },
      {
        "kind": "heading",
        "text": "2.2 Objectifs et tâches",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/500/502/cfc/log-502-notions-1-v001.svg",
        "alt": "Approvisionner. Matières et composants. Desservir. Postes et encours. Remettre. Sorties conformes.",
        "caption": "Les mouvements physiques et leur enregistrement se suivent."
      },
      {
        "kind": "paragraph",
        "text": "Toutes les mesures du processus de {g}création de valeur{/g} : de la prise en charge des {g}facteurs de production{/g} jusqu'au transfert des produits finis à la distribution."
      },
      {
        "kind": "paragraph",
        "text": "Mettre à disposition matériaux et informations : {g}bon type{/g}, {g}bonne quantité{/g}, {g}bonne qualité{/g}, {g}bon moment{/g} — comparer la {g}règle des 6B{/g} (Jünemann, module 101)."
      },
      {
        "kind": "table",
        "headers": [
          "Objectif",
          "Sens"
        ],
        "rows": [
          [
            "Délais d'{g}exécution{/g} courts",
            "Temps de passage ↓"
          ],
          [
            "Grand respect des {g}délais{/g}",
            "Fiabilité"
          ],
          [
            "{g}Stocks{/g} aussi bas que possible",
            "Coûts de stockage ↓"
          ],
          [
            "Niveau de {g}qualité{/g} élevé",
            "Peu de rebuts / retours"
          ],
          [
            "Utilisation optimale de la {g}capacité{/g}",
            "Homme + machine"
          ],
          [
            "{g}Voies de transport{/g} optimales",
            "Flux dans l'atelier"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "👉 En résumé : réduire au maximum les {g}coûts de fabrication{/g}."
      },
      {
        "kind": "heading",
        "text": "2.3 Types de stocks dans la production",
        "sub": true
      },
      {
        "kind": "heading",
        "text": "2.3.1 Stocks d'approvisionnement / de production",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Stocker matières premières, semi-finis et finis nécessaires à la production."
      },
      {
        "kind": "paragraph",
        "text": "- {g}Entrepôt d'approvisionnement{/g} : réception des marchandises {g}achetées{/g} - {g}Entrepôts de production{/g} : souvent dans la zone de prod. → distances ↓ Petites entreprises : les deux souvent {g}réunis{/g}"
      },
      {
        "kind": "table",
        "headers": [
          "Type",
          "Rôle"
        ],
        "rows": [
          [
            "Production {g}en amont{/g}",
            "MP, semi-finis, finis pour démarrer le process"
          ],
          [
            "{g}Intermédiaire{/g}",
            "Semi-finis en attente d'une étape suivante"
          ],
          [
            "Production {g}en aval{/g}",
            "Semi-finis / finis prêts pour suite (ex. peinture) ou marché"
          ],
          [
            "Stock de {g}proximité{/g}",
            "Petits espaces, souvent {g}mobiles{/g} · libre-service · en général {g}sans{/g} compta ERP pièce à pièce (vis = poste consommable du produit fini)"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "2.4 Logistique opérationnelle d'élimination",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/500/502/cfc/log-502-notions-2-v001.svg",
        "alt": "Conforme. Transfert vers l’aval. Écart. Contrôle ou filière désignée.",
        "caption": "Chaque sortie suit son statut et sa destination prévue."
      },
      {
        "kind": "paragraph",
        "text": "Collecter, trier, emballer, stocker et évacuer les déchets — préparation et exécution {g}écologique{/g} et {g}économique{/g}."
      },
      {
        "kind": "paragraph",
        "text": "Ordre de priorité : {g}prévention{/g} → {g}valorisation{/g} → {g}élimination{/g}."
      },
      {
        "kind": "heading",
        "text": "2.4.1 Tâches (logistique classique)",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "Type",
          "Contenu"
        ],
        "rows": [
          [
            "Prestation {g}principale{/g}",
            "Transport, Transbordement, Stockage ({g}TTS{/g})"
          ],
          [
            "Prestation {g}supplémentaire{/g}",
            "Collecte, tri, emballage / regroupement"
          ],
          [
            "Prestation d'{g}information{/g}",
            "Commandes, suivi, traçabilité"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "🔎 Détails élimination : module {g}106{/g}."
      }
    ],
    "module": "502",
    "revision": "502-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-502-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Approvisionnement de poste{/g} — Mise à disposition des ressources au poste de production."
      },
      {
        "kind": "paragraph",
        "text": "{g}Déchet{/g} — Matière ou objet orienté vers une filière selon sa classification."
      },
      {
        "kind": "paragraph",
        "text": "{g}Encours{/g} — Produit dont le traitement a commencé et reste incomplet."
      },
      {
        "kind": "paragraph",
        "text": "{g}Entrée matière{/g} — Réception ou mise à disposition d’un intrant pour le processus."
      },
      {
        "kind": "paragraph",
        "text": "{g}Flux interne{/g} — Mouvement entre les zones d’un même site."
      },
      {
        "kind": "paragraph",
        "text": "{g}Logistique de production{/g} — Organisation des mouvements et informations entre les opérations de production."
      },
      {
        "kind": "paragraph",
        "text": "{g}Poste{/g} — Emplacement ou fonction où une opération est effectuée."
      },
      {
        "kind": "paragraph",
        "text": "{g}Produit fini{/g} — Unité qui a terminé les étapes prévues."
      },
      {
        "kind": "paragraph",
        "text": "{g}Rebut{/g} — Sortie écartée des produits acceptés, selon la décision."
      },
      {
        "kind": "paragraph",
        "text": "{g}Stock intermédiaire{/g} — Quantité entre deux étapes successives."
      },
      {
        "kind": "paragraph",
        "text": "{g}Transfert{/g} — Mouvement enregistré entre deux emplacements ou périmètres."
      },
      {
        "kind": "paragraph",
        "text": "{g}Valorisation{/g} — Utilisation ou traitement d’une matière selon les filières applicables."
      }
    ],
    "module": "502",
    "revision": "502-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-502-maths-fiche-1",
    "kind": "maths",
    "prompt": "Une zone contient 28 bacs. Elle en reçoit 17 et en envoie 22. Calculez le solde.",
    "answer": "23 bacs.",
    "calculation": "28 + 17 − 22 = 23.",
    "module": "502",
    "revision": "502-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-502-maths-fiche-2",
    "kind": "maths",
    "prompt": "Trois lignes consomment chacune 16 kg. Calculez la quantité totale.",
    "answer": "48 kg.",
    "calculation": "3 × 16 = 48 kg.",
    "module": "502",
    "revision": "502-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-502-maths-fiche-3",
    "kind": "maths",
    "prompt": "Sur 200 pièces, 12 sont rebutées. Calculez le taux.",
    "answer": "6 %.",
    "calculation": "12 ÷ 200 × 100 = 6 %.",
    "module": "502",
    "revision": "502-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-502-maths-fiche-4",
    "kind": "maths",
    "prompt": "Une unité attend 25 minutes puis est traitée en 8 minutes. Calculez le temps total.",
    "answer": "33 minutes.",
    "calculation": "25 + 8 = 33 min.",
    "module": "502",
    "revision": "502-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-502-maths-fiche-5",
    "kind": "maths",
    "prompt": "Un lot de 90 pièces est réparti entre 72 conformes, 8 rebutées et des unités à contrôler. Combien restent à contrôler ?",
    "answer": "Dix pièces.",
    "calculation": "90 − 72 − 8 = 10.",
    "module": "502",
    "revision": "502-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-502-verification-fiche-1",
    "kind": "verification",
    "prompt": "Où se situe la logistique de production dans le flux ?",
    "answer": "Entre l’approvisionnement et la mise à disposition des sorties à la distribution.",
    "module": "502",
    "revision": "502-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-502-verification-fiche-2",
    "kind": "verification",
    "prompt": "À quoi sert un stock intermédiaire ?",
    "answer": "À couvrir une transition entre opérations lorsque la cadence ou le délai diffère.",
    "module": "502",
    "revision": "502-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-502-verification-fiche-3",
    "kind": "verification",
    "prompt": "Que distingue un encours d’un produit fini ?",
    "answer": "Une opération du processus reste à réaliser pour l’encours.",
    "module": "502",
    "revision": "502-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-502-verification-fiche-4",
    "kind": "verification",
    "prompt": "Pourquoi suivre aussi les rebuts ?",
    "answer": "Pour conserver le bilan de quantité et appliquer la filière définie.",
    "module": "502",
    "revision": "502-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-502-verification-fiche-5",
    "kind": "verification",
    "prompt": "Quel document peut confirmer un transfert interne ?",
    "answer": "L’ordre ou enregistrement qui précise quantité, référence, origine et destination.",
    "module": "502",
    "revision": "502-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-502-situation-fiche-1",
    "kind": "situation",
    "prompt": "Les bacs s’accumulent avant une étape. Quelles mesures relevez-vous ?",
    "answer": "Quantité en attente, capacité, cadence et durée de séjour.",
    "module": "502",
    "revision": "502-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-502-situation-fiche-2",
    "kind": "situation",
    "prompt": "Un lot non conforme arrive en zone de produits finis. Quelle décision prenez-vous ?",
    "answer": "Suspendre son utilisation, préserver sa trace et transmettre selon la procédure.",
    "module": "502",
    "revision": "502-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-502-situation-fiche-3",
    "kind": "situation",
    "prompt": "Deux ateliers comptent la même matière dans des unités différentes. Comment éviter un écart ?",
    "answer": "Utiliser une unité commune à partir d’une conversion vérifiée.",
    "module": "502",
    "revision": "502-v001",
    "approvedFor": [
      "CFC"
    ]
  }
] satisfies readonly LogistiqueUnit[]
