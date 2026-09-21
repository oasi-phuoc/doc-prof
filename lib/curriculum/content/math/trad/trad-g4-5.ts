import type { SubmoduleTrad } from "./trad-types";

const S = (fr: string, en: string, ar: string, fa: string, ti: string, uk: string, pt: string, so: string, tr: string, ps: string) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

const A = (fr: string[], en: string[], ar: string[], fa: string[], ti: string[], uk: string[], pt: string[], so: string[], tr: string[], ps: string[]) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

export const TRAD_G4_5: SubmoduleTrad = {
  submoduleId: "G4-5",
  title: {
    fr: "Aire du trapèze",
    en: "Area of a trapezoid",
    ar: "مساحة شبه المنحرف",
    fa: "مساحت ذوزنقه",
    ti: "ናይ ትራፔዞይድ ሰፊሓ",
    uk: "Площа трапеції",
  },
  blocks: [
    // 0 — heading "Trapèze" (black)
    { text: S(
      "Trapèze",
      "Trapezoid",
      "شبه المنحرف",
      "ذوزنقه",
      "ትራፔዞይድ",
      "Трапеція",
      "Trapézio",
      "Trapezoid",
      "Yamuk",
      "ذوزنقه"
    ) },

    // 1 — plain
    { text: S(
      "Un trapèze a **deux bases parallèles** : la grande base B (en bas) et la petite base b (en haut), reliées par une hauteur h.",
      "A trapezoid has **two parallel bases**: the large base B (bottom) and the small base b (top), connected by a height h.",
      "شبه المنحرف له **قاعدتان متوازيتان**: القاعدة الكبرى B (في الأسفل) والقاعدة الصغرى b (في الأعلى)، مرتبطتان بالارتفاع h.",
      "ذوزنقه دارای **دو قاعده موازی** است: قاعده بزرگ B (پایین) و قاعده کوچک b (بالا)، که با ارتفاع h به هم متصل هستند.",
      "ትራፔዞይድ **ክልተ ፓራሌሎ ሰረት** ኣለዎ: ዓቢ ሰረት B (ታሕቲ) ን ንእሽቶ ሰረት b (ላዕሊ), ብቁመት h ዝረሓቑ.",
      "Трапеція має **дві паралельні основи**: велику основу B (внизу) і малу основу b (вгорі), з'єднані висотою h.",
      "Um trapézio tem **duas bases paralelas**: a grande base B (em baixo) e a pequena base b (em cima), ligadas por uma altura h.",
      "Trapezoid-ku wuxuu leeyahay **laba saldhig oo is-wareega**: saldhigga waaweyn B (hoose) iyo saldhigga yar b (sare), ku xidhan dherer h.",
      "Yamukun **iki paralel tabanı** vardır: büyük taban B (altta) ve küçük taban b (üstte), h yüksekliğiyle bağlıdır.",
      "ذوزنقه **دوه موازي قاعدې** لري: لویه قاعده B (لاندې) او کوچنۍ قاعده b (پورته)، د لوړوالي h سره تړلي."
    ) },

    // 2 — rule "Formule"
    { label: S(
        "Formule", "Formula", "الصيغة", "فرمول", "ቅጥዒ", "Формула", "Fórmula", "Qaacidada", "Formül", "فورمول"
      ),
      items: A(
        ["A = (B + b) × h ÷ 2"],
        ["A = (B + b) × h ÷ 2"],
        ["A = (B + b) × h ÷ 2"],
        ["A = (B + b) × h ÷ 2"],
        ["A = (B + b) × h ÷ 2"],
        ["A = (B + b) × h ÷ 2"],
        ["A = (B + b) × h ÷ 2"],
        ["A = (B + b) × h ÷ 2"],
        ["A = (B + b) × h ÷ 2"],
        ["A = (B + b) × h ÷ 2"]
      )
    },

    // 3 — svg with captionFr
    { caption: S(
      "Trapèze — grande base B, petite base b, hauteur h à l'extérieur",
      "Trapezoid — large base B, small base b, height h outside",
      "شبه المنحرف — القاعدة الكبرى B، القاعدة الصغرى b، الارتفاع h خارجي",
      "ذوزنقه — قاعده بزرگ B، قاعده کوچک b، ارتفاع h در خارج",
      "ትራፔዞይድ — ዓቢ ሰረት B, ንእሽቶ ሰረት b, ቁመት h ደገ",
      "Трапеція — велика основа B, мала основа b, висота h зовні",
      "Trapézio — grande base B, pequena base b, altura h no exterior",
      "Trapezoid — saldhigga waaweyn B, saldhigga yar b, dhererka h dibadda",
      "Yamuk — büyük taban B, küçük taban b, dışarıda yükseklik h",
      "ذوزنقه — لویه قاعده B، کوچنۍ قاعده b، لوړوالی h بهر"
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
        [
          "B = 10 cm, b = 6 cm, h = 4 cm :",
          "A = (10 + 6) × 4 ÷ 2 = 16 × 4 ÷ 2 = **32 cm²**",
        ],
        [
          "B = 10 cm, b = 6 cm, h = 4 cm:",
          "A = (10 + 6) × 4 ÷ 2 = 16 × 4 ÷ 2 = **32 cm²**",
        ],
        [
          "B = 10 سم، b = 6 سم، h = 4 سم:",
          "A = (10 + 6) × 4 ÷ 2 = 16 × 4 ÷ 2 = **32 سم²**",
        ],
        [
          "B = 10 سانتیمتر، b = 6 سانتیمتر، h = 4 سانتیمتر:",
          "A = (10 + 6) × 4 ÷ 2 = 16 × 4 ÷ 2 = **32 سانتیمتر²**",
        ],
        [
          "B = 10 ሰም, b = 6 ሰም, h = 4 ሰም:",
          "A = (10 + 6) × 4 ÷ 2 = 16 × 4 ÷ 2 = **32 ሰም²**",
        ],
        [
          "B = 10 см, b = 6 см, h = 4 см:",
          "A = (10 + 6) × 4 ÷ 2 = 16 × 4 ÷ 2 = **32 см²**",
        ],
        [
          "B = 10 cm, b = 6 cm, h = 4 cm:",
          "A = (10 + 6) × 4 ÷ 2 = 16 × 4 ÷ 2 = **32 cm²**",
        ],
        [
          "B = 10 cm, b = 6 cm, h = 4 cm:",
          "A = (10 + 6) × 4 ÷ 2 = 16 × 4 ÷ 2 = **32 cm²**",
        ],
        [
          "B = 10 cm, b = 6 cm, h = 4 cm:",
          "A = (10 + 6) × 4 ÷ 2 = 16 × 4 ÷ 2 = **32 cm²**",
        ],
        [
          "B = 10 سم، b = 6 سم، h = 4 سم:",
          "A = (10 + 6) × 4 ÷ 2 = 16 × 4 ÷ 2 = **32 سم²**",
        ]
      )
    },

    // 6 — highlight "Intuition"
    { text: S(
      "Intuition",
      "Intuition",
      "البديهة",
      "شهود",
      "ሓሳብ",
      "Інтуїція",
      "Intuição",
      "Faham",
      "Sezgi",
      "احساس"
    ) },

    // 7 — section (label="", items)
    { label: S("", "", "", "", "", "", "", "", "", ""),
      items: A(
        [
          "La formule calcule la **moyenne des deux bases** (= base d'un rectangle équivalent) multipliée par la hauteur.",
          "Si b = B, le trapèze devient un **parallélogramme** (A = B × h).",
        ],
        [
          "The formula calculates the **average of the two bases** (= base of an equivalent rectangle) multiplied by the height.",
          "If b = B, the trapezoid becomes a **parallelogram** (A = B × h).",
        ],
        [
          "تحسب الصيغة **متوسط القاعدتين** (= قاعدة مستطيل مكافئ) مضروباً في الارتفاع.",
          "إذا كان b = B، يصبح شبه المنحرف **متوازي أضلاع** (A = B × h).",
        ],
        [
          "فرمول **میانگین دو قاعده** (= قاعده مستطیل معادل) ضربدر ارتفاع را محاسبه می‌کند.",
          "اگر b = B باشد، ذوزنقه به یک **متوازی‌الاضلاع** تبدیل می‌شود (A = B × h).",
        ],
        [
          "ቅጥዒ ናይ **ማእከላዊ ዋጋ ክልተ ሰረት** (= ሰረት ናይ ዝቃዶ ካሬ-ሓለቃ) ብቁመት ዝርባሕ ዩ።",
          "b = B ምስ ዝኸውን, ትራፔዞይድ ናብ **ፓራሌሎግራም** ይቕየር (A = B × h)።",
        ],
        [
          "Формула обчислює **середнє двох основ** (= основа еквівалентного прямокутника) помножене на висоту.",
          "Якщо b = B, трапеція стає **паралелограмом** (A = B × h).",
        ],
        [
          "A fórmula calcula a **média das duas bases** (= base de um retângulo equivalente) multiplicada pela altura.",
          "Se b = B, o trapézio torna-se um **paralelogramo** (A = B × h).",
        ],
        [
          "Qaaciddada waxay xisaabisaa **celceliska labada saldhig** (= saldhigga wareegsanaanta la mid ah) oo lagu dhufto dhererka.",
          "Haddii b = B, trapezoid-ku wuxuu noqdaa **parallelogram** (A = B × h).",
        ],
        [
          "Formül, **iki tabanın ortalamasını** (= eşdeğer dikdörtgenin tabanı) yüksekliğiyle çarpar.",
          "Eğer b = B ise, yamuk bir **paralel kenar dörtgene** dönüşür (A = B × h).",
        ],
        [
          "فورمول د **دوو قاعدو منځنۍ** (= د مساوي مستطیل قاعده) د لوړوالي سره ضرب حسابوي.",
          "که b = B وي، ذوزنقه یو **موازي الاضلاع** کېږي (A = B × h).",
        ]
      )
    },
  ],
  paragraphs: {
    fr: [
          "Le trapèze a deux bases parallèles (grande base B et petite base b) et une hauteur h.",
          "Formule : A = (B + b) × h ÷ 2.",
          "Exemple : trapèze avec B = 10 cm, b = 6 cm, h = 4 cm → A = (10 + 6) × 4 ÷ 2 = 32 cm².",
          "Intuition : la formule fait la moyenne des deux bases, multipliée par la hauteur (comme un rectangle de base moyenne).",
        ],
    en: [
          "A trapezoid has two parallel bases (B and b) and a height h.",
          "Formula: A = (B + b) × h ÷ 2.",
          "Example: B = 10 cm, b = 6 cm, h = 4 cm → A = (16) × 4 ÷ 2 = 32 cm².",
          "Intuition: average of the two bases times height.",
        ],
    ar: [
          "شبه المنحرف له قاعدتان متوازيتان (B وb) وارتفاع h.",
          "الصيغة: A = (B + b) × h ÷ 2.",
          "مثال: B=10، b=6، h=4 → A = 32 سم².",
          "الفكرة: متوسط القاعدتين مضروباً في الارتفاع.",
        ],
    fa: [
          "ذوزنقه دو قاعده موازی (B و b) و یک ارتفاع h دارد.",
          "فرمول: A = (B + b) × h ÷ 2.",
          "مثال: B=10، b=6، h=4 → A = 32 سانتیمتر².",
          "شهود: میانگین دو قاعده ضربدر ارتفاع.",
        ],
    ti: [
          "ትራፔዞይድ ክልተ ፓራሌሎ ሰረት (B ን b) ን ቁመት h ዘለዎ ዩ.",
          "ቅጥዒ: A = (B + b) × h ÷ 2.",
          "ምሳሌ: B=10, b=6, h=4 → A = 32 ሰም².",
          "ሓሳብ: ናይ ክልተ ሰረት ማእከላዊ ዋጋ ብቁመት ምርባሕ.",
        ],
    uk: [
          "Трапеція має дві паралельні основи (B і b) та висоту h.",
          "Формула: A = (B + b) × h ÷ 2.",
          "Приклад: B=10, b=6, h=4 → A = 32 см².",
          "Ідея: середнє двох основ, помножене на висоту.",
        ],
  },
  consignes: {
    "g3-5-e1": { fr: "Aire d'un trapèze : B = 8, b = 4, h = 5 cm.", en: "Area of a trapezoid: B = 8, b = 4, h = 5 cm.",
      ar: "مساحة شبه منحرف: B = 8، b = 4، h = 5 سم.",
      fa: "مساحت ذوزنقه: B = 8، b = 4، h = 5 سانتی‌متر.",
      pt: "Área de um trapézio: B = 8, b = 4, h = 5 cm.",
      so: "Aagga qaab-xagleedka: B = 8, b = 4, h = 5 cm.",
      ti: "ትራፔዚ ስፍሓት: B = 8, b = 4, h = 5 ሰ.ሜ።",
      tr: "Bir yamuğun alanı: B = 8, b = 4, h = 5 cm.",
      ps: "د ذوزنقې مساحت: B = 8، b = 4، h = 5 سم.",
      uk: "Площа трапеції: B = 8, b = 4, h = 5 см." },
    "g3-5-e2": { fr: "Aire d'un trapèze : B = 12, b = 6, h = 4 cm.", en: "Area of a trapezoid: B = 12, b = 6, h = 4 cm.",
      ar: "مساحة شبه منحرف: B = 12، b = 6، h = 4 سم.",
      fa: "مساحت ذوزنقه: B = 12، b = 6، h = 4 سانتی‌متر.",
      pt: "Área de um trapézio: B = 12, b = 6, h = 4 cm.",
      so: "Aagga qaab-xagleedka: B = 12, b = 6, h = 4 cm.",
      ti: "ትራፔዚ ስፍሓት: B = 12, b = 6, h = 4 ሰ.ሜ።",
      tr: "Bir yamuğun alanı: B = 12, b = 6, h = 4 cm.",
      ps: "د ذوزنقې مساحت: B = 12، b = 6، h = 4 سم.",
      uk: "Площа трапеції: B = 12, b = 6, h = 4 см." },
    "g3-5-e3": { fr: "Trapèze d'aire 40 cm², B = 10, b = 6. h = ?", en: "Trapezoid with area 40 cm², B = 10, b = 6. h = ?",
      ar: "شبه منحرف مساحته 40 سم²، B = 10، b = 6. الارتفاع h = ؟",
      fa: "ذوزنقه‌ای با مساحت ۴۰ سانتی‌متر مربع، B = 10، b = 6. ارتفاع h = ؟",
      pt: "Trapézio com área 40 cm², B = 10, b = 6. h = ?",
      so: "Qaab-xagleedka leh aag 40 cm², B = 10, b = 6. h = ?",
      ti: "40 ሰ.ሜ² ስፍሓት ዘለዎ ትራፔዚ, B = 10, b = 6። ቁመት h = ?",
      tr: "Alanı 40 cm², B = 10, b = 6 olan yamuk. h = ?",
      ps: "د 40 سم² مساحت لرونکی ذوزنقه، B = 10، b = 6. لوړوالی h = ؟",
      uk: "Трапеція з площею 40 см², B = 10, b = 6. h = ?" },
    "g3-5-e4": { fr: "Aire d'un trapèze : B = 9, b = 3, h = 6 cm.", en: "Area of a trapezoid: B = 9, b = 3, h = 6 cm.",
      ar: "مساحة شبه منحرف: B = 9، b = 3، h = 6 سم.",
      fa: "مساحت ذوزنقه: B = 9، b = 3، h = 6 سانتی‌متر.",
      pt: "Área de um trapézio: B = 9, b = 3, h = 6 cm.",
      so: "Aagga qaab-xagleedka: B = 9, b = 3, h = 6 cm.",
      ti: "ትራፔዚ ስፍሓት: B = 9, b = 3, h = 6 ሰ.ሜ።",
      tr: "Bir yamuğun alanı: B = 9, b = 3, h = 6 cm.",
      ps: "د ذوزنقې مساحت: B = 9، b = 3، h = 6 سم.",
      uk: "Площа трапеції: B = 9, b = 3, h = 6 см." },
    "g3-5-e5": { fr: "Si b = B (deux bases égales), quelle figure est-ce ?", en: "If b = B (two equal bases), what figure is it?",
      ar: "إذا كانت b = B (قاعدتان متساويتان)، ما الشكل الناتج؟",
      fa: "اگر b = B (دو قاعده مساوی)، چه شکلی است؟",
      pt: "Se b = B (duas bases iguais), que figura é essa?",
      so: "Haddii b = B (laba saldhig oo siman), maxay noqon doontaa xaaladda?",
      ti: "b = B (ክልተ ሰፊሕ ሸነኻት ማዕረ) እንተኾይኑ ዝፍጠር ቅርጺ እንታይ እዩ?",
      tr: "Eğer b = B (iki eşit taban) ise oluşan şekil nedir?",
      ps: "که b = B (دوه مساوي اساسونه)، نو کوم شکل دی؟",
      uk: "Якщо b = B (дві рівні основи), яка це фігура?" },
  },
};
