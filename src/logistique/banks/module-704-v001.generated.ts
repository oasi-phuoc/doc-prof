import type { LogistiqueUnit } from '../approved-banks'

export const module704 = [
  {
    "id": "log-704-objectifs-apercu",
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
          "Calculer un {g}stock moyen{/g} selon les 3 formules et justifier le choix",
          "Calculer {g}rotation{/g} et {g}durée de stockage{/g} et en tirer des conclusions",
          "Interpréter {g}couverture{/g} et {g}taux de service{/g} (dont logique ABC, module 311)",
          "Calculer le {g}taux d'erreur{/g} de livraison et citer des mesures de prévention (fournisseur / destinataire)"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 704",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Déterminer un stock moyen avec un rythme de relevé adapté à ses variations.",
          "Calculer rotation, durée et couverture en écrivant l'unité et la période.",
          "Interpréter taux de service et taux d'erreur pour identifier des mesures concrètes."
        ]
      }
    ],
    "module": "704",
    "revision": "704-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-704-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "4. Les indicateurs logistiques (KPI'S)",
        "sub": false
      },
      {
        "kind": "paragraph",
        "text": "Les indicateurs logistiques décrivent la qualité du service et l'utilisation des ressources. On peut les calculer pour un article, un groupe d'articles ou un périmètre d'entrepôt."
      },
      {
        "kind": "heading",
        "text": "4.1 Le stock moyen",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Donnée de base pour la rotation, le taux d'intérêt des stocks, les frais de stockage, etc. Période d'analyse type = {g}1 année{/g} (12 mois)."
      },
      {
        "kind": "table",
        "headers": [
          "Formule",
          "Calcul",
          "Fiabilité"
        ],
        "rows": [
          [
            "{g}1{/g}",
            "(début d'année + fin d'année) / {g}2{/g}",
            "Fiable sur courte période · sur 1 an seulement si faibles fluctuations"
          ],
          [
            "{g}2{/g}",
            "(début + fins de chaque trimestre) / {g}5{/g}",
            "Plus précis · encore sensible aux variations"
          ],
          [
            "{g}3{/g}",
            "(début + fins de chaque mois) / {g}13{/g}",
            "Le plus proche de la réalité · préférable sur longues périodes"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "Exemple — matériel de vissage pour A1CC530AS",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "Date",
          "Stock"
        ],
        "rows": [
          [
            "Solde initial (1er janv.)",
            "2000"
          ],
          [
            "31 janv.",
            "300"
          ],
          [
            "28 févr.",
            "750"
          ],
          [
            "31 mars",
            "900"
          ],
          [
            "30 avr.",
            "1100"
          ],
          [
            "31 mai",
            "200"
          ],
          [
            "30 juin",
            "850"
          ],
          [
            "31 juil.",
            "700"
          ],
          [
            "31 août",
            "1700"
          ],
          [
            "30 sept.",
            "1400"
          ],
          [
            "31 oct.",
            "600"
          ],
          [
            "30 nov.",
            "800"
          ],
          [
            "31 déc.",
            "1500"
          ]
        ]
      },
      {
        "kind": "list",
        "items": [
          "{g}F1 :{/g} (2000 + 1500) / 2 = {g}1750{/g} pièces",
          "{g}F2 :{/g} (2000 + 900 + 850 + 1400 + 1500) / 5 = {g}1330{/g} pièces",
          "{g}F3 :{/g} (2000 + 300 + 750 + 900 + 1100 + 200 + 850 + 700 + 1700 + 1400 + 600 + 800 + 1500) / 13 ≈ {g}985{/g} pièces."
        ]
      },
      {
        "kind": "paragraph",
        "text": "👉 Plus le nombre de stocks pris en compte est élevé, plus le résultat est {g}précis{/g}."
      },
      {
        "kind": "heading",
        "text": "4.2 La rotation des stocks",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/700/704/cfc/log-704-notions-1-v001.svg",
        "alt": "Stock moyen. 300 unités. Rotation. 2 400 ÷ 300 = 8. Durée. 360 ÷ 8 = 45 jours.",
        "caption": "Exemple annuel sur une base conventionnelle de 360 jours."
      },
      {
        "kind": "paragraph",
        "text": "Nombre de fois où le stock moyen a été {g}renouvelé{/g} (entièrement consommé et reconstitué) sur la période. Calculable pour articles, groupes d'articles ou tout l'entrepôt."
      },
      {
        "kind": "paragraph",
        "text": "{g}Rotation = utilisation des marchandises (consommation) / stock moyen{/g}"
      },
      {
        "kind": "paragraph",
        "text": "{g}Ex.{/g} Toner Q3960AR : 14 000 / 2 000 = {g}7{/g} fois (facteur)."
      },
      {
        "kind": "list",
        "items": [
          "{g}Rotation rapide{/g} : forte rotation · {g}lente{/g} : faible rotation",
          "Alimentaire : souvent facteur {g}12–15{/g}",
          "Facteur ≤ {g}1{/g} : faible → vérifier si le stockage en vaut la peine (sauf pièces de rechange critiques ou biens en maturation — rotation peu pertinente)"
        ]
      },
      {
        "kind": "paragraph",
        "text": "{g}Avantages{/g} d'une rotation ↑ : coûts ↓ · immobilisation du capital / intérêts / places ↓ · risque de stockage ↓ (invendus)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Leviers :{/g} commander plus petit / plus souvent · inventaire à jour (ex. permanent) · stocks maximums · juste-à-temps · retirer les articles qui ne fonctionnent pas."
      },
      {
        "kind": "heading",
        "text": "4.2.1 La durée de stockage",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Laps de temps moyen entre entrée et sortie. Plus la rotation ↑, plus la durée ↓ (et inversement)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Durée de stockage = 360 jours (ou période choisie) / rotation{/g}"
      },
      {
        "kind": "paragraph",
        "text": "{g}Ex.{/g} 360 / 7 ≈ {g}51,4 jours{/g}."
      },
      {
        "kind": "paragraph",
        "text": "👉 Comparer rotation / durée avec N−1 ou le secteur = indice de {g}rentabilité{/g}."
      },
      {
        "kind": "heading",
        "text": "4.3 La couverture des stocks",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Nombre de {g}jours{/g} pendant lesquels le stock suffit au rythme de consommation moyenne / planifiée."
      },
      {
        "kind": "paragraph",
        "text": "{g}Stock disponible = stock physique − réservations + entrées prévues{/g}"
      },
      {
        "kind": "paragraph",
        "text": "{g}Couverture = niveau de stock / besoin journalier{/g}"
      },
      {
        "kind": "paragraph",
        "text": "{g}Ex.{/g} 1300 pièces / 150 = {g}8,6 jours{/g}."
      },
      {
        "kind": "heading",
        "text": "4.4 La capacité de livraison (taux de service)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/700/704/cfc/log-704-notions-2-v001.svg",
        "alt": "Taux de service. Demandes satisfaites sur demandes totales. Taux d'erreur. Livraisons défectueuses sur livraisons totales.",
        "caption": "Les numérateurs et dénominateurs adoptent la même unité."
      },
      {
        "kind": "paragraph",
        "text": "Clients : choix large + délais courts → forte disponibilité, mais {g}100 %{/g} sur tout l'assortiment coûte cher. Principe : « {g}aussi peu que possible, autant que nécessaire{/g} ». Via analyse {g}ABC{/g} (module {g}311{/g}), on augmente surtout les stocks des articles {g}A{/g}."
      },
      {
        "kind": "paragraph",
        "text": "{g}Taux de service (%) = demandes satisfaites / demandes totales × 100{/g}"
      },
      {
        "kind": "paragraph",
        "text": "« Demande » peut être : une commande · une ligne · une pièce. La {g}période{/g} (instantané vs semaines/mois) compte aussi. Analyser aussi les conséquences d'une rupture (image, préjudice)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Ex.{/g} Toner Q3960AR, mars : ≈ {g}98,4 %{/g} (réaliste pour solutions bureautiques). Ruptures en fin de semaine → adapter les livraisons. ~{g}98 %{/g} souvent atteignable raisonnablement · {g}100 %{/g} = effort disproportionné."
      },
      {
        "kind": "heading",
        "text": "4.5 Les erreurs de livraison",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Toute livraison avec irrégularité : mauvais destinataire / article / quantité · endommagé ou défectueux."
      },
      {
        "kind": "heading",
        "text": "4.5.1 Éviter en tant que fournisseur",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "N° d'articles univoques · contrôles optiques · documents précis (préparation, livraison)."
      },
      {
        "kind": "heading",
        "text": "4.5.2 Éviter en tant que destinataire",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Identification globale à la livraison (module {g}304{/g}) : pour nous ? attendu ? commande en système ? Puis contrôle professionnel EM (modules {g}307–308{/g})."
      },
      {
        "kind": "heading",
        "text": "4.5.3 Différence de quantité",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Excédent ou manque. Pas toujours une « erreur » si {g}tolérance{/g} contractuelle. Compter en {g}temps réel{/g} à l'EM : écart négatif = perte pour le destinataire."
      },
      {
        "kind": "paragraph",
        "text": "{g}Dommages transport :{/g} souvent mécaniques (pression, chute, choc) → constater tôt · PV écrit + photos · signaler ({g}307{/g})."
      },
      {
        "kind": "heading",
        "text": "4.5.4 Taux d'erreur de livraison",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Taux d'erreur (%) = livraisons défectueuses / livraisons totales × 100{/g}"
      },
      {
        "kind": "paragraph",
        "text": "{g}Ex.{/g} 22 / 550 × 100 = {g}4 %{/g}."
      },
      {
        "kind": "paragraph",
        "text": "Calculable par position · par fournisseur/client · globalement sur une période. Indicateur de {g}qualité fournisseur{/g} · accords qualité / {g}pénalités{/g} possibles."
      }
    ],
    "module": "704",
    "revision": "704-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-704-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Indicateur{/g} — Mesure choisie pour suivre un résultat selon une définition stable."
      },
      {
        "kind": "paragraph",
        "text": "{g}Stock moyen{/g} — Niveau représentatif d'une période, estimé à partir des relevés."
      },
      {
        "kind": "paragraph",
        "text": "{g}Rotation{/g} — Rapport entre la consommation d'une période et son stock moyen."
      },
      {
        "kind": "paragraph",
        "text": "{g}Durée moyenne de stockage{/g} — Durée de la période divisée par la rotation sur cette même période."
      },
      {
        "kind": "paragraph",
        "text": "{g}Couverture{/g} — Nombre de jours de consommation que le stock courant peut assurer selon l'hypothèse retenue."
      },
      {
        "kind": "paragraph",
        "text": "{g}Taux de service{/g} — Part des demandes satisfaites, mesurée selon une règle déclarée."
      },
      {
        "kind": "paragraph",
        "text": "{g}Taux d'erreur{/g} — Part des livraisons non conformes dans le total observé."
      },
      {
        "kind": "paragraph",
        "text": "{g}Non-conformité{/g} — Écart aux caractéristiques attendues d'une livraison ou d'un article."
      },
      {
        "kind": "paragraph",
        "text": "{g}Tolérance{/g} — Écart admissible dans les conditions fixées."
      },
      {
        "kind": "paragraph",
        "text": "{g}Série comparable{/g} — Mesures obtenues avec le même périmètre, la même unité et la même méthode."
      },
      {
        "kind": "paragraph",
        "text": "{g}Rupture{/g} — Absence de stock disponible pour satisfaire une demande."
      },
      {
        "kind": "paragraph",
        "text": "{g}Analyse ABC{/g} — Classement en groupes selon un critère, notamment la valeur consommée."
      }
    ],
    "module": "704",
    "revision": "704-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-704-maths-fiche-1",
    "kind": "maths",
    "prompt": "Le stock passe de 140 à 100 unités. Calculez sa moyenne avec les deux bornes.",
    "answer": "120 unités",
    "calculation": "(140 + 100) ÷ 2 = 120.",
    "module": "704",
    "revision": "704-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-704-maths-fiche-2",
    "kind": "maths",
    "prompt": "Les stocks de début d'année et de fin de trimestre valent 180, 120, 90, 110 puis 100. Calculez la moyenne de ces relevés.",
    "answer": "120 unités",
    "calculation": "(180 + 120 + 90 + 110 + 100) ÷ 5 = 120.",
    "module": "704",
    "revision": "704-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-704-maths-fiche-3",
    "kind": "maths",
    "prompt": "Sur 360 jours, la consommation est de 2 400 unités et le stock moyen de 300. Trouvez la rotation et la durée moyenne.",
    "answer": "8 rotations, 45 jours",
    "calculation": "2 400 ÷ 300 = 8. 360 ÷ 8 = 45.",
    "module": "704",
    "revision": "704-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-704-maths-fiche-4",
    "kind": "maths",
    "prompt": "Il reste 168 unités et les sorties moyennes sont de 24 unités par jour ouvré. Quelle couverture reste-t-il ?",
    "answer": "7 jours ouvrés",
    "calculation": "168 ÷ 24 = 7.",
    "module": "704",
    "revision": "704-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-704-maths-fiche-5",
    "kind": "maths",
    "prompt": "Le site satisfait 236 des 250 commandes dans le délai convenu. Calculez le taux selon ce critère.",
    "answer": "94,4 %",
    "calculation": "236 ÷ 250 × 100 = 94,4.",
    "module": "704",
    "revision": "704-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-704-maths-fiche-6",
    "kind": "maths",
    "prompt": "Sur 420 livraisons, 15 sont non conformes dont 3 présentent plusieurs défauts. Calculez le taux d'erreur par livraison, au dixième.",
    "answer": "3,6 %",
    "calculation": "15 ÷ 420 × 100 ≈ 3,6. Une livraison est comptée une fois.",
    "module": "704",
    "revision": "704-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-704-maths-fiche-7",
    "kind": "maths",
    "prompt": "Deux quais ont respectivement 2 erreurs sur 50 livraisons et 8 sur 350. Quel est le taux global ?",
    "answer": "2,5 %",
    "calculation": "(2 + 8) ÷ (50 + 350) × 100 = 2,5.",
    "module": "704",
    "revision": "704-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-704-verification-fiche-1",
    "kind": "verification",
    "prompt": "Pourquoi faut-il plusieurs relevés lorsque le stock est très saisonnier ?",
    "answer": "Les deux bornes peuvent masquer des pics ou des creux importants.",
    "module": "704",
    "revision": "704-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-704-verification-fiche-2",
    "kind": "verification",
    "prompt": "Pourquoi préciser « jour ouvré » ou « jour civil » dans une couverture ?",
    "answer": "La consommation moyenne et le délai doivent utiliser une base comparable.",
    "module": "704",
    "revision": "704-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-704-verification-fiche-3",
    "kind": "verification",
    "prompt": "Quelle différence existe entre rotation et couverture ?",
    "answer": "La rotation décrit la consommation passée par rapport au stock moyen. La couverture estime l'autonomie à partir du stock courant.",
    "module": "704",
    "revision": "704-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-704-verification-fiche-4",
    "kind": "verification",
    "prompt": "Peut-on comparer directement un taux calculé par ligne et un taux calculé par commande ?",
    "answer": "Il faut d'abord harmoniser l'unité d'observation et le critère de satisfaction.",
    "module": "704",
    "revision": "704-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-704-verification-fiche-5",
    "kind": "verification",
    "prompt": "Donnez un contrôle pour prévenir une erreur d'article sur le quai de départ.",
    "answer": "Scanner la référence de l'article et la comparer au document de préparation avant fermeture.",
    "module": "704",
    "revision": "704-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-704-situation-fiche-1",
    "kind": "situation",
    "prompt": "Un stock moyen baisse et le taux de service baisse aussi. Quels éléments faut-il examiner avant de conclure à un progrès ?",
    "answer": "Vérifier la disponibilité par référence, la demande, les délais fournisseurs et le coût des ruptures, puis comparer avec les économies de stock.",
    "module": "704",
    "revision": "704-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-704-situation-fiche-2",
    "kind": "situation",
    "prompt": "Les erreurs du fournisseur se concentrent sur des quantités trop faibles. Proposez un contrôle et un suivi.",
    "answer": "Contrôler les quantités à la réception, consigner les écarts avec le bon, et suivre le taux par fournisseur sur une période stable.",
    "module": "704",
    "revision": "704-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-704-situation-fiche-3",
    "kind": "situation",
    "prompt": "La couverture est de 4 jours ouvrés alors qu'une livraison est prévue dans 6 jours ouvrés. Que proposez-vous ?",
    "answer": "Vérifier les besoins et les réservations, confirmer le délai et organiser un dépannage ou prioriser les commandes concernées.",
    "module": "704",
    "revision": "704-v001",
    "approvedFor": [
      "CFC"
    ]
  }
] satisfies readonly LogistiqueUnit[]
