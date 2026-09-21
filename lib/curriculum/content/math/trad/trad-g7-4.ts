import type { SubmoduleTrad } from "./trad-types";

const S = (fr: string, en: string, ar: string, fa: string, ti: string, uk: string) =>
  ({ fr, en, ar, fa, ti, uk });

export const TRAD_G7_4: SubmoduleTrad = {
  submoduleId: "G7-4",
  title: S(
    "Translation",
    "Translation",
    "الانسحاب",
    "انتقال",
    "ምስጋር",
    "Паралельне перенесення",
  ),
  blocks: [
    { text: S("Déplacer sans tourner", "Move without turning", "التحريك دون دوران", "جابه‌جایی بدون چرخش", "ብዘይ ምምቕቃሉ ምንቅስቓስ", "Перемістити без повороту") },
    { text: S(
      "Une translation déplace toute la figure dans une direction et d'une distance fixées, sans rotation ni réflexion.",
      "A translation moves the whole figure in a fixed direction and distance, without rotation or reflection.",
      "الانسحاب يحرّك الشكل كله في اتجاه ومسافة ثابتين دون دوران أو انعكاس.",
      "انتقال کل شکل را در جهت و فاصله ثابت جابه‌جا می‌کند، بدون چرخش یا بازتاب.",
      "ምስጋር ንምሉእ ስእሊ ኣብ ሓደ ኣንፈትን ርሕቀትን የንቀሳቕስ፣ ብዘይ ምምቕቃሉ ወይ ምንጽባር።",
      "Паралельне перенесення зсуває всю фігуру на фіксовану відстань у заданому напрямку.",
    ) },
    { text: S("Vecteur de translation", "Translation vector", "متجه الانسحاب", "بردار انتقال", "ናይ ምስጋር ቬክተር", "Вектор перенесення") },
    { label: S("", "", "", "", "", ""), items: {
      fr: ["Définie par →v = (a ; b).", "M(x ; y) → M'(x+a ; y+b)."],
      en: ["Defined by →v = (a ; b).", "M(x ; y) → M'(x+a ; y+b)."],
      ar: ["تُعرَّف بـ →v = (a ؛ b).", "M(x ؛ y) → M'(x+a ؛ y+b)."],
      fa: ["با →v = (a ؛ b) تعریف می‌شود.", "M(x ؛ y) → M'(x+a ؛ y+b)."],
      ti: ["ብ→v = (a ; b) ይግለጽ።", "M(x ; y) → M'(x+a ; y+b)."],
      uk: ["Задається →v = (a ; b).", "M(x ; y) → M'(x+a ; y+b)."],
    } },
  ],
  paragraphs: {
    fr: ["Une translation déplace la figure selon un vecteur, sans changer la taille ni l'orientation."],
    en: ["A translation moves the figure by a vector, without changing size or orientation."],
  },
  consignes: {
    "g7-4-e1": S("Translation de vecteur (2 ; 3). Point (1 ; 1) → ?", "Translation by (2 ; 3). Point (1 ; 1) → ?", "انسحاب بالمتجه (2 ؛ 3). النقطة (1 ؛ 1) → ؟", "انتقال با بردار (۲ ؛ ۳). نقطه (۱ ؛ ۱) → ؟", "ብቬክተር (2 ; 3) ምስጋር። ነጥቢ (1 ; 1) → ?", "Перенесення на (2 ; 3). Точка (1 ; 1) → ?"),
    "g7-4-e2": S("Translation (−1 ; 4). Point (5 ; 2) → x = ?", "Translation (−1 ; 4). Point (5 ; 2) → x = ?", "انسحاب (−1 ؛ 4). النقطة (5 ؛ 2) → x = ؟", "انتقال (−۱ ؛ ۴). نقطه (۵ ؛ ۲) → x = ؟", "ምስጋር (−1 ; 4). ነጥቢ (5 ; 2) → x = ?", "Перенесення (−1 ; 4). Точка (5 ; 2) → x = ?"),
    "g7-4-e3": S("La translation conserve-t-elle les distances ? (oui/non)", "Does translation preserve distances? (yes/no)", "هل يحفظ الانسحاب المسافات؟ (نعم/لا)", "آیا انتقال فاصله‌ها را حفظ می‌کند؟ (بله/خیر)", "ምስጋር ንርሕቀታት ይሕልዮ ድዩ? (እወ/ኣይፋል)", "Чи зберігає перенесення відстані? (так/ні)"),
    "g7-4-e4": S("Translation (0 ; 5). Le point (3 ; 2) devient (3 ; ?)", "Translation (0 ; 5). Point (3 ; 2) becomes (3 ; ?)", "انسحاب (0 ؛ 5). النقطة (3 ؛ 2) تصبح (3 ؛ ؟)", "انتقال (۰ ؛ ۵). نقطه (۳ ؛ ۲) می‌شود (۳ ؛ ؟)", "ምስጋር (0 ; 5). ነጥቢ (3 ; 2) ናብ (3 ; ?) ይኸውን", "Перенесення (0 ; 5). Точка (3 ; 2) стає (3 ; ?)"),
    "g7-4-e5": S("Après une translation, la figure est-elle de même taille ? (oui/non)", "After a translation, is the figure the same size? (yes/no)", "بعد الانسحاب، هل الشكل بنفس الحجم؟ (نعم/لا)", "پس از انتقال، شکل همان اندازه است؟ (بله/خیر)", "ድሕሪ ምስጋር፣ ስእሊ ተመሳሳሊ ዓቐን ድዩ? (እወ/ኣይፋል)", "Після перенесення фігура того ж розміру? (так/ні)"),
  },
};
