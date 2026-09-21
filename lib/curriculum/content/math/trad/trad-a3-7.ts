import type { SubmoduleTrad } from "./trad-types";

const S = (fr: string, en: string, ar: string, fa: string, ti: string, uk: string, pt: string, so: string, tr: string, ps: string) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

const A = (fr: string[], en: string[], ar: string[], fa: string[], ti: string[], uk: string[], pt: string[], so: string[], tr: string[], ps: string[]) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

export const TRAD_A3_7: SubmoduleTrad = {
  submoduleId: "A3-7",
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
    // Block 0 — heading "Problèmes : multiplication ou division" (black)
    { text: S(
      "Problèmes : multiplication ou division",
      "Problems: multiplication or division",
      "المسائل: الضرب أو القسمة",
      "مسئله‌ها: ضرب یا تقسیم",
      "ጸገማት: ማብዛሕ ወይ ምክፍፋል",
      "Задачі: множення або ділення",
      "Problemas: multiplicação ou divisão",
      "Xiisaha: layso-daris ama qeybinta",
      "Problemler: çarpma veya bölme",
      "مسئلې: ضرب یا تقسیم"
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
    // Block 3 — section labelFr "Méthode"
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
        "**2.** Je repère ce qui se répète : une ligne, un paquet, une boîte, une équipe, un prix.",
        "**3.** Je demande : est-ce que je cherche un **total** ou une **part** ?",
      ],
      [
        "**1.** I read the question.",
        "**2.** I identify what repeats: a row, a package, a box, a team, a price.",
        "**3.** I ask myself: am I looking for a **total** or a **part**?",
      ],
      [
        "**1.** أقرأ السؤال.",
        "**2.** أجد ما يتكرر: صفًا أو حزمة أو صندوقًا أو فريقًا أو سعرًا.",
        "**3.** أسأل نفسي: هل أبحث عن **المجموع** أم عن **الجزء**؟",
      ],
      [
        "**1.** سؤال را می‌خوانم.",
        "**2.** چیزی که تکرار می‌شود را تشخیص می‌دهم: یک ردیف، بسته، جعبه، تیم، قیمت.",
        "**3.** از خودم می‌پرسم: آیا دنبال **کل** می‌گردم یا **یک سهم**؟",
      ],
      [
        "**1.** ሕቶ ይንብብ።",
        "**2.** ዝድገም ዘሎ ይኽሕስ: ሓደ ሰሪ, ሓደ ዕጠቕ, ሓደ ሳጹን, ሓደ ጋንታ, ሓደ ዋጋ።",
        "**3.** ንርእሰይ ሕቶ ይሓቶ፡ **ጠቕላሊ** ወይ **ክፋል** ክደሊ?",
      ],
      [
        "**1.** Читаю запитання.",
        "**2.** Знаходжу те, що повторюється: ряд, пакет, коробку, команду, ціну.",
        "**3.** Питаю себе: я шукаю **загальну кількість** чи **частину**?",
      ],
      [
        "**1.** Leio a pergunta.",
        "**2.** Identifico o que se repete: uma fila, um pacote, uma caixa, uma equipa, um preço.",
        "**3.** Pergunto: estou à procura do **total** ou de uma **parte**?",
      ],
      [
        "**1.** Waxaan akhriyaa su'aasha.",
        "**2.** Waxaan ogaadaa waxa ku celcelinaya: saf, xidmo, sanduuq, koox, qiimo.",
        "**3.** Waxaan is weydiinaqa: ma raadinayaa **wadarta** mise **qayb**?",
      ],
      [
        "**1.** Soruyu okuyorum.",
        "**2.** Tekrar edeni belirliyorum: bir sıra, bir paket, bir kutu, bir takım, bir fiyat.",
        "**3.** Kendime soruyorum: **toplam** mı yoksa **parça** mı arıyorum?",
      ],
      [
        "**1.** پوښتنه لولم.",
        "**2.** هغه شی چه تکراریږي ومومم: يوه کتار، کڅوړه، بکس، ټيم، قيمت.",
        "**3.** له ځان پوښتم: آيا **مجموعه** لټوم که **يوه برخه**؟",
      ],
    ) },
    // Block 4 — section labelFr ""
    { label: S("", "", "", "", "", "", "", "", "", ""),
      items: A(
      [
        "Si je cherche le total, je fais **×**.",
        "Si je cherche une part ou un nombre de groupes, je fais **÷**.",
        "Je vérifie que ma réponse est logique : un total est souvent plus grand, une part est souvent plus petite.",
      ],
      [
        "If I am looking for the total, I do **×**.",
        "If I am looking for a part or a number of groups, I do **÷**.",
        "I check that my answer makes sense: a total is often bigger, a part is often smaller.",
      ],
      [
        "إذا كنت أبحث عن المجموع، أستخدم **×**.",
        "إذا كنت أبحث عن جزء أو عدد المجموعات، أستخدم **÷**.",
        "أتحقق من أن إجابتي منطقية: المجموع غالبًا أكبر، والجزء غالبًا أصغر.",
      ],
      [
        "اگر دنبال کل می‌گردم، **×** انجام می‌دهم.",
        "اگر دنبال یک سهم یا تعداد گروه‌ها می‌گردم، **÷** انجام می‌دهم.",
        "بررسی می‌کنم که پاسخم منطقی باشد: کل اغلب بزرگتر است، یک سهم اغلب کوچکتر.",
      ],
      [
        "ጠቕላሊ ክደሊ ምዃነይ ምስ ዝፈልጥ, **×** ይገብር።",
        "ክፋል ወይ ቁጽሪ ጉጅለ ክደሊ ምዃነይ ምስ ዝፈልጥ, **÷** ይገብር።",
        "ምላሸይ ኣሎ እዩ ኢለ ይርኢ፡ ጠቕላሊ ብዙሕ ዝዓበ, ክፋል ብዙሕ ዝነኣሰ።",
      ],
      [
        "Якщо я шукаю загальну кількість, роблю **×**.",
        "Якщо я шукаю частину або кількість груп, роблю **÷**.",
        "Перевіряю, чи відповідь логічна: загальна кількість зазвичай більша, частина — менша.",
      ],
      [
        "Se estou à procura do total, faço **×**.",
        "Se estou à procura de uma parte ou de um número de grupos, faço **÷**.",
        "Verifico se a minha resposta faz sentido: um total é geralmente maior, uma parte é geralmente menor.",
      ],
      [
        "Haddaan raadinayo wadarta, waxaan sameyaa **×**.",
        "Haddaan raadinayo qayb ama tirada kooxaha, waxaan sameyaa **÷**.",
        "Waxaan xaqiijiyaa in jawaabtu macno yeelatay: wadarta badanaa way weyn tahay, qaybtuna badanaa way yar tahay.",
      ],
      [
        "Toplamı arıyorsam **×** yapıyorum.",
        "Bir parça veya grup sayısı arıyorsam **÷** yapıyorum.",
        "Cevabımın mantıklı olup olmadığını kontrol ediyorum: toplam genellikle büyük, parça genellikle küçük.",
      ],
      [
        "که مجموعه لټوم، **×** کوم.",
        "که برخه یا د ډلو شمیر لټوم، **÷** کوم.",
        "چک کوم چه ځوابم منطقي وي: مجموعه معمولاً لويه وي، برخه معمولاً کوچنۍ وي.",
      ],
    ) },
    // Block 5 — theory_tabs (inner blocks not translated)
    {},
    // Block 6 — table
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
    // Block 7 — heading "Petite stratégie" (black)
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
    // Block 8 — plain "1. Je repère..."
    { text: S(
      "**1.** Je repère ce qui se répète (une quantité identique dans chaque groupe).",
      "**1.** I identify what repeats (an identical quantity in each group).",
      "**1.** أجد ما يتكرر (كمية متطابقة في كل مجموعة).",
      "**1.** چیزی که تکرار می‌شود را تشخیص می‌دهم (کمیت یکسان در هر گروه).",
      "**1.** ዝድገም ዘሎ ይኽሕስ (ኣብ ነፍሲ ወከፍ ጉጅለ ማዕረ ዝኾነ ዕቐን)።",
      "**1.** Знаходжу те, що повторюється (однакова кількість у кожній групі).",
      "**1.** Identifico o que se repete (uma quantidade idêntica em cada grupo).",
      "**1.** Waxaan ogaadaa waxa ku celcelinaya (tirada isku mid ah ee koox kasta).",
      "**1.** Tekrar edeni belirliyorum (her grupta aynı miktar).",
      "**1.** هغه شی چه تکراریږي ومومم (د هر ډل کې یوه شان مقدار)."
    ) },
    // Block 9 — plain "2. Je demande..."
    { text: S(
      "**2.** Je demande : est-ce que je cherche le **total** ou une **part** ?",
      "**2.** I ask: am I looking for the **total** or a **part**?",
      "**2.** أسأل: هل أبحث عن **المجموع** أم عن **الجزء**؟",
      "**2.** می‌پرسم: دنبال **کل** می‌گردم یا **یک سهم**؟",
      "**2.** ሕቶ ይሓቶ፡ **ጠቕላሊ** ወይ **ክፋል** ክደሊ?",
      "**2.** Питаю: я шукаю **загальну кількість** чи **частину**?",
      "**2.** Pergunto: estou à procura do **total** ou de uma **parte**?",
      "**2.** Waxaan is weydiinaqa: ma raadinayaa **wadarta** mise **qayb**?",
      "**2.** Soruyorum: **toplam** mı yoksa **parça** mı arıyorum?",
      "**2.** پوښتم: **مجموعه** لټوم که **يوه برخه**؟"
    ) },
    // Block 10 — plain "3. Si je cherche le total..."
    { text: S(
      "**3.** Si je cherche le total, je fais **×**.",
      "**3.** If I am looking for the total, I do **×**.",
      "**3.** إذا كنت أبحث عن المجموع، أستخدم **×**.",
      "**3.** اگر دنبال کل می‌گردم، **×** انجام می‌دهم.",
      "**3.** ጠቕላሊ ክደሊ ምዃነይ ምስ ዝፈልጥ, **×** ይገብር።",
      "**3.** Якщо я шукаю загальну кількість, роблю **×**.",
      "**3.** Se estou à procura do total, faço **×**.",
      "**3.** Haddaan raadinayo wadarta, waxaan sameyaa **×**.",
      "**3.** Toplamı arıyorsam **×** yapıyorum.",
      "**3.** که مجموعه لټوم، **×** کوم."
    ) },
    // Block 11 — plain "4. Si je cherche une part..."
    { text: S(
      "**4.** Si je cherche une part ou un nombre de groupes, je fais **÷**.",
      "**4.** If I am looking for a part or a number of groups, I do **÷**.",
      "**4.** إذا كنت أبحث عن جزء أو عدد المجموعات، أستخدم **÷**.",
      "**4.** اگر دنبال یک سهم یا تعداد گروه‌ها می‌گردم، **÷** انجام می‌دهم.",
      "**4.** ክፋል ወይ ቁጽሪ ጉጅለ ክደሊ ምዃነይ ምስ ዝፈልጥ, **÷** ይገብር།",
      "**4.** Якщо я шукаю частину або кількість груп, роблю **÷**.",
      "**4.** Se estou à procura de uma parte ou de um número de grupos, faço **÷**.",
      "**4.** Haddaan raadinayo qayb ama tirada kooxaha, waxaan sameyaa **÷**.",
      "**4.** Bir parça veya grup sayısı arıyorsam **÷** yapıyorum.",
      "**4.** که برخه یا د ډلو شمیر لټوم، **÷** کوم."
    ) },
    // Block 12 — plain "5. Je vérifie..."
    { text: S(
      "**5.** Je vérifie que ma réponse est logique.",
      "**5.** I check that my answer makes sense.",
      "**5.** أتحقق من أن إجابتي منطقية.",
      "**5.** بررسی می‌کنم که پاسخم منطقی باشد.",
      "**5.** ምላሸይ ኣሎ እዩ ኢለ ይርኢ።",
      "**5.** Перевіряю, чи відповідь логічна.",
      "**5.** Verifico se a minha resposta faz sentido.",
      "**5.** Waxaan xaqiijiyaa in jawaabtu macno yeelatay.",
      "**5.** Cevabımın mantıklı olup olmadığını kontrol ediyorum.",
      "**5.** چک کوم چه ځوابم منطقي وي."
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
