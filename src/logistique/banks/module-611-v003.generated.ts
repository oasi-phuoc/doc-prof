import type { LogistiqueUnit } from '../approved-banks'

export const module611 = [
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
        "kind": "image",
        "src": "/assets/logistique/600/601/commun/log-601-pick-photo-v002.webp",
        "alt": "Un agent de prélèvement rapproche un article du carton de commande.",
        "caption": "Suivre la ligne de commande permet de contrôler le prélèvement et la consolidation."
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
        "kind": "image",
        "src": "/assets/logistique/600/605/commun/log-605-tri-colis-photo-v002.webp",
        "alt": "Un convoyeur distribue les cartons vers des branches séparées.",
        "caption": "Le trieur envoie chaque unité vers la destination associée à son identifiant."
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
        "src": "/assets/logistique/600/601/commun/log-601-lumiere-photo-v003.webp",
        "alt": "Un signal lumineux désigne un bac sur la face de préparation.",
        "caption": "Un repère au rayon peut réduire la recherche. Mesurez séparément recherche, prise, déplacement et contrôle."
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
    "summaryBlocks": [
      {
        "kind": "heading",
        "text": "11. La préparation de commandes",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "11.1 à 11.3 Principes, termes et systèmes",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/601/commun/log-601-pick-photo-v002.webp",
        "alt": "Un agent de prélèvement rapproche un article du carton de commande.",
        "caption": "Suivre la ligne de commande permet de contrôler le prélèvement et la consolidation."
      },
      {
        "kind": "paragraph",
        "text": "Un {g}ordre de préparation{/g} regroupe des {g}lignes{/g}, chacune avec une référence et une quantité. Le {g}prélèvement{/g} prend l’article. La {g}consolidation{/g} réunit les lignes. Une méthode peut servir une commande à la fois, travailler par lot ou par zone, ou apporter les marchandises au poste. Vérifiez les articles et les écarts avant l’expédition."
      },
      {
        "kind": "heading",
        "text": "11.4 Trieurs",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/605/commun/log-605-tri-colis-photo-v002.webp",
        "alt": "Un convoyeur distribue les cartons vers des branches séparées.",
        "caption": "Le trieur envoie chaque unité vers la destination associée à son identifiant."
      },
      {
        "kind": "paragraph",
        "text": "Un {g}trieur{/g} affecte les unités à une destination. La lecture d’un identifiant relie le colis au bon circuit. Traitez les colis hors format ou mal lus selon la procédure."
      },
      {
        "kind": "heading",
        "text": "11.5 et 11.6 Temps et indicateurs",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/601/commun/log-601-lumiere-photo-v003.webp",
        "alt": "Un signal lumineux désigne un bac sur la face de préparation.",
        "caption": "Un repère au rayon peut réduire la recherche. Mesurez séparément recherche, prise, déplacement et contrôle."
      },
      {
        "kind": "paragraph",
        "text": "Le temps comprend notamment préparation des informations, déplacement, recherche, prise et opérations annexes. Mesurez chaque étape pour repérer l’attente ou l’erreur. La {g}cadence{/g} peut s’exprimer en lignes par heure et le {g}taux d’erreur{/g} en lignes non conformes sur lignes traitées. Gardez la même méthode pour comparer."
      },
      {
        "kind": "heading",
        "text": "11.7 Conception d'entrepôts (exemples types)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Organisez les références, les parcours, le réapprovisionnement et les zones. Les articles très demandés peuvent être rapprochés si cela respecte ergonomie, sécurité et compatibilité des produits."
      }
    ],
    "module": "611",
    "revision": "611-v003",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
