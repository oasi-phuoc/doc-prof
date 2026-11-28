import type { LogistiqueUnit } from '../approved-banks'

export const module503 = [
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
        "kind": "image",
        "src": "/assets/logistique/100/104/commun/log-104-tri-chutes-photo-v002.webp",
        "alt": "Une caisse est montée sur un établi avec les planches à portée.",
        "caption": "À l’établi, plusieurs opérations peuvent se faire au même poste. Une petite série y est possible."
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
        "kind": "image",
        "src": "/assets/logistique/500/503/cfc/log-503-goulot-photo-v010.webp",
        "alt": "Des bacs attendent devant le poste de contrôle, où le débit est plus faible.",
        "caption": "Le poste de contrôle traite les pièces plus lentement. Les bacs s’accumulent devant lui."
      },
      {
        "kind": "paragraph",
        "text": "Un {g}goulot{/g} est le poste qui limite le débit du flux. Accélérer les étapes en amont peut augmenter la file d’attente. Comparez les cadences pour repérer où agir."
      },
      {
        "kind": "image",
        "src": "/assets/logistique/500/503/cfc/log-503-ligne-photo-v002.webp",
        "alt": "Les opérations de différents postes suivent le trajet des bacs sur une ligne.",
        "caption": "La fabrication à la chaîne place chaque poste dans l’ordre des opérations."
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
        "src": "/assets/logistique/700/704/cfc/log-704-indicateurs-photo-v002.webp",
        "alt": "Deux superviseurs examinent un graphique et les données devant une allée.",
        "caption": "Après un changement, comparez les attentes, les déplacements et les écarts de qualité sur le même volume."
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
    "summaryBlocks": [
      {
        "kind": "heading",
        "text": "3. Organisation de la production",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "3.1 et 3.2 Types de fabrication",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/100/104/commun/log-104-tri-chutes-photo-v002.webp",
        "alt": "Une caisse est montée sur un établi avec les planches à portée.",
        "caption": "À l’établi, plusieurs opérations peuvent se faire au même poste. Une petite série y est possible."
      },
      {
        "kind": "paragraph",
        "text": "La {g}fabrication unitaire{/g} produit un exemplaire pour un besoin précis. La {g}production multiple{/g} refait plusieurs exemplaires. La {g}production de masse{/g} répète un produit de façon continue ou régulière à grand volume. En {g}série{/g}, on produit des unités semblables puis on prépare une autre série. La {g}fabrication par variétés{/g} modifie certaines caractéristiques d’un même type de produit. Le {g}lot{/g} regroupe des unités réalisées ensemble selon la règle du site. Un passage à un autre modèle peut demander un réglage."
      },
      {
        "kind": "heading",
        "text": "3.3 Organisation de la production",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/500/503/cfc/log-503-goulot-photo-v010.webp",
        "alt": "Des bacs attendent devant le poste de contrôle, où le débit est plus faible.",
        "caption": "Le poste de contrôle traite les pièces plus lentement. Les bacs s’accumulent devant lui."
      },
      {
        "kind": "paragraph",
        "text": "Un {g}goulot{/g} est le poste qui limite le débit du flux. Accélérer les étapes en amont peut augmenter la file d’attente. Comparez les cadences pour repérer où agir."
      },
      {
        "kind": "image",
        "src": "/assets/logistique/500/503/cfc/log-503-ligne-photo-v002.webp",
        "alt": "Les opérations de différents postes suivent le trajet des bacs sur une ligne.",
        "caption": "La fabrication à la chaîne place chaque poste dans l’ordre des opérations."
      },
      {
        "kind": "paragraph",
        "text": "À l’{g}établi{/g}, une personne effectue plusieurs opérations au même poste. En {g}atelier{/g}, les postes sont regroupés par compétence ou machine. Dans la {g}fabrication à la chaîne{/g}, les postes suivent l’ordre des opérations. En {g}fabrication de chantier{/g}, le produit reste au même emplacement et les ressources se déplacent vers lui."
      },
      {
        "kind": "heading",
        "text": "3.4 et 3.5 Choisir et améliorer l’organisation",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/700/704/cfc/log-704-indicateurs-photo-v002.webp",
        "alt": "Deux superviseurs examinent un graphique et les données devant une allée.",
        "caption": "Après un changement, comparez les attentes, les déplacements et les écarts de qualité sur le même volume."
      },
      {
        "kind": "paragraph",
        "text": "Comparez cadence, variété, besoin de réglages, délais et distances. La {g}Lean Production{/g} cherche à rendre le travail plus fluide et à réduire le {g}gaspillage{/g}, par exemple les attentes ou mouvements inutiles. Ajustez avec l’équipe et mesurez le résultat en gardant la qualité et la sécurité."
      }
    ],
    "module": "503",
    "revision": "503-v004",
    "approvedFor": [
      "CFC"
    ]
  }
] satisfies readonly LogistiqueUnit[]
