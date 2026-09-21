import type { SubmoduleTrad } from "./trad-types";

const S = (fr: string, en: string, ar: string, fa: string, ti: string, uk: string, pt: string, so: string, tr: string, ps: string) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

const A = (fr: string[], en: string[], ar: string[], fa: string[], ti: string[], uk: string[], pt: string[], so: string[], tr: string[], ps: string[]) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

export const TRAD_A6_2: SubmoduleTrad = {
  submoduleId: "A6-2",
  title: S(
    "Pourcentage d'un nombre",
    "Percentage of a number",
    "النسبة المئوية من عدد",
    "درصدی از یک عدد",
    "ሚእታዊ ናይ ቁጽሪ",
    "Відсоток від числа",
    "Percentagem de um número",
    "Boqolley ka mid ah tiro",
    "Bir sayının yüzdesi",
    "د يو عدد سلنه"
  ),
  paragraphs: A(
    [
      "Pour calculer p% d'un nombre N, on multiplie N par p/100 (ou par le décimal équivalent).",
      "On peut aussi convertir le pourcentage en nombre décimal : 20% = 0,20.",
      "Exemple : 20% de 150 = 150 × 20/100 = 150 × 0,20 = 30.",
    ],
    [
      "To calculate p% of a number N, multiply N by p/100 (or the equivalent decimal).",
      "You can also convert the percentage into a decimal: 20% = 0.20.",
      "Example: 20% of 150 = 150 × 20/100 = 150 × 0.20 = 30.",
    ],
    [
      "لحساب p% من عدد N نضرب N في p/100 (أو ما يعادله من الأعداد العشرية).",
      "يمكننا أيضا تحويل النسبة المئوية إلى عدد عشري: 20% = 0,20.",
      "مثال: 20% من 150 = 150 × 20/100 = 150 × 0,20 = 30.",
    ],
    [
      "برای محاسبه p% از عدد N، عدد N را در p/100 (یا معادل اعشاری آن) ضرب می‌کنیم.",
      "همچنین می‌توان درصد را به عدد اعشاری تبدیل کرد: 20% = 0,20.",
      "مثال: 20% از 150 = 150 × 20/100 = 150 × 0,20 = 30.",
    ],
    [
      "p% ናይ N ንምሕሳብ፣ N ብ p/100 (ወይ ብዝምልከቶ ዲሲማል) ንበዝሖ።",
      "ሚእታዊ ናብ ዲሲማል ክንቕይሮ ንኽእል፦ 20% = 0,20።",
      "ኣብነት፦ 20% ናይ 150 = 150 × 20/100 = 150 × 0,20 = 30።",
    ],
    [
      "Щоб обчислити p% від числа N, множимо N на p/100 (або на еквівалентне десяткове число).",
      "Також можна перетворити відсоток у десяткове число: 20% = 0,20.",
      "Приклад: 20% від 150 = 150 × 20/100 = 150 × 0,20 = 30.",
    ],
    [
      "Para calcular p% de um número N, multiplica-se N por p/100 (ou pelo decimal equivalente).",
      "Também se pode converter a percentagem num decimal: 20% = 0,20.",
      "Exemplo: 20% de 150 = 150 × 20/100 = 150 × 0,20 = 30.",
    ],
    [
      "Si loo xisaabiyo p% oo ka mid ah tiro N, N waxaa lagu dhuftaa p/100 (ama jajabka tobanle ee u dhigma).",
      "Boqolleyda sidoo kale waxaa loo rogi karaa tiro jajab tobanle ah: 20% = 0,20.",
      "Tusaale: 20% oo ka mid ah 150 = 150 × 20/100 = 150 × 0,20 = 30.",
    ],
    [
      "Bir N sayısının p%'sini hesaplamak için N sayısını p/100 (veya eşdeğer ondalık) ile çarparız.",
      "Yüzdeyi ondalık sayıya da çevirebiliriz: 20% = 0,20.",
      "Örnek: 150'nin 20%'si = 150 × 20/100 = 150 × 0,20 = 30.",
    ],
    [
      "د N عدد p% د محاسبې لپاره N د p/100 (يا برابر اعشاري عدد) سره ضربوو.",
      "سلنه اعشاري عدد ته هم اړول کېدای شي: 20% = 0,20.",
      "بېلګه: د 150، 20% = 150 × 20/100 = 150 × 0,20 = 30.",
    ]
  ),
  blocks: [
    // Block 0: heading "Comment calculer le pourcentage" (black)
    { text: S(
      "Comment calculer le pourcentage",
      "How to calculate a percentage",
      "كيفية حساب النسبة المئوية",
      "چگونه درصد را محاسبه کنیم",
      "ሚእታዊ ብኸምዚ ይሕሰብ",
      "Як обчислити відсоток",
      "Como calcular a percentagem",
      "Sida loo xisaabiyo boqolleyda",
      "Yüzde nasıl hesaplanır",
      "سلنه څنګه محاسبه کړو"
    ) },
    // Block 1: plain
    { text: S(
      "Pour calculer p% d'un nombre N, on multiplie N par p/100 (ou par le décimal équivalent).",
      "To calculate p% of a number N, multiply N by p/100 (or the equivalent decimal).",
      "لحساب p% من عدد N نضرب N في p/100 (أو ما يعادله من الأعداد العشرية).",
      "برای محاسبه p% از عدد N، عدد N را در p/100 (یا معادل اعشاری آن) ضرب می‌کنیم.",
      "p% ናይ N ንምሕሳብ፣ N ብ p/100 (ወይ ብዝምልከቶ ዲሲማል) ንበዝሖ።",
      "Щоб обчислити p% від числа N, множимо N на p/100 (або на еквівалентне десяткове число).",
      "Para calcular p% de um número N, multiplica-se N por p/100 (ou pelo decimal equivalente).",
      "Si loo xisaabiyo p% oo ka mid ah tiro N, N waxaa lagu dhuftaa p/100 (ama jajabka tobanle ee u dhigma).",
      "Bir N sayısının p%'sini hesaplamak için N sayısını p/100 (veya eşdeğer ondalık) ile çarparız.",
      "د N عدد p% د محاسبې لپاره N د p/100 (يا برابر اعشاري عدد) سره ضربوو."
    ) },
    // Block 2: spacer
    {},
    // Block 3: highlight "Formule"
    { text: S(
      "Formule",
      "Formula",
      "الصيغة",
      "فرمول",
      "ቀመር",
      "Формула",
      "Fórmula",
      "Qaaciddo",
      "Formül",
      "فورمول"
    ) },
    // Block 4: section itemsFr: ["p% de N = N × p ÷ 100"]
    { items: A(
      ["p% de N = N × p ÷ 100"],
      ["p% of N = N × p ÷ 100"],
      ["p% من N = N × p ÷ 100"],
      ["p% از N = N × p ÷ 100"],
      ["p% ናይ N = N × p ÷ 100"],
      ["p% від N = N × p ÷ 100"],
      ["p% de N = N × p ÷ 100"],
      ["p% ee N = N × p ÷ 100"],
      ["N'nin p%'si = N × p ÷ 100"],
      ["د N، p% = N × p ÷ 100"]
    ) },
    // Block 5: spacer
    {},
    // Block 6: heading "Méthode pas à pas"
    { text: S(
      "Méthode pas à pas",
      "Step-by-step method",
      "الطريقة خطوة بخطوة",
      "روش گام‌به‌گام",
      "ደረጃ ብደረጃ ሜላ",
      "Покроковий метод",
      "Método passo a passo",
      "Hab tallaabo-tallaabo ah",
      "Adım adım yöntem",
      "ګام په ګام طريقه"
    ) },
    // Block 7: section itemsFr steps
    { items: A(
      ["**1.** Multiplier le **nombre** par le **pourcentage**", "**2.** Diviser le résultat par **100**"],
      ["**1.** Multiply the **number** by the **percentage**", "**2.** Divide the result by **100**"],
      ["**1.** اضرب **العدد** في **النسبة المئوية**", "**2.** اقسم النتيجة على **100**"],
      ["**1.** **عدد** را در **درصد** ضرب کن", "**2.** نتیجه را بر **100** تقسیم کن"],
      ["**1.** **ቁጽሪ** ብ **ሚእታዊ** ኣባዝሕ", "**2.** ውጽኢት ብ **100** ኣካፍል"],
      ["**1.** Помножити **число** на **відсоток**", "**2.** Поділити результат на **100**"],
      ["**1.** Multiplicar o **número** pela **percentagem**", "**2.** Dividir o resultado por **100**"],
      ["**1.** **Tirada** ku dhufo **boqolleyda**", "**2.** Natiijada u qaybi **100**"],
      ["**1.** **Sayıyı** **yüzde** ile çarp", "**2.** Sonucu **100**'e böl"],
      ["**1.** **عدد** د **سلنې** سره ضرب کړه", "**2.** پايله پر **100** ووېشه"]
    ) },
    // Block 8: spacer
    {},
    // Block 9: section example calculation
    { items: A(
      ["20% de 150 élèves", "**150** × **20** = 3000", "3000 ÷ **100** = 30 élèves"],
      ["20% of 150 students", "**150** × **20** = 3000", "3000 ÷ **100** = 30 students"],
      ["20% من 150 تلميذا", "**150** × **20** = 3000", "3000 ÷ **100** = 30 تلميذا"],
      ["20% از 150 دانش‌آموز", "**150** × **20** = 3000", "3000 ÷ **100** = 30 دانش‌آموز"],
      ["20% ናይ 150 ተምሃሮ", "**150** × **20** = 3000", "3000 ÷ **100** = 30 ተምሃሮ"],
      ["20% від 150 учнів", "**150** × **20** = 3000", "3000 ÷ **100** = 30 учнів"],
      ["20% de 150 alunos", "**150** × **20** = 3000", "3000 ÷ **100** = 30 alunos"],
      ["20% ee 150 arday", "**150** × **20** = 3000", "3000 ÷ **100** = 30 arday"],
      ["150 öğrencinin 20%'si", "**150** × **20** = 3000", "3000 ÷ **100** = 30 öğrenci"],
      ["د 150 زده کوونکو 20%", "**150** × **20** = 3000", "3000 ÷ **100** = 30 زده کوونکي"]
    ) },
    // Block 10: spacer
    {},
    // Block 11: heading "Raccourcis utiles" (black)
    { text: S(
      "Raccourcis utiles",
      "Useful shortcuts",
      "اختصارات مفيدة",
      "میان‌برهای مفید",
      "ጠቓሚ ሓጺር መንገድታት",
      "Корисні скорочення",
      "Atalhos úteis",
      "Habab gaagaaban oo waxtar leh",
      "Yararlı kısa yollar",
      "ګټور لنډې لارې"
    ) },
    // Block 12: table with shortcuts
    { headers: A(
      ["Pourcentage", "", "Méthode rapide"],
      ["Percentage", "", "Quick method"],
      ["النسبة المئوية", "", "الطريقة السريعة"],
      ["درصد", "", "روش سریع"],
      ["ሚእታዊ", "", "ቅልጡፍ ሜላ"],
      ["Відсоток", "", "Швидкий метод"],
      ["Percentagem", "", "Método rápido"],
      ["Boqolley", "", "Hab degdeg ah"],
      ["Yüzde", "", "Hızlı yöntem"],
      ["سلنه", "", "چټکه طريقه"]
    ), items: A(
      [
        "**1%** d'un nombre | → | diviser par 100",
        "**5%** d'un nombre | → | prendre 10%, puis diviser par 2",
        "**10%** d'un nombre | → | diviser par 10",
        "**20%** d'un nombre | → | diviser par 5",
        "**25%** d'un nombre | → | diviser par 4",
        "**50%** d'un nombre | → | diviser par 2",
      ],
      [
        "**1%** of a number | → | divide by 100",
        "**5%** of a number | → | take 10%, then divide by 2",
        "**10%** of a number | → | divide by 10",
        "**20%** of a number | → | divide by 5",
        "**25%** of a number | → | divide by 4",
        "**50%** of a number | → | divide by 2",
      ],
      [
        "**1%** من عدد | → | اقسم على 100",
        "**5%** من عدد | → | خذ 10% ثم اقسم على 2",
        "**10%** من عدد | → | اقسم على 10",
        "**20%** من عدد | → | اقسم على 5",
        "**25%** من عدد | → | اقسم على 4",
        "**50%** من عدد | → | اقسم على 2",
      ],
      [
        "**1%** از یک عدد | → | تقسیم بر 100",
        "**5%** از یک عدد | → | 10% را بگیر، سپس تقسیم بر 2",
        "**10%** از یک عدد | → | تقسیم بر 10",
        "**20%** از یک عدد | → | تقسیم بر 5",
        "**25%** از یک عدد | → | تقسیم بر 4",
        "**50%** از یک عدد | → | تقسیم بر 2",
      ],
      [
        "**1%** ናይ ቁጽሪ | → | ብ100 ክፈል",
        "**5%** ናይ ቁጽሪ | → | 10% ውሰድ፣ ብድሕሪኡ ብ2 ክፈል",
        "**10%** ናይ ቁጽሪ | → | ብ10 ክፈል",
        "**20%** ናይ ቁጽሪ | → | ብ5 ክፈል",
        "**25%** ናይ ቁጽሪ | → | ብ4 ክፈል",
        "**50%** ናይ ቁጽሪ | → | ብ2 ክፈል",
      ],
      [
        "**1%** від числа | → | поділити на 100",
        "**5%** від числа | → | взяти 10%, потім поділити на 2",
        "**10%** від числа | → | поділити на 10",
        "**20%** від числа | → | поділити на 5",
        "**25%** від числа | → | поділити на 4",
        "**50%** від числа | → | поділити на 2",
      ],
      [
        "**1%** de um número | → | dividir por 100",
        "**5%** de um número | → | calcular 10%, depois dividir por 2",
        "**10%** de um número | → | dividir por 10",
        "**20%** de um número | → | dividir por 5",
        "**25%** de um número | → | dividir por 4",
        "**50%** de um número | → | dividir por 2",
      ],
      [
        "**1%** tiro | → | u qaybi 100",
        "**5%** tiro | → | qaado 10%, ka dib u qaybi 2",
        "**10%** tiro | → | u qaybi 10",
        "**20%** tiro | → | u qaybi 5",
        "**25%** tiro | → | u qaybi 4",
        "**50%** tiro | → | u qaybi 2",
      ],
      [
        "Bir sayının **1%**'i | → | 100'e böl",
        "Bir sayının **5%**'i | → | 10%'u al, sonra 2'ye böl",
        "Bir sayının **10%**'u | → | 10'a böl",
        "Bir sayının **20%**'si | → | 5'e böl",
        "Bir sayının **25%**'i | → | 4'e böl",
        "Bir sayının **50%**'si | → | 2'ye böl",
      ],
      [
        "د عدد **1%** | → | پر 100 وېشل",
        "د عدد **5%** | → | 10% واخلئ، بيا پر 2 ووېشئ",
        "د عدد **10%** | → | پر 10 وېشل",
        "د عدد **20%** | → | پر 5 وېشل",
        "د عدد **25%** | → | پر 4 وېشل",
        "د عدد **50%** | → | پر 2 وېشل",
      ]
    ) },
    // Block 13: spacer
    {},
    // Block 14: table with math expressions — leave as French (numbers only)
    {},
    // Block 15: spacer
    {},
    // Block 16: highlight "Vérification"
    { text: S(
      "Vérification",
      "Check",
      "التحقق",
      "بررسی",
      "ምርግጋጽ",
      "Перевірка",
      "Verificação",
      "Hubin",
      "Kontrol",
      "کتنه"
    ) },
    // Block 17: plain with verification rule
    { text: S(
      "Si le pourcentage est **inférieur à 100%**, le résultat doit **toujours** être **plus petit** que le nombre de départ.",
      "If the percentage is **less than 100%**, the result must **always** be **smaller** than the starting number.",
      "إذا كانت النسبة المئوية **أقل من 100%** فيجب أن تكون النتيجة **دائما** **أصغر** من العدد الأصلي.",
      "اگر درصد **کمتر از 100%** باشد، نتیجه باید **همیشه** **کوچک‌تر** از عدد اولیه باشد.",
      "ሚእታዊ **ካብ 100% ዝነኣሰ** እንተኾነ፣ ውጽኢት **ኩሉ ግዜ** ካብ መጀመርታ ቁጽሪ **ዝነኣሰ** ክኸውን ኣለዎ።",
      "Якщо відсоток **менший за 100%**, результат має **завжди** бути **меншим** за початкове число.",
      "Se a percentagem for **inferior a 100%**, o resultado deve **sempre** ser **menor** do que o número inicial.",
      "Haddii boqolleydu **ka yar tahay 100%**, natiijadu waa **had iyo jeer** inay **ka yar tahay** tiradii bilowga ahayd.",
      "Yüzde **100%'den küçükse**, sonuç başlangıç sayısından **her zaman** **küçük** olmalıdır.",
      "که سلنه **له 100% کمه** وي، پايله بايد **تل** د پيلني عدد **کمه** وي."
    ) },
    // Block 18: spacer
    {},
    // Block 19: heading "Exprimer une partie en pourcentage" (black)
    { text: S(
      "Exprimer une partie en pourcentage",
      "Express a part as a percentage",
      "التعبير عن جزء بنسبة مئوية",
      "بیان یک بخش به صورت درصد",
      "ክፋል ብሚእታዊ ምግላጽ",
      "Виразити частину у відсотках",
      "Exprimir uma parte em percentagem",
      "Qayb ku muujinta boqolley",
      "Bir parçayı yüzde olarak ifade etme",
      "يوه برخه په سلنه څرګندول"
    ) },
    // Block 20: plain
    { text: S(
      "Parfois on connaît la partie et le total, et on veut savoir quel pourcentage cela représente.",
      "Sometimes we know the part and the total, and we want to know what percentage it represents.",
      "أحيانا نعرف الجزء والمجموع ونريد معرفة النسبة المئوية التي يمثلها ذلك.",
      "گاهی بخش و کل را می‌دانیم و می‌خواهیم بدانیم این چه درصدی است.",
      "ሓድሓደ ግዜ ክፋልን ጠቕላላን ንፈልጥ፣ እዚ ክንደይ ሚእታዊ ከምዝኾነ ንደሊ።",
      "Іноді ми знаємо частину і загальну кількість та хочемо дізнатися, який це відсоток.",
      "Por vezes conhecemos a parte e o total, e queremos saber que percentagem isso representa.",
      "Mararka qaar waxaan naqaan qaybta iyo wadarta, waxaana rabnaa inaan ogaano boqolleyda ay matalayso.",
      "Bazen parçayı ve toplamı biliriz ve bunun hangi yüzdeyi temsil ettiğini öğrenmek isteriz.",
      "کله ناکله برخه او ټول معلوم وي او غواړو پوه شو دا څو سلنه ده."
    ) },
    // Block 21: highlight "Formule"
    { text: S(
      "Formule",
      "Formula",
      "الصيغة",
      "فرمول",
      "ቀመር",
      "Формула",
      "Fórmula",
      "Qaaciddo",
      "Formül",
      "فورمول"
    ) },
    // Block 22: section itemsFr formula
    { items: A(
      ["Pourcentage = (partie ÷ total) × 100", "Résultat en %"],
      ["Percentage = (part ÷ total) × 100", "Result in %"],
      ["النسبة المئوية = (الجزء ÷ المجموع) × 100", "النتيجة بـ %"],
      ["درصد = (بخش ÷ کل) × 100", "نتیجه با %"],
      ["ሚእታዊ = (ክፋል ÷ ጠቕላላ) × 100", "ውጽኢት ብ %"],
      ["Відсоток = (частина ÷ загальна кількість) × 100", "Результат у %"],
      ["Percentagem = (parte ÷ total) × 100", "Resultado em %"],
      ["Boqolley = (qayb ÷ wadar) × 100", "Natiijo % ah"],
      ["Yüzde = (parça ÷ toplam) × 100", "% olarak sonuç"],
      ["سلنه = (برخه ÷ ټول) × 100", "پايله په % کې"]
    ) },
    // Block 23: spacer
    {},
    // Block 24: heading "Méthode pas à pas"
    { text: S(
      "Méthode pas à pas",
      "Step-by-step method",
      "الطريقة خطوة بخطوة",
      "روش گام‌به‌گام",
      "ደረጃ ብደረጃ ሜላ",
      "Покроковий метод",
      "Método passo a passo",
      "Hab tallaabo-tallaabo ah",
      "Adım adım yöntem",
      "ګام په ګام طريقه"
    ) },
    // Block 25: plain "Le pourcentage de 30 élèves sur 120"
    { text: S(
      "Le pourcentage de 30 élèves sur 120",
      "The percentage of 30 students out of 120",
      "نسبة 30 تلميذا من أصل 120",
      "درصد 30 دانش‌آموز از 120 نفر",
      "ሚእታዊ 30 ተምሃሮ ካብ 120",
      "Відсоток 30 учнів із 120",
      "A percentagem de 30 alunos em 120",
      "Boqolleyda 30 arday oo ka mid ah 120",
      "120 öğrenciden 30'unun yüzdesi",
      "د 120 زده کوونکو له 30 سلنه"
    ) },
    // Block 26: section with step-by-step for expressing a part as percentage
    { items: A(
      [
        "**1.** Diviser la **partie** par le **total**",
        "30 ÷ 120 = 0,25",
        "**2.** Multiplier le résultat par **100**",
        "0,25 × **100** = 25",
        "**3.** Ajouter le symbole **%**",
        "25 + **%** = **25%**",
      ],
      [
        "**1.** Divide the **part** by the **total**",
        "30 ÷ 120 = 0.25",
        "**2.** Multiply the result by **100**",
        "0.25 × **100** = 25",
        "**3.** Add the **%** symbol",
        "25 + **%** = **25%**",
      ],
      [
        "**1.** اقسم **الجزء** على **المجموع**",
        "30 ÷ 120 = 0,25",
        "**2.** اضرب النتيجة في **100**",
        "0,25 × **100** = 25",
        "**3.** أضف الرمز **%**",
        "25 + **%** = **25%**",
      ],
      [
        "**1.** **بخش** را بر **کل** تقسیم کن",
        "30 ÷ 120 = 0,25",
        "**2.** نتیجه را در **100** ضرب کن",
        "0,25 × **100** = 25",
        "**3.** نماد **%** را اضافه کن",
        "25 + **%** = **25%**",
      ],
      [
        "**1.** **ክፋል** ብ **ጠቕላላ** ኣካፍል",
        "30 ÷ 120 = 0,25",
        "**2.** ውጽኢት ብ **100** ኣባዝሕ",
        "0,25 × **100** = 25",
        "**3.** ምልክት **%** ወስኽ",
        "25 + **%** = **25%**",
      ],
      [
        "**1.** Поділити **частину** на **загальну кількість**",
        "30 ÷ 120 = 0,25",
        "**2.** Помножити результат на **100**",
        "0,25 × **100** = 25",
        "**3.** Додати символ **%**",
        "25 + **%** = **25%**",
      ],
      [
        "**1.** Dividir a **parte** pelo **total**",
        "30 ÷ 120 = 0,25",
        "**2.** Multiplicar o resultado por **100**",
        "0,25 × **100** = 25",
        "**3.** Acrescentar o símbolo **%**",
        "25 + **%** = **25%**",
      ],
      [
        "**1.** **Qaybta** u qaybi **wadarta**",
        "30 ÷ 120 = 0,25",
        "**2.** Natiijada ku dhufo **100**",
        "0,25 × **100** = 25",
        "**3.** Ku dar calaamadda **%**",
        "25 + **%** = **25%**",
      ],
      [
        "**1.** **Parçayı** **toplama** böl",
        "30 ÷ 120 = 0,25",
        "**2.** Sonucu **100** ile çarp",
        "0,25 × **100** = 25",
        "**3.** **%** işaretini ekle",
        "25 + **%** = **25%**",
      ],
      [
        "**1.** **برخه** پر **ټول** ووېشه",
        "30 ÷ 120 = 0,25",
        "**2.** پايله پر **100** ضرب کړه",
        "0,25 × **100** = 25",
        "**3.** د **%** نښه ورزیاته کړه",
        "25 + **%** = **25%**",
      ]
    ) },
    // Block 27: spacer
    {},
    // Block 28: highlight "Vérification"
    { text: S(
      "Vérification",
      "Check",
      "التحقق",
      "بررسی",
      "ምርግጋጽ",
      "Перевірка",
      "Verificação",
      "Hubin",
      "Kontrol",
      "کتنه"
    ) },
    // Block 29: plain verification rule for part/total
    { text: S(
      "Le résultat est **toujours entre 0% et 100%** si la partie est **inférieure ou égale au total**.",
      "The result is **always between 0% and 100%** if the part is **less than or equal to the total**.",
      "تكون النتيجة **دائما بين 0% و100%** إذا كان الجزء **أصغر من المجموع أو مساويا له**.",
      "اگر بخش **کمتر یا برابر با کل** باشد، نتیجه **همیشه بین 0% و 100%** است.",
      "ክፋል **ካብ ጠቕላላ ዝነኣሰ ወይ ማዕረ** እንተኾነ፣ ውጽኢት **ኩሉ ግዜ ኣብ መንጎ 0%ን 100%ን** ይኸውን።",
      "Результат **завжди між 0% і 100%**, якщо частина **менша або дорівнює загальній кількості**.",
      "O resultado é **sempre entre 0% e 100%** se a parte for **inferior ou igual ao total**.",
      "Natiijadu waa **had iyo jeer u dhexaysa 0% iyo 100%** haddii qaybtu **ka yar tahay ama la siman tahay wadarta**.",
      "Parça **toplama eşit veya ondan küçükse** sonuç **her zaman 0% ile 100% arasındadır**.",
      "که برخه **له ټول سره برابره يا ترې کمه** وي، پايله **تل د 0% او 100% ترمنځ** وي."
    ) },
  ],
};
