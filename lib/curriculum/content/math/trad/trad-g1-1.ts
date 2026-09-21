import type { SubmoduleTrad } from "./trad-types";

export const TRAD_G1_1: SubmoduleTrad = {
  submoduleId: "G1-1",
  title: {
    fr: "Reconnaissance",
    en: "Recognition",
    ar: "الأشكال",
    fa: "اشکال",
    ti: "ቅርጻት",
    uk: "Фігури",
  },
  blocks: [
    // 0 — heading "Les polygones réguliers" (black)
    { text: { fr: "Les polygones réguliers", en: "Regular polygons", ar: "المضلعات المنتظمة", fa: "چندضلعی‌های منتظم", ti: "ዕኩል ብዙ ጎቦ", uk: "Правильні многокутники", pt: "Polígonos regulares", so: "Dabacsan wanaagsan", tr: "Düzgün çokgenler", ps: "منظم ګوني شکلونه" } },

    // 1 — plain definition of polygon
    { text: { fr: "Un **polygone** est une figure plane fermée formée de segments appelés **côtés**. Les points de jonction des côtés sont les **sommets**.", en: "A **polygon** is a closed flat figure formed by segments called **sides**. The junction points of the sides are the **vertices**.", ar: "**المضلع** شكل مستوٍ مغلق من أضلاع. نقاط التقاء الأضلاع هي **الرؤوس**.", fa: "**چندضلعی** یک شکل مسطح بسته از پاره‌خط‌هاست. نقاط تقاطع ضلع‌ها **رأس‌ها** هستند.", ti: "**ብዙ ጎቦ** ካብ ጎቦ ዝፍጠር ዝተዓሸጎ ናይ ሰፊሕ ቅርጺ ዩ። ናይ ጎቦ ናይ ምርኻብ ነጥቢታት **ርእሲ** ዩ።", uk: "**Многокутник** — замкнута плоска фігура, утворена відрізками-**сторонами**. Точки з'єднання сторін — **вершини**.", pt: "Um **polígono** é uma figura plana fechada formada por segmentos chamados **lados**. Os pontos de junção dos lados são os **vértices**.", so: "**Dabacsan** waa sawir xidhan oo leh dhinacyo. Goobaha kuwa wadajira waa **tiplada**.", tr: "Bir **çokgen**, **kenar** adı verilen parçalardan oluşan kapalı düzlemsel bir şekildir. Kenarların birleşim noktaları **köşelerdir**.", ps: "**ګوني شکل** د ليکونو (اړخونو) نه جوړ تړلی مسطحه شکل دی. د اړخونو د نښلو نقطې **رأسونه** دي." } },

    // 2 — table ["Nom","Côtés"] rows
    { headers: { fr: ["Nom", "Côtés"], en: ["Name", "Sides"], ar: ["الاسم", "الأضلاع"], fa: ["نام", "ضلع‌ها"], ti: ["ስም", "ጎቦ"], uk: ["Назва", "Сторони"], pt: ["Nome", "Lados"], so: ["Magac", "Dhinacyo"], tr: ["Ad", "Kenarlar"], ps: ["نوم", "اړخونه"] },
      items: { fr: ["Triangle | 3", "Quadrilatère | 4", "Pentagone | 5", "Hexagone | 6"], en: ["Triangle | 3", "Quadrilateral | 4", "Pentagon | 5", "Hexagon | 6"], ar: ["مثلث | 3", "رباعي | 4", "خماسي | 5", "سداسي | 6"], fa: ["مثلث | 3", "چهارضلعی | 4", "پنج‌ضلعی | 5", "شش‌ضلعی | 6"], ti: ["ትሪያንግ | 3", "ኣርባዕ ጎቦ | 4", "ሓሙሽ ጎቦ | 5", "ሹድሽ ጎቦ | 6"], uk: ["Трикутник | 3", "Чотирикутник | 4", "П'ятикутник | 5", "Шестикутник | 6"], pt: ["Triângulo | 3", "Quadrilátero | 4", "Pentágono | 5", "Hexágono | 6"], so: ["Sedexdhinac | 3", "Afardhinac | 4", "Shantadhinac | 5", "Lixdhinac | 6"], tr: ["Üçgen | 3", "Dörtgen | 4", "Beşgen | 5", "Altıgen | 6"], ps: ["مثلث | 3", "چهارضلعي | 4", "پنج ضلعي | 5", "شپږ ضلعي | 6"] } },

    // 3 — spacer
    {},

    // 4 — svg noFrame (no caption) → {}
    {},

    // 5 — spacer
    {},

    // 6 — heading "Les formes" (black)
    { text: { fr: "Les formes", en: "Shapes", ar: "الأشكال", fa: "اشکال", ti: "ቅርጻት", uk: "Фігури", pt: "Formas", so: "Qaababka", tr: "Şekiller", ps: "شکلونه" } },

    // 7 — svg_row [Triangle, Carré]
    { items: { fr: ["Triangle", "Carré"], en: ["Triangle", "Square"], ar: ["مثلث", "مربع"], fa: ["مثلث", "مربع"], ti: ["ትሪያንግ", "ካሬ"], uk: ["Трикутник", "Квадрат"], pt: ["Triângulo", "Quadrado"], so: ["Sedexdhinac", "Geesinada"], tr: ["Üçgen", "Kare"], ps: ["مثلث", "مربع"] } },

    // 8 — svg_row [Rectangle, Losange]
    { items: { fr: ["Rectangle", "Losange"], en: ["Rectangle", "Rhombus"], ar: ["مستطيل", "معين"], fa: ["مستطیل", "لوزی"], ti: ["ካሬ-ሓለቃ", "ሮምቡስ"], uk: ["Прямокутник", "Ромб"], pt: ["Retângulo", "Losango"], so: ["Mustateel", "Almaasin"], tr: ["Dikdörtgen", "Eşkenar dörtgen"], ps: ["مستطيل", "لوزي"] } },

    // 9 — svg_row [Trapèze, Parallélogramme]
    { items: { fr: ["Trapèze", "Parallélogramme"], en: ["Trapezoid", "Parallelogram"], ar: ["شبه منحرف", "متوازي أضلاع"], fa: ["ذوزنقه", "متوازی‌الاضلاع"], ti: ["ትራፔዞይድ", "ፓራሌሎግራም"], uk: ["Трапеція", "Паралелограм"], pt: ["Trapézio", "Paralelogramo"], so: ["Shirafta", "Parallelogram"], tr: ["Yamuk", "Paralelkenar"], ps: ["ذوزنقه", "متوازي الاضلاع"] } },

    // 10 — svg_row [Pentagone, Hexagone]
    { items: { fr: ["Pentagone", "Hexagone"], en: ["Pentagon", "Hexagon"], ar: ["خماسي", "سداسي"], fa: ["پنج‌ضلعی", "شش‌ضلعی"], ti: ["ሓሙሽ ጎቦ", "ሹድሽ ጎቦ"], uk: ["П'ятикутник", "Шестикутник"], pt: ["Pentágono", "Hexágono"], so: ["Shantadhinac", "Lixdhinac"], tr: ["Beşgen", "Altıgen"], ps: ["پنج ضلعي", "شپږ ضلعي"] } },

    // 11 — spacer
    {},

    // 12 — heading "Le cercle" (black)
    { text: { fr: "Le cercle", en: "The circle", ar: "الدائرة", fa: "دایره", ti: "ዓውዲ", uk: "Коло", pt: "O círculo", so: "Goobaabka", tr: "Daire", ps: "دايره" } },

    // 13 — plain "Un **cercle** est l'ensemble..."
    { text: { fr: "Un **cercle** est l'ensemble de tous les points situés à la même distance d'un point fixe appelé **centre** (O).", en: "A **circle** is the set of all points at the same distance from a fixed point called the **centre** (O).", ar: "**الدائرة** مجموعة نقاط على نفس المسافة من نقطة ثابتة تُسمى **المركز** (O).", fa: "**دایره** مجموعه‌ای از نقاط است که به یک فاصله از نقطه ثابتی به نام **مرکز** (O) قرار دارند.", ti: "**ዓውዲ** ካብ ናይ ቀጥዒ ነጥቢ ዝብሃሃ **ማዕከን** (O) ዕኩል ርሕቀት ዘለዎ ናይ ነጥቢ ዝርዝር ዩ።", uk: "**Коло** — множина всіх точок, що рівновіддалені від фіксованої точки, яку називають **центром** (O).", pt: "Um **círculo** é o conjunto de todos os pontos equidistantes de um ponto fixo chamado **centro** (O).", so: "**Goobaabka** waa xidmo dhan oo ku yaal fogaan isku mid ah meel gaar ah oo loogu yeedho **xarunta** (O).", tr: "Bir **daire**, **merkez** (O) adı verilen sabit bir noktaya eşit uzaklıktaki tüm noktalar kümesidir.", ps: "**دايره** د ټولو نقطو مجموعه ده چې د یوه ثابت نقطه (مرکز O) نه مساوي فاصله لري." } },

    // 14 — svg_row [Cercle, Demi-cercle]
    { items: { fr: ["Cercle", "Demi-cercle"], en: ["Circle", "Semicircle"], ar: ["دائرة", "نصف دائرة"], fa: ["دایره", "نیم‌دایره"], ti: ["ዓውዲ", "ፍርቂ ዓውዲ"], uk: ["Коло", "Півколо"], pt: ["Círculo", "Semicírculo"], so: ["Goobaabka", "Bar-goobaabka"], tr: ["Daire", "Yarım daire"], ps: ["دايره", "نيمه دايره"] } },

    // 15 — spacer
    {},

    // 16 — highlight "Vocabulaire du cercle"
    { text: { fr: "Vocabulaire du cercle", en: "Circle vocabulary", ar: "مفردات الدائرة", fa: "واژگان دایره", ti: "ቃላት ዓውዲ", uk: "Словник кола", pt: "Vocabulário do círculo", so: "Erayga goobaabka", tr: "Daire sözlüğü", ps: "د دايرې اصطلاحات" } },

    // 17 — section labelFr "" itemsFr [rayon, diamètre]
    { label: { fr: "", en: "", ar: "", fa: "", ti: "", uk: "", pt: "", so: "", tr: "", ps: "" },
      items: { fr: ["**Rayon (r)** : distance du centre à n'importe quel point du cercle.", "**Diamètre (d)** : segment passant par le centre ; d = 2 × r."], en: ["**Radius (r)**: distance from the centre to any point on the circle.", "**Diameter (d)**: segment through the centre; d = 2 × r."], ar: ["**نصف القطر (r)**: المسافة من المركز إلى أي نقطة على الدائرة.", "**القطر (d)**: قطعة مستقيمة تمر بالمركز؛ d = 2 × r."], fa: ["**شعاع (r)**: فاصله از مرکز تا هر نقطه روی دایره.", "**قطر (d)**: پاره‌خط گذرنده از مرکز؛ d = 2 × r."], ti: ["**ናይ ፍርቂ-ቁምብዛ (r)**: ካብ ማዕከን ናብ ዝኾነ ነጥቢ ናይ ዓውዲ ርሕቀት.", "**ቁምብዛ (d)**: ብማዕከን ዝሓልፍ ሰጠምቲ ; d = 2 × r."], uk: ["**Радіус (r)**: відстань від центра до будь-якої точки кола.", "**Діаметр (d)**: відрізок, що проходить через центр; d = 2 × r."], pt: ["**Raio (r)**: distância do centro a qualquer ponto do círculo.", "**Diâmetro (d)**: segmento que passa pelo centro; d = 2 × r."], so: ["**Gaabis (r)**: masaafada xarunta ilaa qodobka kasta ee goobaabka.", "**Dhexroor (d)**: cutubka maraya xarunta; d = 2 × r."], tr: ["**Yarıçap (r)**: merkezden dairenin herhangi bir noktasına olan uzaklık.", "**Çap (d)**: merkezden geçen doğru parçası; d = 2 × r."], ps: ["**شعاع (r)**: د مرکز نه د دايرې د هر نقطه فاصله.", "**قطر (d)**: د مرکز نه تیریدونکی خط; d = 2 × r."] } },

    // 18 — svg (no caption) → {}
    {},
  ],
  paragraphs: {
    fr: [
      "Un polygone est une figure plane fermée formée de segments appelés côtés. Les points de jonction sont les sommets.",
      "Noms selon le nombre de côtés : triangle (3), quadrilatère (4), pentagone (5), hexagone (6).",
      "Un polygone est régulier si tous ses côtés sont égaux et tous ses angles sont égaux.",
      "Un cercle est l'ensemble des points à égale distance du centre. Rayon r, diamètre d = 2r, corde = segment entre deux points du cercle.",
    ],
    en: [
      "A polygon is a closed flat figure made of segments called sides.",
      "Names by number of sides: triangle (3), quadrilateral (4), pentagon (5), hexagon (6).",
      "A regular polygon has all equal sides and angles.",
      "A circle is the set of points equidistant from the center. Radius r, diameter d = 2r, chord = segment between two circle points.",
    ],
    ar: [
      "المضلع شكل مستوٍ مغلق من أضلاع وزوايا.",
      "الأسماء حسب عدد الأضلاع: مثلث (3)، رباعي (4)، خماسي (5)، سداسي (6).",
      "المضلع المنتظم: أضلاع وزوايا متساوية.",
      "الدائرة: مجموعة نقاط متساوية البعد عن المركز. نصف القطر r، القطر d = 2r.",
    ],
    fa: [
      "چندضلعی یک شکل مسطح بسته از پاره‌خط‌هاست.",
      "نام‌ها بر حسب تعداد اضلاع: مثلث (3)، چهارضلعی (4)، پنج‌ضلعی (5)، شش‌ضلعی (6).",
      "چندضلعی منتظم: همه اضلاع و زوایا برابر.",
      "دایره: مجموعه نقاط هم‌فاصله از مرکز. شعاع r، قطر d = 2r.",
    ],
    ti: [
      "ብዙ ጎቦ ቅርጺ ዝሕጸረ ናይ ሰፊሕ ቅርጺ ዩ.",
      "ብዙ ጎቦ: ሰለስቲ (3), ኣርባዕ (4), ሓሙሽቲ (5), ሹድሽቲ (6).",
      "ዕኩል ብዙ ጎቦ: ኩሎም ጎቦ ን ኩርናዓት ማዕረ.",
      "ዓውዲ: ካብ ማዕከን ዕኩል ርሕቀት ዘለዎ ነጥቢ. ናይ ፍርቂ-ቁምብዛ r, ቁምብዛ d = 2r.",
    ],
    uk: [
      "Многокутник — замкнута плоска фігура, утворена відрізками.",
      "Назви: трикутник (3), чотирикутник (4), п'ятикутник (5), шестикутник (6).",
      "Правильний многокутник: всі сторони й кути рівні.",
      "Коло: множина точок, однаково віддалених від центра. Радіус r, діаметр d = 2r.",
    ],
  },
  consignes: {
    "g1-1-e1": { fr: "Comment s'appelle un polygone à 5 côtés ?", en: "What is a polygon with 5 sides called?",
      ar: "ما اسم المضلع الذي له 5 أضلاع؟",
      fa: "چندضلعی با 5 ضلع چه نام دارد؟",
      pt: "Como se chama um polígono com 5 lados?",
      so: "Magaca saxanka leh 5 dhinac?",
      ti: "ናይ 5 ሸነኻት ዘለዎ ፖሊጎን ስሙ ምንታይ እዩ?",
      tr: "5 kenarlı çokgenin adı nedir?",
      ps: "د 5 اړخونو لرونکي شکل نوم به؟",
      uk: "Як називається багатокутник із 5 сторонами?" },
    "g1-1-e2": { fr: "Un cercle a un rayon de 7 cm. Quel est son diamètre (en cm) ?", en: "A circle has a radius of 7 cm. What is its diameter (in cm)?",
      ar: "دائرة نصف قطرها 7 سم. ما قطرها (بالسم)؟",
      fa: "دایره‌ای با شعاع ۷ سانتی‌متر. قطرش چند سانتی‌متر است؟",
      pt: "Um círculo tem um raio de 7 cm. Qual é o seu diâmetro (em cm)?",
      so: "Goobo leh raad 7 cm. Waa maxay qalabkeeda (cm)?",
      ti: "ዙሪያ ናይ 7 ሰ.ሜ ራዲዩስ ዘለዎ። ዲያሜትሩ (ብሰ.ሜ) ክንደይ እዩ?",
      tr: "Bir çemberin yarıçapı 7 cm. Çapı kaç cm?",
      ps: "یو دایره د 7 سم شعاع لري. د هغې قطر (سم کې) کچه؟",
      uk: "Коло має радіус 7 см. Який його діаметр (у см)?" },
    "g1-1-e3": { fr: "Un hexagone a combien de côtés ?", en: "How many sides does a hexagon have?",
      ar: "كم عدد أضلاع السداسي؟",
      fa: "ششضلعی چند ضلع دارد؟",
      pt: "Quantos lados tem um hexágono?",
      so: "Shaxanka lix-dhinacle wuxuu leeyahay imisa dhinac?",
      ti: "ሄክሳጎን ክንደይ ሸነኻት ኣለዎ?",
      tr: "Bir altıgenin kaç kenarı vardır?",
      ps: "یو شپږ اړخیز شکل (هکساګون) د کچه اړخونه لري؟",
      uk: "Скільки сторін має шестикутник?" },
    "g1-1-e4": { fr: "Un cercle a un diamètre de 10 cm. Quel est son rayon (en cm) ?", en: "A circle has a diameter of 10 cm. What is its radius (in cm)?",
      ar: "دائرة قطرها 10 سم. ما نصف قطرها (بالسم)؟",
      fa: "دایره‌ای با قطر ۱۰ سانتی‌متر. شعاعش چند سانتی‌متر است؟",
      pt: "Um círculo tem um diâmetro de 10 cm. Qual é o seu raio (em cm)?",
      so: "Goobo leh qalabka 10 cm. Waa maxay raadkeeda (cm)?",
      ti: "ዙሪያ ናይ 10 ሰ.ሜ ዲያሜትር ዘለዎ። ራዲዩሱ (ብሰ.ሜ) ክንደይ እዩ?",
      tr: "Bir çemberin çapı 10 cm. Yarıçapı kaç cm?",
      ps: "یو دایره د 10 سم قطر لري. د هغې شعاع (سم کې) کچه؟",
      uk: "Коло має діаметр 10 см. Який його радіус (у см)?" },
    "g1-1-e5": { fr: "Calcule la somme des angles intérieurs d'un pentagone (en °).", en: "Calculate the sum of the interior angles of a pentagon (in °).",
      ar: "احسب مجموع الزوايا الداخلية لمضلع خماسي (بالدرجات).",
      fa: "مجموع زوایای داخلی یک پنج‌ضلعی را حساب کنید (بر حسب درجه).",
      pt: "Calcule a soma dos ângulos interiores de um pentágono (em °).",
      so: "Xisaabi wadarta xagalaha gudaha ee shaxanka shan-dhinacle (°).",
      ti: "ናይ ፔንታጎን ውሽጣዊ ኩርናዓት ድምር ሒሳብ ግበር (ብ°)።",
      tr: "Bir beşgenin iç açılarının toplamını hesaplayın (°).",
      ps: "د پنج اړخیز شکل د لوري زاویو مجموع حساب کړئ (درجو کې).",
      uk: "Обчисліть суму внутрішніх кутів п'ятикутника (у °)." },
  },
};
