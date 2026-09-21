import type { SubmoduleTrad } from "./trad-types";
import { S, A } from "./trad-a9-common";

export const TRAD_A9_3: SubmoduleTrad = {
  submoduleId: "A9-3",
  title: S(
    "Évaluer une expression",
    "Evaluating an expression",
    "تقييم تعبير",
    "ارزیابی عبارت",
    "ኣዝማሪ ምምዛን",
    "Обчислення значення виразу",
    "Avaliar uma expressão",
    "Qiimaynta muujinta",
    "Bir ifadeyi değerlendirme",
    "د عبارت ارزونه",
  ),
  blocks: [
    // 0 — plain
    {
      text: S(
        "Évaluer une expression algébrique signifie remplacer les variables par des valeurs numériques, puis calculer le résultat en respectant les priorités opératoires.",
        "Evaluating an algebraic expression means replacing the variables with numerical values, then calculating the result while respecting the order of operations.",
        "تقييم تعبير جبري يعني استبدال المتغيرات بقيم عددية، ثم حساب النتيجة مع احترام أولويات العمليات.",
        "ارزیابی یک عبارت جبری یعنی جایگزین کردن متغیرها با مقادیر عددی و سپس محاسبهٔ نتیجه با رعایت اولویت عملیات.",
        "ኣዝማሪ ምምዛን ምንታይ ማለት እዩ? ተለዋዋጢ ቁጽርታት ብቁጽርታዊ ዋጋ ክትቀይሮም ከምኡ'ውን ናይ ስራሕ ቅድመ-ኣደራ ኣብ ምኽባር ውጽኢት ምሕሳብ.",
        "Обчислити алгебраїчний вираз — це підставити замість змінних числові значення, а потім обчислити результат, дотримуючись порядку операцій.",
        "Avaliar uma expressão algébrica significa substituir as variáveis por valores numéricos e calcular o resultado respeitando as prioridades das operações.",
        "Qiimaynta muujinta aljebrada waxay ka dhigan tahay in beddelka lagu beddelo qiimo tiro ah, kadibna natiijada la xisaabiyo iyadoo la ixtiraamayo mudnaanta hawlgallada.",
        "Bir cebirsel ifadeyi değerlendirmek, değişkenleri sayısal değerlerle değiştirip işlem önceliğine uyarak sonucu hesaplamak demektir.",
        "د جبري عبارت ارزونه پدې معنی ده چې متغیرونه په عددي ارزښتونو بدل کړئ، بیا د عملیاتو د لومړیتوب په درناوي سره پایله محاسبه کړئ.",
      ),
    },
    // 1 — highlight "Méthode"
    {
      text: S(
        "Méthode",
        "Method",
        "الطريقة",
        "روش",
        "ኣገባብ",
        "Метод",
        "Método",
        "Habka",
        "Yöntem",
        "طریقه",
      ),
    },
    // 2 — section (labelFr: "")
    {
      label: S("", "", "", "", "", "", "", "", "", ""),
      items: A(
        [
          "1. Repérer toutes les variables dans l'expression",
          "2. Remplacer chaque variable par sa valeur (entre parenthèses)",
          "3. Calculer en respectant l'ordre : parenthèses → puissances → × et ÷ → **+** et **−**",
        ],
        [
          "1. Identify all variables in the expression",
          "2. Replace each variable with its value (in parentheses)",
          "3. Calculate in order: parentheses → powers → × and ÷ → **+** and **−**",
        ],
        [
          "1. حدّد جميع المتغيرات في التعبير",
          "2. استبدل كل متغير بقيمته (بين أقواس)",
          "3. احسب مع احترام الترتيب: أقواس → أسس → × و ÷ → **+** و **−**",
        ],
        [
          "1. همهٔ متغیرهای عبارت را شناسایی کنید",
          "2. هر متغیر را با مقدارش (داخل پرانتز) جایگزین کنید",
          "3. با رعایت ترتیب محاسبه کنید: پرانتز → توان → × و ÷ → **+** و **−**",
        ],
        [
          "1. ኣብቲ ኣዝማሪ ኩሉ ተለዋዋጢ ቁጽርታት ምልክት",
          "2. ነፍሲ ወከፍ ተለዋዋጢ ቁጽሪ ብዋጋኡ (ኣብ መንጎ መጠን) ምቕያር",
          "3. ቅድመ-ኣደራ ኣብ ምኽባር ምሕሳብ: መጠን → ጸዓት → ×ን ÷ን → **+**ን **−**ን",
        ],
        [
          "1. Знайти всі змінні у виразі",
          "2. Замінити кожну змінну її значенням (у дужках)",
          "3. Обчислити, дотримуючись порядку: дужки → степені → × і ÷ → **+** і **−**",
        ],
        [
          "1. Identificar todas as variáveis na expressão",
          "2. Substituir cada variável pelo seu valor (entre parênteses)",
          "3. Calcular respeitando a ordem: parênteses → potências → × e ÷ → **+** e **−**",
        ],
        [
          "1. Soo aqoonso dhammaan beddelka ku jira muujinta",
          "2. Beddel kasta ku beddel qiimihiisa (xarig gudaha ah)",
          "3. Xisaabi adigoo ixtiraamaya taxanaha: xarig → awood → × iyo ÷ → **+** iyo **−**",
        ],
        [
          "1. İfadedeki tüm değişkenleri belirleyin",
          "2. Her değişkeni değeriyle (parantez içinde) değiştirin",
          "3. Sıraya uyarak hesaplayın: parantez → üs → × ve ÷ → **+** ve **−**",
        ],
        [
          "1. په عبارت کې ټول متغیرونه وپېژنئ",
          "2. هر متغیر د خپل ارزښت سره (په قوسونو کې) بدل کړئ",
          "3. د ترتیب په درناوي محاسبه وکړئ: قوسونه → توانونه → × او ÷ → **+** او **−**",
        ],
      ),
    },
    // 3 — heading "Exemples" (black)
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
    // 4 — plain
    {
      text: S(
        "Toujours mettre la valeur entre parenthèses lors de la substitution. Cela évite les erreurs de signe, surtout avec les valeurs négatives.",
        "Always put the value in parentheses when substituting. This avoids sign errors, especially with negative values.",
        "ضع دائماً القيمة بين أقواس عند الاستبدال. هذا يمنع أخطاء الإشارة، خاصة مع القيم السالبة.",
        "هنگام جایگذاری همیشه مقدار را داخل پرانتز بنویسید. این از خطاهای علامت، به‌ویژه با مقادیر منفی، جلوگیری می‌کند.",
        "ኣብ መጠን ምቕያር ዋጋ ኩሉ ግዜ ኣብ መንጎ መጠን ክትቀምጦ። እዚ ናይ ምልክት ጌጋታት፣ ብፍላይ ኣባላዊ ዋጋታት፣ ይከላኸሎ።",
        "Завжди ставте значення в дужки під час підстановки. Це запобігає помилкам зі знаком, особливо з від'ємними значеннями.",
        "Ao substituir, coloque sempre o valor entre parênteses. Isto evita erros de sinal, especialmente com valores negativos.",
        "Marka la beddelayo, had iyo jeer qiimaha geli xarig gudaha ah. Tani waxay ka hortagtaa khaladaadka calaamadda, gaar ahaan qiimaha taban.",
        "Yerine koyarken değeri her zaman parantez içine yazın. Bu, özellikle negatif değerlerde işaret hatalarını önler.",
        "په بدلولو کې تل ارزښت په قوسونو کې وځایئ. دا د نښې تېروتنې مخنیوی کوي، په ځانګړي توګه د منفي ارزښتونو سره.",
      ),
    },
    // 5 — highlight "Avec une variable"
    {
      text: S(
        "Avec une variable",
        "With one variable",
        "بمتغير واحد",
        "با یک متغیر",
        "ብሓደ ተለዋዋጢ ቁጽሪ",
        "З однією змінною",
        "Com uma variável",
        "Hal beddel",
        "Tek değişkenli",
        "په یو متغیر سره",
      ),
    },
    // 6 — section
    {
      items: A(
        [
          "Évalue 3x² **−** 2x **+** 1 pour x = 3",
          "→ 3(3)² **−** 2(3) **+** 1",
          "→ 3 × 9 **−** 6 **+** 1",
          "→ 27 **−** 6 **+** 1 = **22**",
        ],
        [
          "Evaluate 3x² **−** 2x **+** 1 for x = 3",
          "→ 3(3)² **−** 2(3) **+** 1",
          "→ 3 × 9 **−** 6 **+** 1",
          "→ 27 **−** 6 **+** 1 = **22**",
        ],
        [
          "قيّم 3x² **−** 2x **+** 1 عندما x = 3",
          "→ 3(3)² **−** 2(3) **+** 1",
          "→ 3 × 9 **−** 6 **+** 1",
          "→ 27 **−** 6 **+** 1 = **22**",
        ],
        [
          "3x² **−** 2x **+** 1 را برای x = 3 ارزیابی کنید",
          "→ 3(3)² **−** 2(3) **+** 1",
          "→ 3 × 9 **−** 6 **+** 1",
          "→ 27 **−** 6 **+** 1 = **22**",
        ],
        [
          "3x² **−** 2x **+** 1 ን x = 3 ምዝን",
          "→ 3(3)² **−** 2(3) **+** 1",
          "→ 3 × 9 **−** 6 **+** 1",
          "→ 27 **−** 6 **+** 1 = **22**",
        ],
        [
          "Обчисліть 3x² **−** 2x **+** 1 для x = 3",
          "→ 3(3)² **−** 2(3) **+** 1",
          "→ 3 × 9 **−** 6 **+** 1",
          "→ 27 **−** 6 **+** 1 = **22**",
        ],
        [
          "Avalie 3x² **−** 2x **+** 1 para x = 3",
          "→ 3(3)² **−** 2(3) **+** 1",
          "→ 3 × 9 **−** 6 **+** 1",
          "→ 27 **−** 6 **+** 1 = **22**",
        ],
        [
          "Qiimee 3x² **−** 2x **+** 1 marka x = 3",
          "→ 3(3)² **−** 2(3) **+** 1",
          "→ 3 × 9 **−** 6 **+** 1",
          "→ 27 **−** 6 **+** 1 = **22**",
        ],
        [
          "x = 3 için 3x² **−** 2x **+** 1 ifadesini değerlendirin",
          "→ 3(3)² **−** 2(3) **+** 1",
          "→ 3 × 9 **−** 6 **+** 1",
          "→ 27 **−** 6 **+** 1 = **22**",
        ],
        [
          "د x = 3 لپاره 3x² **−** 2x **+** 1 ارزونه وکړئ",
          "→ 3(3)² **−** 2(3) **+** 1",
          "→ 3 × 9 **−** 6 **+** 1",
          "→ 27 **−** 6 **+** 1 = **22**",
        ],
      ),
    },
    // 7 — highlight "Avec deux variables"
    {
      text: S(
        "Avec deux variables",
        "With two variables",
        "بمتغيرين",
        "با دو متغیر",
        "ብክልተ ተለዋዋጢ ቁጽርታት",
        "З двома змінними",
        "Com duas variáveis",
        "Laba beddel",
        "İki değişkenli",
        "په دوو متغیرونو سره",
      ),
    },
    // 8 — section
    {
      items: A(
        [
          "Évalue a² **+** b pour a = 4 et b = **−**3",
          "→ (4)² **+** (**−**3)",
          "→ 16 **+** (**−**3) = **13**",
        ],
        [
          "Evaluate a² **+** b for a = 4 and b = **−**3",
          "→ (4)² **+** (**−**3)",
          "→ 16 **+** (**−**3) = **13**",
        ],
        [
          "قيّم a² **+** b عندما a = 4 و b = **−**3",
          "→ (4)² **+** (**−**3)",
          "→ 16 **+** (**−**3) = **13**",
        ],
        [
          "a² **+** b را برای a = 4 و b = **−**3 ارزیابی کنید",
          "→ (4)² **+** (**−**3)",
          "→ 16 **+** (**−**3) = **13**",
        ],
        [
          "a² **+** b ን a = 4ን b = **−**3ን ምዝን",
          "→ (4)² **+** (**−**3)",
          "→ 16 **+** (**−**3) = **13**",
        ],
        [
          "Обчисліть a² **+** b для a = 4 і b = **−**3",
          "→ (4)² **+** (**−**3)",
          "→ 16 **+** (**−**3) = **13**",
        ],
        [
          "Avalie a² **+** b para a = 4 e b = **−**3",
          "→ (4)² **+** (**−**3)",
          "→ 16 **+** (**−**3) = **13**",
        ],
        [
          "Qiimee a² **+** b marka a = 4 iyo b = **−**3",
          "→ (4)² **+** (**−**3)",
          "→ 16 **+** (**−**3) = **13**",
        ],
        [
          "a = 4 ve b = **−**3 için a² **+** b ifadesini değerlendirin",
          "→ (4)² **+** (**−**3)",
          "→ 16 **+** (**−**3) = **13**",
        ],
        [
          "د a = 4 او b = **−**3 لپاره a² **+** b ارزونه وکړئ",
          "→ (4)² **+** (**−**3)",
          "→ 16 **+** (**−**3) = **13**",
        ],
      ),
    },
  ],
  consignes: {
    symbolic_1: S(
      "Évaluez les expressions avec deux variables. Les 5 expressions utilisent les mêmes valeurs.",
      "Evaluate the expressions with two variables. All 5 expressions use the same values.",
      "قيّم التعبيرات بمتغيرين. التعبيرات الخمسة تستخدم نفس القيم.",
      "عبارت‌های دو متغیره را ارزیابی کنید. هر ۵ عبارت از همان مقادیر استفاده می‌کنند.",
      "ኣዝማሪታት ብክልተ ተለዋዋጢ ቁጽርታት ምዝን። እቶም 5 ኣዝማሪታት ብሓደ ዓይነት ዋጋታት ይጥቀሙ።",
      "Обчисліть вирази з двома змінними. Усі 5 виразів використовують однакові значення.",
      "Avalie as expressões com duas variáveis. As 5 expressões usam os mesmos valores.",
      "Qiimee muujinnada laba beddel leh. Dhammaan 5 muujin waxay isticmaalaan isla qiimaha.",
      "İki değişkenli ifadeleri değerlendirin. 5 ifade de aynı değerleri kullanır.",
      "د دوو متغیرونو عبارتونه ارزونه وکړئ. ټول 5 عبارتونه ورته ارزښتونه کاروي.",
    ),
    symbolic_2: S(
      "Évaluez les expressions avec trois variables. Les 5 expressions utilisent les mêmes valeurs.",
      "Evaluate the expressions with three variables. All 5 expressions use the same values.",
      "قيّم التعبيرات بثلاثة متغيرات. التعبيرات الخمسة تستخدم نفس القيم.",
      "عبارت‌های سه متغیره را ارزیابی کنید. هر ۵ عبارت از همان مقادیر استفاده می‌کنند.",
      "ኣዝማሪታት ብሰለስተ ተለዋዋጢ ቁጽርታት ምዝን። እቶም 5 ኣዝማሪታት ብሓደ ዓይነት ዋጋታት ይጥቀሙ።",
      "Обчисліть вирази з трьома змінними. Усі 5 виразів використовують однакові значення.",
      "Avalie as expressões com três variáveis. As 5 expressões usam os mesmos valores.",
      "Qiimee muujinnada saddex beddel leh. Dhammaan 5 muujin waxay isticmaalaan isla qiimaha.",
      "Üç değişkenli ifadeleri değerlendirin. 5 ifade de aynı değerleri kullanır.",
      "د درې متغیرونو عبارتونه ارزونه وکړئ. ټول 5 عبارتونه ورته ارزښتونه کاروي.",
    ),
    symbolic_3: S(
      "Évaluez les expressions avec puissances et racines. Les 5 expressions utilisent les mêmes valeurs.",
      "Evaluate the expressions with powers and roots. All 5 expressions use the same values.",
      "قيّم التعبيرات التي تحتوي على أسس وجذور. التعبيرات الخمسة تستخدم نفس القيم.",
      "عبارت‌های دارای توان و ریشه را ارزیابی کنید. هر ۵ عبارت از همان مقادیر استفاده می‌کنند.",
      "ኣዝማሪታት ብጸዓትን ስርን ምዝን። እቶም 5 ኣዝማሪታት ብሓደ ዓይነት ዋጋታት ይጥቀሙ።",
      "Обчисліть вирази зі степенями та коренями. Усі 5 виразів використовують однакові значення.",
      "Avalie as expressões com potências e raízes. As 5 expressões usam os mesmos valores.",
      "Qiimee muujinnada awood iyo xidid leh. Dhammaan 5 muujin waxay isticmaalaan isla qiimaha.",
      "Üs ve kök içeren ifadeleri değerlendirin. 5 ifade de aynı değerleri kullanır.",
      "د توانونو او ریښو عبارتونه ارزونه وکړئ. ټول 5 عبارتونه ورته ارزښتونه کاروي.",
    ),
  },
};
