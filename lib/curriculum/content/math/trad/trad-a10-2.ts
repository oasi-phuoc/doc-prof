import type { SubmoduleTrad } from "./trad-types";

const S = (fr: string, en: string, ar: string, fa: string, ti: string, uk: string, pt: string, so: string, tr: string, ps: string) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });
const A = (fr: string[], en: string[], ar: string[], fa: string[], ti: string[], uk: string[], pt: string[], so: string[], tr: string[], ps: string[]) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

export const TRAD_A10_2: SubmoduleTrad = {
  submoduleId: "A10-2",
  title: S(
    "Équations avec fractions",
    "Equations with fractions",
    "معادلات بالكسور",
    "معادلات با کسر",
    "ምዕርርያት ምስ ፍርቂታት",
    "Рівняння з дробами",
    "Equações com frações",
    "Isle'egyo leh jajab",
    "Kesirli denklemler",
    "د کسرونو معادلې",
  ),
  blocks: [
    // Block 0 — heading "Résoudre une équation avec fractions" (black)
    { text: S(
      "Résoudre une équation avec fractions",
      "Solving an equation with fractions",
      "حل معادلة بالكسور",
      "حل یک معادله با کسرها",
      "ምፍታሕ ምዕርርያት ብፍርቂታት",
      "Розв'язування рівняння з дробами",
      "Resolução de uma equação com frações",
      "Xallinta isle'egyada leh jajabyo",
      "Kesirli denklem çözme",
      "د کسرونو سره د معادلې حل",
    ) },
    // Block 1 — plain
    { text: S(
      "Une équation avec fractions se résout comme une équation normale, mais on commence souvent par **supprimer les dénominateurs**.",
      "An equation with fractions is solved like a normal equation, but we often start by **eliminating the denominators**.",
      "تُحل المعادلة بالكسور مثل المعادلة العادية، لكننا نبدأ عادةً بـ**إزالة المقامات**.",
      "یک معادله با کسرها مانند یک معادله معمولی حل می‌شود، اما معمولاً با **حذف مخرج‌ها** شروع می‌کنیم.",
      "ምዕርርያት ምስ ፍርቂታት ከም ናይ ልሙዕ ምዕርርያት ይፍታሕ፣ ግን ብ**ምልጋስ ዲኖሚኔተራት** ንጅምር።",
      "Рівняння з дробами розв'язують так само, як звичайне рівняння, але часто починають із **усунення знаменників**.",
      "Uma equação com frações resolve-se como uma equação normal, mas começamos muitas vezes por **suprimir os denominadores**.",
      "Isle'egy leh jajabyo si isle'eg caadi ah ayaa loo xalliyaa, laakiin waxaan badanaa ku bilaabaa **baabi'inta hooseeyayaasha**.",
      "Kesirli bir denklem normal bir denklem gibi çözülür, ancak genellikle **paydaları yok ederek** başlarız.",
      "د کسرونو سره معادله د عادي معادلې غوندې حل کېږي، مګر موږ ډېر وخت د **مخرجونو لرې کولو** سره پیل کوو.",
    ) },
    // Block 2 — highlight "Méthode"
    { text: S(
      "Méthode",
      "Method",
      "الطريقة",
      "روش",
      "ኣገባብ",
      "Метод",
      "Método",
      "Habka",
      "Yöntem",
      "طريقه",
    ) },
    // Block 3 — plain "1. Repérer tous les dénominateurs."
    { text: S(
      "**1.** Repérer tous les dénominateurs.",
      "**1.** Identify all the denominators.",
      "**1.** تحديد جميع المقامات.",
      "**1.** شناسایی همه مخرج‌ها.",
      "**1.** ኩሎም ዲኖሚኔተራት ምርካብ።",
      "**1.** Знайти всі знаменники.",
      "**1.** Identificar todos os denominadores.",
      "**1.** Gari dhammaan hooseeyayaasha.",
      "**1.** Tüm paydaları bul.",
      "**1.** ټول مخرجونه ومومئ.",
    ) },
    // Block 4 — plain "2. Chercher un dénominateur commun, souvent le PPMC."
    { text: S(
      "**2.** Chercher un dénominateur commun, souvent le PPMC.",
      "**2.** Find a common denominator, often the LCM.",
      "**2.** إيجاد مقام مشترك، غالبًا الم.م.م.",
      "**2.** پیدا کردن یک مخرج مشترک، اغلب م.م.م.",
      "**2.** ሓባራዊ ዲኖሚኔተር ምርካብ፣ ብዙሕ ግዜ PPMC።",
      "**2.** Знайти спільний знаменник, зазвичай НСК.",
      "**2.** Encontrar um denominador comum, muitas vezes o mmc.",
      "**2.** Hel hooseeyaha wadajirka ah, inta badan LCM.",
      "**2.** Ortak bir payda bul, genellikle EKOK.",
      "**2.** د مشترک مخرج موندل، ډېر وخت م.م.م.",
    ) },
    // Block 5 — plain "3. Écrire chaque terme avec ce même dénominateur."
    { text: S(
      "**3.** Écrire chaque terme avec ce même dénominateur.",
      "**3.** Write each term with this common denominator.",
      "**3.** كتابة كل حد بهذا المقام المشترك.",
      "**3.** نوشتن هر جمله با همین مخرج مشترک.",
      "**3.** ነፍሲ ወከፍ ኣካል ምስዚ ሓባራዊ ዲኖሚኔተር ምጽሓፍ።",
      "**3.** Записати кожний доданок із цим спільним знаменником.",
      "**3.** Escrever cada termo com este denominador comum.",
      "**3.** Qor qodobkasta oo leh hooseeyahan wadajirka ah.",
      "**3.** Her terimi bu ortak paydayla yaz.",
      "**3.** هر جمله د دې مشترک مخرج سره ولیکئ.",
    ) },
    // Block 6 — plain "4. Multiplier toute l'équation par ce dénominateur."
    { text: S(
      "**4.** Multiplier toute l'équation par ce dénominateur.",
      "**4.** Multiply the whole equation by this denominator.",
      "**4.** ضرب المعادلة كلها في هذا المقام.",
      "**4.** ضرب کردن تمام معادله در این مخرج.",
      "**4.** ምሉእ ምዕርርያት ብዚ ዲኖሚኔተር ምብዛሕ።",
      "**4.** Помножити все рівняння на цей знаменник.",
      "**4.** Multiplicar toda a equação por este denominador.",
      "**4.** Ku dhufo isle'egta oo dhan hooseeyahan.",
      "**4.** Denklemin tamamını bu paydayla çarp.",
      "**4.** ټوله معادله د دې مخرج سره ضرب کړئ.",
    ) },
    // Block 7 — plain "5. Réduire, isoler x, puis vérifier la solution."
    { text: S(
      "**5.** Réduire, isoler x, puis vérifier la solution.",
      "**5.** Simplify, isolate x, then check the solution.",
      "**5.** التبسيط، عزل x، ثم التحقق من الحل.",
      "**5.** ساده‌سازی، جداسازی x، سپس بررسی جواب.",
      "**5.** ምቅላል፣ x ምጽራይ፣ ድሕሪኡ ፍታሕ ምርግጋጽ።",
      "**5.** Скоротити, ізолювати x, потім перевірити розв'язок.",
      "**5.** Reduzir, isolar x, depois verificar a solução.",
      "**5.** Fududee, go'diso x, kadibna hubi xalka.",
      "**5.** Sadeleştir, x'i yalnız bırak, sonra çözümü kontrol et.",
      "**5.** ساده کړئ، x جلا کړئ، بیا حل وګورئ.",
    ) },
    // Block 8 — theory_tabs (inner blocks not translated)
    {},
    // Block 9 — table headers ["Situation", "Action"]
    { headers: A(
      ["Situation", "Action"],
      ["Situation", "Action"],
      ["الوضعية", "الإجراء"],
      ["وضعیت", "اقدام"],
      ["ኩነታት", "ኣፈጻጽማ"],
      ["Ситуація", "Дія"],
      ["Situação", "Ação"],
      ["Xaaladda", "Tallaabada"],
      ["Durum", "İşlem"],
      ["حالت", "کار"],
    ) },
  ],
};
