import type { SubmoduleTrad } from "./trad-types";

const S = (fr: string, en: string, ar: string, fa: string, ti: string, uk: string) =>
  ({ fr, en, ar, fa, ti, uk });

export const TRAD_G7_1: SubmoduleTrad = {
  submoduleId: "G7-1",
  title: S(
    "Reproduction de figures",
    "Reproducing figures",
    "إعادة رسم الأشكال",
    "بازتولید شکل‌ها",
    "ምድጋም ስእልታት",
    "Відтворення фігур",
  ),
  blocks: [
    { text: S("Reproduire sur un quadrillage", "Reproducing on a grid", "إعادة الرسم على شبكة", "بازتولید روی شبکه", "ኣብ ካርታ ምድጋም", "Відтворення на сітці") },
    { text: S(
      "Sur un quadrillage, une figure est formée de segments droits et parfois de points marqués aux intersections.",
      "On a grid, a figure is made of straight segments and sometimes dots at intersections.",
      "على الشبكة، يتكوّن الشكل من قطع مستقيمة وأحيانًا نقاط عند التقاطعات.",
      "روی شبکه، شکل از پاره‌خط‌ها و گاهی نقاط در تقاطع‌ها ساخته می‌شود.",
      "ኣብ ካርታ፣ ስእሊ ካብ ቀጥታዊ መስመራትን ነጥብታትን ዝቖመ ዩ።",
      "На сітці фігура складається з відрізків і іноді точок на перетинах.",
    ) },
    { text: S("Reproduire à l'identique", "Copy exactly", "النسخ بنفس الحجم", "کپی دقیق", "ብተመሳሳሊ ምድጋም", "Точне копіювання") },
    { label: S("", "", "", "", "", ""), items: {
      fr: ["Observer la figure modèle.", "Compter les cases pour placer chaque segment.", "Vérifier la même taille et la même orientation."],
      en: ["Observe the model figure.", "Count squares to place each segment.", "Check the same size and orientation."],
      ar: ["لاحظ الشكل النموذجي.", "عدّ المربعات لوضع كل قطعة.", "تحقق من نفس الحجم والاتجاه."],
      fa: ["شکل مدل را ببینید.", "خانه‌ها را بشمارید تا هر پاره‌خط را بگذارید.", "همان اندازه و جهت را بررسی کنید."],
      ti: ["ነቲ ሞዴል ስእሊ ተዓዘብ።", "ነፍሲ ወከፍ መስመር ንምቕማጥ ካርታታት ቁጸር።", "ተመሳሳሊ ዓቐንን ኣንፈትን ኣረጋግጽ።"],
      uk: ["Спостерігайте модель.", "Рахуйте клітинки для кожного відрізка.", "Перевірте розмір і орієнтацію."],
    } },
    { text: S("Agrandir ou réduire", "Enlarge or reduce", "التكبير أو التصغير", "بزرگ‌نمایی یا کوچک‌نمایی", "ምዕባይ ወይ ምንኣስ", "Збільшити або зменшити") },
    { label: S("", "", "", "", "", ""), items: {
      fr: ["Réduire ÷2 : modèle 10×10 → grille 5×5.", "Agrandir ×2 : modèle 5×5 → grille 10×10."],
      en: ["Reduce ÷2: 10×10 model → 5×5 grid.", "Enlarge ×2: 5×5 model → 10×10 grid."],
      ar: ["تصغير ÷2: نموذج 10×10 → شبكة 5×5.", "تكبير ×2: نموذج 5×5 → شبكة 10×10."],
      fa: ["کاهش ÷2: مدل ۱۰×۱۰ → شبکه ۵×۵.", "بزرگ‌نمایی ×۲: مدل ۵×۵ → شبکه ۱۰×۱۰."],
      ti: ["ምንኣስ ÷2: ሞዴል 10×10 → ካርታ 5×5.", "ምዕባይ ×2: ሞዴል 5×5 → ካርታ 10×10."],
      uk: ["Зменшити ÷2: модель 10×10 → сітка 5×5.", "Збільшити ×2: модель 5×5 → сітка 10×10."],
    } },
  ],
  paragraphs: {
    fr: ["Reproduire une figure sur un quadrillage : à l'identique, en agrandissant ou en réduisant."],
    en: ["Reproduce a figure on a grid: exactly, enlarged, or reduced."],
  },
  consignes: {
    g7Reproduce: S(
      "Reproduisez la figure sur le quadrillage.",
      "Reproduce the figure on the grid.",
      "أعد رسم الشكل على الشبكة.",
      "شکل را روی شبکه بازتولید کنید.",
      "ነቲ ስእሊ ኣብ ካርታ ድገም።",
      "Відтворіть фігуру на сітці.",
    ),
  },
};
