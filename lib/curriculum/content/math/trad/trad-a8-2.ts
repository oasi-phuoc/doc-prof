import type { SubmoduleTrad } from "./trad-types";

const S = (fr: string, en: string, ar: string, fa: string, ti: string, uk: string, pt: string, so: string, tr: string, ps: string) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });
const A = (fr: string[], en: string[], ar: string[], fa: string[], ti: string[], uk: string[], pt: string[], so: string[], tr: string[], ps: string[]) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

export const TRAD_A8_2: SubmoduleTrad = {
  submoduleId: "A8-2",
  title: S(
    "Calcul de puissances",
    "Computing powers",
    "حساب القوى",
    "محاسبه توان‌ها",
    "ምሕሳብ ሓይልታት",
    "Обчислення степенів",
    "Cálculo de potências",
    "Xisaabinta awoodaha",
    "Üslü sayıları hesaplama",
    "د توانونو حساب"
  ),
  blocks: [
    // 0 — highlight "Addition et soustraction"
    {
      text: S(
        "Addition et soustraction",
        "Addition and subtraction",
        "الجمع والطرح",
        "جمع و تفریق",
        "ምኽፋልን ምቕናስን",
        "Додавання і віднімання",
        "Adição e subtração",
        "Isku-dar iyo ka-jar",
        "Toplama ve çıkarma",
        "جمع او تفريق"
      ),
    },
    // 1 — plain "Quand il y a une addition ou une soustraction de puissances..."
    {
      text: S(
        "Quand il y a une addition ou une soustraction de puissances, il faut toujours calculer chaque puissance séparément.",
        "When there is an addition or subtraction of powers, each power must always be calculated separately.",
        "عند وجود جمع أو طرح للقوى، يجب دائمًا حساب كل قوة بشكل منفصل.",
        "وقتی جمع یا تفریق توان‌ها وجود دارد، باید هر توان را جداگانه محاسبه کرد.",
        "ምስ ዝህሉ ምርካብ ወይ ምቕናስ ሓይልታት፣ ነፍሲ ወከፍ ሓይሊ ብፍሉይ ክሕሰብ ኣለዎ።",
        "Коли є додавання або віднімання степенів, кожен степінь слід обчислювати окремо.",
        "Quando há uma adição ou subtração de potências, cada potência deve ser calculada separadamente.",
        "Marka jirto isku-dar ama ka-jar awoodaha, mid kasta waa in si gaar ah loo xisaabiyaa.",
        "Üslerin toplandığı veya çıkarıldığı durumlarda, her üs ayrı ayrı hesaplanmalıdır.",
        "کله چې د توانونو جمع یا تفريق وي، هر توان باید جلا جلا حسابول شي."
      ),
    },
    // 2 — plain "2³ + 3²" — pure math notation
    {},
    // 3 — section (items: pure math steps for 2³ + 3²)
    {},
    // 4 — plain "" (spacer)
    {},
    // 5 — plain "5² − 3²" — pure math notation
    {},
    // 6 — section (items: pure math steps for 5² − 3²)
    {},
    // 7 — heading "Multiplication"
    {
      text: S(
        "Multiplication",
        "Multiplication",
        "الضرب",
        "ضرب",
        "ምብዛሕ",
        "Множення",
        "Multiplicação",
        "Isku-dhufasho",
        "Çarpma",
        "ضرب"
      ),
    },
    // 8 — plain "Lorsque l'on multiplie deux puissances qui ont la même base..."
    {
      text: S(
        "Lorsque l'on multiplie deux puissances qui ont la même base, on conserve la base et on additionne les exposants.",
        "When multiplying two powers with the same base, keep the base and add the exponents.",
        "عند ضرب قوتين لهما نفس الأساس، نحتفظ بالأساس ونجمع الأسس.",
        "وقتی دو توان با پایه یکسان ضرب می‌شوند، پایه را نگه می‌داریم و نماها را جمع می‌کنیم.",
        "ክልተ ሓይልታት ተመሳሳሊ መሰረት ዝውንናን ምስ ዝብዝሑ፣ መሰረት ንሕዞ ኤክስፖናንትታት ድማ ንደምሮም።",
        "Коли множимо два степені з однаковою основою, основу залишаємо і показники додаємо.",
        "Ao multiplicar duas potências com a mesma base, conserva-se a base e somam-se os expoentes.",
        "Marka lagu dhufanayo awoodaha leh saldhig isku mid ah, saldhigga waa la ilaaliyaa jibbaaradana waa la isku daraa.",
        "Aynı tabanlı iki üs çarpılırken taban korunur ve üsler toplanır.",
        "کله چې دوه توانونه چې يو بنسټ لري ضرب کېږي، بنسټ ساتل کېږي او توانونه جمع کېږي."
      ),
    },
    // 9 — table (header only: "aᵐ × aⁿ = aᵐ⁺ⁿ") — pure math formula header
    {
      headers: A(
        ["aᵐ × aⁿ = aᵐ⁺ⁿ"],
        ["aᵐ × aⁿ = aᵐ⁺ⁿ"],
        ["aᵐ × aⁿ = aᵐ⁺ⁿ"],
        ["aᵐ × aⁿ = aᵐ⁺ⁿ"],
        ["aᵐ × aⁿ = aᵐ⁺ⁿ"],
        ["aᵐ × aⁿ = aᵐ⁺ⁿ"],
        ["aᵐ × aⁿ = aᵐ⁺ⁿ"],
        ["aᵐ × aⁿ = aᵐ⁺ⁿ"],
        ["aᵐ × aⁿ = aᵐ⁺ⁿ"],
        ["aᵐ × aⁿ = aᵐ⁺ⁿ"]
      ),
    },
    // 10 — plain "2³ × 2² = 2³⁺² = 2⁵ = 32" — pure math
    {},
    // 11 — section (items: pure math development of 2³ × 2²)
    {},
    // 12 — heading "Division"
    {
      text: S(
        "Division",
        "Division",
        "القسمة",
        "تقسیم",
        "ምምቃል",
        "Ділення",
        "Divisão",
        "Qeybinta",
        "Bölme",
        "تقسيم"
      ),
    },
    // 13 — plain "Lorsque l'on divise deux puissances qui ont la même base..."
    {
      text: S(
        "Lorsque l'on divise deux puissances qui ont la même base, on conserve la base et on soustrait les exposants.",
        "When dividing two powers with the same base, keep the base and subtract the exponents.",
        "عند قسمة قوتين لهما نفس الأساس، نحتفظ بالأساس ونطرح الأسس.",
        "وقتی دو توان با پایه یکسان تقسیم می‌شوند، پایه را نگه می‌داریم و نماها را کم می‌کنیم.",
        "ክልተ ሓይልታት ተመሳሳሊ መሰረት ዝውንናን ምስ ዝምቀሉ፣ መሰረት ንሕዞ ኤክስፖናንትታት ድማ ንቕንስ።",
        "Коли ділимо два степені з однаковою основою, основу залишаємо і показники віднімаємо.",
        "Ao dividir duas potências com a mesma base, conserva-se a base e subtraem-se os expoentes.",
        "Marka lagu qeybinayo awoodaha leh saldhig isku mid ah, saldhigga waa la ilaaliyaa jibbaaradana waa la kala jaraa.",
        "Aynı tabanlı iki üs bölünürken taban korunur ve üsler çıkarılır.",
        "کله چې دوه توانونه چې يو بنسټ لري تقسيم کېږي، بنسټ ساتل کېږي او توانونه تفريق کېږي."
      ),
    },
    // 14 — table (header only: "aⁿ ÷ aᵐ = aⁿ⁻ᵐ") — pure math formula header
    {
      headers: A(
        ["aⁿ ÷ aᵐ = aⁿ⁻ᵐ"],
        ["aⁿ ÷ aᵐ = aⁿ⁻ᵐ"],
        ["aⁿ ÷ aᵐ = aⁿ⁻ᵐ"],
        ["aⁿ ÷ aᵐ = aⁿ⁻ᵐ"],
        ["aⁿ ÷ aᵐ = aⁿ⁻ᵐ"],
        ["aⁿ ÷ aᵐ = aⁿ⁻ᵐ"],
        ["aⁿ ÷ aᵐ = aⁿ⁻ᵐ"],
        ["aⁿ ÷ aᵐ = aⁿ⁻ᵐ"],
        ["aⁿ ÷ aᵐ = aⁿ⁻ᵐ"],
        ["aⁿ ÷ aᵐ = aⁿ⁻ᵐ"]
      ),
    },
    // 15 — plain "2⁵ ÷ 2² = 2⁵⁻² = 2³ = 8" — pure math
    {},
    // 16 — section (items: pure math development of 2⁵ ÷ 2²)
    {},
    // 17 — heading "Puissance d'une puissance"
    {
      text: S(
        "Puissance d'une puissance",
        "Power of a power",
        "قوة القوة",
        "توان یک توان",
        "ሓይሊ ናይ ሓይሊ",
        "Степінь степеня",
        "Potência de uma potência",
        "Awood awoodeed",
        "Üssün üssü",
        "د توان توان"
      ),
    },
    // 18 — plain "Lorsqu'une puissance est elle-même élevée à une autre puissance..."
    {
      text: S(
        "Lorsqu'une puissance est elle-même élevée à une autre puissance, on conserve la base et on multiplie les exposants.",
        "When a power is itself raised to another power, keep the base and multiply the exponents.",
        "عندما ترفع قوة إلى قوة أخرى، نحتفظ بالأساس ونضرب الأسس.",
        "وقتی یک توان خودش به توان دیگری برسد، پایه را نگه می‌داریم و نماها را ضرب می‌کنیم.",
        "ሓይሊ ናብ ካልእ ሓይሊ ዝድይብ ምስ ዝኸውን፣ መሰረት ንሕዞ ኤክስፖናንትታት ድማ ንበዝሖም።",
        "Коли степінь піднімають до іншого степеня, основу залишаємо і показники множимо.",
        "Quando uma potência é ela própria elevada a outra potência, conserva-se a base e multiplicam-se os expoentes.",
        "Marka awood la kor u qaado awood kale, saldhigga waa la ilaaliyaa jibbaaradana waa la isku dhufaa.",
        "Bir üs, başka bir üsse yükseltildiğinde taban korunur ve üsler çarpılır.",
        "کله چې يو توان پخپله بل توان ته لوړ شي، بنسټ ساتل کېږي او توانونه ضرب کېږي."
      ),
    },
    // 19 — table (header only: "(aᵐ)ⁿ = aᵐˣⁿ") — pure math formula header
    {
      headers: A(
        ["(aᵐ)ⁿ = aᵐˣⁿ"],
        ["(aᵐ)ⁿ = aᵐˣⁿ"],
        ["(aᵐ)ⁿ = aᵐˣⁿ"],
        ["(aᵐ)ⁿ = aᵐˣⁿ"],
        ["(aᵐ)ⁿ = aᵐˣⁿ"],
        ["(aᵐ)ⁿ = aᵐˣⁿ"],
        ["(aᵐ)ⁿ = aᵐˣⁿ"],
        ["(aᵐ)ⁿ = aᵐˣⁿ"],
        ["(aᵐ)ⁿ = aᵐˣⁿ"],
        ["(aᵐ)ⁿ = aᵐˣⁿ"]
      ),
    },
    // 20 — plain "(2³)²" — pure math notation
    {},
    // 21 — section (items: pure math development of (2³)²)
    {},
  ],
  consignes: {
    "Effectuez les multiplications de puissances de même base.": { fr: "Effectuez les multiplications de puissances de même base.", en: "Multiply powers with the same base.", ar: "أنجز ضرب قوى لها نفس الأساس.", fa: "توان‌های هم‌پایه را ضرب کنید.", ti: "ናይ ተመሳሳሊ መሰረት ሓይልታት ምብዛሕ ግበር።", uk: "Помножте степені з однаковою основою.", pt: "Efetue as multiplicações de potências de mesma base.", so: "Samee isku-dhufashada awoodaha isla saldhig.", tr: "Aynı tabanlı üslerin çarpımını yapın.", ps: "د ورته بنسټ توانونو ضرب وکړئ." },
    "Effectuez les divisions de puissances de même base.": { fr: "Effectuez les divisions de puissances de même base.", en: "Divide powers with the same base.", ar: "أنجز قسمة قوى لها نفس الأساس.", fa: "توان‌های هم‌پایه را تقسیم کنید.", ti: "ናይ ተመሳሳሊ መሰረት ሓይልታት ምክፍፋል ግበር።", uk: "Поділіть степені з однаковою основою.", pt: "Efetue as divisões de potências de mesma base.", so: "Samee qaybinta awoodaha isla saldhig.", tr: "Aynı tabanlı üslerin bölümünü yapın.", ps: "د ورته بنسټ توانونو ویش وکړئ." },
    "Effectuez les puissances de puissances.": { fr: "Effectuez les puissances de puissances.", en: "Compute powers of powers.", ar: "أنجز قوى القوى.", fa: "توانِ توان را حساب کنید.", ti: "ሓይሊ ናይ ሓይሊ ግበር።", uk: "Обчисліть степені степенів.", pt: "Efetue as potências de potências.", so: "Samee awoodaha awoodaha.", tr: "Üslerin üslerini hesaplayın.", ps: "د توانونو توانونه محاسبه کړئ." },
    "Effectuez les calculs.": { fr: "Effectuez les calculs.", en: "Perform the calculations.", ar: "أنجز الحسابات.", fa: "محاسبات را انجام دهید.", ti: "ሕሳባት ግበር።", uk: "Виконайте обчислення.", pt: "Efetue os cálculos.", so: "Samee xisaabaha.", tr: "Hesaplamaları yapın.", ps: "محاسبې ترسره کړئ." },
    "Complétez les égalités.": { fr: "Complétez les égalités.", en: "Complete the equalities.", ar: "أكمل المتساويات.", fa: "تساوی‌ها را کامل کنید.", ti: "ማዕረታት ምላእ።", uk: "Доповніть рівності.", pt: "Complete as igualdades.", so: "Ku buuxi sinnimada.", tr: "Eşitlikleri tamamlayın.", ps: "مساوات بشپړ کړئ." },
  },
};
