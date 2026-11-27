import type { LogistiqueUnit } from '../approved-banks'

export const module604 = [
  {
    "id": "log-604-objectifs-apercu",
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
          "Distinguer vente {g}directe{/g} / {g}indirecte{/g} et distribution à {g}un{/g} / {g}plusieurs{/g} niveaux",
          "Expliquer centralisé vs décentralisé et le {g}Cross Docking{/g}",
          "Décrire le marché {g}postal{/g} (service public, réservé ≤50 g…)",
          "Situer les acteurs {g}DEC{/g} et le rôle des {g}Incoterms{/g} à l'export"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 604",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Relier les canaux de vente aux réseaux de distribution.",
          "Comparer livraison directe, plateforme et desserte régionale.",
          "Identifier les rôles et informations nécessaires pour suivre un départ."
        ]
      }
    ],
    "module": "604",
    "revision": "604-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-604-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "4. Les systèmes de distribution",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "4.1 Canaux de vente",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/604/cfc/log-604-notions-2-v001.svg",
        "alt": "Direct. Fournisseur et client. Indirect. Intermédiaire dans le canal.",
        "caption": "Le canal choisi ne décrit pas à lui seul tous les trajets."
      },
      {
        "kind": "heading",
        "text": "4.1.1 Vente directe",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Producteur → client final ({g}B2C{/g}) · livraison ou retrait chez le producteur · pas d'intermédiaire → prix souvent plus avantageux · trajets parfois plus longs pour le client."
      },
      {
        "kind": "heading",
        "text": "4.1.2 Vente indirecte",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Producteur → {g}intermédiaire{/g} (ex. Coop, Migros) → autre distributeur ou client · {g}B2B{/g} entre producteurs / commerçants."
      },
      {
        "kind": "heading",
        "text": "4.2 Distribution (répartition)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/604/cfc/log-604-notions-1-v001.svg",
        "alt": "Fournisseur. Envois identifiés. Plateforme. Groupage et répartition. Clients. Desserte organisée.",
        "caption": "Les données de destination suivent le flux physique."
      },
      {
        "kind": "heading",
        "text": "4.2.1 À un niveau",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Client chez le producteur {g}ou{/g} producteur sur un point de vente (ferme, marché, magasin d'usine / outlet)."
      },
      {
        "kind": "heading",
        "text": "4.2.2 À plusieurs niveaux",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Passage par intermédiaire et/ou entrepôt d'un grand distributeur."
      },
      {
        "kind": "paragraph",
        "text": "{g}Centralisé vs décentralisé{/g} Un niveau supplémentaire se justifie si coûts d'entreposage ≤ économies de transport. Infra transport développée → tendance {g}centralisée{/g}."
      },
      {
        "kind": "paragraph",
        "text": "Critères de décision : importance de la région · type de marchandise (périssable ?) · structure clientèle · proximité client · écologie · sites (prod., entrepôt central/régional, dépôt)."
      },
      {
        "kind": "heading",
        "text": "Grande distribution — concept classique",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Réseau multiniveaux · centres d'achat + points de vente · large assortiment · défi logistique d'approvisionnement des magasins."
      },
      {
        "kind": "heading",
        "text": "Concept décentralisé",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Centres spécialisés par type (non-food, DIY, coloniales…) · commandes des magasins · préparation « pour magasins » · pas de stock régional : {g}transit{/g} / regroupement = {g}Cross Docking{/g}."
      },
      {
        "kind": "paragraph",
        "text": "{g}Cross Docking :{/g} marchandises déjà pré-commissionnées par le fournisseur · pas (ou peu) de stockage · réexpédition rapide · picking reporté chez le fournisseur. Prérequis : commandes clients déjà passées · délais fournisseurs courts. 👉 Objectif : stocks ↓ · vitesse ↑ · coûts de stockage ↓."
      },
      {
        "kind": "paragraph",
        "text": "Entrepôts régionaux → souvent {g}plateformes frais{/g} · gros points de vente parfois livrés directement depuis production / distribution centrale → réseau complexe."
      },
      {
        "kind": "heading",
        "text": "Vente par correspondance / e-commerce",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Commande en ligne · livraison domicile · ex. Galaxus, Coop, Migros, Lindt… · EnterSite AG a aussi sa boutique."
      },
      {
        "kind": "heading",
        "text": "4.3 Marché postal",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Plusieurs opérateurs proposent des services postaux. Les obligations de service universel, limites et tarifs applicables se vérifient dans les documents en vigueur."
      },
      {
        "kind": "heading",
        "text": "4.3.1 Réservé / non réservé / concurrentiel",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "Type",
          "Contenu"
        ],
        "rows": [
          [
            "{g}Réservé{/g} (monopole)",
            "Lettres ≤ {g}50 g{/g} · exclusivité Poste (sauf étranger) · finance le service universel"
          ],
          [
            "{g}Non réservé{/g}",
            "Lettres > 50 g + colis · Poste {g}en concurrence{/g}"
          ],
          [
            "{g}Concurrentiel{/g}",
            "Services que la Poste {g}peut{/g} offrir (ex. express) · pas d'obligation"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "👉 Mission service public ↔ exclusivité < 50 g."
      },
      {
        "kind": "heading",
        "text": "4.3.2 Transport Poste",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Dépôt → camion → centre de tri lettres/colis · même zone → district · sinon train vers autre centre → camion vers régions / bases colis → remise (scooter DXP, voiture, camionnette)."
      },
      {
        "kind": "heading",
        "text": "4.4 Secteur des transports",
        "sub": true
      },
      {
        "kind": "heading",
        "text": "4.4.1 DEC (documents, express, colis)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Principaux : {g}Poste{/g}, {g}DPD{/g}, {g}DHL{/g} · + messagers / coursiers vélo (villes)."
      },
      {
        "kind": "heading",
        "text": "4.5 Exemples",
        "sub": true
      },
      {
        "kind": "heading",
        "text": "4.5.1 Diverses marchandises",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Colis > {g}30 kg{/g} souvent sur palette = transport de {g}colis unitaires{/g} · ramassage → plateforme → tri régional → livraison camion."
      },
      {
        "kind": "paragraph",
        "text": "👉 Stratégie de distribution adaptée = succès entreprise."
      },
      {
        "kind": "heading",
        "text": "4.5.2 Étranger",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Emballage spécial · {g}dédouanement{/g} · assurance · spécialistes / transitaires."
      },
      {
        "kind": "heading",
        "text": "Incoterms 2020",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "*International Commercial Terms* — répartissent entre vendeur et acheteur : - coûts (conditionnement, fret, assurances) - documents import / export - droits de douane / taxes - {g}transfert des risques{/g}"
      },
      {
        "kind": "paragraph",
        "text": "Familles usuelles (tout mode vs mer/fluvial) : {g}EXW{/g} · {g}FCA{/g} · {g}CPT{/g} · {g}CIP{/g} · {g}DAP{/g} · {g}DPU{/g} · {g}DDP{/g} (tout mode) · {g}FAS{/g} · {g}FOB{/g} · {g}CFR{/g} · {g}CIF{/g} (mer / fluvial)."
      },
      {
        "kind": "paragraph",
        "text": "De EXW (quasi tout à charge acheteur) à {g}DDP{/g} (vendeur jusqu'au lieu de destination dédouané)."
      }
    ],
    "module": "604",
    "revision": "604-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-604-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Canal de vente{/g} — Chemin commercial entre le vendeur et le client."
      },
      {
        "kind": "paragraph",
        "text": "{g}Canal direct{/g} — Parcours sans intermédiaire commercial entre fournisseur et client."
      },
      {
        "kind": "paragraph",
        "text": "{g}Canal indirect{/g} — Parcours avec un ou plusieurs intermédiaires commerciaux."
      },
      {
        "kind": "paragraph",
        "text": "{g}Desserte{/g} — Organisation des destinations servies par un flux."
      },
      {
        "kind": "paragraph",
        "text": "{g}Distribution physique{/g} — Ensemble des mouvements et opérations vers les destinataires."
      },
      {
        "kind": "paragraph",
        "text": "{g}Flux d’information{/g} — Transmission des données du dossier entre les acteurs."
      },
      {
        "kind": "paragraph",
        "text": "{g}Groupage{/g} — Réunion de plusieurs envois dans un même flux ou départ."
      },
      {
        "kind": "paragraph",
        "text": "{g}Incoterms{/g} — Règles contractuelles sélectionnées qui répartissent certaines obligations, coûts et risques."
      },
      {
        "kind": "paragraph",
        "text": "{g}Intermédiaire{/g} — Acteur qui participe au parcours commercial ou opérationnel."
      },
      {
        "kind": "paragraph",
        "text": "{g}Plateforme{/g} — Site de réception, regroupement, transfert ou répartition."
      },
      {
        "kind": "paragraph",
        "text": "{g}Réseau de distribution{/g} — Ensemble de sites et liaisons qui organise les livraisons."
      },
      {
        "kind": "paragraph",
        "text": "{g}Traçabilité{/g} — Capacité de retrouver les mouvements et responsabilités d’un envoi."
      }
    ],
    "module": "604",
    "revision": "604-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-604-maths-fiche-1",
    "kind": "maths",
    "prompt": "Un départ régional couvre 14, 22 et 19 envois. Calculez le total.",
    "answer": "55 envois.",
    "calculation": "14 + 22 + 19 = 55.",
    "module": "604",
    "revision": "604-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-604-maths-fiche-2",
    "kind": "maths",
    "prompt": "Une livraison directe coûte 130 CHF. Avec plateforme, le transfert et la desserte coûtent 78 et 39 CHF. Comparez.",
    "answer": "La plateforme coûte 117 CHF, soit 13 CHF de moins.",
    "calculation": "78 + 39 = 117. 130 − 117 = 13 CHF.",
    "module": "604",
    "revision": "604-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-604-maths-fiche-3",
    "kind": "maths",
    "prompt": "Un centre traite 480 unités en six heures. Calculez le débit moyen.",
    "answer": "80 unités par heure.",
    "calculation": "480 ÷ 6 = 80.",
    "module": "604",
    "revision": "604-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-604-maths-fiche-4",
    "kind": "maths",
    "prompt": "Sur 180 envois, 45 prennent un canal indirect. Calculez la part.",
    "answer": "25 %.",
    "calculation": "45 ÷ 180 × 100 = 25 %.",
    "module": "604",
    "revision": "604-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-604-maths-fiche-5",
    "kind": "maths",
    "prompt": "Le trajet direct prend 75 min. Par plateforme, le trajet comprend 28, 15 et 42 min. Donnez l’écart.",
    "answer": "Le trajet via plateforme prend dix minutes de plus.",
    "calculation": "28 + 15 + 42 = 85 min. 85 − 75 = 10 min.",
    "module": "604",
    "revision": "604-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-604-verification-fiche-1",
    "kind": "verification",
    "prompt": "Quel rôle joue une plateforme ?",
    "answer": "Elle organise le regroupement, la répartition ou le transfert selon le réseau.",
    "module": "604",
    "revision": "604-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-604-verification-fiche-2",
    "kind": "verification",
    "prompt": "Qu’est-ce qui distingue un canal direct d’un canal indirect ?",
    "answer": "La présence d’intermédiaires dans le canal indirect.",
    "module": "604",
    "revision": "604-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-604-verification-fiche-3",
    "kind": "verification",
    "prompt": "Pourquoi distinguer canal commercial et parcours physique ?",
    "answer": "Un achat direct peut emprunter plusieurs sites et transporteurs.",
    "module": "604",
    "revision": "604-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-604-verification-fiche-4",
    "kind": "verification",
    "prompt": "Quelles données comparer entre deux réseaux ?",
    "answer": "Délais, capacité, coûts, destinations et qualité de service.",
    "module": "604",
    "revision": "604-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-604-verification-fiche-5",
    "kind": "verification",
    "prompt": "Les Incoterms remplacent-ils la commande complète ?",
    "answer": "Ils définissent certaines obligations. Le dossier doit préciser le terme, la version et le lieu convenu avec les autres conditions.",
    "module": "604",
    "revision": "604-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-604-situation-fiche-1",
    "kind": "situation",
    "prompt": "Une région regroupe beaucoup de petits envois. Quel scénario comparez-vous à la livraison directe ?",
    "answer": "Un passage par plateforme avec groupage et desserte régionale, selon coûts et délai.",
    "module": "604",
    "revision": "604-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-604-situation-fiche-2",
    "kind": "situation",
    "prompt": "Un transporteur reçoit une ancienne adresse. Comment corrigez-vous le dossier ?",
    "answer": "Vérifier la destination validée, transmettre la mise à jour autorisée et garder la trace.",
    "module": "604",
    "revision": "604-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-604-situation-fiche-3",
    "kind": "situation",
    "prompt": "Les coûts diminuent mais les retards augmentent. Quelles données comparez-vous ?",
    "answer": "Coûts, taux de service, volumes et causes sur une période comparable.",
    "module": "604",
    "revision": "604-v001",
    "approvedFor": [
      "CFC"
    ]
  }
] satisfies readonly LogistiqueUnit[]
