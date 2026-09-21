import type { SubmoduleTrad } from "./trad-types";

const S = (fr: string, en: string, ar: string, fa: string, ti: string, uk: string, pt: string, so: string, tr: string, ps: string) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

const A = (fr: string[], en: string[], ar: string[], fa: string[], ti: string[], uk: string[], pt: string[], so: string[], tr: string[], ps: string[]) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

export const TRAD_A6_3: SubmoduleTrad = {
  submoduleId: "A6-3",
  title: S(
    "Augmentation et réduction",
    "Increase and decrease",
    "الزيادة والنقصان",
    "افزایش و کاهش",
    "ምውሳኽን ምንካስን",
    "Збільшення та зменшення",
    "Aumento e redução",
    "Kororka iyo hoos u dhaca",
    "Artış ve azalış",
    "زياتوالی او کموالی"
  ),
  blocks: [
    // Block 0: heading "Augmentation en pourcentage" (black)
    { text: S(
      "Augmentation en pourcentage",
      "Percentage increase",
      "الزيادة بنسبة مئوية",
      "افزایش درصدی",
      "ምውሳኽ ብሚእታዊ",
      "Збільшення у відсотках",
      "Aumento em percentagem",
      "Kororka boqolleyda",
      "Yüzde artış",
      "سلنیز زياتوالی"
    ) },
    // Block 1: plain
    { text: S(
      "Augmenter une valeur de **p%** signifie qu'on lui ajoute p% de sa propre valeur. On utilise un **coefficient multiplicateur** supérieur à 1 pour effectuer ce calcul en une seule étape.",
      "Increasing a value by **p%** means adding p% of its own value to it. A **multiplying coefficient** greater than 1 is used to perform this calculation in a single step.",
      "زيادة قيمة بـ **p%** تعني إضافة p% من قيمتها إليها. يُستخدم **معامل الضرب** الأكبر من 1 لإجراء هذه العملية في خطوة واحدة.",
      "افزایش یک مقدار به میزان **p%** یعنی اضافه کردن p% از مقدار خودش به آن. از یک **ضریب ضربی** بزرگ‌تر از 1 برای انجام این محاسبه در یک مرحله استفاده می‌شود.",
      "ምውሳኽ ዋጋ ብ **p%** ማለት p% ናይ ርእሱ ዋጋ ምውሳኽ ማለት እዩ። **ኮፊሸን ናይ ምብዛሕ** ካብ 1 ዝዓቢ ንምጥቃም ሓደ ስጉምቲ ጥራይ ይኸውን።",
      "Збільшити значення на **p%** означає додати до нього p% від його власної величини. Використовується **коефіцієнт множення** більший за 1, щоб виконати це обчислення за один крок.",
      "Aumentar um valor em **p%** significa adicionar-lhe p% do seu próprio valor. Usa-se um **coeficiente multiplicador** superior a 1 para efectuar este cálculo num único passo.",
      "Kororinta qiimaha **p%** waxay la macno tahay in lagu daro p% oo ka mid ah qiimihiisa. **Isugeynta tartan** ee ka weyn 1 ayaa loo adeegsadaa xisaabtankan hal tallaabo ah.",
      "Bir değeri **p%** artırmak, o değerin p%'sini kendisine eklemek anlamına gelir. Bu hesabı tek adımda yapmak için 1'den büyük bir **çarpım katsayısı** kullanılır.",
      "د يو ارزښت **p%** زياتوالی دا دى چې د خپل ارزښت p% ورزياته شي. دا محاسبه د يوې ګامې سره د 1 لوى **ضرب ضريب** پواسطه ترسره کيږي."
    ) },
    // Block 2: highlight "Formule — Augmentation"
    { text: S(
      "Formule — Augmentation",
      "Formula — Increase",
      "الصيغة — الزيادة",
      "فرمول — افزایش",
      "ቀመር — ምውሳኽ",
      "Формула — Збільшення",
      "Fórmula — Aumento",
      "Qaaciddo — Kororka",
      "Formül — Artış",
      "فورمول — زياتوالی"
    ) },
    // Block 3: section (no label) itemsFr
    { items: A(
      ["Nouvelle valeur = valeur initiale × (1 + p/100)", "Exemple : +20% sur 80 → 80 × 1,20 = 96"],
      ["New value = initial value × (1 + p/100)", "Example: +20% on 80 → 80 × 1.20 = 96"],
      ["القيمة الجديدة = القيمة الأولية × (1 + p/100)", "مثال: +20% على 80 → 80 × 1,20 = 96"],
      ["مقدار جدید = مقدار اولیه × (1 + p/100)", "مثال: +20% روی 80 → 80 × 1,20 = 96"],
      ["ሓድሽ ዋጋ = መጀምርታ ዋጋ × (1 + p/100)", "ኣብነት፦ +20% ኣብ 80 → 80 × 1,20 = 96"],
      ["Нове значення = початкове значення × (1 + p/100)", "Приклад: +20% від 80 → 80 × 1,20 = 96"],
      ["Novo valor = valor inicial × (1 + p/100)", "Exemplo: +20% sobre 80 → 80 × 1,20 = 96"],
      ["Qiimaha cusub = qiimaha bilowga × (1 + p/100)", "Tusaale: +20% oo ku saabsan 80 → 80 × 1,20 = 96"],
      ["Yeni değer = başlangıç değeri × (1 + p/100)", "Örnek: 80 üzerinde +20% → 80 × 1,20 = 96"],
      ["نوى ارزښت = پيلني ارزښت × (1 + p/100)", "بېلګه: +20% د 80 → 80 × 1,20 = 96"]
    ) },
    // Block 4: plain "" spacer
    {},
    // Block 5: table — headers only (rows are numbers/symbols)
    { headers: A(
      ["Augmentation", "Coefficient", "Exemple (base 100)"],
      ["Increase", "Coefficient", "Example (base 100)"],
      ["الزيادة", "المعامل", "مثال (الأساس 100)"],
      ["افزایش", "ضریب", "مثال (پایه 100)"],
      ["ምውሳኽ", "ኮፊሸን", "ኣብነት (መሰረት 100)"],
      ["Збільшення", "Коефіцієнт", "Приклад (база 100)"],
      ["Aumento", "Coeficiente", "Exemplo (base 100)"],
      ["Kororka", "Isugeynta", "Tusaale (aasaas 100)"],
      ["Artış", "Katsayı", "Örnek (taban 100)"],
      ["زياتوالی", "ضريب", "بېلګه (اساس 100)"]
    ) },
    // Block 6: plain "" spacer
    {},
    // Block 7: heading "Réduction en pourcentage" (black)
    { text: S(
      "Réduction en pourcentage",
      "Percentage decrease",
      "النقصان بنسبة مئوية",
      "کاهش درصدی",
      "ምንካስ ብሚእታዊ",
      "Зменшення у відсотках",
      "Redução em percentagem",
      "Hoos u dhaca boqolleyda",
      "Yüzde azalış",
      "سلنیز کموالی"
    ) },
    // Block 8: plain
    { text: S(
      "Réduire une valeur de **p%** signifie qu'on lui soustrait p% de sa propre valeur. On utilise un **coefficient multiplicateur** inférieur à 1 pour effectuer ce calcul en une seule étape.",
      "Reducing a value by **p%** means subtracting p% of its own value from it. A **multiplying coefficient** less than 1 is used to perform this calculation in a single step.",
      "تخفيض قيمة بـ **p%** يعني طرح p% من قيمتها منها. يُستخدم **معامل الضرب** الأصغر من 1 لإجراء هذه العملية في خطوة واحدة.",
      "کاهش یک مقدار به میزان **p%** یعنی کم کردن p% از مقدار خودش. از یک **ضریب ضربی** کوچک‌تر از 1 برای انجام این محاسبه در یک مرحله استفاده می‌شود.",
      "ምንካስ ዋጋ ብ **p%** ማለት p% ናይ ርእሱ ዋጋ ምቅናስ ማለት እዩ። **ኮፊሸን ናይ ምብዛሕ** ካብ 1 ዝነኣስ ንምጥቃም ሓደ ስጉምቲ ጥራይ ይኸውን።",
      "Зменшити значення на **p%** означає відняти від нього p% від його власної величини. Використовується **коефіцієнт множення** менший за 1, щоб виконати це обчислення за один крок.",
      "Reduzir um valor em **p%** significa subtrair-lhe p% do seu próprio valor. Usa-se um **coeficiente multiplicador** inferior a 1 para efectuar este cálculo num único passo.",
      "Hoos u dhigista qiimaha **p%** waxay la macno tahay in laga goosto p% oo ka mid ah qiimihiisa. **Isugeynta tartan** ee ka yar 1 ayaa loo adeegsadaa xisaabtankan hal tallaabo ah.",
      "Bir değeri **p%** azaltmak, o değerin p%'sini kendisinden çıkarmak anlamına gelir. Bu hesabı tek adımda yapmak için 1'den küçük bir **çarpım katsayısı** kullanılır.",
      "د يو ارزښت **p%** کموالی دا دى چې د خپل ارزښت p% ترې کم شي. دا محاسبه د يوې ګامې سره د 1 کوچني **ضرب ضريب** پواسطه ترسره کيږي."
    ) },
    // Block 9: highlight "Formule — Réduction"
    { text: S(
      "Formule — Réduction",
      "Formula — Decrease",
      "الصيغة — النقصان",
      "فرمول — کاهش",
      "ቀመር — ምንካስ",
      "Формула — Зменшення",
      "Fórmula — Redução",
      "Qaaciddo — Hoos u dhaca",
      "Formül — Azalış",
      "فورمول — کموالی"
    ) },
    // Block 10: section (no label) itemsFr
    { items: A(
      ["Nouvelle valeur = valeur initiale × (1 − p/100)", "Exemple : −30% sur 200 → 200 × 0,70 = 140"],
      ["New value = initial value × (1 − p/100)", "Example: −30% on 200 → 200 × 0.70 = 140"],
      ["القيمة الجديدة = القيمة الأولية × (1 − p/100)", "مثال: −30% على 200 → 200 × 0,70 = 140"],
      ["مقدار جدید = مقدار اولیه × (1 − p/100)", "مثال: −30% روی 200 → 200 × 0,70 = 140"],
      ["ሓድሽ ዋጋ = መጀምርታ ዋጋ × (1 − p/100)", "ኣብነት፦ −30% ኣብ 200 → 200 × 0,70 = 140"],
      ["Нове значення = початкове значення × (1 − p/100)", "Приклад: −30% від 200 → 200 × 0,70 = 140"],
      ["Novo valor = valor inicial × (1 − p/100)", "Exemplo: −30% sobre 200 → 200 × 0,70 = 140"],
      ["Qiimaha cusub = qiimaha bilowga × (1 − p/100)", "Tusaale: −30% oo ku saabsan 200 → 200 × 0,70 = 140"],
      ["Yeni değer = başlangıç değeri × (1 − p/100)", "Örnek: 200 üzerinde −30% → 200 × 0,70 = 140"],
      ["نوى ارزښت = پيلني ارزښت × (1 − p/100)", "بېلګه: −30% د 200 → 200 × 0,70 = 140"]
    ) },
    // Block 11: plain "" spacer
    {},
    // Block 12: section with label "Comment trouver le coefficient"
    { label: S(
      "Comment trouver le coefficient",
      "How to find the coefficient",
      "كيف تجد المعامل",
      "چگونه ضریب را پیدا کنیم",
      "ኮፊሸን ከመይ ምርካብ",
      "Як знайти коефіцієнт",
      "Como encontrar o coeficiente",
      "Sida loo helo isugeynta",
      "Katsayı nasıl bulunur",
      "ضريب څنګه وموندل شي"
    ), items: A(
      ["Pour une réduction de **p%** : coefficient = 1 − p/100", "Réduction de 20% → 1 − 0,20 = **0,80**", "Réduction de 30% → 1 − 0,30 = **0,70**", "Réduction de 10% → 1 − 0,10 = **0,90**"],
      ["For a decrease of **p%**: coefficient = 1 − p/100", "Decrease of 20% → 1 − 0.20 = **0.80**", "Decrease of 30% → 1 − 0.30 = **0.70**", "Decrease of 10% → 1 − 0.10 = **0.90**"],
      ["لتخفيض بنسبة **p%** : المعامل = 1 − p/100", "تخفيض 20% → 1 − 0,20 = **0,80**", "تخفيض 30% → 1 − 0,30 = **0,70**", "تخفيض 10% → 1 − 0,10 = **0,90**"],
      ["برای کاهش **p%**: ضریب = 1 − p/100", "کاهش 20% → 1 − 0,20 = **0,80**", "کاهش 30% → 1 − 0,30 = **0,70**", "کاهش 10% → 1 − 0,10 = **0,90**"],
      ["ንምቅናስ **p%**: ኮፊሸን = 1 − p/100", "ምቅናስ 20% → 1 − 0,20 = **0,80**", "ምቅናስ 30% → 1 − 0,30 = **0,70**", "ምቅናስ 10% → 1 − 0,10 = **0,90**"],
      ["Для зменшення на **p%**: коефіцієнт = 1 − p/100", "Зменшення на 20% → 1 − 0,20 = **0,80**", "Зменшення на 30% → 1 − 0,30 = **0,70**", "Зменшення на 10% → 1 − 0,10 = **0,90**"],
      ["Para uma redução de **p%**: coeficiente = 1 − p/100", "Redução de 20% → 1 − 0,20 = **0,80**", "Redução de 30% → 1 − 0,30 = **0,70**", "Redução de 10% → 1 − 0,10 = **0,90**"],
      ["Hoos u dhac **p%**: isugeynta = 1 − p/100", "Hoos u dhac 20% → 1 − 0,20 = **0,80**", "Hoos u dhac 30% → 1 − 0,30 = **0,70**", "Hoos u dhac 10% → 1 − 0,10 = **0,90**"],
      ["**p%** azalış için: katsayı = 1 − p/100", "20% azalış → 1 − 0,20 = **0,80**", "30% azalış → 1 − 0,30 = **0,70**", "10% azalış → 1 − 0,10 = **0,90**"],
      ["د **p%** کموالي لپاره: ضريب = 1 − p/100", "د 20% کموالی → 1 − 0,20 = **0,80**", "د 30% کموالی → 1 − 0,30 = **0,70**", "د 10% کموالی → 1 − 0,10 = **0,90**"]
    ) },
    // Block 13: plain "" spacer
    {},
    // Block 14: table — headers only (rows are numbers/symbols)
    { headers: A(
      ["Réduction", "Coefficient", "Exemple (base 200)"],
      ["Decrease", "Coefficient", "Example (base 200)"],
      ["النقصان", "المعامل", "مثال (الأساس 200)"],
      ["کاهش", "ضریب", "مثال (پایه 200)"],
      ["ምንካስ", "ኮፊሸን", "ኣብነት (መሰረት 200)"],
      ["Зменшення", "Коефіцієнт", "Приклад (база 200)"],
      ["Redução", "Coeficiente", "Exemplo (base 200)"],
      ["Hoos u dhaca", "Isugeynta", "Tusaale (aasaas 200)"],
      ["Azalış", "Katsayı", "Örnek (taban 200)"],
      ["کموالی", "ضريب", "بېلګه (اساس 200)"]
    ) },
    // Block 15: plain "" spacer
    {},
    // Block 16: highlight "Augmentation vs Réduction"
    { text: S(
      "Augmentation vs Réduction",
      "Increase vs Decrease",
      "الزيادة مقابل النقصان",
      "افزایش در مقابل کاهش",
      "ምውሳኽ ኣምጻጽ ምንካስ",
      "Збільшення проти зменшення",
      "Aumento vs Redução",
      "Kororka vs Hoos u dhaca",
      "Artış vs Azalış",
      "زياتوالی بلکل کموالی"
    ) },
    // Block 17: section (no label) itemsFr
    { items: A(
      ["Augmentation de p% → coefficient **supérieur à 1** (ex: 1,20 pour +20%)", "Réduction de p% → coefficient **inférieur à 1** (ex: 0,80 pour −20%)"],
      ["Increase of p% → coefficient **greater than 1** (e.g. 1.20 for +20%)", "Decrease of p% → coefficient **less than 1** (e.g. 0.80 for −20%)"],
      ["زيادة p% → معامل **أكبر من 1** (مثلا 1,20 لـ +20%)", "نقصان p% → معامل **أصغر من 1** (مثلا 0,80 لـ −20%)"],
      ["افزایش p% → ضریب **بزرگ‌تر از 1** (مثال: 1,20 برای +20%)", "کاهش p% → ضریب **کوچک‌تر از 1** (مثال: 0,80 برای −20%)"],
      ["ምውሳኽ p% → ኮፊሸን **ካብ 1 ዝዓቢ** (ኣብነት፦ 1,20 ን +20%)", "ምንካስ p% → ኮፊሸን **ካብ 1 ዝነኣስ** (ኣብነት፦ 0,80 ን −20%)"],
      ["Збільшення на p% → коефіцієнт **більший за 1** (напр. 1,20 для +20%)", "Зменшення на p% → коефіцієнт **менший за 1** (напр. 0,80 для −20%)"],
      ["Aumento de p% → coeficiente **superior a 1** (ex.: 1,20 para +20%)", "Redução de p% → coeficiente **inferior a 1** (ex.: 0,80 para −20%)"],
      ["Kororka p% → isugeynta **ka weyn 1** (tusaale 1,20 oo +20%)", "Hoos u dhaca p% → isugeynta **ka yar 1** (tusaale 0,80 oo −20%)"],
      ["p% artış → **1'den büyük** katsayı (örn. +20% için 1,20)", "p% azalış → **1'den küçük** katsayı (örn. −20% için 0,80)"],
      ["د p% زياتوالی → ضريب **د 1 لوى** (بېلګه: +20% لپاره 1,20)", "د p% کموالی → ضريب **د 1 کوچنی** (بېلګه: −20% لپاره 0,80)"]
    ) },
    // Block 18: plain "" spacer
    {},
    // Block 19: heading "Les 4 types de problèmes" (black)
    { text: S(
      "Les 4 types de problèmes",
      "The 4 types of problems",
      "أنواع المسائل الأربعة",
      "۴ نوع مسئله",
      "4 ዓይነት ሕቶታት",
      "4 типи задач",
      "Os 4 tipos de problemas",
      "4-da nooca dhibaatooyinka",
      "4 problem türü",
      "د ستونزو ۴ ډولونه"
    ) },
    // Block 20: table — headers + translated items with "|"
    { headers: A(
      ["Type de problème", "Formule", "Exemple"],
      ["Type of problem", "Formula", "Example"],
      ["نوع المسألة", "الصيغة", "مثال"],
      ["نوع مسئله", "فرمول", "مثال"],
      ["ዓይነት ሕቶ", "ቀመር", "ኣብነት"],
      ["Тип задачі", "Формула", "Приклад"],
      ["Tipo de problema", "Fórmula", "Exemplo"],
      ["Nooca dhibaatada", "Qaaciddo", "Tusaale"],
      ["Problem türü", "Formül", "Örnek"],
      ["د ستونزې ډول", "فورمول", "بېلګه"]
    ), items: A(
      [
        "Calculer p% d'une quantité | N × p ÷ 100 | 20% de 150 = 30",
        "Exprimer une partie en % | (partie ÷ total) × 100 | 30 sur 120 = 25%",
        "Augmenter de p% | N × (1 + p/100) | +15% sur 200 = 230",
        "Réduire de p% | N × (1 − p/100) | −20% sur 200 = 160",
      ],
      [
        "Calculate p% of a quantity | N × p ÷ 100 | 20% of 150 = 30",
        "Express a part as % | (part ÷ total) × 100 | 30 out of 120 = 25%",
        "Increase by p% | N × (1 + p/100) | +15% on 200 = 230",
        "Decrease by p% | N × (1 − p/100) | −20% on 200 = 160",
      ],
      [
        "حساب p% من كمية | N × p ÷ 100 | 20% من 150 = 30",
        "التعبير عن جزء بـ % | (الجزء ÷ المجموع) × 100 | 30 من 120 = 25%",
        "الزيادة بـ p% | N × (1 + p/100) | +15% على 200 = 230",
        "النقصان بـ p% | N × (1 − p/100) | −20% على 200 = 160",
      ],
      [
        "محاسبه p% از یک مقدار | N × p ÷ 100 | 20% از 150 = 30",
        "بیان یک بخش به % | (بخش ÷ کل) × 100 | 30 از 120 = 25%",
        "افزایش به میزان p% | N × (1 + p/100) | +15% روی 200 = 230",
        "کاهش به میزان p% | N × (1 − p/100) | −20% روی 200 = 160",
      ],
      [
        "p% ናይ መጠን ምሕሳብ | N × p ÷ 100 | 20% ናይ 150 = 30",
        "ክፋል ብ % ምግላጽ | (ክፋል ÷ ጠቕላላ) × 100 | 30 ካብ 120 = 25%",
        "ብ p% ምውሳኽ | N × (1 + p/100) | +15% ኣብ 200 = 230",
        "ብ p% ምንካስ | N × (1 − p/100) | −20% ኣብ 200 = 160",
      ],
      [
        "Обчислити p% від величини | N × p ÷ 100 | 20% від 150 = 30",
        "Виразити частину у % | (частина ÷ загальна кількість) × 100 | 30 із 120 = 25%",
        "Збільшити на p% | N × (1 + p/100) | +15% від 200 = 230",
        "Зменшити на p% | N × (1 − p/100) | −20% від 200 = 160",
      ],
      [
        "Calcular p% de uma quantidade | N × p ÷ 100 | 20% de 150 = 30",
        "Exprimir uma parte em % | (parte ÷ total) × 100 | 30 em 120 = 25%",
        "Aumentar em p% | N × (1 + p/100) | +15% sobre 200 = 230",
        "Reduzir em p% | N × (1 − p/100) | −20% sobre 200 = 160",
      ],
      [
        "Xisaabinta p% qaddar | N × p ÷ 100 | 20% oo ka mid ah 150 = 30",
        "Muujinta qayb % | (qayb ÷ wadar) × 100 | 30 oo ka mid ah 120 = 25%",
        "Kororinta p% | N × (1 + p/100) | +15% oo ku saabsan 200 = 230",
        "Hoos u dhigista p% | N × (1 − p/100) | −20% oo ku saabsan 200 = 160",
      ],
      [
        "Bir miktarın p%'sini hesapla | N × p ÷ 100 | 150'nin 20%'si = 30",
        "Parçayı % olarak ifade et | (parça ÷ toplam) × 100 | 120'den 30 = 25%",
        "p% artır | N × (1 + p/100) | 200 üzerinde +15% = 230",
        "p% azalt | N × (1 − p/100) | 200 üzerinde −20% = 160",
      ],
      [
        "د يو مقدار p% محاسبه | N × p ÷ 100 | د 150، 20% = 30",
        "يوه برخه په % کې ښکاره کول | (برخه ÷ ټول) × 100 | له 120 ، 30 = 25%",
        "د p% زياتوالی | N × (1 + p/100) | د 200 +15% = 230",
        "د p% کموالی | N × (1 − p/100) | د 200 −20% = 160",
      ]
    ) },
  ],
};
