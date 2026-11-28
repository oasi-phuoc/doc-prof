import type { LogistiqueUnit } from '../approved-banks'

export const module406 = [
  {
    "id": "log-406-theorie-source",
    "kind": "theorie",
    "blocks": [
      {
        "kind": "heading",
        "text": "6. Principes de stockage",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "6.1 Lotissement par case (emplacement fixe)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/406/commun/log-406-emplacement-fixe-photo-v010.webp",
        "alt": "Le bac revient à la place où la même référence est indiquée sur le rayonnage.",
        "caption": "La référence du bac et celle de son emplacement sont identiques. La place reste réservée quand le bac est vide."
      },
      {
        "kind": "paragraph",
        "text": "Chaque article a un emplacement {g}définitivement attribué{/g} — « chaque chose à sa place ». Courant : rayons libre-service, entrepôts commerciaux, préparation de commandes."
      },
      {
        "kind": "paragraph",
        "text": "Souvent sans {g}SGS{/g} (gestion de stock informatisée). Inconvénient : fortes fluctuations → {g}mauvaise{/g} utilisation de l'espace (emplacement réservé au stock {g}maximal{/g} même si case quasi vide)."
      },
      {
        "kind": "paragraph",
        "text": "Cas optimal : stock max atteint (souvent juste après une livraison). Sinon : emplacements vides inutilisables pour d'autres articles."
      },
      {
        "kind": "heading",
        "text": "6.2 Stockage chaotique (anarchique)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/406/commun/log-406-affectation-dynamique-photo-v010.webp",
        "alt": "Une opératrice relève l’adresse d’une position libre avant de ranger le lot.",
        "caption": "L’opératrice relève l’adresse d’une place libre pour enregistrer la nouvelle position du lot."
      },
      {
        "kind": "paragraph",
        "text": "Le stockage dynamique attribue une place libre et compatible avec l’article. Le système doit conserver la position réelle du lot."
      },
      {
        "kind": "paragraph",
        "text": "{g}Remarque :{/g} possible {g}uniquement{/g} avec gestion de stock {g}assistée par ordinateur{/g}."
      },
      {
        "kind": "heading",
        "text": "6.2.1 Conditions",
        "sub": true
      },
      {
        "kind": "paragraph",
        "text": "Tenir compte des caractéristiques produits et {g}interdictions de stockage en commun{/g} (systèmes optimisés). Prendre en compte fréquences / rotations. Répartir sur plusieurs zones → une panne n'empêche pas de déstocker tout un groupe."
      },
      {
        "kind": "heading",
        "text": "6.3 FIFO — First In, First Out",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/406/commun/log-406-fifo-photo-v002.webp",
        "alt": "Des cartons occupent des pistes inclinées à rouleaux, ouvertes aux deux extrémités.",
        "caption": "Si l’entrée se fait à l’arrière et la sortie à l’avant, le premier colis entré arrive au point de prélèvement."
      },
      {
        "kind": "paragraph",
        "text": "En FIFO, sortir d’abord le lot entré en premier selon la règle de l’article. Si l’échéance est prioritaire, appliquer le FEFO défini par le site."
      },
      {
        "kind": "paragraph",
        "text": "{g}Formes qui supportent le FIFO{/g} (si bien utilisées) : - rayonnage {g}dynamique{/g} - drive-in à {g}double entrée{/g} - stockage en pile avec prélèvement à la {g}base{/g}"
      },
      {
        "kind": "heading",
        "text": "6.4 LIFO — Last In, First Out",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/403/commun/log-403-drivein-photo-v003.webp",
        "alt": "Des palettes sont rangées les unes derrière les autres dans une travée à rails.",
        "caption": "Une travée profonde à accès unique peut imposer de reprendre la dernière palette entrée avant celles qui se trouvent derrière."
      },
      {
        "kind": "paragraph",
        "text": "Généralement {g}non recommandé{/g} (formation de « stocks » anciens). Inévitable avec : - stockage en {g}bloc{/g} - lignes/rangées accessibles d'{g}un seul{/g} côté - drive-in à {g}une{/g} entrée"
      },
      {
        "kind": "paragraph",
        "text": "Sur rayonnages palettes/compartiments : ni favorisé ni empêché — les logisticiens doivent gérer la rotation : {g}nouvelles marchandises derrière{/g} les anciennes."
      },
      {
        "kind": "heading",
        "text": "6.5 HIFO — Highest In, First Out",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/406/commun/log-406-hifo-photo-v010.webp",
        "alt": "Au bureau, la fiche de la pièce à 48 CHF passe avant celle de la pièce à 32 CHF dans le dossier de sortie.",
        "caption": "Dans cet exemple, la sortie est valorisée d’abord au coût de 48 CHF."
      },
      {
        "kind": "paragraph",
        "text": "Dans cette convention de valorisation, l’unité achetée 48 CHF entre dans le calcul du coût de sortie avant celle achetée 32 CHF. Le préparateur suit la règle physique et la consigne de lot applicables, par exemple FIFO ou FEFO."
      },
      {
        "kind": "paragraph",
        "text": "Procédure de {g}valorisation{/g} des stocks : sortir d'abord les plus {g}chers{/g} → stock valorisé aux prix d'achat les plus bas (chiffre d'affaires élevé / stock final faible à l'inventaire · parfois réduction du revenu imposable). Courant à l'étranger ; {g}pas{/g} toujours autorisé (ex. droit commercial/fiscal allemand). Avantage : évaluation prudente (prix bas)."
      }
    ],
    "summaryBlocks": [
      {
        "kind": "heading",
        "text": "6. Principes de stockage",
        "sub": false
      },
      {
        "kind": "heading",
        "text": "6.1 Lotissement par case (emplacement fixe)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/406/commun/log-406-emplacement-fixe-photo-v010.webp",
        "alt": "Le bac revient à la place où la même référence est indiquée sur le rayonnage.",
        "caption": "La référence du bac et celle de son emplacement sont identiques. La place reste réservée quand le bac est vide."
      },
      {
        "kind": "paragraph",
        "text": "Un {g}emplacement fixe{/g} est attribué à une référence. Il aide à retrouver l’article, mais peut rester vide s’il n’y a plus de stock. Gardez une identification lisible et évitez la confusion entre des produits voisins."
      },
      {
        "kind": "heading",
        "text": "6.2 Stockage chaotique (anarchique)",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/406/commun/log-406-affectation-dynamique-photo-v010.webp",
        "alt": "Une opératrice relève l’adresse d’une position libre avant de ranger le lot.",
        "caption": "L’opératrice relève l’adresse d’une place libre pour enregistrer la nouvelle position du lot."
      },
      {
        "kind": "paragraph",
        "text": "Le {g}stockage chaotique{/g} attribue un emplacement libre compatible. Le système enregistre la relation entre l’article, la quantité et l’emplacement. Tout {g}transfert{/g} doit être confirmé pour garder la trace du lot."
      },
      {
        "kind": "heading",
        "text": "6.3 FIFO — First In, First Out",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/406/commun/log-406-fifo-photo-v002.webp",
        "alt": "Des cartons occupent des pistes inclinées à rouleaux, ouvertes aux deux extrémités.",
        "caption": "Si l’entrée se fait à l’arrière et la sortie à l’avant, le premier colis entré arrive au point de prélèvement."
      },
      {
        "kind": "paragraph",
        "text": "La première unité entrée sort d’abord. Dans un rayonnage dynamique, l’entrée à l’arrière et la prise à l’avant peuvent faciliter le {g}FIFO{/g}. Si la règle utilise la date d’expiration, on parle de {g}FEFO{/g} : première échéance, première sortie. Vérifiez la règle de l’article."
      },
      {
        "kind": "heading",
        "text": "6.4 et 6.5 LIFO et HIFO",
        "sub": true
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/403/commun/log-403-drivein-photo-v003.webp",
        "alt": "Des palettes sont rangées les unes derrière les autres dans une travée à rails.",
        "caption": "Une travée profonde à accès unique peut imposer de reprendre la dernière palette entrée avant celles qui se trouvent derrière."
      },
      {
        "kind": "paragraph",
        "text": "Le {g}LIFO{/g} fait sortir la dernière unité entrée en premier, par exemple une pile accessible du dessus. Le {g}HIFO{/g} classe les unités selon la valeur ou le prix le plus élevé dans le cadre défini. Ne confondez pas un ordre physique et une méthode comptable. Suivez la consigne de lot et de traçabilité du site."
      },
      {
        "kind": "image",
        "src": "/assets/logistique/400/406/commun/log-406-hifo-photo-v010.webp",
        "alt": "Au bureau, la fiche de la pièce à 48 CHF passe avant celle de la pièce à 32 CHF dans le dossier de sortie.",
        "caption": "Dans cet exemple, la sortie est valorisée d’abord au coût de 48 CHF."
      },
      {
        "kind": "paragraph",
        "text": "Dans cette convention de valorisation, l’unité achetée 48 CHF entre dans le calcul du coût de sortie avant celle achetée 32 CHF. Le préparateur suit la règle physique et la consigne de lot applicables, par exemple FIFO ou FEFO."
      }
    ],
    "module": "406",
    "revision": "406-v004",
    "approvedFor": [
      "CFC",
      "AFP"
    ]
  }
] satisfies readonly LogistiqueUnit[]
