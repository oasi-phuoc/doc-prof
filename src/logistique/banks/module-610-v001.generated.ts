import type { LogistiqueUnit } from '../approved-banks'

export const module610 = [
  {
    "id": "log-610-objectifs-apercu",
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
          "Expliquer le {g}transport combiné{/g} et le rôle des {g}interfaces{/g}",
          "Distinguer ferroutage {g}accompagné{/g} (ROLA) et {g}non accompagné{/g}",
          "Décrire les conteneurs {g}ISO{/g} (20'/40', types) et leur intérêt",
          "Comparer {g}ACTS{/g}, caisses mobiles, {g}Cargo Domino{/g} et situer {g}CST{/g}"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 610",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Comparer le parcours combiné à un trajet utilisant un seul mode.",
          "Identifier les unités compatibles et la fonction du transbordement.",
          "Suivre les correspondances en conservant la référence de l’unité."
        ]
      }
    ],
    "module": "610",
    "revision": "610-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-610-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "10. Le transport combiné",
        "sub": false
      },
      {
        "kind": "paragraph",
        "text": "Plusieurs modes de transport interagissent. Véhicules, semi-remorques, caisses mobiles ou {g}conteneurs{/g} passent d'un mode à l'autre sans grand effort via des {g}interfaces{/g} :"
      },
      {
        "kind": "list",
        "items": [
          "Gares de marchandises (rail/route)",
          "Terminaux à conteneurs (rail/route)",
          "Centres de tri courrier/colis (rail/route)",
          "Installations portuaires (eau/rail/route)",
          "Aéroports (air/route/rail)"
        ]
      },
      {
        "kind": "paragraph",
        "text": "Aux interfaces : {g}entrepôts de transbordement{/g} (module {g}402{/g}) — reconditionnement, tri, stock temporaire, contrôles, dédouanement."
      },
      {
        "kind": "paragraph",
        "text": "👉 Combiner = profiter des atouts de chaque mode · contourner les inconvénients · viser la combinaison {g}optimale{/g}. {g}Ex.{/g} Zurich Aéroport : air + route + rail."
      },
      {
        "kind": "heading",
        "text": "10.1 Chaussée roulante (ROLA)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Ferroutage accompagné{/g} : camion sur wagon à plancher bas · chauffeur dans voiture-couchette · reprend le véhicule à destination. Dès {g}1968{/g} en CH · {g}Hupac{/g} · ~100 trains/jour · (ex. 2011 : 724 000 envois routiers)."
      },
      {
        "kind": "heading",
        "text": "10.1.1 Ferroutage non accompagné",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Tracteur laisse la {g}semi-remorque{/g} au terminal · remorque voyage seule · reprise par un tracteur à destination (chauffeur + tracteur nécessaires)."
      },
      {
        "kind": "heading",
        "text": "10.2 Conteneurs ISO",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/610/commun/log-610-notions-1-v001.svg",
        "alt": "Collecte. Trajet routier local. Liaison. Rail ou voie navigable. Desserte. Fin du trajet.",
        "caption": "L’identité de l’unité suit les étapes, sous réserve de compatibilité."
      },
      {
        "kind": "paragraph",
        "text": "Dimensions normalisées → multi-modes sans déchargement intermédiaire · sécurité (fermeture / scellés). Origine US {g}1956{/g} · mesures en {g}pieds{/g} (1 pied = {g}30,48 cm{/g}). Courants : {g}20'{/g} et {g}40'{/g} (grands / maritimes)."
      },
      {
        "kind": "table",
        "headers": [
          "",
          "20'",
          "40'"
        ],
        "rows": [
          [
            "L ext.",
            "6,058 m",
            "12,192 m"
          ],
          [
            "l / H ext.",
            "2,438 / 2,591 m",
            "idem"
          ],
          [
            "Volume",
            "~33,2 m³",
            "~67,7 m³"
          ],
          [
            "Vide / utile / total",
            "2250 / 21 750 / {g}24 000{/g} kg",
            "3780 / 26 700 / {g}30 480{/g} kg"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "Types : fermé (le plus fréquent · étanche pour pont navire) · porte frontale / latérale · frigo · parois amovibles · {g}High-Cube{/g} · toit ouvert · citerne…"
      },
      {
        "kind": "paragraph",
        "text": "👉 Incontournables dans un monde globalisé."
      },
      {
        "kind": "heading",
        "text": "10.3 Autres systèmes d'échange",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/610/commun/log-610-notions-2-v001.svg",
        "alt": "Unité. Type et identification. Terminal. Équipement et créneau. Suite. Mode et destination.",
        "caption": "Chaque mode doit accepter la même unité selon son dossier."
      },
      {
        "kind": "heading",
        "text": "10.3.1 ACTS",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "*Abroll-Container-Transport-Service* (1988) · conteneur avec {g}roulettes{/g} + {g}crochet{/g} · dépôt au sol / bascule par camion spécial · papier, gravats, déchets… Sur rail : châssis {g}pivotant{/g} sur wagon → pivot + verrouillage · à destination pivot externe → tirage sur camion."
      },
      {
        "kind": "heading",
        "text": "10.3.2 Caisses / conteneurs interchangeables",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Normalisés comme ISO · reposent sur {g}supports rabattables{/g}. Camion sous la caisse · suspensions pneumatiques · béquilles rabattues · grue pour mise sur wagon."
      },
      {
        "kind": "heading",
        "text": "10.3.3 Cargo Domino",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Rail/route · caisses adaptées camion + wagon · profilé transversal · {g}pas de rotation{/g} · camion à côté · poussée {g}perpendiculaire{/g} sur le wagon."
      },
      {
        "kind": "heading",
        "text": "10.3.4 Combinaison route–rail",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Nuit : rail vers centres régionaux · jour : distribution camion · soir : recollecte palettes → wagons."
      },
      {
        "kind": "heading",
        "text": "10.3.5 Cargo Sous Terrain (CST)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Tunnels souterrains · désengorger les routes · ~{g}30 km/h{/g} constant · 1er tronçon Härkingen–Niederbipp → Zurich prévu {g}2031{/g}."
      }
    ],
    "module": "610",
    "revision": "610-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-610-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Conteneur ISO{/g} — Conteneur répondant aux caractéristiques normalisées de la famille considérée."
      },
      {
        "kind": "paragraph",
        "text": "{g}Caisse mobile{/g} — Unité conçue pour les moyens et transferts spécifiés."
      },
      {
        "kind": "paragraph",
        "text": "{g}Chaussée roulante{/g} — Organisation qui transporte des véhicules routiers sur une liaison ferroviaire prévue."
      },
      {
        "kind": "paragraph",
        "text": "{g}Correspondance{/g} — Passage prévu vers le mode ou trajet suivant."
      },
      {
        "kind": "paragraph",
        "text": "{g}Desserte locale{/g} — Collecte ou livraison dans le périmètre proche d’un terminal."
      },
      {
        "kind": "paragraph",
        "text": "{g}Envoi accompagné{/g} — Transport où la présence d’un conducteur suit les conditions du service."
      },
      {
        "kind": "paragraph",
        "text": "{g}Interface{/g} — Point où deux modes ou opérations se raccordent."
      },
      {
        "kind": "paragraph",
        "text": "{g}Intermodal{/g} — Utilisant plusieurs modes avec la même unité de chargement selon l’organisation."
      },
      {
        "kind": "paragraph",
        "text": "{g}Terminal{/g} — Site où les unités sont prises en charge ou transférées."
      },
      {
        "kind": "paragraph",
        "text": "{g}Transport combiné{/g} — Organisation recourant à plusieurs modes, notamment une liaison principale et des dessertes routières."
      },
      {
        "kind": "paragraph",
        "text": "{g}Transbordement{/g} — Transfert d’une unité entre moyens de transport."
      },
      {
        "kind": "paragraph",
        "text": "{g}UTI{/g} — Unité de transport intermodal."
      }
    ],
    "module": "610",
    "revision": "610-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-610-maths-fiche-1",
    "kind": "maths",
    "prompt": "La collecte fait 34 km, la liaison rail 190 km et la desserte 26 km. Calculez le total.",
    "answer": "250 km.",
    "calculation": "34 + 190 + 26 = 250 km.",
    "module": "610",
    "revision": "610-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-610-maths-fiche-2",
    "kind": "maths",
    "prompt": "Un parcours direct utilise 240 km de route. Le parcours combiné utilise 69 km de route. Calculez la différence routière.",
    "answer": "171 km de route en moins.",
    "calculation": "240 − 69 = 171 km.",
    "module": "610",
    "revision": "610-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-610-maths-fiche-3",
    "kind": "maths",
    "prompt": "Une unité doit rejoindre un départ à 16 h 40. Le transfert dure 55 min. À quelle heure doit-il commencer au plus tard ?",
    "answer": "À 15 h 45.",
    "calculation": "16 h 40 − 55 min = 15 h 45.",
    "module": "610",
    "revision": "610-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-610-maths-fiche-4",
    "kind": "maths",
    "prompt": "Le terminal traite 15 unités par heure pendant 2 h 30. Combien d’unités complètes peut-il traiter à ce rythme ?",
    "answer": "37 unités complètes.",
    "calculation": "15 × 2,5 = 37,5. Retenir 37.",
    "module": "610",
    "revision": "610-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-610-maths-fiche-5",
    "kind": "maths",
    "prompt": "Trois postes coûtent 160, 220 et 90 CHF dans un scénario combiné. Comparez leur somme à un trajet direct à 520 CHF.",
    "answer": "470 CHF, soit 50 CHF de moins.",
    "calculation": "160 + 220 + 90 = 470. 520 − 470 = 50 CHF.",
    "module": "610",
    "revision": "610-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-610-verification-fiche-1",
    "kind": "verification",
    "prompt": "Quel est l’intérêt d’une unité intermodale ?",
    "answer": "Elle peut passer entre des moyens compatibles avec un suivi continu de l’identifiant.",
    "module": "610",
    "revision": "610-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-610-verification-fiche-2",
    "kind": "verification",
    "prompt": "Quel rôle joue le terminal ?",
    "answer": "Il organise la remise, le séjour et le transfert entre étapes du réseau.",
    "module": "610",
    "revision": "610-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-610-verification-fiche-3",
    "kind": "verification",
    "prompt": "Que distingue la chaussée roulante d’un transfert de seul conteneur ?",
    "answer": "Elle prend en charge le véhicule routier prévu par le service.",
    "module": "610",
    "revision": "610-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-610-verification-fiche-4",
    "kind": "verification",
    "prompt": "Pourquoi comparer séparément les kilomètres routiers ?",
    "answer": "Pour mesurer la part de trajet routier même si le parcours total est différent.",
    "module": "610",
    "revision": "610-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-610-verification-fiche-5",
    "kind": "verification",
    "prompt": "Quelles données vérifier pour une correspondance ?",
    "answer": "Heures, unité, statut, destination et contraintes de la liaison.",
    "module": "610",
    "revision": "610-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-610-situation-fiche-1",
    "kind": "situation",
    "prompt": "L’unité arrive trop tard pour le train prévu. Quelle action coordonnez-vous ?",
    "answer": "Vérifier l’option autorisée de report et actualiser les étapes et conditions de séjour.",
    "module": "610",
    "revision": "610-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-610-situation-fiche-2",
    "kind": "situation",
    "prompt": "L’équipement de transfert annoncé n’est pas compatible. Que faites-vous ?",
    "answer": "Arrêter le traitement, identifier la référence et demander une solution validée.",
    "module": "610",
    "revision": "610-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-610-situation-fiche-3",
    "kind": "situation",
    "prompt": "Le client compare un service direct et un service combiné. Quels éléments présentez-vous ?",
    "answer": "Le coût complet, les délais, les transferts, le service et les hypothèses comparables.",
    "module": "610",
    "revision": "610-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
