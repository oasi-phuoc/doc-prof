import type { SubmoduleTrad } from "./trad-types";

const S = (fr: string, en: string, ar: string, fa: string, ti: string, uk: string) =>
  ({ fr, en, ar, fa, ti, uk });

export const TRAD_G7_2: SubmoduleTrad = {
  submoduleId: "G7-2",
  title: S(
    "Symétrie axiale",
    "Axial symmetry",
    "التماثل المحوري",
    "تقارن محوری",
    "ናይ ዘንጊ ምትእስሳር",
    "Осьова симетрія",
  ),
  blocks: [
    { text: S("Axes de symétrie", "Axes of symmetry", "محاور التماثل", "محورهای تقارن", "ናይ ምትእስሳር ዘንጊታት", "Осі симетрії") },
    { text: S(
      "Un axe de symétrie est une droite qui agit comme un miroir : chaque point a son correspondant de l'autre côté, à égale distance de l'axe.",
      "An axis of symmetry acts like a mirror: each point has a matching point on the other side, at equal distance from the axis.",
      "محور التماثل خط يعمل كمرآة: لكل نقطة نظيرها على الجانب الآخر بنفس المسافة.",
      "محور تقارن مانند آینه است: هر نقطه قرینه خود را در فاصله برابر دارد.",
      "ናይ ምትእስሳር ዘንጊ ከም መስትያት ዝሰርሕ ሕርሚ እዩ።",
      "Вісь симетрії діє як дзеркало: кожна точка має відповідник на однаковій відстані.",
    ) },
    { text: S("Repérer les axes", "Find the axes", "تحديد المحاور", "یافتن محورها", "ዘንጊታት ምርካብ", "Знайти осі") },
    { label: S("", "", "", "", "", ""), items: {
      fr: ["Plier la figure le long d'une droite : les deux moitiés se superposent.", "Une figure peut avoir plusieurs axes, un seul, ou aucun."],
      en: ["Fold along a line: both halves overlap.", "A figure may have several axes, one, or none."],
      ar: ["اطوِ الشكل على خط: النصفان ينطبقان.", "قد يكون للشكل عدة محاور أو واحد أو لا شيء."],
      fa: ["شکل را روی یک خط تا کنید: دو نیمه روی هم می‌افتند.", "یک شکل ممکن است چند محور، یکی، یا هیچ داشته باشد."],
      ti: ["ኣብ ሓደ ሕርሚ ጠውዮ: ክልቲኡ ፍርቂ ይተኣሳሰር።", "ሓደ ስእሊ ብዙሕ ዘንጊ፣ ሓደ፣ ወይ ዘይብሉ ክኸውን ይኽእል።"],
      uk: ["Зігніть уздовж прямої: половини збігаються.", "Фігура може мати кілька осей, одну або жодної."],
    } },
  ],
  paragraphs: {
    fr: ["Un axe de symétrie agit comme un miroir. Sur le quadrillage, tracez les axes ou complétez par symétrie."],
    en: ["An axis of symmetry acts like a mirror. On the grid, draw axes or complete by reflection."],
  },
  consignes: {
    g7SymmetryAxes: S(
      "Tracez tous les axes de symétrie de la figure.",
      "Draw all axes of symmetry of the figure.",
      "ارسم كل محاور تماثل الشكل.",
      "همه محورهای تقارن شکل را بکشید.",
      "ኩሎም ናይ ምትእስሳር ዘንጊታት ናይቲ ስእሊ ስኣል።",
      "Накресліть усі осі симетрії фігури.",
    ),
    g7SymmetryReflect: S(
      "Complétez la figure par symétrie par rapport à l'axe bleu.",
      "Complete the figure by reflection across the blue axis.",
      "أكمل الشكل بالتماثل بالنسبة للمحور الأزرق.",
      "شکل را نسبت به محور آبی با تقارن کامل کنید.",
      "ነቲ ስእሊ ብናይ ሰማያዊ ዘንጊ ምትእስሳር ምልእ።",
      "Доповніть фігуру симетрією відносно синьої осі.",
    ),
  },
};
