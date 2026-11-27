import type { LogistiqueUnit } from '../approved-banks'

export const module312 = [
  {
    "id": "log-312-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "12. Données de stockage",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "12.1 STOCK : définition et importance",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Le {g}stock{/g} = ensemble des produits stockés (matières premières, semi-finis, finis)."
      },
      {
        "kind": "paragraph",
        "text": "Rôle : couvrir les besoins futurs (clients / production) et garantir une exploitation normale. Coût = {g}capital immobilisé{/g}. Trop élevé → argent manquant pour d'autres investissements. Trop faible → rupture, CA ↓, retards de production."
      },
      {
        "kind": "paragraph",
        "text": "> Règle : {g}aussi peu que possible — autant que nécessaire.{/g}"
      },
      {
        "kind": "paragraph",
        "text": "Niveau idéal = satisfaire demande interne/externe {g}sans{/g} surstocks. Exige chaînes d'approvisionnement fiables + {g}prévisions de vente{/g} transparentes."
      },
      {
        "kind": "heading",
        "text": "12.2 Classification (date / périssabilité)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/312/commun/log-312-froid-photo-v002.webp",
        "alt": "Des cartons sont rangés sur des rayonnages à proximité d’une porte isolante.",
        "caption": "Pour une marchandise périssable, suivez le lot, la date et les conditions requises."
      },
      {
        "kind": "table",
        "headers": [
          "Groupe",
          "Caractéristique",
          "Principe",
          "Exemples"
        ],
        "rows": [
          [
            "{g}Avec date d'expiration{/g}",
            "À consommer avant date",
            "{g}FEFO{/g} (First Expired, First Out)",
            "Médicaments, yaourt, lait…"
          ],
          [
            "{g}Périssables{/g}",
            "Qualité qui se dégrade vite",
            "{g}FIFO{/g} (First In, First Out)",
            "Surgelés, viande/poisson, fruits/légumes, fleurs, chimie"
          ],
          [
            "{g}Non périssables{/g}",
            "Qualité stable dans le temps",
            "{g}LIFO{/g} possible",
            "Vis/écrous, tubes/profilés, machines"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "12.3 Types de stocks",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "{g}Stock physique (réel){/g} — quantité présente, dont une partie peut être réservée, bloquée ou en cours de contrôle."
      },
      {
        "kind": "paragraph",
        "text": "{g}Stock mini (minimum){/g} — couvre la consommation pendant le délai de réapprovisionnement."
      },
      {
        "kind": "paragraph",
        "text": "> Stock mini = consommation journalière × délai de réapprovisionnement (jours)"
      },
      {
        "kind": "paragraph",
        "text": "{g}Stock de sécurité{/g} — réserve définie pour couvrir des aléas, par exemple : - besoins supplémentaires non prévus / aléas de production - délai de réappro retardé → maintient la {g}capacité de livraison{/g}."
      },
      {
        "kind": "paragraph",
        "text": "{g}Stock maximum{/g} — limite supérieure (place, coûts, obsolescence technique — ex. multimédia)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Point de commande (cote d'alerte){/g} — seuil déclenchant une nouvelle commande :"
      },
      {
        "kind": "paragraph",
        "text": "> Point de commande = (consommation journalière × délai réappro) + stock de sécurité"
      },
      {
        "kind": "paragraph",
        "text": "{g}Stock négatif (manquant){/g} — pas physique ; indique la quantité manquante / incapacité à livrer. À éviter."
      },
      {
        "kind": "paragraph",
        "text": "{g}Stock temporaire{/g} — lié aux temps de passage différents (AQ entrée, conditionnement sortie…)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Stock saisonnier{/g} — demande liée à une saison/événement (ex. lapins de Pâques)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Stock dormant{/g} — obsolète techniquement ou périmé → à retirer."
      },
      {
        "kind": "paragraph",
        "text": "{g}Stock spéculatif{/g} — achat anticipé (hausse de prix / risques livraison) au-delà du stock actif."
      },
      {
        "kind": "heading",
        "text": "12.4 Aspect opérationnel",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "Notion",
          "Sens"
        ],
        "rows": [
          [
            "{g}Stock optimal{/g}",
            "Équilibre besoins / commandes / coûts de stockage (rentabilité)"
          ],
          [
            "{g}Sur réservation / JIT{/g}",
            "Court terme · quantités exactes · stocks bas"
          ],
          [
            "{g}Réservation{/g}",
            "Précommandé pour un but · encore physique jusqu'à la sortie"
          ],
          [
            "{g}Stock total / physique{/g}",
            "Quantité réellement présente"
          ],
          [
            "{g}Stock net{/g}",
            "Total − réservations"
          ],
          [
            "{g}Stock disponible{/g}",
            "Total − réservé − AQ − bloqué"
          ],
          [
            "{g}Stock AQ{/g}",
            "Physique mais non utilisable tant que contrôle qualité en cours · dans total, pas disponible · si KO → bloqué"
          ],
          [
            "{g}Stock bloqué{/g}",
            "Non utilisable/livrable · dans total, pas disponible"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "12.5 Gestion des stocks",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/100/110/commun/log-110-mouvement-photo-v002.webp",
        "alt": "Le terminal enregistre le placement d’un carton sur un rayon.",
        "caption": "L’emplacement et le solde doivent correspondre aux mouvements enregistrés."
      },
      {
        "kind": "heading",
        "text": "12.5.1–12.5.2 Article",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Marchandise stockée {g}identique dans toutes ses parties{/g}. Une caractéristique différente (ex. hauteur) → {g}nouveau n° d'article{/g}."
      },
      {
        "kind": "paragraph",
        "text": "Ex. cylindre ∅ 45 mm : H 125 / 135 / 145 → trois n° distincts."
      },
      {
        "kind": "heading",
        "text": "12.5.3 En-tête de fiche (données statiques)",
        "sub": true
      },
      {
        "kind": "table",
        "headers": [
          "Champ",
          "Rôle"
        ],
        "rows": [
          [
            "N° d'article",
            "Identification unique"
          ],
          [
            "Désignation",
            "Complément / anti-confusion"
          ],
          [
            "Unité de livraison (UL)",
            "Qté min. de commande fournisseur (ex. par 5)"
          ],
          [
            "Unité de vente (UV)",
            "Qté min. de vente (souvent 1)"
          ],
          [
            "Prix d'achat",
            "Interne · valeur de stock · ≠ prix de vente"
          ],
          [
            "Fournisseur",
            "Fournisseur standard"
          ],
          [
            "Stock maximum",
            "Limite"
          ],
          [
            "Point de commande",
            "Proposition de commande auto"
          ],
          [
            "Stock de sécurité",
            "Capacité de livraison"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "12.5.4 Mouvements (données dynamiques)",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Date · Entrées (↑) · Sorties (↓) · Réservé · AQ · Bloqué · {g}Disponible{/g} · {g}Total{/g} Total = disponible + réservé + AQ + bloqué."
      },
      {
        "kind": "heading",
        "text": "12.5.5–12.5.7 Comptabilisations",
        "sub": true
      },
      {
        "kind": "list",
        "items": [
          "Entrées/sorties {g}physiques{/g} → disponible et total bougent de la {g}même{/g} quantité.",
          "Entrée en {g}AQ{/g} → ↑ total, pas le disponible ; libération OK → AQ → disponible (total inchangé) ; part KO → {g}bloqué{/g} ; retour fournisseur → sortie + ↓ total.",
          "{g}Réservation{/g} → ↑ réservé, ↓ disponible, total inchangé ; à la sortie prévue → réservé → 0, ↓ total ; disponible déjà ajusté.",
          "Sortie supplémentaire le même jour qu'une réservation : disponible ↓ seulement de la nouvelle sortie ; total ↓ réservation + nouvelle sortie."
        ]
      },
      {
        "kind": "heading",
        "text": "12.5.8 Cycle graphique (schéma typique)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/312/commun/log-312-cycle-stock-schema-v003.webp",
        "alt": "Le stock passe de 160 à 80 au jour 4 où la commande est lancée. Il atteint 40 au jour 6. La réception le fait remonter à 160.",
        "caption": "La pente représente la consommation. La montée au jour 6 représente la réception du lot."
      },
      {
        "kind": "paragraph",
        "text": "Baisse régulière → point de commande → commande → arrivée avant stock mini → hausse (parfois jusqu'au max) → forte demande : stock de sécurité évite la rupture · ou consommation trop forte → stock mini épuisé → {g}rupture / non-livraison{/g}."
      },
      {
        "kind": "heading",
        "text": "12.6 Conclusion",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Ces données donnent du sens opérationnel aux {g}6B{/g} (Jünemann) : bonne marchandise, quantité, qualité, moment, endroit, prix."
      }
    ],
    "summaryBlocks": [
      {
        "kind": "heading",
        "text": "12. Données de stockage",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "12.1 à 12.3 Stocks et dates",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/312/commun/log-312-froid-photo-v002.webp",
        "alt": "Des cartons sont rangés sur des rayonnages à proximité d’une porte isolante.",
        "caption": "Pour une marchandise périssable, suivez le lot, la date et les conditions requises."
      },
      {
        "kind": "paragraph",
        "text": "Le {g}stock physique{/g} est ce qui est réellement présent. Le stock {g}disponible{/g} tient compte des réservations et blocages. La {g}date limite{/g} et les conditions de conservation influencent la sortie. Le {g}stock minimum{/g} couvre la demande pendant le délai. Le {g}stock de sécurité{/g} absorbe les aléas. Le {g}stock maximum{/g} limite l’espace et les coûts. Le {g}point de commande{/g} déclenche l’achat."
      },
      {
        "kind": "paragraph",
        "text": "Un {g}stock saisonnier{/g} répond à un pic attendu. Le {g}stock temporaire{/g} couvre une attente de processus. Le {g}stock dormant{/g} n’est presque plus utilisé. Le {g}stock spéculatif{/g} anticipe une hausse ou un manque. Un {g}stock négatif{/g} dans le système indique un besoin ou un écart à expliquer."
      },
      {
        "kind": "heading",
        "text": "12.4 Aspect opérationnel",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Vérifiez le stock avant de servir une commande. Repérez un risque de rupture en comparant la couverture et le délai de livraison. Pour les articles datés, identifiez le lot et utilisez la règle de rotation prévue."
      },
      {
        "kind": "heading",
        "text": "12.5 Gestion des stocks",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/312/commun/log-312-cycle-stock-schema-v003.webp",
        "alt": "Le stock passe de 160 à 80 au jour 4 où la commande est lancée. Il atteint 40 au jour 6. La réception le fait remonter à 160.",
        "caption": "La pente représente la consommation. La montée au jour 6 représente la réception du lot."
      },
      {
        "kind": "image",
        "src": "/assets/logistique/100/110/commun/log-110-mouvement-photo-v002.webp",
        "alt": "Le terminal enregistre le placement d’un carton sur un rayon.",
        "caption": "L’emplacement et le solde doivent correspondre aux mouvements enregistrés."
      },
      {
        "kind": "paragraph",
        "text": "L’{g}article{/g} possède une référence et une unité de base. Les {g}données statiques{/g} décrivent l’article. Les {g}données de mouvement{/g} enregistrent les entrées, sorties et transferts. Le solde résulte des écritures. Le {g}cycle de stock{/g} descend avec la consommation et remonte à la réception. Comparez les quantités dans la même unité et tracez chaque correction."
      }
    ],
    "module": "312",
    "revision": "312-v003",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
