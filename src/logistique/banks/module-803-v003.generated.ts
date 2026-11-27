import type { LogistiqueUnit } from '../approved-banks'

export const module803 = [
  {
    "id": "log-803-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "3. Logiciel d'exploitation",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "3.1 ERP (Enterprise Resource Planning)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/800/803/commun/log-803-erp-photo-v002.webp",
        "alt": "Une personne compare le document de réception, un colis et les données affichées.",
        "caption": "La même référence permet de relier commande, entrée de stock et facture."
      },
      {
        "kind": "paragraph",
        "text": "Un {g}ERP{/g} relie des opérations telles que les achats, le stock, la production et la comptabilité. Des modules partagent, selon les interfaces, des références et des événements."
      },
      {
        "kind": "heading",
        "text": "3.2 CRM (Customer Relationship Management)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/200/201/commun/log-201-client-photo-v002.webp",
        "alt": "Un employé remet un colis à un client qui présente un justificatif.",
        "caption": "Le suivi d’une remise et des échanges avec le client peut alimenter les données utiles à la relation."
      },
      {
        "kind": "paragraph",
        "text": "Orientation de l'entreprise vers ses {g}clients{/g} · objectifs : {g}acquisition{/g} et {g}fidélisation{/g}. Collecte des données pertinentes → marketing relationnel aligné sur les besoins."
      },
      {
        "kind": "table",
        "headers": [
          "Sens du CRM",
          "Contenu"
        ],
        "rows": [
          [
            "{g}Logiciel{/g}",
            "Base techno pour saisir, analyser, présenter les interactions client"
          ],
          [
            "{g}Stratégie{/g}",
            "Orientations des processus vers une expérience client optimale"
          ],
          [
            "{g}Processus{/g}",
            "Procédures techno + stratégiques + systématiques d'orientation client"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "3.3 Vente / Marketing",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Vente (sales) :{/g} identification des groupes cibles · approche / acquisition · vente jusqu'à la livraison · de plus en plus le {g}suivi{/g} post-vente (nouvelles ventes)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Marketing :{/g} quels produits / services le marché souhaite · produire ce que les clients achètent (quantité suffisante) · comment influencer l'achat de nouveautés."
      },
      {
        "kind": "heading",
        "text": "3.4 Ressources humaines (RH)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Objectifs : efficacité / productivité · sécurité des postes · capacité de travail et motivation · recrutement / fidélisation à coût raisonnable · climat / culture de direction · alignement sur l'objectif entreprise."
      },
      {
        "kind": "heading",
        "text": "3.5 Planification et contrôle de la production (PCP)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/500/503/cfc/log-503-ligne-photo-v002.webp",
        "alt": "Une ligne alimente plusieurs postes dans l’ordre de fabrication.",
        "caption": "La PCP rapproche les matières disponibles, les moyens et les échéances."
      },
      {
        "kind": "paragraph",
        "text": "Frontière gestion d'entreprise / informatique. Planifier, mettre en place et surveiller la production en {g}quantité{/g} et {g}délais{/g}. Couvre aussi l'amont (approvisionnement) et l'aval (distribution) · {g}gestion des matériaux{/g} centrale."
      },
      {
        "kind": "heading",
        "text": "3.5.1 Tâches",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Planification du travail / temps de passage · gestion du matériel (approvisionnement + stockage) · type et organisation de fabrication · expédition (distribution)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Durée de fabrication{/g} = temps pour passer toutes les étapes · base du taux d'exploitation des machines. Recalcul quotidien (ou +) : pannes / manque de matériel impactent tout."
      },
      {
        "kind": "paragraph",
        "text": "{g}Leviers d'optimisation :{/g} système PCP · ↓ taille des lots · ↓ temps d'adaptation · ↓ transport / attentes / stockage · ↓ stocks."
      },
      {
        "kind": "paragraph",
        "text": "Stocks utiles pour : capacité de livraison · délais de réappro · fluctuations demande · séries économiques. Lien étroit : ↓ temps de passage ↔ ↓ stocks."
      },
      {
        "kind": "heading",
        "text": "3.6 Management de projet",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Gérer un projet {g}quelle que soit sa taille{/g} (du déménagement au grand projet industriel) : objectifs · stratégie · organisation / coordination des facteurs de production · gestion des collaborateurs."
      },
      {
        "kind": "heading",
        "text": "3.7 Management qualité",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Mesures pour une qualité {g}constante{/g} des produits / services. Critique en alimentaire / pharma (santé) · aéronautique : chaque pièce avec {g}certificat{/g} d'origine / matériaux (risque de falsification). Contrôle souvent par spécialistes (poste CQ / labo) · crucial si la prod. dépend de pièces achetées."
      },
      {
        "kind": "heading",
        "text": "3.8 Comptabilité financière (CoFi)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Déterminer le {g}résultat global{/g} · documenter actifs et variations de stocks · bénéfice / perte de la période · utile à l'entreprise, actionnaires, créanciers · {g}compte de résultat{/g} + {g}bilan{/g}."
      },
      {
        "kind": "heading",
        "text": "3.8.1 Comptabilité",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "Domaine",
          "Contenu"
        ],
        "rows": [
          [
            "{g}Créanciers{/g}",
            "Obligations de paiement · factures {g}entrantes{/g} (fournisseur)"
          ],
          [
            "{g}Débiteurs{/g}",
            "Créances de l'entreprise · factures {g}sortantes{/g} (client)"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "3.8.2 Controlling",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Contrôle de gestion : contrôler les opérations · analyses → rentabilité, bénéfices, valeur."
      },
      {
        "kind": "heading",
        "text": "3.9 Gestion de matériel (GM)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Gestion, planification et contrôle des {g}mouvements de matériel{/g} (marchandises / biens). En production : approvisionner la fab. · lien étroit avec la {g}PCP{/g}. International : « Materials Management »."
      },
      {
        "kind": "heading",
        "text": "3.9.1 Achat",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Activités opérationnelles et stratégiques d'{g}acquisition{/g} (matériaux, marchandises, moyens d'exploitation, services) — module {g}301{/g}. Plus étroit que {g}approvisionnement{/g} (qui inclut aussi la logistique d'appro). Objectif : lieu / délai / quantité / qualité + rapport qualité-prix. Inclut souvent la {g}gestion des relations fournisseurs{/g}."
      },
      {
        "kind": "heading",
        "text": "3.9.2 E-Commerce (WebEDI)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Le commerce électronique couvre des opérations réalisées en ligne. L'{g}EDI{/g} échange des données structurées entre partenaires, par exemple commandes, avis d'expédition et factures. Le {g}WebEDI{/g} permet à un partenaire d'utiliser un portail pour ces échanges."
      }
    ],
    "summaryBlocks": [
      {
        "kind": "heading",
        "text": "3. Logiciel d'exploitation",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "3.1 ERP (Enterprise Resource Planning)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/800/803/commun/log-803-erp-photo-v002.webp",
        "alt": "Une personne compare le document de réception, un colis et les données affichées.",
        "caption": "La même référence permet de relier commande, entrée de stock et facture."
      },
      {
        "kind": "paragraph",
        "text": "Un {g}ERP{/g} relie plusieurs activités avec des données communes. À la réception, un numéro d’article et une commande permettent de confirmer le stock et de rapprocher la facture. Distinguez la {g}donnée de base{/g} et le {g}mouvement{/g} enregistré."
      },
      {
        "kind": "heading",
        "text": "3.2 à 3.4 Relation client, vente et RH",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/200/201/commun/log-201-client-photo-v002.webp",
        "alt": "Un employé remet un colis à un client qui présente un justificatif.",
        "caption": "Le suivi d’une remise et des échanges avec le client peut alimenter les données utiles à la relation."
      },
      {
        "kind": "paragraph",
        "text": "Le {g}CRM{/g} organise les relations et les échanges avec les clients. La vente suit les offres, commandes et retours. Le marketing observe le marché et présente l’offre. Les {g}RH{/g} organisent des données et activités liées au personnel selon les autorisations."
      },
      {
        "kind": "heading",
        "text": "3.5 Planification et contrôle de la production (PCP)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/500/503/cfc/log-503-ligne-photo-v002.webp",
        "alt": "Une ligne alimente plusieurs postes dans l’ordre de fabrication.",
        "caption": "La PCP rapproche les matières disponibles, les moyens et les échéances."
      },
      {
        "kind": "paragraph",
        "text": "La {g}PCP{/g} rapproche les quantités, les délais, les capacités et les matières. Elle suit l’ordre de fabrication et ajuste en cas d’écart. Un {g}management de projet{/g} coordonne des tâches et ressources. Un système {g}qualité{/g} suit des exigences et contrôles."
      },
      {
        "kind": "heading",
        "text": "3.8 à 3.9 Finances et matériel",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "La {g}CoFi{/g} produit notamment bilan et résultat. Les {g}créanciers{/g} correspondent aux sommes dues aux fournisseurs et les {g}débiteurs{/g} aux créances sur des clients. Le {g}controlling{/g} analyse les résultats pour aider les décisions. La {g}gestion de matériel{/g} suit achats, stocks et mouvements. L’{g}EDI{/g} communique des documents structurés. Le {g}WebEDI{/g} utilise notamment un portail."
      }
    ],
    "module": "803",
    "revision": "803-v003",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
