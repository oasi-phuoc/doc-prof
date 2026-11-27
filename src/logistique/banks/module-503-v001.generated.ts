import type { LogistiqueUnit } from '../approved-banks'

export const module503 = [
  {
    "id": "log-503-objectifs-apercu",
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
          "Citer les {g}critères{/g} qui influencent le type de fabrication",
          "Distinguer fabrication {g}unitaire{/g}, {g}masse{/g}, {g}série{/g}, {g}variété{/g} et {g}lots{/g}",
          "Comparer les organisations {g}établi{/g}, {g}atelier{/g}, {g}chaîne{/g} et {g}chantier{/g}",
          "Expliquer le principe de la {g}Lean Production{/g}"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 503",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Comparer production unitaire, par lots et de masse.",
          "Distinguer organisation par ateliers et organisation par flux.",
          "Repérer les attentes et autres pertes de temps avec les notions du Lean."
        ]
      }
    ],
    "module": "503",
    "revision": "503-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-503-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "3. Organisation de la production",
        "sub": false
      },
      {
        "kind": "paragraph",
        "text": "Les caractéristiques du produit déterminent l'infrastructure — au stockage {g}et{/g} en production. Structures variées → plusieurs façons d'organiser."
      },
      {
        "kind": "heading",
        "text": "3.1 Critères (types de fabrication)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "La {g}fabrication{/g} dépend de : - {g}Quantité{/g} de produits fabriqués - {g}Organisation{/g} de la production - {g}Dépendance{/g} du lieu de fabrication"
      },
      {
        "kind": "paragraph",
        "text": "Le type choisi peut être modifié plus tard, mais avec beaucoup d'{g}efforts{/g} et de {g}coûts{/g} → bien planifier dès le départ."
      },
      {
        "kind": "heading",
        "text": "3.2 Types de fabrication",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/500/503/cfc/log-503-notions-1-v001.svg",
        "alt": "Unitaire. Faible volume et besoin précis. Par lots. Séries alternées. Masse. Volume élevé et répétable.",
        "caption": "Le type de fabrication se choisit avec les contraintes du produit."
      },
      {
        "kind": "heading",
        "text": "3.2.1 Fabrication unitaire",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Pièces {g}uniques{/g} · infra + personnel {g}polyvalents{/g} · changements d'équipement fréquents. Aucun produit n'est identique. Ex. : tableaux, appartements, costumes sur mesure. {g}+{/g} personnalisation client · {g}−{/g} temps de fabrication ↑"
      },
      {
        "kind": "heading",
        "text": "3.2.2 Production multiple",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Même produit fabriqué {g}plusieurs fois{/g} · infra et personnel orientés process spécifique · activités {g}répétitives{/g} → optimisation possible."
      },
      {
        "kind": "heading",
        "text": "3.2.3 Production de masse",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Max. de quantité en min. de temps · qualité maintenue · quantité non limitée au démarrage · process adapté puis automatisable · {g}rationalisation{/g} · coût unitaire ↓. Ex. : ciment, oursons en gomme, pièces de monnaie. {g}+{/g} grandes quantités = coût ↓ · {g}−{/g} aucune flexibilité"
      },
      {
        "kind": "heading",
        "text": "3.2.4 Production en série",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Entre unitaire et masse · {g}nombre limité{/g} de produits similaires · séries avec différences minimales. Ex. : voitures, vêtements, meubles. {g}+{/g} productivité ↑ · {g}−{/g} peu de flexibilité · coûts de conversion ↑"
      },
      {
        "kind": "heading",
        "text": "3.2.5 Production de variété (par sortes)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Proche de la série · quantités avec {g}différences minimes{/g} (ex. tailles mode). Ex. : cigarettes, bière, mode. {g}+{/g} MP identiques / similaires · {g}−{/g} taille optimale des lots = défi"
      },
      {
        "kind": "heading",
        "text": "3.2.6 Production par lots",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Différences {g}non volontaires{/g} dans le process (limite d'infra : four, récipient, parcelle…). Ex. : chimie, pain, pommes de terre. {g}+{/g} série ratée éliminable · {g}numérotation / traçabilité{/g} (→ module 506) · {g}−{/g} laborieux · arrêtés par l'infra"
      },
      {
        "kind": "heading",
        "text": "3.3 Organisation de la production",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Après le type de fabrication : définir {g}infrastructure{/g} et {g}ordre{/g}. Modifier ensuite = efforts + coûts ↑."
      },
      {
        "kind": "heading",
        "text": "3.3.1 Fabrication à l'établi",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Une personne / un groupe mène le produit {g}du début à la fin{/g} au même poste · pas de transition obligatoire. Uniques ou petites séries. Ex. : bijoux, tableaux (aussi EnterSite AG). {g}+{/g} qualité ↑ · {g}−{/g} process souvent redéfini · temps / coût ↑"
      },
      {
        "kind": "heading",
        "text": "3.3.2 Fabrication en atelier",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Postes / moyens {g}similaires regroupés{/g} · le produit « circule » selon le plan (fraise → rabote → perce…). Grande {g}flexibilité{/g} d'ordre. Ex. : bois, métal. {g}+{/g} flexibilité · {g}−{/g} temps de passage ↑"
      },
      {
        "kind": "heading",
        "text": "3.3.3 Fabrication à la chaîne (flux)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Ordre {g}fixe{/g} · postes {g}coordonnés dans le temps{/g} · transport continu (manuel ou chaîne). Vitesse adaptée pour que chaque poste finisse à temps. Ex. : voitures. {g}+{/g} temps de traitement ↓ · {g}−{/g} installation coûteuse · tâches monotones"
      },
      {
        "kind": "heading",
        "text": "3.3.4 Fabrication de chantier (principe de l'emplacement)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Main-d'œuvre + moyens amenés {g}sur site{/g} · produit trop grand / lié au lieu (maison, tunnel). Pièces parfois préfabriquées hors site. {g}+{/g} surface fournie par le client · {g}−{/g} coûts de transport (personnel + {g}intrants{/g})"
      },
      {
        "kind": "paragraph",
        "text": "*Intrant* = élément entrant dans le process · *extrant* = élément sortant."
      },
      {
        "kind": "heading",
        "text": "3.4 Aperçu synthétique",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "Type / orga",
          "Brève description",
          "+",
          "−"
        ],
        "rows": [
          [
            "Unitaire",
            "Produits uniques",
            "Qualité / perso.",
            "Coûts / temps"
          ],
          [
            "Masse",
            "Séries continues",
            "Coûts ↓",
            "Flexibilité ↓"
          ],
          [
            "Série",
            "Grandes quantités limitées",
            "Productivité",
            "Conversion"
          ],
          [
            "Variété",
            "Différences minimes",
            "MP uniformes",
            "Lots / conversion"
          ],
          [
            "Lots",
            "Limite d'infra",
            "Traçabilité",
            "Temps"
          ],
          [
            "Établi",
            "Un poste",
            "Qualité",
            "Temps"
          ],
          [
            "Atelier",
            "Plusieurs postes flexibles",
            "Flexibilité",
            "Passage / planification"
          ],
          [
            "Chaîne",
            "Ordre fixe synchronisé",
            "Temps ↓",
            "Coûts machines"
          ],
          [
            "Chantier",
            "Sur place",
            "Pas de surface propre",
            "Transport"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "3.5 Lean Production",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/500/503/cfc/log-503-notions-2-v001.svg",
        "alt": "Observer. Attente et déplacements. Adapter. Essai sur une étape. Contrôler. Mêmes indicateurs.",
        "caption": "Suivre aussi la qualité et les écarts."
      },
      {
        "kind": "paragraph",
        "text": "« Production {g}allégée{/g} » : usage économique et efficace du temps, des moyens, de la production et du personnel."
      },
      {
        "kind": "paragraph",
        "text": "Choisir la meilleure variante fabrication + organisation · supprimer le {g}superflu{/g} · n'utiliser que le nécessaire."
      },
      {
        "kind": "paragraph",
        "text": "Objectifs lean : stocks ↓ · petits lots · flexibilité client ↑ · temps de passage ↓ · bon travail d'équipe."
      }
    ],
    "module": "503",
    "revision": "503-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-503-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Atelier{/g} — Groupe de postes avec une fonction ou technique commune."
      },
      {
        "kind": "paragraph",
        "text": "{g}Cadence{/g} — Quantité réalisée par unité de temps."
      },
      {
        "kind": "paragraph",
        "text": "{g}Changement de série{/g} — Transition entre deux fabrications selon le processus."
      },
      {
        "kind": "paragraph",
        "text": "{g}Flux{/g} — Parcours des matières, unités ou informations."
      },
      {
        "kind": "paragraph",
        "text": "{g}Goulot{/g} — Étape dont la capacité limite le débit du processus."
      },
      {
        "kind": "paragraph",
        "text": "{g}Lean{/g} — Organisation d’amélioration visant à réduire les activités inutiles et améliorer le flux."
      },
      {
        "kind": "paragraph",
        "text": "{g}Lot{/g} — Groupe d’unités traité dans un même ensemble."
      },
      {
        "kind": "paragraph",
        "text": "{g}Poste{/g} — Lieu ou fonction d’une opération de fabrication."
      },
      {
        "kind": "paragraph",
        "text": "{g}Production de masse{/g} — Réalisation répétée d’un grand volume d’unités standardisées."
      },
      {
        "kind": "paragraph",
        "text": "{g}Production unitaire{/g} — Réalisation isolée d’un produit ou petit nombre très spécifique."
      },
      {
        "kind": "paragraph",
        "text": "{g}Temps de passage{/g} — Temps entre l’entrée et la sortie du périmètre considéré."
      },
      {
        "kind": "paragraph",
        "text": "{g}Temps de réglage{/g} — Durée consacrée à préparer les conditions d’une série."
      }
    ],
    "module": "503",
    "revision": "503-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-503-maths-fiche-1",
    "kind": "maths",
    "prompt": "Quatre lots contiennent chacun 45 unités. Calculez le volume total.",
    "answer": "180 unités.",
    "calculation": "4 × 45 = 180.",
    "module": "503",
    "revision": "503-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-503-maths-fiche-2",
    "kind": "maths",
    "prompt": "Le réglage dure 25 min et la série dure 95 min. Calculez le temps total.",
    "answer": "120 minutes.",
    "calculation": "25 + 95 = 120 min.",
    "module": "503",
    "revision": "503-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-503-maths-fiche-3",
    "kind": "maths",
    "prompt": "Deux étapes peuvent traiter 24 et 18 unités par heure. Dans un modèle en série, quel débit maximal indique l’étape limitante ?",
    "answer": "18 unités par heure.",
    "calculation": "Le minimum entre 24 et 18 vaut 18.",
    "module": "503",
    "revision": "503-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-503-maths-fiche-4",
    "kind": "maths",
    "prompt": "Un parcours est raccourci de 80 à 60 m. Calculez le gain relatif.",
    "answer": "25 %.",
    "calculation": "(80 − 60) ÷ 80 × 100 = 25 %.",
    "module": "503",
    "revision": "503-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-503-maths-fiche-5",
    "kind": "maths",
    "prompt": "Sur deux heures, il y a 35 minutes d’attente et 70 de travail. Calculez le temps restant.",
    "answer": "15 minutes.",
    "calculation": "120 − 35 − 70 = 15.",
    "module": "503",
    "revision": "503-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-503-verification-fiche-1",
    "kind": "verification",
    "prompt": "Quand une fabrication unitaire est-elle pertinente ?",
    "answer": "Lorsqu’un bien doit être réalisé avec des caractéristiques spécifiques et en quantité faible.",
    "module": "503",
    "revision": "503-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-503-verification-fiche-2",
    "kind": "verification",
    "prompt": "Quel intérêt donne une ligne organisée dans l’ordre du flux ?",
    "answer": "Elle facilite l’enchaînement des opérations répétitives.",
    "module": "503",
    "revision": "503-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-503-verification-fiche-3",
    "kind": "verification",
    "prompt": "Pourquoi mesurer les attentes ?",
    "answer": "Pour comprendre les écarts de cadence, réglages, files et contraintes.",
    "module": "503",
    "revision": "503-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-503-verification-fiche-4",
    "kind": "verification",
    "prompt": "Qu’est-ce qu’un goulot ?",
    "answer": "L’étape qui limite le débit du processus pour la charge étudiée.",
    "module": "503",
    "revision": "503-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-503-verification-fiche-5",
    "kind": "verification",
    "prompt": "Pourquoi documenter un essai d’amélioration ?",
    "answer": "Pour vérifier son effet sur les mêmes indicateurs et préserver la qualité.",
    "module": "503",
    "revision": "503-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-503-situation-fiche-1",
    "kind": "situation",
    "prompt": "Un poste est rapide mais l’aval sature. Quelle action étudiez-vous ?",
    "answer": "Examiner l’étape limitante et ajuster l’organisation sans multiplier l’encours inutile.",
    "module": "503",
    "revision": "503-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-503-situation-fiche-2",
    "kind": "situation",
    "prompt": "Les commandes deviennent plus variées. Que comparez-vous ?",
    "answer": "Temps et coûts de réglage, tailles de lot, flexibilité et délai.",
    "module": "503",
    "revision": "503-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-503-situation-fiche-3",
    "kind": "situation",
    "prompt": "Une modification réduit les déplacements mais augmente les erreurs. Que faites-vous ?",
    "answer": "Comparer les deux effets et revoir l’organisation avant généralisation.",
    "module": "503",
    "revision": "503-v001",
    "approvedFor": [
      "CFC"
    ]
  }
] satisfies readonly LogistiqueUnit[]
