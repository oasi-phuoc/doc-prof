import type { LogistiqueUnit } from '../approved-banks'

export const module403 = [
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
        "src": "/assets/logistique/400/403/commun/log-403-sol-photo-v003.webp",
        "alt": "Des charges palettisées sont empilées au sol dans une zone sans rayonnage.",
        "caption": "Les supports reposent au sol. Un empilage exige des unités adaptées, une stabilité suffisante et le respect des limites."
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
        "kind": "image",
        "src": "/assets/logistique/400/403/commun/log-403-drivein-photo-v003.webp",
        "alt": "Des palettes sont entreposées en profondeur sur les rails porteurs d’une travée drive-in.",
        "caption": "Dans un drive-in, repérez les rails porteurs et la profondeur de la travée. Vérifiez le sens d’accès prévu."
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
        "kind": "image",
        "src": "/assets/logistique/400/406/commun/log-406-fifo-photo-v002.webp",
        "alt": "Des cartons avancent dans des pistes inclinées équipées de rouleaux.",
        "caption": "Dans le rayonnage dynamique, le côté de chargement et le côté de prélèvement sont distincts."
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
        "src": "/assets/logistique/400/403/commun/log-403-rayonnages-photo-v002.webp",
        "alt": "Un rayonnage à palettes se trouve à côté d’un cantilever portant des planches.",
        "caption": "Le cantilever porte les marchandises longues sur des bras sans montant en façade."
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
        "kind": "image",
        "src": "/assets/logistique/400/403/commun/log-403-nid-photo-v003.webp",
        "alt": "Un casier en nid d’abeille sépare des tubes rangés à l’horizontale.",
        "caption": "Les tubes sont séparés par casier. L’opérateur reconnaît leur famille quand il voit leur extrémité."
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
        "kind": "image",
        "src": "/assets/logistique/400/403/commun/log-403-mobile-photo-v003.webp",
        "alt": "Des rangées de rayonnages sur rails ménagent une seule allée de travail.",
        "caption": "Les bases mobiles sur rails dégagent l’allée nécessaire et rapprochent les autres rangées."
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
        "kind": "image",
        "src": "/assets/logistique/400/403/commun/log-403-rotatif-photo-v003.webp",
        "alt": "Une machine de stockage présente une petite boîte à l’ouverture du poste.",
        "caption": "Le magasin rotatif apporte le compartiment au poste de prélèvement."
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
        "kind": "image",
        "src": "/assets/logistique/400/403/commun/log-403-suspendu-photo-v003.webp",
        "alt": "Des vestes de travail sous housse sont suspendues à un rail.",
        "caption": "Le rail porte les cintres. Les vêtements restent suspendus pendant le stockage ou le déplacement."
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
        "kind": "image",
        "src": "/assets/logistique/400/409/commun/log-409-autostore-photo-v003.webp",
        "alt": "Des robots orange se déplacent sur une grille au-dessus de rangées de bacs.",
        "caption": "Les robots se déplacent au-dessus des bacs. Le poste reçoit le bac demandé pour préparer la commande."
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
    "summaryBlocks": [
      {
        "kind": "heading",
        "text": "3. Les formes de stockage",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "3.1 à 3.3 Stockage au sol et rayonnages",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/403/commun/log-403-sol-photo-v003.webp",
        "alt": "Des charges palettisées sont empilées au sol dans une zone sans rayonnage.",
        "caption": "Les supports reposent au sol. Un empilage exige des unités adaptées, une stabilité suffisante et le respect des limites."
      },
      {
        "kind": "paragraph",
        "text": "Le {g}stockage au sol{/g} place les supports directement sur la surface. L’empilage exige des charges adaptées, une pile stable et des limites de hauteur ou de masse. Le {g}rayonnage compartimenté{/g} donne un accès précis à de petits articles. Le {g}rayonnage à palettes{/g} reçoit des charges unitaires sur des niveaux définis."
      },
      {
        "kind": "heading",
        "text": "3.4 à 3.6 Stockage compact et dynamique",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/403/commun/log-403-drivein-photo-v003.webp",
        "alt": "Des palettes sont entreposées en profondeur sur les rails porteurs d’une travée drive-in.",
        "caption": "Dans un drive-in, repérez les rails porteurs et la profondeur de la travée. Vérifiez le sens d’accès prévu."
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/406/commun/log-406-fifo-photo-v002.webp",
        "alt": "Des cartons avancent dans des pistes inclinées équipées de rouleaux.",
        "caption": "Dans le rayonnage dynamique, le côté de chargement et le côté de prélèvement sont distincts."
      },
      {
        "kind": "paragraph",
        "text": "En {g}drive-in{/g}, le chariot entre dans une travée de stockage. Une seule entrée favorise souvent le {g}LIFO{/g}. Un {g}drive-through{/g} à deux accès permet d’organiser une entrée et une sortie distinctes. Dans un {g}rayonnage dynamique{/g}, les unités avancent sur des rouleaux d’un côté à l’autre et peuvent suivre le {g}FIFO{/g}."
      },
      {
        "kind": "heading",
        "text": "3.7 Rayonnage cantilever (porte-à-faux)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/403/commun/log-403-rayonnages-photo-v002.webp",
        "alt": "Un rayonnage à palettes se trouve à côté d’un cantilever portant des planches.",
        "caption": "Le cantilever porte les marchandises longues sur des bras sans montant en façade."
      },
      {
        "kind": "paragraph",
        "text": "Le {g}cantilever{/g} porte du bois, des tubes ou des profilés sur des bras. Sa façade est dégagée pour les marchandises longues. Vérifiez longueur, masse, répartitions et prescriptions de chargement."
      },
      {
        "kind": "heading",
        "text": "3.8 à 3.12 Autres installations",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/403/commun/log-403-nid-photo-v003.webp",
        "alt": "Un casier en nid d’abeille sépare des tubes rangés à l’horizontale.",
        "caption": "Les tubes sont séparés par casier. L’opérateur reconnaît leur famille quand il voit leur extrémité."
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/403/commun/log-403-mobile-photo-v003.webp",
        "alt": "Des rangées de rayonnages sur rails ménagent une seule allée de travail.",
        "caption": "Les bases mobiles sur rails dégagent l’allée nécessaire et rapprochent les autres rangées."
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/403/commun/log-403-rotatif-photo-v003.webp",
        "alt": "Une machine de stockage présente une petite boîte à l’ouverture du poste.",
        "caption": "Le magasin rotatif apporte le compartiment au poste de prélèvement."
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/403/commun/log-403-suspendu-photo-v003.webp",
        "alt": "Des vestes de travail sous housse sont suspendues à un rail.",
        "caption": "Le rail porte les cintres. Les vêtements restent suspendus pendant le stockage ou le déplacement."
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/409/commun/log-409-autostore-photo-v003.webp",
        "alt": "Des robots orange se déplacent sur une grille au-dessus de rangées de bacs.",
        "caption": "Les robots se déplacent au-dessus des bacs. Le poste reçoit le bac demandé pour préparer la commande."
      },
      {
        "kind": "paragraph",
        "text": "Le casier {g}en nid d’abeille{/g} sépare les articles longs ou les unités selon les compartiments. Le {g}rayonnage mobile{/g} déplace les rangées pour ouvrir l’allée utile. Un {g}rayonnage rotatif{/g} apporte le compartiment au poste. Le {g}stockage suspendu{/g} porte par exemple des vêtements. Les installations modernes peuvent apporter les articles sur commande avec un {g}transstockeur{/g} ou un système à bacs."
      }
    ],
    "module": "403",
    "revision": "403-v003",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
