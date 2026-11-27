import type { LogistiqueUnit } from '../approved-banks'

export const module403 = [
  {
    "id": "log-403-objectifs-apercu",
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
          "Décrire le stockage {g}au sol{/g} et ses variantes",
          "Comparer rayonnages {g}compartimenté{/g}, {g}palettes{/g}, {g}drive-in{/g}, {g}dynamique{/g}, {g}cantilever{/g}",
          "Expliquer rayonnages {g}mobiles{/g}, {g}rotatifs{/g} et stockage {g}suspendu{/g}",
          "Situer les solutions modernes (navettes, robots, hauts rayonnages, {g}Autostore{/g}) et leurs limites"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 403",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Comparer le stockage au sol, en rayonnage et dans les systèmes spécialisés.",
          "Vérifier l’accès à chaque unité et l’aptitude à la rotation prévue.",
          "Relier les dimensions, la capacité et les limites de l’installation."
        ]
      }
    ],
    "module": "403",
    "revision": "403-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-403-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "3. Les formes de stockage",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "3.1 Stockage au sol",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/403/commun/log-403-notions-1-v001.svg",
        "alt": "Bloc au sol. Unités regroupées. Rayonnage. Positions séparées.",
        "caption": "Une capacité élevée ne garantit pas l’accès individuel."
      },
      {
        "kind": "paragraph",
        "text": "Marchandises placées {g}au sol{/g}. Variante de base pour le détail : peu d'organisation, coûts réduits."
      },
      {
        "kind": "heading",
        "text": "3.1.1 Bloc à plat",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Unités {g}non empilées{/g}, accès via couloirs entre rangées. Grande surface. Idéal : volumineux, spéciaux, voitures, vrac (gravier)."
      },
      {
        "kind": "heading",
        "text": "3.1.2 Bloc en piles",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Base au sol + empilement. Matériel {g}insensible à la pression{/g} + moyens de gerbage. Grandes quantités du même article (promos, harasses/palettes vides). Attention : {g}charge au sol{/g} (kg/m²)."
      },
      {
        "kind": "heading",
        "text": "3.1.3 Empilage de marchandises",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Autorisé si chargement solide et conditions OK (T°, humidité…). Respecter hauteur de pile, contrôle régulier. Sacs : pas d'endommagement, pile stable."
      },
      {
        "kind": "heading",
        "text": "3.1.4 Lignes ou rangées",
        "sub": true
      },
      {
        "kind": "list",
        "items": [
          "{g}Lignes{/g} (l'une derrière l'autre) : accès à l'unité suivante de la ligne",
          "{g}Rangées{/g} (côte à côte) : accès à chaque unité · allée entre chaque rangée"
        ]
      },
      {
        "kind": "paragraph",
        "text": "Disposition longi/transversale. Piles inclinées → démonter et reconditionner aussitôt."
      },
      {
        "kind": "paragraph",
        "text": "{g}Remarque :{/g} stockage au sol économique pour blocs/rangées quand l'accès à {g}chaque{/g} unité n'est pas obligatoire."
      },
      {
        "kind": "heading",
        "text": "3.1.5 Bouteilles sous pression",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Gaz en bouteilles acier : ne doivent {g}pas{/g} pouvoir se renverser → souvent {g}chaîne{/g}. Même exigence pour le transport interne."
      },
      {
        "kind": "heading",
        "text": "3.1.6 Produits longs et panneaux",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Tubes/barres souvent horizontaux ; pièces individuelles verticales en {g}râteliers{/g} (séparation, recherche facile). Attention forces latérales au prélèvement vertical. Surveiller la {g}déformation{/g}."
      },
      {
        "kind": "heading",
        "text": "3.2 Rayonnage compartimenté",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Aussi : rayonnage à tablettes / plateaux. Marchandises de détail {g}sans{/g} palette · étagères. Pièces individuelles, petits volumes/poids. Tiroirs et bacs → nombreuses références · préparation manuelle."
      },
      {
        "kind": "heading",
        "text": "3.2.1 À étages",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Plusieurs niveaux pour optimiser l'espace. {g}ABC{/g} : rotation rapide = trajets courts ; lente = fond / haut."
      },
      {
        "kind": "heading",
        "text": "3.3 Rayonnage à palettes",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Montants + {g}traverses (lisses){/g} · palettes dessus. Souvent pas de sécurité arrière contre basculement (palette = support). Simple (contre mur) ou double (deux côtés)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Versions :{/g} charge/traverse typique 1600–1800 kg · lourds jusqu'à ~4500 kg · intérieur / extérieur (galvanisé)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Traverses :{/g} profilés tôle · goupilles anti-soulèvement fourches · charge indiquée. Montants endommagés (chariots) → capacité ↓ → {g}remplacer{/g}."
      },
      {
        "kind": "paragraph",
        "text": "{g}Accessoires :{/g} - {g}Protection antichoc{/g} (montants) - {g}Butée arrière{/g} (palettes ne passent pas derrière) - {g}Grille{/g} anti-chute (zones piétonnes derrière / sous rayonnage) - Supports pour marchandises non palettisées"
      },
      {
        "kind": "heading",
        "text": "3.4 Rayonnage drive-in",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Alternative au stockage en bloc : canaux de rayonnages continus. Palettes sur {g}profilés latéraux{/g} (pas empilées) → marchandises sensibles à la pression possibles. Remplissage d'un côté → seule l'avant accessible. Grandes quantités non empilables · {g}FIFO impossible{/g}."
      },
      {
        "kind": "heading",
        "text": "3.5 Drive-in à double entrée",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Accessible des {g}deux{/g} côtés : entrée d'un côté, sortie de l'autre → {g}FIFO{/g} possible."
      },
      {
        "kind": "heading",
        "text": "3.6 Rayonnage dynamique",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Marchandises sur plan incliné à {g}rouleaux{/g} · gravité du chargement vers le prélèvement (dynamique). Remplissage d'un côté, prélèvement de l'autre."
      },
      {
        "kind": "heading",
        "text": "3.6.1 Accumulation",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Inclinaison vers la sortie · nouvelles poussent les anciennes → {g}LIFO{/g}. Peu sensibles aux chocs, sans DLC."
      },
      {
        "kind": "heading",
        "text": "3.7 Rayonnage cantilever (porte-à-faux)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/403/commun/log-403-notions-2-v001.svg",
        "alt": "Petits articles. Cases et bacs adaptés. Unités sur palette. Alvéoles compatibles. Articles longs. Supports conçus pour eux.",
        "caption": "Utiliser une installation validée pour les caractéristiques de la charge."
      },
      {
        "kind": "paragraph",
        "text": "Pour produits {g}longs{/g} (planches, barres, tubes). Montant central + bras latéraux · accès sans traverse bloquante."
      },
      {
        "kind": "heading",
        "text": "3.7.1 Stockage horizontal auto (empileur)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Cassettes mobiles · déstockage automatique · plus coûteux."
      },
      {
        "kind": "heading",
        "text": "3.8 Étagère / casier en nid d'abeille",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Petites/moyennes quantités de marchandises longues (tunnels). Profondeur ≈ longueur (acier souvent 6 m). Plateforme mobile devant. Prélèvement main/pinces · découpe possible sur place. Profilés coupés moins visibles qu'en cantilever."
      },
      {
        "kind": "heading",
        "text": "3.9 Rayonnage mobile",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Rangées coulissantes {g}sans{/g} allées fixes → gain d'espace. Allée ouverte seulement où besoin. Sur rails · direction unique · manuel ou moteur."
      },
      {
        "kind": "paragraph",
        "text": "{g}Remarque :{/g} beaucoup de place gagnée, {g}temps d'accès élevé{/g} · quantités moyennes, {g}faible{/g} rotation."
      },
      {
        "kind": "list",
        "items": [
          "{g}Compartiments mobiles{/g} — surtout archives",
          "{g}Palettes mobiles{/g} — faible rotation · chambres froides (m³ économisés = énergie ↓)"
        ]
      },
      {
        "kind": "heading",
        "text": "3.10 Rayonnages rotatifs",
        "sub": true
      },
      {
        "kind": "heading",
        "text": "3.10.1 Verticaux (« Paternoster »)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Compartiments sur chaînes verticales · souvent fermés/verrouillables (anti-vol · valeur). Prélèvement à hauteur ergonomique · clavier. Un utilisateur à la fois."
      },
      {
        "kind": "heading",
        "text": "3.10.2 Horizontaux",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Casiers sur roulements / chaîne · « la marchandise va à l'homme »."
      },
      {
        "kind": "heading",
        "text": "3.11 Stockage suspendu",
        "sub": true
      },
      {
        "kind": "heading",
        "text": "3.11.1 Statique",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Cintres/crochets · housses · multi-niveaux avec plateformes."
      },
      {
        "kind": "heading",
        "text": "3.11.2 Dynamique",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Convoyeur horizontal (rails + chaîne) · textiles, conteneurs… Piloté par ordinateur · « marchandise vers l'homme ». Textile, boucheries industrielles, distributeurs, vestiaires événements."
      },
      {
        "kind": "heading",
        "text": "3.12 Installations modernes",
        "sub": true
      },
      {
        "kind": "heading",
        "text": "3.12.1 Navette (satellite)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Véhicule autonome pour entreposer / transférer / retirer. Petites pièces et conteneurs · volume optimisé · frigorifique jusqu'à < −30 °C."
      },
      {
        "kind": "heading",
        "text": "3.12.2 Robots de prélèvement",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Automatiques : tâche partielle ou complète. {g}Cobots{/g} (collaboratifs) · {g}AMR{/g} (autonomes dans les allées)."
      },
      {
        "kind": "heading",
        "text": "3.12.3 Hauts rayonnages (grande hauteur)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Hauteur ~{g}15–45 m{/g} · milliers à centaines de milliers d'emplacements. Fort investissement · WMS · transstockeurs. Préparation statique (homme → marchandise) ou dynamique (marchandise → homme)."
      },
      {
        "kind": "heading",
        "text": "3.12.4 Autostore",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Norvège · petites pièces · bacs empilés (sans rayonnage classique) · robots. Rotation rapide en haut, lente en bas."
      },
      {
        "kind": "paragraph",
        "text": "{g}Avantages :{/g} espace · protection (vol/poussière) · rotation ↑ · pré-ordonnancement WMS · 24/7 · extensible {g}Inconvénients :{/g} limité volume/poids (petites pièces)"
      }
    ],
    "module": "403",
    "revision": "403-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-403-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Alvéole{/g} — Emplacement formé dans un rayonnage."
      },
      {
        "kind": "paragraph",
        "text": "{g}Cantilever{/g} — Rayonnage à bras porteurs adapté notamment aux objets longs."
      },
      {
        "kind": "paragraph",
        "text": "{g}Drive-in{/g} — Rayonnage où l’accès aux unités se fait dans des canaux."
      },
      {
        "kind": "paragraph",
        "text": "{g}Emprise{/g} — Surface utilisée par une installation ou une zone."
      },
      {
        "kind": "paragraph",
        "text": "{g}Empilabilité{/g} — Possibilité d’empiler les unités selon leur état et leurs limites."
      },
      {
        "kind": "paragraph",
        "text": "{g}Rayonnage compartimenté{/g} — Structure à cases permettant de ranger des articles séparés."
      },
      {
        "kind": "paragraph",
        "text": "{g}Rayonnage dynamique{/g} — Installation où les unités avancent selon la conception du système."
      },
      {
        "kind": "paragraph",
        "text": "{g}Rayonnage mobile{/g} — Rayonnage dont les travées peuvent être déplacées pour ouvrir une allée."
      },
      {
        "kind": "paragraph",
        "text": "{g}Stockage au sol{/g} — Placement d’unités directement dans une zone de sol prévue."
      },
      {
        "kind": "paragraph",
        "text": "{g}Stockage en bloc{/g} — Rangement groupé d’unités, avec accès selon l’implantation."
      },
      {
        "kind": "paragraph",
        "text": "{g}Stockage suspendu{/g} — Forme de rangement qui maintient la marchandise suspendue."
      },
      {
        "kind": "paragraph",
        "text": "{g}Travée{/g} — Partie de rayonnage comprise entre deux montants."
      }
    ],
    "module": "403",
    "revision": "403-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-403-maths-fiche-1",
    "kind": "maths",
    "prompt": "Un rayonnage comprend six travées de quatre niveaux. Un niveau a trois places. Calculez le nombre total.",
    "answer": "72 places.",
    "calculation": "6 × 4 × 3 = 72.",
    "module": "403",
    "revision": "403-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-403-maths-fiche-2",
    "kind": "maths",
    "prompt": "Trois rangées disposent de 14, 12 et 16 places. Calculez le total.",
    "answer": "42 places.",
    "calculation": "14 + 12 + 16 = 42.",
    "module": "403",
    "revision": "403-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-403-maths-fiche-3",
    "kind": "maths",
    "prompt": "On mesure 32 m² de stockage sur une zone de 80 m². Calculez la part utilisée pour le stockage.",
    "answer": "40 %.",
    "calculation": "32 ÷ 80 × 100 = 40 %.",
    "module": "403",
    "revision": "403-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-403-maths-fiche-4",
    "kind": "maths",
    "prompt": "Sur 96 cases, 68 sont utilisées. Calculez le nombre de cases libres.",
    "answer": "28 cases.",
    "calculation": "96 − 68 = 28.",
    "module": "403",
    "revision": "403-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-403-maths-fiche-5",
    "kind": "maths",
    "prompt": "Deux aménagements offrent 72 et 90 places pour 110 m². Calculez le gain de capacité en pourcentage.",
    "answer": "25 % de places en plus.",
    "calculation": "(90 − 72) ÷ 72 × 100 = 25 %.",
    "module": "403",
    "revision": "403-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-403-verification-fiche-1",
    "kind": "verification",
    "prompt": "Quel avantage donne l’accès individuel d’un rayonnage à palettes ?",
    "answer": "On peut atteindre une unité sans déplacer systématiquement les autres.",
    "module": "403",
    "revision": "403-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-403-verification-fiche-2",
    "kind": "verification",
    "prompt": "Quels articles orientent vers un cantilever ?",
    "answer": "Les articles longs répondant aux caractéristiques et limites de l’installation.",
    "module": "403",
    "revision": "403-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-403-verification-fiche-3",
    "kind": "verification",
    "prompt": "Que limite le stockage en bloc ?",
    "answer": "L’accès individuel, quand les unités derrière ou dessous sont masquées.",
    "module": "403",
    "revision": "403-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-403-verification-fiche-4",
    "kind": "verification",
    "prompt": "Qu’est-ce qui facilite une sortie FIFO dans un rayonnage à deux faces prévu pour cela ?",
    "answer": "L’entrée et la sortie sont séparées et on peut prendre la première unité accessible selon le sens prévu.",
    "module": "403",
    "revision": "403-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-403-verification-fiche-5",
    "kind": "verification",
    "prompt": "Quelles vérifications précèdent l’affectation ?",
    "answer": "Dimensions, masse, support, état et compatibilité avec les règles d’accès.",
    "module": "403",
    "revision": "403-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-403-situation-fiche-1",
    "kind": "situation",
    "prompt": "De longs profilés ne rentrent pas dans les cases habituelles. Que faites-vous ?",
    "answer": "Chercher une zone prévue pour ces dimensions, vérifier compatibilité et limites, et faire confirmer l’affectation.",
    "module": "403",
    "revision": "403-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-403-situation-fiche-2",
    "kind": "situation",
    "prompt": "Un article à rotation élevée est derrière d’autres lots. Quelle piste d’amélioration proposez-vous ?",
    "answer": "Revoir l’accès ou l’implantation pour permettre la règle de sortie avec moins de déplacements.",
    "module": "403",
    "revision": "403-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-403-situation-fiche-3",
    "kind": "situation",
    "prompt": "La plaque de charge est illisible. Quelle suite ?",
    "answer": "Écarter la travée de l’usage concerné et demander la vérification au responsable.",
    "module": "403",
    "revision": "403-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
