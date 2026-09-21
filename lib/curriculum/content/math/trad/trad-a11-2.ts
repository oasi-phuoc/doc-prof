import type { SubmoduleTrad } from "./trad-types";

export const TRAD_A11_2: SubmoduleTrad = {
  submoduleId: "A11-2",
  title: {
    fr: "Tableau de valeurs",
    en: "Table of values",
    ar: "جدول القيم",
    fa: "جدول مقادیر",
    ti: "ሰሌዳ ዋጋ",
    uk: "Таблиця значень",
  },
  blocks: [
    {
      text: {
        fr: "Construire un tableau de valeurs",
      }
    },
    {
      text: {
        fr: "Un tableau de valeurs liste plusieurs couples (x, f(x)). On choisit des valeurs régulières de x et on calcule f(x) pour chacune.",
      }
    },
    {
      text: {
        fr: "Méthode",
      },
      items: {
        fr: [
            "1. Choisir des valeurs entières de x (souvent symétriques autour de 0)",
            "2. Calculer f(x) pour chaque valeur de x",
            "3. Remplir le tableau ligne par ligne",
            "4. Utiliser ces points pour tracer le graphique",
          ],
      }
    },
    {
      text: {
        fr: "Exemple : f(x) = 2x + 1",
      }
    },
    {
      headers: {
        fr: ["x", "−2", "−1", "0", "1", "2"],
      }
    },
    {
      text: {
        fr: "Exemple : f(x) = x² − 1",
      }
    },
    {
      headers: {
        fr: ["x", "−2", "−1", "0", "1", "2"],
      }
    },
    {
      text: {
        fr: "Conseil : choisir des valeurs symétriques autour de 0 permet de voir la tendance globale de la fonction et de faciliter le tracé du graphique.",
      }
    },
  ],
  consignes: {
    "a11-2-ep01": { fr: "f(x) = 3x + 1. Calcule f(−3).", en: "f(x) = 3x + 1. Calculate f(−3).", ar: "f(x) = 3x + 1. احسب f(−3).", fa: "f(x) = 3x + 1. حساب کنید f(−3).", ti: "f(x) = 3x + 1. Calculate f(−3).", uk: "f(x) = 3x + 1. Обчисліть f(−3).", pt: "f(x) = 3x + 1. Calcule f(−3).", so: "f(x) = 3x + 1. Calculate f(−3).", tr: "f(x) = 3x + 1. Hesaplayın f(−3).", ps: "f(x) = 3x + 1. Calculate f(−3)." },
    "a11-2-ep02": { fr: "f(x) = 3x + 1. Calcule f(3).", en: "f(x) = 3x + 1. Calculate f(3).", ar: "f(x) = 3x + 1. احسب f(3).", fa: "f(x) = 3x + 1. حساب کنید f(3).", ti: "f(x) = 3x + 1. Calculate f(3).", uk: "f(x) = 3x + 1. Обчисліть f(3).", pt: "f(x) = 3x + 1. Calcule f(3).", so: "f(x) = 3x + 1. Calculate f(3).", tr: "f(x) = 3x + 1. Hesaplayın f(3).", ps: "f(x) = 3x + 1. Calculate f(3)." },
    "a11-2-ep03": { fr: "f(x) = x² − 4. Calcule f(0).", en: "f(x) = x² − 4. Calculate f(0).", ar: "f(x) = x² − 4. احسب f(0).", fa: "f(x) = x² − 4. حساب کنید f(0).", ti: "f(x) = x² − 4. Calculate f(0).", uk: "f(x) = x² − 4. Обчисліть f(0).", pt: "f(x) = x² − 4. Calcule f(0).", so: "f(x) = x² − 4. Calculate f(0).", tr: "f(x) = x² − 4. Hesaplayın f(0).", ps: "f(x) = x² − 4. Calculate f(0)." },
    "a11-2-ep04": { fr: "f(x) = x² − 4. Calcule f(4).", en: "f(x) = x² − 4. Calculate f(4).", ar: "f(x) = x² − 4. احسب f(4).", fa: "f(x) = x² − 4. حساب کنید f(4).", ti: "f(x) = x² − 4. Calculate f(4).", uk: "f(x) = x² − 4. Обчисліть f(4).", pt: "f(x) = x² − 4. Calcule f(4).", so: "f(x) = x² − 4. Calculate f(4).", tr: "f(x) = x² − 4. Hesaplayın f(4).", ps: "f(x) = x² − 4. Calculate f(4)." },
    "a11-2-ep05": { fr: "f(x) = 4x − 3. Calcule f(3).", en: "f(x) = 4x − 3. Calculate f(3).", ar: "f(x) = 4x − 3. احسب f(3).", fa: "f(x) = 4x − 3. حساب کنید f(3).", ti: "f(x) = 4x − 3. Calculate f(3).", uk: "f(x) = 4x − 3. Обчисліть f(3).", pt: "f(x) = 4x − 3. Calcule f(3).", so: "f(x) = 4x − 3. Calculate f(3).", tr: "f(x) = 4x − 3. Hesaplayın f(3).", ps: "f(x) = 4x − 3. Calculate f(3)." },
    "a11-2-ep06": { fr: "f(x) = 4x − 3. Calcule f(−1).", en: "f(x) = 4x − 3. Calculate f(−1).", ar: "f(x) = 4x − 3. احسب f(−1).", fa: "f(x) = 4x − 3. حساب کنید f(−1).", ti: "f(x) = 4x − 3. Calculate f(−1).", uk: "f(x) = 4x − 3. Обчисліть f(−1).", pt: "f(x) = 4x − 3. Calcule f(−1).", so: "f(x) = 4x − 3. Calculate f(−1).", tr: "f(x) = 4x − 3. Hesaplayın f(−1).", ps: "f(x) = 4x − 3. Calculate f(−1)." },
    "a11-2-ep07": { fr: "f(x) = x² + 3x. Calcule f(4).", en: "f(x) = x² + 3x. Calculate f(4).", ar: "f(x) = x² + 3x. احسب f(4).", fa: "f(x) = x² + 3x. حساب کنید f(4).", ti: "f(x) = x² + 3x. Calculate f(4).", uk: "f(x) = x² + 3x. Обчисліть f(4).", pt: "f(x) = x² + 3x. Calcule f(4).", so: "f(x) = x² + 3x. Calculate f(4).", tr: "f(x) = x² + 3x. Hesaplayın f(4).", ps: "f(x) = x² + 3x. Calculate f(4)." },
    "a11-2-ep08": { fr: "f(x) = x² + 3x. Calcule f(−3).", en: "f(x) = x² + 3x. Calculate f(−3).", ar: "f(x) = x² + 3x. احسب f(−3).", fa: "f(x) = x² + 3x. حساب کنید f(−3).", ti: "f(x) = x² + 3x. Calculate f(−3).", uk: "f(x) = x² + 3x. Обчисліть f(−3).", pt: "f(x) = x² + 3x. Calcule f(−3).", so: "f(x) = x² + 3x. Calculate f(−3).", tr: "f(x) = x² + 3x. Hesaplayın f(−3).", ps: "f(x) = x² + 3x. Calculate f(−3)." },
    "a11-2-ep09": { fr: "f(x) = 6 − x. Calcule f(9).", en: "f(x) = 6 − x. Calculate f(9).", ar: "f(x) = 6 − x. احسب f(9).", fa: "f(x) = 6 − x. حساب کنید f(9).", ti: "f(x) = 6 − x. Calculate f(9).", uk: "f(x) = 6 − x. Обчисліть f(9).", pt: "f(x) = 6 − x. Calcule f(9).", so: "f(x) = 6 − x. Calculate f(9).", tr: "f(x) = 6 − x. Hesaplayın f(9).", ps: "f(x) = 6 − x. Calculate f(9)." },
    "a11-2-ep10": { fr: "f(x) = 6 − x. Calcule f(0).", en: "f(x) = 6 − x. Calculate f(0).", ar: "f(x) = 6 − x. احسب f(0).", fa: "f(x) = 6 − x. حساب کنید f(0).", ti: "f(x) = 6 − x. Calculate f(0).", uk: "f(x) = 6 − x. Обчисліть f(0).", pt: "f(x) = 6 − x. Calcule f(0).", so: "f(x) = 6 − x. Calculate f(0).", tr: "f(x) = 6 − x. Hesaplayın f(0).", ps: "f(x) = 6 − x. Calculate f(0)." },
    "a11-2-ep11": { fr: "f(x) = 2x² − 1. Calcule f(3).", en: "f(x) = 2x² − 1. Calculate f(3).", ar: "f(x) = 2x² − 1. احسب f(3).", fa: "f(x) = 2x² − 1. حساب کنید f(3).", ti: "f(x) = 2x² − 1. Calculate f(3).", uk: "f(x) = 2x² − 1. Обчисліть f(3).", pt: "f(x) = 2x² − 1. Calcule f(3).", so: "f(x) = 2x² − 1. Calculate f(3).", tr: "f(x) = 2x² − 1. Hesaplayın f(3).", ps: "f(x) = 2x² − 1. Calculate f(3)." },
    "a11-2-ep12": { fr: "f(x) = 2x² − 1. Calcule f(−2).", en: "f(x) = 2x² − 1. Calculate f(−2).", ar: "f(x) = 2x² − 1. احسب f(−2).", fa: "f(x) = 2x² − 1. حساب کنید f(−2).", ti: "f(x) = 2x² − 1. Calculate f(−2).", uk: "f(x) = 2x² − 1. Обчисліть f(−2).", pt: "f(x) = 2x² − 1. Calcule f(−2).", so: "f(x) = 2x² − 1. Calculate f(−2).", tr: "f(x) = 2x² − 1. Hesaplayın f(−2).", ps: "f(x) = 2x² − 1. Calculate f(−2)." },
  },
};
