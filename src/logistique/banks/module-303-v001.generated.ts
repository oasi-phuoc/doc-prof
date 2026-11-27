import type { LogistiqueUnit } from '../approved-banks'

export const module303 = [
  {
    "id": "log-303-objectifs-apercu",
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
          "Relier la réception de marchandises aux bases du {g}CO{/g} (acheteur, transporteur, dépôt)",
          "Expliquer l'acceptation en vente mobilière ({g}donnant donnant{/g}, comptant, facture)",
          "Distinguer réception {g}planifiée{/g} et {g}non planifiée{/g} et citer les préparatifs utiles",
          "Décrire le rôle d'un {g}ERP{/g} et les infos de contrôle à l'entrée"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 303",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Préparer un créneau de réception, avec les documents et les moyens nécessaires.",
          "Distinguer réception physique, contrôle et disponibilité de la marchandise.",
          "Traiter une arrivée imprévue et transmettre les écarts observés."
        ]
      }
    ],
    "module": "303",
    "revision": "303-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-303-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "3. Processus de réception des marchandises",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "3.1 Réception des marchandises",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/303/commun/log-303-notions-1-v001.svg",
        "alt": "Arrivée. Véhicule et documents. Contrôle. Articles, état et quantité. Statut. Disponible ou bloqué.",
        "caption": "La réception physique précède la libération prévue par le site."
      },
      {
        "kind": "paragraph",
        "text": "Activité centrale de la logistique. Après le processus d'approvisionnement, vient la {g}réception des marchandises{/g}."
      },
      {
        "kind": "heading",
        "text": "3.1.1 La base juridique",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Trois situations fréquentes, réglementées dans le {g}Code des obligations (CO){/g} :"
      },
      {
        "kind": "table",
        "headers": [
          "Situation",
          "Domaine logistique",
          "Base CO"
        ],
        "rows": [
          [
            "{g}Acceptation en tant qu’acheteur{/g} d’un bien mobilier",
            "Approvisionnement",
            "CO, art. 184–215. Vérifier les règles applicables si la vente est internationale."
          ],
          [
            "{g}Acceptation en tant que transporteur{/g}",
            "Transport",
            "Titre 16e Contrat de transport · art. {g}440–457{/g}"
          ],
          [
            "{g}Acceptation pour conservation{/g}",
            "Stockage",
            "Titre 19e Contrat de dépôt · art. {g}472–491{/g}"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "3.2 Acceptation en tant qu'acheteur (vente mobilière)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}CO art. 184 al. 1 et 2 :{/g} - Par le contrat de vente, le vendeur s'engage à {g}remettre{/g} l'objet ; l'acheteur à {g}payer{/g} le prix. - Sauf accord contraire : prestations en même temps ({g}« donnant donnant »{/g}). - Le prix est suffisamment déterminé s'il peut l'être selon les circonstances."
      },
      {
        "kind": "paragraph",
        "text": "{g}Rappel (module 302) — droits / obligations :{/g}"
      },
      {
        "kind": "table",
        "headers": [
          "",
          "Droits",
          "Obligations"
        ],
        "rows": [
          [
            "{g}Acheteur{/g}",
            "Obtenir la chose et en devenir propriétaire ; en cas de vice : remplacement, réduction ou rédhibition",
            "Payer le prix dans les délais"
          ],
          [
            "{g}Vendeur{/g}",
            "Recevoir le paiement",
            "Transmettre la chose et céder la propriété"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "3.2.1 Acceptation lors de l'achat au comptant",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "« Donnant donnant » = chaque partie remplit successivement sa part : 1. Je prends l'objet dans le rayon 2. À la caisse, je {g}paie{/g} avant de quitter le magasin"
      },
      {
        "kind": "heading",
        "text": "3.2.2 Achat sur facture",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Le paiement suit le contrat et les conditions convenues. Le délai figurant sur la facture est comparé aux conditions d’achat."
      },
      {
        "kind": "paragraph",
        "text": "{g}Déroulement :{/g} 1. Contrat de vente négocié et signé 2. Vendeur livre les marchandises 3. L’acheteur enregistre la réception et les éventuelles réserves selon la procédure. 4. Vendeur établit la facture 5. L’acheteur paie selon les conditions applicables. Le paiement ne détermine pas à lui seul le transfert de propriété."
      },
      {
        "kind": "paragraph",
        "text": "Flux matériel + flux d'informations en parallèle (commande → livraison → confirmation → facture → paiement)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Remarque :{/g} établir une {g}liste de contrôle{/g} pour la réception ; tout écart → signaler au supérieur."
      },
      {
        "kind": "heading",
        "text": "3.3 Réception planifiée et non planifiée",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/303/commun/log-303-notions-2-v001.svg",
        "alt": "Planifiée. Créneau et zone réservés. Imprévue. Identifier et coordonner.",
        "caption": "La décision respecte les capacités et les consignes du site."
      },
      {
        "kind": "heading",
        "text": "3.3.1 Réception planifiée",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Date, type et quantité {g}connus{/g} à l'avance. Mesures possibles : - réserver un {g}quai{/g} de chargement - réserver un espace en zone de réception - préparer les {g}documents{/g} - préparer les moyens auxiliaires (palettes vides, chariots, moyens de contrôle…) - organiser le {g}personnel{/g} - déterminer l'{g}emplacement{/g} de stockage"
      },
      {
        "kind": "paragraph",
        "text": "→ réception rapide, efforts et coûts réduits."
      },
      {
        "kind": "paragraph",
        "text": "{g}Attention :{/g} arrivée hors créneau → accès peut être {g}refusé{/g}. Le transporteur doit respecter le créneau ; tout écart (embouteillage, accident, douane…) doit être {g}signalé tôt{/g} pour reprogrammer."
      },
      {
        "kind": "paragraph",
        "text": "{g}Exemple ERP :{/g} commandes saisies dans l'ERP (→ module 804) pour contrôler date, articles, quantités. Données consultables immédiatement par d'autres collaborateurs."
      },
      {
        "kind": "paragraph",
        "text": "{g}Infos typiques pour le contrôle d'entrée :{/g} - fournisseur - date de réservation / type de documents de livraison - n° d'article et désignation - quantité commandée - quantité effectivement livrée (saisie au contrôle) - lieu de stockage - disponibilité (libre, stock bloqué, contrôle qualité…)"
      },
      {
        "kind": "heading",
        "text": "3.3.2 Réception non planifiée",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Livraison dont {g}ni la date ni la quantité{/g} n'étaient connues (pas de créneau convenu, ou notification non parvenue à la réception)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Exemple Poste :{/g} clients au guichet sans annonce préalable → réception non planifiée du point de vue de la Poste."
      },
      {
        "kind": "paragraph",
        "text": "En entrepôt : à {g}éviter{/g}. Une commande devrait entraîner une info disponible. Si non annoncé → souvent un {g}manque de communication{/g} entre achats et logistique."
      }
    ],
    "module": "303",
    "revision": "303-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-303-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Achats{/g} — Service ou activité qui commande les biens et services."
      },
      {
        "kind": "paragraph",
        "text": "{g}Avis d’arrivée{/g} — Information transmise avant ou lors de l’arrivée d’une livraison."
      },
      {
        "kind": "paragraph",
        "text": "{g}Bon de livraison{/g} — Liste des articles et quantités déclarés par l’expéditeur."
      },
      {
        "kind": "paragraph",
        "text": "{g}Contrôle d’entrée{/g} — Vérification effectuée à la réception selon les règles du site."
      },
      {
        "kind": "paragraph",
        "text": "{g}Créneau{/g} — Plage réservée à une opération."
      },
      {
        "kind": "paragraph",
        "text": "{g}ERP{/g} — Progiciel qui rattache le mouvement au dossier et au stock."
      },
      {
        "kind": "paragraph",
        "text": "{g}Écart{/g} — Différence entre valeur attendue et valeur constatée."
      },
      {
        "kind": "paragraph",
        "text": "{g}Mise à disposition{/g} — Moment où la marchandise devient utilisable selon les contrôles prévus."
      },
      {
        "kind": "paragraph",
        "text": "{g}Quai{/g} — Zone d’interface entre le véhicule et le dépôt."
      },
      {
        "kind": "paragraph",
        "text": "{g}Réception{/g} — Prise en charge et contrôle initial d’une livraison."
      },
      {
        "kind": "paragraph",
        "text": "{g}Réception imprévue{/g} — Arrivée sans créneau ou information suffisante pour la traiter comme prévue."
      },
      {
        "kind": "paragraph",
        "text": "{g}Stock bloqué{/g} — Marchandise tenue à part avant une décision ou une libération."
      }
    ],
    "module": "303",
    "revision": "303-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-303-maths-fiche-1",
    "kind": "maths",
    "prompt": "Trois fournisseurs livrent 25, 18 et 36 colis. Calculez le total attendu.",
    "answer": "79 colis.",
    "calculation": "25 + 18 + 36 = 79.",
    "module": "303",
    "revision": "303-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-303-maths-fiche-2",
    "kind": "maths",
    "prompt": "Sur 72 colis prévus, 69 arrivent. Calculez le manque.",
    "answer": "Trois colis manquent.",
    "calculation": "72 − 69 = 3.",
    "module": "303",
    "revision": "303-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-303-maths-fiche-3",
    "kind": "maths",
    "prompt": "Le quai est réservé de 7 h 45 à 9 h. Combien de minutes sont disponibles ?",
    "answer": "75 minutes.",
    "calculation": "45 min + 30 min = 75 min.",
    "module": "303",
    "revision": "303-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-303-maths-fiche-4",
    "kind": "maths",
    "prompt": "Le contrôle dure 12 minutes par lot pour six lots. Calculez la durée totale sans interruption.",
    "answer": "72 minutes.",
    "calculation": "12 × 6 = 72 min.",
    "module": "303",
    "revision": "303-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-303-maths-fiche-5",
    "kind": "maths",
    "prompt": "Sur 144 colis, 12 restent en contrôle. Calculez la part disponible, au dixième près.",
    "answer": "91,7 %.",
    "calculation": "(144 − 12) ÷ 144 × 100 ≈ 91,7 %.",
    "module": "303",
    "revision": "303-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-303-maths-fiche-6",
    "kind": "maths",
    "prompt": "Deux créneaux de 70 min sont ouverts. Chaque réception prend 26 min et doit rester dans un créneau. Combien de réceptions planifier ?",
    "answer": "Quatre réceptions.",
    "calculation": "70 ÷ 26 permet 2 réceptions par créneau. 2 × 2 = 4.",
    "module": "303",
    "revision": "303-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-303-verification-fiche-1",
    "kind": "verification",
    "prompt": "Quelles informations préparent la réception ?",
    "answer": "Fournisseur, références, quantité attendue, date, moyens et destination.",
    "module": "303",
    "revision": "303-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-303-verification-fiche-2",
    "kind": "verification",
    "prompt": "Quelle est la différence entre livré et disponible ?",
    "answer": "Livré décrit l’arrivée. Disponible suppose l’enregistrement et les contrôles requis.",
    "module": "303",
    "revision": "303-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-303-verification-fiche-3",
    "kind": "verification",
    "prompt": "Pourquoi inscrire la quantité constatée ?",
    "answer": "Pour distinguer l’attendu du réel et documenter l’écart.",
    "module": "303",
    "revision": "303-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-303-verification-fiche-4",
    "kind": "verification",
    "prompt": "Quand une réception est-elle imprévue ?",
    "answer": "Lorsqu’un créneau ou des informations de livraison manquent à l’arrivée.",
    "module": "303",
    "revision": "303-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-303-verification-fiche-5",
    "kind": "verification",
    "prompt": "Quels flux relie la confirmation de réception ?",
    "answer": "Le mouvement physique et sa trace dans les documents ou le système.",
    "module": "303",
    "revision": "303-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-303-verification-fiche-6",
    "kind": "verification",
    "prompt": "Pourquoi vérifier le rôle de l’entreprise avant d’accepter une livraison ?",
    "answer": "Les tâches et responsabilités diffèrent pour un acheteur, un transporteur ou un dépositaire.",
    "module": "303",
    "revision": "303-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-303-situation-fiche-1",
    "kind": "situation",
    "prompt": "Le véhicule arrive trop tôt et le quai est occupé. Que transmettez-vous ?",
    "answer": "Confirmer la référence, rappeler le créneau et orienter vers une attente autorisée selon les règles du site.",
    "module": "303",
    "revision": "303-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-303-situation-fiche-2",
    "kind": "situation",
    "prompt": "Vous recevez 18 colis dont deux sont en contrôle qualité. Que saisissez-vous ?",
    "answer": "Enregistrer 18 reçus et distinguer les deux contrôlés du stock libéré.",
    "module": "303",
    "revision": "303-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-303-situation-fiche-3",
    "kind": "situation",
    "prompt": "La référence sur le bon diffère de celle de la commande. Que faites-vous ?",
    "answer": "Vérifier le dossier et l’identification, isoler l’écart selon la procédure et prévenir le responsable.",
    "module": "303",
    "revision": "303-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-303-situation-fiche-4",
    "kind": "situation",
    "prompt": "Une livraison arrive sans annonce et la zone est pleine. Décrivez la suite.",
    "answer": "Prévenir le poste compétent, vérifier les documents et convenir d’une prise en charge autorisée.",
    "module": "303",
    "revision": "303-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
