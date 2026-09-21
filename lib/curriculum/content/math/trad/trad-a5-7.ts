import type { SubmoduleTrad } from "./trad-types";

const S = (fr: string, en: string, ar: string, fa: string, ti: string, uk: string, pt: string, so: string, tr: string, ps: string) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });
const A = (fr: string[], en: string[], ar: string[], fa: string[], ti: string[], uk: string[], pt: string[], so: string[], tr: string[], ps: string[]) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

export const TRAD_A5_7: SubmoduleTrad = {
  submoduleId: "A5-7",
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
    "مسئلې",
  ),
  blocks: [
    // Block 0 — heading "Résoudre un problème avec des décimaux" (black)
    { text: S(
      "Résoudre un problème avec des décimaux",
      "Solving a problem with decimals",
      "حل مسألة بالأعداد العشرية",
      "حل مسئله با اعداد اعشاری",
      "ምፍታሕ ጸገም ምስ ዲሲማል ቁጽርታት",
      "Розв'язування задачі з десятковими числами",
      "Resolver um problema com decimais",
      "Xallinta su'aal leh tirooyinka tobanle",
      "Ondalık sayılarla problem çözme",
      "د اعشاري عددونو سره د مسئلې حل",
    ) },
    // Block 1 — highlight "Même méthode qu'avec les entiers"
    { text: S(
      "Même méthode qu'avec les entiers",
      "Same method as with whole numbers",
      "نفس الطريقة كما مع الأعداد الصحيحة",
      "همان روش با اعداد صحیح",
      "ተመሳሳሊ ኣገባብ ምስ ምሉኣት ቁጽርታት",
      "Той самий метод, що й із цілими числами",
      "O mesmo método que com os inteiros",
      "Isla habka oo kale sida tirada dhan",
      "Tam sayılarla aynı yöntem",
      "د صحيحو عددونو سره ورته طريقه",
    ) },
    // Block 2 — plain
    { text: S(
      "Avec les nombres décimaux, on choisit l'opération selon la **question**, pas selon les mots de l'énoncé. La seule différence : il faut placer la virgule correctement dans la réponse.",
      "With decimal numbers, we choose the operation based on the **question**, not the words of the problem. The only difference: we must place the decimal point correctly in the answer.",
      "مع الأعداد العشرية، نختار العملية وفقًا لـ**السؤال**، لا وفقًا لكلمات المسألة. الفرق الوحيد: يجب وضع الفاصلة العشرية بشكل صحيح في الإجابة.",
      "با اعداد اعشاری، عملیات را بر اساس **سؤال** انتخاب می‌کنیم، نه کلمات مسئله. تنها تفاوت: باید ممیز را در جواب به درستی قرار دهیم.",
      "ምስ ዲሲማል ቁጽርታት፣ ኣሰራርሓ ብ**ሕቶ** ንምረጽ፣ ብቃላት ሕቶ ኣይኮነን። ሓንቲ ፍልልይ፡ ኮማ ናይ ምዕርርያት ኣብ ምላሽ ቅኑዕ ቦታ ክነቕምጦ ኣለና።",
      "З десятковими числами вибираємо дію за **запитанням**, а не за словами задачі. Єдина відмінність: треба правильно розставити кому у відповіді.",
      "Com números decimais, escolhemos a operação com base na **questão**, não nas palavras do enunciado. A única diferença: é preciso colocar a vírgula corretamente na resposta.",
      "Tirooyinka tobanle, hawsha waxaan u dooranaa **su'aasha**, ma ahaan ereyada su'aasha. Farqiga kaliya: waa inaan si sax ah u dhignaa kala-gooyaha jawaabta.",
      "Ondalık sayılarla işlemi **soruya** göre seçeriz, problemin sözcüklerine göre değil. Tek fark: cevaba virgülü doğru yerleştirmeliyiz.",
      "د اعشاري عددونو سره، عمليه د **پوښتنې** پر بنسټ ټاکو، نه د مسئلې د کلمو پر بنسټ. يواځنۍ توپير: ځواب کې اعشاري نښه سمه ځای کې کينولو ته اړتيا ده.",
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
        "طريقه",
      ), items: A(
      [
        "**1.** Je lis l'énoncé et je comprends la situation.",
        "**2.** Je repère ce qu'on cherche (total, différence, part, nombre de groupes).",
        "**3.** Je choisis l'opération : +, −, ×, ou ÷.",
        "**4.** Je calcule en posant les décimaux en colonne (virgules alignées).",
        "**5.** Je vérifie que ma réponse est raisonnable.",
      ],
      [
        "**1.** I read the problem and understand the situation.",
        "**2.** I identify what is being looked for (total, difference, part, number of groups).",
        "**3.** I choose the operation: +, −, ×, or ÷.",
        "**4.** I calculate by setting out the decimals in columns (decimal points aligned).",
        "**5.** I check that my answer is reasonable.",
      ],
      [
        "**1.** أقرأ المسألة وأفهم الوضعية.",
        "**2.** أحدد المطلوب (المجموع، الفرق، الجزء، عدد المجموعات).",
        "**3.** أختار العملية: +، −، ×، أو ÷.",
        "**4.** أحسب بوضع الأعداد العشرية في أعمدة (الفواصل متوازية).",
        "**5.** أتحقق من أن إجابتي معقولة.",
      ],
      [
        "**1.** مسئله را می‌خوانم و وضعیت را می‌فهمم.",
        "**2.** آنچه را می‌خواهیم پیدا کنیم مشخص می‌کنم (کل، تفاوت، بخش، تعداد گروه‌ها).",
        "**3.** عملیات را انتخاب می‌کنم: +، −، ×، یا ÷.",
        "**4.** با قرار دادن اعشاری‌ها در ستون (ممیزها هم‌راستا) حساب می‌کنم.",
        "**5.** بررسی می‌کنم که پاسخم معقول باشد.",
      ],
      [
        "**1.** ሕቶ ይንብብ ኩነታት ይርዳእ።",
        "**2.** ዝደሊ ዘሎ ይርኢ (ጠቕላሊ፣ ፍልልይ፣ ክፋል፣ ቁጽሪ ጉጅለ)።",
        "**3.** ኣሰራርሓ ይምረጽ: +, −, ×, ወይ ÷.",
        "**4.** ዲሲማላት ብዓምዲ (ኮማ ብሓደ መስሪ) ብምቕማጥ ይሕስብ።",
        "**5.** ምላሸይ ዝርበሕ ምዃኑ ይርኢ።",
      ],
      [
        "**1.** Читаю задачу і розумію ситуацію.",
        "**2.** Знаходжу, що шукаємо (суму, різницю, частину, кількість груп).",
        "**3.** Вибираю дію: +, −, ×, або ÷.",
        "**4.** Обчислюю, розташовуючи десяткові числа у стовпчик (коми вирівняні).",
        "**5.** Перевіряю, чи відповідь розумна.",
      ],
      [
        "**1.** Leio o enunciado e entendo a situação.",
        "**2.** Identifico o que se procura (total, diferença, parte, número de grupos).",
        "**3.** Escolho a operação: +, −, ×, ou ÷.",
        "**4.** Calculo pondo os decimais em colunas (vírgulas alinhadas).",
        "**5.** Verifico se a minha resposta é razoável.",
      ],
      [
        "**1.** Waxaan akhriyaa su'aasha oo fahmaa xaaladda.",
        "**2.** Waxaan helaa waxa la raadinayo (wadarta, farqiga, qayba, tirada kooxaha).",
        "**3.** Waxaan dooranaa hawsha: +, −, ×, ama ÷.",
        "**4.** Waxaan xisaabin ku dhigaa tirada tobanle tiirar (kala-gooyayaashu isku xariiq).",
        "**5.** Waxaan xaqiijiyaa in jawaabtu macquul tahay.",
      ],
      [
        "**1.** Soruyu okuyorum ve durumu anlıyorum.",
        "**2.** Neyin arandığını belirliyorum (toplam, fark, parça, grup sayısı).",
        "**3.** İşlemi seçiyorum: +, −, ×, veya ÷.",
        "**4.** Ondalıkları sütunlara dizerek hesaplıyorum (virgüller hizalı).",
        "**5.** Cevabımın makul olup olmadığını kontrol ediyorum.",
      ],
      [
        "**1.** مسئله لولم او حالت پوهم.",
        "**2.** هغه شی چه لټوو ومومم (مجموعه، توپير، برخه، د ډلو شمیر).",
        "**3.** عمليه ټاکم: +، −، ×، یا ÷.",
        "**4.** د اعشاري عددونو د ستنو کولو (اعشاري نښه هواره) سره حساب کوم.",
        "**5.** چک کوم چه ځوابم معقول وي.",
      ],
    ) },
    // Block 4 — plain "" (spacer)
    { text: S("", "", "", "", "", "", "", "", "", "") },
    // Block 5 — theory_tabs (inner blocks not translated)
    {},
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
