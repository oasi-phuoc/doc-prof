import type { SubmoduleTrad } from "./trad-types";

const S = (fr: string, en: string, ar: string, fa: string, ti: string, uk: string, pt: string, so: string, tr: string, ps: string) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

const A = (fr: string[], en: string[], ar: string[], fa: string[], ti: string[], uk: string[], pt: string[], so: string[], tr: string[], ps: string[]) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

export const TRAD_A6_5: SubmoduleTrad = {
  submoduleId: "A6-5",
  title: S(
    "Problèmes",
    "Problems",
    "مسائل",
    "مسائل",
    "ጸገማት",
    "Задачі",
    "Problemas",
    "Xisaabaha",
    "Problemler",
    "ستونزې"
  ),
  blocks: [
    // 0 — heading "Problèmes mixtes de pourcentage" (black)
    { text: S(
      "Problèmes mixtes de pourcentage",
      "Mixed percentage problems",
      "مسائل النسبة المئوية المختلطة",
      "مسائل درصد ترکیبی",
      "ቅልቁል ሚእታዊ ጸገማት",
      "Змішані задачі на відсотки",
      "Problemas mistos de percentagem",
      "Xisaabaha boqolleyda ee isku dhafan",
      "Karışık yüzde problemleri",
      "د سلنې ګډې ستونزې"
    ) },
    // 1 — plain intro paragraph
    { text: S(
      "Dans la vie quotidienne, les problèmes de pourcentage combinent souvent plusieurs opérations : calculer un pourcentage, exprimer une partie en %, appliquer une augmentation ou une réduction. Il faut identifier quelle opération utiliser.",
      "In everyday life, percentage problems often combine several operations: calculating a percentage, expressing a part as %, applying an increase or a decrease. You need to identify which operation to use.",
      "في الحياة اليومية، تجمع مسائل النسبة المئوية في الغالب عدة عمليات: حساب نسبة مئوية، التعبير عن جزء بالنسبة المئوية، تطبيق زيادة أو تخفيض. يجب تحديد أي عملية تُستخدم.",
      "در زندگی روزمره، مسائل درصد اغلب چندین عملیات را ترکیب می‌کنند: محاسبه درصد، بیان بخشی به %, اعمال افزایش یا کاهش. باید مشخص کنی از کدام عملیات استفاده کنی.",
      "ኣብ ዕለታዊ ህይወት፣ ጸገማት ሚእታዊ ብዙሕ ግዜ ብዙሕ ስራሕ ይሓቅፉ፦ ሚእታዊ ምሕሳብ፣ ክፋል ብ % ምዕዛዝ፣ ምውሳኽ ወይ ምጉዳል ምጥቃም። ምኻን ናይ ኮፐሬሽን ምትንታን ኣድለዪ እዩ።",
      "У повсякденному житті задачі на відсотки часто поєднують кілька дій: обчислення відсотка, вираження частини у %, застосування збільшення або зменшення. Треба визначити, яку дію використовувати.",
      "Na vida quotidiana, os problemas de percentagem combinam frequentemente várias operações: calcular uma percentagem, exprimir uma parte em %, aplicar um aumento ou uma redução. É preciso identificar qual operação utilizar.",
      "Nolosha maalinlaha ah, xisaabaha boqolleyda badanaa way isku daraan hawlo badan: xisaabinta boqolley, muujinta qayb ahaan %, ku dabaqida kordhin ama hoos u dhigis. Waa in la qeexaa hawsha la isticmaali doono.",
      "Günlük hayatta yüzde problemleri genellikle birkaç işlemi birleştirir: yüzde hesaplama, bir parçayı % olarak ifade etme, artış veya azalış uygulama. Hangi işlemin kullanılacağını belirlemeniz gerekir.",
      "د ورځني ژوند مسائلو کې د سلنې ستونزې اکثراً ډېرې عملیات سره يوځای کوي: د سلنې محاسبه، يوه برخه د % بڼه کول، زياتوالی يا کمول. بايد وپوهې چې کومه عمليه وکاروو."
    ) },
    // 2 — plain "" spacer
    {},
    // 3 — heading "Les 4 types de problèmes"
    { text: S(
      "Les 4 types de problèmes",
      "The 4 types of problems",
      "أنواع المسائل الأربعة",
      "۴ نوع مسئله",
      "4 ዓይነት ጸገማት",
      "4 типи задач",
      "Os 4 tipos de problemas",
      "Noocyada 4 ee xisaabaha",
      "4 problem türü",
      "د ستونزو ۴ ډولونه"
    ) },
    // 4 — table headers ["Type de problème","Formule","Exemple"] with rows
    { headers: A(
      ["Type de problème", "Formule", "Exemple"],
      ["Problem type", "Formula", "Example"],
      ["نوع المسألة", "الصيغة", "مثال"],
      ["نوع مسئله", "فرمول", "مثال"],
      ["ዓይነት ጸገም", "ቀመር", "ኣብነት"],
      ["Тип задачі", "Формула", "Приклад"],
      ["Tipo de problema", "Fórmula", "Exemplo"],
      ["Nooca xisaabta", "Qaaciddo", "Tusaale"],
      ["Problem türü", "Formül", "Örnek"],
      ["د ستونزې ډول", "فورمول", "بېلګه"]
    ), items: A(
      ["Calculer p% d'une quantité | N × p ÷ 100 | 20% de 150 = 30", "Exprimer une partie en % | (partie ÷ total) × 100 | 30 sur 120 = 25%", "Augmenter de p% | N × (1 + p/100) | +15% sur 200 = 230", "Réduire de p% | N × (1 − p/100) | −20% sur 200 = 160"],
      ["Calculate p% of a quantity | N × p ÷ 100 | 20% of 150 = 30", "Express a part as % | (part ÷ total) × 100 | 30 out of 120 = 25%", "Increase by p% | N × (1 + p/100) | +15% on 200 = 230", "Decrease by p% | N × (1 − p/100) | −20% on 200 = 160"],
      ["حساب p% من كمية | N × p ÷ 100 | 20% من 150 = 30", "تعبير عن جزء بالنسبة | (جزء ÷ مجموع) × 100 | 30 من 120 = 25%", "زيادة p% | N × (1 + p/100) | +15% من 200 = 230", "تخفيض p% | N × (1 − p/100) | −20% من 200 = 160"],
      ["محاسبه p% از مقدار | N × p ÷ 100 | 20% از 150 = 30", "بیان بخش به % | (بخش ÷ کل) × 100 | 30 از 120 = 25%", "افزایش p% | N × (1 + p/100) | +15% روی 200 = 230", "کاهش p% | N × (1 − p/100) | −20% روی 200 = 160"],
      ["p% ናይ መጠን ምሕሳብ | N × p ÷ 100 | 20% ናይ 150 = 30", "ክፋል ብ % ምዕዛዝ | (ክፋል ÷ ድምር) × 100 | 30 ካብ 120 = 25%", "ብ p% ምውሳኽ | N × (1 + p/100) | +15% ኣብ 200 = 230", "ብ p% ምጉዳል | N × (1 − p/100) | −20% ኣብ 200 = 160"],
      ["Обчислити p% від величини | N × p ÷ 100 | 20% від 150 = 30", "Виразити частину у % | (частина ÷ ціле) × 100 | 30 із 120 = 25%", "Збільшити на p% | N × (1 + p/100) | +15% від 200 = 230", "Зменшити на p% | N × (1 − p/100) | −20% від 200 = 160"],
      ["Calcular p% de uma quantidade | N × p ÷ 100 | 20% de 150 = 30", "Exprimir parte em % | (parte ÷ total) × 100 | 30 em 120 = 25%", "Aumentar p% | N × (1 + p/100) | +15% sobre 200 = 230", "Reduzir p% | N × (1 − p/100) | −20% sobre 200 = 160"],
      ["Xisaabi p% qaddar | N × p ÷ 100 | 20% oo 150 ah = 30", "Muuji qayb % | (qayb ÷ guud) × 100 | 30 oo 120 ah = 25%", "Kor u qaad p% | N × (1 + p/100) | +15% oo 200 ah = 230", "Hoos u dhig p% | N × (1 − p/100) | −20% oo 200 ah = 160"],
      ["Bir miktarın p%'sini hesapla | N × p ÷ 100 | 150'nin 20%'si = 30", "Parçayı % olarak ifade et | (parça ÷ toplam) × 100 | 120 içinden 30 = 25%", "p% artır | N × (1 + p/100) | 200 üzerine +15% = 230", "p% azalt | N × (1 − p/100) | 200 üzerine −20% = 160"],
      ["د مقدار p% محاسبه | N × p ÷ 100 | د 150، 20% = 30", "برخه د % بڼه کول | (برخه ÷ ټول) × 100 | 120 کې 30 = 25%", "د p% زياتوالی | N × (1 + p/100) | پر 200 +15% = 230", "د p% کمول | N × (1 − p/100) | پر 200 −20% = 160"]
    ) },
    // 5 — plain "" spacer
    {},
    // 6 — heading "Problème combiné : étapes à suivre"
    { text: S(
      "Problème combiné : étapes à suivre",
      "Combined problem: steps to follow",
      "المسألة المركبة: خطوات الحل",
      "مسئله ترکیبی: مراحل پیروی",
      "ዝተሓዋወሰ ጸገም፦ ምርቃታት ምኽታል",
      "Комбінована задача: кроки для виконання",
      "Problema combinado: passos a seguir",
      "Xisaab isku dhafan: tallaabooyin la raaco",
      "Birleşik problem: izlenecek adımlar",
      "ګډه ستونزه: د تعقيب ګامونه"
    ) },
    // 7 — section label "Méthode générale" with 4 items
    { label: S(
      "Méthode générale",
      "General method",
      "الطريقة العامة",
      "روش کلی",
      "ሓፈሻዊ ሜላ",
      "Загальний метод",
      "Método geral",
      "Habka guud",
      "Genel yöntem",
      "عمومي طريقه"
    ), items: A(
      ["**1.** Lire attentivement l'énoncé et identifier ce qu'on cherche", "**2.** Choisir la bonne formule (calcul, expression, augmentation ou réduction)", "**3.** Effectuer le calcul", "**4.** Vérifier que la réponse est cohérente (unité, ordre de grandeur)"],
      ["**1.** Read the problem carefully and identify what is being asked", "**2.** Choose the right formula (calculation, expression, increase or decrease)", "**3.** Perform the calculation", "**4.** Check that the answer is consistent (unit, order of magnitude)"],
      ["**1.** اقرأ المسألة بعناية وحدّد ما نبحث عنه", "**2.** اختر الصيغة المناسبة (حساب، تعبير، زيادة أو تخفيض)", "**3.** أجرِ الحساب", "**4.** تحقق من أن الإجابة منطقية (الوحدة، الحجم)"],
      ["**1.** مسئله را با دقت بخوان و شناسایی کن چه می‌خواهیم", "**2.** فرمول مناسب را انتخاب کن (محاسبه، بیان، افزایش یا کاهش)", "**3.** محاسبه را انجام بده", "**4.** بررسی کن که پاسخ منطقی باشد (واحد، مقیاس)"],
      ["**1.** ኣዋጁ ብጥንቃቐ ኣንብብ፡ እንታይ ከም ንደሊ ፍለጥ", "**2.** ቅኑዕ ቀመር ምረጽ (ሕሳብ፣ ዕዛዝ፣ ምውሳኽ ወይ ምጉዳል)", "**3.** ሕሳብ ፈጽም", "**4.** መልሲ ቅኑዕ ምዃኑ ኣረጋግጽ (ዩኒት፣ ደረጃ)"],
      ["**1.** Уважно прочитати умову та визначити, що шукаємо", "**2.** Обрати правильну формулу (обчислення, вираження, збільшення або зменшення)", "**3.** Виконати обчислення", "**4.** Перевірити, чи відповідь логічна (одиниця, порядок величини)"],
      ["**1.** Ler o enunciado com atenção e identificar o que se procura", "**2.** Escolher a fórmula certa (cálculo, expressão, aumento ou redução)", "**3.** Realizar o cálculo", "**4.** Verificar se a resposta é coerente (unidade, ordem de grandeza)"],
      ["**1.** Akhri su'aasha si taxadar leh, ogow waxa la raadinayo", "**2.** Dooro qaaciddada saxda ah (xisaab, muujin, kordhin ama hoos u dhigis)", "**3.** Samee xisaabta", "**4.** Hubi in jawaabtu ay macquul tahay (unug, cabbirka)"],
      ["**1.** Problemi dikkatlice oku ve ne arandığını belirle", "**2.** Doğru formülü seç (hesaplama, ifade, artış veya azalış)", "**3.** Hesabı yap", "**4.** Yanıtın tutarlı olduğunu kontrol et (birim, büyüklük sırası)"],
      ["**1.** ستونزه د پام سره ولوله او وپوه چه له دې لټوو", "**2.** سم فورمول غوره کړه (محاسبه، بيان، زياتوالی يا کمول)", "**3.** محاسبه ترسره کړه", "**4.** وګوره چه ځواب سم دی (واحد، اندازه)"]
    ) },
    // 8 — plain "" spacer
    {},
    // 9 — section with example calculations
    { items: A(
      ["Article à 80 CHF soldé −25%, puis −10% supplémentaires :", "1er solde : 80 × 0,75 = 60 CHF", "Solde final : 60 × 0,90 = 54 CHF"],
      ["Item at 80 CHF discounted −25%, then an extra −10%:", "1st discount: 80 × 0.75 = 60 CHF", "Final price: 60 × 0.90 = 54 CHF"],
      ["سلعة بـ 80 CHF مخفضة −25%، ثم −10% إضافية:", "التخفيض الأول: 80 × 0,75 = 60 CHF", "السعر النهائي: 60 × 0,90 = 54 CHF"],
      ["کالای 80 CHF با تخفیف −25%، سپس −10% اضافی:", "تخفیف اول: 80 × 0,75 = 60 CHF", "قیمت نهایی: 60 × 0,90 = 54 CHF"],
      ["ኣቕሓ 80 CHF ብ−25% ቅናሽ፣ ድሕሪኡ ዝወሰኸ −10%፦", "1ይ ቅናሽ፦ 80 × 0,75 = 60 CHF", "መወዳእታ ዋጋ፦ 60 × 0,90 = 54 CHF"],
      ["Товар за 80 CHF зі знижкою −25%, потім ще −10%:", "1-а знижка: 80 × 0,75 = 60 CHF", "Фінальна ціна: 60 × 0,90 = 54 CHF"],
      ["Artigo de 80 CHF com desconto −25%, depois −10% adicionais:", "1.º desconto: 80 × 0,75 = 60 CHF", "Preço final: 60 × 0,90 = 54 CHF"],
      ["Shay 80 CHF ah oo qiimihiisi hoos u dhigay −25%, ka dib −10% dheeraad ah:", "Qiimo-dhimis 1aad: 80 × 0,75 = 60 CHF", "Qiimaha ugu dambeeyay: 60 × 0,90 = 54 CHF"],
      ["80 CHF'lik ürün −25% indirimli, sonra ek −10%:", "1. indirim: 80 × 0,75 = 60 CHF", "Son fiyat: 60 × 0,90 = 54 CHF"],
      ["د 80 CHF توکی −25% تخفیف، بيا اضافي −10%:", "1مه تخفیف: 80 × 0,75 = 60 CHF", "وروستی قيمت: 60 × 0,90 = 54 CHF"]
    ) },
    // 10 — plain "" spacer
    {},
    // 11 — note
    { text: S(
      "Deux réductions successives de 20% et 10% donnent : 1 × 0,80 × 0,90 = 0,72, soit une réduction totale de 28%, et non 30%.",
      "Two successive discounts of 20% and 10% give: 1 × 0.80 × 0.90 = 0.72, a total reduction of 28%, not 30%.",
      "تخفيضان متتاليان بنسبة 20% و10% يعطيان: 1 × 0,80 × 0,90 = 0,72، أي تخفيضاً إجمالياً قدره 28% وليس 30%.",
      "دو تخفیف متوالی 20% و 10% می‌دهند: 1 × 0,80 × 0,90 = 0,72، یعنی کاهش کل 28%، نه 30%.",
      "ክልተ ዝተኸተሉ ቅናሽ 20% ን 10% ን ይህብ፦ 1 × 0,80 × 0,90 = 0,72፣ ክቡር ቅናሽ 28% ደኣ 30% ኣይኮነን።",
      "Два послідовні знижки 20% і 10% дають: 1 × 0,80 × 0,90 = 0,72, тобто загальне зменшення 28%, а не 30%.",
      "Dois descontos sucessivos de 20% e 10% dão: 1 × 0,80 × 0,90 = 0,72, ou seja, uma redução total de 28%, não 30%.",
      "Laba qiimo-dhimis oo xigxiga ah oo 20% iyo 10% ah waxay bixiyaan: 1 × 0,80 × 0,90 = 0,72, taasi waa hoos u dhigis guud ah 28%, maahan 30%.",
      "Arka arkaya iki indirim %20 ve %10 verir: 1 × 0,80 × 0,90 = 0,72, yani toplam %28 indirim, %30 değil.",
      "دوه سلسله‌وار تخفیفونه 20% او 10% ورکوي: 1 × 0,80 × 0,90 = 0,72، يعنې ټول کمول 28% دی، 30% نه."
    ) },
  ],
  consignes: {
    "a6-5-e1": { fr: "Calculez 20% de 250.", en: "Calculate 20% of 250.",
      ar: "احسب 20% من 250.",
      fa: "20% از 250 را حساب کنید.",
      pt: "Calcule 20% de 250.",
      so: "Xisaabi 20% ee 250.",
      ti: "20% ናይ 250 ሒሳብ ግበር።",
      tr: "250'nin %20'sini hesaplayın.",
      ps: "د 250 %20 حساب کړئ.",
      uk: "Обчисліть 20% від 250." },
    "a6-5-e2": { fr: "12 élèves sur 40 sont absents. Quel pourcentage ?", en: "12 students out of 40 are absent. What percentage is that?",
      ar: "12 طالبًا من أصل 40 غائبون. ما نسبتهم المئوية؟",
      fa: "12 دانش‌آموز از 40 نفر غایب هستند. چند درصد؟",
      pt: "12 alunos em 40 estão ausentes. Que percentagem?",
      so: "12 ardayood oo 40 ka mid ah waa maqan yihiin. Boqolley maxay?",
      ti: "40 ካብ 12 ተምሃሮ ዝጠፍኡ ኣለዉ። ሚእታዊ ክንደይ?",
      tr: "40 öğrenciden 12'si devamsız. Yüzde kaç?",
      ps: "د 40 زده‌کوونکو 12 غایب دي. سلنه یې څومره ده؟",
      uk: "12 учнів із 40 відсутні. Який відсоток?" },
    "a6-5-e3": { fr: "Prix 80 CHF soldé −25%, puis −10%. Prix final ?", en: "Price 80 CHF discounted by −25%, then −10%. Final price?",
      ar: "سعر يرتفع من 80 إلى 100 أورو. ما نسبة الارتفاع؟",
      fa: "قیمت از ۸۰ به ۱۰۰ یورو افزایش می‌یابد. درصد افزایش چیست؟",
      pt: "O preço sobe de 80 para 100 €. Qual é a percentagem de aumento?",
      so: "Qiimaha wuxuu ka kacay 80 ilaa 100 €. Boqolley kordhintu maxay?",
      ti: "ዋጋ ካብ 80 ናብ 100 € ይውስኽ። ሚእታዊ ውሰኽ ክንደይ?",
      tr: "Fiyat 80'den 100 €'ya çıkıyor. Artış yüzdesi nedir?",
      ps: "قیمت له ۸۰ نه ۱۰۰ یوروو ته لوړیږي. د زیاتوالي سلنه؟",
      uk: "Ціна зростає з 80 до 100 €. Який відсоток збільшення?" },
    "a6-5-e4": { fr: "Salaire de 2 400 CHF augmenté de 5%. Nouveau salaire ?", en: "Salary of 2,400 CHF increased by 5%. New salary?",
      ar: "تخفيض بنسبة 15% على سعر 200 €. السعر الجديد = ؟",
      fa: "۱۵٪ تخفیف روی قیمت ۲۰۰ یورو. قیمت جدید = ؟",
      pt: "Desconto de 15% sobre o preço de 200 €. Novo preço = ?",
      so: "Dhimis 15% oo ku saabsan qiimaha 200 €. Qiimaha cusub = ?",
      ti: "15% ቅናሽ ኣብ ዋጋ 200 €. ሓዲሽ ዋጋ = ?",
      tr: "%15 indirim, fiyat 200 €. Yeni fiyat = ?",
      ps: "د ۲۰۰ یوروو د قیمت %15 تخفیف. نوی قیمت = ؟",
      uk: "Знижка 15% на ціну 200 €. Нова ціна = ?" },
    "a6-5-e5": { fr: "Article 120 CHF avec 15% de réduction. Prix payé ?", en: "Item at 120 CHF with a 15% discount. Price paid?",
      ar: "زيادة بنسبة 10% على سعر 350 €. السعر الجديد = ؟",
      fa: "۱۰٪ افزایش روی قیمت ۳۵۰ یورو. قیمت جدید = ؟",
      pt: "Aumento de 10% sobre o preço de 350 €. Novo preço = ?",
      so: "Kordhin 10% oo ku saabsan qiimaha 350 €. Qiimaha cusub = ?",
      ti: "10% ውሰኽ ኣብ ዋጋ 350 €. ሓዲሽ ዋጋ = ?",
      tr: "%10 artış, fiyat 350 €. Yeni fiyat = ?",
      ps: "د ۳۵۰ یوروو د قیمت %10 زیاتوالی. نوی قیمت = ؟",
      uk: "Збільшення на 10% від ціни 350 €. Нова ціна = ?" },
  },
};
