import type { LogistiqueUnit } from '../approved-banks'

export const module608 = [
  {
    "id": "log-608-objectifs-apercu",
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
          "Expliquer l'importance du {g}fret aérien{/g} pour la Suisse",
          "Situer les trois {g}aéroports{/g} nationaux et le rôle des {g}ULD{/g}",
          "Décrire douane / contrôles et les {g}forces{/g} en aérien",
          "Distinguer {g}AWB{/g}, règles {g}IATA{/g} et {g}DGR{/g} pour les MD"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 608",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Identifier le rôle de la rapidité, du terminal et des correspondances en fret aérien.",
          "Distinguer documents et unités adaptés au parcours.",
          "Faire vérifier l’acceptation, la sûreté et l’échéance avant la remise."
        ]
      }
    ],
    "module": "608",
    "revision": "608-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-608-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "8. Le transport aérien",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "8.1 Importance du fret aérien",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Le fret aérien peut réduire la durée d’une liaison longue distance. Comparer la durée complète, les correspondances et les coûts, y compris les délais au sol."
      },
      {
        "kind": "paragraph",
        "text": "👉 Mode le plus {g}rapide{/g} à l'échelle mondiale."
      },
      {
        "kind": "heading",
        "text": "8.2 Domaines d'application",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/608/commun/log-608-notions-1-v001.svg",
        "alt": "Besoin. Délai et destination. Terminal. Acceptation et transfert. Arrivée. Formalités et remise.",
        "caption": "La rapidité du vol ne couvre pas les délais de collecte et de remise."
      },
      {
        "kind": "paragraph",
        "text": "Animaux vivants · fleurs / fruits · journaux / films · mode / saisonnier · pièces urgentes · médicaments · délais précis · courrier aérien · haute valeur / sensibles / sujettes au vol · secours · documents · organes / dépouilles."
      },
      {
        "kind": "heading",
        "text": "8.3 Trafic de remplacement aérien",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Optimiser les capacités : acheminement {g}camion{/g} vers/depuis hub (ex. Luxembourg → Zurich · CH → Francfort puis Asie). Concurrence entre prestataires. Semi-remorques souvent à {g}plancher à rouleaux{/g}."
      },
      {
        "kind": "heading",
        "text": "8.4 Aéroports suisses",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Trois aéroports nationaux : {g}Zurich{/g}, {g}Genève{/g}, {g}Bâle{/g}."
      },
      {
        "kind": "heading",
        "text": "8.4.1 Zurich",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "~{g}70 %{/g} du marché fret CH · {g}hub{/g} · Swiss WorldCargo ~{g}65 %{/g} · majorité en avions passagers · ~{g}70 %{/g} fret de transfert · >1200 t/jour · ~1400 collab. · manutention Cargologic / Dnata · ~120 transporteurs alentours."
      },
      {
        "kind": "heading",
        "text": "8.4.2 Genève",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Plaque régionale/nationale · frontière CH–FR · produits haute valeur (chimie, montres…)."
      },
      {
        "kind": "heading",
        "text": "8.4.3 EuroAirport Bâle-Mulhouse",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Seul aéroport {g}binational{/g} · région tri-nationale · 5 km Allemagne · import/export CH {g}et{/g} UE · pharma · liaisons autoroutes CH/FR/DE."
      },
      {
        "kind": "heading",
        "text": "8.5 Unités, moyens, avions",
        "sub": true
      },
      {
        "kind": "heading",
        "text": "8.5.1 Unités",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}BUP{/g} (*Bulk Unitization Program*) : unitisation type « conteneur ISO » du maritime. {g}ULD{/g} (*Unit Load Devices*) : conteneurs / plaques aluminium + filet · ↓ nb d'unités · personnel/temps au sol ↓."
      },
      {
        "kind": "heading",
        "text": "8.5.2 Moyens",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Remorques + tracteur · chariot porte-conteneurs · {g}plates-formes élévatrices{/g} à rouleaux pour chargement avion."
      },
      {
        "kind": "heading",
        "text": "8.5.3 Avions",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Cargos moins nombreux / discrets. {g}Belly freight{/g} : fret sous la cabine passagers · réseau long-courrier souvent rentable {g}seulement{/g} avec fret."
      },
      {
        "kind": "heading",
        "text": "8.6 Dédouanement et contrôles",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Toute import/export via douane · contrôles ciblés · taxes. Futur : déclaration {g}numérique{/g} (ex. n° {g}Air Waybill{/g}). {g}Vétérinaire de frontière{/g} : épizooties · hygiène alimentaire · espèces menacées. {g}Service phytosanitaire{/g} : maladies végétales / ravageurs."
      },
      {
        "kind": "heading",
        "text": "8.7 Forces dynamiques",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Décollage / atterrissage · transbordement jusqu'à ~{g}1,0 g{/g} (+ secousses chargement)."
      },
      {
        "kind": "heading",
        "text": "8.8 Expédition",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/608/commun/log-608-notions-2-v001.svg",
        "alt": "Envoi. Identité et masse. Liaison. Itinéraire et horaire. Validation. Contrôles requis.",
        "caption": "Vérifier la documentation à la date du départ."
      },
      {
        "kind": "heading",
        "text": "8.8.1 Emballage",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Par l'expéditeur selon règles générales · cas spéciaux (MD…)."
      },
      {
        "kind": "heading",
        "text": "8.8.2 Chargement ULD",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "La prise en charge et les opérations sur unités relèvent du personnel formé, selon les procédures et règles applicables à l’exploitant."
      },
      {
        "kind": "heading",
        "text": "8.8.3 MD (DGR)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "*Dangerous Goods Regulations* : quelles MD · quantités nettes max. · emballages spéciaux · incompatibilités · parfois {g}Cargo Aircraft Only{/g}. Pictogrammes · {g}Shipper's Declaration{/g} (équivalent ONU, qté nette, classe, groupe, instruction d'emballage · parfois n° urgence 24h). Entreprises spécialisées fréquentes."
      },
      {
        "kind": "heading",
        "text": "8.8.4 Air Waybill (AWB)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Contrat expéditeur (*shipper*) ↔ compagnie (*carrier*). {g}Non négociable{/g} (≠ Bill of Lading maritime)."
      },
      {
        "kind": "paragraph",
        "text": "Rôles : confirmation de prise en charge · instructions manipulation/acheminement · justificatif assurance · niveau de responsabilité · possible déclaration douane · base de facturation fret."
      }
    ],
    "module": "608",
    "revision": "608-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-608-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}AWB{/g} — Lettre de transport aérien qui atteste les données du dossier de fret."
      },
      {
        "kind": "paragraph",
        "text": "{g}Contrôle d’acceptation{/g} — Vérification des conditions de prise en charge."
      },
      {
        "kind": "paragraph",
        "text": "{g}Correspondance{/g} — Transfert entre deux étapes ou vols."
      },
      {
        "kind": "paragraph",
        "text": "{g}Dédouanement{/g} — Traitement des formalités douanières applicables."
      },
      {
        "kind": "paragraph",
        "text": "{g}Fret aérien{/g} — Acheminement de marchandises par avion."
      },
      {
        "kind": "paragraph",
        "text": "{g}Heure limite{/g} — Dernier moment accepté pour une opération donnée."
      },
      {
        "kind": "paragraph",
        "text": "{g}Hub{/g} — Site où se rencontrent plusieurs flux."
      },
      {
        "kind": "paragraph",
        "text": "{g}Identifiant de vol{/g} — Référence d’une liaison dans le dossier."
      },
      {
        "kind": "paragraph",
        "text": "{g}Liaison de substitution{/g} — Trajet de remplacement planifié pour assurer une étape."
      },
      {
        "kind": "paragraph",
        "text": "{g}Masse déclarée{/g} — Masse inscrite dans le dossier d’après la méthode prévue."
      },
      {
        "kind": "paragraph",
        "text": "{g}Sûreté{/g} — Mesures qui protègent les personnes et le transport contre des actes illicites."
      },
      {
        "kind": "paragraph",
        "text": "{g}ULD{/g} — Unité de chargement utilisée selon le système du transport aérien."
      }
    ],
    "module": "608",
    "revision": "608-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-608-maths-fiche-1",
    "kind": "maths",
    "prompt": "Une remise a lieu à 13 h 20 et le traitement dure 85 min. Calculez sa fin.",
    "answer": "14 h 45.",
    "calculation": "13 h 20 + 85 min = 14 h 45.",
    "module": "608",
    "revision": "608-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-608-maths-fiche-2",
    "kind": "maths",
    "prompt": "Une expédition compte huit pièces de 12 kg. Calculez la masse totale.",
    "answer": "96 kg.",
    "calculation": "8 × 12 = 96 kg.",
    "module": "608",
    "revision": "608-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-608-maths-fiche-3",
    "kind": "maths",
    "prompt": "Sur 64 unités, quatre ne sont pas encore acceptées. Combien le sont ?",
    "answer": "60 unités.",
    "calculation": "64 − 4 = 60.",
    "module": "608",
    "revision": "608-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-608-maths-fiche-4",
    "kind": "maths",
    "prompt": "Deux étapes de 95 min et 40 min se suivent. Calculez la durée totale.",
    "answer": "2 h 15.",
    "calculation": "95 + 40 = 135 min = 2 h 15.",
    "module": "608",
    "revision": "608-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-608-maths-fiche-5",
    "kind": "maths",
    "prompt": "Le coût d’exercice est de 3,60 CHF/kg plus 48 CHF de dossier. Calculez le total pour 90 kg.",
    "answer": "372 CHF.",
    "calculation": "90 × 3,60 + 48 = 372 CHF.",
    "module": "608",
    "revision": "608-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-608-verification-fiche-1",
    "kind": "verification",
    "prompt": "Que signifie AWB dans le dossier ?",
    "answer": "La lettre de transport aérien.",
    "module": "608",
    "revision": "608-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-608-verification-fiche-2",
    "kind": "verification",
    "prompt": "Pourquoi vérifier l’heure limite de remise ?",
    "answer": "Pour laisser le temps aux opérations et contrôles demandés avant le départ.",
    "module": "608",
    "revision": "608-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-608-verification-fiche-3",
    "kind": "verification",
    "prompt": "Quel est le rôle d’un ULD ?",
    "answer": "Regrouper ou supporter la charge dans un système prévu et accepté.",
    "module": "608",
    "revision": "608-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-608-verification-fiche-4",
    "kind": "verification",
    "prompt": "Pourquoi préciser le mode réel utilisé sur une étape ?",
    "answer": "Une liaison de remplacement ou de desserte peut changer les délais, responsabilités et documents.",
    "module": "608",
    "revision": "608-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-608-verification-fiche-5",
    "kind": "verification",
    "prompt": "Qui valide la prise en charge d’un envoi réglementé ?",
    "answer": "Le service qualifié selon le mode, le prestataire et les documents applicables.",
    "module": "608",
    "revision": "608-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-608-situation-fiche-1",
    "kind": "situation",
    "prompt": "Le dossier arrive après l’heure limite. Quelle information transmettez-vous ?",
    "answer": "Heure constatée, étape concernée et option de report à faire confirmer.",
    "module": "608",
    "revision": "608-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-608-situation-fiche-2",
    "kind": "situation",
    "prompt": "La masse déclarée diffère de la mesure. Que faites-vous ?",
    "answer": "Suspendre l’acceptation, vérifier la mesure, l’unité et le dossier, puis transmettre.",
    "module": "608",
    "revision": "608-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-608-situation-fiche-3",
    "kind": "situation",
    "prompt": "Le contenu de l’envoi reste incertain. Comment poursuivez-vous ?",
    "answer": "Demander la documentation au service habilité et maintenir l’envoi hors remise jusqu’à la décision.",
    "module": "608",
    "revision": "608-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
