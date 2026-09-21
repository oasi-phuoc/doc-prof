import type { SubmoduleTrad } from "./trad-types";

export const TRAD_G1_3: SubmoduleTrad = {
  submoduleId: "G1-3",
  title: {
    fr: "Propriétés des formes",
    en: "Properties of shapes",
    ar: "خصائص الأشكال",
    fa: "خواص اشکال",
    ti: "ንብረታት ቅርጻት",
    uk: "Властивості фігур",
  },
  blocks: [
    // 0 — heading "Les quadrilatères" (black)
    { text: { fr: "Les quadrilatères", en: "Quadrilaterals", ar: "الرباعيات", fa: "چهارضلعی‌ها", ti: "ኣርባዕ ጎቦ", uk: "Чотирикутники", pt: "Quadriláteros", so: "Afardhinacyada", tr: "Dörtgenler", ps: "چهارضلعي شکلونه" } },

    // 1 — plain
    { text: { fr: "Un **quadrilatère** est un polygone à **4 côtés**. La somme de ses angles intérieurs est toujours **360°**.", en: "A **quadrilateral** is a polygon with **4 sides**. The sum of its interior angles is always **360°**.", ar: "**الرباعي** مضلع ذو **4 أضلاع**. مجموع زواياه الداخلية دائمًا **360°**.", fa: "**چهارضلعی** چندضلعی با **4 ضلع** است. مجموع زوایای داخلی آن همیشه **360°** است.", ti: "**ኣርባዕ ጎቦ** ቅርጺ **4 ጎቦ** ዘለዎ ብዙ ጎቦ ዩ። ናይ ውሽጠ ኩርናዓቱ ድምር ኩሉ ግዜ **360°** ዩ።", uk: "**Чотирикутник** — многокутник із **4 сторонами**. Сума його внутрішніх кутів завжди **360°**.", pt: "Um **quadrilátero** é um polígono com **4 lados**. A soma dos seus ângulos interiores é sempre **360°**.", so: "**Afardhinacyada** waa dabacsan afar dhinac. Wadarta xagasha gudaha waa **360°**.", tr: "Bir **dörtgen**, **4 kenarlı** bir çokgendir. İç açılarının toplamı her zaman **360°**'dir.", ps: "**چهارضلعي** **4 اړخونه** لرونکی ګوني شکل دی. د دننه زاويو مجموعه تل **360°** ده." } },

    // 2 — table ["Nom","Propriétés principales"] rows
    { headers: { fr: ["Nom", "Propriétés principales"], en: ["Name", "Main properties"], ar: ["الاسم", "الخصائص الرئيسية"], fa: ["نام", "خواص اصلی"], ti: ["ስም", "ዋና ንብረታት"], uk: ["Назва", "Основні властивості"], pt: ["Nome", "Propriedades principais"], so: ["Magac", "Sifooyinka muhiimka"], tr: ["Ad", "Temel özellikler"], ps: ["نوم", "اصلي خواص"] },
      items: { fr: ["Carré | 4 côtés égaux · 4 angles droits", "Rectangle | 4 angles droits · côtés opposés égaux", "Losange | 4 côtés égaux · angles opposés égaux", "Parallélogramme | Côtés opposés parallèles et égaux", "Trapèze | Une seule paire de côtés parallèles"], en: ["Square | 4 equal sides · 4 right angles", "Rectangle | 4 right angles · opposite sides equal", "Rhombus | 4 equal sides · opposite angles equal", "Parallelogram | Opposite sides parallel and equal", "Trapezoid | One pair of parallel sides"], ar: ["مربع | 4 أضلاع متساوية · 4 زوايا قائمة", "مستطيل | 4 زوايا قائمة · أضلاع متقابلة متساوية", "معين | 4 أضلاع متساوية · زوايا متقابلة متساوية", "متوازي أضلاع | أضلاع متقابلة متوازية ومتساوية", "شبه منحرف | زوج واحد من الأضلاع المتوازية"], fa: ["مربع | 4 ضلع برابر · 4 زاویه قائمه", "مستطیل | 4 زاویه قائمه · اضلاع مقابل برابر", "لوزی | 4 ضلع برابر · زوایای مقابل برابر", "متوازی‌الاضلاع | اضلاع مقابل موازی و برابر", "ذوزنقه | فقط یک جفت ضلع موازی"], ti: ["ካሬ | 4 ዕኩል ጎቦ · 4 ቅኑዕ ኩርናዓት", "ካሬ-ሓለቃ | 4 ቅኑዕ ኩርናዓት · ናይ ወጻኢ ጎቦ ዕኩል", "ሮምቡስ | 4 ዕኩል ጎቦ · ናይ ወጻኢ ኩርናዓት ዕኩል", "ፓራሌሎግራም | ናይ ወጻኢ ጎቦ ሓሓዊ ዕኩል", "ትራፔዞይድ | ሓደ ጽርዐ ናይ ሓሓዊ ጎቦ"], uk: ["Квадрат | 4 рівні сторони · 4 прямі кути", "Прямокутник | 4 прямі кути · протилежні сторони рівні", "Ромб | 4 рівні сторони · протилежні кути рівні", "Паралелограм | Протилежні сторони паралельні й рівні", "Трапеція | Одна пара паралельних сторін"], pt: ["Quadrado | 4 lados iguais · 4 ângulos retos", "Retângulo | 4 ângulos retos · lados opostos iguais", "Losango | 4 lados iguais · ângulos opostos iguais", "Paralelogramo | Lados opostos paralelos e iguais", "Trapézio | Um par de lados paralelos"], so: ["Geesinada | 4 dhinac siman · 4 xag toosan", "Mustateel | 4 xag toosan · dhinacyada isdehsan siman", "Almaasin | 4 dhinac siman · xagasha isdehsan siman", "Parallelogram | Dhinacyada isdehsan wada xidhiidha", "Shirafta | Hal lammaane dhinac ah oo wada xidhiidha"], tr: ["Kare | 4 eşit kenar · 4 dik açı", "Dikdörtgen | 4 dik açı · karşılıklı kenarlar eşit", "Eşkenar dörtgen | 4 eşit kenar · karşılıklı açılar eşit", "Paralelkenar | Karşılıklı kenarlar paralel ve eşit", "Yamuk | Bir çift paralel kenar"], ps: ["مربع | 4 مساوي اړخونه · 4 سم زاويې", "مستطيل | 4 سم زاويې · مقابل اړخونه مساوي", "لوزي | 4 مساوي اړخونه · مقابل زاويې مساوي", "متوازي الاضلاع | مقابل اړخونه موازي او مساوي", "ذوزنقه | يوه جوړه موازي اړخونه"] } },

    // 3 — highlight "Hiérarchie des quadrilatères"
    { text: { fr: "Hiérarchie des quadrilatères", en: "Hierarchy of quadrilaterals", ar: "التسلسل الهرمي للرباعيات", fa: "سلسله مراتب چهارضلعی‌ها", ti: "ተርታ ናይ ኣርባዕ ጎቦ", uk: "Ієрархія чотирикутників", pt: "Hierarquia dos quadriláteros", so: "Heerarka afardhinacyada", tr: "Dörtgenlerin hiyerarşisi", ps: "چهارضلعيانو درجه‌بندي" } },

    // 4 — section labelFr "" itemsFr [hierarchy items]
    { label: { fr: "", en: "", ar: "", fa: "", ti: "", uk: "", pt: "", so: "", tr: "", ps: "" },
      items: { fr: ["Le **carré** est un cas particulier du **rectangle** (rectangle à côtés égaux).", "Le **rectangle** et le **losange** sont des cas particuliers du **parallélogramme**.", "Le **parallélogramme** est un cas particulier du **trapèze**."], en: ["A **square** is a special case of a **rectangle** (rectangle with equal sides).", "A **rectangle** and a **rhombus** are special cases of a **parallelogram**.", "A **parallelogram** is a special case of a **trapezoid**."], ar: ["**المربع** حالة خاصة من **المستطيل** (مستطيل بأضلاع متساوية).", "**المستطيل** و**المعين** حالتان خاصتان من **متوازي الأضلاع**.", "**متوازي الأضلاع** حالة خاصة من **شبه المنحرف**."], fa: ["**مربع** حالت خاص **مستطیل** است (مستطیل با اضلاع برابر).", "**مستطیل** و **لوزی** حالت‌های خاص **متوازی‌الاضلاع** هستند.", "**متوازی‌الاضلاع** حالت خاص **ذوزنقه** است."], ti: ["**ካሬ** ናይ **ካሬ-ሓለቃ** ፍሉይ ኩነት ዩ (ዕኩል ጎቦ ካሬ-ሓለቃ).", "**ካሬ-ሓለቃ** ን **ሮምቡስ** ናይ **ፓራሌሎግራም** ፍሉይ ኩነታት ዮም.", "**ፓራሌሎግራም** ናይ **ትራፔዞይድ** ፍሉይ ኩነት ዩ."], uk: ["**Квадрат** — це окремий випадок **прямокутника** (прямокутник з рівними сторонами).", "**Прямокутник** і **ромб** — окремі випадки **паралелограма**.", "**Паралелограм** — окремий випадок **трапеції**."], pt: ["Um **quadrado** é um caso especial do **retângulo** (retângulo com lados iguais).", "O **retângulo** e o **losango** são casos especiais do **paralelogramo**.", "O **paralelogramo** é um caso especial do **trapézio**."], so: ["**Geesinada** xaalad gaara ah waa **mustateel** (mustateel dhinacyo siman).", "**Mustateel** iyo **almaasin** xaaladaha gaar ah ee **parallelogram** waa.", "**Parallelogram** xaalad gaara ah waa **shirafta**."], tr: ["**Kare**, **dikdörtgenin** özel bir durumudur (eşit kenarlı dikdörtgen).", "**Dikdörtgen** ve **eşkenar dörtgen**, **paralelkenarın** özel durumlarıdır.", "**Paralelkenar**, **yamuğun** özel bir durumudur."], ps: ["**مربع** د **مستطيل** ځانګړی حالت دی (د مساوي اړخونو مستطيل).", "**مستطيل** او **لوزي** د **متوازي الاضلاع** ځانګړي حالتونه دي.", "**متوازي الاضلاع** د **ذوزنقه** ځانګړی حالت دی."] } },

    // 5 — svg_row [Carré, Rectangle, Losange, Parallélogramme, Trapèze]
    { items: { fr: ["Carré", "Rectangle", "Losange", "Parallélogramme", "Trapèze"], en: ["Square", "Rectangle", "Rhombus", "Parallelogram", "Trapezoid"], ar: ["مربع", "مستطيل", "معين", "متوازي أضلاع", "شبه منحرف"], fa: ["مربع", "مستطیل", "لوزی", "متوازی‌الاضلاع", "ذوزنقه"], ti: ["ካሬ", "ካሬ-ሓለቃ", "ሮምቡስ", "ፓራሌሎግራም", "ትራፔዞይድ"], uk: ["Квадрат", "Прямокутник", "Ромб", "Паралелограм", "Трапеція"], pt: ["Quadrado", "Retângulo", "Losango", "Paralelogramo", "Trapézio"], so: ["Geesinada", "Mustateel", "Almaasin", "Parallelogram", "Shirafta"], tr: ["Kare", "Dikdörtgen", "Eşkenar dörtgen", "Paralelkenar", "Yamuk"], ps: ["مربع", "مستطيل", "لوزي", "متوازي الاضلاع", "ذوزنقه"] } },

    // 6 — heading "Diagonales" (black)
    { text: { fr: "Diagonales", en: "Diagonals", ar: "الأقطار", fa: "قطرها", ti: "ዳያጎናላት", uk: "Діагоналі", pt: "Diagonais", so: "Dhinacyada dhexe", tr: "Köşegenler", ps: "قطرونه" } },

    // 7 — plain
    { text: { fr: "La **diagonale** d'un quadrilatère est un segment reliant deux sommets non consécutifs.", en: "A **diagonal** of a quadrilateral is a segment connecting two non-consecutive vertices.", ar: "**قطر** الرباعي قطعة مستقيمة تصل بين رأسين غير متتاليين.", fa: "**قطر** یک چهارضلعی قطعه‌ای است که دو رأس غیر متوالی را به هم وصل می‌کند.", ti: "**ዳያጎናል** ናይ ኣርባዕ ጎቦ ክልተ ዘይተኸታተሉ ርእሲ ዘራኽብ ሰጠምቲ ዩ።", uk: "**Діагональ** чотирикутника — це відрізок, що з'єднує дві несусідні вершини.", pt: "Uma **diagonal** de um quadrilátero é um segmento que une dois vértices não consecutivos.", so: "**Xarriiqda dhexe** ee afardhinacyada waa qayb xidha laba madal aan xidna ahayn.", tr: "Bir dörtgenin **köşegeni**, ardışık olmayan iki köşeyi birleştiren doğru parçasıdır.", ps: "د چهارضلعي **قطر** هغه خط دی چې دوه غیر متوالي رأسونه سره وصلوي." } },

    // 8 — highlight "Propriétés des diagonales"
    { text: { fr: "Propriétés des diagonales", en: "Properties of diagonals", ar: "خصائص الأقطار", fa: "خواص قطرها", ti: "ንብረታት ዳያጎናላት", uk: "Властивості діагоналей", pt: "Propriedades das diagonais", so: "Sifooyinka xarriiqda dhexe", tr: "Köşegenlerin özellikleri", ps: "د قطرونو خواص" } },

    // 9 — section labelFr "" itemsFr [diagonal properties]
    { label: { fr: "", en: "", ar: "", fa: "", ti: "", uk: "", pt: "", so: "", tr: "", ps: "" },
      items: { fr: ["**Carré** : diagonales égales et **perpendiculaires**.", "**Rectangle** : diagonales **égales** mais pas perpendiculaires.", "**Losange** : diagonales **perpendiculaires** mais pas égales.", "**Parallélogramme** : diagonales se **coupent en leur milieu**."], en: ["**Square**: diagonals equal and **perpendicular**.", "**Rectangle**: diagonals **equal** but not perpendicular.", "**Rhombus**: diagonals **perpendicular** but not equal.", "**Parallelogram**: diagonals **bisect each other**."], ar: ["**المربع**: قطران متساويان و**متعامدان**.", "**المستطيل**: قطران **متساويان** وليسا متعامدين.", "**المعين**: قطران **متعامدان** وليسا متساويين.", "**متوازي الأضلاع**: قطران **يتنصفان**."], fa: ["**مربع**: قطرها مساوی و **عمود بر هم**.", "**مستطیل**: قطرها **مساوی** ولی عمود نیستند.", "**لوزی**: قطرها **عمود بر هم** ولی مساوی نیستند.", "**متوازی‌الاضلاع**: قطرها **یکدیگر را نصف می‌کنند**."], ti: ["**ካሬ**: ዕኩልን **ቀጥታ** ዳያጎናል.", "**ካሬ-ሓለቃ**: **ዕኩል** ዳያጎናል ቀጥታ ዘይኮኑ.", "**ሮምቡስ**: **ቀጥታ** ዳያጎናል ዕኩል ዘይኮኑ.", "**ፓራሌሎግራም**: ዳያጎናል **ናብ ፍርቆም ዝፈርዩ**."], uk: ["**Квадрат**: діагоналі рівні і **перпендикулярні**.", "**Прямокутник**: діагоналі **рівні**, але не перпендикулярні.", "**Ромб**: діагоналі **перпендикулярні**, але не рівні.", "**Паралелограм**: діагоналі **перетинаються в середині**."], pt: ["**Quadrado**: diagonais iguais e **perpendiculares**.", "**Retângulo**: diagonais **iguais**, mas não perpendiculares.", "**Losango**: diagonais **perpendiculares**, mas não iguais.", "**Paralelogramo**: diagonais **bissetizam-se**."], so: ["**Geesinada**: xarriiqda dhexe siman oo **toosan**.", "**Mustateel**: xarriiqda dhexe **siman** laakiin toosan maahan.", "**Almaasin**: xarriiqda dhexe **toosan** laakiin siman maahan.", "**Parallelogram**: xarriiqda dhexe **isdhecsa bartoodda**."], tr: ["**Kare**: dik ve eşit köşegenler.", "**Dikdörtgen**: **eşit** köşegenler, dik değil.", "**Eşkenar dörtgen**: **dik** köşegenler, eşit değil.", "**Paralelkenar**: köşegenler **birbirini ortalar**."], ps: ["**مربع**: مساوي او **عمودي** قطرونه.", "**مستطيل**: **مساوي** قطرونه، عمودي نه دي.", "**لوزي**: **عمودي** قطرونه، مساوي نه دي.", "**متوازي الاضلاع**: قطرونه **يو بل نصف کوي**."] } },
  ],
  paragraphs: {
    fr: [
      "Un quadrilatère est un polygone à 4 côtés. La somme de ses angles intérieurs est 360°.",
      "Types : carré (4 côtés égaux, 4 angles droits), rectangle (4 angles droits), losange (4 côtés égaux), parallélogramme, trapèze.",
      "Hiérarchie : le carré est un cas particulier du rectangle, qui est un cas particulier du parallélogramme.",
      "Diagonales : carré et rectangle ont des diagonales égales ; le losange a des diagonales perpendiculaires.",
    ],
    en: [
      "A quadrilateral is a 4-sided polygon. Sum of interior angles = 360°.",
      "Types: square (4 equal sides, 4 right angles), rectangle (4 right angles), rhombus (4 equal sides), parallelogram, trapezoid.",
      "Hierarchy: square ⊂ rectangle ⊂ parallelogram ⊂ trapezoid.",
      "Diagonals: square and rectangle have equal diagonals; rhombus has perpendicular diagonals.",
    ],
    ar: [
      "الرباعي مضلع ذو 4 أضلاع. مجموع الزوايا = 360°.",
      "أنواع: مربع، مستطيل، معين، متوازي أضلاع، شبه منحرف.",
      "التسلسل الهرمي: المربع ⊂ المستطيل ⊂ متوازي الأضلاع.",
      "الأقطار: المربع والمستطيل لهما قطران متساويان.",
    ],
    fa: [
      "چهارضلعی چندضلعی با 4 ضلع است. مجموع زوایای داخلی = 360°.",
      "انواع: مربع، مستطیل، لوزی، متوازی‌الاضلاع، ذوزنقه.",
      "سلسله مراتب: مربع ⊂ مستطیل ⊂ متوازی‌الاضلاع.",
      "قطرها: مربع و مستطیل قطرهای مساوی دارند.",
    ],
    ti: [
      "ኣርባዕ ጎቦ ቅርጺ 4 ጎቦ ዘለዎ ብዙ ጎቦ ዩ. ናይ ውሽጠ ኩርናዓት ድምር = 360°.",
      "ዓይነታት: ካሬ, ካሬ-ሓለቃ, ሮምቡስ, ፓራሌሎግራም, ትራፔዞይድ.",
      "ሃርያርኪ: ካሬ ⊂ ካሬ-ሓለቃ ⊂ ፓራሌሎግራም.",
      "ዲያጎናሎ: ካሬ ን ካሬ-ሓለቃ ዕኩል ዩ.",
    ],
    uk: [
      "Чотирикутник — чотиристоронній многокутник. Сума внутрішніх кутів = 360°.",
      "Типи: квадрат, прямокутник, ромб, паралелограм, трапеція.",
      "Ієрархія: квадрат ⊂ прямокутник ⊂ паралелограм ⊂ трапеція.",
      "Діагоналі: квадрат і прямокутник мають рівні діагоналі.",
    ],
  },
  consignes: {
    "g1-3-e1": { fr: "Quel quadrilatère a 4 côtés égaux ET 4 angles droits ?", en: "Which quadrilateral has 4 equal sides AND 4 right angles?",
      ar: "ما اسم رباعي الأضلاع الذي له 4 أضلاع متساوية و4 زوايا قائمة؟",
      fa: "کدام چهارضلعی دارای ۴ ضلع مساوی و ۴ زاویه قائمه است؟",
      pt: "Qual quadrilátero tem 4 lados iguais E 4 ângulos retos?",
      so: "Muruq-afar-dhinaceedka kee wuxuu leeyahay 4 dhinac oo siman IYO 4 xagal oo toosan?",
      ti: "ናይ ዝኾነ 4ይ ሸነኽ 4 ማዕረ ሸነኻት ኣለዎ ዊዒ 4 ቅድሜ ኩርናዓት?",
      tr: "Hangi dörtgen 4 eşit kenara VE 4 dik açıya sahiptir?",
      ps: "کوم چهار اړخی شکل 4 مساوي اړخونه او 4 سمې زاویې لري؟",
      uk: "Який чотирикутник має 4 рівні сторони І 4 прямі кути?" },
    "g1-3-e2": { fr: "Un losange a-t-il obligatoirement des angles droits ? (oui/non)", en: "Does a rhombus necessarily have right angles? (yes/no)",
      ar: "هل اللوزي له بالضرورة زوايا قائمة؟ (نعم/لا)",
      fa: "آیا لوزی لزوماً زوایای قائمه دارد؟ (بله/خیر)",
      pt: "Um losango tem necessariamente ângulos retos? (sim/não)",
      so: "Ma xagleenku wuxuu si xukmi ah u leeyahay xagalo toosan? (haa/maya)",
      ti: "ሮምቡስ ብግድን ቅድሜ ኩርናዓት ኣለዎ ዶ? (እወ/ኣይፋል)",
      tr: "Bir eşkenar dörtgenin mutlaka dik açıları var mıdır? (evet/hayır)",
      ps: "ایا لوزي شکل بالضروره سمې زاویې لري؟ (هو/نه)",
      uk: "Чи обов'язково у ромба є прямі кути? (так/ні)" },
    "g1-3-e3": { fr: "Quel quadrilatère a exactement une paire de côtés parallèles ?", en: "Which quadrilateral has exactly one pair of parallel sides?",
      ar: "ما اسم رباعي الأضلاع الذي له زوجٌ واحد فقط من الأضلاع المتوازية؟",
      fa: "کدام چهارضلعی دارای دقیقاً یک جفت ضلع موازی است؟",
      pt: "Qual quadrilátero tem exatamente um par de lados paralelos?",
      so: "Muruq-afar-dhinaceedka kee wuxuu leeyahay keliya hal labalaab oo dhinacyo isla socda?",
      ti: "ናይ ዝኾነ 4ይ ሸነኽ ሓደ ጥቃ ናይ ምዝዛዝ ሸነኻት ኣለዎ?",
      tr: "Hangi dörtgenin tam olarak bir çift paralel kenarı vardır?",
      ps: "کوم چهار اړخی شکل دقیقاً یو جوړه موازي اړخونه لري؟",
      uk: "Який чотирикутник має рівно одну пару паралельних сторін?" },
    "g1-3-e4": { fr: "Tous les rectangles sont-ils des carrés ? (oui/non)", en: "Are all rectangles squares? (yes/no)",
      ar: "هل كل المستطيلات مربعات؟ (نعم/لا)",
      fa: "آیا همه مستطیل‌ها مربع هستند؟ (بله/خیر)",
      pt: "Todos os retângulos são quadrados? (sim/não)",
      so: "Ma dhammaan lix-jibaaryada waa afar-jibaaro? (haa/maya)",
      ti: "ኩሎም ሕቡሳት ጎዳጉዲ ድዮም? (እወ/ኣይፋል)",
      tr: "Tüm dikdörtgenler kare midir? (evet/hayır)",
      ps: "ایا ټول مستطیل‌ونه مربع دي؟ (هو/نه)",
      uk: "Чи всі прямокутники є квадратами? (так/ні)" },
    "g1-3-e5": { fr: "Tous les carrés sont-ils des rectangles ? (oui/non)", en: "Are all squares rectangles? (yes/no)",
      ar: "هل كل المربعات مستطيلات؟ (نعم/لا)",
      fa: "آیا همه مربع‌ها مستطیل هستند؟ (بله/خیر)",
      pt: "Todos os quadrados são retângulos? (sim/não)",
      so: "Ma dhammaan wareegyada waa lix-jibaara? (haa/maya)",
      ti: "ኩሎም ጎዳጉዲ ሕቡሳት ድዮም? (እወ/ኣይፋል)",
      tr: "Tüm kareler dikdörtgen midir? (evet/hayır)",
      ps: "ایا ټول مربع‌ونه مستطیل دي؟ (هو/نه)",
      uk: "Чи всі квадрати є прямокутниками? (так/ні)" },
  },
};
