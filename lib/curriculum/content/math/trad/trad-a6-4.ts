import type { SubmoduleTrad } from "./trad-types";

const S = (fr: string, en: string, ar: string, fa: string, ti: string, uk: string, pt: string, so: string, tr: string, ps: string) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

const A = (fr: string[], en: string[], ar: string[], fa: string[], ti: string[], uk: string[], pt: string[], so: string[], tr: string[], ps: string[]) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

export const TRAD_A6_4: SubmoduleTrad = {
  submoduleId: "A6-4",
  title: S(
    "Comparaison de pourcentages",
    "Comparing percentages",
    "مقارنة النسب المئوية",
    "مقایسه درصدها",
    "ምክፋታት ሚእታዊ ምርኽካብ",
    "Порівняння відсотків",
    "Comparação de percentagens",
    "Barbar dhigga boqolleyda",
    "Yüzdelerin karşılaştırılması",
    "د سلنو پرتله"
  ),
  blocks: [
    // Block 0 — heading "Comparaison de pourcentages" (black)
    { text: S(
      "Comparaison de pourcentages",
      "Comparing percentages",
      "مقارنة النسب المئوية",
      "مقایسه درصدها",
      "ምክፋታት ሚእታዊ ምርኽካብ",
      "Порівняння відсотків",
      "Comparação de percentagens",
      "Barbar dhigga boqolleyda",
      "Yüzdelerin karşılaştırılması",
      "د سلنو پرتله"
    ) },
    // Block 1 — plain intro
    { text: S(
      "Comparer des pourcentages permet de prendre de meilleures décisions : quelle offre est plus avantageuse ? Quel produit a le meilleur rapport qualité-prix ? Les pourcentages permettent de comparer des quantités de bases différentes.",
      "Comparing percentages helps make better decisions: which offer is more advantageous? Which product has the best value for money? Percentages allow comparing quantities with different bases.",
      "مقارنة النسب المئوية تتيح اتخاذ قرارات أفضل: أي عرض أكثر إغراءً؟ أي منتج يمتلك أفضل قيمة مقابل المال؟ تتيح النسب المئوية مقارنة كميات ذات قواعد مختلفة.",
      "مقایسه درصدها به تصمیم‌گیری بهتر کمک می‌کند: کدام پیشنهاد سودمندتر است؟ کدام محصول بهترین ارزش را دارد؟ درصدها امکان مقایسه کمیت‌هایی با پایه‌های مختلف را می‌دهند.",
      "ምክፋታት ሚእታዊ ምርኽካብ ንምምሕያሽ ውሳነታት ይሕግዝ፦ ምኽፋት ወፃእ ዝሓሸ ኣየናይ እዩ? ምርቓ ብዝሓሸ ምዕቃን ዋጋ? ሚእታዊ ምዕቃናት ናይ ዝተፈላለዩ መሰረታት ክናጸሩ ይፈቅዱ።",
      "Порівняння відсотків допомагає приймати кращі рішення: яка пропозиція вигідніша? Який продукт має найкраще співвідношення ціни та якості? Відсотки дозволяють порівнювати кількості з різними базами.",
      "Comparar percentagens permite tomar melhores decisões: qual oferta é mais vantajosa? Qual produto tem melhor relação qualidade-preço? As percentagens permitem comparar quantidades com bases diferentes.",
      "Barbar dhigga boqolleyda waxay ka caawisaa go'aamada ka wanaagsan: qiimaha Furinta ma taas ee ka fiican? Alaabta ma yaqaan qiimaha ugu fiican? Boqolleydu waxay ogolaanaysaa barbar dhigga tirada u leh aasaasyo kala duwan.",
      "Yüzdeleri karşılaştırmak daha iyi kararlar almayı sağlar: hangi teklif daha avantajlı? Hangi ürün en iyi fiyat-performans oranına sahip? Yüzdeler, farklı tabanları olan miktarları karşılaştırmaya olanak tanır.",
      "د سلنو پرتله د غوره پرېکړو کولو سره مرسته کوي: کوم وړانديز ګټور دی؟ کوم توکي غوره بيه لري؟ سلنې د مختلفو بنسټونو سره د مقدارونو پرتله کول ممکنه کوي."
    ) },
    // Block 2 — spacer
    {},
    // Block 3 — heading "Comparer des offres commerciales"
    { text: S(
      "Comparer des offres commerciales",
      "Comparing commercial offers",
      "مقارنة العروض التجارية",
      "مقایسه پیشنهادات تجاری",
      "ነግዳዊ ወፃእታት ምርኽካብ",
      "Порівняння комерційних пропозицій",
      "Comparar ofertas comerciais",
      "Barbar dhigga qiimayaasha ganacsiga",
      "Ticari tekliflerin karşılaştırılması",
      "د سوداګريز وړانديزونو پرتله"
    ) },
    // Block 4 — section labelFr: "Méthode"
    { label: S(
        "Méthode",
        "Method",
        "الطريقة",
        "روش",
        "ሜላ",
        "Метод",
        "Método",
        "Hab",
        "Yöntem",
        "طريقه"
      ), items: A(
      ["**1.** Calculer le montant de la réduction pour chaque offre", "**2.** Comparer les montants obtenus", "**3.** Choisir l'offre la plus avantageuse selon la situation"],
      ["**1.** Calculate the discount amount for each offer", "**2.** Compare the amounts obtained", "**3.** Choose the most advantageous offer depending on the situation"],
      ["**1.** حساب مبلغ الخصم لكل عرض", "**2.** مقارنة المبالغ المحصل عليها", "**3.** اختيار العرض الأكثر ملاءمة حسب الوضعية"],
      ["**1.** محاسبه مبلغ تخفیف برای هر پیشنهاد", "**2.** مقایسه مبالغ به دست آمده", "**3.** انتخاب سودمندترین پیشنهاد بر اساس موقعیت"],
      ["**1.** ናይ ነፍሲ-ወከፍ ወፃእ ምጉዳል ዝሓስቦ ምሕሳብ", "**2.** ዝተረኽቡ መጠናት ምርኽካብ", "**3.** ምርጫ ብዝሓሸ ወፃእ ምርካብ ምስ ኩነታት"],
      ["**1.** Обчислити суму знижки для кожної пропозиції", "**2.** Порівняти отримані суми", "**3.** Вибрати найвигіднішу пропозицію залежно від ситуації"],
      ["**1.** Calcular o valor do desconto para cada oferta", "**2.** Comparar os valores obtidos", "**3.** Escolher a oferta mais vantajosa consoante a situação"],
      ["**1.** Xisaabi qadarka dhimista qiimaha ee kulligood", "**2.** Barbar dhig qadarka la helay", "**3.** Dooro qiimaha ugu anfaca xaaladda"],
      ["**1.** Her teklif için indirim miktarını hesapla", "**2.** Elde edilen miktarları karşılaştır", "**3.** Duruma göre en avantajlı teklifi seç"],
      ["**1.** د هر وړانديز لپاره د تخفيف اندازه محاسبه کړئ", "**2.** ترلاسه شوي مقدارونه پرتله کړئ", "**3.** د حالت سره سم ترټولو ګټور وړانديز وټاکئ"]
    ) },
    // Block 5 — section labelFr: "" with Offre A / Offre B
    { label: S("", "", "", "", "", "", "", "", "", ""), items: A(
      ["Offre A : −20% sur 150 CHF → 150 × 0,80 = 120 CHF  (économie : 30 CHF)", "Offre B : −15% sur 130 CHF → 130 × 0,85 = 110,50 CHF  (économie : 19,50 CHF)"],
      ["Offer A: −20% on 150 CHF → 150 × 0.80 = 120 CHF  (saving: 30 CHF)", "Offer B: −15% on 130 CHF → 130 × 0.85 = 110.50 CHF  (saving: 19.50 CHF)"],
      ["عرض أ: −20% على 150 CHF → 150 × 0,80 = 120 CHF  (توفير: 30 CHF)", "عرض ب: −15% على 130 CHF → 130 × 0,85 = 110,50 CHF  (توفير: 19,50 CHF)"],
      ["پیشنهاد الف: −20% روی 150 CHF → 150 × 0,80 = 120 CHF  (صرفه‌جویی: 30 CHF)", "پیشنهاد ب: −15% روی 130 CHF → 130 × 0,85 = 110,50 CHF  (صرفه‌جویی: 19,50 CHF)"],
      ["ወፃእ ሀ: −20% ኣብ 150 CHF → 150 × 0,80 = 120 CHF  (ቁጠባ: 30 CHF)", "ወፃእ ለ: −15% ኣብ 130 CHF → 130 × 0,85 = 110,50 CHF  (ቁጠባ: 19,50 CHF)"],
      ["Пропозиція А: −20% на 150 CHF → 150 × 0,80 = 120 CHF  (економія: 30 CHF)", "Пропозиція Б: −15% на 130 CHF → 130 × 0,85 = 110,50 CHF  (економія: 19,50 CHF)"],
      ["Oferta A: −20% sobre 150 CHF → 150 × 0,80 = 120 CHF  (poupança: 30 CHF)", "Oferta B: −15% sobre 130 CHF → 130 × 0,85 = 110,50 CHF  (poupança: 19,50 CHF)"],
      ["Qiimo-dhimis A: −20% oo 150 CHF ah → 150 × 0,80 = 120 CHF  (badbaadinta: 30 CHF)", "Qiimo-dhimis B: −15% oo 130 CHF ah → 130 × 0,85 = 110,50 CHF  (badbaadinta: 19,50 CHF)"],
      ["Teklif A: −20% üzerine 150 CHF → 150 × 0,80 = 120 CHF  (tasarruf: 30 CHF)", "Teklif B: −15% üzerine 130 CHF → 130 × 0,85 = 110,50 CHF  (tasarruf: 19,50 CHF)"],
      ["وړانديز الف: −20% پر 150 CHF باندې → 150 × 0,80 = 120 CHF  (سپما: 30 CHF)", "وړانديز ب: −15% پر 130 CHF باندې → 130 × 0,85 = 110,50 CHF  (سپما: 19,50 CHF)"]
    ) },
    // Block 6 — spacer
    {},
    // Block 7 — table
    { headers: A(
        ["Produit", "Prix initial", "Réduction", "Prix final"],
        ["Product", "Initial price", "Discount", "Final price"],
        ["المنتج", "السعر الأصلي", "التخفيض", "السعر النهائي"],
        ["محصول", "قیمت اولیه", "تخفیف", "قیمت نهایی"],
        ["ፍርያት", "መጀመርታ ዋጋ", "ምጉዳል", "መወዳእታ ዋጋ"],
        ["Продукт", "Початкова ціна", "Знижка", "Кінцева ціна"],
        ["Produto", "Preço inicial", "Desconto", "Preço final"],
        ["Alaab", "Qiimaha hore", "Dhimista qiimaha", "Qiimaha ugu dambeeyay"],
        ["Ürün", "Başlangıç fiyatı", "İndirim", "Son fiyat"],
        ["توکی", "پيلنی بيه", "تخفيف", "وروستۍ بيه"]
      ), items: A(
      ["Veste — Magasin A | 200 CHF | −25% | 150 CHF", "Veste — Magasin B | 180 CHF | −20% | 144 CHF", "Veste — Magasin C | 220 CHF | −30% | 154 CHF"],
      ["Jacket — Store A | 200 CHF | −25% | 150 CHF", "Jacket — Store B | 180 CHF | −20% | 144 CHF", "Jacket — Store C | 220 CHF | −30% | 154 CHF"],
      ["سترة — متجر أ | 200 CHF | −25% | 150 CHF", "سترة — متجر ب | 180 CHF | −20% | 144 CHF", "سترة — متجر ج | 220 CHF | −30% | 154 CHF"],
      ["کت — فروشگاه الف | 200 CHF | −25% | 150 CHF", "کت — فروشگاه ب | 180 CHF | −20% | 144 CHF", "کت — فروشگاه ج | 220 CHF | −30% | 154 CHF"],
      ["ጃኬት — ድኳን ሀ | 200 CHF | −25% | 150 CHF", "ጃኬት — ድኳን ለ | 180 CHF | −20% | 144 CHF", "ጃኬት — ድኳን ሐ | 220 CHF | −30% | 154 CHF"],
      ["Піджак — Магазин A | 200 CHF | −25% | 150 CHF", "Піджак — Магазин B | 180 CHF | −20% | 144 CHF", "Піджак — Магазин C | 220 CHF | −30% | 154 CHF"],
      ["Casaco — Loja A | 200 CHF | −25% | 150 CHF", "Casaco — Loja B | 180 CHF | −20% | 144 CHF", "Casaco — Loja C | 220 CHF | −30% | 154 CHF"],
      ["Jaakad — Dukaanka A | 200 CHF | −25% | 150 CHF", "Jaakad — Dukaanka B | 180 CHF | −20% | 144 CHF", "Jaakad — Dukaanka C | 220 CHF | −30% | 154 CHF"],
      ["Ceket — Mağaza A | 200 CHF | −25% | 150 CHF", "Ceket — Mağaza B | 180 CHF | −20% | 144 CHF", "Ceket — Mağaza C | 220 CHF | −30% | 154 CHF"],
      ["کوټ — دوکان الف | 200 CHF | −25% | 150 CHF", "کوټ — دوکان ب | 180 CHF | −20% | 144 CHF", "کوټ — دوکان ج | 220 CHF | −30% | 154 CHF"]
    ) },
    // Block 8 — spacer
    {},
    // Block 9 — heading "Comparer des taux (notes, résultats...)"
    { text: S(
      "Comparer des taux (notes, résultats...)",
      "Comparing rates (grades, results...)",
      "مقارنة النسب (الدرجات، النتائج...)",
      "مقایسه نرخ‌ها (نمرات، نتایج...)",
      "ሬሾታት ምርኽካብ (ነጥብታት፣ ውጽኢታት...)",
      "Порівняння показників (оцінки, результати...)",
      "Comparar taxas (notas, resultados...)",
      "Barbar dhigga heerarka (calaamadaha, natiijooyinka...)",
      "Oranları karşılaştırma (notlar, sonuçlar...)",
      "د کچو پرتله (نمرې، پايلې...)"
    ) },
    // Block 10 — section labelFr: "Principe"
    { label: S(
        "Principe",
        "Principle",
        "المبدأ",
        "اصل",
        "መሰረት",
        "Принцип",
        "Princípio",
        "Mabda'",
        "İlke",
        "اصل"
      ), items: A(
      ["Convertir chaque résultat en pourcentage pour comparer sur la même base", "Classe A : 18/24 réussites → (18 ÷ 24) × 100 = **75%**", "Classe B : 21/30 réussites → (21 ÷ 30) × 100 = **70%**", "→ La classe A a un meilleur taux de réussite"],
      ["Convert each result to a percentage to compare on the same basis", "Class A: 18/24 successes → (18 ÷ 24) × 100 = **75%**", "Class B: 21/30 successes → (21 ÷ 30) × 100 = **70%**", "→ Class A has a better success rate"],
      ["تحويل كل نتيجة إلى نسبة مئوية للمقارنة على نفس الأساس", "الفصل أ: 18/24 نجاحا → (18 ÷ 24) × 100 = **75%**", "الفصل ب: 21/30 نجاحا → (21 ÷ 30) × 100 = **70%**", "→ الفصل أ لديه معدل نجاح أفضل"],
      ["هر نتیجه را به درصد تبدیل کن تا روی یک پایه مقایسه شوند", "کلاس الف: 18/24 موفقیت → (18 ÷ 24) × 100 = **75%**", "کلاس ب: 21/30 موفقیت → (21 ÷ 30) × 100 = **70%**", "→ کلاس الف نرخ موفقیت بهتری دارد"],
      ["ነፍሲ-ወከፍ ውጽኢት ናብ ሚእታዊ ቐይር ኣብ ሓደ መሰረት ንምርኽካብ", "ክፍሊ ሀ: 18/24 ዓወት → (18 ÷ 24) × 100 = **75%**", "ክፍሊ ለ: 21/30 ዓወት → (21 ÷ 30) × 100 = **70%**", "→ ክፍሊ ሀ ዝሓሸ ናይ ዓወት ሬሾ ኣለዎ"],
      ["Перетворити кожен результат у відсоток для порівняння на однаковій основі", "Клас А: 18/24 успіхів → (18 ÷ 24) × 100 = **75%**", "Клас Б: 21/30 успіхів → (21 ÷ 30) × 100 = **70%**", "→ Клас А має кращий показник успішності"],
      ["Converter cada resultado em percentagem para comparar na mesma base", "Turma A: 18/24 sucessos → (18 ÷ 24) × 100 = **75%**", "Turma B: 21/30 sucessos → (21 ÷ 30) × 100 = **70%**", "→ A turma A tem uma taxa de sucesso melhor"],
      ["U beddel natiijo kasta boqolley si loo barbar dhigo aasaas isku mid ah", "Fasalka A: 18/24 guul → (18 ÷ 24) × 100 = **75%**", "Fasalka B: 21/30 guul → (21 ÷ 30) × 100 = **70%**", "→ Fasalka A wuxuu leeyahay heer guul ka sare"],
      ["Her sonucu yüzdeye çevirerek aynı temelde karşılaştır", "Sınıf A: 18/24 başarı → (18 ÷ 24) × 100 = **75%**", "Sınıf B: 21/30 başarı → (21 ÷ 30) × 100 = **70%**", "→ A sınıfının başarı oranı daha yüksektir"],
      ["هر پايله سلنې ته واړوئ ترڅو پر يوه بنسټ پرتله شي", "ټولګی الف: 18/24 بريا → (18 ÷ 24) × 100 = **75%**", "ټولګی ب: 21/30 بريا → (21 ÷ 30) × 100 = **70%**", "→ ټولګی الف غوره د بريا کچه لري"]
    ) },
    // Block 11 — spacer
    {},
    // Block 12 — note
    { text: S(
      "La plus grande réduction en % ne garantit pas le prix le plus bas. Toujours calculer le prix final pour comparer correctement.",
      "The largest % discount does not guarantee the lowest price. Always calculate the final price to compare correctly.",
      "أكبر تخفيض بالنسبة المئوية لا يضمن أدنى سعر. احسب دائما السعر النهائي للمقارنة الصحيحة.",
      "بزرگ‌ترین تخفیف درصدی پایین‌ترین قیمت را تضمین نمی‌کند. برای مقایسه درست همیشه قیمت نهایی را محاسبه کنید.",
      "ዝዓቢ ምጉዳል ብሚእታዊ ዝተሓተ ዋጋ ኣየረጋግጽን። ሌሓ ንምርኽካብ መወዳእታ ዋጋ ሌሓ ኣስሊ።",
      "Найбільша знижка у % не гарантує найнижчу ціну. Завжди розраховуй кінцеву ціну для правильного порівняння.",
      "O maior desconto em % não garante o preço mais baixo. Calcula sempre o preço final para comparar corretamente.",
      "Dhimista boqolleyda ugu badan kuma dammaanad qaadayso qiimaha ugu hooseeya. Had iyo jeer xisaabi qiimaha ugu dambeeya si loo barbar dhigo si sax ah.",
      "En büyük % indirimi en düşük fiyatı garanti etmez. Doğru karşılaştırma için her zaman son fiyatı hesapla.",
      "د سلنو ترټولو لوی تخفيف د ترټولو ټيټ بيې ضمانت نه کوي. د سمې پرتلې لپاره تل وروستۍ بيه محاسبه کړئ."
    ) },
  ],
  consignes: {
    wordProblems: {
      fr: "Résolvez les problèmes. Écrivez uniquement la réponse numérique.",
      en: "Solve the problems. Write only the numerical answer.",
      ar: "حلّ المسائل. اكتب الإجابة الرقمية فقط.",
      fa: "مسئله‌ها را حل کنید. فقط پاسخ عددی را بنویسید.",
      ti: "ነቶም ጸገማት ፍታሕ። ቁጽራዊ መልሲ ጥራይ ጻሕፍ።",
      uk: "Розв'яжи задачі. Запиши лише числову відповідь.",
      pt: "Resolve os problemas. Escreve apenas a resposta numérica.",
      so: "Xalli su'aalaha. Qor kaliya jawaabta tiro ahaan.",
      tr: "Problemleri çöz. Yalnızca sayısal cevabı yaz.",
      ps: "مسئلې حل کړه. یوازې عددي ځواب ولیکه.",
    },
  },
};
