import type { SubmoduleTrad } from "./trad-types";

const S = (fr: string, en: string, ar: string, fa: string, ti: string, uk: string, pt: string, so: string, tr: string, ps: string) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

const A = (fr: string[], en: string[], ar: string[], fa: string[], ti: string[], uk: string[], pt: string[], so: string[], tr: string[], ps: string[]) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

export const TRAD_G4_2: SubmoduleTrad = {
  submoduleId: "G4-2",
  title: {
    fr: "Aire du rectangle",
    en: "Area of a rectangle",
    ar: "مساحة المستطيل",
    fa: "مساحت مستطیل",
    ti: "ናይ ካሬ-ሓለቃ ሰፊሓ",
    uk: "Площа прямокутника",
  },
  blocks: [
    // 0 — heading "Rectangle" (black)
    { text: S(
      "Rectangle",
      "Rectangle",
      "المستطيل",
      "مستطیل",
      "ካሬ-ሓለቃ",
      "Прямокутник",
      "Retângulo",
      "Wareegsanaanta",
      "Dikdörtgen",
      "مستطیل"
    ) },

    // 1 — plain
    { text: S(
      "Pour un rectangle de longueur L et de largeur l, l'aire est :",
      "For a rectangle with length L and width l, the area is:",
      "لمستطيل بطول L وعرض l، المساحة هي:",
      "برای یک مستطیل با طول L و عرض l، مساحت عبارت است از:",
      "ንካሬ-ሓለቃ ናይ L ቁመት ን l ወርሓ, ሰፊሓ ዩ:",
      "Для прямокутника завдовжки L і завширшки l площа дорівнює:",
      "Para um retângulo de comprimento L e largura l, a área é:",
      "Wareegsanaanta dhererka L iyo ballacdha l leh, aaggiisu waa:",
      "L uzunluğu ve l genişliğindeki bir dikdörtgen için alan:",
      "د L اوږدوالي او l پلن والي مستطیل مساحت:"
    ) },

    // 2 — rule "Formule"
    { label: S(
        "Formule", "Formula", "الصيغة", "فرمول", "ቅጥዒ", "Формула", "Fórmula", "Qaacidada", "Formül", "فورمول"
      ),
      items: A(
        ["A = L × l"],
        ["A = L × l"],
        ["A = L × l"],
        ["A = L × l"],
        ["A = L × l"],
        ["A = L × l"],
        ["A = L × l"],
        ["A = L × l"],
        ["A = L × l"],
        ["A = L × l"]
      )
    },

    // 3 — svg with captionFr
    { caption: S(
      "Rectangle L × l — A = L × l",
      "Rectangle L × l — A = L × l",
      "مستطيل L × l — A = L × l",
      "مستطیل L × l — A = L × l",
      "ካሬ-ሓለቃ L × l — A = L × l",
      "Прямокутник L × l — A = L × l",
      "Retângulo L × l — A = L × l",
      "Wareegsanaanta L × l — A = L × l",
      "Dikdörtgen L × l — A = L × l",
      "مستطیل L × l — A = L × l"
    ) },

    // 4 — highlight "Exemple"
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

    // 5 — section (label="", items)
    { label: S("", "", "", "", "", "", "", "", "", ""),
      items: A(
        ["Rectangle 8 cm × 5 cm :", "A = 8 × 5 = **40 cm²**"],
        ["Rectangle 8 cm × 5 cm:", "A = 8 × 5 = **40 cm²**"],
        ["مستطيل 8 سم × 5 سم:", "A = 8 × 5 = **40 سم²**"],
        ["مستطیل 8 سانتیمتر × 5 سانتیمتر:", "A = 8 × 5 = **40 سانتیمتر²**"],
        ["ካሬ-ሓለቃ 8 ሰም × 5 ሰም:", "A = 8 × 5 = **40 ሰም²**"],
        ["Прямокутник 8 см × 5 см:", "A = 8 × 5 = **40 см²**"],
        ["Retângulo 8 cm × 5 cm:", "A = 8 × 5 = **40 cm²**"],
        ["Wareegsanaanta 8 cm × 5 cm:", "A = 8 × 5 = **40 cm²**"],
        ["8 cm × 5 cm dikdörtgen:", "A = 8 × 5 = **40 cm²**"],
        ["مستطیل 8 سم × 5 سم:", "A = 8 × 5 = **40 سم²**"]
      )
    },

    // 6 — heading "Conversions d'unités" (black)
    { text: S(
      "Conversions d'unités",
      "Unit conversions",
      "تحويلات الوحدات",
      "تبدیل واحدها",
      "ናይ ኣሃዙ ምቕያር",
      "Перетворення одиниць",
      "Conversões de unidades",
      "Beddelista cutubka",
      "Birim dönüşümleri",
      "د واحدونو بدلون"
    ) },

    // 7 — table (no caption)
    { headers: A(
        ["Conversion", "Valeur"],
        ["Conversion", "Value"],
        ["التحويل", "القيمة"],
        ["تبدیل", "مقدار"],
        ["ምቕያር", "ዋጋ"],
        ["Перетворення", "Значення"],
        ["Conversão", "Valor"],
        ["Beddelka", "Qiimaha"],
        ["Dönüşüm", "Değer"],
        ["بدلون", "ارزښت"]
      ),
      items: A(
        ["1 m² = … cm²", "1 km² = … m²", "1 dm² = … cm²"],
        ["1 m² = … cm²", "1 km² = … m²", "1 dm² = … cm²"],
        ["1 م² = … سم²", "1 كم² = … م²", "1 دسم² = … سم²"],
        ["1 م² = … سانتیمتر²", "1 کیلومتر² = … م²", "1 دسیمتر² = … سانتیمتر²"],
        ["1 ም² = … ሰም²", "1 ክም² = … ም²", "1 ዲሰም² = … ሰም²"],
        ["1 м² = … см²", "1 км² = … м²", "1 дм² = … см²"],
        ["1 m² = … cm²", "1 km² = … m²", "1 dm² = … cm²"],
        ["1 m² = … cm²", "1 km² = … m²", "1 dm² = … cm²"],
        ["1 m² = … cm²", "1 km² = … m²", "1 dm² = … cm²"],
        ["1 m² = … سم²", "1 km² = … m²", "1 dm² = … سم²"]
      )
    },
  ],
  paragraphs: {
    fr: [
          "Formule : A = L × l, où L est la longueur et l la largeur.",
          "Exemple : rectangle 8 cm × 5 cm → A = 8 × 5 = 40 cm².",
          "Si on connaît l'aire et la longueur : l = A ÷ L.",
          "Unités : attention aux conversions. 1 m² = 10 000 cm² ; 1 km² = 1 000 000 m².",
        ],
    en: [
          "Formula: A = L × w.",
          "Example: 8 cm × 5 cm → A = 40 cm².",
          "Finding width: w = A ÷ L.",
          "Units: 1 m² = 10,000 cm².",
        ],
    ar: [
          "الصيغة: A = L × l.",
          "مثال: 8 سم × 5 سم → A = 40 سم².",
          "العرض من المساحة: l = A ÷ L.",
          "الوحدات: 1 م² = 10 000 سم².",
        ],
    fa: [
          "فرمول: A = L × l.",
          "مثال: 8 سانتیمتر × 5 سانتیمتر → A = 40 سانتیمتر².",
          "عرض از مساحت: l = A ÷ L.",
          "واحدها: 1 م² = 10000 سانتیمتر².",
        ],
    ti: [
          "ቅጥዒ: A = L × l.",
          "ምሳሌ: 8 ሰም × 5 ሰም → A = 40 ሰም².",
          "ወርሓዊ ካብ ሰፊሓ: l = A ÷ L.",
          "ኣሃዙ: 1 ም² = 10000 ሰም².",
        ],
    uk: [
          "Формула: A = L × l.",
          "Приклад: 8 см × 5 см → A = 40 см².",
          "Ширина зі площі: l = A ÷ L.",
          "Одиниці: 1 м² = 10 000 см².",
        ],
  },
  consignes: {
    "g3-2-e1": { fr: "Aire d'un rectangle 9 cm × 4 cm.", en: "Area of a rectangle 9 cm × 4 cm.",
      ar: "مساحة مستطيل 9 سم × 4 سم.",
      fa: "مساحت مستطیل ۹ سانتی‌متر × ۴ سانتی‌متر.",
      pt: "Área de um rectângulo 9 cm × 4 cm.",
      so: "Aagga lix-jibaaro 9 cm × 4 cm.",
      ti: "9 ሰ.ሜ × 4 ሰ.ሜ ሕቡሳ ስፍሓት።",
      tr: "9 cm × 4 cm dikdörtgenin alanı.",
      ps: "د 9 سم × 4 سم مستطیل مساحت.",
      uk: "Площа прямокутника 9 см × 4 см." },
    "g3-2-e2": { fr: "Rectangle d'aire 60 cm² et longueur 12 cm. Largeur = ?", en: "Rectangle with area 60 cm² and length 12 cm. Width = ?",
      ar: "مستطيل مساحته 60 سم² وطوله 12 سم. العرض = ؟",
      fa: "مستطیلی با مساحت ۶۰ سانتی‌متر مربع و طول ۱۲ سانتی‌متر. عرض = ؟",
      pt: "Rectângulo com área 60 cm² e comprimento 12 cm. Largura = ?",
      so: "Lix-jibaaro leh aag 60 cm² iyo dherer 12 cm. Ballaadhka = ?",
      ti: "60 ሰ.ሜ² ስፍሓትን 12 ሰ.ሜ ንውሓትን ዘለዎ ሕቡሳ። ወርሑ = ?",
      tr: "Alanı 60 cm² ve uzunluğu 12 cm olan dikdörtgen. Genişlik = ?",
      ps: "د 60 سم² مساحت او 12 سم اوږدوالی لرونکی مستطیل. پلنوالی = ؟",
      uk: "Прямокутник із площею 60 см² і довжиною 12 см. Ширина = ?" },
    "g3-2-e3": { fr: "Aire d'un rectangle 7 m × 3 m.", en: "Area of a rectangle 7 m × 3 m.",
      ar: "مساحة مستطيل 7 م × 3 م.",
      fa: "مساحت مستطیل ۷ متر × ۳ متر.",
      pt: "Área de um rectângulo 7 m × 3 m.",
      so: "Aagga lix-jibaaro 7 m × 3 m.",
      ti: "7 ሜ × 3 ሜ ሕቡሳ ስፍሓት።",
      tr: "7 m × 3 m dikdörtgenin alanı.",
      ps: "د 7 م × 3 م مستطیل مساحت.",
      uk: "Площа прямокутника 7 м × 3 м." },
    "g3-2-e4": { fr: "1 m² = combien de cm² ?", en: "1 m² = how many cm²?",
      ar: "1 م² = كم سم²؟",
      fa: "۱ متر مربع = چند سانتی‌متر مربع؟",
      pt: "1 m² = quantos cm²?",
      so: "1 m² = imisa cm²?",
      ti: "1 ሜ² = ክንደይ ሰ.ሜ²?",
      tr: "1 m² = kaç cm²?",
      ps: "1 م² = کچه سم²؟",
      uk: "1 м² = скільки см²?" },
    "g3-2-e5": { fr: "Rectangle 15 cm × 6 cm. Aire = ?", en: "Rectangle 15 cm × 6 cm. Area = ?",
      ar: "مستطيل 15 سم × 6 سم. المساحة = ؟",
      fa: "مستطیل ۱۵ سانتی‌متر × ۶ سانتی‌متر. مساحت = ؟",
      pt: "Rectângulo 15 cm × 6 cm. Área = ?",
      so: "Lix-jibaaro 15 cm × 6 cm. Aagga = ?",
      ti: "15 ሰ.ሜ × 6 ሰ.ሜ ሕቡሳ። ስፍሓት = ?",
      tr: "15 cm × 6 cm dikdörtgen. Alan = ?",
      ps: "مستطیل 15 سم × 6 سم. مساحت = ؟",
      uk: "Прямокутник 15 см × 6 см. Площа = ?" },
  },
};
