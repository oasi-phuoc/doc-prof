import type { SubmoduleTrad } from "./trad-types";
import { S, A } from "./trad-a9-common";

export const TRAD_A9_2: SubmoduleTrad = {
  submoduleId: "A9-2",
  title: S(
    "Variable et inconnue",
    "Variable and unknown",
    "المتغير والمجهول",
    "متغیر و مجهول",
    "ተለዋዋጢ ቁጽርን ዘይፍለጥ ቁጽርን",
    "Змінна і невідома",
    "Variável e incógnita",
    "Doorsoome iyo aan la garanayn",
    "Değişken ve bilinmeyen",
    "متغیر او مجهول",
  ),
  blocks: [
    // 0 — heading "Les lettres en algèbre"
    { text: S(
      "Les lettres en algèbre",
      "Letters in algebra",
      "الحروف في الجبر",
      "حروف در جبر",
      "ፊደላት ኣብ ኣልጀብራ",
      "Літери в алгебрі",
      "As letras na álgebra",
      "Xarfaha aljebrada",
      "Cebirde harfler",
      "په الجبر کې حروف",
    ) },

    // 1 — plain
    { text: S(
      "En algèbre, une lettre peut représenter un nombre. On l'appelle une **variable** ou une **inconnue** selon le contexte.",
      "In algebra, a letter can represent a number. It is called a **variable** or an **unknown** depending on the context.",
      "في الجبر، يمكن أن تمثل الحرفة عددًا. نسميها **متغيرًا** أو **مجهولًا** حسب السياق.",
      "در جبر، یک حرف می‌تواند نماینده یک عدد باشد. بسته به زمینه آن را **متغیر** یا **مجهول** می‌نامیم.",
      "ኣብ ኣልጀብራ፣ ፊደል ቁጽር ክወክል ይኽእል እዩ። ኣብ ኣገባብ ከኣ **ተለዋዋጢ ቁጽር** ወይ **ዘይፍለጥ ቁጽር** ይበሃል።",
      "В алгебрі літера може позначати число. Залежно від контексту її називають **змінною** або **невідомою**.",
      "Na álgebra, uma letra pode representar um número. Chama-se **variável** ou **incógnita** consoante o contexto.",
      "Aljebrada, xaraf wuxuu matali karaa tiro. Waxaa loo yaqaan **doorsoome** ama **aan la garanayn** iyadoo loo eegayo macnaha.",
      "Cebirde bir harf bir sayıyı temsil edebilir. Bağlama göre **değişken** veya **bilinmeyen** denir.",
      "په الجبر کې، یو حرف کولی شي یوه شمېره څرګنده کړي. په شرایطو پورې اړه لري چې **متغیر** یا **مجهول** بلل کېږي.",
    ) },

    // 2 — table
    { headers: A(
      ["Terme", "Définition", "Exemple"],
      ["Term", "Definition", "Example"],
      ["مصطلح", "تعريف", "مثال"],
      ["اصطلاح", "تعریف", "مثال"],
      ["ኣባሪ", "ትርጉም", "ምሳሌ"],
      ["Термін", "Визначення", "Приклад"],
      ["Termo", "Definição", "Exemplo"],
      ["Eray", "Qeexitaan", "Tusaale"],
      ["Terim", "Tanım", "Örnek"],
      ["اصطلاح", "تعریف", "مثال"],
    ), items: A(
      [
        "Variable | Nombre qui peut changer de valeur | x = longueur d'un rectangle",
        "Inconnue | Nombre fixe mais inconnu, à trouver | x dans 3x **+** 5 = 20",
      ],
      [
        "Variable | A number that can change value | x = length of a rectangle",
        "Unknown | A fixed but unknown number to find | x in 3x **+** 5 = 20",
      ],
      [
        "متغير | عدد يمكن أن تتغير قيمته | x = طول مستطيل",
        "مجهول | عدد ثابت لكنه غير معروف، يجب إيجاده | x في 3x **+** 5 = 20",
      ],
      [
        "متغیر | عددی که می‌تواند مقدارش تغییر کند | x = طول یک مستطیل",
        "مجهول | عدد ثابت اما ناشناخته که باید پیدا شود | x در 3x **+** 5 = 20",
      ],
      [
        "ተለዋዋጢ ቁጽር | ዋጋኡ ክቀይር ዝኽእል ቁጽር | x = ናይ مستطيل ክልት",
        "ዘይፍለጥ ቁጽር | ቐሊል ግን ዘይፍለጥ ቁጽር፣ ክረኸብ ዘሎ | x ኣብ 3x **+** 5 = 20",
      ],
      [
        "Змінна | Число, значення якого може змінюватися | x = довжина прямокутника",
        "Невідома | Фіксоване, але невідоме число, яке треба знайти | x у 3x **+** 5 = 20",
      ],
      [
        "Variável | Número cujo valor pode mudar | x = comprimento de um retângulo",
        "Incógnita | Número fixo mas desconhecido, a encontrar | x em 3x **+** 5 = 20",
      ],
      [
        "Doorsoome | Tiro qiimaheedu isbeddeli karo | x = dhererka laydi",
        "Aan la garanayn | Tiro go'an laakiin aan la garanayn, oo la raadinayo | x ee 3x **+** 5 = 20",
      ],
      [
        "Değişken | Değeri değişebilen sayı | x = bir dikdörtgenin uzunluğu",
        "Bilinmeyen | Sabit ama bilinmeyen, bulunması gereken sayı | 3x **+** 5 = 20 içinde x",
      ],
      [
        "متغیر | هغه شمېره چې ارزښت یې بدلېدلی شي | x = د مستطیل اوږدوالی",
        "مجهول | ثابت خو نامعلومه شمېره چې موندل کېږي | x په 3x **+** 5 = 20 کې",
      ],
    ) },

    // 3 — heading "Différence entre variable et inconnue"
    { text: S(
      "Différence entre variable et inconnue",
      "Difference between variable and unknown",
      "الفرق بين المتغير والمجهول",
      "تفاوت متغیر و مجهول",
      "فرق ተለዋዋጢ ቁጽርን ዘይፍለጥ ቁጽርን",
      "Різниця між змінною та невідомою",
      "Diferença entre variável e incógnita",
      "Farqiga u dhexeeya doorsoomaha iyo aan la garanayn",
      "Değişken ile bilinmeyen arasındaki fark",
      "د متغیر او مجهول ترمنځ توپیر",
    ) },

    // 4 — highlight "Variable"
    { text: S(
      "Variable",
      "Variable",
      "متغير",
      "متغیر",
      "ተለዋዋጢ ቁጽር",
      "Змінна",
      "Variável",
      "Doorsoome",
      "Değişken",
      "متغیر",
    ) },

    // 5 — section (label="")
    { label: S("", "", "", "", "", "", "", "", "", ""),
      items: A(
        [
          "Dans l'expression 3x **+** 5, x est une **variable** : elle peut prendre n'importe quelle valeur.",
          "On peut calculer la valeur de l'expression pour différentes valeurs de x.",
        ],
        [
          "In the expression 3x **+** 5, x is a **variable**: it can take any value.",
          "The value of the expression can be calculated for different values of x.",
        ],
        [
          "في التعبير 3x **+** 5، x **متغير** : يمكن أن يأخذ أي قيمة.",
          "يمكن حساب قيمة التعبير لقيم مختلفة من x.",
        ],
        [
          "در عبارت 3x **+** 5، x یک **متغیر** است: می‌تواند هر مقداری بگیرد.",
          "می‌توان مقدار عبارت را برای مقادیر مختلف x محاسبه کرد.",
        ],
        [
          "ኣብቲ 3x **+** 5 ኣዝማሚ፣ x **ተለዋዋጢ ቁጽር** እዩ: ኩሉ ዋጋ ክወስድ ይኽእል እዩ።",
          "ነቲ 3x **+** 5 ኣዝማሚ ን ዝተፈላለዩ ዋጋታት x ክንሕስብ ንኽእል።",
        ],
        [
          "У виразі 3x **+** 5, x — це **змінна**: вона може мати будь-яке значення.",
          "Значення виразу можна обчислити для різних значень x.",
        ],
        [
          "Na expressão 3x **+** 5, x é uma **variável**: pode tomar qualquer valor.",
          "Pode calcular-se o valor da expressão para diferentes valores de x.",
        ],
        [
          "Weedhda 3x **+** 5, x waa **doorsoome**: waxay qaadan kartaa qiime kasta.",
          "Qiimaha weedhda waxaa loo xisaabin karaa qiimayaal kala duwan oo x ah.",
        ],
        [
          "3x **+** 5 ifadesinde x bir **değişkendir**: herhangi bir değer alabilir.",
          "İfadenin değeri, x'in farklı değerleri için hesaplanabilir.",
        ],
        [
          "په 3x **+** 5 اظهار کې، x **متغیر** دی: هر ارزښت اخیستلی شي.",
          "د x مختلفو ارزښتونو لپاره د اظهار ارزښت حسابولی شي.",
        ],
      ),
    },

    // 6 — highlight "Inconnue"
    { text: S(
      "Inconnue",
      "Unknown",
      "مجهول",
      "مجهول",
      "ዘይፍለጥ ቁጽር",
      "Невідома",
      "Incógnita",
      "Aan la garanayn",
      "Bilinmeyen",
      "مجهول",
    ) },

    // 7 — section (label="")
    { label: S("", "", "", "", "", "", "", "", "", ""),
      items: A(
        [
          "Dans l'équation 3x **+** 5 = 20, x est une **inconnue** : il y a une valeur précise à trouver.",
          "Ici, x = 5 est la seule valeur qui vérifie l'équation.",
        ],
        [
          "In the equation 3x **+** 5 = 20, x is an **unknown**: there is one specific value to find.",
          "Here, x = 5 is the only value that satisfies the equation.",
        ],
        [
          "في المعادلة 3x **+** 5 = 20، x **مجهول** : هناك قيمة محددة يجب إيجادها.",
          "هنا، x = 5 هي القيمة الوحيدة التي تحقق المعادلة.",
        ],
        [
          "در معادله 3x **+** 5 = 20، x یک **مجهول** است: یک مقدار مشخص باید پیدا شود.",
          "اینجا x = 5 تنها مقداری است که معادله را برآورده می‌کند.",
        ],
        [
          "ኣብቲ 3x **+** 5 = 20 እኩሽታ፣ x **ዘይፍለጥ ቁጽር** እዩ: ሓደ ጽቡቕ ዋጋ ክረኸብ ዘሎ እዩ።",
          "ኣብዚ፣ x = 5 እቲ እኩሽታ ዝሓረጾ ብቸኛ ዋጋ እዩ።",
        ],
        [
          "У рівнянні 3x **+** 5 = 20, x — це **невідома**: потрібно знайти одне конкретне значення.",
          "Тут x = 5 — єдине значення, яке задовольняє рівняння.",
        ],
        [
          "Na equação 3x **+** 5 = 20, x é uma **incógnita**: há um valor preciso a encontrar.",
          "Aqui, x = 5 é o único valor que verifica a equação.",
        ],
        [
          "Isle'egta 3x **+** 5 = 20, x waa **aan la garanayn**: waxaa jira qiime gaar ah oo la raadiyo.",
          "Halkan, x = 5 waa qiimaha kaliya ee xaqiijiya isle'egta.",
        ],
        [
          "3x **+** 5 = 20 denkleminde x bir **bilinmeyendir**: bulunması gereken belirli bir değer vardır.",
          "Burada x = 5, denklemi sağlayan tek değerdir.",
        ],
        [
          "په 3x **+** 5 = 20 معادله کې، x **مجهول** دی: یو ځانګړی ارزښت موندل کېږي.",
          "دلته x = 5 یوازینی ارزښت دی چې معادله پوره کوي.",
        ],
      ),
    },
  ],
  consignes: {
    algebra_group: S(
      "Calculez le résultat.",
      "Calculate the result.",
      "احسب النتيجة.",
      "نتیجه را محاسبه کنید.",
      "መወጽኢ ፈትኹ።",
      "Обчисліть результат.",
      "Calcule o resultado.",
      "Xisaabi natiijada.",
      "Sonucu hesaplayın.",
      "پایله حساب کړئ.",
    ),
  },
};
