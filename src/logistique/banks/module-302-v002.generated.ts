import type { LogistiqueUnit } from '../approved-banks'

export const module302 = [
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
        "kind": "image",
        "src": "/assets/logistique/200/204/commun/log-204-marche-photo-v002.webp",
        "alt": "Des offres et des bacs de différents modèles sont disposés devant une acheteuse.",
        "caption": "Une demande identique permet de vérifier prix, format et livraison."
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
        "kind": "image",
        "src": "/assets/logistique/300/303/commun/log-303-quai-photo-v002.webp",
        "alt": "Des opérateurs contrôlent les documents et la palette livrée.",
        "caption": "Le bon de livraison est rapproché de la commande avant le traitement de la facture."
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
    "summaryBlocks": [
      {
        "kind": "heading",
        "text": "2. L'approvisionnement de marchandises",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "2.1 Où acheter ?",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/200/204/commun/log-204-marche-photo-v002.webp",
        "alt": "Des offres et des bacs de différents modèles sont disposés devant une acheteuse.",
        "caption": "Une demande identique permet de vérifier prix, format et livraison."
      },
      {
        "kind": "paragraph",
        "text": "Décrivez le produit, la quantité et le délai avant de chercher des fournisseurs. Comparez fabricant, grossiste, distributeur ou commerce en ligne selon la qualité, le coût complet et la fiabilité. Pour des bacs, demandez à tous les candidats les mêmes dimensions utiles et conditions."
      },
      {
        "kind": "heading",
        "text": "2.2 La loi de l'offre et de la demande",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "L’{g}offre{/g} décrit ce que les vendeurs proposent. La {g}demande{/g} dépend de ce que les acheteurs souhaitent acquérir à un prix donné. Dans un modèle simple, l’offre augmente avec le prix et la demande baisse. Le {g}prix d’équilibre{/g} est le point où les quantités se rejoignent. Les stocks, la concurrence et les délais peuvent faire évoluer les prix."
      },
      {
        "kind": "heading",
        "text": "2.3 Le processus de commande",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/303/commun/log-303-quai-photo-v002.webp",
        "alt": "Des opérateurs contrôlent les documents et la palette livrée.",
        "caption": "Le bon de livraison est rapproché de la commande avant le traitement de la facture."
      },
      {
        "kind": "paragraph",
        "text": "La {g}demande d’offre{/g} contient la référence ou les caractéristiques, la quantité, le lieu et le délai. L’{g}offre{/g} précise les prix, frais, conditions et date de validité. La {g}commande{/g} indique ce que l’acheteur demande. Comparez la {g}confirmation{/g} à la commande et traitez les écarts. À la livraison, rapprochez quantité réelle, {g}bulletin de livraison{/g} et commande. Vérifiez la {g}facture{/g} et les conditions avant traitement."
      }
    ],
    "module": "302",
    "revision": "302-v002",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
