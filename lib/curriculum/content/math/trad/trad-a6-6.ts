import type { SubmoduleTrad } from "./trad-types";

export const TRAD_A6_6: SubmoduleTrad = {
  submoduleId: "A6-6",
  title: {
    fr: "Règle de trois",
    en: "Rule of three",
    ar: "قاعدة الثلاثة",
    fa: "قانون سه",
    ti: "ሕጊ ሰለስተ",
    uk: "Правило трьох",
  },
  paragraphs: {
    fr: [
          "La règle de trois (ou produit en croix) permet de trouver une valeur inconnue dans une proportion. Si a/b = c/x, alors x = (b × c) / a.",
          "Étapes : 1) Identifiez les 3 valeurs connues et la valeur x inconnue. 2) Écrivez la proportion. 3) Multipliez en croix. 4) Divisez par le nombre restant.",
          "Exemple : Si 2 pommes coûtent 4 CHF, combien coûtent 6 pommes ? → 2/4 = 6/x → x = (4 × 6) / 2 = 24 / 2 = 12 CHF.",
        ],
    en: [
          "The rule of three (cross multiplication) finds an unknown value in a proportion. If a/b = c/x, then x = (b × c) / a.",
          "Steps: 1) Identify the 3 known values and unknown x. 2) Write the proportion. 3) Cross-multiply. 4) Divide by the remaining number.",
          "Example: 2 apples cost 4 CHF, how much for 6? → x = (4 × 6) / 2 = 12 CHF.",
        ],
    ar: [
          "قاعدة الثلاثة (الضرب المتقاطع) تجد قيمة مجهولة في تناسب. إذا a/b = c/x فـ x = (b × c) / a.",
          "الخطوات: 1) حدّد القيم الثلاث المعروفة والمجهول x. 2) اكتب التناسب. 3) اضرب تقاطعيًا. 4) اقسم على العدد المتبقي.",
          "مثال: 2 تفاحات بـ 4 فرنك، كم تكلف 6؟ → x = (4 × 6) / 2 = 12 فرنك.",
        ],
    fa: [
          "قانون سه (ضربدر) مقدار مجهول در یک تناسب را می‌یابد. اگر a/b = c/x پس x = (b × c) / a.",
          "مراحل: ۱) سه مقدار معلوم و مجهول x را شناسایی کنید. ۲) تناسب را بنویسید. ۳) ضربدر بزنید. ۴) بر عدد باقیمانده تقسیم کنید.",
          "مثال: ۲ سیب ۴ فرانک، ۶ سیب چند؟ → x = (۴ × ۶) / ۲ = ۱۲ فرانک.",
        ],
    ti: [
          "ሕጊ ሰለስተ (ናይ ሳጻሊ ዘርፊ) ናይ ዘይፍለጥ ዋጋ ምቅዳድ ምርካብ ዘፍቅድ ሕጊ እዩ። a/b = c/x ምስ ዝኾነ x = (b × c) / a.",
          "ስጉምቲ: 1) ሰለስተ ዝፍለጡ ዋጋ ምስ x ዘይፍለጥ ዋጋ ርኸቦ. 2) ምቅዳድ ጽሓፍ. 3) ናይ ሳጻሊ ዘርፍ. 4) ዝተረፈ ቁጽሪ ብምካፋፍ.",
          "ኣብነት: 2 ፖም 4 CHF ዋጋ ዘለዎ 6 ፖም ክንደይ? → x = (4 × 6) / 2 = 12 CHF.",
        ],
    uk: [
          "Правило трьох (перехресне множення) знаходить невідоме значення в пропорції. Якщо a/b = c/x, то x = (b × c) / a.",
          "Кроки: 1) Визначте три відомих і невідоме x. 2) Запишіть пропорцію. 3) Перехресно помножте. 4) Поділіть на число, що залишилось.",
          "Приклад: 2 яблука коштують 4 CHF, 6 яблук — скільки? → x = (4 × 6) / 2 = 12 CHF.",
        ],
  },
  blocks: [
    {
      text: {
        fr: "Comparaison de pourcentages",
      }
    },
    {
      text: {
        fr: "Comparer des pourcentages permet de prendre de meilleures décisions : quelle offre est plus avantageuse ? Quel produit a le meilleur rapport qualité-prix ? Les pourcentages permettent de comparer des quantités de bases différentes.",
      }
    },
    {
      text: {
        fr: "",
      }
    },
    {
      text: {
        fr: "Comparer des offres commerciales",
      }
    },
    {
      label: {
        fr: "Méthode",
      },
      items: {
        fr: [
          "**Étape 1** — Calculer le montant de la réduction pour chaque offre",
          "**Étape 2** — Comparer les montants obtenus",
          "**Étape 3** — Choisir l'offre la plus avantageuse selon la situation",
        ],
      }
    },
    {
      text: {
        fr: "Offre A : −20% sur 150 CHF → 150 × 0,80 = 120 CHF  (économie : 30 CHF)",
      }
    },
    {
      text: {
        fr: "Offre B : −15% sur 130 CHF → 130 × 0,85 = 110,50 CHF  (économie : 19,50 CHF)",
      }
    },
    {
      text: {
        fr: "",
      }
    },
    {
      text: {
        fr: "Tableau comparatif : exemple de magasins",
      }
    },
    {
      headers: {
        fr: ["Produit", "Prix initial", "Réduction", "Prix final"],
      }
    },
    {
      text: {
        fr: "La plus grande réduction en % ne garantit pas le prix le plus bas. Toujours calculer le prix final pour comparer correctement.",
      }
    },
    {
      text: {
        fr: "",
      }
    },
    {
      text: {
        fr: "Comparer des taux (notes, résultats...)",
      }
    },
    {
      label: {
        fr: "Principe",
      },
      items: {
        fr: [
          "Convertir chaque résultat en pourcentage pour comparer sur la même base",
          "Classe A : 18/24 réussites → (18 ÷ 24) × 100 = **75%**",
          "Classe B : 21/30 réussites → (21 ÷ 30) × 100 = **70%**",
          "→ La classe A a un meilleur taux de réussite",
        ],
      }
    },
    {
      text: {
        fr: "",
      }
    },
    {
      label: {
        fr: "Cas concrets d'utilisation",
      },
      items: {
        fr: [
          "Comparer deux soldes dans des magasins différents",
          "Comparer des résultats scolaires de classes de tailles différentes",
          "Évaluer l'efficacité de deux médicaments testés sur des groupes différents",
          "Comparer des taux d'inflation ou de croissance",
        ],
      }
    },
  ],
};
