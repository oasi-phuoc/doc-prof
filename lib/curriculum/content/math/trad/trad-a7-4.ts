import type { SubmoduleTrad } from "./trad-types";

const S = (fr: string, en: string, ar: string, fa: string, ti: string, uk: string, pt: string, so: string, tr: string, ps: string) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

const A = (fr: string[], en: string[], ar: string[], fa: string[], ti: string[], uk: string[], pt: string[], so: string[], tr: string[], ps: string[]) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

export const TRAD_A7_4: SubmoduleTrad = {
  submoduleId: "A7-4",
  title: S(
    "Multiplication et division",
    "Multiplication and division",
    "الضرب والقسمة",
    "ضرب و تقسیم",
    "ምርባሕን ምክፋልን",
    "Множення і ділення",
    "Multiplicação e divisão",
    "Isku-dhufasho iyo qaybin",
    "Çarpma ve bölme",
    "ضرب او وېش",
  ),
  blocks: [
    // 0 — heading "Règle des signes" black:true
    {
      text: S(
        "Règle des signes",
        "Sign rule",
        "قاعدة الإشارات",
        "قانون علامت‌ها",
        "ሕጊ ምልክታት",
        "Правило знаків",
        "Regra dos sinais",
        "Xeerka calaamadaha",
        "İşaret kuralı",
        "د نښو قاعده",
      ),
    },

    // 1 — plain "La même règle des signes s'applique pour la multiplication (×) et la division (÷)."
    {
      text: S(
        "La même règle des signes s'applique pour la multiplication (**×**) et la division (**÷**).",
        "The same sign rule applies for multiplication (**×**) and division (**÷**).",
        "تنطبق قاعدة الإشارات نفسها على الضرب (**×**) والقسمة (**÷**).",
        "همان قانون علامت‌ها برای ضرب (**×**) و تقسیم (**÷**) اعمال می‌شود.",
        "ሓደ ዓይነት ሕጊ ምልክታት ን ምርባሕ (**×**) እና ምክፋል (**÷**) ይምልከት።",
        "Те саме правило знаків застосовується для множення (**×**) і ділення (**÷**).",
        "A mesma regra dos sinais aplica-se para a multiplicação (**×**) e a divisão (**÷**).",
        "Xeerka calaamadaha isku mid ah ayaa khuseeya isku-dhufashada (**×**) iyo qaybinta (**÷**).",
        "Aynı işaret kuralı çarpma (**×**) ve bölme (**÷**) için geçerlidir.",
        "د نښو ورته قاعده د ضرب (**×**) او وېش (**÷**) لپاره پلي کيږي.",
      ),
    },

    // 2 — plain "Mêmes signes → résultat **positif** (+)"
    {
      text: S(
        "Mêmes signes → résultat **positif** (+)",
        "Same signs → **positive** result (+)",
        "إشارات متماثلة → نتيجة **موجبة** (+)",
        "علامت‌های یکسان → نتیجه **مثبت** (+)",
        "ሓደ ዓይነት ምልክታት → ውጽኢት **ኣዎንታዊ** (+)",
        "Однакові знаки → **додатний** результат (+)",
        "Sinais iguais → resultado **positivo** (+)",
        "Calaamado isku mid ah → natiijo **togan** (+)",
        "Aynı işaretler → **pozitif** sonuç (+)",
        "يو شان نښې → **مثبته** پايله (+)",
      ),
    },

    // 3 — plain "Signes contraires → résultat **négatif** (−)"
    {
      text: S(
        "Signes contraires → résultat **négatif** (−)",
        "Opposite signs → **negative** result (−)",
        "إشارات مختلفة → نتيجة **سالبة** (−)",
        "علامت‌های مخالف → نتیجه **منفی** (−)",
        "ተጻራሪ ምልክታት → ውጽኢት **ኣሉታዊ** (−)",
        "Різні знаки → **від'ємний** результат (−)",
        "Sinais contrários → resultado **negativo** (−)",
        "Calaamado kala duwan → natiijo **taban** (−)",
        "Zıt işaretler → **negatif** sonuç (−)",
        "مخالفې نښې → **منفي** پايله (−)",
      ),
    },

    // 4 — table headers:["Signes","Résultat"], rows with "(positif)"/"(négatif)" text
    {
      headers: {
        fr: ["Signes", "Résultat"],
        en: ["Signs", "Result"],
        ar: ["الإشارات", "النتيجة"],
        fa: ["علامت‌ها", "نتیجه"],
        ti: ["ምልክታት", "ውጽኢት"],
        uk: ["Знаки", "Результат"],
        pt: ["Sinais", "Resultado"],
        so: ["Calaamado", "Natiijo"],
        tr: ["İşaretler", "Sonuç"],
        ps: ["نښې", "پايله"],
      },
      items: A(
        [
          "(**+**) × (**+**)\n(**+**) ÷ (**+**) | **+** (positif)",
          "(**−**) × (**−**)\n(**−**) ÷ (**−**) | **+** (positif)",
          "(**+**) × (**−**)\n(**+**) ÷ (**−**) | **−** (négatif)",
          "(**−**) × (**+**)\n(**−**) ÷ (**+**) | **−** (négatif)",
        ],
        [
          "(**+**) × (**+**)\n(**+**) ÷ (**+**) | **+** (positive)",
          "(**−**) × (**−**)\n(**−**) ÷ (**−**) | **+** (positive)",
          "(**+**) × (**−**)\n(**+**) ÷ (**−**) | **−** (negative)",
          "(**−**) × (**+**)\n(**−**) ÷ (**+**) | **−** (negative)",
        ],
        [
          "(**+**) × (**+**)\n(**+**) ÷ (**+**) | **+** (موجب)",
          "(**−**) × (**−**)\n(**−**) ÷ (**−**) | **+** (موجب)",
          "(**+**) × (**−**)\n(**+**) ÷ (**−**) | **−** (سالب)",
          "(**−**) × (**+**)\n(**−**) ÷ (**+**) | **−** (سالب)",
        ],
        [
          "(**+**) × (**+**)\n(**+**) ÷ (**+**) | **+** (مثبت)",
          "(**−**) × (**−**)\n(**−**) ÷ (**−**) | **+** (مثبت)",
          "(**+**) × (**−**)\n(**+**) ÷ (**−**) | **−** (منفی)",
          "(**−**) × (**+**)\n(**−**) ÷ (**+**) | **−** (منفی)",
        ],
        [
          "(**+**) × (**+**)\n(**+**) ÷ (**+**) | **+** (ኣዎንታዊ)",
          "(**−**) × (**−**)\n(**−**) ÷ (**−**) | **+** (ኣዎንታዊ)",
          "(**+**) × (**−**)\n(**+**) ÷ (**−**) | **−** (ኣሉታዊ)",
          "(**−**) × (**+**)\n(**−**) ÷ (**+**) | **−** (ኣሉታዊ)",
        ],
        [
          "(**+**) × (**+**)\n(**+**) ÷ (**+**) | **+** (додатний)",
          "(**−**) × (**−**)\n(**−**) ÷ (**−**) | **+** (додатний)",
          "(**+**) × (**−**)\n(**+**) ÷ (**−**) | **−** (від'ємний)",
          "(**−**) × (**+**)\n(**−**) ÷ (**+**) | **−** (від'ємний)",
        ],
        [
          "(**+**) × (**+**)\n(**+**) ÷ (**+**) | **+** (positivo)",
          "(**−**) × (**−**)\n(**−**) ÷ (**−**) | **+** (positivo)",
          "(**+**) × (**−**)\n(**+**) ÷ (**−**) | **−** (negativo)",
          "(**−**) × (**+**)\n(**−**) ÷ (**+**) | **−** (negativo)",
        ],
        [
          "(**+**) × (**+**)\n(**+**) ÷ (**+**) | **+** (togan)",
          "(**−**) × (**−**)\n(**−**) ÷ (**−**) | **+** (togan)",
          "(**+**) × (**−**)\n(**+**) ÷ (**−**) | **−** (taban)",
          "(**−**) × (**+**)\n(**−**) ÷ (**+**) | **−** (taban)",
        ],
        [
          "(**+**) × (**+**)\n(**+**) ÷ (**+**) | **+** (pozitif)",
          "(**−**) × (**−**)\n(**−**) ÷ (**−**) | **+** (pozitif)",
          "(**+**) × (**−**)\n(**+**) ÷ (**−**) | **−** (negatif)",
          "(**−**) × (**+**)\n(**−**) ÷ (**+**) | **−** (negatif)",
        ],
        [
          "(**+**) × (**+**)\n(**+**) ÷ (**+**) | **+** (مثبت)",
          "(**−**) × (**−**)\n(**−**) ÷ (**−**) | **+** (مثبت)",
          "(**+**) × (**−**)\n(**+**) ÷ (**−**) | **−** (منفي)",
          "(**−**) × (**+**)\n(**−**) ÷ (**+**) | **−** (منفي)",
        ],
      ),
    },

    // 5 — heading "Multiplication" black:true
    {
      text: S(
        "Multiplication",
        "Multiplication",
        "الضرب",
        "ضرب",
        "ምርባሕ",
        "Множення",
        "Multiplicação",
        "Isku-dhufasho",
        "Çarpma",
        "ضرب",
      ),
    },

    // 6 — highlight "Mêmes signes → positif"
    {
      text: S(
        "Mêmes signes → positif",
        "Same signs → positive",
        "إشارات متماثلة → موجب",
        "علامت‌های یکسان → مثبت",
        "ሓደ ዓይነት ምልክታት → ኣዎንታዊ",
        "Однакові знаки → додатний",
        "Sinais iguais → positivo",
        "Calaamado isku mid ah → togan",
        "Aynı işaretler → pozitif",
        "يو شان نښې → مثبت",
      ),
    },

    // 7 — section labelFr:"", items with "(positif × positif)" / "(négatif × négatif)" text
    {
      label: S("", "", "", "", "", "", "", "", "", ""),
      items: A(
        [
          "(+6) × (+3) = +18   (positif × positif)",
          "(−6) × (−3) = +18   (négatif × négatif)",
        ],
        [
          "(+6) × (+3) = +18   (positive × positive)",
          "(−6) × (−3) = +18   (negative × negative)",
        ],
        [
          "(+6) × (+3) = +18   (موجب × موجب)",
          "(−6) × (−3) = +18   (سالب × سالب)",
        ],
        [
          "(+6) × (+3) = +18   (مثبت × مثبت)",
          "(−6) × (−3) = +18   (منفی × منفی)",
        ],
        [
          "(+6) × (+3) = +18   (ኣዎንታዊ × ኣዎንታዊ)",
          "(−6) × (−3) = +18   (ኣሉታዊ × ኣሉታዊ)",
        ],
        [
          "(+6) × (+3) = +18   (додатне × додатне)",
          "(−6) × (−3) = +18   (від'ємне × від'ємне)",
        ],
        [
          "(+6) × (+3) = +18   (positivo × positivo)",
          "(−6) × (−3) = +18   (negativo × negativo)",
        ],
        [
          "(+6) × (+3) = +18   (togan × togan)",
          "(−6) × (−3) = +18   (taban × taban)",
        ],
        [
          "(+6) × (+3) = +18   (pozitif × pozitif)",
          "(−6) × (−3) = +18   (negatif × negatif)",
        ],
        [
          "(+6) × (+3) = +18   (مثبت × مثبت)",
          "(−6) × (−3) = +18   (منفي × منفي)",
        ],
      ),
    },

    // 8 — highlight "Signes contraires → négatif"
    {
      text: S(
        "Signes contraires → négatif",
        "Opposite signs → negative",
        "إشارات مختلفة → سالب",
        "علامت‌های مخالف → منفی",
        "ተጻራሪ ምልክታት → ኣሉታዊ",
        "Різні знаки → від'ємний",
        "Sinais contrários → negativo",
        "Calaamado kala duwan → taban",
        "Zıt işaretler → negatif",
        "مخالفې نښې → منفي",
      ),
    },

    // 9 — section labelFr:"", items pure math — no translation needed
    {},

    // 10 — heading "Division" black:true
    {
      text: S(
        "Division",
        "Division",
        "القسمة",
        "تقسیم",
        "ምክፋል",
        "Ділення",
        "Divisão",
        "Qaybin",
        "Bölme",
        "وېش",
      ),
    },

    // 11 — highlight "Mêmes signes → positif"
    {
      text: S(
        "Mêmes signes → positif",
        "Same signs → positive",
        "إشارات متماثلة → موجب",
        "علامت‌های یکسان → مثبت",
        "ሓደ ዓይነት ምልክታት → ኣዎንታዊ",
        "Однакові знаки → додатний",
        "Sinais iguais → positivo",
        "Calaamado isku mid ah → togan",
        "Aynı işaretler → pozitif",
        "يو شان نښې → مثبت",
      ),
    },

    // 12 — section labelFr:"", items pure math — no translation needed
    {},

    // 13 — highlight "Signes contraires → négatif"
    {
      text: S(
        "Signes contraires → négatif",
        "Opposite signs → negative",
        "إشارات مختلفة → سالب",
        "علامت‌های مخالف → منفی",
        "ተጻራሪ ምልክታት → ኣሉታዊ",
        "Різні знаки → від'ємний",
        "Sinais contrários → negativo",
        "Calaamado kala duwan → taban",
        "Zıt işaretler → negatif",
        "مخالفې نښې → منفي",
      ),
    },

    // 14 — section labelFr:"", items pure math — no translation needed
    {},
  ],
};
