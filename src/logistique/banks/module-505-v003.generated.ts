import type { LogistiqueUnit } from '../approved-banks'

export const module505 = [
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
        "src": "/assets/logistique/500/503/cfc/log-503-ligne-photo-v002.webp",
        "alt": "Une ligne de fabrication répartit les opérations entre plusieurs postes.",
        "caption": "Le plan vérifie matières, ressources et temps jusqu’à la fin des opérations."
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
        "kind": "image",
        "src": "/assets/logistique/500/505/cfc/log-505-vrac-photo-v003.webp",
        "alt": "Des granulés sont visibles près d’une trémie de production.",
        "caption": "Le produit est suivi en masse ou en volume avant d’être séparé en unités."
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
        "src": "/assets/logistique/500/505/cfc/log-505-nomenclature-photo-v002.webp",
        "alt": "Des planches, poignées et fixations sont présentées près d’une caisse.",
        "caption": "La nomenclature indique quels composants préparer et leur nombre pour chaque produit."
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
    "summaryBlocks": [
      {
        "kind": "heading",
        "text": "5. Planification et contrôle de la production (PCP)",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "Tâches de la PCP",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/500/503/cfc/log-503-ligne-photo-v002.webp",
        "alt": "Une ligne de fabrication répartit les opérations entre plusieurs postes.",
        "caption": "Le plan vérifie matières, ressources et temps jusqu’à la fin des opérations."
      },
      {
        "kind": "paragraph",
        "text": "La {g}PCP{/g} transforme la demande en plan de fabrication. Elle vérifie les {g}matières{/g}, machines, personnel et durées. Elle suit les ordres et adapte le plan si un écart menace le délai. Comparez lancement, quantité prévue et quantité réellement disponible."
      },
      {
        "kind": "heading",
        "text": "5.1 Production push / pull",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "En {g}push{/g}, on lance selon une prévision ou un programme. En {g}pull{/g}, une demande réelle ou une consommation déclenche le travail. Un site peut combiner ces méthodes selon la famille d’articles."
      },
      {
        "kind": "heading",
        "text": "5.2 Production en vrac (bulk)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/500/505/cfc/log-505-vrac-photo-v003.webp",
        "alt": "Des granulés sont visibles près d’une trémie de production.",
        "caption": "Le produit est suivi en masse ou en volume avant d’être séparé en unités."
      },
      {
        "kind": "paragraph",
        "text": "Le {g}vrac{/g} est une matière qui n’est pas encore séparée en unités individuelles. On suit les quantités par masse ou volume, l’état et les règles de séparation et de nettoyage prévues."
      },
      {
        "kind": "heading",
        "text": "5.3 Liste des pièces / nomenclature",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/500/505/cfc/log-505-nomenclature-photo-v002.webp",
        "alt": "Des planches, poignées et fixations sont présentées près d’une caisse.",
        "caption": "La nomenclature indique quels composants préparer et leur nombre pour chaque produit."
      },
      {
        "kind": "paragraph",
        "text": "Une {g}nomenclature{/g} indique les composants et leurs quantités. Une liste {g}à plat{/g} donne les totaux, une liste {g}structurée{/g} décrit les sous-ensembles. Utilisez la bonne version et la bonne unité. Pour 12 caisses de 4 poignées chacune, il faut 48 poignées avant de déduire le stock utilisable."
      }
    ],
    "module": "505",
    "revision": "505-v003",
    "approvedFor": [
      "CFC"
    ]
  }
] satisfies readonly LogistiqueUnit[]
