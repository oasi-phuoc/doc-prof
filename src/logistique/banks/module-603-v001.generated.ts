import type { LogistiqueUnit } from '../approved-banks'

export const module603 = [
  {
    "id": "log-603-objectifs-apercu",
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
          "Comparer {g}filmage{/g}, {g}rétraction{/g} et {g}cerclage{/g}",
          "Choisir un {g}feuillard{/g} (PP/PET, textile, acier) selon traction, allongement et rappel",
          "Calculer une {g}force de rupture{/g} et l'appliquer à un cas (ex. 2 cerclages)",
          "Distinguer les {g}fermetures{/g} (boucle, chape, sans chape, ficelle)"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 603",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Distinguer le maintien d’une unité de charge et son arrimage sur le véhicule.",
          "Identifier les familles de matériels et lire les données du dossier applicable.",
          "Reconnaître les signes qui imposent de suspendre la remise et de signaler."
        ]
      }
    ],
    "module": "603",
    "revision": "603-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-603-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "3. L'arrimage des marchandises",
        "sub": false
      },
      {
        "kind": "paragraph",
        "text": "Le filmage, la rétraction et le cerclage peuvent maintenir les éléments d’une unité. L’arrimage sur un véhicule relève des dispositifs et règles du transport."
      },
      {
        "kind": "heading",
        "text": "Filmage / stretching",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Envelopper avec un {g}film étirable{/g} (dérouleur manuel ou filmeuse)."
      },
      {
        "kind": "list",
        "items": [
          "L’emploi est déterminé par les matériels, le produit et la procédure validée.",
          "Vérifier la compatibilité avec le support et les contrôles prévus.",
          "Idéal pour charges {g}homogènes{/g} · arêtes saillantes peuvent percer · charges avec éléments lourds → {g}+ cerclage{/g} plastique"
        ]
      },
      {
        "kind": "paragraph",
        "text": "👉 Langage courant : « filmer » = souvent banderolage étirable (à distinguer de la rétraction thermique)."
      },
      {
        "kind": "heading",
        "text": "Rétraction",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "La rétraction utilise un matériau prévu pour changer de dimension. La mise en œuvre relève d’équipements et de procédures validés, utilisés par les personnes autorisées."
      },
      {
        "kind": "heading",
        "text": "Cerclage",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/603/commun/log-603-notions-1-v001.svg",
        "alt": "Unité. Maintien des éléments. Véhicule. Arrimage de l’ensemble.",
        "caption": "La validation de l’unité ne remplace pas celle du transport."
      },
      {
        "kind": "paragraph",
        "text": "Le cerclage maintient une unité avec le système prévu. En cas d’instabilité, interrompre la remise et faire vérifier la configuration."
      },
      {
        "kind": "heading",
        "text": "3.1 Choisir le bon feuillard",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Critères : résistance à la traction · extensibilité · capacité de rappel · prix · environnement."
      },
      {
        "kind": "table",
        "headers": [
          "Matériau",
          "Traction (N/mm²)",
          "Extensibilité",
          "Rappel",
          "Prix",
          "Écolo"
        ],
        "rows": [
          [
            "Plastique {g}PP / PET{/g}",
            "330–400",
            "16–22 %",
            "Très grand",
            "Bon marché",
            "PET recyclable"
          ],
          [
            "Textile / polyester",
            "470–570",
            "11–16 %",
            "Grand",
            "Cher",
            "Non recyclable"
          ],
          [
            "{g}Acier{/g}",
            "700–1100",
            "6–12 %",
            "Petit",
            "Très cher",
            "Recyclable"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "3.1.1 Résistance à la traction",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/603/commun/log-603-notions-2-v001.svg",
        "alt": "Éprouvette. Section et mesure d’essai. Résultat. Force de rupture. Usage. Limite documentée.",
        "caption": "Seule la documentation applicable fixe la limite d’usage."
      },
      {
        "kind": "paragraph",
        "text": "N/mm² = force pour déchirer 1 mm². Comparer plutôt la {g}force de rupture{/g} : {g}Force de rupture = section × résistance{/g} · section = largeur × épaisseur. Une force s’exprime en newtons. Elle ne doit pas être confondue avec une masse en kilogrammes."
      },
      {
        "kind": "paragraph",
        "text": "{g}Exemple de laboratoire{/g} : les valeurs suivantes comparent deux éprouvettes fictives, sans fixer de limite de transport."
      },
      {
        "kind": "table",
        "headers": [
          "",
          "Plastique",
          "Acier"
        ],
        "rows": [
          [
            "Dimensions",
            "20 × 0,4 mm → 8 mm²",
            "15 × 0,6 mm → 9 mm²"
          ],
          [
            "Traction",
            "400 N/mm²",
            "1200 N/mm²"
          ],
          [
            "Rupture de l’éprouvette",
            "3 200 N",
            "10 800 N"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "Pour une situation réelle, vérifier les limites d’emploi, les systèmes compatibles et la procédure de transport."
      },
      {
        "kind": "heading",
        "text": "3.1.2 Allongement",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "% d'extension jusqu'à rupture · PP le plus extensible."
      },
      {
        "kind": "heading",
        "text": "3.1.3 Capacité de rétractation (rappel)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Capacité à se {g}resserrer{/g} après étirement · importante si la charge se tasse. Plastique ≫ acier (acier étiré ne se contracte presque plus)."
      },
      {
        "kind": "heading",
        "text": "3.2 Types de fermeture",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Avec {g}boucle{/g} · avec {g}chape{/g} · {g}sans chape{/g} (soudage, poinçonnage, encliquetage)."
      },
      {
        "kind": "heading",
        "text": "3.2.1 Boucle",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Économique · fils polyester / textile / PP · rouvrable / retendable · bois, meubles, sécurisation temporaire interne."
      },
      {
        "kind": "heading",
        "text": "3.2.2 Chape",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Cette famille de fermeture s’utilise uniquement avec le système et l’équipement compatibles selon leurs instructions."
      },
      {
        "kind": "heading",
        "text": "3.2.3 Sans chape",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Plus rationnel · soudure / encliquetage. Plastique : soudeuses {g}vibrantes{/g} (frottement 200–300 Hz) · ultrasons surtout sur machines auto haut rendement."
      },
      {
        "kind": "heading",
        "text": "3.2.4 Ficelle",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Industrie des boissons : caisses souvent sécurisées par {g}une ficelle{/g} pré-coupée · rapide et économique · adopté ailleurs."
      }
    ],
    "module": "603",
    "revision": "603-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-603-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Allongement{/g} — Variation de longueur rapportée à la longueur initiale."
      },
      {
        "kind": "paragraph",
        "text": "{g}Arrimage{/g} — Maintien de la charge sur le moyen de transport selon les règles applicables."
      },
      {
        "kind": "paragraph",
        "text": "{g}Cerclage{/g} — Maintien d’unités au moyen d’un système de bandes prévu à cet effet."
      },
      {
        "kind": "paragraph",
        "text": "{g}Charge admissible{/g} — Limite d’emploi définie pour la configuration considérée."
      },
      {
        "kind": "paragraph",
        "text": "{g}Feuillard{/g} — Bande utilisée dans un système de cerclage."
      },
      {
        "kind": "paragraph",
        "text": "{g}Film étirable{/g} — Film de maintien conçu pour l’emploi spécifié."
      },
      {
        "kind": "paragraph",
        "text": "{g}Force de rupture{/g} — Force à laquelle un échantillon rompt dans des conditions d’essai."
      },
      {
        "kind": "paragraph",
        "text": "{g}Maintien de charge{/g} — Stabilisation des éléments de l’unité selon le conditionnement prévu."
      },
      {
        "kind": "paragraph",
        "text": "{g}Rétraction{/g} — Changement de dimension d’un matériau selon ses caractéristiques."
      },
      {
        "kind": "paragraph",
        "text": "{g}Section{/g} — Surface de coupe calculée ou mesurée."
      },
      {
        "kind": "paragraph",
        "text": "{g}Traction{/g} — Sollicitation qui tend à allonger une pièce."
      },
      {
        "kind": "paragraph",
        "text": "{g}Unité de charge{/g} — Groupe de biens réunis pour être manipulés comme un ensemble."
      }
    ],
    "module": "603",
    "revision": "603-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-603-maths-fiche-1",
    "kind": "maths",
    "prompt": "Une éprouvette rectangulaire de laboratoire mesure 10 mm de large et 0,5 mm d’épaisseur. Calculez sa section.",
    "answer": "5 mm².",
    "calculation": "10 × 0,5 = 5 mm².",
    "module": "603",
    "revision": "603-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-603-maths-fiche-2",
    "kind": "maths",
    "prompt": "Un essai fictif porte sur une éprouvette de 5 mm² et une contrainte de rupture de 200 N/mm². Calculez la force du modèle.",
    "answer": "1 000 N, valeur d’essai.",
    "calculation": "5 × 200 = 1 000 N.",
    "module": "603",
    "revision": "603-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-603-maths-fiche-3",
    "kind": "maths",
    "prompt": "On contrôle huit unités et on en écarte trois. Combien restent au statut prévu pour le flux ?",
    "answer": "Cinq unités.",
    "calculation": "8 − 3 = 5.",
    "module": "603",
    "revision": "603-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-603-maths-fiche-4",
    "kind": "maths",
    "prompt": "Un contrôle dure 4 minutes par unité. Donnez la durée pour douze unités.",
    "answer": "48 minutes.",
    "calculation": "12 × 4 = 48 min.",
    "module": "603",
    "revision": "603-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-603-maths-fiche-5",
    "kind": "maths",
    "prompt": "Un relevé porte sur 160 unités dont 12 doivent être reprises. Calculez le taux.",
    "answer": "7,5 %.",
    "calculation": "12 ÷ 160 × 100 = 7,5 %.",
    "module": "603",
    "revision": "603-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-603-verification-fiche-1",
    "kind": "verification",
    "prompt": "Que distingue le maintien d’une palette de l’arrimage sur un véhicule ?",
    "answer": "Le premier stabilise l’unité. L’arrimage concerne sa tenue sur le véhicule selon la configuration de transport.",
    "module": "603",
    "revision": "603-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-603-verification-fiche-2",
    "kind": "verification",
    "prompt": "Une force de rupture est-elle une limite d’usage ?",
    "answer": "Elle décrit un essai. Les limites d’usage se vérifient dans la documentation et la procédure applicables.",
    "module": "603",
    "revision": "603-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-603-verification-fiche-3",
    "kind": "verification",
    "prompt": "Quelle différence entre masse et force ?",
    "answer": "La masse s’exprime en kg. La force s’exprime en N.",
    "module": "603",
    "revision": "603-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-603-verification-fiche-4",
    "kind": "verification",
    "prompt": "Que faire si une unité est déformée ?",
    "answer": "Suspendre sa remise, sécuriser selon consigne et signaler à la personne compétente.",
    "module": "603",
    "revision": "603-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-603-verification-fiche-5",
    "kind": "verification",
    "prompt": "Quels documents vérifier avant une décision ?",
    "answer": "Données de l’unité, caractéristiques des matériels et plan ou procédure de transport.",
    "module": "603",
    "revision": "603-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-603-situation-fiche-1",
    "kind": "situation",
    "prompt": "Un film est coupé et plusieurs colis se décalent. Quelle suite ?",
    "answer": "Écarter l’unité du flux, maintenir la zone sûre et demander la remise en conformité autorisée.",
    "module": "603",
    "revision": "603-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-603-situation-fiche-2",
    "kind": "situation",
    "prompt": "Le document d’essai ne mentionne pas de charge admissible. Que faites-vous ?",
    "answer": "Ne pas l’utiliser comme autorisation. Demander le dossier applicable au matériel et à la configuration.",
    "module": "603",
    "revision": "603-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-603-situation-fiche-3",
    "kind": "situation",
    "prompt": "Une palette stable à l’arrêt doit prendre la route. Que vérifiez-vous ?",
    "answer": "La compatibilité du maintien, le dossier de transport et la validation de l’arrimage par les personnes responsables.",
    "module": "603",
    "revision": "603-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
