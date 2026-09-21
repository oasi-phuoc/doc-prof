import type { SubmoduleTrad } from "./trad-types";

const S = (fr: string, en: string, ar: string, fa: string, ti: string, uk: string, pt: string, so: string, tr: string, ps: string) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });
const A = (fr: string[], en: string[], ar: string[], fa: string[], ti: string[], uk: string[], pt: string[], so: string[], tr: string[], ps: string[]) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

export const TRAD_A8_3: SubmoduleTrad = {
  submoduleId: "A8-3",
  title: S(
    "Puissances de 10 et notation scientifique",
    "Powers of 10 and scientific notation",
    "قوى العدد 10 والكتابة العلمية",
    "توان‌های 10 و نمادگذاری علمی",
    "ሓይልታት 10 ሳይንሳዊ ጽሕፈትን",
    "Степені числа 10 і науковий запис",
    "Potências de 10 e notação científica",
    "Awoodaha 10 iyo qorista cilmiyeed",
    "10'un kuvvetleri ve bilimsel gösterim",
    "د 10 توانونه او علمي ليکنه"
  ),
  blocks: [
    // 0 — plain "Les puissances de 10 facilitent l'écriture des grands nombres..."
    {
      text: S(
        "Les puissances de 10 facilitent l'écriture des grands nombres. Une puissance de 10 s'obtient en plaçant autant de zéros que l'exposant après le chiffre 1.",
        "Powers of 10 make large numbers easier to write. A power of 10 is obtained by placing as many zeros as the exponent after the digit 1.",
        "تسهل قوى 10 كتابة الأعداد الكبيرة. تُحصل قوة العدد 10 بوضع عدد من الأصفار يساوي الأس بعد الرقم 1.",
        "توان‌های 10 نوشتن عددهای بزرگ را آسان می‌کنند. توان 10 با قرار دادن به تعداد نما صفر بعد از عدد 1 به دست می‌آید.",
        "ሓይልታት 10 ዓበይቲ ቁጽርታት ንምጽሓፍ የቃልሉ። ሓይሊ 10 ድሕሪ 1 ከም ኤክስፖናንት ብዝኾነ ብዙሕ ዜሮ ብምውሳኽ ይርከብ።",
        "Степені 10 полегшують запис великих чисел. Степінь 10 отримують, записуючи після цифри 1 стільки нулів, скільки показує показник.",
        "As potências de 10 facilitam a escrita de números grandes. Uma potência de 10 obtém-se colocando tantos zeros quanto o expoente após o algarismo 1.",
        "Awoodaha 10 waxay fududeeyaan qorista tirooyinka waaweyn. Awood 10 ah waxaa la helaa iyadoo 1 ka dib la dhigo eberro u dhigma jibbaarka.",
        "10'un kuvvetleri büyük sayıları yazmayı kolaylaştırır. 10'un kuvveti, 1 rakamından sonra üs kadar sıfır yazılarak elde edilir.",
        "د 10 توانونه د لويو عددونو ليکل اسانه کوي. د 10 توان د 1 وروسته د توان په اندازه صفرونو له اېښودلو جوړېږي."
      ),
    },
    // 1 — table (headers: Puissance, Valeur, Nombre de zéros — rows: pure math/numbers)
    {
      headers: A(
        ["Puissance", "Valeur", "Nombre de zéros"],
        ["Power", "Value", "Number of zeros"],
        ["القوة", "القيمة", "عدد الأصفار"],
        ["توان", "مقدار", "تعداد صفرها"],
        ["ሓይሊ", "ዋጋ", "ብዝሒ ዜሮታት"],
        ["Степінь", "Значення", "Кількість нулів"],
        ["Potência", "Valor", "Número de zeros"],
        ["Awood", "Qiime", "Tirada eberrada"],
        ["Kuvvet", "Değer", "Sıfır sayısı"],
        ["توان", "ارزښت", "د صفرونو شمېر"]
      ),
    },
    // 2 — plain "" (spacer)
    {},
    // 3 — heading "Puissances de 10 négatives"
    {
      text: S(
        "Puissances de 10 négatives",
        "Negative powers of 10",
        "القوى السالبة للعدد 10",
        "توان‌های منفی 10",
        "ኣሉታዊ ሓይልታት 10",
        "Від'ємні степені числа 10",
        "Potências negativas de 10",
        "Awoodaha taban ee 10",
        "10'un negatif kuvvetleri",
        "د 10 منفي توانونه"
      ),
    },
    // 4 — plain "Les puissances négatives de 10 donnent des nombres décimaux (inférieurs à 1)."
    {
      text: S(
        "Les puissances négatives de 10 donnent des nombres décimaux (inférieurs à 1).",
        "Negative powers of 10 give decimal numbers (less than 1).",
        "القوى السالبة للعدد 10 تعطي أعدادًا عشرية (أقل من 1).",
        "توان‌های منفی 10 عددهای اعشاری (کوچک‌تر از 1) می‌دهند.",
        "ኣሉታዊ ሓይልታት 10 ካብ 1 ዝንእሱ ዲሲማል ቁጽርታት ይህቡ።",
        "Від'ємні степені 10 дають десяткові числа (менші за 1).",
        "As potências negativas de 10 dão números decimais (inferiores a 1).",
        "Awoodaha taban ee 10 waxay bixiyaan tirooyin jajab tobanle ah (oo ka yar 1).",
        "10'un negatif kuvvetleri ondalık sayılar (1'den küçük) verir.",
        "د 10 منفي توانونه اعشاري عددونه (له 1 لږ) ورکوي."
      ),
    },
    // 5 — table (headers: Puissance, Valeur, Lecture — rows have French text "un dixième" etc.)
    {
      headers: A(
        ["Puissance", "Valeur", "Lecture"],
        ["Power", "Value", "Reading"],
        ["القوة", "القيمة", "القراءة"],
        ["توان", "مقدار", "خواندن"],
        ["ሓይሊ", "ዋጋ", "ምንባብ"],
        ["Степінь", "Значення", "Читання"],
        ["Potência", "Valor", "Leitura"],
        ["Awood", "Qiime", "Akhrinta"],
        ["Kuvvet", "Değer", "Okunuş"],
        ["توان", "ارزښت", "لوستل"]
      ),
      items: A(
        [
          "10⁻¹ | 0,1 | un dixième",
          "10⁻² | 0,01 | un centième",
          "10⁻³ | 0,001 | un millième",
        ],
        [
          "10⁻¹ | 0.1 | one tenth",
          "10⁻² | 0.01 | one hundredth",
          "10⁻³ | 0.001 | one thousandth",
        ],
        [
          "10⁻¹ | 0,1 | عُشر",
          "10⁻² | 0,01 | جزء من مئة",
          "10⁻³ | 0,001 | جزء من ألف",
        ],
        [
          "10⁻¹ | 0,1 | یک دهم",
          "10⁻² | 0,01 | یک صدم",
          "10⁻³ | 0,001 | یک هزارم",
        ],
        [
          "10⁻¹ | 0,1 | ሓደ ዓሰርተኛ",
          "10⁻² | 0,01 | ሓደ ሚኢቲኛ",
          "10⁻³ | 0,001 | ሓደ ሽሕኛ",
        ],
        [
          "10⁻¹ | 0,1 | одна десята",
          "10⁻² | 0,01 | одна сота",
          "10⁻³ | 0,001 | одна тисячна",
        ],
        [
          "10⁻¹ | 0,1 | um décimo",
          "10⁻² | 0,01 | um centésimo",
          "10⁻³ | 0,001 | um milésimo",
        ],
        [
          "10⁻¹ | 0,1 | tobanaad",
          "10⁻² | 0,01 | boqollaad",
          "10⁻³ | 0,001 | kun-laad",
        ],
        [
          "10⁻¹ | 0,1 | onda bir",
          "10⁻² | 0,01 | yüzde bir",
          "10⁻³ | 0,001 | binde bir",
        ],
        [
          "10⁻¹ | 0,1 | يو لسمه",
          "10⁻² | 0,01 | يو سلمه",
          "10⁻³ | 0,001 | يو زرمه",
        ]
      ),
    },
    // 6 — plain "" (spacer)
    {},
    // 7 — heading "Notation scientifique"
    {
      text: S(
        "Notation scientifique",
        "Scientific notation",
        "الكتابة العلمية",
        "نمادگذاری علمی",
        "ሳይንሳዊ ጽሕፈት",
        "Науковий запис",
        "Notação científica",
        "Qoris cilmiyeed",
        "Bilimsel gösterim",
        "علمي ليکنه"
      ),
    },
    // 8 — plain "La notation scientifique s'écrit sous la forme : a × 10ⁿ..."
    {
      text: S(
        "La notation scientifique s'écrit sous la forme : a × 10ⁿ, où 1 ≤ a < 10. Elle permet d'exprimer très grands et très petits nombres de façon compacte.",
        "Scientific notation is written in the form: a × 10ⁿ, where 1 ≤ a < 10. It allows very large and very small numbers to be expressed compactly.",
        "تكتب الصيغة العلمية على الشكل: a × 10ⁿ حيث 1 ≤ a < 10. وتتيح التعبير عن الأعداد الكبيرة جدًا والصغيرة جدًا بشكل مضغوط.",
        "نمادگذاری علمی به صورت: a × 10ⁿ نوشته می‌شود که در آن 1 ≤ a < 10 است. این روش بیان عددهای بسیار بزرگ و بسیار کوچک را به شکل فشرده ممکن می‌سازد.",
        "ሳይንሳዊ ጽሕፈት ብዛዕባ a × 10ⁿ ይጽሓፍ፣ 1 ≤ a < 10 እዩ። ኣዝዮም ዓበይትን ኣዝዮም ንኣሽቱን ቁጽርታት ብቑጽር ንምግላጽ ይሕግዝ።",
        "Науковий запис має вигляд: a × 10ⁿ, де 1 ≤ a < 10. Він дозволяє компактно записувати дуже великі й дуже малі числа.",
        "A notação científica escreve-se na forma: a × 10ⁿ, onde 1 ≤ a < 10. Permite exprimir números muito grandes e muito pequenos de forma compacta.",
        "Qorista cilmiyeed waxay u qoran tahay: a × 10ⁿ, halka 1 ≤ a < 10. Waxay u oggolaataa tirooyin aad u waaweyn iyo aad u yaryar in si kooban loogu qoro.",
        "Bilimsel gösterim şu biçimde yazılır: a × 10ⁿ; burada 1 ≤ a < 10. Çok büyük ve çok küçük sayıları kompakt biçimde ifade etmeyi sağlar.",
        "علمي ليکنه د دې بڼې له مخې ليکل کېږي: a × 10ⁿ، چرته چې 1 ≤ a < 10. دا ډول ډېر لويو او ډېر کوچنيو عددونو د ليکلو وسيله ده."
      ),
    },
    // 9 — section (items: pure math examples — 4 700 000 = 4,7 × 10⁶, etc.)
    {},
  ],
  consignes: {
    "Sélectionner si c'est vrai ou faux.": { fr: "Sélectionner si c'est vrai ou faux.", en: "Select whether it is true or false.", ar: "اختر صحيح أو خطأ.", fa: "درست یا نادرست را انتخاب کنید.", ti: "ሓቂ ወይ ሓሶት ምረጽ።", uk: "Оберіть правда чи хибно.", pt: "Selecione se é verdadeiro ou falso.", so: "Dooro haddii ay run tahay ama been.", tr: "Doğru veya yanlış seçin.", ps: "سم یا ناسم وټاکئ." },
    "Calculez les racines carrées.": { fr: "Calculez les racines carrées.", en: "Calculate the square roots.", ar: "احسب الجذور التربيعية.", fa: "ریشه‌های مربع را حساب کنید.", ti: "ስኩዌር ስር ኣስብ።", uk: "Обчисліть квадратні корені.", pt: "Calcule as raízes quadradas.", so: "Xisaabi xididada laba-jibbaaran.", tr: "Karekökleri hesaplayın.", ps: "مربع ریښې محاسبه کړئ." },
    "Trouvez le nombre manquant.": { fr: "Trouvez le nombre manquant.", en: "Find the missing number.", ar: "أوجد العدد الناقص.", fa: "عدد گمشده را بیابید.", ti: "ዝጎደለ ቁጽሪ ርከብ።", uk: "Знайдіть пропущене число.", pt: "Encontre o número em falta.", so: "Hel lambarka maqan.", tr: "Eksik sayıyı bulun.", ps: "ورک شمیره ومومئ." },
  },
};
