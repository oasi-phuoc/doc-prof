import type { SubmoduleTrad } from "./trad-types";
import { S, A } from "./trad-a9-common";

export const TRAD_A9_5: SubmoduleTrad = {
  submoduleId: "A9-5",
  title: S(
    "Développement",
    "Expansion",
    "التوسيع",
    "توسعه",
    "ምስፋሕ",
    "Розкриття дужок",
    "Desenvolvimento",
    "Fidinta",
    "Açılım",
    "پراختیا",
  ),
  blocks: [
    // 0 — heading "Développer une expression"
    {
      text: S(
        "Développer une expression",
        "Expand an expression",
        "توسيع تعبير",
        "گسترش یک عبارت",
        "ኣዝማሪ ምስፋሕ",
        "Розкрити вираз",
        "Desenvolver uma expressão",
        "Fidi weedh",
        "Bir ifadeyi aç",
        "یوه عبارت پراخ کړئ",
      ),
    },
    // 1 — plain
    {
      text: S(
        "Développer signifie supprimer les parenthèses en distribuant la multiplication sur chaque terme à l'intérieur.",
        "To expand means to remove parentheses by distributing multiplication over each term inside.",
        "التوسيع يعني إزالة الأقواس بتوزيع الضرب على كل حد بداخلها.",
        "توسعه یعنی حذف پرانتزها با توزیع ضرب روی هر جملهٔ داخل.",
        "ምስፋሕ ማለት ኣብ ዘሎ ነፍሲ ወከፍ ወጽዓ ምብዛሕ ብምድምር መኣድን ንምውጻእ እዩ።",
        "Розкрити означає прибрати дужки, розподіливши множення на кожен доданок всередині.",
        "Desenvolver significa remover os parênteses distribuindo a multiplicação por cada termo no interior.",
        "Fidintu waxay ka dhigan tahay in la saaro xidhiidhada iyadoo la kala qaybinayo isku-dhufashada eray kasta gudaha.",
        "Açmak, parantezleri kaldırarak çarpmanın içerideki her terime dağıtılması demektir.",
        "پراخول پدې مانا ده چې د ضرب وېش په هرې جملې باندې د پرانتزونو لرې کول.",
      ),
    },
    // 2 — highlight "Propriété distributive"
    {
      text: S(
        "Propriété distributive",
        "Distributive property",
        "خاصية التوزيع",
        "خاصیت توزیعی",
        "ናይ ምድምር ባህሪ",
        "Дistributивна властивість",
        "Propriedade distributiva",
        "Sifo kala-qaybinta",
        "Dağılma özelliği",
        "د وېش خاصیت",
      ),
    },
    // 3 — section (items: distributive laws)
    {
      items: A(
        [
          "a(b **+** c) = ab **+** ac",
          "a(b **−** c) = ab **−** ac",
        ],
        [
          "a(b **+** c) = ab **+** ac",
          "a(b **−** c) = ab **−** ac",
        ],
        [
          "a(b **+** c) = ab **+** ac",
          "a(b **−** c) = ab **−** ac",
        ],
        [
          "a(b **+** c) = ab **+** ac",
          "a(b **−** c) = ab **−** ac",
        ],
        [
          "a(b **+** c) = ab **+** ac",
          "a(b **−** c) = ab **−** ac",
        ],
        [
          "a(b **+** c) = ab **+** ac",
          "a(b **−** c) = ab **−** ac",
        ],
        [
          "a(b **+** c) = ab **+** ac",
          "a(b **−** c) = ab **−** ac",
        ],
        [
          "a(b **+** c) = ab **+** ac",
          "a(b **−** c) = ab **−** ac",
        ],
        [
          "a(b **+** c) = ab **+** ac",
          "a(b **−** c) = ab **−** ac",
        ],
        [
          "a(b **+** c) = ab **+** ac",
          "a(b **−** c) = ab **−** ac",
        ],
      ),
    },
    // 4 — highlight "Facteur négatif devant une parenthèse"
    {
      text: S(
        "Facteur négatif devant une parenthèse",
        "Negative factor in front of parentheses",
        "عامل سالب أمام قوس",
        "عامل منفی جلوی پرانتز",
        "ኣብ ቅድሚ መኣድ ኣሉታ",
        "Від'ємний множник перед дужкою",
        "Fator negativo à frente de um parêntese",
        "Taran taban oo taban ah oo xidhiidh horteeda ah",
        "Parantez önünde negatif çarpan",
        "د پرانتز مخې منفي عامل",
      ),
    },
    // 5 — plain
    {
      text: S(
        "Quand le facteur est négatif, tous les signes à l'intérieur de la parenthèse s'inversent.",
        "When the factor is negative, all the signs inside the parentheses are reversed.",
        "عندما يكون العامل سالبًا، تنعكس جميع الإشارات داخل القوس.",
        "وقتی عامل منفی است، همهٔ علامت‌های داخل پرانتز برعکس می‌شوند.",
        "እቲ ተቀራራቢ ኣሉታ እንተኾነ፣ ኣብ ዘሎ ኩሉ ምልክታት ይቐልብ።",
        "Коли множник від'ємний, усі знаки всередині дужки змінюються на протилежні.",
        "Quando o fator é negativo, todos os sinais no interior do parêntese invertem-se.",
        "Marka tabanuhu taban yahay, dhammaan calaamadaha gudaha xidhiidhada way beddelaan.",
        "Çarpan negatif olduğunda, parantez içindeki tüm işaretler tersine döner.",
        "کله چې عامل منفي وي، د پرانتز دننه ټول نښې بدلېږي.",
      ),
    },
    // 6 — section (label + items: negative factor examples)
    {
      label: S(
        "Exemples avec facteur négatif",
        "Examples with a negative factor",
        "أمثلة مع عامل سالب",
        "مثال‌ها با عامل منفی",
        "ኣብነታት ብኣሉታ",
        "Приклади з від'ємним множником",
        "Exemplos com fator negativo",
        "Tusaalooyin leh taban taban",
        "Negatif çarpanlı örnekler",
        "د منفي عامل سره مثالونه",
      ),
      items: A(
        [
          "**−**2(x **−** 3) = **−**2x **+** 6  (le **−** × **−** donne **+**)",
          "**−**(x **−** 5) = **−**x **+** 5",
          "**−**(2x **+** 7) = **−**2x **−** 7",
        ],
        [
          "**−**2(x **−** 3) = **−**2x **+** 6  (**−** × **−** gives **+**)",
          "**−**(x **−** 5) = **−**x **+** 5",
          "**−**(2x **+** 7) = **−**2x **−** 7",
        ],
        [
          "**−**2(x **−** 3) = **−**2x **+** 6  (**−** × **−** يعطي **+**)",
          "**−**(x **−** 5) = **−**x **+** 5",
          "**−**(2x **+** 7) = **−**2x **−** 7",
        ],
        [
          "**−**2(x **−** 3) = **−**2x **+** 6  (**−** × **−** می‌دهد **+**)",
          "**−**(x **−** 5) = **−**x **+** 5",
          "**−**(2x **+** 7) = **−**2x **−** 7",
        ],
        [
          "**−**2(x **−** 3) = **−**2x **+** 6  (**−** × **−** **+** ይህብ)",
          "**−**(x **−** 5) = **−**x **+** 5",
          "**−**(2x **+** 7) = **−**2x **−** 7",
        ],
        [
          "**−**2(x **−** 3) = **−**2x **+** 6  (**−** × **−** дає **+**)",
          "**−**(x **−** 5) = **−**x **+** 5",
          "**−**(2x **+** 7) = **−**2x **−** 7",
        ],
        [
          "**−**2(x **−** 3) = **−**2x **+** 6  (**−** × **−** dá **+**)",
          "**−**(x **−** 5) = **−**x **+** 5",
          "**−**(2x **+** 7) = **−**2x **−** 7",
        ],
        [
          "**−**2(x **−** 3) = **−**2x **+** 6  (**−** × **−** waxay bixisaa **+**)",
          "**−**(x **−** 5) = **−**x **+** 5",
          "**−**(2x **+** 7) = **−**2x **−** 7",
        ],
        [
          "**−**2(x **−** 3) = **−**2x **+** 6  (**−** × **−** **+** verir)",
          "**−**(x **−** 5) = **−**x **+** 5",
          "**−**(2x **+** 7) = **−**2x **−** 7",
        ],
        [
          "**−**2(x **−** 3) = **−**2x **+** 6  (**−** × **−** **+** ورکوي)",
          "**−**(x **−** 5) = **−**x **+** 5",
          "**−**(2x **+** 7) = **−**2x **−** 7",
        ],
      ),
    },
    // 7 — highlight "Double distribution"
    {
      text: S(
        "Double distribution",
        "Double distribution",
        "التوزيع المزدوج",
        "توزیع دوتایی",
        "ድርብ ምድምር",
        "Подвійний розподіл",
        "Dupla distribuição",
        "Kala-qaybinta laba jibbaaran",
        "Çift dağılım",
        "دوه ګونی وېش",
      ),
    },
    // 8 — plain
    {
      text: S(
        "La double distributivité consiste à multiplier chaque terme du premier membre par chaque terme du second membre.",
        "Double distribution means multiplying each term of the first factor by each term of the second factor.",
        "التوزيع المزدوج يعني ضرب كل حد من العامل الأول بكل حد من العامل الثاني.",
        "توزیع دوتایی یعنی ضرب هر جمله از عامل اول در هر جمله از عامل دوم.",
        "ድርብ ምድምር ማለት ነፍሲ ወከፍ ወጽዓ ካብቲ ቀዳማይ ተቀራራቢ ብነፍሲ ወከፍ ወጽዓ ካብቲ ካልኣይ ተቀራራቢ ምብዛሕ እዩ።",
        "Подвійний розподіл означає множення кожного доданка першого множника на кожен доданок другого множника.",
        "A dupla distributividade consiste em multiplicar cada termo do primeiro fator por cada termo do segundo fator.",
        "Kala-qaybinta laba jibbaaran waxay ka dhigan tahay in eray kasta oo ka mid ah qaybta koowaad lagu dhufto eray kasta oo ka mid ah qaybta labaad.",
        "Çift dağılım, birinci çarpandaki her terimin ikinci çarpandaki her terimle çarpılması demektir.",
        "دوه ګونی وېش پدې معنی دی چې د لومړي عامل هرې جملې د دويم عامل هرې جملې سره ضرب کړئ.",
      ),
    },
    // 9 — plain "(a + b)(c + d)"
    {
      text: S(
        "(a **+** b)(c **+** d)",
        "(a **+** b)(c **+** d)",
        "(a **+** b)(c **+** d)",
        "(a **+** b)(c **+** d)",
        "(a **+** b)(c **+** d)",
        "(a **+** b)(c **+** d)",
        "(a **+** b)(c **+** d)",
        "(a **+** b)(c **+** d)",
        "(a **+** b)(c **+** d)",
        "(a **+** b)(c **+** d)",
      ),
    },
    // 10 — section (items: double distribution formula)
    {
      items: A(
        ["(a **+** b)(c **+** d) = ac **+** ad **+** bc **+** bd"],
        ["(a **+** b)(c **+** d) = ac **+** ad **+** bc **+** bd"],
        ["(a **+** b)(c **+** d) = ac **+** ad **+** bc **+** bd"],
        ["(a **+** b)(c **+** d) = ac **+** ad **+** bc **+** bd"],
        ["(a **+** b)(c **+** d) = ac **+** ad **+** bc **+** bd"],
        ["(a **+** b)(c **+** d) = ac **+** ad **+** bc **+** bd"],
        ["(a **+** b)(c **+** d) = ac **+** ad **+** bc **+** bd"],
        ["(a **+** b)(c **+** d) = ac **+** ad **+** bc **+** bd"],
        ["(a **+** b)(c **+** d) = ac **+** ad **+** bc **+** bd"],
        ["(a **+** b)(c **+** d) = ac **+** ad **+** bc **+** bd"],
      ),
    },
    // 11 — section (items: numeric example)
    {
      items: A(
        ["(x **+** 2)(x **+** 3) = x² **+** 3x **+** 2x **+** 6 = x² **+** 5x **+** 6"],
        ["(x **+** 2)(x **+** 3) = x² **+** 3x **+** 2x **+** 6 = x² **+** 5x **+** 6"],
        ["(x **+** 2)(x **+** 3) = x² **+** 3x **+** 2x **+** 6 = x² **+** 5x **+** 6"],
        ["(x **+** 2)(x **+** 3) = x² **+** 3x **+** 2x **+** 6 = x² **+** 5x **+** 6"],
        ["(x **+** 2)(x **+** 3) = x² **+** 3x **+** 2x **+** 6 = x² **+** 5x **+** 6"],
        ["(x **+** 2)(x **+** 3) = x² **+** 3x **+** 2x **+** 6 = x² **+** 5x **+** 6"],
        ["(x **+** 2)(x **+** 3) = x² **+** 3x **+** 2x **+** 6 = x² **+** 5x **+** 6"],
        ["(x **+** 2)(x **+** 3) = x² **+** 3x **+** 2x **+** 6 = x² **+** 5x **+** 6"],
        ["(x **+** 2)(x **+** 3) = x² **+** 3x **+** 2x **+** 6 = x² **+** 5x **+** 6"],
        ["(x **+** 2)(x **+** 3) = x² **+** 3x **+** 2x **+** 6 = x² **+** 5x **+** 6"],
      ),
    },
    // 12 — heading "Exemples fondamentaux"
    {
      text: S(
        "Exemples fondamentaux",
        "Basic examples",
        "أمثلة أساسية",
        "مثال‌های پایه",
        "መሰረታዊ ኣብነታት",
        "Основні приклади",
        "Exemplos fundamentais",
        "Tusaalooyin aasaasi ah",
        "Temel örnekler",
        "بنسټیز مثالونه",
      ),
    },
    // 13 — table (headers + 3 rows)
    {
      headers: A(
        ["Expression", "Développement", "Résultat"],
        ["Expression", "Expanded form", "Result"],
        ["العبارة", "التوسيع", "النتيجة"],
        ["عبارت", "گسترش", "نتیجه"],
        ["ሓረግ", "ምስፋሕ", "ውጽኢት"],
        ["Вираз", "Розклад", "Результат"],
        ["Expressão", "Desenvolvimento", "Resultado"],
        ["Weedh", "Fidinta", "Natiijo"],
        ["İfade", "Açılım", "Sonuç"],
        ["عبارت", "پراختیا", "پايله"],
      ),
      items: A(
        [
          "3(x **+** 4) | 3 × x **+** 3 × 4 | 3x **+** 12",
          "2(a **−** 5) | 2 × a **−** 2 × 5 | 2a **−** 10",
          "**−**3(2x **+** 1) | **−**3 × 2x **+** (**−**3) × 1 | **−**6x **−** 3",
        ],
        [
          "3(x **+** 4) | 3 × x **+** 3 × 4 | 3x **+** 12",
          "2(a **−** 5) | 2 × a **−** 2 × 5 | 2a **−** 10",
          "**−**3(2x **+** 1) | **−**3 × 2x **+** (**−**3) × 1 | **−**6x **−** 3",
        ],
        [
          "3(x **+** 4) | 3 × x **+** 3 × 4 | 3x **+** 12",
          "2(a **−** 5) | 2 × a **−** 2 × 5 | 2a **−** 10",
          "**−**3(2x **+** 1) | **−**3 × 2x **+** (**−**3) × 1 | **−**6x **−** 3",
        ],
        [
          "3(x **+** 4) | 3 × x **+** 3 × 4 | 3x **+** 12",
          "2(a **−** 5) | 2 × a **−** 2 × 5 | 2a **−** 10",
          "**−**3(2x **+** 1) | **−**3 × 2x **+** (**−**3) × 1 | **−**6x **−** 3",
        ],
        [
          "3(x **+** 4) | 3 × x **+** 3 × 4 | 3x **+** 12",
          "2(a **−** 5) | 2 × a **−** 2 × 5 | 2a **−** 10",
          "**−**3(2x **+** 1) | **−**3 × 2x **+** (**−**3) × 1 | **−**6x **−** 3",
        ],
        [
          "3(x **+** 4) | 3 × x **+** 3 × 4 | 3x **+** 12",
          "2(a **−** 5) | 2 × a **−** 2 × 5 | 2a **−** 10",
          "**−**3(2x **+** 1) | **−**3 × 2x **+** (**−**3) × 1 | **−**6x **−** 3",
        ],
        [
          "3(x **+** 4) | 3 × x **+** 3 × 4 | 3x **+** 12",
          "2(a **−** 5) | 2 × a **−** 2 × 5 | 2a **−** 10",
          "**−**3(2x **+** 1) | **−**3 × 2x **+** (**−**3) × 1 | **−**6x **−** 3",
        ],
        [
          "3(x **+** 4) | 3 × x **+** 3 × 4 | 3x **+** 12",
          "2(a **−** 5) | 2 × a **−** 2 × 5 | 2a **−** 10",
          "**−**3(2x **+** 1) | **−**3 × 2x **+** (**−**3) × 1 | **−**6x **−** 3",
        ],
        [
          "3(x **+** 4) | 3 × x **+** 3 × 4 | 3x **+** 12",
          "2(a **−** 5) | 2 × a **−** 2 × 5 | 2a **−** 10",
          "**−**3(2x **+** 1) | **−**3 × 2x **+** (**−**3) × 1 | **−**6x **−** 3",
        ],
        [
          "3(x **+** 4) | 3 × x **+** 3 × 4 | 3x **+** 12",
          "2(a **−** 5) | 2 × a **−** 2 × 5 | 2a **−** 10",
          "**−**3(2x **+** 1) | **−**3 × 2x **+** (**−**3) × 1 | **−**6x **−** 3",
        ],
      ),
    },
    // 14 — heading "Les identités remarquables"
    {
      text: S(
        "Les identités remarquables",
        "Remarkable identities",
        "الهويات المميزة",
        "اتحادهای مهم",
        "ፍሉያት ሓይልታት",
        "Формули скороченого множення",
        "Identidades notáveis",
        "Aqoonsiyada muhiimka ah",
        "Özdeşlikler",
        "مهمې هویتونه",
      ),
    },
    // 15 — plain
    {
      text: S(
        "Certains développements reviennent souvent : on les apprend par cœur pour aller plus vite.",
        "Some expansions come up often: we learn them by heart to work faster.",
        "بعض التوسيعات تتكرر كثيرًا: نحفظها عن ظهر قلب للعمل بسرعة أكبر.",
        "برخی گسترش‌ها زیاد تکرار می‌شوند: آن‌ها را حفظ می‌کنیم تا سریع‌تر پیش برویم.",
        "ገለ ምስፋሓት ብዙሕ ይደገሙ፦ ብቕልጡፍ ንምስራሕ ብልቢ ንሰምዖም።",
        "Деякі розклади часто трапляються: їх вивчають напам'ять, щоб працювати швидше.",
        "Alguns desenvolvimentos aparecem muitas vezes: aprendemo-los de cor para ir mais depressa.",
        "Fidimooyin qaarkood si joogto ah ayey u soo noqdaan: waxaan ku xafidnaa si aan si degdeg ah u shaqeyno.",
        "Bazı açılımlar sık tekrarlanır: daha hızlı ilerlemek için ezberlenir.",
        "ځینې پراختیاوې ډېرې تکرارېږي: د چټک کار لپاره یې په زړه ساتو.",
      ),
    },
    // 16 — highlight "Carré d'une somme"
    {
      text: S(
        "Carré d'une somme",
        "Square of a sum",
        "مربع مجموع",
        "مربع یک جمع",
        "ድምር ስኹዕ",
        "Квадрат суми",
        "Quadrado de uma soma",
        "Labajibbaaranka isku-darka",
        "Toplamın karesi",
        "د مجموعې مربع",
      ),
    },
    // 17 — section (items)
    {
      items: A(
        ["(a **+** b)² = a² **+** 2ab **+** b²"],
        ["(a **+** b)² = a² **+** 2ab **+** b²"],
        ["(a **+** b)² = a² **+** 2ab **+** b²"],
        ["(a **+** b)² = a² **+** 2ab **+** b²"],
        ["(a **+** b)² = a² **+** 2ab **+** b²"],
        ["(a **+** b)² = a² **+** 2ab **+** b²"],
        ["(a **+** b)² = a² **+** 2ab **+** b²"],
        ["(a **+** b)² = a² **+** 2ab **+** b²"],
        ["(a **+** b)² = a² **+** 2ab **+** b²"],
        ["(a **+** b)² = a² **+** 2ab **+** b²"],
      ),
    },
    // 18 — highlight "Carré d'une différence"
    {
      text: S(
        "Carré d'une différence",
        "Square of a difference",
        "مربع فرق",
        "مربع یک تفاضل",
        "فرق ስኹዕ",
        "Квадрат різниці",
        "Quadrado de uma diferença",
        "Labajibbaaranka farqiga",
        "Farkın karesi",
        "د توپیر مربع",
      ),
    },
    // 19 — section (items)
    {
      items: A(
        ["(a **−** b)² = a² **−** 2ab **+** b²"],
        ["(a **−** b)² = a² **−** 2ab **+** b²"],
        ["(a **−** b)² = a² **−** 2ab **+** b²"],
        ["(a **−** b)² = a² **−** 2ab **+** b²"],
        ["(a **−** b)² = a² **−** 2ab **+** b²"],
        ["(a **−** b)² = a² **−** 2ab **+** b²"],
        ["(a **−** b)² = a² **−** 2ab **+** b²"],
        ["(a **−** b)² = a² **−** 2ab **+** b²"],
        ["(a **−** b)² = a² **−** 2ab **+** b²"],
        ["(a **−** b)² = a² **−** 2ab **+** b²"],
      ),
    },
    // 20 — highlight "Différence de deux carrés"
    {
      text: S(
        "Différence de deux carrés",
        "Difference of two squares",
        "فرق مربعين",
        "تفاضل دو مربع",
        "ክልተ ስኹዓት فرق",
        "Різниця двох квадратів",
        "Diferença de dois quadrados",
        "Farqiga laba labajibbaaran",
        "İki karenin farkı",
        "د دوو مربعونو توپیر",
      ),
    },
    // 21 — section (items)
    {
      items: A(
        ["a² **−** b² = (a **−** b)(a **+** b)"],
        ["a² **−** b² = (a **−** b)(a **+** b)"],
        ["a² **−** b² = (a **−** b)(a **+** b)"],
        ["a² **−** b² = (a **−** b)(a **+** b)"],
        ["a² **−** b² = (a **−** b)(a **+** b)"],
        ["a² **−** b² = (a **−** b)(a **+** b)"],
        ["a² **−** b² = (a **−** b)(a **+** b)"],
        ["a² **−** b² = (a **−** b)(a **+** b)"],
        ["a² **−** b² = (a **−** b)(a **+** b)"],
        ["a² **−** b² = (a **−** b)(a **+** b)"],
      ),
    },
    // 22 — highlight "Cube d'une somme"
    {
      text: S(
        "Cube d'une somme",
        "Cube of a sum",
        "مكعب مجموع",
        "مکعب یک جمع",
        "ድምር ቦቅ",
        "Куб суми",
        "Cubo de uma soma",
        "Saddex-jibbaaranka isku-darka",
        "Toplamın küpü",
        "د مجموعې مکعب",
      ),
    },
    // 23 — section (items)
    {
      items: A(
        ["(a **+** b)³ = a³ **+** 3a²b **+** 3ab² **+** b³"],
        ["(a **+** b)³ = a³ **+** 3a²b **+** 3ab² **+** b³"],
        ["(a **+** b)³ = a³ **+** 3a²b **+** 3ab² **+** b³"],
        ["(a **+** b)³ = a³ **+** 3a²b **+** 3ab² **+** b³"],
        ["(a **+** b)³ = a³ **+** 3a²b **+** 3ab² **+** b³"],
        ["(a **+** b)³ = a³ **+** 3a²b **+** 3ab² **+** b³"],
        ["(a **+** b)³ = a³ **+** 3a²b **+** 3ab² **+** b³"],
        ["(a **+** b)³ = a³ **+** 3a²b **+** 3ab² **+** b³"],
        ["(a **+** b)³ = a³ **+** 3a²b **+** 3ab² **+** b³"],
        ["(a **+** b)³ = a³ **+** 3a²b **+** 3ab² **+** b³"],
      ),
    },
    // 24 — highlight "Cube d'une différence"
    {
      text: S(
        "Cube d'une différence",
        "Cube of a difference",
        "مكعب فرق",
        "مکعب یک تفاضل",
        "فرق ቦቅ",
        "Куб різниці",
        "Cubo de uma diferença",
        "Saddex-jibbaaranka farqiga",
        "Farkın küpü",
        "د توپیر مکعب",
      ),
    },
    // 25 — section (items)
    {
      items: A(
        ["(a **−** b)³ = a³ **−** 3a²b **+** 3ab² **−** b³"],
        ["(a **−** b)³ = a³ **−** 3a²b **+** 3ab² **−** b³"],
        ["(a **−** b)³ = a³ **−** 3a²b **+** 3ab² **−** b³"],
        ["(a **−** b)³ = a³ **−** 3a²b **+** 3ab² **−** b³"],
        ["(a **−** b)³ = a³ **−** 3a²b **+** 3ab² **−** b³"],
        ["(a **−** b)³ = a³ **−** 3a²b **+** 3ab² **−** b³"],
        ["(a **−** b)³ = a³ **−** 3a²b **+** 3ab² **−** b³"],
        ["(a **−** b)³ = a³ **−** 3a²b **+** 3ab² **−** b³"],
        ["(a **−** b)³ = a³ **−** 3a²b **+** 3ab² **−** b³"],
        ["(a **−** b)³ = a³ **−** 3a²b **+** 3ab² **−** b³"],
      ),
    },
    // 26 — highlight "Somme de deux cubes"
    {
      text: S(
        "Somme de deux cubes",
        "Sum of two cubes",
        "مجموع مكعبين",
        "جمع دو مکعب",
        "ክልተ ቦቃት ድምር",
        "Сума двох кубів",
        "Soma de dois cubos",
        "Isku-darka laba saddex-jibbaaran",
        "İki küpün toplamı",
        "د دوو مکعبونو مجموعه",
      ),
    },
    // 27 — section (items)
    {
      items: A(
        ["a³ **+** b³ = (a **+** b)(a² **−** ab **+** b²)"],
        ["a³ **+** b³ = (a **+** b)(a² **−** ab **+** b²)"],
        ["a³ **+** b³ = (a **+** b)(a² **−** ab **+** b²)"],
        ["a³ **+** b³ = (a **+** b)(a² **−** ab **+** b²)"],
        ["a³ **+** b³ = (a **+** b)(a² **−** ab **+** b²)"],
        ["a³ **+** b³ = (a **+** b)(a² **−** ab **+** b²)"],
        ["a³ **+** b³ = (a **+** b)(a² **−** ab **+** b²)"],
        ["a³ **+** b³ = (a **+** b)(a² **−** ab **+** b²)"],
        ["a³ **+** b³ = (a **+** b)(a² **−** ab **+** b²)"],
        ["a³ **+** b³ = (a **+** b)(a² **−** ab **+** b²)"],
      ),
    },
    // 28 — highlight "Différence de deux cubes"
    {
      text: S(
        "Différence de deux cubes",
        "Difference of two cubes",
        "فرق مكعبين",
        "تفاضل دو مکعب",
        "ክልተ ቦቃት فرق",
        "Різниця двох кубів",
        "Diferença de dois cubos",
        "Farqiga laba saddex-jibbaaran",
        "İki küpün farkı",
        "د دوو مکعبونو توپیر",
      ),
    },
    // 29 — section (items: difference of two cubes)
    {
      items: A(
        ["a³ **−** b³ = (a **−** b)(a² **+** ab **+** b²)"],
        ["a³ **−** b³ = (a **−** b)(a² **+** ab **+** b²)"],
        ["a³ **−** b³ = (a **−** b)(a² **+** ab **+** b²)"],
        ["a³ **−** b³ = (a **−** b)(a² **+** ab **+** b²)"],
        ["a³ **−** b³ = (a **−** b)(a² **+** ab **+** b²)"],
        ["a³ **−** b³ = (a **−** b)(a² **+** ab **+** b²)"],
        ["a³ **−** b³ = (a **−** b)(a² **+** ab **+** b²)"],
        ["a³ **−** b³ = (a **−** b)(a² **+** ab **+** b²)"],
        ["a³ **−** b³ = (a **−** b)(a² **+** ab **+** b²)"],
        ["a³ **−** b³ = (a **−** b)(a² **+** ab **+** b²)"],
      ),
    },
    // 30 — highlight "Carré de trois termes"
    {
      text: S(
        "Carré de trois termes",
        "Square of three terms",
        "مربع ثلاثة حدود",
        "مربع سه جمله",
        "ሰለስተ ወጽዓት ስኹዕ",
        "Квадрат трьох доданків",
        "Quadrado de três termos",
        "Labajibbaaranka saddex eray",
        "Üç terimin karesi",
        "د درې جملو مربع",
      ),
    },
    // 31 — section (items: square of three terms)
    {
      items: A(
        ["(a **+** b **+** c)² = a² **+** b² **+** c² **+** 2ab **+** 2ac **+** 2bc"],
        ["(a **+** b **+** c)² = a² **+** b² **+** c² **+** 2ab **+** 2ac **+** 2bc"],
        ["(a **+** b **+** c)² = a² **+** b² **+** c² **+** 2ab **+** 2ac **+** 2bc"],
        ["(a **+** b **+** c)² = a² **+** b² **+** c² **+** 2ab **+** 2ac **+** 2bc"],
        ["(a **+** b **+** c)² = a² **+** b² **+** c² **+** 2ab **+** 2ac **+** 2bc"],
        ["(a **+** b **+** c)² = a² **+** b² **+** c² **+** 2ab **+** 2ac **+** 2bc"],
        ["(a **+** b **+** c)² = a² **+** b² **+** c² **+** 2ab **+** 2ac **+** 2bc"],
        ["(a **+** b **+** c)² = a² **+** b² **+** c² **+** 2ab **+** 2ac **+** 2bc"],
        ["(a **+** b **+** c)² = a² **+** b² **+** c² **+** 2ab **+** 2ac **+** 2bc"],
        ["(a **+** b **+** c)² = a² **+** b² **+** c² **+** 2ab **+** 2ac **+** 2bc"],
      ),
    },
  ],
  consignes: {
    symbolic_1: S(
      "Développez les expressions.",
      "Expand the expressions.",
      "وسّع التعبيرات.",
      "عبارت‌ها را گسترش دهید.",
      "ኣዝማሪታት ምስፋሕ።",
      "Розкрийте вирази.",
      "Desenvolva as expressões.",
      "Fidi weedhaha.",
      "İfadeleri açın.",
      "عبارتونه پراخ کړئ.",
    ),
    symbolic_2: S(
      "Développez les identités remarquables.",
      "Expand the remarkable identities.",
      "وسّع الهويات المميزة.",
      "اتحادهای مهم را گسترش دهید.",
      "ፍሉያት ሓይልታት ምስፋሕ።",
      "Розкрийте формули скороченого множення.",
      "Desenvolva as identidades notáveis.",
      "Fidi aqoonsiyada muhiimka ah.",
      "Özdeşlikleri açın.",
      "مهمې هویتونه پراخ کړئ.",
    ),
    symbolic_3: S(
      "Développez les expressions.",
      "Expand the expressions.",
      "وسّع التعبيرات.",
      "عبارت‌ها را گسترش دهید.",
      "ኣዝማሪታት ምስፋሕ።",
      "Розкрийте вирази.",
      "Desenvolva as expressões.",
      "Fidi weedhaha.",
      "İfadeleri açın.",
      "عبارتونه پراخ کړئ.",
    ),
  },
};
