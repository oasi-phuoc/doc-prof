import type { LogistiqueUnit } from '../approved-banks'

export const module701 = [
  {
    "id": "log-701-objectifs-apercu",
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
          "Expliquer la raison du contrôle des stocks et de la conservation des justificatifs",
          "Distinguer inventaire {g}fixe{/g}, {g}tournant{/g} et par {g}sondage{/g}",
          "Décrire la {g}préparation{/g} et le déroulement (mesurer, peser, compter)",
          "Analyser les {g}différences{/g} d'inventaire et leurs causes"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 701",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Préparer un comptage et repérer les mouvements qui risquent de fausser le résultat.",
          "Choisir une méthode de comptage et déterminer les quantités en pièces, en mètres ou au poids.",
          "Comparer le stock physique au stock enregistré et documenter les écarts avant correction."
        ]
      }
    ],
    "module": "701",
    "revision": "701-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-701-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "1. L'inventaire",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "1.1 Obligation d'inventaire",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Les entreprises soumises à l'établissement de comptes justifient la valeur des stocks figurant au bilan. Un inventaire physique permet de contrôler les quantités du système."
      },
      {
        "kind": "paragraph",
        "text": "📜 {g}CO art. 958c al. 2{/g} : chaque poste du bilan / annexe est justifié par un inventaire (ou autre)."
      },
      {
        "kind": "paragraph",
        "text": "👉 Inventaire ≥ {g}1×/an{/g} · conservation {g}10 ans{/g}."
      },
      {
        "kind": "heading",
        "text": "1.2 Types d'inventaire",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/700/701/commun/log-701-notions-1-v001.svg",
        "alt": "À date fixe. Tous les articles du périmètre. Tournant. Lots répartis sur l'année. Par sondage. Échantillon représentatif.",
        "caption": "La méthode détermine les articles et le calendrier à couvrir."
      },
      {
        "kind": "heading",
        "text": "1.2.1 À date fixe (jour de clôture)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Comptage un jour précis · listes par secteur · équipes (voire tout le personnel) · papier ou {g}MDE{/g}. Idéalement {g}aucune{/g} entrée/sortie ce jour-là. Très précis."
      },
      {
        "kind": "heading",
        "text": "1.2.2 Permanent (tournant)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Tout au long de l'année · système indique aléatoirement quoi compter · {g}chaque{/g} article ≥ 1×/an. Idéal avec inventaire {g}temps réel{/g} (MDE) pour continuer les mouvements."
      },
      {
        "kind": "heading",
        "text": "1.2.3 Par sondage à jour fixe",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Accord autorités fiscales · échantillon représentatif extrapolé · souvent pour articles {g}bon marché{/g} · articles de valeur = inventaire complet."
      },
      {
        "kind": "heading",
        "text": "1.3 Déroulement",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Directive / plan d'inventaire {g}contraignant{/g} (adapté à l'entreprise)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Sources d'erreur :{/g} manque de personnel · unités peu claires · pannes / erreurs MDE."
      },
      {
        "kind": "paragraph",
        "text": "{g}Préparation :{/g} instruction · concertation · délimiter les EM non planifiées · enlever emballages / palettes vides · étiquetage racks · pré-trier unités de comptage."
      },
      {
        "kind": "paragraph",
        "text": "{g}Pendant :{/g} {g}mesurer{/g} (mètres) · {g}peser{/g} (poids) · {g}compter{/g} (unités)."
      },
      {
        "kind": "heading",
        "text": "1.4 Évaluation",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/700/701/commun/log-701-notions-2-v001.svg",
        "alt": "Comparer. Théorique 96 et physique 89. Contrôler. Recomptage et mouvements. Tracer. Écart de −7 à justifier.",
        "caption": "Exemple de comparaison à date et unité identiques."
      },
      {
        "kind": "paragraph",
        "text": "Théorique ↔ réelle. Écarts > seuil → {g}recompter{/g}. Si confirmé → {g}différence d'inventaire{/g} (souvent perte) · charge au compte de résultat."
      },
      {
        "kind": "paragraph",
        "text": "👉 Clarifier les écarts = pistes d'amélioration des process."
      },
      {
        "kind": "heading",
        "text": "1.5 Causes des différences",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Stock physique (réel) :{/g} erreurs réception/stockage · livraisons non détectées · pertes substance (retrait, décomposition, évaporation) · DLC · erreurs picking · casse · {g}vol{/g}."
      },
      {
        "kind": "paragraph",
        "text": "{g}Stock comptable (théorique) :{/g} saisies incorrectes · mouvements non enregistrés · doublons · mauvais article."
      }
    ],
    "module": "701",
    "revision": "701-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-701-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Inventaire{/g} — Relevé daté des biens présents, de leurs quantités et, selon le besoin, de leur valeur."
      },
      {
        "kind": "paragraph",
        "text": "{g}Stock physique{/g} — Quantité réellement constatée à un emplacement."
      },
      {
        "kind": "paragraph",
        "text": "{g}Stock théorique{/g} — Quantité attendue d'après les mouvements enregistrés dans le système."
      },
      {
        "kind": "paragraph",
        "text": "{g}Date de clôture{/g} — Date à laquelle les comptes d'une période sont arrêtés."
      },
      {
        "kind": "paragraph",
        "text": "{g}Inventaire tournant{/g} — Comptage échelonné par zone ou article selon un plan."
      },
      {
        "kind": "paragraph",
        "text": "{g}Inventaire par sondage{/g} — Estimation fondée sur un échantillon selon une méthode justifiée."
      },
      {
        "kind": "paragraph",
        "text": "{g}Écart d'inventaire{/g} — Différence entre le stock physique et le stock théorique."
      },
      {
        "kind": "paragraph",
        "text": "{g}Recomptage{/g} — Nouvelle mesure destinée à confirmer ou écarter une première différence."
      },
      {
        "kind": "paragraph",
        "text": "{g}Tare{/g} — Masse de l'emballage ou du récipient à déduire de la masse brute."
      },
      {
        "kind": "paragraph",
        "text": "{g}Unité de comptage{/g} — Unité retenue pour le relevé, par exemple la pièce ou le mètre."
      },
      {
        "kind": "paragraph",
        "text": "{g}Terminal mobile{/g} — Appareil portable servant à saisir les relevés sur le lieu de comptage."
      },
      {
        "kind": "paragraph",
        "text": "{g}Justificatif{/g} — Pièce conservée pour expliquer un relevé, un mouvement ou une correction."
      }
    ],
    "module": "701",
    "revision": "701-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-701-maths-fiche-1",
    "kind": "maths",
    "prompt": "Comptez 5 cartons fermés de 24 joints et 7 joints en vrac. Combien de joints relevez-vous ?",
    "answer": "127 joints",
    "calculation": "5 × 24 + 7 = 127.",
    "module": "701",
    "revision": "701-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-701-maths-fiche-2",
    "kind": "maths",
    "prompt": "Une caisse pleine pèse 13,2 kg. La caisse vide pèse 1,2 kg et chaque pièce 0,15 kg. Combien de pièces contient-elle ?",
    "answer": "80 pièces",
    "calculation": "(13,2 − 1,2) ÷ 0,15 = 80.",
    "module": "701",
    "revision": "701-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-701-maths-fiche-3",
    "kind": "maths",
    "prompt": "Le registre indique 96 pièces et le relevé 89. Calculez l'écart physique moins théorique.",
    "answer": "−7 pièces",
    "calculation": "89 − 96 = −7.",
    "module": "701",
    "revision": "701-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-701-maths-fiche-4",
    "kind": "maths",
    "prompt": "Il reste trois morceaux de câble de 7,2 m, 6,6 m et 3,1 m. Calculez le total.",
    "answer": "16,9 m",
    "calculation": "7,2 + 6,6 + 3,1 = 16,9.",
    "module": "701",
    "revision": "701-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-701-maths-fiche-5",
    "kind": "maths",
    "prompt": "Un écart confirmé est de −8 pièces à CHF 17,50 l'unité. Quelle est sa valeur ?",
    "answer": "−CHF 140",
    "calculation": "−8 × 17,50 = −140.",
    "module": "701",
    "revision": "701-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-701-maths-fiche-6",
    "kind": "maths",
    "prompt": "Un prélèvement de 9 pièces a été effectué avant comptage, mais pas saisi. Le relevé est 68 et l'ancien solde 80. Quel écart reste après enregistrement du prélèvement ?",
    "answer": "−3 pièces",
    "calculation": "80 − 9 = 71. Puis 68 − 71 = −3.",
    "module": "701",
    "revision": "701-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-701-verification-fiche-1",
    "kind": "verification",
    "prompt": "Quelles quantités comparez-vous pour déterminer un écart ?",
    "answer": "Le stock physique relevé et le stock théorique au même instant, dans la même unité.",
    "module": "701",
    "revision": "701-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-701-verification-fiche-2",
    "kind": "verification",
    "prompt": "Quel avantage offre l'inventaire tournant ?",
    "answer": "Il répartit la charge de comptage et permet de traiter les zones successivement.",
    "module": "701",
    "revision": "701-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-701-verification-fiche-3",
    "kind": "verification",
    "prompt": "Pourquoi séparer les palettes reçues pendant le comptage ?",
    "answer": "Pour savoir si elles entrent dans le périmètre et éviter les doublons.",
    "module": "701",
    "revision": "701-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-701-verification-fiche-4",
    "kind": "verification",
    "prompt": "Quelle unité utiliser pour un rouleau entamé vendu au mètre ?",
    "answer": "Le mètre, en mesurant la longueur effectivement disponible.",
    "module": "701",
    "revision": "701-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-701-verification-fiche-5",
    "kind": "verification",
    "prompt": "Que faire si le premier relevé dépasse le seuil d'écart ?",
    "answer": "Recompter selon la consigne, puis examiner les mouvements et consigner la décision.",
    "module": "701",
    "revision": "701-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-701-verification-fiche-6",
    "kind": "verification",
    "prompt": "Pourquoi une extrapolation sur des articles de valeurs très différentes peut-elle être trompeuse ?",
    "answer": "L'échantillon peut mal représenter les articles chers et fausser la valeur estimée.",
    "module": "701",
    "revision": "701-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-701-situation-fiche-1",
    "kind": "situation",
    "prompt": "Une boîte étiquetée « 20 » est ouverte. Une boîte fermée du même produit est intacte. Expliquez comment les relever.",
    "answer": "Vérifier l'unité de référence, compter le contenu de la boîte ouverte et relever le conditionnement de la boîte intacte selon la règle du site.",
    "module": "701",
    "revision": "701-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-701-situation-fiche-2",
    "kind": "situation",
    "prompt": "Le système affiche 64 unités, le relevé 56. Une sortie de 8 apparaît au quai. Décrivez vos vérifications avant correction.",
    "answer": "Confirmer par recomptage, vérifier article, heure et statut de la sortie, puis faire enregistrer le mouvement exact et conserver le justificatif.",
    "module": "701",
    "revision": "701-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-701-situation-fiche-3",
    "kind": "situation",
    "prompt": "Le responsable vous confie un secteur où deux références semblables sont rangées côte à côte. Comment éviter une permutation ?",
    "answer": "Lire les références et emplacements, séparer les relevés, identifier les unités ouvertes et faire contrôler les écarts par une deuxième personne.",
    "module": "701",
    "revision": "701-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
