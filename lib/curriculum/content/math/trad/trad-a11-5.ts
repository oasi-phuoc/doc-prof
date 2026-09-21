import type { SubmoduleTrad } from "./trad-types";

export const TRAD_A11_5: SubmoduleTrad = {
  submoduleId: "A11-5",
  title: {
    fr: "Fonction affine f(x) = ax + b",
    en: "Affine function f(x) = ax + b",
    ar: "الدالة الانتسابية f(x) = ax + b",
    fa: "تابع آفین f(x) = ax + b",
    ti: "ናይ ኣፊን ስራሕ f(x) = ax + b",
    uk: "Лінійна функція f(x) = ax + b",
  },
  blocks: [
    {
      text: {
        fr: "La fonction affine",
      }
    },
    {
      text: {
        fr: "Une fonction affine a la forme f(x) = ax **+** b. Son graphique est une **droite** (pas nécessairement par l'origine).",
      }
    },
    {
      text: {
        fr: "Les deux paramètres",
      },
      items: {
        fr: [
            "**a** = pente (coefficient directeur) : mesure l'inclinaison de la droite",
            "**b** = ordonnée à l'origine : valeur de y quand x = 0, point où la droite coupe l'axe y",
          ],
      }
    },
    {
      text: {
        fr: "Méthode pour tracer la droite",
      }
    },
    {
      text: {
        fr: "2 points suffisent",
      },
      items: {
        fr: [
            "1. Calculer le point (0, b) : l'ordonnée à l'origine (x = 0)",
            "2. Calculer un second point (ex. x = 1 ou x = 2)",
            "3. Tracer la droite passant par ces deux points",
          ],
      }
    },
    {
      text: {
        fr: "Exemple : f(x) = 2x + 3",
      }
    },
    {
      headers: {
        fr: ["x", "0", "1", "2", "**−**1"],
      },
      caption: {
        fr: "Point A(0 ; 3) : ordonnée à l'origine. Point B(2 ; 7) : second point.",
      }
    },
    {
      text: {
        fr: "Identifier a et b dans f(x) = ax + b",
      }
    },
    {
      items: {
        fr: [
            "f(x) = 2x **+** 3  →  a = 2, b = 3",
            "f(x) = **−**x **+** 5  →  a = **−**1, b = 5",
            "f(x) = 3x **−** 7  →  a = 3, b = **−**7",
          ],
      }
    },
  ],
  consignes: {
    "a11-5-ep01": { fr: "f(x) = 3x + 5. Quel est le coefficient directeur (pente) ?", en: "f(x) = 3x + 5. What is le coefficient directeur (pente) ?", ar: "f(x) = 3x + 5. ما هو le coefficient directeur (pente) ?", fa: "f(x) = 3x + 5. چیست le coefficient directeur (pente) ?", ti: "f(x) = 3x + 5. What is le coefficient directeur (pente) ?", uk: "f(x) = 3x + 5. Який le coefficient directeur (pente) ?", pt: "f(x) = 3x + 5. Qual é le coefficient directeur (pente) ?", so: "f(x) = 3x + 5. What is le coefficient directeur (pente) ?", tr: "f(x) = 3x + 5. Nedir le coefficient directeur (pente) ?", ps: "f(x) = 3x + 5. What is le coefficient directeur (pente) ?" },
    "a11-5-ep02": { fr: "f(x) = 3x + 5. Quelle est l'ordonnée à l'origine ?", en: "f(x) = 3x + 5. What is l'ordonnée à l'origine ?", ar: "f(x) = 3x + 5. ما هي l'ordonnée à l'origine ?", fa: "f(x) = 3x + 5. چیست l'ordonnée à l'origine ?", ti: "f(x) = 3x + 5. What is l'ordonnée à l'origine ?", uk: "f(x) = 3x + 5. Яка l'ordonnée à l'origine ?", pt: "f(x) = 3x + 5. Qual é l'ordonnée à l'origine ?", so: "f(x) = 3x + 5. What is l'ordonnée à l'origine ?", tr: "f(x) = 3x + 5. Nedir l'ordonnée à l'origine ?", ps: "f(x) = 3x + 5. What is l'ordonnée à l'origine ?" },
    "a11-5-ep03": { fr: "f(x) = −4x + 7. Quel est le coefficient directeur ?", en: "f(x) = −4x + 7. What is le coefficient directeur ?", ar: "f(x) = −4x + 7. ما هو le coefficient directeur ?", fa: "f(x) = −4x + 7. چیست le coefficient directeur ?", ti: "f(x) = −4x + 7. What is le coefficient directeur ?", uk: "f(x) = −4x + 7. Який le coefficient directeur ?", pt: "f(x) = −4x + 7. Qual é le coefficient directeur ?", so: "f(x) = −4x + 7. What is le coefficient directeur ?", tr: "f(x) = −4x + 7. Nedir le coefficient directeur ?", ps: "f(x) = −4x + 7. What is le coefficient directeur ?" },
    "a11-5-ep04": { fr: "f(x) = −4x + 7. Quelle est l'ordonnée à l'origine ?", en: "f(x) = −4x + 7. What is l'ordonnée à l'origine ?", ar: "f(x) = −4x + 7. ما هي l'ordonnée à l'origine ?", fa: "f(x) = −4x + 7. چیست l'ordonnée à l'origine ?", ti: "f(x) = −4x + 7. What is l'ordonnée à l'origine ?", uk: "f(x) = −4x + 7. Яка l'ordonnée à l'origine ?", pt: "f(x) = −4x + 7. Qual é l'ordonnée à l'origine ?", so: "f(x) = −4x + 7. What is l'ordonnée à l'origine ?", tr: "f(x) = −4x + 7. Nedir l'ordonnée à l'origine ?", ps: "f(x) = −4x + 7. What is l'ordonnée à l'origine ?" },
    "a11-5-ep05": { fr: "f(x) = 5x − 8. Calcule f(3).", en: "f(x) = 5x − 8. Calculate f(3).", ar: "f(x) = 5x − 8. احسب f(3).", fa: "f(x) = 5x − 8. حساب کنید f(3).", ti: "f(x) = 5x − 8. Calculate f(3).", uk: "f(x) = 5x − 8. Обчисліть f(3).", pt: "f(x) = 5x − 8. Calcule f(3).", so: "f(x) = 5x − 8. Calculate f(3).", tr: "f(x) = 5x − 8. Hesaplayın f(3).", ps: "f(x) = 5x − 8. Calculate f(3)." },
    "a11-5-ep06": { fr: "f(x) = 5x − 8. Calcule f(0).", en: "f(x) = 5x − 8. Calculate f(0).", ar: "f(x) = 5x − 8. احسب f(0).", fa: "f(x) = 5x − 8. حساب کنید f(0).", ti: "f(x) = 5x − 8. Calculate f(0).", uk: "f(x) = 5x − 8. Обчисліть f(0).", pt: "f(x) = 5x − 8. Calcule f(0).", so: "f(x) = 5x − 8. Calculate f(0).", tr: "f(x) = 5x − 8. Hesaplayın f(0).", ps: "f(x) = 5x − 8. Calculate f(0)." },
    "a11-5-ep07": { fr: "f(x) = 2x + 9. Quel est le coefficient directeur ?", en: "f(x) = 2x + 9. What is le coefficient directeur ?", ar: "f(x) = 2x + 9. ما هو le coefficient directeur ?", fa: "f(x) = 2x + 9. چیست le coefficient directeur ?", ti: "f(x) = 2x + 9. What is le coefficient directeur ?", uk: "f(x) = 2x + 9. Який le coefficient directeur ?", pt: "f(x) = 2x + 9. Qual é le coefficient directeur ?", so: "f(x) = 2x + 9. What is le coefficient directeur ?", tr: "f(x) = 2x + 9. Nedir le coefficient directeur ?", ps: "f(x) = 2x + 9. What is le coefficient directeur ?" },
    "a11-5-ep08": { fr: "f(x) = 2x + 9. Quelle est l'ordonnée à l'origine ?", en: "f(x) = 2x + 9. What is l'ordonnée à l'origine ?", ar: "f(x) = 2x + 9. ما هي l'ordonnée à l'origine ?", fa: "f(x) = 2x + 9. چیست l'ordonnée à l'origine ?", ti: "f(x) = 2x + 9. What is l'ordonnée à l'origine ?", uk: "f(x) = 2x + 9. Яка l'ordonnée à l'origine ?", pt: "f(x) = 2x + 9. Qual é l'ordonnée à l'origine ?", so: "f(x) = 2x + 9. What is l'ordonnée à l'origine ?", tr: "f(x) = 2x + 9. Nedir l'ordonnée à l'origine ?", ps: "f(x) = 2x + 9. What is l'ordonnée à l'origine ?" },
    "a11-5-ep09": { fr: "f(x) = 6x − 4. Calcule f(4).", en: "f(x) = 6x − 4. Calculate f(4).", ar: "f(x) = 6x − 4. احسب f(4).", fa: "f(x) = 6x − 4. حساب کنید f(4).", ti: "f(x) = 6x − 4. Calculate f(4).", uk: "f(x) = 6x − 4. Обчисліть f(4).", pt: "f(x) = 6x − 4. Calcule f(4).", so: "f(x) = 6x − 4. Calculate f(4).", tr: "f(x) = 6x − 4. Hesaplayın f(4).", ps: "f(x) = 6x − 4. Calculate f(4)." },
    "a11-5-ep10": { fr: "f(x) = −x + 11. Calcule f(6).", en: "f(x) = −x + 11. Calculate f(6).", ar: "f(x) = −x + 11. احسب f(6).", fa: "f(x) = −x + 11. حساب کنید f(6).", ti: "f(x) = −x + 11. Calculate f(6).", uk: "f(x) = −x + 11. Обчисліть f(6).", pt: "f(x) = −x + 11. Calcule f(6).", so: "f(x) = −x + 11. Calculate f(6).", tr: "f(x) = −x + 11. Hesaplayın f(6).", ps: "f(x) = −x + 11. Calculate f(6)." },
    "a11-5-ep11": { fr: "f(x) = 4x + 2. Quel est le coefficient directeur ?", en: "f(x) = 4x + 2. What is le coefficient directeur ?", ar: "f(x) = 4x + 2. ما هو le coefficient directeur ?", fa: "f(x) = 4x + 2. چیست le coefficient directeur ?", ti: "f(x) = 4x + 2. What is le coefficient directeur ?", uk: "f(x) = 4x + 2. Який le coefficient directeur ?", pt: "f(x) = 4x + 2. Qual é le coefficient directeur ?", so: "f(x) = 4x + 2. What is le coefficient directeur ?", tr: "f(x) = 4x + 2. Nedir le coefficient directeur ?", ps: "f(x) = 4x + 2. What is le coefficient directeur ?" },
    "a11-5-ep12": { fr: "f(x) = 4x + 2. Quelle est l'ordonnée à l'origine ?", en: "f(x) = 4x + 2. What is l'ordonnée à l'origine ?", ar: "f(x) = 4x + 2. ما هي l'ordonnée à l'origine ?", fa: "f(x) = 4x + 2. چیست l'ordonnée à l'origine ?", ti: "f(x) = 4x + 2. What is l'ordonnée à l'origine ?", uk: "f(x) = 4x + 2. Яка l'ordonnée à l'origine ?", pt: "f(x) = 4x + 2. Qual é l'ordonnée à l'origine ?", so: "f(x) = 4x + 2. What is l'ordonnée à l'origine ?", tr: "f(x) = 4x + 2. Nedir l'ordonnée à l'origine ?", ps: "f(x) = 4x + 2. What is l'ordonnée à l'origine ?" },
  },
};
