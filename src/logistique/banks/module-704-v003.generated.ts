import type { LogistiqueUnit } from '../approved-banks'

export const module704 = [
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
        "kind": "image",
        "src": "/assets/logistique/700/701/commun/log-701-inventaire-photo-v002.webp",
        "alt": "Une personne effectue un relevé physique des quantités.",
        "caption": "La moyenne s’appuie sur des relevés définis et comparables."
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
        "kind": "image",
        "src": "/assets/logistique/300/312/commun/log-312-cycle-stock-schema-v003.webp",
        "alt": "Le stock passe de 160 à 80 au jour 4 où la commande est lancée. Il atteint 40 au jour 6. La réception le fait remonter à 160.",
        "caption": "Si le stock actuel vaut 80 pièces et que 20 sont consommées par jour, il peut couvrir quatre jours à cadence constante sans nouvelle entrée."
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
        "src": "/assets/logistique/700/704/cfc/log-704-indicateurs-photo-v002.webp",
        "alt": "Deux superviseurs examinent un graphique et les données devant une allée.",
        "caption": "Une valeur de suivi s’interprète selon la période, la base du calcul et l’objectif choisi."
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
    "summaryBlocks": [
      {
        "kind": "heading",
        "text": "4. Les indicateurs logistiques",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "4.1 Le stock moyen",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/700/701/commun/log-701-inventaire-photo-v002.webp",
        "alt": "Une personne effectue un relevé physique des quantités.",
        "caption": "La moyenne s’appuie sur des relevés définis et comparables."
      },
      {
        "kind": "paragraph",
        "text": "Le {g}stock moyen{/g} représente le niveau de stock pendant une période. On peut prendre les valeurs de début et de fin, ou plusieurs relevés à intervalles réguliers. Avec le début et quatre fins de trimestre, divisez par 5. Avec le début et douze fins de mois, divisez par 13. Utilisez des unités et dates comparables."
      },
      {
        "kind": "heading",
        "text": "4.2 La rotation des stocks",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Rotation = consommation ÷ stock moyen{/g}. Les valeurs couvrent la même période et utilisent la même unité. La {g}durée moyenne{/g} se calcule avec la durée de la période divisée par la rotation. Avec 2 400 unités sorties, un stock moyen de 300 et une base de 360 jours, on obtient 8 rotations et 45 jours."
      },
      {
        "kind": "heading",
        "text": "4.3 La couverture des stocks",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/312/commun/log-312-cycle-stock-schema-v003.webp",
        "alt": "Le stock passe de 160 à 80 au jour 4 où la commande est lancée. Il atteint 40 au jour 6. La réception le fait remonter à 160.",
        "caption": "Si le stock actuel vaut 80 pièces et que 20 sont consommées par jour, il peut couvrir quatre jours à cadence constante sans nouvelle entrée."
      },
      {
        "kind": "paragraph",
        "text": "La {g}couverture{/g} estime combien de jours le stock actuel peut soutenir. Divisez ce stock par la consommation moyenne par jour. Choisissez la même base en jours ouvrés ou civils pour la demande et le délai."
      },
      {
        "kind": "heading",
        "text": "4.4 et 4.5 Service et erreurs",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/700/704/cfc/log-704-indicateurs-photo-v002.webp",
        "alt": "Deux superviseurs examinent un graphique et les données devant une allée.",
        "caption": "Une valeur de suivi s’interprète selon la période, la base du calcul et l’objectif choisi."
      },
      {
        "kind": "paragraph",
        "text": "{g}Taux de service = demandes satisfaites ÷ demandes totales × 100{/g}. {g}Taux d’erreur = livraisons non conformes ÷ livraisons totales × 100{/g}. Définissez si vous comptez des pièces, des lignes ou des commandes. Suivez les écarts de référence, quantité ou état pour agir à l’émission ou à la réception."
      }
    ],
    "module": "704",
    "revision": "704-v003",
    "approvedFor": [
      "CFC"
    ]
  }
] satisfies readonly LogistiqueUnit[]
