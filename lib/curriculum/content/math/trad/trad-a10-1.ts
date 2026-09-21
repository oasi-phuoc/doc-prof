import type { SubmoduleTrad } from "./trad-types";

const S = (fr: string, en: string, ar: string, fa: string, ti: string, uk: string, pt: string, so: string, tr: string, ps: string) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });
const A = (fr: string[], en: string[], ar: string[], fa: string[], ti: string[], uk: string[], pt: string[], so: string[], tr: string[], ps: string[]) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

export const TRAD_A10_1: SubmoduleTrad = {
  submoduleId: "A10-1",
  title: S(
    "Résolution d'équations",
    "Solving equations",
    "حل المعادلات",
    "حل معادلات",
    "ምፍታሕ ምዕርርያት",
    "Розв'язування рівнянь",
    "Resolução de equações",
    "Xallinta isle'egyada",
    "Denklem çözme",
    "د معادلو حل",
  ),
  blocks: [
    // 0 — heading "Qu'est-ce qu'une équation ?"
        // 0 — heading "Qu'est-ce qu'une équation ?"
    {
      text: S(
        "Qu'est-ce qu'une équation ?",
        "What is an equation?",
        "ما هي المعادلة؟",
        "معادله چیست؟",
        "ምዕርርያት እንታይ እዩ?",
        "Що таке рівняння?",
        "O que é uma equação?",
        "Waa maxay isle'eg?",
        "Denklem nedir?",
        "معادله څه شی ده؟",
      ),
    },
    // 1 — plain
    {
      text: S(
        "Une **équation** est une égalité qui contient une valeur inconnue, souvent représentée par la lettre **x**. Résoudre l'équation signifie trouver la valeur de x qui rend l'égalité vraie.",
        "An **equation** is an equality that contains an unknown value, often represented by the letter **x**. Solving the equation means finding the value of x that makes the equality true.",
        "المعادلة **مساواة** تحتوي على قيمة مجهولة، غالباً ما تمثل بالحرف **x**. حل المعادلة يعني إيجاد قيمة x التي تجعل المساواة صحيحة.",
        "یک **معادله** برابری است که یک مقدار مجهول دارد، اغلب با حرف **x** نشان داده می‌شود. حل معادله یعنی یافتن مقدار x که برابری را درست کند.",
        "ናይ **ምዕርርያት** ምክንያት ዘይፍለጥ ዋጋ ዘለዎ ምክኒያት እዩ፣ መብዛሕትኡ ብ**x** ይሕለወሉ። ምዕርርያት ምፍታሕ ንሱ ዝሰሓሕ ዋጋ x ምርካብ እዩ።",
        "**Рівняння** — це рівність із невідомим значенням, часто позначеним літерою **x**. Розв'язати рівняння означає знайти таке x, за якого рівність істинна.",
        "Uma **equação** é uma igualdade que contém um valor desconhecido, muitas vezes representado pela letra **x**. Resolver a equação significa encontrar o valor de x que torna a igualdade verdadeira.",
        "**Isle'eg** waa sinnaan leh qiimo aan la aqoon, inta badan lagu matalaa xarafka **x**. Xallinta isle'egta waxay ka dhigan tahay helitaanka qiimaha x ee sinnaanta run ka dhiga.",
        "Bir **denklem**, genellikle **x** harfiyle gösterilen bilinmeyen bir değer içeren bir eşitliktir. Denklemi çözmek, eşitliği doğru yapan x değerini bulmak demektir.",
        "یوه **معادله** هغه برابري ده چې ناپېژاندلې ارزښت لري، ډېر وخت د **x** توري سره څرګندېږي. د معادلې حل کول د هغه x ارزښت موندل دي چې برابري رښتینې کوي.",
      ),
    },
    // 2 — highlight
    {
      text: S(
        "Le principe de la balance",
        "The balance principle",
        "مبدأ الميزان",
        "اصل ترازو",
        "ሓሳብ ሚዛን",
        "Принцип терези",
        "O princípio da balança",
        "Mabda'a miisaanka",
        "Terazi ilkesi",
        "د ترازو اصل",
      ),
    },
    // 3 — section balance
    {
      label: S(
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ),
      items: A(
        [
          "Les deux membres d'une équation doivent toujours rester égaux.",
          "On effectue donc **la même opération des deux côtés**.",
          "On peut additionner, soustraire, multiplier ou diviser par un même nombre, sauf diviser par 0.",
        ],
        [
          "Both sides of an equation must always remain equal.",
          "So we perform **the same operation on both sides**.",
          "We can add, subtract, multiply or divide by the same number, except dividing by 0.",
        ],
        [
          "يجب أن يبقى طرفا المعادلة متساويين دائماً.",
          "لذلك نُجري **نفس العملية على الطرفين**.",
          "يمكننا الجمع أو الطرح أو الضرب أو القسمة على نفس العدد، ما عدا القسمة على 0.",
        ],
        [
          "دو طرف معادله باید همیشه برابر بمانند.",
          "پس **همان عملیات را در دو طرف** انجام می‌دهیم.",
          "می‌توانیم جمع، تفریق، ضرب یا تقسیم بر یک عدد یکسان انجام دهیم، به جز تقسیم بر 0.",
        ],
        [
          "ክልተ ኣካላት ምዕርርያት ኩሉ ግዜ ምክንያት ክሰሓሑ ኣለዎም።",
          "ስለዚህ **ተመሳሳሊ ኣገባብ ኣብ ክልተ ኣካላት** ንገብር።",
          "ብሓደ ቁጽሪ ክንድምር፣ ክንከፋፍል፣ ክንضرب ወይ ክንከፋል ንኽእል፣ ግን ብ 0 ክንከፋል ኣይንኽእልን።",
        ],
        [
          "Обидва члени рівняння завжди мають залишатися рівними.",
          "Тому виконуємо **ту саму дію з обох боків**.",
          "Можна додавати, віднімати, множити або ділити на те саме число, окрім ділення на 0.",
        ],
        [
          "Os dois membros de uma equação devem permanecer sempre iguais.",
          "Por isso fazemos **a mesma operação dos dois lados**.",
          "Podemos somar, subtrair, multiplicar ou dividir pelo mesmo número, exceto dividir por 0.",
        ],
        [
          "Labada dhinac ee isle'egta waa inay had iyo jeer isku mid ahaadaan.",
          "Sidaa darteed waxaan ku sameynaa **isla hawlgalka labada dhinac**.",
          "Waxaan ku dari, ka jari, ku dhufti ama u qaybin karnaa isla tiro, marka laga reebo qaybinta 0.",
        ],
        [
          "Bir denklemin iki tarafı da her zaman eşit kalmalıdır.",
          "Bu yüzden **her iki tarafa da aynı işlemi** yaparız.",
          "Aynı sayıyı toplayabilir, çıkarabilir, çarpabilir veya bölebilir; 0'a bölmek hariç.",
        ],
        [
          "د معادلې دواړه خواوې باید تل برابرې پاتې شي.",
          "نو **په دواړو خواوو کې ورته عملیات** ترسره کوو.",
          "موږ کولی شو جمع، تفریق، ضرب یا تقسیم په ورته عدد وکړو، پرته له دې چې په 0 ووېشو.",
        ],
      ),
    },
    // 4 — plain 2x+3=11
    {
      text: S(
        "2x + 3 = 11",
        "2x + 3 = 11",
        "2x + 3 = 11",
        "2x + 3 = 11",
        "2x + 3 = 11",
        "2x + 3 = 11",
        "2x + 3 = 11",
        "2x + 3 = 11",
        "2x + 3 = 11",
        "2x + 3 = 11",
      ),
    },
    // 5 — section solution
    {
      label: S(
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ),
      items: A(
        [
          "La solution est x = 4",
          "Car 2 × 4 + 3 = 11.",
        ],
        [
          "The solution is x = 4",
          "Because 2 × 4 + 3 = 11.",
        ],
        [
          "الحل هو x = 4",
          "لأن 2 × 4 + 3 = 11.",
        ],
        [
          "جواب x = 4 است",
          "چون 2 × 4 + 3 = 11.",
        ],
        [
          "ፍታሕ x = 4 እዩ",
          "ምኽንያቱ 2 × 4 + 3 = 11.",
        ],
        [
          "Розв'язок: x = 4",
          "Бо 2 × 4 + 3 = 11.",
        ],
        [
          "A solução é x = 4",
          "Porque 2 × 4 + 3 = 11.",
        ],
        [
          "Xalku waa x = 4",
          "Maxaa yeelay 2 × 4 + 3 = 11.",
        ],
        [
          "Çözüm x = 4'tür",
          "Çünkü 2 × 4 + 3 = 11.",
        ],
        [
          "حل x = 4 دی",
          "ځکه 2 × 4 + 3 = 11.",
        ],
      ),
    },
    // 6 — heading Méthode générale
    {
      text: S(
        "Méthode générale",
        "General method",
        "الطريقة العامة",
        "روش کلی",
        "ሓፈሻዊ ኣገባብ",
        "Загальний метод",
        "Método geral",
        "Habka guud",
        "Genel yöntem",
        "عمومي لاره",
      ),
    },
    // 7 — plain step 1
    {
      text: S(
        "**1.** Développer les parenthèses s'il y en a.",
        "**1.** Expand the brackets if there are any.",
        "**1.** توسيع الأقواس إن وُجدت.",
        "**1.** پرانتزها را در صورت وجود باز کنید.",
        "**1.** ኣብ ተወሳኺ ካልእ ኣብ ተወሳኺ ኣሎ እንተኾነ ኣስፋሕ።",
        "**1.** Розкрити дужки, якщо вони є.",
        "**1.** Desenvolver os parênteses, se houver.",
        "**1.** Furfur xidhiidhada haddii ay jiraan.",
        "**1.** Parantez varsa aç.",
        "**1.** که پرانتزونه شته وي، پراخې کړئ.",
      ),
    },
    // 8 — plain step 2
    {
      text: S(
        "**2.** Réduire les termes semblables.",
        "**2.** Combine like terms.",
        "**2.** تبسيط الحدود المتشابهة.",
        "**2.** جمله‌های مشابه را ساده کنید.",
        "**2.** ተመሳሳሊ ኣካላት ጽምር።",
        "**2.** Звести подібні доданки.",
        "**2.** Reduzir termos semelhantes.",
        "**2.** Isku dar erayada isku midka ah.",
        "**2.** Benzer terimleri sadeleştir.",
        "**2.** ورته جملې ساده کړئ.",
      ),
    },
    // 9 — plain step 3
    {
      text: S(
        "**3.** Regrouper les termes en x d'un côté et les nombres de l'autre.",
        "**3.** Group the x terms on one side and the numbers on the other.",
        "**3.** جمع حدود x في طرف والأعداد في الطرف الآخر.",
        "**3.** جمله‌های x را در یک طرف و اعداد را در طرف دیگر جمع کنید.",
        "**3.** ኣካላት x ኣብ ሓደ ኣካል፣ ቁጽርታት ኣብ ካልእ ኣካል ጽምር።",
        "**3.** Зібрати доданки з x з одного боку, а числа — з іншого.",
        "**3.** Agrupar os termos em x de um lado e os números do outro.",
        "**3.** Ku ururi x hal dhinac, tirooyinka dhinaca kale.",
        "**3.** x terimlerini bir tarafta, sayıları diğer tarafta topla.",
        "**3.** د x جملې په یوه خواو کې، عددونه په بله خواو کې راټول کړئ.",
      ),
    },
    // 10 — plain step 4
    {
      text: S(
        "**4.** Diviser par le coefficient de x pour isoler x.",
        "**4.** Divide by the coefficient of x to isolate x.",
        "**4.** القسمة على معامل x لعزل x.",
        "**4.** بر ضریب x تقسیم کنید تا x تنها بماند.",
        "**4.** ን x ንምጽራይ ብኣብነት x ክፈል።",
        "**4.** Поділити на коефіцієнт x, щоб ізолювати x.",
        "**4.** Dividir pelo coeficiente de x para isolar x.",
        "**4.** U qaybi isku-dhufashada x si aad x u go'diso.",
        "**4.** x'i yalnız bırakmak için x'in katsayısına böl.",
        "**4.** د x منفصلولو لپاره په x ضریب ووېشئ.",
      ),
    },
    // 11 — plain step 5
    {
      text: S(
        "**5.** Vérifier la solution dans l'équation de départ.",
        "**5.** Check the solution in the original equation.",
        "**5.** التحقق من الحل في المعادلة الأصلية.",
        "**5.** جواب را در معادله اولیه بررسی کنید.",
        "**5.** ፍታሕ ኣብ መጀመርታ ምዕርርያት ኣረጋግጽ።",
        "**5.** Перевірити розв'язок у початковому рівнянні.",
        "**5.** Verificar a solução na equação inicial.",
        "**5.** Hubi xalka isle'egta bilowga ah.",
        "**5.** Çözümü başlangıç denkleminde kontrol et.",
        "**5.** حل په اصلي معادله کې وګورئ.",
      ),
    },
    // 12 — highlight Attention
    {
      text: S(
        "Attention",
        "Warning",
        "انتبه",
        "توجه",
        "ተጠንቀቕ",
        "Увага",
        "Atenção",
        "Digtoonow",
        "Dikkat",
        "پاملرنه",
      ),
    },
    // 13 — plain signe
    {
      text: S(
        "Un signe **−** placé devant une parenthèse change tous les signes à l'intérieur.",
        "A **−** sign in front of parentheses changes all the signs inside.",
        "علامة **−** أمام القوسين تغيّر جميع الإشارات داخله.",
        "علامت **−** جلوی پرانتز همه علامت‌های داخل را عوض می‌کند.",
        "ምልክት **−** ኣብ ቅድሚ ቅንፍ ኩሉ ኣብ ውሽጢ ዘሎ ምልክታት ይቕይር።",
        "Знак **−** перед дужками змінює всі знаки всередині.",
        "Um sinal **−** à frente de um parêntese muda todos os sinais no interior.",
        "Calaamad **−** ka hor xidhiidhka waxay beddelaysaa dhammaan calaamadaha gudaha.",
        "Parantez önündeki **−** işareti içindeki tüm işaretleri değiştirir.",
        "د پرانتز مخې ته **−** نښه دننه ټولې نښې بدلوي.",
      ),
    },
    // 14 — section exemple parenthèse
    {
      label: S(
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ),
      items: A(
        [
          "Par exemple, **−**(x **−** 5) = **−**x **+** 5.",
        ],
        [
          "For example, **−**(x **−** 5) = **−**x **+** 5.",
        ],
        [
          "مثلاً، **−**(x **−** 5) = **−**x **+** 5.",
        ],
        [
          "مثلاً، **−**(x **−** 5) = **−**x **+** 5.",
        ],
        [
          "ንኣብነት፣ **−**(x **−** 5) = **−**x **+** 5.",
        ],
        [
          "Наприклад, **−**(x **−** 5) = **−**x **+** 5.",
        ],
        [
          "Por exemplo, **−**(x **−** 5) = **−**x **+** 5.",
        ],
        [
          "Tusaale ahaan, **−**(x **−** 5) = **−**x **+** 5.",
        ],
        [
          "Örneğin, **−**(x **−** 5) = **−**x **+** 5.",
        ],
        [
          "د بېلګې په توګه، **−**(x **−** 5) = **−**x **+** 5.",
        ],
      ),
    },
    // 15 — heading "Comment résoudre"
    {
      text: S(
        "Comment résoudre",
        "How to solve",
        "كيف نحل",
        "چگونه حل کنیم",
        "ከመይ ንፈትሕ",
        "Як розв'язувати",
        "Como resolver",
        "Sida lo xalliyo",
        "Nasıl çözülür",
        "څنګه حل کړو",
      ),
    },
    // 16 — theory_tabs
    {},
    // 7 — heading "1. Équation simple : x + b = c"
    {
      text: S(
        "1. Équation simple : x + b = c",
        "1. Simple equation: x + b = c",
        "1. معادلة بسيطة: x + b = c",
        "1. معادله ساده: x + b = c",
        "1. ቀሊል ምዕርርያት: x + b = c",
        "1. Просте рівняння: x + b = c",
        "1. Equação simples: x + b = c",
        "1. Isle'eg fudud: x + b = c",
        "1. Basit denklem: x + b = c",
        "1. ساده معادله: x + b = c",
      ),
    },
    // 8 — section x + 7 = 12
    {
      label: S(
        "Exemple : x + 7 = 12",
        "Example: x + 7 = 12",
        "مثال: x + 7 = 12",
        "مثال: x + 7 = 12",
        "ኣብነት: x + 7 = 12",
        "Приклад: x + 7 = 12",
        "Exemplo: x + 7 = 12",
        "Tusaale: x + 7 = 12",
        "Örnek: x + 7 = 12",
        "بېلګه: x + 7 = 12",
      ),
      items: A(
        [
          "On enlève 7 des deux côtés.",
          "x + 7 **− 7** = 12 **− 7**",
          "x = 5",
          "Vérification : 5 + 7 = 12 ✓",
        ],
        [
          "Remove 7 from both sides.",
          "x + 7 **− 7** = 12 **− 7**",
          "x = 5",
          "Check: 5 + 7 = 12 ✓",
        ],
        [
          "نطرح 7 من الطرفين.",
          "x + 7 **− 7** = 12 **− 7**",
          "x = 5",
          "التحقق: 5 + 7 = 12 ✓",
        ],
        [
          "7 را از دو طرف کم می‌کنیم.",
          "x + 7 **− 7** = 12 **− 7**",
          "x = 5",
          "بررسی: 5 + 7 = 12 ✓",
        ],
        [
          "7 ካብ ክልተ ኣካላት ንኸፍል።",
          "x + 7 **− 7** = 12 **− 7**",
          "x = 5",
          "ምርግጋጽ: 5 + 7 = 12 ✓",
        ],
        [
          "Віднімаємо 7 з обох боків.",
          "x + 7 **− 7** = 12 **− 7**",
          "x = 5",
          "Перевірка: 5 + 7 = 12 ✓",
        ],
        [
          "Retiramos 7 dos dois lados.",
          "x + 7 **− 7** = 12 **− 7**",
          "x = 5",
          "Verificação: 5 + 7 = 12 ✓",
        ],
        [
          "Ka saar 7 labada dhinac.",
          "x + 7 **− 7** = 12 **− 7**",
          "x = 5",
          "Hubinta: 5 + 7 = 12 ✓",
        ],
        [
          "Her iki taraftan 7 çıkar.",
          "x + 7 **− 7** = 12 **− 7**",
          "x = 5",
          "Kontrol: 5 + 7 = 12 ✓",
        ],
        [
          "له دواړو خواوو 7 لرې کوو.",
          "x + 7 **− 7** = 12 **− 7**",
          "x = 5",
          "ګڼون: 5 + 7 = 12 ✓",
        ],
      ),
    },
    // 9 — heading "2. Équation de la forme ax = b"
    {
      text: S(
        "2. Équation de la forme ax = b",
        "2. Equation of the form ax = b",
        "2. معادلة من الشكل ax = b",
        "2. معادله به شکل ax = b",
        "2. ምዕርርያት ቅርጺ ax = b",
        "2. Рівняння виду ax = b",
        "2. Equação da forma ax = b",
        "2. Isle'eg qaabka ax = b",
        "2. ax = b biçiminde denklem",
        "2. د ax = b بڼه معادله",
      ),
    },
    // 10 — section 3x = 15
    {
      label: S(
        "Exemple : 3x = 15",
        "Example: 3x = 15",
        "مثال: 3x = 15",
        "مثال: 3x = 15",
        "ኣብነት: 3x = 15",
        "Приклад: 3x = 15",
        "Exemplo: 3x = 15",
        "Tusaale: 3x = 15",
        "Örnek: 3x = 15",
        "بېلګه: 3x = 15",
      ),
      items: A(
        [
          "3x signifie 3 × x.",
          "On divise les deux côtés par 3.",
          "x = 15 ÷ 3 = 5",
          "Vérification : 3 × 5 = 15 ✓",
        ],
        [
          "3x means 3 × x.",
          "Divide both sides by 3.",
          "x = 15 ÷ 3 = 5",
          "Check: 3 × 5 = 15 ✓",
        ],
        [
          "3x تعني 3 × x.",
          "نقسم الطرفين على 3.",
          "x = 15 ÷ 3 = 5",
          "التحقق: 3 × 5 = 15 ✓",
        ],
        [
          "3x یعنی 3 × x.",
          "دو طرف را بر 3 تقسیم می‌کنیم.",
          "x = 15 ÷ 3 = 5",
          "بررسی: 3 × 5 = 15 ✓",
        ],
        [
          "3x ማለት 3 × x እዩ።",
          "ክልተ ኣካላት ብ 3 ክንከፋል።",
          "x = 15 ÷ 3 = 5",
          "ምርግጋጽ: 3 × 5 = 15 ✓",
        ],
        [
          "3x означає 3 × x.",
          "Ділимо обидва боки на 3.",
          "x = 15 ÷ 3 = 5",
          "Перевірка: 3 × 5 = 15 ✓",
        ],
        [
          "3x significa 3 × x.",
          "Dividimos os dois lados por 3.",
          "x = 15 ÷ 3 = 5",
          "Verificação: 3 × 5 = 15 ✓",
        ],
        [
          "3x waxay ka dhigan tahay 3 × x.",
          "Labada dhinac u qaybi 3.",
          "x = 15 ÷ 3 = 5",
          "Hubinta: 3 × 5 = 15 ✓",
        ],
        [
          "3x, 3 × x anlamına gelir.",
          "Her iki tarafı 3'e böl.",
          "x = 15 ÷ 3 = 5",
          "Kontrol: 3 × 5 = 15 ✓",
        ],
        [
          "3x معنی 3 × x دی.",
          "دواړه خواوې په 3 ووېشو.",
          "x = 15 ÷ 3 = 5",
          "ګڼون: 3 × 5 = 15 ✓",
        ],
      ),
    },
    // 11 — heading "3. Équation de la forme ax + b = c"
    {
      text: S(
        "3. Équation de la forme ax + b = c",
        "3. Equation of the form ax + b = c",
        "3. معادلة من الشكل ax + b = c",
        "3. معادله به شکل ax + b = c",
        "3. ምዕርርያት ቅርጺ ax + b = c",
        "3. Рівняння виду ax + b = c",
        "3. Equação da forma ax + b = c",
        "3. Isle'eg qaabka ax + b = c",
        "3. ax + b = c biçiminde denklem",
        "3. د ax + b = c بڼه معادله",
      ),
    },
    // 12 — section 2x + 5 = 13
    {
      label: S(
        "Exemple : 2x + 5 = 13",
        "Example: 2x + 5 = 13",
        "مثال: 2x + 5 = 13",
        "مثال: 2x + 5 = 13",
        "ኣብነት: 2x + 5 = 13",
        "Приклад: 2x + 5 = 13",
        "Exemplo: 2x + 5 = 13",
        "Tusaale: 2x + 5 = 13",
        "Örnek: 2x + 5 = 13",
        "بېلګه: 2x + 5 = 13",
      ),
      items: A(
        [
          "On enlève d'abord 5 : 2x = 13 − 5 = 8.",
          "On divise ensuite par 2 : x = 8 ÷ 2 = 4.",
          "Vérification : 2 × 4 + 5 = 13 ✓",
        ],
        [
          "First remove 5: 2x = 13 − 5 = 8.",
          "Then divide by 2: x = 8 ÷ 2 = 4.",
          "Check: 2 × 4 + 5 = 13 ✓",
        ],
        [
          "نطرح أولاً 5: 2x = 13 − 5 = 8.",
          "ثم نقسم على 2: x = 8 ÷ 2 = 4.",
          "التحقق: 2 × 4 + 5 = 13 ✓",
        ],
        [
          "ابتدا 5 را کم می‌کنیم: 2x = 13 − 5 = 8.",
          "سپس بر 2 تقسیم می‌کنیم: x = 8 ÷ 2 = 4.",
          "بررسی: 2 × 4 + 5 = 13 ✓",
        ],
        [
          "መጀመርታ 5 ንኸፍል: 2x = 13 − 5 = 8.",
          "ድሕሪኡ ብ 2 ክንከፋል: x = 8 ÷ 2 = 4.",
          "ምርግጋጽ: 2 × 4 + 5 = 13 ✓",
        ],
        [
          "Спочатку віднімаємо 5: 2x = 13 − 5 = 8.",
          "Потім ділимо на 2: x = 8 ÷ 2 = 4.",
          "Перевірка: 2 × 4 + 5 = 13 ✓",
        ],
        [
          "Primeiro retiramos 5: 2x = 13 − 5 = 8.",
          "Depois dividimos por 2: x = 8 ÷ 2 = 4.",
          "Verificação: 2 × 4 + 5 = 13 ✓",
        ],
        [
          "Marka hore ka saar 5: 2x = 13 − 5 = 8.",
          "Kadib u qaybi 2: x = 8 ÷ 2 = 4.",
          "Hubinta: 2 × 4 + 5 = 13 ✓",
        ],
        [
          "Önce 5'i çıkar: 2x = 13 − 5 = 8.",
          "Sonra 2'ye böl: x = 8 ÷ 2 = 4.",
          "Kontrol: 2 × 4 + 5 = 13 ✓",
        ],
        [
          "لومړی 5 لرې کوو: 2x = 13 − 5 = 8.",
          "بیا په 2 ووېشو: x = 8 ÷ 2 = 4.",
          "ګڼون: 2 × 4 + 5 = 13 ✓",
        ],
      ),
    },
    // 13 — heading "4. x apparaît des deux côtés"
    {
      text: S(
        "4. x apparaît des deux côtés",
        "4. x appears on both sides",
        "4. x يظهر في الطرفين",
        "4. x در دو طرف ظاهر می‌شود",
        "4. x ኣብ ክልተ ኣካላት ይርአ",
        "4. x з'являється з обох боків",
        "4. x aparece dos dois lados",
        "4. x wuxuu ka muuqdaa labada dhinac",
        "4. x her iki tarafta da görünür",
        "4. x په دواړو خواوو کې څرګندېږي",
      ),
    },
    // 14 — section 3x + 2 = x + 10
    {
      label: S(
        "Exemple : 3x + 2 = x + 10",
        "Example: 3x + 2 = x + 10",
        "مثال: 3x + 2 = x + 10",
        "مثال: 3x + 2 = x + 10",
        "ኣብነት: 3x + 2 = x + 10",
        "Приклад: 3x + 2 = x + 10",
        "Exemplo: 3x + 2 = x + 10",
        "Tusaale: 3x + 2 = x + 10",
        "Örnek: 3x + 2 = x + 10",
        "بېلګه: 3x + 2 = x + 10",
      ),
      items: A(
        [
          "On regroupe les x : 3x − x = 10 − 2.",
          "2x = 8",
          "x = 4",
          "Vérification : 3 × 4 + 2 = 4 + 10 = 14 ✓",
        ],
        [
          "Group the x terms: 3x − x = 10 − 2.",
          "2x = 8",
          "x = 4",
          "Check: 3 × 4 + 2 = 4 + 10 = 14 ✓",
        ],
        [
          "نجمع حدود x: 3x − x = 10 − 2.",
          "2x = 8",
          "x = 4",
          "التحقق: 3 × 4 + 2 = 4 + 10 = 14 ✓",
        ],
        [
          "جمله‌های x را جمع می‌کنیم: 3x − x = 10 − 2.",
          "2x = 8",
          "x = 4",
          "بررسی: 3 × 4 + 2 = 4 + 10 = 14 ✓",
        ],
        [
          "ኣካላት x ጽምር: 3x − x = 10 − 2.",
          "2x = 8",
          "x = 4",
          "ምርግጋጽ: 3 × 4 + 2 = 4 + 10 = 14 ✓",
        ],
        [
          "Збираємо доданки з x: 3x − x = 10 − 2.",
          "2x = 8",
          "x = 4",
          "Перевірка: 3 × 4 + 2 = 4 + 10 = 14 ✓",
        ],
        [
          "Agrupamos os x: 3x − x = 10 − 2.",
          "2x = 8",
          "x = 4",
          "Verificação: 3 × 4 + 2 = 4 + 10 = 14 ✓",
        ],
        [
          "Ku ururi x: 3x − x = 10 − 2.",
          "2x = 8",
          "x = 4",
          "Hubinta: 3 × 4 + 2 = 4 + 10 = 14 ✓",
        ],
        [
          "x terimlerini topla: 3x − x = 10 − 2.",
          "2x = 8",
          "x = 4",
          "Kontrol: 3 × 4 + 2 = 4 + 10 = 14 ✓",
        ],
        [
          "د x جملې راټولې کړئ: 3x − x = 10 − 2.",
          "2x = 8",
          "x = 4",
          "ګڼون: 3 × 4 + 2 = 4 + 10 = 14 ✓",
        ],
      ),
    },
    // 15 — heading "5. Équations avec parenthèses"
    {
      text: S(
        "5. Équations avec parenthèses",
        "5. Equations with brackets",
        "5. معادلات بأقواس",
        "5. معادلات با پرانتز",
        "5. ምዕርርያት ምስ ተወሳኺ",
        "5. Рівняння з дужками",
        "5. Equações com parênteses",
        "5. Isle'egyo leh xidhiidh",
        "5. Parantezli denklemler",
        "5. د پرانتزونو معادلې",
      ),
    },
    // 16 — plain
    {
      text: S(
        "On commence par développer les parenthèses, puis on résout l'équation obtenue avec la méthode habituelle.",
        "Start by expanding the brackets, then solve the resulting equation using the usual method.",
        "نبدأ بتوسيع الأقواس، ثم نحل المعادلة الناتجة بالطريقة المعتادة.",
        "ابتدا پرانتزها را باز می‌کنیم، سپس معادله به‌دست‌آمده را با روش معمول حل می‌کنیم.",
        "መጀመርታ ተወሳኺ ኣስፋሕ፣ ድሕሪኡ ነቲ ዝወጸ ምዕርርያት ብሰሚናዊ ኣገባብ ፍታሕ።",
        "Спочатку розкриваємо дужки, потім розв'язуємо отримане рівняння звичним методом.",
        "Começamos por desenvolver os parênteses, depois resolvemos a equação obtida pelo método habitual.",
        "Marka hore furfur xidhiidhada, kadibna xalli isle'egta soo baxday habka caadiga ah.",
        "Önce parantezleri aç, sonra elde edilen denklemi alışılmış yöntemle çöz.",
        "لومړی پرانتزونه پراخې کړئ، بیا ترلاسه شوې معادله په عادي لاره حل کړئ.",
      ),
    },
    // 17 — section 3(2x + 1) = 21
    {
      label: S(
        "Exemple : 3(2x + 1) = 21",
        "Example: 3(2x + 1) = 21",
        "مثال: 3(2x + 1) = 21",
        "مثال: 3(2x + 1) = 21",
        "ኣብነት: 3(2x + 1) = 21",
        "Приклад: 3(2x + 1) = 21",
        "Exemplo: 3(2x + 1) = 21",
        "Tusaale: 3(2x + 1) = 21",
        "Örnek: 3(2x + 1) = 21",
        "بېلګه: 3(2x + 1) = 21",
      ),
      items: A(
        [
          "On développe : 6x + 3 = 21.",
          "On enlève 3 : 6x = 18.",
          "On divise par 6 : x = 3.",
        ],
        [
          "Expand: 6x + 3 = 21.",
          "Remove 3: 6x = 18.",
          "Divide by 6: x = 3.",
        ],
        [
          "نوسّع: 6x + 3 = 21.",
          "نطرح 3: 6x = 18.",
          "نقسم على 6: x = 3.",
        ],
        [
          "باز می‌کنیم: 6x + 3 = 21.",
          "3 را کم می‌کنیم: 6x = 18.",
          "بر 6 تقسیم می‌کنیم: x = 3.",
        ],
        [
          "ኣስፋሕ: 6x + 3 = 21.",
          "3 ንኸፍል: 6x = 18.",
          "ብ 6 ክንከፋል: x = 3.",
        ],
        [
          "Розкриваємо: 6x + 3 = 21.",
          "Віднімаємо 3: 6x = 18.",
          "Ділимо на 6: x = 3.",
        ],
        [
          "Desenvolvemos: 6x + 3 = 21.",
          "Retiramos 3: 6x = 18.",
          "Dividimos por 6: x = 3.",
        ],
        [
          "Furfurnaa: 6x + 3 = 21.",
          "Ka saar 3: 6x = 18.",
          "U qaybi 6: x = 3.",
        ],
        [
          "Aç: 6x + 3 = 21.",
          "3'ü çıkar: 6x = 18.",
          "6'ya böl: x = 3.",
        ],
        [
          "پراخې کړئ: 6x + 3 = 21.",
          "3 لرې کړئ: 6x = 18.",
          "په 6 ووېشئ: x = 3.",
        ],
      ),
    },
    // 18 — note (attention sign)
    {
      text: S(
        "Attention : un signe − placé devant une parenthèse change tous les signes à l'intérieur. Par exemple, −(x − 5) = −x + 5.",
        "Warning: a − sign in front of a bracket changes all the signs inside. For example, −(x − 5) = −x + 5.",
        "تنبيه: علامة − أمام قوس تغيّر جميع الإشارات داخلها. مثلاً: −(x − 5) = −x + 5.",
        "توجه: علامت − جلوی پرانتز همه علامت‌های داخل را عوض می‌کند. مثلاً: −(x − 5) = −x + 5.",
        "ሓሳር: − ኣብ ቅድሚ ተወሳኺ ኩሉ ምልክታት ኣብ ዘሎ ይቀይር። ኣብነት: −(x − 5) = −x + 5.",
        "Увага: знак − перед дужкою змінює всі знаки всередині. Наприклад: −(x − 5) = −x + 5.",
        "Atenção: um sinal − à frente de um parêntese muda todos os sinais dentro. Por exemplo: −(x − 5) = −x + 5.",
        "Digniin: calaamadda − horteeda xidhiidh waxay beddeshaa dhammaan calaamadaha gudaha. Tusaale: −(x − 5) = −x + 5.",
        "Dikkat: Parantezin önündeki − işareti içerideki tüm işaretleri değiştirir. Örneğin: −(x − 5) = −x + 5.",
        "پاملرنه: د پرانتز مخکې − نښه دننه ټولې نښې بدلوي. بېلګه: −(x − 5) = −x + 5.",
      ),
    },
    // 19 — note (verification)
    {
      text: S(
        "La vérification se fait toujours dans l'équation de départ. Elle permet de repérer rapidement une erreur de signe ou de calcul.",
        "Always check the solution in the original equation. This helps quickly spot a sign or calculation error.",
        "يُجرى التحقق دائماً في المعادلة الأصلية. يساعد على اكتشاف خطأ في الإشارة أو الحساب بسرعة.",
        "بررسی همیشه در معادله اولیه انجام می‌شود. این کار به یافتن سریع خطای علامت یا محاسبه کمک می‌کند.",
        "ምርግጋጽ ኩሉ ግዜ ኣብ መጀመርታ ምዕርርያት ይግበር። ንምልክት ወይ ስሒብ ጌጋ ብቕልጡፍ ንምርካብ ይሕግዝ።",
        "Перевірку завжди роблять у початковому рівнянні. Це допомагає швидко помітити помилку знака або обчислення.",
        "A verificação faz-se sempre na equação inicial. Permite detetar rapidamente um erro de sinal ou de cálculo.",
        "Hubinta had iyo jeer waxaa lagu sameeyaa isle'egta bilowga ah. Waxay ka caawisaa si degdeg ah u ogaanshaha qalad calaamad ama xisaab.",
        "Kontrol her zaman başlangıç denkleminde yapılır. İşaret veya hesap hatasını hızlıca fark etmeye yardımcı olur.",
        "ګڼون تل په اصلي معادله کې کېږي. دا د نښې یا محاسبې تېروتنې ژر موندلو کې مرسته کوي.",
      ),
    },
  ],
};
