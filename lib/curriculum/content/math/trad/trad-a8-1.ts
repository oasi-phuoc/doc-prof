import type { SubmoduleTrad } from "./trad-types";

const S = (fr: string, en: string, ar: string, fa: string, ti: string, uk: string, pt: string, so: string, tr: string, ps: string) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });
const A = (fr: string[], en: string[], ar: string[], fa: string[], ti: string[], uk: string[], pt: string[], so: string[], tr: string[], ps: string[]) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

export const TRAD_A8_1: SubmoduleTrad = {
  submoduleId: "A8-1",
  title: S(
    "Notion et représentation",
    "Concept and representation",
    "المفهوم والتمثيل",
    "مفهوم و نمایش",
    "ሓሳብን ውክልናን",
    "Поняття і запис",
    "Noção e representação",
    "Fikrad iyo matalaad",
    "Kavram ve gösterim",
    "مفهوم او ښودنه"
  ),
  blocks: [
    // 0 — heading "Qu'est-ce qu'une puissance ?"
    {
      text: S(
        "Qu'est-ce qu'une puissance ?",
        "What is a power?",
        "ما هو الأس؟",
        "توان چیست؟",
        "ሓይሊ እንታይ እዩ?",
        "Що таке степінь?",
        "O que é uma potência?",
        "Waa maxay awood?",
        "Üs nedir?",
        "توان څه شی دی؟"
      ),
    },
    // 1 — plain (description of power)
    {
      text: S(
        "Une puissance est une façon rapide d'écrire une multiplication répétée. Elle est composée de deux éléments : la **base** et l'**exposant**.",
        "A power is a quick way to write a repeated multiplication. It has two parts: the **base** and the **exponent**.",
        "الأس طريقة سريعة لكتابة ضرب متكرر. يتكوّن من عنصرين: **الأساس** و**الأس**.",
        "توان راهی سریع برای نوشتن ضرب تکراری است. دو بخش دارد: **پایه** و **نما**.",
        "ሓይሊ ተደጋጋሚ ምብዛሕ ብቕልጡፍ ንምጽሓፍ ዝጠቅም መንገዲ እዩ። ክልተ ክፋላት ኣለውዎ፦ **መሰረት**ን **ኤክስፖናንት**ን።",
        "Степінь — це швидкий спосіб записати повторене множення. Він має дві частини: **основу** і **показник**.",
        "Uma potência é uma forma rápida de escrever uma multiplicação repetida. Tem dois elementos: a **base** e o **expoente**.",
        "Awooddu waa hab degdeg ah oo lagu qoro isku-dhufasho soo noqnoqota. Waxay leedahay laba qaybood: **saldhig** iyo **jibbaar**.",
        "Üs, tekrarlı çarpmayı hızlı yazmanın bir yoludur. İki bölümden oluşur: **taban** ve **üs**.",
        "توان د تکراري ضرب د ليکلو چټکه لاره ده. دوه برخې لري: **بنسټ** او **توان**."
      ),
    },
    // 2 — svg (no captionFr)
    {},
    // 3 — section (labelFr:"", items with aⁿ, Base, Exposant)
    {
      items: A(
        [
          "a**ⁿ** = a × a × a × … × a (**n** fois)",
          "**Base** = le nombre qu'on répète",
          "**Exposant** = le nombre de fois qu'on multiplie la base par elle-même",
        ],
        [
          "a**ⁿ** = a × a × a × … × a (**n** times)",
          "**Base** = the number repeated",
          "**Exponent** = how many times the base is multiplied by itself",
        ],
        [
          "aⁿ = a × a × a × … × a (عدد n من المرات)",
          "**الأساس** = العدد الذي نكرره",
          "**الأس** = عدد مرات ضرب الأساس في نفسه",
        ],
        [
          "aⁿ = a × a × a × … × a (n بار)",
          "**پایه** = عددی که تکرار می‌شود",
          "**نما** = تعداد دفعات ضرب پایه در خودش",
        ],
        [
          "aⁿ = a × a × a × … × a (n ግዜ)",
          "**መሰረት** = ዝድገም ቁጽሪ",
          "**ኤክስፖናንት** = መሰረት ብርእሱ ክንደይ ግዜ ከምዝበዝሕ",
        ],
        [
          "aⁿ = a × a × a × … × a (n разів)",
          "**Основа** = число, яке повторюється",
          "**Показник** = скільки разів основу множать саму на себе",
        ],
        [
          "aⁿ = a × a × a × … × a (n vezes)",
          "**Base** = o número que se repete",
          "**Expoente** = quantas vezes se multiplica a base por ela própria",
        ],
        [
          "aⁿ = a × a × a × … × a (n jeer)",
          "**Saldhig** = tirada la celceliyo",
          "**Jibbaar** = inta jeer ee saldhigga la isku dhufto",
        ],
        [
          "aⁿ = a × a × a × … × a (n kez)",
          "**Taban** = tekrarlanan sayı",
          "**Üs** = tabanın kendisiyle kaç kez çarpıldığı",
        ],
        [
          "aⁿ = a × a × a × … × a (n ځله)",
          "**بنسټ** = تکرارېدونکی عدد",
          "**توان** = بنسټ څو ځله په خپل ځان ضربېږي",
        ]
      ),
    },
    // 4 — plain "Pour 2³ , On dit : 2 à la puissance 3."
    {
      text: S(
        "Pour 2³ , On dit : 2 à la puissance 3.",
        "For 2³, we say: 2 to the power of 3.",
        "للعبارة 2³ نقول: 2 أس 3.",
        "برای 2³ می‌گوییم: 2 به توان 3.",
        "ንዝኾነ 2³ ንብሎ፦ 2 ናብ ሓይሊ 3።",
        "Для 2³ кажемо: 2 у степені 3.",
        "Para 2³, diz-se: 2 elevado à potência 3.",
        "Xaaladda 2³, waxaa la yiraahda: 2 awoodda 3.",
        "2³ için şunu söyleriz: 2 üzeri 3.",
        "د 2³ لپاره وايو: 2 د 3 توان."
      ),
    },
    // 5 — heading "Cas particuliers importants"
    {
      text: S(
        "Cas particuliers importants",
        "Important special cases",
        "حالات خاصة مهمة",
        "حالت‌های ویژه مهم",
        "ፍሉያት ኣገደስቲ ኩነታት",
        "Важливі особливі випадки",
        "Casos particulares importantes",
        "Xaalado gaar ah oo muhiim ah",
        "Önemli özel durumlar",
        "مهم ځانګړي حالتونه"
      ),
    },
    // 6 — plain "1. Tout nombre à la puissance 1..."
    {
      text: S(
        "**1.** Tout nombre à la **puissance 1** est lui-même : 5**¹** = 5",
        "**1.** Any number to the **power 1** is itself: 5**¹** = 5",
        "**1.** أي عدد أسه **1** يساوي نفسه: 5**¹** = 5",
        "**1.** هر عدد به **توان 1** خودش است: 5**¹** = 5",
        "**1.** ዝኾነ ቁጽሪ ብ**ሓይሊ 1** ርእሱ እዩ፦ 5**¹** = 5",
        "**1.** Будь-яке число в **степені 1** дорівнює самому собі: 5**¹** = 5",
        "**1.** Qualquer número elevado à **potência 1** é ele próprio: 5**¹** = 5",
        "**1.** Tiro kasta oo **awooddeeda tahay 1** waa tiradaas lafteeda: 5**¹** = 5",
        "**1.** **1.** kuvvetteki her sayı kendisidir: 5**¹** = 5",
        "**1.** هر عدد د **1 توان** سره خپل ځان دی: 5**¹** = 5"
      ),
    },
    // 7 — plain "2. Tout nombre (≠ 0) à la puissance 0..."
    {
      text: S(
        "**2.** Tout nombre (≠ 0) à la **puissance 0** vaut 1 : 7**⁰** = 1",
        "**2.** Any number (≠ 0) to the **power 0** equals 1: 7**⁰** = 1",
        "**2.** أي عدد (≠ 0) أسه **0** يساوي 1: 7**⁰** = 1",
        "**2.** هر عدد (≠ 0) به **توان 0** برابر 1 است: 7**⁰** = 1",
        "**2.** ዜሮ ዘይኮነ ቁጽሪ ብ**ሓይሊ 0** ማዕረ 1 እዩ፦ 7**⁰** = 1",
        "**2.** Будь-яке число (≠ 0) в **степені 0** дорівнює 1: 7**⁰** = 1",
        "**2.** Qualquer número (≠ 0) elevado à **potência 0** vale 1: 7**⁰** = 1",
        "**2.** Tiro kasta (≠ 0) oo **awooddeeda tahay 0** waxay noqotaa 1: 7**⁰** = 1",
        "**2.** Sıfır olmayan her sayının **0.** kuvveti 1'dir: 7**⁰** = 1",
        "**2.** هر عدد (≠ 0) د **0 توان** سره 1 دی: 7**⁰** = 1"
      ),
    },
    // 8 — highlight "Attention"
    {
      text: S(
        "Attention",
        "Warning",
        "تنبيه",
        "توجه",
        "ተጠንቀቕ",
        "Увага",
        "Atenção",
        "Taxaddar",
        "Dikkat",
        "پام"
      ),
    },
    // 9 — plain "La puissance est une multiplication répétée..."
    {
      text: S(
        "La puissance est une multiplication répétée, pas une multiplication simple.",
        "A power is repeated multiplication, not simple multiplication.",
        "الأس ضرب متكرر وليس ضربا بسيطا.",
        "توان ضرب تکراری است، نه ضرب ساده.",
        "ሓይሊ ተደጋጋሚ ምብዛሕ እዩ፣ ቀሊል ምብዛሕ ኣይኮነን።",
        "Степінь — це повторене множення, а не звичайне множення.",
        "Uma potência é uma multiplicação repetida, não uma multiplicação simples.",
        "Awooddu waa isku-dhufasho soo noqnoqota, ma aha isku-dhufasho fudud.",
        "Üs, tekrarlı çarpmadır; basit çarpma değildir.",
        "توان تکراري ضرب دی، ساده ضرب نه دی."
      ),
    },
    // 10 — section (items: ["2³ ≠ 2 × 3"]) — pure math
    {},
    // 11 — highlight "Attention aux signes"
    {
      text: S(
        "Attention aux signes",
        "Watch out for signs",
        "انتبه للإشارات",
        "به علامت‌ها توجه کن",
        "ኣብ ምልክታት ተጠንቀቕ",
        "Увага до знаків",
        "Atenção aos sinais",
        "Xerooyinka u taxaddar",
        "İşaretlere dikkat",
        "د نښو خبرداری"
      ),
    },
    // 12 — plain "Les parenthèses changent le résultat."
    {
      text: S(
        "Les parenthèses changent le résultat.",
        "Parentheses change the result.",
        "الأقواس تغير النتيجة.",
        "پرانتزها نتیجه را تغییر می‌دهند.",
        "ቅርሱስ ውጽኢት ይቕይሩ።",
        "Дужки змінюють результат.",
        "Os parênteses mudam o resultado.",
        "Xigashada waxay beddelaan natiijooyinka.",
        "Parantezler sonucu değiştirir.",
        "قوسونه پايله بدلوي."
      ),
    },
    // 13 — section (items: ["(−2)² = (−2) × (−2) = 4"]) — pure math
    {},
    // 14 — plain "mais ..."
    {
      text: S(
        "mais ...",
        "but ...",
        "لكن ...",
        "اما ...",
        "ግን ...",
        "але ...",
        "mas ...",
        "laakiin ...",
        "fakat ...",
        "خو ..."
      ),
    },
    // 15 — section (items: ["−2² = −(2 × 2) = −4"]) — pure math
    {},
    // 16 — plain "" (spacer)
    {},
    // 17 — table (headers + rows with special-case text)
    {
      headers: A(
        ["Expression", "Développement", "Résultat"],
        ["Expression", "Expanded form", "Result"],
        ["العبارة", "النشر", "النتيجة"],
        ["عبارت", "گسترش", "نتیجه"],
        ["ሓረግ", "ምዝርጋሕ", "ውጽኢት"],
        ["Вираз", "Розклад", "Результат"],
        ["Expressão", "Desenvolvimento", "Resultado"],
        ["Weedh", "Fidinta", "Natiijo"],
        ["İfade", "Açılım", "Sonuç"],
        ["عبارت", "پراختيا", "پايله"]
      ),
      items: A(
        [
          "2³ | 2 × 2 × 2 | 8",
          "3² | 3 × 3 | 9",
          "4³ | 4 × 4 × 4 | 64",
          "5⁰ | 1 (cas particulier) | 1",
          "6¹ | 6 (cas particulier) | 6",
        ],
        [
          "2³ | 2 × 2 × 2 | 8",
          "3² | 3 × 3 | 9",
          "4³ | 4 × 4 × 4 | 64",
          "5⁰ | 1 (special case) | 1",
          "6¹ | 6 (special case) | 6",
        ],
        [
          "2³ | 2 × 2 × 2 | 8",
          "3² | 3 × 3 | 9",
          "4³ | 4 × 4 × 4 | 64",
          "5⁰ | 1 (حالة خاصة) | 1",
          "6¹ | 6 (حالة خاصة) | 6",
        ],
        [
          "2³ | 2 × 2 × 2 | 8",
          "3² | 3 × 3 | 9",
          "4³ | 4 × 4 × 4 | 64",
          "5⁰ | 1 (حالت ویژه) | 1",
          "6¹ | 6 (حالت ویژه) | 6",
        ],
        [
          "2³ | 2 × 2 × 2 | 8",
          "3² | 3 × 3 | 9",
          "4³ | 4 × 4 × 4 | 64",
          "5⁰ | 1 (ፍሉይ ኩነት) | 1",
          "6¹ | 6 (ፍሉይ ኩነት) | 6",
        ],
        [
          "2³ | 2 × 2 × 2 | 8",
          "3² | 3 × 3 | 9",
          "4³ | 4 × 4 × 4 | 64",
          "5⁰ | 1 (особливий випадок) | 1",
          "6¹ | 6 (особливий випадок) | 6",
        ],
        [
          "2³ | 2 × 2 × 2 | 8",
          "3² | 3 × 3 | 9",
          "4³ | 4 × 4 × 4 | 64",
          "5⁰ | 1 (caso particular) | 1",
          "6¹ | 6 (caso particular) | 6",
        ],
        [
          "2³ | 2 × 2 × 2 | 8",
          "3² | 3 × 3 | 9",
          "4³ | 4 × 4 × 4 | 64",
          "5⁰ | 1 (xaalad gaar ah) | 1",
          "6¹ | 6 (xaalad gaar ah) | 6",
        ],
        [
          "2³ | 2 × 2 × 2 | 8",
          "3² | 3 × 3 | 9",
          "4³ | 4 × 4 × 4 | 64",
          "5⁰ | 1 (özel durum) | 1",
          "6¹ | 6 (özel durum) | 6",
        ],
        [
          "2³ | 2 × 2 × 2 | 8",
          "3² | 3 × 3 | 9",
          "4³ | 4 × 4 × 4 | 64",
          "5⁰ | 1 (ځانګړی حالت) | 1",
          "6¹ | 6 (ځانګړی حالت) | 6",
        ]
      ),
    },
  ],
  consignes: {
    "Calculez la puissance des nombres.": { fr: "Calculez la puissance des nombres.", en: "Calculate the powers of the numbers.", ar: "احسب قوى الأعداد.", fa: "توان اعداد را حساب کنید.", ti: "ናይ ቁጽርታት ሓይሊ ኣስብ።", uk: "Обчисліть степені чисел.", pt: "Calcule as potências dos números.", so: "Xisaabi awoodaha tirooyinka.", tr: "Sayıların üslerini hesaplayın.", ps: "د شمېرو توانونه محاسبه کړئ." },
    "Complétez avec la puissance.": { fr: "Complétez avec la puissance.", en: "Complete with the power.", ar: "أكمل بالأس.", fa: "با توان کامل کنید.", ti: "ብሓይሊ ምላእ።", uk: "Доповніть степенем.", pt: "Complete com a potência.", so: "Ku buuxi awoodda.", tr: "Üs ile tamamlayın.", ps: "د توان سره بشپړ کړئ." },
    "Retrouvez la base.": { fr: "Retrouvez la base.", en: "Find the base.", ar: "أوجد الأساس.", fa: "پایه را بیابید.", ti: "መሰረት ርከብ።", uk: "Знайдіть основу.", pt: "Encontre a base.", so: "Hel saldhigga.", tr: "Tabanı bulun.", ps: "بنسټ ومومئ." },
    "Comparez les puissances.": { fr: "Comparez les puissances.", en: "Compare the powers.", ar: "قارن القوى.", fa: "توان‌ها را مقایسه کنید.", ti: "ሓይልታት ኣነጻጽር።", uk: "Порівняйте степені.", pt: "Compare as potências.", so: "Isbarbardhig awoodaha.", tr: "Üsleri karşılaştırın.", ps: "توانونه پرتله کړئ." },
    "Classez les puissances par ordre croissant.": { fr: "Classez les puissances par ordre croissant.", en: "Order the powers from smallest to largest.", ar: "رتّب القوى تصاعدياً.", fa: "توان‌ها را به ترتیب صعودی مرتب کنید.", ti: "ሓይልታት ብዝዓበየ ስርዓት ኣሰላስል።", uk: "Упорядкуйте степені за зростанням.", pt: "Ordene as potências por ordem crescente.", so: "Awoodaha u kala saar sida ugu yar ilaa ugu weyn.", tr: "Üsleri artan sıraya koyun.", ps: "توانونه په زیاتیدونکي ترتیب کې واچوئ." },
  },
};
