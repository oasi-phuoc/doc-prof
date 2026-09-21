import type { SubmoduleTrad } from "./trad-types";

export const TRAD_A1_5: SubmoduleTrad = {
  submoduleId: "A1-5",
  title: {
    fr: "Suites numériques",
    en: "Number sequences",
    ar: "المتتاليات العددية",
    fa: "دنباله‌های عددی",
    ti: "ናይ ቁጽሪ ተኸታታሊ",
    uk: "Числові послідовності",
    pt: "Sequências numéricas",
    so: "Taxanaha tirooyinka",
    tr: "Sayi dizileri",
    ps: "د عددونو لړۍ",
  },
  blocks: [
    // 0: plain "Une suite de nombres est une liste ordonnée..."
    {
      text: {
        fr: "Une suite de nombres est une liste ordonnée où chaque terme est obtenu en appliquant la même règle. On ajoute ou enlève toujours le même nombre.",
        en: "A number sequence is an ordered list where each term is found by applying the same rule. We always add or subtract the same number.",
        ar: "متتالية الأعداد هي قائمة مرتبة حيث يُحسب كل حد بتطبيق نفس القاعدة. نضيف أو نطرح دائمًا نفس العدد.",
        fa: "دنباله عددی فهرستی مرتب است که در آن هر جمله با اعمال همان قانون به دست می‌آید. همیشه همان عدد را اضافه یا کم می‌کنیم.",
        ti: "ተኸታታሊ ቁጽሪ ስርዓታዊ ዝርዝር እዩ፤ ነፍሲ ወከፍ ቁጽሪ ብሓደ ሕጊ ይርከብ። ኩሉ ጊዜ ሓደ ቁጽሪ ንውስኸሉ ወይ ነቀሉ።",
        uk: "Числова послідовність — це впорядкований список, де кожен член знаходиться за однаковим правилом. Ми завжди додаємо або віднімаємо те саме число.",
        pt: "Uma sequência numérica é uma lista ordenada em que cada termo é obtido aplicando a mesma regra. Sempre adicionamos ou subtraímos o mesmo número.",
        so: "Taxane tiro waa liis nidaamsan; xubin kasta waxaa lagu helaa isla xeerka. Mar walba waxaan ku darnaa ama ka jarnnaa tiro isku mid ah.",
        tr: "Sayi dizisi, her terimin ayni kuralla bulundugu sirali bir listedir. Her zaman ayni sayiyi ekler ya da cikaririz.",
        ps: "د عددونو لړۍ منظم لېست دی چې هر غړی يې د يوې قاعدې له مخې پيدا کېږي. تل يو شان عدد جمع يا منفي کوو.",
      },
    },
    // 1: plain "Pour comprendre une suite..."
    {
      text: {
        fr: "Pour comprendre une suite, on regarde ce qui change entre les nombres.",
        en: "To understand a sequence, we look at what changes between the numbers.",
        ar: "لفهم متتالية، ننظر إلى ما يتغير بين الأعداد.",
        fa: "برای درک یک دنباله، به آنچه بین اعداد تغییر می‌کند نگاه می‌کنیم.",
        ti: "ተኸታታሊ ንምርዳእ፡ ኣብ መንካይ ቁጽርታት ዝቕየር ነዕዘብ።",
        uk: "Щоб зрозуміти послідовність, дивимось, що змінюється між числами.",
        pt: "Para entender uma sequência, observamos o que muda entre os números.",
        so: "Si taxane loo fahmo, waxaan eegnaa waxa tirooyinka dhexdooda iska beddelaya.",
        tr: "Bir diziyi anlamak icin sayilar arasinda neyin degistigine bakariz.",
        ps: "د لړۍ د پوهېدو لپاره ګورو چې د عددونو ترمنځ څه بدلېږي.",
      },
    },
    // 2: highlight "Exemple"
    {
      text: {
        fr: "Exemple",
        en: "Example",
        ar: "مثال",
        fa: "مثال",
        ti: "ኣብነት",
        uk: "Приклад",
        pt: "Exemplo",
        so: "Tusaale",
        tr: "Ornek",
        ps: "بېلګه",
      },
    },
    // 3: plain "5 ; 8 ; 11 ; 14" — no translation (numbers)
    {},
    // 4: section items about adding 3
    {
      items: {
        fr: [
          "On ajoute toujours 3.",
          "La règle pour trouver le nombre suivant est : nombre + 3",
        ],
        en: [
          "We always add 3.",
          "The rule to find the next number is: number + 3",
        ],
        ar: [
          "نضيف دائمًا 3.",
          "القاعدة لإيجاد العدد التالي: العدد + 3",
        ],
        fa: [
          "همیشه 3 اضافه می‌کنیم.",
          "قانون برای یافتن عدد بعدی: عدد + 3",
        ],
        ti: [
          "ኩሉ ጊዜ 3 ንውስኽ።",
          "ሕጊ ናብ ዝቕጽል ቁጽሪ: ቁጽሪ + 3",
        ],
        uk: [
          "Ми завжди додаємо 3.",
          "Правило знаходження наступного числа: число + 3",
        ],
        pt: [
          "Adicionamos sempre 3.",
          "A regra para encontrar o número seguinte é: número + 3",
        ],
        so: [
          "Mar walba 3 ayaan ku darnaa.",
          "Xeerka tirada xigta waa: tiro + 3",
        ],
        tr: [
          "Her zaman 3 ekleriz.",
          "Sonraki sayiyi bulma kurali: sayi + 3",
        ],
        ps: [
          "تل 3 ورزیاتوو.",
          "د بل عدد د موندلو قاعده: عدد + 3",
        ],
      },
    },
    // 5: highlight "Suite croissante"
    {
      text: {
        fr: "Suite croissante",
        en: "Increasing sequence",
        ar: "متتالية تصاعدية",
        fa: "دنباله صعودی",
        ti: "ዝዓቢ ተኸታታሊ",
        uk: "Зростаюча послідовність",
        pt: "Sequência crescente",
        so: "Taxane kordhaya",
        tr: "Artan dizi",
        ps: "زیاتېدونکې لړۍ",
      },
    },
    // 6: section items
    {
      items: {
        fr: ["Les nombres augmentent : 1 ; 3 ; 5 ; 7 ."],
        en: ["Numbers increase: 1 ; 3 ; 5 ; 7 ."],
        ar: ["الأعداد تتزايد: 1 ؛ 3 ؛ 5 ؛ 7 ."],
        fa: ["اعداد افزایش می‌یابند: 1 ؛ 3 ؛ 5 ؛ 7 ."],
        ti: ["ቁጽርታት ይዓብዩ: 1 ؛ 3 ؛ 5 ؛ 7 ."],
        uk: ["Числа зростають: 1 ; 3 ; 5 ; 7 ."],
        pt: ["Os números aumentam: 1 ; 3 ; 5 ; 7 ."],
        so: [
          "Tirooyinku way kordhaan: 1 ; 3 ; 5 ; 7 .",
        ],
        tr: [
          "Sayilar artar: 1 ; 3 ; 5 ; 7 .",
        ],
        ps: [
          "عددونه زياتېږي: 1 ; 3 ; 5 ; 7 .",
        ],
      },
    },
    // 7: highlight "Suite décroissante"
    {
      text: {
        fr: "Suite décroissante",
        en: "Decreasing sequence",
        ar: "متتالية تنازلية",
        fa: "دنباله نزولی",
        ti: "ዝነኪ ተኸታታሊ",
        uk: "Спадна послідовність",
        pt: "Sequência decrescente",
        so: "Taxane yaraanaya",
        tr: "Azalan dizi",
        ps: "کمېدونکې لړۍ",
      },
    },
    // 8: section items
    {
      items: {
        fr: ["Les nombres diminuent : 20 ; 15 ; 10 ; 5 ."],
        en: ["Numbers decrease: 20 ; 15 ; 10 ; 5 ."],
        ar: ["الأعداد تتناقص: 20 ؛ 15 ؛ 10 ؛ 5 ."],
        fa: ["اعداد کاهش می‌یابند: 20 ؛ 15 ؛ 10 ؛ 5 ."],
        ti: ["ቁጽርታት ይንኪ: 20 ؛ 15 ؛ 10 ؛ 5 ."],
        uk: ["Числа спадають: 20 ; 15 ; 10 ; 5 ."],
        pt: ["Os números diminuem: 20 ; 15 ; 10 ; 5 ."],
        so: [
          "Tirooyinku way yaraadaan: 20 ; 15 ; 10 ; 5 .",
        ],
        tr: [
          "Sayilar azalir: 20 ; 15 ; 10 ; 5 .",
        ],
        ps: [
          "عددونه کمېږي: 20 ; 15 ; 10 ; 5 .",
        ],
      },
    },
  ],
  consignes: {
    "a1-5-ep01": { fr: "Trouvez le terme suivant : 5, 10, 15, 20, ?", en: "Find le terme suivant : 5, 10, 15, 20, ?", ar: "أوجد le terme suivant : 5, 10, 15, 20, ?", fa: "بیابید le terme suivant : 5, 10, 15, 20, ?", ti: "Find le terme suivant : 5, 10, 15, 20, ?", uk: "Знайдіть le terme suivant : 5, 10, 15, 20, ?", pt: "Encontre le terme suivant : 5, 10, 15, 20, ?", so: "Find le terme suivant : 5, 10, 15, 20, ?", tr: "Bulun le terme suivant : 5, 10, 15, 20, ?", ps: "Find le terme suivant : 5, 10, 15, 20, ?" },
    "a1-5-ep02": { fr: "Trouvez le terme suivant : 100, 90, 80, 70, ?", en: "Find le terme suivant : 100, 90, 80, 70, ?", ar: "أوجد le terme suivant : 100, 90, 80, 70, ?", fa: "بیابید le terme suivant : 100, 90, 80, 70, ?", ti: "Find le terme suivant : 100, 90, 80, 70, ?", uk: "Знайдіть le terme suivant : 100, 90, 80, 70, ?", pt: "Encontre le terme suivant : 100, 90, 80, 70, ?", so: "Find le terme suivant : 100, 90, 80, 70, ?", tr: "Bulun le terme suivant : 100, 90, 80, 70, ?", ps: "Find le terme suivant : 100, 90, 80, 70, ?" },
    "a1-5-ep03": { fr: "Trouvez le terme suivant : 3, 6, 9, 12, ?", en: "Find le terme suivant : 3, 6, 9, 12, ?", ar: "أوجد le terme suivant : 3, 6, 9, 12, ?", fa: "بیابید le terme suivant : 3, 6, 9, 12, ?", ti: "Find le terme suivant : 3, 6, 9, 12, ?", uk: "Знайдіть le terme suivant : 3, 6, 9, 12, ?", pt: "Encontre le terme suivant : 3, 6, 9, 12, ?", so: "Find le terme suivant : 3, 6, 9, 12, ?", tr: "Bulun le terme suivant : 3, 6, 9, 12, ?", ps: "Find le terme suivant : 3, 6, 9, 12, ?" },
    "a1-5-ep04": { fr: "Trouvez le terme suivant : 50, 100, 150, 200, ?", en: "Find le terme suivant : 50, 100, 150, 200, ?", ar: "أوجد le terme suivant : 50, 100, 150, 200, ?", fa: "بیابید le terme suivant : 50, 100, 150, 200, ?", ti: "Find le terme suivant : 50, 100, 150, 200, ?", uk: "Знайдіть le terme suivant : 50, 100, 150, 200, ?", pt: "Encontre le terme suivant : 50, 100, 150, 200, ?", so: "Find le terme suivant : 50, 100, 150, 200, ?", tr: "Bulun le terme suivant : 50, 100, 150, 200, ?", ps: "Find le terme suivant : 50, 100, 150, 200, ?" },
    "a1-5-ep05": { fr: "Trouvez le terme suivant : 1 000, 900, 800, 700, ?", en: "Find le terme suivant : 1 000, 900, 800, 700, ?", ar: "أوجد le terme suivant : 1 000, 900, 800, 700, ?", fa: "بیابید le terme suivant : 1 000, 900, 800, 700, ?", ti: "Find le terme suivant : 1 000, 900, 800, 700, ?", uk: "Знайдіть le terme suivant : 1 000, 900, 800, 700, ?", pt: "Encontre le terme suivant : 1 000, 900, 800, 700, ?", so: "Find le terme suivant : 1 000, 900, 800, 700, ?", tr: "Bulun le terme suivant : 1 000, 900, 800, 700, ?", ps: "Find le terme suivant : 1 000, 900, 800, 700, ?" },
    "a1-5-ep06": { fr: "Trouvez le terme manquant : 4, 8, ?, 16, 20", en: "Find le terme manquant : 4, 8, ?, 16, 20", ar: "أوجد le terme manquant : 4, 8, ?, 16, 20", fa: "بیابید le terme manquant : 4, 8, ?, 16, 20", ti: "Find le terme manquant : 4, 8, ?, 16, 20", uk: "Знайдіть le terme manquant : 4, 8, ?, 16, 20", pt: "Encontre le terme manquant : 4, 8, ?, 16, 20", so: "Find le terme manquant : 4, 8, ?, 16, 20", tr: "Bulun le terme manquant : 4, 8, ?, 16, 20", ps: "Find le terme manquant : 4, 8, ?, 16, 20" },
    "a1-5-ep07": { fr: "Trouvez le terme suivant : 25, 50, 75, 100, ?", en: "Find le terme suivant : 25, 50, 75, 100, ?", ar: "أوجد le terme suivant : 25, 50, 75, 100, ?", fa: "بیابید le terme suivant : 25, 50, 75, 100, ?", ti: "Find le terme suivant : 25, 50, 75, 100, ?", uk: "Знайдіть le terme suivant : 25, 50, 75, 100, ?", pt: "Encontre le terme suivant : 25, 50, 75, 100, ?", so: "Find le terme suivant : 25, 50, 75, 100, ?", tr: "Bulun le terme suivant : 25, 50, 75, 100, ?", ps: "Find le terme suivant : 25, 50, 75, 100, ?" },
    "a1-5-ep08": { fr: "Trouvez le terme manquant : 30, 25, ?, 15, 10", en: "Find le terme manquant : 30, 25, ?, 15, 10", ar: "أوجد le terme manquant : 30, 25, ?, 15, 10", fa: "بیابید le terme manquant : 30, 25, ?, 15, 10", ti: "Find le terme manquant : 30, 25, ?, 15, 10", uk: "Знайдіть le terme manquant : 30, 25, ?, 15, 10", pt: "Encontre le terme manquant : 30, 25, ?, 15, 10", so: "Find le terme manquant : 30, 25, ?, 15, 10", tr: "Bulun le terme manquant : 30, 25, ?, 15, 10", ps: "Find le terme manquant : 30, 25, ?, 15, 10" },
    "a1-5-ep09": { fr: "Trouvez le terme suivant : 2, 4, 8, 16, ?", en: "Find le terme suivant : 2, 4, 8, 16, ?", ar: "أوجد le terme suivant : 2, 4, 8, 16, ?", fa: "بیابید le terme suivant : 2, 4, 8, 16, ?", ti: "Find le terme suivant : 2, 4, 8, 16, ?", uk: "Знайдіть le terme suivant : 2, 4, 8, 16, ?", pt: "Encontre le terme suivant : 2, 4, 8, 16, ?", so: "Find le terme suivant : 2, 4, 8, 16, ?", tr: "Bulun le terme suivant : 2, 4, 8, 16, ?", ps: "Find le terme suivant : 2, 4, 8, 16, ?" },
    "a1-5-ep10": { fr: "Trouvez le terme suivant : 200, 400, 600, 800, ?", en: "Find le terme suivant : 200, 400, 600, 800, ?", ar: "أوجد le terme suivant : 200, 400, 600, 800, ?", fa: "بیابید le terme suivant : 200, 400, 600, 800, ?", ti: "Find le terme suivant : 200, 400, 600, 800, ?", uk: "Знайдіть le terme suivant : 200, 400, 600, 800, ?", pt: "Encontre le terme suivant : 200, 400, 600, 800, ?", so: "Find le terme suivant : 200, 400, 600, 800, ?", tr: "Bulun le terme suivant : 200, 400, 600, 800, ?", ps: "Find le terme suivant : 200, 400, 600, 800, ?" },
    "a1-5-ep11": { fr: "Trouvez le terme manquant : 10, 20, 30, ?, 50", en: "Find le terme manquant : 10, 20, 30, ?, 50", ar: "أوجد le terme manquant : 10, 20, 30, ?, 50", fa: "بیابید le terme manquant : 10, 20, 30, ?, 50", ti: "Find le terme manquant : 10, 20, 30, ?, 50", uk: "Знайдіть le terme manquant : 10, 20, 30, ?, 50", pt: "Encontre le terme manquant : 10, 20, 30, ?, 50", so: "Find le terme manquant : 10, 20, 30, ?, 50", tr: "Bulun le terme manquant : 10, 20, 30, ?, 50", ps: "Find le terme manquant : 10, 20, 30, ?, 50" },
    "a1-5-ep12": { fr: "Trouvez le terme suivant : 7, 14, 21, 28, ?", en: "Find le terme suivant : 7, 14, 21, 28, ?", ar: "أوجد le terme suivant : 7, 14, 21, 28, ?", fa: "بیابید le terme suivant : 7, 14, 21, 28, ?", ti: "Find le terme suivant : 7, 14, 21, 28, ?", uk: "Знайдіть le terme suivant : 7, 14, 21, 28, ?", pt: "Encontre le terme suivant : 7, 14, 21, 28, ?", so: "Find le terme suivant : 7, 14, 21, 28, ?", tr: "Bulun le terme suivant : 7, 14, 21, 28, ?", ps: "Find le terme suivant : 7, 14, 21, 28, ?" },
    ordering_asc: {
      fr: "Classez les nombres dans l'ordre croissant (du plus petit au plus grand).",
      en: "Sort the numbers in ascending order (from smallest to largest).",
      ar: "رتّب الأعداد تصاعديًا (من الأصغر إلى الأكبر).",
      fa: "اعداد را به ترتیب صعودی (از کوچک‌ترین به بزرگ‌ترین) مرتب کنید.",
      ti: "ቁጽርታት ካብ ንእሽቶ ናብ ዓቢ ሰልፍ።",
      uk: "Упорядкуй числа у порядку зростання (від найменшого до найбільшого).",
      pt: "Ordena os números de forma crescente (do menor para o maior).",
      so: "Tirooyinka u kala saar kor u kaca (ka yar ilaa ka weyn).",
      tr: "Sayilari artan siraya koy (kucukten buyuge).",
      ps: "عددونه په زياتېدونکي ترتيب کې کېږده (له کوچني تر لوی).",
    },
    ordering_desc: {
      fr: "Classez les nombres dans l'ordre décroissant (du plus grand au plus petit).",
      en: "Sort the numbers in descending order (from largest to smallest).",
      ar: "رتّب الأعداد تنازليًا (من الأكبر إلى الأصغر).",
      fa: "اعداد را به ترتیب نزولی (از بزرگ‌ترین به کوچک‌ترین) مرتب کنید.",
      ti: "ቁጽርታት ካብ ዓቢ ናብ ንእሽቶ ሰልፍ።",
      uk: "Упорядкуй числа у порядку спадання (від найбільшого до найменшого).",
      pt: "Ordena os números de forma decrescente (do maior para o menor).",
      so: "Tirooyinka u kala saar hoos u dhaca (ka weyn ilaa ka yar).",
      tr: "Sayilari azalan siraya koy (buyukten kucuge).",
      ps: "عددونه په کمېدونکي ترتيب کې کېږده (له لوی تر کوچني).",
    },
    seq_rule: {
      fr: "Trouvez la règle de chaque suite (ex: +5 ou -3).",
      en: "Find the rule for each sequence (e.g.: +5 or -3).",
      ar: "اكتشف قاعدة كل متتالية (مثال: +5 أو -3).",
      fa: "قانون هر دنباله را پیدا کنید (مثلاً: +5 یا -3).",
      ti: "ሕጊ ናይ ነፍሲ ወከፍ ተኸታታሊ ፈልጥ (ኣብነት: +5 ወይ -3).",
      uk: "Знайди правило кожної послідовності (напр.: +5 або -3).",
      pt: "Encontra a regra de cada sequência (ex.: +5 ou -3).",
      so: "Xeerka taxane kasta hel (tusaale: +5 ama -3).",
      tr: "Her dizinin kuralini bul (orn: +5 veya -3).",
      ps: "د هرې لړۍ قاعده پيدا کړه (لکه: +5 يا -3).",
    },
    seq_complete: {
      fr: "Complétez les suites de nombres.",
      en: "Complete the number sequences.",
      ar: "أكمل متتاليات الأعداد.",
      fa: "دنباله‌های عددی را کامل کنید.",
      ti: "ተኸታታሊ ቁጽሪ ምሉእ ግበር።",
      uk: "Доповни числові послідовності.",
      pt: "Completa as sequências numéricas.",
      so: "Taxanaha tirooyinka buuxi.",
      tr: "Sayi dizilerini tamamla.",
      ps: "د عددونو لړۍ بشپړه کړه.",
    },
  },
};
