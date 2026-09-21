import type { SubmoduleTrad } from "./trad-types";

const S = (fr: string, en: string, ar: string, fa: string, ti: string, uk: string, pt: string, so: string, tr: string, ps: string) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

const A = (fr: string[], en: string[], ar: string[], fa: string[], ti: string[], uk: string[], pt: string[], so: string[], tr: string[], ps: string[]) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

export const TRAD_G3_2: SubmoduleTrad = {
  submoduleId: "G3-2",
  title: {
    fr: "Périmètre du rectangle",
    en: "Perimeter of a rectangle",
    ar: "محيط المستطيل",
    fa: "محیط مستطیل",
    ti: "ናይ ካሬ-ሓለቃ ዙሪያ",
    uk: "Периметр прямокутника",
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
      "Mustadiil",
      "Dikdörtgen",
      "مستطیل"
    ) },

    // 1 — plain
    { text: S(
      "Un rectangle a **deux longueurs L** (côtés horizontaux) et **deux largeurs l** (côtés verticaux).",
      "A rectangle has **two lengths L** (horizontal sides) and **two widths l** (vertical sides).",
      "المستطيل له **طولان L** (الأضلاع الأفقية) و**عرضان l** (الأضلاع الرأسية).",
      "مستطیل **دو طول L** (اضلاع افقی) و **دو عرض l** (اضلاع عمودی) دارد.",
      "ካሬ-ሓለቃ **ክልተ ቁምናኦቲ L** (ወዲ ጎቦ) ን **ክልተ ወርሓዊ l** (ቀጥ ጎቦ) ዘለዎ ዩ።",
      "Прямокутник має **дві довжини L** (горизонтальні сторони) і **дві ширини l** (вертикальні сторони).",
      "Um retângulo tem **dois comprimentos L** (lados horizontais) e **duas larguras l** (lados verticais).",
      "Mustadiilku wuxuu leeyahay **laba dherer L** (dhinacyada u dhuuban) iyo **laba ballac l** (dhinacyada toosan).",
      "Bir dikdörtgenin **iki uzunluğu L** (yatay kenarlar) ve **iki genişliği l** (dikey kenarlar) vardır.",
      "مستطیل **دو اوږدوالی L** (افقي اړخونه) او **دو پلن‌والی l** (عمودي اړخونه) لري."
    ) },

    // 2 — rule "Formule" itemsFr ["P = 2L + 2l", "= 2 × (L + l)"]
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
      ["P = 2L + 2l", "= 2 × (L + l)"],
      ["P = 2L + 2l", "= 2 × (L + l)"],
      ["P = 2L + 2l", "= 2 × (L + l)"],
      ["P = 2L + 2l", "= 2 × (L + l)"],
      ["P = 2L + 2l", "= 2 × (L + l)"],
      ["P = 2L + 2l", "= 2 × (L + l)"],
      ["P = 2L + 2l", "= 2 × (L + l)"],
      ["P = 2L + 2l", "= 2 × (L + l)"],
      ["P = 2L + 2l", "= 2 × (L + l)"],
      ["P = 2L + 2l", "= 2 × (L + l)"]
    ) },

    // 3 — highlight "Exemple"
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

    // 4 — section labelFr "" itemsFr ["Rectangle 8 cm × 5 cm :", "P = 2 × (8 + 5) = 2 × 13 = **26 cm**"]
    { label: S("", "", "", "", "", "", "", "", "", ""),
      items: A(
        ["Rectangle 8 cm × 5 cm :", "P = 2 × (8 + 5) = 2 × 13 = **26 cm**"],
        ["Rectangle 8 cm × 5 cm:", "P = 2 × (8 + 5) = 2 × 13 = **26 cm**"],
        ["مستطيل 8 سم × 5 سم:", "P = 2 × (8 + 5) = 2 × 13 = **26 سم**"],
        ["مستطیل 8 سانتیمتر × 5 سانتیمتر:", "P = 2 × (8 + 5) = 2 × 13 = **26 سانتیمتر**"],
        ["ካሬ-ሓለቃ 8 ሰም × 5 ሰም:", "P = 2 × (8 + 5) = 2 × 13 = **26 ሰም**"],
        ["Прямокутник 8 см × 5 см:", "P = 2 × (8 + 5) = 2 × 13 = **26 см**"],
        ["Retângulo 8 cm × 5 cm:", "P = 2 × (8 + 5) = 2 × 13 = **26 cm**"],
        ["Mustadiil 8 cm × 5 cm:", "P = 2 × (8 + 5) = 2 × 13 = **26 cm**"],
        ["8 cm × 5 cm dikdörtgen:", "P = 2 × (8 + 5) = 2 × 13 = **26 cm**"],
        ["د 8 سم × 5 سم مستطیل:", "P = 2 × (8 + 5) = 2 × 13 = **26 سم**"]
      )
    },

    // 5 — svg captionFr "Rectangle L × l — P = 2(L + l)"
    { caption: S(
      "Rectangle L × l — P = 2(L + l)",
      "Rectangle L × l — P = 2(L + l)",
      "مستطيل L × l — P = 2(L + l)",
      "مستطیل L × l — P = 2(L + l)",
      "ካሬ-ሓለቃ L × l — P = 2(L + l)",
      "Прямокутник L × l — P = 2(L + l)",
      "Retângulo L × l — P = 2(L + l)",
      "Mustadiil L × l — P = 2(L + l)",
      "Dikdörtgen L × l — P = 2(L + l)",
      "مستطیل L × l — P = 2(L + l)"
    ) },

    // 6 — highlight "Retrouver la largeur"
    { text: S(
      "Retrouver la largeur",
      "Finding the width",
      "إيجاد العرض",
      "یافتن عرض",
      "ወርሓዊ ምርካብ",
      "Знайти ширину",
      "Encontrar a largura",
      "Helitaanka ballaca",
      "Genişliği bulmak",
      "پلن‌والی موندل"
    ) },

    // 7 — section labelFr "" itemsFr ["Si on connaît P et L : l = (P ÷ 2) − L"]
    { label: S("", "", "", "", "", "", "", "", "", ""),
      items: A(
        ["Si on connaît P et L : l = (P ÷ 2) − L"],
        ["If P and L are known: l = (P ÷ 2) − L"],
        ["إذا عُرف P وL : l = (P ÷ 2) − L"],
        ["اگر P و L معلوم باشند: l = (P ÷ 2) − L"],
        ["P ን L እንተፈሊጥናዮ: l = (P ÷ 2) − L"],
        ["Якщо P і L відомі: l = (P ÷ 2) − L"],
        ["Se P e L são conhecidos: l = (P ÷ 2) − L"],
        ["Haddii P iyo L la yaqaan: l = (P ÷ 2) − L"],
        ["P ve L biliniyorsa: l = (P ÷ 2) − L"],
        ["که P او L معلوم وي: l = (P ÷ 2) − L"]
      )
    },
  ],
  paragraphs: {
    fr: [
          "Un rectangle a deux longueurs (L) et deux largeurs (l).",
          "Formule : P = 2L + 2l = 2(L + l).",
          "Exemple : rectangle 8 cm × 5 cm → P = 2(8 + 5) = 2 × 13 = 26 cm.",
          "Si on connaît le périmètre et la longueur : l = (P ÷ 2) − L.",
        ],
    en: [
          "A rectangle has two lengths (L) and two widths (w).",
          "Formula: P = 2L + 2w = 2(L + w).",
          "Example: 8 cm × 5 cm → P = 2(13) = 26 cm.",
          "Finding width: w = (P ÷ 2) − L.",
        ],
    ar: [
          "المستطيل له طولان (L) وعرضان (l).",
          "الصيغة: P = 2(L + l).",
          "مثال: 8 سم × 5 سم → P = 26 سم.",
          "إيجاد العرض: l = (P ÷ 2) − L.",
        ],
    fa: [
          "مستطیل دو طول (L) و دو عرض (l) دارد.",
          "فرمول: P = 2(L + l).",
          "مثال: 8 سانتیمتر × 5 سانتیمتر → P = 26 سانتیمتر.",
          "یافتن عرض: l = (P ÷ 2) − L.",
        ],
    ti: [
          "ካሬ-ሓለቃ ክልተ ቁምናኦቲ (L) ን ክልተ ወርሓዊ (l) ዘለዎ ዩ.",
          "ቅጥዒ: P = 2(L + l).",
          "ምሳሌ: 8 ሰም × 5 ሰም → P = 26 ሰም.",
          "ወርሓዊ ምርካብ: l = (P ÷ 2) − L.",
        ],
    uk: [
          "Прямокутник має дві довжини (L) і дві ширини (l).",
          "Формула: P = 2(L + l).",
          "Приклад: 8 см × 5 см → P = 26 см.",
          "Знайти ширину: l = (P ÷ 2) − L.",
        ],
  },
  consignes: {
    "g2-2-e1": { fr: "Calcule le périmètre d'un rectangle 10 cm × 4 cm.", en: "Calculate the perimeter of a rectangle 10 cm × 4 cm.",
      ar: "احسب محيط مستطيل 10 سم × 4 سم.",
      fa: "محیط مستطیل ۱۰ سانتی‌متر × ۴ سانتی‌متر را حساب کنید.",
      pt: "Calcula o perímetro de um rectângulo 10 cm × 4 cm.",
      so: "Xisaabi goobaaha lix-jibaaro 10 cm × 4 cm.",
      ti: "10 ሰ.ሜ × 4 ሰ.ሜ ሕቡሳ ኣካፋ ሒሳብ ግበር።",
      tr: "10 cm × 4 cm dikdörtgenin çevresini hesaplayın.",
      ps: "د 10 سم × 4 سم مستطیل محیط حساب کړئ.",
      uk: "Обчисліть периметр прямокутника 10 см × 4 см." },
    "g2-2-e2": { fr: "Rectangle de périmètre 30 cm et longueur 10 cm. Largeur = ?", en: "Rectangle with perimeter 30 cm et longueur 10 cm. Width = ?",
      ar: "مستطيل محيطه 30 سم وطوله 10 سم. عرضه = ؟",
      fa: "مستطیلی با محیط ۳۰ سانتی‌متر و طول ۱۰ سانتی‌متر. عرض = ؟",
      pt: "Rectângulo com perímetro 30 cm e comprimento 10 cm. Largura = ?",
      so: "Lix-jibaaro leh goobaah 30 cm iyo dherer 10 cm. Ballaadhka = ?",
      ti: "30 ሰ.ሜ ኣካፋን 10 ሰ.ሜ ንውሓትን ዘለዎ ሕቡሳ። ወርሑ = ?",
      tr: "Çevresi 30 cm ve uzunluğu 10 cm olan dikdörtgen. Genişlik = ?",
      ps: "د 30 سم محیط او 10 سم اوږدوالی لرونکی مستطیل. پلنوالی = ؟",
      uk: "Прямокутник із периметром 30 см і довжиною 10 см. Ширина = ?" },
    "g2-2-e3": { fr: "Calcule le périmètre d'un rectangle 7 m × 3 m.", en: "Calculate the perimeter of a rectangle 7 m × 3 m.",
      ar: "احسب محيط مستطيل 7 م × 3 م.",
      fa: "محیط مستطیل ۷ متر × ۳ متر را حساب کنید.",
      pt: "Calcula o perímetro de um rectângulo 7 m × 3 m.",
      so: "Xisaabi goobaaha lix-jibaaro 7 m × 3 m.",
      ti: "7 ሜ × 3 ሜ ሕቡሳ ኣካፋ ሒሳብ ግበር።",
      tr: "7 m × 3 m dikdörtgenin çevresini hesaplayın.",
      ps: "د 7 م × 3 م مستطیل محیط حساب کړئ.",
      uk: "Обчисліть периметр прямокутника 7 м × 3 м." },
    "g2-2-e4": { fr: "Un rectangle 6 cm × 6 cm est-il un carré ? (oui/non)", en: "Is a 6 cm × 6 cm rectangle a square? (yes/no)",
      ar: "هل مستطيل 6 سم × 6 سم هو مربع؟ (نعم/لا)",
      fa: "آیا مستطیل ۶ سانتی‌متر × ۶ سانتی‌متر یک مربع است؟ (بله/خیر)",
      pt: "Um rectângulo 6 cm × 6 cm é um quadrado? (sim/não)",
      so: "Ma lix-jibaaro 6 cm × 6 cm waa afar-jibaaro? (haa/maya)",
      ti: "6 ሰ.ሜ × 6 ሰ.ሜ ሕቡሳ ጎዳጉዲ ድዩ? (እወ/ኣይፋል)",
      tr: "6 cm × 6 cm dikdörtgen kare midir? (evet/hayır)",
      ps: "ایا 6 سم × 6 سم مستطیل مربع دی؟ (هو/نه)",
      uk: "Чи є прямокутник 6 см × 6 см квадратом? (так/ні)" },
    "g2-2-e5": { fr: "Rectangle 12 cm × 5 cm. Calcule P.", en: "Rectangle 12 cm × 5 cm. Calculate P.",
      ar: "مستطيل 12 سم × 5 سم. احسب المحيط.",
      fa: "مستطیل ۱۲ سانتی‌متر × ۵ سانتی‌متر. محیط را حساب کنید.",
      pt: "Rectângulo 12 cm × 5 cm. Calcula P.",
      so: "Lix-jibaaro 12 cm × 5 cm. Xisaabi P.",
      ti: "12 ሰ.ሜ × 5 ሰ.ሜ ሕቡሳ። P ሒሳብ ግበር።",
      tr: "12 cm × 5 cm dikdörtgen. P hesaplayın.",
      ps: "مستطیل 12 سم × 5 سم. P حساب کړئ.",
      uk: "Прямокутник 12 см × 5 см. Обчисліть P." },
  },
};
