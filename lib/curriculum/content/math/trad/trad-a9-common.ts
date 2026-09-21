import type { TradString } from "./trad-types";

export const S = (
  fr: string,
  en: string,
  ar: string,
  fa: string,
  ti: string,
  uk: string,
  pt: string,
  so: string,
  tr: string,
  ps: string,
): TradString => ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });

export const A = (
  fr: string[],
  en: string[],
  ar: string[],
  fa: string[],
  ti: string[],
  uk: string[],
  pt: string[],
  so: string[],
  tr: string[],
  ps: string[],
) => ({ fr, en, ar, fa, ti, uk, pt, so, tr, ps });
