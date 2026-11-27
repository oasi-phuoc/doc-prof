import type { LogistiqueUnit } from '../approved-banks'

export const module501 = [
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
        "src": "/assets/logistique/100/104/commun/log-104-tri-chutes-photo-v002.webp",
        "alt": "Des planches sont assemblées en caisse à un établi.",
        "caption": "La production transforme des composants et du temps de travail en un bien utile."
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
        "src": "/assets/logistique/500/505/cfc/log-505-nomenclature-photo-v002.webp",
        "alt": "Les éléments d’une caisse sont disposés séparément près du produit fini.",
        "caption": "La nomenclature relie le produit aux éléments à préparer pour sa fabrication."
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
    "summaryBlocks": [
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
        "src": "/assets/logistique/100/104/commun/log-104-tri-chutes-photo-v002.webp",
        "alt": "Des planches sont assemblées en caisse à un établi.",
        "caption": "La production transforme des composants et du temps de travail en un bien utile."
      },
      {
        "kind": "paragraph",
        "text": "La {g}production{/g} transforme des ressources en biens ou services. La {g}fabrication{/g} est une partie de la production. Elle peut transformer de la matière ou assembler des composants. Une caisse peut être fabriquée à partir de planches, de fixations et de travail."
      },
      {
        "kind": "heading",
        "text": "1.2 Objectifs et tâches",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Il faut obtenir la quantité et la qualité prévues au moment et au coût attendus. Identifiez matières, personnel, machines et temps. Le planning organise les opérations et le contrôle vérifie le résultat."
      },
      {
        "kind": "heading",
        "text": "1.3 Développement de produits",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Le développement commence par un besoin. On définit les exigences, propose un projet, réalise un {g}prototype{/g}, le teste, puis ajuste avant la fabrication. Le prototype aide à vérifier par exemple les dimensions utiles et la résistance dans les conditions prévues."
      },
      {
        "kind": "heading",
        "text": "1.4 Structure des produits",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/500/505/cfc/log-505-nomenclature-photo-v002.webp",
        "alt": "Les éléments d’une caisse sont disposés séparément près du produit fini.",
        "caption": "La nomenclature relie le produit aux éléments à préparer pour sa fabrication."
      },
      {
        "kind": "paragraph",
        "text": "Un produit comprend des {g}composants{/g} et parfois des {g}sous-ensembles{/g}. La {g}nomenclature{/g} liste ce qui est nécessaire et en quelle quantité. Elle sert aux achats, à la préparation et à l’assemblage."
      }
    ],
    "module": "501",
    "revision": "501-v002",
    "approvedFor": [
      "CFC"
    ]
  }
] satisfies readonly LogistiqueUnit[]
