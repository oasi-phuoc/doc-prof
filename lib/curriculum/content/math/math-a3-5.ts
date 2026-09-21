import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A3_5_LESSON: MathSubmoduleLesson = {
    submoduleId: "A3-5",
    submoduleCode: "A3.5",
    theory: {
      title: {
        fr: "Les multiples",
      },

      blocks: [
      { type: "plain", fr: "Un nombre est un multiple d'un autre nombre lorsqu'on peut l'obtenir en le multipliant par un nombre entier." },
      { type: "plain", fr: "12 est un multiple de 4 car : " },

      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "**4** × 3 = 12",
        ],
      },

      { type: "heading", fr: "Les diviseurs", black: true },

      { type: "plain", fr: "Un nombre est un diviseur d'un autre nombre si la division donne un résultat entier, sans reste." },
      { type: "plain", fr: "4 est un diviseur de 12 car : " },

      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "12 ÷ **4** = 3",
        ],
      },

      { type: "highlight", fr: "Relations" },
      { type: "plain", fr: "Si 12 = 3 × 4 alors : " },

      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "12 est un multiple de 3 et de 4.",
          "3 et 4 sont des diviseurs de 12."
        ],
      },

      { type: "heading", fr: "Critères de divisibilité", black: true },

      { type: "plain", fr: "Les critères de divisibilité permettent de savoir rapidement si un nombre est divisible par un autre, sans poser la division." },

      {
        type: "table",
        headersFr: ["", "Critère"],
        accentHeader: true,
        textAlignRows: "left",
        colAligns: ["center", "left"],
        rows: [
          ["2", "Le dernier chiffre est pair."],
          ["3", "La somme des chiffres est divisible par 3.\nExemple : 123\n1 + 2 + 3 = 6\n6 est divisible par 3\nDonc 123 est divisible par 3."],
          ["4", "Le nombre formé par les deux derniers chiffres est divisible par 4.\nExemple : 324\nLes deux derniers chiffres sont 24.\n24 est divisible par 4\nDonc 324 est divisible par 4."],
          ["5", "Le dernier chiffre est 0 ou 5."],
          ["6", "Le nombre est divisible par 2 et par 3."],
          ["9", "La somme des chiffres est divisible par 9.\nExemple : 729\n7 + 2 + 9 = 18\n18 est divisible par 9\nDonc 729 est divisible par 9."],
          ["10", "Le dernier chiffre est 0."],
        ],
      },
    ],
    paragraphs: { fr: [] },
  },

  exercises: [],
  exercisePool: [
    // Exercice 1 — Reconnaître les multiples
    { id: "a3-5-ep01", promptFr: "Exercice 1 — Reconnaître les multiples\n6 est-il un multiple de 3 ? (oui/non)", type: "short_text", acceptable: ["oui", "Oui", "OUI"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},
    { id: "a3-5-ep02", promptFr: "Exercice 1 — Reconnaître les multiples\n10 est-il un multiple de 3 ? (oui/non)", type: "short_text", acceptable: ["non", "Non", "NON"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},
    { id: "a3-5-ep03", promptFr: "Exercice 1 — Reconnaître les multiples\n18 = 3 × ___ : complète le facteur manquant.", type: "number", acceptable: ["6"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},
    { id: "a3-5-ep04", promptFr: "Exercice 1 — Reconnaître les multiples\n42 = 7 × ___ : complète le facteur manquant.", type: "number", acceptable: ["6"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},

    // Exercice 2 — Reconnaître les diviseurs
    { id: "a3-5-ep05", promptFr: "Exercice 2 — Reconnaître les diviseurs\n4 est-il un diviseur de 20 ? (oui/non)", type: "short_text", acceptable: ["oui", "Oui", "OUI"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},
    { id: "a3-5-ep06", promptFr: "Exercice 2 — Reconnaître les diviseurs\n7 est-il un diviseur de 35 ? (oui/non)", type: "short_text", acceptable: ["oui", "Oui", "OUI"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},
    { id: "a3-5-ep07", promptFr: "Exercice 2 — Reconnaître les diviseurs\n5 divise-t-il 42 ? (oui/non)", type: "short_text", acceptable: ["non", "Non", "NON"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},
    { id: "a3-5-ep08", promptFr: "Exercice 2 — Reconnaître les diviseurs\nCombien de diviseurs a le nombre 12 ? (1, 2, 3, 4, 6, 12)", type: "number", acceptable: ["6"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},

    // Exercice 3 — Compléter une suite de multiples
    { id: "a3-5-ep09", promptFr: "Exercice 3 — Compléter une suite de multiples\n3 – 6 – 9 – ___ : quel est le terme suivant ?", type: "number", acceptable: ["12"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},
    { id: "a3-5-ep10", promptFr: "Exercice 3 — Compléter une suite de multiples\n3 – 6 – 9 – 12 – ___ : quel est le terme suivant ?", type: "number", acceptable: ["15"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},
    { id: "a3-5-ep11", promptFr: "Exercice 3 — Compléter une suite de multiples\n7 – 14 – 21 – ___ : quel est le terme suivant ?", type: "number", acceptable: ["28"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},
    { id: "a3-5-ep12", promptFr: "Exercice 3 — Compléter une suite de multiples\n5 – 10 – ___ – 20 : quel est le terme manquant ?", type: "number", acceptable: ["15"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},

    // Exercice 4 — Trouver le multiple suivant
    { id: "a3-5-ep13", promptFr: "Exercice 4 — Trouver le multiple suivant\nQuel est le prochain multiple de 4 après 28 ?", type: "number", acceptable: ["32"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},
    { id: "a3-5-ep14", promptFr: "Exercice 4 — Trouver le multiple suivant\nQuel est le prochain multiple de 9 après 54 ?", type: "number", acceptable: ["63"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},
    { id: "a3-5-ep15", promptFr: "Exercice 4 — Trouver le multiple suivant\nQuel est le plus petit multiple de 6 strictement supérieur à 40 ?", type: "number", acceptable: ["42"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},

    // Exercice 5 — Trouver tous les multiples d'un nombre
    { id: "a3-5-ep16", promptFr: "Exercice 5 — Multiples d'un nombre\nQuel est le 10ème multiple de 2 ? (2, 4, 6, 8, 10, 12, 14, 16, 18, __)", type: "number", acceptable: ["20"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},
    { id: "a3-5-ep17", promptFr: "Exercice 5 — Multiples d'un nombre\nQuel est le 10ème multiple de 7 ?", type: "number", acceptable: ["70"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},
    { id: "a3-5-ep18", promptFr: "Exercice 5 — Multiples d'un nombre\nQuel est le plus petit multiple commun de 3 et de 5 (autre que 0) ?", type: "number", acceptable: ["15"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},

    // Exercice 6 — Tableau de multiples
    { id: "a3-5-ep19", promptFr: "Exercice 6 — Tableau de multiples\nDans le tableau × : que vaut 2 × 4 ?", type: "number", acceptable: ["8"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},
    { id: "a3-5-ep20", promptFr: "Exercice 6 — Tableau de multiples\nDans le tableau × : que vaut 3 × 3 ?", type: "number", acceptable: ["9"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},
    { id: "a3-5-ep21", promptFr: "Exercice 6 — Tableau de multiples\nDans le tableau × : que vaut 4 × 4 ?", type: "number", acceptable: ["16"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},

    // Exercice 7 — Associer
    { id: "a3-5-ep22", promptFr: "Exercice 7 — Associer\n16 est-il un multiple de 4 ? (oui/non)", type: "short_text", acceptable: ["oui", "Oui", "OUI"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},
    { id: "a3-5-ep23", promptFr: "Exercice 7 — Associer\n3 est-il un diviseur de 18 ? (oui/non)", type: "short_text", acceptable: ["oui", "Oui", "OUI"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},
    { id: "a3-5-ep24", promptFr: "Exercice 7 — Associer\n45 est-il un multiple de 5 ? (oui/non)", type: "short_text", acceptable: ["oui", "Oui", "OUI"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},

    // Exercice 8 — Tri de nombres
    { id: "a3-5-ep25", promptFr: "Exercice 8 — Tri de nombres\n12 est-il un multiple de 2 ? (oui/non)", type: "short_text", acceptable: ["oui", "Oui", "OUI"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},
    { id: "a3-5-ep26", promptFr: "Exercice 8 — Tri de nombres\n21 est-il un multiple de 5 ? (oui/non)", type: "short_text", acceptable: ["non", "Non", "NON"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},
    { id: "a3-5-ep27", promptFr: "Exercice 8 — Tri de nombres\n15 est-il un multiple de 3 ? (oui/non)", type: "short_text", acceptable: ["oui", "Oui", "OUI"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},

    // Exercice 9 — Compléter avec "multiple" ou "diviseur"
    { id: "a3-5-ep28", promptFr: "Exercice 9 — Multiple ou diviseur ?\n5 est un ___ de 20. (multiple ou diviseur ?)", type: "short_text", acceptable: ["diviseur", "Diviseur"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},
    { id: "a3-5-ep29", promptFr: "Exercice 9 — Multiple ou diviseur ?\n20 est un ___ de 5. (multiple ou diviseur ?)", type: "short_text", acceptable: ["multiple", "Multiple"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},
    { id: "a3-5-ep30", promptFr: "Exercice 9 — Multiple ou diviseur ?\n8 est un ___ de 40. (multiple ou diviseur ?)", type: "short_text", acceptable: ["diviseur", "Diviseur"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},

    // Exercice 10 — Pair ou impair
    { id: "a3-5-ep31", promptFr: "Exercice 10 — Pair ou impair\nLes multiples de 2 sont-ils pairs ou impairs ? (pairs/impairs)", type: "short_text", acceptable: ["pairs", "Pairs"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},
    { id: "a3-5-ep32", promptFr: "Exercice 10 — Pair ou impair\nDonne le 5ème multiple impair de 3. (3, 9, 15, 21, ___)", type: "number", acceptable: ["27"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},

    // Exercice 11 — Divisible ou non
    { id: "a3-5-ep33", promptFr: "Exercice 11 — Divisible ou non\n45 est-il divisible par 3 ? (somme des chiffres : 4+5=9) (oui/non)", type: "short_text", acceptable: ["oui", "Oui", "OUI"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},
    { id: "a3-5-ep34", promptFr: "Exercice 11 — Divisible ou non\n120 est-il divisible par 10 ? (oui/non)", type: "short_text", acceptable: ["oui", "Oui", "OUI"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},
    { id: "a3-5-ep35", promptFr: "Exercice 11 — Divisible ou non\n87 est-il divisible par 2 ? (oui/non)", type: "short_text", acceptable: ["non", "Non", "NON"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},
    { id: "a3-5-ep36", promptFr: "Exercice 11 — Divisible ou non\n92 est-il divisible par 3 ? (somme : 9+2=11) (oui/non)", type: "short_text", acceptable: ["non", "Non", "NON"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},

    // Exercice 12 — Utiliser les règles de divisibilité
    { id: "a3-5-ep37", promptFr: "Exercice 12 — Règles de divisibilité\n246 est divisible par 2. Son dernier chiffre est ___.", type: "number", acceptable: ["6"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},
    { id: "a3-5-ep38", promptFr: "Exercice 12 — Règles de divisibilité\n315 est divisible par 5. Son dernier chiffre est ___.", type: "number", acceptable: ["5"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},
    { id: "a3-5-ep39", promptFr: "Exercice 12 — Règles de divisibilité\n123 est divisible par 3. La somme de ses chiffres est 1+2+3=___.", type: "number", acceptable: ["6"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},

    // Exercice 13 — Compléter un chiffre manquant
    { id: "a3-5-ep40", promptFr: "Exercice 13 — Chiffre manquant\nPour que 4_ soit divisible par 2, quel chiffre peut remplacer _ ? (donne un exemple)", type: "short_text", acceptable: ["0", "2", "4", "6", "8"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},
    { id: "a3-5-ep41", promptFr: "Exercice 13 — Chiffre manquant\nPour que 7_ soit divisible par 5, quel chiffre peut remplacer _ ? (0 ou 5)", type: "short_text", acceptable: ["0", "5"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},
    { id: "a3-5-ep42", promptFr: "Exercice 13 — Chiffre manquant\nQuel chiffre remplace _ pour que 15_ soit divisible par 3 ? (somme divisible par 3 : 1+5+_)", type: "short_text", acceptable: ["0", "3", "6", "9"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},

    // Exercice 14 — Trouver un nombre (devinettes)
    { id: "a3-5-ep43", promptFr: "Exercice 14 — Trouver un nombre\nJe suis multiple de 4 et de 5. Je suis plus petit que 50. Qui suis-je ? (le plus petit tel nombre, autre que 0)", type: "number", acceptable: ["20"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},
    { id: "a3-5-ep44", promptFr: "Exercice 14 — Trouver un nombre\nJe suis divisible par 3 et par 2. Je suis plus petit que 15. Qui suis-je ? (le plus petit tel nombre, autre que 0)", type: "number", acceptable: ["6"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},
    { id: "a3-5-ep45", promptFr: "Exercice 14 — Trouver un nombre\nJe suis un diviseur de 36. Je suis supérieur à 12 et inférieur à 36. Qui suis-je ? (le plus petit)", type: "number", acceptable: ["18"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},

    // Exercice 15 — Intrus
    { id: "a3-5-ep46", promptFr: "Exercice 15 — Trouver l'intrus\nDans la suite 6, 12, 18, 25, 30 : quel est l'intrus ? (nombre non multiple de 6)", type: "number", acceptable: ["25"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},
    { id: "a3-5-ep47", promptFr: "Exercice 15 — Trouver l'intrus\nDans la suite 5, 10, 15, 21, 25 : quel est l'intrus ? (nombre non multiple de 5)", type: "number", acceptable: ["21"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},

    // Exercice 16 — Devinette
    { id: "a3-5-ep48", promptFr: "Exercice 16 — Devinette\nJe suis un multiple de 6. Je suis pair. Je suis entre 20 et 30. Qui suis-je ?", type: "number", acceptable: ["24"], hintFr: "Un multiple de n est le résultat de n × 1, n × 2, n × 3… Vérifie par division entière."},
  ],
  poolSize: 8,
};
