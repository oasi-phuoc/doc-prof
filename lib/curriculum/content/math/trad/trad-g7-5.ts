import type { SubmoduleTrad } from "./trad-types";

const S = (fr: string, en: string, ar: string, fa: string, ti: string, uk: string) =>
  ({ fr, en, ar, fa, ti, uk });

export const TRAD_G7_5: SubmoduleTrad = {
  submoduleId: "G7-5",
  title: S(
    "Rotation",
    "Rotation",
    "الدوران",
    "دوران",
    "ምምቕቃሉ",
    "Поворот",
  ),
  blocks: [
    { text: S("Tourner une figure", "Rotating a figure", "تدوير شكل", "چرخاندن شکل", "ስእሊ ምምቕቃሉ", "Поворот фігури") },
    { text: S(
      "Une rotation fait tourner chaque point autour d'un centre. Sur le quadrillage, le trait bleu indique le sens de la rotation.",
      "A rotation turns each point around a center. On the grid, the blue mark shows the rotation direction.",
      "الدوران يدور كل نقطة حول مركز. على الشبكة، العلامة الزرقاء تبين اتجاه الدوران.",
      "دوران هر نقطه را حول یک مرکز می‌چرخاند. روی شبکه، علامت آبی جهت چرخش را نشان می‌دهد.",
      "ምምቕቃሉ ነፍሲ ወከፍ ነጥቢ ኣብ ዙርያ ማእከል የምቕቅል። ሰማያዊ መስመር ኣንፈት የርኢ።",
      "Поворот обертає кожну точку навколо центра. Синя мітка на сітці показує напрям.",
    ) },
    { text: S("Le trait bleu", "The blue mark", "العلامة الزرقاء", "علامت آبی", "ሰማያዊ መስመር", "Синя мітка") },
    { label: S("", "", "", "", "", ""), items: {
      fr: ["Ex.1 : modèle à gauche → haut / droite / bas.", "Ex.2 : modèle à droite → haut / gauche / bas."],
      en: ["Ex.1: model on the left → top / right / bottom.", "Ex.2: model on the right → top / left / bottom."],
      ar: ["تمرين 1: النموذج يسار → أعلى / يمين / أسفل.", "تمرين 2: النموذج يمين → أعلى / يسار / أسفل."],
      fa: ["تمرین ۱: مدل چپ → بالا / راست / پایین.", "تمرین ۲: مدل راست → بالا / چپ / پایین."],
      ti: ["ስፈ.1፡ ሞዴል ጸጋም → ላዕሊ / የማን / ታሕቲ።", "ስፈ.2፡ ሞዴል የማን → ላዕሊ / ጸጋም / ታሕቲ።"],
      uk: ["Впр.1: модель зліва → верх / право / низ.", "Впр.2: модель справа → верх / ліво / низ."],
    } },
    { text: S("Propriétés", "Properties", "الخصائص", "ویژگی‌ها", "ንብረታት", "Властивості") },
    { label: S("", "", "", "", "", ""), items: {
      fr: ["Conservation des distances, angles et aires.", "Même taille ; seule l'orientation change."],
      en: ["Distances, angles and areas preserved.", "Same size; only orientation changes."],
      ar: ["حفظ المسافات والزوايا والمساحات.", "نفس الحجم؛ يتغير الاتجاه فقط."],
      fa: ["فاصله‌ها، زوایا و مساحت‌ها حفظ می‌شوند.", "همان اندازه؛ فقط جهت عوض می‌شود."],
      ti: ["ርሕቀት፣ ኩርናዓትን ሰፊሓን ይሕለዉ።", "ተመሳሳሊ ዓቐን፤ ኣንፈት ጥራይ ይቕየር።"],
      uk: ["Зберігаються відстані, кути й площі.", "Той самий розмір; змінюється лише орієнтація."],
    } },
  ],
  paragraphs: {
    fr: ["Rotation sur quadrillage : le trait bleu indique le sens (90°, 180° ou 270° horaire)."],
    en: ["Grid rotation: the blue mark shows the direction (90°, 180° or 270° clockwise)."],
  },
  consignes: {
    "g6-5-e1": { fr: "k = 3. Côté 4 cm → côté image = ?", en: "k = 3. Side 4 cm → image side = ?", ar: "k = 3. ضلع 4 سم → ضلع الصورة = ؟", fa: "k = ۳. ضلع ۴ cm → ضلع تصویر = ؟", ti: "k = 3. ጐኒ 4 cm → ናይ ምስሊ ጐኒ = ?", uk: "k = 3. Сторона 4 см → сторона образу = ?", pt: "k = 3. Lado 4 cm → lado da imagem = ?", so: "k = 3. Dhinac 4 cm → dhinaca sawirka = ?", tr: "k = 3. Kenar 4 cm → görüntü kenarı = ?", ps: "k = ۳. اړخ ۴ cm → د انځور اړخ = ؟" },
    "g6-5-e2": { fr: "k = 0,5. Côté 10 cm → côté image = ?", en: "k = 0.5. Side 10 cm → image side = ?", ar: "k = 0,5. ضلع 10 سم → ضلع الصورة = ؟", fa: "k = ۰٫۵. ضلع ۱۰ cm → ضلع تصویر = ؟", ti: "k = 0,5. ጐኒ 10 cm → ናይ ምስሊ ጐኒ = ?", uk: "k = 0,5. Сторона 10 см → сторона образу = ?", pt: "k = 0,5. Lado 10 cm → lado da imagem = ?", so: "k = 0,5. Dhinac 10 cm → dhinaca sawirka = ?", tr: "k = 0,5. Kenar 10 cm → görüntü kenarı = ?", ps: "k = ۰٫۵. اړخ ۱۰ cm → د انځور اړخ = ؟" },
    "g6-5-e3": { fr: "k = 2. Aire = 9 cm² → aire image = ?", en: "k = 2. Area = 9 cm² → image area = ?", ar: "k = 2. المساحة = 9 سم² → مساحة الصورة = ؟", fa: "k = ۲. مساحت = ۹ cm² → مساحت تصویر = ؟", ti: "k = 2. ስፍሓት = 9 cm² → ናይ ምስሊ ስፍሓት = ?", uk: "k = 2. Площа = 9 см² → площа образу = ?", pt: "k = 2. Área = 9 cm² → área da imagem = ?", so: "k = 2. Bed = 9 cm² → bedka sawirka = ?", tr: "k = 2. Alan = 9 cm² → görüntü alanı = ?", ps: "k = ۲. مساحت = ۹ cm² → د انځور مساحت = ؟" },
    "g6-5-e4": { fr: "Photocopie à 200%. k = ?", en: "Photocopy at 200%. k = ?", ar: "نسخ بنسبة 200%. k = ؟", fa: "فتوکپی با ۲۰۰٪. k = ؟", ti: "ብ 200% ኮፒ. k = ?", uk: "Фотокопія на 200%. k = ?", pt: "Fotocópia a 200%. k = ?", so: "Koobi 200%. k = ?", tr: "%200 fotokopi. k = ?", ps: "په ۲۰۰٪ کاپي. k = ؟" },
    "g6-5-e5": { fr: "k = 4. Les angles sont-ils conservés ? (oui/non)", en: "k = 4. Are angles preserved? (yes/no)", ar: "k = 4. هل تُحفظ الزوايا؟ (نعم/لا)", fa: "k = ۴. آیا زاویه‌ها حفظ می‌شوند؟ (بله/خیر)", ti: "k = 4. ኩርናዓት ይሕለዉ ድዮም? (እወ/ኣይኮንን)", uk: "k = 4. Чи зберігаються кути? (так/ні)", pt: "k = 4. Os ângulos são conservados? (sim/não)", so: "k = 4. Ma xagalasha ma la ilaaliyaa? (haa/maya)", tr: "k = 4. Açılar korunur mu? (evet/hayır)", ps: "k = ۴. ایا زاویې ساتل کیږي؟ (هو/نه)" },
  },
};
