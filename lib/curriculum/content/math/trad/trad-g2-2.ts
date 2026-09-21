import type { SubmoduleTrad } from "./trad-types";

const S = (fr: string, en: string, ar: string, fa: string, ti: string, uk: string, pt: string, so: string, tr: string, ps: string) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

const A = (fr: string[], en: string[], ar: string[], fa: string[], ti: string[], uk: string[], pt: string[], so: string[], tr: string[], ps: string[]) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

export const TRAD_G2_2: SubmoduleTrad = {
  submoduleId: "G2-2",
  title: S(
    "Unités de capacité, de masse et de temps",
    "Units of capacity, mass and time",
    "وحدات السعة والكتلة والزمن",
    "واحدهای ظرفیت، جرم و زمان",
    "ናይ ዓቕሚ፣ ብዝሒን ግዜን ሓደ ዜሮ",
    "Одиниці місткості, маси та часу",
    "Unidades de capacidade, massa e tempo",
    "Cutubka awoodda, miisaanka iyo wakhtiga",
    "Kapasite, kütle ve zaman birimleri",
    "د ظرفيت، وزن او وخت واحدونه"
  ),
  blocks: [
    // 0 — heading "Unités de capacité (liquides)" (black)
    { text: S("Unités de capacité (liquides)", "Units of capacity (liquids)", "وحدات السعة (السوائل)", "واحدهای ظرفیت (مایعات)", "ናይ ዓቕሚ ሓደ ዜሮ (ፈሳሲ)", "Одиниці місткості (рідини)", "Unidades de capacidade (líquidos)", "Cutubka awoodda (dareeraha)", "Kapasite birimleri (sıvılar)", "د ظرفيت واحدونه (مايعات)") },

    // 1 — plain
    { text: S(
      "Les unités de capacité sont organisées autour du **litre (L)**. Chaque unité est **10 fois** plus grande que la suivante.",
      "Capacity units are organised around the **litre (L)**. Each unit is **10 times** larger than the next.",
      "وحدات السعة منظمة حول **اللتر (L)**. كل وحدة **أكبر بـ 10 مرات** من التالية.",
      "واحدهای ظرفیت حول **لیتر (L)** سازمان‌یافته‌اند. هر واحد **10 برابر** بزرگ‌تر از بعدی است.",
      "ናይ ዓቕሚ ሓደ ዜሮ ኣብ **ሊትር (L)** ዝተሰርሔ እዩ። ነፍሲ ወከፍ **10 ግዜ** ካብ ዝቕጽሎ ዝዓቢ እዩ።",
      "Одиниці місткості організовані навколо **літра (L)**. Кожна одиниця **в 10 разів** більша за наступну.",
      "As unidades de capacidade organizam-se em torno do **litro (L)**. Cada unidade é **10 vezes** maior que a seguinte.",
      "Cutubka awoodda waxaa lagu qaabeeyey **litir (L)**. Mid kasta waa **10 jeer** ka weyn kan xiga.",
      "Kapasite birimleri **litre (L)** etrafında düzenlenir. Her birim bir sonrakinin **10 katıdır**.",
      "د ظرفيت واحدونه **ليتر (L)** شاوخوا تنظيم شوي دي. هر واحد د راتلونکي **10 چنده** لوی دی."
    ) },

    // 2 — table (capacity)
    { headers: A(
      ["kL", "hL", "daL", "L", "dL", "cL", "mL"],
      ["kL", "hL", "daL", "L", "dL", "cL", "mL"],
      ["كل", "هل", "دال", "ل", "دل", "سل", "مل"],
      ["kL", "hL", "daL", "L", "dL", "cL", "mL"],
      ["kL", "hL", "daL", "L", "dL", "cL", "mL"],
      ["кл", "гл", "дал", "л", "дл", "сл", "мл"],
      ["kL", "hL", "daL", "L", "dL", "cL", "mL"],
      ["kL", "hL", "daL", "L", "dL", "cL", "mL"],
      ["kL", "hL", "daL", "L", "dL", "cL", "mL"],
      ["kL", "hL", "daL", "L", "dL", "cL", "mL"]
    ), items: A(
      ["1 000 L | 100 L | 10 L | 1 L | 0,1 L | 0,01 L | 0,001 L"],
      ["1 000 L | 100 L | 10 L | 1 L | 0.1 L | 0.01 L | 0.001 L"],
      ["1 000 ل | 100 ل | 10 ل | 1 ل | 0,1 ل | 0,01 ل | 0,001 ل"],
      ["1 000 L | 100 L | 10 L | 1 L | 0,1 L | 0,01 L | 0,001 L"],
      ["1 000 L | 100 L | 10 L | 1 L | 0,1 L | 0,01 L | 0,001 L"],
      ["1 000 л | 100 л | 10 л | 1 л | 0,1 л | 0,01 л | 0,001 л"],
      ["1 000 L | 100 L | 10 L | 1 L | 0,1 L | 0,01 L | 0,001 L"],
      ["1 000 L | 100 L | 10 L | 1 L | 0,1 L | 0,01 L | 0,001 L"],
      ["1 000 L | 100 L | 10 L | 1 L | 0,1 L | 0,01 L | 0,001 L"],
      ["1 000 L | 100 L | 10 L | 1 L | 0,1 L | 0,01 L | 0,001 L"]
    ), caption: S(
      "Lien : 1 L = 1 dm³. 1 mL = 1 cm³.",
      "Link: 1 L = 1 dm³. 1 mL = 1 cm³.",
      "صلة: 1 ل = 1 دم³. 1 مل = 1 سم³.",
      "رابطه: 1 L = 1 dm³. 1 mL = 1 cm³.",
      "ምትእስሳር፦ 1 L = 1 dm³. 1 mL = 1 cm³.",
      "Зв'язок: 1 л = 1 дм³. 1 мл = 1 см³.",
      "Ligação: 1 L = 1 dm³. 1 mL = 1 cm³.",
      "Xiriir: 1 L = 1 dm³. 1 mL = 1 cm³.",
      "Bağlantı: 1 L = 1 dm³. 1 mL = 1 cm³.",
      "تړاو: 1 L = 1 dm³. 1 mL = 1 cm³."
    ) },

    // 3 — rule "Règle de conversion — capacité"
    { label: S("Règle de conversion — capacité", "Conversion rule — capacity", "قاعدة التحويل — السعة", "قانون تبدیل — ظرفیت", "ሕጊ ለውጢ — ዓቕሚ", "Правило переведення — місткість", "Regra de conversão — capacidade", "Xeerka rogaalcelinta — awoodda", "Dönüşüm kuralı — kapasite", "د بدلون قاعده — ظرفيت"),
      items: A(
        ["Vers la droite → × 10 à chaque rang", "Vers la gauche → ÷ 10 à chaque rang", "Ex. 3,5 L = 35 dL = 350 cL = 3 500 mL"],
        ["To the right → × 10 per rank", "To the left → ÷ 10 per rank", "E.g. 3.5 L = 35 dL = 350 cL = 3,500 mL"],
        ["نحو اليمين → × 10 في كل رتبة", "نحو اليسار → ÷ 10 في كل رتبة", "مثال: 3,5 ل = 35 دل = 350 سل = 3500 مل"],
        ["به سمت راست → × 10 در هر رتبه", "به سمت چپ → ÷ 10 در هر رتبه", "مثال: 3,5 L = 35 dL = 350 cL = 3500 mL"],
        ["ናብ የማን → × 10 ኣብ ነፍሲ ወከፍ ደረጃ", "ናብ ጸጋም → ÷ 10 ኣብ ነፍሲ ወከፍ ደረጃ", "ኣብነት፦ 3,5 L = 35 dL = 350 cL = 3500 mL"],
        ["Вправо → × 10 на кожен розряд", "Вліво → ÷ 10 на кожен розряд", "Напр. 3,5 л = 35 дл = 350 сл = 3 500 мл"],
        ["Para a direita → × 10 por nível", "Para a esquerda → ÷ 10 por nível", "Ex. 3,5 L = 35 dL = 350 cL = 3 500 mL"],
        ["Midig → × 10 heer kasta", "Bidix → ÷ 10 heer kasta", "Tusaale: 3,5 L = 35 dL = 350 cL = 3500 mL"],
        ["Sağa → her sıra için × 10", "Sola → her sıra için ÷ 10", "Örn. 3,5 L = 35 dL = 350 cL = 3.500 mL"],
        ["ښي خوا → × 10 هر درجه", "کيڼ خوا → ÷ 10 هر درجه", "بېلګه: 3,5 L = 35 dL = 350 cL = 3500 mL"]
      )
    },

    // 4 — example (capacity)
    { text: S(
      "2 L = 200 cL    |    500 mL = 0,5 L    |    1,5 hL = 150 L",
      "2 L = 200 cL    |    500 mL = 0.5 L    |    1.5 hL = 150 L",
      "2 ل = 200 سل    |    500 مل = 0,5 ل    |    1,5 هل = 150 ل",
      "2 L = 200 cL    |    500 mL = 0,5 L    |    1,5 hL = 150 L",
      "2 L = 200 cL    |    500 mL = 0,5 L    |    1,5 hL = 150 L",
      "2 л = 200 сл    |    500 мл = 0,5 л    |    1,5 гл = 150 л",
      "2 L = 200 cL    |    500 mL = 0,5 L    |    1,5 hL = 150 L",
      "2 L = 200 cL    |    500 mL = 0,5 L    |    1,5 hL = 150 L",
      "2 L = 200 cL    |    500 mL = 0,5 L    |    1,5 hL = 150 L",
      "2 L = 200 cL    |    500 mL = 0,5 L    |    1,5 hL = 150 L"
    ) },

    // 5 — heading "Unités de masse" (black)
    { text: S("Unités de masse", "Units of mass", "وحدات الكتلة", "واحدهای جرم", "ናይ ብዝሒ ሓደ ዜሮ", "Одиниці маси", "Unidades de massa", "Cutubka miisaanka", "Kütle birimleri", "د وزن واحدونه") },

    // 6 — plain
    { text: S(
      "Les unités de masse sont organisées autour du **gramme (g)**. En pratique, on utilise surtout la tonne (t), le kilogramme (kg) et le gramme (g).",
      "Mass units are organised around the **gram (g)**. In practice, the most used are the tonne (t), kilogram (kg) and gram (g).",
      "وحدات الكتلة منظمة حول **الغرام (g)**. عملياً، تُستخدم الطن (t) والكيلوغرام (kg) والغرام (g).",
      "واحدهای جرم حول **گرم (g)** سازمان‌یافته‌اند. در عمل بیشتر از تن (t)، کیلوگرم (kg) و گرم (g) استفاده می‌شود.",
      "ናይ ብዝሒ ሓደ ዜሮ ኣብ **ግራም (g)** ዝተሰርሔ እዩ። ብተግባር ቶን (t)፣ ኪሎ (kg)፣ ግራም (g) ዝበዝሑ ዝሕወሱ እዮም።",
      "Одиниці маси організовані навколо **грама (g)**. На практиці найчастіше вживають: тонна (t), кілограм (kg) і грам (g).",
      "As unidades de massa organizam-se em torno do **grama (g)**. Na prática usam-se mais a tonelada (t), o quilograma (kg) e o grama (g).",
      "Cutubka miisaanka waxaa lagu qaabeeyey **garaam (g)**. Dhaqsaha waxaa badan la isticmaala: tan (t), kilogaraam (kg), garaam (g).",
      "Kütle birimleri **gram (g)** etrafında düzenlenir. Pratikte en çok ton (t), kilogram (kg) ve gram (g) kullanılır.",
      "د وزن واحدونه **ګرام (g)** شاوخوا تنظيم شوي دي. عملي توګه ټن (t)، کيلوګرام (kg) او ګرام (g) زيات کارول کيږي."
    ) },

    // 7 — table (mass)
    { headers: A(
      ["t", "q", "kg", "hg", "dag", "g", "dg", "cg", "mg"],
      ["t", "q", "kg", "hg", "dag", "g", "dg", "cg", "mg"],
      ["ط", "ق", "كغ", "هغ", "داغ", "غ", "دغ", "سغ", "مغ"],
      ["t", "q", "kg", "hg", "dag", "g", "dg", "cg", "mg"],
      ["t", "q", "kg", "hg", "dag", "g", "dg", "cg", "mg"],
      ["т", "ц", "кг", "гг", "дг", "г", "дг", "сг", "мг"],
      ["t", "q", "kg", "hg", "dag", "g", "dg", "cg", "mg"],
      ["t", "q", "kg", "hg", "dag", "g", "dg", "cg", "mg"],
      ["t", "q", "kg", "hg", "dag", "g", "dg", "cg", "mg"],
      ["t", "q", "kg", "hg", "dag", "g", "dg", "cg", "mg"]
    ), items: A(
      ["1 000 000 g | 100 000 g | 1 000 g | 100 g | 10 g | 1 g | 0,1 g | 0,01 g | 0,001 g"],
      ["1,000,000 g | 100,000 g | 1,000 g | 100 g | 10 g | 1 g | 0.1 g | 0.01 g | 0.001 g"],
      ["1 000 000 غ | 100 000 غ | 1 000 غ | 100 غ | 10 غ | 1 غ | 0,1 غ | 0,01 غ | 0,001 غ"],
      ["1 000 000 g | 100 000 g | 1 000 g | 100 g | 10 g | 1 g | 0,1 g | 0,01 g | 0,001 g"],
      ["1 000 000 g | 100 000 g | 1 000 g | 100 g | 10 g | 1 g | 0,1 g | 0,01 g | 0,001 g"],
      ["1 000 000 г | 100 000 г | 1 000 г | 100 г | 10 г | 1 г | 0,1 г | 0,01 г | 0,001 г"],
      ["1 000 000 g | 100 000 g | 1 000 g | 100 g | 10 g | 1 g | 0,1 g | 0,01 g | 0,001 g"],
      ["1 000 000 g | 100 000 g | 1 000 g | 100 g | 10 g | 1 g | 0,1 g | 0,01 g | 0,001 g"],
      ["1.000.000 g | 100.000 g | 1.000 g | 100 g | 10 g | 1 g | 0,1 g | 0,01 g | 0,001 g"],
      ["1 000 000 g | 100 000 g | 1 000 g | 100 g | 10 g | 1 g | 0,1 g | 0,01 g | 0,001 g"]
    ), caption: S(
      "t = tonne, q = quintal, kg = kilogramme, g = gramme, mg = milligramme.",
      "t = tonne, q = quintal, kg = kilogram, g = gram, mg = milligram.",
      "ط = طن، ق = قنطار، كغ = كيلوغرام، غ = غرام، مغ = ميليغرام.",
      "t = تن، q = کوینتال، kg = کیلوگرم، g = گرم، mg = میلیگرم.",
      "t = ቶን፣ q = ኩዊንታል፣ kg = ኪሎ፣ g = ግራም፣ mg = ሚሊግራም.",
      "т = тонна, ц = центнер, кг = кілограм, г = грам, мг = міліграм.",
      "t = tonelada, q = quintal, kg = quilograma, g = grama, mg = miligrama.",
      "t = tan, q = quintal, kg = kilogaraam, g = garaam, mg = miligaraam.",
      "t = ton, q = kental, kg = kilogram, g = gram, mg = miligram.",
      "t = ټن، q = کوينتال، kg = کيلوګرام، g = ګرام، mg = ميليګرام."
    ) },

    // 8 — rule "Règle de conversion — masse"
    { label: S("Règle de conversion — masse", "Conversion rule — mass", "قاعدة التحويل — الكتلة", "قانون تبدیل — جرم", "ሕጊ ለውጢ — ብዝሒ", "Правило переведення — маса", "Regra de conversão — massa", "Xeerka rogaalcelinta — miisaanka", "Dönüşüm kuralı — kütle", "د بدلون قاعده — وزن"),
      items: A(
        ["1 t = 1 000 kg = 1 000 000 g", "1 kg = 1 000 g", "Vers la droite → × 10. Vers la gauche → ÷ 10.", "Ex. 2,5 kg = 2 500 g    |    750 g = 0,75 kg"],
        ["1 t = 1,000 kg = 1,000,000 g", "1 kg = 1,000 g", "To the right → × 10. To the left → ÷ 10.", "E.g. 2.5 kg = 2,500 g    |    750 g = 0.75 kg"],
        ["1 ط = 1000 كغ = 1000000 غ", "1 كغ = 1000 غ", "نحو اليمين → × 10. نحو اليسار → ÷ 10.", "مثال: 2,5 كغ = 2500 غ    |    750 غ = 0,75 كغ"],
        ["1 t = 1000 kg = 1000000 g", "1 kg = 1000 g", "به سمت راست → × 10. به سمت چپ → ÷ 10.", "مثال: 2,5 kg = 2500 g    |    750 g = 0,75 kg"],
        ["1 t = 1000 kg = 1000000 g", "1 kg = 1000 g", "ናብ የማን → × 10። ናብ ጸጋም → ÷ 10።", "ኣብነት፦ 2,5 kg = 2500 g    |    750 g = 0,75 kg"],
        ["1 т = 1 000 кг = 1 000 000 г", "1 кг = 1 000 г", "Вправо → × 10. Вліво → ÷ 10.", "Напр. 2,5 кг = 2 500 г    |    750 г = 0,75 кг"],
        ["1 t = 1 000 kg = 1 000 000 g", "1 kg = 1 000 g", "Para a direita → × 10. Para a esquerda → ÷ 10.", "Ex. 2,5 kg = 2 500 g    |    750 g = 0,75 kg"],
        ["1 t = 1000 kg = 1000000 g", "1 kg = 1000 g", "Midig → × 10. Bidix → ÷ 10.", "Tusaale: 2,5 kg = 2500 g    |    750 g = 0,75 kg"],
        ["1 t = 1.000 kg = 1.000.000 g", "1 kg = 1.000 g", "Sağa → × 10. Sola → ÷ 10.", "Örn. 2,5 kg = 2.500 g    |    750 g = 0,75 kg"],
        ["1 t = 1000 kg = 1000000 g", "1 kg = 1000 g", "ښي خوا → × 10. کيڼ خوا → ÷ 10.", "بېلګه: 2,5 kg = 2500 g    |    750 g = 0,75 kg"]
      )
    },

    // 9 — example (mass)
    { text: S(
      "3 t = 3 000 kg    |    4,2 kg = 4 200 g    |    500 mg = 0,5 g",
      "3 t = 3,000 kg    |    4.2 kg = 4,200 g    |    500 mg = 0.5 g",
      "3 ط = 3000 كغ    |    4,2 كغ = 4200 غ    |    500 مغ = 0,5 غ",
      "3 t = 3 000 kg    |    4,2 kg = 4 200 g    |    500 mg = 0,5 g",
      "3 t = 3 000 kg    |    4,2 kg = 4 200 g    |    500 mg = 0,5 g",
      "3 т = 3 000 кг    |    4,2 кг = 4 200 г    |    500 мг = 0,5 г",
      "3 t = 3 000 kg    |    4,2 kg = 4 200 g    |    500 mg = 0,5 g",
      "3 t = 3,000 kg    |    4,2 kg = 4,200 g    |    500 mg = 0,5 g",
      "3 t = 3.000 kg    |    4,2 kg = 4.200 g    |    500 mg = 0,5 g",
      "3 t = 3 000 kg    |    4,2 kg = 4 200 g    |    500 mg = 0,5 g"
    ) },

    // 10 — heading "Unités de temps" (black)
    { text: S("Unités de temps", "Units of time", "وحدات الزمن", "واحدهای زمان", "ናይ ግዜ ሓደ ዜሮ", "Одиниці часу", "Unidades de tempo", "Cutubka wakhtiga", "Zaman birimleri", "د وخت واحدونه") },

    // 11 — plain
    { text: S(
      "Contrairement aux autres unités, le temps **ne se divise pas en 10** mais en 60 (minutes/secondes) et 24 (heures/jours).",
      "Unlike other units, time is **not divided by 10** but by 60 (minutes/seconds) and 24 (hours/days).",
      "على خلاف الوحدات الأخرى، الزمن **لا يُقسَّم إلى 10** بل إلى 60 (دقائق/ثواني) و24 (ساعات/أيام).",
      "برخلاف واحدهای دیگر، زمان **به 10 تقسیم نمی‌شود** بلکه به 60 (دقیقه/ثانیه) و 24 (ساعت/روز).",
      "ካልኦት ሓደ ዜሮ ብዘይኮነ፣ ግዜ **ብ10 ኣይፈርስን** ብ60 (ደቓይቕ/ካልኢት) ብ24 (ሰዓት/መዓልቲ) ግን ይፈርስ።",
      "На відміну від інших одиниць, час **не ділиться на 10**, а на 60 (хвилини/секунди) і 24 (години/дні).",
      "Ao contrário das outras unidades, o tempo **não se divide em 10** mas em 60 (minutos/segundos) e 24 (horas/dias).",
      "Kaga duwan cutubka kale, wakhtiga **kuma qaybsamto 10** laakiin 60 (daqiiqado/ilbiriqsi) iyo 24 (saacadood/maalmood).",
      "Diğer birimlerden farklı olarak, zaman **10'a bölünmez**; 60'a (dakika/saniye) ve 24'e (saat/gün) bölünür.",
      "د نورو واحدونو برعکس، وخت **10 ته نه ويشل کېږي** بلکه 60 ته (دقيقې/ثانيې) او 24 ته (ساعتونه/ورځې)."
    ) },

    // 12 — table (time)
    { headers: A(
      ["siècle", "décennie", "an", "mois", "semaine", "jour (j)", "heure (h)", "minute (min)", "seconde (s)"],
      ["century", "decade", "year", "month", "week", "day (d)", "hour (h)", "minute (min)", "second (s)"],
      ["قرن", "عقد", "سنة", "شهر", "أسبوع", "يوم (ي)", "ساعة (h)", "دقيقة (min)", "ثانية (s)"],
      ["قرن", "دهه", "سال", "ماه", "هفته", "روز (j)", "ساعت (h)", "دقیقه (min)", "ثانیه (s)"],
      ["ሚኢት ዓመት", "ዓሰርተ ዓም", "ዓመት", "ወርሒ", "ሰሙን", "መዓልቲ (j)", "ሰዓት (h)", "ደቒቕ (min)", "ካልኢት (s)"],
      ["сторіччя", "десятиліття", "рік", "місяць", "тиждень", "день (д)", "година (г)", "хвилина (хв)", "секунда (с)"],
      ["século", "década", "ano", "mês", "semana", "dia (j)", "hora (h)", "minuto (min)", "segundo (s)"],
      ["qarnigii", "tobankii sano", "sanad", "bil", "toddobaad", "maalin (j)", "saacad (h)", "daqiiqo (min)", "ilbiriqsi (s)"],
      ["yüzyıl", "on yıl", "yıl", "ay", "hafta", "gün (j)", "saat (h)", "dakika (dk)", "saniye (s)"],
      ["پیړۍ", "لسیزه", "کال", "میاشت", "اونۍ", "ورځ (j)", "ساعت (h)", "دقيقه (min)", "ثانيه (s)"]
    ), items: A(
      ["100 ans | 10 ans | 12 mois | 4 sem. | 7 jours | 24 h | 60 min | 60 s | —"],
      ["100 years | 10 years | 12 months | 4 weeks | 7 days | 24 h | 60 min | 60 s | —"],
      ["100 سنة | 10 سنوات | 12 شهرًا | 4 أسابيع | 7 أيام | 24 ساعة | 60 دقيقة | 60 ثانية | —"],
      ["100 سال | 10 سال | 12 ماه | 4 هفته | 7 روز | 24 ساعت | 60 دقیقه | 60 ثانیه | —"],
      ["100 ዓ | 10 ዓ | 12 ወ | 4 ሰ | 7 ቀናት | 24 ሰ | 60 ዴ | 60 ካ | —"],
      ["100 рр. | 10 рр. | 12 міс. | 4 тиж. | 7 днів | 24 год | 60 хв | 60 с | —"],
      ["100 anos | 10 anos | 12 meses | 4 sem. | 7 dias | 24 h | 60 min | 60 s | —"],
      ["100 sanadood | 10 sanadood | 12 bil | 4 toddobaad | 7 maalmood | 24 saac | 60 daqiiqo | 60 ilbiriqsi | —"],
      ["100 yıl | 10 yıl | 12 ay | 4 hafta | 7 gün | 24 sa | 60 dk | 60 sn | —"],
      ["100 کاله | 10 کاله | 12 میاشتې | 4 اونۍ | 7 ورځې | 24 ساعت | 60 دقيقه | 60 ثانيه | —"]
    ) },

    // 13 — rule "Conversions clés — temps"
    { label: S("Conversions clés — temps", "Key conversions — time", "التحويلات الأساسية — الزمن", "تبدیل‌های کلیدی — زمان", "መሰረታዊ ለውጢ — ግዜ", "Ключові переведення — час", "Conversões principais — tempo", "Rogaalcelinta muhiimka ah — wakhtiga", "Temel dönüşümler — zaman", "کليدي بدلونونه — وخت"),
      items: A(
        ["1 h = 60 min = 3 600 s", "1 min = 60 s", "1 jour = 24 h = 1 440 min", "1 an = 365 jours (366 les années bissextiles)"],
        ["1 h = 60 min = 3,600 s", "1 min = 60 s", "1 day = 24 h = 1,440 min", "1 year = 365 days (366 in leap years)"],
        ["1 ساعة = 60 دقيقة = 3600 ثانية", "1 دقيقة = 60 ثانية", "1 يوم = 24 ساعة = 1440 دقيقة", "1 سنة = 365 يومًا (366 في السنوات الكبيسة)"],
        ["1 h = 60 min = 3600 s", "1 min = 60 s", "1 روز = 24 h = 1440 min", "1 سال = 365 روز (366 در سال کبیسه)"],
        ["1 ሰዓት = 60 ደቒቕ = 3600 ካልኢት", "1 ደቒቕ = 60 ካልኢት", "1 መዓልቲ = 24 ሰዓት = 1440 ደቒቕ", "1 ዓመት = 365 መዓልቲ (366 ዓ.ዘ.)"],
        ["1 год = 60 хв = 3 600 с", "1 хв = 60 с", "1 день = 24 год = 1 440 хв", "1 рік = 365 днів (366 у високосні роки)"],
        ["1 h = 60 min = 3 600 s", "1 min = 60 s", "1 dia = 24 h = 1 440 min", "1 ano = 365 dias (366 nos anos bissextos)"],
        ["1 saac = 60 daqiiqo = 3600 ilbiriqsi", "1 daqiiqo = 60 ilbiriqsi", "1 maalin = 24 saac = 1440 daqiiqo", "1 sanad = 365 maalmood (366 sannadaha kaabiyada)"],
        ["1 sa = 60 dk = 3.600 sn", "1 dk = 60 sn", "1 gün = 24 sa = 1.440 dk", "1 yıl = 365 gün (artık yıllarda 366)"],
        ["1 ساعت = 60 دقيقه = 3600 ثانيه", "1 دقيقه = 60 ثانيه", "1 ورځ = 24 ساعت = 1440 دقيقه", "1 کال = 365 ورځې (366 کبيسه کالونو کې)"]
      )
    },

    // 14 — example (time)
    { text: S(
      "2 h 30 min = 150 min = 9 000 s    |    3 600 s = 60 min = 1 h",
      "2 h 30 min = 150 min = 9,000 s    |    3,600 s = 60 min = 1 h",
      "2 ساعة 30 دقيقة = 150 دقيقة = 9000 ثانية    |    3600 ثانية = 60 دقيقة = 1 ساعة",
      "2 h 30 min = 150 min = 9 000 s    |    3 600 s = 60 min = 1 h",
      "2 ሰ 30 ዴ = 150 ዴ = 9000 ካ    |    3600 ካ = 60 ዴ = 1 ሰ",
      "2 год 30 хв = 150 хв = 9 000 с    |    3 600 с = 60 хв = 1 год",
      "2 h 30 min = 150 min = 9 000 s    |    3 600 s = 60 min = 1 h",
      "2 saac 30 daqiiqo = 150 daqiiqo = 9000 ilbiriqsi    |    3600 ilbiriqsi = 60 daqiiqo = 1 saac",
      "2 sa 30 dk = 150 dk = 9.000 sn    |    3.600 sn = 60 dk = 1 sa",
      "2 ساعت 30 دقيقه = 150 دقيقه = 9 000 ثانيه    |    3 600 ثانيه = 60 دقيقه = 1 ساعت"
    ) },

    // 15 — note
    { text: S(
      "Attention : on ne peut pas convertir les heures comme les autres unités (pas de virgule). On écrit 1 h 30 min, et non 1,30 h.",
      "Note: you cannot convert hours like other units (no decimal). Write 1 h 30 min, not 1.30 h.",
      "تنبيه: لا يمكن تحويل الساعات كالوحدات الأخرى (بدون فاصلة). يُكتب 1 ساعة 30 دقيقة، وليس 1,30 ساعة.",
      "توجه: نمی‌توان ساعت را مثل دیگر واحدها تبدیل کرد (بدون اعشار). می‌نویسیم 1 h 30 min، نه 1,30 h.",
      "ጥንቃቐ: ሰዓት ከም ካልኦት ሓደ ዜሮ ምቕያር ኣይከኣልን (ኮማ የለን). 1 ሰዓት 30 ደቒቕ ኣብ ምፍርዛሕ ዝጠቅም 1,30 h ኣይኮነን።",
      "Увага: години не можна переводити, як інші одиниці (без коми). Пишемо 1 год 30 хв, а не 1,30 год.",
      "Atenção: não se pode converter horas como outras unidades (sem vírgula). Escreve-se 1 h 30 min, não 1,30 h.",
      "Digta: saacadaha looma beddelayo sida cutubka kale (xarfaan comma). Waxaa la qoraa 1 saac 30 daqiiqo, maahan 1,30 h.",
      "Not: saatler diğer birimler gibi dönüştürülemez (virgül yok). 1 sa 30 dk yazılır, 1,30 sa değil.",
      "پاملرنه: ساعتونه لکه نور واحدونه نه بدلیدی (کوما نشته). 1 ساعت 30 دقيقه لیکو، نه 1,30 ساعت."
    ) },
  ],
  consignes: {
    "g2-2-ex1": { fr: "Convertis : 2 L = _____ mL", en: "Convert: 2 L = _____ mL", ar: "حوّل: 2 L = _____ mL", fa: "تبدیل کن: 2 L = _____ mL", ti: "ቐይር፦ 2 L = _____ mL", uk: "Перетвори: 2 L = _____ mL", pt: "Converte: 2 L = _____ mL", so: "Beddel: 2 L = _____ mL", tr: "Dönüştür: 2 L = _____ mL", ps: "واړوه: 2 L = _____ mL" },
    "g2-2-ex2": { fr: "Convertis : 3,5 kg = _____ g", en: "Convert: 3,5 kg = _____ g", ar: "حوّل: 3,5 kg = _____ g", fa: "تبدیل کن: 3,5 kg = _____ g", ti: "ቐይር፦ 3,5 kg = _____ g", uk: "Перетвори: 3,5 kg = _____ g", pt: "Converte: 3,5 kg = _____ g", so: "Beddel: 3,5 kg = _____ g", tr: "Dönüştür: 3,5 kg = _____ g", ps: "واړوه: 3,5 kg = _____ g" },
    "g2-2-ex3": { fr: "Convertis : 2 h = _____ min", en: "Convert: 2 h = _____ min", ar: "حوّل: 2 h = _____ min", fa: "تبدیل کن: 2 h = _____ min", ti: "ቐይር፦ 2 h = _____ min", uk: "Перетвори: 2 h = _____ min", pt: "Converte: 2 h = _____ min", so: "Beddel: 2 h = _____ min", tr: "Dönüştür: 2 h = _____ min", ps: "واړوه: 2 h = _____ min" },
    "g2-2-ex4": { fr: "Convertis : 500 mL = _____ L", en: "Convert: 500 mL = _____ L", ar: "حوّل: 500 mL = _____ L", fa: "تبدیل کن: 500 mL = _____ L", ti: "ቐይር፦ 500 mL = _____ L", uk: "Перетвори: 500 mL = _____ L", pt: "Converte: 500 mL = _____ L", so: "Beddel: 500 mL = _____ L", tr: "Dönüştür: 500 mL = _____ L", ps: "واړوه: 500 mL = _____ L" },
    "g2-2-ex5": { fr: "Convertis : 1 min 30 s = _____ s", en: "Convert: 1 min 30 s = _____ s", ar: "حوّل: 1 min 30 s = _____ s", fa: "تبدیل کن: 1 min 30 s = _____ s", ti: "ቐይር፦ 1 min 30 s = _____ s", uk: "Перетвори: 1 min 30 s = _____ s", pt: "Converte: 1 min 30 s = _____ s", so: "Beddel: 1 min 30 s = _____ s", tr: "Dönüştür: 1 min 30 s = _____ s", ps: "واړوه: 1 min 30 s = _____ s" },
    "g2-2-pool1": { fr: "5 L = _____ cL", en: "5 L = _____ cL", ar: "5 L = _____ cL", fa: "5 L = _____ cL", ti: "5 L = _____ cL", uk: "5 L = _____ cL", pt: "5 L = _____ cL", so: "5 L = _____ cL", tr: "5 L = _____ cL", ps: "5 L = _____ cL" },
    "g2-2-pool2": { fr: "250 cL = _____ L", en: "250 cL = _____ L", ar: "250 cL = _____ L", fa: "250 cL = _____ L", ti: "250 cL = _____ L", uk: "250 cL = _____ L", pt: "250 cL = _____ L", so: "250 cL = _____ L", tr: "250 cL = _____ L", ps: "250 cL = _____ L" },
    "g2-2-pool3": { fr: "4 kg = _____ g", en: "4 kg = _____ g", ar: "4 kg = _____ g", fa: "4 kg = _____ g", ti: "4 kg = _____ g", uk: "4 kg = _____ g", pt: "4 kg = _____ g", so: "4 kg = _____ g", tr: "4 kg = _____ g", ps: "4 kg = _____ g" },
    "g2-2-pool4": { fr: "2 500 g = _____ kg", en: "2 500 g = _____ kg", ar: "2 500 g = _____ kg", fa: "2 500 g = _____ kg", ti: "2 500 g = _____ kg", uk: "2 500 g = _____ kg", pt: "2 500 g = _____ kg", so: "2 500 g = _____ kg", tr: "2 500 g = _____ kg", ps: "2 500 g = _____ kg" },
    "g2-2-pool5": { fr: "3 h = _____ min", en: "3 h = _____ min", ar: "3 h = _____ min", fa: "3 h = _____ min", ti: "3 h = _____ min", uk: "3 h = _____ min", pt: "3 h = _____ min", so: "3 h = _____ min", tr: "3 h = _____ min", ps: "3 h = _____ min" },
    "g2-2-pool6": { fr: "90 min = _____ h _____ min (écrire les heures)", en: "90 min = _____ h _____ min (écrire les heures)", ar: "90 min = _____ h _____ min (écrire les heures)", fa: "90 min = _____ h _____ min (écrire les heures)", ti: "90 min = _____ h _____ min (écrire les heures)", uk: "90 min = _____ h _____ min (écrire les heures)", pt: "90 min = _____ h _____ min (écrire les heures)", so: "90 min = _____ h _____ min (écrire les heures)", tr: "90 min = _____ h _____ min (écrire les heures)", ps: "90 min = _____ h _____ min (écrire les heures)" },
    "g2-2-pool7": { fr: "1 t = _____ kg", en: "1 t = _____ kg", ar: "1 t = _____ kg", fa: "1 t = _____ kg", ti: "1 t = _____ kg", uk: "1 t = _____ kg", pt: "1 t = _____ kg", so: "1 t = _____ kg", tr: "1 t = _____ kg", ps: "1 t = _____ kg" },
    "g2-2-pool8": { fr: "3 600 s = _____ h", en: "3 600 s = _____ h", ar: "3 600 s = _____ h", fa: "3 600 s = _____ h", ti: "3 600 s = _____ h", uk: "3 600 s = _____ h", pt: "3 600 s = _____ h", so: "3 600 s = _____ h", tr: "3 600 s = _____ h", ps: "3 600 s = _____ h" },
  },
};
