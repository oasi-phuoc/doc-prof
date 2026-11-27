import type { LogistiqueUnit } from '../approved-banks'

export const module705 = [
  {
    "id": "log-705-objectifs-apercu",
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
          "Distinguer {g}coûts totaux{/g}, fixes et variables et calculer le {g}taux de couverture{/g}",
          "Identifier les composants des coûts de stockage et calculer amortissement / coût d'un équipement",
          "Calculer {g}point de commande{/g}, stock max et expliquer min / sécurité",
          "Calculer {g}taux d'intérêt de stockage{/g} et {g}taux des coûts de possession{/g} et citer des leviers de minimisation"
        ]
      },
      {
        "kind": "heading",
        "text": "Aperçu du module 705",
        "sub": false
      },
      {
        "kind": "list",
        "items": [
          "Comparer les coûts de l'entrepôt avec l'activité et le revenu correspondant.",
          "Suivre un réapprovisionnement, du seuil de commande à la réception.",
          "Mesurer les charges liées au stock et comparer des méthodes pour les réduire."
        ]
      }
    ],
    "module": "705",
    "revision": "705-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-705-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "5. La rentabilité de l'entrepôt",
        "sub": false
      },
      {
        "kind": "paragraph",
        "text": "Gérer les marchandises pour générer le {g}moins de coûts{/g} possible. Types de coûts : voir aussi module {g}702{/g} (approfondis ici)."
      },
      {
        "kind": "heading",
        "text": "5.1 Aperçu des types de coûts",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Connaître la {g}structure des coûts{/g} (propre à chaque entreprise) = condition pour améliorer."
      },
      {
        "kind": "heading",
        "text": "5.1.1 Coûts totaux",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Coûts totaux = coûts fixes + coûts variables{/g} (module {g}702{/g})."
      },
      {
        "kind": "paragraph",
        "text": "Seuls, ils ne disent pas si l'entreprise est performante. Les comparer à une période précédente (mois, trimestre, année…) → {g}tendance{/g} +/−."
      },
      {
        "kind": "heading",
        "text": "5.1.2 Taux de couverture des coûts",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/700/705/cfc/log-705-notions-1-v001.svg",
        "alt": "Sous 100 %. Le revenu couvre les coûts. À 100 %. Le résultat est nul. Au-dessus de 100 %. Les coûts dépassent le revenu.",
        "caption": "Le calcul de ce module exprime les coûts en part des ventes."
      },
      {
        "kind": "paragraph",
        "text": "{g}Taux de couverture (%) = coûts totaux / chiffre d'affaires × 100{/g}"
      },
      {
        "kind": "table",
        "headers": [
          "Résultat",
          "Interprétation"
        ],
        "rows": [
          [
            "{g}> 100 %{/g}",
            "CA ne couvre pas les coûts → {g}pertes{/g}"
          ],
          [
            "{g}< 100 %{/g}",
            "Coûts couverts par le CA → {g}gains{/g} (rentable)"
          ],
          [
            "{g}= 100 %{/g}",
            "Recettes et coûts égaux → {g}équilibre{/g}"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "Ce ratio indique la part du chiffre d'affaires absorbée par les coûts. Sa définition doit rester identique entre les périodes comparées."
      },
      {
        "kind": "heading",
        "text": "5.2 Coûts de stockage",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Liés à la gestion des stocks. {g}Fixes{/g} = permanents, indépendants du volume. {g}Variables{/g} = proportionnels à l'activité."
      },
      {
        "kind": "heading",
        "text": "Exemple EnterSite — trimestres",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "",
          "1er trim.",
          "2e trim."
        ],
        "rows": [
          [
            "Chiffre d'affaires",
            "Fr. 48 440.–",
            "Fr. 46 550.–"
          ],
          [
            "Coûts fixes",
            "Fr. 8 550.–",
            "Fr. 8 550.–"
          ],
          [
            "Coûts variables",
            "Fr. 26 475.–",
            "Fr. 22 900.–"
          ],
          [
            "{g}Résultat{/g}",
            "Fr. 13 415.–",
            "Fr. 15 100.–"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "Meilleurs prix d'achat au T2 → variables ↓ · CA ↓ mais {g}résultat ↑{/g}. 👉 ↓ coûts (fixes ou variables) → ↑ résultat · bénéfice = travail {g}rentable{/g}."
      },
      {
        "kind": "heading",
        "text": "Composants",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "Coûts fixes",
          "Coûts variables"
        ],
        "rows": [
          [
            "Amortissements · Personnel · Intérêts · Loyers · Entretien · Assurances · Systèmes de gestion",
            "Marchandises · Vol, vieillissement, dépréciation · Goulets d'étranglement · Énergie"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "5.2.1 Amortissements",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Perte de valeur d'un bien (bâtiment, équipement…) due à l'usure. Durées indicatives :"
      },
      {
        "kind": "table",
        "headers": [
          "Bien",
          "Durée"
        ],
        "rows": [
          [
            "Bâtiment",
            "25 ans"
          ],
          [
            "Rayonnage haut",
            "15 ans"
          ],
          [
            "Rayonnages à palettes",
            "10 ans"
          ],
          [
            "Installations de transport",
            "10 ans"
          ],
          [
            "Chariots élévateurs",
            "5 ans"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "Calcul {g}linéaire{/g} (souvent sur 50 % de l'investissement pour les intérêts, cf. ex. ci-dessous)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Ex.{/g} Chariot Fr. 18 000.– / 5 ans = {g}Fr. 3 600.–{/g}/an. Après deux annuités : 18 000 − 2 × 3 600 = {g}Fr. 10 800.–{/g} au bilan."
      },
      {
        "kind": "heading",
        "text": "5.2.2–5.2.7 Autres coûts fixes",
        "sub": true
      },
      {
        "kind": "list",
        "items": [
          "{g}Personnel{/g} → module {g}703{/g}",
          "{g}Intérêts{/g} : capital étranger (hypothèque, prêt…) · taux lié à la BNS / marché + risque entreprise · taux théorique (fictif) pour le coût du capital",
          "{g}Loyers{/g} : contrat d'usage (bâtiment, entrepôts…)",
          "{g}Entretien / maintenance{/g} (prolonger la durée de vie) — repères vs investissement : bâtiments {g}1,2 %{/g} · transport {g}2,5 %{/g} · manutention {g}8 %{/g}",
          "{g}Assurances{/g} (corporel, matériel, pécuniaire) : ≈ {g}0,1–0,5 %{/g} de l'investissement (entrepôt)",
          "{g}Systèmes (ERP / stocks){/g} : maintenance, mises à jour, licences (partiellement imputés à l'entrepôt)"
        ]
      },
      {
        "kind": "heading",
        "text": "5.2.8–5.2.11 Coûts variables",
        "sub": true
      },
      {
        "kind": "list",
        "items": [
          "{g}Marchandises{/g} : actifs circulants · capital immobilisé tant que stockées · création de valeur à la vente / production (détail §5.3–5.4)",
          "{g}Vol, vieillissement, dépréciation{/g} : inventaire ≥ 1×/an · qualité / DLC / conditions de stockage",
          "{g}Goulets{/g} : place manquante → location / 3PL (valeurs indicatives)"
        ]
      },
      {
        "kind": "table",
        "headers": [
          "Service",
          "Prix indicatif (Fr.)"
        ],
        "rows": [
          [
            "Espace ~6 m haut / m²",
            "80–200"
          ],
          [
            "Palette/an (normal)",
            "85–95"
          ],
          [
            "Palette/an (sécurité ↑)",
            "110–120"
          ],
          [
            "Frigorifique / congélateur",
            "140–150 / 155–170"
          ],
          [
            "EM / palette",
            "5–10"
          ],
          [
            "Picking / article · / gamme",
            "0,60–1,00 · 5–7"
          ]
        ]
      },
      {
        "kind": "list",
        "items": [
          "{g}Énergie{/g} (gaz, électricité, eau…) : ≈ {g}0,5–1,0 %{/g} de l'investissement"
        ]
      },
      {
        "kind": "heading",
        "text": "Exemple — coût total d'un chariot à mât rétractable (Fr. 36 000.–)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Amort. 5 ans · intérêt calculé {g}8 %{/g} · entretien {g}6 %{/g} · énergie {g}950.–{/g}/an · assurances {g}0,5 %{/g}."
      },
      {
        "kind": "table",
        "headers": [
          "Poste",
          "Calcul",
          "Montant"
        ],
        "rows": [
          [
            "Énergie",
            "donné",
            "Fr. 950.–"
          ],
          [
            "Assurances",
            "36 000 × 0,5 %",
            "Fr. 180.–"
          ],
          [
            "Entretien",
            "36 000 × 6 %",
            "Fr. 2 160.–"
          ],
          [
            "{g}Coût de fonctionnement{/g}",
            "somme",
            "{g}Fr. 3 290.–{/g}"
          ],
          [
            "Amortissement",
            "36 000 / 5",
            "Fr. 7 200.–"
          ],
          [
            "Intérêt",
            "36 000 / 2 × 8 %",
            "Fr. 1 440.–"
          ],
          [
            "{g}Coût du capital{/g}",
            "somme",
            "{g}Fr. 8 640.–{/g}"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "5.3 Niveaux de stocks",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Stocks évoluent avec la demande · surveillance permanente · réapprovisionnement (fournisseur / production). Le {g}point de commande{/g} dépend de la conso prévue pendant le délai + du délai."
      },
      {
        "kind": "heading",
        "text": "5.3.1 Stock minimum (stock de couverture)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Quantité pour couvrir la demande pendant l'approvisionnement (conso moyenne × délai). Articles critiques → minimum ↑ (évite ruptures, ↑ valeur stock)."
      },
      {
        "kind": "heading",
        "text": "5.3.2 Stock de sécurité",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Libre selon stratégie · réservé aux {g}exceptions{/g} (conso ↑, retards, erreurs). Coûte cher → surtout articles {g}stratégiques{/g}. 👉 {g}Aussi peu que possible, aussi élevé que nécessaire.{/g}"
      },
      {
        "kind": "heading",
        "text": "5.3.3 Stock maximum",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Plafond pour éviter des coûts trop élevés · souvent atteint à l'arrivée de la commande."
      },
      {
        "kind": "paragraph",
        "text": "À la réception, le stock remonte d'une quantité égale à la commande reçue. Dans le scénario nominal ci-dessous, {g}stock après réception = stock de sécurité + quantité commandée{/g}."
      },
      {
        "kind": "heading",
        "text": "5.3.4 Point de commande (cote d'alerte)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/700/705/cfc/log-705-notions-2-v001.svg",
        "alt": "Commander. 100 pièces en stock. Pendant le délai. 70 pièces consommées. Réceptionner. 30 + 105 = 135 pièces.",
        "caption": "Exemple à 14 pièces par jour et 5 jours de délai."
      },
      {
        "kind": "paragraph",
        "text": "Niveau qui déclenche une nouvelle commande. ↑ délai → ↑ point de commande. Sans stock sécurité = stock minimum · avec sécurité = minimum + sécurité."
      },
      {
        "kind": "paragraph",
        "text": "{g}Point de commande = (délai d'approvisionnement × conso journalière) + stock sécurité{/g}"
      },
      {
        "kind": "paragraph",
        "text": "{g}Ex.{/g} Toner Brother TN2320 : 10 pces/j · sécurité 40 · qté optimale 70 · délai 4 j · stock au 31/08 = 90."
      },
      {
        "kind": "list",
        "items": [
          "Point de commande = (10 × 4) + 40 = {g}80{/g}",
          "Stock maximum = 40 + 70 = {g}110{/g}"
        ]
      },
      {
        "kind": "paragraph",
        "text": "Commande le 1er et 8 sept. (point atteint) · livraison le 5 et 12 (sécurité atteinte) → reconstitution jusqu'au max."
      },
      {
        "kind": "heading",
        "text": "5.3.5 Stock moyen",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Quantité moyenne sur une période → détail module {g}704{/g}."
      },
      {
        "kind": "heading",
        "text": "5.4 Minimisation des coûts de stockage",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Objectif : ↑ bénéfices en ↓ coûts. Conflit : minimiser la {g}valeur{/g} du stock {g}et{/g} maximiser la {g}disponibilité{/g}."
      },
      {
        "kind": "table",
        "headers": [
          "Stock trop élevé",
          "Stock trop faible"
        ],
        "rows": [
          [
            "Capital immobilisé ↑ · coûts entrepôt ↑ · risque vieillissement / perte de valeur",
            "Pénurie · perte clients · pertes production / ventes"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "5.4.1 Taux d'intérêt de stockage",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Données : taux d'intérêt du {g}marché{/g} · {g}rotation{/g} · {g}durée moyenne{/g} de stockage."
      },
      {
        "kind": "paragraph",
        "text": "{g}Ex.{/g} Toner HP Cyan : 60 vendues · stock moy. 20 · taux marché {g}2,5 %{/g} · prix de revient {g}71.–{/g}."
      },
      {
        "kind": "table",
        "headers": [
          "Étape",
          "Calcul",
          "Résultat"
        ],
        "rows": [
          [
            "Rotation",
            "60 / 20",
            "{g}3{/g} fois"
          ],
          [
            "Durée moy.",
            "360 / 3",
            "{g}120{/g} jours"
          ],
          [
            "Taux intérêt stockage",
            "2,5 % × 120 / 360",
            "{g}≈ 0,83 %{/g}"
          ],
          [
            "Coût capital immobilisé sur 120 jours",
            "(2,5 / 100) × (120 / 360) × 20 × 71",
            "{g}Fr. 11,83{/g}"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "👉 Rotation faible → taux d'intérêt de stockage ↑ (coûteux si peu utilisés)."
      },
      {
        "kind": "heading",
        "text": "5.4.2 Taux des coûts de stockage (possession)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Nécessaire pour la {g}quantité optimale de commande{/g} (module {g}311{/g}). Besoin : coûts de stockage · valeur moyenne du stock (stock moy. × prix de revient) · taux d'intérêt du marché."
      },
      {
        "kind": "paragraph",
        "text": "{g}Taux (%) = (coûts de stockage hors intérêts / valeur moy. du stock × 100) + taux d'intérêt du marché (%){/g}"
      },
      {
        "kind": "paragraph",
        "text": "Priorité de réduction : d'abord {g}variables{/g}, puis {g}fixes{/g} si besoin."
      },
      {
        "kind": "paragraph",
        "text": "{g}Ex.{/g} 2022 : coûts stockage 25 000 · valeur moy. 335 000 · intérêt 2,5 %. 25 000 / 335 000 × 100 ≈ {g}7,46 %{/g}. Avec 2,5 % d'intérêts, le total vaut environ {g}9,96 %{/g}."
      },
      {
        "kind": "paragraph",
        "text": "👉 Taux ↑ = mauvaise gestion ou coûts trop élevés."
      },
      {
        "kind": "heading",
        "text": "Autres leviers",
        "sub": true
      },
      {
        "kind": "list",
        "items": [
          "Respecter consommables · soigner / entretenir engins · consignes de sécurité",
          "Indicateurs de stocks (module {g}704{/g}) · optimiser les niveaux de stocks"
        ]
      }
    ],
    "module": "705",
    "revision": "705-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-705-glossaire-reconstitue",
    "kind": "glossaire",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "{g}Chiffre d'affaires{/g} — Produit des ventes rattachées à une période et à un périmètre."
      },
      {
        "kind": "paragraph",
        "text": "{g}Résultat{/g} — Différence entre les produits et les charges retenus dans l'analyse."
      },
      {
        "kind": "paragraph",
        "text": "{g}Seuil d'équilibre{/g} — Niveau où les recettes couvrent exactement les coûts considérés."
      },
      {
        "kind": "paragraph",
        "text": "{g}Ratio coûts sur chiffre d'affaires{/g} — Part du chiffre d'affaires absorbée par les coûts."
      },
      {
        "kind": "paragraph",
        "text": "{g}Coût du capital{/g} — Charge réelle ou conventionnelle liée au financement des ressources."
      },
      {
        "kind": "paragraph",
        "text": "{g}Valeur moyenne du stock{/g} — Stock moyen valorisé au prix de revient."
      },
      {
        "kind": "paragraph",
        "text": "{g}Taux de possession{/g} — Rapport des coûts de détention du stock à sa valeur moyenne, selon les postes inclus."
      },
      {
        "kind": "paragraph",
        "text": "{g}Stock de couverture{/g} — Quantité prévue pour répondre aux besoins pendant le délai de réapprovisionnement."
      },
      {
        "kind": "paragraph",
        "text": "{g}Stock de sécurité{/g} — Réserve pour absorber les aléas de demande et d'approvisionnement."
      },
      {
        "kind": "paragraph",
        "text": "{g}Point de commande{/g} — Niveau de stock qui déclenche le réapprovisionnement."
      },
      {
        "kind": "paragraph",
        "text": "{g}Stock maximum{/g} — Niveau plafond retenu dans la politique de réapprovisionnement."
      },
      {
        "kind": "paragraph",
        "text": "{g}Délai d'approvisionnement{/g} — Temps entre le déclenchement de la commande et la disponibilité de la réception."
      }
    ],
    "module": "705",
    "revision": "705-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-705-maths-fiche-1",
    "kind": "maths",
    "prompt": "Les coûts fixes sont CHF 18 000, les variables CHF 24 000 et le chiffre d'affaires CHF 50 000. Calculez résultat et ratio coûts sur chiffre d'affaires.",
    "answer": "CHF 8 000 et 84 %",
    "calculation": "Coûts 42 000. Résultat 50 000 − 42 000 = 8 000. Ratio 42 000 ÷ 50 000 × 100 = 84.",
    "module": "705",
    "revision": "705-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-705-maths-fiche-2",
    "kind": "maths",
    "prompt": "Un article sort à raison de 14 pièces par jour ouvré. Le délai est de 5 jours ouvrés et la réserve de 30 pièces. Calculez le point de commande.",
    "answer": "100 pièces",
    "calculation": "14 × 5 + 30 = 100.",
    "module": "705",
    "revision": "705-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-705-maths-fiche-3",
    "kind": "maths",
    "prompt": "L'arrivée est prévue lorsque le stock atteint 30 pièces et la commande contient 105 pièces. Quel stock obtient-on juste après réception ?",
    "answer": "135 pièces",
    "calculation": "30 + 105 = 135.",
    "module": "705",
    "revision": "705-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-705-maths-fiche-4",
    "kind": "maths",
    "prompt": "Calculez le coût annuel d'un appareil amorti CHF 5 600 par an, avec CHF 850 d'entretien, CHF 760 d'énergie, CHF 280 d'assurance et CHF 690 d'intérêt.",
    "answer": "CHF 8 180 par an",
    "calculation": "5 600 + 850 + 760 + 280 + 690 = 8 180.",
    "module": "705",
    "revision": "705-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-705-maths-fiche-5",
    "kind": "maths",
    "prompt": "À 3 % par an, calculez le coût du capital pour 60 jours sur une base 360 et une valeur de CHF 12 000.",
    "answer": "Taux sur 60 jours 0,5 %, soit CHF 60",
    "calculation": "3 % × 60 ÷ 360 = 0,5 %. 12 000 × 0,005 = 60.",
    "module": "705",
    "revision": "705-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-705-maths-fiche-6",
    "kind": "maths",
    "prompt": "Les coûts de stockage annuels hors intérêt valent CHF 9 000 et le stock moyen CHF 150 000. Le taux annuel du capital est 2 %. Calculez le taux de possession.",
    "answer": "8 %",
    "calculation": "9 000 ÷ 150 000 × 100 + 2 = 8.",
    "module": "705",
    "revision": "705-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-705-maths-fiche-7",
    "kind": "maths",
    "prompt": "Avec 6 rotations annuelles, calculez la durée moyenne sur 360 jours. À 4 % par an, quel taux appliquer pendant cette durée ?",
    "answer": "60 jours et environ 0,67 %",
    "calculation": "360 ÷ 6 = 60. 4 % × 60 ÷ 360 ≈ 0,67 %.",
    "module": "705",
    "revision": "705-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-705-verification-fiche-1",
    "kind": "verification",
    "prompt": "Que signifie un ratio coûts sur chiffre d'affaires de 100 % ?",
    "answer": "L'activité est à l'équilibre sur le périmètre considéré.",
    "module": "705",
    "revision": "705-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-705-verification-fiche-2",
    "kind": "verification",
    "prompt": "Pourquoi préciser si les intérêts sont déjà inclus dans les charges de stockage ?",
    "answer": "Pour éviter de les compter deux fois dans le taux de possession.",
    "module": "705",
    "revision": "705-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-705-verification-fiche-3",
    "kind": "verification",
    "prompt": "Quand le stock de sécurité doit-il être consommé ?",
    "answer": "En cas d'aléa, par exemple si la demande dépasse la prévision ou si le fournisseur prend du retard.",
    "module": "705",
    "revision": "705-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-705-verification-fiche-4",
    "kind": "verification",
    "prompt": "Quel effet produit une hausse du délai à demande et réserve stables ?",
    "answer": "Le niveau qui déclenche la commande augmente.",
    "module": "705",
    "revision": "705-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-705-verification-fiche-5",
    "kind": "verification",
    "prompt": "Pourquoi examiner le taux de service en même temps que les coûts de détention ?",
    "answer": "La réduction du stock peut générer des ruptures et compromettre l'activité.",
    "module": "705",
    "revision": "705-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-705-situation-fiche-1",
    "kind": "situation",
    "prompt": "Le délai varie et l'entrepôt commande encore sur la base d'une durée fixe. Que mettez-vous à jour ?",
    "answer": "Mesurer les délais réels, revoir les prévisions et la réserve par criticité, recalculer le seuil et suivre les ruptures après modification.",
    "module": "705",
    "revision": "705-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-705-situation-fiche-2",
    "kind": "situation",
    "prompt": "Un responsable choisit le chariot le moins cher à l'achat. Comment préparer une comparaison des offres ?",
    "answer": "Comparer sur la même durée les coûts de financement, énergie, entretien, assurance et temps d'arrêt, y compris la valeur finale prévue.",
    "module": "705",
    "revision": "705-v001",
    "approvedFor": [
      "CFC"
    ]
  },
  {
    "id": "log-705-situation-fiche-3",
    "kind": "situation",
    "prompt": "Le ratio coûts sur chiffre d'affaires passe de 85 % à 92 % alors que le CA augmente. Comment examiner l'écart ?",
    "answer": "Comparer volumes, coûts fixes, coûts variables unitaires et mix d'activité; vérifier les périmètres puis identifier les postes dont les coûts ont augmenté.",
    "module": "705",
    "revision": "705-v001",
    "approvedFor": [
      "CFC"
    ]
  }
] satisfies readonly LogistiqueUnit[]
