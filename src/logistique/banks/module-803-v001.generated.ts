import type { LogistiqueUnit } from '../approved-banks'

export const module803 = [
  {
    "id": "log-803-objectifs-apercu",
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
          "Expliquer le rôle d'un {g}ERP{/g} et des modules associés",
          "Distinguer CRM logiciel / stratégie / processus et situer vente, marketing, RH",
          "Décrire les tâches de la {g}PCP{/g} et les leviers de réduction des temps / stocks",
          "Situer {g}CoFi{/g} (créanciers / débiteurs), controlling, {g}GM{/g} et e-commerce dans le système d'info"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 803",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Relier une commande, ses mouvements de matériel et sa facture dans le système.",
          "Reconnaître les responsabilités des modules de production, relation client, stock et comptabilité.",
          "Vérifier une donnée avant sa validation afin de limiter les erreurs en aval."
        ]
      }
    ],
    "module": "803",
    "revision": "803-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
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
        "src": "/assets/logistique/800/803/commun/log-803-notions-1-v001.svg",
        "alt": "Achats. Commande de 50 pièces. Gestion de matériel. Réception de 20 pièces. Comptabilité. Facture à rapprocher.",
        "caption": "La même référence lie les écritures opérationnelles."
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
        "src": "/assets/logistique/800/803/commun/log-803-notions-2-v001.svg",
        "alt": "Besoin. Quantité et date cible. Capacité. Matières, machines et temps. Suivi. Avancement et écarts.",
        "caption": "Le contrôle actualise les données après le lancement."
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
    "module": "803",
    "revision": "803-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-803-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}ERP{/g} — Progiciel qui relie plusieurs activités de l'entreprise au moyen de données et processus partagés."
      },
      {
        "kind": "paragraph",
        "text": "{g}CRM{/g} — Gestion des relations avec les clients et système qui la soutient."
      },
      {
        "kind": "paragraph",
        "text": "{g}PCP{/g} — Planification et contrôle de la production, notamment des ressources et des délais."
      },
      {
        "kind": "paragraph",
        "text": "{g}Gestion de matériel{/g} — Organisation des approvisionnements, stocks et mouvements."
      },
      {
        "kind": "paragraph",
        "text": "{g}Donnée de base{/g} — Information stable utilisée par plusieurs opérations, comme une référence article."
      },
      {
        "kind": "paragraph",
        "text": "{g}Mouvement{/g} — Événement enregistré qui modifie un stock, un état ou une localisation."
      },
      {
        "kind": "paragraph",
        "text": "{g}Créancier{/g} — Tiers auquel l'entreprise doit un montant, par exemple un fournisseur."
      },
      {
        "kind": "paragraph",
        "text": "{g}Débiteur{/g} — Tiers redevable d'un montant envers l'entreprise, par exemple un client facturé."
      },
      {
        "kind": "paragraph",
        "text": "{g}Contrôle de gestion{/g} — Analyse des résultats et écarts pour éclairer les décisions."
      },
      {
        "kind": "paragraph",
        "text": "{g}EDI{/g} — Échange électronique structuré de documents entre systèmes."
      },
      {
        "kind": "paragraph",
        "text": "{g}Ordre de fabrication{/g} — Instruction précisant un travail de production et les quantités concernées."
      },
      {
        "kind": "paragraph",
        "text": "{g}Traçabilité{/g} — Possibilité de retrouver les étapes et données d'une opération."
      }
    ],
    "module": "803",
    "revision": "803-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-803-maths-fiche-1",
    "kind": "maths",
    "prompt": "L'ERP enregistre 48 pièces au départ, une entrée de 30 et une sortie de 17. Quel solde affiche-t-il ?",
    "answer": "61 pièces",
    "calculation": "48 + 30 − 17 = 61.",
    "module": "803",
    "revision": "803-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-803-maths-fiche-2",
    "kind": "maths",
    "prompt": "Vous commandez 60 bacs et recevez déjà 45. Quel reste est à livrer ?",
    "answer": "15 bacs",
    "calculation": "60 − 45 = 15.",
    "module": "803",
    "revision": "803-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-803-maths-fiche-3",
    "kind": "maths",
    "prompt": "Une facture fournisseur porte sur 24 unités à CHF 11,50, sans frais. Quel total vérifier ?",
    "answer": "CHF 276",
    "calculation": "24 × 11,50 = 276.",
    "module": "803",
    "revision": "803-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-803-maths-fiche-4",
    "kind": "maths",
    "prompt": "Une fabrication requiert 3 vis par produit et l'ordre porte sur 40 produits. Combien prévoir ?",
    "answer": "120 vis",
    "calculation": "40 × 3 = 120.",
    "module": "803",
    "revision": "803-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-803-maths-fiche-5",
    "kind": "maths",
    "prompt": "Le lot traverse 25 min de préparation, 40 min d'exécution et 15 min d'attente. Calculez le temps de traversée.",
    "answer": "80 min",
    "calculation": "25 + 40 + 15 = 80.",
    "module": "803",
    "revision": "803-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-803-maths-fiche-6",
    "kind": "maths",
    "prompt": "Le temps prévu est 150 min, le temps mesuré 165 min. Calculez l'écart relatif au prévu.",
    "answer": "+10 %",
    "calculation": "(165 − 150) ÷ 150 × 100 = 10.",
    "module": "803",
    "revision": "803-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-803-verification-fiche-1",
    "kind": "verification",
    "prompt": "Quel intérêt présente la référence commune de l'article entre achat et stock ?",
    "answer": "Elle rattache les opérations au bon article et réduit les rapprochements manuels.",
    "module": "803",
    "revision": "803-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-803-verification-fiche-2",
    "kind": "verification",
    "prompt": "Quel module conserve typiquement l'historique d'un contact commercial ?",
    "answer": "Le CRM.",
    "module": "803",
    "revision": "803-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-803-verification-fiche-3",
    "kind": "verification",
    "prompt": "Que planifie la PCP en plus de la quantité à fabriquer ?",
    "answer": "Par exemple la date, la capacité, la main-d'œuvre, les machines et les matières nécessaires.",
    "module": "803",
    "revision": "803-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-803-verification-fiche-4",
    "kind": "verification",
    "prompt": "Une facture d'achat non réglée concerne quel domaine de la comptabilité ?",
    "answer": "Les créanciers ou comptes fournisseurs.",
    "module": "803",
    "revision": "803-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-803-verification-fiche-5",
    "kind": "verification",
    "prompt": "Donnez un exemple de mesure de contrôle de gestion de l'entrepôt.",
    "answer": "Le coût par commande, la valeur de stock, un écart budgétaire ou un indicateur de productivité.",
    "module": "803",
    "revision": "803-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-803-situation-fiche-1",
    "kind": "situation",
    "prompt": "Une commande de 50 unités arrive en deux livraisons et la première contient 20 unités. Que faut-il saisir et transmettre ?",
    "answer": "Enregistrer la réception de 20 sur la bonne commande, contrôler la quantité ouverte de 30 et signaler l'échéance si nécessaire.",
    "module": "803",
    "revision": "803-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-803-situation-fiche-2",
    "kind": "situation",
    "prompt": "Le fichier article indique la pièce, mais un collègue a saisi un carton comme une pièce. Que faites-vous ?",
    "answer": "Vérifier la référence, le conditionnement et le mouvement, faire corriger l'écriture avec sa trace et vérifier le solde.",
    "module": "803",
    "revision": "803-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-803-situation-fiche-3",
    "kind": "situation",
    "prompt": "Un ordre de fabrication est bloqué par une pièce manquante. Quels services associer à la résolution ?",
    "answer": "Production ou PCP pour le besoin et l'échéance, stock pour le solde réel, achats pour le délai ou une alternative validée.",
    "module": "803",
    "revision": "803-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
