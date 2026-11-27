import type { LogistiqueUnit } from '../approved-banks'

export const module311 = [
  {
    "id": "log-311-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "11. Les concepts de l'approvisionnement",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "11.1 Approvisionnement (*Procurement / Purchasing*)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Service qui s'occupe de l'approvisionnement de l'entreprise : matériel de production, services (conseil, formation…), marchandises destinées à la revente."
      },
      {
        "kind": "paragraph",
        "text": "Tendance : on produit moins soi-même, on {g}achète plus{/g} → importance croissante. Achats autrefois locaux/régionaux → aujourd'hui {g}mondiaux{/g}. Tous les flux de marchandises sont déclenchés par l'approvisionnement et mis en œuvre par la {g}logistique{/g}."
      },
      {
        "kind": "heading",
        "text": "11.2 Formes d'approvisionnement",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Le marché exige un {g}délai de réapprovisionnement{/g} acceptable. Le {g}délai d'approvisionnement{/g} (commande → dispo stock) doit être {g}≤{/g} ce délai accepté. Sinon → gérer l'article {g}en stock{/g} pour livrer immédiatement."
      },
      {
        "kind": "paragraph",
        "text": "{g}Composition du délai d'approvisionnement :{/g} 1. Détermination et communication des besoins 2. Offres, négociations, choix fournisseurs 3. Déroulement de la commande 4. Attente confirmation 5. Délai de livraison 6. Délai de transport 7. Entrée marchandises (contrôles qté/qualité) 8. Transport vers entrepôt / lieu de consommation"
      },
      {
        "kind": "paragraph",
        "text": "Si le fournisseur ne tient pas le délai accepté → risque de {g}perdre le client{/g}."
      },
      {
        "kind": "table",
        "headers": [
          "Forme",
          "Principe",
          "Avantages",
          "Inconvénients"
        ],
        "rows": [
          [
            "{g}Approvisionnement (stock){/g}",
            "Acheter plus que le besoin immédiat · réserve en entrepôt",
            "Autonomie marché/fournisseurs · capacité de livraison",
            "Capital immobilisé · risque de stocks morts"
          ],
          [
            "{g}Juste-à-temps (JIT){/g}",
            "Acheter seulement quand besoin, quantité exacte",
            "Peu d'immobilisation · collaboration fournisseurs",
            "Stocks « sur la route » · pollution · dépendance ponctualité/qualité"
          ],
          [
            "{g}Synchronisé fabrication{/g}",
            "Variante JIT : livraison exacte à la date de prod. (ex. auto)",
            "Stocks très bas · partenaire intégré",
            "Dépendance forte"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "Souvent {g}mix{/g} des trois selon articles / concept."
      },
      {
        "kind": "heading",
        "text": "11.3 Concepts de sourcing",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/200/204/commun/log-204-marche-photo-v002.webp",
        "alt": "Une personne examine des offres de plusieurs fournisseurs.",
        "caption": "Comparez les possibilités de sourcing selon la qualité, le délai, le coût et la dépendance."
      },
      {
        "kind": "paragraph",
        "text": "Formes mixtes fréquentes."
      },
      {
        "kind": "table",
        "headers": [
          "Concept",
          "Idée"
        ],
        "rows": [
          [
            "{g}Global sourcing{/g}",
            "Achats internationaux · coûts · logistique mondiale"
          ],
          [
            "{g}Local sourcing{/g}",
            "Région/pays · biens critiques · moins de retards transport · prix parfois ↑"
          ],
          [
            "{g}Single sourcing{/g}",
            "Un seul fournisseur · partenariat long terme · optimisation processus · volume/rabais"
          ],
          [
            "{g}Double sourcing{/g}",
            "Deux fournisseurs concurrents · moins de dépendance · volumes parfois trop faibles pour rabais"
          ],
          [
            "{g}Multiple sourcing{/g}",
            "Plusieurs fournisseurs · prix court terme · interchangeabilité · biens standardisés (ex. max 33 % chez un fournisseur)"
          ],
          [
            "{g}Modular / system sourcing{/g}",
            "Modules/sous-ensembles prêts · montage final · hors compétences clés · dépendance fournisseurs"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "11.4 Stock et délai d'approvisionnement",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/312/commun/log-312-cycle-stock-schema-v003.webp",
        "alt": "Le stock passe de 160 à 80 au jour 4 où la commande est lancée. Il atteint 40 au jour 6. La réception le fait remonter à 160.",
        "caption": "Suivez le stock entre le déclenchement de la commande et l’arrivée. La consommation se poursuit pendant le délai."
      },
      {
        "kind": "paragraph",
        "text": "Pas de gros stocks si article toujours dispo chez fournisseurs régionaux. Stocks bas si courte distance + réappro permanent. Distance ↑ ou dispo irrégulière → stocks ↑."
      },
      {
        "kind": "paragraph",
        "text": "> Le stock couvre les besoins (clients/production) {g}en attendant{/g} la prochaine livraison."
      },
      {
        "kind": "paragraph",
        "text": "{g}Ex. bananes :{/g} récolte verte → carton → bateau ~2 semaines en CA (atmosphère contrôlée) → mûrisserie → rayon."
      },
      {
        "kind": "paragraph",
        "text": "{g}Dilemme :{/g} stock élevé = coûts (capital) · stock bas = risque de mauvaise disponibilité."
      },
      {
        "kind": "heading",
        "text": "11.5 Procédures de commande (variation liée à la consommation)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "À chaque article : une {g}procédure de commande{/g}."
      },
      {
        "kind": "table",
        "headers": [
          "Procédure",
          "Déclencheur",
          "Quantité",
          "Remarques"
        ],
        "rows": [
          [
            "{g}Point de commande · qté fixe{/g}",
            "Stock ≤ point de commande",
            "Toujours {g}q{/g} fixe",
            "Simple · forte rotation · contrats long terme · risque surstock si demande ↓"
          ],
          [
            "{g}Point de commande · qté variable{/g}",
            "Stock ≤ point de commande",
            "Remonter au {g}max{/g}",
            "Suit les ventes · espace max stable · calcul à chaque fois"
          ],
          [
            "{g}Rythme · date fixe · qté variable{/g}",
            "Moment {g}t{/g} fixe",
            "Jusqu'au max",
            "Pas de cote d'alerte · livraisons régulières contractuelles · risque dépassement max si ventes ↓"
          ],
          [
            "{g}Rythme · date fixe · qté fixe{/g}",
            "Moment {g}t{/g} fixe",
            "{g}q{/g} fixe",
            "Ventes stables · automatisable si bons paramètres"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "Point de commande à qté fixe = {g}orienté consommation{/g} (cadence suit l'usage)."
      },
      {
        "kind": "heading",
        "text": "11.6 Quantité de commande optimale (Qopt)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Harris{/g} (1913) / {g}Andler{/g} (1929) · angl. {g}EOQ{/g} (*Economic Order Quantity*)."
      },
      {
        "kind": "paragraph",
        "text": "Deux courbes : - {g}Coûts de stockage{/g} ↑ avec la quantité - {g}Coûts de passation de commande{/g} / pièce ↓ avec la quantité"
      },
      {
        "kind": "paragraph",
        "text": "Dans le modèle usuel, la quantité économique minimise la somme des coûts de passation et de stockage retenus. Vérifier ensuite les tailles de lots et les contraintes réelles."
      },
      {
        "kind": "paragraph",
        "text": "Coûts de commande (internes) : offres, commande, réception, AQ, factures… souvent estimés {g}100–200 CHF{/g}/commande (ou plus). Ex. : 150 CHF / 1 pce = 150 · / 4 pces = 37.50…"
      },
      {
        "kind": "heading",
        "text": "11.6.1 Formule d'Andler — conditions",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Besoins connus et constants · entrée/consommation uniformes · prix et coûts de commande constants · coûts de stockage connus et constants."
      },
      {
        "kind": "table",
        "headers": [
          "Symbole",
          "Sens"
        ],
        "rows": [
          [
            "Q / Qopt",
            "Quantité (optimale) de commande"
          ],
          [
            "m ou M",
            "Besoin annuel"
          ],
          [
            "a ou B",
            "Coût de passation de commande"
          ],
          [
            "p ou P",
            "Prix d'achat unitaire"
          ],
          [
            "q ou L",
            "Coût de stockage (% valeur)"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "Formule usuelle (Andler / EOQ) :"
      },
      {
        "kind": "paragraph",
        "text": "{g}Qopt = √( 2 × M × B  /  (P × L) ){/g}"
      },
      {
        "kind": "paragraph",
        "text": "(avec L en décimal, ex. 28 % → 0,28)"
      },
      {
        "kind": "heading",
        "text": "11.6.2 Exemple",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "M = 30'000 · P = 4.50 · B = 1'250 · L = 28 % → Qopt ≈ {g}7'715{/g} pièces (~8'000 dans un tableau) · ~{g}4{/g} commandes/an."
      },
      {
        "kind": "heading",
        "text": "11.7 Analyse ABC / XYZ",
        "sub": true
      },
      {
        "kind": "heading",
        "text": "11.7.1 Pareto (80/20)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Vilfredo Pareto (1906) : ~20 % de la pop. → ~80 % de la fortune. Généralisé : 20 % d'effort → 80 % de résultat ; 20 % clients → 80 % CA. En stockage → {g}analyse ABC{/g}."
      },
      {
        "kind": "table",
        "headers": [
          "Classe",
          "Part quantité (ex.)",
          "Part valeur/rotation (ex.)",
          "Action typique"
        ],
        "rows": [
          [
            "{g}A{/g}",
            "20 %",
            "75 %",
            "Près de la sortie/prod · priorité achats"
          ],
          [
            "{g}B{/g}",
            "30 %",
            "20 %",
            "Zone centrale · 2e priorité"
          ],
          [
            "{g}C{/g}",
            "50 %",
            "5 %",
            "Zone arrière · 3e priorité"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "Critères : {g}rotation{/g} et/ou {g}valeur{/g}."
      },
      {
        "kind": "heading",
        "text": "11.7.2 ABC selon valeur de commande",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Classer articles par valeur cumulée. Ex. : 4 articles = 20 % qté et ~80 % valeur → effort particulier (négociations prix)."
      },
      {
        "kind": "heading",
        "text": "11.7.3 Optimisation des emplacements",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Stockage chaotique → trajets longs. Après ABC : articles {g}A{/g} près de la production → trajets ↓."
      },
      {
        "kind": "heading",
        "text": "11.7.4 Analyse XYZ (prévisibilité)",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "Classe",
          "Consommation",
          "Prévision"
        ],
        "rows": [
          [
            "{g}X{/g}",
            "Très régulière",
            "Grande précision"
          ],
          [
            "{g}Y{/g}",
            "Tendance régulière ↑/↓",
            "Moyenne"
          ],
          [
            "{g}Z{/g}",
            "Très irrégulière",
            "Faible"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "Liens formes d'appro : stock · au cas par cas · JIT."
      },
      {
        "kind": "heading",
        "text": "11.7.5 Fusion ABC × XYZ",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/311/commun/log-311-abc-xyz-schema-v003.webp",
        "alt": "La matrice croise trois classes de valeur A B C et trois classes de régularité X Y Z, soit neuf catégories.",
        "caption": "La valeur et la régularité répondent à deux questions distinctes. AX désigne une valeur élevée et une demande régulière."
      },
      {
        "kind": "paragraph",
        "text": "XA/XB/XC = plus faciles à planifier · ZA/ZB/ZC = plus difficiles."
      },
      {
        "kind": "paragraph",
        "text": "{g}Contrats sur appel / cadres{/g} (souvent YA, ZA) : quantité annuelle garantie · fournisseur tient stock · acheteur commande le besoin net (→ module 110) · délai court · stocks bas · bons prix."
      },
      {
        "kind": "heading",
        "text": "11.8 Conséquences sur la réception des marchandises",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/303/commun/log-303-quai-photo-v002.webp",
        "alt": "Une livraison est à contrôler au quai.",
        "caption": "Une augmentation du nombre de livraisons peut augmenter le travail à chaque réception."
      },
      {
        "kind": "paragraph",
        "text": "Réception = entre livraison et stockage (modules 304, 308, 309) : déchargement, contrôles, AQ, stockage ou signalement achats."
      },
      {
        "kind": "paragraph",
        "text": "{g}Effet du mode d'acquisition :{/g} passer un article XB d'Andler/lots à {g}JIT{/g} → plus de livraisons → {g}surcharge{/g} réception (peut annuler le gain stock)."
      },
      {
        "kind": "paragraph",
        "text": "Une adaptation du contrôle d’entrée suppose un plan validé, des preuves et des responsabilités définies. Une certification seule ne supprime pas un contrôle convenu."
      }
    ],
    "summaryBlocks": [
      {
        "kind": "heading",
        "text": "11. Les concepts de l'approvisionnement",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "11.1 à 11.3 Choisir une stratégie",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/200/204/commun/log-204-marche-photo-v002.webp",
        "alt": "Une personne examine des offres de plusieurs fournisseurs.",
        "caption": "Comparez les possibilités de sourcing selon la qualité, le délai, le coût et la dépendance."
      },
      {
        "kind": "paragraph",
        "text": "Le {g}procurement{/g} organise l’approvisionnement au sens large. Le {g}purchasing{/g} couvre l’achat. L’entreprise peut approvisionner à l’unité, constituer un stock ou organiser des livraisons au besoin ({g}juste-à-temps{/g}). Le {g}sourcing{/g} peut retenir un ou plusieurs fournisseurs, proches ou lointains. Comparez dépendance, disponibilité, qualité, coût et délai."
      },
      {
        "kind": "heading",
        "text": "11.4 et 11.5 Stocks et commande",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/312/commun/log-312-cycle-stock-schema-v003.webp",
        "alt": "Le stock passe de 160 à 80 au jour 4 où la commande est lancée. Il atteint 40 au jour 6. La réception le fait remonter à 160.",
        "caption": "Suivez le stock entre le déclenchement de la commande et l’arrivée. La consommation se poursuit pendant le délai."
      },
      {
        "kind": "paragraph",
        "text": "Le {g}délai d’approvisionnement{/g} comprend traitement, préparation, transport et arrivée. Une commande peut partir à date fixe ou quand le stock atteint un seuil. Un stock élevé coûte et occupe de la place. Un stock trop faible augmente le risque de rupture."
      },
      {
        "kind": "heading",
        "text": "11.6 Quantité de commande optimale (Qopt)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "La {g}formule d’Andler{/g} compare coût de commande et {g}coût de possession{/g}. Qopt = √(2 × M × B ÷ (P × L)). M désigne la demande annuelle, B le coût par commande, P le prix unitaire et L le taux annuel de possession en écriture décimale. Le modèle suppose notamment une demande stable et des coûts connus. Vérifiez ensuite les contraintes de place, de lot et de livraison."
      },
      {
        "kind": "heading",
        "text": "11.7 Analyse ABC / XYZ",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/311/commun/log-311-abc-xyz-schema-v003.webp",
        "alt": "La matrice croise trois classes de valeur A B C et trois classes de régularité X Y Z, soit neuf catégories.",
        "caption": "La valeur et la régularité répondent à deux questions distinctes. AX désigne une valeur élevée et une demande régulière."
      },
      {
        "kind": "paragraph",
        "text": "{g}ABC{/g} classe les articles selon leur importance dans le critère choisi, souvent leur valeur annuelle. {g}XYZ{/g} mesure la prévisibilité de la demande. Un article {g}AX{/g} de forte valeur et régulier demande un suivi précis. Un article de demande irrégulière demande une autre stratégie. Un {g}contrat-cadre{/g} ou une commande sur appel peut aider à organiser les besoins."
      },
      {
        "kind": "heading",
        "text": "11.8 Conséquences sur la réception",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/303/commun/log-303-quai-photo-v002.webp",
        "alt": "Une livraison est à contrôler au quai.",
        "caption": "Une augmentation du nombre de livraisons peut augmenter le travail à chaque réception."
      },
      {
        "kind": "paragraph",
        "text": "Des lots plus petits et fréquents diminuent parfois le stock, mais augmentent les opérations au quai. Vérifiez la charge de réception et le contrôle qualité prévu avec le fournisseur."
      }
    ],
    "module": "311",
    "revision": "311-v003",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
