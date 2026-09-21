import type { SubmoduleTrad } from "./trad-types";

const S = (fr: string, en: string, ar: string, fa: string, ti: string, uk: string, pt: string, so: string, tr: string, ps: string) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

const A = (fr: string[], en: string[], ar: string[], fa: string[], ti: string[], uk: string[], pt: string[], so: string[], tr: string[], ps: string[]) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

export const TRAD_G2_1: SubmoduleTrad = {
  submoduleId: "G2-1",
  title: S(
    "Unités de longueur, d'aire et de volume",
    "Units of length, area and volume",
    "وحدات الطول والمساحة والحجم",
    "واحدهای طول، مساحت و حجم",
    "ናይ ርዝሓ፣ ስፍሓትን ዕቅምን ሓደ ዜሮ",
    "Одиниці довжини, площі та об'єму",
    "Unidades de comprimento, área e volume",
    "Cutubka dhererka, aagga iyo mugga",
    "Uzunluk, alan ve hacim birimleri",
    "د اوږدوالي، سطحې او حجم واحدونه"
  ),
  blocks: [
    // 0 — heading "Unités de longueur" (black)
    { text: S("Unités de longueur", "Units of length", "وحدات الطول", "واحدهای طول", "ናይ ርዝሓ ሓደ ዜሮ", "Одиниці довжини", "Unidades de comprimento", "Cutubka dhererka", "Uzunluk birimleri", "د اوږدوالي واحدونه") },

    // 1 — plain
    { text: S(
      "Les unités de longueur sont organisées autour du **mètre (m)**. Chaque unité est **10 fois** plus grande que la suivante.",
      "Length units are organised around the **metre (m)**. Each unit is **10 times** larger than the next.",
      "وحدات الطول منظمة حول **المتر (m)**. كل وحدة **أكبر بـ 10 مرات** من التالية.",
      "واحدهای طول حول **متر (m)** سازمان‌یافته‌اند. هر واحد **10 برابر** بزرگ‌تر از بعدی است.",
      "ናይ ርዝሓ ሓደ ዜሮ ኣብ **ሜትር (m)** ዝተሰርሔ እዩ። ነፍሲ ወከፍ **10 ግዜ** ካብ ዝቕጽሎ ዝዓቢ እዩ።",
      "Одиниці довжини організовані навколо **метра (m)**. Кожна одиниця **в 10 разів** більша за наступну.",
      "As unidades de comprimento organizam-se em torno do **metro (m)**. Cada unidade é **10 vezes** maior que a seguinte.",
      "Cutubka dhererka waxaa lagu qaabeeyey **mitir (m)**. Mid kasta waa **10 jeer** ka weyn kan xiga.",
      "Uzunluk birimleri **metre (m)** etrafında düzenlenir. Her birim bir sonrakinin **10 katıdır**.",
      "د اوږدوالي واحدونه **متر (m)** شاوخوا تنظيم شوي دي. هر واحد د راتلونکي **10 چنده** لوی دی."
    ) },

    // 2 — table (length)
    { headers: A(
      ["km", "hm", "dam", "m", "dm", "cm", "mm"],
      ["km", "hm", "dam", "m", "dm", "cm", "mm"],
      ["كم", "هم", "دام", "م", "دم", "سم", "مم"],
      ["km", "hm", "dam", "m", "dm", "cm", "mm"],
      ["km", "hm", "dam", "m", "dm", "cm", "mm"],
      ["км", "гм", "дам", "м", "дм", "см", "мм"],
      ["km", "hm", "dam", "m", "dm", "cm", "mm"],
      ["km", "hm", "dam", "m", "dm", "cm", "mm"],
      ["km", "hm", "dam", "m", "dm", "cm", "mm"],
      ["km", "hm", "dam", "m", "dm", "cm", "mm"]
    ), items: A(
      ["1 000 m | 100 m | 10 m | 1 m | 0,1 m | 0,01 m | 0,001 m"],
      ["1 000 m | 100 m | 10 m | 1 m | 0.1 m | 0.01 m | 0.001 m"],
      ["1 000 م | 100 م | 10 م | 1 م | 0,1 م | 0,01 م | 0,001 م"],
      ["1 000 m | 100 m | 10 m | 1 m | 0,1 m | 0,01 m | 0,001 m"],
      ["1 000 m | 100 m | 10 m | 1 m | 0,1 m | 0,01 m | 0,001 m"],
      ["1 000 м | 100 м | 10 м | 1 м | 0,1 м | 0,01 м | 0,001 м"],
      ["1 000 m | 100 m | 10 m | 1 m | 0,1 m | 0,01 m | 0,001 m"],
      ["1 000 m | 100 m | 10 m | 1 m | 0,1 m | 0,01 m | 0,001 m"],
      ["1 000 m | 100 m | 10 m | 1 m | 0,1 m | 0,01 m | 0,001 m"],
      ["1 000 m | 100 m | 10 m | 1 m | 0,1 m | 0,01 m | 0,001 m"]
    ), caption: S(
      "Pour convertir vers la droite, on multiplie par 10 à chaque rang.",
      "To convert to the right, multiply by 10 at each level.",
      "للتحويل نحو اليمين، نضرب في 10 لكل رتبة.",
      "برای تبدیل به سمت راست، در هر مرتبه × 10 ضرب می‌کنیم.",
      "ናብ የማን ምቕያር ንምግባር ኣብ ነፍሲ ወከፍ ደረጃ × 10 ።",
      "Для переведення вправо множимо на 10 на кожен розряд.",
      "Para converter à direita, multiplica-se por 10 em cada nível.",
      "Si aad u beddesho midig, ku dhufso 10 heer kasta.",
      "Sağa dönüştürmek için her sırada 10 ile çarpılır.",
      "د ښي لوري لپاره د هر درجې سره × 10 ضرب کوو."
    ) },

    // 3 — rule "Règle de conversion — longueur"
    { label: S("Règle de conversion — longueur", "Conversion rule — length", "قاعدة التحويل — الطول", "قانون تبدیل — طول", "ሕጊ ለውጢ — ርዝሓ", "Правило переведення — довжина", "Regra de conversão — comprimento", "Xeerka rogaalcelinta — dhererka", "Dönüşüm kuralı — uzunluk", "د بدلون قاعده — اوږدوالی"),
      items: A(
        ["Vers la droite → × 10 (ex. 3 m = 30 dm = 300 cm = 3 000 mm)", "Vers la gauche → ÷ 10 (ex. 5 000 m = 500 dam = 50 hm = 5 km)"],
        ["To the right → × 10 (e.g. 3 m = 30 dm = 300 cm = 3,000 mm)", "To the left → ÷ 10 (e.g. 5,000 m = 500 dam = 50 hm = 5 km)"],
        ["نحو اليمين → × 10 (مثال: 3 م = 30 دم = 300 سم = 3000 مم)", "نحو اليسار → ÷ 10 (مثال: 5000 م = 500 دام = 50 هم = 5 كم)"],
        ["به سمت راست → × 10 (مثال: 3 m = 30 dm = 300 cm = 3000 mm)", "به سمت چپ → ÷ 10 (مثال: 5000 m = 500 dam = 50 hm = 5 km)"],
        ["ናብ የማን → × 10 (ኣብነት፦ 3 m = 30 dm = 300 cm = 3000 mm)", "ናብ ጸጋም → ÷ 10 (ኣብነት፦ 5000 m = 500 dam = 50 hm = 5 km)"],
        ["Вправо → × 10 (напр. 3 м = 30 дм = 300 см = 3 000 мм)", "Вліво → ÷ 10 (напр. 5 000 м = 500 дам = 50 гм = 5 км)"],
        ["Para a direita → × 10 (ex. 3 m = 30 dm = 300 cm = 3 000 mm)", "Para a esquerda → ÷ 10 (ex. 5 000 m = 500 dam = 50 hm = 5 km)"],
        ["Midig → × 10 (tusaale: 3 m = 30 dm = 300 cm = 3000 mm)", "Bidix → ÷ 10 (tusaale: 5000 m = 500 dam = 50 hm = 5 km)"],
        ["Sağa → × 10 (örn. 3 m = 30 dm = 300 cm = 3.000 mm)", "Sola → ÷ 10 (örn. 5.000 m = 500 dam = 50 hm = 5 km)"],
        ["ښي خوا → × 10 (بېلګه: 3 m = 30 dm = 300 cm = 3000 mm)", "کيڼ خوا → ÷ 10 (بېلګه: 5000 m = 500 dam = 50 hm = 5 km)"]
      )
    },

    // 4 — example (length)
    { text: S(
      "2,5 km = 2 500 m    |    45 cm = 0,45 m    |    300 mm = 30 cm = 3 dm",
      "2.5 km = 2,500 m    |    45 cm = 0.45 m    |    300 mm = 30 cm = 3 dm",
      "2,5 كم = 2 500 م    |    45 سم = 0,45 م    |    300 مم = 30 سم = 3 دم",
      "2,5 km = 2 500 m    |    45 cm = 0,45 m    |    300 mm = 30 cm = 3 dm",
      "2,5 km = 2 500 m    |    45 cm = 0,45 m    |    300 mm = 30 cm = 3 dm",
      "2,5 км = 2 500 м    |    45 см = 0,45 м    |    300 мм = 30 см = 3 дм",
      "2,5 km = 2 500 m    |    45 cm = 0,45 m    |    300 mm = 30 cm = 3 dm",
      "2,5 km = 2,500 m    |    45 cm = 0,45 m    |    300 mm = 30 cm = 3 dm",
      "2,5 km = 2.500 m    |    45 cm = 0,45 m    |    300 mm = 30 cm = 3 dm",
      "2,5 km = 2 500 m    |    45 cm = 0,45 m    |    300 mm = 30 cm = 3 dm"
    ) },

    // 5 — heading "Unités d'aire (surface)" (black)
    { text: S("Unités d'aire (surface)", "Units of area (surface)", "وحدات المساحة (السطح)", "واحدهای مساحت (سطح)", "ናይ ስፍሓት ሓደ ዜሮ (ጽፍሒ)", "Одиниці площі (поверхні)", "Unidades de área (superfície)", "Cutubka aagga (dushaha)", "Alan birimleri (yüzey)", "د سطحې واحدونه (مساحت)") },

    // 6 — plain
    { text: S(
      "Les unités d'aire dérivent du mètre carré **(m²)**. Chaque unité est **100 fois** plus grande que la suivante (car on élève la longueur au carré).",
      "Area units derive from the square metre **(m²)**. Each unit is **100 times** larger than the next (because length is squared).",
      "وحدات المساحة مشتقة من المتر المربع **(م²)**. كل وحدة **أكبر بـ 100 مرة** من التالية (لأن الطول يُرفع للقوة الثانية).",
      "واحدهای مساحت از متر مربع **(m²)** مشتق می‌شوند. هر واحد **100 برابر** بزرگ‌تر از بعدی است (زیرا طول به توان 2 می‌رسد).",
      "ናይ ስፍሓት ሓደ ዜሮ ካብ ሜትር ስኩዌር **(m²)** ዝምጽኡ እዮም። ነፍሲ ወከፍ **100 ግዜ** ካብ ዝቕጽሎ ዝዓቢ እዩ (ርዝሓ ብርዛን ስለ ዝኾነ)።",
      "Одиниці площі походять від квадратного метра **(м²)**. Кожна одиниця **в 100 разів** більша за наступну (бо довжину зводять у квадрат).",
      "As unidades de área derivam do metro quadrado **(m²)**. Cada unidade é **100 vezes** maior que a seguinte (porque o comprimento é elevado ao quadrado).",
      "Cutubka aagga waxaa laga soo qaataa mitir laba jibbaaran **(m²)**. Mid kasta waa **100 jeer** ka weyn kan xiga (sababtoo ah dhererka laba jeer waa la baarta).",
      "Alan birimleri metrekareden **(m²)** türetilir. Her birim bir sonrakinin **100 katıdır** (çünkü uzunluk kare alınır).",
      "د مساحت واحدونه د مربع متر **(m²)** نه اخستل شوي دي. هر واحد د راتلونکي **100 چنده** لوی دی (ځکه چې اوږدوالی مربع کیږي)."
    ) },

    // 7 — table (area)
    { headers: A(
      ["km²", "hm² (ha)", "dam² (a)", "m²", "dm²", "cm²", "mm²"],
      ["km²", "hm² (ha)", "dam² (a)", "m²", "dm²", "cm²", "mm²"],
      ["كم²", "هم² (ها)", "دام² (أر)", "م²", "دم²", "سم²", "مم²"],
      ["km²", "hm² (ha)", "dam² (a)", "m²", "dm²", "cm²", "mm²"],
      ["km²", "hm² (ha)", "dam² (a)", "m²", "dm²", "cm²", "mm²"],
      ["км²", "гм² (га)", "дам² (а)", "м²", "дм²", "см²", "мм²"],
      ["km²", "hm² (ha)", "dam² (a)", "m²", "dm²", "cm²", "mm²"],
      ["km²", "hm² (ha)", "dam² (a)", "m²", "dm²", "cm²", "mm²"],
      ["km²", "hm² (ha)", "dam² (a)", "m²", "dm²", "cm²", "mm²"],
      ["km²", "hm² (ha)", "dam² (a)", "m²", "dm²", "cm²", "mm²"]
    ), items: A(
      ["1 000 000 m² | 10 000 m² | 100 m² | 1 m² | 0,01 m² | 0,0001 m² | 0,000001 m²"],
      ["1 000 000 m² | 10 000 m² | 100 m² | 1 m² | 0.01 m² | 0.0001 m² | 0.000001 m²"],
      ["1 000 000 م² | 10 000 م² | 100 م² | 1 م² | 0,01 م² | 0,0001 م² | 0,000001 م²"],
      ["1 000 000 m² | 10 000 m² | 100 m² | 1 m² | 0,01 m² | 0,0001 m² | 0,000001 m²"],
      ["1 000 000 m² | 10 000 m² | 100 m² | 1 m² | 0,01 m² | 0,0001 m² | 0,000001 m²"],
      ["1 000 000 м² | 10 000 м² | 100 м² | 1 м² | 0,01 м² | 0,0001 м² | 0,000001 м²"],
      ["1 000 000 m² | 10 000 m² | 100 m² | 1 m² | 0,01 m² | 0,0001 m² | 0,000001 m²"],
      ["1 000 000 m² | 10 000 m² | 100 m² | 1 m² | 0,01 m² | 0,0001 m² | 0,000001 m²"],
      ["1 000 000 m² | 10 000 m² | 100 m² | 1 m² | 0,01 m² | 0,0001 m² | 0,000001 m²"],
      ["1 000 000 m² | 10 000 m² | 100 m² | 1 m² | 0,01 m² | 0,0001 m² | 0,000001 m²"]
    ), caption: S(
      "1 hm² = 1 hectare (ha). 1 dam² = 1 are (a).",
      "1 hm² = 1 hectare (ha). 1 dam² = 1 are (a).",
      "1 هم² = 1 هكتار (ha). 1 دام² = 1 أر (a).",
      "1 hm² = 1 هکتار (ha). 1 dam² = 1 آر (a).",
      "1 hm² = 1 ሄክታር (ha). 1 dam² = 1 ኣር (a).",
      "1 гм² = 1 гектар (га). 1 дам² = 1 ар (а).",
      "1 hm² = 1 hectare (ha). 1 dam² = 1 are (a).",
      "1 hm² = 1 heekteer (ha). 1 dam² = 1 aar (a).",
      "1 hm² = 1 hektar (ha). 1 dam² = 1 ar (a).",
      "1 hm² = 1 هکتار (ha). 1 dam² = 1 ار (a)."
    ) },

    // 8 — rule "Règle de conversion — aire"
    { label: S("Règle de conversion — aire", "Conversion rule — area", "قاعدة التحويل — المساحة", "قانون تبدیل — مساحت", "ሕጊ ለውጢ — ስፍሓት", "Правило переведення — площа", "Regra de conversão — área", "Xeerka rogaalcelinta — aagga", "Dönüşüm kuralı — alan", "د بدلون قاعده — مساحت"),
      items: A(
        ["Vers la droite → × 100 à chaque rang", "Vers la gauche → ÷ 100 à chaque rang", "Ex. 3 m² = 300 dm² = 30 000 cm²"],
        ["To the right → × 100 per rank", "To the left → ÷ 100 per rank", "E.g. 3 m² = 300 dm² = 30,000 cm²"],
        ["نحو اليمين → × 100 في كل رتبة", "نحو اليسار → ÷ 100 في كل رتبة", "مثال: 3 م² = 300 دم² = 30000 سم²"],
        ["به سمت راست → × 100 در هر رتبه", "به سمت چپ → ÷ 100 در هر رتبه", "مثال: 3 m² = 300 dm² = 30000 cm²"],
        ["ናብ የማን → × 100 ኣብ ነፍሲ ወከፍ ደረጃ", "ናብ ጸጋም → ÷ 100 ኣብ ነፍሲ ወከፍ ደረጃ", "ኣብነት፦ 3 m² = 300 dm² = 30000 cm²"],
        ["Вправо → × 100 на кожен розряд", "Вліво → ÷ 100 на кожен розряд", "Напр. 3 м² = 300 дм² = 30 000 см²"],
        ["Para a direita → × 100 por cada nível", "Para a esquerda → ÷ 100 por cada nível", "Ex. 3 m² = 300 dm² = 30 000 cm²"],
        ["Midig → × 100 heer kasta", "Bidix → ÷ 100 heer kasta", "Tusaale: 3 m² = 300 dm² = 30000 cm²"],
        ["Sağa → her sıra için × 100", "Sola → her sıra için ÷ 100", "Örn. 3 m² = 300 dm² = 30.000 cm²"],
        ["ښي خوا → × 100 هر درجه", "کيڼ خوا → ÷ 100 هر درجه", "بېلګه: 3 m² = 300 dm² = 30000 cm²"]
      )
    },

    // 9 — example (area)
    { text: S(
      "5 m² = 50 000 cm²    |    250 dm² = 2,5 m²    |    1 ha = 10 000 m²",
      "5 m² = 50,000 cm²    |    250 dm² = 2.5 m²    |    1 ha = 10,000 m²",
      "5 م² = 50000 سم²    |    250 دم² = 2,5 م²    |    1 ها = 10000 م²",
      "5 m² = 50 000 cm²    |    250 dm² = 2,5 m²    |    1 ha = 10 000 m²",
      "5 m² = 50 000 cm²    |    250 dm² = 2,5 m²    |    1 ha = 10 000 m²",
      "5 м² = 50 000 см²    |    250 дм² = 2,5 м²    |    1 га = 10 000 м²",
      "5 m² = 50 000 cm²    |    250 dm² = 2,5 m²    |    1 ha = 10 000 m²",
      "5 m² = 50,000 cm²    |    250 dm² = 2,5 m²    |    1 ha = 10,000 m²",
      "5 m² = 50.000 cm²    |    250 dm² = 2,5 m²    |    1 ha = 10.000 m²",
      "5 m² = 50 000 cm²    |    250 dm² = 2,5 m²    |    1 ha = 10 000 m²"
    ) },

    // 10 — heading "Unités de volume (solides)" (black)
    { text: S("Unités de volume (solides)", "Units of volume (solids)", "وحدات الحجم (المجسمات)", "واحدهای حجم (اجسام)", "ናይ ዕቅም ሓደ ዜሮ (ዉሑዳት)", "Одиниці об'єму (тіла)", "Unidades de volume (sólidos)", "Cutubka mugga (walxaha)", "Hacim birimleri (katılar)", "د حجم واحدونه (جامدات)") },

    // 11 — plain
    { text: S(
      "Les unités de volume dérivent du mètre cube **(m³)**. Chaque unité est **1 000 fois** plus grande que la suivante.",
      "Volume units derive from the cubic metre **(m³)**. Each unit is **1,000 times** larger than the next.",
      "وحدات الحجم مشتقة من المتر المكعب **(م³)**. كل وحدة **أكبر بـ 1000 مرة** من التالية.",
      "واحدهای حجم از متر مکعب **(m³)** مشتق می‌شوند. هر واحد **1000 برابر** بزرگ‌تر از بعدی است.",
      "ናይ ዕቅም ሓደ ዜሮ ካብ ሜትር ኩቢ **(m³)** ዝምጽኡ እዮም። ነፍሲ ወከፍ **1000 ግዜ** ካብ ዝቕጽሎ ዝዓቢ እዩ።",
      "Одиниці об'єму походять від кубічного метра **(м³)**. Кожна одиниця **в 1 000 разів** більша за наступну.",
      "As unidades de volume derivam do metro cúbico **(m³)**. Cada unidade é **1 000 vezes** maior que a seguinte.",
      "Cutubka mugga waxaa laga soo qaataa mitir saddex jibbaaran **(m³)**. Mid kasta waa **1000 jeer** ka weyn kan xiga.",
      "Hacim birimleri küp metreden **(m³)** türetilir. Her birim bir sonrakinin **1.000 katıdır**.",
      "د حجم واحدونه د مکعب متر **(m³)** نه اخستل شوي دي. هر واحد د راتلونکي **1000 چنده** لوی دی."
    ) },

    // 12 — table (volume)
    { headers: A(
      ["km³", "m³", "dm³", "cm³", "mm³"],
      ["km³", "m³", "dm³", "cm³", "mm³"],
      ["كم³", "م³", "دم³", "سم³", "مم³"],
      ["km³", "m³", "dm³", "cm³", "mm³"],
      ["km³", "m³", "dm³", "cm³", "mm³"],
      ["км³", "м³", "дм³", "см³", "мм³"],
      ["km³", "m³", "dm³", "cm³", "mm³"],
      ["km³", "m³", "dm³", "cm³", "mm³"],
      ["km³", "m³", "dm³", "cm³", "mm³"],
      ["km³", "m³", "dm³", "cm³", "mm³"]
    ), items: A(
      ["1 000 000 000 m³ | 1 m³ | 0,001 m³ | 0,000001 m³ | 0,000000001 m³"],
      ["1,000,000,000 m³ | 1 m³ | 0.001 m³ | 0.000001 m³ | 0.000000001 m³"],
      ["1 000 000 000 م³ | 1 م³ | 0,001 م³ | 0,000001 م³ | 0,000000001 م³"],
      ["1 000 000 000 m³ | 1 m³ | 0,001 m³ | 0,000001 m³ | 0,000000001 m³"],
      ["1 000 000 000 m³ | 1 m³ | 0,001 m³ | 0,000001 m³ | 0,000000001 m³"],
      ["1 000 000 000 м³ | 1 м³ | 0,001 м³ | 0,000001 м³ | 0,000000001 м³"],
      ["1 000 000 000 m³ | 1 m³ | 0,001 m³ | 0,000001 m³ | 0,000000001 m³"],
      ["1 000 000 000 m³ | 1 m³ | 0,001 m³ | 0,000001 m³ | 0,000000001 m³"],
      ["1.000.000.000 m³ | 1 m³ | 0,001 m³ | 0,000001 m³ | 0,000000001 m³"],
      ["1 000 000 000 m³ | 1 m³ | 0,001 m³ | 0,000001 m³ | 0,000000001 m³"]
    ), caption: S(
      "1 dm³ = 1 litre (L). 1 cm³ = 1 mL.",
      "1 dm³ = 1 litre (L). 1 cm³ = 1 mL.",
      "1 دم³ = 1 لتر (L). 1 سم³ = 1 مل.",
      "1 dm³ = 1 لیتر (L). 1 cm³ = 1 mL.",
      "1 dm³ = 1 ሊትር (L). 1 cm³ = 1 mL.",
      "1 дм³ = 1 літр (л). 1 см³ = 1 мл.",
      "1 dm³ = 1 litro (L). 1 cm³ = 1 mL.",
      "1 dm³ = 1 litir (L). 1 cm³ = 1 mL.",
      "1 dm³ = 1 litre (L). 1 cm³ = 1 mL.",
      "1 dm³ = 1 لیتر (L). 1 cm³ = 1 mL."
    ) },

    // 13 — rule "Règle de conversion — volume"
    { label: S("Règle de conversion — volume", "Conversion rule — volume", "قاعدة التحويل — الحجم", "قانون تبدیل — حجم", "ሕጊ ለውጢ — ዕቅም", "Правило переведення — об'єм", "Regra de conversão — volume", "Xeerka rogaalcelinta — mugga", "Dönüşüm kuralı — hacim", "د بدلون قاعده — حجم"),
      items: A(
        ["Vers la droite → × 1 000 à chaque rang", "Vers la gauche → ÷ 1 000 à chaque rang", "Ex. 2 m³ = 2 000 dm³ = 2 000 000 cm³"],
        ["To the right → × 1,000 per rank", "To the left → ÷ 1,000 per rank", "E.g. 2 m³ = 2,000 dm³ = 2,000,000 cm³"],
        ["نحو اليمين → × 1000 في كل رتبة", "نحو اليسار → ÷ 1000 في كل رتبة", "مثال: 2 م³ = 2000 دم³ = 2000000 سم³"],
        ["به سمت راست → × 1000 در هر رتبه", "به سمت چپ → ÷ 1000 در هر رتبه", "مثال: 2 m³ = 2000 dm³ = 2000000 cm³"],
        ["ናብ የማን → × 1000 ኣብ ነፍሲ ወከፍ ደረጃ", "ናብ ጸጋም → ÷ 1000 ኣብ ነፍሲ ወከፍ ደረጃ", "ኣብነት፦ 2 m³ = 2000 dm³ = 2 000 000 cm³"],
        ["Вправо → × 1 000 на кожен розряд", "Вліво → ÷ 1 000 на кожен розряд", "Напр. 2 м³ = 2 000 дм³ = 2 000 000 см³"],
        ["Para a direita → × 1 000 por cada nível", "Para a esquerda → ÷ 1 000 por cada nível", "Ex. 2 m³ = 2 000 dm³ = 2 000 000 cm³"],
        ["Midig → × 1000 heer kasta", "Bidix → ÷ 1000 heer kasta", "Tusaale: 2 m³ = 2000 dm³ = 2 000 000 cm³"],
        ["Sağa → her sıra için × 1.000", "Sola → her sıra için ÷ 1.000", "Örn. 2 m³ = 2.000 dm³ = 2.000.000 cm³"],
        ["ښي خوا → × 1000 هر درجه", "کيڼ خوا → ÷ 1000 هر درجه", "بېلګه: 2 m³ = 2000 dm³ = 2 000 000 cm³"]
      )
    },

    // 14 — note
    { text: S(
      "Lien important : 1 dm³ = 1 L (litre). Utile pour les conversions entre volume et capacité.",
      "Key link: 1 dm³ = 1 L (litre). Useful for conversions between volume and capacity.",
      "رابط مهم: 1 دم³ = 1 لتر (L). مفيد للتحويل بين الحجم والسعة.",
      "رابطه مهم: 1 dm³ = 1 L (لیتر). برای تبدیل بین حجم و ظرفیت مفید است.",
      "ኣገዳሲ ምትእስሳር፦ 1 dm³ = 1 L (ሊትር). ኣብ መዝወር ዕቅምን ዓቕምን ጠቃሚ እዩ።",
      "Важлива залежність: 1 дм³ = 1 л (літр). Корисно для переведення між об'ємом і місткістю.",
      "Ligação importante: 1 dm³ = 1 L (litro). Útil para conversões entre volume e capacidade.",
      "Xiriir muhiim ah: 1 dm³ = 1 L (litir). Waxtar u leh beddelidda u dhexeysa mugga iyo kayd-awooda.",
      "Önemli bağlantı: 1 dm³ = 1 L (litre). Hacim ile kapasite arasındaki dönüşümler için kullanışlıdır.",
      "مهم تړاو: 1 dm³ = 1 L (لیتر). د حجم او ظرفیت ترمنځ بدلون لپاره ګټور دی."
    ) },
  ],
  consignes: {
    "g2-1-ex1": { fr: "Convertis : 3 km = _____ m", en: "Convert: 3 km = _____ m", ar: "حوّل: 3 km = _____ m", fa: "تبدیل کن: 3 km = _____ m", ti: "ቐይር፦ 3 km = _____ m", uk: "Перетвори: 3 km = _____ m", pt: "Converte: 3 km = _____ m", so: "Beddel: 3 km = _____ m", tr: "Dönüştür: 3 km = _____ m", ps: "واړوه: 3 km = _____ m" },
    "g2-1-ex2": { fr: "Convertis : 250 cm = _____ m", en: "Convert: 250 cm = _____ m", ar: "حوّل: 250 cm = _____ m", fa: "تبدیل کن: 250 cm = _____ m", ti: "ቐይር፦ 250 cm = _____ m", uk: "Перетвори: 250 cm = _____ m", pt: "Converte: 250 cm = _____ m", so: "Beddel: 250 cm = _____ m", tr: "Dönüştür: 250 cm = _____ m", ps: "واړوه: 250 cm = _____ m" },
    "g2-1-ex3": { fr: "Convertis : 4 m² = _____ dm²", en: "Convert: 4 m² = _____ dm²", ar: "حوّل: 4 m² = _____ dm²", fa: "تبدیل کن: 4 m² = _____ dm²", ti: "ቐይር፦ 4 m² = _____ dm²", uk: "Перетвори: 4 m² = _____ dm²", pt: "Converte: 4 m² = _____ dm²", so: "Beddel: 4 m² = _____ dm²", tr: "Dönüştür: 4 m² = _____ dm²", ps: "واړوه: 4 m² = _____ dm²" },
    "g2-1-ex4": { fr: "Convertis : 5 000 cm² = _____ m²", en: "Convert: 5 000 cm² = _____ m²", ar: "حوّل: 5 000 cm² = _____ m²", fa: "تبدیل کن: 5 000 cm² = _____ m²", ti: "ቐይር፦ 5 000 cm² = _____ m²", uk: "Перетвори: 5 000 cm² = _____ m²", pt: "Converte: 5 000 cm² = _____ m²", so: "Beddel: 5 000 cm² = _____ m²", tr: "Dönüştür: 5 000 cm² = _____ m²", ps: "واړوه: 5 000 cm² = _____ m²" },
    "g2-1-ex5": { fr: "Convertis : 2 m³ = _____ dm³", en: "Convert: 2 m³ = _____ dm³", ar: "حوّل: 2 m³ = _____ dm³", fa: "تبدیل کن: 2 m³ = _____ dm³", ti: "ቐይር፦ 2 m³ = _____ dm³", uk: "Перетвори: 2 m³ = _____ dm³", pt: "Converte: 2 m³ = _____ dm³", so: "Beddel: 2 m³ = _____ dm³", tr: "Dönüştür: 2 m³ = _____ dm³", ps: "واړوه: 2 m³ = _____ dm³" },
    "g2-1-pool1": { fr: "5 km = _____ m", en: "5 km = _____ m", ar: "5 km = _____ m", fa: "5 km = _____ m", ti: "5 km = _____ m", uk: "5 km = _____ m", pt: "5 km = _____ m", so: "5 km = _____ m", tr: "5 km = _____ m", ps: "5 km = _____ m" },
    "g2-1-pool2": { fr: "320 cm = _____ m", en: "320 cm = _____ m", ar: "320 cm = _____ m", fa: "320 cm = _____ m", ti: "320 cm = _____ m", uk: "320 cm = _____ m", pt: "320 cm = _____ m", so: "320 cm = _____ m", tr: "320 cm = _____ m", ps: "320 cm = _____ m" },
    "g2-1-pool3": { fr: "1,5 m = _____ cm", en: "1,5 m = _____ cm", ar: "1,5 m = _____ cm", fa: "1,5 m = _____ cm", ti: "1,5 m = _____ cm", uk: "1,5 m = _____ cm", pt: "1,5 m = _____ cm", so: "1,5 m = _____ cm", tr: "1,5 m = _____ cm", ps: "1,5 m = _____ cm" },
    "g2-1-pool4": { fr: "7 m² = _____ dm²", en: "7 m² = _____ dm²", ar: "7 m² = _____ dm²", fa: "7 m² = _____ dm²", ti: "7 m² = _____ dm²", uk: "7 m² = _____ dm²", pt: "7 m² = _____ dm²", so: "7 m² = _____ dm²", tr: "7 m² = _____ dm²", ps: "7 m² = _____ dm²" },
    "g2-1-pool5": { fr: "3 dm³ = _____ cm³", en: "3 dm³ = _____ cm³", ar: "3 dm³ = _____ cm³", fa: "3 dm³ = _____ cm³", ti: "3 dm³ = _____ cm³", uk: "3 dm³ = _____ cm³", pt: "3 dm³ = _____ cm³", so: "3 dm³ = _____ cm³", tr: "3 dm³ = _____ cm³", ps: "3 dm³ = _____ cm³" },
    "g2-1-pool6": { fr: "45 mm = _____ cm", en: "45 mm = _____ cm", ar: "45 mm = _____ cm", fa: "45 mm = _____ cm", ti: "45 mm = _____ cm", uk: "45 mm = _____ cm", pt: "45 mm = _____ cm", so: "45 mm = _____ cm", tr: "45 mm = _____ cm", ps: "45 mm = _____ cm" },
    "g2-1-pool7": { fr: "2,5 km = _____ m", en: "2,5 km = _____ m", ar: "2,5 km = _____ m", fa: "2,5 km = _____ m", ti: "2,5 km = _____ m", uk: "2,5 km = _____ m", pt: "2,5 km = _____ m", so: "2,5 km = _____ m", tr: "2,5 km = _____ m", ps: "2,5 km = _____ m" },
    "g2-1-pool8": { fr: "1 ha = _____ m²", en: "1 ha = _____ m²", ar: "1 ha = _____ m²", fa: "1 ha = _____ m²", ti: "1 ha = _____ m²", uk: "1 ha = _____ m²", pt: "1 ha = _____ m²", so: "1 ha = _____ m²", tr: "1 ha = _____ m²", ps: "1 ha = _____ m²" },
  },
};
