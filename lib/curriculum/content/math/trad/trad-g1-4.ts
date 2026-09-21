import type { SubmoduleTrad } from "./trad-types";

export const TRAD_G1_4: SubmoduleTrad = {
  submoduleId: "G1-4",
  title: {
    fr: "Angles",
    en: "Angles",
    ar: "الزوايا",
    fa: "زاویه‌ها",
    ti: "ኩርናዓት",
    uk: "Кути",
  },
  blocks: [
    // 0 — heading "Qu'est-ce qu'un angle ?" (black)
    { text: { fr: "Qu'est-ce qu'un angle ?", en: "What is an angle?", ar: "ما هي الزاوية؟", fa: "زاویه چیست؟", ti: "ኩርናዕ እንታይ ዩ?", uk: "Що таке кут?", pt: "O que é um ângulo?", so: "Xagalku waa maxay?", tr: "Açı nedir?", ps: "زاویه څه ده؟" } },

    // 1 — plain
    { text: { fr: "Un **angle** est formé par deux **demi-droites** issues d'un même point appelé **sommet**. On le mesure en **degrés (°)**.", en: "An **angle** is formed by two **rays** from the same point called the **vertex**. It is measured in **degrees (°)**.", ar: "**الزاوية** تتشكل من **شعاعين** من نفس النقطة تسمى **الرأس**. تُقاس بـ**الدرجات (°)**.", fa: "**زاویه** از دو **نیم‌خط** که از یک نقطه مشترک به نام **رأس** خارج می‌شوند تشکیل می‌شود. به **درجه (°)** اندازه‌گیری می‌شود.", ti: "**ኩርናዕ** ካብ ሓደ ሓባራዊ ርእሲ ዝወጹ ክልተ **ፍርቂ-ሕርሚ** ዝቖሞ ዩ። ብ**ዲግሪ (°)** ዝሕሰብ ዩ።", uk: "**Кут** утворюється двома **півпрямими**, що виходять з однієї точки — **вершини**. Вимірюється в **градусах (°)**.", pt: "Um **ângulo** é formado por dois **semirretos** a partir do mesmo ponto chamado **vértice**. É medido em **graus (°)**.", so: "**Xagalka** waxaa sameeya laba **xariiqo** ka soo baxa hal dhibic loo yeedho **madaxa**. Waxaa lagu cabbiraa **daraajooyin (°)**.", tr: "Bir **açı**, aynı noktadan (**köşe noktasından**) çıkan iki **yarım doğru** tarafından oluşturulur. **Derece (°)** cinsinden ölçülür.", ps: "**زاویه** له دوو **نیمه-خطونو** جوړیږي چې له یوه مشترک نقطه (**رأس**) راووځي. د **درجو (°)** سره اندازه کیږي." } },

    // 2 — rule "Repères"
    { label: { fr: "Repères", en: "Reference points", ar: "نقاط مرجعية", fa: "نقاط مرجع", ti: "ናይ ምርኩስ ነጥብታት", uk: "Орієнтири", pt: "Referências", so: "Tilmaamayaasha", tr: "Referans noktaları", ps: "د مراجعې ټکي" },
      items: { fr: ["Tour complet = 360°", "Demi-tour = 180°", "Quart de tour = 90°"], en: ["Full turn = 360°", "Half turn = 180°", "Quarter turn = 90°"], ar: ["دورة كاملة = 360°", "نصف دورة = 180°", "ربع دورة = 90°"], fa: ["یک دور کامل = 360°", "نیم دور = 180°", "یک چهارم دور = 90°"], ti: ["ምሉእ ዙር = 360°", "ፍርቂ ዙር = 180°", "ርብዒ ዙር = 90°"], uk: ["Повний оберт = 360°", "Пів-оберту = 180°", "Чверть оберту = 90°"], pt: ["Volta completa = 360°", "Meia volta = 180°", "Quarto de volta = 90°"], so: ["Wareejin buuxa = 360°", "Wareejin bar = 180°", "Ruub wareejin = 90°"], tr: ["Tam tur = 360°", "Yarım tur = 180°", "Çeyrek tur = 90°"], ps: ["بشپړ چکر = 360°", "نیم چکر = 180°", "ربع چکر = 90°"] } },

    // 3 — heading "Types d'angles" (black)
    { text: { fr: "Types d'angles", en: "Types of angles", ar: "أنواع الزوايا", fa: "انواع زوایا", ti: "ዓይነታት ኩርናዓት", uk: "Типи кутів", pt: "Tipos de ângulos", so: "Noocyada xagalka", tr: "Açı türleri", ps: "د زاویو ډولونه" } },

    // 4 — table ["Type","Mesure"] with 6 rows
    { headers: { fr: ["Type", "Mesure"], en: ["Type", "Measure"], ar: ["النوع", "القياس"], fa: ["نوع", "اندازه"], ti: ["ዓይነት", "ሓሳብ"], uk: ["Тип", "Міра"], pt: ["Tipo", "Medida"], so: ["Nooca", "Cabirka"], tr: ["Tür", "Ölçü"], ps: ["ډول", "اندازه"] },
      items: { fr: ["Nul|0°", "Aigu|0° < α < 90°", "Droit|α = 90°", "Obtus|90° < α < 180°", "Plat|α = 180°", "Rentrant|180° < α < 360°"], en: ["Zero|0°", "Acute|0° < α < 90°", "Right|α = 90°", "Obtuse|90° < α < 180°", "Straight|α = 180°", "Reflex|180° < α < 360°"], ar: ["منعدمة|0°", "حادة|0° < α < 90°", "قائمة|α = 90°", "منفرجة|90° < α < 180°", "مستقيمة|α = 180°", "منعكسة|180° < α < 360°"], fa: ["صفر|0°", "تند|0° < α < 90°", "قائمه|α = 90°", "منفرجه|90° < α < 180°", "صاف|α = 180°", "بازگشتی|180° < α < 360°"], ti: ["ዜሮ|0°", "ሑጹር|0° < α < 90°", "ቅኑዕ|α = 90°", "ርሕቅ|90° < α < 180°", "ሰፊሕ|α = 180°", "ዝምለስ|180° < α < 360°"], uk: ["Нульовий|0°", "Гострий|0° < α < 90°", "Прямий|α = 90°", "Тупий|90° < α < 180°", "Розгорнутий|α = 180°", "Рефлексний|180° < α < 360°"], pt: ["Nulo|0°", "Agudo|0° < α < 90°", "Recto|α = 90°", "Obtuso|90° < α < 180°", "Raso|α = 180°", "Refleto|180° < α < 360°"], so: ["Eber|0°", "Xidid|0° < α < 90°", "Toosan|α = 90°", "Ballaaran|90° < α < 180°", "Khad|α = 180°", "Celcelis|180° < α < 360°"], tr: ["Sıfır|0°", "Dar|0° < α < 90°", "Dik|α = 90°", "Geniş|90° < α < 180°", "Düz|α = 180°", "İç|180° < α < 360°"], ps: ["صفر|0°", "تیز|0° < α < 90°", "سم|α = 90°", "کنده|90° < α < 180°", "مستقیم|α = 180°", "منعکس|180° < α < 360°"] } },

    // 5 — svg_row [Aigu, Droit, Obtus, Plat]
    { items: { fr: ["Aigu (< 90°)", "Droit (= 90°)", "Obtus (> 90°)", "Plat (= 180°)"], en: ["Acute (< 90°)", "Right (= 90°)", "Obtuse (> 90°)", "Straight (= 180°)"], ar: ["حاد (< 90°)", "قائم (= 90°)", "منفرج (> 90°)", "مستقيم (= 180°)"], fa: ["تند (< 90°)", "قائمه (= 90°)", "منفرجه (> 90°)", "صاف (= 180°)"], ti: ["ሑጹር (< 90°)", "ቅኑዕ (= 90°)", "ርሕቅ (> 90°)", "ሰፊሕ (= 180°)"], uk: ["Гострий (< 90°)", "Прямий (= 90°)", "Тупий (> 90°)", "Розгорнутий (= 180°)"], pt: ["Agudo (< 90°)", "Recto (= 90°)", "Obtuso (> 90°)", "Raso (= 180°)"], so: ["Xidid (< 90°)", "Toosan (= 90°)", "Ballaaran (> 90°)", "Khad (= 180°)"], tr: ["Dar (< 90°)", "Dik (= 90°)", "Geniş (> 90°)", "Düz (= 180°)"], ps: ["تیز (< 90°)", "سم (= 90°)", "کنده (> 90°)", "مستقیم (= 180°)"] } },

    // 6 — heading "Angles remarquables" (black)
    { text: { fr: "Angles remarquables", en: "Notable angles", ar: "الزوايا المهمة", fa: "زوایای برجسته", ti: "ዝፍለጡ ኩርናዓት", uk: "Визначні кути", pt: "Ângulos notáveis", so: "Xagalka muhiimka ah", tr: "Önemli açılar", ps: "د پاملرنې وړ زاویې" } },

    // 7 — highlight "Angles complémentaires"
    { text: { fr: "Angles complémentaires", en: "Complementary angles", ar: "الزوايا المتكاملة", fa: "زوایای مکمل", ti: "ዝምላሉ ኩርናዓት", uk: "Доповняльні кути", pt: "Ângulos complementares", so: "Xagalada buuxiya", tr: "Tamamlayıcı açılar", ps: "د بشپړتیا زاویې" } },

    // 8 — section "" ["Deux angles sont **complémentaires**...", "Exemple : 35° et 55°..."]
    { label: { fr: "", en: "", ar: "", fa: "", ti: "", uk: "", pt: "", so: "", tr: "", ps: "" },
      items: { fr: ["Deux angles sont **complémentaires** si leur somme vaut **90°**.", "Exemple : 35° et 55° sont complémentaires (35 + 55 = 90)."], en: ["Two angles are **complementary** if their sum is **90°**.", "Example: 35° and 55° are complementary (35 + 55 = 90)."], ar: ["زاويتان **متكاملتان** إذا كان مجموعهما **90°**.", "مثال: 35° و 55° متكاملتان (35 + 55 = 90)."], fa: ["دو زاویه **مکمل** هستند اگر مجموعشان **90°** باشد.", "مثال: 35° و 55° مکمل هستند (35 + 55 = 90)."], ti: ["ክልተ ኩርናዓት ድምሮም **90°** ምስ ዝኸውን **ዝምላሉ** ዩ።", "ምሳሌ: 35° ምስ 55° ዝምላሉ ዩ (35 + 55 = 90)."], uk: ["Два кути є **доповняльними**, якщо їхня сума дорівнює **90°**.", "Приклад: 35° і 55° — доповняльні (35 + 55 = 90)."], pt: ["Dois ângulos são **complementares** se a sua soma for **90°**.", "Exemplo: 35° e 55° são complementares (35 + 55 = 90)."], so: ["Laba xagal waa **buuxiya** haddii iskudhufkoodu yahay **90°**.", "Tusaale: 35° iyo 55° waa buuxiya (35 + 55 = 90)."], tr: ["İki açı, toplamları **90°** olduğunda **tamamlayıcıdır**.", "Örnek: 35° ve 55° tamamlayıcıdır (35 + 55 = 90)."], ps: ["دوه زاویې **بشپړوونکې** دي که چیرې د دوی مجموع **90°** وي.", "بیلګه: 35° او 55° بشپړوونکې دي (35 + 55 = 90)."] } },

    // 9 — highlight "Angles supplémentaires"
    { text: { fr: "Angles supplémentaires", en: "Supplementary angles", ar: "الزوايا المتتامة", fa: "زوایای مکمل‌کننده", ti: "ዝምላሉ ኩርናዓት ዝዓቢ", uk: "Суміжні кути", pt: "Ângulos suplementares", so: "Xagalada xigta", tr: "Tümler açılar", ps: "د ضمیمې زاویې" } },

    // 10 — section "" ["Deux angles sont **supplémentaires**...", "Exemple : 110° et 70°..."]
    { label: { fr: "", en: "", ar: "", fa: "", ti: "", uk: "", pt: "", so: "", tr: "", ps: "" },
      items: { fr: ["Deux angles sont **supplémentaires** si leur somme vaut **180°**.", "Exemple : 110° et 70° sont supplémentaires (110 + 70 = 180)."], en: ["Two angles are **supplementary** if their sum is **180°**.", "Example: 110° and 70° are supplementary (110 + 70 = 180)."], ar: ["زاويتان **متتامتان** إذا كان مجموعهما **180°**.", "مثال: 110° و 70° متتامتان (110 + 70 = 180)."], fa: ["دو زاویه **مکمل‌کننده** هستند اگر مجموعشان **180°** باشد.", "مثال: 110° و 70° مکمل‌کننده هستند (110 + 70 = 180)."], ti: ["ክልተ ኩርናዓት ድምሮም **180°** ምስ ዝኸውን **ዝምላሉ** ዩ።", "ምሳሌ: 110° ምስ 70° ዝምላሉ ዩ (110 + 70 = 180)."], uk: ["Два кути є **суміжними**, якщо їхня сума дорівнює **180°**.", "Приклад: 110° і 70° — суміжні (110 + 70 = 180)."], pt: ["Dois ângulos são **suplementares** se a sua soma for **180°**.", "Exemplo: 110° e 70° são suplementares (110 + 70 = 180)."], so: ["Laba xagal waa **xiga** haddii iskudhufkoodu yahay **180°**.", "Tusaale: 110° iyo 70° waa xiga (110 + 70 = 180)."], tr: ["İki açı, toplamları **180°** olduğunda **tümlerdir**.", "Örnek: 110° ve 70° tümlerdir (110 + 70 = 180)."], ps: ["دوه زاویې **ضمیمه** دي که چیرې د دوی مجموع **180°** وي.", "بیلګه: 110° او 70° ضمیمه دي (110 + 70 = 180)."] } },

    // 11 — highlight "Angles opposés par le sommet"
    { text: { fr: "Angles opposés par le sommet", en: "Vertically opposite angles", ar: "الزوايا المتقابلة بالرأس", fa: "زوایای مقابل‌الرأس", ti: "ብርእሲ ዝቃወሙ ኩርናዓት", uk: "Вертикальні кути", pt: "Ângulos verticalmente opostos", so: "Xagalada ka horjeeda madaxa", tr: "Tepeden karşı açılar", ps: "د سرچینې مقابلې زاویې" } },

    // 12 — section "" ["Quand deux droites se croisent..."]
    { label: { fr: "", en: "", ar: "", fa: "", ti: "", uk: "", pt: "", so: "", tr: "", ps: "" },
      items: { fr: ["Quand deux droites se croisent, les angles **opposés par le sommet** sont **égaux**."], en: ["When two lines intersect, the **vertically opposite angles** are **equal**."], ar: ["عندما تتقاطع مستقيمان، الزوايا **المتقابلة بالرأس** تكون **متساوية**."], fa: ["وقتی دو خط یکدیگر را قطع می‌کنند، زوایای **مقابل‌الرأس** **برابر** هستند."], ti: ["ክልተ ሕርምታት ምስ ዝቋረጹ፣ ብርእሲ ዝቃወሙ ኩርናዓት **ማዕረ** ዩ።"], uk: ["Коли дві прямі перетинаються, **вертикальні кути** є **рівними**."], pt: ["Quando duas retas se cruzam, os ângulos **verticalmente opostos** são **iguais**."], so: ["Markay laba xariiq is gudbaan, xagalada **ka horjeeda madaxa** waa **siman yihiin**."], tr: ["İki doğru kesiştiğinde, **tepeden karşı açılar** **eşittir**."], ps: ["کله چې دوه کرښې یو بل سره قطع کوي، د سرچینې **مقابلې زاویې** **مساوي** دي."] } },
  ],
  paragraphs: {
    fr: [
      "Un angle est formé par deux demi-droites de même origine (le sommet). On le mesure en degrés (°). Plein tour = 360°.",
      "Types d'angles : aigu (0° < α < 90°) ; droit (90°) ; obtus (90° < α < 180°) ; plat (180°).",
      "Angles complémentaires : somme = 90°. Angles supplémentaires : somme = 180°.",
      "Angles opposés par le sommet : quand deux droites se croisent, les angles opposés sont égaux.",
    ],
    en: [
      "An angle is formed by two rays from the same point (vertex). Measured in degrees. Full turn = 360°.",
      "Types: acute (0° < α < 90°); right (90°); obtuse (90° < α < 180°); straight (180°).",
      "Complementary: sum = 90°. Supplementary: sum = 180°.",
      "Vertical angles: when two lines cross, opposite angles are equal.",
    ],
    ar: [
      "الزاوية تتشكل من شعاعين من نفس الرأس. تُقاس بالدرجات. الدورة الكاملة = 360°.",
      "أنواع: حاد، قائم (90°)، منفرج، مستقيم (180°).",
      "متكاملتان: مجموعهما 90°. متتامتان: مجموعهما 180°.",
      "الزوايا المتقابلة بالرأس متساوية.",
    ],
    fa: [
      "زاویه از دو نیم‌خط با رأس مشترک تشکیل می‌شود. به درجه سنجیده می‌شود.",
      "انواع: تند (< 90°)، قائمه (90°)، کند (> 90°)، مستقیم (180°).",
      "مکمل: مجموع = 90°. مکمل‌کننده: مجموع = 180°.",
      "زاویه‌های مقابل‌الرأس برابرند.",
    ],
    ti: [
      "ኩርናዕ ካብ ሓደ ርእሲ ዝወጹ ክልተ ፍርቂ-ሕርሚ ዩ. ብዲግሪ ዝሕሰብ.",
      "ዓይነታት: ሙጹዕ (< 90°), ቀጥታ (90°), ሰፊሕ (> 90°), ቀጥታ ሕርሚ (180°).",
      "ምምላእ: ድምር = 90°. ምምላእ: ድምር = 180°.",
      "ናይ ርእሲ ዝቃወሙ ኩርናዓት ማዕረ ዩ.",
    ],
    uk: [
      "Кут утворюється двома півпрямими з однієї вершини. Вимірюється в градусах.",
      "Типи: гострий (< 90°), прямий (90°), тупий (> 90°), розгорнутий (180°).",
      "Доповняльні: сума = 90°. Суміжні: сума = 180°.",
      "Вертикальні кути рівні.",
    ],
  },
  consignes: {
    "g1-4-e1": { fr: "Un angle de 75° est-il aigu ou obtus ?", en: "Is a 75° angle acute or obtuse?",
      ar: "هل زاوية 75° حادة أم منفرجة؟",
      fa: "آیا زاویه ۷۵° حاد است یا منفرجه؟",
      pt: "Um ângulo de 75° é agudo ou obtuso?",
      so: "Ma xagasha 75° waa dhadban mise ballaaran?",
      ti: "75° ዝኾነ ኩርናዕ ሹቕ ድዩ ወይ ወርካዕ?",
      tr: "75° açı dar mı yoksa geniş mi?",
      ps: "د 75° زاویه تیزه ده که کنده؟",
      uk: "Кут 75° гострий чи тупий?" },
    "g1-4-e2": { fr: "Deux angles complémentaires : l'un est 35°. Quel est l'autre (en °) ?", en: "Two complementary angles: one is 35°. What is the other (in °)?",
      ar: "زاويتان متكاملتان: إحداهما 35°. ما الأخرى (بالدرجات)؟",
      fa: "دو زاویه مکمل: یکی ۳۵°. دیگری چند درجه است؟",
      pt: "Dois ângulos complementares: um é 35°. Qual é o outro (em °)?",
      so: "Laba xagal oo xidid ah: mid waa 35°. Kee kale waa maxay (°)?",
      ti: "ክልተ ምምላእ ኩርናዓት፡ ሓደ 35° እዩ። ናይ ካልኣይ (ብ°) ምንታይ?",
      tr: "İki tamamlayıcı açı: biri 35°. Diğeri kaç derece (°)?",
      ps: "دوه مکمل زاویې: یوه یې 35°. بله یې (درجو کې) کچه؟",
      uk: "Два доповняльні кути: один 35°. Який другий (у °)?" },
    "g1-4-e3": { fr: "Deux angles supplémentaires : l'un est 110°. Quel est l'autre (en °) ?", en: "Two supplementary angles: one is 110°. What is the other (in °)?",
      ar: "زاويتان متتامتان: إحداهما 110°. ما الأخرى (بالدرجات)؟",
      fa: "دو زاویه مکمل (متمم): یکی ۱۱۰°. دیگری چند درجه است؟",
      pt: "Dois ângulos suplementares: um é 110°. Qual é o outro (em °)?",
      so: "Laba xagal oo buuxinaya: mid waa 110°. Kee kale waa maxay (°)?",
      ti: "ክልተ ምምላእ ኩርናዓት፡ ሓደ 110° እዩ። ናይ ካልኣይ (ብ°) ምንታይ?",
      tr: "İki bütünler açı: biri 110°. Diğeri kaç derece (°)?",
      ps: "دوه تکمیل کوونکي زاویې: یوه یې 110°. بله یې (درجو کې) کچه؟",
      uk: "Два суміжні кути: один 110°. Який другий (у °)?" },
    "g1-4-e4": { fr: "Un angle droit mesure combien de degrés ?", en: "How many degrees does a right angle measure?",
      ar: "كم درجة يقيس الزاوية القائمة؟",
      fa: "زاویه قائمه چند درجه است؟",
      pt: "Quantos graus mede um ângulo reto?",
      so: "Xagasha toosan waxay qaddeysaa imisa darajo?",
      ti: "ቅድሜ ኩርናዕ ክንደይ ዲግሪ ይዕቅን?",
      tr: "Dik açı kaç derece ölçer?",
      ps: "د سمې زاویې اندازه کچه ده؟",
      uk: "Скільки градусів становить прямий кут?" },
    "g1-4-e5": { fr: "Deux droites se coupent. Un angle est 40°. L'angle opposé par le sommet mesure ?", en: "Two lines intersect. One angle is 40°. What does the vertically opposite angle measure?",
      ar: "خطان يتقاطعان. أحد الزوايا 40°. ما مقياس الزاوية المقابلة بالرأس؟",
      fa: "دو خط یکدیگر را قطع می‌کنند. یک زاویه ۴۰° است. زاویه مقابل چند درجه است؟",
      pt: "Duas retas intersectam-se. Um ângulo é 40°. Quanto mede o ângulo verticalmente oposto?",
      so: "Laba xariiq oo iskutaga. Xagasha waa 40°. Xagasha xagga ka soo horjeeda ee qodobka waxay qaddeysaa imisa?",
      ti: "ክልተ መስመር ይቋረጹ። ሓደ ኩርናዕ 40° እዩ። ተቓርኖ ኩርናዕ ክንደይ ዕቀን ኣለዎ?",
      tr: "İki doğru kesişiyor. Bir açı 40°. Zıt açı kaç derece ölçer?",
      ps: "دوه کرښې سره مخامخ وي. یوه زاویه 40° ده. مخامخ زاویه کچه ده؟",
      uk: "Дві прямі перетинаються. Один кут 40°. Скільки градусів у вертикальному куті?" },
  },
};
