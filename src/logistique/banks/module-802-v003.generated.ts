import type { LogistiqueUnit } from '../approved-banks'

export const module802 = [
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
        "kind": "image",
        "src": "/assets/logistique/800/802/commun/log-802-mesure-photo-v002.webp",
        "alt": "Un enregistreur de température est vérifié à côté d’un bac isolé.",
        "caption": "Un enregistreur garde une suite de mesures datées. Rattachez les résultats à l’envoi."
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
        "src": "/assets/logistique/300/303/commun/log-303-quai-photo-v002.webp",
        "alt": "Au quai, une équipe rapproche des unités des documents de réception.",
        "caption": "Le statut indique quel événement a été enregistré pour l’unité identifiée."
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
        "kind": "image",
        "src": "/assets/logistique/800/801/commun/log-801-etiquette-photo-v002.webp",
        "alt": "Une étiquette logistique est placée à plat sur une palette filmée près d’un lecteur.",
        "caption": "Un scan associe un événement à un envoi. Le dernier statut correspond au dernier événement transmis."
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
        "src": "/assets/logistique/800/802/commun/log-802-lifo-tournee-schema-v002.webp",
        "alt": "Compartiment de véhicule vu de dessus, lots C, B et A de gauche à droite. Le lot A est près de la porte arrière.",
        "caption": "Le premier lot à livrer reste près de la porte. Vérifiez la charge, les accès et l’arrimage avant de retenir cet ordre."
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
    "summaryBlocks": [
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
        "kind": "image",
        "src": "/assets/logistique/800/802/commun/log-802-mesure-photo-v002.webp",
        "alt": "Un enregistreur de température est vérifié à côté d’un bac isolé.",
        "caption": "Un enregistreur garde une suite de mesures datées. Rattachez les résultats à l’envoi."
      },
      {
        "kind": "paragraph",
        "text": "Un {g}indicateur{/g} signale par exemple un choc, un basculement ou un dépassement. Un {g}enregistreur{/g} garde plusieurs mesures horodatées. Pour la {g}chaîne du froid{/g}, comparez les mesures aux conditions prévues pour la marchandise et signalez l’écart selon la procédure."
      },
      {
        "kind": "heading",
        "text": "2.2 Track and Trace",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/800/801/commun/log-801-etiquette-photo-v002.webp",
        "alt": "Une étiquette logistique est placée à plat sur une palette filmée près d’un lecteur.",
        "caption": "Un scan associe un événement à un envoi. Le dernier statut correspond au dernier événement transmis."
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/303/commun/log-303-quai-photo-v002.webp",
        "alt": "Au quai, une équipe rapproche des unités des documents de réception.",
        "caption": "Le statut indique quel événement a été enregistré pour l’unité identifiée."
      },
      {
        "kind": "paragraph",
        "text": "Le {g}Track & Trace{/g} relie les événements à un identifiant. Le {g}statut{/g} indique le dernier événement connu, par exemple dépôt, tri ou remise. Les événements peuvent provenir d’un scan de code-barres ou d’une lecture {g}RFID{/g}. La {g}quittance{/g} atteste le dépôt selon ses indications et aide à rechercher un colis."
      },
      {
        "kind": "heading",
        "text": "2.3 Planification du transport",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/800/802/commun/log-802-lifo-tournee-schema-v002.webp",
        "alt": "Compartiment de véhicule vu de dessus, lots C, B et A de gauche à droite. Le lot A est près de la porte arrière.",
        "caption": "Le premier lot à livrer reste près de la porte. Vérifiez la charge, les accès et l’arrimage avant de retenir cet ordre."
      },
      {
        "kind": "paragraph",
        "text": "Une {g}tournée{/g} organise les arrêts, créneaux et trajets. Contrôlez masse, volume, accès, répartition, arrimage et durées. Pour un seul accès arrière, le {g}LIFO{/g} peut faciliter une tournée : la première unité à livrer est chargée en dernier si les contraintes le permettent. Les logiciels aident à comparer le parcours, l’utilisation des véhicules, le chargement et la transmission des données."
      }
    ],
    "module": "802",
    "revision": "802-v003",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
