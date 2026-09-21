import type { SubmoduleTrad } from "./trad-types";

const S = (fr: string, en: string, ar: string, fa: string, ti: string, uk: string, pt: string, so: string, tr: string, ps: string) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });
const A = (fr: string[], en: string[], ar: string[], fa: string[], ti: string[], uk: string[], pt: string[], so: string[], tr: string[], ps: string[]) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

export const TRAD_A10_3: SubmoduleTrad = {
  submoduleId: "A10-3",
  title: S(
    "Méthode de substitution",
    "Substitution method",
    "طريقة الإحلال",
    "روش جایگذاری",
    "ኣፈጻጽማ ምትካእ",
    "Метод підстановки",
    "Método de substituição",
    "Habka beddelka",
    "Yerine koyma yöntemi",
    "د ځایناستۍ میتود",
  ),
  blocks: [
    // 0 — heading
    {
      text: S(
        "Système de deux équations",
        "System of two equations",
        "نظام معادلتين",
        "دستگاه دو معادله",
        "ስርዓተ ክልተ ምዕርርያት",
        "Система двох рівнянь",
        "Sistema de duas equações",
        "Nidaam laba isle'eg ah",
        "İki denklemli sistem",
        "د دوو معادلو سیسټم",
      ),
    },
    // 1 — plain
    {
      text: S(
        "Un système de deux équations à deux inconnues admet généralement une solution unique (x, y). La méthode de substitution exprime une inconnue en fonction de l'autre, puis substitue.",
        "A system of two equations with two unknowns generally has a unique solution (x, y). The substitution method expresses one unknown in terms of the other, then substitutes.",
        "نظام معادلتين بمجهولين يقبل عادة حلاً وحيداً (x, y). طريقة الإحلال تعبّر عن مجهول بدلالة الآخر ثم تعوّض.",
        "دستگاه دو معادله با دو مجهول معمولاً یک جواب یکتا (x, y) دارد. روش جایگذاری یک مجهول را بر حسب دیگری می‌نویسد، سپس جایگذاری می‌کند.",
        "ስርዓተ ክልተ ምዕርርያት ምስ ክልተ ዘይፍለጡ መብዛሕትኡ ሓደ ፍታሕ (x, y) ኣለዎ። ኣፈጻጽማ ምትካእ ሓደ ዘይፍለጥ ብካልእ ይገልጽ፣ ድሕሪኡ ይትክእ።",
        "Система двох рівнянь із двома невідомими зазвичай має єдиний розв'язок (x, y). Метод підстановки виражає одне невідоме через інше, потім підставляє.",
        "Um sistema de duas equações a duas incógnitas admite geralmente uma solução única (x, y). O método de substituição exprime uma incógnita em função da outra e depois substitui.",
        "Nidaam laba isle'eg oo leh laba aan la aqoon ah wuxuu inta badan leeyahay xal keliya (x, y). Habka beddelka wuxuu mid ka mid ah ku sheegaa kan kale, ka dibna wuu beddelaa.",
        "İki bilinmeyenli iki denklemli bir sistem genellikle tek bir çözüme (x, y) sahiptir. Yerine koyma yöntemi bir bilinmeyeni diğeri cinsinden yazar, sonra yerine koyar.",
        "د دوو ناڅرګندو سره د دوو معادلو سیسټم معمولاً یوازې یو حل (x, y) لري. د ځایناستۍ میتود یو ناڅرګند د بل په توګه څرګندوي، بیا یې ځایناستی کوي.",
      ),
    },
    // 2 — highlight
    {
      text: S(
        "Les 5 étapes de la méthode",
        "The 5 steps of the method",
        "الخطوات الخمس للطريقة",
        "۵ مرحله روش",
        "5 ስጉምትታት ናይ ኣፈጻጽማ",
        "5 кроків методу",
        "Os 5 passos do método",
        "5 tallaabo ee habka",
        "Yöntemin 5 adımı",
        "د میتود ۵ پړاوونه",
      ),
    },
    // 3 — plain step 1
    {
      text: S(
        "**1.** Choisir l'équation la plus simple pour exprimer x (ou y)",
        "**1.** Choose the simplest equation to express x (or y)",
        "**1.** اختر المعادلة الأبسط للتعبير عن x (أو y)",
        "**1.** ساده‌ترین معادله را برای بیان x (یا y) انتخاب کنید",
        "**1.** እቲ ዝቐለለ ምዕርርያት ን x (ወይ y) ንምግላጽ ምረጽ",
        "**1.** Вибери найпростіше рівняння, щоб виразити x (або y)",
        "**1.** Escolhe a equação mais simples para exprimir x (ou y)",
        "**1.** Dooro isle'egta ugu fudud si aad u sheegto x (ama y)",
        "**1.** x (veya y) için en basit denklemi seç",
        "**1.** د x (یا y) د څرګندولو لپاره تر ټولو ساده معادله وټاکئ",
      ),
    },
    // 4 — plain step 2
    {
      text: S(
        "**2.** Exprimer x en fonction de y (ou y en fonction de x)",
        "**2.** Express x in terms of y (or y in terms of x)",
        "**2.** عبّر عن x بدلالة y (أو y بدلالة x)",
        "**2.** x را بر حسب y بنویسید (یا y را بر حسب x)",
        "**2.** x ብ y ግለጽ (ወይ y ብ x)",
        "**2.** Вирази x через y (або y через x)",
        "**2.** Exprime x em função de y (ou y em função de x)",
        "**2.** Sheeg x iyadoo ku saleysan y (ama y iyadoo ku saleysan x)",
        "**2.** x'i y cinsinden yaz (veya y'yi x cinsinden)",
        "**2.** x د y په توګه وښایئ (یا y د x په توګه)",
      ),
    },
    // 5 — plain step 3
    {
      text: S(
        "**3.** Substituer cette expression dans l'autre équation",
        "**3.** Substitute this expression into the other equation",
        "**3.** عوّض هذا التعبير في المعادلة الأخرى",
        "**3.** این عبارت را در معادله دیگر جایگذاری کنید",
        "**3.** ነዚ መግለጺ ኣብቲ ካልእ ምዕርርያት ተክእ",
        "**3.** Підстав цей вираз в інше рівняння",
        "**3.** Substitui esta expressão na outra equação",
        "**3.** Ku beddel muujintan isle'egta kale",
        "**3.** Bu ifadeyi diğer denkleme yerleştir",
        "**3.** دا څرګندونه په بله معادله کې ځایناستی کړئ",
      ),
    },
    // 6 — plain step 4
    {
      text: S(
        "**4.** Résoudre l'équation à une inconnue obtenue",
        "**4.** Solve the resulting one-unknown equation",
        "**4.** حل المعادلة ذات المجهول الواحد الناتجة",
        "**4.** معادله یک‌مجهولی به‌دست‌آمده را حل کنید",
        "**4.** ነቲ ሓደ ዘይፍለጥ ምዕርርያት ፍታሕ",
        "**4.** Розв'яжи отримане рівняння з однією невідомою",
        "**4.** Resolve a equação a uma incógnita obtida",
        "**4.** Xalli isle'egta hal aan la aqoon ee la helay",
        "**4.** Elde edilen tek bilinmeyenli denklemi çöz",
        "**4.** د ترلاسه شوې یو ناڅرګند معادله حل کړئ",
      ),
    },
    // 7 — plain step 5
    {
      text: S(
        "**5.** Trouver la deuxième inconnue, puis vérifier dans les deux équations",
        "**5.** Find the second unknown, then check in both equations",
        "**5.** أوجد المجهول الثاني، ثم تحقق في المعادلتين",
        "**5.** مجهول دوم را بیابید، سپس در هر دو معادله بررسی کنید",
        "**5.** ካልኣይ ዘይፍለጥ ርከብ፣ ድሕሪኡ ኣብ ክልቲኦም ምዕርርያት ኣረጋግጽ",
        "**5.** Знайди другу невідому, потім перевір в обох рівняннях",
        "**5.** Encontra a segunda incógnita e verifica nas duas equações",
        "**5.** Hel kan labaad ee aan la aqoon, ka dibna ku hubi labada isle'eg",
        "**5.** İkinci bilinmeyeni bul, sonra her iki denklemde kontrol et",
        "**5.** دوهم ناڅرګند ومومئ، بیا په دواړو معادلو کې وګورئ",
      ),
    },
    // 8 — heading
    {
      text: S(
        "Exemple détaillé",
        "Detailed example",
        "مثال مفصل",
        "مثال جزئی",
        "ዝርዝር ኣብነት",
        "Детальний приклад",
        "Exemplo detalhado",
        "Tusaale faahfaahsan",
        "Ayrıntılı örnek",
        "تفصيلي بېلګه",
      ),
    },
    // 9 — highlight
    {
      text: S(
        "Système à résoudre",
        "System to solve",
        "نظام للحل",
        "دستگاه برای حل",
        "ክፈታሕ ዘለዎ ስርዓት",
        "Система для розв'язання",
        "Sistema a resolver",
        "Nidaam la xallinayo",
        "Çözülecek sistem",
        "د حل لپاره سیسټم",
      ),
    },
    // 10 — section
    {
      items: A(
        ["{ x **+** y = 7", "{ 2x **−** y = 2"],
        ["{ x **+** y = 7", "{ 2x **−** y = 2"],
        ["{ x **+** y = 7", "{ 2x **−** y = 2"],
        ["{ x **+** y = 7", "{ 2x **−** y = 2"],
        ["{ x **+** y = 7", "{ 2x **−** y = 2"],
        ["{ x **+** y = 7", "{ 2x **−** y = 2"],
        ["{ x **+** y = 7", "{ 2x **−** y = 2"],
        ["{ x **+** y = 7", "{ 2x **−** y = 2"],
        ["{ x **+** y = 7", "{ 2x **−** y = 2"],
        ["{ x **+** y = 7", "{ 2x **−** y = 2"],
      ),
    },
    // 11 — highlight
    {
      text: S(
        "Résolution pas à pas",
        "Step-by-step solution",
        "الحل خطوة بخطوة",
        "حل گام‌به‌گام",
        "ስጉምት ብስጉምት ፍታሕ",
        "Покроковий розв'язок",
        "Resolução passo a passo",
        "Xal tallaabo tallaabo",
        "Adım adım çözüm",
        "پړاو په پړاو حل",
      ),
    },
    // 12 — section
    {
      items: A(
        [
          "De la 1ʳᵉ équation : x = 7 **−** y",
          "Substitution dans la 2ᵉ : 2(7 **−** y) **−** y = 2",
          "→ 14 **−** 2y **−** y = 2",
          "→ 14 **−** 3y = 2",
          "→ 3y = 12  →  y = 4",
          "Puis : x = 7 **−** 4 = 3",
          "**Solution : (x, y) = (3, 4)**",
        ],
        [
          "From the 1st equation: x = 7 **−** y",
          "Substitute into the 2nd: 2(7 **−** y) **−** y = 2",
          "→ 14 **−** 2y **−** y = 2",
          "→ 14 **−** 3y = 2",
          "→ 3y = 12  →  y = 4",
          "Then: x = 7 **−** 4 = 3",
          "**Solution: (x, y) = (3, 4)**",
        ],
        [
          "من المعادلة 1: x = 7 **−** y",
          "التعويض في المعادلة 2: 2(7 **−** y) **−** y = 2",
          "→ 14 **−** 2y **−** y = 2",
          "→ 14 **−** 3y = 2",
          "→ 3y = 12  →  y = 4",
          "ثم: x = 7 **−** 4 = 3",
          "**الحل: (x, y) = (3, 4)**",
        ],
        [
          "از معادله ۱: x = 7 **−** y",
          "جایگذاری در معادله ۲: 2(7 **−** y) **−** y = 2",
          "→ 14 **−** 2y **−** y = 2",
          "→ 14 **−** 3y = 2",
          "→ 3y = 12  →  y = 4",
          "سپس: x = 7 **−** 4 = 3",
          "**جواب: (x, y) = (3, 4)**",
        ],
        [
          "ካብ 1ይ ምዕርርያት: x = 7 **−** y",
          "ኣብ 2ይ ምትካእ: 2(7 **−** y) **−** y = 2",
          "→ 14 **−** 2y **−** y = 2",
          "→ 14 **−** 3y = 2",
          "→ 3y = 12  →  y = 4",
          "ድሕሪኡ: x = 7 **−** 4 = 3",
          "**ፍታሕ: (x, y) = (3, 4)**",
        ],
        [
          "З 1-го рівняння: x = 7 **−** y",
          "Підстановка в 2-ге: 2(7 **−** y) **−** y = 2",
          "→ 14 **−** 2y **−** y = 2",
          "→ 14 **−** 3y = 2",
          "→ 3y = 12  →  y = 4",
          "Потім: x = 7 **−** 4 = 3",
          "**Розв'язок: (x, y) = (3, 4)**",
        ],
        [
          "Da 1.ª equação: x = 7 **−** y",
          "Substituição na 2.ª: 2(7 **−** y) **−** y = 2",
          "→ 14 **−** 2y **−** y = 2",
          "→ 14 **−** 3y = 2",
          "→ 3y = 12  →  y = 4",
          "Depois: x = 7 **−** 4 = 3",
          "**Solução: (x, y) = (3, 4)**",
        ],
        [
          "Ka isle'egta 1aad: x = 7 **−** y",
          "Ku beddel kan 2aad: 2(7 **−** y) **−** y = 2",
          "→ 14 **−** 2y **−** y = 2",
          "→ 14 **−** 3y = 2",
          "→ 3y = 12  →  y = 4",
          "Kadib: x = 7 **−** 4 = 3",
          "**Xal: (x, y) = (3, 4)**",
        ],
        [
          "1. denklemden: x = 7 **−** y",
          "2. denkleme yerleştir: 2(7 **−** y) **−** y = 2",
          "→ 14 **−** 2y **−** y = 2",
          "→ 14 **−** 3y = 2",
          "→ 3y = 12  →  y = 4",
          "Sonra: x = 7 **−** 4 = 3",
          "**Çözüm: (x, y) = (3, 4)**",
        ],
        [
          "له ۱ معادله: x = 7 **−** y",
          "په ۲ کې ځایناستی: 2(7 **−** y) **−** y = 2",
          "→ 14 **−** 2y **−** y = 2",
          "→ 14 **−** 3y = 2",
          "→ 3y = 12  →  y = 4",
          "بیا: x = 7 **−** 4 = 3",
          "**حل: (x, y) = (3, 4)**",
        ],
      ),
    },
    // 13 — highlight
    {
      text: S(
        "Vérification",
        "Verification",
        "التحقق",
        "بررسی",
        "ምርግጋጽ",
        "Перевірка",
        "Verificação",
        "Hubin",
        "Doğrulama",
        "تایید",
      ),
    },
    // 14 — section
    {
      items: A(
        [
          "Équation 1 : 3 **+** 4 = 7 ✓",
          "Équation 2 : 2(3) **−** 4 = 6 **−** 4 = 2 ✓",
        ],
        [
          "Equation 1: 3 **+** 4 = 7 ✓",
          "Equation 2: 2(3) **−** 4 = 6 **−** 4 = 2 ✓",
        ],
        [
          "المعادلة 1: 3 **+** 4 = 7 ✓",
          "المعادلة 2: 2(3) **−** 4 = 6 **−** 4 = 2 ✓",
        ],
        [
          "معادله ۱: 3 **+** 4 = 7 ✓",
          "معادله ۲: 2(3) **−** 4 = 6 **−** 4 = 2 ✓",
        ],
        [
          "ምዕርርያት 1: 3 **+** 4 = 7 ✓",
          "ምዕርርያት 2: 2(3) **−** 4 = 6 **−** 4 = 2 ✓",
        ],
        [
          "Рівняння 1: 3 **+** 4 = 7 ✓",
          "Рівняння 2: 2(3) **−** 4 = 6 **−** 4 = 2 ✓",
        ],
        [
          "Equação 1: 3 **+** 4 = 7 ✓",
          "Equação 2: 2(3) **−** 4 = 6 **−** 4 = 2 ✓",
        ],
        [
          "Isle'eg 1: 3 **+** 4 = 7 ✓",
          "Isle'eg 2: 2(3) **−** 4 = 6 **−** 4 = 2 ✓",
        ],
        [
          "Denklem 1: 3 **+** 4 = 7 ✓",
          "Denklem 2: 2(3) **−** 4 = 6 **−** 4 = 2 ✓",
        ],
        [
          "معادله ۱: 3 **+** 4 = 7 ✓",
          "معادله ۲: 2(3) **−** 4 = 6 **−** 4 = 2 ✓",
        ],
      ),
    },
  ],
};
