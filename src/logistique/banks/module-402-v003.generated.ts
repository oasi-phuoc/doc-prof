import type { LogistiqueUnit } from '../approved-banks'

export const module402 = [
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
        "kind": "image",
        "src": "/assets/logistique/300/312/commun/log-312-froid-photo-v002.webp",
        "alt": "Des cartons attendent dans un local doté d’une porte isolante.",
        "caption": "Une marchandise sensible peut nécessiter un espace dont la température est suivie."
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
        "src": "/assets/logistique/600/612/cfc/log-612-cross-dock-photo-v002.webp",
        "alt": "Des unités sont regroupées à deux quais de départ et d’arrivée.",
        "caption": "Les unités en transit attendent une étape suivante. Identifiez la destination et suivez le temps entre mise à disposition et départ."
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
        "kind": "image",
        "src": "/assets/logistique/400/402/commun/log-402-maturation-photo-v002.webp",
        "alt": "Des bananes à différents stades se trouvent près de caisses ventilées.",
        "caption": "La maturation se conduit dans les conditions adaptées au produit. Identifiez les lots et contrôlez leur stade."
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
    "summaryBlocks": [
      {
        "kind": "heading",
        "text": "2. Les genres de stockage",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "2.1 Distinction selon les marchandises",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/312/commun/log-312-froid-photo-v002.webp",
        "alt": "Des cartons attendent dans un local doté d’une porte isolante.",
        "caption": "Une marchandise sensible peut nécessiter un espace dont la température est suivie."
      },
      {
        "kind": "paragraph",
        "text": "Adaptez le stockage à la forme, à la masse, au conditionnement et à la conservation. Une marchandise en {g}vrac{/g}, un colis, un liquide et une palette demandent des installations différentes. Un produit sensible peut nécessiter température réglée, ventilation, séparation ou local conforme à ses consignes."
      },
      {
        "kind": "heading",
        "text": "2.2 et 2.3 Secteur et emplacement",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Industrie, commerce et logistique utilisent des stocks à des endroits différents de la chaîne. Un {g}site central{/g} concentre les ressources. Des sites {g}décentralisés{/g} peuvent rapprocher le stock du client. Comparez délai, transport, place, coûts et continuité du service."
      },
      {
        "kind": "heading",
        "text": "2.4 Entrepôt temporaire",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/600/612/cfc/log-612-cross-dock-photo-v002.webp",
        "alt": "Des unités sont regroupées à deux quais de départ et d’arrivée.",
        "caption": "Les unités en transit attendent une étape suivante. Identifiez la destination et suivez le temps entre mise à disposition et départ."
      },
      {
        "kind": "paragraph",
        "text": "L’{g}entrepôt temporaire{/g} reçoit des marchandises avant une étape suivante, comme un contrôle ou un transfert. Suivez l’identifiant, l’heure, le statut et la destination même pour un séjour court."
      },
      {
        "kind": "heading",
        "text": "2.5 Entrepôt de maturation",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/402/commun/log-402-maturation-photo-v002.webp",
        "alt": "Des bananes à différents stades se trouvent près de caisses ventilées.",
        "caption": "La maturation se conduit dans les conditions adaptées au produit. Identifiez les lots et contrôlez leur stade."
      },
      {
        "kind": "paragraph",
        "text": "Un {g}entrepôt de maturation{/g} maintient des conditions permettant au produit d’évoluer. Pour des bananes, suivez stade, circulation d’air et exigences de température selon la procédure. Prenez une décision sur le lot selon les mesures et critères de qualité."
      }
    ],
    "module": "402",
    "revision": "402-v003",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
