import type { GrammaireTheoryDoc } from '../types'

/** Théorie réécrite en français facile ; gabarit visuel et identifiants conservés. */
export const pronomsDocs: GrammaireTheoryDoc[] = [
  {
    "id": "i1",
    "typeId": "gram-i1-theorie",
    "index": 1,
    "title": "Les pronoms relatifs",
    "topic": "gram-pronoms",
    "public": "A2",
    "objectif": "Relier deux informations avec qui, que, où ou dont.",
    "blocks": [
      {
        "kind": "heading",
        "text": "Les pronoms relatifs"
      },
      {
        "kind": "paragraph",
        "text": "Je relie deux informations sans répéter le même nom."
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
              "La femme {c}qui{/c} parle est médecin.",
              "Le livre {c}que{/c} je lis est court.",
              "Voici la ville {c}où{/c} je travaille."
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
            "text": "Le pronom relatif reprend un nom appelé antécédent."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Qui est le sujet du verbe qui suit."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Que est le complément direct du verbe qui suit."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Devant une voyelle, que devient qu’."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Où peut reprendre un lieu ou un moment."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Dont reprend un complément construit avec de."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Le pronom dépend de son rôle dans la deuxième partie, pas du genre du nom."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Le verbe après qui s’accorde avec le nom repris."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je garde une phrase qui donne une information claire sur ce nom."
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
            "text": "Le pronom relatif reprend un nom appelé antécédent."
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
              "Pronom",
              "Exemple"
            ],
            "rows": [
              [
                "qui",
                "la femme qui parle"
              ],
              [
                "que",
                "le livre que je lis"
              ],
              [
                "qu’",
                "l’homme qu’elle connaît"
              ],
              [
                "où",
                "la ville où j’habite"
              ],
              [
                "dont",
                "l’ami dont je parle"
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "attention",
            "text": "Qui n’est pas réservé aux personnes : le bus qui arrive utilise aussi qui."
          }
        ]
      }
    ]
  },
  {
    "id": "i2",
    "typeId": "gram-i2-theorie",
    "index": 2,
    "title": "Les pronoms possessifs",
    "topic": "gram-pronoms",
    "public": "A2",
    "objectif": "Remplacer un nom déjà connu avec le mien, le tien…",
    "blocks": [
      {
        "kind": "heading",
        "text": "Les pronoms possessifs"
      },
      {
        "kind": "paragraph",
        "text": "Je remplace un nom pour parler de ce qui appartient à quelqu’un."
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
              "Ton sac est ici ; {c}le mien{/c} est là.",
              "Cette clé est {c}la sienne{/c}.",
              "Je pense {c}aux vôtres{/c}."
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
            "text": "Un pronom possessif remplace un nom déjà connu."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je le choisis d’après le propriétaire et le nom remplacé."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Avec moi : le mien, la mienne, les miens, les miennes."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Avec toi : le tien, la tienne, les tiens, les tiennes."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Avec lui ou elle : le sien, la sienne, les siens, les siennes."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Avec nous : le nôtre, la nôtre, les nôtres."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Avec vous : le vôtre, la vôtre, les vôtres."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Avec eux ou elles : le leur, la leur, les leurs."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "L’article fait partie du pronom et peut se contracter après à ou de."
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
            "text": "Un pronom possessif remplace un nom déjà connu."
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
              "Déterminant",
              "Pronom"
            ],
            "rows": [
              [
                "mon sac",
                "le mien"
              ],
              [
                "ma clé",
                "la mienne"
              ],
              [
                "tes livres",
                "les tiens"
              ],
              [
                "notre maison",
                "la nôtre"
              ],
              [
                "vos idées",
                "les vôtres"
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "attention",
            "text": "Je distingue notre sac, sans accent, et le nôtre, avec un accent circonflexe."
          }
        ]
      }
    ]
  },
  {
    "id": "i3",
    "typeId": "gram-i3-theorie",
    "index": 3,
    "title": "Les pronoms démonstratifs",
    "topic": "gram-pronoms",
    "public": "A2",
    "objectif": "Désigner une chose sans répéter le nom.",
    "blocks": [
      {
        "kind": "heading",
        "text": "Les pronoms démonstratifs"
      },
      {
        "kind": "paragraph",
        "text": "Je montre un élément sans répéter son nom."
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
              "Je prends {c}celui-ci{/c}.",
              "La veste de Paul et {c}celle de{/c} Lina.",
              "Voici {c}ceux qui{/c} ont répondu."
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
            "text": "Celui remplace un nom masculin singulier."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Celle remplace un nom féminin singulier."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Ceux et celles remplacent des noms pluriels."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je choisis la forme d’après le nom remplacé."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "J’ajoute souvent une précision : celui de Léa ou celle qui parle."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "-ci et -là peuvent préciser l’élément montré."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Ceci et cela reprennent une chose ou une idée sans préciser son genre."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Ça est une forme courante de cela."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je distingue ce devant un nom et celui qui remplace le nom."
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
            "text": "Celui remplace un nom masculin singulier."
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
              "Forme",
              "Exemple"
            ],
            "rows": [
              [
                "celui",
                "celui de Paul"
              ],
              [
                "celle-ci",
                "cette clé, pas celle-ci"
              ],
              [
                "ceux qui",
                "ceux qui arrivent"
              ],
              [
                "celles que",
                "celles que tu veux"
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "attention",
            "text": "Dans une phrase écrite complète, je précise généralement celui ou celle avec de, qui, que, -ci ou -là."
          }
        ]
      }
    ]
  },
  {
    "id": "i4",
    "typeId": "gram-i4-theorie",
    "index": 4,
    "title": "Les pronoms COD",
    "topic": "gram-pronoms",
    "public": "A2",
    "objectif": "Remplacer un complément direct.",
    "blocks": [
      {
        "kind": "heading",
        "text": "Les pronoms COD"
      },
      {
        "kind": "paragraph",
        "text": "Je remplace un complément direct pour ne pas répéter le nom."
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
              "Je regarde le bus ; je {c}le{/c} regarde.",
              "Tu vois les enfants ; tu {c}les{/c} vois.",
              "Je vais {c}l’{/c}appeler."
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
            "text": "Un complément direct se construit sans préposition."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je peux souvent le trouver avec la question qui ou quoi après le verbe."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Le remplace un masculin singulier ; la remplace un féminin singulier."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Les remplace un pluriel."
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
            "text": "Me, te, nous et vous peuvent aussi être compléments directs."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je place le pronom avant le verbe conjugué."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Avec un infinitif, je le place devant le verbe dont il dépend : je vais le lire."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Au passé composé : je l’ai lu ; un accord du participe peut être nécessaire."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "À l’impératif affirmatif : regarde-le."
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
            "text": "Un complément direct se construit sans préposition."
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
              "Remplace",
              "Pronom",
              "Exemple"
            ],
            "rows": [
              [
                "un homme / un objet m.",
                "le",
                "Je le vois."
              ],
              [
                "une femme / un objet f.",
                "la",
                "Je la prends."
              ],
              [
                "plusieurs",
                "les",
                "Je les aide."
              ],
              [
                "moi",
                "me",
                "Tu me vois."
              ],
              [
                "voyelle",
                "l’",
                "Je l’écoute."
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "attention",
            "text": "Je vérifie la construction : écouter quelqu’un est direct, téléphoner à quelqu’un est indirect."
          }
        ]
      }
    ]
  },
  {
    "id": "i5",
    "typeId": "gram-i5-theorie",
    "index": 5,
    "title": "Les pronoms COI",
    "topic": "gram-pronoms",
    "public": "A2",
    "objectif": "Remplacer à + personne.",
    "blocks": [
      {
        "kind": "heading",
        "text": "Les pronoms COI"
      },
      {
        "kind": "paragraph",
        "text": "Je remplace à plus une personne avec un pronom complément."
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
              "Je parle à Lina ; je {c}lui{/c} parle.",
              "Il téléphone aux voisins ; il {c}leur{/c} téléphone.",
              "Nous allons {c}lui{/c} répondre."
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
            "text": "Certains verbes se construisent avec à devant une personne."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Lui remplace à un homme ou à une femme."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Leur remplace à plusieurs personnes."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Me, te, nous et vous peuvent aussi être compléments indirects."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Le pronom se place avant le verbe conjugué."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Devant un infinitif, je le place avec le verbe dont il dépend."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Au passé composé, il se place avant l’auxiliaire."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Avec un complément indirect, je n’accorde pas le participe à cause de lui ou leur."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Tous les verbes avec à ne suivent pas ce modèle : je pense à elle."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "À l’impératif affirmatif : téléphone-lui."
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
            "text": "Certains verbes se construisent avec à devant une personne."
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
              "Phrase",
              "Avec pronom"
            ],
            "rows": [
              [
                "Je parle à Paul.",
                "Je lui parle."
              ],
              [
                "Je parle à Marie.",
                "Je lui parle."
              ],
              [
                "Je parle aux enfants.",
                "Je leur parle."
              ],
              [
                "Il écrit à nous.",
                "Il nous écrit."
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "attention",
            "text": "Leur pronom ne prend pas de s : je leur écris ; leurs lettres est un autre emploi."
          }
        ]
      }
    ]
  },
  {
    "id": "i6",
    "typeId": "gram-i6-theorie",
    "index": 6,
    "title": "Les pronoms indéfinis",
    "topic": "gram-pronoms",
    "public": "A2",
    "objectif": "Parler d’une personne ou d’une chose non précise.",
    "blocks": [
      {
        "kind": "heading",
        "text": "Les pronoms indéfinis"
      },
      {
        "kind": "paragraph",
        "text": "Je parle d’une personne ou d’une chose sans la nommer précisément."
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
              "{c}Quelqu’un{/c} attend.",
              "{c}Personne ne{/c} répond.",
              "Je cherche quelque chose {c}de simple{/c}."
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
            "text": "Quelqu’un désigne une personne non précisée."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Quelque chose désigne une chose non précisée."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Tout le monde désigne l’ensemble des personnes et prend un verbe au singulier."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Chacun parle des éléments d’un groupe un par un et prend aussi le singulier."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Personne et rien s’emploient avec ne dans une phrase négative."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Personne peut être le sujet : personne ne vient."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Plusieurs, certains, tous et d’autres peuvent remplacer un nom pluriel."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Après quelqu’un ou quelque chose, un adjectif est souvent introduit par de."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je distingue un déterminant devant le nom et un pronom qui remplace le nom."
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
            "text": "Quelqu’un désigne une personne non précisée."
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
              "Affirmatif",
              "Négatif"
            ],
            "rows": [
              [
                "quelqu’un",
                "ne … personne"
              ],
              [
                "quelque chose",
                "ne … rien"
              ],
              [
                "tout le monde",
                "personne ne…"
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "attention",
            "text": "Je dis tout le monde est prêt, avec un verbe au singulier."
          }
        ]
      }
    ]
  },
  {
    "id": "i7",
    "typeId": "gram-i7-theorie",
    "index": 7,
    "title": "En et y",
    "topic": "gram-pronoms",
    "public": "A2",
    "objectif": "Remplacer de + chose avec en, ou un lieu avec y.",
    "blocks": [
      {
        "kind": "heading",
        "text": "En et y"
      },
      {
        "kind": "paragraph",
        "text": "Je remplace un lieu ou un complément introduit par de."
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
              "Je vais à la gare ; j’{c}y{/c} vais.",
              "Tu veux du pain ? J’{c}en{/c} veux.",
              "J’ai trois billets ; j’{c}en{/c} ai trois."
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
            "text": "Y remplace souvent un lieu introduit par à, dans, chez ou sur."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Y peut aussi reprendre à plus une chose : je pense à ce projet, j’y pense."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "En remplace souvent de plus une chose."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "En reprend aussi un nom accompagné d’une quantité."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je garde la quantité après le verbe : j’en prends deux."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "En et y se placent avant le verbe dont ils dépendent."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "La négation entoure le groupe : je n’en veux pas."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "À l’impératif affirmatif : vas-y, prends-en."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Pour une personne, la construction du verbe peut demander lui, leur ou un pronom tonique."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je ne répète pas le complément déjà remplacé."
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
            "text": "Y remplace souvent un lieu introduit par à, dans, chez ou sur."
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
              "Remplace",
              "Pronom",
              "Exemple"
            ],
            "rows": [
              [
                "de + chose",
                "en",
                "J’en veux."
              ],
              [
                "un nombre",
                "en + nombre",
                "J’en ai deux."
              ],
              [
                "à + lieu",
                "y",
                "J’y vais."
              ],
              [
                "à + idée",
                "y",
                "J’y pense."
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "attention",
            "text": "Je garde trois dans j’en ai trois ; en ne remplace pas le nombre lui-même."
          }
        ]
      }
    ]
  },
  {
    "id": "i8",
    "typeId": "gram-i8-theorie",
    "index": 8,
    "title": "Le pronom relatif dont",
    "topic": "gram-pronoms",
    "public": "B1",
    "objectif": "Remplacer de + nom avec dont.",
    "blocks": [
      {
        "kind": "heading",
        "text": "Le pronom relatif dont"
      },
      {
        "kind": "paragraph",
        "text": "Je relie une information qui contient de à un nom déjà cité."
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
              "Voici le livre {c}dont{/c} je parle.",
              "C’est le document {c}dont{/c} j’ai besoin.",
              "La femme {c}dont{/c} le fils arrive."
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
            "text": "Dont reprend un complément construit avec de."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je repère d’abord la construction : parler de, avoir besoin de, être fier de."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Dont remplace de plus le nom repris."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je ne garde pas de une deuxième fois."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Le complément peut dépendre d’un verbe, d’un adjectif ou d’un nom."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je peux dire la personne dont je connais le frère."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je ne répète pas son, sa ou ses pour ce même lien."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Après une préposition composée comme près de, je préfère les formes avec lequel."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je garde le reste de la phrase dans un ordre clair."
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
            "text": "Dont reprend un complément construit avec de."
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
              "Construction",
              "Exemple"
            ],
            "rows": [
              [
                "parler de",
                "le sujet dont je parle"
              ],
              [
                "être fier de",
                "le travail dont il est fier"
              ],
              [
                "avoir besoin de",
                "l’aide dont j’ai besoin"
              ],
              [
                "possession",
                "l’amie dont le frère travaille"
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "attention",
            "text": "Je dis le dossier dont j’ai besoin, et non le dossier dont j’ai besoin de."
          }
        ]
      }
    ]
  },
  {
    "id": "i9",
    "typeId": "gram-i9-theorie",
    "index": 9,
    "title": "Les pronoms relatifs composés",
    "topic": "gram-pronoms",
    "public": "B1",
    "objectif": "Relier deux idées après une préposition.",
    "blocks": [
      {
        "kind": "heading",
        "text": "Les pronoms relatifs composés"
      },
      {
        "kind": "paragraph",
        "text": "Je relie deux informations après une préposition."
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
              "La chaise {c}sur laquelle{/c} je suis assis.",
              "Le projet {c}auquel{/c} je pense.",
              "Les arbres {c}près desquels{/c} nous attendons."
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
            "text": "Lequel varie avec le nom repris : lequel, laquelle, lesquels, lesquelles."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Après sur, dans, avec ou pour, je garde cette forme après la préposition."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Avec à, je forme auquel, à laquelle, auxquels et auxquelles."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Avec de, je forme duquel, de laquelle, desquels et desquelles."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Pour une personne, qui est souvent possible après une préposition."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je choisis le genre et le nombre d’après le nom remplacé."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Après près de ou à côté de, la contraction dépend de ce même nom."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Dont est souvent plus simple avec un complément directement introduit par de."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je ne change pas le sujet ou le sens de la deuxième information."
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
            "text": "Lequel varie avec le nom repris : lequel, laquelle, lesquels, lesquelles."
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
              "Préposition",
              "Masculin",
              "Féminin"
            ],
            "rows": [
              [
                "avec",
                "lequel",
                "laquelle"
              ],
              [
                "à",
                "auquel",
                "à laquelle"
              ],
              [
                "de",
                "duquel",
                "de laquelle"
              ],
              [
                "dans",
                "lequel",
                "laquelle"
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "attention",
            "text": "À laquelle reste en deux mots ; auquel et auxquels sont des contractions."
          }
        ]
      }
    ]
  }
]
