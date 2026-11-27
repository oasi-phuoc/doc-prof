import type { LogistiqueUnit } from '../approved-banks'

export const module802 = [
  {
    "id": "log-802-objectifs-apercu",
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
          "Expliquer pourquoi surveiller le transport et le rôle des {g}indicateurs / enregistreurs{/g}",
          "Décrire le {g}Track & Trace{/g} (classique vs RFID) et le suivi d'un colis (statut, quittance)",
          "Appliquer le principe {g}LIFO{/g} et citer les facteurs de planification des tournées",
          "Distinguer planification {g}manuelle{/g} et {g}optimisation{/g} assistée (4 axes)"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 802",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Surveiller les conditions de transport et identifier les preuves disponibles.",
          "Lire une suite de statuts et utiliser l'identifiant d'envoi lors d'une recherche.",
          "Préparer une tournée et ordonner les unités en fonction des arrêts et des contraintes."
        ]
      }
    ],
    "module": "802",
    "revision": "802-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-802-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "2. Le transport",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "2.1 Surveillance du transport",
        "sub": true
      },
      {
        "kind": "heading",
        "text": "2.1.1 Pourquoi surveiller ?",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Contrôle sans faille des {g}conditions de transport{/g} (indicateurs + enregistreurs) jusqu'au client → détecter négligences et protéger la qualité."
      },
      {
        "kind": "paragraph",
        "text": "Pendant le trajet / stockage : chocs, chutes, dépose brutale, basculement, rupture de {g}chaîne du froid{/g}, vols… Un incident peut entraîner des coûts et dégrader la confiance. Les mesures et justificatifs documentent la réclamation; la couverture dépend du contrat et des circonstances."
      },
      {
        "kind": "paragraph",
        "text": "{g}Avantages :{/g} prescriptions contrôlables (fab. → client) · heure / lieu / responsables en cas de dommage · ↓ dommages · détection de dommages {g}cachés{/g} · ↓ réclamations / coûts."
      },
      {
        "kind": "paragraph",
        "text": "{g}Domaines :{/g} distribution · route / rail / air / mer · transitaires · manutentions internes."
      },
      {
        "kind": "heading",
        "text": "2.1.2 Indicateurs",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Types et usages → détail module {g}307{/g}."
      },
      {
        "kind": "paragraph",
        "text": "{g}Enregistreur de données de transport :{/g} mesure à intervalle défini, par exemple température et humidité, avec horodatage. Vérifier l'identification, l'emplacement, la configuration et la continuité des mesures."
      },
      {
        "kind": "heading",
        "text": "2.2 Track and Trace",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/800/802/commun/log-802-notions-1-v001.svg",
        "alt": "07 h 40. Dépôt enregistré. 11 h 10. Tri au centre. 15 h 25. Remise confirmée.",
        "caption": "Le numéro d’envoi relie les horodatages et les statuts."
      },
      {
        "kind": "paragraph",
        "text": "Suivi et {g}traçabilité{/g} d'un envoi de l'expéditeur au destinataire · avant et après livraison · utile pour améliorer l'expédition et traiter les {g}ordres de recherche{/g}."
      },
      {
        "kind": "table",
        "headers": [
          "Variante",
          "Principe"
        ],
        "rows": [
          [
            "{g}Track & Trace{/g} classique",
            "Code-barres unique scanné aux étapes clés · statut consultable (ex. « Trié pour la livraison »)"
          ],
          [
            "{g}Advanced{/g}",
            "Saisie auto via {g}RFID{/g} (moins de manuel)"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "2.2.1 Suivi d'un colis postal (ex. Poste Suisse)",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "Étape",
          "Contenu"
        ],
        "rows": [
          [
            "{g}Avis{/g}",
            "E-commerce (ex. Zalando) informe la date de livraison prévue"
          ],
          [
            "{g}Suivi{/g}",
            "Numéro d'envoi dans le service officiel du transporteur; durée d'historique et options selon la prestation."
          ],
          [
            "{g}Réception{/g}",
            "Livraison chez le client · historique via n° d'identification"
          ],
          [
            "{g}Retour{/g}",
            "Enregistrement en ligne · vendeur informé des articles attendus"
          ],
          [
            "{g}Dépôt{/g}",
            "Guichet / agence · si pas d'étiquette retour → code-barres collé au dépôt"
          ],
          [
            "{g}Quittance{/g}",
            "Récépissé avec n° = preuve de dépôt · base de {g}responsabilité{/g} (perte / dommage)"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "🔎 Track & Trace Poste : [post.ch — expédier des colis](https://www.post.ch/fr/expedier-des-colis)"
      },
      {
        "kind": "heading",
        "text": "2.2.2 Statut d'un envoi",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Selon le système, l'opérateur sélectionne ou confirme d'abord l'événement, puis lit l'identifiant de l'envoi. Le statut indique le dernier événement transmis."
      },
      {
        "kind": "paragraph",
        "text": "{g}Envois suivables (ex. Poste) :{/g}"
      },
      {
        "kind": "table",
        "headers": [
          "Type",
          "Exemples"
        ],
        "rows": [
          [
            "Express",
            "SameDay (après-midi / soir), Lune Swiss Express"
          ],
          [
            "Colis",
            "PostPac Priority / Economy, Encombrant, Promo, Vinolog, BLN…"
          ],
          [
            "Lettres",
            "Recommandée (R), actes judiciaires, A Plus, Dispomail T&T…"
          ],
          [
            "International",
            "URGENT, PRIORITY Plus, PostPac International, recommandées"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "2.3 Planification du transport",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Préparer les {g}tournées{/g} pour des véhicules à pleine capacité sur un itinéraire optimal. Objectif : {g}optimiser les coûts{/g} (énergie ↑, espace de chargement rare) + écologie — sans sacrifier {g}délais{/g} et {g}qualité{/g}."
      },
      {
        "kind": "paragraph",
        "text": "👉 Mission : coordonner tous les aspects vers des objectifs précis."
      },
      {
        "kind": "heading",
        "text": "2.3.1 Principe des tournées",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/800/802/commun/log-802-notions-2-v001.svg",
        "alt": "En vue de dessus, le compartiment contient de gauche à droite les lots C, B et A, avec la porte arrière à droite. L'ordre de déchargement est A, B puis C.",
        "caption": "Le premier lot est accessible depuis la porte. L’ordre suppose une répartition des masses et un arrimage compatibles."
      },
      {
        "kind": "paragraph",
        "text": "Itinéraire basé sur les {g}lieux de déchargement{/g} · métier des organisateurs de transport."
      },
      {
        "kind": "paragraph",
        "text": "{g}LIFO (Last-In, First-Out) :{/g} ce qui se décharge en premier se charge en {g}dernier{/g} → déchargement rationnel."
      },
      {
        "kind": "paragraph",
        "text": "{g}Facteurs d'influence :{/g} trafic / chantiers · volume / poids / MD · n° de points · capacité véhicules · priorités clients (urgence, créneau) · moyens de déchargement · temps de travail / repos chauffeurs."
      },
      {
        "kind": "paragraph",
        "text": "{g}Mise à disposition :{/g} si le chauffeur charge lui-même → préparer les unités par lieu de déchargement en zone dédiée."
      },
      {
        "kind": "heading",
        "text": "2.3.2 Planification des tournées",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Regrouper et ordonner les ordres de transport · 1 tournée ≈ 1 personne + véhicule. Ex. : filiales, courrier, déchets, personnes, DEC (réseaux réguliers). Missions : détail (palettes) · vrac · personnes."
      },
      {
        "kind": "table",
        "headers": [
          "Approche",
          "Caractéristique"
        ],
        "rows": [
          [
            "{g}Manuelle{/g}",
            "Petites entreprises · carte · peu d'optimisation des coûts"
          ],
          [
            "{g}Assistée (optimisation){/g}",
            "Modèles mathématiques adaptés / {g}paramétrés{/g} à l'entreprise"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "{g}Quatre points de l'optimisation :{/g} 1. Itinéraire optimal 2. Utilisation économique des véhicules 3. Chargement conforme et optimal 4. Transmission auto des données ({g}sans papier{/g})"
      }
    ],
    "module": "802",
    "revision": "802-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-802-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Indicateur de choc{/g} — Dispositif qui révèle le dépassement d'un seuil pendant la manutention ou le transport."
      },
      {
        "kind": "paragraph",
        "text": "{g}Enregistreur de données{/g} — Appareil qui conserve des mesures et leur horaire."
      },
      {
        "kind": "paragraph",
        "text": "{g}Chaîne du froid{/g} — Maintien des conditions de température exigées le long du trajet."
      },
      {
        "kind": "paragraph",
        "text": "{g}Statut{/g} — Événement enregistré qui renseigne sur l'étape atteinte par un envoi."
      },
      {
        "kind": "paragraph",
        "text": "{g}Track & Trace{/g} — Suivi du dernier événement connu et historique des étapes enregistrées."
      },
      {
        "kind": "paragraph",
        "text": "{g}Quittance{/g} — Justificatif délivré pour attester le dépôt ou une remise selon le cas."
      },
      {
        "kind": "paragraph",
        "text": "{g}Tournée{/g} — Suite organisée d'arrêts desservis avec un moyen de transport."
      },
      {
        "kind": "paragraph",
        "text": "{g}Créneau{/g} — Intervalle prévu ou accepté pour une livraison ou un enlèvement."
      },
      {
        "kind": "paragraph",
        "text": "{g}LIFO{/g} — Dernier chargé, premier déchargé, dans une configuration de chargement compatible."
      },
      {
        "kind": "paragraph",
        "text": "{g}Charge utile{/g} — Masse maximale de chargement admissible selon les données du véhicule et les limites applicables."
      },
      {
        "kind": "paragraph",
        "text": "{g}Arrimage{/g} — Immobilisation des marchandises contre les déplacements pendant le transport."
      },
      {
        "kind": "paragraph",
        "text": "{g}Point de passage{/g} — Lieu ou étape où l'envoi peut être identifié et enregistré."
      }
    ],
    "module": "802",
    "revision": "802-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-802-maths-fiche-1",
    "kind": "maths",
    "prompt": "Pour une tournée, les tronçons mesurent 18, 22, 9 et 16 km. Quelle distance prévoir ?",
    "answer": "65 km",
    "calculation": "18 + 22 + 9 + 16 = 65.",
    "module": "802",
    "revision": "802-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-802-maths-fiche-2",
    "kind": "maths",
    "prompt": "Vous partez à 08 h 20. Le trajet dure 36 min et le premier déchargement 14 min. À quelle heure repartez-vous du premier arrêt ?",
    "answer": "09 h 10",
    "calculation": "08 h 20 + 36 min + 14 min = 09 h 10.",
    "module": "802",
    "revision": "802-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-802-maths-fiche-3",
    "kind": "maths",
    "prompt": "Trois unités pèsent 340, 265 et 290 kg. La charge utile donnée est 950 kg. Calculez la marge de masse.",
    "answer": "55 kg",
    "calculation": "950 − (340 + 265 + 290) = 55.",
    "module": "802",
    "revision": "802-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-802-maths-fiche-4",
    "kind": "maths",
    "prompt": "L'indicateur doit signaler une température au-dessus de 8 °C. Le maximum mesuré est 10,5 °C. Quel dépassement notez-vous ?",
    "answer": "2,5 °C",
    "calculation": "10,5 − 8 = 2,5.",
    "module": "802",
    "revision": "802-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-802-maths-fiche-5",
    "kind": "maths",
    "prompt": "Sur 80 livraisons, 74 respectent leur créneau. Quel taux est obtenu au dixième ?",
    "answer": "92,5 %",
    "calculation": "74 ÷ 80 × 100 = 92,5.",
    "module": "802",
    "revision": "802-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-802-maths-fiche-6",
    "kind": "maths",
    "prompt": "Une optimisation fait passer une tournée de 160 à 136 km. Calculez le gain relatif en kilomètres.",
    "answer": "15 %",
    "calculation": "(160 − 136) ÷ 160 × 100 = 15.",
    "module": "802",
    "revision": "802-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-802-verification-fiche-1",
    "kind": "verification",
    "prompt": "Quelle différence distingue un indicateur à seuil d'un enregistreur de données ?",
    "answer": "L'indicateur signale un dépassement; l'enregistreur permet de relire une série de valeurs et leurs horaires.",
    "module": "802",
    "revision": "802-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-802-verification-fiche-2",
    "kind": "verification",
    "prompt": "Que prouve la quittance remise lors d'un dépôt ?",
    "answer": "Le dépôt enregistré de l'envoi selon les données portées sur la quittance.",
    "module": "802",
    "revision": "802-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-802-verification-fiche-3",
    "kind": "verification",
    "prompt": "Pourquoi le dernier statut ne donne-t-il pas toujours la position actuelle ?",
    "answer": "Il décrit le dernier événement enregistré; aucun autre événement n'a peut-être encore été transmis.",
    "module": "802",
    "revision": "802-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-802-verification-fiche-4",
    "kind": "verification",
    "prompt": "Quel ordre de chargement convient à A, B puis C avec un seul accès arrière et sans autre contrainte ?",
    "answer": "Charger C, puis B, puis A pour accéder à A en premier.",
    "module": "802",
    "revision": "802-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-802-verification-fiche-5",
    "kind": "verification",
    "prompt": "Citez deux contraintes à contrôler avant de valider la tournée.",
    "answer": "Par exemple les créneaux, les accès, le poids, le volume, l'arrimage et les temps de travail.",
    "module": "802",
    "revision": "802-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-802-situation-fiche-1",
    "kind": "situation",
    "prompt": "Un envoi froid est livré avec un indicateur déclenché. Décrivez la marche à suivre.",
    "answer": "Isoler selon la procédure, relever l'identifiant et la mesure, préserver la preuve et demander la décision du responsable qualité.",
    "module": "802",
    "revision": "802-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-802-situation-fiche-2",
    "kind": "situation",
    "prompt": "Pour un colis, le suivi s'arrête au tri de départ. Préparez une demande de recherche.",
    "answer": "Rassembler numéro d'envoi, date et quittance, dernier statut et informations utiles de remise, puis contacter le canal désigné.",
    "module": "802",
    "revision": "802-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-802-situation-fiche-3",
    "kind": "situation",
    "prompt": "Le premier client impose un créneau étroit et la charge la plus lourde est destinée au dernier. Que contrôlez-vous ?",
    "answer": "Vérifier le créneau, la répartition des masses, l'accès et l'arrimage; ajuster l'ordre ou le véhicule avec le répartiteur si les contraintes sont incompatibles.",
    "module": "802",
    "revision": "802-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
