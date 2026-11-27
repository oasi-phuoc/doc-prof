import type { LogistiqueUnit } from '../approved-banks'

export const module402 = [
  {
    "id": "log-402-objectifs-apercu",
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
          "Distinguer les entrepôts selon les {g}marchandises{/g} (MP, self-service, finis)",
          "Expliquer les entrepôts de {g}production{/g}, {g}distribution{/g} et {g}commerce{/g}",
          "Comparer stockage {g}centralisé{/g} et {g}décentralisé{/g}",
          "Décrire transbordement, {g}consignation{/g}, entrepôts {g}temporaires{/g} et de {g}maturation{/g}"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 402",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Classer les entrepôts selon la marchandise, le secteur et la place dans le flux.",
          "Distinguer réserve durable, transbordement et stockage de maturation.",
          "Comparer des sites sur délai, capacité et service."
        ]
      }
    ],
    "module": "402",
    "revision": "402-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-402-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "2. Les genres de stockage",
        "sub": false
      },
      {
        "kind": "paragraph",
        "text": "Tous les entrepôts ne sont pas identiques. Critères de planification (ex. EnterSite AG) : - Quelles {g}marchandises{/g} stocker ? - Dans quel {g}domaine d'activité{/g} ? - {g}Où{/g} se trouve l'entrepôt ? - Quelle {g}fonction{/g} doit-il remplir ?"
      },
      {
        "kind": "heading",
        "text": "2.1 Distinction selon les marchandises",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Caractéristiques influençant manipulation et stockage (→ module {g}105{/g}) : - dimensions / volume - densité (poids) - état physique (solide, liquide, gazeux) - durabilité (périssable, fragile, empilable) - valeur (stockage sécurisé) - etc."
      },
      {
        "kind": "heading",
        "text": "2.1.1 Entrepôt de matières premières",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Acier, bois, coton… = composants principaux de la production. Stock {g}centralisé{/g} pour toute l'entreprise ou {g}décentralisé{/g} près de la production. Chez EnterSite : surtout fonction {g}tampon{/g} pour la chaîne de production."
      },
      {
        "kind": "heading",
        "text": "2.1.2 Entrepôt self-service",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Petit stock de petites quantités d'articles {g}fréquents{/g} (vis, rondelles, joints…). Les collaborateurs se servent {g}sans{/g} comptabiliser chaque prélèvement. Contrôles périodiques pour recalculer les stocks."
      },
      {
        "kind": "heading",
        "text": "2.1.3 Entrepôt de produits finis",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Produits non vendus immédiatement → stockage temporaire. Lien {g}production ↔ vente{/g}. En détail/gros : {g}stock de vente{/g} (achat producteur → vente petites quantités). L'espace de vente au client = aussi « entrepôt de vente »."
      },
      {
        "kind": "heading",
        "text": "2.2 Distinction par secteur",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Chaque branche a ses dispositions."
      },
      {
        "kind": "heading",
        "text": "2.2.1 Entreprises de fabrication (production)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Ex. EnterSite : stylos, cartouches, agrafes. Trois types d'entrepôts dans le processus :"
      },
      {
        "kind": "paragraph",
        "text": "{g}En amont{/g} — approvisionner la fabrication (MP, semi-finis…) pour une production équilibrée et une bonne utilisation des moyens."
      },
      {
        "kind": "paragraph",
        "text": "{g}Intermédiaire{/g} — temps d'attente entre étapes (prémontage → fabrication → peinture → montage final). Fonction de {g}transition{/g}. Pharma : « {g}bulk{/g} » (grands récipients, pas encore emballage de vente)."
      },
      {
        "kind": "paragraph",
        "text": "{g}En aval{/g} — - approvisionnement régulier commerce/vente - absorption des excédents de production - équilibre offre / demande"
      },
      {
        "kind": "heading",
        "text": "2.2.2 Entreprise de distribution",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Poste, expéditeurs, transports → entrepôts de {g}transbordement{/g} (→ module {g}600{/g})."
      },
      {
        "kind": "paragraph",
        "text": "{g}Entrepôt de transbordement{/g} = sans stock durable. Stockage temporaire pour : - changement de moyen de transport - tri des envois - préparation au chargement - formalités douanières / importation"
      },
      {
        "kind": "paragraph",
        "text": "Souvent aux {g}nœuds{/g} : ports, gares, aéroports, terminaux conteneurs, centres de tri."
      },
      {
        "kind": "paragraph",
        "text": "{g}Tâches administratives :{/g} douane · contrôles de sécurité · lettres de voiture · facturation transport."
      },
      {
        "kind": "heading",
        "text": "2.2.3 Entreprises commerciales",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Grandes quantités pour détail et fabrication."
      },
      {
        "kind": "paragraph",
        "text": "{g}Centre / entrepôt de distribution (livraison){/g} — réduit distance et délai vers les clients. Un producteur peut aussi stocker chez un transporteur pour livraisons rapides."
      },
      {
        "kind": "paragraph",
        "text": "{g}Entrepôt de consignation{/g} — marchandises propriété du {g}fournisseur{/g}, stockées chez le client ; prélèvements décomptés périodiquement. Client : flux assuré + {g}moins{/g} de capital immobilisé."
      },
      {
        "kind": "heading",
        "text": "2.3 Choix du site géographique",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/402/commun/log-402-notions-1-v001.svg",
        "alt": "Origines. Fournisseurs et production. Site. Capacité et accès. Destinations. Clients et délais.",
        "caption": "Les volumes, délais et coûts se comparent sur le même périmètre."
      },
      {
        "kind": "paragraph",
        "text": "{g}Facteurs internes :{/g} type de biens · poids · volume · durabilité · taux de rotation"
      },
      {
        "kind": "paragraph",
        "text": "{g}Facteurs externes :{/g} règles de construction · environnement · bruit · marchandises dangereuses · circulation"
      },
      {
        "kind": "heading",
        "text": "2.3.1 Centralisé vs décentralisé (production)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Idéal : proximité production. Choix central / décentralisé."
      },
      {
        "kind": "paragraph",
        "text": "{g}Centralisé — avantages :{/g} - stocks plus bas - achats facilités (moins de commandes, plus de volume → rabais) - meilleure exploitation de l'espace - infrastructure optimisée - planification du personnel facilitée"
      },
      {
        "kind": "paragraph",
        "text": "{g}Décentralisé{/g} — si distance trop grande (lourds/volumineux, {g}JIT{/g}). Avantages : flux d'infos ↑ · trajets ↓ · marchandises spéciales mieux coordonnées."
      },
      {
        "kind": "heading",
        "text": "2.4 Entrepôt temporaire",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/402/commun/log-402-notions-2-v001.svg",
        "alt": "Transbordement. Transférer vers le départ. Réserve. Conserver jusqu’au besoin.",
        "caption": "La durée du séjour dépend de la fonction du site."
      },
      {
        "kind": "paragraph",
        "text": "Accueillir temporairement jusqu'à enlèvement/consommation. Ex. : consignes à bagages, casiers, boîtes aux lettres — souvent {g}courte{/g} durée (heures)."
      },
      {
        "kind": "paragraph",
        "text": "Exception : dépôts intermédiaires de déchets radioactifs en Suisse (parfois {g}années{/g} faute de stockage définitif)."
      },
      {
        "kind": "heading",
        "text": "2.5 Entrepôt de maturation",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Produits qui doivent mûrir : fromage (4–12 mois), produits carnés, vin/bière/spiritueux, fruits."
      },
      {
        "kind": "paragraph",
        "text": "Goût évolue (fromage : doux → corsé). Climat décisif ; grottes / anciens ouvrages militaires ; entretien (solution saline)."
      },
      {
        "kind": "paragraph",
        "text": "Fruits exotiques : transport verts → {g}mûrisseries{/g} (ex. bananes des grands distributeurs)."
      }
    ],
    "module": "402",
    "revision": "402-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-402-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Approvisionnement{/g} — Flux vers le site qui consomme ou transforme la marchandise."
      },
      {
        "kind": "paragraph",
        "text": "{g}Centre de distribution{/g} — Site qui regroupe, prépare et répartit les arrivées vers plusieurs destinataires."
      },
      {
        "kind": "paragraph",
        "text": "{g}Emplacement temporaire{/g} — Position utilisée pendant une étape ou attente définie."
      },
      {
        "kind": "paragraph",
        "text": "{g}Entrepôt intermédiaire{/g} — Stock placé entre deux étapes d’un processus."
      },
      {
        "kind": "paragraph",
        "text": "{g}Entrepôt de maturation{/g} — Site où le produit évolue sous des conditions contrôlées."
      },
      {
        "kind": "paragraph",
        "text": "{g}Entrepôt de réserve{/g} — Site ou zone destinée à conserver les biens jusqu’au besoin."
      },
      {
        "kind": "paragraph",
        "text": "{g}Entrepôt de transbordement{/g} — Site de transfert et regroupement entre trajets."
      },
      {
        "kind": "paragraph",
        "text": "{g}Entrepôt régional{/g} — Site servant un périmètre territorial défini."
      },
      {
        "kind": "paragraph",
        "text": "{g}Marchandise en vrac{/g} — Marchandise qui n’est pas conditionnée en unités individuelles équivalentes."
      },
      {
        "kind": "paragraph",
        "text": "{g}Maturation{/g} — Évolution du produit recherchée pendant le stockage."
      },
      {
        "kind": "paragraph",
        "text": "{g}Séjour moyen{/g} — Durée moyenne passée dans la zone considérée."
      },
      {
        "kind": "paragraph",
        "text": "{g}Site géographique{/g} — Localisation choisie en fonction des flux et contraintes."
      }
    ],
    "module": "402",
    "revision": "402-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-402-maths-fiche-1",
    "kind": "maths",
    "prompt": "Trois zones temporaires permettent de traiter 18 unités chacune. Donnez leur capacité totale.",
    "answer": "54 unités.",
    "calculation": "3 × 18 = 54.",
    "module": "402",
    "revision": "402-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-402-maths-fiche-2",
    "kind": "maths",
    "prompt": "Un lot passe 35 minutes au transbordement puis 25 minutes au contrôle. Calculez le séjour cumulé.",
    "answer": "60 minutes.",
    "calculation": "35 + 25 = 60 min.",
    "module": "402",
    "revision": "402-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-402-maths-fiche-3",
    "kind": "maths",
    "prompt": "Deux sites se trouvent à 18 et à 32 km du client. Calculez l’écart sur un aller-retour.",
    "answer": "28 km.",
    "calculation": "(32 − 18) × 2 = 28 km.",
    "module": "402",
    "revision": "402-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-402-maths-fiche-4",
    "kind": "maths",
    "prompt": "La production a 35 bacs en attente. Seize passent à l’étape suivante. Quel solde reste ?",
    "answer": "19 bacs.",
    "calculation": "35 − 16 = 19.",
    "module": "402",
    "revision": "402-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-402-maths-fiche-5",
    "kind": "maths",
    "prompt": "Trois lots de même taille ont séjourné 2, 4 et 9 jours. Donnez le séjour moyen.",
    "answer": "Cinq jours.",
    "calculation": "(2 + 4 + 9) ÷ 3 = 5 jours.",
    "module": "402",
    "revision": "402-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-402-verification-fiche-1",
    "kind": "verification",
    "prompt": "Quel rôle joue l’entrepôt intermédiaire ?",
    "answer": "Découpler deux opérations en conservant temporairement les unités en attente.",
    "module": "402",
    "revision": "402-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-402-verification-fiche-2",
    "kind": "verification",
    "prompt": "Qu’est-ce qui caractérise un site de transbordement ?",
    "answer": "Un séjour bref et une réorientation vers le transport ou la destination suivante.",
    "module": "402",
    "revision": "402-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-402-verification-fiche-3",
    "kind": "verification",
    "prompt": "Pourquoi distribuer depuis un site régional ?",
    "answer": "Pour rapprocher le stock de la demande et tenir un délai de service adapté.",
    "module": "402",
    "revision": "402-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-402-verification-fiche-4",
    "kind": "verification",
    "prompt": "Comment un entrepôt de maturation se distingue-t-il ?",
    "answer": "Les conditions visent une évolution contrôlée du produit.",
    "module": "402",
    "revision": "402-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-402-verification-fiche-5",
    "kind": "verification",
    "prompt": "Quelles caractéristiques du bien influencent le genre de stockage ?",
    "answer": "Dimensions, état, sensibilité, rotation et exigences de contrôle.",
    "module": "402",
    "revision": "402-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-402-situation-fiche-1",
    "kind": "situation",
    "prompt": "Deux livraisons doivent partir dans l’heure vers des clients différents. Quelle zone convient ?",
    "answer": "Une zone de transbordement avec séparation par départ et trace de la destination.",
    "module": "402",
    "revision": "402-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-402-situation-fiche-2",
    "kind": "situation",
    "prompt": "Une étape ralentit et les semi-finis s’accumulent. Que relevez-vous ?",
    "answer": "Quantité, capacité tampon, durée du séjour et impact sur le flux amont et aval.",
    "module": "402",
    "revision": "402-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-402-situation-fiche-3",
    "kind": "situation",
    "prompt": "Vous hésitez entre un site central et deux régionaux. Quels éléments comparez-vous ?",
    "answer": "Temps de service, volumes, coûts, capacités et possibilités de regroupement.",
    "module": "402",
    "revision": "402-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
