import type { SubmoduleTrad } from "./trad-types";

const S = (fr: string, en: string, ar: string, fa: string, ti: string, uk: string, pt: string, so: string, tr: string, ps: string) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

const A = (fr: string[], en: string[], ar: string[], fa: string[], ti: string[], uk: string[], pt: string[], so: string[], tr: string[], ps: string[]) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

export const TRAD_G4_1: SubmoduleTrad = {
  submoduleId: "G4-1",
  title: S(
    "Aire du carré",
    "Area of a square",
    "مساحة المربع",
    "مساحت مربع",
    "ናይ ካሬ ሰፊሓ",
    "Площа квадрата",
    "Área do quadrado",
    "Aagga wareegga",
    "Karenin alanı",
    "د مربع مساحت"
  ),
  blocks: [
    // 0 — heading "Qu'est-ce que l'aire ?" (black)
    { text: S(
      "Qu'est-ce que l'aire ?",
      "What is area?",
      "ما هي المساحة؟",
      "مساحت چیست؟",
      "ሰፊሓ ምንታይ ዩ?",
      "Що таке площа?",
      "O que é a área?",
      "Aaggu maxay tahay?",
      "Alan nedir?",
      "مساحت څه ده؟"
    ) },

    // 1 — plain
    { text: S(
      "L'**aire** mesure la **surface intérieure** d'une figure. Elle s'exprime en unités carrées : cm², m², km²…",
      "**Area** measures the **interior surface** of a figure. It is expressed in square units: cm², m², km²…",
      "**المساحة** تقيس **السطح الداخلي** للشكل. تُعبر عنها بوحدات مربعة: سم²، م²، كم²…",
      "**مساحت** **سطح داخلی** یک شکل را اندازه می‌گیرد. با واحدهای مربعی بیان می‌شود: سم²، م²، کم²…",
      "**ሰፊሓ** ናይ ቅርጺ **ውሽጠ ሰፊሕ** ዝሕሰብ ዩ. ብካሬ ኣሃዙ ዝቀርብ: ሰም²، ም²، ክም²…",
      "**Площа** вимірює **внутрішню поверхню** фігури. Виражається в квадратних одиницях: см², м², км²…",
      "A **área** mede a **superfície interior** de uma figura. Expressa-se em unidades quadradas: cm², m², km²…",
      "**Aaggu** wuxuu cabbiraa **dushaha gudaha** ee qaab. Waxa lagu muujiyaa cutubbo laba jibbaaran: cm², m², km²…",
      "**Alan**, bir şeklin **iç yüzeyini** ölçer. Kare birimler ile ifade edilir: cm², m², km²…",
      "**مساحت** د یوه شکل **داخلي سطح** اندازه کوي. د مربع واحدونو سره بیانیږي: cm²، m²، km²…"
    ) },

    // 2 — heading "Carré" (black)
    { text: S(
      "Carré",
      "Square",
      "المربع",
      "مربع",
      "ካሬ",
      "Квадрат",
      "Quadrado",
      "Wareeg",
      "Kare",
      "مربع"
    ) },

    // 3 — plain
    { text: S(
      "Pour un carré de côté c, l'aire est :",
      "For a square with side c, the area is:",
      "لمربع بضلع c، المساحة هي:",
      "برای یک مربع با ضلع c، مساحت عبارت است از:",
      "ንካሬ ናይ c ጎቦ, ሰፊሓ ዩ:",
      "Для квадрата зі стороною c площа дорівнює:",
      "Para um quadrado de lado c, a área é:",
      "Wareeg dhinac c leh, aaggiisu waa:",
      "c kenarlı bir kare için alan:",
      "د c اړخ سره د مربع مساحت:"
    ) },

    // 4 — rule "Formule"
    { label: S(
        "Formule", "Formula", "الصيغة", "فرمول", "ቅጥዒ", "Формула", "Fórmula", "Qaacidada", "Formül", "فورمول"
      ),
      items: A(
        ["A = c × c = c²"],
        ["A = c × c = c²"],
        ["A = c × c = c²"],
        ["A = c × c = c²"],
        ["A = c × c = c²"],
        ["A = c × c = c²"],
        ["A = c × c = c²"],
        ["A = c × c = c²"],
        ["A = c × c = c²"],
        ["A = c × c = c²"]
      )
    },

    // 5 — svg with captionFr
    { caption: S(
      "Carré de côté c — l'aire est la surface colorée",
      "Square of side c — the area is the coloured surface",
      "مربع بضلع c — المساحة هي السطح الملون",
      "مربع با ضلع c — مساحت همان سطح رنگی است",
      "ካሬ ናይ c ጎቦ — ሰፊሓ ናይ ሕብሪ ወርሒ ዩ",
      "Квадрат зі стороною c — площа — це кольорова поверхня",
      "Quadrado de lado c — a área é a superfície colorida",
      "Wareeg dhinac c leh — aaggiisu waa dushaha midabka leh",
      "c kenarlı kare — alan renkli yüzeydir",
      "د c اړخ مربع — مساحت د رنګي سطح ده"
    ) },

    // 6 — highlight "Exemple"
    { text: S(
      "Exemple",
      "Example",
      "مثال",
      "مثال",
      "ምሳሌ",
      "Приклад",
      "Exemplo",
      "Tusaale",
      "Örnek",
      "مثال"
    ) },

    // 7 — section (label="", items)
    { label: S("", "", "", "", "", "", "", "", "", ""),
      items: A(
        ["Carré de côté 6 cm :", "A = 6² = **36 cm²**"],
        ["Square with side 6 cm:", "A = 6² = **36 cm²**"],
        ["مربع بضلع 6 سم:", "A = 6² = **36 سم²**"],
        ["مربع با ضلع 6 سانتیمتر:", "A = 6² = **36 سانتیمتر²**"],
        ["ካሬ ናይ 6 ሰም ጎቦ:", "A = 6² = **36 ሰም²**"],
        ["Квадрат зі стороною 6 см:", "A = 6² = **36 см²**"],
        ["Quadrado de lado 6 cm:", "A = 6² = **36 cm²**"],
        ["Wareeg dhinac 6 cm leh:", "A = 6² = **36 cm²**"],
        ["6 cm kenarlı kare:", "A = 6² = **36 cm²**"],
        ["د 6 سم اړخ مربع:", "A = 6² = **36 سم²**"]
      )
    },

    // 8 — highlight "Retrouver le côté"
    { text: S(
      "Retrouver le côté",
      "Finding the side",
      "إيجاد الضلع",
      "یافتن ضلع",
      "ጎቦ ምርካብ",
      "Знайти сторону",
      "Encontrar o lado",
      "Helitaanka dhinaca",
      "Kenarı bulmak",
      "اړخ موندل"
    ) },

    // 9 — section (label="", items)
    { label: S("", "", "", "", "", "", "", "", "", ""),
      items: A(
        ["Si on connaît l'aire : c = √A", "Exemple : A = 49 cm² → c = √49 = **7 cm**"],
        ["If the area is known: c = √A", "Example: A = 49 cm² → c = √49 = **7 cm**"],
        ["إذا عُرفت المساحة: c = √A", "مثال: A = 49 سم² → c = √49 = **7 سم**"],
        ["اگر مساحت معلوم باشد: c = √A", "مثال: A = 49 سانتیمتر² → c = √49 = **7 سانتیمتر**"],
        ["ሰፊሓ ምስ ፈለጥና: c = √A", "ኣብነት: A = 49 ሰም² → c = √49 = **7 ሰም**"],
        ["Якщо відома площа: c = √A", "Приклад: A = 49 см² → c = √49 = **7 см**"],
        ["Se a área é conhecida: c = √A", "Exemplo: A = 49 cm² → c = √49 = **7 cm**"],
        ["Haddii aaggu la yaqaan: c = √A", "Tusaale: A = 49 cm² → c = √49 = **7 cm**"],
        ["Alan biliniyorsa: c = √A", "Örnek: A = 49 cm² → c = √49 = **7 cm**"],
        ["که مساحت معلوم وي: c = √A", "مثال: A = 49 سم² → c = √49 = **7 سم**"]
      )
    },
  ],
  paragraphs: {
    fr: [
          "L'aire mesure la surface intérieure d'une figure. Elle s'exprime en unités carrées (cm², m², km²…).",
          "Formule : A = c², où c est la longueur du côté.",
          "Exemple : carré de côté 6 cm → A = 6² = 36 cm².",
          "Pour trouver le côté connaissant l'aire : c = √A.",
        ],
    en: [
          "Area measures the interior surface of a figure, expressed in square units (cm², m²…).",
          "Formula: A = s², where s is the side length.",
          "Example: square side 6 cm → A = 36 cm².",
          "Finding the side from area: s = √A.",
        ],
    ar: [
          "المساحة تقيس السطح الداخلي. تُعبر عنها بوحدات مربعة (سم²، م²…).",
          "الصيغة: A = c².",
          "مثال: مربع بضلع 6 سم → A = 36 سم².",
          "الضلع من المساحة: c = √A.",
        ],
    fa: [
          "مساحت سطح داخلی یک شکل را اندازه می‌گیرد. با واحدهای مربعی بیان می‌شود.",
          "فرمول: A = c².",
          "مثال: مربع با ضلع 6 سانتیمتر → A = 36 سانتیمتر².",
          "ضلع از مساحت: c = √A.",
        ],
    ti: [
          "ሰፊሓ ናይ ቅርጺ ውሽጠ ሰፊሕ ዝሕሰብ ዩ. ብካሬ ኣሃዙ (ሰም², ም²…) ዝቀርብ.",
          "ቅጥዒ: A = c².",
          "ምሳሌ: ካሬ ናይ 6 ሰም ጎቦ → A = 36 ሰም².",
          "ናይ ሰፊሓ ካብ ጎቦ: c = √A.",
        ],
    uk: [
          "Площа вимірює внутрішню поверхню фігури. Виражається в квадратних одиницях.",
          "Формула: A = a².",
          "Приклад: квадрат зі стороною 6 см → A = 36 см².",
          "Сторона зі площі: a = √A.",
        ],
  },
  consignes: {
    "g3-1-e1": { fr: "Calcule l'aire d'un carré de côté 5 cm.", en: "Calculate the area of a square with side 5 cm.",
      ar: "احسب مساحة مربع طول ضلعه 5 سم.",
      fa: "مساحت مربعی با ضلع ۵ سانتی‌متر را حساب کنید.",
      pt: "Calcula a área de um quadrado com lado 5 cm.",
      so: "Xisaabi aagga afar-jibaaro leh dhinac 5 cm.",
      ti: "5 ሰ.ሜ ሸነኽ ዘለዎ ጎዳጉዲ ስፍሓት ሒሳብ ግበር።",
      tr: "Kenarı 5 cm olan bir karenin alanını hesaplayın.",
      ps: "د 5 سم اړخ لرونکي مربع مساحت حساب کړئ.",
      uk: "Обчисліть площу квадрата зі стороною 5 см." },
    "g3-1-e2": { fr: "Calcule l'aire d'un carré de côté 12 cm.", en: "Calculate the area of a square with side 12 cm.",
      ar: "احسب مساحة مربع طول ضلعه 12 سم.",
      fa: "مساحت مربعی با ضلع ۱۲ سانتی‌متر را حساب کنید.",
      pt: "Calcula a área de um quadrado com lado 12 cm.",
      so: "Xisaabi aagga afar-jibaaro leh dhinac 12 cm.",
      ti: "12 ሰ.ሜ ሸነኽ ዘለዎ ጎዳጉዲ ስፍሓት ሒሳብ ግበር።",
      tr: "Kenarı 12 cm olan bir karenin alanını hesaplayın.",
      ps: "د 12 سم اړخ لرونکي مربع مساحت حساب کړئ.",
      uk: "Обчисліть площу квадрата зі стороною 12 см." },
    "g3-1-e3": { fr: "Un carré a une aire de 49 cm². Quel est son côté ?", en: "A square has an area of 49 cm². What is its side length?",
      ar: "مربع مساحته 49 سم². ما طول ضلعه؟",
      fa: "مربعی با مساحت ۴۹ سانتی‌متر مربع. طول ضلعش چقدر است؟",
      pt: "Um quadrado tem uma área de 49 cm². Qual é o seu lado?",
      so: "Afar-jibaaro leh aag 49 cm². Dhinacuhu waa maxay?",
      ti: "49 ሰ.ሜ² ስፍሓት ዘለዎ ጎዳጉዲ። ሸነኹ ክንደይ?",
      tr: "Bir karenin alanı 49 cm². Kenar uzunluğu nedir?",
      ps: "یو مربع د 49 سم² مساحت لري. د هغې اړخ کچه؟",
      uk: "Квадрат має площу 49 см². Яка його сторона?" },
    "g3-1-e4": { fr: "Carré de côté 3,5 cm. Aire = ?", en: "Square with side 3.5 cm. Area = ?",
      ar: "مربع طول ضلعه 3,5 سم. المساحة = ؟",
      fa: "مربعی با ضلع ۳٫۵ سانتی‌متر. مساحت = ؟",
      pt: "Quadrado com lado 3,5 cm. Área = ?",
      so: "Afar-jibaaro leh dhinac 3,5 cm. Aagga = ?",
      ti: "3,5 ሰ.ሜ ሸነኽ ዘለዎ ጎዳጉዲ። ስፍሓት = ?",
      tr: "Kenarı 3,5 cm olan kare. Alan = ?",
      ps: "د 3,5 سم اړخ لرونکی مربع. مساحت = ؟",
      uk: "Квадрат зі стороною 3,5 см. Площа = ?" },
    "g3-1-e5": { fr: "Un carré a une aire de 100 m². Quel est son côté ?", en: "A square has an area of 100 m². What is its side length?",
      ar: "مربع مساحته 100 م². ما طول ضلعه؟",
      fa: "مربعی با مساحت ۱۰۰ متر مربع. طول ضلعش چقدر است؟",
      pt: "Um quadrado tem uma área de 100 m². Qual é o seu lado?",
      so: "Afar-jibaaro leh aag 100 m². Dhinacuhu waa maxay?",
      ti: "100 ሜ² ስፍሓት ዘለዎ ጎዳጉዲ። ሸነኹ ክንደይ?",
      tr: "Bir karenin alanı 100 m². Kenar uzunluğu nedir?",
      ps: "یو مربع د 100 م² مساحت لري. د هغې اړخ کچه؟",
      uk: "Квадрат має площу 100 м². Яка його сторона?" },
  },
};
