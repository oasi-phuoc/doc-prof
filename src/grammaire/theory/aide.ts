import type { GrammaireTheoryDoc } from '../types'

/** Théorie réécrite en français facile ; gabarit visuel et identifiants conservés. */
export const aideDocs: GrammaireTheoryDoc[] = [
  {
    "id": "l1",
    "typeId": "gram-l1-theorie",
    "index": 1,
    "title": "L’apostrophe",
    "topic": "gram-aide",
    "public": "A1",
    "objectif": "Remplacer une voyelle par une apostrophe.",
    "blocks": [
      {
        "kind": "heading",
        "text": "L’apostrophe"
      },
      {
        "kind": "paragraph",
        "text": "Je remplace certaines voyelles par une apostrophe."
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
              "{c}J’{/c}habite ici.",
              "La porte {c}s’{/c}ouvre.",
              "Je parle {c}du héros{/c}."
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
            "text": "Devant une voyelle ou un h muet, certains mots perdent leur voyelle finale."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je devient j’ ; me, te, se et ne deviennent m’, t’, s’ et n’."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Le et la deviennent l’."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "De devient d’ ; que devient qu’."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je n’ajoute pas d’espace après l’apostrophe."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Un et une ne s’élident pas."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Ce devient c’ dans c’est et c’était."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Le h aspiré bloque normalement l’élision : le héros, la honte."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Si devient s’ seulement devant il et ils dans ces emplois."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je vérifie le mot qui suit, pas seulement sa première lettre écrite."
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
            "text": "Devant une voyelle ou un h muet, certains mots perdent leur voyelle finale."
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
              "Forme",
              "Exemple"
            ],
            "rows": [
              [
                "je",
                "j’",
                "j’ai"
              ],
              [
                "le / la",
                "l’",
                "l’ami"
              ],
              [
                "me / te / se",
                "m’ / t’ / s’",
                "s’appelle"
              ],
              [
                "de",
                "d’",
                "d’accord"
              ],
              [
                "que",
                "qu’",
                "qu’elle"
              ],
              [
                "ne",
                "n’",
                "n’est pas"
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "attention",
            "text": "Je n’écris pas l’haricot : haricot commence par un h aspiré."
          }
        ]
      }
    ]
  },
  {
    "id": "l2",
    "typeId": "gram-l2-theorie",
    "index": 2,
    "title": "Le genre des noms",
    "topic": "gram-aide",
    "public": "A1 / A2",
    "objectif": "Former le féminin d’un nom.",
    "blocks": [
      {
        "kind": "heading",
        "text": "Le genre des noms"
      },
      {
        "kind": "paragraph",
        "text": "Je reconnais le genre d’un nom et je forme certains féminins."
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
              "Un ami, une {c}amie{/c}.",
              "Un vendeur, une {c}vendeuse{/c}.",
              "Un collègue, une {c}collègue{/c}."
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
            "text": "Un nom est masculin ou féminin."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je l’apprends avec un déterminant : un livre, une table."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Pour certaines personnes ou certains animaux, le féminin se forme avec e."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Parfois la consonne double : un chat, une chatte."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Certaines fins changent : vendeur, vendeuse ; acteur, actrice."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Certains noms ont la même forme : un collègue, une collègue."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "D’autres changent complètement : un homme, une femme."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Tous les objets n’ont pas une forme masculine et une forme féminine."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Le genre du nom n’indique pas forcément le sexe d’un être vivant."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Les déterminants et adjectifs dépendent du genre du nom."
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
            "text": "Un nom est masculin ou féminin."
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
              "Masculin",
              "Féminin"
            ],
            "rows": [
              [
                "ami",
                "amie"
              ],
              [
                "étudiant",
                "étudiante"
              ],
              [
                "vendeur",
                "vendeuse"
              ],
              [
                "acteur",
                "actrice"
              ],
              [
                "boulanger",
                "boulangère"
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "attention",
            "text": "Je n’invente pas un féminin pour un nom de chose : une chaise reste féminin."
          }
        ]
      }
    ]
  },
  {
    "id": "l3",
    "typeId": "gram-l3-theorie",
    "index": 3,
    "title": "Le nombre des noms",
    "topic": "gram-aide",
    "public": "A1",
    "objectif": "Mettre un nom au pluriel.",
    "blocks": [
      {
        "kind": "heading",
        "text": "Le nombre des noms"
      },
      {
        "kind": "paragraph",
        "text": "Je passe d’un élément à plusieurs éléments."
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
              "Un livre, des {c}livres{/c}.",
              "Un journal, des {c}journaux{/c}.",
              "Un bijou, des {c}bijoux{/c}."
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
            "text": "Un nom singulier désigne un élément ; un nom pluriel peut en désigner plusieurs."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Le pluriel se forme souvent avec s."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Les noms déjà terminés par s, x ou z ne changent généralement pas."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Beaucoup de noms en -au, -eau et -eu prennent x."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Pneu et bleu prennent normalement s."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Beaucoup de noms en -al deviennent -aux."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Bal, carnaval et festival gardent un pluriel en -s."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "La plupart des noms en -ou prennent s, mais bijou, caillou, chou, genou, hibou, joujou et pou prennent x."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je change aussi le déterminant et les accords utiles dans la phrase."
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
            "text": "Un nom singulier désigne un élément ; un nom pluriel peut en désigner plusieurs."
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
              "Singulier",
              "Pluriel"
            ],
            "rows": [
              [
                "un livre",
                "des livres"
              ],
              [
                "un gâteau",
                "des gâteaux"
              ],
              [
                "un journal",
                "des journaux"
              ],
              [
                "un nez",
                "des nez"
              ],
              [
                "un œil",
                "des yeux"
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "attention",
            "text": "Je distingue une terminaison habituelle et les exceptions apprises avec le nom."
          }
        ]
      }
    ]
  },
  {
    "id": "l4",
    "typeId": "gram-l4-theorie",
    "index": 4,
    "title": "Le genre des adjectifs",
    "topic": "gram-aide",
    "public": "A1 / A2",
    "objectif": "Accorder l’adjectif au féminin.",
    "blocks": [
      {
        "kind": "heading",
        "text": "Le genre des adjectifs"
      },
      {
        "kind": "paragraph",
        "text": "Je fais correspondre l’adjectif à un nom féminin."
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
              "Une voisine {c}gentille{/c}.",
              "Une élève {c}sportive{/c}.",
              "Une {c}belle{/c} journée."
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
            "text": "Un adjectif s’accorde avec le nom qu’il décrit."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Le féminin se forme souvent en ajoutant e."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Un adjectif déjà terminé par e garde souvent la même forme."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Les adjectifs en -eux donnent souvent -euse."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Les adjectifs en -if donnent souvent -ive."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Certains adjectifs doublent une consonne : bon, bonne ; ancien, ancienne."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Beau donne belle ; nouveau donne nouvelle ; vieux donne vieille."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Blanc donne blanche ; frais donne fraîche."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Certaines couleurs restent invariables, comme orange ou marron."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je ne décide pas l’accord d’après le sujet si l’adjectif décrit un autre nom."
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
            "text": "Un adjectif s’accorde avec le nom qu’il décrit."
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
              "Masculin",
              "Féminin"
            ],
            "rows": [
              [
                "petit",
                "petite"
              ],
              [
                "heureux",
                "heureuse"
              ],
              [
                "actif",
                "active"
              ],
              [
                "beau",
                "belle"
              ],
              [
                "nouveau",
                "nouvelle"
              ],
              [
                "vieux",
                "vieille"
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "attention",
            "text": "Le féminin est une forme écrite à apprendre ; je n’ajoute pas toujours seulement e."
          }
        ]
      }
    ]
  },
  {
    "id": "l5",
    "typeId": "gram-l5-theorie",
    "index": 5,
    "title": "Le nombre des adjectifs",
    "topic": "gram-aide",
    "public": "A1",
    "objectif": "Accorder l’adjectif au pluriel.",
    "blocks": [
      {
        "kind": "heading",
        "text": "Le nombre des adjectifs"
      },
      {
        "kind": "paragraph",
        "text": "Je fais correspondre l’adjectif à un nom pluriel."
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
              "Des vêtements {c}chauds{/c}.",
              "Des maisons {c}blanches{/c}.",
              "Des rubans {c}bleu clair{/c}."
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
            "text": "Un adjectif qui décrit plusieurs éléments se met généralement au pluriel."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "J’ajoute souvent s."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Un adjectif masculin déjà terminé par s ou x ne change pas."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Les adjectifs en -eau prennent x : beaux."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Beaucoup d’adjectifs en -al deviennent -aux : principaux."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Certains restent en -als, comme banals et fatals."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je forme d’abord le féminin si les noms sont féminins."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je garde ensuite le pluriel : des robes blanches."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Les couleurs composées restent généralement invariables."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je regarde tous les noms décrits pour décider l’accord."
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
            "text": "Un adjectif qui décrit plusieurs éléments se met généralement au pluriel."
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
              "Singulier",
              "Pluriel"
            ],
            "rows": [
              [
                "petit",
                "petits"
              ],
              [
                "petite",
                "petites"
              ],
              [
                "heureux",
                "heureux"
              ],
              [
                "beau",
                "beaux"
              ],
              [
                "nouveau",
                "nouveaux"
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "attention",
            "text": "Je n’ajoute pas de s à orange ou marron quand ces noms servent de couleurs."
          }
        ]
      }
    ]
  },
  {
    "id": "l6",
    "typeId": "gram-l6-theorie",
    "index": 6,
    "title": "Les lettres G et C",
    "topic": "gram-aide",
    "public": "A1 / A2",
    "objectif": "Savoir quand g et c sont durs ou doux.",
    "blocks": [
      {
        "kind": "heading",
        "text": "Les lettres G et C"
      },
      {
        "kind": "paragraph",
        "text": "Je reconnais les sons de g et de c selon les lettres qui suivent."
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
              "Nous commen{c}ç{/c}ons.",
              "Une {c}gu{/c}itare.",
              "Nous man{c}ge{/c}ons."
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
            "text": "Devant a, o ou u, c a souvent le son de car."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Devant e, i ou y, c a souvent le son de cinéma."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Pour garder ce son doux devant a, o ou u, je peux écrire ç."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Devant a, o ou u, g a souvent le son de gare."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Devant e, i ou y, g a souvent le son de girafe."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Pour garder le son de gare devant e ou i, j’écris souvent gu."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Pour garder le son de girafe devant a ou o, j’ajoute parfois e : mangeons."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je regarde donc les lettres autour du son."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "J’apprends aussi les mots particuliers avec leur orthographe."
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
            "text": "Devant a, o ou u, c a souvent le son de car."
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
              "Pourquoi"
            ],
            "rows": [
              [
                "cinéma",
                "c + i = son s"
              ],
              [
                "café",
                "c + a = son k"
              ],
              [
                "français",
                "ç garde le son s"
              ],
              [
                "mangeons",
                "e garde le son j"
              ],
              [
                "gare",
                "g + a = son g"
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "attention",
            "text": "La cédille s’écrit sous c ; je ne la mets pas devant e ou i pour obtenir le son doux habituel."
          }
        ]
      }
    ]
  },
  {
    "id": "l7",
    "typeId": "gram-l7-theorie",
    "index": 7,
    "title": "Les lettres S et M",
    "topic": "gram-aide",
    "public": "A1 / A2",
    "objectif": "Faire attention au son de s et à m devant b ou p.",
    "blocks": [
      {
        "kind": "heading",
        "text": "Les lettres S et M"
      },
      {
        "kind": "paragraph",
        "text": "Je vérifie s, ss et la lettre m dans les mots."
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
              "Un poi{c}ss{/c}on.",
              "Une mai{c}s{/c}on.",
              "Une cha{c}m{/c}bre."
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
            "text": "Entre deux voyelles, un seul s a souvent le son de z."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Pour obtenir le son de s entre deux voyelles, j’écris souvent ss."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Au début d’un mot, s ne suit pas ce modèle entre deux voyelles."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "La position de la lettre change donc la lecture."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Devant m, b ou p, j’écris souvent m à la place de n."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je retrouve cette écriture dans impossible, chambre et emmener."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Il existe des exceptions, comme bonbon."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je sépare la règle générale et les mots à mémoriser."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je relis le mot complet avant de changer une lettre."
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
            "text": "Entre deux voyelles, un seul s a souvent le son de z."
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
              "À retenir"
            ],
            "rows": [
              [
                "maison",
                "s = z"
              ],
              [
                "rose",
                "s = z"
              ],
              [
                "poisson",
                "ss = s"
              ],
              [
                "classe",
                "ss = s"
              ],
              [
                "chambre",
                "m devant b"
              ],
              [
                "lampe",
                "m devant p"
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "attention",
            "text": "Un seul s et deux s peuvent changer le sens : poisson et poison ne sont pas le même mot."
          }
        ]
      }
    ]
  },
  {
    "id": "l8",
    "typeId": "gram-l8-theorie",
    "index": 8,
    "title": "Les accents",
    "topic": "gram-aide",
    "public": "A1",
    "objectif": "Reconnaître é, è, ê, à, ù et ç.",
    "blocks": [
      {
        "kind": "heading",
        "text": "Les accents"
      },
      {
        "kind": "paragraph",
        "text": "Je garde les signes qui permettent de lire et de distinguer les mots."
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
              "Une {c}é{/c}cole.",
              "{c}Où{/c} habitez-vous ?",
              "Il va {c}à{/c} la gare."
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
            "text": "L’accent aigu s’écrit sur é."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "L’accent grave peut s’écrire sur è, à ou ù."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "L’accent circonflexe peut s’écrire sur plusieurs voyelles."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Le tréma indique parfois que deux voyelles se lisent séparément."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Les accents font partie du mot et restent sur les majuscules."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "À peut distinguer une préposition du verbe a."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Où indique souvent un lieu ; ou propose un choix."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "La cédille n’est pas un accent : elle change le son de c."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Certains mots admettent deux graphies reconnues, comme coût et cout."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je vérifie l’orthographe d’un mot plutôt que d’ajouter un signe au hasard."
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
            "text": "L’accent aigu s’écrit sur é."
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
              "Autre mot"
            ],
            "rows": [
              [
                "a (avoir)",
                "à (préposition)"
              ],
              [
                "ou",
                "où"
              ],
              [
                "sur",
                "sûr"
              ],
              [
                "la",
                "là"
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "attention",
            "text": "Je garde l’accent dans École, même avec une majuscule."
          }
        ]
      }
    ]
  },
  {
    "id": "l9",
    "typeId": "gram-l9-theorie",
    "index": 9,
    "title": "Les classes grammaticales",
    "topic": "gram-aide",
    "public": "A2",
    "objectif": "Reconnaître la classe d’un mot.",
    "blocks": [
      {
        "kind": "heading",
        "text": "Les classes grammaticales"
      },
      {
        "kind": "paragraph",
        "text": "Je reconnais le rôle habituel des mots dans une phrase."
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
              "Dans le petit chat dort, chat est un {c}nom{/c}.",
              "Petit est un {c}adjectif{/c}.",
              "Dort est un {c}verbe{/c}."
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
            "text": "Un nom désigne une personne, un lieu, une chose ou une idée."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Un déterminant accompagne un nom."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Un adjectif décrit un nom."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Un verbe exprime notamment une action ou un état."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Un pronom remplace souvent un nom ou désigne une personne."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Un adverbe précise notamment un verbe, un adjectif ou un autre adverbe."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Une préposition relie des mots : à, de, dans, avec."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Une conjonction relie des groupes ou des propositions : et, mais, parce que."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Une interjection exprime une réaction : ah ! bravo !"
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Le contexte aide à décider, car certains mots peuvent changer de classe."
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
            "text": "Un nom désigne une personne, un lieu, une chose ou une idée."
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
              "Classe",
              "Question utile"
            ],
            "rows": [
              [
                "nom",
                "De qui ou de quoi je parle ?"
              ],
              [
                "verbe",
                "Quelle action ou quel état ?"
              ],
              [
                "adjectif",
                "Comment est le nom ?"
              ],
              [
                "déterminant",
                "Quel petit mot devant le nom ?"
              ],
              [
                "préposition",
                "Quel mot de lien : à, de, dans ?"
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "attention",
            "text": "Je distingue la classe du mot et sa fonction dans la phrase : sujet est une fonction, pas une classe."
          }
        ]
      }
    ]
  },
  {
    "id": "l10",
    "typeId": "gram-l10-theorie",
    "index": 10,
    "title": "La ponctuation",
    "topic": "gram-aide",
    "public": "A1",
    "objectif": "Utiliser le point, la virgule, le point d’interrogation et d’exclamation.",
    "blocks": [
      {
        "kind": "heading",
        "text": "La ponctuation"
      },
      {
        "kind": "paragraph",
        "text": "Je rends les limites et le sens de ma phrase faciles à comprendre."
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
              "Vous venez {c}?{/c}",
              "Je demande si vous venez {c}.{/c}",
              "{c}Attention !{/c}"
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
            "text": "Le point termine une phrase déclarative."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Le point d’interrogation termine une question directe."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Le point d’exclamation marque une réaction ou une consigne forte."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "La virgule sépare certains éléments ; elle ne termine pas toujours la phrase."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Les deux-points peuvent annoncer une explication, une liste ou des paroles."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Les guillemets peuvent encadrer des paroles citées."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Une phrase commence normalement par une majuscule."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je ne sépare pas sans raison le sujet et le verbe par une virgule."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Une question indirecte peut se terminer par un point."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je relis en suivant les groupes de sens."
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
            "text": "Le point termine une phrase déclarative."
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
              "Signe",
              "Exemple"
            ],
            "rows": [
              [
                ".",
                "Je suis à Sion."
              ],
              [
                "?",
                "Tu es à Sion ?"
              ],
              [
                "!",
                "Quelle bonne idée !"
              ],
              [
                ",",
                "D’abord, je me lève."
              ],
              [
                ":",
                "Il dit : « Bonjour. »"
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "attention",
            "text": "Je distingue Où va-t-il ? et Je demande où il va."
          }
        ]
      }
    ]
  },
  {
    "id": "l11",
    "typeId": "gram-l11-theorie",
    "index": 11,
    "title": "Les homophones (sélection)",
    "topic": "gram-aide",
    "public": "A2",
    "objectif": "Distinguer des mots qui se prononcent pareil.",
    "blocks": [
      {
        "kind": "heading",
        "text": "Les homophones (sélection)"
      },
      {
        "kind": "paragraph",
        "text": "Je distingue des mots qui se prononcent de la même façon."
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
              "Elle {c}a{/c} rendez-vous {c}à{/c} midi.",
              "Ils {c}sont{/c} prêts.",
              "Tu veux du thé {c}ou{/c} du café ?"
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
            "text": "Des homophones ont une prononciation proche ou identique, mais une écriture et un rôle différents."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "A est le verbe avoir ; à est une préposition."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Est est le verbe être ; et relie des éléments."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "On est un pronom sujet ; ont est le verbe avoir."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Son peut être possessif ; sont est le verbe être."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Ou propose un choix ; où indique souvent un lieu ou un moment."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Ce accompagne ou reprend un élément ; se appartient à un verbe pronominal."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Ces montre plusieurs éléments ; ses indique leur appartenance."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je peux changer le temps d’un verbe pour vérifier : a devient avait, est devient était."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je vérifie le sens de la phrase avant de choisir."
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
            "text": "Des homophones ont une prononciation proche ou identique, mais une écriture et un rôle différents."
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
              "J’entends",
              "J’écris",
              "Test"
            ],
            "rows": [
              [
                "a",
                "a",
                "avait"
              ],
              [
                "a",
                "à",
                "pas « avait »"
              ],
              [
                "é",
                "et",
                "et puis"
              ],
              [
                "é",
                "est",
                "était"
              ],
              [
                "on",
                "on",
                "il"
              ],
              [
                "on",
                "ont",
                "avaient"
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "attention",
            "text": "Un test de remplacement aide, mais le rôle du mot et le sens restent importants."
          }
        ]
      }
    ]
  },
  {
    "id": "l12",
    "typeId": "gram-l12-theorie",
    "index": 12,
    "title": "Les noms composés",
    "topic": "gram-aide",
    "public": "B1",
    "objectif": "Mettre un nom composé au pluriel.",
    "blocks": [
      {
        "kind": "heading",
        "text": "Les noms composés"
      },
      {
        "kind": "paragraph",
        "text": "Je vérifie le pluriel des noms construits avec plusieurs mots."
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
              "Un chou-fleur, des {c}choux-fleurs{/c}.",
              "Un arc-en-ciel, des {c}arcs-en-ciel{/c}.",
              "Un cache-nez, des {c}cache-nez{/c}."
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
            "text": "Un nom composé réunit plusieurs éléments pour désigner une seule notion."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Certains éléments sont reliés par des traits d’union."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je regarde la classe et le sens des éléments."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Des noms et des adjectifs peuvent prendre le pluriel."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Un verbe ou une préposition dans le composé ne prend pas un accord ordinaire de nom."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je dis des choux-fleurs et des arcs-en-ciel."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Certains mots sont traditionnellement invariables, comme des cache-nez."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Les rectifications orthographiques admettent aussi des pluriels simplifiés pour plusieurs composés."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je retiens la graphie choisie dans un dictionnaire de référence."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je ne considère pas une variante reconnue comme une faute."
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
            "text": "Un nom composé réunit plusieurs éléments pour désigner une seule notion."
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
              "Singulier",
              "Pluriel",
              "Type"
            ],
            "rows": [
              [
                "chou-fleur",
                "choux-fleurs",
                "nom + nom"
              ],
              [
                "grand-père",
                "grands-pères",
                "adjectif + nom"
              ],
              [
                "tire-bouchon",
                "tire-bouchons",
                "verbe + nom"
              ],
              [
                "après-midi",
                "après-midi ou après-midis",
                "deux pluriels admis"
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "attention",
            "text": "Les noms composés ont des exceptions et parfois deux pluriels admis ; une règle unique serait trompeuse."
          }
        ]
      }
    ]
  },
  {
    "id": "l13",
    "typeId": "gram-l13-theorie",
    "index": 13,
    "title": "Les adverbes en -ment",
    "topic": "gram-aide",
    "public": "A2",
    "objectif": "Former un adverbe à partir d’un adjectif.",
    "blocks": [
      {
        "kind": "heading",
        "text": "Les adverbes en -ment"
      },
      {
        "kind": "paragraph",
        "text": "Je forme un adverbe qui précise la manière de faire."
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
              "Elle parle {c}lentement{/c}.",
              "Ils répondent {c}poliment{/c}.",
              "Tu agis {c}prudemment{/c}."
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
            "text": "Beaucoup d’adverbes de manière se terminent par -ment."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je pars souvent du féminin de l’adjectif."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Lente devient lentement ; douce devient doucement."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Si l’adjectif masculin se termine par une voyelle, je peux ajouter directement -ment : vrai donne vraiment."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Les adjectifs en -ant donnent souvent -amment : courant donne couramment."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Les adjectifs en -ent donnent souvent -emment : prudent donne prudemment."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Certains adverbes sont irréguliers, comme gentiment."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Un adverbe reste généralement invariable."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je distingue l’adjectif qui décrit un nom et l’adverbe qui précise une action."
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
            "text": "Beaucoup d’adverbes de manière se terminent par -ment."
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
              "Adjectif",
              "Adverbe"
            ],
            "rows": [
              [
                "lent",
                "lentement"
              ],
              [
                "doux",
                "doucement"
              ],
              [
                "heureux",
                "heureusement"
              ],
              [
                "courant",
                "couramment"
              ],
              [
                "évident",
                "évidemment"
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "attention",
            "text": "Même si le sujet est féminin ou pluriel, je n’accorde pas l’adverbe."
          }
        ]
      }
    ]
  },
  {
    "id": "l14",
    "typeId": "gram-l14-theorie",
    "index": 14,
    "title": "Les adverbes d’intensité",
    "topic": "gram-aide",
    "public": "A1 / A2",
    "objectif": "Renforcer ou atténuer une idée.",
    "blocks": [
      {
        "kind": "heading",
        "text": "Les adverbes d’intensité"
      },
      {
        "kind": "paragraph",
        "text": "Je renforce ou j’atténue une qualité, une quantité ou une action."
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
              "Le sac est {c}très{/c} lourd.",
              "Elle travaille {c}beaucoup{/c}.",
              "Il reste {c}un peu de{/c} pain."
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
            "text": "Très renforce souvent un adjectif ou un adverbe."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Beaucoup précise notamment une action ou une quantité."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Assez indique que le niveau convient ou est relativement important."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Trop indique que le niveau dépasse ce qui convient."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Un peu atténue ou indique une petite quantité."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Vraiment renforce une affirmation."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Presque indique que la limite est proche, sans être atteinte."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Je place l’adverbe avec l’élément qu’il précise."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Devant un nom, je peux avoir besoin de de : beaucoup de travail."
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "paragraph",
            "text": "Ces adverbes sont normalement invariables."
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
            "text": "Très renforce souvent un adjectif ou un adverbe."
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
              "Exemple"
            ],
            "rows": [
              [
                "très",
                "très content"
              ],
              [
                "trop",
                "trop sucré"
              ],
              [
                "assez",
                "assez grand"
              ],
              [
                "un peu",
                "un peu tard"
              ],
              [
                "beaucoup",
                "j’aime beaucoup"
              ],
              [
                "vraiment",
                "vraiment utile"
              ]
            ]
          },
          {
            "kind": "paragraph",
            "text": "{ligne/2}"
          },
          {
            "kind": "attention",
            "text": "Je dis très content, mais j’aime beaucoup : très ne remplace pas beaucoup devant tous les verbes."
          }
        ]
      }
    ]
  }
]
