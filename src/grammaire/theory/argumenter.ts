import type { GrammaireTheoryDoc } from '../types'

/** Théorie réécrite en français facile ; gabarit visuel et identifiants conservés. */
export const argumenterDocs: GrammaireTheoryDoc[] = [
  {
    "id": "k1",
    "typeId": "gram-k1-theorie",
    "index": 1,
    "title": "Approuver et désapprouver",
    "topic": "gram-argumenter",
    "public": "A2",
    "objectif": "Dire son avis clairement.",
    "blocks": [
      {
        "kind": "heading",
        "text": "Approuver et désapprouver"
      },
      {
        "kind": "paragraph",
        "text": "Je donne mon accord ou mon désaccord de manière respectueuse."
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
              "Je suis {c}d’accord{/c} avec cette proposition.",
              "{c}À mon avis{/c}, le bus est plus pratique.",
              "Je comprends, {c}mais{/c} je préfère attendre."
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
            "text": "Je suis d’accord exprime un accord."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je ne suis pas d’accord exprime un désaccord."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je peux limiter l’accord : je suis d’accord sur ce point."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "À mon avis et je pense que annoncent mon opinion."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Parce que permet de donner une raison."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je peux reconnaître une partie de l’idée avant d’ajouter une réserve."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je garde un ton adapté à la personne."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je distingue une opinion et un fait vérifiable."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je critique une idée sans attaquer la personne."
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
            "text": "Je suis d’accord exprime un accord."
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
              "Sens",
              "Formule"
            ],
            "rows": [
              [
                "avis",
                "Je pense que…"
              ],
              [
                "avis",
                "À mon avis…"
              ],
              [
                "pour",
                "Je suis d’accord."
              ],
              [
                "pour",
                "Je suis pour."
              ],
              [
                "contre",
                "Je ne suis pas d’accord."
              ],
              [
                "contre",
                "Je suis contre."
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "attention",
            "text": "Je peux dire je ne suis pas tout à fait d’accord pour exprimer une réserve avec politesse."
          }
        ]
      }
    ]
  },
  {
    "id": "k2",
    "typeId": "gram-k2-theorie",
    "index": 2,
    "title": "Les connecteurs",
    "topic": "gram-argumenter",
    "public": "A2 / B1",
    "objectif": "Organiser ses idées avec un mot de liaison.",
    "blocks": [
      {
        "kind": "heading",
        "text": "Les connecteurs"
      },
      {
        "kind": "paragraph",
        "text": "Je relie mes idées pour être facile à suivre."
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
              "Je reste {c}parce que{/c} je suis malade.",
              "Il pleut, {c}donc{/c} je prends un parapluie.",
              "J’aime ce quartier, {c}mais{/c} il est bruyant."
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
            "text": "Un connecteur montre le lien entre deux idées."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Et ajoute une information ; ou propose un choix."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Mais montre une opposition."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Parce que donne une raison."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Donc annonce souvent une conséquence."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "D’abord, ensuite et enfin organisent les étapes."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Par exemple introduit un cas précis."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "En revanche oppose deux aspects."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je choisis le connecteur selon le sens et j’évite d’en ajouter sans besoin."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Un même mot peut avoir plusieurs emplois ; je regarde toute la phrase."
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
            "text": "Un connecteur montre le lien entre deux idées."
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
              "Rôle",
              "Connecteur",
              "Exemple"
            ],
            "rows": [
              [
                "exemple",
                "par exemple",
                "Par exemple, le lundi."
              ],
              [
                "conséquence",
                "donc",
                "Donc, je reste."
              ],
              [
                "opposition",
                "par contre",
                "Par contre, c’est loin."
              ],
              [
                "condition",
                "si",
                "Si tu veux, viens."
              ],
              [
                "ordre",
                "ensuite",
                "Ensuite, je pars."
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "attention",
            "text": "Parce que explique la cause ; donc présente le résultat : je ne les échange pas au hasard."
          }
        ]
      }
    ]
  }
]
