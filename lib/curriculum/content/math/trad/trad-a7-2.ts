import type { SubmoduleTrad } from "./trad-types";

const S = (fr: string, en: string, ar: string, fa: string, ti: string, uk: string, pt: string, so: string, tr: string, ps: string) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

export const TRAD_A7_2: SubmoduleTrad = {
  submoduleId: "A7-2",
  title: S(
    "Comparer les relatifs",
    "Comparing relative numbers",
    "مقارنة الأعداد النسبية",
    "مقایسه عددهای نسبی",
    "ተዛማዲ ቁጽርታት ምውድዳር",
    "Порівняння відносних чисел",
    "Comparar números relativos",
    "Isbarbardhigga tirooyinka xiriirka leh",
    "İşaretli sayıları karşılaştırma",
    "د نسبي عددونو پرتله",
  ),
  blocks: [
    // 0 — heading "Comparer deux nombres relatifs" black:true
    { text: S(
      "Comparer deux nombres relatifs",
      "Comparing two relative numbers",
      "مقارنة عددين نسبيين",
      "مقایسه دو عدد نسبی",
      "ክልተ ተዛማዲ ቁጽርታት ምውድዳር",
      "Порівняння двох відносних чисел",
      "Comparar dois números relativos",
      "Isbarbardhigga laba tiro oo xiriir leh",
      "İki işaretli sayıyı karşılaştırma",
      "د دوو نسبي عددونو پرتله",
    ) },

    // 1 — plain "**1.** Tout nombre négatif est toujours plus petit qu'un nombre positif."
    { text: S(
      "**1.** Tout nombre négatif est toujours plus petit qu'un nombre positif.",
      "**1.** Any negative number is always smaller than a positive number.",
      "**1.** كل عدد سالب أصغر دائما من عدد موجب.",
      "**1.** هر عدد منفی همیشه از عدد مثبت کوچک تر است.",
      "**1.** ዝኾነ ኣሉታዊ ቁጽሪ ካብ ኣዎንታዊ ቁጽሪ ኩሉ ግዜ ይንእስ።",
      "**1.** Будь-яке від'ємне число завжди менше за додатне.",
      "**1.** Qualquer número negativo é sempre menor que um número positivo.",
      "**1.** Tiro kasta oo taban had iyo jeer way ka yar tahay tiro togan.",
      "**1.** Her negatif sayı, her zaman pozitif bir sayıdan küçüktür.",
      "**1.** هر منفي عدد تل له مثبت عدد څخه کوچنی وي.",
    ) },

    // 2 — plain "**2.** Entre deux négatifs : le plus grand est le plus proche de 0."
    { text: S(
      "**2.** Entre deux négatifs : le plus grand est le plus proche de 0.",
      "**2.** Between two negatives: the greater one is the closest to 0.",
      "**2.** بين عددين سالبين: الأكبر هو الأقرب إلى 0.",
      "**2.** بین دو عدد منفی: عدد بزرگ تر به 0 نزدیک تر است.",
      "**2.** ኣብ መንጎ ክልተ ኣሉታዊ ቁጽርታት፡ እቲ ዝዓቢ ናብ 0 ዝቐረበ እዩ።",
      "**2.** Між двома від'ємними: більше те, що ближче до 0.",
      "**2.** Entre dois negativos: o maior é o mais próximo de 0.",
      "**2.** Labada tiro ee taban dhexdooda, tan weyn waa tan 0 ugu dhow.",
      "**2.** İki negatif sayı arasında büyük olan 0'a daha yakındır.",
      "**2.** د دوو منفي عددونو ترمنځ، لوی عدد هغه دی چې 0 ته نږدې وي.",
    ) },

    // 3 — plain "" spacer
    {},

    // 4 — heading "Exemples" (no black)
    { text: S("Exemples", "Examples", "أمثلة", "مثال ها", "ኣብነታት", "Приклади", "Exemplos", "Tusaalooyin", "Örnekler", "بېلګې") },

    // 5 — table headers ["Nombre A","","Nombre B","Raison"] — "Raison" column has French text
    {
      headers: {
        fr: ["Nombre A", "", "Nombre B", "Raison"],
        en: ["Number A", "", "Number B", "Reason"],
        ar: ["العدد أ", "", "العدد ب", "السبب"],
        fa: ["عدد الف", "", "عدد ب", "دلیل"],
        ti: ["ቁጽሪ A", "", "ቁጽሪ B", "ምኽንያት"],
        uk: ["Число A", "", "Число B", "Причина"],
        pt: ["Número A", "", "Número B", "Razão"],
        so: ["Tiro A", "", "Tiro B", "Sabab"],
        tr: ["Sayı A", "", "Sayı B", "Sebep"],
        ps: ["عدد A", "", "عدد B", "دليل"],
      },
      items: {
        fr: [
          "**−**2 | **<** | +3 | négatif **<** positif",
          "**−**452 | **<** | +1 | négatif **<** positif",
          "**−**5 | **<** | **−**2 | **−**2 est plus proche de 0",
          "**−**517 | **<** | **−**14 | **−**14 est plus proche de 0",
        ],
        en: [
          "**−**2 | **<** | +3 | negative **<** positive",
          "**−**452 | **<** | +1 | negative **<** positive",
          "**−**5 | **<** | **−**2 | **−**2 is closer to 0",
          "**−**517 | **<** | **−**14 | **−**14 is closer to 0",
        ],
        ar: [
          "**−**2 | **<** | +3 | سالب **<** موجب",
          "**−**452 | **<** | +1 | سالب **<** موجب",
          "**−**5 | **<** | **−**2 | **−**2 أقرب إلى 0",
          "**−**517 | **<** | **−**14 | **−**14 أقرب إلى 0",
        ],
        fa: [
          "**−**2 | **<** | +3 | منفی **<** مثبت",
          "**−**452 | **<** | +1 | منفی **<** مثبت",
          "**−**5 | **<** | **−**2 | **−**2 به 0 نزدیک تر است",
          "**−**517 | **<** | **−**14 | **−**14 به 0 نزدیک تر است",
        ],
        ti: [
          "**−**2 | **<** | +3 | ኣሉታዊ **<** ኣዎንታዊ",
          "**−**452 | **<** | +1 | ኣሉታዊ **<** ኣዎንታዊ",
          "**−**5 | **<** | **−**2 | **−**2 ናብ 0 ዝቐረበ እዩ",
          "**−**517 | **<** | **−**14 | **−**14 ናብ 0 ዝቐረበ እዩ",
        ],
        uk: [
          "**−**2 | **<** | +3 | від'ємне **<** додатне",
          "**−**452 | **<** | +1 | від'ємне **<** додатне",
          "**−**5 | **<** | **−**2 | **−**2 ближче до 0",
          "**−**517 | **<** | **−**14 | **−**14 ближче до 0",
        ],
        pt: [
          "**−**2 | **<** | +3 | negativo **<** positivo",
          "**−**452 | **<** | +1 | negativo **<** positivo",
          "**−**5 | **<** | **−**2 | **−**2 está mais perto de 0",
          "**−**517 | **<** | **−**14 | **−**14 está mais perto de 0",
        ],
        so: [
          "**−**2 | **<** | +3 | taban **<** togan",
          "**−**452 | **<** | +1 | taban **<** togan",
          "**−**5 | **<** | **−**2 | **−**2 waa 0 ugu dhow",
          "**−**517 | **<** | **−**14 | **−**14 waa 0 ugu dhow",
        ],
        tr: [
          "**−**2 | **<** | +3 | negatif **<** pozitif",
          "**−**452 | **<** | +1 | negatif **<** pozitif",
          "**−**5 | **<** | **−**2 | **−**2, 0'a daha yakın",
          "**−**517 | **<** | **−**14 | **−**14, 0'a daha yakın",
        ],
        ps: [
          "**−**2 | **<** | +3 | منفي **<** مثبت",
          "**−**452 | **<** | +1 | منفي **<** مثبت",
          "**−**5 | **<** | **−**2 | **−**2 د 0 ته نږدې دی",
          "**−**517 | **<** | **−**14 | **−**14 د 0 ته نږدې دی",
        ],
      },
    },

    // 6 — plain "" spacer
    {},

    // 7 — heading "Sur la droite numérique" black:true
    { text: S(
      "Sur la droite numérique",
      "On the number line",
      "على المستقيم العددي",
      "روی محور اعداد",
      "ኣብ መስመር ቁጽሪ",
      "На числовій прямій",
      "Na reta numérica",
      "Xariiqda tirooyinka dusheeda",
      "Sayı doğrusu üzerinde",
      "د عددونو پر کرښه",
    ) },

    // 8 — svg noFrame, no captionFr
    {},

    // 9 — plain "Un nombre est **plus grand** que tous les nombres à sa gauche."
    { text: S(
      "Un nombre est **plus grand** que tous les nombres à sa gauche.",
      "A number is **greater** than all numbers to its left.",
      "العدد **أكبر** من كل الأعداد الموجودة على يساره.",
      "یک عدد از همه عددهای سمت چپ خود **بزرگ تر** است.",
      "ቁጽሪ ካብ ኩሎም ብጸጋሙ ዘለዉ ቁጽርታት **ይዓቢ**።",
      "Число **більше** за всі числа ліворуч від нього.",
      "Um número é **maior** que todos os números à sua esquerda.",
      "Tiro waxay ka **weyn** tahay dhammaan tirooyinka bidixdeeda yaal.",
      "Bir sayı, solundaki tüm sayılardan **büyüktür**.",
      "يو عدد د خپل کيڼ لوري له ټولو عددونو څخه **لوی** دی.",
    ) },

    // 10 — plain "Un nombre est **plus petit** que tous les nombres à sa droite."
    { text: S(
      "Un nombre est **plus petit** que tous les nombres à sa droite.",
      "A number is **smaller** than all numbers to its right.",
      "العدد **أصغر** من كل الأعداد الموجودة على يمينه.",
      "یک عدد از همه عددهای سمت راست خود **کوچک تر** است.",
      "ቁጽሪ ካብ ኩሎም ብየማኑ ዘለዉ ቁጽርታት **ይንእስ**።",
      "Число **менше** за всі числа праворуч від нього.",
      "Um número é **menor** que todos os números à sua direita.",
      "Tiro waxay ka **yar** tahay dhammaan tirooyinka midigteeda yaal.",
      "Bir sayı, sağındaki tüm sayılardan **küçüktür**.",
      "يو عدد د خپل ښي لوري له ټولو عددونو څخه **کوچنی** دی.",
    ) },
  ],
};
