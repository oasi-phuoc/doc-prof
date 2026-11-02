import type { GrammaireTheoryDoc } from '../types'

/** Théorie réécrite en français facile ; gabarit visuel et identifiants conservés. */
export const alimentsDocs: GrammaireTheoryDoc[] = [
  {
    "id": "g1",
    "typeId": "gram-g1-theorie",
    "index": 1,
    "title": "Les articles indéfinis",
    "topic": "gram-aliments",
    "public": "A1",
    "objectif": "Présenter une chose non précise avec un, une ou des.",
    "blocks": [
      {
        "kind": "heading",
        "text": "Les articles indéfinis"
      },
      {
        "kind": "paragraph",
        "text": "Je présente une personne ou une chose qui n’est pas encore identifiée."
      },
      {
        "kind": "paragraph",
        "text": "{ligne/2}"
      },
      {
        "kind": "section",
        "role": "regarder",
        "blocks": [
          {
            "kind": "examples",
            "marker": "puces",
            "items": [
              "Voici {c}un{/c} sac.",
              "Je cherche {c}une{/c} adresse.",
              "Nous avons {c}des{/c} questions."
            ]
          }
        ]
      },
      {
        "kind": "section",
        "role": "expliquer",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "Un article accompagne le nom."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Un accompagne un nom masculin singulier."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Une accompagne un nom féminin singulier."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Des accompagne un nom pluriel."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je choisis le genre du nom, pas celui de la personne qui parle."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Un ou une peut désigner un exemplaire parmi plusieurs."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Après une négation avec avoir, un, une et des deviennent généralement de."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Avec être, je garde l’article : ce n’est pas une erreur."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Devant un adjectif pluriel placé avant le nom, des devient souvent de : de beaux livres."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          }
        ]
      },
      {
        "kind": "page"
      },
      {
        "kind": "section",
        "role": "retenir",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "Un article accompagne le nom."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "table",
            "colHeader": true,
            "rowHeader": false,
            "headers": [
              "Cas",
              "Article",
              "Exemple"
            ],
            "rows": [
              [
                "masculin",
                "un",
                "un café"
              ],
              [
                "féminin",
                "une",
                "une pomme"
              ],
              [
                "pluriel",
                "des",
                "des œufs"
              ],
              [
                "négation",
                "de / d’",
                "pas de pain"
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "attention",
            "text": "Un nom commençant par une voyelle ne perd pas son article indéfini : un ami, une amie."
          }
        ]
      }
    ]
  },
  {
    "id": "g2",
    "typeId": "gram-g2-theorie",
    "index": 2,
    "title": "Les articles définis",
    "topic": "gram-aliments",
    "public": "A1",
    "objectif": "Parler d’une chose connue ou en général.",
    "blocks": [
      {
        "kind": "heading",
        "text": "Les articles définis"
      },
      {
        "kind": "paragraph",
        "text": "Je parle d’un élément connu ou d’une catégorie en général."
      },
      {
        "kind": "paragraph",
        "text": "{ligne/2}"
      },
      {
        "kind": "section",
        "role": "regarder",
        "blocks": [
          {
            "kind": "examples",
            "marker": "puces",
            "items": [
              "Fermez {c}la{/c} porte.",
              "J’aime {c}les{/c} fruits.",
              "{c}L’{/c}eau est froide."
            ]
          }
        ]
      },
      {
        "kind": "section",
        "role": "expliquer",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "Le, la, l’ et les sont des articles définis."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Le accompagne un masculin singulier ; la accompagne un féminin singulier."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Devant une voyelle ou un h muet, le et la deviennent l’."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Les accompagne tous les noms pluriels."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "J’utilise un article défini pour un élément déjà identifié."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je l’utilise aussi pour un goût ou une idée générale : j’aime le chocolat."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "L’article défini reste après la négation : je n’aime pas le café."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "À ou de peut se contracter avec le ou les."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je garde le genre du nom même quand l’article est l’."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          }
        ]
      },
      {
        "kind": "page"
      },
      {
        "kind": "section",
        "role": "retenir",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "Le, la, l’ et les sont des articles définis."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "table",
            "colHeader": true,
            "rowHeader": false,
            "headers": [
              "Cas",
              "Article",
              "Exemple"
            ],
            "rows": [
              [
                "masculin",
                "le",
                "le riz"
              ],
              [
                "féminin",
                "la",
                "la salade"
              ],
              [
                "voyelle / h",
                "l’",
                "l’huile"
              ],
              [
                "pluriel",
                "les",
                "les pâtes"
              ],
              [
                "en général",
                "le / la",
                "J’aime le café."
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "attention",
            "text": "Je distingue j’aime le pain, qui exprime un goût, et je mange du pain, qui exprime une quantité."
          }
        ]
      }
    ]
  },
  {
    "id": "g3",
    "typeId": "gram-g3-theorie",
    "index": 3,
    "title": "Les articles partitifs",
    "topic": "gram-aliments",
    "public": "A1",
    "objectif": "Parler d’une partie d’un aliment.",
    "blocks": [
      {
        "kind": "heading",
        "text": "Les articles partitifs"
      },
      {
        "kind": "paragraph",
        "text": "Je parle d’une quantité que je ne compte pas précisément."
      },
      {
        "kind": "paragraph",
        "text": "{ligne/2}"
      },
      {
        "kind": "section",
        "role": "regarder",
        "blocks": [
          {
            "kind": "examples",
            "marker": "puces",
            "items": [
              "Je bois {c}du{/c} lait.",
              "Elle prend {c}de la{/c} soupe.",
              "Il n’y a pas {c}d’{/c}huile."
            ]
          }
        ]
      },
      {
        "kind": "section",
        "role": "expliquer",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "Le partitif sert notamment avec un aliment ou une matière."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Devant un nom masculin singulier, j’utilise du."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Devant un nom féminin singulier, j’utilise de la."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Devant une voyelle ou un h muet, j’utilise de l’."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Le pluriel des sert avec certains aliments : des pâtes."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Après une négation, le partitif devient généralement de ou d’."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Après une quantité précise, je dis de : un verre de lait."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Avec aimer ou préférer pour parler d’un goût général, je choisis plutôt l’article défini."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je distingue une portion comptée et une quantité non précisée."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          }
        ]
      },
      {
        "kind": "page"
      },
      {
        "kind": "section",
        "role": "retenir",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "Le partitif sert notamment avec un aliment ou une matière."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "table",
            "colHeader": true,
            "rowHeader": false,
            "headers": [
              "Cas",
              "Forme",
              "Exemple"
            ],
            "rows": [
              [
                "masculin",
                "du",
                "du pain"
              ],
              [
                "féminin",
                "de la",
                "de la soupe"
              ],
              [
                "voyelle",
                "de l’",
                "de l’eau"
              ],
              [
                "négation",
                "de / d’",
                "pas de fromage"
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "attention",
            "text": "Je dis une tasse de café, sans du après tasse de."
          }
        ]
      }
    ]
  },
  {
    "id": "g4",
    "typeId": "gram-g4-theorie",
    "index": 4,
    "title": "Les quantités",
    "topic": "gram-aliments",
    "public": "A1",
    "objectif": "Dire une quantité avec un nombre ou une expression + de.",
    "blocks": [
      {
        "kind": "heading",
        "text": "Les quantités"
      },
      {
        "kind": "paragraph",
        "text": "Je donne une quantité précise ou approximative."
      },
      {
        "kind": "paragraph",
        "text": "{ligne/2}"
      },
      {
        "kind": "section",
        "role": "regarder",
        "blocks": [
          {
            "kind": "examples",
            "marker": "puces",
            "items": [
              "Il faut un kilo {c}de{/c} pommes.",
              "Je prends deux bouteilles {c}d’{/c}eau.",
              "Il y a {c}trop de{/c} sel."
            ]
          }
        ]
      },
      {
        "kind": "section",
        "role": "expliquer",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "Je peux compter avec un nombre : deux pommes."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Après une mesure, j’utilise de ou d’ : un kilo de pommes."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Un litre mesure un volume ; un kilo mesure une masse."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Un paquet, une bouteille et une boîte désignent des contenants."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Beaucoup de, un peu de et assez de donnent une quantité non exacte."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Trop de signifie que la quantité dépasse ce qui convient."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Après une quantité, je ne remets généralement pas le, la ou les."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Combien de permet de demander une quantité."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Le nom prend le pluriel si plusieurs éléments sont comptés."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          }
        ]
      },
      {
        "kind": "page"
      },
      {
        "kind": "section",
        "role": "retenir",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "Je peux compter avec un nombre : deux pommes."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "table",
            "colHeader": true,
            "rowHeader": false,
            "headers": [
              "Expression",
              "Exemple"
            ],
            "rows": [
              [
                "un kilo de",
                "un kilo de pommes"
              ],
              [
                "beaucoup de",
                "beaucoup de lait"
              ],
              [
                "un peu de",
                "un peu de beurre"
              ],
              [
                "assez de",
                "assez de pain"
              ],
              [
                "trop de",
                "trop de sel"
              ],
              [
                "d’ + voyelle",
                "beaucoup d’eau"
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "attention",
            "text": "Je dis beaucoup de personnes, et non beaucoup des personnes quand je parle en général."
          }
        ]
      }
    ]
  },
  {
    "id": "g5",
    "typeId": "gram-g5-theorie",
    "index": 5,
    "title": "Les déterminants indéfinis",
    "topic": "gram-aliments",
    "public": "A2",
    "objectif": "Parler d’une quantité vague.",
    "blocks": [
      {
        "kind": "heading",
        "text": "Les déterminants indéfinis"
      },
      {
        "kind": "paragraph",
        "text": "Je parle d’une quantité ou d’un ensemble sans donner un nombre précis."
      },
      {
        "kind": "paragraph",
        "text": "{ligne/2}"
      },
      {
        "kind": "section",
        "role": "regarder",
        "blocks": [
          {
            "kind": "examples",
            "marker": "puces",
            "items": [
              "{c}Chaque{/c} client attend.",
              "Il reste {c}quelques{/c} pommes.",
              "Nous n’avons {c}aucune{/c} réservation."
            ]
          }
        ]
      },
      {
        "kind": "section",
        "role": "expliquer",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "Quelques et plusieurs accompagnent un nom pluriel."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Chaque accompagne un nom singulier."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Tout varie : tout le pain, toute la soupe, tous les repas, toutes les bouteilles."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Certains et certaines indiquent une partie d’un groupe."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Aucun et aucune accompagnent généralement un nom singulier avec ne."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Même s’accorde : le même menu, les mêmes menus."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Autre s’accorde aussi : une autre tasse, d’autres tasses."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je regarde si le nom est singulier ou pluriel."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je distingue chaque personne et toutes les personnes : le sens est proche, la construction change."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          }
        ]
      },
      {
        "kind": "page"
      },
      {
        "kind": "section",
        "role": "retenir",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "Quelques et plusieurs accompagnent un nom pluriel."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "table",
            "colHeader": true,
            "rowHeader": false,
            "headers": [
              "Mot",
              "Accord",
              "Exemple"
            ],
            "rows": [
              [
                "chaque",
                "singulier",
                "chaque matin"
              ],
              [
                "plusieurs",
                "pluriel",
                "plusieurs bus"
              ],
              [
                "quelques",
                "pluriel",
                "quelques euros"
              ],
              [
                "tout / toute",
                "singulier",
                "toute la journée"
              ],
              [
                "tous / toutes",
                "pluriel",
                "tous les jours"
              ],
              [
                "aucun / aucune",
                "avec ne",
                "aucun problème"
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "attention",
            "text": "Je ne mets pas de s à chaque ; le nom qui suit reste au singulier."
          }
        ]
      }
    ]
  },
  {
    "id": "g6",
    "typeId": "gram-g6-theorie",
    "index": 6,
    "title": "Les articles contractés (quantité et lieu)",
    "topic": "gram-aliments",
    "public": "A1 / A2",
    "objectif": "Former au, aux, du et des, et les distinguer du partitif.",
    "blocks": [
      {
        "kind": "heading",
        "text": "Les articles contractés (quantité et lieu)"
      },
      {
        "kind": "paragraph",
        "text": "Je distingue une contraction et un article qui indique une quantité."
      },
      {
        "kind": "paragraph",
        "text": "{ligne/2}"
      },
      {
        "kind": "section",
        "role": "regarder",
        "blocks": [
          {
            "kind": "examples",
            "marker": "puces",
            "items": [
              "Je vais {c}au{/c} magasin.",
              "Je reviens {c}du{/c} magasin.",
              "Je mange {c}du{/c} fromage."
            ]
          }
        ]
      },
      {
        "kind": "section",
        "role": "expliquer",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "À + le donne au ; à + les donne aux."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "De + le donne du ; de + les donne des."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Avec la et l’, je ne réunis pas les mots."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je choisis à ou de selon le verbe ou le sens."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Aller au marché donne une destination."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Venir du marché donne une provenance."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Dans manger du pain, du est un article partitif : il indique une quantité non précisée."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Dans parler des voisins, des peut être de + les."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je regarde la phrase entière pour comprendre le rôle de du ou des."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          }
        ]
      },
      {
        "kind": "page"
      },
      {
        "kind": "section",
        "role": "retenir",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "À + le donne au ; à + les donne aux."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "table",
            "colHeader": true,
            "rowHeader": false,
            "headers": [
              "Départ",
              "Forme",
              "Exemple"
            ],
            "rows": [
              [
                "à + le",
                "au",
                "au supermarché"
              ],
              [
                "à + les",
                "aux",
                "aux fruits"
              ],
              [
                "de + le",
                "du",
                "du menu"
              ],
              [
                "de + les",
                "des",
                "des courses"
              ],
              [
                "quantité",
                "de",
                "beaucoup de lait"
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "attention",
            "text": "La même forme écrite peut avoir deux rôles ; je ne décide pas seulement en regardant le mot du."
          }
        ]
      }
    ]
  }
]
