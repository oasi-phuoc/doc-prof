import type { LogistiqueUnit } from '../approved-banks'

export const module306 = [
  {
    "id": "log-306-objectifs-apercu",
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
          "Définir un {g}contenant{/g} / support de charge et citer les principaux types de palettes",
          "Appliquer les {g}critères d'échange{/g} Euro / EPAL (palettes, cadres, couvercles)",
          "Distinguer pool {g}ouvert{/g} et pool {g}fermé{/g} (CHEP) et les modes d'échange",
          "Identifier des supports {g}spéciaux{/g} et sur roulettes",
          "Différencier emballages {g}à usage unique{/g} et {g}réutilisables{/g}"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 306",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Identifier le support de charge et son circuit ouvert, fermé ou spécifique.",
          "Contrôler l’état du support avant de le mettre en service ou de l’échanger.",
          "Comptabiliser les supports et documenter les écarts du dossier."
        ]
      }
    ],
    "module": "306",
    "revision": "306-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-306-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "6. Contrôle des contenants",
        "sub": false
      },
      {
        "kind": "paragraph",
        "text": "Après l'identification détaillée (module {g}304{/g}), on contrôle souvent les {g}emballages / contenants{/g} pendant ou après le déchargement. Contrôle consciencieux = assez de {g}temps{/g} et d'{g}espace{/g}."
      },
      {
        "kind": "heading",
        "text": "6.1 Qu'est-ce qu'un contenant ?",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Regroupement de marchandises/matériaux en une {g}nouvelle unité{/g} pour simplifier transport, stockage et déstockage."
      },
      {
        "kind": "paragraph",
        "text": "Exemples : unités palettisées · fûts · récipients plastique · caisses bois…"
      },
      {
        "kind": "paragraph",
        "text": "{g}Coûts{/g} non négligeables. Exemple (situation 2022) — Euro palette avec cadres :"
      },
      {
        "kind": "table",
        "headers": [
          "Désignation",
          "Qté",
          "Coût unitaire",
          "Total"
        ],
        "rows": [
          [
            "Palette Euro",
            "1",
            "CHF 18.30",
            "CHF 18.30"
          ],
          [
            "Cadre Euro",
            "3",
            "CHF 48.–",
            "CHF 144.–"
          ],
          [
            "Couvercle Euro",
            "1",
            "CHF 17.80",
            "CHF 17.80"
          ],
          [
            "{g}Total contenants{/g}",
            "",
            "",
            "{g}CHF 180.10{/g}"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "Sur une livraison complète, les coûts montent vite → travailler concentré et {g}éviter les pertes{/g} à l'échange."
      },
      {
        "kind": "heading",
        "text": "6.2 Le support de charge",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/306/commun/log-306-notions-1-v001.svg",
        "alt": "Marchandise. Caractéristiques et masse. Support. Type, état et limites. Unité. Contrôlée et tracée.",
        "caption": "Vérifier le support, la marchandise et leur compatibilité."
      },
      {
        "kind": "paragraph",
        "text": "Marchandises empilées sur supports de charge ; la {g}palette{/g} s'est imposée mondialement, mais {g}pas{/g} de dimensions uniques."
      },
      {
        "kind": "table",
        "headers": [
          "Région / type",
          "Dimensions (L × l × h)",
          "Poids approx.",
          "Remarques"
        ],
        "rows": [
          [
            "Euro type {g}1{/g}",
            "1200 × 800 × 144 mm",
            "22 kg",
            "Standard le plus courant"
          ],
          [
            "Euro type {g}2{/g}",
            "1200 × 1000 × 162 mm",
            "~28 kg",
            "« Textile »"
          ],
          [
            "Euro type {g}3{/g}",
            "1200 × 1200 × 162 mm",
            "~35 kg",
            "« Chimique » / « Baloise » · EPAL 3 charges lourdes"
          ],
          [
            "Euro type {g}6{/g}",
            "600 × 800 × 144 mm",
            "~18 kg",
            "Demi-palette / Düsseldorf"
          ],
          [
            "{g}USA{/g}",
            "48\" × 40\" (1219 × 1016 mm)",
            "~30 kg",
            "Palette américaine"
          ],
          [
            "{g}Asie{/g}",
            "1100 × 1100 × 144 mm",
            "~28 kg",
            "Conteneurs outre-mer (larg. 2430 mm)"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "Souvent aussi des palettes {g}sur mesure{/g} hors normes."
      },
      {
        "kind": "heading",
        "text": "6.2.1 Support de charge selon EURO",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Le type 1 constitue un format courant dans les circuits européens. L’échange dépend des règles applicables au pool et du bon état du support."
      },
      {
        "kind": "paragraph",
        "text": "{g}Pool européen de palettes (EPP){/g} : initié CFF 1952 (pool CH) → chemins de fer allemands 1962 (EPP). Union ferroviaire pour simplifier transports via palettes (et cadres/couvercles) échangeables."
      },
      {
        "kind": "paragraph",
        "text": "{g}Charges Euro palette type 1 :{/g} - La capacité dépend du support, de la répartition, de l’état et des conditions d’utilisation. - Vérifier le marquage et les indications du fabricant ou du gestionnaire. - Vérifier ensuite la compatibilité avec l’équipement et l’installation."
      },
      {
        "kind": "heading",
        "text": "Critères d'échange — palettes",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Non échangeables si non conformes construction/marquage {g}ou{/g} défauts : 1. Planche manquante 2. Planche cassée transversalement/obliquement 3. Accrocs laissant apparaître tiges/têtes de clous (seuils selon planches) 4. Plot manquant ou fendu (plus d'un clou visible) 5. Marque {g}EPAL{/g} ou {g}EUR{/g} manquante"
      },
      {
        "kind": "paragraph",
        "text": "Aussi non échangeables : mauvais état général · capacité de charge non garantie · trop sales · plusieurs plots fendus · composants non conformes."
      },
      {
        "kind": "heading",
        "text": "Critères — cadres et couvercles (Suisse)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Cadres{/g} non échangeables si : signes non conformes · paroi enfoncée · fente avec tige de vis · parois intérieures très sales · plusieurs parois endommagées · mauvais état général."
      },
      {
        "kind": "paragraph",
        "text": "{g}Couvercles{/g} non échangeables si : planche manquante/cassée/fendue avec clous visibles · arête bordure cassée > moitié longueur et brèche > 20 cm · sigle chemins de fer manquant/illisible."
      },
      {
        "kind": "heading",
        "text": "6.3 EPAL (European Pallet Association)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Organisation faîtière fabricants/réparateurs de supports EPAL ; plus grand pool {g}ouvert{/g} ; assurance qualité (fabrication et réparation sous EPAL)."
      },
      {
        "kind": "heading",
        "text": "6.3.1 Normes de qualité (repères)",
        "sub": true
      },
      {
        "kind": "list",
        "items": [
          "1. Marque EPAL",
          "2. Marque compagnie ferroviaire européenne",
          "3. Marque pool (EPAL ou EUR)",
          "4. Plan de cloutage standardisé",
          "5. Planches inférieures chanfreinées",
          "6. Pas de moisissure",
          "7. Agrafe de contrôle qualité EPAL",
          "8. Après réparation : clou de réparation EPAL"
        ]
      },
      {
        "kind": "heading",
        "text": "6.4 Procédure d'échange de palettes EURO",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/306/commun/log-306-notions-2-v001.svg",
        "alt": "Identifier. Marquage et circuit. Contrôler. État et conformité. Inscrire. Quantité et solde.",
        "caption": "Un dossier d’échange distingue quantité et état des supports."
      },
      {
        "kind": "paragraph",
        "text": "Centaines de palettes/jour possibles → à restituer (coût)."
      },
      {
        "kind": "heading",
        "text": "6.4.1 Pools d'engins échangeables",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "*Pool* = « réservoir ». Adhésion {g}non{/g} obligatoire."
      },
      {
        "kind": "list",
        "items": [
          "{g}Ouvert{/g} : engins propriété des participants ; remise ↔ remplacement de même valeur ; règlement. 3 variantes d'échange (évite de tout recharger).",
          "{g}Fermé{/g} : voir CHEP (§ 6.5)"
        ]
      },
      {
        "kind": "heading",
        "text": "6.4.2 Échange standard (pièce contre pièce)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Ex. : 30 Euro palettes livrées → 30 vides rendues. Coûts équilibrés ; échanger des palettes {g}équivalentes{/g}."
      },
      {
        "kind": "heading",
        "text": "6.4.3 Échange contre un bon",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Si pas assez de vides : {g}bon{/g} (forme libre) reconnaissant la dette (type + nombre). Valable juridiquement avec {g}signature{/g} d'un collaborateur."
      },
      {
        "kind": "heading",
        "text": "6.4.4 Échange avec compte courant",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Registre (papier/Excel/portail) des entrées/sorties. {g}Solde{/g} : positif pour l'un, négatif pour l'autre → le solde négatif a droit aux engins. Ex. : Portail de palettes ou fichier Excel partagé."
      },
      {
        "kind": "heading",
        "text": "6.5 Support de charge selon CHEP",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "*Commonwealth Handling Equipment Pool* — alternative aux euros. Origine Australie (WW2 / AMHSC) ; aujourd'hui ~220 centres / 35 pays. « Palettes {g}bleues{/g} » ; aussi quarts 600×400 et USA."
      },
      {
        "kind": "heading",
        "text": "6.5.1 Pool fermé",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Une entreprise propriétaire loue aux autres. Différences vs ouvert : - {g}Location{/g} (collecte + réparation incluses), pas d'achat - {g}Pas{/g} d'échange pièce à pièce : on informe CHEP (nombre, type, destinataire) - Vides → point de collecte CHEP"
      },
      {
        "kind": "heading",
        "text": "6.6 Supports de charge spéciaux",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "Type",
          "Caractéristiques"
        ],
        "rows": [
          [
            "Palette {g}tôle d'acier{/g}",
            "Jusqu'à 2 t ; 1200×800, 1000×800, 1200×1000"
          ],
          [
            "Palette {g}synthétique{/g}",
            "Couleurs/dimensions variées ; zones humides, chimie, alimentaire"
          ],
          [
            "Palettes {g}INKA{/g}",
            "Empilables, usage unique marchandises légères ; copeaux compressés"
          ],
          [
            "Palette à {g}fûts{/g}",
            "Fûts couchés"
          ],
          [
            "{g}Pal-Box{/g}",
            "Carton + plots styropor ; fourches/transpalette"
          ],
          [
            "{g}Cadre grillagé{/g}",
            "Désormais échangeable EPP si critères OK"
          ],
          [
            "{g}Box-palettes{/g} métal",
            "Vrac (copeaux, verre…), déchets/recyclage"
          ],
          [
            "{g}Box à claire-voie{/g}",
            "Fruits/légumes, aération ; saisonniers"
          ],
          [
            "{g}Varitainers{/g} / palettes réservoirs",
            "Liquides / vrac fin ; parfois MD ; dims Euro"
          ],
          [
            "Conteneurs {g}réservoirs{/g}",
            "0,8–1,2 m³ ; agroalimentaire"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "6.6.1 Matériels auxiliaires (non échangeables pool)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Supports {g}frontaux{/g} (rouleaux, balles) · supports {g}latéraux{/g} (aide empilage) — adaptés Euro I, {g}hors{/g} accord pool."
      },
      {
        "kind": "heading",
        "text": "6.7 Supports de charge sur roulettes",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Manipulation / transbordement facilités."
      },
      {
        "kind": "list",
        "items": [
          "{g}Palettes à roulettes{/g} — métal, montants rabattables, roulettes d'un côté → rouler en soulevant l'autre (wagons)",
          "{g}Rollcontainers{/g} — petits lots courts trajets ; approvisionnement magasins ; barres en camion",
          "{g}Conteneur de collecte{/g} (ex. Poste) — conteneurs de courrier (BB)"
        ]
      },
      {
        "kind": "heading",
        "text": "6.8 Emballages à usage unique",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Utilisés {g}une{/g} fois puis éliminés → coûts déchets + impact environnemental ; souvent encore indispensables. → module {g}602{/g}."
      },
      {
        "kind": "heading",
        "text": "6.9 Emballages réutilisables",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Conçus pour plusieurs usages ; pas de déchet direct si le circuit est respecté. Souvent plastique (ex. Dispo-Box → module {g}602{/g})."
      }
    ],
    "module": "306",
    "revision": "306-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-306-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Bac réutilisable{/g} — Contenant destiné à plusieurs cycles d’usage dans un circuit."
      },
      {
        "kind": "paragraph",
        "text": "{g}Circuit fermé{/g} — Gestion où les supports restent sous la responsabilité du prestataire ou pool désigné."
      },
      {
        "kind": "paragraph",
        "text": "{g}Circuit ouvert{/g} — Système d’échange de supports conformes selon les règles d’un pool."
      },
      {
        "kind": "paragraph",
        "text": "{g}Contenant{/g} — Objet qui contient ou regroupe la marchandise."
      },
      {
        "kind": "paragraph",
        "text": "{g}Convention d’échange{/g} — Règles définissant les supports et conditions d’un échange."
      },
      {
        "kind": "paragraph",
        "text": "{g}Déclassement{/g} — Retrait d’une catégorie d’usage ou d’échange après constat d’écart."
      },
      {
        "kind": "paragraph",
        "text": "{g}EPAL{/g} — Association qui définit des spécifications et règles pour ses palettes et son système."
      },
      {
        "kind": "paragraph",
        "text": "{g}Palette{/g} — Plateau compatible avec des moyens de manutention prévus."
      },
      {
        "kind": "paragraph",
        "text": "{g}Pool{/g} — Ensemble de supports gérés suivant des règles communes."
      },
      {
        "kind": "paragraph",
        "text": "{g}Rollbox{/g} — Support roulant utilisé pour regrouper et transporter des articles."
      },
      {
        "kind": "paragraph",
        "text": "{g}Support de charge{/g} — Équipement qui regroupe les marchandises en unité manipulable."
      },
      {
        "kind": "paragraph",
        "text": "{g}Tare{/g} — Masse du support vide dans le calcul considéré."
      }
    ],
    "module": "306",
    "revision": "306-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-306-maths-fiche-1",
    "kind": "maths",
    "prompt": "Un véhicule arrive avec 27 palettes et en reprend 21. Calculez le solde dû au transporteur selon une règle d’échange à l’unité.",
    "answer": "Six palettes.",
    "calculation": "27 − 21 = 6.",
    "module": "306",
    "revision": "306-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-306-maths-fiche-2",
    "kind": "maths",
    "prompt": "Une palette vide pèse 22 kg et l’ensemble 382 kg. Calculez la masse de marchandise.",
    "answer": "360 kg.",
    "calculation": "382 − 22 = 360 kg.",
    "module": "306",
    "revision": "306-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-306-maths-fiche-3",
    "kind": "maths",
    "prompt": "Une palette mesure 1,20 m sur 0,80 m. Calculez la surface nominale.",
    "answer": "0,96 m².",
    "calculation": "1,20 × 0,80 = 0,96 m².",
    "module": "306",
    "revision": "306-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-306-maths-fiche-4",
    "kind": "maths",
    "prompt": "Il faut ranger 43 caisses, au plus six par unité fictive. Combien d’unités faut-il au minimum ?",
    "answer": "Huit unités.",
    "calculation": "7 × 6 = 42. Une unité de plus est nécessaire.",
    "module": "306",
    "revision": "306-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-306-maths-fiche-5",
    "kind": "maths",
    "prompt": "Sur 250 supports, 17 sont écartés. Calculez le taux.",
    "answer": "6,8 %.",
    "calculation": "17 ÷ 250 × 100 = 6,8 %.",
    "module": "306",
    "revision": "306-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-306-maths-fiche-6",
    "kind": "maths",
    "prompt": "Le compte initial est débiteur de 13 supports. Vous en rendez 17 et en recevez cinq à comptabiliser en dette. Donnez le nouveau solde dû.",
    "answer": "Un support reste dû.",
    "calculation": "13 − 17 + 5 = 1.",
    "module": "306",
    "revision": "306-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-306-verification-fiche-1",
    "kind": "verification",
    "prompt": "Quel rôle remplit le support de charge ?",
    "answer": "Regrouper la marchandise pour la manutention, le stockage et le transport.",
    "module": "306",
    "revision": "306-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-306-verification-fiche-2",
    "kind": "verification",
    "prompt": "Pourquoi contrôler l’état avant un échange ?",
    "answer": "L’échange dépend de critères de conformité. Un support dégradé peut aussi poser un risque d’usage.",
    "module": "306",
    "revision": "306-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-306-verification-fiche-3",
    "kind": "verification",
    "prompt": "En quoi un circuit fermé diffère-t-il d’un échange ouvert ?",
    "answer": "Le fermé suit le gestionnaire et ses règles. L’ouvert permet l’échange entre participants selon la convention.",
    "module": "306",
    "revision": "306-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-306-verification-fiche-4",
    "kind": "verification",
    "prompt": "Que signifie la tare d’une palette ?",
    "answer": "Sa masse vide.",
    "module": "306",
    "revision": "306-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-306-verification-fiche-5",
    "kind": "verification",
    "prompt": "Citez deux données à consigner dans un compte de palettes.",
    "answer": "Par exemple la référence du dossier et les quantités entrées, sorties ou restant dues.",
    "module": "306",
    "revision": "306-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-306-verification-fiche-6",
    "kind": "verification",
    "prompt": "À quel document vérifiez-vous la charge admissible d’un support précis ?",
    "answer": "Au marquage et à la documentation du support, en tenant compte des conditions et du matériel utilisés.",
    "module": "306",
    "revision": "306-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-306-situation-fiche-1",
    "kind": "situation",
    "prompt": "Une palette est cassée à la réception. Que faites-vous ?",
    "answer": "L’isoler ou signaler selon les consignes, documenter le défaut et ne pas l’accepter comme support conforme.",
    "module": "306",
    "revision": "306-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-306-situation-fiche-2",
    "kind": "situation",
    "prompt": "Deux supports appartiennent à des circuits différents. Comment traitez-vous l’échange ?",
    "answer": "Identifier les marquages et appliquer à chacun les règles du gestionnaire ou du dossier.",
    "module": "306",
    "revision": "306-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-306-situation-fiche-3",
    "kind": "situation",
    "prompt": "Un document annonce 18 supports, 16 sont retournés. Que consignerez-vous ?",
    "answer": "Les 18 attendus, les 16 constatés et la différence de deux, avec la référence et la suite.",
    "module": "306",
    "revision": "306-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-306-situation-fiche-4",
    "kind": "situation",
    "prompt": "Une caisse sort de la zone de réemploi. Quel contrôle précède sa réattribution ?",
    "answer": "Vérifier état, identification, compatibilité avec l’usage et disponibilité dans le circuit.",
    "module": "306",
    "revision": "306-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
