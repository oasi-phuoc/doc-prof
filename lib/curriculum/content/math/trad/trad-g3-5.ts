import type { SubmoduleTrad } from "./trad-types";

const S = (fr: string, en: string, ar: string, fa: string, ti: string, uk: string, pt: string, so: string, tr: string, ps: string) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

const A = (fr: string[], en: string[], ar: string[], fa: string[], ti: string[], uk: string[], pt: string[], so: string[], tr: string[], ps: string[]) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

export const TRAD_G3_5: SubmoduleTrad = {
  submoduleId: "G3-5",
  title: {
    fr: "Cercle et π",
    en: "Circle and π",
    ar: "الدائرة وπ",
    fa: "دایره و π",
    ti: "ዓውዲ ን π",
    uk: "Коло та π",
  },
  blocks: [
    // 0 — heading "Circonférence du cercle" (black)
    { text: S(
      "Circonférence du cercle",
      "Circumference of a circle",
      "محيط الدائرة",
      "محیط دایره",
      "ናይ ዓውዲ ዙሪያ",
      "Довжина кола",
      "Circunferência do círculo",
      "Wareegga goobaabiga",
      "Çemberin çevresi",
      "د دایرې محیط"
    ) },

    // 1 — plain "La **circonférence**..."
    { text: S(
      "La **circonférence** (périmètre du cercle) dépend du rayon r ou du diamètre d.",
      "The **circumference** (perimeter of a circle) depends on the radius r or the diameter d.",
      "**المحيط** (محيط الدائرة) يعتمد على نصف القطر r أو القطر d.",
      "**محیط** (محیط دایره) به شعاع r یا قطر d بستگی دارد.",
      "**ዙሪያ** (ናይ ዓውዲ ዙሪያ) ብናይ ፍርቂ-ቁምብዛ r ወይ ቁምብዛ d ዝዝከር ዩ።",
      "**Довжина кола** (периметр кола) залежить від радіуса r або діаметра d.",
      "A **circunferência** (perímetro do círculo) depende do raio r ou do diâmetro d.",
      "**Wareegga** (xadka goobaabiga) wuxuu ku xidnaan yahay raadiyaha r ama daayamitarka d.",
      "**Çevre** (çemberin çevresi) yarıçap r veya çap d'ye bağlıdır.",
      "**محیط** (د دایرې محیط) د نیم قطر r یا قطر d پورې اړه لري."
    ) },

    // 2 — rule "Formule" itemsFr ["C = 2 × π × r", "C = π × d", "(d = 2r)"]
    { label: S(
      "Formule",
      "Formula",
      "الصيغة",
      "فرمول",
      "ቅጥዒ",
      "Формула",
      "Fórmula",
      "Qaacidada",
      "Formül",
      "فورمول"
    ), items: A(
      ["C = 2 × π × r", "C = π × d", "(d = 2r)"],
      ["C = 2 × π × r", "C = π × d", "(d = 2r)"],
      ["C = 2 × π × r", "C = π × d", "(d = 2r)"],
      ["C = 2 × π × r", "C = π × d", "(d = 2r)"],
      ["C = 2 × π × r", "C = π × d", "(d = 2r)"],
      ["C = 2 × π × r", "C = π × d", "(d = 2r)"],
      ["C = 2 × π × r", "C = π × d", "(d = 2r)"],
      ["C = 2 × π × r", "C = π × d", "(d = 2r)"],
      ["C = 2 × π × r", "C = π × d", "(d = 2r)"],
      ["C = 2 × π × r", "C = π × d", "(d = 2r)"]
    ) },

    // 3 — heading "π (pi)" (black)
    { text: S(
      "π (pi)",
      "π (pi)",
      "π (باي)",
      "π (پی)",
      "π (ፒ)",
      "π (пі)",
      "π (pi)",
      "π (baay)",
      "π (pi)",
      "π (پای)"
    ) },

    // 4 — plain "π est un nombre irrationnel..."
    { text: S(
      "π est un nombre irrationnel. On utilise l'approximation **π ≈ 3,14**.",
      "π is an irrational number. We use the approximation **π ≈ 3.14**.",
      "π عدد غير نسبي. نستخدم التقريب **π ≈ 3,14**.",
      "π یک عدد گنگ است. از تقریب **π ≈ 3,14** استفاده می‌کنیم.",
      "π ዘይስሩዕ ቁጽሪ ዩ። **π ≈ 3,14** ዝብል ሕሳብ ኣተሓሕዛ ንጥቀም።",
      "π — ірраціональне число. Використовуємо наближення **π ≈ 3,14**.",
      "π é um número irracional. Usamos a aproximação **π ≈ 3,14**.",
      "π waa nambar aan macquul ahayn. Waxaan isticmaalnaa qiyaasta **π ≈ 3,14**.",
      "π irrasyonel bir sayıdır. **π ≈ 3,14** yaklaşımını kullanırız.",
      "π یو غیر مالوم عدد دی. موږ **π ≈ 3,14** اټکل کاروو."
    ) },

    // 5 — svg captionFr "Circonférence C = 2πr (contour du cercle)"
    { caption: S(
      "Circonférence C = 2πr (contour du cercle)",
      "Circumference C = 2πr (outline of the circle)",
      "محيط الدائرة C = 2πr (خط الدائرة)",
      "محیط دایره C = 2πr (خط دور دایره)",
      "ናይ ዓውዲ ዙሪያ C = 2πr (ሓቆፋ ናይ ዓውዲ)",
      "Довжина кола C = 2πr (контур кола)",
      "Circunferência C = 2πr (contorno do círculo)",
      "Wareegga C = 2πr (xadka goobaabiga)",
      "Çevre C = 2πr (çemberin dış hattı)",
      "د دایرې محیط C = 2πr (د دایرې بهرنی خط)"
    ) },

    // 6 — highlight "Exemple"
    { text: S(
      "Exemple",
      "Example",
      "مثال",
      "مثال",
      "ምሳሌ",
      "Приклад",
      "Exemplo",
      "Tusaale",
      "Örnek",
      "بېلګه"
    ) },

    // 7 — section labelFr "" itemsFr ["Cercle de rayon 5 cm :", "C = 2 × 3,14 × 5 = **31,4 cm**"]
    { label: S("", "", "", "", "", "", "", "", "", ""),
      items: A(
        ["Cercle de rayon 5 cm :", "C = 2 × 3,14 × 5 = **31,4 cm**"],
        ["Circle with radius 5 cm:", "C = 2 × 3.14 × 5 = **31.4 cm**"],
        ["دائرة نصف قطرها 5 سم:", "C = 2 × 3,14 × 5 = **31,4 سم**"],
        ["دایره با شعاع 5 سانتیمتر:", "C = 2 × 3,14 × 5 = **31,4 سانتیمتر**"],
        ["ዓውዲ ናይ 5 ሰም ፍርቂ-ቁምብዛ:", "C = 2 × 3,14 × 5 = **31,4 ሰም**"],
        ["Коло з радіусом 5 см:", "C = 2 × 3,14 × 5 = **31,4 см**"],
        ["Círculo de raio 5 cm:", "C = 2 × 3,14 × 5 = **31,4 cm**"],
        ["Goobaabig raadiyaha 5 cm:", "C = 2 × 3,14 × 5 = **31,4 cm**"],
        ["Yarıçapı 5 cm olan çember:", "C = 2 × 3,14 × 5 = **31,4 cm**"],
        ["د 5 سم نیم قطر لرونکۍ دایره:", "C = 2 × 3,14 × 5 = **31,4 سم**"]
      )
    },

    // 8 — highlight "À ne pas confondre"
    { text: S(
      "À ne pas confondre",
      "Do not confuse",
      "لا تخلط بين",
      "اشتباه نگیر",
      "ኣይቀላቐሉ",
      "Не плутати",
      "Não confundir",
      "Ha xasilin",
      "Karıştırmayın",
      "ګډ مه کوئ"
    ) },

    // 9 — section labelFr "" itemsFr ["**Circonférence C** = ...", "**Aire du disque A** = ..."]
    { label: S("", "", "", "", "", "", "", "", "", ""),
      items: A(
        ["**Circonférence C** = longueur du contour (périmètre) → C = 2πr", "**Aire du disque A** = surface intérieure → A = πr² (vu en G3.6)"],
        ["**Circumference C** = length of the outline (perimeter) → C = 2πr", "**Disk area A** = interior surface → A = πr² (seen in G3.6)"],
        ["**محيط الدائرة C** = طول الخط المحيط → C = 2πr", "**مساحة القرص A** = السطح الداخلي → A = πr² (في G3.6)"],
        ["**محیط دایره C** = طول خط محیطی → C = 2πr", "**مساحت دیسک A** = سطح داخلی → A = πr² (در G3.6)"],
        ["**ዙሪያ C** = ርዝሓ ሓቆፋ → C = 2πr", "**ሰፊሓ ዲስኩ A** = ናይ ውሽጢ ሰፊሓ → A = πr² (ኣብ G3.6)"],
        ["**Довжина кола C** = довжина контуру → C = 2πr", "**Площа круга A** = внутрішня поверхня → A = πr² (у G3.6)"],
        ["**Circunferência C** = comprimento do contorno (perímetro) → C = 2πr", "**Área do disco A** = superfície interior → A = πr² (visto em G3.6)"],
        ["**Wareegga C** = dhererka xadka → C = 2πr", "**Aagga saxanka A** = dusha gudaha → A = πr² (G3.6)"],
        ["**Çevre C** = dış hattın uzunluğu (çevre) → C = 2πr", "**Disk alanı A** = iç yüzey → A = πr² (G3.6'da görülür)"],
        ["**محیط C** = د بهرني خط اوږدوالی → C = 2πr", "**د دیسک مساحت A** = دننه سطحه → A = πr² (G3.6 کې)"]
      )
    },
  ],
  paragraphs: {
    fr: [
          "La circonférence (périmètre) d'un cercle est C = 2πr = πd, où r est le rayon et d le diamètre.",
          "π (pi) est un nombre irrationnel ≈ 3,14159… On utilise souvent π ≈ 3,14 ou la touche π de la calculatrice.",
          "Exemple : cercle de rayon 5 cm → C = 2 × π × 5 = 10π ≈ 31,4 cm.",
          "Attention : ne pas confondre circonférence (périmètre du cercle) et aire du disque (A = πr²).",
        ],
    en: [
          "Circumference of a circle: C = 2πr = πd.",
          "π ≈ 3.14159…, often approximated as 3.14.",
          "Example: radius 5 cm → C = 10π ≈ 31.4 cm.",
          "Do not confuse circumference (perimeter) with disk area (A = πr²).",
        ],
    ar: [
          "محيط الدائرة: C = 2πr = πd.",
          "π ≈ 3,14159…",
          "مثال: نصف قطر 5 سم → C ≈ 31,4 سم.",
          "لا تخلط بين المحيط والمساحة (A = πr²).",
        ],
    fa: [
          "محیط دایره: C = 2πr = πd.",
          "π ≈ 3.14159…",
          "مثال: شعاع 5 سانتیمتر → C ≈ 31.4 سانتیمتر.",
          "محیط را با مساحت (A = πr²) اشتباه نگیر.",
        ],
    ti: [
          "ናይ ዓውዲ ዙሪያ: C = 2πr = πd.",
          "π ≈ 3.14.",
          "ምሳሌ: ናይ ፍርቂ-ቁምብዛ 5 ሰም → C ≈ 31.4 ሰም.",
          "ዙሪያ ምስ ሰፊሓ (A = πr²) ኣይቀላቐሉ.",
        ],
    uk: [
          "Довжина кола: C = 2πr = πd.",
          "π ≈ 3,14159…",
          "Приклад: радіус 5 см → C ≈ 31,4 см.",
          "Не плутати довжину кола (периметр) з площею круга (A = πr²).",
        ],
  },
  consignes: {
    "g2-5-e1": { fr: "Calcule la circonférence d'un cercle de rayon 10 cm (π ≈ 3,14).", en: "Calcule la circonference d'un cercle de rayon 10 cm (π ≈ 3.14).",
      ar: "احسب محيط دائرة نصف قطرها 10 سم (π ≈ 3,14).",
      fa: "محیط دایره‌ای با شعاع ۱۰ سانتی‌متر را حساب کنید (π ≈ 3,14).",
      pt: "Calcula a circunferência de um círculo com raio 10 cm (π ≈ 3,14).",
      so: "Xisaabi goobaaha goobta leh raad 10 cm (π ≈ 3,14).",
      ti: "10 ሰ.ሜ ራዲዩስ ዘለዎ ዙሪያ ሓቝፋ ሒሳብ ግበር (π ≈ 3,14)።",
      tr: "Yarıçapı 10 cm olan bir çemberin çevresini hesaplayın (π ≈ 3,14).",
      ps: "د 10 سم شعاع لرونکي دایرې محیط حساب کړئ (π ≈ 3,14).",
      uk: "Обчисліть довжину кола з радіусом 10 см (π ≈ 3,14)." },
    "g2-5-e2": { fr: "Calcule la circonférence d'un cercle de diamètre 6 cm (π ≈ 3,14).", en: "Calcule la circonference d'un cercle de diametre 6 cm (π ≈ 3.14).",
      ar: "احسب محيط دائرة قطرها 6 سم (π ≈ 3,14).",
      fa: "محیط دایره‌ای با قطر ۶ سانتی‌متر را حساب کنید (π ≈ 3,14).",
      pt: "Calcula a circunferência de um círculo com diâmetro 6 cm (π ≈ 3,14).",
      so: "Xisaabi goobaaha goobta leh qalabka 6 cm (π ≈ 3,14).",
      ti: "6 ሰ.ሜ ዲያሜትር ዘለዎ ዙሪያ ሓቝፋ ሒሳብ ግበር (π ≈ 3,14)።",
      tr: "Çapı 6 cm olan bir çemberin çevresini hesaplayın (π ≈ 3,14).",
      ps: "د 6 سم قطر لرونکي دایرې محیط حساب کړئ (π ≈ 3,14).",
      uk: "Обчисліть довжину кола з діаметром 6 см (π ≈ 3,14)." },
    "g2-5-e3": { fr: "Un cercle a une circonférence de 31,4 cm. Quel est son rayon (π ≈ 3,14) ?", en: "Un cercle a une circonference de 31.4 cm. Quel est son rayon (π ≈ 3.14) ?",
      ar: "دائرة محيطها 31,4 سم. ما نصف قطرها (π ≈ 3,14)؟",
      fa: "دایره‌ای با محیط ۳۱٫۴ سانتی‌متر. شعاعش چقدر است (π ≈ 3,14)؟",
      pt: "Um círculo tem uma circunferência de 31,4 cm. Qual é o seu raio (π ≈ 3,14)?",
      so: "Goobo leh goobaah 31,4 cm. Raadkeedu waa maxay (π ≈ 3,14)?",
      ti: "31,4 ሰ.ሜ ሓቝፋ ዘለዎ ዙሪያ። ራዲዩሱ ምንታይ (π ≈ 3,14)?",
      tr: "Bir çemberin çevresi 31,4 cm. Yarıçapı nedir (π ≈ 3,14)?",
      ps: "یوه دایره د 31,4 سم محیط لري. د هغې شعاع (π ≈ 3,14) کچه دی؟",
      uk: "Коло має довжину 31,4 см. Який його радіус (π ≈ 3,14)?" },
    "g2-5-e4": { fr: "π est approximativement égal à ?", en: "? is approximately equal to?",
      ar: "π يساوي تقريبًا ؟",
      fa: "π تقریباً برابر چیست؟",
      pt: "π é aproximadamente igual a?",
      so: "π waxay siman tahay qiyaastaan?",
      ti: "π ናብ ምንታይ ይቐርብ?",
      tr: "π yaklaşık olarak neye eşittir?",
      ps: "π نږدې د کچه مساوي دی؟",
      uk: "π приблизно дорівнює?" },
    "g2-5-e5": { fr: "Un cercle de rayon 3 cm : C = 2π × 3 ≈ ? (arrondi à l'unité, π ≈ 3,14)", en: "Un cercle de rayon 3 cm : C = 2π × 3 ≈ ? (arrondi a l'unite, π ≈ 3.14)",
      ar: "دائرة نصف قطرها 3 سم: C = 2π × 3 ≈ ؟ (مقرّبًا إلى وحدة، π ≈ 3,14)",
      fa: "دایره‌ای با شعاع ۳ سانتی‌متر: C = 2π × 3 ≈ ؟ (گرد‌شده به یکان، π ≈ 3,14)",
      pt: "Um círculo com raio 3 cm: C = 2π × 3 ≈ ? (arredondado à unidade, π ≈ 3,14)",
      so: "Goobo leh raad 3 cm: C = 2π × 3 ≈ ? (wareejin halbeeg, π ≈ 3,14)",
      ti: "3 ሰ.ሜ ራዲዩስ ዘለዎ ዙሪያ፡ C = 2π × 3 ≈ ? (ናብ ሓደት ኣቕሪቡ, π ≈ 3,14)",
      tr: "Yarıçapı 3 cm olan çember: C = 2π × 3 ≈ ? (tam sayıya yuvarla, π ≈ 3,14)",
      ps: "د 3 سم شعاع لرونکي دایره: C = 2π × 3 ≈ ؟ (یوګان ته ګرد، π ≈ 3,14)",
      uk: "Коло з радіусом 3 см: C = 2π × 3 ≈ ? (заокруглити до одиниць, π ≈ 3,14)" },
  },
};
