import type { SubmoduleTrad } from "./trad-types";

const S = (fr: string, en: string, ar: string, fa: string, ti: string, uk: string, pt: string, so: string, tr: string, ps: string) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

const A = (fr: string[], en: string[], ar: string[], fa: string[], ti: string[], uk: string[], pt: string[], so: string[], tr: string[], ps: string[]) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

export const TRAD_G4_3: SubmoduleTrad = {
  submoduleId: "G4-3",
  title: {
    fr: "Aire du triangle",
    en: "Area of a triangle",
    ar: "مساحة المثلث",
    fa: "مساحت مثلث",
    ti: "ናይ ሰለስ-ጎቦ ሰፊሓ",
    uk: "Площа трикутника",
  },
  blocks: [
    // 0 — heading "Triangle" (black)
    { text: S(
      "Triangle",
      "Triangle",
      "المثلث",
      "مثلث",
      "ሰለስ-ጎቦ",
      "Трикутник",
      "Triângulo",
      "Saddex-xagal",
      "Üçgen",
      "مثلث"
    ) },

    // 1 — plain
    { text: S(
      "L'aire d'un triangle dépend de sa **base (b)** et de sa **hauteur (h)**.",
      "The area of a triangle depends on its **base (b)** and its **height (h)**.",
      "مساحة المثلث تعتمد على **قاعدته (b)** وعلى **ارتفاعه (h)**.",
      "مساحت مثلث به **قاعده (b)** و **ارتفاع (h)** آن بستگی دارد.",
      "ሰፊሓ ናይ ሰለስ-ጎቦ ናይ **ሰረቱ (b)** ን **ቁመቱ (h)** ይምርኰስ።",
      "Площа трикутника залежить від його **основи (b)** та **висоти (h)**.",
      "A área de um triângulo depende da sua **base (b)** e da sua **altura (h)**.",
      "Aagga saddex-xagalka wuxuu ku xidhan yahay **saldhiggiisa (b)** iyo **dhererkooda (h)**.",
      "Bir üçgenin alanı **tabanına (b)** ve **yüksekliğine (h)** bağlıdır.",
      "د مثلث مساحت د **قاعدې (b)** او **لوړوالي (h)** پورې اړه لري."
    ) },

    // 2 — rule "Formule"
    { label: S(
        "Formule", "Formula", "الصيغة", "فرمول", "ቅጥዒ", "Формула", "Fórmula", "Qaacidada", "Formül", "فورمول"
      ),
      items: A(
        ["A = (b × h) ÷ 2"],
        ["A = (b × h) ÷ 2"],
        ["A = (b × h) ÷ 2"],
        ["A = (b × h) ÷ 2"],
        ["A = (b × h) ÷ 2"],
        ["A = (b × h) ÷ 2"],
        ["A = (b × h) ÷ 2"],
        ["A = (b × h) ÷ 2"],
        ["A = (b × h) ÷ 2"],
        ["A = (b × h) ÷ 2"]
      )
    },

    // 3 — highlight "Qu'est-ce que la hauteur ?"
    { text: S(
      "Qu'est-ce que la hauteur ?",
      "What is the height?",
      "ما هو الارتفاع؟",
      "ارتفاع چیست؟",
      "ቁመት ምንታይ ዩ?",
      "Що таке висота?",
      "O que é a altura?",
      "Dhererku maxuu yahay?",
      "Yükseklik nedir?",
      "لوړوالی څه ده؟"
    ) },

    // 4 — section (label="", items)
    { label: S("", "", "", "", "", "", "", "", "", ""),
      items: A(
        [
          "La **hauteur** est la **distance perpendiculaire** entre la base et le sommet opposé.",
          "Ce n'est pas la longueur du côté oblique — c'est la ligne droite qui tombe à angle droit sur la base.",
        ],
        [
          "The **height** is the **perpendicular distance** between the base and the opposite vertex.",
          "It is not the length of the slanted side — it is the straight line that falls at a right angle to the base.",
        ],
        [
          "**الارتفاع** هو **المسافة العمودية** بين القاعدة والرأس المقابل.",
          "إنه ليس طول الضلع المائل — بل هو الخط المستقيم الذي يسقط بزاوية قائمة على القاعدة.",
        ],
        [
          "**ارتفاع** **فاصله عمودی** بین قاعده و رأس مقابل است.",
          "طول ضلع مایل نیست — بلکه خط مستقیمی است که با زاویه قائمه بر قاعده می‌افتد.",
        ],
        [
          "**ቁመት** ካብ ሰረት ናብ ዝቃወሞ ርእሲ **ቀጥታ ርሕቀት** ዩ።",
          "ናይ ጥምዙዝ ጎቦ ቁመት ኣይኮነን — ብዓቀን ቀጥተ-ሸነኽ ናብ ሰረት ዝወርድ መስመር ዩ።",
        ],
        [
          "**Висота** — це **перпендикулярна відстань** між основою і протилежною вершиною.",
          "Це не довжина похилої сторони — це пряма лінія, що падає під прямим кутом на основу.",
        ],
        [
          "A **altura** é a **distância perpendicular** entre a base e o vértice oposto.",
          "Não é o comprimento do lado oblíquo — é a linha reta que cai em ângulo reto sobre a base.",
        ],
        [
          "**Dhererku** waa **masaafada toosan** u dhexeysa saldhigga iyo xagalka sare ee ka soo horjeeda.",
          "Kuma ahan dhererka dhinaca jeex-jeexan — waa xariiqda toosan ee hoos ugu dhacda xagal toosan saldhigga.",
        ],
        [
          "**Yükseklik**, taban ile karşı tepe arasındaki **dik mesafedir**.",
          "Eğik kenarın uzunluğu değildir — tabana dik açıyla inen düz çizgidir.",
        ],
        [
          "**لوړوالی** د قاعدې او د مخالف رأس تر مینځ **عمودي واټن** دی.",
          "د مایل اړخ اوږدوالی نه دی — هغه مستقیم کرښه ده چې عمودي زاویه کې قاعدې ته راځي.",
        ]
      )
    },

    // 5 — svg with captionFr
    { caption: S(
      "Base b et hauteur h (mesurée à l'extérieur, perpendiculaire à b)",
      "Base b and height h (measured outside, perpendicular to b)",
      "القاعدة b والارتفاع h (قياس خارجي، عمودي على b)",
      "قاعده b و ارتفاع h (اندازه‌گیری از خارج، عمود بر b)",
      "ሰረት b ን ቁመት h (ካብ ደገ ዝሕሰብ, ቀጥታዊ ናብ b)",
      "Основа b і висота h (виміряна зовні, перпендикулярно до b)",
      "Base b e altura h (medida no exterior, perpendicular a b)",
      "Saldhigga b iyo dhererka h (la cabiray dibadda, toosan b)",
      "Taban b ve yükseklik h (dışarıdan ölçülür, b'ye dik)",
      "قاعده b او لوړوالی h (د بهر اندازه کول، d عمودي b ته)"
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
        [
          "Triangle base 10 cm, hauteur 6 cm :",
          "A = (10 × 6) ÷ 2 = **30 cm²**",
        ],
        [
          "Triangle base 10 cm, height 6 cm:",
          "A = (10 × 6) ÷ 2 = **30 cm²**",
        ],
        [
          "مثلث قاعدة 10 سم، ارتفاع 6 سم:",
          "A = (10 × 6) ÷ 2 = **30 سم²**",
        ],
        [
          "مثلث قاعده 10 سانتیمتر، ارتفاع 6 سانتیمتر:",
          "A = (10 × 6) ÷ 2 = **30 سانتیمتر²**",
        ],
        [
          "ሰለስ-ጎቦ ሰረት 10 ሰም, ቁመት 6 ሰም:",
          "A = (10 × 6) ÷ 2 = **30 ሰም²**",
        ],
        [
          "Трикутник основа 10 см, висота 6 см:",
          "A = (10 × 6) ÷ 2 = **30 см²**",
        ],
        [
          "Triângulo base 10 cm, altura 6 cm:",
          "A = (10 × 6) ÷ 2 = **30 cm²**",
        ],
        [
          "Saddex-xagal saldhig 10 cm, dherer 6 cm:",
          "A = (10 × 6) ÷ 2 = **30 cm²**",
        ],
        [
          "Üçgen taban 10 cm, yükseklik 6 cm:",
          "A = (10 × 6) ÷ 2 = **30 cm²**",
        ],
        [
          "مثلث قاعده 10 سم، لوړوالی 6 سم:",
          "A = (10 × 6) ÷ 2 = **30 سم²**",
        ]
      )
    },

    // 8 — highlight "Intuition"
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

    // 9 — section (label="", items)
    { label: S("", "", "", "", "", "", "", "", "", ""),
      items: A(
        [
          "Le triangle occupe exactement **la moitié** du rectangle de même base et hauteur.",
        ],
        [
          "The triangle occupies exactly **half** of the rectangle with the same base and height.",
        ],
        [
          "المثلث يشغل بالضبط **نصف** المستطيل بنفس القاعدة والارتفاع.",
        ],
        [
          "مثلث دقیقاً **نصف** مستطیلی با قاعده و ارتفاع یکسان را اشغال می‌کند.",
        ],
        [
          "ሰለስ-ጎቦ ናይ ሓደ ሰረት ን ቁመት ዘለዎ ካሬ-ሓለቃ **ፍርቁ** ዩ።",
        ],
        [
          "Трикутник займає рівно **половину** прямокутника з тією самою основою і висотою.",
        ],
        [
          "O triângulo ocupa exatamente **metade** do retângulo com a mesma base e altura.",
        ],
        [
          "Saddex-xagalku wuxuu ku jiraa **khamaarta** wareegsanaanta isku saldhig iyo dherer leh.",
        ],
        [
          "Üçgen, aynı taban ve yüksekliğe sahip dikdörtgenin tam olarak **yarısını** kaplar.",
        ],
        [
          "مثلث د ورته قاعدې او لوړوالي مستطیل دقیقاً **نیمه** نیسي.",
        ]
      )
    },
  ],
  paragraphs: {
    fr: [
          "Formule : A = (base × hauteur) ÷ 2.",
          "La hauteur est la distance perpendiculaire entre la base et le sommet opposé (pas nécessairement un côté).",
          "Exemple : triangle base 10 cm, hauteur 6 cm → A = (10 × 6) ÷ 2 = 30 cm².",
          "Intuition : le triangle occupe exactement la moitié du rectangle de même base et hauteur.",
        ],
    en: [
          "Formula: A = (base × height) ÷ 2.",
          "The height is the perpendicular distance from the base to the opposite vertex.",
          "Example: base 10 cm, height 6 cm → A = (10 × 6) ÷ 2 = 30 cm².",
          "Intuition: a triangle is half the rectangle with the same base and height.",
        ],
    ar: [
          "الصيغة: A = (القاعدة × الارتفاع) ÷ 2.",
          "الارتفاع هو المسافة العمودية من القاعدة إلى الرأس المقابل.",
          "مثال: قاعدة 10 سم، ارتفاع 6 سم → A = 30 سم².",
          "حدسياً: المثلث نصف المستطيل بنفس القاعدة والارتفاع.",
        ],
    fa: [
          "فرمول: A = (قاعده × ارتفاع) ÷ 2.",
          "ارتفاع فاصله عمودی از قاعده تا رأس مقابل است.",
          "مثال: قاعده 10 سانتیمتر، ارتفاع 6 سانتیمتر → A = 30 سانتیمتر².",
          "شهود: مثلث نصف مستطیل با قاعده و ارتفاع یکسان است.",
        ],
    ti: [
          "ቅጥዒ: A = (ሰረት × ቁመት) ÷ 2.",
          "ቁመት ካብ ሰረት ናብ ዝቃወሞ ርእሲ ቀጥታ ርሕቀት ዩ.",
          "ምሳሌ: ሰረት 10 ሰም, ቁመት 6 ሰም → A = 30 ሰም².",
          "ሰለስ-ጎቦ ናይ ሓደ ሰረት ን ቁመት ዘለዎ ካሬ-ሓለቃ ፍርቂ ዩ.",
        ],
    uk: [
          "Формула: A = (основа × висота) ÷ 2.",
          "Висота — перпендикулярна відстань від основи до протилежної вершини.",
          "Приклад: основа 10 см, висота 6 см → A = 30 см².",
          "Трикутник займає рівно половину прямокутника з тією ж основою і висотою.",
        ],
  },
  consignes: {
    "g3-3-e1": { fr: "Aire d'un triangle : base 8 cm, hauteur 5 cm.", en: "Area of a triangle: base 8 cm, height 5 cm.",
      ar: "مساحة مثلث: القاعدة 8 سم، الارتفاع 5 سم.",
      fa: "مساحت مثلث: قاعده ۸ سانتی‌متر، ارتفاع ۵ سانتی‌متر.",
      pt: "Área de um triângulo: base 8 cm, altura 5 cm.",
      so: "Aagga sadex-xagal: saldhig 8 cm, dherer 5 cm.",
      ti: "ሰሌስቲ ስፍሓት: ሰፊሕ ሸነኽ 8 ሰ.ሜ, ቁመት 5 ሰ.ሜ።",
      tr: "Bir üçgenin alanı: taban 8 cm, yükseklik 5 cm.",
      ps: "د مثلث مساحت: اساس 8 سم، لوړوالی 5 سم.",
      uk: "Площа трикутника: основа 8 см, висота 5 см." },
    "g3-3-e2": { fr: "Aire d'un triangle : base 12 cm, hauteur 9 cm.", en: "Area of a triangle: base 12 cm, height 9 cm.",
      ar: "مساحة مثلث: القاعدة 12 سم، الارتفاع 9 سم.",
      fa: "مساحت مثلث: قاعده ۱۲ سانتی‌متر، ارتفاع ۹ سانتی‌متر.",
      pt: "Área de um triângulo: base 12 cm, altura 9 cm.",
      so: "Aagga sadex-xagal: saldhig 12 cm, dherer 9 cm.",
      ti: "ሰሌስቲ ስፍሓት: ሰፊሕ ሸነኽ 12 ሰ.ሜ, ቁመት 9 ሰ.ሜ።",
      tr: "Bir üçgenin alanı: taban 12 cm, yükseklik 9 cm.",
      ps: "د مثلث مساحت: اساس 12 سم، لوړوالی 9 سم.",
      uk: "Площа трикутника: основа 12 см, висота 9 см." },
    "g3-3-e3": { fr: "Triangle d'aire 30 cm² et base 10 cm. Hauteur = ?", en: "Triangle with area 30 cm² and base 10 cm. Height = ?",
      ar: "مثلث مساحته 30 سم² وقاعدته 10 سم. الارتفاع = ؟",
      fa: "مثلثی با مساحت ۳۰ سانتی‌متر مربع و قاعده ۱۰ سانتی‌متر. ارتفاع = ؟",
      pt: "Triângulo com área 30 cm² e base 10 cm. Altura = ?",
      so: "Sadex-xagal leh aag 30 cm² iyo saldhig 10 cm. Dhererka = ?",
      ti: "30 ሰ.ሜ² ስፍሓትን 10 ሰ.ሜ ሰፊሕ ሸነኽን ዘለዎ ሰሌስቲ። ቁመት = ?",
      tr: "Alanı 30 cm² ve tabanı 10 cm olan üçgen. Yükseklik = ?",
      ps: "د 30 سم² مساحت او 10 سم اساس لرونکی مثلث. لوړوالی = ؟",
      uk: "Трикутник із площею 30 см² і основою 10 см. Висота = ?" },
    "g3-3-e4": { fr: "Aire d'un triangle rectangle : cathètes 6 et 8 cm.", en: "Area of a right triangle: legs 6 et 8 cm.",
      ar: "مساحة مثلث قائم الزاوية: الساقان 6 و 8 سم.",
      fa: "مساحت مثلث قائم‌الزاویه: دو ضلع قائم ۶ و ۸ سانتی‌متر.",
      pt: "Área de um triângulo rectângulo: catetos 6 e 8 cm.",
      so: "Aagga sadex-xagal toosan: labada dhinac ee toosan 6 iyo 8 cm.",
      ti: "ቅድሜ ኩርናዕ ሰሌስቲ ስፍሓት: ክልተ ሸነኻት 6 ን 8 ን ሰ.ሜ።",
      tr: "Dik üçgenin alanı: dik kenarlar 6 ve 8 cm.",
      ps: "د سم الزاویه مثلث مساحت: دوه ضلع 6 او 8 سم.",
      uk: "Площа прямокутного трикутника: катети 6 і 8 см." },
    "g3-3-e5": { fr: "Triangle équilatéral de côté 6 cm et hauteur 5,2 cm. Aire ≈ ?", en: "Triangle equilateral de cote 6 cm et hauteur 5.2 cm. Aire ≈ ?",
      ar: "مثلث متساوي الأضلاع طول ضلعه 6 سم وارتفاعه 5,2 سم. المساحة ≈ ؟",
      fa: "مثلث متساوی‌الاضلاع با ضلع ۶ سانتی‌متر و ارتفاع ۵٫۲ سانتی‌متر. مساحت ≈ ؟",
      pt: "Triângulo equilátero de lado 6 cm e altura 5,2 cm. Área ≈ ?",
      so: "Sadex-xagal siman oo leh dhinac 6 cm iyo dherer 5,2 cm. Aagga ≈ ?",
      ti: "6 ሰ.ሜ ሸነኽን 5,2 ሰ.ሜ ቁመትን ዘለዎ ማዕረ ሸነኽ ሰሌስቲ። ስፍሓት ≈ ?",
      tr: "Kenarı 6 cm ve yüksekliği 5,2 cm olan eşkenar üçgen. Alan ≈ ?",
      ps: "د 6 سم اړخ او 5,2 سم لوړوالي لرونکی متساوي الاضلاع مثلث. مساحت ≈ ؟",
      uk: "Рівносторонній трикутник зі стороною 6 см і висотою 5,2 см. Площа ≈ ?" },
  },
};
