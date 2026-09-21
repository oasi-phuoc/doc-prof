import type { PivotCode } from "@/lib/pivot-langs";
import type { BlockTrad, SubmoduleTrad, TradString, LangCode } from "./trad-types";
import extraPivotDict from "./extra-pivot-dict.json";

export type ExtraPivotLang = "sq" | "am" | "prs" | "es" | "it" | "ru" | "pt" | "so" | "tr" | "ps";

const DICT = extraPivotDict as Record<string, Partial<Record<ExtraPivotLang, string>>>;

/** Traduction d'une consigne / phrase FR vers une langue pivot (dictionnaire des langues ajoutées). */
export function extraPivotText(fr: string | undefined, lang: PivotCode): string | undefined {
  if (!fr) return undefined;
  const row = DICT[fr];
  if (!row) return undefined;
  return row[lang as ExtraPivotLang];
}

export function enrichTradString(ts: TradString | undefined): TradString | undefined {
  if (!ts) return ts;
  const fr = ts.fr;
  if (!fr) return ts;
  const extra = DICT[fr];
  if (!extra) return ts;
  let changed = false;
  const out: TradString = { ...ts };
  for (const [lang, text] of Object.entries(extra)) {
    if (!text) continue;
    const key = lang as LangCode;
    if (!out[key]) {
      out[key] = text;
      changed = true;
    }
  }
  return changed ? out : ts;
}

function enrichLangArrays(
  items: Partial<Record<LangCode, string[]>> | undefined,
): Partial<Record<LangCode, string[]>> | undefined {
  if (!items?.fr) return items;
  const extraLangs: ExtraPivotLang[] = ["sq", "am", "prs", "es", "it", "ru", "pt", "so", "tr", "ps"];
  const out: Partial<Record<LangCode, string[]>> = { ...items };
  let changed = false;
  for (const lang of extraLangs) {
    const existing = out[lang];
    const filled: string[] = items.fr.map((fr, i) => {
      const prev = existing?.[i];
      if (prev) return prev;
      return DICT[fr]?.[lang] ?? fr;
    });
    if (filled.some((s, i) => s && s !== (existing?.[i] ?? ""))) {
      out[lang] = filled;
      changed = true;
    }
  }
  return changed ? out : items;
}

function enrichBlock(b: BlockTrad): BlockTrad {
  return {
    text: enrichTradString(b.text),
    label: enrichTradString(b.label),
    caption: enrichTradString(b.caption),
    items: enrichLangArrays(b.items),
    headers: enrichLangArrays(b.headers),
  };
}

export function enrichSubmoduleTrad(t: SubmoduleTrad): SubmoduleTrad {
  const consignes = t.consignes
    ? Object.fromEntries(
        Object.entries(t.consignes).map(([k, v]) => {
          const byKey = enrichTradString(v) ?? v;
          // consignes are often keyed by the French prompt itself
          const fromKey = extraPivotText(k, "sq") ? k : undefined;
          if (!fromKey) return [k, byKey];
          const extra: TradString = { ...byKey };
          for (const lang of ["sq", "am", "prs", "es", "it", "ru", "pt", "so", "tr", "ps"] as ExtraPivotLang[]) {
            if (!extra[lang]) {
              const hit = extraPivotText(k, lang) ?? extraPivotText(byKey.fr, lang);
              if (hit) extra[lang] = hit;
            }
          }
          return [k, extra];
        }),
      )
    : undefined;

  return {
    ...t,
    title: enrichTradString(t.title) ?? t.title,
    paragraphs: enrichLangArrays(t.paragraphs),
    blocks: t.blocks?.map(enrichBlock),
    consignes,
    readAloud: t.readAloud
      ? {
          heading: enrichTradString(t.readAloud.heading) ?? t.readAloud.heading,
          legend: t.readAloud.legend.map((l) => ({
            ...l,
            label: enrichTradString(l.label) ?? l.label,
          })),
        }
      : undefined,
  };
}
