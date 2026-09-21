import type { SubmoduleTrad } from "./trad-types";

const S = (fr: string, en: string, ar: string, fa: string, ti: string, uk: string, pt: string, so: string, tr: string, ps: string) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });
const A = (fr: string[], en: string[], ar: string[], fa: string[], ti: string[], uk: string[], pt: string[], so: string[], tr: string[], ps: string[]) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

export const TRAD_A8_4: SubmoduleTrad = {
  submoduleId: "A8-4",
  title: S("Racine carrée", "Square root", "الجذر التربيعي", "ریشه مربع", "ሱር ካሬ", "Квадратний корінь", "Raiz quadrada", "Xidid laba jibbaaran", "Karekök", "مربع ريښه"),
  blocks: [
    // 1. heading "Qu'est-ce que la racine carrée ?"
    { text: S("Qu'est-ce que la racine carrée ?", "What is a square root?", "ما هو الجذر التربيعي؟", "ریشه مربع چیست؟", "ሱር ካሬ እንታይ እዩ?", "Що таке квадратний корінь?", "O que é a raiz quadrada?", "Waa maxay xidid laba jibbaaran?", "Karekök nedir?", "مربع ريښه څه ده؟") },
    // 2. plain "La racine carrée d'un nombre est le nombre qui..."
    { text: S(
      "La racine carrée d'un nombre est le nombre qui, multiplié par lui-même, donne ce nombre.",
      "The square root of a number is the number that, multiplied by itself, gives that number.",
      "الجذر التربيعي لعدد ما هو العدد الذي إذا ضُرب في نفسه أعطى ذلك العدد.",
      "ریشه مربع یک عدد، عددی است که در خودش ضرب شود و آن عدد را بدهد.",
      "ሱር ካሬ ናይ ሓደ ቁጽሪ እቲ ብርእሱ እንተተባዚሑ ነቲ ቁጽሪ ዝህብ ቁጽሪ እዩ።",
      "Квадратний корінь числа — це число, яке, помножене саме на себе, дає це число.",
      "A raiz quadrada de um número é o número que, multiplicado por si próprio, dá esse número.",
      "Xididka laba jibbaaran ee tiro waa tiro marka iyada lafteeda lagu dhufto siinaysa tiradaas.",
      "Bir sayının karekökü, kendisiyle çarpıldığında o sayıyı veren sayıdır.",
      "د يو عدد مربع ريښه هغه عدد دی چې کله پخپل ځان ضرب شي، هغه عدد ورکوي."
    ) },
    // 3. plain "La racine carrée est l'opération inverse de la puissance 2."
    { text: S(
      "La racine carrée est l'opération inverse de la puissance 2.",
      "The square root is the inverse operation of raising to the power of 2.",
      "الجذر التربيعي هو العملية العكسية لتربيع العدد.",
      "ریشه مربع عملیات معکوس توان 2 است.",
      "ሱር ካሬ ተጻራሪ ስርሒት ናይ ሓይሊ 2 እዩ።",
      "Квадратний корінь — це обернена операція до піднесення до степеня 2.",
      "A raiz quadrada é a operação inversa de elevar à potência 2.",
      "Xididka laba jibbaaran waa hawsha ka soo horjeedda awood 2.",
      "Karekök, 2. kuvvete yükseltmenin ters işlemidir.",
      "مربع ريښه د 2 توان برعکس عمل دی."
    ) },
    // 4. section "(√a)² = a / Notation : √a"
    { items: A(
      ["(√a)² = a", "Notation : √a"],
      ["(√a)² = a", "Notation: √a"],
      ["(√a)² = a", "الرمز: √a"],
      ["(√a)² = a", "نماد: √a"],
      ["(√a)² = a", "ምልክት፦ √a"],
      ["(√a)² = a", "Позначення: √a"],
      ["(√a)² = a", "Notação: √a"],
      ["(√a)² = a", "Calaamad: √a"],
      ["(√a)² = a", "Gösterim: √a"],
      ["(√a)² = a", "نښه: √a"]
    ) },
    // 5. section "√9 = 3 car 3 × 3 = 9 / √25 = 5 car 5 × 5 = 25"
    { items: A(
      ["√9 = 3 car 3 × 3 = 9", "√25 = 5 car 5 × 5 = 25"],
      ["√9 = 3 because 3 × 3 = 9", "√25 = 5 because 5 × 5 = 25"],
      ["√9 = 3 لأن 3 × 3 = 9", "√25 = 5 لأن 5 × 5 = 25"],
      ["√9 = 3 چون 3 × 3 = 9", "√25 = 5 چون 5 × 5 = 25"],
      ["√9 = 3 ምኽንያቱ 3 × 3 = 9", "√25 = 5 ምኽንያቱ 5 × 5 = 25"],
      ["√9 = 3, бо 3 × 3 = 9", "√25 = 5, бо 5 × 5 = 25"],
      ["√9 = 3 porque 3 × 3 = 9", "√25 = 5 porque 5 × 5 = 25"],
      ["√9 = 3 sababtoo ah 3 × 3 = 9", "√25 = 5 sababtoo ah 5 × 5 = 25"],
      ["√9 = 3 çünkü 3 × 3 = 9", "√25 = 5 çünkü 5 × 5 = 25"],
      ["√9 = 3 ځکه 3 × 3 = 9", "√25 = 5 ځکه 5 × 5 = 25"]
    ) },
    // 6. heading "Qu'est-ce qu'un carré parfait ?"
    { text: S("Qu'est-ce qu'un carré parfait ?", "What is a perfect square?", "ما هو المربع الكامل؟", "مربع کامل چیست؟", "ፍጹም ካሬ እንታይ እዩ?", "Що таке повний квадрат?", "O que é um quadrado perfeito?", "Waa maxay labajibbaar dhammaystiran?", "Tam kare nedir?", "بشپړ مربع څه دی؟") },
    // 7. plain "Un carré parfait est un nombre obtenu en multipliant un nombre entier par lui-même."
    { text: S(
      "Un carré parfait est un nombre obtenu en multipliant un nombre entier par lui-même.",
      "A perfect square is a number obtained by multiplying a whole number by itself.",
      "المربع الكامل هو عدد يُحصل عليه بضرب عدد صحيح في نفسه.",
      "مربع کامل عددی است که از ضرب یک عدد صحیح در خودش به دست می‌آید.",
      "ፍጹም ካሬ ሓደ ምሉእ ቁጽሪ ብርእሱ ብምብዛሕ ዝርከብ ቁጽሪ እዩ።",
      "Повний квадрат — це число, отримане множенням цілого числа саме на себе.",
      "Um quadrado perfeito é um número obtido multiplicando um número inteiro por si próprio.",
      "Labajibbaar dhammaystiran waa tiro laga helo iyadoo tiro dhan oo in nafteed lagu dhufto.",
      "Tam kare, bir tam sayının kendisiyle çarpılmasıyla elde edilen sayıdır.",
      "بشپړ مربع هغه عدد دی چې د يو بشپړ عدد له ځان سره ضرب کولو سره ترلاسه کيږي."
    ) },
    // 8. table N, N², √(N²) — rows are all pure math, no text translation needed
    {},
    // 9. plain "" (spacer)
    {},
    // 10. heading "Propriété de la racine carrée"
    { text: S("Propriété de la racine carrée", "Property of the square root", "خاصية الجذر التربيعي", "ویژگی ریشه مربع", "ባህሪ ሱር ካሬ", "Властивість квадратного кореня", "Propriedade da raiz quadrada", "Sifada xididka laba jibbaaran", "Karekök özelliği", "د مربع ريښې ځانګړنه") },
    // 11. plain "√(a × b) = √a × √b" — pure math notation
    {},
    // 12. section "√(4 × 9) = √4 × √9 = 2 × 3 = 6" — pure math notation
    {},
    // 13. highlight "Astuce"
    { text: S("Astuce", "Tip", "نصيحة", "نکته", "ምኽሪ", "Порада", "Dica", "Xeeladda", "İpucu", "لارښود") },
    // 14. section (2 items about perfect squares and negative numbers)
    { items: A(
      ["Si le nombre sous la racine est un carré parfait, le résultat est un entier.", "Les racines carrées de nombres négatifs n'existent pas dans les nombres réels."],
      ["If the number under the root is a perfect square, the result is a whole number.", "Square roots of negative numbers do not exist in the real numbers."],
      ["إذا كان العدد تحت الجذر مربعاً كاملاً، فالنتيجة عدد صحيح.", "الجذور التربيعية للأعداد السالبة غير موجودة في الأعداد الحقيقية."],
      ["اگر عدد زیر ریشه یک مربع کامل باشد، نتیجه یک عدد صحیح است.", "ریشه مربع اعداد منفی در اعداد حقیقی وجود ندارد."],
      ["ናይቲ ምልክት ሱር ካሬ ፍጹም ካሬ እንተኾይኑ፣ ውጽኢቱ ምሉእ ቁጽሪ እዩ።", "ናይ ኣሉታ ቁጽርታት ሱር ካሬ ኣብ ሓቀኛ ቁጽርታት የለን።"],
      ["Якщо число під коренем є повним квадратом, результат — ціле число.", "Квадратні корені від'ємних чисел не існують у реальних числах."],
      ["Se o número sob a raiz é um quadrado perfeito, o resultado é um número inteiro.", "As raízes quadradas de números negativos não existem nos números reais."],
      ["Haddii lambarka hoosta xididka uu yahay labajibbaar dhammaystiran, natiijadu waa tiro dhan.", "Xididada laba jibbaaran ee tirada taban kuma jiraan tirada dhabta ah."],
      ["Kök altındaki sayı tam kare ise sonuç tam sayıdır.", "Negatif sayıların karekökü gerçek sayılarda mevcut değildir."],
      ["که د ريښې لاندې عدد بشپړ مربع وي، پايله بشپړ عدد دی.", "د منفي اعدادو مربع ريښې د حقيقي اعدادو کې موجودې نه دي."]
    ) },
  ],
  consignes: {
    "Calculez les résultats.": { fr: "Calculez les résultats.", en: "Calculate the results.", ar: "احسب النتائج.", fa: "نتایج را حساب کنید.", ti: "ውጽኢታት ኣስብ።", uk: "Обчисліть результати.", pt: "Calcule os resultados.", so: "Xisaabi natiijooyinka.", tr: "Sonuçları hesaplayın.", ps: "پایلې محاسبه کړئ." },
    "Complétez avec les valeurs manquantes.": { fr: "Complétez avec les valeurs manquantes.", en: "Fill in the missing values.", ar: "أكمل بالقيم الناقصة.", fa: "مقادیر گمشده را کامل کنید.", ti: "ብዝጎደሉ ክብርታት ምላእ።", uk: "Доповніть пропущені значення.", pt: "Complete com os valores em falta.", so: "Ku buuxi qiimayaasha maqan.", tr: "Eksik değerleri tamamlayın.", ps: "ورک ارزښتونه بشپړ کړئ." },
  },
};
