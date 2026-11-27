import type { LogistiqueUnit } from '../approved-banks'

export const module406 = [
  {
    "id": "log-406-objectifs-apercu",
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
          "Comparer {g}lotissement par case{/g} et stockage {g}chaotique{/g}",
          "Expliquer pourquoi le chaotique exige un {g}SGS{/g}",
          "Appliquer les principes {g}FIFO{/g} et {g}LIFO{/g} et citer les formes adaptées",
          "Situer le {g}HIFO{/g} comme méthode de valorisation"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 406",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Distinguer l’emplacement fixe et l’affectation dynamique des positions.",
          "Lire les dates de lot avant de choisir le prélèvement selon la règle prévue.",
          "Distinguer l’ordre physique des sorties et une méthode de valorisation."
        ]
      }
    ],
    "module": "406",
    "revision": "406-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-406-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "6. Principes de stockage",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "6.1 Lotissement par case (emplacement fixe)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/406/commun/log-406-notions-1-v001.svg",
        "alt": "Fixe. Une place réservée à l’article. Dynamique. Une place libre et compatible.",
        "caption": "Chaque mouvement est rattaché à la position réellement utilisée."
      },
      {
        "kind": "paragraph",
        "text": "Chaque article a un emplacement {g}définitivement attribué{/g} — « chaque chose à sa place ». Courant : rayons libre-service, entrepôts commerciaux, préparation de commandes."
      },
      {
        "kind": "paragraph",
        "text": "Souvent sans {g}SGS{/g} (gestion de stock informatisée). Inconvénient : fortes fluctuations → {g}mauvaise{/g} utilisation de l'espace (emplacement réservé au stock {g}maximal{/g} même si case quasi vide)."
      },
      {
        "kind": "paragraph",
        "text": "Cas optimal : stock max atteint (souvent juste après une livraison). Sinon : emplacements vides inutilisables pour d'autres articles."
      },
      {
        "kind": "heading",
        "text": "6.2 Stockage chaotique (anarchique)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Le stockage dynamique attribue une place libre et compatible avec l’article. Le système doit conserver la position réelle du lot."
      },
      {
        "kind": "paragraph",
        "text": "{g}Remarque :{/g} possible {g}uniquement{/g} avec gestion de stock {g}assistée par ordinateur{/g}."
      },
      {
        "kind": "heading",
        "text": "6.2.1 Conditions",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Tenir compte des caractéristiques produits et {g}interdictions de stockage en commun{/g} (systèmes optimisés). Prendre en compte fréquences / rotations. Répartir sur plusieurs zones → une panne n'empêche pas de déstocker tout un groupe."
      },
      {
        "kind": "heading",
        "text": "6.3 FIFO — First In, First Out",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/406/commun/log-406-notions-2-v001.svg",
        "alt": "FIFO. Priorité à l’entrée la plus ancienne. FEFO. Priorité à l’échéance la plus proche.",
        "caption": "Lire la consigne de l’article avant le prélèvement."
      },
      {
        "kind": "paragraph",
        "text": "En FIFO, sortir d’abord le lot entré en premier selon la règle de l’article. Si l’échéance est prioritaire, appliquer le FEFO défini par le site."
      },
      {
        "kind": "paragraph",
        "text": "{g}Formes qui supportent le FIFO{/g} (si bien utilisées) : - rayonnage {g}dynamique{/g} - drive-in à {g}double entrée{/g} - stockage en pile avec prélèvement à la {g}base{/g}"
      },
      {
        "kind": "heading",
        "text": "6.4 LIFO — Last In, First Out",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Généralement {g}non recommandé{/g} (formation de « stocks » anciens). Inévitable avec : - stockage en {g}bloc{/g} - lignes/rangées accessibles d'{g}un seul{/g} côté - drive-in à {g}une{/g} entrée"
      },
      {
        "kind": "paragraph",
        "text": "Sur rayonnages palettes/compartiments : ni favorisé ni empêché — les logisticiens doivent gérer la rotation : {g}nouvelles marchandises derrière{/g} les anciennes."
      },
      {
        "kind": "heading",
        "text": "6.5 HIFO — Highest In, First Out",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Procédure de {g}valorisation{/g} des stocks : sortir d'abord les plus {g}chers{/g} → stock valorisé aux prix d'achat les plus bas (chiffre d'affaires élevé / stock final faible à l'inventaire · parfois réduction du revenu imposable). Courant à l'étranger ; {g}pas{/g} toujours autorisé (ex. droit commercial/fiscal allemand). Avantage : évaluation prudente (prix bas)."
      }
    ],
    "module": "406",
    "revision": "406-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-406-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Affectation dynamique{/g} — Allocation d’une position libre compatible au moment de l’entrée."
      },
      {
        "kind": "paragraph",
        "text": "{g}Date d’entrée{/g} — Date d’enregistrement de l’arrivée ou de l’entrée dans le périmètre considéré."
      },
      {
        "kind": "paragraph",
        "text": "{g}Date limite{/g} — Échéance utilisée pour décider d’un usage ou d’une sortie selon la procédure."
      },
      {
        "kind": "paragraph",
        "text": "{g}Emplacement fixe{/g} — Position attribuée durablement à une référence."
      },
      {
        "kind": "paragraph",
        "text": "{g}FEFO{/g} — Le lot dont l’échéance est la plus proche sort en premier."
      },
      {
        "kind": "paragraph",
        "text": "{g}FIFO{/g} — L’unité entrée la première sort la première."
      },
      {
        "kind": "paragraph",
        "text": "{g}HIFO{/g} — Convention où les unités au coût le plus haut sont réputées sortir en premier."
      },
      {
        "kind": "paragraph",
        "text": "{g}LIFO{/g} — L’unité entrée le plus récemment sort la première dans le contexte étudié."
      },
      {
        "kind": "paragraph",
        "text": "{g}Lot{/g} — Ensemble identifiable d’unités pour le suivi."
      },
      {
        "kind": "paragraph",
        "text": "{g}Ordre de sortie{/g} — Priorité appliquée lors du prélèvement."
      },
      {
        "kind": "paragraph",
        "text": "{g}Position compatible{/g} — Emplacement conforme aux propriétés et limites nécessaires pour l’article."
      },
      {
        "kind": "paragraph",
        "text": "{g}Traçabilité de stock{/g} — Lien entre la référence, la position, le lot et les mouvements."
      }
    ],
    "module": "406",
    "revision": "406-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-406-maths-fiche-1",
    "kind": "maths",
    "prompt": "Le rayon A a 14 places et en utilise neuf. Combien de positions sont libres ?",
    "answer": "Cinq positions.",
    "calculation": "14 − 9 = 5.",
    "module": "406",
    "revision": "406-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-406-maths-fiche-2",
    "kind": "maths",
    "prompt": "Le plus ancien lot contient 16 pièces. Une demande en exige 25. Combien prélevez-vous sur le lot suivant après avoir utilisé le premier ?",
    "answer": "Neuf pièces.",
    "calculation": "25 − 16 = 9.",
    "module": "406",
    "revision": "406-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-406-maths-fiche-3",
    "kind": "maths",
    "prompt": "Une zone mobile compte 30 positions et en utilise 24. Calculez son taux d’occupation.",
    "answer": "80 %.",
    "calculation": "24 ÷ 30 × 100 = 80 %.",
    "module": "406",
    "revision": "406-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-406-maths-fiche-4",
    "kind": "maths",
    "prompt": "Quatre sites attribuent chacun cinq nouveaux emplacements. Combien d’affectations faut-il enregistrer ?",
    "answer": "20 affectations.",
    "calculation": "4 × 5 = 20.",
    "module": "406",
    "revision": "406-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-406-maths-fiche-5",
    "kind": "maths",
    "prompt": "Deux lots totalisent 30 pièces à 8 CHF et 20 à 10 CHF. Calculez la valeur totale et le coût moyen.",
    "answer": "440 CHF au total et 8,80 CHF par pièce.",
    "calculation": "30 × 8 + 20 × 10 = 440 CHF. 440 ÷ 50 = 8,80 CHF.",
    "module": "406",
    "revision": "406-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-406-verification-fiche-1",
    "kind": "verification",
    "prompt": "Quelle différence entre emplacement fixe et affectation dynamique ?",
    "answer": "Le premier est dédié. La seconde choisit une position libre et compatible lors de l’entrée.",
    "module": "406",
    "revision": "406-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-406-verification-fiche-2",
    "kind": "verification",
    "prompt": "Comment choisir entre FIFO et FEFO ?",
    "answer": "Vérifier la règle applicable. FIFO suit l’entrée, FEFO l’échéance.",
    "module": "406",
    "revision": "406-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-406-verification-fiche-3",
    "kind": "verification",
    "prompt": "Pourquoi enregistrer la position réelle en dynamique ?",
    "answer": "L’article peut se trouver à des positions différentes après chaque entrée.",
    "module": "406",
    "revision": "406-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-406-verification-fiche-4",
    "kind": "verification",
    "prompt": "Que distingue LIFO de FIFO ?",
    "answer": "LIFO met le dernier entré en priorité. FIFO met le premier entré en priorité.",
    "module": "406",
    "revision": "406-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-406-verification-fiche-5",
    "kind": "verification",
    "prompt": "Un ordre comptable détermine-t-il toujours l’emplacement à prélever ?",
    "answer": "La règle physique du site et la convention de valorisation doivent être distinguées.",
    "module": "406",
    "revision": "406-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-406-situation-fiche-1",
    "kind": "situation",
    "prompt": "Deux lots ont été entrés dans un ordre opposé à celui de leurs échéances. Que vérifiez-vous ?",
    "answer": "Lire les dates et choisir le lot selon la procédure de la référence.",
    "module": "406",
    "revision": "406-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-406-situation-fiche-2",
    "kind": "situation",
    "prompt": "Une place libre est trop petite pour le support. Que faites-vous ?",
    "answer": "Chercher ou demander une autre position compatible, puis l’enregistrer.",
    "module": "406",
    "revision": "406-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-406-situation-fiche-3",
    "kind": "situation",
    "prompt": "Un article n’est plus dans la position du système. Quelle suite ?",
    "answer": "Vérifier le mouvement récent et le lot, puis corriger ou signaler l’écart selon le rôle.",
    "module": "406",
    "revision": "406-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
