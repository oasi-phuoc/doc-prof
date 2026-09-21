import type { SubmoduleTrad } from "./trad-types";

const S = (fr: string, en: string, ar: string, fa: string, ti: string, uk: string, pt: string, so: string, tr: string, ps: string) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

const A = (fr: string[], en: string[], ar: string[], fa: string[], ti: string[], uk: string[], pt: string[], so: string[], tr: string[], ps: string[]) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

export const TRAD_G4_6: SubmoduleTrad = {
  submoduleId: "G4-6",
  title: {
    fr: "Aire du disque",
    en: "Area of a disk",
    ar: "مساحة القرص",
    fa: "مساحت دیسک",
    ti: "ናይ ዲስክ ሰፊሓ",
    uk: "Площа круга",
  },
  blocks: [
    // 0 — heading "Disque" (black)
    { text: S(
      "Disque",
      "Disk",
      "القرص",
      "دیسک",
      "ዲስክ",
      "Круг",
      "Disco",
      "Wareegga",
      "Disk",
      "دیسک"
    ) },

    // 1 — plain
    { text: S(
      "Le **disque** est la surface intérieure délimitée par le cercle. Son aire dépend du rayon r.",
      "The **disk** is the interior surface enclosed by the circle. Its area depends on the radius r.",
      "**القرص** هو السطح الداخلي المحدود بالدائرة. تعتمد مساحته على نصف القطر r.",
      "**دیسک** سطح داخلی محصور توسط دایره است. مساحت آن به شعاع r بستگی دارد.",
      "**ዲስክ** ናይ ዓውዲ ውሽጠ ሰፊሕ ዩ። ሰፊሓኡ ናይ ፍርቂ-ቁምብዛ r ይምርኰስ።",
      "**Круг** — це внутрішня поверхня, обмежена колом. Його площа залежить від радіуса r.",
      "O **disco** é a superfície interior delimitada pelo círculo. A sua área depende do raio r.",
      "**Wareegga** waa dushaha gudaha ee xadidaaya goobaabka. Bedkiisu wuxuu ku xidhan yahay raadiga r.",
      "**Disk**, çember tarafından sınırlanan iç yüzeydir. Alanı yarıçap r'ye bağlıdır.",
      "**دیسک** د دایرې لخوا محاط داخلي سطح ده. مساحت يې د شعاع r پورې اړه لري."
    ) },

    // 2 — rule "Formule"
    { label: S(
        "Formule", "Formula", "الصيغة", "فرمول", "ቅጥዒ", "Формула", "Fórmula", "Qaacidada", "Formül", "فورمول"
      ),
      items: A(
        ["A = π × r²"],
        ["A = π × r²"],
        ["A = π × r²"],
        ["A = π × r²"],
        ["A = π × r²"],
        ["A = π × r²"],
        ["A = π × r²"],
        ["A = π × r²"],
        ["A = π × r²"],
        ["A = π × r²"]
      )
    },

    // 3 — svg with captionFr
    { caption: S(
      "L'aire du disque est la surface colorée (intérieur du cercle)",
      "The area of the disk is the coloured surface (interior of the circle)",
      "مساحة القرص هي السطح الملون (داخل الدائرة)",
      "مساحت دیسک سطح رنگی است (داخل دایره)",
      "ሰፊሓ ናይ ዲስክ ናይ ሕብሪ ወርሒ ዩ (ውሽጠ ናይ ዓውዲ)",
      "Площа круга — це кольорова поверхня (внутрішня частина кола)",
      "A área do disco é a superfície colorida (interior do círculo)",
      "Aagga wareegga waa dushaha midabka leh (gudaha goobaabka)",
      "Diskin alanı renkli yüzeydir (çemberin iç kısmı)",
      "د دیسک مساحت د رنګي سطح ده (د دایرې داخل)"
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
          "Disque de rayon 5 cm :",
          "A = π × 5² = π × 25 ≈ 3,14 × 25 = **78,5 cm²**",
        ],
        [
          "Disk with radius 5 cm:",
          "A = π × 5² = π × 25 ≈ 3.14 × 25 = **78.5 cm²**",
        ],
        [
          "قرص نصف قطره 5 سم:",
          "A = π × 5² = π × 25 ≈ 3,14 × 25 = **78,5 سم²**",
        ],
        [
          "دیسک با شعاع 5 سانتیمتر:",
          "A = π × 5² = π × 25 ≈ 3.14 × 25 = **78.5 سانتیمتر²**",
        ],
        [
          "ዲስክ ናይ 5 ሰም ፍርቂ-ቁምብዛ:",
          "A = π × 5² = π × 25 ≈ 3.14 × 25 = **78.5 ሰም²**",
        ],
        [
          "Круг з радіусом 5 см:",
          "A = π × 5² = π × 25 ≈ 3,14 × 25 = **78,5 см²**",
        ],
        [
          "Disco de raio 5 cm:",
          "A = π × 5² = π × 25 ≈ 3,14 × 25 = **78,5 cm²**",
        ],
        [
          "Wareeg raadiga 5 cm leh:",
          "A = π × 5² = π × 25 ≈ 3.14 × 25 = **78.5 cm²**",
        ],
        [
          "Yarıçapı 5 cm olan disk:",
          "A = π × 5² = π × 25 ≈ 3,14 × 25 = **78,5 cm²**",
        ],
        [
          "د 5 سم شعاع لرونکی دیسک:",
          "A = π × 5² = π × 25 ≈ 3.14 × 25 = **78.5 سم²**",
        ]
      )
    },

    // 6 — highlight "Si on connaît le diamètre"
    { text: S(
      "Si on connaît le diamètre",
      "If the diameter is known",
      "إذا عُرف القطر",
      "اگر قطر معلوم باشد",
      "ቁምብዛ ምስ ፈለጥካ",
      "Якщо відомий діаметр",
      "Se o diâmetro é conhecido",
      "Haddii dharka la yaqaan",
      "Çap biliniyorsa",
      "که قطر معلوم وي"
    ) },

    // 7 — section (label="", items)
    { label: S("", "", "", "", "", "", "", "", "", ""),
      items: A(
        [
          "r = d ÷ 2, donc A = π × (d ÷ 2)²",
          "Exemple : d = 8 cm → r = 4 cm → A = π × 16 ≈ **50,24 cm²**",
        ],
        [
          "r = d ÷ 2, so A = π × (d ÷ 2)²",
          "Example: d = 8 cm → r = 4 cm → A = π × 16 ≈ **50.24 cm²**",
        ],
        [
          "r = d ÷ 2، إذاً A = π × (d ÷ 2)²",
          "مثال: d = 8 سم → r = 4 سم → A = π × 16 ≈ **50,24 سم²**",
        ],
        [
          "r = d ÷ 2، پس A = π × (d ÷ 2)²",
          "مثال: d = 8 سانتیمتر → r = 4 سانتیمتر → A = π × 16 ≈ **50.24 سانتیمتر²**",
        ],
        [
          "r = d ÷ 2, ስለዚ A = π × (d ÷ 2)²",
          "ምሳሌ: d = 8 ሰም → r = 4 ሰም → A = π × 16 ≈ **50.24 ሰም²**",
        ],
        [
          "r = d ÷ 2, тому A = π × (d ÷ 2)²",
          "Приклад: d = 8 см → r = 4 см → A = π × 16 ≈ **50,24 см²**",
        ],
        [
          "r = d ÷ 2, portanto A = π × (d ÷ 2)²",
          "Exemplo: d = 8 cm → r = 4 cm → A = π × 16 ≈ **50,24 cm²**",
        ],
        [
          "r = d ÷ 2, sidaas awgeed A = π × (d ÷ 2)²",
          "Tusaale: d = 8 cm → r = 4 cm → A = π × 16 ≈ **50.24 cm²**",
        ],
        [
          "r = d ÷ 2, dolayısıyla A = π × (d ÷ 2)²",
          "Örnek: d = 8 cm → r = 4 cm → A = π × 16 ≈ **50,24 cm²**",
        ],
        [
          "r = d ÷ 2، نو A = π × (d ÷ 2)²",
          "مثال: d = 8 سم → r = 4 سم → A = π × 16 ≈ **50.24 سم²**",
        ]
      )
    },

    // 8 — highlight "À ne pas confondre"
    { text: S(
      "À ne pas confondre",
      "Not to be confused",
      "لا تخلط بين",
      "اشتباه نگیرید",
      "ከምዚ ዘይፍለጥ",
      "Не плутати",
      "Não confundir",
      "Ha ku khaldin",
      "Karıştırmayın",
      "ګډوډ مه کوئ"
    ) },

    // 9 — section (label="", items)
    { label: S("", "", "", "", "", "", "", "", "", ""),
      items: A(
        [
          "**Aire du disque** A = πr² (surface intérieure)",
          "**Circonférence** C = 2πr (longueur du contour)",
        ],
        [
          "**Area of the disk** A = πr² (interior surface)",
          "**Circumference** C = 2πr (perimeter length)",
        ],
        [
          "**مساحة القرص** A = πr² (السطح الداخلي)",
          "**المحيط** C = 2πr (طول المحيط)",
        ],
        [
          "**مساحت دیسک** A = πr² (سطح داخلی)",
          "**محیط** C = 2πr (طول خط دایره)",
        ],
        [
          "**ሰፊሓ ናይ ዲስክ** A = πr² (ውሽጠ ሰፊሕ)",
          "**ዙርያ** C = 2πr (ቁመት ናይ ዶብ)",
        ],
        [
          "**Площа круга** A = πr² (внутрішня поверхня)",
          "**Довжина кола** C = 2πr (периметр)",
        ],
        [
          "**Área do disco** A = πr² (superfície interior)",
          "**Circunferência** C = 2πr (comprimento do contorno)",
        ],
        [
          "**Aagga wareegga** A = πr² (dushaha gudaha)",
          "**Wareegga** C = 2πr (dhererka xaddida)",
        ],
        [
          "**Disk alanı** A = πr² (iç yüzey)",
          "**Çevre** C = 2πr (çember uzunluğu)",
        ],
        [
          "**د دیسک مساحت** A = πr² (داخلي سطح)",
          "**محیط** C = 2πr (د دایرې اوږدوالی)",
        ]
      )
    },
  ],
  paragraphs: {
    fr: [
          "Le disque est la région intérieure délimitée par le cercle. Formule : A = πr².",
          "Exemple : disque de rayon 5 cm → A = π × 5² = 25π ≈ 78,5 cm².",
          "Si on connaît le diamètre : r = d/2, donc A = π(d/2)² = πd²/4.",
          "Attention aux unités : si r est en cm, A est en cm².",
        ],
    en: [
          "A disk is the interior region of a circle. Formula: A = πr².",
          "Example: radius 5 cm → A = 25π ≈ 78.5 cm².",
          "If diameter is known: r = d/2, so A = πd²/4.",
          "Units: if r is in cm, A is in cm².",
        ],
    ar: [
          "القرص هو المنطقة الداخلية للدائرة. الصيغة: A = πr².",
          "مثال: نصف قطر 5 سم → A ≈ 78,5 سم².",
          "إذا عُرف القطر: r = d/2.",
          "الوحدات: إذا كان r بالسم فالمساحة بالسم².",
        ],
    fa: [
          "دیسک ناحیه داخلی دایره است. فرمول: A = πr².",
          "مثال: شعاع 5 سانتیمتر → A ≈ 78.5 سانتیمتر².",
          "اگر قطر معلوم باشد: r = d/2.",
          "واحدها: اگر r به سانتیمتر باشد A به سانتیمتر² است.",
        ],
    ti: [
          "ዲስክ ናይ ዓውዲ ውሽጠ ቦታ ዩ. ቅጥዒ: A = πr².",
          "ምሳሌ: ናይ ፍርቂ-ቁምብዛ 5 ሰም → A ≈ 78.5 ሰም².",
          "ቁምብዛ ምስ ፈለጥካ: r = d/2.",
          "ኣሃዙ: r ሰም ምስ ዝኸውን A ሰም² ዩ.",
        ],
    uk: [
          "Круг — внутрішня область кола. Формула: A = πr².",
          "Приклад: радіус 5 см → A = 25π ≈ 78,5 см².",
          "Якщо відомий діаметр: r = d/2.",
          "Одиниці: якщо r у см, то A у см².",
        ],
  },
  consignes: {
    "g3-6-e1": { fr: "Aire d'un disque de rayon 4 cm (π ≈ 3,14).", en: "Aire d'un disque de rayon 4 cm (π ≈ 3.14).",
      ar: "مساحة قرص نصف قطره 4 سم (π ≈ 3,14).",
      fa: "مساحت دیسکی با شعاع ۴ سانتی‌متر (π ≈ 3,14).",
      pt: "Área de um disco com raio 4 cm (π ≈ 3,14).",
      so: "Aagga saxanka leh raad 4 cm (π ≈ 3,14).",
      ti: "4 ሰ.ሜ ራዲዩስ ዘለዎ ዲስኮ ስፍሓት (π ≈ 3,14)።",
      tr: "Yarıçapı 4 cm olan bir diskin alanı (π ≈ 3,14).",
      ps: "د 4 سم شعاع لرونکي ډیسک مساحت (π ≈ 3,14).",
      uk: "Площа круга з радіусом 4 см (π ≈ 3,14)." },
    "g3-6-e2": { fr: "Aire d'un disque de rayon 10 cm (π ≈ 3,14).", en: "Aire d'un disque de rayon 10 cm (π ≈ 3.14).",
      ar: "مساحة قرص نصف قطره 10 سم (π ≈ 3,14).",
      fa: "مساحت دیسکی با شعاع ۱۰ سانتی‌متر (π ≈ 3,14).",
      pt: "Área de um disco com raio 10 cm (π ≈ 3,14).",
      so: "Aagga saxanka leh raad 10 cm (π ≈ 3,14).",
      ti: "10 ሰ.ሜ ራዲዩስ ዘለዎ ዲስኮ ስፍሓት (π ≈ 3,14)።",
      tr: "Yarıçapı 10 cm olan bir diskin alanı (π ≈ 3,14).",
      ps: "د 10 سم شعاع لرونکي ډیسک مساحت (π ≈ 3,14).",
      uk: "Площа круга з радіусом 10 см (π ≈ 3,14)." },
    "g3-6-e3": { fr: "Aire d'un disque de diamètre 8 cm (π ≈ 3,14).", en: "Aire d'un disque de diametre 8 cm (π ≈ 3.14).",
      ar: "مساحة قرص قطره 8 سم (π ≈ 3,14).",
      fa: "مساحت دیسکی با قطر ۸ سانتی‌متر (π ≈ 3,14).",
      pt: "Área de um disco com diâmetro 8 cm (π ≈ 3,14).",
      so: "Aagga saxanka leh qalabka 8 cm (π ≈ 3,14).",
      ti: "8 ሰ.ሜ ዲያሜትር ዘለዎ ዲስኮ ስፍሓት (π ≈ 3,14)።",
      tr: "Çapı 8 cm olan bir diskin alanı (π ≈ 3,14).",
      ps: "د 8 سم قطر لرونکي ډیسک مساحت (π ≈ 3,14).",
      uk: "Площа круга з діаметром 8 см (π ≈ 3,14)." },
    "g3-6-e4": { fr: "Un disque a une aire de 78,5 cm² (π ≈ 3,14). Quel est son rayon ?", en: "Un disque a une aire de 78.5 cm² (π ≈ 3.14). Quel est son rayon ?",
      ar: "قرص مساحته 78,5 سم² (π ≈ 3,14). ما نصف قطره؟",
      fa: "دیسکی با مساحت ۷۸٫۵ سانتی‌متر مربع (π ≈ 3,14). شعاعش چقدر است؟",
      pt: "Um disco tem uma área de 78,5 cm² (π ≈ 3,14). Qual é o seu raio?",
      so: "Saxan leh aag 78,5 cm² (π ≈ 3,14). Raadkeedu waa maxay?",
      ti: "78,5 ሰ.ሜ² ስፍሓት ዘለዎ ዲስኮ (π ≈ 3,14)። ራዲዩሱ ምንታይ?",
      tr: "Bir diskin alanı 78,5 cm² (π ≈ 3,14). Yarıçapı nedir?",
      ps: "یو ډیسک د 78,5 سم² مساحت لري (π ≈ 3,14). د هغې شعاع کچه؟",
      uk: "Круг має площу 78,5 см² (π ≈ 3,14). Який його радіус?" },
    "g3-6-e5": { fr: "Aire d'un disque de rayon 3 cm (π ≈ 3,14).", en: "Aire d'un disque de rayon 3 cm (π ≈ 3.14).",
      ar: "مساحة قرص نصف قطره 3 سم (π ≈ 3,14).",
      fa: "مساحت دیسکی با شعاع ۳ سانتی‌متر (π ≈ 3,14).",
      pt: "Área de um disco com raio 3 cm (π ≈ 3,14).",
      so: "Aagga saxanka leh raad 3 cm (π ≈ 3,14).",
      ti: "3 ሰ.ሜ ራዲዩስ ዘለዎ ዲስኮ ስፍሓት (π ≈ 3,14)།",
      tr: "Yarıçapı 3 cm olan bir diskin alanı (π ≈ 3,14).",
      ps: "د 3 سم شعاع لرونکي ډیسک مساحت (π ≈ 3,14).",
      uk: "Площа круга з радіусом 3 см (π ≈ 3,14)." },
  },
};
