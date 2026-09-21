import type { SubmoduleTrad } from "./trad-types";
import { S, A } from "./trad-a9-common";

export const TRAD_A9_4: SubmoduleTrad = {
  submoduleId: "A9-4",
  title: S(
    "Réduire une expression",
    "Simplifying an expression",
    "تبسيط تعبير",
    "ساده‌سازی عبارت",
    "ኣዝማሪ ምቅናስ",
    "Спрощення виразу",
    "Reduzir uma expressão",
    "Fududeynta muujinta",
    "Bir ifadeyi sadeleştirme",
    "د عبارت ساده کول",
  ),
  blocks: [
    // 0 — heading "Termes semblables" (black)
    {
      text: S(
        "Termes semblables",
        "Like terms",
        "الحدود المتشابهة",
        "جملات مشابه",
        "ተመሳሳሊ ወጽዓ",
        "Подібні доданки",
        "Termos semelhantes",
        "Erey isku mid ah",
        "Benzer terimler",
        "ورته ورته جملې",
      ),
    },
    // 1 — plain
    {
      text: S(
        "Des termes semblables sont des termes qui ont la même variable. On peut les additionner ou soustraire en regroupant leurs coefficients.",
        "Like terms are terms that have the same variable. You can add or subtract them by grouping their coefficients.",
        "الحدود المتشابهة هي حدود لها نفس المتغير. يمكن جمعها أو طرحها بتجميع معاملاتها.",
        "جملات مشابه، جملاتی‌اند که متغیر یکسانی دارند. می‌توان با گروه‌بندی ضرایب آن‌ها را با هم جمع یا تفریق کرد.",
        "ተመሳሳሊ ወጽዓ ብሓደ ተለዋዋጢ ቁጽሪ ዘለዎም ወጽዓ እዮም። ብምክናን ኣብ ምውሳኽን ምክናንን ትኽእል እያ።",
        "Подібні доданки — це доданки з однаковою змінною. Їх можна додавати або віднімати, групуючи коефіцієнти.",
        "Termos semelhantes são termos que têm a mesma variável. Podem ser somados ou subtraídos agrupando os seus coeficientes.",
        "Erey isku mid ah waa ereyo leh isla beddelka. Waxaad ku dari kartaa ama ka jari kartaa adigoo isku ururinaya isku-dhufayaashooda.",
        "Benzer terimler, aynı değişkene sahip terimlerdir. Katsayılarını gruplayarak toplanabilir veya çıkarılabilir.",
        "ورته ورته جملې هغه جملې دي چې ورته متغیر لري. د ضریبونو په ډله کولو سره یې جمع یا تفریق کولی شئ.",
      ),
    },
    // 2 — highlight "Exemples"
    {
      text: S(
        "Exemples",
        "Examples",
        "أمثلة",
        "مثال‌ها",
        "ምሳሌታት",
        "Приклади",
        "Exemplos",
        "Tusaalooyin",
        "Örnekler",
        "مثالونه",
      ),
    },
    // 3 — section
    {
      items: A(
        [
          "**5x** et **3x**     (même variable **x**, même exposant 1)",
          "**4a²** et **−**2**a²** (même variable **a**, même exposant 2)",
          "**7** et **−**3**      (deux termes constants)",
        ],
        [
          "**5x** and **3x**     (same variable **x**, same exponent 1)",
          "**4a²** and **−**2**a²** (same variable **a**, same exponent 2)",
          "**7** and **−**3**      (two constant terms)",
        ],
        [
          "**5x** و **3x**     (نفس المتغير **x**، نفس الأس 1)",
          "**4a²** و **−**2**a²** (نفس المتغير **a**، نفس الأس 2)",
          "**7** و **−**3**      (حدّان ثابتان)",
        ],
        [
          "**5x** و **3x**     (متغیر یکسان **x**، توان یکسان ۱)",
          "**4a²** و **−**2**a²** (متغیر یکسان **a**، توان یکسان ۲)",
          "**7** و **−**3**      (دو جمله ثابت)",
        ],
        [
          "**5x**ን **3x**ን     (ተሓዋዊ ተለዋዋጢ **x**፣ ተሓዋዊ ጸዓት 1)",
          "**4a²**ን **−**2**a²**ን (ተሓዋዊ ተለዋዋጢ **a**፣ ተሓዋዊ ጸዓት 2)",
          "**7**ን **−**3**ን      (ክልተ ቋሚ ወጽዓ)",
        ],
        [
          "**5x** і **3x**     (та сама змінна **x**, той самий показник 1)",
          "**4a²** і **−**2**a²** (та сама змінна **a**, той самий показник 2)",
          "**7** і **−**3**      (два постійні доданки)",
        ],
        [
          "**5x** e **3x**     (mesma variável **x**, mesmo expoente 1)",
          "**4a²** e **−**2**a²** (mesma variável **a**, mesmo expoente 2)",
          "**7** e **−**3**      (dois termos constantes)",
        ],
        [
          "**5x** iyo **3x**     (isla beddelka **x**, isla jibbaarka 1)",
          "**4a²** iyo **−**2**a²** (isla beddelka **a**, isla jibbaarka 2)",
          "**7** iyo **−**3**      (laba erey joogto ah)",
        ],
        [
          "**5x** ve **3x**     (aynı değişken **x**, aynı üs 1)",
          "**4a²** ve **−**2**a²** (aynı değişken **a**, aynı üs 2)",
          "**7** ve **−**3**      (iki sabit terim)",
        ],
        [
          "**5x** او **3x**     (ورته متغیر **x**، ورته توان 1)",
          "**4a²** او **−**2**a²** (ورته متغیر **a**، ورته توان 2)",
          "**7** او **−**3**      (دو ثابت جملې)",
        ],
      ),
    },
    // 4 — heading "Termes NON semblables" (black)
    {
      text: S(
        "Termes NON semblables",
        "Unlike terms",
        "حدود غير متشابهة",
        "جملات غیر مشابه",
        "ዘይተመሳሳሊ ወጽዓ",
        "Неподібні доданки",
        "Termos NÃO semelhantes",
        "Erey aan isku mid ahayn",
        "Benzer OLMAYAN terimler",
        "ناورته جملې",
      ),
    },
    // 5 — plain
    {
      text: S(
        "Les termes qui ont des exposants différents ou des variables différentes ne peuvent pas se regrouper.",
        "Terms with different exponents or different variables cannot be grouped together.",
        "الحدود التي لها أسس مختلفة أو متغيرات مختلفة لا يمكن تجميعها.",
        "جملاتی که توان یا متغیر متفاوت دارند را نمی‌توان با هم گروه‌بندی کرد.",
        "ተሓዋዊ ጸዓት ወይ ተለዋዋጢ ቁጽሪ ዘይብሎም ወጽዓ ክትከናኸኖም ኣይትኽእሉን።",
        "Доданки з різними показниками або різними змінними не можна групувати разом.",
        "Termos com expoentes diferentes ou variáveis diferentes não podem ser agrupados.",
        "Erey leh jibbaar kala duwan ama beddel kala duwan lama ururi karo.",
        "Farklı üslere veya farklı değişkenlere sahip terimler birlikte gruplanamaz.",
        "هغه جملې چې مختلف توانونه یا مختلف متغیرونه لري، ډله نه کیدی شي.",
      ),
    },
    // 6 — highlight "Exemples"
    {
      text: S(
        "Exemples",
        "Examples",
        "أمثلة",
        "مثال‌ها",
        "ምሳሌታት",
        "Приклади",
        "Exemplos",
        "Tusaalooyin",
        "Örnekler",
        "مثالونه",
      ),
    },
    // 7 — section
    {
      items: A(
        [
          "**3x** et **3x²**    (exposants différents)",
          "**4x** et **4y**     (variables différentes)",
          "**5a** et **5** (l'un a une variable, l'autre non)",
        ],
        [
          "**3x** and **3x²**    (different exponents)",
          "**4x** and **4y**     (different variables)",
          "**5a** and **5** (one has a variable, the other does not)",
        ],
        [
          "**3x** و **3x²**    (أسس مختلفة)",
          "**4x** و **4y**     (متغيرات مختلفة)",
          "**5a** و **5** (أحدهما فيه متغير والآخر لا)",
        ],
        [
          "**3x** و **3x²**    (توان‌های متفاوت)",
          "**4x** و **4y**     (متغیرهای متفاوت)",
          "**5a** و **5** (یکی متغیر دارد، دیگری ندارد)",
        ],
        [
          "**3x**ን **3x²**ን    (ተሓዋዊ ጸዓት ዘይብሎም)",
          "**4x**ን **4y**ን     (ተሓዋዊ ተለዋዋጢ ቁጽርታት)",
          "**5a**ን **5**ን (ሓደ ተለዋዋጢ ቁጽሪ ኣሎ፣ ካልእ የለን)",
        ],
        [
          "**3x** і **3x²**    (різні показники)",
          "**4x** і **4y**     (різні змінні)",
          "**5a** і **5** (в одного є змінна, в іншого — ні)",
        ],
        [
          "**3x** e **3x²**    (expoentes diferentes)",
          "**4x** e **4y**     (variáveis diferentes)",
          "**5a** e **5** (um tem variável, o outro não)",
        ],
        [
          "**3x** iyo **3x²**    (jibbaar kala duwan)",
          "**4x** iyo **4y**     (beddel kala duwan)",
          "**5a** iyo **5** (mid wuxuu leeyahay beddel, kan kalena maya)",
        ],
        [
          "**3x** ve **3x²**    (farklı üsler)",
          "**4x** ve **4y**     (farklı değişkenler)",
          "**5a** ve **5** (birinde değişken var, diğerinde yok)",
        ],
        [
          "**3x** او **3x²**    (مختلف توانونه)",
          "**4x** او **4y**     (مختلف متغیرونه)",
          "**5a** او **5** (یو متغیر لري، بل نه)",
        ],
      ),
    },
    // 8 — heading "Exemples de réduction" (black)
    {
      text: S(
        "Exemples de réduction",
        "Examples of simplification",
        "أمثلة على التبسيط",
        "مثال‌های ساده‌سازی",
        "ናይ ምቅናስ ምሳሌታት",
        "Приклади спрощення",
        "Exemplos de redução",
        "Tusaalooyin fududeyn",
        "Sadeleştirme örnekleri",
        "د ساده کولو مثالونه",
      ),
    },
    // 9 — table
    {
      headers: A(
        ["Expression", "Réduction", "Résultat"],
        ["Expression", "Simplification", "Result"],
        ["التعبير", "التبسيط", "النتيجة"],
        ["عبارت", "ساده‌سازی", "نتیجه"],
        ["ኣዝማሪ", "ምቅናስ", "ውጽኢት"],
        ["Вираз", "Спрощення", "Результат"],
        ["Expressão", "Redução", "Resultado"],
        ["Muujin", "Fududeyn", "Natiijo"],
        ["İfade", "Sadeleştirme", "Sonuç"],
        ["عبارت", "ساده کول", "پایله"],
      ),
      items: A(
        [
          "3x **+** 5x|(**+**3 **+** 5)x|8x",
          "7a **−** 2a|(7 **−** 2)a|5a",
          "4x **+** 3 **+** 2x **−** 1|(4 **+** 2)x **+** (3 **−** 1)|6x **+** 2",
        ],
        [
          "3x **+** 5x|(**+**3 **+** 5)x|8x",
          "7a **−** 2a|(7 **−** 2)a|5a",
          "4x **+** 3 **+** 2x **−** 1|(4 **+** 2)x **+** (3 **−** 1)|6x **+** 2",
        ],
        [
          "3x **+** 5x|(**+**3 **+** 5)x|8x",
          "7a **−** 2a|(7 **−** 2)a|5a",
          "4x **+** 3 **+** 2x **−** 1|(4 **+** 2)x **+** (3 **−** 1)|6x **+** 2",
        ],
        [
          "3x **+** 5x|(**+**3 **+** 5)x|8x",
          "7a **−** 2a|(7 **−** 2)a|5a",
          "4x **+** 3 **+** 2x **−** 1|(4 **+** 2)x **+** (3 **−** 1)|6x **+** 2",
        ],
        [
          "3x **+** 5x|(**+**3 **+** 5)x|8x",
          "7a **−** 2a|(7 **−** 2)a|5a",
          "4x **+** 3 **+** 2x **−** 1|(4 **+** 2)x **+** (3 **−** 1)|6x **+** 2",
        ],
        [
          "3x **+** 5x|(**+**3 **+** 5)x|8x",
          "7a **−** 2a|(7 **−** 2)a|5a",
          "4x **+** 3 **+** 2x **−** 1|(4 **+** 2)x **+** (3 **−** 1)|6x **+** 2",
        ],
        [
          "3x **+** 5x|(**+**3 **+** 5)x|8x",
          "7a **−** 2a|(7 **−** 2)a|5a",
          "4x **+** 3 **+** 2x **−** 1|(4 **+** 2)x **+** (3 **−** 1)|6x **+** 2",
        ],
        [
          "3x **+** 5x|(**+**3 **+** 5)x|8x",
          "7a **−** 2a|(7 **−** 2)a|5a",
          "4x **+** 3 **+** 2x **−** 1|(4 **+** 2)x **+** (3 **−** 1)|6x **+** 2",
        ],
        [
          "3x **+** 5x|(**+**3 **+** 5)x|8x",
          "7a **−** 2a|(7 **−** 2)a|5a",
          "4x **+** 3 **+** 2x **−** 1|(4 **+** 2)x **+** (3 **−** 1)|6x **+** 2",
        ],
        [
          "3x **+** 5x|(**+**3 **+** 5)x|8x",
          "7a **−** 2a|(7 **−** 2)a|5a",
          "4x **+** 3 **+** 2x **−** 1|(4 **+** 2)x **+** (3 **−** 1)|6x **+** 2",
        ],
      ),
    },
  ],
  consignes: {
    symbolic_1: S(
      "Simplifiez les produits.",
      "Simplify the products.",
      "بسّط حاصل الضرب.",
      "حاصل‌ضرب‌ها را ساده کنید.",
      "ፍርያታት ፈሊ",
      "Спростіть добутки.",
      "Simplifique os produtos.",
      "Fududee isku-dhufashada.",
      "Çarpımları sadeleştirin.",
      "حاصل‌ضربونه ساده کړئ.",
    ),
    symbolic_2: S(
      "Réduisez les termes semblables.",
      "Combine like terms.",
      "اجمع الحدود المتشابهة.",
      "جملات مشابه را ساده کنید.",
      "ተመሳሳሊ ወጽዓ ኣካና",
      "Зведіть подібні доданки.",
      "Reduza os termos semelhantes.",
      "Isku dar ereyada isku midka ah.",
      "Benzer terimleri sadeleştirin.",
      "ورته جملې سره یوځای کړئ.",
    ),
    symbolic_3: S(
      "Simplifiez les expressions quand c'est possible.",
      "Simplify the expressions when possible.",
      "بسّط التعبيرات عندما يكون ذلك ممكناً.",
      "عبارت‌ها را در صورت امکان ساده کنید.",
      "ኣዝማሪታት ኣብ ዝከኣል እዋን ፈሊ",
      "Спростіть вирази, коли це можливо.",
      "Simplifique as expressões quando for possível.",
      "Fududee muujinnada marka ay suurtagal tahay.",
      "Mümkün olduğunda ifadeleri sadeleştirin.",
      "عبارتونه ساده کړئ کله چې ممکن وي.",
    ),
  },
};
