import type { SubmoduleTrad } from "./trad-types";

const S = (fr: string, en: string, ar: string, fa: string, ti: string, uk: string, pt: string, so: string, tr: string, ps: string) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

const A = (fr: string[], en: string[], ar: string[], fa: string[], ti: string[], uk: string[], pt: string[], so: string[], tr: string[], ps: string[]) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

export const TRAD_G4_8: SubmoduleTrad = {
  submoduleId: "G4-8",
  title: {
    fr: "Figures composées",
    en: "Composite figures",
    ar: "الأشكال المركبة",
    fa: "شکل‌های ترکیبی",
    ti: "ዝተጣመሩ ቅርጽታት",
    uk: "Складені фігури",
    pt: "Figuras compostas",
    so: "Qaabab isku-dhafan",
    tr: "Bileşik şekiller",
    ps: "مرکب شکلونه",
  },
  blocks: [
    // 0 — heading "Figures composées" (black)
    { text: S(
      "Figures composées",
      "Composite figures",
      "الأشكال المركبة",
      "شکل‌های ترکیبی",
      "ዝተጣመሩ ቅርጽታት",
      "Складені фігури",
      "Figuras compostas",
      "Qaabab isku-dhafan",
      "Bileşik şekiller",
      "مرکب شکلونه"
    ) },

    // 1 — plain
    { text: S(
      "Une **figure composée** est formée de plusieurs figures simples assemblées. On calcule son aire en **additionnant** les aires de chaque partie.",
      "A **composite figure** is formed by assembling several simple shapes. Its area is calculated by **adding** the areas of each part.",
      "**الشكل المركب** يتكون من عدة أشكال بسيطة مجمّعة. نحسب مساحته بـ**جمع** مساحات كل جزء.",
      "**شکل ترکیبی** از چند شکل ساده تشکیل شده است. مساحت آن با **جمع** مساحت هر قسمت محاسبه می‌شود.",
      "**ዝተጣመረ ቅርጺ** ካብ ብዙሓት ቀለልቲ ቅርጽታት ዝህነጽ ዩ። ሰፊሓኡ ናይ ነፍሲ ወከፍ ክፋል ሰፊሓ **ብምድማር** ዝሕሰብ ዩ።",
      "**Складена фігура** утворена з кількох простих фігур. Її площа обчислюється **додаванням** площ кожної частини.",
      "Uma **figura composta** é formada por várias figuras simples reunidas. A sua área calcula-se **somando** as áreas de cada parte.",
      "**Qaabka isku-dhafan** wuxuu ka samaysan yahay qaabab fudud oo dhowr ah oo la isku geeyey. Bedkiisa waxaa lagu xisaabiyaa **isku darista** bedadka qayb kasta.",
      "**Bileşik şekil**, birkaç basit şeklin bir araya getirilmesiyle oluşur. Alanı her parçanın alanları **toplanarak** hesaplanır.",
      "**مرکب شکل** د څو ساده شکلونو د یوځای کولو سره جوړ دی. د هغه مساحت د هر برخې مساحتونو د **جمع کولو** سره حسابېږي."
    ) },

    // 2 — rule "Méthode"
    { label: S(
        "Méthode", "Method", "الطريقة", "روش", "ሜላ", "Метод", "Método", "Habka", "Yöntem", "طريقه"
      ),
      items: A(
        ["A_totale = A₁ + A₂ + A₃ + …"],
        ["A_total = A₁ + A₂ + A₃ + …"],
        ["A_الكلية = A₁ + A₂ + A₃ + …"],
        ["A_کل = A₁ + A₂ + A₃ + …"],
        ["A_ጠቕላሊ = A₁ + A₂ + A₃ + …"],
        ["A_загальна = A₁ + A₂ + A₃ + …"],
        ["A_total = A₁ + A₂ + A₃ + …"],
        ["A_guud = A₁ + A₂ + A₃ + …"],
        ["A_toplam = A₁ + A₂ + A₃ + …"],
        ["A_ټول = A₁ + A₂ + A₃ + …"]
      )
    },

    // 3 — highlight "Démarche"
    { text: S(
      "Démarche",
      "Approach",
      "الخطوات",
      "رویکرد",
      "ኣቀራርባ",
      "Підхід",
      "Abordagem",
      "Habka",
      "Yaklaşım",
      "طریقه"
    ) },

    // 4 — section (label="", items)
    { label: S("", "", "", "", "", "", "", "", "", ""),
      items: A(
        [
          "**1.** Identifier et dessiner les figures simples qui composent la figure.",
          "**2.** Calculer l'aire de chaque partie séparément.",
          "**3.** Additionner toutes les aires.",
        ],
        [
          "**1.** Identify and draw the simple shapes that make up the figure.",
          "**2.** Calculate the area of each part separately.",
          "**3.** Add all the areas together.",
        ],
        [
          "**1.** حدد وارسم الأشكال البسيطة التي تكوّن الشكل.",
          "**2.** احسب مساحة كل جزء بشكل منفصل.",
          "**3.** اجمع جميع المساحات.",
        ],
        [
          "**1.** اشکال ساده‌ای که شکل را تشکیل می‌دهند را شناسایی و رسم کنید.",
          "**2.** مساحت هر قسمت را جداگانه محاسبه کنید.",
          "**3.** همه مساحت‌ها را جمع کنید.",
        ],
        [
          "**1.** ናይ ቅርጺ ቀለልቲ ቅርጽታት ፍለጥ ን ስኣሎ።",
          "**2.** ናይ ነፍሲ ወከፍ ክፋል ሰፊሓ ብውሱን ሕሰብ።",
          "**3.** ኩሉ ሰፊሓ ደምር።",
        ],
        [
          "**1.** Визначити та намалювати прості фігури, що складають фігуру.",
          "**2.** Обчислити площу кожної частини окремо.",
          "**3.** Додати всі площі.",
        ],
        [
          "**1.** Identificar e desenhar as figuras simples que compõem a figura.",
          "**2.** Calcular a área de cada parte separadamente.",
          "**3.** Somar todas as áreas.",
        ],
        [
          "**1.** Aqoonso oo sawir qaababka fudud ee ka samaysan qaabka.",
          "**2.** Xisaabi bedka qayb kasta gooni-gooni.",
          "**3.** Isku dar dhammaan bedadka.",
        ],
        [
          "**1.** Şekli oluşturan basit şekilleri belirleyin ve çizin.",
          "**2.** Her parçanın alanını ayrı ayrı hesaplayın.",
          "**3.** Tüm alanları toplayın.",
        ],
        [
          "**1.** هغه ساده شکلونه وپېژنئ او رسم کړئ چې شکل یې جوړوي.",
          "**2.** د هر برخې مساحت جلا جلا حساب کړئ.",
          "**3.** ټول مساحتونه جمع کړئ.",
        ]
      )
    },

    // 5 — svg with captionFr
    { caption: S(
      "Maison = rectangle + triangle → A = A_rect + A_tri",
      "House = rectangle + triangle → A = A_rect + A_tri",
      "منزل = مستطيل + مثلث → A = A_مست + A_مث",
      "خانه = مستطیل + مثلث → A = A_مست + A_مث",
      "ቤት = ካሬ-ሓለቃ + ሰለስ-ጎቦ → A = A_ካሬ + A_ሰለስ",
      "Будинок = прямокутник + трикутник → A = A_прям + A_трик",
      "Casa = retângulo + triângulo → A = A_ret + A_tri",
      "Guri = wareegsanaanta + saddex-xagal → A = A_war + A_sad",
      "Ev = dikdörtgen + üçgen → A = A_dik + A_üçgen",
      "کور = مستطیل + مثلث → A = A_مست + A_مث"
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
          "Rectangle 6 × 4 cm + triangle base 6, hauteur 3 cm :",
          "A_rect = 6 × 4 = 24 cm²",
          "A_tri = (6 × 3) ÷ 2 = 9 cm²",
          "A_totale = 24 + 9 = **33 cm²**",
        ],
        [
          "Rectangle 6 × 4 cm + triangle base 6, height 3 cm:",
          "A_rect = 6 × 4 = 24 cm²",
          "A_tri = (6 × 3) ÷ 2 = 9 cm²",
          "A_total = 24 + 9 = **33 cm²**",
        ],
        [
          "مستطيل 6 × 4 سم + مثلث قاعدة 6، ارتفاع 3 سم:",
          "A_مست = 6 × 4 = 24 سم²",
          "A_مث = (6 × 3) ÷ 2 = 9 سم²",
          "A_الكلية = 24 + 9 = **33 سم²**",
        ],
        [
          "مستطیل 6 × 4 سانتیمتر + مثلث قاعده 6، ارتفاع 3 سانتیمتر:",
          "A_مست = 6 × 4 = 24 سانتیمتر²",
          "A_مث = (6 × 3) ÷ 2 = 9 سانتیمتر²",
          "A_کل = 24 + 9 = **33 سانتیمتر²**",
        ],
        [
          "ካሬ-ሓለቃ 6 × 4 ሰም + ሰለስ-ጎቦ ሰረት 6, ቁመት 3 ሰም:",
          "A_ካሬ = 6 × 4 = 24 ሰም²",
          "A_ሰለስ = (6 × 3) ÷ 2 = 9 ሰም²",
          "A_ጠቕላሊ = 24 + 9 = **33 ሰም²**",
        ],
        [
          "Прямокутник 6 × 4 см + трикутник основа 6, висота 3 см:",
          "A_прям = 6 × 4 = 24 см²",
          "A_трик = (6 × 3) ÷ 2 = 9 см²",
          "A_загальна = 24 + 9 = **33 см²**",
        ],
        [
          "Retângulo 6 × 4 cm + triângulo base 6, altura 3 cm:",
          "A_ret = 6 × 4 = 24 cm²",
          "A_tri = (6 × 3) ÷ 2 = 9 cm²",
          "A_total = 24 + 9 = **33 cm²**",
        ],
        [
          "Wareegsanaanta 6 × 4 cm + saddex-xagal saldhig 6, dherer 3 cm:",
          "A_war = 6 × 4 = 24 cm²",
          "A_sad = (6 × 3) ÷ 2 = 9 cm²",
          "A_guud = 24 + 9 = **33 cm²**",
        ],
        [
          "Dikdörtgen 6 × 4 cm + üçgen taban 6, yükseklik 3 cm:",
          "A_dik = 6 × 4 = 24 cm²",
          "A_üçgen = (6 × 3) ÷ 2 = 9 cm²",
          "A_toplam = 24 + 9 = **33 cm²**",
        ],
        [
          "مستطیل 6 × 4 سم + مثلث قاعده 6، لوړوالی 3 سم:",
          "A_مست = 6 × 4 = 24 سم²",
          "A_مث = (6 × 3) ÷ 2 = 9 سم²",
          "A_ټول = 24 + 9 = **33 سم²**",
        ]
      )
    },
  ],
  paragraphs: {
    fr: [
      "Une figure composée est formée de plusieurs figures simples.",
      "On calcule son aire en additionnant les aires des parties.",
      "Méthode : identifier les figures simples, calculer chaque aire, puis additionner.",
    ],
    en: [
      "A composite figure is made of several simple shapes.",
      "Its area is calculated by adding the areas of the parts.",
      "Method: identify the simple shapes, calculate each area, then add.",
    ],
    ar: [
      "الشكل المركب يتكون من عدة أشكال بسيطة.",
      "نحسب مساحته بجمع مساحات الأجزاء.",
      "الطريقة: حدد الأشكال البسيطة، احسب كل مساحة، ثم اجمع.",
    ],
    fa: [
      "شکل ترکیبی از چند شکل ساده ساخته شده است.",
      "مساحت آن با جمع مساحت بخش‌ها محاسبه می‌شود.",
      "روش: شکل‌های ساده را مشخص کن، مساحت هر کدام را حساب کن، سپس جمع کن.",
    ],
    ti: [
      "ዝተጣመረ ቅርጺ ካብ ብዙሓት ቀለልቲ ቅርጽታት ይህነጽ።",
      "ስፍሓቱ ስፍሓት ክፋላቱ ብምድማር ይሕሰብ።",
      "ሜላ፦ ቀለልቲ ቅርጽታት ፍለጥ፣ ነፍሲ ወከፍ ስፍሓት ሕሰብ፣ ድሕሪኡ ደምር።",
    ],
    uk: [
      "Складена фігура утворена кількома простими фігурами.",
      "Її площу обчислюють додаванням площ частин.",
      "Метод: визначити прості фігури, обчислити кожну площу, потім додати.",
    ],
    pt: [
      "Uma figura composta é formada por várias figuras simples.",
      "A sua área calcula-se somando as áreas das partes.",
      "Método: identificar as figuras simples, calcular cada área e depois somar.",
    ],
    so: [
      "Qaab isku-dhafan wuxuu ka samaysan yahay qaabab fudud oo dhowr ah.",
      "Bedkiisa waxaa lagu xisaabiyaa iyadoo la isku daro bedadka qaybaha.",
      "Habka: aqoonso qaababka fudud, xisaabi bed kasta, ka dib isku dar.",
    ],
    tr: [
      "Bileşik şekil birkaç basit şekilden oluşur.",
      "Alanı, parçaların alanları toplanarak hesaplanır.",
      "Yöntem: basit şekilleri belirle, her alanı hesapla, sonra topla.",
    ],
    ps: [
      "مرکب شکل له څو ساده شکلونو جوړ وي.",
      "مساحت يې د برخو د مساحتونو په جمع کولو حسابېږي.",
      "طريقه: ساده شکلونه وپېژنئ، د هر يوه مساحت حساب کړئ، بيا يې جمع کړئ.",
    ],
  },
  consignes: {
    "g3-8-e1": { fr: "Figure : rectangle 6×4 cm + triangle base 6 cm hauteur 3 cm. Aire totale = ?", en: "Figure: rectangle 6×4 cm + triangle with base 6 cm and height 3 cm. Total area = ?",
      ar: "شكل: مستطيل 6×4 سم + مثلث قاعدته 6 سم وارتفاعه 3 سم. المساحة الكلية = ؟",
      fa: "شکل: مستطیل ۶×۴ سانتی‌متر + مثلث با قاعده ۶ سانتی‌متر و ارتفاع ۳ سانتی‌متر. مساحت کل = ؟",
      pt: "Figura: rectângulo 6×4 cm + triângulo com base 6 cm e altura 3 cm. Área total = ?",
      so: "Xaaladda: lix-jibaaro 6×4 cm + sadex-xagal leh saldhig 6 cm iyo dherer 3 cm. Aagga guud = ?",
      ti: "ቅርጺ: 6×4 ሰ.ሜ ሕቡሳ + 6 ሰ.ሜ ሰፊሕ ሸነኽን 3 ሰ.ሜ ቁመትን ዘለዎ ሰሌስቲ። ጠቕላላ ስፍሓት = ?",
      tr: "Şekil: 6×4 cm dikdörtgen + taban 6 cm ve yükseklik 3 cm üçgen. Toplam alan = ?",
      ps: "شکل: د 6×4 سم مستطیل + د 6 سم اساس او 3 سم لوړوالي مثلث. ټوله مساحت = ؟",
      uk: "Фігура: прямокутник 6×4 см + трикутник з основою 6 см і висотою 3 см. Загальна площа = ?" },
    "g3-8-e2": { fr: "Demi-disque de rayon 5 cm (π ≈ 3,14). Aire = ?", en: "Half-disk with radius 5 cm (π ≈ 3.14). Area = ?",
      ar: "نصف قرص نصف قطره 5 سم (π ≈ 3,14). المساحة = ؟",
      fa: "نیم‌دیسکی با شعاع ۵ سانتی‌متر (π ≈ 3,14). مساحت = ؟",
      pt: "Meio disco com raio 5 cm (π ≈ 3,14). Área = ?",
      so: "Badh saxan leh raad 5 cm (π ≈ 3,14). Aagga = ?",
      ti: "5 ሰ.ሜ ራዲዩስ ዘለዎ ፍርቂ ዲስኮ (π ≈ 3,14)። ስፍሓት = ?",
      tr: "Yarıçapı 5 cm olan yarı disk (π ≈ 3,14). Alan = ?",
      ps: "د 5 سم شعاع لرونکی نیم ډیسک (π ≈ 3,14). مساحت = ؟",
      uk: "Напівкруг з радіусом 5 см (π ≈ 3,14). Площа = ?" },
    "g3-8-e3": { fr: "Carré 8×8 cm + demi-cercle de diamètre 8 cm (π ≈ 3,14). Aire totale ≈ ?", en: "Square 8×8 cm + semicircle with diameter 8 cm (π ≈ 3.14). Total area ≈ ?",
      ar: "مربع 8×8 سم + نصف دائرة قطرها 8 سم (π ≈ 3,14). المساحة الكلية ≈ ؟",
      fa: "مربع ۸×۸ سانتی‌متر + نیم‌دایره با قطر ۸ سانتی‌متر (π ≈ 3,14). مساحت کل ≈ ؟",
      pt: "Quadrado 8×8 cm + semicírculo com diâmetro 8 cm (π ≈ 3,14). Área total ≈ ?",
      so: "Afar-jibaaro 8×8 cm + badh-goobo leh qalabka 8 cm (π ≈ 3,14). Aagga guud ≈ ?",
      ti: "8×8 ሰ.ሜ ጎዳጉዲ + 8 ሰ.ሜ ዲያሜትር ዘለዎ ፍርቂ ዙሪያ (π ≈ 3,14)። ጠቕላላ ስፍሓት ≈ ?",
      tr: "8×8 cm kare + çapı 8 cm yarı çember (π ≈ 3,14). Toplam alan ≈ ?",
      ps: "د 8×8 سم مربع + د 8 سم قطر نیم دایره (π ≈ 3,14). ټوله مساحت ≈ ؟",
      uk: "Квадрат 8×8 см + напівкруг із діаметром 8 см (π ≈ 3,14). Загальна площа ≈ ?" },
    "g3-8-e4": { fr: "Deux rectangles 5×3 cm et 4×2 cm côte à côte. Aire totale = ?", en: "Two rectangles 5×3 cm and 4×2 cm side by side. Total area = ?",
      ar: "مستطيلان 5×3 سم و 4×2 سم جنبًا إلى جنب. المساحة الكلية = ؟",
      fa: "دو مستطیل ۵×۳ سانتی‌متر و ۴×۲ سانتی‌متر در کنار هم. مساحت کل = ؟",
      pt: "Dois rectângulos 5×3 cm e 4×2 cm lado a lado. Área total = ?",
      so: "Laba lix-jibaaro 5×3 cm iyo 4×2 cm oo dhinac ka dhinac ah. Aagga guud = ?",
      ti: "5×3 ሰ.ሜን 4×2 ሰ.ሜን ክልተ ሕቡሳ ሸነኽ ብሸነኽ። ጠቕላላ ስፍሓት = ?",
      tr: "5×3 cm ve 4×2 cm yan yana iki dikdörtgen. Toplam alan = ?",
      ps: "د 5×3 سم او 4×2 سم دوه مستطیل سره یو ځای. ټوله مساحت = ؟",
      uk: "Два прямокутники 5×3 см і 4×2 см поруч. Загальна площа = ?" },
    "g3-8-e5": { fr: "Rectangle 10×6 cm avec triangle intérieur de base 10 et hauteur 4 coupé. Aire restante = ?", en: "Rectangle 10×6 cm with an inner triangle of base 10 and height 4 removed. Remaining area = ?",
      ar: "مستطيل 10×6 سم مع مثلث داخلي قاعدته 10 وارتفاعه 4 محذوف. المساحة المتبقية = ؟",
      fa: "مستطیل ۱۰×۶ سانتی‌متر با یک مثلث داخلی با قاعده ۱۰ و ارتفاع ۴ برداشته‌شده. مساحت باقیمانده = ؟",
      pt: "Rectângulo 10×6 cm com triângulo interior de base 10 e altura 4 removido. Área restante = ?",
      so: "Lix-jibaaro 10×6 cm oo leh sadex-xagal gudaha ah oo leh saldhig 10 iyo dherer 4 oo la saaray. Aagga hadhay = ?",
      ti: "10×6 ሰ.ሜ ሕቡሳ 10 ሰፊሕ ሸነኽን 4 ቁመትን ዘለዎ ውሽጠ ሰሌስቲ ተቐሪጹ። ዝተረፈ ስፍሓት = ?",
      tr: "10×6 cm dikdörtgen, taban 10 ve yükseklik 4 olan iç üçgen çıkarılmış. Kalan alan = ?",
      ps: "د 10×6 سم مستطیل چې د 10 اساس او 4 لوړوالي داخلي مثلث یې لرې شوی. پاتې مساحت = ؟",
      uk: "Прямокутник 10×6 см із вирізаним внутрішнім трикутником з основою 10 і висотою 4. Площа, що залишилася = ?" },
  },
};
