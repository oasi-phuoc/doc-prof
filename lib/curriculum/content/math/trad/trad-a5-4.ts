import type { SubmoduleTrad } from "./trad-types";

const S = (fr: string, en: string, ar: string, fa: string, ti: string, uk: string, pt: string, so: string, tr: string, ps: string) =>
  ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

export const TRAD_A5_4: SubmoduleTrad = {
  submoduleId: "A5-4",
  title: S(
    "Addition et soustraction de décimaux",
    "Adding and subtracting decimals",
    "جمع وطرح الأعداد العشرية",
    "جمع و تفریق اعداد اعشاری",
    "ዲሲማል ቁጽርታት ምድማርን ምጉዳልን",
    "Додавання й віднімання десяткових чисел",
    "Adição e subtração de números decimais",
    "Isku darka iyo kala jarka tirooyinka tobanle",
    "Ondalık sayılarda toplama ve çıkarma",
    "د اعشاري عددونو جمع او تفریق"
  ),
  blocks: [
    // add_sub_toggle_cards — interactive step card, no block-level translation
    {},
  ],
};
