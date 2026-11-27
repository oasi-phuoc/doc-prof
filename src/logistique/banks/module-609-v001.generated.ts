import type { LogistiqueUnit } from '../approved-banks'

export const module609 = [
  {
    "id": "log-609-objectifs-apercu",
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
          "Expliquer le rôle de la {g}navigation{/g} (coût, capacité, lenteur) et du {g}Rhin{/g} pour la Suisse",
          "Situer les grandes {g}voies{/g} (océans, Suez/Panama/Kiel) et la notion de {g}TEU{/g}",
          "Décrire le {g}transbordement{/g} (portiques, spreader, LIFO, arrimage)",
          "Relier les {g}forces{/g} maritimes au chargement correct des conteneurs"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 609",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Repérer les voies, ports et points de transbordement maritimes et fluviaux.",
          "Relier les unités au trajet et au dossier de chaque transfert.",
          "Reconnaître les contraintes du mouvement et les responsabilités du chargement."
        ]
      }
    ],
    "module": "609",
    "revision": "609-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-609-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "9. Navigation",
        "sub": false
      },
      {
        "kind": "paragraph",
        "text": "Pratique depuis > {g}8000 ans{/g} · pierre angulaire de la {g}mondialisation{/g}. Villes au bord de l'eau = commerce. Aujourd'hui : encore décisif · relativement {g}lent{/g} (Hong Kong–Hambourg ≈ 25–30 jours) · mais beaucoup de poids · {g}faible coût{/g} · peu d'énergie."
      },
      {
        "kind": "paragraph",
        "text": "👉 Grandes quantités · moindres coûts · mondial."
      },
      {
        "kind": "paragraph",
        "text": "{g}Ex.{/g} Citerne Rhin {g}2800 t{/g} · Rotterdam–Bâle–Rotterdam ≈ {g}6×24 h{/g} (avec chargement) ≈ 35 wagons-citernes ou {g}147{/g} camions · ~{g}1,1 ct{/g}/litre pétrole Rotterdam→Bâle."
      },
      {
        "kind": "heading",
        "text": "9.1 Principales voies",
        "sub": true
      },
      {
        "kind": "heading",
        "text": "9.1.1 Suisse",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Voies intérieures peu importantes (sauf sable/gravier sur lacs). Seul le {g}Rhin{/g} pour bateaux de marchandises."
      },
      {
        "kind": "paragraph",
        "text": "{g}Rhin — porte sur le monde{/g} ~1239 km · voie intérieure n°1 Europe · {g}10–12 %{/g} imports CH · {g}1/4–1/3{/g} imports huiles minérales. Convention de {g}Mannheim{/g} (1868) : accès libre · eaux internationales jusqu'au Mittlere Brücke (Bâle). Capacité bateaux ~{g}300–3000 t{/g}. Dépend du {g}niveau d'eau{/g} (crues / étiage = limitations)."
      },
      {
        "kind": "heading",
        "text": "9.1.2 Océans",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Milliers de miles nautiques · semaines/mois. Cap Horn → Rotterdam > {g}12 000 km{/g} ≈ {g}6500 NM{/g}. {g}1 mile nautique (NM) = 1,852 km{/g}."
      },
      {
        "kind": "heading",
        "text": "9.1.3 Voies artificielles",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Nerf de la guerre · interruptions = embouteillages / pertes (ex. {g}Ever Given{/g}, Suez, mars 2021 · 6 jours)."
      },
      {
        "kind": "table",
        "headers": [
          "Canal",
          "Ordre de grandeur"
        ],
        "rows": [
          [
            "{g}Suez{/g}",
            "~19 000 bateaux/an · ~1200 Mt fret"
          ],
          [
            "{g}Panama{/g}",
            "~13 000 · ~255 Mt"
          ],
          [
            "{g}Kiel{/g}",
            "~28 000 · ~84 Mt"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "Climat : {g}passage du Nord-Est{/g} raccourcit Shanghai–Rotterdam ≈ {g}3800 km{/g} (2100 NM) · étés sans brise-glace parfois possibles."
      },
      {
        "kind": "paragraph",
        "text": "👉 Économie mondiale tributaire d'itinéraires qui fonctionnent."
      },
      {
        "kind": "heading",
        "text": "9.2 Principaux ports",
        "sub": true
      },
      {
        "kind": "heading",
        "text": "9.2.1 Ports du Rhin (Bâle)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Transbordement · stockage temporaire · dédouanement · livraison · transformation · réservoirs / silos · prestataires logistiques."
      },
      {
        "kind": "heading",
        "text": "9.2.2 Grands ports mondiaux",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Dominés par la {g}Chine{/g} (usine du monde). {g}Shanghai{/g} > {g}40 M{/g} conteneurs · {g}Rotterdam{/g} (1er Europe) ≈ {g}14 M{/g}."
      },
      {
        "kind": "paragraph",
        "text": "{g}TEU{/g} (*Twenty-foot Equivalent Unit*) : 20' = {g}1 TEU{/g} · 40' = {g}2 TEU{/g}."
      },
      {
        "kind": "heading",
        "text": "9.3 Transbordement",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/609/commun/log-609-notions-1-v001.svg",
        "alt": "Collecte. Pré-acheminement. Navigation. Liaison principale. Remise. Post-acheminement.",
        "caption": "Les événements de transfert sont rattachés à la même unité."
      },
      {
        "kind": "heading",
        "text": "9.3.1 Moyens",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Grues / {g}portiques{/g} · chariots télescopiques / contrepoids lourds (jusqu'à ~{g}50 t{/g}) · {g}Container-Carrier{/g} (cavalier)."
      },
      {
        "kind": "heading",
        "text": "9.3.2 Spreader",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Dispositif télescopique accroché aux {g}4 coins{/g} du conteneur."
      },
      {
        "kind": "heading",
        "text": "9.3.3 Arrimage à bord",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Le plan tient compte des escales, des unités et des opérations autorisées. Il est validé par les personnes compétentes."
      },
      {
        "kind": "heading",
        "text": "9.4 Forces dynamiques",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/609/commun/log-609-notions-2-v001.svg",
        "alt": "Roulis. Inclinaison latérale. Tangage. Inclinaison longitudinale.",
        "caption": "Le plan de chargement tient compte des conditions définies par le service compétent."
      },
      {
        "kind": "paragraph",
        "text": "Les conditions de navigation peuvent produire des efforts simultanés, notamment en roulis et tangage. Traiter l’unité selon le plan et le dossier applicables."
      },
      {
        "kind": "heading",
        "text": "9.5 Charger correctement",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Palettes {g}peu{/g} utilisées (espace > travail) · EUR type 1 {g}inadaptée{/g} au conteneur. Retenues murales · {g}blocage sans espace{/g} · coussins d'air pour vides."
      },
      {
        "kind": "paragraph",
        "text": "👉 Bon arrimage dans le conteneur = éviter les dommages."
      }
    ],
    "module": "609",
    "revision": "609-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-609-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Amont{/g} — Direction du côté de la source d’un cours d’eau, selon le contexte."
      },
      {
        "kind": "paragraph",
        "text": "{g}Barge{/g} — Embarcation destinée à transporter du fret, notamment sur des voies intérieures."
      },
      {
        "kind": "paragraph",
        "text": "{g}Cale{/g} — Espace du navire utilisé selon le plan de chargement."
      },
      {
        "kind": "paragraph",
        "text": "{g}Conteneur{/g} — Unité intermodale identifiée, compatible avec des équipements définis."
      },
      {
        "kind": "paragraph",
        "text": "{g}Corridor{/g} — Parcours principal qui relie plusieurs points d’un réseau."
      },
      {
        "kind": "paragraph",
        "text": "{g}EVP{/g} — Équivalent vingt pieds, unité de comptage de capacité conteneur."
      },
      {
        "kind": "paragraph",
        "text": "{g}Navigation fluviale{/g} — Transport sur les voies navigables intérieures."
      },
      {
        "kind": "paragraph",
        "text": "{g}Port{/g} — Site comprenant des interfaces pour accostage, manutention ou transfert."
      },
      {
        "kind": "paragraph",
        "text": "{g}Post-acheminement{/g} — Trajet qui suit l’étape principale."
      },
      {
        "kind": "paragraph",
        "text": "{g}Pré-acheminement{/g} — Trajet qui précède l’étape principale."
      },
      {
        "kind": "paragraph",
        "text": "{g}Roulis{/g} — Mouvement d’inclinaison latérale du navire."
      },
      {
        "kind": "paragraph",
        "text": "{g}Transbordement{/g} — Transfert d’unités entre moyens de transport ou liaisons."
      }
    ],
    "module": "609",
    "revision": "609-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-609-maths-fiche-1",
    "kind": "maths",
    "prompt": "Une desserte comprend 40 km de collecte, 210 km par voie d’eau et 28 km de remise. Calculez la distance totale.",
    "answer": "278 km.",
    "calculation": "40 + 210 + 28 = 278 km.",
    "module": "609",
    "revision": "609-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-609-maths-fiche-2",
    "kind": "maths",
    "prompt": "Un départ compte 30 unités de 20 pieds et 12 de 40 pieds. Avec 1 EVP et 2 EVP respectivement, calculez le total.",
    "answer": "54 EVP.",
    "calculation": "30 + 12 × 2 = 54 EVP.",
    "module": "609",
    "revision": "609-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-609-maths-fiche-3",
    "kind": "maths",
    "prompt": "Sur 72 dossiers, sept attendent une pièce documentaire. Combien sont complets pour ce contrôle ?",
    "answer": "65 dossiers.",
    "calculation": "72 − 7 = 65.",
    "module": "609",
    "revision": "609-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-609-maths-fiche-4",
    "kind": "maths",
    "prompt": "Deux attentes en port durent 15 h et 9 h. Calculez le total.",
    "answer": "24 heures.",
    "calculation": "15 + 9 = 24 h.",
    "module": "609",
    "revision": "609-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-609-maths-fiche-5",
    "kind": "maths",
    "prompt": "Un créneau de manutention prévoit 18 opérations par heure pendant quatre heures, dont 30 minutes d’arrêt. Calculez le nombre d’opérations au débit indiqué.",
    "answer": "63 opérations.",
    "calculation": "(4 − 0,5) × 18 = 63.",
    "module": "609",
    "revision": "609-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-609-verification-fiche-1",
    "kind": "verification",
    "prompt": "Qu’est-ce qu’un pré-acheminement ?",
    "answer": "Le trajet qui relie le lieu de départ au départ de l’étape principale.",
    "module": "609",
    "revision": "609-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-609-verification-fiche-2",
    "kind": "verification",
    "prompt": "Quel rôle joue un port de transbordement ?",
    "answer": "Il transfère les unités entre moyens ou trajets selon le dossier.",
    "module": "609",
    "revision": "609-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-609-verification-fiche-3",
    "kind": "verification",
    "prompt": "Quelle différence entre EVP et nombre physique de conteneurs ?",
    "answer": "L’EVP convertit les tailles en unités de référence. Le nombre physique compte les conteneurs.",
    "module": "609",
    "revision": "609-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-609-verification-fiche-4",
    "kind": "verification",
    "prompt": "Pourquoi relever les événements du transfert ?",
    "answer": "Pour conserver la responsabilité de prise en charge et connaître l’étape atteinte.",
    "module": "609",
    "revision": "609-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-609-verification-fiche-5",
    "kind": "verification",
    "prompt": "Pourquoi vérifier le plan de chargement auprès du service qualifié ?",
    "answer": "Les contraintes de poids, position et mouvement dépendent du navire, de la route et des règles applicables.",
    "module": "609",
    "revision": "609-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-609-situation-fiche-1",
    "kind": "situation",
    "prompt": "La correspondance est reportée. Quelles données réévaluez-vous ?",
    "answer": "La date de prise en charge, la zone temporaire, les conditions et la nouvelle échéance.",
    "module": "609",
    "revision": "609-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-609-situation-fiche-2",
    "kind": "situation",
    "prompt": "Les documents de deux unités ne concordent pas. Que faites-vous ?",
    "answer": "Isoler le traitement des deux dossiers, vérifier les identifiants et demander la correction autorisée.",
    "module": "609",
    "revision": "609-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-609-situation-fiche-3",
    "kind": "situation",
    "prompt": "Une unité porte un dommage à l’arrivée. Que consignez-vous ?",
    "answer": "La référence, le lieu, l’état observé et la trace de transfert avant transmission.",
    "module": "609",
    "revision": "609-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
