import type { PivotCode } from "@/lib/pivot-langs";

export type LangCode = "fr" | PivotCode;

export type TradString = Partial<Record<LangCode, string>>;

export type BlockTrad = {
  text?: TradString;
  label?: TradString;
  items?: Partial<Record<LangCode, string[]>>;
  headers?: Partial<Record<LangCode, string[]>>;
  caption?: TradString;
};

export interface SubmoduleTrad {
  submoduleId: string;
  title: TradString;
  paragraphs?: Partial<Record<LangCode, string[]>>;
  blocks?: BlockTrad[];
  consignes?: Record<string, TradString>;
  readAloud?: {
    heading: TradString;
    legend: Array<{ swatch: string; label: TradString }>;
  };
}
