import type { SubmoduleTrad } from "./trad-types";

const S = (fr: string, en: string, ar: string, fa: string, ti: string, uk: string, pt: string, so: string, tr: string, ps: string) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

const A = (fr: string[], en: string[], ar: string[], fa: string[], ti: string[], uk: string[], pt: string[], so: string[], tr: string[], ps: string[]) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

export const TRAD_A2_4: SubmoduleTrad = {
  submoduleId: "A2-4",
  title: S(
    "Problèmes",
    "Word problems",
    "مسائل",
    "مسئله‌ها",
    "ጸገማት",
    "Задачі",
    "Problemas",
    "Su'aalo xisaabeed",
    "Problemler",
    "مسئلې"
  ),
  blocks: [
    // Block 0 — heading "Problèmes : addition ou soustraction" (black)
    { text: S(
      "Problèmes : addition ou soustraction",
      "Problems: addition or subtraction",
      "المسائل: الجمع أو الطرح",
      "مسئله‌ها: جمع یا تفریق",
      "ጸገማት: ድምር ወይ ቀነስ",
      "Задачі: додавання або віднімання",
      "Problemas: adição ou subtração",
      "Xiisaha: isku-dar ama ka-jar",
      "Problemler: toplama veya çıkarma",
      "مسئلې: جمع یا تفریق"
    ) },
    // Block 1 — highlight "Règle importante"
    { text: S(
      "Règle importante",
      "Important rule",
      "قاعدة مهمة",
      "قانون مهم",
      "ኣገዳሲ ሕጊ",
      "Важливе правило",
      "Regra importante",
      "Xeerka muhiimka ah",
      "Önemli kural",
      "مهمه قاعده"
    ) },
    // Block 2 — plain
    { text: S(
      "Je ne choisis pas l'opération avec un mot. Je la choisis avec **la question**.",
      "I don't choose the operation with a word. I choose it with **the question**.",
      "لا أختار العملية بكلمة، بل أختارها بـ**السؤال**.",
      "من عملیات را با یک کلمه انتخاب نمی‌کنم. آن را با **سؤال** انتخاب می‌کنم.",
      "ብቃላ ኣይምረጽን ዝሰርሕ። ብ**ሕቶ** እመርጾ።",
      "Я обираю дію не за словом, а за **запитанням**.",
      "Não escolho a operação por uma palavra. Escolho-a pela **pergunta**.",
      "Xisaabta kuma doorto ereyga. Waxaan u doorto **su'aasha**.",
      "İşlemi bir kelimeyle seçmiyorum. **Soruyla** seçiyorum.",
      "زه عمليه د يوې کلمې سره نه ټاکم. د **پوښتنې** سره يې ټاکم."
    ) },
    // Block 3 — bullets labelFr "Méthode"
    { label: S(
        "Méthode",
        "Method",
        "الطريقة",
        "روش",
        "ሜላ",
        "Метод",
        "Método",
        "Hab",
        "Yöntem",
        "طريقه"
      ), items: A(
      [
        "**1.** Je lis la question.",
        "**2.** Je regarde ce que je dois trouver : **qui ? quoi ? qu'est-ce que je cherche ?**",
        "**3.** Je décide si la quantité cherchée est plus grande ou plus petite que la quantité connue.",
      ],
      [
        "**1.** I read the question.",
        "**2.** I look at what I need to find: **who? what? what am I looking for?**",
        "**3.** I decide if the quantity I am looking for is bigger or smaller than the known quantity.",
      ],
      [
        "**1.** أقرأ السؤال.",
        "**2.** أنظر ما الذي يجب إيجاده: **من؟ ماذا؟ ماذا أبحث عنه؟**",
        "**3.** أقرر إذا كانت الكمية المطلوبة أكبر أو أصغر من الكمية المعطاة.",
      ],
      [
        "**1.** سؤال را می‌خوانم.",
        "**2.** می‌بینم چه چیزی باید پیدا کنم: **چه کسی؟ چه چیزی؟ دنبال چه می‌گردم؟**",
        "**3.** تصمیم می‌گیرم که مقدار جستجو شده از مقدار معلوم بزرگ‌تر یا کوچکتر است.",
      ],
      [
        "**1.** ሕቶ ይንብብ።",
        "**2.** ክረኽቦ ዘለኒ እርኢ፡ **መን? እንታይ? እንታይ ክደሊ?**",
        "**3.** ክደሊ ዘለኒ ብዝሒ ካብ ዝፈለጥኩዎ ዝዓበየ ወይ ዝነኣሰ ምዃኑ ይወስን።",
      ],
      [
        "**1.** Читаю запитання.",
        "**2.** Дивлюся, що потрібно знайти: **хто? що? що я шукаю?**",
        "**3.** Вирішую, чи шукана величина більша або менша за відому.",
      ],
      [
        "**1.** Leio a pergunta.",
        "**2.** Vejo o que preciso encontrar: **quem? o quê? o que estou a procurar?**",
        "**3.** Decido se a quantidade procurada é maior ou menor que a quantidade conhecida.",
      ],
      [
        "**1.** Waxaan akhriyaa su'aasha.",
        "**2.** Waxaan fiiriyaa waxa aan baahan yahay inaan helo: **cidda? maxaa? maxaan raadiyaa?**",
        "**3.** Waxaan go'aamiyaa haddii tirooyinka la raadinayo ay ka weyn tahay ama ka yar tahay tirooyinka la yaqaan.",
      ],
      [
        "**1.** Soruyu okuyorum.",
        "**2.** Ne bulmam gerektiğine bakıyorum: **kim? ne? ne arıyorum?**",
        "**3.** Aranan miktarın bilinen miktardan büyük mü yoksa küçük mü olduğuna karar veriyorum.",
      ],
      [
        "**1.** پوښتنه لولم.",
        "**2.** ګورم چه باید موندلو: **چا؟ څه؟ د چا لپاره لټوم؟**",
        "**3.** پرېکړه کوم چه د لټوني مقدار د پيژندل شوي مقدار لويه يا کوچنۍ ده.",
      ],
    ) },
    // Block 4 — theory_tabs (inner blocks not translated)
    {},
    // Block 5 — heading "Attention aux mots « plus » et « moins »" (black)
    { text: S(
      "Attention aux mots « plus » et « moins »",
      "Watch out for the words \"more\" and \"less\"",
      "انتبه لكلمتي «أكثر» و«أقل»",
      "مراقب کلمات «بیشتر» و «کمتر» باشید",
      "ንቃህ ንቃላት «ዝበዝሐ» ን«ዝነኣሰ»",
      "Увага на слова «більше» і «менше»",
      "Atenção às palavras «mais» e «menos»",
      "Fiirso erayada «ka badan» iyo «ka yar»",
      "«Daha fazla» ve «daha az» sözcüklerine dikkat et",
      "د «ډير» او «لږ» كلمو خيال ساته"
    ) },
    // Block 6 — plain "Le mot **plus** ne veut pas toujours dire **Addition**."
    { text: S(
      "Le mot **plus** ne veut pas toujours dire **Addition**.",
      "The word **more** does not always mean **Addition**.",
      "كلمة **أكثر** لا تعني دائمًا **الجمع**.",
      "کلمه **بیشتر** همیشه به معنای **جمع** نیست.",
      "ቃል **ዝበዝሐ** ኩሉ ግዜ **ድምር** ማለት ኣይኮነን።",
      "Слово **більше** не завжди означає **Додавання**.",
      "A palavra **mais** não significa sempre **Adição**.",
      "Erayga **ka badan** ma macnaheeyo mar walba **isku-dar**.",
      "**Fazla** kelimesi her zaman **Toplama** anlamına gelmez.",
      "د **ډير** کلمه تل د **جمع** مانا نه لري."
    ) },
    // Block 7 — plain "Le mot **moins** ne veut pas toujours dire **soustraction**."
    { text: S(
      "Le mot **moins** ne veut pas toujours dire **soustraction**.",
      "The word **less** does not always mean **subtraction**.",
      "كلمة **أقل** لا تعني دائمًا **الطرح**.",
      "کلمه **کمتر** همیشه به معنای **تفریق** نیست.",
      "ቃል **ዝነኣሰ** ኩሉ ግዜ **ቀነስ** ማለት ኣይኮነን።",
      "Слово **менше** не завжди означає **віднімання**.",
      "A palavra **menos** não significa sempre **subtração**.",
      "Erayga **ka yar** ma macnaheeyo mar walba **ka-jar**.",
      "**Az** kelimesi her zaman **çıkarma** anlamına gelmez.",
      "د **لږ** کلمه تل د **تفریق** مانا نه لري."
    ) },
    // Block 8 — section labelFr "" (Il faut toujours regarder...)
    { label: S("", "", "", "", "", "", "", "", "", ""),
      items: A(
      ["Il faut toujours regarder ce que la question demande."],
      ["Always look at what the question asks for."],
      ["يجب دائمًا النظر إلى ما يطلبه السؤال."],
      ["همیشه باید به آنچه سؤال می‌خواهد نگاه کرد."],
      ["ሕቶ ዝሓቶ ዘሎ ኩሉ ግዜ ምርኣይ የድሊ።"],
      ["Завжди дивись на те, що питає запитання."],
      ["É preciso sempre ver o que a pergunta pede."],
      ["Waa in mar walba la fiirsadaa waxa su'aashu weydiineyso."],
      ["Sorunun ne istediğine her zaman bakılmalıdır."],
      ["تل باید وګورو چه پوښتنه څه غواړي."],
    ) },
    // Block 9 — plain "" (spacer)
    {},
    // Block 10 — table (was block 9)
    { headers: A(
      ["Situation", "Question", "Opération"],
      ["Situation", "Question", "Operation"],
      ["الوضعية", "السؤال", "العملية"],
      ["وضعیت", "سؤال", "عملیات"],
      ["ኩነታት", "ሕቶ", "ኣሰራርሓ"],
      ["Ситуація", "Запитання", "Операція"],
      ["Situação", "Pergunta", "Operação"],
      ["Xaaladda", "Su'aasha", "Xisaabta"],
      ["Durum", "Soru", "İşlem"],
      ["حالت", "پوښتنه", "عمليه"],
    ) },
    // Block 11 — heading "Petite stratégie" (black)
    { text: S(
      "Petite stratégie",
      "Quick strategy",
      "استراتيجية صغيرة",
      "استراتژی کوچک",
      "ንኡስ ሜላ",
      "Маленька стратегія",
      "Pequena estratégia",
      "Xeelad yar",
      "Küçük strateji",
      "کوچنۍ ستراتيژي"
    ) },
    // Block 12 — plain "1. Je souligne la quantité connue."
    { text: S(
      "**1.** Je souligne la quantité connue.",
      "**1.** I underline the known quantity.",
      "**1.** أسطر الكمية المعطاة.",
      "**1.** مقدار معلوم را خط می‌کشم.",
      "**1.** ዝፈለጥኩዎ ዕቐን ይስሕቦ።",
      "**1.** Підкреслюю відому величину.",
      "**1.** Sublinho a quantidade conhecida.",
      "**1.** Waxaan xariiqaa tirooyinka la yaqaan.",
      "**1.** Bilinen miktarın altını çiziyorum.",
      "**1.** د پيژندل شوي مقدار لاندې کرښه وباسم."
    ) },
    // Block 13 — plain "2. Je souligne la question."
    { text: S(
      "**2.** Je souligne la question.",
      "**2.** I underline the question.",
      "**2.** أسطر السؤال.",
      "**2.** سؤال را خط می‌کشم.",
      "**2.** ሕቶ ይስሕቦ።",
      "**2.** Підкреслюю запитання.",
      "**2.** Sublinho a pergunta.",
      "**2.** Waxaan xariiqaa su'aasha.",
      "**2.** Sorunun altını çiziyorum.",
      "**2.** د پوښتنې لاندې کرښه وباسم."
    ) },
    // Block 14 — plain "3. Je demande : la réponse..."
    { text: S(
      "**3.** Je demande : la réponse sera-t-elle **plus grande** ou **plus petite** ?",
      "**3.** I ask myself: will the answer be **bigger** or **smaller**?",
      "**3.** أسأل نفسي: هل الإجابة ستكون **أكبر** أم **أصغر**؟",
      "**3.** از خودم می‌پرسم: آیا پاسخ **بزرگتر** یا **کوچکتر** خواهد بود؟",
      "**3.** ንርእሰይ ሕቶ ይሓቶ፡ ምላሽ **ዝዓበ** ወይ **ዝነኣሰ** ኣሎ?",
      "**3.** Питаю себе: відповідь буде **більша** чи **менша**?",
      "**3.** Pergunto: a resposta será **maior** ou **menor**?",
      "**3.** Waxaan is weydiinaqa: jawaabtu ma noqon doontaa **weyn** mise **yar**?",
      "**3.** Kendime soruyorum: cevap **büyük** mü yoksa **küçük** mü olacak?",
      "**3.** له ځان پوښتم: ځواب به **لوی** وي که **کوچنی**؟"
    ) },
    // Block 15 — plain "4. Si elle est plus grande..."
    { text: S(
      "**4.** Si elle est plus grande, je fais **+**.",
      "**4.** If bigger, I do **+**.",
      "**4.** إذا كانت أكبر، أستخدم **+**.",
      "**4.** اگر بزرگتر است، **+** انجام می‌دهم.",
      "**4.** ዝዓበ ምስ ዝኸውን **+** ይገብር።",
      "**4.** Якщо більша — роблю **+**.",
      "**4.** Se maior, faço **+**.",
      "**4.** Haddii ay weyn tahay, waxaan sameyaa **+**.",
      "**4.** Büyük olacaksa **+** yapıyorum.",
      "**4.** که لوی وي، **+** کوم."
    ) },
    // Block 16 — plain "5. Si elle est plus petite..."
    { text: S(
      "**5.** Si elle est plus petite, je fais **−**.",
      "**5.** If smaller, I do **−**.",
      "**5.** إذا كانت أصغر، أستخدم **−**.",
      "**5.** اگر کوچکتر است، **−** انجام می‌دهم.",
      "**5.** ዝነኣሰ ምስ ዝኸውን **−** ይገብር።",
      "**5.** Якщо менша — роблю **−**.",
      "**5.** Se menor, faço **−**.",
      "**5.** Haddii ay yar tahay, waxaan sameyaa **−**.",
      "**5.** Küçük olacaksa **−** yapıyorum.",
      "**5.** که کوچنی وي، **−** کوم."
    ) },
  ],
  consignes: {
    wordProblems: {
      fr: "Résolvez les problèmes. Écrivez uniquement la réponse numérique.",
      en: "Solve the problems. Write only the numerical answer.",
      ar: "حلّ المسائل. اكتب الإجابة الرقمية فقط.",
      fa: "مسئله‌ها را حل کنید. فقط پاسخ عددی را بنویسید.",
      ti: "ነቶም ጸገማት ፍታሕ። ቁጽራዊ መልሲ ጥራይ ጻሕፍ።",
      uk: "Розв'яжи задачі. Запиши лише числову відповідь.",
      pt: "Resolve os problemas. Escreve apenas a resposta numérica.",
      so: "Xalli su'aalaha. Qor kaliya jawaabta tiro ahaan.",
      tr: "Problemleri çöz. Yalnızca sayısal cevabı yaz.",
      ps: "مسئلې حل کړه. یوازې عددي ځواب ولیکه.",
    },
  },
};
