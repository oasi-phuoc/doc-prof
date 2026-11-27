import type { LogistiqueUnit } from '../approved-banks'

export const module302 = [
  {
    "id": "log-302-objectifs-apercu",
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
          "Expliquer comment choisir {g}où{/g} acheter (budget, disponibilité, relation, canaux)",
          "Décrire la {g}loi de l'offre et de la demande{/g} et l'équilibre de marché",
          "Dérouler le {g}processus de commande{/g} : offre, commande, confirmation, facture",
          "Lister les éléments {g}minimaux{/g} d'une demande d'offre, d'une commande et d'une facture"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 302",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Définir une demande d’offre exploitable, puis comparer les conditions.",
          "Contrôler la commande, la confirmation et la facture sur les mêmes références.",
          "Distinguer les quantités de l’offre et de la demande dans un périmètre donné."
        ]
      }
    ],
    "module": "302",
    "revision": "302-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-302-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "2. L'approvisionnement de marchandises",
        "sub": false
      },
      {
        "kind": "paragraph",
        "text": "Dans le module {g}301{/g} : quantité et moment de la commande. Ici : {g}où{/g} et {g}comment{/g} envoyer la commande."
      },
      {
        "kind": "heading",
        "text": "2.1 Où acheter ?",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Défi différent pour un achat privé et un achat en entreprise. Aujourd'hui : nombreuses possibilités (dont {g}e-commerce{/g}). Facteurs décisifs : {g}budget{/g} (1re sélection), {g}disponibilité{/g}, {g}relation{/g} avec le fournisseur."
      },
      {
        "kind": "heading",
        "text": "Exemple — achat d'un ordinateur portable",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Questions principales quasi identiques pour un particulier et une entreprise (EnterSite AG)."
      },
      {
        "kind": "table",
        "headers": [
          "Étape",
          "Apprenti (1 pce)",
          "EnterSite AG (86 pces)"
        ],
        "rows": [
          [
            "Situation",
            "Portable pour formation logisticien",
            "Équiper les collaborateurs"
          ],
          [
            "Identifier le besoin",
            "Besoin d'un portable",
            "Idem"
          ],
          [
            "Définir le budget",
            "Combien puis-je payer ?",
            "Idem"
          ],
          [
            "Définir les exigences",
            "Quelle performance ?",
            "Idem"
          ],
          [
            "Rechercher des fournisseurs",
            "Internet, expériences, environs, amis",
            "Idem"
          ],
          [
            "Consultation sur place",
            "Vérifier attentes / connaissances spécialisées",
            "—"
          ],
          [
            "Demander une offre",
            "—",
            "Appel d'offres : qualité + prix"
          ],
          [
            "Évaluation de l'offre",
            "Rapport qualité-prix, conditions, délai, confiance",
            "Idem"
          ],
          [
            "Achat",
            "Payer et prendre en charge",
            "Idem"
          ],
          [
            "Évaluation",
            "Attentes satisfaites ? Expérience → fidélité ou exclusion",
            "Idem"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "{g}Sélection de fournisseurs possibles :{/g} grossistes et fournisseurs de différentes marques · e-commerce."
      },
      {
        "kind": "heading",
        "text": "2.1.1 Déroulement schématique d'une commande",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/302/commun/log-302-notions-1-v001.svg",
        "alt": "Demande. Article, quantité, date. Vérification. Offre et confirmation. Exécution. Livraison et facture.",
        "caption": "Relier chaque document au même dossier."
      },
      {
        "kind": "paragraph",
        "text": "Besoin → (demande d'offre) → offre → commande → confirmation → livraison → facture / paiement (selon le cas, l'étape offre peut être sautée si le fournisseur est déjà choisi)"
      },
      {
        "kind": "heading",
        "text": "2.2 La loi de l'offre et de la demande",
        "sub": true
      },
      {
        "kind": "heading",
        "text": "2.2.1 La demande",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Demande{/g} = quantité d'un produit commandée par le client à un prix donné. Peut venir d'une commande client, des besoins de fabrication, du réapprovisionnement, etc."
      },
      {
        "kind": "paragraph",
        "text": "{g}Loi de la demande :{/g} à conditions comparables, une hausse de prix réduit généralement la quantité demandée."
      },
      {
        "kind": "paragraph",
        "text": "Origine : Antoine Augustin {g}Cournot{/g} (1838) — courbe de demande et concept d'{g}élasticité{/g} (réaction de l'offre/demande aux variations de prix ou de revenus)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Exemple — cartes graphiques 2020{/g} Pour un article dont la disponibilité diminue, vérifier la quantité réellement livrable et la date, même si plusieurs fournisseurs le proposent."
      },
      {
        "kind": "heading",
        "text": "2.2.2 L'offre",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Offre{/g} = quantité proposée par le vendeur à un prix donné. Groupes de marchandises (ex.) : - Agriculture : fruits, légumes - Énergie : fossile, renouvelable, nucléaire - Textile : habillement - Papier/carton : emballages - Cuir, caoutchouc, plastiques - Produits chimiques / pharma - Pierres et terres : verre, matériaux de construction - Métaux : fer, acier… - Machines, électronique - Véhicules - Instruments, horlogerie, bijoux - Autres : meubles, jouets - Métaux précieux : art, or, platine"
      },
      {
        "kind": "paragraph",
        "text": "Courbe de l'offre : {g}Alfred Marshall{/g} (après Cournot)."
      },
      {
        "kind": "paragraph",
        "text": "Le nombre de fournisseurs ne mesure pas la quantité offerte. Au prix considéré, additionner les quantités que les fournisseurs peuvent proposer."
      },
      {
        "kind": "heading",
        "text": "2.2.3 L'équilibre du marché",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Sur un marché en {g}équilibre{/g} :"
      },
      {
        "kind": "paragraph",
        "text": "{g}Quand les prix ↑{/g} - quantité {g}offerte{/g} ↑ (producteurs encouragés à produire/vendre) - quantité {g}demandée{/g} ↓ (acheteurs moins prêts)"
      },
      {
        "kind": "paragraph",
        "text": "{g}Quand les prix ↓{/g} - quantité {g}offerte{/g} ↓ - quantité {g}demandée{/g} ↑"
      },
      {
        "kind": "heading",
        "text": "2.3 Le processus de commande",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Les parties consignent juridiquement leurs accords, les présentent et les contrôlent."
      },
      {
        "kind": "heading",
        "text": "2.3.1 L'offre",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/302/commun/log-302-notions-2-v001.svg",
        "alt": "Prix affiché. Prix de la marchandise. Coût livré. Prix plus frais convenus.",
        "caption": "Le coût livré intègre les frais retenus dans la comparaison."
      },
      {
        "kind": "paragraph",
        "text": "Déclenché par un {g}besoin non satisfait{/g}. Le client peut contacter plusieurs fournisseurs et demander une {g}offre{/g} (appel d'offres) pour trouver le plus approprié (qualité/prix). Pas obligatoire : si le fournisseur est déjà choisi → commande directe."
      },
      {
        "kind": "paragraph",
        "text": "{g}Minimum dans la demande d'offre :{/g} - article souhaité - quantité - date de livraison - adresse de livraison"
      },
      {
        "kind": "paragraph",
        "text": "Relire la période de validité et les réserves. Si le client demande des conditions différentes, faire confirmer les conditions nouvelles avant de traiter la commande."
      },
      {
        "kind": "heading",
        "text": "2.3.2 La commande",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Basée sur l'offre (si phase offre) ou définie à ce stade. {g}Caractère obligatoire{/g} : les deux parties doivent respecter le contenu."
      },
      {
        "kind": "table",
        "headers": [
          "",
          "{g}Droits{/g}",
          "{g}Obligations{/g}"
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
        "kind": "paragraph",
        "text": "Non-respect → solution commune ; sinon {g}CGV{/g} ou {g}CO{/g}."
      },
      {
        "kind": "paragraph",
        "text": "{g}Minimum dans une commande :{/g} - article (n° + description) - quantité - date de livraison - adresse de livraison - prix"
      },
      {
        "kind": "heading",
        "text": "2.3.3 La confirmation de commande",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Document (souvent écrit, ex. e-mail) confirmant {g}réception{/g} et {g}contenu{/g} de la commande. Ex. : confirmation EnterSite AG."
      },
      {
        "kind": "heading",
        "text": "2.3.4 La facture",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Clôture du processus : marchandise livrée selon confirmation, propriété transférée ; paiement selon CO à la date convenue. Forme libre (mise en page)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Minimum sur une facture :{/g} - nom et adresse du fournisseur - numéro de {g}TVA{/g} du fournisseur - nom et adresse du destinataire - date de livraison - désignation exacte de la livraison / prestation - prix - montant de la {g}TVA{/g} - signature"
      }
    ],
    "module": "302",
    "revision": "302-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-302-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Accusé de réception{/g} — Avis que le document a été reçu."
      },
      {
        "kind": "paragraph",
        "text": "{g}Achat{/g} — Acquisition d’un bien selon des conditions convenues."
      },
      {
        "kind": "paragraph",
        "text": "{g}Bon de commande{/g} — Document qui décrit la demande d’achat adressée au fournisseur."
      },
      {
        "kind": "paragraph",
        "text": "{g}Comparaison d’offres{/g} — Évaluation des propositions avec les mêmes critères."
      },
      {
        "kind": "paragraph",
        "text": "{g}Confirmation{/g} — Réponse qui précise ce que le fournisseur accepte et peut livrer."
      },
      {
        "kind": "paragraph",
        "text": "{g}Conditions de paiement{/g} — Échéance, mode et autres modalités prévues pour régler le prix."
      },
      {
        "kind": "paragraph",
        "text": "{g}Demande{/g} — Quantité recherchée par les acheteurs à des conditions données."
      },
      {
        "kind": "paragraph",
        "text": "{g}Demande d’offre{/g} — Demande de prix, délai et caractéristiques avant l’achat."
      },
      {
        "kind": "paragraph",
        "text": "{g}Facture{/g} — Document qui indique le montant à payer et ses éléments."
      },
      {
        "kind": "paragraph",
        "text": "{g}Offre{/g} — Proposition commerciale indiquant prix et conditions."
      },
      {
        "kind": "paragraph",
        "text": "{g}Rabais{/g} — Réduction du prix selon des conditions définies."
      },
      {
        "kind": "paragraph",
        "text": "{g}Validité{/g} — Période pendant laquelle les conditions d’une offre sont applicables."
      }
    ],
    "module": "302",
    "revision": "302-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-302-maths-fiche-1",
    "kind": "maths",
    "prompt": "Le fournisseur propose 72 pièces à 5,40 CHF. Calculez le prix hors autres frais.",
    "answer": "388,80 CHF.",
    "calculation": "72 × 5,40 = 388,80 CHF.",
    "module": "302",
    "revision": "302-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-302-maths-fiche-2",
    "kind": "maths",
    "prompt": "Un montant de 640 CHF bénéficie d’un rabais de 12 %. Calculez le prix après rabais.",
    "answer": "563,20 CHF.",
    "calculation": "640 × (1 − 0,12) = 563,20 CHF.",
    "module": "302",
    "revision": "302-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-302-maths-fiche-3",
    "kind": "maths",
    "prompt": "Une commande de 120 unités arrive en deux lots de 50 et de 45 unités. Calculez le reste.",
    "answer": "25 unités.",
    "calculation": "120 − 50 − 45 = 25.",
    "module": "302",
    "revision": "302-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-302-maths-fiche-4",
    "kind": "maths",
    "prompt": "Un devis prévoit 2,5 kg à 18 CHF par kg et 12 CHF de livraison. Donnez le total.",
    "answer": "57 CHF.",
    "calculation": "2,5 × 18 + 12 = 57 CHF.",
    "module": "302",
    "revision": "302-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-302-maths-fiche-5",
    "kind": "maths",
    "prompt": "Comparez 75 pièces à 11 CHF frais inclus et 75 à 10,40 CHF plus 52 CHF de port.",
    "answer": "La première offre coûte 825 CHF contre 832 CHF.",
    "calculation": "75 × 11 = 825. 75 × 10,40 + 52 = 832 CHF.",
    "module": "302",
    "revision": "302-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-302-maths-fiche-6",
    "kind": "maths",
    "prompt": "Un lot passe de 480 à 528 CHF. Quel est le taux de hausse ?",
    "answer": "10 %.",
    "calculation": "(528 − 480) ÷ 480 × 100 = 10 %.",
    "module": "302",
    "revision": "302-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-302-verification-fiche-1",
    "kind": "verification",
    "prompt": "Quels renseignements inscrire dans une demande d’offre ?",
    "answer": "Article, quantité, délai et adresse de livraison, ainsi que les exigences pertinentes.",
    "module": "302",
    "revision": "302-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-302-verification-fiche-2",
    "kind": "verification",
    "prompt": "Que contrôlez-vous à réception d’une confirmation ?",
    "answer": "Références, quantités, prix, échéances, adresse et conditions.",
    "module": "302",
    "revision": "302-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-302-verification-fiche-3",
    "kind": "verification",
    "prompt": "À quoi sert la période de validité ?",
    "answer": "À savoir jusqu’à quand l’offre peut être acceptée selon ses conditions.",
    "module": "302",
    "revision": "302-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-302-verification-fiche-4",
    "kind": "verification",
    "prompt": "Que compare-t-on pour définir l’équilibre d’un marché ?",
    "answer": "Les quantités offerte et demandée pour un même prix et un périmètre comparable.",
    "module": "302",
    "revision": "302-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-302-verification-fiche-5",
    "kind": "verification",
    "prompt": "Quel document comparez-vous en premier à une facture inattendue ?",
    "answer": "La commande et, pour les articles facturés, la confirmation et le relevé de livraison.",
    "module": "302",
    "revision": "302-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-302-verification-fiche-6",
    "kind": "verification",
    "prompt": "Un prix unitaire plus bas garantit-il un total livré inférieur ?",
    "answer": "Il faut inclure les quantités, frais et autres conditions.",
    "module": "302",
    "revision": "302-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-302-situation-fiche-1",
    "kind": "situation",
    "prompt": "Une offre expire aujourd’hui, mais la livraison est ambiguë. Quelle suite proposez-vous ?",
    "answer": "Faire préciser le délai et obtenir une proposition valable avant de décider.",
    "module": "302",
    "revision": "302-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-302-situation-fiche-2",
    "kind": "situation",
    "prompt": "La confirmation porte sur 48 pièces alors que la commande en prévoit 60. Que faites-vous ?",
    "answer": "Signaler et faire clarifier l’écart avant de mettre à jour le stock attendu.",
    "module": "302",
    "revision": "302-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-302-situation-fiche-3",
    "kind": "situation",
    "prompt": "La facture indique 12,20 CHF l’unité et la commande 11,80 CHF. Comment vérifiez-vous ?",
    "answer": "Contrôler la référence, l’accord valide et les frais séparés, puis transmettre l’écart au service compétent.",
    "module": "302",
    "revision": "302-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-302-situation-fiche-4",
    "kind": "situation",
    "prompt": "Deux fournisseurs proposent des garanties de service différentes. Comment comparer ?",
    "answer": "Fixer les exigences éliminatoires, puis comparer coût, délai et service sur un périmètre commun.",
    "module": "302",
    "revision": "302-v001",
    "approvedFor": [
      "CFC"
    ]
  }
] satisfies readonly LogistiqueUnit[]
