import type { SubmoduleTrad } from "./trad-types";

export const TRAD_A11_7: SubmoduleTrad = {
  submoduleId: "A11-7",
  title: {
    fr: "Lecture graphique",
    en: "Reading graphs",
    ar: "قراءة الرسوم البيانية",
    fa: "خواندن نمودار",
    ti: "ናይ ስዕሊ ምንባብ",
    uk: "Читання графіків",
  },
  blocks: [
    {
      text: {
        fr: "Lire un graphique sans calculer",
      }
    },
    {
      text: {
        fr: "La lecture graphique permet d'extraire des informations directement depuis une courbe, sans effectuer de calcul algébrique.",
      }
    },
    {
      text: {
        fr: "Deux opérations fondamentales",
      }
    },
    {
      text: {
        fr: "Trouver f(a) : image d'un x donné",
      }
    },
    {
      items: {
        fr: [
            "1. Repérer la valeur a sur l'axe x",
            "2. Monter verticalement jusqu'à la courbe",
            "3. Lire la valeur y correspondante sur l'axe y",
          ],
      }
    },
    {
      text: {
        fr: "Trouver x tel que f(x) = k",
      }
    },
    {
      items: {
        fr: [
            "1. Repérer la valeur k sur l'axe y",
            "2. Aller horizontalement jusqu'à la courbe",
            "3. Lire la valeur x correspondante sur l'axe x",
          ],
      }
    },
    {
      text: {
        fr: "Identifier les points clés d'un graphique",
      }
    },
    {
      headers: {
        fr: ["Point / Intersection", "Signification", "Méthode de lecture"],
      }
    },
    {
      text: {
        fr: "Croissance et décroissance",
      }
    },
    {
      label: {
        fr: "Sur un graphique :",
      },
      items: {
        fr: [
            "**Croissante** : la courbe monte de gauche à droite (y augmente quand x augmente)",
            "**Décroissante** : la courbe descend de gauche à droite (y diminue quand x augmente)",
            "**Constante** : la courbe est horizontale (y ne change pas)",
          ],
      }
    },
    {
      text: {
        fr: "f(x) = 2x + 1\n• f(3) = ? → monter depuis x=3 jusqu'à la droite → lire y = 7\n• f(x) = 5 pour x = ? → partir de y=5 → aller jusqu'à la droite → lire x = 2\n• Intersection avec axe x : f(x) = 0 → x = −0,5",
      }
    },
  ],
  consignes: {
    "a11-7-ep01": { fr: "f(x) = 3x + 3. Calcule f(4).", en: "f(x) = 3x + 3. Calculate f(4).", ar: "f(x) = 3x + 3. احسب f(4).", fa: "f(x) = 3x + 3. حساب کنید f(4).", ti: "f(x) = 3x + 3. Calculate f(4).", uk: "f(x) = 3x + 3. Обчисліть f(4).", pt: "f(x) = 3x + 3. Calcule f(4).", so: "f(x) = 3x + 3. Calculate f(4).", tr: "f(x) = 3x + 3. Hesaplayın f(4).", ps: "f(x) = 3x + 3. Calculate f(4)." },
    "a11-7-ep02": { fr: "f(x) = 3x + 3. Pour quelle valeur de x est-ce que f(x) = 12 ?", en: "f(x) = 3x + 3. Pour quelle valeur de x est-ce que f(x) = 12 ?", ar: "f(x) = 3x + 3. Pour quelle valeur de x est-ce que f(x) = 12 ?", fa: "f(x) = 3x + 3. Pour quelle valeur de x est-ce que f(x) = 12 ?", ti: "f(x) = 3x + 3. Pour quelle valeur de x est-ce que f(x) = 12 ?", uk: "f(x) = 3x + 3. Pour quelle valeur de x est-ce que f(x) = 12 ?", pt: "f(x) = 3x + 3. Pour quelle valeur de x est-ce que f(x) = 12 ?", so: "f(x) = 3x + 3. Pour quelle valeur de x est-ce que f(x) = 12 ?", tr: "f(x) = 3x + 3. Pour quelle valeur de x est-ce que f(x) = 12 ?", ps: "f(x) = 3x + 3. Pour quelle valeur de x est-ce que f(x) = 12 ?" },
    "a11-7-ep03": { fr: "f(x) = 4x − 8. Quelle est l'abscisse à l'origine (f(x) = 0) ?", en: "f(x) = 4x − 8. What is l'abscisse à l'origine (f(x) = 0) ?", ar: "f(x) = 4x − 8. ما هي l'abscisse à l'origine (f(x) = 0) ?", fa: "f(x) = 4x − 8. چیست l'abscisse à l'origine (f(x) = 0) ?", ti: "f(x) = 4x − 8. What is l'abscisse à l'origine (f(x) = 0) ?", uk: "f(x) = 4x − 8. Яка l'abscisse à l'origine (f(x) = 0) ?", pt: "f(x) = 4x − 8. Qual é l'abscisse à l'origine (f(x) = 0) ?", so: "f(x) = 4x − 8. What is l'abscisse à l'origine (f(x) = 0) ?", tr: "f(x) = 4x − 8. Nedir l'abscisse à l'origine (f(x) = 0) ?", ps: "f(x) = 4x − 8. What is l'abscisse à l'origine (f(x) = 0) ?" },
    "a11-7-ep04": { fr: "f(x) = x + 5. Pour quelle valeur de x est-ce que f(x) = 11 ?", en: "f(x) = x + 5. Pour quelle valeur de x est-ce que f(x) = 11 ?", ar: "f(x) = x + 5. Pour quelle valeur de x est-ce que f(x) = 11 ?", fa: "f(x) = x + 5. Pour quelle valeur de x est-ce que f(x) = 11 ?", ti: "f(x) = x + 5. Pour quelle valeur de x est-ce que f(x) = 11 ?", uk: "f(x) = x + 5. Pour quelle valeur de x est-ce que f(x) = 11 ?", pt: "f(x) = x + 5. Pour quelle valeur de x est-ce que f(x) = 11 ?", so: "f(x) = x + 5. Pour quelle valeur de x est-ce que f(x) = 11 ?", tr: "f(x) = x + 5. Pour quelle valeur de x est-ce que f(x) = 11 ?", ps: "f(x) = x + 5. Pour quelle valeur de x est-ce que f(x) = 11 ?" },
    "a11-7-ep05": { fr: "f(x) = 3x − 9. Quelle est l'abscisse à l'origine ?", en: "f(x) = 3x − 9. What is l'abscisse à l'origine ?", ar: "f(x) = 3x − 9. ما هي l'abscisse à l'origine ?", fa: "f(x) = 3x − 9. چیست l'abscisse à l'origine ?", ti: "f(x) = 3x − 9. What is l'abscisse à l'origine ?", uk: "f(x) = 3x − 9. Яка l'abscisse à l'origine ?", pt: "f(x) = 3x − 9. Qual é l'abscisse à l'origine ?", so: "f(x) = 3x − 9. What is l'abscisse à l'origine ?", tr: "f(x) = 3x − 9. Nedir l'abscisse à l'origine ?", ps: "f(x) = 3x − 9. What is l'abscisse à l'origine ?" },
    "a11-7-ep06": { fr: "f(x) = −x + 8. Pour quelle valeur de x est-ce que f(x) = 0 ?", en: "f(x) = −x + 8. Pour quelle valeur de x est-ce que f(x) = 0 ?", ar: "f(x) = −x + 8. Pour quelle valeur de x est-ce que f(x) = 0 ?", fa: "f(x) = −x + 8. Pour quelle valeur de x est-ce que f(x) = 0 ?", ti: "f(x) = −x + 8. Pour quelle valeur de x est-ce que f(x) = 0 ?", uk: "f(x) = −x + 8. Pour quelle valeur de x est-ce que f(x) = 0 ?", pt: "f(x) = −x + 8. Pour quelle valeur de x est-ce que f(x) = 0 ?", so: "f(x) = −x + 8. Pour quelle valeur de x est-ce que f(x) = 0 ?", tr: "f(x) = −x + 8. Pour quelle valeur de x est-ce que f(x) = 0 ?", ps: "f(x) = −x + 8. Pour quelle valeur de x est-ce que f(x) = 0 ?" },
    "a11-7-ep07": { fr: "f(x) = 2x + 6. Quelle est l'ordonnée à l'origine ?", en: "f(x) = 2x + 6. What is l'ordonnée à l'origine ?", ar: "f(x) = 2x + 6. ما هي l'ordonnée à l'origine ?", fa: "f(x) = 2x + 6. چیست l'ordonnée à l'origine ?", ti: "f(x) = 2x + 6. What is l'ordonnée à l'origine ?", uk: "f(x) = 2x + 6. Яка l'ordonnée à l'origine ?", pt: "f(x) = 2x + 6. Qual é l'ordonnée à l'origine ?", so: "f(x) = 2x + 6. What is l'ordonnée à l'origine ?", tr: "f(x) = 2x + 6. Nedir l'ordonnée à l'origine ?", ps: "f(x) = 2x + 6. What is l'ordonnée à l'origine ?" },
    "a11-7-ep08": { fr: "f(x) = 4x + 4. Pour quelle valeur de x est-ce que f(x) = 16 ?", en: "f(x) = 4x + 4. Pour quelle valeur de x est-ce que f(x) = 16 ?", ar: "f(x) = 4x + 4. Pour quelle valeur de x est-ce que f(x) = 16 ?", fa: "f(x) = 4x + 4. Pour quelle valeur de x est-ce que f(x) = 16 ?", ti: "f(x) = 4x + 4. Pour quelle valeur de x est-ce que f(x) = 16 ?", uk: "f(x) = 4x + 4. Pour quelle valeur de x est-ce que f(x) = 16 ?", pt: "f(x) = 4x + 4. Pour quelle valeur de x est-ce que f(x) = 16 ?", so: "f(x) = 4x + 4. Pour quelle valeur de x est-ce que f(x) = 16 ?", tr: "f(x) = 4x + 4. Pour quelle valeur de x est-ce que f(x) = 16 ?", ps: "f(x) = 4x + 4. Pour quelle valeur de x est-ce que f(x) = 16 ?" },
    "a11-7-ep09": { fr: "f(x) = −3x + 9. Pour quelle valeur de x est-ce que f(x) = 0 ?", en: "f(x) = −3x + 9. Pour quelle valeur de x est-ce que f(x) = 0 ?", ar: "f(x) = −3x + 9. Pour quelle valeur de x est-ce que f(x) = 0 ?", fa: "f(x) = −3x + 9. Pour quelle valeur de x est-ce que f(x) = 0 ?", ti: "f(x) = −3x + 9. Pour quelle valeur de x est-ce que f(x) = 0 ?", uk: "f(x) = −3x + 9. Pour quelle valeur de x est-ce que f(x) = 0 ?", pt: "f(x) = −3x + 9. Pour quelle valeur de x est-ce que f(x) = 0 ?", so: "f(x) = −3x + 9. Pour quelle valeur de x est-ce que f(x) = 0 ?", tr: "f(x) = −3x + 9. Pour quelle valeur de x est-ce que f(x) = 0 ?", ps: "f(x) = −3x + 9. Pour quelle valeur de x est-ce que f(x) = 0 ?" },
    "a11-7-ep10": { fr: "f(x) = 6x − 12. Quelle est l'abscisse à l'origine ?", en: "f(x) = 6x − 12. What is l'abscisse à l'origine ?", ar: "f(x) = 6x − 12. ما هي l'abscisse à l'origine ?", fa: "f(x) = 6x − 12. چیست l'abscisse à l'origine ?", ti: "f(x) = 6x − 12. What is l'abscisse à l'origine ?", uk: "f(x) = 6x − 12. Яка l'abscisse à l'origine ?", pt: "f(x) = 6x − 12. Qual é l'abscisse à l'origine ?", so: "f(x) = 6x − 12. What is l'abscisse à l'origine ?", tr: "f(x) = 6x − 12. Nedir l'abscisse à l'origine ?", ps: "f(x) = 6x − 12. What is l'abscisse à l'origine ?" },
    "a11-7-ep11": { fr: "f(x) = 2x − 6. Pour quelle valeur de x est-ce que f(x) = 8 ?", en: "f(x) = 2x − 6. Pour quelle valeur de x est-ce que f(x) = 8 ?", ar: "f(x) = 2x − 6. Pour quelle valeur de x est-ce que f(x) = 8 ?", fa: "f(x) = 2x − 6. Pour quelle valeur de x est-ce que f(x) = 8 ?", ti: "f(x) = 2x − 6. Pour quelle valeur de x est-ce que f(x) = 8 ?", uk: "f(x) = 2x − 6. Pour quelle valeur de x est-ce que f(x) = 8 ?", pt: "f(x) = 2x − 6. Pour quelle valeur de x est-ce que f(x) = 8 ?", so: "f(x) = 2x − 6. Pour quelle valeur de x est-ce que f(x) = 8 ?", tr: "f(x) = 2x − 6. Pour quelle valeur de x est-ce que f(x) = 8 ?", ps: "f(x) = 2x − 6. Pour quelle valeur de x est-ce que f(x) = 8 ?" },
    "a11-7-ep12": { fr: "f(x) = 5x + 5. Quelle est l'ordonnée à l'origine ?", en: "f(x) = 5x + 5. What is l'ordonnée à l'origine ?", ar: "f(x) = 5x + 5. ما هي l'ordonnée à l'origine ?", fa: "f(x) = 5x + 5. چیست l'ordonnée à l'origine ?", ti: "f(x) = 5x + 5. What is l'ordonnée à l'origine ?", uk: "f(x) = 5x + 5. Яка l'ordonnée à l'origine ?", pt: "f(x) = 5x + 5. Qual é l'ordonnée à l'origine ?", so: "f(x) = 5x + 5. What is l'ordonnée à l'origine ?", tr: "f(x) = 5x + 5. Nedir l'ordonnée à l'origine ?", ps: "f(x) = 5x + 5. What is l'ordonnée à l'origine ?" },
  },
};
