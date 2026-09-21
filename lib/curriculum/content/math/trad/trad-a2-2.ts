import type { SubmoduleTrad } from "./trad-types";

export const TRAD_A2_2: SubmoduleTrad = {
  submoduleId: "A2-2",
  title: {
    fr: "Soustraction",
    en: "Subtraction",
    ar: "الطرح",
    fa: "تفریق",
    ti: "ምቕናስ",
    uk: "Віднімання",
    pt: "Subtração",
    so: "Kala goyn",
    tr: "Çıkarma",
    ps: "تفریق",
  },
  blocks: [
    {
      text: {
        fr: "La soustraction permet de **retirer** une quantité d'une autre.",
        en: "Subtraction lets us **take away** one quantity from another.",
        ar: "يسمح الطرح بـ **إزالة** كمية من كمية أخرى.",
        fa: "تفریق به ما اجازه می‌دهد یک مقدار را از مقدار دیگر **کم کنیم**.",
        ti: "ምቕናስ ሓደ መጠን ካብ ካልእ **ንምንካይ** ይሕግዝ።",
        uk: "Віднімання допомагає **забрати** одну кількість від іншої.",
        pt: "A subtração permite **retirar** uma quantidade de outra.",
        so: "Kala goyntu waxay noo oggolaanaysaa in aan tiro **ka saarno** tiro kale.",
        tr: "Çıkarma, bir miktarı başka bir miktardan **çıkarmayı** sağlar.",
        ps: "تفریق له یوه مقدار څخه بل مقدار **کموي**.",
      },
    },
    {
      items: {
        fr: [
          "Le signe de la soustraction est le signe « − » **moins**.",
          "Les nombres de la soustraction sont les **termes**.",
          "Le résultat de la soustraction est la **différence**.",
        ],
        en: [
          "The sign for subtraction is the « − » **minus** sign.",
          "The numbers in a subtraction are the **terms**.",
          "The result of a subtraction is the **difference**.",
        ],
        ar: [
          "رمز الطرح هو الرمز « − » **ناقص**.",
          "الأعداد في الطرح تسمى **الحدود**.",
          "نتيجة الطرح تسمى **الفرق**.",
        ],
        fa: [
          "نشانه تفریق، علامت « − » یعنی **منها** است.",
          "عددهای تفریق، **جمله‌ها** هستند.",
          "نتیجه تفریق، **اختلاف** نام دارد.",
        ],
        ti: [
          "ምልክት ምቕናስ « − » **ኣነስ** እዩ።",
          "ቁጽርታት ምቕናስ **ቃላት** ይበሃሉ።",
          "ውጽኢት ምቕናስ **ፍልልይ** ይበሃል።",
        ],
        uk: [
          "Знак віднімання — це знак « − » **мінус**.",
          "Числа у відніманні називаються **членами**.",
          "Результат віднімання називається **різницею**.",
        ],
        pt: [
          "O sinal da subtração é o sinal « − » **menos**.",
          "Os números da subtração são os **termos**.",
          "O resultado da subtração é a **diferença**.",
        ],
        so: [
          "Calaamadda kala goyntu waa « − » **laga jaray**.",
          "Tirooyinka kala goynta waa **qodobbada**.",
          "Natiijada kala goyntu waa **farqiga**.",
        ],
        tr: [
          "Çıkarma işareti « − » **eksi** işaretidir.",
          "Çıkarmadaki sayılar **terimlerdir**.",
          "Çıkarmanın sonucu **farktır**.",
        ],
        ps: [
          "د تفریق نښه « − » **منفي** ده.",
          "د تفریق عددونه **حدونه** دي.",
          "د تفریق پایله **توپیر** ده.",
        ],
      },
    },
    {
      headers: {
        fr: ["8", "−", "3", "=", "5"],
        en: ["8", "−", "3", "=", "5"],
        ar: ["8", "−", "3", "=", "5"],
        fa: ["8", "−", "3", "=", "5"],
        ti: ["8", "−", "3", "=", "5"],
        uk: ["8", "−", "3", "=", "5"],
        pt: ["8", "−", "3", "=", "5"],
        so: ["8", "−", "3", "=", "5"],
        tr: ["8", "−", "3", "=", "5"],
        ps: ["8", "−", "3", "=", "5"],
      },
    },
    {
      text: {
        fr: "Propriétés de la soustraction",
        en: "Properties of subtraction",
        ar: "خصائص الطرح",
        fa: "ویژگی‌های تفریق",
        ti: "ባህርያት ምቕናስ",
        uk: "Властивості віднімання",
        pt: "Propriedades da subtração",
        so: "Sifooyinka kala goynta",
        tr: "Çıkarmanın özellikleri",
        ps: "د تفریق ځانګړنې",
      },
    },
    {
      text: {
        fr: "Non-commutativité",
        en: "Non-commutativity",
        ar: "عدم الإبدال",
        fa: "جابه‌جایی‌ناپذیری",
        ti: "ዘይምቅይያር",
        uk: "Непереставність",
        pt: "Não comutatividade",
        so: "Aan isdhaafsanayn",
        tr: "Değişme özelliği yoktur",
        ps: "نه بدلېدونکې ځانګړنه",
      },
    },
    {
      items: {
        fr: [
          "La soustraction n'est **pas commutative**.",
          "• 57 − 49 **≠** 49 − 57",
        ],
        en: [
          "Subtraction is **not commutative**.",
          "• 57 − 49 **≠** 49 − 57",
        ],
        ar: [
          "الطرح **ليس إبداليا**.",
          "• 57 − 49 **≠** 49 − 57",
        ],
        fa: [
          "تفریق **جابه‌جایی‌پذیر نیست**.",
          "• 57 − 49 **≠** 49 − 57",
        ],
        ti: [
          "ምቕናስ **ምቅይያር ኣይቅበልን**።",
          "• 57 − 49 **≠** 49 − 57",
        ],
        uk: [
          "Віднімання **не є переставним**.",
          "• 57 − 49 **≠** 49 − 57",
        ],
        pt: [
          "A subtração **não é comutativa**.",
          "• 57 − 49 **≠** 49 − 57",
        ],
        so: [
          "Kala goyntu **ma aha isdhaafsanaan**.",
          "• 57 − 49 **≠** 49 − 57",
        ],
        tr: [
          "Çıkarma **değişme özelliğine sahip değildir**.",
          "• 57 − 49 **≠** 49 − 57",
        ],
        ps: [
          "تفریق **بدلېدونکی نه دی**.",
          "• 57 − 49 **≠** 49 − 57",
        ],
      },
    },
    {},
    {
      text: {
        fr: "Soustraction en colonnes",
        en: "Column subtraction",
        ar: "الطرح في الأعمدة",
        fa: "تفریق ستونی",
        ti: "ምቕናስ ብዓምዲ",
        uk: "Віднімання у стовпчик",
        pt: "Subtração em colunas",
        so: "Kala goynta tiirar",
        tr: "Alt alta çıkarma",
        ps: "ستوني تفریق",
      },
    },
    {
      items: {
        fr: [
          "Alignez les unités sous les unités, les dizaines sous les dizaines.",
          "Si la soustraction est impossible → faites un **emprunt** à la colonne de gauche.",
          "La colonne empruntée diminue de 1, la colonne courante gagne 10.",
        ],
        en: [
          "Align units under units and tens under tens.",
          "If the subtraction is impossible → make a **borrow** from the column on the left.",
          "The borrowed column decreases by 1, and the current column gains 10.",
        ],
        ar: [
          "ضع الآحاد تحت الآحاد والعشرات تحت العشرات.",
          "إذا كان الطرح غير ممكن ← نقوم بـ **استلاف** من العمود الأيسر.",
          "العمود الذي استلفنا منه ينقص 1، والعمود الحالي يزيد 10.",
        ],
        fa: [
          "یکان‌ها را زیر یکان‌ها و دهگان‌ها را زیر دهگان‌ها بنویس.",
          "اگر تفریق ممکن نیست ← از ستون چپ **قرض** بگیر.",
          "ستونی که از آن قرض گرفته‌ایم 1 کم می‌شود و ستون فعلی 10 اضافه می‌گیرد.",
        ],
        ti: [
          "ሓደታት ትሕቲ ሓደታት፣ ዓሰርተታት ትሕቲ ዓሰርተታት ኣሰልፍ።",
          "ምቕናስ እንተዘይተኻእለ → ካብ ዓምዲ ጸጋም **ተዋስእ**።",
          "ዝተዋሰእናሉ ዓምዲ ብ1 ይንኪ፣ እቲ ናይ ሕጂ ዓምዲ 10 ይረክብ።",
        ],
        uk: [
          "Записуй одиниці під одиницями, десятки під десятками.",
          "Якщо віднімання неможливе → зроби **позику** з колонки ліворуч.",
          "Колонка, з якої позичили, зменшується на 1, а поточна колонка отримує 10.",
        ],
        pt: [
          "Alinha as unidades por baixo das unidades e as dezenas por baixo das dezenas.",
          "Se a subtração for impossível → faz um **empréstimo** à coluna da esquerda.",
          "A coluna emprestada diminui 1, e a coluna atual ganha 10.",
        ],
        so: [
          "U dhig halalka hoosta halalka, tobannadana hoosta tobannada.",
          "Haddii kala goyntu suuragal ahayn → ka **amaaho** tiirka bidix.",
          "Tiirka laga amaahday 1 ayuu yaraadaa, tiirka hadda jirana 10 ayuu helaa.",
        ],
        tr: [
          "Birlikleri birliklerin, onlar basamağını onlar basamağının altına hizala.",
          "Çıkarma yapılamıyorsa → soldaki basamaktan **ödünç al**.",
          "Ödünç alınan sütun 1 azalır, geçerli sütun 10 kazanır.",
        ],
        ps: [
          "یوګان تر یوګانو لاندې او لسګان تر لسګانو لاندې برابر کړه.",
          "که تفریق ممکن نه وي → له کیڼ ستنې څخه **پور** واخله.",
          "هغه ستنه چې پور ترې اخیستل شوی 1 کمېږي، او اوسنۍ ستنه 10 زیاتېږي.",
        ],
      },
    },
    {},
  ],
  consignes: {
    "a2-2-ep01": { fr: "Calculez : 83 − 37 = ?", en: "Calculate : 83 − 37 = ?", ar: "احسب : 83 − 37 = ?", fa: "حساب کنید : 83 − 37 = ?", ti: "Calculate : 83 − 37 = ?", uk: "Обчисліть : 83 − 37 = ?", pt: "Calcule : 83 − 37 = ?", so: "Calculate : 83 − 37 = ?", tr: "Hesaplayın : 83 − 37 = ?", ps: "Calculate : 83 − 37 = ?" },
    "a2-2-ep02": { fr: "Calculez : 254 − 127 = ?", en: "Calculate : 254 − 127 = ?", ar: "احسب : 254 − 127 = ?", fa: "حساب کنید : 254 − 127 = ?", ti: "Calculate : 254 − 127 = ?", uk: "Обчисліть : 254 − 127 = ?", pt: "Calcule : 254 − 127 = ?", so: "Calculate : 254 − 127 = ?", tr: "Hesaplayın : 254 − 127 = ?", ps: "Calculate : 254 − 127 = ?" },
    "a2-2-ep03": { fr: "Calculez : 500 − 163 = ?", en: "Calculate : 500 − 163 = ?", ar: "احسب : 500 − 163 = ?", fa: "حساب کنید : 500 − 163 = ?", ti: "Calculate : 500 − 163 = ?", uk: "Обчисліть : 500 − 163 = ?", pt: "Calcule : 500 − 163 = ?", so: "Calculate : 500 − 163 = ?", tr: "Hesaplayın : 500 − 163 = ?", ps: "Calculate : 500 − 163 = ?" },
    "a2-2-ep04": { fr: "Calculez : 742 − 385 = ?", en: "Calculate : 742 − 385 = ?", ar: "احسب : 742 − 385 = ?", fa: "حساب کنید : 742 − 385 = ?", ti: "Calculate : 742 − 385 = ?", uk: "Обчисліть : 742 − 385 = ?", pt: "Calcule : 742 − 385 = ?", so: "Calculate : 742 − 385 = ?", tr: "Hesaplayın : 742 − 385 = ?", ps: "Calculate : 742 − 385 = ?" },
    "a2-2-ep05": { fr: "Calculez : 1 000 − 456 = ?", en: "Calculate : 1 000 − 456 = ?", ar: "احسب : 1 000 − 456 = ?", fa: "حساب کنید : 1 000 − 456 = ?", ti: "Calculate : 1 000 − 456 = ?", uk: "Обчисліть : 1 000 − 456 = ?", pt: "Calcule : 1 000 − 456 = ?", so: "Calculate : 1 000 − 456 = ?", tr: "Hesaplayın : 1 000 − 456 = ?", ps: "Calculate : 1 000 − 456 = ?" },
    "a2-2-ep06": { fr: "Calculez : 3 821 − 1 475 = ?", en: "Calculate : 3 821 − 1 475 = ?", ar: "احسب : 3 821 − 1 475 = ?", fa: "حساب کنید : 3 821 − 1 475 = ?", ti: "Calculate : 3 821 − 1 475 = ?", uk: "Обчисліть : 3 821 − 1 475 = ?", pt: "Calcule : 3 821 − 1 475 = ?", so: "Calculate : 3 821 − 1 475 = ?", tr: "Hesaplayın : 3 821 − 1 475 = ?", ps: "Calculate : 3 821 − 1 475 = ?" },
    "a2-2-ep07": { fr: "Calculez : 605 − 278 = ?", en: "Calculate : 605 − 278 = ?", ar: "احسب : 605 − 278 = ?", fa: "حساب کنید : 605 − 278 = ?", ti: "Calculate : 605 − 278 = ?", uk: "Обчисліть : 605 − 278 = ?", pt: "Calcule : 605 − 278 = ?", so: "Calculate : 605 − 278 = ?", tr: "Hesaplayın : 605 − 278 = ?", ps: "Calculate : 605 − 278 = ?" },
    "a2-2-ep08": { fr: "Calculez : 4 002 − 1 357 = ?", en: "Calculate : 4 002 − 1 357 = ?", ar: "احسب : 4 002 − 1 357 = ?", fa: "حساب کنید : 4 002 − 1 357 = ?", ti: "Calculate : 4 002 − 1 357 = ?", uk: "Обчисліть : 4 002 − 1 357 = ?", pt: "Calcule : 4 002 − 1 357 = ?", so: "Calculate : 4 002 − 1 357 = ?", tr: "Hesaplayın : 4 002 − 1 357 = ?", ps: "Calculate : 4 002 − 1 357 = ?" },
    "a2-2-ep09": { fr: "Calculez : 916 − 439 = ?", en: "Calculate : 916 − 439 = ?", ar: "احسب : 916 − 439 = ?", fa: "حساب کنید : 916 − 439 = ?", ti: "Calculate : 916 − 439 = ?", uk: "Обчисліть : 916 − 439 = ?", pt: "Calcule : 916 − 439 = ?", so: "Calculate : 916 − 439 = ?", tr: "Hesaplayın : 916 − 439 = ?", ps: "Calculate : 916 − 439 = ?" },
    "a2-2-ep10": { fr: "Calculez : 7 500 − 3 284 = ?", en: "Calculate : 7 500 − 3 284 = ?", ar: "احسب : 7 500 − 3 284 = ?", fa: "حساب کنید : 7 500 − 3 284 = ?", ti: "Calculate : 7 500 − 3 284 = ?", uk: "Обчисліть : 7 500 − 3 284 = ?", pt: "Calcule : 7 500 − 3 284 = ?", so: "Calculate : 7 500 − 3 284 = ?", tr: "Hesaplayın : 7 500 − 3 284 = ?", ps: "Calculate : 7 500 − 3 284 = ?" },
    "a2-2-ep11": { fr: "Calculez : 200 − 87 = ?", en: "Calculate : 200 − 87 = ?", ar: "احسب : 200 − 87 = ?", fa: "حساب کنید : 200 − 87 = ?", ti: "Calculate : 200 − 87 = ?", uk: "Обчисліть : 200 − 87 = ?", pt: "Calcule : 200 − 87 = ?", so: "Calculate : 200 − 87 = ?", tr: "Hesaplayın : 200 − 87 = ?", ps: "Calculate : 200 − 87 = ?" },
    "a2-2-ep12": { fr: "Calculez : 5 000 − 2 749 = ?", en: "Calculate : 5 000 − 2 749 = ?", ar: "احسب : 5 000 − 2 749 = ?", fa: "حساب کنید : 5 000 − 2 749 = ?", ti: "Calculate : 5 000 − 2 749 = ?", uk: "Обчисліть : 5 000 − 2 749 = ?", pt: "Calcule : 5 000 − 2 749 = ?", so: "Calculate : 5 000 − 2 749 = ?", tr: "Hesaplayın : 5 000 − 2 749 = ?", ps: "Calculate : 5 000 − 2 749 = ?" },
  },
};
