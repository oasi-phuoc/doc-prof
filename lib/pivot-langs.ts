export const PIVOT_LANGS = [
  { code: "sq",  label: "Shqip",       labelFr: "Albanais" },
  { code: "en",  label: "English",     labelFr: "Anglais" },
  { code: "ar",  label: "العربية",     labelFr: "Arabe" },
  { code: "am",  label: "አማርኛ",        labelFr: "Amharique" },
  { code: "prs", label: "دری",         labelFr: "Dari" },
  { code: "es",  label: "Español",     labelFr: "Espagnol" },
  { code: "fr",  label: "Français",    labelFr: "Français" },
  { code: "it",  label: "Italiano",    labelFr: "Italien" },
  { code: "fa",  label: "فارسی",       labelFr: "Persan" },
  { code: "ps",  label: "پښتو",        labelFr: "Pachto" },
  { code: "pt",  label: "Português",   labelFr: "Portugais" },
  { code: "ru",  label: "Русский",     labelFr: "Russe" },
  { code: "so",  label: "Soomaali",    labelFr: "Somali" },
  { code: "ti",  label: "ትግርኛ",       labelFr: "Tigrinya" },
  { code: "tr",  label: "Türkçe",      labelFr: "Turc" },
  { code: "uk",  label: "Українська",  labelFr: "Ukrainien" },
] as const;

export type PivotCode = (typeof PIVOT_LANGS)[number]["code"];

export function isPivotCode(
  value: string | null | undefined
): value is PivotCode {
  if (value == null || value === "") return false;
  return PIVOT_LANGS.some((l) => l.code === value);
}

/** Langues pivot à affichage de droite à gauche (arabe, persan, pachto, dari). */
const RTL_PIVOT_CODES = new Set<PivotCode>(["ar", "fa", "ps", "prs"]);

export function isRtlPivotLang(code: string | null | undefined): boolean {
  return code != null && RTL_PIVOT_CODES.has(code as PivotCode);
}