import type { LogistiqueUnit } from '../approved-banks'

export const module604 = [
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
        "src": "/assets/logistique/200/201/commun/log-201-client-photo-v002.webp",
        "alt": "Un employé remet un colis à un point de retrait.",
        "caption": "Le retrait en point de vente ou chez un partenaire fait partie des choix du canal."
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
        "src": "/assets/logistique/600/612/cfc/log-612-cross-dock-photo-v002.webp",
        "alt": "Des unités sont regroupées à deux quais de départ et d’arrivée.",
        "caption": "Une plateforme répartit les flux de plusieurs origines vers différents destinataires."
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
        "kind": "image",
        "src": "/assets/logistique/600/607/commun/log-607-rail-photo-v002.webp",
        "alt": "Un train de fret transporte des conteneurs sur des wagons plats.",
        "caption": "Plusieurs modes peuvent servir le même canal de vente. Le trajet direct et la solution combinée demandent des moyens différents."
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
    "summaryBlocks": [
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
        "src": "/assets/logistique/200/201/commun/log-201-client-photo-v002.webp",
        "alt": "Un employé remet un colis à un point de retrait.",
        "caption": "Le retrait en point de vente ou chez un partenaire fait partie des choix du canal."
      },
      {
        "kind": "paragraph",
        "text": "La {g}vente directe{/g} relie le producteur au client. Un canal {g}indirect{/g} passe par un grossiste, un commerçant ou un autre intermédiaire. Une même entreprise peut utiliser plusieurs canaux, dont le commerce en ligne. Chaque canal impose des conditions de disponibilité et de remise."
      },
      {
        "kind": "heading",
        "text": "4.2 Distribution (répartition)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/612/cfc/log-612-cross-dock-photo-v002.webp",
        "alt": "Des unités sont regroupées à deux quais de départ et d’arrivée.",
        "caption": "Une plateforme répartit les flux de plusieurs origines vers différents destinataires."
      },
      {
        "kind": "paragraph",
        "text": "La {g}distribution{/g} organise la circulation des biens vers le destinataire. On décide où placer le stock, s’il faut livrer directement ou passer par une plateforme, et comment sélectionner les prestataires. Comparez délais, volumes, coût et qualité pour chaque parcours."
      },
      {
        "kind": "heading",
        "text": "4.3 et 4.4 Marché postal et transports",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/607/commun/log-607-rail-photo-v002.webp",
        "alt": "Un train de fret transporte des conteneurs sur des wagons plats.",
        "caption": "Plusieurs modes peuvent servir le même canal de vente. Le trajet direct et la solution combinée demandent des moyens différents."
      },
      {
        "kind": "paragraph",
        "text": "Les services postaux transportent des lettres et colis selon des prestations différentes. Les transporteurs immatriculés et organisateurs de transport travaillent avec d’autres règles selon le mode et le périmètre. Vérifiez le {g}délai{/g}, la {g}preuve de dépôt{/g}, la traçabilité et les conditions de transport, plutôt que de comparer uniquement le prix."
      },
      {
        "kind": "heading",
        "text": "4.5 Exemple",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Une commande de bacs pour plusieurs magasins peut passer par un dépôt central. Une commande urgente peut être livrée directement si les conditions permettent d’assurer le délai."
      }
    ],
    "module": "604",
    "revision": "604-v003",
    "approvedFor": [
      "CFC"
    ]
  }
] satisfies readonly LogistiqueUnit[]
