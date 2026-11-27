import type { LogistiqueUnit } from '../approved-banks'

export const module601 = [
  {
    "id": "log-601-objectifs-apercu",
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
          "Distinguer préparation {g}statique{/g} / {g}dynamique{/g} et déplacement {g}1D{/g} / {g}2D{/g}",
          "Comparer modes de prélèvement, transfert, infos (batch / real-time) et série / parallèle",
          "Expliquer prélèvement {g}orienté commande{/g} vs {g}orienté article{/g}",
          "Décrire Pick-by-Scan, Voice, Light, Vision et {g}Pick-and-Pack{/g}"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 601",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Préparer les lignes d’une commande selon l’organisation du dépôt.",
          "Distinguer article, emplacement, lot, unité et quantité.",
          "Contrôler le prélèvement et organiser la remise à l’emballage."
        ]
      }
    ],
    "module": "601",
    "revision": "601-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-601-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "1. La préparation de commandes",
        "sub": false
      },
      {
        "kind": "paragraph",
        "text": "Rassembler des articles d'un assortiment (entrepôt) selon les {g}commandes clients{/g}. Aussi appelé « préparation » · anglais : {g}picking{/g}."
      },
      {
        "kind": "heading",
        "text": "1.1 Stratégies et notions",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/601/commun/log-601-notions-1-v001.svg",
        "alt": "Demande. Lire référence et unité. Prélèvement. Vérifier la position. Contrôle. Comparer au dossier.",
        "caption": "La trace relie les unités au dossier de la commande."
      },
      {
        "kind": "heading",
        "text": "1.1.1 Types",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "Type",
          "Principe"
        ],
        "rows": [
          [
            "{g}Statique{/g}",
            "L'{g}homme va à la marchandise{/g} · stock immobile · préparateur à pied / engin"
          ],
          [
            "{g}Dynamique{/g}",
            "La {g}marchandise vient à l'homme{/g} · système amène vers la zone picking · reste restocké"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "👉 Entrepôts auto souvent dynamiques · investissement ↑ · personnel ↓."
      },
      {
        "kind": "heading",
        "text": "1.1.2 Modes de déplacement",
        "sub": true
      },
      {
        "kind": "list",
        "items": [
          "{g}Unidimensionnel{/g} : horizontal seulement · sol / 1er niveau · petite levée / chariots · déplacement rapide · 1 emplacement sol / article · réappro nécessaire",
          "{g}Bidimensionnel{/g} : horizontal {g}+{/g} vertical · grande levée / transstockeurs · temps d'accès ↑ · pas de manutention réserve→picking"
        ]
      },
      {
        "kind": "heading",
        "text": "1.1.3 Prélèvement",
        "sub": true
      },
      {
        "kind": "list",
        "items": [
          "{g}Manuel{/g} : préparateur → bac (même en auto souvent)",
          "{g}Automatique{/g} : trieurs / robots → bac · {g}très rare{/g}"
        ]
      },
      {
        "kind": "heading",
        "text": "1.1.4 Transfert (dans l'entrepôt)",
        "sub": true
      },
      {
        "kind": "list",
        "items": [
          "{g}Centralisé{/g} : vers zone d'expédition pour emballage",
          "{g}Décentralisé{/g} : dépôt près du picking (fin d'allée / convoyeur) puis regroupement central · distances ↓ · productivité ↑ · fréquent avec transstockeurs / hauts rayonnages"
        ]
      },
      {
        "kind": "heading",
        "text": "1.1.5 Informations",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "Mode",
          "Caractéristique"
        ],
        "rows": [
          [
            "{g}Batch{/g}",
            "Lots de commandes · papier fréquent · données pas toujours actuelles · inventaire = interruption"
          ],
          [
            "{g}Real-time{/g}",
            "Données → MDE en direct · modifs jusqu'à mise à dispo · stocks actualisés · réappro auto"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "👉 Temps réel : délais ↓ · disponibilité ↑ · inventaire à tout moment."
      },
      {
        "kind": "heading",
        "text": "1.1.6 Secteurs",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Un seul{/g} secteur · ou {g}plusieurs{/g} zones (collecte multi-zones)."
      },
      {
        "kind": "heading",
        "text": "1.1.7 Une ou plusieurs commandes",
        "sub": true
      },
      {
        "kind": "list",
        "items": [
          "{g}Orienté commande{/g} (1 commande) : tout pour le même client → emballage direct",
          "{g}Orienté article{/g} (plusieurs) : 1re étape prélèvement multi-commandes · 2e répartition · distances ↓ si longs trajets"
        ]
      },
      {
        "kind": "heading",
        "text": "1.1.8 Série ou parallèle",
        "sub": true
      },
      {
        "kind": "list",
        "items": [
          "{g}Série{/g} (1 étape) : zones les unes après les autres · grosses commandes = temps ↑",
          "{g}Parallèle{/g} (2 étapes) : parties traitées {g}simultanément{/g} par plusieurs préparateurs → regroupement · temps ↓ pour commandes volumineuses"
        ]
      },
      {
        "kind": "heading",
        "text": "1.1.9 Par allée",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Accès allées d'un seul côté · articles {g}A{/g} (fréquence ↑) près de l'allée principale · analyse {g}ABC{/g} (module {g}408{/g})."
      },
      {
        "kind": "heading",
        "text": "Exemple EnterSite AG",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Statique · déplacement {g}2D{/g} (grande levée) · prélèvement {g}manuel{/g} · transfert {g}centralisé{/g} · 3 zones (toners, IT, cave « C ») · en principe {g}1 étape{/g} orientée commande · cave en {g}2 étapes{/g} orientée article · {g}série{/g} · scanners MDE / WLAN = {g}temps réel{/g}."
      },
      {
        "kind": "heading",
        "text": "1.2 Techniques spéciales (sans papier)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Assistées ordi · objectif : données rapides · réaction ↓ · erreurs ↓ · base = {g}MDE{/g}."
      },
      {
        "kind": "table",
        "headers": [
          "Technique",
          "Principe"
        ],
        "rows": [
          [
            "{g}Pick-by-Scan{/g}",
            "MDE affiche la commande · le plus répandu · souvent pas 2 mains libres"
          ],
          [
            "{g}Pick-by-Voice{/g}",
            "Casque + micro · mains libres · vitesse / qualité ↑"
          ],
          [
            "{g}Pick-by-Light{/g}",
            "LED indiquent emplacement + quantité · confirmation touche · {g}1 commande / zone{/g}"
          ],
          [
            "{g}Pick-by-Vision{/g}",
            "Lunettes AR · infos superposées (lieu, qté, n°) · 2 mains libres · SGS · temps réel"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "👉 Aident au quotidien · investissement ↑ vs classiques."
      },
      {
        "kind": "heading",
        "text": "1.3 Pick-and-Pack",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/601/commun/log-601-notions-2-v001.svg",
        "alt": "Préparer. Articles du dossier. Emballer. Protection adaptée. Remettre. Commande identifiée.",
        "caption": "Le dossier reste identifiable lors du passage entre opérations."
      },
      {
        "kind": "paragraph",
        "text": "Prélèvement {g}et{/g} conditionnement en {g}une{/g} opération · article → emballage prêt à expédier · pas de poste emballage dédié. Contrôle ID/qté : préparateur, contrôleur ou auto."
      },
      {
        "kind": "paragraph",
        "text": "Possible si : produits déjà préemballés · emballages {g}normalisés{/g} · pas d'emballage complexe."
      }
    ],
    "module": "601",
    "revision": "601-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-601-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Bon de préparation{/g} — Liste des lignes à prélever pour un dossier."
      },
      {
        "kind": "paragraph",
        "text": "{g}Commande{/g} — Ensemble des articles et conditions demandés."
      },
      {
        "kind": "paragraph",
        "text": "{g}Consolidation{/g} — Regroupement de prélèvements pour un même départ."
      },
      {
        "kind": "paragraph",
        "text": "{g}Contrôle de préparation{/g} — Vérification de l’identité, de l’état et des quantités prélevées."
      },
      {
        "kind": "paragraph",
        "text": "{g}Emplacement{/g} — Position repérée dans le dépôt."
      },
      {
        "kind": "paragraph",
        "text": "{g}Ligne de commande{/g} — Référence et quantité demandées dans un dossier."
      },
      {
        "kind": "paragraph",
        "text": "{g}Lot{/g} — Identifiant qui relie les unités et leurs mouvements."
      },
      {
        "kind": "paragraph",
        "text": "{g}Picking{/g} — Prélèvement d’articles pour une commande."
      },
      {
        "kind": "paragraph",
        "text": "{g}Pick-and-pack{/g} — Organisation reliant la préparation et l’emballage dans le même flux."
      },
      {
        "kind": "paragraph",
        "text": "{g}Préparation par zone{/g} — Répartition des prélèvements entre les zones."
      },
      {
        "kind": "paragraph",
        "text": "{g}Scan{/g} — Lecture d’un code pour vérifier ou enregistrer une donnée."
      },
      {
        "kind": "paragraph",
        "text": "{g}Substitution{/g} — Remplacement autorisé d’un article selon les conditions du dossier."
      }
    ],
    "module": "601",
    "revision": "601-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-601-maths-fiche-1",
    "kind": "maths",
    "prompt": "La commande A demande 7, 12 et 8 unités sur ses trois lignes. Calculez le total.",
    "answer": "27 unités.",
    "calculation": "7 + 12 + 8 = 27.",
    "module": "601",
    "revision": "601-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-601-maths-fiche-2",
    "kind": "maths",
    "prompt": "Il faut 52 pièces et les cartons en contiennent 10. Préparez le nombre de cartons complets et le reste.",
    "answer": "Cinq cartons et deux pièces.",
    "calculation": "52 = 5 × 10 + 2.",
    "module": "601",
    "revision": "601-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-601-maths-fiche-3",
    "kind": "maths",
    "prompt": "Onze commandes passent à l’emballage, puis sept de plus. Calculez le nombre reçu.",
    "answer": "18 commandes.",
    "calculation": "11 + 7 = 18.",
    "module": "601",
    "revision": "601-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-601-maths-fiche-4",
    "kind": "maths",
    "prompt": "Chaque ligne prend 30 secondes. Donnez la durée pour 16 lignes sans interruption.",
    "answer": "Huit minutes.",
    "calculation": "16 × 30 = 480 s = 8 min.",
    "module": "601",
    "revision": "601-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-601-maths-fiche-5",
    "kind": "maths",
    "prompt": "Sur 125 lignes vérifiées, cinq exigent une reprise. Calculez le taux.",
    "answer": "4 %.",
    "calculation": "5 ÷ 125 × 100 = 4 %.",
    "module": "601",
    "revision": "601-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-601-verification-fiche-1",
    "kind": "verification",
    "prompt": "Quelles données comparez-vous au prélèvement ?",
    "answer": "Référence, emplacement, quantité, unité et lot si requis.",
    "module": "601",
    "revision": "601-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-601-verification-fiche-2",
    "kind": "verification",
    "prompt": "À quoi sert la consolidation ?",
    "answer": "Elle rassemble les unités d’un même dossier prélevées séparément.",
    "module": "601",
    "revision": "601-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-601-verification-fiche-3",
    "kind": "verification",
    "prompt": "Que distingue la ligne de commande d’un article ?",
    "answer": "Une ligne indique une référence avec la quantité et les conditions d’un dossier.",
    "module": "601",
    "revision": "601-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-601-verification-fiche-4",
    "kind": "verification",
    "prompt": "Que faites-vous si le code ne correspond pas ?",
    "answer": "Suspendre le prélèvement et vérifier le dossier et l’identification.",
    "module": "601",
    "revision": "601-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-601-verification-fiche-5",
    "kind": "verification",
    "prompt": "Quel est le principe du pick-and-pack ?",
    "answer": "Relier le prélèvement et le conditionnement de la commande dans le même flux.",
    "module": "601",
    "revision": "601-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-601-situation-fiche-1",
    "kind": "situation",
    "prompt": "La quantité disponible est de 6 pièces pour 10 demandées. Comment traitez-vous la ligne ?",
    "answer": "Enregistrer le manque et transmettre le dossier avant toute substitution ou clôture.",
    "module": "601",
    "revision": "601-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-601-situation-fiche-2",
    "kind": "situation",
    "prompt": "Deux commandes se trouvent dans le même chariot. Comment vérifiez-vous le regroupement ?",
    "answer": "Identifier séparément les dossiers, puis contrôler chaque article à la consolidation.",
    "module": "601",
    "revision": "601-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-601-situation-fiche-3",
    "kind": "situation",
    "prompt": "Une unité est enregistrée en cartons, mais la demande est en pièces. Quelle vérification faites-vous ?",
    "answer": "Vérifier la conversion officielle de l’article avant de saisir le prélèvement.",
    "module": "601",
    "revision": "601-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
