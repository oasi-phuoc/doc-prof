import type { SubmoduleTrad } from "./trad-types";

const S = (fr: string, en: string, ar: string, fa: string, ti: string, uk: string, pt: string, so: string, tr: string, ps: string) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

const A = (fr: string[], en: string[], ar: string[], fa: string[], ti: string[], uk: string[], pt: string[], so: string[], tr: string[], ps: string[]) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

export const TRAD_G3_4: SubmoduleTrad = {
  submoduleId: "G3-4",
  title: {
    fr: "Périmètre des polygones réguliers",
    en: "Perimeter of regular polygons",
    ar: "محيط المضلعات المنتظمة",
    fa: "محیط چندضلعی‌های منتظم",
    ti: "ናይ ዕኩል ብዙ-ጎቦ ዙሪያ",
    uk: "Периметр правильних многокутників",
  },
  blocks: [
    // 0 — heading "Polygone régulier" (black)
    { text: S(
      "Polygone régulier",
      "Regular polygon",
      "المضلع المنتظم",
      "چندضلعی منتظم",
      "ዕኩል ብዙ-ጎቦ",
      "Правильний многокутник",
      "Polígono regular",
      "Baargeysaha caadiga ah",
      "Düzgün çokgen",
      "منظم بهله‌ضلعي"
    ) },

    // 1 — plain "Un polygone régulier a **tous ses côtés de même longueur**..."
    { text: S(
      "Un polygone régulier a **tous ses côtés de même longueur** (c). Son périmètre est :",
      "A regular polygon has **all sides of equal length** (c). Its perimeter is:",
      "المضلع المنتظم له **جميع أضلاعه بنفس الطول** (c). محيطه هو:",
      "چندضلعی منتظم **همه اضلاعش هم‌طول** (c) هستند. محیط آن عبارت است از:",
      "ዕኩል ብዙ-ጎቦ **ኩሉ ጎቦ ዕኩል ርዝሓ** (c) ዘለዎ ዩ። ዙሪያኡ ዝኸውን:",
      "Правильний многокутник має **всі сторони однакової довжини** (c). Його периметр:",
      "Um polígono regular tem **todos os lados de igual comprimento** (c). O seu perímetro é:",
      "Baargeysaha caadiga ah wuxuu leeyahay **dhinacyo dhererkoodu siman yahay** (c). Xadkiisu waa:",
      "Düzgün çokgenin **tüm kenarları eşit uzunluktadır** (c). Çevresi:",
      "منظم بهله‌ضلعي **ټول اړخونه يې مساوي اوږدوالی** (c) لري. د هغه محیط:"
    ) },

    // 2 — rule "Formule" itemsFr ["P = n × c", "(n = nombre de côtés, c = longueur d'un côté)"]
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
      ["P = n × c", "(n = nombre de côtés, c = longueur d'un côté)"],
      ["P = n × c", "(n = number of sides, c = side length)"],
      ["P = n × c", "(n = عدد الأضلاع، c = طول الضلع)"],
      ["P = n × c", "(n = تعداد اضلاع، c = طول یک ضلع)"],
      ["P = n × c", "(n = ቁጽሪ ጎቦ, c = ርዝሓ ሓደ ጎቦ)"],
      ["P = n × c", "(n = кількість сторін, c = довжина сторони)"],
      ["P = n × c", "(n = número de lados, c = comprimento de um lado)"],
      ["P = n × c", "(n = tirada dhinacyada, c = dhererka dhinac)"],
      ["P = n × c", "(n = kenar sayısı, c = bir kenarın uzunluğu)"],
      ["P = n × c", "(n = د اړخونو شمیر، c = د یوه اړخ اوږدوالی)"]
    ) },

    // 3 — table headersFr ["Polygone", "n", "Exemple (c = 5 cm)", "P"]
    { headers: A(
      ["Polygone", "n", "Exemple (c = 5 cm)", "P"],
      ["Polygon", "n", "Example (c = 5 cm)", "P"],
      ["المضلع", "n", "مثال (c = 5 سم)", "P"],
      ["چندضلعی", "n", "مثال (c = 5 سانتیمتر)", "P"],
      ["ብዙ-ጎቦ", "n", "ምሳሌ (c = 5 ሰም)", "P"],
      ["Многокутник", "n", "Приклад (c = 5 см)", "P"],
      ["Polígono", "n", "Exemplo (c = 5 cm)", "P"],
      ["Baargeysaha", "n", "Tusaale (c = 5 cm)", "P"],
      ["Çokgen", "n", "Örnek (c = 5 cm)", "P"],
      ["بهله‌ضلعي", "n", "بېلګه (c = 5 سم)", "P"]
    ), items: A(
      ["Triangle équilatéral\t3\t3 × 5\t15 cm", "Carré\t4\t4 × 5\t20 cm", "Pentagone\t5\t5 × 5\t25 cm", "Hexagone\t6\t6 × 5\t30 cm", "Octogone\t8\t8 × 5\t40 cm"],
      ["Equilateral triangle\t3\t3 × 5\t15 cm", "Square\t4\t4 × 5\t20 cm", "Pentagon\t5\t5 × 5\t25 cm", "Hexagon\t6\t6 × 5\t30 cm", "Octagon\t8\t8 × 5\t40 cm"],
      ["مثلث متساوي الأضلاع\t3\t3 × 5\t15 سم", "مربع\t4\t4 × 5\t20 سم", "خماسي\t5\t5 × 5\t25 سم", "سداسي\t6\t6 × 5\t30 سم", "ثماني\t8\t8 × 5\t40 سم"],
      ["مثلث متساوی‌الاضلاع\t3\t3 × 5\t15 سانتیمتر", "مربع\t4\t4 × 5\t20 سانتیمتر", "پنتاگون\t5\t5 × 5\t25 سانتیمتر", "هگزاگون\t6\t6 × 5\t30 سانتیمتر", "اکتاگون\t8\t8 × 5\t40 سانتیمتر"],
      ["ዕኩል ሰለስ-ጎቦ\t3\t3 × 5\t15 ሰም", "ካሬ\t4\t4 × 5\t20 ሰም", "ሃምስ-ጎቦ\t5\t5 × 5\t25 ሰም", "ሽዱሽ-ጎቦ\t6\t6 × 5\t30 ሰም", "ሸሞን-ጎቦ\t8\t8 × 5\t40 ሰም"],
      ["Рівносторонній трикутник\t3\t3 × 5\t15 см", "Квадрат\t4\t4 × 5\t20 см", "П'ятикутник\t5\t5 × 5\t25 см", "Шестикутник\t6\t6 × 5\t30 см", "Восьмикутник\t8\t8 × 5\t40 см"],
      ["Triângulo equilátero\t3\t3 × 5\t15 cm", "Quadrado\t4\t4 × 5\t20 cm", "Pentágono\t5\t5 × 5\t25 cm", "Hexágono\t6\t6 × 5\t30 cm", "Octógono\t8\t8 × 5\t40 cm"],
      ["Saddexgeesood la'eg\t3\t3 × 5\t15 cm", "Geesinada\t4\t4 × 5\t20 cm", "Shanta-geesood\t5\t5 × 5\t25 cm", "Lixda-geesood\t6\t6 × 5\t30 cm", "Sideedda-geesood\t8\t8 × 5\t40 cm"],
      ["Eşkenar üçgen\t3\t3 × 5\t15 cm", "Kare\t4\t4 × 5\t20 cm", "Beşgen\t5\t5 × 5\t25 cm", "Altıgen\t6\t6 × 5\t30 cm", "Sekizgen\t8\t8 × 5\t40 cm"],
      ["مساوي الاضلاع مثلث\t3\t3 × 5\t15 سم", "مربع\t4\t4 × 5\t20 سم", "پنتاګون\t5\t5 × 5\t25 سم", "هکساګون\t6\t6 × 5\t30 سم", "اکتاګون\t8\t8 × 5\t40 سم"]
    ) },

    // 4 — svg_row with items captionFr "Pentagone (5 × c)", "Hexagone (6 × c)", "Octogone (8 × c)"
    { items: A(
      ["Pentagone (5 × c)", "Hexagone (6 × c)", "Octogone (8 × c)"],
      ["Pentagon (5 × c)", "Hexagon (6 × c)", "Octagon (8 × c)"],
      ["خماسي (5 × c)", "سداسي (6 × c)", "ثماني (8 × c)"],
      ["پنتاگون (5 × c)", "هگزاگون (6 × c)", "اکتاگون (8 × c)"],
      ["ሃምስ-ጎቦ (5 × c)", "ሽዱሽ-ጎቦ (6 × c)", "ሸሞን-ጎቦ (8 × c)"],
      ["П'ятикутник (5 × c)", "Шестикутник (6 × c)", "Восьмикутник (8 × c)"],
      ["Pentágono (5 × c)", "Hexágono (6 × c)", "Octógono (8 × c)"],
      ["Shanta-geesood (5 × c)", "Lixda-geesood (6 × c)", "Sideedda-geesood (8 × c)"],
      ["Beşgen (5 × c)", "Altıgen (6 × c)", "Sekizgen (8 × c)"],
      ["پنتاګون (5 × c)", "هکساګون (6 × c)", "اکتاګون (8 × c)"]
    ) },

    // 5 — highlight "Polygone quelconque"
    { text: S(
      "Polygone quelconque",
      "Any polygon",
      "أي مضلع",
      "هر چندضلعی",
      "ዝኾነ ብዙ-ጎቦ",
      "Будь-який многокутник",
      "Qualquer polígono",
      "Baargeysaha kasta",
      "Herhangi bir çokgen",
      "هر بهله‌ضلعي"
    ) },

    // 6 — section labelFr "" itemsFr ["Pour un polygone non régulier : P = **somme de tous les côtés**."]
    { label: S("", "", "", "", "", "", "", "", "", ""),
      items: A(
        ["Pour un polygone non régulier : P = **somme de tous les côtés**."],
        ["For an irregular polygon: P = **sum of all sides**."],
        ["لأي مضلع غير منتظم: P = **مجموع جميع الأضلاع**."],
        ["برای یک چندضلعی نامنتظم: P = **مجموع همه اضلاع**."],
        ["ንዝኾነ ዘይዕኩል ብዙ-ጎቦ: P = **ናይ ኩሎም ጎቦ ድምር**."],
        ["Для будь-якого неправильного многокутника: P = **сума всіх сторін**."],
        ["Para um polígono irregular: P = **soma de todos os lados**."],
        ["Baargeysaha aan caadiga ahayn: P = **wadarta dhinacyada oo dhan**."],
        ["Düzgün olmayan bir çokgen için: P = **tüm kenarların toplamı**."],
        ["د غیر منظم بهله‌ضلعي لپاره: P = **د ټولو اړخونو مجموعه**."]
      )
    },
  ],
  paragraphs: {
    fr: [
          "Un polygone régulier a tous ses côtés de même longueur. Son périmètre est : P = n × c, où n est le nombre de côtés et c la longueur d'un côté.",
          "Exemples : pentagone régulier de côté 6 cm → P = 5 × 6 = 30 cm ; hexagone régulier de côté 4 cm → P = 6 × 4 = 24 cm.",
          "Pour tout polygone non régulier : P = somme de tous les côtés.",
          "Application : un terrain hexagonal régulier de côté 10 m a un périmètre de 60 m.",
        ],
    en: [
          "A regular polygon has all equal sides. Perimeter: P = n × s, where n = number of sides and s = side length.",
          "Examples: regular pentagon side 6 cm → P = 30 cm; regular hexagon side 4 cm → P = 24 cm.",
          "For irregular polygons: P = sum of all sides.",
        ],
    ar: [
          "المضلع المنتظم كل أضلاعه متساوية. محيطه: P = n × c.",
          "أمثلة: خماسي منتظم بضلع 6 سم → P = 30 سم.",
          "لأي مضلع: P = مجموع الأضلاع.",
        ],
    fa: [
          "چندضلعی منتظم همه اضلاعش مساوی هستند. محیط: P = n × c.",
          "مثال: پنتاگون منتظم با ضلع 6 سانتیمتر → P = 30 سانتیمتر.",
          "برای هر چندضلعی: P = مجموع همه اضلاع.",
        ],
    ti: [
          "ዕኩል ብዙ-ጎቦ ኩሉ ዕኩል ጎቦ ዘለዎ ዩ. ዙሪያ: P = n × c.",
          "ምሳሌ: ናይ 5 ጎቦ ዕኩል ቅርጺ ናይ 6 ሰም ጎቦ → P = 30 ሰም.",
          "ንዝኾነ ብዙ-ጎቦ: P = ናይ ኩሎም ጎቦ ድምር.",
        ],
    uk: [
          "Правильний многокутник має всі рівні сторони. Периметр: P = n × a.",
          "Приклади: правильний п'ятикутник зі стороною 6 см → P = 30 см.",
          "Для будь-якого многокутника: P = сума всіх сторін.",
        ],
  },
  consignes: {
    "g2-4-e1": { fr: "Périmètre d'un hexagone régulier de côté 5 cm.", en: "Perimeter of a regular hexagone with side 5 cm.",
      ar: "محيط سداسي منتظم طول ضلعه 5 سم.",
      fa: "محیط یک شش‌ضلعی منتظم با ضلع ۵ سانتی‌متر.",
      pt: "Perímetro de um hexágono regular com lado 5 cm.",
      so: "Goobaaha shaxanka lix-dhinacle ee joogta ah oo leh dhinac 5 cm.",
      ti: "5 ሰ.ሜ ሸነኽ ዘለዎ መደበኛ ሄክሳጎን ኣካፋ።",
      tr: "Kenarı 5 cm olan düzgün altıgenin çevresi.",
      ps: "د 5 سم اړخ لرونکي منظم شپږ اړخیز شکل محیط.",
      uk: "Периметр правильного шестикутника зі стороною 5 см." },
    "g2-4-e2": { fr: "Périmètre d'un octogone régulier de côté 3 cm.", en: "Perimeter of a regular octogone with side 3 cm.",
      ar: "محيط ثماني منتظم طول ضلعه 3 سم.",
      fa: "محیط یک هشت‌ضلعی منتظم با ضلع ۳ سانتی‌متر.",
      pt: "Perímetro de um octógono regular com lado 3 cm.",
      so: "Goobaaha shaxanka siddeed-dhinacle ee joogta ah oo leh dhinac 3 cm.",
      ti: "3 ሰ.ሜ ሸነኽ ዘለዎ መደበኛ ኦክታጎን ኣካፋ።",
      tr: "Kenarı 3 cm olan düzgün sekizgenin çevresi.",
      ps: "د 3 سم اړخ لرونکي منظم اته اړخیز شکل محیط.",
      uk: "Периметр правильного восьмикутника зі стороною 3 см." },
    "g2-4-e3": { fr: "Un polygone régulier a un périmètre de 40 cm et des côtés de 8 cm. Combien de côtés ?", en: "A regular polygon has a perimeter of 40 cm and sides of 8 cm. How many sides?",
      ar: "مضلع منتظم محيطه 40 سم وأضلاعه 8 سم. كم عدد أضلاعه؟",
      fa: "یک چندضلعی منتظم با محیط ۴۰ سانتی‌متر و اضلاع ۸ سانتی‌متر. چند ضلع دارد؟",
      pt: "Um polígono regular tem perímetro de 40 cm e lados de 8 cm. Quantos lados?",
      so: "Saxan joogta ah leh goobaah 40 cm iyo dhinacyo 8 cm. Imisa dhinac?",
      ti: "40 ሰ.ሜ ኣካፋን 8 ሰ.ሜ ሸነኻትን ዘለዎ መደበኛ ፖሊጎን። ክንደይ ሸነኻት?",
      tr: "Çevresi 40 cm ve kenarları 8 cm olan düzgün çokgen. Kaç kenarı var?",
      ps: "د 40 سم محیط او 8 سم اړخونو لرونکی منظم ډول شکل. د کچه اړخونه لري؟",
      uk: "Правильний багатокутник із периметром 40 см і сторонами 8 см. Скільки сторін?" },
    "g2-4-e4": { fr: "Périmètre d'un pentagone régulier de côté 7 cm.", en: "Perimeter of a regular pentagone with side 7 cm.",
      ar: "محيط خماسي منتظم طول ضلعه 7 سم.",
      fa: "محیط یک پنج‌ضلعی منتظم با ضلع ۷ سانتی‌متر.",
      pt: "Perímetro de um pentágono regular com lado 7 cm.",
      so: "Goobaaha shaxanka shan-dhinacle ee joogta ah oo leh dhinac 7 cm.",
      ti: "7 ሰ.ሜ ሸነኽ ዘለዎ መደበኛ ፔንታጎን ኣካፋ።",
      tr: "Kenarı 7 cm olan düzgün beşgenin çevresi.",
      ps: "د 7 سم اړخ لرونکي منظم پنځه اړخیز شکل محیط.",
      uk: "Периметр правильного п'ятикутника зі стороною 7 см." },
    "g2-4-e5": { fr: "Périmètre d'un triangle équilatéral de côté 9 cm.", en: "Perimeter of an equilateral triangle with side 9 cm.",
      ar: "محيط مثلث متساوي الأضلاع طول ضلعه 9 سم.",
      fa: "محیط یک مثلث متساوی‌الاضلاع با ضلع ۹ سانتی‌متر.",
      pt: "Perímetro de um triângulo equilátero com lado 9 cm.",
      so: "Goobaaha sadex-xagal siman leh dhinac 9 cm.",
      ti: "9 ሰ.ሜ ሸነኽ ዘለዎ ማዕረ ሸነኽ ሰሌስቲ ኣካፋ።",
      tr: "Kenarı 9 cm olan eşkenar üçgenin çevresi.",
      ps: "د 9 سم اړخ لرونکي متساوي الاضلاع مثلث محیط.",
      uk: "Периметр рівностороннього трикутника зі стороною 9 см." },
  },
};
