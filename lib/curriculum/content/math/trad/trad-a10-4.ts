import type { SubmoduleTrad } from "./trad-types";

export const TRAD_A10_4: SubmoduleTrad = {
  submoduleId: "A10-4",
  title: {
    fr: "Méthode d'addition / soustraction",
    en: "Addition / subtraction method (elimination)",
    ar: "طريقة الجمع والطرح (الحذف)",
    fa: "روش جمع / تفریق (حذف)",
    ti: "ኣፈጻጽማ ምኽፋሎ / ምቕናስ",
    uk: "Метод додавання / віднімання (виключення)",
  },
  blocks: [
    {
      text: {
        fr: "Méthode d'élimination",
      }
    },
    {
      text: {
        fr: "La méthode d'élimination (combinaison linéaire) consiste à additionner ou soustraire les deux équations membre à membre pour faire disparaître une inconnue.",
      }
    },
    {
      text: {
        fr: "Les 4 étapes",
      },
      items: {
        fr: [
            "1. Si nécessaire, multiplier une équation (ou les deux) pour que les coefficients d'une inconnue soient opposés",
            "2. Additionner les deux équations membre à membre",
            "3. Résoudre l'équation à une inconnue obtenue",
            "4. Substituer pour trouver la deuxième inconnue, puis vérifier",
          ],
      }
    },
    {
      text: {
        fr: "Exemple : élimination directe",
      }
    },
    {
      text: {
        fr: "Système",
      }
    },
    {
      items: {
        fr: [
            "{ 2x **+** 3y = 12",
            "{ 2x **−** y = 4",
          ],
      }
    },
    {
      text: {
        fr: "Résolution",
      }
    },
    {
      items: {
        fr: [
            "Soustraction membre à membre : (2x **+** 3y) **−** (2x **−** y) = 12 **−** 4",
            "→ 4y = 8  →  y = 2",
            "Substitution : 2x **+** 6 = 12  →  2x = 6  →  x = 3",
            "**Solution : (3, 2)**",
          ],
      }
    },
    {
      text: {
        fr: "Exemple : multiplication préalable",
      }
    },
    {
      text: {
        fr: "Système",
      }
    },
    {
      items: {
        fr: [
            "{ 3x **+** 2y = 7",
            "{ x **−** y = 1",
          ],
      }
    },
    {
      text: {
        fr: "Résolution",
      }
    },
    {
      items: {
        fr: [
            "Multiplier la 2ᵉ équation par 2 : 2x **−** 2y = 2",
            "Addition : (3x **+** 2y) **+** (2x **−** 2y) = 7 **+** 2",
            "→ 5x = 9  →  x = 9/5 = 1,8",
            "Puis y = x **−** 1 = 0,8",
          ],
      }
    },
  ],
};
