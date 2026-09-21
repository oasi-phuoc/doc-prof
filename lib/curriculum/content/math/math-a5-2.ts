import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A5_2_LESSON: MathSubmoduleLesson = {
    submoduleId: "A5-2",
    submoduleCode: "A5.2",
    theory: {
      title: { fr: "Suites de décimaux",},
      blocks: [
        { type: "heading", fr: "Comment trouver l'écart", black: true },
        { type: "plain", fr: "**1.** Repérer si la suite est **croissante** (augmente) ou **décroissante** (diminue)." },
        { type: "plain", fr: "**2.** Calculer l'écart entre deux valeurs consécutives." },
        { type: "plain", fr: "**3.** Appliquer l'écart pour trouver les valeurs manquantes." },
        { type: "plain", fr: "" },
        { type: "heading", fr: "Deux valeurs consécutives connues", black: true },
        { type: "plain", fr: "2,5 ; **...** ; 3,5 ; 4" },
        {
          type: "section", labelFr: "", itemsFr: [
            "Soustraire les deux valeurs connues.",
            "4 − 3,5 = 0,5 **écart**",
            "Valeur manquante = valeur connue ± **écart**",
            "Valeur manquante = 2,5 + 0,5 = **3,0**",
          ],
        },
        { type: "plain", fr: "2,5 ; **3** ; 3,5 ; 4" },
        { type: "plain", fr: "" },
        { type: "heading", fr: "Pas de valeurs consécutives", black: true },
        { type: "plain", fr: "**...** ; 7,2 ; **...** ; 9,6" },
        {
          type: "section", labelFr: "", itemsFr: [
            "Soustraire les deux valeurs connues.",
            "9,6 − 7,2 = 2,4",
            "Diviser par le **nombre d'espaces** entre eux. Le nombre d'espaces = nombre de valeurs manquantes **+ 1**.",
            "2,4 ÷ **2** = 1,2 **écart**",
            "Valeur manquante = valeur connue ± **écart**",
            "Valeurs manquantes : 7,2 + 1,2 = **8,4** et 9,6 − 1,2 = **6,0**",
          ],
        },
        { type: "plain", fr: "**6** ; 7,2 ; **8,4** ; 9,6" },
      ],
      paragraphs: { fr: [] },
    },
    exercises: [
      { id: "a5-2-e1", promptFr: "Classez du plus petit au plus grand : 2,5 ; 2,15 ; 2,51", type: "short_text" as const, acceptable: ["2,15 ; 2,5 ; 2,51", "2.15 ; 2.5 ; 2.51"] },
      { id: "a5-2-e2", promptFr: "Donnez le terme manquant : 1,2 ; 1,5 ; ___ ; 2,1", type: "short_text" as const, acceptable: ["1,8", "1.8"] },
      { id: "a5-2-e3", promptFr: "Classez du plus grand au plus petit : 0,3 ; 0,13 ; 0,31", type: "short_text" as const, acceptable: ["0,31 ; 0,3 ; 0,13", "0.31 ; 0.3 ; 0.13"] },
    ],
    exercisePool: [],
    poolSize: 3,
  };
