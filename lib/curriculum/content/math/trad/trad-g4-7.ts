import type { SubmoduleTrad } from "./trad-types";

const S = (fr: string, en: string, ar: string, fa: string, ti: string, uk: string, pt: string, so: string, tr: string, ps: string) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

const A = (fr: string[], en: string[], ar: string[], fa: string[], ti: string[], uk: string[], pt: string[], so: string[], tr: string[], ps: string[]) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

export const TRAD_G4_7: SubmoduleTrad = {
  submoduleId: "G4-7",
  title: {
    fr: "Losange",
    en: "Rhombus",
    ar: "المعين",
    fa: "لوزی",
    ti: "ሎዛንጅ",
    uk: "Ромб",
    pt: "Losango",
    so: "Rhombus",
    tr: "Eşkenar dörtgen",
    ps: "لوزي شکل",
  },
  blocks: [
    // 0 — heading "Losange" (black)
    { text: S(
      "Losange",
      "Rhombus",
      "المعين",
      "لوزی",
      "ሎዛንጅ",
      "Ромб",
      "Losango",
      "Rhombus",
      "Eşkenar dörtgen",
      "لوزي شکل"
    ) },

    // 1 — plain
    { text: S(
      "Un **losange** est un quadrilatère dont les quatre côtés ont la même longueur. On peut calculer son **périmètre** avec le côté, et son **aire** avec les diagonales.",
      "A **rhombus** is a quadrilateral whose four sides have the same length. Its **perimeter** is calculated with the side, and its **area** with the diagonals.",
      "**المعين** هو رباعي الأضلاع الذي تتساوى أضلاعه الأربعة. يُحسب **محيطه** بالضلع، و**مساحته** بالقطرين.",
      "**لوزی** یک چهارضلعی است که چهار ضلع آن هم‌اندازه‌اند. **محیط** آن با ضلع و **مساحت** آن با قطرها محاسبه می‌شود.",
      "**ሎዛንጅ** ኣርባዕተ ማዕረ ዝኾኑ ጎናት ዘለዎ ኣርባዕ-ጎቦ ዩ። **ዙርያኡ** ብጎቦ, **ሰፊሓኡ** ብዲያጎናላት ዝሕሰብ ዩ።",
      "**Ромб** — це чотирикутник із чотирма рівними сторонами. **Периметр** обчислюють за стороною, а **площу** за діагоналями.",
      "Um **losango** é um quadrilátero cujos quatro lados têm o mesmo comprimento. O **perímetro** calcula-se com o lado, e a **área** com as diagonais.",
      "**Rhombus-ku** waa afar-xagal afarta dhinacyadiisuba isku dherer yihiin. **Wareeggiisa** waxaa lagu xisaabiyaa dhinaca, **bedkiisana** xariiqyada dhex mara.",
      "**Eşkenar dörtgen**, dört kenarı eşit uzunlukta olan bir dörtgendir. **Çevresi** kenarla, **alanı** köşegenlerle hesaplanır.",
      "**لوزي شکل** یو څلور اړخیز شکل دی چې د هغه څلور اړخونه برابر اوږدوالی لري. **محیط** يې د اړخ سره او **مساحت** يې د قطرونو سره حسابېږي."
    ) },

    // 2 — rule "Formules"
    { label: S(
        "Formules", "Formulas", "الصيغ", "فرمول‌ها", "ቅጥዕታት", "Формули", "Fórmulas", "Qaacidooyinka", "Formüller", "فورمولونه"
      ),
      items: A(
        ["P = 4 × c", "A = (d₁ × d₂) ÷ 2"],
        ["P = 4 × c", "A = (d₁ × d₂) ÷ 2"],
        ["P = 4 × c", "A = (d₁ × d₂) ÷ 2"],
        ["P = 4 × c", "A = (d₁ × d₂) ÷ 2"],
        ["P = 4 × c", "A = (d₁ × d₂) ÷ 2"],
        ["P = 4 × c", "A = (d₁ × d₂) ÷ 2"],
        ["P = 4 × c", "A = (d₁ × d₂) ÷ 2"],
        ["P = 4 × c", "A = (d₁ × d₂) ÷ 2"],
        ["P = 4 × c", "A = (d₁ × d₂) ÷ 2"],
        ["P = 4 × c", "A = (d₁ × d₂) ÷ 2"]
      )
    },

    // 3 — svg with captionFr
    { caption: S(
      "Losange : quatre côtés égaux et deux diagonales",
      "Rhombus: four equal sides and two diagonals",
      "المعين: أربعة أضلاع متساوية وقطران",
      "لوزی: چهار ضلع مساوی و دو قطر",
      "ሎዛንጅ: ኣርባዕተ ማዕረ ጎናት ን ክልተ ዲያጎናላት",
      "Ромб: чотири рівні сторони і дві діагоналі",
      "Losango: quatro lados iguais e duas diagonais",
      "Rhombus: afar dhinac oo isku dheer iyo laba xariiq oo dhex mara",
      "Eşkenar dörtgen: dört eşit kenar ve iki köşegen",
      "لوزي شکل: څلور برابر اړخونه او دوه قطرونه"
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
          "Losange de côté 5 cm, diagonales 6 cm et 8 cm :",
          "P = 4 × 5 = **20 cm**",
          "A = (6 × 8) ÷ 2 = **24 cm²**",
        ],
        [
          "Rhombus with side 5 cm, diagonals 6 cm and 8 cm:",
          "P = 4 × 5 = **20 cm**",
          "A = (6 × 8) ÷ 2 = **24 cm²**",
        ],
        [
          "معين بضلع 5 سم، قطران 6 سم و 8 سم:",
          "P = 4 × 5 = **20 سم**",
          "A = (6 × 8) ÷ 2 = **24 سم²**",
        ],
        [
          "لوزی با ضلع 5 سانتیمتر، قطرهای 6 سانتیمتر و 8 سانتیمتر:",
          "P = 4 × 5 = **20 سانتیمتر**",
          "A = (6 × 8) ÷ 2 = **24 سانتیمتر²**",
        ],
        [
          "ሎዛንጅ ናይ 5 ሰም ጎቦ, ዲያጎናላት 6 ሰም ን 8 ሰም:",
          "P = 4 × 5 = **20 ሰም**",
          "A = (6 × 8) ÷ 2 = **24 ሰም²**",
        ],
        [
          "Ромб зі стороною 5 см, діагоналі 6 см і 8 см:",
          "P = 4 × 5 = **20 см**",
          "A = (6 × 8) ÷ 2 = **24 см²**",
        ],
        [
          "Losango com lado 5 cm, diagonais 6 cm e 8 cm:",
          "P = 4 × 5 = **20 cm**",
          "A = (6 × 8) ÷ 2 = **24 cm²**",
        ],
        [
          "Rhombus dhinac 5 cm leh, xariiqyada dhex mara 6 cm iyo 8 cm:",
          "P = 4 × 5 = **20 cm**",
          "A = (6 × 8) ÷ 2 = **24 cm²**",
        ],
        [
          "5 cm kenarlı eşkenar dörtgen, köşegenler 6 cm ve 8 cm:",
          "P = 4 × 5 = **20 cm**",
          "A = (6 × 8) ÷ 2 = **24 cm²**",
        ],
        [
          "د 5 سم اړخ لوزي شکل، قطرونه 6 سم او 8 سم:",
          "P = 4 × 5 = **20 سم**",
          "A = (6 × 8) ÷ 2 = **24 سم²**",
        ]
      )
    },
  ],
  paragraphs: {
    fr: [
      "Un losange a quatre côtés de même longueur.",
      "Son périmètre se calcule avec P = 4 × c.",
      "Son aire se calcule avec les diagonales : A = (d₁ × d₂) ÷ 2.",
    ],
    en: [
      "A rhombus has four sides of the same length.",
      "Its perimeter is calculated with P = 4 × c.",
      "Its area is calculated with the diagonals: A = (d₁ × d₂) ÷ 2.",
    ],
    ar: [
      "المعين له أربعة أضلاع متساوية الطول.",
      "نحسب محيطه بالصيغة P = 4 × c.",
      "نحسب مساحته بالقطرين: A = (d₁ × d₂) ÷ 2.",
    ],
    fa: [
      "لوزی چهار ضلع هم‌اندازه دارد.",
      "محیط آن با P = 4 × c محاسبه می‌شود.",
      "مساحت آن با قطرها محاسبه می‌شود: A = (d₁ × d₂) ÷ 2.",
    ],
    ti: [
      "ሎዛንጅ ኣርባዕተ ማዕረ ዝኾኑ ጎናት ኣለዎ።",
      "ዙርያኡ ብ P = 4 × c ይሕሰብ።",
      "ስፍሓቱ ብዲያጎናላት ይሕሰብ፦ A = (d₁ × d₂) ÷ 2።",
    ],
    uk: [
      "Ромб має чотири сторони однакової довжини.",
      "Його периметр обчислюють за формулою P = 4 × c.",
      "Його площу обчислюють за діагоналями: A = (d₁ × d₂) ÷ 2.",
    ],
    pt: [
      "Um losango tem quatro lados com o mesmo comprimento.",
      "O seu perímetro calcula-se com P = 4 × c.",
      "A sua área calcula-se com as diagonais: A = (d₁ × d₂) ÷ 2.",
    ],
    so: [
      "Rhombus-ku wuxuu leeyahay afar dhinac oo isku dherer ah.",
      "Wareeggiisa waxaa lagu xisaabiyaa P = 4 × c.",
      "Bedkiisa waxaa lagu xisaabiyaa xariiqyada dhex mara: A = (d₁ × d₂) ÷ 2.",
    ],
    tr: [
      "Eşkenar dörtgenin dört kenarı aynı uzunluktadır.",
      "Çevresi P = 4 × c ile hesaplanır.",
      "Alanı köşegenlerle hesaplanır: A = (d₁ × d₂) ÷ 2.",
    ],
    ps: [
      "لوزي شکل څلور برابر اړخونه لري.",
      "محیط يې د P = 4 × c په فورمول حسابېږي.",
      "مساحت يې د قطرونو په مرسته حسابېږي: A = (d₁ × d₂) ÷ 2.",
    ],
  },
  consignes: {
    "g3-7-e1": { fr: "Losange de côté 5 cm. Périmètre = ?", en: "Rhombus with side 5 cm. Perimeter = ?",
      ar: "لوزي طول ضلعه 5 سم. المحيط = ؟",
      fa: "لوزی با ضلع ۵ سانتی‌متر. محیط = ؟",
      pt: "Losango com lado 5 cm. Perímetro = ?",
      so: "Xagleenka leh dhinac 5 cm. Goobaaha = ?",
      ti: "5 ሰ.ሜ ሸነኽ ዘለዎ ሮምቡስ። ኣካፋ = ?",
      tr: "Kenarı 5 cm olan eşkenar dörtgen. Çevre = ?",
      ps: "د 5 سم اړخ لرونکی لوزي. محیط = ؟",
      uk: "Ромб зі стороною 5 см. Периметр = ?" },
    "g3-7-e2": { fr: "Losange de diagonales 6 cm et 8 cm. Aire = ?", en: "Rhombus with diagonals 6 cm and 8 cm. Area = ?",
      ar: "لوزي قطراه 6 سم و 8 سم. المساحة = ؟",
      fa: "لوزی با قطرهای ۶ سانتی‌متر و ۸ سانتی‌متر. مساحت = ؟",
      pt: "Losango com diagonais 6 cm e 8 cm. Área = ?",
      so: "Xagleenka leh labada xariiqood 6 cm iyo 8 cm. Aagga = ?",
      ti: "6 ሰ.ሜን 8 ሰ.ሜን ዲያጎናሌ ዘለዎ ሮምቡስ። ስፍሓት = ?",
      tr: "Köşegenleri 6 cm ve 8 cm olan eşkenar dörtgen. Alan = ?",
      ps: "د 6 سم او 8 سم قطرونو لرونکی لوزي. مساحت = ؟",
      uk: "Ромб із діагоналями 6 см і 8 см. Площа = ?" },
    "g3-7-e3": { fr: "Losange de côté 7,5 cm. Périmètre = ?", en: "Rhombus with side 7.5 cm. Perimeter = ?",
      ar: "لوزي طول ضلعه 7,5 سم. المحيط = ؟",
      fa: "لوزی با ضلع ۷٫۵ سانتی‌متر. محیط = ؟",
      pt: "Losango com lado 7,5 cm. Perímetro = ?",
      so: "Xagleenka leh dhinac 7,5 cm. Goobaaha = ?",
      ti: "7,5 ሰ.ሜ ሸነኽ ዘለዎ ሮምቡስ። ኣካፋ = ?",
      tr: "Kenarı 7,5 cm olan eşkenar dörtgen. Çevre = ?",
      ps: "د 7,5 سم اړخ لرونکی لوزي. محیط = ؟",
      uk: "Ромб зі стороною 7,5 см. Периметр = ?" },
    "g3-7-e4": { fr: "Losange de diagonales 10 cm et 12 cm. Aire = ?", en: "Rhombus with diagonals 10 cm and 12 cm. Area = ?",
      ar: "لوزي قطراه 10 سم و 12 سم. المساحة = ؟",
      fa: "لوزی با قطرهای ۱۰ سانتی‌متر و ۱۲ سانتی‌متر. مساحت = ؟",
      pt: "Losango com diagonais 10 cm e 12 cm. Área = ?",
      so: "Xagleenka leh labada xariiqood 10 cm iyo 12 cm. Aagga = ?",
      ti: "10 ሰ.ሜን 12 ሰ.ሜን ዲያጎናሌ ዘለዎ ሮምቡስ። ስፍሓት = ?",
      tr: "Köşegenleri 10 cm ve 12 cm olan eşkenar dörtgen. Alan = ?",
      ps: "د 10 سم او 12 سم قطرونو لرونکی لوزي. مساحت = ؟",
      uk: "Ромб із діагоналями 10 см і 12 см. Площа = ?" },
    "g3-7-e5": { fr: "Losange de diagonales 9 cm et 14 cm. Aire = ?", en: "Rhombus with diagonals 9 cm and 14 cm. Area = ?",
      ar: "لوزي قطراه 9 سم و 14 سم. المساحة = ؟",
      fa: "لوزی با قطرهای ۹ سانتی‌متر و ۱۴ سانتی‌متر. مساحت = ؟",
      pt: "Losango com diagonais 9 cm e 14 cm. Área = ?",
      so: "Xagleenka leh labada xariiqood 9 cm iyo 14 cm. Aagga = ?",
      ti: "9 ሰ.ሜን 14 ሰ.ሜን ዲያጎናሌ ዘለዎ ሮምቡስ። ስፍሓት = ?",
      tr: "Köşegenleri 9 cm ve 14 cm olan eşkenar dörtgen. Alan = ?",
      ps: "د 9 سم او 14 سم قطرونو لرونکی لوزي. مساحت = ؟",
      uk: "Ромб із діагоналями 9 см і 14 см. Площа = ?" },
  },
};
