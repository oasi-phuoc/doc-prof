import type { SubmoduleTrad } from "./trad-types";

export const TRAD_A11_4: SubmoduleTrad = {
  submoduleId: "A11-4",
  title: {
    fr: "Fonction linéaire f(x) = ax",
    en: "Linear function f(x) = ax",
    ar: "الدالة الخطية f(x) = ax",
    fa: "تابع خطی f(x) = ax",
    ti: "ናይ ቐጥታ ስራሕ f(x) = ax",
    uk: "Лінійна функція f(x) = ax",
  },
  blocks: [
    {
      text: {
        fr: "La fonction linéaire",
      }
    },
    {
      text: {
        fr: "Une fonction linéaire a la forme f(x) = ax, où a est une constante appelée **pente** (ou coefficient directeur). Son graphique est toujours une **droite passant par l'origine (0, 0)**.",
      }
    },
    {
      text: {
        fr: "Propriété fondamentale",
      },
      items: {
        fr: [
            "f(0) = a × 0 = 0  → la droite passe toujours par l'origine",
          ],
      }
    },
    {
      text: {
        fr: "Influence de la pente a",
      }
    },
    {
      headers: {
        fr: ["Valeur de a", "Comportement de la droite", "Exemple"],
      }
    },
    {
      text: {
        fr: "Exemples",
      }
    },
    {
      headers: {
        fr: ["Fonction", "x = 1", "x = 2", "x = **−**1", "Passe par (0,0) ?"],
      }
    },
  ],
  consignes: {
    "a11-4-ep01": { fr: "f(x) = 4x. Calcule f(5).", en: "f(x) = 4x. Calculate f(5).", ar: "f(x) = 4x. احسب f(5).", fa: "f(x) = 4x. حساب کنید f(5).", ti: "f(x) = 4x. Calculate f(5).", uk: "f(x) = 4x. Обчисліть f(5).", pt: "f(x) = 4x. Calcule f(5).", so: "f(x) = 4x. Calculate f(5).", tr: "f(x) = 4x. Hesaplayın f(5).", ps: "f(x) = 4x. Calculate f(5)." },
    "a11-4-ep02": { fr: "f(x) = −3x. Calcule f(6).", en: "f(x) = −3x. Calculate f(6).", ar: "f(x) = −3x. احسب f(6).", fa: "f(x) = −3x. حساب کنید f(6).", ti: "f(x) = −3x. Calculate f(6).", uk: "f(x) = −3x. Обчисліть f(6).", pt: "f(x) = −3x. Calcule f(6).", so: "f(x) = −3x. Calculate f(6).", tr: "f(x) = −3x. Hesaplayın f(6).", ps: "f(x) = −3x. Calculate f(6)." },
    "a11-4-ep03": { fr: "f(x) = 5x. Calcule f(−4).", en: "f(x) = 5x. Calculate f(−4).", ar: "f(x) = 5x. احسب f(−4).", fa: "f(x) = 5x. حساب کنید f(−4).", ti: "f(x) = 5x. Calculate f(−4).", uk: "f(x) = 5x. Обчисліть f(−4).", pt: "f(x) = 5x. Calcule f(−4).", so: "f(x) = 5x. Calculate f(−4).", tr: "f(x) = 5x. Hesaplayın f(−4).", ps: "f(x) = 5x. Calculate f(−4)." },
    "a11-4-ep04": { fr: "f(x) = 3x. Quel est le coefficient directeur ?", en: "f(x) = 3x. What is le coefficient directeur ?", ar: "f(x) = 3x. ما هو le coefficient directeur ?", fa: "f(x) = 3x. چیست le coefficient directeur ?", ti: "f(x) = 3x. What is le coefficient directeur ?", uk: "f(x) = 3x. Який le coefficient directeur ?", pt: "f(x) = 3x. Qual é le coefficient directeur ?", so: "f(x) = 3x. What is le coefficient directeur ?", tr: "f(x) = 3x. Nedir le coefficient directeur ?", ps: "f(x) = 3x. What is le coefficient directeur ?" },
    "a11-4-ep05": { fr: "f(x) = −7x. Calcule f(3).", en: "f(x) = −7x. Calculate f(3).", ar: "f(x) = −7x. احسب f(3).", fa: "f(x) = −7x. حساب کنید f(3).", ti: "f(x) = −7x. Calculate f(3).", uk: "f(x) = −7x. Обчисліть f(3).", pt: "f(x) = −7x. Calcule f(3).", so: "f(x) = −7x. Calculate f(3).", tr: "f(x) = −7x. Hesaplayın f(3).", ps: "f(x) = −7x. Calculate f(3)." },
    "a11-4-ep06": { fr: "f(x) = 6x. Quel est le coefficient directeur ?", en: "f(x) = 6x. What is le coefficient directeur ?", ar: "f(x) = 6x. ما هو le coefficient directeur ?", fa: "f(x) = 6x. چیست le coefficient directeur ?", ti: "f(x) = 6x. What is le coefficient directeur ?", uk: "f(x) = 6x. Який le coefficient directeur ?", pt: "f(x) = 6x. Qual é le coefficient directeur ?", so: "f(x) = 6x. What is le coefficient directeur ?", tr: "f(x) = 6x. Nedir le coefficient directeur ?", ps: "f(x) = 6x. What is le coefficient directeur ?" },
    "a11-4-ep07": { fr: "f(x) = 8x. Calcule f(4).", en: "f(x) = 8x. Calculate f(4).", ar: "f(x) = 8x. احسب f(4).", fa: "f(x) = 8x. حساب کنید f(4).", ti: "f(x) = 8x. Calculate f(4).", uk: "f(x) = 8x. Обчисліть f(4).", pt: "f(x) = 8x. Calcule f(4).", so: "f(x) = 8x. Calculate f(4).", tr: "f(x) = 8x. Hesaplayın f(4).", ps: "f(x) = 8x. Calculate f(4)." },
    "a11-4-ep08": { fr: "f(x) = 9x. Calcule f(0).", en: "f(x) = 9x. Calculate f(0).", ar: "f(x) = 9x. احسب f(0).", fa: "f(x) = 9x. حساب کنید f(0).", ti: "f(x) = 9x. Calculate f(0).", uk: "f(x) = 9x. Обчисліть f(0).", pt: "f(x) = 9x. Calcule f(0).", so: "f(x) = 9x. Calculate f(0).", tr: "f(x) = 9x. Hesaplayın f(0).", ps: "f(x) = 9x. Calculate f(0)." },
    "a11-4-ep09": { fr: "f(x) = −4x. Calcule f(−5).", en: "f(x) = −4x. Calculate f(−5).", ar: "f(x) = −4x. احسب f(−5).", fa: "f(x) = −4x. حساب کنید f(−5).", ti: "f(x) = −4x. Calculate f(−5).", uk: "f(x) = −4x. Обчисліть f(−5).", pt: "f(x) = −4x. Calcule f(−5).", so: "f(x) = −4x. Calculate f(−5).", tr: "f(x) = −4x. Hesaplayın f(−5).", ps: "f(x) = −4x. Calculate f(−5)." },
    "a11-4-ep10": { fr: "f(x) = 7x. Quel est le coefficient directeur ?", en: "f(x) = 7x. What is le coefficient directeur ?", ar: "f(x) = 7x. ما هو le coefficient directeur ?", fa: "f(x) = 7x. چیست le coefficient directeur ?", ti: "f(x) = 7x. What is le coefficient directeur ?", uk: "f(x) = 7x. Який le coefficient directeur ?", pt: "f(x) = 7x. Qual é le coefficient directeur ?", so: "f(x) = 7x. What is le coefficient directeur ?", tr: "f(x) = 7x. Nedir le coefficient directeur ?", ps: "f(x) = 7x. What is le coefficient directeur ?" },
    "a11-4-ep11": { fr: "f(x) = 2x. Calcule f(12).", en: "f(x) = 2x. Calculate f(12).", ar: "f(x) = 2x. احسب f(12).", fa: "f(x) = 2x. حساب کنید f(12).", ti: "f(x) = 2x. Calculate f(12).", uk: "f(x) = 2x. Обчисліть f(12).", pt: "f(x) = 2x. Calcule f(12).", so: "f(x) = 2x. Calculate f(12).", tr: "f(x) = 2x. Hesaplayın f(12).", ps: "f(x) = 2x. Calculate f(12)." },
    "a11-4-ep12": { fr: "f(x) = −5x. Calcule f(4).", en: "f(x) = −5x. Calculate f(4).", ar: "f(x) = −5x. احسب f(4).", fa: "f(x) = −5x. حساب کنید f(4).", ti: "f(x) = −5x. Calculate f(4).", uk: "f(x) = −5x. Обчисліть f(4).", pt: "f(x) = −5x. Calcule f(4).", so: "f(x) = −5x. Calculate f(4).", tr: "f(x) = −5x. Hesaplayın f(4).", ps: "f(x) = −5x. Calculate f(4)." },
  },
};
