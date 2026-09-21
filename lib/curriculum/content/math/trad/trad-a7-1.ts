import type { SubmoduleTrad } from "./trad-types";

const S = (fr: string, en: string, ar: string, fa: string, ti: string, uk: string, pt: string, so: string, tr: string, ps: string) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });
const A = (fr: string[], en: string[], ar: string[], fa: string[], ti: string[], uk: string[], pt: string[], so: string[], tr: string[], ps: string[]) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

export const TRAD_A7_1: SubmoduleTrad = {
  submoduleId: "A7-1",
  title: S(
    "Notion de négatif",
    "Concept of negative numbers",
    "مفهوم الأعداد السالبة",
    "مفهوم عددهای منفی",
    "ሓሳብ ናይ ኣሉታዊ ቁጽሪ",
    "Поняття від'ємних чисел",
    "Noção de número negativo",
    "Fikradda tirooyinka taban",
    "Negatif sayı kavramı",
    "د منفي عددونو مفهوم",
  ),
  blocks: [
    // 0 — heading "Définition" black:true
    { text: S("Définition", "Definition", "تعريف", "تعریف", "ትርጉም", "Визначення", "Definição", "Qeexid", "Tanım", "تعریف") },

    // 1 — plain "Un nombre relatif a un signe + ou −."
    { text: S(
      "Un nombre relatif a un signe + ou −.",
      "A relative number has a + or − sign.",
      "للعدد النسبي إشارة + أو −.",
      "یک عدد نسبی علامت + یا − دارد.",
      "ተዛማዲ ቁጽሪ ምልክት + ወይ − ኣለዎ።",
      "Відносне число має знак + або −.",
      "Um número relativo tem sinal + ou −.",
      "Tiro xiriir leh waxay leedahay calaamad + ama −.",
      "İşaretli bir sayının + veya − işareti vardır.",
      "نسبي عدد د + يا − نښه لري.",
    ) },

    // 2 — plain "" spacer
    {},

    // 3 — plain "Positif"
    { text: S("Positif", "Positive", "موجب", "مثبت", "ኣዎንታዊ", "Додатне", "Positivo", "Togan", "Pozitif", "مثبت") },

    // 4 — section labelFr:"" itemsFr: ["plus grand que 0", "+3, +15 (le + est souvent omis)"]
    {
      label: S("", "", "", "", "", "", "", "", "", ""),
      items: A(
        ["plus grand que 0", "+3, +15 (le + est souvent omis)"],
        ["greater than 0", "+3, +15 (the + is often omitted)"],
        ["أكبر من 0", "+3، +15 (لا نكتب عادةً علامة +)"],
        ["بزرگ تر از 0", "+3، +15 (علامت + اغلب نوشته نمی شود)"],
        ["ካብ 0 ዝዓቢ", "+3, +15 (ምልክት + ብዙሕ ግዜ ኣይጽሓፍን)"],
        ["більше за 0", "+3, +15 (знак + часто не пишуть)"],
        ["maior que 0", "+3, +15 (o + é muitas vezes omitido)"],
        ["ka weyn 0", "+3, +15 (calaamadda + badanaa lama qoro)"],
        ["0'dan büyüktür", "+3, +15 (+ işareti çoğu zaman yazılmaz)"],
        ["له 0 څخه لوی", "+3، +15 (د + نښه ډېر وخت نه ليکل کېږي)"],
      ),
    },

    // 5 — plain "Négatif"
    { text: S("Négatif", "Negative", "سالب", "منفی", "ኣሉታዊ", "Від'ємне", "Negativo", "Taban", "Negatif", "منفي") },

    // 6 — section labelFr:"" itemsFr: ["plus petit que 0", "−3, −15"]
    {
      label: S("", "", "", "", "", "", "", "", "", ""),
      items: A(
        ["plus petit que 0", "−3, −15"],
        ["less than 0", "−3, −15"],
        ["أصغر من 0", "−3، −15"],
        ["کوچک تر از 0", "−3، −15"],
        ["ካብ 0 ዝንእስ", "−3, −15"],
        ["менше за 0", "−3, −15"],
        ["menor que 0", "−3, −15"],
        ["ka yar 0", "−3, −15"],
        ["0'dan küçüktür", "−3, −15"],
        ["له 0 څخه کوچنی", "−3، −15"],
      ),
    },

    // 7 — plain "Le zéro (0) n'est ni positif ni négatif."
    { text: S(
      "Le zéro (0) n'est ni positif ni négatif.",
      "Zero (0) is neither positive nor negative.",
      "الصفر (0) ليس موجبا ولا سالبا.",
      "صفر (0) نه مثبت است و نه منفی.",
      "ዜሮ (0) ኣዎንታዊ ወይ ኣሉታዊ ኣይኮነን።",
      "Нуль (0) не є ні додатним, ні від'ємним.",
      "O zero (0) não é positivo nem negativo.",
      "Eber (0) ma aha togan mana aha taban.",
      "Sıfır (0) ne pozitiftir ne negatiftir.",
      "صفر (0) نه مثبت دی او نه منفي.",
    ) },

    // 8 — plain "" spacer
    {},

    // 9 — heading "La droite numérique" black:true
    { text: S(
      "La droite numérique",
      "The number line",
      "المستقيم العددي",
      "محور اعداد",
      "መስመር ቁጽሪ",
      "Числова пряма",
      "A reta numérica",
      "Xariiqda tirooyinka",
      "Sayı doğrusu",
      "د عددونو کرښه",
    ) },

    // 10 — plain "Droite numérique de −6 à +6"
    { text: S(
      "Droite numérique de −6 à +6",
      "Number line from −6 to +6",
      "مستقيم عددي من −6 إلى +6",
      "محور اعداد از −6 تا +6",
      "መስመር ቁጽሪ ካብ −6 ክሳብ +6",
      "Числова пряма від −6 до +6",
      "Reta numérica de −6 a +6",
      "Xariiq tiro laga bilaabo −6 ilaa +6",
      "−6'dan +6'ya sayı doğrusu",
      "د −6 نه تر +6 پورې د عددونو کرښه",
    ) },

    // 11 — svg noFrame, no captionFr
    {},

    // 12 — section labelFr:"" itemsFr: 3 items
    {
      label: S("", "", "", "", "", "", "", "", "", ""),
      items: A(
        [
          "Les négatifs sont à **gauche** de 0.",
          "Les positifs sont à **droite** de 0.",
          "Plus on va à gauche, plus le nombre est **petit**.",
        ],
        [
          "Negative numbers are to the **left** of 0.",
          "Positive numbers are to the **right** of 0.",
          "The farther left you go, the **smaller** the number is.",
        ],
        [
          "الأعداد السالبة تقع على **يسار** 0.",
          "الأعداد الموجبة تقع على **يمين** 0.",
          "كلما اتجهنا إلى اليسار صار العدد **أصغر**.",
        ],
        [
          "عددهای منفی در **چپ** 0 هستند.",
          "عددهای مثبت در **راست** 0 هستند.",
          "هرچه به چپ برویم، عدد **کوچک تر** می شود.",
        ],
        [
          "ኣሉታዊ ቁጽርታት ብ**ጸጋም** 0 እዮም።",
          "ኣዎንታዊ ቁጽርታት ብ**የማን** 0 እዮም።",
          "ናብ ጸጋም ብዝኸድና መጠን ቁጽሪ **ይንእስ**።",
        ],
        [
          "Від'ємні числа розташовані **ліворуч** від 0.",
          "Додатні числа розташовані **праворуч** від 0.",
          "Що далі ліворуч, то число **менше**.",
        ],
        [
          "Os negativos ficam à **esquerda** de 0.",
          "Os positivos ficam à **direita** de 0.",
          "Quanto mais à esquerda, mais **pequeno** é o número.",
        ],
        [
          "Tirooyinka taban waxay ku yaallaan **bidixda** 0.",
          "Tirooyinka togan waxay ku yaallaan **midigta** 0.",
          "Marka bidix loo sii socdo, tiradu way sii **yaraataa**.",
        ],
        [
          "Negatifler 0'ın **solundadır**.",
          "Pozitifler 0'ın **sağındadır**.",
          "Sola gittikçe sayı **küçülür**.",
        ],
        [
          "منفي عددونه د 0 **کيڼ** لور ته دي.",
          "مثبت عددونه د 0 **ښي** لور ته دي.",
          "هر څومره کيڼ ته ځو، عدد **کوچنی** کېږي.",
        ],
      ),
    },

    // 13 — plain "" spacer
    {},

    // 14 — heading "L'opposé d'un nombre" black:true
    { text: S(
      "L'opposé d'un nombre",
      "The opposite of a number",
      "معاكس العدد",
      "قرینه یک عدد",
      "ተጻራሪ ናይ ቁጽሪ",
      "Протилежне число",
      "O oposto de um número",
      "Lid ku ah tiro",
      "Bir sayının tersi",
      "د عدد مقابل",
    ) },

    // 15 — plain "L'opposé est le nombre qui a le signe contraire."
    { text: S(
      "L'opposé est le nombre qui a le signe contraire.",
      "The opposite is the number that has the opposite sign.",
      "المعاكس هو العدد الذي له الإشارة المعاكسة.",
      "قرینه عددی است که علامت مخالف دارد.",
      "ተጻራሪ ማለት ተጻራሪ ምልክት ዘለዎ ቁጽሪ እዩ።",
      "Протилежне число має протилежний знак.",
      "O oposto é o número que tem o sinal contrário.",
      "Lidku waa tirada leh calaamadda ka soo horjeedda.",
      "Ters sayı, zıt işarete sahip sayıdır.",
      "مقابل هغه عدد دی چې مخالفه نښه لري.",
    ) },

    // 16 — table headers ["Nombre","Opposé"] — rows are pure math (+5/−5 etc.)
    {
      headers: {
        fr: ["Nombre", "Opposé"],
        en: ["Number", "Opposite"],
        ar: ["العدد", "المعاكس"],
        fa: ["عدد", "قرینه"],
        ti: ["ቁጽሪ", "ተጻራሪ"],
        uk: ["Число", "Протилежне"],
        pt: ["Número", "Oposto"],
        so: ["Tiro", "Lid"],
        tr: ["Sayı", "Tersi"],
        ps: ["عدد", "مقابل"],
      },
    },

    // 17 — plain "" spacer
    {},

    // 18 — heading "La valeur absolue" black:true
    { text: S(
      "La valeur absolue",
      "Absolute value",
      "القيمة المطلقة",
      "قدر مطلق",
      "ፍጹም ዋጋ",
      "Абсолютне значення",
      "O valor absoluto",
      "Qiimaha mutlaq",
      "Mutlak değer",
      "مطلق ارزښت",
    ) },

    // 19 — plain "La valeur absolue d'un nombre est sa distance à 0 sur la droite numérique."
    { text: S(
      "La valeur absolue d'un nombre est sa distance à 0 sur la droite numérique.",
      "The absolute value of a number is its distance from 0 on the number line.",
      "القيمة المطلقة لعدد هي مسافته من 0 على المستقيم العددي.",
      "قدر مطلق یک عدد فاصله آن از 0 روی محور اعداد است.",
      "ፍጹም ዋጋ ናይ ቁጽሪ ርሕቀቱ ካብ 0 ኣብ መስመር ቁጽሪ እዩ።",
      "Абсолютне значення числа — це відстань від 0 на числовій прямій.",
      "O valor absoluto de um número é a sua distância a 0 na reta numérica.",
      "Qiimaha mutlaq ee tiradu waa masaafadeeda laga joogo 0 xariiqda tirooyinka.",
      "Bir sayının mutlak değeri, sayı doğrusunda 0'a olan uzaklığıdır.",
      "د يو عدد مطلق ارزښت د هغه د عددونو کرښې پر مخ له 0 سره واټن دی.",
    ) },

    // 20 — plain "Elle est toujours positive ou nulle."
    { text: S(
      "Elle est toujours positive ou nulle.",
      "It is always positive or zero.",
      "هي دائما موجبة أو معدومة.",
      "همیشه مثبت یا صفر است.",
      "ኩሉ ግዜ ኣዎንታዊ ወይ ዜሮ እዩ።",
      "Вона завжди невід'ємна (додатна або нуль).",
      "É sempre positivo ou nulo.",
      "Had iyo jeer waa togan ama eber.",
      "Her zaman pozitif ya da sıfırdır.",
      "تل مثبت يا صفر وي.",
    ) },

    // 21 — plain "Notation : |a| (barres verticales autour du nombre)."
    { text: S(
      "Notation : |a| (barres verticales autour du nombre).",
      "Notation: |a| (vertical bars around the number).",
      "الرمز: |a| (خطوط عمودية حول العدد).",
      "نماد: |a| (خطوط عمودی دور عدد).",
      "ምልክት: |a| (ቀጥቃጤ ዕናቕ ዙርያ ቁጽሪ).",
      "Позначення: |a| (вертикальні риски навколо числа).",
      "Notação: |a| (barras verticais em torno do número).",
      "Calaamadda: |a| (xariiqyo toosan oo ku wareegsan tiradu).",
      "Gösterim: |a| (sayının etrafındaki dikey çizgiler).",
      "نښه: |a| (د عدد شاوخوا عمودي کرښې).",
    ) },

    // 22 — plain "" spacer
    {},

    // 23 — heading "Exemples" (no black)
    { text: S("Exemples", "Examples", "أمثلة", "مثال ها", "ኣብነታት", "Приклади", "Exemplos", "Tusaalooyin", "Örnekler", "بېلګې") },

    // 24 — table headers ["Nombre","Valeur absolue","Explication"] — "Explication" column has French text
    {
      headers: {
        fr: ["Nombre", "Valeur absolue", "Explication"],
        en: ["Number", "Absolute value", "Explanation"],
        ar: ["العدد", "القيمة المطلقة", "التفسير"],
        fa: ["عدد", "قدر مطلق", "توضیح"],
        ti: ["ቁጽሪ", "ፍጹም ዋጋ", "መብርሂ"],
        uk: ["Число", "Абсолютне значення", "Пояснення"],
        pt: ["Número", "Valor absoluto", "Explicação"],
        so: ["Tiro", "Qiimaha mutlaq", "Sharaxaad"],
        tr: ["Sayı", "Mutlak değer", "Açıklama"],
        ps: ["عدد", "مطلق ارزښت", "توضيح"],
      },
      items: {
        fr: [
          "−5 | |−5| = 5 | distance à 0 = 5",
          "+5 | |+5| = 5 | distance à 0 = 5",
          "−3,7 | |−3,7| = 3,7 | distance à 0 = 3,7",
          "0 | |0| = 0 | distance à 0 = 0",
        ],
        en: [
          "−5 | |−5| = 5 | distance from 0 = 5",
          "+5 | |+5| = 5 | distance from 0 = 5",
          "−3.7 | |−3.7| = 3.7 | distance from 0 = 3.7",
          "0 | |0| = 0 | distance from 0 = 0",
        ],
        ar: [
          "−5 | |−5| = 5 | المسافة إلى 0 = 5",
          "+5 | |+5| = 5 | المسافة إلى 0 = 5",
          "−3,7 | |−3,7| = 3,7 | المسافة إلى 0 = 3,7",
          "0 | |0| = 0 | المسافة إلى 0 = 0",
        ],
        fa: [
          "−5 | |−5| = 5 | فاصله تا 0 = 5",
          "+5 | |+5| = 5 | فاصله تا 0 = 5",
          "−3٫7 | |−3٫7| = 3٫7 | فاصله تا 0 = 3٫7",
          "0 | |0| = 0 | فاصله تا 0 = 0",
        ],
        ti: [
          "−5 | |−5| = 5 | ርሕቀት ካብ 0 = 5",
          "+5 | |+5| = 5 | ርሕቀት ካብ 0 = 5",
          "−3,7 | |−3,7| = 3,7 | ርሕቀት ካብ 0 = 3,7",
          "0 | |0| = 0 | ርሕቀት ካብ 0 = 0",
        ],
        uk: [
          "−5 | |−5| = 5 | відстань до 0 = 5",
          "+5 | |+5| = 5 | відстань до 0 = 5",
          "−3,7 | |−3,7| = 3,7 | відстань до 0 = 3,7",
          "0 | |0| = 0 | відстань до 0 = 0",
        ],
        pt: [
          "−5 | |−5| = 5 | distância a 0 = 5",
          "+5 | |+5| = 5 | distância a 0 = 5",
          "−3,7 | |−3,7| = 3,7 | distância a 0 = 3,7",
          "0 | |0| = 0 | distância a 0 = 0",
        ],
        so: [
          "−5 | |−5| = 5 | masaafada ilaa 0 = 5",
          "+5 | |+5| = 5 | masaafada ilaa 0 = 5",
          "−3,7 | |−3,7| = 3,7 | masaafada ilaa 0 = 3,7",
          "0 | |0| = 0 | masaafada ilaa 0 = 0",
        ],
        tr: [
          "−5 | |−5| = 5 | 0'a uzaklık = 5",
          "+5 | |+5| = 5 | 0'a uzaklık = 5",
          "−3,7 | |−3,7| = 3,7 | 0'a uzaklık = 3,7",
          "0 | |0| = 0 | 0'a uzaklık = 0",
        ],
        ps: [
          "−5 | |−5| = 5 | له 0 سره واټن = 5",
          "+5 | |+5| = 5 | له 0 سره واټن = 5",
          "−3,7 | |−3,7| = 3,7 | له 0 سره واټن = 3,7",
          "0 | |0| = 0 | له 0 سره واټن = 0",
        ],
      },
    },

    // 25 — note
    { text: S(
      "−8 et +8 ont la même valeur absolue (8) : ils sont à égale distance de 0. Ce sont des opposés.",
      "−8 and +8 have the same absolute value (8): they are at equal distance from 0. They are opposites.",
      "−8 و +8 لهما نفس القيمة المطلقة (8): هما على المسافة نفسها من 0. إنهما عددان متعاكسان.",
      "−8 و +8 قدر مطلق یکسان دارند (8): از 0 فاصله برابر دارند. اینها قرینه هم هستند.",
      "−8 ን +8 ሓደ ፍጹም ዋጋ ኣለዎም (8): ካብ 0 ማዕረ ርሕቀት ኣለዎም። ተጻራሪ እዮም።",
      "−8 і +8 мають однакове абсолютне значення (8): вони на рівній відстані від 0. Це протилежні числа.",
      "−8 e +8 têm o mesmo valor absoluto (8): estão à mesma distância de 0. São opostos.",
      "−8 iyo +8 waxay leeyihiin qiime mutlaq isku mid ah (8): masaafadoodu 0 ka siman tahay. Waxay yihiin isdheermaamiyayaal.",
      "−8 ve +8 aynı mutlak değere sahiptir (8): 0'a eşit uzaklıktadırlar. Bunlar zıt sayılardır.",
      "−8 او +8 يو شان مطلق ارزښت لري (8): له 0 سره برابر واټن لري. دوی مقابلونه دي.",
    ) },
  ],
};
