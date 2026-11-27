import type { LogistiqueUnit } from '../approved-banks'

export const module501 = [
  {
    "id": "log-501-objectifs-apercu",
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
          "Définir la {g}production{/g} et ses facteurs (travail, matériel, matériaux)",
          "Citer les {g}objectifs{/g} principaux (coûts, qualité, délais, temps de passage…)",
          "Décrire le parcours {g}idée → produit{/g} (modèle fonctionnel / série, rôle Achats et PCP)",
          "Expliquer la {g}structure produit{/g} selon construction, achats, production et montage"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 501",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Relier les intrants, les opérations et les sorties d’une production.",
          "Identifier les étapes du développement du produit et le rôle des services.",
          "Lire une structure de produit pour préparer ses composants."
        ]
      }
    ],
    "module": "501",
    "revision": "501-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-501-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "1. Production",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "1.1 Définition",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/500/501/cfc/log-501-notions-1-v001.svg",
        "alt": "Entrées. Matières et ressources. Opérations. Transformation et montage. Sorties. Produits et écarts.",
        "caption": "Toutes les sorties sont relevées selon le processus, y compris les écarts."
      },
      {
        "kind": "paragraph",
        "text": "Du latin *producere* = « produire ». La {g}production{/g} désigne la fabrication de : - {g}Biens matériels{/g} — voiture, téléphone, pain, montres… - {g}Énergies{/g} — électricité, chaleur, essence… - {g}Services{/g} — émissions TV, assurances…"
      },
      {
        "kind": "paragraph",
        "text": "C'est une {g}transformation{/g} d'*inputs* (facteurs de production) en *outputs* via des techniques spécifiques :"
      },
      {
        "kind": "table",
        "headers": [
          "Facteur",
          "Exemples"
        ],
        "rows": [
          [
            "Prestation de {g}travail{/g}",
            "Personnes, spécialistes"
          ],
          [
            "{g}Matériel{/g} d'exploitation",
            "Machines de production"
          ],
          [
            "{g}Matériaux{/g}",
            "Matières premières, matériaux bruts"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "Processus de {g}création de valeur{/g} : combiner les facteurs d'entrée pour obtenir des sorties de la plus haute qualité possible."
      },
      {
        "kind": "heading",
        "text": "1.2 Objectifs et tâches",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "> « Si tu veux construire un bateau, ne rassemble pas les hommes pour trouver du bois… mais enseigne-leur la nostalgie de la mer vaste et infinie. » — Antoine de Saint-Exupéry"
      },
      {
        "kind": "paragraph",
        "text": "Objectif fondamental : un {g}bon produit{/g} qui répond aux attentes clients — idéalement les {g}dépasse{/g}."
      },
      {
        "kind": "table",
        "headers": [
          "Objectif",
          "Sens"
        ],
        "rows": [
          [
            "{g}Coûts{/g} réduits",
            "Produire au meilleur prix possible"
          ],
          [
            "{g}Rendement{/g} élevé",
            "Produire le plus possible"
          ],
          [
            "Haute {g}qualité{/g}",
            "Exigences respectées · le moins de {g}rebuts{/g} possible"
          ],
          [
            "Respect des {g}délais{/g}",
            "Livrer à temps (ni trop tôt, ni trop tard)"
          ],
          [
            "{g}Charge{/g} de travail élevée",
            "Employés et machines suffisamment occupés"
          ],
          [
            "{g}Temps de passage{/g} réduit",
            "Délai de fabrication le plus court possible"
          ],
          [
            "{g}Satisfaction{/g} clients",
            "Répondre à leurs attentes"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "Les matières premières ou produits non finis passent de l'état actuel à l'état souhaité ({g}transformation{/g}). Main-d'œuvre + machines, outils, énergie."
      },
      {
        "kind": "paragraph",
        "text": "👉 La production accomplit une {g}transformation{/g}."
      },
      {
        "kind": "heading",
        "text": "1.3 Développement de produits",
        "sub": true
      },
      {
        "kind": "heading",
        "text": "1.3.1 De l'idée au produit",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Toutes les activités menant à un produit {g}vendable{/g} : vision / idée → lancement marché."
      },
      {
        "kind": "paragraph",
        "text": "{g}Exemple Zeridwen{/g} — poupée pour initier les 4–9 ans au brossage manuel. Témoins lumineux dans la dentition → l'enfant reproduit les gestes. Marché potentiel Europe ≈ {g}11,8 millions{/g} d'unités (étude HEB)."
      },
      {
        "kind": "paragraph",
        "text": "Parcours typique : 1. {g}Dessins techniques{/g} → {g}modèle fonctionnel{/g} (fonctionne, pas encore vendable) 2. Modèle fonctionnel → {g}modèle de série{/g} (proposé sur le marché) 3. {g}Achats{/g} : fournisseurs de matières premières 4. {g}PCP{/g} (planification et contrôle de la production) : pièces, processus sans faille 5. Produit commercialisé"
      },
      {
        "kind": "heading",
        "text": "1.4 Structure des produits",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/500/501/cfc/log-501-notions-2-v001.svg",
        "alt": "Produit final. Un ensemble à assembler. Sous-ensembles. Quantités à préparer. Composants. Références et unités.",
        "caption": "La structure doit correspondre à la version de l’ordre."
      },
      {
        "kind": "paragraph",
        "text": "Organise le produit selon des critères pour planifier / contrôler : conception → achat → production → montage."
      },
      {
        "kind": "table",
        "headers": [
          "Service",
          "Point de vue"
        ],
        "rows": [
          [
            "{g}Construction{/g}",
            "Quelles {g}fonctions{/g} ?"
          ],
          [
            "{g}Achats{/g}",
            "Semi-finis, finis, matières premières à {g}acheter{/g} ?"
          ],
          [
            "{g}Production{/g}",
            "Quelles {g}machines{/g} pour les composants ?"
          ],
          [
            "{g}Montage{/g}",
            "Dans quel {g}ordre{/g} monter composants / sous-ensembles ?"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "1.4.1 Objectif",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Structure aussi {g}simple{/g} et {g}neutre client{/g} (standardisée) que possible jusqu'aux niveaux supérieurs. Différences individuelles (= souhaits clients) le {g}plus tard possible{/g} dans le process."
      },
      {
        "kind": "paragraph",
        "text": "👉 Sert à la {g}documentation complète{/g} d'un produit (ou famille) sous plusieurs angles (conception, fabrication…)."
      }
    ],
    "module": "501",
    "revision": "501-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-501-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Assemblage{/g} — Réunion de composants pour réaliser une unité."
      },
      {
        "kind": "paragraph",
        "text": "{g}Composant{/g} — Élément qui entre dans la composition d’un produit."
      },
      {
        "kind": "paragraph",
        "text": "{g}Développement{/g} — Étapes qui transforment un besoin ou une idée en solution vérifiée."
      },
      {
        "kind": "paragraph",
        "text": "{g}Facteurs de production{/g} — Travail, équipements, matières et autres ressources utilisées."
      },
      {
        "kind": "paragraph",
        "text": "{g}Intrant{/g} — Ressource qui entre dans le processus."
      },
      {
        "kind": "paragraph",
        "text": "{g}Module{/g} — Sous-ensemble identifiable d’un produit."
      },
      {
        "kind": "paragraph",
        "text": "{g}Nomenclature{/g} — Liste structurée des composants et quantités d’un produit."
      },
      {
        "kind": "paragraph",
        "text": "{g}Production{/g} — Ensemble d’opérations qui réalise un bien ou un service."
      },
      {
        "kind": "paragraph",
        "text": "{g}Prototype{/g} — Première réalisation destinée à vérifier une solution."
      },
      {
        "kind": "paragraph",
        "text": "{g}Série{/g} — Groupe d’unités produit dans les mêmes conditions de référence."
      },
      {
        "kind": "paragraph",
        "text": "{g}Sortie{/g} — Résultat de l’opération, par exemple le produit conforme ou le rebut."
      },
      {
        "kind": "paragraph",
        "text": "{g}Valeur ajoutée{/g} — Valeur créée par l’activité au-delà des consommations intermédiaires."
      }
    ],
    "module": "501",
    "revision": "501-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-501-maths-fiche-1",
    "kind": "maths",
    "prompt": "Un ensemble comporte deux supports et quatre vis. Calculez le besoin pour 35 ensembles.",
    "answer": "70 supports et 140 vis.",
    "calculation": "2 × 35 = 70. 4 × 35 = 140.",
    "module": "501",
    "revision": "501-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-501-maths-fiche-2",
    "kind": "maths",
    "prompt": "Sur 120 unités produites, sept ne satisfont pas au contrôle. Combien sont conformes ?",
    "answer": "113 unités.",
    "calculation": "120 − 7 = 113.",
    "module": "501",
    "revision": "501-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-501-maths-fiche-3",
    "kind": "maths",
    "prompt": "Une série utilise 84 m de matière pour 28 articles. Calculez la consommation moyenne.",
    "answer": "3 m par article.",
    "calculation": "84 ÷ 28 = 3 m.",
    "module": "501",
    "revision": "501-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-501-maths-fiche-4",
    "kind": "maths",
    "prompt": "Trois opérations successives durent 12, 5 et 18 minutes. Calculez leur durée totale.",
    "answer": "35 minutes.",
    "calculation": "12 + 5 + 18 = 35 min.",
    "module": "501",
    "revision": "501-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-501-maths-fiche-5",
    "kind": "maths",
    "prompt": "Dans un scénario, les consommations intermédiaires valent 380 CHF et la production vaut 950 CHF. Calculez la différence.",
    "answer": "570 CHF de valeur ajoutée brute dans ce périmètre.",
    "calculation": "950 − 380 = 570 CHF.",
    "module": "501",
    "revision": "501-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-501-verification-fiche-1",
    "kind": "verification",
    "prompt": "Quels facteurs une production combine-t-elle ?",
    "answer": "Des matières, du travail, des équipements et selon le cas de l’énergie.",
    "module": "501",
    "revision": "501-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-501-verification-fiche-2",
    "kind": "verification",
    "prompt": "Pourquoi réaliser un prototype avant une série ?",
    "answer": "Pour vérifier la solution et corriger des problèmes avant répétition.",
    "module": "501",
    "revision": "501-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-501-verification-fiche-3",
    "kind": "verification",
    "prompt": "À quoi sert la structure du produit ?",
    "answer": "À identifier les sous-ensembles et les quantités nécessaires.",
    "module": "501",
    "revision": "501-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-501-verification-fiche-4",
    "kind": "verification",
    "prompt": "Que distingue une sortie conforme d’un rebut ?",
    "answer": "La sortie conforme remplit les exigences. Le rebut est traité selon le statut défini.",
    "module": "501",
    "revision": "501-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-501-verification-fiche-5",
    "kind": "verification",
    "prompt": "Citez deux critères à suivre avec le volume produit.",
    "answer": "Par exemple qualité, délai, coût ou consommation de ressources.",
    "module": "501",
    "revision": "501-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-501-situation-fiche-1",
    "kind": "situation",
    "prompt": "Un prototype ne répond pas à la mesure attendue. Quelle suite avant la série ?",
    "answer": "Documenter l’écart, identifier la version et faire corriger et valider la solution.",
    "module": "501",
    "revision": "501-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-501-situation-fiche-2",
    "kind": "situation",
    "prompt": "Le montage attend un composant non prévu dans la liste. Que contrôlez-vous ?",
    "answer": "La version de la structure produit, le dossier et les pièces réellement nécessaires.",
    "module": "501",
    "revision": "501-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-501-situation-fiche-3",
    "kind": "situation",
    "prompt": "Deux ateliers utilisent des versions différentes. Comment rétablissez-vous la même référence ?",
    "answer": "Vérifier la version validée pour l’ordre et transmettre la modification aux postes concernés.",
    "module": "501",
    "revision": "501-v001",
    "approvedFor": [
      "CFC"
    ]
  }
] satisfies readonly LogistiqueUnit[]
