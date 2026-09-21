import type { SubmoduleTrad } from "./trad-types";

const S = (fr: string, en: string, ar: string, fa: string, ti: string, uk: string) =>
  ({ fr, en, ar, fa, ti, uk });

export const TRAD_G7_3: SubmoduleTrad = {
  submoduleId: "G7-3",
  title: S(
    "Symétrie centrale",
    "Central symmetry",
    "التماثل المركزي",
    "تقارن مرکزی",
    "ማእከላይ ምትእስሳር",
    "Центральна симетрія",
  ),
  blocks: [
    { text: S("Centre de symétrie", "Center of symmetry", "مركز التماثل", "مرکز تقارن", "ናይ ምትእስሳር ማእከል", "Центр симетрії") },
    { text: S(
      "La symétrie centrale de centre O associe à chaque point M son image M' telle que O est le milieu de [MM']. C'est une rotation de 180° autour de O.",
      "Central symmetry with center O maps each point M to M' so that O is the midpoint of [MM']. It is a 180° rotation about O.",
      "التماثل المركزي ذو المركز O يربط كل نقطة M بصورتها M' بحيث يكون O منتصف [MM']. وهو دوران 180° حول O.",
      "تقارن مرکزی با مرکز O هر نقطه M را به M' می‌برد طوری که O وسط [MM'] است. این چرخش ۱۸۰° حول O است.",
      "ማእከላይ ምትእስሳር ናይ O ማእከል ነፍሲ ወከፍ M ናብ M' የሰጋግር፣ O ማእከል ናይ [MM'] እዩ። 180° ምምቕቃሉ እዩ።",
      "Центральна симетрія з центром O відображає M у M' так, що O — середина [MM']. Це поворот на 180° навколо O.",
    ) },
    { text: S("Propriétés", "Properties", "الخصائص", "ویژگی‌ها", "ንብረታት", "Властивості") },
    { label: S("", "", "", "", "", ""), items: {
      fr: ["Conservation des distances, des angles et des aires.", "O est le milieu de chaque [MM']."],
      en: ["Distances, angles and areas are preserved.", "O is the midpoint of each [MM']."],
      ar: ["حفظ المسافات والزوايا والمساحات.", "O منتصف كل [MM']."],
      fa: ["فاصله‌ها، زوایا و مساحت‌ها حفظ می‌شوند.", "O وسط هر [MM'] است."],
      ti: ["ርሕቀት፣ ኩርናዓትን ሰፊሓን ይሕለዉ።", "O ማእከል ናይ ነፍሲ ወከፍ [MM'] እዩ።"],
      uk: ["Зберігаються відстані, кути й площі.", "O — середина кожного [MM']."],
    } },
  ],
  paragraphs: {
    fr: ["Symétrie centrale = rotation de 180° autour du centre O."],
    en: ["Central symmetry = 180° rotation about center O."],
  },
  consignes: {
    g7Central: S(
      "Complétez la figure par symétrie centrale autour du point bleu O.",
      "Complete the figure by central symmetry about the blue point O.",
      "أكمل الشكل بالتماثل المركزي حول النقطة الزرقاء O.",
      "شکل را با تقارن مرکزی حول نقطه آبی O کامل کنید.",
      "ነቲ ስእሊ ብማእከላይ ምትእስሳር ኣብ ዙርያ ሰማያዊ ነጥቢ O ምልእ።",
      "Доповніть фігуру центральною симетрією відносно синьої точки O.",
    ),
  },
};
