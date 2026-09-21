import type { SubmoduleTrad } from "./trad-types";

const S = (fr: string, en: string, ar: string, fa: string, ti: string, uk: string, pt: string, so: string, tr: string, ps: string) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

const A = (fr: string[], en: string[], ar: string[], fa: string[], ti: string[], uk: string[], pt: string[], so: string[], tr: string[], ps: string[]) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

export const TRAD_A7_5: SubmoduleTrad = {
  submoduleId: "A7-5",
  title: S(
    "Valeur absolue",
    "Absolute value",
    "القيمة المطلقة",
    "قدر مطلق",
    "ፍጹም ዋጋ",
    "Абсолютне значення",
    "Valor absoluto",
    "Qiimaha mutlaq",
    "Mutlak değer",
    "مطلق ارزښت",
  ),
  blocks: [
    // 0 — heading "La valeur absolue" black:true
    {
      text: S(
        "La valeur absolue",
        "Absolute value",
        "القيمة المطلقة",
        "قدر مطلق",
        "ፍጹም ዋጋ",
        "Абсолютне значення",
        "O valor absoluto",
        "Qiimaha mutlaq",
        "Mutlak değer",
        "مطلق ارزښت",
      ),
    },

    // 1 — highlight "Définition"
    {
      text: S(
        "Définition",
        "Definition",
        "تعريف",
        "تعریف",
        "ትርጉም",
        "Визначення",
        "Definição",
        "Qeexid",
        "Tanım",
        "تعریف",
      ),
    },

    // 2 — section labelFr:"", 3 items about absolute value definition
    {
      label: S("", "", "", "", "", "", "", "", "", ""),
      items: A(
        [
          "La valeur absolue d'un nombre est sa **distance à 0** sur la droite numérique.",
          "Elle est **toujours positive** ou nulle.",
          "Notation : |a| (barres verticales autour du nombre).",
        ],
        [
          "The absolute value of a number is its **distance from 0** on the number line.",
          "It is **always positive** or zero.",
          "Notation: |a| (vertical bars around the number).",
        ],
        [
          "القيمة المطلقة لعدد هي **مسافته عن 0** على المستقيم العددي.",
          "هي **دائما موجبة** أو تساوي صفرا.",
          "الكتابة: |a| (خطّان عموديان حول العدد).",
        ],
        [
          "قدر مطلق یک عدد **فاصله آن تا 0** روی محور اعداد است.",
          "همیشه **مثبت** یا صفر است.",
          "نمادگذاری: |a| (دو خط عمودی دور عدد).",
        ],
        [
          "ፍጹም ዋጋ ናይ ቁጽሪ ኣብ መስመር ቁጽሪ **ርሕቀቱ ካብ 0** እዩ።",
          "ኩሉ ግዜ **ኣዎንታዊ** ወይ ዜሮ እዩ።",
          "ምልክት: |a| (ቀጥታዊ መስመራት ኣብ ዙርያ ቁጽሪ).",
        ],
        [
          "Абсолютне значення числа — це його **відстань від 0** на числовій прямій.",
          "Воно **завжди додатне** або дорівнює нулю.",
          "Позначення: |a| (вертикальні риски навколо числа).",
        ],
        [
          "O valor absoluto de um número é a sua **distância até 0** na reta numérica.",
          "É **sempre positivo** ou zero.",
          "Notação: |a| (barras verticais à volta do número).",
        ],
        [
          "Qiimaha mutlaq ee tiro waa **masaafaddeeda ilaa 0** ee xariiqda tirooyinka.",
          "Had iyo jeer waa **togan** ama eber.",
          "Qoraal: |a| (xariiqyo toosan oo ku wareegsan tirada).",
        ],
        [
          "Bir sayının mutlak değeri, sayı doğrusunda **0'a uzaklığıdır**.",
          "**Her zaman pozitiftir** veya sıfırdır.",
          "Gösterim: |a| (sayının etrafındaki dikey çizgiler).",
        ],
        [
          "د يو عدد مطلق ارزښت د عددونو پر کرښه له 0 څخه د هغه **واټن** دی.",
          "دا تل **مثبت** يا صفر وي.",
          "نښه: |a| (د عدد شاوخوا عمودي کرښې).",
        ],
      ),
    },

    // 3 — plain fr:"" — spacer
    {},

    // 4 — heading "Exemples" (no black)
    {
      text: S(
        "Exemples",
        "Examples",
        "أمثلة",
        "مثال‌ها",
        "ኣብነታት",
        "Приклади",
        "Exemplos",
        "Tusaalooyin",
        "Örnekler",
        "بېلګې",
      ),
    },

    // 5 — table headers:["Nombre","Valeur absolue","Explication"], rows with French "distance à 0" text
    {
      headers: {
        fr: ["Nombre", "Valeur absolue", "Explication"],
        en: ["Number", "Absolute value", "Explanation"],
        ar: ["العدد", "القيمة المطلقة", "الشرح"],
        fa: ["عدد", "قدر مطلق", "توضیح"],
        ti: ["ቁጽሪ", "ፍጹም ዋጋ", "መብርሂ"],
        uk: ["Число", "Абсолютне значення", "Пояснення"],
        pt: ["Número", "Valor absoluto", "Explicação"],
        so: ["Tiro", "Qiime mutlaq", "Sharaxaad"],
        tr: ["Sayı", "Mutlak değer", "Açıklama"],
        ps: ["عدد", "مطلق ارزښت", "تشريح"],
      },
      items: A(
        [
          "**−**5 | |**−**5| = 5 | distance à 0 = 5",
          "**+**5 | |**+**5| = 5 | distance à 0 = 5",
          "**−**3,7 | |**−**3,7| = 3,7 | distance à 0 = 3,7",
          "0 | |0| = 0 | distance à 0 = 0",
        ],
        [
          "**−**5 | |**−**5| = 5 | distance from 0 = 5",
          "**+**5 | |**+**5| = 5 | distance from 0 = 5",
          "**−**3.7 | |**−**3.7| = 3.7 | distance from 0 = 3.7",
          "0 | |0| = 0 | distance from 0 = 0",
        ],
        [
          "**−**5 | |**−**5| = 5 | المسافة إلى 0 = 5",
          "**+**5 | |**+**5| = 5 | المسافة إلى 0 = 5",
          "**−**3,7 | |**−**3,7| = 3,7 | المسافة إلى 0 = 3,7",
          "0 | |0| = 0 | المسافة إلى 0 = 0",
        ],
        [
          "**−**5 | |**−**5| = 5 | فاصله تا 0 = 5",
          "**+**5 | |**+**5| = 5 | فاصله تا 0 = 5",
          "**−**3,7 | |**−**3,7| = 3,7 | فاصله تا 0 = 3,7",
          "0 | |0| = 0 | فاصله تا 0 = 0",
        ],
        [
          "**−**5 | |**−**5| = 5 | ርሕቀት ካብ 0 = 5",
          "**+**5 | |**+**5| = 5 | ርሕቀት ካብ 0 = 5",
          "**−**3,7 | |**−**3,7| = 3,7 | ርሕቀት ካብ 0 = 3,7",
          "0 | |0| = 0 | ርሕቀት ካብ 0 = 0",
        ],
        [
          "**−**5 | |**−**5| = 5 | відстань від 0 = 5",
          "**+**5 | |**+**5| = 5 | відстань від 0 = 5",
          "**−**3,7 | |**−**3,7| = 3,7 | відстань від 0 = 3,7",
          "0 | |0| = 0 | відстань від 0 = 0",
        ],
        [
          "**−**5 | |**−**5| = 5 | distância até 0 = 5",
          "**+**5 | |**+**5| = 5 | distância até 0 = 5",
          "**−**3,7 | |**−**3,7| = 3,7 | distância até 0 = 3,7",
          "0 | |0| = 0 | distância até 0 = 0",
        ],
        [
          "**−**5 | |**−**5| = 5 | masaafada ilaa 0 = 5",
          "**+**5 | |**+**5| = 5 | masaafada ilaa 0 = 5",
          "**−**3,7 | |**−**3,7| = 3,7 | masaafada ilaa 0 = 3,7",
          "0 | |0| = 0 | masaafada ilaa 0 = 0",
        ],
        [
          "**−**5 | |**−**5| = 5 | 0'a uzaklık = 5",
          "**+**5 | |**+**5| = 5 | 0'a uzaklık = 5",
          "**−**3,7 | |**−**3,7| = 3,7 | 0'a uzaklık = 3,7",
          "0 | |0| = 0 | 0'a uzaklık = 0",
        ],
        [
          "**−**5 | |**−**5| = 5 | له 0 واټن = 5",
          "**+**5 | |**+**5| = 5 | له 0 واټن = 5",
          "**−**3,7 | |**−**3,7| = 3,7 | له 0 واټن = 3,7",
          "0 | |0| = 0 | له 0 واټن = 0",
        ],
      ),
    },

    // 6 — plain fr:"" — spacer
    {},

    // 7 — note "−8 et +8 ont la même valeur absolue (8)..."
    {
      text: S(
        "−8 et +8 ont la même valeur absolue (8) : ils sont à égale distance de 0. Ce sont des opposés.",
        "−8 and +8 have the same absolute value (8): they are at the same distance from 0. They are opposites.",
        "−8 و +8 لهما القيمة المطلقة نفسها (8): هما على المسافة نفسها من 0. إنهما عددان متعاكسان.",
        "−8 و +8 قدر مطلق یکسانی دارند (8): از 0 فاصله برابر دارند. آن‌ها قرینه هم هستند.",
        "−8 እና +8 ሓደ ዓይነት ፍጹም ዋጋ (8) ኣለዎም፡ ካብ 0 ማዕረ ርሕቀት ኣለዎም። ተጻራሪ ቁጽርታት እዮም።",
        "−8 і +8 мають однакове абсолютне значення (8): вони на однаковій відстані від 0. Це протилежні числа.",
        "−8 e +8 têm o mesmo valor absoluto (8): estão à mesma distância de 0. São opostos.",
        "−8 iyo +8 waxay leeyihiin qiime mutlaq isku mid ah (8): waxay 0 uga jiraan masaafad isku mid ah. Waa laba tiro oo is lid ah.",
        "−8 ve +8 aynı mutlak değere (8) sahiptir: 0'a eşit uzaklıktadırlar. Bunlar ters sayılardır.",
        "−8 او +8 يو شان مطلق ارزښت لري (8): له 0 څخه برابر واټن لري. دا مقابل عددونه دي.",
      ),
    },
  ],
  consignes: {
    "a7-5-ep01": { fr: "Calculez |−5|.", en: "Calculate |−5|.", ar: "احسب |−5|.", fa: "حساب کنید |−5|.", ti: "Calculate |−5|.", uk: "Обчисліть |−5|.", pt: "Calcule |−5|.", so: "Calculate |−5|.", tr: "Hesaplayın |−5|.", ps: "Calculate |−5|." },
    "a7-5-ep02": { fr: "Calculez |+8|.", en: "Calculate |+8|.", ar: "احسب |+8|.", fa: "حساب کنید |+8|.", ti: "Calculate |+8|.", uk: "Обчисліть |+8|.", pt: "Calcule |+8|.", so: "Calculate |+8|.", tr: "Hesaplayın |+8|.", ps: "Calculate |+8|." },
    "a7-5-ep03": { fr: "Calculez |−3,7|.", en: "Calculate |−3,7|.", ar: "احسب |−3,7|.", fa: "حساب کنید |−3,7|.", ti: "Calculate |−3,7|.", uk: "Обчисліть |−3,7|.", pt: "Calcule |−3,7|.", so: "Calculate |−3,7|.", tr: "Hesaplayın |−3,7|.", ps: "Calculate |−3,7|." },
    "a7-5-ep04": { fr: "Quel nombre a la même valeur absolue que −12 ?", en: "Quel nombre a la même valeur absolue que −12 ?", ar: "Quel nombre a la même valeur absolue que −12 ?", fa: "Quel nombre a la même valeur absolue que −12 ?", ti: "Quel nombre a la même valeur absolue que −12 ?", uk: "Quel nombre a la même valeur absolue que −12 ?", pt: "Quel nombre a la même valeur absolue que −12 ?", so: "Quel nombre a la même valeur absolue que −12 ?", tr: "Quel nombre a la même valeur absolue que −12 ?", ps: "Quel nombre a la même valeur absolue que −12 ?" },
    "a7-5-ep05": { fr: "Calculez |0|.", en: "Calculate |0|.", ar: "احسب |0|.", fa: "حساب کنید |0|.", ti: "Calculate |0|.", uk: "Обчисліть |0|.", pt: "Calcule |0|.", so: "Calculate |0|.", tr: "Hesaplayın |0|.", ps: "Calculate |0|." },
    "a7-5-ep06": { fr: "Calculez |−100|.", en: "Calculate |−100|.", ar: "احسب |−100|.", fa: "حساب کنید |−100|.", ti: "Calculate |−100|.", uk: "Обчисліть |−100|.", pt: "Calcule |−100|.", so: "Calculate |−100|.", tr: "Hesaplayın |−100|.", ps: "Calculate |−100|." },
    "a7-5-ep07": { fr: "Calculez |+7|.", en: "Calculate |+7|.", ar: "احسب |+7|.", fa: "حساب کنید |+7|.", ti: "Calculate |+7|.", uk: "Обчисліть |+7|.", pt: "Calcule |+7|.", so: "Calculate |+7|.", tr: "Hesaplayın |+7|.", ps: "Calculate |+7|." },
    "a7-5-ep08": { fr: "Est-ce que |−9| = |+9| ? Répondez oui ou non.", en: "Est-ce que |−9| = |+9| ? Répondez oui ou non.", ar: "Est-ce que |−9| = |+9| ? Répondez oui ou non.", fa: "Est-ce que |−9| = |+9| ? Répondez oui ou non.", ti: "Est-ce que |−9| = |+9| ? Répondez oui ou non.", uk: "Est-ce que |−9| = |+9| ? Répondez oui ou non.", pt: "Est-ce que |−9| = |+9| ? Répondez oui ou non.", so: "Est-ce que |−9| = |+9| ? Répondez oui ou non.", tr: "Est-ce que |−9| = |+9| ? Répondez oui ou non.", ps: "Est-ce que |−9| = |+9| ? Répondez oui ou non." },
    "a7-5-ep09": { fr: "Calculez |−15|.", en: "Calculate |−15|.", ar: "احسب |−15|.", fa: "حساب کنید |−15|.", ti: "Calculate |−15|.", uk: "Обчисліть |−15|.", pt: "Calcule |−15|.", so: "Calculate |−15|.", tr: "Hesaplayın |−15|.", ps: "Calculate |−15|." },
    "a7-5-ep10": { fr: "Quel nombre entier a la même valeur absolue que −4 ?", en: "Quel nombre entier a la même valeur absolue que −4 ?", ar: "Quel nombre entier a la même valeur absolue que −4 ?", fa: "Quel nombre entier a la même valeur absolue que −4 ?", ti: "Quel nombre entier a la même valeur absolue que −4 ?", uk: "Quel nombre entier a la même valeur absolue que −4 ?", pt: "Quel nombre entier a la même valeur absolue que −4 ?", so: "Quel nombre entier a la même valeur absolue que −4 ?", tr: "Quel nombre entier a la même valeur absolue que −4 ?", ps: "Quel nombre entier a la même valeur absolue que −4 ?" },
    "a7-5-ep11": { fr: "Calculez |−2,5|.", en: "Calculate |−2,5|.", ar: "احسب |−2,5|.", fa: "حساب کنید |−2,5|.", ti: "Calculate |−2,5|.", uk: "Обчисліть |−2,5|.", pt: "Calcule |−2,5|.", so: "Calculate |−2,5|.", tr: "Hesaplayın |−2,5|.", ps: "Calculate |−2,5|." },
    "a7-5-ep12": { fr: "La valeur absolue d'un nombre est-elle toujours positive ? (oui/non)", en: "La valeur absolue d'un nombre est-elle toujours positive ? (yes/no)", ar: "La valeur absolue d'un nombre est-elle toujours positive ? (نعم/لا)", fa: "La valeur absolue d'un nombre est-elle toujours positive ? (بله/خیر)", ti: "La valeur absolue d'un nombre est-elle toujours positive ? (yes/no)", uk: "La valeur absolue d'un nombre est-elle toujours positive ? (так/ні)", pt: "La valeur absolue d'un nombre est-elle toujours positive ? (sim/não)", so: "La valeur absolue d'un nombre est-elle toujours positive ? (yes/no)", tr: "La valeur absolue d'un nombre est-elle toujours positive ? (evet/hayır)", ps: "La valeur absolue d'un nombre est-elle toujours positive ? (yes/no)" },
  },
};
