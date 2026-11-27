import type { LogistiqueUnit } from '../approved-banks'

export const module404 = [
  {
    "id": "log-404-objectifs-apercu",
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
          "Distinguer entrepôts {g}ouverts{/g}, {g}couverts{/g} et {g}fermés{/g}",
          "Situer les entrepôts selon leur {g}hauteur{/g} et les engins associés",
          "Comparer structures {g}mécanisées{/g}, {g}automatiques{/g} et {g}complexes{/g}",
          "Appliquer les principes de {g}propreté{/g}, {g}spaciosité{/g} et {g}netteté{/g} (zones, marquage, localisation)"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 404",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Choisir le niveau de protection du bâtiment selon la marchandise.",
          "Relier la structure, la hauteur et les flux à la conception du dépôt.",
          "Vérifier les conditions de disponibilité, propreté et identification."
        ]
      }
    ],
    "module": "404",
    "revision": "404-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-404-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "4. Prescriptions de stockage",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "4.1 Entrepôts ouverts, couverts, fermés",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/404/commun/log-404-notions-1-v001.svg",
        "alt": "Ouvert. Exposition extérieure. Couvert. Protection partielle. Fermé. Conditions mieux maîtrisées.",
        "caption": "Les exigences du produit orientent le choix de la zone."
      },
      {
        "kind": "heading",
        "text": "4.1.1 À ciel ouvert",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Biens {g}insensibles{/g} aux intempéries et peu exposés au vol. Terrain accessible, souvent clôturé."
      },
      {
        "kind": "paragraph",
        "text": "Ex. : citernes · vrac (charbon, sable, gravier) · bois non transformé · ciment durci · containers · tubes béton en bloc."
      },
      {
        "kind": "heading",
        "text": "4.1.2 Couverts (semi-ouverts)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Toit, {g}ouverts{/g} sur les côtés. Protection soleil/pluie ; insensibles aux variations T°/humidité ; peu de risque de vol."
      },
      {
        "kind": "paragraph",
        "text": "Ex. : engins de chantier · tubes acier · planches brutes · palettes vides · tuiles/briques."
      },
      {
        "kind": "heading",
        "text": "4.1.3 Fermés",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Marchandises sensibles aux intempéries ou au vol. Un ou plusieurs étages · murs + toit. Hauts rayonnages : souvent {g}structure de stockage d'abord{/g}, puis enveloppe du bâtiment."
      },
      {
        "kind": "heading",
        "text": "4.2 Hauteurs d'entrepôt",
        "sub": true
      },
      {
        "kind": "heading",
        "text": "4.2.1 Faible hauteur",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Stockage au sol · chariots conventionnels (mâts ~{g}7 m{/g}). Courant en {g}PME{/g} · peu coûteux · rayonnages dans locaux existants."
      },
      {
        "kind": "heading",
        "text": "4.2.2 Moyenne hauteur",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Jusqu'à ~{g}15 m{/g} · locaux existants souvent ≤ 7 m → nouvelles infrastructures. Engins adaptés : chariots pour rayonnages hauts / allées étroites / mât rétractable / {g}transstockeurs{/g}."
      },
      {
        "kind": "heading",
        "text": "4.2.3 Grande hauteur (MGH)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Jusqu'à ~{g}45 m{/g} · rares en Suisse. Pas de chariots libres traditionnels → systèmes de stockage {g}complexes{/g}."
      },
      {
        "kind": "heading",
        "text": "4.3 Structure de l'entrepôt",
        "sub": true
      },
      {
        "kind": "heading",
        "text": "4.3.1 Mécanisés",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Rayonnages moyens / hauts + {g}transstockeurs à conducteur{/g}. Efficaces pour nombreux articles en petites quantités. Souvent 1 appareil / allée (changement d'allée rare)."
      },
      {
        "kind": "heading",
        "text": "4.3.2 Automatiques",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Matériel + {g}logiciels{/g} · supervision humaine (dysfonctionnements). Accès restreint — danger {g}mortel{/g} si entrée non autorisée. Transstockeurs commandés par ordinateur (entrée via convoyeurs / sortie via WMS)."
      },
      {
        "kind": "heading",
        "text": "4.3.3 Systèmes complexes",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Éléments en réseau : déchargement/chargement · stockage statique/dynamique · convoyeurs continus (bande, rouleaux) · discontinus (chariots, AGV, transstockeurs, monte-charge) · picking · emballage."
      },
      {
        "kind": "paragraph",
        "text": "Défi : harmoniser les performances · une panne ne doit pas tout arrêter."
      },
      {
        "kind": "heading",
        "text": "4.4 Conditions pour un stockage optimal",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/404/commun/log-404-notions-2-v001.svg",
        "alt": "Conditions. Produit et environnement. Accès. Repères et circulation. Suivi. Contrôles et état de stock.",
        "caption": "L’emplacement doit être compatible et correctement enregistré."
      },
      {
        "kind": "paragraph",
        "text": "Stockage professionnel = conservation {g}ordonnée{/g}. Trois principes :"
      },
      {
        "kind": "heading",
        "text": "4.4.1 Propreté",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Locaux, installations, outils, marchandises, voies."
      },
      {
        "kind": "paragraph",
        "text": "Avantages : moins d'accidents · durabilité des équipements · satisfaction collaborateurs · image · moins de pertes/dégradations."
      },
      {
        "kind": "heading",
        "text": "4.4.2 Spaciosité",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Assez d'espace → manutention optimale · entrées/sorties plus rapides · moins de recherches/déplacements inutiles · moins d'accidents."
      },
      {
        "kind": "heading",
        "text": "4.4.3 Netteté (clarté)",
        "sub": true
      },
      {
        "kind": "list",
        "items": [
          "{g}Zones{/g} : entrée → sortie (+ secteurs selon entreprise)",
          "{g}Zones de stockage{/g} : volume, rotation, valeur, périssabilité, dangerosité…",
          "{g}Marquage / étiquetage{/g} : vue d'ensemble du transit interne",
          "{g}N° d'articles{/g} : identification, information, contrôle, classification",
          "{g}Localisation{/g} : attribution à un emplacement · base de la gestion informatisée · évite recherches et trajets à vide"
        ]
      }
    ],
    "module": "404",
    "revision": "404-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-404-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Accès{/g} — Moyen autorisé d’atteindre une zone ou un emplacement."
      },
      {
        "kind": "paragraph",
        "text": "{g}Condition de stockage{/g} — Exigence applicable au séjour d’un bien."
      },
      {
        "kind": "paragraph",
        "text": "{g}Entrepôt fermé{/g} — Bâtiment qui protège les zones stockées de l’extérieur."
      },
      {
        "kind": "paragraph",
        "text": "{g}Entrepôt couvert{/g} — Structure équipée d’une couverture, avec un degré de protection défini."
      },
      {
        "kind": "paragraph",
        "text": "{g}Entrepôt ouvert{/g} — Zone de stockage exposée à l’extérieur selon sa conception."
      },
      {
        "kind": "paragraph",
        "text": "{g}Hauteur utile{/g} — Hauteur exploitable dans les limites et dégagements prescrits."
      },
      {
        "kind": "paragraph",
        "text": "{g}Identification{/g} — Attribution d’une référence permettant de distinguer une unité ou zone."
      },
      {
        "kind": "paragraph",
        "text": "{g}Infrastructure{/g} — Bâtiment, voies et équipements fixes nécessaires à l’exploitation."
      },
      {
        "kind": "paragraph",
        "text": "{g}Marquage{/g} — Repère visuel d’une zone, d’une direction ou d’une limite."
      },
      {
        "kind": "paragraph",
        "text": "{g}Stockage automatisé{/g} — Organisation dans laquelle certaines opérations sont pilotées par des équipements automatisés."
      },
      {
        "kind": "paragraph",
        "text": "{g}Ventilation{/g} — Renouvellement ou mouvement d’air selon la conception du bâtiment."
      },
      {
        "kind": "paragraph",
        "text": "{g}Zone de stockage{/g} — Espace affecté à des articles dont les conditions sont compatibles."
      }
    ],
    "module": "404",
    "revision": "404-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-404-maths-fiche-1",
    "kind": "maths",
    "prompt": "Une zone couverte mesure 12 m sur 8 m. Calculez sa surface.",
    "answer": "96 m².",
    "calculation": "12 × 8 = 96 m².",
    "module": "404",
    "revision": "404-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-404-maths-fiche-2",
    "kind": "maths",
    "prompt": "Une zone a 22 positions. Dix-huit sont affectées. Combien sont disponibles ?",
    "answer": "Quatre positions.",
    "calculation": "22 − 18 = 4.",
    "module": "404",
    "revision": "404-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-404-maths-fiche-3",
    "kind": "maths",
    "prompt": "Sur trois espaces de 25 m², un est réservé aux contrôles. Calculez la surface des deux autres.",
    "answer": "50 m².",
    "calculation": "(3 − 1) × 25 = 50 m².",
    "module": "404",
    "revision": "404-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-404-maths-fiche-4",
    "kind": "maths",
    "prompt": "Un relevé fictif est effectué toutes les 4 heures durant 24 heures. Combien de périodes s’écoulent ?",
    "answer": "Six périodes.",
    "calculation": "24 ÷ 4 = 6.",
    "module": "404",
    "revision": "404-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-404-maths-fiche-5",
    "kind": "maths",
    "prompt": "Une zone de 60 m² a une hauteur utile de 3,2 m. Quel est son volume géométrique utile ?",
    "answer": "192 m³.",
    "calculation": "60 × 3,2 = 192 m³.",
    "module": "404",
    "revision": "404-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-404-verification-fiche-1",
    "kind": "verification",
    "prompt": "Que protège généralement un toit ?",
    "answer": "Les biens des précipitations directes, dans les limites de la conception.",
    "module": "404",
    "revision": "404-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-404-verification-fiche-2",
    "kind": "verification",
    "prompt": "Pourquoi un local fermé peut-il être nécessaire ?",
    "answer": "Pour maîtriser accès et conditions, par exemple lorsqu’une marchandise est sensible.",
    "module": "404",
    "revision": "404-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-404-verification-fiche-3",
    "kind": "verification",
    "prompt": "Quel est le rôle du marquage ?",
    "answer": "Aider à reconnaître voies, zones et emplacements.",
    "module": "404",
    "revision": "404-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-404-verification-fiche-4",
    "kind": "verification",
    "prompt": "Pourquoi vérifier la hauteur utile ?",
    "answer": "Elle résulte des contraintes et dégagements et peut être inférieure à la hauteur du bâtiment.",
    "module": "404",
    "revision": "404-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-404-verification-fiche-5",
    "kind": "verification",
    "prompt": "Qui autorise une intervention dans une installation automatisée ?",
    "answer": "Le poste ou personnel habilité selon la procédure.",
    "module": "404",
    "revision": "404-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-404-situation-fiche-1",
    "kind": "situation",
    "prompt": "Un produit sensible à l’humidité arrive et aucune zone adaptée n’est libre. Que faites-vous ?",
    "answer": "Signaler la contrainte et faire affecter une zone compatible avant le rangement.",
    "module": "404",
    "revision": "404-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-404-situation-fiche-2",
    "kind": "situation",
    "prompt": "La position dans le système est valide, mais la zone est encombrée. Décrivez la suite.",
    "answer": "Maintenir l’accès dégagé, demander une autre affectation et enregistrer le choix confirmé.",
    "module": "404",
    "revision": "404-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-404-situation-fiche-3",
    "kind": "situation",
    "prompt": "Une mesure de condition dépasse la limite du dossier. Que consignez-vous ?",
    "answer": "Lieu, moment, mesure, lot concerné et alerte selon le plan prévu.",
    "module": "404",
    "revision": "404-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
