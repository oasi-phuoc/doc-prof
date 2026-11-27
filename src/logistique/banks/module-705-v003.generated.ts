import type { LogistiqueUnit } from '../approved-banks'

export const module705 = [
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
        "kind": "image",
        "src": "/assets/logistique/700/704/cfc/log-704-indicateurs-photo-v002.webp",
        "alt": "Deux responsables rapprochent des données et un graphique d’activité.",
        "caption": "Rapprochez coûts et recettes sur la même période. Le ratio exprime la part des recettes utilisée par les coûts."
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
        "kind": "image",
        "src": "/assets/logistique/700/702/cfc/log-702-amortissement-schema-v003.webp",
        "alt": "La valeur du chariot passe de 24 000 à 4 000 francs en cinq ans, par diminution égale de 4 000 francs chaque année.",
        "caption": "La part amortie du coût du chariot entre dans la comparaison de son coût sur la durée retenue."
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
        "kind": "image",
        "src": "/assets/logistique/400/401/commun/log-401-reserve-photo-v002.webp",
        "alt": "Une zone de réserve alimente les emplacements utilisés pour les sorties.",
        "caption": "Le point de commande tient compte de ce qui sera consommé pendant le délai et de la réserve prévue."
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
    "summaryBlocks": [
      {
        "kind": "heading",
        "text": "5. La rentabilité de l'entrepôt",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "5.1 Aperçu des types de coûts",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/700/704/cfc/log-704-indicateurs-photo-v002.webp",
        "alt": "Deux responsables rapprochent des données et un graphique d’activité.",
        "caption": "Rapprochez coûts et recettes sur la même période. Le ratio exprime la part des recettes utilisée par les coûts."
      },
      {
        "kind": "paragraph",
        "text": "Le {g}résultat{/g} vaut le chiffre d’affaires moins les coûts retenus. Le {g}ratio coûts sur chiffre d’affaires{/g} exprime les coûts en pourcentage des recettes. À 100 %, elles couvrent exactement les coûts. Au-dessus, le résultat est négatif. Comparez sur un même périmètre."
      },
      {
        "kind": "heading",
        "text": "5.2 Coûts de stockage",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/700/702/cfc/log-702-amortissement-schema-v003.webp",
        "alt": "La valeur du chariot passe de 24 000 à 4 000 francs en cinq ans, par diminution égale de 4 000 francs chaque année.",
        "caption": "La part amortie du coût du chariot entre dans la comparaison de son coût sur la durée retenue."
      },
      {
        "kind": "paragraph",
        "text": "Suivez frais {g}fixes{/g} et {g}variables{/g}, par exemple locaux, personnel, capital et consommation d’énergie. Pour un chariot, additionnez {g}amortissement{/g}, entretien, énergie, assurance et intérêts selon l’analyse. Comparez le coût total sur des périodes et usages équivalents."
      },
      {
        "kind": "heading",
        "text": "5.3 Niveaux de stocks",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/401/commun/log-401-reserve-photo-v002.webp",
        "alt": "Une zone de réserve alimente les emplacements utilisés pour les sorties.",
        "caption": "Le point de commande tient compte de ce qui sera consommé pendant le délai et de la réserve prévue."
      },
      {
        "kind": "paragraph",
        "text": "Le {g}stock de couverture{/g} répond au besoin pendant le délai. Le {g}stock de sécurité{/g} absorbe les écarts. Le {g}point de commande{/g} vaut consommation prévue pendant le délai plus stock de sécurité. Si 14 pièces sortent par jour pendant 5 jours et que la réserve vaut 30, commandez à 100 pièces. Avec une réception de 105 pièces quand il reste 30, le stock remonte à 135."
      },
      {
        "kind": "heading",
        "text": "5.4 Minimisation des coûts de stockage",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Le {g}taux d’intérêt de stockage{/g} prorate le taux annuel sur la durée de détention. Le {g}taux de possession{/g} rapporte les coûts de stock à la valeur moyenne. Vérifiez si les intérêts sont déjà inclus. Comparez les réductions de coûts aux effets sur la disponibilité et la qualité."
      }
    ],
    "module": "705",
    "revision": "705-v003",
    "approvedFor": [
      "CFC"
    ]
  }
] satisfies readonly LogistiqueUnit[]
