import type { LogistiqueUnit } from '../approved-banks'

export const module311 = [
  {
    "id": "log-311-objectifs-apercu",
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
          "Relier {g}délai d'approvisionnement{/g} et besoin de stock",
          "Comparer stock, {g}JIT{/g} et sync. fabrication ainsi que les concepts de {g}sourcing{/g}",
          "Choisir une {g}procédure de commande{/g} adaptée",
          "Calculer une {g}Qopt{/g} (Andler) dans les conditions du modèle",
          "Utiliser les analyses {g}ABC{/g} et {g}XYZ{/g} et en déduire des formes d'appro / emplacements",
          "Expliquer l'impact du mode d'acquisition sur la {g}réception{/g}"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 311",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Comparer approvisionnement sur stock, cadencé et synchronisé au besoin.",
          "Choisir un déclencheur de commande et sélectionner les critères de sourcing.",
          "Interpréter la quantité économique et les analyses ABC et XYZ avec leurs hypothèses."
        ]
      }
    ],
    "module": "311",
    "revision": "311-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
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
        "kind": "image",
        "src": "/assets/logistique/300/311/commun/log-311-notions-1-v001.svg",
        "alt": "Point de commande. Stock au seuil défini. Rythme de commande. Date de revue convenue.",
        "caption": "Le choix du déclencheur ne fixe pas à lui seul la quantité."
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
        "kind": "image",
        "src": "/assets/logistique/300/311/commun/log-311-notions-2-v001.svg",
        "alt": "ABC. Importance selon un critère. XYZ. Variabilité de la demande.",
        "caption": "Un article fortement consommé en valeur peut aussi être irrégulier."
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
    "module": "311",
    "revision": "311-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-311-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Analyse ABC{/g} — Classement selon un critère d’importance, souvent la valeur annuelle consommée."
      },
      {
        "kind": "paragraph",
        "text": "{g}Analyse XYZ{/g} — Classement selon la régularité ou la variabilité de la consommation."
      },
      {
        "kind": "paragraph",
        "text": "{g}Coût de passation{/g} — Coût pris en compte pour traiter une commande."
      },
      {
        "kind": "paragraph",
        "text": "{g}Délai d’approvisionnement{/g} — Temps nécessaire jusqu’à la disponibilité de la marchandise."
      },
      {
        "kind": "paragraph",
        "text": "{g}Juste-à-temps{/g} — Approvisionnement coordonné avec le moment du besoin."
      },
      {
        "kind": "paragraph",
        "text": "{g}Lot économique{/g} — Quantité qui minimise les coûts retenus par un modèle de commande et de stockage."
      },
      {
        "kind": "paragraph",
        "text": "{g}Point de commande{/g} — Seuil qui déclenche la revue ou la commande prévue."
      },
      {
        "kind": "paragraph",
        "text": "{g}Rythme de commande{/g} — Cadence à laquelle le stock est revu ou la commande est passée."
      },
      {
        "kind": "paragraph",
        "text": "{g}Sourcing multiple{/g} — Approvisionnement auprès de plusieurs fournisseurs."
      },
      {
        "kind": "paragraph",
        "text": "{g}Sourcing unique{/g} — Approvisionnement confié à une source choisie."
      },
      {
        "kind": "paragraph",
        "text": "{g}Stock tampon{/g} — Réserve pour absorber une variation dans le flux."
      },
      {
        "kind": "paragraph",
        "text": "{g}Synchronisation{/g} — Coordination des arrivées et de la consommation."
      }
    ],
    "module": "311",
    "revision": "311-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-311-maths-fiche-1",
    "kind": "maths",
    "prompt": "La consommation est de 18 unités par jour. Le délai est de trois jours. Calculez le besoin pendant le délai.",
    "answer": "54 unités.",
    "calculation": "18 × 3 = 54.",
    "module": "311",
    "revision": "311-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-311-maths-fiche-2",
    "kind": "maths",
    "prompt": "Il reste 62 pièces et le maximum retenu est de 150. Sans autre entrée ni réservation, combien acheter ?",
    "answer": "88 pièces.",
    "calculation": "150 − 62 = 88.",
    "module": "311",
    "revision": "311-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-311-maths-fiche-3",
    "kind": "maths",
    "prompt": "La demande hebdomadaire vaut 84 pièces. Des lots de 21 pièces sont livrés. Combien de lots couvrent la demande ?",
    "answer": "Quatre lots.",
    "calculation": "84 ÷ 21 = 4.",
    "module": "311",
    "revision": "311-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-311-maths-fiche-4",
    "kind": "maths",
    "prompt": "Le délai passe de cinq à huit jours avec 12 unités consommées par jour. Quel volume supplémentaire couvre l’écart ?",
    "answer": "36 unités.",
    "calculation": "(8 − 5) × 12 = 36 unités.",
    "module": "311",
    "revision": "311-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-311-maths-fiche-5",
    "kind": "maths",
    "prompt": "Pour la formule Q = √(2 × demande annuelle × coût par commande ÷ coût annuel de stockage par unité), utilisez 1 200 pièces, 25 CHF et 1,50 CHF.",
    "answer": "La quantité du modèle est de 200 pièces.",
    "calculation": "√(2 × 1 200 × 25 ÷ 1,50) = √40 000 = 200.",
    "module": "311",
    "revision": "311-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-311-maths-fiche-6",
    "kind": "maths",
    "prompt": "Un article représente 7 500 CHF de valeur annuelle consommée sur 30 000 CHF. Calculez sa part pour l’analyse ABC.",
    "answer": "25 %.",
    "calculation": "7 500 ÷ 30 000 × 100 = 25 %.",
    "module": "311",
    "revision": "311-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-311-verification-fiche-1",
    "kind": "verification",
    "prompt": "Quelle différence entre rythme et point de commande ?",
    "answer": "Le rythme suit un moment fixé. Le point suit un seuil de stock.",
    "module": "311",
    "revision": "311-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-311-verification-fiche-2",
    "kind": "verification",
    "prompt": "Que montre le classement XYZ ?",
    "answer": "La régularité ou la variabilité de la consommation.",
    "module": "311",
    "revision": "311-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-311-verification-fiche-3",
    "kind": "verification",
    "prompt": "Comment reliez-vous la demande et le stock pendant le délai ?",
    "answer": "La consommation attendue pendant le délai détermine le besoin à couvrir avant la prochaine disponibilité.",
    "module": "311",
    "revision": "311-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-311-verification-fiche-4",
    "kind": "verification",
    "prompt": "Quel compromis fait un lot économique ?",
    "answer": "Le coût de commander plus souvent et le coût de stocker une quantité moyenne plus élevée.",
    "module": "311",
    "revision": "311-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-311-verification-fiche-5",
    "kind": "verification",
    "prompt": "Citez un avantage et une limite du juste-à-temps.",
    "answer": "Moins de stock, mais une dépendance plus forte à la fiabilité du flux.",
    "module": "311",
    "revision": "311-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-311-verification-fiche-6",
    "kind": "verification",
    "prompt": "Pourquoi choisir plusieurs sources ?",
    "answer": "Pour limiter la dépendance ou accroître la disponibilité, en tenant compte des coûts et de la coordination.",
    "module": "311",
    "revision": "311-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-311-situation-fiche-1",
    "kind": "situation",
    "prompt": "La demande est stable mais le délai fournisseur augmente. Que réévaluez-vous ?",
    "answer": "Le besoin pendant le délai, la date de déclenchement et les réserves utiles.",
    "module": "311",
    "revision": "311-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-311-situation-fiche-2",
    "kind": "situation",
    "prompt": "Le passage en juste-à-temps multiplie les livraisons. Quel effet contrôlez-vous ?",
    "answer": "La charge de réception, les créneaux, le coût de transport et le niveau de service.",
    "module": "311",
    "revision": "311-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-311-situation-fiche-3",
    "kind": "situation",
    "prompt": "Deux fournisseurs proposent le même prix mais des délais variables. Que comparez-vous ?",
    "answer": "Délai moyen, régularité, risque et coût total à conditions comparables.",
    "module": "311",
    "revision": "311-v001",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  },
  {
    "id": "log-311-situation-fiche-4",
    "kind": "situation",
    "prompt": "Un article à forte valeur est irrégulier. Comment interprétez-vous ce résultat ?",
    "answer": "La valeur et la variabilité sont deux critères distincts. Ajuster le suivi aux deux et aux enjeux réels.",
    "module": "311",
    "revision": "311-v001",
    "approvedFor": [
      "CFC"
    ]
  }
] satisfies readonly LogistiqueUnit[]
