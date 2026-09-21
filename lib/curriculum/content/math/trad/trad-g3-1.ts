import type { SubmoduleTrad } from "./trad-types";

const S = (fr: string, en: string, ar: string, fa: string, ti: string, uk: string, pt: string, so: string, tr: string, ps: string) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

const A = (fr: string[], en: string[], ar: string[], fa: string[], ti: string[], uk: string[], pt: string[], so: string[], tr: string[], ps: string[]) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

export const TRAD_G3_1: SubmoduleTrad = {
  submoduleId: "G3-1",
  title: {
    fr: "Périmètre du carré",
    en: "Perimeter of a square",
    ar: "محيط المربع",
    fa: "محیط مربع",
    ti: "ናይ ካሬ ዙሪያ",
    uk: "Периметр квадрата",
  },
  blocks: [
    // 0 — heading "Qu'est-ce que le périmètre ?" (black)
    { text: S(
      "Qu'est-ce que le périmètre ?",
      "What is the perimeter?",
      "ما هو المحيط؟",
      "محیط چیست؟",
      "ዙሪያ እንታይ ዩ?",
      "Що таке периметр?",
      "O que é o perímetro?",
      "Maxay tahay waxa loogu yeedho xadka?",
      "Çevre nedir?",
      "محیط څه ده؟"
    ) },

    // 1 — plain
    { text: S(
      "Le **périmètre** est la longueur totale du contour d'une figure. On le mesure en unités de longueur (cm, m, km…).",
      "The **perimeter** is the total length of the outline of a figure. It is measured in length units (cm, m, km…).",
      "**المحيط** هو الطول الإجمالي لمحيط شكل. يُقاس بوحدات الطول (سم، م، كم…).",
      "**محیط** طول کلی حاشیه یک شکل است. به واحدهای طول (سانتیمتر، متر، کیلومتر…) اندازه‌گیری می‌شود.",
      "**ዙሪያ** ናይ ቅርጺ ሓቆፋ ምሉእ ርዝሓ ዩ። ብናይ ርዝሓ ሓደ ዜሮ (ሰም፣ ም፣ ክም…) ዝሕሰብ ዩ።",
      "**Периметр** — загальна довжина контуру фігури. Вимірюється в одиницях довжини (см, м, км…).",
      "O **perímetro** é o comprimento total do contorno de uma figura. Mede-se em unidades de comprimento (cm, m, km…).",
      "**Xadka** waa dhererka guud ee xudduudda sawirka. Waxaa lagu cabbiraa cutubka dhererka (cm, m, km…).",
      "**Çevre**, bir şeklin dış hatlarının toplam uzunluğudur. Uzunluk birimleriyle (cm, m, km…) ölçülür.",
      "**محیط** د یوې شکلې د بهرني حاشیې ټوله اوږدوالی ده. د اوږدوالي واحدونو (سم، م، کم…) سره اندازه کیږي."
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
      "Geesinada",
      "Kare",
      "مربع"
    ) },

    // 3 — plain
    { text: S(
      "Un carré a **4 côtés égaux**. On note c la longueur d'un côté.",
      "A square has **4 equal sides**. We denote c the length of one side.",
      "المربع له **4 أضلاع متساوية**. نرمز بـ c لطول الضلع.",
      "مربع **4 ضلع مساوی** دارد. c طول یک ضلع را نشان می‌دهد.",
      "ካሬ **4 ዕኩል ጎቦ** ዘለዎ ዩ። c ናይ ሓደ ጎቦ ርዝሓ ዩ።",
      "Квадрат має **4 рівні сторони**. c позначає довжину сторони.",
      "Um quadrado tem **4 lados iguais**. Denota-se c o comprimento de um lado.",
      "Geesinada waxaa leh **4 dhinac oo siman**. c waxaa loogu yeeraa dhererka dhinac.",
      "Bir karenin **4 eşit kenarı** vardır. Bir kenarın uzunluğunu c ile gösteririz.",
      "مربع **4 مساوي اړخونه** لري. c د یوه اړخ اوږدوالی ده."
    ) },

    // 4 — rule "Formule" itemsFr ["P = 4 × c"]
    { label: S(
      "Formule",
      "Formula",
      "الصيغة",
      "فرمول",
      "ቅጥዒ",
      "Формула",
      "Fórmula",
      "Qaacidada",
      "Formül",
      "فورمول"
    ), items: A(
      ["P = 4 × c"],
      ["P = 4 × c"],
      ["P = 4 × c"],
      ["P = 4 × c"],
      ["P = 4 × c"],
      ["P = 4 × c"],
      ["P = 4 × c"],
      ["P = 4 × c"],
      ["P = 4 × c"],
      ["P = 4 × c"]
    ) },

    // 5 — highlight "Exemple"
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
      "بېلګه"
    ) },

    // 6 — section labelFr "" itemsFr ["Carré de côté 7 cm :", "P = 4 × 7 = **28 cm**"]
    { label: S("", "", "", "", "", "", "", "", "", ""),
      items: A(
        ["Carré de côté 7 cm :", "P = 4 × 7 = **28 cm**"],
        ["Square with side 7 cm:", "P = 4 × 7 = **28 cm**"],
        ["مربع بضلع 7 سم:", "P = 4 × 7 = **28 سم**"],
        ["مربع با ضلع 7 سانتیمتر:", "P = 4 × 7 = **28 سانتیمتر**"],
        ["ካሬ ናይ 7 ሰም ጎቦ:", "P = 4 × 7 = **28 ሰም**"],
        ["Квадрат зі стороною 7 см:", "P = 4 × 7 = **28 см**"],
        ["Quadrado de lado 7 cm:", "P = 4 × 7 = **28 cm**"],
        ["Geesinada 7 cm:", "P = 4 × 7 = **28 cm**"],
        ["7 cm kenarlı kare:", "P = 4 × 7 = **28 cm**"],
        ["د 7 سم اړخ لرونکی مربع:", "P = 4 × 7 = **28 سم**"]
      )
    },

    // 7 — svg captionFr "Carré de côté c — P = 4 × c"
    { caption: S(
      "Carré de côté c — P = 4 × c",
      "Square with side c — P = 4 × c",
      "مربع بضلع c — P = 4 × c",
      "مربع با ضلع c — P = 4 × c",
      "ካሬ ናይ c ጎቦ — P = 4 × c",
      "Квадрат зі стороною c — P = 4 × c",
      "Quadrado de lado c — P = 4 × c",
      "Geesinada dhinac c — P = 4 × c",
      "c kenarlı kare — P = 4 × c",
      "د c اړخ لرونکی مربع — P = 4 × c"
    ) },

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

    // 9 — section labelFr "" itemsFr ["Si on connaît le périmètre : c = P ÷ 4"]
    { label: S("", "", "", "", "", "", "", "", "", ""),
      items: A(
        ["Si on connaît le périmètre : c = P ÷ 4"],
        ["If the perimeter is known: c = P ÷ 4"],
        ["إذا عُرف المحيط: c = P ÷ 4"],
        ["اگر محیط معلوم باشد: c = P ÷ 4"],
        ["ዙሪያ እንተፈሊጥናዮ: c = P ÷ 4"],
        ["Якщо периметр відомий: c = P ÷ 4"],
        ["Se o perímetro for conhecido: c = P ÷ 4"],
        ["Haddii xadka la yaqaan: c = P ÷ 4"],
        ["Çevre biliniyorsa: c = P ÷ 4"],
        ["که محیط معلوم وي: c = P ÷ 4"]
      )
    },
  ],
  paragraphs: {
    fr: [
          "Le périmètre est la longueur totale du contour d'une figure. Pour le carré, les 4 côtés sont égaux.",
          "Formule : P = 4 × c, où c est la longueur du côté.",
          "Exemple : carré de côté 7 cm → P = 4 × 7 = 28 cm.",
          "Pour trouver le côté connaissant le périmètre : c = P ÷ 4.",
        ],
    en: [
          "The perimeter is the total length of a figure's outline. A square has 4 equal sides.",
          "Formula: P = 4 × s, where s is the side length.",
          "Example: square with side 7 cm → P = 28 cm.",
          "Finding the side from perimeter: s = P ÷ 4.",
        ],
    ar: [
          "المحيط هو الطول الإجمالي لمحيط شكل. للمربع 4 أضلاع متساوية.",
          "الصيغة: P = 4 × c، حيث c طول الضلع.",
          "مثال: مربع بضلع 7 سم → P = 28 سم.",
          "الضلع من المحيط: c = P ÷ 4.",
        ],
    fa: [
          "محیط طول کلی حاشیه یک شکل است. مربع 4 ضلع مساوی دارد.",
          "فرمول: P = 4 × c که c طول ضلع است.",
          "مثال: مربع با ضلع 7 سانتیمتر → P = 28 سانتیمتر.",
          "ضلع از محیط: c = P ÷ 4.",
        ],
    ti: [
          "ዙሪያ ናይ ቅርጺ ሓቆፋ ርዝሓ ዩ. ካሬ 4 ዕኩል ጎቦ ዘለዎ ዩ.",
          "ቅጥዒ: P = 4 × c ሸነኽ c ናይ ጎቦ ርዝሓ ዩ.",
          "ምሳሌ: ካሬ ናይ 7 ሰም ጎቦ → P = 28 ሰም.",
          "ናይ ዙሪያ ካብ ጎቦ: c = P ÷ 4.",
        ],
    uk: [
          "Периметр — загальна довжина контуру фігури. Квадрат має 4 рівні сторони.",
          "Формула: P = 4 × a, де a — довжина сторони.",
          "Приклад: квадрат зі стороною 7 см → P = 28 см.",
          "Сторона з периметра: a = P ÷ 4.",
        ],
  },
  consignes: {
    "g2-1-e1": { fr: "Calcule le périmètre d'un carré de côté 9 cm.", en: "Calculate the perimeter of a square with side 9 cm.",
      ar: "احسب محيط مربع طول ضلعه 9 سم.",
      fa: "محیط مربعی با ضلع ۹ سانتی‌متر را حساب کنید.",
      pt: "Calcula o perímetro de um quadrado com lado 9 cm.",
      so: "Xisaabi goobaaha afar-jibaaro leh dhinac 9 cm.",
      ti: "9 ሰ.ሜ ሸነኽ ዘለዎ ጎዳጉዲ ኣካፋ ሒሳብ ግበር።",
      tr: "Kenarı 9 cm olan bir karenin çevresini hesaplayın.",
      ps: "د 9 سم اړخ لرونکي مربع محیط حساب کړئ.",
      uk: "Обчисліть периметр квадрата зі стороною 9 см." },
    "g2-1-e2": { fr: "Un carré a un périmètre de 48 cm. Quel est son côté ?", en: "A square has a perimeter of 48 cm. What is its side length?",
      ar: "مربع محيطه 48 سم. ما طول ضلعه؟",
      fa: "مربعی با محیط ۴۸ سانتی‌متر. طول ضلعش چقدر است؟",
      pt: "Um quadrado tem um perímetro de 48 cm. Qual é o seu lado?",
      so: "Afar-jibaaro leh goobaah 48 cm. Dhinacuhu waa maxay?",
      ti: "48 ሰ.ሜ ኣካፋ ዘለዎ ጎዳጉዲ። ሸነኹ ክንደይ?",
      tr: "Bir karenin çevresi 48 cm. Kenar uzunluğu nedir?",
      ps: "یو مربع د 48 سم محیط لري. د هغې اړخ کچه؟",
      uk: "Квадрат має периметр 48 см. Яка його сторона?" },
    "g2-1-e3": { fr: "Calcule le périmètre d'un carré de côté 4,5 cm.", en: "Calculate the perimeter of a square with side 4.5 cm.",
      ar: "احسب محيط مربع طول ضلعه 4,5 سم.",
      fa: "محیط مربعی با ضلع ۴٫۵ سانتی‌متر را حساب کنید.",
      pt: "Calcula o perímetro de um quadrado com lado 4,5 cm.",
      so: "Xisaabi goobaaha afar-jibaaro leh dhinac 4,5 cm.",
      ti: "4,5 ሰ.ሜ ሸነኽ ዘለዎ ጎዳጉዲ ኣካፋ ሒሳብ ግበር።",
      tr: "Kenarı 4,5 cm olan bir karenin çevresini hesaplayın.",
      ps: "د 4,5 سم اړخ لرونکي مربع محیط حساب کړئ.",
      uk: "Обчисліть периметр квадрата зі стороною 4,5 см." },
    "g2-1-e4": { fr: "Combien de côtés a un carré ?", en: "How many sides does a square have?",
      ar: "كم عدد أضلاع المربع؟",
      fa: "مربع چند ضلع دارد؟",
      pt: "Quantos lados tem um quadrado?",
      so: "Afar-jibaaro wuxuu leeyahay imisa dhinac?",
      ti: "ጎዳጉዲ ክንደይ ሸነኻት ኣለዎ?",
      tr: "Bir karenin kaç kenarı vardır?",
      ps: "مربع د کچه اړخونه لري؟",
      uk: "Скільки сторін має квадрат?" },
    "g2-1-e5": { fr: "Un carré de côté 6 m : P = ?", en: "A square with side 6 m: P = ?",
      ar: "مربع طول ضلعه 6 م : المحيط = ؟",
      fa: "مربعی با ضلع ۶ متر: محیط = ؟",
      pt: "Um quadrado com lado 6 m: P = ?",
      so: "Afar-jibaaro leh dhinac 6 m: P = ?",
      ti: "6 ሜ ሸነኽ ዘለዎ ጎዳጉዲ፡ P = ?",
      tr: "Kenarı 6 m olan kare: P = ?",
      ps: "د 6 م اړخ لرونکی مربع: P = ؟",
      uk: "Квадрат зі стороною 6 м: P = ?" },
  },
};