import type { SubmoduleTrad } from "./trad-types";

export const TRAD_A11_6: SubmoduleTrad = {
  submoduleId: "A11-6",
  title: {
    fr: "Pente et ordonnée à l'origine",
    en: "Slope and y-intercept",
    ar: "الميل ونقطة القطع مع المحور y",
    fa: "شیب و عرض از مبدأ",
    ti: "ሃፍን ናይ y ሕርሚ ምቁራጽን",
    uk: "Кутовий коефіцієнт і початкова ордината",
  },
  blocks: [
    {
      text: {
        fr: "La pente (coefficient directeur)",
      }
    },
    {
      text: {
        fr: "La pente a mesure la variation de y pour chaque unité d'augmentation de x. Elle indique l'inclinaison et le sens de la droite.",
      }
    },
    {
      text: {
        fr: "Formule de la pente",
      },
      items: {
        fr: [
            "a = Δy / Δx = (y₂ **−** y₁) / (x₂ **−** x₁)",
            "avec deux points distincts A(x₁, y₁) et B(x₂, y₂)",
          ],
      }
    },
    {
      text: {
        fr: "Droite passant par A(1, 3) et B(3, 7) :\na = (7 − 3) / (3 − 1) = 4 / 2 = 2",
      }
    },
    {
      text: {
        fr: "Interprétation de la pente",
      }
    },
    {
      headers: {
        fr: ["Signe de a", "Type de droite", "Signification"],
      }
    },
    {
      text: {
        fr: "L'ordonnée à l'origine",
      }
    },
    {
      text: {
        fr: "L'ordonnée à l'origine b est la valeur de y lorsque x = 0. Elle se lit directement sur le graphique au point d'intersection avec l'axe y.",
      }
    },
    {
      text: {
        fr: "Trouver a et b depuis deux points",
      }
    },
    {
      items: {
        fr: [
            "1. Calculer a = (y₂ **−** y₁) / (x₂ **−** x₁)",
            "2. Écrire f(x) = ax **+** b",
            "3. Substituer un des points pour trouver b : b = y₁ **−** a × x₁",
          ],
      }
    },
    {
      text: {
        fr: "Points A(0, 4) et B(3, 7) :\na = (7 − 4) / (3 − 0) = 3/3 = 1\nb = 4 (ordonnée de A, car x₁ = 0)\nDonc : f(x) = x + 4",
      }
    },
  ],
  consignes: {
    "a11-6-ep01": { fr: "Points A(0 ; 2) et B(3 ; 8). Calcule la pente.", en: "Points A(0 ; 2) et B(3 ; 8). Calculate la pente.", ar: "Points A(0 ; 2) et B(3 ; 8). احسب la pente.", fa: "Points A(0 ; 2) et B(3 ; 8). حساب کنید la pente.", ti: "Points A(0 ; 2) et B(3 ; 8). Calculate la pente.", uk: "Points A(0 ; 2) et B(3 ; 8). Обчисліть la pente.", pt: "Points A(0 ; 2) et B(3 ; 8). Calcule la pente.", so: "Points A(0 ; 2) et B(3 ; 8). Calculate la pente.", tr: "Points A(0 ; 2) et B(3 ; 8). Hesaplayın la pente.", ps: "Points A(0 ; 2) et B(3 ; 8). Calculate la pente." },
    "a11-6-ep02": { fr: "Points A(1 ; 4) et B(4 ; 10). Calcule la pente.", en: "Points A(1 ; 4) et B(4 ; 10). Calculate la pente.", ar: "Points A(1 ; 4) et B(4 ; 10). احسب la pente.", fa: "Points A(1 ; 4) et B(4 ; 10). حساب کنید la pente.", ti: "Points A(1 ; 4) et B(4 ; 10). Calculate la pente.", uk: "Points A(1 ; 4) et B(4 ; 10). Обчисліть la pente.", pt: "Points A(1 ; 4) et B(4 ; 10). Calcule la pente.", so: "Points A(1 ; 4) et B(4 ; 10). Calculate la pente.", tr: "Points A(1 ; 4) et B(4 ; 10). Hesaplayın la pente.", ps: "Points A(1 ; 4) et B(4 ; 10). Calculate la pente." },
    "a11-6-ep03": { fr: "Points A(0 ; 0) et B(3 ; 9). Calcule la pente.", en: "Points A(0 ; 0) et B(3 ; 9). Calculate la pente.", ar: "Points A(0 ; 0) et B(3 ; 9). احسب la pente.", fa: "Points A(0 ; 0) et B(3 ; 9). حساب کنید la pente.", ti: "Points A(0 ; 0) et B(3 ; 9). Calculate la pente.", uk: "Points A(0 ; 0) et B(3 ; 9). Обчисліть la pente.", pt: "Points A(0 ; 0) et B(3 ; 9). Calcule la pente.", so: "Points A(0 ; 0) et B(3 ; 9). Calculate la pente.", tr: "Points A(0 ; 0) et B(3 ; 9). Hesaplayın la pente.", ps: "Points A(0 ; 0) et B(3 ; 9). Calculate la pente." },
    "a11-6-ep04": { fr: "Points A(2 ; 3) et B(5 ; 9). Calcule la pente.", en: "Points A(2 ; 3) et B(5 ; 9). Calculate la pente.", ar: "Points A(2 ; 3) et B(5 ; 9). احسب la pente.", fa: "Points A(2 ; 3) et B(5 ; 9). حساب کنید la pente.", ti: "Points A(2 ; 3) et B(5 ; 9). Calculate la pente.", uk: "Points A(2 ; 3) et B(5 ; 9). Обчисліть la pente.", pt: "Points A(2 ; 3) et B(5 ; 9). Calcule la pente.", so: "Points A(2 ; 3) et B(5 ; 9). Calculate la pente.", tr: "Points A(2 ; 3) et B(5 ; 9). Hesaplayın la pente.", ps: "Points A(2 ; 3) et B(5 ; 9). Calculate la pente." },
    "a11-6-ep05": { fr: "Points A(1 ; 8) et B(4 ; 2). Calcule la pente.", en: "Points A(1 ; 8) et B(4 ; 2). Calculate la pente.", ar: "Points A(1 ; 8) et B(4 ; 2). احسب la pente.", fa: "Points A(1 ; 8) et B(4 ; 2). حساب کنید la pente.", ti: "Points A(1 ; 8) et B(4 ; 2). Calculate la pente.", uk: "Points A(1 ; 8) et B(4 ; 2). Обчисліть la pente.", pt: "Points A(1 ; 8) et B(4 ; 2). Calcule la pente.", so: "Points A(1 ; 8) et B(4 ; 2). Calculate la pente.", tr: "Points A(1 ; 8) et B(4 ; 2). Hesaplayın la pente.", ps: "Points A(1 ; 8) et B(4 ; 2). Calculate la pente." },
    "a11-6-ep06": { fr: "Points A(1 ; 2) et B(4 ; 11). Calcule la pente.", en: "Points A(1 ; 2) et B(4 ; 11). Calculate la pente.", ar: "Points A(1 ; 2) et B(4 ; 11). احسب la pente.", fa: "Points A(1 ; 2) et B(4 ; 11). حساب کنید la pente.", ti: "Points A(1 ; 2) et B(4 ; 11). Calculate la pente.", uk: "Points A(1 ; 2) et B(4 ; 11). Обчисліть la pente.", pt: "Points A(1 ; 2) et B(4 ; 11). Calcule la pente.", so: "Points A(1 ; 2) et B(4 ; 11). Calculate la pente.", tr: "Points A(1 ; 2) et B(4 ; 11). Hesaplayın la pente.", ps: "Points A(1 ; 2) et B(4 ; 11). Calculate la pente." },
    "a11-6-ep07": { fr: "Points A(0 ; −3) et B(4 ; 5). Calcule la pente.", en: "Points A(0 ; −3) et B(4 ; 5). Calculate la pente.", ar: "Points A(0 ; −3) et B(4 ; 5). احسب la pente.", fa: "Points A(0 ; −3) et B(4 ; 5). حساب کنید la pente.", ti: "Points A(0 ; −3) et B(4 ; 5). Calculate la pente.", uk: "Points A(0 ; −3) et B(4 ; 5). Обчисліть la pente.", pt: "Points A(0 ; −3) et B(4 ; 5). Calcule la pente.", so: "Points A(0 ; −3) et B(4 ; 5). Calculate la pente.", tr: "Points A(0 ; −3) et B(4 ; 5). Hesaplayın la pente.", ps: "Points A(0 ; −3) et B(4 ; 5). Calculate la pente." },
    "a11-6-ep08": { fr: "f(x) = 4x + 7. Quelle est l'ordonnée à l'origine ?", en: "f(x) = 4x + 7. What is l'ordonnée à l'origine ?", ar: "f(x) = 4x + 7. ما هي l'ordonnée à l'origine ?", fa: "f(x) = 4x + 7. چیست l'ordonnée à l'origine ?", ti: "f(x) = 4x + 7. What is l'ordonnée à l'origine ?", uk: "f(x) = 4x + 7. Яка l'ordonnée à l'origine ?", pt: "f(x) = 4x + 7. Qual é l'ordonnée à l'origine ?", so: "f(x) = 4x + 7. What is l'ordonnée à l'origine ?", tr: "f(x) = 4x + 7. Nedir l'ordonnée à l'origine ?", ps: "f(x) = 4x + 7. What is l'ordonnée à l'origine ?" },
    "a11-6-ep09": { fr: "f(x) = −5x + 3. Quel est le coefficient directeur ?", en: "f(x) = −5x + 3. What is le coefficient directeur ?", ar: "f(x) = −5x + 3. ما هو le coefficient directeur ?", fa: "f(x) = −5x + 3. چیست le coefficient directeur ?", ti: "f(x) = −5x + 3. What is le coefficient directeur ?", uk: "f(x) = −5x + 3. Який le coefficient directeur ?", pt: "f(x) = −5x + 3. Qual é le coefficient directeur ?", so: "f(x) = −5x + 3. What is le coefficient directeur ?", tr: "f(x) = −5x + 3. Nedir le coefficient directeur ?", ps: "f(x) = −5x + 3. What is le coefficient directeur ?" },
    "a11-6-ep10": { fr: "Points A(0 ; 8) et B(4 ; 0). Calcule la pente.", en: "Points A(0 ; 8) et B(4 ; 0). Calculate la pente.", ar: "Points A(0 ; 8) et B(4 ; 0). احسب la pente.", fa: "Points A(0 ; 8) et B(4 ; 0). حساب کنید la pente.", ti: "Points A(0 ; 8) et B(4 ; 0). Calculate la pente.", uk: "Points A(0 ; 8) et B(4 ; 0). Обчисліть la pente.", pt: "Points A(0 ; 8) et B(4 ; 0). Calcule la pente.", so: "Points A(0 ; 8) et B(4 ; 0). Calculate la pente.", tr: "Points A(0 ; 8) et B(4 ; 0). Hesaplayın la pente.", ps: "Points A(0 ; 8) et B(4 ; 0). Calculate la pente." },
    "a11-6-ep11": { fr: "Points A(2 ; 1) et B(5 ; 7). Calcule la pente.", en: "Points A(2 ; 1) et B(5 ; 7). Calculate la pente.", ar: "Points A(2 ; 1) et B(5 ; 7). احسب la pente.", fa: "Points A(2 ; 1) et B(5 ; 7). حساب کنید la pente.", ti: "Points A(2 ; 1) et B(5 ; 7). Calculate la pente.", uk: "Points A(2 ; 1) et B(5 ; 7). Обчисліть la pente.", pt: "Points A(2 ; 1) et B(5 ; 7). Calcule la pente.", so: "Points A(2 ; 1) et B(5 ; 7). Calculate la pente.", tr: "Points A(2 ; 1) et B(5 ; 7). Hesaplayın la pente.", ps: "Points A(2 ; 1) et B(5 ; 7). Calculate la pente." },
    "a11-6-ep12": { fr: "f(x) = 9x − 6. Quelle est l'ordonnée à l'origine ?", en: "f(x) = 9x − 6. What is l'ordonnée à l'origine ?", ar: "f(x) = 9x − 6. ما هي l'ordonnée à l'origine ?", fa: "f(x) = 9x − 6. چیست l'ordonnée à l'origine ?", ti: "f(x) = 9x − 6. What is l'ordonnée à l'origine ?", uk: "f(x) = 9x − 6. Яка l'ordonnée à l'origine ?", pt: "f(x) = 9x − 6. Qual é l'ordonnée à l'origine ?", so: "f(x) = 9x − 6. What is l'ordonnée à l'origine ?", tr: "f(x) = 9x − 6. Nedir l'ordonnée à l'origine ?", ps: "f(x) = 9x − 6. What is l'ordonnée à l'origine ?" },
  },
};
