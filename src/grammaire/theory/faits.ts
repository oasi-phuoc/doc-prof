import type { GrammaireTheoryDoc } from '../types'

/** Théorie réécrite en français facile ; gabarit visuel et identifiants conservés. */
export const faitsDocs: GrammaireTheoryDoc[] = [
  {
    "id": "j6",
    "typeId": "gram-j6-theorie",
    "index": 1,
    "title": "La forme passive",
    "topic": "gram-faits",
    "public": "B1",
    "objectif": "Mettre l’objet au début de la phrase.",
    "blocks": [
      {
        "kind": "heading",
        "text": "La forme passive"
      },
      {
        "kind": "paragraph",
        "text": "Je commence ma phrase par l’élément qui reçoit l’action."
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
              "Le jardinier arrose les fleurs.",
              "Les fleurs {c}sont arrosées{/c} par le jardinier.",
              "La route {c}sera fermée{/c} demain."
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
            "text": "Dans une phrase active, le sujet fait l’action."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Dans une phrase passive, le sujet reçoit l’action."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Le complément direct de la phrase active peut devenir le sujet de la phrase passive."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je conjugue être au temps nécessaire."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "J’ajoute un participe passé accordé avec le nouveau sujet."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je peux nommer l’auteur de l’action avec par."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je peux aussi ne pas nommer cet auteur si je ne le connais pas."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Seuls certains verbes avec un complément direct permettent cette transformation."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Le temps de l’information doit rester le même."
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
            "text": "Dans une phrase active, le sujet fait l’action."
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
              "Temps de être",
              "Exemple"
            ],
            "rows": [
              [
                "présent",
                "La porte est fermée."
              ],
              [
                "passé composé",
                "La porte a été fermée."
              ],
              [
                "imparfait",
                "La porte était fermée."
              ],
              [
                "futur",
                "La porte sera fermée."
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "attention",
            "text": "Je cherche d’abord qui fait l’action et quel élément la reçoit."
          }
        ]
      }
    ]
  },
  {
    "id": "j7",
    "typeId": "gram-j7-theorie",
    "index": 2,
    "title": "Discours direct et indirect",
    "topic": "gram-faits",
    "public": "B1",
    "objectif": "Rapporter des paroles avec ou sans guillemets.",
    "blocks": [
      {
        "kind": "heading",
        "text": "Discours direct et indirect"
      },
      {
        "kind": "paragraph",
        "text": "Je rapporte ce qu’une personne a dit ou demandé."
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
              "Il dit {c}qu’il est{/c} malade.",
              "Elle demande {c}si{/c} tu viens.",
              "Il demande {c}où tu habites{/c}."
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
            "text": "Au discours direct, je peux citer les paroles entre guillemets."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Au discours indirect, j’introduis les paroles avec un verbe comme dire ou demander."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Une affirmation est souvent introduite par que."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Une question oui/non est introduite par si."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Une question avec où, quand ou pourquoi garde ce mot interrogatif."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Qu’est-ce que devient ce que dans une question indirecte."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je remets le sujet avant le verbe ; je ne garde pas l’inversion de la question directe."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je change les pronoms pour garder les bonnes personnes."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Si le verbe introducteur est au passé, des temps peuvent changer : présent vers imparfait, futur vers conditionnel."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je vérifie aussi les repères comme demain, qui peut devenir le lendemain selon le récit."
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
            "text": "Au discours direct, je peux citer les paroles entre guillemets."
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
              "Type",
              "Mot",
              "Exemple"
            ],
            "rows": [
              [
                "information",
                "que",
                "Il dit qu’il vient."
              ],
              [
                "oui / non",
                "si",
                "Elle demande si tu viens."
              ],
              [
                "où / quand…",
                "le même mot",
                "Il demande où tu vas."
              ],
              [
                "ordre",
                "de + infinitif",
                "Il dit de partir."
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "attention",
            "text": "Il demande où tu habites ne garde pas l’inversion de Où habites-tu ?"
          }
        ]
      }
    ]
  },
  {
    "id": "j8",
    "typeId": "gram-j8-theorie",
    "index": 3,
    "title": "Le conditionnel (emploi)",
    "topic": "gram-faits",
    "public": "A2 / B1",
    "objectif": "Exprimer un souhait, un conseil ou une hypothèse.",
    "blocks": [
      {
        "kind": "heading",
        "text": "Le conditionnel (emploi)"
      },
      {
        "kind": "paragraph",
        "text": "Je formule un souhait, une demande polie ou une hypothèse."
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
              "Je {c}voudrais{/c} un renseignement.",
              "Vous {c}pourriez{/c} venir.",
              "Si j’avais le temps, je {c}lirais{/c}."
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
            "text": "Le conditionnel présent utilise la base du futur et les terminaisons de l’imparfait."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Les terminaisons sont -ais, -ais, -ait, -ions, -iez, -aient."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Être donne je serais ; avoir donne j’aurais."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je voudrais permet une demande plus polie que je veux."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Tu devrais permet de donner un conseil."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Avec une condition imaginée, je peux utiliser si plus imparfait et conditionnel."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Le conditionnel peut aussi présenter une information non confirmée."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je choisis la forme selon le sujet."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "À la négation, ne et pas entourent le verbe."
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
            "text": "Le conditionnel présent utilise la base du futur et les terminaisons de l’imparfait."
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
              "Emploi",
              "Exemple"
            ],
            "rows": [
              [
                "souhait poli",
                "Je voudrais un rendez-vous."
              ],
              [
                "conseil",
                "Tu devrais dormir."
              ],
              [
                "hypothèse",
                "Il serait content."
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "attention",
            "text": "Je distingue le futur je serai et le conditionnel je serais, même si leur prononciation peut se ressembler."
          }
        ]
      }
    ]
  },
  {
    "id": "j9",
    "typeId": "gram-j9-theorie",
    "index": 4,
    "title": "L’hypothèse avec si",
    "topic": "gram-faits",
    "public": "A2 / B1",
    "objectif": "Parler d’une situation imaginée avec si.",
    "blocks": [
      {
        "kind": "heading",
        "text": "L’hypothèse avec si"
      },
      {
        "kind": "paragraph",
        "text": "Je distingue une condition possible et une situation imaginée."
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
              "Si tu viens, je {c}cuisinerai{/c}.",
              "Si j’avais un vélo, je {c}viendrais{/c}.",
              "Si j’avais su, je {c}serais venu{/c}."
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
            "text": "Si plus présent présente une condition possible."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "La conséquence peut être au futur, au présent ou à l’impératif."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Si plus imparfait permet d’imaginer une situation différente."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Sa conséquence est souvent au conditionnel présent."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Si plus plus-que-parfait imagine une condition passée qui ne s’est pas réalisée."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Sa conséquence peut être au conditionnel passé."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Dans ces modèles, je ne mets pas le conditionnel juste après si."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je peux commencer par la condition ou par la conséquence."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je vérifie si je parle du possible, de l’imaginé ou du passé."
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
            "text": "Si plus présent présente une condition possible."
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
              "Si",
              "Résultat",
              "Exemple"
            ],
            "rows": [
              [
                "présent",
                "futur",
                "S’il pleut, je resterai."
              ],
              [
                "imparfait",
                "conditionnel",
                "Si j’avais le temps, je viendrais."
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "attention",
            "text": "Je dis si j’avais, et non si j’aurais, dans la condition imaginée."
          }
        ]
      }
    ]
  },
  {
    "id": "j10",
    "typeId": "gram-j10-theorie",
    "index": 5,
    "title": "Le conditionnel passé",
    "topic": "gram-faits",
    "public": "B1",
    "objectif": "Parler d’une action qui n’a pas eu lieu.",
    "blocks": [
      {
        "kind": "heading",
        "text": "Le conditionnel passé"
      },
      {
        "kind": "paragraph",
        "text": "Je parle d’une action envisagée dans le passé mais non réalisée, ou d’un regret."
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
              "J’{c}aurais aimé{/c} venir.",
              "Elle {c}serait partie{/c} plus tôt.",
              "Si j’avais étudié, j’{c}aurais réussi{/c}."
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
            "text": "Le conditionnel passé contient avoir ou être au conditionnel présent."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "J’ajoute un participe passé."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je choisis l’auxiliaire comme au passé composé."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Avec être, je fais les accords nécessaires."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "J’aurais aimé exprime souvent un souhait passé."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "J’aurais dû peut exprimer un regret ou un reproche."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Avec si plus plus-que-parfait, je présente une condition passée non réalisée."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "La conséquence peut être au conditionnel passé."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Le conditionnel passé peut aussi rapporter une information non confirmée."
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
            "text": "Le conditionnel passé contient avoir ou être au conditionnel présent."
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
              "Personne",
              "avoir",
              "être"
            ],
            "rows": [
              [
                "j’",
                "aurais fini",
                "serais parti(e)"
              ],
              [
                "tu",
                "aurais fini",
                "serais parti(e)"
              ],
              [
                "il / elle",
                "aurait fini",
                "serait parti(e)"
              ],
              [
                "nous",
                "aurions fini",
                "serions parti(e)s"
              ],
              [
                "vous",
                "auriez fini",
                "seriez parti(e)(s)"
              ],
              [
                "ils / elles",
                "auraient fini",
                "seraient parti(e)s"
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "attention",
            "text": "Je ne remplace pas l’auxiliaire : j’aurais pris, elle serait venue."
          }
        ]
      }
    ]
  }
]
