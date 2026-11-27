import type { LogistiqueUnit } from '../approved-banks'

export const module611 = [
  {
    "id": "log-611-objectifs-apercu",
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
          "Analyser les {g}erreurs{/g} de picking (causes, conséquences, prévention)",
          "Décrire les trois {g}sous-systèmes{/g} (info, matériel, organisation) et options (série/parallèle, MOP…)",
          "Différencier les principaux {g}trieurs{/g} et les {g}5 temps{/g} partiels",
          "Calculer des {g}ratios{/g} de performance et relier conception d'entrepôt aux besoins"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 611",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Comparer les stratégies de prélèvement et la consolidation.",
          "Décomposer les temps de préparation avec un périmètre explicite.",
          "Mesurer qualité et rendement pour cibler une amélioration."
        ]
      }
    ],
    "module": "611",
    "revision": "611-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-611-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "11. La préparation de commandes (approfondissement)",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "11.1 Principes",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Regrouper des marchandises selon des {g}ordres{/g} (internes / clients). Souvent sous-estimée · erreurs ou retards → impact direct production / clients."
      },
      {
        "kind": "heading",
        "text": "11.2 Termes",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Préparateur{/g} · {g}commissionnement{/g} (= préparation) · {g}liste de prélèvement{/g} (n° article, désignation, emplacement, qté… · papier ou système)."
      },
      {
        "kind": "heading",
        "text": "11.2.1–11.2.4 Erreurs",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Fréquentes : mauvaise {g}quantité{/g} · mauvaise {g}marchandise{/g} · mauvaise {g}unité{/g} (pièce vs carton)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Causes personnelles :{/g} motivation · concentration · responsabilité · valeurs · connaissances. {g}Causes organisationnelles :{/g} ordres confus · stock mal étiqueté · formation · pannes MDE."
      },
      {
        "kind": "paragraph",
        "text": "{g}Conséquences :{/g} retours, express, coûts ↑ · perte d'{g}image{/g} / clients."
      },
      {
        "kind": "paragraph",
        "text": "{g}Prévention :{/g} ambiance · formation · contrôles (double, poids…) · procédures {g}sans document{/g}."
      },
      {
        "kind": "heading",
        "text": "11.3 Système de préparation",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Trois sous-systèmes en interaction (ex. commande Karl König / toners EnterSite) :"
      },
      {
        "kind": "table",
        "headers": [
          "Sous-système",
          "Rôle"
        ],
        "rows": [
          [
            "{g}Informations{/g}",
            "Saisie → préparation → transmission → quittance"
          ],
          [
            "{g}Flux matériel{/g}",
            "Mise à dispo · déplacement · prélèvement · transfert (+ contrôle)"
          ],
          [
            "{g}Organisation{/g}",
            "Zones · 1/multi commandes · série/parallèle · parcours"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "11.3.1 Flux d'informations",
        "sub": true
      },
      {
        "kind": "list",
        "items": [
          "1. {g}Saisie{/g} — web, écrit, téléphone · réservation stock",
          "2. {g}Préparation{/g} — batch ou {g}real-time{/g} (+ infos emballage, dangers…) → module {g}601{/g}",
          "3. {g}Transmission{/g}",
          "{g}Hors ligne{/g} : listes · flexible · plus d'erreurs / travail",
          "{g}En ligne{/g} : rendement ↑ · erreurs ↓ · contrôles auto · coût / panne IT",
          "Pick-by-Scan / Voice / Light / Vision ({g}601{/g}) · {g}Pick-by-RFID{/g} (sans contact, radio)",
          "4. {g}Quittance{/g} — humaine (coche, scan, voix) ou {g}automatique{/g} · déclenche souvent la compta sans document"
        ]
      },
      {
        "kind": "heading",
        "text": "11.3.2 Flux de matériel",
        "sub": true
      },
      {
        "kind": "list",
        "items": [
          "1. {g}Préparation{/g} — {g}statique{/g} (homme→marchandise · investissement ↓ · trajets ↑) vs {g}dynamique{/g} (marchandise→homme · rendement ↑ · investissement ↑ · moins flexible express)",
          "2. {g}Déplacement{/g} — {g}1D{/g} horizontal / {g}multi{/g} (hauteur, meilleure occupation)",
          "3. {g}Prélèvement{/g} — manuel (± engins) · auto (trieurs/robots · volumes homogènes)",
          "4. {g}Transfert{/g} — centralisé vs décentralisé · {g}Pick-and-Pack{/g} si préemballé / normalisé / simple",
          "5. {g}Contrôle{/g} — quand (après prélèvement / avant-après emballage) · qui · total vs échantillon · scan / RFID / poids"
        ]
      },
      {
        "kind": "heading",
        "text": "11.3.3 Organisation",
        "sub": true
      },
      {
        "kind": "list",
        "items": [
          "{g}1 secteur{/g} ou {g}plusieurs{/g} zones (puis regroupement)",
          "{g}1 étape / commande{/g} vs {g}multi-étapes / multi-commandes{/g} (ordre collectif → répartition)",
          "Transmission {g}par ordre{/g} (1 étape · responsabilités claires · pas d'opti trajets) vs {g}par article{/g} (2 étapes · longs trajets / articles communs)",
          "{g}Série{/g} (l'un après l'autre · lentes si grosses commandes) vs {g}parallèle{/g} (simultané · temps ↓)"
        ]
      },
      {
        "kind": "heading",
        "text": "11.3.4 Parcours",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Par allée{/g} (A en tête) · {g}série{/g} (toutes allées) · {g}MOP{/g} (*Multi Order Picking* : plusieurs petites commandes / tour · 1 conteneur / commande)."
      },
      {
        "kind": "heading",
        "text": "11.4 Trieurs",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Répartissent vers destinations via code lu au début."
      },
      {
        "kind": "table",
        "headers": [
          "Type",
          "Principe",
          "Adapté à"
        ],
        "rows": [
          [
            "{g}Plateau inclinable{/g} (*Tilt Tray*)",
            "Bac bascule → goulotte",
            "Large spectre (ex. bagages)"
          ],
          [
            "{g}Sabots{/g} (*Sliding*)",
            "Patins poussent sur plaques",
            "Fonds lisses (cartons, blisters…)"
          ],
          [
            "{g}Roulettes pivotantes{/g} (*pop-up*)",
            "Rouleaux relevés / inclinés",
            "Sols rigides lisses · ≠ sachets"
          ],
          [
            "{g}Bandes transversales{/g}",
            "Bandes perpendiculaires",
            "Plus soigneux que bascule"
          ],
          [
            "{g}Trappes / Split-Tray{/g}",
            "Fond s'ouvre vers le bas",
            "Légers, souples (textiles, lettres)"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "11.5 Optimiser (5 temps partiels)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/611/commun/log-611-notions-1-v001.svg",
        "alt": "Déplacement. Trajet entre positions. Prélèvement. Recherche et prise. Traitement. Saisie et contrôles.",
        "caption": "Mesurer les étapes sur le même périmètre avant d’interpréter un gain."
      },
      {
        "kind": "table",
        "headers": [
          "Temps",
          "Contenu",
          "Leviers (ex.)"
        ],
        "rows": [
          [
            "{g}Organisation{/g}",
            "Avant/après (docs, moyens, transfert)",
            "Docs clairs · auxiliaires proches · Pick-and-Pack · sortie décentralisée"
          ],
          [
            "{g}Déplacement{/g}",
            "Entre 2 prélèvements",
            "Connaissance entrepôt · ordre système · ABC · regroupement · dynamique · engins"
          ],
          [
            "{g}Prélèvement{/g}",
            "Saisir / déposer",
            "Profondeur ↓ · hauteur idéale · ergonomie · unités saisissables"
          ],
          [
            "{g}Mort{/g} (secondaire)",
            "Lire, compter, contrôler, réappro…",
            "Lisibilité · balance · unités entières · Voice"
          ],
          [
            "{g}Perdu{/g}",
            "Personnel (pauses, bavardage) / matériel (attentes)",
            "Ambiance · orga · motivation · flex pauses · primes"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "Somme des temps partiels = {g}100 %{/g} du temps picking."
      },
      {
        "kind": "heading",
        "text": "11.6 Critères & ratios",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/611/commun/log-611-notions-2-v001.svg",
        "alt": "Cadence. Lignes par durée. Qualité. Erreurs par volume.",
        "caption": "Un gain de vitesse ne suffit pas sans contrôle des erreurs."
      },
      {
        "kind": "paragraph",
        "text": "Facteurs {g}statiques{/g} (structure, ABC, stock…) et {g}dynamiques{/g} (flux/jour, commandes, poids…). Structure commande / articles → indicateurs (positions/commande, rotation, dimensions…)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Formules utiles :{/g} - Capacité (pos./h) = {g}3600 / temps prélèvement (s/pos.){/g} Ex. 85 s → {g}42,35{/g} pos./h - Coût / pos. = coûts d'exploitation/h ÷ capacité/h → ex. 85 / 42,35 ≈ {g}2 CHF{/g} - Coût / commande = total coûts picking ÷ nb commandes - Positions moy. / commande = total positions ÷ nb commandes - Taux d'erreur (%) = erreurs ÷ prélèvements × 100"
      },
      {
        "kind": "paragraph",
        "text": "{g}Ex. effectif :{/g} 1400 pos./j · 14 s prélèvement = 15 % du temps total → temps total/pos. ≈ 93,3 s → {g}36,3 h{/g}/j → ≈ {g}5{/g} préparateurs (8 h). {g}Ex. capacité :{/g} 15 s = 15 % → 100 s/pos. · 8 h = 28 800 s → {g}288{/g} pos./jour."
      },
      {
        "kind": "heading",
        "text": "11.7 Conception d'entrepôts (exemples types)",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "Config",
          "Idée clé",
          "+ / − typiques"
        ],
        "rows": [
          [
            "1",
            "Picking bas + réserve au-dessus · dynamique petits · 1D",
            "Flexible · personnel / surface / ergo −"
          ],
          [
            "2",
            "2 palettes / préparateur · réappro {g}auto{/g} transstockeur",
            "Personnel ↓ · pas d'attente · investissement ↑"
          ],
          [
            "3",
            "Dynamique · grands assortiments petits · FIFO · zones",
            "Trajets courts · réappro manuel · investissement"
          ],
          [
            "4",
            "{g}2D{/g} grande levée · palettes ou pièces · pas de réappro",
            "Volume ↑ · sols / haut peu adaptés au picking"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "👉 Adapter volume, nb d'articles, rotation, etc."
      }
    ],
    "module": "611",
    "revision": "611-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-611-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Batch picking{/g} — Prélèvement groupé de lignes de plusieurs commandes selon une organisation définie."
      },
      {
        "kind": "paragraph",
        "text": "{g}Cadence de préparation{/g} — Quantité traitée par unité de temps."
      },
      {
        "kind": "paragraph",
        "text": "{g}Consolidation{/g} — Regroupement des lignes et unités d’un même dossier."
      },
      {
        "kind": "paragraph",
        "text": "{g}Erreur de préparation{/g} — Écart entre l’attendu et la réalisation selon le contrôle."
      },
      {
        "kind": "paragraph",
        "text": "{g}Implantation{/g} — Organisation des positions et parcours dans un entrepôt."
      },
      {
        "kind": "paragraph",
        "text": "{g}Ligne de prélèvement{/g} — Référence avec la quantité à prélever pour le dossier."
      },
      {
        "kind": "paragraph",
        "text": "{g}Prélèvement par zone{/g} — Préparation répartie entre secteurs."
      },
      {
        "kind": "paragraph",
        "text": "{g}Temps de déplacement{/g} — Temps consacré au trajet dans le périmètre mesuré."
      },
      {
        "kind": "paragraph",
        "text": "{g}Temps de recherche{/g} — Durée consacrée à retrouver l’article ou la position."
      },
      {
        "kind": "paragraph",
        "text": "{g}Temps de saisie{/g} — Durée consacrée à lire ou enregistrer les données."
      },
      {
        "kind": "paragraph",
        "text": "{g}Taux d’erreur{/g} — Part des opérations présentant un écart selon la définition retenue."
      },
      {
        "kind": "paragraph",
        "text": "{g}Trieur{/g} — Installation qui oriente les unités vers le traitement ou la destination."
      }
    ],
    "module": "611",
    "revision": "611-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-611-maths-fiche-1",
    "kind": "maths",
    "prompt": "Une tournée couvre 84 lignes en 42 minutes. Calculez la cadence en lignes par minute.",
    "answer": "Deux lignes par minute.",
    "calculation": "84 ÷ 42 = 2.",
    "module": "611",
    "revision": "611-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-611-maths-fiche-2",
    "kind": "maths",
    "prompt": "Une préparation dure 36 min dont 14 de déplacement et 8 de recherche. Combien restent pour les autres étapes ?",
    "answer": "14 minutes.",
    "calculation": "36 − 14 − 8 = 14 min.",
    "module": "611",
    "revision": "611-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-611-maths-fiche-3",
    "kind": "maths",
    "prompt": "Six reprises sont relevées sur 300 lignes. Calculez le taux.",
    "answer": "2 %.",
    "calculation": "6 ÷ 300 × 100 = 2 %.",
    "module": "611",
    "revision": "611-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-611-maths-fiche-4",
    "kind": "maths",
    "prompt": "Un rangement ramène un trajet de 160 à 112 m. Quel est le gain de distance ?",
    "answer": "48 m.",
    "calculation": "160 − 112 = 48 m.",
    "module": "611",
    "revision": "611-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-611-maths-fiche-5",
    "kind": "maths",
    "prompt": "Le temps moyen passe de 48 à 39 min pour un travail comparable. Calculez la diminution relative au dixième.",
    "answer": "18,8 %.",
    "calculation": "(48 − 39) ÷ 48 × 100 = 18,75 %, soit 18,8 %.",
    "module": "611",
    "revision": "611-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-611-verification-fiche-1",
    "kind": "verification",
    "prompt": "À quoi sert le prélèvement par zone ?",
    "answer": "À répartir les opérations entre secteurs pour leur organisation et leur capacité.",
    "module": "611",
    "revision": "611-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-611-verification-fiche-2",
    "kind": "verification",
    "prompt": "Que faut-il distinguer dans un relevé de temps ?",
    "answer": "Déplacement, recherche, prélèvement, saisie et autres étapes selon la méthode retenue.",
    "module": "611",
    "revision": "611-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-611-verification-fiche-3",
    "kind": "verification",
    "prompt": "Comment lire un taux d’erreur ?",
    "answer": "Vérifier le type d’écart, le volume utilisé au dénominateur et le périmètre d’observation.",
    "module": "611",
    "revision": "611-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-611-verification-fiche-4",
    "kind": "verification",
    "prompt": "Quel intérêt a une consolidation ?",
    "answer": "Elle rassemble la commande et permet un contrôle avant le départ.",
    "module": "611",
    "revision": "611-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-611-verification-fiche-5",
    "kind": "verification",
    "prompt": "Pourquoi surveiller la qualité en plus de la cadence ?",
    "answer": "Un gain de vitesse peut entraîner davantage de reprises ou d’erreurs.",
    "module": "611",
    "revision": "611-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-611-situation-fiche-1",
    "kind": "situation",
    "prompt": "Le déplacement représente la moitié du temps. Quelle amélioration testez-vous ?",
    "answer": "Comparer le placement et le parcours, puis mesurer temps et qualité dans un pilote.",
    "module": "611",
    "revision": "611-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-611-situation-fiche-2",
    "kind": "situation",
    "prompt": "Trois zones préparent une même commande et une unité manque. Comment la retrouvez-vous ?",
    "answer": "Comparer les traces de chaque zone et le relevé de consolidation.",
    "module": "611",
    "revision": "611-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-611-situation-fiche-3",
    "kind": "situation",
    "prompt": "La cadence augmente après un changement de méthode. Comment vérifiez-vous son effet ?",
    "answer": "Comparer des charges similaires et contrôler les erreurs et délais en parallèle.",
    "module": "611",
    "revision": "611-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
