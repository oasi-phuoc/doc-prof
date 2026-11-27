import type { LogistiqueUnit } from '../approved-banks'

export const module702 = [
  {
    "id": "log-702-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "2. Les coûts de stockage",
        "sub": false
      },
      {
        "kind": "paragraph",
        "text": "Gérer les stocks génère des {g}coûts{/g} — fixes et variables — qu'il faut connaître pour optimiser l'entrepôt (lien modules {g}705{/g} / {g}704{/g})."
      },
      {
        "kind": "heading",
        "text": "2.1 Les cinq catégories de coûts",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "Catégorie",
          "Exemples de facteurs"
        ],
        "rows": [
          [
            "{g}Coût de personnel{/g}",
            "Salaires · {g}gratifications{/g} · formation"
          ],
          [
            "{g}Coût de stockage des marchandises{/g}",
            "Détérioration · vieillissement · {g}immobilisation du capital{/g}"
          ],
          [
            "{g}Coûts des locaux{/g}",
            "{g}Loyer{/g} · électricité · chauffage · nettoyage"
          ],
          [
            "{g}Manutention & auxiliaires{/g}",
            "Chariots · {g}amortissement{/g} · entretien engins"
          ],
          [
            "{g}Consommables{/g}",
            "Papier · cartouches · {g}emballages{/g}"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "2.2 Coûts fixes vs variables",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/401/commun/log-401-reserve-photo-v002.webp",
        "alt": "Rayonnages de réserve et table de préparation se trouvent dans le même dépôt.",
        "caption": "Le loyer et la place sont suivis séparément des frais qui varient avec l’activité."
      },
      {
        "kind": "table",
        "headers": [
          "Type",
          "Définition",
          "Exemples"
        ],
        "rows": [
          [
            "{g}Coûts fixes{/g}",
            "Générés {g}à long terme{/g} · indépendants du volume (souvent)",
            "Salaires · loyers · amortissements · assurances"
          ],
          [
            "{g}Coûts variables{/g}",
            "Modifiables {g}à court terme{/g} · liés à l'activité",
            "Marchandises · transport · matières premières · énergie"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "{g}Coûts totaux = coûts fixes + coûts variables{/g}"
      },
      {
        "kind": "heading",
        "text": "2.3 Engagement de capitaux & intérêts",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Immobilisation du capital{/g} = l'argent n'est pas en liquidités mais en {g}stock{/g} (ex. 1 pièce CHF 500 → 10 pièces CHF 5'000)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Valeur du stock{/g} = Σ (quantité × prix de revient)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Intérêts{/g} sur capital immobilisé : valeur stock × taux (ex. {g}2 %{/g}/an)."
      },
      {
        "kind": "heading",
        "text": "2.4 Locaux, équipements et consommables",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/409/commun/log-409-contrepoids-photo-v002.webp",
        "alt": "Un chariot élévateur orange à mât avant stationne à vide.",
        "caption": "Comparez prix d’acquisition, durée, utilisation et maintenance pour estimer le coût de l’engin."
      },
      {
        "kind": "paragraph",
        "text": "{g}Nouvel entrepôt{/g} — planification · construction · assurance · financement · équipement · entretien · énergie…"
      },
      {
        "kind": "paragraph",
        "text": "{g}Chariot neuf{/g} — productivité ↑ · énergie/entretien ↓ · sécurité · ergonomie · TCO sur durée de vie."
      },
      {
        "kind": "paragraph",
        "text": "{g}Consommables{/g} — comparer fournisseurs · commandes groupées · emballages réutilisables/recyclables."
      },
      {
        "kind": "heading",
        "text": "2.5 Amortissement linéaire",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/700/702/cfc/log-702-amortissement-schema-v003.webp",
        "alt": "La valeur du chariot passe de 24 000 à 4 000 francs en cinq ans, par diminution égale de 4 000 francs chaque année.",
        "caption": "Avec une valeur amortissable de CHF 20 000 sur cinq ans, l’amortissement annuel est de CHF 4 000."
      },
      {
        "kind": "paragraph",
        "text": "Répartition du coût d'un bien sur sa durée de vie (ex. chariot {g}5 ans{/g})."
      },
      {
        "kind": "paragraph",
        "text": "{g}Amortissement annuel{/g} = (coût d'acquisition − valeur résiduelle estimée) ÷ durée d'utilisation. {g}Valeur nette comptable{/g} = coût d'acquisition − amortissements cumulés."
      }
    ],
    "summaryBlocks": [
      {
        "kind": "heading",
        "text": "2. Les coûts de stockage",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "2.1 et 2.2 Familles de coûts",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/401/commun/log-401-reserve-photo-v002.webp",
        "alt": "Rayonnages de réserve et table de préparation se trouvent dans le même dépôt.",
        "caption": "Le loyer et la place sont suivis séparément des frais qui varient avec l’activité."
      },
      {
        "kind": "paragraph",
        "text": "Les coûts comprennent {g}personnel{/g}, {g}marchandises stockées{/g}, {g}locaux{/g}, {g}manutention{/g} et {g}consommables{/g}. Un {g}coût fixe{/g} varie peu avec le volume dans une période donnée. Un {g}coût variable{/g} suit l’activité ou la quantité traitée. Leur somme forme les {g}coûts totaux{/g}."
      },
      {
        "kind": "heading",
        "text": "2.3 Engagement de capitaux & intérêts",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Un {g}capital immobilisé{/g} reste engagé dans le stock. La valeur se calcule en additionnant les quantités multipliées par leurs prix de revient. L’{g}intérêt annuel{/g} peut s’estimer en multipliant la valeur moyenne par le taux donné. Par exemple CHF 54 000 à 3 % donnent CHF 1 620 par an."
      },
      {
        "kind": "heading",
        "text": "2.4 Locaux, équipements et consommables",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/409/commun/log-409-contrepoids-photo-v002.webp",
        "alt": "Un chariot élévateur orange à mât avant stationne à vide.",
        "caption": "Comparez prix d’acquisition, durée, utilisation et maintenance pour estimer le coût de l’engin."
      },
      {
        "kind": "paragraph",
        "text": "Comparez loyer, énergie, place, emballages et coûts des engins. Pour un chariot, considérez achat, entretien, énergie, utilisation et valeur finale sur une même durée. Une réduction de stock peut économiser de la place, mais il faut vérifier les délais et les ruptures."
      },
      {
        "kind": "heading",
        "text": "2.5 Amortissement linéaire",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/700/702/cfc/log-702-amortissement-schema-v003.webp",
        "alt": "La valeur du chariot passe de 24 000 à 4 000 francs en cinq ans, par diminution égale de 4 000 francs chaque année.",
        "caption": "Avec une valeur amortissable de CHF 20 000 sur cinq ans, l’amortissement annuel est de CHF 4 000."
      },
      {
        "kind": "paragraph",
        "text": "L’{g}amortissement linéaire{/g} répartit la valeur amortissable également par année. Calculez prix d’achat moins {g}valeur résiduelle{/g} estimée, puis divisez par la durée. La {g}valeur nette comptable{/g} correspond au prix d’acquisition moins les amortissements cumulés."
      }
    ],
    "module": "702",
    "revision": "702-v003",
    "approvedFor": [
      "CFC"
    ]
  }
] satisfies readonly LogistiqueUnit[]
