import type { LogistiqueUnit } from '../approved-banks'

export const module310 = [
  {
    "id": "log-310-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "10. Préparation à la mise en stock",
        "sub": false
      },
      {
        "kind": "paragraph",
        "text": "Dernière étape de la logistique d'{g}approvisionnement{/g}, après contrôles qualité et quantité. Organisation selon exigences internes et nature de la marchandise (stockage, transport, vente)."
      },
      {
        "kind": "paragraph",
        "text": "Sans exigences particulières → stockage direct. Sinon : {g}réemballage{/g}, {g}repacking{/g} ou {g}étiquetage{/g} spécial."
      },
      {
        "kind": "heading",
        "text": "10.1 Objectifs d'un nouvel emballage",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/310/commun/log-310-mise-en-stock-photo-v002.webp",
        "alt": "Une personne prépare des cartons sur une palette partiellement filmée.",
        "caption": "Le conditionnement rend le lot plus stable et le prépare à être transporté ou rangé."
      },
      {
        "kind": "paragraph",
        "text": "Raisons de reconditionner / réétiqueter :"
      },
      {
        "kind": "paragraph",
        "text": "{g}Présentation{/g} Inscription, logo ou couleur ≠ emballage de vente cible → déballer et réemballer."
      },
      {
        "kind": "paragraph",
        "text": "{g}Emballage incorrect{/g} Taille inadaptée (POS), endommagé, image de vente, perte de fonction de protection → nouvel emballage adapté."
      },
      {
        "kind": "paragraph",
        "text": "{g}Marquage des promotions{/g} Réduction / nouveau prix indiqués sur le produit."
      },
      {
        "kind": "paragraph",
        "text": "{g}Nouvelles tailles d'emballage{/g} Achat à la pièce mais ventes en lots → assembler des pièces (conception de lot)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Création de bundles{/g} Ex. EnterSite : toners C/M/Y/K vendus séparément {g}ou{/g} en « Rainbow Kit » regroupé."
      },
      {
        "kind": "paragraph",
        "text": "{g}Manutention{/g} Faciliter la logistique (ex. bac à bec pour centaines de vis vs pièce à pièce)."
      },
      {
        "kind": "paragraph",
        "text": "{g}Type de stockage / préparation{/g} Rayonnages à palettes → préparer sur palettes conformes ; emplacements de prélèvement → bacs."
      },
      {
        "kind": "paragraph",
        "text": "{g}Automatisation{/g} Ex. rayonnage palettes auto → marquage d'identification pour stockage/déstockage système."
      },
      {
        "kind": "heading",
        "text": "10.2 Enregistrement de la marchandise",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/100/110/commun/log-110-mouvement-photo-v002.webp",
        "alt": "Une opératrice enregistre le rangement du carton avec un terminal.",
        "caption": "Reliez l’unité au bon article et au bon emplacement dans le système."
      },
      {
        "kind": "paragraph",
        "text": "En fin de préparation : {g}enregistrement{/g} dans l'ERP (même si pas de modification d'emballage)."
      },
      {
        "kind": "paragraph",
        "text": "Réception {g}planifiée{/g} (module 303) : commande déjà pré-enregistrée → à la préparation, enregistrement + transfert vers l'emplacement."
      },
      {
        "kind": "heading",
        "text": "10.3 Gestion des stocks",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "L'article est enregistré dès réception de la commande."
      },
      {
        "kind": "heading",
        "text": "10.3.1 Notions de base",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Terminologie {g}non uniforme{/g} selon sources."
      },
      {
        "kind": "paragraph",
        "text": "{g}Article{/g} = marchandise en stock dont toutes les parties sont {g}identiques{/g}. Une caractéristique différente = autre article."
      },
      {
        "kind": "paragraph",
        "text": "Ex. toners : - CE410X 305 X Toner BLACK - CE411A 305 Toner CYAN - CE412A 305 Toner YELLOW - CE413A 305 Toner MAGENTA"
      },
      {
        "kind": "heading",
        "text": "10.3.2 En-tête de la fiche de stock",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Données article / stock (SGS ou ERP) :"
      },
      {
        "kind": "table",
        "headers": [
          "#",
          "Élément",
          "Rôle"
        ],
        "rows": [
          [
            "1",
            "{g}N° d'article{/g}",
            "Identification unique"
          ],
          [
            "2",
            "{g}Désignation{/g}",
            "Contrôle visuel, anti-confusion"
          ],
          [
            "3",
            "{g}UL{/g} (unité de livraison)",
            "Qté minimale livrée par le fournisseur (ex. 5)"
          ],
          [
            "4",
            "{g}UV{/g} (unité de vente)",
            "Qté minimale de vente (souvent 1)"
          ],
          [
            "5",
            "{g}Prix d'achat{/g}",
            "Coût d'acquisition · évaluation stocks · {g}confidentiel{/g} · ≠ prix de vente (PV)"
          ],
          [
            "6",
            "{g}Fournisseur{/g}",
            "Réactivité en cas d'irrégularité"
          ],
          [
            "7",
            "{g}Stock maximal{/g}",
            "Selon rotation + espace · évite surstocks coûteux"
          ],
          [
            "8",
            "{g}Point de commande{/g} (cote d'alerte)",
            "Niveau déclenchant une nouvelle commande (souvent auto)"
          ],
          [
            "9",
            "{g}Stock de sécurité{/g} (stock min.)",
            "Réserve « coups durs » · ne devrait pas être franchi"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "10.3.3 Les saisies comptables",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/800/801/commun/log-801-etiquette-photo-v002.webp",
        "alt": "Une étiquette logistique est placée à plat sur une palette filmée près d’un lecteur.",
        "caption": "L’identifiant de l’unité permet d’associer l’entrée ou la sortie au bon mouvement. Vérifiez la référence et l’unité avant la saisie."
      },
      {
        "kind": "table",
        "headers": [
          "#",
          "Colonne",
          "Effet"
        ],
        "rows": [
          [
            "10",
            "{g}Date{/g}",
            "Saisie (+ souvent ID utilisateur pour traçabilité)"
          ],
          [
            "11",
            "{g}Entrées{/g}",
            "↑ stock"
          ],
          [
            "12",
            "{g}Sorties{/g}",
            "↓ stock"
          ],
          [
            "13",
            "{g}Stock réservé{/g}",
            "Physique mais non disponible · ↓ disponible, pas le total"
          ],
          [
            "14",
            "{g}Stock AQ{/g}",
            "En attente de contrôle · physique, non disponible"
          ],
          [
            "15",
            "{g}Stock bloqué{/g}",
            "Inutilisable / non livrable · dans le total, pas le disponible"
          ],
          [
            "16",
            "{g}Stock disponible{/g}",
            "Livrable immédiatement"
          ],
          [
            "17",
            "{g}Stock total{/g}",
            "Disponible + réservé + AQ + bloqué"
          ]
        ]
      },
      {
        "kind": "heading",
        "text": "10.3.4 Exemple de comptabilisation",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Stock initial 01.09 : {g}10'000{/g} (disponible = total)."
      },
      {
        "kind": "table",
        "headers": [
          "Date",
          "Entrée",
          "Sortie",
          "Disponible / Total"
        ],
        "rows": [
          [
            "01.09",
            "",
            "",
            "10'000"
          ],
          [
            "02.09",
            "",
            "2'870",
            "7'130"
          ],
          [
            "03.09",
            "",
            "1'640",
            "5'490"
          ],
          [
            "04.09",
            "",
            "3'980",
            "1'510"
          ],
          [
            "05.09",
            "5'000",
            "",
            "6'510"
          ],
          [
            "06.09",
            "",
            "2'300",
            "4'210"
          ]
        ]
      },
      {
        "kind": "paragraph",
        "text": "Entrées/sorties concrètes → disponible et total fluctuent de la {g}même{/g} quantité (sans réservation/AQ/blocage)."
      }
    ],
    "summaryBlocks": [
      {
        "kind": "heading",
        "text": "10. Préparation à la mise en stock",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "10.1 Objectifs d'un nouvel emballage",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/300/310/commun/log-310-mise-en-stock-photo-v002.webp",
        "alt": "Une personne prépare des cartons sur une palette partiellement filmée.",
        "caption": "Le conditionnement rend le lot plus stable et le prépare à être transporté ou rangé."
      },
      {
        "kind": "paragraph",
        "text": "Un {g}reconditionnement{/g} peut protéger l’article, adapter la taille du lot, le rendre saisissable ou permettre un stockage automatique. Il doit conserver la référence, le lot et les consignes utiles. Préparer un {g}bundle{/g} regroupe les articles en un lot prévu. Vérifiez stabilité et compatibilité avec l’équipement."
      },
      {
        "kind": "heading",
        "text": "10.2 Enregistrement de la marchandise",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/100/110/commun/log-110-mouvement-photo-v002.webp",
        "alt": "Une opératrice enregistre le rangement du carton avec un terminal.",
        "caption": "Reliez l’unité au bon article et au bon emplacement dans le système."
      },
      {
        "kind": "paragraph",
        "text": "Après les contrôles, enregistrez la référence, la quantité, la date, l’état et l’{g}emplacement{/g} selon le système. Une {g}étiquette logistique{/g} associe l’unité à ses données. Vérifiez qu’elle reste accessible à la lecture après emballage."
      },
      {
        "kind": "heading",
        "text": "10.3 Gestion des stocks",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/800/801/commun/log-801-etiquette-photo-v002.webp",
        "alt": "Une étiquette logistique est placée à plat sur une palette filmée près d’un lecteur.",
        "caption": "L’identifiant de l’unité permet d’associer l’entrée ou la sortie au bon mouvement. Vérifiez la référence et l’unité avant la saisie."
      },
      {
        "kind": "paragraph",
        "text": "La {g}fiche de stock{/g} contient des données de base, comme la référence et l’unité. Les {g}mouvements{/g} sont les entrées, sorties et transferts. Ils expliquent le solde. Si vous transférez un article sans modifier le total, confirmez le nouvel emplacement. Corrigez avec un justificatif et gardez la trace."
      }
    ],
    "module": "310",
    "revision": "310-v003",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
