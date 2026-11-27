import type { LogistiqueUnit } from '../approved-banks'

export const module601 = [
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
        "src": "/assets/logistique/100/103/commun/log-103-preparation-photo-v002.webp",
        "alt": "La préparatrice compare l’article et les données de la commande.",
        "caption": "Le prélèvement suit la référence, la quantité et l’emplacement attendus."
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
        "kind": "image",
        "src": "/assets/logistique/600/601/commun/log-601-lumiere-photo-v003.webp",
        "alt": "Un indicateur lumineux est monté près du bac de prélèvement.",
        "caption": "Le signal lumineux désigne le bac de prélèvement. La confirmation enregistre que le prélèvement a été effectué."
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
        "src": "/assets/logistique/600/601/commun/log-601-pick-photo-v002.webp",
        "alt": "Une personne place un article pris en rayonnage directement dans un carton.",
        "caption": "En Pick-and-Pack, les articles vont dans le colis de départ. Contrôlez toute la commande avant de fermer."
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
    "summaryBlocks": [
      {
        "kind": "heading",
        "text": "1. La préparation de commandes",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "1.1 Stratégies et notions",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/100/103/commun/log-103-preparation-photo-v002.webp",
        "alt": "La préparatrice compare l’article et les données de la commande.",
        "caption": "Le prélèvement suit la référence, la quantité et l’emplacement attendus."
      },
      {
        "kind": "paragraph",
        "text": "Le {g}picking{/g} consiste à prélever des articles pour une commande. Une préparation {g}statique{/g} amène la personne vers l’article. Une solution {g}dynamique{/g} amène l’article au poste. On peut préparer commande par commande, réunir des lignes de plusieurs commandes ou répartir les prélèvements par zone. Dans ce cas, vérifiez la {g}consolidation{/g} pour rendre chaque commande complète."
      },
      {
        "kind": "heading",
        "text": "1.2 Techniques spéciales (sans papier)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/601/commun/log-601-lumiere-photo-v003.webp",
        "alt": "Un indicateur lumineux est monté près du bac de prélèvement.",
        "caption": "Le signal lumineux désigne le bac de prélèvement. La confirmation enregistre que le prélèvement a été effectué."
      },
      {
        "kind": "paragraph",
        "text": "Un terminal peut indiquer l’emplacement et confirmer le scan. Le {g}pick-by-light{/g} guide avec des lumières. Le {g}pick-by-voice{/g} donne des indications par la voix et demande une confirmation. Ces aides réduisent certaines recherches, tout en exigeant des données à jour et un contrôle."
      },
      {
        "kind": "heading",
        "text": "1.3 Pick-and-Pack",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/601/commun/log-601-pick-photo-v002.webp",
        "alt": "Une personne place un article pris en rayonnage directement dans un carton.",
        "caption": "En Pick-and-Pack, les articles vont dans le colis de départ. Contrôlez toute la commande avant de fermer."
      },
      {
        "kind": "paragraph",
        "text": "En {g}Pick-and-Pack{/g}, les articles sont placés directement dans le colis d’expédition. Vérifiez référence, quantité et conditionnement. Avant de fermer, confirmez que le colis respecte le bon de commande, la protection nécessaire et l’étiquette."
      }
    ],
    "module": "601",
    "revision": "601-v003",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
